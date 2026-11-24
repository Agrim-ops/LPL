/**
 * Sensor Hotspots Module
 * Interactive Top-Down Car with 9 Numbered Mounting Points
 */

export const HOTSPOT_DATA = {
  1: {
    num: 1,
    title: 'Front Camera (Pi Camera Module 3)',
    location: 'Behind the rearview mirror, mounted on windshield',
    coverage: '120° forward field of view',
    role: 'Captures road scene, forward vehicles, lane markings, pedestrians, road signs, and road edges.'
  },
  2: {
    num: 2,
    title: 'Front Ultrasonic Sensors (2 Units)',
    location: 'Front bumper corners (left and right)',
    coverage: 'Near-field parking and low-speed obstacle detection (up to 2–3 m)',
    role: 'Provides reliable acoustic distance measurements for creeping parking and low-speed tight spaces.'
  },
  3: {
    num: 3,
    title: 'Rear Ultrasonic Sensors (2 Units)',
    location: 'Rear bumper corners (left and right)',
    coverage: 'Near-field reverse parking and corner obstacle detection',
    role: 'Measures distance to walls, pillars, and kerbs when reversing.'
  },
  4: {
    num: 4,
    title: 'Rear Camera (Pi Camera Module 3)',
    location: 'Inside rear windscreen / above license plate',
    coverage: '120° rearward field of view',
    role: 'Provides rear-view stream, rear collision warning, and rear cross-traffic sensing.'
  },
  5: {
    num: 5,
    title: 'Main Processing Unit (Raspberry Pi 5)',
    location: 'Under dashboard, driver-side footwell / console',
    coverage: 'Central controller and edge AI processor',
    role: 'Houses the 4GB Pi 5, active cooler, microSD card, and custom power stage with clean shutdown.'
  },
  6: {
    num: 6,
    title: 'OBD-II Port & Read-Only Adapter',
    location: 'Standard OBD-II port (below steering column / dash)',
    coverage: 'Vehicle CAN bus (Read-Only)',
    role: 'Reads live vehicle speed via SAE J1979 diagnostic modes. Strictly read-only; sends zero commands to the vehicle.'
  },
  7: {
    num: 7,
    title: '7-Inch Touchscreen Driver Display',
    location: 'Dashboard center mount / suction bracket',
    coverage: 'Driver primary visual interface',
    role: 'High-contrast automotive HUD showing single most urgent alert, parking meters, and speed sign advisories.'
  },
  8: {
    num: 8,
    title: 'Audio Speaker & Amplifier',
    location: 'Mounted near screen / dashboard speaker grille',
    coverage: 'Driver acoustic warning zone',
    role: 'Emits gentle advisory beeps (523 Hz) or urgent warning tones (1600 Hz). Always matches current visual alert.'
  },
  9: {
    num: 9,
    title: '4G LTE + GPS External Antenna',
    location: 'Top dashboard corner / windshield perimeter',
    coverage: 'Satellite GNSS + Cellular telemetry',
    role: 'Provides road positioning and connects to the proposed crowdsourced road hazard network.'
  }
};

export function initSensorHotspots() {
  const points = document.querySelectorAll('.hotspot-point');
  const pills = document.querySelectorAll('.hotspot-pill');
  const cardNum = document.getElementById('hotspot-detail-num');
  const cardTitle = document.getElementById('hotspot-detail-title');
  const cardLoc = document.getElementById('hotspot-detail-location');
  const cardCov = document.getElementById('hotspot-detail-coverage');
  const cardRole = document.getElementById('hotspot-detail-role');

  if (!cardTitle) return;

  function selectHotspot(id) {
    const data = HOTSPOT_DATA[id];
    if (!data) return;

    // Update active classes on SVG dots
    points.forEach((p) => {
      if (p.getAttribute('data-hotspot') === String(id)) {
        p.classList.add('active');
        p.setAttribute('aria-selected', 'true');
      } else {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      }
    });

    // Update active classes on pills
    pills.forEach((pill) => {
      if (pill.getAttribute('data-hotspot') === String(id)) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update detail card
    if (cardNum) cardNum.textContent = `0${data.num} //`;
    cardTitle.textContent = data.title;
    if (cardLoc) cardLoc.textContent = data.location;
    if (cardCov) cardCov.textContent = data.coverage;
    if (cardRole) cardRole.textContent = data.role;
  }

  points.forEach((p) => {
    const id = p.getAttribute('data-hotspot');
    p.addEventListener('click', () => selectHotspot(id));
    p.addEventListener('mouseenter', () => selectHotspot(id));
    p.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectHotspot(id);
      }
    });
  });

  pills.forEach((pill) => {
    const id = pill.getAttribute('data-hotspot');
    pill.addEventListener('click', () => selectHotspot(id));
  });

  // Default select 1
  selectHotspot(1);
}
