'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

const categories = [
  {
    id: 'home-garden',
    label: 'Home Garden',
    items: 12,
    image: '/plant-and-garden/categories-mega-menu/categories-mega-menu1.webp',
    href: '/plant-garden/shop?category=Indoor%20Plants',
  },
  {
    id: 'butterfly-garden',
    label: 'Butterfly Garden',
    items: 8,
    image: '/plant-and-garden/categories-mega-menu/categories-mega-menu2.webp',
    href: '/plant-garden/shop?category=Outdoor%20Plants',
  },
  {
    id: 'fruit-garden',
    label: 'Fruit Garden',
    items: 5,
    image: '/plant-and-garden/categories-mega-menu/categories-mega-menu3.webp',
    href: '/plant-garden/shop?category=Seeds%20%26%20Bulbs',
  },
  {
    id: 'flower-garden',
    label: 'Flower Garden',
    items: 11,
    image: '/plant-and-garden/categories-mega-menu/categories-mega-menu4.webp',
    href: '/plant-garden/shop?category=Outdoor%20Plants',
  },
  {
    id: 'herb-garden',
    label: 'Herb Garden',
    items: 7,
    image: '/plant-and-garden/categories-mega-menu/categories-mega-menu5.webp',
    href: '/plant-garden/shop?category=Seeds%20%26%20Bulbs',
  },
  {
    id: 'vegetable-garden',
    label: 'Vegetable Garden',
    items: 9,
    image: '/plant-and-garden/categories-mega-menu/categories-mega-menu3.webp',
    href: '/plant-garden/shop?category=Indoor%20Plants',
  },
];

export function PlantGardenCategories() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="pgc-section">
      <div className="container-main">
        {/* Heading row */}
        <div className="pgc-heading-row">
          <h2 className="pgc-heading">Shop by Categories</h2>
          <div className="pgc-arrows">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous categories"
              className="pgc-nav-btn"
            >
              <IconArrowLeftS size={18} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next categories"
              className="pgc-nav-btn"
            >
              <IconArrowRightS size={18} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation]}
          onSwiper={(s) => { swiperRef.current = s; }}
          slidesPerView={2}
          breakpoints={{
            750: { slidesPerView: 4 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          spaceBetween={16}
          loop
          speed={600}
          style={{ overflow: 'hidden' }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <Link href={cat.href} className="pgc-card">
                <div className="pgc-card-img-wrap">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    quality={95}
                    style={{ objectFit: 'cover' }}
                    sizes="(min-width: 1200px) 240px, (min-width: 992px) 210px, (min-width: 750px) 180px, 150px"
                  />
                </div>
                <span className="pgc-card-label">{cat.label}</span>
                <span className="pgc-card-items">{cat.items} Items</span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        /* ── Mobile base ── */
        .pgc-heading-row {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 520px) {
          .pgc-heading-row {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
          }
          .pgc-arrows { display: none; }
        }
        .pgc-heading {
          font-size: 22px;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
        }
        .pgc-arrows {
          display: flex;
          gap: 8px;
        }
        .pgc-nav-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid #e5e5e5;
          background-color: #fff;
          color: #3a7d44;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 250ms ease, border-color 250ms ease, color 250ms ease;
        }
        .pgc-nav-btn:hover {
          background-color: #3a7d44;
          border-color: #3a7d44;
          color: #fff;
        }

        .pgc-card {
          display: grid;
          grid-template-rows: auto auto auto;
          justify-items: center;
          text-align: center;
          text-decoration: none;
          color: inherit;
          padding: 0;
          transition: transform 250ms ease;
        }
        .pgc-card:hover { transform: translateY(-3px); }

        .pgc-card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 100%;
          margin-bottom: 16px;
          overflow: hidden;
        }
        .pgc-card-img-wrap img {
          transition: transform 500ms ease;
        }
        .pgc-card:hover .pgc-card-img-wrap img {
          transform: scale(1.05);
        }

        .pgc-card-label {
          display: block;
          font-size: 17px;
          font-weight: 700;
          color: #111;
          letter-spacing: -0.1px;
          margin-bottom: 4px;
          transition: color 250ms ease;
        }
        .pgc-card:hover .pgc-card-label { color: #3a7d44; }
        .pgc-card-items {
          display: block;
          font-size: 14px;
          color: #888;
        }

        /* ── ≥ 750px ── */
        @media (min-width: 750px) {
          .pgc-heading { font-size: 26px; }
          .pgc-heading-row { margin-bottom: 28px; }
          .pgc-card-img-wrap { margin-bottom: 18px; }
          .pgc-card-label { font-size: 18px; }
        }

        /* ── ≥ 992px ── */
        @media (min-width: 992px) {
          .pgc-heading { font-size: 30px; }
          .pgc-heading-row { margin-bottom: 32px; }
          .pgc-card-img-wrap { margin-bottom: 20px; }
          .pgc-card-label { font-size: 19px; }
          .pgc-card-items { font-size: 15px; }
          .pgc-nav-btn { width: 40px; height: 40px; }
        }

        /* ── ≥ 1200px ── */
        @media (min-width: 1200px) {
          .pgc-heading { font-size: 32px; }
          .pgc-card-img-wrap { margin-bottom: 22px; }
          .pgc-card-label { font-size: 20px; }
        }
      `}</style>
    </section>
  );
}
