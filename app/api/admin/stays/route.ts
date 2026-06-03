import { NextResponse } from 'next/server'
import { getSupabaseServiceClient, requireAdminAccess } from '@/lib/supabase/admin'

export async function GET() {
  const access = await requireAdminAccess()
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  try {
    const serviceClient = getSupabaseServiceClient()
    const { data, error } = await serviceClient
      .from('stays')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch stays' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const access = await requireAdminAccess()
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  try {
    const payload = await request.json()
    const serviceClient = getSupabaseServiceClient()
    const { data, error } = await serviceClient
      .from('stays')
      .insert([payload])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create stay' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const access = await requireAdminAccess()
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  try {
    const { id, ...payload } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'Missing stay id' }, { status: 400 })
    }

    const serviceClient = getSupabaseServiceClient()
    const { data, error } = await serviceClient
      .from('stays')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update stay' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const access = await requireAdminAccess()
  if ('error' in access) {
    return NextResponse.json({ error: access.error }, { status: access.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing stay id' }, { status: 400 })
    }

    const serviceClient = getSupabaseServiceClient()
    const { error } = await serviceClient.from('stays').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete stay' }, { status: 500 })
  }
}
