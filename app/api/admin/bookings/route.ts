import { NextResponse } from 'next/server'
import { getSupabaseServiceClient, requireAdminAccess } from '@/lib/supabase/admin'

export async function GET() {
  const access = await requireAdminAccess()
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  try {
    const serviceClient = getSupabaseServiceClient()
    const { data, error } = await serviceClient
      .from('bookings')
      .select('*, trips(name, duration, region), stays(name, location, room_type)')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch bookings' }, { status: 500 })
  }
}
