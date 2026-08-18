"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import * as Icons from "lucide-react"
import { useReducedMotion } from "framer-motion"

export interface AmenityDef {
  id: string
  title: string
  description: string
  featured?: boolean
  imageSrc?: string
  iconName: keyof typeof Icons
}

interface AmenitiesBentoProps {
  numeral?: string
  headline: string
  subhead?: string
  amenities: AmenityDef[]
}

export function AmenitiesBento({ numeral, headline, subhead, amenities }: AmenitiesBentoProps) {
  // Sort to ensure featured is first for mobile stacking
  const sortedAmenities = [...amenities].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-card border-t border-border relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            {numeral && <div className="font-serif text-primary text-lg lg:text-xl italic mb-4">{numeral}</div>}
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4 md:mb-0">{headline}</h2>
          </div>
          {subhead && (
            <p className="text-muted-foreground font-light max-w-md md:text-right text-lg">
              {subhead}
            </p>
          )}
        </div>
        
        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-[280px]">
          {sortedAmenities.map((amenity, idx) => {
            const Icon = Icons[amenity.iconName] as any
            
            // Layout logic based on featured/index
            // Featured takes 2x2 or 2 columns
            let gridClass = "md:col-span-1 md:row-span-1"
            if (amenity.featured) {
              gridClass = "md:col-span-2 md:row-span-2"
            } else if (idx === 1) {
              gridClass = "md:col-span-2 md:row-span-1"
            } else if (idx === 2) {
              gridClass = "md:col-span-1 md:row-span-1"
            } else if (idx === 3) {
              gridClass = "md:col-span-1 md:row-span-1"
            }

            return (
              <motion.div
                key={amenity.id}
                whileHover={prefersReducedMotion ? {} : { y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`group relative bg-background border border-border flex flex-col justify-between overflow-hidden transition-colors hover:border-primary/80 ${gridClass}`}
              >
                {/* Background image for featured tile */}
                {amenity.featured && amenity.imageSrc ? (
                  <div className="absolute inset-0 z-0">
                    <Image src={amenity.imageSrc} alt={amenity.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/20 mix-blend-multiply" />
                    <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('/noise.png')" }} />
                  </div>
                ) : (
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('/noise.png')" }} />
                )}
                
                <div className={`relative z-10 flex flex-col h-full justify-between p-8 md:p-10 ${amenity.featured ? 'text-white' : 'text-foreground'}`}>
                  <div className="mb-4">
                     {Icon && (
                        <motion.div 
                          className="text-primary opacity-90 inline-block"
                          whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon size={28} strokeWidth={1} />
                        </motion.div>
                     )}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl mb-3">{amenity.title}</h3>
                    <p className={`text-sm font-light leading-relaxed ${amenity.featured ? 'text-white/80' : 'text-muted-foreground'}`}>{amenity.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
