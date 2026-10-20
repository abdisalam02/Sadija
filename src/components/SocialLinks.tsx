import React from 'react';
import { ArrowUpRight, Instagram, Youtube } from 'lucide-react';
import { SocialLink } from '../types';

interface SocialLinksProps {
  socials: SocialLink[];
}

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.887 2.887 2.897 2.897 0 0 1-2.888-2.887 2.896 2.896 0 0 1 2.888-2.888c.374 0 .727.07 1.052.197V9.45a6.34 6.34 0 0 0-1.052-.088C6.072 9.362 3.3 12.134 3.3 15.549 3.3 18.965 6.072 21.737 9.487 21.737c3.415 0 6.187-2.772 6.187-6.188V9.125a8.17 8.17 0 0 0 4.915 1.624v-3.48a4.8 4.8 0 0 1-1-.583Z" />
  </svg>
);

export const SocialLinks: React.FC<SocialLinksProps> = ({ socials }) => {
  const getIcon = (platform: SocialLink['platform']) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-neutral-800" />;
      case 'tiktok':
        return <TikTokIcon className="w-5 h-5 text-neutral-800" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-neutral-800" />;
      default:
        return null;
    }
  };

  // Interleaving Z-index: Image (z-20) weaves through social stack
  const getZIndex = (index: number) => {
    return index % 2 === 0 ? 'z-30' : 'z-10';
  };

  // Alternating fading transparency gradients:
  // Even (0, 2 - Instagram, YouTube): Fades transparency to the right
  // Odd (1 - TikTok): Fades transparency to the left (inverted)
  const getGradientClasses = (index: number) => {
    const isEven = index % 2 === 0;
    return isEven
      ? 'bg-gradient-to-r from-white/90 via-white/55 to-white/10 border-l border-t border-b border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
      : 'bg-gradient-to-l from-white/90 via-white/55 to-white/10 border-r border-t border-b border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]';
  };

  return (
    <div className="space-y-3.5 w-full relative">
      {socials.map((link, idx) => (
        <div key={link.id} className={`relative ${getZIndex(idx)}`}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between p-4 rounded-2xl backdrop-blur-md transition-all pointer-events-auto ${getGradientClasses(
              idx
            )} hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/85 shadow-sm flex items-center justify-center text-neutral-800 group-hover:scale-105 transition-transform">
                {getIcon(link.platform)}
              </div>

              <div className="text-left">
                <span className="font-syne font-bold text-sm tracking-tight text-neutral-900 group-hover:text-black transition-colors block">
                  {link.label}
                </span>
                <span className="text-xs text-neutral-600 block font-medium">
                  {link.followers || link.handle}
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/80 group-hover:bg-white shadow-sm flex items-center justify-center text-neutral-600 group-hover:text-neutral-900 transition-colors">
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};
