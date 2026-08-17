import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { isMissingRelationError } from '@/lib/pms/api'
import { calculateAvailability } from '@/lib/pms/booking-flow'

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = await createSupabaseServerClient()
  const serviceClient = getSupabaseServiceClient()

  try {
    const availability = await calculateAvailability(serviceClient, body)

    return NextResponse.json({
      available: availability.available,
      reason: availability.reason,
      productType: availability.productType,
      quote: availability.quote,
      inventory: availability.inventory,
      bookingContext: availability.bookingContext,
    })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      const productType = body?.productType

      if (productType === 'stay') {
        const fallback = await supabase
          .from('stays')
          .select('id, status, capacity')
          .eq('id', body?.stayId)
          .eq('status', 'published')
          .maybeSingle()

        return NextResponse.json({
          available: Boolean(fallback.data),
          productType,
          migrationPending: true,
        })
      }

      if (productType === 'trip') {
        const fallback = await supabase
          .from('trips')
          .select('id, status, group_size')
          .eq('id', body?.tripId)
          .eq('status', 'published')
          .maybeSingle()

        return NextResponse.json({
          available: Boolean(fallback.data),
          productType,
          migrationPending: true,
        })
      }
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to check availability' },
      { status: 500 },
    )
  }
}
