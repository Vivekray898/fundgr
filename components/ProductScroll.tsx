"use client";

import React, { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { client } from "@/sanity/lib/client";
import NoProductAvailable from "./NoProductAvailable";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "./Container";
import HomeTabbar from "./HomeTabbar";
import { productType } from "@/constants/data";
import { Product } from "@/sanity.types";

interface ProductGridProps {
  scrollable?: boolean;
  title?: string;
  showTabbar?: boolean;
  maxItems?: number;
}

const ProductGrid = ({ 
  scrollable = true, 
  title = "Our Products",
  showTabbar = true,
  maxItems = 20
}: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const query = `*[_type == "product" && variant == $variant] | order(name asc) [0...${maxItems}]{
    ...,
    "categories": categories[]->title
  }`;
  const params = { variant: selectedTab.toLowerCase() };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(await response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Check if there are enough products to scroll
  const hasProducts = products?.length > 0;
  const canScroll = hasProducts && scrollable;

  return (
    <Container className="flex flex-col lg:px-0 my-10">
      {/* Header with Title and Navigation */}
      <div className="flex items-center justify-between mb-4">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            {title}
          </h2>
        )}
        {canScroll && (
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Tab Bar */}
      {showTabbar && (
        <HomeTabbar selectedTab={selectedTab} onTabSelect={setSelectedTab} />
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <motion.div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Product is loading...</span>
          </motion.div>
        </div>
      ) : hasProducts ? (
        <div className="relative mt-10">
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className={`
              flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory
              ${scrollable ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent' : 'flex-wrap'}
              ${!scrollable && 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5'}
            `}
            style={{
              scrollbarWidth: 'thin',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {products.map((product) => (
              <motion.div
                key={product?._id}
                layout
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`
                  ${scrollable ? 'min-w-[180px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] snap-start' : 'w-full'}
                `}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Gradient Fade Effects */}
          {scrollable && hasProducts && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </>
          )}
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </Container>
  );
};

export default ProductGrid;