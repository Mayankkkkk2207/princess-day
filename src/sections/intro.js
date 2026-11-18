// 1. Loader  +  2. Envelope intro (both are full-screen overlays before the story)
import { gsap } from 'gsap';
import { mascot, CROWN } from '../lib/mascots.js';
import { $, buzz, confetti, reducedMotion } from '../lib/fx.js';

export function loaderHTML(c) {
  return `
  <div class="loader" id="loader" role="status" aria-live="polite">
    <div class="loader-inner">
      <div class="loader-bar clay-inset"><div class="loader-fill"><span class="loader-heart">💗</span></div></div>
      <p class="loader-text">${c.loader.text} <span class="loader-pct">0%</span></p>
    </div>
    <div class="loader-bear">${mascot('bear')}</div>
  </div>`;
}

export function envelopeHTML(c) {
  return `
  <div class="env-screen" id="envelope" hidden>
    <div class="env-floaties" aria-hidden="true"><span>💗</span><span>✨</span><span>🌸</span><span>💕</span><span>⭐</span><span>🎀</span></div>
    <h1 class="env-title">${c.envelope.title}</h1>
    <div class="envelope">
      <div class="env-back"></div>
      <div class="env-card">
        <div class="crown-drop" aria-hidden="true">${CROWN}</div>
        <p class="env-card-text">${c.envelope.inside}</p>
      </div>
      <div class="env-front"></div>
      <div class="env-flap"></div>
      <button class="wax-seal" aria-label="Open the envelope"><span>♥</span></button>
    </div>
    <p class="env-sub">${c.envelope.subtitle}</p>
    <button class="btn btn-primary env-go" hidden>open my surprise ✨</button>
  </div>`;
}

/** Runs the loader; resolves when done. */
export function runLoader() {
  return new Promise((resolve) => {
    const el = $('#loader');
    const fill = $('.loader-fill', el);
    const pct = $('.loader-pct', el);
    const minTime = reducedMotion ? 400 : 1800;
    const start = performance.now();
    let fontsDone = false;
    const fontWait = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 3000))]);
    fontWait.then(() => (fontsDone = true));

    function tick(now) {
      const t = Math.min((now - start) / minTime, 1);
      // ease-out progress, holds at 92% until fonts are in
      let p = 1 - Math.pow(1 - t, 2.2);
      if (!fontsDone) p = Math.min(p, 0.92);
      fill.style.width = (p * 100).toFixed(1) + '%';
      pct.textContent = Math.round(p * 100) + '%';
      if (p < 1) return requestAnimationFrame(tick);
      setTimeout(() => {
        el.classList.add('is-done');
        setTimeout(() => { el.remove(); resolve(); }, 600);
      }, 250);
    }
    requestAnimationFrame(tick);
  });
}

/** Shows the envelope; resolves when she taps "open my surprise". */
export function runEnvelope(c, { onOpen }) {
  return new Promise((resolve) => {
    const screen = $('#envelope');
    screen.hidden = false;
    const seal = $('.wax-seal', screen);
    const env = $('.envelope', screen);
    const go = $('.env-go', screen);
    const crown = $('.crown-drop', screen);
    const sub = $('.env-sub', screen);

    if (!reducedMotion) {
      gsap.from('.env-title', { y: -30, opacity: 0, duration: 0.8, ease: 'back.out(2)' });
      gsap.from(env, { y: 60, scale: 0.8, opacity: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)', delay: 0.1 });
    }

    seal.addEventListener('click', () => {
      buzz(30);
      onOpen?.();
      seal.disabled = true;
      sub.style.visibility = 'hidden';
      env.classList.add('is-open');
      const dur = reducedMotion ? 0 : 1;
      const tl = gsap.timeline();
      tl.to(seal, { scale: 0, rotation: 90, opacity: 0, duration: 0.3 * dur, ease: 'back.in(2)' })
        .to('.env-flap', { rotateX: 180, duration: 0.6 * dur, ease: 'power2.inOut' })
        .set('.env-flap', { zIndex: 1 })
        .to('.env-card', { yPercent: -58, duration: 0.7 * dur, ease: 'back.out(1.6)' })
        .add(() => confetti({ origin: { y: 0.45 } }))
        .add(() => {
          // crown falls from the top of the screen onto the top edge of the card
          gsap.set(crown, { opacity: 1 });
          gsap.fromTo(crown, { y: -window.innerHeight, rotation: -25 }, { y: 0, rotation: -6, duration: 1.1 * dur, ease: 'bounce.out', onComplete: () => buzz(15) });
        })
        .add(() => {
          go.hidden = false;
          gsap.from(go, { scale: 0.4, opacity: 0, duration: 0.5 * dur, ease: 'back.out(2.5)' });
        }, '+=1');
    }, { once: true });

    go.addEventListener('click', () => {
      buzz();
      gsap.to(screen, {
        opacity: 0, scale: 1.08, duration: reducedMotion ? 0 : 0.6, ease: 'power2.in',
        onComplete: () => { screen.remove(); resolve(); },
      });
    }, { once: true });
  });
}
