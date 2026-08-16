import { dalhousieConfig } from "@/lib/landing-configs"
import { SmoothScroll } from "@/components/landing-system/smooth-scroll"
import { FilmGrain } from "@/components/landing-system/film-grain"
import { ScrollHero } from "@/components/landing-system/scroll-hero"
import { StoryScene } from "@/components/landing-system/story-scene"
import { BookingEngineV2 } from "@/components/landing-system/booking-engine-v2"
import { AmenitiesBento } from "@/components/landing-system/amenities-bento"
import { LocationMap } from "@/components/landing-system/location-map"
import { EstateFaq } from "@/components/landing-system/estate-faq"
import { Footer } from "@/components/ui/footer"

export const metadata = {
  title: `${dalhousieConfig.name} | OffTheTrail`,
  description: dalhousieConfig.tagline,
}

export default function DalhousiePage() {
  return (
    <SmoothScroll>
      <FilmGrain />
      <main className="min-h-screen bg-ink selection:bg-brass selection:text-ink font-sans">
        <ScrollHero 
          title={dalhousieConfig.name} 
          tagline={dalhousieConfig.tagline} 
          imagePath={dalhousieConfig.heroImage}
          chipText={dalhousieConfig.chipText} 
        />
        <StoryScene config={dalhousieConfig} />
        <BookingEngineV2 config={dalhousieConfig} />
        <AmenitiesBento config={dalhousieConfig} />
        <LocationMap config={dalhousieConfig} />
        <EstateFaq config={dalhousieConfig} />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
