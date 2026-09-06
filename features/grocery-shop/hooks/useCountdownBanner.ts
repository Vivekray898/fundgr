// src/features/grocery-shop/hooks/useCountdownBanner.ts
import { useQuery } from '@tanstack/react-query';
import { client, urlFor } from '@/lib/sanity';

export interface CountdownBannerData {
  _id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  thumbnails: string[];
  countdownEnd: string | null;
  backgroundColor: string;
  isActive: boolean;
  order: number;
}

export function useCountdownBanner() {
  const query = `
    *[_type == "banner" && isActive == true && placement == "countdown"] | order(order asc)[0] {
      _id,
      title,
      subtitle,
      cta,
      href,
      image,
      images,
      countdownEnd,
      backgroundColor,
      isActive,
      order
    }
  `;

  console.log('📝 Countdown Banner Query:', query);

  return useQuery({
    queryKey: ['countdown-banner'],
    queryFn: async () => {
      console.log('⏳ Fetching countdown banner from Sanity...');
      const data = await client.fetch(query);
      console.log('📦 Raw data from Sanity:', data);
      
      if (!data) {
        console.warn('⚠️ No countdown banner found in Sanity');
        // Return null to show nothing (will fallback to null check)
        return null;
      }
      
      // Map thumbnails from images array or fallback
      const thumbnails = data.images?.map((img: any) => urlFor(img).url()) || [];
      
      const mappedData = {
        _id: data._id,
        title: data.title || 'Special Weekend Deal',
        subtitle: data.subtitle || 'Save an Extra 20%!',
        cta: data.cta || 'Shop Now',
        href: data.href || '/shop',
        image: data.image ? urlFor(data.image).url() : '/grocery-shop/products/products10.webp',
        thumbnails: thumbnails.length > 0 ? thumbnails : [
          '/grocery-shop/products/products10.webp',
          '/grocery-shop/products/products6.webp',
          '/grocery-shop/products/products12.webp',
        ],
        countdownEnd: data.countdownEnd || '2026-12-31T23:59:59',
        backgroundColor: data.backgroundColor || '#fff3e6',
        isActive: data.isActive ?? true,
        order: data.order || 0,
      };
      
      console.log('✅ Mapped data:', mappedData);
      return mappedData as CountdownBannerData;
    },
    staleTime: 5 * 60 * 1000,
  });
}