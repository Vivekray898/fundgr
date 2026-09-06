'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import blogPosts from '@/data/blog.json';
import type { BlogPost } from '@/types/common';

import 'swiper/css';

const data = blogPosts as BlogPost[];

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

/* ── Component ── */

export function LatestBlog() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <section className="blog-section" style={{ backgroundColor: '#fff' }}>
      <div className="container-main">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 600, color: '#222' }}>Latest Blog</h2>
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
                  <div className="blog-card" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', height: '500px', display: 'flex', flexDirection: 'column' }}>
                  {/* Image */}
                  <Link href={`/blog/${post.slug}`} style={{ display: 'block', position: 'relative', flex: 1, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
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
                      href={`/blog/${post.slug}`}
                      className="blog-card-title"
                      style={{
                        display: 'inline',
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#222',
                        textDecoration: 'none',
                        lineHeight: 1.5,
                        backgroundImage: 'linear-gradient(#222, #222)',
                        backgroundSize: '0% 1.5px',
                        backgroundPosition: '0 100%',
                        backgroundRepeat: 'no-repeat',
                        transition: 'background-size 400ms ease',
                      }}
                    >
                      {post.title}
                    </Link>

                    <div style={{ marginTop: '14px' }}>
                      <Link
                        href={`/blog/${post.slug}`}
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
        .blog-nav-prev { left: 8px; transform: translateY(-50%); }
        .blog-nav-next { right: 8px; transform: translateY(-50%); }

        .blog-section:hover .blog-nav-prev { opacity: 1; }
        .blog-section:hover .blog-nav-next { opacity: 1; }

        .blog-nav-prev:hover,
        .blog-nav-next:hover { background-color: #000; border-color: #000; color: #fff; }
      `}</style>
    </section>
  );
}
