import React from "react";
import Title from "./Title";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="bg-white border border-shop_light_green/20 my-10 md:my-20 p-3 sm:p-5 lg:p-7 rounded-md overflow-hidden">
      <Title className="border-b pb-3 text-base sm:text-xl">Popular Categories</Title>
      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {categories?.map((category) => (
          <div
            key={category?._id}
            className="bg-shop_light_bg p-3 sm:p-4 lg:p-5 flex items-center gap-3 group rounded-md hover:shadow-md transition-shadow"
          >
            {category?.image && (
              <div className="overflow-hidden border border-shop_orange/30 hover:border-shop_orange hoverEffect w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 p-1 rounded-md">
                <Link href={`/category/${category?.slug?.current}`}>
                  <Image
                    src={urlFor(category?.image).url()}
                    alt={category?.title || "Category image"}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                  />
                </Link>
              </div>
            )}
            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-semibold truncate">
                {category?.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                <span className="font-bold text-shop_dark_green">{`(${category?.productCount || 0})`}</span>{" "}
                <span className="hidden xs:inline">items Available</span>
                <span className="xs:hidden">items</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;