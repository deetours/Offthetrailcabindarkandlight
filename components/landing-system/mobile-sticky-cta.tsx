"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileStickyCtaProps {
  startingPrice: string
  targetElementId: string
  ctaText: string
}

export function MobileStickyCta({ startingPrice, targetElementId, ctaText }: MobileStickyCtaProps) {
  const [isVisible, setIsVisible] = useState(false)

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
    const target = document.getElementById(targetElementId)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

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
              <div className="text-[10px] uppercase font-mono font-medium tracking-widest text-muted-foreground mb-0.5">Starting from</div>
              <div className="text-foreground font-serif text-lg font-medium">{startingPrice}</div>
            </div>
            <button 
              onClick={scrollToTarget}
              className="bg-primary hover:bg-[#D4A35B] active:scale-[0.98] text-primary-foreground px-6 py-3 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs transition-all shadow-md"
            >
              {ctaText}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
