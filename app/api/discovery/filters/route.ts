import { NextResponse } from 'next/server'
import {
  DISCOVERY_COPY,
  NORTHEAST_DESTINATIONS,
  NORTHEAST_MOODS,
  NORTHEAST_STAY_TYPES,
  NORTHEAST_TRIP_TYPES,
} from '@/lib/pms/discovery-data'

export async function GET() {
  return NextResponse.json({
    destinations: NORTHEAST_DESTINATIONS,
    moods: NORTHEAST_MOODS,
    stayTypes: NORTHEAST_STAY_TYPES,
    tripTypes: NORTHEAST_TRIP_TYPES,
    placeholders: DISCOVERY_COPY.placeholders,
  })
}
