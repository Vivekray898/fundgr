// components/HomeBannerClient.tsx (Client Component)
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { ProcessedBannerData } from "@/lib/banner.server";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

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
  const [showVideo, setShowVideo] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Build slides
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

    // YouTube video first - use custom thumbnail
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

    // Banner
    if (bannerData.banner.isActive) {
      slides.push({
        id: "banner",
        image: bannerData.banner.image,
        alt: bannerData.banner.alt || "Banner",
        link: bannerData.banner.link || "/",
        type: "banner",
        isActive: true,
      });
    }

    // Fallback
    if (!bannerData.banner.isActive || bannerData.banner.isExpired) {
      slides.push({
        id: "fallback",
        image: bannerData.fallback.image,
        alt: bannerData.fallback.alt || "Fallback Banner",
        link: bannerData.fallback.link || "/",
        type: "fallback",
        isActive: true,
      });
    }

    if (slides.length === 0) {
      slides.push({
        id: "fallback",
        image: bannerData.fallback.image,
        alt: bannerData.fallback.alt || "Fallback Banner",
        link: bannerData.fallback.link || "/",
        type: "fallback",
        isActive: true,
      });
    }

    return slides;
  };

  const slides = getSlides();

  // Handle video play - auto-play the video
  const playVideo = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowVideo(true);
    
    // Stop autoplay when video starts
    if (swiperInstance) {
      swiperInstance.autoplay?.stop();
    }
  };

  // Handle iframe load - auto-play when iframe is ready
  const handleIframeLoad = () => {
    if (iframeRef.current && showVideo) {
      try {
        // Send play command to YouTube iframe
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
      } catch (error) {
        console.error('Error auto-playing video:', error);
      }
    }
  };

  // Listen for video state changes from YouTube
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange') {
          // If video ended, go back to thumbnail
          if (data.info === 0) {
            setTimeout(() => {
              setShowVideo(false);
              if (swiperInstance && autoplay) {
                swiperInstance.autoplay?.start();
              }
            }, 2000);
          }
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [swiperInstance, autoplay]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setShowVideo(false);
    };
  }, []);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl my-4 sm:my-6">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        autoplay={{
          delay: autoplayInterval,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        loop={slides.length > 1}
        onSwiper={setSwiperInstance}
        onSlideChange={() => {
          // Close video when slide changes
          if (showVideo) {
            setShowVideo(false);
            if (swiperInstance && autoplay) {
              swiperInstance.autoplay?.start();
            }
          }
        }}
        className="aspect-[21/9] min-h-[150px] sm:min-h-[200px] md:min-h-[400px] bg-black"
      >
        {slides.map((slide, index) => {
          const isYoutube = slide.type === "youtube";
          const isActive = swiperInstance?.activeIndex === index;
          const isCurrentSlide = isActive && isYoutube;
          
          return (
            <SwiperSlide key={`${slide.id}-${index}`}>
              <div className="relative w-full h-full">
                {/* Show video or thumbnail */}
                {isYoutube && slide.videoId && isCurrentSlide && showVideo ? (
                  // YouTube Video Player with native controls
                  <iframe
                    ref={iframeRef}
                    src={`${getYouTubeEmbedUrl(slide.videoId)}&autoplay=1`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="YouTube Video"
                    onLoad={handleIframeLoad}
                  />
                ) : (
                  // Thumbnail or Banner
                  <>
                    <Image
                      src={slide.image}
                      alt={slide.alt || "Banner"}
                      fill
                      className="object-cover"
                      priority={isActive}
                      sizes="(max-width: 768px) 100vw, 100vw"
                    />
                    
                    {/* Dark overlay for better visibility */}
                    <div className="absolute inset-0 bg-black/30" />
                    
                    {/* YouTube Play Button Overlay - Only on YouTube slides */}
                    {isYoutube && slide.videoId && isCurrentSlide && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button
                          onClick={playVideo}
                          onTouchStart={(e) => {
                            e.preventDefault();
                            playVideo(e);
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            playVideo(e);
                          }}
                          className="group relative flex items-center justify-center touch-manipulation"
                          aria-label="Play video"
                          style={{ touchAction: 'manipulation' }}
                        >
                          {/* Play button background glow */}
                          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 group-hover:scale-175 transition-transform duration-300" />
                          
                          {/* Play button */}
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

        {/* Navigation Controls - Only show when video is not playing */}
        {slides.length > 1 && !showVideo && (
          <>
            <button 
              className="swiper-button-prev absolute inset-y-0 left-0 z-30 flex items-center px-1 sm:px-2 md:px-4 pointer-events-auto"
              aria-label="Previous slide"
            >
              <div className="p-1 sm:p-1.5 md:p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white transition-all hover:scale-110 active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </div>
            </button>
            <button 
              className="swiper-button-next absolute inset-y-0 right-0 z-30 flex items-center px-1 sm:px-2 md:px-4 pointer-events-auto"
              aria-label="Next slide"
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
        {slides.length > 1 && !showVideo && (
          <div className="absolute bottom-1.5 sm:bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1 sm:gap-1.5 md:gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperInstance?.slideTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  swiperInstance?.activeIndex === index
                    ? "w-4 sm:w-5 md:w-10 h-1 sm:h-1.5 md:h-2.5 bg-white"
                    : "w-1 sm:w-1.5 md:w-2.5 h-1 sm:h-1.5 md:h-2.5 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        {slides.length > 1 && !showVideo && (
          <div className="hidden md:block absolute bottom-6 right-6 z-30 text-sm text-white/70 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {swiperInstance ? (swiperInstance.activeIndex + 1) : 1} / {slides.length}
          </div>
        )}
      </Swiper>
    </div>
  );
};

export default HomeBannerClient;