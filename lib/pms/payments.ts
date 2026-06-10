import crypto from 'node:crypto'

export function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name} environment variable`)
  }
  return value
}

export async function createRazorpayOrder(params: {
  amount: number
  currency?: string
  receipt: string
  notes?: Record<string, string>
}) {
  const keyId = requireEnv('RAZORPAY_KEY_ID')
  const keySecret = requireEnv('RAZORPAY_KEY_SECRET')

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: Math.round(params.amount * 100),
      currency: params.currency || 'INR',
      receipt: params.receipt,
      notes: params.notes || {},
    }),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json?.error?.description || 'Failed to create Razorpay order')
  }

  return json
}

export function verifyRazorpaySignature(params: {
  orderId: string
  paymentId: string
  signature: string
}) {
  const secret = requireEnv('RAZORPAY_KEY_SECRET')
  const payload = `${params.orderId}|${params.paymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return expectedSignature === params.signature
}

export function verifyRazorpayWebhookSignature(params: {
  rawBody: string
  signature: string
}) {
  const secret = requireEnv('RAZORPAY_WEBHOOK_SECRET')
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(params.rawBody)
    .digest('hex')

  return expectedSignature === params.signature
}
