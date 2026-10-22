import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Your Stay | Off The Trail',
  robots: { index: false, follow: false },
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
