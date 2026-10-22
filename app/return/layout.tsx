import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Trips | Off The Trail',
  robots: { index: false, follow: false },
}

export default function ReturnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
