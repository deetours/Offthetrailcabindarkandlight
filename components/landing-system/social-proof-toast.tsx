"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface ReviewDef {
  quote: string
  name: string
  location: string
}

interface SocialProofToastProps {
  reviews: ReviewDef[]
}

export function SocialProofToast({ reviews }: SocialProofToastProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!reviews || reviews.length === 0) return

    // Simple implementation: show a toast every 15 seconds for 5 seconds
    const interval = setInterval(() => {
      setIsVisible(true)
      
      setTimeout(() => {
        setIsVisible(false)
        setCurrentIndex((prev) => (prev + 1) % reviews.length)
      }, 6000) // Stay visible for 6s
      
    }, 20000) // Show every 20s

    return () => clearInterval(interval)
  }, [reviews])

  if (!reviews || reviews.length === 0) return null

  const currentReview = reviews[currentIndex]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.5 } }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 max-w-sm pointer-events-none"
        >
          <div className="bg-card/90 backdrop-blur-md border border-border p-5 shadow-2xl rounded-sm">
            <p className="font-serif text-sm md:text-base text-foreground italic mb-3 leading-relaxed">
              "{currentReview.quote}"
            </p>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider">
              <span className="text-primary font-bold uppercase">{currentReview.name}</span>
              <span className="text-muted-foreground opacity-50">/</span>
              <span className="text-muted-foreground">{currentReview.location}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
