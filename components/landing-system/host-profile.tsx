"use client"

import Image from "next/image"

export interface HostProfileDef {
  name: string
  photoUrl: string
  bio: string
}

interface HostProfileProps {
  host: HostProfileDef | null
}

export function HostProfile({ host }: HostProfileProps) {
  if (!host) return null

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 mb-8">
      <div className="bg-card border border-border p-6 md:p-8 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="relative w-24 h-24 shrink-0 rounded-full overflow-hidden border border-border shadow-lg">
          <Image 
            src={host.photoUrl} 
            alt={host.name} 
            fill 
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-serif text-2xl text-foreground mb-1">Meet your host, {host.name}.</h3>
          <div className="w-8 h-[1px] bg-primary mx-auto sm:mx-0 mb-4 opacity-50" />
          <p className="text-muted-foreground font-light text-sm md:text-base leading-relaxed">
            {host.bio}
          </p>
        </div>
      </div>
    </div>
  )
}
