(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function setTheme(dark) {
    root.dataset.theme = dark ? 'dark' : 'light';
    themeToggle?.setAttribute('aria-pressed', String(dark));
    themeToggle?.setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
    if (themeMeta) themeMeta.content = dark ? '#111614' : '#f3efe7';
  }
  let saved = null;
  try { saved = localStorage.getItem('ka-theme'); } catch (_) {}
  setTheme(saved === 'dark' || (saved !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches));
  themeToggle?.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    setTheme(dark);
    try { localStorage.setItem('ka-theme', dark ? 'dark' : 'light'); } catch (_) {}
  });
  function setMenuOpen(open) {
    nav?.classList.toggle('is-open', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  }
  menuToggle?.addEventListener('click', () => setMenuOpen(!nav?.classList.contains('is-open')));
  nav?.addEventListener('click', event => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) {
      setMenuOpen(false);
      menuToggle?.focus();
    }
  });
  document.querySelectorAll('[data-site-year],#year,.hub-year').forEach(element => {
    element.textContent = new Date().getFullYear();
  });
})();
