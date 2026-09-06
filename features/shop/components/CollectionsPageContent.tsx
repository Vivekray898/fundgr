'use client';

import Image from 'next/image';
import Link from 'next/link';
import categoriesData from '@/data/categories.json';

export function CollectionsPageContent() {
  return (
    <>
      {/* Page Header */}
      <div style={{ backgroundColor: 'rgb(247, 248, 252)', padding: '20px 0 40px', textAlign: 'center' }}>
        <div className="container-main">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
            <Link href="/" style={{ color: '#777', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Home</Link>
            <span style={{ color: '#bbb' }}>/</span>
            <span style={{ color: '#222' }}>Collections</span>
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 600, color: '#222' }}>Collections</h1>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="container-main" style={{ paddingTop: '50px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', rowGap: '40px' }}>
          {categoriesData.map((category) => (
            <Link
              key={category.id}
              href={`/shop?collection=${category.slug}`}
              className="collection-card"
              style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}
            >
              {/* Image */}
              <div
                className="collection-card-img-wrap"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '470px',
                  backgroundColor: '#f7f7f7',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="collection-card-img"
                  style={{ objectFit: 'contain', objectPosition: 'center', padding: '30px', transition: 'transform 400ms ease' }}
                  sizes="(max-width: 749px) 100vw, 33vw"
                />
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#222', marginBottom: '4px', marginTop: '16px', transition: 'color 200ms ease' }}>
                {category.name}
              </h3>

              {/* Count */}
              <p style={{ fontSize: '14px', color: '#888' }}>
                {category.productCount} Items
              </p>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .collection-card:hover .collection-card-img {
          transform: scale(1.08);
        }
        .collection-card:hover h3 {
          color: #F15B41 !important;
        }
      `}</style>
    </>
  );
}
