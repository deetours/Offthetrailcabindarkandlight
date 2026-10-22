/**
 * Privacy-friendly conversion and engagement event tracking for Off The Trail.
 * Strictly adheres to data minimization: never collects or sends PII (names, phone numbers, emails).
 */

export type AnalyticsEvent =
  | {
      action: 'booking_cta_click'
      category: 'engagement'
      label?: string
      property?: string
    }
  | {
      action: 'whatsapp_click'
      category: 'lead'
      label?: string
      context?: string
    }
  | {
      action: 'phone_click'
      category: 'lead'
      label?: string
    }
  | {
      action: 'contact_form_start'
      category: 'form'
      form_name?: string
    }
  | {
      action: 'generate_lead'
      category: 'conversion'
      lead_source: string
    }
  | {
      action: 'booking_engine_click'
      category: 'conversion'
      room_name?: string
      property?: string
    }

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return

  try {
    if (typeof (window as any).gtag === 'function') {
      const { action, ...params } = event
      ;(window as any).gtag('event', action, params)
    }
  } catch (err) {
    // Fail silently in development or when blocked by ad blockers
    console.debug('Analytics dispatch skipped:', err)
  }
}
