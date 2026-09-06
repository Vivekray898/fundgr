// components/HomePage/GroceryHero.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useBanners } from '@/components/hooks/useBanners';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

function IconArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

export function GroceryHero() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  // Fetch hero slides and side banners
  const { data: heroSlides, isLoading: heroLoading } = useBanners('hero');
  const { data: sideBanners, isLoading: sideLoading } = useBanners('side');

  // If no hero slides from Sanity, don't render anything
  if (!heroSlides || heroSlides.length === 0) {
    return null;
  }

  // Use Sanity data for slides
  const slides = heroSlides.map((slide: any) => ({
    id: slide._id,
    titleLines: slide.titleLines || ['Best of Organic', 'Farming'],
    subtitle: slide.subtitle || '',
    cta: slide.cta || 'Shop now',
    href: slide.href || '/shop',
    image: slide.image,
  }));

  // Use Sanity data for side banners - only if they exist
  const finalSideBanners = sideBanners && sideBanners.length > 0
    ? sideBanners.map((banner: any) => ({
        id: banner._id,
        title: banner.title,
        cta: banner.cta || 'SHOP NOW',
        href: banner.href || '/shop',
        image: banner.image,
        textColor: banner.textColor || '#222',
      }))
    : [];

  return (
    <section className="gh-hero-section">
      <div className="container-main">
        <div className="gh-hero-grid">
          {/* Main slider — 75% */}
          <div className="gh-hero-slider-wrap">
            <Swiper
              modules={[EffectFade, Pagination]}
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.realIndex);
                setAnimKey((k) => k + 1);
              }}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              loop
              speed={800}
              slidesPerView={1}
              style={{ width: '100%', height: '100%' }}
            >
              {slides.map((slide, i) => (
                <SwiperSlide key={slide.id}>
                  <div className="gh-slide">
                    <div className="gh-slide-image-wrap">
                      <Image
                        src={slide.image}
                        alt={slide.titleLines.join(' ')}
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        sizes="(max-width: 991px) 100vw, 70vw"
                        priority={i === 0}
                      />
                    </div>

                    <div className="gh-slide-content">
                      <div
                        key={`content-${animKey}-${i}`}
                        className={`gh-slide-stack ${activeIndex === i ? 'is-active' : ''}`}
                      >
                        <h1 className="gh-slide-title">
                          {slide.titleLines.map((line, idx) => (
                            <span key={idx} className="gh-slide-title-line">{line}</span>
                          ))}
                        </h1>
                        <p className="gh-slide-subtitle">{slide.subtitle}</p>
                        <Link href={slide.href} className="gh-slide-btn">
                          {slide.cta}
                          <IconArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Pagination — always visible, dot-inside-thin-circle */}
            <div className="gh-pagination">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => swiperInstance?.slideToLoop(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`gh-dot ${activeIndex === i ? 'is-active' : ''}`}
                >
                  <span />
                </button>
              ))}
            </div>
          </div>

          {/* Side banners — only render if there are side banners */}
          {finalSideBanners.length > 0 && (
            <div className="gh-side-banners">
              {finalSideBanners.map((banner) => (
                <Link key={banner.id} href={banner.href} className="gh-side-banner">
                  <div className="gh-side-image-wrap">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="gh-side-image"
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 991px) 100vw, 30vw"
                    />
                  </div>
                  <div className="gh-side-content" style={{ color: banner.textColor }}>
                    <h3 className="gh-side-title">{banner.title}</h3>
                    <span className="gh-side-cta">{banner.cta}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Gentle float-down from above — short travel, long duration, smooth fade */
        @keyframes ghFloatIn {
          0%   { opacity: 0; transform: translate3d(0, -18px, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        /* Staggered reveal — button first, then description, then title. */
        .gh-slide-stack > .gh-slide-title,
        .gh-slide-stack > .gh-slide-subtitle,
        .gh-slide-stack > .gh-slide-btn {
          opacity: 0;
          transform: translate3d(0, -18px, 0);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .gh-slide-stack.is-active > .gh-slide-btn {
          animation: ghFloatIn 1200ms cubic-bezier(0.22, 1, 0.36, 1) 150ms forwards;
        }
        .gh-slide-stack.is-active > .gh-slide-subtitle {
          animation: ghFloatIn 1200ms cubic-bezier(0.22, 1, 0.36, 1) 300ms forwards;
        }
        .gh-slide-stack.is-active > .gh-slide-title {
          animation: ghFloatIn 1200ms cubic-bezier(0.22, 1, 0.36, 1) 470ms forwards;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translate3d(0, -22px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .swiper-slide-active .gh-slide-stack > * {
          -webkit-animation-name: fadeInDown;
          animation-name: fadeInDown;
          -webkit-animation-duration: 1.2s;
          animation-duration: 1.2s;
          -webkit-animation-fill-mode: both;
          animation-fill-mode: both;
        }
        .swiper-slide-active .gh-slide-stack > .gh-slide-title {
          -webkit-animation-delay: 0.6s;
          animation-delay: 0.6s;
        }

        /* ── Mobile base ── */
        .gh-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          align-items: stretch;
        }

        .gh-hero-slider-wrap {
          position: relative;
          height: 380px;
          border-radius: 12px;
          overflow: hidden;
        }

        .gh-slide {
          position: relative;
          width: 100%;
          height: 380px;
          overflow: hidden;
          border-radius: 12px;
        }

        .gh-slide-image-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .gh-slide-content {
          position: absolute;
          top: 0; bottom: 0; left: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 24px;
          z-index: 3;
        }

        .gh-slide-title {
          font-size: 32px;
          font-weight: 700;
          color: rgb(51, 51, 51);
          line-height: 1.25;
          margin-bottom: 24px;
          letter-spacing: -0.5px;
        }

        .gh-slide-title-line {
          display: block;
          white-space: nowrap;
        }

        .gh-slide-subtitle {
          font-size: 17px;
          color: #555;
          margin-bottom: 32px;
          line-height: 1.7;
        }

        .gh-slide-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background-color: #1B8057;
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          padding: 14px 36px;
          border-radius: 40px;
          text-decoration: none;
          transition: all 250ms ease;
          box-shadow: 0 2px 10px rgba(27, 128, 87, 0.25);
        }
        .gh-slide-btn:hover {
          background-color: #14623F;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(27, 128, 87, 0.35);
        }

        /* Pagination */
        .gh-pagination {
          position: absolute;
          bottom: 26px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 14px;
          z-index: 5;
          will-change: transform;
        }
        .gh-dot {
          width: 20px;
          height: 20px;
          padding: 0;
          border-radius: 50%;
          border: 1.5px solid #222;
          background-color: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 550ms cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 550ms cubic-bezier(0.22, 1, 0.36, 1);
          border-color: transparent;
          -webkit-tap-highlight-color: transparent;
        }
        .gh-dot span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #bbb;
          display: block;
          transform: scale(1);
          transform-origin: center;
          will-change: transform, background-color;
          transition: transform 550ms cubic-bezier(0.22, 1, 0.36, 1),
                      background-color 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .gh-dot:hover span {
          background-color: #888;
        }
        .gh-dot.is-active {
          border-color: #222;
        }
        .gh-dot.is-active span {
          background-color: #222;
          transform: scale(0.8);
        }

        /* Side banners */
        .gh-side-banners {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto auto;
          gap: 16px;
          height: auto;
        }

        .gh-side-banner {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          display: block;
          text-decoration: none;
          height: 220px;
          transition: transform 350ms ease, box-shadow 350ms ease;
        }
        .gh-side-banner:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(0,0,0,0.08);
        }

        .gh-side-image-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .gh-side-image {
          transition: transform 600ms ease;
        }
        .gh-side-banner:hover .gh-side-image {
          transform: scale(1.06);
        }

        .gh-side-content {
          position: absolute;
          top: 30px;
          left: 32px;
          right: 32px;
          z-index: 2;
        }

        .gh-side-title {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 14px;
          color: inherit;
          white-space: normal;
          overflow-wrap: break-word;
          letter-spacing: -0.2px;
          max-width: 100%;
        }

        .gh-side-cta {
          display: inline-block;
          font-size: 14px;
          font-weight: 500;
          color: inherit;
          letter-spacing: 0.4px;
          padding-bottom: 3px;
          border-bottom: 1.5px solid currentColor;
          transition: letter-spacing 250ms ease, opacity 250ms ease;
        }
        .gh-side-banner:hover .gh-side-cta {
          letter-spacing: 1px;
        }

        /* ── < 750px — mobile ── */
        @media (max-width: 749px) {
          .gh-hero-slider-wrap {
            height: calc(clamp(280px, 58vw, 420px) + 280px);
            width: 100%;
            border-radius: 0;
            overflow: hidden;
          }
          .gh-hero-slider-wrap .swiper,
          .gh-hero-slider-wrap .swiper-wrapper,
          .gh-hero-slider-wrap .swiper-slide {
            height: 100% !important;
            width: 100% !important;
          }
          .gh-slide {
            height: 100%;
            width: 100%;
            border-radius: 0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          .gh-slide-image-wrap {
            position: relative;
            inset: auto;
            width: 100%;
            height: clamp(280px, 58vw, 420px);
            flex-shrink: 0;
            border-radius: 12px;
            overflow: hidden;
            z-index: 1;
          }
          .gh-slide-image-wrap img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover;
          }
          .gh-slide-content {
            position: static;
            width: 100%;
            flex: 1;
            padding: 28px 16px 56px;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            text-align: center;
            z-index: 2;
          }
          .gh-slide-stack {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          .gh-slide-title {
            font-size: clamp(20px, 5.4vw, 30px);
            margin-bottom: clamp(10px, 2.4vw, 14px);
            text-align: center;
          }
          .gh-slide-title-line { white-space: normal; }
          .gh-slide-subtitle {
            font-size: clamp(12px, 3.4vw, 15px);
            margin-bottom: clamp(16px, 4vw, 22px);
            text-align: center;
          }
          .gh-slide-btn {
            font-size: clamp(12px, 3.4vw, 16px);
            padding: clamp(10px, 2.6vw, 14px) clamp(20px, 5.5vw, 36px);
            gap: clamp(6px, 1.6vw, 12px);
          }
          .gh-pagination { bottom: 20px; }
        }

        /* ── ≥ 750px — tablet ── */
        @media (min-width: 750px) {
          .gh-side-banners {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
          }
          .gh-side-banner { height: 240px; }
          .gh-slide-title { font-size: 40px; }
          .gh-slide-content { padding: 0 40px; }
        }

        /* ── ≥ 992px — desktop ── */
        @media (min-width: 992px) {
          .gh-hero-grid { grid-template-columns: 3fr 1fr; }
          .gh-hero-slider-wrap, .gh-slide { height: 650px; }
          .gh-side-banners {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
            height: 650px;
          }
          .gh-side-banner { height: 100%; }
          .gh-slide-content { width: 55%; padding: 0 50px; }
          .gh-slide-title { font-size: 52px; margin-bottom: 28px; }
          .gh-slide-subtitle { font-size: 18px; margin-bottom: 40px; }
          .gh-side-title { font-size: 17px; }
        }

        /* ── ≥ 1200px — large desktop ── */
        @media (min-width: 1200px) {
          .gh-slide-content { width: 50%; padding: 0 60px; }
          .gh-slide-title { font-size: 60px; line-height: 1.25; margin-bottom: 32px; letter-spacing: -0.8px; }
          .gh-slide-subtitle { font-size: 19px; line-height: 1.75; margin-bottom: 44px; }
          .gh-slide-btn { font-size: 17px; padding: 16px 44px; }
          .gh-side-title { font-size: 19px; }
        }
      `}</style>
    </section>
  );
}