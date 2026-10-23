import React, { useState } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { Instagram, Youtube, Mail, ArrowUpRight, Check } from 'lucide-react';
import { SocialLink } from '../types';

interface HeaderProps {
  name: string;
  socials: SocialLink[];
  navOpacity: MotionValue<number>;
  navY: MotionValue<number>;
  scrollY: MotionValue<number>;
  nameDocked: boolean;
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

/** Each social icon arrives exactly as its hero row reaches the navbar. */
const NavSocialIcon: React.FC<{
  link: SocialLink;
  scrollY: MotionValue<number>;
  range?: { start: number; end: number };
}> = ({ link, scrollY, range }) => {
  const start = range?.start ?? 99999;
  const end = range?.end ?? 99999;
  const opacity = useTransform(scrollY, [start, end], [0, 1]);
  const y = useTransform(scrollY, [start, end], [10, 0]);
  const scale = useTransform(scrollY, [start, end], [0.8, 1]);

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      style={{ opacity, y, scale }}
      className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors text-neutral-700"
    >
      {getIcon(link.platform)}
    </motion.a>
  );
};

export const Header: React.FC<HeaderProps> = ({
  name,
  socials,
  navOpacity,
  navY,
  scrollY,
  nameDocked,
  socialRanges,
}) => {
  const [copied, setCopied] = useState(false);

  const lastSocialEnd = socialRanges.length
    ? Math.max(...socialRanges.map((range) => range.end))
    : 500;
  const shareStart = Math.max(200, lastSocialEnd + 50);
  const shareOpacity = useTransform(scrollY, [shareStart, shareStart + 90], [0, 1]);
  const shareY = useTransform(scrollY, [shareStart, shareStart + 90], [10, 0]);
  const shareScale = useTransform(scrollY, [shareStart, shareStart + 90], [0.8, 1]);

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
      style={{ opacity: navOpacity, y: navY }}
      className="fixed top-3 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto bg-white/80 backdrop-blur-md border border-neutral-200/80 rounded-full px-5 py-2.5 shadow-lg shadow-black/[0.04] flex items-center justify-between gap-6 max-w-lg w-full">
        <span
          id="nav-brand"
          style={{ opacity: nameDocked ? 0 : 1 }}
          className="font-syne font-bold text-sm tracking-tight text-neutral-900 uppercase"
        >
          {name}
        </span>

        {/* Neat Social Icons Floating Dock — each item docks in on scroll */}
        <div className="flex items-center gap-1.5">
          {socials.map((link, index) => (
            <NavSocialIcon
              key={link.id}
              link={link}
              scrollY={scrollY}
              range={socialRanges[index]}
            />
          ))}

          <motion.button
            onClick={handleShare}
            aria-label="Share page"
            style={{ opacity: shareOpacity, y: shareY, scale: shareScale }}
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
