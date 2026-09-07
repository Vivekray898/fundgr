// components/HomePage/GroceryFullBanner.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useFullBanner } from '@/components/hooks/useFullBanner';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="gfb-skeleton-wrapper">
    <div className="gfb-skeleton-wrap">
      <div className="gfb-skeleton-shimmer" />
      <div className="gfb-skeleton-content">
        <div className="gfb-skeleton-title" />
        <div className="gfb-skeleton-description" />
        <div className="gfb-skeleton-btn" />
      </div>
      <div className="gfb-skeleton-dots">
        <span className="gfb-skeleton-dot" />
        <span className="gfb-skeleton-dot gfb-skeleton-dot-active" />
        <span className="gfb-skeleton-dot" />
      </div>
    </div>
  </div>
);

export function GroceryFullBanner() {
  const { data: banners, isLoading } = useFullBanner();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Show loading state
  if (isLoading) {
    return (
      <section className="gfb-section">
        <div className="container-main">
          <SkeletonLoader />
        </div>
      </section>
    );
  }

  // If no banners from Sanity, don't render anything
  if (!banners || banners.length === 0) {
    return null;
  }

  // Map banners to slides
  const slides = banners.map((banner) => ({
    id: banner._id,
    title: banner.title,
    description: banner.description,
    cta: banner.cta,
    href: banner.href,
    image: banner.image,
  }));

  return (
    <section className="gfb-section">
      <div className="container-main">
        <div className="gfb-slider-wrap">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            onSwiper={setSwiperInstance}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
            navigation={{ 
              prevEl: '.gfb-prev', 
              nextEl: '.gfb-next' 
            }}
            pagination={{ 
              el: '.gfb-pagination-container', 
              clickable: true,
              bulletClass: 'gfb-dot',
              bulletActiveClass: 'gfb-dot-active',
              renderBullet: (index, className) => {
                return `<button class="${className}" aria-label="Go to slide ${index + 1}"></button>`;
              }
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={slides.length > 1}
            speed={700}
            slidesPerView={1}
            grabCursor={true}
            touchRatio={1.5}
            resistanceRatio={0.85}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="gfb-wrap">
                  <Image
                    src={slide.image}
                    alt={slide.title.replace('\n', ' ')}
                    fill
                    className="gfb-image"
                    style={{ objectFit: 'cover' }}
                    sizes="(min-width: 992px) 90vw, 100vw"
                    priority={false}
                  />

                  <div className="gfb-content">
                    <h2 className="gfb-title">{slide.title}</h2>
                    <p className="gfb-description">{slide.description}</p>
                    <Link href={slide.href} className="gfb-btn">
                      {slide.cta}
                      <IconArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button className="gfb-arrow gfb-prev" aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <button className="gfb-arrow gfb-next" aria-label="Next">
            <ChevronRight size={20} />
          </button>

          {/* Pagination Dots - Below the banner */}
          <div className="gfb-pagination-container" />
        </div>
      </div>

      <style>{`
        /* ── Section ── */
        .gfb-section {
          width: 100%;
        }

        .gfb-slider-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 18px;
        }

        .gfb-wrap {
          position: relative;
          display: block;
          width: 100%;
          height: 200px;
          border-radius: 18px;
          overflow: hidden;
        }

        .gfb-image {
          transition: transform 700ms ease;
        }
        .gfb-wrap:hover .gfb-image {
          transform: scale(1.03);
        }

        .gfb-content {
          position: absolute;
          top: 50%;
          left: 20px;
          transform: translateY(-50%);
          z-index: 2;
          max-width: 75%;
        }
        .gfb-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f3620;
          line-height: 1.22;
          margin: 0 0 6px;
          letter-spacing: -0.2px;
          white-space: pre-line;
        }
        .gfb-description {
          font-size: 11px;
          color: #27472a;
          line-height: 1.5;
          margin: 0 0 10px;
          max-width: 280px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .gfb-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #0f3620;
          color: #fff;
          font-size: 11px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 40px;
          text-decoration: none;
          transition: background-color 250ms ease, transform 250ms ease, box-shadow 250ms ease;
        }
        .gfb-btn:hover {
          background-color: #072110;
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(0,0,0,0.18);
        }

        /* ── Arrows ── */
        .gfb-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 200ms ease, opacity 200ms ease;
          opacity: 0;
          pointer-events: none;
        }
        .gfb-slider-wrap:hover .gfb-arrow {
          opacity: 1;
          pointer-events: auto;
        }
        .gfb-arrow:hover {
          background: #fff;
        }
        .gfb-prev {
          left: 8px;
        }
        .gfb-next {
          right: 8px;
        }

        /* ── Pagination Dots ── */
        .gfb-pagination-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 0 4px 0;
          width: 100%;
        }

        .gfb-pagination-container .gfb-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d4d4d4;
          cursor: pointer;
          border: none;
          padding: 0;
          transition: width 300ms ease, background-color 300ms ease, border-radius 300ms ease;
          -webkit-tap-highlight-color: transparent;
        }

        .gfb-pagination-container .gfb-dot:hover {
          background: #b8923a;
          transform: scale(1.1);
        }

        .gfb-pagination-container .gfb-dot-active {
          background: #0f3620;
          width: 24px;
          border-radius: 4px;
        }

        /* ── Skeleton Loader ── */
        .gfb-skeleton-wrapper {
          width: 100%;
          border-radius: 18px;
          overflow: hidden;
        }

        .gfb-skeleton-wrap {
          position: relative;
          width: 100%;
          height: 200px;
          background: #e8e8e8;
          overflow: hidden;
          border-radius: 18px;
        }

        .gfb-skeleton-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shimmer 1.8s infinite;
          transform: translateX(-100%);
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .gfb-skeleton-content {
          position: absolute;
          top: 50%;
          left: 20px;
          transform: translateY(-50%);
          z-index: 2;
          max-width: 75%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .gfb-skeleton-title {
          width: 160px;
          height: 20px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        .gfb-skeleton-description {
          width: 120px;
          height: 14px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .gfb-skeleton-btn {
          width: 80px;
          height: 30px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 40px;
          margin-top: 4px;
        }

        .gfb-skeleton-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }

        .gfb-skeleton-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
        }

        .gfb-skeleton-dot-active {
          width: 24px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.5);
        }

        /* ── Tablet ── */
        @media (min-width: 750px) {
          .gfb-wrap { height: 280px; }
          .gfb-skeleton-wrap { height: 280px; }
          .gfb-content { left: 32px; max-width: 55%; }
          .gfb-title { font-size: 20px; margin-bottom: 8px; letter-spacing: -0.4px; }
          .gfb-description { font-size: 12px; line-height: 1.6; margin-bottom: 12px; max-width: 320px; }
          .gfb-btn { padding: 10px 20px; font-size: 12px; }
          .gfb-arrow { width: 34px; height: 34px; }
          .gfb-pagination-container { gap: 10px; padding: 16px 0 6px 0; }
          .gfb-pagination-container .gfb-dot { width: 9px; height: 9px; }
          .gfb-pagination-container .gfb-dot-active { width: 28px; }
          .gfb-skeleton-title { width: 200px; height: 24px; }
          .gfb-skeleton-description { width: 160px; height: 16px; }
          .gfb-skeleton-btn { width: 100px; height: 34px; }
        }

        /* ── Desktop ── */
        @media (min-width: 992px) {
          .gfb-wrap { height: 340px; }
          .gfb-skeleton-wrap { height: 340px; }
          .gfb-content { left: 48px; max-width: 40%; }
          .gfb-title { font-size: 24px; margin-bottom: 10px; letter-spacing: -0.6px; }
          .gfb-description { font-size: 13px; margin-bottom: 16px; max-width: 360px; }
          .gfb-btn { padding: 12px 24px; font-size: 13px; }
          .gfb-arrow { width: 38px; height: 38px; }
          .gfb-prev { left: 16px; }
          .gfb-next { right: 16px; }
          .gfb-pagination-container { gap: 12px; padding: 20px 0 8px 0; }
          .gfb-pagination-container .gfb-dot { width: 10px; height: 10px; }
          .gfb-pagination-container .gfb-dot-active { width: 32px; }
          .gfb-skeleton-title { width: 260px; height: 28px; }
          .gfb-skeleton-description { width: 200px; height: 18px; }
          .gfb-skeleton-btn { width: 120px; height: 38px; }
          .gfb-skeleton-dots { bottom: 16px; }
        }

        /* ── Large Desktop ── */
        @media (min-width: 1200px) {
          .gfb-wrap { height: 380px; }
          .gfb-skeleton-wrap { height: 380px; }
          .gfb-title { font-size: 28px; }
          .gfb-description { font-size: 14px; }
          .gfb-arrow { width: 40px; height: 40px; }
          .gfb-pagination-container .gfb-dot { width: 11px; height: 11px; }
          .gfb-pagination-container .gfb-dot-active { width: 36px; }
          .gfb-skeleton-title { width: 300px; height: 32px; }
          .gfb-skeleton-description { width: 240px; height: 20px; }
          .gfb-skeleton-btn { width: 140px; height: 42px; }
        }
      `}</style>
    </section>
  );
}