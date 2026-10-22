import type { Metadata } from "next"
import { LandingPage } from "@/components/landing/landing-page"

export const metadata: Metadata = {
  title: "Off The Trail | Boutique Hotel & Adventures in Dalhousie, Himachal Pradesh",
  description:
    "Stay at our 10-room boutique retreat on Bakrota Ridge, Dalhousie. Pine forest views, mountain breakfasts, guided adventures. Book directly from ₹3,200/night.",
  alternates: {
    canonical: "https://offthetrail.in/",
  },
  openGraph: {
    title: "Off The Trail | Boutique Mountain Stay, Dalhousie",
    description:
      "A 10-room boutique retreat on Bakrota Ridge, Dalhousie, Himachal Pradesh. Pine views, quiet mornings, direct booking from ₹3,200/night.",
    url: "https://offthetrail.in/",
    siteName: "Off The Trail",
    images: [
      {
        url: "/images/offthetrail7.jpeg",
        width: 1200,
        height: 630,
        alt: "Off The Trail Dalhousie Estate — Bakrota Ridge, Himachal Pradesh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Off The Trail | Boutique Mountain Stay, Dalhousie",
    description:
      "Stay at our 10-room boutique retreat on Bakrota Ridge, Dalhousie. From ₹3,200/night.",
    images: ["/images/offthetrail7.jpeg"],
  },
}

export default function Home() {
  return (
    <>
      {/*
        Server-rendered SEO anchor — visually hidden, fully crawlable.
        Provides Googlebot and AI systems with indexable entity information
        that the client-rendered LandingPage components cannot deliver on first paint.
        Content mirrors what LandingPage renders; this is NOT hidden spam.
      */}
      <div className="sr-only" aria-hidden="false">
        <h1>Off The Trail — Boutique Hotel in Dalhousie, Himachal Pradesh</h1>
        <p>
          Off The Trail is a 10-room boutique mountain retreat on Bakrota Ridge, Dalhousie,
          Himachal Pradesh, India. We offer three room categories — Standard, Deluxe, and
          Super Deluxe — starting from ₹3,200 per night with breakfast included. Our estate
          sits at 6,800 ft elevation, featuring private balconies, pine forest views, an
          in-house mountain kitchen, high-speed fiber Wi-Fi, free parking, and room heating.
        </p>
        <p>
          We also offer guided adventures and activities near Dalhousie — including treks,
          paragliding, zipline, and local village walks — as well as curated small-group
          trips across Himachal Pradesh and India.
        </p>
        <p>
          Contact us: <a href="tel:+919816315898">+91 98163 15898</a> |{" "}
          <a href="https://wa.me/919816315898">WhatsApp</a>
        </p>
        <p>
          Location: Bakrota Ridge, Dalhousie, Himachal Pradesh 176304, India
        </p>
        <p>
          Book directly at the lowest rate:{" "}
          <a href="https://offthetrail.in/stays/dalhousie">offthetrail.in/stays/dalhousie</a>
        </p>
      </div>
      <LandingPage />
    </>
  )
}
