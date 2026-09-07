// components/hooks/useFullBanner.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export interface FullBannerData {
  _id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  isActive: boolean;
  order: number;
}

export function useFullBanner() {
  return useQuery({
    queryKey: ['full-banner'],
    queryFn: async () => {
      const query = `
        *[_type == "banner" && isActive == true && placement == "full-banner"] | order(order asc) {
          _id,
          title,
          description,
          cta,
          href,
          image,
          isActive,
          order
        }
      `;
      
      const data = await client.fetch(query);
      
      if (!data || data.length === 0) {
        // Return empty array if no banner exists in Sanity
        return [];
      }
      
      return data.map((banner: any) => ({
        _id: banner._id,
        title: banner.title || 'Your Favorite Groceries in One Place',
        description: banner.description || 'Grocery shopping made simple with fresh produce, pantry staples, and fast delivery right to your door.',
        cta: banner.cta || 'Shop Now',
        href: banner.href || '/shop',
        image: urlFor(banner.image).url(),
        isActive: banner.isActive ?? true,
        order: banner.order || 0,
      })) as FullBannerData[];
    },
    staleTime: 5 * 60 * 1000,
  });
}