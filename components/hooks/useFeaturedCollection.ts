// src/features/grocery-shop/hooks/useFeaturedCollection.ts
import { useQuery } from '@tanstack/react-query';
import { client, urlFor } from '@/lib/sanity';
import { getProducts } from '@/services/productService';
import type { Product } from '@/types/product';

export interface FeaturedCollectionData {
  banner: {
    title: string;
    subtitle: string;
    cta: string;
    href: string;
    image: string;
  };
  products: Product[];
  title: string;
  viewAllLink: string;
}

export function useFeaturedCollection(limit: number = 8) {
  return useQuery({
    queryKey: ['featured-collection', limit],
    queryFn: async () => {
      // 1. Fetch the banner data from Sanity
      const bannerQuery = `
        *[_type == "banner" && isActive == true && placement == "featured-collection"] | order(order asc)[0] {
          _id,
          title,
          subtitle,
          cta,
          href,
          image
        }
      `;
      
      const bannerData = await client.fetch(bannerQuery);
      
      // 2. Fetch featured products
      const productsData = await getProducts({ 
        limit, 
        sort: 'best-selling' 
      });
      
      // 3. Build the banner object
      const banner = bannerData ? {
        title: bannerData.title || 'Fresh Fruits',
        subtitle: bannerData.subtitle || 'NEW COLLECTION',
        cta: bannerData.cta || 'SHOP NOW',
        href: bannerData.href || '/shop',
        image: urlFor(bannerData.image).url(),
      } : {
        title: 'Fresh Fruits',
        subtitle: 'NEW COLLECTION',
        cta: 'SHOP NOW',
        href: '/shop',
        image: '/grocery-shop/banner/banner4.webp',
      };
      
      return {
        banner,
        products: productsData.products || [],
        title: 'Featured Collection',
        viewAllLink: '/shop',
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}