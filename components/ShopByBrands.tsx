// components/ShopByBrands.tsx
import React from "react";
import Title from "./Title";
import Link from "next/link";
import { getAllBrands } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { MapPin, Clock, Store, Car, CreditCard, Phone, Package, RotateCcw, Star, Headset, Truck, GitCompareArrows, ShieldCheck } from "lucide-react";

// Store-specific services - optimized for mobile/desktop
const storeServices = [
  {
    title: "Marktabholung",
    description: "Bestellen & im Markt abholen",
    icon: <Store size={28} className="text-rose-500" />,
  },
  {
    title: "Persönliche Beratung",
    description: "Unser Team hilft Ihnen gerne weiter",
    icon: <Headset size={28} className="text-rose-500" />,
  },
  {
    title: "Parkplätze",
    description: "Kostenlose Parkplätze direkt vor Ort",
    icon: <Car size={28} className="text-rose-500" />,
  },
  {
    title: "Marktöffnungszeiten",
    description: "Mo-Sa: 9:00-20:00 Uhr",
    icon: <Clock size={28} className="text-rose-500" />,
  },
];

// Define interface for brand type
interface BrandItem {
  _id: string;
  name?: string;
  slug?: {
    current: string;
  };
  logo?: any;
  description?: string;
  featured?: boolean;
  order?: number;
  marketLocation?: boolean;
}

const ShopByBrands = async () => {
  const brands = await getAllBrands();
  
  // Cast brands to BrandItem[]
  const typedBrands = (brands || []) as BrandItem[];
  
  // Marken sortieren: Featured zuerst, dann nach Reihenfolge, dann nach Name
  const sortedBrands = typedBrands?.sort((a: BrandItem, b: BrandItem) => {
    if (a?.featured && !b?.featured) return -1;
    if (!a?.featured && b?.featured) return 1;
    if ((a?.order || 0) !== (b?.order || 0)) {
      return (a?.order || 0) - (b?.order || 0);
    }
    return (a?.name || '').localeCompare(b?.name || '');
  });

  // Nur die ersten 8 Marken anzeigen
  const displayBrands = sortedBrands?.slice(0, 8);

  return (
    <div className="mb-10 lg:mb-20 bg-gradient-to-br from-rose-50/50 via-pink-50/50 to-blue-50/50 p-3 sm:p-5 lg:p-7 rounded-xl border border-pink-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <Title className="text-base sm:text-xl lg:text-2xl font-bold">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Marken entdecken
            </span>
          </Title>
          <p className="text-[9px] sm:text-xs lg:text-sm text-gray-500 mt-1">
            {typedBrands?.length || 0} Marken in unserem Sortiment
          </p>
        </div>
        <Link
          href={"/shop"}
          className="text-[9px] sm:text-xs lg:text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors hover:underline flex-shrink-0"
        >
          Alle Marken →
        </Link>
      </div>

      {/* Brands Grid - Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="lg:hidden overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-2 sm:gap-3">
          {displayBrands?.map((brand: BrandItem) => (
            <Link
              key={brand?._id}
              href={{ pathname: "/shop", query: { brand: brand?.slug?.current } }}
              className="group bg-white rounded-xl border border-pink-100 w-[100px] sm:w-[140px] h-16 sm:h-24 flex flex-col items-center justify-center overflow-hidden hover:shadow-lg hover:shadow-rose-100/50 hover:border-rose-200 transition-all duration-300 relative snap-start flex-shrink-0"
            >
              {brand?.logo ? (
                <Image
                  src={urlFor(brand?.logo).url()}
                  alt={brand?.name || "Marke"}
                  width={80}
                  height={40}
                  className="w-12 sm:w-20 h-8 sm:h-12 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-[9px] sm:text-xs text-gray-400 font-medium px-2 text-center">
                  {brand?.name || "Unbenannte Marke"}
                </div>
              )}
              {brand?.featured && (
                <div className="absolute top-1 right-1">
                  <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
                </div>
              )}
              {brand?.marketLocation && (
                <div className="absolute bottom-1 right-1">
                  <MapPin className="w-1.5 h-1.5 text-emerald-500" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Grid - Hidden on Mobile */}
      <div className="hidden lg:grid grid-cols-8 gap-3">
        {displayBrands?.map((brand: BrandItem) => (
          <Link
            key={brand?._id}
            href={{ pathname: "/shop", query: { brand: brand?.slug?.current } }}
            className="group bg-white rounded-xl border border-pink-100 h-24 flex flex-col items-center justify-center overflow-hidden hover:shadow-lg hover:shadow-rose-100/50 hover:border-rose-200 transition-all duration-300 relative"
          >
            {brand?.logo ? (
              <Image
                src={urlFor(brand?.logo).url()}
                alt={brand?.name || "Marke"}
                width={120}
                height={60}
                className="w-24 h-14 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-xs text-gray-400 font-medium px-2 text-center">
                {brand?.name || "Unbenannte Marke"}
              </div>
            )}
            {brand?.featured && (
              <div className="absolute top-1 right-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>
            )}
            {brand?.marketLocation && (
              <div className="absolute bottom-1 right-1">
                <MapPin className="w-2.5 h-2.5 text-emerald-500" />
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Store Services - Mobile: Compact Horizontal Scroll, Desktop: Grid */}
      <div className="mt-4 sm:mt-8 p-2 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-100">
        <div className="lg:hidden overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-2">
            {storeServices?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 group hover:bg-rose-50/50 p-2 rounded-lg transition-colors min-w-[120px] snap-start flex-shrink-0"
              >
                <span className="inline-flex scale-100 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {item?.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-gray-800 truncate">
                    {item?.title}
                  </p>
                  <p className="text-[9px] text-gray-500 truncate">{item?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-4 gap-4">
          {storeServices?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-2 group hover:bg-rose-50/50 p-4 rounded-lg transition-colors"
            >
              <span className="inline-flex scale-100 group-hover:scale-110 transition-transform duration-300">
                {item?.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {item?.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopByBrands;