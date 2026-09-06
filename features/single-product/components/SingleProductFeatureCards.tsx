'use client';

import Image from 'next/image';

const cards = [
  {
    id: 'usbc',
    title: 'Easy as USB-C.',
    description: 'Both AirPods 4 models now come with USB-C Charging capabilities.',
    image: '/single -product/banner/banner-1.webp',
  },
  {
    id: 'wireless',
    title: 'New wireless options.',
    description: 'The newly released AirPods 4 bring fresh charging options And advanced noise control.',
    image: '/single -product/banner/banner-2.webp',
  },
];

export function SingleProductFeatureCards() {
  return (
    <section className="spfc-section">
      <div className="container-main">
        <div className="spfc-grid">
          {cards.map((card) => (
            // inline position/height — the banner image IS the background; no extra color
            <div
              key={card.id}
              className="spfc-card"
              style={{
                position: 'relative',
                height: '460px',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="spfc-img"
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 749px) 100vw, 50vw"
              />
              {/* Content — bottom-left */}
              <div
                className="spfc-text"
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  padding: 'clamp(28px, 3vw, 44px)',
                  maxWidth: '80%',
                }}
              >
                <h3 className="spfc-title">{card.title}</h3>
                <p className="spfc-desc">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plain <style> — no jsx — keeps positioning inline (SSR-safe for Image fill) */}
      <style>{`
        .spfc-section { background: #fff; }
        .spfc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(16px, 2vw, 28px);
        }
        /* hover zoom on the banner image */
        .spfc-img {
          transition: transform 0.6s ease;
        }
        .spfc-card:hover .spfc-img {
          transform: scale(1.05);
        }
        .spfc-title {
          font-size: 28px;
          font-weight: 700;
          color: rgb(3, 76, 76);
          margin: 0 0 12px;
          line-height: 1.2;
        }
        .spfc-desc {
          font-size: 17px;
          color: rgb(3, 76, 76);
          margin: 0;
          line-height: 1.55;
        }

        @media (max-width: 749px) {
          .spfc-grid { grid-template-columns: 1fr; }
          .spfc-card { height: 380px !important; }
          .spfc-title { font-size: 24px; }
          .spfc-desc { font-size: 15px; }
        }
      `}</style>
    </section>
  );
}
