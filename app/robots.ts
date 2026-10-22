import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/login',
          '/booking/',
          '/confirmed',
          '/payment',
          '/memories',
          '/return',
          '/auth/',
        ],
      },
      // Allow AI search crawlers explicitly (separate from training bots)
      {
        userAgent: 'OAI-SearchBot', // ChatGPT search discovery
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/login',
          '/booking/',
          '/confirmed',
          '/payment',
          '/memories',
          '/return',
          '/auth/',
        ],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/login',
          '/booking/',
          '/confirmed',
          '/payment',
          '/memories',
          '/return',
          '/auth/',
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI training — allowed; owner can disallow if preferred
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/login',
          '/booking/',
          '/confirmed',
          '/payment',
          '/memories',
          '/return',
          '/auth/',
        ],
      },
    ],
    sitemap: 'https://offthetrail.in/sitemap.xml',
    host: 'https://offthetrail.in',
  }
}
