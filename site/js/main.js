/**
 * Drive Shield Main Application Entry Point
 * ES Modules - Vanilla JavaScript
 */

import { CONTACT_EMAIL, CONTACT_MAILTO_SUBJECT, SITE_METADATA } from './config.js';
import { initParticles } from './particles.js';
import { initHudEffects } from './hud-effects.js';
import { initTtcSlider } from './ttc-slider.js';
import { initSensorHotspots } from './sensor-hotspots.js';
import { initFilterGrid } from './filter-grid.js';
import { initAccordion } from './accordion.js';
import { initSimulationDemo } from './demo/controller.js';

document.addEventListener('DOMContentLoaded', () => {
  // Bind Contact Email to all mailto links
  const contactLinks = document.querySelectorAll('.contact-email-link');
  const encodedSubject = encodeURIComponent(CONTACT_MAILTO_SUBJECT);
  contactLinks.forEach((link) => {
    link.href = `mailto:${CONTACT_EMAIL}?subject=${encodedSubject}`;
    if (link.classList.contains('show-email-text')) {
      link.textContent = CONTACT_EMAIL;
    }
  });

  // Initialize interactive components
  initParticles();
  initHudEffects();
  initTtcSlider();
  initSensorHotspots();
  initFilterGrid();
  initAccordion();
  initSimulationDemo();

  console.log(`[${SITE_METADATA.name}] initialized. Stage: ${SITE_METADATA.stage}`);
});
