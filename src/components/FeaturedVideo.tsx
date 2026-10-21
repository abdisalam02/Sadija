import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Volume2, VolumeX, Play } from 'lucide-react';
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

  // Ask the player to report state changes so taps inside the video keep the UI in sync
  const handleIframeLoad = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
      '*'
    );
  };

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
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
              <path d="M9.5 7.2v9.6a.5.5 0 0 0 .76.43l7.9-4.8a.5.5 0 0 0 0-.86l-7.9-4.8a.5.5 0 0 0-.76.43z" />
            </svg>
          </div>
          <span className="font-syne font-bold text-xs uppercase tracking-wider text-neutral-900">
            YouTube
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Icon-only mute / unmute toggle */}
          <button
            type="button"
            onClick={toggleYouTubeAudio}
            aria-label={isYouTubeMuted ? 'Unmute video' : 'Mute video'}
            className="w-8 h-8 rounded-full bg-neutral-950 hover:bg-black text-white flex items-center justify-center shadow-sm transition-all active:scale-90"
          >
            {isYouTubeMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch on YouTube"
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-neutral-600 hover:text-black transition-colors shadow-sm"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 16:9 Viewport: iframe ignores pointer input, the overlay button makes a tap play or pause */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/10 shadow-inner">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&modestbranding=1`}
          title={title}
          onLoad={handleIframeLoad}
          className="w-full h-full border-0 pointer-events-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
        <button
          type="button"
          onClick={toggleYouTubePlay}
          aria-label={isYouTubePlaying ? 'Pause video' : 'Play video'}
          className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
        >
          {!isYouTubePlaying && (
            <span className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </span>
          )}
        </button>
      </div>

      {/* Video Title */}
      <h3 className="font-syne font-bold text-sm sm:text-base tracking-tight text-neutral-900 leading-snug mt-3">
        {title}
      </h3>
    </motion.div>
  );
};
