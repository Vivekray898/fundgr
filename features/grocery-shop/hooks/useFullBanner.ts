// src/features/grocery-shop/hooks/useFullBanner.ts
import { useQuery } from '@tanstack/react-query';
import { client, urlFor } from '@/lib/sanity';

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
        *[_type == "banner" && isActive == true && placement == "full-banner"] | order(order asc)[0] {
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
      
      if (!data) {
        // Return default/fallback data if no banner exists in Sanity
        return {
          _id: 'default',
          title: 'Your Favorite Groceries\nin One Place',
          description: 'Grocery shopping made simple with fresh produce, pantry staples, and fast delivery right to your door.',
          cta: 'Shop Now',
          href: '/grocery/shop',
          image: '/grocery-shop/full-width-banner/full-width-banner1.webp',
          isActive: true,
          order: 0,
        } as FullBannerData;
      }
      
      return {
        _id: data._id,
        title: data.title || 'Your Favorite Groceries\nin One Place',
        description: data.description || 'Grocery shopping made simple with fresh produce, pantry staples, and fast delivery right to your door.',
        cta: data.cta || 'Shop Now',
        href: data.href || '/grocery/shop',
        image: urlFor(data.image).url(),
        isActive: data.isActive ?? true,
        order: data.order || 0,
      } as FullBannerData;
    },
    staleTime: 5 * 60 * 1000,
  });
}