// components/SeasonalNotice.tsx
"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flower2, Sun, Leaf, Snowflake, TreePine, Cloud, Sprout, SunMedium, X, Star } from "lucide-react";

interface SeasonalNoticeProps {
  message: string;
  startDate?: string;
  endDate?: string;
  icon?: string;
  variant?: "banner" | "popup";
  onClose?: () => void;
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
  onClose 
}: SeasonalNoticeProps) => {
  const Icon = iconMap[icon as keyof typeof iconMap] || Flower2;

  if (variant === "banner") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-rose-50 via-pink-50 to-blue-50 border border-rose-200 mb-4 shadow-sm"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-rose-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-rose-700">{message}</p>
          {(startDate || endDate) && (
            <p className="text-xs text-rose-500/80 mt-0.5">
              {startDate && <span>Verfügbar ab {startDate}</span>}
              {startDate && endDate && <span> bis </span>}
              {endDate && <span>{endDate}</span>}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-full hover:bg-rose-100 transition-colors"
            aria-label="Schließen"
          >
            <X className="w-4 h-4 text-rose-400 hover:text-rose-600" />
          </button>
        )}
      </motion.div>
    );
  }

  // Popup variant
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
        >
          {/* Decorative gradient background */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-blue-400" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-rose-50 transition-colors z-10"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-rose-500 transition-colors" />
          </button>
          
          <div className="flex flex-col items-center text-center pt-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 via-pink-100 to-blue-100 flex items-center justify-center mb-4 shadow-md">
              <Icon className="w-8 h-8 text-rose-500" />
            </div>
            <p className="text-base font-semibold text-gray-800 mb-2">
              {message}
            </p>
            {(startDate || endDate) && (
              <p className="text-sm text-gray-500 mb-6">
                {startDate && <span>Verfügbar ab {startDate}</span>}
                {startDate && endDate && <span> bis </span>}
                {endDate && <span>{endDate}</span>}
              </p>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-sm font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
            >
              Verstanden
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SeasonalNotice;