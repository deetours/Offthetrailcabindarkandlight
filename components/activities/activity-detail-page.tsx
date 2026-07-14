"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, Clock, Mountain, CalendarOff, ChevronDown, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Navbar } from "../ui/navbar"
import { Footer } from "../ui/footer"
import { OFFTHETRAIL_DATA } from "@/lib/frontend-data"

type ActivityType = typeof OFFTHETRAIL_DATA.activities[0]

interface ActivityDetailPageProps {
  activity: ActivityType
}

export function ActivityDetailPage({ activity }: ActivityDetailPageProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  
  // Booking Form State
  const [date, setDate] = useState("")
  const [guests, setGuests] = useState("1")
  const [email, setEmail] = useState("")

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !email) return
    const message = `Activity Booking Request\nActivity: ${activity.title}\nDate: ${date}\nGuests: ${guests}\nEmail: ${email}\nTotal Price: ₹${(activity.price * parseInt(guests)).toLocaleString()}`
    const link = `https://wa.me/${OFFTHETRAIL_DATA.whatsapp_number}?text=${encodeURIComponent(message)}`
    window.open(link, "_blank")
  }

  return (
    <main className="grain min-h-screen bg-background selection:bg-primary/30">
      <Navbar visible={true} />

      {/* Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <Image
          src={activity.heroImage}
          alt={activity.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute inset-x-0 bottom-0 px-6 pb-20 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto flex flex-col items-start">
            <Link
              href="/activities"
              className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-primary/60 hover:text-primary transition-all mb-8"
            >
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
              All Activities
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground tracking-tightest leading-[1.1]"
            >
              {activity.title}
            </motion.h1>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          
          {/* Left Column: Editorial Content */}
          <div className="flex-1 space-y-20">
            
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Difficulty", value: activity.difficulty, icon: Mountain },
                { label: "Duration", value: activity.duration, icon: Clock },
                { label: "Best Season", value: activity.season, icon: CalendarOff },
              ].map((stat, idx) => (
                <div key={idx} className="glass p-6 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center gap-4 group hover:border-primary/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">{stat.label}</p>
                    <p className="font-serif text-xl text-foreground">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Introduction & Highlights */}
            <div className="space-y-8">
              <h2 className="font-serif text-3xl md:text-5xl text-foreground">Introduction</h2>
              <p className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                {activity.content.introduction}
              </p>
              
              <div className="h-px w-full bg-border dark:bg-white/5 my-12" />
              
              <h3 className="font-serif text-3xl md:text-5xl text-foreground">Across the Valley</h3>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                {activity.content.highlights}
              </p>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed">
                {activity.content.experience}
              </p>
            </div>

            {/* Safety & Experience */}
            <div className="space-y-12">
              <h3 className="font-serif text-3xl md:text-5xl text-foreground">Safety & Experience</h3>
              <div className="space-y-8">
                {activity.content.safety.map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-2xl text-foreground mb-2">{item.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/5">
              <h3 className="font-serif text-3xl text-foreground mb-8">How It Works</h3>
              <ul className="space-y-6">
                {activity.content.howItWorks.map((step, idx) => (
                  <li key={idx} className="flex gap-6 text-muted-foreground leading-relaxed">
                    <span className="font-serif text-primary text-xl">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-[10px] uppercase tracking-widest text-primary/80 font-bold border-t border-white/5 pt-8">
                Note: {activity.content.timeNote}
              </p>
            </div>

            {/* Accordions */}
            <div className="space-y-4">
              {/* Inclusions */}
              <div className="border border-white/5 rounded-3xl overflow-hidden glass">
                <button 
                  onClick={() => toggleAccordion('inclusions')}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className="font-serif text-2xl text-foreground">Inclusions & Exclusions</span>
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-500 ${openAccordion === 'inclusions' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openAccordion === 'inclusions' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                          <p className="text-[10px] uppercase tracking-widest text-primary mb-4 font-bold">Included</p>
                          <ul className="space-y-3">
                            {activity.inclusions.map((inc, i) => (
                              <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm">
                                <CheckCircle2 className="w-4 h-4 text-primary/60" /> {inc}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 mb-4 font-bold">Not Included</p>
                          <ul className="space-y-3">
                            {activity.exclusions.map((exc, i) => (
                              <li key={i} className="flex items-center gap-3 text-muted-foreground/60 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 ml-1.5" /> {exc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* FAQs */}
              <div className="border border-white/5 rounded-3xl overflow-hidden glass">
                <button 
                  onClick={() => toggleAccordion('faqs')}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className="font-serif text-2xl text-foreground">FAQs</span>
                  <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-500 ${openAccordion === 'faqs' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openAccordion === 'faqs' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 space-y-6">
                        {activity.faqs.map((faq, i) => (
                          <div key={i}>
                            <p className="font-serif text-lg text-foreground mb-2">{faq.question}</p>
                            <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Immersive Gallery */}
            <div className="space-y-8 pt-12 border-t border-white/5">
              <h3 className="font-serif text-3xl md:text-5xl text-foreground">Photo Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activity.gallery.map((img, idx) => (
                  <div key={idx} className={`relative rounded-3xl overflow-hidden bg-card ${idx === 2 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-square md:aspect-[4/3]'}`}>
                    <Image
                      src={img}
                      alt={`Gallery image ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Floating Booking Widget */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-32 glass rounded-[3rem] p-8 border border-white/10 shadow-2xl">
              <h3 className="font-serif text-3xl text-foreground mb-2">Reserve Slot</h3>
              <p className="text-muted-foreground text-sm mb-8">Secure your adventure in the mountains.</p>

              <form onSubmit={handleBook} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold ml-2">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-sans text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold ml-2">Number of Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-sans text-sm appearance-none"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n} className="bg-background">{n}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold ml-2">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-background/50 border border-white/10 rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-sans text-sm placeholder:text-muted-foreground/30"
                  />
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold mb-1">Total Activity Price</p>
                      <p className="font-serif text-4xl text-foreground">₹{(activity.price * parseInt(guests)).toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-muted-foreground/40 mb-2">incl. all taxes</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full relative group overflow-hidden flex items-center justify-center rounded-full bg-primary py-5 font-bold text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="relative z-10 uppercase tracking-[0.3em] text-[10px]">
                      Book Your Adventure
                    </span>
                    <div className="absolute inset-0 bg-foreground dark:bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
