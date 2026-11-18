// 6. Timeline — dotted winding path, the bunny hops along it as she scrolls
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mascot } from '../lib/mascots.js';
import { $, $$, reducedMotion } from '../lib/fx.js';

export function timelineHTML(c) {
  const items = c.timeline.items.map((t, i) => `
    <li class="tl-item ${i % 2 ? 'right' : 'left'}">
      <span class="tl-dot" aria-hidden="true">${t.emoji || '💗'}</span>
      <div class="tl-card clay">
        <span class="tl-date">${t.date}</span>
        <h3>${t.title}</h3>
        <p>${t.text}</p>
      </div>
    </li>`).join('');

  return `
  <section class="section timeline" id="timeline" data-label="our story">
    <h2 class="section-title">${c.timeline.title}</h2>
    <div class="tl-wrap">
      <svg class="tl-path" aria-hidden="true"><path class="tl-line" /></svg>
      <ol class="tl-list">${items}</ol>
      <div class="tl-bunny">${mascot('bunny')}</div>
    </div>
  </section>`;
}

export function initTimeline() {
  const wrap = $('.tl-wrap');
  const svg = $('.tl-path', wrap);
  const path = $('.tl-line', wrap);
  const bunny = $('.tl-bunny', wrap);
  const dots = $$('.tl-dot', wrap);
  let pts = [];
  let len = 0;
  let progress = 0;

  function build() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const wr = wrap.getBoundingClientRect();
    pts = dots.map((d) => {
      const r = d.getBoundingClientRect();
      return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 };
    });
    // smooth S-curves between milestones, starting a bit above the first one
    const first = pts[0];
    let d = `M ${first.x} ${Math.max(first.y - 70, 0)} L ${first.x} ${first.y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const my = (a.y + b.y) / 2;
      d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
    }
    path.setAttribute('d', d);
    len = path.getTotalLength();
    place();
  }

  function place() {
    const p = path.getPointAtLength(progress * len);
    // a little hop: bounce height follows distance travelled
    const hop = reducedMotion ? 0 : Math.abs(Math.sin((progress * len) / 38)) * 16;
    bunny.style.transform = `translate(${p.x - bunny.offsetWidth / 2}px, ${p.y - bunny.offsetHeight * 0.85 - hop}px)`;
    dots.forEach((dot, i) => dot.classList.toggle('reached', p.y >= pts[i].y - 4));
  }

  build();
  ScrollTrigger.create({
    trigger: wrap,
    start: 'top 65%',
    end: 'bottom 65%',
    scrub: reducedMotion ? false : 0.6,
    onUpdate: (st) => { progress = st.progress; place(); },
    onRefresh: build,
  });
}
