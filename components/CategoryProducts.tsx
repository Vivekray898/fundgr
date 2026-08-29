// components/CategoryProducts.tsx
"use client";
import { Category, Product } from "@/sanity.types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion } from "motion/react";
import { 
  Loader2, 
  ChevronDown, 
  ChevronRight, 
  Flower2, 
  Sun, 
  Leaf, 
  Snowflake, 
  TreePine, 
  Cloud, 
  Sprout, 
  SunMedium, 
  Star,
  SlidersHorizontal,
  X,
  Filter,
  ChevronLeft
} from "lucide-react";
import SeasonalNoProductAvailable from "./SeasonalNoProductAvailable";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
  slug: string;
}

// ✅ Define interface for categories with children
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

// ✅ Helper function to safely get slug string
const getSlugString = (slug: any): string => {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
};

const iconMap = {
  flower: Flower2,
  sun: Sun,
  autumn: Leaf,
  snowflake: Snowflake,
  christmas: TreePine,
  pumpkin: Star,
  rain: Cloud,
  spring: Sprout,
  summer: SunMedium,
};

const CategoryProducts = ({ categories, slug }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category");
  
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
    if (isMobileFilterOpen && !isDesktop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen, isDesktop]);

  // ✅ Cast categories to CategoryWithChildren[]
  const typedCategories = categories as unknown as CategoryWithChildren[];

  // Filter to only TOP-LEVEL categories (no parent)
  const topLevelCategories = typedCategories?.filter(
    (category) => !category.parent
  );

  // 🔥 FIXED: Find current category data (including children)
  const findCategory = (catSlug: string) => {
    // Search in top-level categories
    const topLevel = topLevelCategories?.find(
      (cat) => getSlugString(cat.slug) === catSlug
    );
    
    if (topLevel) return { category: topLevel, parent: null };

    // Search in children of all top-level categories
    for (const parentCat of topLevelCategories || []) {
      const child = parentCat.children?.find(
        (child) => getSlugString(child.slug) === catSlug
      );
      if (child) {
        return { category: child, parent: parentCat };
      }
    }

    // Also search in the full categories list (for safety)
    const fullCategory = typedCategories?.find(
      (cat) => getSlugString(cat.slug) === catSlug
    );
    
    if (fullCategory) {
      // Find parent if exists
      const parent = typedCategories?.find(
        (cat) => cat._id === fullCategory.parent?._ref
      );
      return { category: fullCategory, parent: parent || null };
    }

    return { category: null, parent: null };
  };

  const { category: currentCategory, parent: parentCategory } = findCategory(currentSlug);

  const isSeasonal = currentCategory?.isSeasonal || parentCategory?.isSeasonal;
  const seasonalMessage = currentCategory?.seasonalMessage || parentCategory?.seasonalMessage;
  const seasonalStart = currentCategory?.seasonalStart || parentCategory?.seasonalStart;
  const seasonalEnd = currentCategory?.seasonalEnd || parentCategory?.seasonalEnd;
  const seasonalIcon = currentCategory?.seasonalIcon || parentCategory?.seasonalIcon;

  // Filter categories based on search
  const filterCategories = (cats: CategoryWithChildren[], term: string): CategoryWithChildren[] => {
    if (!term) return cats;
    
    return cats.filter(category => {
      const matchesTitle = category.title?.toLowerCase().includes(term.toLowerCase());
      const hasMatchingChildren = category.children?.some(
        (child) => child.title?.toLowerCase().includes(term.toLowerCase())
      );
      return matchesTitle || hasMatchingChildren;
    });
  };

  const filteredCategories = filterCategories(topLevelCategories || [], searchTerm);

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false });
    setIsMobileFilterOpen(false);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const fetchProducts = async (categorySlug: string) => {
    setLoading(true);
    try {
      let query;
      let params: any = { categorySlug };

      const selectedCat = typedCategories?.find(
        (cat) => getSlugString(cat.slug) === categorySlug
      );

      if (selectedCat?.children && selectedCat.children.length > 0) {
        const childSlugs = selectedCat.children.map((child) => 
          getSlugString(child.slug)
        );
        
        query = `
          *[_type == 'product' 
            && (references(*[_type == "category" && slug.current == $categorySlug]._id)
              || references(*[_type == "category" && slug.current in $childSlugs]._id)
            )
          ] | order(name asc) {
            ...,"categories": categories[]->title
          }
        `;
        params = { ...params, childSlugs };
      } else {
        query = `
          *[_type == 'product' 
            && references(*[_type == "category" && slug.current == $categorySlug]._id)
          ] | order(name asc) {
            ...,"categories": categories[]->title
          }
        `;
      }

      const data = await client.fetch(query, params);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug, categories]);

  // Get selected category name
  const selectedName = currentCategory?.title || 
    typedCategories?.find(c => getSlugString(c.slug) === currentSlug)?.title;

  const hasActiveFilters = currentSlug !== slug;

  return (
    <div className="py-3 sm:py-5">
      {/* Mobile Filter Button - Sticky */}
      <div className="sticky top-0 z-10 bg-white pb-3 pt-1 lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs sm:text-sm font-medium transition-colors active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span>Kategorien</span>
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={() => handleCategoryChange(slug)}
              className="text-rose-500 underline text-xs sm:text-sm font-medium hover:text-rose-600"
            >
              Zurück zu {typedCategories?.find(c => getSlugString(c.slug) === slug)?.title || slug}
            </button>
          )}
          
          {selectedName && currentSlug !== slug && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full truncate max-w-[120px] sm:max-w-[200px]">
              {selectedName}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-3 sm:gap-5">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:sticky lg:top-20 lg:self-start lg:h-[calc(100vh-160px)] lg:overflow-y-auto lg:min-w-56 pb-5 lg:border-r border-rose-100/50 scrollbar-hide">
          <div className="pr-4">
            {/* Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Kategorien suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border-2 border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 bg-white/80 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Categories List */}
            <div className="space-y-1">
              {filteredCategories?.map((item: CategoryWithChildren) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedCategory === item._id;
                const slugString = getSlugString(item.slug);
                const isActive = slugString === currentSlug;
                const childActive = item.children?.some(
                  (child) => getSlugString(child.slug) === currentSlug
                );
                
                return (
                  <div key={item?._id} className="border-b border-pink-50 last:border-0">
                    <button
                      onClick={() => handleCategoryChange(slugString)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm flex items-center justify-between group",
                        isActive || childActive
                          ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 font-semibold"
                          : "hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      <span className="flex-1">{item?.title}</span>
                      <div className="flex items-center gap-1.5">
                        {hasChildren && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCategory(item?._id);
                            }}
                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            <ChevronDown 
                              className={cn(
                                "w-3.5 h-3.5 transition-transform",
                                isExpanded ? "rotate-180" : ""
                              )}
                            />
                          </button>
                        )}
                        {(isActive || childActive) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        )}
                      </div>
                    </button>
                    
                    {/* Children */}
                    {hasChildren && isExpanded && (
                      <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-pink-100 pl-3">
                        {item.children?.map((child) => {
                          const childSlug = getSlugString(child.slug);
                          const isChildActive = childSlug === currentSlug;
                          return (
                            <button
                              key={child?._id}
                              onClick={() => handleCategoryChange(childSlug)}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-lg transition-all text-sm flex items-center justify-between group",
                                isChildActive
                                  ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 font-semibold"
                                  : "hover:bg-gray-50 text-gray-600"
                              )}
                            >
                              <span className="flex-1">{child?.title}</span>
                              {isChildActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-8 text-sm text-gray-500">
                {searchTerm ? "Keine Kategorien gefunden" : "Keine Kategorien verfügbar"}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter - Bottom Sheet */}
        <AnimatePresence>
          {isMobileFilterOpen && !isDesktop && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-[100]"
                onClick={() => setIsMobileFilterOpen(false)}
              />

              <motion.div
                ref={filterRef}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col"
              >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pb-3 border-b border-pink-100 flex-shrink-0">
                  <h2 className="text-lg font-bold text-gray-800">Kategorien</h2>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <button
                        onClick={() => {
                          handleCategoryChange(slug);
                          setIsMobileFilterOpen(false);
                        }}
                        className="text-sm text-rose-500 hover:text-rose-600 font-medium"
                      >
                        Zurücksetzen
                      </button>
                    )}
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="px-5 pt-3 pb-2 flex-shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Kategorien suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 text-sm border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 bg-white transition-all"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 pb-24">
                  <div className="space-y-1">
                    {filteredCategories?.map((item: CategoryWithChildren) => {
                      const hasChildren = item.children && item.children.length > 0;
                      const isExpanded = expandedCategory === item._id;
                      const slugString = getSlugString(item.slug);
                      const isActive = slugString === currentSlug;
                      const childActive = item.children?.some(
                        (child) => getSlugString(child.slug) === currentSlug
                      );
                      
                      return (
                        <div key={item?._id} className="border-b border-pink-50 last:border-0">
                          <button
                            onClick={() => handleCategoryChange(slugString)}
                            className={cn(
                              "w-full text-left px-3 py-3.5 rounded-xl transition-all text-sm flex items-center justify-between group",
                              isActive || childActive
                                ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 font-semibold"
                                : "hover:bg-gray-50 text-gray-700"
                            )}
                          >
                            <span className="flex-1">{item?.title}</span>
                            <div className="flex items-center gap-2">
                              {hasChildren && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCategory(item?._id);
                                  }}
                                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                                >
                                  <ChevronDown 
                                    className={cn(
                                      "w-4 h-4 transition-transform",
                                      isExpanded ? "rotate-180" : ""
                                    )}
                                  />
                                </button>
                              )}
                              {(isActive || childActive) && (
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                              )}
                            </div>
                          </button>
                          
                          {hasChildren && isExpanded && (
                            <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-pink-100 pl-3">
                              {item.children?.map((child) => {
                                const childSlug = getSlugString(child.slug);
                                const isChildActive = childSlug === currentSlug;
                                return (
                                  <button
                                    key={child?._id}
                                    onClick={() => handleCategoryChange(childSlug)}
                                    className={cn(
                                      "w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm flex items-center justify-between group",
                                      isChildActive
                                        ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 font-semibold"
                                        : "hover:bg-gray-50 text-gray-600"
                                    )}
                                  >
                                    <span className="flex-1">{child?.title}</span>
                                    {isChildActive && (
                                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {filteredCategories.length === 0 && (
                    <div className="text-center py-8 text-sm text-gray-500">
                      {searchTerm ? "Keine Kategorien gefunden" : "Keine Kategorien verfügbar"}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-pink-100 p-4 rounded-b-3xl flex-shrink-0">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all"
                  >
                    Fertig
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Products */}
        <div className="flex-1 w-full lg:pl-4">
          {/* Seasonal Banner */}
          {isSeasonal && seasonalMessage && (
            <div className="mb-3 sm:mb-4">
              <SeasonalNoProductAvailable
                selectedTab={currentSlug}
                isSeasonal={true}
                seasonalMessage={seasonalMessage}
                seasonalStart={seasonalStart}
                seasonalEnd={seasonalEnd}
                seasonalIcon={seasonalIcon}
                className="py-3 sm:py-4"
                compact
              />
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 sm:py-16 min-h-60 sm:min-h-80 space-y-3 sm:space-y-4 text-center bg-gray-100 rounded-lg w-full">
              <div className="flex items-center space-x-2 text-rose-500">
                <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                <span className="text-sm sm:text-base">Produkte werden geladen...</span>
              </div>
            </div>
          ) : products?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {products?.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <SeasonalNoProductAvailable
              selectedTab={currentSlug}
              isSeasonal={isSeasonal}
              seasonalMessage={seasonalMessage}
              seasonalStart={seasonalStart}
              seasonalEnd={seasonalEnd}
              seasonalIcon={seasonalIcon}
              className="mt-0 w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;