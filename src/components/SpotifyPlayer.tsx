import React from 'react';
import { Play, Pause, ArrowUpRight, Volume2 } from 'lucide-react';
import { clientProfile } from '../config/clientConfig';
import { useMedia } from '../context/MediaContext';

const SpotifyLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#1ed760]" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.527 17.308c-.218.358-.684.474-1.042.256-2.855-1.745-6.448-2.14-10.68-1.172-.408.093-.816-.164-.909-.572-.093-.408.164-.816.572-.909 4.636-1.06 8.608-.614 11.803 1.341.358.218.474.684.256 1.056zm1.474-3.275c-.274.446-.86.588-1.306.314-3.268-2.008-8.25-2.59-12.115-1.417-.497.151-1.026-.135-1.177-.632-.151-.497.135-1.026.632-1.177 4.417-1.34 9.907-.692 13.652 1.606.446.274.588.86.314 1.306zm.126-3.41c-3.918-2.327-10.375-2.541-14.11-1.407-.601.182-1.238-.163-1.42-.764-.182-.601.163-1.238.764-1.42 4.298-1.305 11.425-1.052 15.908 1.61.54.321.716 1.023.395 1.563-.321.54-1.023.716-1.537.418z" />
  </svg>
);

export const SpotifyPlayer: React.FC = () => {
  const podcast = clientProfile.podcast;
  const episodes = podcast?.episodes || [];
  const { spotifyEpisode, isSpotifyPlaying, playSpotifyEpisode } = useMedia();

  return (
    <div className="w-[72%] min-w-[240px] max-w-[320px] sm:w-[60%] sm:max-w-[330px] lg:w-[320px] ml-auto mr-0 rounded-3xl glass-frosted p-3.5 sm:p-4 shadow-lg card-hover select-none transition-all">
      {/* 1. Show Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-black/5">
        <div className="flex items-center gap-2 min-w-0">
          <SpotifyLogo />
          <span className="font-syne font-bold text-xs sm:text-sm text-neutral-900 tracking-tight truncate">
            {podcast?.showTitle || 'sadija.s podcast'}
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-neutral-400 flex-shrink-0">
          Podcast
        </span>
      </div>

      {/* 2. Scrollable Episodes Stream */}
      <div className="space-y-2.5">
        {episodes.map((ep) => {
          const isPlaying = isSpotifyPlaying && spotifyEpisode?.id === ep.id;
          return (
            <div
              key={ep.id}
              onClick={() => ep.previewUrl && playSpotifyEpisode(ep)}
              className={`p-2.5 rounded-2xl transition-all flex items-start gap-3 group cursor-pointer ${
                isPlaying
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'bg-white/60 hover:bg-white/90 text-neutral-900'
              }`}
            >
              {/* Artwork with Play/Pause Indicator */}
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-900/10 shadow-xs">
                <img
                  src={ep.artwork}
                  alt={ep.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all ${
                    isPlaying
                      ? 'bg-black/50 opacity-100'
                      : 'bg-black/30 opacity-70 group-hover:opacity-100'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-[#1ed760] fill-[#1ed760]" />
                  ) : (
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  )}
                </div>
              </div>

              {/* Title, Duration & Live Playing Wave */}
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center gap-1 mb-1">
                  <h5
                    className={`font-syne font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 ${
                      isPlaying ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {ep.title}
                  </h5>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                  <span
                    className={`font-medium ${
                      isPlaying ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {ep.duration}
                  </span>
                  <span className={isPlaying ? 'text-neutral-500' : 'text-neutral-300'}>•</span>
                  <span
                    className={`font-medium ${
                      isPlaying ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {ep.date}
                  </span>
                  {isPlaying && (
                    <span className="flex items-center gap-0.5 ml-auto text-[#1ed760]">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Direct Show Link to Spotify */}
      <div className="pt-3 mt-2.5 border-t border-black/5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-neutral-500 font-syne">
          Stream on Spotify
        </span>
        <a
          href={podcast?.showUrl || 'https://open.spotify.com/show/1AKPeARcw0ehY0NkFzJnLq'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950 hover:bg-black text-white text-[10px] font-syne font-bold shadow-xs transition-all active:scale-95"
        >
          <span>Open</span>
          <ArrowUpRight className="w-3 h-3 text-neutral-300" />
        </a>
      </div>
    </div>
  );
};
