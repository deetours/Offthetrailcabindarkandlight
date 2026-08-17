"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"

interface StoryParagraph {
  text: string
  isQuote?: boolean
}

interface StorySceneProps {
  numeral: string
  headline: string
  paragraphs: StoryParagraph[]
  mainImageSrc: string
  insetImageSrc: string
}

export function StoryScene({ numeral, headline, paragraphs, mainImageSrc, insetImageSrc }: StorySceneProps) {
  const containerRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Slower parallax for the main image
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

  return (
    <section 
      ref={containerRef} 
      className="relative flex flex-col md:flex-row min-h-screen bg-background overflow-hidden"
    >
      {/* Background Film Grain */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      {/* Main Image Column - 55% width on desktop, bleeds left and top/bottom */}
      <div className="relative w-full md:w-[55%] h-[60vh] md:h-screen md:sticky md:top-0 z-10">
        <motion.div 
          style={prefersReducedMotion ? {} : { y: imageY }}
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
        >
          <Image
            src={mainImageSrc}
            alt={headline}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 55vw"
          />
        </motion.div>

        {/* Gradient fade to background on bottom for mobile only */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent md:hidden z-20" />

        {/* Inset Image Tile - anchored bottom-right of main photo */}
        {/* On mobile: part of the normal flow block below image. On desktop: overlapping bottom right */}
        <motion.div 
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: -2, y: 20 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, rotate: 3, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          whileHover={prefersReducedMotion ? {} : { scale: 1.05, rotate: 5 }}
          className="hidden md:block absolute bottom-12 -right-16 lg:-right-24 w-48 lg:w-64 aspect-[3/4] z-30 shadow-2xl border border-border bg-card overflow-hidden origin-bottom-right transition-transform duration-500"
        >
          <Image
            src={insetImageSrc}
            alt="Detail view"
            fill
            className="object-cover opacity-90 hover:opacity-100 transition-opacity"
            sizes="(max-width: 768px) 0vw, 20vw"
          />
        </motion.div>
      </div>

      {/* Mobile Inset Image (Clean stack) */}
      <div className="md:hidden relative w-full px-6 -mt-8 mb-12 z-20">
        <div className="relative w-1/2 ml-auto aspect-[3/4] shadow-xl border border-border overflow-hidden">
           <Image
            src={insetImageSrc}
            alt="Detail view"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      </div>

      {/* Text Column - remaining width, minimum 64px gutter via padding */}
      <div className="relative w-full md:w-[45%] flex flex-col justify-center px-6 md:pl-16 lg:pl-24 md:pr-16 py-16 md:py-32 z-20">
        
        <div className="max-w-xl">
          {/* Numeral */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif text-primary text-lg lg:text-xl italic mb-4"
          >
            {numeral}
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-12"
          >
            {headline}
          </motion.h2>

          {/* Paragraphs */}
          <div className="space-y-8">
            {paragraphs.map((p, i) => {
              if (p.isQuote) {
                return (
                  <motion.blockquote
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                    className="relative pl-6 lg:pl-8 py-2 font-serif italic text-xl lg:text-2xl text-foreground leading-relaxed my-12"
                  >
                    {/* Animated left border */}
                    <motion.div 
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, delay: 0.4 + (i * 0.1), ease: [0.23, 1, 0.32, 1] }}
                      className="absolute left-0 top-0 w-[2px] h-full bg-primary origin-top"
                    />
                    {p.text}
                  </motion.blockquote>
                )
              }

              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                  className="font-sans text-muted-foreground text-base lg:text-lg leading-relaxed font-light"
                >
                  {p.text}
                </motion.p>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
