"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"

interface ScrollHeroProps {
  headline: string
  tagline?: string
  subhead?: string
  eyebrow: string
  metaFacts?: string
  imageSrc: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  onCtaClick?: () => void
}

export function ScrollHero({ 
  headline, 
  tagline,
  subhead, 
  eyebrow, 
  metaFacts,
  imageSrc, 
  ctaText = "Check availability", 
  ctaHref = "#booking-section", 
  secondaryCtaText = "Explore the rooms",
  secondaryCtaHref = "#booking-section",
  onCtaClick 
}: ScrollHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Subtle, controlled Ken Burns zoom (only 5% zoom to keep it calm and elegant)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

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
      className="relative flex min-h-screen items-end justify-start px-6 md:px-16 lg:px-24 pt-32 pb-20 md:pb-28 overflow-hidden bg-background"
    >
      {/* 1. Full-Bleed Photograph with Selective Image Crop */}
      <motion.div 
        style={prefersReducedMotion ? {} : { scale }}
        className="absolute inset-0 z-0 origin-center"
      >
        <Image
          src={imageSrc}
          alt={headline}
          fill
          priority
          className="object-cover object-[70%_center] md:object-center"
          quality={95}
        />
      </motion.div>

      {/* 2. Left-Weighted Legibility Scrims (Preserves bright sky & sunset on the right) */}
      {/* Soft left-weighted black/background scrim behind text */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent w-full md:w-[70%] z-10 pointer-events-none" 
      />
      {/* Gentle vertical gradient for bottom grounding */}
      <div 
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" 
      />

      {/* 3. Text & Conversion Block Content */}
      <div className="relative z-20 w-full max-w-3xl flex flex-col items-start">
        
        {/* Eyebrow: Clean, quiet horizontal factual label (No decorative capsule) */}
        <motion.div 
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs md:text-sm font-mono tracking-[0.22em] text-primary font-bold uppercase mb-4 md:mb-5"
        >
          {eyebrow}
        </motion.div>

        {/* Headline H1: Scaled by -15% for balanced proportions, fits one line on desktop */}
        <motion.h1 
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[1.08] text-foreground tracking-tightest drop-shadow-md"
        >
          {headline}
        </motion.h1>

        {/* Tagline / Emotional Promise */}
        {tagline && (
          <motion.h2 
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-2xl md:text-3xl text-foreground/95 font-light italic mt-3 mb-3"
          >
            {tagline}
          </motion.h2>
        )}

        {/* Subhead: Concise accommodation description */}
        {subhead && (
          <motion.p 
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base md:text-lg text-muted-foreground max-w-xl font-light leading-relaxed mb-3"
          >
            {subhead}
          </motion.p>
        )}

        {/* Meta Facts: Compact verified supporting line */}
        {metaFacts && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs font-mono text-muted-foreground/80 tracking-wider mb-8"
          >
            {metaFacts}
          </motion.div>
        )}

        {/* 4. Action Layer: One dominant solid CTA + One quiet secondary text link */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 w-full sm:w-auto"
        >
          {/* Primary CTA: Solid warm-gold button with high contrast & authority */}
          {ctaHref ? (
            <a
              href={ctaHref}
              onClick={(e) => handleSmoothScroll(e, ctaHref)}
              className="bg-primary hover:brightness-110 active:scale-[0.98] text-primary-foreground font-mono font-bold uppercase tracking-widest text-xs px-8 py-4 shadow-xl transition-all flex items-center justify-center gap-3 group"
            >
              <span>{ctaText}</span>
              <ArrowRight size={15} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <button
              onClick={onCtaClick}
              className="bg-primary hover:brightness-110 active:scale-[0.98] text-primary-foreground font-mono font-bold uppercase tracking-widest text-xs px-8 py-4 shadow-xl transition-all flex items-center justify-center gap-3 group"
            >
              <span>{ctaText}</span>
              <ArrowRight size={15} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </button>
          )}

          {/* Secondary Link: Restrained, quiet text link */}
          {secondaryCtaText && (
            <a
              href={secondaryCtaHref}
              onClick={(e) => handleSmoothScroll(e, secondaryCtaHref)}
              className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center sm:justify-start gap-1.5 py-3 px-1 group"
            >
              <span className="underline decoration-border group-hover:decoration-foreground underline-offset-4">
                {secondaryCtaText}
              </span>
              <span className="transition-transform group-hover:translate-y-0.5">↓</span>
            </a>
          )}
        </motion.div>
      </div>

      {/* 5. Minimalist Pinned Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:flex flex-col items-center gap-1.5 text-muted-foreground/60">
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-semibold">Scroll</span>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={14} strokeWidth={1.5} />
        </motion.div>
      </div>
    </section>
  )
}
