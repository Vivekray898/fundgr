// components/HomeBannerClient.tsx (Client Component)
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, X } from "lucide-react";
import { ProcessedBannerData } from "@/lib/banner.server";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface HomeBannerClientProps {
  initialBannerData: ProcessedBannerData | null;
  autoplay?: boolean;
  autoplayInterval?: number;
}

// Load the YT IFrame API script once
let ytApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.();
      resolve();
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
  return ytApiPromise;
}

const HomeBannerClient = ({
  initialBannerData,
  autoplay = true,
  autoplayInterval = 5000,
}: HomeBannerClientProps) => {
  const [bannerData] = useState<ProcessedBannerData | null>(initialBannerData);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  
  // Refs for navigation buttons
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

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
      return [{
        id: "fallback",
        image: "/images/fallback-banner.jpg",
        alt: "Fallback Banner",
        link: "/",
        type: "fallback" as const,
        isActive: true
      }];
    }

    if (bannerData.youtube.enabled && bannerData.youtube.videoId) {
      slides.push({
        id: "youtube",
        image: bannerData.youtube.thumbnail || `https://img.youtube.com/vi/${bannerData.youtube.videoId}/hqdefault.jpg`,
        alt: bannerData.youtube.thumbnailAlt || "YouTube Video",
        videoId: bannerData.youtube.videoId,
        type: "youtube",
        isActive: true,
      });
    }

    if (bannerData.banner.isActive) {
      slides.push({
        id: "banner",
        image: bannerData.banner.image,
        alt: bannerData.banner.alt || "Banner",
        link: bannerData.banner.link || "/",
        type: "banner",
        isActive: true
      });
    }

    if (!bannerData.banner.isActive || bannerData.banner.isExpired) {
      slides.push({
        id: "fallback",
        image: bannerData.fallback.image,
        alt: bannerData.fallback.alt || "Fallback Banner",
        link: bannerData.fallback.link || "/",
        type: "fallback",
        isActive: true
      });
    }

    if (slides.length === 0) {
      slides.push({
        id: "fallback",
        image: bannerData.fallback.image,
        alt: bannerData.fallback.alt || "Fallback Banner",
        link: bannerData.fallback.link || "/",
        type: "fallback",
        isActive: true
      });
    }

    return slides;
  };

  const slides = getSlides();

  const destroyPlayer = useCallback(() => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        // Ignore destroy errors
      }
      playerRef.current = null;
    }
  }, []);

  const closeVideo = useCallback(
    (swiper?: SwiperType) => {
      setShowVideo(false);
      setIsVideoPlaying(false);
      destroyPlayer();
      const s = swiper ?? swiperRef.current;
      if (s && autoplay) {
        s.autoplay?.start();
      }
    },
    [autoplay, destroyPlayer]
  );

  // Create the real YT.Player once showVideo turns on
  useEffect(() => {
    if (!showVideo) return;
    const currentSlide = slides[activeIndex];
    if (currentSlide?.type !== "youtube" || !currentSlide.videoId) return;

    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !playerContainerRef.current) return;
      destroyPlayer();
      
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: currentSlide.videoId,
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e: any) => {
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0
            const isPlaying = e.data === 1;
            setIsVideoPlaying(isPlaying);
            
            if (e.data === 0) {
              // Video ended - close after 1.5 seconds
              setTimeout(() => {
                closeVideo();
              }, 1500);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVideo, activeIndex]);

  useEffect(() => destroyPlayer, [destroyPlayer]);

  const playVideo = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowVideo(true);
    if (swiperRef.current) {
      swiperRef.current.autoplay?.stop();
    }
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl my-4 sm:my-6">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          // @ts-ignore - Setting navigation elements before init
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore - Setting navigation elements before init
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        autoplay={{
          delay: autoplayInterval,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        loop={slides.length > 1}
        allowTouchMove={!showVideo}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
        onSlideChange={(swiper) => {
          const newIndex = swiper.realIndex;
          setActiveIndex(newIndex);
          if (showVideo) {
            closeVideo(swiper);
          }
        }}
        className="aspect-[21/9] min-h-[150px] sm:min-h-[200px] md:min-h-[400px] bg-black"
      >
        {slides.map((slide, index) => {
          const isYoutube = slide.type === "youtube";
          const isActive = activeIndex === index;
          const isCurrentSlide = isActive && isYoutube;

          return (
            <SwiperSlide key={`${slide.id}-${index}`}>
              <div className="relative w-full h-full">
                {isCurrentSlide && showVideo ? (
                  // YouTube Video Player
                  <div className="relative w-full h-full">
                    <div
                      ref={isCurrentSlide ? playerContainerRef : undefined}
                      className="absolute inset-0 w-full h-full"
                    />
                    {/* Close Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeVideo();
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="absolute top-4 right-4 z-20 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white transition-all hover:scale-110 active:scale-95"
                      aria-label="Close video"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    {/* Video Status */}
                    <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs sm:text-sm">
                      {isVideoPlaying ? "▶ Wird abgespielt" : "⏸ Pausiert"}
                    </div>
                  </div>
                ) : (
                  // Thumbnail or Banner - NO BLACK OVERLAY
                  <>
                    <Image
                      src={slide.image}
                      alt={slide.alt || "Banner"}
                      fill
                      draggable={false}
                      className="object-cover select-none"
                      priority={isActive}
                      sizes="(max-width: 768px) 100vw, 100vw"
                    />
                    
                    {/* YouTube Play Button Overlay */}
                    {isCurrentSlide && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button
                          onClick={playVideo}
                          onTouchStart={(e) => {
                            e.preventDefault();
                            playVideo(e);
                          }}
                          className="group relative flex items-center justify-center touch-manipulation"
                          aria-label="Play video"
                          style={{ touchAction: "manipulation" }}
                        >
                          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 group-hover:scale-175 transition-transform duration-300 pointer-events-none" />
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 active:scale-95">
                            <Play className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-red-600 fill-red-600 ml-1" />
                          </div>
                        </button>
                      </div>
                    )}
                    
                    {/* CTA Button - Only for non-YouTube slides */}
                    {!isYoutube && slide.link && (
                      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 md:bottom-8 z-20 flex justify-center px-4">
                        <Link
                          href={slide.link}
                          className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3.5 rounded-full font-semibold text-xs sm:text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl max-w-[90%] whitespace-nowrap"
                        >
                          {slide.type === "fallback" ? "Zurück zur Startseite" : "Jetzt entdecken"}
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </SwiperSlide>
          );
        })}

        {/* Navigation Controls */}
        {slides.length > 1 && (
          <>
            <button
              ref={prevRef}
              className={`swiper-button-prev absolute inset-y-0 left-0 z-30 flex items-center px-1 sm:px-2 md:px-4 pointer-events-auto transition-opacity duration-300 ${
                isVideoPlaying ? "opacity-30 pointer-events-none" : "opacity-100"
              }`}
              aria-label="Previous slide"
              disabled={isVideoPlaying}
            >
              <div className="p-1 sm:p-1.5 md:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all hover:scale-110 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </div>
            </button>
            <button
              ref={nextRef}
              className={`swiper-button-next absolute inset-y-0 right-0 z-30 flex items-center px-1 sm:px-2 md:px-4 pointer-events-auto transition-opacity duration-300 ${
                isVideoPlaying ? "opacity-30 pointer-events-none" : "opacity-100"
              }`}
              aria-label="Next slide"
              disabled={isVideoPlaying}
            >
              <div className="p-1 sm:p-1.5 md:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all hover:scale-110 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-1.5 sm:bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1 sm:gap-1.5 md:gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isVideoPlaying && swiperRef.current) {
                    swiperRef.current.slideTo(index);
                  }
                }}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === index
                    ? "w-4 sm:w-5 md:w-10 h-1 sm:h-1.5 md:h-2.5 bg-white"
                    : "w-1 sm:w-1.5 md:w-2.5 h-1 sm:h-1.5 md:h-2.5 bg-white/50 hover:bg-white/70"
                } ${isVideoPlaying ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                aria-label={`Go to slide ${index + 1}`}
                disabled={isVideoPlaying}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        {slides.length > 1 && (
          <div className="hidden md:block absolute bottom-6 right-6 z-30 text-sm text-white/70 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {slides.length}
          </div>
        )}
      </Swiper>
    </div>
  );
};

export default HomeBannerClient;