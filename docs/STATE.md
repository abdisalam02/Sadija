# STATE.md — Sadija (read first, keep <= 30 lines)

Updated: 2026-10-29

## Now
- Task: Promotional reels moved to `htdocs/ad-studio/campaigns/sadija`.
- Status: `ReelDirector`, overlays, synth cues, and ad tracks removed from this repo; build passes.

## Next (max 3)
1. Decide the final footer credit direction (signature labs are preview-only).
2. Obtain a true full-body source for the lower third of Look 3.
3. Client review of the dock and nav hinge.

## Decisions (don't reopen)
- Type: Syne x Plus Jakarta Sans stays; `?lab=type` was removed.
- Dock: mode D is default; compositor timeline with JS scrub fallback.
- Mobile: viewport-locked app shell, only `#app-scroll` scrolls.
- TikTok Android WebView is scoped out of the compositor path.
- Ad reels live in `htdocs/ad-studio`; this repo is the production site only.

## Open / TODO
- TODO-CLIENT: full-body high-resolution Look 3 source for the hand and jeans.
- TODO-CLIENT: approve final footer credit.

## Recent (max 5, one line each)
- 2026-10-29 — Automated latest YouTube video fetch and live views via /api/latest-video edge route
- 2026-10-29 — Moved the reel director and ad assets to ad-studio; build clean
- 2026-10-29 — Applied workspace harness; archived prior history
