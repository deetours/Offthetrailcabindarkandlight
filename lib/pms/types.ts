export const GLOBAL_ROLES = [
  'user',
  'superadmin',
  'brand_admin',
  'reservations_manager',
  'property_owner',
  'property_manager',
  'housekeeping',
  'finance',
  'support',
] as const

export type Role = (typeof GLOBAL_ROLES)[number]

export const PROPERTY_SCOPED_ROLES = [
  'property_owner',
  'property_manager',
  'housekeeping',
  'finance',
  'support',
] as const

export type PropertyScopedRole = (typeof PROPERTY_SCOPED_ROLES)[number]

export const MEMBERSHIP_SCOPES = ['organization', 'property'] as const
export type MembershipScope = (typeof MEMBERSHIP_SCOPES)[number]
export const PMS_BOOKING_STATUSES = [
  'draft',
  'hold',
  'pending_payment',
  'confirmed',
  'cancelled',
  'checked_in',
  'checked_out',
  'no_show',
  'refunded',
  'expired',
] as const
export type PmsBookingStatus = (typeof PMS_BOOKING_STATUSES)[number]

export const PMS_PAYMENT_STATUSES = [
  'created',
  'authorized',
  'captured',
  'failed',
  'refunded',
  'partially_refunded',
] as const
export type PmsPaymentStatus = (typeof PMS_PAYMENT_STATUSES)[number]

export interface PropertyMembership {
  id: string
  user_id: string
  organization_id: string | null
  property_id: string | null
  role: Role
  scope: MembershipScope
  status: 'active' | 'inactive'
}

export interface PropertySummary {
  id: string
  name: string
  slug?: string | null
  region?: string | null
  city?: string | null
  state?: string | null
  status?: string | null
  cover_image_url?: string | null
  booking_count?: number
  occupancy_rate?: number
  pending_arrivals?: number
}

export interface AvailabilityRequest {
  productType: 'stay' | 'trip'
  propertyId?: string
  stayId?: string
  roomTypeId?: string
  tripId?: string
  tripDepartureId?: string
  from?: string
  to?: string
  travelers: number
}

export interface BookingQuote {
  productType: 'stay' | 'trip'
  currency: string
  subtotalAmount: number
  taxesAmount: number
  discountAmount: number
  totalAmount: number
  availableQuantity?: number
  requestedQuantity?: number
  lineItems: Array<{
    label: string
    amount: number
    quantity?: number
  }>
  inventoryStatus: 'available' | 'limited' | 'sold_out'
}

export interface OwnerDashboardSnapshot {
  property: PropertySummary
  totals: {
    activeBookings: number
    pendingArrivals: number
    occupiedRooms: number
    housekeepingPending: number
    todayRevenue: number
  }
  recentBookings: Array<{
    id: string
    guestName: string
    checkIn?: string | null
    checkOut?: string | null
    bookingStatus: PmsBookingStatus | string
    paymentStatus: PmsPaymentStatus | string
    totalAmount: number
  }>
}

export interface HousekeepingTask {
  id: string
  property_id: string
  room_id: string | null
  title: string
  status: 'pending' | 'in_progress' | 'done' | 'inspection_required'
  due_date?: string | null
  assigned_to?: string | null
}

export interface InvoiceSummary {
  id: string
  booking_id: string
  property_id: string | null
  invoice_number: string
  subtotal_amount: number
  tax_amount: number
  total_amount: number
  invoice_status: 'draft' | 'issued' | 'paid' | 'cancelled'
}
