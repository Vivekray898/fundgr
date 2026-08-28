// components/SeasonalProductNotice.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SeasonalNotice from "./SeasonalNotice";

interface SeasonalProductNoticeProps {
  categories: Array<{
    title: string;
    slug?: string;
    seasonalMessage?: string;
    seasonalStart?: string;
    seasonalEnd?: string;
    seasonalIcon?: string;
  }>;
  variant?: "banner" | "popup" | "compact";
  className?: string;
  onViewCategories?: () => void;
}

const SeasonalProductNotice = ({ 
  categories, 
  variant = "banner", // Default to banner (more visible)
  className,
  onViewCategories
}: SeasonalProductNoticeProps) => {
  const [showNotice, setShowNotice] = useState(true);
  const router = useRouter();
  
  // Get the first seasonal category with a message
  const seasonalCategory = categories?.find(
    (cat) => cat?.seasonalMessage
  );

  if (!seasonalCategory || !showNotice) return null;

  const handleViewCategories = () => {
    if (onViewCategories) {
      onViewCategories();
    } else {
      router.push('/shop?seasonal=true');
    }
  };

  return (
    <SeasonalNotice
      message={seasonalCategory.seasonalMessage}
      startDate={seasonalCategory.seasonalStart}
      endDate={seasonalCategory.seasonalEnd}
      icon={seasonalCategory.seasonalIcon || "flower"}
      variant={variant}
      className={className}
      onClose={() => setShowNotice(false)}
      onViewCategories={handleViewCategories}
    />
  );
};

export default SeasonalProductNotice;