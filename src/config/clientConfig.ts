import { ClientProfile } from '../types';

export const clientProfile: ClientProfile = {
  name: 'SADIJA',
  handle: '@sadijagure',
  title: '',
  bio: 'Exploring modest luxury silhouettes, neutral tailoring, and contemporary Scandinavian aesthetics.',
  location: 'Oslo, Norway',
  looks: [
    {
      id: 'look-1',
      title: 'Seated Linen Drape',
      imageSrc: './img/look-1-linen.webp',
      tag: 'Linen Drape'
    },
    {
      id: 'look-2',
      title: 'Chambray Denim',
      imageSrc: './img/look-2-denim.webp',
      tag: 'Denim Edition'
    },
    {
      id: 'look-3',
      title: 'Noir Trench & Optics',
      imageSrc: './img/look-3-trench-v3.webp',
      tag: 'Noir Trench'
    }
  ],
  socials: [
    {
      id: 'instagram',
      platform: 'instagram',
      label: 'Instagram',
      handle: '@sadijagure',
      url: 'https://instagram.com/sadijagure',
      followers: 'Daily Looks & Archive'
    },
    {
      id: 'tiktok',
      platform: 'tiktok',
      label: 'TikTok',
      handle: '@sadija.g',
      url: 'https://www.tiktok.com/@sadija.g',
      followers: 'Styling & GRWM'
    },
    {
      id: 'youtube',
      platform: 'youtube',
      label: 'YouTube',
      handle: '@sadija.a',
      url: 'https://www.youtube.com/@sadija.a',
      followers: 'Video Essays & Commentary'
    }
  ],
  youtube: {
    title: "Gilmore Girl's beef with Asians had to be personal",
    description: 'Latest video essay exploring online culture, media narratives, and social commentary by Sadija.',
    videoId: 'WKYoPkt_LHQ',
    channelId: 'UC7SXejrkmGcRqKjjaqYcWDw',
    // Fallback static metadata. /api/latest-video dynamically updates videoId, title,
    // and publication date on both Vercel and local dev.
    channelName: 'sadija.',
    channelAvatar: './img/yt-avatar.jpg',
    views: 6250,
    publishedAt: '2026-10-25T23:19:34+00:00',
    durationSeconds: 948
  },
  podcast: {
    showTitle: "sadija.s podcast",
    showUrl: 'https://open.spotify.com/show/1AKPeARcw0ehY0NkFzJnLq',
    coverArt: './img/podcast_cover.jpg',
    episodes: [
      {
        id: '5kxrDLsr8YOqijZqgCfbcA',
        title: 'Am I The A**Hole? Reddits craziest confessions',
        show: 'sadija.s podcast',
        date: 'Feb 20, 2026',
        duration: '23 min',
        artwork: './img/podcast_cover.jpg',
        spotifyUrl: 'https://open.spotify.com/episode/5kxrDLsr8YOqijZqgCfbcA',
        previewUrl: './audio/podcast_preview.mp3',
      },
      {
        id: '1VTWPaNkeTVv3NmhvgFWut',
        title: 'introverts are more annoying than extroverts..',
        show: 'sadija.s podcast',
        date: 'Dec 16, 2025',
        duration: '36 min',
        artwork: './img/podcast_cover.jpg',
        spotifyUrl: 'https://open.spotify.com/episode/1VTWPaNkeTVv3NmhvgFWut',
        previewUrl: './audio/episode2_preview.mp3',
      },
    ],
  },
  business: {
    email: 'sadijagure@gmail.com',
    inquiryNotice: 'Open for brand partnerships, styling editorials, and select gifting.',
    management: 'Select Management Oslo'
  }
};
