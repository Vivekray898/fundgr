"use client";
import { cn } from "@/lib/utils";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  useEffect(() => {
    const availableProduct = favoriteProduct?.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableProduct || null);
  }, [product, favoriteProduct]);
  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct
            ? "Product removed successfully!"
            : "Product added successfully!"
        );
      });
    }
  };
  return (
    <div
      className={cn("absolute top-2 right-2 hover:cursor-pointer", className)}
    >
      <div
        onClick={handleFavorite}
        className={`p-1.5 sm:p-2.5 rounded-full hover:bg-rose-500 hover:text-white hoverEffect transition-colors ${
          existingProduct ? "bg-rose-500 text-white" : "bg-white/80 text-gray-600 hover:bg-rose-500"
        }`}
      >
        <Heart size={12} className={`sm:w-4 sm:h-4 ${existingProduct ? "fill-white" : ""}`} />
      </div>
    </div>
  );
};

export default ProductSideMenu;