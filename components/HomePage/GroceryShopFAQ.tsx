'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(3);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const isFirst = i === 0;
        const isLast = i === items.length - 1;
        return (
          <div key={i} style={{ borderTop: isFirst ? 'none' : '1px solid #e5e5e5', borderBottom: isLast ? 'none' : undefined }}>
            <button
              onClick={() => toggle(i)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '22px 0', fontSize: '24px', fontWeight: 600,
                color: '#222', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', gap: '16px',
              }}
            >
              <span style={{ flex: 1 }}>{item.question}</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, width: '24px', height: '24px', position: 'relative',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 10 10" width="20" height="20"
                  style={{ position: 'absolute', transition: 'opacity 350ms ease, transform 350ms ease', opacity: isOpen ? 0 : 1, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 10 2" width="20" height="20"
                  style={{ position: 'absolute', transition: 'opacity 350ms ease, transform 350ms ease', opacity: isOpen ? 1 : 0, transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                  <path fillRule="evenodd" clipRule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor" />
                </svg>
              </span>
            </button>
            <div
              ref={(el) => { faqRefs.current[i] = el; }}
              style={{
                maxHeight: isOpen ? `${faqRefs.current[i]?.scrollHeight || 500}px` : '0',
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              <div style={{ paddingBottom: '22px', fontSize: '14px', color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const FAQ_ITEMS = [
  {
    question: 'How fresh are your groceries?',
    answer: 'All produce, dairy, and meat are sourced daily from local farms and trusted suppliers. Perishables are refrigerated the entire journey and picked the morning of your delivery so they arrive at peak freshness.',
  },
  {
    question: 'What are your delivery areas and times?',
    answer: 'We currently deliver across the metro area seven days a week, from 8:00 AM to 10:00 PM. Choose a one-hour slot at checkout, and our team will bring your order straight to your door.',
  },
  {
    question: 'What happens if an item is out of stock?',
    answer: 'If something on your list is unavailable, our shoppers will select the closest equivalent at the same or lower price. You can also opt out of substitutions in your cart settings and we will simply refund the missing item.',
  },
  {
    question: 'What is your return and refund policy?',
    answer: '1. If any item arrives damaged, expired, or not as described, contact us within 24 hours and we will issue a full refund or free replacement — no need to return the product.\n\n2. For non-perishable goods, unopened items can be returned within 7 days of delivery for a full refund.',
  },
];

export function GroceryShopFAQ() {
  return (
    <section className="gsf-section">
      <div className="container-main" style={{ padding: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 600, color: '#222', marginBottom: '8px' }}>F.A.Q.</h2>
          <p style={{ fontSize: '14px', color: '#888' }}>Explore additional details in our FAQ section</p>
        </div>

        <div className="gsf-grid">
          <div className="gsf-accordion-col">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
          <div className="gsf-image-col">
            <Image
              src="/grocery-shop/faq/faq1.webp"
              alt="FAQ section"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              sizes="(min-width: 992px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>

      <style>{`
        .gsf-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: stretch;
        }
        .gsf-accordion-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .gsf-image-col {
          position: relative;
          width: 100%;
          height: 360px;
          overflow: hidden;
        }
        @media (min-width: 992px) {
          .gsf-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0;
          }
          .gsf-accordion-col {
            padding-right: 60px;
            min-height: 750px;
          }
          .gsf-image-col {
            height: 750px;
          }
        }
      `}</style>
    </section>
  );
}
