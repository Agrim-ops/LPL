# Drive Shield — Futuristic Automotive HUD Marketing Site & Simulation

> **College Project Concept (Design and Simulation Stage)**  
> **Team 6, Learners' Premier League (LPL 2026–27), NIIT University**  
> *Not for sale. Not a certified safety device. It only warns; the driver stays responsible.*

---

## Overview

**Drive Shield** is a concept retrofit driver-assistance kit designed for older Indian cars (roughly 10 to 13 years old, built ~2013 onward) that shipped without factory driver-assist. 

The system uses:
- **Perception:** 2 wide-angle cameras (front windshield & rear glass), 4 waterproof ultrasonic sensors (bumper corners), 6-axis chassis motion sensor.
- **Vehicle Telemetry:** Vehicle speed read via OBD-II port (read-only diagnostic mode over SAE J1979).
- **Compute & Output:** Edge processing on a Raspberry Pi 5 4GB with active cooling, warning the driver via a high-contrast 7-inch dashboard touchscreen and acoustic beeps.
- **Safety Scope:** **SAE Level 0 (Warning Only)**. The system **never** brakes and **never** steers.

---

## Strict Honesty & Academic Integrity Rules

This project exists strictly as an academic concept and software simulation. To ensure complete honesty with visitors and reviewers:
1. **Prominent Disclaimers:** A clear concept disclaimer banner is pinned at the top of the viewport and in the footer.
2. **No False Claims:** We never write or imply that Drive Shield is built, tested, road-tested, proven, certified, approved, or compliant. We never claim it "prevents accidents" or "reduces accidents by X%".
3. **No Fabricated Commercial Assets:** Zero fake reviews, fake customer logos, fake testimonials, fake download counters, or countdown timers.
4. **Transparent Terminology:** All specifications use terms like "proposed", "designed", "simulated", and "estimate". Every simulation is clearly watermarked: *"SIMULATION: made-up scenario, not a real drive. Warning only: the system never brakes or steers."*
5. **Zero Data Harvesting & Tracking:** No tracking cookies, no Google Analytics, no third-party telemetry scripts, and no user-data database forms. Contact is handled exclusively via client-side `mailto:`.
6. **Mechanical Scope:** Automatic braking and steering are never mentioned except to state explicitly that the system does **not** perform them.

---

## File Tree

```
drive-shield/
├── render.yaml               # Render static site deployment configuration
├── README.md                 # Complete project documentation & audit checklist
└── site/                     # Pure static publish directory
    ├── index.html            # Single-page marketing site with all 16 sections
    ├── robots.txt            # Search engine crawler instructions
    ├── sitemap.xml           # XML sitemap
    ├── site.webmanifest      # PWA / web manifest
    ├── css/
    │   ├── tokens.css        # Sci-Fi HUD color palette & typography tokens
    │   ├── base.css          # Reset, typography, accessibility & skip link
    │   ├── layout.css        # Grids, sticky header, disclaimer banners
    │   ├── components.css    # HUD panels, corner brackets, badges, tables, FAQ
    │   ├── demo.css          # 16:9 simulation stage, in-car display, controls
    │   └── hud.css           # Particles, scanlines, sensor cone pulses, reduced-motion
    ├── js/
    │   ├── config.js         # Single CONTACT_EMAIL and site constants
    │   ├── main.js           # Application entry point
    │   ├── particles.js      # Background HUD particles (capped at 50)
    │   ├── hud-effects.js    # 3D card tilt, scroll reveal, scroll progress bar
    │   ├── ttc-slider.js     # Interactive TTC slider with debounce & hysteresis
    │   ├── sensor-hotspots.js# Interactive top-down car mounting map (9 hotspots)
    │   ├── filter-grid.js    # 18-feature warning catalog filter
    │   ├── accordion.js      # Keyboard accessible FAQ accordion
    │   └── demo/
    │       ├── audio.js      # Web Audio API sound synthesis (starts only on user click)
    │       ├── engine.js     # Simulation timeline, linear interpolation, auto-pause
    │       ├── renderer.js   # Canvas road renderer (Scenario A & B)
    │       └── controller.js # In-car driver HUD screen & keyboard controller
    └── assets/
        ├── favicon.svg       # SVG shield with car silhouette
        ├── og-image.svg      # 1200x630 Open Graph & Twitter preview card
        └── team/             # Optional team photo directory (with automatic SVG fallback)
            └── README.md
```

---

## Where to Edit Copy & Settings

| Item to Change | File Location | How to Edit |
|---|---|---|
| **Contact Email** | `site/js/config.js` | Change `export const CONTACT_EMAIL = 'contact@example.com';` to your actual address. |
| **Email Subject** | `site/js/config.js` | Change `export const CONTACT_MAILTO_SUBJECT = '...';`. |
| **Project Copy** | `site/index.html` | Organized by semantic `<section>` tags (e.g. `#problem`, `#how-it-works`, `#cost`, `#faq`). |
| **Design Tokens** | `site/css/tokens.css` | Edit root CSS custom properties (`--brand-cyan`, `--alert-critical`, etc.). |
| **Team Member Photos** | `site/assets/team/` | Drop square JPG/PNG photos matching member names (e.g. `agrim-goel.jpg`). |

---

## How to Run Locally

Because the project uses modern ES modules (`import`/`export`) and Web Audio API, serve the `site/` folder over any local HTTP server:

### Option 1: Python 3 (Recommended)
```bash
# Navigate to the project site folder
cd drive-shield/site

# Start Python's built-in HTTP server
python -m http.server 8085

# Open your browser at:
# http://localhost:8085
```

### Option 2: Node.js / npx
```bash
npx serve site -p 8085
```

### Option 3: VS Code Live Server
Right-click `site/index.html` in VS Code and select **"Open with Live Server"**.

---

## Deployment to Render (Static Site)

Deploying Drive Shield to Render takes less than 2 minutes:

1. **Push to GitHub / GitLab:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Drive Shield concept site"
   git remote add origin https://github.com/<your-username>/drive-shield.git
   git push -u origin main
   ```

2. **Create New Static Site on Render:**
   - Log into your dashboard at [dashboard.render.com](https://dashboard.render.com).
   - Click **"New +"** in the top navigation bar and select **"Static Site"**.
   - Connect your GitHub / GitLab repository (`drive-shield`).

3. **Configure Render Settings:**
   - **Name:** `drive-shield` (or your preferred name)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank)*
   - **Build Command:** *(leave empty — no build step required)*
   - **Publish Directory:** `site`

   *(Note: Because `render.yaml` is included in the project root, Render can also automatically configure these settings via Blueprint).*

4. **Deploy:**
   - Click **"Create Static Site"**.
   - Render will deploy the site in ~10 seconds and generate an active URL like `https://drive-shield.onrender.com`.

### Setting a Custom Domain on Render
1. Go to your Static Site dashboard on Render.
2. Click **"Settings"** on the left menu.
3. Scroll to **"Custom Domains"** and click **"Add Custom Domain"**.
4. Enter your domain (e.g. `driveshield.org` or `www.driveshield.org`).
5. Update your domain registrar's DNS records:
   - For `www` (CNAME): Point to `drive-shield.onrender.com`.
   - For root/apex (ANAME/ALIAS): Point to Render's IP address displayed in your dashboard.
6. Render will automatically issue and renew a free Let's Encrypt SSL/TLS certificate.

---

## Interactive Simulation Verification

The client-side simulation strictly matches all scenario specifications:

### Scenario A: Closing on a Slower Car (Highway)
- **Scale:** 20 px per metre.
- **Our Car (Orange):** Starts at 50 km/h, fixed at left.
- **Lead Car (Blue):** Steady 30 km/h ahead.
- **Gap & TTC Progression:**
  - `0.0s`: 50 km/h, 40.0 m gap, TTC 7.2 s → **ALL CLEAR** (Silence)
  - `4.4s`: 50 km/h, 15.6 m gap, TTC 2.8 s → **CAUTION** (Gentle sine 523 Hz beeps, 1/s)
  - `5.2s`: 50 km/h, 11.1 m gap, TTC 2.0 s → **WARNING** (Harsh square 1600 Hz beeps, 5/s)
  - `5.8s`: 50 km/h, 7.8 m gap, TTC 1.4 s → **WARNING** + Chip *"Also active: Lane drift"*
  - `6.1s`: Driver manual braking begins. Speed decelerates to 44 km/h (6.5s), 37 km/h (7.0s), 30 km/h (7.5s).
  - `7.5s`: Speed matches 30 km/h (no longer closing in) → Lane alert shown for 0.2s.
  - `7.7s`: Re-centered in lane → **ALL CLEAR**.

### Scenario B: Slow Parking (Creeping to Wall)
- **Scale:** 200 px per metre.
- **Wall & Zones:** Wall at right, Yellow caution zone (1.0 m = 200 px), Red stop zone (0.3 m = 60 px).
- **Distance & Alerts:**
  - `0.0s – 0.5s`: 1.90 m down to 1.82 m → ALL CLEAR.
  - `0.5s`: Enters **PARKING MODE** with chip *"Forward and lane warnings paused while parking"*.
  - `6.3s`: Distance 0.95 m (&lt; 1.0 m) → **PARKING CAUTION** (Gentle beeps every 0.8s).
  - `10.9s`: Distance 0.26 m (&lt; 0.3 m) → **PARKING WARNING** with flashing **STOP** (Harsh beeps every 0.2s).
  - `11.4s – 14.0s`: Car stops at 0.20 m from wall.

---

## Assumptions & Design Choices

1. **Target Vehicle Era (2013 onward):** OBD-II was mandated in India for passenger cars under Bharat Stage IV starting April 2013 (DieselNet reference). Earlier vehicles often had proprietary non-standard diagnostics.
2. **Audio Autoplay Standards:** Modern browsers block audio until the user interacts with the page. Sound is muted by default and only starts after the user checks "Sound on/off".
3. **No External CDN Dependencies for Script Execution:** All scripts and icons are self-contained ES modules and inline SVGs. Only Google Fonts are loaded from Google's CDN with system font fallbacks (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Consolas`).
4. **Debounce and Hysteresis Starting Values:** Set to 3 samples (~100 ms at 30 fps) and a 0.3-second buffer margin, which eliminated erratic display flipping in computer simulations.

---

## Final Honesty & Quality Checklist

| Requirement | Status | Verification Details |
|---|:---:|---|
| **Top Disclaimer Banner** | PASSED | Pinned under header: *"Drive Shield is a college project concept (design and simulation stage)..."* |
| **Footer Disclaimer Banner** | PASSED | Mirrored banner in footer above team credits. |
| **Strict Honesty Verbiage** | PASSED | Zero banned words ("tested", "proven", "certified", "buy now", etc.). Only "proposed", "simulated", "concept". |
| **No Fake Social Proof** | PASSED | No fake reviews, testimonials, partner badges, or award logos anywhere on the site. |
| **No Automatic Braking/Steering** | PASSED | Explicitly stated as SAE Level 0 advisory only (never brakes or steers). |
| **Zero Personal Data Collection** | PASSED | No cookies, no trackers, no backend database. Client-side mailto only. |
| **Demo Numbers Match Spec** | PASSED | Scenario A and B timelines match interpolation tables to the exact decimal. |
| **Web Audio Click-Only Activation** | PASSED | AudioContext initializes and resumes strictly upon user click / sound checkbox toggle. |
| **Keyboard Accessibility** | PASSED | Space (Play/Pause), Right Arrow (Step Moment), Tab navigation on accordion, hotspots, and skip link. |
| **Responsive Down to 360px** | PASSED | Tested on 360px mobile, 768px tablet, and 1440px desktop viewports. |
