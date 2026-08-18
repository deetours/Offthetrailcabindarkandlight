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
      // Show when scrolled past hero (approx 100vh)
      const scrolledPastHero = window.scrollY > window.innerHeight * 0.8
      
      // Hide if the booking section itself is in view, to avoid overlapping
      const targetElement = document.getElementById(targetElementId)
      let targetInView = false
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        // If the top of the booking section is anywhere in the viewport
        targetInView = rect.top < window.innerHeight && rect.bottom > 0
      }

      setIsVisible(scrolledPastHero && !targetInView)
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
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 w-full z-40 md:hidden"
        >
          <div className="bg-card/95 backdrop-blur-md border-t border-border p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-muted-foreground mb-1">Starting from</div>
              <div className="text-foreground font-serif text-lg">{startingPrice}</div>
            </div>
            <button 
              onClick={scrollToTarget}
              className="bg-primary hover:brightness-110 text-primary-foreground px-6 py-3 font-mono font-bold uppercase tracking-widest text-xs transition-colors"
            >
              {ctaText}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
