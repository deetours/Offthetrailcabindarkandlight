import type { LandingPageConfig } from "@/lib/landing-configs"

interface EstateNarrativeProps {
  config: LandingPageConfig
}

export function EstateNarrative({ config }: EstateNarrativeProps) {
  return (
    <section className="bg-ink text-parchment py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="font-serif text-3xl md:text-5xl text-parchment">
          A place built for the quiet.
        </h2>
        
        <div className="font-sans text-lg md:text-xl text-moss font-light space-y-6">
          {config.narrative.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
