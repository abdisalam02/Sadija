import { useState, useRef, useEffect } from 'react';
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
import { MediaProvider } from './context/MediaContext';
import { fetchLatestYouTubeVideo } from './utils/mediaFetcher';
import { useSmoothScroll } from './hooks/useSmoothScroll';

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

  // Floating top navigation bar appears smoothly after passing hero threshold
  const navOpacity = useTransform(scrollY, [260, 360], [0, 1]);
  const navY = useTransform(scrollY, [260, 360], [-20, 0]);

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
      <div className="h-[100dvh] w-full bg-[#fcfbf8] text-[#141518] selection:bg-neutral-900 selection:text-white relative overflow-hidden">
        {/* 1. FLOATING TOP DOCK (Glides down smoothly when scrolling down) */}
        <Header
          name={clientProfile.name}
          socials={clientProfile.socials}
          navOpacity={navOpacity}
          navY={navY}
        />

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
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  <span>{clientProfile.location}</span>
                </div>

                {/* Monumental Name in Pure White */}
                <h1
                  id="client-name-title"
                  className="font-syne font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.88] uppercase select-none w-full text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)]"
                >
                  SADIJA
                </h1>

                {/* Interleaved Fading Transparency Social Links */}
                <div className="pt-2">
                  <SocialLinks socials={clientProfile.socials} />
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
                  management={clientProfile.business.management}
                />

                {/* Enriched Minimalist Footer with Direct Social Links */}
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
      </div>
    </MediaProvider>
  );
}

export default App;
