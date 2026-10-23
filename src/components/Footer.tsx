import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Instagram, Youtube, Mail } from 'lucide-react';
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

const MARQUEE_ITEMS = [
  'Available for select projects',
  'Design & Development',
  'Agure.space',
  'Oslo / Worldwide',
];

const MarkTicker: React.FC<{ hidden?: boolean }> = ({ hidden }) => (
  <div
    aria-hidden={hidden}
    className="flex shrink-0 items-center gap-6 pr-6 font-mono text-[9px] font-medium uppercase tracking-[0.24em] whitespace-nowrap text-neutral-500 sm:gap-8 sm:pr-8 sm:text-[10px]"
  >
    {MARQUEE_ITEMS.map((item, i) => (
      <React.Fragment key={item}>
        {i > 0 && <span className="text-neutral-300">/</span>}
        {i === 0 ? (
          <span className="flex items-center gap-2 text-neutral-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
            </span>
            {item}
          </span>
        ) : (
          <span>{item}</span>
        )}
      </React.Fragment>
    ))}
  </div>
);

export const Footer: React.FC<FooterProps> = ({ name, socials, email, onScrollToTop }) => {
  const reduceMotion = useReducedMotion();

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

  const letters = ['A', '.', 'G', 'U', 'R', 'E'];

  return (
    <footer className="relative z-30 w-full border-t border-black/10 bg-[#fcfbf8] px-5 pb-8 pt-10 sm:px-10 lg:px-14">
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
              className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white/70 px-3 py-1.5 text-neutral-700 shadow-sm transition-all hover:bg-white hover:text-black"
            >
              {getIcon(s.platform)}
              <span className="font-syne text-[11px] font-bold tracking-tight">{s.label}</span>
            </a>
          ))}

          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white/70 px-3 py-1.5 text-neutral-700 shadow-sm transition-all hover:bg-white hover:text-black"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="font-syne text-[11px] font-bold tracking-tight">Direct Mail</span>
            </a>
          )}
        </div>

        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="flex items-center gap-1.5 rounded-full border border-neutral-300/80 bg-white/80 px-3.5 py-1.5 text-neutral-800 shadow-sm transition-all hover:bg-white active:scale-95"
        >
          <span className="text-[11px] font-medium">Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Availability / craft ticker */}
      <div className="footer-marquee mt-8 overflow-hidden border-y border-black/10 py-3">
        <div className="footer-marquee__track flex w-max">
          <MarkTicker />
          <MarkTicker hidden />
        </div>
      </div>

      {/* Site-by signature */}
      <div className="mt-8 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-400 sm:text-[10px]">
        <span>[ SITE BY ]</span>
        <span>OSLO / WORLDWIDE</span>
      </div>

      <a
        href="https://agure.space"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="A.Gure — agure.space (opens in a new tab)"
        className="group mt-2 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
      >
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          className="overflow-hidden pt-[0.06em]"
        >
          <motion.span
            variants={{
              hidden: { y: '108%' },
              visible: { y: 0 },
            }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1, ease: [0.16, 1, 0.3, 1] }
            }
            className="flex items-baseline whitespace-nowrap font-syne font-extrabold uppercase leading-[0.82] tracking-[-0.055em] text-[#141518] text-[14.5vw]"
          >
            {letters.map((letter, i) =>
              letter === '.' ? (
                <span
                  key={i}
                  aria-hidden="true"
                  className="footer-dot mx-[0.035em] inline-block h-[0.135em] w-[0.135em] flex-none origin-center bg-current transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:scale-125"
                />
              ) : (
                <span
                  key={i}
                  aria-hidden="true"
                  className="footer-letter inline-block will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[0.055em]"
                  style={{ transitionDelay: `${i * 35}ms` }}
                >
                  {letter}
                </span>
              )
            )}
          </motion.span>
        </motion.div>

        <div className="mt-4 flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 transition-colors duration-300 group-hover:text-neutral-900 lg:text-[11px]">
          <span className="flex items-center gap-2">
            <span className="relative">
              agure.space
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
          <span className="hidden text-neutral-400 sm:block">Independent designer &amp; developer</span>
        </div>
      </a>

      {/* Colophon & Copyright */}
      <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-black/10 pt-4 text-[11px] text-neutral-400 sm:flex-row sm:items-center">
        <div>
          <span>© {new Date().getFullYear()} {name}. </span>
          <span>Oslo, Norway.</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          Editorial Digital Archive
        </span>
      </div>
    </footer>
  );
};
