import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Youtube, ArrowUpRight, Volume2, VolumeX } from 'lucide-react';

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
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Toggle video audio via YouTube iframe postMessage API
  const handleToggleAudio = () => {
    if (!iframeRef.current?.contentWindow) return;

    if (isMuted) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
        '*'
      );
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
        '*'
      );
      setIsMuted(false);
    } else {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'mute', args: [] }),
        '*'
      );
      setIsMuted(true);
    }
  };

  return (
    <>
      <motion.div
        onViewportEnter={() => setIsInView(true)}
        onViewportLeave={() => setIsInView(false)}
        viewport={{ margin: '-10% 0px -10% 0px' }}
        className="rounded-3xl glass-frosted p-5 sm:p-7 card-hover shadow-lg"
      >
        {/* Minimal Header: YouTube Logo + Text Only */}
        <div className="flex items-center justify-between pb-3.5 border-b border-black/5 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm">
              <Youtube className="w-4 h-4 fill-current" />
            </div>
            <span className="font-syne font-bold text-xs uppercase tracking-wider text-neutral-900">
              YouTube
            </span>
          </div>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch on YouTube"
            className="w-7 h-7 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-neutral-600 hover:text-black transition-colors shadow-sm"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 16:9 Viewport with Auto-Play Enabled (Muted on load for instant playback) */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/10 shadow-inner">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&controls=1&rel=0&modestbranding=1`}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Title (Clean, unburdened by extra essay description) */}
        <h3 className="font-syne font-bold text-sm sm:text-base tracking-tight text-neutral-900 leading-snug mt-3">
          {title}
        </h3>
      </motion.div>

      {/* Floating Audio Pop-Up at Bottom Right When Watching Video */}
      {isInView && (
        <div className="fixed bottom-5 right-4 z-50 pointer-events-auto">
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isMuted ? 'Turn video audio on' : 'Mute video audio'}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-neutral-950/95 text-white text-xs font-medium shadow-2xl backdrop-blur-md border border-white/20 active:scale-95 transition-all hover:bg-black"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-syne font-bold text-[11px] tracking-tight">Turn Audio On</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-syne font-bold text-[11px] tracking-tight text-emerald-300">Audio Playing</span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
};
