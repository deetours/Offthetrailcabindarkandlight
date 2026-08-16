"use client"

import { useState, useMemo } from "react"
import { Calendar, Users, Phone, User, QrCode, Send } from "lucide-react"
import Image from "next/image"
import type { LandingPageConfig } from "@/lib/landing-configs"

interface BookingEngineProps {
  config: LandingPageConfig
}

type Step = "SELECTION" | "PAYMENT" | "CONFIRMATION"

export function BookingEngineV2({ config }: BookingEngineProps) {
  const [step, setStep] = useState<Step>("SELECTION")
  
  // Form State
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [roomSelection, setRoomSelection] = useState<Record<string, number>>({})
  const [guestCount, setGuestCount] = useState(2)
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [transactionId, setTransactionId] = useState("")

  // Math
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }, [checkIn, checkOut])

  const totalRooms = Object.values(roomSelection).reduce((a, b) => a + b, 0)
  const maxGuests = totalRooms > 0 ? totalRooms * 2 : 2

  const subtotal = useMemo(() => {
    let total = 0
    config.rooms.forEach(room => {
      total += (roomSelection[room.id] || 0) * room.price
    })
    return total * (nights || 1) // Default to 1 night for display if dates not picked yet
  }, [roomSelection, nights, config.rooms])

  // Handlers
  const handleRoomChange = (id: string, delta: number, available: number) => {
    setRoomSelection(prev => {
      const current = prev[id] || 0
      const next = current + delta
      if (next >= 0 && next <= available) {
        return { ...prev, [id]: next }
      }
      return prev
    })
  }

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkIn || !checkOut || totalRooms === 0 || !guestName || !guestPhone) return
    setStep("PAYMENT")
  }

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!transactionId) return

    // Construct WhatsApp Message
    let roomSummary = ""
    config.rooms.forEach(room => {
      const qty = roomSelection[room.id]
      if (qty > 0) {
        roomSummary += `- ${qty}x ${room.name} (Rooms ${room.numbers})\n`
      }
    })

    const message = `Hello! I have completed payment for a booking at ${config.name}.\n\n*Guest:* ${guestName}\n*Phone:* ${guestPhone}\n*Dates:* ${checkIn} to ${checkOut} (${nights} nights)\n*Guests:* ${guestCount}\n\n*Rooms Requested:*\n${roomSummary}\n*Total Paid:* ₹${subtotal.toLocaleString()}\n*Transaction ID:* ${transactionId}\n\n[Please find my payment screenshot attached]`
    
    const encodedMessage = encodeURIComponent(message)
    const waLink = `https://wa.me/${config.ownerWhatsapp.replace("+", "")}?text=${encodedMessage}`

    window.open(waLink, '_blank')
    setStep("CONFIRMATION")
  }

  return (
    <section id="booking-ledger" className="bg-ink text-parchment py-16 px-6 md:px-12 lg:px-24 border-t border-mist relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        
        {/* Left Column: The Ledger */}
        <div className="flex-1 space-y-16">
          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-parchment mb-8">The Guest Ledger</h3>
            
            {/* Dates */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 bg-mist p-6 rounded-xl border border-white/5 transition-opacity ${step !== "SELECTION" ? "opacity-50 pointer-events-none" : ""}`}>
              <div>
                <label className="flex items-center gap-2 text-xs font-sans text-moss uppercase tracking-widest mb-2">
                  <Calendar className="w-3 h-3" /> Check-in
                </label>
                <input 
                  type="date" 
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-ink border border-white/10 text-parchment px-4 py-3 rounded-lg focus:outline-none focus:border-brass font-mono text-sm transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-sans text-moss uppercase tracking-widest mb-2">
                  <Calendar className="w-3 h-3" /> Check-out
                </label>
                <input 
                  type="date" 
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-ink border border-white/10 text-parchment px-4 py-3 rounded-lg focus:outline-none focus:border-brass font-mono text-sm transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Rooms */}
          <div className={`space-y-6 ${step !== "SELECTION" ? "opacity-50 pointer-events-none" : ""}`}>
            <h4 className="font-sans text-xs text-moss uppercase tracking-widest border-b border-white/10 pb-4">
              Select Rooms
            </h4>
            
            <div className="space-y-6">
              {config.rooms.map((room) => {
                const qty = roomSelection[room.id] || 0
                return (
                  <div key={room.id} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-mist rounded-xl border border-white/5 hover:border-white/15 transition-colors gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-moss text-xs">{room.numbers}</span>
                        <h5 className="font-serif text-xl text-parchment">{room.name}</h5>
                      </div>
                      <p className="font-sans text-sm text-moss font-light mb-3">{room.description}</p>
                      <div className="flex items-center gap-4">
                        <p className="font-mono text-sm text-brass">₹{room.price.toLocaleString()}/night</p>
                        <span className="font-sans text-[10px] text-moss uppercase tracking-widest bg-ink px-2 py-1 rounded">Incl. Breakfast</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-4 bg-ink rounded-lg p-1 border border-white/10">
                        <button 
                          onClick={() => handleRoomChange(room.id, -1, room.available)}
                          disabled={qty === 0}
                          className="w-8 h-8 flex items-center justify-center text-moss hover:text-parchment disabled:opacity-30 disabled:hover:text-moss transition-colors"
                        >
                          -
                        </button>
                        <span className="font-mono text-parchment min-w-[20px] text-center">{qty}</span>
                        <button 
                          onClick={() => handleRoomChange(room.id, 1, room.available)}
                          disabled={qty === room.available}
                          className="w-8 h-8 flex items-center justify-center text-moss hover:text-parchment disabled:opacity-30 disabled:hover:text-moss transition-colors"
                        >
                          +
                        </button>
                      </div>
                      {qty === room.available && room.available > 0 && (
                         <span className="font-sans text-[10px] text-ember uppercase tracking-widest">{room.available} left</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary & Checkout Flow */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-24 bg-mist rounded-xl border border-white/5 p-8 flex flex-col gap-8 shadow-2xl">
            
            {/* Header: Always visible */}
            <div className="flex justify-between items-start border-b border-white/10 pb-6">
              <div>
                <h4 className="font-serif text-2xl text-parchment mb-1">Your Stay</h4>
                <p className="font-mono text-sm text-moss">
                  {nights} {nights === 1 ? 'night' : 'nights'} • {totalRooms} {totalRooms === 1 ? 'room' : 'rooms'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-sans text-[10px] text-moss uppercase tracking-widest mb-1">Subtotal</p>
                <p className="font-mono text-2xl text-brass tracking-tight">₹{subtotal.toLocaleString()}</p>
              </div>
            </div>

            {/* FLOW STATE 1: SELECTION */}
            {step === "SELECTION" && (
              <form onSubmit={handleProceedToPayment} className="space-y-8 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-sans text-moss uppercase tracking-widest mb-2">
                      <Users className="w-3 h-3" /> Guests (Max {maxGuests})
                    </label>
                    <input 
                      type="number" 
                      min={1}
                      max={maxGuests}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-ink border border-white/10 text-parchment px-4 py-3 rounded-lg focus:outline-none focus:border-brass font-mono text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-sans text-moss uppercase tracking-widest mb-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input 
                      type="text" 
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-ink border border-white/10 text-parchment px-4 py-3 rounded-lg focus:outline-none focus:border-brass font-sans text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-sans text-moss uppercase tracking-widest mb-2">
                      <Phone className="w-3 h-3" /> WhatsApp Number
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full bg-ink border border-white/10 text-parchment px-4 py-3 rounded-lg focus:outline-none focus:border-brass font-mono text-sm transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={totalRooms === 0 || nights === 0}
                  className="w-full py-4 bg-brass text-ink font-sans text-sm font-semibold uppercase tracking-widest rounded-lg hover:bg-brass/90 transition-colors disabled:opacity-50 disabled:hover:bg-brass"
                >
                  Proceed to Payment
                </button>
              </form>
            )}

            {/* FLOW STATE 2: PAYMENT */}
            {step === "PAYMENT" && (
              <form onSubmit={handleSendToWhatsApp} className="space-y-8 flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <div className="bg-ink p-4 rounded-lg border border-white/10 text-center flex flex-col items-center">
                    <QrCode className="w-6 h-6 text-brass mb-3" />
                    <p className="font-sans text-sm text-parchment mb-4">Pay securely via UPI to <br/><span className="font-medium text-brass">{config.name}</span></p>
                    
                    <div className="relative w-48 h-48 bg-white p-2 rounded-lg mb-4">
                      <Image 
                        src="/images/qr-code.jpeg"
                        alt="UPI Payment QR Code"
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    <div className="bg-brass/10 border border-brass/20 text-brass px-4 py-3 rounded-lg w-full mt-2">
                      <p className="font-sans text-xs mb-1">Scan and pay exactly:</p>
                      <p className="font-mono text-xl tracking-tight">₹{subtotal.toLocaleString()}</p>
                    </div>
                    <p className="font-sans text-[11px] text-moss mt-3 px-2 leading-relaxed">
                      *Scan using Google Pay, PhonePe, or Paytm. Ensure you manually enter the exact amount shown above.
                    </p>
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center justify-between text-xs font-sans text-moss uppercase tracking-widest mb-2">
                      <span>Transaction ID / UTR</span>
                      <span className="text-ember">Required</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 31234567890"
                      className="w-full bg-ink border border-white/10 text-parchment px-4 py-3 rounded-lg focus:outline-none focus:border-brass font-mono text-sm transition-colors"
                    />
                    <p className="font-sans text-[11px] text-moss mt-2">
                      After paying, enter your reference number here. <strong className="text-parchment font-medium">Please screenshot your payment success screen</strong> — you will need to attach it in the next step.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setStep("SELECTION")}
                    className="px-6 py-4 border border-white/10 text-parchment font-sans text-sm font-semibold uppercase tracking-widest rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={!transactionId}
                    className="flex-1 py-4 bg-brass text-ink font-sans text-sm font-semibold uppercase tracking-widest rounded-lg hover:bg-brass/90 transition-colors disabled:opacity-50 disabled:hover:bg-brass flex justify-center items-center gap-2"
                  >
                    Confirm & Send <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* FLOW STATE 3: CONFIRMATION */}
            {step === "CONFIRMATION" && (
              <div className="bg-ink p-8 rounded-lg border border-brass/30 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Send className="w-10 h-10 text-brass mx-auto" />
                <div>
                  <h5 className="font-serif text-xl text-parchment mb-2">Message Generated</h5>
                  <p className="font-sans text-sm text-moss font-light leading-relaxed">
                    Your booking details have been sent to WhatsApp. 
                  </p>
                </div>
                
                <div className="bg-mist p-4 border border-white/5 rounded text-left">
                  <p className="font-sans text-xs text-parchment font-medium uppercase tracking-widest mb-2 text-center text-ember">
                    Important Next Step
                  </p>
                  <p className="font-sans text-sm text-moss font-light text-center">
                    Please <strong className="text-parchment">attach your payment screenshot</strong> in WhatsApp before hitting send so {config.name} can verify instantly.
                  </p>
                </div>

                <button 
                  onClick={() => window.location.reload()}
                  className="text-xs font-sans text-moss hover:text-parchment underline underline-offset-4"
                >
                  Start over
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
