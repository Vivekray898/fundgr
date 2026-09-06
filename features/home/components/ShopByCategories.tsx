'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

/* ── Icons ── */

function IconArrowLeftS({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" />
    </svg>
  );
}

function IconArrowRightS({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
    </svg>
  );
}

function IconArrowRightLong({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
    </svg>
  );
}

/* ── Category Data ── */

const categories = [
  { id: 'knit', label: 'Knit Wears', items: 17, image: '/fashion/categories-mega-menu/categories-mega-menu1.webp', href: '/shop?category=Knitwear' },
  { id: 'glasses', label: 'Glasses', items: 11, image: '/fashion/categories-mega-menu/categories-mega-menu2.webp', href: '/shop?category=Accessories' },
  { id: 'sweaters', label: 'Sweaters', items: 19, image: '/fashion/categories-mega-menu/categories-mega-menu3.webp', href: '/shop?category=Knitwear' },
  { id: 'formal', label: 'Formal Wear', items: 16, image: '/fashion/categories-mega-menu/categories-mega-menu4.webp', href: '/shop?category=Dresses' },
  { id: 'activewear', label: 'Activewear', items: 12, image: '/fashion/categories-mega-menu/categories-mega-menu5.webp', href: '/shop?category=Activewear' },
  { id: 'tops', label: 'Tops', items: 14, image: '/fashion/categories-mega-menu/categories-mega-menu1.webp', href: '/shop?category=Tops' },
  { id: 'dresses', label: 'Dresses', items: 22, image: '/fashion/categories-mega-menu/categories-mega-menu3.webp', href: '/shop?category=Dresses' },
];

/* ── Component ── */

export function ShopByCategories() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <section className="shop-categories-section">
      <div className="container-main">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 600, color: '#222', marginBottom: '12px' }}>
            Shop by categories
          </h2>
          <p style={{ fontSize: '15px', color: '#777', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Unmatched design—superior performance and customer satisfaction in one.
          </p>
        </div>

        {/* Slider */}
        <div style={{ position: 'relative', marginTop: '36px' }}>
          <Swiper
            modules={[Navigation]}
            onSwiper={setSwiperInstance}
            slidesPerView={2}
            breakpoints={{
              750: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
            }}
            spaceBetween={24}
            loop
            speed={600}
            style={{ overflow: 'hidden' }}
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id}>
                <div style={{ textAlign: 'left' }} className="cat-card">
                  {/* Image */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '370px',
                      backgroundColor: '#f5f5f5',
                      overflow: 'hidden',
                      marginBottom: '18px',
                      borderRadius: '8px',
                    }}
                    className="cat-card-img-wrap"
                  >
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="cat-card-img"
                      style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
                      sizes="(max-width: 749px) 50vw, 25vw"
                    />
                  </div>

                  {/* Label + item count + arrow button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#222',
                          display: 'inline-block',
                        }}
                      >
                        {cat.label}
                      </span>
                      <p style={{ fontSize: '14px', color: '#888', marginTop: '2px' }}>
                        {cat.items} Items
                      </p>
                    </div>

                    {/* Circle arrow button → links to shop */}
                    <Link
                      href={cat.href}
                      className="cat-arrow-btn"
                      aria-label={`Shop ${cat.label}`}
                    >
                      <IconArrowRightLong size={18} />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Nav arrows — hidden by default, appear on section hover */}
          <button
            onClick={() => swiperInstance?.slidePrev()}
            aria-label="Previous categories"
            className="cat-nav-prev"
          >
            <IconArrowLeftS size={20} />
          </button>
          <button
            onClick={() => swiperInstance?.slideNext()}
            aria-label="Next categories"
            className="cat-nav-next"
          >
            <IconArrowRightS size={20} />
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        /* Image hover zoom */
        .cat-card-img-wrap:hover .cat-card-img {
          transform: scale(1.05);
        }

        /* Circle arrow button — default black, hover orange */
        .cat-arrow-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background-color 300ms ease;
        }
        .cat-arrow-btn:hover {
          background-color: #fc5732;
        }

        /* When hovering the image, button also turns orange */
        .cat-card:hover .cat-arrow-btn {
          background-color: #fc5732;
        }

        /* Slider nav arrows */
        .cat-nav-prev,
        .cat-nav-next {
          position: absolute;
          top: 40%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid #e0e0e0;
          background-color: #fff;
          color: #222;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 400ms ease, transform 400ms ease, background-color 250ms ease, border-color 250ms ease, color 250ms ease;
        }

        .cat-nav-prev {
          left: 8px;
          transform: translateY(-50%);
        }
        .cat-nav-next {
          right: 8px;
          transform: translateY(-50%);
        }

        .shop-categories-section:hover .cat-nav-prev {
          opacity: 1;
        }
        .shop-categories-section:hover .cat-nav-next {
          opacity: 1;
        }

        .cat-nav-prev:hover,
        .cat-nav-next:hover {
          background-color: #000;
          border-color: #000;
          color: #fff;
        }
      `}</style>
    </section>
  );
}
