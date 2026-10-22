const supabaseHostname = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://mgsewojshipghesfqmmo.supabase.co"
    ).hostname
  } catch {
    return "mgsewojshipghesfqmmo.supabase.co"
  }
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/login',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/return',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/admin',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/journeys',
        destination: '/activities',
        permanent: true,
      },
      {
        source: '/journeys/:slug',
        destination: '/activities/:slug',
        permanent: true,
      },
      {
        source: '/all-trips',
        destination: '/trips',
        permanent: true,
      },
      // Resolve duplicate canonical: /stays/dalhousie-estate → /stays/dalhousie (canonical URL)
      {
        source: '/stays/dalhousie-estate',
        destination: '/stays/dalhousie',
        permanent: true,
      },
      {
        source: '/stays/dalhousie-estate/:path*',
        destination: '/stays/dalhousie/:path*',
        permanent: true,
      },
    ]
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
}

export default nextConfig
