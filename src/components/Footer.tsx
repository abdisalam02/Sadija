import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { ArrowUp, Instagram, Youtube, Mail } from 'lucide-react';
import { SocialLink } from '../types';

interface FooterProps {
  name: string;
  socials: SocialLink[];
  email?: string;
  onScrollToTop?: () => void;
}

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.887 2.887 2.897 2.897 0 0 1-2.888-2.887 2.896 2.896 0 0 1 2.888-2.888c.374 0 .727.07 1.052.197V9.45a6.34 6.34 0 0 0-1.052-.088C6.072 9.362 3.3 12.134 3.3 15.549 3.3 18.965 6.072 21.737 9.487 21.737c3.415 0 6.187-2.772 6.187-6.188V9.125a8.17 8.17 0 0 0 4.915 1.624v-3.48a4.8 4.8 0 0 1-1-.583Z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ name, socials, email, onScrollToTop }) => {
  const signatureRef = useRef<HTMLAnchorElement>(null);
  const signatureInView = useInView(signatureRef, { once: false, amount: 0.5 });
  const [signatureRun, setSignatureRun] = useState(0);
  const scrollDirection = useRef<'down' | 'up'>('down');
  const wasInView = useRef(false);
  const signatureInViewRef = useRef(false);

  useEffect(() => {
    signatureInViewRef.current = signatureInView;
  }, [signatureInView]);

  // Replay the signature write each time it re-enters while scrolling down.
  useEffect(() => {
    const scroller = document.getElementById('app-scroll');
    const getY = () => scroller?.scrollTop ?? window.scrollY;
    let lastY = getY();

    const onScroll = () => {
      const y = getY();
      if (y > lastY + 1) {
        if (scrollDirection.current !== 'down' && signatureInViewRef.current) {
          setSignatureRun((run) => run + 1);
        }
        scrollDirection.current = 'down';
      } else if (y < lastY - 1) {
        scrollDirection.current = 'up';
      }
      lastY = y;
    };

    const target: HTMLElement | Window = scroller ?? window;
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (signatureInView && !wasInView.current && scrollDirection.current === 'down') {
      setSignatureRun((run) => run + 1);
    }
    wasInView.current = signatureInView;
  }, [signatureInView]);

  const scrollToTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
      return;
    }
    // Fallback for any future usage outside the app shell
    const scroller = document.getElementById('app-scroll');
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getIcon = (platform: SocialLink['platform']) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5" />;
      case 'tiktok':
        return <TikTokIcon className="w-3.5 h-3.5" />;
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="w-full pt-10 pb-16 space-y-6 text-xs text-neutral-500 border-t border-black/5">
      {/* Quick Social Connectivity Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-neutral-700 hover:text-black border border-black/5 shadow-sm transition-all"
            >
              {getIcon(s.platform)}
              <span className="font-syne font-bold text-[11px] tracking-tight">{s.label}</span>
            </a>
          ))}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-neutral-700 hover:text-black border border-black/5 shadow-sm transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="font-syne font-bold text-[11px] tracking-tight">Direct Mail</span>
            </a>
          )}
        </div>

        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-300/80 bg-white/80 hover:bg-white text-neutral-800 transition-all shadow-sm active:scale-95"
        >
          <span className="font-medium text-[11px]">Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Colophon & Copyright + A.Gure signature */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-[11px] text-neutral-400">
        <div>
          <span>© {new Date().getFullYear()} {name}. </span>
          <span>Oslo, Norway.</span>
        </div>

        <a
          ref={signatureRef}
          href="https://agure.space"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="A.Gure — agure.space"
          className="group flex flex-col items-start gap-0.5 text-neutral-500 transition-colors duration-300 hover:text-neutral-900 sm:items-end"
        >
          <span
            key={signatureRun}
            className="signature-replay flex flex-col items-start sm:items-end"
          >
            <span className="signature-write block font-signature text-[28px] leading-none">
              A. Gure
            </span>
            <svg viewBox="0 0 150 10" className="h-2 w-[120px] overflow-visible text-neutral-400">
              <path
                d="M2 7 C 30 2, 52 9, 78 5 S 122 2, 148 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="signature-underline"
              />
            </svg>
          </span>
          <span
            key={`signature-domain-${signatureRun}`}
            className="signature-domain font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-400"
          >
            agure.space ↗
          </span>
        </a>
      </div>
    </footer>
  );
};
