// Essais de personnage humain pour remplacer l'hippocampe corail : un homme et une femme d'une cinquantaine d'années,
// dessinés dans le style du site (contour à l'encre, aplats, joues roses), et des scènes avec Memoris.
(() => {
  const M = window.Memoris;
  const C = M.colors, INK = M.ink, person = M.person;
  const pen = (fill, w) => 'fill="' + fill + '" stroke="' + INK + '" stroke-width="' + (w || 3) + '" stroke-linejoin="round" stroke-linecap="round"';
  const line = (w, color) => 'fill="none" stroke="' + (color || INK) + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"';
  const wrap = (p, extra) => '<svg viewBox="' + p.box.join(' ') + '" aria-hidden="true">' + (extra || '') + p.svg + '</svg>';
  const at = (p, x, y, s, flip) => '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -s : s) + ' ' + s + ')">' + p.svg + '</g>';
  const memoris = (mood) => M.keeper({ color: M.memoris, mood: mood || 'glad', prop: 'satchel', head: -6, ink: 3 });
  const tag = (thread, t, mark, extra) => M.hung(thread, t, Object.assign({ mark, length: 22, w: 30, h: 38, fill: C.card, sway: 4 }, extra || {}));

  // Les personnages seuls.
  const SOLO = {
    pied: (sex, hair) => wrap(person({ sex, hair })),
    piedSalut: (sex, hair) => wrap(person({ sex, hair, mood: 'glad', arm: 'wave' })),
    piedDoute: (sex, hair) => wrap(person({ sex, hair, mood: 'thinking', arm: 'chin', marks: 'question' })),
    buste: (sex, hair) => wrap(person({ sex, hair, mood: 'glad', crop: 'bust' })),
    busteDoute: (sex, hair) => wrap(person({ sex, hair, mood: 'thinking', arm: 'chin', crop: 'bust', marks: 'question' })),
    tete: (sex, hair) => wrap(person({ sex, hair, crop: 'head' })),
    teteRond: (sex, hair) => { const p = person({ sex, hair, mood: 'glad', crop: 'head' }); return '<svg viewBox="-72 -84 144 144" aria-hidden="true"><clipPath id="r' + sex + hair + '"><circle cx="0" cy="-12" r="68"/></clipPath><circle cx="0" cy="-12" r="68" fill="' + C['amber-pale'] + '"/><g clip-path="url(#r' + sex + hair + ')"><g transform="translate(0 6)">' + person({ sex, hair, mood: 'glad' }).svg + '</g></g><circle cx="0" cy="-12" r="68" ' + line(3) + '/></svg>'; }
  };

  // Les scènes avec Memoris : le fil et les fiches qui passent de la personne à Memoris.
  const SCENES = {
    // 1. Côte à côte sur le fil : le remplacement direct du duo actuel du site.
    duo: (sex, hair) => { const th = [0, 262, 300, 262, 600, 262]; const k = memoris();
      return '<svg viewBox="0 -44 600 384" aria-hidden="true">' + M.strand(th, { width: 3 }) + tag(th, 0.1, 'lines') + tag(th, 0.93, 'face') +
        at(person({ sex, hair, mood: 'glad' }), 232, 36, 1) + M.seat(k, 372, 261, 1.02) + '</svg>'; },
    // 2. La personne tend le fil, Memoris est perché dessus : les fiches glissent vers lui.
    fil: (sex, hair) => { const p = person({ sex, hair, mood: 'open', arm: 'hold' }); const hx = 110 + p.anchors.hand[0], hy = 70 + p.anchors.hand[1]; const th = [hx, hy, 330, hy + 78, 600, hy + 6]; const [mx, my] = M.threadPoint(th, 0.8); const k = memoris();
      return '<svg viewBox="0 -34 620 374" aria-hidden="true">' + M.strand(th, { width: 3 }) + tag(th, 0.18, 'key') + tag(th, 0.38, 'face', { fill: C['amber-pale'] }) + tag(th, 0.57, 'calendar') +
        at(p, 110, 70, 1) + M.seat(k, mx, my, 0.98) + '</svg>'; },
    // 3. Ce qui s'effiloche chez la personne, Memoris le noue : le fil part de sa tête, en pointillé puis plein.
    oubli: (sex, hair) => { const th = [150, 22, 330, -70, 500, 96]; const k = memoris('open');
      return '<svg viewBox="0 -44 620 384" aria-hidden="true">' + M.strand(th, { width: 3, dotted: true, until: 0.34 }) + M.strand(th, { width: 3, from: 0.34 }) + M.knot(th, 0.34, { width: 3 }) +
        tag(th, 0.14, 'question', { planned: true }) + tag(th, 0.52, 'key') + tag(th, 0.74, 'calendar', { fill: C['amber-pale'] }) +
        at(person({ sex, hair, mood: 'thinking', arm: 'chin' }), 150, 100, 1) + M.seat(k, 500, 100, 1, { by: 'head' }) + '</svg>'; },
    // 4. Sur l'épaule : Memoris, tout petit, perché sur l'épaule comme un compagnon.
    epaule: (sex, hair) => { const p = person({ sex, hair, mood: 'glad', crop: 'bust' }); const k = memoris(); const th = [52, 20, 96, 34, 138, 14];
      return '<svg viewBox="-96 -118 262 224" aria-hidden="true">' + p.svg + M.strand(th, { width: 2.4 }) + tag(th, 0.62, 'heart', { length: 14, w: 24, h: 30 }) + M.seat(k, 52, 21, 0.5) + '</svg>'; }
  };

  const sexOf = (el) => (el.hasAttribute('data-f') ? 'f' : 'm');
  const hairOf = (el) => el.dataset.hair || 'a';
  document.querySelectorAll('[data-solo]').forEach((el) => { el.innerHTML = SOLO[el.dataset.solo](sexOf(el), hairOf(el)); });
  document.querySelectorAll('[data-duo]').forEach((el) => { el.innerHTML = SCENES[el.dataset.duo](sexOf(el), hairOf(el)); });
  // L'hippocampe corail actuel, pour comparer.
  document.querySelectorAll('[data-ref]').forEach((el) => { const k = M.keeper({ color: 'coral', mood: 'open', ink: 3 }); el.innerHTML = '<svg viewBox="' + k.box.join(' ') + '" aria-hidden="true">' + k.svg + '</svg>'; });
})();
