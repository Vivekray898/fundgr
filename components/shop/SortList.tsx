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
              className="flex items-center space-x-3 hover:cursor-pointer px-3 py-3 rounded-xl hover:bg-[#F5F0E8] transition-colors"
            >
              <RadioGroupItem
                value={option?.value}
                id={option?.value}
                className="rounded-sm border-[#E8E3D8] data-[state=checked]:border-[#D4A853] data-[state=checked]:bg-[#D4A853]"
              />
              <Label
                htmlFor={option.value}
                className={`text-sm ${selectedSort === option?.value ? "font-semibold text-[#1a1a1a]" : "font-normal text-[#1a1a1a]"}`}
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
    <div className="w-full bg-white rounded-xl border border-[#E8E3D8] shadow-sm overflow-hidden mb-4">
      <div className="bg-[#F8F6F2] border-b border-[#E8E3D8] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-[#D4A853]" />
            <h3 className="text-sm font-bold text-[#1a1a1a]">Sortieren nach</h3>
          </div>
          {selectedSort && (
            <button
              onClick={() => setSelectedSort(null)}
              className="flex items-center gap-1 text-xs font-medium text-[#8A7A6A] hover:text-[#B8923A] transition-colors"
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
              className="flex items-center space-x-2 hover:cursor-pointer px-2 py-1.5 rounded-lg hover:bg-[#F5F0E8] transition-colors"
            >
              <RadioGroupItem
                value={option?.value}
                id={option?.value}
                className="rounded-sm border-[#E8E3D8] data-[state=checked]:border-[#D4A853] data-[state=checked]:bg-[#D4A853]"
              />
              <Label
                htmlFor={option.value}
                className={cn(
                  "text-sm",
                  selectedSort === option?.value
                    ? "font-semibold text-[#1a1a1a]"
                    : "font-normal text-[#1a1a1a]"
                )}
              >
                {option?.title}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {selectedSort && (
        <div className="border-t border-[#E8E3D8] px-3 py-1.5 bg-[#F8F6F2]">
          <p className="text-xs text-[#8A7A6A]">1 ausgewählt</p>
        </div>
      )}
    </div>
  );
};

export default SortList;