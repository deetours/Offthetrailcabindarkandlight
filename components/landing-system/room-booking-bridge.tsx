"use client"

import { RoomCatalog } from "./room-catalog"
import { RoomDef } from "./room-ledger"
import { TrustBar, TrustCueDef } from "./trust-bar"
import { HostProfile, HostProfileDef } from "./host-profile"

interface RoomBookingBridgeProps {
  propertyName: string
  rooms: RoomDef[]
  trustCues: TrustCueDef[]
  host: HostProfileDef | null
  qrImagePath?: string
  ownerWhatsApp?: string
}

export function RoomBookingBridge({
  propertyName,
  rooms,
  trustCues,
  host,
  qrImagePath,
  ownerWhatsApp,
}: RoomBookingBridgeProps) {
  return (
    <>
      {/* Chapter III: Dedicated Room Catalogue */}
      <RoomCatalog 
        numeral="III — The Room Collection"
        headline="Spaces shaped by the ridge."
        subhead="Ten secluded rooms across three distinct categories. Natural wood finishes, mountain stonework, and unhurried mornings."
        rooms={rooms}
        propertyName={propertyName}
        whatsappNumber={ownerWhatsApp}
      />

      {/* Direct Booking Guarantees & Host Profile */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-background relative z-20 border-t border-border/60">
        <div className="max-w-4xl mx-auto mb-12 text-center relative z-10">
          <div className="text-xs font-sans tracking-[0.22em] text-primary font-semibold uppercase mb-3">
            Direct Reservations & Hospitality
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
            Direct with the estate.
          </h2>
          <p className="font-sans text-base text-muted-foreground font-light leading-relaxed max-w-xl mx-auto mt-3">
            Commission-free enquiries with prompt, personal assistance on WhatsApp.
          </p>
        </div>

        <TrustBar cues={trustCues} />
        
        <HostProfile host={host} />
      </section>
    </>
  )
}
