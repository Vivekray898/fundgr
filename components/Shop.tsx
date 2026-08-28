// components/Shop.tsx
"use client";
import { BRANDS_QUERYResult, Category, Product } from "@/sanity.types";
import React, { useEffect, useState, useRef } from "react";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import { useSearchParams } from "next/navigation";
import BrandList from "./shop/BrandList";
import PriceList from "./shop/PriceList";
import { client } from "@/sanity/lib/client";
import { Loader2, SlidersHorizontal, X, Filter, ChevronDown } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import SeasonalNotice from "./SeasonalNotice";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  categories: Category[];
  brands: BRANDS_QUERYResult;
}

const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"categories" | "brands" | "price">("categories");
  const [isDesktop, setIsDesktop] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Check if desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Prevent body scroll when filter is open on mobile
  useEffect(() => {
    if (isFilterOpen && !isDesktop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen, isDesktop]);

  // Find selected seasonal category - LOOK DEEPER
  const selectedCategoryData = categories?.find(
    (cat) => cat.slug?.current === selectedCategory
  );
  
  // Check if category is seasonal - check both direct and nested
  const isSeasonalSelected = selectedCategoryData?.isSeasonal === true || 
    (selectedCategoryData as any)?.isSeasonal === true;

  console.log("Selected Category Data:", selectedCategoryData);
  console.log("Is Seasonal:", isSeasonalSelected);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let minPrice = 0;
      let maxPrice = 10000;
      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }

      let query;
      let params: any = { minPrice, maxPrice };

      if (selectedCategory) {
        query = `
          *[_type == 'product' 
            && references(*[_type == "category" && slug.current == $selectedCategory]._id)
            && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
            && price >= $minPrice && price <= $maxPrice
          ] 
          | order(name asc) {
            ...,"categories": categories[]->title
          }
        `;
        params = { ...params, selectedCategory, selectedBrand };
      } else if (selectedBrand) {
        query = `
          *[_type == 'product' 
            && references(*[_type == "brand" && slug.current == $selectedBrand]._id)
            && price >= $minPrice && price <= $maxPrice
          ] 
          | order(name asc) {
            ...,"categories": categories[]->title
          }
        `;
        params = { ...params, selectedBrand };
      } else {
        query = `
          *[_type == 'product' 
            && price >= $minPrice && price <= $maxPrice
          ] 
          | order(name asc) {
            ...,"categories": categories[]->title
          }
        `;
      }

      const data = await client.fetch(query, params, { next: { revalidate: 0 } });
      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, selectedPrice]);

  const topLevelCategories = categories?.filter(
    (category) => !category.parent
  );

  const hasActiveFilters = selectedCategory !== null || selectedBrand !== null || selectedPrice !== null;
  const activeFilterCount = [selectedCategory, selectedBrand, selectedPrice].filter(Boolean).length;

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPrice(null);
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  // Get seasonal message from category (handle both direct and nested)
  const seasonalMessage = selectedCategoryData?.seasonalMessage || 
    (selectedCategoryData as any)?.seasonalMessage;
  const seasonalStart = selectedCategoryData?.seasonalStart || 
    (selectedCategoryData as any)?.seasonalStart;
  const seasonalEnd = selectedCategoryData?.seasonalEnd || 
    (selectedCategoryData as any)?.seasonalEnd;
  const seasonalIcon = selectedCategoryData?.seasonalIcon || 
    (selectedCategoryData as any)?.seasonalIcon || "flower";

  return (
    <div className="border-t">
      <Container className="mt-5">
        {/* Header with Filter Toggle */}
        <div className="sticky top-0 z-10 bg-white pb-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Title className="text-lg uppercase tracking-wide">
              Get the products as your needs
            </Title>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-rose-500 underline text-sm font-medium hover:text-rose-600 hoverEffect"
                >
                  Reset Filters ({activeFilterCount})
                </button>
              )}
              {/* Mobile Filter Button */}
              <button
                onClick={toggleFilter}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors lg:hidden active:scale-95"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Seasonal Banner - Shows when seasonal category is selected */}
        {isSeasonalSelected && seasonalMessage && (
          <SeasonalNotice
            message={seasonalMessage}
            startDate={seasonalStart}
            endDate={seasonalEnd}
            icon={seasonalIcon || "flower"}
            variant="banner"
          />
        )}

        <div className="flex flex-col lg:flex-row gap-5 border-t border-rose-100/50 relative">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:sticky lg:top-20 lg:self-start lg:h-[calc(100vh-160px)] lg:overflow-y-auto lg:min-w-64 pb-5 lg:border-r border-rose-100/50 scrollbar-hide">
            <CategoryList
              categories={topLevelCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <BrandList
              brands={brands}
              setSelectedBrand={setSelectedBrand}
              selectedBrand={selectedBrand}
            />
            <PriceList
              setSelectedPrice={setSelectedPrice}
              selectedPrice={selectedPrice}
            />
          </div>

          {/* Mobile Filter - Bottom Sheet */}
          <AnimatePresence>
            {isFilterOpen && !isDesktop && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 z-[100]"
                  onClick={() => setIsFilterOpen(false)}
                />

                <motion.div
                  ref={filterRef}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col"
                  style={{ maxHeight: "92vh" }}
                >
                  {/* Drag Handle */}
                  <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                      {activeFilterCount > 0 && (
                        <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {activeFilterCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                        >
                          Reset All
                        </button>
                      )}
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex border-b border-gray-100 flex-shrink-0 px-1">
                    {[
                      { id: "categories", label: "Categories" },
                      { id: "brands", label: "Brands" },
                      { id: "price", label: "Price" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                          flex-1 py-3 text-sm font-medium transition-all relative
                          ${activeTab === tab.id ? "text-rose-500" : "text-gray-500"}
                        `}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-4 pb-24">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {activeTab === "categories" && (
                          <CategoryList
                            categories={topLevelCategories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            isMobile
                          />
                        )}
                        {activeTab === "brands" && (
                          <BrandList
                            brands={brands}
                            setSelectedBrand={setSelectedBrand}
                            selectedBrand={selectedBrand}
                            isMobile
                          />
                        )}
                        {activeTab === "price" && (
                          <PriceList
                            setSelectedPrice={setSelectedPrice}
                            selectedPrice={selectedPrice}
                            isMobile
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Footer Actions */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 rounded-b-3xl flex-shrink-0">
                    <div className="flex gap-3">
                      <button
                        onClick={resetFilters}
                        className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                      >
                        Reset All
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex-1 px-4 py-3 text-sm font-medium text-white bg-rose-500 rounded-xl hover:bg-rose-600 active:scale-95 transition-all"
                      >
                        Apply Filters
                        {activeFilterCount > 0 && ` (${activeFilterCount})`}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Product is loading . . .
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;