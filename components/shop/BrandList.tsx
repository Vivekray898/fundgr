// components/shop/BrandList.tsx
import { BRANDS_QUERYResult } from "@/sanity.types";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Search, X, Building2 } from "lucide-react";

interface Props {
  brands: BRANDS_QUERYResult;
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
  isMobile?: boolean;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand, isMobile = false }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBrands = brands?.filter(brand =>
    brand?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isMobile) {
    return (
      <div className="pb-2">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shop_light_green/50 focus:border-shop_light_green transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* List */}
        <RadioGroup value={selectedBrand || ""} className="space-y-1">
          {filteredBrands?.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500">No brands found</div>
          ) : (
            filteredBrands?.map((brand) => (
              <div
                key={brand?._id}
                onClick={() => setSelectedBrand(brand?.slug?.current as string)}
                className="flex items-center space-x-3 hover:cursor-pointer px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <RadioGroupItem
                  value={brand?.slug?.current as string}
                  id={brand?.slug?.current}
                  className="rounded-sm"
                />
                <Label
                  htmlFor={brand?.slug?.current}
                  className={`text-sm ${selectedBrand === brand?.slug?.current ? "font-semibold text-shop_dark_green" : "font-normal text-gray-700"}`}
                >
                  {brand?.title}
                </Label>
              </div>
            ))
          )}
        </RadioGroup>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-shop_light_green" />
            <h3 className="text-sm font-bold text-gray-800">Brands</h3>
          </div>
          {selectedBrand && (
            <button
              onClick={() => setSelectedBrand(null)}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_light_green/50 focus:border-shop_light_green transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="px-3 pb-3 max-h-[200px] overflow-y-auto custom-scrollbar">
        <RadioGroup value={selectedBrand || ""} className="space-y-0.5">
          {filteredBrands?.length === 0 ? (
            <div className="text-center py-3 text-sm text-gray-500">No brands found</div>
          ) : (
            filteredBrands?.map((brand) => (
              <div
                key={brand?._id}
                onClick={() => setSelectedBrand(brand?.slug?.current as string)}
                className="flex items-center space-x-2 hover:cursor-pointer px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RadioGroupItem
                  value={brand?.slug?.current as string}
                  id={brand?.slug?.current}
                  className="rounded-sm"
                />
                <Label
                  htmlFor={brand?.slug?.current}
                  className={`text-sm ${selectedBrand === brand?.slug?.current ? "font-semibold text-shop_dark_green" : "font-normal text-gray-700"}`}
                >
                  {brand?.title}
                </Label>
              </div>
            ))
          )}
        </RadioGroup>
      </div>

      {filteredBrands && filteredBrands.length > 0 && (
        <div className="border-t border-gray-100 px-3 py-1.5 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''}
            {selectedBrand && ` • 1 selected`}
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
          background: #d1d5db;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default BrandList;