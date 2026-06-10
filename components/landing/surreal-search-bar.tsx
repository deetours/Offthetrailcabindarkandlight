"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion"
import { Search, MapPin, Compass, Users, Calendar, Sparkles } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase-client"

// Placeholder texts for the surreal search bar
const placeholders = [
  "Search Manali workations...",
  "Find weekend trips from Delhi...",
  "Hostels near beaches...",
  "Backpacking in Himachal...",
  "Group trips this weekend..."
]

export function SurrealSearchBar() {
  const [index, setIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full max-w-xl z-50">
      <motion.div
        animate={{ 
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? "0 20px 40px -10px rgba(var(--primary-rgb), 0.2)" 
            : "0 10px 30px -15px rgba(0,0,0,0.3)"
        }}
        className="relative flex items-center w-full bg-background/60 backdrop-blur-xl border border-white/10 rounded-full overflow-hidden p-2"
      >
        <div className="pl-4 pr-2">
          <Search className={`h-5 w-5 transition-colors ${isFocused ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        
        <div className="relative flex-1 h-12 flex items-center">
          <AnimatePresence mode="wait">
            {!query && !isFocused && (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center text-muted-foreground/70 pointer-events-none text-sm md:text-base font-serif italic"
              >
                {placeholders[index]}
              </motion.div>
            )}
          </AnimatePresence>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full h-full bg-transparent border-none outline-none text-foreground text-sm md:text-base placeholder-transparent"
            placeholder={placeholders[index]}
          />
        </div>

        <button className="h-10 px-6 rounded-full bg-primary text-primary-foreground text-sm font-medium tracking-wide transition-transform hover:scale-105 active:scale-95 shrink-0">
          Find Escape
        </button>
      </motion.div>

      {/* Dropdown Suggestions */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-4 bg-background/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-2xl overflow-hidden"
          >
            {/* Quick Filters / Moods */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3 ml-2">Discover by Vibe</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "🏔️", label: "Chill" },
                  { icon: "🧗", label: "Adventure" },
                  { icon: "💻", label: "Workation" },
                  { icon: "🪩", label: "Party" },
                  { icon: "🕉️", label: "Spiritual" },
                  { icon: "🛤️", label: "Offbeat" },
                ].map((mood) => (
                  <button key={mood.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors">
                    <span>{mood.icon}</span>
                    <span>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Suggestions */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3 ml-2 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-primary" /> Trending Now
              </p>
              <div className="space-y-1">
                {[
                  { title: "Spiti Valley Road Trip", type: "Trip", location: "Himachal Pradesh" },
                  { title: "Manali Workation Hostel", type: "Stay", location: "Old Manali" },
                  { title: "Gokarna Beach Trek", type: "Experience", location: "Karnataka" },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.location}</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 border border-white/10 rounded-full px-2 py-0.5">
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
