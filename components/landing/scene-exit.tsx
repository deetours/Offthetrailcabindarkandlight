"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Magnetic } from "../ui/magnetic"

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

export function SceneExit() {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      
      <div className="relative z-10 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={transition}
          className="space-y-4"
        >
          <h2 className="font-serif text-5xl md:text-7xl text-foreground tracking-tightest">Your silence awaits.</h2>
          <p className="font-serif text-xl md:text-2xl text-muted-foreground/60 italic lowercase">
            Secure your space in the mountains.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Magnetic strength={0.15}>
            <Link
              href="/all-trips"
              className="group relative inline-flex items-center gap-4 rounded-full bg-foreground px-10 py-4 font-sans text-sm font-bold text-background tracking-widest uppercase transition-transform hover:scale-105 active:scale-95"
            >
              Find Your Stay
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </Magnetic>

          <Magnetic strength={0.15}>
            <Link
              href="/journeys"
              className="group relative inline-flex items-center gap-4 rounded-full border border-border bg-card backdrop-blur-md px-10 py-4 font-sans text-sm font-bold text-foreground tracking-widest uppercase transition-all hover:bg-secondary active:scale-95"
            >
              Explore Journeys
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      {/* Footer - minimal */}
      <footer className="absolute bottom-12 left-0 right-0 text-center z-10">
        <div className="flex items-center justify-center gap-6 opacity-30 hover:opacity-100 transition-opacity duration-700">
          <Link href="/terms" className="text-[10px] text-foreground hover:text-primary transition-colors uppercase tracking-widest">Terms</Link>
          <span className="w-1 h-1 rounded-full bg-foreground/20" />
          <Link href="/privacy" className="text-[10px] text-foreground hover:text-primary transition-colors uppercase tracking-widest">Privacy</Link>
          <span className="w-1 h-1 rounded-full bg-foreground/20" />
          <p className="text-[10px] text-foreground uppercase tracking-widest">OffTheTrail © 2026</p>
        </div>
      </footer>
    </section>
  )
}
