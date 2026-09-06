// components/deals/DealsProductCard.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tag, Clock, Package, Percent, Eye } from "lucide-react";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";

interface Product {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  images?: any[];
  price: number;
  discount: number;
  originalPrice?: number;
  isDeal?: boolean;
  dealEndDate?: string;
  status?: string;
}

const DealsProductCard = ({ product }: { product: Product }) => {
  const { enabled, pricePlaceholder } = useCatalogueMode();
  
  const imageUrl = product.images?.[0]?.asset?.url || product.images?.[0]?.url;
  
  const discountPercent = product.discount > 0 && product.price > 0
    ? Math.round((product.discount / product.price) * 100) 
    : 0;

  const originalPrice = product.originalPrice || (product.discount > 0 ? product.price + product.discount : null);

  return (
    <div className="group bg-white rounded-xl border border-[#E8E3D8] overflow-hidden hover:shadow-lg hover:shadow-[#E8E3D8]/50 transition-all hover:border-[#D4A853] active:scale-[0.98]">
      <Link href={`/product/${product.slug.current}`}>
        {/* Image */}
        <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden bg-[#F8F6F2]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-[#E8E3D8]" />
            </div>
          )}

          {/* Badges */}
          {!enabled && discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-[#D4A853] text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-[#D4A853]/30 flex items-center gap-1">
              <Percent className="w-3 h-3" />
              -{discountPercent}%
            </div>
          )}

          {!enabled && product.isDeal && (
            <div className="absolute top-2 right-2 bg-[#1a1a1a] text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-black/20 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              DEAL
            </div>
          )}

          {product.status === 'new' && (
            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-emerald-200/50">
              NEU
            </div>
          )}

          {product.status === 'hot' && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-orange-200/50">
              🔥 HOT
            </div>
          )}

          {product.dealEndDate && (
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[8px] sm:text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(product.dealEndDate).toLocaleDateString('de-DE')}
            </div>
          )}

          {/* Catalogue Mode Badge */}
          {enabled && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end justify-center pb-3">
              <span className="bg-white/90 backdrop-blur-sm text-[#D4A853] text-[8px] sm:text-xs font-semibold px-3 py-1 rounded-full shadow-lg border border-[#D4A853]/30">
                Im Markt erhältlich
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-[#1a1a1a] line-clamp-2 group-hover:text-[#B8923A] transition-colors">
            {product.name}
          </h3>
          
          {/* Price Section */}
          {!enabled ? (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-[#1a1a1a]">
                €{product.price?.toFixed(2)}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-xs sm:text-sm text-[#8A7A6A] line-through">
                  €{originalPrice?.toFixed(2)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[8px] sm:text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                  -{discountPercent}%
                </span>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <span className="text-xs sm:text-sm text-[#8A7A6A] font-medium">
                {pricePlaceholder}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default DealsProductCard;