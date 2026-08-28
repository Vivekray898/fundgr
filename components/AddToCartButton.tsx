"use client";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success(
        `${product?.name?.substring(0, 12)}... added successfully!`
      );
    } else {
      toast.error("Can not add more than available stock");
    }
  };
  return (
    <div className="w-full min-h-[40px] sm:h-12 flex items-center">
      {itemCount ? (
        <div className="text-xs sm:text-sm w-full">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] sm:text-xs text-gray-500">Qty</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t border-rose-100 pt-1 mt-0.5">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
              className="text-rose-500 font-semibold text-xs sm:text-sm"
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full bg-rose-500 text-white shadow-none border border-rose-500 font-semibold tracking-wide hover:bg-rose-600 hover:border-rose-600 hoverEffect text-[11px] sm:text-sm py-1.5 sm:py-2 px-2 sm:px-4 h-auto min-h-[36px] sm:h-10",
            className
          )}
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
          <span className="truncate">{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;