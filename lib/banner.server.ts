// lib/banner.server.ts
import "server-only";
import { BANNER_QUERY } from "@/sanity/queries/bannerQuery";
import { sanityFetch } from "@/sanity/lib/live";
import { getLatestYouTubeVideoDirect } from "./youtube.server";

export interface BannerData {
  _id: string;
  title: string;
  isActive: boolean;
  desktopImage: string;
  mobileImage?: string;
  desktopImageAlt?: string;
  mobileImageAlt?: string;
  bannerLink?: string;
  bannerExpiryDays: number;
  bannerActivationDate?: string;
  bannerExpiryDate?: string;
  youtubeEnabled: boolean;
  youtubeChannelId?: string;
  youtubeVideoId?: string;
  youtubeThumbnail?: string;
  youtubeThumbnailAlt?: string;
  youtubeExpiryDays: number;
  youtubeActivationDate?: string;
  youtubeExpiryDate?: string;
  fallbackBanner: string;
  fallbackBannerAlt?: string;
  fallbackBannerLink?: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface ProcessedBannerData {
  banner: {
    image: string;
    alt?: string;
    link?: string;
    isActive: boolean;
    isExpired: boolean;
  };
  youtube: {
    enabled: boolean;
    videoId?: string;
    thumbnail?: string;
    thumbnailAlt?: string;
    isExpired: boolean;
  };
  fallback: {
    image: string;
    alt?: string;
    link?: string;
  };
}

export function calculateExpiryDate(activationDate: Date, days: number): Date {
  const expiry = new Date(activationDate);
  expiry.setDate(expiry.getDate() + days);
  return expiry;
}

export function isExpired(expiryDate: Date | string | undefined): boolean {
  if (!expiryDate) return true;
  const expiry = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  return new Date() > expiry;
}

export async function getBannerData(): Promise<ProcessedBannerData | null> {
  try {
    const { data } = await sanityFetch({ query: BANNER_QUERY });
    
    if (!data) {
      console.warn("No banner configuration found");
      return null;
    }

    const banner = data as BannerData;
    console.log("Banner data loaded:", {
      hasYouTubeVideoId: !!banner.youtubeVideoId,
      youtubeEnabled: banner.youtubeEnabled,
      youtubeChannelId: banner.youtubeChannelId,
      youtubeExpiryDate: banner.youtubeExpiryDate,
      hasCustomThumbnail: !!banner.youtubeThumbnail,
    });

    // Process banner expiry
    const bannerActivationDate = banner.bannerActivationDate 
      ? new Date(banner.bannerActivationDate) 
      : new Date(banner._createdAt);
    
    const bannerExpiryDate = banner.bannerExpiryDate 
      ? new Date(banner.bannerExpiryDate) 
      : calculateExpiryDate(bannerActivationDate, banner.bannerExpiryDays || 30);

    const bannerIsExpired = isExpired(bannerExpiryDate);
    const bannerIsActive = banner.isActive && !bannerIsExpired;

    // Process YouTube expiry
    const youtubeActivationDate = banner.youtubeActivationDate 
      ? new Date(banner.youtubeActivationDate) 
      : banner.youtubeVideoId 
        ? new Date() 
        : null;

    const youtubeExpiryDate = banner.youtubeExpiryDate 
      ? new Date(banner.youtubeExpiryDate) 
      : youtubeActivationDate 
        ? calculateExpiryDate(youtubeActivationDate, banner.youtubeExpiryDays || 7)
        : null;

    const youtubeIsExpired = youtubeExpiryDate ? isExpired(youtubeExpiryDate) : true;

    // Get YouTube video ID (either override or auto-fetch latest)
    let youtubeVideoId = banner.youtubeVideoId || null;

    if (!youtubeVideoId && banner.youtubeEnabled && banner.youtubeChannelId) {
      console.log("Auto-fetching latest YouTube video for channel:", banner.youtubeChannelId);
      try {
        youtubeVideoId = await getLatestYouTubeVideoDirect(banner.youtubeChannelId);
        console.log("Auto-fetched video ID:", youtubeVideoId);
      } catch (error) {
        console.error("Error auto-fetching YouTube video:", error);
        youtubeVideoId = null;
      }
    }

    // Use custom thumbnail if available, otherwise use YouTube thumbnail
    const youtubeThumbnail = banner.youtubeThumbnail || 
      (youtubeVideoId ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg` : undefined);

    const result = {
      banner: {
        image: bannerIsActive ? banner.desktopImage : banner.fallbackBanner,
        alt: bannerIsActive ? banner.desktopImageAlt : banner.fallbackBannerAlt,
        link: bannerIsActive ? banner.bannerLink : banner.fallbackBannerLink,
        isActive: bannerIsActive,
        isExpired: bannerIsExpired,
      },
      youtube: {
        enabled: banner.youtubeEnabled && !!youtubeVideoId,
        videoId: youtubeVideoId || undefined,
        thumbnail: youtubeThumbnail,
        thumbnailAlt: banner.youtubeThumbnailAlt || "YouTube Video",
        isExpired: youtubeIsExpired,
      },
      fallback: {
        image: banner.fallbackBanner,
        alt: banner.fallbackBannerAlt,
        link: banner.fallbackBannerLink,
      },
    };

    console.log("Final banner data:", {
      hasVideo: !!result.youtube.videoId,
      videoEnabled: result.youtube.enabled,
      hasThumbnail: !!result.youtube.thumbnail,
    });

    return result;
  } catch (error) {
    console.error("Error fetching banner data:", error);
    return null;
  }
}