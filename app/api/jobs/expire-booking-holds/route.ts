import { NextResponse } from 'next/server'
import { getSupabaseServiceClient, requireAdminAccess } from '@/lib/supabase/admin'
import { isMissingRelationError, migrationRequired } from '@/lib/pms/api'
import { expireActiveBookingHold } from '@/lib/pms/booking-settlement'

async function authorizeJob(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  const providedSecret =
    request.headers.get('x-cron-secret') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  if (cronSecret && providedSecret === cronSecret) {
    return { allowed: true, actorUserId: null as string | null }
  }

  const access = await requireAdminAccess()
  if ('error' in access) {
    return { allowed: false, response: NextResponse.json({ error: access.error }, { status: access.status }) }
  }

  return { allowed: true, actorUserId: access.user.id }
}

export async function POST(request: Request) {
  const authorization = await authorizeJob(request)
  if (!authorization.allowed) {
    return authorization.response
  }

  const serviceClient = getSupabaseServiceClient()

  try {
    const now = new Date().toISOString()
    const { data: expiredHolds, error } = await serviceClient
      .from('booking_holds')
      .select('booking_id')
      .eq('status', 'active')
      .lt('hold_expires_at', now)

    if (error) throw error

    const uniqueBookingIds = Array.from(
      new Set((expiredHolds || []).map((hold: { booking_id: string }) => hold.booking_id)),
    )

    const results = []
    for (const bookingId of uniqueBookingIds) {
      const result = await expireActiveBookingHold(serviceClient, {
        bookingId,
        actorUserId: authorization.actorUserId,
      })
      results.push(result)
    }

    return NextResponse.json({
      processed: uniqueBookingIds.length,
      expired: results.filter((result) => result.expired).length,
      skipped: results.filter((result) => !result.expired).length,
      results,
    })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      return migrationRequired('Booking holds')
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to expire booking holds' },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  return POST(request)
}
