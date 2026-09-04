// components/HomeBannerWrapper.tsx (Server Component)
import React from "react";
import { getBannerData } from "@/lib/banner";
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
  const bannerData = await getBannerData();
  
  return (
    <HomeBannerClient 
      initialBannerData={bannerData}
      autoplay={autoplay}
      autoplayInterval={autoplayInterval}
    />
  );
};

export default HomeBannerWrapper;