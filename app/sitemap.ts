// app/sitemap.ts
import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { getAllBlogs, getAllBrands, getCategories } from '@/sanity/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fundgrube.de';

  // Fetch all dynamic data from Sanity
  const [categories, brands, blogs] = await Promise.all([
    getCategories(),
    getAllBrands(),
    getAllBlogs(100), // Add the required quantity parameter
  ]);

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deal`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/angebote`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/riff-raff`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sortiment`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = categories?.map((category: any) => ({
    url: `${baseUrl}/category/${category?.slug?.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  // Brand routes
  const brandRoutes: MetadataRoute.Sitemap = brands?.map((brand: any) => ({
    url: `${baseUrl}/brand/${brand?.slug?.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || [];

  // Blog routes
  const blogRoutes: MetadataRoute.Sitemap = blogs?.map((blog: any) => ({
    url: `${baseUrl}/riff-raff/${blog?.slug?.current}`,
    lastModified: new Date(blog?._updatedAt || blog?.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  })) || [];

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...blogRoutes,
  ];
}