// components/shop/SortList.tsx
import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { ArrowUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const sortOptions = [
  { title: "Beliebtheit", value: "popular" },
  { title: "Neueste zuerst", value: "newest" },
  { title: "Name A-Z", value: "name-asc" },
  { title: "Name Z-A", value: "name-desc" },
  { title: "Bewertung", value: "rating" },
];

interface Props {
  selectedSort?: string | null;
  setSelectedSort: React.Dispatch<React.SetStateAction<string | null>>;
  isMobile?: boolean;
}

const SortList = ({ selectedSort, setSelectedSort, isMobile = false }: Props) => {
  if (isMobile) {
    return (
      <div className="pb-2">
        <RadioGroup value={selectedSort || ""} className="space-y-1">
          {sortOptions?.map((option, index) => (
            <div
              key={index}
              onClick={() => setSelectedSort(option?.value)}
              className="flex items-center space-x-3 hover:cursor-pointer px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem
                value={option?.value}
                id={option?.value}
                className="rounded-sm"
              />
              <Label
                htmlFor={option.value}
                className={`text-sm ${selectedSort === option?.value ? "font-semibold text-rose-600" : "font-normal text-gray-700"}`}
              >
                {option?.title}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-pink-100 shadow-sm overflow-hidden mb-4">
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-blue-50 border-b border-pink-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-gray-800">Sortieren nach</h3>
          </div>
          {selectedSort && (
            <button
              onClick={() => setSelectedSort(null)}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-rose-500 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Zurücksetzen</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-3 pb-3 pt-2">
        <RadioGroup value={selectedSort || ""} className="space-y-0.5">
          {sortOptions?.map((option, index) => (
            <div
              key={index}
              onClick={() => setSelectedSort(option?.value)}
              className="flex items-center space-x-2 hover:cursor-pointer px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem
                value={option?.value}
                id={option?.value}
                className="rounded-sm"
              />
              <Label
                htmlFor={option.value}
                className={cn(
                  "text-sm",
                  selectedSort === option?.value
                    ? "font-semibold text-rose-600"
                    : "font-normal text-gray-700"
                )}
              >
                {option?.title}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {selectedSort && (
        <div className="border-t border-pink-100 px-3 py-1.5 bg-gradient-to-r from-rose-50/30 via-pink-50/30 to-blue-50/30">
          <p className="text-xs text-gray-400">1 ausgewählt</p>
        </div>
      )}
    </div>
  );
};

export default SortList;