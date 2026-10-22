# Project State & Session Handover

## Active Repository & Branch
- **Path**: `C:\xampp\htdocs\Sadija`
- **Git Remote**: `https://github.com/abdisalam02/Sadija.git`
- **Branch**: `main`

## Latest Work Completed
- **Truly Static Mobile Background**: Replaced the `position: fixed` stage with an app-shell layout — `html`/`body` are viewport-locked and only `#app-scroll` scrolls. This prevents the Android/Samsung address bar from collapsing, which was shifting the fixed artwork up/down before snapping (Chromium issue 41395555). Verified at 375×812, 390×844, 412×915, 430×932 and 1280×800: the stage/image top and size stay constant at every scroll position.
- **Branding**: Renamed to `SADIJA`, removed "Gure" and "Fashion & Editorial Curator". Hero shows `OSLO, NORWAY` and pure white monumental name with drop shadows.
- **Image Quality**: Upscaled cutouts 3x using Lanczos sharpening and converted to WebP (`1-removebg-preview.webp`, `2-removebg-preview.webp`, `IMG_5196-removebg-preview.webp`).
- **YouTube Player**: Added full-frame tap-to-play/pause overlay, authentic red play icon, and icon-only audio toggle.
- **Spotify Podcast**: Linked authentic Episode 2 ("introverts are more annoying than extroverts..") with 30s audio preview. Expanded player width (`w-[72%] max-w-[320px]`) for relaxed typography. Audio volume balanced to 0.35.
- **Dynamic Floating Player**: Auto-detects Spotify or YouTube playback with interactive play/pause and mute buttons.
- **Contact**: Restored unboxed layout with hairline dividers; encapsulated Gmail in a black glass pill (`sadijagure@gmail.com`).

## Verification & Commands
- Dev Server: `npm run dev -- --host --port 5173`
- Type Check: `npx tsc --noEmit` (passing with 0 errors)
- Production Build: `npm run build` (passing with 0 errors)
