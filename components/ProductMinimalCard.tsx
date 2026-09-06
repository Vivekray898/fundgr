// components/ProductMinimalCard.tsx
"use client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { StarIcon } from "@sanity/icons";
import PriceView from "./PriceView";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";

// Define Product type locally
interface Product {
  _id: string;
  name: string;
  slug: { current: string } | string;
  images?: Array<{ asset?: { _id: string; url: string } }> | string[];
  price: number;
  discount?: number;
  originalPrice?: number;
  isDeal?: boolean;
  dealEndDate?: string;
  status?: string;
  stock?: number;
  categories?: Array<{ _id: string; title: string; slug: { current: string } }> | string[];
  brand?: string;
  brandName?: string;
  brandSlug?: string;
  description?: string;
}

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
  
  // Safety check - if no product, return null
  if (!product) {
    return null;
  }

  const firstImage = product?.images?.[0];
  const hasDiscount = (product?.discount || 0) > 0;

  // Get the first category safely
  const firstCategory = product?.categories && Array.isArray(product.categories) && product.categories.length > 0
    ? product.categories[0]
    : null;

  const categorySlug = firstCategory && typeof firstCategory === 'object' && 'slug' in firstCategory
    ? (firstCategory as any)?.slug?.current
    : null;

  const categoryTitle = firstCategory && typeof firstCategory === 'object' && 'title' in firstCategory
    ? (firstCategory as any)?.title
    : null;

  // Get the product slug safely
  const productSlug = product?.slug && typeof product.slug === 'object' && 'current' in product.slug
    ? product.slug.current
    : product?.slug || '';

  return (
    <div className={`flex items-center gap-2 ${compact ? 'p-1.5' : 'p-2'} rounded-lg border border-amber-200/40 hover:border-amber-300 hover:shadow-sm transition-all bg-white ${className}`}>
      {/* Small Image */}
      <Link href={`/product/${productSlug}`} className="flex-shrink-0">
        <div className={`${compact ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14'} rounded-lg overflow-hidden bg-amber-50/30`}>
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
              <span className="text-amber-300 text-lg">📦</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Category */}
        {showCategory && categoryTitle && (
          <Link
            href={`/category/${categorySlug || ''}`}
            className="text-[8px] sm:text-[10px] text-amber-700 font-medium uppercase tracking-wide hover:text-amber-900 transition-colors"
          >
            {categoryTitle}
          </Link>
        )}

        {/* Title */}
        {product?.name && (
          <Link href={`/product/${productSlug}`}>
            <h4 className="text-[10px] sm:text-xs font-semibold text-gray-800 line-clamp-1 hover:text-amber-700 transition-colors">
              {product?.name}
            </h4>
          </Link>
        )}

        {/* Rating */}
        {showRating && (
          <div className="flex items-center gap-0.5 mt-0.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5"
                  fill={index < 4 ? "#d97706" : "#d1d5db"}
                  color={index < 4 ? "#d97706" : "#d1d5db"}
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

        {/* Sale Badge */}
        {product?.status === "sale" && (
          <div className="mt-0.5">
            <span className="text-[8px] sm:text-[9px] font-semibold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded">
              SALE
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMinimalCard;