// components/RecentlyViewed.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceView from "./PriceView";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";

interface RecentlyViewedProps {
  currentProductId?: string;
  currentProduct?: any;
  maxItems?: number;
}

const RecentlyViewed = ({ 
  currentProductId, 
  currentProduct,
  maxItems = 10 
}: RecentlyViewedProps) => {
  const { enabled, pricePlaceholder } = useCatalogueMode();
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Save current product to recently viewed
  useEffect(() => {
    setMounted(true);
    
    if (currentProduct && currentProductId) {
      try {
        const stored = localStorage.getItem("recentlyViewed");
        let products = stored ? JSON.parse(stored) : [];
        
        products = products.filter((p: any) => p._id !== currentProductId);
        
        const newProduct = {
          _id: currentProduct._id,
          name: currentProduct.name,
          slug: currentProduct.slug,
          price: currentProduct.price,
          discount: currentProduct.discount,
          stock: currentProduct.stock,
          images: currentProduct.images,
          brand: currentProduct.brand,
          viewedAt: new Date().toISOString()
        };
        
        products = [newProduct, ...products];
        
        if (products.length > 20) {
          products = products.slice(0, 20);
        }
        
        localStorage.setItem("recentlyViewed", JSON.stringify(products));
      } catch (e) {
        console.error("Error saving recently viewed:", e);
      }
    }
  }, [currentProductId, currentProduct]);

  // Load recently viewed from localStorage
  useEffect(() => {
    if (mounted) {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        try {
          const products = JSON.parse(stored);
          const filtered = products
            .filter((p: any) => p._id !== currentProductId)
            .slice(0, maxItems);
          setRecentProducts(filtered);
        } catch (e) {
          console.error("Error loading recently viewed:", e);
        }
      }
    }
  }, [currentProductId, maxItems, mounted]);

  // Scroll handling
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      const newScroll = direction === "left" 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
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
    if (!mounted) return;
    
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
  }, [mounted]);

  if (!mounted || recentProducts.length === 0) return null;

  return (
    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-rose-100">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
          Zuletzt angesehen
        </h3>
        <span className="text-[10px] sm:text-xs text-gray-400">
          {recentProducts.length} Produkte
        </span>
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-rose-500 p-1.5 sm:p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-rose-500 p-1.5 sm:p-2 rounded-full shadow-lg border border-gray-200 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto scroll-smooth pb-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recentProducts.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product.slug?.current}`}
              className="flex-shrink-0 w-[120px] sm:w-[140px] bg-white rounded-lg border border-rose-100 overflow-hidden hover:shadow-md hover:shadow-rose-100/50 transition-all duration-200 hover:-translate-y-1 group/product"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gradient-to-br from-rose-50/30 to-pink-50/30 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={urlFor(product.images[0]).url()}
                    alt={product.name || "Product"}
                    width={140}
                    height={140}
                    className="w-full h-full object-contain p-1 group-hover/product:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Eye className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-1.5 sm:p-2">
                {product.brand && (
                  <p className="text-[8px] sm:text-[10px] text-gray-500 font-medium truncate">
                    {product.brand.brandName || product.brand.title}
                  </p>
                )}
                <p className="text-[10px] sm:text-xs font-medium text-gray-700 line-clamp-2 h-6 sm:h-8">
                  {product.name}
                </p>
                <div className="mt-0.5 sm:mt-1">
                  {!enabled ? (
                    <PriceView 
                      price={product.price} 
                      discount={product.discount} 
                      className="text-[10px] sm:text-xs font-bold"
                    />
                  ) : (
                    <span className="text-[8px] sm:text-[10px] text-gray-500">
                      {pricePlaceholder}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Scrollbar hide styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RecentlyViewed;