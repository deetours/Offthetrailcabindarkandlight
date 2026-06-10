import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { verifyRazorpaySignature } from '@/lib/pms/payments'
import { isMissingRelationError, migrationRequired } from '@/lib/pms/api'
import {
  confirmBookingPayment,
  fetchBookingPaymentBundle,
} from '@/lib/pms/booking-settlement'

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
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

  if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing Razorpay verification payload' }, { status: 400 })
  }

  const valid = verifyRazorpaySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  })

  if (!valid) {
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
  }

  const serviceClient = getSupabaseServiceClient()

  try {
    const { booking, payment } = await fetchBookingPaymentBundle(serviceClient, {
      bookingId,
      orderId: razorpay_order_id,
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const ownerCheck = await serviceClient
      .from('bookings')
      .select('user_id')
      .eq('id', bookingId)
      .maybeSingle()

    if (ownerCheck.error) throw ownerCheck.error
    if (!ownerCheck.data || ownerCheck.data.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (
      booking.hold_expires_at &&
      new Date(booking.hold_expires_at).getTime() <= Date.now() &&
      booking.booking_status !== 'confirmed'
    ) {
      return NextResponse.json({ error: 'Booking hold has expired' }, { status: 409 })
    }

    const result = await confirmBookingPayment(serviceClient, {
      booking,
      payment,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      actorUserId: session.user.id,
      source: 'verify',
      paymentStatus: 'captured',
    })

    const refreshedBooking = await serviceClient
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (refreshedBooking.error) throw refreshedBooking.error

    return NextResponse.json({
      data: refreshedBooking.data,
      verified: true,
      alreadyConfirmed: result.alreadyConfirmed,
    })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      return migrationRequired('Payments / booking holds')
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to verify payment' },
      { status: 500 },
    )
  }
}
