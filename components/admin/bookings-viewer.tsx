'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

export function BookingsViewer() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/bookings', { cache: 'no-store' })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load bookings')
      }

      setBookings(result.data || [])
    } catch (err: any) {
      console.error('Bookings fetch exception:', err)
      setBookings([])
      setError(err?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-muted-foreground">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-muted-foreground">No bookings yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-muted-foreground/10">
                <th className="text-left py-2 px-4 font-semibold text-foreground">User</th>
                <th className="text-left py-2 px-4 font-semibold text-foreground">Experience</th>
                <th className="text-left py-2 px-4 font-semibold text-foreground">Type</th>
                <th className="text-left py-2 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-2 px-4 font-semibold text-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-muted-foreground/5 hover:bg-foreground/5 transition-colors">
                  <td className="py-3 px-4 text-foreground">{booking.whatsapp_phone || 'N/A'}</td>
                  <td className="py-3 px-4 text-foreground">
                    {booking.trips?.name || booking.stays?.name || 'Unknown'}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {booking.trip_id ? 'Trip' : 'Stay'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <span className="capitalize text-muted-foreground">{booking.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
