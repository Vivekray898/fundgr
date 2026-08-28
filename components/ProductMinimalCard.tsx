// components/ProductMinimalCard.tsx
"use client";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { StarIcon } from "@sanity/icons";
import PriceView from "./PriceView";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";

interface ProductMinimalCardProps {
  product: Product;
  showCategory?: boolean;
  showRating?: boolean;
  compact?: boolean;
  className?: string;
}

const ProductMinimalCard = ({ 
  product, 
  showCategory = true, 
  showRating = true,
  compact = false,
  className = "" 
}: ProductMinimalCardProps) => {
  const { enabled, pricePlaceholder } = useCatalogueMode();
  const firstImage = product?.images?.[0];
  const hasDiscount = product?.discount > 0;

  return (
    <div className={`flex items-center gap-2 ${compact ? 'p-1.5' : 'p-2'} rounded-lg border border-rose-100/50 hover:border-rose-200 hover:shadow-sm transition-all ${className}`}>
      {/* Small Image */}
      <Link href={`/product/${product?.slug?.current}`} className="flex-shrink-0">
        <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14'} rounded-lg overflow-hidden bg-rose-50/30`}>
          {firstImage ? (
            <Image
              src={urlFor(firstImage).url()}
              alt={product?.name || "Product"}
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-rose-200 text-lg">📦</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Category */}
        {showCategory && product?.categories && (
          <Link
            href={`/category/${product.categories[0]}`}
            className="text-[8px] sm:text-[10px] text-rose-400 font-medium uppercase tracking-wide hover:text-rose-600 transition-colors"
          >
            {product.categories[0]}
          </Link>
        )}

        {/* Title */}
        <Link href={`/product/${product?.slug?.current}`}>
          <h4 className="text-[10px] sm:text-xs font-semibold text-gray-800 line-clamp-1 hover:text-rose-500 transition-colors">
            {product?.name}
          </h4>
        </Link>

        {/* Rating */}
        {showRating && (
          <div className="flex items-center gap-0.5 mt-0.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5"
                  fill={index < 4 ? "#f43f5e" : "#d1d5db"}
                  color={index < 4 ? "#f43f5e" : "#d1d5db"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price - Conditional rendering */}
        <div className="mt-0.5">
          {!enabled ? (
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-[10px] sm:text-xs"
            />
          ) : (
            <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
              {pricePlaceholder}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductMinimalCard;