"use client"

import { useState, useMemo, useEffect } from "react"
import { RoomDef, RoomLedger } from "./room-ledger"
import Image from "next/image"
import { 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Lock,
  ChevronLeft,
  MessageSquare,
  Clock
} from "lucide-react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

interface BookingFlowProps {
  propertyName: string
  rooms: RoomDef[]
  qrImagePath: string
  ownerWhatsApp: string
  selectedRoomId?: string | null
}

export function BookingFlow({ propertyName, rooms, qrImagePath, ownerWhatsApp, selectedRoomId }: BookingFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  
  // State
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [copiedSummary, setCopiedSummary] = useState(false)
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({})
  const [leadStatus, setLeadStatus] = useState<"idle" | "submitting" | "saved" | "failed">("idle")
  const [lastSubmittedSignature, setLastSubmittedSignature] = useState<string | null>(null)
  const [draftRestored, setDraftRestored] = useState(false)

  // Restore active booking journey draft from sessionStorage once on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("offthetrail_dalhousie_booking_draft")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.checkIn) setCheckIn(parsed.checkIn)
        if (parsed.checkOut) setCheckOut(parsed.checkOut)
        if (parsed.quantities && typeof parsed.quantities === "object" && Object.keys(parsed.quantities).length > 0) {
          setQuantities(parsed.quantities)
        }
        if (parsed.name) setName(parsed.name)
        if (parsed.phone) setPhone(parsed.phone)
      }
    } catch {
      // SessionStorage disabled or unavailable — fail gracefully
    } finally {
      setDraftRestored(true)
    }
  }, [])

  // Preserve active booking journey parameters once draft has been loaded
  useEffect(() => {
    if (!draftRestored) return
    try {
      if (checkIn || checkOut || name || phone || Object.values(quantities).some(q => q > 0)) {
        sessionStorage.setItem(
          "offthetrail_dalhousie_booking_draft",
          JSON.stringify({ checkIn, checkOut, quantities, name, phone })
        )
      }
    } catch {
      // SessionStorage quota exceeded or disabled
    }
  }, [draftRestored, checkIn, checkOut, quantities, name, phone])

  // Pre-select room if user chose one from Room Catalogue
  useEffect(() => {
    if (selectedRoomId) {
      setQuantities(prev => ({
        ...prev,
        [selectedRoomId]: Math.max(prev[selectedRoomId] || 0, 1)
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
    const d = new Date(checkIn)
    d.setDate(d.getDate() + 1)
    return d.toISOString().split("T")[0]
  }, [checkIn, todayStr])

  // Handle smart check-in date change
  const handleCheckInChange = (newCheckIn: string) => {
    setCheckIn(newCheckIn)
    if (!checkOut || checkOut <= newCheckIn) {
      const d = new Date(newCheckIn)
      d.setDate(d.getDate() + 1)
      setCheckOut(d.toISOString().split("T")[0])
    }
  }

  // Compute nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }, [checkIn, checkOut])

  // Compute totals
  const totalRooms = Object.values(quantities).reduce((acc, q) => acc + q, 0)
  const subtotal = rooms.reduce((acc, room) => {
    return acc + (room.price * (quantities[room.id] || 0))
  }, 0) * (nights || 1)
  const guestCap = totalRooms * 2

  // Odometer animation
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString())

  useEffect(() => {
    const controls = animate(count, subtotal, { duration: 0.5, ease: "easeOut" })
    return controls.stop
  }, [subtotal, count])

  const handleQuantityChange = (roomId: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [roomId]: qty }))
  }

  const handleCopyUpi = () => {
    try {
      navigator.clipboard.writeText("offthetrail@upi")
      setCopiedUpi(true)
      setTimeout(() => setCopiedUpi(false), 2000)
    } catch {
      // Clipboard access restricted
    }
  }

  const handleCopySummary = () => {
    try {
      const summary = `Off The Trail - ${propertyName} Booking Verification Request\n\n` +
        `Guest: ${name}\n` +
        `WhatsApp: ${phone}\n` +
        `Dates: ${checkIn} to ${checkOut} (${nights} night${nights > 1 ? "s" : ""})\n` +
        `Rooms: ${selectedRoomsSummary}\n` +
        `Amount Transferred: ₹${subtotal.toLocaleString()} (Breakfast Included)\n` +
        `UPI Reference / UTR: ${transactionId.trim()}`
      navigator.clipboard.writeText(summary)
      setCopiedSummary(true)
      setTimeout(() => setCopiedSummary(false), 2500)
    } catch {
      // Clipboard access restricted
    }
  }

  const selectedRoomsSummary = useMemo(() => {
    return rooms
      .filter(r => quantities[r.id] > 0)
      .map(r => `${quantities[r.id]}x ${r.name}`)
      .join(", ")
  }, [rooms, quantities])

  // WhatsApp link for preliminary inquiry (carries selected dates & room without forcing payment)
  const generateInquiryWhatsAppLink = () => {
    const cleanNumber = ownerWhatsApp.replace(/[^0-9]/g, "")
    let message = ""
    if (checkIn && checkOut && totalRooms > 0) {
      message = `Hi, I'm interested in the ${selectedRoomsSummary} for ${checkIn} to ${checkOut} (${nights} night${nights > 1 ? "s" : ""}) at ${propertyName}. Can you check live availability and clarify booking details?`
    } else if (checkIn && checkOut) {
      message = `Hi, I'm planning to stay at ${propertyName} from ${checkIn} to ${checkOut} (${nights} night${nights > 1 ? "s" : ""}). Can you check room availability and rates?`
    } else {
      message = `Hi, I have a few questions about booking a stay at ${propertyName}.`
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
  }

  // WhatsApp link for final payment verification request submission
  const generateWhatsAppLink = () => {
    const cleanNumber = ownerWhatsApp.replace(/[^0-9]/g, "")
    const message = `Hello, I'd like to submit my payment verification request for ${propertyName}.\n\n` +
      `*Guest Name:* ${name}\n` +
      `*WhatsApp:* ${phone}\n` +
      `*Dates:* ${checkIn} to ${checkOut} (${nights} night${nights > 1 ? "s" : ""})\n` +
      `*Rooms:* ${selectedRoomsSummary}\n` +
      `*Amount Transferred:* ₹${subtotal.toLocaleString()}\n` +
      `*UPI Reference / UTR:* ${transactionId.trim()}\n\n` +
      `I have transferred the reservation deposit via UPI. Please find my transaction reference above and confirm room allocation.`

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
  }

  // Validate guest contact details accessibly
  const validateGuestDetails = (): boolean => {
    const errors: { name?: string; phone?: string } = {}
    const trimmedName = name.trim()
    const cleanedPhone = phone.replace(/[^0-9+]/g, "")
    const digitsOnly = cleanedPhone.replace(/[^0-9]/g, "")

    if (!trimmedName || trimmedName.length < 2) {
      errors.name = "Please enter your full name (at least 2 characters)."
    }

    if (!cleanedPhone || digitsOnly.length < 10) {
      errors.phone = "Please enter a valid phone number (at least 10 digits)."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Non-blocking lead enquiry dispatch to existing backend (/api/leads)
  const dispatchLeadEnquiry = async () => {
    const signature = `${name.trim()}_${phone.trim()}_${checkIn}_${checkOut}_${subtotal}`
    if (signature === lastSubmittedSignature) {
      return // Skip duplicate network dispatch for identical stay enquiry
    }

    setLeadStatus("submitting")
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name.trim(),
          phone_number: phone.trim(),
          source: "dalhousie_booking_enquiry",
          notes: `Dalhousie Estate Enquiry | Stay: ${checkIn} to ${checkOut} (${nights} nights) | Rooms: ${selectedRoomsSummary} | Est. Total: ₹${subtotal.toLocaleString()}`
        })
      })

      if (res.ok) {
        setLeadStatus("saved")
        setLastSubmittedSignature(signature)
      } else {
        console.warn("Lead enquiry persistence returned status:", res.status)
        setLeadStatus("failed")
      }
    } catch (err) {
      console.warn("Lead enquiry persistence network error:", err)
      setLeadStatus("failed")
    }
  }

  // Step 2 submission handler
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateGuestDetails()) return

    // Immediately advance to Step 3 (non-blocking for guest)
    setStep(3)

    // Dispatch enquiry lead in the background
    dispatchLeadEnquiry()
  }

  // Clear draft on successful booking request hand-off
  const handleClearDraft = () => {
    try {
      sessionStorage.removeItem("offthetrail_dalhousie_booking_draft")
    } catch {
      // Ignore
    }
  }

  return (
    <div data-hydrated={draftRestored ? "true" : undefined} className="w-full max-w-4xl mx-auto bg-card border border-border rounded-[4px] p-6 md:p-10 shadow-2xl relative z-20">
      
      {/* Stage Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border/80 text-xs font-mono tracking-widest text-muted-foreground font-bold">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-[2px] ${step === 1 ? "bg-primary/20 text-primary border border-primary/30" : step > 1 ? "text-primary" : ""}`}>
            01. STAY & ROOMS
          </span>
          <span className="opacity-30">/</span>
          <span className={`px-2 py-0.5 rounded-[2px] ${step === 2 ? "bg-primary/20 text-primary border border-primary/30" : step > 2 ? "text-primary" : ""}`}>
            02. GUEST DETAILS
          </span>
          <span className="opacity-30">/</span>
          <span className={`px-2 py-0.5 rounded-[2px] ${step === 3 ? "bg-primary/20 text-primary border border-primary/30" : step > 3 ? "text-primary" : ""}`}>
            03. UPI PAYMENT
          </span>
          <span className="opacity-30">/</span>
          <span className={`px-2 py-0.5 rounded-[2px] ${step === 4 ? "bg-primary/20 text-primary border border-primary/30" : ""}`}>
            04. REQUEST & VERIFICATION
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
          <Lock size={12} className="text-primary/70" />
          <span>Direct Estate Booking</span>
        </div>
      </div>

      {/* Step 1: Dates & Rooms */}
      {step === 1 && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">When are you arriving?</h3>
            <p className="text-sm text-muted-foreground mb-6">Choose your dates to check live category rates. Minimum 1 night stay.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-checkin" className="block text-xs font-mono text-muted-foreground font-bold mb-2 uppercase tracking-widest">
                  Check-In Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
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
                <label htmlFor="booking-checkout" className="block text-xs font-mono text-muted-foreground font-bold mb-2 uppercase tracking-widest">
                  Check-Out Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    id="booking-checkout"
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={minCheckOutStr}
                    className="w-full bg-background border border-border rounded-[3px] pl-10 pr-4 py-3 text-foreground font-mono focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {nights > 0 && (
              <div className="mt-3 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-primary font-mono font-bold">
                  {nights} night{nights > 1 ? 's' : ''} stay selected ({checkIn} to {checkOut})
                </span>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-foreground">Select Room Categories</h3>
                <p className="text-sm text-muted-foreground mt-1">All rooms include daily hot breakfast. Rates shown for double occupancy.</p>
              </div>
              {totalRooms > 0 && (
                <div className="text-xs font-mono text-primary font-bold">
                  {totalRooms} room{totalRooms > 1 ? 's' : ''} selected (max {guestCap} guests)
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
              guests={guestCap}
            />
          </div>

          {/* Transparent Cost Ledger & Dual-Path Action Row */}
          <div className="pt-6 border-t border-border space-y-4">
            <div className="bg-background/80 rounded-[4px] p-5 border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-wider mb-1">
                  {nights > 0 && totalRooms > 0
                    ? `Estimated Total for ${nights} Night${nights > 1 ? 's' : ''} · ${totalRooms} Room${totalRooms > 1 ? 's' : ''}`
                    : "Estimated Total"}
                </div>
                <div className="text-foreground font-serif text-3xl flex items-center">
                  <span>₹</span>
                  <motion.span>{rounded}</motion.span>
                  <span className="text-xs font-sans text-muted-foreground font-normal ml-3">
                    {nights > 0 && totalRooms > 0 ? "(Breakfast Included)" : "per night starting rate"}
                  </span>
                </div>
                {nights > 0 && totalRooms > 0 && (
                  <p className="text-[11px] font-mono text-muted-foreground mt-1">
                    Double occupancy (2 adults/room) · Taxes & morning breakfast included
                  </p>
                )}
              </div>

              {/* Inclusions summary */}
              <div className="text-xs font-mono space-y-1.5 text-muted-foreground">
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
                  <span>Direct Estate Reservation (Zero commissions)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} />
                  <span>100% refund up to 7 days before check-in</span>
                </div>
              </div>
            </div>

            {/* Transparent Stay Policies Strip */}
            <div className="p-3.5 bg-card/40 border border-border/80 rounded-[3px] flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-[11px] font-mono text-muted-foreground">
              <span>Standard Double Occupancy (2 Adults/room)</span>
              <span className="hidden sm:inline opacity-30">•</span>
              <span>Extra Bed & Breakfast: ₹1,200/night</span>
              <span className="hidden sm:inline opacity-30">•</span>
              <span>Check-in 1:00 PM · Check-out 11:00 AM</span>
              <span className="hidden sm:inline opacity-30">•</span>
              <span>Free On-Site Private Parking</span>
            </div>

            {/* Selection Guidance Message */}
            <div className="text-xs text-muted-foreground font-mono">
              {!checkIn || !checkOut ? (
                <span className="text-primary font-bold">👉 Please select Check-in and Check-out dates above</span>
              ) : totalRooms === 0 ? (
                <span className="text-primary font-bold">👉 Please select at least 1 room category above</span>
              ) : (
                <span className="text-foreground/80">Ready to proceed with booking details or ask questions</span>
              )}
            </div>

            {/* The Two Paths: Direct Web Booking or WhatsApp Concierge Assistance */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
              {/* Secondary Assistive Path: Ask WhatsApp Concierge */}
              <a
                href={generateInquiryWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-background border border-primary/40 hover:border-primary text-foreground hover:text-primary font-sans text-xs font-semibold uppercase tracking-wider rounded-[3px] transition-colors order-2 sm:order-1"
              >
                <MessageSquare size={14} className="text-primary" />
                <span>Questions? Ask on WhatsApp</span>
              </a>

              {/* Primary Path: Continue through Web Booking */}
              <button 
                onClick={() => setStep(2)}
                disabled={nights === 0 || totalRooms === 0}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-[#D4A35B] active:scale-[0.98] text-primary-foreground px-8 py-3.5 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg order-1 sm:order-2"
              >
                {!checkIn || !checkOut 
                  ? "Select Dates to Continue" 
                  : totalRooms === 0 
                  ? "Select a Room to Continue" 
                  : `Continue to Guest Details · ₹${subtotal.toLocaleString()}`}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Guest Details */}
      {step === 2 && (
        <form onSubmit={handleProceedToPayment} noValidate className="space-y-8 animate-fade-in">
          {/* Reservation recap strip */}
          <div className="bg-background/80 rounded-[3px] p-4 border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest font-bold">Selected Stay</div>
              <div className="text-foreground font-serif text-lg">
                {propertyName} · {nights} Night{nights > 1 ? 's' : ''} ({checkIn} → {checkOut})
              </div>
              <div className="text-xs font-mono text-primary font-bold mt-0.5">
                {selectedRoomsSummary} · Max {guestCap} Guests
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setStep(1)} 
              className="inline-flex items-center gap-1 text-primary text-xs font-mono font-bold uppercase tracking-widest hover:underline"
            >
              <ChevronLeft size={14} /> Edit Dates/Rooms
            </button>
          </div>

          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">Guest Details</h3>
            <p className="text-muted-foreground text-sm">
              We need your contact information to send your reservation voucher and arrival directions.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="booking-fullname" className="block text-xs font-mono text-muted-foreground font-bold mb-2 uppercase tracking-widest">
                Full Name *
              </label>
              <input 
                id="booking-fullname"
                name="fullName"
                type="text" 
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (formErrors.name) setFormErrors(prev => ({ ...prev, name: undefined }))
                }}
                autoComplete="name"
                required
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? "booking-fullname-error" : undefined}
                placeholder="e.g. Rahul Sharma"
                className={`w-full bg-background border rounded-[3px] px-4 py-3 text-foreground transition-colors font-sans focus:outline-none ${
                  formErrors.name 
                    ? "border-destructive focus:ring-1 focus:ring-destructive" 
                    : "border-border focus:border-primary focus:ring-1 focus:ring-primary"
                }`}
              />
              {formErrors.name && (
                <p id="booking-fullname-error" role="alert" className="text-xs text-destructive font-mono mt-1.5">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="booking-phone" className="block text-xs font-mono text-muted-foreground font-bold mb-2 uppercase tracking-widest">
                WhatsApp Phone Number *
              </label>
              <input 
                id="booking-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: undefined }))
                }}
                aria-invalid={!!formErrors.phone}
                aria-describedby={formErrors.phone ? "booking-phone-error" : "booking-phone-hint"}
                placeholder="+91 98765 43210"
                className={`w-full bg-background border rounded-[3px] px-4 py-3 text-foreground font-mono transition-colors focus:outline-none ${
                  formErrors.phone 
                    ? "border-destructive focus:ring-1 focus:ring-destructive" 
                    : "border-border focus:border-primary focus:ring-1 focus:ring-primary"
                }`}
              />
              {formErrors.phone ? (
                <p id="booking-phone-error" role="alert" className="text-xs text-destructive font-mono mt-1.5">
                  {formErrors.phone}
                </p>
              ) : (
                <p id="booking-phone-hint" className="text-xs text-muted-foreground mt-1.5 font-mono">
                  Booking confirmation & driving directions will be sent to this number.
                </p>
              )}
            </div>
          </div>

          {/* Non-blocking sync status alert if previous background persistence encountered an issue */}
          {leadStatus === "failed" && (
            <div className="p-3 bg-secondary/40 border border-border rounded-[3px] flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Enquiry sync is pending network connection.</span>
              <button
                type="button"
                onClick={dispatchLeadEnquiry}
                className="text-primary font-bold hover:underline ml-2 uppercase tracking-wider"
              >
                Retry Sync
              </button>
            </div>
          )}

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border">
            <button 
              type="button"
              onClick={() => setStep(1)} 
              className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Back
            </button>
            <button 
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-[#D4A35B] active:scale-[0.98] text-primary-foreground px-8 py-3.5 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Continue to Payment · ₹{subtotal.toLocaleString()} <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="space-y-8 animate-fade-in text-center">
          <div className="max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-primary/10 border border-primary/20 text-primary text-[11px] font-mono font-bold uppercase tracking-widest mb-3">
              <Lock size={12} /> Direct Estate Reservation
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-foreground mb-2">Direct Estate Payment</h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              Transfer the exact reservation deposit of ₹{subtotal.toLocaleString()} directly to the estate via UPI. Your dates are submitted for immediate verification in the next step.
            </p>
          </div>

          <div className="bg-background/90 border border-border rounded-[4px] p-6 sm:p-8 max-w-md mx-auto shadow-xl relative">
            {/* Payee Strip */}
            <div className="flex items-center justify-between pb-4 border-b border-border/80 text-xs font-mono">
              <span className="text-muted-foreground uppercase tracking-wider">Payee</span>
              <span className="text-foreground font-semibold flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-primary" /> Off The Trail
              </span>
            </div>

            {/* Total Payable Amount */}
            <div className="py-5 text-center border-b border-border/80">
              <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Total Payable Amount</div>
              <div className="font-mono font-bold text-3xl sm:text-4xl text-primary tabular-nums">₹{subtotal.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1 font-sans font-light">
                {nights} night{nights > 1 ? "s" : ""} · {totalRooms} room{totalRooms > 1 ? "s" : ""} (Hot Breakfast Included)
              </div>
            </div>
            
            {/* QR Code Container */}
            <div className="py-6 text-center">
              <div className="relative w-52 h-52 mx-auto bg-white p-3 rounded-[3px] shadow-sm border border-neutral-200">
                <Image src={qrImagePath} alt="Off The Trail UPI QR Code" fill className="object-contain p-2" priority />
              </div>
              <p className="text-[11px] font-mono text-muted-foreground mt-3">
                Scan using Google Pay, PhonePe, Paytm, or any UPI app
              </p>
            </div>

            {/* Direct UPI ID with Copy Option */}
            <div className="bg-card/70 border border-border rounded-[3px] p-3 mb-4 flex items-center justify-between gap-3 text-left">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Verified UPI ID</div>
                <div className="font-mono text-sm text-foreground font-bold tracking-wide">offthetrail@upi</div>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                aria-label="Copy UPI ID offthetrail@upi"
                className="px-3 py-1.5 rounded-[2px] bg-background border border-border hover:border-primary/50 text-xs font-mono font-semibold text-foreground flex items-center gap-1.5 transition-colors"
              >
                {copiedUpi ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                <span aria-live="polite">{copiedUpi ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Mobile UPI Deep-Link Intent */}
            <div className="block sm:hidden mb-4">
              <a
                href={`upi://pay?pa=offthetrail@upi&pn=Off%20The%20Trail&am=${subtotal}&cu=INR&tn=Dalhousie%20Estate%20Stay`}
                className="w-full py-2.5 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded-[3px] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink size={14} /> Open Installed UPI App
              </a>
            </div>

            {/* Restrained Step-by-Step Instructions */}
            <div className="bg-card/40 text-foreground text-xs p-4 rounded-[3px] text-left border border-border/80 space-y-2 font-sans font-light">
              <div className="flex items-start gap-2.5">
                <span className="font-mono font-bold text-primary shrink-0">01.</span>
                <span className="leading-relaxed">Scan the QR code or transfer to UPI ID <strong className="font-mono text-foreground font-medium">offthetrail@upi</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono font-bold text-primary shrink-0">02.</span>
                <span className="leading-relaxed">Verify recipient is <strong className="font-sans text-foreground font-medium">Off The Trail</strong> and transfer <strong className="font-mono text-primary font-bold">₹{subtotal.toLocaleString()}</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono font-bold text-primary shrink-0">03.</span>
                <span className="leading-relaxed">Note your transaction reference / UTR number from your payment receipt for the next step.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 max-w-md mx-auto">
            <button 
              type="button"
              onClick={() => setStep(2)} 
              className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Back to Details
            </button>
            <button 
              type="button"
              onClick={() => setStep(4)}
              className="w-full sm:w-auto bg-primary hover:bg-[#D4A35B] active:scale-[0.98] text-primary-foreground px-8 py-3.5 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              I Have Transferred ₹{subtotal.toLocaleString()} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Verification & WhatsApp Handoff */}
      {step === 4 && (
        <div className="space-y-8 animate-fade-in text-center max-w-xl mx-auto">
          <div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Clock className="text-primary" size={22} />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-secondary/80 text-foreground text-[11px] font-mono uppercase tracking-wider mb-3 border border-border">
              <span>Step 4 of 4 · Verification Request</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-foreground mb-2">Payment Verification Request</h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              Enter your transaction reference below and share your payment receipt on WhatsApp. The estate manager verifies the transfer and issues your confirmed booking voucher.
            </p>
          </div>

          {/* Active Reservation Summary */}
          <div className="bg-background/80 border border-border rounded-[3px] p-5 text-left">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3 pb-2 border-b border-border/80 flex items-center justify-between">
              <span>Reservation Summary</span>
              <span className="text-primary font-bold">Pending Owner Verification</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block font-mono text-[10px] uppercase">Guest</span>
                <span className="text-foreground font-medium">{name} ({phone})</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-mono text-[10px] uppercase">Stay Dates</span>
                <span className="text-foreground font-medium">{checkIn} to {checkOut} ({nights} night{nights > 1 ? "s" : ""})</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-mono text-[10px] uppercase">Rooms</span>
                <span className="text-foreground font-medium">{selectedRoomsSummary}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-mono text-[10px] uppercase">Deposit Transferred</span>
                <span className="text-primary font-mono font-bold text-sm">₹{subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Reference Input */}
          <div className="text-left bg-background/80 p-5 sm:p-6 rounded-[3px] border border-border">
            <label htmlFor="booking-utr" className="block text-xs font-mono text-muted-foreground font-bold mb-2 uppercase tracking-widest">
              UPI Reference / UTR / Transaction ID *
            </label>
            <input 
              id="booking-utr"
              type="text" 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. 4289XXXXXXXX or bank transaction ref"
              className="w-full bg-card border border-border rounded-[3px] px-4 py-3 text-foreground font-mono focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors text-sm"
            />
            <p className="text-[11px] text-muted-foreground mt-2 font-mono">
              Found on your Google Pay, PhonePe, Paytm, BHIM, or banking payment receipt.
            </p>
          </div>

          {/* Clear Operational Policy Notice */}
          <div className="bg-card/70 border border-border rounded-[3px] p-5 text-left">
            <div className="flex gap-3.5">
              <div className="shrink-0 mt-0.5">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 text-primary text-[11px] font-mono font-bold">
                  i
                </div>
              </div>
              <div className="text-xs space-y-1">
                <p className="text-foreground font-semibold">Verification & Voucher Issuance</p>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Your reservation is officially confirmed once payment is verified against the estate bank account. The manager will issue your booking voucher and driving/check-in details via WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Submission and Dual-Platform Fallback */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <a 
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClearDraft}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white px-8 py-4 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs transition-all shadow-xl ${transactionId.trim().length < 6 ? 'opacity-40 pointer-events-none' : ''}`}
            >
              <MessageSquare size={16} />
              <span>Send Verification on WhatsApp</span>
              <ArrowRight size={16} />
            </a>

            {transactionId.trim().length < 6 && (
              <p className="text-xs text-muted-foreground font-mono">
                Please enter your Transaction ID or UTR above (at least 6 characters) to enable WhatsApp submission.
              </p>
            )}

            {/* Desktop / Offline Fallback Options */}
            <div className="mt-6 pt-6 border-t border-border/80 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
              <button
                type="button"
                onClick={handleCopySummary}
                disabled={transactionId.trim().length < 6}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-background border border-border hover:border-primary/50 text-foreground rounded-[2px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {copiedSummary ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                <span>{copiedSummary ? "Booking Summary Copied" : "Copy Booking Summary"}</span>
              </button>

              <div className="text-center sm:text-right">
                <span className="block text-[11px]">Direct Concierge WhatsApp / Call</span>
                <a href={`tel:+${ownerWhatsApp.replace(/[^0-9]/g, "")}`} className="text-primary font-bold hover:underline">
                  +{ownerWhatsApp.replace(/[^0-9]/g, "").replace(/(\d{2})(\d{5})(\d{5})/, "$1 $2 $3")}
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs font-mono text-muted-foreground hover:text-foreground mt-4 uppercase tracking-widest"
            >
              Back to Payment Screen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
