"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { X, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { trackEvent } from "@/lib/analytics"

export const DEFAULT_OFFTHETRAIL_WA_NUMBER = "919816315898"

export function getOffTheTrailWaNumber(): string {
  const raw = process.env.NEXT_PUBLIC_OFFTHETRAIL_WA_NUMBER || DEFAULT_OFFTHETRAIL_WA_NUMBER
  return raw.replace(/[^0-9]/g, "")
}

export function buildWaLink(message: string, recipientNumber?: string): string {
  const number = (recipientNumber ? recipientNumber.replace(/[^0-9]/g, "") : "") || getOffTheTrailWaNumber()
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function WhatsAppPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)

    const hostname = typeof window !== "undefined" ? window.location.hostname : ""
    const isDalhousie = 
      hostname.includes("dalhousie") || 
      pathname?.includes("dalhousie") || 
      pathname?.includes("/stays/dalhousie-estate")

    // Dalhousie Estate provides dedicated, contextual concierge actions throughout the page
    if (isDalhousie) return

    // Never auto-pop unprovoked on focused booking or stay pages
    const isBookingOrStayRoute = 
      pathname?.includes('/stays') || 
      pathname?.includes('/booking') || 
      pathname?.includes('jibhi')
    
    if (isBookingOrStayRoute) return

    // Show popup after scrolling past 1 screen on general browsing pages only
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight && !isOpen && !localStorage.getItem("offthetrail_whatsapp_shown")) {
        setTimeout(() => {
          setIsOpen(true)
          localStorage.setItem("offthetrail_whatsapp_shown", "true")
        }, 1000)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isOpen, pathname])

  if (!mounted) return null

  const hostname = typeof window !== "undefined" ? window.location.hostname : ""
  const isDalhousie = 
    hostname.includes("dalhousie") || 
    pathname?.includes("dalhousie") || 
    pathname?.includes("/stays/dalhousie-estate")

  if (isDalhousie) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedPhone = phoneNumber.trim()

    // 1. If phone number entered, log lead in database (fire-and-forget)
    if (trimmedPhone) {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: trimmedPhone,
          source: 'whatsapp_popup'
        })
      }).catch(err => console.warn('Lead logging failed:', err))

      trackEvent({
        action: 'generate_lead',
        category: 'conversion',
        lead_source: 'whatsapp_popup',
      })
    }

    // 2. WhatsApp link redirect (opens regardless of phone input)
    trackEvent({
      action: 'whatsapp_click',
      category: 'lead',
      context: 'popup',
    })

    const message = `I've been wandering through your collection. I'm ready to find a place where I actually belong. Could you guide me?`
    const whatsappLink = buildWaLink(message)
    window.open(whatsappLink, "_blank")
    setIsOpen(false)
  }


  if (!mounted) return null

  return (
    <>
      {/* Non-intrusive backdrop (dismisses popup on click without locking user interaction) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 md:bg-transparent"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Popup */}
      <div
        className={`fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] right-4 md:bottom-8 md:right-8 z-40 transition-all duration-300 ease-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
          }`}
      >
        <div className="bg-card rounded-2xl p-6 max-w-sm shadow-2xl border border-primary/30 backdrop-blur-xl">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="pr-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg text-foreground">Chat with us</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Have questions? Send your WhatsApp number and we&apos;ll reach out with personalized recommendations.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="tel"
                placeholder="Your WhatsApp number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-muted-foreground/20 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary text-sm font-mono"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all font-sans text-sm font-medium"
              >
                Connect on WhatsApp
              </button>
            </form>

            <p className="text-xs text-muted-foreground/60 mt-3 text-center font-mono">
              We usually respond in &lt;5 minutes
            </p>
          </div>
        </div>
      </div>

      {/* Floating button (when closed) - spaced to never overlap bottom sticky CTA */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] md:bottom-8 right-4 md:right-8 z-30 bg-primary text-primary-foreground rounded-full p-3.5 shadow-2xl hover:brightness-110 transition-colors"
          aria-label="Open WhatsApp chat"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      )}
    </>
  )
}
