// lib/youtube.ts
// Client-safe YouTube utilities - can be used in both server and client

export function getYouTubeEmbedUrl(videoId: string): string {
  // Show controls with modest branding
  // controls=1: Show player controls (play, pause, volume, etc.)
  // rel=0: Limit related videos to same channel
  // modestbranding=1: Minimal YouTube branding
  // playsinline=1: Inline playback on mobile
  // enablejsapi=1: Enable JavaScript API for control
  // iv_load_policy=3: No video annotations
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1`;
}

export function getYouTubeThumbnail(videoId: string, quality: "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault" = "hqdefault"): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
}