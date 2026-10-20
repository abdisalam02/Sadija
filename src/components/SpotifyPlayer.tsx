import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  spotifyUrl: string;
}

export const SADIJA_PLAYLIST_TRACKS: PlaylistTrack[] = [
  {
    id: '3ibKnFDaa3GhpPGlOUj7ff',
    title: 'Let Me Love You',
    artist: 'Mario',
    artwork: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02c42212db6d665fab0c51d495',
    spotifyUrl: 'https://open.spotify.com/track/3ibKnFDaa3GhpPGlOUj7ff',
  },
  {
    id: '7H6ev70Weq6DdpZyyTmUXk',
    title: 'Say My Name',
    artist: "Destiny's Child",
    artwork: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e023718df75b57340c1947747e8',
    spotifyUrl: 'https://open.spotify.com/track/7H6ev70Weq6DdpZyyTmUXk',
  },
  {
    id: '34ceTg8ChN5HjrqiIYCn9Q',
    title: 'Miss Independent',
    artist: 'Ne-Yo',
    artwork: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025694163d7c4ab48251e9b57c',
    spotifyUrl: 'https://open.spotify.com/track/34ceTg8ChN5HjrqiIYCn9Q',
  },
  {
    id: '68vgtRHr7iZHpzGpon6Jlo',
    title: 'My Boo',
    artist: 'USHER, Alicia Keys',
    artwork: 'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02365b3fb800c19f7ff72602da',
    spotifyUrl: 'https://open.spotify.com/track/68vgtRHr7iZHpzGpon6Jlo',
  },
  {
    id: '0ARK753YaiJbpLUk7z5yIM',
    title: 'Dilemma',
    artist: 'Nelly, Kelly Rowland',
    artwork: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02a8b9f97b9ea065b9a857e93f',
    spotifyUrl: 'https://open.spotify.com/track/0ARK753YaiJbpLUk7z5yIM',
  },
  {
    id: '1KGi9sZVMeszgZOWivFpxs',
    title: 'No Scrubs',
    artist: 'TLC',
    artwork: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0261ffafd5e31a37336531cf95',
    spotifyUrl: 'https://open.spotify.com/track/1KGi9sZVMeszgZOWivFpxs',
  },
];

const SpotifyLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#1ed760]" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.527 17.308c-.218.358-.684.474-1.042.256-2.855-1.745-6.448-2.14-10.68-1.172-.408.093-.816-.164-.909-.572-.093-.408.164-.816.572-.909 4.636-1.06 8.608-.614 11.803 1.341.358.218.474.684.256 1.056zm1.474-3.275c-.274.446-.86.588-1.306.314-3.268-2.008-8.25-2.59-12.115-1.417-.497.151-1.026-.135-1.177-.632-.151-.497.135-1.026.632-1.177 4.417-1.34 9.907-.692 13.652 1.606.446.274.588.86.314 1.306zm.126-3.41c-3.918-2.327-10.375-2.541-14.11-1.407-.601.182-1.238-.163-1.42-.764-.182-.601.163-1.238.764-1.42 4.298-1.305 11.425-1.052 15.908 1.61.54.321.716 1.023.395 1.563-.321.54-1.023.716-1.537.418z" />
  </svg>
);

interface SpotifyPlayerProps {
  trackTitle?: string;
  artist?: string;
  embedUrl?: string;
  tracks?: PlaylistTrack[];
}

export const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({
  tracks = SADIJA_PLAYLIST_TRACKS,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = tracks[currentIndex] || tracks[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : tracks.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < tracks.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-[56%] min-w-[175px] max-w-[230px] sm:w-[48%] sm:max-w-[250px] lg:w-[250px] ml-auto mr-0 rounded-2xl glass-frosted p-2.5 sm:p-3 shadow-lg card-hover select-none transition-all">
      {/* 1. Album Artwork with Spotify Badge */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm bg-neutral-900/10 mb-2 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={current.artwork}
            alt={`${current.title} — ${current.artist}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>

        {/* Spotify Logo Pill Badge */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-1 shadow-sm">
          <SpotifyLogo />
          <span className="text-[9px] font-bold tracking-tight text-white uppercase font-syne">
            Spotify
          </span>
        </div>
      </div>

      {/* 2. Track & Artist Typography (Clean, compact) */}
      <div className="px-0.5 space-y-0.5 mb-2">
        <h4 className="font-syne font-bold text-xs sm:text-sm text-neutral-900 tracking-tight leading-snug truncate">
          {current.title}
        </h4>
        <p className="text-[11px] text-neutral-500 font-medium truncate">
          {current.artist}
        </p>
      </div>

      {/* 3. Sleek Interactive Action Row */}
      <div className="pt-1.5 border-t border-black/5 flex items-center justify-between gap-1">
        {/* Track browsing controls */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous track from playlist"
            className="w-6 h-6 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-neutral-700 hover:text-black transition-colors shadow-sm active:scale-90"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-[9px] font-mono font-bold text-neutral-400 px-0.5">
            0{currentIndex + 1}/0{tracks.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next track from playlist"
            className="w-6 h-6 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-neutral-700 hover:text-black transition-colors shadow-sm active:scale-90"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Direct Link to Track on Spotify */}
        <a
          href={current.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-950 hover:bg-black text-white text-[10px] font-syne font-bold shadow-sm transition-all active:scale-95"
        >
          <span>Open</span>
          <ArrowUpRight className="w-2.5 h-2.5 text-neutral-300" />
        </a>
      </div>
    </div>
  );
};
