'use client';

import Image from 'next/image';
import Link from 'next/link';

interface GroceryCategory {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface GroceryCategoryWithSlug extends GroceryCategory {
  slug: string;
}

const groceryCategories: GroceryCategoryWithSlug[] = [
  { id: 'gc-1', name: 'Fresh Fruits', slug: 'fresh-fruits', image: '/grocery-shop/categories-mega-menu/categories-mega-menu3.webp', productCount: 5 },
  { id: 'gc-2', name: 'Vegetables', slug: 'vegetables', image: '/grocery-shop/categories-mega-menu/categories-mega-menu5.webp', productCount: 2 },
  { id: 'gc-3', name: 'Meats', slug: 'meats', image: '/grocery-shop/categories-slider/categories-slider1.webp', productCount: 2 },
  { id: 'gc-4', name: 'Grocery', slug: 'grocery', image: '/grocery-shop/categories-mega-menu/categories-mega-menu4.webp', productCount: 1 },
  { id: 'gc-5', name: 'Milk & Dairies', slug: 'milk-dairies', image: '/grocery-shop/categories-slider/categories-slider2.webp', productCount: 3 },
];

export function GroceryCollectionsPageContent() {
  return (
    <>
      {/* Page Header */}
      <div style={{ backgroundColor: 'rgb(247, 248, 252)', padding: '20px 0 40px', textAlign: 'center' }}>
        <div className="container-main">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', marginBottom: '16px' }}>
            <Link href="/home/grocery-shop" style={{ color: '#777', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Home</Link>
            <span style={{ color: '#bbb' }}>/</span>
            <span style={{ color: '#222' }}>Categories</span>
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 600, color: '#222' }}>Categories</h1>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="container-main" style={{ paddingTop: '50px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', rowGap: '40px' }}>
          {groceryCategories.map((category) => (
            <Link
              key={category.id}
              href={`/grocery/shop?collection=${category.slug}`}
              className="grocery-collection-card"
              style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}
            >
              {/* Image */}
              <div
                className="grocery-collection-card-img-wrap"
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
                  className="grocery-collection-card-img"
                  style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 400ms ease' }}
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
        .grocery-collection-card:hover .grocery-collection-card-img {
          transform: scale(1.08);
        }
        .grocery-collection-card:hover h3 {
          color: #1B8057 !important;
        }
      `}</style>
    </>
  );
}
