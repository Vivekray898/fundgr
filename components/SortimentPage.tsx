// components/SortimentPage.tsx
"use client";
import { useState } from "react";
import { motion } from "motion/react";
import SortimentHero from "./sortiment/SortimentHero";
import CategoryGrid from "./sortiment/CategoryGrid";
import PopularCategories from "./sortiment/PopularCategories";
import { Search, X } from "lucide-react";

// Define interface for category with flexible slug
interface Category {
  _id: string;
  title: string;
  slug?: {
    current: string;
  } | string;
  image?: string;
  teaserSubtitle?: string;
  description?: string;
  categoryIcon?: string;
  isSeasonal?: boolean;
  productCount?: number;
  parent?: {
    _ref: string;
  } | null;
}

// Helper function to safely get slug string
const getSlugString = (slug: any): string => {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
};

interface SortimentPageProps {
  categories: Category[];
}

const SortimentPage = ({ categories }: SortimentPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const topLevelCategories = categories?.filter(
    (category) => !category.parent
  );

  const filteredCategories = topLevelCategories?.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen pb-8 sm:pb-12">
      {/* Hero Section - More compact */}
      <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-blue-50 py-6 sm:py-8 md:py-10 text-center border-b border-pink-100">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Unser Sortiment
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 max-w-2xl mx-auto">
            Entdecken Sie unsere vielfältigen Produktkategorien
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        {/* Search Bar - Compact */}
        <div className="max-w-md mx-auto mb-4 sm:mb-6">
          <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </div>
            <input
              type="text"
              placeholder="Kategorien durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-7 sm:pl-9 pr-7 sm:pr-9 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 bg-white/80 backdrop-blur-sm transition-all duration-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
              >
                <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </button>
            )}
          </div>
          
          {searchTerm && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] sm:text-xs text-gray-500 mt-1 text-center"
            >
              {filteredCategories?.length} Kategorien gefunden
            </motion.p>
          )}
        </div>

        {/* Categories Grid - 2 columns on mobile */}
        {filteredCategories?.length > 0 ? (
          <CategoryGrid categories={filteredCategories} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12 md:py-16"
          >
            <div className="inline-block p-2 sm:p-3 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full mb-2 sm:mb-3">
              <Search className="w-5 sm:w-6 h-5 sm:h-6 text-rose-400" />
            </div>
            <p className="text-gray-500 text-sm sm:text-base">Keine Kategorien gefunden</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-3 sm:mt-4 px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs sm:text-sm font-medium hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all duration-300 shadow-lg shadow-rose-200/50"
            >
              Alle anzeigen
            </button>
          </motion.div>
        )}

        {/* Popular Categories */}
        {!searchTerm && <PopularCategories categories={topLevelCategories} />}
      </div>
    </div>
  );
};

export default SortimentPage;