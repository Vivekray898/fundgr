// components/RelatedProducts.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import PriceView from "./PriceView";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";

interface RelatedProduct {
  _id: string;
  name: string;
  slug: { current: string };
  price?: number;
  discount?: number;
  stock?: number;
  images?: any[];
  brand?: {
    title?: string;
    brandName?: string;
    slug?: { current: string };
  };
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
  maxDisplay?: number;
}

const RelatedProducts = ({ 
  products, 
  title = "Mehr Produkte entdecken",
  maxDisplay = 12 
}: RelatedProductsProps) => {
  const { enabled, pricePlaceholder } = useCatalogueMode();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // If no products, don't render
  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = products.slice(0, maxDisplay);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === "left" 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      setTimeout(handleScroll, 100);
      
      window.addEventListener("resize", handleScroll);
      
      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, []);

  return (
    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-rose-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
          {title}
        </h2>
        <Link 
          href="/shop" 
          className="text-xs sm:text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors hover:underline"
        >
          Alle anzeigen →
        </Link>
      </div>

      {/* Scrollable products container */}
      <div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation arrows */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-rose-500 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: "translateY(-50%)" }}
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-rose-500 p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: "translateY(-50%)" }}
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Products grid - horizontal scroll */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
          style={{ 
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayProducts.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product.slug?.current}`}
              className="flex-shrink-0 w-[160px] sm:w-[200px] bg-white rounded-xl border border-rose-100 overflow-hidden hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300 hover:-translate-y-1 group/product"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gradient-to-br from-rose-50/30 to-pink-50/30 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={urlFor(product.images[0]).url()}
                    alt={product.name}
                    width={220}
                    height={220}
                    className="w-full h-full object-contain group-hover/product:scale-105 transition-transform duration-300 p-2"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Eye className="w-8 h-8" />
                  </div>
                )}
                {/* Stock badge */}
                {(product.stock ?? 0) <= 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] sm:text-xs px-2 py-0.5 rounded-full">
                    Ausverkauft
                  </span>
                )}
                {/* Catalogue Mode Badge */}
                {enabled && (
                  <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-rose-600 text-[7px] sm:text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm border border-rose-200">
                    Im Markt
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-2 sm:p-3">
                {product.brand && (
                  <p className="text-[9px] sm:text-xs text-gray-500 font-medium truncate">
                    {product.brand.brandName || product.brand.title}
                  </p>
                )}
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 h-8 sm:h-10">
                  {product.name}
                </h3>
                <div className="mt-1 sm:mt-2">
                  {!enabled ? (
                    <PriceView 
                      price={product.price} 
                      discount={product.discount} 
                      className="text-xs sm:text-sm font-bold"
                    />
                  ) : (
                    <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      {pricePlaceholder}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile scroll indicator */}
      <div className="flex justify-center gap-1 mt-3 md:hidden">
        {displayProducts.length > 4 && (
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        )}
      </div>

      {/* Add scrollbar-hide to global CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;