(() => {
  const M = window.Memoris;
  const { fix, within, defaults } = M.util;
  const { keeper, seat, hung, strand, threadPoint, sway } = M;
  const still = M.still;
  const root = document.documentElement;
  const PALE = M.colors['amber-pale'];

  const LOST_ON_WALL = { box: '0 0 360 300', from: 10, until: 900, y: 196, sag: 18, keeper: 225, knots: [15], tags: [31, 113, 333] };
  const LOST_WHOLE = { box: '0 0 590 400', from: 62, until: 528, y: 262, sag: 12, keeper: 322, knots: [68, 522], tags: [112, 196, 470], bay: { x: 26, y: 32, w: 538, h: 338, side: 'both' } };
  const LOST_TAGS = [{ mark: 'face', length: 22 }, { gone: true, length: 34, sway: 5 }, { mark: 'calendar', fill: PALE, length: 28 }];
  M.scenes['b-missing'] = (el) => {
    const shape = el.hasAttribute('data-closed') ? LOST_WHOLE : LOST_ON_WALL;
    const thread = [shape.from, shape.y, (shape.from + shape.until) / 2, shape.y + shape.sag, shape.until, shape.y];
    const at = (x) => (x - shape.from) / (shape.until - shape.from);
    const yours = keeper({ color: 'coral', mood: 'thinking', look: 'down', arm: 'chin', head: -10, marks: 'question', ink: 2.4 });
    const [x, y] = threadPoint(thread, at(shape.keeper));
    return { box: shape.box, svg: (shape.bay ? M.bay(shape.bay) : '') + '<g class="boil">' + strand(thread, { width: 2.6 }) +
      shape.knots.map((knot) => M.knot(thread, at(knot), { width: 2.6, size: 0.8 })).join('') +
      LOST_TAGS.map((tag, i) => hung(thread, at(shape.tags[i]), defaults({ w: 48, h: 58, sway: 3 }, tag))).join('') +
      seat(yours, x, y, 1.2, { motion: sway(0.2, 1.8) }) + '</g>' };
  };

  const BAY_INSET = 26;
  const BAY_TOP = 12;
  const BAY_LEFT = 24;
  const BAY_REACH = 90;
  function drawBay(svg) {
    const fig = svg.parentNode;
    if (getComputedStyle(svg).display === 'none') return;
    const w = fig.offsetWidth;
    const h = Math.round(svg.getBoundingClientRect().height);
    if (!w || !h) return;
    const span = w - (parseFloat(getComputedStyle(svg).left) || w * 0.54);
    svg.setAttribute('viewBox', '0 0 ' + fix(span) + ' ' + h);
    svg.innerHTML = M.bay({ x: BAY_LEFT, y: BAY_TOP, w: span + BAY_REACH - BAY_LEFT, h: h - BAY_INSET - BAY_TOP });
  }

  M.ready(() => {
    const bays = [...document.querySelectorAll('.th-bay')];
    M.settle(() => bays.forEach(drawBay));

    const NAV_CLEAR = 14;
    const NAV_GAP = 24;
    const NAV_NEVER_ALONE = 2;
    const nav = document.querySelector('.top nav');
    const download = document.querySelector('.top .top__get');
    const wallEdge = document.querySelector('.th__wall');
    const wallBand = document.querySelector('.th .fold');
    M.settle(() => {
      const links = [...nav.children];
      nav.style.translate = '';
      links.forEach((link) => {
        link.style.marginLeft = '';
      });
      if (!nav.offsetWidth || !wallEdge.offsetWidth) return;
      const from = wallEdge.offsetLeft - NAV_CLEAR;
      const until = wallBand.offsetLeft + wallBand.offsetWidth + NAV_CLEAR;
      const first = links[0].getBoundingClientRect().left;
      const room = from - download.getBoundingClientRect().right - NAV_GAP;
      const fitting = links.filter((link) => link.getBoundingClientRect().right - first <= room).length;
      const onPaper = fitting < links.length ? Math.min(fitting, links.length - NAV_NEVER_ALONE) : fitting;
      if (onPaper && onPaper < links.length) {
        const gap = links[onPaper].getBoundingClientRect().left - links[onPaper - 1].getBoundingClientRect().right;
        links[onPaper].style.marginLeft = fix(Math.max(until - from - gap, 0)) + 'px';
      }
      const moved = onPaper ? from - links[onPaper - 1].getBoundingClientRect().right : until - links[0].getBoundingClientRect().left;
      nav.style.translate = fix(moved) + 'px 0';
    });

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
