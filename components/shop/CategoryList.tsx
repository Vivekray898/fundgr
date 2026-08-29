// components/shop/CategoryList.tsx
import { Category } from "@/sanity.types";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Tag, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
  categories?: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  isMobile?: boolean;
}

const CategoryList = ({
  categories: propCategories,
  selectedCategory,
  setSelectedCategory,
  isMobile = false,
}: Props) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setCategories(propCategories as unknown as CategoryWithChildren[]);
    }
  }, [propCategories]);

  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (category: any) => {
    const slug = category?.slug?.current || category?.slug || null;
    if (slug) {
      setSelectedCategory(slug);
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setExpandedCategories([]);
    setSearchTerm("");
  };

  const filterCategories = (cats: CategoryWithChildren[], term: string): CategoryWithChildren[] => {
    if (!term) return cats;
    
    return cats.filter(category => {
      const matchesTitle = category.title?.toLowerCase().includes(term.toLowerCase());
      const hasMatchingChildren = category.children?.some(
        (child: any) => child.title?.toLowerCase().includes(term.toLowerCase())
      );
      return matchesTitle || hasMatchingChildren;
    });
  };

  const topLevelCategories = categories?.filter(
    (category) => !category.parent
  );

  const filteredCategories = filterCategories(topLevelCategories || [], searchTerm);
  const selectedName = categories?.find(c => getSlugString(c.slug) === selectedCategory)?.title;

  // Mobile: Show as simple list without card wrapper
  if (isMobile) {
    return (
      <div className="pb-2">
        {/* Search */}
        <div className="relative mb-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Kategorien suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-3 text-sm border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all bg-white/80 focus:bg-white placeholder:text-gray-400"
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

        {/* Selected */}
        {selectedCategory && selectedName && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-500">Ausgewählt:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-700 text-sm font-medium rounded-full border border-rose-200">
              {selectedName}
              <button
                onClick={handleReset}
                className="ml-1 hover:text-rose-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        {/* List */}
        <ul className="space-y-1">
          {filteredCategories?.length === 0 ? (
            <li className="text-center py-6 text-sm text-gray-500">
              {searchTerm ? "Keine Kategorien gefunden" : "Keine Kategorien verfügbar"}
            </li>
          ) : (
            filteredCategories?.map((category) => {
              const hasChildren = category.children && category.children.length > 0;
              const isExpanded = expandedCategories.includes(category?._id);
              const isSelected = selectedCategory === getSlugString(category.slug);

              return (
                <li key={category?._id}>
                  <div
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all",
                      isSelected
                        ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 font-medium border border-rose-200"
                        : "hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    {hasChildren && (
                      <button
                        onClick={(e) => toggleCategory(category?._id, e)}
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-rose-100 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-rose-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    )}
                    
                    <span className={cn("text-sm flex-1", isSelected && "font-semibold")}>
                      {category?.title}
                    </span>
                    
                    {hasChildren && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {category.children?.length || 0}
                      </span>
                    )}
                    
                    {isSelected && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </div>

                  {hasChildren && isExpanded && (
                    <ul className="ml-4 mt-1 space-y-1 border-l-2 border-pink-100 pl-3">
                      {category.children?.map((child: any) => {
                        const childSlug = getSlugString(child.slug);
                        const isChildSelected = selectedCategory === childSlug;

                        return (
                          <li key={child?._id || childSlug}>
                            <div
                              onClick={() => handleCategoryClick(child)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                                isChildSelected
                                  ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 font-medium border border-rose-200"
                                  : "hover:bg-gray-50 text-gray-600"
                              )}
                            >
                              <span className={cn("text-sm", isChildSelected && "font-semibold")}>
                                {child?.title}
                              </span>
                              {isChildSelected && (
                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-500" />
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    );
  }

  // Desktop: Card UI
  return (
    <div className="w-full bg-white rounded-xl border border-pink-100 shadow-sm overflow-hidden mb-4">
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-blue-50 border-b border-pink-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-gray-800">Kategorien</h3>
          </div>
          {selectedCategory && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-rose-500 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Zurücksetzen</span>
            </button>
          )}
        </div>
        
        {selectedCategory && selectedName && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-gray-500">Ausgewählt:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-700 text-xs font-medium rounded-full border border-rose-200">
              {selectedName}
              <button
                onClick={handleReset}
                className="ml-0.5 hover:text-rose-700 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Kategorien suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border-2 border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all bg-white/80 focus:bg-white placeholder:text-gray-400"
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
      </div>

      <div className="px-2 pb-3 max-h-[300px] overflow-y-auto custom-scrollbar">
        <ul className="space-y-0.5">
          {filteredCategories?.length === 0 ? (
            <li className="text-center py-4 text-sm text-gray-500">
              {searchTerm ? "Keine Kategorien gefunden" : "Keine Kategorien verfügbar"}
            </li>
          ) : (
            filteredCategories?.map((category) => {
              const hasChildren = category.children && category.children.length > 0;
              const isExpanded = expandedCategories.includes(category?._id);
              const isSelected = selectedCategory === getSlugString(category.slug);

              return (
                <li key={category?._id}>
                  <div
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all",
                      isSelected
                        ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 font-medium border border-rose-200"
                        : "hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    {hasChildren && (
                      <button
                        onClick={(e) => toggleCategory(category?._id, e)}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-rose-100 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </button>
                    )}
                    
                    <span className={cn("text-sm flex-1", isSelected && "font-semibold")}>
                      {category?.title}
                    </span>
                    
                    {hasChildren && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {category.children?.length || 0}
                      </span>
                    )}
                    
                    {isSelected && (
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500" />
                    )}
                  </div>

                  {hasChildren && isExpanded && (
                    <ul className="ml-6 mt-0.5 space-y-0.5 border-l-2 border-pink-100 pl-2">
                      {category.children?.map((child: any) => {
                        const childSlug = getSlugString(child.slug);
                        const isChildSelected = selectedCategory === childSlug;

                        return (
                          <li key={child?._id || childSlug}>
                            <div
                              onClick={() => handleCategoryClick(child)}
                              className={cn(
                                "flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all",
                                isChildSelected
                                  ? "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 font-medium border border-rose-200"
                                  : "hover:bg-gray-50 text-gray-600"
                              )}
                            >
                              <span className={cn("text-sm", isChildSelected && "font-semibold")}>
                                {child?.title}
                              </span>
                              {isChildSelected && (
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500" />
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>

      {filteredCategories.length > 0 && (
        <div className="border-t border-pink-100 px-3 py-2 bg-gradient-to-r from-rose-50/30 via-pink-50/30 to-blue-50/30">
          <p className="text-xs text-gray-400">
            {filteredCategories.length} Kategorie{filteredCategories.length !== 1 ? 'n' : ''}
            {selectedCategory && ` • ${selectedName || '1 ausgewählt'}`}
          </p>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fbcfe8;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f472b6;
        }
      `}</style>
    </div>
  );
};

export default CategoryList;