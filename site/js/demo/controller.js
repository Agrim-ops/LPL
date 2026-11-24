/**
 * Simulation UI Controller & Driver HUD Display Manager
 * Controls buttons, audio triggers, keyboard shortcuts, and driver screen updates.
 */

import { SimulationAudio } from './audio.js';
import { SimulationEngine } from './engine.js';
import { RoadRenderer } from './renderer.js';

export function initSimulationDemo() {
  const canvas = document.getElementById('road-canvas');
  if (!canvas) return;

  const audio = new SimulationAudio();
  const engine = new SimulationEngine(audio);
  const renderer = new RoadRenderer(canvas);

  // UI Elements
  const scenarioBtns = document.querySelectorAll('.scenario-btn');
  const playBtn = document.getElementById('demo-play-btn');
  const playIcon = document.getElementById('demo-play-icon');
  const playText = document.getElementById('demo-play-text');
  const restartBtn = document.getElementById('demo-restart-btn');
  const stepBtn = document.getElementById('demo-step-btn');
  const speedChips = document.querySelectorAll('.speed-chip');
  const autoPauseCheck = document.getElementById('demo-autopause-check');
  const soundCheck = document.getElementById('demo-sound-check');
  const captionText = document.getElementById('demo-caption-text');
  const captionLiveRegion = document.getElementById('demo-live-caption');

  // Road HUD Telemetry Elements
  const hudSpeed = document.getElementById('road-hud-speed');
  const hudGap = document.getElementById('road-hud-gap');
  const hudTtc = document.getElementById('road-hud-ttc');
  const hudTtcNote = document.getElementById('road-hud-ttc-note');

  // In-Car Driver Screen Elements
  const inCarScreen = document.getElementById('in-car-screen');
  const screenIcon = document.getElementById('screen-alert-icon');
  const screenTitle = document.getElementById('screen-alert-title');
  const screenSubtitle = document.getElementById('screen-alert-subtitle');
  const secondaryChip = document.getElementById('screen-secondary-chip');
  const parkingMeter = document.getElementById('screen-parking-meter');
  const parkingBar = document.getElementById('parking-bar-fill');
  const parkingDistText = document.getElementById('parking-dist-text');
  const screenTopMode = document.getElementById('screen-top-mode');

  // Resize canvas
  renderer.resize();
  window.addEventListener('resize', () => renderer.resize(), { passive: true });

  // Update In-Car HUD display based on simulation state
  function updateInCarDisplay(state) {
    if (state.scenario === 'A') {
      // Hide parking meter, show standard alerts
      if (parkingMeter) parkingMeter.style.display = 'none';
      if (screenIcon) screenIcon.style.display = 'flex';
      if (screenTitle) screenTitle.style.display = 'block';
      if (screenSubtitle) screenSubtitle.style.display = 'block';
      if (screenTopMode) screenTopMode.textContent = 'DRIVE ASSIST // ACTIVE';

      // Telemetry on Road
      if (hudSpeed) hudSpeed.textContent = `${Math.round(state.speed)} km/h`;
      if (hudGap) hudGap.textContent = `${state.gap.toFixed(1)} m`;

      if (state.ttc !== null && state.speed > 30) {
        if (hudTtc) hudTtc.textContent = `${state.ttc.toFixed(1)} s`;
        if (hudTtcNote) hudTtcNote.textContent = 'TTC = seconds until we hit the car ahead if nothing changes';
      } else {
        if (hudTtc) hudTtc.textContent = 'Not closing in';
        if (hudTtcNote) hudTtcNote.textContent = 'Speeds matched or opening gap';
      }

      // Display States (Never show jargon)
      inCarScreen.classList.remove('state-all-clear', 'state-caution', 'state-warning');
      secondaryChip.classList.add('hidden');

      if (state.display === 'WARNING_WITH_LANE_CHIP') {
        inCarScreen.classList.add('state-warning');
        screenIcon.innerHTML = '<span style="color:#FF3B30;font-size:2rem;">⚠️</span>';
        screenTitle.textContent = 'Car ahead very close';
        screenTitle.style.color = '#FF3B30';
        screenSubtitle.textContent = `Car ahead: ${state.gap.toFixed(1)} m • Harsh warning tones active`;
        secondaryChip.textContent = 'Also active: Lane drift';
        secondaryChip.classList.remove('hidden');
      } else if (state.display === 'WARNING') {
        inCarScreen.classList.add('state-warning');
        screenIcon.innerHTML = '<span style="color:#FF3B30;font-size:2rem;">⚠️</span>';
        screenTitle.textContent = 'Car ahead very close';
        screenTitle.style.color = '#FF3B30';
        screenSubtitle.textContent = `Car ahead: ${state.gap.toFixed(1)} m • Harsh warning tones active`;
      } else if (state.display === 'LANE_WARNING') {
        inCarScreen.classList.add('state-caution');
        screenIcon.innerHTML = '<span style="color:#F2A900;font-size:2rem;">⚡</span>';
        screenTitle.textContent = 'Drifting out of your lane';
        screenTitle.style.color = '#F2A900';
        screenSubtitle.textContent = 'Unsignalled drift over divider';
      } else if (state.display === 'CAUTION') {
        inCarScreen.classList.add('state-caution');
        screenIcon.innerHTML = '<span style="color:#F2A900;font-size:2rem;">⚡</span>';
        screenTitle.textContent = 'Closing in on the car ahead';
        screenTitle.style.color = '#F2A900';
        screenSubtitle.textContent = `Car ahead: ${state.gap.toFixed(1)} m • Gentle beeps active`;
      } else {
        // ALL CLEAR
        inCarScreen.classList.add('state-all-clear');
        screenIcon.innerHTML = '<span style="color:#2ECC71;font-size:2rem;">✓</span>';
        screenTitle.textContent = 'No warnings';
        screenTitle.style.color = '#2ECC71';
        screenSubtitle.textContent = 'Gap safe • Clear forward road';
      }
    } else {
      // Scenario B: Parking Mode
      if (screenTopMode) screenTopMode.textContent = 'PARKING ASSIST // ULTRASONIC';
      if (parkingMeter) parkingMeter.style.display = 'flex';
      if (screenIcon) screenIcon.style.display = 'none';
      if (screenTitle) screenTitle.style.display = 'none';
      if (screenSubtitle) screenSubtitle.style.display = 'none';

      // Road Telemetry
      if (hudSpeed) hudSpeed.textContent = 'Speed: creeping (under 8 km/h)';
      if (hudGap) hudGap.textContent = `Wall: ${state.dist.toFixed(2)} m`;
      if (hudTtc) hudTtc.textContent = 'Parking Mode';
      if (hudTtcNote) hudTtcNote.textContent = 'Ultrasonics active (forward & lane warnings paused)';

      // Chip
      secondaryChip.textContent = 'Forward and lane warnings paused while parking';
      secondaryChip.classList.remove('hidden');

      // Parking Bar Calculation (1.90m max down to 0.20m min)
      // Percentage filled increases as distance shrinks
      const clampedDist = Math.max(0.2, Math.min(1.9, state.dist));
      const fillPercent = ((1.9 - clampedDist) / 1.7) * 100;
      if (parkingBar) {
        parkingBar.style.width = `${fillPercent}%`;
      }

      inCarScreen.classList.remove('state-all-clear', 'state-caution', 'state-warning');
      if (parkingDistText) parkingDistText.classList.remove('stop');

      if (state.display === 'PARKING_WARNING') {
        inCarScreen.classList.add('state-warning');
        if (parkingBar) parkingBar.style.backgroundColor = '#FF3B30';
        if (parkingDistText) {
          parkingDistText.textContent = `${state.dist.toFixed(2)} m STOP`;
          parkingDistText.classList.add('stop');
        }
      } else if (state.display === 'PARKING_CAUTION') {
        inCarScreen.classList.add('state-caution');
        if (parkingBar) parkingBar.style.backgroundColor = '#F2A900';
        if (parkingDistText) {
          parkingDistText.textContent = `${state.dist.toFixed(2)} m`;
        }
      } else {
        inCarScreen.classList.add('state-all-clear');
        if (parkingBar) parkingBar.style.backgroundColor = '#2ECC71';
        if (parkingDistText) {
          parkingDistText.textContent = `${state.dist.toFixed(2)} m`;
        }
      }
    }

    // Caption update & live region announcement
    if (captionText && captionText.textContent !== state.caption) {
      captionText.textContent = state.caption;
      if (captionLiveRegion) {
        captionLiveRegion.textContent = state.caption;
      }
    }

    // Play/Pause button text and state
    if (playText && playIcon) {
      if (state.isPlaying && !state.isAutoPaused) {
        playIcon.textContent = '⏸';
        playText.textContent = 'Pause';
      } else if (state.isAutoPaused) {
        playIcon.textContent = '⏳';
        playText.textContent = 'Paused (Moment)';
      } else {
        playIcon.textContent = '▶';
        playText.textContent = 'Play';
      }
    }
  }

  // Engine state listener
  engine.onStateChange((state) => {
    updateInCarDisplay(state);
    renderer.render(state);
  });

  // Animation Loop
  function loop(timestamp) {
    engine.update(timestamp);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Controls Event Listeners
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (engine.isPlaying && !engine.isAutoPaused) {
        engine.pause();
      } else {
        engine.play();
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      engine.reset();
      engine.play();
    });
  }

  if (stepBtn) {
    stepBtn.addEventListener('click', () => {
      engine.stepToNextKeyMoment();
    });
  }

  scenarioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const scenario = btn.getAttribute('data-scenario');
      scenarioBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      engine.setScenario(scenario);
    });
  });

  speedChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const speed = parseFloat(chip.getAttribute('data-speed'));
      speedChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      engine.setSpeed(speed);
    });
  });

  if (autoPauseCheck) {
    autoPauseCheck.addEventListener('change', () => {
      engine.setAutoPause(autoPauseCheck.checked);
    });
  }

  if (soundCheck) {
    soundCheck.addEventListener('change', () => {
      audio.setSoundEnabled(soundCheck.checked);
    });
  }

  // Keyboard Shortcuts (Space = play/pause, Right Arrow = next key moment)
  window.addEventListener('keydown', (e) => {
    // Ignore keyboard shortcuts if focus is inside an input or textarea
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      if (engine.isPlaying && !engine.isAutoPaused) {
        engine.pause();
      } else {
        engine.play();
      }
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      engine.stepToNextKeyMoment();
    }
  });

  // Initial draw
  engine.reset();
}
