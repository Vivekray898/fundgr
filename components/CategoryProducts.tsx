// components/CategoryProducts.tsx
"use client";
import { Category, Product } from "@/sanity.types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
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

// ✅ Updated: Define interface for categories with nested children support
interface CategoryWithChildren extends Omit<Category, 'parent' | 'slug'> {
  children?: CategoryWithChildren[];
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

const CategoryProducts = ({ categories, slug }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
  ) || [];

  // 🔥 UPDATED: Recursive function to find a category by slug in nested structure
  const findCategory = (catSlug: string) => {
    if (!catSlug) return { category: null, parent: null };

    // Recursive search function
    const searchInChildren = (
      categories: CategoryWithChildren[], 
      targetSlug: string, 
      parent: CategoryWithChildren | null = null
    ): { category: CategoryWithChildren | null; parent: CategoryWithChildren | null } => {
      for (const cat of categories) {
        // Check current category
        if (getSlugString(cat.slug) === targetSlug) {
          return { category: cat, parent };
        }
        
        // Check children recursively
        if (cat.children && cat.children.length > 0) {
          const result = searchInChildren(cat.children, targetSlug, cat);
          if (result.category) {
            return result;
          }
        }
      }
      return { category: null, parent: null };
    };

    // Start search from top level categories
    return searchInChildren(topLevelCategories, catSlug);
  };

  const { category: currentCategory, parent: parentCategory } = findCategory(currentSlug);

  const isSeasonal = currentCategory?.isSeasonal || parentCategory?.isSeasonal;
  const seasonalMessage = currentCategory?.seasonalMessage || parentCategory?.seasonalMessage;
  const seasonalStart = currentCategory?.seasonalStart || parentCategory?.seasonalStart;
  const seasonalEnd = currentCategory?.seasonalEnd || parentCategory?.seasonalEnd;
  const seasonalIcon = currentCategory?.seasonalIcon || parentCategory?.seasonalIcon;

  // Filter categories based on search (recursive)
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

  const filteredCategories = filterCategories(topLevelCategories, searchTerm);

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false });
    setIsMobileFilterOpen(false);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // ✅ FIXED: Updated fetchProducts to handle root categories like Shop page
  const fetchProducts = async (categorySlug: string) => {
    setLoading(true);
    try {
      let finalProducts: Product[] = [];

      // Check if this is a root category (like "Fundgrube", "Bestpreis", etc.)
      const isRootCategory = topLevelCategories.some(
        (cat) => getSlugString(cat.slug) === categorySlug
      );

      if (isRootCategory) {
        console.log('🏷️ Root category detected:', categorySlug);
        
        // For root categories, get ALL products from ALL subcategories
        const allCategoryQuery = `
          *[_type == 'category'] {
            _id,
            "descendantIds": [
              *[_type == 'category' && parent._ref == ^._id]._id,
              *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id,
              *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id]._id
            ]
          }
        `;
        
        const allCategoryData = await client.fetch(allCategoryQuery);
        
        // Flatten all category IDs
        let allCategoryIds: string[] = [];
        allCategoryData.forEach((cat: any) => {
          allCategoryIds.push(cat._id);
          const descendants = cat.descendantIds?.flat() || [];
          allCategoryIds = allCategoryIds.concat(descendants);
        });
        
        // Remove duplicates
        allCategoryIds = [...new Set(allCategoryIds)];
        
        console.log('📋 All Category IDs (for root):', allCategoryIds);
        
        if (allCategoryIds.length > 0) {
          const refChecks = allCategoryIds.map(id => `references(${JSON.stringify(id)})`).join(' || ');

          const productQuery = `
            *[_type == 'product' 
              && (${refChecks})
            ] | order(name asc) {
              _id,
              name,
              slug,
              price,
              discount,
              originalPrice,
              stock,
              status,
              isDeal,
              dealEndDate,
              "images": images[]{
                asset->{
                  _id,
                  url
                }
              },
              "categories": categories[]->title,
              "brand": brand->{
                _id,
                title,
                name,
                "slug": slug.current
              }
            }
          `;

          console.log('📝 Product Query (root):', productQuery);
          finalProducts = await client.fetch(productQuery, {}, { next: { revalidate: 0 } });
        } else {
          finalProducts = [];
        }
      } else {
        // Regular category - get this category and its descendants
        const categoryQuery = `
          *[_type == 'category' && slug.current == $slug][0]{
            _id,
            "descendantIds": [
              *[_type == 'category' && parent._ref == ^._id]._id,
              *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id,
              *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref in *[_type == 'category' && parent._ref == ^._id]._id]._id]._id
            ]
          }
        `;
        
        const categoryData = await client.fetch(categoryQuery, { slug: categorySlug });
        
        const descendantIds = categoryData?.descendantIds?.flat() || [];
        const allCategoryIds = [categoryData?._id, ...descendantIds].filter(Boolean);

        console.log('🔍 Category:', categorySlug);
        console.log('📋 All Category IDs:', allCategoryIds);

        if (allCategoryIds.length > 0) {
          const refChecks = allCategoryIds.map(id => `references(${JSON.stringify(id)})`).join(' || ');

          const productQuery = `
            *[_type == 'product' 
              && (${refChecks})
            ] | order(name asc) {
              _id,
              name,
              slug,
              price,
              discount,
              originalPrice,
              stock,
              status,
              isDeal,
              dealEndDate,
              "images": images[]{
                asset->{
                  _id,
                  url
                }
              },
              "categories": categories[]->title,
              "brand": brand->{
                _id,
                title,
                name,
                "slug": slug.current
              }
            }
          `;

          console.log('📝 Product Query:', productQuery);
          finalProducts = await client.fetch(productQuery, {}, { next: { revalidate: 0 } });
        } else {
          // Fallback: try direct reference
          const fallbackQuery = `
            *[_type == 'product' 
              && references(*[_type == "category" && slug.current == $slug]._id)
            ] | order(name asc) {
              _id,
              name,
              slug,
              price,
              discount,
              originalPrice,
              stock,
              status,
              isDeal,
              dealEndDate,
              "images": images[]{
                asset->{
                  _id,
                  url
                }
              },
              "categories": categories[]->title,
              "brand": brand->{
                _id,
                title,
                name,
                "slug": slug.current
              }
            }
          `;
          finalProducts = await client.fetch(fallbackQuery, { slug: categorySlug }, { next: { revalidate: 0 } });
        }
      }

      setProducts(finalProducts);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug]);

  // Get selected category name
  const { category: selectedCategory } = findCategory(currentSlug);
  const selectedName = selectedCategory?.title || 
    typedCategories?.find(c => getSlugString(c.slug) === currentSlug)?.title;

  const hasActiveFilters = currentSlug !== slug;

  // ✅ FIXED: Recursive function to render category tree (no nested buttons)
  const renderCategoryTree = (categories: CategoryWithChildren[], level: number = 0) => {
    return categories.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedCategory === item._id;
      const slugString = getSlugString(item.slug);
      const isActive = slugString === currentSlug;
      const childActive = item.children?.some(
        (child) => getSlugString(child.slug) === currentSlug
      );
      
      // Check if this category has a parent (for root detection)
      const isRoot = !item.parent;
      
      return (
        <div key={item?._id} className={cn(
          "border-b border-[#E8E3D8]/30 last:border-0",
          isRoot && level === 0 ? "font-medium" : ""
        )}>
          <div
            onClick={() => handleCategoryChange(slugString)}
            className={cn(
              "w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm flex items-center justify-between group cursor-pointer",
              isActive || childActive
                ? "bg-[#F5F0E8] text-[#1a1a1a] font-semibold border border-[#D4A853]"
                : "hover:bg-[#F5F0E8] text-[#1a1a1a]"
            )}
            style={{ paddingLeft: level > 0 ? `${16 + level * 16}px` : undefined }}
          >
            <span className="flex-1">{item?.title}</span>
            <div className="flex items-center gap-1.5">
              {hasChildren && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(item?._id);
                  }}
                  className="p-1 rounded hover:bg-[#E8E3D8] transition-colors cursor-pointer"
                >
                  <ChevronDown 
                    className={cn(
                      "w-3.5 h-3.5 transition-transform text-[#8A7A6A]",
                      isExpanded ? "rotate-180" : ""
                    )}
                  />
                </div>
              )}
              {(isActive || childActive) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
              )}
            </div>
          </div>
          
          {/* Children - Recursive */}
          {hasChildren && isExpanded && (
            <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-[#E8E3D8] pl-3">
              {renderCategoryTree(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="py-3 sm:py-5">
      {/* Mobile Filter Button - Sticky */}
      <div className="sticky top-0 z-10 bg-white pb-3 pt-1 lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#F8F6F2] hover:bg-[#F0EDE5] rounded-full text-xs sm:text-sm font-medium transition-colors active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#1a1a1a]" />
            <span>Kategorien</span>
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={() => handleCategoryChange(slug)}
              className="text-[#B8923A] underline text-xs sm:text-sm font-medium hover:text-[#9A7A2A]"
            >
              Zurück zu {typedCategories?.find(c => getSlugString(c.slug) === slug)?.title || slug}
            </button>
          )}
          
          {selectedName && currentSlug !== slug && (
            <span className="text-xs text-[#8A7A6A] bg-[#F8F6F2] px-2 py-1 rounded-full truncate max-w-[120px] sm:max-w-[200px]">
              {selectedName}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-3 sm:gap-5">
        {/* Desktop Sidebar - Same as Shop page */}
        <div className="hidden lg:block lg:sticky lg:top-20 lg:self-start lg:h-[calc(100vh-160px)] lg:overflow-y-auto lg:min-w-56 pb-5 lg:border-r border-[#E8E3D8]/50 scrollbar-hide">
          <div className="pr-4">
            {/* Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Kategorien suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border-2 border-[#E8E3D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-[#D4A853] bg-white/80 transition-all"
              />
              {searchTerm && (
                <div
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8A7A6A] hover:text-[#B8923A] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Categories List - Recursive */}
            <div className="space-y-1">
              {filteredCategories?.length === 0 ? (
                <div className="text-center py-8 text-sm text-[#8A7A6A]">
                  {searchTerm ? "Keine Kategorien gefunden" : "Keine Kategorien verfügbar"}
                </div>
              ) : (
                renderCategoryTree(filteredCategories)
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter - Bottom Sheet - Same as Shop page */}
        <AnimatePresence>
          {isMobileFilterOpen && !isDesktop && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-[100]"
                onClick={() => setIsMobileFilterOpen(false)}
              />

              <div
                ref={filterRef}
                className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col"
              >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                  <div className="w-12 h-1.5 bg-[#E8E3D8] rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pb-3 border-b border-[#E8E3D8] flex-shrink-0">
                  <h2 className="text-lg font-bold text-[#1a1a1a]">Kategorien</h2>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <button
                        onClick={() => {
                          handleCategoryChange(slug);
                          setIsMobileFilterOpen(false);
                        }}
                        className="text-sm text-[#B8923A] hover:text-[#9A7A2A] font-medium"
                      >
                        Zurücksetzen
                      </button>
                    )}
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-2 rounded-full hover:bg-[#F5F0E8] transition-colors"
                    >
                      <X className="w-5 h-5 text-[#1a1a1a]" />
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
                      className="w-full px-4 py-3 text-sm border-2 border-[#E8E3D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-[#D4A853] bg-white transition-all"
                    />
                    {searchTerm && (
                      <div
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7A6A] hover:text-[#B8923A] transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content - Recursive */}
                <div className="flex-1 overflow-y-auto px-5 pb-24">
                  <div className="space-y-1">
                    {filteredCategories?.length === 0 ? (
                      <div className="text-center py-8 text-sm text-[#8A7A6A]">
                        {searchTerm ? "Keine Kategorien gefunden" : "Keine Kategorien verfügbar"}
                      </div>
                    ) : (
                      filteredCategories.map((item) => {
                        const hasChildren = item.children && item.children.length > 0;
                        const isExpanded = expandedCategory === item._id;
                        const slugString = getSlugString(item.slug);
                        const isActive = slugString === currentSlug;
                        const childActive = item.children?.some(
                          (child) => getSlugString(child.slug) === currentSlug
                        );
                        
                        return (
                          <div key={item?._id} className="border-b border-[#E8E3D8]/30 last:border-0">
                            <div
                              onClick={() => handleCategoryChange(slugString)}
                              className={cn(
                                "w-full text-left px-3 py-3.5 rounded-xl transition-all text-sm flex items-center justify-between group cursor-pointer",
                                isActive || childActive
                                  ? "bg-[#F5F0E8] text-[#1a1a1a] font-semibold border border-[#D4A853]"
                                  : "hover:bg-[#F5F0E8] text-[#1a1a1a]"
                              )}
                            >
                              <span className="flex-1">{item?.title}</span>
                              <div className="flex items-center gap-2">
                                {hasChildren && (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCategory(item?._id);
                                    }}
                                    className="p-1 rounded hover:bg-[#E8E3D8] transition-colors cursor-pointer"
                                  >
                                    <ChevronDown 
                                      className={cn(
                                        "w-4 h-4 transition-transform text-[#8A7A6A]",
                                        isExpanded ? "rotate-180" : ""
                                      )}
                                    />
                                  </div>
                                )}
                                {(isActive || childActive) && (
                                  <span className="w-2 h-2 rounded-full bg-[#D4A853]" />
                                )}
                              </div>
                            </div>
                            
                            {/* Children - Recursive */}
                            {hasChildren && isExpanded && (
                              <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-[#E8E3D8] pl-3">
                                {item.children?.map((child) => {
                                  const childSlug = getSlugString(child.slug);
                                  const isChildActive = childSlug === currentSlug;
                                  const hasGrandChildren = child.children && child.children.length > 0;
                                  
                                  return (
                                    <div key={child?._id}>
                                      <div
                                        onClick={() => handleCategoryChange(childSlug)}
                                        className={cn(
                                          "w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm flex items-center justify-between group cursor-pointer",
                                          isChildActive
                                            ? "bg-[#F5F0E8] text-[#1a1a1a] font-semibold border border-[#D4A853]"
                                            : "hover:bg-[#F5F0E8] text-[#1a1a1a]"
                                        )}
                                      >
                                        <span className="flex-1">{child?.title}</span>
                                        <div className="flex items-center gap-2">
                                          {hasGrandChildren && (
                                            <ChevronRight className="w-4 h-4 text-[#8A7A6A]" />
                                          )}
                                          {isChildActive && (
                                            <span className="w-2 h-2 rounded-full bg-[#D4A853]" />
                                          )}
                                        </div>
                                      </div>
                                      {/* Show nested children if expanded */}
                                      {hasGrandChildren && isChildActive && (
                                        <div className="ml-4 mt-1 mb-1 text-xs text-[#8A7A6A] pl-2 border-l border-[#E8E3D8]">
                                          <span className="italic">Unterkategorien verfügbar</span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E3D8] p-4 rounded-b-3xl flex-shrink-0">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-[#1a1a1a] rounded-xl hover:bg-[#2a2a2a] active:scale-95 transition-all"
                  >
                    Fertig
                  </button>
                </div>
              </div>
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
            <div className="flex flex-col items-center justify-center py-10 sm:py-16 min-h-60 sm:min-h-80 space-y-3 sm:space-y-4 text-center bg-[#F8F6F2] rounded-lg w-full">
              <div className="flex items-center space-x-2 text-[#D4A853]">
                <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 animate-spin" />
                <span className="text-sm sm:text-base text-[#1a1a1a]">Produkte werden geladen...</span>
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