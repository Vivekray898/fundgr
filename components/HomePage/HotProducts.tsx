// components/HomePage/HotProducts.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { client } from "@/sanity/lib/client";
import { ChevronLeft, ChevronRight, Flame, Star, TrendingUp } from "lucide-react";
import Container from "../Container";

// Define Product type
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

const HotProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch hot products from Sanity
  useEffect(() => {
    const fetchHotProducts = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "product" && status == "hot" && stock > 0] | order(_createdAt desc)[0...12] {
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
        console.error("Error fetching hot products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotProducts();
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

  // Helper to get image URL
  const getImageUrl = (image: any): string => {
    if (!image) return '/placeholder-product.jpg';
    if (typeof image === 'string') return image;
    if (image?.asset?.url) return image.asset.url;
    if (image?.url) return image.url;
    return '/placeholder-product.jpg';
  };

  // Helper to get slug
  const getSlug = (slug: any): string => {
    if (!slug) return '';
    if (typeof slug === 'string') return slug;
    if (slug.current) return slug.current;
    return '';
  };

  return (
    <Container className="flex flex-col lg:px-0 my-6 sm:my-10">
      {/* Centered Title Section - Hot/Orange theme */}
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-1.5 rounded-full mb-3">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Heiße Deals</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Heiße Produkte
          </span>
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Entdecke unsere meistgefragten Artikel
        </p>
        <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto mt-2 sm:mt-3 rounded-full" />
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-10 min-h-[200px] sm:min-h-80 space-y-3 sm:space-y-4 text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl w-full mt-4 sm:mt-10 border border-orange-100">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-8 h-8 sm:w-12 sm:h-12 border-3 sm:border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500 animate-pulse" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-orange-600">Lade heiße Produkte...</p>
          </div>
        </div>
      ) : products?.length ? (
        <div className="relative mt-3 sm:mt-10">
          {/* Subtle Gradient Fades */}
          <div className={`absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none z-10 transition-opacity duration-500 ${scrollProgress > 0.02 ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none z-10 transition-opacity duration-500 ${scrollProgress < 0.98 ? 'opacity-100' : 'opacity-0'}`} />

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-5 overflow-x-auto pb-3 sm:pb-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {products.map((product, index) => {
              const imageUrl = product.images && product.images.length > 0 
                ? getImageUrl(product.images[0]) 
                : '/placeholder-product.jpg';
              const slug = getSlug(product.slug);
              const discountPercentage = product.discount 
                ? Math.round((product.discount / product.price) * 100) 
                : 0;
              
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3), type: "spring", stiffness: 300 }}
                  className="min-w-[150px] sm:min-w-[190px] md:min-w-[210px] lg:min-w-[230px] xl:min-w-[250px] max-w-[250px] snap-start flex-shrink-0 group"
                >
                  <Link href={`/product/${slug}`} className="block">
                    <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
                      {/* Hot Badge */}
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                        <Flame className="w-3 h-3 fill-white" />
                        <span>HOT</span>
                      </div>
                      
                      {/* Discount Badge */}
                      {discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                          -{discountPercentage}%
                        </div>
                      )}

                      {/* Image Container */}
                      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-orange-50/30 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 150px, (max-width: 768px) 190px, (max-width: 1024px) 210px, 250px"
                        />
                        {/* Animated shimmer on hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </div>

                      {/* Content */}
                      <div className="p-3 sm:p-4">
                        {/* Brand/Status */}
                        <div className="flex items-center justify-between mb-1">
                          {product.brandName && (
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                              {product.brandName}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] font-medium text-gray-500">4.8</span>
                          </div>
                        </div>

                        {/* Product Name */}
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                          {product.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-lg sm:text-xl font-bold text-gray-900">
                            €{product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              €{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Stock indicator */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min((product.stock || 0) / 20 * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-medium text-gray-400 whitespace-nowrap">
                            {product.stock > 0 ? `${product.stock} verfügbar` : 'Ausverkauft'}
                          </span>
                        </div>

                        {/* Quick Action - Trending indicator */}
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-orange-500">
                          <TrendingUp className="w-3 h-3" />
                          <span className="font-medium">Beliebt</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-400">Heiß begehrt</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Arrows - Orange theme */}
          <button
            onClick={() => scrollProducts('left')}
            className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-md border border-orange-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 transition-all duration-200 z-20 ${
              scrollProgress > 0.02 ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-700 hover:text-orange-600 transition-colors" />
          </button>

          <button
            onClick={() => scrollProducts('right')}
            className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-md border border-orange-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600 transition-all duration-200 z-20 ${
              scrollProgress < 0.98 ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-700 hover:text-orange-600 transition-colors" />
          </button>

          {/* Progress Bar - Orange theme */}
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-4 px-1">
            <p className="text-[10px] sm:text-xs text-gray-400 flex-shrink-0">
              <span className="font-medium text-gray-700">{products.length}</span>
            </p>
            <div className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
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
        <div className="text-center py-12 sm:py-16 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl mt-4 sm:mt-10 border border-orange-100">
          <div className="text-6xl sm:text-7xl mb-4">🔥</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            Keine heißen Produkte verfügbar
          </h3>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Es tut uns leid, aber es gibt derzeit keine Produkte in der Kategorie <span className="font-medium text-orange-600">Heiße Produkte</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-3">
            Schauen Sie bald wieder vorbei für neue Angebote!
          </p>
        </div>
      )}
    </Container>
  );
};

export default HotProducts;