// components/HomeCategories.tsx
import React from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

// Define interface for categories with optional productCount
interface CategoryWithCount extends Category {
  productCount?: number;
}

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  // Cast categories to include optional productCount
  const categoriesWithCount = categories as CategoryWithCount[];

  return (
    <div className="bg-white border border-amber-200/50 my-6 md:my-20 p-3 sm:p-5 lg:p-7 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <Title className="border-b border-amber-200 pb-2 text-base sm:text-xl text-gray-800">
          Beliebte Kategorien
        </Title>
        <Link
          href="/sortiment"
          className="text-[10px] sm:text-xs lg:text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors hover:underline flex-shrink-0"
        >
          Alle anzeigen →
        </Link>
      </div>

      {/* Mobile: Horizontal Scroll */}
      <div className="lg:hidden overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-2 sm:gap-3">
          {categoriesWithCount?.map((category) => (
            <div
              key={category?._id}
              className="bg-amber-50/40 p-2.5 sm:p-3 flex items-center gap-2.5 group rounded-lg hover:shadow-md hover:bg-amber-50/70 transition-all min-w-[140px] sm:min-w-[160px] snap-start flex-shrink-0 border border-amber-100/50 hover:border-amber-200"
            >
              {category?.image && (
                <div className="overflow-hidden border border-amber-200/50 hover:border-amber-300 hoverEffect w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 p-1 rounded-lg bg-amber-50/30">
                  <Link href={`/category/${category?.slug?.current}`}>
                    <Image
                      src={urlFor(category?.image).url()}
                      alt={category?.title || "Kategorie-Bild"}
                      width={500}
                      height={500}
                      className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                    />
                  </Link>
                </div>
              )}
              <div className="space-y-0.5 min-w-0 flex-1">
                <h3 className="text-[10px] sm:text-xs font-semibold truncate text-gray-800">
                  {category?.title}
                </h3>
                <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">
                  <span className="font-bold text-amber-700">{`(${category?.productCount || 0})`}</span>{" "}
                  <span className="hidden xs:inline">Artikel</span>
                  <span className="xs:hidden">Art.</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden lg:grid grid-cols-3 gap-4 lg:gap-5">
        {categoriesWithCount?.map((category) => (
          <div
            key={category?._id}
            className="bg-amber-50/40 p-4 lg:p-5 flex items-center gap-3 group rounded-lg hover:shadow-md hover:bg-amber-50/70 transition-all border border-amber-100/50 hover:border-amber-200"
          >
            {category?.image && (
              <div className="overflow-hidden border border-amber-200/50 hover:border-amber-300 hoverEffect w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 p-1 rounded-lg bg-amber-50/30">
                <Link href={`/category/${category?.slug?.current}`}>
                  <Image
                    src={urlFor(category?.image).url()}
                    alt={category?.title || "Kategorie-Bild"}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                  />
                </Link>
              </div>
            )}
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="text-sm lg:text-base font-semibold truncate text-gray-800">
                {category?.title}
              </h3>
              <p className="text-xs lg:text-sm text-gray-600 truncate">
                <span className="font-bold text-amber-700">{`(${category?.productCount || 0})`}</span>{" "}
                <span>Artikel verfügbar</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;