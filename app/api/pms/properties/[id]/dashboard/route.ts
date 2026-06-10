import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { canAccessProperty, requireDashboardAccess } from '@/lib/pms/auth'
import { isMissingRelationError } from '@/lib/pms/api'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireDashboardAccess()
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  const { id } = await params
  if (!canAccessProperty(access, id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const serviceClient = getSupabaseServiceClient()

  try {
    const [propertyResult, bookingsResult, roomsResult, tasksResult] = await Promise.all([
      serviceClient
        .from('properties')
        .select('id, name, slug, region, city, state, status, cover_image_url')
        .eq('id', id)
        .single(),
      serviceClient
        .from('bookings')
        .select('id, customer_name, check_in, check_out, booking_status, payment_status, total_amount')
        .eq('property_id', id)
        .order('created_at', { ascending: false })
        .limit(8),
      serviceClient
        .from('rooms')
        .select('id, room_status')
        .eq('property_id', id),
      serviceClient
        .from('housekeeping_tasks')
        .select('id, status')
        .eq('property_id', id),
    ])

    if (propertyResult.error) {
      throw propertyResult.error
    }

    const bookings = bookingsResult.data || []
    const rooms = roomsResult.data || []
    const tasks = tasksResult.data || []

    return NextResponse.json({
      data: {
        property: propertyResult.data,
        totals: {
          activeBookings: bookings.filter((booking) =>
            ['confirmed', 'checked_in', 'pending_payment'].includes(booking.booking_status),
          ).length,
          pendingArrivals: bookings.filter((booking) => booking.booking_status === 'confirmed').length,
          occupiedRooms: rooms.filter((room) => room.room_status === 'occupied').length,
          housekeepingPending: tasks.filter((task) => task.status !== 'done').length,
          todayRevenue: bookings.reduce(
            (sum, booking) => sum + Number(booking.total_amount || 0),
            0,
          ),
        },
        recentBookings: bookings,
      },
    })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      const [stayResult, bookingsResult] = await Promise.all([
        serviceClient
          .from('stays')
          .select('id, name, location, status, image_url')
          .eq('id', id)
          .maybeSingle(),
        serviceClient
          .from('bookings')
          .select('id, created_at, status, payment_status, total_amount')
          .eq('stay_id', id)
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      return NextResponse.json({
        data: {
          property: stayResult.data
            ? {
                id: stayResult.data.id,
                name: stayResult.data.name,
                region: stayResult.data.location,
                status: stayResult.data.status,
                cover_image_url: stayResult.data.image_url,
                source: 'stays_fallback',
              }
            : null,
          totals: {
            activeBookings: (bookingsResult.data || []).length,
            pendingArrivals: 0,
            occupiedRooms: 0,
            housekeepingPending: 0,
            todayRevenue: (bookingsResult.data || []).reduce(
              (sum, booking) => sum + Number(booking.total_amount || 0),
              0,
            ),
          },
          recentBookings: bookingsResult.data || [],
        },
        migrationPending: true,
      })
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to load property dashboard' },
      { status: 500 },
    )
  }
}
