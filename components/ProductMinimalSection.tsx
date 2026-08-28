// components/ProductMinimalSection.tsx
import React from "react";
import Link from "next/link";
import ProductMinimalCard from "./ProductMinimalCard";
import { ArrowRight } from "lucide-react";

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
}

interface ProductMinimalSectionProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

const ProductMinimalSection = ({ 
  products, 
  title = "Top Angebote",
  subtitle,
  linkText = "Alle anzeigen",
  linkHref = "/angebote",
  columns = 4,
  className = ""
}: ProductMinimalSectionProps) => {
  
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`my-12 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <Link 
          href={linkHref} 
          className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center gap-1"
        >
          {linkText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className={`grid ${gridCols} gap-3 sm:gap-4`}>
          {products.map((product) => (
            <ProductMinimalCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-rose-50/30 rounded-lg">
          <p className="text-gray-500">Keine Produkte verfügbar.</p>
        </div>
      )}
    </div>
  );
};

export default ProductMinimalSection;