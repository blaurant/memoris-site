(() => {
  const M = window.Memoris;
  const HEAD = 'M360 1000C360 950 340 905 300 880C262 866 226 868 200 850C176 834 170 806 182 782C188 768 196 762 190 750C180 742 172 732 180 720C186 713 194 711 198 705C188 699 172 692 174 678C176 664 190 658 190 646C166 642 112 632 106 604C102 584 140 548 162 506C172 484 164 462 162 440C150 330 190 210 270 130C350 50 460 10 580 10C800 10 950 170 950 390C950 540 900 640 850 720C820 770 806 820 812 880C816 930 826 970 834 1000Z';
  const TORSO = 'M290 1250C286 1150 300 1060 362 990L832 990C880 1040 930 1130 936 1250Z';
  const SKIN = '#E8AE2F';
  const LINE = '#A66D0E';
  const EAR = '#D99A22';
  const EAR_LINE = '#B87C14';
  const BLUSH = '#E2603A';
  const EDGE_SWAY = 5;
  let cut = null;

  M.bust = {
    width: 1000,
    height: 1240,
    brain: { cx: 566, cy: 348, rx: 318, ry: 272, squash: 0.86, bumps: [26, 30, 24, 28, 22, 30, 26, 24, 32, 26, 22, 28, 24, 18] },
    folds: 'M470 96c26-14 54-4 62 20M650 84c26 6 40 26 34 50M790 150c20 20 18 48-2 64M866 300c12 24 4 50-18 62M800 520c14-18 38-22 56-12M300 330c-12 20-8 42 10 54M318 520c16-16 40-16 54 0M560 566c20-12 44-8 54 10',
    focus: [566, 342],
    floor: 556,
    mouth: [150, 713],
    plaque: { left: 41, width: 17 },
    legend: { left: 0.5, bottom: 7 },
    figure(options) {
      const o = M.util.defaults({ fill: SKIN, torso: true, features: true }, options);
      if (!cut) cut = { head: M.handCut(HEAD, EDGE_SWAY), torso: M.handCut(TORSO, EDGE_SWAY) };
      const face = o.features
        ? '<path d="M224 560q31 -28 64 0" fill="none" stroke="' + LINE + '" stroke-width="10" stroke-linecap="round"/>' +
          '<path d="M200 707q32 22 66 -4" fill="none" stroke="' + LINE + '" stroke-width="9" stroke-linecap="round"/>' +
          '<path d="M672 662c-36 -8 -66 20 -62 58c4 40 36 64 64 50c22 -10 12 -36 -4 -38" fill="' + EAR + '" stroke="' + EAR_LINE + '" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<circle cx="306" cy="654" r="38" fill="' + BLUSH + '" opacity=".3"/>'
        : '';
      return (o.torso ? '<path d="' + cut.torso + '" fill="' + o.fill + '"/>' : '') + '<path d="' + cut.head + '" fill="' + o.fill + '"/>' + face;
    }
  };
})();
