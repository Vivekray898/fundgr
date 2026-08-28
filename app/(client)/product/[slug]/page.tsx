// app/product/[slug]/page.tsx
import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { getProductBySlug } from "@/sanity/queries";
import { getSettings } from "@/sanity/queries/settings";
import { 
  CornerDownLeft, 
  StarIcon, 
  Truck, 
  ChevronLeft, 
  Share2, 
  MessageCircle, 
  Scale, 
  Package,
  Heart
} from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import SeasonalProductNotice from "@/components/SeasonalProductNotice";
import Link from "next/link";
import MarketLocatorButton from "@/components/MarketLocatorButton";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const settings = await getSettings();
  
  if (!product) {
    return notFound();
  }

  const isCatalogueMode = settings?.catalogueMode?.enabled || false;
  const pricePlaceholder = settings?.catalogueMode?.pricePlaceholder || "Preis im Markt erhältlich";
  const productPageCta = settings?.catalogueMode?.productPageCta || "Bezugsquelle finden";

  const seasonalCategories = product?.categories?.filter(
    (cat: any) => cat?.isSeasonal === true
  );

  let brandSlug = null;
  let brandName = null;
  
  if (product?.brand) {
    if (typeof product.brand === 'object' && product.brand !== null) {
      const brand = product.brand as any;
      brandSlug = brand.slug?.current || brand.slug || null;
      brandName = brand.title || brand.name || null;
    } else if (typeof product.brand === 'string') {
      brandName = product.brand;
    }
  }

  return (
    <>
      {seasonalCategories && seasonalCategories.length > 0 && (
        <SeasonalProductNotice categories={seasonalCategories} variant="banner" />
      )}
      
      <Container className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-6">
        {/* Back Button */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-400 hover:text-blue-600 mb-3 sm:mb-4 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Zurück</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
          {/* Product Images */}
          {product?.images && (
            <div className="w-full lg:w-1/2">
              <ImageView images={product?.images} isStock={product?.stock} />
            </div>
          )}
          
          {/* Product Details */}
          <div className="w-full lg:w-1/2">
            {/* Product Name & Categories */}
            <div className="mb-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-1.5">
                {product?.name}
              </h1>
              {product?.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.categories.slice(0, 3).map((cat: any, index: number) => {
                    const categoryTitle = typeof cat === 'string' ? cat : cat?.title || cat?.name || 'Category';
                    return (
                      <span 
                        key={index}
                        className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                      >
                        {categoryTitle}
                      </span>
                    );
                  })}
                  {product.categories.length > 3 && (
                    <span className="text-[10px] text-gray-400">
                      +{product.categories.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Rating & Description */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      size={14}
                      className="text-yellow-400"
                      fill="#facc15"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">(120)</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Price & Stock */}
            <div className="border-t border-b border-gray-100 py-3 mb-3">
              {!isCatalogueMode ? (
                <div className="flex items-end justify-between">
                  <div>
                    <PriceView
                      price={product?.price}
                      discount={product?.discount}
                      className="text-2xl font-bold"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        product?.stock === 0 
                          ? "bg-red-50 text-red-600" 
                          : "bg-green-50 text-green-600"
                      }`}>
                        {(product?.stock as number) > 0 ? "Auf Lager" : "Ausverkauft"}
                      </span>
                      {product?.stock && product.stock > 0 && (
                        <span className="text-xs text-gray-400">
                          {product.stock} Stk.
                        </span>
                      )}
                    </div>
                  </div>
                  <FavoriteButton showProduct={true} product={product} />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-medium text-gray-600">
                      {pricePlaceholder}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
                      Im Markt verfügbar
                    </span>
                  </div>
                  <FavoriteButton showProduct={true} product={product} />
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mb-3">
              {!isCatalogueMode ? (
                <AddToCartButton product={product} />
              ) : (
                <MarketLocatorButton 
                  brandSlug={brandSlug}
                  brandName={brandName}
                  label={productPageCta}
                />
              )}
            </div>

            {/* Product Characteristics */}
            <ProductCharacteristics product={product} />

            {/* Quick Actions - Always show labels, compact on mobile */}
            <div className="flex items-center justify-between gap-1 sm:gap-2 border-t border-gray-100 py-3">
              {[
                { icon: Scale, label: "Vergleichen" },
                { icon: MessageCircle, label: "Fragen" },
                { icon: Package, label: "Lieferung" },
                { icon: Share2, label: "Teilen" },
              ].map((item, index) => (
                <button
                  key={index}
                  className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-500 hover:text-blue-600 transition-colors px-1 sm:px-2 py-1 rounded hover:bg-gray-50"
                >
                  <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Delivery Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5">
                <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Kostenloser Versand</p>
                  <p className="text-xs text-gray-400">PLZ für Verfügbarkeit prüfen</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5">
                <CornerDownLeft className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Kostenlose Retoure</p>
                  <p className="text-xs text-gray-400">30 Tage Rückgaberecht</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default SingleProductPage;