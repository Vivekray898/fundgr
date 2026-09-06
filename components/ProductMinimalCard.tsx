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
  className = "",
}: ProductMinimalCardProps) => {
  const { enabled, pricePlaceholder } = useCatalogueMode();

  if (!product) {
    return null;
  }

  const firstImage = product?.images?.[0];
  const hasDiscount = (product?.discount || 0) > 0;

  // Get the first category safely
  const firstCategory =
    product?.categories && Array.isArray(product.categories) && product.categories.length > 0
      ? product.categories[0]
      : null;

  const categorySlug =
    firstCategory && typeof firstCategory === "object" && "slug" in firstCategory
      ? (firstCategory as any)?.slug?.current
      : null;

  const categoryTitle =
    firstCategory && typeof firstCategory === "object" && "title" in firstCategory
      ? (firstCategory as any)?.title
      : null;

  const productSlug =
    product?.slug && typeof product.slug === "object" && "current" in product.slug
      ? product.slug.current
      : product?.slug || "";

  return (
    <div
      className={`flex items-center gap-2 ${compact ? "p-1.5" : "p-2"} rounded-[14px] border border-[#E4DCC8]/60 hover:border-[#1B8057] hover:shadow-[0_4px_12px_rgba(27,128,87,0.12)] transition-all bg-[#FBF7EE] ${className}`}
    >
      {/* Small Image */}
      <Link href={`/product/${productSlug}`} className="flex-shrink-0 relative">
        <div
          className={`${
            compact ? "w-10 h-10" : "w-12 h-12 sm:w-14 sm:h-14"
          } rounded-[10px] overflow-hidden bg-white border border-[#E4DCC8]/40`}
        >
          {firstImage ? (
            <Image
              src={urlFor(firstImage).url()}
              alt={product?.name || "Produkt"}
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#7C7566] text-lg">📦</span>
            </div>
          )}
        </div>

        {/* Discount sticker */}
        {hasDiscount && (
          <span className="absolute -top-1.5 -left-1.5 bg-[#D64550] text-white text-[8px] sm:text-[9px] font-extrabold leading-none px-1.5 py-1 rounded-full border border-[#E4DCC8]/40 shadow-sm rotate-[-8deg]">
            -{product.discount}%
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Category */}
        {showCategory && categoryTitle && (
          <Link
            href={`/category/${categorySlug || ""}`}
            className="text-[8px] sm:text-[10px] text-[#146044] font-semibold hover:text-[#0f3a29] transition-colors"
          >
            {categoryTitle}
          </Link>
        )}

        {/* Title */}
        {product?.name && (
          <Link href={`/product/${productSlug}`}>
            <h4 className="text-[10px] sm:text-xs font-semibold text-[#202B26] line-clamp-1 hover:text-[#146044] transition-colors">
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
                  fill={index < 4 ? "#F4B400" : "#E4DCC8"}
                  color={index < 4 ? "#F4B400" : "#E4DCC8"}
                />
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mt-0.5">
          {!enabled ? (
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-[10px] sm:text-xs"
            />
          ) : (
            <p className="text-[10px] sm:text-xs text-[#7C7566] font-medium">
              {pricePlaceholder}
            </p>
          )}
        </div>

        {/* Sale Badge */}
        {product?.status === "sale" && (
          <div className="mt-1">
            <span className="inline-block text-[8px] sm:text-[9px] font-extrabold text-[#202B26] bg-[#F4B400] px-1.5 py-0.5 rounded-[4px] border border-[#E4DCC8]/40 shadow-sm rotate-[-3deg]">
              ANGEBOT
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMinimalCard;