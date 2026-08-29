// components/SearchBar.tsx
"use client";
import { Search, X, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import Image from "next/image";

interface SearchBarProps {
  isMobile?: boolean;
  isFullWidth?: boolean;
  placeholder?: string;
  suggestions?: string[];
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

const SearchBar = ({ 
  isMobile = false, 
  isFullWidth = false,
  placeholder = "Wonach suchen Sie?",
  suggestions: defaultSuggestions = ["Garten", "Werkzeug", "Holz", "Farben", "Sanitär", "Elektro"]
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [productSuggestions, setProductSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch live suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
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
          { searchTerm: `${query}*` }
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
  }, [query]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      if (isMobile) {
        setIsOpen(false);
        setQuery("");
      }
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(suggestion)}`);
      if (isMobile) {
        setIsOpen(false);
        setQuery("");
      }
    }, 100);
  };

  const handleProductClick = (product: ProductSuggestion) => {
    router.push(`/product/${product.slug.current}`);
    setShowSuggestions(false);
    if (isMobile) {
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setShowSuggestions(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Render suggestions dropdown
  const renderSuggestions = () => {
    if (!showSuggestions || query.trim().length < 2) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] max-h-[400px] overflow-y-auto">
        {/* Quick search suggestions */}
        {defaultSuggestions.filter(s => 
          s.toLowerCase().includes(query.toLowerCase())
        ).length > 0 && (
          <div className="p-3 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
              Schnellsuche
            </p>
            <div className="flex flex-wrap gap-2">
              {defaultSuggestions.filter(s => 
                s.toLowerCase().includes(query.toLowerCase())
              ).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product suggestions */}
        {loading ? (
          <div className="p-4 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
          </div>
        ) : productSuggestions.length > 0 ? (
          <div className="p-3">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
              Produkte
            </p>
            <div className="space-y-2">
              {productSuggestions.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-rose-50 transition-colors"
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
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">Keine Produkte gefunden</p>
          </div>
        )}
      </div>
    );
  };

  // Full width mobile search (always visible in header)
  if (isFullWidth) {
    return (
      <div className="relative z-[9999]" ref={searchContainerRef}>
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-rose-400 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-0.5 placeholder:text-gray-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="p-2.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 active:scale-95 transition-all flex-shrink-0 shadow-md hover:shadow-lg"
            aria-label="Suchen"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
        {renderSuggestions()}
      </div>
    );
  }

  // Mobile: Full screen search overlay (triggered by search icon)
  if (isMobile) {
    return (
      <>
        <button
          onClick={handleOpen}
          className="p-2 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-colors"
          aria-label="Suchen"
        >
          <Search className="w-5 h-5 text-gray-600 hover:text-rose-500 transition-colors" />
        </button>

        {/* Fullscreen search overlay - Mobile optimized */}
        <div
          className={`fixed inset-0 bg-white z-[9999] transition-all duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="flex items-center gap-2 p-3 border-b border-rose-100">
            <button
              onClick={handleClose}
              className="p-2 -ml-2 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
              <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-rose-400 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent border-none outline-none text-base px-2 py-0.5"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="p-2.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 active:scale-95 transition-all shadow-md"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Live Search Results */}
          {query.trim().length >= 2 && (
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                </div>
              ) : productSuggestions.length > 0 ? (
                <>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                    Produkte
                  </p>
                  <div className="space-y-2">
                    {productSuggestions.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        {product.image || product.images?.[0]?.asset?.url ? (
                          <Image
                            src={product.image || product.images?.[0]?.asset?.url}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Search className="w-5 h-5 text-gray-400" />
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
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Keine Produkte gefunden</p>
                </div>
              )}
            </div>
          )}

          {/* Default suggestions when not typing */}
          {query.trim().length < 2 && (
            <div className="p-4">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                Vorschläge
              </p>
              <div className="flex flex-wrap gap-2">
                {defaultSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-rose-500 hover:text-white active:bg-rose-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // Desktop: Expandable search bar
  return (
    <div className="relative z-[9999]" ref={searchContainerRef}>
      {!isOpen ? (
        <button
          onClick={handleOpen}
          className="p-2 rounded-full hover:bg-rose-50 transition-colors"
          aria-label="Suchen"
        >
          <Search className="w-5 h-5 text-gray-600 hover:text-rose-500 transition-colors" />
        </button>
      ) : (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] bg-white shadow-lg rounded-xl border border-rose-200 z-[9999] animate-in slide-in-from-right-5 duration-200">
          <form onSubmit={handleSearch} className="flex items-center px-3 py-1.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-2"
              autoFocus
            />
            {loading && (
              <Loader2 className="w-4 h-4 text-rose-500 animate-spin flex-shrink-0" />
            )}
            {query && !loading && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-full hover:bg-rose-50 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <button
              type="submit"
              className="ml-1 p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors flex-shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="ml-1 p-2 rounded-full hover:bg-rose-50 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </form>
          {renderSuggestions()}
        </div>
      )}
    </div>
  );
};

export default SearchBar;