"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Calendar as CalendarIcon, Users, MapPin, Sparkles, Navigation, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { useRouter } from "next/navigation"
import {
  DISCOVERY_COPY,
  NORTHEAST_DESTINATIONS,
  NORTHEAST_MOODS,
} from "@/lib/pms/discovery-data"

type ProductType = "stays" | "trips" | "both"

const searchPlaceholders = {
  stays: DISCOVERY_COPY.placeholders.stays,
  trips: DISCOVERY_COPY.placeholders.trips,
  both: DISCOVERY_COPY.placeholders.both,
}

export function DiscoveryConsole() {
  const router = useRouter()
  const [productType, setProductType] = useState<ProductType>("both")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("")
  const [selectedMood, setSelectedMood] = useState("")
  const [date, setDate] = useState<DateRange | undefined>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [travelers, setTravelers] = useState(1)
  const [isTravelerOpen, setIsTravelerOpen] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const activePlaceholders = searchPlaceholders[productType]
  const activeMood = useMemo(
    () => NORTHEAST_MOODS.find((mood) => mood.tag === selectedMood) ?? null,
    [selectedMood],
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % activePlaceholders.length)
    }, 3500)

    return () => clearInterval(timer)
  }, [activePlaceholders.length, productType])

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (productType !== "both") params.set("type", productType)
    if (searchQuery) params.set("q", searchQuery)
    if (selectedDestination) params.set("destination", selectedDestination)
    if (selectedMood) params.set("mood", selectedMood)
    if (date?.from) params.set("from", format(date.from, "yyyy-MM-dd"))
    if (date?.to) params.set("to", format(date.to, "yyyy-MM-dd"))
    if (travelers > 1) params.set("travelers", travelers.toString())

    router.push(`/all-trips?${params.toString()}`)
  }

  return (
    <div className="relative z-40 flex w-full max-w-2xl flex-col gap-4">
      <div className="flex w-fit items-center gap-1 rounded-full border border-white/5 bg-[#141414] p-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        {(["stays", "trips", "both"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setProductType(type)}
            className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              productType === type
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/80"
            }`}
          >
            {productType === type && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 -z-10 rounded-full bg-white/10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="relative flex flex-col divide-y divide-white/5 rounded-[2rem] border border-white/10 bg-[#141414] shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      >
        <div className="relative flex items-center p-2 pl-4">
          <Search
            className={`h-5 w-5 transition-colors ${
              isSearchFocused ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <div className="relative mx-3 flex h-12 flex-1 items-center overflow-hidden">
            <AnimatePresence mode="wait">
              {!searchQuery && !isSearchFocused && (
                <motion.div
                  key={`${productType}-${placeholderIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-none absolute inset-0 flex items-center text-base font-serif italic text-muted-foreground/60"
                >
                  {activePlaceholders[placeholderIndex]}
                </motion.div>
              )}
            </AnimatePresence>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="h-full w-full border-none bg-transparent text-base text-foreground outline-none placeholder-transparent"
              placeholder={activePlaceholders[placeholderIndex]}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-0 rounded-full bg-white/5 p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="no-scrollbar absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[60vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#141414] p-4 shadow-2xl"
              >
                {!searchQuery ? (
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground/60">
                        <Sparkles className="h-3 w-3 text-primary" />
                        Northeast now
                      </p>
                      <div className="grid gap-1">
                        {DISCOVERY_COPY.suggestions.map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setSearchQuery(item)
                              setIsSearchFocused(false)
                            }}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground/90 transition-colors hover:bg-white/5"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                            </div>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground/60">
                        Discover by mood
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {NORTHEAST_MOODS.slice(0, 6).map((mood) => (
                          <button
                            key={mood.tag}
                            onClick={() => {
                              setSelectedMood(mood.tag)
                              setIsSearchFocused(false)
                            }}
                            className="rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                          >
                            {mood.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-sm font-serif italic text-muted-foreground">
                    Press search to explore Northeast results for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 gap-0 border-b border-white/5 md:grid-cols-2">
          <div className="border-b border-white/5 p-4 md:border-b-0 md:border-r md:border-white/5">
            <span className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
              Destination
            </span>
            <select
              value={selectedDestination}
              onChange={(event) => setSelectedDestination(event.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none"
            >
              <option value="">Anywhere in the Northeast</option>
              {NORTHEAST_DESTINATIONS.map((destination) => (
                <option key={destination} value={destination} className="bg-[#141414]">
                  {destination}
                </option>
              ))}
            </select>
          </div>
          <div className="p-4">
            <span className="mb-2 block text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
              Mood
            </span>
            <select
              value={selectedMood}
              onChange={(event) => setSelectedMood(event.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none"
            >
              <option value="">Choose a travel rhythm</option>
              {NORTHEAST_MOODS.map((mood) => (
                <option key={mood.tag} value={mood.tag} className="bg-[#141414]">
                  {mood.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button className="flex flex-1 items-center gap-3 rounded-bl-[2rem] border-r border-white/5 p-4 text-left transition-colors hover:bg-white/[0.02]">
                <CalendarIcon className={`h-4 w-4 ${date ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                    When
                  </span>
                  <span className={`text-sm ${date ? "text-foreground" : "text-muted-foreground"}`}>
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                        </>
                      ) : (
                        format(date.from, "LLL dd")
                      )
                    ) : (
                      "Add dates"
                    )}
                  </span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-white/10 bg-[#141414] p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                className="rounded-xl"
              />
            </PopoverContent>
          </Popover>

          <Popover open={isTravelerOpen} onOpenChange={setIsTravelerOpen}>
            <PopoverTrigger asChild>
              <button className="flex flex-1 items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.02]">
                <Users className={`h-4 w-4 ${travelers > 1 ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
                    Who
                  </span>
                  <span className="text-sm text-foreground">
                    {travelers} {travelers === 1 ? "Traveler" : "Travelers"}
                  </span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 rounded-2xl border-white/10 bg-[#141414] p-4" align="start">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Travelers</p>
                  <p className="text-xs text-muted-foreground">Adults and shared room plans</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    disabled={travelers <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-foreground transition-colors hover:bg-white/5 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-4 text-center text-sm font-medium">{travelers}</span>
                  <button
                    onClick={() => setTravelers(Math.min(20, travelers + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-foreground transition-colors hover:bg-white/5"
                  >
                    +
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {NORTHEAST_MOODS.slice(0, 4).map((mood) => {
          const isActive = selectedMood === mood.tag
          return (
            <button
              key={mood.tag}
              onClick={() => setSelectedMood(isActive ? "" : mood.tag)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-white/5 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {mood.label}
            </button>
          )
        })}
        {activeMood && (
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
            {activeMood.description}
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSearch}
        className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-medium tracking-wide text-primary-foreground shadow-[0_8px_30px_rgba(var(--primary-rgb),0.3)] transition-shadow hover:shadow-[0_8px_40px_rgba(var(--primary-rgb),0.4)]"
      >
        {productType === "stays"
          ? "Find Northeast stays"
          : productType === "trips"
            ? "Find Northeast trips"
            : "Start Northeast discovery"}
        <Navigation className="h-4 w-4" />
      </motion.button>
    </div>
  )
}
