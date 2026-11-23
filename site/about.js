(() => {
  const M = window.Memoris;
  const { fix, within } = M.util;
  const { keeper, seat, hung, strand, knot, threadPoint, sway } = M;
  const still = M.still;
  const PAPER_NOTE = M.paper;
  const HOUSE = M.colors.coral;
  const ROOF = M.colors['coral-deep'];
  const LAMPLIGHT = M.colors['amber-pale'];
  const LAMPLIGHT_EDGE = M.colors.glow;
  const SMOKE = M.colors['paper-deep'];

  M.scenes.home = () => {
    const room = 'M246 604H754A42 42 0 0 1 796 646V1150H204V646A42 42 0 0 1 246 604Z';
    const thread = [204, 842, 500, 900, 796, 834];
    const theirs = keeper({ color: 'coral', mood: 'worried', head: -14, ink: 2.2 });
    const beside = keeper({ color: 'rose', mood: 'open', head: 4, lean: -8, ink: 2.2 });
    const small = keeper({ color: 'rose', mood: 'open', head: 16, ink: 3 });
    const [ax, ay] = threadPoint(thread, 0.33);
    const [bx, by] = threadPoint(thread, 0.63);
    const [cx, cy] = threadPoint(thread, 0.85);
    return '<g>' +
      '<path d="' + M.handCut('M668 214H752V420H668Z', 3) + '" fill="' + ROOF + '"/>' +
      '<path d="' + M.handCut('M130 520L500 204L870 520V1150H130Z', 5) + '" fill="' + HOUSE + '"/>' +
      '<path d="' + M.handCut('M66 540L500 154L934 540L900 582L500 228L100 582Z', 4) + '" fill="' + ROOF + '"/>' +
      '<path d="' + room + '" fill="' + M.paper + '" stroke="' + M.paper + '" stroke-width="28" stroke-linejoin="round"/><path d="' + room + '" fill="' + LAMPLIGHT + '"/>' +
      '<clipPath id="home-room"><path d="' + room + '"/></clipPath><g clip-path="url(#home-room)"><path d="' + room + '" fill="none" stroke="' + LAMPLIGHT_EDGE + '" stroke-width="32" stroke-linejoin="round"/></g>' +
      '<circle cx="500" cy="418" r="50" fill="' + M.paper + '"/><circle cx="500" cy="418" r="33" fill="' + LAMPLIGHT + '"/><path d="M500 385V451M467 418H533" stroke="' + M.paper + '" stroke-width="9"/>' +
      '</g>' +
      '<g class="cycle" data-loop="54" data-every="9" fill="' + SMOKE + '"><circle cx="722" cy="164" r="24"/><circle cx="758" cy="108" r="33"/><circle cx="812" cy="40" r="42"/></g>' +
      '<g class="boil">' +
      '<g transform="translate(486 620)"><path d="M0 -4V26" fill="none" stroke="' + M.ink + '" stroke-width="2.4"/><g transform="translate(0 26) scale(1.45)"><g class="swing" data-a="2.4" data-s=".2">' + M.lantern() + '</g></g></g>' +
      strand(thread) + knot(thread, 0.47, { size: 1.6 }) +
      hung(thread, 0.07, { length: 20, w: 38, h: 46, mark: 'key', sway: 4 }) +
      hung(thread, 0.16, { length: 44, w: 36, h: 44, fill: PAPER_NOTE, mark: 'calendar', sway: 4 }) +
      seat(theirs, ax, ay, 1.28, { flip: true, motion: sway(0.1, 1.5) }) +
      seat(beside, bx, by, 1.28, { motion: sway(0.5, 1.5) }) +
      seat(small, cx, cy, 0.86, { motion: sway(0.8, 2) }) +
      '</g>';
  };

  const PLATE_SCALE = 2.2;
  const PLATE_DISC = [280, 322, 276];
  const VOICE_SCALE = 0.3;
  const speaking = (x, y, scale) => '<g transform="translate(' + fix(x) + ' ' + fix(y) + ') scale(' + -scale + ' ' + scale + ')">' + M.voice({ mouth: [0, 0] }) + '</g>';
  M.scenes.anatomy = (el) => {
    const thread = [-60, 498, 280, 512, 620, 498];
    const memoris = keeper({ color: M.memoris, prop: 'satchel', mood: 'open', ink: 1.55 });
    const [x, y] = threadPoint(thread, 0.47);
    const curl = memoris.anchors.curl;
    const at = (p, dx, dy) => [x - (p[0] - curl[0] + (dx || 0)) * PLATE_SCALE, y + (p[1] - curl[1] + (dy || 0)) * PLATE_SCALE];
    el.parts = {
      satchel: at(memoris.anchors.satchel, 5, 5),
      voice: at(memoris.anchors.tip, 5, 0),
      eye: at(memoris.anchors.eye, -7, -7),
      tail: at(curl, -4, 6)
    };
    const [cx, cy, r] = PLATE_DISC;
    const mouth = at(memoris.anchors.tip, -9, 0);
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + M.card + '"/>' +
      '<clipPath id="plate-disc"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/></clipPath>' +
      '<g class="boil"><g clip-path="url(#plate-disc)">' + strand(thread, { width: 3.4 }) + '</g>' + seat(memoris, x, y, PLATE_SCALE, { flip: true }) + '</g>' +
      speaking(mouth[0], mouth[1], VOICE_SCALE * PLATE_SCALE);
  };

  const DETAILS = {
    satchel: { r: 26, from: 'satchel', dx: 0, dy: 4 },
    voice: { r: 29, from: 'tip', dx: 9, dy: 2 },
    eye: { r: 21, from: 'eye', dx: 0, dy: 0 },
    tail: { r: 29, from: 'curl', dx: -3, dy: 5 }
  };
  M.scenes.detail = (el) => {
    const name = el.dataset.detail;
    const detail = DETAILS[name];
    const memoris = keeper({ color: M.memoris, prop: 'satchel', mood: 'open', ink: 1.25 });
    const curl = memoris.anchors.curl;
    const from = memoris.anchors[detail.from];
    const cx = -(from[0] - curl[0] + detail.dx);
    const cy = from[1] - curl[1] + detail.dy;
    const r = detail.r;
    const thread = [-240, 0, 0, 0, 240, 0];
    const tip = memoris.anchors.tip;
    const arcs = name === 'voice' ? speaking(-(tip[0] - curl[0] - 7), tip[1] - curl[1], VOICE_SCALE) : '';
    return { box: [cx - r, cy - r, r * 2, r * 2].map(fix).join(' '), svg: '<circle cx="' + fix(cx) + '" cy="' + fix(cy) + '" r="' + r + '" fill="' + M.card + '"/>' +
      '<clipPath id="detail-' + name + '"><circle cx="' + fix(cx) + '" cy="' + fix(cy) + '" r="' + r + '"/></clipPath>' +
      '<g clip-path="url(#detail-' + name + ')"><g class="boil">' + strand(thread, { width: 2 }) + seat(memoris, 0, 0, 1, { flip: true }) + '</g>' + arcs + '</g>' };
  };

  const PHASES = [
    { from: 23, name: 'night', keepers: ['pose:curl;prop:nightcap;mood:asleep;marks:zz', 'mood:asleep;head:16;prop:nightcap'] },
    { from: 19, name: 'evening', keepers: ['arm:hold;hold:lantern;mood:open;head:4', 'pose:rest;arm:hold;hold:cup'] },
    { from: 12, name: 'day', keepers: ['pose:read;prop:glasses;arm:hold;hold:book', 'pose:draw'] },
    { from: 5, name: 'morning', keepers: ['pose:rest;arm:hold;hold:cup', 'arm:hold;hold:phone;mood:open;head:-6'] },
    { from: 0, name: 'night', keepers: ['pose:curl;prop:nightcap;mood:asleep;marks:zz', 'mood:asleep;head:16;prop:nightcap'] }
  ];
  const CLOCK_EVERY = 15000;
  const cities = [...document.querySelectorAll('[data-city]')];
  const forced = new URLSearchParams(window.location.search).get('hour');
  function readClock(zone) {
    const now = forced === null ? new Date() : new Date(Date.UTC(2026, 10, 14, Number(forced) + 5, 15));
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(now);
    const pick = (type) => parts.find((part) => part.type === type).value;
    const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', hourCycle: 'h23' }).format(now)) % 24;
    return { text: pick('hour') + ':' + pick('minute') + (pick('dayPeriod') === 'AM' ? ' a.m.' : ' p.m.'), stamp: String(hour).padStart(2, '0') + ':' + pick('minute'), hour };
  }
  function tellTime(mounted) {
    cities.forEach((city) => {
      let clock;
      try {
        clock = readClock(city.dataset.city);
      } catch (error) {
        return;
      }
      const phase = PHASES.find((p) => clock.hour >= p.from);
      const time = city.querySelector('[data-clock]');
      time.textContent = clock.text;
      time.setAttribute('datetime', clock.stamp);
      if (city.dataset.phase === phase.name && city.dataset.told) return;
      city.dataset.phase = phase.name;
      city.dataset.told = 'yes';
      city.classList.toggle('on-dark', phase.name === 'night');
      city.querySelectorAll('.person').forEach((person, slot) => {
        person.querySelector('.held').dataset.keeper = phase.keepers[slot % phase.keepers.length] + ';color:' + person.dataset.color;
      });
      if (mounted) M.mount(city.querySelector('.city__line'));
    });
  }
  tellTime(false);

  const lerp = (a, b, t) => a + (b - a) * t;
  function along(stops, values, t) {
    for (let i = 1; i < stops.length; i++) {
      if (t <= stops[i]) return lerp(values[i - 1], values[i], within((t - stops[i - 1]) / (stops[i] - stops[i - 1])));
    }
    return values[values.length - 1];
  }
  const smooth = (t) => t * t * (3 - 2 * t);

  const BESIDE_GAP = [18, 44];
  const BELOW_GAP = 26;
  const BESIDE_STRING = 84;
  const STRING_CLEAR = 6;
  const BELOW_AT = [60, 85];
  function hangPeople() {
    cities.forEach((city) => {
      const line = city.querySelector('.city__line');
      const [first, second] = line.querySelectorAll('.person');
      if (!second) return;
      const room = line.clientWidth;
      const gap = Math.min(Math.max(room * 0.06, BESIDE_GAP[0]), BESIDE_GAP[1]);
      const beside = first.offsetWidth + gap + second.offsetWidth <= room;
      const tagHeight = second.querySelector('.tag').offsetHeight;
      const string = beside ? BESIDE_STRING : first.offsetHeight + BELOW_GAP;
      first.style.setProperty('--at', beside ? '50%' : '34%');
      const left = beside ? first.offsetWidth + gap : Math.max(room - second.offsetWidth, 0);
      const below = ((first.offsetWidth + STRING_CLEAR - left) / second.offsetWidth) * 100;
      second.style.setProperty('--at', beside ? '50%' : Math.min(Math.max(below, BELOW_AT[0]), BELOW_AT[1]).toFixed(1) + '%');
      second.style.setProperty('--string', string + 'px');
      second.style.right = 'auto';
      second.style.left = fix(left) + 'px';
      line.style.minHeight = fix(Math.max(first.offsetHeight, string + tagHeight)) + 'px';
    });
  }

  M.ready(() => {
    setInterval(() => tellTime(true), CLOCK_EVERY);
    M.settle(hangPeople);

    const story = document.querySelector('[data-story]');
    const stacked = window.matchMedia('(max-width: 1179px)');
    const beats = [...story.querySelectorAll('[data-beat]')].map((el) => ({ el, name: el.dataset.beat, top: 0, shown: 0, goal: 0 }));
    const beat = (name) => beats.find((item) => item.name === name);
    const LINE_FROM = 0.86;
    const LINE_OVER = 0.6;
    const LINE_WINDOWS = { missing: [0.06, 0.34], torn: [0.3, 0.58], again: [0.5, 1] };
    const ALONE_FROM = 0.82;
    const ALONE_OVER = { missing: 0.4, torn: 0.4, again: 0.62 };
    let lineTop = 0;

    const falls = story.querySelector('.slot__falls');
    const FALL_AFTER = 0.2;
    const NOTICED_AT = 0.3;
    const FALL_DROP = 160;
    const FALL_TURN = 28;
    const FALL_FADE = 0.3;
    function renderMissing(item) {
      const t = within((item.shown - FALL_AFTER) / (1 - FALL_AFTER));
      const drop = t * t;
      item.el.classList.toggle('is-torn', t > 0);
      item.el.classList.toggle('is-after', t > NOTICED_AT);
      falls.style.transform = t > 0 ? 'translate3d(0,' + fix(drop * FALL_DROP) + 'px,0) rotate(' + fix(drop * FALL_TURN) + 'deg)' : '';
      falls.style.opacity = (1 - within((t - 0.3) / FALL_FADE)).toFixed(3);
    }

    const scrap = story.querySelector('.scrap');
    const HINGE_UNTIL = 0.3;
    const HINGE_TURN = 9;
    const SCRAP_FALL = { line: { drop: [10, 250], turn: 34 }, alone: { drop: [10, 72], turn: 8 } };
    const APART_AT = 0.9;
    function renderTorn(item) {
      const hinge = smooth(within(item.shown / HINGE_UNTIL));
      const t = within((item.shown - HINGE_UNTIL) / (1 - HINGE_UNTIL));
      const drop = t * t;
      const fall = stacked.matches ? SCRAP_FALL.alone : SCRAP_FALL.line;
      scrap.style.transform = 'translate3d(' + fix(drop * fall.drop[0]) + 'px,' + fix(drop * fall.drop[1]) + 'px,0) rotate(' + fix(hinge * HINGE_TURN + drop * fall.turn) + 'deg)';
      scrap.style.opacity = (1 - within((t - 0.5) / 0.4)).toFixed(3);
      story.classList.toggle('is-apart', t >= APART_AT);
    }

    const asks = story.querySelector('.asks');
    const askTag = asks.querySelector('.asks__tag');
    const askNotes = [...asks.querySelectorAll('.asks__note')];
    const haulers = [...asks.querySelectorAll('.asks__keeper')];
    const hoist = keeper({ pose: 'hoist', color: 'coral' });
    const hoistSize = Number(haulers[0].dataset.size);
    const fist = [(hoist.anchors.hand[0] - hoist.anchors.base[0]) * hoistSize, (hoist.anchors.hand[1] - hoist.anchors.base[1]) * hoistSize];
    const ASK_STOPS = [0, 0.14, 0.26, 0.42, 0.54, 0.7, 0.82, 1];
    const ASK_DEPTHS = [150, 34, 190, 62, 250, 104, 300, 262];
    const ASKED_AT = [0.14, 0.42, 0.7];
    const HARD_FROM = 0.56;
    const HAUL_STEP = 24;
    const ASK_ROOM = 420;
    const TAG_ROOM = 124;
    const SEAT_AT = 0.88;
    const hauling = { seat: 0, deep: 1, act: '' };
    function renderAgain(item) {
      const q = item.shown;
      const depth = along(ASK_STOPS, ASK_DEPTHS, q) * hauling.deep;
      const act = Math.floor(depth / HAUL_STEP) % 2 ? 'up' : 'down';
      if (act !== hauling.act) {
        hauling.act = act;
        haulers.forEach((hauler) => M.act(hauler, act));
      }
      askTag.style.left = fix(hauling.seat + fist[0] - askTag.offsetWidth / 2) + 'px';
      askTag.style.top = fix(fist[1]) + 'px';
      askTag.style.setProperty('--string', fix(depth - fist[1]) + 'px');
      askNotes.forEach((note, i) => note.classList.toggle('is-in', q >= ASKED_AT[i]));
      item.el.classList.toggle('is-hard', q >= HARD_FROM);
    }
    const renderers = { missing: renderMissing, torn: renderTorn, again: renderAgain };
    const beatGoal = (item, y, height) => {
      if (still.matches) return 1;
      if (stacked.matches) return within((y + height * ALONE_FROM - item.top) / (height * ALONE_OVER[item.name]));
      const line = within((y + height * LINE_FROM - lineTop) / (height * LINE_OVER));
      const [from, to] = LINE_WINDOWS[item.name];
      return within((line - from) / (to - from));
    };
    M.settle(() => {
      lineTop = story.getBoundingClientRect().top + window.scrollY;
      hauling.seat = asks.offsetWidth * SEAT_AT;
      haulers.forEach((hauler) => {
        hauler.style.left = fix(hauling.seat) + 'px';
      });
      hauling.deep = Math.max(asks.offsetHeight - TAG_ROOM, 120) / (ASK_ROOM - TAG_ROOM);
      hauling.act = '';
      beats.forEach((item) => {
        item.top = item.el.getBoundingClientRect().top + window.scrollY;
        item.goal = beatGoal(item, window.scrollY, window.innerHeight);
        item.shown = item.goal;
        renderers[item.name](item);
      });
    });
    M.follow((frame) => {
      let busy = false;
      beats.forEach((item) => {
        item.goal = beatGoal(item, frame.y, frame.height);
        if (Math.abs(item.goal - item.shown) <= 0.0004) return;
        item.shown += (item.goal - item.shown) * frame.ease;
        renderers[item.name](item);
        busy = true;
      });
      return busy;
    });
    document.documentElement.classList.add('story-on');

    const build = document.querySelector('[data-build]');
    const pin = build.querySelector('.made__pin');
    const bench = build.querySelector('.bench');
    const rough = build.querySelector('.is-rough');
    const ink = build.querySelector('.is-ink');
    const paint = build.querySelector('.is-paint');
    const makers = [...build.querySelectorAll('.bench__maker')];
    const work = build.querySelector('.bench__work');
    const drawer = keeper({ pose: 'draw', color: 'rose' });
    const sitter = keeper({ color: M.memoris, prop: 'satchel' });
    const makerSize = Number(makers[0].dataset.size);
    const workSize = Number(paint.dataset.size);
    const FIN_EDGE = 4;
    const LEAN_BACK = -42;
    const small = window.matchMedia('(max-width: 760px), (max-width: 1100px) and (orientation: portrait)');
    const BENCH_FITS = { wide: [880, 1240, 0.58, 1.12], small: [760, 530, 0.5, 1.3] };
    const making = { pinned: false, top: 0, travel: 1, benchTop: 0, shown: 0, goal: 0, stroke: '', tool: '', alive: false };
    const MIN_PIN_HEIGHT = 540;
    const PIN_LEAD = 0.3;
    const DONE_AT = 0.86;
    const PASS_FROM = 0.86;
    const PASS_OVER = 0.62;
    const PENCIL_UNTIL = 0.44;
    const INK_FROM = 0.46;
    const INK_OVER = 0.14;
    const ROUGH_GONE = [0.52, 0.66];
    const PAINT_FROM = 0.68;
    const PAINT_OVER = 0.24;
    const ALIVE_AT = 0.95;
    const PAINT_SLANT = 14;
    const STROKES_PER_BUILD = 34;
    function renderBuild() {
      const b = making.shown;
      const pencil = within(b / PENCIL_UNTIL);
      M.drawOn(rough, pencil);
      rough.style.opacity = (1 - within((b - ROUGH_GONE[0]) / (ROUGH_GONE[1] - ROUGH_GONE[0]))).toFixed(3);
      ink.style.opacity = within((b - INK_FROM) / INK_OVER).toFixed(3);
      const painted = within((b - PAINT_FROM) / PAINT_OVER);
      const wet = painted * (100 + PAINT_SLANT);
      paint.style.clipPath = painted >= 1 ? '' : 'polygon(130% -20%,130% 120%,' + fix(100 - wet + PAINT_SLANT) + '% 120%,' + fix(100 - wet) + '% -20%)';
      paint.style.visibility = painted > 0 ? '' : 'hidden';
      const alive = b >= ALIVE_AT;
      if (alive !== making.alive) {
        making.alive = alive;
        build.classList.toggle('is-alive', alive);
        if (alive && !still.matches) M.nod(paint);
      }
      const tool = alive ? 'done' : b >= PAINT_FROM ? 'brush' : b >= INK_FROM ? 'ink' : 'pencil';
      if (tool !== making.tool) {
        making.tool = tool;
        build.dataset.tool = tool;
      }
      const stroke = Math.floor(b * STROKES_PER_BUILD) % 2 ? 'up' : 'down';
      if (stroke !== making.stroke) {
        making.stroke = stroke;
        makers.forEach((maker) => M.act(maker, stroke));
      }
    }
    const buildGoal = (y, height) => {
      if (still.matches) return 1;
      if (making.pinned) return within((y - making.top + height * PIN_LEAD) / (making.travel * DONE_AT + height * PIN_LEAD));
      return within((y + height * PASS_FROM - making.benchTop) / (height * PASS_OVER));
    };
    M.settle(() => {
      const height = window.innerHeight;
      build.classList.remove('is-pinned');
      const fit = small.matches ? BENCH_FITS.small : BENCH_FITS.wide;
      const k = Math.min(Math.max(Math.min(height / fit[0], window.innerWidth / fit[1]), fit[2]), fit[3]);
      build.style.setProperty('--k', k.toFixed(3));
      const back = (sitter.anchors.fin[0] - sitter.anchors.curl[0] + FIN_EDGE) * workSize * k;
      const reach = (drawer.anchors.curl[0] - drawer.anchors.pencil[0]) * makerSize * k;
      makers.forEach((maker) => {
        maker.style.left = fix(work.offsetLeft + back + reach + (maker.dataset.tool === 'done' ? LEAN_BACK * k : 0)) + 'px';
      });
      making.pinned = !still.matches && height >= MIN_PIN_HEIGHT && pin.offsetHeight <= height;
      build.classList.toggle('is-pinned', making.pinned);
      making.top = build.getBoundingClientRect().top + window.scrollY;
      making.travel = Math.max(build.offsetHeight - pin.offsetHeight, 1);
      making.benchTop = bench.getBoundingClientRect().top + window.scrollY;
      making.goal = buildGoal(window.scrollY, height);
      making.shown = making.goal;
      renderBuild();
    });
    M.follow((frame) => {
      making.goal = buildGoal(frame.y, frame.height);
      if (Math.abs(making.goal - making.shown) <= 0.0004) return false;
      making.shown += (making.goal - making.shown) * frame.ease;
      renderBuild();
      return true;
    });

    const anatomy = document.querySelector('[data-anatomy]');
    const figure = anatomy.querySelector('.anatomy__fig svg');
    const leads = anatomy.querySelector('.anatomy__leads');
    const lined = window.matchMedia('(min-width: 1100px)');
    const LEAD_GAP = 16;
    const LEAD_RUN = 30;
    function drawLeads() {
      leads.innerHTML = '';
      if (!lined.matches || !figure.parts) return;
      const frame = anatomy.getBoundingClientRect();
      const art = figure.getBoundingClientRect();
      const unit = art.width / figure.viewBox.baseVal.width;
      leads.setAttribute('viewBox', '0 0 ' + fix(frame.width) + ' ' + fix(frame.height));
      leads.innerHTML = [...anatomy.querySelectorAll('.part')].map((part) => {
        const to = figure.parts[part.dataset.part];
        const tx = art.left - frame.left + to[0] * unit;
        const ty = art.top - frame.top + to[1] * unit;
        const box = part.querySelector('dt b').getBoundingClientRect();
        const fromLeft = box.left + box.width / 2 < art.left + art.width / 2;
        const sx = (fromLeft ? box.right + LEAD_GAP : box.left - LEAD_GAP) - frame.left;
        const sy = box.top + box.height / 2 - frame.top;
        const d = 'M' + fix(sx) + ' ' + fix(sy) + 'H' + fix(sx + (fromLeft ? LEAD_RUN : -LEAD_RUN)) + 'L' + fix(tx) + ' ' + fix(ty);
        return '<path class="lead" d="' + d + '"/><circle class="lead__end" cx="' + fix(tx) + '" cy="' + fix(ty) + '" r="6.5"/>';
      }).join('');
    }
    M.settle(drawLeads);
    lined.addEventListener('change', drawLeads);
  });
})();
