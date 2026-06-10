import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  DISCOVERY_COPY,
  NORTHEAST_DESTINATIONS,
  NORTHEAST_MOODS,
  NORTHEAST_STAY_TYPES,
  NORTHEAST_TRIP_TYPES,
} from '@/lib/pms/discovery-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') || '').trim().toLowerCase()

  const staticSuggestions = [
    ...DISCOVERY_COPY.suggestions,
    ...NORTHEAST_DESTINATIONS,
    ...NORTHEAST_STAY_TYPES,
    ...NORTHEAST_TRIP_TYPES,
    ...NORTHEAST_MOODS.map((mood) => mood.label),
  ]

  const filteredStatic = staticSuggestions
    .filter((item, index, items) => items.indexOf(item) === index)
    .filter((item) => !query || item.toLowerCase().includes(query))
    .slice(0, 8)

  const supabase = await createSupabaseServerClient()
  const [tripResult, stayResult] = await Promise.all([
    supabase
      .from('trips')
      .select('id, name, region')
      .eq('status', 'published')
      .limit(4),
    supabase
      .from('stays')
      .select('id, name, location')
      .eq('status', 'published')
      .limit(4),
  ])

  const liveSuggestions = [
    ...(tripResult.data || []).map((trip) => ({
      type: 'trip',
      value: trip.name,
      subtitle: trip.region,
      href: `/trips/${trip.id}`,
    })),
    ...(stayResult.data || []).map((stay) => ({
      type: 'stay',
      value: stay.name,
      subtitle: stay.location,
      href: `/stays/${stay.id}`,
    })),
  ].filter((item) => !query || item.value.toLowerCase().includes(query))

  return NextResponse.json({
    query,
    staticSuggestions: filteredStatic,
    liveSuggestions,
    moods: NORTHEAST_MOODS.filter(
      (mood) =>
        !query ||
        mood.label.toLowerCase().includes(query) ||
        mood.destinations.some((destination) =>
          destination.toLowerCase().includes(query),
        ),
    ).slice(0, 6),
  })
}
