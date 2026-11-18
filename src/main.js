import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from './content.js';
import { $, $$, buzz, initSparkleTrail, initMusic, initProgress, reducedMotion } from './lib/fx.js';
import { upgradeMascotsToLottie } from './lib/mascots.js';
import { loaderHTML, envelopeHTML, runLoader, runEnvelope } from './sections/intro.js';
import { heroHTML, initHero, playHeroIntro } from './sections/hero.js';
import { reasonsHTML, initReasons } from './sections/reasons.js';
import { memoriesHTML, initMemories } from './sections/memories.js';
import { timelineHTML, initTimeline } from './sections/timeline.js';
import { gameHTML, initGame } from './sections/game.js';
import { couponsHTML, initCoupons } from './sections/coupons.js';
import { letterHTML, initLetter } from './sections/letter.js';
import { finaleHTML, initFinale } from './sections/finale.js';

gsap.registerPlugin(ScrollTrigger);
if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger }); // handy for debugging in the console
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const c = content;

// ── build the page ──────────────────────────────────────────
$('#app').innerHTML = `
  ${loaderHTML(c)}
  ${envelopeHTML(c)}
  <main class="story">
    ${heroHTML(c)}
    ${reasonsHTML(c)}
    ${memoriesHTML(c)}
    ${timelineHTML(c)}
    ${gameHTML(c)}
    ${couponsHTML(c)}
    ${letterHTML(c)}
    ${finaleHTML(c)}
  </main>`;

// "tap to continue" cue at the bottom of every section except the last
const sections = $$('.story > .section');
sections.forEach((s, i) => {
  const next = sections[i + 1];
  if (!next) return;
  const cue = document.createElement('button');
  cue.className = 'cue';
  cue.innerHTML = `<span>${i === 0 ? 'tap to begin' : 'tap to continue'}</span><span class="cue-arrow">⌄</span>`;
  cue.addEventListener('click', () => { buzz(10); next.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); });
  s.appendChild(cue);
});

// ── wire up sections ───────────────────────────────────────
initHero();
initReasons();
initMemories(c);
initTimeline();
const coupons = initCoupons();
initGame(c, {
  onUnlock: () => {
    coupons.unlock();
    setTimeout(() => $('#coupons').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }), 150);
  },
});
initLetter();
initFinale(c);

// ── extras ─────────────────────────────────────────────────
initSparkleTrail();
const music = initMusic(c.music.src);
upgradeMascotsToLottie();

// "pop" micro-interaction on every button
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest('.btn, .cue, .music-btn');
  if (b && !reducedMotion && !b.matches('.btn-no, .btn-yes')) gsap.fromTo(b, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.4)', overwrite: 'auto' });
});

// ── the story starts ───────────────────────────────────────
(async () => {
  window.scrollTo(0, 0);
  await runLoader();
  await runEnvelope(c, { onOpen: () => c.music.startOnEnvelope && music.play() });
  document.body.classList.remove('locked');
  initProgress(sections).classList.add('show');
  ScrollTrigger.refresh();
  playHeroIntro();
})();
