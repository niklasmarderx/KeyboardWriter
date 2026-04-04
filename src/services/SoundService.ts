/**
 * Sound Service
 * Manages audio feedback for typing actions
 */

type SoundType =
  | 'keypress'
  | 'correct'
  | 'incorrect'
  | 'success'
  | 'levelup'
  | 'achievement'
  | 'countdown'
  | 'timesup';

interface SoundSettings {
  enabled: boolean;
  volume: number;
  keyboardSounds: boolean;
  feedbackSounds: boolean;
}

class SoundServiceClass {
  private audioContext: AudioContext | null = null;
  private readonly sounds: Map<SoundType, AudioBuffer> = new Map();
  private settings: SoundSettings = {
    enabled: true,
    volume: 0.5,
    keyboardSounds: true,
    feedbackSounds: true,
  };
  private initialized: boolean = false;

  constructor() {
    this.loadSettings();
  }

  /**
   * Initialize the audio context (must be called after user interaction)
   */
  init(): void {
    if (this.initialized) {
      return;
    }

    try {
      this.audioContext = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
      this.generateSounds();
      this.initialized = true;
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  /**
   * Generate synthesized sounds
   */
  private generateSounds(): void {
    if (!this.audioContext) {
      return;
    }

    // Generate keypress sound (short click)
    this.sounds.set('keypress', this.createClickSound(0.02, 800, 0.15));

    // Generate correct sound (pleasant ding)
    this.sounds.set('correct', this.createToneSound(0.1, [523.25, 659.25], 0.2));

    // Generate incorrect sound (low buzz)
    this.sounds.set('incorrect', this.createToneSound(0.15, [200, 180], 0.25));

    // Generate success sound (triumphant chord)
    this.sounds.set('success', this.createChordSound(0.5, [523.25, 659.25, 783.99], 0.3));

    // Generate level up sound (ascending tones)
    this.sounds.set('levelup', this.createAscendingSound(0.6, [392, 523.25, 659.25, 783.99], 0.25));

    // Generate achievement sound (fanfare)
    this.sounds.set('achievement', this.createFanfareSound(0.8, 0.3));

    // Generate countdown tick
    this.sounds.set('countdown', this.createClickSound(0.05, 1000, 0.2));

    // Generate time's up sound
    this.sounds.set('timesup', this.createToneSound(0.3, [440, 349.23], 0.4));
  }

  /**
   * Create a click sound
   */
  private createClickSound(duration: number, frequency: number, volume: number): AudioBuffer {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    const sampleRate = this.audioContext.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 50);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * volume;
    }

    return buffer;
  }

  /**
   * Create a tone sound with multiple frequencies
   */
  private createToneSound(duration: number, frequencies: number[], volume: number): AudioBuffer {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    const sampleRate = this.audioContext.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 5);
      let sample = 0;

      for (const freq of frequencies) {
        sample += Math.sin(2 * Math.PI * freq * t);
      }

      data[i] = (sample / frequencies.length) * envelope * volume;
    }

    return buffer;
  }

  /**
   * Create a chord sound
   */
  private createChordSound(duration: number, frequencies: number[], volume: number): AudioBuffer {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    const sampleRate = this.audioContext.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const attack = Math.min(t * 20, 1);
      const decay = Math.exp(-(t - 0.05) * 3);
      const envelope = attack * decay;

      let sample = 0;
      for (const freq of frequencies) {
        sample += Math.sin(2 * Math.PI * freq * t);
      }

      data[i] = (sample / frequencies.length) * envelope * volume;
    }

    return buffer;
  }

  /**
   * Create ascending tones
   */
  private createAscendingSound(
    duration: number,
    frequencies: number[],
    volume: number
  ): AudioBuffer {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    const sampleRate = this.audioContext.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    const noteLength = length / frequencies.length;

    for (let i = 0; i < length; i++) {
      const noteIndex = Math.floor(i / noteLength);
      const freq = frequencies[Math.min(noteIndex, frequencies.length - 1)];
      const t = i / sampleRate;
      const noteT = (i % noteLength) / sampleRate;
      const envelope = Math.exp(-noteT * 8);

      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * volume;
    }

    return buffer;
  }

  /**
   * Create fanfare sound
   */
  private createFanfareSound(duration: number, volume: number): AudioBuffer {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    const sampleRate = this.audioContext.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Fanfare frequencies (C5, E5, G5, C6)
    const notes = [
      { freq: 523.25, start: 0, duration: 0.15 },
      { freq: 659.25, start: 0.15, duration: 0.15 },
      { freq: 783.99, start: 0.3, duration: 0.15 },
      { freq: 1046.5, start: 0.45, duration: 0.35 },
    ];

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      for (const note of notes) {
        if (t >= note.start && t < note.start + note.duration) {
          const noteT = t - note.start;
          const envelope = Math.exp(-noteT * 5);
          sample += Math.sin(2 * Math.PI * note.freq * t) * envelope;
        }
      }

      data[i] = sample * volume;
    }

    return buffer;
  }

  /**
   * Play a sound
   */
  play(type: SoundType): void {
    if (!this.settings.enabled || !this.audioContext || !this.initialized) {
      return;
    }

    // Check specific sound type settings
    if (type === 'keypress' && !this.settings.keyboardSounds) {
      return;
    }

    if (
      ['correct', 'incorrect', 'success', 'levelup', 'achievement'].includes(type) &&
      !this.settings.feedbackSounds
    ) {
      return;
    }

    const buffer = this.sounds.get(type);
    if (!buffer) {
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = this.settings.volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  /**
   * Play keypress sound
   */
  playKeypress(): void {
    this.play('keypress');
  }

  /**
   * Play correct answer sound
   */
  playCorrect(): void {
    this.play('correct');
  }

  /**
   * Play incorrect answer sound
   */
  playIncorrect(): void {
    this.play('incorrect');
  }

  /**
   * Play success/completion sound
   */
  playSuccess(): void {
    this.play('success');
  }

  /**
   * Play level up sound
   */
  playLevelUp(): void {
    this.play('levelup');
  }

  /**
   * Play achievement sound
   */
  playAchievement(): void {
    this.play('achievement');
  }

  /**
   * Play countdown tick
   */
  playCountdown(): void {
    this.play('countdown');
  }

  /**
   * Play time's up sound
   */
  playTimesUp(): void {
    this.play('timesup');
  }

  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<SoundSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  /**
   * Get current settings
   */
  getSettings(): SoundSettings {
    return { ...this.settings };
  }

  /**
   * Toggle sounds on/off
   */
  toggle(): void {
    this.settings.enabled = !this.settings.enabled;
    this.saveSettings();
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem('typecraft_sound_settings');
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SoundSettings>;
        this.settings = { ...this.settings, ...parsed };
      }
    } catch (error) {
      console.warn('Error loading sound settings:', error);
    }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('typecraft_sound_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Error saving sound settings:', error);
    }
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.settings.enabled;
  }

  /**
   * Check if initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

// Export singleton instance
export const SoundService = new SoundServiceClass();
