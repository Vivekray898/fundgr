"use client";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number | undefined;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const swiperRef = useRef<any>(null);

  const goToPrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const goToNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Main Image - With Swiper */}
      <div className="relative">
        <div className="w-full aspect-square max-h-[400px] sm:max-h-[500px] md:max-h-[550px] rounded-xl overflow-hidden bg-gradient-to-br from-rose-50/30 to-pink-50/30 border border-rose-100">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Thumbs]}
            thumbs={{ swiper: thumbsSwiper }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="h-full w-full"
            loop={images.length > 1}
          >
            {images.map((image, index) => (
              <SwiperSlide key={image?._key || index} className="flex items-center justify-center">
                <Image
                  src={urlFor(image).url()}
                  alt="productImage"
                  width={700}
                  height={700}
                  priority={index === 0}
                  className={`w-full h-full object-contain p-4 ${
                    isStock === 0 ? "opacity-50" : ""
                  }`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Navigation Arrows - Desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-rose-100 items-center justify-center hover:bg-rose-50 transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToNext}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-rose-100 items-center justify-center hover:bg-rose-50 transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Image Counter - Mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}

        {/* Stock Overlay */}
        {isStock === 0 && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <span className="bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails - Horizontal Scroll */}
      {images.length > 1 && (
        <div className="relative">
          <Swiper
            modules={[Thumbs]}
            watchSlidesProgress
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView={Math.min(images.length, 6)}
            freeMode={true}
            className="thumbnails-swiper"
          >
            {images.map((image, index) => (
              <SwiperSlide key={image?._key || index}>
                <button
                  onClick={() => {
                    if (swiperRef.current && swiperRef.current.swiper) {
                      swiperRef.current.swiper.slideTo(index);
                    }
                  }}
                  className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    activeIndex === index 
                      ? "border-rose-500 shadow-md shadow-rose-200" 
                      : "border-transparent hover:border-rose-200"
                  }`}
                >
                  <Image
                    src={urlFor(image).url()}
                    alt={`Thumbnail ${index + 1}`}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          <style jsx>{`
            .thumbnails-swiper :global(.swiper-slide) {
              width: 80px !important;
              flex-shrink: 0;
            }
            @media (min-width: 640px) {
              .thumbnails-swiper :global(.swiper-slide) {
                width: 100px !important;
              }
            }
            @media (min-width: 768px) {
              .thumbnails-swiper :global(.swiper-slide) {
                width: 120px !important;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default ImageView;