import React from 'react';
import {
  BaselineFooter,
  OptionAFooter,
  OptionBFooter,
  OptionCFooter,
  OptionDFooter,
  OptionEFooter,
} from '../components/FooterLabOptions';
import { useUnlockDocumentScroll } from '../hooks/useUnlockDocumentScroll';

interface LabOption {
  id: string;
  label: string;
  name: string;
  description: string;
  note: string;
  recommended?: boolean;
  Component: React.FC;
}

const OPTIONS: LabOption[] = [
  {
    id: 'baseline',
    label: 'BASELINE',
    name: 'Current footer',
    description:
      'The control: social pills, colophon and the decorative archive label. No A.Gure credit anywhere.',
    note: 'This is exactly what the live footer looks like today.',
    Component: BaselineFooter,
  },
  {
    id: 'a',
    label: 'OPTION A',
    name: 'Bracket colophon',
    description:
      "One 9px mono line at the far right of the colophon, where the archive label sits. Same tracking as the site's [ CHAPTER ] tags. Replaces the decorative archive label; no extra height.",
    note: 'Hover / tap → the square period rotates into a diamond, the arrow nudges.',
    recommended: true,
    Component: OptionAFooter,
  },
  {
    id: 'b',
    label: 'OPTION B',
    name: 'Quiet signature',
    description:
      'A.Gure set small in Syne, with the domain in 9px mono. A touch more personal than A; at 13px it still reads as a signature, not a logo.',
    note: 'Hover / tap → the domain underline draws in and the square period turns.',
    Component: OptionBFooter,
  },
  {
    id: 'c',
    label: 'OPTION C',
    name: 'Monogram stamp',
    description:
      "A 28px hairline box with A. inside. The most reduced option with a visible mark; reads like a designer's stamp in the colophon.",
    note: 'Hover / tap or focus → the box rotates into a diamond, the domain slides out.',
    Component: OptionCFooter,
  },
  {
    id: 'd',
    label: 'OPTION D',
    name: 'Glass credit pill',
    description:
      'A small translucent pill sitting with the social pills. It borrows the existing glass language directly and leaves the colophon untouched.',
    note: 'Hover / tap → the pill lifts 1px and the arrow shifts.',
    Component: OptionDFooter,
  },
  {
    id: 'e',
    label: 'OPTION E',
    name: 'Hover reveal',
    description:
      'At rest, only a tiny A▪. Hover or focus expands it to the full A.GURE — AGURE.SPACE credit. The most restrained, but the least discoverable.',
    note: 'Hover / tap or focus → the full credit expands out of the monogram.',
    Component: OptionEFooter,
  },
];

const FooterLab: React.FC = () => {
  useUnlockDocumentScroll();

  return (
    <div className="min-h-dvh bg-[#efede7] text-[#141518] selection:bg-neutral-900 selection:text-white">
      {/* Lab chrome */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fcfbf8]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-400">
              [ FOOTER LAB ]
            </span>
            <h1 className="font-syne text-base font-extrabold tracking-tight sm:text-lg">
              Site credit — pick a direction
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {['baseline', 'a', 'b', 'c', 'd', 'e'].map((key) => (
              <a
                key={key}
                href={`#option-${key}`}
                className="rounded-full border border-black/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-neutral-500 transition-colors hover:border-black/20 hover:text-neutral-900"
              >
                {key}
              </a>
            ))}
            <a
              href="/"
              className="ml-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-neutral-400 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900"
            >
              back to site
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          These are isolated previews — the live site footer has <em>not</em> been changed. Every
          option keeps the original social row and colophon; only the credit changes. Hover or focus
          a credit to see its interaction. On touch, tap it once (links are disabled in the lab).
        </p>

        <div className="mt-10 space-y-16">
          {OPTIONS.map((option) => (
            <section key={option.id} id={`option-${option.id}`} className="scroll-mt-24">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-black/10 pt-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-400">
                    {option.label}
                  </span>
                  <h2 className="font-syne text-xl font-extrabold uppercase tracking-tight sm:text-2xl">
                    {option.name}
                  </h2>
                </div>

                {option.recommended && (
                  <span className="rounded-full border border-emerald-700/20 bg-emerald-700/[0.06] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-800">
                    My pick
                  </span>
                )}
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                {option.description}
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                {option.note}
              </p>

              {/* Context frame: left stage / right content column, like the real split layout */}
              <div className="relative mt-5 overflow-hidden rounded-xl border border-black/10 bg-[#fcfbf8]">
                <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 lg:block">
                  <img
                    src="./img/look-3-trench-v2.webp"
                    alt=""
                    className="h-full w-full object-cover object-[58%_16%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fcfbf8]/25 to-[#fcfbf8]" />
                </div>

                <img
                  src="./img/look-3-trench-v2.webp"
                  alt=""
                  className="pointer-events-none absolute -right-10 bottom-0 h-[85%] w-auto opacity-[0.07] lg:hidden"
                />

                <div className="relative lg:ml-auto lg:w-1/2">
                  <div className="px-5 pt-1 sm:px-8 lg:px-10">
                    <option.Component />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-black/10 pt-6">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            Reply with the letter and any tweaks — size, placement, whether you want the archive
            label kept, or a different hover. I&apos;ll only touch the real footer once you pick.
          </p>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
            Nothing on this page is part of the live site — preview route only.
          </p>
        </div>
      </main>
    </div>
  );
};

export default FooterLab;

