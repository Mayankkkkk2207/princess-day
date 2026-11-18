// 4. Reasons — tappable / swipeable flip-card stack
import { gsap } from 'gsap';
import { mascot } from '../lib/mascots.js';
import { $, $$, buzz, capture, reducedMotion } from '../lib/fx.js';

const TINTS = ['#FFD6E0', '#E4D9FF', '#D7F5E9', '#FFF1C9', '#FFE3D3'];

export function reasonsHTML(c) {
  const n = c.reasons.items.length;
  const cards = c.reasons.items.map((r, i) => `
    <div class="flip-card" data-i="${i}" style="--tint:${TINTS[i % TINTS.length]}">
      <div class="flip-inner">
        <div class="flip-face flip-front clay">
          <span class="fc-num">#${i + 1}</span>
          <span class="fc-heart">💗</span>
          <span class="fc-tap">tap me</span>
        </div>
        <div class="flip-face flip-back clay">
          <span class="tape tape-top"></span>
          <p>${r}</p>
          <span class="fc-count">${i + 1} / ${n}</span>
        </div>
      </div>
    </div>`).join('');

  return `
  <section class="section reasons" id="reasons" data-label="reasons">
    <h2 class="section-title">${c.reasons.title}</h2>
    <p class="section-hint">${c.reasons.hint}</p>
    <div class="stack-wrap">
      <div class="card-stack" aria-live="polite">${cards}</div>
      <div class="reasons-bunny">${mascot('bunny')}</div>
    </div>
    <p class="stack-counter"><span class="seen">0</span> of ${n} reasons read 💌</p>
  </section>`;
}

export function initReasons() {
  const stack = $('.card-stack');
  let order = $$('.flip-card', stack);
  const seen = new Set();
  const counter = $('.stack-counter .seen');
  const dur = reducedMotion ? 0 : 1;

  function layout(animate = true) {
    order.forEach((card, d) => {
      const props = {
        zIndex: 100 - d,
        y: Math.min(d, 3) * 10,
        scale: 1 - Math.min(d, 3) * 0.05,
        rotation: d === 0 ? 0 : (d % 2 ? 3 : -3),
        opacity: d > 3 ? 0 : 1,
        pointerEvents: d === 0 ? 'auto' : 'none',
      };
      animate ? gsap.to(card, { ...props, duration: 0.45 * dur, ease: 'back.out(1.6)' }) : gsap.set(card, props);
    });
  }
  layout(false);

  function flip(card) {
    card.classList.add('flipped');
    seen.add(card.dataset.i);
    counter.textContent = seen.size;
    buzz(15);
  }

  function throwCard(card, dir = 1) {
    buzz(10);
    gsap.to(card, {
      x: dir * (window.innerWidth * 0.9), rotation: dir * 28, opacity: 0, duration: 0.4 * dur, ease: 'power2.in',
      onComplete: () => {
        card.classList.remove('flipped');
        order.push(order.shift());
        gsap.set(card, { x: 0 });
        layout();
      },
    });
  }

  // pointer handling: tap = flip / next, drag sideways = throw
  let startX = 0, startY = 0, dx = 0, dragging = false, active = null;
  stack.addEventListener('pointerdown', (e) => {
    active = order[0];
    if (!active.contains(e.target)) return (active = null);
    startX = e.clientX; startY = e.clientY; dx = 0; dragging = false;
    capture(active, e);
  });
  stack.addEventListener('pointermove', (e) => {
    if (!active) return;
    dx = e.clientX - startX;
    if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - startY)) dragging = true;
    if (dragging) gsap.set(active, { x: dx, rotation: dx / 14 });
  });
  const end = () => {
    if (!active) return;
    const card = active;
    active = null;
    if (dragging) {
      if (Math.abs(dx) > 70) {
        if (!card.classList.contains('flipped')) { seen.add(card.dataset.i); counter.textContent = seen.size; }
        throwCard(card, Math.sign(dx));
      } else gsap.to(card, { x: 0, rotation: 0, duration: 0.4, ease: 'back.out(2)' });
      return;
    }
    card.classList.contains('flipped') ? throwCard(card, 1) : flip(card);
  };
  stack.addEventListener('pointerup', end);
  stack.addEventListener('pointercancel', () => {
    if (active) gsap.to(active, { x: 0, rotation: 0, duration: 0.3 });
    active = null;
  });
}
