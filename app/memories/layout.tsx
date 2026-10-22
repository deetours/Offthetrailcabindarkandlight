import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Memories | Off The Trail',
  robots: { index: false, follow: false },
}

export default function MemoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
