'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ITEMS = [
  {
    id: 'iwt-1',
    title: 'Indoor Gardening Made Easy',
    desc: 'Everything you need to grow thriving plants indoors, from potting mixes to grow lights.',
  },
  {
    id: 'iwt-2',
    title: 'All You Need in One Place!',
    desc: 'Shop our complete range of plants, pots, tools, and accessories in one convenient store.',
  },
  {
    id: 'iwt-3',
    title: 'Fresh Plants for Every Mood',
    desc: 'Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review.',
  },
];

const IMAGES = [
  '/plant-and-garden/tab/tab3.webp',
  '/plant-and-garden/tab/tab1.webp',
  '/plant-and-garden/tab/tab2.webp',
];

function IconArrowUpRight({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={filled ? '#fff' : 'currentColor'} strokeWidth={2} width={18} height={18}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export function PlantGardenImageWithText() {
  const [active, setActive] = useState(2);

  return (
    <section className="pg-iwt">
      <div className="container-main pg-iwt-grid">
        {/* Left card */}
        <div
          className="pg-iwt-left"
          style={{
            backgroundColor: '#eaf2fb',
            borderRadius: '12px',
            padding: 'clamp(28px, 3.5vw, 52px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* POPULAR badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              border: '1.5px solid #555',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#555' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Popular
            </span>
          </div>

          {/* Accordion items */}
          <div style={{ marginBottom: '28px' }}>
            {ITEMS.map((item, i) => (
              <div
                key={item.id}
                style={{ borderTop: '1px solid #d0d9e8', padding: '16px 0' }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', cursor: 'pointer' }}
                  onClick={() => setActive(i)}
                >
                  <span style={{
                    fontSize: 'clamp(16px, 1.5vw, 22px)',
                    fontWeight: 600,
                    color: '#111',
                    lineHeight: 1.3,
                  }}>
                    {item.title}
                  </span>
                  <button
                    aria-label={item.title}
                    style={{
                      width: '36px', height: '36px', flexShrink: 0,
                      borderRadius: '4px',
                      border: active === i ? 'none' : '1.5px solid #aaa',
                      background: active === i ? '#111' : 'transparent',
                      color: active === i ? '#fff' : '#555',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                    }}
                  >
                    <IconArrowUpRight filled={active === i} />
                  </button>
                </div>
                {active === i && (
                  <p style={{ fontSize: 'clamp(12px, 1vw, 14px)', color: '#666', marginTop: '8px', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                )}
              </div>
            ))}
            <div style={{ borderTop: '1px solid #d0d9e8' }} />
          </div>

          <Link
            href="/plant-garden/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#111',
              color: '#fff',
              padding: 'clamp(10px, 1vw, 14px) clamp(20px, 2vw, 28px)',
              fontSize: 'clamp(13px, 1vw, 15px)',
              fontWeight: 600,
              textDecoration: 'none',
              alignSelf: 'flex-start',
              transition: 'background 200ms ease, transform 200ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3a7d44'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#111'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Shop Collection
            <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
              <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" />
            </svg>
          </Link>
        </div>

        {/* Right image */}
        <div
          className="pg-iwt-right"
          style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', minHeight: 'clamp(300px, 40vw, 520px)' }}
        >
          <Image
            src={IMAGES[active]}
            alt={ITEMS[active].title}
            fill
            style={{ objectFit: 'cover', transition: 'opacity 400ms ease' }}
            sizes="(max-width: 749px) 100vw, 50vw"
          />
        </div>
      </div>

      <style>{`
        .pg-iwt-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(20px, 2.5vw, 36px);
        }
        @media (min-width: 750px) {
          .pg-iwt-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </section>
  );
}
