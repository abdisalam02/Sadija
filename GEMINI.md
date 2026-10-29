# GEMINI.md: Sadija (SADIJA editorial portfolio)

Project rules only. Workspace rules live in the root `AGENTS.md`. **This file wins on project conflicts.**
Canonical rules file. `AGENTS.md` points here; `CLAUDE.md` imports this file.

## 0. Start every task here
1. Read `docs/STATE.md` (resume point), then `docs/ARCHITECTURE.md` (component map and invariants).
2. Open files strictly by line range. Never read a file over 500 lines whole.
3. Verify with `npx tsc --noEmit`; run `npm run build` only for structural changes.
4. Update `docs/STATE.md` (max 5 lines). Older history lives in `docs/archive/` and is not read.

| File | Read when |
|---|---|
| `docs/STATE.md` | always, first |
| `docs/ARCHITECTURE.md` | always, second |
| `docs/DESIGN.md` | any visual, layout, type, or motion change |
| `docs/MOBILE_STATIC_BACKGROUND.md` | stage, viewport, or address-bar issues |
| `docs/PROJECT_AUDIT_VIDEO_SPEC.md` | reel storyboard or ad work |

## 1. Identity and scope
- Product: single-page editorial portfolio for creator SADIJA (Oslo).
- Stack: React 18, Vite, TypeScript, Tailwind, Framer Motion.
- Entry: `src/App.tsx`; the document is viewport-locked and only `#app-scroll` scrolls.
- Labs and tools live behind query parameters (`?reel=true`, `?lab=dock`, `?dock=a`-`e`).

## 2. Hard boundaries
- Keep the static stage outside the scroll container; never switch it to `position: fixed`.
- Keep stage heights in `lvh`/`svh`; never use `100vh` or `min-h-screen`.
- Dock CSS animates transform and opacity only. Never animate `color` or `text-shadow` on the moving wordmark.
- Do not reintroduce a border or shadow on the top-hung nav sheet.
- Do not cross-import from other workspace projects.

## 3. Commands
| Task | Command |
|---|---|
| Dev | `npm run dev -- --host --port 5173` |
| Type check | `npx tsc --noEmit` |
| Build | `npm run build` |
| Preview | `npm run preview` |

## 4. Data and security invariants
- Static client only; no secrets or server keys in the bundle.
- Client identity and links live in `src/config/clientConfig.ts`.
- External embeds are limited to Spotify and YouTube; no trackers.

## 5. Design
- Read `docs/DESIGN.md` before UI work: Scandi lookbook, monumental type, full-bleed imagery.
- No SaaS gradients, floating blobs, Linktree pill stacks, bento grids, or buzzwords.
- 375px hard limit, zero horizontal overflow, 44px touch targets.

## 6. Stop gates
- `git push`, deploy, or publishing.
- New dependencies, fonts, audio tracks, or unlicensed assets.
- Reel soundtracks or client copy without a recorded licence.
- Deleting lab code or legacy look assets that labs still reference.
- Changing the client's contact details or links.
