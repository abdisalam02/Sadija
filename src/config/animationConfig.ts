export type DockMode = 'A' | 'B' | 'C' | 'D' | 'E';

/**
 * A = one velocity-smoothed scroll spring (continuous scrub).
 * B = two-phase: follow the page, then a timed spring into the nav.
 * C = late threshold morph: full size until just below the nav, then collapse in.
 * D = native CSS scroll-driven animation (compositor timeline).
 * E = crossfade between the in-flow hero name and the nav brand.
 *
 * Override for testing with ?dock=a ... ?dock=e without changing this default.
 */
export const DEFAULT_DOCK_MODE: DockMode = 'A';
