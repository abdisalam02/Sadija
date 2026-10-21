import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, ArrowUpRight, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useMedia } from '../context/MediaContext';

interface FeaturedVideoProps {
  title: string;
  description?: string;
  videoId: string;
  youtubeUrl: string;
}

export const FeaturedVideo: React.FC<FeaturedVideoProps> = ({
  title,
  videoId,
  youtubeUrl,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const {
    isYouTubeMuted,
    isYouTubePlaying,
    toggleYouTubeAudio,
    toggleYouTubePlay,
    registerYouTubeIframe,
    setIsYouTubeInView,
    setYouTubeTitle,
  } = useMedia();

  useEffect(() => {
    registerYouTubeIframe(iframeRef.current);
    setYouTubeTitle(title);
  }, [title]);

  return (
    <motion.div
      onViewportEnter={() => setIsYouTubeInView(true)}
      onViewportLeave={() => setIsYouTubeInView(false)}
      viewport={{ margin: '-10% 0px -10% 0px' }}
      className="rounded-3xl glass-frosted p-5 sm:p-7 card-hover shadow-lg select-none"
    >
      {/* Header: YouTube Logo + Direct Controls + External Link */}
      <div className="flex items-center justify-between pb-3.5 border-b border-black/5 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm">
            <Youtube className="w-4 h-4 fill-current" />
          </div>
          <span className="font-syne font-bold text-xs uppercase tracking-wider text-neutral-900">
            YouTube
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Play/Pause Button */}
          <button
            type="button"
            onClick={toggleYouTubePlay}
            aria-label={isYouTubePlaying ? 'Pause video' : 'Play video'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-neutral-800 text-[11px] font-syne font-semibold transition-all active:scale-95"
          >
            {isYouTubePlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current ml-0.5" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Quick Audio Toggle Button */}
          <button
            type="button"
            onClick={toggleYouTubeAudio}
            aria-label={isYouTubeMuted ? 'Turn audio on' : 'Mute audio'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-neutral-800 text-[11px] font-syne font-semibold transition-all active:scale-95"
          >
            {isYouTubeMuted ? (
              <>
                <VolumeX className="w-3 h-3 text-amber-600" />
                <span>Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3 h-3 text-emerald-600" />
                <span>Mute</span>
              </>
            )}
          </button>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch on YouTube"
            className="w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-neutral-600 hover:text-black transition-colors shadow-sm ml-1"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 16:9 Viewport with Auto-Play Enabled & Native Controls */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/10 shadow-inner pointer-events-auto">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&controls=1&rel=0&modestbranding=1`}
          title={title}
          className="w-full h-full border-0 pointer-events-auto"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Video Title */}
      <h3 className="font-syne font-bold text-sm sm:text-base tracking-tight text-neutral-900 leading-snug mt-3">
        {title}
      </h3>
    </motion.div>
  );
};
