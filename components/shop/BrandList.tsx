// components/shop/BrandList.tsx
import { BRANDS_QUERY_RESULT } from "@/sanity.types";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
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

// Define interface for brand type
interface BrandItem {
  _id: string;
  name?: string;
  slug?: {
    current: string;
  };
  logo?: any;
  description?: string;
  featured?: boolean;
  order?: number;
  marketLocation?: boolean;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand, isMobile = false }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Cast brands to BrandItem[]
  const typedBrands = brands as unknown as BrandItem[];

  // Filter brands by search term
  const filteredBrands = typedBrands?.filter((brand: BrandItem) =>
    brand?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort brands: featured first, then by order, then alphabetically
  const sortedBrands = filteredBrands?.sort((a: BrandItem, b: BrandItem) => {
    if (a?.featured && !b?.featured) return -1;
    if (!a?.featured && b?.featured) return 1;
    if ((a?.order || 0) !== (b?.order || 0)) {
      return (a?.order || 0) - (b?.order || 0);
    }
    return (a?.name || '').localeCompare(b?.name || '');
  });

  // Get selected brand for display
  const selectedBrandData = typedBrands?.find(
    (brand: BrandItem) => brand?.slug?.current === selectedBrand
  );

  if (isMobile) {
    return (
      <div className="pb-2">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Marken durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 text-sm border-2 border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all bg-white/80 focus:bg-white placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Selected brand info */}
        {selectedBrand && selectedBrandData && (
          <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
            {selectedBrandData?.logo && (
              <Image
                src={urlFor(selectedBrandData.logo).url()}
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
              onClick={() => setSelectedBrand(null)}
              className="text-xs text-gray-400 hover:text-rose-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* List */}
        <RadioGroup value={selectedBrand || ""} className="space-y-2">
          {sortedBrands?.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500">
              {searchTerm ? "Keine Marken gefunden" : "Keine Marken verfügbar"}
            </div>
          ) : (
            sortedBrands?.map((brand: BrandItem) => (
              <div
                key={brand?._id}
                onClick={() => setSelectedBrand(brand?.slug?.current as string)}
                className={cn(
                  "flex items-center gap-3 hover:cursor-pointer px-3 py-3 rounded-xl transition-colors",
                  selectedBrand === brand?.slug?.current
                    ? "bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200"
                    : "hover:bg-gray-50"
                )}
              >
                <RadioGroupItem
                  value={brand?.slug?.current as string}
                  id={brand?.slug?.current}
                  className="rounded-sm flex-shrink-0"
                />
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {brand?.logo && (
                    <Image
                      src={urlFor(brand.logo).url()}
                      alt={brand.name || "Brand"}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-contain bg-white border border-gray-100 p-1 flex-shrink-0"
                    />
                  )}
                  <Label
                    htmlFor={brand?.slug?.current}
                    className={cn(
                      "text-sm flex-1 cursor-pointer",
                      selectedBrand === brand?.slug?.current
                        ? "font-semibold text-rose-700"
                        : "font-normal text-gray-700"
                    )}
                  >
                    {brand?.name || "Unbenannte Marke"}
                  </Label>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {brand?.featured && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    )}
                    {brand?.marketLocation && (
                      <MapPin className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </RadioGroup>

        {/* Brand count */}
        {sortedBrands && sortedBrands.length > 0 && (
          <div className="mt-3 text-xs text-gray-400 text-center">
            {sortedBrands.length} Marken verfügbar
          </div>
        )}
      </div>
    );
  }

  // Desktop version
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
              onClick={() => setSelectedBrand(null)}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-rose-500 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Zurücksetzen</span>
            </button>
          )}
        </div>

        {/* Selected brand chip */}
        {selectedBrand && selectedBrandData && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-gray-500">Ausgewählt:</span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 text-sm font-medium rounded-full border border-rose-200">
              {selectedBrandData?.logo && (
                <Image
                  src={urlFor(selectedBrandData.logo).url()}
                  alt={selectedBrandData.name || "Brand"}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-contain bg-white"
                />
              )}
              {selectedBrandData.name}
              <button
                onClick={() => setSelectedBrand(null)}
                className="ml-0.5 hover:text-rose-700 transition-colors"
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-sm border-2 border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all bg-white/80 focus:bg-white placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="px-2 pb-3 max-h-[280px] overflow-y-auto custom-scrollbar">
        <RadioGroup value={selectedBrand || ""} className="space-y-1">
          {sortedBrands?.length === 0 ? (
            <div className="text-center py-3 text-sm text-gray-500">
              {searchTerm ? "Keine Marken gefunden" : "Keine Marken verfügbar"}
            </div>
          ) : (
            sortedBrands?.map((brand: BrandItem) => (
              <div
                key={brand?._id}
                onClick={() => setSelectedBrand(brand?.slug?.current as string)}
                className={cn(
                  "flex items-center gap-3 hover:cursor-pointer px-3 py-2.5 rounded-lg transition-colors",
                  selectedBrand === brand?.slug?.current
                    ? "bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200"
                    : "hover:bg-gray-50"
                )}
              >
                <RadioGroupItem
                  value={brand?.slug?.current as string}
                  id={brand?.slug?.current}
                  className="rounded-sm flex-shrink-0"
                />
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {brand?.logo && (
                    <Image
                      src={urlFor(brand.logo).url()}
                      alt={brand.name || "Brand"}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-contain bg-white border border-gray-100 p-1 flex-shrink-0"
                    />
                  )}
                  <span
                    className={cn(
                      "text-sm flex-1 truncate",
                      selectedBrand === brand?.slug?.current
                        ? "font-semibold text-rose-700"
                        : "font-normal text-gray-700"
                    )}
                  >
                    {brand?.name || "Unbenannte Marke"}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {brand?.featured && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    )}
                    {brand?.marketLocation && (
                      <MapPin className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </RadioGroup>
      </div>

      {sortedBrands && sortedBrands.length > 0 && (
        <div className="border-t border-pink-100 px-3 py-1.5 bg-gradient-to-r from-rose-50/30 via-pink-50/30 to-blue-50/30">
          <p className="text-xs text-gray-400">
            {sortedBrands.length} Marke{sortedBrands.length !== 1 ? 'n' : ''}
            {selectedBrand && ` • 1 ausgewählt`}
            {searchTerm && ` (gefiltert)`}
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
          background: #fbcfe8;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f472b6;
        }
      `}</style>
    </div>
  );
};

export default BrandList;