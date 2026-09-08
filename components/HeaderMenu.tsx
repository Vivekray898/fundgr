// components/HeaderMenu.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import StoreLocator from "./StoreLocator";
import { getCategoriesForNav } from "@/sanity/queries/header";

interface MenuItem {
  label: string;
  url: string;
  children?: Array<{
    label: string;
    url: string;
  }>;
}

interface CategoryWithChildren {
  _id: string;
  title: string;
  slug: {
    current: string;
  } | string;
  parent?: {
    _ref: string;
  } | null;
  children?: CategoryWithChildren[];
  isSeasonal?: boolean;
  seasonalMessage?: string;
  seasonalStart?: string;
  seasonalEnd?: string;
  seasonalIcon?: string;
}

interface HeaderMenuProps {
  menuItems?: MenuItem[];
  useCategories?: boolean;
  categoryParent?: {
    _id: string;
    title: string;
  } | {
    _ref: string;
  } | null | undefined;
  storeLocatorSettings?: any;
}

// Helper function to safely get slug string
const getSlugString = (slug: any): string => {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
};

const HeaderMenu = ({ 
  menuItems,
  useCategories = false,
  categoryParent,
  storeLocatorSettings = {}
}: HeaderMenuProps) => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSortiment, setShowSortiment] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories ALWAYS
  useEffect(() => {
    setIsLoading(true);
    getCategoriesForNav()
      .then(data => {
        console.log("Categories loaded in HeaderMenu:", data);
        setCategories(data || []);
      })
      .catch(error => {
        console.error("Error loading categories:", error);
        setCategories([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSortiment(false);
        setExpandedCategory(null);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build menu items from categories or use defaults
  const getMenuItems = (): MenuItem[] => {
    return menuItems && menuItems.length > 0 ? menuItems : [];
  };

  const items = getMenuItems();

  const handleSortimentClick = () => {
    setShowSortiment(!showSortiment);
    setExpandedCategory(null);
  };

  const handleCategoryClick = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Filter to ONLY show top-level categories (no parent)
  const topLevelCategories = categories.filter(category => !category.parent);

  // Recursive function to render category tree
  const renderCategoryTree = (categories: CategoryWithChildren[], level: number = 0) => {
    return categories.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategory === category._id;
      const slug = getSlugString(category.slug);
      
      return (
        <li key={category._id} className={level === 0 ? "border-t border-amber-200/30 first:border-t-0" : ""}>
          {hasChildren ? (
            <>
              <button
                onClick={() => handleCategoryClick(category._id)}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors ${
                  level > 0 ? 'pl-' + (4 + level * 4) : ''
                }`}
                style={{ paddingLeft: `${16 + level * 16}px` }}
              >
                <span className={level > 0 ? "text-sm" : "text-base"}>
                  {category.title}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {isExpanded && category.children && (
                <ul className="bg-amber-50/30">
                  {renderCategoryTree(category.children, level + 1)}
                </ul>
              )}
            </>
          ) : (
            <Link
              href={`/category/${slug}`}
              onClick={() => {
                setShowSortiment(false);
                setExpandedCategory(null);
              }}
              className={`block px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors ${
                level > 0 ? 'pl-' + (4 + level * 4) : ''
              }`}
              style={{ paddingLeft: `${16 + level * 16}px` }}
            >
              {category.title}
            </Link>
          )}
        </li>
      );
    });
  };

  return (
    <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-gray-700">
      {/* Sortiment Hamburger Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleSortimentClick}
          className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-lg ${
            showSortiment
              ? "bg-amber-50 text-amber-800"
              : "hover:bg-amber-50 hover:text-amber-800"
          }`}
        >
          {/* Hamburger icon */}
          <div className="flex flex-col gap-1.5">
            <div className="w-6 h-0.5 bg-current rounded-full"></div>
            <div className="w-6 h-0.5 bg-current rounded-full"></div>
            <div className="w-6 h-0.5 bg-current rounded-full"></div>
          </div>
          <span className="text-base font-semibold">Sortiment</span>
        </button>

        {/* Dropdown Menu */}
        {showSortiment && (
          <div className="absolute left-0 top-full mt-0 w-[400px] bg-white rounded-b-lg shadow-xl border border-amber-200/40 py-2 z-50 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-2 border-b border-amber-200/30 sticky top-0 bg-white">
              <p className="text-base font-bold text-gray-900">Sortiment</p>
            </div>
            
            <ul className="py-1">
              {/* Alle anzeigen link */}
              <li>
                <Link
                  href="/sortiment"
                  onClick={() => {
                    setShowSortiment(false);
                    setExpandedCategory(null);
                  }}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                >
                  Alle anzeigen
                </Link>
              </li>
              
              <li className="border-t border-amber-200/30 my-1"></li>
              
              {/* Top-Level Categories with nested children */}
              {isLoading ? (
                <li className="px-4 py-3 text-sm text-gray-500">Lade Kategorien...</li>
              ) : topLevelCategories.length === 0 ? (
                <li className="px-4 py-3 text-sm text-gray-500">Keine Kategorien gefunden</li>
              ) : (
                renderCategoryTree(topLevelCategories)
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Regular Menu Items */}
      {items.map((item) => {
        const isActive = pathname === item.url || pathname?.startsWith(item.url + "/");

        return (
          <Link
            key={item.label}
            href={item.url}
            className={`px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg ${
              isActive
                ? "text-amber-800 bg-amber-50"
                : "text-gray-700 hover:text-amber-800 hover:bg-amber-50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default HeaderMenu;