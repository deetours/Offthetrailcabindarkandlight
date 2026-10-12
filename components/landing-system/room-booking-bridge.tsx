"use client"

import { useState } from "react"
import { RoomCatalog } from "./room-catalog"
import { BookingFlow } from "./booking-flow"
import { RoomDef } from "./room-ledger"
import { TrustBar, TrustCueDef } from "./trust-bar"
import { HostProfile, HostProfileDef } from "./host-profile"

interface RoomBookingBridgeProps {
  propertyName: string
  rooms: RoomDef[]
  trustCues: TrustCueDef[]
  host: HostProfileDef | null
  qrImagePath: string
  ownerWhatsApp: string
}

export function RoomBookingBridge({
  propertyName,
  rooms,
  trustCues,
  host,
  qrImagePath,
  ownerWhatsApp,
}: RoomBookingBridgeProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId)
  }

  return (
    <>
      {/* Chapter III: Dedicated Room Catalogue (Pattern C) */}
      <RoomCatalog 
        numeral="III — The Room Collection"
        headline="Spaces shaped by the ridge."
        subhead="Ten secluded rooms across three distinct categories. Natural wood finishes, mountain stonework, and unhurried mornings."
        rooms={rooms}
        onSelectRoom={handleSelectRoom}
      />

      {/* Chapter IV: Focused Booking Engine & Payment (Pattern D) */}
      <section id="booking-flow" className="py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-background relative z-20">
        <div className="max-w-4xl mx-auto mb-16 text-center relative z-10">
          <div className="text-xs font-sans tracking-[0.22em] text-primary font-semibold uppercase mb-3">
            IV — Reservations & Pricing
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-tight">
            Reserve your stay.
          </h2>
          <p className="font-sans text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-xl mx-auto mt-4">
            Direct, commission-free reservations with instant owner verification on WhatsApp.
          </p>
        </div>

        <TrustBar cues={trustCues} />
        
        <HostProfile host={host} />

        <BookingFlow 
          propertyName={propertyName}
          rooms={rooms}
          qrImagePath={qrImagePath}
          ownerWhatsApp={ownerWhatsApp}
          selectedRoomId={selectedRoomId}
        />
      </section>
    </>
  )
}
