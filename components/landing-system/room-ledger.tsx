"use client"

import { Minus, Plus, Maximize2, BedDouble, Eye, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export interface RoomDef {
  id: string
  name: string
  description: string
  price: number
  priceLabel?: string
  available?: number
  roomNumbers?: string
  sqft?: string
  bed?: string
  view?: string
  imageSrc?: string
  features?: string[]
}

interface RoomLedgerProps {
  rooms: RoomDef[]
  interactive?: boolean
  selectedQuantities?: Record<string, number>
  onQuantityChange?: (roomId: string, qty: number) => void
}

export function RoomLedger({ rooms, interactive = false, selectedQuantities = {}, onQuantityChange }: RoomLedgerProps) {
  
  return (
    <div className="w-full flex flex-col gap-6">
      {rooms.map((room, index) => {
        const qty = selectedQuantities[room.id] || 0
        const available = room.available ?? 0
        const isSoldOut = interactive && available === 0
        const isLowStock = interactive && available > 0 && available <= 2
        const isSelected = qty > 0

        return (
          <div 
            key={room.id} 
            className={`relative flex flex-col lg:flex-row lg:items-center gap-6 p-5 md:p-6 rounded-xl border transition-all duration-300 ${
              isSelected 
                ? "bg-primary/[0.04] border-primary/60 shadow-lg shadow-primary/5" 
                : "bg-background/40 border-border hover:border-primary/30"
            }`}
          >
            {/* Room Image Thumbnail */}
            {room.imageSrc && (
              <div className="relative w-full lg:w-44 h-40 lg:h-32 shrink-0 rounded-lg overflow-hidden border border-border/80 bg-card group">
                <Image
                  src={room.imageSrc}
                  alt={room.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 180px"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-foreground">
                  #{(index + 1).toString().padStart(2, '0')}
                </div>
              </div>
            )}

            {/* Content & Specs */}
            <div className="flex-grow flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-xl md:text-2xl text-foreground">
                  {room.name}
                </h3>
                {isLowStock && (
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold bg-destructive/20 text-destructive border border-destructive/30">
                    {available} left
                  </span>
                )}
                {isSoldOut && (
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono font-bold bg-card text-muted-foreground border border-muted-foreground/20">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Room Specifications Bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-muted-foreground font-medium">
                {room.sqft && (
                  <span className="inline-flex items-center gap-1">
                    <Maximize2 size={12} className="text-primary/70" />
                    {room.sqft}
                  </span>
                )}
                {room.bed && (
                  <span className="inline-flex items-center gap-1">
                    <BedDouble size={12} className="text-primary/70" />
                    {room.bed}
                  </span>
                )}
                {room.view && (
                  <span className="inline-flex items-center gap-1 text-foreground/80">
                    <Eye size={12} className="text-primary/70" />
                    {room.view}
                  </span>
                )}
                {room.roomNumbers && (
                  <span className="text-muted-foreground/60">
                    ({room.roomNumbers})
                  </span>
                )}
              </div>

              <p className="font-sans text-muted-foreground text-sm font-light leading-relaxed">
                {room.description}
              </p>

              {/* Feature Tags / Inclusions */}
              {room.features && room.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {room.features.map((feat, fIdx) => (
                    <span 
                      key={fIdx} 
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-card border border-border text-foreground/80"
                    >
                      <Check size={10} className="text-primary" />
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Stepper */}
            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between pt-4 lg:pt-0 border-t lg:border-t-0 border-border/60 gap-4 shrink-0">
              <div className="text-left lg:text-right">
                <div className="font-mono text-primary text-xl md:text-2xl font-bold">
                  ₹{room.price.toLocaleString()}
                </div>
                <div className="font-mono text-muted-foreground text-xs font-semibold">
                  {room.priceLabel || "/night (incl. breakfast)"}
                </div>
              </div>

              {interactive && (
                <div className="flex items-center gap-3 bg-card p-1.5 rounded-lg border border-border shadow-sm">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    disabled={qty <= 0}
                    onClick={() => onQuantityChange?.(room.id, qty - 1)}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 disabled:opacity-30 transition-colors"
                    aria-label={`Decrease ${room.name} quantity`}
                  >
                    <Minus size={14} />
                  </motion.button>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={qty}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="font-mono text-foreground w-6 text-center text-sm font-bold inline-block"
                    >
                      {qty}
                    </motion.span>
                  </AnimatePresence>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    disabled={qty >= available}
                    onClick={() => onQuantityChange?.(room.id, qty + 1)}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 disabled:opacity-30 transition-colors"
                    aria-label={`Increase ${room.name} quantity`}
                  >
                    <Plus size={14} />
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
