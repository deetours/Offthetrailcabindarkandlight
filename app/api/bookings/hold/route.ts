import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { calculateAvailability, normalizeAvailabilityRequest } from '@/lib/pms/booking-flow'
import { isMissingRelationError, migrationRequired } from '@/lib/pms/api'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const serviceClient = getSupabaseServiceClient()

  try {
    const normalized = normalizeAvailabilityRequest(body)
    const availability = await calculateAvailability(serviceClient, body)

    if (!availability.available) {
      return NextResponse.json(
        {
          error: availability.reason || 'Requested inventory is no longer available',
          availability,
        },
        { status: 409 },
      )
    }

    const holdExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    const quantity = normalized.productType === 'trip' ? normalized.travelers : normalized.quantity
    const guestsCount =
      normalized.productType === 'trip' ? normalized.travelers : normalized.guestsCount

    const bookingPayload: Record<string, unknown> = {
      user_id: session.user.id,
      product_type: normalized.productType,
      booking_type: normalized.productType,
      property_id: availability.propertyId,
      stay_id: normalized.stayId ?? null,
      room_type_id: normalized.roomTypeId ?? null,
      trip_id: normalized.tripId ?? null,
      trip_departure_id: normalized.tripDepartureId ?? null,
      check_in: normalized.from ?? null,
      check_out: normalized.to ?? null,
      guests_count: guestsCount,
      guest_count: guestsCount,
      quantity,
      subtotal_amount: availability.quote.subtotalAmount,
      tax_amount: availability.quote.taxesAmount,
      total_amount: availability.quote.totalAmount,
      currency: availability.quote.currency,
      booking_status: 'hold',
      payment_status: 'created',
      hold_expires_at: holdExpiresAt,
      quote_snapshot: {
        quote: availability.quote,
        inventory: availability.inventory,
        bookingContext: availability.bookingContext,
      },
      customer_name: body?.customerName ?? null,
      customer_email: body?.customerEmail ?? null,
      customer_phone: body?.customerPhone ?? null,
    }

    const { data: booking, error: bookingError } = await serviceClient
      .from('bookings')
      .insert(bookingPayload)
      .select()
      .single()

    if (bookingError) throw bookingError

    const holdPayload = {
      booking_id: booking.id,
      product_type: normalized.productType,
      property_id: availability.propertyId,
      room_type_id: normalized.roomTypeId ?? null,
      trip_id: normalized.tripId ?? null,
      trip_departure_id: normalized.tripDepartureId ?? null,
      quantity,
      check_in: normalized.from ?? null,
      check_out: normalized.to ?? null,
      status: 'active',
      hold_expires_at: holdExpiresAt,
    }

    const { error: holdError } = await serviceClient.from('booking_holds').insert(holdPayload)
    if (holdError) throw holdError

    return NextResponse.json(
      {
        data: booking,
        holdExpiresAt,
        quote: availability.quote,
        inventory: availability.inventory,
      },
      { status: 201 },
    )
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      return migrationRequired('Booking holds')
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to create booking hold' },
      { status: 500 },
    )
  }
}
