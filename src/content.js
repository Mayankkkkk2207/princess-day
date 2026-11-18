// ─────────────────────────────────────────────────────────────
//  ALL THE WORDS & PHOTOS LIVE HERE. Edit this file only. 💗
//  Paths like 'photos/01.webp' point into the /public folder.
// ─────────────────────────────────────────────────────────────

export default {
  name: 'Khushi',            // her name or nickname
  from: 'Mayank',           // signed at the end of the letter

  loader: {
    text: 'loading cuteness…',
  },

  envelope: {
    title: 'For my Princess',
    subtitle: 'tap the seal to open 💌',
    inside: 'You have been officially crowned today 👑',
  },

  hero: {
    // {name} gets replaced with the name above
    title: 'Happy Princess Day, {name}',
    subtitle: 'a tiny website made just for you, with a whole lot of love',
  },

  reasons: {
    title: "Reasons you're my princess",
    hint: 'tap a card to flip it, swipe or tap again for the next',
    items: [
      'Your smile fixes my worst days in about 0.5 seconds.',
      'You laugh at my jokes, even the really bad ones.',
      'You make ordinary days feel like little adventures.',
      'You care about everyone around you so deeply.',
      'Your hugs should honestly be illegal, they are that good.',
      'You believe in me even when I forget to.',
      'You look adorable when you are sleepy and grumpy.',
      'You are my favourite person to do absolutely nothing with.',
    ],
  },

  memories: {
    title: 'Our little memories',
    hint: 'tap a photo to make it bigger',
    // src: path in /public (run `npm run photos` to make these from /pictures)
    // caption: short handwritten note under the polaroid
    photos: [
      { src: 'photos/01.webp', caption: 'this day 💗' },
      { src: 'photos/03.webp', caption: 'my favourite smile' },
      { src: 'photos/02.webp', caption: 'us being us' },
      { src: 'photos/04.webp', caption: 'best day ever' },
      { src: 'photos/05.webp', caption: 'so pretty omg' },
      { src: 'photos/06.webp', caption: 'core memory ✨' },
      { src: 'photos/07.webp', caption: 'look at you!' },
      { src: 'photos/08.webp', caption: 'again pls' },
      { src: 'photos/09.webp', caption: 'princess mode' },
      { src: 'photos/10.webp', caption: 'heart = full' },
      { src: 'photos/12.webp', caption: 'my whole world' },
      { src: 'photos/11.webp', caption: 'forever us' },
    ],
  },

  timeline: {
    title: 'Our story so far',
    items: [
      { date: 'The beginning', title: 'First chat', text: 'One message, and somehow I could not stop smiling at my phone.', emoji: '💬' },
      { date: 'Soon after', title: 'First date', text: 'I was so nervous. You were so cute. It went perfectly.', emoji: '☕' },
      { date: 'That one night', title: 'First "I love you"', text: 'Three words that changed everything.', emoji: '💗' },
      { date: 'Our adventure', title: 'First trip together', text: 'New places, same favourite person.', emoji: '✈️' },
      { date: 'Today', title: 'Princess Day', text: 'And this is just chapter one.', emoji: '👑' },
    ],
  },

  game: {
    title: 'Catch my love!',
    text: 'Move the basket and catch as many hearts as you can in 15 seconds. Your score unlocks your love coupons!',
    seconds: 15,
    // messages shown on the score screen, picked by score
    results: [
      { min: 0, text: 'Aww, every heart was yours anyway 💗' },
      { min: 10, text: 'Wow, you caught so much love!' },
      { min: 20, text: 'Certified love-catching champion 👑' },
    ],
  },

  coupons: {
    title: 'Love coupons',
    hint: 'scratch each card with your finger',
    lockedText: 'Play the little game above to unlock these 🔒',
    items: [
      { emoji: '🤗', title: '1 free hug', text: 'Redeemable anytime, anywhere. No limits.' },
      { emoji: '🎬', title: 'You pick the movie', text: 'No complaints from me. Even if it is a romcom.' },
      { emoji: '🥟', title: 'Momos on me', text: 'One full plate, extra chutney.' },
      { emoji: '💆‍♀️', title: 'Head massage', text: '15 minutes of pure pampering.' },
      { emoji: '🍦', title: 'Surprise dessert date', text: 'I plan it, you just show up cute.' },
      { emoji: '👑', title: 'Princess for a day', text: 'Your wish is my command. All day.' },
    ],
  },

  letter: {
    title: 'A little letter',
    greeting: 'My dearest Khushi,',
    lines: [
      'I made this tiny corner of the internet just for you,',
      'because you deserve to feel special every single day.',
      'Thank you for your patience, your laugh, and your love.',
      'You make my world softer, brighter and so much happier.',
      'I hope today makes you smile as much as you make me smile.',
    ],
    signoff: 'Forever yours,',
  },

  finale: {
    question: 'Will you always be my princess?',
    yes: 'Yes 💗',
    no: 'No',
    // the No button says these as she keeps tapping it
    noTexts: ['No', 'Are you sure?', 'Really sure?', 'Think again!', 'Pretty please?', 'Nope, wrong button', 'You can\'t catch me', '🥺'],
    successTitle: 'Yay! I knew it 💗',
    successText: 'Happy Princess Day, my love. Now come here and claim coupon #1 🤗',
  },

  music: {
    src: 'music/song.mp3',     // put your song here; the button hides if it is missing
    startOnEnvelope: true,     // start the song when she opens the envelope (a tap, so phones allow it)
  },
};
