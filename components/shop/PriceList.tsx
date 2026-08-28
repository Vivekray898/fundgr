// components/shop/PriceList.tsx
import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { DollarSign, X } from "lucide-react";

const priceArray = [
  { title: "Under $100", value: "0-100" },
  { title: "$100 - $200", value: "100-200" },
  { title: "$200 - $300", value: "200-300" },
  { title: "$300 - $500", value: "300-500" },
  { title: "Over $500", value: "500-10000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
  isMobile?: boolean;
}

const PriceList = ({ selectedPrice, setSelectedPrice, isMobile = false }: Props) => {
  if (isMobile) {
    return (
      <div className="pb-2">
        <RadioGroup value={selectedPrice || ""} className="space-y-1">
          {priceArray?.map((price, index) => (
            <div
              key={index}
              onClick={() => setSelectedPrice(price?.value)}
              className="flex items-center space-x-3 hover:cursor-pointer px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem
                value={price?.value}
                id={price?.value}
                className="rounded-sm"
              />
              <Label
                htmlFor={price.value}
                className={`text-sm ${selectedPrice === price?.value ? "font-semibold text-shop_dark_green" : "font-normal text-gray-700"}`}
              >
                {price?.title}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-shop_light_green" />
            <h3 className="text-sm font-bold text-gray-800">Price Range</h3>
          </div>
          {selectedPrice && (
            <button
              onClick={() => setSelectedPrice(null)}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-3 pb-3 pt-2">
        <RadioGroup value={selectedPrice || ""} className="space-y-0.5">
          {priceArray?.map((price, index) => (
            <div
              key={index}
              onClick={() => setSelectedPrice(price?.value)}
              className="flex items-center space-x-2 hover:cursor-pointer px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem
                value={price?.value}
                id={price?.value}
                className="rounded-sm"
              />
              <Label
                htmlFor={price.value}
                className={`text-sm ${selectedPrice === price?.value ? "font-semibold text-shop_dark_green" : "font-normal text-gray-700"}`}
              >
                {price?.title}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {selectedPrice && (
        <div className="border-t border-gray-100 px-3 py-1.5 bg-gray-50/50">
          <p className="text-xs text-gray-400">1 selected</p>
        </div>
      )}
    </div>
  );
};

export default PriceList;