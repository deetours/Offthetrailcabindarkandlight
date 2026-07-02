"use client"

import { motion } from "framer-motion"
import { Coffee } from "lucide-react"
import { OFFTHETRAIL_DATA } from "@/lib/frontend-data"

export function SceneCafeEditorial() {
  const { cafe } = OFFTHETRAIL_DATA

  return (
    <section className="relative w-full bg-background px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col max-w-md"
          >
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-6">
              <Coffee className="w-4 h-4" />
              Eat Slowly
            </span>
            <h2 className="font-serif text-4xl text-foreground dark:text-white/95 md:text-5xl leading-tight">
              {cafe.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground dark:text-white/70">
              {cafe.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale-[0.2]"
              style={{ backgroundImage: `url('${cafe.images[0]}')` }}
            />
            <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
