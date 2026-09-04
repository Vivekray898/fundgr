// components/HomeBannerWrapper.tsx (Server Component)
import React from "react";
import { getBannerData } from "@/lib/banner.server";
import HomeBannerClient from "./HomeBannerClient";

interface HomeBannerWrapperProps {
  autoplay?: boolean;
  autoplayInterval?: number;
}

// This is a Server Component
const HomeBannerWrapper = async ({ 
  autoplay = true, 
  autoplayInterval = 5000 
}: HomeBannerWrapperProps) => {
  try {
    const bannerData = await getBannerData();
    
    return (
      <HomeBannerClient 
        initialBannerData={bannerData}
        autoplay={autoplay}
        autoplayInterval={autoplayInterval}
      />
    );
  } catch (error) {
    console.error("Error loading banner data:", error);
    // Return with null data - client will show fallback
    return (
      <HomeBannerClient 
        initialBannerData={null}
        autoplay={autoplay}
        autoplayInterval={autoplayInterval}
      />
    );
  }
};

export default HomeBannerWrapper;