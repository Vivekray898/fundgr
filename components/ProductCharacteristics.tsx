import { Product } from "@/sanity.types";
import { getBrand } from "@/sanity/queries";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ChevronDown, Package, Tag, Calendar, Box } from "lucide-react";

const ProductCharacteristics = async ({
  product,
}: {
  product: Product | null | undefined;
}) => {
  const brand = await getBrand(product?.slug?.current as string);
  const brandName = brand && brand.length > 0 ? brand[0]?.brandName : "Unknown";

  const characteristics = [
    { label: "Brand", value: brandName, icon: Tag },
    { label: "Collection", value: "2025", icon: Calendar },
    { label: "Type", value: product?.variant || "Standard", icon: Box },
    { label: "Stock", value: product?.stock ? "Available" : "Out of Stock", icon: Package },
  ];

  return (
    <Accordion type="single" collapsible className="border border-rose-100 rounded-xl overflow-hidden">
      <AccordionItem value="characteristics" className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:bg-rose-50/50 transition-colors text-sm sm:text-base font-semibold text-gray-800">
          <div className="flex items-center gap-2">
            <span>Product Details</span>
            <span className="text-xs text-gray-400 font-normal">
              ({characteristics.length} items)
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
                  className="flex items-center justify-between py-2 border-b border-rose-50 last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-rose-400" />
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;