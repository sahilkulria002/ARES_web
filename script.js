/* ═══════════════════════════════════════════════
   ARES — script.js (v2)
   ═══════════════════════════════════════════════ */

/* ── Background Video Cycler ── */
(function () {
  const vid = document.getElementById('bg-vid');
  if (!vid) return;

  const BG_VIDS = [
    'vids/arm gif.mp4',
    'vids/car gif.mov',
    'vids/WhatsApp Video 2026-04-27 at 7.10.57 AM.mp4',
  ];
  let current = 0;

  function loadNext() {
    vid.classList.add('fade-out');
    setTimeout(() => {
      current = (current + 1) % BG_VIDS.length;
      vid.src = BG_VIDS[current];
      vid.load();
      vid.play().catch(() => {});
      vid.classList.remove('fade-out');
    }, 1200);
  }

  vid.src = BG_VIDS[0];
  vid.load();
  vid.play().catch(() => {});
  vid.addEventListener('ended', loadNext);
})();

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile nav ── */
const hamburger = document.getElementById('hamburger');
let mobileNav = document.getElementById('mobile-nav');
if (!mobileNav) {
  mobileNav = document.createElement('div');
  mobileNav.id = 'mobile-nav';
  mobileNav.innerHTML = `
    <button class="close-btn" id="close-nav">✕</button>
    <a href="#see-it"   onclick="closeMobileNav()">See It</a>
    <a href="#platform" onclick="closeMobileNav()">Platform</a>
    <a href="#how"      onclick="closeMobileNav()">How It Works</a>
    <a href="#build"    onclick="closeMobileNav()">Projects</a>
    <a href="#schools"  onclick="closeMobileNav()">For Schools</a>
    <a href="#cta" class="btn-primary" onclick="closeMobileNav()">Book a Demo</a>
  `;
  document.body.appendChild(mobileNav);
  document.getElementById('close-nav').addEventListener('click', closeMobileNav);
}
hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
function closeMobileNav() { mobileNav.classList.remove('open'); }

/* ── Scroll Reveal ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => revealObs.observe(el));

/* ── Particle Canvas ── */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const mouse = { x: null, y: null };
  const COUNT = 80, DIST = 130, C = '255,107,43';

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

  class P {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W; this.y = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - .5) * .35; this.vy = -(Math.random() * .45 + .15);
      this.r = Math.random() * 1.8 + .8; this.a = Math.random() * .5 + .15;
    }
    update() { this.x += this.vx; this.y += this.vy; if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false); }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${C},${this.a})`; ctx.fill(); }
  }

  function connections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < DIST) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${C},${(1 - d / DIST) * .2})`; ctx.lineWidth = .7; ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x, dy = particles[i].y - mouse.y, d = Math.hypot(dx, dy);
        if (d < DIST * 1.4) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${C},${(1 - d / (DIST * 1.4)) * .35})`; ctx.lineWidth = .9; ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    connections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  particles = Array.from({ length: COUNT }, () => new P());
  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  loop();
})();

/* ── Platform mockup bars animate on scroll ── */
const mockObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.mock-bar-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = w; }, 200);
      });
      mockObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const mockup = document.querySelector('.mockup-window');
if (mockup) mockObs.observe(mockup);

/* ── Smooth active nav ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + e.target.id ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => secObs.observe(s));
