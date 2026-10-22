# Sadija Portfolio — Architecture & Component Map

## Overview
High-fashion editorial linktree/portfolio for Scandinavian creator **SADIJA** (Oslo, Norway). Built with React 18, Vite, TypeScript, Tailwind CSS, and Framer Motion.

## Core Architecture

### 1. Dual-Layer Split Layout
- **Left Stage (`EditorialStage.tsx`)**:
  - `fixed top-0 left-0 w-full lg:w-[50vw] h-[100lvh] z-20 pointer-events-none`
  - Completely static backdrop across mobile viewport height changes (`100lvh` / `108lvh+`).
  - 3-look synchronized scroll dissolve:
    - Look 1: `2-removebg-preview.webp` (Linen Drape - elbow touching left screen edge: `x: -19svh, y: -5lvh`)
    - Look 2: `IMG_5196-removebg-preview.webp` (Chambray Denim - relaxed center-right: `x: -14svh, y: -5lvh`)
    - Look 3: `1-removebg-preview.webp` (Noir Trench - right-hugging: `x: 14svh, y: -5lvh`)
  - Transition: pure 1.4s opacity-only crossfade (no scale/blur jumps).
- **Right Content Stream (`App.tsx`)**:
  - `w-full lg:w-[50vw] px-5 sm:px-10 lg:px-14 pt-[44svh] ... z-30`
  - Starts cleanly below model portrait on mobile.

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
- Lightweight RAF lerp momentum scroll on desktop wheels.
- Preserves native 120Hz ProMotion touch scrolling on mobile devices.
