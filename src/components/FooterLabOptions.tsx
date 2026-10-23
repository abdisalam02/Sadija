import React from 'react';
import { ArrowUp, ArrowUpRight, Instagram, Youtube, Mail } from 'lucide-react';
import { clientProfile } from '../config/clientConfig';

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.887 2.887 2.897 2.897 0 0 1-2.888-2.887 2.896 2.896 0 0 1 2.888-2.888c.374 0 .727.07 1.052.197V9.45a6.34 6.34 0 0 0-1.052-.088C6.072 9.362 3.3 12.134 3.3 15.549 3.3 18.965 6.072 21.737 9.487 21.737c3.415 0 6.187-2.772 6.187-6.188V9.125a8.17 8.17 0 0 0 4.915 1.624v-3.48a4.8 4.8 0 0 1-1-.583Z" />
  </svg>
);

const getIcon = (platform: string) => {
  switch (platform) {
    case 'instagram':
      return <Instagram className="h-3.5 w-3.5" />;
    case 'tiktok':
      return <TikTokIcon />;
    case 'youtube':
      return <Youtube className="h-3.5 w-3.5" />;
    default:
      return null;
  }
};

/** Lab links are inert so clicking a credit doesn't navigate away mid-review. */
const CreditLink: React.FC<{
  label: string;
  className?: string;
  children: React.ReactNode;
}> = ({ label, className = '', children }) => (
  <a
    href="https://agure.space"
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title="Preview only — links are disabled in the lab"
    onClick={(event) => event.preventDefault()}
    className={`${className} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900`}
  >
    {children}
  </a>
);

const Square: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    aria-hidden="true"
    className={`inline-block flex-none origin-center bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
  />
);

const SocialRow: React.FC<{ extra?: React.ReactNode }> = ({ extra }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex flex-wrap items-center gap-2">
      {clientProfile.socials.map((social) => (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          onClick={(event) => event.preventDefault()}
          className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white/70 px-3 py-1.5 text-neutral-700 shadow-sm transition-all hover:bg-white hover:text-black"
        >
          {getIcon(social.platform)}
          <span className="font-syne text-[11px] font-bold tracking-tight">{social.label}</span>
        </a>
      ))}

      <a
        href={`mailto:${clientProfile.business.email}`}
        onClick={(event) => event.preventDefault()}
        className="flex items-center gap-1.5 rounded-full border border-black/5 bg-white/70 px-3 py-1.5 text-neutral-700 shadow-sm transition-all hover:bg-white hover:text-black"
      >
        <Mail className="h-3.5 w-3.5" />
        <span className="font-syne text-[11px] font-bold tracking-tight">Direct Mail</span>
      </a>

      {extra}
    </div>

    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex items-center gap-1.5 rounded-full border border-neutral-300/80 bg-white/80 px-3.5 py-1.5 text-neutral-800 shadow-sm transition-all hover:bg-white active:scale-95"
    >
      <span className="text-[11px] font-medium">Back to Top</span>
      <ArrowUp className="h-3.5 w-3.5" />
    </button>
  </div>
);

const FooterShell: React.FC<{ credit?: React.ReactNode; extra?: React.ReactNode }> = ({
  credit,
  extra,
}) => (
  <footer className="w-full space-y-6 border-t border-black/5 pb-10 pt-10 text-xs text-neutral-500">
    <SocialRow extra={extra} />

    <div className="flex flex-col items-start justify-between gap-2 pt-2 text-[11px] text-neutral-400 sm:flex-row sm:items-center">
      <div>
        <span>© {new Date().getFullYear()} SADIJA. </span>
        <span>Oslo, Norway.</span>
      </div>

      {credit ?? (
        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          Editorial Digital Archive
        </span>
      )}
    </div>
  </footer>
);

/* ── Option A — bracket colophon ─────────────────────────────────────────── */

const CreditA = () => (
  <CreditLink
    label="A.Gure — agure.space"
    className="group inline-flex items-center gap-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-400 transition-colors duration-300 hover:text-neutral-900"
  >
    <span className="inline-flex items-center">
      [&nbsp;SITE&nbsp;BY&nbsp;A
      <Square className="mx-[0.28em] h-[0.5em] w-[0.5em] group-hover:rotate-45" />
      GURE&nbsp;]
    </span>
    <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </CreditLink>
);

/* ── Option B — quiet signature ──────────────────────────────────────────── */

const CreditB = () => (
  <CreditLink
    label="A.Gure — agure.space"
    className="group inline-flex items-baseline gap-2.5 whitespace-nowrap transition-colors duration-300 hover:text-neutral-900"
  >
    <span className="font-syne text-[13px] font-bold tracking-tight text-neutral-500 transition-colors duration-300 group-hover:text-neutral-900">
      A
      <Square className="mx-[0.06em] inline-block h-[0.22em] w-[0.22em] -translate-y-[0.04em] group-hover:rotate-45" />
      Gure
    </span>
    <span className="relative font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
      agure.space
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
    </span>
  </CreditLink>
);

/* ── Option C — monogram stamp ───────────────────────────────────────────── */

const CreditC = () => (
  <CreditLink
    label="A.Gure — agure.space"
    className="group inline-flex items-center gap-2.5 whitespace-nowrap"
  >
    <span className="relative flex h-7 w-7 flex-none items-center justify-center">
      <span className="absolute inset-0 border border-neutral-300/90 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-focus:rotate-45" />
      <span className="relative font-syne text-[10px] font-bold text-neutral-600 transition-colors duration-300 group-hover:text-neutral-900 group-focus:text-neutral-900">
        A.
      </span>
    </span>
    <span className="max-w-0 overflow-hidden font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 opacity-0 transition-all duration-500 group-hover:max-w-[160px] group-hover:opacity-100 group-focus:max-w-[160px] group-focus:opacity-100">
      agure.space&nbsp;↗
    </span>
  </CreditLink>
);

/* ── Option D — glass credit pill ────────────────────────────────────────── */

const CreditD = () => (
  <CreditLink
    label="A.Gure — agure.space"
    className="group flex items-center gap-1.5 rounded-full border border-white/80 bg-white/55 px-3 py-1.5 text-neutral-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-px hover:bg-white hover:shadow-md active:scale-[0.98]"
  >
    <span className="font-syne text-[11px] font-bold tracking-tight">A.Gure</span>
    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </CreditLink>
);

/* ── Option E — hover reveal ─────────────────────────────────────────────── */

const CreditE = () => (
  <CreditLink
    label="A.Gure — agure.space"
    className="group inline-flex items-center gap-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 transition-colors duration-300 hover:text-neutral-900"
  >
    <span className="font-syne text-[11px] font-bold tracking-tight text-neutral-500 transition-colors duration-300 group-hover:text-neutral-900 group-focus:text-neutral-900">
      A
      <Square className="mx-[0.06em] inline-block h-[0.24em] w-[0.24em] -translate-y-[0.03em] group-hover:rotate-45 group-focus:rotate-45" />
    </span>
    <span className="max-w-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-w-[230px] group-hover:opacity-100 group-focus:max-w-[230px] group-focus:opacity-100">
      A.GURE&nbsp;—&nbsp;AGURE.SPACE&nbsp;↗
    </span>
  </CreditLink>
);

export const BaselineFooter = () => <FooterShell />;
export const OptionAFooter = () => <FooterShell credit={<CreditA />} />;
export const OptionBFooter = () => <FooterShell credit={<CreditB />} />;
export const OptionCFooter = () => <FooterShell credit={<CreditC />} />;
export const OptionDFooter = () => <FooterShell extra={<CreditD />} />;
export const OptionEFooter = () => <FooterShell credit={<CreditE />} />;
