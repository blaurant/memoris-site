(() => {
  const M = window.Memoris;
  const { keeper, seat, strand, threadPoint, hung, sway, bob } = M;
  const narrow = window.matchMedia('(max-width: 1000px)');

  const LANGUAGES = ['en', 'fr', 'de', 'nl'];
  const DEFAULT_LANGUAGE = 'en';
  const RECOVERY_TYPE = 'recovery';
  const APP_SCHEME = 'memoris';
  const PAGE_TITLE_SUFFIX = 'Memoris AI';
  const STATES = ['pending', 'ready', 'incomplete'];
  const COPY = {
    en: { title: 'Open Memoris on your phone', openApp: 'Open Memoris', incompleteLink: 'This link is incomplete. Request a new one from the app.' },
    fr: { title: 'Ouvrez Memoris sur votre téléphone', openApp: 'Ouvrir Memoris', incompleteLink: "Ce lien est incomplet, demandez-en un nouveau depuis l'app." },
    de: { title: 'Öffnen Sie Memoris auf Ihrem Telefon', openApp: 'Memoris öffnen', incompleteLink: 'Dieser Link ist unvollständig. Fordern Sie in der App einen neuen an.' },
    nl: { title: 'Open Memoris op uw telefoon', openApp: 'Memoris openen', incompleteLink: 'Deze link is onvolledig. Vraag een nieuwe aan via de app.' }
  };

  const page = document.querySelector('.open');
  const params = new URLSearchParams(window.location.search);
  function readLanguage() {
    const asked = params.get('lang') || (navigator.languages && navigator.languages[0]) || navigator.language || '';
    const primary = asked.split('-')[0].toLowerCase();
    return LANGUAGES.includes(primary) ? primary : DEFAULT_LANGUAGE;
  }
  function readLink() {
    if (STATES.includes(params.get('state'))) return { status: params.get('state'), href: params.get('state') === 'ready' ? APP_SCHEME + '://auth/confirm' : '' };
    const tokenHash = params.get('token_hash');
    const type = params.get('type');
    if (!tokenHash || !type) return { status: 'incomplete', href: '' };
    const route = type === RECOVERY_TYPE ? 'reset-password' : 'auth/confirm';
    return { status: 'ready', href: APP_SCHEME + '://' + route + '?' + new URLSearchParams({ token_hash: tokenHash, type }).toString() };
  }

  const KEEPER_SCALE = 1.16;
  const WIDE = { box: '0 112 1200 370', courier: 0.452, stopped: 0.44, memoris: 0.553, gap: [0.468, 0.526], runner: 440, done: 0.405, phone: 0.6 };
  const NARROW = { box: '322 112 556 370', courier: 0.458, stopped: 0.452, memoris: 0.533, gap: [0.474, 0.512], runner: 478, done: 0.424, phone: 0.56 };
  M.scenes.link = () => {
    const state = page.dataset.state;
    const at = narrow.matches ? NARROW : WIDE;
    const box = at.box;
    const thread = [-900, 262, 600, 330, 2100, 262];
    const broken = state === 'incomplete';
    const memoris = M.phone({ flip: true, near: true, mood: broken ? 'worried' : state === 'ready' ? 'glad' : 'open', arm: state === 'ready' ? 'wave' : 'down', head: broken ? 6 : 2 });
    const [mx, my] = threadPoint(thread, at.memoris);
    const waiting = seat(memoris, mx, my, at.phone);
    if (broken) {
      const courier = keeper({ color: 'rose', pose: 'startle', carry: 'letter', marks: 'exclaim', ink: 2.5 });
      const [cx, cy] = threadPoint(thread, at.stopped);
      return { box, svg: '<g class="boil">' + strand(thread, { until: at.gap[0], frayed: true }) + strand(thread, { from: at.gap[1], until: at.memoris, frayed: 'start' }) +
        seat(courier, cx, cy, KEEPER_SCALE, { flip: true, motion: sway(0.1, 1.5) }) + '</g>' + waiting };
    }
    if (state === 'pending') {
      const runner = keeper({ color: 'rose', pose: 'dash', carry: 'letter', marks: 'speed', ink: 3 });
      return { box, svg: '<g class="boil">' + strand(thread, { until: at.memoris }) + seat(runner, at.runner, 176, 0.96, { flip: true, motion: bob(0.2, 7) }) + '</g>' + waiting };
    }
    const courier = keeper({ color: 'rose', carry: 'letter', mood: 'glad', head: 2, ink: 2.5 });
    const [cx, cy] = threadPoint(thread, at.courier);
    return { box, svg: '<g class="boil">' + strand(thread, { until: at.memoris }) + hung(thread, at.done, { length: 22, w: 40, h: 50, mark: 'check', fill: M.colors['amber-pale'], sway: 4 }) +
      seat(courier, cx, cy, KEEPER_SCALE, { flip: true, motion: sway(0.1, 1.5) }) + '</g>' + waiting };
  };

  const language = readLanguage();
  const copy = COPY[language];
  const title = document.querySelector('[data-title]');
  const open = document.querySelector('[data-open]');
  const error = document.querySelector('[data-error]');
  document.querySelector('main').lang = language;
  title.textContent = copy.title;
  open.textContent = copy.openApp;
  error.textContent = copy.incompleteLink;
  document.title = copy.title + ' - ' + PAGE_TITLE_SUFFIX;

  function show(link) {
    page.dataset.state = link.status;
    open.hidden = link.status === 'incomplete';
    error.hidden = link.status !== 'incomplete';
    if (link.status === 'ready') {
      open.setAttribute('href', link.href);
      open.removeAttribute('aria-disabled');
    } else {
      open.removeAttribute('href');
      open.setAttribute('aria-disabled', 'true');
    }
  }
  const link = readLink();
  show(link);
  const art = document.querySelector('[data-scene="link"]');
  narrow.addEventListener('change', () => M.remount(art));
})();
