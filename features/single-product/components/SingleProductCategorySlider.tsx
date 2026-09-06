'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

const categories = [
  { id: 1, label: 'Over-Ear',       description: 'Over-ear earbuds deliver comfort, quality sound, and isolation.',         image: '/single -product/full-width-slider/full-width-slider-1.webp' },
  { id: 2, label: 'True Wireless',   description: 'True wireless earbuds offer freedom, and seamless connectivity.',        image: '/single -product/full-width-slider/full-width-slider-2.webp' },
  { id: 3, label: 'Audiophile',      description: 'Audiophiles seek exceptional sound quality listening experiences.',      image: '/single -product/full-width-slider/full-width-slider-3.webp' },
  { id: 4, label: 'Child-Safe',      description: 'Child-safe wireless ensure comfort, and volume protection.',             image: '/single -product/full-width-slider/full-width-slider-4.webp' },
  { id: 5, label: 'Connectivity',    description: 'Wireless connectivity enables seamless and hassle-free integration.',    image: '/single -product/full-width-slider/full-width-slider-5.webp' },
  { id: 6, label: 'Modern wireless', description: 'This device technology ensures fast and versatile connectivity.',        image: '/single -product/full-width-slider/full-width-slider-6.webp' },
];

function IconArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

export function SingleProductCategorySlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="spcs-section">
      {/* Header row — stays aligned to the container */}
      <div className="container-main">
        <div className="spcs-header">
          <h2 className="spcs-title">Get to know Airpods</h2>
          <div className="spcs-arrows">
            <button
              className="spcs-arrow"
              aria-label="Previous"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <IconArrowLeft />
            </button>
            <button
              className="spcs-arrow"
              aria-label="Next"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <IconArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Full-bleed slider — first card aligns to container-left, slides flow off the
          right viewport edge. The inner div's right margin escapes to the viewport. */}
      <div className="container-main">
        <div className="spcs-bleed">
          <Swiper
            onSwiper={(s) => { swiperRef.current = s; }}
            slidesPerView={1.2}
            spaceBetween={16}
            loop
            breakpoints={{
              480: { slidesPerView: 2.2, spaceBetween: 20 },
              750: { slidesPerView: 3.3, spaceBetween: 24 },
              992: { slidesPerView: 4.3, spaceBetween: 24 },
            }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                {/* inline position/height — Image fill needs a positioned parent on SSR */}
                <div
                  className="spcs-card"
                  style={{
                    position: 'relative',
                    height: '490px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="spcs-img"
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 749px) 80vw, 24vw"
                  />
                  {/* Gradient + text overlay */}
                  <div
                    className="spcs-overlay"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '26px',
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 75%)',
                    }}
                  >
                    <p className="spcs-card-label">{cat.label}</p>
                    <p className="spcs-card-desc">{cat.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Plain <style> — no jsx — avoids scoping-hash failures on Image-fill cards */}
      <style>{`
        .spcs-section {
          padding: 0;
          background: #fff;
        }
        .spcs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: clamp(22px, 3vw, 36px);
        }
        /* Full-bleed: extend the right edge to the viewport edge while the left
           stays at the container content-left. Swiper clips slides at this edge. */
        .spcs-bleed {
          margin-right: calc(50% - 50vw);
        }
        .spcs-bleed :global(.swiper) {
          overflow: hidden;
        }
        .spcs-title {
          font-size: clamp(24px, 2.6vw, 33px);
          font-weight: 700;
          color: #111;
          margin: 0;
        }
        .spcs-arrows {
          display: flex;
          gap: 10px;
        }
        .spcs-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #e2e2e2;
          background: #fff;
          color: #222;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .spcs-arrow:hover {
          border-color: #1a6fe8;
          color: #fff;
          background: #1a6fe8;
        }
        .spcs-card { cursor: pointer; }
        .spcs-img { transition: transform 0.5s ease; }
        .spcs-card:hover .spcs-img { transform: scale(1.05); }

        .spcs-card-label {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
          line-height: 1.2;
        }
        .spcs-card-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.88);
          margin: 0;
          line-height: 1.45;
        }

        /* ── Responsive — keep proportions, cap height at 490px ── */
        @media (max-width: 991px) {
          .spcs-card { height: 460px !important; }
        }
        @media (max-width: 749px) {
          .spcs-card { height: 430px !important; }
          .spcs-card-label { font-size: 20px; }
          .spcs-card-desc { font-size: 13px; }
        }
        @media (max-width: 480px) {
          .spcs-card { height: 400px !important; }
        }
      `}</style>
    </section>
  );
}
