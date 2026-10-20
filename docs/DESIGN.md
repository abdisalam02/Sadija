# DESIGN.md: Universal High-Craft Editorial & Creator Design Standard

This document is the absolute visual and architectural law for this repository.
Every view, transition, and component must feel like an interactive digital issue of **Toteme, Acne Studios, Dazed Digital, or Katie Hunter** — never like a generic Linktree, SaaS landing page, or AI-generated template.

---

## 1. Absolute Banned AI Tropes (Zero Tolerance)
- **NO SaaS Gradients:** Never use `bg-gradient-to-r`, purple/indigo/cyan glows, or gradient text masks.
- **NO Floating Decorative Blobs:** Never render blurred background circles, neon orbs, or ambient mesh blobs behind content.
- **NO Cutout Drop-Shadow Stickers:** Do not use transparent PNG cutouts with heavy `drop-shadow` floating in empty space. Use full-bleed or sharply cropped editorial frames (`perfect1`–`perfect4`).
- **NO Generic Linktree Pill Stacks:** Never render a centered column of identical rounded buttons with social icons on the left.
- **NO Uniform Bento Grids:** Do not put widgets inside uniform rounded cards with icon badges.
- **NO AI Copywriting Slop:** Banned words: *elevate, supercharge, seamless, bespoke, unleash, empower, craft, digital creator, welcome to my hub, explore my world*.
- **NO Glassmorphism on Content Cards:** Content cards and sheets must be solid, opaque tonal surfaces that match the active image palette. *(Exception: The docked top navigation bar MUST use refined architectural glass — see Section 3.2).*

---

## 2. Universal Aesthetic Archetypes
Every project must lock into one primary archetype or blend its typography/surface rules intentionally via `clientConfig`:

### Archetype A: Scandi Lookbook (Sadija Gure Default — Toteme / Acne Studios)
- **Surface Philosophy:** Adaptive tonal canvas that melts seamlessly between deep editorial hues sampled directly from the photography (`perfect1`–`perfect4`).
- **Typography:** Monumental grotesque display (`Syne`, `Instrument Sans`, or tightly tracked `Plus Jakarta Sans` Black uppercase) paired with technical monospace micro-labels (`[ 01 / 04 ]`).
- **Geometry:** Sharp architectural hairlines (`1px solid rgba(255,255,255,0.12)`), full-bleed imagery, zero rounded corners on structural grids (`rounded-none`), subtle `rounded-t-2xl` only on sliding overlapping sheet cards.

### Archetype B: Wabi-Sabi Organic (Editorial Monograph / Print Archive)
- **Palette:** Linen cream (`#f7f4ee`), raw clay (`#c28d75`), warm stone (`#262220`).
- **Typography:** `Cormorant Garamond` or `Playfair Display` (italicized display accents) + clean sans body.

### Archetype C: Stark Brutalist Index (Swiss Grid / Avant-Garde Fashion)
- **Palette:** Pitch obsidian (`#0d0f0e`), chalk white (`#fafafa`), exposed hairline rules.
- **Typography:** High-density monospace index tables with oversized hover states.

---

## 3. The 4 Mandatory Spatial & Kinetic Mechanics

### 3.1 Dominant Visual Stage (`perfect1`, `perfect2`, `perfect3`, `perfect4`)
- Photography is the primary interface—not decoration.
- The active image (`perfect1` through `perfect4`) must occupy **55% to 65% of the viewport on mobile (`h-[60dvh]`)** and a **full-height sticky 6-column stage (`h-dvh`) on desktop**.
- As the user scrolls from one stacked card chapter to the next, the active image must transition using a **cinematic editorial crossfade + subtle scale settle** (`scale: 1.06 -> 1.0`, `opacity: 0 -> 1` over `800ms cubic-bezier(0.16, 1, 0.3, 1)`).
- Apply a subtle bottom-and-edge vignette gradient matching the active `--canvas-bg` CSS variable so the edges of `perfect1–4` melt into the page background without harsh rectangular seams.

### 3.2 Scroll-Linked Wordmark-to-Glass-Nav Morph
- **Initial State (Scroll = 0):** The client's name (`SADIJA GURE`) renders as a monumental editorial masthead (`text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.85]`) positioned prominently over/below the hero visual break.
- **Scrolled State (Scroll > 120px):** Do NOT keep two separate titles. As the user scrolls, the monumental masthead smoothly interpolates upward, scales down (`scale: 1 -> 0.28` or smoothly morphs via Framer Motion `useScroll`/`useTransform` or `layoutId`), and locks into the **Docked Glass Navigation Bar**.
- **Architectural Glass Nav Spec:**
  - `position: fixed; top: 0; left: 0; right: 0; z-index: 50;`
  - `backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%);`
  - `background-color: color-mix(in srgb, var(--canvas-bg) 55%, transparent);`
  - `border-bottom: 1px solid rgba(255, 255, 255, 0.10);`
  - Contains: Morphing Brand Wordmark (left), active look indicator `[ 01 / 04 ]` (center), and Share trigger (right).

### 3.3 Stacked Card-Over-Card Curtain Scroll (No Standard Scrolling Lists)
- The content stream MUST NOT scroll like a normal long webpage.
- Divide the page into **4 Sticky Editorial Chapters (Cards)** that correspond 1-to-1 with `perfect1`, `perfect2`, `perfect3`, and `perfect4`:
  - **Card 01 (`perfect1`):** Identity, Bio Manifesto & Numbered Social Index (`01 IG`, `02 TIKTOK`, `03 YOUTUBE`).
  - **Card 02 (`perfect2`):** Featured Cinema Viewport (16:9 YouTube Film) with editorial metadata.
  - **Card 03 (`perfect3`):** Curated Soundscape (Spotify Studio Capsule) & Editorial Archive Notes.
  - **Card 04 (`perfect4`):** Direct Bookings, Press/Agency Representation, & Colophon Footer.
- **Card Sliding Physics:**
  - Each card uses `position: sticky` with a top offset (`top: 56px` on desktop, `top: 48dvh` on mobile below the sticky image stage) and ascending `z-index` (`z-10`, `z-20`, `z-30`, `z-40`).
  - As the user scrolls, **Card N+1 physically slides up from the bottom and covers Card N** like a heavy cardstock page sliding over the previous one.
  - The card being covered (`Card N`) must subtly scale down (`scale: 1 -> 0.96`) and dim (`brightness: 1 -> 0.7`) as the new card slides over it.
  - Each card surface uses `background-color: var(--canvas-bg)` with a crisp `1px solid rgba(255,255,255,0.16)` top specular edge and subtle upward shadow (`0 -24px 48px rgba(0,0,0,0.45)`) so the overlap feels tactile and physical.

### 3.4 Seamless Color-Melt Engine
- The root `--canvas-bg`, `--canvas-surface`, `--text-primary`, and `--text-muted` CSS variables must dynamically interpolate based on scroll progress across the 4 cards.
- Every card surface, image edge vignette, and the translucent glass nav bar must inherit `--canvas-bg` so the entire viewport breathes as one unified tonal environment with `perfect1`–`perfect4`.

---

## 4. Mobile Viewport Rules (375px–430px Priority)
- Use `min-h-dvh` exclusively (never `100vh`).
- **Split-Stage Mobile Stack:** On mobile, the top `48dvh–52dvh` is a `sticky top-0 z-0` visual stage displaying `perfect1–4` full-bleed, with the bottom edge softly melting into `--canvas-bg`. The 4 content cards (`z-10` to `z-40`) slide up over the lower boundary of the image and stack over one another in the lower `52dvh` thumb zone.
- Touch targets must be minimum `48px` tall with `active:scale-[0.99]` tactile feedback.
