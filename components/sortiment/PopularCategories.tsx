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
    <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-[#E8E3D8]">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-[#1a1a1a]">
          Beliebte Kategorien
        </h2>
        <p className="text-[#8A7A6A] text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
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
              className="group px-2.5 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 bg-[#F8F6F2] border border-[#E8E3D8] rounded-full text-[9px] sm:text-xs md:text-sm font-medium text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] hover:shadow-lg hover:shadow-black/20 active:scale-95 transition-all duration-200 flex items-center gap-1"
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