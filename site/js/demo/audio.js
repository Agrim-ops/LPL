/**
 * Web Audio API Engine for Drive Shield Simulation
 * Strict Honesty: Audio starts ONLY after user interaction/click.
 * 
 * Audio Spec:
 * - Caution: Gentle sine 523 Hz, 180 ms soft fades, vol 0.12, 1 beep / 1.0s
 * - Warning: Harsh square 1600 Hz, 110 ms on / 90 ms off (5 / sec), vol 0.3
 * - Parking Caution: Gentle beep every 0.8s
 * - Parking Warning: Harsh beep every 0.2s
 * - Silence when all clear.
 * - Only the alert currently shown makes sound.
 */

export class SimulationAudio {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = false;
    this.currentSoundMode = 'SILENCE'; // 'SILENCE', 'CAUTION', 'WARNING', 'PARKING_CAUTION', 'PARKING_WARNING'
    this.intervalId = null;
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    if (enabled) {
      this.ensureContext();
      this.startLoopForCurrentMode();
    } else {
      this.stop();
    }
  }

  setAlertMode(mode) {
    if (this.currentSoundMode === mode) return;
    this.currentSoundMode = mode;
    if (this.soundEnabled) {
      this.startLoopForCurrentMode();
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  startLoopForCurrentMode() {
    this.stop();
    if (!this.soundEnabled || !this.audioCtx || this.currentSoundMode === 'SILENCE') {
      return;
    }

    if (this.currentSoundMode === 'CAUTION') {
      this.playCautionBeep();
      this.intervalId = setInterval(() => {
        this.playCautionBeep();
      }, 1000); // 1.0 s interval
    } else if (this.currentSoundMode === 'WARNING') {
      this.playWarningBeep();
      this.intervalId = setInterval(() => {
        this.playWarningBeep();
      }, 200); // 5 beeps per second (110ms on + 90ms off = 200ms)
    } else if (this.currentSoundMode === 'PARKING_CAUTION') {
      this.playCautionBeep();
      this.intervalId = setInterval(() => {
        this.playCautionBeep();
      }, 800); // 0.8 s interval
    } else if (this.currentSoundMode === 'PARKING_WARNING') {
      this.playWarningBeep();
      this.intervalId = setInterval(() => {
        this.playWarningBeep();
      }, 200); // 0.2 s interval
    }
  }

  playCautionBeep() {
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // 523 Hz (C5)

      // 180 ms with soft fades, peak volume 0.12
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.025); // 25ms attack
      gain.gain.linearRampToValueAtTime(0.08, now + 0.12);
      gain.gain.linearRampToValueAtTime(0, now + 0.18); // soft fade out

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.185);
    } catch {
      // AudioContext handling safety
    }
  }

  playWarningBeep() {
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1600, now); // Harsh 1600 Hz

      // 110 ms on, volume 0.3
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.008);
      gain.gain.setValueAtTime(0.3, now + 0.10);
      gain.gain.linearRampToValueAtTime(0, now + 0.11);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.115);
    } catch {
      // AudioContext handling safety
    }
  }
}
