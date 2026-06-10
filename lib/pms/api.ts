import { NextResponse } from 'next/server'

export function isMissingRelationError(error: { message?: string } | null | undefined) {
  const message = error?.message || ''
  return (
    message.includes('does not exist') ||
    message.includes('relation') ||
    message.includes('schema cache')
  )
}

export function migrationRequired(entity: string) {
  return NextResponse.json(
    {
      error: `${entity} is not available yet. Apply the multi-tenant PMS SQL foundation first.`,
      code: 'PMS_FOUNDATION_REQUIRED',
    },
    { status: 503 },
  )
}
