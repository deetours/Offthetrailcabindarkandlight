"use client"

import { useState, useMemo, useEffect } from "react"
import { RoomDef, RoomLedger } from "./room-ledger"
import { Calendar, Check, MessageSquare, ArrowRight, ArrowUpRight, Lock } from "lucide-react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import {
  calculateCalendarNights,
  calculateTotalRooms,
  calculateStayEstimate,
  validateEnquirySelection,
  buildDalhousieWhatsAppUrl,
  buildGeneralPropertyWhatsAppUrl,
  formatEnquiryDate,
} from "@/lib/whatsapp-enquiry"
import { trackEvent } from "@/lib/analytics"

interface BookingFlowProps {
  propertyName: string
  rooms: RoomDef[]
  qrImagePath?: string
  ownerWhatsApp: string
  selectedRoomId?: string | null
}

const STORAGE_KEY = "offthetrail_dalhousie_stay_draft"
const LEGACY_STORAGE_KEY = "offthetrail_dalhousie_booking_draft"

export function BookingFlow({
  propertyName,
  rooms,
  ownerWhatsApp,
  selectedRoomId,
}: BookingFlowProps) {
  // Stay Selection State
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [draftRestored, setDraftRestored] = useState(false)

  // Restore active booking journey draft from sessionStorage once on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(LEGACY_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.checkIn && typeof parsed.checkIn === "string") setCheckIn(parsed.checkIn)
        if (parsed.checkOut && typeof parsed.checkOut === "string") setCheckOut(parsed.checkOut)
        if (parsed.quantities && typeof parsed.quantities === "object" && Object.keys(parsed.quantities).length > 0) {
          setQuantities(parsed.quantities)
        }
      }
    } catch {
      // SessionStorage disabled or unavailable — fail gracefully
    } finally {
      setDraftRestored(true)
    }
  }, [])

  // Persist active stay parameters once draft has been loaded
  useEffect(() => {
    if (!draftRestored) return
    try {
      if (checkIn || checkOut || Object.values(quantities).some((q) => q > 0)) {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ checkIn, checkOut, quantities })
        )
      }
    } catch {
      // SessionStorage quota exceeded or disabled
    }
  }, [draftRestored, checkIn, checkOut, quantities])

  // Pre-select room if user chose one from Room Catalogue
  useEffect(() => {
    if (selectedRoomId) {
      setQuantities((prev) => ({
        ...prev,
        [selectedRoomId]: Math.max(prev[selectedRoomId] || 0, 1),
      }))
    }
  }, [selectedRoomId])

  // Today's date string for min check-in (prevents past dates)
  const todayStr = useMemo(() => {
    return new Date().toISOString().split("T")[0]
  }, [])

  // Min check-out date is day after check-in
  const minCheckOutStr = useMemo(() => {
    if (!checkIn) return todayStr
    const parts = checkIn.split("-").map(Number)
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2] + 1)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      return `${y}-${m}-${day}`
    }
    return todayStr
  }, [checkIn, todayStr])

  // Handle smart check-in date change
  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn)
    if (!checkOut || checkOut <= newCheckIn) {
      const parts = newCheckIn.split("-").map(Number)
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2] + 1)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        setCheckOut(`${y}-${m}-${day}`)
      }
    }
  }

  // Compute stay metrics
  const nights = useMemo(() => {
    return calculateCalendarNights(checkIn, checkOut)
  }, [checkIn, checkOut])

  const totalRooms = useMemo(() => {
    return calculateTotalRooms(quantities)
  }, [quantities])

  const subtotal = useMemo(() => {
    return calculateStayEstimate(rooms, quantities, nights)
  }, [rooms, quantities, nights])

  const validation = useMemo(() => {
    return validateEnquirySelection(checkIn, checkOut, quantities)
  }, [checkIn, checkOut, quantities])

  const isSelectionReady = validation.isValid && nights > 0 && totalRooms > 0

  // Odometer animation for estimated total
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString("en-IN"))

  useEffect(() => {
    const controls = animate(count, subtotal, { duration: 0.45, ease: "easeOut" })
    return controls.stop
  }, [subtotal, count])

  const handleQuantityChange = (roomId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [roomId]: Math.max(qty, 0) }))
  }

  // Build real-time validated WhatsApp click-to-chat URL
  const whatsappUrl = useMemo(() => {
    if (!isSelectionReady) return "#"
    return buildDalhousieWhatsAppUrl(
      {
        checkIn,
        checkOut,
        rooms,
        quantities,
        propertyName,
        source: "OFF THE TRAIL website",
      },
      ownerWhatsApp
    )
  }, [isSelectionReady, checkIn, checkOut, rooms, quantities, propertyName, ownerWhatsApp])

  const handleWhatsAppClick = () => {
    trackEvent({
      action: "whatsapp_click",
      category: "lead",
      label: "dalhousie_stay_planner",
      context: "dalhousie_estate",
    })
  }

  // Dispatch custom event for sticky mobile bar & contextual listeners
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("dalhousie_stay_selection_change", {
          detail: {
            isSelectionReady,
            subtotal,
            whatsappUrl,
          },
        })
      )
    }
  }, [isSelectionReady, subtotal, whatsappUrl])

  const selectedRoomsSummary = useMemo(() => {
    return rooms
      .filter((r) => (quantities[r.id] || 0) > 0)
      .map((r) => `${quantities[r.id]}x ${r.name}`)
      .join(", ")
  }, [rooms, quantities])

  return (
    <div
      data-hydrated={draftRestored ? "true" : undefined}
      className="w-full max-w-4xl mx-auto bg-card border border-border rounded-[4px] p-6 md:p-10 shadow-2xl relative z-20 space-y-10"
    >
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-[0.22em] text-primary font-bold uppercase mb-2">
            PLAN YOUR STAY
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-foreground font-medium">
            Your time in the mountains.
          </h3>
          <p className="text-sm text-muted-foreground font-light mt-1">
            Choose your dates and the rooms that suit your stay.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/80 self-start md:self-auto">
          <Lock size={12} className="text-primary/70" />
          <span>Direct Estate Reservation</span>
        </div>
      </div>

      {/* 01 · Calendar Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-xl text-foreground">1. Choose your dates</h4>
          <span className="text-xs font-mono text-muted-foreground">Check-in from 1:00 PM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="booking-checkin"
              className="block text-xs font-mono text-muted-foreground font-bold mb-2 uppercase tracking-widest"
            >
              Check-In Date *
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={16}
              />
              <input
                id="booking-checkin"
                type="date"
                value={checkIn}
                min={todayStr}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="w-full bg-background border border-border rounded-[3px] pl-10 pr-4 py-3 text-foreground font-mono focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="booking-checkout"
              className="block text-xs font-mono text-muted-foreground font-bold mb-2 uppercase tracking-widest"
            >
              Check-Out Date *
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={16}
              />
              <input
                id="booking-checkout"
                type="date"
                value={checkOut}
                min={minCheckOutStr}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-background border border-border rounded-[3px] pl-10 pr-4 py-3 text-foreground font-mono focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {nights > 0 && checkIn && checkOut && (
          <div className="px-3.5 py-2 rounded-[3px] bg-primary/10 border border-primary/20 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs text-primary font-mono font-bold">
              {nights} night{nights > 1 ? "s" : ""} stay ({formatEnquiryDate(checkIn)} to{" "}
              {formatEnquiryDate(checkOut)})
            </span>
          </div>
        )}
      </div>

      {/* 02 · Room Categories & Quantities */}
      <div className="pt-6 border-t border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h4 className="font-serif text-xl text-foreground">2. Select room categories</h4>
            <p className="text-sm text-muted-foreground font-light mt-1">
              Double occupancy rates. Daily hot breakfast included with every stay.
            </p>
          </div>
          {totalRooms > 0 && (
            <div className="text-xs font-mono text-primary font-bold">
              {totalRooms} room{totalRooms > 1 ? "s" : ""} selected (max {totalRooms * 2} guests)
            </div>
          )}
        </div>

        <RoomLedger
          rooms={rooms}
          interactive
          selectedQuantities={quantities}
          onQuantityChange={handleQuantityChange}
          ownerWhatsApp={ownerWhatsApp}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={totalRooms * 2}
        />
      </div>

      {/* 03 · Live Summary, Cost Estimation & WhatsApp Handoff */}
      <div className="pt-6 border-t border-border space-y-6">
        <div className="bg-background/80 rounded-[4px] p-5 sm:p-6 border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-wider mb-1">
              {isSelectionReady
                ? `Estimated Total · ${nights} Night${nights > 1 ? "s" : ""} · ${totalRooms} Room${totalRooms > 1 ? "s" : ""}`
                : "Estimated Stay Total"}
            </div>

            <div className="text-foreground font-serif text-3xl sm:text-4xl flex items-baseline">
              {isSelectionReady ? (
                <>
                  <span className="text-primary font-bold">₹</span>
                  <motion.span className="text-primary font-bold">{rounded}</motion.span>
                  <span className="text-xs font-sans text-muted-foreground font-normal ml-3">
                    (Breakfast Included)
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground/60">₹—</span>
              )}
            </div>

            <p className="text-xs font-mono text-muted-foreground mt-2">
              {isSelectionReady ? (
                <span>
                  Double occupancy (2 adults/room) · {selectedRoomsSummary}
                </span>
              ) : !checkIn || !checkOut ? (
                <span className="text-primary font-medium">
                  👉 Choose check-in and check-out dates above to calculate your estimate.
                </span>
              ) : totalRooms === 0 ? (
                <span className="text-primary font-medium">
                  👉 Select at least 1 room category above to calculate your estimate.
                </span>
              ) : (
                "Select dates and rooms to calculate your estimate."
              )}
            </p>
          </div>

          {/* Inclusions & Practical Transparency */}
          <div className="text-xs font-mono space-y-2 text-muted-foreground shrink-0">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Check size={14} />
              <span>Fresh Daily Breakfast Included</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} />
              <span>High-Speed 50+ Mbps Fiber Wi-Fi</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} />
              <span>Direct Paved Road & Free Parking</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={14} />
              <span>Direct Reservation (Zero Commission)</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-col items-stretch sm:items-center gap-3 pt-2">
          {isSelectionReady ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white px-8 py-4 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs transition-all shadow-xl hover:shadow-2xl hover:brightness-105"
            >
              <MessageSquare size={16} />
              <span>Continue on WhatsApp · ₹{subtotal.toLocaleString("en-IN")}</span>
              <ArrowRight size={16} />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary/40 text-primary-foreground/70 px-8 py-4 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs cursor-not-allowed shadow-md"
            >
              {!checkIn || !checkOut
                ? "Select Dates to Continue"
                : totalRooms === 0
                ? "Select a Room to Continue"
                : "Select Dates and Rooms"}
            </button>
          )}

          {/* Secondary Quiet Link */}
          <div className="pt-2 text-center">
            <a
              href={buildGeneralPropertyWhatsAppUrl(propertyName, ownerWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 underline underline-offset-4"
            >
              <span>Have questions before choosing? Ask Concierge on WhatsApp</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          <p className="text-[11px] font-mono text-muted-foreground/70 text-center max-w-lg mx-auto pt-2">
            Your selected dates and room choices will be carried directly into your enquiry. Room
            allocation and availability are confirmed directly by the estate team on WhatsApp.
          </p>
        </div>
      </div>
    </div>
  )
}
