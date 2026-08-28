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

  // Format date for better display
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

  // Compact Variant - Clean and minimal
  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "flex items-center gap-2 px-3 py-2",
          "border border-blue-200/60 rounded-lg",
          "bg-white/90",
          className
        )}
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
          <Icon className="w-3 h-3 text-blue-600" />
        </div>
        <p className="flex-1 text-xs font-medium text-gray-700 truncate">
          {message}
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Schließen"
          >
            <X className="w-3 h-3 text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
        )}
      </motion.div>
    );
  }

  // Banner Variant - Professional German design with blue/red
  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "w-full",
          "border border-blue-200/40 rounded-xl",
          "bg-white",
          "shadow-sm hover:shadow-md transition-shadow duration-300",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
          {/* Left - Icon & Content */}
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {message}
              </p>
              {(formattedStart || formattedEnd) && (
                <p className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-1">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    {formattedStart && <span>ab {formattedStart}</span>}
                    {formattedStart && formattedEnd && <span>•</span>}
                    {formattedEnd && <span>bis {formattedEnd}</span>}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            {onViewCategories && (
              <button
                onClick={onViewCategories}
                className={cn(
                  "px-4 py-2 text-sm font-medium",
                  "border border-blue-300 hover:border-blue-500",
                  "text-blue-600 hover:text-blue-700",
                  "bg-transparent hover:bg-blue-50",
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
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Schließen"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Popup Variant - German design with blue/red
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
          {/* Decorative header - German flag colors */}
          <div className="h-1.5 flex">
            <div className="flex-1 bg-black" />
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-yellow-400" />
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Schließen"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors" />
          </button>
          
          <div className="p-6 pt-4">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                {message}
              </h3>
              
              {(formattedStart || formattedEnd) && (
                <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-1.5 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <p className="text-xs text-gray-600">
                    {formattedStart && <span>Ab {formattedStart}</span>}
                    {formattedStart && formattedEnd && <span> • </span>}
                    {formattedEnd && <span>Bis {formattedEnd}</span>}
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Entdecken Sie unsere saisonalen Produkte und Aktionen.
              </p>
            </div>

            {/* Actions - Clean buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {onViewCategories && (
                <button
                  onClick={onViewCategories}
                  className={cn(
                    "flex-1 px-6 py-3 text-sm font-semibold",
                    "border border-blue-300 hover:border-blue-500",
                    "text-blue-600 hover:text-blue-700",
                    "bg-transparent hover:bg-blue-50",
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
                  "bg-blue-600 hover:bg-blue-700",
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