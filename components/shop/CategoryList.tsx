// components/shop/CategoryList.tsx
import { Category } from "@/sanity.types";
import React, { useState, useEffect } from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  categories?: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoryList = ({
  categories: propCategories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use prop categories if provided
  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setCategories(propCategories);
      return;
    }
  }, [propCategories]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (category: any) => {
    // Get the slug from the category (could be nested in slug.current or directly as slug)
    const slug = category?.slug?.current || category?.slug || null;
    
    if (slug) {
      setSelectedCategory(slug);
    } else {
      console.error("Category has no slug:", category);
    }
  };

  // Only show top-level categories (no parent)
  const topLevelCategories = categories?.filter(
    (category) => !category.parent
  );

  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Product Categories</Title>
      <div className="mt-2 space-y-1">
        {isLoading ? (
          <div className="text-sm text-gray-500 py-2">Loading...</div>
        ) : topLevelCategories?.length === 0 ? (
          <div className="text-sm text-gray-500 py-2">No categories found</div>
        ) : (
          topLevelCategories?.map((category) => {
            const hasChildren = category.children && category.children.length > 0;
            const isExpanded = expandedCategories.includes(category?._id);

            return (
              <div key={category?._id}>
                {/* Parent Category */}
                <div
                  onClick={() => handleCategoryClick(category)}
                  className="flex items-center space-x-2 hover:cursor-pointer py-1"
                >
                  {hasChildren && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category?._id);
                      }}
                      className="p-0.5 hover:bg-gray-100 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  )}
                  <RadioGroup value={selectedCategory || ""} className="space-y-0">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={category?.slug?.current || category?.slug || ""}
                        id={category?.slug?.current || category?.slug || category?._id}
                        className="rounded-sm"
                        onClick={() => handleCategoryClick(category)}
                      />
                      <Label
                        htmlFor={category?.slug?.current || category?.slug || category?._id}
                        className={`${
                          selectedCategory === (category?.slug?.current || category?.slug)
                            ? "font-semibold text-shop_dark_green"
                            : "font-normal"
                        }`}
                      >
                        {category?.title}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Child Categories */}
                {hasChildren && isExpanded && (
                  <div className="ml-8 border-l border-gray-200 pl-3">
                    {category.children?.map((child: any) => {
                      // Get slug from child (could be nested or direct)
                      const childSlug = child?.slug?.current || child?.slug || "";
                      
                      return (
                        <div
                          key={child?._id || childSlug}
                          onClick={() => handleCategoryClick(child)}
                          className="flex items-center space-x-2 hover:cursor-pointer py-1"
                        >
                          <RadioGroup value={selectedCategory || ""} className="space-y-0">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={childSlug}
                                id={childSlug || child?._id}
                                className="rounded-sm"
                                onClick={() => handleCategoryClick(child)}
                              />
                              <Label
                                htmlFor={childSlug || child?._id}
                                className={`text-sm ${
                                  selectedCategory === childSlug
                                    ? "font-semibold text-shop_dark_green"
                                    : "font-normal text-gray-600"
                                }`}
                              >
                                {child?.title}
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-[1px] hover:text-shop_dark_green hoverEffect text-left"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default CategoryList;