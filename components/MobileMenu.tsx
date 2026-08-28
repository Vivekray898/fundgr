"use client";
import { AlignLeft, X, Search, MapPin, CheckCircle, User, ChevronRight, ChevronDown, ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

interface MobileMenuProps {
  menuItems?: MenuItem[];
  searchPlaceholder?: string;
  storeLocatorSettings?: any;
  useCategories?: boolean;
}

const MobileMenu = ({ 
  menuItems,
  searchPlaceholder = "Wonach suchen Sie?",
  storeLocatorSettings = {},
  useCategories = false
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSortimentPage, setShowSortimentPage] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const pathname = usePathname();

  // Fetch categories ALWAYS
  useEffect(() => {
    getCategoriesForNav()
      .then(data => {
        console.log("Categories loaded in MobileMenu:", data);
        setCategories(data || []);
      })
      .catch(error => {
        console.error("Error loading categories:", error);
        setCategories([]);
      });
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const handleSortimentClick = () => {
    setShowSortimentPage(true);
    setExpandedCategory(null);
  };

  const handleBackClick = () => {
    setShowSortimentPage(false);
    setExpandedCategory(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowSortimentPage(false);
    setExpandedCategory(null);
  };

  // Use provided menuItems or default
  const items = menuItems && menuItems.length > 0 ? menuItems : [];

  // Filter to ONLY show top-level categories (no parent)
  const topLevelCategories = categories.filter(category => !category.parent);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 -ml-2 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-colors"
        aria-label="Menü"
      >
        <AlignLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleClose}
        />

        {/* Sidebar */}
        <div
          className={`absolute left-0 top-0 h-full w-[320px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header - Main Menu */}
          <div className="sticky top-0 bg-white z-10 border-b border-rose-100">
            <div className="flex items-center justify-between p-3">
              <button
                onClick={handleClose}
                className="p-2 -ml-2 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Search */}
              <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 ml-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-0.5"
                />
              </div>
            </div>
          </div>

          {/* Main Menu Content */}
          {!showSortimentPage ? (
            <nav className="overflow-y-auto h-[calc(100%-120px)]">
              <ul className="py-2">
                {/* Sortiment - Opens as separate page */}
                <li className="border-b border-rose-50">
                  <button
                    onClick={handleSortimentClick}
                    className="flex items-center justify-between w-full px-4 py-4 text-sm font-medium text-gray-700 hover:bg-rose-50 active:bg-rose-100 transition-colors"
                  >
                    <span className="text-base font-semibold">Sortiment</span>
                    <ChevronRight className="w-5 h-5 text-rose-400" />
                  </button>
                </li>

                {/* Other menu items */}
                {items.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isActive = pathname === item.url;
                  const isExpanded = expandedCategory === item.label;

                  return (
                    <li key={item.label} className="border-b border-rose-50">
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() => toggleCategory(item.label)}
                            className={`flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium transition-colors ${
                              isActive ? "text-rose-500" : "text-gray-700"
                            } hover:bg-rose-50 active:bg-rose-100`}
                          >
                            <span>{item.label}</span>
                            <ChevronDown 
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <ul className="bg-rose-50/30">
                              {item.children.map((child) => (
                                <li key={child.url}>
                                  <Link
                                    href={child.url}
                                    onClick={handleClose}
                                    className={`block px-8 py-3 text-sm transition-colors ${
                                      pathname === child.url
                                        ? "text-rose-500 font-medium"
                                        : "text-gray-600"
                                    } hover:text-rose-500 active:bg-rose-50`}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link
                                  href={item.url}
                                  onClick={handleClose}
                                  className="block px-8 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50 active:bg-rose-100"
                                >
                                  Alle anzeigen →
                                </Link>
                              </li>
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.url}
                          onClick={handleClose}
                          className={`block px-4 py-3.5 text-sm font-medium transition-colors ${
                            isActive ? "text-rose-500" : "text-gray-700"
                          } hover:bg-rose-50 active:bg-rose-100`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : (
            /* Sortiment Page - Sliding Submenu */
            <div className="h-[calc(100%-120px)] flex flex-col">
              {/* Submenu Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-rose-100 px-4 py-3 flex items-center gap-3">
                <button
                  onClick={handleBackClick}
                  className="p-2 -ml-2 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <p className="text-base font-bold text-gray-900">Sortiment</p>
              </div>

              {/* Categories List */}
              <div className="flex-1 overflow-y-auto">
                <ul className="py-2">
                  {/* Alle anzeigen link */}
                  <li className="border-b border-rose-50">
                    <Link
                      href="/sortiment"
                      onClick={handleClose}
                      className="block px-4 py-3.5 text-sm font-medium text-rose-500 hover:bg-rose-50 active:bg-rose-100"
                    >
                      Alle anzeigen
                    </Link>
                  </li>

                  {/* Top-Level Categories ONLY */}
                  {topLevelCategories.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-gray-500">No categories found</li>
                  ) : (
                    topLevelCategories.map((category) => {
                      const hasChildren = category.children && category.children.length > 0;
                      const isExpanded = expandedCategory === category._id;
                      
                      return (
                        <li key={category._id} className="border-b border-rose-50">
                          {hasChildren ? (
                            <>
                              <button
                                onClick={() => toggleCategory(category._id)}
                                className="flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-rose-50 active:bg-rose-100 transition-colors"
                              >
                                <span>{category.title}</span>
                                <ChevronDown 
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                              
                              {isExpanded && (
                                <ul className="bg-rose-50/30">
                                  {category.children.map((child: any) => (
                                    <li key={child._id}>
                                      <Link
                                        href={`/category/${child.slug?.current || child.slug}`}
                                        onClick={handleClose}
                                        className="block px-8 py-3 text-sm text-gray-600 hover:text-rose-500 hover:bg-rose-50 active:bg-rose-100 transition-colors"
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
                              onClick={handleClose}
                              className="block px-4 py-3.5 text-sm text-gray-700 hover:text-rose-500 hover:bg-rose-50 active:bg-rose-100 transition-colors"
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
            </div>
          )}

          {/* Bottom Actions - Only Store Locator with Border */}
          {!showSortimentPage && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-rose-100 p-4 pb-6">
              <div className="flex items-center">
                {/* Wrapper with border */}
                <div className="w-full border border-rose-200 rounded-xl overflow-hidden hover:border-rose-400 transition-colors">
                  <StoreLocator 
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-500 active:text-rose-500 transition-colors w-full px-4 py-3 bg-white hover:bg-rose-50/50"
                    settings={storeLocatorSettings}
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0 text-rose-400" />
                    <span className="flex-1 font-medium">Mein Markt</span>
                    <CheckCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                    <ChevronRight className="w-4 h-4 text-rose-300 flex-shrink-0" />
                  </StoreLocator>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;