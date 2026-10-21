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
      imageSrc: './img/2-removebg-preview.webp',
      tag: 'Linen Drape'
    },
    {
      id: 'look-2',
      title: 'Chambray Denim',
      imageSrc: './img/IMG_5196-removebg-preview.webp',
      tag: 'Denim Edition'
    },
    {
      id: 'look-3',
      title: 'Noir Trench & Optics',
      imageSrc: './img/1-removebg-preview.webp',
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
      handle: '@sadijagure',
      url: 'https://tiktok.com/@sadijagure',
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
    title: "Men Don't Hate Influencers. They Hate Women",
    description: 'Latest video essay exploring online culture, media narratives, and social commentary by Sadija.',
    videoId: 'veNlnoJv_jI',
    channelId: 'UC7SXejrkmGcRqKjjaqYcWDw'
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
