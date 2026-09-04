// lib/youtube.ts
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
}

export async function getLatestYouTubeVideo(
  channelId: string,
  apiKey: string
): Promise<YouTubeVideo | null> {
  try {
    if (!apiKey || !channelId) {
      console.warn("YouTube API key or channel ID missing");
      return null;
    }

    // Fetch the latest video from the channel
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1&type=video`
    );

    if (!response.ok) {
      console.error("YouTube API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      console.warn("No videos found for channel:", channelId);
      return null;
    }

    const video = data.items[0];
    const videoId = video.id.videoId;

    // Get additional video details
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoId}&part=statistics,contentDetails`
    );

    if (!videoDetailsResponse.ok) {
      console.error("YouTube video details API error:", videoDetailsResponse.status);
      return {
        id: videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails.high.url,
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
      };
    }

    const videoDetails = await videoDetailsResponse.json();
    const details = videoDetails.items?.[0] || {};

    return {
      id: videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails.high.url,
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      ...details,
    };
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    return null;
  }
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1`;
}

export function getYouTubeThumbnail(videoId: string, quality: "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault" = "hqdefault"): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}