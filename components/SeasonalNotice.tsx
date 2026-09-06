// components/SeasonalNotice.tsx
"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flower2, Sun, Leaf, Snowflake, TreePine, Cloud, Sprout, SunMedium, X, Star, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeasonalNoticeProps {
  message: string;
  startDate?: string;
  endDate?: string;
  icon?: string;
  variant?: "banner" | "popup" | "compact";
  onClose?: () => void;
  onViewCategories?: () => void;
  className?: string;
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

const SeasonalNotice = ({ 
  message, 
  startDate, 
  endDate, 
  icon = "flower",
  variant = "banner",
  onClose,
  onViewCategories,
  className
}: SeasonalNoticeProps) => {
  const Icon = iconMap[icon as keyof typeof iconMap] || Flower2;

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

  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  // Compact Variant
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "flex items-center gap-2 px-3 py-2",
          "border border-[#E8E3D8]/60 rounded-lg",
          "bg-white/90 backdrop-blur-sm",
          className
        )}
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F5F0E8] flex items-center justify-center">
          <Icon className="w-3 h-3 text-[#D4A853]" />
        </div>
        <p className="flex-1 text-xs font-medium text-[#1a1a1a] truncate">
          {message}
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-[#F5F0E8] transition-colors"
            aria-label="Schließen"
          >
            <X className="w-3 h-3 text-[#8A7A6A] hover:text-[#1a1a1a] transition-colors" />
          </button>
        )}
      </motion.div>
    );
  }

  // Banner Variant
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "w-full",
          "border border-[#E8E3D8]/40 rounded-xl",
          "bg-white/80 backdrop-blur-sm",
          "shadow-sm hover:shadow-md transition-shadow duration-300",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5F0E8] border border-[#E8E3D8] flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#D4A853]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1a1a1a] leading-tight">
                {message}
              </p>
              {(formattedStart || formattedEnd) && (
                <p className="text-xs text-[#8A7A6A] mt-0.5 flex flex-wrap items-center gap-1">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#8A7A6A]" />
                    {formattedStart && <span>ab {formattedStart}</span>}
                    {formattedStart && formattedEnd && <span>•</span>}
                    {formattedEnd && <span>bis {formattedEnd}</span>}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            {onViewCategories && (
              <button
                onClick={onViewCategories}
                className={cn(
                  "px-4 py-2 text-sm font-medium",
                  "border border-[#D4A853]/50 hover:border-[#D4A853]",
                  "text-[#B8923A] hover:text-[#9A7A2A]",
                  "bg-transparent hover:bg-[#F5F0E8]",
                  "rounded-lg transition-all duration-200",
                  "active:scale-[0.97]",
                  "whitespace-nowrap flex items-center gap-1"
                )}
              >
                <span>Alle Kategorien</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-full hover:bg-[#F5F0E8] transition-colors"
                aria-label="Schließen"
              >
                <X className="w-4 h-4 text-[#8A7A6A] hover:text-[#1a1a1a] transition-colors" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Popup Variant
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
        >
          {/* Decorative header */}
          <div className="h-1.5 bg-[#D4A853]" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-[#F5F0E8] transition-colors z-10"
            aria-label="Schließen"
          >
            <X className="w-4 h-4 text-[#8A7A6A] hover:text-[#1a1a1a] transition-colors" />
          </button>
          
          <div className="p-6 pt-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#F5F0E8] border border-[#E8E3D8] flex items-center justify-center">
                <Icon className="w-8 h-8 text-[#D4A853]" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 leading-tight">
                {message}
              </h3>
              
              {(formattedStart || formattedEnd) && (
                <div className="inline-flex items-center gap-2 bg-[#F8F6F2] rounded-full px-4 py-1.5 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-[#8A7A6A]" />
                  <p className="text-xs text-[#8A7A6A]">
                    {formattedStart && <span>Ab {formattedStart}</span>}
                    {formattedStart && formattedEnd && <span> • </span>}
                    {formattedEnd && <span>Bis {formattedEnd}</span>}
                  </p>
                </div>
              )}

              <p className="text-sm text-[#8A7A6A] leading-relaxed mb-6">
                Entdecken Sie unsere saisonalen Produkte und Aktionen.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {onViewCategories && (
                <button
                  onClick={onViewCategories}
                  className={cn(
                    "flex-1 px-6 py-3 text-sm font-semibold",
                    "border border-[#D4A853]/50 hover:border-[#D4A853]",
                    "text-[#B8923A] hover:text-[#9A7A2A]",
                    "bg-transparent hover:bg-[#F5F0E8]",
                    "rounded-lg transition-all duration-200",
                    "active:scale-[0.97]",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  <span>Alle Kategorien anzeigen</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className={cn(
                  "flex-1 px-6 py-3 text-sm font-semibold",
                  "bg-[#1a1a1a] hover:bg-[#2a2a2a]",
                  "text-white",
                  "rounded-lg transition-all duration-200",
                  "active:scale-[0.97]",
                  "shadow-md hover:shadow-lg"
                )}
              >
                Verstanden
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SeasonalNotice;