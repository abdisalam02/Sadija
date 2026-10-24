import React from 'react';
import { useUnlockDocumentScroll } from '../hooks/useUnlockDocumentScroll';
import { MediaProvider } from '../context/MediaContext';
import { FeaturedVideo } from '../components/FeaturedVideo';
import { clientProfile } from '../config/clientConfig';

/**
 * Dev-only comparison for the YouTube block, opened with ?lab=youtube.
 *
 * Both options are the same component with the same metadata — the only
 * difference is whether the site's frosted card wraps it or not. The player is
 * a static poster here (no autoplay, no audio) so the two can sit next to each
 * other without fighting over one iframe.
 */
const video = clientProfile.youtube;
const youtubeUrl =
  clientProfile.socials.find((social) => social.platform === 'youtube')?.url ||
  'https://www.youtube.com/@sadija.a';

const Options = [
  {
    key: 'card',
    label: 'A · With card',
    variant: 'card' as const,
    note: 'The frosted card stays, but everything inside is now YouTube’s own layout: length badge, avatar, title, channel, views, age and the action chips. The card is the frame; the content is YouTube.',
  },
  {
    key: 'bare',
    label: 'B · No card',
    variant: 'bare' as const,
    note: 'No wrapper at all. The player and its metadata sit straight on the paper, like a real embed pasted into the page. Quieter and more editorial — nothing boxes the video in.',
  },
];

const YouTubeLab: React.FC = () => {
  useUnlockDocumentScroll();

  return (
    <MediaProvider>
      <div className="min-h-dvh bg-[#fcfbf8] text-[#141518] selection:bg-neutral-900 selection:text-white">
        <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fcfbf8]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-400">
                [ YOUTUBE CARD ]
              </span>
              <h1 className="font-syne text-base font-extrabold tracking-tight sm:text-lg">
                Two ways to present the video
              </h1>
            </div>
            <a
              href="/"
              className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
            >
              back to site
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            Rebuilt to read as an actual YouTube video rather than a media card: the length badge sits
            where YouTube puts it, the avatar and channel name are real, and the view count and age
            come from the video itself (9.1K views, published 18 Oct 2026 — the “x days ago” line
            recalculates on every visit).
          </p>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
            Static posters in this lab · the live site plays the video inline
          </p>

          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
            {Options.map((option) => (
              <section key={option.key} id={option.key} className="scroll-mt-24">
                <div className="flex items-baseline justify-between gap-3 border-t border-black/10 pt-4">
                  <h2 className="font-syne text-sm font-extrabold uppercase tracking-[0.08em]">
                    {option.label}
                  </h2>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                    {option.variant === 'card' ? 'glass-frosted' : 'no wrapper'}
                  </span>
                </div>

                <p className="mt-3 text-[13px] leading-relaxed text-neutral-600">{option.note}</p>

                <div className="mt-6 rounded-2xl bg-[#efede7] p-4 sm:p-6">
                  <div className="mx-auto max-w-[520px]">
                    <FeaturedVideo
                      title={video.title}
                      videoId={video.videoId}
                      youtubeUrl={youtubeUrl}
                      channelName={video.channelName}
                      channelAvatar={video.channelAvatar}
                      views={video.views}
                      likes={video.likes}
                      publishedAt={video.publishedAt}
                      durationSeconds={video.durationSeconds}
                      variant={option.variant}
                      poster
                    />
                  </div>
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 max-w-2xl text-[13px] leading-relaxed text-neutral-500">
            Both options keep the same data source and the same interactive bits — the mute toggle on
            the player, share, and every chip links to the video on YouTube. Pick one and it goes into
            the real page; the other is deleted.
          </p>
        </main>
      </div>
    </MediaProvider>
  );
};

export default YouTubeLab;
