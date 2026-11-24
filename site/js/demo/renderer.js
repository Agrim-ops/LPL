/**
 * Canvas Renderer for Road View (Top 60% of Simulation)
 * Draws Road, Lanes, Orange Car, Blue Car ahead, Obstacle Wall, Sensor Cones, and Measurement Overlays.
 */

export class RoadRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dashOffset = 0;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
  }

  render(state) {
    if (!this.ctx || !this.width) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (state.scenario === 'A') {
      this.renderScenarioA(ctx, state);
    } else {
      this.renderScenarioB(ctx, state);
    }
  }

  renderScenarioA(ctx, state) {
    const w = this.width;
    const h = this.height;

    // Road surface
    ctx.fillStyle = '#0B111D';
    ctx.fillRect(0, 0, w, h);

    // Road shoulder lines
    ctx.strokeStyle = '#27384A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(w, 18);
    ctx.moveTo(0, h - 18);
    ctx.lineTo(w, h - 18);
    ctx.stroke();

    // Center dashed lane divider
    const laneY = h / 2;
    if (state.isPlaying && !state.isAutoPaused) {
      // Dash scroll proportional to speed (50 km/h is ~13.8 m/s, at 20px/m = ~276 px/s)
      this.dashOffset = (this.dashOffset + (state.speed * 0.15)) % 40;
    }

    ctx.save();
    ctx.strokeStyle = '#5E7993';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([24, 16]);
    ctx.lineDashOffset = -this.dashOffset;
    ctx.beginPath();
    ctx.moveTo(0, laneY);
    ctx.lineTo(w, laneY);
    ctx.stroke();
    ctx.restore();

    // Positions: 20 px per metre
    const pxPerMetre = 20;
    const ourCarX = 75;
    // Lane offset drift (up to 32px over the dashed center line)
    const ourCarY = laneY - 26 + (state.laneOffset * 32);

    // Car Ahead (Blue car)
    const gapPx = Math.max(30, state.gap * pxPerMetre);
    const carAheadX = ourCarX + gapPx;
    const carAheadY = laneY - 26;

    // Draw sensor cone from our car
    this.drawCameraCone(ctx, ourCarX + 46, ourCarY + 14, carAheadX, carAheadY + 14);

    // Draw Our Car (Orange, 46x28 px)
    this.drawCar(ctx, ourCarX, ourCarY, '#FF7A00', '#FFA64D', 'OUR CAR', `${Math.round(state.speed)} km/h`);

    // Draw Car Ahead (Blue, 46x28 px)
    if (carAheadX < w + 50) {
      this.drawCar(ctx, carAheadX, carAheadY, '#2980B9', '#5DADE2', 'LEAD CAR', '30 km/h');
    }

    // Double Arrow for Gap Measurement
    this.drawGapArrow(ctx, ourCarX + 48, carAheadX - 2, laneY + 28, `${state.gap.toFixed(1)} m`);
  }

  renderScenarioB(ctx, state) {
    const w = this.width;
    const h = this.height;

    // Parking background
    ctx.fillStyle = '#080D14';
    ctx.fillRect(0, 0, w, h);

    // Parking bay lines
    ctx.strokeStyle = '#223244';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // Scale: 200 px per metre
    const pxPerMetre = 200;
    const wallX = w - 40; // Wall at right

    // Red zone: last 0.3 m = 60 px
    const redZoneWidth = 0.3 * pxPerMetre;
    ctx.fillStyle = 'rgba(255, 59, 48, 0.2)';
    ctx.fillRect(wallX - redZoneWidth, 20, redZoneWidth, h - 40);
    ctx.strokeStyle = 'rgba(255, 59, 48, 0.7)';
    ctx.strokeRect(wallX - redZoneWidth, 20, redZoneWidth, h - 40);

    // Yellow zone: 1.0 m = 200 px (includes the red zone inside)
    const yellowZoneWidth = 1.0 * pxPerMetre;
    ctx.fillStyle = 'rgba(242, 169, 0, 0.12)';
    ctx.fillRect(wallX - yellowZoneWidth, 20, yellowZoneWidth - redZoneWidth, h - 40);
    ctx.strokeStyle = 'rgba(242, 169, 0, 0.5)';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(wallX - yellowZoneWidth, 20, yellowZoneWidth, h - 40);
    ctx.setLineDash([]);

    // Wall (concrete/brick hatching)
    ctx.fillStyle = '#3A4B5C';
    ctx.fillRect(wallX, 10, 26, h - 20);
    ctx.strokeStyle = '#E74C3C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wallX, 10);
    ctx.lineTo(wallX, h - 10);
    ctx.stroke();

    // Zone labels
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#F2A900';
    ctx.fillText('1.0m CAUTION ZONE', wallX - yellowZoneWidth + 6, 36);
    ctx.fillStyle = '#FF3B30';
    ctx.fillText('0.3m STOP ZONE', wallX - redZoneWidth + 4, 36);

    // Car position: creeping toward the wall on the right
    // Car front bumper is at: wallX - (state.dist * pxPerMetre)
    const carWidth = 64;
    const carHeight = 36;
    const carFrontX = wallX - (state.dist * pxPerMetre);
    const carX = carFrontX - carWidth;
    const carY = (h - carHeight) / 2;

    // Ultrasonic acoustic arcs from bumper toward wall
    this.drawUltrasonicArcs(ctx, carFrontX, carY + carHeight / 2, state.dist);

    // Draw Our Car (Orange)
    this.drawCar(ctx, carX, carY, '#FF7A00', '#FFA64D', 'OUR CAR', '< 8 km/h');

    // Distance Arrow
    this.drawGapArrow(ctx, carFrontX, wallX, carY + carHeight + 24, `${state.dist.toFixed(2)} m`);
  }

  drawCar(ctx, x, y, primaryColor, accentColor, label, speedText) {
    const w = 50;
    const h = 28;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x + 2, y + 2, w, h);

    // Car Body
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Windshield
    ctx.fillStyle = 'rgba(6, 10, 18, 0.85)';
    ctx.beginPath();
    ctx.roundRect(x + 28, y + 4, 12, h - 8, 3);
    ctx.fill();

    // Rear glass
    ctx.beginPath();
    ctx.roundRect(x + 8, y + 5, 8, h - 10, 2);
    ctx.fill();

    // Headlights
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + w - 3, y + 3, 3, 5);
    ctx.fillRect(x + w - 3, y + h - 8, 3, 5);

    // Labels
    ctx.font = '10px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(label, x + 2, y - 6);

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#3FD0C9';
    ctx.fillText(speedText, x + 2, y + h + 12);
  }

  drawCameraCone(ctx, startX, startY, endX, endY) {
    ctx.save();
    const grad = ctx.createLinearGradient(startX, startY, endX, endY);
    grad.addColorStop(0, 'rgba(63, 208, 201, 0.35)');
    grad.addColorStop(1, 'rgba(63, 208, 201, 0.05)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY - 24);
    ctx.lineTo(endX, endY + 24);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(63, 208, 201, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  }

  drawUltrasonicArcs(ctx, startX, centerY, dist) {
    const numArcs = 3;
    const color = dist <= 0.3 ? '#FF3B30' : dist <= 1.0 ? '#F2A900' : '#2ECC71';

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (let i = 1; i <= numArcs; i++) {
      const radius = i * 14;
      ctx.beginPath();
      ctx.arc(startX, centerY, radius, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawGapArrow(ctx, x1, x2, y, label) {
    if (x2 <= x1 + 10) return;
    ctx.save();
    ctx.strokeStyle = '#3FD0C9';
    ctx.lineWidth = 1.5;

    // Line
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();

    // Arrows
    ctx.fillStyle = '#3FD0C9';
    // Left arrow
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x1 + 6, y - 3);
    ctx.lineTo(x1 + 6, y + 3);
    ctx.closePath();
    ctx.fill();

    // Right arrow
    ctx.beginPath();
    ctx.moveTo(x2, y);
    ctx.lineTo(x2 - 6, y - 3);
    ctx.lineTo(x2 - 6, y + 3);
    ctx.closePath();
    ctx.fill();

    // Label
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(`Gap: ${label}`, (x1 + x2) / 2, y - 5);
    ctx.restore();
  }
}
