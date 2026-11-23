(() => {
  const M = (window.Memoris = window.Memoris || {});
  const sheet = getComputedStyle(document.documentElement);
  const colors = new Proxy({}, {
    get(read, name) {
      if (!(name in read)) read[name] = sheet.getPropertyValue('--' + String(name)).trim();
      return read[name];
    }
  });
  const INK = colors.ink;
  const CARD = colors.card;
  const PAPER = colors.paper;
  const GLOW = colors.glow;
  const CORAL = colors.coral;
  const MEMORIS = 'violet';
  const TONES = {
    coral: { body: colors.coral, belly: colors['coral-pale'], fin: colors.glow, shade: colors['coral-deep'], prop: colors.leaf },
    amber: { body: colors.amber, belly: colors['amber-pale'], fin: colors.coral, shade: colors['amber-deep'], prop: colors.leaf },
    rose: { body: colors.rose, belly: colors['rose-pale'], fin: colors.glow, shade: colors['rose-deep'], prop: colors.leaf },
    violet: { body: colors.violet, belly: colors['violet-pale'], fin: colors.paper, shade: colors['violet-deep'], prop: colors.amber }
  };
  const UNPAINTED = { body: CARD, belly: CARD, fin: CARD, shade: CARD, prop: CARD };
  const PENCIL = colors['coral-deep'];
  const ALIVE = / class="(k|k-hop|k-fin|k-arm|k-eye|k-pupil|k-gaze|k-flap|k-steam|swing|cycle)"/g;
  const PAINT = new RegExp('(fill|stroke)="#(?!' + INK.slice(1) + ')[0-9A-Fa-f]{6}"', 'g');
  const UPRIGHT = [[0, 0, 20, 20], [11, 24, 13, 12], [14, 47, 22, 13], [10, 71, 24, 13], [5, 93, 17, 12], [0, 111, 11.5, 10.5]];
  const WRAPPED = { cx: -38, cy: 121, from: 8, to: 500, reach: 29, core: 7 };
  const POSES = {
    perch: { torso: UPRIGHT, tail: WRAPPED, by: 'curl' },
    swim: { torso: [[0, 0, 20, 20], [13, 22, 13, 12], [24, 42, 22, 13], [36, 62, 23, 13], [49, 80, 16, 12], [62, 94, 11, 10]], tail: { cx: 90.8, cy: 90, from: 150, to: -250, reach: 24, core: 6 }, by: 'head' },
    reach: { torso: [[0, 0, 20, 20], [7, 26, 12, 11], [6, 52, 19, 12], [2, 78, 20, 12], [-1, 102, 15, 11], [-2, 122, 11, 10]], tail: { cx: -40, cy: 132, from: 8, to: 470, reach: 29, core: 7 }, by: 'curl', head: 28, arm: 'up' },
    read: { torso: [[0, 0, 20, 20], [15, 21, 13, 12], [22, 44, 22, 13], [19, 68, 24, 13], [11, 90, 17, 12], [3, 108, 11.5, 10.5]], tail: { cx: -35, cy: 118, from: 8, to: 500, reach: 29, core: 7 }, by: 'curl', head: -22 },
    rest: { torso: [[0, 0, 20, 20], [13, 22, 14, 12], [20, 44, 25, 13], [18, 66, 27, 13], [9, 86, 19, 12], [-2, 100, 12, 10.5]], tail: { cx: -38, cy: 108, from: -5, to: 420, reach: 32, core: 10 }, by: 'curl', head: 8, mood: 'glad' },
    curl: { torso: [[0, 0, 20, 20], [18, 14, 13, 12], [32, 34, 21, 13], [32, 58, 23, 13], [18, 76, 17, 12], [-2, 80, 12, 10.5]], tail: { cx: -2, cy: 54, from: 90, to: 490, reach: 26, core: 6 }, by: 'base', head: -14, mood: 'asleep', arm: 'none' },
    dash: { torso: [[0, 0, 20, 20], [22, 10, 13, 12], [46, 16, 20, 13], [72, 16, 20, 12], [96, 12, 14, 11], [116, 6, 10, 9]], tail: { cx: 138, cy: -8, from: 145, to: -180, reach: 20, core: 6 }, by: 'head', head: 6, mood: 'focused' },
    startle: { torso: [[0, 0, 20, 20], [5, 26, 12, 11.5], [5, 52, 19, 12.5], [4, 78, 20, 12.5], [3, 100, 15, 11.5], [2, 118, 11, 10]], tail: { cx: -30, cy: 130, from: 15, to: 330, reach: 31, core: 14 }, by: 'curl', head: 10, mood: 'surprised', arm: 'up' },
    pull: { torso: UPRIGHT, tail: WRAPPED, by: 'curl', lean: 16, head: -6, mood: 'focused', arm: 'hold' },
    bow: { torso: UPRIGHT, tail: WRAPPED, by: 'curl', lean: -20, head: -8, mood: 'glad', arm: 'point' },
    hang: { torso: UPRIGHT, tail: WRAPPED, by: 'curl', hang: true },
    haul: { torso: [[0, 0, 20, 20], [-4, 25, 13, 12], [-19, 46, 22, 13], [-39, 66, 24, 13], [-53, 88, 17, 12], [-58, 109, 11.5, 10.5]], tail: { cx: -96, cy: 119, from: 8, to: 500, reach: 29, core: 7 }, by: 'curl', head: -6, mood: 'strained', arm: 'grip' },
    offer: { torso: [[0, 0, 20, 20], [19, 22, 13, 12], [36, 44, 22, 13], [46, 67, 24, 13], [50, 90, 17, 12], [50, 110, 11.5, 10.5]], tail: { cx: 12, cy: 120, from: 8, to: 500, reach: 29, core: 7 }, by: 'curl', head: 6, mood: 'glad', arm: 'give', shoulder: 10 },
    draw: { torso: [[0, 0, 20, 20], [16, 23, 13, 12], [31, 46, 22, 13], [42, 69, 24, 13], [47, 91, 17, 12], [48, 111, 11.5, 10.5]], tail: { cx: 10, cy: 121, from: 8, to: 500, reach: 29, core: 7 }, by: 'curl', head: 10, mood: 'intent', hold: 'pencil', arm: 'stroke', shoulder: 9, acts: { down: 'stroke', up: 'strokeUp' }, gazes: { down: [-2.3, 2.7], up: [-3.4, 1.3] } },
    admire: { torso: [[0, 0, 20, 20], [4, 25, 13, 12], [-1, 49, 22, 13], [-11, 72, 24, 13], [-20, 94, 17, 12], [-25, 113, 11.5, 10.5]], tail: { cx: -63, cy: 123, from: 8, to: 500, reach: 29, core: 7 }, by: 'curl', head: 12, mood: 'proud', arm: 'rest', look: 'ahead' },
    wait: { torso: [[0, 0, 20, 20], [9, 24, 13, 12], [15, 47, 22, 13], [17, 70, 24, 13], [15, 90, 17, 12], [12, 106, 11.5, 10.5]], tail: { cx: 38, cy: 108, from: 180, to: -220, reach: 26, core: 7 }, by: 'base', head: -4, mood: 'open', look: 'ahead', arm: 'lap' },
    tie: { torso: [[0, 0, 20, 20], [18, 14, 13, 12], [38, 24, 21, 13], [58, 34, 22, 13], [72, 46, 17, 12], [78, 60, 11.5, 10.5]], tail: { cx: 40, cy: 70, from: 8, to: 500, reach: 29, core: 7 }, by: 'curl', head: -44, mood: 'intent', look: 'down', arm: 'knot', shoulder: 12 },
    lean: { torso: [[0, 0, 20, 20], [18, 21, 13, 12], [34, 43, 22, 13], [45, 66, 24, 13], [50, 89, 17, 12], [51, 109, 11.5, 10.5]], tail: { cx: 13, cy: 119, from: 8, to: 500, reach: 29, core: 7 }, by: 'curl', head: -22, mood: 'open', look: 'down', arm: 'tap', shoulder: 11 },
    dangle: { torso: [[0, 0, 20, 20], [13, 24, 13, 12], [18, 47, 22, 13], [16, 71, 24, 13], [11, 93, 17, 12], [6, 111, 11.5, 10.5]], tail: { cx: -32, cy: 121, from: 8, to: 500, reach: 29, core: 7 }, by: 'curl', head: -26, mood: 'open', look: 'down', arm: 'under' },
    hoist: { torso: [[0, 0, 20, 20], [15, 20, 13, 12], [33, 38, 22, 13], [46, 60, 24, 13], [50, 82, 17, 12], [48, 102, 11.5, 10.5]], tail: { cx: 74, cy: 104, from: 180, to: -220, reach: 26, core: 7 }, by: 'base', head: -30, mood: 'focused', arm: 'lower', acts: { down: 'lower', up: 'raise' }, rope: true },
    peer: { torso: [[0, 0, 20, 20], [12, -24, 13, 12], [30, -50, 21, 13], [55, -68, 22, 13], [80, -66, 17, 12], [94, -57, 11.5, 10.5]], tail: { cx: 97, cy: -30, from: -96, to: 384, reach: 27, core: 7 }, by: 'curl', head: -26, mood: 'focused', arm: 'lens', shoulder: 11 }
  };
  const ARMS = {
    rest: { turn: 152, reach: 20, wag: 7, out: 0.2 },
    hold: { turn: 166, reach: 30, wag: 3, out: 0.5 },
    point: { turn: 186, reach: 40, wag: 2, out: 0.5 },
    wave: { turn: 208, reach: 40, wag: 14, out: 0.5 },
    up: { turn: 224, reach: 46, wag: 4, out: 0.5 },
    chin: { turn: 252, reach: 28, wag: 0, out: 0.5 },
    lens: { turn: 0, reach: 0, wag: 0, out: 0.5, toEye: true },
    grip: { turn: 154, reach: 54, wag: 1.5, out: 0.55, fist: true },
    give: { turn: 171, reach: 58, wag: 2, out: 0.5, ahead: [-12, -8] },
    lower: { turn: 0, reach: 0, wag: 0, out: 0.5, to: [8, 102], fist: true },
    raise: { turn: 0, reach: 0, wag: 0, out: 0.5, to: [8, 66], fist: true },
    stroke: { turn: 0, reach: 0, wag: 0, out: 0.5, to: [-46, 56], tool: true },
    strokeUp: { turn: 0, reach: 0, wag: 0, out: 0.5, to: [-59, 23], tool: true },
    down: { turn: 120, reach: 36, wag: 2, out: 0.45 },
    lap: { turn: 132, reach: 25, wag: 0, out: 0.45, rest: true },
    knot: { turn: 0, reach: 0, wag: 1.5, out: 0.5, to: [-6, 66], fist: true },
    tap: { turn: 0, reach: 0, wag: 3, out: 0.5, to: [-34, 60] },
    under: { turn: 0, reach: 0, wag: 0, out: 0.5, toSnout: [5, 25], fist: true }
  };
  const SAMPLES_PER_SPAN = 8;
  const TAIL_SPANS = 9;
  const TAIL_WIDTH = [9, 2.4];
  const HEAD_RX = 28;
  const HEAD_RY = 26.5;
  const EYE_AT = [-8, -4];
  const LOOK_REST = [-2.6, 2];
  const SNOUT = 'M-12 -8C-22 -6 -30 0 -38 3C-41 .5 -50 0 -50 9C-50 18 -41 17.5 -38 15C-30 18 -22 20 -10 17Z';
  const SNOUT_TIP = [-50, 9];
  const LENS_HAND = [3, 31];
  const LENS_GAZE = [-1.4, 1.6];
  const LOOKS = { down: [-1.6, 3.8], up: [0.6, -3.8], ahead: [-3.8, 0.4], back: [3.6, 0.4] };
  const PENCIL_TIP = [-17.9, 6.5];
  const WORK_TOOLS = ['pencil', 'brush'];
  const LENS_REACH = [22, 58];
  const ARM_REACH = [18, 72];
  const SHOULDER_AT = 15;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const HEART = 'c-3 -5 -10 -1 -6 4l6 6l6 -6c4 -5 -3 -9 -6 -4z';

  const fix = (n) => String(Math.round(n * 10) / 10);
  const rad = (deg) => (deg * Math.PI) / 180;
  const within = (n) => Math.min(Math.max(n, 0), 1);
  const turn = (x, y, deg) => [x * Math.cos(rad(deg)) - y * Math.sin(rad(deg)), x * Math.sin(rad(deg)) + y * Math.cos(rad(deg))];
  const between = (a, b) => fix((a[0] + b[0]) / 2) + ' ' + fix((a[1] + b[1]) / 2);
  const defaults = (base, ...given) => {
    const out = Object.assign({}, base);
    given.forEach((options) => {
      Object.keys(options || {}).forEach((key) => {
        if (options[key] !== undefined) out[key] = options[key];
      });
    });
    return out;
  };
  const line = (width) => 'fill="none" stroke="' + INK + '" stroke-width="' + width + '" stroke-linecap="round" stroke-linejoin="round"';
  const inked = (fill, width) => 'fill="' + fill + '" stroke="' + INK + '" stroke-width="' + (width || 2.4) + '" stroke-linejoin="round"';

  let ruler = null;
  function measure(d) {
    if (!ruler) {
      const host = document.createElementNS(SVG_NS, 'svg');
      host.setAttribute('width', 0);
      host.setAttribute('height', 0);
      host.setAttribute('aria-hidden', 'true');
      host.style.cssText = 'position:absolute;overflow:hidden';
      ruler = document.createElementNS(SVG_NS, 'path');
      host.appendChild(ruler);
      (document.body || document.documentElement).appendChild(host);
    }
    ruler.setAttribute('d', d);
    return ruler;
  }
  const PATH_TOKEN = /[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g;
  const PATH_ARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
  const CURVE_STEPS = 10;
  const ARC_STEP = Math.PI / 16;
  function arcTo(points, x1, y1, radiusX, radiusY, tilt, large, sweep, x2, y2) {
    let rx = Math.abs(radiusX);
    let ry = Math.abs(radiusY);
    if (!rx || !ry || (x1 === x2 && y1 === y2)) {
      points.push([x2, y2]);
      return;
    }
    const cos = Math.cos(rad(tilt));
    const sin = Math.sin(rad(tilt));
    const dx = (x1 - x2) / 2;
    const dy = (y1 - y2) / 2;
    const px = cos * dx + sin * dy;
    const py = -sin * dx + cos * dy;
    const stretch = Math.sqrt((px * px) / (rx * rx) + (py * py) / (ry * ry));
    if (stretch > 1) {
      rx *= stretch;
      ry *= stretch;
    }
    const top = rx * rx * ry * ry - rx * rx * py * py - ry * ry * px * px;
    const under = rx * rx * py * py + ry * ry * px * px;
    const side = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(top / under, 0));
    const centreX = (side * rx * py) / ry;
    const centreY = (-side * ry * px) / rx;
    const cx = cos * centreX - sin * centreY + (x1 + x2) / 2;
    const cy = sin * centreX + cos * centreY + (y1 + y2) / 2;
    const from = Math.atan2((py - centreY) / ry, (px - centreX) / rx);
    let span = Math.atan2((-py - centreY) / ry, (-px - centreX) / rx) - from;
    if (sweep && span < 0) span += Math.PI * 2;
    if (!sweep && span > 0) span -= Math.PI * 2;
    const steps = Math.max(2, Math.ceil(Math.abs(span) / ARC_STEP));
    for (let i = 1; i <= steps; i++) {
      const angle = from + (span * i) / steps;
      points.push([cx + rx * Math.cos(angle) * cos - ry * Math.sin(angle) * sin, cy + rx * Math.cos(angle) * sin + ry * Math.sin(angle) * cos]);
    }
  }
  function polyline(d) {
    const tokens = String(d).match(PATH_TOKEN) || [];
    const points = [];
    const jumps = new Set();
    let x = 0;
    let y = 0;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let last = '';
    let i = 0;
    let command = '';
    while (i < tokens.length) {
      if (/[a-zA-Z]/.test(tokens[i])) {
        command = tokens[i];
        i += 1;
      } else if (command === 'M') command = 'L';
      else if (command === 'm') command = 'l';
      const kind = command.toLowerCase();
      const relative = command === kind;
      const n = tokens.slice(i, i + PATH_ARGS[kind]).map(Number);
      i += PATH_ARGS[kind];
      const ox = relative ? x : 0;
      const oy = relative ? y : 0;
      const bend = (x1, y1, x2, y2, x3, y3) => {
        for (let step = 1; step <= CURVE_STEPS; step++) {
          const t = step / CURVE_STEPS;
          const u = 1 - t;
          points.push([u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]);
        }
        lastX = x2;
        lastY = y2;
        x = x3;
        y = y3;
      };
      if (kind === 'm') {
        x = startX = n[0] + ox;
        y = startY = n[1] + oy;
        jumps.add(points.length);
        points.push([x, y]);
      } else if (kind === 'l') {
        x = n[0] + ox;
        y = n[1] + oy;
        points.push([x, y]);
      } else if (kind === 'h') {
        x = n[0] + ox;
        points.push([x, y]);
      } else if (kind === 'v') {
        y = n[0] + oy;
        points.push([x, y]);
      } else if (kind === 'c') bend(n[0] + ox, n[1] + oy, n[2] + ox, n[3] + oy, n[4] + ox, n[5] + oy);
      else if (kind === 's') bend(last === 'c' ? 2 * x - lastX : x, last === 'c' ? 2 * y - lastY : y, n[0] + ox, n[1] + oy, n[2] + ox, n[3] + oy);
      else if (kind === 'q' || kind === 't') {
        const qx = kind === 'q' ? n[0] + ox : last === 'q' ? 2 * x - lastX : x;
        const qy = kind === 'q' ? n[1] + oy : last === 'q' ? 2 * y - lastY : y;
        const ex = (kind === 'q' ? n[2] : n[0]) + ox;
        const ey = (kind === 'q' ? n[3] : n[1]) + oy;
        bend(x + ((qx - x) * 2) / 3, y + ((qy - y) * 2) / 3, ex + ((qx - ex) * 2) / 3, ey + ((qy - ey) * 2) / 3, ex, ey);
        lastX = qx;
        lastY = qy;
      } else if (kind === 'a') {
        arcTo(points, x, y, n[0], n[1], n[2], n[3], n[4], n[5] + ox, n[6] + oy);
        x = n[5] + ox;
        y = n[6] + oy;
      } else if (kind === 'z') {
        x = startX;
        y = startY;
        points.push([x, y]);
      }
      last = kind === 's' ? 'c' : kind === 't' ? 'q' : kind;
    }
    const lengths = [0];
    for (let k = 1; k < points.length; k++) lengths.push(lengths[k - 1] + (jumps.has(k) ? 0 : Math.hypot(points[k][0] - points[k - 1][0], points[k][1] - points[k - 1][1])));
    const total = lengths[lengths.length - 1] || 0;
    const at = (length) => {
      const want = Math.min(Math.max(length, 0), total);
      let low = 0;
      let high = lengths.length - 1;
      while (high - low > 1) {
        const middle = (low + high) >> 1;
        if (lengths[middle] <= want) low = middle;
        else high = middle;
      }
      const span = lengths[high] - lengths[low] || 1;
      const share = (want - lengths[low]) / span;
      return [points[low][0] + (points[high][0] - points[low][0]) * share, points[low][1] + (points[high][1] - points[low][1]) * share];
    };
    return { total, at };
  }
  function handCut(d, sway) {
    const path = polyline(d);
    const total = path.total;
    const count = Math.round(total / 13);
    const points = [];
    for (let i = 0; i < count; i++) {
      const at = (i / count) * total;
      const here = path.at(at);
      const next = path.at((at + 2) % total);
      const length = Math.hypot(next[0] - here[0], next[1] - here[1]) || 1;
      const drift = sway * (0.55 * Math.sin(i * 0.37 + 1.3) + 0.3 * Math.sin(i * 0.93 + 4.1) + 0.25 * Math.sin(i * 1.71 + 2.2));
      points.push([here[0] - ((next[1] - here[1]) / length) * drift, here[1] + ((next[0] - here[0]) / length) * drift]);
    }
    let out = 'M' + between(points[count - 1], points[0]);
    points.forEach((point, i) => {
      out += 'Q' + fix(point[0]) + ' ' + fix(point[1]) + ' ' + between(point, points[(i + 1) % count]);
    });
    return out + 'Z';
  }
  const DRAWN_SWAY = 1.15;
  const DRAWN_STITCH = 26;
  function drawn(points) {
    const last = points.length - 1;
    const moved = points.map((point, i) => {
      if (i === 0 || i === last) return point;
      const before = points[i - 1];
      const after = points[i + 1];
      const length = Math.hypot(after[0] - before[0], after[1] - before[1]) || 1;
      const drift = DRAWN_SWAY * (0.6 * Math.sin(i * 0.9 + 1.3) + 0.4 * Math.sin(i * 2.1 + 4.1));
      return [point[0] - ((after[1] - before[1]) / length) * drift, point[1] + ((after[0] - before[0]) / length) * drift];
    });
    let d = 'M' + fix(moved[0][0]) + ' ' + fix(moved[0][1]);
    for (let i = 1; i < last; i++) d += 'Q' + fix(moved[i][0]) + ' ' + fix(moved[i][1]) + ' ' + between(moved[i], moved[i + 1]);
    return d + 'L' + fix(moved[last][0]) + ' ' + fix(moved[last][1]);
  }
  function drawnPath(d) {
    const path = polyline(d);
    const count = Math.max(Math.round(path.total / DRAWN_STITCH), 2);
    return drawn(Array.from({ length: count + 1 }, (unused, i) => path.at((path.total * i) / count)));
  }
  function tailPoints(tail) {
    const points = [];
    for (let i = 0; i <= TAIL_SPANS; i++) {
      const t = i / TAIL_SPANS;
      const angle = rad(tail.from + (tail.to - tail.from) * t);
      const reach = tail.reach + (tail.core - tail.reach) * Math.pow(t, 0.9);
      const width = TAIL_WIDTH[0] + (TAIL_WIDTH[1] - TAIL_WIDTH[0]) * t;
      points.push([tail.cx + Math.cos(angle) * reach, tail.cy + Math.sin(angle) * reach, width, width]);
    }
    return points;
  }
  function sampleSpine(points) {
    const out = [];
    const at = (i) => points[Math.min(Math.max(i, 0), points.length - 1)];
    for (let i = 0; i < points.length - 1; i++) {
      const [a, b, c, d] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
      for (let s = 0; s < SAMPLES_PER_SPAN; s++) {
        const t = s / SAMPLES_PER_SPAN;
        const mix = (k) => 0.5 * (2 * b[k] + (c[k] - a[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t * t + (3 * b[k] - a[k] - 3 * c[k] + d[k]) * t * t * t);
        out.push([mix(0), mix(1), mix(2), mix(3)]);
      }
    }
    out.push(points[points.length - 1]);
    return out;
  }
  function frameAt(samples, i) {
    const a = samples[Math.max(i - 1, 0)];
    const b = samples[Math.min(i + 1, samples.length - 1)];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const tx = (b[0] - a[0]) / length;
    const ty = (b[1] - a[1]) / length;
    return { tx, ty, nx: -ty, ny: tx };
  }
  function ribbon(samples, offset) {
    const front = [];
    const back = [];
    samples.forEach((s, i) => {
      const { nx, ny } = frameAt(offset ? offset.spine : samples, offset ? i + offset.start : i);
      front.push([s[0] + nx * s[2], s[1] + ny * s[2]]);
      back.push([s[0] - nx * s[3], s[1] - ny * s[3]]);
    });
    return 'M' + front.concat(back.reverse()).map((p) => fix(p[0]) + ' ' + fix(p[1])).join('L') + 'Z';
  }

  function openEye(tone, o) {
    const size = o.wide ? [11.5, 13.6] : [10, 12];
    const pupil = o.magnify ? [6.6, 8.6] : o.wide ? [3.7, 5] : [5, 6.8];
    const rest = o.magnify ? LENS_GAZE : o.gaze || LOOK_REST;
    const lid = o.lid && !o.magnify ? '<path d="M' + (EYE_AT[0] - size[0] - 1.2) + ' ' + (EYE_AT[1] + o.lid) + 'A' + (size[0] + 1.2) + ' ' + (size[1] + 1.2) + ' 0 0 1 ' + (EYE_AT[0] + size[0] + 1.2) + ' ' + (EYE_AT[1] + o.lid) + 'Z" fill="' + tone.body + '"/><path d="M' + (EYE_AT[0] - size[0]) + ' ' + (EYE_AT[1] + o.lid) + 'h' + size[0] * 2 + '" ' + line(2.4) + '/>' : '';
    const pupilAt = (at, act, hidden) => '<g class="' + (o.gaze || o.magnify || act ? 'k-gaze' : 'k-pupil') + '"' + (act ? ' data-act="' + act + '"' : '') + (hidden ? ' display="none"' : '') + ' transform="translate(' + at[0] + ' ' + at[1] + ')"><ellipse cx="' + EYE_AT[0] + '" cy="' + EYE_AT[1] + '" rx="' + pupil[0] + '" ry="' + pupil[1] + '" fill="' + INK + '"/><circle cx="' + (EYE_AT[0] + 1.8) + '" cy="' + (EYE_AT[1] - 3) + '" r="1.8" fill="' + CARD + '"/></g>';
    const pupils = o.gazes ? Object.keys(o.gazes).map((act, i) => pupilAt(o.gazes[act], act, i > 0)).join('') : pupilAt(rest);
    return '<g class="k-eye"><ellipse cx="' + EYE_AT[0] + '" cy="' + EYE_AT[1] + '" rx="' + size[0] + '" ry="' + size[1] + '" fill="' + CARD + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      pupils + lid + '</g>';
  }
  const SMILE = '<path d="M-21 15q6 5.5 14 2" ' + line(2.3) + '/>';
  const FLAT = '<path d="M-21 16.5q6 1.5 12 .5" ' + line(2.3) + '/>';
  const FROWN = '<path d="M-21 18q6 -4.5 13 -1" ' + line(2.3) + '/>';
  const FACES = {
    open: (tone, extra) => openEye(tone, extra) + SMILE,
    glad: () => '<path d="M-18 0q9 -13 18 0" ' + line(2.8) + '/>' + SMILE,
    proud: () => '<path d="M-18 0q9 -13 18 0" ' + line(2.8) + '/><path d="M-23 13q8 9 18 2" ' + line(2.4) + '/>',
    laughing: () => '<path d="M-18 0q9 -13 18 0" ' + line(2.8) + '/><path d="M-23 12q8 13 18 1z" fill="' + INK + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><path data-still d="M-18 17.5q4 3 8 .5" fill="none" stroke="' + CORAL + '" stroke-width="2.6" stroke-linecap="round"/>',
    asleep: () => '<path d="M-18 -3q9 9 18 0" ' + line(2.6) + '/><path d="M-16 2l-2.5 4M-9 4.5l-.5 4.5M-2 2l2 4" ' + line(1.8) + '/><path d="M-19 16q4 2.5 9 .5" ' + line(2.2) + '/>',
    sleepy: (tone, extra) => openEye(tone, defaults({ lid: -2, gaze: [-2, 4] }, extra)) + '<path d="M-19 16q4 2.5 9 .5" ' + line(2.2) + '/>',
    worried: (tone, extra) => openEye(tone, extra) + '<path d="M-22 -18q9 -8 18 -2" ' + line(2.5) + '/>' + FROWN,
    sad: (tone, extra) => openEye(tone, defaults({ lid: -5, gaze: [-3, 4] }, extra)) + '<path d="M-21 -20q8 -5 17 1" ' + line(2.5) + '/>' + FROWN,
    surprised: (tone, extra) => openEye(tone, defaults({ wide: true }, extra)) + '<path d="M-20 -22q8 -7 17 -3" ' + line(2.4) + '/><ellipse cx="-15" cy="17.5" rx="3.2" ry="4.2" fill="' + INK + '"/>',
    thinking: (tone, extra) => openEye(tone, defaults({ gaze: [1.5, -3.6] }, extra)) + '<path d="M-20 -21q9 -3 17 -1" ' + line(2.4) + '/>' + FLAT,
    strained: () => '<path d="M-19 -10L-5 -4L-18 2" ' + line(2.9) + '/><path d="M-1 -20L-21 -13" ' + line(2.6) + '/><path d="M-23 13.5h14v6.5h-14z" ' + inked(CARD, 2) + '/><path data-fine d="M-18.5 13.5v6.5M-13.5 13.5v6.5" ' + line(1.3) + '/>',
    intent: (tone, extra) => openEye(tone, defaults({ lid: -7 }, extra)) + '<path d="M-21 -15l19 -3" ' + line(2.6) + '/>' + FLAT + '<path d="M-18.5 17q-2 8 3.5 8q5.5 0 4 -7.5z" ' + inked(CORAL, 1.8) + '/>',
    saying: (tone, extra) => openEye(tone, extra) + '<path d="M-22 13q6.5 11 14 1.5q-7 -3.5 -14 -1.5z" fill="' + INK + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/><path data-still d="M-17.5 17.5q3.5 2.5 7 .5" fill="none" stroke="' + CORAL + '" stroke-width="2.4" stroke-linecap="round"/>',
    focused: (tone, extra) => openEye(tone, defaults({ lid: -8 }, extra)) + '<path d="M-21 -15l19 -3" ' + line(2.6) + '/>' + FLAT
  };
  function crest() {
    return [-56, -84, -112].map((deg, i) => {
      const reach = i === 1 ? 30 : 28;
      const x = fix(Math.cos(rad(deg)) * reach);
      const y = fix(Math.sin(rad(deg)) * reach);
      return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (i === 1 ? 9.5 : 7.5) + '" ry="5.2" transform="rotate(' + deg + ' ' + x + ' ' + y + ')"/>';
    }).join('');
  }
  const BAND = 'M-26 -10C-18 -27 12 -30 25 -13';
  const HEADWEAR = {
    glasses: () => '<circle cx="' + EYE_AT[0] + '" cy="' + EYE_AT[1] + '" r="14.5" fill="' + CARD + '" fill-opacity=".22" stroke="' + INK + '" stroke-width="2.6"/><path d="M6.5 -5.5L25 -10M-22.5 -4.5l-5 -1" ' + line(2.4) + '/>',
    nightcap: (tone) => '<path d="M-25 -13C-22 -40 6 -50 30 -38C44 -30 50 -14 46 2C40 -10 32 -18 24 -14Z" ' + inked(tone.prop) + '/><path data-fine d="M-12 -34C-4 -30 2 -24 4 -17M8 -43C16 -37 20 -29 21 -20" ' + line(1.7) + '/><path d="' + BAND + '" fill="none" stroke="' + INK + '" stroke-width="7.4" stroke-linecap="round"/><path d="' + BAND + '" fill="none" stroke="' + CARD + '" stroke-width="3.6" stroke-linecap="round"/><circle cx="46" cy="5" r="6" ' + inked(CARD) + '/>',
    headlamp: () => '<path data-still d="M-30 -22L-96 -52L-96 4Z" fill="' + GLOW + '" opacity=".28"/><path d="' + BAND + '" fill="none" stroke="' + INK + '" stroke-width="6.4" stroke-linecap="round"/><path d="' + BAND + '" fill="none" stroke="' + CARD + '" stroke-width="2.6" stroke-linecap="round"/><rect x="-33" y="-27" width="12" height="13" rx="3" transform="rotate(-24 -27 -20)" ' + inked(GLOW) + '/>'
  };
  function strap(samples, from, to) {
    const top = samples[from];
    const topFrame = frameAt(samples, from);
    const low = samples[to];
    const lowFrame = frameAt(samples, to);
    const a = [top[0] - topFrame.nx * top[3] * 0.9, top[1] - topFrame.ny * top[3] * 0.9];
    const b = [low[0] + lowFrame.nx * low[2] * 0.95, low[1] + lowFrame.ny * low[2] * 0.95];
    return { a, b, angle: (Math.atan2(lowFrame.ty, lowFrame.tx) * 180) / Math.PI - 90 };
  }
  const BODYWEAR = {
    satchel(samples, tone) {
      const s = strap(samples, 9, 31);
      const d = 'M' + fix(s.a[0]) + ' ' + fix(s.a[1]) + 'L' + fix(s.b[0]) + ' ' + fix(s.b[1]);
      return '<path d="' + d + '" stroke="' + INK + '" stroke-width="6.2" stroke-linecap="round"/><path d="' + d + '" stroke="' + tone.prop + '" stroke-width="2.4" stroke-linecap="round"/>' +
        '<g transform="translate(' + fix(s.b[0]) + ' ' + fix(s.b[1]) + ') rotate(' + fix(s.angle) + ')"><rect x="-13" y="-3" width="24" height="19" rx="4" ' + inked(tone.prop) + '/><path d="M-13 4h24" stroke="' + INK + '" stroke-width="1.8"/><circle cx="-1" cy="8" r="1.7" fill="' + INK + '"/></g>';
    },
    scarf(samples, tone) {
      const at = samples[8];
      const f = frameAt(samples, 8);
      const front = [at[0] + f.nx * (at[2] + 1), at[1] + f.ny * (at[2] + 1)];
      const back = [at[0] - f.nx * (at[3] + 1), at[1] - f.ny * (at[3] + 1)];
      const d = 'M' + fix(front[0]) + ' ' + fix(front[1]) + 'L' + fix(back[0]) + ' ' + fix(back[1]);
      const tail = 'M' + fix(back[0] - 2) + ' ' + fix(back[1] - 3) + 'l22 6l-4 6l8 5l-24 -3z';
      return '<path class="k-flap" d="' + tail + '" ' + inked(tone.prop, 2.2) + '/><path d="' + d + '" stroke="' + INK + '" stroke-width="12.5" stroke-linecap="round"/><path d="' + d + '" stroke="' + tone.prop + '" stroke-width="8" stroke-linecap="round"/>';
    },
    stethoscope(samples) {
      const s = strap(samples, 8, 24);
      const front = [samples[8][0] + frameAt(samples, 8).nx * samples[8][2], samples[8][1] + frameAt(samples, 8).ny * samples[8][2]];
      const d = 'M' + fix(s.a[0]) + ' ' + fix(s.a[1]) + 'Q' + fix((s.a[0] + s.b[0]) / 2 + 8) + ' ' + fix(s.b[1] + 12) + ' ' + fix(s.b[0] + 3) + ' ' + fix(s.b[1]) + 'M' + fix(front[0]) + ' ' + fix(front[1]) + 'Q' + fix(front[0] - 3) + ' ' + fix(s.b[1] - 8) + ' ' + fix(s.b[0] + 3) + ' ' + fix(s.b[1]);
      return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="5.4" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + PAPER + '" stroke-width="1.8" stroke-linecap="round"/><circle cx="' + fix(s.b[0] + 1) + '" cy="' + fix(s.b[1] + 3) + '" r="6.2" ' + inked(PAPER) + '/><circle cx="' + fix(s.b[0] + 1) + '" cy="' + fix(s.b[1] + 3) + '" r="1.8" fill="' + INK + '"/>';
    }
  };

  const GONE_TEAR = [[0.66, 16.5], [0.4, 12.5], [0.08, 18], [-0.2, 13.5], [-0.52, 19], [-0.8, 14], [-1, 11]];
  const TAG_MARKS = {
    lines: (w, y) => 'M' + (5 - w / 2) + ' ' + (y - 4) + 'h' + (w - 10) + 'M' + (5 - w / 2) + ' ' + (y + 3) + 'h' + (w - 10) + 'M' + (5 - w / 2) + ' ' + (y + 10) + 'h' + (w - 17),
    key: (w, y) => 'M-7 ' + y + 'a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M1 ' + y + 'h9M6 ' + y + 'v4M10 ' + y + 'v4',
    face: (w, y) => 'M-8 ' + (y + 1) + 'a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M-3 ' + (y - 1) + 'v.6M3 ' + (y - 1) + 'v.6M-3.5 ' + (y + 3.5) + 'q3.5 3 7 0',
    book: (w, y) => 'M-9 ' + (y - 5) + 'h18v13h-18zM0 ' + (y - 5) + 'v13',
    disc: (w, y) => 'M-8 ' + (y + 1) + 'a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M-1.5 ' + (y + 1) + 'a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0',
    heart: (w, y) => 'M0 ' + (y - 2) + HEART,
    calendar: (w, y) => 'M-9 ' + (y - 5) + 'h18v14h-18zM-9 ' + (y - 0.5) + 'h18M-4 ' + (y - 8) + 'v5M4 ' + (y - 8) + 'v5',
    photo: (w, y) => 'M-10 ' + (y - 6) + 'h20v15h-20zM-10 ' + (y + 7) + 'l6 -7l5 5l3 -3l6 6M4.5 ' + (y - 2) + 'a1.5 1.5 0 1 0 .1 0',
    check: (w, y) => 'M-7 ' + (y + 1) + 'l5 5l9 -11',
    question: (w, y) => 'M-4 ' + (y - 3) + 'q0 -5 4.5 -5q4.5 0 4.5 4q0 3 -4.5 5v2.5M0 ' + (y + 8) + 'v.6',
    pill: (w, y) => 'M-8 ' + (y + 5) + 'a5 5 0 0 1 0 -7l5 -5a5 5 0 0 1 7 7l-5 5a5 5 0 0 1 -7 0zM-2 ' + (y - 2) + 'l6 6',
    star: (w, y) => 'M0 ' + (y - 8) + 'l2.6 5.6l6 .7l-4.5 4.1l1.3 6l-5.4 -3.1l-5.4 3.1l1.3 -6l-4.5 -4.1l6 -.7z',
    pin: (w, y) => 'M0 ' + (y + 9) + 'C-5 ' + (y + 3) + ' -7 ' + y + ' -7 ' + (y - 3) + 'a7 7 0 1 1 14 0C7 ' + y + ' 5 ' + (y + 3) + ' 0 ' + (y + 9) + 'ZM-2.3 ' + (y - 3) + 'a2.3 2.3 0 1 0 4.6 0a2.3 2.3 0 1 0 -4.6 0',
    note: (w, y) => 'M-8 ' + (y + 6) + 'a3.2 2.6 0 1 0 6.4 0a3.2 2.6 0 1 0 -6.4 0M-1.6 ' + (y + 6) + 'V' + (y - 7) + 'l9 -2.5V' + (y + 3.5) + 'M1 ' + (y + 3.5) + 'a3.2 2.6 0 1 0 6.4 0a3.2 2.6 0 1 0 -6.4 0',
    pot: (w, y) => 'M-8 ' + (y - 1) + 'h16v6a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4zM-8 ' + (y + 1) + 'h-3M8 ' + (y + 1) + 'h3M-9.5 ' + (y - 4) + 'h19M0 ' + (y - 4) + 'v-3M-4 ' + (y - 10) + 'q-2 -2 0 -4M4 ' + (y - 10) + 'q-2 -2 0 -4',
    gift: (w, y) => 'M-8 ' + (y - 1) + 'h16v10h-16zM-9.5 ' + (y - 5) + 'h19v4h-19zM0 ' + (y - 5) + 'v14M0 ' + (y - 5) + 'c-2 -5 -8 -5 -6 -1c1 1 4 1 6 1c2 0 5 0 6 -1c2 -4 -4 -4 -6 1',
    goal: (w, y) => 'M-6 ' + (y + 9) + 'V' + (y - 9) + 'M-6 ' + (y - 8) + 'l13 4l-13 4.5',
    glass: (w, y) => 'M-6.5 ' + (y - 9) + 'h13c0 6.5 -2 10.5 -6.5 10.5c-4.5 0 -6.5 -4 -6.5 -10.5zM0 ' + (y + 1.5) + 'v7M-5 ' + (y + 9) + 'h10M-5.8 ' + (y - 4.5) + 'h11.6',
    lock: (w, y) => 'M-7 ' + (y - 1) + 'h14v10h-14zM-4 ' + (y - 1) + 'v-3.5a4 4 0 0 1 8 0v3.5M0 ' + (y + 3) + 'v2.5',
    bell: (w, y) => 'M-8 ' + (y + 5) + 'c2 -2 2.5 -5 2.5 -8a5.5 5.5 0 0 1 11 0c0 3 .5 6 2.5 8zM-2 ' + (y + 8) + 'a2 2 0 0 0 4 0M0 ' + (y - 9) + 'v-1.5',
    none: () => ''
  };
  function miniTag(options) {
    const o = defaults({ length: 22, w: 30, h: 38, fill: CARD, mark: 'lines', string: INK }, options);
    const top = o.length;
    const half = o.w / 2;
    const cut = 7;
    const shape = 'M' + (cut - half) + ' ' + top + 'H' + (half - cut) + 'L' + half + ' ' + (top + cut) + 'V' + (top + o.h) + 'H' + -half + 'V' + (top + cut) + 'Z';
    const drawn = (TAG_MARKS[o.mark] || TAG_MARKS.none)(o.w, top + o.h * 0.6);
    if (o.gone) {
      const scrap = 'M' + (cut - half) + ' ' + top + 'H' + (half - cut) + 'L' + half + ' ' + (top + cut) + 'V' + (top + 12) +
        GONE_TEAR.map(([across, down]) => 'L' + fix(half * across) + ' ' + fix(top + down)).join('') + 'V' + (top + cut) + 'Z';
      return '<path d="M0 0V' + (top + 7) + '" stroke="' + o.string + '" stroke-width="2" fill="none"/>' +
        '<path d="' + scrap + '" ' + inked(o.fill) + '/>' +
        '<circle cx="0" cy="' + (top + 7.5) + '" r="2.3" fill="' + INK + '"/>';
    }
    if (o.planned) {
      return '<path d="M0 0V' + (top + 7) + '" stroke="' + o.string + '" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round" fill="none"/>' +
        '<path data-still d="' + shape + '" fill="none" stroke="' + o.string + '" stroke-width="2.2" stroke-dasharray="5 4.5" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<circle cx="0" cy="' + (top + 7.5) + '" r="2.3" fill="' + o.string + '"/>' +
        (drawn ? '<path data-still d="' + drawn + '" fill="none" stroke="' + o.string + '" stroke-width="1.6" stroke-dasharray="3 3.5" stroke-linecap="round" stroke-linejoin="round"/>' : '');
    }
    return '<path d="M0 0V' + (top + 7) + '" stroke="' + o.string + '" stroke-width="2" fill="none"/>' +
      '<path d="' + shape + '" ' + inked(o.fill) + '/>' +
      '<circle cx="0" cy="' + (top + 7.5) + '" r="2.3" fill="' + INK + '"/>' +
      (drawn ? '<path data-fine d="' + drawn + '" ' + line(1.7) + '/>' : '');
  }
  function lantern(string) {
    return '<path d="M0 0V16" stroke="' + (string || INK) + '" stroke-width="2" fill="none"/><circle data-still cx="0" cy="34" r="34" fill="' + GLOW + '" opacity=".2"/><circle data-still cx="0" cy="34" r="20" fill="' + GLOW + '" opacity=".28"/>' +
      '<path d="M-8 20h16l3 22h-22z" ' + inked(colors['amber-pale']) + '/><path d="M-6 16h12v4h-12zM-9 42h18v4h-18z" ' + inked(CORAL, 2.2) + '/>';
  }
  const named = (paint) => (TONES[paint] ? TONES[paint].body : colors[paint] || paint);
  const paintOf = (o, fallback) => (o && o.paint ? named(o.paint) : fallback);
  const brushShape = (paint, size) => '<g transform="scale(' + size + ')"><path d="M-2.4 -30h4.8l1.2 20h-7.2z" ' + inked(colors['amber-pale'], 2.2) + '/><path d="M-4 -10h8v6.5h-8z" ' + inked(CARD, 2) + '/><path d="M-4 -3.5h8c1.5 4 -.5 7.5 -4 9.5c-3.5 -2 -5.5 -5.5 -4 -9.5z" ' + inked(paint, 2.2) + '/></g>';
  const HELD = {
    book: () => '<g transform="rotate(-8)"><path d="M-15 -12q7 -4 14 0v17q-7 -4 -14 0zM-1 -12q7 -4 14 0v17q-7 -4 -14 0z" ' + inked(CARD, 2.2) + '/><path data-fine d="M-11 -6q3 -1.5 6 0M-11 -1q3 -1.5 6 0M3 -6q3 -1.5 6 0M3 -1q3 -1.5 6 0" ' + line(1.4) + '/></g>',
    pencil: (o) => '<g transform="rotate(34)"><path d="M-3 -24h6v22l-3 7l-3 -7z" ' + inked(paintOf(o, GLOW), 2.2) + '/><path d="M-3 -19h6" ' + line(1.6) + '/><path d="M-1.2 2l1.2 3l1.2 -3z" fill="' + INK + '"/></g>',
    brush: (o, tone) => '<g transform="rotate(34)">' + brushShape(paintOf(o, tone.prop), 0.8) + '</g>',
    stylus: (o, tone) => '<g transform="rotate(70) translate(0 14)">' + (o.hold === 'brush' ? brushShape(paintOf(o, tone.prop), 1) : '<path d="M-3.4 -30h6.8v27l-3.4 8l-3.4 -8z" ' + inked(paintOf(o, PENCIL), 2.2) + '/><path d="M-3.4 -30h6.8v6h-6.8z" ' + inked(CARD, 2) + '/><path d="M-3.4 -3h6.8l-3.4 8z" ' + inked(CARD, 1.8) + '/><path d="M-1.3 2l1.3 3l1.3 -3z" fill="' + INK + '"/>') + '</g>',
    magnifier: () => '<path d="M0 2l-7 -9" stroke="' + INK + '" stroke-width="5.5" stroke-linecap="round"/><circle cx="-14" cy="-17" r="11.5" fill="' + CARD + '" fill-opacity=".55" stroke="' + INK + '" stroke-width="3"/><path data-still d="M-20 -20q2 -5 7 -6" fill="none" stroke="' + CARD + '" stroke-width="2" stroke-linecap="round"/>',
    cup: () => '<path d="M6 -8q8 0 7 6q-1 5 -8 4" ' + line(2.4) + '/><path d="M-9 -12h16v10q0 7 -8 7q-8 0 -8 -7z" ' + inked(CARD, 2.2) + '/><path class="k-steam" data-still d="M-4 -17q-3 -4 0 -7q3 -3 0 -7M3 -17q-3 -4 0 -7" fill="none" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>',
    letter: () => '<g transform="rotate(-10)"><rect x="-15" y="-11" width="28" height="19" rx="1.5" ' + inked(CARD, 2.2) + '/><path data-fine d="M-15 -10l14 10l14 -10" ' + line(1.6) + '/></g>',
    case: () => '<path d="M-7 6v-6q0 -5 7 -5q7 0 7 5v6" ' + line(3) + '/><rect x="-19" y="5" width="38" height="27" rx="3.5" ' + inked(colors['coral-deep'], 2.6) + '/><path d="M-19 14.5h38" stroke="' + INK + '" stroke-width="2"/><rect x="-3.5" y="11.5" width="7" height="6" rx="1.2" ' + inked(GLOW, 1.4) + '/>',
    phone: () => '<g transform="rotate(-12)"><rect x="-8" y="-17" width="16" height="28" rx="3.5" ' + inked(INK, 2) + '/><rect x="-5.5" y="-13.5" width="11" height="19" rx="1" fill="' + colors.lilac + '"/></g>',
    clipboard: () => '<g transform="rotate(-8)"><rect x="-13" y="-17" width="24" height="31" rx="2.5" ' + inked(GLOW, 2.2) + '/><rect x="-10" y="-12" width="18" height="23" ' + inked(CARD, 1.6) + '/><rect x="-6" y="-20" width="10" height="6" rx="1.5" ' + inked(PAPER, 2) + '/><path data-fine d="M-7 -5h12M-7 0h12M-7 5h8" ' + line(1.4) + '/></g>',
    sheet: () => '<g transform="rotate(-6)"><path d="M-14 -18h20l6 6v28h-26z" ' + inked(CARD, 2.2) + '/><path d="M6 -18v6h6" ' + line(1.8) + '/><path data-fine d="M-9 -8h12M-9 -2h16M-9 4h16M-9 10h10" ' + line(1.4) + '/></g>',
    lantern: () => lantern(),
    lens: () => '<path d="M0 3L-4 -18" stroke="' + INK + '" stroke-width="5.5" stroke-linecap="round"/><circle cx="-6" cy="-31" r="13" fill="' + CARD + '" fill-opacity=".24" stroke="' + INK + '" stroke-width="3"/><path data-still d="M-13 -35q2 -5 7 -6" fill="none" stroke="' + CARD + '" stroke-width="2" stroke-linecap="round"/>'
  };
  const MARKS = {
    zz: { every: 5, loop: 40, draw: () => ['M20 -40h9l-9 10h9', 'M35 -58h11l-11 12h11', 'M54 -80h13l-13 14h13'].map((d) => '<path d="' + d + '" ' + line(2.6) + '/>') },
    idea: { every: 2, loop: 30, draw: () => ['M-2 -44v-13', 'M17 -39l8 -10', 'M-21 -39l-8 -10'].map((d) => '<path d="' + d + '" ' + line(2.8) + '/>') },
    exclaim: { every: 2, loop: 26, draw: () => ['<path d="M6 -66v17" ' + line(4) + '/>', '<circle cx="6" cy="-41" r="2.6" fill="' + INK + '"/>'] },
    question: { every: 3, loop: 34, draw: () => ['<path d="M-3 -58q0 -10 9 -10q9 0 9 8q0 5 -8 9v4" ' + line(3.4) + '/>', '<circle cx="7" cy="-39" r="2.4" fill="' + INK + '"/>'] },
    sweat: { every: 4, loop: 28, draw: () => ['M33 -30q7 8 2 12q-6 -2 -2 -12z', 'M44 -10q6 7 2 10q-5 -2 -2 -10z'].map((d) => '<path d="' + d + '" ' + inked(colors.lilac, 2) + '/>') },
    hearts: { every: 5, loop: 40, draw: () => ['<path d="M22 -42' + HEART + '" ' + inked(CORAL, 2) + '/>', '<path d="M40 -62' + HEART + '" transform="translate(40 -62) scale(1.35) translate(-40 62)" ' + inked(CORAL, 1.6) + '/>'] },
    notes: { every: 5, loop: 40, draw: () => ['<path d="M24 -36v-14l9 -3v14" ' + line(2.4) + '/><ellipse cx="21" cy="-36" rx="3.6" ry="2.8" fill="' + INK + '"/><ellipse cx="30" cy="-39" rx="3.6" ry="2.8" fill="' + INK + '"/>', '<path d="M46 -58v-13" ' + line(2.4) + '/><ellipse cx="43" cy="-58" rx="3.6" ry="2.8" fill="' + INK + '"/>'] }
  };

  function keeper(options) {
    const pose = POSES[(options && options.pose) || 'perch'] || POSES.perch;
    const o = defaults({ pose: 'perch', color: 'coral', mood: 'open', lean: 0, head: 0, ink: 2.6, prop: '', carry: null, hold: null, arm: 'rest', marks: '', back: false, hang: false, by: pose.by }, pose, options);
    const stage = o.stage === 'rough' || o.stage === 'ink' ? o.stage : 'paint';
    const tone = stage === 'ink' ? UNPAINTED : TONES[o.color] || TONES.coral;
    const points = pose.torso.concat(tailPoints(pose.tail)).map((p) => turn(p[0], p[1], o.lean).concat([p[2], p[3]]));
    const samples = sampleSpine(points);
    const body = ribbon(samples);
    const bellyStart = 7;
    const bellyEnd = 40;
    const bellySpan = samples.slice(bellyStart, bellyEnd).map((s, i, all) => {
      const { nx, ny } = frameAt(samples, i + bellyStart);
      const swell = Math.pow(Math.sin((Math.PI * i) / (all.length - 1)), 0.6) * s[2] * 0.4;
      return [s[0] + nx * s[2] * 0.58, s[1] + ny * s[2] * 0.58, swell, swell];
    });
    const belly = ribbon(bellySpan, { spine: samples, start: bellyStart });
    const shadeStart = 9;
    const shadeSpan = samples.slice(shadeStart, samples.length - 30).map((s, i, all) => {
      const { nx, ny } = frameAt(samples, i + shadeStart);
      const swell = Math.pow(Math.sin((Math.PI * i) / (all.length - 1)), 0.5) * s[3] * 0.42;
      return [s[0] - nx * s[3] * 0.56, s[1] - ny * s[3] * 0.56, swell, swell];
    });
    const shade = ribbon(shadeSpan, { spine: samples, start: shadeStart });
    let ridges = '';
    for (let i = bellyStart + 6; i < bellyEnd - 3; i += 5) {
      const s = samples[i];
      const { nx, ny, tx, ty } = frameAt(samples, i);
      const outer = [s[0] + nx * s[2] * 0.97, s[1] + ny * s[2] * 0.97];
      const inner = [s[0] + nx * s[2] * 0.3, s[1] + ny * s[2] * 0.3];
      ridges += 'M' + fix(outer[0]) + ' ' + fix(outer[1]) + 'Q' + fix((outer[0] + inner[0]) / 2 + tx * 3.5) + ' ' + fix((outer[1] + inner[1]) / 2 + ty * 3.5) + ' ' + fix(inner[0]) + ' ' + fix(inner[1]);
    }
    const finAt = samples[20];
    const finFrame = frameAt(samples, 20);
    const finTurn = (Math.atan2(-finFrame.ny, -finFrame.nx) * 180) / Math.PI;
    const fin = '<g transform="translate(' + fix(finAt[0] - finFrame.nx * (finAt[3] - 5)) + ' ' + fix(finAt[1] - finFrame.ny * (finAt[3] - 5)) + ') rotate(' + fix(finTurn) + ')"><g class="k-fin">' +
      '<path d="M0 -16C11 -21 24 -13 26 -2C28 9 19 18 8 18C4 18 1 17 0 16Z" fill="' + tone.fin + '" stroke="' + INK + '" stroke-width="' + o.ink + '" stroke-linejoin="round"/>' +
      '<path data-fine d="M4 -7L17 -9M4 1L20 2M4 9L15 11" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round" fill="none"/></g></g>';

    const armIndex = pose.shoulder || SHOULDER_AT;
    const armAt = samples[armIndex];
    const armFrame = frameAt(samples, armIndex);
    const armFor = (gesture) => {
      const out = gesture ? gesture.out : 0.2;
      const shoulder = [armAt[0] + armFrame.nx * armAt[2] * out, armAt[1] + armFrame.ny * armAt[2] * out];
      if (!gesture) return { svg: '', over: '', hand: shoulder };
      let swing = gesture.turn + o.lean;
      let r = gesture.reach;
      const facing = o.back ? -1 : 1;
      const eyeNow = turn(EYE_AT[0] * facing, EYE_AT[1], o.head);
      const snoutNow = turn(SNOUT_TIP[0] * facing, SNOUT_TIP[1], o.head);
      const target = gesture.toEye ? [eyeNow[0] + LENS_HAND[0] * facing, eyeNow[1] + LENS_HAND[1]] : gesture.toSnout ? [snoutNow[0] + gesture.toSnout[0] * facing, snoutNow[1] + gesture.toSnout[1]] : gesture.to;
      if (target) {
        const limits = gesture.toEye ? LENS_REACH : ARM_REACH;
        swing = (Math.atan2(target[1] - shoulder[1], target[0] - shoulder[0]) * 180) / Math.PI;
        r = Math.min(Math.max(Math.hypot(target[0] - shoulder[0], target[1] - shoulder[1]), limits[0]), limits[1]) + 2;
      }
      const reachTo = turn(r - 2, 0, swing);
      const drawHeld = typeof o.hold === 'object' ? (gesture.rest ? '<g transform="translate(-3 -6) rotate(' + fix(swing - 146) + ')">' + miniTag(defaults(o.hold, { length: 3 })) + '</g>' : '<g class="swing" data-a="6" data-s=".45">' + miniTag(o.hold) + '</g>') : (HELD[gesture.toEye && o.hold === 'magnifier' ? 'lens' : gesture.tool && WORK_TOOLS.includes(o.hold) ? 'stylus' : o.hold] || HELD.book)(o, tone);
      const ahead = gesture.ahead && typeof o.hold === 'string' ? ' translate(' + gesture.ahead[0] + ' ' + gesture.ahead[1] + ')' : '';
      const held = o.hold ? '<g transform="translate(' + fix(r - 2) + ' 0) rotate(' + fix(-swing) + ')' + ahead + (o.holdsize ? ' scale(' + Number(o.holdsize) + ')' : '') + '">' + drawHeld + '</g>' : '';
      const armPlace = '<g transform="translate(' + fix(shoulder[0]) + ' ' + fix(shoulder[1]) + ') rotate(' + fix(swing) + ')">';
      return {
        hand: [shoulder[0] + reachTo[0], shoulder[1] + reachTo[1]],
        over: gesture.toEye ? armPlace + held + '</g>' : '',
        svg: armPlace + '<g class="k-arm" data-a="' + gesture.wag + '">' +
          '<path d="M0 0C' + fix(r * 0.2) + ' -8 ' + fix(r * 0.8) + ' -8 ' + r + ' -1C' + fix(r * 0.8) + ' 7 ' + fix(r * 0.25) + ' 8 0 0Z" ' + inked(tone.fin, 2.3) + '/>' +
          (gesture.fist ? '<ellipse cx="' + fix(r - 3) + '" cy="0" rx="6.5" ry="7.5" ' + inked(tone.fin, 2.3) + '/><path data-fine d="M' + fix(r - 5) + ' -4q3 4 0 8" ' + line(1.5) + '/>' : '') + (gesture.toEye ? '' : held) + '</g></g>'
      };
    };
    const acts = pose.acts && !(options && options.arm) ? Object.keys(pose.acts).map((name) => Object.assign({ name }, armFor(ARMS[pose.acts[name]]))) : null;
    const single = acts ? acts[0] : armFor(ARMS[o.arm]);
    const hand = single.hand;
    const heldOver = single.over;
    const arm = acts
      ? acts.map((act, i) => '<g data-act="' + act.name + '"' + (i ? ' display="none"' : '') + '>' + (i && pose.rope ? '<path d="M' + fix(act.hand[0]) + ' ' + fix(act.hand[1]) + 'L' + fix(hand[0]) + ' ' + fix(hand[1]) + '" ' + line(fix(o.ink * 0.95)) + '/>' : '') + act.svg + '</g>').join('')
      : single.svg;

    const headShapes = '<path d="' + SNOUT + '"/>' + crest() + '<ellipse rx="' + HEAD_RX + '" ry="' + HEAD_RY + '"/>';
    const headTurn = 'rotate(' + o.head + ')' + (o.back ? ' scale(-1 1)' : '');
    const tip = turn(o.back ? -SNOUT_TIP[0] : SNOUT_TIP[0], SNOUT_TIP[1], o.head);
    const carried = o.carry ? '<g transform="translate(' + fix(tip[0]) + ' ' + fix(tip[1]) + ')"><g class="swing" data-a="7" data-s=".5">' + (o.carry === 'lantern' ? lantern() : o.carry === 'letter' ? '<g transform="translate(-4 8)">' + HELD.letter() + '</g>' : miniTag(o.carry)) + '</g></g>' : '';
    const props = String(o.prop || '').split(',').map((name) => name.trim()).filter(Boolean);
    const worn = props.filter((name) => BODYWEAR[name]).map((name) => BODYWEAR[name](samples, tone)).join('');
    const hats = props.filter((name) => HEADWEAR[name]).map((name) => HEADWEAR[name](tone)).join('');
    const face = (FACES[o.mood] || FACES.open)(tone, { magnify: Boolean(!acts && ARMS[o.arm] && ARMS[o.arm].toEye && o.hold === 'magnifier') || undefined, gaze: LOOKS[o.look], gazes: acts && !o.look ? pose.gazes : undefined });
    const last = samples[samples.length - 1];
    const farRight = Math.max(...samples.map((s) => s[0]));
    const mark = MARKS[o.marks];
    const voice = o.marks === 'say' ? '<g class="cycle" data-loop="24" data-every="3" transform="translate(' + fix(tip[0] - 9) + ' ' + fix(tip[1]) + ')">' + [7, 12.5, 18].map((half, i) => '<path d="M' + -i * 9 + ' ' + -half + 'q' + -(5 + i * 4) + ' ' + half + ' 0 ' + half * 2 + '" ' + line(2.6) + '/>').join('') + '</g>' : '';
    const emanata = voice || (o.marks === 'speed'
      ? '<g class="cycle" data-loop="18" data-every="2">' + [[14, -10, 30], [26, 4, 36], [16, 18, 24]].map((m) => '<path d="M' + fix(farRight + m[0]) + ' ' + fix(last[1] + m[1]) + 'h' + m[2] + '" ' + line(2.8) + '/>').join('') + '</g>'
      : mark ? '<g class="cycle" data-loop="' + mark.loop + '" data-every="' + mark.every + '">' + mark.draw().join('') + '</g>' : '');

    const drawn = '<g class="k"><g class="k-hop">' + fin +
      '<g fill="' + INK + '" stroke="' + INK + '" stroke-width="' + o.ink * 2 + '" stroke-linejoin="round"><path d="' + body + '"/><g transform="' + headTurn + '">' + headShapes + '</g></g>' +
      '<path d="' + body + '" fill="' + tone.body + '"/><path d="' + shade + '" fill="' + tone.shade + '" opacity=".5"/><path d="' + belly + '" fill="' + tone.belly + '"/>' +
      '<path data-fine d="' + ridges + '" fill="none" stroke="' + INK + '" stroke-width="1.7" stroke-linecap="round"/>' +
      worn + arm + carried +
      '<g transform="' + headTurn + '"><g fill="' + tone.body + '">' + headShapes + '</g>' +
      '<path data-still d="M-49.4 5.5c2 2.2 2 5 0 7.2" fill="none" stroke="' + INK + '" stroke-width="1.7" stroke-linecap="round"/>' +
      '<path d="M-7 -25.7A28 26.5 0 1 1 -7 25.7A28 26.5 0 0 0 -7 -25.7Z" fill="' + tone.shade + '" opacity=".42"/>' +
      '<circle cx="2" cy="12" r="5.2" fill="' + tone.shade + '" opacity=".55"/>' +
      face + hats + '</g>' + heldOver + emanata + '</g></g>';

    const bagAt = props.includes('satchel') ? strap(samples, 9, 31) : null;
    const bag = bagAt ? turn(-1, 6.5, bagAt.angle).map((n, i) => n + bagAt.b[i]) : null;
    let figure = drawn;
    if (stage === 'ink') {
      figure = drawn.replace(PAINT, '$1="' + CARD + '"').replace(ALIVE, '').replace('<path data-fine d="' + ridges, '<path d="' + belly + '" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-linejoin="round"/><path data-fine d="' + ridges);
    }
    if (stage === 'rough') {
      const pencil = 'fill="none" stroke="' + (o.pencil ? named(o.pencil) : PENCIL) + '" stroke-linecap="round" stroke-linejoin="round"';
      const twice = (cx, cy, rx, ry, spin) => '<ellipse cx="' + fix(cx) + '" cy="' + fix(cy) + '" rx="' + fix(rx) + '" ry="' + fix(ry) + '" transform="rotate(' + spin + ' ' + fix(cx) + ' ' + fix(cy) + ')" stroke-width="2" ' + pencil + '/>' +
        '<ellipse cx="' + fix(cx + 0.9) + '" cy="' + fix(cy - 0.7) + '" rx="' + fix(rx * 1.07) + '" ry="' + fix(ry * 1.05) + '" transform="rotate(' + (spin + 11) + ' ' + fix(cx) + ' ' + fix(cy) + ')" stroke-width="1.1" opacity=".55" ' + pencil + '/>';
      const action = 'M' + samples.filter((point, i) => i % 3 === 0).map((point) => fix(point[0]) + ' ' + fix(point[1])).join('L');
      const masses = points.map((point, i) => {
        if (i === 0 || (i > 5 && i % 2 === 1)) return '';
        const at = frameAt(samples, Math.min(i * SAMPLES_PER_SPAN, samples.length - 1));
        const side = (point[2] - point[3]) / 2;
        const spin = (Math.atan2(at.ty, at.tx) * 180) / Math.PI;
        return twice(point[0] + at.nx * side, point[1] + at.ny * side, (point[2] + point[3]) / 2, (point[2] + point[3]) / 2 * 1.08, spin);
      }).join('');
      const finSketch = '<g transform="translate(' + fix(finAt[0] - finFrame.nx * (finAt[3] - 5)) + ' ' + fix(finAt[1] - finFrame.ny * (finAt[3] - 5)) + ') rotate(' + fix(finTurn) + ')"><path d="M0 -15C12 -20 25 -12 26 -1C27 9 18 17 7 17" stroke-width="1.5" ' + pencil + '/></g>';
      const bagSketch = bagAt ? '<path d="M' + fix(bagAt.a[0]) + ' ' + fix(bagAt.a[1]) + 'L' + fix(bagAt.b[0]) + ' ' + fix(bagAt.b[1]) + '" stroke-width="1.3" ' + pencil + '/><rect x="-13" y="-3" width="24" height="19" rx="3" transform="translate(' + fix(bagAt.b[0]) + ' ' + fix(bagAt.b[1]) + ') rotate(' + fix(bagAt.angle) + ')" stroke-width="1.5" ' + pencil + '/>' : '';
      figure = '<g>' +
        '<path d="' + action + '" stroke-width="1.8" ' + pencil + '/>' + masses +
        '<g transform="' + headTurn + '">' + twice(0, 0, HEAD_RX, HEAD_RY, 0) +
        '<path d="M-27 -3Q-8 -9 27 -4M-9 -26Q-15 0 -9 26" stroke-width="1.1" opacity=".7" ' + pencil + '/>' +
        '<path d="M-15 -8L-46 1M-13 17L-46 16" stroke-width="1.9" ' + pencil + '/>' + twice(-45, 9, 6.5, 8.5, 0) +
        '<path d="M' + (EYE_AT[0] - 5) + ' ' + (EYE_AT[1] - 5) + 'l10 10M' + (EYE_AT[0] + 5) + ' ' + (EYE_AT[1] - 5) + 'l-10 10" stroke-width="1.7" ' + pencil + '/>' +
        '<path d="M10 -24l7 -11M-2 -27l-1 -12M-13 -23l-8 -9" stroke-width="1.5" ' + pencil + '/></g>' + finSketch + bagSketch +
        '<path d="' + body + '" stroke-width="1.2" opacity=".5" ' + pencil + '/></g>';
    }
    const flipY = o.hang ? -1 : 1;
    const svg = o.hang ? '<g transform="scale(1 -1)">' + figure + '</g>' : figure;
    const coil = turn(pose.tail.cx, pose.tail.cy, o.lean);
    const lowest = samples.reduce((low, s) => (s[1] + s[3] > low[1] ? [s[0], s[1] + s[3]] : low), [0, -1e9]);
    const eyeAt = turn(o.back ? -EYE_AT[0] : EYE_AT[0], EYE_AT[1], o.head);
    const chestAt = samples[22];
    const chestFrame = frameAt(samples, 22);
    const anchors = {
      curl: [coil[0], coil[1] * flipY], head: [0, 0], base: [lowest[0], lowest[1] * flipY], tip: [tip[0], tip[1] * flipY], hand: [hand[0], hand[1] * flipY],
      eye: [eyeAt[0], eyeAt[1] * flipY],
      chest: [chestAt[0] + chestFrame.nx * chestAt[2] * 0.62, (chestAt[1] + chestFrame.ny * chestAt[2] * 0.62) * flipY],
      fin: [finAt[0] - finFrame.nx * (finAt[3] + 9), (finAt[1] - finFrame.ny * (finAt[3] + 9)) * flipY]
    };
    if (bag) anchors.satchel = [bag[0], bag[1] * flipY];
    const withTool = ARMS[acts ? pose.acts[acts[0].name] : o.arm] && ARMS[acts ? pose.acts[acts[0].name] : o.arm].tool && WORK_TOOLS.includes(o.hold);
    if (withTool) anchors.pencil = [hand[0] + PENCIL_TIP[0], (hand[1] + PENCIL_TIP[1]) * flipY];
    if (acts) acts.slice(1).forEach((act) => {
      const named = act.name[0].toUpperCase() + act.name.slice(1);
      anchors['hand' + named] = [act.hand[0], act.hand[1] * flipY];
      if (withTool) anchors['pencil' + named] = [act.hand[0] + PENCIL_TIP[0], (act.hand[1] + PENCIL_TIP[1]) * flipY];
    });
    const xs = samples.map((s) => s[0]).concat([-62, 36, hand[0] - 26, hand[0] + 26, tip[0] - 22]);
    const ys = samples.map((s) => s[1]).concat([-46, 30, hand[1] - 30, hand[1] + 30]);
    if (hats.includes('M-30 -22L-96')) xs.push(-100);
    if (props.includes('nightcap')) xs.push(58);
    if (voice) xs.push(tip[0] - 52);
    if (mark || o.marks === 'speed') {
      ys.push(-98);
      xs.push(o.marks === 'speed' ? farRight + 70 : 72);
    }
    if (o.carry) ys.push(tip[1] + 86);
    if (typeof o.hold === 'object' || o.hold === 'lantern') ys.push(hand[1] + 84);
    const pad = 26;
    const top = Math.min(...ys) - pad;
    const height = Math.max(...ys) - Math.min(...ys) + pad * 2;
    const box = [Math.min(...xs) - pad, o.hang ? -(top + height) : top, Math.max(...xs) - Math.min(...xs) + pad * 2, height];
    return { svg, box, anchors, by: o.by, curl: anchors.curl, tip: anchors.tip, hand: anchors.hand };
  }

  function seat(k, x, y, scale, options) {
    const o = defaults({ flip: false, by: k.by, motion: '' }, options);
    const sx = o.flip ? -scale : scale;
    const anchor = k.anchors[o.by] || k.anchors.head;
    return '<g transform="translate(' + fix(x - anchor[0] * sx) + ' ' + fix(y - anchor[1] * scale) + ') scale(' + sx + ' ' + scale + ')"><g ' + o.motion + '>' + k.svg + '</g></g>';
  }
  function threadPoint(thread, t) {
    const [x1, y1, cx, cy, x2, y2] = thread;
    const u = 1 - t;
    return [u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2];
  }
  function threadPath(thread) {
    return 'M' + thread[0] + ' ' + thread[1] + 'Q' + thread[2] + ' ' + thread[3] + ' ' + thread[4] + ' ' + thread[5];
  }
  function threadPart(thread, from, until) {
    const [x1, y1, cx, cy, x2, y2] = thread;
    const blend = (a, b, c) => (1 - from) * (1 - until) * a + ((1 - from) * until + from * (1 - until)) * b + from * until * c;
    const start = threadPoint(thread, from);
    const end = threadPoint(thread, until);
    return [start[0], start[1], blend(x1, cx, x2), blend(y1, cy, y2), end[0], end[1]].map((n) => Math.round(n * 10) / 10);
  }
  function threadAngle(thread, t) {
    const [x1, y1, cx, cy, x2, y2] = thread;
    return Math.atan2((1 - t) * (cy - y1) + t * (y2 - cy), (1 - t) * (cx - x1) + t * (x2 - cx));
  }
  const FRAY = 'M-1 0C5 -1 9 -6 16 -4M-3 0C4 1 11 -2 22 2M-2 0C3 2 6 8 13 6M-10 0C-7 -3 -3 -6 2 -7M-15 0C-12 3 -9 5 -5 5';
  function strand(thread, options) {
    const o = defaults({ color: INK, width: 3.2, dotted: false, from: 0, until: 1, frayed: false }, options);
    const part = o.from > 0 || o.until < 1 ? threadPart(thread, o.from, o.until) : thread;
    const drawn = '<path d="' + threadPath(part) + '" fill="none" stroke="' + o.color + '" stroke-width="' + o.width + '" stroke-linecap="round"' + (o.dotted ? ' stroke-dasharray="1 12"' : '') + '/>';
    if (!o.frayed) return drawn;
    const atStart = o.frayed === 'start';
    const t = atStart ? o.from : o.until;
    const [x, y] = threadPoint(thread, t);
    const along = threadAngle(thread, t) + (atStart ? Math.PI : 0);
    return drawn + '<path data-fine transform="translate(' + fix(x) + ' ' + fix(y) + ') rotate(' + fix((along * 180) / Math.PI) + ')" d="' + FRAY + '" fill="none" stroke="' + o.color + '" stroke-width="' + fix(o.width * 0.44) + '" stroke-linecap="round"/>';
  }
  function knot(thread, t, options) {
    const o = defaults({ color: INK, width: 3.2, size: 1 }, options);
    const [x, y] = threadPoint(thread, t);
    const pen = 'fill="none" stroke="' + o.color + '" stroke-linecap="round" stroke-linejoin="round"';
    return '<g transform="translate(' + fix(x) + ' ' + fix(y) + ') rotate(' + fix((threadAngle(thread, t) * 180) / Math.PI) + ') scale(' + o.size + ')">' +
      '<path d="M-12 0C-7 0 -7 -6 -2 -6C4 -6 5 4 -1 5C-6 5 -6 -2 0 -3C5 -3 7 0 12 0" stroke-width="' + o.width + '" ' + pen + '/>' +
      '<path data-fine d="M-4 -6C-6 -11 -9 -14 -13 -17M2 -4C5 -9 8 -13 13 -15" stroke-width="' + fix(o.width * 0.7) + '" ' + pen + '/></g>';
  }
  function hung(thread, t, options) {
    const [x, y] = threadPoint(thread, t);
    const o = options || {};
    return '<g transform="translate(' + fix(x) + ' ' + fix(y) + ')"><g class="pop"><g class="swing" data-a="' + (o.sway || 4) + '" data-s="' + (o.speed || 0.3) + '" data-p="' + t + '">' + (o.lantern ? lantern(o.string) : miniTag(o)) + '</g></g></g>';
  }
  function scallops(cx, cy, rx, ry, widths, squash) {
    const at = (deg) => [cx + Math.cos(rad(deg)) * rx, cy + Math.sin(rad(deg)) * ry * (Math.sin(rad(deg)) > 0 ? squash : 1)];
    let angle = -100;
    let last = at(angle);
    let d = 'M' + fix(last[0]) + ' ' + fix(last[1]);
    widths.forEach((w) => {
      angle += w;
      const next = at(angle);
      const r = fix(Math.hypot(next[0] - last[0], next[1] - last[1]) * 0.64);
      d += 'A' + r + ' ' + r + ' 0 0 1 ' + fix(next[0]) + ' ' + fix(next[1]);
      last = next;
    });
    return d + 'Z';
  }
  const MARK_BOX = [0, 0, 64, 64];
  const MARK_CORNER = 14;
  const markHead = (tone) => '<g transform="translate(27 27.5) scale(-0.6 0.6) rotate(-4)" fill="' + tone.fg + '"><path d="M-5.95 9.11L-5.02 11.28L-3.75 14.02L-2.36 17L-0.92 20.19L0.46 23.47L1.67 26.69L2.61 29.67L3.21 32.38L3.46 35.13L3.41 38.09L3.09 41.15L2.54 44.41L1.82 47.93L0.96 51.78L0.06 56.04L-0.75 60.61L-1.42 65.84L-2.24 72L-3.43 78.73L-4.81 85.62L-6.18 92.31L-7.38 98.43L-8.28 103.64L-8.84 107.51L28.84 112.49L29.29 108.73L29.82 103.57L30.33 97.31L30.81 90.38L31.28 83.15L31.81 76L32.41 69.28L32.75 63.39L32.65 58.35L32.35 53.69L31.94 49.2L31.46 44.84L30.91 40.56L30.28 36.32L29.58 32.07L28.79 27.62L27.71 22.9L26.26 18.24L24.62 13.87L22.92 9.81L21.27 6.16L19.81 3.04L18.7 0.65L17.95 -1.11Z"/><path d="M-12 -8C-22 -6 -30 0 -38 3C-41 .5 -50 0 -50 9C-50 18 -41 17.5 -38 15C-30 18 -22 20 -10 17Z"/><ellipse cx="15.66" cy="-23.21" rx="7.5" ry="5.2" transform="rotate(-56 15.66 -23.21)"/><ellipse cx="3.14" cy="-29.84" rx="9.5" ry="5.2" transform="rotate(-84 3.14 -29.84)"/><ellipse cx="-10.49" cy="-25.96" rx="7.5" ry="5.2" transform="rotate(-112 -10.49 -25.96)"/><ellipse rx="28" ry="26.5"/><ellipse cx="-8.5" cy="-4" rx="7.4" ry="8.8" fill="' + tone.bg + '"/><ellipse cx="-11" cy="-2.6" rx="3.7" ry="4.9"/></g>';
  const markCut = (art, bottom) => '<svg x="0" y="0" width="64" height="' + bottom + '" viewBox="0 0 64 ' + bottom + '">' + art + '</svg>';
  const MARK = {
    free: (tone) => markCut(markHead(tone), 59),
    tile: (tone) => '<g transform="translate(4.5 8) scale(0.9)">' + markCut(markHead(tone), 80) + '</g>'
  };
  const MARK_TONES = {
    light: { fg: colors.violet, accent: colors['violet-deep'], second: colors['violet-deep'], bead: CORAL, bg: PAPER },
    dark: { fg: PAPER, accent: PAPER, second: colors['violet-pale'], bead: colors.glow, bg: INK },
    tile: { fg: CARD, accent: CARD, second: colors['violet-pale'], bead: colors.glow, bg: colors.violet }
  };
  function mark(tone, ground) {
    return MARK.free(defaults(MARK_TONES[tone] || MARK_TONES.light, ground ? { bg: ground } : {}));
  }
  mark.box = MARK_BOX;
  mark.icon = (corner) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + MARK_BOX.join(' ') + '"><rect width="' + MARK_BOX[2] + '" height="' + MARK_BOX[3] + '" rx="' + (corner === undefined ? MARK_CORNER : corner) + '" fill="' + MARK_TONES.tile.bg + '"/>' + MARK.tile(MARK_TONES.tile) + '</svg>';
  function voice(speaker) {
    const [x, y] = speaker.mouth;
    return '<g class="boil cycle say" data-loop="30" data-every="4" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round">' +
      [19, 35, 51].map((half, i) => '<path d="M' + (x - i * 30) + ' ' + (y - half) + 'q' + -(13 + i * 11) + ' ' + half + ' 0 ' + half * 2 + '"/>').join('') + '</g>';
  }
  const sway = (phase, amp) => 'class="sway" data-a="' + (amp || 2.4) + '" data-s=".22" data-p="' + (phase || 0) + '"';
  const bob = (phase, amp) => 'class="bob" data-a="' + (amp || 6) + '" data-s=".3" data-p="' + (phase || 0) + '"';

  const PHONE = { x: 72, y: 12, w: 156, h: 320, r: 31, rim: 8 };
  const PHONE_BOX = [0, 0, 300, 446];
  const PHONE_THREAD = [80, 189, 152, 203, 228, 192];
  const PHONE_ANCHORS = { thread: [240, 192], top: [150, 12], base: [160, 442], screen: [150, 172] };
  const PHONE_FIELD = { x: 97, y: 282, w: 112, h: 24, send: 196 };
  const PHONE_HEAD = -4;
  const MEMORIS_AT = 0.63;
  const MEMORIS_SCALE = 0.78;
  const MEMORIS_ANCHORS = ['hand', 'eye', 'tip'];
  const MEMORIS_FAR = { at: MEMORIS_AT, scale: MEMORIS_SCALE, ink: 3.5 };
  const MEMORIS_NEAR = { at: 0.6, scale: 1.3, ink: 2.1, sag: 300 };
  const KEPT = [{ at: 0.13, length: 11 }, { at: 0.34, length: 15 }, { at: 0.235, length: 41 }];
  const KEPT_SIZE = [24, 29];
  const FINGERS = [[170, 27, -7, 207], [199, 28, -2, 204], [227, 26, 3, 206], [253, 22, 8, 211]];
  const FINGER_END = 259;
  const FINGER_SHADE = { inset: 8, from: 0.2, round: 0.3, lift: 1.6 };
  const PALM = 'M78 252C62 268 47 298 48 327C51 357 96 380 124 397L126 420H194L196 397C224 381 246 357 251 323C254 297 252 262 246 232Z';
  const PALM_SHADE = 'M251 323C246 357 224 381 196 397L195 409C150 404 118 392 96 378C140 388 196 372 236 318Z';
  const THUMB = 'M48 329C61 306 81 285 100 272C109 265 123 266 125 278C126 286 122 291 117 294C103 305 88 327 77 351';
  const THUMB_SHADE = 'M77 351C88 327 103 305 117 294C122 291 126 286 125 278C116 290 100 300 88 316C80 327 74 340 70 352Z';
  const HAND = PAPER;
  const HAND_SHADE = colors['paper-deep'];
  const CUFF = colors.tissue;
  function fingerShade(from, y, tall) {
    const round = tall * FINGER_SHADE.round;
    const run = FINGER_END - from - FINGER_SHADE.inset * 2;
    const bend = (down) => 'a' + fix(round) + ' ' + fix(round) + ' 0 0 1 ' + fix(-round) + ' ' + fix(down * (round - FINGER_SHADE.lift));
    return 'M' + (from + FINGER_SHADE.inset) + ' ' + fix(y + tall * FINGER_SHADE.from) + 'h' + run + bend(1) + 'h' + fix(round * 2 - run) + bend(-1) + 'z';
  }
  function hand(part) {
    const paper = 'fill="' + HAND + '" stroke="' + INK + '" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"';
    const shade = (d) => '<path d="' + d + '" fill="' + HAND_SHADE + '"/>';
    if (part === 'behind') {
      return '<path d="' + PALM + '" ' + paper + '/>' + shade(PALM_SHADE) +
        '<rect x="108" y="405" width="104" height="37" rx="13" transform="rotate(2 160 423)" fill="' + CUFF + '" stroke="' + INK + '" stroke-width="3.2" stroke-linejoin="round"/>' +
        '<circle data-still cx="194" cy="425" r="3.4" fill="' + INK + '"/>';
    }
    const fingers = FINGERS.map(([y, tall, tilt, from]) => '<g transform="rotate(' + tilt + ' ' + (FINGER_END - 12) + ' ' + y + ')"><rect x="' + from + '" y="' + fix(y - tall / 2) + '" width="' + (FINGER_END - from) + '" height="' + tall + '" rx="' + fix(tall / 2) + '" ' + paper + '/>' + shade(fingerShade(from, y, tall)) +
      '<path data-fine d="M' + (from + 15) + ' ' + fix(y - tall * 0.26) + 'q4 ' + fix(tall * 0.26) + ' 0 ' + fix(tall * 0.52) + '" fill="none" stroke="' + INK + '" stroke-width="1.7" stroke-linecap="round"/></g>').join('');
    return '<path d="' + THUMB + '" ' + paper + '/>' + shade(THUMB_SHADE) +
      '<path data-fine d="M104 276q8 -3 13 3" fill="none" stroke="' + INK + '" stroke-width="1.9" stroke-linecap="round"/>' + fingers;
  }
  const listed = (names) => [].concat(names || []).join(',').split(',').map((name) => name.trim()).filter(Boolean);
  function phone(options) {
    const o = defaults({ pose: 'perch', kept: [], rim: '', prop: '', flip: false, near: false }, options);
    const size = o.near ? MEMORIS_NEAR : MEMORIS_FAR;
    const wide = PHONE_BOX[2];
    const across = (x) => (o.flip ? wide - x : x);
    const mirrored = o.flip ? ' transform="translate(' + wide + ' 0) scale(-1 1)"' : '';
    const thread = PHONE_THREAD.map((n, i) => (i === 3 && o.near ? size.sag : i % 2 ? n : across(n)));
    const pose = POSES[o.pose] || POSES.perch;
    const memoris = keeper({
      pose: o.pose, color: MEMORIS, prop: listed(['satchel', o.prop]).join(','), mood: o.mood, arm: o.arm, marks: o.marks, look: o.look, ink: size.ink,
      head: pose.head === undefined ? PHONE_HEAD : undefined,
      hold: typeof o.hold === 'string' && TAG_MARKS[o.hold] && !HELD[o.hold] ? { mark: o.hold } : o.hold
    });
    const [kx, ky] = threadPoint(thread, size.at);
    const p = PHONE;
    const glass = 'x="' + (p.x + p.rim) + '" y="' + (p.y + p.rim) + '" width="' + (p.w - p.rim * 2) + '" height="' + (p.h - p.rim * 2) + '" rx="' + (p.r - p.rim) + '"';
    const field = PHONE_FIELD;
    const clip = 'phone-screen-' + Math.random().toString(36).slice(2, 8);
    const rim = o.rim ? ' stroke="' + (colors[o.rim] || o.rim) + '" stroke-width="3"' : '';
    const svg = '<g class="boil"' + mirrored + '>' + hand('behind') + '</g>' +
      '<g class="boil"><rect x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h + '" rx="' + p.r + '" fill="' + INK + '"' + rim + '/></g>' +
      '<rect data-still ' + glass + ' fill="' + colors.lilac + '" style="fill:var(--screen,' + colors.lilac + ')"/>' +
      '<rect data-still x="131" y="29" width="38" height="11" rx="5.5" fill="' + INK + '"/>' +
      (o.near ? '' : '<g class="boil"><rect x="' + Math.min(across(field.x), across(field.x + field.w)) + '" y="' + field.y + '" width="' + field.w + '" height="' + field.h + '" rx="' + field.h / 2 + '" fill="' + CARD + '" stroke="' + INK + '" stroke-width="2.4"/></g>' +
        '<circle data-still cx="' + across(field.send) + '" cy="' + (field.y + field.h / 2) + '" r="7" fill="' + colors.violet + '"/>') +
      '<rect data-still x="128" y="315" width="44" height="4" rx="2" fill="' + INK + '" opacity=".4"/>' +
      '<clipPath id="' + clip + '"><rect ' + glass + '/></clipPath>' +
      '<g class="boil" clip-path="url(#' + clip + ')">' + strand(thread, { width: 3 }) +
      (o.near ? [] : listed(o.kept)).map((mark, i) => hung(thread, KEPT[i % KEPT.length].at, { mark, length: KEPT[i % KEPT.length].length, w: KEPT_SIZE[0], h: KEPT_SIZE[1], fill: i % 2 ? colors['amber-pale'] : CARD, sway: 4 })).join('') +
      seat(memoris, kx, ky, size.scale, { flip: !o.flip, motion: sway(0.3, 1.8) }) + '</g>' +
      '<g class="boil"' + mirrored + '>' + hand('front') + '</g>';
    const anchors = {};
    Object.keys(PHONE_ANCHORS).forEach((name) => {
      anchors[name] = [across(PHONE_ANCHORS[name][0]), PHONE_ANCHORS[name][1]];
    });
    const grip = memoris.anchors[memoris.by] || memoris.anchors.curl;
    const facing = o.flip ? 1 : -1;
    MEMORIS_ANCHORS.forEach((name) => {
      const [x, y] = memoris.anchors[name];
      anchors[name] = [Math.round((kx + (x - grip[0]) * facing * size.scale) * 10) / 10, Math.round((ky + (y - grip[1]) * size.scale) * 10) / 10];
    });
    return { svg, box: PHONE_BOX, anchors, by: 'thread' };
  }

  const BAY_BAND = 13;
  const BAY_ACROSS = { sizes: [[64, 17], [92, 21], [56, 14], [80, 19], [70, 16]], least: 34 };
  const BAY_DOWN = { sizes: [[70, 18], [110, 22], [60, 14], [90, 20], [80, 16], [70, 19]], least: 30 };
  function bumps(length, edge, start) {
    const out = [];
    let done = 0;
    for (let i = start; done < length - 1; i++) {
      const [size, depth] = edge.sizes[i % edge.sizes.length];
      const step = length - done - size < edge.least ? length - done : size;
      out.push([step, depth]);
      done += step;
    }
    return out;
  }
  function bayPath(options) {
    const o = defaults({ x: 0, y: 0, w: 300, h: 300, side: 'left' }, options);
    const sweep = o.side === 'left' ? 0 : 1;
    const along = o.side === 'left' ? -1 : 1;
    const arc = (rx, ry, dx, dy) => 'a' + fix(rx) + ' ' + fix(ry) + ' 0 0 ' + sweep + ' ' + fix(dx) + ' ' + fix(dy);
    let d = 'M' + (o.side === 'left' ? o.x + o.w : o.x) + ' ' + o.y;
    bumps(o.w, BAY_ACROSS, 0).forEach(([step, depth]) => {
      d += arc(step / 2, depth, along * step, 0);
    });
    bumps(o.h, BAY_DOWN, 0).forEach(([step, depth]) => {
      d += arc(depth, step / 2, 0, step);
    });
    bumps(o.w, BAY_ACROSS, 2).forEach(([step, depth]) => {
      d += arc(step / 2, depth, -along * step, 0);
    });
    if (o.side === 'both') bumps(o.h, BAY_DOWN, 3).forEach(([step, depth]) => {
      d += arc(depth, step / 2, 0, -step);
    });
    return d + 'Z';
  }
  function bay(options) {
    const d = bayPath(options);
    const clip = 'bay-' + Math.random().toString(36).slice(2, 8);
    const lean = options && options.side === 'right' ? -BAY_BAND : BAY_BAND;
    return '<path data-still d="' + d + '" fill="' + colors['tissue-deep'] + '"/><clipPath id="' + clip + '"><path d="' + d + '"/></clipPath>' +
      '<g clip-path="url(#' + clip + ')"><path data-still d="' + d + '" transform="translate(' + lean + ' ' + BAY_BAND + ')" fill="' + colors.tissue + '"/></g>';
  }

  const MEETING = { box: [0, 0, 560, 340], line: 180, phone: [190, 0.62], bay: { x: 312, y: 26, w: 4000, h: 258 }, blob: { x: 312, y: 26, w: 330, h: 258, side: 'both' }, ends: 14, keeper: 436, tags: [[500, 'heart', 24, CARD], [540, 'face', 40, colors['amber-pale']]] };
  const MEETING_THREAD = [MEETING.phone[0], MEETING.line, 380, MEETING.line + 4, 570, MEETING.line];
  function threshold(options) {
    const o = defaults({ kept: 'key,face,heart', mood: 'glad', left: 'coral', prop: '', wall: true }, options);
    const thread = MEETING_THREAD;
    const at = (x) => (x - thread[0]) / (thread[4] - thread[0]);
    const held = phone({ mood: o.mood, kept: o.kept });
    const yours = keeper({ color: o.left, prop: o.prop, mood: o.mood, head: -6, ink: 3 });
    const [x, y] = threadPoint(thread, at(MEETING.keeper));
    const stop = MEETING.blob.x + MEETING.blob.w - MEETING.ends;
    const walls = o.wall ? '<g class="threshold__open">' + bay(MEETING.bay) + '</g><g class="threshold__closed">' + bay(MEETING.blob) + '</g>' : '';
    const rest = o.wall ? '<g class="threshold__closed">' + strand([thread[4], thread[5], (thread[4] + stop) / 2, thread[5] + 1, stop, thread[5]], { width: 3 }) + '</g>' : '';
    return walls + '<g class="boil">' + strand(thread, { width: 3 }) + rest +
      MEETING.tags.map(([tx, mark, length, fill]) => hung(thread, at(tx), { mark, length, w: 30, h: 38, fill, sway: 4 })).join('') +
      seat(yours, x, y, 1.02, { motion: sway(0.2, 2) }) + '</g>' +
      seat(held, MEETING.phone[0], MEETING.line, MEETING.phone[1]);
  }
  threshold.thread = MEETING_THREAD;

  const PAIR = { box: [0, 0, 560, 290], line: 226, apart: 24, tags: [[0.12, 'lines', 16], [0.9, 'face', 22]] };
  const PAIR_THREAD = [0, PAIR.line, 280, PAIR.line, 560, PAIR.line];
  function pair(options) {
    const o = defaults({ left: 'coral', mood: 'glad', prop: '' }, options);
    const thread = PAIR_THREAD;
    const yours = keeper({ color: o.left, mood: o.mood, prop: o.prop || '', head: -6, ink: 3 });
    const memoris = keeper({ color: MEMORIS, mood: o.mood, prop: 'satchel', head: -6, ink: 3 });
    const [x, y] = threadPoint(thread, 0.5);
    return '<g class="boil">' + strand(thread, { width: 3 }) +
      PAIR.tags.map(([at, mark, length]) => hung(thread, at, { mark, length, w: 30, h: 38, fill: CARD, sway: 4 })).join('') +
      seat(yours, x - PAIR.apart, y - 1, 1.02, { flip: true, motion: sway(0, 2) }) +
      seat(memoris, x + PAIR.apart, y - 1, 1.02, { motion: sway(0.5, 2) }) + '</g>';
  }
  pair.thread = PAIR_THREAD;
  pair.box = PAIR.box;
  threshold.box = MEETING.box;

  Object.assign(M, {
    ink: INK, card: CARD, paper: PAPER, colors, tones: TONES, memoris: MEMORIS, stages: ['rough', 'ink', 'paint'], anchors: ['curl', 'head', 'base', 'tip', 'hand', 'eye', 'chest', 'fin', 'satchel', 'pencil'], poses: Object.keys(POSES), moods: Object.keys(FACES), arms: Object.keys(ARMS).filter((name) => !ARMS[name].to && !ARMS[name].toSnout), tagMarks: Object.keys(TAG_MARKS),
    headwear: Object.keys(HEADWEAR), bodywear: Object.keys(BODYWEAR), holdables: Object.keys(HELD).filter((name) => name !== 'lens' && name !== 'stylus'), looks: Object.keys(LOOKS), emanata: Object.keys(MARKS).concat(['speed', 'say']),
    util: { fix, rad, within, turn, between, measure, defaults, polyline },
    eyeAt: EYE_AT, lookRest: LOOK_REST,
    keeper, seat, miniTag, lantern, threadPoint, threadPath, strand, knot, hung, drawn, drawnPath, scallops, handCut, mark, sway, bob, voice, phone, bay, bayPath, threshold, pair
  });
})();
