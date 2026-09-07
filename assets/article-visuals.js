(() => {
  'use strict';
  if (window.__IT_ARTICLE_VISUALS__) return;
  window.__IT_ARTICLE_VISUALS__ = true;

  const TITLE_TO_SLUG = {
    'Ölü Deniz Parşömenleri':'olu-deniz-parsomenleri','Tufan Bilmecesi':'tufan-bilmecesi',
    'Hatırlamadığımız Felaketler':'hatirlamadigimiz-felaketler','Babil: Şehir ve Sembol':'babil',
    'Aynı Cümlede Anılanlar':'ayni-cumlede','Petra: Görünmeyen Şehir':'petra',
    'Şuşter: Aktarımın Kanıtı':'shushtar','Stonehenge: Taşın Yolu':'stonehenge',
    'Sümer: Kilden Çıkan Arşiv':'sumer','Angkor: Çöküş Anlatısının Çöküşü':'angkor',
    'Taş Tepeler: Yüzde Beş':'tas-tepeler','Machu Picchu: Dört Yanlış':'machu-picchu',
    'Chichén Itzá: Test Edilebilen ve Edilemeyen':'chichen-itza','Kapadokya: Ölçülmemiş Harika':'kapadokya',
    'Persepolis: Arşiv Konuşunca':'persepolis','İskenderiye: Yanmadı, Kopyalanmadı':'iskenderiye',
    'Milanković Döngüleri':'milankovic','Roma: Bakılan Miras':'roma-etki',
    'Hristiyanlık ve Roma: Kim Kimi Dönüştürdü':'roma-hristiyanlik','Kanıt Ne Kadar Uzakta':'isa-tarihsellik',
    'Mit ve Sicil':'mit-ve-sicil','Gökteki Ayı':'gokteki-ayi','Geç Kalan Haberci':'gec-kalan-haberci','Kendi Kanıtı':'kendi-kaniti',
    'Çalınan Ateş':'calinan-ates','Herkesin Saati':'herkesin-saati','Yılın İki Kapısı':'yilin-iki-kapisi'
  };

  function getSlug() {
    const file = decodeURIComponent(location.pathname.split('/').pop() || '').replace(/\.html?$/i, '');
    if (window.ITVisuals?.meta?.[file]) return file;
    const heading = document.querySelector('h1')?.textContent?.trim();
    if (heading && TITLE_TO_SLUG[heading]) return TITLE_TO_SLUG[heading];
    const title = document.title.trim();
    return TITLE_TO_SLUG[title] || file || 'generic';
  }

  function render(slug, decorative, instance) {
    return window.ITVisuals?.render?.(slug, {
      title: document.querySelector('h1')?.textContent?.trim() || document.title,
      decorative,
      instance
    }) || '';
  }

  function addBackLink() {
    if (document.querySelector('.it-archive-back')) return;
    const link = document.createElement('a');
    link.className = 'it-archive-back';
    link.href = /(?:^|\/)reader\.html$/i.test(location.pathname) ? 'index.html' : '../index.html';
    link.innerHTML = '<span aria-hidden="true">←</span> Araştırma arşivi';
    document.body.prepend(link);
  }

  function addHeroVisual(slug) {
    const host = document.querySelector('.hero__inner, .hero .wrap, header.hero, main');
    if (!host || host.querySelector('.it-story-visual')) return;
    const meta = window.ITVisuals?.meta?.[slug];
    const figure = document.createElement('figure');
    figure.className = 'it-story-visual';
    figure.innerHTML = `<div class="it-story-visual__frame">${render(slug, false, 'article-hero')}</div>
      <figcaption><b>Editoryal illüstrasyon</b><span>${meta?.label || 'Araştırma · kanıt · bağlam'} — tarihsel rekonstrüksiyon veya birincil kanıt değildir.</span></figcaption>`;
    const lede = host.querySelector('.hero__lede') || host.querySelector('.lede') || host.querySelector('h1');
    if (lede?.nextSibling) lede.parentNode.insertBefore(figure, lede.nextSibling);
    else host.appendChild(figure);

    const disclaimer = document.createElement('p');
    disclaimer.className = 'it-visual-disclaimer';
    disclaimer.textContent = 'Bu sayfadaki çizimler okuma akışını destekleyen temsili editoryal görsellerdir; metinde tartışılan arkeolojik bulgu, belge veya ölçümün kendisi değildir.';
    figure.insertAdjacentElement('afterend', disclaimer);
  }

  function addSectionVisuals(slug) {
    const sections = [...document.querySelectorAll('main section, body > section')].filter(section => !section.closest('header'));
    if (sections.length < 3) return;
    const meta = window.ITVisuals?.meta?.[slug];
    const targets = sections.length > 6 ? [2, Math.floor(sections.length * .68)] : [2];
    const labels = ['Bağlamı görünür kıl', 'Kanıt zincirini yeniden izle'];
    targets.forEach((index, order) => {
      const target = sections[Math.min(index, sections.length - 1)];
      if (!target || target.previousElementSibling?.classList.contains('it-section-visual')) return;
      const visual = document.createElement('div');
      visual.className = 'it-section-visual';
      visual.setAttribute('aria-hidden', 'true');
      visual.style.setProperty('--it-crop-y', order ? '-3%' : '3%');
      visual.innerHTML = `<div class="it-section-visual__frame">${render(slug, true, `article-divider-${order}`)}</div>
        <div class="it-section-visual__label"><b>${meta?.label || 'Araştırma dosyası'}</b><span>${labels[order] || labels[0]}</span></div>`;
      target.parentNode.insertBefore(visual, target);
    });
  }

  function init() {
    if (!window.ITVisuals) return;
    const slug = getSlug();
    document.documentElement.dataset.articleSlug = slug;
    addBackLink();
    addHeroVisual(slug);
    addSectionVisuals(slug);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
