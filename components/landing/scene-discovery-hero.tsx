"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, MoveRight } from "lucide-react"
import { DiscoveryConsole } from "./discovery-console"
import { DISCOVERY_COPY, NORTHEAST_MOODS } from "@/lib/pms/discovery-data"

const discoveryItems = [
  {
    id: "1",
    title: "Tawang Monastery Ridge Stay",
    type: "Stay",
    mood: "Monastery Calm",
    image: "/trips/spiti-arrival.jpg",
    price: "From INR 4,900",
    status: "trending",
  },
  {
    id: "2",
    title: "Dawki River Glass Camp",
    type: "Stay",
    mood: "River and Rain",
    image: "/trips/spiti-stillness.jpg",
    price: "From INR 3,800",
    status: "available",
  },
  {
    id: "3",
    title: "Ziro Valley Workation Circuit",
    type: "Trip",
    mood: "Workation",
    image: "/hero-campfire-spiti1.jpg",
    price: "From INR 18,500",
    status: "filling_fast",
  },
  {
    id: "4",
    title: "Longwa Cultural Border Route",
    type: "Trip",
    mood: "Cultural Immersion",
    image: "/hero2.png",
    price: "From INR 22,400",
    status: "available",
  },
  {
    id: "5",
    title: "Dirang Slow Mountain Homestay",
    type: "Stay",
    mood: "Quiet Mountains",
    image: "/trips/ladakh-stillness.jpg",
    price: "From INR 4,200",
    status: "available",
  },
] as const

export function SceneDiscoveryHero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-between gap-12 overflow-hidden bg-[#0a0a0a] px-6 pb-20 pt-32 md:flex-row md:items-center md:px-16 lg:px-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] grayscale mix-blend-overlay"
        style={{ backgroundImage: "url('/noise.png')" }}
      />
      <div className="pointer-events-none absolute right-0 top-0 h-[800px] w-[800px] bg-gradient-to-bl from-primary/10 via-transparent to-transparent opacity-50 blur-[100px]" />

      <div className="relative z-20 flex w-full flex-col justify-center gap-10 md:w-5/12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
            <Sparkles className="h-3 w-3" />
            Northeast discovery console
          </div>

          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.7rem)] leading-[1.03] tracking-tight text-foreground">
            Northeast stays and journeys,
            <br />
            <span className="italic text-muted-foreground">curated closer to the clouds.</span>
          </h1>

          <p className="max-w-xl text-lg font-serif italic text-muted-foreground">
            {DISCOVERY_COPY.subheadlines[0]}
          </p>

          <div className="flex flex-wrap gap-2">
            {NORTHEAST_MOODS.slice(0, 4).map((mood) => (
              <div
                key={mood.tag}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/70"
              >
                {mood.label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <DiscoveryConsole />
        </motion.div>
      </div>

      <div className="relative z-10 h-[600px] w-full md:h-[800px] md:w-7/12">
        <motion.div
          className="grid h-full w-full grid-cols-2 grid-rows-3 gap-4 md:grid-cols-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <DiscoveryCard item={discoveryItems[0]} className="col-span-2 row-span-2" />
          <DiscoveryCard item={discoveryItems[1]} className="col-span-1 row-span-2" />
          <DiscoveryCard item={discoveryItems[3]} className="col-span-1 row-span-1" />
          <DiscoveryCard item={discoveryItems[4]} className="col-span-1 row-span-1" />
          <DiscoveryCard item={discoveryItems[2]} className="col-span-1 row-span-1" />
        </motion.div>
      </div>
    </section>
  )
}

function DiscoveryCard({ item, className }: { item: (typeof discoveryItems)[number]; className: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ y: hovered ? -4 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/5 bg-[#141414] shadow-sm ${className}`}
    >
      <motion.div
        animate={{ scale: hovered ? 1.03 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-cover bg-center grayscale-[0.2] transition-all duration-500"
        style={{ backgroundImage: `url('${item.image}')` }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent opacity-80" />

      <div className="absolute left-4 top-4 z-20 flex gap-2">
        <span className="rounded-full border border-white/10 bg-[#141414]/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 shadow-sm backdrop-blur-md">
          {item.type}
        </span>
      </div>

      <div className="absolute right-4 top-4 z-20">
        {item.status === "trending" ? (
          <span className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            Trending
          </span>
        ) : item.status === "filling_fast" ? (
          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200 shadow-sm backdrop-blur-md">
            Filling fast
          </span>
        ) : (
          <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] text-white/90 shadow-sm backdrop-blur-md">
            {item.mood}
          </span>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-5 md:p-6">
        <h3 className="mb-1 font-serif text-xl tracking-tight text-white/95 transition-colors group-hover:text-white md:text-2xl">
          {item.title}
        </h3>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-medium text-white/70">{item.price}</p>
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary"
              >
                Explore
                <MoveRight className="h-3 w-3" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
