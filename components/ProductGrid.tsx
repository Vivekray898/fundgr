"use client";

import React, { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import { motion } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "./Container";

// Define Product type locally since it's not in sanity.types
interface Product {
  _id: string;
  name: string;
  slug: { current: string } | string;
  images?: Array<{ asset?: { _id: string; url: string } }> | string[];
  price: number;
  discount?: number;
  originalPrice?: number;
  isDeal?: boolean;
  dealEndDate?: string;
  status?: string;
  stock?: number;
  categories?: string[];
  brand?: string;
  brandName?: string;
  brandSlug?: string;
  description?: string;
}

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch new products (status = 'new') from Sanity
  useEffect(() => {
    const fetchNewProducts = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "product" && status == "new" && stock > 0] | order(_createdAt desc)[0...12] {
          _id,
          name,
          slug,
          "images": images[]{
            asset->{
              _id,
              url
            }
          },
          price,
          discount,
          originalPrice,
          isDeal,
          dealEndDate,
          status,
          stock,
          "categories": categories[]->title,
          "brandName": brand->name,
          "brandSlug": brand->slug.current,
          "brand": brand->title,
          description
        }`;
        
        const response = await client.fetch(query);
        setProducts(response || []);
      } catch (error) {
        console.error("Error fetching new products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewProducts();
  }, []);

  // Check scroll position
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const progress = scrollWidth > clientWidth ? scrollLeft / (scrollWidth - clientWidth) : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [products]);

  const scrollProducts = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Container className="flex flex-col lg:px-0 my-6 sm:my-10">
      {/* Centered Title Section - Black instead of rose/pink */}
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          <span className="text-black">
            Neu im Markt
          </span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Entdecke unsere neuesten Produkte
        </p>
        <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-black mx-auto mt-2 sm:mt-3 rounded-full" />
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-10 min-h-[200px] sm:min-h-80 space-y-3 sm:space-y-4 text-center bg-gray-50 rounded-xl w-full mt-4 sm:mt-10">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-8 h-8 sm:w-12 sm:h-12 border-3 sm:border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Lade neue Produkte...</p>
          </div>
        </div>
      ) : products?.length ? (
        <div className="relative mt-3 sm:mt-10">
          {/* Subtle Gradient Fades - Using black/white */}
          <div className={`absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none z-10 transition-opacity duration-500 ${scrollProgress > 0.02 ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none z-10 transition-opacity duration-500 ${scrollProgress < 0.98 ? 'opacity-100' : 'opacity-0'}`} />

          {/* Scroll Container - Cards with fixed height to prevent layout issues */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {products.map((product, index) => (
              <motion.div
                key={product?._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] xl:min-w-[240px] max-w-[240px] snap-start flex-shrink-0"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows - Black theme */}
          <button
            onClick={() => scrollProducts('left')}
            className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 z-20 ${
              scrollProgress > 0.02 ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-700 hover:text-black transition-colors" />
          </button>

          <button
            onClick={() => scrollProducts('right')}
            className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 z-20 ${
              scrollProgress < 0.98 ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-700 hover:text-black transition-colors" />
          </button>

          {/* Compact Progress Bar - Black theme */}
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-4 px-1">
            <p className="text-[10px] sm:text-xs text-gray-400 flex-shrink-0">
              <span className="font-medium text-gray-700">{products.length}</span>
            </p>
            <div className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-black rounded-full"
                style={{ width: `${scrollProgress * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 flex-shrink-0">
              {Math.round(scrollProgress * 100)}%
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl mt-4 sm:mt-10">
          <div className="text-6xl sm:text-7xl mb-4">🛒</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            Keine Produkte verfügbar
          </h3>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Es tut uns leid, aber es gibt derzeit keine Produkte in der Kategorie <span className="font-medium text-black">Neu im Markt</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-3">
            Wir füllen bald wieder auf. Schauen Sie später wieder vorbei!
          </p>
        </div>
      )}
    </Container>
  );
};

export default ProductGrid;