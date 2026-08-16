import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check for admin role (check both profiles and users for safety)
        let role = 'user'
        const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

        if (profileData?.role) {
            role = profileData.role
        } else {
            const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single()
            if (userData?.role) role = userData.role
        }

        if (role !== 'admin') {
            return NextResponse.redirect(new URL('/return', request.url))
        }
    }

    // Protect /memories and /return routes
    if (request.nextUrl.pathname.startsWith('/memories') || request.nextUrl.pathname.startsWith('/return')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Subdomain routing
    const hostname = request.headers.get('host') || ''
    
    // Support testing on localhost as well as production
    const isDalhousie = hostname === 'dalhousie.offthetrail.in' || hostname.startsWith('dalhousie.localhost')
    const isJibhi = hostname === 'jibhi.offthetrail.in' || hostname.startsWith('jibhi.localhost')

    // If it's a subdomain, rewrite to the specific folder
    if (isDalhousie && !request.nextUrl.pathname.startsWith('/dalhousie')) {
        const url = request.nextUrl.clone()
        url.pathname = `/dalhousie${request.nextUrl.pathname}`
        return NextResponse.rewrite(url)
    }

    if (isJibhi && !request.nextUrl.pathname.startsWith('/jibhi')) {
        const url = request.nextUrl.clone()
        url.pathname = `/jibhi${request.nextUrl.pathname}`
        return NextResponse.rewrite(url)
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
