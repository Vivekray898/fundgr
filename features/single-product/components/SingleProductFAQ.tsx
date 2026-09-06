'use client';

import { useState } from 'react';
import Image from 'next/image';

const FAQS = [
  {
    id: 1,
    question: 'What are headphones?',
    answer:
      'Open-back headphones have perforated ear cups that allow sound to escape, providing a more open and natural soundstage. Closed-back headphones have sealed ear cups, isolating you from external noise and offering more privacy.',
  },
  {
    id: 2,
    question: 'What are the different types of headphones?',
    answer:
      'There are several types including over-ear (circum-aural), on-ear (supra-aural), in-ear (earbuds), true wireless, and bone-conduction headphones. Each offers different trade-offs between audio quality, comfort, noise isolation, and portability.',
  },
  {
    id: 3,
    question: "What's the difference between open-back and closed-back headphones?",
    answer:
      'Open-back headphones allow air and sound to pass through the ear cups, creating a spacious, natural sound. Closed-back headphones seal the ear cups, providing better noise isolation and more bass impact — ideal for recording or noisy environments.',
  },
  {
    id: 4,
    question: 'Are wireless headphones better than wired ones?',
    answer:
      'Wireless headphones offer convenience and freedom of movement, while wired headphones generally provide lower latency and no battery dependency. For critical listening, many audiophiles still prefer wired, but modern Bluetooth codecs like aptX and AAC narrow the gap significantly.',
  },
  {
    id: 5,
    question: 'What is active noise cancellation (ANC)?',
    answer:
      'Active Noise Cancellation uses microphones to pick up ambient sound and generates an equal but opposite sound wave, effectively cancelling out background noise before it reaches your ears. It\'s especially effective on low-frequency sounds like airplane engines or HVAC systems.',
  },
];

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={24} height={24} style={{ flexShrink: 0 }}>
      {open ? (
        <path d="M5 11H19V13H5V11Z" />
      ) : (
        <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" />
      )}
    </svg>
  );
}

export function SingleProductFAQ() {
  const [open, setOpen] = useState<number | null>(1);

  const toggle = (id: number) => setOpen((prev) => (prev === id ? null : id));

  return (
    <section className="spfaq-section">
      <div className="container-main">
        {/* Centered heading above both columns */}
        <h2 className="spfaq-title">Common Question</h2>

        <div className="spfaq-inner">
          {/* Left: image — 640px, inline for SSR-safe Image fill */}
          <div
            className="spfaq-img-wrap"
            style={{ position: 'relative', height: '640px', borderRadius: '12px', overflow: 'hidden' }}
          >
            <Image
              src="/single -product/faq/tab-img-1.webp"
              alt="Common Questions"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 749px) 90vw, 45vw"
            />
          </div>

          {/* Right: accordion */}
          <div className="spfaq-accordion">
            {FAQS.map((faq) => {
              const isOpen = open === faq.id;
              return (
                <div key={faq.id} className="spfaq-item">
                  <button
                    className="spfaq-question"
                    onClick={() => toggle(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.id}. {faq.question}</span>
                    <ToggleIcon open={isOpen} />
                  </button>
                  <div
                    className="spfaq-answer-wrap"
                    style={{
                      display: 'grid',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      transition: 'grid-template-rows 350ms cubic-bezier(0.25,0.46,0.45,0.94)',
                    }}
                  >
                    <div className="spfaq-answer-inner">
                      <p className="spfaq-answer">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .spfaq-section {
          padding: 0;
          background: #fff;
        }
        .spfaq-title {
          font-size: clamp(24px, 2.6vw, 32px);
          font-weight: 700;
          color: #111;
          text-align: center;
          margin: 0 0 clamp(32px, 4vw, 52px);
        }
        .spfaq-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 4vw, 72px);
          align-items: start;
        }
        .spfaq-accordion {
          display: flex;
          flex-direction: column;
        }
        /* vertically centre the accordion within the 640px image height */
        @media (min-width: 992px) {
          .spfaq-accordion {
            min-height: 640px;
            justify-content: center;
          }
        }
        .spfaq-question {
          width: 100%;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: none;
          border: none;
          /* divider sits directly under the question heading */
          border-bottom: 1px solid #e5e5e5;
          padding: 0;
          font-size: 24px;
          font-weight: 700;
          color: #111;
          cursor: pointer;
          text-align: left;
          line-height: 1.4;
        }
        /* No hover effect — heading stays unchanged on hover */
        .spfaq-answer-wrap {
          overflow: hidden;
        }
        .spfaq-answer-inner {
          overflow: hidden;
          min-height: 0;
        }
        .spfaq-answer {
          font-size: 15px;
          color: #647196;
          line-height: 1.75;
          margin: 0;
          padding: 18px 0 6px;
        }

        @media (max-width: 749px) {
          .spfaq-inner {
            grid-template-columns: 1fr;
          }
          .spfaq-img-wrap {
            height: clamp(320px, 80vw, 480px) !important;
          }
          .spfaq-question {
            font-size: 18px;
            height: 80px;
          }
        }
      `}</style>
    </section>
  );
}
