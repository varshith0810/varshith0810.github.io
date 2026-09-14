/**
 * Audio Engine: Web Audio API Procedural Synthesizer
 * Generates anime sound effects directly in-browser:
 * - Katana Unsheathe / Slash (Demon Slayer)
 * - Metavision Pulse / Lock-in (Blue Lock)
 * - Puzzle Snap / Tactical Click
 * - Awakening Power Surge
 * - Mode Shift Whoosh
 */

class AnimeAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('portfolio_audio_muted') === 'true';
    this.hasInteracted = false;
    this.initAudioContext();
  }

  initAudioContext() {
    // Lazy initialize to adhere to browser autoplay policies
    const unlockAudio = () => {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.hasInteracted = true;
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('portfolio_audio_muted', this.isMuted);
    if (!this.isMuted) {
      this.playPuzzleClick();
    }
    return this.isMuted;
  }

  // Katana blade slash / unsheathe whoosh with high metallic resonance
  playKatanaSlash() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Noise buffer for the air whoosh
      const bufferSize = ctx.sampleRate * 0.28;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter sweeping downward for swift slash
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(380, now + 0.25);
      filter.Q.setValueAtTime(4, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.27);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      // High metallic chime (Nichirin blade ring)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2480, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(1240, now + 0.35);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.setValueAtTime(0.18, now + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noise.start(now);
      osc.start(now + 0.05);
      osc.stop(now + 0.45);
    } catch (e) {
      console.debug('Audio playback throttled:', e);
    }
  }

  // Blue Lock Metavision spatial lock-in hum
  playMetavisionHum() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';

      // Futuristic sweep upwards then lock-in
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(560, now + 0.18);
      osc1.frequency.setValueAtTime(560, now + 0.18);

      osc2.frequency.setValueAtTime(280, now);
      osc2.frequency.exponentialRampToValueAtTime(1120, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);
      filter.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.debug(e);
    }
  }

  // Puzzle click / Tactical HUD click
  playPuzzleClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.debug(e);
    }
  }

  // Hover tick (subtle tactical blip)
  playHoverTick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.setValueAtTime(2200, now + 0.02);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.debug(e);
    }
  }

  // Domain Shift: Mode Switch sound (grand chord + sweeping transition)
  playDomainShift(toTheme) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (toTheme === 'bluelock') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(4500, now + 0.3);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(ctx.destination);
      } else {
        this.playKatanaSlash();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.4);

        gain.gain.setValueAtTime(0.25, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.debug(e);
    }
  }

  // Awakening Special Burst Sound
  playAwakeningBurst() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(320, now);
      sub.frequency.exponentialRampToValueAtTime(40, now + 0.6);

      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      sub.connect(subGain);
      subGain.connect(ctx.destination);

      sub.start(now);
      sub.stop(now + 0.7);

      [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => {
        const tone = ctx.createOscillator();
        const toneGain = ctx.createGain();
        tone.type = 'triangle';
        tone.frequency.setValueAtTime(freq, now + index * 0.08);

        toneGain.gain.setValueAtTime(0.001, now);
        toneGain.gain.setValueAtTime(0.12, now + index * 0.08);
        toneGain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.5);

        tone.connect(toneGain);
        toneGain.connect(ctx.destination);

        tone.start(now + index * 0.08);
        tone.stop(now + index * 0.08 + 0.5);
      });
    } catch (e) {
      console.debug(e);
    }
  }

  // Hinokami Kagura Dual Solar Slash Cutscene Audio
  playHinokamiCutsceneSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Slash 1: Katana slice whoosh
      this.playKatanaSlash();

      // Slash 2: Staggered cross-slash
      setTimeout(() => {
        this.playKatanaSlash();
      }, 280);

      // Deep solar flame explosion boom at intersection
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, now + 0.45);
      sub.frequency.exponentialRampToValueAtTime(32, now + 1.2);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.setValueAtTime(0.4, now + 0.45);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now + 0.45);
      sub.stop(now + 1.2);

      // Fiery sizzle noise buffer
      const bufferSize = ctx.sampleRate * 0.9;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now + 0.45);
      filter.frequency.exponentialRampToValueAtTime(300, now + 1.3);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.setValueAtTime(0.18, now + 0.45);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now + 0.45);
      noise.stop(now + 1.35);
    } catch (e) {
      console.debug(e);
    }
  }

  // Blue Lock Direct Shot Dual Volley Cutscene Audio
  playDirectShotCutsceneSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Heavy kinetic kick impact 1
      const kick1 = ctx.createOscillator();
      const kickGain1 = ctx.createGain();
      kick1.type = 'triangle';
      kick1.frequency.setValueAtTime(180, now);
      kick1.frequency.exponentialRampToValueAtTime(45, now + 0.28);
      kickGain1.gain.setValueAtTime(0.4, now);
      kickGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      kick1.connect(kickGain1);
      kickGain1.connect(ctx.destination);
      kick1.start(now);
      kick1.stop(now + 0.3);

      // Heavy kinetic kick impact 2
      const kick2 = ctx.createOscillator();
      const kickGain2 = ctx.createGain();
      kick2.type = 'triangle';
      kick2.frequency.setValueAtTime(220, now + 0.28);
      kick2.frequency.exponentialRampToValueAtTime(40, now + 0.58);
      kickGain2.gain.setValueAtTime(0.001, now);
      kickGain2.gain.setValueAtTime(0.42, now + 0.28);
      kickGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      kick2.connect(kickGain2);
      kickGain2.connect(ctx.destination);
      kick2.start(now + 0.28);
      kick2.stop(now + 0.6);

      // Metavision sonic boom at intersection
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(160, now + 0.45);
      sub.frequency.exponentialRampToValueAtTime(28, now + 1.3);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.setValueAtTime(0.45, now + 0.45);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now + 0.45);
      sub.stop(now + 1.3);

      // Electric laser frequency sweep
      const sweep = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweep.type = 'sawtooth';
      sweep.frequency.setValueAtTime(350, now + 0.45);
      sweep.frequency.exponentialRampToValueAtTime(2400, now + 0.7);
      sweepGain.gain.setValueAtTime(0.001, now);
      sweepGain.gain.setValueAtTime(0.14, now + 0.45);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      sweep.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweep.start(now + 0.45);
      sweep.stop(now + 0.75);
    } catch (e) {
      console.debug(e);
    }
  }
}

// Attach globally
window.animeAudio = new AnimeAudioEngine();
