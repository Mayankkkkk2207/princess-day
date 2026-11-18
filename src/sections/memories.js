// 5. Memories — Pinterest masonry polaroids + lightbox
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, buzz, reducedMotion } from '../lib/fx.js';

const base = import.meta.env.BASE_URL;
const PLACEHOLDER_TINTS = ['#FFD6E0', '#E4D9FF', '#D7F5E9', '#FFF1C9'];
const PLACEHOLDER_EMOJI = ['📸', '💗', '🌸', '✨'];

export function memoriesHTML(c) {
  const items = c.memories.photos.map((p, i) => {
    const tilt = ((i * 37) % 9) - 4; // deterministic -4..4deg
    const media = p.src
      ? `<img src="${base + p.src}" alt="${p.caption || 'memory'}" loading="lazy" decoding="async" />`
      : placeholder(i);
    return `
      <figure class="polaroid" style="--tilt:${tilt}deg" data-i="${i}" tabindex="0" role="button" aria-label="Open photo: ${p.caption || ''}">
        <span class="tape ${i % 2 ? 'tape-r' : 'tape-l'}"></span>
        <div class="pol-media">${media}</div>
        <figcaption>${p.caption || ''}</figcaption>
      </figure>`;
  }).join('');

  return `
  <section class="section memories" id="memories" data-label="memories">
    <h2 class="section-title">${c.memories.title}</h2>
    <p class="section-hint">${c.memories.hint}</p>
    <div class="masonry">${items}</div>
  </section>
  <div class="lightbox" hidden>
    <button class="lb-close" aria-label="Close">✕</button>
    <button class="lb-nav lb-prev" aria-label="Previous">‹</button>
    <figure class="lb-figure polaroid"><div class="pol-media lb-media"></div><figcaption class="lb-cap"></figcaption></figure>
    <button class="lb-nav lb-next" aria-label="Next">›</button>
  </div>`;
}

function placeholder(i) {
  return `<div class="pol-ph" style="background:${PLACEHOLDER_TINTS[i % 4]};aspect-ratio:${i % 3 ? '4/5' : '1/1'}"><span>${PLACEHOLDER_EMOJI[i % 4]}</span></div>`;
}

export function initMemories(c) {
  const cards = $$('.polaroid', $('.masonry'));

  // broken image -> cute placeholder
  let refreshT;
  cards.forEach((card, i) => {
    const img = $('img', card);
    if (!img) return;
    img.addEventListener('error', () => { $('.pol-media', card).innerHTML = placeholder(i); });
    // images change the masonry height as they load: keep ScrollTrigger positions correct
    img.addEventListener('load', () => { clearTimeout(refreshT); refreshT = setTimeout(() => ScrollTrigger.refresh(), 200); });
  });

  if (!reducedMotion) {
    gsap.set(cards, { opacity: 0, y: 50, scale: 0.85 });
    ScrollTrigger.batch(cards, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.09, ease: 'back.out(1.7)' }),
    });
  }

  // lightbox
  const lb = $('.lightbox');
  const media = $('.lb-media', lb);
  const cap = $('.lb-cap', lb);
  let idx = 0;
  const show = (i) => {
    idx = (i + cards.length) % cards.length;
    const p = c.memories.photos[idx];
    const src = $('img', cards[idx])?.getAttribute('src');
    media.innerHTML = src ? `<img src="${src}" alt="${p.caption || ''}">` : placeholder(idx);
    cap.textContent = p.caption || '';
  };
  const open = (i) => {
    buzz();
    show(i);
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    if (!reducedMotion) gsap.fromTo('.lb-figure', { scale: 0.6, rotation: -6, opacity: 0 }, { scale: 1, rotation: -1.5, opacity: 1, duration: 0.5, ease: 'back.out(1.8)' });
  };
  const close = () => { lb.hidden = true; document.body.classList.remove('no-scroll'); };

  cards.forEach((card, i) => {
    card.addEventListener('click', () => open(i));
    card.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(i)));
  });
  $('.lb-prev', lb).addEventListener('click', (e) => { e.stopPropagation(); buzz(10); show(idx - 1); });
  $('.lb-next', lb).addEventListener('click', (e) => { e.stopPropagation(); buzz(10); show(idx + 1); });
  $('.lb-close', lb).addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  // swipe in lightbox
  let sx = null;
  lb.addEventListener('pointerdown', (e) => (sx = e.clientX));
  lb.addEventListener('pointerup', (e) => {
    if (sx == null) return;
    const d = e.clientX - sx;
    sx = null;
    if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1));
  });
}
