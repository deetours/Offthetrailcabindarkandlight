import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { requireDashboardAccess } from '@/lib/pms/auth'
import { isMissingRelationError, migrationRequired } from '@/lib/pms/api'

export async function POST(request: Request) {
  const access = await requireDashboardAccess({
    allowedRoles: ['superadmin', 'brand_admin', 'reservations_manager', 'property_owner', 'property_manager', 'support', 'admin'],
  })
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  const body = await request.json()
  const { booking_id, property_id, room_id, notes } = body

  if (!booking_id || !property_id) {
    return NextResponse.json({ error: 'booking_id and property_id are required' }, { status: 400 })
  }

  try {
    const serviceClient = getSupabaseServiceClient()
    const { data, error } = await serviceClient
      .from('checkouts')
      .insert({
        booking_id,
        property_id,
        room_id,
        checked_out_by: access.user.id,
        notes,
      })
      .select()
      .single()

    if (error) throw error

    await serviceClient
      .from('bookings')
      .update({ booking_status: 'checked_out' })
      .eq('id', booking_id)

    if (room_id) {
      await serviceClient
        .from('rooms')
        .update({ room_status: 'vacant_dirty' })
        .eq('id', room_id)
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      return migrationRequired('Check-outs')
    }
    return NextResponse.json({ error: error?.message || 'Failed to create check-out' }, { status: 500 })
  }
}
