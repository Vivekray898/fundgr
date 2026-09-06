'use client';

import Image from 'next/image';
import Link from 'next/link';

const banners = [
  {
    id: 'banner-1',
    image: '/fashion/banners/banners1.png',
    title: 'Elevated Styles for Women',
    description: 'Explore sophisticated pieces designed for the modern woman.',
    href: '/shop',
  },
  {
    id: 'banner-2',
    image: '/fashion/banners/banners2.png',
    title: 'Shipt Cotton Crop Top',
    description: 'Explore sophisticated pieces designed for the modern woman.',
    href: '/shop',
  },
  {
    id: 'banner-3',
    image: '/fashion/banners/banners3.png',
    title: 'Explore Trendy Accessories',
    description: 'Explore sophisticated pieces designed for the modern woman.',
    href: '/shop',
  },
];

export function BannerList() {
  return (
    <section>
      <div className="container-main">
        <div className="banner-list-grid">
          {banners.map((banner) => (
            <div key={banner.id}>
              {/* Image */}
              <div
                className="bl-img-wrap"
                style={{
                  position: 'relative',
                  height: '600px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#f5f5f5',
                  marginBottom: '24px',
                }}
              >
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="bl-img"
                  style={{ objectFit: 'cover', objectPosition: 'center top', transition: 'transform 500ms ease' }}
                  sizes="33vw"
                />
              </div>

              {/* Content — centered */}
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#222', marginBottom: '8px' }}>
                  {banner.title}
                </h3>
                <p style={{ fontSize: '16px', color: '#777', lineHeight: 1.6, marginBottom: '14px' }}>
                  {banner.description}
                </p>
                <Link
                  href={banner.href}
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#222',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                    transition: 'color 250ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#F15B41'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#222'; }}
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .banner-list-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 750px) {
          .banner-list-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
        }
        @media (min-width: 992px) {
          .banner-list-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
        }

        .bl-img-wrap:hover .bl-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
