"use client"

import { useState } from "react"
import { Phone, User, Send, Bell } from "lucide-react"
import type { LandingPageConfig } from "@/lib/landing-configs"

interface ComingSoonEngineProps {
  config: LandingPageConfig
}

export function ComingSoonEngine({ config }: ComingSoonEngineProps) {
  const [guestName, setGuestName] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [sent, setSent] = useState(false)

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName || !guestPhone) return

    const message = `Hello! I'm interested in ${config.name}.\n\n*Name:* ${guestName}\n*Phone:* ${guestPhone}\n\nPlease notify me when bookings open!`
    const encodedMessage = encodeURIComponent(message)
    const waLink = `https://wa.me/${config.ownerWhatsapp.replace("+", "")}?text=${encodedMessage}`

    window.open(waLink, '_blank')
    setSent(true)
  }

  return (
    <section id="coming-soon-ledger" className="bg-ink text-parchment py-16 px-6 md:px-12 lg:px-24 border-t border-mist relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        
        {/* Left Column: Static Room Previews */}
        <div className="flex-1 space-y-12">
          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-parchment mb-4">The Rooms</h3>
            <p className="font-sans text-sm text-moss font-light mb-8 max-w-lg">
              A preview of our spaces. Bookings are not yet open, but you can join the waitlist to be the first to know.
            </p>
          </div>

          <div className="space-y-6">
            {config.rooms.map((room) => (
              <div key={room.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-mist rounded-xl border border-white/5 gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h5 className="font-serif text-xl text-parchment">{room.name}</h5>
                  </div>
                  <p className="font-sans text-sm text-moss font-light mb-3">{room.description}</p>
                  <div className="flex items-center gap-4">
                    <p className="font-mono text-sm text-brass">₹{room.price.toLocaleString()}/night</p>
                    {/* Note: In config, we wrote 'incl. all taxes' inside the prompt text. We can add a generic label or just leave it */}
                    {room.id === 'duplex' && (
                      <span className="font-sans text-[10px] text-moss uppercase tracking-widest bg-ink px-2 py-1 rounded">Incl. All Taxes</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Notify Me CTA */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-24 bg-mist rounded-xl border border-white/5 p-8 flex flex-col gap-8 shadow-2xl">
            
            <div className="border-b border-white/10 pb-6">
              <h4 className="font-serif text-2xl text-parchment mb-2">Join the Waitlist</h4>
              <p className="font-sans text-sm text-moss font-light leading-relaxed">
                Be the first to know when we open our doors. We'll send you a WhatsApp message with priority booking access.
              </p>
            </div>

            {!sent ? (
              <form onSubmit={handleSendToWhatsApp} className="space-y-8 flex flex-col animate-in fade-in duration-500">
                <div className="space-y-4">
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
                  disabled={!guestName || !guestPhone}
                  className="w-full py-4 bg-brass text-ink font-sans text-sm font-semibold uppercase tracking-widest rounded-lg hover:bg-brass/90 transition-colors disabled:opacity-50 disabled:hover:bg-brass flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" /> Notify Me
                </button>
              </form>
            ) : (
              <div className="bg-ink p-8 rounded-lg border border-brass/30 text-center space-y-4 animate-in fade-in duration-500">
                <Send className="w-10 h-10 text-brass mx-auto mb-2" />
                <h5 className="font-serif text-xl text-parchment">Message Generated</h5>
                <p className="font-sans text-sm text-moss font-light leading-relaxed">
                  Hit send in WhatsApp to register your interest! We'll be in touch soon.
                </p>
                <button 
                  onClick={() => setSent(false)}
                  className="text-xs font-sans text-moss hover:text-parchment underline underline-offset-4 mt-4"
                >
                  Send another
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  )
}
