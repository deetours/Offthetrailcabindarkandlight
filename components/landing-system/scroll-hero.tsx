"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface ScrollHeroProps {
  title: string
  tagline: string
  imagePath: string
  eyebrow?: string
  hideCta?: boolean
}

export function ScrollHero({ title, tagline, imagePath, eyebrow, hideCta = false }: ScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Apple-style Ken Burns: Image scales from 1 to 1.12 over the scroll distance
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  // Subtle parallax for the text content
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  // Cursor Parallax Logic
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHoveringCTA, setIsHoveringCTA] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePosition({ x, y })
    }

    // Only add listener on non-touch devices
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [prefersReducedMotion])

  // Parallax shifts opposite to mouse (3-6px max)
  const parallaxX = mousePosition.x * -5
  const parallaxY = mousePosition.y * -5

  return (
    <section ref={containerRef} className="relative h-[100vh] w-full bg-ink flex items-center justify-center overflow-hidden">
      
      {/* Background Image with Scroll-Linked Scale and Cursor Parallax */}
      <motion.div
        className="absolute inset-0 z-0 origin-center"
        style={{ 
          scale: prefersReducedMotion ? 1 : scale,
        }}
        animate={{
          x: prefersReducedMotion ? 0 : parallaxX,
          y: prefersReducedMotion ? 0 : parallaxY
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <Image
          src={imagePath}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        
        {/* Layer 1: Mist/Fog Texture Overlay (Idle Motion) */}
        {!prefersReducedMotion && (
          <div 
            className="absolute inset-0 z-10 opacity-30 mix-blend-screen pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              animation: "drift 40s linear infinite",
            }}
          />
        )}

        {/* Layer 2: Gradient Scrim for general contrast */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
        
        {/* Layer 3: Radial Vignette specifically behind text block */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="w-[120%] h-[60vh] mt-[40vh] bg-[radial-gradient(ellipse_at_center,_rgba(12,15,13,0.7)_0%,_rgba(12,15,13,0)_70%)]" />
        </div>
      </motion.div>

      {/* Content with sequenced fade-in & Clip-Path wipe */}
      <motion.div 
        style={{ y: prefersReducedMotion ? "0%" : textY, opacity: textOpacity }}
        className="relative z-30 flex flex-col items-center text-center px-6 max-w-4xl mt-[25vh]"
      >
        {/* Clip-Path Reveal for Headline */}
        <motion.div
          initial={{ clipPath: prefersReducedMotion ? "inset(0 0 0 0)" : "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="pb-2 flex flex-col items-center" // padding to prevent cutting off descenders
        >
          {eyebrow && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-moss bg-ink/50 px-3 py-1 rounded-full border border-moss/20"
            >
              {eyebrow}
            </motion.span>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-parchment tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
          >
            {title}
          </motion.h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-sans text-lg md:text-xl text-parchment/95 tracking-wide max-w-2xl font-light drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        >
          {tagline}
        </motion.p>

        {/* Magnetic CTA */}
        {!hideCta && (
          <motion.div
            initial={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 relative"
            onMouseEnter={() => setIsHoveringCTA(true)}
            onMouseLeave={() => setIsHoveringCTA(false)}
            animate={{
              opacity: 1,
              ...(prefersReducedMotion ? {} : {
                x: isHoveringCTA ? mousePosition.x * 15 : 0,
                y: isHoveringCTA ? mousePosition.y * 15 : 0,
              })
            }}
          >
            <button
              onClick={() => {
                document.getElementById("booking-ledger")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="group px-8 py-4 bg-transparent border border-parchment/30 text-parchment font-sans text-sm font-medium uppercase tracking-widest rounded-full hover:border-brass hover:bg-brass hover:text-ink transition-all duration-500 ease-out flex items-center gap-3 overflow-hidden"
            >
              See rooms & rates
              <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-500 ease-out" />
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Cue Affordance */}
      <motion.div 
        style={{ opacity: textOpacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4"
      >
        <span className="font-sans text-[10px] text-parchment/50 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-16 bg-parchment/10 relative overflow-hidden">
          <motion.div 
            className="w-full h-1/2 bg-parchment/50"
            animate={prefersReducedMotion ? {} : { y: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes drift {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 0%; }
        }
      `}</style>
    </section>
  )
}
