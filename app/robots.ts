// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fundgrube.de';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/studio/',
        '/cart',
        '/orders',
        '/wishlist',
        '/search?*',
        '/success',
        '/404',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}