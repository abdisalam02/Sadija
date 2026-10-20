import { ClientProfile } from '../types';

export const clientProfile: ClientProfile = {
  name: 'SADIJA GURE',
  handle: '@sadijagure',
  title: 'Fashion & Editorial Curator',
  bio: 'Exploring modest luxury silhouettes, neutral tailoring, and contemporary Scandinavian aesthetics.',
  location: 'Oslo, Norway',
  looks: [
    {
      id: 'look-1',
      title: 'Seated Linen Drape',
      imageSrc: './img/perfect1.png',
      tag: 'Linen Drape'
    },
    {
      id: 'look-2',
      title: 'Striped Silhouette',
      imageSrc: './img/perfect2.png',
      tag: 'Striped Shirt'
    },
    {
      id: 'look-3',
      title: 'Chambray Denim',
      imageSrc: './img/perfect3.png',
      tag: 'Denim Edition'
    },
    {
      id: 'look-4',
      title: 'Noir Trench & Optics',
      imageSrc: './img/perfect4.png',
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
  spotify: {
    trackTitle: 'Studio Rotation',
    artist: 'Curated by Sadija',
    embedUrl: 'https://open.spotify.com/embed/playlist/2T3BSpqN34Z4sppHDNWoeE?utm_source=generator&theme=0'
  },
  business: {
    email: 'collabs@sadijagure.com',
    inquiryNotice: 'Open for brand partnerships, styling editorials, and select gifting.',
    management: 'Select Management Oslo'
  }
};
