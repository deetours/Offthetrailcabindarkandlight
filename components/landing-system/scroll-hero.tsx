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
  startingPrice?: string
  imageSrc: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  showWhatsAppHelper?: boolean
  conciergeWhatsApp?: string
  conciergePhone?: string
  nextSectionId?: string
}

export function ScrollHero({ 
  propertyName = "Dalhousie Estate",
  locationEyebrow,
  eyebrow,
  headline = "Find your\nquiet in the pines.",
  tagline,
  subhead = "A comfortable mountain stay with warm interiors, forest surroundings and room to slow down.",
  startingPrice,
  imageSrc, 
  ctaText = "Explore the rooms", 
  ctaHref = "#rooms", 
  secondaryCtaText, 
  secondaryCtaHref, 
  showWhatsAppHelper = true,
  conciergeWhatsApp = process.env.NEXT_PUBLIC_OFFTHETRAIL_WA_NUMBER || "919816315898",
  conciergePhone = "+91 98163 15898",
  nextSectionId = "overview"
}: ScrollHeroProps) {
  const activeEyebrow = locationEyebrow || eyebrow || "BAKROTA RIDGE · DALHOUSIE, 6,800 FT"
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Apple-level restraint: 4% smooth Ken Burns zoom (disabled if reduced motion)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        e.preventDefault()
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const cleanWhatsAppNumber = conciergeWhatsApp.replace(/[^0-9]/g, '')
  const conciergeUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(`Hello OffTheTrail, I am exploring ${propertyName} and would like to check availability.`)}`
  const roomHelpUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(`Hello OffTheTrail, I would like assistance choosing a room at ${propertyName}.`)}`

  return (
    <section 
      ref={sectionRef} 
      className="relative flex flex-col justify-between min-h-[100svh] min-h-[600px] overflow-hidden bg-background"
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
          className="object-cover object-[55%_center] md:object-center"
          quality={90}
        />
      </motion.div>

      {/* 2. Simplified Scrim Engineering (WCAG AAA Contrast Verified) */}
      {/* Mobile Scrim: Bottom-weighted gradient protecting text without obscuring upper pine canopy */}
      <div 
        className="md:hidden absolute inset-0 bg-gradient-to-t from-[#0b0e11] via-[#0b0e11]/80 to-transparent/20 z-10 pointer-events-none" 
      />
      {/* Desktop Scrim: Left-to-right directional fade over the dark pine silhouettes */}
      <div 
        className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#0b0e11]/90 via-[#0b0e11]/70 to-transparent w-[60%] lg:w-[52%] z-10 pointer-events-none" 
      />
      {/* Subtle bottom edge blend into the content section */}
      <div 
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" 
      />

      {/* 3. Grid-Aligned Top Header */}
      <header className="relative z-30 w-full pt-8 md:pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
              Off The Trail
            </span>
            <span className="text-white/30 font-sans text-xs">/</span>
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-white/70 font-medium group-hover:text-white transition-colors">
              {propertyName}
            </span>
          </Link>

          <a 
            href={conciergeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs uppercase tracking-[0.2em] text-white/75 hover:text-primary transition-colors flex items-center gap-1.5 py-1 px-1 group"
          >
            <span>Concierge</span>
            <ArrowUpRight size={13} className="text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </header>

      {/* 4. The Fluid 12-Column Grid: Left-Anchored Typography & Atmospheric Negative Space */}
      <div className="relative z-20 w-full flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full grid grid-cols-1 md:grid-cols-12 gap-8 py-10 md:py-16">
          
          {/* Columns 1–7 (Desktop): Typographic Statement & Conversion Trigger */}
          <div className="md:col-span-7 lg:col-span-6 flex flex-col items-start justify-center">
            
            {/* Eyebrow: Truthful, romantic geographical locator */}
            <motion.div 
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[11px] font-sans tracking-[0.2em] text-primary font-semibold uppercase mb-4 md:mb-5"
            >
              {activeEyebrow}
            </motion.div>

            {/* Headline H1: Expressive Heritage Serif, unhurried cadence with intentional line break */}
            <motion.h1 
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white tracking-tightest leading-[1.08] mb-4 whitespace-pre-line drop-shadow-md"
            >
              {headline}
            </motion.h1>

            {/* Optional Tagline */}
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

            {/* Subhead: High-Contrast Silver Modern Sans-Serif, constrained max width */}
            {subhead && (
              <motion.p 
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans text-base sm:text-lg text-neutral-300 max-w-lg font-normal leading-relaxed mb-4"
              >
                {subhead}
              </motion.p>
            )}

            {/* Understated Practical Rate & Inclusion Cue */}
            {startingPrice && (
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono text-xs uppercase tracking-[0.14em] text-primary/95 font-medium mb-7 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                <span>{startingPrice}</span>
              </motion.div>
            )}

            {/* Action Row: Dominant Solid Gold CTA + WhatsApp Concierge Helper */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 w-full sm:w-auto"
            >
              {/* Primary CTA: Solid Warm Gold Button with High Authority */}
              <a
                href={ctaHref}
                onClick={(e) => handleSmoothScroll(e, ctaHref)}
                className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-[#D4A35B] active:scale-[0.98] text-primary-foreground font-sans font-semibold uppercase tracking-widest text-xs px-8 py-4 rounded-[3px] shadow-xl transition-all group min-h-[48px]"
              >
                <span>{ctaText}</span>
                <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {/* Secondary CTA: Subordinate text link (if provided) */}
              {secondaryCtaText && (
                <a
                  href={secondaryCtaHref}
                  onClick={(e) => handleSmoothScroll(e, secondaryCtaHref || '#')}
                  className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs font-sans uppercase tracking-widest text-neutral-200 hover:text-primary transition-colors py-3 px-1 group"
                >
                  <span className="underline decoration-white/30 group-hover:decoration-primary underline-offset-4">
                    {secondaryCtaText}
                  </span>
                  <ArrowDown size={13} className="transition-transform group-hover:translate-y-0.5" />
                </a>
              )}

              {/* Inline WhatsApp Helper Link */}
              {showWhatsAppHelper && !secondaryCtaText && (
                <a
                  href={roomHelpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-sans text-neutral-300 hover:text-primary transition-colors py-3 px-1 group"
                >
                  <span>Need help choosing? Talk on WhatsApp</span>
                  <ArrowUpRight size={13} className="text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </motion.div>

          </div>

          {/* Columns 8–12 (Desktop): Pure Negative Space / Photographic Atmosphere */}
          <div className="hidden md:block md:col-span-5 lg:col-span-6 pointer-events-none" aria-hidden="true" />

        </div>
      </div>

      {/* 5. Clean Bottom Anchor Bar with Editorial Scroll Cue */}
      <div className="relative z-20 w-full pb-6 md:pb-8 pt-2">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-center sm:justify-between text-[10px] font-sans uppercase tracking-[0.22em] text-white/50">
          <span className="hidden sm:inline text-white/40">
            A STAY BY OFF THE TRAIL · {propertyName.toUpperCase()}
          </span>

          <a 
            href={`#${nextSectionId}`}
            onClick={(e) => handleSmoothScroll(e, `#${nextSectionId}`)}
            aria-label="Scroll to discover next section"
            className="inline-flex items-center gap-2 text-white/75 hover:text-white transition-colors pointer-events-auto py-1 px-2.5 rounded focus:outline-none focus:ring-1 focus:ring-primary/60 group"
          >
            <span className="font-medium tracking-[0.2em]">SCROLL TO DISCOVER</span>
            <motion.span
              animate={prefersReducedMotion ? {} : { y: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex"
            >
              <ArrowDown size={12} className="text-primary transition-transform group-hover:translate-y-0.5" />
            </motion.span>
          </a>

          <span className="hidden sm:inline text-white/40 text-right">
            BAKROTA RIDGE · 6,800 FT
          </span>
        </div>
      </div>
    </section>
  )
}
