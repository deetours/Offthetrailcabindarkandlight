import { test, expect } from "@playwright/test"
import {
  formatEnquiryDate,
  calculateCalendarNights,
  calculateTotalRooms,
  calculateStayEstimate,
  validateEnquirySelection,
  buildDalhousieEnquiryMessage,
  buildDalhousieWhatsAppUrl,
  buildGeneralPropertyWhatsAppUrl,
  parseIsoDateParts,
} from "../../lib/whatsapp-enquiry"
import { RoomDef } from "../../components/landing-system/room-ledger"

const mockRooms: RoomDef[] = [
  {
    id: "super-deluxe",
    name: "Super Deluxe Room",
    description: "Private balcony and dedicated seating.",
    price: 4800,
    priceLabel: "/night (incl. breakfast)",
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    description: "Attached balcony and wood finishes.",
    price: 4000,
    priceLabel: "/night (incl. breakfast)",
  },
  {
    id: "standard",
    name: "Standard Room",
    description: "Wood-panelled interiors.",
    price: 3200,
    priceLabel: "/night (incl. breakfast)",
  },
]

test.describe("WhatsApp Enquiry Utility Unit Tests", () => {
  test("parseIsoDateParts correctly parses valid ISO strings without timezone offsets", () => {
    expect(parseIsoDateParts("2026-11-15")).toEqual({ year: 2026, month: 11, day: 15 })
    expect(parseIsoDateParts("2027-01-05")).toEqual({ year: 2027, month: 1, day: 5 })
    expect(parseIsoDateParts("invalid-date")).toBeNull()
    expect(parseIsoDateParts("")).toBeNull()
  })

  test("formatEnquiryDate formats dates as DD MMM YYYY", () => {
    expect(formatEnquiryDate("2026-11-15")).toBe("15 Nov 2026")
    expect(formatEnquiryDate("2027-01-05")).toBe("05 Jan 2027")
    expect(formatEnquiryDate("2026-08-31")).toBe("31 Aug 2026")
  })

  test("calculateCalendarNights calculates exact integer days across calendar boundaries", () => {
    // Within same month
    expect(calculateCalendarNights("2026-11-15", "2026-11-17")).toBe(2)
    expect(calculateCalendarNights("2026-11-15", "2026-11-16")).toBe(1)

    // Month boundary
    expect(calculateCalendarNights("2026-10-30", "2026-11-02")).toBe(3)

    // Year boundary
    expect(calculateCalendarNights("2026-12-30", "2027-01-03")).toBe(4)

    // Leap year (2028 is a leap year; Feb has 29 days)
    expect(calculateCalendarNights("2028-02-28", "2028-03-01")).toBe(2)

    // Same day or reverse
    expect(calculateCalendarNights("2026-11-15", "2026-11-15")).toBe(0)
    expect(calculateCalendarNights("2026-11-17", "2026-11-15")).toBe(0)
  })

  test("calculateTotalRooms and calculateStayEstimate compute accurate numbers", () => {
    const quantities = {
      "super-deluxe": 1,
      "deluxe": 2,
      "standard": 0,
    }

    expect(calculateTotalRooms(quantities)).toBe(3)

    // Nightly rate = 1 * 4800 + 2 * 4000 = 12800
    // 3 nights = 12800 * 3 = 38400
    expect(calculateStayEstimate(mockRooms, quantities, 3)).toBe(38400)
    expect(calculateStayEstimate(mockRooms, quantities, 0)).toBe(0)
  })

  test("validateEnquirySelection guards against missing or invalid parameters", () => {
    expect(validateEnquirySelection("", "2026-11-17", { deluxe: 1 })).toEqual({
      isValid: false,
      error: "Please choose your check-in date.",
    })

    expect(validateEnquirySelection("2026-11-15", "", { deluxe: 1 })).toEqual({
      isValid: false,
      error: "Please choose your check-out date.",
    })

    expect(validateEnquirySelection("2026-11-17", "2026-11-15", { deluxe: 1 })).toEqual({
      isValid: false,
      error: "Check-out date must be at least 1 day after check-in.",
    })

    expect(validateEnquirySelection("2026-11-15", "2026-11-17", { deluxe: 0 })).toEqual({
      isValid: false,
      error: "Please select at least 1 room category.",
    })

    expect(validateEnquirySelection("2026-11-15", "2026-11-17", { deluxe: 1 })).toEqual({
      isValid: true,
    })
  })

  test("buildDalhousieEnquiryMessage compiles exact structured message without placeholders", () => {
    const message = buildDalhousieEnquiryMessage({
      checkIn: "2026-11-15",
      checkOut: "2026-11-17",
      rooms: mockRooms,
      quantities: {
        "super-deluxe": 0,
        "deluxe": 1,
        "standard": 0,
      },
      propertyName: "Dalhousie Estate",
    })

    // Assert key headers and sections
    expect(message).toContain("Hi OFF THE TRAIL! I'm interested in staying at Dalhousie Estate.")
    expect(message).toContain("*My stay*")
    expect(message).toContain("Check-in: 15 Nov 2026")
    expect(message).toContain("Check-out: 17 Nov 2026")
    expect(message).toContain("Duration: 2 nights")

    // Assert room selection (only positive quantity rendered)
    expect(message).toContain("*Rooms selected*")
    expect(message).toContain("• Deluxe Room × 1")
    expect(message).not.toContain("Super Deluxe")
    expect(message).not.toContain("Standard Room")

    // Assert summary and estimates
    expect(message).toContain("Total rooms: 1")
    expect(message).toContain("Estimated stay total: ₹8,000 (incl. breakfast)")

    // Assert metadata & closing
    expect(message).toContain("I'd like to check availability and continue with the booking.")
    expect(message).toContain("Source: OFF THE TRAIL website")
    expect(message).toContain("Property: Dalhousie Estate")
    expect(message).toContain("Please help me with the next steps.")

    // Ensure zero raw template placeholders or NaN
    expect(message).not.toContain("[")
    expect(message).not.toContain("]")
    expect(message).not.toContain("undefined")
    expect(message).not.toContain("NaN")
  })

  test("buildDalhousieEnquiryMessage supports multiple room categories correctly", () => {
    const message = buildDalhousieEnquiryMessage({
      checkIn: "2026-12-24",
      checkOut: "2026-12-27",
      rooms: mockRooms,
      quantities: {
        "super-deluxe": 2,
        "deluxe": 1,
        "standard": 0,
      },
      propertyName: "Dalhousie Estate",
    })

    expect(message).toContain("Duration: 3 nights")
    expect(message).toContain("• Super Deluxe Room × 2\n• Deluxe Room × 1")
    expect(message).toContain("Total rooms: 3")
    // (2 * 4800 + 1 * 4000) * 3 = 13600 * 3 = 40800
    expect(message).toContain("Estimated stay total: ₹40,800 (incl. breakfast)")
  })

  test("buildDalhousieWhatsAppUrl creates valid click-to-chat URL with correct recipient and encoding", () => {
    const url = buildDalhousieWhatsAppUrl(
      {
        checkIn: "2026-11-15",
        checkOut: "2026-11-17",
        rooms: mockRooms,
        quantities: { deluxe: 1 },
      },
      "919816315898"
    )

    expect(url.startsWith("https://wa.me/919816315898?text=")).toBe(true)

    // Decode URI parameter to verify full fidelity
    const urlObj = new URL(url)
    const textParam = urlObj.searchParams.get("text")
    expect(textParam).not.toBeNull()
    expect(textParam).toContain("Hi OFF THE TRAIL! I'm interested in staying at Dalhousie Estate.")
    expect(textParam).toContain("• Deluxe Room × 1")
    expect(textParam).toContain("Estimated stay total: ₹8,000 (incl. breakfast)")
  })

  test("buildGeneralPropertyWhatsAppUrl creates clean general inquiry URL", () => {
    const url = buildGeneralPropertyWhatsAppUrl("Dalhousie Estate", "919816315898")
    expect(url).toContain("https://wa.me/919816315898?text=")
    expect(decodeURIComponent(url)).toContain("I have an inquiry about staying at Dalhousie Estate")
  })
})
