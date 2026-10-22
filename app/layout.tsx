import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Inter, Playfair_Display } from "next/font/google"
import { WhatsAppPopup } from "@/components/ui/whatsapp-popup"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://offthetrail.in"),
  title: {
    default: "Off The Trail | Boutique Hotel & Adventures in Dalhousie, Himachal Pradesh",
    template: "%s | Off The Trail",
  },
  description:
    "Off The Trail curates boutique mountain stays, guided adventures, and travel experiences in Dalhousie, Himachal Pradesh, India. Book directly from ₹3,200/night.",
  keywords: [
    "boutique hotel Dalhousie",
    "Off The Trail",
    "mountain retreat Himachal Pradesh",
    "Dalhousie estate stay",
    "Bakrota Ridge hotel",
    "boutique accommodation India",
    "slow travel Himachal",
    "guided adventures Dalhousie",
    "workation Dalhousie",
  ],
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/apple-icon.png",
  },
  other: {
    "facebook-domain-verification": "ojaft9vfdvjcblk3qlhzco27bjt45z",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E11" },
  ],
  width: "device-width",
  initialScale: 1,
}

// Organization + WebSite JSON-LD — sitewide entity identity for AI and search systems
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://offthetrail.in/#organization",
      name: "Off The Trail",
      url: "https://offthetrail.in",
      logo: {
        "@type": "ImageObject",
        url: "https://offthetrail.in/images/favicon.png",
        width: 512,
        height: 512,
      },
      description:
        "Off The Trail curates boutique mountain stays, guided adventures, and travel experiences in Dalhousie, Himachal Pradesh, India.",
      telephone: "+919816315898",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bakrota Ridge",
        addressLocality: "Dalhousie",
        addressRegion: "Himachal Pradesh",
        postalCode: "176304",
        addressCountry: "IN",
      },
      sameAs: ["https://www.instagram.com/offthetrail.in/"],
    },
    {
      "@type": "WebSite",
      "@id": "https://offthetrail.in/#website",
      name: "Off The Trail",
      url: "https://offthetrail.in",
      publisher: { "@id": "https://offthetrail.in/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://offthetrail.in/stays?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable}`}
      style={
        {
          "--font-inter": '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
          "--font-playfair": 'Georgia, "Times New Roman", serif',
        } as React.CSSProperties
      }
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <WhatsAppPopup />
        </ThemeProvider>

        {/* Organization + WebSite structured data — sitewide entity signal */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

        {/* Google Analytics 4 — only loads when NEXT_PUBLIC_GA_MEASUREMENT_ID is provided */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Stale chunk recovery for long-lived deployments */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('Loading chunk') || e.message && e.message.includes('ChunkLoadError')) {
                  console.warn('Stale chunk detected. Hard reloading the page...');
                  window.location.reload(true);
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
