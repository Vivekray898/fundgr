'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

function IconArrowLeftS({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconArrowRightS({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

function IconInstagram({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12.001 9C10.3436 9 9.00098 10.3431 9.00098 12C9.00098 13.6573 10.3441 15 12.001 15C13.6583 15 15.001 13.6569 15.001 12C15.001 10.3427 13.6579 9 12.001 9ZM12.001 7C14.7614 7 17.001 9.2371 17.001 12C17.001 14.7605 14.7639 17 12.001 17C9.24051 17 7.00098 14.7629 7.00098 12C7.00098 9.23953 9.23808 7 12.001 7ZM18.501 6.74915C18.501 7.43926 17.9402 7.99917 17.251 7.99917C16.5609 7.99917 16.001 7.4384 16.001 6.74915C16.001 6.0599 16.5617 5.5 17.251 5.5C17.9393 5.49913 18.501 6.0599 18.501 6.74915ZM12.001 4C9.5265 4 9.12318 4.00655 7.97227 4.0578C7.18815 4.09461 6.66253 4.20007 6.17416 4.38967C5.74016 4.55799 5.42709 4.75898 5.09352 5.09255C4.75867 5.4274 4.55804 5.73963 4.3904 6.17383C4.20036 6.66332 4.09493 7.18811 4.05878 7.97115C4.00703 9.0752 4.00098 9.46105 4.00098 12C4.00098 14.4745 4.00753 14.8778 4.05877 16.0286C4.0956 16.8124 4.2012 17.3388 4.39034 17.826C4.5591 18.2606 4.7605 18.5744 5.09246 18.9064C5.42863 19.2421 5.74179 19.4434 6.17187 19.6094C6.66619 19.8005 7.19148 19.9061 7.97212 19.9422C9.07618 19.9939 9.46203 20 12.001 20C14.4755 20 14.8788 19.9934 16.0296 19.9422C16.8117 19.9055 17.3385 19.7996 17.827 19.6106C18.2604 19.4423 18.5752 19.2402 18.9074 18.9085C19.2436 18.5718 19.4445 18.2594 19.6107 17.8283C19.8013 17.3358 19.9071 16.8098 19.9432 16.0289C19.9949 14.9248 20.001 14.5389 20.001 12C20.001 9.52552 19.9944 9.12221 19.9432 7.97137C19.9064 7.18906 19.8005 6.66149 19.6113 6.17318C19.4434 5.74038 19.2417 5.42635 18.9084 5.09255C18.573 4.75715 18.2616 4.55693 17.8271 4.38942C17.338 4.19954 16.8124 4.09396 16.0298 4.05781C14.9258 4.00605 14.5399 4 12.001 4Z" />
    </svg>
  );
}

const images = [
  '/grocery-shop/instagram/instagram1.webp',
  '/grocery-shop/instagram/instagram2.webp',
  '/grocery-shop/instagram/instagram4.webp',
  '/grocery-shop/instagram/instagram5.webp',
  '/grocery-shop/instagram/instagram6.webp',
  '/grocery-shop/instagram/instagram3.webp',
];

export function GroceryInstagram() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <section className="gi-section">
      <div className="container-main">
        <div className="gi-heading-wrap">
          <h2 className="gi-heading">Instagram Shop</h2>
          <p className="gi-subtitle">
            Become a member of the <a href="#">@hooktheme</a> community
          </p>
        </div>

        <div className="gi-slider-wrap">
          <Swiper
            modules={[Navigation]}
            onSwiper={setSwiperInstance}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 3 },
              750: { slidesPerView: 4 },
              992: { slidesPerView: 5 },
            }}
            spaceBetween={16}
            loop
            speed={600}
            style={{ overflow: 'hidden' }}
          >
            {images.map((src, i) => (
              <SwiperSlide key={i}>
                <a href="#" className="gi-card">
                  <Image
                    src={src}
                    alt={`Instagram ${i + 1}`}
                    fill
                    className="gi-card-img"
                    style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
                    sizes="20vw"
                  />
                  <div className="gi-overlay">
                    <div style={{ color: '#fff' }}>
                      <IconInstagram size={32} />
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>

          <button onClick={() => swiperInstance?.slidePrev()} aria-label="Previous" className="gi-nav-prev">
            <IconArrowLeftS size={18} />
          </button>
          <button onClick={() => swiperInstance?.slideNext()} aria-label="Next" className="gi-nav-next">
            <IconArrowRightS size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .gi-heading-wrap {
          text-align: center;
          margin-bottom: 28px;
        }
        .gi-heading {
          font-size: 22px;
          font-weight: 700;
          color: #222;
          margin-bottom: 6px;
        }
        .gi-subtitle {
          font-size: 13px;
          color: #777;
        }

        @media (min-width: 750px) {
          .gi-heading { font-size: 26px; }
          .gi-subtitle { font-size: 14px; }
        }

        @media (min-width: 992px) {
          .gi-heading { font-size: 30px; }
        }
        .gi-subtitle a {
          color: #2c6e3a;
          text-decoration: underline;
          text-underline-offset: 2px;
          font-weight: 500;
        }

        .gi-slider-wrap {
          position: relative;
        }

        .gi-card {
          display: block;
          position: relative;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 10px;
          background-color: #f5f5f5;
        }
        .gi-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 300ms ease;
          z-index: 2;
        }
        .gi-card:hover .gi-overlay { opacity: 1 !important; }
        .gi-card:hover .gi-card-img { transform: scale(1.08); }

        .gi-nav-prev, .gi-nav-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid #e5e5e5;
          background-color: #fff;
          color: #222;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 350ms ease;
        }
        .gi-nav-prev { left: 8px; }
        .gi-nav-next { right: 8px; }
        .gi-section:hover .gi-nav-prev,
        .gi-section:hover .gi-nav-next { opacity: 1; }
        .gi-nav-prev:hover, .gi-nav-next:hover {
          background-color: #2c6e3a;
          border-color: #2c6e3a;
          color: #fff;
        }
      `}</style>
    </section>
  );
}
