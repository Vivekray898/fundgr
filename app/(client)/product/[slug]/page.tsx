// app/product/[slug]/page.tsx
import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import RelatedProducts from "@/components/RelatedProducts";
import RecentlyViewed from "@/components/RecentlyViewed";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { getProductBySlug, getRelatedProducts } from "@/sanity/queries";
import { getSettings } from "@/sanity/queries/settings";
import {
  StarIcon,
  ChevronLeft,
  Store,
  Clock,
  MapPin,
  PhoneCall,
} from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import SeasonalProductNotice from "@/components/SeasonalProductNotice";
import Link from "next/link";
import MarketLocatorButton from "@/components/MarketLocatorButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import ShareButton from "@/components/ShareButton";

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

  // Fetch related products based on categories
  const relatedProducts = await getRelatedProducts({
    currentProductId: product._id,
    categoryIds: product.categories?.map((cat: any) => cat._id) || [],
    limit: 8,
  });

  const isCatalogueMode = settings?.catalogueMode?.enabled || false;
  const pricePlaceholder = settings?.catalogueMode?.pricePlaceholder || "Preis im Markt erhältlich";
  const productPageCta = settings?.catalogueMode?.productPageCta || "Bezugsquelle finden";
  const storePhone = settings?.contactPhone || "+49 123 456 789";
  const whatsappNumber = "4917632853448";

  const seasonalCategories = product?.categories?.filter(
    (cat: any) => cat?.isSeasonal === true
  );

  let brandSlug = null;
  let brandName = null;

  if (product?.brand) {
    if (typeof product.brand === "object" && product.brand !== null) {
      const brand = product.brand as any;
      brandSlug = brand.slug?.current || brand.slug || null;
      brandName = brand.title || brand.name || null;
    } else if (typeof product.brand === "string") {
      brandName = product.brand;
    }
  }

  // Build WhatsApp URL with product link and German text
  const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://fundgrube.de'}/product/${product.slug?.current || slug}`;
  const whatsappText = `Hallo! Ich habe eine Frage zu folgendem Produkt: ${product.name} - ${productUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappText)}&type=phone_number&app_absent=0`;

  return (
    <>
      {seasonalCategories && seasonalCategories.length > 0 && (
        <SeasonalProductNotice categories={seasonalCategories} variant="banner" />
      )}

      <Container className="px-4 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-gray-700 hover:text-amber-700 mb-4 sm:mb-5 transition-colors py-2 -ml-1 pl-1 pr-2 rounded-lg hover:bg-amber-50"
        >
          <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5" />
          <span>Zurück zur Übersicht</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-10">
          {/* Product Images */}
          {product?.images && (
            <div className="w-full lg:w-1/2">
              <ImageView images={product?.images} isStock={product?.stock} />
            </div>
          )}

          {/* Product Details */}
          <div className="w-full lg:w-1/2">
            {/* Product Name & Categories */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2.5">
                {product?.name}
              </h1>
              {product?.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.categories.slice(0, 3).map((cat: any, index: number) => {
                    const categoryTitle = typeof cat === "string" ? cat : cat?.title || cat?.name || "Category";
                    return (
                      <span
                        key={index}
                        className="text-xs sm:text-sm font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full"
                      >
                        {categoryTitle}
                      </span>
                    );
                  })}
                  {product.categories.length > 3 && (
                    <span className="text-xs sm:text-sm text-gray-600 self-center">
                      +{product.categories.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Rating & Description */}
            <div className="mb-4">
              {!isCatalogueMode && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon key={index} size={20} className="text-amber-500" fill="#d97706" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">(120 Bewertungen)</span>
                </div>
              )}
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Price & Stock */}
            <div className="border-t-2 border-b-2 border-amber-200/70 py-4 mb-4">
              {!isCatalogueMode ? (
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <PriceView
                      price={product?.price}
                      discount={product?.discount}
                      className="text-3xl sm:text-4xl font-extrabold"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-3 py-1 text-sm font-bold rounded-full ${
                          product?.stock === 0
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {(product?.stock as number) > 0 ? "Auf Lager" : "Ausverkauft"}
                      </span>
                      {product?.stock && product.stock > 0 && (
                        <span className="text-sm text-gray-600 font-medium">
                          {product.stock} Stk. verfügbar
                        </span>
                      )}
                    </div>
                  </div>
                  <FavoriteButton showProduct={true} product={product} />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{pricePlaceholder}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-sm font-bold rounded-full bg-amber-100 text-amber-800">
                      Im Markt verfügbar
                    </span>
                  </div>
                  <FavoriteButton showProduct={true} product={product} />
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mb-4">
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

            {/* Quick Actions - Only Share button remains */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 border-t-2 border-amber-200/70 py-4">
              <WhatsAppButton 
                whatsappUrl={whatsappUrl} 
                label="Fragen"
                variant="button"
              />
              <ShareButton 
                productName={product.name} 
                productUrl={productUrl} 
              />
            </div>

            {/* Market Info - Removed WhatsApp Contact Section */}
            <div className="space-y-3 mt-1">
              {/* Phone Contact Section */}
              <a
                href={`tel:${storePhone.replace(/[^\d+]/g, "")}`}
                className="flex items-start gap-4 bg-amber-700 rounded-xl px-4 py-4 hover:bg-amber-800 transition-colors"
                aria-label={`Markt anrufen: ${storePhone}`}
              >
                <PhoneCall className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-base font-bold text-white">Fragen zum Produkt?</p>
                  <p className="text-lg font-extrabold text-white underline">{storePhone}</p>
                </div>
              </a>

              <div className="flex items-start gap-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl px-4 py-4 border-2 border-amber-200/60">
                <Store className="w-6 h-6 text-amber-800 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-base font-bold text-gray-900">Im Markt verfügbar</p>
                  <p className="text-sm text-gray-600 mt-0.5">Jetzt in Ihrem Fundgrube Markt vorrätig</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gradient-to-r from-blue-50 to-amber-50 rounded-xl px-4 py-4 border-2 border-amber-200/60">
                <Clock className="w-6 h-6 text-amber-800 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-base font-bold text-gray-900">Öffnungszeiten</p>
                  <p className="text-sm text-gray-600 mt-0.5">Mo – Sa: 08:00 – 20:00 Uhr</p>
                </div>
              </div>

              <Link
                href="/store"
                className="flex items-start gap-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl px-4 py-4 border-2 border-amber-200/60 hover:border-amber-400 hover:bg-amber-100/60 transition-colors"
              >
                <MapPin className="w-6 h-6 text-amber-800 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-base font-bold text-gray-900">Markt finden</p>
                  <p className="text-sm text-amber-800 font-semibold mt-0.5">
                    Nächsten Fundgrube Markt finden →
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <Container>
          <RelatedProducts
            products={relatedProducts}
            title="Das könnte Ihnen auch gefallen"
          />
        </Container>
      )}

      {/* Recently Viewed Section */}
      <Container>
        <RecentlyViewed
          currentProductId={product._id}
          currentProduct={product}
          maxItems={8}
        />
      </Container>
    </>
  );
};

export default SingleProductPage;