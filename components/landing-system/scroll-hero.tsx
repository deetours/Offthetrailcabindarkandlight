"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { ArrowUpRight, ArrowDown } from "lucide-react"

interface ScrollHeroProps {
  propertyName?: string
  locationEyebrow?: string
  eyebrow?: string
  headline?: string
  tagline?: string
  subhead?: string
  imageSrc: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  conciergeWhatsApp?: string
  conciergePhone?: string
}

export function ScrollHero({ 
  propertyName = "Dalhousie Estate",
  locationEyebrow,
  eyebrow,
  headline = "Dalhousie Estate",
  tagline = "Trade the noise for silence.",
  subhead = "Ten rooms. A slower pace. A quieter side of the mountains.",
  imageSrc, 
  ctaText = "Check availability", 
  ctaHref = "#booking-section", 
  secondaryCtaText = "Explore the rooms",
  secondaryCtaHref = "#booking-section",
  conciergeWhatsApp = "919816315898",
  conciergePhone = "+91 98163 15898"
}: ScrollHeroProps) {
  const activeEyebrow = locationEyebrow || eyebrow || "01 / Dalhousie, Himachal Pradesh"
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Apple-level restraint: 4% smooth Ken Burns zoom
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <section 
      ref={sectionRef} 
      className="relative flex flex-col justify-between min-h-screen overflow-hidden bg-background"
    >
      {/* 1. Full-Bleed Photograph Anchored with Controlled Crop */}
      <motion.div 
        style={prefersReducedMotion ? {} : { scale }}
        className="absolute inset-0 z-0 origin-center"
      >
        <Image
          src={imageSrc}
          alt={propertyName}
          fill
          priority
          className="object-cover object-[75%_center] md:object-[65%_center] lg:object-center"
          quality={95}
        />
      </motion.div>

      {/* 2. Directional Left-Weighted Architectural Scrim (Cols 1-7 Dark Canvas; Cols 8-12 Pure Landscape) */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-background via-background/90 md:via-background/85 to-transparent w-full md:w-[65%] lg:w-[58%] z-10 pointer-events-none" 
      />
      {/* Radial depth cushion behind text block */}
      <div 
        className="absolute inset-y-0 left-0 w-full md:w-[50%] bg-[radial-gradient(ellipse_at_left,_rgba(11,14,17,0.95)_0%,_rgba(11,14,17,0.75)_55%,_transparent_100%)] z-10 pointer-events-none"
      />
      {/* Subtle bottom edge blend */}
      <div 
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" 
      />

      {/* 3. Grid-Aligned Top Header (Shares the exact same 12-column boundary) */}
      <header className="relative z-30 w-full pt-8 md:pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
              Off The Trail
            </span>
            <span className="text-white/20 font-sans text-xs">/</span>
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/70 font-medium group-hover:text-white transition-colors">
              {propertyName}
            </span>
          </Link>

          <a 
            href={`https://wa.me/${conciergeWhatsApp}?text=Hello%20OffTheTrail%2C%20I%20have%20an%20inquiry%20about%20${encodeURIComponent(propertyName)}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs uppercase tracking-[0.2em] text-white/70 hover:text-primary transition-colors flex items-center gap-1.5 py-1 px-1 group"
          >
            <span>Concierge</span>
            <ArrowUpRight size={13} className="text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </header>

      {/* 4. The 12-Column Editorial Grid: 7:5 Visual Balance */}
      <div className="relative z-20 w-full flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full grid grid-cols-1 md:grid-cols-12 gap-8 py-12 md:py-20">
          
          {/* Columns 1–7 (Desktop): The Text & Booking Action Zone */}
          <div className="md:col-span-7 lg:col-span-6 flex flex-col items-start justify-center">
            
            {/* Eyebrow: Quiet, compact geographical identity */}
            <motion.div 
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-sans tracking-[0.22em] text-primary font-semibold uppercase mb-4 md:mb-5"
            >
              {activeEyebrow}
            </motion.div>

            {/* Headline H1: Expressive Heritage Serif, perfectly proportioned, no trailing period */}
            <motion.h1 
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-5xl lg:text-[4.25rem] text-white tracking-tightest leading-[1.06] mb-3 drop-shadow-md"
            >
              {headline}
            </motion.h1>

            {/* Tagline / Editorial Promise: Italic Serif Statement */}
            {tagline && (
              <motion.h2 
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-2xl sm:text-3xl text-white/95 font-light italic mb-3"
              >
                {tagline}
              </motion.h2>
            )}

            {/* Subhead: High-Contrast Silver Modern Sans-Serif, Constrained Width for Flawless Readability */}
            {subhead && (
              <motion.p 
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans text-base sm:text-lg text-neutral-200 max-w-lg font-normal leading-relaxed mb-8"
              >
                {subhead}
              </motion.p>
            )}

            {/* Action Row: 1 Dominant Solid Gold CTA + 1 Quiet High-Contrast Subordinate Link */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 w-full sm:w-auto"
            >
              {/* Primary CTA: Solid Warm Gold Button with High Authority */}
              <a
                href={ctaHref}
                onClick={(e) => handleSmoothScroll(e, ctaHref)}
                className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-[#edd09e] active:scale-[0.98] text-primary-foreground font-sans font-semibold uppercase tracking-widest text-xs px-8 py-4 shadow-xl transition-all group"
              >
                <span>{ctaText}</span>
                <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Secondary CTA: Subordinate, High-Contrast Text Link */}
              {secondaryCtaText && (
                <a
                  href={secondaryCtaHref}
                  onClick={(e) => handleSmoothScroll(e, secondaryCtaHref)}
                  className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs font-sans uppercase tracking-widest text-neutral-200 hover:text-primary transition-colors py-3 px-1 group"
                >
                  <span className="underline decoration-white/30 group-hover:decoration-primary underline-offset-4">
                    {secondaryCtaText}
                  </span>
                  <ArrowDown size={13} className="transition-transform group-hover:translate-y-0.5" />
                </a>
              )}
            </motion.div>

            {/* Subtle Brand Anchor Tag */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 md:mt-12 text-[10px] font-sans uppercase tracking-[0.25em] text-white/40 font-medium"
            >
              A STAY BY OFF THE TRAIL
            </motion.div>

          </div>

          {/* Columns 8–12 (Desktop): Pure Negative Space / Image Breathing Zone */}
          <div className="hidden md:block md:col-span-5 lg:col-span-6 pointer-events-none" aria-hidden="true" />

        </div>
      </div>

      {/* 5. Clean Bottom Anchor Indicator */}
      <div className="relative z-20 pb-6 text-center pointer-events-none">
        {/* Empty placeholder keeping height balanced */}
      </div>
    </section>
  )
}
