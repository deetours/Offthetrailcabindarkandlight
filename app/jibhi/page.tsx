import { jibhiConfig } from "@/lib/landing-configs"
import { SmoothScroll } from "@/components/landing-system/smooth-scroll"
import { FilmGrain } from "@/components/landing-system/film-grain"
import { ScrollHero } from "@/components/landing-system/scroll-hero"
import { StoryScene } from "@/components/landing-system/story-scene"
import { ComingSoonEngine } from "@/components/landing-system/coming-soon-engine"
import { AmenitiesBento } from "@/components/landing-system/amenities-bento"
import { LocationMap } from "@/components/landing-system/location-map"
import { Footer } from "@/components/ui/footer"

export const metadata = {
  title: `${jibhiConfig.name} | OffTheTrail`,
  description: jibhiConfig.tagline,
}

export default function JibhiPage() {
  return (
    <SmoothScroll>
      <FilmGrain />
      <main className="min-h-screen bg-ink selection:bg-brass selection:text-ink font-sans">
        <ScrollHero 
          title={jibhiConfig.name} 
          tagline={jibhiConfig.tagline} 
          imagePath={jibhiConfig.heroImage}
          eyebrow="Coming Soon"
          hideCta={true}
          chipText={jibhiConfig.chipText}
        />
        <StoryScene config={jibhiConfig} />
        <ComingSoonEngine config={jibhiConfig} />
        <AmenitiesBento config={jibhiConfig} />
        <LocationMap config={jibhiConfig} />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
