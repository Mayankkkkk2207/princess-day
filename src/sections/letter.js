// 9. Love letter — lined paper, text types out line by line in Caveat
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mascot } from '../lib/mascots.js';
import { $, $$, reducedMotion } from '../lib/fx.js';

export function letterHTML(c) {
  const L = c.letter;
  const lines = [
    { t: L.greeting, cls: 'greet' },
    ...L.lines.map((t) => ({ t })),
    { t: '', cls: 'gap' },
    { t: L.signoff, cls: 'sign' },
    { t: c.from + ' 💗', cls: 'sign name' },
  ];
  return `
  <section class="section letter" id="letter" data-label="letter">
    <h2 class="section-title">${L.title}</h2>
    <div class="paper">
      <span class="tape tape-top"></span>
      <span class="paper-stamp" aria-hidden="true">💌</span>
      ${lines.map((l) => `<p class="ll ${l.cls || ''}"><span class="ghost">${l.t || '&nbsp;'}</span><span class="typed" data-text="${l.t.replace(/"/g, '&quot;')}"></span></p>`).join('')}
      <div class="letter-heart">${mascot('heart')}</div>
    </div>
  </section>`;
}

export function initLetter() {
  const typed = $$('.letter .typed');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let started = false;

  async function type() {
    if (started) return;
    started = true;
    for (const el of typed) {
      const text = el.dataset.text;
      if (reducedMotion) { el.textContent = text; continue; }
      el.classList.add('typing');
      for (let i = 1; i <= text.length; i++) {
        el.textContent = text.slice(0, i);
        await sleep(text[i - 1] === ',' ? 160 : 34);
      }
      el.classList.remove('typing');
      await sleep(320);
    }
    $('.letter-heart').classList.add('show');
  }

  ScrollTrigger.create({ trigger: '.paper', start: 'top 70%', once: true, onEnter: type });
}
