"use client";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: Product | null | undefined;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  useEffect(() => {
    const availableItem = favoriteProduct.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableItem || null);
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
    <>
      {!showProduct ? (
        <Link href={"/wishlist"} className="group relative inline-flex items-center">
          <Heart className="w-5 h-5 text-gray-600 group-hover:text-rose-500 hoverEffect transition-colors" />
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white h-3.5 w-3.5 rounded-full text-[10px] font-semibold flex items-center justify-center shadow-sm">
            {favoriteProduct?.length ? favoriteProduct?.length : 0}
          </span>
        </Link>
      ) : (
        <button
          onClick={handleFavorite}
          className={`group relative hover:text-rose-500 hoverEffect border p-1.5 rounded-sm transition-all duration-200 ${
            existingProduct 
              ? "border-rose-400 bg-rose-50/50" 
              : "border-rose-200/80 hover:border-rose-400"
          }`}
        >
          {existingProduct ? (
            <Heart
              fill="#f43f5e"
              className="text-rose-500 group-hover:text-rose-600 hoverEffect w-5 h-5"
            />
          ) : (
            <Heart className="text-gray-400 group-hover:text-rose-500 hoverEffect w-5 h-5" />
          )}
        </button>
      )}
    </>
  );
};

export default FavoriteButton;