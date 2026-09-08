// components/MobileMenu.tsx
"use client";
import { AlignLeft, X, MapPin, CheckCircle, ChevronRight, ChevronDown, ArrowLeft, Search, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import StoreLocator from "./StoreLocator";
import { getCategoriesForNav } from "@/sanity/queries/header";
import { client } from "@/sanity/lib/client";
import Image from "next/image";

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

interface MobileMenuProps {
  menuItems?: MenuItem[];
  searchPlaceholder?: string;
  storeLocatorSettings?: any;
  useCategories?: boolean;
}

interface ProductSuggestion {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  images?: any[];
  image?: string;
  price: number;
}

// Helper function to safely get slug string
const getSlugString = (slug: any): string => {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
};

const MobileMenu = ({ 
  menuItems,
  searchPlaceholder = "Wonach suchen Sie?",
  storeLocatorSettings = {},
  useCategories = false
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSortimentPage, setShowSortimentPage] = useState(false);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [productSuggestions, setProductSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [storeLocatorKey, setStoreLocatorKey] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Fetch live product suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setProductSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const data = await client.fetch(
          `*[_type == 'product' && (name match $searchTerm || description match $searchTerm)] | order(name asc) [0...6] {
            _id,
            name,
            slug,
            price,
            "image": images[0].asset->url
          }`,
          { searchTerm: `${searchQuery}*` }
        );
        setProductSuggestions(data || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setProductSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

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

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Re-mount StoreLocator when menu opens to ensure it's fresh
  useEffect(() => {
    if (isOpen) {
      setStoreLocatorKey(prev => prev + 1);
    }
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
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      handleClose();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(suggestion)}`);
      handleClose();
    }, 100);
  };

  const handleProductClick = (product: ProductSuggestion) => {
    router.push(`/product/${product.slug.current}`);
    handleClose();
  };

  // Use provided menuItems or default
  const items = menuItems && menuItems.length > 0 ? menuItems : [];

  // Filter to ONLY show top-level categories (no parent)
  const topLevelCategories = categories.filter(category => !category.parent);

  // Recursive function to render category tree
  const renderCategoryTree = (categories: CategoryWithChildren[], level: number = 0) => {
    return categories.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategory === category._id;
      const slug = getSlugString(category.slug);
      
      return (
        <li key={category._id} className="border-b border-amber-100/50 last:border-0">
          {hasChildren ? (
            <>
              <button
                onClick={() => toggleCategory(category._id)}
                className={`flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-amber-50 active:bg-amber-100 transition-colors ${
                  level > 0 ? 'pl-' + (4 + level * 4) : ''
                }`}
                style={{ paddingLeft: `${16 + level * 16}px` }}
              >
                <span>{category.title}</span>
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
              onClick={handleClose}
              className={`block px-4 py-3.5 text-sm text-gray-700 hover:text-amber-700 hover:bg-amber-50 active:bg-amber-100 transition-colors ${
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
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 -ml-2 rounded-full hover:bg-amber-50 active:bg-amber-100 transition-colors"
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
          <div className="sticky top-0 bg-white z-10 border-b border-amber-200/30">
            <div className="flex items-center justify-between p-3">
              <button
                onClick={handleClose}
                className="p-2 -ml-2 rounded-full hover:bg-amber-50 active:bg-amber-100 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Compact Search with Suggestions */}
              <div className="flex-1 min-w-0 ml-2 relative" ref={searchContainerRef}>
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-amber-400 focus-within:bg-white transition-all">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm px-2 py-0.5 placeholder:text-gray-400 truncate"
                      autoFocus={isOpen}
                    />
                    {loading && (
                      <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin flex-shrink-0" />
                    )}
                    {searchQuery && !loading && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="flex-shrink-0 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Live Product Suggestions */}
                {showSuggestions && searchQuery.trim().length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] max-h-[400px] overflow-y-auto">
                    {productSuggestions.length > 0 ? (
                      <div className="p-2">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 px-2">
                          Produkte
                        </p>
                        <div className="space-y-1">
                          {productSuggestions.map((product) => (
                            <button
                              key={product._id}
                              onClick={() => handleProductClick(product)}
                              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-amber-50 transition-colors"
                            >
                              {product.image || product.images?.[0]?.asset?.url ? (
                                <Image
                                  src={product.image || product.images?.[0]?.asset?.url}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <Search className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  €{product.price?.toFixed(2)}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => handleSuggestionClick(searchQuery)}
                            className="w-full text-center text-sm text-amber-700 hover:text-amber-900 font-medium py-2"
                          >
                            Alle Ergebnisse anzeigen für "{searchQuery}"
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500">Keine Produkte gefunden</p>
                        <button
                          onClick={() => handleSuggestionClick(searchQuery)}
                          className="mt-2 text-sm text-amber-700 hover:text-amber-900 font-medium"
                        >
                          Alle Ergebnisse anzeigen für "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Menu Content */}
          {!showSortimentPage ? (
            <nav className="overflow-y-auto h-[calc(100%-120px)]">
              <ul className="py-2">
                {/* Sortiment - Opens as separate page */}
                <li className="border-b border-amber-100/50">
                  <button
                    onClick={handleSortimentClick}
                    className="flex items-center justify-between w-full px-4 py-4 text-sm font-medium text-gray-700 hover:bg-amber-50 active:bg-amber-100 transition-colors"
                  >
                    <span className="text-base font-semibold">Sortiment</span>
                    <ChevronRight className="w-5 h-5 text-amber-600" />
                  </button>
                </li>

                {/* Other menu items */}
                {items.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isActive = pathname === item.url;
                  const isExpanded = expandedCategory === item.label;

                  return (
                    <li key={item.label} className="border-b border-amber-100/50">
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() => toggleCategory(item.label)}
                            className={`flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium transition-colors ${
                              isActive ? "text-amber-700" : "text-gray-700"
                            } hover:bg-amber-50 active:bg-amber-100`}
                          >
                            <span>{item.label}</span>
                            <ChevronDown 
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isExpanded && item.children && (
                            <ul className="bg-amber-50/30">
                              {item.children.map((child) => (
                                <li key={child.url}>
                                  <Link
                                    href={child.url}
                                    onClick={handleClose}
                                    className={`block px-8 py-3 text-sm transition-colors ${
                                      pathname === child.url
                                        ? "text-amber-700 font-medium"
                                        : "text-gray-600"
                                    } hover:text-amber-700 active:bg-amber-50`}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                              <li>
                                <Link
                                  href={item.url}
                                  onClick={handleClose}
                                  className="block px-8 py-3 text-sm font-medium text-amber-700 hover:bg-amber-50 active:bg-amber-100"
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
                            isActive ? "text-amber-700" : "text-gray-700"
                          } hover:bg-amber-50 active:bg-amber-100`}
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
            /* Sortiment Page - Sliding Submenu with nested categories */
            <div className="h-[calc(100%-120px)] flex flex-col">
              {/* Submenu Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-amber-200/30 px-4 py-3 flex items-center gap-3">
                <button
                  onClick={handleBackClick}
                  className="p-2 -ml-2 rounded-full hover:bg-amber-50 active:bg-amber-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <p className="text-base font-bold text-gray-900">Sortiment</p>
              </div>

              {/* Categories List - Recursive Tree */}
              <div className="flex-1 overflow-y-auto">
                <ul className="py-2">
                  {/* Alle anzeigen link */}
                  <li className="border-b border-amber-100/50">
                    <Link
                      href="/sortiment"
                      onClick={handleClose}
                      className="block px-4 py-3.5 text-sm font-medium text-amber-700 hover:bg-amber-50 active:bg-amber-100"
                    >
                      Alle anzeigen
                    </Link>
                  </li>

                  {/* Render category tree recursively */}
                  {topLevelCategories.length === 0 ? (
                    <li className="px-4 py-3 text-sm text-gray-500">Keine Kategorien gefunden</li>
                  ) : (
                    renderCategoryTree(topLevelCategories)
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Bottom Actions - Store Locator with onNavigate prop */}
          {!showSortimentPage && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-amber-200/30 p-4 pb-6">
              <div className="flex items-center">
                <div 
                  className="w-full border border-amber-200/50 rounded-xl overflow-hidden hover:border-amber-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <StoreLocator 
                    key={storeLocatorKey}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-amber-700 active:text-amber-700 transition-colors w-full px-4 py-3 bg-white hover:bg-amber-50/50 cursor-pointer"
                    settings={storeLocatorSettings}
                    onNavigate={handleClose}
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0 text-amber-600" />
                    <span className="flex-1 font-medium">Mein Markt</span>
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
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