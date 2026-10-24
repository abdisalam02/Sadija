import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Play,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useMedia } from '../context/MediaContext';

/* ── YouTube-style number formatting ────────────────────────────────────── */

const trimZero = (value: number) => value.toFixed(1).replace(/\.0$/, '');

/** 9072 → "9.1K views" (how YouTube renders it on browse cards). */
export const formatViews = (views: number) => {
  if (views < 1000) return `${views} view${views === 1 ? '' : 's'}`;
  if (views < 1_000_000) return `${trimZero(views / 1000)}K views`;
  return `${trimZero(views / 1_000_000)}M views`;
};

/** 903 → "15:03". */
export const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
};

/**
 * "6 days ago" — computed from the real publish date, so the card keeps
 * telling the truth as time passes instead of freezing at whatever it said
 * on the day it was written.
 */
export const timeAgo = (iso: string) => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Math.max(0, Date.now() - then);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${Math.round(diff / 86_400_000)} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
};

/* ── Small YouTube marks ────────────────────────────────────────────────── */

/** YouTube's verified channel badge (four-point star with a tick). */
const VerifiedBadge: React.FC = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-[#606060]" aria-label="Verified">
    <path
      fill="currentColor"
      d="M12 1.9l2.5 1.8 3-.3 1.2 2.8 2.6 1.6-.7 3 .7 3-2.6 1.6-1.2 2.8-3-.3L12 22.1l-2.5-1.8-3 .3-1.2-2.8L2.7 16.2l.7-3-.7-3 2.6-1.6 1.2-2.8 3 .3L12 1.9z"
    />
    <path
      fill="#fcfbf8"
      d="M10.7 15.4l-3-3 1.3-1.3 1.7 1.7 4.2-4.2 1.3 1.3-5.5 5.5z"
    />
  </svg>
);

const YouTubeGlyph: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#FF0000"
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    />
  </svg>
);

/* ── The card ───────────────────────────────────────────────────────────── */

export interface FeaturedVideoProps {
  title: string;
  videoId: string;
  youtubeUrl: string;
  channelName?: string;
  channelAvatar?: string;
  views?: number;
  likes?: number;
  /** ISO timestamp of the upload. Drives the "x ago" line. */
  publishedAt?: string;
  durationSeconds?: number;
  /**
   * `card` keeps the site's frosted card around the video.
   * `bare` drops the card entirely and lets the video sit on the page,
   * the way a real YouTube embed does.
   */
  variant?: 'card' | 'bare';
  /** Lab only: render the real YouTube poster instead of the live iframe. */
  poster?: boolean;
}

export const FeaturedVideo: React.FC<FeaturedVideoProps> = ({
  title,
  videoId,
  youtubeUrl,
  channelName = 'sadija.',
  channelAvatar = './img/yt-avatar.jpg',
  views,
  likes,
  publishedAt,
  durationSeconds,
  variant = 'card',
  poster = false,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [copied, setCopied] = useState(false);
  const [posterSrc, setPosterSrc] = useState(
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
  );

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
    if (poster) return;
    registerYouTubeIframe(iframeRef.current);
    setYouTubeTitle(title);
  }, [title, poster]);

  // Ask the player to report state changes so taps inside the video keep the UI in sync
  const handleIframeLoad = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
      '*'
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: youtubeUrl });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(youtubeUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the link is still in the pill */
    }
  };

  const viewsText = typeof views === 'number' ? formatViews(views) : null;
  const publishedText = publishedAt ? timeAgo(publishedAt) : null;
  const duration = typeof durationSeconds === 'number' ? formatDuration(durationSeconds) : null;
  const showDuration = duration && (poster || !isYouTubePlaying);

  return (
    <motion.div
      onViewportEnter={() => setIsYouTubeInView(true)}
      onViewportLeave={() => setIsYouTubeInView(false)}
      viewport={{ margin: '-10% 0px -10% 0px' }}
      className={
        variant === 'card'
          ? 'rounded-3xl lg:rounded-[2rem] glass-frosted p-3.5 sm:p-4 card-hover shadow-lg select-none'
          : 'select-none'
      }
      // YouTube's own UI font: Roboto where it exists, Arial everywhere else.
      style={{ fontFamily: "Roboto, 'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* Player. 16:9, 12px radius — YouTube's player geometry. */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        {poster ? (
          <img
            src={posterSrc}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setPosterSrc(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)}
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&modestbranding=1`}
            title={title}
            onLoad={handleIframeLoad}
            className="h-full w-full border-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        )}

        {/* Length badge, bottom-right, exactly where YouTube puts it. */}
        {showDuration && (
          <span className="pointer-events-none absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[11px] font-medium leading-[1.35] tabular-nums text-white">
            {duration}
          </span>
        )}

        {!poster && (
          <>
            <button
              type="button"
              onClick={toggleYouTubeAudio}
              aria-label={isYouTubeMuted ? 'Unmute video' : 'Mute video'}
              className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 active:scale-90"
            >
              {isYouTubeMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            {/* The video is the play button: YouTube chrome is hidden, so the
                whole surface toggles playback. */}
            <button
              type="button"
              onClick={toggleYouTubePlay}
              aria-label={isYouTubePlaying ? 'Pause video' : 'Play video'}
              className="absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center"
            >
              {!isYouTubePlaying && (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                  <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {/* Metadata block — avatar, title, channel, views, age. */}
      <div className="mt-3 flex items-start gap-3">
        <img
          src={channelAvatar}
          alt={`${channelName} channel avatar`}
          className="mt-0.5 h-9 w-9 shrink-0 rounded-full object-cover"
          loading="lazy"
        />

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-[1.35] text-[#0f0f0f]">
            {title}
          </h3>

          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0 text-[12.5px] leading-5 text-[#606060]">
            <span className="flex items-center gap-1">
              <span className="font-medium text-[#0f0f0f]">{channelName}</span>
              <VerifiedBadge />
            </span>
            {viewsText && <span aria-hidden="true">·</span>}
            {viewsText && <span>{viewsText}</span>}
            {publishedText && <span aria-hidden="true">·</span>}
            {publishedText && <span>{publishedText}</span>}
          </p>
        </div>
      </div>

      {/* Action pills — YouTube's light-theme chip row. On narrow screens it
          scrolls sideways instead of wrapping, like the real thing. */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex h-9 shrink-0 items-center overflow-hidden rounded-full bg-[#f2f2f2]">
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Like this video on YouTube"
            className="flex h-full items-center gap-1.5 px-3.5 text-[13px] font-medium text-[#0f0f0f] transition-colors hover:bg-[#e5e5e5]"
          >
            <ThumbsUp className="h-4 w-4" />
            {typeof likes === 'number' ? likes : 'Like'}
          </a>
          <span className="h-6 w-px bg-black/10" aria-hidden="true" />
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the video on YouTube to rate it"
            className="flex h-full items-center px-3 text-[#0f0f0f] transition-colors hover:bg-[#e5e5e5]"
          >
            <ThumbsDown className="h-4 w-4" />
          </a>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#f2f2f2] px-3.5 text-[13px] font-medium text-[#0f0f0f] transition-colors hover:bg-[#e5e5e5]"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
          {copied ? 'Copied' : 'Share'}
        </button>

        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch on YouTube"
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#f2f2f2] px-3 text-[13px] font-medium text-[#0f0f0f] transition-colors hover:bg-[#e5e5e5] sm:px-3.5"
        >
          <YouTubeGlyph className="h-4 w-4" />
          {/* YouTube's own mobile row is icon-only, so the label drops below sm
              and the whole row fits without scrolling. */}
          <span className="hidden sm:inline">Watch on YouTube</span>
        </a>
      </div>
    </motion.div>
  );
};
