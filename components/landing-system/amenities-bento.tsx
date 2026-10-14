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
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-card border-t border-border relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            {numeral && <div className="text-xs font-sans tracking-[0.22em] text-primary font-semibold uppercase mb-3">{numeral}</div>}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight mb-4 md:mb-0">{headline}</h2>
          </div>
          {subhead && (
            <p className="text-muted-foreground font-light max-w-md md:text-right text-base sm:text-lg leading-relaxed">
              {subhead}
            </p>
          )}
        </div>
        
        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px] md:auto-rows-[270px]">
          {sortedAmenities.map((amenity, idx) => {
            const Icon = Icons[amenity.iconName] as any
            
            // Layout logic based on featured/index
            // Featured takes 2x2 on desktop with ample vertical height on mobile
            let gridClass = "md:col-span-1 md:row-span-1"
            if (amenity.featured) {
              gridClass = "md:col-span-2 md:row-span-2 min-h-[340px] sm:min-h-[380px] md:min-h-0"
            } else if (idx === 1) {
              gridClass = "md:col-span-2 md:row-span-1"
            } else if (idx === 2) {
              gridClass = "md:col-span-1 md:row-span-1"
            } else if (idx === 3) {
              gridClass = "md:col-span-1 md:row-span-1"
            } else if (idx === 4) {
              gridClass = "md:col-span-2 md:row-span-1"
            } else if (idx === 5) {
              gridClass = "md:col-span-2 md:row-span-1"
            }

            return (
              <motion.div
                key={amenity.id}
                whileHover={prefersReducedMotion ? {} : { y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`group relative bg-background border border-border flex flex-col justify-between overflow-hidden transition-colors hover:border-primary/80 ${gridClass}`}
              >
                {/* Background image for featured tile with multi-stop dark scrim for guaranteed contrast */}
                {amenity.featured && amenity.imageSrc && (
                  <div className="absolute inset-0 z-0">
                    <Image 
                      src={amenity.imageSrc} 
                      alt={amenity.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                      priority={false}
                    />
                    {/* Base darkening overlay to eliminate bright hotspots */}
                    <div className="absolute inset-0 bg-black/45" />
                    {/* Deep bottom-to-top gradient protecting text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 via-45% to-transparent" />
                    {/* Subtle top vignette for icon visibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
                  </div>
                )}
                
                <div className={`relative z-10 flex flex-col h-full justify-between p-6 sm:p-8 md:p-10 ${amenity.featured ? 'text-white' : 'text-foreground'}`}>
                  <div className="mb-4">
                     {Icon && (
                        <motion.div 
                          className="text-primary inline-flex items-center justify-center"
                          whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className={amenity.featured ? "w-10 h-10 rounded-full bg-black/50 border border-white/15 backdrop-blur-md flex items-center justify-center text-primary shadow-sm" : ""}>
                            <Icon size={amenity.featured ? 22 : 28} strokeWidth={1.5} />
                          </div>
                        </motion.div>
                     )}
                  </div>
                  <div>
                    <h3 className={`font-serif text-2xl mb-2.5 ${amenity.featured ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]' : 'text-foreground'}`}>
                      {amenity.title}
                    </h3>
                    <p className={`text-sm leading-relaxed max-w-lg ${
                      amenity.featured 
                        ? 'text-stone-200 font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]' 
                        : 'text-muted-foreground font-light'
                    }`}>
                      {amenity.description}
                    </p>
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
