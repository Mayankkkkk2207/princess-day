# Princess Day 👑

A cute, mobile-first scroll story: loader → envelope → hero → reasons → memories → timeline → mini game → scratch coupons → love letter → finale.

## Run it

```bash
npm install
npm run dev        # open the "Network" URL on your phone (same Wi-Fi) to test on a real device
npm run build      # production build in /dist
npm run preview    # preview the build
```

## Change the content

**All text lives in `src/content.js`.** Edit the name, reasons, captions, timeline, letter, coupons and finale lines there; you don't need to touch any code.

### Photos
1. Drop photos (jpg/png/webp) into `/pictures`.
2. Run `npm run photos`. It resizes and compresses them to `public/photos/01.webp`, `02.webp`, … in filename order.
3. List them in `content.js → memories.photos` with a caption each. A missing photo shows a cute placeholder.

### Music
Put your song at `public/music/song.mp3`. The 🎵 button only appears when the file exists. With `music.startOnEnvelope: true`, the song starts when she taps the wax seal (phones allow audio after a tap).

### Lottie mascots (optional)
Download free animations from LottieFiles (search "cute bear", "bunny", "heart") as **dotLottie** and save them as:

```
public/lottie/bear.lottie
public/lottie/bunny.lottie
public/lottie/heart.lottie
```

Each file found replaces the matching SVG mascot automatically; any that are missing keep the built-in SVG. The Lottie player only loads when at least one file exists.

## Deploy to GitHub Pages

1. Create a GitHub repo (it can be private if your plan supports private Pages; otherwise public) and push this folder to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Princess Day site"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push. Your link is `https://<you>.github.io/<repo>/`.

> ⚠️ Your photos are public on a public repo/site. If that matters, use a private repo with Vercel instead.

**Vercel alternative:** import the repo at vercel.com, keep the defaults (framework: Vite, output: `dist`) and deploy.

## Before you send it
- Open the link on your own phone first: tap through every section, play the game, scratch the coupons.
- Check that the sound plays after tapping the seal (and the phone isn't on silent).
- Re-run `npm run photos` and push again whenever you change photos.

## Notes
- Respects `prefers-reduced-motion`; no horizontal scroll; tap targets are at least 44px.
- Vibration (`navigator.vibrate`) works on Android; iPhones ignore it silently.
