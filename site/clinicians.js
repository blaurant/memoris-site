(() => {
  const M = window.Memoris;
  const { fix, within } = M.util;
  const { keeper, seat, hung, strand, sway, miniTag } = M;
  const still = M.still;
  const INK = M.ink;
  const PALE = M.colors['amber-pale'];
  const LILAC = M.colors.lilac;
  const FRAME = 1000 / 12;
  const LONG = 2600;
  const along = (y) => [0, y, LONG / 2, y, LONG, y];
  const at = (x) => x / LONG;
  const stacked = window.matchMedia('(max-width: 860px), (max-aspect-ratio: 11/10)');
  const compact = window.matchMedia('(max-width: 620px)');

  const GAP_LINE = 204;
  const GAP_SPOTS = [44, 122, 200, 278];
  const GAP_STRINGS = [26, 42, 22, 36];
  const GAP_SEAT = [420, GAP_LINE, 1.14];
  M.scenes.clinic = () => {
    const thread = along(GAP_LINE);
    const clinician = keeper({ color: 'amber', prop: 'stethoscope', mood: 'glad', arm: 'hold', hold: 'clipboard', head: -4, ink: 2.7 });
    const tags = [['lines', M.card], ['calendar', PALE], ['check', M.card], ['face', LILAC]];
    return '<g class="boil">' + strand(thread) +
      tags.map((tag, i) => hung(thread, at(GAP_SPOTS[i]), { length: GAP_STRINGS[i], w: 46, h: 56, mark: tag[0], fill: tag[1] })).join('') +
      seat(clinician, GAP_SEAT[0], GAP_SEAT[1], GAP_SEAT[2], { motion: sway(0.2, 2) }) + '</g>';
  };
  M.scenes.home = () => {
    const thread = along(GAP_LINE);
    const patient = keeper({ color: 'coral', mood: 'worried', arm: 'hold', hold: 'phone', marks: 'question', head: -8, ink: 2.7 });
    const lost = (i, fill) => hung(thread, at(GAP_SPOTS[i]), { length: GAP_STRINGS[i], w: 46, h: 56, fill, gone: true });
    return '<g class="boil">' + strand(thread) +
      lost(0, M.card) +
      hung(thread, at(GAP_SPOTS[1]), { length: GAP_STRINGS[1], w: 46, h: 56, mark: 'calendar', fill: PALE }) +
      lost(2, M.card) +
      lost(3, LILAC) +
      seat(patient, GAP_SEAT[0], GAP_SEAT[1], GAP_SEAT[2], { motion: sway(0.5, 2) }) + '</g>';
  };

  const MEMORIES = [['key', M.card, 18], ['face', PALE, 30], ['calendar', M.card, 16], ['book', LILAC, 28], ['photo', M.card, 20], ['lines', PALE, 32]];
  const WIDE_MOBILE = { box: '0 0 640 560', perch: 104, x: 320, y: 232, half: 235, dip: 9, left: [-190, -152, -114, -76, -38], right: [190, 152, 114, 76, 38], count: 6, tag: [28, 34], word: 1.5, type: 25, small: 11.5, keeper: 0.98, least: 2 };
  const SMALL_MOBILE = { box: '0 0 360 430', perch: 96, x: 180, y: 206, half: 118, dip: 6, left: [-86, -52, -18], right: [86, 52, 18], count: 4, tag: [30, 36], word: 1.08, type: 19, small: 9.6, keeper: 0.88, least: 1 };
  const WORD_TAG = { length: 56, w: 104, h: 40, mark: 'none' };
  const SOON_TAG = { length: 18, w: 104, h: 42, mark: 'none', planned: true };
  const mobile = () => (compact.matches ? SMALL_MOBILE : WIDE_MOBILE);
  const plumb = (x, kind, inner, phase) => '<g class="plumb' + (kind ? ' ' + kind : '') + '" data-x="' + x + '"><g class="pop"><g class="swing" data-a="2.4" data-s=".24" data-p="' + phase + '"><g class="hop">' + inner + '</g></g></g></g>';
  const written = (text, y, size, small) => '<text class="word' + (small ? ' word--small' : '') + '" x="0" y="' + fix(y) + '" text-anchor="middle" style="font-size:' + size + 'px">' + text + '</text>';
  M.scenes.balance = () => {
    const g = mobile();
    const k = g.word;
    const thread = [20, g.perch, 1210, g.perch, 2400, g.perch];
    const memoris = keeper({ pose: 'dangle', color: M.memoris, prop: 'satchel', ink: 2.9 });
    const reach = [(memoris.anchors.hand[0] - memoris.anchors.curl[0]) * g.keeper, (memoris.anchors.hand[1] - memoris.anchors.curl[1]) * g.keeper];
    const wordTag = (word) => '<g transform="scale(' + k + ')">' + miniTag(WORD_TAG) + '</g>' + written(word, (WORD_TAG.length + WORD_TAG.h * 0.66) * k, g.type);
    const soon = '<g transform="translate(0 ' + fix((WORD_TAG.length + WORD_TAG.h) * k) + ')"><g transform="scale(' + k + ')">' + miniTag(SOON_TAG) + '</g>' +
      written('Connect', (SOON_TAG.length + SOON_TAG.h * 0.6) * k, g.type) + written('coming soon', (SOON_TAG.length + SOON_TAG.h * 0.88) * k, g.small, true) + '</g>';
    return { box: g.box, svg: '<g class="boil">' + strand(thread) +
      '<path d="M' + g.x + ' ' + fix(g.perch + reach[1] + 4) + 'V' + g.y + '" fill="none" stroke="' + INK + '" stroke-width="2.6" stroke-linecap="round"/>' +
      '<g class="beam" transform="translate(' + g.x + ' ' + g.y + ')">' +
      '<path d="M' + -g.half + ' ' + g.dip + 'Q0 ' + -g.dip + ' ' + g.half + ' ' + g.dip + '" fill="none" stroke="' + INK + '" stroke-width="4.2" stroke-linecap="round"/>' +
      plumb(-g.half, '', wordTag('Support') + soon, 0.1) +
      plumb(g.half, '', wordTag('Stimulate'), 0.6) +
      MEMORIES.slice(0, g.count).map((m, i) => plumb(0, 'mem', miniTag({ length: m[2], w: g.tag[0], h: g.tag[1], mark: m[0], fill: m[1] }), (i * 0.17).toFixed(2))).join('') +
      '</g>' +
      seat(memoris, g.x - reach[0], g.perch, g.keeper) + '</g>' };
  };

  M.scenes.beside = () => {
    const thread = along(236);
    const clinician = keeper({ color: 'amber', prop: 'stethoscope', mood: 'open', arm: 'hold', hold: 'clipboard', head: -2, ink: 2.9 });
    const memoris = keeper({ color: M.memoris, prop: 'satchel', mood: 'glad', head: -4, ink: 2.9 });
    return '<g class="boil">' + strand(thread) +
      seat(clinician, 214, 236, 1.02, { motion: sway(0.1, 2) }) +
      seat(memoris, 392, 236, 1.02, { motion: sway(0.6, 2) }) + '</g>';
  };

  M.scenes.waiting = () => {
    const bench = [-3000, 150, 260, 150, 3520, 150];
    const seats = [[96, 'calendar', PALE, 4, 0.8, 'open'], [232, 'face', M.card, -8, 0.92, 'glad'], [372, 'key', LILAC, 10, 0.84, 'open']];
    return '<g class="boil">' + strand(bench) +
      seats.map(([x, mark, fill, head, scale, mood], i) => seat(keeper({ pose: 'wait', color: 'coral', mood, head, hold: { mark, length: 0, w: 30, h: 36, fill }, ink: 2.8 / scale }), x, 150, scale, { flip: true, motion: sway(0.2 + i * 0.3, 1) })).join('') + '</g>';
  };

  M.scenes.handover = () => {
    const clinician = keeper({ color: 'amber', pose: 'offer', prop: 'stethoscope', hold: 'sheet', ink: 3.4 });
    const patient = keeper({ color: 'coral', mood: 'open', arm: 'up', head: 6, ink: 3.4 });
    return '<g class="boil">' + seat(clinician, 112, 200, 0.82, { flip: true, motion: sway(0.1, 1.4) }) + seat(patient, 240, 200, 0.82, { motion: sway(0.6, 1.4) }) + '</g>';
  };
  M.scenes.firstuse = () => {
    const clinician = keeper({ color: 'amber', prop: 'stethoscope', mood: 'glad', arm: 'point', head: -6, ink: 3.4 });
    const patient = keeper({ color: 'coral', pose: 'tie', hold: { mark: 'goal', length: 20, w: 38, h: 46, fill: PALE }, ink: 3.4 });
    return '<g class="boil">' + seat(clinician, 118, 200, 0.82, { flip: true, motion: sway(0.2, 1.4) }) + seat(patient, 262, 200, 0.82) + '</g>';
  };
  M.scenes.family = () => {
    const scale = 0.82;
    const relative = keeper({ color: 'rose', pose: 'lean', mood: 'glad', ink: 3.4 });
    const patient = keeper({ color: 'coral', mood: 'glad', arm: 'give', hold: 'phone', head: -16, ink: 3.4 });
    const phone = 268 + (patient.anchors.hand[0] - patient.anchors.curl[0]) * scale;
    const beside = phone - 18 + (relative.anchors.hand[0] - relative.anchors.curl[0]) * scale;
    return '<g class="boil">' + seat(patient, 268, 200, scale, { motion: sway(0.8, 1.2) }) + seat(relative, beside, 200, scale, { flip: true, motion: sway(0.3, 1.2) }) + '</g>';
  };

  const PILOT_TAG_AT = 0.76;
  M.scenes.pilot = () => ({ box: M.pair.box.join(' '), svg: M.pair({ left: 'amber', prop: 'stethoscope' }) +
    '<g class="boil">' + hung(M.pair.thread, PILOT_TAG_AT, { length: 30, w: 30, h: 38, mark: 'check', planned: true, sway: 4 }) + '</g>' });

  M.ready(() => {
    const ROPE_TURN = 18;
    const drawRope = (svg, length, runTo) => {
      svg.style.height = fix(length) + 'px';
      const turn = runTo === undefined ? '' : 'Q6 ' + fix(length) + ' ' + (6 - ROPE_TURN) + ' ' + fix(length) + 'H' + fix(runTo);
      svg.firstElementChild.setAttribute('d', M.drawnPath('M6 0V' + fix(length - (turn ? ROPE_TURN : 0)) + turn));
    };

    const frame = document.querySelector('.visit__frame');
    const title = frame.querySelector('h1');
    const probe = frame.querySelector('.probe');
    const interval = frame.querySelector('[data-interval]');
    const body = frame.querySelector('.visit__body');
    const rope = interval.querySelector('.rope');
    const pegs = interval.querySelector('.notes');
    const again = frame.querySelector('[data-again]');
    const notes = [...pegs.querySelectorAll('.note')];
    const NOTE_GAPS = [500, 500, 1000, 2000];
    const AGAIN_AFTER = 1100;
    const WAIT_CLEAR = 20;
    const RUN_PAST = 40;
    const waiting = interval.querySelector('.cast--wait');
    const ROPE_PARTS = 18;
    const PASSED_AT = 0.5;
    const FONT_WAIT = 1500;
    const run = { mode: '', armed: false, away: false, timers: [], tops: [] };
    const hold = (note) => note.classList.add('is-waiting');
    const show = (note) => note.classList.remove('is-waiting');
    function stop() {
      run.timers.forEach(clearTimeout);
      run.timers = [];
    }
    function play() {
      stop();
      again.hidden = true;
      notes.forEach(hold);
      if (run.played) M.mount(pegs);
      run.played = true;
      let wait = 0;
      notes.forEach((note, i) => {
        wait += NOTE_GAPS[i];
        run.timers.push(setTimeout(() => show(note), wait));
      });
      run.timers.push(setTimeout(() => {
        again.hidden = false;
      }, wait + AGAIN_AFTER));
    }
    function meet(y, height) {
      notes.forEach((note, i) => {
        if (y + height * PASSED_AT > run.tops[i]) show(note);
      });
    }
    function arrange() {
      const mode = still.matches ? 'still' : stacked.matches ? 'stacked' : 'wide';
      if (!run.armed || mode === run.mode) return;
      run.mode = mode;
      stop();
      again.hidden = true;
      if (mode === 'still') notes.forEach(show);
      else play();
    }
    M.settle(() => {
      frame.style.setProperty('--rise', fix(title.getBoundingClientRect().bottom - probe.getBoundingClientRect().bottom) + 'px');
      if (stacked.matches) {
        const top = interval.getBoundingClientRect().top;
        const tail = Math.round((waiting.getBoundingClientRect().height * parseFloat(waiting.style.getPropertyValue('--ay'))) / 100 + WAIT_CLEAR);
        const length = Math.round(body.getBoundingClientRect().bottom - top + tail);
        const first = parseFloat(getComputedStyle(frame).getPropertyValue('--top')) || 0;
        frame.style.setProperty('--tail', tail + 'px');
        frame.style.setProperty('--rope', length + 'px');
        drawRope(rope, length, -rope.getBoundingClientRect().left - RUN_PAST);
        run.tops = notes.map((note) => top + window.scrollY + first + ((length - first) * Number(note.style.getPropertyValue('--n'))) / ROPE_PARTS);
      }
      arrange();
    });
    M.follow(({ y, height }) => {
      if (run.mode === 'stacked') meet(y, height);
      return false;
    });
    if (!still.matches) notes.forEach(hold);
    Promise.race([document.fonts.ready, new Promise((done) => setTimeout(done, FONT_WAIT))]).then(() => {
      run.armed = true;
      arrange();
    });
    new IntersectionObserver((entries) => {
      const seen = entries[0].isIntersecting;
      if (seen && run.away && run.mode !== 'still') play();
      run.away = !seen;
    }).observe(frame);
    again.addEventListener('click', () => {
      play();
      M.nod(interval.querySelector('.cast--memoris'));
    });

    document.querySelectorAll('.private__line').forEach((line) => {
      const cord = line.querySelector('.rope');
      const last = line.querySelector('.fact:last-child');
      const CORD_PAST = 44;
      M.settle(() => {
        if (getComputedStyle(cord).display !== 'none') drawRope(cord, last.offsetTop + CORD_PAST);
      });
    });

    document.querySelectorAll('[data-balance]').forEach((fig) => {
      const svg = fig.querySelector('svg');
      const buttons = [...fig.querySelectorAll('[data-course]')];
      const grid = fig.closest('.how__grid');
      const turning = grid.querySelector('.how__part--course');
      const state = { shown: 0, scrolled: 0, manual: null, held: -1, mark: 0, at: 0.5, last: 0, g: mobile(), beam: null, plumbs: [], mems: [] };
      const TILT_FROM = 4.5;
      const TILT_TO = -9.5;
      const SHIFT_FRAMES = 20;
      const SHIFT_BESIDE = 0.6;
      const SHIFT_ALONE = 0.5;
      const SHIFT_SLACK = 0.1;
      const HOP = [0.5, 1.14, 0.95, 1];
      function bind() {
        state.g = mobile();
        state.beam = svg.querySelector('.beam');
        state.plumbs = [...svg.querySelectorAll('.plumb')].map((node) => ({ node, x: Number(node.dataset.x), mem: node.classList.contains('mem') }));
        state.mems = state.plumbs.filter((p) => p.mem);
        state.held = -1;
      }
      function hop(node) {
        if (still.matches) return;
        HOP.forEach((scale, i) => setTimeout(() => node.setAttribute('transform', 'scale(' + scale + ')'), i * FRAME));
      }
      function render() {
        const g = state.g;
        const v = state.shown;
        const eased = v * v * (3 - 2 * v);
        const angle = TILT_FROM + (TILT_TO - TILT_FROM) * eased;
        const steps = g.left.length - g.least + 1;
        const held = g.least + Math.min(steps - 1, Math.floor(v * steps));
        if (held !== state.held) {
          state.mems.forEach((mem, i) => {
            const x = i < held ? g.left[i] : g.right[g.count - 1 - i];
            if (x !== mem.x && state.held >= 0) hop(mem.node.querySelector('.hop'));
            mem.x = x;
          });
          state.held = held;
        }
        state.beam.setAttribute('transform', 'translate(' + g.x + ' ' + g.y + ') rotate(' + angle.toFixed(2) + ')');
        state.plumbs.forEach((p) => p.node.setAttribute('transform', 'translate(' + p.x + ' ' + fix(g.dip * (p.x / g.half) * (p.x / g.half)) + ') rotate(' + (-angle).toFixed(2) + ')'));
      }
      const wanted = () => (state.manual === null ? state.scrolled : state.manual);
      function press() {
        buttons.forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.course) === wanted())));
      }
      function passed(y, height) {
        const line = height * (state.at + (state.scrolled ? SHIFT_SLACK : 0));
        return state.mark - y < line ? 1 : 0;
      }
      function measure() {
        const beside = getComputedStyle(fig).position === 'sticky';
        fig.style.setProperty('--fig-h', fig.offsetHeight + 'px');
        const box = (beside ? turning : svg).getBoundingClientRect();
        state.mark = box.top + window.scrollY + (beside ? 0 : box.height / 2);
        state.at = beside ? SHIFT_BESIDE : SHIFT_ALONE;
        state.scrolled = still.matches ? 1 : passed(window.scrollY, window.innerHeight);
        state.shown = wanted();
        press();
        render();
      }
      bind();
      M.settle(measure);
      M.follow(({ y, height }) => {
        const scrolled = passed(y, height);
        if (scrolled !== state.scrolled) {
          state.scrolled = scrolled;
          state.manual = null;
          press();
        }
        const goal = wanted();
        if (goal === state.shown) return false;
        const now = performance.now();
        if (now - state.last < FRAME) return true;
        state.last = now;
        state.shown = goal > state.shown ? Math.min(state.shown + 1 / SHIFT_FRAMES, 1) : Math.max(state.shown - 1 / SHIFT_FRAMES, 0);
        render();
        return true;
      });
      compact.addEventListener('change', () => {
        M.remount(svg);
        bind();
        measure();
      });
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          state.manual = Number(button.dataset.course);
          press();
          if (still.matches) {
            state.shown = state.manual;
            render();
          }
          M.nod(svg);
          M.wake();
        });
      });
      render();
    });

    const ledgerRows = [...document.querySelectorAll('.ledger__row')];
    M.settle(() => {
      ledgerRows.forEach((row) => {
        const shown = row.querySelector('.ledger__shows > .tag');
        row.style.setProperty('--drop', shown.offsetTop + shown.offsetHeight + 'px');
      });
    });

    document.querySelectorAll('[data-belt]').forEach((belt) => {
      const run = belt.querySelector('.belt__run');
      const wheels = [...belt.querySelectorAll('.belt__wheel')];
      const spokes = wheels.map((wheel) => wheel.querySelector('.belt__spokes'));
      const rider = belt.querySelector('.belt__rider');
      const lap = { total: 0, at: 0, seen: false, last: 0, beat: 0, turn: 0, r: 30 };
      const STRIDE = 5.4;
      const TURN = 16;
      const OUT_ABOVE = 30;
      const OUT_BELOW = 14;
      const outline = (w, r) => 'M' + r + ' 0H' + (w - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (w - r) + ' ' + r * 2 + 'H' + r + 'A' + r + ' ' + r + ' 0 0 1 ' + r + ' 0Z';
      function place() {
        if (!lap.total) return;
        const here = run.getPointAtLength(lap.at % lap.total);
        const next = run.getPointAtLength((lap.at + 6) % lap.total);
        const tx = next.x - here.x;
        const ty = next.y - here.y;
        const far = Math.hypot(tx, ty) || 1;
        const out = here.y > lap.r ? OUT_BELOW : OUT_ABOVE;
        rider.style.translate = 'calc(' + fix(here.x + (ty / far) * out) + 'px - var(--ax) * 1%) calc(' + fix(here.y - (tx / far) * out) + 'px - var(--ay) * 1%)';
        rider.style.scale = tx >= 0 ? '-1 1' : '1 1';
      }
      M.settle(() => {
        const w = belt.clientWidth;
        const r = parseFloat(getComputedStyle(belt).getPropertyValue('--r')) || 30;
        const spoke = r - 7;
        lap.r = r;
        run.setAttribute('d', M.handCut(outline(w, r), 1.1));
        wheels.forEach((wheel, i) => {
          wheel.setAttribute('transform', 'translate(' + (i ? w - r : r) + ' ' + r + ')');
          wheel.querySelector('.belt__rim').setAttribute('r', r - 3.5);
        });
        spokes.forEach((node) => node.setAttribute('d', [0, 60, 120].map((deg) => {
          const x = fix(Math.cos((deg * Math.PI) / 180) * spoke);
          const y = fix(Math.sin((deg * Math.PI) / 180) * spoke);
          return 'M' + -x + ' ' + -y + 'L' + x + ' ' + y;
        }).join('')));
        lap.total = run.getTotalLength();
        if (still.matches || !lap.at) lap.at = (w - r * 2) * 0.47;
        place();
      });
      new IntersectionObserver((entries) => {
        lap.seen = entries[0].isIntersecting;
      }, { rootMargin: '10% 0px' }).observe(belt);
      function stride(now) {
        if (lap.seen && now - lap.last >= FRAME) {
          lap.last = now;
          lap.beat += 1;
          lap.at += STRIDE;
          place();
          if (lap.beat % 2 === 0) {
            lap.turn = (lap.turn + TURN) % 360;
            spokes.forEach((node) => node.setAttribute('transform', 'rotate(' + lap.turn + ')'));
          }
        }
        requestAnimationFrame(stride);
      }
      if (!still.matches) requestAnimationFrame(stride);
    });

    document.querySelectorAll('.code form').forEach((form) => {
      const slip = form.closest('.hang').querySelector('.code__slip');
      if (!slip) return;
      new MutationObserver(() => {
        if (!form.classList.contains('is-sent') || slip.classList.contains('is-given')) return;
        const tag = slip.querySelector('.tag');
        const dash = tag.querySelector('.tag__dash');
        if (dash) dash.remove();
        tag.classList.remove('tag--planned');
        tag.classList.add('tag--amber');
        slip.classList.remove('hang--planned');
        slip.classList.add('is-given');
      }).observe(form, { attributes: true, attributeFilter: ['class'] });
    });
  });
})();
