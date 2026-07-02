"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MoveRight, MapPin, Coffee, Compass } from "lucide-react"

const bentoItems = [
  {
    id: "dalhousie",
    title: "The Dalhousie Estate",
    type: "Stay",
    image: "/images/offthetrail7.jpeg",
    span: "md:col-span-2 md:row-span-2",
    description: "10 secluded mountain rooms. Super Deluxe and Deluxe rooms feature attached balconies overlooking the pines.",
    cta: "View Rooms",
    icon: MapPin,
  },
  {
    id: "jibhi",
    title: "Jibhi Canopy Cottages",
    type: "Stay",
    image: "/Jibhi.jpg",
    span: "md:col-span-2 md:row-span-1",
    description: "Duplex cottages and single rooms suspended in the forest. From ₹4,500 per night, including all taxes.",
    cta: "Explore Property",
    icon: MapPin,
  },
  {
    id: "journey",
    title: "Sural Bhatori Expedition",
    type: "Journey",
    image: "/images/suralbhatori.jpeg",
    span: "md:col-span-1 md:row-span-1",
    description: "A curated trek through vast green valleys to high-altitude monasteries.",
    cta: "Read Story",
    icon: Compass,
  },
  {
    id: "feeling",
    title: "Shared Silence",
    type: "Experience",
    image: "/hostel-lights-mountain-roads-shared-meals-bonfire-.jpg",
    span: "md:col-span-1 md:row-span-1",
    description: "Evenings by the fire. Traveling slowly, together.",
    cta: "The Vibe",
    icon: Coffee,
  },
]

export function SceneBentoGrid() {
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
            Curated Spaces
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground dark:text-white/50">
            A selection of our most remote and beautiful properties, designed for those who seek solitude.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 md:h-[800px]">
          {bentoItems.map((item, index) => (
            <BentoCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BentoCard({ item, index }: { item: typeof bentoItems[0]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const Icon = item.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex min-h-[300px] cursor-pointer flex-col justify-end overflow-hidden rounded-[2rem] border border-white/5 bg-card p-8 ${item.span}`}
    >
      <motion.div
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-cover bg-center grayscale-[0.2]"
        style={{ backgroundImage: `url('${item.image}')` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />

      <div className="absolute left-6 top-6 z-20">
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-editorial-label text-white/80 backdrop-blur-md">
          <Icon className="h-3 w-3" />
          {item.type}
        </span>
      </div>

      <div className="relative z-20 mt-auto flex flex-col items-start">
        <h3 className="font-serif text-3xl tracking-tight text-white/95 md:text-4xl">
          {item.title}
        </h3>
        
        <div className="mt-3 flex items-center justify-between w-full">
          <p className="max-w-[80%] text-sm leading-relaxed text-white/70">
            {item.description}
          </p>
          
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black"
              >
                <MoveRight className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
