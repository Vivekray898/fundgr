'use client';

import Image from 'next/image';

const IMG_BASE = '/single -product/img-with-featured-list';

/* ── Data ────────────────────────────────────────────────────── */
const leftFeatures = [
  { id: 'noise',   title: 'Noise-Canceling',  desc: 'Equipped with active noise-cancellation technology.',                  icon: `${IMG_BASE}/img-with-featured-list-1.png` },
  { id: 'spatial', title: 'Spatial Audio',     desc: 'High-fidelity headphones designed for professional audio production.', icon: `${IMG_BASE}/img-with-featured-list-3.png` },
];

const rightFeatures = [
  { id: 'wireless', title: 'Wireless Headphones', desc: 'Use Bluetooth wireless technologies and freedom of movement.', icon: `${IMG_BASE}/img-with-featured-list-2.webp` },
  { id: 'hearing',  title: 'Hearing Compatible',  desc: 'They work seamlessly with hearing are aids.',                 icon: `${IMG_BASE}/img-with-featured-list-4.png` },
];

/* ── Feature card — icon on top, title, description (all left-aligned) ── */
function FeatureCard({
  title, desc, icon,
}: {
  title: string; desc: string; icon: string;
}) {
  return (
    <div className="spfh-card">
      <span className="spfh-icon">
        <Image src={icon} alt={title} width={46} height={46} style={{ objectFit: 'contain' }} />
      </span>
      <h3 className="spfh-ftitle">{title}</h3>
      <p className="spfh-fdesc">{desc}</p>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export function SingleProductFeatureHighlights() {
  return (
    <section className="spfh-section">
      <div className="container-main">

        {/* Heading */}
        <div className="spfh-head">
          <h2 className="spfh-htitle">Best Sound Quality</h2>
          <p className="spfh-hsub">
            Personalized audio, seamless control, and unrivaled clarity with AirPods Pro.
          </p>
        </div>

        {/* 3-col grid: left features | center image | right features */}
        <div className="spfh-grid">

          {/* Left column */}
          <div className="spfh-col">
            {leftFeatures.map((f) => (
              <FeatureCard key={f.id} {...f} />
            ))}
          </div>

          {/* Center image — inline style required for <Image fill> parent */}
          <div
            className="spfh-img"
            style={{ position: 'relative', height: 'clamp(260px, 34vw, 470px)' }}
          >
            <Image
              src="/single -product/img-with-featured-list/img-with-featured-list-5.webp"
              alt="AirPods Pro"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 749px) 80vw, 38vw"
            />
          </div>

          {/* Right column */}
          <div className="spfh-col">
            {rightFeatures.map((f) => (
              <FeatureCard key={f.id} {...f} />
            ))}
          </div>

        </div>
      </div>

      {/* Plain <style> — no jsx — avoids scoping-hash failures */}
      <style>{`
        .spfh-section {
          padding: 0;
          background: #fff;
        }

        /* Heading */
        .spfh-head {
          text-align: center;
          margin-bottom: clamp(40px, 6vw, 80px);
        }
        .spfh-htitle {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 700;
          color: #111;
          margin: 0 0 14px;
        }
        .spfh-hsub {
          font-size: clamp(13px, 1.1vw, 16px);
          font-weight: 400;
          color: #647196;
          margin: 0;
          line-height: 1.6;
        }

        /* Grid */
        .spfh-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          gap: clamp(24px, 3.5vw, 56px);
          align-items: center;
        }

        /* Feature columns */
        .spfh-col {
          display: flex;
          flex-direction: column;
          gap: clamp(40px, 5vw, 64px);
        }

        /* Feature card — vertical stack, left-aligned */
        .spfh-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        /* Icon badge (image already includes the colored circle) */
        .spfh-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          margin-bottom: 18px;
        }

        /* Feature title */
        .spfh-ftitle {
          font-size: clamp(16px, 1.4vw, 19px);
          font-weight: 700;
          color: #111;
          margin: 0 0 10px;
        }

        /* Feature description */
        .spfh-fdesc {
          font-size: clamp(13px, 1.05vw, 15px);
          font-weight: 400;
          color: #647196;
          margin: 0;
          line-height: 1.6;
          max-width: 300px;
        }

        /* ── Mobile ─────────────────────────────────────────── */
        @media (max-width: 749px) {
          .spfh-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px 24px;
          }
          /* image spans full width on top */
          .spfh-img {
            order: -1;
            grid-column: 1 / -1;
            height: clamp(220px, 60vw, 320px) !important;
          }
          .spfh-col { gap: 36px; }
          .spfh-fdesc { max-width: none; }
        }

        @media (max-width: 459px) {
          .spfh-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
