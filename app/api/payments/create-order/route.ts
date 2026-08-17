import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { createRazorpayOrder } from '@/lib/pms/payments'
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

  const { bookingId } = await request.json()
  if (!bookingId) {
    return NextResponse.json({ error: 'bookingId is required' }, { status: 400 })
  }

  const serviceClient = getSupabaseServiceClient()

  try {
    const { data: booking, error: bookingError } = await serviceClient
      .from('bookings')
      .select(
        'id, user_id, property_id, currency, total_amount, booking_status, payment_status, hold_expires_at, razorpay_order_id',
      )
      .eq('id', bookingId)
      .maybeSingle()

    if (bookingError) throw bookingError
    if (!booking || booking.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (!['hold', 'pending_payment'].includes(booking.booking_status)) {
      return NextResponse.json(
        { error: `Booking must be in hold state before payment. Current status: ${booking.booking_status}` },
        { status: 409 },
      )
    }

    const { data: hold, error: holdError } = await serviceClient
      .from('booking_holds')
      .select('id, status, hold_expires_at')
      .eq('booking_id', bookingId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (holdError) throw holdError
    if (!hold) {
      return NextResponse.json({ error: 'Active booking hold not found' }, { status: 409 })
    }

    if (new Date(hold.hold_expires_at).getTime() <= Date.now()) {
      await Promise.all([
        serviceClient
          .from('booking_holds')
          .update({ status: 'expired' })
          .eq('id', hold.id),
        serviceClient
          .from('bookings')
          .update({ booking_status: 'expired' })
          .eq('id', bookingId),
      ])

      return NextResponse.json({ error: 'Booking hold has expired' }, { status: 409 })
    }

    const existingPaymentResult = await serviceClient
      .from('payments')
      .select('id, amount, currency, razorpay_order_id, status')
      .eq('booking_id', bookingId)
      .in('status', ['created', 'authorized'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingPaymentResult.error) throw existingPaymentResult.error

    if (existingPaymentResult.data?.razorpay_order_id) {
      await serviceClient
        .from('bookings')
        .update({
          booking_status: 'pending_payment',
          payment_status: existingPaymentResult.data.status,
          razorpay_order_id: existingPaymentResult.data.razorpay_order_id,
        })
        .eq('id', bookingId)

      return NextResponse.json({
        data: {
          orderId: existingPaymentResult.data.razorpay_order_id,
          amount: Math.round(Number(existingPaymentResult.data.amount || 0) * 100),
          currency: existingPaymentResult.data.currency || booking.currency || 'INR',
          keyId: process.env.RAZORPAY_KEY_ID,
          reused: true,
        },
      })
    }

    const amount = Number(booking.total_amount || 0)
    if (amount <= 0) {
      return NextResponse.json({ error: 'Booking total amount must be greater than zero' }, { status: 400 })
    }

    const order = await createRazorpayOrder({
      amount,
      currency: booking.currency || 'INR',
      receipt: `offthetrail-${bookingId}`,
      notes: { bookingId },
    })

    const { error: paymentError } = await serviceClient.from('payments').insert({
      booking_id: bookingId,
      property_id: booking.property_id,
      amount,
      currency: booking.currency || 'INR',
      payment_gateway: 'razorpay',
      razorpay_order_id: order.id,
      status: 'created',
    })

    if (paymentError) throw paymentError

    const { error: bookingUpdateError } = await serviceClient
      .from('bookings')
      .update({
        razorpay_order_id: order.id,
        payment_status: 'created',
        booking_status: 'pending_payment',
      })
      .eq('id', bookingId)

    if (bookingUpdateError) throw bookingUpdateError

    return NextResponse.json({
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      return migrationRequired('Payments / booking holds')
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 },
    )
  }
}
