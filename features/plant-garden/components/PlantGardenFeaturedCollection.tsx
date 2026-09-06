'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { HomeProductCard } from '@/features/home/components/HomeProductCard';
import { plantGardenProducts } from '@/data/plant-garden-products';
import 'swiper/css';

const PRODUCTS = plantGardenProducts.slice(0, 8);
const COUNTDOWN_END = Date.now() + 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 5 * 60 * 1000 + 58 * 1000;

function useCountdown(endMs: number) {
  const [diff, setDiff] = useState(endMs - Date.now());
  useEffect(() => {
    const t = setInterval(() => setDiff(endMs - Date.now()), 1000);
    return () => clearInterval(t);
  }, [endMs]);
  const total = Math.max(0, diff);
  const d = Math.floor(total / 86400000);
  const h = Math.floor((total % 86400000) / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return { d, h, m, s };
}

function CountBlock({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        minWidth: '42px',
        padding: '4px 8px',
        background: '#111',
        color: '#fff',
        fontSize: 'clamp(13px, 1.2vw, 18px)',
        fontWeight: 700,
        borderRadius: '3px',
        display: 'inline-block',
        lineHeight: 1.4,
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <div style={{ fontSize: '10px', color: '#888', marginTop: '3px', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

export function PlantGardenFeaturedCollection() {
  const { d, h, m, s } = useCountdown(COUNTDOWN_END);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="pg-featured-collection">
      <div className="container-main">
        {/* Header */}
        <div className="pg-fc-header">
          <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 700, color: '#111', margin: 0 }}>
            Featured Collection
          </h2>
          <div className="pg-fc-right">
            <span style={{ fontSize: 'clamp(12px, 1vw, 14px)', color: '#555', marginRight: '10px' }}>
              Hurry up! Offer ends in:
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <CountBlock value={d} label="Days" />
              <CountBlock value={h} label="Hrs" />
              <CountBlock value={m} label="Min" />
              <CountBlock value={s} label="Sec" />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous"
                className="pg-fc-nav-btn"
              >
                <IconChevronLeft />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next"
                className="pg-fc-nav-btn"
              >
                <IconChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div style={{ overflow: 'hidden', padding: '4px 0 8px' }}>
          <Swiper
            modules={[Navigation]}
            onSwiper={(s) => { swiperRef.current = s; }}
            slidesPerView={1}
            breakpoints={{
              600: { slidesPerView: 2 },
              750: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
            }}
            spaceBetween={24}
            loop
            speed={600}
            style={{ overflow: 'visible' }}
          >
            {PRODUCTS.map((product, i) => (
              <SwiperSlide key={product.id}>
                <HomeProductCard
                  product={product}
                  hrefBase="/plant-garden/product"
                  index={i}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .pg-fc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: clamp(20px, 2.5vw, 36px);
        }
        .pg-fc-right {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .pg-fc-nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid #e0e0e0;
          background-color: #fff;
          color: #222;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 250ms ease, border-color 250ms ease, color 250ms ease;
        }
        .pg-fc-nav-btn:hover {
          background-color: #3a7d44;
          border-color: #3a7d44;
          color: #fff;
        }
        @media (max-width: 749px) {
          .pg-fc-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .pg-fc-right {
            gap: 8px;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
