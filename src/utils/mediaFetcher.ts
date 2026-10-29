/**
 * Automated media fetcher for YouTube & Spotify
 * Fetches the latest published video via the edge /api/latest-video endpoint.
 */

export interface LatestYouTubeVideo {
  videoId: string;
  title: string;
  publishedAt?: string;
  views?: number;
}

export async function fetchLatestYouTubeVideo(
  channelId?: string
): Promise<LatestYouTubeVideo | null> {
  if (!channelId) return null;

  const CACHE_KEY = `yt_latest_${channelId}`;
  const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour client cache

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY && data?.videoId) {
        return data;
      }
    }

    // Call the edge/serverless route (supported on Vercel and local Vite dev server)
    const res = await fetch('/api/latest-video');
    if (res.ok) {
      const json = await res.json();
      if (json.videoId && json.title) {
        const result: LatestYouTubeVideo = {
          videoId: json.videoId,
          title: json.title,
          publishedAt: json.publishedAt,
          views: json.views,
        };
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: result })
        );
        return result;
      }
    }
  } catch {
    // Graceful fallback to static config on network error
  }

  return null;
}
