'use client';

import Image from 'next/image';

const ICON = '/single -product/promotion-icon/promotion-icon-1.png';

const stats = [
  { id: 1, value: '30 hours', label: 'Of listening time with the case9' },
  { id: 2, value: '5 hours',  label: 'of listening time on a single charge10' },
  { id: 3, value: '4 hours',  label: 'of listening time with Active Noise Cancellation on a single charge10' },
];

export function SingleProductChargingStats() {
  return (
    <section className="spcst-section">
      <div className="container-main">
        <div className="spcst-grid">
          {stats.map((s) => (
            <div key={s.id} className="spcst-item">
              <span className="spcst-icon">
                <Image src={ICON} alt="" width={48} height={48} style={{ objectFit: 'contain' }} />
              </span>
              <p className="spcst-value">{s.value}</p>
              <p className="spcst-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .spcst-section {
          padding: 0;
          background: #fff;
        }
        .spcst-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(24px, 3vw, 48px);
        }
        .spcst-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          max-width: 320px;
          margin: 0 auto;
        }
        .spcst-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .spcst-value {
          font-size: 28px;
          font-weight: 700;
          color: #111;
          margin: 0;
          line-height: 1.1;
        }
        .spcst-label {
          font-size: 15px;
          font-weight: 400;
          color: rgb(17 17 17 / 75%);
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 749px) {
          .spcst-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </section>
  );
}
