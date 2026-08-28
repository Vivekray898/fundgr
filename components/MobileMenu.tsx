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
  price: number;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [productSuggestions, setProductSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
                className="p-2 -ml-2 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Compact Search with Suggestions */}
              <div className="flex-1 min-w-0 ml-2 relative" ref={searchContainerRef}>
                <form onSubmit={handleSearchSubmit}>
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-rose-400 focus-within:bg-white transition-all">
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
                      <Loader2 className="w-3.5 h-3.5 text-rose-400 animate-spin flex-shrink-0" />
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
                              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-rose-50 transition-colors"
                            >
                              {product.image ? (
                                <Image
                                  src={product.image}
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
                            className="w-full text-center text-sm text-rose-500 hover:text-rose-600 font-medium py-2"
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
                          className="mt-2 text-sm text-rose-500 hover:text-rose-600 font-medium"
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