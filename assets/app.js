(() => {
  'use strict';

  const ARTICLES = window.ITArticles || [];
  const FEATURED_ORDER = window.ITFeaturedOrder || [];
  const CATEGORIES = ['Tümü','Arkeoloji & Kentler','Metin & İnanç','Bilim & Teknoloji','İklim & Felaket','Yöntem & Tarihyazımı'];
  const state = { category:'Tümü', sort:'featured', view:'grid' };
  let visualInstance = 0;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  function normalize(value) {
    return String(value)
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Arama; Türkçe imla denetimi değil, aksan ve klavye farkına toleranslı
      // bir bulmadır. ASCII büyük I, Türkçe küçük harfe çevrilince dotless ı
      // olur; kullanıcı "ISKENDERIYE" yazdığında İskenderiye kaydını yine bul.
      .replaceAll('ı', 'i');
  }

  function icon(name, className = '') {
    const paths = {
      archive:'<path d="M5 5h14v15H5z"/><path d="M8 2h8v3M9 9h6"/>',
      building:'<path d="M3 20h18M5 18V9m4 9V9m6 9V9m4 9V9M3 9h18L12 3 3 9Z"/>',
      book:'<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5ZM20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z"/>',
      science:'<path d="M9 3h6M10 3v5l-5 9a2.5 2.5 0 0 0 2.2 3.7h9.6A2.5 2.5 0 0 0 19 17l-5-9V3"/><path d="M8 15h8"/>',
      climate:'<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 8.5 4.5 4.5 0 0 0 7 18Z"/><path d="m8 21-1 2m5-2-1 2m5-2-1 2"/>',
      method:'<path d="M5 4h14v16H5z"/><path d="m8 9 1.5 1.5L12 8m2 2h3m-9 5 1.5 1.5L12 14m2 2h3"/>',
      chart:'<path d="M5 20V11m5 9V5m5 15v-7m5 7V8"/>',
      search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
      question:'<circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.6 2.1c-.9.5-1.4 1-1.4 2.2M12 17h.01"/>',
      layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
      check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
      arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>'
    };
    return `<svg${className ? ` class="${className}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.archive}</svg>`;
  }

  function categoryIcon(category) {
    return {
      'Tümü':'archive',
      'Arkeoloji & Kentler':'building',
      'Metin & İnanç':'book',
      'Bilim & Teknoloji':'science',
      'İklim & Felaket':'climate',
      'Yöntem & Tarihyazımı':'method'
    }[category] || 'archive';
  }

  function renderArtwork(article, context = 'card') {
    if (article.cover) {
      const eager = context === 'card' && FEATURED_ORDER.indexOf(article.slug) >= 0 && FEATURED_ORDER.indexOf(article.slug) < 6;
      const source = article.cover;
      return `<img data-editorial-slug="${article.slug}" src="${source}" alt="" width="1200" height="675" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
    }
    if (!window.ITVisuals?.render) return '';
    visualInstance += 1;
    return window.ITVisuals.render(article.slug, { title:article.title, decorative:true, instance:`${context}-${visualInstance}` });
  }

  function countFor(category) {
    return category === 'Tümü' ? ARTICLES.length : ARTICLES.filter(article => article.category === category).length;
  }

  function renderFilters() {
    const host = $('#categoryFilters');
    host.innerHTML = CATEGORIES.map(category => `<button class="filter-button${state.category === category ? ' is-active' : ''}" type="button" data-category="${escapeHtml(category)}" aria-pressed="${state.category === category}">
      ${icon(categoryIcon(category))}
      <span>${escapeHtml(category === 'Tümü' ? 'Tüm Yazılar' : category)}</span>
      <span class="filter-count">${countFor(category)}</span>
    </button>`).join('');
    $$('[data-category]', host).forEach(button => button.addEventListener('click', () => {
      state.category = button.dataset.category;
      renderFilters();
      renderArticles();
      if (matchMedia('(max-width:900px)').matches) {
        setMobileFilterOpen(false);
      }
    }));
  }

  function sortedArticles() {
    const filtered = ARTICLES.filter(article => state.category === 'Tümü' || article.category === state.category);
    const rank = new Map(FEATURED_ORDER.map((slug,index) => [slug,index]));
    return filtered.sort((a,b) => {
      if (state.sort === 'number') return a.no - b.no;
      if (state.sort === 'recent') return b.no - a.no;
      if (state.sort === 'title') return a.cardTitle.localeCompare(b.cardTitle,'tr');
      return (rank.get(a.slug) ?? 999) - (rank.get(b.slug) ?? 999);
    });
  }

  // Yazının dayandığı bulguların durum dağılımı.
  // Veri scripts/build-tools.mjs tarafından assets/evidence-data.js'e üretilir;
  // yoksa çubuk hiç çizilmez (kart eski hâliyle çalışmaya devam eder).
  const EV_ORDER = ['established','contested','minority','refuted','unknown','unmeasurable'];
  const EV_TR = { established:'yerleşik', contested:'tartışmalı', minority:'azınlık',
                  refuted:'çürütülmüş', unknown:'bilinmiyor', unmeasurable:'ölçülemez' };

  function evidenceStrip(slug) {
    const e = (window.ITEvidence || {})[slug];
    if (!e || !e.n) return '';
    const parts = EV_ORDER.filter(s => e.st[s]);
    const segments = parts.map(s =>
      `<i class="ev-seg ev-${s}" style="flex:${e.st[s]}"></i>`).join('');
    const label = parts.map(s => `${e.st[s]} ${EV_TR[s]}`).join(' · ');
    return `<div class="evidence-strip" role="img" aria-label="Dayandığı ${e.n} bulgu: ${escapeHtml(label)}">
      <span class="ev-bar">${segments}</span>
      <span class="ev-count"><strong>${e.n}</strong> bulgu</span>
    </div>`;
  }

  function articleCard(article) {
    const aiClass = article.cover ? ' has-ai-cover' : '';
    return `<a class="article-card${aiClass}" href="reader.html?slug=${encodeURIComponent(article.slug)}" aria-label="${escapeHtml(article.title)} yazısını oku">
      <div class="article-cover">
        ${renderArtwork(article)}
        <span class="cover-tagline">${escapeHtml(article.tagline)}</span>
        <span class="category-chip">${escapeHtml(article.category)}</span>
      </div>
      <div class="article-body">
        <span class="dossier-number">Dosya ${String(article.no).padStart(2,'0')}</span>
        <h2 class="article-title">${escapeHtml(article.cardTitle)}</h2>
        <p class="article-summary">${escapeHtml(article.summary)}</p>
        ${evidenceStrip(article.slug)}
        <div class="article-footer">
          <span class="evidence-badge" data-tone="${article.tone}">${icon(article.evidenceIcon)}<span>${escapeHtml(article.evidenceLabel)}</span></span>
          <span class="read-button">Yazıyı Oku ${icon('arrow')}</span>
        </div>
      </div>
    </a>`;
  }

  function renderArticles() {
    const items = sortedArticles();
    const grid = $('#articlesGrid');
    grid.dataset.view = state.view;
    grid.innerHTML = items.map(articleCard).join('');
    $('#emptyState').hidden = items.length !== 0;
    const categoryLabel = state.category === 'Tümü' ? '' : ` · ${state.category}`;
    $('#resultText').textContent = `${items.length} yazı gösteriliyor${categoryLabel}`;
    $('#clearFilters').hidden = state.category === 'Tümü';
    $('#articleTotal').textContent = ARTICLES.length;
  }

  function resetFilters() {
    state.category = 'Tümü';
    renderFilters();
    renderArticles();
  }

  function initViewSwitch() {
    $$('[data-view]').forEach(button => button.addEventListener('click', () => {
      state.view = button.dataset.view;
      $$('[data-view]').forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      renderArticles();
      try { localStorage.setItem('it-view', state.view); } catch (_) {}
    }));
    try {
      const saved = localStorage.getItem('it-view');
      if (saved === 'grid' || saved === 'list') {
        state.view = saved;
        $$('[data-view]').forEach(item => {
          const active = item.dataset.view === saved;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
      }
    } catch (_) {}
  }

  function initSorting() {
    $('#sortSelect').addEventListener('change', event => {
      state.sort = event.target.value;
      renderArticles();
    });
  }

  function searchMatches(query) {
    const needle = normalize(query.trim());
    if (!needle) return sortedArticles().slice(0,9);
    return ARTICLES.filter(article => normalize([article.title,article.cardTitle,article.category,article.summary,...article.tags].join(' ')).includes(needle)).slice(0,12);
  }

  function renderSearchResults(query) {
    const host = $('#searchResults');
    const results = searchMatches(query);
    if (!results.length) {
      host.innerHTML = '<div class="no-search-results"><b>Eşleşen yazı bulunamadı.</b><p>Başka bir başlık, konu veya anahtar kelime deneyin.</p></div>';
      return;
    }
    host.innerHTML = results.map(article => `<a class="search-result" href="reader.html?slug=${encodeURIComponent(article.slug)}">
      <span class="search-result__thumb">${renderArtwork(article,'search')}</span>
      <span><b>${escapeHtml(article.cardTitle)}</b><small>Dosya ${String(article.no).padStart(2,'0')} · ${escapeHtml(article.category)}</small></span>
      ${icon('arrow')}
    </a>`).join('');
  }

  function openSearch() {
    const dialog = $('#searchDialog');
    if (!dialog.open) dialog.showModal();
    $('#siteSearch').value = '';
    renderSearchResults('');
    setTimeout(() => $('#siteSearch').focus(),30);
  }

  function initSearch() {
    $('#searchTrigger').addEventListener('click', openSearch);
    $('#siteSearch').addEventListener('input', event => renderSearchResults(event.target.value));
    $('[data-dialog-close]').addEventListener('click', () => $('#searchDialog').close());
    $('#searchDialog').addEventListener('click', event => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
    });
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase('tr-TR') === 'k') { event.preventDefault(); openSearch(); }
      if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) { event.preventDefault(); openSearch(); }
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setMobileFilterOpen(false);
      }
    });
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === 'dark';
    $('#themeToggle').setAttribute('aria-pressed', String(dark));
    $('#themeToggle').setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');
    try { localStorage.setItem('it-theme',theme); } catch (_) {}
  }

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('it-theme'); } catch (_) {}
    setTheme(saved || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'));
    $('#themeToggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  }

  function setMenuOpen(open) {
    const menu = $('#menuToggle');
    $('#mainNav').classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  }

  function setMobileFilterOpen(open) {
    const toggle = $('#mobileFilterToggle');
    $('#categoryFilters').classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Konuları gizle' : 'Konuları göster';
  }

  function initNavigation() {
    $('#menuToggle').addEventListener('click', () => {
      setMenuOpen(!$('#mainNav').classList.contains('is-open'));
    });
    $$('#mainNav a').forEach(link => link.addEventListener('click', () => {
      setMenuOpen(false);
    }));
    $('#mobileFilterToggle').addEventListener('click', () => {
      setMobileFilterOpen(!$('#categoryFilters').classList.contains('is-open'));
    });
  }

  function init() {
    document.addEventListener('error', event => {
      const image = event.target;
      const slug = image?.dataset?.editorialSlug;
      if (!slug || !window.ITVisuals?.render) return;
      image.outerHTML = window.ITVisuals.render(slug, { decorative: true, instance: 'fallback-' + (++visualInstance) });
    }, true);
    initTheme();
    initNavigation();
    initViewSwitch();
    initSorting();
    initSearch();
    $('#clearFilters').addEventListener('click', resetFilters);
    $('#emptyReset').addEventListener('click', resetFilters);
    renderFilters();
    renderArticles();
    $('#year').textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
