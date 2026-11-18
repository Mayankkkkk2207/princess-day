// 8. Love coupons — scratch-card reveal (canvas)
import { gsap } from 'gsap';
import { $, $$, buzz, capture, confetti, reducedMotion } from '../lib/fx.js';

const TINTS = ['#FFD6E0', '#E4D9FF', '#D7F5E9', '#FFF1C9', '#FFE3D3', '#DDF0FF'];

export function couponsHTML(c) {
  const items = c.coupons.items.map((k, i) => `
    <div class="coupon" style="--tint:${TINTS[i % TINTS.length]}">
      <div class="coupon-body">
        <span class="cp-emoji">${k.emoji}</span>
        <h3>${k.title}</h3>
        <p>${k.text}</p>
        <span class="cp-tag">valid forever ♡</span>
      </div>
      <canvas class="scratch" aria-label="Scratch to reveal coupon ${i + 1}"></canvas>
    </div>`).join('');

  return `
  <section class="section coupons is-locked" id="coupons" data-label="coupons">
    <h2 class="section-title">${c.coupons.title}</h2>
    <p class="section-hint">${c.coupons.hint}</p>
    <div class="coupon-area">
      <div class="coupon-grid">${items}</div>
      <div class="coupon-lock clay">
        <span class="lock-emoji">🔒</span>
        <p>${c.coupons.lockedText}</p>
        <button class="btn btn-ghost lock-skip">or just peek 👀</button>
      </div>
    </div>
  </section>`;
}

function paintCover(canvas, i) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const x = canvas.getContext('2d', { willReadFrequently: true });
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const g = x.createLinearGradient(0, 0, w, h);
  const pairs = [['#FFB3C7', '#D9C8FF'], ['#C9B6FF', '#FFC2D4'], ['#A8E6CF', '#C9B6FF']];
  const [a, b] = pairs[i % pairs.length];
  g.addColorStop(0, a); g.addColorStop(1, b);
  x.fillStyle = g;
  x.fillRect(0, 0, w, h);
  // sparkles
  x.fillStyle = 'rgba(255,255,255,.7)';
  for (let k = 0; k < 26; k++) {
    x.beginPath();
    x.arc(((k * 53) % w), ((k * 97) % h), 1 + (k % 3), 0, Math.PI * 2);
    x.fill();
  }
  x.fillStyle = '#fff';
  x.textAlign = 'center';
  x.font = '700 18px Fredoka, sans-serif';
  x.fillText('scratch me', w / 2, h / 2);
  x.font = '22px sans-serif';
  x.fillText('✨', w / 2, h / 2 + 30);
  return x;
}

export function initCoupons() {
  const sec = $('#coupons');
  const coupons = $$('.coupon', sec);
  let unlocked = false;

  function setup() {
    coupons.forEach((cp, i) => {
      const canvas = $('.scratch', cp);
      if (!canvas || cp.classList.contains('revealed')) return;
      const ctx = paintCover(canvas, i);
      let down = false, last = null, moves = 0;

      const scratch = (e) => {
        const r = canvas.getBoundingClientRect();
        const p = { x: e.clientX - r.left, y: e.clientY - r.top };
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 34; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo((last || p).x, (last || p).y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        last = p;
        if (++moves % 10 === 0) check();
      };
      const check = () => {
        const { width, height } = canvas;
        const data = ctx.getImageData(0, 0, width, height).data;
        let clear = 0, total = 0;
        for (let k = 3; k < data.length; k += 4 * 24) { total++; if (data[k] < 40) clear++; }
        if (clear / total > 0.45) reveal();
      };
      const reveal = () => {
        if (cp.classList.contains('revealed')) return;
        cp.classList.add('revealed');
        buzz([20, 40, 20]);
        gsap.to(canvas, { opacity: 0, duration: reducedMotion ? 0 : 0.4, onComplete: () => canvas.remove() });
        if (!reducedMotion) gsap.fromTo($('.coupon-body', cp), { scale: 0.9 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        const r = cp.getBoundingClientRect();
        confetti({ particleCount: 40, spread: 55, startVelocity: 25, origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight } });
      };

      canvas.onpointerdown = (e) => { if (!unlocked) return; down = true; last = null; capture(canvas, e); buzz(5); scratch(e); };
      canvas.onpointermove = (e) => down && scratch(e);
      canvas.onpointerup = canvas.onpointercancel = () => { down = false; last = null; check(); };
      // keyboard fallback
      canvas.tabIndex = 0;
      canvas.onkeydown = (e) => (e.key === 'Enter' || e.key === ' ') && unlocked && reveal();
    });
  }

  setup();
  let rt;
  new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(setup, 150); }).observe($('.coupon-grid', sec));

  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    sec.classList.remove('is-locked');
    const lock = $('.coupon-lock', sec);
    gsap.to(lock, { scale: 0.6, opacity: 0, duration: reducedMotion ? 0 : 0.4, ease: 'back.in(2)', onComplete: () => lock.remove() });
    if (!reducedMotion) gsap.from(coupons, { y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.8)', delay: 0.2 });
  };
  $('.lock-skip', sec).addEventListener('click', () => { buzz(); unlock(); });
  return { unlock };
}
