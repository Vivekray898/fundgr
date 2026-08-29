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

const HeaderMenu = ({ 
  menuItems,
  useCategories = false,
  categoryParent,
  storeLocatorSettings = {}
}: HeaderMenuProps) => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<any[]>([]);
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

  return (
    <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-gray-700">
      {/* Sortiment Hamburger Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleSortimentClick}
          className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
            showSortiment
              ? "bg-rose-50 text-rose-600"
              : "hover:bg-rose-50 hover:text-rose-600"
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
          <div className="absolute left-0 top-full mt-0 w-[400px] bg-white rounded-b-lg shadow-xl border border-rose-100 py-2 z-50 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-2 border-b border-rose-100 sticky top-0 bg-white">
              <p className="text-base font-bold text-gray-900">Sortiment</p>
            </div>
            
            <ul className="py-1">
              {/* Alle anzeigen link */}
              <li>
                <Link
                  href="/sortiment"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  Alle anzeigen
                </Link>
              </li>
              
              <li className="border-t border-rose-100 my-1"></li>
              
              {/* Top-Level Categories ONLY */}
              {isLoading ? (
                <li className="px-4 py-3 text-sm text-gray-500">Loading...</li>
              ) : topLevelCategories.length === 0 ? (
                <li className="px-4 py-3 text-sm text-gray-500">No categories found</li>
              ) : (
                topLevelCategories.map((category) => {
                  const hasChildren = category.children && category.children.length > 0;
                  const isExpanded = expandedCategory === category._id;
                  
                  return (
                    <li key={category._id} className="relative">
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() => handleCategoryClick(category._id)}
                            className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                          >
                            <span>{category.title}</span>
                            <ChevronDown 
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          
                          {isExpanded && (
                            <ul className="bg-rose-50/30 py-1">
                              {category.children.map((child: any) => (
                                <li key={child._id}>
                                  <Link
                                    href={`/category/${child.slug?.current || child.slug}`}
                                    onClick={() => {
                                      setShowSortiment(false);
                                      setExpandedCategory(null);
                                    }}
                                    className="block pl-10 pr-4 py-2.5 text-sm text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                  >
                                    {child.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          href={`/category/${category.slug?.current || category.slug}`}
                          onClick={() => {
                            setShowSortiment(false);
                            setExpandedCategory(null);
                          }}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                        >
                          {category.title}
                        </Link>
                      )}
                    </li>
                  );
                })
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
            className={`px-4 py-3 text-base font-medium transition-all duration-200 ${
              isActive
                ? "text-rose-500 bg-rose-50"
                : "text-gray-700 hover:text-rose-500 hover:bg-rose-50"
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