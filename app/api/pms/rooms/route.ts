import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { canAccessProperty, requireDashboardAccess } from '@/lib/pms/auth'
import { isMissingRelationError, migrationRequired } from '@/lib/pms/api'

export async function POST(request: Request) {
  const access = await requireDashboardAccess({
    allowedRoles: ['superadmin', 'brand_admin', 'reservations_manager', 'property_owner', 'property_manager', 'admin'],
  })
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  const body = await request.json()
  const { property_id, room_type_id, name, room_status = 'vacant_clean', capacity = 2 } = body

  if (!property_id || !name) {
    return NextResponse.json({ error: 'property_id and name are required' }, { status: 400 })
  }

  if (!canAccessProperty(access, property_id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const serviceClient = getSupabaseServiceClient()
    const { data, error } = await serviceClient
      .from('rooms')
      .insert({
        property_id,
        room_type_id,
        name,
        room_status,
        capacity,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      return migrationRequired('Rooms')
    }
    return NextResponse.json({ error: error?.message || 'Failed to create room' }, { status: 500 })
  }
}
