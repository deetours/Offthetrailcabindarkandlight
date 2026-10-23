import { RoomDef } from "@/components/landing-system/room-ledger"
import { getOffTheTrailWaNumber } from "@/components/ui/whatsapp-popup"

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

export interface EnquiryStayParams {
  checkIn: string
  checkOut: string
  rooms: RoomDef[]
  quantities: Record<string, number>
  propertyName?: string
  source?: string
}

export interface RoomEnquiryParams {
  roomName: string
  propertyName?: string
  price?: number
  recipientNumber?: string
  source?: string
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Parses an ISO date string (YYYY-MM-DD) into year, month, day components
 * completely immune to local / UTC timezone shifts.
 */
export function parseIsoDateParts(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr || typeof dateStr !== "string") return null
  const match = dateStr.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!match) return null

  const year = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)
  const day = parseInt(match[3], 10)

  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  return { year, month, day }
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into a clean, human-readable format: "DD MMM YYYY".
 * Example: "2026-11-15" -> "15 Nov 2026".
 * Guaranteed to not shift across day boundaries regardless of machine timezone.
 */
export function formatEnquiryDate(dateStr: string): string {
  const parts = parseIsoDateParts(dateStr)
  if (!parts) return dateStr

  const monthName = MONTH_NAMES[parts.month - 1]
  const dayPadded = String(parts.day).padStart(2, "0")
  return `${dayPadded} ${monthName} ${parts.year}`
}

/**
 * Calculates calendar nights between two ISO date strings using pure UTC midnight arithmetic.
 * Ensures difference is exact integer days without daylight savings or timezone drift.
 */
export function calculateCalendarNights(checkIn: string, checkOut: string): number {
  const p1 = parseIsoDateParts(checkIn)
  const p2 = parseIsoDateParts(checkOut)
  if (!p1 || !p2) return 0

  const utc1 = Date.UTC(p1.year, p1.month - 1, p1.day)
  const utc2 = Date.UTC(p2.year, p2.month - 1, p2.day)

  const diffMs = utc2 - utc1
  if (diffMs <= 0) return 0

  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Calculates total selected room count across all categories.
 */
export function calculateTotalRooms(quantities: Record<string, number>): number {
  return Object.values(quantities).reduce((acc, qty) => {
    return typeof qty === "number" && qty > 0 ? acc + qty : acc
  }, 0)
}

/**
 * Calculates estimated stay total based on room rates, quantities, and nights.
 * Formula: sum(room.price * quantity) * nights
 */
export function calculateStayEstimate(
  rooms: RoomDef[],
  quantities: Record<string, number>,
  nights: number
): number {
  const validNights = Math.max(nights, 0)
  if (validNights === 0) return 0

  const nightlyRate = rooms.reduce((acc, room) => {
    const qty = quantities[room.id] || 0
    return qty > 0 ? acc + room.price * qty : acc
  }, 0)

  return nightlyRate * validNights
}

/**
 * Validates whether the user's stay selection is ready to be converted into an enquiry.
 */
export function validateEnquirySelection(
  checkIn: string,
  checkOut: string,
  quantities: Record<string, number>
): ValidationResult {
  if (!checkIn) {
    return { isValid: false, error: "Please choose your check-in date." }
  }
  if (!checkOut) {
    return { isValid: false, error: "Please choose your check-out date." }
  }

  const nights = calculateCalendarNights(checkIn, checkOut)
  if (nights < 1) {
    return { isValid: false, error: "Check-out date must be at least 1 day after check-in." }
  }

  const totalRooms = calculateTotalRooms(quantities)
  if (totalRooms < 1) {
    return { isValid: false, error: "Please select at least 1 room category." }
  }

  return { isValid: true }
}

/**
 * Generates the standardized, structured WhatsApp enquiry message for Dalhousie Estate.
 */
export function buildDalhousieEnquiryMessage(params: EnquiryStayParams): string {
  const {
    checkIn,
    checkOut,
    rooms,
    quantities,
    propertyName = "Dalhousie Estate",
    source = "OFF THE TRAIL website"
  } = params

  const formattedCheckIn = formatEnquiryDate(checkIn)
  const formattedCheckOut = formatEnquiryDate(checkOut)
  const nights = calculateCalendarNights(checkIn, checkOut)
  const totalRooms = calculateTotalRooms(quantities)
  const totalAmount = calculateStayEstimate(rooms, quantities, nights)

  // Filter positive-quantity rooms only, preserving room order
  const roomLines = rooms
    .filter((room) => (quantities[room.id] || 0) > 0)
    .map((room) => `• ${room.name} × ${quantities[room.id]}`)

  const roomsText = roomLines.length > 0 ? roomLines.join("\n") : "• None selected"
  const nightsText = `${nights} night${nights === 1 ? "" : "s"}`

  return (
    `Hi OFF THE TRAIL! I'm interested in staying at ${propertyName}.\n\n` +
    `*My stay*\n` +
    `Check-in: ${formattedCheckIn}\n` +
    `Check-out: ${formattedCheckOut}\n` +
    `Duration: ${nightsText}\n\n` +
    `*Rooms selected*\n` +
    `${roomsText}\n\n` +
    `Total rooms: ${totalRooms}\n` +
    `Estimated stay total: ₹${totalAmount.toLocaleString("en-IN")} (incl. breakfast)\n\n` +
    `I'd like to check availability and continue with the booking.\n\n` +
    `Source: ${source}\n` +
    `Property: ${propertyName}\n\n` +
    `Please help me with the next steps.`
  )
}

/**
 * Compiles the complete WhatsApp click-to-chat URL with the formatted enquiry message.
 */
export function buildDalhousieWhatsAppUrl(
  params: EnquiryStayParams,
  recipientNumber?: string
): string {
  const targetNumber = (recipientNumber ? recipientNumber.replace(/[^0-9]/g, "") : "") || getOffTheTrailWaNumber()
  const message = buildDalhousieEnquiryMessage(params)
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`
}

/**
 * Generates a secondary general concierge WhatsApp inquiry URL when dates/rooms are not yet chosen.
 */
export function buildGeneralPropertyWhatsAppUrl(
  propertyName: string = "Dalhousie Estate",
  recipientNumber?: string
): string {
  const targetNumber = (recipientNumber ? recipientNumber.replace(/[^0-9]/g, "") : "") || getOffTheTrailWaNumber()
  const message = `Hello OFF THE TRAIL! I have an inquiry about staying at ${propertyName}. Could you help me with a few questions?`
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`
}

/**
 * Generates the standardized WhatsApp enquiry message for a specific room category.
 */
export function buildRoomEnquiryMessage(params: RoomEnquiryParams): string {
  const {
    roomName,
    propertyName = "Dalhousie Estate",
    source = "OFF THE TRAIL website",
  } = params

  return (
    `Hi OFF THE TRAIL! I'm interested in the ${roomName} at ${propertyName}.\n\n` +
    `Could you please check the current availability and rates and help me with the next steps?\n\n` +
    `Property: ${propertyName}\n` +
    `Room: ${roomName}\n` +
    `Source: ${source}`
  )
}

/**
 * Compiles the complete WhatsApp click-to-chat URL with the formatted room enquiry message.
 */
export function buildRoomEnquiryWhatsAppUrl(
  params: RoomEnquiryParams,
  recipientNumber?: string
): string {
  const targetNumber =
    (recipientNumber ? recipientNumber.replace(/[^0-9]/g, "") : "") ||
    (params.recipientNumber ? params.recipientNumber.replace(/[^0-9]/g, "") : "") ||
    getOffTheTrailWaNumber()
  const message = buildRoomEnquiryMessage(params)
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`
}
