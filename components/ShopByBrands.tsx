// components/ShopByBrands.tsx
import React from "react";
import Title from "./Title";
import Link from "next/link";
import { getAllBrands } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { GitCompareArrows, Headset, ShieldCheck, Truck, Star, MapPin } from "lucide-react";

const extraData = [
  {
    title: "Kostenloser Versand",
    description: "Kostenloser Versand ab 100€",
    icon: <Truck size={45} className="text-rose-500" />,
  },
  {
    title: "Kostenlose Retoure",
    description: "30 Tage Rückgaberecht",
    icon: <GitCompareArrows size={45} className="text-rose-500" />,
  },
  {
    title: "Kundensupport",
    description: "Freundlicher 24/7 Support",
    icon: <Headset size={45} className="text-rose-500" />,
  },
  {
    title: "Geld-Zurück-Garantie",
    description: "Qualitätsgeprüft durch unser Team",
    icon: <ShieldCheck size={45} className="text-rose-500" />,
  },
];

const ShopByBrands = async () => {
  const brands = await getAllBrands();
  
  // Sort brands: featured first, then by order, then by name
  const sortedBrands = brands?.sort((a, b) => {
    if (a?.featured && !b?.featured) return -1;
    if (!a?.featured && b?.featured) return 1;
    if ((a?.order || 0) !== (b?.order || 0)) {
      return (a?.order || 0) - (b?.order || 0);
    }
    return (a?.name || '').localeCompare(b?.name || '');
  });

  // Take only first 8 brands for display
  const displayBrands = sortedBrands?.slice(0, 8);

  return (
    <div className="mb-10 lg:mb-20 bg-gradient-to-br from-rose-50/50 via-pink-50/50 to-blue-50/50 p-5 lg:p-7 rounded-xl border border-pink-100">
      <div className="flex items-center gap-5 justify-between mb-6">
        <div>
          <Title className="text-xl sm:text-2xl font-bold">
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Marken entdecken
            </span>
          </Title>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {brands?.length || 0} Marken in unserem Sortiment
          </p>
        </div>
        <Link
          href={"/shop"}
          className="text-xs sm:text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors hover:underline"
        >
          Alle anzeigen →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
        {displayBrands?.map((brand) => (
          <Link
            key={brand?._id}
            href={{ pathname: "/shop", query: { brand: brand?.slug?.current } }}
            className="group bg-white rounded-xl border border-pink-100 h-20 sm:h-24 flex flex-col items-center justify-center overflow-hidden hover:shadow-lg hover:shadow-rose-100/50 hover:border-rose-200 transition-all duration-300 relative"
          >
            {brand?.logo ? (
              <Image
                src={urlFor(brand?.logo).url()}
                alt={brand?.name || "Brand"}  // Changed from title to name
                width={120}
                height={60}
                className="w-20 sm:w-28 h-12 sm:h-16 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-xs text-gray-400 font-medium px-2 text-center">
                {brand?.name || "Unbenannte Marke"}  // Changed from title to name
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

      {/* Extra Data - Service Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-100">
        {extraData?.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 group hover:bg-rose-50/50 p-3 rounded-lg transition-colors"
          >
            <span className="inline-flex scale-100 group-hover:scale-110 transition-transform duration-300">
              {item?.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {item?.title}
              </p>
              <p className="text-xs text-gray-500">{item?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByBrands;