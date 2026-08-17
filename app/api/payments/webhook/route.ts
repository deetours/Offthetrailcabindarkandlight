import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { verifyRazorpayWebhookSignature } from '@/lib/pms/payments'
import { isMissingRelationError, migrationRequired } from '@/lib/pms/api'
import {
  confirmBookingPayment,
  failBookingPayment,
  fetchBookingPaymentBundle,
  markWebhookEventProcessed,
  recordWebhookEvent,
} from '@/lib/pms/booking-settlement'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 })
  }

  const valid = verifyRazorpayWebhookSignature({ rawBody, signature })
  if (!valid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)
  const serviceClient = getSupabaseServiceClient()

  const paymentEntity = event.payload?.payment?.entity
  const orderEntity = event.payload?.order?.entity
  const orderId = paymentEntity?.order_id || orderEntity?.id || null
  const paymentId = paymentEntity?.id || null
  const eventId = event?.payload?.payment?.entity?.id
    ? `${event.event}:${event.payload.payment.entity.id}`
    : event?.created_at
      ? `${event.event}:${event.created_at}`
      : null

  let webhookLogId: string | null = null

  try {
    const webhookLog = await recordWebhookEvent(serviceClient, {
      eventId,
      eventType: event.event,
      orderId,
      paymentId,
      payload: event,
    })

    webhookLogId = webhookLog.id

    if (webhookLog.duplicate) {
      return NextResponse.json({ received: true, duplicate: true })
    }

    if (!orderId) {
      if (webhookLogId) {
        await markWebhookEventProcessed(serviceClient, {
          id: webhookLogId,
          processed: true,
        })
      }
      return NextResponse.json({ received: true, ignored: true })
    }

    const { booking, payment } = await fetchBookingPaymentBundle(serviceClient, {
      orderId,
    })

    if (!booking) {
      if (webhookLogId) {
        await markWebhookEventProcessed(serviceClient, {
          id: webhookLogId,
          processed: false,
          processingError: `Booking not found for order ${orderId}`,
        })
      }
      return NextResponse.json({ error: 'Booking not found for order' }, { status: 404 })
    }

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      await confirmBookingPayment(serviceClient, {
        booking,
        payment,
        orderId,
        paymentId: paymentId || booking.razorpay_payment_id || '',
        source: 'webhook',
        eventType: event.event,
        paymentStatus: 'captured',
      })
    } else if (event.event === 'payment.authorized') {
      await confirmBookingPayment(serviceClient, {
        booking,
        payment,
        orderId,
        paymentId: paymentId || booking.razorpay_payment_id || '',
        source: 'webhook',
        eventType: event.event,
        paymentStatus: 'authorized',
      })
    } else if (event.event === 'payment.failed') {
      await failBookingPayment(serviceClient, {
        booking,
        payment,
        orderId,
        paymentId,
        source: 'webhook',
        eventType: event.event,
        errorDescription: paymentEntity?.error_description || null,
        releaseBookingStatus: 'hold',
      })
    } else if (event.event === 'refund.created' || event.event === 'refund.processed') {
      if (payment) {
        const refundStatus = event.event === 'refund.processed' ? 'refunded' : 'partially_refunded'

        const { error: paymentError } = await serviceClient
          .from('payments')
          .update({
            status: refundStatus,
          })
          .eq('id', payment.id)

        if (paymentError) throw paymentError

        const { error: bookingError } = await serviceClient
          .from('bookings')
          .update({
            payment_status: refundStatus,
            booking_status: event.event === 'refund.processed' ? 'refunded' : booking.booking_status,
            status: event.event === 'refund.processed' ? 'refunded' : booking.booking_status,
          })
          .eq('id', booking.id)

        if (bookingError) throw bookingError
      }
    }

    if (webhookLogId) {
      await markWebhookEventProcessed(serviceClient, {
        id: webhookLogId,
        processed: true,
      })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    if (webhookLogId) {
      try {
        await markWebhookEventProcessed(serviceClient, {
          id: webhookLogId,
          processed: false,
          processingError: error?.message || 'Failed to process webhook',
        })
      } catch {
        // Ignore logging failures while returning the original processing error.
      }
    }

    if (isMissingRelationError(error)) {
      return migrationRequired('Payments / payment webhook events')
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to process webhook' },
      { status: 500 },
    )
  }
}
