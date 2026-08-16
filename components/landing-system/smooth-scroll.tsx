"use client"

import { ReactLenis } from '@studio-freight/react-lenis'
import { ReactNode } from 'react'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
      {/* @ts-expect-error: React 19 type mismatch with older lenis types */}
      {children}
    </ReactLenis>
  )
}
