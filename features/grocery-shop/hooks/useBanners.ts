// src/features/grocery-shop/hooks/useBanners.ts
import { useQuery } from '@tanstack/react-query';
import { client, urlFor } from '@/lib/sanity';

export interface Banner {
  _id: string;
  title: string;
  tagline?: string;
  subtitle?: string;
  description?: string;
  titleLines?: string[];
  cta: string;
  href: string;
  image: string;
  textColor?: string;
  placement: 'hero' | 'side' | 'promo' | 'weekly' | 'featured-collection' | 'full-banner' | 'countdown';
  order: number;
  isActive: boolean;
}

export function useBanners(placement?: 'hero' | 'side' | 'promo' | 'weekly' | 'featured-collection' | 'full-banner' | 'countdown') {
  const filter = placement ? `&& placement == "${placement}"` : '';
  const query = `
    *[_type == "banner" && isActive == true ${filter}] | order(order asc) {
      _id,
      title,
      tagline,
      subtitle,
      description,
      titleLine2,
      cta,
      href,
      image,
      textColor,
      placement,
      order,
      isActive
    }
  `;

  return useQuery({
    queryKey: ['banners', placement],
    queryFn: async () => {
      const data = await client.fetch(query);

      if (!data || data.length === 0) {
        return [];
      }

      const mappedData = data.map((banner: any) => {
        // Build titleLines for hero slides
        let titleLines: string[] | undefined;
        if (placement === 'hero') {
          if (banner.titleLine2) {
            titleLines = [banner.title, banner.titleLine2];
          } else {
            const words = banner.title.split(' ');
            if (words.length <= 4) {
              titleLines = [words.slice(0, -1).join(' '), words.slice(-1).join(' ')];
            } else {
              const mid = Math.ceil(words.length / 2);
              titleLines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
            }
          }
        }

        return {
          _id: banner._id,
          title: banner.title,
          tagline: banner.tagline || '',
          subtitle: banner.subtitle || '',
          description: banner.description || '',
          titleLines,
          cta: banner.cta || (placement === 'promo' ? 'Shop Now' : 'Shop now'),
          href: banner.href || '/shop',
          image: urlFor(banner.image).url(),
          textColor: banner.textColor || '#222',
          placement: banner.placement,
          order: banner.order || 0,
          isActive: banner.isActive,
        };
      });

      return mappedData as Banner[];
    },
    staleTime: 5 * 60 * 1000,
  });
}