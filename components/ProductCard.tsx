// components/ProductCard.tsx
"use client";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { StarIcon } from "@sanity/icons";
import { Flame } from "lucide-react";
import PriceView from "./PriceView";
import Title from "./Title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "./AddToCartButton";
import CatalogueButton from "./CatalogueButton";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";

const ProductCard = ({ product }: { product: Product }) => {
  const { enabled, pricePlaceholder, productCardCta, loading } = useCatalogueMode();

  // Show loading state or fallback
  if (loading) {
    return (
      <div className="text-xs sm:text-sm border-[1px] rounded-lg sm:rounded-md border-rose-200/50 group bg-white hover:border-rose-300 transition-colors h-full flex flex-col animate-pulse">
        <div className="h-48 sm:h-56 md:h-64 bg-gray-200"></div>
        <div className="p-2 sm:p-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-xs sm:text-sm border-[1px] rounded-lg sm:rounded-md border-rose-200/50 group bg-white hover:border-rose-300 transition-colors h-full flex flex-col">
      <div className="relative group overflow-hidden bg-gradient-to-br from-rose-50/30 to-pink-50/30 flex-shrink-0">
        {product?.images && (
          <Link href={`/product/${product?.slug?.current}`}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-48 sm:h-56 md:h-64 object-contain overflow-hidden transition-transform bg-gradient-to-br from-rose-50/30 to-pink-50/30 duration-500 
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
            />
          </Link>
        )}
        <ProductSideMenu product={product} />
        {product?.status === "sale" ? (
          <p className="absolute top-2 left-2 z-10 text-[10px] sm:text-xs border border-rose-300/50 px-1.5 sm:px-2 py-0.5 rounded-full group-hover:border-rose-500 hover:text-rose-600 hoverEffect">
            Sale!
          </p>
        ) : (
          <Link
            href={"/deal"}
            className="absolute top-2 left-2 z-10 border border-rose-300/50 p-1 rounded-full group-hover:border-rose-500 hover:text-rose-600 hoverEffect"
          >
            <Flame
              size={14}
              fill="#fb6c08"
              className="text-rose-400/50 group-hover:text-rose-500 hoverEffect"
            />
          </Link>
        )}
      </div>
      
      <div className="p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 flex-1">
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-[10px] sm:text-xs font-medium text-rose-400">
            {product.categories.map((cat) => cat).join(", ")}
          </p>
        )}
        <Title className="text-xs sm:text-sm line-clamp-2 text-gray-800 font-semibold">
          {product?.name}
        </Title>
        
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                  index < 4 ? "text-rose-400" : "text-gray-300"
                }`}
                fill={index < 4 ? "#f43f5e" : "#d1d5db"}
              />
            ))}
          </div>
          <p className="text-gray-400 text-[10px] sm:text-xs tracking-wide">5 Reviews</p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <p className="font-medium text-gray-600 text-[10px] sm:text-xs">In Stock</p>
          <p
            className={`text-[10px] sm:text-xs ${
              product?.stock === 0 ? "text-red-500" : "text-rose-500 font-semibold"
            }`}
          >
            {(product?.stock as number) > 0 ? product?.stock : "unavailable"}
          </p>
        </div>

        {/* Price - Conditional rendering */}
        {!enabled ? (
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-xs sm:text-sm"
          />
        ) : (
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {pricePlaceholder}
          </p>
        )}
        
        <div className="mt-auto pt-1">
          {/* Conditional Button - Catalogue Mode vs Normal Mode */}
          {!enabled ? (
            <AddToCartButton product={product} className="w-full sm:w-36 rounded-full text-xs sm:text-sm" />
          ) : (
            <CatalogueButton 
              productSlug={product.slug?.current || ""} 
              label={productCardCta}
              variant="card"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;