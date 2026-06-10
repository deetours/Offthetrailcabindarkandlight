import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { canAccessProperty, requireDashboardAccess } from '@/lib/pms/auth'
import { isMissingRelationError, migrationRequired } from '@/lib/pms/api'

export async function POST(request: Request) {
  const access = await requireDashboardAccess({
    allowedRoles: ['superadmin', 'brand_admin', 'property_owner', 'property_manager', 'housekeeping', 'admin'],
  })
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  const body = await request.json()
  const { property_id, room_id, title, due_date, assigned_to, status = 'pending' } = body

  if (!property_id || !title) {
    return NextResponse.json({ error: 'property_id and title are required' }, { status: 400 })
  }

  if (!canAccessProperty(access, property_id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const serviceClient = getSupabaseServiceClient()
    const { data, error } = await serviceClient
      .from('housekeeping_tasks')
      .insert({
        property_id,
        room_id,
        title,
        due_date,
        assigned_to,
        status,
        created_by: access.user.id,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      return migrationRequired('Housekeeping tasks')
    }
    return NextResponse.json({ error: error?.message || 'Failed to create housekeeping task' }, { status: 500 })
  }
}
