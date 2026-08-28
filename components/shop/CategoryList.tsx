// components/shop/CategoryList.tsx
import { Category } from "@/sanity.types";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setCategories(propCategories);
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

  const filterCategories = (categories: Category[], term: string): Category[] => {
    if (!term) return categories;
    
    return categories.filter(category => {
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
  const selectedName = categories?.find(c => (c.slug?.current || c.slug) === selectedCategory)?.title;

  // Mobile: Show as simple list without card wrapper
  if (isMobile) {
    return (
      <div className="pb-2">
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shop_light_green/50 focus:border-shop_light_green transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Selected */}
        {selectedCategory && selectedName && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-500">Selected:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-shop_light_green/10 text-shop_dark_green text-sm font-medium rounded-full">
              {selectedName}
              <button
                onClick={handleReset}
                className="ml-1 hover:text-red-500 transition-colors"
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
              {searchTerm ? "No categories match your search" : "No categories found"}
            </li>
          ) : (
            filteredCategories?.map((category) => {
              const hasChildren = category.children && category.children.length > 0;
              const isExpanded = expandedCategories.includes(category?._id);
              const isSelected = selectedCategory === (category?.slug?.current || category?.slug);

              return (
                <li key={category?._id}>
                  <div
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all",
                      isSelected
                        ? "bg-shop_light_green/10 text-shop_dark_green font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    {hasChildren && (
                      <button
                        onClick={(e) => toggleCategory(category?._id, e)}
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    
                    <span className={cn("text-sm flex-1", isSelected && "font-semibold")}>
                      {category?.title}
                    </span>
                    
                    {hasChildren && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {category.children.length}
                      </span>
                    )}
                    
                    {isSelected && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-shop_light_green" />
                    )}
                  </div>

                  {hasChildren && isExpanded && (
                    <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                      {category.children?.map((child: any) => {
                        const childSlug = child?.slug?.current || child?.slug;
                        const isChildSelected = selectedCategory === childSlug;

                        return (
                          <li key={child?._id || childSlug}>
                            <div
                              onClick={() => handleCategoryClick(child)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                                isChildSelected
                                  ? "bg-shop_light_green/10 text-shop_dark_green font-medium"
                                  : "hover:bg-gray-50 text-gray-600"
                              )}
                            >
                              <span className={cn("text-sm", isChildSelected && "font-semibold")}>
                                {child?.title}
                              </span>
                              {isChildSelected && (
                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-shop_light_green" />
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

  // Desktop: Original card UI
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-shop_light_green" />
            <h3 className="text-sm font-bold text-gray-800">Categories</h3>
          </div>
          {selectedCategory && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
        
        {selectedCategory && selectedName && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-gray-500">Selected:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-shop_light_green/10 text-shop_dark_green text-xs font-medium rounded-full">
              {selectedName}
              <button
                onClick={handleReset}
                className="ml-0.5 hover:text-red-500 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_light_green/50 focus:border-shop_light_green transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              {searchTerm ? "No categories match your search" : "No categories found"}
            </li>
          ) : (
            filteredCategories?.map((category) => {
              // ... same as before
              const hasChildren = category.children && category.children.length > 0;
              const isExpanded = expandedCategories.includes(category?._id);
              const isSelected = selectedCategory === (category?.slug?.current || category?.slug);

              return (
                <li key={category?._id}>
                  <div
                    onClick={() => handleCategoryClick(category)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all",
                      isSelected
                        ? "bg-shop_light_green/10 text-shop_dark_green font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    )}
                  >
                    {hasChildren && (
                      <button
                        onClick={(e) => toggleCategory(category?._id, e)}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                    
                    <span className={cn("text-sm flex-1", isSelected && "font-semibold")}>
                      {category?.title}
                    </span>
                    
                    {hasChildren && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {category.children.length}
                      </span>
                    )}
                    
                    {isSelected && (
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-shop_light_green" />
                    )}
                  </div>

                  {hasChildren && isExpanded && (
                    <ul className="ml-6 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-2">
                      {category.children?.map((child: any) => {
                        const childSlug = child?.slug?.current || child?.slug;
                        const isChildSelected = selectedCategory === childSlug;

                        return (
                          <li key={child?._id || childSlug}>
                            <div
                              onClick={() => handleCategoryClick(child)}
                              className={cn(
                                "flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all",
                                isChildSelected
                                  ? "bg-shop_light_green/10 text-shop_dark_green font-medium"
                                  : "hover:bg-gray-50 text-gray-600"
                              )}
                            >
                              <span className={cn("text-sm", isChildSelected && "font-semibold")}>
                                {child?.title}
                              </span>
                              {isChildSelected && (
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-shop_light_green" />
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
        <div className="border-t border-gray-100 px-3 py-2 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            {filteredCategories.length} category{filteredCategories.length !== 1 ? 'ies' : ''}
            {selectedCategory && ` • ${selectedName || '1 selected'}`}
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
          background: #d1d5db;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default CategoryList;