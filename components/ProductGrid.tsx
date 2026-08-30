"use client";

import React, { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import { motion } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "./Container";
import HomeTabbar from "./HomeTabbar";
import { Product } from "@/sanity.types";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [productTypes, setProductTypes] = useState<Array<{ title: string; value: string }>>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch categories from Sanity
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const query = `*[_type == "category" && showInNavigation == true && !defined(parent)] | order(order asc) {
          title,
          "value": slug.current
        }`;
        const data = await client.fetch(query);
        setProductTypes(data || []);
        if (data?.length > 0) {
          setSelectedTab(data[0].title);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setProductTypes([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on selected tab
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedTab) return;
      
      setLoading(true);
      try {
        let query;
        let params;
        
        if (selectedTab === "all") {
          query = `*[_type == "product"] | order(name asc){
            ...,"categories": categories[]->title
          }`;
          params = {};
        } else {
          const selectedCategory = productTypes.find(cat => cat.title === selectedTab);
          const categorySlug = selectedCategory?.value || selectedTab.toLowerCase();
          
          query = `*[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc){
            ...,"categories": categories[]->title
          }`;
          params = { categorySlug };
        }
        
        const response = await client.fetch(query, params);
        setProducts(response);
        
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = 0;
          setScrollProgress(0);
        }
      } catch (error) {
        console.log("Product fetching Error", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab, productTypes]);

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
      <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} productTypes={productTypes} />
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 sm:py-10 min-h-[200px] sm:min-h-80 space-y-3 sm:space-y-4 text-center bg-gradient-to-br from-rose-50/30 to-pink-50/30 rounded-xl w-full mt-4 sm:mt-10">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-8 h-8 sm:w-12 sm:h-12 border-3 sm:border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-rose-500 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-500">Lade Produkte...</p>
          </div>
        </div>
      ) : products?.length ? (
        <div className="relative mt-3 sm:mt-10">
          {/* Subtle Gradient Fades */}
          <div className={`absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white/90 via-white/50 to-transparent pointer-events-none z-10 transition-opacity duration-500 ${scrollProgress > 0.02 ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white/90 via-white/50 to-transparent pointer-events-none z-10 transition-opacity duration-500 ${scrollProgress < 0.98 ? 'opacity-100' : 'opacity-0'}`} />

          {/* Scroll Container - Smaller cards on mobile */}
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
                className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] xl:min-w-[240px] snap-start"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows - Smaller on mobile */}
          <button
            onClick={() => scrollProducts('left')}
            className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-md border border-rose-100/50 flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 transition-all duration-200 z-20 ${
              scrollProgress > 0.02 ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-500 hover:text-rose-500 transition-colors" />
          </button>

          <button
            onClick={() => scrollProducts('right')}
            className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-md border border-rose-100/50 flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 transition-all duration-200 z-20 ${
              scrollProgress < 0.98 ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-500 hover:text-rose-500 transition-colors" />
          </button>

          {/* Compact Progress Bar */}
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-4 px-1">
            <p className="text-[10px] sm:text-xs text-gray-400 flex-shrink-0">
              <span className="font-medium text-gray-600">{products.length}</span>
            </p>
            <div className="flex-1 h-0.5 bg-rose-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-rose-300 to-pink-300 rounded-full"
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
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;