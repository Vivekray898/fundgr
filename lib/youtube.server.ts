// lib/youtube.server.ts
import "server-only";
import { YouTubeVideo } from "./youtube";

export async function getLatestYouTubeVideo(
  channelHandle: string,
  apiKey: string
): Promise<YouTubeVideo | null> {
  try {
    if (!apiKey || !channelHandle) {
      console.warn("YouTube API key or channel ID missing");
      return null;
    }

    // Clean the channel handle
    const cleanHandle = channelHandle.replace("@", "").trim();
    
    // Step 1: Get channel ID from handle
    const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelUrl.searchParams.set("key", apiKey);
    channelUrl.searchParams.set("part", "id");
    channelUrl.searchParams.set("forHandle", cleanHandle);

    console.log("Fetching channel with handle:", cleanHandle);
    
    const channelResponse = await fetch(channelUrl.toString(), { 
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    
    if (!channelResponse.ok) {
      console.error("Channel API error:", await channelResponse.text());
      return null;
    }

    const channelData = await channelResponse.json();
    const channelId = channelData?.items?.[0]?.id;

    if (!channelId) {
      console.error("Channel not found for handle:", cleanHandle);
      return null;
    }

    console.log("Found channel ID:", channelId);

    // Step 2: Get latest video from channel
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("key", apiKey);
    searchUrl.searchParams.set("channelId", channelId);
    searchUrl.searchParams.set("part", "snippet,id");
    searchUrl.searchParams.set("order", "date");
    searchUrl.searchParams.set("maxResults", "1");
    searchUrl.searchParams.set("type", "video");

    const searchResponse = await fetch(searchUrl.toString(), { 
      next: { revalidate: 60 } // Refresh every minute
    });
    
    if (!searchResponse.ok) {
      console.error("Search API error:", await searchResponse.text());
      return null;
    }

    const searchData = await searchResponse.json();
    const video = searchData?.items?.[0];

    if (!video) {
      console.warn("No videos found for channel");
      return null;
    }

    const videoId = video.id.videoId;
    console.log("Found video ID:", videoId);

    // Step 3: Get video details
    const videoUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videoUrl.searchParams.set("key", apiKey);
    videoUrl.searchParams.set("id", videoId);
    videoUrl.searchParams.set("part", "snippet,statistics,contentDetails");

    const videoResponse = await fetch(videoUrl.toString(), { 
      next: { revalidate: 60 } 
    });
    
    if (!videoResponse.ok) {
      console.error("Video details API error:", await videoResponse.text());
      return {
        id: videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || "",
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
      };
    }

    const videoData = await videoResponse.json();
    const videoDetails = videoData?.items?.[0] || {};

    return {
      id: videoId,
      title: video.snippet.title,
      description: video.snippet.description || videoDetails.snippet?.description || "",
      publishedAt: video.snippet.publishedAt,
      thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || "",
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
    };
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    return null;
  }
}

// Simplified direct fetch for banner
export async function getLatestYouTubeVideoDirect(channelHandle: string): Promise<string | null> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn("YOUTUBE_API_KEY not set");
      return null;
    }

    const video = await getLatestYouTubeVideo(channelHandle, apiKey);
    return video?.id || null;
  } catch (error) {
    console.error("Error in getLatestYouTubeVideoDirect:", error);
    return null;
  }
}