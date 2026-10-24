/**
 * Runtime profile for in-app browsers that need a lighter page.
 *
 * TikTok's Android WebView advertises support for scroll-driven animations but
 * does not actually run them on the compositor — it updates them on the main
 * thread, in chunks, which makes the whole page look like it is teleporting
 * while it scrolls. Chrome, Samsung Internet and Instagram's browser all
 * composite the same animation correctly (verified on device), so the
 * workaround is scoped to the one WebView that needs it.
 *
 * Detection is UA-based because there is no feature test for "does your
 * compositor really do this". `?dockpath=css|js` still overrides by hand.
 */

const TIKTOK_UA = /musical_ly|bytedancewebview|aweme|trill/i;

let cached: boolean | null = null;

export const isTikTokWebView = (): boolean => {
  if (cached !== null) return cached;
  try {
    cached = TIKTOK_UA.test(navigator.userAgent);
  } catch {
    cached = false;
  }
  return cached;
};

/**
 * Tag the document so CSS can drop expensive effects for this WebView.
 * Called once from `main.tsx`, before React renders.
 */
export const tagRuntimeProfile = (): void => {
  if (!isTikTokWebView()) return;
  document.documentElement.dataset.webview = 'tiktok';
};
