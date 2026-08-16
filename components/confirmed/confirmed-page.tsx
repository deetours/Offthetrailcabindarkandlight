"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowRight, MessageCircle } from "lucide-react"

function ConfirmedContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  const type = searchParams.get("type")
  const id = searchParams.get("id")

  useEffect(() => {
    setMounted(true)
  }, [])

  const staysData: Record<string, { name: string; location: string }> = {
    bir: { name: "Offthetrail Bir", location: "Himachal Pradesh" },
    gokarna: { name: "Offthetrail Gokarna", location: "Karnataka" },
    manali: { name: "Offthetrail Manali", location: "Himachal Pradesh" },
    pondicherry: { name: "Offthetrail Pondicherry", location: "Tamil Nadu" },
    rishikesh: { name: "Offthetrail Rishikesh", location: "Uttarakhand" },
    varkala: { name: "Offthetrail Varkala", location: "Kerala" },
  }

  const tripsData: Record<string, { name: string; duration: string }> = {
    spiti: { name: "Spiti Valley", duration: "9 Days" },
    ladakh: { name: "Ladakh Circuit", duration: "11 Days" },
    kerala: { name: "Kerala Backwaters", duration: "6 Days" },
    meghalaya: { name: "Meghalaya Trails", duration: "7 Days" },
  }

  const booking = type === "stay" ? staysData[id || ""] : tripsData[id || ""]
  const hasReference = Boolean(type || id)

  return (
    <main className="grain min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div
          className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <AlertCircle className="h-10 w-10 text-primary" />
        </div>

        <h1
          className={`font-serif text-5xl md:text-6xl text-foreground transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          Verification required.
        </h1>

        <p
          className={`mt-4 font-serif text-xl md:text-2xl text-muted-foreground transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          We could not verify a confirmed booking from this link alone.
        </p>

        {hasReference && (
          <div
            className={`mt-8 rounded-xl bg-card p-6 transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="font-serif text-lg text-foreground">
              {booking?.name || "Booking reference received"}
            </p>
            <p className="text-sm text-muted-foreground">
              {type === "stay"
                ? booking && "location" in booking
                  ? booking.location
                  : "Stay verification pending"
                : booking && "duration" in booking
                  ? booking.duration
                  : "Trip verification pending"}
            </p>
          </div>
        )}

        <div
          className={`mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-left transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <p className="text-sm text-primary/80">
            A successful redirect or shared URL is not proof of payment verification or room confirmation. Please use the payment page or contact the team so availability and payment can be checked manually.
          </p>
        </div>

        <div
          className={`mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Our team can verify the status with you on WhatsApp</span>
        </div>

        <p
          className={`mt-12 font-serif text-lg text-foreground/60 italic transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          Hold the plan lightly until verification is complete.
        </p>

        <div
          className={`mt-12 flex flex-col items-center gap-4 transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "1200ms" }}
        >
          <Link
            href={type && id ? `/payment?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}` : "/payment"}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Review payment status
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-primary hover:underline transition-colors"
          >
            Continue exploring
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/activities"
            className="group inline-flex items-center gap-2 text-primary hover:underline transition-colors"
          >
            Explore activities
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  )
}

export function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <main className="grain min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
      }
    >
      <ConfirmedContent />
    </Suspense>
  )
}
