import React, { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { Instagram, Youtube, Mail, ArrowUpRight, Check } from 'lucide-react';
import { SocialLink } from '../types';

interface HeaderProps {
  name: string;
  socials: SocialLink[];
  /** 0 = folded against the top edge, 1 = hanging in its resting place. */
  navProgress: MotionValue<number>;
  scrollY: MotionValue<number>;
  nameDocked: boolean;
  /** Scroll distance the wordmark travels before it lands in the nav. */
  dockDistance: number;
  socialRanges: Array<{ start: number; end: number }>;
}

// Custom crisp TikTok SVG
const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.887 2.887 2.897 2.897 0 0 1-2.888-2.887 2.896 2.896 0 0 1 2.888-2.888c.374 0 .727.07 1.052.197V9.45a6.34 6.34 0 0 0-1.052-.088C6.072 9.362 3.3 12.134 3.3 15.549 3.3 18.965 6.072 21.737 9.487 21.737c3.415 0 6.187-2.772 6.187-6.188V9.125a8.17 8.17 0 0 0 4.915 1.624v-3.48a4.8 4.8 0 0 1-1-.583Z" />
  </svg>
);

const getIcon = (platform: SocialLink['platform']) => {
  switch (platform) {
    case 'instagram':
      return <Instagram className="w-4 h-4 text-neutral-800" />;
    case 'tiktok':
      return <TikTokIcon className="w-4 h-4 text-neutral-800" />;
    case 'youtube':
      return <Youtube className="w-4 h-4 text-neutral-800" />;
    case 'email':
      return <Mail className="w-4 h-4 text-neutral-800" />;
  }
};

/**
 * Turns a scroll threshold into a one-shot reveal.
 *
 * Scrubbing opacity against scroll meant a fast flick past the hero cards
 * snapped every nav icon on in the same frame — the drop-in never played.
 * A boolean + spring lets the animation run on its own clock, so even a jump
 * to the bottom plays the staggered cascade. The `resetMargin` hysteresis
 * stops it flickering when the user hovers around the boundary.
 */
const useScrollReveal = (
  scrollY: MotionValue<number>,
  start: number | undefined,
  end: number | undefined,
  resetMargin = 120
) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (end === undefined) return;
    const evaluate = (value: number) => {
      if (value >= end) setRevealed(true);
      else if (start !== undefined && value < start - resetMargin) setRevealed(false);
    };
    evaluate(scrollY.get());
    return scrollY.on('change', evaluate);
  }, [scrollY, start, end, resetMargin]);

  return revealed;
};

/** Each social icon arrives exactly as its hero row reaches the navbar. */
const NavSocialIcon: React.FC<{
  link: SocialLink;
  scrollY: MotionValue<number>;
  range?: { start: number; end: number };
  index: number;
}> = ({ link, scrollY, range, index }) => {
  const revealed = useScrollReveal(scrollY, range?.start, range?.end);

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      initial={false}
      animate={
        revealed
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 10, scale: 0.8 }
      }
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 26,
        mass: 0.7,
        // Cascade instead of popping together when the scroll jumped.
        delay: revealed ? 0.08 + index * 0.09 : 0,
      }}
      style={{ pointerEvents: revealed ? 'auto' : 'none' }}
      className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors text-neutral-700"
    >
      {getIcon(link.platform)}
    </motion.a>
  );
};

/**
 * The swing: the sheet tips off the top edge slowly, falls faster through the
 * middle, then settles into hanging — the arc of a cloth being pulled over a
 * table edge rather than a mechanical slide. Scroll-linked, so it never lags
 * behind the finger.
 */
const easeDrape = (progress: number) => {
  const p = Math.max(0, Math.min(1, progress));
  const fall = p * p;
  // A whisper of overshoot in the final third: the bottom edge swings a hair
  // past flat and drops back, like the hem of a cloth coming to rest.
  const settle = Math.sin(Math.PI * Math.max(0, (p - 0.5) / 0.5));
  return fall + 0.055 * settle;
};

export const Header: React.FC<HeaderProps> = ({
  name,
  socials,
  navProgress,
  scrollY,
  nameDocked,
  dockDistance,
  socialRanges,
}) => {
  const [copied, setCopied] = useState(false);

  // The sheet is hinged on the viewport's top edge. At progress 0 it lies flat
  // in the plane of the ceiling (-88deg ≈ edge-on, so invisible); as you scroll
  // it swings down into view. Nothing is translated, so it genuinely hangs.
  const fold = useTransform(navProgress, easeDrape);
  const rotateX = useTransform(fold, [0, 1], [-88, 0]);
  const sheetOpacity = useTransform(navProgress, [0, 0.08], [0, 1]);

  // The travelling clone is a downscaled bitmap by the time it reaches the
  // nav, so it dissolves into this crisp brand over the last few pixels of
  // travel. Both are set at weight 800, so their boxes are identical.
  const handoffEnd = dockDistance > 0 ? dockDistance : 1;
  // Swap instantly under the clone (which is painted on top), then let the
  // clone dissolve away. Cross-fading the two at 50/50 would dip their combined
  // coverage to 75% and read as the wordmark flashing grey.
  const brandOpacity = useTransform(
    scrollY,
    [handoffEnd - 0.5, handoffEnd],
    [0, 1]
  );

  const lastSocialEnd = socialRanges.length
    ? Math.max(...socialRanges.map((range) => range.end))
    : 500;
  const shareStart = Math.max(200, lastSocialEnd + 50);
  const shareRevealed = useScrollReveal(scrollY, shareStart, shareStart + 90);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} — Official Links`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.header
      style={{
        opacity: sheetOpacity,
        rotateX,
        transformPerspective: 1400,
        transformOrigin: 'top center',
        willChange: 'transform, opacity',
      }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      {/* Hangs from the viewport's top edge: square at the top, curved at the
          bottom, no top border — so it reads as a tab attached to the ceiling
          rather than a pill floating in the page.
          The surface is the page's own paper colour (#fcfbf8), and there is no
          hairline border or drop shadow. Blending a colour over itself is a
          no-op, so over the paper the card is invisible — only the wordmark and
          icons read. The backdrop blur and the tint only become visible when
          real imagery (the stage photo, media cards) passes underneath. */}
      <div
        className="pointer-events-auto w-full max-w-lg flex items-center justify-between gap-6 rounded-b-[26px] bg-cream-50/90 px-5 pb-2.5 backdrop-blur-lg sm:backdrop-blur-xl"
        style={{ paddingTop: 'calc(10px + env(safe-area-inset-top, 0px))' }}
      >
        <motion.span
          id="nav-brand"
          style={{ opacity: nameDocked ? brandOpacity : 1 }}
          className="font-syne font-extrabold text-sm tracking-[var(--display-tracking)] text-neutral-900 uppercase"
        >
          {name}
        </motion.span>

        {/* Neat Social Icons Floating Dock — each item docks in on scroll */}
        <div className="flex items-center gap-1.5">
          {socials.map((link, index) => (
            <NavSocialIcon
              key={link.id}
              link={link}
              scrollY={scrollY}
              range={socialRanges[index]}
              index={index}
            />
          ))}

          <motion.button
            onClick={handleShare}
            aria-label="Share page"
            initial={false}
            animate={
              shareRevealed
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 10, scale: 0.8 }
            }
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 26,
              mass: 0.7,
              delay: shareRevealed ? 0.08 + socials.length * 0.09 : 0,
            }}
            style={{ pointerEvents: shareRevealed ? 'auto' : 'none' }}
            className="ml-1 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <ArrowUpRight className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
