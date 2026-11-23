(() => {
  const M = window.Memoris;
  const { fix } = M.util;
  const root = document.documentElement;
  const still = M.still;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const article = document.querySelector('[data-legal]');
  const contents = document.querySelector('[data-contents]');
  const headings = [...article.querySelectorAll('h2,h3')];
  const blocks = [...article.querySelectorAll(':scope > h2,:scope > h3,:scope > p,:scope > ul > li')];
  const side = document.querySelector('[data-side]');
  const tools = document.querySelector('.tools');
  const wide = window.matchMedia('(min-width: 1000px)');
  const PLACE_KEY = 'memoris:place:' + document.body.dataset.doc;
  const SIZE_KEY = 'memoris:text-size';
  const READ_LINE = 0.24;
  const READ_LINE_MAX = 190;
  const SAVE_AFTER = 600;
  const RESUME_MIN_SCREENS = 1.2;
  const READING_FROM = 0.6;
  const FOUND_FOR = 2900;
  const MARKER_SIZE = 0.34;
  const TRACK_FOR = 700;

  const store = {
    read(key) {
      try {
        return JSON.parse(window.localStorage.getItem(key));
      } catch (error) {
        return null;
      }
    },
    write(key, value) {
      try {
        if (value === null) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        return;
      }
    }
  };

  const readLine = () => Math.min(window.innerHeight * READ_LINE, READ_LINE_MAX);
  const pageTop = (el) => el.getBoundingClientRect().top + window.scrollY;
  function lastAtOrAbove(tops, y) {
    let low = 0;
    let high = tops.length - 1;
    let found = -1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (tops[mid] <= y) {
        found = mid;
        low = mid + 1;
      } else high = mid - 1;
    }
    return found;
  }

  const linkOf = (scope, heading) => scope.querySelector('a[href="#' + heading.id + '"]');
  const lists = [contents];
  function markCurrent(heading) {
    lists.forEach((scope) => {
      scope.querySelectorAll('[aria-current]').forEach((link) => link.removeAttribute('aria-current'));
      scope.querySelectorAll('li.is-open').forEach((item) => item.classList.remove('is-open'));
      if (!heading) return;
      const link = linkOf(scope, heading);
      link.setAttribute('aria-current', 'location');
      const section = link.closest('.sub') ? link.closest('.sub').parentNode : link.parentNode;
      section.classList.add('is-open');
    });
  }

  function stillKeeper(options, size) {
    const k = M.keeper(Object.assign({ ink: Math.max(1.9, 2.7 / size) }, options));
    const [bx, by, bw, bh] = k.box;
    const left = -(bx + bw);
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', [left, by, bw, bh].map(fix).join(' '));
    svg.setAttribute('width', fix(bw * size));
    svg.setAttribute('height', fix(bh * size));
    svg.setAttribute('aria-hidden', 'true');
    svg.style.setProperty('--ax', fix(((-k.anchors.curl[0] - left) / bw) * 100));
    svg.style.setProperty('--ay', fix(((k.anchors.curl[1] - by) / bh) * 100));
    svg.innerHTML = '<g transform="scale(-1 1)">' + k.svg + '</g>';
    return { svg, headAbove: k.anchors.curl[1] * size };
  }
  const inner = side.querySelector('.side__inner');
  const scroller = side.querySelector('.side__scroll');
  side.insertBefore(tools.cloneNode(true), scroller);
  const title = contents.querySelector('.contents__title');
  const marker = document.createElement('span');
  marker.className = 'marker';
  const bookmark = stillKeeper({ color: 'coral', prop: 'glasses', arm: 'point' }, MARKER_SIZE);
  marker.appendChild(bookmark.svg);
  inner.appendChild(marker);

  const bar = document.createElement('div');
  bar.className = 'bar';
  bar.innerHTML = '<span class="bar__progress"></span><button class="btn btn--small btn--quiet bar__open" type="button" aria-expanded="false" aria-controls="contents-sheet">Contents</button><span class="bar__now" aria-hidden="true"></span>';
  const sheet = document.createElement('div');
  sheet.className = 'sheet-nav';
  sheet.id = 'contents-sheet';
  sheet.setAttribute('inert', '');
  sheet.innerHTML = '<div class="sheet-nav__panel" role="dialog" aria-modal="true" aria-label="Contents"><div class="sheet-nav__top"><p class="label">Contents</p><button class="btn btn--small btn--quiet" type="button" data-close>Close</button></div><nav class="sheet-nav__list" aria-label="Contents"></nav></div>';
  sheet.querySelector('.sheet-nav__list').appendChild(contents.querySelector('ol').cloneNode(true));
  sheet.querySelector('.sheet-nav__top').after(tools.cloneNode(true));
  document.body.append(bar, sheet);
  lists.push(sheet);
  const opener = bar.querySelector('.bar__open');
  const closer = sheet.querySelector('[data-close]');
  const now = bar.querySelector('.bar__now');
  const progress = bar.querySelector('.bar__progress');
  function setSheet(open) {
    sheet.classList.toggle('is-open', open);
    root.classList.toggle('is-locked', open);
    opener.setAttribute('aria-expanded', String(open));
    [...document.body.children].forEach((el) => {
      if (el !== sheet && el.id !== 'menu' && el.tagName !== 'SCRIPT') el.toggleAttribute('inert', open);
    });
    if (!open) {
      sheet.setAttribute('inert', '');
      return;
    }
    sheet.removeAttribute('inert');
    const here = sheet.querySelector('[aria-current]');
    if (here) here.scrollIntoView({ block: 'center' });
    closer.focus({ preventScroll: true });
  }
  opener.addEventListener('click', () => setSheet(true));
  closer.addEventListener('click', () => {
    setSheet(false);
    opener.focus({ preventScroll: true });
  });
  sheet.addEventListener('click', (event) => {
    if (event.target === sheet || event.target.closest('a')) setSheet(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !sheet.classList.contains('is-open')) return;
    setSheet(false);
    opener.focus({ preventScroll: true });
  });
  wide.addEventListener('change', () => setSheet(false));

  const state = { tops: [], blockTops: [], current: -2, from: 0, to: 1, barFrom: 0, barTo: 0, markerAt: 0, markerGoal: 0, trackUntil: 0, shown: 0, goal: 0 };
  function measure() {
    state.tops = headings.map(pageTop);
    state.blockTops = blocks.map(pageTop);
    state.from = pageTop(article);
    state.to = pageTop(article) + article.offsetHeight - window.innerHeight * 0.7;
    state.barFrom = wide.matches ? Infinity : pageTop(side) + side.offsetHeight - 40;
    const base = document.querySelector('.foot__base');
    state.barTo = Math.min(state.to + window.innerHeight * 0.45, base ? pageTop(base) - window.innerHeight : Infinity);
  }
  function markerTarget() {
    const heading = headings[state.current];
    const at = heading ? linkOf(contents, heading) : title;
    const line = parseFloat(getComputedStyle(at).lineHeight) || 20;
    const top = at.getBoundingClientRect().top - inner.getBoundingClientRect().top + parseFloat(getComputedStyle(at).paddingTop);
    return top + line / 2 + bookmark.headAbove;
  }
  function placeMarker() {
    marker.style.transform = 'translate3d(0,' + fix(state.markerAt) + 'px,0)';
  }
  function revealInRail() {
    const heading = headings[state.current];
    if (!heading || scroller.scrollHeight <= scroller.clientHeight) return;
    const link = linkOf(contents, heading).getBoundingClientRect();
    const box = scroller.getBoundingClientRect();
    if (link.top < box.top + 70) scroller.scrollTop -= box.top + 70 - link.top;
    if (link.bottom > box.bottom - 40) scroller.scrollTop += link.bottom - box.bottom + 40;
  }
  function read() {
    const y = window.scrollY;
    const current = lastAtOrAbove(state.tops, y + readLine());
    if (current !== state.current) {
      state.current = current;
      markCurrent(headings[current] || null);
      now.textContent = headings[current] ? headings[current].textContent : document.querySelector('h1').textContent;
      state.trackUntil = performance.now() + TRACK_FOR;
      if (wide.matches) revealInRail();
    }
    state.goal = Math.min(Math.max((y - state.from) / Math.max(state.to - state.from, 1), 0), 1);
    bar.classList.toggle('is-up', y > state.barFrom && y < state.barTo);
    root.classList.toggle('is-reading', y > window.innerHeight * READING_FROM);
    if (still.matches) {
      state.shown = state.goal;
      progress.style.transform = 'scaleX(' + state.shown.toFixed(4) + ')';
      if (wide.matches) {
        state.markerAt = markerTarget();
        placeMarker();
      }
    }
  }

  let saving = 0;
  function savePlace() {
    const y = window.scrollY;
    if (y > state.to + window.innerHeight * 0.3) {
      store.write(PLACE_KEY, null);
      return;
    }
    if (y < state.from + window.innerHeight) return;
    const block = lastAtOrAbove(state.blockTops, y + readLine());
    const heading = headings[state.current];
    if (block < 0 || !heading) return;
    const into = Math.min(Math.max((y + readLine() - state.blockTops[block]) / Math.max(blocks[block].offsetHeight, 1), 0), 1);
    store.write(PLACE_KEY, { block, into: Number(into.toFixed(3)), title: heading.textContent, at: Date.now() });
  }
  function found(el) {
    el.classList.remove('is-found');
    el.getBoundingClientRect();
    el.classList.add('is-found');
    setTimeout(() => el.classList.remove('is-found'), FOUND_FOR);
  }
  function resume() {
    const place = store.read(PLACE_KEY);
    const box = document.querySelector('[data-resume]');
    if (!place || window.location.hash || !blocks[place.block] || state.blockTops[place.block] < window.innerHeight * RESUME_MIN_SCREENS) return;
    box.querySelector('[data-resume-title]').textContent = place.title;
    box.classList.add('is-on');
    box.querySelector('[data-resume-go]').addEventListener('click', () => {
      const target = blocks[place.block];
      window.scrollTo({ top: pageTop(target) + target.offsetHeight * (place.into || 0) - readLine(), behavior: 'instant' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      found(target);
    });
  }

  const sizeButtons = [...document.querySelectorAll('.sizes button')];
  function setSize(value, keepPlace) {
    const anchor = keepPlace ? blocks[Math.max(lastAtOrAbove(state.blockTops, window.scrollY + readLine()), 0)] : null;
    const before = anchor ? anchor.getBoundingClientRect().top : 0;
    root.style.setProperty('--read', value);
    sizeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.size === String(value))));
    if (anchor && window.scrollY > state.from) window.scrollBy({ top: anchor.getBoundingClientRect().top - before, behavior: 'instant' });
  }
  const savedSize = store.read(SIZE_KEY);
  if (sizeButtons.some((button) => button.dataset.size === String(savedSize))) setSize(savedSize, false);
  sizeButtons.forEach((button) => button.addEventListener('click', () => {
    setSize(button.dataset.size, true);
    store.write(SIZE_KEY, button.dataset.size);
    M.resettle();
  }));
  document.querySelectorAll('[data-print]').forEach((button) => button.addEventListener('click', () => window.print()));

  M.settle(() => {
    measure();
    state.current = -2;
    read();
    state.markerAt = markerTarget();
    state.markerGoal = state.markerAt;
    state.shown = state.goal;
    placeMarker();
    progress.style.transform = 'scaleX(' + state.shown.toFixed(4) + ')';
  });
  M.follow((frame) => {
    let busy = false;
    if (Math.abs(state.goal - state.shown) > 0.0004) {
      state.shown += (state.goal - state.shown) * frame.ease;
      progress.style.transform = 'scaleX(' + state.shown.toFixed(4) + ')';
      busy = true;
    }
    if (!wide.matches) return busy;
    const tracking = performance.now() < state.trackUntil;
    if (tracking) state.markerGoal = markerTarget();
    if (tracking || Math.abs(state.markerGoal - state.markerAt) > 0.3) {
      state.markerAt += (state.markerGoal - state.markerAt) * frame.ease;
      placeMarker();
      busy = true;
    }
    return busy;
  });
  M.ready(() => {
    window.addEventListener('scroll', () => {
      read();
      clearTimeout(saving);
      saving = setTimeout(savePlace, SAVE_AFTER);
    }, { passive: true });
    measure();
    resume();
  });
})();
