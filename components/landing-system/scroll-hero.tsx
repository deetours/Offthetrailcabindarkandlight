"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import Image from "next/image"

interface ScrollHeroProps {
  title: string
  tagline: string
  imagePath: string
}

export function ScrollHero({ title, tagline, imagePath }: ScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Apple-style Ken Burns: Image scales from 1 to 1.08 over the scroll distance
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  // Subtle parallax for the text content
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative h-[100vh] w-full bg-ink flex items-center justify-center overflow-hidden">
      {/* Background Image with Scroll-Linked Scale */}
      <motion.div
        className="absolute inset-0 z-0 origin-center"
        style={{ scale: prefersReducedMotion ? 1 : scale }}
      >
        <Image
          src={imagePath}
          alt={title}
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </motion.div>

      {/* Content with sequenced fade-in */}
      <motion.div 
        style={{ y: prefersReducedMotion ? "0%" : textY, opacity: textOpacity }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mt-20"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // smooth ease-out
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-parchment tracking-tight drop-shadow-xl"
        >
          {title}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-sans text-lg md:text-xl text-parchment/90 tracking-wide max-w-2xl font-light"
        >
          {tagline}
        </motion.p>

        {/* Primary CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          onClick={() => {
            document.getElementById("booking-ledger")?.scrollIntoView({ behavior: "smooth" })
          }}
          className="mt-16 px-8 py-4 bg-transparent border border-parchment/30 text-parchment font-sans text-sm font-medium uppercase tracking-widest rounded-full hover:border-parchment hover:bg-parchment/5 transition-all duration-300"
        >
          See rooms & rates
        </motion.button>
      </motion.div>
    </section>
  )
}
