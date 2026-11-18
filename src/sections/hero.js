// 3. Hero — "Happy Princess Day, {name}" with waving bear + parallax clouds
import { gsap } from 'gsap';
import { mascot } from '../lib/mascots.js';
import { $$, reducedMotion } from '../lib/fx.js';

const CLOUD = `<svg viewBox="0 0 120 60" aria-hidden="true"><path d="M30 55 C10 55 4 40 14 32 C10 18 28 10 38 18 C42 4 66 0 74 14 C86 6 104 14 100 28 C116 30 116 55 96 55 Z" fill="#fff"/></svg>`;

export function heroHTML(c) {
  const title = c.hero.title.replace('{name}', `<span class="name">${c.name}</span>`);
  return `
  <section class="section hero" id="hero" data-label="hello">
    <div class="parallax" aria-hidden="true">
      <div class="layer" data-speed="0.25"><span class="cloud c1">${CLOUD}</span><span class="cloud c4">${CLOUD}</span></div>
      <div class="layer" data-speed="0.5"><span class="cloud c2">${CLOUD}</span><span class="float f1">💗</span><span class="float f2">✨</span><span class="float f5">🌸</span></div>
      <div class="layer" data-speed="0.85"><span class="cloud c3">${CLOUD}</span><span class="float f3">💕</span><span class="float f4">⭐</span><span class="float f6">🎀</span></div>
    </div>
    <div class="hero-content">
      <p class="eyebrow sticker">today is all about you</p>
      <h2 class="hero-title">${title}</h2>
      <p class="hero-sub">${c.hero.subtitle}</p>
      <div class="hero-bear">${mascot('bear', { wave: true })}</div>
    </div>
  </section>`;
}

export function initHero() {
  if (reducedMotion) return;
  $$('.hero .layer').forEach((layer) => {
    gsap.to(layer, {
      yPercent: -40 * Number(layer.dataset.speed),
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });
}

/** Entrance animation, played when the envelope closes. */
export function playHeroIntro() {
  if (reducedMotion) return;
  gsap.timeline()
    .from('.hero .eyebrow', { y: 20, opacity: 0, rotation: -8, duration: 0.5, ease: 'back.out(2)' })
    .from('.hero-title', { y: 30, opacity: 0, scale: 0.9, duration: 0.7, ease: 'back.out(1.8)' }, '-=0.2')
    .from('.hero-sub', { y: 20, opacity: 0, duration: 0.5 }, '-=0.35')
    .from('.hero-bear', { y: 120, duration: 0.9, ease: 'elastic.out(1, 0.55)' }, '-=0.4')
    .from('.hero .cue', { opacity: 0, y: 10, duration: 0.4 }, '-=0.3');
}
