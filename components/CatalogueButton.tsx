// components/CatalogueButton.tsx
"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Eye, ArrowRight } from "lucide-react";

interface CatalogueButtonProps {
  productSlug: string;
  label?: string;
  className?: string;
  variant?: "card" | "page";
  fullWidth?: boolean;
}

const CatalogueButton = ({ 
  productSlug, 
  label = "Details",
  className,
  variant = "card",
  fullWidth = true
}: CatalogueButtonProps) => {
  return (
    <Link
      href={`/product/${productSlug}`}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 sm:gap-2 font-medium transition-all duration-300",
        "text-xs sm:text-sm md:text-base",
        "whitespace-nowrap",
        // Hollow/Outline design - only border colors
        "border-2 border-blue-300 hover:border-blue-500",
        "text-blue-600 hover:text-blue-700",
        "bg-transparent hover:bg-blue-50/50",
        "active:scale-95 rounded-lg",
        "shadow-sm hover:shadow-md transition-shadow",
        variant === "card" 
          ? [
              "py-2 px-3 sm:py-2.5 sm:px-4",
              fullWidth ? "w-full" : "w-auto"
            ]
          : [
              "py-2.5 px-4 sm:py-3 sm:px-6",
              fullWidth ? "w-full sm:w-auto" : "w-auto"
            ],
        className
      )}
    >
      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
      <span className="truncate min-w-0 max-w-[120px] sm:max-w-[200px]">
        {label}
      </span>
      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
};

export default CatalogueButton;