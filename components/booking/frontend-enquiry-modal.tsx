"use client"

import * as React from "react"
import { useState } from "react"
import { X, ArrowLeft, Send, ArrowRight } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { OFFTHETRAIL_DATA } from "@/lib/frontend-data"
import { useRouter } from "next/navigation"

export type EnquiryTab = "stay" | "adventure"

interface FrontendEnquiryModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: EnquiryTab
  initialLocation?: string
}

export function FrontendEnquiryModal({ isOpen, onClose, initialTab = "stay", initialLocation = "" }: FrontendEnquiryModalProps) {
  const router = useRouter()
  const [tab, setTab] = useState<EnquiryTab>(initialTab)

  // Stay Flow State
  const [stayStep, setStayStep] = useState(1)
  const [stayLocation, setStayLocation] = useState(initialLocation)
  const [stayDates, setStayDates] = useState("") 
  const [guests, setGuests] = useState("2")
  const [room, setRoom] = useState("")

  // Adventure Flow State
  const [advDestination, setAdvDestination] = useState("")
  const [advType, setAdvType] = useState("")
  const [advDates, setAdvDates] = useState("")
  const [advTravellers, setAdvTravellers] = useState("2")

  // Common User State
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update initial states if props change
  React.useEffect(() => {
    if (isOpen) {
      if (initialTab) setTab(initialTab)
      if (initialLocation) setStayLocation(initialLocation)
      setStayStep(1)
    }
  }, [isOpen, initialTab, initialLocation])

  React.useEffect(() => {
    if (stayLocation && typeof window !== "undefined") {
      const selectedStayData = OFFTHETRAIL_DATA.stays.find(s => s.id === stayLocation)
      if (selectedStayData) {
        localStorage.setItem('offthetrail_last_stay_id', stayLocation)
        localStorage.setItem('offthetrail_last_stay_name', selectedStayData.name)
      }
    }
  }, [stayLocation])

  const validateEnquiry = () => {
    const newErrors: Record<string, string> = {}
    if (!stayDates) newErrors.stayDates = "Please enter dates"
    if (!guests || parseInt(guests) < 1) newErrors.guests = "Invalid guest count"
    if (!name) newErrors.name = "Name is required"
    if (!phone) newErrors.phone = "Phone is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateAdventure = () => {
    const newErrors: Record<string, string> = {}
    if (!advDestination) newErrors.advDestination = "Please select a destination"
    if (!advDates) newErrors.advDates = "Please enter dates"
    if (!name) newErrors.name = "Name is required"
    if (!phone) newErrors.phone = "Phone is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBookNow = () => {
    if (!stayLocation) {
      setErrors({ stayLocation: "Please select a location to book." })
      return
    }
    const selectedStayData = OFFTHETRAIL_DATA.stays.find(s => s.id === stayLocation)
    const roomName = selectedStayData?.rooms.find(r => r.id === room)?.name
    const roomParam = roomName ? `?room=${encodeURIComponent(roomName)}` : ""
    router.push(`/booking/stay/${stayLocation}${roomParam}`)
    onClose()
  }

  const handleStayEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEnquiry()) return

    const message = `Stay Enquiry\nLocation: ${stayLocation}\nRoom: ${room || 'Any'}\nDates: ${stayDates}\nGuests: ${guests}\nName: ${name}\nPhone: ${phone}${email ? '\nEmail: ' + email : ''}${notes ? '\nNotes: ' + notes : ''}`
    const link = `https://wa.me/${OFFTHETRAIL_DATA.whatsapp_number}?text=${encodeURIComponent(message)}`
    window.open(link, "_blank")
    onClose()
  }

  const handleAdventureSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAdventure()) return

    const message = `Adventure Enquiry\nDestination: ${advDestination}\nType: ${advType}\nDates: ${advDates}\nTravellers: ${advTravellers}\nName: ${name}\nPhone: ${phone}${email ? '\nEmail: ' + email : ''}${notes ? '\nNotes: ' + notes : ''}`
    const link = `https://wa.me/${OFFTHETRAIL_DATA.whatsapp_number}?text=${encodeURIComponent(message)}`
    window.open(link, "_blank")
    onClose()
  }

  const selectedStayData = OFFTHETRAIL_DATA.stays.find(s => s.id === stayLocation)

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg border-l border-border p-0 flex flex-col bg-background/95 backdrop-blur-xl modal-bg-fix max-md:h-[100dvh] max-md:max-w-none">
        <SheetHeader className="p-6 border-b border-border relative">
          <div className="flex items-center gap-4">
            <button onClick={() => {
              if (tab === "stay" && stayStep === 2) {
                setStayStep(1)
              } else {
                onClose()
              }
            }} className="p-2 hover:bg-secondary rounded-full transition-colors" aria-label="Back or Close">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div>
              <SheetTitle className="font-serif text-2xl text-foreground">Start Your Journey</SheetTitle>
              <SheetDescription className="text-muted-foreground text-sm mt-1">Select your path into the mountains</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {(!tab || (tab === "stay" && stayStep === 1)) && (
          <div className="flex border-b border-border">
            <button 
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${tab === "stay" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => { setTab("stay"); setStayStep(1); }}
            >
              Find a Stay
            </button>
            <button 
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${tab === "adventure" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setTab("adventure")}
            >
              Adventure
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-48">
          {tab === "stay" ? (
            stayStep === 1 ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-foreground">Where would you like to stay?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {OFFTHETRAIL_DATA.stays.map(stay => (
                      <div 
                        key={stay.id} 
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${stayLocation === stay.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-secondary'}`}
                        onClick={() => { setStayLocation(stay.id); setRoom(""); setErrors({}); }}
                      >
                        <h4 className="font-bold text-foreground text-sm">{stay.location}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{stay.name}</p>
                      </div>
                    ))}
                  </div>
                  {errors.stayLocation && <p className="text-destructive text-xs mt-1">{errors.stayLocation}</p>}
                </div>

                {stayLocation && selectedStayData && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="font-serif text-xl text-foreground">Choose your space <span className="text-muted-foreground text-sm">(Optional)</span></h3>
                    <div className="space-y-3">
                      {selectedStayData.rooms.map(r => (
                        <div 
                          key={r.id} 
                          className={`cursor-pointer rounded-xl border p-4 transition-all ${room === r.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-secondary'}`}
                          onClick={() => setRoom(r.id)}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-foreground text-sm">{r.name}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
                          <p className="text-[10px] uppercase tracking-widest text-primary/80 mt-2 font-bold">{r.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form id="stay-enquiry-form" onSubmit={handleStayEnquirySubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-foreground">Enquiry Details</h3>
                  <p className="text-sm text-muted-foreground">We'll get back to you via WhatsApp to help plan your stay.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Dates (Approx)</label>
                      <input type="text" placeholder="e.g. 12 Oct - 15 Oct" className="w-full bg-card border border-border rounded-lg p-4 text-sm text-foreground focus:border-primary focus:outline-none" value={stayDates} onChange={e => setStayDates(e.target.value)} />
                      {errors.stayDates && <p className="text-destructive text-xs mt-1">{errors.stayDates}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Guests</label>
                      <input type="number" min="1" className="w-full bg-card border border-border rounded-lg p-4 text-sm text-foreground focus:border-primary focus:outline-none" value={guests} onChange={e => setGuests(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Name</label>
                    <input type="text" className="w-full bg-card border border-border rounded-lg p-4 text-sm text-foreground focus:border-primary focus:outline-none" value={name} onChange={e => setName(e.target.value)} />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">WhatsApp Number</label>
                    <input type="tel" className="w-full bg-card border border-border rounded-lg p-4 text-sm text-foreground focus:border-primary focus:outline-none" value={phone} onChange={e => setPhone(e.target.value)} />
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </form>
            )
          ) : (
            <form id="adventure-form" onSubmit={handleAdventureSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-foreground">Select a Journey</h3>
                <div className="space-y-3">
                  {OFFTHETRAIL_DATA.journeys.map(j => (
                    <div 
                      key={j.id} 
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${advDestination === j.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-secondary'}`}
                      onClick={() => { setAdvDestination(j.id); setAdvType(j.type); }}
                    >
                      <h4 className="font-bold text-foreground text-sm">{j.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{j.description}</p>
                    </div>
                  ))}
                </div>
                {errors.advDestination && <p className="text-destructive text-xs mt-1">{errors.advDestination}</p>}
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-serif text-xl text-foreground">Your details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Preferred Dates</label>
                    <input type="text" placeholder="e.g. October" className="w-full bg-card border border-border rounded-lg p-4 text-sm text-foreground focus:border-primary focus:outline-none" value={advDates} onChange={e => setAdvDates(e.target.value)} />
                    {errors.advDates && <p className="text-destructive text-xs mt-1">{errors.advDates}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Travellers</label>
                    <input type="number" min="1" className="w-full bg-card border border-border rounded-lg p-4 text-sm text-foreground focus:border-primary focus:outline-none" value={advTravellers} onChange={e => setAdvTravellers(e.target.value)} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Name</label>
                  <input type="text" className="w-full bg-card border border-border rounded-lg p-4 text-sm text-foreground focus:border-primary focus:outline-none" value={name} onChange={e => setName(e.target.value)} />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">WhatsApp Number</label>
                  <input type="tel" className="w-full bg-card border border-border rounded-lg p-4 text-sm text-foreground focus:border-primary focus:outline-none" value={phone} onChange={e => setPhone(e.target.value)} />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Sticky bottom CTA area using pb-safe concept */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-background/95 backdrop-blur-xl modal-bg-fix pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
          {tab === "stay" ? (
            stayStep === 1 ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleBookNow}
                  className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <span>Continue to Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (!stayLocation) {
                      setErrors({ stayLocation: "Please select a location first." })
                      return
                    }
                    setStayStep(2)
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-card border border-border text-foreground hover:bg-secondary py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
                >
                  <span>Enquire Instead</span>
                </button>
              </div>
            ) : (
              <button
                type="submit"
                form="stay-enquiry-form"
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-transform hover:scale-[1.02] active:scale-95"
              >
                <span>Send via WhatsApp</span>
                <Send className="w-4 h-4" />
              </button>
            )
          ) : (
            <button
              type="submit"
              form="adventure-form"
              className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-transform hover:scale-[1.02] active:scale-95"
            >
              <span>Prepare WhatsApp Enquiry</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
