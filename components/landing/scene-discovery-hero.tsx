"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SceneIntentSelector } from "./scene-intent-selector"

interface SceneDiscoveryHeroProps {
  onOpenModal: (tab: "stay" | "adventure") => void
}

export function SceneDiscoveryHero({ onOpenModal }: SceneDiscoveryHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Slow, sweeping parallax for the background image
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

  return (
    <section 
      ref={containerRef}
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/suralbhatori1.jpeg')" }}
        />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] grayscale mix-blend-overlay"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      {/* Main Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-20 flex flex-col items-center justify-center gap-6 px-6 text-center mt-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: smoothEase }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-[10px] font-bold uppercase tracking-editorial-label text-white/60">
            Himachal Pradesh, India
          </span>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] tracking-tight text-white/95 max-w-4xl mx-auto">
            Cabins, café, and curated adventures in the hills.
          </h1>
        </motion.div>
      </motion.div>

      {/* Floating Intent Selector replacing old CTAs */}
      <SceneIntentSelector onOpenModal={onOpenModal} />
      
      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
      >
        <span className="text-[9px] uppercase tracking-widest text-white/40">Scroll</span>
        <div className="h-8 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  )
}
