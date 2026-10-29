/**
 * Vercel Serverless Function: /api/latest-video
 * Fetches the latest published video directly from Sadija's YouTube Atom RSS feed.
 * Edge-cached for 1 hour so YouTube is queried at most once per hour across all visitors.
 */

export default async function handler(req: any, res: any) {
  try {
    const channelId = 'UC7SXejrkmGcRqKjjaqYcWDw';
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; SadijaPortfolio/1.0; +https://sadija.info)',
        },
      }
    );

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch YouTube RSS feed' });
    }

    const xml = await response.text();
    const firstEntry = xml.split('<entry>')[1];
    if (!firstEntry) {
      return res.status(404).json({ error: 'No video entries found in channel feed' });
    }

    const videoId = firstEntry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const rawTitle = firstEntry.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const title = rawTitle
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    const publishedAt = firstEntry.match(/<published>([^<]+)<\/published>/)?.[1];
    const viewsMatch = firstEntry.match(/views="(\d+)"/);
    const views = viewsMatch ? parseInt(viewsMatch[1], 10) : undefined;

    if (!videoId) {
      return res.status(404).json({ error: 'Video ID not found in feed entry' });
    }

    // Edge cache on Vercel CDN for 1 hour, serve stale up to 1 day while revalidating
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json({ videoId, title, publishedAt, views });
  } catch (err: any) {
    return res.status(500).json({ error: 'Internal server error', message: err?.message });
  }
}
