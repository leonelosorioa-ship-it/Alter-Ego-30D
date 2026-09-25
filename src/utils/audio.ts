// Web Audio sound generator for mindful coaching cues

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Lazy initialize on first interaction
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleSound(enabled?: boolean) {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    return this.soundEnabled;
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  // Soft zen bowl chime for question arrival
  public playMessageChime() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz transformation frequency
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio not permitted or interrupted
    }
  }

  // Resonant celebration gong when Master Sheet is born
  public playMasterSheetCeremony() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const freqs = [261.63, 392.00, 523.25, 659.25]; // C major chord
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + 2.0);
      });
    } catch {
      // Ignore
    }
  }

  // Voice synthesis read-aloud helper
  public speak(text: string, gender: 'mujer' | 'hombre', onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    window.speechSynthesis.cancel();

    // Clean markdown asterisks and symbols for cleaner TTS
    const cleanText = text
      .replace(/[=*#•\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    
    // Choose pitch and rate suitable for each mentor
    if (gender === 'mujer') {
      utterance.pitch = 1.05;
      utterance.rate = 0.95; // warm, firm, deliberate
    } else {
      utterance.pitch = 0.88; // strategic, deeper, resolute
      utterance.rate = 0.92;
    }

    // Try finding a Spanish voice
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es') && (gender === 'mujer' ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('monica') || v.name.toLowerCase().includes('helena') || v.name.toLowerCase().includes('paulina') : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('jorge') || v.name.toLowerCase().includes('diego')));
    if (esVoice) {
      utterance.voice = esVoice;
    } else {
      const anyEs = voices.find(v => v.lang.startsWith('es'));
      if (anyEs) utterance.voice = anyEs;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundManager = new SoundManager();
