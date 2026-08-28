// app/(client)/category/[slug]/page.tsx
import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import Title from "@/components/Title";
import { getCategories } from "@/sanity/queries";
import { notFound } from "next/navigation";
import React from "react";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const categories = await getCategories();
  const { slug } = await params;

  // Find the category by slug
  const category = categories?.find(
    (cat: any) => cat.slug?.current === slug || cat.slug === slug
  );

  // Find parent category if this is a child
  const parentCategory = categories?.find((cat: any) => {
    if (cat.children) {
      return cat.children.some(
        (child: any) => child.slug?.current === slug || child.slug === slug
      );
    }
    return false;
  });

  const displayCategory = category || parentCategory;

  if (!displayCategory) {
    return notFound();
  }

  // Get breadcrumb info
  const isChild = !!parentCategory && !category;
  const parentTitle = isChild ? parentCategory.title : null;
  const categoryTitle = category?.title || parentCategory?.children?.find(
    (child: any) => child.slug?.current === slug || child.slug === slug
  )?.title || slug;

  return (
    <div className="py-4 sm:py-6 md:py-10">
      <Container>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 overflow-x-auto whitespace-nowrap">
          <span className="hover:text-rose-500 transition-colors cursor-pointer">
            <a href="/sortiment">Sortiment</a>
          </span>
          <span>›</span>
          {parentTitle && (
            <>
              <span className="hover:text-rose-500 transition-colors cursor-pointer">
                <a href={`/category/${parentCategory.slug?.current || parentCategory.slug}`}>
                  {parentTitle}
                </a>
              </span>
              <span>›</span>
            </>
          )}
          <span className="text-rose-600 font-medium">{categoryTitle}</span>
        </div>

        <Title className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-4">
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            {categoryTitle}
          </span>
          {category?.productCount && (
            <span className="text-sm sm:text-base font-normal text-gray-400 ml-2">
              ({category.productCount} Produkte)
            </span>
          )}
        </Title>

        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;