(() => {
  const MOCK_FILE = '404.html';
  const ASKED_MAX = 34;
  const SITE_HOST = 'memoris.ai';

  const params = new URLSearchParams(window.location.search);
  const path = params.get('asked') || (window.location.pathname.endsWith(MOCK_FILE) ? '' : window.location.pathname);
  const asked = document.querySelector('[data-asked]');
  const address = (window.location.host || SITE_HOST) + path;
  if (path && asked) asked.textContent = address.length > ASKED_MAX ? address.slice(0, ASKED_MAX - 1) + '…' : address;
})();
