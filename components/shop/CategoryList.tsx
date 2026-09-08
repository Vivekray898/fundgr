// components/shop/CategoryList.tsx
import { Category } from "@/sanity.types";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Tag, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Define interface for categories with nested children
interface CategoryWithChildren extends Omit<Category, 'parent' | 'slug'> {
  children?: CategoryWithChildren[];
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

// Recursive category item component
const CategoryItem = ({ 
  category, 
  selectedCategory, 
  setSelectedCategory, 
  expandedCategories, 
  toggleCategory,
  searchTerm,
  level = 0
}: { 
  category: CategoryWithChildren;
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  expandedCategories: string[];
  toggleCategory: (categoryId: string, e: React.MouseEvent) => void;
  searchTerm?: string;
  level?: number;
}) => {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories.includes(category._id);
  const isSelected = selectedCategory === getSlugString(category.slug);
  const slug = getSlugString(category.slug);

  // Filter children based on search term
  const filteredChildren = hasChildren && searchTerm 
    ? category.children?.filter(child => 
        child.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : category.children;

  return (
    <li className="relative">
      <div
        onClick={() => {
          if (slug) {
            setSelectedCategory(slug);
          }
        }}
        className={cn(
          "flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all",
          isSelected
            ? "bg-[#F5F0E8] text-[#1a1a1a] font-medium border border-[#D4A853]"
            : "hover:bg-[#F5F0E8] text-[#1a1a1a]",
          level > 0 && "ml-4"
        )}
        style={{ paddingLeft: level > 0 ? `${level * 12 + 8}px` : undefined }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCategory(category._id, e);
            }}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-[#E8E3D8] transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#D4A853]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#8A7A6A]" />
            )}
          </button>
        )}
        
        <span className={cn("text-sm flex-1", isSelected && "font-semibold")}>
          {category?.title}
        </span>
        
        {hasChildren && (
          <span className="text-xs text-[#8A7A6A] bg-[#E8E3D8]/30 px-1.5 py-0.5 rounded-full">
            {category.children?.length || 0}
          </span>
        )}
        
        {isSelected && (
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
        )}
      </div>

      {hasChildren && isExpanded && filteredChildren && filteredChildren.length > 0 && (
        <ul className="space-y-0.5">
          {filteredChildren.map((child) => (
            <CategoryItem
              key={child._id}
              category={child}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              expandedCategories={expandedCategories}
              toggleCategory={toggleCategory}
              searchTerm={searchTerm}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

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

  // Only show top-level categories (no parent)
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
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7A6A]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Kategorien suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-9 py-3 text-sm border-2 border-[#E8E3D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-[#D4A853] transition-all bg-white/80 focus:bg-white placeholder:text-[#8A7A6A]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7A6A] hover:text-[#B8923A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Selected */}
        {selectedCategory && selectedName && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-[#8A7A6A]">Ausgewählt:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5F0E8] text-[#1a1a1a] text-sm font-medium rounded-full border border-[#D4A853]">
              {selectedName}
              <button
                onClick={handleReset}
                className="ml-1 hover:text-[#B8923A] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        {/* List */}
        <ul className="space-y-1">
          {filteredCategories?.length === 0 ? (
            <li className="text-center py-6 text-sm text-[#8A7A6A]">
              {searchTerm ? "Keine Kategorien gefunden" : "Keine Kategorien verfügbar"}
            </li>
          ) : (
            filteredCategories?.map((category) => (
              <CategoryItem
                key={category._id}
                category={category}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                searchTerm={searchTerm}
                level={0}
              />
            ))
          )}
        </ul>
      </div>
    );
  }

  // Desktop: Card UI
  return (
    <div className="w-full bg-white rounded-xl border border-[#E8E3D8] shadow-sm overflow-hidden mb-4">
      <div className="bg-[#F8F6F2] border-b border-[#E8E3D8] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#D4A853]" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">Kategorien</h3>
          </div>
          {selectedCategory && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-medium text-[#8A7A6A] hover:text-[#B8923A] transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Zurücksetzen</span>
            </button>
          )}
        </div>
        
        {selectedCategory && selectedName && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-[#8A7A6A]">Ausgewählt:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F5F0E8] text-[#1a1a1a] text-xs font-medium rounded-full border border-[#D4A853]">
              {selectedName}
              <button
                onClick={handleReset}
                className="ml-0.5 hover:text-[#B8923A] transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7A6A]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Kategorien suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border-2 border-[#E8E3D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A853] focus:border-[#D4A853] transition-all bg-white/80 focus:bg-white placeholder:text-[#8A7A6A]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8A7A6A] hover:text-[#B8923A] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="px-2 pb-3 max-h-[300px] overflow-y-auto custom-scrollbar">
        <ul className="space-y-0.5">
          {filteredCategories?.length === 0 ? (
            <li className="text-center py-4 text-sm text-[#8A7A6A]">
              {searchTerm ? "Keine Kategorien gefunden" : "Keine Kategorien verfügbar"}
            </li>
          ) : (
            filteredCategories?.map((category) => (
              <CategoryItem
                key={category._id}
                category={category}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                searchTerm={searchTerm}
                level={0}
              />
            ))
          )}
        </ul>
      </div>

      {filteredCategories.length > 0 && (
        <div className="border-t border-[#E8E3D8] px-3 py-2 bg-[#F8F6F2]">
          <p className="text-xs text-[#8A7A6A]">
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
          background: #E8E3D8;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D4A853;
        }
      `}</style>
    </div>
  );
};

export default CategoryList;