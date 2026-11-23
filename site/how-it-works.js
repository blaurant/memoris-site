(() => {
  const M = window.Memoris;
  const { fix, within } = M.util;
  const { keeper, seat, hung, strand, threadPoint, sway, bay } = M;
  const colors = M.colors;
  const root = document.documentElement;
  const still = M.still;
  const wide = window.matchMedia('(min-width: 900px)');
  const sideBySide = window.matchMedia('(min-width: 1000px)');
  const INK = M.ink;
  const PALE = colors['amber-pale'];
  const MINT = colors.mint;
  const LILAC = colors.lilac;
  const DIM = colors['night-deep'];
  const MIN_PAN_WIDTH = 900;
  const MIN_PAN_HEIGHT = 600;
  const roomy = () => !still.matches && window.innerWidth >= MIN_PAN_WIDTH && window.innerHeight >= MIN_PAN_HEIGHT;
  const stage = { mode: still.matches ? 'plain' : roomy() ? 'pan' : 'ride' };
  const cast = () => stage.mode !== 'ride';
  const laidOut = () => (stage.mode === 'pan' ? 'pan' : stage.mode === 'plain' && sideBySide.matches ? 'row' : 'tight');

  const FAR = 4000;
  const head = (wall, top, bottom, open) => (open === 'left' ? bay({ x: wall - FAR, y: top, w: FAR, h: bottom - top, side: 'right' }) : bay({ x: wall, y: top, w: FAR, h: bottom - top }));
  const span = (x1, y1, x2, y2, sag) => [x1, y1, (x1 + x2) / 2, (y1 + y2) / 2 + sag * 2, x2, y2];
  const along = (thread, x) => (x - thread[0]) / (thread[4] - thread[0]);
  const onThread = (thread, x) => [x, threadPoint(thread, along(thread, x))[1]];
  const shifted = (thread, by) => thread.map((n, i) => (i % 2 ? n : n + by));
  const stretched = (thread, from, until) => {
    const blend = (a, b, c) => (1 - from) * (1 - until) * a + ((1 - from) * until + from * (1 - until)) * b + from * until * c;
    return [...threadPoint(thread, from), blend(thread[0], thread[2], thread[4]), blend(thread[1], thread[3], thread[5]), ...threadPoint(thread, until)];
  };
  const RUSH = [[16, 34, 30], [28, 50, 38], [18, 66, 24]];
  const rush = (x, y, flip) => '<g class="cycle" data-loop="18" data-every="2" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round">' +
    RUSH.map(([back, down, long]) => '<path d="M' + fix(x + (flip ? back : -back - long)) + ' ' + fix(y + down) + 'h' + long + '"/>').join('') + '</g>';

  const WIDE = [900, 560];
  const STACK = [560, 520];
  const TALL = [560, 560];
  const AWAY = 1500;
  const SAID = { length: 26, w: 42, h: 52, mark: 'lines', sway: 5 };
  const KEPT_TAG = [34, 42];
  const TIE = keeper({ pose: 'tie' }).anchors;
  const ACROSS = span(-AWAY, 300, TALL[0] + AWAY, 300, 6);
  const KEEP = {
    pan: { box: WIDE, at: [336, 322], size: 1.4,
      kept: [[520, 'calendar', 22], [604, 'face', 40, PALE], [694, 'key', 18], [786, 'book', 32, LILAC]],
      shelves: [
        { line: span(476, 150, 884, 136, 9), tags: [[0.08, 'photo', 16], [0.27, 'heart', 34, PALE], [0.46, 'lines', 20, LILAC], [0.66, 'pill', 38], [0.86, 'star', 18, PALE]] },
        { line: span(506, 446, 866, 436, 7), tags: [[0.1, 'lines', 30], [0.34, 'glass', 16, LILAC], [0.6, 'face', 34], [0.86, 'check', 20, PALE]] }
      ] },
    tight: { box: TALL, at: onThread(ACROSS, 196), size: 1.3, flip: true, thread: ACROSS,
      kept: [[384, 'calendar', 22], [452, 'face', 40, PALE], [522, 'key', 18]],
      shelves: [
        { line: span(20, 100, 214, 92, 6), tags: [[0.14, 'photo', 16], [0.5, 'heart', 30, PALE], [0.86, 'lines', 18, LILAC]] },
        { line: span(64, 452, 520, 440, 8), tags: [[0.08, 'book', 28, LILAC], [0.3, 'lines', 16], [0.52, 'pill', 32, LILAC], [0.74, 'star', 18, PALE], [0.94, 'glass', 30]] }
      ] },
    row: { box: TALL, at: [206, 320], size: 1.3,
      kept: [[352, 'calendar', 22], [428, 'face', 40, PALE], [506, 'key', 18]],
      shelves: [
        { line: span(318, 156, 548, 146, 6), tags: [[0.12, 'photo', 16], [0.5, 'heart', 32, PALE], [0.88, 'lines', 20, LILAC]] },
        { line: span(332, 448, 540, 440, 5), tags: [[0.12, 'pill', 30], [0.5, 'star', 16, PALE], [0.88, 'glass', 28, LILAC]] }
      ] }
  };
  const into = (c, from) => [from + c.at[0], c.at[1]];
  const outOf = (c, back) => [c.at[0] - back, c.at[1]];
  const knotOf = (c) => [c.at[0] + (TIE.hand[0] - TIE.curl[0]) * c.size * (c.flip ? -1 : 1), c.at[1] + (TIE.hand[1] - TIE.curl[1]) * c.size];
  const TELL = {
    pan: { box: WIDE, thread: span(-700, 304, ...into(KEEP.pan, WIDE[0]), 4), wall: 404, top: 10, bottom: 548, keeper: 196, size: 1.4, tags: [540, 652], said: 852 },
    tight: { box: STACK, thread: span(-AWAY, 306, STACK[0] + AWAY, 306, 6), wall: 300, top: 12, bottom: 500, keeper: 140, size: 1.3, tags: [440, 516], said: 360 },
    row: { box: TALL, thread: span(-AWAY, 316, ...into(KEEP.row, TALL[0]), 2), wall: 300, top: 12, bottom: 500, keeper: 140, size: 1.3, tags: [392, 462], said: 590 }
  };
  const ANSWER = {
    pan: { box: WIDE, thread: span(...outOf(KEEP.pan, WIDE[0]), 1700, 304, 4), wall: 430, top: 10, bottom: 548, open: 'right', keeper: 640, size: 1.4, tags: [806, 872], said: 236 },
    tight: { box: STACK, thread: span(-AWAY, 306, STACK[0] + AWAY, 306, 6), wall: 318, top: 12, bottom: 500, open: 'left', keeper: 196, size: 1.3, tags: [22, 70], said: 392, land: 288 },
    row: { box: TALL, thread: span(...outOf(KEEP.row, TALL[0]), AWAY, 316, 2), wall: 250, top: 12, bottom: 500, open: 'right', keeper: 400, size: 1.3, tags: [506, 556], said: 60 }
  };
  const WAY = {
    boxes: [TELL.tight.box, KEEP.tight.box, ANSWER.tight.box],
    start: onThread(TELL.tight.thread, TELL.tight.said),
    hang: knotOf(KEEP.tight),
    end: onThread(ANSWER.tight.thread, ANSWER.tight.land)
  };

  M.scenes.tell = () => {
    const c = TELL[laidOut()];
    const yours = keeper({ color: 'coral', mood: 'saying', marks: 'say', arm: 'hold', hold: 'pencil', head: -6, ink: 3 });
    const on = (x) => along(c.thread, x);
    const [kx, ky] = threadPoint(c.thread, on(c.keeper));
    const [sx, sy] = threadPoint(c.thread, on(c.said));
    return { box: '0 0 ' + c.box.join(' '), svg: head(c.wall, c.top, c.bottom, 'left') +
      '<g class="boil">' + strand(c.thread) +
      hung(c.thread, on(c.tags[0]), { length: 20, w: 40, h: 50, mark: 'lines', sway: 4 }) +
      hung(c.thread, on(c.tags[1]), { length: 32, w: 44, h: 50, fill: PALE, mark: 'photo', sway: 4 }) +
      (cast() ? hung(c.thread, on(c.said), SAID) + rush(sx, sy, false) : '') +
      seat(yours, kx, ky, c.size, { flip: true, motion: sway(0.2, 1.8) }) + '</g>' };
  };

  M.scenes.keep = () => {
    const layout = laidOut();
    const c = KEEP[layout];
    const onward = c.thread || shifted(ANSWER[layout].thread, c.box[0]);
    const tying = cast() ? { mark: SAID.mark, length: SAID.length / c.size, w: SAID.w / c.size, h: SAID.h / c.size } : null;
    const memoris = keeper({ pose: 'tie', color: M.memoris, prop: 'satchel', hold: tying, ink: 3 });
    const tags = (thread, list, at) => list.map(([where, mark, length, fill]) => hung(thread, at(where), { mark, length, w: KEPT_TAG[0], h: KEPT_TAG[1], fill: fill || M.card, sway: 4 })).join('');
    return { box: '0 0 ' + c.box.join(' '), svg: '<g class="boil">' + (c.thread ? strand(c.thread) : '') +
      c.shelves.map((shelf) => strand(shelf.line, { width: 3 }) + tags(shelf.line, shelf.tags, (t) => t)).join('') +
      tags(onward, c.kept, (x) => along(onward, x)) +
      seat(memoris, c.at[0], c.at[1], c.size, { flip: c.flip, motion: sway(0.1, 1.4) }) + '</g>' };
  };

  M.scenes.answer = () => {
    const c = ANSWER[laidOut()];
    const inward = c.open === 'left';
    const yours = keeper({ color: 'coral', mood: 'glad', arm: 'wave', head: inward ? -8 : 8, ink: 3 });
    const on = (x) => along(c.thread, x);
    const [kx, ky] = threadPoint(c.thread, on(c.keeper));
    const [sx, sy] = threadPoint(c.thread, on(c.said));
    return { box: '0 0 ' + c.box.join(' '), svg: head(c.wall, c.top, c.bottom, c.open) +
      '<g class="boil">' + strand(c.thread) +
      hung(c.thread, on(c.tags[0]), { length: 18, w: 34, h: 42, mark: 'check', fill: MINT, sway: 4 }) +
      hung(c.thread, on(c.tags[1]), { length: 28, w: 34, h: 42, mark: 'key', sway: 4 }) +
      (cast() ? hung(c.thread, on(c.said), SAID) + rush(sx, sy, inward) : '') +
      seat(yours, kx, ky, c.size, { flip: inward, motion: sway(0.3, 1.8) }) + '</g>' };
  };

  const RIM = 2.6;
  const FAR_FROM = -0.6;
  const FAR_UNTIL = 1.6;
  const rimmed = (drawing) => {
    const id = 'rim-' + Math.random().toString(36).slice(2, 8);
    return '<filter id="' + id + '" x="-30%" y="-30%" width="160%" height="160%"><feMorphology in="SourceAlpha" operator="dilate" radius="' + RIM + '" result="around"/><feFlood flood-color="' + M.paper + '"/><feComposite in2="around" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><g filter="url(#' + id + ')">' + drawing + '</g>';
  };

  M.scenes.passed = () => {
    const big = wide.matches;
    const box = big ? [1120, 380] : [760, 350];
    const thread = big ? [-300, 120, 620, 300, 1540, 110] : [-240, 96, 380, 296, 1000, 86];
    const drawnThread = big ? stretched(thread, FAR_FROM, FAR_UNTIL) : thread;
    const on = (x) => along(thread, x);
    const lit = on(big ? 850 : 430);
    const [lx, ly] = threadPoint(thread, lit);
    const far = big ? [150, 0, 250, 250, lx - 74, ly - 2] : [90, 0, 110, 170, lx - 66, ly - 2];
    const memoris = keeper({ color: M.memoris, prop: 'satchel', mood: 'glad', arm: 'point', head: -8, ink: 3.2 });
    const courier = keeper({ color: 'rose', stage: 'ink', pose: 'swim', lean: 8, mood: 'glad', ink: 4.4, carry: 'letter' });
    const [kx, ky] = threadPoint(thread, on(big ? 1000 : 590));
    const [gx, gy] = threadPoint(thread, on(big ? 786 : 370));
    const dim = (x, length, mark) => hung(thread, on(x), { length, w: 34, h: 42, mark, fill: DIM, string: INK, sway: 2 });
    return { box: '0 0 ' + box[0] + ' ' + box[1], svg: '<g class="boil">' + strand(drawnThread, { width: 3, color: M.paper }) +
      (big ? dim(404, 24, 'lines') + dim(506, 40, 'face') + dim(610, 18, 'key') + dim(1150, 30, 'book') + dim(1246, 16, 'lines') : dim(30, 24, 'lines') + dim(132, 40, 'face') + dim(232, 18, 'key') + dim(716, 26, 'book')) +
      strand(far, { dotted: true, width: 3.6, color: M.paper }) +
      '<g transform="translate(' + fix(gx) + ' ' + fix(gy) + ') scale(1.3)"><g class="swing" data-a="3" data-s=".2">' + M.lantern(M.paper) + '</g></g>' +
      hung(thread, lit, { length: 30, w: 46, h: 56, mark: 'calendar', planned: true, string: M.paper, sway: 3 }) +
      '<g class="slide" data-line="' + far.map(fix).join(' ') + '" data-s="' + (big ? 0.05 : 0.06) + '">' + seat(courier, 0, -70, 0.6, { flip: true, motion: 'class="bob" data-a="5" data-s=".4"' }) + '</g>' +
      rimmed(seat(memoris, kx, ky, 0.84, { motion: sway(0.3, 1.8) })) + '</g>' };
  };
  wide.addEventListener('change', () => M.remount(document.querySelector('[data-scene="passed"]')));
  sideBySide.addEventListener('change', () => document.querySelectorAll('.zone svg[data-scene]').forEach((art) => M.remount(art)));

  const STORE_KEY = 'memoris.one-thing';
  const MINUTE = 60000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const memory = {
    read() {
      try {
        const kept = JSON.parse(window.localStorage.getItem(STORE_KEY));
        return kept && typeof kept.text === 'string' && kept.text ? kept : null;
      } catch (error) {
        return null;
      }
    },
    write(kept) {
      try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify(kept));
      } catch (error) {
        return;
      }
    },
    clear() {
      try {
        window.localStorage.removeItem(STORE_KEY);
      } catch (error) {
        return;
      }
    }
  };
  function ago(since) {
    const passed = Date.now() - since;
    if (passed < 1.5 * MINUTE) return 'a moment ago';
    if (passed < HOUR) return Math.round(passed / MINUTE) + ' minutes ago';
    if (passed < 1.5 * HOUR) return 'an hour ago';
    if (passed < DAY) return Math.round(passed / HOUR) + ' hours ago';
    if (passed < 2 * DAY) return 'yesterday';
    return Math.floor(passed / DAY) + ' days ago';
  }

  M.ready(() => {
    const art = document.querySelector('[data-tell]');
    const form = document.querySelector('[data-tell-form]');
    const input = form.querySelector('input');
    const before = document.querySelector('[data-tell-before]');
    const after = document.querySelector('[data-tell-after]');
    const echo = document.querySelector('[data-tell-echo]');
    const back = document.querySelector('[data-back]');
    const given = back.querySelector('[data-back-given]');
    let kept = memory.read();

    function show() {
      const told = Boolean(kept);
      document.querySelectorAll('[data-tell-said]').forEach((el) => {
        el.textContent = told ? kept.text : '';
      });
      document.querySelectorAll('[data-back-when]').forEach((el) => {
        el.textContent = told ? ago(kept.at) : '';
      });
      form.classList.toggle('is-sent', told);
      art.classList.toggle('is-told', told);
      before.hidden = told;
      after.hidden = !told;
      echo.hidden = !told;
      back.hidden = !told;
      if (!told) {
        back.classList.remove('is-given');
        given.hidden = true;
      }
      M.resettle();
    }
    form.addEventListener('submit', () => {
      const text = input.value.trim().replace(/\s+/g, ' ');
      if (!form.classList.contains('is-sent') || !text) {
        form.classList.remove('is-sent');
        return;
      }
      kept = { text, at: Date.now() };
      memory.write(kept);
      show();
      M.nod(art.querySelector('.is-after'));
    });
    document.querySelector('[data-tell-forget]').addEventListener('click', () => {
      kept = null;
      memory.clear();
      input.value = '';
      show();
      input.focus({ preventScroll: true });
    });
    back.querySelector('[data-back-ask]').addEventListener('click', () => {
      if (!kept) return;
      document.querySelectorAll('[data-back-when]').forEach((el) => {
        el.textContent = ago(kept.at);
      });
      given.hidden = false;
      back.classList.add('is-given');
      given.focus({ preventScroll: true });
      M.nod(back.querySelector('svg[data-scene]'));
    });
    if (kept) show();

    const trip = document.querySelector('[data-trip]');
    const frame = trip.querySelector('.trip__stage');
    const strip = trip.querySelector('.trip__strip');
    const zones = [...strip.querySelectorAll('.zone')].map((zone) => ({ art: zone.querySelector('svg[data-scene]'), text: zone.querySelector('.zone__text') }));
    const rider = strip.querySelector('[data-rider]');
    const pan = { top: 0, span: 0, shown: 0, leaving: [] };
    const ride = { top: 0, shown: 0, start: [0, 0], hang: [0, 0], end: [0, 0], lane: 0, leave: 0, legs: [[0, 0, 0, 0]] };
    const RIDER_SCALE = 1.16;
    const LEAVES_FROM = 0.86;
    const LANE_INSET = 34;
    const LEAVE_AT = 0.42;
    const renderPan = () => {
      strip.style.transform = 'translate3d(' + fix(-pan.shown * pan.span) + 'px,0,0)';
      const left = within((pan.shown - LEAVES_FROM) / (1 - LEAVES_FROM));
      pan.leaving.forEach((text) => {
        text.style.opacity = fix(1 - left);
      });
    };
    const panGoal = (y) => (pan.span ? within((y - pan.top) / pan.span) : 0);
    const ease = (t) => t * t * (3 - 2 * t);
    function laneAt(y) {
      const leg = ride.legs.find((l) => y <= l[1]) || ride.legs[ride.legs.length - 1];
      const t = leg[1] === leg[0] ? 1 : within((y - leg[0]) / (leg[1] - leg[0]));
      return leg[2] + (leg[3] - leg[2]) * ease(t);
    }
    function renderRide() {
      const c = ride.shown;
      let y = Math.min(Math.max(c, ride.start[1]), ride.hang[1]);
      if (c > ride.leave) y = ride.hang[1] + (ride.end[1] - ride.hang[1]) * within((c - ride.leave) / (ride.end[1] - ride.leave));
      rider.style.transform = 'translate3d(' + fix(laneAt(y)) + 'px,' + fix(y) + 'px,0)';
    }
    const rideGoal = (y, height) => y + height * 0.46 - ride.top;
    function placeRide() {
      const base = strip.getBoundingClientRect();
      const boxOf = (el) => el.getBoundingClientRect();
      const at = (i, point) => {
        const box = boxOf(zones[i].art);
        return [box.left - base.left + (point[0] / WAY.boxes[i][0]) * box.width, box.top - base.top + (point[1] / WAY.boxes[i][1]) * box.height];
      };
      const first = boxOf(zones[0].art);
      const artTop = (i) => boxOf(zones[i].art).top - base.top;
      const textTop = (i) => boxOf(zones[i].text).top - base.top;
      rider.style.width = fix(rider.viewBox.baseVal.width * (first.width / WAY.boxes[0][0]) * RIDER_SCALE) + 'px';
      ride.top = base.top + window.scrollY;
      ride.start = at(0, WAY.start);
      ride.hang = at(1, WAY.hang);
      ride.end = at(2, WAY.end);
      ride.lane = first.right - base.left - LANE_INSET;
      ride.leave = textTop(1) + boxOf(zones[1].text).height * LEAVE_AT;
      ride.legs = [
        [ride.start[1], textTop(0), ride.start[0], ride.lane],
        [textTop(0), artTop(1), ride.lane, ride.lane],
        [artTop(1), ride.hang[1], ride.lane, ride.hang[0]],
        [ride.hang[1], textTop(1), ride.hang[0], ride.lane],
        [textTop(1), artTop(2), ride.lane, ride.lane],
        [artTop(2), ride.end[1], ride.lane, ride.end[0]]
      ];
      ride.shown = rideGoal(window.scrollY, window.innerHeight);
      renderRide();
    }
    function stageAs(mode) {
      root.classList.toggle('pan', mode === 'pan');
      root.classList.toggle('ride', mode === 'ride');
      root.classList.toggle('plain', mode === 'plain');
      if (mode === stage.mode) return;
      stage.mode = mode;
      zones.forEach((zone) => M.remount(zone.art));
    }
    M.settle(() => {
      let mode = still.matches ? 'plain' : roomy() ? 'pan' : 'ride';
      strip.style.transform = '';
      trip.style.removeProperty('--pan');
      zones.forEach((zone) => zone.text.style.removeProperty('opacity'));
      pan.leaving = [];
      stageAs(mode);
      if (mode === 'pan' && strip.offsetHeight > window.innerHeight) {
        mode = 'ride';
        stageAs(mode);
      }
      if (mode === 'pan') {
        pan.span = Math.max(strip.offsetWidth - frame.clientWidth, 0);
        const edge = frame.getBoundingClientRect().left + pan.span;
        pan.leaving = zones.map((zone) => zone.text).filter((text) => {
          const box = text.getBoundingClientRect();
          return box.left < edge && box.right > edge;
        });
        trip.style.setProperty('--pan', pan.span + 'px');
        pan.top = trip.getBoundingClientRect().top + window.scrollY;
        pan.shown = panGoal(window.scrollY);
        renderPan();
      }
      if (mode === 'ride') placeRide();
    });
    M.follow((state) => {
      if (stage.mode === 'pan') {
        const goal = panGoal(state.y);
        if (Math.abs(goal - pan.shown) <= 0.0004) return false;
        pan.shown += (goal - pan.shown) * state.ease;
        renderPan();
        return true;
      }
      if (stage.mode !== 'ride') return false;
      const goal = rideGoal(state.y, state.height);
      if (Math.abs(goal - ride.shown) <= 0.3) return false;
      ride.shown += (goal - ride.shown) * state.ease;
      renderRide();
      return true;
    });

    const well = document.querySelector('[data-well]');
    const edge = well.querySelector('[data-edge]');
    const name = well.querySelector('[data-name]');
    const full = edge.querySelector('[data-full]');
    const answer = edge.querySelector('[data-answer]');
    const status = edge.querySelector('[data-full-status]');
    const hauler = well.querySelector('[data-haul]');
    const haulerArt = hauler.querySelector('.is-hauling');
    const reach = keeper({ pose: 'hoist' }).anchors;
    const HAUL_EVERY = 64;
    let hauled = -1;
    function ask(open) {
      answer.hidden = !open;
      well.classList.toggle('is-asked', open);
      full.setAttribute('aria-expanded', String(open));
      status.textContent = open ? 'Alex.' : '';
    }
    function haul(y, height) {
      const box = well.getBoundingClientRect();
      if (box.top > height || box.bottom < 0) return;
      const found = name.getBoundingClientRect().bottom < height - edge.offsetHeight - 40;
      hauler.classList.toggle('is-won', found);
      if (found && !answer.hidden) ask(false);
      const beat = Math.floor(y / HAUL_EVERY) % 2;
      if (beat === hauled) return;
      hauled = beat;
      M.act(haulerArt, beat ? 'up' : 'down');
    }
    M.settle(() => {
      const scale = haulerArt.getBoundingClientRect().width / haulerArt.viewBox.baseVal.width || 0.8;
      well.style.setProperty('--reach', fix((reach.base[0] - reach.hand[0]) * scale) + 'px');
      haul(window.scrollY, window.innerHeight);
    });
    M.follow((state) => {
      haul(state.y, state.height);
      return false;
    });
    if (still.matches) window.addEventListener('scroll', () => haul(window.scrollY, window.innerHeight), { passive: true });
    full.addEventListener('click', () => {
      ask(answer.hidden);
      if (!answer.hidden) well.querySelectorAll('.cast__memoris .is-offering, .cast__peek .held').forEach(M.nod);
    });
  });
})();
