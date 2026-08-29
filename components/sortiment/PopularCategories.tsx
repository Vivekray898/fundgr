// components/sortiment/PopularCategories.tsx
"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";

// Define interface for category with flexible slug
interface Category {
  _id: string;
  title: string;
  slug?: {
    current: string;
  } | string;
  productCount?: number;
}

// Helper function to safely get slug string
const getSlugString = (slug: any): string => {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
};

const PopularCategories = ({ categories }: { categories: Category[] }) => {
  const popularCategories = categories?.slice(0, 12);

  return (
    <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-pink-100">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-base sm:text-xl md:text-2xl font-bold">
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Beliebte Kategorien
          </span>
        </h2>
        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
          Die meistbesuchten Kategorien unserer Kunden
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {popularCategories?.map((category) => {
          const slug = getSlugString(category.slug);
          return (
            <Link
              key={category._id}
              href={`/category/${slug}`}
              className="group px-2.5 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 bg-gradient-to-r from-rose-50 to-pink-50 border border-pink-200 rounded-full text-[9px] sm:text-xs md:text-sm font-medium text-gray-700 hover:from-rose-500 hover:to-pink-500 hover:text-white hover:border-rose-500 hover:shadow-lg hover:shadow-rose-200/50 active:scale-95 transition-all duration-200 flex items-center gap-1"
            >
              <Sparkles className="w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 group-hover:animate-pulse" />
              {category.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategories;