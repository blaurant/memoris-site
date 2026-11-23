(() => {
  const M = window.Memoris;
  const { fix, within, defaults } = M.util;
  const { keeper, seat, hung, strand, threadPoint, sway } = M;
  const still = M.still;
  const root = document.documentElement;
  const INK = M.ink;
  const SKIN = '#F0C24B';
  const SCREEN = '#CDE4D6';
  const SEND = '#166A68';
  const PALE = '#F6DD9C';
  const TISSUE = '#F3C9B8';
  const WALL = '#E7A794';

  const PHONE = { x: 72, y: 12, w: 156, h: 320, r: 31, rim: 8 };
  const PHONE_BOX = '0 0 300 446';
  const PHONE_THREAD = [80, 189, 152, 203, 228, 192];
  const MEMORIS_AT = 0.63;
  const MEMORIS_SCALE = 0.78;
  const KEPT = [{ at: 0.13, length: 11 }, { at: 0.34, length: 15 }, { at: 0.235, length: 41 }];
  const KEPT_SIZE = [24, 29];
  const FINGERS = [[170, 27, -7, 207], [199, 28, -2, 204], [227, 26, 3, 206], [253, 22, 8, 211]];
  const FINGER_END = 259;
  const PALM = 'M78 252C62 268 47 298 48 327C51 357 96 380 124 397L126 420H194L196 397C224 381 246 357 251 323C254 297 252 262 246 232Z';
  const THUMB = 'M48 329C61 306 81 285 100 272C109 265 123 266 125 278C126 286 122 291 117 294C103 305 88 327 77 351';

  function hand(part) {
    const skin = 'fill="' + SKIN + '" stroke="' + INK + '" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"';
    if (part === 'behind') {
      return '<path d="' + PALM + '" ' + skin + '/>' +
        '<rect x="108" y="405" width="104" height="37" rx="13" transform="rotate(2 160 423)" fill="' + M.card + '" stroke="' + INK + '" stroke-width="3.2" stroke-linejoin="round"/>' +
        '<circle data-still cx="194" cy="425" r="3.4" fill="' + INK + '"/>';
    }
    const fingers = FINGERS.map(([y, tall, tilt, from]) => '<g transform="rotate(' + tilt + ' ' + (FINGER_END - 12) + ' ' + y + ')"><rect x="' + from + '" y="' + fix(y - tall / 2) + '" width="' + (FINGER_END - from) + '" height="' + tall + '" rx="' + fix(tall / 2) + '" ' + skin + '/>' +
      '<path data-fine d="M' + (from + 15) + ' ' + fix(y - tall * 0.26) + 'q4 ' + fix(tall * 0.26) + ' 0 ' + fix(tall * 0.52) + '" fill="none" stroke="' + INK + '" stroke-width="1.7" stroke-linecap="round"/></g>').join('');
    return '<path d="' + THUMB + '" ' + skin + '/>' +
      '<path data-fine d="M104 276q8 -3 13 3" fill="none" stroke="' + INK + '" stroke-width="1.9" stroke-linecap="round"/>' + fingers;
  }

  function phoneArt(options) {
    const o = defaults({ mood: 'open', arm: 'rest', kept: [], marks: '', rim: '' }, options);
    const memoris = keeper({ color: 'teal', prop: 'satchel', mood: o.mood, arm: o.arm, marks: o.marks, head: -4, ink: 3.5 });
    const [kx, ky] = threadPoint(PHONE_THREAD, MEMORIS_AT);
    const p = PHONE;
    const screen = { x: p.x + p.rim, y: p.y + p.rim, w: p.w - p.rim * 2, h: p.h - p.rim * 2, r: p.r - p.rim };
    const glass = 'x="' + screen.x + '" y="' + screen.y + '" width="' + screen.w + '" height="' + screen.h + '" rx="' + screen.r + '"';
    const clip = 'b-screen-' + Math.random().toString(36).slice(2, 8);
    return '<g class="boil">' + hand('behind') + '</g>' +
      '<g class="boil"><rect x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h + '" rx="' + p.r + '" fill="' + INK + '"' + (o.rim ? ' stroke="' + o.rim + '" stroke-width="3"' : '') + '/></g>' +
      '<rect ' + glass + ' fill="' + SCREEN + '"/>' +
      '<rect x="131" y="29" width="38" height="11" rx="5.5" fill="' + INK + '"/>' +
      '<g class="boil"><rect x="97" y="282" width="112" height="24" rx="12" fill="' + M.card + '" stroke="' + INK + '" stroke-width="2.4"/></g>' +
      '<circle cx="196" cy="294" r="7" fill="' + SEND + '"/>' +
      '<rect x="128" y="315" width="44" height="4" rx="2" fill="' + INK + '" opacity=".4"/>' +
      '<clipPath id="' + clip + '"><rect ' + glass + '/></clipPath>' +
      '<g class="boil" clip-path="url(#' + clip + ')">' + strand(PHONE_THREAD, { width: 3 }) +
      o.kept.map((mark, i) => hung(PHONE_THREAD, KEPT[i % KEPT.length].at, { mark, length: KEPT[i % KEPT.length].length, w: KEPT_SIZE[0], h: KEPT_SIZE[1], fill: i % 2 ? PALE : M.card, sway: 4 })).join('') +
      seat(memoris, kx, ky, MEMORIS_SCALE, { flip: true, motion: sway(0.3, 1.8) }) + '</g>' +
      '<g class="boil">' + hand('front') + '</g>';
  }
  M.scenes['b-phone'] = (el) => ({
    box: PHONE_BOX,
    svg: phoneArt({ mood: el.dataset.mood, arm: el.dataset.arm, marks: el.dataset.marks, rim: el.dataset.rim === 'paper' ? M.paper : '', kept: String(el.dataset.kept || '').split(',').map((name) => name.trim()).filter(Boolean) })
  });

  const LOST = { from: 10, until: 900, y: 196, sag: 18, keeper: 225, knot: 5 };
  const LOST_TAGS = [{ x: 31, mark: 'face', length: 22 }, { x: 113, gone: true, length: 34, sway: 5 }, { x: 333, mark: 'calendar', fill: PALE, length: 28, far: true }];
  M.scenes['b-missing'] = (el) => {
    const from = Number(el.dataset.from || LOST.from);
    const thread = [from, LOST.y, (from + LOST.until) / 2, LOST.y + LOST.sag, LOST.until, LOST.y];
    const at = (x) => (x - from) / (LOST.until - from);
    const yours = keeper({ color: 'coral', prop: 'visor', mood: 'thinking', look: 'down', arm: 'chin', head: -10, marks: 'question', ink: 2.4 });
    const [x, y] = threadPoint(thread, at(LOST.keeper));
    const near = String(el.dataset.tags || '').split(',').filter(Boolean).map(Number);
    const tags = near.length ? LOST_TAGS.slice(0, near.length).map((tag, i) => defaults(tag, { x: near[i] })) : LOST_TAGS;
    return { box: '0 0 360 300', svg: '<g class="boil">' + strand(thread, { width: 2.6 }) + M.knot(thread, at(from + LOST.knot), { width: 2.6, size: 0.8 }) +
      tags.map((tag) => hung(thread, at(tag.x), defaults({ w: 48, h: 58, sway: 3 }, tag))).join('') +
      seat(yours, x, y, 1.2, { motion: sway(0.2, 1.8) }) + '</g>' };
  };

  const WALL_BUMPS = [[18, 70], [22, 110], [14, 60], [20, 90], [16, 80], [19, 70]];
  const BAY_INSET = 26;
  const BAY_TOP = 12;
  const BAY_LEFT = 24;
  const BAY_BAND = 13;
  const BAY_ACROSS = [[64, 17], [92, 21], [56, 14], [80, 19], [70, 16]];
  function bayPath(span, h) {
    const far = span + 90;
    const bottom = h - BAY_INSET;
    let d = 'M' + far + ' ' + BAY_TOP;
    let x = far;
    for (let i = 0; x > BAY_LEFT + 1; i++) {
      const [wide, tall] = BAY_ACROSS[i % BAY_ACROSS.length];
      const step = x - wide - BAY_LEFT < 34 ? x - BAY_LEFT : wide;
      d += 'a' + fix(step / 2) + ' ' + tall + ' 0 0 0 ' + fix(-step) + ' 0';
      x -= step;
    }
    let y = BAY_TOP;
    for (let i = 0; y < bottom - 1; i++) {
      const [deep, tall] = WALL_BUMPS[i % WALL_BUMPS.length];
      const step = bottom - y - tall < 30 ? bottom - y : tall;
      d += 'a' + deep + ' ' + fix(step / 2) + ' 0 0 0 0 ' + fix(step);
      y += step;
    }
    for (let i = 0; x < far; i++) {
      const [wide, tall] = BAY_ACROSS[(i + 2) % BAY_ACROSS.length];
      d += 'a' + fix(wide / 2) + ' ' + tall + ' 0 0 0 ' + wide + ' 0';
      x += wide;
    }
    return d + 'Z';
  }
  function drawBay(svg) {
    const fig = svg.parentNode;
    if (getComputedStyle(svg).display === 'none') return;
    const w = fig.offsetWidth;
    const h = Math.round(svg.getBoundingClientRect().height);
    if (!w || !h) return;
    const span = w - (parseFloat(getComputedStyle(svg).left) || w * 0.54);
    const d = bayPath(span, h);
    const id = svg.dataset.clip || (svg.dataset.clip = 'b-bay-' + Math.random().toString(36).slice(2, 8));
    svg.setAttribute('viewBox', '0 0 ' + fix(span) + ' ' + h);
    svg.innerHTML = '<path d="' + d + '" fill="' + WALL + '"/><clipPath id="' + id + '"><path d="' + d + '"/></clipPath><g clip-path="url(#' + id + ')"><path d="' + d + '" transform="translate(' + BAY_BAND + ' ' + BAY_BAND + ')" fill="' + TISSUE + '"/></g>';
  }

  M.ready(() => {
    const bays = [...document.querySelectorAll('.th-bay')];
    M.settle(() => bays.forEach(drawBay));

    const FONT_WAIT = 1200;
    Promise.race([document.fonts.ready, new Promise((done) => setTimeout(done, FONT_WAIT))]).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('th-in')));
    });

    const TELL_FIRST = 4200;
    const TELL_EVERY = 3900;
    const TELL_TRIP = 1500;
    const LOST_EVERY = 5600;
    const LOST_FOR = 1300;
    const TELL_BACK = 1200;
    const heroFig = document.querySelector('.th-fig--hero');
    const runners = [...heroFig.querySelectorAll('.th-run')];
    const homes = [...heroFig.querySelectorAll('.th-note:not(.th-run):not(.th-unsure)')];
    const calm = heroFig.querySelector('.th-keeper.is-calm');
    const asking = heroFig.querySelector('.th-keeper.is-asking');
    const telling = { turn: 0, timer: 0, seen: false };
    const phoneNow = () => heroFig.querySelector('.th-phone[data-step="' + heroFig.dataset.kept + '"]');
    function tellIt(which) {
      const runner = runners[which];
      M.nod(calm);
      runner.classList.add('is-moving', 'is-out');
      setTimeout(() => {
        runner.classList.remove('is-moving');
        heroFig.dataset.kept = which + 1;
        M.nod(phoneNow());
      }, TELL_TRIP);
    }
    function giveBack(which) {
      const runner = runners[which];
      heroFig.dataset.lost = which + 1;
      runner.classList.add('is-out');
      M.nod(asking);
      setTimeout(() => {
        M.nod(phoneNow());
        runner.getBoundingClientRect();
        runner.classList.add('is-moving');
        runner.classList.remove('is-out');
      }, LOST_FOR);
      setTimeout(() => {
        runner.classList.remove('is-moving');
        delete heroFig.dataset.lost;
        homes[which].classList.remove('is-landed');
        homes[which].getBoundingClientRect();
        homes[which].classList.add('is-landed');
        M.nod(calm);
      }, LOST_FOR + TELL_TRIP);
    }
    function tell() {
      const turn = telling.turn;
      telling.turn += 1;
      const firstRound = turn < runners.length;
      if (firstRound) tellIt(turn);
      else giveBack((turn - runners.length) % runners.length);
      telling.timer = setTimeout(tell, firstRound ? TELL_EVERY : LOST_EVERY);
    }
    if (still.matches) {
      heroFig.dataset.kept = runners.length;
    } else {
      new IntersectionObserver((entries) => {
        const seen = entries[0].isIntersecting;
        if (seen === telling.seen) return;
        telling.seen = seen;
        clearTimeout(telling.timer);
        if (seen) telling.timer = setTimeout(tell, telling.turn ? TELL_BACK : TELL_FIRST);
      }, { threshold: 0.35 }).observe(heroFig);
    }

    const CROSS_FROM = 0.9;
    const CROSS_SPAN = 0.38;
    const DONE_AT = 0.965;
    const STACKED_AT = 0.36;
    const crossings = [...document.querySelectorAll('.th-fig[data-cross]')].map((el) => ({ el, middle: 0, shown: 0, goal: 0 }));
    const goalOf = (crossing, y, height) => within((height * CROSS_FROM - (crossing.middle - y)) / (height * CROSS_SPAN));
    function renderCrossing(crossing) {
      const p = crossing.shown;
      crossing.el.style.setProperty('--p', (p * p * (3 - 2 * p)).toFixed(4));
      const done = p > DONE_AT;
      if (done === crossing.done) return;
      crossing.done = done;
      crossing.el.classList.toggle('is-done', done);
      if (done) crossing.el.querySelectorAll('.is-after').forEach((drawing) => M.nod(drawing));
    }
    M.settle(() => {
      crossings.forEach((crossing) => {
        const line = crossing.el.querySelector('.th-line').getBoundingClientRect();
        const stacked = getComputedStyle(crossing.el).position === 'relative';
        crossing.middle = line.top + window.scrollY + (stacked ? (crossing.el.getBoundingClientRect().bottom - line.top) * STACKED_AT : 0);
        crossing.goal = still.matches ? 1 : goalOf(crossing, window.scrollY, window.innerHeight);
        crossing.shown = crossing.goal;
        renderCrossing(crossing);
      });
    });
    const WALL_LEAN = 0.3;
    const WALL_LEAN_MAX = 7;
    const wall = document.querySelector('.th__wall');
    const lean = { y: window.scrollY, shown: 0 };
    M.follow((state) => {
      const goal = Math.max(Math.min((state.y - lean.y) * WALL_LEAN, WALL_LEAN_MAX), -WALL_LEAN_MAX);
      lean.y = state.y;
      if (Math.abs(goal - lean.shown) <= 0.05) return false;
      lean.shown += (goal - lean.shown) * state.ease;
      wall.style.setProperty('--lean', fix(-Math.abs(lean.shown)) + 'px');
      return true;
    });
    M.follow((state) => {
      let busy = false;
      crossings.forEach((crossing) => {
        crossing.goal = goalOf(crossing, state.y, state.height);
        if (Math.abs(crossing.goal - crossing.shown) <= 0.0004) return;
        crossing.shown += (crossing.goal - crossing.shown) * state.ease;
        renderCrossing(crossing);
        busy = true;
      });
      return busy;
    });
  });
})();
