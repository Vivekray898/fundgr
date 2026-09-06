// src/features/grocery-shop/components/GroceryFeaturedSlider.tsx
'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useProducts } from '@/features/products/hooks/useProducts';
import { GroceryProductCard } from './GroceryProductCard';

import 'swiper/css';

function IconArrowLeft({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconArrowRight({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

export function GroceryFeaturedSlider() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const { data } = useProducts({ 
    limit: 12, 
    sort: 'best-selling' 
  });
  const products = data?.products ?? [];

  return (
    <section className="gfcs-section">
      <div className="container-main">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 600, color: '#222' }}>Featured Collection</h2>
        </div>

        <div className="gfcs-slider-wrap">
          {products.length > 0 ? (
            <Swiper
              modules={[Navigation]}
              onSwiper={setSwiperInstance}
              slidesPerView={1}
              breakpoints={{
                750: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
              spaceBetween={20}
              loop={products.length > 4}
              speed={600}
              style={{ overflow: 'hidden' }}
            >
              {products.map((product, i) => (
                <SwiperSlide key={product.id} style={{ height: 'auto' }}>
                  <GroceryProductCard product={product} index={i} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="animate-shimmer" style={{ aspectRatio: '1/1', borderRadius: '10px', marginBottom: '14px' }} />
                  <div className="animate-shimmer" style={{ height: '16px', width: '70%', margin: '0 auto 8px', borderRadius: '4px' }} />
                  <div className="animate-shimmer" style={{ height: '14px', width: '40%', margin: '0 auto 12px', borderRadius: '4px' }} />
                  <div className="animate-shimmer" style={{ height: '52px', width: '100%', borderRadius: '40px' }} />
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous products"
            className="gfcs-nav gfcs-nav-prev"
          >
            <IconArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next products"
            className="gfcs-nav gfcs-nav-next"
          >
            <IconArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .gfcs-slider-wrap {
          position: relative;
          min-width: 0;
        }

        .gfcs-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%) translateX(0);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background-color: #fff;
          color: #222;
          border: 1.5px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          opacity: 0;
          pointer-events: none;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          transition:
            opacity 350ms ease,
            transform 300ms ease,
            background-color 220ms ease,
            border-color 220ms ease,
            color 220ms ease;
        }
        .gfcs-nav-prev {
          left: 10px;
          transform: translateY(-50%) translateX(-6px);
        }
        .gfcs-nav-next {
          right: 10px;
          transform: translateY(-50%) translateX(6px);
        }

        .gfcs-slider-wrap:hover .gfcs-nav {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(-50%) translateX(0);
        }

        .gfcs-nav:hover {
          background-color: #1B8057;
          border-color: #1B8057;
          color: #fff;
        }
        .gfcs-nav:focus-visible {
          outline: 2px solid #1B8057;
          outline-offset: 2px;
          opacity: 1;
          pointer-events: auto;
          transform: translateY(-50%) translateX(0);
        }

        /* Hide nav arrows on mobile */
        @media (max-width: 749px) {
          .gfcs-nav-prev,
          .gfcs-nav-next {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}