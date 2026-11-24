/**
 * Lightweight Background HUD Particles
 * Strictly capped at 60 particles; respects prefers-reduced-motion
 */

export function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const MAX_PARTICLES = 50; // Well within ~60 cap
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.35 + 0.15); // Gentle upward float
      this.alpha = Math.random() * 0.25 + 0.08;
      this.color = Math.random() > 0.4 ? '63, 208, 201' : '118, 168, 180';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.y < 0) {
        this.y = height;
        this.x = Math.random() * width;
      }
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
    }

    draw() {
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(new Particle());
  }

  let animationFrameId = null;
  let isRunning = true;

  function render() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', handleResize, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      if (!isRunning) {
        isRunning = true;
        render();
      }
    }
  });

  render();
}
