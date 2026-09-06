'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';

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

interface PgBlogPost {
  id: string;
  title: string;
  slug: string;
  image: string;
}

const data: PgBlogPost[] = [
  {
    id: 'pg-blog-1',
    slug: 'container-gardening-bringing-nature-to-your-balcony-patio',
    title: 'Container Gardening: Bringing Nature to Your Balcony Patio',
    image: '/plant-and-garden/blog/blog2.webp',
  },
  {
    id: 'pg-blog-2',
    slug: 'garden-therapy-how-plants-can-improve-your-wellbeing',
    title: 'Garden Therapy: How Plants Can Improve Your Wellbeing',
    image: '/plant-and-garden/blog/blog3.webp',
  },
  {
    id: 'pg-blog-3',
    slug: 'harvesting-happiness-the-benefits-of-a-home-garden',
    title: 'Harvesting Happiness: The Benefits of a Home Garden',
    image: '/plant-and-garden/blog/blog1.webp',
  },
  {
    id: 'pg-blog-4',
    slug: 'plant-care-tips-keeping-your-indoor-plants-thriving',
    title: 'Plant Care Tips: Keeping Your Indoor Plants Thriving',
    image: '/plant-and-garden/blog/blog3.webp',
  },
  {
    id: 'pg-blog-5',
    slug: 'best-plants-for-beginners-easy-care-low-maintenance',
    title: 'Best Plants for Beginners: Easy Care, Low Maintenance',
    image: '/plant-and-garden/blog/blog1.webp',
  },
  {
    id: 'pg-blog-6',
    slug: 'seasonal-garden-guide-what-to-plant-each-month',
    title: 'Seasonal Garden Guide: What to Plant Each Month',
    image: '/plant-and-garden/blog/blog2.webp',
  },
];

export function PlantGardenBlog() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="pgb-section" style={{ backgroundColor: '#fff' }}>
      <div className="container-main">
        <div className="pgb-heading-wrap">
          <h2 className="pgb-heading">Latest Blog</h2>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ overflow: 'hidden', padding: '8px 0 14px' }}>
            <Swiper
              modules={[Navigation]}
              onSwiper={(s) => { swiperRef.current = s; }}
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
                  <div className="pgb-card">
                    <Link href={`/plant-garden/blog/${post.slug}`} style={{ display: 'block', position: 'relative', flex: 1, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="pgb-card-img"
                        style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
                        sizes="(max-width: 749px) 100vw, 33vw"
                      />
                    </Link>

                    <div style={{ padding: '20px 20px 24px' }}>
                      <Link href={`/plant-garden/blog/${post.slug}`} className="pgb-card-title">
                        {post.title}
                      </Link>

                      <div style={{ marginTop: '14px' }}>
                        <Link
                          href={`/plant-garden/blog/${post.slug}`}
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

          <button onClick={() => swiperRef.current?.slidePrev()} aria-label="Previous" className="pgb-nav-prev">
            <IconArrowLeftS size={20} />
          </button>
          <button onClick={() => swiperRef.current?.slideNext()} aria-label="Next" className="pgb-nav-next">
            <IconArrowRightS size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .pgb-heading-wrap {
          text-align: center;
          margin-bottom: 40px;
        }
        .pgb-heading {
          font-size: 24px;
          font-weight: 600;
          color: #222;
        }

        .pgb-card {
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border-radius: 10px;
          overflow: hidden;
          background-color: #fff;
          height: 420px;
          display: flex;
          flex-direction: column;
        }

        .pgb-card-title {
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

        .pgb-card:hover .pgb-card-img { transform: scale(1.05); }
        .pgb-card:hover .pgb-card-title { background-size: 100% 1.5px !important; }

        .pgb-nav-prev,
        .pgb-nav-next {
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
        .pgb-nav-prev { left: -10px; transform: translateY(-50%) translateX(-20px); }
        .pgb-nav-next { right: -10px; transform: translateY(-50%) translateX(20px); }

        .pgb-section:hover .pgb-nav-prev { opacity: 1; transform: translateY(-50%) translateX(0); }
        .pgb-section:hover .pgb-nav-next { opacity: 1; transform: translateY(-50%) translateX(0); }

        .pgb-nav-prev:hover,
        .pgb-nav-next:hover { background-color: #3a7d44; border-color: #3a7d44; color: #fff; }

        @media (max-width: 749px) {
          .pgb-nav-prev { left: 8px; opacity: 1; pointer-events: auto; transform: translateY(-50%) translateX(0); }
          .pgb-nav-next { right: 8px; opacity: 1; pointer-events: auto; transform: translateY(-50%) translateX(0); }
        }

        @media (min-width: 750px) {
          .pgb-heading { font-size: 28px; }
          .pgb-card { height: 460px; }
          .pgb-card-title { font-size: 20px; }
        }

        @media (min-width: 992px) {
          .pgb-heading { font-size: 32px; }
          .pgb-card { height: 500px; }
          .pgb-card-title { font-size: 24px; }
          .pgb-nav-prev { left: -22px; }
          .pgb-nav-next { right: -22px; }
        }
      `}</style>
    </section>
  );
}
