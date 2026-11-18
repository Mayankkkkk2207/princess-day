// 10. Finale — "Will you always be my princess?" (No runs away on TAP, Yes grows)
import { gsap } from 'gsap';
import { mascot } from '../lib/mascots.js';
import { $, buzz, bigCelebration, heartRain, reducedMotion } from '../lib/fx.js';

export function finaleHTML(c) {
  const F = c.finale;
  return `
  <section class="section finale" id="finale" data-label="finale">
    <div class="finale-stage">
      <div class="finale-ask">
        <h2 class="finale-q">${F.question}</h2>
        <div class="finale-mascots">
          <div class="fm fm-bear">${mascot('bear')}</div>
          <span class="fm-heart" aria-hidden="true">💗</span>
          <div class="fm fm-bunny">${mascot('bunny')}</div>
        </div>
        <div class="finale-btns">
          <button class="btn btn-primary btn-yes">${F.yes}</button>
          <button class="btn btn-no">${F.no}</button>
        </div>
      </div>
      <div class="finale-done" hidden>
        <h2 class="finale-title">${F.successTitle}</h2>
        <p>${F.successText}</p>
        <button class="btn btn-ghost replay">watch it again ↺</button>
      </div>
    </div>
  </section>`;
}

export function initFinale(c) {
  const sec = $('#finale');
  const stage = $('.finale-stage', sec);
  const yes = $('.btn-yes', sec);
  const no = $('.btn-no', sec);
  let tries = 0;
  let yesScale = 1;

  function dodge(e) {
    e?.preventDefault();
    tries++;
    buzz(15);
    const texts = c.finale.noTexts;
    no.textContent = texts[Math.min(tries, texts.length - 1)];

    // grow Yes, shrink No
    yesScale = Math.min(1 + tries * 0.18, 2.3);
    gsap.to(yes, { scale: yesScale, duration: 0.4, ease: 'elastic.out(1, 0.5)' });

    // jump No to a random spot inside the stage (kept away from the edges)
    const s = stage.getBoundingClientRect();
    const n = no.getBoundingClientRect();
    if (!no.classList.contains('is-free')) {
      // switch to absolute positioning from wherever it is now
      no.classList.add('is-free');
      gsap.set(no, { left: n.left - s.left, top: n.top - s.top, x: 0, y: 0 });
    }
    const y = yes.getBoundingClientRect();
    const q = $('.finale-q', sec).getBoundingClientRect();
    const minTop = Math.max(12, q.bottom - s.top + 8); // stay below the question text
    let x, top, guard = 0;
    do {
      x = 12 + Math.random() * (s.width - n.width - 24);
      top = minTop + Math.random() * Math.max(0, s.height - n.height - 12 - minTop);
      guard++;
      // avoid landing on top of the Yes button
    } while (guard < 20 && x + s.left < y.right + 10 && x + s.left + n.width > y.left - 10 && top + s.top < y.bottom + 10 && top + s.top + n.height > y.top - 10);
    gsap.to(no, {
      left: x, top, scale: Math.max(1 - tries * 0.08, 0.5), rotation: (Math.random() - 0.5) * 30,
      duration: reducedMotion ? 0 : 0.35, ease: 'back.out(2)',
    });
  }

  // touch + mouse: react on press (so it works on phones), and dodge hover on desktop
  no.addEventListener('pointerdown', dodge);
  no.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && dodge());
  no.addEventListener('click', (e) => { e.preventDefault(); if (e.detail === 0) dodge(); }); // keyboard

  yes.addEventListener('click', () => {
    buzz([40, 50, 40]);
    bigCelebration();
    heartRain();
    sec.classList.add('said-yes');
    const tl = gsap.timeline();
    tl.to('.finale-btns', { opacity: 0, scale: 0.8, duration: 0.3, onComplete: () => ($('.finale-btns', sec).style.display = 'none') })
      .to('.finale-q', { opacity: 0, height: 0, margin: 0, duration: 0.3 }, '<')
      // mascots hug: slide together, squish, heart pops up
      .to('.fm-bear', { x: 34, rotation: 8, duration: 0.6, ease: 'back.out(2)' })
      .to('.fm-bunny', { x: -34, rotation: -8, duration: 0.6, ease: 'back.out(2)' }, '<')
      .to('.fm-heart', { scale: 1.6, y: -60, opacity: 1, duration: 0.6, ease: 'back.out(3)' }, '-=0.2')
      .add(() => {
        const done = $('.finale-done', sec);
        done.hidden = false;
        gsap.from(done, { y: 30, opacity: 0, duration: 0.7, ease: 'back.out(1.8)' });
      });
    if (reducedMotion) tl.progress(1);
  }, { once: true });

  $('.replay', sec).addEventListener('click', () => {
    buzz();
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
}
