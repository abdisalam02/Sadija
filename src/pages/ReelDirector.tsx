import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SadijaApp } from '../App';
import { clientProfile } from '../config/clientConfig';
import {
  CenterSignatureFinale,
  clamp01,
  easeInOutCubic,
  REEL_CHECKPOINTS,
  REEL_DURATION,
  ReelSafeZoneGuide,
  TopAdCaption,
  TouchCursorState,
  TouchRippleCursor,
} from '../components/ReelOverlays';
import { playFlourishWhoosh, playLinkChime, playPenStroke } from '../utils/reelSounds';

// 9:16 Instagram Reel Master Canvas (scales to 1080x1920 at 2.5x)
const CANVAS_WIDTH = 432;
const CANVAS_HEIGHT = 768;

// Authentic 19.5:9 Slim & Tall iPhone 15/16 Pro Viewport Inside the Phone Frame
const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;
const PHONE_SCALE = 0.635; // 248px x 536px: leaves upper safe room for headline and bottom clearance

export interface MusicTrack {
  id: string;
  title: string;
  src: string;
  vibe: string;
}

export const REEL_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'fashion',
    title: 'Fashion',
    src: '/audio/tracks/mixkit-fashion-228.mp3',
    vibe: 'Upbeat Fashion / Runway Groove',
  },
  {
    id: 'for-those-who-dont-sleep',
    title: "For Those Who Don't Sleep",
    src: '/audio/tracks/mixkit-for-those-who-dont-sleep-869.mp3',
    vibe: 'Late Night Synth Beat',
  },
  {
    id: 'island-beat',
    title: 'Island Beat',
    src: '/audio/tracks/mixkit-island-beat-250.mp3',
    vibe: 'Organic Downtempo Cadence',
  },
  {
    id: 'tom',
    title: 'Tom',
    src: '/audio/tracks/mixkit-tom-244.mp3',
    vibe: 'Modern Electronic Percussion / Drum Groove',
  },
];

/**
 * Unhurried, natural scroll curve (0..1) across 0.0s -> 24.4s.
 * Synchronized with the 4 top story beats and the 3 background portraits
 * (Look 1: 0..0.45, Look 2: 0.45..0.80, Look 3: 0.80..1.00).
 */
function computeScrollProgress(t: number): number {
  if (t <= 2.2) {
    return 0;
  }
  if (t <= 5.5) {
    return easeInOutCubic((t - 2.2) / 3.3) * 0.25;
  }
  if (t <= 6.8) {
    return 0.25 + easeInOutCubic((t - 5.5) / 1.3) * 0.1;
  }
  if (t <= 9.2) {
    return 0.35 + ((t - 6.8) / 2.4) * 0.02;
  }
  if (t <= 12.8) {
    return 0.37 + easeInOutCubic((t - 9.2) / 3.6) * 0.25;
  }
  if (t <= 16.5) {
    return 0.62 + ((t - 12.8) / 3.7) * 0.04;
  }
  if (t <= 20.5) {
    return 0.66 + easeInOutCubic((t - 16.5) / 4.0) * 0.24;
  }
  if (t <= 23.2) {
    return 0.9 + easeInOutCubic((t - 20.5) / 2.7) * 0.1;
  }
  return 1.0;
}

/**
 * Computes the simulated touch ripple cursor in the 390x844 phone screen coordinate space.
 * Taps YouTube at 7.2s and Spotify Episode 1 at 14.4s.
 */
function computeTouchCursor(
  t: number,
  ytTarget: { x: number; y: number },
  spTarget: { x: number; y: number }
): TouchCursorState {
  if (t < 6.3 || t > 15.8) {
    return { x: ytTarget.x, y: ytTarget.y, visible: false, pressed: false, rippleProgress: 0 };
  }

  let x = ytTarget.x;
  let y = ytTarget.y;

  if (t < 7.0) {
    const p = easeInOutCubic((t - 6.3) / 0.7);
    x = 265 + (ytTarget.x - 265) * p;
    y = ytTarget.y + 55 * (1 - p);
  } else if (t < 13.4) {
    x = ytTarget.x;
    y = ytTarget.y;
  } else if (t < 14.25) {
    const p = easeInOutCubic((t - 13.4) / 0.85);
    x = ytTarget.x + (spTarget.x - ytTarget.x) * p;
    y = ytTarget.y + (spTarget.y - ytTarget.y) * p;
  } else {
    x = spTarget.x;
    y = spTarget.y;
  }

  const tap1Pressed = t >= 7.12 && t <= 7.36;
  const tap1Ripple = t >= 7.18 && t <= 7.88 ? clamp01((t - 7.18) / 0.7) : 0;

  const tap2Pressed = t >= 14.32 && t <= 14.56;
  const tap2Ripple = t >= 14.38 && t <= 15.08 ? clamp01((t - 14.38) / 0.7) : 0;

  return {
    x,
    y,
    visible: true,
    pressed: tap1Pressed || tap2Pressed,
    rippleProgress: Math.max(tap1Ripple, tap2Ripple),
  };
}

export const ReelDirector: React.FC = () => {
  const [stageScale, setStageScale] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [showHud, setShowHud] = useState(true);
  const [showControlsHint, setShowControlsHint] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [cursor, setCursor] = useState<TouchCursorState>({
    x: 195,
    y: 440,
    visible: false,
    pressed: false,
    rippleProgress: 0,
  });

  // Background Music State & Audio Element
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [musicVolume, setMusicVolume] = useState(0.40);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(60);
  const [trackOffsets, setTrackOffsets] = useState<Record<string, number>>({
    fashion: 0,
    'for-those-who-dont-sleep': 0,
    'island-beat': 0,
    tom: 0,
  });

  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = REEL_MUSIC_TRACKS[selectedTrackIndex] || REEL_MUSIC_TRACKS[0];
  const currentOffset = trackOffsets[currentTrack.id] ?? 0;

  const setOffsetForCurrentTrack = useCallback(
    (sec: number) => {
      const maxTime = audioDuration > 0 ? audioDuration : 180;
      const clamped = Math.max(0, Math.min(maxTime, Math.round(sec * 10) / 10));
      setTrackOffsets((prev) => ({ ...prev, [currentTrack.id]: clamped }));
      if (musicAudioRef.current) {
        musicAudioRef.current.currentTime = clamped;
      }
    },
    [currentTrack.id, audioDuration]
  );

  // Initialize background music Audio element
  useEffect(() => {
    const audio = new Audio(REEL_MUSIC_TRACKS[0].src);
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = musicVolume;
    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };
    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setAudioDuration(audio.duration);
      }
    };
    musicAudioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update audio source when selected track changes
  useEffect(() => {
    if (musicAudioRef.current) {
      const wasPlaying = !musicAudioRef.current.paused;
      const track = REEL_MUSIC_TRACKS[selectedTrackIndex] || REEL_MUSIC_TRACKS[0];
      const offset = trackOffsets[track.id] ?? 0;
      musicAudioRef.current.src = track.src;
      musicAudioRef.current.volume = musicVolume;
      musicAudioRef.current.currentTime = offset;
      if (wasPlaying || isPreviewPlaying) {
        musicAudioRef.current.play().catch(() => {});
      }
    }
  }, [selectedTrackIndex]);

  // Update volume
  useEffect(() => {
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const startMusicPlayback = useCallback(() => {
    const audio = musicAudioRef.current;
    if (!audio || !musicEnabled) return;
    const track = REEL_MUSIC_TRACKS[selectedTrackIndex] || REEL_MUSIC_TRACKS[0];
    const offset = trackOffsets[track.id] ?? 0;
    if (!audio.src.includes(track.src)) {
      audio.src = track.src;
    }
    audio.volume = musicVolume;
    audio.currentTime = offset;
    audio.play().catch(() => {});
  }, [musicEnabled, selectedTrackIndex, trackOffsets, musicVolume]);

  // Sync background music with reel playback
  useEffect(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (musicEnabled && audio.paused) {
        startMusicPlayback();
      }
    } else {
      if (!isPreviewPlaying) {
        audio.pause();
      }
    }
  }, [isPlaying, musicEnabled, isPreviewPlaying, startMusicPlayback]);

  const toggleMusicPreview = useCallback(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;
    if (isPreviewPlaying) {
      audio.pause();
      setIsPreviewPlaying(false);
    } else {
      const track = REEL_MUSIC_TRACKS[selectedTrackIndex] || REEL_MUSIC_TRACKS[0];
      const offset = trackOffsets[track.id] ?? 0;
      audio.src = track.src;
      audio.volume = musicVolume;
      audio.currentTime = offset;
      audio.play().then(() => setIsPreviewPlaying(true)).catch(() => {});
    }
  }, [isPreviewPlaying, selectedTrackIndex, musicVolume, trackOffsets]);

  const stageCanvasRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startPerfRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const triggeredActionsRef = useRef<{ ytTapped: boolean; spTapped: boolean }>({
    ytTapped: false,
    spTapped: false,
  });
  const targetCoordsRef = useRef<{
    yt: { x: number; y: number };
    sp: { x: number; y: number };
  }>({
    yt: { x: 195, y: 470 },
    sp: { x: 235, y: 490 },
  });
  const finaleSfxRef = useRef<{
    linkChimed: boolean;
    lastStrokeTime: number;
    flourishWhooshed: boolean;
  }>({
    linkChimed: false,
    lastStrokeTime: 0,
    flourishWhooshed: false,
  });

  // Tag <html> with data-reel="true" so index.css locks #app-shell to 390x844 slim iPhone layout
  useEffect(() => {
    document.documentElement.setAttribute('data-reel', 'true');
    return () => {
      document.documentElement.removeAttribute('data-reel');
    };
  }, []);

  // Pre-decode all 3 high-res portrait images and fonts on mount so zero frame drops occur during recording
  useEffect(() => {
    let cancelled = false;
    const warmUp = async () => {
      try {
        await Promise.all([
          document.fonts?.ready,
          ...clientProfile.looks.map((look) => {
            const img = new Image();
            img.src = look.imageSrc;
            return img.decode ? img.decode().catch(() => undefined) : Promise.resolve();
          }),
        ]);
      } finally {
        if (!cancelled) setAssetsReady(true);
      }
    };
    warmUp();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scale the 432x768 (9:16) Reel canvas to fit the viewport cleanly without clipping
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale = Math.min(vw / CANVAS_WIDTH, vh / CANVAS_HEIGHT);
      setStageScale(scale);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Measure live button coordinates inside the 390x844 phone screen
  const updateLiveTargetCoords = useCallback(() => {
    const shell = document.getElementById('app-shell');
    if (!shell) return;
    const shellRect = shell.getBoundingClientRect();
    const scaleFactor = shell.offsetWidth > 0 ? shellRect.width / shell.offsetWidth : 1;

    const ytBtn = document.querySelector<HTMLElement>(
      '#video-section button[aria-label="Play video"], #video-section button[aria-label="Pause video"]'
    );
    if (ytBtn) {
      const r = ytBtn.getBoundingClientRect();
      targetCoordsRef.current.yt = {
        x: (r.left + r.width * 0.5 - shellRect.left) / scaleFactor,
        y: (r.top + r.height * 0.5 - shellRect.top) / scaleFactor,
      };
    }

    const spBtn = document.querySelector<HTMLElement>(
      '#spotify-section button[aria-label^="Play "], #spotify-section button[aria-label^="Pause "]'
    );
    if (spBtn) {
      const r = spBtn.getBoundingClientRect();
      targetCoordsRef.current.sp = {
        x: (r.left + r.width * 0.5 - shellRect.left) / scaleFactor,
        y: (r.top + r.height * 0.5 - shellRect.top) / scaleFactor,
      };
    }
  }, []);

  const applyFrameAtTime = useCallback(
    (t: number) => {
      const clampedT = Math.max(0, Math.min(REEL_DURATION, t));
      elapsedRef.current = clampedT;
      setElapsed(clampedT);

      const scroller = document.getElementById('app-scroll');
      if (scroller) {
        const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
        const progress = computeScrollProgress(clampedT);
        scroller.scrollTop = progress * maxScroll;
      }

      if (clampedT >= 6.0 && clampedT <= 15.8) {
        updateLiveTargetCoords();
      }

      if (clampedT >= 7.2 && !triggeredActionsRef.current.ytTapped) {
        triggeredActionsRef.current.ytTapped = true;
        const playOverlay = document.querySelector<HTMLButtonElement>(
          '#video-section button[aria-label="Play video"]'
        );
        const unmuteBtn = document.querySelector<HTMLButtonElement>(
          '#video-section button[aria-label="Unmute video"]'
        );
        if (playOverlay) playOverlay.click();
        else if (unmuteBtn) unmuteBtn.click();
      }

      if (clampedT >= 14.4 && !triggeredActionsRef.current.spTapped) {
        triggeredActionsRef.current.spTapped = true;
        const spPlayBtn = document.querySelector<HTMLButtonElement>(
          '#spotify-section button[aria-label^="Play "]'
        );
        if (spPlayBtn) spPlayBtn.click();
      }

      setCursor(
        computeTouchCursor(clampedT, targetCoordsRef.current.yt, targetCoordsRef.current.sp)
      );
    },
    [updateLiveTargetCoords]
  );

  const stopActiveRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  }, []);

  // Master 60 FPS requestAnimationFrame loop
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    startPerfRef.current = performance.now() - elapsedRef.current * 1000;

    const tick = (now: number) => {
      const nextElapsed = (now - startPerfRef.current) / 1000;
      if (nextElapsed >= REEL_DURATION) {
        applyFrameAtTime(REEL_DURATION);
        setIsPlaying(false);
        // Smoothly fade out music over the 1.0s end hold
        const audio = musicAudioRef.current;
        if (audio && !audio.paused) {
          const fadeInterval = window.setInterval(() => {
            if (audio.volume > 0.05) {
              audio.volume = Math.max(0, audio.volume - 0.08);
            } else {
              window.clearInterval(fadeInterval);
              audio.pause();
              audio.volume = musicVolume;
            }
          }, 100);
        }
        // Hold the final signed frame for 1.0s before ending browser recording so there is zero end cut
        window.setTimeout(() => {
          stopActiveRecording();
        }, 1000);
        return;
      }

      // Finale audio sound effects (link chime, cursive pen scratching, flourish swoosh)
      if (nextElapsed < 24.5) {
        finaleSfxRef.current.linkChimed = false;
        finaleSfxRef.current.lastStrokeTime = 0;
        finaleSfxRef.current.flourishWhooshed = false;
      } else {
        // 1. Crystal link chime when sadija.info reveals at 25.1s
        if (nextElapsed >= 25.1 && !finaleSfxRef.current.linkChimed) {
          finaleSfxRef.current.linkChimed = true;
          playLinkChime(0.18);
        }

        // 2. Micro pen-scratch strokes while cursive "A. Gure" signs (26.7s -> 28.0s)
        if (nextElapsed >= 26.7 && nextElapsed <= 28.0) {
          if (nextElapsed - finaleSfxRef.current.lastStrokeTime >= 0.085) {
            finaleSfxRef.current.lastStrokeTime = nextElapsed;
            playPenStroke(0.10);
          }
        }

        // 3. Fluid ink flourish swoosh as underline sweeps across at 27.85s
        if (nextElapsed >= 27.85 && !finaleSfxRef.current.flourishWhooshed) {
          finaleSfxRef.current.flourishWhooshed = true;
          playFlourishWhoosh(0.13);
        }
      }

      applyFrameAtTime(nextElapsed);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, applyFrameAtTime, stopActiveRecording, musicVolume]);

  const resetMediaAndScroll = useCallback(() => {
    triggeredActionsRef.current = { ytTapped: false, spTapped: false };
    finaleSfxRef.current = {
      linkChimed: false,
      lastStrokeTime: 0,
      flourishWhooshed: false,
    };
    const pauseSp = document.querySelector<HTMLButtonElement>(
      '#spotify-section button[aria-label^="Pause "]'
    );
    if (pauseSp) pauseSp.click();

    if (musicAudioRef.current) {
      musicAudioRef.current.pause();
      musicAudioRef.current.currentTime = trackOffsets[currentTrack.id] ?? 0;
    }
    setIsPreviewPlaying(false);

    const scroller = document.getElementById('app-scroll');
    if (scroller) scroller.scrollTop = 0;
  }, [currentTrack.id, trackOffsets]);

  const startReelWithCountdown = useCallback(() => {
    if (countdownTimerRef.current) window.clearTimeout(countdownTimerRef.current);
    setIsPlaying(false);
    setShowControlsHint(false);
    resetMediaAndScroll();
    applyFrameAtTime(0);
    setIsCountingDown(true);

    // Preload & position music immediately so zero delay occurs
    if (musicAudioRef.current && musicEnabled) {
      const track = REEL_MUSIC_TRACKS[selectedTrackIndex] || REEL_MUSIC_TRACKS[0];
      const offset = trackOffsets[track.id] ?? 0;
      if (!musicAudioRef.current.src.includes(track.src)) {
        musicAudioRef.current.src = track.src;
      }
      musicAudioRef.current.currentTime = offset;
    }

    countdownTimerRef.current = window.setTimeout(() => {
      // Start music 300ms before visual motion so soundbed rolls with zero hesitation
      startMusicPlayback();
      window.setTimeout(() => {
        setIsCountingDown(false);
        elapsedRef.current = 0;
        setIsPlaying(true);
      }, 300);
    }, 1200);
  }, [applyFrameAtTime, resetMediaAndScroll, musicEnabled, selectedTrackIndex, trackOffsets, startMusicPlayback]);

  /**
   * High-Quality 60 FPS In-Browser Video Recorder.
   * Uses Region Capture (CropTarget) when supported in Chrome/Edge to record ONLY
   * the exact 9:16 stage canvas at 25 Mbps, and auto-downloads the video on completion.
   */
  const startBrowserRecording = useCallback(async () => {
    try {
      setShowControlsHint(false);
      resetMediaAndScroll();
      applyFrameAtTime(0);

      const displayMediaOptions: DisplayMediaStreamOptions & Record<string, unknown> = {
        video: {
          frameRate: { ideal: 60, max: 60 },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: true,
        preferCurrentTab: true,
        selfBrowserSurface: 'include',
        surfaceSwitching: 'exclude',
      };

      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      streamRef.current = stream;

      // Auto-crop the captured tab strictly to the 9:16 #reel-stage-canvas if Chrome Region Capture is available
      const [videoTrack] = stream.getVideoTracks();
      const winAny = window as unknown as {
        CropTarget?: { fromElement: (el: Element) => Promise<unknown> };
      };
      const trackAny = videoTrack as unknown as {
        cropTo?: (target: unknown) => Promise<void>;
      };
      if (stageCanvasRef.current && winAny.CropTarget && trackAny.cropTo) {
        try {
          const cropTarget = await winAny.CropTarget.fromElement(stageCanvasRef.current);
          await trackAny.cropTo(cropTarget);
        } catch {
          // Fallback to full tab if Region Capture is declined
        }
      }

      const mimeCandidates = [
        'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
        'video/mp4',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ];
      const selectedMime =
        mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';
      const ext = selectedMime.includes('mp4') ? 'mp4' : 'webm';

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 25_000_000, // 25 Mbps studio quality
      });
      recorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };

      recorder.onstop = () => {
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: selectedMime });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `sadija-reel-agure.${ext}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.setTimeout(() => URL.revokeObjectURL(url), 5000);
        }
      };

      setIsRecording(true);
      setIsCountingDown(true);

      // Wait 1.2s after tab-share dialog closes so frame 0 is crystal clear, then start recorder + playback
      countdownTimerRef.current = window.setTimeout(() => {
        recorder.start(200);
        // Start music immediately as the recorder captures so music rolls with zero stillness
        startMusicPlayback();
        // 350ms head-pad on frame 0 before visual motion starts so there is zero start cut and music is rolling
        window.setTimeout(() => {
          setIsCountingDown(false);
          elapsedRef.current = 0;
          setIsPlaying(true);
        }, 350);
      }, 1200);
    } catch {
      setIsRecording(false);
      setIsCountingDown(false);
      setShowControlsHint(true);
    }
  }, [applyFrameAtTime, resetMediaAndScroll, startMusicPlayback]);

  // Keyboard Director Controls: Space (Preview), R (Record 60fps Video), P (Pause), H (Text), 1-5 (Scenes)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        startReelWithCountdown();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        startBrowserRecording();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsCountingDown(false);
        setShowControlsHint(false);
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowHud((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setMusicEnabled((prev) => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setShowSafeZones((prev) => !prev);
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (musicAudioRef.current) {
          setOffsetForCurrentTrack(musicAudioRef.current.currentTime);
        }
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const idx = Number(e.key) - 1;
        const targetTime = REEL_CHECKPOINTS[idx];
        if (targetTime !== undefined) {
          setIsCountingDown(false);
          setShowControlsHint(false);
          if (targetTime < 7.2) triggeredActionsRef.current.ytTapped = false;
          if (targetTime < 14.4) triggeredActionsRef.current.spTapped = false;
          applyFrameAtTime(targetTime);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [applyFrameAtTime, startBrowserRecording, startReelWithCountdown, setOffsetForCurrentTrack]);

  const phoneScreenW = Math.round(PHONE_WIDTH * PHONE_SCALE);
  const phoneScreenH = Math.round(PHONE_HEIGHT * PHONE_SCALE);

  return (
    <div
      className="fixed inset-0 bg-[#f6f5f2] flex items-center justify-center overflow-hidden select-none"
      style={{
        cursor: isPlaying || isCountingDown || isRecording ? 'none' : 'default',
      }}
    >
      {/* 9:16 Vertical Reel Canvas (432x768 scaled to fit 1080x1920 or any screen) */}
      <div
        id="reel-stage-canvas"
        ref={stageCanvasRef}
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          transform: `scale(${stageScale})`,
          transformOrigin: 'center center',
          backgroundColor: '#f6f5f2',
        }}
        className="relative overflow-hidden flex flex-col justify-between"
      >
        {/* 1. Incremental Top Story Text (Bit-by-Bit Reveal) */}
        <TopAdCaption elapsed={elapsed} showHud={showHud} />

        {/* 2. Centered Slim 19.5:9 iPhone Mockup Frame */}
        <div className="relative flex-1 flex items-center justify-center">
          {/* Outer Slim Titanium / Obsidian Phone Chassis */}
          <div
            className="relative rounded-[44px] p-[8px] bg-[#141518]"
            style={{
              boxShadow:
                '0 26px 56px -12px rgba(17, 17, 19, 0.28), 0 8px 20px -4px rgba(17, 17, 19, 0.14), inset 0 0 0 1.25px rgba(255, 255, 255, 0.18)',
            }}
          >
            {/* Left Hardware Buttons */}
            <div className="pointer-events-none absolute -left-[2.5px] top-[78px] w-[2.5px] h-[18px] rounded-l-sm bg-[#2a2b30]" />
            <div className="pointer-events-none absolute -left-[2.5px] top-[110px] w-[2.5px] h-[34px] rounded-l-sm bg-[#2a2b30]" />
            <div className="pointer-events-none absolute -left-[2.5px] top-[152px] w-[2.5px] h-[34px] rounded-l-sm bg-[#2a2b30]" />
            {/* Right Hardware Power Button */}
            <div className="pointer-events-none absolute -right-[2.5px] top-[124px] w-[2.5px] h-[48px] rounded-r-sm bg-[#2a2b30]" />

            {/* Inner Rounded 19.5:9 Phone Screen Viewport */}
            <div
              className="relative overflow-hidden rounded-[36px] bg-[#fcfbf8]"
              style={{
                width: `${phoneScreenW}px`,
                height: `${phoneScreenH}px`,
              }}
            >
              {/* Subtle Dynamic Island Pill */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[7px] left-1/2 -translate-x-1/2 z-[75] w-[62px] h-[14px] rounded-full bg-[#0b0b0d] flex items-center justify-end pr-2 shadow-sm"
              >
                <div className="w-[4.5px] h-[4.5px] rounded-full bg-[#1a1d26] ring-1 ring-white/10" />
              </div>

              {/* Scaled 390x844 Live Sadija Website Container */}
              <div
                data-camera-rig
                style={{
                  width: `${PHONE_WIDTH}px`,
                  height: `${PHONE_HEIGHT}px`,
                  transform: `scale(${PHONE_SCALE})`,
                  transformOrigin: 'top left',
                }}
                className="relative"
              >
                <SadijaApp />
                {/* Simulated Touch Ripple Cursor inside the phone screen */}
                <TouchRippleCursor state={cursor} />
              </div>

              {/* Subtle iOS Home Indicator Bar */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[5px] left-1/2 -translate-x-1/2 z-[75] w-[86px] h-[3.5px] rounded-full bg-[#141518]/25"
              />
            </div>
          </div>
        </div>

        {/* 3. Quiet Little Branding at the Very Bottom */}
        <div className="pb-3.5 pt-1 flex items-center justify-center font-mono text-[9.5px] tracking-[0.2em] text-[#66666e]/80 lowercase">
          <span>agure.space</span>
        </div>

        {/* 4. Finale (24.4s – 30.0s): sadija.info -> Link Glides Up -> by -> Signature */}
        <CenterSignatureFinale elapsed={elapsed} />

        {/* 5. Instagram / TikTok Danger & Safe Zones Visual Guide (Hidden during final video recording) */}
        <ReelSafeZoneGuide visible={showSafeZones && !isRecording} />

        {/* 6. Pre-Roll Director Control Bar (Hidden during playback & recording) */}
        {showControlsHint && !isPlaying && !isCountingDown && !isRecording && (
          <div className="absolute bottom-4 left-4 right-4 z-[90] rounded-2xl bg-[#111113]/95 text-[#f6f5f2] px-4 py-3 border border-white/10 shadow-2xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-emerald-400">
                  {assetsReady ? '● 60 FPS STUDIO READY (NO CUTS)' : 'LOADING ASSETS...'}
                </span>
                <span className="font-sans text-[11px] font-medium text-[#f6f5f2] mt-0.5">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px]">R</kbd> record ·{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px]">Space</kbd> preview ·{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px]">M</kbd> music ·{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px]">S</kbd> safe zones ·{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-white/15 font-mono text-[10px]">D</kbd> drop beat
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowSafeZones((prev) => !prev)}
                  className={`px-2.5 py-2 rounded-lg font-mono text-[9px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                    showSafeZones
                      ? 'bg-red-500/25 text-red-300 border border-red-500/40 hover:bg-red-500/35'
                      : 'bg-white/10 text-white/50 hover:bg-white/15'
                  }`}
                  title="Toggle Instagram / TikTok Safe Zone Danger Overlay (S)"
                >
                  {showSafeZones ? '🛡️ Safe Zones: ON' : '🛡️ Safe Zones: OFF'}
                </button>
                <button
                  type="button"
                  onClick={startReelWithCountdown}
                  className="px-3 py-2 rounded-lg bg-white/10 text-[#f6f5f2] font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] hover:bg-white/20 transition-colors"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={startBrowserRecording}
                  className="px-3.5 py-2 rounded-lg bg-[#f6f5f2] text-[#111113] font-mono text-[9.5px] font-bold uppercase tracking-[0.08em] hover:opacity-90 transition-opacity"
                >
                  Record 9:16
                </button>
              </div>
            </div>

            {/* Music Controls Bar */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-2 min-w-0">
                {/* Music Toggle */}
                <button
                  type="button"
                  onClick={() => setMusicEnabled((prev) => !prev)}
                  className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors shrink-0 ${
                    musicEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/10 text-white/50 border border-white/10'
                  }`}
                  title="Toggle Music (M)"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${musicEnabled ? 'bg-emerald-400' : 'bg-white/30'}`} />
                  <span>{musicEnabled ? 'MUSIC ON' : 'MUSIC OFF'}</span>
                </button>

                {/* Track Selector with Prev/Next */}
                <div className="flex items-center gap-1 bg-white/10 rounded px-1.5 py-0.5 border border-white/10 min-w-0">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTrackIndex((prev) => (prev > 0 ? prev - 1 : REEL_MUSIC_TRACKS.length - 1))
                    }
                    className="px-1 py-0.5 hover:text-white text-white/60 text-[10px]"
                    title="Previous Track"
                  >
                    ◀
                  </button>
                  <span className="truncate max-w-[130px] sm:max-w-[170px] text-white/90 px-1 font-sans text-[11px] font-medium">
                    {selectedTrackIndex + 1}. {REEL_MUSIC_TRACKS[selectedTrackIndex].title}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTrackIndex((prev) => (prev < REEL_MUSIC_TRACKS.length - 1 ? prev + 1 : 0))
                    }
                    className="px-1 py-0.5 hover:text-white text-white/60 text-[10px]"
                    title="Next Track"
                  >
                    ▶
                  </button>
                </div>

                {/* Preview Track Audio Button */}
                <button
                  type="button"
                  onClick={toggleMusicPreview}
                  className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors shrink-0"
                  title="Preview / test selected track"
                >
                  {isPreviewPlaying ? '⏸ Stop' : '▶ Test'}
                </button>
              </div>

              {/* Volume Switcher */}
              <button
                type="button"
                onClick={() => {
                  setMusicVolume((prev) => (prev === 0.3 ? 0.45 : prev === 0.45 ? 0.65 : 0.3));
                }}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/70 transition-colors shrink-0"
                title="Cycle Volume: 30% -> 45% -> 65%"
              >
                Vol {Math.round(musicVolume * 100)}%
              </button>
            </div>

            {/* Beat Drop / Start Offset Scrubber */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5 text-[10px] font-mono">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <span>⚡ Beat Drop:</span>
                    <span className="text-white px-1.5 py-0.5 bg-white/15 rounded text-[10px]">
                      {currentOffset.toFixed(1)}s
                    </span>
                  </span>
                  {isPreviewPlaying && (
                    <span className="text-white/50 text-[9px]">
                      (playing: {audioCurrentTime.toFixed(1)}s)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setOffsetForCurrentTrack(currentOffset - 5)}
                    className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/80 text-[9px]"
                    title="Jump back 5s"
                  >
                    -5s
                  </button>
                  <button
                    type="button"
                    onClick={() => setOffsetForCurrentTrack(currentOffset + 5)}
                    className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/80 text-[9px]"
                    title="Jump forward 5s"
                  >
                    +5s
                  </button>
                  <button
                    type="button"
                    onClick={() => setOffsetForCurrentTrack(0)}
                    className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/60 text-[9px]"
                    title="Reset start to 0s"
                  >
                    0s
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (musicAudioRef.current) {
                        setOffsetForCurrentTrack(musicAudioRef.current.currentTime);
                      }
                    }}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all ${
                      isPreviewPlaying
                        ? 'bg-amber-400 text-black hover:bg-amber-300 ring-1 ring-amber-300'
                        : 'bg-white/15 text-white/80 hover:bg-white/25'
                    }`}
                    title="Set start offset to current playing time (Hot key: D)"
                  >
                    📌 Drop Here (D)
                  </button>
                </div>
              </div>

              {/* Range Slider for scrubbing the song start */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-white/40 shrink-0">0:00</span>
                <input
                  type="range"
                  min="0"
                  max={Math.max(30, Math.floor(audioDuration || 90))}
                  step="0.5"
                  value={currentOffset}
                  onChange={(e) => setOffsetForCurrentTrack(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  title="Scrub start time / beat drop"
                />
                <span className="text-[9px] text-white/40 shrink-0">
                  {Math.floor((audioDuration || 90) / 60)}:
                  {String(Math.floor((audioDuration || 90) % 60)).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ReelDirector;
