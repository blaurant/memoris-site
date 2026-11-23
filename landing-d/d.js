(() => {
  const M = window.Memoris;
  if (!M || !M.ready) return;
  const { fix } = M.util;
  const still = M.still;
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, still.matches ? 0 : ms));
  const within = (n, low = 0, high = 1) => Math.min(Math.max(n, low), high);
  const smooth = (t) => t * t * (3 - 2 * t);

  const INK = M.ink;
  const CARD = M.card;
  const PAINT = { coral: '#E2603A', coralDeep: '#C64A29', rose: '#E78E86', amber: '#E8AE2F', amberPale: '#F6DD9C', mint: '#CDE4D6' };
  const SITE = '../site/';
  const line = (width) => 'fill="none" stroke="' + INK + '" stroke-width="' + fix(width) + '" stroke-linecap="round" stroke-linejoin="round"';
  const inked = (fill, width) => 'fill="' + fill + '" stroke="' + INK + '" stroke-width="' + fix(width) + '" stroke-linecap="round" stroke-linejoin="round"';

  const UNIT_BOX = [-150, -34, 500, 760];
  const PEN_ON_SCREEN = 2.9;
  const PEN_RANGE = [2.5, 9];
  const HAND_TILT = 'rotate(2.4 120 760)';
  const SLEEVE = 'M-56 846C40 866 160 858 262 830L310 1900H-200Z';
  const CUFF = 'M-46 788C40 804 150 798 250 770L258 836C160 864 40 870 -54 852Z';
  const CUFF_RIBS = 'M-6 806L-9 849M44 812L43 857M96 811L96 857M148 806L150 851M200 794L204 839';
  const PALMS = {
    grip: 'M-94 598C-94 632 -82 662 -62 694C-44 724 -30 750 -26 790L-30 880H238L232 790C234 748 266 708 288 660C302 632 306 604 296 570L270 560V440H14V527Z',
    open: 'M-94 598C-94 632 -82 662 -62 694C-44 724 -30 750 -26 790L-30 880H238L232 790C236 750 270 722 300 690C322 666 334 640 330 610L258 560V440H14V527Z'
  };
  const THUMBS = {
    tap: ['M-94 598C-95 574 -84 556 -64 544C-42 531 -20 518 0 506C14 498 30 494 44 492C62 484 80 470 100 468C124 466 138 484 132 504C128 522 112 534 94 540C60 556 28 578 4 600C-4 608 -8 616 -10 626', 'M93 487C103 479 116 479 122 488C126 494 126 501 123 507', 'M8 520C14 526 17 533 16 541'],
    rest: ['M-94 598C-98 556 -92 514 -76 476C-64 446 -46 416 -28 400C-12 386 10 392 14 412C17 432 9 462 2 492C-4 520 -8 560 -9 600C-9 610 -10 618 -10 626', 'M-20 418C-16 404 2 400 6 416C8 428 4 440 -2 450', 'M-58 500C-50 506 -44 514 -42 522'],
    wrap: ['M-94 598C-95 574 -84 556 -64 546C-20 530 40 516 100 508C128 504 156 498 180 500C202 502 212 522 202 538C194 550 166 554 136 556C86 560 34 580 6 602C-2 608 -8 616 -10 626', 'M150 507C166 503 186 505 192 517C196 526 190 536 180 540', 'M52 522C58 528 60 536 58 544']
  };
  THUMBS.hold = THUMBS.tap;
  const FINGERS = {
    wrap: [[406, 50, 239, 304, -3], [458, 52, 231, 308, -1], [510, 50, 237, 306, 1], [554, 40, 248, 299, 5]],
    tight: [[406, 50, 210, 304, -3], [458, 52, 200, 308, -1], [510, 50, 206, 306, 1], [554, 40, 222, 299, 5]],
    open: [[404, 46, 374, 262, -16], [452, 48, 394, 262, -6], [500, 46, 386, 262, 4], [544, 40, 362, 262, 14]]
  };

  function finger([cy, tall, tip, back, tilt], ink) {
    const side = tip < back ? 1 : -1;
    const x = (from, by) => fix(from + side * tall * by);
    const y = (by) => fix(cy + tall * by);
    const d = 'M' + back + ' ' + y(-0.42) +
      'C' + x(back, -0.04) + ' ' + y(-0.55) + ' ' + x(tip, 0.5) + ' ' + y(-0.52) + ' ' + x(tip, 0.22) + ' ' + y(-0.4) +
      'C' + x(tip, -0.08) + ' ' + y(-0.24) + ' ' + x(tip, -0.08) + ' ' + y(0.26) + ' ' + x(tip, 0.24) + ' ' + y(0.42) +
      'C' + x(tip, 0.5) + ' ' + y(0.54) + ' ' + x(back, -0.04) + ' ' + y(0.55) + ' ' + back + ' ' + y(0.42) +
      'C' + x(back, 0.2) + ' ' + y(0.2) + ' ' + x(back, 0.2) + ' ' + y(-0.2) + ' ' + back + ' ' + y(-0.42) + 'Z';
    return '<g transform="rotate(' + tilt + ' ' + back + ' ' + cy + ')"><path d="' + d + '" ' + inked(CARD, ink) + '/></g>';
  }
  function sleeve(color, ink) {
    return '<path d="' + SLEEVE + '" ' + inked(color, ink) + '/><path d="' + CUFF + '" ' + inked(color, ink) + '/><path data-fine d="' + CUFF_RIBS + '" ' + line(ink * 0.62) + '/>';
  }
  function held(o) {
    const pose = o.thumb || 'tap';
    const [thumb, nail, crease] = THUMBS[pose];
    return '<path d="' + PALMS[o.palm || 'grip'] + '" ' + inked(CARD, o.ink) + '/>' + o.thing +
      FINGERS[o.fingers || 'wrap'].map((one) => finger(one, o.ink)).join('') + (o.under || '') +
      '<g class="thumb thumb--' + pose + '"><path d="' + thumb + '" ' + inked(CARD, o.ink) + '/><path data-fine d="' + nail + '" ' + line(o.ink * 0.68) + '/><path data-fine d="' + crease + '" ' + line(o.ink * 0.68) + '/></g>' +
      sleeve(o.sleeve || PAINT.coral, o.ink) + (o.over || '');
  }
  function pointer(ink) {
    return '<g class="pointer" transform="translate(176 516) rotate(60)">' +
      '<path d="M384 -66C398 -12 398 56 386 108L1200 200V-170Z" ' + inked(PAINT.coral, ink) + '/>' +
      '<path d="M332 -54C344 -8 344 50 334 98L392 106C404 54 404 -10 390 -64Z" ' + inked(PAINT.coral, ink) + '/>' +
      '<path data-fine d="M342 -28H387M344 8H391M344 44H391M340 80H384" ' + line(ink * 0.62) + '/>' +
      '<path d="M150 -44C186 -62 236 -56 262 -34L340 -40V84L266 72C250 96 206 104 172 92C146 82 132 56 134 26C136 0 138 -28 150 -44Z" ' + inked(CARD, ink) + '/>' +
      finger([0, 46, 0, 170, 0], ink) +
      '<path data-fine d="M168 34C160 44 160 58 168 68M190 52C184 62 186 76 194 84M214 62C210 72 214 84 222 90M196 -30C206 -44 228 -46 240 -34" ' + line(ink * 0.68) + '/></g>';
  }
  function phone(o) {
    const mic = o.mic === false ? '' : '<g class="mic" transform="translate(160 498)"><circle data-still class="mic__ring" r="29" fill="none" stroke="' + PAINT.coral + '" stroke-width="' + fix(o.ink) + '"/>' +
      '<circle cx="0" cy="5" r="29" ' + inked(PAINT.coralDeep, o.ink) + '/><g class="mic__cap"><circle cx="0" cy="0" r="29" ' + inked(PAINT.coral, o.ink) + '/>' +
      '<path data-still d="M-20 -9C-16 -17 -9 -22 -1 -23" fill="none" stroke="' + CARD + '" stroke-width="' + fix(o.ink * 0.7) + '" stroke-linecap="round" opacity=".7"/>' +
      '<path data-still d="M-7 -13a7 7 0 0 1 14 0v9a7 7 0 0 1 -14 0zM-13 -4a13 13 0 0 0 26 0M0 9v7M-7 16h14" ' + line(o.ink * 0.72) + '/></g></g>';
    return '<path data-still d="M-3 132v40M-3 190v40M283 150v72" fill="none" stroke="' + INK + '" stroke-width="' + fix(o.ink * 1.9) + '" stroke-linecap="round"/>' +
      '<rect x="0" y="0" width="280" height="572" rx="46" ' + inked(CARD, o.ink) + '/>' +
      '<rect x="12" y="12" width="256" height="548" rx="35" ' + inked(PAINT.mint, o.ink * 0.72) + '/>' +
      '<clipPath id="' + o.clip + '"><rect x="12" y="12" width="256" height="548" rx="35"/></clipPath>' +
      '<g clip-path="url(#' + o.clip + ')">' + o.screen + '</g>' +
      '<rect data-still x="100" y="27" width="80" height="24" rx="12" fill="' + INK + '"/>' + (o.time ? '<text class="phone__time" x="60" y="46" text-anchor="middle">' + o.time + '</text>' : '') + mic;
  }

  const THREAD = [12, 350, 140, 378, 268, 345];
  const KEEPER_SIZE = 1.3;
  const KEEPER_AT = 0.3;
  function screen(o) {
    const [x, y] = M.threadPoint(THREAD, KEEPER_AT);
    const tags = o.tags.map((tag) => '<g data-tag="' + tag.mark + '"' + (tag.fresh ? ' data-fresh' : '') + '>' + M.hung(THREAD, tag.t, { mark: tag.mark, fill: tag.fill, length: tag.length || 22, w: 36, h: 46 }) + '</g>').join('');
    const keepers = o.keepers.map((named) => {
      const k = M.keeper(Object.assign({ color: 'teal', prop: 'satchel', head: -4, ink: o.ink / KEEPER_SIZE }, named.is));
      const motion = 'class="sway" data-a="1.5" data-s=".2" data-p="0" data-x="' + fix(k.anchors.curl[0]) + '" data-y="' + fix(k.anchors.curl[1]) + '"';
      return '<g class="kp" data-k="' + named.name + '"' + (named.takes ? ' data-takes="' + named.takes + '"' : '') + '>' + M.seat(k, x, y, KEEPER_SIZE, { motion }) + '</g>';
    }).join('');
    return M.strand(THREAD, { width: o.ink }) + tags + keepers;
  }

  const HELD_TAG = { w: 36, h: 46, length: 16 };
  const SCREENS = {
    cover: {
      hand: { thumb: 'tap' },
      tags: [{ mark: 'key', t: 0.63, length: 20 }, { mark: 'face', t: 0.8, length: 34, fill: PAINT.amberPale }],
      keepers: [
        { name: 'open', is: { mood: 'open' } },
        { name: 'key', takes: 'key', is: { mood: 'saying', arm: 'give', hold: Object.assign({ mark: 'key' }, HELD_TAG) } },
        { name: 'face', takes: 'face', is: { mood: 'saying', arm: 'give', hold: Object.assign({ mark: 'face', fill: PAINT.amberPale }, HELD_TAG) } },
        { name: 'glad', is: { mood: 'glad' } }
      ]
    },
    keep: {
      time: '9:15',
      hand: { thumb: 'rest', over: pointer },
      tags: [{ mark: 'key', t: 0.63, length: 20 }, { mark: 'calendar', t: 0.8, length: 34, fill: PAINT.amberPale, fresh: true }],
      keepers: [{ name: 'open', is: { mood: 'open' } }, { name: 'busy', is: { pose: 'draw' } }, { name: 'glad', is: { mood: 'glad', arm: 'point' } }]
    },
    hint: {
      time: '12:30',
      hand: { thumb: 'rest' },
      tags: [{ mark: 'face', t: 0.63, length: 20 }, { mark: 'heart', t: 0.8, length: 34, fill: PAINT.amberPale }],
      keepers: [{ name: 'open', is: { mood: 'open' } }, { name: 'busy', is: { mood: 'thinking', arm: 'chin' } }, { name: 'glad', is: { mood: 'laughing', arm: 'wave' } }]
    },
    find: {
      time: '7:30',
      hand: { thumb: 'tap' },
      tags: [{ mark: 'star', t: 0.63, length: 20, fill: PAINT.amberPale }, { mark: 'photo', t: 0.8, length: 34 }],
      keepers: [{ name: 'open', is: { mood: 'open' } }, { name: 'busy', is: { mood: 'thinking', arm: 'chin' } }, { name: 'glad', takes: 'star', is: { mood: 'glad', arm: 'give', hold: Object.assign({ mark: 'star', fill: PAINT.amberPale }, HELD_TAG) } }]
    },
    yours: {
      hand: { thumb: 'wrap', fingers: 'tight', mic: false },
      tags: [{ mark: 'lock', t: 0.63, length: 20, fill: PAINT.amberPale }, { mark: 'heart', t: 0.8, length: 34 }],
      keepers: [{ name: 'open', is: { mood: 'open' } }, { name: 'glad', takes: 'heart', is: { mood: 'glad', arm: 'give', hold: Object.assign({ mark: 'heart' }, HELD_TAG) } }]
    },
    elsewhere: {
      hand: { thumb: 'rest', mic: false },
      tags: [{ mark: 'key', t: 0.63, length: 20 }, { mark: 'check', t: 0.8, length: 34, fill: PAINT.amberPale, fresh: true }],
      keepers: [{ name: 'idle', is: { mood: 'open', arm: 'hold', hold: 'letter' } }, { name: 'error', is: { mood: 'worried', marks: 'question', arm: 'hold', hold: 'letter' } }, { name: 'sent', is: { mood: 'glad', arm: 'wave' } }]
    },
    last: {
      hand: { palm: 'open', thumb: 'tap', fingers: 'open' },
      tags: [{ mark: 'key', t: 0.63, length: 20 }, { mark: 'heart', t: 0.8, length: 34, fill: PAINT.amberPale }],
      keepers: [{ name: 'glad', is: { mood: 'glad', arm: 'wave' } }]
    }
  };

  const penFor = (el, across) => {
    const unit = (el.getBoundingClientRect().width || across) / across;
    el.unit = unit;
    return within(PEN_ON_SCREEN / unit, PEN_RANGE[0], PEN_RANGE[1]);
  };
  function inHand(name, view, ink) {
    const hand = view.hand || {};
    const thing = phone({ ink, clip: 'glass-' + name, time: view.time, mic: hand.mic, screen: screen(Object.assign({ ink }, view)) });
    return held({ ink, thing, palm: hand.palm, thumb: hand.thumb, fingers: hand.fingers, over: hand.over ? hand.over(ink) : '' });
  }
  Object.keys(SCREENS).forEach((name) => {
    M.scenes[name] = (el) => '<g class="boil"><g transform="' + HAND_TILT + '">' + inHand(name, SCREENS[name], penFor(el, UNIT_BOX[2])) + '</g></g>';
  });

  const SCRIBBLES = ['M40 232C58 224 70 240 88 232S118 226 136 233S168 238 188 230', 'M40 262C60 256 76 268 96 262S130 256 150 264', 'M40 292C56 286 74 298 92 291S126 285 148 293S184 296 214 289', 'M40 322C62 316 80 327 100 321S140 318 170 324', 'M40 352C58 346 72 358 92 352S122 346 144 353S190 356 226 350', 'M40 382C60 377 78 388 98 382'];
  const STRUCK = 'M34 266L160 258M34 356L236 346';
  const SLIPS = [[44, 72, -14, 0.1, 'M-20 -10C-10 -14 0 -6 12 -10M-20 2C-8 -2 4 6 20 1'], [152, 34, 9, 0.45, 'M-20 -10C-8 -14 2 -6 18 -10M-20 2C-10 -2 0 5 10 2'], [262, 74, -8, 0.8, 'M-20 -10C-10 -13 2 -6 16 -9M-20 2C-6 -1 6 6 20 2']];
  M.scenes.notes = (el) => {
    const ink = penFor(el, UNIT_BOX[2]);
    const pad = '<rect x="8" y="150" width="264" height="430" rx="12" ' + inked(CARD, ink) + '/>' +
      '<path d="M8 206V162A12 12 0 0 1 20 150H260A12 12 0 0 1 272 162V206Z" ' + inked(PAINT.amber, ink) + '/>' +
      '<path data-still d="M62 136v34M112 136v34M168 136v34M218 136v34" fill="none" stroke="' + INK + '" stroke-width="' + fix(ink * 1.7) + '" stroke-linecap="round"/>' +
      '<path data-fine d="' + SCRIBBLES.join('') + '" ' + line(ink * 0.72) + '/>' +
      '<path data-fine d="' + STRUCK + '" fill="none" stroke="' + PAINT.coralDeep + '" stroke-width="' + fix(ink * 0.9) + '" stroke-linecap="round"/>';
    const pencil = '<g transform="translate(26 596) rotate(-52)"><path d="M0 -9H196L226 0L196 9H0Z" ' + inked(PAINT.amber, ink) + '/><path d="M0 -9H22V9H0Z" ' + inked(PAINT.coral, ink) + '/>' +
      '<path d="M196 -9L226 0L196 9Z" ' + inked(CARD, ink) + '/><path data-still d="M213 -4L226 0L213 4Z" fill="' + INK + '"/></g>';
    const slips = SLIPS.map(([x, y, spin, phase, writing]) => '<g transform="translate(' + x + ' ' + y + ')"><g class="bob" data-a="7" data-s=".24" data-p="' + phase + '"><g transform="rotate(' + spin + ')">' +
      '<rect x="-34" y="-26" width="68" height="52" rx="4" ' + inked(PAINT.amberPale, ink) + '/><path data-fine d="' + writing + '" ' + line(ink * 0.62) + '/></g></g></g>').join('');
    return '<g class="boil"><g transform="' + HAND_TILT + '">' + slips + held({ ink, thing: pad, thumb: 'hold', under: pencil }) + '</g></g>';
  };

  const HELPER_FINGERS = [[904, 46, 120, 262, -2], [950, 48, 104, 270, 0], [996, 46, 112, 268, 1], [1038, 40, 134, 260, 3]];
  const CLINICIAN = { at: 'translate(-236 690) rotate(-13) scale(.46)', size: 0.46 };
  M.scenes.who = (el) => {
    const ink = penFor(el, UNIT_BOX[2]);
    const view = { hand: { thumb: 'rest', mic: false }, tags: [{ mark: 'key', t: 0.63, length: 20 }, { mark: 'heart', t: 0.8, length: 34, fill: PAINT.amberPale }], keepers: [{ name: 'glad', is: { mood: 'glad', arm: 'wave' } }] };
    const far = ink / CLINICIAN.size;
    const board = '<rect x="14" y="250" width="252" height="330" rx="12" ' + inked(PAINT.amberPale, far) + '/><rect x="34" y="292" width="212" height="280" rx="4" ' + inked(CARD, far * 0.8) + '/>' +
      '<path d="M100 236H180V276H100Z" ' + inked(INK, far) + '/>' +
      '<path data-fine d="M62 340H218M62 384H218M62 428H170" ' + line(far * 0.7) + '/>';
    const clinician = '<g transform="' + CLINICIAN.at + '">' + held({ ink: far, thing: board, thumb: 'hold', sleeve: PAINT.amber }) + '</g>';
    const helper = '<path d="M262 872C310 860 356 884 366 934C374 986 352 1044 312 1062C292 1070 268 1066 250 1056Z" ' + inked(CARD, ink) + '/>' +
      HELPER_FINGERS.map((one) => finger(one, ink)).join('') +
      '<path d="M330 880C352 900 372 944 370 1000C368 1030 356 1056 338 1072L720 1240V760Z" ' + inked(PAINT.rose, ink) + '/>' +
      '<path d="M318 870C346 892 366 940 362 996C360 1030 346 1058 324 1076L352 1090C380 1066 396 1034 398 996C400 942 380 890 348 862Z" ' + inked(PAINT.rose, ink) + '/>';
    return '<g class="boil"><g transform="' + HAND_TILT + '">' + clinician + inHand('who', view, ink) + helper + '</g></g>';
  };

  M.scenes.calendar = () => '<g class="boil" transform="rotate(-3 104 118)">' +
    '<rect x="6" y="30" width="196" height="186" rx="9" ' + inked(CARD, 3) + '/>' +
    '<path d="M6 76V39A9 9 0 0 1 15 30H193A9 9 0 0 1 202 39V76Z" ' + inked(PAINT.amber, 3) + '/>' +
    '<path data-still d="M60 12V44M148 12V44" fill="none" stroke="' + INK + '" stroke-width="5.5" stroke-linecap="round"/>' +
    '<path data-still d="M24 172H184" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-dasharray=".1 6.5" stroke-linecap="round"/>' +
    '<path data-still d="M34 200c2.600-2.600 3.500-6 3.500-9.500a6.500 6.500 0 0 1 13 0c0 3.500.900 6.900 3.500 9.500zM41.500 203.500a2.500 2.500 0 0 0 5 0M44 184v-2.500" ' + line(2.1) + '/>' +
    '<text class="obj__caps" x="104" y="61" text-anchor="middle">THURSDAY</text><text class="obj__big" x="104" y="127" text-anchor="middle">noon</text>' +
    '<text class="obj__text" x="104" y="154" text-anchor="middle">Lunch with Claire</text><text class="obj__note" x="64" y="201">Bring her book</text></g>';

  const NAME = ['A', 'l', 'e', 'x'];
  M.scenes.name = () => '<g class="boil" transform="rotate(-3 146 68)">' +
    '<path data-still d="M30 68C18 60 8 62 2 70" ' + line(2.6) + '/>' +
    '<path d="M52 8H280A6 6 0 0 1 286 14V122A6 6 0 0 1 280 128H52L24 100V36Z" ' + inked(CARD, 3) + '/>' +
    '<circle data-still cx="44" cy="68" r="7" fill="' + INK + '"/>' +
    NAME.map((letter, i) => '<g class="slot" data-letter><text x="' + (98 + i * 50) + '" y="94" text-anchor="middle">' + letter + '</text><path data-still d="M' + (80 + i * 50) + ' 106h36" ' + line(3.4) + '/></g>').join('') + '</g>';

  M.scenes.ticket = () => '<g class="boil" transform="rotate(-3 150 62)">' +
    '<path d="M15 6H285A9 9 0 0 1 294 15V44A18 18 0 0 0 294 80V109A9 9 0 0 1 285 118H15A9 9 0 0 1 6 109V80A18 18 0 0 0 6 44V15A9 9 0 0 1 15 6Z" ' + inked(CARD, 3) + '/>' +
    '<path d="M236 6H285A9 9 0 0 1 294 15V44A18 18 0 0 0 294 80V109A9 9 0 0 1 285 118H236Z" ' + inked(PAINT.amber, 3) + '/>' +
    '<path data-still d="M236 14V110" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-dasharray=".1 6.5" stroke-linecap="round"/>' +
    '<path d="M263 45l4.400 9.200 10.100 1.300-7.400 7 1.900 10-9-5-9 5 1.900-10-7.400-7 10.100-1.300z" ' + inked(CARD, 2.2) + '/>' +
    '<text class="obj__caps" x="36" y="43">SATURDAY EVENING</text><text class="obj__film" x="35" y="89">Blue Moon</text></g>';

  const CLOCK = (() => {
    let marks = '';
    for (let hour = 0; hour < 12; hour++) marks += '<path class="clock__' + (hour % 3 ? 'minor' : 'major') + '" d="M56 ' + (hour % 3 ? '12v4' : '10v8') + '" transform="rotate(' + hour * 30 + ' 56 56)"/>';
    return '<circle class="clock__face" cx="56" cy="56" r="52"/>' + marks + '<path class="clock__h" d="M56 59V32"/><path class="clock__m" d="M56 61V20"/><circle class="clock__pin" cx="56" cy="56" r="4.5"/>';
  })();
  const ARROW = '<svg class="arrow__line" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M1 10C18 8 30 12 48 10S82 9 98 10"/></svg><svg class="arrow__head" viewBox="0 0 14 20"><path d="M2 2.500C5 5 9 7.500 12 10C9 12.500 5 15.500 2 18"/></svg>';

  function showKeeper(host, name) {
    if (!host) return;
    host.dataset.shown = name;
    let taken = '';
    $$('.kp', host).forEach((group) => {
      const on = group.dataset.k === name;
      group.toggleAttribute('hidden', !on);
      if (on) taken = group.dataset.takes || '';
    });
    $$('[data-tag]', host).forEach((tag) => tag.classList.toggle('is-out', tag.dataset.tag === taken));
  }
  const freshTag = (host, on) => {
    const fresh = host && $('[data-fresh]', host);
    if (fresh) fresh.classList.toggle('on', on);
    if (host) host.dataset.hung = on ? '1' : '';
  };

  function roundRect(w, h, r, inset) {
    const [x0, y0, x1, y1] = [inset, inset, w - inset, h - inset];
    return 'M' + (x0 + r) + ' ' + y0 + 'H' + (x1 - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + x1 + ' ' + (y0 + r) + 'V' + (y1 - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x1 - r) + ' ' + y1 + 'H' + (x0 + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + x0 + ' ' + (y1 - r) + 'V' + (y0 + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x0 + r) + ' ' + y0 + 'Z';
  }
  const TAIL_HALF = 12;
  const TAIL_ROOT = 5;
  const BALLOON_SWAY = 1;
  function tail(side, w, h, at, lean, reach) {
    const frames = { bottom: [[at * w, h], [1, 0], [0, 1]], top: [[at * w, 0], [1, 0], [0, -1]], left: [[0, at * h], [0, 1], [-1, 0]], right: [[w, at * h], [0, 1], [1, 0]] };
    const [from, along, out] = frames[side] || frames.bottom;
    const p = (a, o) => fix(from[0] + along[0] * a + out[0] * o) + ' ' + fix(from[1] + along[1] * a + out[1] * o);
    return 'M' + p(-TAIL_HALF, -TAIL_ROOT) + 'C' + p(-TAIL_HALF + 3, reach * 0.4) + ' ' + p(lean - (lean + TAIL_HALF) * 0.16, reach * 0.74) + ' ' + p(lean, reach) +
      'C' + p(lean + (TAIL_HALF - lean) * 0.5, reach * 0.84) + ' ' + p(TAIL_HALF - 2, reach * 0.44) + ' ' + p(TAIL_HALF, -TAIL_ROOT);
  }
  function drawBalloon(el) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return;
    const style = getComputedStyle(el);
    const read = (name, fallback) => {
      const value = parseFloat(style.getPropertyValue(name));
      return Number.isNaN(value) ? fallback : value;
    };
    const side = style.getPropertyValue('--tail-side').trim() || 'bottom';
    const radius = Math.min(read('--round', 22), h / 2 - 2, w / 2 - 2);
    const across = side === 'left' || side === 'right' ? h : w;
    const at = within(read('--tail-at', 24) / 100, (radius + TAIL_HALF) / across, 1 - (radius + TAIL_HALF) / across);
    const [body, horn] = el.shape.children;
    el.shape.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    body.setAttribute('d', M.handCut(roundRect(w, h, radius, 1.5), BALLOON_SWAY));
    horn.setAttribute('d', side === 'none' ? '' : tail(side, w, h, at, read('--tail-lean', -10), read('--tail-reach', 26)));
    el.classList.add('is-drawn');
  }
  function balloons() {
    const watcher = new ResizeObserver((entries) => entries.forEach((entry) => drawBalloon(entry.target)));
    $$('.say').forEach((el) => {
      const shape = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      shape.setAttribute('class', 'say__shape');
      shape.setAttribute('aria-hidden', 'true');
      shape.innerHTML = '<path/><path/>';
      el.prepend(shape);
      el.shape = shape;
      watcher.observe(el);
    });
    M.settle(() => $$('.say').forEach(drawBalloon));
  }

  const WORD_MS = 82;
  function splitWords(el) {
    const text = el.textContent.trim();
    const words = text.split(' ');
    el.innerHTML = '<span class="sr">' + text + '</span><span aria-hidden="true">' + words.map((word, i) => '<span class="w" style="--i:' + i + '">' + word + '</span>').join(' ') + '</span>';
    return words.length;
  }
  const spoken = (count) => count * WORD_MS + 420;
  const press = (fig, on) => fig.classList.toggle('is-talking', on);

  function flows() {
    $$('.fig--flow, .fig--quotes').forEach((fig) => {
      const first = $('.flow > .say:not([data-late]), .ask .say', fig);
      const mic = $('[data-talk]', fig);
      const words = first && $('[data-words]', first);
      const count = words ? splitWords(words) : 0;
      const host = $('.unit svg', fig);
      const late = $$('[data-late]', fig);
      const arrows = $$('.arrow', fig);
      const steady = fig.hasAttribute('data-hint') || fig.dataset.fig === 'last';
      const asks = Boolean(mic && first && first.classList.contains('say--you'));
      [first, ...late].filter(Boolean).forEach((el) => el.setAttribute('data-pop', ''));
      fig.play = async () => {
        if (first) {
          if (asks) press(fig, true);
          first.classList.add('on', 'is-said');
          await wait(spoken(count) * 0.72);
          press(fig, false);
        }
        if (arrows[0]) arrows[0].classList.add('on');
        if (first) await wait(480);
        if ($('.kp[data-k="busy"]', host)) showKeeper(host, 'busy');
        if (first) await wait(steady ? 300 : 980);
        if (!fig.hasAttribute('data-form-host')) freshTag(host, true);
        if (arrows[1]) arrows[1].classList.add('on');
        late.forEach((el, i) => setTimeout(() => el.classList.add('on'), still.matches ? 0 : i * (first ? 190 : 420)));
        if (!steady && $('.kp[data-k="glad"]', host)) showKeeper(host, 'glad');
      };
      const reset = () => {
        if (first) first.classList.remove('on', 'is-said');
        late.forEach((el) => el.classList.remove('on'));
        arrows.forEach((arrow) => arrow.classList.remove('on'));
        freshTag(host, false);
        const opening = $('.kp', host);
        if (opening) showKeeper(host, opening.dataset.k);
        if (fig.clear) fig.clear();
      };
      let played = false;
      let replaying = false;
      const once = () => {
        if (played) return;
        played = true;
        fig.play();
      };
      const again = async () => {
        if (replaying) return;
        replaying = true;
        played = true;
        reset();
        await wait(360);
        await fig.play();
        replaying = false;
      };
      if (mic) mic.addEventListener('click', () => (fig.ask || again)());
      fig.addEventListener('focusin', once);
      new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        once();
      }, { threshold: 0.6, rootMargin: '0px 0px -10% 0px' }).observe(first || late[0]);
    });
  }

  const HERO_TURNS = 3;
  const HERO_REST_MS = 6400;
  const EXCHANGES = [
    ['“Where did I put my keys?”', 'You usually leave them on the small table by the entrance. Last time, they were in your coat pocket.', 'key'],
    ['“Who is Marie?”', 'Marie is your daughter. She lives in Lyon and calls you every Sunday. Her birthday is March 15th.', 'face']
  ];
  function cover() {
    const fig = $('[data-fig="cover"]');
    if (!fig) return;
    const you = $('.say--you', fig);
    const memoris = $('.say--memoris', fig);
    const youWords = $('[data-words]', you);
    const memorisWords = $('[data-words]', memoris);
    const host = $('.unit svg', fig);
    [you, memoris].forEach((el) => el.setAttribute('data-pop', ''));
    let turn = -1;
    let running = false;
    let played = 0;
    let visible = false;
    let next = 0;
    async function exchange(asked) {
      if (running || (!visible && asked !== true)) return;
      running = true;
      clearTimeout(next);
      turn = (turn + 1) % EXCHANGES.length;
      const [question, answer, tag] = EXCHANGES[turn];
      you.classList.remove('on', 'is-said');
      memoris.classList.remove('on', 'is-said');
      showKeeper(host, 'open');
      await wait(played ? 420 : 0);
      youWords.textContent = question;
      memorisWords.textContent = answer;
      const questionCount = splitWords(youWords);
      const answerCount = splitWords(memorisWords);
      await wait(60);
      press(fig, true);
      you.classList.add('on', 'is-said');
      await wait(spoken(questionCount) + 480);
      press(fig, false);
      showKeeper(host, tag);
      memoris.classList.add('on', 'is-said');
      await wait(spoken(answerCount) + 1300);
      showKeeper(host, 'glad');
      played += 1;
      running = false;
      if (played < HERO_TURNS && !still.matches) next = setTimeout(exchange, HERO_REST_MS);
    }
    $('[data-talk]', fig).addEventListener('click', () => exchange(true));
    new IntersectionObserver((entries) => {
      const now = entries[entries.length - 1].isIntersecting;
      if (now && !visible && played < HERO_TURNS) next = setTimeout(exchange, played ? 1200 : 900);
      visible = now;
    }, { threshold: 0.5 }).observe(you);
  }

  function hints() {
    $$('[data-hint]').forEach((fig) => {
      const letters = $$('[data-letter]', fig);
      const one = $('[data-hint-one]', fig);
      const all = $('[data-hint-all]', fig);
      const status = $('[data-hint-status]', fig);
      const host = $('.unit svg', fig);
      const shown = () => letters.filter((letter) => letter.classList.contains('on')).length;
      const refresh = () => {
        const count = shown();
        const done = count === letters.length;
        showKeeper(host, done ? 'glad' : count ? 'busy' : 'open');
        fig.dataset.found = done ? '1' : '';
        status.textContent = count ? NAME.slice(0, count).join('') + (done ? '.' : '…') : '';
      };
      const clear = () => letters.forEach((letter) => letter.classList.remove('on'));
      fig.clear = () => {
        clear();
        refresh();
      };
      one.addEventListener('click', () => {
        if (shown() === letters.length) clear();
        letters[shown()].classList.add('on');
        refresh();
      });
      all.addEventListener('click', () => {
        letters.forEach((letter, i) => setTimeout(() => {
          letter.classList.add('on');
          refresh();
        }, still.matches ? 0 : i * 130));
      });
    });
  }

  function agains() {
    $$('[data-again]').forEach((again) => {
      const fig = again.closest('.fig');
      const you = $('.ask .say', fig);
      const memoris = $('.flow > .say--memoris', fig);
      const host = $('.unit svg', fig);
      const marks = $$('.tally path', again);
      const status = $('[data-again-status]', again);
      let count = 1;
      let busy = false;
      marks[0].classList.add('on');
      fig.ask = () => $('[data-again-ask]', again).click();
      $('[data-again-ask]', again).addEventListener('click', async () => {
        if (busy) return;
        busy = true;
        count = count >= marks.length ? 1 : count + 1;
        marks.forEach((mark, i) => {
          mark.classList.toggle('on', i < count);
          mark.classList.toggle('now', i === count - 1);
        });
        status.textContent = count + ' of ' + marks.length + '. ' + $('.told', memoris).textContent.trim();
        you.classList.remove('is-said');
        memoris.classList.remove('on');
        showKeeper(host, 'busy');
        press(fig, true);
        await wait(140);
        you.classList.add('is-said');
        await wait(700);
        press(fig, false);
        memoris.classList.add('on');
        showKeeper(host, 'glad');
        await wait(260);
        busy = false;
      });
    });
  }

  const DAY_START = 480;
  function clocks() {
    const moments = $$('[data-moment]').map((leaf, i, all) => ({
      leaf, clock: $('.clock', leaf), to: Number(leaf.dataset.minutes), from: i ? Number(all[i - 1].dataset.minutes) : DAY_START, top: 0, shown: -1
    }));
    const set = (moment, t) => {
      const minutes = moment.from + (moment.to - moment.from) * smooth(t);
      moment.shown = t;
      moment.clock.style.setProperty('--hr', fix((minutes / 720) * 360) + 'deg');
      moment.clock.style.setProperty('--mn', fix((minutes / 60) * 360) + 'deg');
    };
    moments.forEach((moment) => {
      moment.clock.innerHTML = CLOCK;
      set(moment, 1);
    });
    M.settle(() => {
      moments.forEach((moment) => {
        moment.top = topOf(moment.clock.closest('.page'));
        if (still.matches) set(moment, 1);
      });
    });
    M.follow(({ y, height, ease }) => {
      let moving = false;
      moments.forEach((moment) => {
        const goal = within((y + height * 0.86 - moment.top) / (height * 0.5));
        if (Math.abs(goal - moment.shown) < 0.002) return;
        set(moment, moment.shown < 0 ? goal : moment.shown + (goal - moment.shown) * ease);
        moving = true;
      });
      return moving;
    });
  }
  function topOf(el) {
    let top = 0;
    for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
    return top;
  }

  const UNFOLD_SPAN = 0.58;
  function unfolding() {
    if (window.CSS && CSS.supports && CSS.supports('animation-timeline:view()')) {
      root.classList.add('has-timeline');
      return;
    }
    if (still.matches) return;
    const leaves = $$('.leaf:not(.leaf--cover)').map((el) => ({ el, top: 0, tall: 0, shown: 1 }));
    root.classList.add('has-follow');
    M.settle(() => leaves.forEach((leaf) => {
      leaf.top = topOf(leaf.el);
      leaf.tall = leaf.el.offsetHeight;
    }));
    M.follow(({ y, height, ease }) => {
      let moving = false;
      leaves.forEach((leaf) => {
        const goal = within((y + height - leaf.top) / (Math.min(leaf.tall, height) * UNFOLD_SPAN));
        if (Math.abs(goal - leaf.shown) < 0.0006) return;
        leaf.shown = Math.abs(goal - leaf.shown) < 0.004 ? goal : leaf.shown + (goal - leaf.shown) * ease;
        leaf.el.style.setProperty('--unfold', leaf.shown.toFixed(4));
        moving = true;
      });
      return moving;
    });
  }

  const REDRAW_AT = 0.12;
  function redraws() {
    const scenes = $$('.unit svg[data-scene]').map((el) => ({ el, unit: el.unit || 1 }));
    let waiting = 0;
    window.addEventListener('resize', () => {
      clearTimeout(waiting);
      waiting = setTimeout(() => {
        scenes.forEach((scene) => {
          const across = scene.el.viewBox.baseVal.width;
          const unit = scene.el.getBoundingClientRect().width / across;
          if (!unit || Math.abs(unit - scene.unit) / scene.unit < REDRAW_AT) return;
          const shown = scene.el.dataset.shown;
          const hung = scene.el.dataset.hung;
          scene.unit = unit;
          M.remount(scene.el);
          if (shown) showKeeper(scene.el, shown);
          if (hung) freshTag(scene.el, true);
        });
      }, 220);
    });
  }

  function chrome() {
    $$('.top a[href], .menu a[href], .foot a[href], a.pin[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (/^(#|[a-z]+:|\.\.\/|index\.html)/.test(href)) return;
      link.setAttribute('href', SITE + href);
    });
  }

  function replies() {
    $$('[data-form-host]').forEach((fig) => {
      const host = $('.unit svg', fig);
      new MutationObserver(() => {
        const state = fig.dataset.state || 'idle';
        showKeeper(host, state);
        freshTag(host, state === 'sent');
      }).observe(fig, { attributes: true, attributeFilter: ['data-state'] });
    });
  }

  M.ready(() => {
    chrome();
    $$('.arrow').forEach((arrow) => {
      arrow.innerHTML = ARROW;
    });
    $$('.unit svg[data-scene]').forEach((host) => {
      const first = $('.kp', host);
      if (first) showKeeper(host, first.dataset.k);
    });
    balloons();
    flows();
    cover();
    hints();
    agains();
    replies();
    clocks();
    unfolding();
    redraws();
  });
})();
