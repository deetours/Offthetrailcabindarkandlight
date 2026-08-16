import { DalhousieHero } from "@/components/dalhousie/dalhousie-hero"
import { EstateNarrative } from "@/components/dalhousie/estate-narrative"
import { BookingEngine } from "@/components/dalhousie/booking-engine"
import { EstateFaq } from "@/components/dalhousie/estate-faq"
import { Footer } from "@/components/ui/footer"

export const metadata = {
  title: "Dalhousie Estate | OffTheTrail",
  description: "Trade the noise for silence. Pine air, colonial stone, and slow mornings on the ridge.",
}

export default function DalhousiePage() {
  return (
    <main className="min-h-screen bg-ink selection:bg-brass selection:text-ink">
      <DalhousieHero />
      <EstateNarrative />
      <BookingEngine />
      <EstateFaq />
      <Footer />
    </main>
  )
}
