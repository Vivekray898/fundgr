'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

/* ── Remix Icon Arrows ── */

function IconArrowLeftS({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconArrowRightS({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

/* ── Slide Data ── */

const slides = [
  {
    id: 1,
    title: 'Women Summer\nTrend Style',
    subtitle: "Introducing the Ambuz women's autumn / summer Fashion",
    cta: 'Shop Collection',
    href: '/shop',
    image: '/fashion/hero-slider/hero-slider1.png',
  },
  {
    id: 2,
    title: 'New Arrivals\nCollection',
    subtitle: 'Discover the latest fashion trends curated just for you',
    cta: 'Shop Collection',
    href: '/shop',
    image: '/fashion/hero-slider/hero-slider2.png',
  },
  {
    id: 3,
    title: 'Autumn Winter\nFashion',
    subtitle: 'The best styles for the colder season ahead',
    cta: 'Shop Collection',
    href: '/shop',
    image: '/fashion/hero-slider/hero-slider3.png',
  },
];

/* ── Hero Slider Component ── */

export function HeroSlider() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  return (
    <section className="hero-slider-section" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <Swiper
        modules={[Navigation, Pagination, EffectFade]}
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
        style={{ width: '100%', height: '730px' }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-slide-wrap">
              {/* Background Image */}
              <div className="hero-slide-img-wrap">
                <Image
                  src={slide.image}
                  alt={slide.title.replace('\n', ' ')}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>

              {/* Content overlay — left aligned */}
              <div className="hero-slide-content container-main">
                <div
                  key={`content-${animKey}-${i}`}
                  className="hero-slide-text"
                  style={{
                    animation: activeIndex === i ? 'heroFadeInDown 800ms ease-out forwards' : 'none',
                    opacity: activeIndex === i ? 1 : 0,
                  }}
                >
                  <h1 className="hero-slide-title">
                    {slide.title}
                  </h1>
                  <p className="hero-slide-subtitle">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={slide.href}
                    className="hero-slide-cta"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#000',
                      color: '#fff',
                      fontSize: '15px',
                      fontWeight: 500,
                      padding: '14px 28px',
                      borderRadius: '40px',
                      textDecoration: 'none',
                      transition: 'background-color 200ms ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fc5732'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000'; }}
                  >
                    {slide.cta}
                    <IconArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows — hidden by default, slide in on section hover */}
      <button
        onClick={() => swiperInstance?.slidePrev()}
        aria-label="Previous slide"
        className="hero-nav-prev"
      >
        <IconArrowRightS size={24} />
      </button>

      <button
        onClick={() => swiperInstance?.slideNext()}
        aria-label="Next slide"
        className="hero-nav-next"
      >
        <IconArrowRightS size={24} />
      </button>

      {/* Custom Pagination — dot inside thin circle for active */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => swiperInstance?.slideToLoop(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: activeIndex === i ? '18px' : '10px',
              height: activeIndex === i ? '18px' : '10px',
              borderRadius: '50%',
              border: activeIndex === i ? '1.5px solid #222' : 'none',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 300ms ease',
            }}
          >
            <span
              style={{
                width: activeIndex === i ? '8px' : '10px',
                height: activeIndex === i ? '8px' : '10px',
                borderRadius: '50%',
                backgroundColor: activeIndex === i ? '#222' : '#bbb',
                display: 'block',
                transition: 'all 300ms ease',
              }}
            />
          </button>
        ))}
      </div>

      {/* Hero slider styles */}
      <style>{`
        @keyframes heroFadeInDown {
          0% { opacity: 0; transform: translateY(-30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate3d(0, -22px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .swiper-slide-active .hero-slide-text > * {
          -webkit-animation-name: fadeInDown;
          animation-name: fadeInDown;
          -webkit-animation-duration: 1.2s;
          animation-duration: 1.2s;
          -webkit-animation-fill-mode: both;
          animation-fill-mode: both;
        }
        .swiper-slide-active .hero-slide-text > .hero-slide-title {
          -webkit-animation-delay: 0.6s;
          animation-delay: 0.6s;
        }

        /* ── Slide inner structure (desktop base) ── */
        .hero-slide-wrap {
          position: relative;
          width: 100%;
          height: 730px;
          background-color: #f5f0eb;
          overflow: hidden;
        }
        .hero-slide-img-wrap {
          position: absolute;
          inset: 0;
        }
        .hero-slide-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          z-index: 2;
        }
        .hero-slide-text {
          max-width: 520px;
        }
        .hero-slide-title {
          font-size: 50px;
          font-weight: 700;
          color: #222;
          line-height: 1.2;
          margin-bottom: 16px;
          white-space: pre-line;
        }
        .hero-slide-subtitle {
          font-size: 20px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        /* ── Mobile: image on top, content below ── */
        @media (max-width: 749px) {
          .hero-slider-section .swiper {
            height: calc(clamp(240px, 58vw, 420px) + 260px) !important;
          }
          .hero-slider-section .swiper-wrapper,
          .hero-slider-section .swiper-slide {
            height: 100% !important;
          }
          .hero-slide-wrap {
            height: 100%;
            overflow: visible;
            display: flex;
            flex-direction: column;
          }
          .hero-slide-img-wrap {
            position: relative;
            inset: auto;
            width: 100%;
            height: clamp(240px, 58vw, 420px);
            flex-shrink: 0;
            overflow: hidden;
          }
          .hero-slide-content {
            position: static;
            width: 100%;
            flex: 1;
            padding-top: 24px;
            padding-bottom: 56px;
            align-items: flex-start;
            justify-content: center;
            z-index: auto;
          }
          .hero-slide-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 100%;
            width: 100%;
          }
          .hero-slide-title {
            font-size: clamp(22px, 5.5vw, 32px);
            margin-bottom: clamp(10px, 2.5vw, 16px);
            text-align: center;
            white-space: pre-line;
          }
          .hero-slide-subtitle {
            font-size: clamp(13px, 3.2vw, 15px);
            margin-bottom: clamp(16px, 4vw, 22px);
            text-align: center;
          }
          .hero-nav-prev,
          .hero-nav-next {
            display: none !important;
          }
        }

        /* ── Nav buttons — desktop only ── */
        .hero-nav-prev,
        .hero-nav-next {
          position: absolute;
          top: 50%;
          z-index: 10;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 400ms ease, opacity 400ms ease, background-color 250ms ease;
          opacity: 0;
          font-size: 24px;
        }
        .hero-nav-prev {
          left: 40px;
          transform: translateY(-50%) translateX(-50px) rotate(180deg);
          background-color: rgba(0, 0, 0, 0.35);
        }
        .hero-nav-next {
          right: 40px;
          transform: translateY(-50%) translateX(50px);
          background-color: #000;
        }
        .hero-slider-section:hover .hero-nav-prev {
          opacity: 1;
          transform: translateY(-50%) translateX(0) rotate(180deg);
        }
        .hero-slider-section:hover .hero-nav-next {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }
        .hero-nav-prev:hover,
        .hero-nav-next:hover {
          background-color: #fc5732 !important;
        }
      `}</style>
    </section>
  );
}
