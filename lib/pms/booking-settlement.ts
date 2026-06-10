import { isMissingRelationError } from './api'
import type { PaymentStatus } from './booking-flow'

type SupabaseClientLike = any

interface BookingRecord {
  id: string
  property_id?: string | null
  booking_status?: string | null
  payment_status?: string | null
  hold_expires_at?: string | null
  razorpay_order_id?: string | null
  razorpay_payment_id?: string | null
}

interface PaymentRecord {
  id: string
  booking_id: string
  property_id?: string | null
  status?: string | null
  razorpay_order_id?: string | null
  razorpay_payment_id?: string | null
}

async function safeInsertAuditLog(
  serviceClient: SupabaseClientLike,
  args: {
    actorUserId?: string | null
    propertyId?: string | null
    entityType: string
    entityId: string
    action: string
    payload: Record<string, unknown>
  },
) {
  try {
    await serviceClient.from('audit_logs').insert({
      actor_user_id: args.actorUserId ?? null,
      property_id: args.propertyId ?? null,
      entity_type: args.entityType,
      entity_id: args.entityId,
      action: args.action,
      payload: args.payload,
    })
  } catch (error: any) {
    if (!isMissingRelationError(error)) {
      throw error
    }
  }
}

export async function fetchBookingPaymentBundle(
  serviceClient: SupabaseClientLike,
  args: {
    bookingId?: string
    orderId?: string
  },
) {
  let booking: BookingRecord | null = null
  let payment: PaymentRecord | null = null

  if (args.bookingId) {
    const bookingResult = await serviceClient
      .from('bookings')
      .select(
        'id, property_id, booking_status, payment_status, hold_expires_at, razorpay_order_id, razorpay_payment_id',
      )
      .eq('id', args.bookingId)
      .maybeSingle()

    if (bookingResult.error) throw bookingResult.error
    booking = bookingResult.data
  }

  if (args.orderId) {
    const paymentResult = await serviceClient
      .from('payments')
      .select('id, booking_id, property_id, status, razorpay_order_id, razorpay_payment_id')
      .eq('razorpay_order_id', args.orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (paymentResult.error) throw paymentResult.error
    payment = paymentResult.data

    if (!booking && payment?.booking_id) {
      const bookingResult = await serviceClient
        .from('bookings')
        .select(
          'id, property_id, booking_status, payment_status, hold_expires_at, razorpay_order_id, razorpay_payment_id',
        )
        .eq('id', payment.booking_id)
        .maybeSingle()

      if (bookingResult.error) throw bookingResult.error
      booking = bookingResult.data
    }
  }

  return { booking, payment }
}

export async function confirmBookingPayment(
  serviceClient: SupabaseClientLike,
  args: {
    booking: BookingRecord
    payment: PaymentRecord | null
    orderId: string
    paymentId: string
    signature?: string | null
    actorUserId?: string | null
    source: 'verify' | 'webhook'
    eventType?: string | null
    paymentStatus?: PaymentStatus
  },
) {
  const paymentStatus = args.paymentStatus ?? 'captured'
  const alreadyConfirmed = args.booking.booking_status === 'confirmed'
  const now = new Date().toISOString()

  if (args.payment) {
    const paymentUpdate: Record<string, unknown> = {
      razorpay_payment_id: args.paymentId,
      status: paymentStatus,
    }

    if (args.signature) {
      paymentUpdate.razorpay_signature = args.signature
    }

    const { error: paymentError } = await serviceClient
      .from('payments')
      .update(paymentUpdate)
      .eq('id', args.payment.id)

    if (paymentError) throw paymentError
  }

  if (!alreadyConfirmed) {
    const { error: bookingError } = await serviceClient
      .from('bookings')
      .update({
        payment_status: paymentStatus,
        booking_status: 'confirmed',
        razorpay_order_id: args.orderId,
        razorpay_payment_id: args.paymentId,
        status: 'confirmed',
        confirmed_at: now,
      })
      .eq('id', args.booking.id)

    if (bookingError) throw bookingError
  }

  const { error: holdError } = await serviceClient
    .from('booking_holds')
    .update({
      status: 'converted',
      updated_at: now,
    })
    .eq('booking_id', args.booking.id)
    .eq('status', 'active')

  if (holdError && !isMissingRelationError(holdError)) {
    throw holdError
  }

  await safeInsertAuditLog(serviceClient, {
    actorUserId: args.actorUserId ?? null,
    propertyId: args.booking.property_id ?? args.payment?.property_id ?? null,
    entityType: 'booking',
    entityId: args.booking.id,
    action: alreadyConfirmed ? 'booking.payment_confirmed_duplicate' : 'booking.payment_confirmed',
    payload: {
      source: args.source,
      eventType: args.eventType ?? null,
      orderId: args.orderId,
      paymentId: args.paymentId,
      paymentStatus,
    },
  })

  return {
    bookingId: args.booking.id,
    alreadyConfirmed,
    paymentStatus,
  }
}

export async function failBookingPayment(
  serviceClient: SupabaseClientLike,
  args: {
    booking: BookingRecord
    payment: PaymentRecord | null
    orderId: string
    paymentId?: string | null
    actorUserId?: string | null
    source: 'webhook' | 'job'
    eventType?: string | null
    errorDescription?: string | null
    releaseBookingStatus?: 'hold' | 'expired' | 'pending_payment'
  },
) {
  const bookingStatus = args.releaseBookingStatus ?? 'hold'
  const now = new Date().toISOString()

  if (args.payment) {
    const { error: paymentError } = await serviceClient
      .from('payments')
      .update({
        razorpay_payment_id: args.paymentId ?? args.payment.razorpay_payment_id ?? null,
        status: 'failed',
        error_description: args.errorDescription ?? null,
      })
      .eq('id', args.payment.id)

    if (paymentError) throw paymentError
  }

  const { error: bookingError } = await serviceClient
    .from('bookings')
    .update({
      payment_status: 'failed',
      booking_status: bookingStatus,
      status: bookingStatus === 'expired' ? 'expired' : args.booking.booking_status ?? 'hold',
    })
    .eq('id', args.booking.id)

  if (bookingError) throw bookingError

  if (bookingStatus === 'expired') {
    const { error: holdError } = await serviceClient
      .from('booking_holds')
      .update({
        status: 'expired',
        updated_at: now,
      })
      .eq('booking_id', args.booking.id)
      .eq('status', 'active')

    if (holdError && !isMissingRelationError(holdError)) {
      throw holdError
    }
  }

  await safeInsertAuditLog(serviceClient, {
    actorUserId: args.actorUserId ?? null,
    propertyId: args.booking.property_id ?? args.payment?.property_id ?? null,
    entityType: 'booking',
    entityId: args.booking.id,
    action: 'booking.payment_failed',
    payload: {
      source: args.source,
      eventType: args.eventType ?? null,
      orderId: args.orderId,
      paymentId: args.paymentId ?? null,
      bookingStatus,
      errorDescription: args.errorDescription ?? null,
    },
  })

  return {
    bookingId: args.booking.id,
    bookingStatus,
  }
}

export async function expireActiveBookingHold(
  serviceClient: SupabaseClientLike,
  args: {
    bookingId: string
    actorUserId?: string | null
  },
) {
  const { booking, payment } = await fetchBookingPaymentBundle(serviceClient, {
    bookingId: args.bookingId,
  })

  if (!booking) {
    return { expired: false, reason: 'booking_not_found' as const }
  }

  if (booking.booking_status === 'confirmed' || booking.payment_status === 'captured') {
    return { expired: false, reason: 'already_confirmed' as const }
  }

  const now = new Date().toISOString()

  const { error: holdError } = await serviceClient
    .from('booking_holds')
    .update({
      status: 'expired',
      updated_at: now,
    })
    .eq('booking_id', booking.id)
    .eq('status', 'active')

  if (holdError && !isMissingRelationError(holdError)) {
    throw holdError
  }

  const { error: bookingError } = await serviceClient
    .from('bookings')
    .update({
      booking_status: 'expired',
      payment_status:
        booking.payment_status === 'captured' ? booking.payment_status : 'failed',
      status: 'expired',
    })
    .eq('id', booking.id)

  if (bookingError) throw bookingError

  await safeInsertAuditLog(serviceClient, {
    actorUserId: args.actorUserId ?? null,
    propertyId: booking.property_id ?? payment?.property_id ?? null,
    entityType: 'booking',
    entityId: booking.id,
    action: 'booking.hold_expired',
    payload: {
      paymentStatus: booking.payment_status ?? null,
    },
  })

  return { expired: true, bookingId: booking.id }
}

export async function recordWebhookEvent(
  serviceClient: SupabaseClientLike,
  args: {
    provider?: string
    eventId?: string | null
    eventType: string
    orderId?: string | null
    paymentId?: string | null
    payload: Record<string, unknown>
  },
) {
  const provider = args.provider ?? 'razorpay'

  const existing = args.eventId
    ? await serviceClient
        .from('payment_webhook_events')
        .select('id, processed')
        .eq('provider', provider)
        .eq('event_id', args.eventId)
        .maybeSingle()
    : null

  if (existing?.error && !isMissingRelationError(existing.error)) {
    throw existing.error
  }

  if (existing?.data) {
    return {
      duplicate: true,
      id: existing.data.id,
      processed: existing.data.processed,
    }
  }

  const insertResult = await serviceClient
    .from('payment_webhook_events')
    .insert({
      provider,
      event_id: args.eventId ?? null,
      event_type: args.eventType,
      razorpay_order_id: args.orderId ?? null,
      razorpay_payment_id: args.paymentId ?? null,
      payload: args.payload,
      processed: false,
    })
    .select('id, processed')
    .single()

  if (insertResult.error) throw insertResult.error

  return {
    duplicate: false,
    id: insertResult.data.id,
    processed: insertResult.data.processed,
  }
}

export async function markWebhookEventProcessed(
  serviceClient: SupabaseClientLike,
  args: {
    id: string
    processed: boolean
    processingError?: string | null
  },
) {
  const { error } = await serviceClient
    .from('payment_webhook_events')
    .update({
      processed: args.processed,
      processing_error: args.processingError ?? null,
    })
    .eq('id', args.id)

  if (error && !isMissingRelationError(error)) {
    throw error
  }
}
