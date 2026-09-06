// components/HomePage/HeroBannerSlider.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from 'lucide-react';
import { useBanners } from '@/components/hooks/useBanners';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

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
  autoplayMs?: number;
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
  autoplayMs = 5000,
  fallbackSlides = DEFAULT_SLIDES
}: HeroBannerSliderProps) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const prefersReducedMotion = useRef(false);

  const { data: bannerData } = useBanners('hero');

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion.current) setIsPlaying(false);
  }, []);

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

  const toggleAutoplay = () => {
    if (!swiperInstance) return;
    if (isPlaying) {
      swiperInstance.autoplay.stop();
    } else {
      swiperInstance.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section className="hbs-section hbs-fade-in">
      <div className="hbs-wrapper">
        {/* Banner Slider */}
        <div className="hbs-slider-wrap">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            onSwiper={setSwiperInstance}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
            navigation={{ 
              prevEl: '.hbs-prev', 
              nextEl: '.hbs-next' 
            }}
            pagination={{ 
              el: '.hbs-pagination-container', 
              clickable: true,
              bulletClass: 'hbs-dot',
              bulletActiveClass: 'hbs-dot-active',
              renderBullet: (index, className) => {
                return `<button class="${className}" aria-label="Go to slide ${index + 1}"></button>`;
              }
            }}
            autoplay={
              prefersReducedMotion.current
                ? false
                : { delay: autoplayMs, disableOnInteraction: false }
            }
            loop={slides.length > 1}
            speed={700}
            grabCursor={true}
            touchRatio={1.5}
            resistanceRatio={0.85}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="hbs-slide">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    className="hbs-img hbs-img-desktop"
                    style={{ objectFit: 'cover' }}
                    sizes="100vw"
                  />
                  <Image
                    src={slide.imageMobile || slide.image}
                    alt={slide.title}
                    fill
                    priority
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
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button className="hbs-arrow hbs-prev" aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <button className="hbs-arrow hbs-next" aria-label="Next">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Pagination & Controls */}
        <div className="hbs-controls">
          <div className="hbs-controls-inner">
            <button
              className="hbs-playpause"
              onClick={toggleAutoplay}
              aria-label={isPlaying ? 'Automatischen Wechsel pausieren' : 'Automatischen Wechsel starten'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>

            <div className="hbs-pagination-container" />

            <div className="hbs-controls-spacer" />
          </div>
        </div>
      </div>

      <style>{`
        /* ── Mobile First ── */
        .hbs-section {
          width: 100%;
        }

        .hbs-wrapper {
          width: 100%;
        }

        /* Fade in animation to prevent sudden snapping */
        .hbs-fade-in {
          animation: hbsFadeIn 0.6s ease-out forwards;
        }

        @keyframes hbsFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Slider Wrapper ── */
        .hbs-slider-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 12px;
        }

        /* ── Slider ── */
        .hbs-slide {
          position: relative;
          width: 100%;
          height: 280px;
          overflow: hidden;
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
            rgba(0, 0, 0, 0.1) 100%
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
          padding: 20px 24px;
        }

        .hbs-panel {
          max-width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          position: relative;
          z-index: 2;
        }

        .hbs-badge {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 4px;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #1B8057;
        }

        .hbs-title {
          margin: 0;
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }

        .hbs-subtitle {
          margin: 0;
          color: rgba(255, 255, 255, 0.85);
          font-size: 12px;
          font-weight: 400;
          line-height: 1.4;
        }

        .hbs-price-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
        }

        .hbs-price-original {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          text-decoration: line-through;
        }

        .hbs-price {
          color: #fff;
          font-size: 20px;
          font-weight: 700;
        }

        .hbs-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          padding: 8px 20px;
          background: #fff;
          color: #1a1a1a;
          font-size: 12px;
          font-weight: 600;
          border-radius: 30px;
          text-decoration: none;
          transition: background-color 200ms ease, transform 200ms ease;
        }
        .hbs-cta:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
        }

        /* ── Arrows ── */
        .hbs-arrow {
          display: none;
        }

        /* ── Controls ── */
        .hbs-controls {
          padding: 14px 16px 4px 16px;
          background: transparent;
        }

        .hbs-controls-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 400px;
          margin: 0 auto;
          gap: 12px;
        }

        .hbs-playpause {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid #d0d0d0;
          background: #fff;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 200ms ease, transform 200ms ease, border-color 200ms ease;
          flex-shrink: 0;
          padding: 0;
        }
        .hbs-playpause:hover {
          background: #f0f0f0;
          border-color: #aaa;
          transform: scale(1.05);
        }
        .hbs-playpause:active {
          transform: scale(0.95);
        }

        /* ── Pagination Dots ── */
        .hbs-pagination-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .hbs-pagination-container .hbs-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #d4d4d4;
          cursor: pointer;
          border: 2px solid transparent;
          padding: 0;
          transition: all 300ms ease;
          -webkit-tap-highlight-color: transparent;
        }

        .hbs-pagination-container .hbs-dot:hover {
          background: #d4a853;
          transform: scale(1.1);
        }

        .hbs-pagination-container .hbs-dot-active {
          background: #F4B400;
          border-color: #d4a853;
          width: 28px;
          border-radius: 6px;
          transform: scale(1);
        }

        .hbs-controls-spacer {
          width: 28px;
          flex-shrink: 0;
        }

        /* ── Tablet ── */
        @media (min-width: 640px) {
          .hbs-slide { height: 340px; }
          .hbs-content { padding: 30px 40px; }
          .hbs-title { font-size: 24px; }
          .hbs-subtitle { font-size: 14px; }
          .hbs-price { font-size: 24px; }
          .hbs-cta { font-size: 13px; padding: 10px 24px; }
          .hbs-badge { font-size: 11px; padding: 4px 14px; }
          .hbs-controls { padding: 16px 20px 4px 20px; }
          .hbs-controls-inner { max-width: 450px; }
          .hbs-pagination-container .hbs-dot { width: 11px; height: 11px; }
          .hbs-pagination-container .hbs-dot-active { width: 30px; }
        }

        /* ── Desktop ── */
        @media (min-width: 992px) {
          .hbs-slide { height: 400px; }

          .hbs-img-mobile { display: none; }
          .hbs-img-desktop { display: block; }

          .hbs-content { padding: 40px 60px; }
          .hbs-panel { max-width: 50%; }
          .hbs-title { font-size: 32px; }
          .hbs-subtitle { font-size: 15px; }
          .hbs-price { font-size: 28px; }
          .hbs-cta { font-size: 14px; padding: 12px 28px; }
          .hbs-badge { font-size: 12px; padding: 4px 16px; }

          /* Show arrows on desktop */
          .hbs-arrow {
            display: flex;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 3;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: rgba(255, 255, 255, 0.9);
            color: #1a1a1a;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 200ms ease, opacity 200ms ease;
            opacity: 0;
            pointer-events: none;
          }
          .hbs-slider-wrap:hover .hbs-arrow {
            opacity: 1;
            pointer-events: auto;
          }
          .hbs-arrow:hover {
            background: #fff;
          }
          .hbs-prev { left: 16px; }
          .hbs-next { right: 16px; }

          .hbs-controls { padding: 18px 24px 4px 24px; }
          .hbs-controls-inner { max-width: 500px; gap: 16px; }
          .hbs-playpause { width: 32px; height: 32px; }
          .hbs-pagination-container .hbs-dot { width: 12px; height: 12px; }
          .hbs-pagination-container .hbs-dot-active { width: 32px; }
          .hbs-controls-spacer { width: 32px; }
        }

        /* ── Large Desktop ── */
        @media (min-width: 1200px) {
          .hbs-slide { height: 460px; }
          .hbs-title { font-size: 38px; }
          .hbs-content { padding: 50px 80px; }
          .hbs-price { font-size: 32px; }
          .hbs-arrow { width: 44px; height: 44px; }
          .hbs-prev { left: 20px; }
          .hbs-next { right: 20px; }
          .hbs-controls { padding: 20px 28px 4px 28px; }
        }
      `}</style>
    </section>
  );
};

export default HeroBannerSlider;