'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';

function IconArrowLeft({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconArrowRight({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

const slides = [
  {
    id: 1,
    bg: '#e8eef0',
    eyebrow: 'Green Garden Co.',
    titleLinesA: ['Plants And Gardening'],
    titleLinesB: ['For Every', 'Space'],
    subtitle: 'Discover our curated collection of indoor and outdoor plants for every home and garden.',
    cta: 'Shop Collection',
    href: '/plant-garden/shop',
    image: '/plant-and-garden/hero-slider/hero-slider1.webp',
  },
  {
    id: 2,
    bg: '#eef2ec',
    eyebrow: 'Outdoor Collection',
    titleLinesA: ['Grow Your Perfect'],
    titleLinesB: ['Garden', 'Paradise'],
    subtitle: 'Premium seeds, bulbs, and tools to transform your outdoor space into a green retreat.',
    cta: 'Shop Collection',
    href: '/plant-garden/shop',
    image: '/plant-and-garden/hero-slider/hero-slider2.webp',
  },
  {
    id: 3,
    bg: '#f0ede8',
    eyebrow: 'Indoor Plants',
    titleLinesA: ['Bring Nature'],
    titleLinesB: ['Inside Your', 'Home'],
    subtitle: 'Hand-picked indoor plants that thrive in any light and any space.',
    cta: 'Shop Collection',
    href: '/plant-garden/shop?category=Indoor%20Plants',
    image: '/plant-and-garden/hero-slider/hero-slider3.webp',
  },
];

export function PlantGardenHero() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  return (
    <section className="pgh-hero-section">
      <div className="pgh-hero-wrap">
        <Swiper
          modules={[EffectFade, Pagination]}
          onSwiper={setSwiperInstance}
          onSlideChange={(s) => {
            setActiveIndex(s.realIndex);
            setAnimKey((k) => k + 1);
          }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={1200}
          slidesPerView={1}
          style={{ width: '100%', height: '100%' }}
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={slide.id}>
              <div className="pgh-slide">
                {/* Per-slide background color — visible while image loads */}
                <div className="pgh-slide-bg" style={{ backgroundColor: slide.bg }} />

                <div className="pgh-slide-image">
                  <Image
                    src={slide.image}
                    alt={[...slide.titleLinesA, ...slide.titleLinesB].join(' ')}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center right' }}
                    sizes="100vw"
                    priority={i === 0}
                  />
                </div>

                {/* Light gradient overlay — keeps left-side text readable */}
                <div className="pgh-slide-overlay" style={{ background: `linear-gradient(105deg, ${slide.bg}f0 0%, ${slide.bg}c0 40%, ${slide.bg}00 72%)` }} />

                <div className="pgh-slide-content container-main">
                  <div
                    key={`stack-${animKey}-${i}`}
                    className={`pgh-stack ${activeIndex === i ? 'is-active' : ''}`}
                  >
                    <p className="pgh-eyebrow">{slide.eyebrow}</p>
                    <h1 className="pgh-title">
                      {slide.titleLinesA.map((l, k) => (
                        <span key={`a-${k}`} className="pgh-title-line">{l}</span>
                      ))}
                      <span className="pgh-title-line">
                        {slide.titleLinesB.map((w, k) => (
                          <span key={`b-${k}`} className={k === 1 ? 'pgh-title-accent' : undefined}>
                            {k > 0 ? ' ' : ''}{w}
                          </span>
                        ))}
                      </span>
                    </h1>
                    <p className="pgh-subtitle">{slide.subtitle}</p>
                    <Link href={slide.href} className="pgh-cta">
                      {slide.cta}
                      <IconArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Side arrows */}
        <button
          type="button"
          aria-label="Previous slide"
          className="pgh-arrow pgh-arrow-prev"
          onClick={() => swiperInstance?.slidePrev()}
        >
          <IconArrowLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          className="pgh-arrow pgh-arrow-next"
          onClick={() => swiperInstance?.slideNext()}
        >
          <IconArrowRight size={20} />
        </button>

        {/* Dot pagination */}
        <div className="pgh-pagination">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => swiperInstance?.slideToLoop(i)}
              className={`pgh-dot ${activeIndex === i ? 'is-active' : ''}`}
            >
              <span />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pghFloatIn {
          0%   { opacity: 0; transform: translate3d(0, -14px, 0); }
          100% { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .pgh-stack > .pgh-eyebrow,
        .pgh-stack > .pgh-title,
        .pgh-stack > .pgh-subtitle,
        .pgh-stack > .pgh-cta {
          opacity: 0;
          transform: translate3d(0, -14px, 0);
          will-change: transform, opacity;
        }
        .pgh-stack.is-active > .pgh-eyebrow {
          animation: pghFloatIn 900ms cubic-bezier(0.22, 1, 0.36, 1) 100ms forwards;
        }
        .pgh-stack.is-active > .pgh-title {
          animation: pghFloatIn 900ms cubic-bezier(0.22, 1, 0.36, 1) 200ms forwards;
        }
        .pgh-stack.is-active > .pgh-subtitle {
          animation: pghFloatIn 900ms cubic-bezier(0.22, 1, 0.36, 1) 320ms forwards;
        }
        .pgh-stack.is-active > .pgh-cta {
          animation: pghFloatIn 900ms cubic-bezier(0.22, 1, 0.36, 1) 440ms forwards;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translate3d(0, -22px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .swiper-slide-active .pgh-stack > * {
          -webkit-animation-name: fadeInDown;
          animation-name: fadeInDown;
          -webkit-animation-duration: 1.2s;
          animation-duration: 1.2s;
          -webkit-animation-fill-mode: both;
          animation-fill-mode: both;
        }
        .swiper-slide-active .pgh-stack > .pgh-title {
          -webkit-animation-delay: 0.6s;
          animation-delay: 0.6s;
        }

        .pgh-hero-wrap {
          position: relative;
          width: 100%;
          height: 730px;
          overflow: hidden;
          background: #e8eef0;
        }
        .pgh-slide {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .pgh-slide-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .pgh-slide-image {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .pgh-slide-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
        }
        .pgh-slide-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          z-index: 3;
        }
        .pgh-slide-content > .pgh-stack {
          max-width: 560px;
        }
        .pgh-eyebrow {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.4px;
          color: #666;
          margin-bottom: 12px;
        }
        .pgh-title {
          font-size: 32px;
          font-weight: 700;
          color: #111;
          line-height: 1.15;
          margin-bottom: 18px;
          letter-spacing: -0.4px;
        }
        .pgh-title-line {
          display: block;
          white-space: nowrap;
        }
        .pgh-title-accent {
          color: #3a7d44;
        }
        .pgh-subtitle {
          font-size: 14px;
          color: #555;
          margin-bottom: 28px;
          max-width: 420px;
          line-height: 1.6;
        }
        .pgh-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #111;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.2px;
          padding: 14px 28px;
          border-radius: 6px;
          text-decoration: none;
          transition: background-color 260ms ease, transform 260ms ease;
        }
        .pgh-cta:hover {
          background-color: #3a7d44;
          transform: translateY(-1px);
        }

        /* Arrows */
        .pgh-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.80);
          color: #222;
          border: 1px solid rgba(0,0,0,0.10);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          transition: background-color 220ms ease, color 220ms ease;
        }
        .pgh-arrow:hover { background: #111; color: #fff; border-color: #111; }
        .pgh-arrow-prev { left: 14px; }
        .pgh-arrow-next { right: 14px; }

        /* Dot pagination */
        .pgh-pagination {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 5;
        }
        .pgh-dot {
          width: 16px;
          height: 16px;
          padding: 0;
          border-radius: 50%;
          background: transparent;
          border: 1.5px solid transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 350ms ease;
        }
        .pgh-dot span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.28);
          display: block;
          transition: background-color 300ms ease, transform 300ms ease;
        }
        .pgh-dot:hover span { background: rgba(0,0,0,0.55); }
        .pgh-dot.is-active { border-color: #3a7d44; }
        .pgh-dot.is-active span { background: #3a7d44; transform: scale(0.85); }

        @media (max-width: 749px) {
          .pgh-hero-wrap {
            height: calc(clamp(280px, 58vw, 420px) + 280px);
            overflow: visible;
            background: #fff;
          }
          .pgh-hero-wrap .swiper,
          .pgh-hero-wrap .swiper-wrapper,
          .pgh-hero-wrap .swiper-slide {
            height: 100% !important;
            width: 100% !important;
          }
          .pgh-slide {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: visible;
          }
          .pgh-slide-bg {
            position: absolute;
            inset: 0;
            height: clamp(280px, 58vw, 420px);
          }
          .pgh-slide-image {
            position: relative;
            inset: auto;
            width: 100%;
            height: clamp(280px, 58vw, 420px);
            flex-shrink: 0;
            z-index: 1;
          }
          .pgh-slide-overlay { display: none; }
          .pgh-slide-content {
            position: static;
            inset: auto;
            width: 100%;
            flex: 1;
            padding: 28px 16px 56px;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            z-index: 2;
            background: #fff;
          }
          .pgh-slide-content > .pgh-stack {
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          .pgh-eyebrow {
            font-size: clamp(10px, 2.8vw, 13px);
            margin-bottom: 8px;
            text-align: center;
          }
          .pgh-title {
            font-size: clamp(20px, 5.6vw, 32px);
            margin-bottom: clamp(10px, 2.4vw, 14px);
            text-align: center;
          }
          .pgh-title-line { white-space: normal; }
          .pgh-subtitle {
            font-size: clamp(11px, 3vw, 14px);
            margin-bottom: clamp(16px, 4vw, 22px);
            text-align: center;
            max-width: 100%;
          }
          .pgh-cta {
            font-size: clamp(13px, 3.5vw, 15px);
            padding: clamp(11px, 2.8vw, 14px) clamp(20px, 5.5vw, 28px);
          }
          .pgh-arrow { display: none; }
          .pgh-pagination { bottom: 20px; }
        }

        @media (min-width: 750px) {
          .pgh-title { font-size: 44px; }
        }
        @media (min-width: 992px) {
          .pgh-eyebrow { font-size: 14px; margin-bottom: 18px; }
          .pgh-title { font-size: 60px; margin-bottom: 24px; }
          .pgh-subtitle { font-size: 15px; margin-bottom: 32px; }
          .pgh-slide-content > .pgh-stack { max-width: 600px; }
        }
        @media (min-width: 1200px) {
          .pgh-title { font-size: 68px; letter-spacing: -0.6px; }
        }
      `}</style>
    </section>
  );
}
