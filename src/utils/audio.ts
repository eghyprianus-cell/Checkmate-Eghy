/**
 * Procedural Web Audio API Sound & Soundtrack Generator for Petir Biru Chess
 * Generates rich electric arcs, thunderclaps, move sounds, and procedural electronic soundtracks.
 * Zero external asset dependencies - completely self-contained and instant.
 */

import type { SoundtrackTrack } from '../types';

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.5;

  // Soundtrack engine properties
  private currentTrack: SoundtrackTrack = 'none';
  private musicGainNode: GainNode | null = null;
  private musicIntervalId: number | null = null;
  private activeMusicSources: (AudioNode | OscillatorNode | AudioBufferSourceNode)[] = [];
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(
        muted ? 0 : this.musicVolume * 0.12,
        this.ctx.currentTime
      );
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSfxVolume(volPercent: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volPercent / 100));
  }

  public setMusicVolume(volPercent: number) {
    this.musicVolume = Math.max(0, Math.min(1, volPercent / 100));
    if (this.musicGainNode && this.ctx) {
      this.musicGainNode.gain.setValueAtTime(
        this.isMuted ? 0 : this.musicVolume * 0.12,
        this.ctx.currentTime
      );
    }
  }

  /**
   * Sound 1: Electric Tile Tap / Selection Click
   */
  public playSelect(soundStyle: 'electric' | 'classic' = 'electric') {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (soundStyle === 'classic') {
      // Classic wooden chess piece tap
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    } else {
      // Electric chirp
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      gain.gain.setValueAtTime(0.09 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.08);
  }

  /**
   * Sound 2: Lightning Arc Move (Electric zap)
   */
  public playMove(soundStyle: 'electric' | 'classic' = 'electric') {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (soundStyle === 'classic') {
      // Deep solid wooden chess piece drop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.09);

      gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
      return;
    }

    // High frequency electric zap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);

    // Electrostatic crackle layer
    this.playCrackle(now, 0.12, 0.1 * this.sfxVolume);
  }

  /**
   * Sound 3: Thunder Strike Capture (Boom + electric distortion)
   */
  public playCapture() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Heavy low thunder rumble
    const thunderOsc = this.ctx.createOscillator();
    const thunderGain = this.ctx.createGain();

    thunderOsc.type = 'sine';
    thunderOsc.frequency.setValueAtTime(160, now);
    thunderOsc.frequency.exponentialRampToValueAtTime(35, now + 0.6);

    thunderGain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
    thunderGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    thunderOsc.connect(thunderGain);
    thunderGain.connect(this.ctx.destination);

    thunderOsc.start(now);
    thunderOsc.stop(now + 0.65);

    // 2. High-energy lightning zap crackle
    this.playCrackle(now, 0.45, 0.25 * this.sfxVolume);

    // 3. Piercing plasma strike
    const zapOsc = this.ctx.createOscillator();
    const zapGain = this.ctx.createGain();
    zapOsc.type = 'square';
    zapOsc.frequency.setValueAtTime(1800, now);
    zapOsc.frequency.exponentialRampToValueAtTime(120, now + 0.2);

    zapGain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
    zapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    zapOsc.connect(zapGain);
    zapGain.connect(this.ctx.destination);

    zapOsc.start(now);
    zapOsc.stop(now + 0.2);
  }

  /**
   * Sound 4: Check / Skak (High voltage warning arc)
   */
  public playCheck() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.1, 0.2].forEach((offset, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33 + idx * 120, now + offset);
      osc.frequency.exponentialRampToValueAtTime(880, now + offset + 0.12);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.15);
    });

    this.playCrackle(now, 0.3, 0.2 * this.sfxVolume);
  }

  /**
   * Sound 5: Checkmate / Victory Super Thunder
   */
  public playCheckmate() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    [220, 277.18, 329.63, 440, 554.37].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + 1.2);
    });

    this.playCrackle(now, 1.0, 0.3 * this.sfxVolume);
  }

  /**
   * Sound 6: Storm Power Ability Activation
   */
  public playStormPower() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.35);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);

    this.playCrackle(now + 0.15, 0.3, 0.2 * this.sfxVolume);
  }

  /**
   * Sound 7: Invalid Move / Rejection Electric Hum
   */
  public playInvalid() {
    if (this.isMuted || this.sfxVolume <= 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.setValueAtTime(110, now + 0.08);

    gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  /**
   * Procedural noise crackle synthesizer
   */
  private playCrackle(startTime: number, duration: number, volume: number) {
    if (!this.ctx) return;

    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-3 * (i / bufferSize));
      if (Math.random() < 0.05) {
        data[i] *= 2.2;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  // ==============================================================
  // PROCEDURAL SOUNDTRACK ENGINE (BGM)
  // ==============================================================

  public setSoundtrack(track: SoundtrackTrack) {
    if (this.currentTrack === track) return;
    this.stopSoundtrack();
    this.currentTrack = track;

    if (track === 'none') return;
    this.initCtx();
    if (!this.ctx) return;

    this.musicGainNode = this.ctx.createGain();
    this.musicGainNode.gain.setValueAtTime(
      this.isMuted ? 0 : this.musicVolume * 0.12,
      this.ctx.currentTime
    );
    this.musicGainNode.connect(this.ctx.destination);

    if (track === 'cyber-storm') {
      this.startCyberStormTrack();
    } else if (track === 'dark-ambient') {
      this.startDarkAmbientTrack();
    } else if (track === 'thunder-rain') {
      this.startThunderRainTrack();
    }
  }

  public getSoundtrack(): SoundtrackTrack {
    return this.currentTrack;
  }

  public stopSoundtrack() {
    if (this.musicIntervalId !== null) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }

    this.activeMusicSources.forEach((src) => {
      try {
        if ('stop' in src && typeof src.stop === 'function') {
          src.stop();
        }
        src.disconnect();
      } catch {}
    });
    this.activeMusicSources = [];

    if (this.rainSource) {
      try {
        this.rainSource.stop();
        this.rainSource.disconnect();
      } catch {}
      this.rainSource = null;
    }

    if (this.musicGainNode) {
      try {
        this.musicGainNode.disconnect();
      } catch {}
      this.musicGainNode = null;
    }

    this.currentTrack = 'none';
  }

  /**
   * Soundtrack 1: "Cyber Storm"
   * Synth arpeggiator with atmospheric chord progression (Dm - Bb - Gm - A) and electro-pulse
   */
  private startCyberStormTrack() {
    if (!this.ctx || !this.musicGainNode) return;

    // Chords (frequencies in Hz)
    const chords = [
      [146.83, 174.61, 220.0, 293.66], // Dm (D3, F3, A3, D4)
      [116.54, 146.83, 174.61, 233.08], // Bb (Bb2, D3, F3, Bb3)
      [98.0, 116.54, 146.83, 196.0],    // Gm (G2, Bb2, D3, G3)
      [110.0, 138.59, 164.81, 220.0],   // A (A2, C#3, E3, A3)
    ];

    let chordIndex = 0;
    let step = 0;

    const playStep = () => {
      if (!this.ctx || !this.musicGainNode) return;
      const now = this.ctx.currentTime;
      const currentChord = chords[chordIndex];
      const noteFreq = currentChord[step % currentChord.length];

      // Arp synth note
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(noteFreq * (step % 2 === 0 ? 1 : 2), now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + Math.sin(step) * 600, now);
      filter.Q.setValueAtTime(4, now);

      noteGain.gain.setValueAtTime(0.08, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.musicGainNode);

      osc.start(now);
      osc.stop(now + 0.18);

      // Low sub bass on beat 0
      if (step === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(currentChord[0] * 0.5, now);

        bassGain.gain.setValueAtTime(0.22, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGainNode);

        bassOsc.start(now);
        bassOsc.stop(now + 1.25);
      }

      step++;
      if (step >= 8) {
        step = 0;
        chordIndex = (chordIndex + 1) % chords.length;
      }
    };

    // 16th note timing at 116 BPM (~130ms per step)
    this.musicIntervalId = window.setInterval(playStep, 130);
  }

  /**
   * Soundtrack 2: "Dark Ambient"
   * Deep meditation drone, evolving resonant pads and cosmic storm textures
   */
  private startDarkAmbientTrack() {
    if (!this.ctx || !this.musicGainNode) return;

    const droneFreqs = [73.42, 110.0, 146.83, 220.0]; // D2, A2, D3, A3

    droneFreqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.8, this.ctx!.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260 + idx * 80, this.ctx!.currentTime);
      filter.Q.setValueAtTime(2.5, this.ctx!.currentTime);

      gain.gain.setValueAtTime(0.06 / (idx + 1), this.ctx!.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGainNode!);

      osc.start();
      this.activeMusicSources.push(osc);
    });

    // Slow atmospheric pulse chord
    let count = 0;
    this.musicIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.musicGainNode) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(count % 2 === 0 ? 293.66 : 220.0, now); // D4 or A3

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);

      osc.connect(gain);
      gain.connect(this.musicGainNode);

      osc.start(now);
      osc.stop(now + 4.2);
      count++;
    }, 4500);
  }

  /**
   * Soundtrack 3: "Thunder Rain"
   * Atmospheric filtered rain noise with procedural distant thunder rolls
   */
  private startThunderRainTrack() {
    if (!this.ctx || !this.musicGainNode) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.1;
    }

    this.rainSource = this.ctx.createBufferSource();
    this.rainSource.buffer = buffer;
    this.rainSource.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    this.rainSource.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.musicGainNode);

    this.rainSource.start();

    // Occasional rolling thunder boom
    this.musicIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.musicGainNode) return;
      const now = this.ctx.currentTime;
      const thunderOsc = this.ctx.createOscillator();
      const thunderGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      thunderOsc.type = 'sawtooth';
      thunderOsc.frequency.setValueAtTime(95, now);
      thunderOsc.frequency.exponentialRampToValueAtTime(32, now + 1.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);

      thunderGain.gain.setValueAtTime(0.001, now);
      thunderGain.gain.linearRampToValueAtTime(0.25, now + 0.3);
      thunderGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      thunderOsc.connect(filter);
      filter.connect(thunderGain);
      thunderGain.connect(this.musicGainNode);

      thunderOsc.start(now);
      thunderOsc.stop(now + 2.4);
    }, 6000);
  }
}

export const sounds = new SoundController();
