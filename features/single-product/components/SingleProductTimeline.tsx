'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

/* Per-slide content — image + its corresponding text travel together. */
const TABS = [
  {
    id: 1,
    year: '2022 GEN ONE',
    image: '/single -product/img-with-text-slider/img-with-text-1.webp',
    heading: 'Voice Assistant Integration',
    description: "Some headphones are optimized for use with voice assistants like Amazon Alexa, Google Assistant, or Apple's Siri.",
    body: 'In gaming headphones, customizable RGB LED lights are a popular feature for aesthetic and branding purposes. In wired headphones, having detachable cables can make them easier to store and replace if damaged.',
  },
  {
    id: 2,
    year: '2023 GEN ONE',
    image: '/single -product/img-with-text-slider/img-with-text-2.webp',
    heading: 'Voice Assistant Integration',
    description: "Some headphones are optimized for use with voice assistants like Amazon Alexa, Google Assistant, or Apple's Siri.",
    body: 'In gaming headphones, customizable RGB LED lights are a popular feature for aesthetic and branding purposes. In wired headphones, having detachable cables can make them easier to store and replace if damaged.',
  },
  {
    id: 3,
    year: '2024 GEN ONE',
    image: '/single -product/img-with-text-slider/img-with-text-3.webp',
    heading: 'Voice Assistant Integration',
    description: "Some headphones are optimized for use with voice assistants like Amazon Alexa, Google Assistant, or Apple's Siri.",
    body: 'In gaming headphones, customizable RGB LED lights are a popular feature for aesthetic and branding purposes. In wired headphones, having detachable cables can make them easier to store and replace if damaged.',
  },
  {
    id: 4,
    year: '2025 GEN ONE',
    image: '/single -product/img-with-text-slider/img-with-text-4.webp',
    heading: 'Voice Assistant Integration',
    description: "Some headphones are optimized for use with voice assistants like Amazon Alexa, Google Assistant, or Apple's Siri.",
    body: 'In gaming headphones, customizable RGB LED lights are a popular feature for aesthetic and branding purposes. In wired headphones, having detachable cables can make them easier to store and replace if damaged.',
  },
];

export function SingleProductTimeline() {
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="sptl-section">
      <div className="container-main">
        {/* Timeline progress row */}
        <div className="sptl-timeline">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              className={`sptl-step ${i === active ? 'sptl-step-active' : ''}`}
              onClick={() => swiperRef.current?.slideToLoop(i)}
            >
              <span className="sptl-dot">{i + 1}</span>
              <span className="sptl-year">{t.year}</span>
            </button>
          ))}
        </div>

        {/* Slider — each slide carries its own image + content, both transition together */}
        <Swiper
          onSwiper={(s) => { swiperRef.current = s; }}
          onSlideChange={(s) => setActive(s.realIndex)}
          slidesPerView={1}
          loop
          className="sptl-swiper"
        >
          {TABS.map((t) => (
            <SwiperSlide key={t.id}>
              {/* clicking anywhere on the panel advances the slider */}
              <div
                className="sptl-content"
                role="button"
                tabIndex={0}
                onClick={() => swiperRef.current?.slideNext()}
              >
                {/* Image */}
                <div className="sptl-img-col">
                  <div
                    className="sptl-img-wrap"
                    style={{ position: 'relative', height: '680px', overflow: 'hidden', borderRadius: '12px', backgroundColor: '#f0f0f0' }}
                  >
                    <Image
                      src={t.image}
                      alt={t.heading}
                      fill
                      className="sptl-img"
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 749px) 90vw, 45vw"
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="sptl-text">
                  <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111', margin: 0, lineHeight: 1.2 }}>
                    {t.heading}
                  </h2>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', margin: 0, lineHeight: 1.4 }}>
                    {t.description}
                  </p>
                  <p style={{ fontSize: '14px', color: '#8a8a8a', margin: 0, lineHeight: 1.7 }}>
                    {t.body}
                  </p>
                  <Link
                    href="/shop"
                    className="sptl-cta"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#1a6fe8',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      padding: '13px 30px',
                      borderRadius: '50px',
                      textDecoration: 'none',
                      width: 'fit-content',
                      marginTop: '6px',
                      transition: 'background 0.25s ease',
                    }}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Plain <style> — reliable/global (avoids the styled-jsx scoping pitfall) */}
      <style>{`
        .sptl-section {
          padding: 0;
          background: #fff;
        }

        /* ── Timeline row ── */
        .sptl-timeline {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
          margin-bottom: clamp(40px, 5vw, 64px);
        }
        .sptl-timeline::before {
          content: '';
          position: absolute;
          top: 18px;
          left: 12.5%;
          right: 12.5%;
          border-top: 2px dotted #aac3ee;
          z-index: 0;
        }
        .sptl-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          z-index: 1;
          padding: 0;
        }
        .sptl-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #cfcfcf;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 500;
          color: #999;
          transition: all 0.25s ease;
        }
        .sptl-step-active .sptl-dot {
          border-color: #1a6fe8;
          background: #1a6fe8;
          color: #fff;
        }
        /* labels centred under each dot */
        .sptl-year {
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          color: #8a8a8a;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .sptl-step-active .sptl-year {
          color: #111;
          font-weight: 700;
        }

        /* ── Slide content ── */
        .sptl-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 4vw, 64px);
          align-items: center;
          cursor: pointer;
        }
        .sptl-img-col {
          min-width: 0;
        }
        /* hover zoom on the slider image */
        .sptl-img {
          transition: transform 0.6s ease;
        }
        .sptl-img-wrap:hover .sptl-img {
          transform: scale(1.05);
        }
        .sptl-text {
          display: flex;
          flex-direction: column;
          gap: 18px;
          max-width: 490px;
        }
        .sptl-cta:hover {
          background: #1559c0 !important;
        }

        @media (max-width: 991px) {
          .sptl-content {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .sptl-img-wrap {
            height: clamp(360px, 60vw, 560px) !important;
          }
          .sptl-text { max-width: none; }
        }

        @media (max-width: 749px) {
          .sptl-timeline {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 16px;
          }
          .sptl-timeline::before { display: none; }
        }
      `}</style>
    </section>
  );
}
