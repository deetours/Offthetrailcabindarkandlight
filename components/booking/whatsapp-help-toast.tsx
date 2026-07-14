"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface WhatsAppHelpToastProps {
  isVisible: boolean
  onDismiss: () => void
  propertyName: string
}

export function WhatsAppHelpToast({ isVisible, onDismiss, propertyName }: WhatsAppHelpToastProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const message = `Hi! I'm looking at ${propertyName} and need some help choosing a room.`
  const whatsappUrl = `https://wa.me/917629877144?text=${encodeURIComponent(message)}`

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-[100px] md:bottom-8 right-4 md:right-8 z-50 max-w-[calc(100vw-2rem)] md:max-w-sm"
        >
          <div 
            className="bg-card dark:bg-card border border-border shadow-2xl rounded-2xl p-4 pr-12 relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button 
              onClick={onDismiss}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-foreground mb-1">Need help choosing a room?</p>
                <p className="text-xs text-muted-foreground mb-4">Our concierge is online to answer any questions.</p>
                <Link 
                  href={whatsappUrl} 
                  target="_blank"
                  className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                >
                  Ask on WhatsApp
                </Link>
              </div>
            </div>
            
            {/* Subtle progress bar to draw attention */}
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: isHovered ? "0%" : "100%" }}
              transition={{ duration: 10, ease: "linear" }}
              onAnimationComplete={onDismiss}
              className="absolute bottom-0 left-0 h-[2px] bg-primary/20"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
