'use client';

const items = [
  { text: 'Free Gift Shipping', stroke: true },
  { text: 'Free Returns Within 30 Days', stroke: false },
  { text: 'Free Gift Wrapping', stroke: true },
  { text: 'Buy More, Save More', stroke: false },
];

function IconBolt() {
  return (
    <svg
      className="icon icon-accordion"
      aria-hidden="true"
      focusable={false}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      style={{ width: 32, height: 32, flexShrink: 0 }}
    >
      <path d="M14.6792 0.161747C14.8796 0.280525 14.9715 0.522024 14.9006 0.743992L12.5162 8.21151L16.6937 9.21166C16.8685 9.2535 17.0074 9.38595 17.0575 9.55856C17.1076 9.73117 17.0612 9.91739 16.936 10.0463L7.56282 19.6949C7.39667 19.8659 7.13287 19.8958 6.93265 19.7663C6.73242 19.6368 6.65151 19.384 6.73935 19.1623L9.70397 11.6806L5.23445 10.6106C5.06054 10.5689 4.9221 10.4376 4.87139 10.2661C4.82068 10.0946 4.86541 9.9091 4.9887 9.77957L14.0621 0.247179C14.2228 0.0784039 14.4787 0.042969 14.6792 0.161747ZM6.3116 9.84018L10.4977 10.8424C10.6387 10.8761 10.7581 10.9694 10.8249 11.0981C10.8918 11.2267 10.8995 11.378 10.8461 11.5128L8.59272 17.1996L15.6066 9.97963L11.7597 9.05865C11.6245 9.02628 11.5089 8.93906 11.4406 8.81795C11.3723 8.69683 11.3575 8.55276 11.3998 8.42031L13.286 2.51296L6.3116 9.84018Z" />
    </svg>
  );
}

export function PlantGardenTextMarquee() {
  return (
    <section className="pg-marquee-section">
      <div className="pg-marquee-track">
        {[0, 1].map((set) => (
          <div key={set} className="pg-marquee-inner" aria-hidden={set === 1 ? true : undefined}>
            {items.map((item, i) => (
              <span key={i} className="pg-marquee-item">
                <span className={`pg-marquee-text${item.stroke ? ' scrolling--item__text--stroke' : ''}`}>
                  {item.text}
                </span>
                <IconBolt />
              </span>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        .pg-marquee-section {
          overflow: hidden;
          background: #e8f4f8;
          height: 110px;
          display: flex;
          align-items: center;
        }
        .pg-marquee-track {
          display: flex;
          width: max-content;
          animation: pgMarquee 28s linear infinite;
        }
        .pg-marquee-section:hover .pg-marquee-track {
          animation-play-state: paused;
        }
        .pg-marquee-inner {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .pg-marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 0 clamp(24px, 3vw, 48px);
          white-space: nowrap;
        }
        .pg-marquee-text {
          font-size: 32px;
          font-weight: 600;
          color: #2a2a2a;
          letter-spacing: 0.01em;
        }
        .scrolling--item__text--stroke {
          color: #0000;
          -webkit-text-stroke-color: rgba(51, 51, 51);
          -webkit-text-stroke-width: .1rem;
        }
        @keyframes pgMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
