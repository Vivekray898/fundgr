// components/SeasonalNoProductAvailable.tsx
"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { 
  Loader2, 
  Flower2, 
  Sun, 
  Leaf, 
  Snowflake, 
  TreePine, 
  Cloud, 
  Sprout, 
  SunMedium, 
  Star,
  X,
  Calendar,
  Sparkles,
  ChevronRight,
  Clock,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface SeasonalNoProductAvailableProps {
  selectedTab?: string;
  className?: string;
  isSeasonal?: boolean;
  seasonalMessage?: string;
  seasonalStart?: string;
  seasonalEnd?: string;
  seasonalIcon?: string;
  onClose?: () => void;
  compact?: boolean;
  onViewCategories?: () => void;
}

const iconMap = {
  flower: Flower2,
  sun: Sun,
  autumn: Leaf,
  snowflake: Snowflake,
  christmas: TreePine,
  pumpkin: Star,
  rain: Cloud,
  spring: Sprout,
  summer: SunMedium,
};

const SeasonalNoProductAvailable = ({
  selectedTab,
  className,
  isSeasonal = false,
  seasonalMessage = "Diese Produkte sind nur saisonal verfügbar.",
  seasonalStart,
  seasonalEnd,
  seasonalIcon = "flower",
  onClose,
  compact = false,
  onViewCategories,
}: SeasonalNoProductAvailableProps) => {
  const Icon = iconMap[seasonalIcon as keyof typeof iconMap] || Flower2;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formattedStart = formatDate(seasonalStart);
  const formattedEnd = formatDate(seasonalEnd);

  if (isSeasonal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "w-full",
          compact ? "py-4" : "py-6",
          className
        )}
      >
        <div className={cn(
          "w-full max-w-2xl mx-auto",
          "border-2 border-[#E8E3D8] rounded-xl",
          "bg-white/80 backdrop-blur-sm",
          "shadow-sm",
          compact ? "p-4" : "p-5"
        )}>
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex-shrink-0 rounded-full border-2 border-[#E8E3D8] bg-[#F5F0E8] flex items-center justify-center",
              compact ? "w-10 h-10" : "w-12 h-12"
            )}>
              <Icon className={cn(
                "text-[#D4A853]",
                compact ? "w-5 h-5" : "w-6 h-6"
              )} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F0E8] text-[#B8923A] border border-[#E8E3D8]">
                  <Sparkles className="w-3 h-3" />
                  Saisonal
                </span>
                {(formattedStart || formattedEnd) && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#8A7A6A] bg-[#F8F6F2] px-2 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {formattedStart && formattedStart}
                    {formattedStart && formattedEnd && " – "}
                    {formattedEnd && formattedEnd}
                  </span>
                )}
              </div>
              
              <p className={cn(
                "text-[#1a1a1a] font-medium",
                compact ? "text-sm" : "text-base"
              )}>
                {seasonalMessage}
              </p>
              
              <p className="text-xs text-[#8A7A6A] mt-1">
                Dieses Produkt ist nur während der Saison verfügbar.
              </p>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[#F5F0E8] transition-colors"
                aria-label="Schließen"
              >
                <X className="w-4 h-4 text-[#8A7A6A] hover:text-[#1a1a1a] transition-colors" />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 pt-4 border-t border-[#E8E3D8]">
            <Link
              href="/sortiment"
              className={cn(
                "flex-1 inline-flex items-center justify-center gap-2",
                "border border-[#D4A853]/50 hover:border-[#D4A853]",
                "text-[#B8923A] hover:text-[#9A7A2A]",
                "bg-transparent hover:bg-[#F5F0E8]",
                "rounded-lg font-medium transition-all duration-200",
                "active:scale-[0.97]",
                compact ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-sm"
              )}
            >
              <span>Alle Kategorien anzeigen</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            
            <button
              onClick={() => {
                if (onViewCategories) {
                  onViewCategories();
                } else {
                  window.location.href = '/shop?seasonal=true';
                }
              }}
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "bg-[#1a1a1a] hover:bg-[#2a2a2a]",
                "text-white",
                "rounded-lg font-medium transition-all duration-200",
                "active:scale-[0.97]",
                "shadow-sm hover:shadow-md",
                compact ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-sm"
              )}
            >
              <Clock className="w-4 h-4" />
              <span>Benachrichtigen lassen</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-4 px-4">
          <p className="text-sm text-[#8A7A6A]">
            {selectedTab ? (
              <>
                <span className="font-medium text-[#1a1a1a]">{selectedTab}</span>{" "}
                Produkte sind nur in der Saison erhältlich.
              </>
            ) : (
              "Diese Kategorie ist aktuell nicht verfügbar."
            )}
          </p>
          <p className="text-xs text-[#8A7A6A] mt-1">
            Schauen Sie später wieder vorbei oder entdecken Sie unsere anderen Kategorien.
          </p>
        </div>
      </motion.div>
    );
  }

  // Default - No Product Available
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full",
        compact ? "py-6" : "py-8",
        className
      )}
    >
      <div className="text-center max-w-md mx-auto px-4">
        <div className={cn(
          "mx-auto rounded-full border-2 border-[#E8E3D8] bg-[#F8F6F2] flex items-center justify-center",
          compact ? "w-16 h-16" : "w-20 h-20"
        )}>
          <AlertCircle className={cn(
            "text-[#8A7A6A]",
            compact ? "w-8 h-8" : "w-10 h-10"
          )} />
        </div>

        <h2 className={cn(
          "font-semibold text-[#1a1a1a] mt-4",
          compact ? "text-lg" : "text-xl"
        )}>
          Derzeit nicht verfügbar
        </h2>

        <p className={cn(
          "text-[#8A7A6A] mt-2",
          compact ? "text-sm" : "text-base"
        )}>
          {selectedTab ? (
            <>
              In der Kategorie{" "}
              <span className="font-medium text-[#D4A853]">
                {selectedTab}
              </span>{" "}
              sind aktuell keine Produkte verfügbar.
            </>
          ) : (
            "In dieser Kategorie sind aktuell keine Produkte verfügbar."
          )}
        </p>

        <div className="flex items-center justify-center gap-2 mt-3">
          <Loader2 className="w-4 h-4 text-[#D4A853] animate-spin" />
          <span className="text-sm text-[#B8923A] font-medium">
            Wir füllen bald wieder auf
          </span>
        </div>

        <p className="text-xs text-[#8A7A6A] mt-2">
          Schauen Sie später wieder vorbei oder entdecken Sie unsere anderen Kategorien.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-5">
          <Link
            href="/sortiment"
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "border border-[#D4A853]/50 hover:border-[#D4A853]",
              "text-[#B8923A] hover:text-[#9A7A2A]",
              "bg-transparent hover:bg-[#F5F0E8]",
              "rounded-lg font-medium transition-all duration-200",
              "active:scale-[0.97]",
              compact ? "px-5 py-2 text-sm" : "px-6 py-2.5 text-sm"
            )}
          >
            <span>Alle Kategorien</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          
          <button
            onClick={() => {
              if (onViewCategories) {
                onViewCategories();
              } else {
                window.location.href = '/shop';
              }
            }}
            className={cn(
              "inline-flex items-center justify-center gap-2",
              "bg-[#1a1a1a] hover:bg-[#2a2a2a]",
              "text-white",
              "rounded-lg font-medium transition-all duration-200",
              "active:scale-[0.97]",
              "shadow-sm hover:shadow-md",
              compact ? "px-5 py-2 text-sm" : "px-6 py-2.5 text-sm"
            )}
          >
            <span>Zum Shop</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SeasonalNoProductAvailable;