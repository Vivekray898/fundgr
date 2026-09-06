// components/HomeCategoriesSimple.tsx
import React from 'react';
import Link from 'next/link';
import { Category } from '@/sanity.types';

interface HomeCategoriesSimpleProps {
  categories: Category[];
  title?: string;
  limit?: number;
}

// Helper function to safely get slug
const getCategorySlug = (category: any): string => {
  if (!category) return '';
  
  // If slug is a string, use it directly
  if (typeof category.slug === 'string') {
    return category.slug;
  }
  
  // If slug is an object with current property
  if (category.slug && typeof category.slug === 'object' && 'current' in category.slug) {
    return category.slug.current;
  }
  
  // If slug is null or undefined, generate from title
  if (category.title) {
    return category.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  return '';
};

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
    <section className="py-8 sm:py-12 border-t border-[#E8E3D8]">
      <div className="max-w-[1530px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-6 sm:mb-8">
          {title}
        </h2>

        {/* Categories Grid */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {displayCategories.map((category) => {
            const slug = getCategorySlug(category);
            // Skip if no slug
            if (!slug) return null;
            
            return (
              <Link
                key={category._id}
                href={`/category/${slug}`}
                className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base text-[#1a1a1a] bg-[#F8F6F2] hover:bg-[#F5F0E8] hover:text-[#B8923A] rounded-full border border-[#E8E3D8] hover:border-[#D4A853] transition-all duration-200"
              >
                {category.title}
              </Link>
            );
          })}
        </div>

        {/* "View All" link if there are more categories */}
        {categories.length > limit && (
          <div className="mt-6">
            <Link
              href="/sortiment"
              className="text-sm text-[#B8923A] hover:text-[#9A7A2A] font-medium hover:underline transition-colors"
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