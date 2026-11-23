(() => {
  const M = window.Memoris;
  const { fix, between, polyline } = M.util;
  const root = document.documentElement;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const STORE_LINK = 'index.html#top';
  const PAGES = [['how-it-works.html', 'How it works'], ['caregivers.html', 'For caregivers'], ['clinicians.html', 'For clinicians'], ['science.html', 'The science'], ['about.html', 'About']];
  const LEGAL = [['terms.html', 'Terms of Use'], ['privacy.html', 'Privacy Policy'], ['consumer-health-data.html', 'Consumer Health Data Privacy Disclosure']];
  const GYRI = { c: 'M92 12C28 30 18 112 82 148', s: 'M100 14C40 20 24 60 60 82C96 104 84 146 24 150', h: 'M22 26C82 20 112 72 84 110C66 134 30 128 26 102' };
  const here = window.location.pathname.split('/').pop() || 'index.html';
  const readyQueue = [];
  const followers = [];
  const settlers = [];
  M.scenes = M.scenes || {};
  M.scenes.phone = M.scenes.phone || ((el) => {
    const given = el.dataset;
    const held = M.phone({ pose: given.pose, mood: given.mood, arm: given.arm, hold: given.hold, prop: given.prop, marks: given.marks, look: given.look, kept: given.kept, rim: given.rim, flip: el.hasAttribute('data-flip'), near: el.hasAttribute('data-near') });
    return { box: held.box.join(' '), svg: held.svg };
  });
  M.scenes.threshold = M.scenes.threshold || ((el) => ({ box: M.threshold.box.join(' '), svg: M.threshold({ kept: el.dataset.kept, mood: el.dataset.mood, left: el.dataset.left, prop: el.dataset.prop, wall: el.dataset.wall !== 'none' }) }));
  M.scenes.pair = M.scenes.pair || ((el) => ({ box: M.pair.box.join(' '), svg: M.pair({ left: el.dataset.left, prop: el.dataset.prop, mood: el.dataset.mood }) }));
  M.still = still;
  M.ready = (fn) => readyQueue.push(fn);
  M.follow = (fn) => followers.push(fn);
  M.settle = (fn) => settlers.push(fn);

  const failed = new Set();
  function guarded(fn, argument) {
    if (failed.has(fn)) return false;
    try {
      return fn(argument);
    } catch (error) {
      failed.add(fn);
      setTimeout(() => {
        throw error;
      });
      return false;
    }
  }
  const MENU_NOD_AFTER = 520;
  const home = 'href="index.html"' + (here === 'index.html' ? ' aria-current="page"' : '');
  const linkList = (list) => list.map(([href, label]) => '<a href="' + href + '"' + (href === here ? ' aria-current="page"' : '') + '>' + label + '</a>');
  function chrome() {
    const tint = document.querySelector('meta[name="theme-color"]') || document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'theme-color' }));
    tint.content = M.paper;
    if (document.body.dataset.chrome === 'none') return;
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main';
    const skip = document.createElement('a');
    skip.className = 'skip';
    skip.href = '#' + (main ? main.id : '');
    skip.textContent = 'Skip to content';
    document.body.prepend(skip);

    let top = document.querySelector('[data-masthead]');
    if (!top) {
      top = document.createElement('header');
      skip.after(top);
    }
    top.classList.add('top');
    top.innerHTML = '<a class="brand d" ' + home + ' aria-label="Memoris, home"><svg data-mark aria-hidden="true"></svg>Memoris</a>' +
      '<a class="btn btn--small top__get" data-store>Download</a>' +
      '<nav aria-label="Main">' + linkList(PAGES).join('') + '</nav>' +
      '<button class="btn btn--small btn--quiet top__menu" type="button" aria-expanded="false" aria-controls="menu">Menu</button>';

    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = 'menu';
    menu.setAttribute('inert', '');
    menu.innerHTML = '<div class="menu__sheet" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="menu__top"><a class="brand d" ' + home + ' aria-label="Memoris, home"><svg data-mark data-ground="lilac" aria-hidden="true"></svg>Memoris</a>' +
      '<button class="btn btn--small btn--quiet" type="button" data-menu-close>Close</button></div>' +
      '<nav class="menu__list d" aria-label="Menu"><svg class="menu__phone" data-scene="phone" data-mood="glad" data-flip aria-hidden="true"></svg>' + linkList(PAGES).map((link, i) => link.replace('<a ', '<a style="--i:' + i + '" ')).join('') + '</nav>' +
      '<a class="btn" data-store>Download on the App Store</a></div><div class="menu__edge"></div>';
    top.after(menu);

    const [pinLabel, pinTarget] = (document.body.dataset.pin || '').split('|');
    if (pinLabel !== 'none') {
      const pin = document.createElement('a');
      pin.className = 'pin';
      if (pinTarget) pin.setAttribute('href', pinTarget.trim());
      else pin.dataset.store = '';
      const words = document.createElement('span');
      words.className = 'tag__in';
      words.textContent = pinLabel.trim() || 'Download';
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.append(words);
      pin.append(tag);
      pin.dataset.pin = '';
      menu.after(pin);
    }

    let foot = document.querySelector('[data-footer]');
    if (!foot) {
      foot = document.createElement('footer');
      document.body.append(foot);
    }
    foot.classList.add('foot');
    foot.innerHTML = '<div class="fold"></div><div class="wrap"><div class="foot__grid">' +
      '<a class="brand d" ' + home + ' aria-label="Memoris, home"><svg data-mark data-tone="light" aria-hidden="true"></svg>Memoris</a>' +
      '<ul>' + linkList(PAGES.concat(LEGAL)).map((link) => '<li>' + link + '</li>').join('') + '</ul></div>' +
      '<div class="foot__base"><span>© 2026 Memoris AI, Inc.</span><a href="mailto:support@memoris.ai">support@memoris.ai</a></div></div>';

    const opener = top.querySelector('.top__menu');
    const closer = menu.querySelector('[data-menu-close]');
    const guide = menu.querySelector('.menu__phone');
    const here = menu.querySelector('.menu__list a[aria-current]');
    const setMenu = (open) => {
      if (open === menu.classList.contains('is-open')) return;
      menu.classList.toggle('is-open', open);
      root.classList.toggle('is-locked', open);
      opener.setAttribute('aria-expanded', String(open));
      [...document.body.children].forEach((part) => {
        if (part === menu || part.tagName === 'SCRIPT') return;
        if (open) part.setAttribute('inert', '');
        else part.removeAttribute('inert');
      });
      if (open) {
        menu.removeAttribute('inert');
        guide.style.top = (here ? here.offsetTop : 0) + 'px';
        closer.focus({ preventScroll: true });
        setTimeout(() => M.nod(guide), MENU_NOD_AFTER);
      } else {
        menu.setAttribute('inert', '');
      }
    };
    opener.addEventListener('click', () => setMenu(true));
    closer.addEventListener('click', () => {
      setMenu(false);
      opener.focus({ preventScroll: true });
    });
    menu.addEventListener('click', (event) => {
      if (event.target === menu || event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !menu.classList.contains('is-open')) return;
      setMenu(false);
      opener.focus({ preventScroll: true });
    });
    window.matchMedia('(min-width: 1100px)').addEventListener('change', () => setMenu(false));
  }

  const TRACE_STEP = 4.5;
  const TRACE_SWAY = 1.15;
  const TRACE_PITCH = 0.05;
  const TRACE_MIN = 16;
  const TRACINGS = 3;
  function waver(x, y, tracing) {
    const a = x * TRACE_PITCH;
    const b = y * TRACE_PITCH;
    const s = tracing * 2.39;
    return [
      0.62 * Math.sin(a + b * 0.6 + s * 1.7) + 0.38 * Math.sin(a * 2.7 - b * 1.9 + s * 3.1 + 1.3),
      0.62 * Math.sin(b * 1.1 - a * 0.5 + s * 2.3 + 0.7) + 0.38 * Math.sin(b * 2.5 + a * 2.1 + s * 1.3 + 2.9)
    ];
  }
  function outlineOf(el) {
    const n = (name) => Number(el.getAttribute(name) || 0);
    if (el.tagName === 'path') return el.getAttribute('d');
    if (el.tagName === 'rect') {
      const [x, y, w, h, r] = [n('x'), n('y'), n('width'), n('height'), n('rx')];
      return 'M' + (x + r) + ' ' + y + 'H' + (x + w - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + w) + ' ' + (y + r) + 'V' + (y + h - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + w - r) + ' ' + (y + h) + 'H' + (x + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + x + ' ' + (y + h - r) + 'V' + (y + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + y + 'Z';
    }
    const rx = el.tagName === 'circle' ? n('r') : n('rx');
    const ry = el.tagName === 'circle' ? n('r') : n('ry');
    return 'M' + (n('cx') - rx) + ' ' + n('cy') + 'A' + rx + ' ' + ry + ' 0 1 0 ' + (n('cx') + rx) + ' ' + n('cy') + 'A' + rx + ' ' + ry + ' 0 1 0 ' + (n('cx') - rx) + ' ' + n('cy') + 'Z';
  }
  function traceStroke(d, scale, step) {
    const ruler = polyline(d);
    const total = ruler.total;
    if (total * scale < TRACE_MIN) return null;
    const closed = /z\s*$/i.test(d);
    const count = Math.min(Math.max(Math.round((total * scale) / step), 5), 320);
    const points = [];
    for (let i = 0; i < (closed ? count : count + 1); i++) points.push(ruler.at((i / count) * total));
    const out = [];
    for (let tracing = 0; tracing < TRACINGS; tracing++) {
      const moved = points.map((p) => {
        const w = waver(p[0] * scale, p[1] * scale, tracing);
        return [p[0] + (w[0] * TRACE_SWAY) / scale, p[1] + (w[1] * TRACE_SWAY) / scale];
      });
      const last = moved.length - 1;
      let path;
      if (closed) {
        path = 'M' + between(moved[last], moved[0]);
        moved.forEach((p, i) => {
          path += 'Q' + fix(p[0]) + ' ' + fix(p[1]) + ' ' + between(p, moved[(i + 1) % moved.length]);
        });
        path += 'Z';
      } else {
        path = 'M' + fix(moved[0][0]) + ' ' + fix(moved[0][1]) + 'L' + between(moved[0], moved[1]);
        for (let i = 1; i < last; i++) path += 'Q' + fix(moved[i][0]) + ' ' + fix(moved[i][1]) + ' ' + between(moved[i], moved[i + 1]);
        path += 'L' + fix(moved[last][0]) + ' ' + fix(moved[last][1]);
      }
      out.push(path);
    }
    return out;
  }
  function planTrace(svg, fallback) {
    const jobs = [];
    svg.querySelectorAll('.boil path,.boil ellipse,.boil circle,.boil rect').forEach((el) => {
      if (el.closest('.k-pupil,.k-gaze,clipPath') || el.hasAttribute('data-still')) return;
      const ctm = el.getCTM();
      jobs.push({ el, scale: (ctm && Math.sqrt(Math.abs(ctm.a * ctm.d - ctm.b * ctm.c))) || fallback, step: el.hasAttribute('data-fine') ? TRACE_STEP * 0.55 : TRACE_STEP, outline: outlineOf(el) });
    });
    return jobs;
  }
  function measureTrace(jobs) {
    jobs.forEach((job) => {
      const strokes = job.outline.split(/(?=M)/).map((piece) => traceStroke(piece, job.scale, job.step));
      if (strokes.some((stroke) => !stroke)) return;
      job.tracings = [];
      for (let tracing = 0; tracing < TRACINGS; tracing++) job.tracings.push(strokes.map((stroke) => stroke[tracing]).join(''));
    });
  }
  function writeTrace(jobs) {
    const traced = [];
    jobs.forEach((job) => {
      if (!job.tracings) return;
      let target = job.el;
      if (target.tagName !== 'path') {
        target = document.createElementNS(SVG_NS, 'path');
        [...job.el.attributes].forEach((attr) => {
          if (!/^(cx|cy|r|rx|ry|x|y|width|height)$/.test(attr.name)) target.setAttribute(attr.name, attr.value);
        });
        job.el.replaceWith(target);
      }
      target.tracings = job.tracings;
      target.setAttribute('d', target.tracings[0]);
      traced.push(target);
    });
    return traced;
  }

  const FRAMES_PER_SECOND = 12;
  const BOIL_EVERY = 2;
  const FIN_CYCLE = [-9, 0, 9, 0];
  const BLINK_FRAMES = 2;
  const HOP_LIFT = [0, -7, -12, -9, -3, 0];
  const POP_SCALES = [0.5, 1.14, 0.95, 1];
  const POP_EVERY = 2;
  const POP_AFTER = 5;
  const POINTER_REST_AFTER = 3500;
  const LOOK_REACH = [3.8, 3.4];
  const LOOK_FULL_AT = 110;
  const SLIDE_FROM = 0.12;
  const SLIDE_SPAN = 0.76;
  const stages = [];
  const pointer = { x: 0, y: 0, at: -1e9 };
  let frame = 0;
  const watch = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target.stage) entry.target.stage.live = entry.isIntersecting;
    });
  }, { rootMargin: '12% 0px' });
  function stageFor(el, traced) {
    const previous = stages.indexOf(el.stage);
    if (previous >= 0) stages.splice(previous, 1);
    const all = (selector) => [...el.querySelectorAll(selector)];
    const hops = all('.k').map((node) => {
      const hop = { node: node.querySelector('.k-hop'), from: -99 };
      node.addEventListener('pointerenter', () => {
        if (frame - hop.from > HOP_LIFT.length) hop.from = frame;
      });
      return hop;
    });
    const pops = all('.pop');
    if (!still.matches) pops.forEach((node) => node.setAttribute('transform', 'scale(0)'));
    const stage = {
      el, traced, hops, pops, live: false, born: 0, tracing: 0, phase: stages.length % BOIL_EVERY,
      cycles: all('.cycle').map((node) => ({ steps: [...node.children], loop: Number(node.dataset.loop || 30), every: Number(node.dataset.every || 4) })),
      bobs: all('.bob'), sways: all('.sway'), swings: all('.swing'), fins: all('.k-fin'), arms: all('.k-arm'), slides: all('.slide'), pupils: all('.k-pupil'),
      eyes: all('.k-eye').map((node) => ({ node, next: 20 + Math.floor(Math.random() * 60) }))
    };
    stage.slides.forEach((node) => {
      const [x, y] = M.threadPoint(node.dataset.line.split(' ').map(Number), 0.56);
      node.setAttribute('transform', 'translate(' + fix(x) + ' ' + fix(y) + ')');
    });
    stages.push(stage);
    el.stage = stage;
    watch.observe(el);
  }
  function mountScene(el) {
    const scene = M.scenes[el.dataset.scene];
    if (!scene) return 0;
    const made = guarded(scene, el);
    if (!made) return 0;
    if (made.box) el.setAttribute('viewBox', made.box);
    el.innerHTML = made.svg || made;
    return 1;
  }
  function mountKeeper(el) {
    const options = readOptions(el.dataset.keeper);
    ['carry', 'hold'].forEach((key) => {
      const named = options[key];
      if (typeof named === 'string' && M.tagMarks.includes(named) && !(key === 'hold' && M.holdables.includes(named))) options[key] = { mark: named };
    });
    const size = Number(el.dataset.size || 1);
    options.ink = Math.max(1.9, 2.7 / size);
    const k = M.keeper(options);
    const flip = el.hasAttribute('data-flip');
    const [bx, by, bw, bh] = k.box;
    const left = flip ? -(bx + bw) : bx;
    const anchor = k.anchors[el.dataset.by || k.by] || k.anchors.head;
    el.setAttribute('viewBox', [left, by, bw, bh].map(fix).join(' '));
    el.setAttribute('width', fix(bw * size));
    el.setAttribute('height', fix(bh * size));
    el.style.setProperty('--w', fix(bw * size));
    el.style.setProperty('--ax', fix((((flip ? -anchor[0] : anchor[0]) - left) / bw) * 100));
    el.style.setProperty('--ay', fix(((anchor[1] - by) / bh) * 100));
    const alive = options.stage !== 'rough' && options.stage !== 'ink';
    el.classList.toggle('boil', alive);
    el.innerHTML = '<g transform="scale(' + (flip ? -1 : 1) + ' 1)"><g' + (alive ? ' class="sway" data-a="' + (el.dataset.sway || 2.2) + '" data-s=".2" data-p="' + Math.random().toFixed(2) + '" data-x="' + fix(anchor[0]) + '" data-y="' + fix(anchor[1]) + '"' : '') + '>' + k.svg + '</g></g>';
    const host = el.closest('.hang');
    if (host && el.hasAttribute('data-lift')) host.style.marginTop = fix((anchor[1] - by) * size - 8) + 'px';
    return size;
  }
  const NOTE_PAD = 8;
  function mountNote(el) {
    const options = readOptions(el.dataset.note);
    const size = Number(el.dataset.size || 1);
    const o = M.util.defaults({ mark: 'lines', length: 22, w: 30, h: 38 }, options);
    ['fill', 'string'].forEach((key) => {
      if (typeof o[key] === 'string' && M.colors[o[key]]) o[key] = M.colors[o[key]];
    });
    const width = o.w + NOTE_PAD * 2;
    const height = o.length + (o.gone ? 22 : o.h) + NOTE_PAD * 2;
    el.setAttribute('viewBox', [-width / 2, -NOTE_PAD, width, height].map(fix).join(' '));
    el.setAttribute('width', fix(width * size));
    el.setAttribute('height', fix(height * size));
    el.style.setProperty('--w', fix(width * size));
    el.style.setProperty('--ax', 50);
    el.style.setProperty('--ay', fix((NOTE_PAD / height) * 100));
    el.classList.add('boil', 'held--note');
    el.innerHTML = '<g class="pop"><g class="swing" data-a="' + (el.dataset.sway || 4) + '" data-s=".3" data-p="' + Math.random().toFixed(2) + '">' + M.miniTag(o) + '</g></g>';
    return size;
  }
  function readOptions(text) {
    const options = {};
    String(text || '').split(';').forEach((pair) => {
      const at = pair.indexOf(':');
      if (at < 0) return;
      const value = pair.slice(at + 1).trim();
      options[pair.slice(0, at).trim()] = value === 'true' ? true : value !== '' && !Number.isNaN(Number(value)) ? Number(value) : value;
    });
    return options;
  }
  function inkIn(drawings) {
    drawings.forEach((drawing) => {
      drawing.jobs = planTrace(drawing.el, drawing.scale);
    });
    drawings.forEach((drawing) => measureTrace(drawing.jobs));
    drawings.forEach((drawing) => stageFor(drawing.el, writeTrace(drawing.jobs)));
  }
  function mount(scope) {
    const area = scope || document;
    area.querySelectorAll('svg[data-mark]').forEach((el) => {
      el.setAttribute('viewBox', M.mark.box.join(' '));
      el.innerHTML = M.mark(el.dataset.tone === 'light' ? 'dark' : 'light', M.colors[el.dataset.ground]);
    });
    area.querySelectorAll('svg[data-gyrus]').forEach((el) => {
      el.setAttribute('viewBox', '0 0 120 160');
      el.innerHTML = '<path d="' + (GYRI[el.dataset.gyrus] || GYRI.c) + '"/>';
    });
    const drawings = [];
    const draw = (make) => (el) => {
      const scale = make(el);
      if (scale) drawings.push({ el, scale });
    };
    area.querySelectorAll('svg[data-scene]').forEach(draw(mountScene));
    area.querySelectorAll('svg[data-keeper]').forEach(draw(mountKeeper));
    area.querySelectorAll('svg[data-note]').forEach(draw(mountNote));
    inkIn(drawings);
    area.querySelectorAll('[data-store]').forEach((el) => {
      el.setAttribute('href', STORE_LINK);
    });
    area.querySelectorAll('.tag,.btn').forEach(watchCut);
    area.querySelectorAll('.rv').forEach((el) => {
      if (!el.closest('[data-wait-fonts]')) reveal.observe(el);
    });
  }

  const CUT_STEP = 52;
  const CUT_SWAY = 1.1;
  const CUT_INNER = 0.55;
  const TEAR_STEP = 8;
  const TEAR_DEPTH = [2, 7, 8];
  const TEAR_BACK = 6;
  const TORN_EDGE = { right: 2, bottom: 3, left: 4 };
  const TEAR_INWARD = { 2: [-1, 0], 3: [0, -1], 4: [1, 0] };
  function cutOutline(w, h, corner, side, seed, gain, counts, torn) {
    const m = CUT_SWAY * gain;
    const c = Math.max(corner - m, 0);
    const [x0, y0, x1, y1] = [m, m, w - m, h - m];
    const corners = side ? [[x0 + c, y0], [x1, y0], [x1, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c]] : [[x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1], [x0, y1], [x0, y0 + c]];
    if (!side && torn === TORN_EDGE.right) {
      corners[1] = corners[2] = [x1 - TEAR_BACK, y0];
      corners[3] = [x1 - TEAR_BACK, y1];
    }
    if (!side && torn === TORN_EDGE.bottom) {
      corners[3] = [x1, y1 - TEAR_BACK];
      corners[4] = [x0, y1 - TEAR_BACK];
    }
    if (!side && torn === TORN_EDGE.left) {
      corners[5] = corners[0] = [x0 + TEAR_BACK, y0];
      corners[4] = [x0 + TEAR_BACK, y1];
    }
    const points = [];
    corners.forEach((a, i) => {
      const b = corners[(i + 1) % corners.length];
      const tearing = !side && torn === i;
      if (counts.length <= i) counts.push(Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / (tearing ? TEAR_STEP : CUT_STEP))));
      for (let j = 0; j < counts[i]; j++) {
        if (tearing) {
          const chance = Math.abs(Math.sin(j * 12.9898 + seed * 78.233) * 43758.5453) % 1;
          const slip = (Math.abs(Math.sin(j * 4.1 + seed * 9.7) * 917.3) % 1) - 0.5;
          const deep = j === 0 ? 0 : TEAR_DEPTH[0] + TEAR_DEPTH[1] * (0.5 + 0.5 * Math.sin(j * 0.47 + seed * 2.3)) + chance * chance * TEAR_DEPTH[2] - TEAR_BACK;
          const along = (j + slip * 0.6) / counts[i];
          points.push(fix(a[0] + (b[0] - a[0]) * along + TEAR_INWARD[i][0] * deep) + 'px ' + fix(a[1] + (b[1] - a[1]) * along + TEAR_INWARD[i][1] * deep) + 'px');
          continue;
        }
        const t = i + j / counts[i];
        const dx = m * (0.6 * Math.sin(t * 2.9 + seed) + 0.4 * Math.sin(t * 7.3 + seed * 1.9));
        const dy = m * (0.6 * Math.sin(t * 3.4 + seed * 1.3 + 2) + 0.4 * Math.sin(t * 6.1 + seed * 0.7 + 5));
        points.push(fix(a[0] + ((b[0] - a[0]) * j) / counts[i] + dx) + 'px ' + fix(a[1] + ((b[1] - a[1]) * j) / counts[i] + dy) + 'px');
      }
    });
    return 'polygon(' + points.join(',') + ')';
  }
  function dashOutline(el, outline) {
    let dash = el.querySelector(':scope > .tag__dash');
    if (!dash) {
      dash = document.createElementNS(SVG_NS, 'svg');
      dash.setAttribute('class', 'tag__dash');
      dash.setAttribute('aria-hidden', 'true');
      dash.innerHTML = '<polygon fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="8 6.5" stroke-linejoin="round" stroke-linecap="round"/>';
      el.appendChild(dash);
    }
    dash.firstChild.setAttribute('points', outline.slice(8, -1).replace(/px/g, ''));
  }
  const cutSeeds = new Map();
  function cut(el) {
    if (!el.offsetWidth) return;
    const corner = parseFloat(getComputedStyle(el).getPropertyValue('--cut')) || 20;
    const side = el.matches('.btn,.flag .tag');
    const counts = [];
    const seed = cutSeeds.get(el);
    const torn = TORN_EDGE[el.dataset.torn];
    if (el.classList.contains('tag--planned')) {
      dashOutline(el, cutOutline(el.offsetWidth, el.offsetHeight, corner, side, seed, 1, counts, torn));
      return;
    }
    el.style.clipPath = cutOutline(el.offsetWidth, el.offsetHeight, corner, side, seed, 1, counts, torn);
    const inner = el.querySelector(':scope > .tag__in');
    if (inner) inner.style.clipPath = cutOutline(inner.offsetWidth, inner.offsetHeight, corner - 1, side, seed, CUT_INNER, counts, torn);
  }
  const recut = new ResizeObserver((entries) => entries.forEach((entry) => cut(entry.target)));
  function watchCut(el) {
    if (cutSeeds.has(el)) return;
    cutSeeds.set(el, cutSeeds.size * 1.7 + 0.4);
    recut.observe(el);
  }

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      reveal.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
  const FONT_WAIT = 1500;

  const wave = (t, node) => Math.sin(2 * Math.PI * (t * Number(node.dataset.s || 0.3) + Number(node.dataset.p || 0)));
  function look(pupil, watching) {
    let dx = M.lookRest[0];
    let dy = M.lookRest[1];
    const ctm = watching && pupil.parentNode.getScreenCTM();
    if (ctm) {
      const at = new DOMPoint(pointer.x, pointer.y).matrixTransform(ctm.inverse());
      const vx = at.x - M.eyeAt[0];
      const vy = at.y - M.eyeAt[1];
      const far = Math.hypot(vx, vy) || 1;
      const pull = Math.min(far / LOOK_FULL_AT, 1);
      dx = (vx / far) * LOOK_REACH[0] * pull;
      dy = (vy / far) * LOOK_REACH[1] * pull;
    }
    pupil.setAttribute('transform', 'translate(' + fix(dx) + ' ' + fix(dy) + ')');
  }
  function draw() {
    const t = frame / FRAMES_PER_SECOND;
    const watching = performance.now() - pointer.at < POINTER_REST_AFTER;
    stages.forEach((stage) => {
      if (!stage.live) return;
      if (!stage.born) stage.born = frame;
      if (frame % BOIL_EVERY === stage.phase) {
        stage.tracing = (stage.tracing + 1) % TRACINGS;
        stage.traced.forEach((node) => node.setAttribute('d', node.tracings[stage.tracing]));
        stage.pupils.forEach((pupil) => look(pupil, watching));
      }
      stage.pops = stage.pops.filter((node, i) => {
        const step = frame - stage.born - POP_AFTER - i * POP_EVERY;
        if (step < 0) return true;
        node.setAttribute('transform', 'scale(' + POP_SCALES[Math.min(step, POP_SCALES.length - 1)] + ')');
        return step < POP_SCALES.length - 1;
      });
      stage.cycles.forEach((cycle) => {
        cycle.steps.forEach((node, i) => node.setAttribute('opacity', frame % cycle.loop >= (i + 1) * cycle.every ? 1 : 0));
      });
      stage.hops.forEach((hop) => {
        const step = frame - hop.from;
        if (step <= HOP_LIFT.length) hop.node.setAttribute('transform', 'translate(0 ' + (HOP_LIFT[step] || 0) + ')');
      });
      stage.bobs.forEach((node) => node.setAttribute('transform', 'translate(0 ' + fix(wave(t, node) * Number(node.dataset.a)) + ')'));
      stage.sways.forEach((node) => node.setAttribute('transform', 'rotate(' + fix(wave(t, node) * Number(node.dataset.a)) + ' ' + (node.dataset.x || 0) + ' ' + (node.dataset.y || 0) + ')'));
      stage.swings.forEach((node) => node.setAttribute('transform', 'rotate(' + fix(wave(t, node) * Number(node.dataset.a)) + ')'));
      stage.fins.forEach((node, i) => node.setAttribute('transform', 'rotate(' + FIN_CYCLE[(Math.floor(frame / 2) + i) % FIN_CYCLE.length] + ')'));
      stage.arms.forEach((node, i) => node.setAttribute('transform', 'rotate(' + fix(Math.sin(t * 2.2 + i) * Number(node.dataset.a || 7)) + ')'));
      stage.slides.forEach((node) => {
        const lap = (t * Number(node.dataset.s)) % 1;
        const [x, y] = M.threadPoint(node.dataset.line.split(' ').map(Number), SLIDE_FROM + SLIDE_SPAN * Math.min(lap / 0.8, 1));
        node.setAttribute('transform', 'translate(' + fix(x) + ' ' + fix(y) + ')');
      });
      stage.eyes.forEach((eyeState) => {
        const shut = frame >= eyeState.next && frame < eyeState.next + BLINK_FRAMES;
        eyeState.node.setAttribute('transform', shut ? 'translate(0 -4) scale(1 .1) translate(0 4)' : '');
        if (frame >= eyeState.next + BLINK_FRAMES) eyeState.next = frame + 30 + Math.floor(Math.random() * 70);
      });
    });
  }
  let lastDrawn = 0;
  function tick(now) {
    if (now - lastDrawn >= 1000 / FRAMES_PER_SECOND) {
      lastDrawn = now;
      frame += 1;
      draw();
      pinWatch.look();
    }
    if (!still.matches) requestAnimationFrame(tick);
  }
  M.nod = (el) => {
    if (el && el.stage) el.stage.hops.forEach((hop) => {
      hop.from = frame;
    });
  };
  M.act = (el, name) => {
    if (!el) return;
    el.querySelectorAll('[data-act]').forEach((part) => part.setAttribute('display', part.dataset.act === name ? 'inline' : 'none'));
    el.dataset.acting = name;
  };
  const DRAW_ON = 'path,ellipse,circle,rect,line,polyline,polygon';
  M.drawOn = (el, t) => {
    if (!el) return;
    if (!el.strokes) {
      let run = 0;
      el.strokes = [...el.querySelectorAll(DRAW_ON)].map((node) => {
        const length = node.getTotalLength ? node.getTotalLength() : 1;
        node.setAttribute('pathLength', 1);
        node.setAttribute('stroke-dasharray', '1 1');
        const stroke = { node, from: run, length };
        run += length;
        return stroke;
      });
      el.strokesTotal = run || 1;
    }
    const drawn = Math.min(Math.max(t, 0), 1) * el.strokesTotal;
    el.strokes.forEach((stroke) => {
      const done = Math.min(Math.max((drawn - stroke.from) / stroke.length, 0), 1);
      stroke.node.style.visibility = done > 0 ? '' : 'hidden';
      stroke.node.setAttribute('stroke-dashoffset', (1 - done).toFixed(3));
    });
  };
  M.mount = mount;
  const pinWatch = { recount: () => {}, look: () => {} };
  M.remount = (el) => {
    if (el && mountScene(el)) inkIn([{ el, scale: 1 }]);
    pinWatch.recount();
  };

  const SWAY_PER_SPEED = 0.11;
  const SWAY_MAX = 2.8;
  const SWAY_FULL_WIDTH = 300;
  const SWAY_PULL = 0.085;
  const SWAY_DRAG = 0.86;
  const FOLD_RISE = 0.03;
  const FOLD_RISE_MAX = 13;
  const FOLLOW = 0.2;
  const DRIFT = 0.09;
  const motion = { running: false, y: window.scrollY, at: 0, sway: 0, speed: 0 };
  let hangs = [];
  let folds = [];
  let drifters = [];
  const nearby = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target.moving) entry.target.moving.near = entry.isIntersecting;
    });
  }, { rootMargin: '10% 0px' });
  function pinned(el) {
    for (let up = el.parentElement; up && up !== document.body; up = up.parentElement) {
      const position = getComputedStyle(up).position;
      if (position === 'sticky' || position === 'fixed') return true;
    }
    return false;
  }
  function gather() {
    const track = (el, item) => {
      if (el.moving) return el.moving;
      el.moving = item;
      nearby.observe(el);
      return item;
    };
    hangs = [...document.querySelectorAll('.hang,.pin')].map((el, i) => track(el, { el, near: false, lean: (i % 2 ? -1 : 1) * (0.55 + ((i * 37) % 10) / 20), gain: 0 }));
    folds = [...document.querySelectorAll('.fold')].filter((el) => !pinned(el)).map((el) => track(el, { el, near: false, top: 0 }));
    drifters = [...document.querySelectorAll('.gyrus,[data-drift]')].map((el) => track(el, { el, near: false, top: 0, rate: DRIFT * Number(el.dataset.drift || 1) }));
  }
  function place() {
    drifters.forEach((item) => {
      item.el.style.translate = '';
      const box = item.el.getBoundingClientRect();
      item.top = box.top + window.scrollY + box.height / 2;
    });
    folds.forEach((fold) => {
      fold.top = fold.el.getBoundingClientRect().top + window.scrollY;
    });
    hangs.forEach((hang) => {
      hang.gain = hang.lean * Math.min(1, SWAY_FULL_WIDTH / (hang.el.offsetWidth || SWAY_FULL_WIDTH));
    });
  }
  function step(now) {
    const elapsed = Math.min(now - motion.at || 16.7, 50);
    const beat = elapsed / 16.7;
    motion.at = now;
    const y = window.scrollY;
    const moved = y - motion.y;
    motion.y = y;
    const goal = Math.max(Math.min((moved / beat) * SWAY_PER_SPEED, SWAY_MAX), -SWAY_MAX);
    motion.speed = (motion.speed + (goal - motion.sway) * SWAY_PULL * beat) * Math.pow(SWAY_DRAG, beat);
    motion.sway += motion.speed * beat;
    let busy = moved !== 0 || Math.abs(motion.sway) > 0.02 || Math.abs(motion.speed) > 0.02;
    hangs.forEach((hang) => {
      if (hang.near) hang.el.style.setProperty('--sw', (motion.sway * hang.gain).toFixed(2) + 'deg');
    });
    const middle = y + window.innerHeight / 2;
    drifters.forEach((item) => {
      if (item.near) item.el.style.translate = '0 ' + fix((item.top - middle) * item.rate) + 'px';
    });
    folds.forEach((fold) => {
      if (fold.near) fold.el.style.setProperty('--fy', fix(Math.max(Math.min((fold.top - middle) * FOLD_RISE, FOLD_RISE_MAX), -FOLD_RISE_MAX)) + 'px');
    });
    const state = { y, height: window.innerHeight, ease: 1 - Math.pow(1 - FOLLOW, beat) };
    followers.forEach((follower) => {
      if (guarded(follower, state)) busy = true;
    });
    if (busy) {
      requestAnimationFrame(step);
      return;
    }
    motion.running = false;
    hangs.forEach((hang) => hang.el.style.setProperty('--sw', '0deg'));
  }
  function wake() {
    if (motion.running || still.matches) return;
    motion.running = true;
    motion.at = 0;
    requestAnimationFrame(step);
  }
  function settle() {
    settlers.forEach(guarded);
    place();
    wake();
  }
  M.wake = wake;
  M.resettle = settle;

  function pinDown() {
    const pin = document.querySelector('a.pin');
    if (!pin) return;
    const first = document.querySelector('[data-opener],.opener,main > :first-child');
    const closing = document.querySelector('.closing');
    const PIN_NUDGE = 6;
    let from = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const inside = y > (first ? first.offsetHeight : window.innerHeight);
      const ending = closing && closing.getBoundingClientRect().top < window.innerHeight;
      if (!inside || ending || y > from + PIN_NUDGE) pin.classList.remove('is-down');
      else if (y < from - PIN_NUDGE) pin.classList.add('is-down');
      if (Math.abs(y - from) > PIN_NUDGE) from = y;
    }, { passive: true });
  }

  const PIN_MARGIN = 12;
  const PIN_BELOW = 14;
  const PIN_LEAD = 110;
  const PIN_LOOK_AHEAD = 320;
  const PIN_REST = 180;
  const PIN_REACH = 160;
  const PIN_RECOUNT = 240;
  const STRING_HALF = 2;
  const THREAD_LONG = 120;
  const THREAD_FLAT = 4;
  const DRAWN = '.k,svg[data-note],svg[data-scene="phone"],.tag,.btn';
  function drawnThings() {
    const things = new Set();
    document.querySelectorAll(DRAWN + ',.hang').forEach((el) => things.add(el.closest('.slide') || el));
    document.querySelectorAll('.boil path,.boil ellipse,.boil circle,.boil rect').forEach((shape) => {
      if (!shape.closest(DRAWN)) things.add(shape.closest('.slide') || shape.closest('.pop') || shape.closest('.swing') || shape);
    });
    return [...things].filter((el) => !el.closest('.pin,.menu,.veil'));
  }
  const cornersAt = (b, [dx, dy]) => [[b.x + dx, b.y + dy], [b.x + b.width + dx, b.y + dy], [b.x + dx, b.y + b.height + dy], [b.x + b.width + dx, b.y + b.height + dy]];
  function grownBox(el) {
    const ctm = el.checkVisibility && !el.checkVisibility() ? null : el.parentNode.getScreenCTM();
    if (!ctm) return null;
    const b = el.getBBox();
    const line = el.dataset.line && el.dataset.line.split(' ').map(Number);
    const stops = line ? [0, 0.5, 1].map((part) => M.threadPoint(line, SLIDE_FROM + SLIDE_SPAN * part)) : [[0, 0]];
    const xs = [];
    const ys = [];
    stops.forEach((stop) => cornersAt(b, stop).forEach(([x, y]) => {
      xs.push(ctm.a * x + ctm.c * y + ctm.e);
      ys.push(ctm.b * x + ctm.d * y + ctm.f);
    }));
    const [left, right, top, bottom] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    return { left, right, top, bottom, width: right - left, height: bottom - top };
  }
  function hostOf(el) {
    let host = el;
    while (host.ownerSVGElement) host = host.ownerSVGElement;
    return host;
  }
  function boxOf(thing) {
    const box = (thing.grows && grownBox(thing.el)) || thing.el.getBoundingClientRect();
    if (!thing.hangs) return box;
    const style = getComputedStyle(thing.el);
    const drop = parseFloat(style.paddingTop) || 0;
    const x = box.left + (box.width * (parseFloat(style.getPropertyValue('--at')) || 50)) / 100;
    return { left: x - STRING_HALF, right: x + STRING_HALF, top: box.top, bottom: box.top + drop, width: drop ? STRING_HALF * 2 : 0, height: drop };
  }
  const isShown = (el) => !el.checkVisibility || el.checkVisibility({ checkVisibilityCSS: true });
  function clippedBox(el, box) {
    const seen = { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
    for (let up = el.parentElement; up && up !== document.body; up = up.parentElement) {
      const style = getComputedStyle(up);
      if (style.overflowX === 'visible' && style.overflowY === 'visible') continue;
      const edge = up.getBoundingClientRect();
      if (style.overflowX !== 'visible') {
        seen.left = Math.max(seen.left, edge.left);
        seen.right = Math.min(seen.right, edge.right);
      }
      if (style.overflowY !== 'visible') {
        seen.top = Math.max(seen.top, edge.top);
        seen.bottom = Math.min(seen.bottom, edge.bottom);
      }
    }
    return seen;
  }
  function pinAside() {
    const pin = document.querySelector('a.pin');
    if (!pin) return;
    const lane = { left: 0, right: 0, height: 0, hosts: new Map(), near: new Set(), watch: null };
    const scrolled = { y: window.scrollY, at: 0, speed: 0, rest: 0, recount: 0 };
    const isInLane = (box, lead) => box.right > lane.left && box.left < lane.right && box.bottom > -lead && box.top < lane.height;
    const isUnder = (thing, lead) => {
      const box = boxOf(thing);
      if (!(box.width || box.height) || !isInLane(box, lead)) return false;
      if (thing.line && box.width > THREAD_LONG && box.width > box.height * THREAD_FLAT) return false;
      if (!isShown(thing.el)) return false;
      const seen = clippedBox(thing.el, box);
      const isCutAway = (box.width > 0 && seen.right <= seen.left) || (box.height > 0 && seen.bottom <= seen.top);
      return !isCutAway && isInLane(seen, lead);
    };
    const keepClear = (speed) => {
      const lead = Math.min(Math.max(speed * PIN_LOOK_AHEAD, PIN_LEAD), window.innerHeight);
      pin.classList.toggle('is-shy', [...lane.near].some((host) => lane.hosts.get(host).some((thing) => isUnder(thing, lead))));
    };
    const comeNear = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) lane.near.add(entry.target);
        else lane.near.delete(entry.target);
      });
      keepClear(scrolled.speed);
    };
    const count = () => {
      const box = pin.getBoundingClientRect();
      lane.left = box.left - PIN_MARGIN;
      lane.right = box.right + PIN_MARGIN;
      lane.height = box.height + PIN_BELOW;
      if (lane.watch) lane.watch.disconnect();
      lane.hosts.clear();
      lane.near.clear();
      drawnThings().forEach((el) => {
        const host = hostOf(el);
        if (!lane.hosts.has(host)) lane.hosts.set(host, []);
        lane.hosts.get(host).push({ el, hangs: el.classList.contains('hang'), grows: el.matches('.slide,.pop'), line: el.getAttribute('fill') === 'none' });
      });
      const above = window.innerHeight + PIN_REACH;
      const below = Math.max(window.innerHeight - lane.height - PIN_REACH, 0);
      lane.watch = new IntersectionObserver(comeNear, { rootMargin: above + 'px 0px -' + below + 'px 0px' });
      [...lane.hosts.keys()].forEach((host) => lane.watch.observe(host));
    };
    settlers.push(count);
    pinWatch.recount = () => {
      clearTimeout(scrolled.recount);
      scrolled.recount = setTimeout(count, PIN_RECOUNT);
    };
    pinWatch.look = () => {
      if (pin.classList.contains('is-down')) keepClear(scrolled.speed);
    };
    new ResizeObserver(pinWatch.recount).observe(document.body);
    window.addEventListener('scroll', () => {
      const now = performance.now();
      scrolled.speed = Math.abs(window.scrollY - scrolled.y) / Math.max(now - scrolled.at, 1);
      scrolled.y = window.scrollY;
      scrolled.at = now;
      keepClear(scrolled.speed);
      clearTimeout(scrolled.rest);
      scrolled.rest = setTimeout(() => {
        scrolled.speed = 0;
        keepClear(0);
      }, PIN_REST);
    }, { passive: true });
  }

  const VEIL_TIME = 270;
  function passages() {
    const veil = document.createElement('div');
    veil.className = 'veil';
    veil.setAttribute('aria-hidden', 'true');
    veil.innerHTML = '<div class="fold"></div>';
    document.body.append(veil);
    document.addEventListener('click', (event) => {
      const link = event.target.closest && event.target.closest('a[href]');
      if (!link || event.defaultPrevented || still.matches) return;
      if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
      const to = new URL(link.href, window.location.href);
      if (to.protocol !== window.location.protocol || to.host !== window.location.host || !/\.html$/.test(to.pathname) || to.pathname === window.location.pathname) return;
      event.preventDefault();
      veil.classList.add('is-up');
      setTimeout(() => {
        window.location.href = to.href;
      }, VEIL_TIME);
    });
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) veil.classList.remove('is-up');
    });
  }

  function forms() {
    document.querySelectorAll('form[data-form]').forEach((form) => {
      const host = form.closest('[data-form-host]') || form;
      const fields = [...form.querySelectorAll('input,textarea,select')];
      const errorOf = (field) => document.getElementById((field.getAttribute('aria-describedby') || '').split(' ')[0]);
      const setState = (state) => {
        host.dataset.state = state;
        M.nod(host.querySelector('[data-when="' + state + '"]'));
      };
      const mark = (field, bad) => {
        field.setAttribute('aria-invalid', String(bad));
        const error = errorOf(field);
        if (error) error.hidden = !bad;
        const wrap = field.closest('.field');
        if (!wrap || !bad) return;
        wrap.classList.remove('is-nope');
        wrap.getBoundingClientRect();
        wrap.classList.add('is-nope');
      };
      host.dataset.state = 'idle';
      fields.forEach((field) => field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') !== 'true' || !field.checkValidity()) return;
        mark(field, false);
        if (fields.every((other) => other.getAttribute('aria-invalid') !== 'true')) setState('idle');
      }));
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const wrong = fields.filter((field) => !field.checkValidity());
        fields.forEach((field) => mark(field, wrong.includes(field)));
        if (wrong.length) {
          setState('error');
          wrong[0].focus();
          return;
        }
        form.classList.add('is-sent');
        setState('sent');
        const sent = form.querySelector('.sent');
        if (sent) sent.focus({ preventScroll: true });
      });
    });
  }

  function accordions() {
    document.querySelectorAll('[data-faq]').forEach((list) => {
      const clerk = list.querySelector('.held');
      const send = (to) => {
        if (!clerk || clerk.parentNode === to) return;
        const from = clerk.getBoundingClientRect();
        to.appendChild(clerk);
        if (still.matches) return;
        const now = clerk.getBoundingClientRect();
        clerk.style.transition = 'none';
        clerk.style.transform = 'translate(' + fix(from.left - now.left) + 'px,' + fix(from.top - now.top) + 'px)';
        clerk.getBoundingClientRect();
        clerk.style.transition = '';
        clerk.style.transform = '';
        M.nod(clerk);
      };
      list.querySelectorAll('.qa button').forEach((button) => {
        button.addEventListener('click', () => {
          const open = button.closest('.qa').classList.toggle('is-open');
          button.setAttribute('aria-expanded', String(open));
          if (open) send(button.parentNode);
        });
      });
    });
  }

  function start() {
    root.classList.add('js');
    chrome();
    mount(document);
    Promise.race([document.fonts.ready, new Promise((done) => setTimeout(done, FONT_WAIT))]).then(() => {
      document.querySelectorAll('[data-wait-fonts] .rv').forEach((el) => reveal.observe(el));
    });
    gather();
    pinDown();
    pinAside();
    passages();
    forms();
    accordions();
    readyQueue.forEach(guarded);
    if (!still.matches) requestAnimationFrame(tick);
    still.addEventListener('change', () => window.location.reload());
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('pointermove', (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.at = performance.now();
      }, { passive: true });
    }
    settle();
    root.classList.add('is-built');
    window.addEventListener('scroll', wake, { passive: true });
    let resizing = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizing);
      resizing = requestAnimationFrame(settle);
    });
    document.fonts.ready.then(settle);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
