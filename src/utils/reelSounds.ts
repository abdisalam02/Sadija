/**
 * Web Audio API Sound Synthesizer for 60 FPS Reel Director.
 * Synthesizes pristine, low-latency sound effects for the finale:
 * 1. Crystal link chime when sadija.info reveals
 * 2. Authentic fountain pen paper-scratch strokes as A. Gure is signed
 * 3. Fluid ink flourish swoosh as the underline sweeps across
 */

let sharedAudioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Modern soft chime/tap when the link appears (25.1s)
 */
export function playLinkChime(volume = 0.16) {
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    // Dual crystalline sine tones (F#6 / B6 harmonic chime)
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(740, now);
    osc1.frequency.exponentialRampToValueAtTime(1480, now + 0.04);
    osc1.frequency.exponentialRampToValueAtTime(1110, now + 0.18);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1480, now);
    osc2.frequency.exponentialRampToValueAtTime(1860, now + 0.08);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.22);
    osc2.stop(now + 0.22);
  } catch {}
}

/**
 * Micro-stroke of a fountain pen nib scratching on fine textured paper (26.7s – 28.0s)
 */
export function playPenStroke(volume = 0.09) {
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 0.065 + Math.random() * 0.035;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Textured grain noise with gentle envelope
    for (let i = 0; i < bufferSize; i++) {
      const windowEnv = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * windowEnv;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Resonant bandpass filter modeling nib metal vibration on paper grain
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2600 + (Math.random() - 0.5) * 800, now);
    bandpass.Q.setValueAtTime(3.2, now);

    // Highpass to eliminate low thumps
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(1400, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * (0.8 + Math.random() * 0.4), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  } catch {}
}

/**
 * Fluid ink flourish swoosh as the underline sweeps across (27.85s)
 */
export function playFlourishWhoosh(volume = 0.12) {
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 0.32;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gliding frequency simulating a rapid pen stroke sweep
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(1180, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(620, now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {}
}
