/**
 * Time To Collision (TTC) Interactive Slider Widget
 * College Project Concept - Team 6, NIIT University
 * 
 * Demonstrates Advisory (< 3.0s) and Critical (< 2.2s) thresholds,
 * and explains debounce (3 samples) and hysteresis (0.3s margin) in plain words.
 */

export function initTtcSlider() {
  const slider = document.getElementById('ttc-slider-input');
  const valDisplay = document.getElementById('ttc-val-text');
  const previewBox = document.getElementById('ttc-preview-box');
  const iconDisplay = document.getElementById('ttc-display-icon');
  const statusDisplay = document.getElementById('ttc-display-status');
  const subDisplay = document.getElementById('ttc-display-sub');
  const stabiliseToggle = document.getElementById('ttc-stabilise-toggle');
  const stabiliseInfo = document.getElementById('ttc-stabilise-info');

  if (!slider || !valDisplay || !previewBox) return;

  // Hysteresis state tracking
  let currentState = 'SAFE'; // 'SAFE', 'ADVISORY', 'CRITICAL'
  const CRITICAL_ENTRY = 2.2;
  const ADVISORY_ENTRY = 3.0;
  const HYSTERESIS_MARGIN = 0.3; // 0.3s margin

  function calculateState(ttc, useStabilisation) {
    if (!useStabilisation) {
      if (ttc < CRITICAL_ENTRY) return 'CRITICAL';
      if (ttc < ADVISORY_ENTRY) return 'ADVISORY';
      return 'SAFE';
    }

    // With Hysteresis: harder to exit than to enter
    if (currentState === 'CRITICAL') {
      if (ttc >= CRITICAL_ENTRY + HYSTERESIS_MARGIN) {
        // Dropped below Critical + 0.3s margin
        if (ttc < ADVISORY_ENTRY) {
          return 'ADVISORY';
        } else {
          return 'SAFE';
        }
      }
      return 'CRITICAL';
    } else if (currentState === 'ADVISORY') {
      if (ttc < CRITICAL_ENTRY) {
        return 'CRITICAL';
      }
      if (ttc >= ADVISORY_ENTRY + HYSTERESIS_MARGIN) {
        return 'SAFE';
      }
      return 'ADVISORY';
    } else {
      // Current is SAFE
      if (ttc < CRITICAL_ENTRY) return 'CRITICAL';
      if (ttc < ADVISORY_ENTRY) return 'ADVISORY';
      return 'SAFE';
    }
  }

  function update() {
    const ttc = parseFloat(slider.value);
    const useStabilisation = stabiliseToggle ? stabiliseToggle.checked : false;

    currentState = calculateState(ttc, useStabilisation);
    valDisplay.textContent = `${ttc.toFixed(1)} s`;

    previewBox.classList.remove('state-all-clear', 'state-caution', 'state-warning');

    if (currentState === 'CRITICAL') {
      previewBox.classList.add('state-warning');
      previewBox.style.borderColor = '#FF3B30';
      previewBox.style.boxShadow = '0 0 20px rgba(255, 59, 48, 0.4)';
      iconDisplay.innerHTML = '<span style="color:#FF3B30;font-size:2.2rem;">⚠️</span>';
      statusDisplay.textContent = 'CRITICAL WARNING';
      statusDisplay.style.color = '#FF3B30';
      subDisplay.textContent = 'Car ahead very close • Harsh fast beeps (5/sec)';
    } else if (currentState === 'ADVISORY') {
      previewBox.classList.add('state-caution');
      previewBox.style.borderColor = '#F2A900';
      previewBox.style.boxShadow = '0 0 20px rgba(242, 169, 0, 0.3)';
      iconDisplay.innerHTML = '<span style="color:#F2A900;font-size:2.2rem;">⚡</span>';
      statusDisplay.textContent = 'CAUTION (ADVISORY)';
      statusDisplay.style.color = '#F2A900';
      subDisplay.textContent = 'Closing in on the car ahead • Gentle beeps (1/sec)';
    } else {
      previewBox.classList.add('state-all-clear');
      previewBox.style.borderColor = 'rgba(46, 204, 113, 0.5)';
      previewBox.style.boxShadow = '0 0 15px rgba(46, 204, 113, 0.2)';
      iconDisplay.innerHTML = '<span style="color:#2ECC71;font-size:2.2rem;">✓</span>';
      statusDisplay.textContent = 'ALL CLEAR (SAFE)';
      statusDisplay.style.color = '#2ECC71';
      subDisplay.textContent = 'No warnings • Sufficient safety margin';
    }

    if (stabiliseInfo) {
      if (useStabilisation) {
        stabiliseInfo.style.display = 'block';
      } else {
        stabiliseInfo.style.display = 'none';
      }
    }
  }

  slider.addEventListener('input', update);
  if (stabiliseToggle) {
    stabiliseToggle.addEventListener('change', update);
  }

  update();
}
