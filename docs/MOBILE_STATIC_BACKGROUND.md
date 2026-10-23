# Mobile Static Background — Audit & Reusable Fix

**Scope:** how the Sadija portfolio keeps its photographic stage perfectly still while the page scrolls on mobile, and how to reproduce the same behaviour in another project.

## 1. The symptom

On a normal document-scrolling page, a fixed or full-height background moves on Android / Samsung Internet / iOS when the browser address bar collapses or expands:

- the viewport height changes (`100vh` ≠ the visible height),
- `position: fixed` layers get re-anchored,
- a `background-attachment: fixed` background jumps by the toolbar height,
- the page then snaps back when the bar returns.

This is the Chromium issue **41395555** family of bugs. It is a browser-chrome problem, not a transform or CSS-animation problem.

## 2. Why this page does not move

The document itself is **never scrollable**. The app is split into a viewport-locked shell, a dedicated scroll area, and a stage that lives outside that scroll area.

```
html / body                 overflow: hidden
└── #app-shell              100dvh, overflow: hidden
    ├── Header              fixed inside the shell
    ├── DockingName         fixed clone inside the shell
    ├── aside.stage         absolute, 0 0, 100lvh — NOT in the scroller
    ├── #app-scroll         h-full, overflow-y: auto — the only scrolling element
    │   └── content stream
    └── FloatingPlayer      fixed inside the shell
```

Because `window` never scrolls, the mobile browser never enters its toolbar-collapsing scroll mode. The background stage is also outside `#app-scroll`, so even if the shell were to resize, the stage is not translated by the content scroll.

### Base CSS (`src/index.css`)

```css
html {
  color-scheme: light;
  overflow: hidden;
  background-color: #fcfbf8;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  overscroll-behavior: none;
  background-color: #fcfbf8;
  -webkit-font-smoothing: antialiased;
}
```

### Shell and scroll area (`src/App.tsx`)

```tsx
<div
  id="app-shell"
  className="h-[100dvh] w-full bg-[#fcfbf8] relative overflow-hidden"
>
  {/* static stage: outside the scroller */}
  <aside
    aria-label="Sadija Visual Stage"
    className="absolute top-0 left-0 w-full lg:w-[50vw] h-[100lvh] z-20 pointer-events-none"
  >
    <EditorialStage ... />
  </aside>

  {/* the only scrolling element */}
  <div
    ref={scrollRef}
    id="app-scroll"
    tabIndex={0}
    className="relative z-30 h-full w-full overflow-y-auto overflow-x-hidden overscroll-y-contain focus:outline-none"
  >
    ...
  </div>
</div>
```

### Scroll measurement

```tsx
const { scrollY, scrollYProgress } = useScroll({
  container: scrollRef,      // not window
  target: containerRef,
  offset: ['start start', 'end end'],
});
```

### Stage details (`EditorialStage.tsx`)

- The stage is `kind: absolute`, never `fixed`.
- Its height is `100lvh` (large viewport height), not `100vh`.
- Image heights use `lvh` (`108lvh`, `115lvh`, `128lvh`).
- Images are vertically positioned with fixed `y` offsets; there is **no scroll-linked transform or parallax** on the stage.
- Look changes are a 1.4s **opacity crossfade** only.
- The stage has no `transform`, no `filter`, and no ancestor creating a new containing block.

## 3. The height units

| Unit | Meaning | Use here |
|---|---|---|
| `dvh` | current dynamic viewport height | shell height |
| `lvh` | largest viewport height (toolbar hidden) | stage / image height |
| `svh` | smallest viewport height (toolbar shown) | content top padding (`pt-[44svh]`) |

The shell uses `100dvh` so it always fits the visual viewport. The stage uses `100lvh` so the artwork does not resize when browser chrome changes. The content starts at `44svh` so the first usable content clears the portrait on mobile. Do not mix `100vh` into this system.

## 4. Other rules that keep it stable

- **No `background-attachment: fixed`** for the mobile backdrop.
- **No `position: fixed` background inside the scroller.**
- **No JS scroll handlers that translate the stage.** Scroll state is only used for content fades and media coordination.
- `overscroll-behavior: none` on `body` and `overscroll-y-contain` on `#app-scroll` to stop rubber-band/overscroll from dragging the shell.
- `viewport-fit=cover` in the viewport meta, plus safe-area padding where fixed UI is near an edge.
- Deep links and "Back to Top" scroll `#app-scroll`, never `window`.
- Desktop momentum smoothing (`useSmoothScroll`) only intercepts wheel input; touch scrolling stays native.
- The scroll area is focusable (`tabIndex={0}`) so keyboard users can scroll it after the document is locked.

## 5. Audit result (headless Chrome, DPR 2)

For each viewport, the stage rect and the image rect were measured at `scrollTop` 0, 400 and 900:

| Viewport | Stage top / height | Image top / height | `window.scrollY` | ScrollTop |
|---|---|---|---|---|
| 375×812 | `0 / 812` at all scrolls | `-40.60 / 876.95` at all scrolls | 0 | 0 → 400 → 900 |
| 390×844 | `0 / 844` at all scrolls | `-42.20 / 911.52` at all scrolls | 0 | 0 → 400 → 900 |
| 412×915 | `0 / 915` at all scrolls | `-45.75 / 988.19` at all scrolls | 0 | 0 → 400 → 900 |
| 430×932 | `0 / 932` at all scrolls | `-46.60 / 1006.55` at all scrolls | 0 | 0 → 400 → 900 |
| 1280×800 | `0 / 800` at all scrolls | `-40.00 / 1024.00` at all scrolls | 0 | 0 → 400 → 900 |

Also confirmed at every viewport:

- `getComputedStyle(document.documentElement).overflow === 'hidden'`
- `getComputedStyle(document.body).overflow === 'hidden'`
- `window.scrollY === 0` while `#app-scroll.scrollTop` changes
- stage `transform === 'none'` and `position === 'absolute'`

## 6. Minimal reusable pattern

A complete copyable version of this pattern is in
[`docs/static-background-template.html`](./static-background-template.html).
Open it directly in a mobile browser and scroll to verify.

```html
<!doctype html>
<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover"
    />
    <style>
      html,
      body {
        margin: 0;
        height: 100%;
        overflow: hidden;
        overscroll-behavior: none;
        background: #fcfbf8;
      }

      .app-shell {
        position: relative;
        height: 100dvh;
        overflow: hidden;
      }

      /* background: not fixed, not inside the scroller */
      .stage {
        position: absolute;
        inset: 0;
        height: 100lvh;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
      }

      .stage img {
        width: 100%;
        height: 120lvh;
        object-fit: cover;
        /* no scroll-linked transform */
      }

      /* the only scroll container */
      .scroll-area {
        position: relative;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior-y: contain;
        z-index: 1;
      }
    </style>
  </head>
  <body>
    <div class="app-shell">
      <div class="stage" aria-hidden="true">
        <img src="background.jpg" alt="" />
      </div>
      <main class="scroll-area">
        <!-- page content -->
      </main>
    </div>
  </body>
</html>
```

## 7. Applying it to another project — checklist

1. Remove `background-attachment: fixed` and `position: fixed` from the mobile background.
2. Put the background in a non-scrolling shell, **outside** the content scroller.
3. Lock `html` and `body` (`overflow: hidden`, `overscroll-behavior: none`).
4. Give the shell `height: 100dvh; overflow: hidden`.
5. Give the scroll area `height: 100%; overflow-y: auto`.
6. Give the background `position: absolute` and `height: 100lvh`; use `lvh` for image heights.
7. Remove JS parallax/scroll transforms from the background.
8. Change every app-level scroll target to the new scroll container:
   - `useScroll({ container })`
   - `scrollIntoView` targets inside the container
   - footer "Back to Top" scrolls the container
9. Add `overscroll-behavior` to prevent bounce.
10. Test with the URL bar both shown and hidden, and verify the stage rect is unchanged at several scroll positions.

## 8. Verification snippet

Paste this in the console on a mobile emulation; all rect values must stay the same while `scrollTop` changes:

```js
const stage = document.querySelector('[data-static-stage]');
const scroller = document.querySelector('#app-scroll');
const read = () => {
  const s = stage.getBoundingClientRect();
  const i = stage.querySelector('img')?.getBoundingClientRect();
  return {
    stage: { top: s.top, height: s.height },
    image: i ? { top: i.top, height: i.height } : null,
    windowY: window.scrollY,
    scrollTop: scroller.scrollTop,
  };
};

const before = read();
scroller.scrollTop = 700;
requestAnimationFrame(() => {
  const after = read();
  console.table({ before, after });
});
```

If `stage.top` or `stage.height` changes while `window.scrollY` stays 0, the stage is still inside or affected by the scroller. If `window.scrollY` changes, the document is still the scroller and the browser toolbar can move the background.

---

**Files involved in this implementation**

- `src/index.css` — document lock, overscroll, base background
- `src/App.tsx` — shell, stage sibling, dedicated scroll area, scroll container
- `src/components/EditorialStage.tsx` — absolute stage and opacity-only look dissolve
- `src/hooks/useSmoothScroll.ts` — desktop-only wheel smoothing; touch stays native
