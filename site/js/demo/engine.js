/**
 * Simulation Engine: Timeline, Interpolation, State Tracking, and Auto-Pause
 */

export const SCENARIO_A_DATA = [
  { time: 0.0, speed: 50, gap: 40.0, ttc: 7.2, display: 'ALL_CLEAR', sound: 'SILENCE' },
  { time: 2.0, speed: 50, gap: 28.9, ttc: 5.2, display: 'ALL_CLEAR', sound: 'SILENCE' },
  { time: 4.0, speed: 50, gap: 17.8, ttc: 3.2, display: 'ALL_CLEAR', sound: 'SILENCE' },
  { time: 4.4, speed: 50, gap: 15.6, ttc: 2.8, display: 'CAUTION', sound: 'CAUTION' },
  { time: 5.2, speed: 50, gap: 11.1, ttc: 2.0, display: 'WARNING', sound: 'WARNING' },
  { time: 5.5, speed: 50, gap: 9.4, ttc: 1.7, display: 'WARNING', sound: 'WARNING', laneDrifting: true },
  { time: 5.8, speed: 50, gap: 7.8, ttc: 1.4, display: 'WARNING_WITH_LANE_CHIP', sound: 'WARNING', laneDrifting: true },
  { time: 6.1, speed: 50, gap: 6.1, ttc: 1.1, display: 'WARNING_WITH_LANE_CHIP', sound: 'WARNING', laneDrifting: true },
  { time: 6.5, speed: 44, gap: 4.1, ttc: 1.0, display: 'WARNING_WITH_LANE_CHIP', sound: 'WARNING', laneDrifting: true },
  { time: 7.0, speed: 37, gap: 2.6, ttc: 1.3, display: 'WARNING_WITH_LANE_CHIP', sound: 'WARNING', laneDrifting: true },
  { time: 7.4, speed: 31, gap: 2.0, ttc: 5.6, display: 'WARNING_WITH_LANE_CHIP', sound: 'WARNING', laneDrifting: true },
  { time: 7.5, speed: 30, gap: 2.0, ttc: null, display: 'LANE_WARNING', sound: 'CAUTION', laneDrifting: true },
  { time: 7.7, speed: 30, gap: 2.0, ttc: null, display: 'ALL_CLEAR', sound: 'SILENCE', laneDrifting: false },
  { time: 10.0, speed: 30, gap: 2.0, ttc: null, display: 'ALL_CLEAR', sound: 'SILENCE', laneDrifting: false }
];

export const SCENARIO_A_KEY_MOMENTS = [
  { time: 0.0, caption: "Driving normally. Our car (50 km/h) is catching up to a slower car (30 km/h)." },
  { time: 4.4, caption: "First alert: the gap is closing. Gentle beeps mean CAUTION." },
  { time: 5.2, caption: "Urgent alert: very close. Fast harsh beeps mean WARNING. The driver is warned; nothing is braked for them." },
  { time: 5.8, caption: "A second alert starts: our car is drifting over the lane line. Only the most urgent alert is shown and heard." },
  { time: 7.5, caption: "The danger has passed. The lane alert is shown for a moment." },
  { time: 7.7, caption: "All clear again." }
];

export const SCENARIO_B_DATA = [
  { time: 0.0, dist: 1.90, display: 'ALL_CLEAR', sound: 'SILENCE' },
  { time: 0.5, dist: 1.82, display: 'PARKING_STANDBY', sound: 'SILENCE' },
  { time: 3.0, dist: 1.45, display: 'PARKING_STANDBY', sound: 'SILENCE' },
  { time: 6.0, dist: 1.00, display: 'PARKING_STANDBY', sound: 'SILENCE' },
  { time: 6.3, dist: 0.95, display: 'PARKING_CAUTION', sound: 'PARKING_CAUTION' },
  { time: 8.0, dist: 0.70, display: 'PARKING_CAUTION', sound: 'PARKING_CAUTION' },
  { time: 10.0, dist: 0.40, display: 'PARKING_CAUTION', sound: 'PARKING_CAUTION' },
  { time: 10.9, dist: 0.26, display: 'PARKING_WARNING', sound: 'PARKING_WARNING' },
  { time: 11.4, dist: 0.20, display: 'PARKING_WARNING', sound: 'PARKING_WARNING' },
  { time: 14.0, dist: 0.20, display: 'PARKING_WARNING', sound: 'PARKING_WARNING' }
];

export const SCENARIO_B_KEY_MOMENTS = [
  { time: 0.5, caption: "Slow speed with a wall close: parking mode starts. Forward and lane warnings pause." },
  { time: 6.3, caption: "Under 1 metre: gentle beeps." },
  { time: 10.9, caption: "Under 0.3 metres: harsh beeps and STOP." },
  { time: 11.4, caption: "The car has stopped 0.2 m from the wall." }
];

export class SimulationEngine {
  constructor(audio) {
    this.audio = audio;
    this.activeScenario = 'A'; // 'A' or 'B'
    this.simTime = 0.0;
    this.isPlaying = false;
    this.speedMultiplier = 1.0;
    this.autoPauseEnabled = true;
    this.isAutoPaused = false;
    this.autoPauseTimer = null;
    this.autoPauseRemaining = 0;
    this.triggeredMoments = new Set();
    this.lastTimestamp = null;
    this.onStateChangeCallbacks = [];
  }

  onStateChange(cb) {
    this.onStateChangeCallbacks.push(cb);
  }

  notifyStateChange() {
    const state = this.getCurrentState();
    this.onStateChangeCallbacks.forEach((cb) => cb(state));
  }

  setScenario(scenario) {
    this.activeScenario = scenario;
    this.reset();
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  setAutoPause(enabled) {
    this.autoPauseEnabled = enabled;
  }

  play() {
    if (this.isAutoPaused) {
      this.cancelAutoPause();
    }
    this.isPlaying = true;
    this.lastTimestamp = performance.now();
    this.notifyStateChange();
  }

  pause() {
    this.isPlaying = false;
    this.cancelAutoPause();
    if (this.audio) this.audio.stop();
    this.notifyStateChange();
  }

  reset() {
    this.cancelAutoPause();
    this.simTime = 0.0;
    this.isPlaying = false;
    this.triggeredMoments.clear();
    if (this.audio) this.audio.setAlertMode('SILENCE');
    this.notifyStateChange();
  }

  cancelAutoPause() {
    if (this.autoPauseTimer) {
      clearTimeout(this.autoPauseTimer);
      this.autoPauseTimer = null;
    }
    this.isAutoPaused = false;
  }

  stepToNextKeyMoment() {
    this.cancelAutoPause();
    const moments = this.activeScenario === 'A' ? SCENARIO_A_KEY_MOMENTS : SCENARIO_B_KEY_MOMENTS;
    const next = moments.find((m) => m.time > this.simTime + 0.05);
    if (next) {
      this.simTime = next.time;
      this.triggeredMoments.add(next.time);
      this.notifyStateChange();
    } else {
      // Loop or restart
      this.reset();
    }
  }

  update(now) {
    if (!this.isPlaying || this.isAutoPaused) return;

    if (!this.lastTimestamp) {
      this.lastTimestamp = now;
      return;
    }

    const dtSeconds = ((now - this.lastTimestamp) / 1000) * this.speedMultiplier;
    this.lastTimestamp = now;

    const maxTime = this.activeScenario === 'A' ? 10.0 : 14.0;
    const prevTime = this.simTime;
    this.simTime = Math.min(maxTime, this.simTime + dtSeconds);

    // Check key moments for auto-pause
    if (this.autoPauseEnabled) {
      const moments = this.activeScenario === 'A' ? SCENARIO_A_KEY_MOMENTS : SCENARIO_B_KEY_MOMENTS;
      for (const m of moments) {
        if (m.time >= prevTime && m.time <= this.simTime && !this.triggeredMoments.has(m.time)) {
          this.simTime = m.time;
          this.triggeredMoments.add(m.time);
          this.triggerAutoPause(m);
          break;
        }
      }
    }

    this.notifyStateChange();

    if (this.simTime >= maxTime) {
      this.pause();
    }
  }

  triggerAutoPause(moment) {
    this.isAutoPaused = true;
    this.notifyStateChange();

    // 4-second pause with plain-words caption
    this.autoPauseTimer = setTimeout(() => {
      this.isAutoPaused = false;
      this.lastTimestamp = performance.now();
      this.notifyStateChange();
    }, 4000);
  }

  getCurrentState() {
    if (this.activeScenario === 'A') {
      return this.interpolateScenarioA(this.simTime);
    } else {
      return this.interpolateScenarioB(this.simTime);
    }
  }

  interpolateScenarioA(t) {
    const data = SCENARIO_A_DATA;
    let i = 0;
    while (i < data.length - 1 && data[i + 1].time <= t) {
      i++;
    }

    const d1 = data[i];
    const d2 = data[Math.min(data.length - 1, i + 1)];
    const span = d2.time - d1.time;
    const factor = span > 0 ? (t - d1.time) / span : 0;

    const speed = d1.speed + (d2.speed - d1.speed) * factor;
    const gap = d1.gap + (d2.gap - d1.gap) * factor;
    let ttc = null;
    if (d1.ttc !== null && d2.ttc !== null) {
      ttc = d1.ttc + (d2.ttc - d1.ttc) * factor;
    } else if (d1.ttc !== null) {
      ttc = d1.ttc;
    }

    // Lane drift calculation: drifts over dashed line from 5.0s, wheels over line 5.5 to 7.5s, back to center by 8.0s
    let laneOffset = 0; // 0 = center of lane, >0 = drifting right
    if (t >= 5.0 && t <= 8.0) {
      if (t < 5.5) {
        laneOffset = ((t - 5.0) / 0.5) * 1.0;
      } else if (t <= 7.5) {
        laneOffset = 1.0; // fully over dashed line
      } else {
        laneOffset = 1.0 - ((t - 7.5) / 0.5) * 1.0;
      }
    }

    // Current key moment caption
    const activeMoment = [...SCENARIO_A_KEY_MOMENTS].reverse().find((m) => m.time <= t) || SCENARIO_A_KEY_MOMENTS[0];

    // Sound and display resolution
    const display = d2.time <= t ? d2.display : d1.display;
    const sound = d2.time <= t ? d2.sound : d1.sound;

    if (this.audio) {
      if (this.isPlaying && !this.isAutoPaused) {
        this.audio.setAlertMode(sound);
      } else {
        this.audio.stop();
      }
    }

    return {
      scenario: 'A',
      time: t,
      speed,
      gap,
      ttc,
      laneOffset,
      display,
      sound,
      caption: activeMoment.caption,
      isPlaying: this.isPlaying,
      isAutoPaused: this.isAutoPaused
    };
  }

  interpolateScenarioB(t) {
    const data = SCENARIO_B_DATA;
    let i = 0;
    while (i < data.length - 1 && data[i + 1].time <= t) {
      i++;
    }

    const d1 = data[i];
    const d2 = data[Math.min(data.length - 1, i + 1)];
    const span = d2.time - d1.time;
    const factor = span > 0 ? (t - d1.time) / span : 0;

    const dist = d1.dist + (d2.dist - d1.dist) * factor;
    const activeMoment = [...SCENARIO_B_KEY_MOMENTS].reverse().find((m) => m.time <= t) || SCENARIO_B_KEY_MOMENTS[0];

    const display = d2.time <= t ? d2.display : d1.display;
    const sound = d2.time <= t ? d2.sound : d1.sound;

    if (this.audio) {
      if (this.isPlaying && !this.isAutoPaused) {
        this.audio.setAlertMode(sound);
      } else {
        this.audio.stop();
      }
    }

    return {
      scenario: 'B',
      time: t,
      dist,
      speedLabel: 'creeping (under 8 km/h)',
      display,
      sound,
      caption: activeMoment.caption,
      isPlaying: this.isPlaying,
      isAutoPaused: this.isAutoPaused
    };
  }
}
