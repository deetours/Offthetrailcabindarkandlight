import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { isMissingRelationError } from '@/lib/pms/api'
import { calculateAvailability } from '@/lib/pms/booking-flow'

function diffInNights(from: string, to: string) {
  const start = new Date(from)
  const end = new Date(to)
  const diff = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000))
  return diff
}

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = await createSupabaseServerClient()
  const serviceClient = getSupabaseServiceClient()

  try {
    const availability = await calculateAvailability(serviceClient, body)

    return NextResponse.json({
      data: {
        productType: availability.productType,
        currency: availability.quote.currency,
        subtotalAmount: availability.quote.subtotalAmount,
        taxesAmount: availability.quote.taxesAmount,
        discountAmount: 0,
        totalAmount: availability.quote.totalAmount,
        inventoryStatus: availability.available ? 'available' : 'sold_out',
        availableQuantity: availability.inventory.availableQuantity,
        requestedQuantity: availability.inventory.requestedQuantity,
        reason: availability.reason,
        lineItems: availability.quote.lineItems,
        bookingContext: availability.bookingContext,
      },
    })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      const { productType, stayId, from, to } = body

      if (productType === 'stay') {
        const stayResult = await supabase
          .from('stays')
          .select('id, name, price')
          .eq('id', stayId)
          .maybeSingle()
        const nights = diffInNights(from, to)
        const subtotal = Number(stayResult.data?.price || 0) * nights
        const taxes = subtotal * 0.12

        return NextResponse.json({
          data: {
            productType,
            currency: 'INR',
            subtotalAmount: subtotal,
            taxesAmount: taxes,
            discountAmount: 0,
            totalAmount: subtotal + taxes,
            inventoryStatus: 'available',
            migrationPending: true,
            lineItems: [
              {
                label: `${stayResult.data?.name || 'Stay'} x ${nights} night(s)`,
                amount: subtotal,
                quantity: nights,
              },
            ],
          },
        })
      }
    }

    return NextResponse.json({ error: error?.message || 'Failed to create quote' }, { status: 500 })
  }
}
