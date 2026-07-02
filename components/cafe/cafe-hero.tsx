"use client"

import { motion } from "framer-motion"

export function CafeHero() {
  return (
    <section className="relative flex h-[70svh] w-full items-center justify-center overflow-hidden bg-background">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[0.2]"
        style={{ backgroundImage: "url('/images/offthetrail8.jpeg')" }}
      />
      <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />

      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] grayscale mix-blend-overlay"
        style={{ backgroundImage: "url('/noise.png')" }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 flex flex-col items-center justify-center gap-6 px-6 text-center mt-16"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
          Eat Slowly
        </span>
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-tight text-white/95 max-w-3xl mx-auto">
          The OffTheTrail Café.
        </h1>
        <p className="max-w-md text-white/70 mt-2">
          Food, warm drinks, and a calm place to watch the mountains.
        </p>
      </motion.div>
    </section>
  )
}
