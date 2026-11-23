(() => {
  const M = window.Memoris;
  const { within } = M.util;
  const { keeper, seat, hung, strand, threadPoint, sway, phone, bay } = M;
  const colors = M.colors;
  const PALE = colors['amber-pale'];
  const MINT = colors.mint;
  const DAYS = 11;
  const FAR = 4000;
  const spacious = window.matchMedia('(min-width: 1760px)');

  const span = (x1, y1, x2, y2, sag) => [x1, y1, (x1 + x2) / 2, (y1 + y2) / 2 + sag * 2, x2, y2];
  const along = (thread, x) => (x - thread[0]) / (thread[4] - thread[0]);

  M.scenes.study = () => {
    const upper = [8, 146, 280, 208, 552, 136];
    const lower = [40, 372, 290, 418, 540, 362];
    const looker = keeper({ color: 'coral', mood: 'focused', arm: 'hold', hold: 'magnifier', head: -6, ink: 3.2 });
    const reader = keeper({ pose: 'read', color: M.memoris, prop: 'satchel,glasses', arm: 'hold', hold: 'book', ink: 3.2 });
    const [lx, ly] = threadPoint(upper, 0.13);
    const [rx, ry] = threadPoint(lower, 0.66);
    return '<g class="boil">' + strand(upper) + strand(lower) +
      hung(upper, 0.36, { mark: 'calendar', length: 22, w: 40, h: 50, sway: 4 }) +
      hung(upper, 0.5, { mark: 'lines', length: 40, w: 38, h: 48, fill: PALE, sway: 4 }) +
      hung(upper, 0.64, { mark: 'check', length: 18, w: 40, h: 50, fill: MINT, sway: 5 }) +
      hung(upper, 0.78, { mark: 'star', length: 34, w: 38, h: 48, sway: 4 }) +
      hung(upper, 0.92, { mark: 'face', length: 16, w: 38, h: 46, fill: PALE, sway: 5 }) +
      hung(lower, 0.16, { mark: 'book', length: 20, w: 36, h: 44, sway: 4 }) +
      hung(lower, 0.3, { mark: 'lines', length: 32, w: 34, h: 42, fill: MINT, sway: 4 }) +
      seat(looker, lx, ly, 0.86, { flip: true, motion: sway(0.1, 2) }) +
      seat(reader, rx, ry, 0.9, { motion: sway(0.5, 2) }) + '</g>';
  };

  const TIED = 14;
  const OUTSIDE = { at: [146, 168], size: 0.63, wall: 306, top: 10, tall: 308, until: 746 };

  M.scenes.outside = () => {
    const c = OUTSIDE;
    const closed = spacious.matches;
    const thread = span(c.at[0], c.at[1], closed ? c.until - TIED : FAR, c.at[1], 4);
    const on = (x) => along(thread, x);
    const held = phone({ mood: 'glad', near: true });
    const resting = keeper({ pose: 'rest', color: 'coral', arm: 'hold', hold: 'cup', ink: 3.4 });
    const [rx, ry] = threadPoint(thread, on(410));
    return (closed ? bay({ x: c.wall, y: c.top, w: c.until - c.wall, h: c.tall, side: 'both' }) : bay({ x: c.wall, y: c.top, w: FAR, h: c.tall })) +
      '<g class="boil">' + strand(thread) +
      hung(thread, on(194), { mark: 'lines', length: 18, w: 30, h: 38, sway: 4 }) +
      hung(thread, on(227), { mark: 'face', length: 38, w: 30, h: 38, fill: PALE, sway: 4 }) +
      hung(thread, on(260), { mark: 'calendar', length: 20, w: 30, h: 38, sway: 4 }) +
      seat(resting, rx, ry, 0.8, { motion: sway(0.2, 1.8) }) + '</g>' +
      seat(held, c.at[0], c.at[1], c.size);
  };

  M.scenes.right = () => {
    const thread = [0, 124, 260, 178, 520, 118];
    const memoris = keeper({ color: M.memoris, prop: 'satchel', mood: 'open', look: 'down', head: -6, ink: 3.4 });
    const guesser = keeper({ color: 'coral', mood: 'thinking', arm: 'chin', head: 8, ink: 3.4 });
    const [kx, ky] = threadPoint(thread, 0.6);
    const [gx, gy] = threadPoint(thread, 0.88);
    return '<g class="boil">' + strand(thread) +
      hung(thread, 0.08, { mark: 'check', length: 20, w: 38, h: 46, fill: MINT, sway: 4 }) +
      hung(thread, 0.22, { mark: 'check', length: 38, w: 36, h: 44, sway: 4 }) +
      hung(thread, 0.36, { mark: 'check', length: 16, w: 38, h: 46, fill: MINT, sway: 4 }) +
      '<g transform="translate(250 262) rotate(64)">' + M.miniTag({ mark: 'question', length: 12, w: 32, h: 40, fill: PALE }) + '</g>' +
      seat(memoris, kx, ky, 0.8, { flip: true, motion: sway(0.2, 1.8) }) +
      seat(guesser, gx, gy, 0.8, { motion: sway(0.6, 1.8) }) + '</g>';
  };

  M.scenes.goals = () => {
    const thread = [0, 132, 260, 190, 520, 126];
    const chooser = keeper({ color: 'coral', mood: 'glad', arm: 'point', head: -6, ink: 3.4 });
    const memoris = keeper({ color: M.memoris, prop: 'satchel', mood: 'open', arm: 'hold', hold: 'pencil', head: -10, ink: 3.4 });
    const [cx, cy] = threadPoint(thread, 0.13);
    const [kx, ky] = threadPoint(thread, 0.87);
    return '<g class="boil">' + strand(thread) +
      hung(thread, 0.34, { mark: 'star', length: 44, w: 50, h: 60, fill: PALE, sway: 5 }) +
      hung(thread, 0.5, { mark: 'face', length: 18, w: 34, h: 42, sway: 4 }) +
      hung(thread, 0.63, { mark: 'key', length: 28, w: 34, h: 42, sway: 4 }) +
      seat(chooser, cx, cy, 0.8, { flip: true, motion: sway(0.2, 1.8) }) +
      seat(memoris, kx, ky, 0.8, { motion: sway(0.6, 1.8) }) + '</g>';
  };

  M.scenes.visit = () => {
    const thread = [0, 220, 310, 258, 620, 214];
    const memoris = keeper({ color: M.memoris, prop: 'satchel', mood: 'glad', head: 4, ink: 3.2 });
    const yours = keeper({ color: 'coral', mood: 'proud', arm: 'hold', hold: { mark: 'face', length: 14, w: 36, h: 44 }, head: 6, ink: 3 });
    const anna = keeper({ color: 'rose', mood: 'glad', arm: 'hold', hold: 'case', head: -4, ink: 3 });
    const [mx, my] = threadPoint(thread, 0.13);
    const [yx, yy] = threadPoint(thread, 0.47);
    const [ax, ay] = threadPoint(thread, 0.88);
    return { box: '0 0 620 360', svg: '<g class="boil">' + strand(thread) +
      seat(memoris, mx, my, 0.9, { flip: true, motion: sway(0.5, 1.8) }) +
      seat(yours, yx, yy, 1.04, { flip: true, motion: sway(0.1, 1.8) }) +
      seat(anna, ax, ay, 1, { motion: sway(0.5, 1.8) }) + '</g>' };
  };

  M.scenes.done = () => {
    const thread = [0, 0, 150, 0, 300, 0];
    const checks = [[0.06, 22], [0.21, 40], [0.63, 18], [0.79, 34], [0.95, 24]];
    return { box: '0 -14 300 164', svg: '<g class="boil">' + checks.map(([at, length], i) => hung(thread, at, { mark: 'check', length, w: 38, h: 46, fill: i % 2 ? M.card : MINT, sway: 4 })).join('') + '</g>' };
  };

  M.ready(() => {
    spacious.addEventListener('change', () => M.remount(document.querySelector('[data-scene="outside"]')));

    const string = document.querySelector('.ruler__string');
    const day = document.querySelector('[data-day]');
    const ruler = { top: 0, height: 1, shown: -1 };
    function tell(y, height) {
      const now = Math.min(Math.floor(within((y + height / 2 - ruler.top) / ruler.height) * DAYS + 0.04), DAYS);
      if (now === ruler.shown) return;
      ruler.shown = now;
      day.textContent = 'Day ' + now;
    }
    M.settle(() => {
      const box = string.getBoundingClientRect();
      ruler.top = box.top + window.scrollY;
      ruler.height = box.height || 1;
      tell(window.scrollY, window.innerHeight);
    });
    M.follow((state) => {
      tell(state.y, state.height);
      return false;
    });
    if (M.still.matches) window.addEventListener('scroll', () => tell(window.scrollY, window.innerHeight), { passive: true });

    const visit = document.querySelector('[data-visit]');
    const show = visit.querySelector('[data-rest-show]');
    show.addEventListener('click', () => {
      visit.classList.add('is-told');
      show.setAttribute('aria-expanded', 'true');
      visit.querySelector('[data-rest-cap]').hidden = false;
      visit.querySelector('[data-rest-status]').textContent = 'I’ll ask about her trip.';
      M.nod(visit.querySelector('svg[data-scene]'));
    });
  });
})();
