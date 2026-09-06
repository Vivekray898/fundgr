import Image from 'next/image';

const ICON_BASE = '/single -product/promotion-icon';

const badges = [
  { title: 'Free Shipping & Return', subtitle: 'Free shipping for all orders over $135', src: `${ICON_BASE}/icon 1.webp` },
  { title: 'Customer Support 24/7', subtitle: 'Instant access to perfect support everyday', src: `${ICON_BASE}/icon2.webp` },
  { title: '100% Secure Payment', subtitle: 'We ensure secure payment for customers', src: `${ICON_BASE}/icon3.png` },
];

export function SingleProductTrustGrid() {
  return (
    <section className="sptb container-main">
      {badges.map(({ title, subtitle, src }, i) => (
        <div key={i} className="sptb-card">
          <div className="sptb-icon">
            <Image src={src} alt={title} width={50} height={50} style={{ objectFit: 'contain' }} />
          </div>
          <div className="sptb-text">
            <strong className="sptb-title">{title}</strong>
            <span className="sptb-sub">{subtitle}</span>
          </div>
        </div>
      ))}

      <style>{`
        .sptb {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(12px, 2vw, 24px);
          padding-block: 0;
          /* exactly 80px below this (last) section before the footer */
          margin-bottom: 80px;
        }
        .sptb-card {
          display: flex;
          align-items: center;
          gap: clamp(12px, 1.5vw, 18px);
          background: rgb(248, 250, 251);
          border-radius: 12px;
          padding: clamp(18px, 2.4vw, 28px) clamp(20px, 2.4vw, 30px);
        }
        .sptb-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sptb-text {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .sptb-title {
          font-size: 19px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.3;
        }
        .sptb-sub {
          font-size: 15px;
          color: #647196;
          line-height: 1.5;
        }
        @media (max-width: 749px) {
          .sptb { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
