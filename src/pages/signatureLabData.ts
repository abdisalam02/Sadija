import React from 'react';
import {
  BarcodeCredit,
  DotMatrixCredit,
  EmbossedSealCredit,
  MagneticCredit,
  PhotoTypeCredit,
  RegistrationCredit,
  ScrambleCredit,
  SealCredit,
  SignatureCredit,
  SplitFlapCredit,
  TicketCredit,
  WovenLabelCredit,
} from '../components/SignatureLabOptions';
import {
  MacSystem1Credit,
  AtomicPurplePcbCredit,
  HiFiVfdCredit,
  TeenageFieldCredit,
  ThermalReceiptCredit,
  HolographicFoilCredit,
  MicroVinylCredit,
  SplitFlapSolariCredit,
  NothingDotMatrixCredit,
  PeelStickerCredit,
  JapaneseObiCredit,
  WaxSealCharterCredit,
} from '../components/signatures';

export interface Reference {
  label: string;
  href: string;
}

export interface SignatureOption {
  id: string;
  number: string;
  wave: 1 | 2;
  category: string;
  name: string;
  description: string;
  note: string;
  references: Reference[];
  Component: React.FC<any>;
}

export const WAVE_1_OPTIONS: SignatureOption[] = [
  {
    id: 'seal',
    number: '01',
    wave: 1,
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
    wave: 1,
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
    wave: 1,
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
    wave: 1,
    category: 'Digital',
    name: 'Scramble decoder',
    description:
      'A terminal-style credit that resolves from random glyphs into domain on hover. Precise, technical, and very “developer signature”.',
    note: 'Hover / focus → decodes to domain; leaving resets to shortName.',
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
    wave: 1,
    category: 'Motion',
    name: 'Magnetic monogram',
    description:
      'The wordmark pulls a few pixels toward the cursor and springs back. No visible chrome — just a micro-interaction that rewards attention.',
    note: 'Move the cursor over the monogram → the letters lean toward it.',
    references: [
      { label: 'Hover interactions — Codrops', href: 'https://tympanus.net/codrops/tag/hover/' },
    ],
    Component: MagneticCredit,
  },
  {
    id: 'dot-matrix',
    number: '06',
    wave: 1,
    category: 'Digital',
    name: 'Dot-matrix receipt',
    description:
      'Creator rendered as a halftone dot grid, like an LED display or thermal receipt. The dots shift a half-step on hover, animating the surface without changing the mark.',
    note: 'Hover → the dot grid shifts; the credit stays perfectly still.',
    references: [{ label: 'textmode.js', href: 'https://code.textmode.art' }],
    Component: DotMatrixCredit,
  },
  {
    id: 'woven-label',
    number: '07',
    wave: 1,
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
    wave: 1,
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
    wave: 1,
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
    wave: 1,
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
    wave: 1,
    category: 'Editorial',
    name: 'Photo-filled type',
    description:
      'Wordmark filled with one of Sadija’s photographs instead of a flat colour. The credit literally carries the site’s imagery, and the crop pans on hover.',
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
    wave: 1,
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

export const WAVE_2_OPTIONS: SignatureOption[] = [
  {
    id: 'mac-system1',
    number: '13',
    wave: 2,
    category: 'Retro Special A',
    name: '1984 Macintosh System 1 / CRT Retro Window',
    description:
      'Authentic 1-bit retro computer window with 1px horizontal titlebar pinstripes, top-left square close box, and hard 3px drop-shadow. Includes an interactive toggle that switches into a curved glowing phosphor CRT screen with authentic scanlines.',
    note: 'Click [ CRT ] or close box → toggles green phosphor CRT monitor curvature with scanlines.',
    references: [
      { label: 'System 1 UI — Folklore', href: 'https://www.folklore.org' },
      { label: 'CRT Screen Effects — CSS Tricks', href: 'https://css-tricks.com/old-timey-terminal-styling/' },
    ],
    Component: MacSystem1Credit,
  },
  {
    id: 'atomic-purple',
    number: '14',
    wave: 2,
    category: 'Retro Special B',
    name: '90s "Atomic Purple" Translucent GameBoy PCB',
    description:
      'Smoked clear purple polycarbonate shell revealing intricate gold immersion PCB traces, micro-resistors, mounting posts, and a central IC chip with creator silkscreen. Features an active SMD LED power indicator.',
    note: 'Hover → LED pulses bright emerald green ("POWER ON // 3.3V") and gold circuit traces illuminate.',
    references: [
      { label: 'Game Boy Color Teardown — iFixit', href: 'https://www.ifixit.com' },
      { label: 'Clear Tech Aesthetic — Raygun', href: 'https://cari.institute/aesthetics/clear-tech' },
    ],
    Component: AtomicPurplePcbCredit,
  },
  {
    id: 'hifi-vfd',
    number: '15',
    wave: 2,
    category: 'Retro Special C',
    name: '80s Hi-Fi VFD (Vacuum Fluorescent Display) Deck',
    description:
      'Recessed pitch-black glass display window inside a brushed gunmetal aluminum bezel, featuring glowing cyan (#00F5D4) and amber (#FF6B00) segmented typography with an active 8-bar audio spectrum EQ analyzer.',
    note: 'Hover → 8-bar spectrum EQ dances dynamically and the digital display scrolls creator marquee.',
    references: [
      { label: 'Vintage Hi-Fi VFD — Vintage Audio', href: 'https://vintage-audio-heritage.fr' },
      { label: 'Winamp Spectrum UI', href: 'https://webamp.org' },
    ],
    Component: HiFiVfdCredit,
  },
  {
    id: 'teenage-field',
    number: '16',
    wave: 2,
    category: 'Hardware',
    name: 'Teenage Engineering "Field" Module',
    description:
      'Machined anodized aluminum faceplate (#E4E2DD) with Torx T6 star screws, technical silkscreen micro-labels, and a tactile 3D mechanical safety-orange (#FF4F00) push button that depresses with authentic spring action.',
    note: 'Click / Hover → mechanical orange push-button depresses and illuminates orange status LED dot.',
    references: [
      { label: 'Teenage Engineering OP-1 Field', href: 'https://teenage.engineering/products/op-1' },
      { label: 'Industrial Design — Dieter Rams', href: 'https://vitsoe.com' },
    ],
    Component: TeenageFieldCredit,
  },
  {
    id: 'thermal-receipt',
    number: '17',
    wave: 2,
    category: 'Print & Paper',
    name: 'Torn Thermal Receipt Stub',
    description:
      'Off-white thermal paper with custom SVG jagged sawtooth torn edges on top and bottom, faded itemized POS receipt typography, and a vertical barcode strip. On hover, stamps a tilted distressed red rubber stamp across the slip.',
    note: 'Hover → slams a tilted -8° distressed red ink rubber stamp [ APPROVED // CREATOR ] with spring bounce.',
    references: [
      { label: 'Thermal Paper Art — Are.na', href: 'https://www.are.na' },
      { label: 'Brutalist Receipts — Godly', href: 'https://godly.website' },
    ],
    Component: ThermalReceiptCredit,
  },
  {
    id: 'holographic-foil',
    number: '18',
    wave: 2,
    category: 'Tactile',
    name: 'Holographic Foil Security Sticker',
    description:
      'Die-cut metallic security sticker with chamfered corners and micro-guilloche security pattern SVG. Features real-time cursor-tracking 3D tilt with dynamic rainbow holographic foil glare shifting across the surface.',
    note: 'Move cursor over badge → real-time 3D perspective tilt with shifting iridescent rainbow glare.',
    references: [
      { label: 'Guilloche Patterns — Security Graphics', href: 'https://en.wikipedia.org/wiki/Guilloch%C3%A9' },
      { label: 'Holographic Card Shaders — Codrops', href: 'https://tympanus.net' },
    ],
    Component: HolographicFoilCredit,
  },
  {
    id: 'micro-vinyl',
    number: '19',
    wave: 2,
    category: 'Music & Analog',
    name: 'Interactive Micro-Vinyl Record & Jacket',
    description:
      'Miniature square cardboard album cover sleeve (48×48px) with Swiss modernist typography paired with a glossy black vinyl LP with concentric micro-grooves and center spindle label.',
    note: 'Hover → glossy black vinyl record slides 60% out of sleeve and spins continuously.',
    references: [
      { label: 'Vinyl Disc CSS Animation — CodePen', href: 'https://codepen.io' },
      { label: 'Swiss Album Covers — Museum of Design Zurich', href: 'https://www.museum-gestaltung.ch' },
    ],
    Component: MicroVinylCredit,
  },
  {
    id: 'split-flap-solari',
    number: '20',
    wave: 2,
    category: 'Motion Machine',
    name: 'Mechanical Split-Flap Departure Board (Solari Board)',
    description:
      'Row of dark matte charcoal mechanical flip tiles (#161618), each with a horizontal center split hinge line, side hinge notches, and upper/lower lighting depth. Clatters and cascades through letters.',
    note: 'Hover / Click → tiles rapidly clatter and cycle through characters before settling into creator mark.',
    references: [
      { label: 'Solari di Udine Split-Flap History', href: 'https://solaridiudine.it' },
      { label: 'Departure Board Motion — HotFX', href: 'https://fx.hot.page/split-flap' },
    ],
    Component: SplitFlapSolariCredit,
  },
  {
    id: 'nothing-dot-matrix',
    number: '21',
    wave: 2,
    category: 'Cyberminimal',
    name: 'Nothing OS Dot-Matrix LED Array',
    description:
      'Cyber-minimalist dark pill housing exposed telemetry (59.91°N · OSLO) and an exposed LED matrix array. Hovering ignites a signature Nothing red (#D71921) and bright white sweeping wave animation.',
    note: 'Hover → triggers a sweeping red (#D71921) and white LED matrix wave across the display.',
    references: [
      { label: 'Nothing OS Glyph Design', href: 'https://nothing.tech' },
      { label: 'Dot Matrix Typography — Fonts in Use', href: 'https://fontsinuse.com' },
    ],
    Component: NothingDotMatrixCredit,
  },
  {
    id: 'peel-sticker',
    number: '22',
    wave: 2,
    category: 'Street Art',
    name: 'The "Peel-Back" Street Art / Skate Sticker',
    description:
      'High-contrast street style slap sticker ("HELLO // BUILT BY") that looks adhered to the footer surface. Hovering realistically peels the top-right corner back in 3D to reveal a bright neon under-layer with a visit link.',
    note: 'Hover → top-right corner peels backwards in 3D, exposing a hidden neon lime underlayer.',
    references: [
      { label: 'Street Art Slap Stickers — Brooklyn Street Art', href: 'https://brooklynstreetart.com' },
      { label: 'CSS 3D Paper Peel Effect — Codrops', href: 'https://tympanus.net' },
    ],
    Component: PeelStickerCredit,
  },
  {
    id: 'japanese-obi',
    number: '23',
    wave: 2,
    category: 'Editorial Print',
    name: 'Japanese Vinyl "Obi Strip" & Vermilion Hanko Seal',
    description:
      'Inspired by Japanese record Obi strips and book colophons. Warm washi rice-paper sash with 1px structural grid lines, vertical Japanese typography, and a traditional carved vermilion Hanko seal SVG (印).',
    note: 'Hover → sash slides horizontally and vermilion Hanko seal illuminates with soft ink bleed.',
    references: [
      { label: 'Japanese Vinyl Obi Design Guide', href: 'https://daily.bandcamp.com' },
      { label: 'Traditional Japanese Hanko Seals', href: 'https://en.wikipedia.org/wiki/Seal_(East_Asia)' },
    ],
    Component: JapaneseObiCredit,
  },
  {
    id: 'wax-seal-charter',
    number: '24',
    wave: 2,
    category: 'Bespoke Craft',
    name: 'Embossed Crimson Wax Seal & Charter Ribbon',
    description:
      'Hyper-detailed custom SVG 3D embossed crimson wax seal with organic melted edge, inner rope ring, and maker monogram, resting atop a notched silk charter ribbon. On hover, seal rotates and ribbon unfurls horizontally.',
    note: 'Hover → wax seal rotates 12° and silk charter ribbon unfurls horizontally revealing full inscription.',
    references: [
      { label: 'Wax Seal Calligraphy Art', href: 'https://dribbble.com/tags/wax-seal' },
      { label: 'Ceremonial Charter Ribbons — Archive', href: 'https://loc.gov' },
    ],
    Component: WaxSealCharterCredit,
  },
];

export const ALL_OPTIONS: SignatureOption[] = [...WAVE_1_OPTIONS, ...WAVE_2_OPTIONS];
