// components/HomeCategoriesSimple.tsx
import React from 'react';
import Link from 'next/link';
import { Category } from '@/sanity.types';

interface HomeCategoriesSimpleProps {
  categories: Category[];
  title?: string;
  limit?: number;
}

const HomeCategoriesSimple = ({ 
  categories, 
  title = "Alle Kategorien",
  limit = 12
}: HomeCategoriesSimpleProps) => {
  // If no categories, don't render
  if (!categories || categories.length === 0) {
    return null;
  }

  // Limit the number of categories shown
  const displayCategories = categories.slice(0, limit);

  return (
    <section className="py-8 sm:py-12 border-t border-gray-100">
      <div className="max-w-[1530px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
          {title}
        </h2>

        {/* Categories Grid */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {displayCategories.map((category) => (
            <Link
              key={category._id}
              href={`/category/${category?.slug?.current}`}
              className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base text-gray-700 bg-gray-50 hover:bg-amber-50 hover:text-amber-800 rounded-full border border-gray-200 hover:border-amber-300 transition-all duration-200"
            >
              {category.title}
            </Link>
          ))}
        </div>

        {/* "View All" link if there are more categories */}
        {categories.length > limit && (
          <div className="mt-6">
            <Link
              href="/sortiment"
              className="text-sm text-amber-700 hover:text-amber-900 font-medium hover:underline transition-colors"
            >
              Alle Kategorien anzeigen →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeCategoriesSimple;