// components/ProductMinimalSection.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductMinimalCard from "./ProductMinimalCard";
import { ArrowRight } from "lucide-react";
import { client } from "@/sanity/lib/client";

// Define Product type locally since sanity.types might not have all fields
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

interface ProductMinimalSectionProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  columns?: 2 | 3 | 4;
  className?: string;
  fetchFromSanity?: boolean;
  status?: "new" | "hot" | "sale";
  limit?: number;
}

const ProductMinimalSection = ({
  products: propProducts,
  title = "Sale Angebote",
  subtitle = "Spare jetzt bei unseren Sale-Produkten!",
  linkText = "Alle anzeigen",
  linkHref = "/angebote",
  columns = 4,
  className = "",
  fetchFromSanity = true,
  status = "sale",
  limit = 8,
}: ProductMinimalSectionProps) => {
  const [products, setProducts] = useState<Product[]>(propProducts || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  // Fetch products from Sanity if fetchFromSanity is true
  useEffect(() => {
    if (fetchFromSanity && !propProducts) {
      const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
          console.log(`🔍 Fetching products with status: "${status}"...`);

          const query = `*[_type == "product" && status == $status && stock > 0] | order(_createdAt desc)[0...$limit] {
            _id,
            name,
            slug,
            images[]{
              asset->{
                _id,
                url
              }
            },
            price,
            discount,
            originalPrice,
            isDeal,
            dealEndDate,
            status,
            stock,
            categories[]->{
              _id,
              title,
              "slug": slug.current
            },
            brand->{
              _id,
              name,
              "slug": slug.current
            },
            description
          }`;

          const result = await client.fetch(query, { status, limit });
          console.log(`✅ Found ${result?.length || 0} products with status "${status}"`);
          setProducts(result || []);
        } catch (error) {
          console.error("Error fetching sale products:", error);
          setError("Fehler beim Laden der Produkte");
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [fetchFromSanity, propProducts, status, limit]);

  // If loading, show skeleton
  if (loading) {
    return (
      <div className={`my-6 sm:my-12 ${className}`}>
        <div className="flex items-end justify-between mb-3 sm:mb-6">
          <div className="relative inline-block pb-2">
            <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-[#202B26]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] sm:text-sm text-[#7C7566] mt-1">{subtitle}</p>
            )}
            <span className="absolute left-0 bottom-0 h-1 w-9 rounded-full bg-[#F4B400]" />
          </div>
          <span className="text-[10px] sm:text-sm font-bold text-[#146044] flex items-center gap-1">
            {linkText}
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
        </div>
        <div className={`grid ${gridCols} gap-2 sm:gap-4`}>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center gap-2 p-2 rounded-[14px] border border-[#E4DCC8] bg-[#FBF7EE]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[10px] bg-[#F3EEE0] flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 bg-[#F3EEE0] rounded w-1/3" />
                  <div className="h-3 bg-[#F3EEE0] rounded w-2/3" />
                  <div className="h-2 bg-[#F3EEE0] rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className={`my-6 sm:my-12 ${className}`}>
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-[#202B26]">
            {title}
          </h2>
        </div>
        <div className="text-center py-8 bg-[#FBEAEA] rounded-[14px] border border-[#D64550]/30">
          <p className="text-[#D64550] text-sm font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-xs font-bold text-[#202B26] bg-white px-3 py-1.5 rounded-full border border-[#E4DCC8] shadow-sm hover:bg-[#1B8057] hover:text-white hover:border-[#1B8057] hover:shadow-md transition-all"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-6 sm:my-12 ${className}`}>
      {/* Section Header */}
      <div className="flex items-end justify-between mb-3 sm:mb-6 gap-3">
        <div className="relative inline-block pb-2">
          <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-[#202B26]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[10px] sm:text-sm text-[#7C7566] mt-1">{subtitle}</p>
          )}
          <span className="absolute left-0 bottom-0 h-1 w-9 rounded-full bg-[#F4B400]" />
        </div>
        <Link
          href={linkHref}
          className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] sm:text-sm font-bold text-[#202B26] bg-[#FBF7EE] px-2.5 sm:px-3.5 py-1.5 rounded-full border border-[#E4DCC8] shadow-sm hover:bg-[#1B8057] hover:text-white hover:border-[#1B8057] hover:shadow-md transition-all"
        >
          {linkText}
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </Link>
      </div>

      {/* Product Grid */}
      {products && products.length > 0 ? (
        <div className={`grid ${gridCols} gap-2.5 sm:gap-4`}>
          {products.map((product) => (
            <ProductMinimalCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-[#FBF7EE] rounded-[14px] border border-[#E4DCC8]">
          <p className="text-[#202B26] text-sm font-medium">Keine Sale-Angebote verfügbar.</p>
          <p className="text-xs text-[#7C7566] mt-1">Schauen Sie später wieder vorbei!</p>
        </div>
      )}
    </div>
  );
};

export default ProductMinimalSection;