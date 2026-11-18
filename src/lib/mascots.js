// Original SVG placeholder mascots (round bear + bunny with blush cheeks).
// If /public/lottie/bear.lottie (etc.) exists, they are swapped for Lottie animations.

const BEAR = `
<svg viewBox="0 0 140 150" aria-hidden="true">
  <g class="m-body">
    <ellipse cx="70" cy="124" rx="38" ry="26" fill="#E9BE97"/>
    <ellipse cx="70" cy="128" rx="22" ry="15" fill="#FFF4EA"/>
    <ellipse class="arm-l" cx="36" cy="118" rx="10" ry="14" fill="#DDAE85"/>
    <ellipse class="arm-r" cx="106" cy="118" rx="10" ry="14" fill="#DDAE85"/>
  </g>
  <g class="m-head">
    <circle cx="36" cy="34" r="16" fill="#E9BE97"/><circle cx="36" cy="34" r="8" fill="#F8B4C2"/>
    <circle cx="104" cy="34" r="16" fill="#E9BE97"/><circle cx="104" cy="34" r="8" fill="#F8B4C2"/>
    <circle cx="70" cy="66" r="42" fill="#F0C9A4"/>
    <g class="eyes">
      <ellipse cx="54" cy="62" rx="4.6" ry="5.6" fill="#4A3434"/>
      <ellipse cx="86" cy="62" rx="4.6" ry="5.6" fill="#4A3434"/>
      <circle cx="55.6" cy="60" r="1.6" fill="#fff"/><circle cx="87.6" cy="60" r="1.6" fill="#fff"/>
    </g>
    <ellipse cx="43" cy="77" rx="8" ry="4.6" fill="#FF9FB5" opacity=".75"/>
    <ellipse cx="97" cy="77" rx="8" ry="4.6" fill="#FF9FB5" opacity=".75"/>
    <ellipse cx="70" cy="80" rx="14" ry="10" fill="#FFF4EA"/>
    <ellipse cx="70" cy="75.5" rx="5" ry="3.6" fill="#4A3434"/>
    <path d="M63 82 Q66.5 86.5 70 82 Q73.5 86.5 77 82" fill="none" stroke="#4A3434" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

const BUNNY = `
<svg viewBox="0 0 140 150" aria-hidden="true">
  <g class="m-head">
    <g class="ear-l"><ellipse cx="50" cy="34" rx="12" ry="30" fill="#FFFDFE" stroke="#EECCD8" stroke-width="2.5"/><ellipse cx="50" cy="36" rx="5.5" ry="20" fill="#FFC6D3"/></g>
    <g class="ear-r"><ellipse cx="90" cy="34" rx="12" ry="30" fill="#FFFDFE" stroke="#EECCD8" stroke-width="2.5"/><ellipse cx="90" cy="36" rx="5.5" ry="20" fill="#FFC6D3"/></g>
  </g>
  <g class="m-body">
    <ellipse cx="70" cy="128" rx="32" ry="20" fill="#FFFDFE" stroke="#EECCD8" stroke-width="2.5"/>
    <ellipse class="arm-l" cx="44" cy="122" rx="8" ry="11" fill="#FFFDFE" stroke="#EECCD8" stroke-width="2.5"/>
    <ellipse class="arm-r" cx="96" cy="122" rx="8" ry="11" fill="#FFFDFE" stroke="#EECCD8" stroke-width="2.5"/>
  </g>
  <g class="m-head">
    <circle cx="70" cy="80" r="38" fill="#FFFDFE" stroke="#EECCD8" stroke-width="2.5"/>
    <g class="eyes">
      <ellipse cx="56" cy="78" rx="4.4" ry="5.4" fill="#4A3434"/>
      <ellipse cx="84" cy="78" rx="4.4" ry="5.4" fill="#4A3434"/>
      <circle cx="57.4" cy="76" r="1.5" fill="#fff"/><circle cx="85.4" cy="76" r="1.5" fill="#fff"/>
    </g>
    <ellipse cx="46" cy="91" rx="7.5" ry="4.4" fill="#FF9FB5" opacity=".7"/>
    <ellipse cx="94" cy="91" rx="7.5" ry="4.4" fill="#FF9FB5" opacity=".7"/>
    <path d="M66.5 87 L73.5 87 L70 91 Z" fill="#FF8FAB" stroke="#FF8FAB" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M64 94 Q67 97.5 70 94 Q73 97.5 76 94" fill="none" stroke="#4A3434" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>`;

const HEART = `
<svg viewBox="0 0 100 92" aria-hidden="true">
  <path d="M50 88 C20 66 4 50 4 28 C4 13 16 4 28 4 C38 4 46 10 50 18 C54 10 62 4 72 4 C84 4 96 13 96 28 C96 50 80 66 50 88Z" fill="#FF8FAB"/>
  <ellipse cx="28" cy="26" rx="9" ry="6" fill="#fff" opacity=".55" transform="rotate(-30 28 26)"/>
  <g class="eyes"><ellipse cx="38" cy="44" rx="3.6" ry="4.4" fill="#4A3434"/><ellipse cx="62" cy="44" rx="3.6" ry="4.4" fill="#4A3434"/></g>
  <ellipse cx="30" cy="54" rx="6" ry="3.5" fill="#fff" opacity=".45"/><ellipse cx="70" cy="54" rx="6" ry="3.5" fill="#fff" opacity=".45"/>
  <path d="M45 52 Q50 57 55 52" fill="none" stroke="#4A3434" stroke-width="2.4" stroke-linecap="round"/>
</svg>`;

export const CROWN = `
<svg viewBox="0 0 120 90" aria-hidden="true">
  <path d="M10 70 L16 22 L40 46 L60 10 L80 46 L104 22 L110 70 Z" fill="#FFD66B" stroke="#F2B53C" stroke-width="4" stroke-linejoin="round"/>
  <rect x="10" y="66" width="100" height="16" rx="7" fill="#FFC94A" stroke="#F2B53C" stroke-width="4"/>
  <circle cx="60" cy="74" r="5" fill="#FF8FAB"/><circle cx="36" cy="74" r="4" fill="#B9A3FF"/><circle cx="84" cy="74" r="4" fill="#8FE3C0"/>
  <circle cx="16" cy="20" r="6" fill="#FF8FAB"/><circle cx="60" cy="9" r="7" fill="#FF8FAB"/><circle cx="104" cy="20" r="6" fill="#FF8FAB"/>
  <path d="M28 40 L32 60" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>
</svg>`;

const SVGS = { bear: BEAR, bunny: BUNNY, heart: HEART };

/** Returns mascot HTML. opts: { wave, hop, cls } */
export function mascot(type, opts = {}) {
  const cls = ['mascot', `mascot-${type}`];
  if (opts.wave) cls.push('is-waving');
  if (opts.cls) cls.push(opts.cls);
  return `<div class="${cls.join(' ')}" data-mascot="${type}">${SVGS[type]}</div>`;
}

const base = import.meta.env.BASE_URL;

/** Does a real (non-HTML) file exist at this public path? */
export async function fileExists(path) {
  try {
    const r = await fetch(base + path, { method: 'HEAD', cache: 'no-store' });
    const type = r.headers.get('content-type') || '';
    return r.ok && !type.includes('text/html'); // dev server returns index.html for missing files
  } catch {
    return false;
  }
}

/** Swap SVG placeholders for Lottie files, if the user added them to /public/lottie. */
export async function upgradeMascotsToLottie() {
  const types = ['bear', 'bunny', 'heart'];
  const available = {};
  await Promise.all(types.map(async (t) => (available[t] = await fileExists(`lottie/${t}.lottie`))));
  if (!Object.values(available).some(Boolean)) return;

  const [{ DotLottie }, { default: wasmUrl }] = await Promise.all([
    import('@lottiefiles/dotlottie-web'),
    import('@lottiefiles/dotlottie-web/dist/dotlottie-player.wasm?url'),
  ]);
  DotLottie.setWasmUrl(wasmUrl);

  document.querySelectorAll('[data-mascot]').forEach((el) => {
    const t = el.dataset.mascot;
    if (!available[t] || el.dataset.lottie) return;
    el.dataset.lottie = '1';
    const canvas = document.createElement('canvas');
    canvas.className = 'lottie-canvas';
    el.innerHTML = '';
    el.appendChild(canvas);
    el.classList.add('is-lottie');
    const player = new DotLottie({ canvas, src: base + `lottie/${t}.lottie`, autoplay: true, loop: true });
    // pause when off-screen to save battery / keep 60fps
    new IntersectionObserver(([e]) => (e.isIntersecting ? player.play() : player.pause())).observe(el);
  });
}
