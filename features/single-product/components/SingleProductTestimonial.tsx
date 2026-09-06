'use client';

import { TestimonialSection } from '@/features/home/components/TestimonialSection';

export function SingleProductTestimonial() {
  return (
    <div className="sp-testimonial-wrapper">
      <TestimonialSection backgroundColor="transparent" sectionPadding="0" />

      <style>{`
        /* Soft, premium depth on the testimonial cards — the shared
           component's default shadow (0 2px 16px rgba(0,0,0,0.05)) is too
           faint to read against the page background. Layered shadow reads
           as natural, diffused elevation rather than a harsh drop shadow.
           The first two layers both use a positive y-offset (20px, 8px),
           so they only ever paint below the card — nothing crosses back
           over the top edge, leaving it flat. The third layer uses a
           negative y-offset to mirror that same soft/diffused treatment
           above the card, so the shadow reads as uniform on all sides.
           Opacity was later toned down (0.18/0.1/0.12 -> 0.1/0.06/0.07)
           for a lighter, more refined look — offsets/blur/spread are
           untouched, so the shadow's reach (and the clip-buffer sizing
           in the .swiper rule below, which only depends on reach, not
           opacity) is unaffected. */
        .sp-testimonial-wrapper .ts-card {
          box-shadow:
            0 20px 40px -14px rgba(15, 23, 42, 0.1),
            0 8px 16px -6px rgba(15, 23, 42, 0.06),
            0 -10px 24px -12px rgba(15, 23, 42, 0.07) !important;
        }

        /* Root cause: Swiper's own base stylesheet (swiper/swiper.css) sets
           '.swiper { overflow: hidden; }'. The Swiper root has no explicit
           height, so it sizes itself exactly to the 380px .ts-card content —
           zero vertical buffer — and 'overflow: hidden' clips the box-shadow
           flush at that edge on every axis. Mixing overflow-x:hidden with
           overflow-y:visible does NOT reliably fix this: once one axis is
           non-visible, browsers compute the other as 'auto', and 'auto'
           still clips painted overflow (box-shadow) exactly like 'hidden' —
           it only differs in scrollbar UI, not in what gets clipped.
           The robust fix: give '.swiper' real padding-block so the shadow
           has physical room inside the (still fully hidden, both axes)
           clip box, then cancel that padding's effect on the surrounding
           layout with an equal negative margin-block. The heading's own
           marginBottom below collapses with this negative marginTop, and
           the dots' marginTop below collapses with this negative
           marginBottom — algebraically: padding + collapse(siblingMargin,
           -padding) = siblingMargin, for any padding value — so the visual
           gap to the heading above and the dots below is unchanged, while
           the clip boundary now sits 56px further out than the cards.

           The same clipping happens horizontally too — the outermost
           (leftmost/rightmost) cards had their outward-facing shadow
           flush-cut, confirmed via computed styles and a rendered
           screenshot. This project sets box-sizing: border-box globally
           (globals.css), which changes the fix versus the vertical case:
           under border-box, an auto-width block's border-box locks to the
           containing block's width regardless of margin — padding then
           eats directly INTO that fixed border-box, shrinking the content
           (verified: adding padding-inline alone shrank every slide from
           467px to 446px, a real regression). So 'width' must be grown
           explicitly by twice the padding (calc(100% + Npx)) so that,
           after the border-box math subtracts the padding back out,
           content width lands back at exactly 100% — same slide width,
           same spaceBetween, same card position — while the border/clip
           edge sits further out on each side.

           The horizontal buffer must stay SMALLER than spaceBetween
           (24px): Swiper positions the next/prev looped slide starting
           immediately after that 24px gap, so if the buffer is >= 24px
           the clip boundary reaches past the gap and into the adjacent
           slide, revealing a sliver of it at rest (not just mid-drag) —
           this happened at the previous 32px value (an 8px leak,
           confirmed via computed rects: the buffer's outer edge landed
           8px inside the next slide's start). 18px leaves 6px of margin
           under the 24px gap, so the clip edge can never reach the
           neighboring slide, while still giving the shadow's ~26px
           horizontal falloff most of its room — the faint outermost tail
           is trimmed, which reads as imperceptible in practice. */
        .sp-testimonial-wrapper .swiper {
          overflow: hidden !important;
          padding-block: 56px !important;
          margin-block: -56px !important;
          padding-inline: 18px !important;
          margin-inline: -18px !important;
          width: calc(100% + 36px) !important;
        }
      `}</style>
    </div>
  );
}
