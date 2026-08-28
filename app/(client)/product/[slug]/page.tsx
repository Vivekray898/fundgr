// app/product/[slug]/page.tsx
import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import { getProductBySlug } from "@/sanity/queries";
import { CornerDownLeft, StarIcon, Truck, ChevronLeft, Share2, MessageCircle, Scale, Package } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import { RxBorderSplit } from "react-icons/rx";
import { TbTruckDelivery } from "react-icons/tb";
import SeasonalProductNotice from "@/components/SeasonalProductNotice";
import Link from "next/link";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }

  // Check if product has seasonal categories
  const seasonalCategories = product?.categories?.filter(
    (cat: any) => cat?.isSeasonal === true
  );

  return (
    <>
      {seasonalCategories && seasonalCategories.length > 0 && (
        <SeasonalProductNotice categories={seasonalCategories} />
      )}
      
      <Container className="px-3 sm:px-4 md:px-6 py-3 sm:py-6 md:py-10">
        {/* Back Button - Mobile */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-500 mb-3 md:mb-6 transition-colors lg:hidden"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-10">
          {/* Product Images */}
          {product?.images && (
            <div className="w-full lg:w-1/2">
              <ImageView images={product?.images} isStock={product?.stock} />
            </div>
          )}
          
          {/* Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3 md:gap-5">
            {/* Product Name & Description */}
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                {product?.name}
              </h1>
              {product?.categories && product.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.categories.map((cat: any, index: number) => {
                    // Get category title - handle both string and object
                    const categoryTitle = typeof cat === 'string' ? cat : cat?.title || cat?.name || 'Category';
                    return (
                      <span 
                        key={index}
                        className="text-[10px] sm:text-xs font-medium text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full"
                      >
                        {categoryTitle}
                      </span>
                    );
                  })}
                </div>
              )}
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    size={14}
                    className="text-rose-400"
                    fill="#f43f5e"
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                120 Reviews
              </p>
            </div>

            {/* Price & Stock */}
            <div className="space-y-2 border-t border-b border-rose-100 py-3 md:py-5">
              <PriceView
                price={product?.price}
                discount={product?.discount}
                className="text-lg sm:text-xl md:text-2xl font-bold"
              />
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                  product?.stock === 0 
                    ? "bg-red-100 text-red-600" 
                    : "bg-green-100 text-green-600"
                }`}>
                  {(product?.stock as number) > 0 ? "In Stock" : "Out of Stock"}
                </span>
                {product?.stock && product.stock > 0 && (
                  <span className="text-xs sm:text-sm text-gray-500">
                    {product.stock} units available
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex-1">
                <AddToCartButton product={product} />
              </div>
              <FavoriteButton showProduct={true} product={product} />
            </div>

            {/* Product Characteristics */}
            <ProductCharacteristics product={product} />

            {/* Action Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-rose-100 py-3">
              {[
                { icon: Scale, label: "Compare" },
                { icon: MessageCircle, label: "Ask" },
                { icon: Package, label: "Delivery" },
                { icon: Share2, label: "Share" },
              ].map((item, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-rose-50 transition-colors group"
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                  <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-rose-500 transition-colors">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Delivery Info */}
            <div className="space-y-2">
              <div className="border border-rose-100 rounded-xl p-3 flex items-center gap-3 bg-gradient-to-r from-rose-50/50 to-pink-50/50">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Truck className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Free Delivery
                  </p>
                  <p className="text-xs text-gray-500">
                    Enter your Postal code for Delivery Availability.
                  </p>
                </div>
              </div>
              <div className="border border-rose-100 rounded-xl p-3 flex items-center gap-3 bg-gradient-to-r from-blue-50/50 to-rose-50/50">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <CornerDownLeft className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Return Delivery
                  </p>
                  <p className="text-xs text-gray-500">
                    Free 30 days Delivery Returns.{" "}
                    <span className="text-rose-500 font-medium underline underline-offset-2">
                      Details
                    </span>
                  </p>
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