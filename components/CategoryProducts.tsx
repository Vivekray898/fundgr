"use client";
import { Category, Product } from "@/sanity.types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, ChevronDown } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface Props {
  categories: Category[];
  slug: string;
}

const CategoryProducts = ({ categories, slug }: Props) => {
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const router = useRouter();

  // Filter to only TOP-LEVEL categories (no parent)
  const topLevelCategories = categories?.filter((category) => !category.parent);

  const handleCategoryChange = (newSlug: string) => {
    if (newSlug === currentSlug) return;
    setCurrentSlug(newSlug);
    router.push(`/category/${newSlug}`, { scroll: false });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const fetchProducts = async (categorySlug: string) => {
    setLoading(true);
    try {
      const query = `
        *[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc){
        ...,"categories": categories[]->title}
      `;
      const data = await client.fetch(query, { categorySlug });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentSlug);
  }, [currentSlug]);

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5">
      <div className="flex flex-col md:min-w-40 border">
        {topLevelCategories?.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedCategory === item._id;
          
          return (
            <div key={item?._id}>
              <Button
                onClick={() => handleCategoryChange(item?.slug?.current as string)}
                className={`bg-transparent border-0 p-0 rounded-none text-darkColor shadow-none hover:bg-shop_orange hover:text-white font-semibold hoverEffect border-b last:border-b-0 transition-colors capitalize ${
                  item?.slug?.current === currentSlug && "bg-shop_orange text-white border-shop_orange"
                }`}
              >
                <p className="w-full text-left px-2 flex items-center justify-between">
                  {item?.title}
                  {hasChildren && (
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(item?._id);
                      }}
                    />
                  )}
                </p>
              </Button>
              
              {hasChildren && isExpanded && (
                <div className="bg-gray-50 border-b">
                  {item.children?.map((child: any) => (
                    <Button
                      key={child?._id}
                      onClick={() => handleCategoryChange(child?.slug?.current as string)}
                      className={`bg-transparent border-0 p-0 rounded-none text-darkColor shadow-none hover:bg-shop_orange hover:text-white font-semibold hoverEffect transition-colors capitalize w-full pl-6 text-sm ${
                        child?.slug?.current === currentSlug && "bg-shop_orange text-white"
                      }`}
                    >
                      <p className="w-full text-left px-2 py-2">{child?.title}</p>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full">
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Product is loading...</span>
            </div>
          </div>
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products?.map((product: Product) => (
              <AnimatePresence key={product._id}>
                <motion.div>
                  <ProductCard product={product} />
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        ) : (
          <NoProductAvailable
            selectedTab={currentSlug}
            className="mt-0 w-full"
          />
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;