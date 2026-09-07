// components/HomePage/HeroBannerSlider.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useBanners } from '@/components/hooks/useBanners';

export interface HeroSlide {
  id: string;
  image: string;
  imageMobile?: string;
  badgeLabel?: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  price?: string;
  originalPrice?: string;
  ctaText: string;
  ctaHref: string;
}

interface HeroBannerSliderProps {
  fallbackSlides?: HeroSlide[];
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: '1',
    image: '/grocery-shop/hero-slider-and-banner/hero-slider-and-banner3.webp',
    badgeLabel: 'ANGEBOT',
    badgeColor: '#1B8057',
    title: 'Best of Organic Farming',
    subtitle: 'Get 30% Off Your First Organic Order!',
    ctaText: 'Shop now',
    ctaHref: '/shop',
  },
  {
    id: '2',
    image: '/grocery-shop/hero-slider-and-banner/hero-slider-and-banner4.webp',
    badgeLabel: 'FRISCH',
    badgeColor: '#F4B400',
    title: 'Farm Fresh Every Day',
    subtitle: 'Nature picked fruits and vegetables delivered straight to your door.',
    ctaText: 'Shop now',
    ctaHref: '/shop',
  },
  {
    id: '3',
    image: '/grocery-shop/hero-slider-and-banner/hero-slider-and-banner5.webp',
    badgeLabel: 'PREMIUM',
    badgeColor: '#E85D3A',
    title: 'Healthy Fresh Premium Groceries',
    subtitle: 'From farm to table — premium organic produce every season.',
    ctaText: 'Shop now',
    ctaHref: '/shop',
  },
];

const getBadgeColor = (label: string): string => {
  const colors: Record<string, string> = {
    'sale': '#E85D3A',
    'angebot': '#F4B400',
    'online hammer': '#1B8057',
    'hammer': '#1B8057',
    'premium': '#6C5B7B',
    'neu': '#3498DB',
    'frisch': '#2ECC71',
    'aktion': '#E67E22',
  };
  
  const lowerLabel = label.toLowerCase();
  for (const [key, color] of Object.entries(colors)) {
    if (lowerLabel.includes(key)) {
      return color;
    }
  }
  return '#1B8057';
};

const HeroBannerSlider = ({ 
  fallbackSlides = DEFAULT_SLIDES
}: HeroBannerSliderProps) => {
  const { data: bannerData } = useBanners('hero');

  const mapBannersToSlides = (banners: any[]): HeroSlide[] => {
    return banners.map((banner) => ({
      id: banner._id,
      image: banner.image,
      imageMobile: banner.image,
      badgeLabel: banner.tagline || '',
      badgeColor: banner.tagline ? getBadgeColor(banner.tagline) : '#1B8057',
      title: banner.title || '',
      subtitle: banner.subtitle || banner.description || '',
      price: banner.price || '',
      originalPrice: banner.originalPrice || '',
      ctaText: banner.cta || 'Mehr erfahren',
      ctaHref: banner.href || '/shop',
    }));
  };

  const slides = bannerData && bannerData.length > 0 
    ? mapBannersToSlides(bannerData)
    : fallbackSlides;

  if (!slides || slides.length === 0) return null;

  return (
    <section className="hbs-section hbs-fade-in">
      <div className="hbs-wrapper">
        {/* Stacked Banners - No Sliding */}
        <div className="hbs-stack">
          {slides.map((slide, index) => (
            <div key={slide.id} className="hbs-banner-item">
              <div className="hbs-slide">
                {/* Desktop Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="hbs-img hbs-img-desktop"
                  style={{ objectFit: 'cover' }}
                  sizes="100vw"
                />
                {/* Mobile Image */}
                <Image
                  src={slide.imageMobile || slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="hbs-img hbs-img-mobile"
                  style={{ objectFit: 'cover' }}
                  sizes="100vw"
                />

                <div className="hbs-scrim" />

                <div className="hbs-content">
                  <div className="hbs-panel">
                    {slide.badgeLabel && (
                      <span 
                        className="hbs-badge"
                        style={{ backgroundColor: slide.badgeColor || '#1B8057' }}
                      >
                        {slide.badgeLabel}
                      </span>
                    )}
                    
                    <h2 className="hbs-title">{slide.title}</h2>
                    
                    {slide.subtitle && (
                      <p className="hbs-subtitle">{slide.subtitle}</p>
                    )}
                    
                    {slide.price && (
                      <div className="hbs-price-wrap">
                        {slide.originalPrice && (
                          <span className="hbs-price-original">{slide.originalPrice}</span>
                        )}
                        <span className="hbs-price">{slide.price}</span>
                      </div>
                    )}
                    
                    <Link href={slide.ctaHref} className="hbs-cta">
                      {slide.ctaText}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* ── Mobile First ── */
        .hbs-section {
          width: 100%;
          padding: 0 4px;
        }

        .hbs-wrapper {
          width: 100%;
        }

        /* Fade in animation */
        .hbs-fade-in {
          animation: hbsFadeIn 0.6s ease-out forwards;
        }

        @keyframes hbsFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Stack Container ── */
        .hbs-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .hbs-banner-item {
          width: 100%;
          border-radius: 10px;
          overflow: hidden;
        }

        /* ── Slide/Banner ── */
        .hbs-slide {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          border-radius: 10px;
        }

        .hbs-img {
          z-index: 0;
        }
        .hbs-img-mobile {
          display: block;
        }
        .hbs-img-desktop {
          display: none;
        }

        .hbs-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.3) 60%,
            rgba(0, 0, 0, 0.05) 100%
          );
          z-index: 1;
        }

        /* ── Content ── */
        .hbs-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          padding: 16px 18px;
        }

        .hbs-panel {
          max-width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          position: relative;
          z-index: 2;
        }

        .hbs-badge {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 4px;
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #1B8057;
        }

        .hbs-title {
          margin: 0;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }

        .hbs-subtitle {
          margin: 0;
          color: rgba(255, 255, 255, 0.85);
          font-size: 11px;
          font-weight: 400;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hbs-price-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 2px;
        }

        .hbs-price-original {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          text-decoration: line-through;
        }

        .hbs-price {
          color: #fff;
          font-size: 17px;
          font-weight: 700;
        }

        .hbs-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          padding: 6px 16px;
          background: #fff;
          color: #1a1a1a;
          font-size: 11px;
          font-weight: 600;
          border-radius: 30px;
          text-decoration: none;
          transition: background-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
        }
        .hbs-cta:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* ── Tablet (640px - 1023px) ── */
        @media (min-width: 640px) {
          .hbs-section { padding: 0 8px; }
          .hbs-stack { gap: 16px; }
          .hbs-slide { height: 240px; border-radius: 12px; }
          .hbs-banner-item { border-radius: 12px; }
          .hbs-content { padding: 24px 32px; }
          .hbs-title { font-size: 20px; }
          .hbs-subtitle { font-size: 13px; }
          .hbs-price { font-size: 20px; }
          .hbs-cta { font-size: 12px; padding: 8px 20px; }
          .hbs-badge { font-size: 10px; padding: 3px 12px; }
        }

        /* ── Desktop (1024px - 1279px) ── */
        @media (min-width: 1024px) {
          .hbs-section { padding: 0 12px; }
          .hbs-stack { gap: 20px; }
          .hbs-slide { height: 340px; border-radius: 14px; }
          .hbs-banner-item { border-radius: 14px; }

          .hbs-img-mobile { display: none; }
          .hbs-img-desktop { display: block; }

          .hbs-content { padding: 32px 48px; }
          .hbs-panel { max-width: 55%; }
          .hbs-title { font-size: 28px; }
          .hbs-subtitle { font-size: 14px; }
          .hbs-price { font-size: 24px; }
          .hbs-cta { font-size: 13px; padding: 10px 24px; }
          .hbs-badge { font-size: 11px; padding: 4px 14px; }
          .hbs-price-original { font-size: 13px; }
        }

        /* ── Large Desktop (1280px - 1535px) ── */
        @media (min-width: 1280px) {
          .hbs-section { padding: 0 16px; }
          .hbs-stack { gap: 24px; }
          .hbs-slide { height: 400px; border-radius: 16px; }
          .hbs-banner-item { border-radius: 16px; }
          .hbs-title { font-size: 34px; }
          .hbs-content { padding: 40px 60px; }
          .hbs-panel { max-width: 50%; }
          .hbs-price { font-size: 28px; }
          .hbs-cta { font-size: 14px; padding: 12px 28px; }
          .hbs-badge { font-size: 12px; padding: 4px 16px; }
          .hbs-subtitle { font-size: 15px; }
          .hbs-price-original { font-size: 14px; }
        }

        /* ── Extra Large Desktop (1536px+) ── */
        @media (min-width: 1536px) {
          .hbs-section { padding: 0 20px; }
          .hbs-stack { gap: 28px; }
          .hbs-slide { height: 460px; border-radius: 18px; }
          .hbs-banner-item { border-radius: 18px; }
          .hbs-title { font-size: 40px; }
          .hbs-content { padding: 48px 72px; }
          .hbs-panel { max-width: 48%; }
          .hbs-price { font-size: 32px; }
          .hbs-cta { font-size: 15px; padding: 14px 32px; }
          .hbs-badge { font-size: 13px; padding: 5px 18px; }
          .hbs-subtitle { font-size: 16px; }
          .hbs-price-original { font-size: 15px; }
        }
      `}</style>
    </section>
  );
};

export default HeroBannerSlider;