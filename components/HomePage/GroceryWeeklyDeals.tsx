// components/HomePage/GroceryWeeklyDeals.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useBanners } from '@/components/hooks/useBanners';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-fade';

function IconArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="gwd-skeleton-wrapper">
    <div className="gwd-skeleton-grid">
      <div className="gwd-skeleton-content">
        <div className="gwd-skeleton-shimmer" />
        <div className="gwd-skeleton-title" />
        <div className="gwd-skeleton-description" />
        <div className="gwd-skeleton-btn" />
      </div>
      <div className="gwd-skeleton-image" />
    </div>
  </div>
);

export function GroceryWeeklyDeals() {
  const { data: banners, isLoading } = useBanners('weekly');
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  // Show loading skeleton
  if (isLoading) {
    return (
      <section className="gwd-section">
        <div className="gwd-container">
          <SkeletonLoader />
        </div>
      </section>
    );
  }

  // If no weekly deal banners from Sanity, don't render anything
  if (!banners || banners.length === 0) {
    return null;
  }

  // Map banners to slides
  const slides = banners.map((banner) => ({
    id: banner._id,
    title: banner.title,
    description: banner.description || '',
    cta: banner.cta,
    href: banner.href,
    image: banner.image,
  }));

  return (
    <section className="gwd-section">
      <div className="gwd-container">
        <div className="gwd-slider-wrap">
          <Swiper
            modules={[EffectFade, Autoplay]}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
              setAnimKey((k) => k + 1);
            }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={slides.length > 1}
            speed={800}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            slidesPerView={1}
            style={{ width: '100%', height: '100%' }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <div className="gwd-slide">
                  <div className="gwd-grid">
                    <div className="gwd-content">
                      <div
                        key={`content-${animKey}-${index}`}
                        className={`gwd-content-inner ${activeIndex === index ? 'is-active' : ''}`}
                      >
                        <h2 className="gwd-title">{slide.title}</h2>
                        <p className="gwd-description">{slide.description}</p>
                        <Link href={slide.href} className="gwd-btn">
                          {slide.cta}
                          <IconArrowRight size={18} />
                        </Link>
                      </div>
                    </div>

                    <div className="gwd-image-wrap">
                      <Image
                        src={slide.image}
                        alt={slide.title.replace('\n', ' ')}
                        fill
                        className="gwd-image"
                        style={{ objectFit: 'cover' }}
                        sizes="(min-width: 992px) 50vw, 100vw"
                        quality={75}
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            className="gwd-arrow gwd-prev"
            aria-label="Previous"
            onClick={() => swiperInstance?.slidePrev()}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="gwd-arrow gwd-next"
            aria-label="Next"
            onClick={() => swiperInstance?.slideNext()}
          >
            <ChevronRight size={20} />
          </button>

          {/* Pagination Dots — same style as GroceryHero */}
          <div className="gwd-pagination">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => swiperInstance?.slideToLoop(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`gwd-dot ${activeIndex === i ? 'is-active' : ''}`}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Float-down animation (same as GroceryHero) ── */
        @keyframes gwdFloatIn {
          0%   { opacity: 0; transform: translate3d(0, -18px, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        /* Staggered reveal — button first, then description, then title */
        .gwd-content-inner > .gwd-title,
        .gwd-content-inner > .gwd-description,
        .gwd-content-inner > .gwd-btn {
          opacity: 0;
          transform: translate3d(0, -18px, 0);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .gwd-content-inner.is-active > .gwd-btn {
          animation: gwdFloatIn 1200ms cubic-bezier(0.22, 1, 0.36, 1) 150ms forwards;
        }
        .gwd-content-inner.is-active > .gwd-description {
          animation: gwdFloatIn 1200ms cubic-bezier(0.22, 1, 0.36, 1) 300ms forwards;
        }
        .gwd-content-inner.is-active > .gwd-title {
          animation: gwdFloatIn 1200ms cubic-bezier(0.22, 1, 0.36, 1) 470ms forwards;
        }

        /* ── Section ── */
        .gwd-section {
          width: 100%;
          overflow: hidden;
        }

        .gwd-container {
          max-width: 1530px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .gwd-slider-wrap {
          position: relative;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
        }

        /* ── Slide / Grid ── */
        .gwd-slide {
          width: 100%;
          height: 100%;
        }

        .gwd-grid {
          display: grid;
          grid-template-columns: 1fr;
          align-items: stretch;
          background-color: #eef5ea;
          overflow: hidden;
          width: 100%;
          min-height: 400px;
        }

        .gwd-content {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          min-width: 0;
          overflow: hidden;
          order: 2;
        }

        .gwd-content-inner {
          max-width: 500px;
          width: 100%;
        }

        .gwd-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f3a1f;
          line-height: 1.25;
          margin-bottom: 12px;
          letter-spacing: -0.4px;
          white-space: pre-line;
        }

        .gwd-description {
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 18px;
          max-width: 460px;
        }

        .gwd-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #1B8057;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          padding: 11px 24px;
          border-radius: 40px;
          text-decoration: none;
          letter-spacing: 0.4px;
          width: fit-content;
          transition: all 250ms ease;
          box-shadow: 0 2px 10px rgba(27, 128, 87, 0.25);
        }
        .gwd-btn:hover {
          background-color: #14623F;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(27, 128, 87, 0.35);
        }
        .gwd-btn svg {
          width: 16px;
          height: 16px;
        }

        .gwd-image-wrap {
          position: relative;
          min-height: 280px;
          overflow: hidden;
          min-width: 0;
          order: 1;
        }
        .gwd-image {
          transition: transform 700ms ease;
        }
        .gwd-slide:hover .gwd-image {
          transform: scale(1.05);
        }

        /* ── Arrows ── */
        .gwd-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          width: 32px;
          height: 32px;
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
        .gwd-slider-wrap:hover .gwd-arrow {
          opacity: 1;
          pointer-events: auto;
        }
        .gwd-arrow:hover {
          background: #fff;
        }
        .gwd-prev {
          left: 10px;
        }
        .gwd-next {
          right: 10px;
        }
        .gwd-arrow svg {
          width: 18px;
          height: 18px;
        }

        /* ── Pagination — same style as GroceryHero ── */
        .gwd-pagination {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 5;
          will-change: transform;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          padding: 4px 8px;
          border-radius: 14px;
        }

        .gwd-dot {
          width: 12px;
          height: 12px;
          padding: 0;
          border-radius: 50%;
          border: 1.5px solid transparent;
          background-color: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 550ms cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 550ms cubic-bezier(0.22, 1, 0.36, 1);
          -webkit-tap-highlight-color: transparent;
        }

        .gwd-dot span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          display: block;
          transform: scale(1);
          transform-origin: center;
          will-change: transform, background-color;
          transition: transform 550ms cubic-bezier(0.22, 1, 0.36, 1),
                      background-color 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .gwd-dot:hover span {
          background-color: rgba(255, 255, 255, 0.8);
        }

        .gwd-dot.is-active {
          border-color: #fff;
        }

        .gwd-dot.is-active span {
          background-color: #fff;
          transform: scale(0.8);
        }

        /* ── Skeleton Loader ── */
        .gwd-skeleton-wrapper {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
        }

        .gwd-skeleton-grid {
          display: grid;
          grid-template-columns: 1fr;
          background: #e8e8e8;
          min-height: 400px;
          overflow: hidden;
        }

        .gwd-skeleton-content {
          position: relative;
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          order: 2;
        }

        .gwd-skeleton-shimmer {
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

        .gwd-skeleton-title {
          width: 70%;
          height: 26px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        .gwd-skeleton-description {
          width: 85%;
          height: 14px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .gwd-skeleton-btn {
          width: 120px;
          height: 40px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 40px;
          margin-top: 4px;
        }

        .gwd-skeleton-image {
          background: #d8d8d8;
          min-height: 280px;
          order: 1;
        }

        /* ── Tablet ── */
        @media (min-width: 750px) {
          .gwd-container { padding: 0 24px; }
          .gwd-content { padding: 40px 36px; }
          .gwd-title { font-size: 26px; margin-bottom: 14px; }
          .gwd-description { font-size: 14px; margin-bottom: 20px; }
          .gwd-btn { font-size: 14px; padding: 12px 28px; }
          .gwd-btn svg { width: 17px; height: 17px; }
          .gwd-image-wrap { min-height: 340px; }
          .gwd-arrow { width: 36px; height: 36px; }
          .gwd-arrow svg { width: 20px; height: 20px; }
          .gwd-pagination { 
            bottom: 18px; 
            padding: 5px 12px; 
            gap: 10px;
            border-radius: 16px;
          }
          .gwd-dot { width: 15px; height: 15px; }
          .gwd-dot span { width: 7px; height: 7px; }
          .gwd-skeleton-grid { min-height: 420px; }
          .gwd-skeleton-content { padding: 40px 36px; }
          .gwd-skeleton-title { height: 30px; }
          .gwd-skeleton-description { height: 16px; }
          .gwd-skeleton-btn { height: 44px; }
          .gwd-skeleton-image { min-height: 340px; }
        }

        /* ── Desktop ── */
        @media (min-width: 992px) {
          .gwd-container { padding: 0 32px; }
          .gwd-grid {
            grid-template-columns: 1fr 1fr;
            min-height: 480px;
          }
          .gwd-content { 
            padding: 48px 44px;
            order: 1;
          }
          .gwd-content-inner { max-width: 460px; }
          .gwd-title { font-size: 32px; margin-bottom: 18px; }
          .gwd-description { font-size: 15px; margin-bottom: 24px; max-width: 420px; }
          .gwd-btn { font-size: 15px; padding: 14px 32px; gap: 10px; }
          .gwd-btn svg { width: 18px; height: 18px; }
          .gwd-image-wrap { 
            min-height: auto;
            height: 480px;
            order: 2;
          }
          .gwd-arrow { width: 40px; height: 40px; }
          .gwd-arrow svg { width: 22px; height: 22px; }
          .gwd-prev { left: 16px; }
          .gwd-next { right: 16px; }
          .gwd-pagination { 
            bottom: 20px; 
            padding: 6px 16px; 
            gap: 12px;
            border-radius: 18px;
          }
          .gwd-dot { width: 18px; height: 18px; }
          .gwd-dot span { width: 8px; height: 8px; }
          .gwd-skeleton-grid { 
            grid-template-columns: 1fr 1fr;
            min-height: 480px;
          }
          .gwd-skeleton-content { 
            padding: 48px 44px;
            order: 1;
          }
          .gwd-skeleton-title { width: 80%; height: 34px; }
          .gwd-skeleton-description { width: 70%; height: 18px; }
          .gwd-skeleton-btn { width: 140px; height: 48px; }
          .gwd-skeleton-image { 
            min-height: 480px;
            order: 2;
          }
        }

        /* ── Large Desktop ── */
        @media (min-width: 1200px) {
          .gwd-container { padding: 0 40px; }
          .gwd-grid { min-height: 520px; }
          .gwd-content { padding: 56px 52px; }
          .gwd-content-inner { max-width: 480px; }
          .gwd-title { font-size: 36px; margin-bottom: 20px; }
          .gwd-description { font-size: 16px; margin-bottom: 28px; }
          .gwd-btn { font-size: 16px; padding: 15px 34px; gap: 12px; }
          .gwd-btn svg { width: 19px; height: 19px; }
          .gwd-image-wrap { height: 520px; }
          .gwd-pagination { 
            padding: 7px 18px; 
            gap: 14px;
          }
          .gwd-dot { width: 20px; height: 20px; }
          .gwd-dot span { width: 9px; height: 9px; }
          .gwd-skeleton-grid { min-height: 520px; }
          .gwd-skeleton-image { min-height: 520px; }
          .gwd-skeleton-content { padding: 56px 52px; }
          .gwd-skeleton-title { height: 38px; }
        }
      `}</style>
    </section>
  );
}