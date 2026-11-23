(() => {
  const M = window.Memoris;
  const { fix } = M.util;
  const { keeper, seat, hung, strand, threadPoint, sway, handCut, drawnPath, miniTag, scallops } = M;
  const still = M.still;
  const INK = M.ink;
  const CARD = M.card;
  const PAPER = M.paper;
  const PALE = '#F6DD9C';
  const AMBER = '#E8AE2F';
  const AMBER_DEEP = '#CC921B';
  const CORAL = '#E2603A';
  const CORAL_DEEP = '#C64A29';
  const NIGHT = '#143F45';
  const NIGHT_DEEP = '#0C2F34';
  const TEAL_DEEP = '#166A68';
  const SAND = '#E8DBC0';
  const TISSUE = '#F3C9B8';
  const WALL = '#E7A794';
  const GLASS_ASLEEP = '#B9CFC4';
  const LINE = 3.2;
  const narrow = window.matchMedia('(max-width: 760px)');
  const stacked = window.matchMedia('(max-width: 860px), (max-aspect-ratio: 11/10)');

  const pen = (width, color) => 'fill="none" stroke="' + (color || INK) + '" stroke-width="' + (width || LINE) + '" stroke-linecap="round" stroke-linejoin="round"';
  const ink = (d, fill, width) => '<path d="' + d + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="' + (width || LINE) + '" stroke-linejoin="round" stroke-linecap="round"/>';
  const stroke = (d, width, color) => '<path d="' + d + '" ' + pen(width, color) + '/>';
  const fine = (d, width) => '<path data-fine d="' + d + '" ' + pen(width || 2.4) + '/>';
  const flat = (d, fill, waver) => '<path d="' + handCut(d, waver || 1.4) + '" fill="' + fill + '"/>';
  const place = (x, y, scale, inner) => '<g transform="translate(' + fix(x) + ' ' + fix(y) + ') scale(' + scale + ')">' + inner + '</g>';
  const at = (spot, inner) => place(spot[0], spot[1], spot[2], inner);

  const PHONE = { w: 300, h: 620, r: 54 };
  const glass = 'x="13" y="13" width="274" height="594" rx="42"';
  let screens = 0;
  function phone(room, tint) {
    const id = 'pk-glass-' + (screens += 1);
    return '<g class="boil" fill="' + INK + '">' +
      '<rect x="-5" y="146" width="10" height="34" rx="4"/><rect x="-5" y="200" width="10" height="60" rx="4"/><rect x="-5" y="272" width="10" height="60" rx="4"/><rect x="' + (PHONE.w - 5) + '" y="226" width="10" height="94" rx="4"/>' +
      '<rect x="0" y="0" width="' + PHONE.w + '" height="' + PHONE.h + '" rx="' + PHONE.r + '"/></g>' +
      '<rect ' + glass + ' fill="' + (tint || CARD) + '"/>' +
      '<clipPath id="' + id + '"><rect ' + glass + '/></clipPath>' +
      '<g clip-path="url(#' + id + ')">' + room + '</g>' +
      '<rect x="108" y="29" width="84" height="25" rx="12.5" fill="' + INK + '"/>' +
      '<rect x="103" y="588" width="94" height="6" rx="3" fill="' + INK + '" opacity=".78"/>';
  }

  const PALM = 'M-32 470C-36 562 0 650 48 712C64 734 78 760 80 792L74 1280L296 1280L298 806C300 774 318 748 342 720C374 684 398 652 398 608C398 562 384 520 366 486L300 452L300 560L150 606Z';
  const THUMB = 'M366 486C346 456 324 434 302 426C280 418 256 432 254 456C253 470 259 484 268 496C280 512 290 530 296 550';
  const CUFF = 'M52 754L348 722L354 1280L44 1280Z';
  const FINGERS = [[330, 60, 50], [397, 64, 58], [465, 62, 54], [529, 52, 42]];
  const KNUCKLES = -34;
  function fingers() {
    let d = 'M' + KNUCKLES + ' ' + (FINGERS[0][0] - FINGERS[0][1] / 2);
    let between = '';
    FINGERS.forEach(([y, tall, reach], i) => {
      const r = tall / 2;
      const next = FINGERS[i + 1];
      d += 'L' + (reach - r) + ' ' + (y - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (reach - r) + ' ' + (y + r);
      if (next) between += 'M' + (KNUCKLES + 2) + ' ' + ((y + r + next[0] - next[1] / 2) / 2) + 'H' + (Math.min(reach, next[2]) - r);
    });
    for (let i = FINGERS.length - 1; i >= 0; i--) {
      const r = FINGERS[i][1] / 2;
      d += 'L' + KNUCKLES + ' ' + (FINGERS[i][0] + r) + 'A' + fix(r * 0.32) + ' ' + r + ' 0 0 1 ' + KNUCKLES + ' ' + (FINGERS[i][0] - r);
    }
    return ink(d + 'Z', SAND) + stroke(between, 2.8);
  }
  function held(room) {
    return '<g class="boil">' + ink(PALM, SAND) + fine('M318 632C338 644 354 664 362 690') +
      ink(CUFF, NIGHT) + stroke('M52 792L350 760', 5, NIGHT_DEEP) + '</g>' +
      phone(room) +
      '<g class="boil">' + fingers() + '<path d="' + THUMB + 'L372 566Z" fill="' + SAND + '"/>' + stroke(THUMB) +
      '<g transform="translate(279 452) rotate(-38)"><rect x="-12" y="-19" width="24" height="29" rx="10" fill="' + CARD + '" stroke="' + INK + '" stroke-width="2"/></g>' +
      fine('M301 494q12 -5 21 5') + '</g>';
  }

  const FACE = 'M148 20C212 16 262 56 272 112C275 130 276 148 277 162C283 178 292 192 295 204C297 214 291 220 283 220C280 226 283 232 283 238C283 244 278 246 277 250C280 254 283 260 280 266C277 272 274 275 274 283C276 298 268 313 252 320C238 326 224 326 212 330C206 340 206 372 210 430L108 430C110 384 110 352 102 326C52 300 22 244 24 176C26 84 84 24 148 20Z';
  const SHOULDERS = 'M100 384C130 414 190 412 214 382C270 396 322 430 338 490L362 800L-44 800L-22 490C-6 432 44 398 100 384Z';
  const RIB = 'M90 396C126 432 196 430 224 392';
  const SHORT = 'M274 118C266 40 206 0 146 4C70 6 6 76 8 180C8 252 44 310 102 336C104 312 110 288 124 270C120 242 134 216 156 208C170 212 180 226 184 250C190 224 194 200 198 180C226 174 256 154 274 118Z';
  const BOB = 'M274 118C266 40 206 0 146 4C70 6 6 76 8 180C8 262 30 332 58 384C90 396 130 396 160 384C142 350 152 306 172 272C188 244 194 202 198 180C226 174 256 154 274 118Z';
  const STRANDS = 'M58 150C40 220 50 300 78 360M112 122C84 200 92 290 122 352';
  const EAR = 'M178 226C160 210 134 226 138 254C141 276 160 286 176 272';
  const EAR_FOLD = 'M170 240C158 238 152 252 160 264';
  const BROW = 'M236 163q13 -8 27 -2';
  const SMILE = 'M278 250C271 257 261 258 253 252';
  const MOUTH_OPEN = 'M281 246C272 244 263 248 257 254C264 261 275 262 280 257Z';
  const NOSE = 296;
  const MOUTH = [283, 250];
  const YOU = { hair: SHORT, tint: INK, top: NIGHT, rib: NIGHT_DEEP, ear: true };
  const CLOSE = { hair: BOB, tint: PALE, top: CARD, rib: SAND, ear: false };

  const SPOT = { cx: 100, cy: 104, rx: 108, ry: 92 };
  const BUMPS = [26, 30, 24, 28, 22, 30, 26, 24, 32, 26, 22, 28, 24, 18];
  const FOLDS = 'M-78 -30c8 -11 20 -9 24 2M44 -58c12 2 18 12 13 23M-66 40c8 -9 20 -9 26 0';
  const MIND_THREAD = [-136, 12, 0, 41, 136, 4];
  const MIND_SEAT = threadPoint(MIND_THREAD, 0.42);
  const MIND_SLOT = threadPoint(MIND_THREAD, 0.72);
  const MIND_SIZE = 0.64;
  let windows = 0;
  function mind(inside) {
    const id = 'pk-window-' + (windows += 1);
    const d = scallops(SPOT.cx, SPOT.cy, SPOT.rx, SPOT.ry, BUMPS, 0.9);
    const centred = 'translate(' + SPOT.cx + ' ' + SPOT.cy + ')';
    return '<path d="' + d + '" fill="' + PAPER + '" stroke="' + PAPER + '" stroke-width="13" stroke-linejoin="round"/><path d="' + d + '" fill="' + TISSUE + '"/>' +
      '<clipPath id="' + id + '"><path d="' + d + '"/></clipPath>' +
      '<g clip-path="url(#' + id + ')"><path d="' + d + '" fill="none" stroke="' + WALL + '" stroke-width="16" stroke-linejoin="round"/>' +
      '<g transform="' + centred + '">' + stroke(FOLDS, 8, WALL) + inside.behind + '</g></g>' +
      '<g transform="' + centred + '">' + inside.front + '</g>';
  }
  function person(look, o) {
    const [x, y, s] = o.at;
    const mouth = o.speaking ? ink(MOUTH_OPEN, INK, 2) : stroke(SMILE, 3.2);
    return '<g transform="translate(' + fix(o.flip ? x + NOSE * s : x) + ' ' + fix(y) + ') scale(' + (o.flip ? -s : s) + ' ' + s + ')">' +
      '<g class="boil">' + ink(FACE, SAND) + ink(SHOULDERS, look.top) + stroke(RIB, 3.4, look.rib) + ink(look.hair, look.tint) +
      (look.ear ? ink(EAR, SAND) + fine(EAR_FOLD) : fine(STRANDS)) +
      '<circle data-still cx="226" cy="240" r="17" fill="' + WALL + '" opacity=".55"/>' + stroke(BROW, 3.6) + mouth +
      '<g transform="translate(250 188)"><g class="k-eye"><ellipse data-still cx="0" cy="-4" rx="5.4" ry="7.8" fill="' + INK + '"/></g></g></g>' +
      (o.inside ? mind(o.inside) : '') + '</g>';
  }
  const mouthAt = (spot) => [spot[0] + MOUTH[0] * spot[2], spot[1] + MOUTH[1] * spot[2]];
  const voice = (x, y, gap) => '<g class="boil cycle" data-loop="30" data-every="4">' +
    [13, 24, 36].map((half, i) => stroke('M' + (x + 18 + i * gap) + ' ' + (y - half) + 'q' + (9 + i * 8) + ' ' + half + ' 0 ' + half * 2, 4)).join('') + '</g>';

  const mine = (options) => keeper(Object.assign({ color: 'coral', prop: 'visor', ink: 3.6 }, options));
  const theirs = (options) => keeper(Object.assign({ color: 'teal', prop: 'satchel', ink: 3 }, options));
  const settled = (k, motion) => seat(k, MIND_SEAT[0], MIND_SEAT[1], MIND_SIZE, { flip: true, motion });

  const label = (text, x, y, anchor, within) => '<text class="pk-label" x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + (within ? ' style="font-size:calc(var(--pk-label,17px) / ' + within + ')"' : '') + '>' + text + '</text>';
  const leader = (d) => '<path d="' + drawnPath(d) + '" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
  const dot = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="4.6" fill="' + INK + '"/>';
  const named = (g) => label('Your memory', g.tag[0], g.tag[1]) + leader(g.lead) + dot(g.spot[0], g.spot[1]);

  const SCREEN_THREAD = [-20, 306, 150, 360, 320, 298];

  M.scenes.palm = () => {
    const thread = [-24, 312, 150, 372, 324, 300];
    const memoris = theirs({ mood: 'open', arm: 'wave', head: -2, ink: 2.5 });
    const [mx, my] = threadPoint(thread, 0.61);
    const room = '<g class="boil">' + strand(thread, { width: 3 }) +
      hung(thread, 0.3, { length: 16, w: 40, h: 50, mark: 'key', sway: 5 }) +
      hung(thread, 0.425, { length: 50, w: 38, h: 46, fill: PALE, mark: 'face', sway: 4 }) +
      seat(memoris, mx, my, 1.22, { motion: sway(0.2, 1.8) }) + '</g>' +
      label('Memoris', 150, 104, 'middle');
    return { box: '0 0 560 800', svg: place(84, 40, 1, held(room)) +
      '<g class="pk-lead">' + leader('M428 82C414 86 402 92 393 102') + dot(390, 105) + '</g>' + label('Your iPhone', 438, 78) };
  };

  const slab = (y, from) => '<path d="' + handCut('M' + from + ' ' + (y + 16) + 'L3000 ' + (y + 16) + 'L3000 ' + (y + 60) + 'L' + from + ' ' + (y + 60) + 'Z', 1.2) + '" fill="' + AMBER + '"/>' +
    '<path d="' + handCut('M' + (from - 14) + ' ' + y + 'L3000 ' + y + 'L3000 ' + (y + 22) + 'L' + (from - 14) + ' ' + (y + 22) + 'Z', 1.2) + '" fill="' + PALE + '"/>';
  const cup = (steam) => flat('M68 16C92 12 100 30 94 44C88 58 74 60 62 56L64 46C74 48 82 44 84 36C86 28 78 24 68 26Z', CARD, 0.8) +
    flat('M0 0L76 0L76 44C76 64 60 74 38 74C16 74 0 64 0 44Z', CARD, 0.9) + stroke('M8 10V40', 5, SAND) +
    (steam ? '<g class="boil"><path class="k-steam" data-still d="M24 -14q-9 -12 0 -22q9 -10 0 -22M48 -14q-9 -12 0 -22" fill="none" stroke="' + INK + '" stroke-width="2.8" stroke-linecap="round" opacity=".5"/></g>' : '');
  const book = () => flat('M2 20L150 20L150 56L2 56Z', CARD, 0.7) + stroke('M14 31H136M14 39H136M14 47H110', 2, SAND) +
    flat('M-6 6L156 6L156 22L-6 22Z', CORAL, 0.9) + flat('M-6 52L156 52L156 62L-6 62Z', CORAL, 0.9) + flat('M-6 6L6 6L6 62L-6 62Z', CORAL_DEEP, 0.6) +
    flat('M118 6L138 6L138 42L128 34L118 42Z', PALE, 0.6);

  const WIDE_NAME = { tag: [-8, 20], lead: 'M112 30C116 40 120 50 124 60', spot: [126, 67] };
  const SMALL_NAME = { tag: [4, 150], lead: 'M84 160C85 170 87 182 88 192', spot: [88, 200] };
  const TABLE_WIDE = Object.assign({ box: '0 0 800 560', floor: 506, you: [12, 40, 1], phone: [566, 0.73], cup: [772, 432, 1], book: [392, 444, 1], from: -30, gap: 21 }, WIDE_NAME);
  const TABLE_SMALL = Object.assign({ box: '0 0 560 640', floor: 590, you: [-10, 176, 0.86], phone: [330, 0.74], cup: [524, 516, 1], book: [118, 547, 0.7], from: -300, gap: 15 }, SMALL_NAME);

  M.scenes.table = () => {
    const g = narrow.matches ? TABLE_SMALL : TABLE_WIDE;
    const memoris = theirs({ pose: 'tie', hold: { mark: 'calendar', length: 22, w: 42, h: 50, fill: PALE } });
    const resting = mine({ pose: 'rest', arm: 'hold', hold: 'cup' });
    const [mx, my] = threadPoint(SCREEN_THREAD, 0.5);
    const room = '<g class="boil">' + strand(SCREEN_THREAD, { width: 3 }) +
      hung(SCREEN_THREAD, 0.88, { length: 20, w: 36, h: 44, mark: 'key', sway: 4 }) +
      seat(memoris, mx + 26, my, 1.16) + '</g>' + label('Memoris', 150, 108, 'middle', g.phone[1]);
    const inside = {
      behind: '<g class="boil">' + strand(MIND_THREAD, { width: 3 }) + hung(MIND_THREAD, 0.72, { length: 10, w: 30, h: 36, fill: PALE, mark: 'face', sway: 3 }) + '</g>',
      front: '<g class="boil">' + settled(resting, sway(0.5, 1.4)) + '</g>'
    };
    const [vx, vy] = mouthAt(g.you);
    const stand = g.floor - PHONE.h * g.phone[1] + 3;
    return { box: g.box, svg: person(YOU, { at: g.you, speaking: true, inside }) + voice(vx, vy, g.gap) +
      at(g.cup, cup(true)) +
      place(g.phone[0], stand, g.phone[1], '<g transform="rotate(4 150 620)">' + phone(room) + '</g>') +
      slab(g.floor, g.from) + at(g.book, book()) + named(g) };
  };

  const COAT = 'M134 46C150 30 190 30 206 46L290 86C316 98 326 122 327 152L338 322C339 334 332 341 321 341L293 341L291 378C291 388 285 394 275 394L65 394C55 394 49 388 49 378L47 341L19 341C8 341 1 334 2 322L13 152C14 122 24 98 50 86Z';
  function keys() {
    return '<g class="boil"><circle cx="0" cy="0" r="25" fill="none" stroke="' + PAPER + '" stroke-width="5"/>' +
      '<g transform="rotate(14)">' + ink('M-17 22a17 17 0 1 1 34 0a17 17 0 1 1 -34 0M-6 39h12v70h-12z', AMBER) + '<circle cx="0" cy="22" r="5.5" fill="' + INK + '"/></g>' +
      '<g transform="rotate(-24)">' + ink('M-15 24a15 15 0 1 1 30 0a15 15 0 1 1 -30 0M-5 39h10v60h-10z', CARD) + '<circle cx="0" cy="24" r="5" fill="' + INK + '"/></g>' +
      '<g transform="translate(-22 -12) rotate(52)"><g class="swing" data-a="5" data-s=".3">' + miniTag({ length: 20, w: 34, h: 42, fill: PALE, mark: 'key' }) + '</g></g></g>';
  }
  const glint = () => '<g class="boil cycle" data-loop="30" data-every="3">' + stroke('M0 -44v-19', 3.8, PALE) + stroke('M27 -35l12 -15', 3.8, PALE) + stroke('M-27 -35l-12 -15', 3.8, PALE) + '</g>';
  const stitched = (d) => '<path d="' + d + '" fill="none" stroke="' + PAPER + '" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="10 8"/>';
  function coat() {
    return '<circle cx="170" cy="14" r="11" fill="' + AMBER_DEEP + '"/>' + stroke('M158 44C158 20 182 20 182 44', 6, NIGHT_DEEP) +
      flat(COAT, NIGHT, 1.6) +
      flat('M134 46L170 196L126 160L104 98Z', TEAL_DEEP, 1) + flat('M206 46L170 196L214 160L236 98Z', TEAL_DEEP, 1) +
      flat('M146 52C160 44 180 44 194 52L170 176Z', NIGHT_DEEP, 0.8) +
      stroke('M170 196V392', 4, NIGHT_DEEP) + stroke('M64 168L49 340M276 168L291 340', 4, NIGHT_DEEP) +
      [236, 300, 364].map((y) => '<circle cx="158" cy="' + y + '" r="6.5" fill="' + PAPER + '"/>').join('') +
      place(232, 262, 0.6, keys()) +
      '<path d="' + handCut('M184 284H280V352Q280 380 252 380H212Q184 380 184 352Z', 0.9) + '" fill="' + NIGHT + '"/>' +
      stitched('M192 293H272V351Q272 372 251 372H213Q192 372 192 351Z') + stroke('M180 284H284', 3.2, PAPER) +
      place(232, 262, 0.6, glint());
  }

  const DOOR_WIDE = { box: '0 0 800 560', coat: [-30, 4, 1.34], phone: [562, 44, 0.74] };
  const DOOR_SMALL = { box: '0 0 560 640', coat: [-150, 92, 1.34], phone: [316, 96, 0.8] };

  M.scenes.entrance = () => {
    const g = narrow.matches ? DOOR_SMALL : DOOR_WIDE;
    const memoris = theirs({ pose: 'offer', hold: { mark: 'key', length: 12, w: 42, h: 50, fill: PALE } });
    const [mx, my] = threadPoint(SCREEN_THREAD, 0.6);
    const room = '<g class="boil">' + strand(SCREEN_THREAD, { width: 3 }) + seat(memoris, mx, my, 1.04, { motion: sway(0.3, 1.6) }) + '</g>';
    return { box: g.box, svg: at(g.coat, coat()) + '<g class="pk-rise">' + at(g.phone, held(room)) + '</g>' };
  };

  const HINT_WIDE = Object.assign({ box: '0 0 800 560', you: [12, 40, 1], phone: [556, 44, 0.74] }, WIDE_NAME);
  const HINT_SMALL = Object.assign({ box: '0 0 560 640', you: [-10, 176, 0.86], phone: [318, 96, 0.79] }, SMALL_NAME);
  const step = (name, inner) => '<g data-pk-step="' + name + '">' + inner + '</g>';
  const HEART = 'c-3 -5 -10 -1 -6 4l6 6l6 -6c4 -5 -3 -9 -6 -4z';

  M.scenes.hint = () => {
    const g = narrow.matches ? HINT_SMALL : HINT_WIDE;
    const [mx, my] = threadPoint(SCREEN_THREAD, 0.6);
    const posed = (k) => seat(k, mx, my, 1.04, { motion: sway(0.3, 1.8) });
    const room = '<g class="boil">' + strand(SCREEN_THREAD, { width: 3 }) +
      step('ask', posed(theirs({ mood: 'open', head: 2 }))) +
      step('hint idea', posed(theirs({ mood: 'open', arm: 'give', hold: { mark: 'none', length: 10, w: 36, h: 42, fill: PALE }, head: 2 }))) +
      step('found told', posed(theirs({ mood: 'glad', head: 4 }))) + '</g>' + label('Memoris', 150, 108, 'middle', g.phone[2]);
    const sat = (k) => settled(k, sway(0.5, 1.6));
    const aside = (inner) => '<g transform="translate(' + fix(MIND_SEAT[0] + 118 * MIND_SIZE) + ' ' + fix(MIND_SEAT[1] - 150 * MIND_SIZE) + ') scale(0.8)"><g class="cycle" data-loop="34" data-every="3">' + inner + '</g></g>';
    const wonder = aside(stroke('M-9 -8q0 -11 10 -11q10 0 10 9q0 6 -9 10v5', 3.8) + '<circle cx="2" cy="15" r="3" fill="' + INK + '"/>');
    const joy = aside(ink('M-6 12' + HEART, CORAL, 2.4) + '<g transform="translate(14 -14) scale(1.35)">' + ink('M0 0' + HEART, CORAL, 1.8) + '</g>');
    const inside = {
      behind: '<g class="boil">' + strand(MIND_THREAD, { width: 3 }) +
        '<g transform="translate(' + fix(MIND_SLOT[0]) + ' ' + fix(MIND_SLOT[1]) + ')">' + step('ask hint idea', miniTag({ length: 10, w: 30, h: 36, gone: true })) +
        step('found told', '<g class="swing" data-a="4" data-s=".3">' + miniTag({ length: 10, w: 30, h: 36, fill: PALE, mark: 'face' }) + '</g>') + '</g></g>',
      front: '<g class="boil">' + step('ask hint', sat(mine({ mood: 'thinking', arm: 'chin', head: 6 })) + wonder) +
        step('idea', sat(mine({ mood: 'open', marks: 'idea', head: 8 }))) +
        step('found', sat(mine({ mood: 'proud', arm: 'wave', head: 8 })) + joy) +
        step('told', sat(mine({ mood: 'glad', head: 4 }))) + '</g>'
    };
    return { box: g.box, svg: person(YOU, { at: g.you, inside }) +
      '<g class="pk-rise">' + at(g.phone, held(room)) + '</g>' + named(g) };
  };

  const AFAR_WIDE = { box: '0 0 800 600', close: [16, 150, 0.82], phone: [556, 56, 0.76], sag: 84 };
  const AFAR_SMALL = { box: '0 0 560 600', close: [-4, 296, 0.52], phone: [316, 64, 0.76], sag: 58 };

  M.scenes.afar = () => {
    const g = narrow.matches ? AFAR_SMALL : AFAR_WIDE;
    const [vx, vy] = mouthAt(g.close);
    const scale = g.phone[2];
    const inner = [-20, 258, 120, 312, 320, 270];
    const edge = [g.phone[0] + 13 * scale, g.phone[1] + threadPoint(inner, 0.1)[1] * scale];
    const line = [vx + 18, vy - 4, (vx + edge[0]) / 2, Math.max(vy, edge[1]) + g.sag, edge[0], edge[1]].map((n) => Math.round(n));
    const memoris = theirs({ pose: 'reach', mood: 'glad', head: 20 });
    const [mx, my] = threadPoint(inner, 0.7);
    const room = '<g class="boil">' + strand(inner, { width: 3 }) +
      hung(inner, 0.42, { length: 18, w: 40, h: 48, mark: 'lines', planned: true, sway: 3 }) +
      seat(memoris, mx, my, 1.04, { motion: sway(0.3, 1.6) }) + '</g>';
    return { box: g.box, svg: person(CLOSE, { at: g.close, speaking: true }) +
      at(g.phone, held(room)) +
      '<g class="boil">' + strand(line, { width: 3.4, dotted: true }) +
      '<g class="slide" data-line="' + line.join(' ') + '" data-s="' + (narrow.matches ? 0.09 : 0.07) + '"><g class="swing" data-a="5" data-s=".4">' + miniTag({ length: 16, w: 40, h: 50, mark: 'lines', planned: true }) + '</g></g></g>' };
  };

  M.scenes.night = () => {
    const thread = [-20, 250, 150, 300, 320, 244];
    const sleeper = theirs({ pose: 'curl', prop: 'satchel,nightcap', marks: 'zz', ink: 3.4 });
    const [mx, my] = threadPoint(thread, 0.62);
    const room = '<g class="boil">' + strand(thread, { width: 3 }) +
      hung(thread, 0.2, { length: 20, w: 46, h: 56, mark: 'lock', sway: 3 }) +
      seat(sleeper, mx, my - 3, 1, { motion: sway(0.3, 1.2) }) + '</g>';
    const tucked = '<g class="pk-tuck">' + place(160, 30, 0.7, '<g transform="rotate(-5 150 620)">' + phone(room, GLASS_ASLEEP) + '</g>') + '</g>';
    return { box: '0 -10 520 610', svg: tucked + place(402, 318, 0.8, keys()) +
      '<path d="' + handCut('M152 346H436V512Q436 588 360 588H228Q152 588 152 512Z', 1.4) + '" fill="' + NIGHT_DEEP + '"/>' +
      stitched('M168 364H420V510Q420 572 358 572H230Q168 572 168 510Z') + stroke('M144 346H444', 3.8, PAPER) };
  };

  M.scenes.morning = () => {
    const thread = [-20, 300, 150, 356, 320, 290];
    const table = [-10, 350, 280, 350, 570, 350];
    const memoris = theirs({ mood: 'glad', arm: 'wave', head: -4 });
    const [mx, my] = threadPoint(thread, 0.62);
    const room = '<g class="boil">' + strand(thread, { width: 3 }) +
      hung(thread, 0.26, { length: 24, w: 44, h: 54, fill: PALE, mark: 'none', sway: 5 }) +
      seat(memoris, mx, my, 1.2, { motion: sway(0.2, 1.8) }) + '</g>';
    return { box: '0 0 560 400', svg: place(366, 277, 0.98, cup(true)) +
      place(190, 5, 0.555, '<g transform="rotate(4 150 620)">' + phone(room) + '</g>') +
      '<g class="boil">' + strand(table, { width: 4.4 }) + '</g>' };
  };

  M.scenes.waiting = () => {
    const [mx, my] = threadPoint(SCREEN_THREAD, 0.6);
    const when = (state, k) => '<g data-when="' + state + '">' + seat(k, mx, my, 1.1, { motion: sway(0.3, 1.8) }) + '</g>';
    const room = '<g class="boil">' + strand(SCREEN_THREAD, { width: 3 }) +
      when('idle', theirs({ mood: 'open', head: 6, ink: 3.6 })) +
      when('error', theirs({ mood: 'worried', head: 2, marks: 'question', ink: 3.6 })) +
      when('sent', theirs({ mood: 'glad', arm: 'wave', head: 8, carry: { mark: 'check', length: 16, w: 42, h: 50, fill: PALE }, ink: 3.6 })) + '</g>';
    return { box: '0 0 250 350', svg: place(40, 14, 0.5, held(room)) };
  };

  const DOOR_SIZE = 0.52;
  const atHome = () => ({
    behind: '<g class="boil">' + strand(MIND_THREAD, { width: 4 }) + '</g>',
    front: '<g class="boil">' + settled(mine({ mood: 'glad', head: 4, ink: 6 }), '') + '</g>'
  });
  M.scenes.you = () => ({ box: '0 0 230 260', svg: person(YOU, { at: [41, 0, DOOR_SIZE], inside: atHome() }) });
  M.scenes.beside = () => ({ box: '0 0 400 260', svg: person(CLOSE, { at: [216, 0, DOOR_SIZE], flip: true }) + person(YOU, { at: [12, 0, DOOR_SIZE], inside: atHome() }) });

  M.ready(() => {
    document.querySelectorAll('[data-hint]').forEach((fig) => {
      const scene = fig.querySelector('[data-scene="hint"]');
      const letters = [...fig.querySelectorAll('.pk-letter')];
      const one = fig.querySelector('[data-hint-one]');
      const all = fig.querySelector('[data-hint-all]');
      const reset = fig.querySelector('[data-hint-reset]');
      const status = fig.querySelector('[data-hint-status]');
      const name = letters.map((letter) => letter.textContent.trim()).join('');
      const FIRST = 1;
      const BEAT = 280;
      let timers = [];
      const later = (fn, wait) => {
        if (still.matches) fn();
        else timers.push(setTimeout(fn, wait));
      };
      const act = (state) => {
        scene.querySelectorAll('[data-pk-step]').forEach((part) => part.setAttribute('display', part.dataset.pkStep.split(' ').includes(state) ? 'inline' : 'none'));
        fig.dataset.step = state;
        M.nod(scene);
      };
      const give = (letter, from) => {
        letter.classList.remove('is-given', 'is-back');
        if (from) letter.classList.add(from);
      };
      const clear = () => {
        timers.forEach(clearTimeout);
        timers = [];
      };
      const answered = (text) => {
        const focused = fig.contains(document.activeElement);
        one.hidden = true;
        all.hidden = true;
        reset.hidden = false;
        status.textContent = text;
        if (focused) reset.focus({ preventScroll: true });
      };
      const begin = () => {
        clear();
        letters.forEach((letter) => give(letter, ''));
        one.hidden = false;
        all.hidden = false;
        reset.hidden = true;
        status.textContent = '';
        act('ask');
      };
      one.addEventListener('click', () => {
        clear();
        act('hint');
        letters.slice(0, FIRST).forEach((letter) => give(letter, 'is-given'));
        answered(name.slice(0, FIRST) + '… ' + name + '.');
        later(() => act('idea'), BEAT * 2);
        letters.slice(FIRST).forEach((letter, i) => later(() => give(letter, 'is-back'), BEAT * (4 + i)));
        later(() => act('found'), BEAT * (4 + letters.length - FIRST));
      });
      all.addEventListener('click', () => {
        clear();
        act('hint');
        letters.forEach((letter) => give(letter, 'is-given'));
        answered(name + '.');
        later(() => act('told'), BEAT * 3);
      });
      reset.addEventListener('click', () => {
        const focused = fig.contains(document.activeElement);
        begin();
        if (focused) one.focus({ preventScroll: true });
      });
      document.addEventListener('pk:redrawn', () => act(fig.dataset.step || 'ask'));
      begin();
    });

    document.querySelectorAll('[data-form-host]').forEach((host) => {
      const waiting = host.querySelector('[data-scene="waiting"]');
      if (waiting) new MutationObserver(() => M.nod(waiting)).observe(host, { attributes: true, attributeFilter: ['data-state'] });
    });

    const LABEL_MIN = 12.5;
    const LABEL_UNITS = 17;
    const labelled = [...document.querySelectorAll('svg[data-scene]')].filter((el) => el.querySelector('.pk-label'));
    M.settle(() => {
      labelled.forEach((el) => {
        const scale = el.getBoundingClientRect().width / el.viewBox.baseVal.width || 1;
        el.style.setProperty('--pk-label', fix(Math.max(LABEL_UNITS, LABEL_MIN / scale)) + 'px');
      });
    });

    const palm = document.querySelector('[data-scene="palm"]');
    const hero = palm.closest('section');
    const lower = { shown: 0, span: 1 };
    const LOWER_BY = 0.085;
    const LOWER_BY_STACKED = 0.025;
    const HELLO_AFTER = 1500;
    const renderLower = () => {
      palm.style.translate = '0 ' + fix(lower.shown * lower.span * (stacked.matches ? LOWER_BY_STACKED : LOWER_BY)) + 'px';
    };
    M.settle(() => {
      lower.span = hero.offsetHeight || 1;
      if (still.matches) lower.shown = 0;
      renderLower();
    });
    M.follow((state) => {
      const goal = Math.min(Math.max(state.y / lower.span, 0), 1);
      if (Math.abs(goal - lower.shown) < 0.0004) return false;
      lower.shown += (goal - lower.shown) * state.ease;
      renderLower();
      return true;
    });
    if (!still.matches) setTimeout(() => M.nod(palm), HELLO_AFTER);

    const gestures = [['night', '.pk-tuck', -84], ['entrance', '.pk-rise', 96], ['hint', '.pk-rise', 96]].map(([scene, part, by]) => ({ el: document.querySelector('[data-scene="' + scene + '"]'), part, by, top: 0, height: 1, shown: 0 })).filter((gesture) => gesture.el);
    const ENTER_AT = 0.9;
    const ENTER_OVER = 0.8;
    const renderGesture = (gesture) => {
      const part = gesture.el.querySelector(gesture.part);
      const left = 1 - gesture.shown;
      if (part) part.setAttribute('transform', 'translate(0 ' + fix(gesture.by * left * left) + ')');
    };
    M.settle(() => {
      gestures.forEach((gesture) => {
        const box = gesture.el.getBoundingClientRect();
        gesture.top = box.top + window.scrollY;
        gesture.height = box.height || 1;
        if (still.matches) gesture.shown = 1;
        renderGesture(gesture);
      });
    });
    M.follow((state) => {
      let busy = false;
      gestures.forEach((gesture) => {
        const goal = Math.min(Math.max((state.y + state.height * ENTER_AT - gesture.top) / (gesture.height * ENTER_OVER), 0), 1);
        if (Math.abs(goal - gesture.shown) < 0.0004) return;
        gesture.shown += (goal - gesture.shown) * state.ease;
        renderGesture(gesture);
        busy = true;
      });
      return busy;
    });
    document.addEventListener('pk:redrawn', () => gestures.forEach(renderGesture));
    narrow.addEventListener('change', () => {
      document.querySelectorAll('.pk-scene').forEach((el) => {
        M.remount(el);
        if (el.stage) el.stage.live = true;
      });
      document.dispatchEvent(new Event('pk:redrawn'));
      M.resettle();
    });
  });
})();
