'use client'

import { useEffect, useState } from 'react'
import { Building2, BedDouble, CalendarRange, CreditCard, Shield, Sparkles } from 'lucide-react'

interface PropertyCard {
  id: string
  name: string
  region?: string | null
  city?: string | null
  status?: string | null
  cover_image_url?: string | null
  source?: string
}

export function PmsControlCenter() {
  const [properties, setProperties] = useState<PropertyCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [migrationPending, setMigrationPending] = useState(false)

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/pms/properties', { cache: 'no-store' })
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load PMS properties')
        }

        setProperties(result.data || [])
        setMigrationPending(Boolean(result.migrationPending))
      } catch (err: any) {
        setError(err?.message || 'Failed to load PMS data')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Properties', value: loading ? '...' : `${properties.length}`, icon: Building2 },
          { label: 'Room Ops', value: 'Live', icon: BedDouble },
          { label: 'Arrivals', value: 'PMS', icon: CalendarRange },
          { label: 'Payments', value: 'Razorpay', icon: CreditCard },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="rounded-2xl border border-white/5 bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">
                  {item.label}
                </span>
                <Icon className="h-4 w-4 text-primary/60" />
              </div>
              <p className="font-serif text-3xl text-foreground">{item.value}</p>
            </div>
          )
        })}
      </div>

      {migrationPending && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
          PMS foundation APIs are live, but the new multi-tenant SQL has not been applied yet. You are currently seeing
          fallback property cards from the legacy <code>stays</code> table.
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 md:col-span-2">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Multi-Owner PMS Foundation</span>
          </div>
          <h3 className="font-serif text-2xl text-foreground">Property-led operations are now first-class</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            This dashboard is now wired for tenant-aware properties, room operations, arrivals, payments, owner access,
            housekeeping, and future OTA-ready inventory sync. Apply the new SQL script, then start creating properties,
            room types, memberships, and rates through the new PMS APIs.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Shield className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Access Model</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>`superadmin` and `brand_admin` can see every property.</li>
            <li>`property_owner` and `property_manager` are property-scoped.</li>
            <li>`housekeeping`, `finance`, and `support` can be granted targeted access.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">Managed Properties</p>
            <h3 className="font-serif text-2xl text-foreground">Owner-ready inventory surfaces</h3>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/5 bg-card p-10 text-center text-muted-foreground">
            Loading property surfaces...
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-card p-10 text-center text-muted-foreground">
            No properties yet. Apply the PMS SQL and seed your first Northeast stay property to begin.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <div key={property.id} className="overflow-hidden rounded-2xl border border-white/5 bg-card">
                <div
                  className="h-36 bg-cover bg-center"
                  style={{
                    backgroundImage: property.cover_image_url
                      ? `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.45)), url('${property.cover_image_url}')`
                      : 'linear-gradient(135deg, rgba(205,154,73,0.22), rgba(19,19,19,0.9))',
                  }}
                />
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-serif text-xl text-foreground">{property.name}</h4>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {property.status || 'draft'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[property.city, property.region].filter(Boolean).join(' · ') || 'Northeast India'}
                  </p>
                  {property.source === 'stays_fallback' && (
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-300/80">
                      Legacy stay fallback
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
