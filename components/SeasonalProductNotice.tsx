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
  variant = "banner",
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

  // Use default message if seasonalMessage is undefined
  const message = seasonalCategory.seasonalMessage || "Saisonale Produkte verfügbar!";
  const startDate = seasonalCategory.seasonalStart;
  const endDate = seasonalCategory.seasonalEnd;
  const icon = seasonalCategory.seasonalIcon || "flower";

  const handleViewCategories = () => {
    if (onViewCategories) {
      onViewCategories();
    } else {
      router.push('/shop?seasonal=true');
    }
  };

  return (
    <SeasonalNotice
      message={message}
      startDate={startDate}
      endDate={endDate}
      icon={icon}
      variant={variant}
      className={className}
      onClose={() => setShowNotice(false)}
      onViewCategories={handleViewCategories}
    />
  );
};

export default SeasonalProductNotice;