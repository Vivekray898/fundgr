// components/HomeBanner.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

interface BannerSlide {
  id: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    ctaText: "Jetzt einkaufen",
    ctaLink: "/shop",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
    ctaText: "Angebote entdecken",
    ctaLink: "/angebote",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80",
    ctaText: "Zum Sortiment",
    ctaLink: "/sortiment",
  },
];

interface HomeBannerProps {
  autoplay?: boolean;
  autoplayInterval?: number;
}

const HomeBanner = ({ autoplay = true, autoplayInterval = 5000 }: HomeBannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = bannerSlides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Autoplay
  useEffect(() => {
    if (autoplay && !isPaused) {
      timerRef.current = setInterval(nextSlide, autoplayInterval);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoplay, autoplayInterval, isPaused, currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl shadow-xl my-4 sm:my-6"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div 
        className="relative aspect-[21/9] min-h-[150px] sm:min-h-[200px] md:min-h-[400px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? "opacity-100 translate-x-0 z-10" 
                : index < currentSlide 
                ? "opacity-0 -translate-x-full z-0" 
                : "opacity-0 translate-x-full z-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.ctaText}
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay for better button contrast */}
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* CTA Button - Bottom centered on all devices */}
            <div className="absolute inset-x-0 bottom-4 sm:bottom-6 md:bottom-8 z-20 flex justify-center px-4">
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3.5 rounded-full font-semibold text-xs sm:text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl max-w-[90%] whitespace-nowrap"
              >
                {slide.ctaText}
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-1 sm:px-2 md:px-4 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto p-1 sm:p-1.5 md:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all hover:scale-110 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto p-1 sm:p-1.5 md:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all hover:scale-110 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-1.5 sm:bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1 sm:gap-1.5 md:gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-4 sm:w-5 md:w-10 h-1 sm:h-1.5 md:h-2.5 bg-white"
                : "w-1 sm:w-1.5 md:w-2.5 h-1 sm:h-1.5 md:h-2.5 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter - Only show on desktop */}
      <div className="hidden md:block absolute bottom-6 right-6 z-30 text-sm text-white/70 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default HomeBanner;