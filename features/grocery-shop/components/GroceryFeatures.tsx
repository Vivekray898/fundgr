'use client';

function IconShippingBox({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M30 8.5L48.5 18.5V39.5L30 50L11.5 39.5V18.5L30 8.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 18.5L30 29L48.5 18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 29V50"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="44" cy="43" r="8" fill="white" stroke="currentColor" strokeWidth="2" />
      <path
        d="M40 43L43 46L48 39.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHeadphones({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 34C11 21.2975 19.5 12.5 30 12.5C40.5 12.5 49 21.2975 49 34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 34V44C11 46.2091 12.7909 48 15 48H18C20.2091 48 22 46.2091 22 44V34C22 31.7909 20.2091 30 18 30H15C12.7909 30 11 31.7909 11 34Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M49 34V44C49 46.2091 47.2091 48 45 48H42C39.7909 48 38 46.2091 38 44V34C38 31.7909 39.7909 30 42 30H45C47.2091 30 49 31.7909 49 34Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 25L27.5 28L30 21L32.5 28L35 25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShieldCheck({ size = 60 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26.225 5.57502L13.75 10.275C10.875 11.35 8.52502 14.75 8.52502 17.8V36.375C8.52502 39.325 10.475 43.2 12.85 44.975L23.6 53C27.125 55.65 32.925 55.65 36.45 53L47.2 44.975C49.575 43.2 51.525 39.325 51.525 36.375V17.8C51.525 14.725 49.175 11.325 46.3 10.25L33.825 5.57502C31.7 4.80002 28.3 4.80002 26.225 5.57502Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.625 29.6751L26.65 33.7001L37.4 22.9501"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const features = [
  {
    id: 'shipping',
    icon: <IconShippingBox size={60} />,
    title: 'Free Shipping & Return',
    description: 'Free Shipping for all order over $100',
  },
  {
    id: 'support',
    icon: <IconHeadphones size={60} />,
    title: 'Customer Support 24/7',
    description: 'Instant access to perfect support everyday',
  },
  {
    id: 'secure',
    icon: <IconShieldCheck size={60} />,
    title: '100% Secure Payment',
    description: 'We ensure secure payment for customers',
  },
];

export function GroceryFeatures() {
  return (
    <section className="gf-section">
      <div className="container-main">
        <div className="gf-grid">
          {features.map((item) => (
            <div key={item.id} className="gf-item">
              <div className="gf-icon">{item.icon}</div>
              <h3 className="gf-title">{item.title}</h3>
              <p className="gf-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .gf-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .gf-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 16px 12px;
          transition: transform 400ms ease;
        }
        .gf-item:hover {
          transform: translateY(-4px);
        }

        .gf-icon {
          color: #222;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms ease;
        }
        .gf-item:hover .gf-icon {
          color: rgb(27, 128, 87);
          transform: scale(1.08);
        }

        .gf-title {
          font-size: 18px;
          font-weight: 700;
          color: #222;
          margin-bottom: 8px;
          letter-spacing: -0.1px;
          transition: color 300ms ease;
        }
        .gf-item:hover .gf-title {
          color: rgb(27, 128, 87);
        }

        .gf-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
          max-width: 280px;
        }

        @media (min-width: 750px) {
          .gf-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
        }

        @media (min-width: 992px) {
          .gf-grid { grid-template-columns: repeat(3, 1fr); gap: 30px; }
          .gf-item { padding: 20px 12px; }
          .gf-icon { margin-bottom: 22px; }
          .gf-title { font-size: 18px; }
        }
      `}</style>
    </section>
  );
}
