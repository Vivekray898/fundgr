'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HOTSPOTS = [
  {
    id: 'hs-1',
    top: '18%',
    left: '19%',
    product: 'Hanging Basket Macrame',
    price: '$28.00',
    href: '/plant-garden/product/hanging-basket-macrame',
  },
  {
    id: 'hs-2',
    top: '12%',
    left: '52%',
    product: 'Watering Can Copper',
    price: '$48.00',
    href: '/plant-garden/product/watering-can-copper',
  },
  {
    id: 'hs-3',
    top: '42%',
    left: '80%',
    product: 'Monstera Outdoor Giant',
    price: '$85.00',
    href: '/plant-garden/product/monstera-outdoor-giant',
  },
];

export function PlantGardenLookbook() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section className="pg-lookbook">
      <div
        className="pg-lookbook-container"
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/plant-and-garden/lookbook-hotspot/lookbook-hotspot1.webp"
          alt="Plant lookbook"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          sizes="100vw"
        />

        {/* Hotspot dots */}
        {HOTSPOTS.map((hs) => (
          <div
            key={hs.id}
            style={{ position: 'absolute', top: hs.top, left: hs.left, zIndex: 5 }}
            onMouseEnter={() => setActiveHotspot(hs.id)}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            {/* Pulsing dot */}
            <div className="pg-hotspot-dot">
              <span className="pg-hotspot-ring" />
              <span className="pg-hotspot-inner" />
            </div>

            {/* Popup tooltip */}
            {activeHotspot === hs.id && (
              <Link
                href={hs.href}
                className="pg-hotspot-popup"
                style={{
                  position: 'absolute',
                  bottom: '120%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  animation: 'pgPopupIn 200ms ease forwards',
                  display: 'block',
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#111', margin: '0 0 2px' }}>{hs.product}</p>
                <p style={{ fontSize: '13px', color: '#3a7d44', fontWeight: 700, margin: 0 }}>{hs.price}</p>
              </Link>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .pg-lookbook-container {
          height: 690px;
        }
        @media (max-width: 992px) {
          /* Gradually shrinks from 690px at 992px ? 360px at ~518px */
          .pg-lookbook-container {
            height: clamp(360px, 69.5vw, 690px);
          }
        }
        .pg-hotspot-dot {
          position: relative;
          width: 32px;
          height: 32px;
          cursor: pointer;
          transform: translate(-50%, -50%);
        }
        .pg-hotspot-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(210, 90, 80, 0.25);
          animation: pgHotspotPulse 2s ease-in-out infinite;
        }
        .pg-hotspot-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #d25a50;
          border: 2.5px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }
        @keyframes pgHotspotPulse {
          0%   { transform: scale(1); opacity: 0.7; }
          50%  { transform: scale(1.6); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.7; }
        }
        @keyframes pgPopupIn {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </section>
  );
}
