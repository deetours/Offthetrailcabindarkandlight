"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"
import { RoomDef } from "./room-ledger"

interface RoomCatalogProps {
  numeral?: string
  headline?: string
  subhead?: string
  rooms: RoomDef[]
  onSelectRoom?: (roomId: string) => void
}

export function RoomCatalog({
  numeral = "III — Room Categories",
  headline = "Spaces shaped by the ridge.",
  subhead = "Ten secluded rooms across three distinct categories. Natural deodar wood, mountain stonework, and unhurried mornings.",
  rooms,
  onSelectRoom,
}: RoomCatalogProps) {
  const prefersReducedMotion = useReducedMotion()

  const handleSelect = (roomId: string) => {
    onSelectRoom?.(roomId)
    const element = document.getElementById("booking-flow")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Feature tags based on verified room descriptions
  const getRoomFeatures = (roomId: string) => {
    switch (roomId) {
      case "super-deluxe":
        return ["Private Balcony", "Dedicated Seating Area", "Valley View", "Breakfast Included"]
      case "deluxe":
        return ["Attached Balcony", "Natural Wood Finishes", "Mountain View", "Breakfast Included"]
      case "standard":
      default:
        return ["Wood-Panelled Interiors", "Scenic Windows", "Pine Forest Setting", "Breakfast Included"]
    }
  }

  return (
    <section id="rooms" className="py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-background border-t border-border relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          {numeral && (
            <motion.div 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs font-sans tracking-[0.22em] text-primary font-semibold uppercase mb-3"
            >
              {numeral}
            </motion.div>
          )}
          <motion.h2 
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight mb-4"
          >
            {headline}
          </motion.h2>
          {subhead && (
            <motion.p 
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl"
            >
              {subhead}
            </motion.p>
          )}
        </div>

        {/* 3-Column Catalogue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {rooms.map((room, idx) => {
            const features = getRoomFeatures(room.id)
            return (
              <motion.article
                key={room.id}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 * idx }}
                className="group flex flex-col justify-between bg-card border border-border hover:border-primary/40 rounded-[2px] transition-all duration-300 shadow-xl overflow-hidden"
              >
                {/* 16:10 Consistent Ratio Photography */}
                <div>
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-base">
                    {room.imageSrc ? (
                      <Image
                        src={room.imageSrc}
                        alt={room.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-elevated flex items-center justify-center text-muted-foreground text-xs">
                        Dalhousie Estate
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Room Details Block */}
                  <div className="p-6 md:p-7">
                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <h3 className="font-serif text-2xl text-foreground font-medium group-hover:text-primary transition-colors">
                        {room.name}
                      </h3>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="font-mono text-2xl font-bold text-primary tabular-nums">
                        ₹{room.price.toLocaleString()}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {room.priceLabel || "/night"}
                      </span>
                    </div>

                    <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed mb-6">
                      {room.description}
                    </p>

                    {/* Verified Feature Chips */}
                    <ul className="space-y-2 pt-4 border-t border-border/80">
                      {features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs font-sans text-neutral-300">
                          <Check size={13} className="text-primary shrink-0" strokeWidth={2} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Primary Selection Action */}
                <div className="p-6 pt-0 md:p-7 md:pt-0">
                  <button
                    type="button"
                    onClick={() => handleSelect(room.id)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-surface-subtle hover:bg-primary active:scale-[0.98] text-foreground hover:text-primary-foreground border border-border hover:border-primary py-3.5 px-4 rounded-[3px] font-sans font-semibold uppercase tracking-widest text-xs transition-all duration-200 group/btn shadow-sm"
                  >
                    <span>Select this room</span>
                    <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>

      </div>
    </section>
  )
}
