"use client"

import { Navbar } from "../ui/navbar"
import { Footer } from "../ui/footer"
import { OFFTHETRAIL_DATA } from "@/lib/frontend-data"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Mountain } from "lucide-react"

export function ActivitiesPage() {
  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      <div className="px-6 pt-32 pb-24 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="mb-20 text-center"
          >
            <h1 className="font-serif text-5xl md:text-7xl text-foreground tracking-tightest">
              Curated <span className="text-foreground/30 italic">Activities</span>
            </h1>
            <p className="mt-6 text-muted-foreground font-sans max-w-xl mx-auto uppercase tracking-widest text-xs leading-relaxed">
              Elevate your journey with experiences that cut through the ordinary.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {OFFTHETRAIL_DATA.activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <Link href={`/activities/${activity.id}`} className="group block">
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-card border border-border dark:border-white/5 transition-all duration-700 group-hover:border-primary/20">
                    <Image
                      src={activity.heroImage}
                      alt={activity.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
                    
                    <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                      <div className="flex items-center gap-2 mb-4 text-primary">
                        <Mountain className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                          {activity.location}
                        </span>
                      </div>
                      <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 group-hover:text-primary transition-colors duration-500">
                        {activity.title}
                      </h2>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">₹{activity.price.toLocaleString()}</p>
                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-500">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
