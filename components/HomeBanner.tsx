"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Wrench, Home, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";

interface BannerSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  badgeColor?: string;
  gradient: string;
  icon: React.ReactNode;
}

const bannerSlides: BannerSlide[] = [
  {
    id: "1",
    title: "Sommer SALE",
    subtitle: "Viele Artikel radikal reduziert!",
    description: "Jetzt zugreifen und sparen",
    ctaText: "Zu den Produkten",
    ctaLink: "/sale/sommer-sale",
    badge: "SALE",
    badgeColor: "bg-red-500",
    gradient: "from-red-600 via-orange-500 to-yellow-400",
    icon: <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-white/30" />,
  },
  {
    id: "2",
    title: "Online-HAMMER",
    subtitle: "Garantia Regenspeicher 230 L",
    description: "119 € statt 149 €",
    ctaText: "Zum Online-Hammer",
    ctaLink: "/p/garantia-regenspeicher",
    badge: "Aktion",
    badgeColor: "bg-orange-500",
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    icon: <Wrench className="w-12 h-12 md:w-16 md:h-16 text-white/30" />,
  },
  {
    id: "3",
    title: "Schöne FASSADE",
    subtitle: "Von der Reinigung bis zum Anstrich",
    description: "Alles für Ihre Fassade",
    ctaText: "Zur Themenwelt",
    ctaLink: "/themenwelten/fassade",
    gradient: "from-teal-500 via-emerald-500 to-green-600",
    icon: <Home className="w-12 h-12 md:w-16 md:h-16 text-white/30" />,
  },
  {
    id: "4",
    title: "ERNTEzeit im Garten",
    subtitle: "Bequem pflücken, richtig lagern & verwerten",
    description: "Jetzt entdecken",
    ctaText: "Zur Themenwelt",
    ctaLink: "/themenwelten/ernte",
    badge: "Neu",
    badgeColor: "bg-green-500",
    gradient: "from-green-600 via-yellow-500 to-orange-400",
    icon: <Leaf className="w-12 h-12 md:w-16 md:h-16 text-white/30" />,
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

  // Get gradient classes for each slide
  const getGradient = (gradient: string) => {
    return `bg-gradient-to-br ${gradient}`;
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl shadow-xl"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div 
        className="relative aspect-[21/9] min-h-[280px] md:min-h-[380px]"
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
            {/* Background Gradient */}
            <div className={`absolute inset-0 ${getGradient(slide.gradient)}`}>
              {/* Decorative Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/4" />
                <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            {/* Badge */}
            {slide.badge && (
              <div className={`absolute top-4 md:top-6 left-4 md:left-6 z-20 ${slide.badgeColor} text-white text-xs md:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse`}>
                {slide.badge}
              </div>
            )}

            {/* Icon */}
            <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-20 opacity-20">
              {slide.icon}
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="max-w-2xl text-white">
                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 md:mb-3 leading-tight">
                    {slide.title}
                  </h2>
                  
                  {/* Subtitle */}
                  {slide.subtitle && (
                    <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/90 mb-1">
                      {slide.subtitle}
                    </p>
                  )}
                  
                  {/* Description */}
                  {slide.description && (
                    <p className="text-sm md:text-base text-white/80 mb-4 md:mb-6">
                      {slide.description}
                    </p>
                  )}

                  {/* CTA Button */}
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-5 md:px-7 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg"
                  >
                    {slide.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-2 md:px-4 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all hover:scale-110 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all hover:scale-110 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 md:gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 md:w-10 h-2 md:h-2.5 bg-white"
                : "w-2 md:w-2.5 h-2 md:h-2.5 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-3 md:bottom-6 right-4 md:right-6 z-30 text-xs md:text-sm text-white/70 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default HomeBanner;