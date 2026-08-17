import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { requireDashboardAccess } from '@/lib/pms/auth'
import { isMissingRelationError, migrationRequired } from '@/lib/pms/api'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardAccess({
    allowedRoles: ['superadmin', 'brand_admin', 'admin'],
  })
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  const { id } = await params
  const body = await request.json()
  const { role, status, property_id } = body

  try {
    const serviceClient = getSupabaseServiceClient()
    const { data, error } = await serviceClient
      .from('property_memberships')
      .update({
        role,
        status,
        property_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      return migrationRequired('Property memberships')
    }
    return NextResponse.json({ error: error?.message || 'Failed to update membership' }, { status: 500 })
  }
}
