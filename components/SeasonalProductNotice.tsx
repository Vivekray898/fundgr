// components/SeasonalProductNotice.tsx
"use client";
import React, { useState } from "react";
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
}

const SeasonalProductNotice = ({ categories }: SeasonalProductNoticeProps) => {
  const [showNotice, setShowNotice] = useState(true);
  
  // Get the first seasonal category with a message
  const seasonalCategory = categories.find(
    (cat) => cat.seasonalMessage
  );

  if (!seasonalCategory || !showNotice) return null;

  return (
    <SeasonalNotice
      message={seasonalCategory.seasonalMessage}
      startDate={seasonalCategory.seasonalStart}
      endDate={seasonalCategory.seasonalEnd}
      icon={seasonalCategory.seasonalIcon}
      variant="popup"
      onClose={() => setShowNotice(false)}
    />
  );
};

export default SeasonalProductNotice;