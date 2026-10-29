import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Local development middleware for /api/latest-video.
 * Emulates the Vercel serverless function during `npm run dev`.
 */
function devLatestVideoPlugin(): Plugin {
  return {
    name: 'dev-latest-video-endpoint',
    configureServer(server) {
      server.middlewares.use('/api/latest-video', async (_req, res) => {
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
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to fetch YouTube feed' }));
            return;
          }
          const xml = await response.text();
          const firstEntry = xml.split('<entry>')[1];
          if (!firstEntry) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'No video entries found' }));
            return;
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

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ videoId, title, publishedAt, views }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Server error' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devLatestVideoPlugin()],
  base: './',
});
