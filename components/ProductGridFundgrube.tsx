// components/ProductGridFundgrube.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import { motion } from "motion/react";
import { client } from "@/sanity/lib/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "./Container";

// Define Product type locally
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

const ProductGridFundgrube = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch products with brand "Fundgrube" and status "new"
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = `*[_type == "product" && status == "new" && stock > 0 && brand->name == "Fundgrube"] | order(_createdAt desc)[0...12] {
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
        console.error("Error fetching Fundgrube products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Check scroll position
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
      // Arrows stay visible but dim/disable at the ends, rather than
      // vanishing — easier to spot for someone unfamiliar with swipe-scroll.
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < maxScroll - 4);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      handleScroll();
      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [products]);

  const scrollProducts = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      // Scroll by roughly one card width so a single tap moves a clear,
      // predictable amount rather than a jarring partial-card jump.
      const scrollAmount = 260;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const hasOverflow = canScrollLeft || canScrollRight;

  return (
    <Container className="flex flex-col lg:px-0 my-8 sm:my-10">
      {/* Centered Title Section */}
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-3xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Neu in der Fundgrube
        </h2>
        <p className="text-base sm:text-lg text-gray-700 mt-2 sm:mt-3">
          Entdecken Sie die neuesten Schnäppchen aus unserem Fundgrube-Sortiment
        </p>
        <div className="w-20 sm:w-24 h-1 sm:h-1.5 bg-amber-700 mx-auto mt-3 sm:mt-4 rounded-full" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 sm:py-12 min-h-[220px] sm:min-h-80 space-y-4 text-center bg-amber-50/60 rounded-xl w-full mt-4 sm:mt-10 border-2 border-amber-200/50">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-amber-200 border-t-amber-700 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-amber-700 rounded-full animate-pulse" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-700">
              Lade Fundgrube Produkte...
            </p>
          </div>
        </div>
      ) : products?.length ? (
        <div className="relative mt-4 sm:mt-10">
          {/* Subtle Gradient Fades */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-10 sm:w-14 bg-gradient-to-r from-white via-white/60 to-transparent pointer-events-none z-10 transition-opacity duration-500 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute right-0 top-0 bottom-0 w-10 sm:w-14 bg-gradient-to-l from-white via-white/60 to-transparent pointer-events-none z-10 transition-opacity duration-500 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 sm:pb-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {products.map((product, index) => (
              <motion.div
                key={product?._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                className="min-w-[170px] sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px] xl:min-w-[260px] max-w-[260px] snap-start flex-shrink-0"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows — larger, higher contrast, and only rendered
              when there's actually something to scroll to; dimmed (not
              hidden) at the end of the list so the button is always findable. */}
          {hasOverflow && (
            <>
              <button
                onClick={() => scrollProducts("left")}
                disabled={!canScrollLeft}
                className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-md border-2 border-amber-300/70 flex items-center justify-center hover:bg-amber-50 hover:border-amber-500 transition-all duration-200 z-20 ${
                  canScrollLeft ? "opacity-100" : "opacity-40 cursor-default"
                }`}
                aria-label="Nach links scrollen"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>

              <button
                onClick={() => scrollProducts("right")}
                disabled={!canScrollRight}
                className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-md border-2 border-amber-300/70 flex items-center justify-center hover:bg-amber-50 hover:border-amber-500 transition-all duration-200 z-20 ${
                  canScrollRight ? "opacity-100" : "opacity-40 cursor-default"
                }`}
                aria-label="Nach rechts scrollen"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}

          {/* Progress indicator — plain-language "Produkt X von Y" instead
              of a bare percentage, with a thicker, more visible bar. */}
          <div className="flex items-center gap-3 mt-4 px-1">
            <p className="text-sm sm:text-base text-gray-600 flex-shrink-0 whitespace-nowrap">
              <span className="font-bold text-gray-900">{products.length}</span> Produkte
            </p>
            <div className="flex-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-700 rounded-full"
                style={{ width: `${Math.max(scrollProgress * 100, 8)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-14 sm:py-16 bg-amber-50/60 rounded-xl mt-4 sm:mt-10 border-2 border-amber-200/50">
          <div className="text-6xl sm:text-7xl mb-4">🔍</div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Keine Fundgrube Produkte verfügbar
          </h3>
          <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
            Es tut uns leid, aber es gibt derzeit keine neuen Produkte in der{" "}
            <span className="font-bold text-gray-900">Fundgrube</span>
          </p>
          <p className="text-sm sm:text-base text-gray-500 mt-3">
            Schauen Sie später wieder vorbei – wir füllen regelmäßig neue Schnäppchen ein!
          </p>
        </div>
      )}
    </Container>
  );
};

export default ProductGridFundgrube;