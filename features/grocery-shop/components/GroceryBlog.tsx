'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

/* ── Nav Icons ── */

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

/* ── Grocery blog data (content swapped from Fashion) ── */

interface GroceryBlogPost {
  id: string;
  title: string;
  slug: string;
  image: string;
}

const data: GroceryBlogPost[] = [
  { id: 'gb-1', title: 'Grocery store is to provide customers with range food', slug: 'grocery-store-range-food', image: '/grocery-shop/blog/blog1.webp' },
  { id: 'gb-2', title: 'Healthy fresh vegetables are nutrient-rich Fresh foods', slug: 'healthy-fresh-vegetables', image: '/grocery-shop/blog/blog2.webp' },
  { id: 'gb-3', title: 'Fresh vegetables are versatile and can be eaten raw, steamed', slug: 'fresh-vegetables-versatile', image: '/grocery-shop/blog/blog3.webp' },
  { id: 'gb-4', title: 'Seasonal produce every home cook should have on the shelf', slug: 'seasonal-produce-home-cook', image: '/grocery-shop/blog/blog1.webp' },
  { id: 'gb-5', title: 'How to pick the best organic fruits for your weekly haul', slug: 'best-organic-fruits-weekly-haul', image: '/grocery-shop/blog/blog2.webp' },
  { id: 'gb-6', title: 'Farm-to-table pantry essentials you need this season', slug: 'farm-to-table-pantry-essentials', image: '/grocery-shop/blog/blog3.webp' },
];

/* ── Component ── */

export function GroceryBlog() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <section className="blog-section" style={{ backgroundColor: '#fff' }}>
      <div className="container-main">
        {/* Heading */}
        <div className="blog-heading-wrap">
          <h2 className="blog-heading">Latest Blog</h2>
        </div>

        {/* Slider */}
        <div style={{ position: 'relative' }}>
          <div style={{ overflow: 'hidden', padding: '8px 0 14px' }}>
            <Swiper
              modules={[Navigation]}
              onSwiper={setSwiperInstance}
              slidesPerView={1}
              breakpoints={{
                750: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
              }}
              spaceBetween={24}
              loop
              speed={600}
              style={{ overflow: 'visible' }}
            >
              {data.map((post) => (
                <SwiperSlide key={post.id}>
                  <div className="blog-card">
                  {/* Image */}
                  <Link href={`/grocery/blog/${post.slug}`} style={{ display: 'block', position: 'relative', flex: 1, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="blog-card-img"
                      style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
                      sizes="(max-width: 749px) 100vw, 33vw"
                    />
                  </Link>

                  {/* Content */}
                  <div style={{ padding: '20px 20px 24px' }}>
                    <Link
                      href={`/grocery/blog/${post.slug}`}
                      className="blog-card-title"
                    >
                      {post.title}
                    </Link>

                    <div style={{ marginTop: '14px' }}>
                      <Link
                        href={`/grocery/blog/${post.slug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#222',
                          textDecoration: 'none',
                        }}
                      >
                        Load more
                        <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
                          <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          </div>

          {/* Nav arrows — same as Categories, hidden by default */}
          <button onClick={() => swiperInstance?.slidePrev()} aria-label="Previous" className="blog-nav-prev">
            <IconArrowLeftS size={20} />
          </button>
          <button onClick={() => swiperInstance?.slideNext()} aria-label="Next" className="blog-nav-next">
            <IconArrowRightS size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .blog-heading-wrap {
          text-align: center;
          margin-bottom: 40px;
        }
        .blog-heading {
          font-size: 24px;
          font-weight: 600;
          color: #222;
        }

        .blog-card {
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border-radius: 10px;
          overflow: hidden;
          background-color: #fff;
          height: 420px;
          display: flex;
          flex-direction: column;
        }

        .blog-card-title {
          display: inline;
          font-size: 18px;
          font-weight: 600;
          color: #222;
          text-decoration: none;
          line-height: 1.5;
          background-image: linear-gradient(#222, #222);
          background-size: 0% 1.5px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 400ms ease;
        }

        .blog-card:hover .blog-card-img {
          transform: scale(1.05);
        }

        .blog-card:hover .blog-card-title {
          background-size: 100% 1.5px !important;
        }

        .blog-nav-prev,
        .blog-nav-next {
          position: absolute;
          top: 35%;
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
        .blog-nav-prev { left: 8px; transform: translateY(-50%) translateX(-12px); }
        .blog-nav-next { right: 8px; transform: translateY(-50%) translateX(12px); }

        .blog-section:hover .blog-nav-prev { opacity: 1; transform: translateY(-50%) translateX(0); }
        .blog-section:hover .blog-nav-next { opacity: 1; transform: translateY(-50%) translateX(0); }

        .blog-nav-prev:hover,
        .blog-nav-next:hover { background-color: #000; border-color: #000; color: #fff; }

        @media (min-width: 750px) {
          .blog-heading { font-size: 28px; }
          .blog-card { height: 460px; }
          .blog-card-title { font-size: 20px; }
        }

        @media (min-width: 992px) {
          .blog-heading { font-size: 32px; }
          .blog-card { height: 500px; }
          .blog-card-title { font-size: 24px; }
        }
      `}</style>
    </section>
  );
}
