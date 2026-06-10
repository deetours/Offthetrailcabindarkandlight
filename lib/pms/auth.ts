import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { GLOBAL_ROLES, type PropertyMembership, type Role } from './types'

const GLOBAL_ROLE_SET = new Set<string>(GLOBAL_ROLES)
const DASHBOARD_ROLES = new Set<Role>([
  'superadmin',
  'brand_admin',
  'reservations_manager',
  'property_owner',
  'property_manager',
  'housekeeping',
  'finance',
  'support',
  'admin',
] as Role[])

function normalizeRole(role: string | null | undefined): Role | 'admin' | 'user' {
  if (!role) return 'user'
  if (role === 'admin' || role === 'user') return role
  if (GLOBAL_ROLE_SET.has(role)) return role as Role
  return 'user'
}

export interface AccessContext {
  user: {
    id: string
    email?: string
  }
  globalRole: Role | 'admin' | 'user'
  memberships: PropertyMembership[]
  managedPropertyIds: string[]
}

export async function getAccessContext(): Promise<
  | { error: 'Unauthorized'; status: 401 }
  | AccessContext
> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { error: 'Unauthorized', status: 401 }
  }

  const [{ data: profileData }, { data: userData }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).maybeSingle(),
    supabase.from('users').select('role').eq('id', user.id).maybeSingle(),
  ])

  const globalRole = normalizeRole(profileData?.role || userData?.role)
  let memberships: PropertyMembership[] = []

  try {
    const serviceClient = getSupabaseServiceClient()
    const { data } = await serviceClient
      .from('property_memberships')
      .select('id, user_id, organization_id, property_id, role, scope, status')
      .eq('user_id', user.id)
      .eq('status', 'active')

    memberships = (data || []) as PropertyMembership[]
  } catch {
    memberships = []
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    globalRole,
    memberships,
    managedPropertyIds: memberships
      .map((membership) => membership.property_id)
      .filter((propertyId): propertyId is string => Boolean(propertyId)),
  }
}

export async function requireDashboardAccess(options?: {
  allowedRoles?: Array<Role | 'admin'>
}) {
  const context = await getAccessContext()
  if ('error' in context) {
    return context
  }

  const allowedRoles = options?.allowedRoles
  const hasGlobalDashboardRole = DASHBOARD_ROLES.has(context.globalRole as Role)
  const hasMembership = context.memberships.length > 0

  if (allowedRoles?.length) {
    const allowedRoleSet = new Set(options?.allowedRoles)
    const membershipMatch = context.memberships.some((membership) =>
      allowedRoleSet.has(membership.role as Role | 'admin'),
    )

    if (!allowedRoleSet.has(context.globalRole as Role | 'admin') && !membershipMatch) {
      return { error: 'Forbidden', status: 403 as const }
    }
  } else if (!hasGlobalDashboardRole && !hasMembership) {
    return { error: 'Forbidden', status: 403 as const }
  }

  return context
}

export function canAccessProperty(context: AccessContext, propertyId: string) {
  if (
    context.globalRole === 'superadmin' ||
    context.globalRole === 'brand_admin' ||
    context.globalRole === 'reservations_manager' ||
    context.globalRole === 'admin'
  ) {
    return true
  }

  return context.managedPropertyIds.includes(propertyId)
}
