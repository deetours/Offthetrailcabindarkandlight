"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, ArrowRight } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

interface MobileStickyCtaProps {
  startingPrice?: string
  targetElementId?: string
  ctaText?: string
}

export function MobileStickyCta({
  startingPrice = "₹3,200/night",
  targetElementId = "rooms",
  ctaText = "Explore rooms & enquire",
}: MobileStickyCtaProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [liveSelection, setLiveSelection] = useState<{
    isReady: boolean
    subtotal: number
    whatsappUrl?: string
  }>({ isReady: false, subtotal: 0 })

  // Listen for real-time stay selection changes from BookingFlow
  useEffect(() => {
    const handleSelectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{
        isSelectionReady?: boolean
        subtotal?: number
        whatsappUrl?: string
      }>
      if (customEvent.detail) {
        setLiveSelection({
          isReady: !!customEvent.detail.isSelectionReady,
          subtotal: customEvent.detail.subtotal || 0,
          whatsappUrl: customEvent.detail.whatsappUrl,
        })
      }
    }

    window.addEventListener("dalhousie_stay_selection_change", handleSelectionChange)
    return () => window.removeEventListener("dalhousie_stay_selection_change", handleSelectionChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero (approx 80vh)
      const scrolledPastHero = window.scrollY > window.innerHeight * 0.8

      // Hide if the booking section itself is in view, to avoid competing controls
      const targetElement = document.getElementById(targetElementId)
      let targetInView = false
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        targetInView = rect.top < window.innerHeight && rect.bottom > 0
      }

      // Hide when user reaches the footer so links and copyright are never obstructed
      const footerElement = document.querySelector("footer")
      let footerInView = false
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect()
        footerInView = footerRect.top <= window.innerHeight - 20
      }

      setIsVisible(scrolledPastHero && !targetInView && !footerInView)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [targetElementId])

  const scrollToTarget = () => {
    trackEvent({
      action: "booking_cta_click",
      category: "engagement",
      label: ctaText,
      property: "Dalhousie Estate",
    })
    const target = document.getElementById(targetElementId)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleWhatsAppClick = () => {
    trackEvent({
      action: "whatsapp_click",
      category: "lead",
      label: "dalhousie_mobile_sticky",
      context: "dalhousie_estate",
    })
  }

  const isSelectionActive = liveSelection.isReady && liveSelection.subtotal > 0

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="fixed bottom-0 left-0 w-full z-40 md:hidden"
        >
          <div className="bg-card/95 backdrop-blur-md border-t border-border px-5 py-3.5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase font-mono font-medium tracking-widest text-muted-foreground mb-0.5">
                {isSelectionActive ? "Estimated stay" : "Starting from"}
              </div>
              <div className="text-foreground font-serif text-lg font-bold">
                {isSelectionActive
                  ? `₹${liveSelection.subtotal.toLocaleString("en-IN")}`
                  : startingPrice}
              </div>
            </div>

            {isSelectionActive && liveSelection.whatsappUrl && liveSelection.whatsappUrl !== "#" ? (
              <a
                href={liveSelection.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="bg-primary hover:bg-[#D4A35B] active:scale-[0.98] text-primary-foreground px-5 py-3 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <span>Continue on WhatsApp</span>
                <MessageSquare size={14} className="shrink-0" />
              </a>
            ) : (
              <button
                onClick={scrollToTarget}
                className="bg-primary hover:bg-[#D4A35B] active:scale-[0.98] text-primary-foreground px-6 py-3 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <span>{ctaText}</span>
                <ArrowRight size={13} className="shrink-0" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
