(() => {
  const M = window.Memoris;
  const { fix, within, rad } = M.util;
  const { keeper, seat, hung, strand, threadPoint, sway, drawn, drawnPath } = M;
  const still = M.still;
  const wide = window.matchMedia('(min-width: 900px)');
  const PALE = M.colors['amber-pale'];
  const LILAC = M.colors.lilac;
  const SPRING_PULL = 0.07;
  const SPRING_DRAG = 0.8;
  const SAG_PULL = 2;

  M.scenes.load = () => {
    const SCALE = 1.36;
    const own = [300, 276, 920, 330, 1540, 276];
    const carer = keeper({ pose: 'haul', color: 'rose', marks: 'sweat', ink: 2.5 });
    const [sx, sy] = threadPoint(own, 0.012);
    const grip = [sx + (carer.hand[0] - carer.curl[0]) * SCALE, sy + (carer.hand[1] - carer.curl[1]) * SCALE];
    const theirs = [grip[0], grip[1], grip[0] - 150, 470, -150, 590];
    return '<g class="boil">' + strand(own) + strand(theirs) +
      hung(own, 0.135, { length: 18, w: 34, h: 42, mark: 'key', sway: 4 }) +
      hung(own, 0.185, { length: 34, w: 32, h: 40, mark: 'book', sway: 4 }) +
      hung(theirs, 0.24, { length: 12, w: 38, h: 46, fill: PALE, mark: 'calendar', sway: 5 }) +
      hung(theirs, 0.36, { length: 26, w: 36, h: 44, fill: PALE, mark: 'question', sway: 4 }) +
      hung(theirs, 0.48, { length: 14, w: 40, h: 50, fill: PALE, mark: 'face', sway: 6 }) +
      hung(theirs, 0.6, { length: 30, w: 36, h: 44, fill: PALE, mark: 'question', sway: 4 }) +
      hung(theirs, 0.71, { length: 16, w: 38, h: 46, fill: PALE, mark: 'key', sway: 5 }) +
      hung(theirs, 0.82, { length: 26, w: 36, h: 44, fill: PALE, mark: 'question', sway: 4 }) +
      hung(theirs, 0.92, { length: 14, w: 36, h: 44, fill: PALE, mark: 'lines', sway: 5 }) +
      seat(carer, sx, sy, SCALE) + '</g>';
  };
  M.scenes.kept3 = () => {
    const thread = [0, 150, 210, 190, 420, 150];
    const sleeper = keeper({ pose: 'curl', color: M.memoris, prop: 'satchel,nightcap', marks: 'zz', ink: 3 });
    const [x, y] = threadPoint(thread, 0.74);
    return '<g class="boil">' + strand(thread, { width: 3, color: M.paper }) +
      hung(thread, 0.14, { length: 26, w: 40, h: 50, mark: 'face', string: M.paper, sway: 3 }) +
      hung(thread, 0.3, { length: 46, w: 40, h: 50, fill: PALE, mark: 'pin', string: M.paper, sway: 3 }) +
      hung(thread, 0.46, { length: 22, w: 40, h: 50, fill: LILAC, mark: 'calendar', string: M.paper, sway: 3 }) +
      seat(sleeper, x, y - 4, 1.02, { motion: sway(0.3, 1.2) }) + '</g>';
  };
  M.scenes.back = () => {
    const thread = [0, 196, 260, 224, 520, 196];
    const asker = keeper({ color: 'coral', mood: 'glad', head: 8, arm: 'up', ink: 2.9 });
    const memoris = keeper({ color: M.memoris, prop: 'satchel', mood: 'glad', arm: 'give', hold: { mark: 'face', w: 34, h: 42, length: 12 }, head: -2, ink: 2.9 });
    const [ax, ay] = threadPoint(thread, 0.3);
    const [mx, my] = threadPoint(thread, 0.6);
    return '<g class="boil">' + strand(thread, { width: 3 }) +
      hung(thread, 0.8, { length: 34, w: 38, h: 48, fill: PALE, mark: 'pin', sway: 4 }) +
      hung(thread, 0.93, { length: 18, w: 38, h: 48, fill: LILAC, mark: 'calendar', sway: 4 }) +
      seat(asker, ax, ay, 1, { flip: true, motion: sway(0.1, 2) }) +
      seat(memoris, mx, my, 1, { motion: sway(0.6, 2) }) + '</g>';
  };
  const VISIT_TURN = [['next', false, true, 34], ['back', true, true, 5], ['last', false, false, 34], ['ahead', true, false, 5]];
  const FIRST_TURN_AFTER = 16;
  const ORB = 26;
  const ORB_ABOVE = 20;
  const CREST = 42;
  const overhead = (k, x, y, scale, facing) => [x + (k.anchors.head[0] - k.anchors.curl[0]) * scale * facing, y + (k.anchors.head[1] - k.anchors.curl[1] - CREST) * scale - ORB_ABOVE - ORB];
  const sun = ([x, y]) => '<circle cx="' + fix(x) + '" cy="' + fix(y) + '" r="' + ORB + '" fill="' + M.colors.coral + '"/>';
  const moon = ([x, y]) => '<circle cx="' + fix(x) + '" cy="' + fix(y) + '" r="' + ORB + '" fill="' + M.colors.night + '"/>' +
    '<path d="M' + fix(x + 1) + ' ' + fix(y - 15) + 'a15 15 0 1 1 -11 26a12.5 12.5 0 0 0 11 -26Z" fill="' + M.paper + '"/>';
  M.scenes.visits = () => {
    const span = wide.matches ? 1120 : 640;
    const thread = [0, 178, span / 2, wide.matches ? 222 : 206, span, 178];
    const aide = () => keeper({ color: 'amber', prop: 'scarf', mood: 'open', arm: 'wave', ink: 3 });
    const memoris = (back) => keeper({ pose: 'read', color: M.memoris, prop: 'satchel,glasses', arm: 'hold', hold: 'book', back, ink: 3 });
    const [lx, ly] = threadPoint(thread, wide.matches ? 0.07 : 0.12);
    const [rx, ry] = threadPoint(thread, wide.matches ? 0.93 : 0.9);
    const [mx, my] = threadPoint(thread, 0.5);
    const kept = wide.matches
      ? hung(thread, 0.2, { length: 20, w: 38, h: 48, mark: 'face', sway: 4 }) + hung(thread, 0.28, { length: 40, w: 36, h: 46, fill: PALE, mark: 'calendar', sway: 4 }) + hung(thread, 0.36, { length: 18, w: 38, h: 48, mark: 'key', sway: 4 }) +
        hung(thread, 0.62, { length: 34, w: 36, h: 46, fill: LILAC, mark: 'lines', sway: 4 }) + hung(thread, 0.7, { length: 16, w: 38, h: 48, mark: 'face', sway: 4 }) + hung(thread, 0.78, { length: 38, w: 36, h: 46, fill: PALE, mark: 'check', sway: 4 })
      : hung(thread, 0.3, { length: 20, w: 38, h: 48, mark: 'face', sway: 4 }) + hung(thread, 0.7, { length: 30, w: 36, h: 46, fill: PALE, mark: 'calendar', sway: 4 });
    const days = [overhead(aide(), lx, ly, 0.92, -1), overhead(memoris(false), mx, my, 0.96, 0), overhead(aide(), rx, ry, 0.92, 1)];
    const top = Math.floor(Math.min(0, ...days.map((orb) => orb[1] - ORB - 4)));
    return { box: '0 ' + top + ' ' + span + ' ' + (300 - top), svg: sun(days[0]) + moon(days[1]) + sun(days[2]) + '<g class="boil">' + strand(thread, { width: 3 }) + kept +
      seat(aide(), lx, ly, 0.92, { flip: true, motion: sway(0.1, 2) }) +
      VISIT_TURN.map(([face, back, flip], i) => '<g data-face="' + face + '"' + (i ? ' visibility="hidden"' : '') + '>' + seat(memoris(back), mx, my, 0.96, { flip, motion: sway(0.5, 2) }) + '</g>').join('') +
      seat(aide(), rx, ry, 0.92, { motion: sway(0.8, 2) }) + '</g>' };
  };
  const TOGETHER = { phone: 0.62, theirs: 0.36, hung: 0.62, carer: 0.86, size: 1.02 };
  M.scenes.together = () => {
    const thread = M.threshold.thread;
    const held = M.phone({ mood: 'glad', kept: 'key,face' });
    const theirs = keeper({ color: 'coral', mood: 'glad', head: -6, ink: 3 });
    const carer = keeper({ color: 'rose', mood: 'glad', arm: 'point', head: -4, ink: 3 });
    const [tx, ty] = threadPoint(thread, TOGETHER.theirs);
    const [cx, cy] = threadPoint(thread, TOGETHER.carer);
    return { box: M.threshold.box.join(' '), svg: '<g class="boil">' + strand(thread, { width: 3 }) +
      hung(thread, TOGETHER.hung, { length: 22, w: 30, h: 38, fill: PALE, mark: 'face', sway: 4 }) +
      seat(theirs, tx, ty, TOGETHER.size, { motion: sway(0.2, 2) }) +
      seat(carer, cx, cy, TOGETHER.size, { motion: sway(0.6, 2) }) + '</g>' +
      seat(held, thread[0], thread[1], TOGETHER.phone) };
  };
  wide.addEventListener('change', () => M.remount(document.querySelector('[data-scene="visits"]')));
  const FRAME = 1000 / 12;

  const specOf = (text) => {
    const options = {};
    text.split(';').forEach((pair) => {
      const cut = pair.indexOf(':');
      if (cut < 0) return;
      const value = pair.slice(cut + 1).trim();
      options[pair.slice(0, cut).trim()] = value === 'true' ? true : value !== '' && !Number.isNaN(Number(value)) ? Number(value) : value;
    });
    return options;
  };
  const spot = (el, root) => {
    let x = 0;
    let y = 0;
    for (let node = el; node && node !== root; node = node.offsetParent) {
      x += node.offsetLeft;
      y += node.offsetTop;
    }
    return [x, y];
  };
  const gripOf = (held, root, name) => {
    const k = keeper(specOf(held.dataset.keeper));
    const size = Number(held.dataset.size || 1) * (parseFloat(getComputedStyle(held.parentNode).getPropertyValue('--k')) || 1);
    const facing = held.hasAttribute('data-flip') ? -1 : 1;
    const seated = k.anchors[held.dataset.by || k.by] || k.anchors.head;
    const grip = k.anchors[name || 'hand'];
    const [x, y] = spot(held.parentNode, root);
    return [x + (grip[0] - seated[0]) * size * facing, y + (grip[1] - seated[1]) * size];
  };
  const smooth = (t) => t * t * (3 - 2 * t);
  const mix2 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t)];
  const mix = (a, b, t) => a + (b - a) * t;
  const beatOf = (ease) => Math.log(1 - ease) / Math.log(0.8);
  const bezAt = (p, t) => {
    const u = 1 - t;
    return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]);
  };
  const bezY = (p, x) => {
    let low = 0;
    let high = 1;
    for (let i = 0; i < 20; i++) {
      const half = (low + high) / 2;
      if (bezAt(p, half)[0] < x) low = half;
      else high = half;
    }
    return bezAt(p, (low + high) / 2)[1];
  };
  const STITCH = 26;
  const along = (count, at) => Array.from({ length: count + 1 }, (unused, i) => at(i / count));
  const rounded = (points, radius) => {
    let d = 'M' + fix(points[0][0]) + ' ' + fix(points[0][1]);
    for (let i = 1; i < points.length - 1; i++) {
      const [a, b, c] = [points[i - 1], points[i], points[i + 1]];
      const before = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const after = Math.hypot(c[0] - b[0], c[1] - b[1]) || 1;
      const r = Math.min(radius, before / 2, after / 2);
      d += 'L' + fix(b[0] + ((a[0] - b[0]) / before) * r) + ' ' + fix(b[1] + ((a[1] - b[1]) / before) * r) + 'Q' + fix(b[0]) + ' ' + fix(b[1]) + ' ' + fix(b[0] + ((c[0] - b[0]) / after) * r) + ' ' + fix(b[1] + ((c[1] - b[1]) / after) * r);
    }
    const last = points[points.length - 1];
    return d + 'L' + fix(last[0]) + ' ' + fix(last[1]);
  };
  const stringAt = (drop) => {
    const share = parseFloat(getComputedStyle(drop.querySelector('.hang')).getPropertyValue('--at')) || 50;
    return (drop.offsetWidth * share) / 100;
  };
  const show = (spotEl, state) => spotEl.querySelectorAll('[data-state]').forEach((held) => held.classList.toggle('is-on', held.dataset.state === state));

  M.ready(() => {
    document.querySelectorAll('[data-load]').forEach((el) => {
      const section = el.closest('[data-opening]');
      const stage = section.querySelector('.opening__stage');
      const hero = section.querySelector('.opener');
      const copy = hero.querySelector('.opener__copy');
      const art = hero.querySelector('.lead__art');
      const ground = section.querySelector('.opening__ground');
      const title = section.querySelector('.familiar h2');
      const rope = el.querySelector('[data-rope]');
      const rig = el.querySelector('.rig');
      const seatEl = el.querySelector('.spot');
      const states = [...seatEl.querySelectorAll('[data-state]')].filter((held) => !held.dataset.state.endsWith('s'));
      const list = el.querySelector('.load__tags');
      const drops = [...list.children];
      const minis = [...el.querySelectorAll('.mini')];
      const note = el.querySelector('.load__note');
      const MIN_STAGE = 600;
      const MIN_TEASER = 96;
      const RISE_FROM = 0.06;
      const RISE_SPAN = 0.6;
      const FLY_FROM = 0.8;
      const FLY_EVERY = 0.3;
      const FLY_SPAN = 0.26;
      const HOLD = 0.14;
      const NOTE_WAIT = 0.3;
      const HERO_SEAT = [0.55, 0.49];
      const HERO_FAR = [-0.27, 1.054];
      const HERO_BEND = [0.268, 0.84];
      const HERO_SCALE = 1.36 / 560;
      const HERO_MINIS = [137, 206, 275, 344, 413];
      const PILE_TURN = [-5, 4, -7];
      const PILE_SLIP = [[-7, 5], [9, 9], [-12, 13]];
      const DIP = 3;
      const SAY_UNTIL = 0.55;
      const MINI_HOME = 0.78;
      const MINI_CLEAR = 62;
      const MINI_TAIL = 74;
      const MINI_GAP = 40;
      const HEAD_ROOM = 190;
      const STEEP = 132;
      const TITLE_CLEAR = 16;
      const TITLE_FADE = 70;
      const s = { title: [0, 0, 0], pinned: false, pile: false, landed: 0, weight: 0, speed: 0, from: [0, 0], hands: [], mouth: [0, 0], seat: [0, 0], end: [0, 0], xs: [], level: 0, base: 0, per: 0, stitches: 8, px: 0, top: 0, run: 0, H: 0, K: 1, hero: null, free: 0, rests: [], saying: false, flyFrom: 0.8 };
      const stateFor = (count) => (count >= drops.length ? 2 : count >= 2 ? 1 : 0);
      const flowLine = () => {
        const sag = s.base + s.weight * s.per;
        const low = (s.from[1] + s.end[1]) / 2 + sag * SAG_PULL;
        return [s.from, [mix(s.from[0], s.end[0], 1 / 3), mix(s.from[1], low, 2 / 3)], [mix(s.from[0], s.end[0], 2 / 3), mix(s.end[1], low, 2 / 3)], s.end];
      };
      const homeLine = (fin, weight) => {
        const slack = s.base + weight * s.per;
        const knee = s.pile ? 46 : 120;
        return [s.from, [mix(s.from[0], fin[0], 0.5), s.level + slack * 1.3], [fin[0] - knee, s.level + slack], fin];
      };
      function renderFlow() {
        const line = flowLine();
        rope.setAttribute('d', drawn(along(s.stitches, (t) => bezAt(line, t))));
        drops.forEach((drop, i) => {
          drop.style.transform = 'translateY(' + fix(bezY(line, s.xs[i]) - s.level) + 'px)';
        });
      }
      function renderPinned() {
        const at = s.px / s.H;
        const rise = Math.max(s.H - s.px, 0);
        const ridden = within((s.hero.seat[1] - (rise - s.hero.top + s.hero.ride)) / (s.hero.seat[1] - s.seat[1]));
        const e = s.hero.stacked ? ridden : smooth(within((at - RISE_FROM) / RISE_SPAN));
        const k = mix(s.hero.k, 1, e);
        const seat = mix2(s.hero.seat, s.seat, e);
        seat[1] += s.weight * DIP * e;
        rig.style.transform = 'translate(' + fix(seat[0] - s.seat[0]) + 'px,' + fix(seat[1] - s.seat[1]) + 'px) scale(' + k.toFixed(4) + ')';
        const fin = [seat[0] + s.end[0] * k, seat[1] + s.end[1] * k];
        const home = homeLine(fin, s.weight);
        const swing = e < 0.5 ? [mix(s.hero.far[0], home[0][0], e * 2), s.hero.far[1]] : [home[0][0], mix(s.hero.far[1], home[0][1], e * 2 - 1)];
        const line = [swing, mix2([s.hero.far[0] + (2 / 3) * (fin[0] - s.hero.bend[0] - s.hero.far[0]), s.hero.far[1] + (2 / 3) * (s.hero.bend[1] - s.hero.far[1])], home[1], e), mix2([fin[0] - (2 / 3) * s.hero.bend[0], fin[1] + (2 / 3) * (s.hero.bend[1] - fin[1])], home[2], e), fin];
        const points = along(s.stitches, (t) => bezAt(line, t));
        rope.setAttribute('d', drawn(points));
        rope.style.strokeWidth = (2.6 * mix(s.hero.k * s.K, 1, e)).toFixed(2);
        const reach = [0];
        for (let i = points.length - 1; i > 0; i--) reach.push(reach[reach.length - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
        const size = mix(s.hero.k * s.K, MINI_HOME * s.K, e);
        minis.forEach((mini, i) => {
          const far = mix(HERO_MINIS[i] * s.hero.k * s.K, s.rests[Math.min(i, s.rests.length - 1)] || 0, e);
          mini.style.opacity = i < s.rests.length ? '' : (1 - within(e * 1.6)).toFixed(3);
          let n = 1;
          while (n < reach.length - 1 && reach[n] < far) n += 1;
          const share = within((far - reach[n - 1]) / (reach[n] - reach[n - 1] || 1));
          const a = points[points.length - n];
          const b = points[points.length - 1 - n];
          mini.style.transform = 'translate(' + fix(mix(a[0], b[0], share)) + 'px,' + fix(mix(a[1], b[1], share)) + 'px) scale(' + size.toFixed(3) + ')';
        });
        ground.style.transform = 'translateY(' + fix(rise) + 'px)';
        title.style.transform = 'translateY(' + fix(rise) + 'px)';
        title.style.opacity = smooth(within((Math.min(bezY(line, s.title[0]), bezY(line, s.title[1])) - s.title[2] - rise - TITLE_CLEAR) / TITLE_FADE)).toFixed(3);
        hero.style.visibility = rise < 2 ? 'hidden' : '';
        const mouth = [seat[0] + s.mouth[0] * k, seat[1] + s.mouth[1] * k];
        let landed = 0;
        const flights = drops.map((drop, i) => within((at - s.flyFrom - i * FLY_EVERY) / FLY_SPAN));
        if (s.hero.stacked) note.style.opacity = (smooth(within((e - 0.9) / 0.1)) * (1 - within(flights[0] / 0.3))).toFixed(3);
        drops.forEach((drop, i) => {
          const u = flights[i];
          const slot = [s.xs[i], bezY(line, s.xs[i])];
          if (u <= 0) {
            drop.style.opacity = 0;
            drop.style.transform = 'translate(' + fix(mouth[0] - s.xs[i]) + 'px,' + fix(mouth[1] - s.level) + 'px) scale(.08)';
            return;
          }
          if (u >= 1) landed += 1;
          const apex = [(mouth[0] + slot[0]) / 2, Math.min(mouth[1], slot[1]) - 60 - Math.abs(mouth[0] - slot[0]) * 0.2];
          const v = 1 - u;
          const x = v * v * mouth[0] + 2 * v * u * apex[0] + u * u * slot[0];
          const y = v * v * mouth[1] + 2 * v * u * apex[1] + u * u * slot[1];
          let turn = -14 * v;
          let slip = [0, 0];
          if (s.pile) {
            let above = 0;
            for (let j = i + 1; j < drops.length; j++) {
              const cover = smooth(flights[j]);
              turn += PILE_TURN[above] * cover;
              slip = [slip[0] + PILE_SLIP[above][0] * cover, slip[1] + PILE_SLIP[above][1] * cover];
              above += 1;
            }
          }
          drop.style.opacity = within(u / 0.1).toFixed(3);
          drop.style.transform = 'translate(' + fix(x - s.xs[i] + slip[0]) + 'px,' + fix(y - s.level + slip[1]) + 'px) rotate(' + turn.toFixed(2) + 'deg) scale(' + (0.08 + 0.92 * Math.pow(u, 1.25)).toFixed(4) + ')';
        });
        const saying = flights.some((u) => u > 0.01 && u < SAY_UNTIL);
        if (landed !== s.landed || saying !== s.saying) {
          s.landed = landed;
          s.saying = saying;
          show(seatEl, stateFor(landed) + (saying ? 's' : ''));
        }
      }
      function land(count) {
        if (s.pinned) return;
        s.landed = Math.max(s.landed, count);
        show(seatEl, String(stateFor(s.landed)));
        M.wake();
      }
      function clear() {
        [rig, ground, title, hero, note].concat(drops, minis).forEach((node) => {
          node.style.transform = '';
          node.style.opacity = '';
          node.style.visibility = '';
        });
        rope.style.strokeWidth = '';
        ['--rope-y', '--lift', '--pile-x'].forEach((name) => el.style.removeProperty(name));
        section.style.removeProperty('--title-y');
      }
      function measure() {
        const box = el.getBoundingClientRect();
        s.K = parseFloat(getComputedStyle(seatEl).getPropertyValue('--k')) || 1;
        s.level = spot(list, el)[1];
        s.from = [-box.left - 40, s.level - 4];
        s.seat = spot(seatEl, el);
        s.hands = states.map((held) => gripOf(held, el));
        s.xs = drops.map((drop) => spot(drop, el)[0] + stringAt(drop));
      }
      function fitPinned() {
        s.H = stage.offsetHeight;
        s.pile = window.innerWidth < 1200;
        el.classList.toggle('is-pile', s.pile);
        section.classList.toggle('is-pile', s.pile);
        const tall = Math.max(...drops.map((drop) => drop.offsetHeight));
        const K = parseFloat(getComputedStyle(seatEl).getPropertyValue('--k')) || 1;
        const titleY = Math.max(s.H * (s.pile ? 0.09 : 0.11), 70);
        const seatY = s.pile ? titleY + (HEAD_ROOM - 14) * K : Math.max(s.H * 0.27, titleY + 110, (HEAD_ROOM + 34) * K);
        const room = s.H - tall - 22 - seatY - STEEP * K;
        s.base = 8;
        s.per = Math.min(Math.max((room / 1.3 - s.base - DIP * drops.length) / drops.length, 8), s.pile ? 16 : 22);
        const sink = (s.base + s.per * drops.length) * 1.3 + DIP * drops.length;
        const lowest = s.H - tall - sink - 22;
        const ropeY = Math.min(Math.max(s.H * (s.pile ? 0.47 : 0.5), seatY + STEEP * K), lowest);
        if (ropeY < seatY + (STEEP - 24) * K) return false;
        el.style.setProperty('--rope-y', fix(ropeY) + 'px');
        el.style.setProperty('--lift', fix(ropeY - seatY) + 'px');
        section.style.setProperty('--title-y', fix(titleY) + 'px');
        if (s.pile) el.style.setProperty('--pile-x', fix(Math.max((el.offsetWidth - drops[0].offsetWidth) * (el.offsetWidth > 620 ? 0.26 : 0.1), 0)) + 'px');
        measure();
        if (s.pile) s.xs = s.xs.map(() => s.xs[0]);
        drops.forEach((drop, i) => {
          drop.style.setProperty('--ox', fix(stringAt(drop)) + 'px');
          drop.style.zIndex = i + 1;
        });
        const [lx, ly] = spot(el, stage);
        const [ax, ay] = spot(art, stage);
        const [tx, ty] = spot(title, stage);
        const words = document.createRange();
        words.selectNodeContents(title);
        s.title = [tx - lx, tx - lx + Math.min(words.getBoundingClientRect().width, title.offsetWidth), ty - ly + title.offsetHeight];
        const aw = art.offsetWidth;
        const heroSeat = [ax + HERO_SEAT[0] * aw - lx, ay + HERO_SEAT[1] * aw - ly];
        const frameTop = parseFloat(getComputedStyle(hero.querySelector('.opener__frame')).paddingTop) || 0;
        const stacked = ay > spot(copy, stage)[1] + copy.offsetHeight - 10;
        const copyHeight = copy.offsetHeight - (parseFloat(getComputedStyle(copy).paddingBottom) || 0);
        if (frameTop + copyHeight + (stacked ? MIN_TEASER : 0) > s.H || (!stacked && heroSeat[1] + ly > s.H - 24)) return false;
        s.hero = { stacked, top: ly, ride: (HEAD_ROOM + 30) * s.K, k: (HERO_SCALE * aw) / (1.08 * s.K), seat: heroSeat, far: [ax + HERO_FAR[0] * aw - lx, ay + HERO_FAR[1] * aw - ly], bend: [HERO_BEND[0] * aw, ay + HERO_BEND[1] * aw - ly] };
        s.mouth = gripOf(states[0], el, 'tip').map((value, i) => value - s.seat[i]);
        s.hands = s.hands.map((hand) => [hand[0] - s.seat[0], hand[1] - s.seat[1]]);
        const full = homeLine([s.seat[0] + s.hands[2][0], s.seat[1] + s.hands[2][1]], drops.length);
        const edge = s.pile ? s.xs[0] + drops[0].offsetWidth * 0.5 + 18 : s.xs[drops.length - 1] + drops[drops.length - 1].offsetWidth * 0.5 + 18;
        const sample = along(60, (t) => bezAt(full, t));
        s.free = 0;
        for (let i = sample.length - 1; i > 0 && (s.pile ? sample[i - 1][1] < s.level - MINI_CLEAR * s.K : sample[i - 1][0] > edge); i--) s.free += Math.hypot(sample[i][0] - sample[i - 1][0], sample[i][1] - sample[i - 1][1]);
        const tail = MINI_TAIL * s.K;
        const fits = Math.min(Math.max(Math.floor((s.free - tail) / (MINI_GAP * s.K)) + 1, 0), minis.length);
        s.rests = Array.from({ length: fits }, (unused, i) => tail + (fits > 1 ? ((s.free - tail - 8) * i) / (fits - 1) : 0));
        s.stitches = Math.max(Math.round((window.innerWidth + s.H) / STITCH), 12);
        section.classList.toggle('is-stacked', stacked);
        s.flyFrom = stacked ? Math.max(1 - (s.seat[1] + ly - s.hero.ride) / s.H, FLY_FROM) + NOTE_WAIT : FLY_FROM;
        s.run = s.H * (s.flyFrom + FLY_EVERY * (drops.length - 1) + FLY_SPAN + HOLD);
        section.style.setProperty('--run', fix(s.run) + 'px');
        s.top = section.getBoundingClientRect().top + window.scrollY;
        s.px = Math.min(Math.max(window.scrollY - s.top, 0), s.run);
        s.end = s.hands[stateFor(s.landed)].slice();
        return true;
      }
      M.settle(() => {
        clear();
        const wanted = !still.matches && window.innerHeight >= MIN_STAGE;
        document.documentElement.classList.toggle('hauled', wanted);
        s.pinned = wanted && fitPinned();
        if (!s.pinned) {
          document.documentElement.classList.remove('hauled');
          el.classList.remove('is-pile');
          section.classList.remove('is-pile', 'is-stacked');
          clear();
          section.style.removeProperty('--run');
          const column = getComputedStyle(list).flexDirection === 'column';
          measure();
          if (column) s.xs = s.xs.map(() => s.xs[0]);
          s.base = column ? 16 : 22;
          s.per = column ? 21 : 34;
          list.style.setProperty('--give', fix(s.base + s.per * drops.length + 60) + 'px');
          if (still.matches) {
            s.landed = drops.length;
            s.weight = s.landed;
          }
          show(seatEl, String(stateFor(s.landed)));
          s.end = s.hands[stateFor(s.landed)].slice();
          s.stitches = Math.max(Math.round((s.end[0] - s.from[0]) / STITCH), 4);
          renderFlow();
          return;
        }
        renderPinned();
        s.weight = s.landed;
        renderPinned();
      });
      M.follow(({ y, ease }) => {
        const goal = s.hands[stateFor(s.landed)];
        const off = Math.hypot(goal[0] - s.end[0], goal[1] - s.end[1]);
        const target = s.pinned ? Math.min(Math.max(y - s.top, 0), s.run) : s.px;
        if (Math.abs(target - s.px) < 0.3 && Math.abs(s.landed - s.weight) < 0.002 && Math.abs(s.speed) < 0.002 && off < 0.2) return false;
        const beat = beatOf(ease);
        s.px += (target - s.px) * ease;
        s.speed = (s.speed + (s.landed - s.weight) * SPRING_PULL * beat) * Math.pow(SPRING_DRAG, beat);
        s.weight += s.speed * beat;
        s.end = [mix(s.end[0], goal[0], ease), mix(s.end[1], goal[1], ease)];
        if (s.pinned) renderPinned();
        else renderFlow();
        return true;
      });
      const LAND_AFTER = 260;
      const seen = new MutationObserver((records) => {
        records.forEach((record) => {
          const hang = record.target;
          if (!hang.classList.contains('is-in') || hang.landing) return;
          hang.landing = true;
          const wait = parseFloat(hang.style.getPropertyValue('--wait')) || 0;
          setTimeout(() => land(drops.filter((drop) => drop.querySelector('.hang').landing).length), wait * 1000 + LAND_AFTER);
        });
      });
      if (!still.matches) drops.forEach((drop) => seen.observe(drop.querySelector('.hang'), { attributes: true, attributeFilter: ['class'] }));
    });

    document.querySelectorAll('[data-relay]').forEach((el) => {
      const rope = el.querySelector('[data-rope]');
      const carer = el.querySelector('.relay__carer');
      const memoris = el.querySelector('.relay__memoris');
      const keeping = memoris.querySelector('.held');
      const them = el.querySelector('.relay__them');
      const theirs = [...them.querySelectorAll('.held')];
      const yours = el.querySelector('.relay__yours');
      const swimmers = { row: el.querySelector('[data-swim="row"]'), column: el.querySelector('[data-swim="column"]'), rise: el.querySelector('[data-swim="rise"]') };
      const list = el.querySelector('.relay__theirs .relay__tags');
      const drops = [...list.children];
      const COME_UNTIL = 0.42;
      const GIVE_UNTIL = 0.55;
      const CARRY_UNTIL = 0.9;
      const PASS_AT = 0.5;
      const WAIT_BELOW = 104;
      const PASS_HOLD = 0.16;
      const PASS_CLIMB = 0.36;
      const REACH_SHARE = 0.6;
      const TAKE_DOWN = [6, 14];
      const PERCH_ROW = [-26, 44];
      const PERCH_COLUMN = [20, 78];
      const ENTER = [70, 0.6];
      const APPROACH = [-67, 146];
      const ENTER_UNDER = 34;
      const GIVE_HOLD = 380;
      const s = { snouts: {}, swimmer: 'row', enter: [0, 0], themX: 0, top: 0, level: 0, from: [0, 0], right: [0, 0], hold: [0, 0], give: [0, 0], wait: [0, 0], take: [0, 0], fin: [0, 0], perch: [0, 0], snout: [0, 0], xs: [], seatX: 0, slack: 58, knee: 120, column: false, phase: '', p: 0, q: 0, speed: 0, stitches: 8, fall: 1, passAt: 0, since: 0 };
      const phaseOf = (p) => (p < COME_UNTIL ? 'coming' : p < GIVE_UNTIL ? 'giving' : p < CARRY_UNTIL ? 'carrying' : 'keeping');
      const hung = (end, slack, knee) => [s.from, [mix(s.from[0], end[0], 0.5), s.level + slack * 1.3], [end[0] - knee, s.level + slack], end];
      function reachOf(y, height) {
        if (!s.column) return within((y + height * 0.94 - s.top) / (height * 0.66));
        const past = y + height * PASS_AT - s.passAt;
        if (past < -PASS_HOLD * height) return COME_UNTIL * within((past + (PASS_HOLD + PASS_CLIMB) * height) / (PASS_CLIMB * height));
        if (past < 0) return COME_UNTIL + (GIVE_UNTIL - COME_UNTIL) * within((past + PASS_HOLD * height) / (PASS_HOLD * height));
        if (past < s.fall) return GIVE_UNTIL + (CARRY_UNTIL - GIVE_UNTIL) * (past / s.fall);
        return CARRY_UNTIL + (1 - CARRY_UNTIL) * within((past - s.fall) / (0.05 * height));
      }
      function act(phase) {
        if (phase === s.phase) return;
        s.phase = phase;
        show(carer, (phase === 'coming' ? 'held' : phase === 'giving' ? 'giving' : 'free') + (s.column && phase !== 'coming' ? '-down' : ''));
        show(them, phase === 'coming' || phase === 'giving' ? 'before' : 'after');
        keeping.classList.toggle('is-on', phase === 'keeping');
        s.swimmer = s.column ? 'column' : phase === 'coming' ? 'rise' : 'row';
        Object.keys(swimmers).forEach((kind) => swimmers[kind].classList.toggle('is-on', phase !== 'keeping' && kind === s.swimmer));
      }
      function render() {
        const phase = phaseOf(s.p);
        act(phase);
        let line = hung(s.fin, s.slack, s.knee);
        let tip = s.column ? s.take : [s.fin[0] - 16, s.fin[1] + 9];
        if (phase === 'coming' && s.column) tip = mix2(s.enter, s.wait, smooth(within(s.p / COME_UNTIL)));
        if (phase === 'giving' && s.column) tip = mix2(s.wait, s.take, smooth(within((s.p - COME_UNTIL) / ((GIVE_UNTIL - COME_UNTIL) * REACH_SHARE))));
        if (phase === 'coming' && !s.column) tip = mix2(s.enter, [s.fin[0] + APPROACH[0], s.fin[1] + APPROACH[1]], smooth(within(s.p / COME_UNTIL)));
        if (phase === 'carrying' || phase === 'keeping') {
          const along = phase === 'keeping' ? 1 : within((s.p - GIVE_UNTIL) / (CARRY_UNTIL - GIVE_UNTIL));
          const u = s.column ? along : smooth(along);
          const v = 1 - u;
          const bow = [mix(s.take[0], s.perch[0], 0.5) - 36, mix(s.take[1], s.perch[1], 0.42)];
          tip = s.column ? [mix(s.take[0], s.perch[0], smooth(u)), mix(s.take[1], s.perch[1], u)] : [v * v * s.take[0] + 2 * v * u * bow[0] + u * u * s.perch[0], v * v * s.take[1] + 2 * v * u * bow[1] + u * u * s.perch[1]];
          line = hung(tip, s.slack * v, s.knee * v + 8);
          if (phase === 'keeping') {
            const end = mix2(s.perch, s.right, within(s.q));
            line = [s.from, [mix(s.from[0], end[0], 0.34), s.level + 3], [mix(s.from[0], end[0], 0.67), s.level + 3], end];
          }
        }
        rope.setAttribute('d', drawn(along(s.stitches, (t) => bezAt(line, t))));
        drops.forEach((drop, i) => {
          drop.style.transform = 'translateY(' + fix(bezY(line, s.xs[i]) - s.level) + 'px)';
        });
        const sunk = bezY(line, s.seatX) - s.level;
        keeping.style.transform = 'translateY(' + fix(sunk) + 'px)';
        const rides = 'translateY(' + fix(bezY(line, s.themX) - s.level) + 'px)';
        theirs.forEach((held) => {
          held.style.transform = rides;
        });
        const snout = s.snouts[s.swimmer];
        swimmers[s.swimmer].style.transform = 'translate(' + fix(tip[0] - snout[0]) + 'px,' + fix(tip[1] - snout[1]) + 'px)';
      }
      M.settle(() => {
        s.column = getComputedStyle(list).flexDirection === 'column';
        const box = el.getBoundingClientRect();
        s.level = spot(list, el)[1];
        s.top = box.top + window.scrollY + s.level;
        s.from = [-box.left - 40, s.level];
        s.right = [el.offsetWidth + (window.innerWidth - box.right) + 40, s.level];
        s.hold = gripOf(carer.querySelector('[data-state="held"]'), el);
        s.give = gripOf(carer.querySelector('[data-state="' + (s.column ? 'giving-down' : 'giving') + '"]'), el);
        s.slack = s.column ? 30 : 58;
        s.knee = s.column ? 14 : 120;
        s.xs = drops.map((drop) => spot(drop, el)[0] + stringAt(drop));
        memoris.style.left = s.column ? '' : fix(s.xs[drops.length - 1]) + 'px';
        them.style.left = fix(s.xs[0]) + 'px';
        s.themX = spot(them, el)[0];
        s.enter = [el.offsetWidth + (window.innerWidth - box.right) + ENTER[0], mix(spot(yours, el)[1], s.level, ENTER[1])];
        s.seatX = spot(memoris, el)[0];
        s.perch = s.column ? [s.seatX - PERCH_COLUMN[0], s.level - PERCH_COLUMN[1]] : [s.seatX - PERCH_ROW[0], s.level - PERCH_ROW[1]];
        const K = parseFloat(getComputedStyle(carer).getPropertyValue('--k')) || 1;
        s.wait = [s.hold[0] + 6, s.hold[1] + WAIT_BELOW * K];
        s.take = s.column ? [s.give[0] + TAKE_DOWN[0], s.give[1] + TAKE_DOWN[1]] : [s.give[0] - 16, s.give[1] + 9];
        s.fall = s.perch[1] - s.take[1];
        s.passAt = box.top + window.scrollY + s.take[1];
        if (s.column) s.enter = [s.enter[0], s.wait[1] + ENTER_UNDER];
        Object.keys(swimmers).forEach((kind) => {
          const swimmer = swimmers[kind];
          const swim = keeper(specOf(swimmer.dataset.keeper));
          const size = Number(swimmer.dataset.size || 1);
          const facing = swimmer.hasAttribute('data-flip') ? 1 : -1;
          s.snouts[kind] = [(swim.anchors.head[0] - swim.anchors.tip[0]) * size * facing, (swim.anchors.tip[1] - swim.anchors.head[1]) * size];
        });
        s.stitches = Math.max(Math.round((s.right[0] - s.from[0]) / STITCH), 4);
        if (s.column) s.xs = s.xs.map(() => s.xs[0]);
        if (still.matches) {
          s.p = 1;
          s.q = 1;
        }
        s.phase = '';
        s.fin = (phaseOf(s.p) === 'coming' ? s.hold : s.give).slice();
        render();
      });
      M.follow(({ y, height, ease }) => {
        const wanted = reachOf(y, height);
        const now = performance.now();
        if (wanted < COME_UNTIL) s.since = 0;
        else if (!s.since && s.p >= COME_UNTIL) s.since = now;
        const holding = wanted >= GIVE_UNTIL && s.p < GIVE_UNTIL && (!s.since || now - s.since < GIVE_HOLD);
        const reach = holding ? GIVE_UNTIL - 0.002 : wanted;
        const goal = phaseOf(s.p) === 'keeping' ? 1 : 0;
        const hand = phaseOf(s.p) === 'coming' ? s.hold : s.give;
        const off = Math.hypot(hand[0] - s.fin[0], hand[1] - s.fin[1]);
        if (!holding && Math.abs(reach - s.p) <= 0.0004 && Math.abs(goal - s.q) <= 0.0005 && Math.abs(s.speed) <= 0.0005 && off < 0.2) return false;
        const beat = beatOf(ease);
        s.p += (reach - s.p) * ease;
        s.speed = (s.speed + (goal - s.q) * SPRING_PULL * beat) * Math.pow(SPRING_DRAG, beat);
        s.q += s.speed * beat;
        s.fin = [mix(s.fin[0], hand[0], ease), mix(s.fin[1], hand[1], ease)];
        render();
        return true;
      });
    });

    document.querySelectorAll('[data-scene="visits"]').forEach((svg) => {
      const turn = { seen: false, running: false, last: 0, beat: VISIT_TURN[0][3] - FIRST_TURN_AFTER, at: 0 };
      const face = () => svg.querySelectorAll('[data-face]').forEach((side) => side.setAttribute('visibility', side.dataset.face === VISIT_TURN[turn.at][0] ? 'visible' : 'hidden'));
      function beat(now) {
        if (!turn.seen) {
          turn.running = false;
          return;
        }
        if (now - turn.last >= FRAME) {
          turn.last = now;
          turn.beat += 1;
          if (turn.beat >= VISIT_TURN[turn.at][3]) {
            turn.beat = 0;
            turn.at = (turn.at + 1) % VISIT_TURN.length;
            face();
          }
        }
        requestAnimationFrame(beat);
      }
      wide.addEventListener('change', face);
      if (!still.matches) new IntersectionObserver((entries) => {
        turn.seen = entries[0].isIntersecting;
        if (!turn.seen || turn.running) return;
        turn.running = true;
        face();
        requestAnimationFrame(beat);
      }, { rootMargin: '10% 0px' }).observe(svg);
    });

    document.querySelectorAll('[data-fork]').forEach((el) => {
      const yarn = el.querySelector('.yarn');
      const boxOf = (name) => {
        const node = el.querySelector('[data-node="' + name + '"]');
        const [x, y] = spot(node, el);
        return { x, y, w: node.offsetWidth, h: node.offsetHeight };
      };
      const ways = { yes: el.querySelector('.fork__way--yes'), no: el.querySelector('.fork__way--no') };
      const put = (flag, x, y) => {
        flag.style.left = fix(x) + 'px';
        flag.style.top = fix(y) + 'px';
      };
      const minis = [...el.querySelectorAll('.fork__mini')];
      const MINI_AT = [0.78, 0.5, 0.2];
      const MINI_IN = 34;
      const MINI_EVERY = 38;
      const LANE = 12;
      const WAY_UP = 44;
      const TURN = 16;
      M.settle(() => {
        const start = boxOf('start');
        const together = boxOf('together');
        const wait = boxOf('wait');
        const clinician = boxOf('clinician');
        const box = el.getBoundingClientRect();
        const left = -box.left - 40;
        const right = el.offsetWidth + (window.innerWidth - box.right) + 40;
        const knots = (list) => list.map((at) => '<circle class="knot" cx="' + fix(at[0]) + '" cy="' + fix(at[1]) + '" r="5"/>').join('');
        if (getComputedStyle(el).display !== 'grid') {
          const own = boxOf('own');
          const near = -LANE;
          const inner = el.offsetWidth + LANE - 8;
          const outer = el.offsetWidth + LANE + 2;
          const on = [[left, start.y], [outer, start.y], [outer, together.y], [near, together.y], [near, own.y], [right, own.y]];
          const back = [[inner, start.y], [inner, wait.y], [near, wait.y], [near, start.y]];
          yarn.innerHTML = '<path d="' + drawnPath(rounded(on, TURN)) + '"/><path d="' + drawnPath(rounded(back, TURN)) + '"/>' + knots([[inner, start.y], [near, start.y]]);
          minis.forEach((mini, i) => put(mini, el.offsetWidth - MINI_IN - i * MINI_EVERY, wait.y));
          el.querySelector('[data-node="clinician"]').style.setProperty('--lift', fix(wait.y - clinician.y) + 'px');
          put(ways.no, inner + 8, wait.y - WAY_UP);
          put(ways.yes, outer + 6, together.y - WAY_UP);
          return;
        }
        const split = [start.x + start.w + 26, start.y];
        const join = [start.x - 40, start.y];
        const yesIn = together.x - 10;
        const noIn = wait.x - 10;
        const turn = wait.x + wait.w + 30;
        const back = clinician.y;
        const swing = ((back - wait.y) / 2) * 1.33;
        const branch = (to, y) => 'M' + fix(split[0]) + ' ' + fix(split[1]) + 'C' + fix(mix(split[0], to, 0.62)) + ' ' + fix(split[1]) + ' ' + fix(mix(split[0], to, 0.38)) + ' ' + fix(y) + ' ' + fix(to) + ' ' + fix(y);
        const loop = branch(noIn, wait.y) + 'H' + fix(turn) + 'C' + fix(turn + swing) + ' ' + fix(wait.y) + ' ' + fix(turn + swing) + ' ' + fix(back) + ' ' + fix(turn) + ' ' + fix(back) +
          'H' + fix(join[0] + 40) + 'C' + fix(join[0] - 80) + ' ' + fix(back) + ' ' + fix(join[0] - 80) + ' ' + fix(join[1]) + ' ' + fix(join[0] + 6) + ' ' + fix(join[1]);
        yarn.innerHTML = '<path d="' + drawnPath('M' + fix(left) + ' ' + fix(start.y) + 'H' + fix(split[0])) + '"/><path d="' + drawnPath(branch(yesIn, together.y) + 'H' + fix(right)) + '"/><path d="' + drawnPath(loop) + '"/>' +
          knots([split, [join[0] + 6, join[1]]]);
        minis.forEach((mini, i) => put(mini, start.x + start.w * MINI_AT[i], back));
        put(ways.yes, mix(split[0], yesIn, 0.5), mix(split[1], together.y, 0.5));
        put(ways.no, mix(split[0], noIn, 0.5), mix(split[1], wait.y, 0.5));
      });
    });

    document.querySelectorAll('[data-quarter]').forEach((el) => {
      const yarn = el.querySelector('.yarn');
      const past = el.querySelector('.quarter__past');
      const needle = el.querySelector('.quarter__hand i');
      const rider = el.querySelector('.quarter__hand .held');
      const steps = el.querySelector('.quarter__steps');
      const drops = [...steps.children];
      const hangs = drops.map((drop) => drop.querySelector('.hang'));
      const strings = hangs.map((hang) => parseFloat(hang.style.getPropertyValue('--string')) || 48);
      const TOTAL = 15;
      const MINUTES = [0.8, 5, 8.7, 11.4];
      const RIDER_OUT = 60;
      const RIDER_TURN = 90;
      const RIDER_LAST = 136;
      const KEEP_CLEAR = [[24, 16], [24, 30], [24, 45], [60, 60], [Infinity, null]];
      const LAST_MARK = 85.6;
      const LABEL_BOX = [62, 13];
      const FOOT = 64;
      const FLAT_RIDE = [6, 74];
      const FLAT_HEAD = 74;
      const RIDER_BOX = [-108, -38, 50, 124];
      const RIDER_PARTS = [[-46, -38, 50, 40], [-80, 20, 6, 96], [-116, 62, -38, 136]];
      const RIDER_GAP = 14;
      const RIDER_MORE = 72;
      const MORE_STEP = 4;
      const MORE_OVER = 18;
      const HANG_AFTER = 3;
      const TAG_GAP = 18;
      const ROUND_INSET = 146;
      const LEFT_OUT = 8;
      const ROUND_FROM = 780;
      const UNDER = 44;
      const WIDE_FROM = 600;
      const STRING_STEP = 12;
      const STRING_MORE = 240;
      const TURN_STEP = 0.75;
      const SLIDE_COST = 12;
      const CORD_GAP = 10;
      const SIDE_COST = 4;
      const LAST_TURN = 84;
      const SIDES = [[44, 70], [46, 30, 70], [78, 86, 50], [86, 74, 50]];
      const s = { R: 0, flat: false, top: 0, span: 1, from: 0.62, p: 0, turns: [], keys: [[0, 0]], wide: false, rest: RIDER_TURN, more: 0 };
      function render() {
        const turn = s.p * 90;
        past.style.transform = 'rotate(' + fix(turn - 90) + 'deg)';
        needle.style.transform = 'rotate(' + fix(turn - 90) + 'deg)';
        const ride = rad(s.flat ? mix(s.wide ? 0 : FLAT_RIDE[0], FLAT_RIDE[1], s.p) : s.p * s.rest);
        const out = s.R + (s.flat ? 30 : RIDER_OUT + s.more * smooth(within((turn - RIDER_TURN + MORE_OVER) / MORE_OVER)));
        rider.style.transform = 'translate(' + fix(Math.sin(ride) * out) + 'px,' + fix(-Math.cos(ride) * out) + 'px)';
        if (!s.flat) hangs.forEach((hang, i) => {
          if (s.p * s.rest >= s.turns[i] + HANG_AFTER) hang.classList.add('is-in');
        });
      }
      function minuteAt(y) {
        const keys = s.keys;
        if (y <= keys[0][0]) return 0;
        for (let i = 1; i < keys.length; i++) {
          if (y < keys[i][0]) return mix(keys[i - 1][1], keys[i][1], (y - keys[i - 1][0]) / Math.max(keys[i][0] - keys[i - 1][0], 1));
        }
        return TOTAL;
      }
      function layout() {
        s.flat = el.classList.contains('is-flat');
        const w = el.offsetWidth;
        s.wide = s.flat && w >= WIDE_FROM;
        el.classList.toggle('is-wide', s.wide);
        const R = s.wide ? Math.min(w * 0.42, window.innerHeight * 0.55, 460) : s.flat ? Math.min(w * 0.8, 420, window.innerHeight * 0.36) : Math.min(w * 0.66, 760);
        const cx = s.flat ? Math.min(w * 0.04, 30) : Math.max(w * 0.07, ROUND_INSET);
        const cy = R + (s.wide ? 40 : s.flat ? FLAT_HEAD : 46);
        s.R = R;
        el.style.setProperty('--R', fix(R) + 'px');
        el.style.setProperty('--cx', fix(cx) + 'px');
        el.style.setProperty('--cy', fix(cy) + 'px');
        el.style.setProperty('--left', fix(el.getBoundingClientRect().left) + 'px');
        let marks = '<path d="' + drawnPath('M' + fix(cx) + ' ' + fix(cy - R) + 'A' + fix(R) + ' ' + fix(R) + ' 0 0 1 ' + fix(cx + R) + ' ' + fix(cy)) + '"/>';
        for (let minute = 0; minute <= TOTAL; minute++) {
          const a = rad((minute / TOTAL) * 90);
          const inner = R - (minute % 5 ? 12 : 24);
          marks += '<path d="M' + fix(cx + Math.sin(a) * (R - 4)) + ' ' + fix(cy - Math.cos(a) * (R - 4)) + 'L' + fix(cx + Math.sin(a) * inner) + ' ' + fix(cy - Math.cos(a) * inner) + '" stroke-width="' + (minute % 5 ? 1.8 : 2.6) + '"/>';
          const last = minute === TOTAL;
          if (minute % 5 === 0 && last && !s.flat) marks += '<text x="' + fix(cx + Math.sin(rad(LAST_MARK)) * (R + 24)) + '" y="' + fix(cy - Math.cos(rad(LAST_MARK)) * (R + 24) + 5) + '" text-anchor="start">' + minute + ' min</text>';
          else if (minute % 5 === 0) marks += '<text x="' + fix(cx + Math.sin(a) * (R + (s.flat ? 14 : 24))) + '" y="' + fix(cy - Math.cos(a) * (R + (s.flat ? 14 : 24)) + (last ? -8 : 5)) + '" text-anchor="' + (minute ? 'start' : 'middle') + '">' + minute + (last ? ' min' : '') + '</text>';
        }
        yarn.innerHTML = marks;
        const pairBox = el.querySelector('.quarter__pair');
        const [pairX, pairY] = spot(pairBox, el);
        const riderSize = Number(rider.dataset.size || 1);
        const partAt = (part, turn, more) => part.map((edge, i) => (i % 2 ? cy - Math.cos(rad(turn)) * (R + RIDER_OUT + more) : cx + Math.sin(rad(turn)) * (R + RIDER_OUT + more)) + edge * riderSize);
        const riderAt = (turn) => partAt(RIDER_BOX, turn, 0);
        const pairPlace = [pairX, pairY - R * 0.27, pairX + pairBox.offsetWidth, pairY + 10];
        const lastX = cx + Math.sin(rad(LAST_MARK)) * (R + 24);
        const lastY = cy - Math.cos(rad(LAST_MARK)) * (R + 24) + 5;
        const lastLabel = [lastX, lastY - LABEL_BOX[1], lastX + LABEL_BOX[0], lastY + 3];
        const hits = (a, b, gap) => a[0] < b[2] + gap && a[2] > b[0] - gap && a[1] < b[3] + gap && a[3] > b[1] - gap;
        let lowest = 0;
        let fitted = true;
        hangs.forEach((hang, i) => hang.style.setProperty('--string', strings[i] + 'px'));
        if (s.flat) drops.forEach((drop) => {
          drop.style.left = '';
          drop.style.top = '';
          drop.style.removeProperty('--at');
        });
        if (!s.flat) {
          const sizes = drops.map((drop) => [drop.offsetWidth, drop.offsetHeight]);
          const fit = (i, share, taken, limit, rim) => {
            const [wide, tall] = sizes[i];
            const at = (wide * share) / 100;
            const first = (MINUTES[i] / TOTAL) * 90;
            let best = null;
            for (let turn = first; turn <= LAST_TURN; turn += TURN_STEP) {
              const x = cx + Math.sin(rad(turn)) * R;
              const y = cy - Math.cos(rad(turn)) * R;
              if (x - at < -LEFT_OUT || x - at + wide >= w) continue;
              for (let more = 0; more <= STRING_MORE; more += STRING_STEP) {
                const cost = (turn - first) * SLIDE_COST + more;
                if (cost >= (best ? best.cost : limit)) break;
                const body = [x - at, y + strings[i] + more, x - at + wide, y + tall + more];
                if (Math.hypot(body[2] - cx, cy - body[1]) > R + rim) continue;
                const cord = [x - 2, y, x + 2, y + strings[i] + more];
                if (taken.some((other) => hits(body, other, TAG_GAP) || hits(cord, other, CORD_GAP))) continue;
                best = { turn, x, y, at, share, body, more, cost };
                break;
              }
            }
            return best;
          };
          let chosen = null;
          const walk = (i, taken, picks, total, rim) => {
            if (i === drops.length) {
              chosen = { picks, total };
              return;
            }
            SIDES[i].forEach((share, order) => {
              const pick = fit(i, share, taken, (chosen ? chosen.total : Infinity) - total - order * SIDE_COST, rim);
              if (pick) walk(i + 1, taken.concat([pick.body]), picks.concat([pick]), total + pick.cost + order * SIDE_COST, rim);
            });
          };
          let arrives = true;
          KEEP_CLEAR.some(([rim, core]) => {
            const arrival = riderAt(RIDER_TURN);
            arrival[0] += core || 0;
            arrives = core !== null;
            walk(0, arrives ? [pairPlace, lastLabel, arrival] : [pairPlace, lastLabel], [], 0, rim);
            return Boolean(chosen);
          });
          fitted = Boolean(chosen);
          s.rest = RIDER_TURN;
          const bodies = chosen ? chosen.picks.map((pick) => pick.body) : [];
          const clear = (turn, more) => !bodies.some((body) => RIDER_PARTS.some((part) => hits(partAt(part, turn, more), body, RIDER_GAP)));
          s.more = 0;
          while (s.more < RIDER_MORE && !clear(RIDER_TURN, s.more)) s.more += MORE_STEP;
          if (!clear(RIDER_TURN, s.more)) {
            s.more = 0;
            while (s.rest < RIDER_LAST && !clear(s.rest, 0)) s.rest += TURN_STEP;
          }
          if (chosen) chosen.picks.forEach((pick, i) => {
            hangs[i].style.setProperty('--string', fix(strings[i] + pick.more) + 'px');
            s.turns[i] = pick.turn;
            lowest = Math.max(lowest, pick.body[3] - cy);
            drops[i].style.setProperty('--at', pick.share + '%');
            drops[i].style.left = fix(pick.x - pick.at) + 'px';
            drops[i].style.top = fix(pick.y) + 'px';
          });
        }
        if (!s.flat) el.style.setProperty('--below', fix(Math.max(lowest + FOOT, -Math.cos(rad(s.rest)) * (R + RIDER_OUT) + RIDER_BOX[3] * riderSize + FOOT)) + 'px');
        const top = el.getBoundingClientRect().top + window.scrollY;
        s.top = top + cy - R;
        s.from = 0.66;
        s.span = R * 0.92;
        s.keys = [[top - window.innerHeight * 0.6, 0]].concat(drops.map((drop, i) => [top + spot(drop, el)[1] - (s.wide ? window.innerHeight * 0.5 : cy + UNDER), MINUTES[i]]), [[top + el.offsetHeight - (s.wide ? window.innerHeight * 0.62 : cy + window.innerHeight * 0.45), TOTAL]]);
        return fitted;
      }
      M.settle(() => {
        el.classList.toggle('is-flat', window.innerWidth < ROUND_FROM);
        if (!layout()) {
          el.classList.add('is-flat');
          layout();
        }
        if (still.matches) {
          s.p = 1;
          hangs.forEach((hang) => hang.classList.add('is-in'));
        }
        render();
      });
      M.follow(({ y, height, ease }) => {
        const goal = s.flat ? minuteAt(y) / TOTAL : within((y + height * s.from - s.top) / s.span);
        if (Math.abs(goal - s.p) <= 0.0004) return false;
        s.p += (goal - s.p) * ease;
        render();
        return true;
      });
      const inView = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && s.flat) entry.target.classList.add('is-in');
        });
      }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
      hangs.forEach((hang) => inView.observe(hang));
    });

    document.querySelectorAll('[data-wall]').forEach((el) => {
      const yarn = el.querySelector('.yarn');
      const from = el.querySelector('[data-from]');
      const to = el.querySelector('[data-to]');
      const courier = el.querySelector('.wall__courier');
      const theirs = el.querySelector('.wall__theirs');
      const head = document.querySelector('.soon__head');
      yarn.innerHTML = '<path stroke-dasharray="1 12"/>';
      const path = yarn.firstChild;
      const SET_OFF = 0.16;
      const ARRIVE_SIDE = 0.78;
      const STOP_SHORT = 84;
      const s = { top: 0, length: 0, p: 0, until: ARRIVE_SIDE };
      const bodyOf = (hang) => {
        const [x, y] = spot(hang, el);
        const string = parseFloat(getComputedStyle(hang).paddingTop) || 0;
        return { x, y: y + string, w: hang.offsetWidth, h: hang.offsetHeight - string };
      };
      function render() {
        const eased = s.p * s.p * (3 - 2 * s.p);
        const at = path.getPointAtLength(s.length * mix(SET_OFF, s.until, eased));
        courier.style.transform = 'translate(' + fix(at.x) + 'px,' + fix(at.y - 34) + 'px)';
        if (s.p > 0.9) to.classList.add('is-in');
      }
      M.settle(() => {
        const sideBySide = getComputedStyle(el).gridTemplateColumns.split(' ').length > 1;
        theirs.style.setProperty('--rise', sideBySide ? fix(head.offsetHeight) + 'px' : '0px');
        el.parentNode.style.setProperty('--wall-x', fix(el.getBoundingClientRect().left + spot(theirs, el)[0]) + 'px');
        const a = bodyOf(from);
        const b = bodyOf(to);
        const out = sideBySide ? [a.x + a.w + 4, a.y + a.h * 0.5] : [a.x + a.w * 0.5, a.y + a.h + 4];
        const into = sideBySide ? [b.x - 4, b.y + b.h * 0.5] : [b.x - 6, b.y + b.h * 0.34];
        const d = sideBySide
          ? 'M' + fix(out[0]) + ' ' + fix(out[1]) + 'C' + fix(mix(out[0], into[0], 0.4)) + ' ' + fix(out[1] + 70) + ' ' + fix(mix(out[0], into[0], 0.6)) + ' ' + fix(into[1] + 70) + ' ' + fix(into[0]) + ' ' + fix(into[1])
          : 'M' + fix(out[0]) + ' ' + fix(out[1]) + 'C' + fix(out[0]) + ' ' + fix(mix(out[1], into[1], 0.62)) + ' ' + fix(into[0] - 56) + ' ' + fix(into[1] - 96) + ' ' + fix(into[0]) + ' ' + fix(into[1]);
        path.setAttribute('d', d);
        s.length = path.getTotalLength();
        s.until = sideBySide ? ARRIVE_SIDE : 1 - STOP_SHORT / Math.max(s.length, STOP_SHORT * 2);
        s.top = el.getBoundingClientRect().top + window.scrollY + a.y;
        if (still.matches) s.p = 1;
        render();
      });
      M.follow(({ y, height, ease }) => {
        const goal = within((y + height * 0.72 - s.top) / (height * 0.42));
        if (Math.abs(goal - s.p) <= 0.0004) return false;
        s.p += (goal - s.p) * ease;
        render();
        return true;
      });
    });
  });
})();
