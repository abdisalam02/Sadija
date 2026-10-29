# Sadija Editorial Portfolio — Complete Project Audit & Code-Driven Video Blueprint

> **Client:** SADIJA (High-Fashion & Editorial Creator — Oslo, Norway)  
> **Agency / Creator:** A.Gure (`agure.space`) — Creative Technologist & Principal Design Engineer  
> **Target Output:** High-Converting Instagram Reel / Video Made by Code (9:16, 1080×1920 @ 60 FPS)  
> **Objective:** Showcase bespoke design engineering, kinetic physics, performance craft, and creative technologist capabilities to win high-ticket influencer, fashion, and luxury creator portfolios.

---

## 1. Executive Summary & Project Archetype

| Attribute | Specification |
|---|---|
| **Archetype** | Scandinavian High-Fashion Editorial Lookbook (Toteme / Acne Studios / Dazed Digital) |
| **Tech Stack** | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons |
| **Viewport Philosophy** | Viewport-Locked App Shell (`100dvh`), Inner `#app-scroll`, Static Visual Stage |
| **Performance Target** | 0 Paint Events during scroll transforms, 60–120 FPS on mobile in-app browsers |
| **Core Distinction** | Zero generic Linktree pills, zero SaaS gradient blobs, zero layout shifts |

---

## 2. Design System & Visual Anatomy

### 2.1 Color Palette & Materials
- **Canvas Paper (`#fcfbf8` / `cream-50`):** Warm Nordic unbleached paper surface.
- **Deep Obsidian (`#141518`):** High-contrast editorial ink for typography, borders, and footer elements.
- **Desktop Muted Ink (`#3d3d3d`):** Desktop hero masthead tone before docking into nav.
- **Pure White (`#ffffff`):** Mobile hero masthead text with subtle ambient shadow (`0 2px 18px rgba(20,21,24,0.35)`).
- **Hairline Dividers (`rgba(20, 21, 24, 0.08)` / `border-black/5`):** Razor-sharp architectural separators.
- **Frosted Architectural Glass (`backdrop-blur-xl` + `color-mix`):** Only visible over contrasting imagery; blends into paper seamlessly.

### 2.2 Typography Hierarchy
- **Monumental Display (`font-syne`):** Syne Extra-Bold / Black (800/900), tightly tracked (`--display-tracking: -0.04em`), uppercase monumental masthead (`text-5xl sm:text-7xl lg:text-7xl xl:text-8xl 2xl:text-[7.5rem]`).
- **Body & Micro-Telemetry (`font-sans`):** Plus Jakarta Sans (300/400/500/600/700) for editorial metadata (`OSLO, NORWAY`, social subtitles, colophon).
- **Broadcast Media Typography:** Authentic YouTube watch-page stack (`Roboto, Helvetica Neue, Arial`) with authentic view count and relative publish date.
- **Bespoke Script & Monospace:** Mrs Saint Delafield for ink signatures, JetBrains/IBM Plex Mono style for technical specifications.

---

## 3. The 7 Engineering Masterstrokes (Video Showcase Points)

### Masterstroke 1: Viewport-Locked Shell + Static Stage (Chromium Bug 41395555 Fix)
- **The Problem:** In mobile Chrome and Samsung Internet, scrolling down collapses the address bar, causing `position: fixed` backgrounds to jump and stretch by the toolbar height.
- **The Solution:** The document itself is viewport-locked (`html, body { overflow: hidden; height: 100dvh; }`). All scrolling occurs inside `#app-scroll`.
- **The Result:** The URL bar never animates, and the background artwork stays 100% anchored with zero jumps or bottom gaps.

### Masterstroke 2: 3-Look Synchronized Scroll Dissolve
- **Look 1:** Seated Linen Drape (Rebuilt from 1440×1800 master source, aligned alpha cutout, `x: -19svh, y: -5lvh`).
- **Look 2:** Chambray Denim (Real-ESRGAN x4plus upscale, `x: -14svh, y: -5lvh`).
- **Look 3:** Noir Trench & Optics (SIFT homography aligned 1440×1440 cutout on 2600px canvas, Telea inpainting of camera debug dots, 1px feathered edge, `x: 14svh, y: -5lvh`).
- **Dissolve Timing:** Pure 1.4-second opacity-only crossfade synchronized with scroll progress (`0.00–0.45` Look 1, `0.45–0.80` Look 2, `0.80–1.00` Look 3).

### Masterstroke 3: Compositor-Driven CSS Scroll Timeline Wordmark Dock
- **Architecture:** Mode D native CSS scroll timeline (`timeline-scope: --app-scroll`, `@supports (animation-timeline: scroll())`).
- **Zero Paint Events:** Instead of animating `color` or `text-shadow` (which forces continuous CPU repaints of the 564×96 raster), the clone renders two stacked `.dock-ink` layers (Hero White and Nav Obsidian) crossfaded purely with `opacity`.
- **Pixel-Perfect Handoff:** Measures exact bounding box on `document.fonts.ready` (with 900ms entrance floor). Lands on `#nav-brand` line box and dissolves over the final 10px with zero grey flash.

### Masterstroke 4: 3D Ceiling-Hinged Top-Hung Nav Sheet
- **Spatial Concept:** Not a floating pill. Attached to the top ceiling edge (`fixed top-0`, `rounded-b-[26px]`).
- **Hinge Fold Physics:** Rotates from ceiling plane (`rotateX(-88deg)` edge-on invisible) down into place (`rotateX(0deg)`) using custom `easeDrape` fall-and-settle physics (`p² + 0.055 * settle`).
- **Paper Disappearing Act:** Uses exact `#fcfbf8` surface with zero border and zero drop shadow. Over paper, it is completely invisible; over imagery, `backdrop-blur-xl` frosted glass activates.
- **Cascade Threshold:** Nav social icons use `useScrollReveal` spring thresholds so rapid flicks still trigger staggered cascade arrivals.

### Masterstroke 5: Dual Media Coordination Engine
- **Mutual Exclusivity:** Playing Spotify podcast automatically pauses/mutes YouTube broadcast; enabling YouTube audio automatically pauses Spotify.
- **Intersection Hydration:** YouTube iframe is mounted only when 50% in view (`IntersectionObserver` with root margin `0 0 -50% 0`), keeping hero animation at 120 FPS.
- **Floating Global Player Pill:** Docked bottom-right (`z-50`), auto-detecting active source with synced play/pause and mute controls.

### Masterstroke 6: In-App Browser & TikTok WebView Profiling
- **WebView Optimization:** Automatically detects TikTok in-app browser (`musical_ly|bytedancewebview|aweme|trill`).
- **Degradation Strategy:** Replaces heavy main-thread `backdrop-filter` with 92% opaque paper fill, swaps spring lag with 1:1 linear scroll scrub.

### Masterstroke 7: Desktop RAF Momentum Scroll & 120Hz Mobile Touch
- **Desktop:** Lightweight RequestAnimationFrame lerp momentum scrolling on `#app-scroll`.
- **Mobile:** Bypasses coarse pointers to preserve native 120Hz ProMotion touch scrolling.

---

## 4. Master Collection: 24 Signature Lab Components

| # | Name | Category | Interactive Micro-Mechanic |
|---|---|---|---|
| **#01** | Atelier Seal | Mark | Rotating circular path text stamp, diamond morph on hover |
| **#02** | Ink Signature | Signature | Real Mrs Saint Delafield handwritten script with auto-drawing SVG underline |
| **#03** | Split-Flap Token | Motion | 6 mechanical airport departure tiles flipping through characters |
| **#04** | Scramble Decoder | Digital | Terminal glyph scramble decoding into domain on hover |
| **#05** | Magnetic Monogram | Motion | Cursor-tracking magnetic pull with elastic spring return |
| **#06** | Dot-Matrix Receipt | Digital | Halftone LED dot-matrix shifting half-step on hover |
| **#07** | Woven Garment Label | Object | 100% cotton clothing label with stitched borders and lift tilt |
| **#08** | Barcode Hang Tag | Object | Product hang tag with sweeping red laser scanner line |
| **#09** | Printer's Registration | Print | Crosshair registration target with 90° rotation and breathing crop marks |
| **#10** | Embossed Seal | Object | Debossed cream paper seal lit purely by inset shadows |
| **#11** | Photo-Filled Type | Editorial | Monumental wordmark background-clipped to high-res editorial photography |
| **#12** | Ticket Stub | Object | Perforated admit-one ticket with torn stub angle on hover |
| **#13** | 1984 Macintosh System 1 | Retro | 1-bit Mac window with titlebar pinstripes & interactive **[ CRT Mode ]** scanline toggle |
| **#14** | Atomic Purple GameBoy | Retro | Smoked translucent purple casing, gold PCB traces, IC chip & pulsing emerald SMD LED |
| **#15** | 80s Hi-Fi VFD Deck | Retro | Recessed black glass, glowing cyan/amber segmented readout & dancing 8-bar EQ spectrum |
| **#16** | Teenage Engineering Field | Hardware | Anodized aluminum `#E4E2DD`, 4 Torx screws, 3D mechanical orange push button & LED |
| **#17** | Torn Thermal Receipt | Print | Sawtooth torn edge SVG, thermal POS typography & snappy red rubber approval stamp |
| **#18** | Holographic Foil Sticker | Tactile | Cursor-tracking 3D perspective tilt (`rotateX/Y`) with shifting rainbow foil sheen |
| **#19** | Micro-Vinyl Record | Music | Cardboard LP sleeve; glossy black vinyl disc slides 60% out and spins continuously |
| **#20** | Solari Departure Board | Machine | Charcoal split-hinge flip tiles clattering through characters to lock into creator name |
| **#21** | Nothing OS Dot-Matrix | Cyber | Cyber-minimalist dark pill, exposed telemetry, sweeping Nothing red `#D71921` LED wave |
| **#22** | 3D Peel-Back Sticker | Street | Slap sticker whose top-right corner realistically peels back in 3D to reveal neon link |
| **#23** | Japanese Vinyl Obi Strip | Print | Washi rice-paper sash, fine grid rules, vermilion Hanko seal (`印`) with ink glow |
| **#24** | Embossed Wax Seal | Craft | 3D crimson wax seal with organic melted edge atop unfurling silk charter ribbon |

---

## 5. Code-Driven Video Generation Blueprint (The Instagram Reel)

### 5.1 Video Specifications
- **Format:** 9:16 Vertical (1080 × 1920 px)
- **Frame Rate:** 60 FPS
- **Duration:** 24.0 Seconds
- **Target Platform:** Instagram Reels / TikTok / Freelancer Portfolio Showcase
- **Audio Cue:** Minimal electronic percussion (Teenage Engineering OP-1 synth arpeggio + tactile mechanical clicks)

### 5.2 Scene-by-Scene Storyboard & Camera Script

```
0.0s — 4.0s  │ SCENE 1: THE MONUMENTAL HOOK
             │ • Text Overlay: "Linktrees are dead. This is high-fashion digital architecture."
             │ • Camera: Smooth zoom-in on the hero masthead (Syne 900 `SADIJA`).
             │ • Visual: Crisp white typography popping over the high-res Linen Drape portrait.

4.0s — 8.5s  │ SCENE 2: THE COMPOSITOR DOCK
             │ • Action: User scroll down starts.
             │ • Visual: Monumental wordmark glides upward, smoothly scaling down 6.9x into the nav bar.
             │ • Highlight: 3D Ceiling-Hinged Nav drops down with drape physics.
             │ • Text Callout: "Compositor-driven CSS scroll timeline · 0 Paint Events".

8.5s — 12.5s │ SCENE 3: THE EDITORIAL STAGE & DISSOLVE
             │ • Action: Continuous scroll through the page.
             │ • Visual: Seamless 1.4s crossfade from Linen Drape to Denim Edition to Noir Trench.
             │ • Text Callout: "Viewport-locked 100dvh engine · Zero mobile address bar jump".

12.5s — 17.0s│ SCENE 4: DUAL MEDIA SYNCHRONIZATION
             │ • Action: Tap YouTube broadcast video (plays inline with YouTube watch-page metadata).
             │ • Action: Tap Spotify episode preview.
             │ • Highlight: YouTube smoothly mutes, Spotify takes audio focus, Floating Player pill docks.
             │ • Text Callout: "Unified dual media controller · Mutual audio exclusivity".

17.0s — 21.0s│ SCENE 5: THE HIGH-CRAFT MAKER MARKS
             │ • Rapid Showcase Carousel:
             │   1. Holographic security sticker tilting in 3D with rainbow foil reflection.
             │   2. Teenage Engineering module orange mechanical button click & LED light-up.
             │   3. Micro-vinyl record sliding out of jacket and spinning.
             │   4. 1984 Mac window switching into curved phosphor scanline CRT mode.
             │ • Text Callout: "Bespoke micro-interactions · Built from scratch with code".

21.0s — 24.0s│ SCENE 6: THE CALL TO ACTION / OUTRO
             │ • Visual: A.Gure Minimalist Atelier Seal spinning into focus.
             │ • Text: "A.GURE // CREATIVE TECHNOLOGIST"
             │ • Subtext: "Available for select creator & luxury brand builds. DM or visit agure.space"
```

### 5.3 Programmatic Video Code Architecture (Remotion / HTML Canvas)
When generating this video via Remotion or programmatic capture:
- **`Composition` Dimensions:** `width={1080}`, `height={1920}`, `fps={60}`, `durationInFrames={1440}`.
- **Spring Physics:** `spring({ frame, fps: 60, config: { damping: 200, mass: 0.5, stiffness: 100 } })`.
- **Interpolation Curves:** Custom cubic-bezier `[0.16, 1, 0.3, 1]` for luxury editorial pacing.
- **Render Modes:** WebGL/Canvas shader for holographic glare and CRT scanlines; CSS 3D transforms for nav fold and sticker peel.

---

## 6. Project Directory Reference Map

- [`src/App.tsx`](file:///C:/xampp/htdocs/Sadija/src/App.tsx) — Pinned viewport shell, scroll orchestration, and section flow.
- [`src/components/DockingName.tsx`](file:///C:/xampp/htdocs/Sadija/src/components/DockingName.tsx) — Compositor scroll timeline dock with zero paint events.
- [`src/components/Header.tsx`](file:///C:/xampp/htdocs/Sadija/src/components/Header.tsx) — Top-hung 3D hinge nav sheet with drape physics.
- [`src/components/EditorialStage.tsx`](file:///C:/xampp/htdocs/Sadija/src/components/EditorialStage.tsx) — Fixed background visual stage with locked transform coordinates.
- [`src/components/FeaturedVideo.tsx`](file:///C:/xampp/htdocs/Sadija/src/components/FeaturedVideo.tsx) — YouTube watch-page architecture with late hydration.
- [`src/components/SpotifyPlayer.tsx`](file:///C:/xampp/htdocs/Sadija/src/components/SpotifyPlayer.tsx) — Right-docked podcast capsule with audio preview controller.
- [`src/components/FloatingPlayer.tsx`](file:///C:/xampp/htdocs/Sadija/src/components/FloatingPlayer.tsx) — Global floating media sync pill.
- [`src/components/BusinessCollabs.tsx`](file:///C:/xampp/htdocs/Sadija/src/components/BusinessCollabs.tsx) — Minimalist unboxed booking section with black glass pill.
- [`src/pages/SignatureLab.tsx`](file:///C:/xampp/htdocs/Sadija/src/pages/SignatureLab.tsx) — The 24-signature interactive laboratory (`?lab=signature`).
