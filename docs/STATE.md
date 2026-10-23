# Project State & Session Handover

## Active Repository & Branch
- **Path**: `C:\xampp\htdocs\Sadija`
- **Git Remote**: `https://github.com/abdisalam02/Sadija.git`
- **Branch**: `main`

## Latest Work Completed
- **Footer Reset & Signature Labs**: Reverted the oversized A.Gure sign-off that was competing with the site. The live footer is back to the original translucent social row + colophon. Signature explorations now live in preview-only labs, not linked from the site: `?lab=footer` (5 quiet colophon placements) and `?lab=signature` (12 distinct directions: atelier seal, ink signature, split-flap, scramble, magnetic monogram, dot-matrix, woven label, barcode tag, registration mark, embossed seal, photo-filled type, ticket stub). The final credit direction is still pending.
- **High-Resolution Look Images**: Replaced the blurry, 3x-upscaled previews with 2600px-tall assets (`look-1-linen.webp`, `look-2-denim.webp`, `look-3-trench.webp`). The linen look was rebuilt from its 1440×1800 source with the original remove.bg alpha aligned onto it; the denim and trench were AI-upscaled with Real-ESRGAN x4plus from the best available cutouts. Verified at a 390×844 / DPR 3 render.
  - Note: the true originals for the denim (433×577) and trench (408×612) aren't in the repo, so higher-res source photos would improve those two further.
- **Truly Static Mobile Background**: Replaced the `position: fixed` stage with an app-shell layout — `html`/`body` are viewport-locked and only `#app-scroll` scrolls. This prevents the Android/Samsung address bar from collapsing, which was shifting the fixed artwork up/down before snapping (Chromium issue 41395555). Verified at 375×812, 390×844, 412×915, 430×932 and 1280×800: the stage/image top and size stay constant at every scroll position.
- **Branding**: Renamed to `SADIJA`, removed "Gure" and "Fashion & Editorial Curator". Hero shows `OSLO, NORWAY` and pure white monumental name with drop shadows.
- **YouTube Player**: Added full-frame tap-to-play/pause overlay, authentic red play icon, and icon-only audio toggle.
- **Spotify Podcast**: Linked authentic Episode 2 ("introverts are more annoying than extroverts..") with 30s audio preview. Expanded player width (`w-[72%] max-w-[320px]`) for relaxed typography. Audio volume balanced to 0.35.
- **Dynamic Floating Player**: Auto-detects Spotify or YouTube playback with interactive play/pause and mute buttons.
- **Contact**: Restored unboxed layout with hairline dividers; encapsulated Gmail in a black glass pill (`sadijagure@gmail.com`).

## Verification & Commands
- Dev Server: `npm run dev -- --host --port 5173`
- Type Check: `npx tsc --noEmit` (passing with 0 errors)
- Production Build: `npm run build` (passing with 0 errors)
