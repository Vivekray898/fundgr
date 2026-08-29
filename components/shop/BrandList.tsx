// components/shop/BrandList.tsx
import { BRANDS_QUERY_RESULT } from "@/sanity.types";
import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Building2, Star, MapPin } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

interface Props {
  brands: BRANDS_QUERY_RESULT;
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
  isMobile?: boolean;
}

interface BrandItem {
  _id: string;
  name?: string;
  slug?: { current: string } | string;
  logo?: any;
  description?: string;
  featured?: boolean;
  order?: number;
  marketLocation?: boolean;
}

// Helper function to safely extract slug string
const getBrandSlug = (brand: BrandItem): string => {
  if (!brand?.slug) return brand?._id || "";
  if (typeof brand.slug === "string") return brand.slug;
  return brand.slug.current || brand._id;
};

const BrandList = ({ brands, selectedBrand, setSelectedBrand, isMobile = false }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const typedBrands = useMemo(() => (brands || []) as unknown as BrandItem[], [brands]);

  const filteredBrands = useMemo(() => {
    if (!typedBrands || typedBrands.length === 0) return [];
    
    return typedBrands.filter((brand: BrandItem) =>
      brand?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand?.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [typedBrands, searchTerm]);

  const sortedBrands = useMemo(() => {
    if (!filteredBrands || filteredBrands.length === 0) return [];
    
    return [...filteredBrands].sort((a: BrandItem, b: BrandItem) => {
      if (a?.featured && !b?.featured) return -1;
      if (!a?.featured && b?.featured) return 1;
      if ((a?.order || 0) !== (b?.order || 0)) {
        return (a?.order || 0) - (b?.order || 0);
      }
      return (a?.name || "").localeCompare(b?.name || "");
    });
  }, [filteredBrands]);

  const selectedBrandData = useMemo(() => {
    if (!typedBrands || !selectedBrand) return null;
    return typedBrands.find((brand: BrandItem) => getBrandSlug(brand) === selectedBrand);
  }, [typedBrands, selectedBrand]);

  const handleBrandSelect = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use a callback to ensure state update is handled properly
    if (selectedBrand === value) {
      setSelectedBrand(null);
    } else {
      setSelectedBrand(value);
    }
  };

  const handleClearBrand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBrand(null);
    // Also clear search term when clearing brand
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchTerm("");
  };

  // Render mobile version
  if (isMobile) {
    return (
      <div className="pb-2">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Marken durchsuchen..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-3 text-sm border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all bg-white/80 focus:bg-white placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {selectedBrand && selectedBrandData && (
          <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
            {selectedBrandData?.logo && (
              <Image
                src={typeof selectedBrandData.logo === "string" ? selectedBrandData.logo : urlFor(selectedBrandData.logo).url()}
                alt={selectedBrandData.name || "Brand"}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-contain bg-white p-1"
              />
            )}
            <span className="text-sm font-semibold text-rose-700 flex-1">
              {selectedBrandData.name}
            </span>
            <button
              onClick={handleClearBrand}
              className="text-xs text-gray-400 hover:text-rose-500 transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="space-y-2">
          {sortedBrands?.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500">
              {searchTerm ? "Keine Marken gefunden" : "Keine Marken verfügbar"}
            </div>
          ) : (
            sortedBrands.map((brand: BrandItem) => {
              const brandSlug = getBrandSlug(brand);
              const isSelected = selectedBrand === brandSlug;

              return (
                <div
                  key={brand?._id || brandSlug}
                  onClick={(e) => handleBrandSelect(e, brandSlug)}
                  className={cn(
                    "flex items-center gap-3 hover:cursor-pointer px-3 py-3 rounded-xl transition-colors",
                    isSelected
                      ? "bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200"
                      : "hover:bg-gray-50 border border-transparent"
                  )}
                >
                  <div className="flex-shrink-0 w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors">
                    {isSelected && <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />}
                  </div>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {brand?.logo && (
                      <Image
                        src={typeof brand.logo === "string" ? brand.logo : urlFor(brand.logo).url()}
                        alt={brand.name || "Brand"}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-contain bg-white border border-gray-100 p-1 flex-shrink-0"
                      />
                    )}
                    <span
                      className={cn(
                        "text-sm flex-1",
                        isSelected ? "font-semibold text-rose-700" : "font-normal text-gray-700"
                      )}
                    >
                      {brand?.name || "Unbenannte Marke"}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {brand?.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      {brand?.marketLocation && <MapPin className="w-4 h-4 text-emerald-500" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // Render desktop version
  return (
    <div className="w-full bg-white rounded-xl border border-pink-100 shadow-sm overflow-hidden mb-4">
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-blue-50 border-b border-pink-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-gray-800">Marken</h3>
            {typedBrands && typedBrands.length > 0 && (
              <span className="text-xs text-gray-400 bg-white/70 px-2 py-0.5 rounded-full">
                {typedBrands.length}
              </span>
            )}
          </div>
          {selectedBrand && (
            <button
              onClick={handleClearBrand}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-rose-500 transition-colors"
              type="button"
            >
              <X className="w-3 h-3" />
              <span>Zurücksetzen</span>
            </button>
          )}
        </div>

        {selectedBrand && selectedBrandData && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-gray-500">Ausgewählt:</span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 text-sm font-medium rounded-full border border-rose-200">
              {selectedBrandData?.logo && (
                <Image
                  src={typeof selectedBrandData.logo === "string" ? selectedBrandData.logo : urlFor(selectedBrandData.logo).url()}
                  alt={selectedBrandData.name || "Brand"}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-contain bg-white"
                />
              )}
              {selectedBrandData.name}
              <button
                onClick={handleClearBrand}
                className="ml-0.5 hover:text-rose-700 transition-colors"
                type="button"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Marken durchsuchen..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-8 pr-8 py-2 text-sm border-2 border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all bg-white/80 focus:bg-white placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="px-2 pb-3 max-h-[280px] overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          {sortedBrands?.length === 0 ? (
            <div className="text-center py-3 text-sm text-gray-500">
              {searchTerm ? "Keine Marken gefunden" : "Keine Marken verfügbar"}
            </div>
          ) : (
            sortedBrands.map((brand: BrandItem) => {
              const brandSlug = getBrandSlug(brand);
              const isSelected = selectedBrand === brandSlug;

              return (
                <div
                  key={brand?._id || brandSlug}
                  onClick={(e) => handleBrandSelect(e, brandSlug)}
                  className={cn(
                    "flex items-center gap-3 hover:cursor-pointer px-3 py-2.5 rounded-lg transition-colors",
                    isSelected
                      ? "bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200"
                      : "hover:bg-gray-50 border border-transparent"
                  )}
                >
                  <div className="flex-shrink-0 w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors">
                    {isSelected && <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />}
                  </div>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {brand?.logo && (
                      <Image
                        src={typeof brand.logo === "string" ? brand.logo : urlFor(brand.logo).url()}
                        alt={brand.name || "Brand"}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-contain bg-white border border-gray-100 p-1 flex-shrink-0"
                      />
                    )}
                    <span
                      className={cn(
                        "text-sm flex-1 truncate",
                        isSelected ? "font-semibold text-rose-700" : "font-normal text-gray-700"
                      )}
                    >
                      {brand?.name || "Unbenannte Marke"}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {brand?.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      {brand?.marketLocation && <MapPin className="w-4 h-4 text-emerald-500" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {sortedBrands && sortedBrands.length > 0 && (
        <div className="border-t border-pink-100 px-3 py-1.5 bg-gradient-to-r from-rose-50/30 via-pink-50/30 to-blue-50/30">
          <p className="text-xs text-gray-400">
            {sortedBrands.length} Marke{sortedBrands.length !== 1 ? "n" : ""}
            {selectedBrand && ` • 1 ausgewählt`}
            {searchTerm && ` (gefiltert)`}
          </p>
        </div>
      )}
    </div>
  );
};

export default BrandList;