'use client'

import { useState, useEffect } from 'react'
import { Users, ShieldCheck, RefreshCcw, Search, Shield, User } from 'lucide-react'
import { GLOBAL_ROLES } from '@/lib/pms/types'

interface Profile {
  id: string
  full_name: string
  whatsapp_number: string
  role: string
  updated_at: string
  avatar_url?: string
}

const elevatedRoles = new Set(['admin', 'superadmin', 'brand_admin'])

export function UsersManager() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/profiles')
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Failed to load users')
        console.error('[UsersManager] API error:', json.error)
      } else {
        setProfiles(json.data || [])
      }
    } catch (err: any) {
      setError(err.message || 'Network error')
      console.error('[UsersManager] fetch exception:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (profile: Profile, newRole: string) => {
    if (newRole === profile.role) return

    if (
      elevatedRoles.has(newRole) &&
      !confirm(
        `Promote ${profile.full_name || 'this user'} to ${newRole}? They will gain elevated access.`,
      )
    ) {
      return
    }

    setUpdatingId(profile.id)
    try {
      const res = await fetch('/api/admin/profiles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profile.id, role: newRole }),
      })

      if (res.ok) {
        setProfiles((prev) =>
          prev.map((entry) =>
            entry.id === profile.id ? { ...entry, role: newRole } : entry,
          ),
        )
      } else {
        const json = await res.json()
        alert(`Failed to update role: ${json.error}`)
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`)
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = profiles.filter(
    (profile) =>
      !search.trim() ||
      profile.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      profile.whatsapp_number?.includes(search) ||
      profile.role?.includes(search),
  )

  const admins = profiles.filter((profile) => elevatedRoles.has(profile.role)).length

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          Access issue: {error} - check that <code>SUPABASE_SERVICE_ROLE_KEY</code> is set in <code>.env.local</code>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-400/10 bg-blue-400/5 p-6 text-center">
          <p className="font-serif text-4xl text-blue-400">{loading ? '-' : profiles.length}</p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">Total Users</p>
        </div>
        <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 text-center">
          <p className="font-serif text-4xl text-primary">{loading ? '-' : admins}</p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">Elevated Roles</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-6 text-center">
          <p className="font-serif text-4xl text-foreground">
            {loading ? '-' : profiles.length - admins}
          </p>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">Standard Users</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, WhatsApp, or role..."
            className="w-full rounded-xl border border-white/5 bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-primary/30 focus:outline-none"
          />
        </div>
        <button
          onClick={fetchProfiles}
          className="rounded-xl border border-white/5 bg-card p-3 text-muted-foreground transition-all hover:bg-white/[0.04] hover:text-foreground"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">Name</th>
                <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">WhatsApp</th>
                <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">Role</th>
                <th className="px-5 py-4 text-left text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">Updated</th>
                <th className="px-5 py-4 text-right text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center italic text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {elevatedRoles.has(profile.role) ? (
                            <Shield className="h-3.5 w-3.5" />
                          ) : (
                            <User className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <span className="text-foreground">
                          {profile.full_name || (
                            <span className="italic text-muted-foreground/40">No name</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {profile.whatsapp_number || (
                        <span className="italic opacity-30">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            elevatedRoles.has(profile.role)
                              ? 'border-primary/20 bg-primary/10 text-primary'
                              : 'border-white/5 bg-white/5 text-muted-foreground'
                          }`}
                        >
                          {elevatedRoles.has(profile.role) ? (
                            <ShieldCheck className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          {profile.role}
                        </span>
                        <select
                          value={profile.role}
                          onChange={(event) => updateRole(profile, event.target.value)}
                          disabled={updatingId === profile.id}
                          className="rounded-lg border border-white/10 bg-background px-2 py-1 text-[10px] uppercase tracking-wider text-foreground"
                        >
                          {[...GLOBAL_ROLES, 'admin'].map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {profile.updated_at
                        ? new Date(profile.updated_at).toLocaleDateString('en-IN')
                        : '-'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        disabled={updatingId === profile.id}
                        onClick={() => updateRole(profile, 'user')}
                        className="rounded-xl border border-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-all hover:bg-white/5 disabled:opacity-40"
                      >
                        {updatingId === profile.id ? '...' : 'Reset User'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
