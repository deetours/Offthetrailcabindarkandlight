"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X } from "lucide-react"
import { useReducedMotion } from "framer-motion"

export interface GalleryPhotoDef {
  id: string
  src: string
  alt: string
  featured?: boolean
}

interface PhotoGalleryProps {
  numeral?: string
  headline: string
  subhead?: string
  photos: GalleryPhotoDef[]
}

export function PhotoGallery({ numeral, headline, subhead, photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhotoDef | null>(null)
  const prefersReducedMotion = useReducedMotion()

  if (!photos || photos.length === 0) return null

  // Sort: featured first
  const sortedPhotos = [...photos].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

  return (
    <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-background border-t border-border relative z-10">
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
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-[200px] md:auto-rows-[280px]">
          {sortedPhotos.map((photo, idx) => {
            let gridClass = "col-span-1 row-span-1"
            if (photo.featured) {
              gridClass = "col-span-2 row-span-2"
            } else if (idx === 1) {
              gridClass = "col-span-2 row-span-1"
            } else if (idx === 2) {
              gridClass = "col-span-1 row-span-1"
            } else if (idx === 3) {
              gridClass = "col-span-1 row-span-1"
            }

            return (
              <motion.div
                key={photo.id}
                layoutId={`gallery-item-${photo.id}`}
                onClick={() => setSelectedPhoto(photo)}
                whileHover={prefersReducedMotion ? {} : { scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`group relative bg-card border border-border overflow-hidden cursor-pointer ${gridClass}`}
              >
                <Image 
                  src={photo.src} 
                  alt={photo.alt} 
                  fill 
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-background/0 transition-colors duration-500 group-hover:bg-background/20 mix-blend-overlay" />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4 md:p-12"
            onClick={() => setSelectedPhoto(null)}
          >
            <button 
              className="absolute top-6 right-6 md:top-10 md:right-10 text-muted-foreground hover:text-foreground transition-colors z-[110]"
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null) }}
            >
              <X size={32} strokeWidth={1} />
            </button>
            <motion.div
              layoutId={`gallery-item-${selectedPhoto.id}`}
              className="relative w-full max-w-6xl aspect-video md:aspect-[16/9] shadow-2xl border border-border/50"
              onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to background
            >
              <Image 
                src={selectedPhoto.src} 
                alt={selectedPhoto.alt} 
                fill 
                className="object-contain" 
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
