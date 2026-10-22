import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dalhousie Travel Guide — Best Time to Visit, Things to Do & Where to Stay",
  description:
    "A complete guide to Dalhousie, Himachal Pradesh. Best time to visit, top attractions, how to reach, things to do, local food, and where to stay — from the team at Off The Trail.",
  alternates: {
    canonical: "https://offthetrail.in/dalhousie-guide",
  },
  openGraph: {
    title: "Complete Dalhousie Travel Guide | Off The Trail",
    description:
      "Best time to visit, top things to do, how to reach, and where to stay in Dalhousie, Himachal Pradesh.",
    url: "https://offthetrail.in/dalhousie-guide",
    siteName: "Off The Trail",
    images: [
      {
        url: "/images/offthetrail7.jpeg",
        width: 1200,
        height: 630,
        alt: "Dalhousie, Himachal Pradesh — Colonial mountain town in the Himalayas",
      },
    ],
    locale: "en_IN",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete Dalhousie Travel Guide | Off The Trail",
    description:
      "Best time to visit, top things to do, how to reach, and where to stay in Dalhousie.",
    images: ["/images/offthetrail7.jpeg"],
  },
}

// TouristDestination + Article structured data
const destinationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://offthetrail.in/dalhousie-guide#article",
  headline: "Dalhousie Travel Guide — Everything You Need to Know",
  description:
    "A complete guide to Dalhousie, Himachal Pradesh — best time to visit, top attractions, how to reach, things to do, where to stay, and local food.",
  image: "https://offthetrail.in/images/offthetrail7.jpeg",
  url: "https://offthetrail.in/dalhousie-guide",
  publisher: {
    "@type": "Organization",
    "@id": "https://offthetrail.in/#organization",
    name: "Off The Trail",
  },
  about: {
    "@type": "TouristDestination",
    name: "Dalhousie",
    description:
      "Dalhousie is a hill station in Chamba district, Himachal Pradesh, India, situated in the western Himalayas at an altitude of 6,700–9,000 ft. Known for its colonial-era architecture, pine and deodar forests, Himalayan views, and proximity to Khajjiar.",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.5388,
      longitude: 75.9651,
    },
    touristType: [
      "Nature Lovers",
      "Couples",
      "Families",
      "Solo Travellers",
      "Remote Workers",
    ],
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://offthetrail.in/" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Dalhousie Guide",
      item: "https://offthetrail.in/dalhousie-guide",
    },
  ],
}

export default function DalhousieGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="grain min-h-screen bg-background">
        {/* Hero */}
        <section className="relative bg-background pt-24 pb-16 px-6 md:px-12 lg:px-24 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <p className="text-[11px] font-sans uppercase tracking-[0.18em] text-primary font-semibold mb-4">
              Dalhousie · Himachal Pradesh · India
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground font-bold tracking-tight leading-tight mb-6">
              The Complete Dalhousie Travel Guide
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
              Dalhousie is one of Himachal Pradesh&apos;s most rewarding hill stations — quiet enough
              to hear the wind in the deodar pines, grand enough to remind you how small the world
              is. This is our honest guide, written from the ridge.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 py-16 space-y-20">

          {/* About Dalhousie */}
          <section id="about">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-6">
              What is Dalhousie?
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Dalhousie is a colonial-era hill station in Chamba district, Himachal Pradesh,
                situated in the western Himalayas at altitudes ranging from 6,700 to 9,000 feet
                (roughly 2,040–2,745 metres). It was established by the British in 1854 as a
                summer retreat and named after the then Governor-General, Lord Dalhousie.
              </p>
              <p>
                The town spreads across five hills — Kathalagh, Potreyn, Terah, Bakrota, and
                Bhangora — each covered with oak, rhododendron, pine, and deodar cedar forests.
                On clear days, the snow-capped Pir Panjal and Dhauladhar ranges frame the horizon
                in every direction.
              </p>
              <p>
                Unlike Shimla or Manali, Dalhousie has largely resisted mass tourism. The town
                retains its original character — colonial-era churches, stone buildings, narrow
                winding paths, and a pace of life that rewards slow exploration.
              </p>
            </div>
          </section>

          {/* Best Time to Visit */}
          <section id="best-time">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-6">
              Best Time to Visit Dalhousie
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-6 font-sans font-semibold text-foreground">Season</th>
                    <th className="text-left py-3 pr-6 font-sans font-semibold text-foreground">Months</th>
                    <th className="text-left py-3 pr-6 font-sans font-semibold text-foreground">Temperature</th>
                    <th className="text-left py-3 font-sans font-semibold text-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-6 font-medium text-foreground">Summer</td>
                    <td className="py-3 pr-6">April – June</td>
                    <td className="py-3 pr-6">8°C – 25°C</td>
                    <td className="py-3">
                      Peak season. Pleasant days, cool evenings. Great for hiking and sightseeing.
                      Book well in advance.
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-6 font-medium text-foreground">Monsoon</td>
                    <td className="py-3 pr-6">July – September</td>
                    <td className="py-3 pr-6">15°C – 22°C</td>
                    <td className="py-3">
                      Heavy rainfall. Lush green landscapes. Some roads may be affected.
                      Quieter, fewer tourists.
                    </td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 pr-6 font-medium text-foreground">Autumn</td>
                    <td className="py-3 pr-6">October – November</td>
                    <td className="py-3 pr-6">5°C – 18°C</td>
                    <td className="py-3">
                      Clear skies, golden foliage, stunning Himalayan views. Ideal for photography
                      and peaceful stays. Our favourite time.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-6 font-medium text-foreground">Winter</td>
                    <td className="py-3 pr-6">December – March</td>
                    <td className="py-3 pr-6">-4°C – 10°C</td>
                    <td className="py-3">
                      Snow possible (especially January–February). Magical but cold. Ideal for
                      those seeking complete solitude and snowfall.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Our recommendation:</strong> October–November
              for clear skies and Himalayan views, or April–June for pleasant weather and full
              activity options.
            </p>
          </section>

          {/* How to Reach */}
          <section id="how-to-reach">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-6">
              How to Reach Dalhousie
            </h2>
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-sans font-semibold text-foreground text-lg mb-2">By Train</h3>
                <p>
                  <strong className="text-foreground">Pathankot Junction (PTK)</strong> is the
                  nearest broad-gauge railway station, approximately 82 km from Dalhousie. Multiple
                  trains connect Pathankot from Delhi (Jammu Mail, Himgiri Express), Amritsar, and
                  Chandigarh. From Pathankot, hire a taxi or take an HRTC bus to Dalhousie — the
                  scenic mountain drive takes 2.5 to 3 hours.
                </p>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-foreground text-lg mb-2">By Air</h3>
                <p>
                  <strong className="text-foreground">Gaggal Airport, Dharamshala (DHM)</strong>{" "}
                  is the nearest airport, approximately 105 km from Dalhousie (3.5–4 hour drive
                  through mountain roads). It receives regular flights from Delhi (Air India,
                  IndiGo). Alternatively, fly to Amritsar (Sri Guru Ram Dass Jee Airport, ATQ),
                  which is 190 km away with good road connectivity.
                </p>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-foreground text-lg mb-2">By Road</h3>
                <p>
                  Dalhousie is well-connected by road from Delhi (~570 km, 12–13 hours), Chandigarh
                  (~340 km, 7–8 hours), and Amritsar (~220 km, 5 hours). HRTC operates daily bus
                  services from Delhi (Kashmiri Gate ISBT) and Chandigarh. Private taxis and
                  self-drive are also popular options — the NH44 route via Pathankot is the most
                  straightforward.
                </p>
                <p className="mt-2">
                  <strong className="text-foreground">Driving tip:</strong> If driving to Off The
                  Trail Dalhousie Estate specifically, our property on Bakrota Ridge is accessible
                  via a direct paved road — no uphill trekking required, with private parking on site.
                </p>
              </div>
            </div>
          </section>

          {/* Top Attractions */}
          <section id="attractions">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-6">
              Top Places to Visit in &amp; Around Dalhousie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Khajjiar",
                  distance: "~22 km from Dalhousie",
                  desc: "Known as the \"Mini Switzerland of India,\" Khajjiar is a flat green meadow at 6,500 ft surrounded by dense deodar forest. The Khajji Nag temple sits at its centre. Worth half a day.",
                },
                {
                  name: "Dainkund Peak",
                  distance: "~14 km",
                  desc: "The highest peak in the Dalhousie range at 9,000 ft. A moderate 2 km trek from Bakrota Ridge leads to panoramic 360° Himalayan views — best at sunrise.",
                },
                {
                  name: "Panjpulla",
                  distance: "~3 km",
                  desc: "A small waterfall and picnic spot surrounded by cedars. Significant as the memorial site of freedom fighter Sardar Ajit Singh. Peaceful, uncrowded morning walk.",
                },
                {
                  name: "Kalatop Wildlife Sanctuary",
                  distance: "~9 km",
                  desc: "A 30 sq km forest reserve home to leopards, black bears, and hundreds of bird species. Guided nature walks into the deodar forest — contact the forest department in advance.",
                },
                {
                  name: "Chamera Lake",
                  distance: "~30 km",
                  desc: "A large reservoir formed by the Chamera Dam on the Ravi River. Boating and birdwatching are the main draws. The drive through the valley is scenic.",
                },
                {
                  name: "Subhash Baoli",
                  distance: "~3 km",
                  desc: "A natural spring where Netaji Subhash Chandra Bose reportedly meditated during his stay in Dalhousie. Quiet spot with mountain views, near Gandhi Chowk.",
                },
              ].map((place) => (
                <div
                  key={place.name}
                  className="border border-border rounded-lg p-5 bg-card/40"
                >
                  <h3 className="font-serif text-xl text-foreground font-semibold mb-1">
                    {place.name}
                  </h3>
                  <p className="text-xs text-primary font-mono uppercase tracking-widest mb-3">
                    {place.distance}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{place.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Things to Do */}
          <section id="things-to-do">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-6">
              Things to Do in Dalhousie
            </h2>
            <ul className="space-y-4 text-muted-foreground leading-relaxed">
              {[
                "Trek the Bakrota Hills Loop (8 km, easy-moderate, stunning pine forest paths)",
                "Paragliding at Bir Billing (~100 km), one of the world's top paragliding sites",
                "Zipline over the Ravi River valley",
                "Photography walks through the old colonial architecture near Gandhi Chowk",
                "Bird watching in Kalatop Wildlife Sanctuary (over 200 recorded species)",
                "Sunrise at Dainkund Peak with 360° Himalayan views",
                "Explore Chamba town and the ancient Lakshmi Narayan temples (~56 km)",
                "Evening bonfires on the ridge terrace at Off The Trail Estate",
                "Local market browsing for Himachali handicrafts, woolens, and pickles",
                "Attend a Gaddi tribal cultural program (seasonal — ask our team to arrange)",
              ].map((activity) => (
                <li key={activity} className="flex gap-3">
                  <span className="text-primary mt-1 shrink-0">→</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Where to Stay */}
          <section id="where-to-stay">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-4">
              Where to Stay in Dalhousie
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Most hotels in Dalhousie are clustered around Gandhi Chowk and Subhash Chowk.
              For a quieter, more private experience away from the crowds, the Bakrota Ridge area
              offers significantly better mountain views and less traffic noise.
            </p>
            <div className="border border-primary/30 rounded-xl p-6 bg-card/60">
              <p className="text-[11px] font-mono uppercase tracking-widest text-primary mb-2">
                Our Property
              </p>
              <h3 className="font-serif text-2xl text-foreground font-bold mb-3">
                Off The Trail Dalhousie Estate
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                A 10-room boutique retreat on Bakrota Ridge, 3.5 km from Dalhousie town centre.
                Stone architecture at 6,800 ft, private balconies facing the pine forest valley,
                and breakfast included every morning. Three room categories from ₹3,200/night.
                Drive-in access with private parking.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/stays/dalhousie"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  View Rooms & Check Availability →
                </Link>
                <a
                  href="https://wa.me/919816315898?text=Hi%2C%20I%20saw%20your%20Dalhousie%20guide%20and%20would%20like%20to%20enquire%20about%20a%20stay."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:border-primary transition-colors"
                >
                  WhatsApp Enquiry
                </a>
              </div>
            </div>
          </section>

          {/* Local Food */}
          <section id="food">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-6">
              What to Eat in Dalhousie
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Himachali cuisine is understated, warming, and deeply local. At Off The Trail, our
              kitchen prepares home-style Himachali and North Indian meals to order. When exploring
              the town, look for these:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              {[
                "Dham — the traditional Himachali festive meal of rice, dal, rajma, and curd, served on leaf plates",
                "Madra — a slow-cooked chickpea or rajma curry in yoghurt and spices, the defining Chamba dish",
                "Siddu — a steamed wheat bread stuffed with poppy seeds or walnuts; served with ghee and dal",
                "Trout from Chamba — fresh mountain river trout, available at select restaurants",
                "Aktori — a buckwheat pancake, typically made during local festivals",
                "Kangra tea from nearby — fragrant first-flush Himalayan tea",
              ].map((food) => (
                <li key={food} className="flex gap-3">
                  <span className="text-primary mt-1 shrink-0">→</span>
                  <span>{food}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Travel Tips */}
          <section id="tips">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-bold mb-6">
              Travel Tips for Dalhousie
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-1">Altitude</h3>
                <p>
                  Dalhousie sits between 6,700 and 9,000 ft. Most visitors from the plains acclimatise
                  within a day. Drink plenty of water and take it slow on the first day.
                </p>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-1">Connectivity</h3>
                <p>
                  BSNL and Jio have the most reliable coverage in Dalhousie. Other networks can be
                  patchy on forest trails. Off The Trail Estate has dedicated fiber Wi-Fi.
                </p>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-1">Packing</h3>
                <p>
                  Bring warm layers regardless of the season — evenings and early mornings are cold
                  year-round. Good walking shoes are essential for the hill paths.
                </p>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-foreground mb-1">Cash</h3>
                <p>
                  Carry enough cash for smaller establishments and local markets. ATMs are available
                  near Gandhi Chowk, though not always reliable.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-border pt-12 text-center">
            <p className="font-serif text-2xl text-foreground mb-4">
              Ready to experience Dalhousie from the ridge?
            </p>
            <p className="text-muted-foreground mb-8">
              Off The Trail Dalhousie Estate — 10 rooms, Bakrota Ridge, from ₹3,200/night.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/stays/dalhousie"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Check Availability →
              </Link>
              <a
                href="https://wa.me/919816315898?text=Hi%2C%20I%20read%20your%20Dalhousie%20guide%20and%20would%20like%20to%20book%20a%20stay."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border text-foreground px-7 py-3 rounded-full font-semibold hover:border-primary transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="py-10 px-6 bg-background border-t border-border text-center">
          <div className="font-serif text-xl text-foreground font-bold tracking-tight mb-2">OffTheTrail</div>
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">
            © {new Date().getFullYear()} Off The Trail. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  )
}
