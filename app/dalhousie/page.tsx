import { dalhousieConfig } from "@/lib/landing-configs"
import { ScrollHero } from "@/components/landing-system/scroll-hero"
import { EstateNarrative } from "@/components/landing-system/estate-narrative"
import { BookingEngineV2 } from "@/components/landing-system/booking-engine-v2"
import { EstateFaq } from "@/components/landing-system/estate-faq"
import { Footer } from "@/components/ui/footer"

export const metadata = {
  title: `${dalhousieConfig.name} | OffTheTrail`,
  description: dalhousieConfig.tagline,
}

export default function DalhousiePage() {
  return (
    <main className="min-h-screen bg-ink selection:bg-brass selection:text-ink font-sans">
      <ScrollHero 
        title={dalhousieConfig.name} 
        tagline={dalhousieConfig.tagline} 
        imagePath={dalhousieConfig.heroImage} 
      />
      <EstateNarrative config={dalhousieConfig} />
      <BookingEngineV2 config={dalhousieConfig} />
      <EstateFaq config={dalhousieConfig} />
      <Footer />
    </main>
  )
}
