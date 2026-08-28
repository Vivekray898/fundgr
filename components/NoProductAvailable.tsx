"use client";

import { cn } from "@/lib/utils";
import { Loader2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

interface NoProductAvailableProps {
  selectedTab?: string;
  className?: string;
  compact?: boolean;
}

const NoProductAvailable = ({
  selectedTab,
  className,
  compact = false,
}: NoProductAvailableProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full",
        compact ? "py-8 sm:py-10" : "py-12 sm:py-16",
        className
      )}
    >
      <div className="text-center px-4 max-w-md">
        {/* Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>

        <h2 className={cn(
          "font-semibold text-gray-800",
          compact ? "text-xl" : "text-2xl sm:text-3xl"
        )}>
          Keine Produkte verfügbar
        </h2>

        <p className={cn(
          "text-gray-600 mt-2",
          compact ? "text-sm" : "text-base"
        )}>
          Es tut uns leid, aber es gibt derzeit keine Produkte in der Kategorie{" "}
          <span className="font-medium text-rose-500">
            {selectedTab || "ausgewählten"}
          </span>
        </p>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />
          <span className="text-rose-500 font-medium text-sm">
            Wir füllen bald wieder auf
          </span>
        </div>

        <p className="text-gray-400 text-sm mt-3">
          Schauen Sie später wieder vorbei oder entdecken Sie unsere anderen Kategorien.
        </p>

        <Link
          href="/sortiment"
          className={cn(
            "inline-flex items-center gap-2 mt-5 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors",
            compact ? "px-4 py-2 text-sm" : "px-6 py-2.5 text-base"
          )}
        >
          <span>Alle Kategorien entdecken</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default NoProductAvailable;