// components/SeasonalNoProductAvailable.tsx
"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Loader2, Flower2, Sun, Leaf, Snowflake, TreePine, Cloud, Sprout, SunMedium, Star } from "lucide-react";

interface SeasonalNoProductAvailableProps {
  selectedTab?: string;
  className?: string;
  isSeasonal?: boolean;
  seasonalMessage?: string;
  seasonalStart?: string;
  seasonalEnd?: string;
  seasonalIcon?: string;
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

const SeasonalNoProductAvailable = ({
  selectedTab,
  className,
  isSeasonal = false,
  seasonalMessage = "Diese Produkte sind nur saisonal verfügbar!",
  seasonalStart,
  seasonalEnd,
  seasonalIcon = "flower",
  onClose,
}: SeasonalNoProductAvailableProps) => {
  const Icon = iconMap[seasonalIcon as keyof typeof iconMap] || Flower2;

  if (isSeasonal) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center rounded-lg w-full mt-10",
          className
        )}
      >
        {/* Seasonal Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Icon className="w-5 h-5 text-pink-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-pink-800">
                {seasonalMessage}
              </p>
              {(seasonalStart || seasonalEnd) && (
                <p className="text-xs text-pink-600 mt-0.5">
                  {seasonalStart && <span>Verfügbar ab {seasonalStart}</span>}
                  {seasonalStart && seasonalEnd && <span> bis </span>}
                  {seasonalEnd && <span>{seasonalEnd}</span>}
                </p>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-pink-100 transition-colors"
              >
                <X className="w-4 h-4 text-pink-500" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800">
            Derzeit nicht verfügbar
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-600"
        >
          <span className="text-base font-semibold text-darkColor">
            {selectedTab}
          </span>{" "}
          Produkte sind nur in der Saison verfügbar.
        </motion.p>

        {/* Season Animation */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex items-center space-x-2 text-pink-500"
        >
          <Icon className="w-5 h-5" />
          <span>Bald wieder verfügbar!</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm text-gray-500"
        >
          Schauen Sie später wieder vorbei oder entdecken Sie unsere anderen Kategorien.
        </motion.p>
      </div>
    );
  }

  // Default behavior - same as NoProductAvailable
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800">
          No Product Available
        </h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-gray-600"
      >
        We&apos;re sorry, but there are no products matching on{" "}
        <span className="text-base font-semibold text-darkColor">
          {selectedTab}
        </span>{" "}
        criteria at the moment.
      </motion.p>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="flex items-center space-x-2 text-shop_dark_green"
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>We&apos;re restocking shortly</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-sm text-gray-500"
      >
        Please check back later or explore our other product categories.
      </motion.p>
    </div>
  );
};

export default SeasonalNoProductAvailable;