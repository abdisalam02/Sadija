import React, { useEffect } from 'react';
import {
  BarcodeCredit,
  DotMatrixCredit,
  EmbossedSealCredit,
  MagneticCredit,
  MiniFooter,
  PhotoTypeCredit,
  RegistrationCredit,
  ScrambleCredit,
  SealCredit,
  SignatureCredit,
  SplitFlapCredit,
  TicketCredit,
  WovenLabelCredit,
} from '../components/SignatureLabOptions';
import { useUnlockDocumentScroll } from '../hooks/useUnlockDocumentScroll';

interface Reference {
  label: string;
  href: string;
}

interface SignatureOption {
  id: string;
  number: string;
  category: string;
  name: string;
  description: string;
  note: string;
  references: Reference[];
  Component: React.FC;
}

const OPTIONS: SignatureOption[] = [
  {
    id: 'seal',
    number: '01',
    category: 'Mark',
    name: 'Atelier seal',
    description:
      'A slow-spinning circular stamp with the name and domain set on a path, around a square-period monogram. Reads like a fashion house’s atelier stamp.',
    note: 'Hover → the seal scales up slightly; the period turns into a diamond.',
    references: [
      { label: 'Circular text — CodePen', href: 'https://codepen.io/cc_stoic/pen/jOOvgJQ' },
      { label: 'Text on a circle — CSS-Tricks', href: 'https://css-tricks.com/set-text-on-a-circle/' },
    ],
    Component: SealCredit,
  },
  {
    id: 'signature',
    number: '02',
    category: 'Signature',
    name: 'Ink signature',
    description:
      'A real handwritten signature in Mrs Saint Delafield, with a single ink underline that draws itself. The most personal route — it reads as signed work, not a logo.',
    note: 'Hover / focus → the underline draws left-to-right, the ink darkens.',
    references: [
      {
        label: 'Kinetic SVG type — Codrops',
        href: 'https://tympanus.net/codrops/2023/01/31/bringing-letters-to-life-coding-a-kinetic-svg-typography-animation/',
      },
    ],
    Component: SignatureCredit,
  },
  {
    id: 'split-flap',
    number: '03',
    category: 'Motion',
    name: 'Split-flap token',
    description:
      'Six mechanical departure-board tiles that flick through letters before settling. A tiny object with a very tactile, analogue motion.',
    note: 'Hover / click / focus → the tiles flip; the name settles back.',
    references: [
      { label: 'Split-flap — HotFX', href: 'https://fx.hot.page/split-flap' },
      { label: 'Split-flap — CodePen', href: 'https://codepen.io/branlok/pen/qBQEGJy' },
    ],
    Component: SplitFlapCredit,
  },
  {
    id: 'scramble',
    number: '04',
    category: 'Digital',
    name: 'Scramble decoder',
    description:
      'A terminal-style credit that resolves from random glyphs into AGURE.SPACE on hover. Precise, technical, and very “developer signature”.',
    note: 'Hover / focus → decodes to AGURE.SPACE; leaving resets to A.GURE.',
    references: [
      {
        label: 'Scramble Hover — Fancy Components',
        href: 'https://www.fancycomponents.dev/docs/components/text/scramble-hover',
      },
      { label: 'Scramble — Motion examples', href: 'https://motion.dev/examples/js-scramble-text-hover' },
    ],
    Component: ScrambleCredit,
  },
  {
    id: 'magnetic',
    number: '05',
    category: 'Motion',
    name: 'Magnetic monogram',
    description:
      'The A.GURE wordmark pulls a few pixels toward the cursor and springs back. No visible chrome — just a micro-interaction that rewards attention.',
    note: 'Move the cursor over the monogram → the letters lean toward it.',
    references: [
      { label: 'Hover interactions — Codrops', href: 'https://tympanus.net/codrops/tag/hover/' },
    ],
    Component: MagneticCredit,
  },
  {
    id: 'dot-matrix',
    number: '06',
    category: 'Digital',
    name: 'Dot-matrix receipt',
    description:
      'A.GURE rendered as a halftone dot grid, like an LED display or thermal receipt. The dots shift a half-step on hover, animating the surface without changing the mark.',
    note: 'Hover → the dot grid shifts; the credit stays perfectly still.',
    references: [{ label: 'textmode.js', href: 'https://code.textmode.art' }],
    Component: DotMatrixCredit,
  },
  {
    id: 'woven-label',
    number: '07',
    category: 'Object',
    name: 'Woven garment label',
    description:
      'A tiny woven clothing label with stitched borders, a fibre line, and a slight tilt. The most native-to-fashion option — it looks sewn into the page, not placed on it.',
    note: 'Hover → the label straightens and lifts a fraction.',
    references: [
      { label: 'Woven labels — Dribbble', href: 'https://dribbble.com/search/woven-label' },
    ],
    Component: WovenLabelCredit,
  },
  {
    id: 'barcode',
    number: '08',
    category: 'Object',
    name: 'Barcode hang tag',
    description:
      'A product hang tag with a real bar rhythm, a serial line and one hairline red scan laser on hover. Small, monochrome, with a single colour accent.',
    note: 'Hover → the red scanner line sweeps across the barcode.',
    references: [
      { label: 'Clothing labels — Dribbble', href: 'https://dribbble.com/search/clothing-label' },
    ],
    Component: BarcodeCredit,
  },
  {
    id: 'registration',
    number: '09',
    category: 'Print',
    name: "Printer's registration mark",
    description:
      'A crosshair registration target and crop marks, like a colour proof from a print house. The most editorial, and the least “logo” of the set.',
    note: 'Hover → the target rotates 90° and the crop marks breathe outward.',
    references: [
      { label: 'Printing registration — reference', href: 'https://en.wikipedia.org/wiki/Printing_registration' },
    ],
    Component: RegistrationCredit,
  },
  {
    id: 'embossed-seal',
    number: '10',
    category: 'Object',
    name: 'Embossed seal',
    description:
      'A debossed paper seal in the same off-white as the site, lit only by inset shadows. Almost invisible until you look — the quietest physical option.',
    note: 'Hover → the seal presses and tilts, deepening its shadow.',
    references: [
      { label: 'Wax seals — Dribbble', href: 'https://dribbble.com/search/wax-seal' },
    ],
    Component: EmbossedSealCredit,
  },
  {
    id: 'photo-type',
    number: '11',
    category: 'Editorial',
    name: 'Photo-filled type',
    description:
      'A.GURE filled with one of Sadija’s photographs instead of a flat colour. The credit literally carries the site’s imagery, and the crop pans on hover.',
    note: 'Hover → the photograph inside the letters drifts.',
    references: [
      { label: 'background-clip — MDN', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip' },
      { label: 'Typography experiments — Codrops', href: 'https://tympanus.net/codrops/tag/typography/' },
    ],
    Component: PhotoTypeCredit,
  },
  {
    id: 'ticket',
    number: '12',
    category: 'Object',
    name: 'Ticket stub',
    description:
      'A perforated ticket with a torn-off stub, a punched hole and a serial number. Playful, but still only a small paper object in the footer.',
    note: 'Hover → the stub tears outward by a few degrees.',
    references: [
      { label: 'Ticket design — Dribbble', href: 'https://dribbble.com/search/ticket-design' },
    ],
    Component: TicketCredit,
  },
];

const SignatureLab: React.FC = () => {
  useUnlockDocumentScroll();

  // Only the lab needs the handwritten signature face.
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap';
    document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, []);

  return (
    <div className="min-h-dvh bg-[#efede7] text-[#141518] selection:bg-neutral-900 selection:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fcfbf8]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-400">
              [ SIGNATURE LAB ]
            </span>
            <h1 className="font-syne text-base font-extrabold tracking-tight sm:text-lg">
              A.Gure — twelve directions
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {OPTIONS.map((option) => (
              <a
                key={option.id}
                href={`#sig-${option.number}`}
                className="rounded-full border border-black/10 px-2 py-1 font-mono text-[9px] tabular-nums tracking-wider text-neutral-500 transition-colors hover:border-black/20 hover:text-neutral-900"
              >
                {option.number}
              </a>
            ))}
            <a
              href="/?lab=footer"
              className="ml-2 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-neutral-400 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900"
            >
              previous 5
            </a>
            <a
              href="/"
              className="ml-1 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-neutral-400 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900"
            >
              back to site
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
          Twelve distinct signature studies, all shown at real footer scale. The live site is
          untouched. Hover, tap or click each credit to preview its interaction; references are
          linked on every card.
        </p>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400">
          <span>Research:</span>
          <a
            href="https://www.awwwards.com/websites/footer-design/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
          >
            Awwwards footers
          </a>
          <a
            href="https://tympanus.net/codrops/tag/typography/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
          >
            Codrops typography
          </a>
          <a
            href="https://github.com/danielpetho/fancy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
          >
            Fancy Components
          </a>
          <a
            href="https://fx.hot.page/split-flap"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
          >
            HotFX
          </a>
          <a
            href="https://github.com/terkelg/awesome-creative-coding"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
          >
            Awesome Creative Coding
          </a>
        </div>

        <div className="mt-10 space-y-14">
          {OPTIONS.map((option) => (
            <section key={option.id} id={`sig-${option.number}`} className="scroll-mt-24">
              <div className="flex flex-wrap items-start justify-between gap-3 border-t border-black/10 pt-5">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] tabular-nums tracking-[0.18em] text-neutral-400">
                      {option.number}
                    </span>
                    <span className="rounded-full border border-black/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-500">
                      {option.category}
                    </span>
                    <h2 className="font-syne text-xl font-extrabold uppercase tracking-tight sm:text-2xl">
                      {option.name}
                    </h2>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
                    {option.description}
                  </p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-400">
                    {option.note}
                  </p>
                </div>

                <div className="flex max-w-none flex-wrap justify-start gap-x-3 gap-y-1 pt-1 sm:max-w-[230px] sm:justify-end">
                  {option.references.map((ref) => (
                    <a
                      key={ref.href}
                      href={ref.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[8px] uppercase tracking-[0.12em] text-neutral-400 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900"
                    >
                      {ref.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="relative mt-4 overflow-hidden rounded-xl border border-black/10 bg-[#fcfbf8]">
                <img
                  src="./img/look-3-trench.webp"
                  alt=""
                  className="pointer-events-none absolute -right-8 bottom-0 h-[170%] w-auto opacity-[0.06]"
                />
                <div className="relative">
                  <MiniFooter>
                    <option.Component />
                  </MiniFooter>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t border-black/10 pt-6">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            Shortlist two or three of these and tell me what to tweak — scale, alignment, how loud
            the hover is, or whether you want it at the end of the colophon or on its own line. I’ll
            only touch the live footer after you choose.
          </p>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400">
            Preview route only · the oversized footer is still on the live site until replaced.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignatureLab;
