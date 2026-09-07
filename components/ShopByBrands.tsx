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
    icon: <Store size={24} className="text-amber-700" />,
  },
  {
    title: "Persönliche Beratung",
    description: "Unser Team hilft Ihnen gerne weiter",
    icon: <Headset size={24} className="text-amber-700" />,
  },
  {
    title: "Parkplätze",
    description: "Kostenlose Parkplätze direkt vor Ort",
    icon: <Car size={24} className="text-amber-700" />,
  },
  {
    title: "Marktöffnungszeiten",
    description: "Mo-Sa: 9:00-20:00 Uhr",
    icon: <Clock size={24} className="text-amber-700" />,
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
    <div className="mb-10 lg:mb-20 bg-gradient-to-br from-amber-50/40 via-orange-50/30 to-white p-3 sm:p-5 lg:p-7 rounded-xl border border-amber-200/40 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <Title className="text-base sm:text-xl lg:text-2xl font-bold">
            <span className="text-gray-800">
              Marken entdecken
            </span>
          </Title>
          <p className="text-[9px] sm:text-xs lg:text-sm text-gray-500 mt-1">
            {typedBrands?.length || 0} Marken in unserem Sortiment
          </p>
        </div>
        <Link
          href={"/shop"}
          className="text-[9px] sm:text-xs lg:text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors hover:underline flex-shrink-0"
        >
          Alle Marken →
        </Link>
      </div>

      {/* Brands Grid - Horizontal Scroll on Mobile - Larger Cards */}
      <div className="lg:hidden overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-3 sm:gap-4">
          {displayBrands?.map((brand: BrandItem) => (
            <Link
              key={brand?._id}
              href={{ pathname: "/shop", query: { brand: brand?.slug?.current } }}
              className="group bg-white rounded-xl border border-amber-200/50 w-[140px] sm:w-[180px] h-24 sm:h-32 flex flex-col items-center justify-center overflow-hidden hover:shadow-lg hover:shadow-amber-100/50 hover:border-amber-300 transition-all duration-300 relative snap-start flex-shrink-0"
            >
              {brand?.logo ? (
                <Image
                  src={urlFor(brand?.logo).url()}
                  alt={brand?.name || "Marke"}
                  width={120}
                  height={60}
                  className="w-16 sm:w-28 h-10 sm:h-16 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-xs sm:text-sm text-gray-400 font-medium px-2 text-center">
                  {brand?.name || "Unbenannte Marke"}
                </div>
              )}
              {brand?.featured && (
                <div className="absolute top-1.5 right-1.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                </div>
              )}
              {brand?.marketLocation && (
                <div className="absolute bottom-1.5 right-1.5">
                  <MapPin className="w-2 h-2 text-emerald-600" />
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
            className="group bg-white rounded-xl border border-amber-200/50 h-24 flex flex-col items-center justify-center overflow-hidden hover:shadow-lg hover:shadow-amber-100/50 hover:border-amber-300 transition-all duration-300 relative"
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
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              </div>
            )}
            {brand?.marketLocation && (
              <div className="absolute bottom-1 right-1">
                <MapPin className="w-2.5 h-2.5 text-emerald-600" />
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Store Services - Half the size of brand cards */}
      <div className="mt-3 sm:mt-5 p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200/30">
        <div className="lg:hidden overflow-x-auto scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-2">
            {storeServices?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 group hover:bg-amber-50/60 p-1.5 rounded-lg transition-colors min-w-[100px] snap-start flex-shrink-0"
              >
                <span className="inline-flex scale-100 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {item?.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-gray-800 truncate">
                    {item?.title}
                  </p>
                  <p className="text-[8px] text-gray-500 truncate">{item?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-4 gap-3">
          {storeServices?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-1.5 group hover:bg-amber-50/60 p-2.5 rounded-lg transition-colors"
            >
              <span className="inline-flex scale-100 group-hover:scale-110 transition-transform duration-300">
                {item?.icon}
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  {item?.title}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">{item?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopByBrands;