"use client"

import { useState, useMemo } from "react"
import { Calendar, Users, Phone, User, CheckCircle2 } from "lucide-react"

// Hardcoded Dalhousie Inventory
const ROOMS = [
  {
    id: "super_deluxe",
    name: "Super Deluxe",
    description: "Wake up to the ridge from your own balcony.",
    price: 4800,
    available: 4,
    numbers: "01–04"
  },
  {
    id: "deluxe",
    name: "Deluxe",
    description: "Attached balcony, sweeping valley views.",
    price: 4000,
    available: 2,
    numbers: "05–06"
  },
  {
    id: "standard",
    name: "Standard",
    description: "Window views, warm colonial interiors.",
    price: 3200,
    available: 4,
    numbers: "07–10"
  }
]

// Note: Ensure user replaces this with their actual WhatsApp number
const OWNER_WHATSAPP = "+919816315898" 

export function BookingEngine() {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [roomSelection, setRoomSelection] = useState<Record<string, number>>({
    super_deluxe: 0,
    deluxe: 0,
    standard: 0
  })
  const [guestCount, setGuestCount] = useState(2)
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

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
    ROOMS.forEach(room => {
      total += (roomSelection[room.id] || 0) * room.price
    })
    return total * (nights || 1) // Default to 1 night for display if dates not picked yet
  }, [roomSelection, nights])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkIn || !checkOut || totalRooms === 0 || !guestName || !guestPhone) return

    // Construct WhatsApp Message
    let roomSummary = ""
    ROOMS.forEach(room => {
      const qty = roomSelection[room.id]
      if (qty > 0) {
        roomSummary += `- ${qty}x ${room.name} (Rooms ${room.numbers})\n`
      }
    })

    const message = `Hello! I'd like to request a booking at Dalhousie Estate.\n\n*Name:* ${guestName}\n*Phone:* ${guestPhone}\n*Dates:* ${checkIn} to ${checkOut} (${nights} nights)\n*Guests:* ${guestCount}\n\n*Rooms Requested:*\n${roomSummary}\n*Estimated Total:* ₹${subtotal.toLocaleString()} (incl. breakfast)\n\nPlease let me know if these are available and how to proceed with payment.`
    
    const encodedMessage = encodeURIComponent(message)
    const waLink = `https://wa.me/${OWNER_WHATSAPP.replace("+", "")}?text=${encodedMessage}`

    // Redirect to WhatsApp
    window.open(waLink, '_blank')
    setIsSubmitted(true)
  }

  return (
    <section id="booking-ledger" className="bg-ink text-parchment py-16 px-6 md:px-12 lg:px-24 border-t border-mist">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        
        {/* Left Column: The Ledger */}
        <div className="flex-1 space-y-16">
          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-parchment mb-8">The Guest Ledger</h3>
            
            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-mist p-6 rounded-xl border border-white/5">
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
          <div className="space-y-6">
            <h4 className="font-sans text-xs text-moss uppercase tracking-widest border-b border-white/10 pb-4">
              Select Rooms
            </h4>
            
            <div className="space-y-6">
              {ROOMS.map((room) => {
                const qty = roomSelection[room.id]
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
                         <span className="font-sans text-[10px] text-ember uppercase tracking-widest">{room.available} left (Max reached)</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-24 bg-mist rounded-xl border border-white/5 p-8 flex flex-col gap-8 shadow-2xl">
            <div>
              <h4 className="font-serif text-2xl text-parchment mb-1">Your Stay</h4>
              <p className="font-mono text-sm text-moss">
                {nights} {nights === 1 ? 'night' : 'nights'} • {totalRooms} {totalRooms === 1 ? 'room' : 'rooms'}
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-ink p-6 rounded-lg border border-brass/30 text-center space-y-4">
                <CheckCircle2 className="w-8 h-8 text-brass mx-auto" />
                <h5 className="font-serif text-lg text-parchment">Request Sent</h5>
                <p className="font-sans text-sm text-moss font-light">
                  Your WhatsApp message has been generated. The owner will reply shortly to confirm availability and process your payment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 flex flex-col">
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

                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <p className="font-sans text-xs text-moss uppercase tracking-widest mb-1">Subtotal</p>
                    <p className="font-mono text-xs text-moss">Incl. Taxes & Breakfast</p>
                  </div>
                  <p className="font-mono text-3xl text-brass tracking-tight">₹{subtotal.toLocaleString()}</p>
                </div>

                <button 
                  type="submit"
                  disabled={totalRooms === 0 || nights === 0}
                  className="w-full py-4 bg-brass text-ink font-sans text-sm font-semibold uppercase tracking-widest rounded-lg hover:bg-brass/90 transition-colors disabled:opacity-50 disabled:hover:bg-brass"
                >
                  Request to Book
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
