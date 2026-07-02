"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, ArrowRight } from "lucide-react"
import { OFFTHETRAIL_DATA } from "@/lib/frontend-data"

interface SceneStaysGridProps {
  onOpenModal: (tab: "stay", locationId: string) => void
}

export function SceneStaysGrid({ onOpenModal }: SceneStaysGridProps) {
  return (
    <section className="relative w-full bg-background px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h2 className="font-serif text-4xl text-foreground dark:text-white/90 md:text-5xl">
            Our Mountain Stays
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground dark:text-white/50">
            Rooms, retreats, and cottages designed for those who seek solitude in nature.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OFFTHETRAIL_DATA.stays.map((stay, index) => (
            <StayCard key={stay.id} stay={stay} index={index} onOpenModal={onOpenModal} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StayCard({ stay, index, onOpenModal }: { stay: typeof OFFTHETRAIL_DATA.stays[0]; index: number; onOpenModal: SceneStaysGridProps["onOpenModal"] }) {
  const [hovered, setHovered] = useState(false)

  // Get a representative price if available (like starting price)
  const startingPrice = stay.rooms.find(r => r.price.includes("₹"))?.price.split(" ")[0] || "Price on enquiry"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpenModal("stay", stay.id)}
      className="group relative flex min-h-[450px] cursor-pointer flex-col justify-end overflow-hidden rounded-[2rem] border border-white/5 bg-card p-8"
    >
      <motion.div
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-cover bg-center grayscale-[0.2]"
        style={{ backgroundImage: `url('${stay.image}')` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

      <div className="absolute left-6 top-6 z-20">
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-editorial-label text-white/80 backdrop-blur-md">
          <MapPin className="h-3 w-3" />
          {stay.location}
        </span>
      </div>

      <div className="relative z-20 mt-auto flex flex-col items-start w-full">
        <h3 className="font-serif text-3xl tracking-tight text-white/95 md:text-4xl">
          {stay.name}
        </h3>
        
        <p className="mt-2 max-w-[90%] text-sm leading-relaxed text-white/70">
          {stay.description}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Starting from</span>
            <span className="text-sm text-primary font-medium">{startingPrice}</span>
          </div>
          
          <button className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-5 py-2.5 text-white transition-all group-hover:bg-white group-hover:text-black">
            <span className="text-[10px] font-bold uppercase tracking-widest">Check Availability</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
