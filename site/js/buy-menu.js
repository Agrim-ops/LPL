/**
 * Vehicle Compatibility Checker & Buy Menu Module
 * Allows drivers to input car brand, model, year, and logo to test OBD-II and sensor compatibility,
 * then unlocks the Buy Now / Order option with custom pricing placeholder.
 */

import { CONTACT_EMAIL } from './config.js';

// Pre-defined Indian vehicle database and common brands
export const POPULAR_BRANDS = [
  { name: 'Maruti Suzuki', minObdYear: 2013, defaultLogo: '🚗' },
  { name: 'Hyundai', minObdYear: 2013, defaultLogo: '🚙' },
  { name: 'Tata Motors', minObdYear: 2013, defaultLogo: '🚘' },
  { name: 'Mahindra', minObdYear: 2013, defaultLogo: '🚙' },
  { name: 'Honda', minObdYear: 2012, defaultLogo: '🏎️' },
  { name: 'Toyota', minObdYear: 2012, defaultLogo: '🛻' },
  { name: 'Volkswagen', minObdYear: 2011, defaultLogo: '🚗' },
  { name: 'Ford', minObdYear: 2012, defaultLogo: '🚙' },
  { name: 'Renault', minObdYear: 2013, defaultLogo: '🚗' },
  { name: 'Other / Custom', minObdYear: 2013, defaultLogo: '🛡️' }
];

export function initBuyMenu() {
  const form = document.getElementById('compatibility-form');
  const brandSelect = document.getElementById('car-brand-select');
  const customBrandInput = document.getElementById('car-brand-custom');
  const modelInput = document.getElementById('car-model-input');
  const yearInput = document.getElementById('car-year-input');
  const yearDisplay = document.getElementById('car-year-val');
  const logoUpload = document.getElementById('car-logo-upload');
  const logoPreview = document.getElementById('car-logo-preview');
  const resultCard = document.getElementById('compatibility-result-card');

  if (!form || !resultCard) return;

  // Custom logo data URL
  let customLogoDataUrl = null;

  // Brand dropdown change handler
  if (brandSelect && customBrandInput) {
    brandSelect.addEventListener('change', () => {
      if (brandSelect.value === 'Other / Custom') {
        customBrandInput.style.display = 'block';
        customBrandInput.focus();
      } else {
        customBrandInput.style.display = 'none';
      }
    });
  }

  // Year slider live display
  if (yearInput && yearDisplay) {
    yearInput.addEventListener('input', () => {
      yearDisplay.textContent = yearInput.value;
    });
  }

  // Logo file upload handler
  if (logoUpload && logoPreview) {
    logoUpload.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          customLogoDataUrl = event.target.result;
          logoPreview.innerHTML = `<img src="${customLogoDataUrl}" alt="Car Logo" style="width:100%;height:100%;object-fit:contain;border-radius:4px;">`;
          logoPreview.style.border = '1px solid var(--brand-cyan)';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Form submission / verification handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedBrand = brandSelect.value === 'Other / Custom' 
      ? (customBrandInput.value.trim() || 'Custom Vehicle') 
      : brandSelect.value;
    const modelName = modelInput.value.trim() || 'Standard Variant';
    const year = parseInt(yearInput.value, 10);

    evaluateCompatibility(selectedBrand, modelName, year, customLogoDataUrl);
  });

  function evaluateCompatibility(brand, model, year, logoUrl) {
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Status: 2013+ = FULL COMPATIBLE (BS-IV OBD-II Mandate in India)
    // 2008-2012 = CONDITIONAL (Check physical DLC-16 port)
    // < 2008 = INCOMPATIBLE (Pre-OBD-II standard)
    let status = 'COMPATIBLE';
    if (year >= 2013) {
      status = 'COMPATIBLE';
    } else if (year >= 2008) {
      status = 'CONDITIONAL';
    } else {
      status = 'INCOMPATIBLE';
    }

    // Elements
    const badgeEl = document.getElementById('compat-status-badge');
    const titleEl = document.getElementById('compat-car-title');
    const descEl = document.getElementById('compat-car-desc');
    const logoEl = document.getElementById('compat-result-logo');
    const obdCheck = document.getElementById('compat-obd-check');
    const camCheck = document.getElementById('compat-cam-check');
    const ultraCheck = document.getElementById('compat-ultra-check');
    const powerCheck = document.getElementById('compat-power-check');
    const orderBtn = document.getElementById('compat-buy-btn');
    const priceDisplay = document.getElementById('compat-price-display');

    if (titleEl) titleEl.textContent = `${brand} ${model} (${year})`;

    if (logoEl) {
      if (logoUrl) {
        logoEl.innerHTML = `<img src="${logoUrl}" alt="${brand}" style="width:48px;height:48px;object-fit:contain;">`;
      } else {
        const found = POPULAR_BRANDS.find(b => b.name === brand);
        const icon = found ? found.defaultLogo : '🚗';
        logoEl.innerHTML = `<span style="font-size:2.2rem;">${icon}</span>`;
      }
    }

    if (status === 'COMPATIBLE') {
      badgeEl.className = 'badge badge-safe';
      badgeEl.textContent = '100% OBD-II COMPATIBLE';
      descEl.textContent = `Your ${year} ${brand} ${model} meets all requirements. Standard OBD-II port (SAE J1979) confirmed for speed telemetry and multi-sensor retrofit.`;

      obdCheck.innerHTML = '<span style="color:#2ECC71;">✓</span> High-speed OBD-II CAN bus ready';
      camCheck.innerHTML = '<span style="color:#2ECC71;">✓</span> Windshield &amp; rear glass mount verified';
      ultraCheck.innerHTML = '<span style="color:#2ECC71;">✓</span> Standard bumper corner clearance';
      powerCheck.innerHTML = '<span style="color:#2ECC71;">✓</span> 12V vehicle electrical system ready';

      orderBtn.style.display = 'inline-flex';
      orderBtn.className = 'btn btn-primary';
      orderBtn.textContent = 'Proceed to Buy Now';
      
      const subject = encodeURIComponent(`Drive Shield Purchase Order - ${brand} ${model} (${year})`);
      const body = encodeURIComponent(
        `Hello Team 6 / Drive Shield,\n\n` +
        `I have verified my vehicle compatibility on your site:\n` +
        `- Vehicle: ${brand} ${model}\n` +
        `- Manufacturing Year: ${year}\n` +
        `- Status: 100% Compatible\n` +
        `- Unit Price: ₹59,990 (MRP All Taxes Incl.)\n\n` +
        `I would like to place an order / reserve a Drive Shield Retrofit Kit.\n` +
        `Please confirm my reservation and coordinate shipping/installation.\n\n` +
        `Thank you!`
      );
      orderBtn.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

      if (priceDisplay) {
        priceDisplay.innerHTML = `<span class="text-cyan" style="font-size:1.15rem;font-weight:700;">₹59,990</span> <span style="font-size:0.8125rem;color:var(--text-muted);">(Base ₹50,839 + 18% GST)</span>`;
      }

    } else if (status === 'CONDITIONAL') {
      badgeEl.className = 'badge badge-advisory';
      badgeEl.textContent = 'CONDITIONAL COMPATIBILITY';
      descEl.textContent = `Vehicles built between 2008 and 2012 may have model-dependent diagnostic ports. Please check if your ${brand} ${model} has a 16-pin OBD-II port under the dashboard.`;

      obdCheck.innerHTML = '<span style="color:#F2A900;">⚡</span> 16-pin DLC port visual verification recommended';
      camCheck.innerHTML = '<span style="color:#2ECC71;">✓</span> Windshield &amp; rear glass mount verified';
      ultraCheck.innerHTML = '<span style="color:#2ECC71;">✓</span> Standard bumper corner clearance';
      powerCheck.innerHTML = '<span style="color:#2ECC71;">✓</span> 12V vehicle electrical system ready';

      orderBtn.style.display = 'inline-flex';
      orderBtn.className = 'btn btn-secondary';
      orderBtn.textContent = 'Buy with Port Inspection';
      
      const subject = encodeURIComponent(`Drive Shield Inquiry (Pre-2013 Verification) - ${brand} ${model} (${year})`);
      const body = encodeURIComponent(
        `Hello Team 6 / Drive Shield,\n\n` +
        `I checked compatibility for my ${brand} ${model} (${year}).\n` +
        `It has conditional OBD-II status. I would like assistance confirming port pinouts and placing an order.\n` +
        `- Target Price: ₹59,990 (MRP All Taxes Incl.)\n\n` +
        `Please contact me with hardware inspection and order options.`
      );
      orderBtn.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

      if (priceDisplay) {
        priceDisplay.innerHTML = `<span class="text-amber" style="font-size:1.15rem;font-weight:700;">₹59,990</span> <span style="font-size:0.8125rem;color:var(--text-muted);">(Pre-order pending port check)</span>`;
      }

    } else {
      badgeEl.className = 'badge badge-critical';
      badgeEl.textContent = 'NOT SUPPORTED (PRE-2008)';
      descEl.textContent = `Vehicles manufactured prior to 2008 lack the standardized OBD-II CAN bus protocol required for Drive Shield's collision detection algorithms.`;

      obdCheck.innerHTML = '<span style="color:#FF3B30;">✗</span> Pre-OBD-II legacy vehicle protocol';
      camCheck.innerHTML = '<span style="color:#2ECC71;">✓</span> Windshield mount physically possible';
      ultraCheck.innerHTML = '<span style="color:#2ECC71;">✓</span> Bumper mount physically possible';
      powerCheck.innerHTML = '<span style="color:#2ECC71;">✓</span> 12V electrical system present';

      orderBtn.style.display = 'none';

      if (priceDisplay) {
        priceDisplay.innerHTML = `<span class="text-red">Hardware not compatible with pre-2008 protocol.</span>`;
      }
    }
  }
}
