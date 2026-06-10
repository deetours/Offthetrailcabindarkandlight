import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NORTHEAST_MOODS } from '@/lib/pms/discovery-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const productType = searchParams.get('type') || 'both'
  const query = (searchParams.get('q') || '').trim().toLowerCase()
  const region = (searchParams.get('region') || '').trim().toLowerCase()
  const mood = (searchParams.get('mood') || '').trim().toLowerCase()

  const supabase = await createSupabaseServerClient()
  const moodRecord = NORTHEAST_MOODS.find(
    (entry) =>
      entry.tag === mood ||
      entry.label.toLowerCase() === mood,
  )
  const moodDestinations = moodRecord?.destinations.map((destination) =>
    destination.toLowerCase(),
  )

  const result = {
    stays: [] as Array<Record<string, unknown>>,
    trips: [] as Array<Record<string, unknown>>,
  }

  if (productType === 'both' || productType === 'stay' || productType === 'stays') {
    const { data } = await supabase
      .from('stays')
      .select('id, name, tagline, location, price, image_url')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(24)

    result.stays = (data || [])
      .filter((stay) => {
        const haystack = `${stay.name || ''} ${stay.location || ''}`.toLowerCase()
        const regionMatch = !region || haystack.includes(region)
        const queryMatch = !query || haystack.includes(query)
        const moodMatch =
          !moodDestinations?.length ||
          moodDestinations.some((destination) => haystack.includes(destination))

        return regionMatch && queryMatch && moodMatch
      })
      .map((stay) => ({
        type: 'stay',
        id: stay.id,
        name: stay.name,
        subtitle: stay.location,
        price: stay.price,
        imageUrl: stay.image_url,
        href: `/stays/${stay.id}`,
      }))
  }

  if (productType === 'both' || productType === 'trip' || productType === 'trips') {
    const { data } = await supabase
      .from('trips')
      .select('id, name, tagline, region, terrain, price, image_url')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(24)

    result.trips = (data || [])
      .filter((trip) => {
        const haystack = `${trip.name || ''} ${trip.region || ''} ${trip.terrain || ''}`.toLowerCase()
        const regionMatch = !region || haystack.includes(region)
        const queryMatch = !query || haystack.includes(query)
        const moodMatch =
          !moodDestinations?.length ||
          moodDestinations.some((destination) => haystack.includes(destination))

        return regionMatch && queryMatch && moodMatch
      })
      .map((trip) => ({
        type: 'trip',
        id: trip.id,
        name: trip.name,
        subtitle: trip.region || trip.terrain,
        price: trip.price,
        imageUrl: trip.image_url,
        href: `/trips/${trip.id}`,
      }))
  }

  return NextResponse.json({
    query,
    productType,
    mood: moodRecord?.label || null,
    ...result,
  })
}
