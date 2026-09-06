'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { HomeProductCard } from '@/features/home/components/HomeProductCard';
import { singleProductProducts } from '@/data/single-product-products';

function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

const PRODUCTS = singleProductProducts.slice(0, 6);

export function SingleProductBestsellers() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="spbs-section">
      <div className="container-main">
        {/* Heading */}
        <div className="spbs-heading">
          <h2 className="spbs-title">Bestsellers Products</h2>
          <p className="spbs-subtitle">Browse the best of our favorite sale styles and brands.</p>
        </div>

        {/* Carousel */}
        <div className="spbs-carousel-wrap">
          <button
            className="spbs-arrow spbs-arrow-prev"
            aria-label="Previous"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <IconArrowLeft />
          </button>

          <Swiper
            onSwiper={(s) => { swiperRef.current = s; }}
            slidesPerView={1.2}
            spaceBetween={16}
            loop
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 20 },
              750: { slidesPerView: 3, spaceBetween: 24 },
              1200: { slidesPerView: 4, spaceBetween: 24 },
            }}
          >
            {PRODUCTS.map((product, i) => (
              <SwiperSlide key={product.id}>
                <HomeProductCard
                  product={product}
                  index={i}
                  hrefBase="/products"
                  showCountdown={false}
                  showScrollText={false}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="spbs-arrow spbs-arrow-next"
            aria-label="Next"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <IconArrowRight />
          </button>
        </div>
      </div>

      <style jsx>{`
        .spbs-section {
          padding: 0;
          background: #fff;
        }

        /* ── Bordered 450px product card ──
           The shared HomeProductCard is laid out as a flex column: the image
           <Link> (first child) grows to fill, content (name/price/swatches/
           stock) sits below. box-sizing keeps the total card exactly 450px. */
        .spbs-section :global(.fc-card) {
          height: 450px;
          display: flex;
          flex-direction: column;
          border: 1px solid #ececec;
          border-radius: 12px;
          padding: 16px;
          background: #fff;
          box-sizing: border-box;
        }
        .spbs-section :global(.fc-card > a:first-child) {
          flex: 1 1 auto;
          min-height: 0;
          height: auto !important;
          aspect-ratio: auto !important;
          background-color: #fff !important;
        }

        .spbs-heading {
          text-align: center;
          margin-bottom: clamp(28px, 3.5vw, 48px);
        }
        .spbs-title {
          font-size: clamp(22px, 2.6vw, 32px);
          font-weight: 700;
          color: #111;
          margin: 0 0 10px;
        }
        .spbs-subtitle {
          font-size: clamp(12px, 1vw, 14px);
          color: #666;
          margin: 0;
        }
        .spbs-carousel-wrap {
          position: relative;
        }
        .spbs-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #ddd;
          background: #fff;
          color: #333;
          cursor: pointer;
          /* hidden until the section is hovered */
          opacity: 0;
          transition: opacity 0.25s ease, background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        /* reveal the arrows on section hover */
        .spbs-section:hover .spbs-arrow {
          opacity: 1;
        }
        .spbs-arrow:hover {
          background: #000;
          border-color: #000;
          color: #fff;
        }
        .spbs-arrow-prev { left: -20px; }
        .spbs-arrow-next { right: -20px; }

        @media (max-width: 749px) {
          .spbs-arrow { display: none; }
        }
      `}</style>
    </section>
  );
}
