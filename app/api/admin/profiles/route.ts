import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdminAccess } from '@/lib/supabase/admin'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!key) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY environment variable - this is required for admin operations',
    )
  }

  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET() {
  try {
    await requireAdminAccess()

    const serviceClient = getServiceClient()
    const { data, error } = await serviceClient
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error(`[API/admin/profiles] GET error: ${error.message}`)
      return NextResponse.json(
        { error: error.message || 'Failed to fetch profiles' },
        { status: 500 },
      )
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    const status = error?.status ?? 500
    console.error('[API/admin/profiles] GET exception:', error?.message || error)

    return NextResponse.json(
      { error: error?.message || 'Failed to process request' },
      { status },
    )
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdminAccess()

    const { id, role } = await request.json()
    if (!id || !role) {
      return NextResponse.json({ error: 'Missing id or role' }, { status: 400 })
    }

    const updatedAt = new Date().toISOString()
    const serviceClient = getServiceClient()

    const [profileUpdate, userUpdate] = await Promise.all([
      serviceClient
        .from('profiles')
        .update({ role, updated_at: updatedAt })
        .eq('id', id),
      serviceClient
        .from('users')
        .update({ role, updated_at: updatedAt })
        .eq('id', id),
    ])

    if (profileUpdate.error) {
      return NextResponse.json(
        { error: profileUpdate.error.message },
        { status: 500 },
      )
    }

    if (userUpdate.error) {
      console.warn('[API/admin/profiles] users sync warning:', userUpdate.error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    const status = error?.status ?? 500
    return NextResponse.json(
      { error: error?.message || 'Failed to process request' },
      { status },
    )
  }
}
