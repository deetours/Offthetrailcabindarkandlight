"use client"

import { Minus, Plus, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export interface RoomDef {
  id: string
  name: string
  description: string
  price: number
  priceLabel?: string
  imageSrc?: string
  // Optional for backward compatibility with preview pages
  available?: number
  roomNumbers?: string
  sqft?: string
  bed?: string
  view?: string
  features?: string[]
}

interface RoomLedgerProps {
  rooms: RoomDef[]
  interactive?: boolean
  selectedQuantities?: Record<string, number>
  onQuantityChange?: (roomId: string, qty: number) => void
  ownerWhatsApp?: string
  checkIn?: string
  checkOut?: string
  guests?: number
}

export function RoomLedger({ 
  rooms, 
  interactive = false, 
  selectedQuantities = {}, 
  onQuantityChange,
  ownerWhatsApp,
  checkIn,
  checkOut,
  guests
}: RoomLedgerProps) {
  
  const getRoomWhatsAppLink = (room: RoomDef) => {
    if (!ownerWhatsApp) return "#"
    const cleanNumber = ownerWhatsApp.replace(/[^0-9]/g, "")
    let message = ""
    if (checkIn && checkOut) {
      const guestText = guests ? ` (${guests} guests)` : ""
      message = `Hi, I'm interested in the ${room.name} for ${checkIn} to ${checkOut}${guestText} at Dalhousie Estate. Can you assist me with a few questions?`
    } else {
      message = `Hi, I have a question about the ${room.name} at Dalhousie Estate.`
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="w-full flex flex-col gap-5">
      {rooms.map((room) => {
        const qty = selectedQuantities[room.id] || 0
        const isSelected = qty > 0

        return (
          <div 
            key={room.id} 
            className={`relative flex flex-col sm:flex-row sm:items-center gap-5 md:gap-6 p-5 md:p-6 rounded-xl border transition-all duration-300 ${
              isSelected 
                ? "bg-primary/[0.04] border-primary/60 shadow-lg shadow-primary/5" 
                : "bg-background/40 border-border hover:border-primary/30"
            }`}
          >
            {/* Room Image Thumbnail */}
            {room.imageSrc && (
              <div className="relative w-full sm:w-44 md:w-48 h-44 sm:h-32 shrink-0 rounded-[2px] overflow-hidden border border-border/80 bg-card group">
                <Image
                  src={room.imageSrc}
                  alt={room.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 200px"
                />
              </div>
            )}

            {/* Factual Differentiator & WhatsApp Inquiry Link */}
            <div className="flex-grow flex flex-col justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl md:text-2xl text-foreground font-medium">
                  {room.name}
                </h3>
                <p className="font-sans text-muted-foreground text-sm font-light leading-relaxed mt-1 max-w-xl">
                  {room.description}
                </p>
              </div>

              {/* Action 2: Contextual Room Questions */}
              {ownerWhatsApp && (
                <div>
                  <a
                    href={getRoomWhatsAppLink(room)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-sans text-primary/90 hover:text-primary transition-colors py-0.5 group"
                  >
                    <span>Questions about this room? Ask on WhatsApp</span>
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Price & Action 1 (Selection Stepper) */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between pt-4 sm:pt-0 border-t sm:border-t-0 border-border/60 gap-4 shrink-0">
              <div className="text-left sm:text-right">
                <div className="font-mono text-primary text-xl md:text-2xl font-bold tabular-nums">
                  ₹{room.price.toLocaleString()}
                </div>
                <div className="font-mono text-muted-foreground text-xs font-medium">
                  {room.priceLabel || "/night (incl. breakfast)"}
                </div>
              </div>

              {interactive && (
                <div className="flex items-center bg-card rounded-[3px] border border-border shadow-sm p-0.5">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    disabled={qty <= 0}
                    onClick={() => onQuantityChange?.(room.id, qty - 1)}
                    className="w-11 h-11 flex items-center justify-center rounded-[2px] text-muted-foreground hover:text-foreground hover:bg-background/80 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                    aria-label={`Decrease ${room.name} quantity`}
                  >
                    <Minus size={15} />
                  </motion.button>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={qty}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="font-mono text-foreground w-8 text-center text-sm font-bold inline-block tabular-nums"
                    >
                      {qty}
                    </motion.span>
                  </AnimatePresence>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => onQuantityChange?.(room.id, qty + 1)}
                    className="w-11 h-11 flex items-center justify-center rounded-[2px] text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
                    aria-label={`Increase ${room.name} quantity`}
                  >
                    <Plus size={15} />
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

