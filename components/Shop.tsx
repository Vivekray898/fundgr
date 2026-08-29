// components/Shop.tsx
"use client";
import { BRANDS_QUERY_RESULT, Category, Product } from "@/sanity.types";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Container from "./Container";
import Title from "./Title";
import CategoryList from "./shop/CategoryList";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import BrandList from "./shop/BrandList";
// import PriceList from "./shop/PriceList"; // Commented out
import SortList from "./shop/SortList";
import { client } from "@/sanity/lib/client";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import SeasonalNoProductAvailable from "./SeasonalNoProductAvailable";
import ProductCard from "./ProductCard";
import { motion } from "motion/react";

// Define interface for categories with children
interface CategoryWithChildren extends Omit<Category, 'parent' | 'slug'> {
  children?: Array<{
    _id: string;
    title: string;
    slug?: {
      current: string;
    } | string;
    isSeasonal?: boolean;
    seasonalMessage?: string;
    seasonalStart?: string;
    seasonalEnd?: string;
    seasonalIcon?: string;
  }>;
  parent?: {
    _ref: string;
  } | null;
  slug?: {
    current: string;
  } | string;
}

// Helper function to safely get slug string
const getSlugString = (slug: any): string => {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
};

interface Props {
  categories: Category[];
  brands: BRANDS_QUERY_RESULT;
}

const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const sortParams = searchParams?.get("sort");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null
  );
  const [selectedSort, setSelectedSort] = useState<string | null>(
    sortParams || null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"categories" | "brands" | "sort">("categories");
  const [isDesktop, setIsDesktop] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const isUpdatingFromURL = useRef(false);

  // Update URL when filters change
  const updateURL = useCallback((params: { category?: string | null; brand?: string | null; sort?: string | null }) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || "");
    
    // Update or remove params
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "null" && value !== "") {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });
    
    // Build the new URL
    const newUrl = currentParams.toString() 
      ? `${pathname}?${currentParams.toString()}`
      : pathname;
    
    // Use replace to avoid adding to browser history on every filter change
    router.replace(newUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  // Sync state with URL params when they change externally (e.g., back/forward buttons)
  useEffect(() => {
    const brand = searchParams?.get("brand");
    const category = searchParams?.get("category");
    const sort = searchParams?.get("sort");
    
    isUpdatingFromURL.current = true;
    
    if (category !== selectedCategory) {
      setSelectedCategory(category || null);
    }
    if (brand !== selectedBrand) {
      setSelectedBrand(brand || null);
    }
    if (sort !== selectedSort) {
      setSelectedSort(sort || null);
    }
    
    isUpdatingFromURL.current = false;
  }, [searchParams]);

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

  const typedCategories = categories as unknown as CategoryWithChildren[];

  const findSelectedCategory = (catSlug: string | null) => {
    if (!catSlug) return { category: null, parent: null };

    const topLevel = typedCategories?.find(
      (cat) => getSlugString(cat.slug) === catSlug
    );
    
    if (topLevel) return { category: topLevel, parent: null };

    for (const parentCat of typedCategories || []) {
      const child = parentCat.children?.find(
        (child) => getSlugString(child.slug) === catSlug
      );
      if (child) {
        return { category: child, parent: parentCat };
      }
    }

    const fullCategory = typedCategories?.find(
      (cat) => getSlugString(cat.slug) === catSlug
    );
    
    if (fullCategory) {
      const parent = typedCategories?.find(
        (cat) => cat._id === fullCategory.parent?._ref
      );
      return { category: fullCategory, parent: parent || null };
    }

    return { category: null, parent: null };
  };

  const { category: selectedCategoryData, parent: selectedParentData } = findSelectedCategory(selectedCategory);

  const isSeasonalSelected = selectedCategoryData?.isSeasonal === true || 
    selectedParentData?.isSeasonal === true;

  const seasonalMessage = selectedCategoryData?.seasonalMessage || 
    selectedParentData?.seasonalMessage;
  const seasonalStart = selectedCategoryData?.seasonalStart || 
    selectedParentData?.seasonalStart;
  const seasonalEnd = selectedCategoryData?.seasonalEnd || 
    selectedParentData?.seasonalEnd;
  const seasonalIcon = selectedCategoryData?.seasonalIcon || 
    selectedParentData?.seasonalIcon || "flower";

  // Find current brand name for fallback display
  const selectedBrandName = (brands as any[])?.find(
    (b) => (b.slug?.current || b.slug) === selectedBrand
  )?.name;

  const activeFilterLabel =
    selectedCategoryData?.title ||
    selectedBrandName ||
    (selectedCategory ? selectedCategory : selectedBrand ? selectedBrand : "alle Produkte");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query;
      let params: any = {};

      let sortOrder = "name asc";
      if (selectedSort === "popular") sortOrder = "popularity desc";
      else if (selectedSort === "newest") sortOrder = "_createdAt desc";
      else if (selectedSort === "name-asc") sortOrder = "name asc";
      else if (selectedSort === "name-desc") sortOrder = "name desc";
      else if (selectedSort === "rating") sortOrder = "rating desc";

      if (selectedCategory) {
        query = `
          *[_type == 'product' 
            && references(*[_type == "category" && slug.current == $selectedCategory]._id)
            && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
          ] 
          | order(${sortOrder}) {
            ...,"categories": categories[]->title
          }
        `;
        params = { ...params, selectedCategory, selectedBrand };
      } else if (selectedBrand) {
        query = `
          *[_type == 'product' 
            && references(*[_type == "brand" && slug.current == $selectedBrand]._id)
          ] 
          | order(${sortOrder}) {
            ...,"categories": categories[]->title
          }
        `;
        params = { ...params, selectedBrand };
      } else {
        query = `
          *[_type == 'product'] 
          | order(${sortOrder}) {
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
  }, [selectedCategory, selectedBrand, selectedSort]);

  const topLevelCategories = typedCategories?.filter(
    (category) => !category.parent
  );

  const hasActiveFilters = selectedCategory !== null || selectedBrand !== null || selectedSort !== null;
  const activeFilterCount = [selectedCategory, selectedBrand, selectedSort].filter(Boolean).length;

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedSort(null);
    
    // Update URL to remove all filter params
    updateURL({ category: null, brand: null, sort: null });
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  // Wrapped setter functions that update URL - now accepting SetStateAction
  const handleSetSelectedCategory = (value: React.SetStateAction<string | null>) => {
    const resolvedValue = typeof value === 'function' ? value(selectedCategory) : value;
    setSelectedCategory(resolvedValue);
    updateURL({ category: resolvedValue, brand: selectedBrand, sort: selectedSort });
  };

  const handleSetSelectedBrand = (value: React.SetStateAction<string | null>) => {
    const resolvedValue = typeof value === 'function' ? value(selectedBrand) : value;
    setSelectedBrand(resolvedValue);
    updateURL({ category: selectedCategory, brand: resolvedValue, sort: selectedSort });
  };

  const handleSetSelectedSort = (value: React.SetStateAction<string | null>) => {
    const resolvedValue = typeof value === 'function' ? value(selectedSort) : value;
    setSelectedSort(resolvedValue);
    updateURL({ category: selectedCategory, brand: selectedBrand, sort: resolvedValue });
  };

  return (
    <div className="border-t">
      <Container className="mt-3 sm:mt-5">
        {/* Simple Header - Not sticky, minimal */}
        <div className="pb-3 sm:pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base uppercase tracking-wide font-semibold text-gray-800">
              Produkte entdecken
            </h2>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-rose-500 underline text-xs font-medium hover:text-rose-600"
              >
                Filter zurücksetzen ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
        
        {/* Seasonal Banner */}
        {isSeasonalSelected && seasonalMessage && (
          <SeasonalNoProductAvailable
            selectedTab={selectedCategory || ""}
            isSeasonal={true}
            seasonalMessage={seasonalMessage}
            seasonalStart={seasonalStart}
            seasonalEnd={seasonalEnd}
            seasonalIcon={seasonalIcon}
            className="py-3"
            compact
          />
        )}

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 relative">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:sticky lg:top-20 lg:self-start lg:h-[calc(100vh-160px)] lg:overflow-y-auto lg:min-w-64 pb-5 lg:border-r border-rose-100/50 scrollbar-hide">
            <CategoryList
              categories={topLevelCategories as any}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleSetSelectedCategory}
            />
            <BrandList
              brands={brands}
              setSelectedBrand={handleSetSelectedBrand}
              selectedBrand={selectedBrand}
            />
            <SortList
              setSelectedSort={handleSetSelectedSort}
              selectedSort={selectedSort}
            />
          </div>

          {/* Mobile - Minimal Sticky Filter Button */}
          <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={toggleFilter}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 rounded-full text-sm font-medium text-white shadow-lg shadow-rose-500/30 active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="bg-white text-rose-500 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filter - Bottom Sheet */}
          {isFilterOpen && !isDesktop && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-[100]"
                onClick={() => setIsFilterOpen(false)}
              />

              <motion.div
                ref={filterRef}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl flex flex-col"
                style={{ maxHeight: "92vh" }}
              >
                <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-800">Filter</h2>
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
                        Alle zurücksetzen
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

                <div className="flex border-b border-gray-100 flex-shrink-0 px-1">
                  {[
                    { id: "categories", label: "Kategorien" },
                    { id: "brands", label: "Marken" },
                    { id: "sort", label: "Sortieren" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                        activeTab === tab.id ? "text-rose-500" : "text-gray-500"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 pb-24">
                  {activeTab === "categories" && (
                    <CategoryList
                      categories={topLevelCategories as any}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={handleSetSelectedCategory}
                      isMobile
                    />
                  )}
                  {activeTab === "brands" && (
                    <BrandList
                      brands={brands}
                      setSelectedBrand={handleSetSelectedBrand}
                      selectedBrand={selectedBrand}
                      isMobile
                    />
                  )}
                  {activeTab === "sort" && (
                    <SortList
                      setSelectedSort={handleSetSelectedSort}
                      selectedSort={selectedSort}
                      isMobile
                    />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 rounded-b-3xl flex-shrink-0">
                  <div className="flex gap-3">
                    <button
                      onClick={resetFilters}
                      className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Alle zurücksetzen
                    </button>
                    <button
                      onClick={applyFilters}
                      className="flex-1 px-4 py-3 text-sm font-medium text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-all"
                    >
                      Filter anwenden
                      {activeFilterCount > 0 && ` (${activeFilterCount})`}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Product Grid */}
          <div className="flex-1 pt-0 lg:pt-2">
            {loading ? (
              <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                <p className="font-semibold tracking-wide text-base">
                  Produkte werden geladen ...
                </p>
              </div>
            ) : products?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {products?.map((product) => (
                  <ProductCard key={product?._id} product={product} />
                ))}
              </div>
            ) : (
              <SeasonalNoProductAvailable
                selectedTab={activeFilterLabel}
                isSeasonal={isSeasonalSelected}
                seasonalMessage={seasonalMessage}
                seasonalStart={seasonalStart}
                seasonalEnd={seasonalEnd}
                seasonalIcon={seasonalIcon}
                className="bg-white mt-0"
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;