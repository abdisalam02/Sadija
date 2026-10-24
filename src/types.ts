export type HeroTextStyle = 'crisp-white' | 'frosted-capsule' | 'ambient-scrim' | 'charcoal-classic';
export type TransitionEffect = 'smooth-melt' | 'slow-dissolve' | 'parallax-drift' | 'editorial-snap';

export interface StudioSettings {
  textStyle: HeroTextStyle;
  transitionEffect: TransitionEffect;
}

export interface StageTransform {
  scale: number;
  x: number | string;
  y: number | string;
}

export interface CreatorLook {
  id: string;
  title: string;
  imageSrc: string; // perfect1 - perfect4
  tag: string;
}

export interface SocialLink {
  id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'email';
  label: string;
  handle: string;
  url: string;
  followers?: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  show: string;
  date: string;
  duration: string;
  artwork: string;
  spotifyUrl: string;
  previewUrl?: string;
}

export interface ClientProfile {
  name: string;
  handle: string;
  title: string;
  bio: string;
  location: string;
  looks: CreatorLook[];
  socials: SocialLink[];
  youtube: {
    title: string;
    description: string;
    videoId: string;
    channelId?: string;
    channelName?: string;
    channelAvatar?: string;
    views?: number;
    /** ISO upload timestamp — the card renders "x days ago" from this. */
    publishedAt?: string;
    durationSeconds?: number;
  };
  spotify?: {
    trackTitle: string;
    artist: string;
    embedUrl: string;
  };
  podcast?: {
    showTitle: string;
    showUrl: string;
    coverArt?: string;
    episodes: PodcastEpisode[];
  };
  business: {
    email: string;
    inquiryNotice: string;
    management: string;
  };
}
