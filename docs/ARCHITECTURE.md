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
    - Look 3: `look-3-trench-v3.webp` (Noir Trench - right-hugging: `x: 14svh, y: -5lvh`)
  - Images render at 2600px tall (enough for 3x mobile). Look 1 was rebuilt from its full-resolution 1440×1800 source with the original remove.bg silhouette aligned onto it; look 2 was AI-upscaled (Real-ESRGAN x4plus) from its 433×577 cutout.
  - **Look 3 (fixed)**: the original asset was a 4.25× Real-ESRGAN upscale of a 408×612 preview. The model had merged the sunglasses into a flat black bar, waxed the face and melted the coat/denim, which read as "distorted" at full size. `look-3-trench-v3.webp` aligns a genuine 1440×1440 cutout of the same frame onto the 2600px canvas (SIFT homography, ~1px), keeps the high-res head/torso down to the waist and feathers into the old upscale over the last ~420px. The bottom of the frame (hand/jeans) still comes from the low-res source; a true full-body original would finish it.
  - **Look 3 alpha/marker cleanup**: the ad-hoc upscale had been saved with `cv2.drawKeypoints` debug overlays baked in, and its alpha had been normalised into a 300px-wide soft haze (927k semi pixels, 8k isolated specks) that read as grey dust around the silhouette. v3 removes every small isolated high-saturation/near-white speck (Telea inpaint), rebuilds alpha from the binary silhouette (largest component + hole fill + 1px inner feather) and recolours washed-out edge pixels from the nearest solid pixel. 7,780 semi pixels remain, all within 2px of the edge.
  - `look-3-trench-v2.webp` and the legacy `look-3-trench.webp` are kept only because the dev-only signature labs still reference them.
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
- **D is compositor-only.** The clone is a `.dock-word` grid holding two `.dock-ink` copies of the name — the hero ink (white/soft shadow on mobile, `#3d3d3d` on desktop) and the nav ink (`#141518`, no shadow). Animating `color`/`text-shadow` forced Chrome to repaint the whole 564×96 wordmark every frame; crossfading the two copies with `opacity` is the identical blend but stays on the compositor. A scroll trace confirms **0 paint events on the wordmark** during travel. Never reintroduce `color`/`text-shadow` into `dock-css`.
- The clone lands on the *line box* of `#nav-brand` (`targetTop` is corrected by line height, not ink height) and `#nav-brand` is `font-extrabold` so the clone's 82.4px landed width matches the brand's box exactly. Because the landed clone is a 96px raster downscaled ~6.9×, it dissolves into the crisp real brand over the **10px after** the dock (same position, no ghost, no grey dip).
- `onDistance` reports the measured travel back to `App.tsx`, and `navRange` is derived from it, so the nav finishes arriving on the same scroll pixel the name lands on (desktop 75px, mobile ~392px).
- The clone's resting target is measured with the header's transform temporarily neutralised (`style.transform = 'none'`), so the dock no longer needs to know how the nav animates. Any future nav motion stays safe.
- Mobile nav reveal is mode-aware so an empty sheet never floats ahead of the brand (B: 255–355, E: 240–350, A/C/D: `[distance − 90, distance]`).
- Lab-only comparison: `?lab=dock` opens the real page with a small Dock switcher in the bottom-left.

### 1c. Top-Hung Nav Sheet (`Header.tsx`)
- The nav is a **tab attached to the viewport's top edge**, not a floating pill: `fixed top-0`, square top corners, `rounded-b-[26px]`, `bg-cream-50/90` + `backdrop-blur-xl`. Top padding is `calc(10px + env(safe-area-inset-top))` so the glass still reaches the edge on notched phones.
- **The surface is the page's own paper colour (`#fcfbf8`) with no hairline border and no drop shadow.** Blending a colour over itself is a no-op, so while the paper or a white card is behind the sheet the card is *invisible* — only the wordmark and the icon chips read, and the page looks like it has no chrome at all. The tint and blur only become visible when real imagery (the stage photo, a media card) passes underneath, which is when the tab needs to exist. The earlier `bg-white/90` + `border-neutral-200/70` + shadow was what made the card "stick out" over the paper: a whiter-than-paper fill, a grey outline and a soft shadow all around a surface that should have disappeared. Do not reintroduce a border or shadow here.
- **Reveal = hinge fold, not a slide.** `navProgress` (0→1 over `navRange`) is eased by `easeDrape` (a `p²` fall plus a 5.5% settle bump) and mapped to `rotateX(-88deg → 0)` with `transformPerspective: 1400` and `transformOrigin: top center`. At 0 the sheet lies flat in the ceiling plane, so it is edge-on and invisible; it then tips down and hangs. `opacity` ramps 0→1 over the first 8% only to kill the 1px sliver.
- The fold is **scroll-linked, never time-based**, so it cannot lag behind the finger. Only `transform` + `opacity` animate.
- Nav social icons use `useScrollReveal` — a threshold + spring, not a scrubbed opacity. Scrubbing meant a fast flick snapped every icon on in one frame; now they cascade (`delay = 0.08 + index × 0.09`) even if the scroll jumped. Hysteresis (`start − 120`) stops flicker at the boundary, and hidden icons are `pointer-events: none`.

### 1d. Desktop Layout
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
  - `?lab=footer` - five quiet colophon placements (bracket line, signature, monogram, glass pill, hover reveal).
  - `?lab=signature` - twelve distinct signature studies: atelier seal, ink signature, split-flap token, scramble decoder, magnetic monogram, dot-matrix receipt, woven garment label, barcode hang tag, printer's registration mark, embossed seal, photo-filled type, ticket stub.
  - Both labs include hover/click previews and reference links (Awwwards, Codrops, Fancy Components, HotFX, textmode.js, Dribbble).

### 6. Typography
- Fonts are declared in exactly three CSS variables in `src/index.css`: `--font-display` (Syne 700/800), `--font-body` (Plus Jakarta Sans), `--font-signature` (Mrs Saint Delafield), plus `--display-tracking` for the monumental wordmark. `tailwind.config.js` maps `font-syne` → `var(--font-display, "Syne", sans-serif)` and `font-sans` → `var(--font-body, …)`, and `body` uses `var(--font-body)`, so changing a stack in one place re-typesets the whole page.
- The shipping pairing is **Syne × Plus Jakarta Sans**. An eight-pairing audition lab (`?lab=type`, Bodoni/Playfair/Fraunces/Archivo/Unbounded/Bricolage/Schibsted) was built and reviewed, then removed at the client's request — the alternatives are not wanted. Recoverable from commit `78c3b9e` if that ever changes.
- `--display-tracking` is applied to both `#client-name-title` and `#nav-brand`, so the clone's letter-spacing scales proportionally into the nav and the landed width still matches exactly.
