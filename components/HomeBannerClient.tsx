// components/HomeBannerClient.tsx (Client Component)
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Play } from "lucide-react";
import { ProcessedBannerData } from "@/lib/banner";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

interface HomeBannerClientProps {
  initialBannerData: ProcessedBannerData | null;
  autoplay?: boolean;
  autoplayInterval?: number;
}

const HomeBannerClient = ({ 
  initialBannerData,
  autoplay = true, 
  autoplayInterval = 5000 
}: HomeBannerClientProps) => {
  const [bannerData, setBannerData] = useState<ProcessedBannerData | null>(initialBannerData);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Build slides based on available data
  const getSlides = () => {
    const slides: Array<{
      id: string;
      image: string;
      alt?: string;
      link?: string;
      type: "banner" | "youtube" | "fallback";
      videoId?: string;
      isActive: boolean;
    }> = [];

    if (!bannerData) {
      // Show fallback only
      return [
        {
          id: "fallback",
          image: "/images/fallback-banner.jpg",
          alt: "Fallback Banner",
          link: "/",
          type: "fallback",
          isActive: true,
        },
      ];
    }

    // Add banner if active
    if (bannerData.banner.isActive) {
      slides.push({
        id: "banner",
        image: bannerData.banner.image,
        alt: bannerData.banner.alt,
        link: bannerData.banner.link,
        type: "banner",
        isActive: true,
      });
    } else if (bannerData.banner.isExpired) {
      // Banner expired, use fallback
      slides.push({
        id: "fallback",
        image: bannerData.fallback.image,
        alt: bannerData.fallback.alt,
        link: bannerData.fallback.link,
        type: "fallback",
        isActive: true,
      });
    }

    // Add YouTube video if enabled and active
    if (bannerData.youtube.enabled && bannerData.youtube.videoId) {
      slides.push({
        id: "youtube",
        image: `https://img.youtube.com/vi/${bannerData.youtube.videoId}/hqdefault.jpg`,
        videoId: bannerData.youtube.videoId,
        type: "youtube",
        isActive: true,
      });
    }

    // If no slides are active, use fallback
    if (slides.length === 0) {
      slides.push({
        id: "fallback",
        image: bannerData.fallback.image,
        alt: bannerData.fallback.alt,
        link: bannerData.fallback.link,
        type: "fallback",
        isActive: true,
      });
    }

    return slides;
  };

  const slides = getSlides();
  const totalSlides = slides.length;

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
    if (autoplay && !isPaused && totalSlides > 1) {
      timerRef.current = setInterval(nextSlide, autoplayInterval);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoplay, autoplayInterval, isPaused, currentSlide, totalSlides]);

  const currentSlideData = slides[currentSlide];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl my-4 sm:my-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative aspect-[21/9] min-h-[150px] sm:min-h-[200px] md:min-h-[400px]">
        {/* Current Slide */}
        <div className="absolute inset-0 transition-all duration-700 ease-in-out">
          {currentSlideData.type === "youtube" && currentSlideData.videoId ? (
            // YouTube Video
            <div className="relative w-full h-full">
              <iframe
                src={getYouTubeEmbedUrl(currentSlideData.videoId)}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title="YouTube Video"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>
          ) : (
            // Banner Image
            <>
              <Image
                src={currentSlideData.image}
                alt={currentSlideData.alt || "Banner"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 100vw"
              />
              <div className="absolute inset-0 bg-black/20" />
            </>
          )}
        </div>

        {/* CTA Button - Only for non-YouTube slides */}
        {currentSlideData.type !== "youtube" && currentSlideData.link && (
          <div className="absolute inset-x-0 bottom-4 sm:bottom-6 md:bottom-8 z-20 flex justify-center px-4">
            <Link
              href={currentSlideData.link}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3.5 rounded-full font-semibold text-xs sm:text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl max-w-[90%] whitespace-nowrap"
            >
              {currentSlideData.type === "fallback" ? "Zurück zur Startseite" : "Jetzt entdecken"}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        )}

        {/* YouTube Play Button Overlay */}
        {currentSlideData.type === "youtube" && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-600 fill-red-600 ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls - Only show if more than 1 slide */}
      {totalSlides > 1 && (
        <>
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
            {slides.map((_, index) => (
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

          {/* Slide Counter */}
          <div className="hidden md:block absolute bottom-6 right-6 z-30 text-sm text-white/70 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {currentSlide + 1} / {totalSlides}
          </div>
        </>
      )}
    </div>
  );
};

export default HomeBannerClient;