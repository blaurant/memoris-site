// La personne : un homme ou une femme d'une cinquantaine d'années, dans le dessin du site (contour à l'encre, aplats, joues roses).
// Elle remplace l'hippocampe corail : `M.person(options)` la dessine, et tout <svg data-person="..."> est rempli comme un <svg data-keeper>.
(() => {
  const M = window.Memoris;
  const C = M.colors, INK = M.ink;
  const SKIN = '#F6C9A8', SKIN_SHADE = '#EBB08C', GREY = '#CFC6D8', GREY_DEEP = '#AFA3BC';
  const pen = (fill, w) => 'fill="' + fill + '" stroke="' + INK + '" stroke-width="' + (w || 3) + '" stroke-linejoin="round" stroke-linecap="round"';
  const line = (w, color) => 'fill="none" stroke="' + (color || INK) + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"';
  // Un membre : un trait épais cerné d'encre, puis la main.
  const limb = (d, color, hand, w) => '<path d="' + d + '" ' + line((w || 17) + 6) + '/><path d="' + d + '" ' + line(w || 17, color) + '/>' +
    (hand ? '<circle cx="' + hand[0] + '" cy="' + hand[1] + '" r="9" ' + pen(SKIN) + '/>' : '');
  const ARMS = {
    rest: { d: 'M39 58Q49 92 45 118', hand: [45, 127] },
    chin: { d: 'M39 58L52 98L21 47', hand: [18, 39] },
    wave: { d: 'M39 58L60 44L68 6', hand: [69, -3] },
    hold: { d: 'M39 58L47 96L72 92', hand: [80, 91] },
    grip: { d: 'M39 58L57 8L50 -74', hand: [50, -84] }
  };
  const FACES = {
    open: { eyes: (x) => '<circle cx="' + x + '" cy="-1" r="3.4" fill="' + INK + '"/><circle cx="' + (x + 1.2) + '" cy="-2.2" r="1" fill="#fff"/>', brows: 'M-17 -11q6 -4 11 -1M6 -12q5 -3 11 1', mouth: '<path d="M-9 17Q0 25 9 17" ' + line(2.6) + '/>' },
    glad: { eyes: (x) => '<path d="M' + (x - 4.5) + ' 0q4.5 -6 9 0" ' + line(2.6) + '/>', brows: 'M-17 -11q6 -4 11 -1M6 -12q5 -3 11 1', mouth: '<path d="M-10 15Q0 29 10 15Z" ' + pen('#fff', 2.4) + '/>' },
    surprised: { eyes: (x) => '<circle cx="' + x + '" cy="-2" r="5.4" fill="#fff" stroke="' + INK + '" stroke-width="2"/><circle cx="' + x + '" cy="-1" r="2.6" fill="' + INK + '"/>', brows: 'M-18 -15q6 -6 12 -3M6 -18q6 -3 12 3', mouth: '<ellipse cx="1" cy="20" rx="5.5" ry="7" ' + pen(INK, 2) + '/><ellipse cx="1" cy="23" rx="3" ry="2.6" fill="' + C.coral + '"/>' },
    thinking: { eyes: (x) => '<circle cx="' + (x + 1.6) + '" cy="-2.4" r="3.4" fill="' + INK + '"/><circle cx="' + (x + 2.8) + '" cy="-3.6" r="1" fill="#fff"/>', brows: 'M-17 -9q6 -3 11 -2M6 -15q6 -3 11 2', mouth: '<path d="M-6 20q4 -3 7 0q3 2 6 -1" ' + line(2.6) + '/>' }
  };
  // options : sex 'm' | 'f', mood, arm (bras droit, à droite du dessin), crop 'full' | 'bust' | 'head', marks 'question'
  function person(options) {
    const o = Object.assign({ sex: 'm', mood: 'open', arm: 'rest', crop: 'full', marks: '', hair: 'a', pose: 'stand', flip: false }, options);
    const f = o.sex === 'f';
    const face = FACES[o.mood] || FACES.open;
    const arm = ARMS[o.arm] || ARMS.rest;
    const top = C.coral, old = o.hair === 'old', hb = o.hair === 'b';
    const hair = f ? (old ? C['amber-deep'] : hb ? '#A9562B' : '#C2702E') : (old ? GREY : hb ? '#574A66' : '#7A4B33');
    const temples = '<path d="M-31 0C-31 -8 -29 -13 -25 -17L-23 -8C-26 -6 -29 -3 -31 0ZM31 0C31 -8 29 -13 25 -17L23 -8C26 -6 29 -3 31 0Z" ' + pen(GREY, 2) + '/>';
    const sit = o.pose === 'sit', fall = o.pose === 'fall';
    const shoe = (x, y, turn, color) => '<rect x="-17" y="-7.5" width="34" height="15" rx="7.5" transform="translate(' + x + ' ' + y + ') rotate(' + turn + ')" ' + pen(color) + '/>';
    const kicking = f
      ? limb('M-14 150L-34 186', SKIN, null, 9) + limb('M14 150L30 190', SKIN, null, 9) + shoe(-40, 192, -40, C['coral-deep']) + shoe(34, 197, 60, C['coral-deep']) + '<path d="M-33 122L33 122L45 164Q0 176 -45 164Z" ' + pen(C.amber) + '/>'
      : limb('M-17 128L-30 168L-58 184', C['paper-deep'], null, 21) + limb('M17 128L30 172L14 206', C['paper-deep'], null, 21) + shoe(-66, 188, -62, C['amber-deep']) + shoe(10, 213, 20, C['amber-deep']) + '<path d="M-34 122H34V140H-34Z" ' + pen(C['paper-deep']) + '/>';
    const seated = f
      ? '<rect x="-21" y="150" width="13" height="42" ' + pen(SKIN) + '/><rect x="8" y="150" width="13" height="42" ' + pen(SKIN) + '/>' +
        '<rect x="-29" y="187" width="24" height="13" rx="6.5" ' + pen(C['coral-deep']) + '/><rect x="5" y="187" width="24" height="13" rx="6.5" ' + pen(C['coral-deep']) + '/>' +
        '<path d="M-35 122H35L41 150Q41 158 33 158H-33Q-41 158 -41 150Z" ' + pen(C.amber) + '/>'
      : '<rect x="-31" y="140" width="25" height="52" ' + pen(C['paper-deep']) + '/><rect x="6" y="140" width="25" height="52" ' + pen(C['paper-deep']) + '/>' +
        '<rect x="-39" y="187" width="37" height="15" rx="7.5" ' + pen(C['amber-deep']) + '/><rect x="2" y="187" width="37" height="15" rx="7.5" ' + pen(C['amber-deep']) + '/>' +
        '<path d="M-34 122H34V146Q34 154 26 154H-26Q-34 154 -34 146Z" ' + pen(C['paper-deep']) + '/><path data-fine d="M0 132V154" ' + line(2) + ' opacity=".5"/>';
    const legs = f
      ? '<rect x="-21" y="178" width="13" height="38" ' + pen(SKIN) + '/><rect x="8" y="178" width="13" height="38" ' + pen(SKIN) + '/>' +
        '<rect x="-29" y="211" width="24" height="13" rx="6.5" ' + pen(C['coral-deep']) + '/><rect x="5" y="211" width="24" height="13" rx="6.5" ' + pen(C['coral-deep']) + '/>' +
        '<path d="M-33 122L33 122L45 182Q0 193 -45 182Z" ' + pen(C.amber) + '/><path data-fine d="M-14 140L-19 184M12 140L17 184" ' + line(1.8) + ' opacity=".45"/>'
      : '<path d="M-33 124L33 124L31 214L5 214L0 160L-5 214L-31 214Z" ' + pen(C['paper-deep']) + '/>' +
        '<rect x="-39" y="211" width="37" height="15" rx="7.5" ' + pen(C['amber-deep']) + '/><rect x="2" y="211" width="37" height="15" rx="7.5" ' + pen(C['amber-deep']) + '/>';
    const torso = '<path d="M-22 40Q-42 42 -42 62L-36 130Q0 138 36 130L42 62Q42 42 22 40Z" ' + pen(top) + '/>' +
      (f ? '<path d="M-13 40Q0 64 13 40Z" ' + pen(C.card) + '/>' : '<path d="M-12 40L0 68L12 40Z" ' + pen(C.card) + '/>') +
      '<path d="M0 ' + (f ? 54 : 68) + 'V133" ' + line(2.4) + '/>' + [84, 102, 120].map((y) => '<circle cx="6" cy="' + y + '" r="2" fill="' + INK + '"/>').join('') +
      '<path data-fine d="M-30 128q12 3 26 3M10 131q12 0 22 -3" ' + line(1.6) + ' opacity=".4"/>';
    const neck = '<rect x="-8" y="24" width="16" height="22" ' + pen(SKIN) + '/>' + (f ? '<path d="M-10 44q10 8 20 0" ' + line(2.2, C.glow) + '/>' : '');
    const ears = '<circle cx="-29" cy="3" r="6.5" ' + pen(SKIN) + '/><circle cx="29" cy="3" r="6.5" ' + pen(SKIN) + '/>' + (f && (old || hb) ? '<circle cx="-30" cy="13" r="2.6" ' + pen(C.glow, 1.6) + '/><circle cx="30" cy="13" r="2.6" ' + pen(C.glow, 1.6) + '/>' : '');
    // Coiffures. Femme A : carré avec une raie sur le côté, qui tombe droit le long des joues. Femme B : chignon, oreilles dégagées.
    const backHair = !f ? '' : old ? '<path d="M-36 4C-41 -34 -20 -47 0 -47C20 -47 41 -34 36 4C38 18 36 28 29 33L-29 33C-36 28 -38 18 -36 4Z" ' + pen(hair) + '/>'
      : hb ? '<circle cx="2" cy="-47" r="13" ' + pen(hair) + '/><path data-fine d="M-5 -52q7 -6 14 0" ' + line(1.8) + ' opacity=".45"/>'
      : '<path d="M-25 6H25V32H-25Z" fill="' + hair + '"/>';
    const skull = '<path d="M-29 -4C-29 -30 -16 -36 0 -36C16 -36 29 -30 29 -4C29 18 16 32 0 32C-16 32 -29 18 -29 -4Z" ' + pen(SKIN) + '/>';
    const frontHair = f
      ? (old ? '<path d="M-30 -2C-33 -30 -16 -41 0 -41C16 -41 33 -30 30 -2C24 -9 15 -21 7 -28C-1 -17 -18 -8 -30 -2Z" ' + pen(hair) + '/><path data-fine d="M9 -38Q18 -31 24 -17" ' + line(3.4, C.glow) + '/>'
        : hb ? '<path d="M-30 -5C-34 -30 -16 -42 0 -42C16 -42 34 -30 30 -5C28 -16 21 -25 7 -31C-3 -22 -18 -15 -30 -5Z" ' + pen(hair) + '/><path data-fine d="M10 -39Q20 -33 25 -21" ' + line(3.2, C.glow) + '/>'
        : '<path d="M-36 2C-41 -34 -20 -46 0 -46C20 -46 41 -34 36 2L38 29Q32 37 25 32C25 20 26 4 24 -9C13 -12 -1 -20 -9 -31C-12 -20 -21 -12 -25 -7C-26 6 -25 20 -25 32Q-32 37 -38 29Z" ' + pen(hair) + '/><path data-fine d="M4 -40Q18 -34 24 -20" ' + line(3.2, C.glow) + '/>')
      : (old ? '<path d="M-30 -5C-34 -29 -19 -42 2 -42C22 -42 34 -28 30 -5C27 -17 21 -23 9 -25C-3 -22 -17 -26 -24 -17C-27 -13 -29 -9 -30 -5Z" ' + pen(hair) + '/><path data-fine d="M-12 -34q10 -4 22 0" ' + line(1.8, GREY_DEEP) + '/>'
        : hb ? '<path d="M-31 -2C-37 -10 -36 -22 -28 -27C-30 -38 -16 -47 -8 -41C-2 -50 12 -49 16 -40C26 -45 37 -32 31 -24C36 -16 34 -6 31 -2C29 -10 25 -16 20 -19C12 -15 -8 -15 -20 -19C-25 -16 -29 -10 -31 -2Z" ' + pen(hair) + '/>' + temples
        : '<path d="M-31 -2C-36 -24 -24 -44 0 -44C22 -45 36 -30 31 -4C29 -12 26 -18 20 -22C8 -17 -10 -19 -20 -27C-26 -20 -29 -10 -31 -2Z" ' + pen(hair) + '/><path data-fine d="M-18 -30Q-6 -40 10 -37" ' + line(1.8) + ' opacity=".4"/>' + temples);
    const features = '<circle cx="-19" cy="13" r="5.5" fill="' + C.coral + '" opacity=".28"/><circle cx="19" cy="13" r="5.5" fill="' + C.coral + '" opacity=".28"/>' +
      face.eyes(-11) + face.eyes(11) + '<path d="' + face.brows + '" ' + line(2.6, f || !old ? INK : GREY_DEEP) + '/>' +
      '<path d="M-1 4q-4 6 2 8" ' + line(2.2) + '/>' + face.mouth +
      '<path data-fine d="M-22 -1l-4 -2M-22 2l-4 2M22 -1l4 -2M22 2l4 2" ' + line(1.4) + ' opacity=".55"/>' +
      (f ? '' : '<path data-fine d="M-8 -20q8 -3 16 0" ' + line(1.4) + ' opacity=".4"/>' +
        '<circle cx="-11" cy="-1" r="9.5" fill="#fff" fill-opacity=".28" stroke="' + INK + '" stroke-width="2.2"/><circle cx="11" cy="-1" r="9.5" fill="#fff" fill-opacity=".28" stroke="' + INK + '" stroke-width="2.2"/><path d="M-1.5 -2q1.5 -2 3 0M-20.5 -2L-28 -1M20.5 -2L28 -1" ' + line(2.2) + '/>');
    const q = (x, y, size, turn) => '<text transform="translate(' + x + ' ' + y + ') rotate(' + turn + ') scale(' + (o.flip ? -1 : 1) + ' 1)" text-anchor="middle" font-size="' + size + '">?</text>';
    const marks = o.marks === 'question' ? '<g font-family="Fraunces, Georgia, serif" font-weight="800" fill="' + C['coral-deep'] + '">' + q(52, -58, 32, 12) + q(74, -36, 20, 24) + '</g>' : '';
    const farArm = fall ? limb('M-39 58L-66 46L-84 70', top, [-88, 78]) : limb('M-39 58Q-49 92 -45 118', top, [-45, 127]);
    const nearArm = limb(arm.d, top, arm.hand);
    const all = (o.crop === 'full' ? (fall ? kicking : sit ? seated : legs) : '') + farArm + torso + neck + (o.arm === 'chin' ? '' : nearArm) + '<g transform="translate(0 36) scale(1.3) translate(0 -36)">' + backHair + ears + skull + frontHair + features + '</g>' + (o.arm === 'chin' ? nearArm : '') + marks;
    const BOX = { full: fall ? [-128, -112, 256, 372] : sit ? [-88, -96, 176, 302] : [-88, -96, 176, 326], bust: [-88, -96, 176, 202], head: [-64, -98, 128, 142] };
    const box = BOX[o.crop] || BOX.full;
    const swing = fall ? '<g transform="rotate(13 ' + arm.hand[0] + ' ' + arm.hand[1] + ')">' + all + '</g><path data-fine d="M-96 -20q-12 14 -10 34M-112 6q-8 12 -6 26M96 120q14 10 16 30M112 96q10 8 12 22" ' + line(2.4) + ' opacity=".55"/>' : all;
    let svg = swing;
    const palm = (at) => '<circle cx="' + at[0] + '" cy="' + at[1] + '" r="9" ' + pen(SKIN) + '/>';
    const bare = palm(fall ? [-88, 78] : [-45, 127]) + palm(arm.hand);
    const hands = fall ? '<g transform="rotate(13 ' + arm.hand[0] + ' ' + arm.hand[1] + ')">' + bare + '</g>' : bare;
    if (o.crop !== 'full') { const id = 'p' + Math.random().toString(36).slice(2, 8); svg = '<clipPath id="' + id + '"><rect x="' + box[0] + '" y="' + box[1] + '" width="' + box[2] + '" height="' + (o.crop === 'head' ? 140 : 198) + '"/></clipPath><g clip-path="url(#' + id + ')">' + all + '</g>'; }
    return { svg, hands, box, anchors: { head: [0, 0], crown: [0, -66], hand: arm.hand, far: [-45, 127], shoulder: [38, 44], feet: [0, 226], seat: [0, 136], low: [0, 127] }, by: sit ? 'seat' : fall ? 'hand' : o.pose === 'held' ? 'low' : o.arm === 'grip' ? 'hand' : 'feet' };
  }
  M.person = person;

  // Montage dans la page, sur le modèle de l'hippocampe : le point d'appui (assise, pieds ou main) est posé sur le fil.
  const fix = (n) => Math.round(n * 100) / 100;
  function mountPerson(el) {
    const options = {};
    String(el.dataset.person || '').split(';').forEach((pair) => { const at = pair.indexOf(':'); if (at > 0) options[pair.slice(0, at).trim()] = pair.slice(at + 1).trim(); });
    const flip = el.hasAttribute('data-flip');
    options.flip = flip;
    const size = Number(el.dataset.size || 1);
    const p = person(options);
    const [bx, by, bw, bh] = p.box;
    const left = flip ? -(bx + bw) : bx;
    const anchor = p.anchors[el.dataset.by || p.by] || p.anchors.feet;
    el.setAttribute('viewBox', [left, by, bw, bh].map(fix).join(' '));
    el.setAttribute('width', fix(bw * size));
    el.setAttribute('height', fix(bh * size));
    el.style.setProperty('--w', fix(bw * size));
    el.style.setProperty('--ax', fix((((flip ? -anchor[0] : anchor[0]) - left) / bw) * 100));
    el.style.setProperty('--ay', fix(((anchor[1] - by) / bh) * 100));
    el.classList.add('boil');
    const phase = Math.random().toFixed(2);
    const inner = (art) => '<g transform="scale(' + (flip ? -1 : 1) + ' 1)"><g class="sway" data-a="' + (el.dataset.sway || 1.4) + '" data-s=".2" data-p="' + phase + '" data-x="' + fix(anchor[0]) + '" data-y="' + fix(anchor[1]) + '">' + art + '</g></g>';
    el.innerHTML = inner(p.svg);
    // Les mains sont redessinées dans un second dessin, posé par-dessus le fil : le fil passe devant le corps mais derrière les mains.
    if (el.nextElementSibling && el.nextElementSibling.classList.contains('person-hands')) el.nextElementSibling.remove();
    const over = el.cloneNode(false);
    over.removeAttribute('data-person');
    over.removeAttribute('role');
    over.removeAttribute('aria-label');
    over.setAttribute('aria-hidden', 'true');
    over.classList.add('person-hands');
    over.innerHTML = inner(p.hands);
    el.after(over);
  }
  M.mountPerson = mountPerson;
  document.querySelectorAll('svg[data-person]').forEach(mountPerson);
})();
