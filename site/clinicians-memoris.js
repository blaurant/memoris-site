// Page Cliniciens uniquement : Memoris en violet et le logo « porteur de souvenirs » (voir marque.html).
(() => {
  const M = window.Memoris;
  const VIOLET = '#7E529F';
  // Les hippocampes bleus (Memoris) deviennent violets.
  Object.assign(M.tones.teal, { body: VIOLET, belly: '#D9C6EA', fin: '#F5ECD9', shade: '#5E3B78' });

  // Logo : la tête de Memoris et l'étiquette-cœur qu'il porte, dans un rond.
  const swimmer = M.keeper({ color: 'teal', pose: 'swim', mood: 'open', ink: 2.4, carry: { mark: 'heart', length: 20, w: 30, h: 38 } });
  let n = 0;
  // Le contenu du logo (on garde l'élément du site et son attribut data-mark, dont kit.js a besoin).
  const inner = () => {
    const id = 'porteur-' + (n += 1);
    return '<defs><clipPath id="' + id + '"><circle cx="20" cy="20" r="19.1"/></clipPath></defs>' +
      '<circle cx="20" cy="20" r="19.1" fill="#EFE5F6"/><g clip-path="url(#' + id + ')"><svg width="40" height="40" viewBox="-62 -56 142 142"><g transform="scale(-1 1)">' + swimmer.svg + '</g></svg></g>' +
      '<circle cx="20" cy="20" r="19.1" fill="none" stroke="' + VIOLET + '" stroke-width="1.8"/>';
  };

  const style = document.createElement('style');
  style.textContent = '.brand svg.porteur{width:1.9em;height:1.9em;flex:none}';
  document.head.appendChild(style);

  const swap = () => document.querySelectorAll('.brand svg[data-mark]').forEach((mark) => {
    if (mark.querySelector('[data-porteur]')) return;
    mark.setAttribute('viewBox', '0 0 40 40');
    mark.classList.add('porteur');
    mark.innerHTML = '<g data-porteur>' + inner() + '</g>';
  });
  window.addEventListener('load', () => {
    swap();
    document.querySelectorAll('.brand').forEach((brand) => new MutationObserver(swap).observe(brand, { childList: true, subtree: true }));
    new MutationObserver(swap).observe(document.body, { childList: true });
  });
})();
