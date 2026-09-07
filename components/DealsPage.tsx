// components/DealsPage.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";
import { 
  Tag, 
  Sparkles, 
  Package, 
  Clock, 
  ArrowRight, 
  Percent,
  Store,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  images?: any[];
  price: number;
  discount: number;
  originalPrice?: number;
  isDeal?: boolean;
  dealEndDate?: string;
  status?: string;
  stock?: number;
  categories?: string[];
  brandName?: string;
  brandSlug?: string;
  brand?: string;
  description?: string;
}

interface BrandData {
  _id: string;
  name: string;
  slug: { current: string };
  logo?: any;
  description?: string;
}

interface BrandSectionProps {
  brand: BrandData;
  newProducts: Product[];
  saleProducts: Product[];
  allProducts: Product[];
  isFirst?: boolean;
}

const ProductCard = ({ product, isBoomer }: { product: Product; isBoomer?: boolean }) => {
  const { enabled, pricePlaceholder } = useCatalogueMode();
  const imageUrl = product.images?.[0]?.asset?.url || product.images?.[0]?.url;
  const discountPercent = product.discount > 0 && product.price > 0
    ? Math.round((product.discount / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl border-2 border-amber-200/60 overflow-hidden hover:border-amber-400 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300">
      <Link href={`/product/${product.slug.current}`}>
        <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden bg-amber-50/40">
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
              <Package className="w-12 h-12 text-amber-300" />
            </div>
          )}

          {/* Badges - Large and clear for boomers */}
          {!enabled && product.status === "new" && (
            <div className="absolute top-3 left-3 bg-emerald-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-200/50">
              NEU
            </div>
          )}

          {!enabled && product.status === "sale" && discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-amber-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg shadow-amber-200/50 flex items-center gap-2">
              <Percent className="w-4 h-4" />
              -{discountPercent}%
            </div>
          )}

          {!enabled && product.isDeal && (
            <div className="absolute top-3 right-3 bg-amber-700 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg shadow-amber-200/50 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              ANGEBOT
            </div>
          )}

          {/* Catalogue mode badge */}
          {enabled && (
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent flex items-end justify-center pb-4">
              <span className="bg-white/95 text-amber-700 text-sm font-bold px-4 py-2 rounded-full shadow-lg border-2 border-amber-300">
                {pricePlaceholder}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>

          {!enabled ? (
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-gray-800">
                €{product.price?.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-gray-400 line-through">
                  €{product.originalPrice?.toFixed(2)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border-2 border-emerald-200">
                  -{discountPercent}%
                </span>
              )}
            </div>
          ) : (
            <div className="mt-3">
              <span className="text-base text-gray-500 font-medium">
                {pricePlaceholder}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

const BrandSection = ({ brand, newProducts, saleProducts, allProducts, isFirst = false }: BrandSectionProps) => {
  const { enabled } = useCatalogueMode();
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'sale'>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const getProducts = () => {
    if (activeTab === 'new') return newProducts;
    if (activeTab === 'sale') return saleProducts;
    return allProducts;
  };

  const displayProducts = getProducts();

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [displayProducts]);

  const scrollProducts = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const tabs = [
    { id: 'all', label: 'Alle Produkte' },
    { id: 'new', label: 'Neuheiten', count: newProducts.length },
    { id: 'sale', label: 'Angebote', count: saleProducts.length },
  ];

  return (
    <div className={`mb-12 sm:mb-16 ${!isFirst ? 'border-t-2 border-amber-200/50 pt-8 sm:pt-12' : ''}`}>
      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
        <div className="flex items-center gap-4">
          {brand.logo && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0 bg-white rounded-xl shadow-md p-2 border-2 border-amber-200/60">
              <Image
                src={urlFor(brand.logo).url()}
                alt={brand.name}
                fill
                className="object-contain p-1"
              />
            </div>
          )}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              {brand.name}
            </h2>
            {brand.description && (
              <p className="text-sm text-gray-500 mt-0.5 max-w-2xl">{brand.description}</p>
            )}
          </div>
        </div>
        <Link
          href={`/brand/${brand.slug.current}`}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold text-sm sm:text-base transition-colors ml-auto"
        >
          Alle anzeigen
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Tab Navigation - Large and clear for boomers */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-700 text-white shadow-lg shadow-amber-200/50'
                : 'bg-amber-50 text-gray-700 hover:bg-amber-100'
            }`}
          >
            {tab.id === 'new' && <Sparkles className="w-4 h-4" />}
            {tab.id === 'sale' && <Tag className="w-4 h-4" />}
            {tab.id === 'all' && <Package className="w-4 h-4" />}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-amber-200/50 text-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Products */}
      {displayProducts.length > 0 ? (
        <div className="relative">
          {/* Gradient fades */}
          <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-500 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-500 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          >
            {displayProducts.map((product) => (
              <div
                key={product._id}
                className="min-w-[200px] sm:min-w-[220px] md:min-w-[240px] lg:min-w-[260px] max-w-[260px] snap-start flex-shrink-0"
              >
                <ProductCard product={product} isBoomer={true} />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scrollProducts('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 shadow-lg rounded-full border-2 border-amber-300 flex items-center justify-center hover:bg-amber-50 transition-all z-20"
            >
              <ChevronLeft className="w-6 h-6 text-amber-700" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollProducts('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 shadow-lg rounded-full border-2 border-amber-300 flex items-center justify-center hover:bg-amber-50 transition-all z-20"
            >
              <ChevronRight className="w-6 h-6 text-amber-700" />
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-amber-50/40 rounded-xl border-2 border-amber-200/50">
          <Package className="w-12 h-12 text-amber-300 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">
            {activeTab === 'new' ? 'Keine Neuheiten verfügbar.' :
             activeTab === 'sale' ? 'Keine Angebote verfügbar.' :
             'Keine Produkte verfügbar.'}
          </p>
        </div>
      )}
    </div>
  );
};

// Main DealsPage Component
interface DealsPageProps {
  fundgrube: {
    brand: BrandData;
    new: Product[];
    sale: Product[];
    all: Product[];
  };
  bestpreis: {
    brand: BrandData;
    new: Product[];
    sale: Product[];
    all: Product[];
  };
}

const DealsPage = ({ fundgrube, bestpreis }: DealsPageProps) => {
  const { enabled } = useCatalogueMode();
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalProducts = fundgrube.all.length + bestpreis.all.length;
  const totalNew = fundgrube.new.length + bestpreis.new.length;
  const totalSale = fundgrube.sale.length + bestpreis.sale.length;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Warm, inviting, boomer-friendly */}
      <div ref={heroRef} className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-white py-12 sm:py-16 md:py-20 border-b-2 border-amber-200/50">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
              Aktionen & Angebote
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Entdecken Sie unsere aktuellen Angebote von Fundgrube und Bestpreis
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 border-2 border-amber-200/50 shadow-sm">
                <span className="text-gray-800 font-bold text-lg">{totalProducts}</span>
                <span className="text-gray-500 text-sm ml-2">Produkte</span>
              </div>
              <div className="bg-emerald-50/80 backdrop-blur-sm rounded-full px-5 py-2 border-2 border-emerald-200 shadow-sm">
                <span className="text-emerald-700 font-bold text-lg">{totalNew}</span>
                <span className="text-emerald-600 text-sm ml-2">Neuheiten</span>
              </div>
              <div className="bg-amber-50/80 backdrop-blur-sm rounded-full px-5 py-2 border-2 border-amber-200 shadow-sm">
                <span className="text-amber-700 font-bold text-lg">{totalSale}</span>
                <span className="text-amber-600 text-sm ml-2">Angebote</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-8 sm:py-12">
        {/* Fundgrube Section */}
        <BrandSection
          brand={fundgrube.brand}
          newProducts={fundgrube.new}
          saleProducts={fundgrube.sale}
          allProducts={fundgrube.all}
          isFirst={true}
        />

        {/* Bestpreis Section */}
        <BrandSection
          brand={bestpreis.brand}
          newProducts={bestpreis.new}
          saleProducts={bestpreis.sale}
          allProducts={bestpreis.all}
          isFirst={false}
        />
      </Container>
    </div>
  );
};

export default DealsPage;