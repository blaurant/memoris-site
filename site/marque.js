// Identité visuelle de Memoris : propositions de logo dessinées avec le moteur d'hippocampes du site.
(() => {
  const M = window.Memoris;
  const VIOLET = '#7E529F';
  M.tones.violet = { body: VIOLET, belly: '#D9C6EA', fin: '#F5ECD9', shade: '#5E3B78', prop: '#E8AE2F' };
  ['coral', 'amber', 'rose'].forEach((name) => { M.tones[name].prop = VIOLET; });
  M.tones.blouse = { body: '#FFFDF8', belly: '#F1ECE4', fin: '#E8AE2F', shade: '#E2DAD0', prop: VIOLET };
  let n = 0;
  const uid = (p) => p + (n += 1);
  const mirrored = ([x, y, w, h]) => [-(x + w), y, w, h];
  // Seul Memoris cligne des yeux : ses dessins sont enveloppés dans un groupe .blink.
  const blink = (svg) => '<g class="blink" style="--d:' + (Math.random() * 3).toFixed(2) + 's">' + svg + '</g>';

  const seahorse = M.keeper({ color: 'violet', mood: 'open', ink: 2.4 });
  const full = () => '<svg viewBox="' + mirrored(seahorse.box).join(' ') + '" aria-hidden="true"><g transform="scale(-1 1)">' + blink(seahorse.svg) + '</g></svg>';

  const head = () => {
    const id = uid('h');
    return '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><clipPath id="' + id + '"><circle cx="20" cy="20" r="18.5"/></clipPath></defs>' +
      '<circle cx="20" cy="20" r="18.5" fill="#EFE5F6"/><g clip-path="url(#' + id + ')"><svg width="40" height="40" viewBox="-46 -64 116 116"><g transform="scale(-1 1)">' + blink(seahorse.svg) + '</g></svg></g>' +
      '<circle cx="20" cy="20" r="18.5" fill="none" stroke="' + VIOLET + '" stroke-width="2"/></svg>';
  };

  // Memoris (à gauche) : tête penchée vers le bas et avancée, pour que sa tête et son dos forment la courbe du cœur.
  const memoris = M.keeper({ color: 'violet', mood: 'open', ink: 2.4, lean: 0, head: -44, look: 'down' });
  memoris.svg = memoris.svg.split('transform="rotate(-44)"').join('transform="translate(-8 6) rotate(-44)"');
  // Le patient (à droite) : la même pose, en miroir.
  const patient = M.keeper({ color: 'coral', mood: 'open', ink: 2.4, lean: 0, head: -44, look: 'down' });
  patient.svg = patient.svg.split('transform="rotate(-44)"').join('transform="translate(-8 6) rotate(-44)"');
  const heart = () => {
    const [ax, ay, aw, ah] = memoris.box;
    const [cx, cy, cw, ch] = patient.box;
    const shift = -ax - cx - 78;
    const minX = -(ax + aw), maxX = cx + cw + shift, minY = Math.min(ay, cy), maxY = Math.max(ay + ah, cy + ch);
    return '<svg viewBox="' + [minX, minY, maxX - minX, maxY - minY].map((v) => v.toFixed(1)).join(' ') + '" aria-hidden="true">' +
      '<g transform="scale(-1 1)">' + blink(memoris.svg) + '</g><g transform="translate(' + shift.toFixed(1) + ' 0)">' + patient.svg + '</g></svg>';
  };



  // L'hippocampe Memoris dans un téléphone.
  const phone = () => {
    const [x, y, w, h] = mirrored(seahorse.box);
    const sh = 70, sw = sh * w / h;
    return '<svg viewBox="0 0 60 100" aria-hidden="true">' +
      '<rect x="3" y="2.5" width="54" height="95" rx="10" fill="#FFFAEE" stroke="#2A1B14" stroke-width="3"/>' +
      '<rect x="8" y="10" width="44" height="80" rx="5" fill="#EFE5F6"/>' +
      '<rect x="24" y="5" width="12" height="2.6" rx="1.3" fill="#2A1B14"/>' +
      '<svg x="' + (30 - sw / 2).toFixed(1) + '" y="15" width="' + sw.toFixed(1) + '" height="' + sh + '" viewBox="' + [x, y, w, h].join(' ') + '"><g transform="scale(-1 1)">' + blink(seahorse.svg) + '</g></svg>' +
      '<rect x="23" y="92.2" width="14" height="1.8" rx=".9" fill="#2A1B14" opacity=".55"/></svg>';
  };

  // Trois propositions tirées des motifs du site : la tête au cerveau ouvert, l'étiquette, le fil.
  const CARD = '#FFFAEE', INK = '#2A1B14';
  const tag = () => {
    const w = 60, h = 80, top = 26, cut = 13, half = w / 2;
    const shape = 'M' + (cut - half) + ' ' + top + 'H' + (half - cut) + 'L' + half + ' ' + (top + cut) + 'V' + (top + h) + 'H' + -half + 'V' + (top + cut) + 'Z';
    return '<svg viewBox="-40 -4 80 116" aria-hidden="true"><path d="M0 0V' + (top + 7) + '" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<g transform="rotate(-6 0 ' + top + ')"><path d="' + shape + '" fill="' + CARD + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="0" cy="' + (top + 8) + '" r="3" fill="#F5ECD9" stroke="' + INK + '" stroke-width="2"/>' +
      '<svg x="-24" y="' + (top + 14) + '" width="48" height="62" viewBox="' + mirrored(seahorse.box).join(' ') + '"><g transform="scale(-1 1)">' + blink(seahorse.svg) + '</g></svg></g></svg>';
  };
  const thread = () => {
    const c = seahorse.anchors.curl;
    const [x, y, w, h] = mirrored(seahorse.box);
    const cx = -c[0], cy = c[1];
    const line = [x - 30, cy + 2, cx, cy + 14, x + w + 70, cy - 2];
    return '<svg viewBox="' + [x - 32, y - 4, w + 106, h + 40].join(' ') + '" aria-hidden="true">' + M.strand(line, { width: 3.4 }) +
      '<g transform="scale(-1 1)">' + blink(seahorse.svg) + '</g>' +
      '<g transform="translate(' + (x + w + 34) + ' ' + cy + ')">' + M.miniTag({ length: 16, w: 34, h: 42, mark: 'face' }) + '</g></svg>';
  };

  // Le nom sur le fil : Memoris perché au bout du fil, les lettres du nom suspendues dessous.
  const swimmer = M.keeper({ color: 'violet', pose: 'swim', mood: 'open', ink: 2.4, carry: { mark: 'heart', length: 20, w: 30, h: 38 } });
  const wordline = () => {
    const [x, y, w, h] = mirrored(seahorse.box);
    const c = seahorse.anchors.curl, cx = -c[0], cy = c[1];
    const TW = 84, TH = 100, STRING = 16, CUT = 16, size = 74;
    const word = 'Memoris'.split('');
    const centers = word.map((ch, i) => cx + 90 + i * (TW + 12));
    const end = centers[centers.length - 1] + TW / 2 + 40;
    const line = [x - 10, cy + 4, (cx + end) / 2 + 30, cy + 34, end, cy - 6];
    const tFor = (target) => { let lo = 0, hi = 1; for (let k = 0; k < 30; k++) { const mid = (lo + hi) / 2; if (M.threadPoint(line, mid)[0] < target) lo = mid; else hi = mid; } return (lo + hi) / 2; };
    const tilt = [-4, 3, -2, 4, -3, 2, -4];
    const half = TW / 2;
    const shape = 'M' + (CUT - half) + ' ' + STRING + 'H' + (half - CUT) + 'L' + half + ' ' + (STRING + CUT) + 'V' + (STRING + TH) + 'H' + -half + 'V' + (STRING + CUT) + 'Z';
    const tags = word.map((ch, i) => {
      const [px, py] = M.threadPoint(line, tFor(centers[i]));
      return '<g transform="translate(' + px.toFixed(1) + ' ' + py.toFixed(1) + ') rotate(' + tilt[i] + ')"><path d="M0 0V' + (STRING + 9) + '" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<path d="' + shape + '" fill="' + CARD + '" stroke="' + INK + '" stroke-width="3.2" stroke-linejoin="round"/><circle cy="' + (STRING + 10) + '" r="3.6" fill="#F5ECD9" stroke="' + INK + '" stroke-width="2.2"/>' +
        '<text class="wordmark" y="' + (STRING + TH * 0.84).toFixed(0) + '" text-anchor="middle" font-size="' + size + '">' + ch + '</text></g>';
    }).join('');
    return '<svg class="wide" viewBox="' + [x - 14, y - 4, end - x + 30, h + 90].join(' ') + '" aria-hidden="true">' + M.strand(line, { width: 3.4 }) +
      '<g transform="scale(-1 1)">' + blink(seahorse.svg) + '</g>' + tags + '</svg>';
  };
  // Memoris porte un souvenir : sa tête et son étiquette-cœur, dans un rond.
  const carrier = () => {
    const id = uid('porteur');
    return '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><clipPath id="' + id + '"><circle cx="20" cy="20" r="19.1"/></clipPath></defs>' +
      '<circle cx="20" cy="20" r="19.1" fill="#EFE5F6"/><g clip-path="url(#' + id + ')"><svg width="40" height="40" viewBox="-62 -56 142 142"><g transform="scale(-1 1)">' + blink(swimmer.svg) + '</g></svg></g>' +
      '<circle cx="20" cy="20" r="19.1" fill="none" stroke="' + VIOLET + '" stroke-width="1.8"/></svg>';
  };



  // La spirale du logo actuel, en couleurs Memoris : l'idée qui sort de la spirale s'éclaire.
  const SPIRAL = M.mark().match(/d="([^"]+)"/)[1];
  const GOLD = '#F0C24B', GOLD_LIGHT = '#FFF1C4', DEEP = '#5E3B78';
  const spiral = (color, width) => '<path d="' + SPIRAL + '" fill="none" stroke="' + color + '" stroke-width="' + (width || 4.4) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const halo = (id) => '<radialGradient id="' + id + '"><stop offset="0" stop-color="' + GOLD_LIGHT + '"/><stop offset=".35" stop-color="' + GOLD + '" stop-opacity=".8"/><stop offset="1" stop-color="' + GOLD + '" stop-opacity="0"/></radialGradient>';
  const rays = (cx, cy, r1, r2, width) => [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const t = (a * Math.PI) / 180;
    return '<path d="M' + (cx + r1 * Math.cos(t)).toFixed(1) + ' ' + (cy + r1 * Math.sin(t)).toFixed(1) + 'L' + (cx + r2 * Math.cos(t)).toFixed(1) + ' ' + (cy + r2 * Math.sin(t)).toFixed(1) + '" stroke="' + GOLD + '" stroke-width="' + width + '" stroke-linecap="round"/>';
  }).join('');
  const sparkle = (cx, cy, r) => '<path d="M' + cx + ' ' + (cy - r) + 'Q' + cx + ' ' + cy + ' ' + (cx + r) + ' ' + cy + 'Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy + r) + 'Q' + cx + ' ' + cy + ' ' + (cx - r) + ' ' + cy + 'Q' + cx + ' ' + cy + ' ' + cx + ' ' + (cy - r) + 'Z" fill="' + GOLD + '" stroke="' + INK + '" stroke-width=".9" stroke-linejoin="round"/>';
  const dot = (fill) => '<circle cx="31.5" cy="6.5" r="3.5" fill="' + fill + '" stroke="' + INK + '" stroke-width="1"/>';
  const lit = () => { const id = uid('idee'); return '<svg viewBox="-4 -8 48 48" aria-hidden="true"><defs>' + halo(id) + '</defs><circle cx="31.5" cy="6.5" r="11" fill="url(#' + id + ')"/>' + spiral(VIOLET) + dot(GOLD) + '</svg>'; };
  const shine = () => '<svg viewBox="-4 -10 50 50" aria-hidden="true">' + spiral(VIOLET) + rays(31.5, 6.5, 6, 10, 1.8) + dot(GOLD) + '</svg>';
  const spark = () => '<svg viewBox="-4 -10 50 50" aria-hidden="true">' + spiral(VIOLET) + sparkle(32.5, 4.5, 7.5) + '<circle cx="36" cy="-3" r="1.2" fill="' + GOLD + '"/><circle cx="39" cy="9" r=".9" fill="' + GOLD + '"/></svg>';
  const nightIdea = () => { const id = uid('nuit'); return '<svg viewBox="0 0 48 48" aria-hidden="true"><defs>' + halo(id) + '</defs><circle cx="24" cy="24" r="23" fill="#2E2042"/><g transform="translate(2 6)"><circle cx="31.5" cy="6.5" r="11" fill="url(#' + id + ')"/>' + spiral('#C9A6E2') + '<circle cx="31.5" cy="6.5" r="3.4" fill="' + GOLD_LIGHT + '"/></g></svg>'; };
  const sunRound = () => '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#EFE5F6" stroke="' + VIOLET + '" stroke-width="2"/><g transform="translate(2 6)">' + spiral(VIOLET) + rays(31.5, 6.5, 5.5, 9, 1.6) + '<circle cx="31.5" cy="6.5" r="3.2" fill="' + GOLD + '" stroke="' + INK + '" stroke-width=".9"/></g></svg>';
  const unfurl = () => { const id = uid('degrade'); return '<svg viewBox="-4 -10 50 50" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="' + DEEP + '"/><stop offset="1" stop-color="#B48ED6"/></linearGradient></defs>' + spiral('url(#' + id + ')', 5) + '<path d="M31.9 11L33 6.6" stroke="#B48ED6" stroke-width="3" stroke-linecap="round"/>' + sparkle(32.5, 3, 6.5) + '</svg>'; };

  const current = () => '<svg viewBox="0 0 40 40" aria-hidden="true">' + M.mark() + '</svg>';

  // Les personnages. Le médecin porte une blouse blanche : on recouvre son buste d'un second dessin en blanc.
  const box = (k, flip) => (flip ? mirrored(k.box) : k.box).map((v) => v.toFixed(1)).join(' ');
  const draw = (k, flip) => (flip ? '<g transform="scale(-1 1)">' + k.svg + '</g>' : k.svg);
  const figure = (options, flip, blinks) => {
    const k = M.keeper(Object.assign({ mood: 'open', ink: 2.6 }, options));
    const art = blinks ? { svg: blink(k.svg) } : k;
    return '<svg viewBox="' + box(k, flip) + '" aria-hidden="true">' + draw(art, flip) + '</svg>';
  };
  const doctor = (flip) => {
    const o = { mood: 'open', ink: 2.6, arm: 'hold', hold: 'clipboard', prop: 'stethoscope' };
    const base = M.keeper(Object.assign({ color: 'amber' }, o));
    const coat = M.keeper(Object.assign({ color: 'blouse' }, o));
    const [x, , w] = base.box;
    const top = base.anchors.head[1] + 22;
    const id = uid('blouse');
    const clip = '<clipPath id="' + id + '"><rect x="' + (x - 20) + '" y="' + top + '" width="' + (w + 40) + '" height="78"/></clipPath>';
    const INK = '#2A1B14', FOLD = '#CFC5B6', WHITE = '#FFFDF8';
    const details = '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M10 40q4 9 2 19M14 62q3 8 1 15M4 84q3 7 1 13" stroke="' + FOLD + '" stroke-width="1.6"/>' +
      '<path d="M2 37q-1 30 -4 62" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<path d="M-14 99q14 3 30 -1" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<path d="M6 71h11v10q-5 2 -11 0z" fill="' + WHITE + '" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<path d="M13 64v9" stroke="' + VIOLET + '" stroke-width="2.6"/>' +
      '<path d="M-12 22l10 2l-5 13zM17 22l-11 2l4 12z" fill="' + WHITE + '" stroke="' + INK + '" stroke-width="1.8"/></g>' +
      [50, 63, 76, 89].map((y, i) => '<circle cx="' + (1 - i * 0.9).toFixed(1) + '" cy="' + y + '" r="1.6" fill="#E2DAD0" stroke="' + INK + '" stroke-width="1"/>').join('');
    const inner = base.svg + '<g clip-path="url(#' + id + ')">' + coat.svg + '</g>' + details;
    return '<svg viewBox="' + box(base, flip) + '" aria-hidden="true"><defs>' + clip + '</defs>' + (flip ? '<g transform="scale(-1 1)">' + inner + '</g>' : inner) + '</svg>';
  };
  // La parade : deux hippocampes face à face, queues enlacées, des cœurs au-dessus.
  const parade = () => {
    const a = M.keeper({ color: 'violet', pose: 'admire', mood: 'glad', ink: 2.6, marks: 'hearts' });
    const b = M.keeper({ color: 'rose', pose: 'admire', mood: 'glad', ink: 2.6 });
    const [ax, ay, aw, ah] = a.box, [cx, cy, cw, ch] = b.box;
    const shift = -ax - cx - 120;
    const minX = -(ax + aw) - 10, maxX = cx + cw + shift + 10, minY = Math.min(ay, cy) - 30, maxY = Math.max(ay + ah, cy + ch) + 10;
    return '<svg viewBox="' + [minX, minY, maxX - minX, maxY - minY].map((v) => v.toFixed(1)).join(' ') + '" aria-hidden="true">' +
      '<g transform="scale(-1 1)">' + blink(a.svg) + '</g><g transform="translate(' + shift.toFixed(1) + ' 0)">' + b.svg + '</g></svg>';
  };
  document.querySelectorAll('[data-scene="parade"]').forEach((el) => { el.innerHTML = parade(); });
  // Le ping-pong : Memoris, sa raquette à la main, renvoie la balle.
  const pong = () => {
    const k = M.keeper({ color: 'violet', mood: 'open', ink: 2.6, arm: 'point' });
    const [hx, hy] = k.anchors.hand;
    const paddle = '<g transform="translate(' + hx + ' ' + hy + ') rotate(-40)"><rect x="-3.5" y="-2" width="7" height="22" rx="3" fill="#B07A3E" stroke="' + INK + '" stroke-width="2.4"/>' +
      '<ellipse cx="0" cy="-20" rx="17" ry="19" fill="#D9473A" stroke="' + INK + '" stroke-width="2.8"/><ellipse cx="-4" cy="-24" rx="6" ry="7" fill="#fff" opacity=".18"/></g>';
    const bx = hx - 62, by = hy - 58;
    const ball = '<path d="M' + (hx - 22) + ' ' + (hy - 30) + 'Q' + (hx - 40) + ' ' + (hy - 70) + ' ' + bx + ' ' + by + '" fill="none" stroke="' + INK + '" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round"/>' +
      '<circle cx="' + bx + '" cy="' + by + '" r="8" fill="#FFFDF8" stroke="' + INK + '" stroke-width="2.4"/><path d="M' + (bx - 4) + ' ' + (by - 3) + 'a4 4 0 0 1 4 -3" fill="none" stroke="#E2DAD0" stroke-width="2"/>';
    const [x, y, w, h] = k.box;
    const minX = Math.min(x, bx - 14), minY = Math.min(y, by - 14), W = x + w - minX, H = y + h - minY;
    return '<svg viewBox="' + [-(minX + W), minY, W, H].map((v) => v.toFixed(1)).join(' ') + '" aria-hidden="true"><g transform="scale(-1 1)">' + blink(k.svg) + paddle + ball + '</g></svg>';
  };
  document.querySelectorAll('[data-scene="pong"]').forEach((el) => { el.innerHTML = pong(); });
  // Le trampoline : Memoris saute, bras en l'air, au-dessus de la toile.
  const trampoline = () => {
    const k = M.keeper({ color: 'violet', mood: 'laughing', ink: 2.6, arm: 'up' });
    const [x, y, w, h] = k.box;
    const cx = x + w / 2, floor = y + h + 70, ty = floor - 26;
    const legs = '<path d="M' + (cx - 90) + ' ' + ty + 'l-10 34M' + (cx + 90) + ' ' + ty + 'l10 34M' + (cx - 40) + ' ' + (ty + 6) + 'l-4 30M' + (cx + 40) + ' ' + (ty + 6) + 'l4 30" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"/>';
    const mat = '<ellipse cx="' + cx + '" cy="' + ty + '" rx="100" ry="20" fill="#3A2556" stroke="' + INK + '" stroke-width="3.5"/>' +
      '<ellipse cx="' + cx + '" cy="' + ty + '" rx="100" ry="20" fill="none" stroke="#E2603A" stroke-width="7"/><ellipse cx="' + cx + '" cy="' + ty + '" rx="100" ry="20" fill="none" stroke="' + INK + '" stroke-width="2"/>';
    const bounce = '<path d="M' + (cx - 30) + ' ' + (ty - 36) + 'q-6 -10 0 -20M' + cx + ' ' + (ty - 40) + 'q-6 -10 0 -20M' + (cx + 30) + ' ' + (ty - 36) + 'q-6 -10 0 -20" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/>';
    return '<svg viewBox="' + [-(cx + 120), y - 10, 240, floor - y + 20].map((v) => v.toFixed(1)).join(' ') + '" aria-hidden="true"><g transform="scale(-1 1)">' + legs + mat + bounce + blink(k.svg) + '</g></svg>';
  };
  document.querySelectorAll('[data-scene="trampoline"]').forEach((el) => { el.innerHTML = trampoline(); });

  // Un tee-shirt, avec Memoris qui joue au ping-pong imprimé sur la poitrine.
  const tshirt = (dark) => {
    const shirt = 'M140 30Q200 74 260 30L332 54L392 122L340 168L310 142V420Q200 434 90 420V142L60 168L8 122L68 54Z';
    const cloth = dark ? '#1C1820' : '#FFFDF8', seam = dark ? '#3A3440' : '#E2DAD0', fold = dark ? '#2C2632' : '#E7E0D4', word = dark ? '#F5ECD9' : INK;
    const id = uid('impression');
    // Sur le noir, l'impression a un liseré crème pour que les contours restent lisibles.
    const halo = dark ? '<defs><filter id="' + id + '" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d"/><feFlood flood-color="#F5ECD9"/><feComposite in2="d" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' : '';
    const print = '<g' + (dark ? ' filter="url(#' + id + ')"' : '') + '>' + pong().replace('<svg ', '<svg x="135" y="112" width="130" height="200" ') + '</g>';
    return '<svg viewBox="0 0 400 440" aria-hidden="true">' + halo +
      '<path d="' + shirt + '" fill="' + cloth + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M140 30Q200 74 260 30M146 34Q200 86 254 34" fill="none" stroke="' + (dark ? '#4A4350' : INK) + '" stroke-width="3"/>' +
      '<path d="M90 142L68 54M310 142L332 54" fill="none" stroke="' + seam + '" stroke-width="3"/>' +
      '<path d="M120 380q20 -14 40 0M250 396q16 -10 32 0M104 230q10 18 4 40M300 250q-8 16 -2 34" fill="none" stroke="' + fold + '" stroke-width="3" stroke-linecap="round"/>' +
      print + '<text x="200" y="350" text-anchor="middle" class="wordmark" font-size="34" style="fill:' + word + '">Memoris</text></svg>';
  };
  document.querySelectorAll('[data-object="tshirt"]').forEach((el) => { el.innerHTML = tshirt(false); });
  // Un mug, avec l'hippocampe Memoris et son nom.
  const mug = () => {
    const print = full().replace('<svg ', '<svg x="98" y="90" width="114" height="150" ');
    return '<svg viewBox="0 0 340 330" aria-hidden="true">' +
      '<path d="M120 40q-12 -16 0 -30M150 36q-12 -16 0 -30M180 40q-12 -16 0 -30" fill="none" stroke="#CFC5B6" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M250 110c56 0 56 110 0 110" fill="none" stroke="' + INK + '" stroke-width="24" stroke-linecap="round"/>' +
      '<path d="M250 110c56 0 56 110 0 110" fill="none" stroke="#FFFDF8" stroke-width="15" stroke-linecap="round"/>' +
      '<path d="M50 70V270q0 34 50 38h110q50 -4 50 -38V70" fill="#FFFDF8" stroke="' + INK + '" stroke-width="4.5" stroke-linejoin="round"/>' +
      '<ellipse cx="155" cy="70" rx="105" ry="20" fill="#F1ECE4" stroke="' + INK + '" stroke-width="4.5"/>' +
      '<ellipse cx="155" cy="72" rx="88" ry="13" fill="#7A4A2A"/>' +
      '<path d="M66 96V262q2 24 34 30" fill="none" stroke="#ECE5DA" stroke-width="8" stroke-linecap="round"/>' +
      print + '<text x="155" y="276" text-anchor="middle" class="wordmark" font-size="32">Memoris</text></svg>';
  };
  document.querySelectorAll('[data-object="mug"]').forEach((el) => { el.innerHTML = mug(); });
  // Une coque de téléphone, avec le porteur de souvenirs en entier.
  const phoneCase = () => {
    // Le porteur de souvenirs en entier : Memoris nage, son étiquette-cœur au museau.
    const [x, y, w, h] = mirrored(swimmer.box);
    // Sur la coque, le cœur de l'étiquette est rempli de rouge.
    const redHeart = swimmer.svg.replace(/(<path data-fine d="M0 [0-9.]+c-3 -5 -10 -1 -6 4l6 6l6 -6c4 -5 -3 -9 -6 -4z") fill="none"/, '$1 fill="#D9302C"');
    const art = '<svg x="20" y="150" width="220" height="220" viewBox="' + [x, y, w, h].join(' ') + '"><g transform="scale(-1 1)">' + blink(redHeart) + '</g></svg>';
    return '<svg viewBox="0 0 260 470" aria-hidden="true">' +
      '<rect x="20" y="10" width="220" height="450" rx="40" fill="#EFE5F6" stroke="' + INK + '" stroke-width="4.5"/>' +
      '<rect x="34" y="24" width="96" height="104" rx="26" fill="#E2D6EE" stroke="' + INK + '" stroke-width="3.5"/>' +
      '<circle cx="62" cy="54" r="17" fill="#2A1B14"/><circle cx="62" cy="54" r="9" fill="#3A2556"/><circle cx="58" cy="50" r="3" fill="#fff" opacity=".6"/>' +
      '<circle cx="62" cy="100" r="17" fill="#2A1B14"/><circle cx="62" cy="100" r="9" fill="#3A2556"/><circle cx="58" cy="96" r="3" fill="#fff" opacity=".6"/>' +
      '<circle cx="104" cy="54" r="7" fill="#F6DD9C" stroke="' + INK + '" stroke-width="2"/>' +
      '<path d="M224 120v90" stroke="#D9C6EA" stroke-width="6" stroke-linecap="round"/>' +
      art + '<text x="130" y="420" text-anchor="middle" class="wordmark" font-size="32">Memoris</text></svg>';
  };
  document.querySelectorAll('[data-object="coque"]').forEach((el) => { el.innerHTML = phoneCase(); });





  const CHARS = {
    memoris: (flip) => figure({ color: 'violet', prop: 'satchel' }, flip, true),
    medecin: (flip) => doctor(flip),
    patient: (flip) => figure({ color: 'coral', mood: 'thinking', arm: 'chin' }, flip),
    aidant: (flip) => figure({ color: 'rose', mood: 'glad', arm: 'wave' }, flip)
  };
  document.querySelectorAll('[data-char]').forEach((el) => { el.innerHTML = CHARS[el.dataset.char](el.hasAttribute('data-flip')); });

  // Le logo actuel du site, décliné dans toutes les combinaisons de la palette (spirale × point, puis sur fond de couleur).
  const PALETTE = [
    ['Violet', '#7E529F'], ['Encre', '#2A1B14'], ['Doré', '#E8AE2F'], ['Corail', '#E2603A'],
    ['Ocre', '#9F7E52'], ['Jade', '#529F7E'], ['Sauge', '#739F52']
  ];
  const markIn = (spiralColor, dotColor, bg) => '<svg viewBox="0 0 40 40" aria-hidden="true">' + (bg ? '<rect width="40" height="40" rx="10" fill="' + bg + '"/>' : '') +
    '<g transform="' + (bg ? 'translate(4 4) scale(.8)' : '') + '"><path d="' + SPIRAL + '" fill="none" stroke="' + spiralColor + '" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="31.5" cy="6.5" r="3.4" fill="' + dotColor + '"/></g></svg>';
  const swatchRow = '<div class="swatches">' + PALETTE.map(([name, hex]) => '<div class="sw"><i style="background:' + hex + '"></i><span><b>' + name + '</b>' + hex + '</span></div>').join('') + '</div>';
  document.querySelectorAll('[data-variations="couleurs"]').forEach((el) => {
    const tile = (svg, label, dark) => '<figure class="var' + (dark ? ' var--dark' : '') + '">' + svg + '<figcaption>' + label + '</figcaption></figure>';
    const pairs = [];
    PALETTE.forEach(([sn, sh]) => PALETTE.forEach(([dn, dh]) => { if (sn !== dn) pairs.push(tile(markIn(sh, dh), 'Spirale ' + sn.toLowerCase() + ' · point ' + dn.toLowerCase())); }));
    const LIGHT = '#F5ECD9';
    const onColor = [];
    PALETTE.forEach(([bn, bh]) => {
      const contrast = bn === 'Doré' ? [['encre', '#2A1B14', '#7E529F']] : [['crème', LIGHT, bn === 'Encre' || bn === 'Violet' ? '#E8AE2F' : '#2A1B14']];
      contrast.forEach(([cn, ch, dh]) => onColor.push(tile(markIn(ch, dh, bh), 'Fond ' + bn.toLowerCase() + ' · spirale ' + cn)));
      if (bn === 'Doré') onColor.push(tile(markIn('#7E529F', '#529F7E', bh), 'Fond doré · spirale violette · point jade'));
    });
    el.innerHTML = swatchRow + '<h3 class="sub">Spirale et point</h3><div class="vars">' + pairs.join('') + '</div>' +
      '<h3 class="sub">Sur fond de couleur</h3><div class="vars">' + onColor.join('') + '</div>';
  });

  // Le logo retenu : spirale violette, point corail.
  const CORAL = '#E2603A', JADE = '#529F7E', CREAM = '#F5ECD9';
  const chosen = () => markIn(VIOLET, CORAL);
  // Icône d'app iPhone (carré aux coins arrondis à la façon d'iOS).
  const appIcon = (bg, spiralColor, dotColor) => '<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="22.4" fill="' + bg + '"/>' +
    '<g transform="translate(14 15) scale(1.8)"><path d="' + SPIRAL + '" fill="none" stroke="' + spiralColor + '" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="31.5" cy="6.5" r="3.6" fill="' + dotColor + '"/></g></svg>';
  document.querySelectorAll('[data-chosen="tailles"]').forEach((el) => {
    el.innerHTML = [[16, 'favicon'], [28, 'taille actuelle sur le site'], [56, 'deux fois plus grand'], [96, ''], [160, '']].map(([px, note]) =>
      '<figure class="size"><div style="height:' + px + 'px">' + chosen().replace('<svg ', '<svg style="width:' + px + 'px;height:' + px + 'px" ') + '</div><figcaption>' + px + ' px' + (note ? '<br>' + note : '') + '</figcaption></figure>').join('');
  });
  document.querySelectorAll('[data-chosen="noms"]').forEach((el) => {
    el.innerHTML = [[24, 'Taille actuelle de l’en-tête'], [48, 'Deux fois plus grand']].map(([px, note]) =>
      '<figure class="namebar"><div class="lockup" style="font-size:' + px + 'px">' + chosen() + '<span>Memoris</span></div><figcaption>' + note + '</figcaption></figure>').join('');
  });
  const ICONS = {
    jade: [JADE, VIOLET, CORAL, 'Fond jade : la couleur opposée au violet et au corail sur le cercle'],
    menthe: ['#CDE4D6', VIOLET, CORAL, 'Fond menthe : le jade adouci, celui du site'],
    violetCreme: [VIOLET, CREAM, CORAL, 'Fond violet · spirale crème · point corail'],
    violetDore: [VIOLET, '#F0C24B', CORAL, 'Fond violet · spirale dorée · point corail'],
    violetJade: [VIOLET, '#8FD3B6', CORAL, 'Fond violet · spirale jade clair · point corail'],
    violetCremeDore: [VIOLET, CREAM, '#F0C24B', 'Fond violet · spirale crème · point doré'],
    violetDoreJade: [VIOLET, '#F0C24B', '#8FD3B6', 'Fond violet · spirale dorée · point jade'],
    violetNuit: ['#3A2556', '#C9A6E2', CORAL, 'Fond violet nuit · spirale lavande · point corail']
  };
  // Fond corail, spirale violette, point jade éclairé par derrière d'une lumière jaune.
  const backlit = (bg, spiralColor, dotColor) => {
    bg = bg || CORAL; spiralColor = spiralColor || VIOLET; dotColor = dotColor || JADE;
    const id = uid('contrejour');
    return '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="' + id + '" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(70.7 26.7) scale(22)">' +
      '<stop offset="0" stop-color="#FFF6C8"/><stop offset=".32" stop-color="#F6D25A" stop-opacity=".95"/><stop offset=".65" stop-color="#F0C24B" stop-opacity=".45"/><stop offset="1" stop-color="#F0C24B" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="100" height="100" rx="22.4" fill="' + bg + '"/>' +
      '<g transform="translate(14 15) scale(1.8)"><path d="' + SPIRAL + '" fill="none" stroke="' + spiralColor + '" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/></g>' +
      '<circle cx="70.7" cy="26.7" r="22" fill="url(#' + id + ')"/>' +
      '<circle cx="70.7" cy="26.7" r="7.4" fill="' + dotColor + '"/>' +
      '<circle cx="68.6" cy="24.6" r="2.2" fill="#BFE6D4" opacity=".7"/></svg>';
  };
  document.querySelectorAll('[data-icon="contrejour"]').forEach((el) => {
    el.innerHTML = '<figure class="appicon"><div class="appicon__row">' + [120, 60, 40].map((px) => backlit().replace('<svg ', '<svg style="width:' + px + 'px;height:' + px + 'px" ')).join('') + '</div><figcaption>Fond corail · spirale violette · point jade éclairé par derrière, en jaune</figcaption></figure>';
  });
  // 30 déclinaisons : violet et corail toujours présents, la troisième couleur prend tour à tour le fond, la spirale ou le point.
  document.querySelectorAll('[data-icon="declinaisons"]').forEach((el) => {
    const THIRD = [['jade', JADE], ['doré', '#F0C24B'], ['crème', CREAM], ['violet nuit', '#3A2556'], ['menthe', '#CDE4D6']];
    const tiles = [];
    THIRD.forEach(([xn, xh]) => {
      const sets = [
        [['corail', CORAL], ['violet', VIOLET], [xn, xh]], [['violet', VIOLET], ['corail', CORAL], [xn, xh]],
        [['corail', CORAL], [xn, xh], ['violet', VIOLET]], [['violet', VIOLET], [xn, xh], ['corail', CORAL]],
        [[xn, xh], ['violet', VIOLET], ['corail', CORAL]], [[xn, xh], ['corail', CORAL], ['violet', VIOLET]]
      ];
      sets.forEach(([b, sp, d]) => tiles.push('<figure class="ios">' + backlit(b[1], sp[1], d[1]).replace('<svg ', '<svg style="width:60px;height:60px" ') +
        '<figcaption>Fond ' + b[0] + '<br>spirale ' + sp[0] + '<br>point ' + d[0] + '</figcaption></figure>'));
    });
    el.innerHTML = tiles.join('');
  });
  document.querySelectorAll('[data-icons]').forEach((el) => {
    el.innerHTML = el.dataset.icons.split(' ').map((key) => {
      const [bg, sc, dc, label] = ICONS[key];
      return '<figure class="appicon"><div class="appicon__row">' + [120, 60, 40].map((px) => appIcon(bg, sc, dc).replace('<svg ', '<svg style="width:' + px + 'px;height:' + px + 'px" ')).join('') + '</div><figcaption>' + label + '</figcaption></figure>';
    }).join('');
  });

  // Dix hippocampes stylisés, dessinés de zéro (sans le moteur du site) : cinq libres, cinq dans l'univers d'« Il était une fois… la Vie ».
  const HIPPO = (() => {
    const V = VIOLET, NUIT = '#3A2556', OR = '#F0C24B', CR = '#F5ECD9', LAV = '#EFE5F6', CLAIR = '#B48ED6', ROUGE = '#D8342B';
    const f1 = (v) => v.toFixed(1);
    // Ligne du dos au bout de la queue : le cou, le ventre, puis la queue qui s'enroule vers l'avant.
    const KEY = [[46, 27], [41.5, 38], [44.5, 50], [45, 61], [41, 71]];
    for (let i = 0; i <= 16; i++) { const t = i / 16, a = ((180 - 470 * t) * Math.PI) / 180, r = 12.5 - 9.3 * t; KEY.push([53.5 + r * Math.cos(a), 80 + r * Math.sin(a)]); }
    const LINE = (() => { const out = [], P = KEY, n = P.length; for (let i = 0; i < n - 1; i++) { const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, n - 1)]; for (let k = 0; k < 8; k++) { const t = k / 8, t2 = t * t, t3 = t2 * t; out.push([0, 1].map((d) => 0.5 * (2 * p1[d] + (p2[d] - p0[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * t3))); } } out.push(P[n - 1]); return out; })();
    const N = LINE.length;
    // Position de chaque point le long de la ligne, de 0 (tête) à 1 (bout de la queue), en longueur réelle.
    const T = (() => { const s = [0]; for (let i = 1; i < N; i++) s.push(s[i - 1] + Math.hypot(LINE[i][0] - LINE[i - 1][0], LINE[i][1] - LINE[i - 1][1])); return s.map((v) => v / s[N - 1]); })();
    const every = (step, from, to, fn) => { let next = from; for (let i = 0; i < N; i++) { if (T[i] >= next && T[i] <= to) { fn(i); next += step; } } };
    const normal = (i) => { const a = LINE[Math.max(i - 1, 0)], b = LINE[Math.min(i + 1, N - 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l]; };
    const width = (t) => (t < 0.2 ? 11 + 8 * Math.sin((Math.PI / 2) * (t / 0.2)) : 3 + 16 * Math.pow(1 - (t - 0.2) / 0.8, 3));
    // Point décalé de `k` demi-largeurs par rapport à la ligne (k = 1 : côté ventre, k = -1 : côté dos).
    const off = (i, k, scale) => { const t = T[i], n = normal(i), w = (width(t) / 2) * (scale || 1) * k; return [LINE[i][0] + n[0] * w, LINE[i][1] + n[1] * w]; };
    const poly = (pts) => pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L');
    const band = (k0, k1, scale) => { const a = [], b = []; for (let i = 0; i < N; i++) { a.push(off(i, k0, scale)); b.unshift(off(i, k1, scale)); } return 'M' + poly(a) + 'L' + poly(b) + 'Z'; };
    const centre = () => 'M' + poly(LINE);
    const body = (c, scale) => '<path d="' + band(-1, 1, scale) + '" fill="' + c + '" stroke="' + c + '" stroke-width="1.2" stroke-linejoin="round"/>';
    const crest = (c) => '<g fill="' + c + '"><circle cx="38.5" cy="18" r="4"/><circle cx="42" cy="11.5" r="4.2"/><circle cx="49" cy="8.5" r="4"/></g>';
    const head = (c, eye, pupil) => crest(c) + '<circle cx="49" cy="22" r="12.5" fill="' + c + '"/><path d="M57 25L77 29.5" stroke="' + c + '" stroke-width="8" stroke-linecap="round"/>' +
      (eye ? '<circle cx="52.5" cy="20" r="' + (pupil ? 4.6 : 3.4) + '" fill="' + eye + '"/>' : '') + (pupil ? '<circle cx="53.6" cy="20.4" r="2.3" fill="' + pupil + '"/>' : '');
    const fin = (c) => { const i0 = T.findIndex((t) => t >= 0.16), i1 = T.findIndex((t) => t >= 0.33), a = off(i0, -0.8), b = off(i1, -0.8), m = off(Math.round((i0 + i1) / 2), -2.5); return '<path d="M' + poly([a]) + 'Q' + f1(2 * m[0] - (a[0] + b[0]) / 2) + ' ' + f1(2 * m[1] - (a[1] + b[1]) / 2 + 3) + ' ' + poly([b]) + 'Z" fill="' + c + '" stroke="' + c + '" stroke-width="1.5" stroke-linejoin="round"/>'; };
    const horse = (c, eye, o) => { const p = o || {}; return (p.fin ? fin(p.fin) : '') + body(c, p.scale) + head(c, eye, p.pupil); };
    const svg = (inner) => '<svg viewBox="0 0 100 100" aria-hidden="true">' + inner + '</svg>';
    const place = (inner, k, dx, dy) => '<g transform="translate(' + f1(50 - 50 * k + (dx || 0)) + ' ' + f1(50 - 50 * k + (dy || 0)) + ') scale(' + k + ')">' + inner + '</g>';
    const inked = (inner, radius) => { const f = uid('k'); return '<filter id="' + f + '" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="' + radius + '" result="d"/><feFlood flood-color="' + INK + '"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><g filter="url(#' + f + ')">' + inner + '</g>'; };
    const bubble = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#DDF3FA" stroke="' + INK + '" stroke-width="1.6"/><path d="M' + f1(x - r * 0.5) + ' ' + f1(y - r * 0.1) + 'A' + f1(r * 0.55) + ' ' + f1(r * 0.55) + ' 0 0 1 ' + f1(x - r * 0.05) + ' ' + f1(y - r * 0.55) + '" fill="none" stroke="#fff" stroke-width="' + f1(Math.max(0.9, r * 0.22)) + '" stroke-linecap="round"/>';
    const star = (x, y, r, c) => '<path d="M' + x + ' ' + (y - r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + 'Z" fill="' + c + '"/>';
    // Traits en travers du corps (les anneaux de l'hippocampe).
    const rings = (c, w) => { let d = ''; every(0.055, 0.12, 0.44, (i) => { d += 'M' + poly([off(i, -1.15), off(i, 1.15)]); }); return '<path d="' + d + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="butt" fill="none"/>'; };
    // Double hélice le long du corps.
    const helix = (c1, c2, rung) => { const a = [], b = []; let r = ''; const turns = 3.5; for (let i = 3; i < N && T[i] <= 0.56; i++) { const t = T[i], s = Math.sin(t * turns * 2 * Math.PI), amp = 1.15; a.push(off(i, s * amp)); b.push(off(i, -s * amp)); } every(0.022, 0.08, 0.52, (i) => { const s = Math.sin(T[i] * turns * 2 * Math.PI); if (Math.abs(s) > 0.4) r += 'M' + poly([off(i, s * 1.15), off(i, -s * 1.15)]); });
      return '<path d="M' + poly(LINE.filter((p, i) => T[i] >= 0.55)) + '" fill="none" stroke="' + c1 + '" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/><path d="' + r + '" stroke="' + rung + '" stroke-width="1.6" fill="none"/><path d="M' + poly(b) + '" fill="none" stroke="' + c2 + '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M' + poly(a) + '" fill="none" stroke="' + c1 + '" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'; };
    const SHIFT = -6;
    const solo = (inner) => svg('<g transform="translate(' + SHIFT + ' 1)">' + inner + '</g>');
    return {
      // — Cinq hippocampes libres —
      silhouette: () => solo(horse(V, CR, { fin: CORAL })),
      trait: () => solo('<g fill="none" stroke="' + V + '" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"><path d="' + 'M' + poly(LINE.filter((p) => Math.hypot(p[0] - 49, p[1] - 22) > 11)) + '"/><circle cx="49" cy="22" r="11"/><path d="M60 25L77 29"/><path d="M39.5 15L35 10M44.5 11L42.5 5M51 10.5L52 4.5"/></g><circle cx="52" cy="20.5" r="2.8" fill="' + CORAL + '"/>'),
      geometrique: () => svg('<g transform="translate(-4 0)"><g fill="none" stroke="' + V + '" stroke-width="11"><path d="M50 30A17 17 0 0 1 50 64"/><path d="M50 64A14 14 0 0 0 50 92"/><path d="M50 92A8.5 8.5 0 0 0 50 75" stroke-linecap="round"/></g><circle cx="50" cy="22" r="13" fill="' + V + '"/><rect x="56" y="18" width="26" height="9" fill="' + V + '"/><path d="M36 20L31 8L43 12ZM43 11L46 0L54 9Z" fill="' + CORAL + '"/><circle cx="53" cy="20" r="3.6" fill="' + CR + '"/></g>'),
      anneaux: () => svg('<rect width="100" height="100" rx="22.4" fill="' + V + '"/>' + place('<g transform="translate(' + SHIFT + ' 1)">' + horse(CR, V) + rings(V, 1.8) + '</g>', 0.86)),
      deuxtons: () => solo(fin(CORAL) + '<path d="' + band(-1, 1) + '" fill="' + CLAIR + '" stroke="' + CLAIR + '" stroke-width="1.2" stroke-linejoin="round"/><path d="' + band(-1, 0.05) + '" fill="' + V + '"/><path d="' + band(-1, -0.9) + '" fill="' + V + '" stroke="' + V + '" stroke-width="1.2" stroke-linejoin="round"/>' + head(V, CR)),
      // — Cinq hippocampes dans l'univers d'« Il était une fois… la Vie » —
      // Le personnage : cerné d'encre, gros œil rond, joue rose, comme un petit habitant du corps.
      personnage: () => solo(inked(horse(V, '#fff', { fin: CORAL, pupil: INK }), 1.5) + '<circle cx="46" cy="28" r="3" fill="#F08A7B" opacity=".85"/><circle cx="54.6" cy="19.2" r=".9" fill="#fff"/>'),
      // Le globule rouge : l'hippocampe sur un globule, avec sa bulle d'oxygène.
      globule: () => svg('<circle cx="50" cy="50" r="46.5" fill="' + ROUGE + '" stroke="' + INK + '" stroke-width="3"/><circle cx="50" cy="52" r="33" fill="#B3221C" opacity=".55"/><path d="M17 36A36 36 0 0 1 40 12" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".6"/>' +
        place('<g transform="translate(' + SHIFT + ' 1)">' + inked(horse(V, '#fff', { pupil: INK }), 1.8) + '</g>', 0.78) + bubble(78, 62, 8) + bubble(86, 47, 3.6)),
      // La bulle : l'hippocampe voyage dans une bulle d'oxygène.
      bulle: () => svg('<circle cx="50" cy="50" r="46.5" fill="#DDF3FA" stroke="' + INK + '" stroke-width="3"/><circle cx="50" cy="50" r="40" fill="#fff" opacity=".45"/><path d="M15 40A37 37 0 0 1 38 14" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/><circle cx="82" cy="74" r="2.6" fill="#fff"/>' +
        place('<g transform="translate(' + SHIFT + ' 1)">' + inked(horse(V, '#fff', { fin: CORAL, pupil: INK }), 1.8) + '</g>', 0.78)),
      // La double hélice : le corps de l'hippocampe est un brin d'ADN.
      helice: () => solo(helix(V, CORAL, CLAIR) + head(V, CR)),
      // Le messager : dans la nuit du cerveau, l'influx remonte le long du corps jusqu'à la tête.
      messager: () => { let dots = ''; every(0.1, 0.1, 0.95, (i) => { dots += '<circle cx="' + f1(LINE[i][0]) + '" cy="' + f1(LINE[i][1]) + '" r="' + f1(Math.max(0.9, 3 - T[i] * 2.4)) + '" fill="' + OR + '"/>'; });
        return svg('<circle cx="50" cy="50" r="48" fill="#22305C"/><g fill="#fff" opacity=".7"><circle cx="20" cy="30" r="1"/><circle cx="82" cy="70" r="1.1"/><circle cx="26" cy="78" r=".8"/><circle cx="74" cy="16" r=".9"/></g>' +
          place('<g transform="translate(' + SHIFT + ' 1)">' + horse(CLAIR, '#fff', { pupil: '#22305C' }) + dots + '</g>', 0.8) + star(80, 34, 6.5, OR) + star(88, 46, 2.6, OR)); }
    };
  })();

  // L'hippocampe d'un seul trait : une ligne d'épaisseur constante, du museau au bout de la queue.
  const TRAIT = (() => {
    const V = VIOLET, CR = '#F5ECD9';
    // Le museau, la tête en anneau (le trou fait l'œil), le ventre, le dos, la queue enroulée : uniquement des arcs de cercle.
    const BODY = 'A13 13 0 0 1 46 56A16 16 0 0 0 46 88A11 11 0 0 0 46 66A5.5 5.5 0 0 0 46 77';
    const RING = 'M84 21H55A9 9 0 1 0 37 21A9 9 0 1 0 55 21A9 9 0 1 0 46 30' + BODY;
    const HOOK = 'M84 12H46A9 9 0 0 0 46 30' + BODY;
    const line = (d, c, w, cap) => '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="' + (cap || 'round') + '" stroke-linejoin="round"/>';
    const svg = (inner, dx) => '<svg viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(' + (dx === undefined ? -5 : dx) + ' 0)">' + inner + '</g></svg>';
    const crown = '<path d="M33 16L27 3L39 8ZM40 8L43 -3L51 7Z" fill="' + CORAL + '"/>';
    return {
      anneau: () => svg(line(RING, V, 8)),
      couronne: () => svg(crown + line(RING, V, 8), -5).replace('viewBox="0 0 100 100"', 'viewBox="0 -5 100 105"'),
      oeil: () => svg(line(RING, V, 8) + '<circle cx="46" cy="21" r="3.2" fill="' + CORAL + '"/>'),
      fin: () => svg(line(RING, V, 4)),
      crochet: () => svg(line(HOOK, V, 8)),
      icone: () => '<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="22.4" fill="' + V + '"/><g transform="translate(11 10.5) scale(.78)"><g transform="translate(-5 0)">' + line(RING, CR, 8) + '<circle cx="46" cy="21" r="3.2" fill="' + CORAL + '"/></g></g></svg>'
    };
  })();

  // Le trait retravaillé : museau en trompette (toujours d'un seul trait) et tête plus grande pour une bille plus grosse.
  const TRAIT2 = (() => {
    const V = VIOLET, CR = '#F5ECD9', W = 8;
    // Une seule ligne : le pavillon, le museau, la tête en anneau de rayon R, le ventre, le dos, la queue enroulée.
    const path = (o) => {
      const R = o.R, cx = 46, cy = o.cy, x0 = cx + R, tip = o.tip, b = cy + R;
      const bell = o.snout === 'bar' ? 'M' + tip + ' ' + (cy - 7) + 'V' + (cy + 7) + 'V' + cy
        : o.snout === 'cup' ? 'M' + (tip + 7) + ' ' + (cy - 7) + 'A7 7 0 0 0 ' + tip + ' ' + cy + 'A7 7 0 0 0 ' + (tip + 7) + ' ' + (cy + 7) + 'A7 7 0 0 1 ' + tip + ' ' + cy
        : 'M' + tip + ' ' + cy;
      const ring = 'H' + x0 + 'A' + R + ' ' + R + ' 0 1 0 ' + (cx - R) + ' ' + cy + 'A' + R + ' ' + R + ' 0 1 0 ' + x0 + ' ' + cy + 'A' + R + ' ' + R + ' 0 1 0 ' + cx + ' ' + b;
      const belly = (o.bottom - 32 - b) / 2, y1 = b + 2 * belly;
      // Museau incliné de `tilt` degrés vers le bas : la ligne part du bout du museau et rejoint l'anneau dans son axe.
      const a = ((o.tilt || 0) * Math.PI) / 180, px = (cx + R * Math.cos(a)).toFixed(1), py = (cy + R * Math.sin(a)).toFixed(1), len = tip - cx;
      const tilted = 'M' + (cx + len * Math.cos(a)).toFixed(1) + ' ' + (cy + len * Math.sin(a)).toFixed(1) + 'L' + px + ' ' + py + 'A' + R + ' ' + R + ' 0 1 0 ' + (cx - R * Math.cos(a)).toFixed(1) + ' ' + (cy - R * Math.sin(a)).toFixed(1) + 'A' + R + ' ' + R + ' 0 1 0 ' + px + ' ' + py + 'A' + R + ' ' + R + ' 0 1 0 ' + cx + ' ' + b;
      return (o.tilt ? tilted : bell + ring) + 'A' + belly + ' ' + belly + ' 0 0 1 ' + cx + ' ' + y1 + 'A16 16 0 0 0 ' + cx + ' ' + (y1 + 32) + 'A11 11 0 0 0 ' + cx + ' ' + (y1 + 10) + 'A5.5 5.5 0 0 0 ' + cx + ' ' + (y1 + 21);
    };
    const marble = (x, y, r) => { const g = uid('m'); return '<radialGradient id="' + g + '" cx=".36" cy=".32" r=".8"><stop offset="0" stop-color="#FFD9C7"/><stop offset=".45" stop-color="' + CORAL + '"/><stop offset="1" stop-color="#A93A1C"/></radialGradient><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#' + g + ')"/>' +
      '<ellipse cx="' + (x - r * 0.34).toFixed(1) + '" cy="' + (y - r * 0.42).toFixed(1) + '" rx="' + (r * 0.28).toFixed(1) + '" ry="' + (r * 0.16).toFixed(1) + '" fill="#fff" opacity=".85" transform="rotate(-35 ' + (x - r * 0.34).toFixed(1) + ' ' + (y - r * 0.42).toFixed(1) + ')"/>'; };
    const SMALL = { R: 9, cy: 20, tip: 82, bottom: 93 }, BIG = { R: 13, cy: 21, tip: 86, bottom: 95 };
    const draw = (o, c) => '<path d="' + path(o) + '" fill="none" stroke="' + c + '" stroke-width="' + W + '" stroke-linecap="round" stroke-linejoin="round"/>' +
      (o.flat ? '<circle cx="46" cy="' + o.cy + '" r="' + (o.R - W / 2 - 2) + '" fill="' + (o.dot || CORAL) + '"/>' : o.R > 10 ? marble(46, o.cy, o.R - W / 2 - 2) : '<circle cx="46" cy="' + o.cy + '" r="3.2" fill="' + CORAL + '"/>');
    const shift = (o) => (o.R > 10 ? -9 : -6) - (o.snout === 'cup' ? 3 : 0);
    const plain = (o) => '<svg viewBox="' + (o.ring ? '-16 -11 126 126' : '0 0 100 100') + '" aria-hidden="true">' + (o.ring === 'square' ? '<rect x="-11" y="-6" width="116" height="116" rx="24" fill="#F5ECD9" stroke="' + (o.color || V) + '" stroke-width="' + W + '"/>' : o.ring ? '<circle cx="47" cy="52" r="58" fill="none" stroke="' + (o.color || V) + '" stroke-width="' + W + '"/>' : '') + '<g transform="translate(' + shift(o) + ' 0)">' + draw(o, o.color || V) + '</g></svg>';
    const icon = (o) => '<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="22.4" fill="' + (o.bg || V) + '"/><g transform="translate(11 11) scale(.78)"><g transform="translate(' + shift(o) + ' 0)">' + draw(o.iconDot ? Object.assign({}, o, { dot: o.iconDot }) : o, o.bg ? o.color : CR) + '</g></g></svg>';
    const out = {};
    [['bar', Object.assign({ snout: 'bar' }, SMALL)], ['cup', Object.assign({ snout: 'cup' }, SMALL)], ['big', BIG], ['bigbar', Object.assign({ snout: 'bar' }, BIG)], ['flat', Object.assign({ flat: true }, BIG)], ['ink', Object.assign({ flat: true, color: '#483A32', dot: '#E57552', bg: '#E8AE2F', iconDot: V }, BIG)], ['tilt', Object.assign({ flat: true, color: '#483A32', dot: '#E57552', bg: '#E8AE2F', iconDot: V, tilt: 10 }, BIG)], ['tiltV', Object.assign({ flat: true, tilt: 10 }, BIG)], ['rond', Object.assign({ flat: true, color: '#483A32', dot: '#E57552', ring: true }, BIG)], ['carre', Object.assign({ flat: true, color: '#483A32', dot: '#E57552', ring: 'square' }, BIG)], ['rondV', Object.assign({ flat: true, color: V, dot: '#E2603A', ring: true }, BIG)], ['carreV', Object.assign({ flat: true, color: V, dot: '#E2603A', ring: 'square' }, BIG)]].forEach(([k, o]) => { out[k] = () => plain(o); out[k + 'Icon'] = () => icon(o); });
    out.make = (color, dot, bg) => { const o = Object.assign({ flat: true, color, dot }, BIG); return bg ? icon(Object.assign({ bg }, o)) : plain(o); };
    return out;
  })();

  // Déclinaisons du Trait 17 (fond papier) et du Trait 18 (icône) : on change le trait, la bille et le fond.
  document.querySelectorAll('[data-trait-vars]').forEach((el) => {
    const C = { violet: ['violet', VIOLET], brun: ['brun', '#483A32'], corail: ['corail', '#E2603A'], dore: ['doré', '#E8AE2F'], jade: ['jade', '#529F7E'], creme: ['crème', '#F5ECD9'], nuit: ['violet nuit', '#3A2556'], lavande: ['lavande', '#D9C6EA'] };
    const lum = (hex) => { const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const tile = (svg, label, bg) => '<figure class="var"' + (bg ? ' style="background:' + bg + '"' : '') + '>' + svg + '<figcaption>' + label + '</figcaption></figure>';
    let html = '';
    if (el.dataset.traitVars === 'papier') {
      ['violet', 'brun', 'nuit', 'jade', 'corail'].forEach((s) => ['corail', 'violet', 'dore', 'jade', 'brun'].forEach((d) => {
        if (s === d || contrast(C[s][1], C[d][1]) < 1.25) return;
        html += tile(TRAIT2.make(C[s][1], C[d][1]), 'Trait ' + C[s][0] + ' · bille ' + C[d][0], '#F5ECD9');
      }));
    } else {
      ['dore', 'violet', 'creme', 'lavande', 'jade', 'corail', 'nuit', 'brun'].forEach((b) => ['violet', 'brun', 'creme', 'dore'].forEach((s) => {
        if (s === b || contrast(C[s][1], C[b][1]) < 2.2) return;
        ['corail', 'violet', 'dore', 'jade', 'creme'].forEach((d) => {
          if (d === b || d === s || contrast(C[d][1], C[b][1]) < 1.35) return;
          html += tile(TRAIT2.make(C[s][1], C[d][1], C[b][1]), 'Fond ' + C[b][0] + ' · trait ' + C[s][0] + ' · bille ' + C[d][0]);
        });
      }));
    }
    el.innerHTML = html;
  });


  const LOGOS = { current, full, phone, head, heart, tag, thread, wordline, carrier, lit, shine, spark, nightIdea, sunRound, unfurl, x_silhouette: HIPPO.silhouette, x_trait: HIPPO.trait, x_geometrique: HIPPO.geometrique, x_anneaux: HIPPO.anneaux, x_deuxtons: HIPPO.deuxtons, x_personnage: HIPPO.personnage, x_globule: HIPPO.globule, x_bulle: HIPPO.bulle, x_helice: HIPPO.helice, x_messager: HIPPO.messager, t_anneau: TRAIT.anneau, t_couronne: TRAIT.couronne, t_oeil: TRAIT.oeil, t_fin: TRAIT.fin, t_crochet: TRAIT.crochet, t_icone: TRAIT.icone, u_bar: TRAIT2.bar, u_cup: TRAIT2.cup, u_big: TRAIT2.big, u_bigbar: TRAIT2.bigbar, u_barIcon: TRAIT2.barIcon, u_cupIcon: TRAIT2.cupIcon, u_bigIcon: TRAIT2.bigIcon, u_bigbarIcon: TRAIT2.bigbarIcon, u_flat: TRAIT2.flat, u_flatIcon: TRAIT2.flatIcon, u_ink: TRAIT2.ink, u_inkIcon: TRAIT2.inkIcon, u_tilt: TRAIT2.tilt, u_tiltIcon: TRAIT2.tiltIcon, u_tiltV: TRAIT2.tiltV, u_rond: TRAIT2.rond, u_carre: TRAIT2.carre, u_rondV: TRAIT2.rondV, u_carreV: TRAIT2.carreV };
  document.querySelectorAll('[data-logo]').forEach((el) => {
    const make = LOGOS[el.dataset.logo];
    if (!make) return;
    if (el.dataset.lockup !== undefined) el.innerHTML = make() + '<span>Memoris</span>';
    else el.innerHTML = make();
  });
  const redraw = () => document.querySelectorAll('[data-logo="wordline"],[data-sizes="wordline"]').forEach((el) => {
    if (el.dataset.sizes) el.innerHTML = [96, 48, 32, 20].map((hh) => '<div>' + wordline().replace('<svg ', '<svg style="height:' + hh + 'px" ') + '<small>' + hh + ' px</small></div>').join('');
    else el.innerHTML = wordline();
  });
  if (document.fonts) document.fonts.ready.then(redraw);
  document.querySelectorAll('[data-sizes]').forEach((el) => {
    const make = LOGOS[el.dataset.sizes];
    el.innerHTML = [96, 48, 32, 20].map((h) => '<div>' + make().replace('<svg ', '<svg style="height:' + h + 'px" ') + '<small>' + h + ' px</small></div>').join('');
  });
})();
