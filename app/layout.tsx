import type React from "react"
import type { Metadata, Viewport } from "next"
import { WhatsAppPopup } from "@/components/ui/whatsapp-popup"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "OffTheTrail | Travel Slower. Stay Longer.",
  description: "A travel and stay experience designed like cinema. For travellers who value people over plans.",
  keywords: ["travel", "hostels", "trips", "India", "backpacking", "slow travel", "offthetrail", "cafe"],
  generator: 'v0.app',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('Loading chunk') || e.message && e.message.includes('ChunkLoadError')) {
                  console.warn('Stale chunk detected. Hard reloading the page...');
                  window.location.reload(true);
                }
              });
            `
          }}
        />
      </body>
    </html>
  )
}
