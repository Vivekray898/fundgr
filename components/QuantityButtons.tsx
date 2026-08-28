import { Product } from "@/sanity.types";
import useStore from "@/store";
import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

const QuantityButtons = ({ product, className }: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;
  const isMaxStock = itemCount === (product?.stock as number);

  const handleRemoveProduct = () => {
    removeItem(product?._id);
    if (itemCount > 1) {
      toast.success("Quantity Decreased successfully!");
    } else {
      toast.success(`${product?.name?.substring(0, 12)} removed successfully!`);
    }
  };

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success("Quantity Increased successfully!");
    } else {
      toast.error("Can not add more than available stock");
    }
  };

  return (
    <div className={cn("flex items-center gap-1.5 sm:gap-2", className)}>
      <button
        onClick={handleRemoveProduct}
        disabled={itemCount === 0 || isOutOfStock}
        className={cn(
          "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200",
          itemCount === 0 || isOutOfStock
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-rose-200 text-gray-600 hover:bg-rose-50 hover:border-rose-400 hover:text-rose-500 active:scale-95"
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
      
      <span className="font-semibold text-sm sm:text-base w-6 sm:w-8 text-center text-gray-700 tabular-nums">
        {itemCount}
      </span>
      
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isMaxStock}
        className={cn(
          "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200",
          isOutOfStock || isMaxStock
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-rose-200 text-gray-600 hover:bg-rose-50 hover:border-rose-400 hover:text-rose-500 active:scale-95"
        )}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};

export default QuantityButtons;