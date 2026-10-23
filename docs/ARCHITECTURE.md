# Sadija Portfolio — Architecture & Component Map

## Overview
High-fashion editorial linktree/portfolio for Scandinavian creator **SADIJA** (Oslo, Norway). Built with React 18, Vite, TypeScript, Tailwind CSS, and Framer Motion.

## Core Architecture

### 1. App Shell, Static Stage & Content Stream
- **App Shell (`App.tsx`)**: the document itself is viewport-locked (`html`/`body`: `overflow: hidden`). The only scrolling element is `#app-scroll` (`h-full overflow-y-auto`).
  - This is deliberate: Android Chrome / Samsung Internet shift `position: fixed` layers by the address-bar height when the toolbar collapses (Chromium issue 41395555). Keeping the document non-scrollable stops the toolbar from collapsing at all, so the artwork can never slide/snap during scroll.
- **Static Stage (`EditorialStage.tsx`)**:
  - `absolute top-0 left-0 w-full lg:w-[50vw] h-[100lvh] z-20 pointer-events-none`, rendered inside the `100dvh` shell but **outside** the scroll area.
  - No `position: fixed`, no scroll-linked transforms on the stage itself.
  - 3-look synchronized scroll dissolve:
    - Look 1: `look-1-linen.webp` (Linen Drape - elbow touching left screen edge: `x: -19svh, y: -5lvh`)
    - Look 2: `look-2-denim.webp` (Chambray Denim - relaxed center-right: `x: -14svh, y: -5lvh`)
    - Look 3: `look-3-trench-v2.webp` (Noir Trench - right-hugging: `x: 14svh, y: -5lvh`)
  - Images render at 2600px tall (enough for 3x mobile). Look 1 was rebuilt from its full-resolution 1440×1800 source with the original remove.bg silhouette aligned onto it; look 2 was AI-upscaled (Real-ESRGAN x4plus) from its 433×577 cutout.
  - **Look 3 (fixed)**: the original asset was a 4.25× Real-ESRGAN upscale of a 408×612 preview. The model had merged the sunglasses into a flat black bar, waxed the face and melted the coat/denim, which read as "distorted" at full size. The new `look-3-trench-v2.webp` aligns a genuine 1440×1440 cutout of the same frame onto the 2600px canvas (SIFT homography, ~1px), keeps the high-res head/torso down to the waist and feathers into the old upscale over the last ~420px. The bottom of the frame (hand/jeans) still comes from the low-res source; a true full-body original would finish it.
  - The legacy `look-3-trench.webp` is kept only because the dev-only signature labs still reference it.
  - Image heights stay in `lvh` (`108/115/128lvh`) so the photo is never resized by dynamic viewport chrome.
  - Transition: pure 1.4s opacity-only crossfade (no scale/blur jumps).
- **Content Stream (`App.tsx`)**:
  - Wrapped in `#app-scroll`; `pt-[44svh] ... z-30` starts cleanly below the model portrait on mobile.
  - `useScroll` uses `container: scrollRef` (the window never scrolls).
  - Sections are normal editorial flow (not sticky) to match the shipped layout.

**Mobile static-background audit:** the full pattern, height-unit rules, audit measurements and a copyable minimal example are in [`docs/MOBILE_STATIC_BACKGROUND.md`](./MOBILE_STATIC_BACKGROUND.md).

### 1b. Hero Name Dock (`DockingName.tsx`)
- A fixed, aria-hidden clone of `#hero-name-text` is measured against `#nav-brand`; the real `<h1>` stays in flow (and is hidden once the clone is ready). The header nav reveals on a scroll range and the clone hands off to the nav brand.
- Five modes, selected with `?dock=a` … `?dock=e`; the default is **D** (`src/config/animationConfig.ts`):
  - **A** — one continuous `useSpring` on `scrollY` drives x/y/scale/colour together (glides on flings).
  - **B** — follows the page at full size, then a time-based spring docks it over the last ~110px.
  - **C** — stays full size until just below the nav (~20px), then collapses into it.
  - **D** — native CSS scroll-driven animation on the `#app-scroll` timeline (`#app-shell` sets `timeline-scope`) on desktop. Mobile (and browsers without scroll timelines) use `DockDScrub`: the same linear track, but with a tight spring on x/scale only — y stays locked to scroll, so touch-scroll steps cannot make the size visibly jump.
  - **E** — no clone: the in-flow name darkens/fades as the nav brand fades in (pure crossfade).
- The mobile hero text-shadow fades out with the dock (58–92% of the range) so the wordmark is clean once it reaches the nav; there is no glow behind the final nav brand.
- Mobile nav reveal is mode-aware so an empty pill never floats ahead of the brand (B: 255–355, E: 240–350, A/C/D: 355–440).
- Lab-only comparison: `?lab=dock` opens the real page with a small Dock switcher in the bottom-left.

### 1c. Desktop Layout
- The right column is capped at `860px` (`1040px` at 2xl) so cards stop stretching on ultrawide screens.
- Hero socials become a 3-up card grid at `xl` (stacked below that); each card puts the icon top, label/subtitle bottom, arrow top-right.
- Spotify becomes a full-width podcast panel at `lg` (single episode column; two columns at `2xl`).
- YouTube keeps its 16:9 card but uses the wider column and larger title; business contact uses a two-column statement/actions layout at `xl`.
- Hero name steps 72 → 96 → 120px to fit the column at 1024 / 1280 / 1920.

### 2. Media Coordination (`MediaContext.tsx` & `FloatingPlayer.tsx`)
- Centralized audio and video controller:
  - **Spotify**: 30s preview playback for episodes via HTMLAudioElement (volume: `0.35`).
  - **YouTube**: Iframe controller via postMessage (`playVideo`, `pauseVideo`, `mute`, `unMute`).
  - **Mutual Exclusivity**: Playing Spotify mutes YouTube; activating YouTube pauses Spotify.
- **Floating Player (`FloatingPlayer.tsx`)**:
  - Dynamic bottom-right pill (`z-50`).
  - Displays currently playing Spotify podcast track or YouTube video with Play/Pause and Mute toggles.

### 3. Sections
1. **Hero Masthead**:
   - `OSLO, NORWAY` metadata kicker.
   - `SADIJA` in monumental Syne font (white text with deep drop shadow).
   - Social links stack with interleaved fading transparency.
2. **YouTube Broadcast (`FeaturedVideo.tsx`)**:
   - Full-viewport tap-to-play/pause transparent overlay with centered pause indicator.
   - Icon-only header audio mute toggle (`Volume2` / `VolumeX`).
   - Red official YouTube play icon.
3. **Spotify Podcast (`SpotifyPlayer.tsx`)**:
   - Right-docked glass card (`w-[72%] max-w-[320px]`).
   - Episode 1: *Am I The A**Hole?* (`podcast_preview.mp3`).
   - Episode 2: *introverts are more annoying than extroverts..* (`episode2_preview.mp3`).
4. **Brand Collaborations (`BusinessCollabs.tsx`)**:
   - Minimalist unboxed layout with hairline dividers.
   - Black frosted glass pill for direct mail: `sadijagure@gmail.com`.
   - One-click copy email button.

### 4. Smooth Scrolling (`useSmoothScroll.ts`)
- Lightweight RAF lerp momentum scroll on desktop wheels, applied to `#app-scroll` (not `window`).
- Preserves native 120Hz ProMotion touch scrolling on mobile devices.
- Deep links (`?section=`, hash anchors) and the footer "Back to Top" control scroll the app shell.

### 5. Footer (`Footer.tsx`) & Signature Labs
- Live footer is the original translucent social row + colophon, still inside the content column over the page background. "Back to Top" scrolls `#app-scroll`.
- The oversized A.Gure sign-off was reverted — it competed with the site's imagery and glass surfaces. A final small credit is pending a direction.
- Preview-only labs (not linked from the site; they re-enable document scrolling with `useUnlockDocumentScroll`):
  - `?lab=footer` — five quiet colophon placements (bracket line, signature, monogram, glass pill, hover reveal).
  - `?lab=signature` — twelve distinct signature studies: atelier seal, ink signature, split-flap token, scramble decoder, magnetic monogram, dot-matrix receipt, woven garment label, barcode hang tag, printer's registration mark, embossed seal, photo-filled type, ticket stub.
  - Both labs include hover/click previews and reference links (Awwwards, Codrops, Fancy Components, HotFX, textmode.js, Dribbble).
