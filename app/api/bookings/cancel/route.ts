import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'

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
  const { data: existing } = await serviceClient
    .from('bookings')
    .select('id, user_id')
    .eq('id', bookingId)
    .maybeSingle()

  if (!existing || existing.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updates = {
    booking_status: 'cancelled',
    status: 'cancelled',
  }

  const { data, error } = await serviceClient
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
