"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Compass, ArrowRight } from "lucide-react"
import { OFFTHETRAIL_DATA } from "@/lib/frontend-data"

interface SceneJourneysProps {
  onOpenModal: (tab: "adventure", destinationId: string) => void
}

export function SceneJourneys({ onOpenModal }: SceneJourneysProps) {
  return (
    <section className="relative w-full bg-background px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h2 className="font-serif text-4xl text-foreground dark:text-white/90 md:text-5xl">
              Curated Journeys
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground dark:text-white/50">
              Expeditions and treks for those who wish to go beyond the usual paths.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {OFFTHETRAIL_DATA.journeys.map((journey, index) => (
            <JourneyCard key={journey.id} journey={journey} index={index} onOpenModal={onOpenModal} />
          ))}
        </div>
      </div>
    </section>
  )
}

function JourneyCard({ journey, index, onOpenModal }: { journey: typeof OFFTHETRAIL_DATA.journeys[0]; index: number; onOpenModal: SceneJourneysProps["onOpenModal"] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpenModal("adventure", journey.id)}
      className="group relative flex min-h-[500px] cursor-pointer flex-col justify-end overflow-hidden rounded-[2rem] border border-white/5 bg-card p-6"
    >
      <motion.div
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-cover bg-center grayscale-[0.3]"
        style={{ backgroundImage: `url('${journey.image}')` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="absolute right-6 top-6 z-20">
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[9px] font-medium uppercase tracking-widest text-white/80 backdrop-blur-md">
          <Compass className="h-3 w-3" />
          {journey.type}
        </span>
      </div>

      <div className="relative z-20 mt-auto flex flex-col items-start w-full">
        <span className="text-[10px] uppercase tracking-widest text-primary/80 font-bold mb-2">
          {journey.destination}
        </span>
        <h3 className="font-serif text-2xl tracking-tight text-white/95 md:text-3xl">
          {journey.name}
        </h3>
        
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {journey.description}
        </p>

        <div className="mt-6 w-full">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur px-5 py-3 text-white transition-all group-hover:bg-white group-hover:text-black">
            <span className="text-[10px] font-bold uppercase tracking-widest">Register Interest</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
