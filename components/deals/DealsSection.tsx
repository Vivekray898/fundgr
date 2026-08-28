// components/deals/DealsSection.tsx
"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, PackageX, Eye } from "lucide-react";
import DealsProductCard from "./DealsProductCard";
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
  dealType?: string;
  status?: string;
  isDeal?: boolean;
  dealEndDate?: string;
}

interface DealsSectionProps {
  id: string;
  title: string;
  description?: string;
  products: Product[];
  linkText?: string;
  linkHref?: string;
  accentColor?: string;
  showViewAll?: boolean;
  maxDisplay?: number;
}

const DealsSection = ({ 
  id, 
  title, 
  description, 
  products, 
  linkText = "Alle anzeigen", 
  linkHref = "/shop",
  accentColor = "rose",
  showViewAll = true,
  maxDisplay = 8
}: DealsSectionProps) => {
  const { enabled } = useCatalogueMode();
  
  // Filter out products with missing data
  const validProducts = products?.filter(p => p && p._id && p.name) || [];
  const displayProducts = validProducts.slice(0, maxDisplay);

  if (validProducts.length === 0) {
    return null;
  }

  return (
    <section id={id} className="mb-8 sm:mb-12 scroll-mt-20 sm:scroll-mt-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">{description}</p>
          )}
        </div>
        {validProducts.length > 0 && showViewAll && (
          <Link 
            href={linkHref} 
            className="flex items-center gap-1 text-xs sm:text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
          >
            {linkText}
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {displayProducts.map((product) => (
          <DealsProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default DealsSection;