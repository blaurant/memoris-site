(() => {
  const M = window.Memoris;
  const { fix, within } = M.util;
  const { keeper, seat, strand, hung, threadPoint, miniTag } = M;
  const still = M.still;
  const INK = M.ink;
  const CARD = M.card;
  const SCREEN = '#CDE4D6';
  const MINT = '#A9D9C9';
  const PALE = '#F6DD9C';
  const TEAL_DEEP = '#166A68';
  const CORAL = '#E2603A';
  const SWEATER = '#E7A794';
  const STRAND = '#E8DBC0';
  const CEL = 1000 / 12;

  const PERSON_AT = [64, 56];
  const SKULL = 'M168 668C166 600 158 520 128 446C70 410 34 330 36 244C40 110 130 26 236 24C306 22 362 50 400 100C426 134 440 176 440 214C441 236 449 248 445 264C441 276 433 282 437 292C452 322 482 350 494 370C500 383 487 393 458 392C454 400 465 407 467 417C468 427 455 429 451 433C457 437 465 445 461 455C457 465 447 465 447 475C447 490 460 500 454 516C447 536 428 548 408 550C380 553 352 548 334 556C326 596 328 630 332 668Z';
  const HAIR = 'M124 462C64 426 22 340 24 244C26 100 126 10 238 10C316 8 380 36 418 92C432 112 440 132 438 152C416 142 388 156 372 190C358 230 352 290 326 328C320 344 312 358 304 372C296 352 284 342 266 342C240 344 224 364 226 394C222 424 196 448 170 458C154 464 138 466 124 462Z';
  const HAIR_LIGHTS = 'M62 316C52 250 70 164 118 112M394 76C406 94 416 114 422 134M150 444C176 442 200 428 212 406M340 250C344 232 350 214 358 198M352 262C358 240 364 222 372 208';
  const TORSO = 'M20 1500C10 1100 20 860 70 748C96 700 132 668 172 652L330 658C390 676 440 720 458 800C476 900 470 1200 476 1500Z';
  const COLLAR = 'M160 632C196 664 296 672 336 640C343 656 343 670 335 682C290 712 190 704 152 670C150 656 153 642 160 632Z';
  const EAR = 'M268 344C244 336 224 354 226 380C228 406 250 422 268 412C282 404 276 386 264 386';
  const WINDOW = { cx: 210, cy: 200, rx: 146 };
  const MOUTH = [472, 433];

  const PHONE_AT = [762, 392];
  const PHONE_TILT = -4;
  const PHONE = { w: 240, h: 480, r: 38, rim: 11 };
  const THREAD = [136, 286, 540, 300, 900, 346];
  const KEEPER_SCALE = 0.88;
  const KEEPER_INK = 3.1;
  const LINE = 2.9;

  const pen = (width) => 'fill="none" stroke="' + INK + '" stroke-width="' + (width || LINE) + '" stroke-linecap="round" stroke-linejoin="round"';
  const paint = (fill, width) => 'fill="' + fill + '" stroke="' + INK + '" stroke-width="' + (width || LINE) + '" stroke-linejoin="round" stroke-linecap="round"';
  const along = (t) => threadPoint(THREAD, t);
  function tAt(x) {
    let low = 0;
    let high = 1;
    for (let i = 0; i < 24; i++) {
      const middle = (low + high) / 2;
      if (along(middle)[0] < x) low = middle;
      else high = middle;
    }
    return (low + high) / 2;
  }
  const T_WINDOW = tAt(PERSON_AT[0] + WINDOW.cx + WINDOW.rx - 4);
  const T_PHONE = tAt(PHONE_AT[0] - PHONE.w / 2 + 2);
  const T_CORAL = tAt(219);
  const T_MEMORIS = tAt(PHONE_AT[0] + 24);
  const T_END = tAt(PHONE_AT[0] + PHONE.w / 2);
  const place = (t) => 'translate(' + along(t).map(fix).join(' ') + ')';
  const smooth = (t) => t * t * (3 - 2 * t);

  const WINDOW_AT = [PERSON_AT[0] + WINDOW.cx, PERSON_AT[1] + WINDOW.cy];
  function mindWindow() {
    const brainScale = WINDOW.rx / M.bust.brain.rx;
    const brainAt = [WINDOW_AT[0] - M.bust.brain.cx * brainScale, WINDOW_AT[1] - M.bust.brain.cy * brainScale];
    return '<g transform="translate(' + fix(brainAt[0]) + ' ' + fix(brainAt[1]) + ') scale(' + brainScale.toFixed(4) + ')">' + M.opening(M.bust, 'meet-window') + '</g>';
  }
  function wonder() {
    const x = PERSON_AT[0] + 486;
    const y = PERSON_AT[1] + 150;
    return '<g class="boil cycle" data-wonder data-loop="30" data-every="4" display="none" transform="translate(' + x + ' ' + y + ') rotate(9)">' +
      '<path d="M-16 -34q0 -24 22 -24q22 0 22 19q0 13 -20 22v12" ' + pen(6.4) + '/>' +
      '<circle cx="8" cy="42" r="5.4" fill="' + INK + '"/></g>';
  }
  function person() {
    return '<g transform="translate(' + PERSON_AT.join(' ') + ')">' +
      '<g class="boil">' +
      '<path d="' + TORSO + '" ' + paint(SWEATER) + '/>' +
      '<path d="' + SKULL + '" ' + paint(CARD) + '/>' +
      '<path d="' + COLLAR + '" ' + paint(CORAL) + '/>' +
      '<path data-fine d="M182 668q5 12 3 22M222 682q3 12 0 22M266 686q1 12 -3 21M306 678q0 11 -5 20" ' + pen(1.7) + '/>' +
      '<path data-fine d="M294 426C302 472 332 522 390 548" ' + pen(1.9) + '/>' +
      '<path d="' + HAIR + '" ' + paint(INK) + '/>' +
      '<path data-fine d="' + HAIR_LIGHTS + '" fill="none" stroke="' + STRAND + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="' + EAR + '" ' + paint(CARD) + '/>' +
      '<path data-fine d="M254 362C244 372 246 388 254 396" ' + pen(1.8) + '/>' +
      '<path data-fine d="M470 383Q462 376 455 382" ' + pen(2) + '/>' +
      '<path data-mouth="shut" d="M451 433C440 446 420 450 404 440M404 440q-4 -4 -2 -9" ' + pen(2.8) + '/>' +
      '<path data-mouth="flat" display="none" d="M452 434C440 437 424 437 410 434" ' + pen(2.8) + '/>' +
      '<path data-mouth="open" display="none" d="M452 429C440 433 424 433 412 429C416 447 438 453 452 429Z" fill="' + INK + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<g transform="translate(410 310)"><g class="k-eye"><ellipse cx="-8" cy="-4" rx="10" ry="12.5" fill="' + CARD + '" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<g class="k-gaze" data-gaze transform="translate(3.4 1.6)"><ellipse cx="-8" cy="-4" rx="5" ry="6.8" fill="' + INK + '"/><circle cx="-6.2" cy="-7" r="1.8" fill="' + CARD + '"/></g></g></g>' +
      '<circle cx="402" cy="306" r="29" fill="' + CARD + '" fill-opacity=".2" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M373 300L272 350M431 298Q438 292 444 296" ' + pen(2.8) + '/>' +
      '<path data-brow="calm" d="M378 268Q402 252 428 262" ' + pen(3.6) + '/>' +
      '<path data-brow="unsure" display="none" d="M380 258Q404 256 428 270" ' + pen(3.6) + '/>' +
      '</g></g>';
  }
  function voice() {
    const x = PERSON_AT[0] + MOUTH[0] + 18;
    const y = PERSON_AT[1] + MOUTH[1];
    return '<g class="boil cycle" data-voice data-loop="24" data-every="3" display="none" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round">' +
      [10, 18, 26].map((half, i) => '<path d="M' + (x + i * 15) + ' ' + (y - half) + 'q' + (7 + i * 5) + ' ' + half + ' 0 ' + half * 2 + '"/>').join('') + '</g>';
  }
  function phoneBack() {
    const sleeve = 'M-6 300L-150 1300';
    return '<g class="boil">' +
      '<path d="' + sleeve + '" fill="none" stroke="' + INK + '" stroke-width="' + (118 + LINE * 2) + '" stroke-linecap="round"/>' +
      '<path d="' + sleeve + '" fill="none" stroke="' + SWEATER + '" stroke-width="118" stroke-linecap="round"/>' +
      '<path d="M-58 318L48 344L42 372L-64 346Z" ' + paint(CORAL) + '/>' +
      '<path d="M-132 150C-154 196 -142 256 -96 286C-40 312 70 308 112 284C146 262 156 214 146 160Z" ' + paint(CARD) + '/>' +
      '</g>';
  }
  function phoneBody() {
    const { w, h, r, rim } = PHONE;
    const key = (x, y, tall) => '<rect x="' + x + '" y="' + y + '" width="8" height="' + tall + '" rx="3" fill="' + INK + '"/>';
    return '<g class="boil">' + key(-w / 2 - 4, -124, 34) + key(-w / 2 - 4, -78, 34) + key(w / 2 - 4, -104, 62) +
      '<rect x="' + -w / 2 + '" y="' + -h / 2 + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="' + INK + '" stroke="' + INK + '" stroke-width="' + LINE + '"/>' +
      '<rect x="' + (-w / 2 + rim) + '" y="' + (-h / 2 + rim) + '" width="' + (w - rim * 2) + '" height="' + (h - rim * 2) + '" rx="' + (r - rim) + '" fill="' + SCREEN + '"/>' +
      '<rect data-still x="-33" y="' + (-h / 2 + rim + 9) + '" width="66" height="19" rx="9.5" fill="' + INK + '"/>' +
      '<rect data-still x="-36" y="' + (h / 2 - rim - 13) + '" width="72" height="5" rx="2.5" fill="' + INK + '" opacity=".45"/>' +
      '<text class="meet-clock" data-clock x="' + (-w / 2 + rim + 17) + '" y="' + (-h / 2 + rim + 24) + '">' + CLOCK[0].shows + '</text>' +
      '<rect data-still x="' + (w / 2 - rim - 41) + '" y="' + (-h / 2 + rim + 13.5) + '" width="21" height="11" rx="3.2" fill="none" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<rect data-still x="' + (w / 2 - rim - 38.6) + '" y="' + (-h / 2 + rim + 15.9) + '" width="12" height="6.2" rx="1.4" fill="' + INK + '"/>' +
      '<rect data-still x="' + (w / 2 - rim - 19) + '" y="' + (-h / 2 + rim + 16.8) + '" width="2" height="4.4" rx="1" fill="' + INK + '"/>' +
      '</g>';
  }
  function phoneFront() {
    const finger = (y) => '<path d="M152 ' + (y - 19) + 'C128 ' + (y - 23) + ' 101 ' + (y - 17) + ' 100 ' + y + 'C99 ' + (y + 16) + ' 128 ' + (y + 20) + ' 152 ' + (y + 17) + '" ' + paint(CARD) + '/>';
    return '<g class="boil">' + finger(66) + finger(111) + finger(156) + finger(199) +
      '<path d="M-152 204C-164 146 -144 98 -114 84C-92 75 -79 92 -87 114C-98 144 -103 176 -102 210" ' + paint(CARD) + '/>' +
      '<path data-fine d="M-118 104q10 -6 18 2" ' + pen(1.8) + '/>' +
      '</g>';
  }
  const CHAT = { w: 176, cut: 12, lead: 17.5, hole: 11, pad: 52 };
  const chatHeight = (lines) => CHAT.pad + lines.length * CHAT.lead;
  function chatTag(left, top, from, lines, memoris) {
    const h = chatHeight(lines);
    const fill = memoris ? TEAL_DEEP : CARD;
    const ink = memoris ? CARD : INK;
    const shape = 'M' + (left + CHAT.cut) + ' ' + top + 'H' + (left + CHAT.w - CHAT.cut) + 'L' + (left + CHAT.w) + ' ' + (top + CHAT.cut) + 'V' + (top + h) + 'H' + left + 'V' + (top + CHAT.cut) + 'Z';
    return '<g data-pop transform-origin="' + fix(from[0]) + ' ' + fix(from[1]) + '">' +
      '<path d="M' + fix(from[0]) + ' ' + fix(from[1]) + 'L' + fix(from[0]) + ' ' + (top + CHAT.hole) + '" ' + pen(2.2) + '/>' +
      '<path d="' + shape + '" ' + paint(fill, 2.6) + '/>' +
      '<circle cx="' + fix(from[0]) + '" cy="' + (top + CHAT.hole) + '" r="3.6" fill="' + ink + '"/>' +
      '<text class="chat__who" x="' + (left + 15) + '" y="' + (top + 31) + '" fill="' + ink + '">' + (memoris ? 'Memoris' : 'You') + '</text>' +
      lines.map((line, i) => '<text class="chat__line' + (memoris ? '' : ' chat__line--said') + '" x="' + (left + 15) + '" y="' + (top + CHAT.pad + i * CHAT.lead) + '" fill="' + ink + '">' + line + '</text>').join('') + '</g>';
  }
  const ASKED = ['“Which film did I watch', 'this weekend?”'];
  const ANSWERED = ['Blue Moon, on Saturday', 'evening. You enjoyed it.'];
  const ASKED_AT = [PHONE_AT[0] - 90, 372];
  const ASKED_T = tAt(ASKED_AT[0] + 34);
  const ANSWER_GAP = 16;
  function chats() {
    const top = ASKED_AT[1] + chatHeight(ASKED);
    const link = [ASKED_AT[0] + 38, top];
    return chatTag(ASKED_AT[0], ASKED_AT[1], along(ASKED_T), ASKED, false) + chatTag(ASKED_AT[0] + 10, top + ANSWER_GAP, link, ANSWERED, true);
  }

  const CORAL_STATES = {
    work: { mood: 'open', head: 2, look: 'ahead' },
    hello: { mood: 'glad', arm: 'wave', head: 8 },
    listen: { mood: 'open', head: 6, look: 'ahead' },
    pass: { mood: 'glad', arm: 'point', head: 2 },
    glad: { mood: 'proud', arm: 'up', head: 10 },
    think: { mood: 'thinking', arm: 'chin', head: 8 },
    idea: { mood: 'surprised', arm: 'chin', head: 10, look: 'ahead' },
    proud: { mood: 'proud', arm: 'wave', head: 10 }
  };
  const MEMORIS_STATES = {
    hello: { mood: 'glad', arm: 'wave', head: -6 },
    open: { mood: 'open', head: -4 },
    catch: { mood: 'open', arm: 'up', head: 4 },
    glad: { mood: 'glad', head: -6 },
    send: { mood: 'glad', arm: 'point', head: -2 },
    hint: { mood: 'saying', arm: 'point', head: 2, marks: 'say' }
  };
  function cast(name, states, base, t, flip) {
    const [x, y] = along(t);
    return Object.keys(states).map((state, i) => {
      const k = keeper(Object.assign({ ink: KEEPER_INK }, base, states[state]));
      return '<g data-' + name + '="' + state + '"' + (i ? ' display="none"' : '') + '>' + seat(k, x, y - 1, KEEPER_SCALE, { flip, motion: 'class="sway" data-a="1.8" data-s=".22" data-p="' + (flip ? 0.1 : 0.6) + '"' }) + '</g>';
    }).join('');
  }
  const hang = (o, attrs) => '<g ' + (attrs || '') + ' transform="' + place(o.t) + '"><g data-pop><g class="swing" data-a="' + (o.sway || 4) + '" data-s=".3" data-p="' + o.t.toFixed(3) + '">' + miniTag(o) + '</g></g></g>';
  const onThread = (o) => Object.assign(o, { t: tAt(o.x) });
  const INNER = [
    { x: 286, length: 9, w: 26, h: 31, mark: 'lines' },
    { x: 313, length: 21, w: 27, h: 32, mark: 'key', fill: PALE, comes: 'key' },
    { x: 340, length: 10, w: 26, h: 31, mark: 'book', fill: MINT },
    { x: 366, length: 5, w: 26, h: 31, mark: 'face', comes: 'face' }
  ].map(onThread);
  const SCREEN_LEFT = PHONE_AT[0] - PHONE.w / 2;
  const KEPT = [
    { x: SCREEN_LEFT + 73, length: 146, w: 30, h: 36, mark: 'key', fill: PALE, sway: 3 },
    { x: SCREEN_LEFT + 98, length: 44, w: 28, h: 34, mark: 'lines', sway: 3 },
    { x: SCREEN_LEFT + 128, length: 190, w: 30, h: 36, mark: 'face', sway: 3 },
    { x: SCREEN_LEFT + 194, length: 176, w: 28, h: 34, mark: 'book', fill: MINT, sway: 3 }
  ].map(onThread);
  const NEW_SPOT = onThread({ x: SCREEN_LEFT + 29, length: 34, w: 30, h: 36, mark: 'calendar' });
  const GO_SCALE = 1.5;
  const GO = {
    calendar: { from: T_CORAL + 0.03, to: NEW_SPOT.t, tag: NEW_SPOT },
    key: { from: KEPT[0].t, to: INNER[1].t, tag: INNER[1] },
    face: { from: KEPT[2].t, to: INNER[3].t, tag: INNER[3] }
  };

  const PLATE = { px: 13, tall: 30, pad: 15, dot: 24, cut: 8 };
  const LABELS = [
    { name: 'you', text: 'You', at: [PERSON_AT[0] + 248, PERSON_AT[1] + 590], dot: INK, from: 0.74, away: [1.58, 3.66], mine: true },
    { name: 'memory', text: 'Your memory', at: [WINDOW_AT[0], WINDOW_AT[1] - 158], dot: CORAL, from: 1.74, mine: true },
    { name: 'memoris', text: 'Memoris', at: [PHONE_AT[0] - 10, PHONE_AT[1] - PHONE.h / 2 - 26], dot: '#1F8A84', from: 2.7, also: 0.5 }
  ];
  function plate(label) {
    return '<g data-label="' + label.name + '" opacity="0" transform="translate(' + label.at.map(fix).join(' ') + ')"><g data-plate>' +
      '<path data-plate-shape ' + paint(PALE, 2.2) + '/>' +
      '<circle data-plate-dot r="5" cy="0" fill="' + label.dot + '" stroke="' + INK + '" stroke-width="1.8"/>' +
      '<text class="meet-label" y="4.6">' + label.text + '</text></g></g>';
  }

  const AT = {
    chatsOff: 0.86, phoneOutFrom: 0.56, phoneOutTo: 0.86, personFrom: 0.7, personTo: 0.96,
    wonderFrom: 0.92, wonderTo: 1.56, open: 1.62, helloFrom: 1.86, helloTo: 2.46,
    phoneInFrom: 2.5, phoneInTo: 2.86, waveBack: 2.84, waveTo: 3.42, asideFrom: 2.5, asideTo: 2.64, againFrom: 3.64, againTo: 3.76,
    stringFrom: 3.72, stringTo: 3.88, sayFrom: 3.72, sayTo: 3.96, outFrom: 3.8, outTo: 3.98,
    askFrom: 4.4, askTo: 4.72, backFrom: 4.55, backTo: 4.98, hint: 5.45, hintSayTo: 5.85
  };
  const CLOCK = [{ until: AT.phoneOutTo, shows: '7:30' }, { until: AT.hint, shows: '9:15' }, { until: Infinity, shows: '12:30' }];
  const ROI = {
    phone: [PHONE_AT[0] - 164, 92, 330, 636],
    phoneTop: [PHONE_AT[0] - 158, 96, 320, 316],
    phoneLow: [PHONE_AT[0] - 158, 330, 320, 318],
    meet: [PHONE_AT[0] - 172, 84, 348, 654],
    head: [70, 30, 512, 644],
    portrait: [86, 50, 494, 580],
    mind: [106, 74, 340, 310],
    all: [84, 44, 832, 652],
    out: [104, 74, 404, 310],
    into: [PHONE_AT[0] - 200, 96, 404, 300]
  };
  const MAX_ZOOM = 1.75;
  const TRACK_UNDER = 0.62;
  const CROP_UNDER = 0.86;
  const stackedView = window.matchMedia('(max-width:620px),(max-aspect-ratio:11/10)');
  function fit(roi, rect, size) {
    const s = Math.min(rect[2] / roi[2], rect[3] / roi[3], MAX_ZOOM);
    return { x: roi[0] + roi[2] / 2 - (rect[0] + rect[2] / 2) / s, y: roi[1] + roi[3] / 2 - (rect[1] + rect[3] / 2) / s, w: size[0] / s, h: size[1] / s, s };
  }
  function plan(stage) {
    const box = stage.getBoundingClientRect();
    const size = [box.width || 1, box.height || 1];
    const meet = stage.closest('[data-meet]');
    const blocks = meet.querySelectorAll('[data-step]');
    const stacked = stackedView.matches;
    const unit = size[0] / 100;
    let heroRect = [8, 8, size[0] - 16, size[1] - 22];
    let stepRect = heroRect;
    if (!stacked) {
      const heroRight = blocks[0].getBoundingClientRect().right - box.left;
      const stepRight = blocks[1].getBoundingClientRect().right - box.left;
      heroRect = [heroRight + unit, unit * 6.4, size[0] - heroRight - unit * 3.4, size[1] - unit * 7.4];
      stepRect = [stepRight + unit * 2.2, unit * 3.6, size[0] - stepRight - unit * 4.2, size[1] - unit * 5.6];
    }
    const cardRect = (block) => {
      const right = block.getBoundingClientRect().right - box.left;
      return [right + unit * 2.6, unit * 1.4, size[0] - right - unit * 7.4, size[1] - unit * 2.8];
    };
    const shot = (name, rect) => fit(ROI[name], rect || stepRect, size);
    const wide = shot('all');
    const whole = shot('phone', heroRect);
    const tracking = stacked && wide.s < TRACK_UNDER;
    const keys = [];
    const key = (p, frame) => keys.push({ p, frame });
    if (stacked && whole.s < CROP_UNDER) {
      key(0, shot('phoneTop'));
      key(0.3, shot('phoneTop'));
      key(0.56, shot('phoneLow'));
      key(0.68, shot('phoneLow'));
    } else {
      key(0, whole);
      key(0.42, whole);
    }
    key(0.97, shot('head'));
    key(1.5, shot('head'));
    const keeperCard = stacked ? shot('mind') : shot('portrait', cardRect(blocks[2]));
    const memorisCard = stacked ? shot('phoneTop') : shot('meet', cardRect(blocks[3]));
    key(1.96, keeperCard);
    key(2.5, keeperCard);
    key(2.96, memorisCard);
    key(3.48, memorisCard);
    if (tracking) {
      key(3.66, wide);
      key(AT.outFrom, shot('out'));
      key(AT.outTo, shot('into'));
      key(AT.backFrom, shot('into'));
      key(AT.backTo, shot('out'));
      key(AT.hint - 0.25, shot('out'));
      key(AT.hint + 0.2, shot('into'));
    } else {
      key(3.72, wide);
    }
    key(9, keys[keys.length - 1].frame);
    return { keys, first: keys[0].frame, stacked, size, solved: tracking ? shot('out') : null };
  }
  function frameAt(keys, p) {
    let i = 0;
    while (i < keys.length - 2 && keys[i + 1].p <= p) i += 1;
    const a = keys[i];
    const b = keys[i + 1];
    const t = smooth(within((p - a.p) / (b.p - a.p)));
    const mix = (name) => a.frame[name] + (b.frame[name] - a.frame[name]) * t;
    const w = mix('w');
    return { x: mix('x'), y: mix('y'), w, h: mix('h'), s: a.frame.s * (a.frame.w / w) };
  }
  function blend(a, b, t) {
    const mix = (name) => a[name] + (b[name] - a[name]) * t;
    const w = mix('w');
    return { x: mix('x'), y: mix('y'), w, h: mix('h'), s: a.s * (a.w / w) };
  }

  M.scenes.meet = (el) => {
    const first = plan(el.closest('[data-stage]')).first;
    const middle = strand(THREAD, { from: T_WINDOW, until: T_PHONE, width: 3 });
    const svg = '<g data-person opacity="0">' + person() + voice() + wonder() +
      '<g data-mind display="none"><g data-pop transform-origin="' + WINDOW_AT.map(fix).join(' ') + '">' + mindWindow() +
      '<g class="boil">' + strand(THREAD, { until: T_WINDOW, width: 3 }) +
      INNER.map((o) => hang(o, o.comes ? 'data-inner="' + o.comes + '" display="none"' : '')).join('') +
      cast('coral', CORAL_STATES, { color: 'coral', prop: 'visor' }, T_CORAL, true) + '</g></g></g>' + LABELS.filter((label) => label.mine).map(plate).join('') + '</g>' +
      '<g data-phone><g transform="translate(' + PHONE_AT.join(' ') + ') rotate(' + PHONE_TILT + ')">' + phoneBack() + phoneBody() + '</g>' +
      '<clipPath id="meet-screen"><rect transform="translate(' + PHONE_AT.join(' ') + ') rotate(' + PHONE_TILT + ')" x="' + (PHONE.rim - PHONE.w / 2) + '" y="' + (PHONE.rim - PHONE.h / 2) + '" width="' + (PHONE.w - PHONE.rim * 2) + '" height="' + (PHONE.h - PHONE.rim * 2) + '" rx="' + (PHONE.r - PHONE.rim) + '"/></clipPath>' +
      '<g clip-path="url(#meet-screen)"><g class="boil">' + strand(THREAD, { from: T_PHONE, until: T_END, width: 3 }) +
      '<g data-kept display="none">' + KEPT.map((o) => hang(o)).join('') + '</g>' +
      '<g data-new display="none">' + hang(NEW_SPOT) + '</g>' +
      '<g data-chats>' + chats() + '</g>' +
      cast('memoris', MEMORIS_STATES, { color: 'teal', prop: 'satchel' }, T_MEMORIS, false) + '</g></g>' +
      '<g transform="translate(' + PHONE_AT.join(' ') + ') rotate(' + PHONE_TILT + ')">' + phoneFront() + '</g></g>' +
      '<g class="boil" data-strung>' + middle + '</g>' +
      '<g class="boil">' + Object.keys(GO).map((name) => '<g data-go="' + name + '" display="none"><g data-pop><g class="swing" data-a="7" data-s=".5"><g transform="scale(' + GO_SCALE + ')">' + miniTag(Object.assign({}, GO[name].tag, { length: GO[name].tag.length / GO_SCALE })) + '</g></g></g></g>').join('') + '</g>' +
      LABELS.filter((label) => !label.mine).map(plate).join('');
    return { box: [first.x, first.y, first.w, first.h].map(fix).join(' '), svg };
  };

  M.scenes.mine = () => {
    const thread = [0, 138, 280, 196, 560, 138];
    const owner = keeper({ color: 'coral', prop: 'visor', mood: 'proud', arm: 'hold', hold: { mark: 'key', length: 12, w: 36, h: 44, fill: PALE }, head: 6, ink: 3.1 });
    const [x, y] = threadPoint(thread, 0.27);
    const [lx, ly] = threadPoint(thread, 0.9);
    const tag = (t, o) => hung(thread, t, Object.assign({ string: M.paper, sway: 3 }, o));
    return '<g class="boil">' + strand(thread, { width: 3, color: M.paper }) +
      tag(0.06, { length: 26, w: 36, h: 44, mark: 'lock', fill: MINT }) +
      tag(0.5, { length: 22, w: 38, h: 48, mark: 'lines' }) +
      tag(0.62, { length: 46, w: 36, h: 46, mark: 'face', fill: PALE }) +
      tag(0.74, { length: 18, w: 38, h: 48, mark: 'book' }) +
      '<g transform="translate(' + fix(lx) + ' ' + fix(ly) + ') scale(1.4)"><g class="swing" data-a="3" data-s=".2">' + M.lantern(M.paper) + '</g></g>' +
      seat(owner, x, y, 1.04, { flip: true, motion: M.sway(0.2, 1.8) }) + '</g>';
  };

  const STILL_AT = [0, 1.3, 2.2, 3.2, 4.2, 5.2, 6];
  const POP = [0.5, 1.14, 0.95, 1];
  const OPEN = [0.2, 0.62, 1.08, 0.97, 1];
  const FULL_FRAMES = 13;
  const GREET_AFTER = 9;
  const GREET_EVERY = 12;
  const GREET_UNDER = 0.2;
  const LABEL_FADE = 0.2;
  const GAZE = { ahead: 'translate(3.4 1.6)', up: 'translate(1.2 -3.6)', phone: 'translate(3.2 3.2)' };

  function wire(svg) {
    const one = (selector) => svg.querySelector(selector);
    const all = (selector) => [...svg.querySelectorAll(selector)];
    const seen = {};
    const timers = new Map();
    const show = (node, on) => node.setAttribute('display', on ? 'inline' : 'none');
    const changed = (name, value) => {
      if (seen[name] === value) return false;
      seen[name] = value;
      return true;
    };
    const choose = (name, state) => {
      if (!changed(name, state)) return;
      all('[data-' + name + ']').forEach((node) => show(node, node.getAttribute('data-' + name) === state));
    };
    function run(node, count, draw, done) {
      clearInterval(timers.get(node));
      let i = 0;
      draw(0);
      const timer = setInterval(() => {
        i += 1;
        if (i >= count) {
          clearInterval(timer);
          timers.delete(node);
          if (done) done();
          return;
        }
        draw(i);
      }, CEL);
      timers.set(node, timer);
    }
    const halt = (node) => {
      clearInterval(timers.get(node));
      timers.delete(node);
    };
    const popOf = (node) => (node.matches('[data-pop]') ? node : node.querySelector('[data-pop]'));
    function pop(node, wait, scales) {
      const target = popOf(node);
      if (!target) return;
      if (still.matches) {
        target.removeAttribute('transform');
        return;
      }
      const lead = wait || 0;
      const steps = scales || POP;
      run(target, steps.length + lead, (i) => target.setAttribute('transform', 'scale(' + (i < lead ? 0 : steps[i - lead]) + ')'));
    }
    const settle = (node) => {
      const target = popOf(node);
      if (!target) return;
      halt(target);
      target.removeAttribute('transform');
    };

    const inner = {};
    INNER.filter((o) => o.comes).forEach((o) => {
      inner[o.comes] = one('[data-inner="' + o.comes + '"]');
    });
    function arrive(name, home, live) {
      if (!changed('home-' + name, home)) return;
      show(inner[name], home);
      if (home && live) pop(inner[name]);
      else settle(inner[name]);
    }

    const go = {};
    Object.keys(GO).forEach((name) => {
      go[name] = one('[data-go="' + name + '"]');
    });
    function travel(name, share) {
      const node = go[name];
      const on = share > 0 && share < 1;
      if (changed('go-' + name, on)) {
        show(node, on);
        if (on && share < 0.2) pop(node);
        else settle(node);
      }
      if (!on) return;
      const route = GO[name];
      node.setAttribute('transform', place(route.from + (route.to - route.from) * smooth(share)));
    }

    const body = one('[data-person]');
    const mind = one('[data-mind]');
    const device = one('[data-phone]');
    const strung = one('[data-strung]');
    const labels = LABELS.map((label) => ({ label, node: one('[data-label="' + label.name + '"]') }));
    const mouths = all('[data-mouth]');
    const brows = all('[data-brow]');
    const gaze = one('[data-gaze]');
    const voiceArcs = one('[data-voice]');
    const wonderMark = one('[data-wonder]');
    const chats = one('[data-chats]');
    const kept = one('[data-kept]');
    const fresh = one('[data-new]');
    const clock = one('[data-clock]');
    const hint = { count: 0, done: false, sliding: 0 };

    function tell(p, live) {
      const hinting = p >= AT.hint;
      let coral = p < AT.helloFrom ? 'work' : p < AT.helloTo ? 'hello' : p < AT.stringFrom ? 'work' : p < AT.outFrom ? 'listen' : p < AT.outTo ? 'pass' : p < AT.backTo ? 'listen' : 'glad';
      let memoris = p < AT.phoneOutTo ? 'hello' : p < AT.waveBack ? 'open' : p < AT.waveTo ? 'hello' : p < AT.outFrom + 0.1 ? 'open' : p < AT.outTo ? 'catch' : p < AT.askFrom ? 'glad' : p < AT.backFrom ? 'open' : p < AT.backTo ? 'send' : 'glad';
      if (hinting) {
        coral = hint.sliding ? 'listen' : hint.done ? 'proud' : hint.count ? 'idea' : 'think';
        memoris = hint.sliding ? 'send' : hint.done ? 'glad' : hint.count ? 'hint' : 'open';
      }
      choose('coral', coral);
      choose('memoris', memoris);

      const aside = Math.max(1 - within((p - AT.asideFrom) / (AT.asideTo - AT.asideFrom)), within((p - AT.againFrom) / (AT.againTo - AT.againFrom)));
      const arrived = Math.min(within((p - AT.personFrom) / (AT.personTo - AT.personFrom)), aside).toFixed(2);
      if (changed('person', arrived)) body.setAttribute('opacity', arrived);
      const held = Math.max(1 - within((p - AT.phoneOutFrom) / (AT.phoneOutTo - AT.phoneOutFrom)), within((p - AT.phoneInFrom) / (AT.phoneInTo - AT.phoneInFrom))).toFixed(2);
      if (changed('phone', held)) device.setAttribute('opacity', held);

      const opened = p >= AT.open;
      if (changed('mind', opened)) {
        show(mind, opened);
        if (opened && live) pop(mind, 0, OPEN);
        else settle(mind);
      }

      const time = CLOCK.find((hour) => p < hour.until).shows;
      if (changed('clock', time)) clock.textContent = time;

      const talking = p < AT.chatsOff;
      if (changed('chats', talking)) {
        show(chats, talking);
        show(kept, !talking);
        all('[data-chats] [data-pop]').forEach(settle);
      }
      const keptNew = p >= AT.outTo;
      if (changed('new', keptNew)) {
        show(fresh, keptNew);
        if (keptNew && live) pop(fresh);
        else settle(fresh);
      }
      arrive('key', p >= AT.backTo, live);
      arrive('face', hinting && hint.done && !hint.sliding, live);

      const drawn = within((p - AT.stringFrom) / (AT.stringTo - AT.stringFrom));
      if (changed('strung', drawn.toFixed(3))) M.drawOn(strung, drawn);

      const wondering = p >= AT.wonderFrom && p < AT.wonderTo;
      const speaking = (p >= AT.sayFrom && p < AT.sayTo) || (p >= AT.askFrom && p < AT.askTo) || (hinting && p < AT.hintSayTo && !hint.count && !hint.done);
      const face = speaking ? 'open' : wondering ? 'flat' : 'shut';
      if (changed('face', face)) {
        show(voiceArcs, speaking);
        show(wonderMark, wondering);
        mouths.forEach((node) => show(node, node.dataset.mouth === face));
        brows.forEach((node) => show(node, (node.dataset.brow === 'unsure') === wondering));
        gaze.setAttribute('transform', wondering ? GAZE.up : GAZE.ahead);
      }
      travel('calendar', (p - AT.outFrom) / (AT.outTo - AT.outFrom));
      travel('key', (p - AT.backFrom) / (AT.backTo - AT.backFrom));
      travel('face', hint.sliding);
    }
    function look(frame, p) {
      svg.setAttribute('viewBox', fix(frame.x) + ' ' + fix(frame.y) + ' ' + fix(frame.w) + ' ' + fix(frame.h));
      const grow = (1 / frame.s).toFixed(3);
      labels.forEach((item) => {
        const early = item.label.also ? 1 - within((p - item.label.also) / LABEL_FADE) : 0;
        const away = item.label.away ? Math.max(1 - within((p - item.label.away[0]) / LABEL_FADE), within((p - item.label.away[1]) / LABEL_FADE)) : 1;
        const opacity = Math.max(early, within((p - item.label.from) / LABEL_FADE) * away).toFixed(2);
        if (changed('label-' + item.label.name, opacity)) item.node.setAttribute('opacity', opacity);
        if (changed('grow-' + item.label.name, grow)) item.node.firstChild.setAttribute('transform', 'scale(' + grow + ')');
      });
    }
    function sizeLabels() {
      labels.forEach((item) => {
        const text = item.node.querySelector('text');
        const long = text.getBBox().width;
        const wide = PLATE.pad * 2 + PLATE.dot + long;
        const left = -wide / 2;
        const half = PLATE.tall / 2;
        item.node.querySelector('[data-plate-shape]').setAttribute('d', 'M' + fix(left + PLATE.cut) + ' ' + -half + 'H' + fix(-left) + 'V' + half + 'H' + fix(left + PLATE.cut) + 'L' + fix(left) + ' ' + (half - PLATE.cut) + 'V' + (PLATE.cut - half) + 'Z');
        item.node.querySelector('[data-plate-dot]').setAttribute('cx', fix(left + PLATE.pad + 5));
        text.setAttribute('x', fix(left + PLATE.pad + PLATE.dot));
      });
    }
    const greet = () => [...chats.children].forEach((node, i) => pop(node, GREET_AFTER + i * GREET_EVERY));
    return { tell, look, sizeLabels, hint, greet };
  }

  M.ready(() => {
    const meet = document.querySelector('[data-meet]');
    const stage = meet.querySelector('[data-stage]');
    const art = stage.querySelector('svg');
    const blocks = [...meet.querySelectorAll('[data-step]')];
    const last = blocks.length - 1;
    const view = { p: -1, goal: 0, marks: [0], plan: null, solve: 0 };
    let scene = wire(art);
    const LINE_WIDE = 0.52;
    const UNDER_STAGE = 30;
    const AFTER_LAST = 0.5;
    const SOLVE_EASE = 0.12;

    function goalAt(y) {
      const marks = view.marks;
      if (y >= marks[last]) return Math.min(last + ((y - marks[last]) / (window.innerHeight * 0.8)) * AFTER_LAST, last + AFTER_LAST);
      let i = 0;
      while (i < last - 1 && marks[i + 1] <= y) i += 1;
      return i + within((y - marks[i]) / (marks[i + 1] - marks[i]));
    }
    const replies = [[blocks[4], AT.outTo], [blocks[5], AT.backTo]].map(([block, from]) => ({ node: block.querySelector('.talk__back'), from }));
    const solveGoal = (p) => (view.plan.solved && p >= AT.hint && scene.hint.done ? 1 : 0);
    function render(live) {
      const p = still.matches ? STILL_AT[Math.min(Math.round(view.p), last)] : view.p;
      replies.forEach((reply) => {
        if (p >= reply.from || still.matches) reply.node.classList.add('is-in');
      });
      scene.tell(p, live);
      let frame = frameAt(view.plan.keys, p);
      if (still.matches) view.solve = solveGoal(p);
      if (view.plan.solved && view.solve > 0.001) frame = blend(frame, view.plan.solved, smooth(view.solve));
      scene.look(frame, p);
    }
    function measure() {
      view.plan = plan(stage);
      const height = window.innerHeight;
      const stacked = view.plan.stacked;
      const line = stacked ? view.plan.size[1] + UNDER_STAGE : height * LINE_WIDE;
      view.marks = blocks.map((block, i) => {
        if (!i) return 0;
        const box = block.getBoundingClientRect();
        return box.top + window.scrollY + (stacked ? parseFloat(getComputedStyle(block).paddingTop) : box.height / 2) - line;
      });
      for (let i = 1; i < view.marks.length; i++) view.marks[i] = Math.max(view.marks[i], view.marks[i - 1] + 1);
      scene.sizeLabels();
      view.goal = goalAt(window.scrollY);
      view.p = view.goal;
      render(false);
    }
    M.settle(measure);
    measure();
    if (view.p < GREET_UNDER && !still.matches) scene.greet();
    M.follow((state) => {
      view.goal = goalAt(state.y);
      const wanted = solveGoal(view.p);
      const settled = Math.abs(view.goal - view.p) <= 0.0006 && Math.abs(wanted - view.solve) <= 0.002;
      if (settled) return false;
      view.p += (view.goal - view.p) * state.ease;
      view.solve += (wanted - view.solve) * SOLVE_EASE;
      render(true);
      return true;
    });
    if (still.matches) {
      window.addEventListener('scroll', () => {
        view.p = goalAt(window.scrollY);
        render(false);
      }, { passive: true });
    }
    stackedView.addEventListener('change', () => {
      M.remount(art);
      scene = wire(art);
      measure();
    });

    const cue = meet.querySelector('[data-cue]');
    cue.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: view.marks[1], behavior: still.matches ? 'instant' : 'smooth' });
      const heading = blocks[1].querySelector('h2');
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    });

    const box = meet.querySelector('[data-hint]');
    const slot = box.querySelector('[data-hint-slot]');
    const lines = [...box.querySelectorAll('[data-hint-line]')];
    const told = box.querySelector('[data-hint-told]');
    const story = box.querySelector('[data-hint-story]');
    const hintOne = box.querySelector('[data-hint-one]');
    const hintAll = box.querySelector('[data-hint-all]');
    const hintReset = box.querySelector('[data-hint-reset]');
    const status = box.querySelector('[data-hint-status]');
    const BACK_AFTER = 14;
    const hinting = { given: 0, ending: '', timer: 0 };
    function refresh() {
      const done = hinting.ending !== '';
      scene.hint.count = hinting.given;
      scene.hint.done = done;
      slot.dataset.show = hinting.ending === 'found' ? 'found' : hinting.given || done ? 'hint' : 'wait';
      lines.forEach((line, i) => line.classList.toggle('is-on', !done && i === hinting.given - 1));
      told.classList.toggle('is-on', hinting.ending === 'told');
      story.classList.toggle('is-in', hinting.ending === 'found');
      const spent = done || hinting.given === lines.length;
      hintOne.disabled = spent;
      hintOne.parentNode.hidden = spent;
      hintAll.parentNode.hidden = done;
      hintReset.parentNode.hidden = !done;
      status.textContent = done ? 'Alex.' : hinting.given ? lines[hinting.given - 1].textContent : '';
      render(true);
      M.wake();
    }
    const calm = () => hintOne.parentNode.classList.remove('is-nudging');
    const end = (ending) => {
      scene.hint.sliding = 0;
      hinting.ending = ending;
      refresh();
      hintReset.focus({ preventScroll: true });
    };
    hintOne.addEventListener('click', () => {
      calm();
      hinting.given = Math.min(hinting.given + 1, lines.length);
      refresh();
      if (hinting.given < lines.length) return;
      clearTimeout(hinting.timer);
      hinting.timer = setTimeout(() => end('found'), still.matches ? 0 : BACK_AFTER * CEL);
    });
    hintAll.addEventListener('click', () => {
      calm();
      clearTimeout(hinting.timer);
      if (still.matches) {
        end('told');
        return;
      }
      let frame = 0;
      const timer = setInterval(() => {
        frame += 1;
        scene.hint.sliding = frame / FULL_FRAMES;
        if (frame >= FULL_FRAMES) {
          clearInterval(timer);
          end('told');
          return;
        }
        render(true);
      }, CEL);
    });
    hintReset.addEventListener('click', () => {
      hinting.given = 0;
      hinting.ending = '';
      refresh();
      hintOne.focus({ preventScroll: true });
    });
    new IntersectionObserver((entries, watcher) => {
      if (!entries[0].isIntersecting) return;
      watcher.disconnect();
      if (!hinting.given && !hinting.ending) hintOne.parentNode.classList.add('is-nudging');
    }, { threshold: 0.6 }).observe(box);

    const BOW_EVERY = 3;
    const BOW_FOR = 7;
    document.querySelectorAll('[data-doors]').forEach((row) => {
      const doors = [...row.children];
      const bow = (door, wait) => {
        setTimeout(() => door.classList.add('is-bowing'), wait * CEL);
        setTimeout(() => door.classList.remove('is-bowing'), (wait + BOW_FOR) * CEL);
      };
      doors.forEach((door) => {
        door.addEventListener('pointerenter', () => bow(door, 0));
        door.addEventListener('focusin', () => bow(door, 0));
      });
      new IntersectionObserver((entries, watcher) => {
        if (!entries[0].isIntersecting || still.matches) return;
        watcher.disconnect();
        doors.forEach((door, i) => bow(door, 4 + i * BOW_EVERY));
      }, { threshold: 0.35 }).observe(row);
    });
  });
})();
