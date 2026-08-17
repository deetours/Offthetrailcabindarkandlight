"use client"

import { useState, useMemo } from "react"
import { RoomDef, RoomLedger } from "./room-ledger"
import Image from "next/image"
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react"

interface BookingFlowProps {
  propertyName: string
  rooms: RoomDef[]
  qrImagePath: string
  ownerWhatsApp: string
}

export function BookingFlow({ propertyName, rooms, qrImagePath, ownerWhatsApp }: BookingFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  
  // State
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [transactionId, setTransactionId] = useState("")

  // Compute nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }, [checkIn, checkOut])

  // Compute totals
  const totalRooms = Object.values(quantities).reduce((acc, q) => acc + q, 0)
  const subtotal = rooms.reduce((acc, room) => {
    return acc + (room.price * (quantities[room.id] || 0))
  }, 0) * nights
  const guestCap = totalRooms * 2

  const handleQuantityChange = (roomId: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [roomId]: qty }))
  }

  const generateWhatsAppLink = () => {
    const roomBreakdown = rooms
      .filter(r => quantities[r.id] > 0)
      .map(r => `${quantities[r.id]}x ${r.name}`)
      .join(", ")

    const message = `Hello, I'd like to book ${propertyName}.
Name: ${name}
Phone: ${phone}
Dates: ${checkIn} to ${checkOut} (${nights} nights)
Rooms: ${roomBreakdown}
Total Amount: ₹${subtotal}
Transaction ID: ${transactionId}

Attached is my payment screenshot.`

    return `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#151A17] border border-[#2A332C] rounded-2xl p-6 md:p-10 shadow-2xl relative z-20">
      
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10 text-xs font-mono tracking-widest text-[#8B9A8C]">
        <span className={step >= 1 ? "text-[#C9A227]" : ""}>01. STAY</span>
        <span className="opacity-30">/</span>
        <span className={step >= 2 ? "text-[#C9A227]" : ""}>02. DETAILS</span>
        <span className="opacity-30">/</span>
        <span className={step >= 3 ? "text-[#C9A227]" : ""}>03. PAY</span>
        <span className="opacity-30">/</span>
        <span className={step >= 4 ? "text-[#C9A227]" : ""}>04. CONFIRM</span>
      </div>

      {/* Step 1: Dates & Rooms */}
      {step === 1 && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h3 className="font-serif text-2xl text-[#EDEAE2] mb-6">When are you arriving?</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-mono text-[#8B9A8C] mb-2 uppercase tracking-widest">Check In</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9A8C]" size={16} />
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#0C0F0D] border border-[#2A332C] rounded-lg pl-10 pr-4 py-3 text-[#EDEAE2] font-mono focus:border-[#C9A227] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-mono text-[#8B9A8C] mb-2 uppercase tracking-widest">Check Out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9A8C]" size={16} />
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn}
                    className="w-full bg-[#0C0F0D] border border-[#2A332C] rounded-lg pl-10 pr-4 py-3 text-[#EDEAE2] font-mono focus:border-[#C9A227] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
            {nights > 0 && (
              <p className="mt-3 text-sm text-[#C9A227] font-mono">{nights} night{nights > 1 ? 's' : ''} selected</p>
            )}
          </div>

          <div className="pt-6 border-t border-[#2A332C]">
            <h3 className="font-serif text-2xl text-[#EDEAE2] mb-6">Select Rooms</h3>
            <RoomLedger 
              rooms={rooms} 
              interactive 
              selectedQuantities={quantities} 
              onQuantityChange={handleQuantityChange} 
            />
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-[#2A332C]">
            <div className="text-left w-full sm:w-auto">
              <div className="text-[#8B9A8C] text-sm font-mono mb-1">Total (incl. breakfast)</div>
              <div className="text-[#EDEAE2] font-serif text-3xl">₹{subtotal.toLocaleString()}</div>
            </div>
            <button 
              onClick={() => setStep(2)}
              disabled={nights === 0 || totalRooms === 0}
              className="w-full sm:w-auto bg-[#C9A227] hover:bg-[#D4B344] text-[#0C0F0D] px-8 py-3 rounded-none font-mono uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              Next Step <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-end mb-8 border-b border-[#2A332C] pb-6">
            <div>
              <h3 className="font-serif text-2xl text-[#EDEAE2] mb-2">Guest Details</h3>
              <p className="text-[#8B9A8C] text-sm">Capacity: {guestCap} guests max based on room selection.</p>
            </div>
            <button onClick={() => setStep(1)} className="text-[#C9A227] text-xs font-mono uppercase tracking-widest hover:underline">Edit Stay</button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-[#8B9A8C] mb-2 uppercase tracking-widest">Full Name *</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Last"
                className="w-full bg-[#0C0F0D] border border-[#2A332C] rounded-lg px-4 py-3 text-[#EDEAE2] focus:border-[#C9A227] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8B9A8C] mb-2 uppercase tracking-widest">WhatsApp Number *</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91"
                className="w-full bg-[#0C0F0D] border border-[#2A332C] rounded-lg px-4 py-3 text-[#EDEAE2] font-mono focus:border-[#C9A227] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end border-t border-[#2A332C]">
            <button 
              onClick={() => setStep(3)}
              disabled={name.length < 2 || phone.length < 8}
              className="w-full sm:w-auto bg-[#C9A227] hover:bg-[#D4B344] text-[#0C0F0D] px-8 py-3 rounded-none font-mono uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Pay <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="space-y-8 animate-fade-in text-center">
          <div>
            <h3 className="font-serif text-3xl text-[#EDEAE2] mb-2">Scan to Pay</h3>
            <p className="text-[#8B9A8C] text-sm">Please pay the exact amount below via UPI.</p>
          </div>

          <div className="bg-[#0C0F0D] border border-[#C9A227]/30 rounded-xl p-8 max-w-sm mx-auto shadow-[0_0_40px_rgba(201,162,39,0.1)]">
            <div className="font-mono text-[#8B9A8C] text-xs uppercase tracking-widest mb-2">Amount Due</div>
            <div className="font-mono text-4xl text-[#C9A227] mb-6">₹{subtotal.toLocaleString()}</div>
            
            <div className="relative w-48 h-48 mx-auto bg-white p-2 rounded-lg mb-6">
               <Image src={qrImagePath} alt="Payment QR Code" fill className="object-contain p-2" />
            </div>

            <div className="bg-[#151A17] text-[#EDEAE2] text-xs p-4 rounded text-left border border-[#2A332C]">
              <p className="font-semibold mb-1 text-[#C9A227]">Important:</p>
              <p className="opacity-80">This QR code is static. Please enter the exact amount <span className="font-mono font-bold">₹{subtotal.toLocaleString()}</span> manually in your UPI app.</p>
              <p className="opacity-80 mt-2 font-bold">Take a screenshot of the success screen.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
             <button onClick={() => setStep(2)} className="text-[#8B9A8C] text-xs font-mono uppercase tracking-widest hover:text-[#EDEAE2] transition-colors">Back</button>
             <button 
              onClick={() => setStep(4)}
              className="bg-[#C9A227] hover:bg-[#D4B344] text-[#0C0F0D] px-8 py-3 rounded-none font-mono uppercase tracking-widest text-sm transition-colors flex items-center gap-2"
            >
              I have paid <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="space-y-8 animate-fade-in text-center">
          <div className="w-16 h-16 bg-[#C9A227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-[#C9A227]" size={32} />
          </div>
          
          <div>
            <h3 className="font-serif text-3xl text-[#EDEAE2] mb-4">Almost there.</h3>
            <p className="text-[#8B9A8C] text-base max-w-md mx-auto">
              Enter your UPI transaction ID below, then send us the details on WhatsApp for verification.
            </p>
          </div>

          <div className="max-w-sm mx-auto text-left">
            <label className="block text-xs font-mono text-[#8B9A8C] mb-2 uppercase tracking-widest">Transaction ID / UTR *</label>
            <input 
              type="text" 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. 123456789012"
              className="w-full bg-[#0C0F0D] border border-[#2A332C] rounded-lg px-4 py-3 text-[#EDEAE2] font-mono focus:border-[#C9A227] focus:outline-none transition-colors"
            />
          </div>

          <div className="bg-[#151A17] border border-[#2A332C] rounded-lg p-6 max-w-md mx-auto text-left">
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-[#C9A227]/20 flex items-center justify-center border border-[#C9A227]/50">
                  <span className="text-[#C9A227] text-xs font-mono font-bold">!</span>
                </div>
              </div>
              <div>
                <p className="text-[#EDEAE2] text-sm mb-2">WhatsApp cannot automatically attach images.</p>
                <p className="text-[#8B9A8C] text-sm font-light">
                  When WhatsApp opens, please <strong>manually attach your payment screenshot</strong> before hitting send. Your booking is not confirmed until we reply.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
             <a 
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-none font-mono uppercase tracking-widest text-sm transition-colors ${transactionId.length < 4 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              Send via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
