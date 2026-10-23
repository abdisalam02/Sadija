import React from 'react';
import { useUnlockDocumentScroll } from '../hooks/useUnlockDocumentScroll';
import {
  ProofWindowCredit,
  CircuitCardCredit,
  VfdStripCredit,
  FieldPlateCredit,
  ReceiptCredit,
  FoilLabelCredit,
  VinylSleeveCredit,
  FlipCalendarCredit,
  PunchCardCredit,
  PaperStickerCredit,
  ObiBandCredit,
  WaxSealCredit,
} from '../components/signatures/EditorialWave2';

interface EditorialOption {
  number: string;
  original: string;
  name: string;
  category: string;
  description: string;
  Component: React.FC;
}

const OPTIONS: EditorialOption[] = [
  {
    number: '01',
    original: 'Mac System 1 / CRT window',
    name: 'Proof window',
    category: 'Print',
    description: 'The retro window becomes a printer’s proof slip — hairline chrome, sheet number, no CRT glow.',
    Component: ProofWindowCredit,
  },
  {
    number: '02',
    original: 'Atomic Purple PCB',
    name: 'Circuit card',
    category: 'Technical',
    description: 'The purple Game Boy teardown becomes a single hairline circuit drawing with one live node.',
    Component: CircuitCardCredit,
  },
  {
    number: '03',
    original: 'HiFi VFD display',
    name: 'VFD strip',
    category: 'Audio',
    description: 'The gunmetal VFD deck becomes a black-glass audio strip — the same material as the site’s email pill.',
    Component: VfdStripCredit,
  },
  {
    number: '04',
    original: 'Teenage Engineering field module',
    name: 'Field plate',
    category: 'Technical',
    description: 'The orange push-button module becomes a quiet spec plate with coordinates and a hairline indicator.',
    Component: FieldPlateCredit,
  },
  {
    number: '05',
    original: 'Thermal receipt + red stamp',
    name: 'Receipt',
    category: 'Print',
    description: 'The thermal receipt keeps its paper logic; the red rubber stamp becomes a black letterpress mark.',
    Component: ReceiptCredit,
  },
  {
    number: '06',
    original: 'Holographic foil sticker',
    name: 'Foil label',
    category: 'Object',
    description: 'The rainbow hologram becomes a restrained silver foil monogram — a physical stamp, not a gradient.',
    Component: FoilLabelCredit,
  },
  {
    number: '07',
    original: 'Micro vinyl record',
    name: 'Vinyl sleeve',
    category: 'Music',
    description: 'The miniature LP stays, but now it’s a paper sleeve and a black record that slides out on hover.',
    Component: VinylSleeveCredit,
  },
  {
    number: '08',
    original: 'Solari split-flap board',
    name: 'Flip calendar',
    category: 'Motion',
    description: 'The mechanical departure board becomes a two-page paper calendar; the top page flips to reveal the domain.',
    Component: FlipCalendarCredit,
  },
  {
    number: '09',
    original: 'Nothing dot-matrix LED',
    name: 'Punch card',
    category: 'Print',
    description: 'The cyber LED grid becomes a punched paper card. Hover fills the empty holes in a slow wave.',
    Component: PunchCardCredit,
  },
  {
    number: '10',
    original: 'Peel sticker',
    name: 'Paper sticker',
    category: 'Object',
    description: 'The sticker stays — now warm paper, black ink and a softly peeled corner, straightening on hover.',
    Component: PaperStickerCredit,
  },
  {
    number: '11',
    original: 'Japanese obi band',
    name: 'Obi band',
    category: 'Editorial',
    description: 'The book obi becomes a narrow paper band wrapping the credit, with vertical Syne and mono metadata.',
    Component: ObiBandCredit,
  },
  {
    number: '12',
    original: 'Wax seal charter',
    name: 'Wax seal',
    category: 'Object',
    description: 'The charter seal becomes a small black wax seal with an embossed A. and paper-ink typography.',
    Component: WaxSealCredit,
  },
];

const Wave2Lab: React.FC = () => {
  useUnlockDocumentScroll();

  return (
    <div className="min-h-dvh bg-[#efede7] text-[#141518] selection:bg-neutral-900 selection:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fcfbf8]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-400">
              [ WAVE 2 / RE-ENVISIONED ]
            </span>
            <h1 className="font-syne text-base font-extrabold tracking-tight sm:text-lg">
              Same ideas, rebuilt for this page
            </h1>
          </div>
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider">
            <a href="/?lab=signature" className="text-neutral-400 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900">
              previous lab
            </a>
            <a href="/" className="text-neutral-400 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900">
              back to site
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          The Gemini batch was fighting the page: smoked purple plastic, neon cyan, glowing LEDs, 3D bezels.
          The concepts were strong, so I kept all twelve and rebuilt them in the site’s materials — paper,
          black ink, hairlines, soft glass, one green status dot and photography. Nothing here is live.
        </p>
        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
          Hover / tap the objects · shown at real footer scale
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {OPTIONS.map((option) => (
            <section key={option.number} id={`wave2-${option.number}`} className="scroll-mt-24">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-black/10 pt-4">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="font-mono text-[10px] tabular-nums tracking-[0.18em] text-neutral-400">
                    {option.number}
                  </span>
                  <span className="rounded-full border border-black/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-neutral-500">
                    {option.category}
                  </span>
                  <h2 className="font-syne text-lg font-extrabold uppercase tracking-tight sm:text-xl">
                    {option.name}
                  </h2>
                </div>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-neutral-400">
                  from: {option.original}
                </span>
              </div>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
                {option.description}
              </p>

              <div className="relative mt-3 overflow-hidden rounded-xl border border-black/10 bg-[#fcfbf8]">
                <img
                  src="./img/look-3-trench-v2.webp"
                  alt=""
                  className="pointer-events-none absolute -right-8 bottom-0 h-[160%] w-auto opacity-[0.05]"
                />
                <div className="relative flex min-h-[150px] items-end justify-between gap-4 px-5 py-5 sm:px-7">
                  <span className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-300 sm:block">
                    © 2026 SADIJA — OSLO
                  </span>
                  <div className="ml-auto">
                    <option.Component />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-black/10 pt-6">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            Shortlist the directions that feel like you, and tell me if any concept should be pushed further
            or dropped. I’ll wire the chosen one into the real footer, not the lab.
          </p>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
            Preview route only · the live footer is the ink signature for now.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Wave2Lab;
