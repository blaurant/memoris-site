// Variante de la page d'accueil avec les personnes : la scène « ce qui manque » redessinée avec la femme à la place de l'hippocampe corail.
(() => {
  const M = window.Memoris;
  const { defaults } = M.util;
  const PALE = M.colors['amber-pale'];
  const LOST_ON_WALL = { box: '0 0 360 300', from: 10, until: 900, y: 196, sag: 18, keeper: 225, knots: [15], tags: [31, 113, 333] };
  const LOST_WHOLE = { box: '0 0 590 400', from: 62, until: 528, y: 262, sag: 12, keeper: 322, knots: [68, 522], tags: [112, 196, 470], bay: { x: 26, y: 32, w: 538, h: 338, side: 'both' } };
  const LOST_TAGS = [{ mark: 'face', length: 22 }, { gone: true, length: 34, sway: 5 }, { mark: 'calendar', fill: PALE, length: 28 }];
  M.scenes['b-missing'] = (el) => {
    const shape = el.hasAttribute('data-closed') ? LOST_WHOLE : LOST_ON_WALL;
    const thread = [shape.from, shape.y, (shape.from + shape.until) / 2, shape.y + shape.sag, shape.until, shape.y];
    const at = (x) => (x - shape.from) / (shape.until - shape.from);
    const yours = M.person({ sex: 'f', hair: 'b', mood: 'thinking', arm: 'chin', pose: 'held', marks: 'question' });
    const [x, y] = M.threadPoint(thread, at(shape.keeper));
    const s = 0.86;
    return { box: shape.box, svg: (shape.bay ? M.bay(shape.bay) : '') + '<g class="boil">' + '<g transform="translate(' + x.toFixed(1) + ' ' + (y - yours.anchors.low[1] * s).toFixed(1) + ') scale(' + s + ')">' + yours.svg + '</g>' + M.strand(thread, { width: 2.6 }) + '<g transform="translate(' + x.toFixed(1) + ' ' + (y - yours.anchors.low[1] * s).toFixed(1) + ') scale(' + s + ')">' + yours.hands + '</g>' +
      shape.knots.map((knot) => M.knot(thread, at(knot), { width: 2.6, size: 0.8 })).join('') +
      LOST_TAGS.map((tag, i) => M.hung(thread, at(shape.tags[i]), defaults({ w: 48, h: 58, sway: 3 }, tag))).join('') +
      '</g>' };
  };
})();
