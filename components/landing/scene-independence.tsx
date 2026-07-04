"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function SceneIndependence() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Cinematic masking: text scale and fade is tied 1:1 to scroll position
  const scale = useTransform(scrollYProgress, [0.0, 0.2, 0.8, 1.0], [0.92, 1, 1, 0.95])
  const opacity = useTransform(scrollYProgress, [0.0, 0.15, 0.85, 1.0], [0, 1, 1, 0])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.0])
  const bgOpacity = useTransform(scrollYProgress, [0.0, 0.2, 0.8, 1.0], [0, 0.07, 0.07, 0])

  // Line-by-line staggered reveal — distributed in first 40% so all arrive early
  const line1Opacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1])
  const line1Y = useTransform(scrollYProgress, [0.05, 0.2], [40, 0])
  const line2Opacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1])
  const line2Y = useTransform(scrollYProgress, [0.1, 0.25], [40, 0])
  const line3Opacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1])
  const line3Y = useTransform(scrollYProgress, [0.2, 0.35], [20, 0])

  return (
    <div ref={sectionRef} className="relative min-h-[160vh]">
      {/* Cinematic Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background — scales on scroll like Apple product pages */}
        <motion.div
          style={{ scale: bgScale, opacity: bgOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,184,115,1)_0%,_transparent_65%)]" />
        </motion.div>

        {/* Vignette borders */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none z-10" />

        {/* Content */}
        <motion.div
          style={{ scale, opacity }}
          className="relative z-20 max-w-4xl mx-auto px-6 md:px-16 text-center"
        >
          {/* "No" — the anchor word */}
          <motion.div style={{ opacity: line1Opacity, y: line1Y }}>
            <span className="block font-serif text-[clamp(2rem,10vw,9rem)] leading-[0.85] text-foreground tracking-tightest">
              No chains.
            </span>
          </motion.div>

          <motion.div style={{ opacity: line1Opacity, y: line1Y }}>
            <span className="block font-serif text-[clamp(2rem,10vw,9rem)] leading-[0.85] text-foreground/30 tracking-tightest italic">
              No playbook.
            </span>
          </motion.div>

          <motion.div
            style={{ opacity: line2Opacity, y: line2Y }}
            className="mt-8 md:mt-12 space-y-4 md:space-y-3"
          >
            <p className="font-serif text-lg md:text-2xl text-muted-foreground/60 lowercase italic leading-relaxed max-w-2xl mx-auto px-4 md:px-0">
              Just a cabin, a cafe, and the kind of adventure we would choose for ourselves.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-bold text-muted-foreground/30">
              <span>Since 2019</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-border dark:bg-white/10" />
              <span>Independent</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-border dark:bg-white/10" />
              <span>Intentional</span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-border dark:bg-white/10" />
              <span>Uncompromising</span>
            </div>
          </motion.div>

          <motion.div style={{ opacity: line3Opacity, y: line3Y }} className="mt-12 md:mt-20 px-4 md:px-0">
            <div className="h-px w-16 md:w-24 bg-primary/20 mx-auto mb-8 md:mb-10" />
            <p className="font-serif text-xl md:text-3xl text-foreground/50 italic leading-snug md:leading-normal">
              While others chase{" "}
              <span className="text-foreground/20 line-through decoration-primary/30">volume</span>
              , we stay loyal to{" "}
              <span className="text-primary/80 block sm:inline mt-2 sm:mt-0">meaning.</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
