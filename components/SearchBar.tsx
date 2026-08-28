"use client";
import { Search, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  isMobile?: boolean;
  isFullWidth?: boolean;
  placeholder?: string;
  suggestions?: string[];
}

const SearchBar = ({ 
  isMobile = false, 
  isFullWidth = false,
  placeholder = "Wonach suchen Sie?",
  suggestions = ["Garten", "Werkzeug", "Holz", "Farben", "Sanitär", "Elektro"]
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      if (isMobile) {
        setIsOpen(false);
        setQuery("");
      }
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Full width mobile search (always visible in header)
  if (isFullWidth) {
    return (
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
          className={`fixed inset-0 bg-white z-[200] transition-all duration-300 ${
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

          {/* Search suggestions */}
          <div className="p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
              Vorschläge
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    setTimeout(() => {
                      router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                      setIsOpen(false);
                      setQuery("");
                    }, 100);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-rose-500 hover:text-white active:bg-rose-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop: Expandable search bar
  return (
    <div className="relative">
      {!isOpen ? (
        <button
          onClick={handleOpen}
          className="p-2 rounded-full hover:bg-rose-50 transition-colors"
          aria-label="Suchen"
        >
          <Search className="w-5 h-5 text-gray-600 hover:text-rose-500 transition-colors" />
        </button>
      ) : (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] bg-white shadow-lg rounded-full border border-rose-200 z-50 animate-in slide-in-from-right-5 duration-200">
          <form onSubmit={handleSearch} className="flex items-center px-3 py-1">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-1.5"
            />
            {query && (
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
              className="ml-1 p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors flex-shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="ml-1 p-1.5 rounded-full hover:bg-rose-50 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchBar;