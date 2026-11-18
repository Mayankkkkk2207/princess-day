// 7. Mini game — catch falling hearts in a basket for N seconds
import { $, buzz, capture, confetti, reducedMotion } from '../lib/fx.js';

export function gameHTML(c) {
  return `
  <section class="section game" id="game" data-label="game">
    <h2 class="section-title">${c.game.title}</h2>
    <div class="game-card clay">
      <div class="game-hud">
        <span class="hud-pill">💗 <b class="g-score">0</b></span>
        <span class="hud-pill">⏱ <b class="g-time">${c.game.seconds}</b>s</span>
      </div>
      <canvas class="game-canvas" aria-label="Heart catching game"></canvas>
      <div class="game-overlay g-start">
        <div class="go-emoji">🧺</div>
        <p>${c.game.text}</p>
        <button class="btn btn-primary g-play">Let's play!</button>
      </div>
      <div class="game-overlay g-end" hidden>
        <div class="go-emoji">🏆</div>
        <p class="g-final">You caught <b class="g-final-score">0</b> hearts!</p>
        <p class="g-msg"></p>
        <button class="btn btn-primary g-unlock">Unlock my coupons 🎟️</button>
        <button class="btn btn-ghost g-again">play again</button>
      </div>
    </div>
  </section>`;
}

function emojiSprite(emoji, size) {
  const c = document.createElement('canvas');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  c.width = c.height = size * dpr;
  const x = c.getContext('2d');
  x.scale(dpr, dpr);
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.font = `${size * 0.82}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  x.fillText(emoji, size / 2, size / 2 + size * 0.05);
  return c;
}

export function initGame(c, { onUnlock }) {
  const sec = $('#game');
  const canvas = $('.game-canvas', sec);
  const ctx = canvas.getContext('2d');
  const scoreEl = $('.g-score', sec);
  const timeEl = $('.g-time', sec);
  const startOv = $('.g-start', sec);
  const endOv = $('.g-end', sec);
  const DURATION = c.game.seconds * 1000;

  const HEART = 34, GOLD = 38, BASKET = 64;
  const sprites = {
    heart: emojiSprite('💗', HEART),
    pink: emojiSprite('💖', HEART),
    gold: emojiSprite('💛', GOLD),
    basket: emojiSprite('🧺', BASKET),
  };

  let W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    basket.y = H - BASKET - 6;
    if (!running) draw();
  }

  const basket = { x: 0, y: 0, target: 0 };
  let hearts = [], pops = [], score = 0, running = false, t0 = 0, lastSpawn = 0, lastT = 0;

  function moveTo(clientX) {
    const r = canvas.getBoundingClientRect();
    basket.target = Math.max(0, Math.min(W - BASKET, clientX - r.left - BASKET / 2));
  }
  canvas.addEventListener('pointerdown', (e) => { moveTo(e.clientX); capture(canvas, e); });
  canvas.addEventListener('pointermove', (e) => moveTo(e.clientX));
  addEventListener('keydown', (e) => {
    if (!running) return;
    if (e.key === 'ArrowLeft') basket.target = Math.max(0, basket.target - 40);
    if (e.key === 'ArrowRight') basket.target = Math.min(W - BASKET, basket.target + 40);
  });

  function spawn() {
    const gold = Math.random() < 0.12;
    const size = gold ? GOLD : HEART;
    hearts.push({
      x: Math.random() * (W - size), y: -size, size,
      vy: (reducedMotion ? 1.6 : 2.2) + Math.random() * 1.8 + (performance.now() - t0) / 9000,
      sway: Math.random() * Math.PI * 2,
      img: gold ? sprites.gold : Math.random() < 0.5 ? sprites.heart : sprites.pink,
      pts: gold ? 3 : 1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const h of hearts) ctx.drawImage(h.img, h.x + Math.sin(h.sway) * 6, h.y, h.size, h.size);
    ctx.drawImage(sprites.basket, basket.x, basket.y, BASKET, BASKET);
    ctx.font = '700 18px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    for (const p of pops) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = '#FF5C8A';
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;
  }

  function loop(now) {
    if (!running) return;
    const dt = Math.min((now - lastT) / 16.67, 3); // frame-rate independent
    lastT = now;
    const elapsed = now - t0;
    const left = Math.max(0, DURATION - elapsed);
    timeEl.textContent = Math.ceil(left / 1000);

    if (now - lastSpawn > Math.max(260, 520 - elapsed / 40)) { spawn(); lastSpawn = now; }
    basket.x += (basket.target - basket.x) * Math.min(0.35 * dt, 1);

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.y += h.vy * dt;
      h.sway += 0.05 * dt;
      const cx = h.x + h.size / 2;
      const bottom = h.y + h.size;
      if (bottom > basket.y + 14 && bottom < basket.y + 40 && cx > basket.x + 4 && cx < basket.x + BASKET - 4) {
        score += h.pts;
        scoreEl.textContent = score;
        pops.push({ x: cx, y: basket.y, text: '+' + h.pts, life: 1 });
        hearts.splice(i, 1);
        buzz(8);
      } else if (h.y > H) hearts.splice(i, 1);
    }
    for (let i = pops.length - 1; i >= 0; i--) {
      pops[i].y -= 1.2 * dt; pops[i].life -= 0.03 * dt;
      if (pops[i].life <= 0) pops.splice(i, 1);
    }
    draw();
    if (left <= 0) return finish();
    requestAnimationFrame(loop);
  }

  function start() {
    buzz();
    resize();
    hearts = []; pops = []; score = 0;
    scoreEl.textContent = '0';
    basket.x = basket.target = (W - BASKET) / 2;
    startOv.hidden = true; endOv.hidden = true;
    running = true;
    t0 = lastT = lastSpawn = performance.now();
    requestAnimationFrame(loop);
  }

  function finish() {
    running = false;
    hearts = [];
    draw();
    $('.g-final-score', sec).textContent = score;
    const msg = [...c.game.results].sort((a, b) => b.min - a.min).find((r) => score >= r.min);
    $('.g-msg', sec).textContent = msg ? msg.text : '';
    endOv.hidden = false;
    buzz([30, 60, 30]);
    const r = canvas.getBoundingClientRect();
    confetti({ origin: { x: 0.5, y: (r.top + r.height / 2) / innerHeight } });
  }

  $('.g-play', sec).addEventListener('click', start);
  $('.g-again', sec).addEventListener('click', start);
  $('.g-unlock', sec).addEventListener('click', () => { buzz(); onUnlock(score); });

  // stop the loop if she scrolls away mid-game? No — just keep it light. Pause on hidden tab:
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) { running = false; finish(); } });

  new ResizeObserver(resize).observe(canvas);
  resize();
}
