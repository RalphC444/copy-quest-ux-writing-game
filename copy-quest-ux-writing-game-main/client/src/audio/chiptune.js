// Tiny Web Audio chiptune engine: a looping background track plus UI sound effects.
// Everything is synthesized, so there are no audio files to load.

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

// 32 eighth-note steps = 4 bars. null = rest.
const LEAD = [
  72, null, 75, 77, 79, null, 77, 75,
  74, null, 75, 77, 74, null, 70, null,
  72, null, 75, 77, 79, null, 82, 79,
  77, 75, 74, 75, 72, null, null, null,
];
const ROOTS = [48, 44, 46, 43]; // C, Ab, Bb, G
const ARP = [0, 12, 7, 12, 3, 12, 7, 12];

class Chiptune {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.muted = false;
    this.timer = null;
    this.step = 0;
    this.nextTime = 0;
    this.bpm = 132;
  }

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.5;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.55;
    this.musicGain.connect(this.master);
    const len = this.ctx.sampleRate * 0.2;
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return this.ctx;
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.5, this.ctx.currentTime, 0.02);
  }

  tone(freq, start, dur, { type = 'square', vol = 0.15, dest, slide } = {}) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slide) osc.frequency.exponentialRampToValueAtTime(slide, start + dur);
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g).connect(dest || this.master);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  hat(start, vol = 0.05) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.05);
    src.connect(hp).connect(g).connect(this.musicGain);
    src.start(start);
    src.stop(start + 0.06);
  }

  scheduleStep(step, t) {
    const eighth = 60 / this.bpm / 2;
    const bar = Math.floor(step / 8) % 4;
    const n = LEAD[step % 32];
    if (n) this.tone(midi(n), t, eighth * 0.9, { type: 'square', vol: 0.07, dest: this.musicGain });
    const root = ROOTS[bar];
    this.tone(midi(root + ARP[step % 8] - 12), t, eighth * 0.8, { type: 'triangle', vol: 0.16, dest: this.musicGain });
    if (step % 4 === 0) this.tone(150, t, 0.12, { type: 'sine', vol: 0.3, dest: this.musicGain, slide: 45 });
    if (step % 2 === 1) this.hat(t);
  }

  startMusic(bpm = 132) {
    if (!this.ensure()) return;
    this.stopMusic();
    this.bpm = bpm;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.08;
    this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
    this.timer = setInterval(() => {
      const eighth = 60 / this.bpm / 2;
      while (this.nextTime < this.ctx.currentTime + 0.12) {
        this.scheduleStep(this.step, this.nextTime);
        this.nextTime += eighth;
        this.step++;
      }
    }, 25);
  }

  setTempo(bpm) { this.bpm = bpm; }

  stopMusic() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }
  }

  // --- sound effects ---
  snare(start, vol = 0.12) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1800;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.07);
    src.connect(bp).connect(g).connect(this.master);
    src.start(start);
    src.stop(start + 0.08);
  }

  play(name, arg) {
    if (!this.ensure()) return;
    const t = this.ctx.currentTime;
    const seq = (notes, step, opts) => notes.forEach((n, i) => n && this.tone(midi(n), t + i * step, step * 1.4, opts));
    switch (name) {
      case 'hover': this.tone(1200, t, 0.03, { vol: 0.03 }); break;
      case 'select': seq([76, 83], 0.05, { vol: 0.08 }); break;
      case 'back': seq([72, 65], 0.05, { vol: 0.07 }); break;
      case 'type': this.tone(1800 + Math.random() * 300, t, 0.012, { vol: 0.015 }); break;
      case 'tick': this.tone(880, t, 0.06, { vol: 0.08 }); break;
      case 'count': this.tone(midi(69), t, 0.18, { vol: 0.12 }); break;
      case 'go': seq([81, 88], 0.08, { vol: 0.12 }); break;
      case 'clear': seq([72, 76, 79, 84], 0.07, { vol: 0.1 }); break;
      case 'locked': this.tone(110, t, 0.18, { type: 'sawtooth', vol: 0.08 }); break;
      case 'win': seq([72, 76, 79, 84, null, 79, 84, 88], 0.11, { vol: 0.1 }); break;
      case 'ok': seq([67, 72, 76, 72], 0.12, { vol: 0.09 }); break;
      case 'drumroll':
        for (let i = 0; i < 26; i++) this.snare(t + i * 0.045, 0.04 + (i / 26) * 0.1);
        break;
      case 'card': {
        // Higher cards get a brighter "ding".
        const v = Math.max(1, Math.min(10, arg || 5));
        this.snare(t, 0.15);
        this.tone(midi(60 + v * 2), t + 0.04, 0.25, { vol: 0.1 });
        if (v >= 8) this.tone(midi(67 + v * 2), t + 0.12, 0.25, { vol: 0.08 });
        if (v <= 4) this.tone(midi(48), t + 0.1, 0.3, { type: 'sawtooth', vol: 0.06, slide: midi(40) });
        break;
      }
      case 'lose': seq([67, 63, 60, 55], 0.16, { type: 'triangle', vol: 0.18 }); break;
      default: break;
    }
  }
}

export const audio = new Chiptune();
