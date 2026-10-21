import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useMedia } from '../context/MediaContext';

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#1ed760]" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.527 17.308c-.218.358-.684.474-1.042.256-2.855-1.745-6.448-2.14-10.68-1.172-.408.093-.816-.164-.909-.572-.093-.408.164-.816.572-.909 4.636-1.06 8.608-.614 11.803 1.341.358.218.474.684.256 1.056zm1.474-3.275c-.274.446-.86.588-1.306.314-3.268-2.008-8.25-2.59-12.115-1.417-.497.151-1.026-.135-1.177-.632-.151-.497.135-1.026.632-1.177 4.417-1.34 9.907-.692 13.652 1.606.446.274.588.86.314 1.306zm.126-3.41c-3.918-2.327-10.375-2.541-14.11-1.407-.601.182-1.238-.163-1.42-.764-.182-.601.163-1.238.764-1.42 4.298-1.305 11.425-1.052 15.908 1.61.54.321.716 1.023.395 1.563-.321.54-1.023.716-1.537.418z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-red-500" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const FloatingPlayer: React.FC = () => {
  const {
    activeSource,
    spotifyEpisode,
    isSpotifyPlaying,
    toggleSpotify,
    youtubeTitle,
    isYouTubePlaying,
    isYouTubeMuted,
    toggleYouTubePlay,
    toggleYouTubeAudio,
  } = useMedia();

  // Show if either Spotify is playing/loaded or YouTube is unmuted/in view
  const shouldShow = activeSource !== 'none';

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto select-none"
        >
          <div className="flex items-center gap-3 pl-3.5 pr-2 py-2 rounded-full bg-neutral-950/90 backdrop-blur-xl border border-white/20 text-white shadow-2xl">
            {activeSource === 'spotify' ? (
              <>
                {/* Spotify Brand & Visualizer */}
                <div className="w-7 h-7 rounded-full bg-[#1ed760]/20 flex items-center justify-center flex-shrink-0">
                  <SpotifyIcon />
                </div>

                {/* Track Info */}
                <div className="max-w-[130px] sm:max-w-[180px] min-w-0 pr-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider font-semibold text-[#1ed760] block truncate">
                    Spotify Podcast
                  </span>
                  <span className="text-[11px] font-syne font-bold text-white truncate block">
                    {spotifyEpisode?.title || 'sadija.s podcast'}
                  </span>
                </div>

                {/* Pause / Play Button */}
                <button
                  type="button"
                  onClick={toggleSpotify}
                  aria-label={isSpotifyPlaying ? 'Pause Spotify' : 'Play Spotify'}
                  className="w-8 h-8 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 flex items-center justify-center transition-all active:scale-90 shadow-sm flex-shrink-0"
                >
                  {isSpotifyPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>
              </>
            ) : (
              <>
                {/* YouTube Brand Icon */}
                <div className="w-7 h-7 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                  <YouTubeIcon />
                </div>

                {/* Video Info */}
                <div className="max-w-[130px] sm:max-w-[180px] min-w-0 pr-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider font-semibold text-red-400 block truncate">
                    YouTube Video
                  </span>
                  <span className="text-[11px] font-syne font-bold text-white truncate block">
                    {youtubeTitle}
                  </span>
                </div>

                {/* Video Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={toggleYouTubePlay}
                  aria-label={isYouTubePlaying ? 'Pause YouTube Video' : 'Play YouTube Video'}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 flex-shrink-0"
                >
                  {isYouTubePlaying ? (
                    <Pause className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  )}
                </button>

                {/* Audio Mute / Unmute Button */}
                <button
                  type="button"
                  onClick={toggleYouTubeAudio}
                  aria-label={isYouTubeMuted ? 'Turn Audio On' : 'Mute Audio'}
                  className="w-8 h-8 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 flex items-center justify-center transition-all active:scale-90 shadow-sm flex-shrink-0"
                >
                  {isYouTubeMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-neutral-900" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-neutral-900" />
                  )}
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
