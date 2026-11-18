import confettiLib from 'canvas-confetti';
import { fileExists } from './mascots.js';

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function buzz(ms = 20) {
  try { navigator.vibrate?.(ms); } catch { /* not supported */ }
}

const PALETTE = ['#FF8FAB', '#FFD6E0', '#E4D9FF', '#D7F5E9', '#FFD66B', '#ffffff'];
let heartShape;
const getHeart = () => (heartShape ??= confettiLib.shapeFromText({ text: '💗', scalar: 2 }));

export function confetti(opts = {}) {
  if (reducedMotion) return confettiLib({ particleCount: 30, spread: 60, colors: PALETTE, disableForReducedMotion: false, ticks: 80, ...opts });
  return confettiLib({ particleCount: 90, spread: 80, startVelocity: 38, colors: PALETTE, scalar: 1, ...opts });
}

export function bigCelebration() {
  const end = Date.now() + (reducedMotion ? 600 : 2200);
  (function frame() {
    confettiLib({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: PALETTE });
    confettiLib({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: PALETTE });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confettiLib({ particleCount: 40, spread: 120, origin: { y: 0.55 }, shapes: [getHeart()], scalar: 2, colors: PALETTE });
}

/** DOM heart rain (cheap: transform-only CSS animations). */
export function heartRain(count = 28) {
  const box = document.createElement('div');
  box.className = 'heart-rain';
  const hearts = ['💗', '💖', '💕', '💞', '🩷', '✨'];
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.textContent = hearts[i % hearts.length];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = 16 + Math.random() * 22 + 'px';
    s.style.animationDuration = 3.5 + Math.random() * 3 + 's';
    s.style.animationDelay = Math.random() * 4 + 's';
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 11000);
}

/* ── Sparkle trail following finger / mouse ───────────────── */
export function initSparkleTrail() {
  if (reducedMotion) return;
  const c = document.createElement('canvas');
  c.className = 'sparkle-canvas';
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const size = () => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size();
  addEventListener('resize', size);

  const parts = [];
  let running = false;
  let last = 0;
  const colors = ['#FF8FAB', '#FFC2D4', '#C9B6FF', '#FFE08A', '#ffffff'];

  function spawn(x, y) {
    const now = performance.now();
    if (now - last < 16) return;
    last = now;
    for (let i = 0; i < 2; i++) {
      parts.push({ x, y, vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.2) * 1.6, life: 1, r: 2 + Math.random() * 3.5, c: colors[(Math.random() * colors.length) | 0] });
    }
    if (parts.length > 80) parts.splice(0, parts.length - 80);
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  function star(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.lineTo(x + Math.cos(a) * r * 2, y + Math.sin(a) * r * 2);
      ctx.lineTo(x + Math.cos(a + Math.PI / 4) * r * 0.6, y + Math.sin(a + Math.PI / 4) * r * 0.6);
    }
    ctx.closePath();
    ctx.fill();
  }

  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.life -= 0.025;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.c;
      star(p.x, p.y, p.r * p.life);
    }
    if (parts.length) requestAnimationFrame(tick);
    else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  addEventListener('pointermove', (e) => spawn(e.clientX, e.clientY), { passive: true });
  addEventListener('pointerdown', (e) => { for (let i = 0; i < 4; i++) { last = 0; spawn(e.clientX, e.clientY); } }, { passive: true });
}

/* ── Music toggle ─────────────────────────────────────────── */
export function initMusic(src) {
  const btn = document.createElement('button');
  btn.className = 'music-btn clay';
  btn.setAttribute('aria-label', 'Play music');
  btn.innerHTML = '<span class="music-icon">🎵</span>';
  btn.hidden = true;
  document.body.appendChild(btn);

  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'none';
  let ready = false;

  fileExists(src).then((ok) => {
    if (!ok) return;
    audio.src = import.meta.env.BASE_URL + src;
    ready = true;
    btn.hidden = false;
  });

  const set = (on) => {
    btn.classList.toggle('is-playing', on);
    btn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
  };
  const play = () => { if (!ready) return; audio.volume = 0.6; audio.play().then(() => set(true)).catch(() => set(false)); };
  btn.addEventListener('click', () => { buzz(); audio.paused ? play() : (audio.pause(), set(false)); });
  return { play };
}

/* ── Tiny hearts progress indicator ───────────────────────── */
export function initProgress(sections) {
  const bar = document.createElement('nav');
  bar.className = 'progress';
  bar.setAttribute('aria-label', 'Story progress');
  bar.innerHTML = sections.map((s, i) => `<button class="p-heart" data-i="${i}" aria-label="Go to ${s.dataset.label || 'section ' + (i + 1)}">♥</button>`).join('');
  document.body.appendChild(bar);
  const hearts = $$('.p-heart', bar);
  hearts.forEach((h, i) => h.addEventListener('click', () => sections[i].scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })));

  let maxSeen = 0;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = sections.indexOf(e.target);
      maxSeen = Math.max(maxSeen, i);
      hearts.forEach((h, j) => { h.classList.toggle('done', j <= maxSeen); h.classList.toggle('current', j === i); });
    });
  }, { rootMargin: '-45% 0px -45% 0px' }); // "current" = section crossing the middle of the screen
  sections.forEach((s) => io.observe(s));
  return bar;
}

/** setPointerCapture that never throws (some browsers reject synthetic / stale pointers). */
export function capture(el, e) {
  try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
}
