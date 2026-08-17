"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"

interface ScrollHeroProps {
  headline: string
  subhead?: string
  eyebrow: string
  imageSrc: string
  ctaText?: string
  ctaHref?: string
  onCtaClick?: () => void
}

export function ScrollHero({ headline, subhead, eyebrow, imageSrc, ctaText, ctaHref, onCtaClick }: ScrollHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHoveringCta, setIsHoveringCta] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  // Scroll-linked Ken Burns effect
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"])

  // Cursor-driven parallax
  useEffect(() => {
    if (prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      setMousePosition({ x, y })
    }

    // Only add listener on pointer-fine devices
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [prefersReducedMotion])

  const parallaxX = prefersReducedMotion ? 0 : mousePosition.x * -6
  const parallaxY = prefersReducedMotion ? 0 : mousePosition.y * -6
  
  // Chip tilt
  const chipRotate = prefersReducedMotion ? 0 : mousePosition.x * 2 // 1-2 degrees

  return (
    <section 
      ref={sectionRef} 
      className="relative flex min-h-screen items-end justify-start px-6 md:px-16 lg:px-24 pb-24 md:pb-32 overflow-hidden bg-background"
    >
      {/* 1. Single Continuous Full-Bleed Photograph */}
      <motion.div 
        style={prefersReducedMotion ? {} : { scale, x: parallaxX, y: parallaxY }}
        className="absolute inset-0 z-0 origin-center"
      >
        <Image
          src={imageSrc}
          alt={headline}
          fill
          priority
          className="object-cover"
          quality={100}
        />
        
        {/* Blended ambient mist texture */}
        {!prefersReducedMotion && (
          <motion.div 
            animate={{ 
              x: ["-2%", "2%", "-2%"], 
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40 origin-center w-full h-full"
            style={{ 
               backgroundImage: "url('/noise.png')",
               filter: "blur(20px)"
            }}
          />
        )}
      </motion.div>

      {/* 2. Legibility Scrims */}
      {/* Gradient shaped scrim */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent via-background/40 to-background/90 z-10 pointer-events-none" />
      {/* Radial vignette behind text */}
      <div className="absolute left-0 bottom-0 w-full md:w-2/3 h-full md:h-2/3 bg-[radial-gradient(circle_at_20%_80%,_rgba(0,0,0,0.6)_0%,_transparent_70%)] z-10 pointer-events-none" />

      {/* 3. Text Block Content */}
      <motion.div 
        style={{ opacity: opacityText, y: prefersReducedMotion ? 0 : yText }}
        className="relative z-20 w-full max-w-4xl flex flex-col items-start"
      >
        {/* Eyebrow Chip - sits above headline, small gap, anti-grid rotation */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          style={prefersReducedMotion ? {} : { rotate: chipRotate }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 md:mb-10 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-sm md:-rotate-1 origin-bottom-left"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-foreground font-mono font-bold">
            {eyebrow}
          </span>
        </motion.div>

        {/* Headline - wipe reveal or simple fade */}
        <div className="overflow-hidden w-full">
          <motion.h1 
            initial={prefersReducedMotion ? { opacity: 0 } : { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", y: 40 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="font-serif text-[clamp(3rem,8vw,6.5rem)] leading-[1.05] text-foreground text-shadow-sm tracking-tightest"
          >
            {headline}
          </motion.h1>
        </div>

        {/* Subhead */}
        {subhead && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 md:mt-8 font-sans text-lg md:text-2xl text-muted-foreground max-w-2xl text-shadow-sm font-light leading-relaxed"
          >
            {subhead}
          </motion.p>
        )}

        {/* CTA */}
        {ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="mt-10 md:mt-12 inline-block relative z-50"
          >
            {ctaHref ? (
              <motion.a
                href={ctaHref}
                target={ctaHref.startsWith('#') ? undefined : "_blank"}
                rel={ctaHref.startsWith('#') ? undefined : "noopener noreferrer"}
                onClick={(e) => {
                  if (ctaHref.startsWith('#')) {
                    e.preventDefault()
                    const targetId = ctaHref.substring(1)
                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                onMouseEnter={() => setIsHoveringCta(true)}
                onMouseLeave={() => setIsHoveringCta(false)}
                animate={prefersReducedMotion ? {} : {
                  x: isHoveringCta ? (mousePosition.x * 10) : 0,
                  y: isHoveringCta ? (mousePosition.y * 10) : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative flex items-center gap-4 px-8 py-5 transition-colors duration-500 ease-out overflow-hidden bg-card/20 backdrop-blur-sm border border-primary/20"
              >
                {/* Magnetic background fill in hover state */}
                <div 
                  className="absolute inset-0 bg-primary transform scale-x-0 origin-left transition-transform duration-500 ease-[0.23,1,0.32,1] -z-10 group-hover:scale-x-100" 
                />
                
                <span className="font-mono text-xs tracking-[0.2em] font-bold uppercase text-primary group-hover:text-primary-foreground transition-colors duration-500 z-10 relative">
                  {ctaText}
                </span>
                
                <motion.div
                  animate={{ x: isHoveringCta ? 4 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-primary group-hover:text-primary-foreground transition-colors duration-500 z-10"
                >
                  <ArrowRight size={18} strokeWidth={1.5} />
                </motion.div>

                {/* Draw-in underline */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transform scale-x-0 origin-left transition-transform duration-500 ease-[0.23,1,0.32,1] group-hover:scale-x-100 opacity-50 group-hover:opacity-0" />
              </motion.a>
            ) : (
              <motion.button
                onClick={onCtaClick}
                onMouseEnter={() => setIsHoveringCta(true)}
                onMouseLeave={() => setIsHoveringCta(false)}
                animate={prefersReducedMotion ? {} : {
                  x: isHoveringCta ? (mousePosition.x * 10) : 0,
                  y: isHoveringCta ? (mousePosition.y * 10) : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group relative flex items-center gap-4 px-8 py-5 transition-colors duration-500 ease-out overflow-hidden bg-card/20 backdrop-blur-sm border border-primary/20"
              >
                {/* Magnetic background fill in hover state */}
                <div 
                  className="absolute inset-0 bg-primary transform scale-x-0 origin-left transition-transform duration-500 ease-[0.23,1,0.32,1] -z-10 group-hover:scale-x-100" 
                />
                
                <span className="font-mono text-xs tracking-[0.2em] font-bold uppercase text-primary group-hover:text-primary-foreground transition-colors duration-500 z-10 relative">
                  {ctaText}
                </span>
                
                <motion.div
                  animate={{ x: isHoveringCta ? 4 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-primary group-hover:text-primary-foreground transition-colors duration-500 z-10"
                >
                  <ArrowRight size={18} strokeWidth={1.5} />
                </motion.div>

                {/* Draw-in underline */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transform scale-x-0 origin-left transition-transform duration-500 ease-[0.23,1,0.32,1] group-hover:scale-x-100 opacity-50 group-hover:opacity-0" />
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Pinned scroll cue */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-mono font-bold">Scroll</span>
          <ChevronDown size={14} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}
