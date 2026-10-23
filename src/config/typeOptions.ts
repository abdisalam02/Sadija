/**
 * Type lab: candidate display + body pairings.
 *
 * These are dev-only auditions — production always ships `syne` (Syne /
 * Plus Jakarta Sans). The lab rewrites three CSS variables, so every component
 * on the real page re-skins without knowing the lab exists.
 */

export interface TypeOption {
  id: string;
  /** Short name shown in the switcher. */
  label: string;
  /** Where the pairing sits stylistically — the reason to pick it. */
  note: string;
  /** Display (headline / wordmark) stack. */
  display: string;
  /** Body / UI stack. */
  body: string;
  /** Optical tracking for the monumental hero name. */
  tracking: string;
}

export const DEFAULT_TYPE_ID = 'syne';

export const TYPE_OPTIONS: TypeOption[] = [
  {
    id: 'syne',
    label: 'Syne × Jakarta',
    note: 'Current. Wide, architectural grotesque — the wordmark is a monument.',
    display: '"Syne", sans-serif',
    body: '"Plus Jakarta Sans", system-ui, sans-serif',
    tracking: '-0.025em',
  },
  {
    id: 'bodoni',
    label: 'Bodoni Moda × Inter',
    note: 'Didone couture. Hairline serifs, high contrast — magazine cover energy.',
    display: '"Bodoni Moda", "Playfair Display", serif',
    body: '"Inter", system-ui, sans-serif',
    tracking: '-0.01em',
  },
  {
    id: 'playfair',
    label: 'Playfair × Manrope',
    note: 'Classic editorial. Warmer and softer than Bodoni, still unmistakably fashion.',
    display: '"Playfair Display", "Bodoni Moda", serif',
    body: '"Manrope", system-ui, sans-serif',
    tracking: '-0.015em',
  },
  {
    id: 'fraunces',
    label: 'Fraunces × Schibsted',
    note: 'Warm Nordic. A quirky old-style serif over a Norwegian grotesque.',
    display: '"Fraunces", "Playfair Display", serif',
    body: '"Schibsted Grotesk", system-ui, sans-serif',
    tracking: '-0.02em',
  },
  {
    id: 'archivo',
    label: 'Archivo × Archivo',
    note: 'Swiss modern. Neutral, engineered, quietly expensive.',
    display: '"Archivo", "Syne", sans-serif',
    body: '"Archivo", system-ui, sans-serif',
    tracking: '-0.03em',
  },
  {
    id: 'unbounded',
    label: 'Unbounded × Figtree',
    note: 'Bold fashion-forward. Rounded wide caps, very loud wordmark.',
    display: '"Unbounded", "Syne", sans-serif',
    body: '"Figtree", system-ui, sans-serif',
    tracking: '-0.02em',
  },
  {
    id: 'bricolage',
    label: 'Bricolage × Instrument',
    note: 'Contemporary art-book. Slightly irregular, editorial, not corporate.',
    display: '"Bricolage Grotesque", "Syne", sans-serif',
    body: '"Instrument Sans", system-ui, sans-serif',
    tracking: '-0.03em',
  },
  {
    id: 'schibsted',
    label: 'Schibsted × Schibsted',
    note: 'Oslo native. One family, full range — quiet Scandinavian confidence.',
    display: '"Schibsted Grotesk", "Syne", sans-serif',
    body: '"Schibsted Grotesk", system-ui, sans-serif',
    tracking: '-0.03em',
  },
];

/** One request for every family the lab can show. Loaded only in the lab. */
export const TYPE_FONTS_HREF =
  'https://fonts.googleapis.com/css2' +
  '?family=Syne:wght@700;800' +
  '&family=Bodoni+Moda:wght@400;700;800' +
  '&family=Playfair+Display:wght@400;700;800' +
  '&family=Fraunces:wght@400;700;800' +
  '&family=Archivo:wght@400;500;600;700;800' +
  '&family=Unbounded:wght@400;700;800' +
  '&family=Bricolage+Grotesque:wght@400;500;700;800' +
  '&family=Schibsted+Grotesk:wght@400;500;600;700;800' +
  '&family=Plus+Jakarta+Sans:wght@400;500;600;700' +
  '&family=Inter:wght@400;500;600;700' +
  '&family=Manrope:wght@400;500;600;700' +
  '&family=DM+Sans:wght@400;500;600;700' +
  '&family=Figtree:wght@400;500;600;700' +
  '&family=Instrument+Sans:wght@400;500;600;700' +
  '&display=swap';

const STORAGE_KEY = 'sadija.typeLab.option';

export const findTypeOption = (id: string | null | undefined) =>
  TYPE_OPTIONS.find((option) => option.id === id) ?? null;

export const readStoredTypeId = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const storeTypeId = (id: string) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* private mode — the lab still works for this session */
  }
};

export const clearStoredTypeId = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

/**
 * Write the pairing onto the document and then ask the page to re-measure.
 * The dock and the hero social ranges are both measured, not hard-coded, so a
 * font swap needs one resize tick to re-fit the clone into the nav.
 */
export const applyTypeOption = (option: TypeOption) => {
  const root = document.documentElement;
  root.style.setProperty('--font-display', option.display);
  root.style.setProperty('--font-body', option.body);
  root.style.setProperty('--display-tracking', option.tracking);

  const remeasure = () => window.dispatchEvent(new Event('resize'));

  // Immediate tick (fallback metrics) so nothing looks broken mid-swap…
  window.requestAnimationFrame(remeasure);

  // …then again once the actual faces have painted, because the wordmark's
  // width changes and the dock has to re-fit itself to the nav brand.
  const displayFamily = option.display.match(/"([^"]+)"/)?.[1];
  const bodyFamily = option.body.match(/"([^"]+)"/)?.[1];
  const loads: Array<Promise<unknown>> = [];
  if (document.fonts?.load) {
    if (displayFamily) loads.push(document.fonts.load(`800 96px "${displayFamily}"`));
    if (bodyFamily) loads.push(document.fonts.load(`400 16px "${bodyFamily}"`));
  }

  Promise.allSettled(loads).then(() => {
    remeasure();
    window.setTimeout(remeasure, 150);
  });
};
