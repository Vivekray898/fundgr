// components/deals/DealsSection.tsx
"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, PackageX, Eye } from "lucide-react";
import DealsProductCard from "./DealsProductCard";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";
import CatalogueButton from "@/components/CatalogueButton";

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
}

const DealsSection = ({ 
  id, 
  title, 
  description, 
  products, 
  linkText = "Alle anzeigen", 
  linkHref = "/shop",
  accentColor = "rose",
  showViewAll = true
}: DealsSectionProps) => {
  const { enabled } = useCatalogueMode();
  
  // Filter out products with missing data
  const validProducts = products?.filter(p => p && p._id && p.name) || [];

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

      {validProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {validProducts.slice(0, 8).map((product) => (
            <DealsProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-10 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-100">
          <PackageX className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">
            {enabled 
              ? "Keine Produkte in dieser Kategorie verfügbar." 
              : "Keine Angebote in dieser Kategorie verfügbar."}
          </p>
          {enabled && (
            <Link 
              href="/sortiment" 
              className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
            >
              Kategorien entdecken
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}
    </section>
  );
};

export default DealsSection;