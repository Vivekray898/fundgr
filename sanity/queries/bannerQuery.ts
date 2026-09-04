// sanity/queries/bannerQuery.ts
import { defineQuery } from "next-sanity";

// Get active banner configuration
export const BANNER_QUERY = defineQuery(`
  *[_type == 'banner' && isActive == true] | order(_createdAt desc) [0] {
    _id,
    title,
    isActive,
    "desktopImage": desktopImage.asset->url,
    "mobileImage": mobileImage.asset->url,
    "desktopImageAlt": desktopImage.alt,
    "mobileImageAlt": mobileImage.alt,
    bannerLink,
    bannerExpiryDays,
    bannerActivationDate,
    bannerExpiryDate,
    youtubeEnabled,
    youtubeChannelId,
    youtubeVideoId,
    youtubeExpiryDays,
    youtubeActivationDate,
    youtubeExpiryDate,
    "fallbackBanner": fallbackBanner.asset->url,
    "fallbackBannerAlt": fallbackBanner.alt,
    fallbackBannerLink,
    _createdAt,
    _updatedAt
  }
`);

// Get specific banner by ID (for admin updates)
export const BANNER_BY_ID_QUERY = defineQuery(`
  *[_type == 'banner' && _id == $id][0] {
    _id,
    title,
    isActive,
    "desktopImage": desktopImage.asset->url,
    "mobileImage": mobileImage.asset->url,
    "desktopImageAlt": desktopImage.alt,
    "mobileImageAlt": mobileImage.alt,
    bannerLink,
    bannerExpiryDays,
    bannerActivationDate,
    bannerExpiryDate,
    youtubeEnabled,
    youtubeChannelId,
    youtubeVideoId,
    youtubeExpiryDays,
    youtubeActivationDate,
    youtubeExpiryDate,
    "fallbackBanner": fallbackBanner.asset->url,
    "fallbackBannerAlt": fallbackBanner.alt,
    fallbackBannerLink,
    _createdAt,
    _updatedAt
  }
`);

// Update banner activation dates (for admin use)
export const UPDATE_BANNER_ACTIVATION_QUERY = defineQuery(`
  *[_type == 'banner' && _id == $id][0] {
    _id,
    bannerActivationDate,
    bannerExpiryDate,
    youtubeActivationDate,
    youtubeExpiryDate
  }
`);