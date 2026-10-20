/**
 * Automated media fetcher for YouTube & Spotify
 * Fetches the latest published video from a YouTube channel RSS feed without requiring an API key.
 */
export async function fetchLatestYouTubeVideo(channelId?: string): Promise<{
  videoId: string;
  title: string;
} | null> {
  if (!channelId) return null;

  const CACHE_KEY = `yt_latest_${channelId}`;
  const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour cache

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
    }

    // Public RSS-to-JSON feed for YouTube channels
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
    );
    if (!res.ok) return null;

    const json = await res.json();
    if (json.status === 'ok' && json.items && json.items.length > 0) {
      const latest = json.items[0];
      const match =
        latest.link?.match(/v=([a-zA-Z0-9_-]+)/) ||
        latest.guid?.match(/yt:video:([a-zA-Z0-9_-]+)/);
      const videoId = match ? match[1] : null;

      if (videoId) {
        const result = {
          videoId,
          title: latest.title,
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
