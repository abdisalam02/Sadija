import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { clientProfile } from './config/clientConfig';
import { Header } from './components/Header';
import { EditorialStage } from './components/EditorialStage';
import { SocialLinks } from './components/SocialLinks';
import { FeaturedVideo } from './components/FeaturedVideo';
import { SpotifyPlayer } from './components/SpotifyPlayer';
import { BusinessCollabs } from './components/BusinessCollabs';
import { Footer } from './components/Footer';
import { FloatingPlayer } from './components/FloatingPlayer';
import { DockingName } from './components/DockingName';
import { DockLabSwitcher } from './components/DockLabSwitcher';
import { MediaProvider } from './context/MediaContext';
import { fetchLatestYouTubeVideo } from './utils/mediaFetcher';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { DEFAULT_DOCK_MODE, type DockMode } from './config/animationConfig';

export function App() {
  // The document never scrolls — all scrolling happens inside #app-scroll.
  // This keeps the mobile browser URL bar expanded, so the static stage
  // below can never be shifted by the address-bar show/hide animation.
  const scrollRef = useRef<HTMLDivElement>(null);

  // Silky desktop momentum smooth scroll (operates on the app scroll area)
  useSmoothScroll(scrollRef);

  const [activeLookIndex, setActiveLookIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('look');
      if (p !== null) return parseInt(p, 10);
    }
    return 0;
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [nameDocked, setNameDocked] = useState(false);
  const handleNameReady = useCallback(() => setNameDocked(true), []);
  const [socialRanges, setSocialRanges] = useState<Array<{ start: number; end: number }>>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const NAV_DROP = 32;

  // Dock experiment: default from config, overridable with ?dock=a ... ?dock=e.
  const dockMode: DockMode = (() => {
    const override = new URLSearchParams(window.location.search).get('dock')?.toLowerCase();
    if (override === 'a') return 'A';
    if (override === 'b') return 'B';
    if (override === 'c') return 'C';
    if (override === 'd') return 'D';
    if (override === 'e') return 'E';
    return DEFAULT_DOCK_MODE;
  })();

  // E is a pure crossfade: the in-flow name stays put and dissolves into the
  // nav brand as the header arrives, so there is no clone to track/dock.
  const isCrossfade = dockMode === 'E';
  const isDockLab = new URLSearchParams(window.location.search).get('lab') === 'dock';

  // Track viewport class for the nav's reveal timing (it comes down to meet the name).
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Measure each hero social card so its fade and its nav icon share one range.
  useEffect(() => {
    const measure = () => {
      const scroller = scrollRef.current;
      if (!scroller) return;
      const height = scroller.clientHeight;
      const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-social]'));

      setSocialRanges(
        rows.map((row) => {
          const top = row.getBoundingClientRect().top + scroller.scrollTop;
          const start = Math.max(0, top - height * 0.18);
          const end = Math.max(start + 40, top - height * 0.07);
          return { start, end };
        })
      );
    };

    const timers = [window.setTimeout(measure, 900), window.setTimeout(measure, 1800)];
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(() => window.setTimeout(measure, 700));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Dynamic YouTube state with automated background fetch
  const [youtubeVideo, setYoutubeVideo] = useState({
    title: clientProfile.youtube.title,
    videoId: clientProfile.youtube.videoId,
  });

  // Auto-fetch latest YouTube video if channelId is provided
  useEffect(() => {
    if (clientProfile.youtube.channelId) {
      fetchLatestYouTubeVideo(clientProfile.youtube.channelId).then((res) => {
        if (res) {
          setYoutubeVideo({
            title: res.title,
            videoId: res.videoId,
          });
        }
      });
    }
  }, []);

  // Auto-scroll to section or anchor hash on mount if present
  useEffect(() => {
    const sec = new URLSearchParams(window.location.search).get('section');
    if (sec) {
      const el = document.getElementById(sec + '-section');
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
      }
      return;
    }
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
      }
    }
  }, []);

  // Scroll tracking across the app scroll area (the window itself never scrolls)
  const { scrollY, scrollYProgress } = useScroll({
    container: scrollRef,
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // The nav descends to meet the name. The timing follows the chosen dock
  // behaviour so an empty pill never floats before the brand arrives.
  const navRange: [number, number] = isDesktop
    ? [0, 110]
    : dockMode === 'B'
      ? [255, 355]
      : dockMode === 'E'
        ? [240, 350]
        : [355, 440];
  const navOpacity = useTransform(scrollY, navRange, [0, 1]);
  const navY = useTransform(scrollY, navRange, [-NAV_DROP, 0]);

  // Crossfade (E): the in-flow hero name darkens and dissolves as the nav
  // arrives; the nav brand takes over in the same stretch of scroll.
  const heroFadeRange: [number, number] = isDesktop ? [10, 130] : [210, 360];
  const heroNameOpacity = useTransform(scrollY, heroFadeRange, [1, 0]);
  const heroNameColor = useTransform(
    scrollY,
    [0, isDesktop ? 160 : 300],
    [isDesktop ? '#3d3d3d' : '#ffffff', '#141518']
  );

  // Synchronize Scroll Timing with the 3 Left-Side Images (perfect1 -> perfect3 -> perfect4)
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (new URLSearchParams(window.location.search).has('look')) return;
    if (latest < 0.45) {
      if (activeLookIndex !== 0) setActiveLookIndex(0); // perfect1 (Linen Drape - Hero & YouTube)
    } else if (latest < 0.80) {
      if (activeLookIndex !== 1) setActiveLookIndex(1); // perfect3 (Chambray Denim - Spotify & Breathing Space)
    } else {
      if (activeLookIndex !== 2) setActiveLookIndex(2); // perfect4 (Noir Trench - Bookings & Footer)
    }
  });

  return (
    <MediaProvider>
      {/* App shell: pinned to the viewport height and never scrolls, so mobile
          browser chrome (address bar) never animates and the stage stays put. */}
      <div
        id="app-shell"
        className="h-[100dvh] w-full bg-[#fcfbf8] text-[#141518] selection:bg-neutral-900 selection:text-white relative overflow-hidden"
      >
        {/* 1. FLOATING TOP DOCK (Glides down smoothly when scrolling down) */}
        <Header
          name={clientProfile.name}
          socials={clientProfile.socials}
          navOpacity={navOpacity}
          navY={navY}
          scrollY={scrollY}
          nameDocked={nameDocked}
          socialRanges={socialRanges}
        />

        {!isCrossfade && (
          <DockingName
            scrollY={scrollY}
            name={clientProfile.name}
            onReady={handleNameReady}
            navOffset={NAV_DROP}
            startColor={isDesktop ? '#3d3d3d' : '#ffffff'}
            startShadow={
              isDesktop ? '0 0 0 rgba(0,0,0,0)' : '0 2px 18px rgba(20,21,24,0.35)'
            }
            mode={dockMode}
          />
        )}

        {/* 2. STATIC VISUAL STAGE (outside the scroll area, so it can never move with the page) */}
        <aside
          aria-label="Sadija Visual Stage"
          className="absolute top-0 left-0 w-full lg:w-[50vw] h-[100lvh] z-20 pointer-events-none"
        >
          <EditorialStage
            looks={clientProfile.looks}
            activeLookIndex={activeLookIndex}
          />
        </aside>

        {/* 3. APP SCROLL AREA (only this element scrolls) */}
        <div
          ref={scrollRef}
          id="app-scroll"
          tabIndex={0}
          className="relative z-30 h-full w-full overflow-y-auto overflow-x-hidden overscroll-y-contain focus:outline-none"
        >
          {/* CONTENT STREAM (Editorial flow with translucent frosted glass) */}
          <div ref={containerRef} className="w-full relative flex flex-col lg:flex-row">
            {/* Empty left spacer on desktop so content stays on right side */}
            <div className="hidden lg:block lg:w-[50vw] flex-shrink-0 pointer-events-none" />

            {/* Right Content Stream (Starts cleanly below model portrait on mobile) */}
            <main className="w-full lg:w-[50vw] px-5 sm:px-10 lg:px-14 pt-[44svh] sm:pt-[48svh] lg:pt-16 pb-24 flex flex-col space-y-24 sm:space-y-32 relative z-30">
            
              {/* SECTION 1: HERO MASTHEAD & SOCIALS (Locked Crisp White High-Contrast Typography) */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                aria-labelledby="client-name-title"
                className="space-y-6 pt-2 lg:pt-0 relative z-30"
              >
                {/* Scandinavian metadata */}
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-neutral-900">
                  <span>{clientProfile.location}</span>
                </div>

                {/* Monumental Name — the visible version docks into the nav */}
                <motion.h1
                  id="client-name-title"
                  style={{
                    opacity: isCrossfade ? heroNameOpacity : nameDocked ? 0 : 1,
                    color: isCrossfade ? heroNameColor : undefined,
                  }}
                  className="font-syne font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.88] uppercase select-none w-full text-white lg:text-[#3d3d3d] drop-shadow-[0_2px_18px_rgba(20,21,24,0.35)] lg:drop-shadow-none"
                >
                  <span id="hero-name-text">SADIJA</span>
                </motion.h1>

                {/* Each social row fades only when it reaches the nav */}
                <div className="pt-2">
                  <SocialLinks socials={clientProfile.socials} scrollRef={scrollRef} />
                </div>
              </motion.section>

              {/* SECTION 2: YOUTUBE BROADCAST (Clean Natural Flow, Unblocked Controls) */}
              <motion.section
                id="broadcast-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                aria-label="YouTube Video"
                className="relative z-30 pointer-events-auto"
              >
                <FeaturedVideo
                  title={youtubeVideo.title}
                  videoId={youtubeVideo.videoId}
                  youtubeUrl={
                    clientProfile.socials.find((s) => s.platform === 'youtube')?.url ||
                    'https://www.youtube.com/@sadija.a'
                  }
                />
              </motion.section>

              {/* SECTION 3: OPEN VISUAL WINDOW & RIGHT-DOCKED SPOTIFY CAPSULE */}
              {/* Leaves the left denim look completely visible & unblocked */}
              <motion.section
                id="spotify-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                aria-label="Spotify Music"
                className="z-30 pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-36 flex flex-col items-end w-full pointer-events-none"
              >
                <div className="pointer-events-auto">
                  <SpotifyPlayer />
                </div>
              </motion.section>

              {/* VISUAL BREATHER: Dedicated breathing space showcasing Look 3 (Denim) before transitioning to Look 4 */}
              <div
                aria-hidden="true"
                className="h-28 sm:h-36 lg:h-48 w-full pointer-events-none"
              />

              {/* SECTION 4: UNBOXED DIRECT BOOKINGS & PRESS (Look 4 Fully Visible in Background) */}
              <motion.section
                id="collabs-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                aria-label="Brand Collaborations & Contact"
                className="z-40 space-y-12 pt-8 sm:pt-14 pointer-events-auto"
              >
                <BusinessCollabs
                  email={clientProfile.business.email}
                  inquiryNotice={clientProfile.business.inquiryNotice}
                />

                {/* Footer with direct social links */}
                <Footer
                  name={clientProfile.name}
                  socials={clientProfile.socials}
                  email={clientProfile.business.email}
                  onScrollToTop={() =>
                    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                />
              </motion.section>

            </main>
          </div>
        </div>

        {/* Dynamic Global Media Player Pill (Syncs across Spotify and YouTube) */}
        <FloatingPlayer />

        {/* Lab-only A–E switcher; normal visits never render this. */}
        {isDockLab && <DockLabSwitcher current={dockMode} />}
      </div>
    </MediaProvider>
  );
}

export default App;
