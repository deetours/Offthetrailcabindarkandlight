import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/admin'
import { requireDashboardAccess } from '@/lib/pms/auth'
import { isMissingRelationError } from '@/lib/pms/api'

export async function GET() {
  const access = await requireDashboardAccess()
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  const serviceClient = getSupabaseServiceClient()

  try {
    const query = serviceClient
      .from('properties')
      .select('id, name, slug, region, city, state, status, cover_image_url')
      .order('created_at', { ascending: false })

    const scopedQuery =
      access.globalRole === 'superadmin' ||
      access.globalRole === 'brand_admin' ||
      access.globalRole === 'reservations_manager' ||
      access.globalRole === 'admin'
        ? query
        : query.in('id', access.managedPropertyIds.length ? access.managedPropertyIds : ['00000000-0000-0000-0000-000000000000'])

    const { data, error } = await scopedQuery
    if (error) {
      throw error
    }

    return NextResponse.json({ data: data || [] })
  } catch (error: any) {
    if (isMissingRelationError(error)) {
      const fallback = await serviceClient
        .from('stays')
        .select('id, name, location, status, image_url')
        .order('created_at', { ascending: false })

      return NextResponse.json({
        data: (fallback.data || []).map((stay) => ({
          id: stay.id,
          name: stay.name,
          region: stay.location,
          city: stay.location,
          status: stay.status,
          cover_image_url: stay.image_url,
          source: 'stays_fallback',
        })),
        migrationPending: true,
      })
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to load PMS properties' },
      { status: 500 },
    )
  }
}
