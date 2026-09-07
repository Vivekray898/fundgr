// components/ProductCharacteristics.tsx
"use client";
import { Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Package, Tag, Calendar, Box } from "lucide-react";
import { useCatalogueMode } from "@/components/providers/CatalogueSettingsProvider";

interface ProductCharacteristicsProps {
  product: Product | null | undefined;
}

const ProductCharacteristics = ({ product }: ProductCharacteristicsProps) => {
  const { enabled: isCatalogueMode } = useCatalogueMode();
  const [brandName, setBrandName] = useState<string>("Unknown");

  useEffect(() => {
    const fetchBrand = async () => {
      if (product?.brand) {
        try {
          // If brand is a reference object with a title
          if (typeof product.brand === 'object' && product.brand !== null) {
            const brand = product.brand as any;
            setBrandName(brand.title || brand.name || "Unknown");
          } else {
            setBrandName("Unknown");
          }
        } catch (error) {
          console.error("Error fetching brand:", error);
          setBrandName("Unknown");
        }
      }
    };
    fetchBrand();
  }, [product]);

  // Build characteristics - conditionally include stock
  const characteristics = [
    { label: "Brand", value: brandName, icon: Tag },
    { label: "Collection", value: "2025", icon: Calendar },
    { label: "Type", value: product?.variant || "Standard", icon: Box },
  ];

  // Only add stock if NOT in catalogue mode
  if (!isCatalogueMode) {
    characteristics.push({
      label: "Stock",
      value: product?.stock ? `${product.stock} available` : "Out of Stock",
      icon: Package,
    });
  }

  return (
    <Accordion type="single" collapsible className="border border-amber-200/50 rounded-xl overflow-hidden">
      <AccordionItem value="characteristics" className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:bg-amber-50/50 transition-colors text-sm sm:text-base font-semibold text-gray-800">
          <div className="flex items-center gap-2">
            <span>Produktdetails</span>
            <span className="text-xs text-gray-400 font-normal">
              ({characteristics.length} {characteristics.length === 1 ? 'Eintrag' : 'Einträge'})
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-1">
          <div className="space-y-2">
            {characteristics.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-amber-100/50 last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Catalogue mode note */}
          {isCatalogueMode && (
            <div className="mt-3 pt-2 border-t border-amber-200/30">
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>Preise und Verfügbarkeit bitte im Markt erfragen</span>
              </p>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;