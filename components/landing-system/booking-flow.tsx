"use client"

import { useState, useMemo, useEffect } from "react"
import { RoomDef, RoomLedger } from "./room-ledger"
import Image from "next/image"
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Lock,
  ChevronLeft,
  MessageSquare
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
    navigator.clipboard.writeText("offthetrail@upi")
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2000)
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

  // WhatsApp link for final booking request submission
  const generateWhatsAppLink = () => {
    const cleanNumber = ownerWhatsApp.replace(/[^0-9]/g, "")
    const message = `Hello, I'd like to submit my booking request for ${propertyName}.\n\n` +
      `*Guest Name:* ${name}\n` +
      `*WhatsApp:* ${phone}\n` +
      `*Dates:* ${checkIn} to ${checkOut} (${nights} night${nights > 1 ? "s" : ""})\n` +
      `*Rooms:* ${selectedRoomsSummary}\n` +
      `*Total Amount Paid:* ₹${subtotal.toLocaleString()}\n` +
      `*UPI UTR / Transaction ID:* ${transactionId}\n\n` +
      `I have attached my payment receipt screenshot for verification and room confirmation.`

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-card border border-border rounded-[4px] p-6 md:p-10 shadow-2xl relative z-20">
      
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
            <div className="bg-background/80 rounded-xl p-5 border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              </div>

              {/* Inclusions summary */}
              <div className="text-xs font-mono space-y-1.5 text-muted-foreground">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Check size={14} />
                  <span>Fresh Breakfast Included Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} />
                  <span>Direct Estate Booking (No platform fees)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} />
                  <span>Free cancellation up to 7 days before check-in</span>
                </div>
              </div>
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
        <div className="space-y-8 animate-fade-in">
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
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-background border border-border rounded-[3px] px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors font-sans"
              />
            </div>
            <div>
              <label htmlFor="booking-phone" className="block text-xs font-mono text-muted-foreground font-bold mb-2 uppercase tracking-widest">
                WhatsApp Phone Number *
              </label>
              <input 
                id="booking-phone"
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-background border border-border rounded-[3px] px-4 py-3 text-foreground font-mono focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                Booking confirmation & driving directions will be sent to this number.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border">
            <button 
              onClick={() => setStep(1)} 
              className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Back
            </button>
            <button 
              onClick={() => setStep(3)}
              disabled={name.trim().length < 2 || phone.trim().length < 8}
              className="w-full sm:w-auto bg-primary hover:bg-[#D4A35B] active:scale-[0.98] text-primary-foreground px-8 py-3.5 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Continue to Payment · ₹{subtotal.toLocaleString()} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="space-y-8 animate-fade-in text-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <ShieldCheck size={14} /> Zero Gateway Convenience Fees
            </div>
            <h3 className="font-serif text-3xl text-foreground mb-2">Scan & Pay via UPI</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Pay ₹{subtotal.toLocaleString()} directly to the estate. After initiating payment, submit your UTR number to request booking verification.
            </p>
          </div>

          <div className="bg-background border border-primary/30 rounded-2xl p-6 md:p-8 max-w-md mx-auto shadow-2xl relative">
            <div className="font-mono text-muted-foreground font-bold text-xs uppercase tracking-widest mb-1">Total Payable Amount</div>
            <div className="font-mono font-bold text-4xl text-primary mb-6">₹{subtotal.toLocaleString()}</div>
            
            {/* QR Code Container */}
            <div className="relative w-52 h-52 mx-auto bg-white p-3 rounded-xl mb-6 shadow-inner">
               <Image src={qrImagePath} alt="Payment QR Code" fill className="object-contain p-2" priority />
            </div>

            {/* Direct UPI ID with Copy Option */}
            <div className="bg-card border border-border rounded-xl p-3 mb-4 flex items-center justify-between gap-3 text-left">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Official UPI ID</div>
                <div className="font-mono text-sm text-foreground font-bold">offthetrail@upi</div>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-3 py-1.5 rounded bg-background border border-border hover:border-primary/50 text-xs font-mono font-bold text-foreground flex items-center gap-1.5 transition-colors"
              >
                {copiedUpi ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                <span>{copiedUpi ? "Copied" : "Copy"}</span>
              </button>
            </div>

            {/* Mobile UPI Deep-Link Intent */}
            <div className="block sm:hidden mb-4">
              <a
                href={`upi://pay?pa=offthetrail@upi&pn=Dalhousie%20Estate&am=${subtotal}&cu=INR`}
                className="w-full py-2.5 px-4 bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink size={14} /> Pay via Installed UPI App
              </a>
            </div>

            <div className="bg-card text-foreground text-xs p-4 rounded-lg text-left border border-border space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-primary">1.</span>
                <span className="opacity-90">Scan QR code or use UPI ID in Google Pay, PhonePe, or Paytm.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-primary">2.</span>
                <span className="opacity-90">Enter exactly <strong className="font-mono text-primary font-bold">₹{subtotal.toLocaleString()}</strong> and take a screenshot of the payment receipt.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono font-bold text-primary">3.</span>
                <span className="opacity-90">Copy the 12-digit UPI Reference / UTR Number.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 max-w-md mx-auto">
             <button 
               onClick={() => setStep(2)} 
               className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest hover:text-foreground transition-colors"
             >
               Back to Details
             </button>
             <button 
              onClick={() => setStep(4)}
              className="w-full sm:w-auto bg-primary hover:bg-[#D4A35B] active:scale-[0.98] text-primary-foreground px-8 py-3.5 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              I Have Completed Payment <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="space-y-8 animate-fade-in text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <CheckCircle2 className="text-primary" size={32} />
          </div>
          
          <div>
            <h3 className="font-serif text-3xl text-foreground mb-2">Submit Booking Request</h3>
            <p className="text-muted-foreground text-sm">
              Enter your 12-digit UPI UTR number and share your payment receipt on WhatsApp. The estate manager verifies the transaction, checks final room allocation, and issues your confirmed booking voucher.
            </p>
          </div>

          <div className="text-left bg-background p-6 rounded-[3px] border border-border">
            <label htmlFor="booking-utr" className="block text-xs font-mono text-muted-foreground font-bold mb-2 uppercase tracking-widest">
              12-Digit UPI UTR / Transaction ID *
            </label>
            <input 
              id="booking-utr"
              type="text" 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. 4289XXXXXXXX (from payment receipt)"
              className="w-full bg-card border border-border rounded-[3px] px-4 py-3 text-foreground font-mono focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-muted-foreground mt-2 font-mono">
              Found on your Google Pay / PhonePe / Paytm payment success screen.
            </p>
          </div>

          <div className="bg-card border border-border rounded-[3px] p-5 text-left">
            <div className="flex gap-4">
              <div className="shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                  <span className="text-primary text-xs font-mono font-bold">!</span>
                </div>
              </div>
              <div className="text-sm">
                <p className="text-foreground font-semibold mb-1">Payment Verification & Confirmation Process</p>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Submitting your payment details sends a direct booking request to the estate manager. Your reservation is officially confirmed once payment and room allocation are verified by the estate, and your booking voucher will be sent to your WhatsApp number.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-3">
             <a 
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white px-8 py-4 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs transition-all shadow-xl ${transactionId.trim().length < 4 ? 'opacity-40 pointer-events-none' : ''}`}
            >
              <span>Submit Request via WhatsApp</span>
              <ArrowRight size={16} />
            </a>

            {transactionId.trim().length < 4 && (
              <p className="text-xs text-muted-foreground font-mono">
                Please enter your Transaction ID above to activate the WhatsApp button.
              </p>
            )}

            <button
              onClick={() => setStep(3)}
              className="text-xs font-mono text-muted-foreground hover:text-foreground mt-2 uppercase tracking-widest"
            >
              Back to QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
