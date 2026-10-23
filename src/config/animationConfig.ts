export type DockMode = 'A' | 'B';

/**
 * A = one velocity-smoothed scroll spring (continuous scrub).
 * B = two-phase: follow the page, then a timed spring into the nav.
 *
 * Override for testing with ?dock=a or ?dock=b without changing this default.
 */
export const DEFAULT_DOCK_MODE: DockMode = 'A';
