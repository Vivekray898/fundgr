// components/ShareButton.tsx
"use client";

import React from "react";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  productName: string;
  productUrl: string;
}

const ShareButton = ({ productName, productUrl }: ShareButtonProps) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productName,
          text: `Schau dir dieses Produkt an: ${productName}`,
          url: productUrl,
        });
      } else {
        await navigator.clipboard?.writeText(productUrl);
        alert('Link wurde in die Zwischenablage kopiert!');
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Share error:', error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-sm font-semibold text-gray-700 hover:text-amber-800 transition-colors px-2 py-3 rounded-xl border-2 border-amber-200/60 hover:bg-amber-50 hover:border-amber-400 min-h-[56px] w-full"
    >
      <Share2 className="w-5 h-5 flex-shrink-0" />
      <span className="whitespace-nowrap">Teilen</span>
    </button>
  );
};

export default ShareButton;