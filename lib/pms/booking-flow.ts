import { z } from 'zod'

export const BOOKING_STATUSES = [
  'draft',
  'hold',
  'pending_payment',
  'confirmed',
  'cancelled',
  'checked_in',
  'checked_out',
  'no_show',
  'refunded',
  'expired',
] as const

export const PAYMENT_STATUSES = [
  'created',
  'authorized',
  'captured',
  'failed',
  'refunded',
  'partially_refunded',
] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]
export type ProductType = 'stay' | 'trip'

const availabilityRequestSchema = z.object({
  productType: z.enum(['stay', 'trip']),
  propertyId: z.string().optional(),
  stayId: z.string().optional(),
  roomTypeId: z.string().optional(),
  tripId: z.string().optional(),
  tripDepartureId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  travelers: z.coerce.number().int().positive().optional(),
  guestsCount: z.coerce.number().int().positive().optional(),
  quantity: z.coerce.number().int().positive().optional(),
  roomsCount: z.coerce.number().int().positive().optional(),
})

export interface NormalizedAvailabilityRequest {
  productType: ProductType
  propertyId?: string
  stayId?: string
  roomTypeId?: string
  tripId?: string
  tripDepartureId?: string
  from?: string
  to?: string
  travelers: number
  guestsCount: number
  quantity: number
}

export interface AvailabilityQuoteLineItem {
  label: string
  amount: number
  quantity?: number
}

export interface AvailabilityResult {
  available: boolean
  reason?: string
  productType: ProductType
  propertyId?: string | null
  quote: {
    currency: string
    subtotalAmount: number
    taxesAmount: number
    totalAmount: number
    lineItems: AvailabilityQuoteLineItem[]
  }
  inventory: {
    availableQuantity: number
    requestedQuantity: number
  }
  bookingContext: Record<string, unknown>
}

function diffInNights(from: string, to: string) {
  const start = new Date(`${from}T00:00:00.000Z`)
  const end = new Date(`${to}T00:00:00.000Z`)
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000))
}

function enumerateNights(from: string, to: string) {
  const nights = diffInNights(from, to)
  const dates: string[] = []

  for (let index = 0; index < nights; index += 1) {
    const cursor = new Date(`${from}T00:00:00.000Z`)
    cursor.setUTCDate(cursor.getUTCDate() + index)
    dates.push(cursor.toISOString().slice(0, 10))
  }

  return dates
}

function rangesOverlap(
  startA: string | null | undefined,
  endA: string | null | undefined,
  startB: string | null | undefined,
  endB: string | null | undefined,
) {
  if (!startA || !endA || !startB || !endB) return false
  return startA < endB && startB < endA
}

function dateFallsWithinRange(
  date: string,
  rangeStart: string | null | undefined,
  rangeEnd: string | null | undefined,
) {
  if (!rangeStart || !rangeEnd) return false
  return date >= rangeStart && date < rangeEnd
}

function isActiveHold(hold: { status?: string | null; hold_expires_at?: string | null }) {
  if (hold.status !== 'active') return false
  if (!hold.hold_expires_at) return false
  return new Date(hold.hold_expires_at).getTime() > Date.now()
}

function computeTax(subtotal: number, rate: number) {
  return Number((subtotal * rate).toFixed(2))
}

export function normalizeAvailabilityRequest(raw: unknown): NormalizedAvailabilityRequest {
  const parsed = availabilityRequestSchema.parse(raw)
  const travelers = parsed.travelers ?? 1

  return {
    productType: parsed.productType,
    propertyId: parsed.propertyId,
    stayId: parsed.stayId,
    roomTypeId: parsed.roomTypeId,
    tripId: parsed.tripId,
    tripDepartureId: parsed.tripDepartureId,
    from: parsed.from,
    to: parsed.to,
    travelers,
    guestsCount: parsed.guestsCount ?? travelers,
    quantity: parsed.roomsCount ?? parsed.quantity ?? 1,
  }
}

export async function calculateAvailability(
  serviceClient: any,
  rawRequest: unknown,
): Promise<AvailabilityResult> {
  const request = normalizeAvailabilityRequest(rawRequest)

  if (request.productType === 'stay') {
    if (!request.roomTypeId || !request.from || !request.to) {
      throw new Error('roomTypeId, from, and to are required for stay availability')
    }

    const roomTypeResult = await serviceClient
      .from('room_types')
      .select('id, name, property_id, base_price, inventory_count')
      .eq('id', request.roomTypeId)
      .maybeSingle()

    if (roomTypeResult.error) throw roomTypeResult.error
    if (!roomTypeResult.data) {
      return {
        available: false,
        reason: 'Room type not found',
        productType: 'stay',
        propertyId: request.propertyId ?? null,
        quote: {
          currency: 'INR',
          subtotalAmount: 0,
          taxesAmount: 0,
          totalAmount: 0,
          lineItems: [],
        },
        inventory: {
          availableQuantity: 0,
          requestedQuantity: request.quantity,
        },
        bookingContext: {
          roomTypeId: request.roomTypeId,
          checkIn: request.from,
          checkOut: request.to,
        },
      }
    }

    const propertyId = request.propertyId ?? roomTypeResult.data.property_id
    const inventoryDates = enumerateNights(request.from, request.to)
    const lastNight = inventoryDates[inventoryDates.length - 1]

    const [inventoryResult, blackoutResult, ratePlansResult, holdsResult, bookingsResult] =
      await Promise.all([
        serviceClient
          .from('room_inventory')
          .select('date, available_count, blocked_count')
          .eq('room_type_id', request.roomTypeId)
          .gte('date', request.from)
          .lt('date', request.to),
        serviceClient
          .from('blackout_dates')
          .select('room_type_id, from_date, to_date, reason')
          .eq('property_id', propertyId)
          .lte('from_date', lastNight)
          .gte('to_date', request.from),
        serviceClient
          .from('room_rate_plans')
          .select('name, nightly_rate, effective_from, effective_to')
          .eq('room_type_id', request.roomTypeId),
        serviceClient
          .from('booking_holds')
          .select('quantity, check_in, check_out, status, hold_expires_at')
          .eq('room_type_id', request.roomTypeId)
          .eq('status', 'active'),
        serviceClient
          .from('bookings')
          .select('quantity, check_in, check_out, booking_status')
          .eq('room_type_id', request.roomTypeId)
          .in('booking_status', ['confirmed', 'checked_in']),
      ])

    if (inventoryResult.error) throw inventoryResult.error
    if (blackoutResult.error) throw blackoutResult.error
    if (ratePlansResult.error) throw ratePlansResult.error
    if (holdsResult.error) throw holdsResult.error
    if (bookingsResult.error) throw bookingsResult.error

    const blackoutHit = (blackoutResult.data || []).find((entry: any) => {
      const roomTypeMatches = !entry.room_type_id || entry.room_type_id === request.roomTypeId
      return roomTypeMatches && rangesOverlap(request.from, request.to, entry.from_date, entry.to_date)
    })

    if (blackoutHit) {
      return {
        available: false,
        reason: blackoutHit.reason || 'Selected dates are blocked',
        productType: 'stay',
        propertyId,
        quote: {
          currency: 'INR',
          subtotalAmount: 0,
          taxesAmount: 0,
          totalAmount: 0,
          lineItems: [],
        },
        inventory: {
          availableQuantity: 0,
          requestedQuantity: request.quantity,
        },
        bookingContext: {
          roomTypeId: request.roomTypeId,
          checkIn: request.from,
          checkOut: request.to,
        },
      }
    }

    const inventoryByDate = new Map<string, { available_count: number; blocked_count: number }>()
    for (const row of inventoryResult.data || []) {
      inventoryByDate.set(row.date, {
        available_count: Number(row.available_count || 0),
        blocked_count: Number(row.blocked_count || 0),
      })
    }

    const activeHolds = (holdsResult.data || []).filter(isActiveHold)
    const confirmedBookings = bookingsResult.data || []

    let minAvailable = Number(roomTypeResult.data.inventory_count || 0)
    let subtotal = 0

    for (const date of inventoryDates) {
      const inventory = inventoryByDate.get(date)
      const baseAvailable = inventory
        ? Number(inventory.available_count || 0)
        : Number(roomTypeResult.data.inventory_count || 0)
      const blockedCount = Number(inventory?.blocked_count || 0)

      const heldCount = activeHolds.reduce((sum: number, hold: any) => {
        return dateFallsWithinRange(date, hold.check_in, hold.check_out)
          ? sum + Number(hold.quantity || 0)
          : sum
      }, 0)

      const bookedCount = confirmedBookings.reduce((sum: number, booking: any) => {
        return dateFallsWithinRange(date, booking.check_in, booking.check_out)
          ? sum + Number(booking.quantity || 1)
          : sum
      }, 0)

      const dateAvailable = Math.max(0, baseAvailable - blockedCount - heldCount - bookedCount)
      minAvailable = Math.min(minAvailable, dateAvailable)

      const matchingPlan = (ratePlansResult.data || []).find((plan: any) => {
        const startsBefore = !plan.effective_from || plan.effective_from <= date
        const endsAfter = !plan.effective_to || plan.effective_to >= date
        return startsBefore && endsAfter
      })
      const nightlyRate = Number(matchingPlan?.nightly_rate || roomTypeResult.data.base_price || 0)
      subtotal += nightlyRate * request.quantity
    }

    const taxes = computeTax(subtotal, 0.12)

    return {
      available: minAvailable >= request.quantity,
      reason: minAvailable >= request.quantity ? undefined : 'Not enough rooms available',
      productType: 'stay',
      propertyId,
      quote: {
        currency: 'INR',
        subtotalAmount: subtotal,
        taxesAmount: taxes,
        totalAmount: Number((subtotal + taxes).toFixed(2)),
        lineItems: [
          {
            label: `${roomTypeResult.data.name} x ${request.quantity} room(s)`,
            amount: subtotal,
            quantity: inventoryDates.length,
          },
        ],
      },
      inventory: {
        availableQuantity: Math.max(0, minAvailable),
        requestedQuantity: request.quantity,
      },
      bookingContext: {
        roomTypeId: request.roomTypeId,
        propertyId,
        checkIn: request.from,
        checkOut: request.to,
        guestsCount: request.guestsCount,
        quantity: request.quantity,
      },
    }
  }

  if (!request.tripId || !request.tripDepartureId) {
    throw new Error('tripId and tripDepartureId are required for trip availability')
  }

  const [tripResult, departureResult, tripInventoryResult, holdsResult, bookingsResult] =
    await Promise.all([
      serviceClient
        .from('trips')
        .select('id, name, price')
        .eq('id', request.tripId)
        .maybeSingle(),
      serviceClient
        .from('trip_departures')
        .select('id, property_id, start_date, end_date, capacity_total, capacity_reserved, status')
        .eq('id', request.tripDepartureId)
        .eq('trip_id', request.tripId)
        .maybeSingle(),
      serviceClient
        .from('trip_inventory')
        .select('seats_held, seats_reserved')
        .eq('trip_departure_id', request.tripDepartureId)
        .maybeSingle(),
      serviceClient
        .from('booking_holds')
        .select('quantity, status, hold_expires_at')
        .eq('trip_departure_id', request.tripDepartureId)
        .eq('status', 'active'),
      serviceClient
        .from('bookings')
        .select('quantity, booking_status')
        .eq('trip_departure_id', request.tripDepartureId)
        .in('booking_status', ['confirmed']),
    ])

  if (tripResult.error) throw tripResult.error
  if (departureResult.error) throw departureResult.error
  if (tripInventoryResult.error) throw tripInventoryResult.error
  if (holdsResult.error) throw holdsResult.error
  if (bookingsResult.error) throw bookingsResult.error

  if (!tripResult.data) {
    return {
      available: false,
      reason: 'Trip not found',
      productType: 'trip',
      propertyId: request.propertyId ?? null,
      quote: {
        currency: 'INR',
        subtotalAmount: 0,
        taxesAmount: 0,
        totalAmount: 0,
        lineItems: [],
      },
      inventory: {
        availableQuantity: 0,
        requestedQuantity: request.travelers,
      },
      bookingContext: {
        tripId: request.tripId,
        tripDepartureId: request.tripDepartureId,
      },
    }
  }

  if (!departureResult.data) {
    return {
      available: false,
      reason: 'Departure not found',
      productType: 'trip',
      propertyId: request.propertyId ?? null,
      quote: {
        currency: 'INR',
        subtotalAmount: 0,
        taxesAmount: 0,
        totalAmount: 0,
        lineItems: [],
      },
      inventory: {
        availableQuantity: 0,
        requestedQuantity: request.travelers,
      },
      bookingContext: {
        tripId: request.tripId,
        tripDepartureId: request.tripDepartureId,
      },
    }
  }

  const propertyId = request.propertyId ?? departureResult.data.property_id ?? null
  const heldSeats = (holdsResult.data || [])
    .filter(isActiveHold)
    .reduce((sum: number, hold: any) => sum + Number(hold.quantity || 0), 0)
  const confirmedSeats = (bookingsResult.data || []).reduce(
    (sum: number, booking: any) => sum + Number(booking.quantity || 1),
    0,
  )
  const reservedBaseline = Math.max(
    Number(departureResult.data.capacity_reserved || 0),
    Number(tripInventoryResult.data?.seats_reserved || 0),
    confirmedSeats,
  )
  const availableSeats = Math.max(
    0,
    Number(departureResult.data.capacity_total || 0) - reservedBaseline - heldSeats,
  )
  const tripPrice = Number(tripResult.data?.price || 0)
  const subtotal = tripPrice * request.travelers
  const taxes = computeTax(subtotal, 0.05)

  return {
    available:
      departureResult.data.status !== 'sold_out' &&
      departureResult.data.status !== 'cancelled' &&
      availableSeats >= request.travelers,
    reason: availableSeats >= request.travelers ? undefined : 'Not enough seats available',
    productType: 'trip',
    propertyId,
    quote: {
      currency: 'INR',
      subtotalAmount: subtotal,
      taxesAmount: taxes,
      totalAmount: Number((subtotal + taxes).toFixed(2)),
      lineItems: [
        {
          label: `${tripResult.data?.name || 'Trip'} x ${request.travelers} traveler(s)`,
          amount: subtotal,
          quantity: request.travelers,
        },
      ],
    },
    inventory: {
      availableQuantity: availableSeats,
      requestedQuantity: request.travelers,
    },
    bookingContext: {
      tripId: request.tripId,
      tripDepartureId: request.tripDepartureId,
      propertyId,
      quantity: request.travelers,
      guestsCount: request.travelers,
    },
  }
}
