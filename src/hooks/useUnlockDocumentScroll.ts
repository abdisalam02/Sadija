import { useEffect } from 'react';

/**
 * The live site locks the document and scrolls #app-scroll. Lab routes are
 * normal long pages, so they need document scrolling re-enabled while mounted.
 */
export function useUnlockDocumentScroll() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    html.style.overflow = 'auto';
    body.style.overflow = 'auto';

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);
}
