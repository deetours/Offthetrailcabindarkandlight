"use client"

import Image from "next/image"

export function DalhousieHero() {
  return (
    <section className="relative h-[90vh] w-full bg-ink flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/offthetrail7.jpeg" // Replaced with user's specific photography
          alt="Dalhousie Estate"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mt-20">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-parchment tracking-tight drop-shadow-xl">
          Dalhousie Estate
        </h1>
        <p className="mt-6 font-sans text-lg md:text-xl text-parchment/90 tracking-wide max-w-2xl font-light">
          Trade the noise for silence. Pine air, colonial stone, and slow mornings on the ridge.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => {
            document.getElementById("booking-ledger")?.scrollIntoView({ behavior: "smooth" })
          }}
          className="mt-12 px-8 py-4 bg-brass text-ink font-sans text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-brass/90 transition-colors shadow-2xl"
        >
          Check Availability
        </button>
      </div>
    </section>
  )
}
