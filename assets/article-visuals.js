(() => {
  'use strict';
  if (window.__KA_ARTICLE_VISUALS__) return;
  window.__KA_ARTICLE_VISUALS__ = true;

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
    'Mit ve Sicil':'mit-ve-sicil','Gökteki Ayı':'gokteki-ayi','Geç Kalan Haberci':'gec-kalan-haberci',
    'Kendi Kanıtı':'kendi-kaniti','Çalınan Ateş':'calinan-ates','Herkesin Saati':'herkesin-saati',
    'Yılın İki Kapısı':'yilin-iki-kapisi'
  };

  function getSlug() {
    const requested = new URLSearchParams(location.search).get('slug');
    if (requested && window.KAEditorialMeta?.[requested]) return requested;
    const file = decodeURIComponent(location.pathname.split('/').pop() || '').replace(/\.html?$/i, '');
    if (window.KAEditorialMeta?.[file]) return file;
    const heading = document.querySelector('h1')?.textContent?.trim();
    if (heading && TITLE_TO_SLUG[heading]) return TITLE_TO_SLUG[heading];
    const cleanTitle = document.title.replace(/\s+[—|-]\s+Kanıt Atlası.*$/i, '').trim();
    return TITLE_TO_SLUG[cleanTitle] || file || 'generic';
  }

  function assetPrefix() {
    return /(?:^|\/)articles\//i.test(location.pathname) ? '../assets/' : 'assets/';
  }

  function imageSource(slug) {
    return `${assetPrefix()}editorial-covers/${encodeURIComponent(slug)}.webp`;
  }

  function metaFor(slug) {
    const heading = document.querySelector('h1')?.textContent?.trim() || document.title;
    return window.KAEditorialMeta?.[slug] || {
      alt: `${heading} için temsili editoryal illüstrasyon`,
      objectPosition: '50% 50%'
    };
  }

  function editorialImage(slug, context, decorative = false) {
    const meta = metaFor(slug);
    const eager = context === 'hero';
    const alt = decorative ? '' : meta.alt;
    return `<img class="it-editorial-image" src="${imageSource(slug)}" alt="${alt.replace(/"/g,'&quot;')}" width="1200" height="675" style="--it-object-position:${meta.objectPosition}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  }

  function addBackLink() {
    if (document.querySelector('.it-archive-back')) return;
    const link = document.createElement('a');
    link.className = 'it-archive-back';
    link.href = /(?:^|\/)reader\.html$/i.test(location.pathname) ? 'index.html' : '../index.html';
    link.setAttribute('aria-label', 'Kanıt Atlası araştırma arşivine dön');
    link.innerHTML = `<img src="${assetPrefix()}logo-mark.svg" alt="" width="24" height="24"><span>Kanıt Atlası</span>`;
    document.body.prepend(link);
  }

  function addHeroVisual(slug) {
    const host = document.querySelector('.hero__inner, .hero__in, .hero__grid, .hero .wrap, header.hero, main');
    if (!host || host.querySelector('.it-story-visual')) return;
    const meta = metaFor(slug);
    const figure = document.createElement('figure');
    figure.className = 'it-story-visual';
    figure.innerHTML = `<div class="it-story-visual__frame">${editorialImage(slug,'hero')}</div>
      <figcaption><b>Temsili editoryal illüstrasyon</b><span>${meta.alt}. Tarihsel rekonstrüksiyon, arkeolojik bulgu veya birincil kanıt değildir.</span></figcaption>`;
    const lede = host.querySelector('.hero__lede, .lede') || host.querySelector('h1');
    if (lede?.nextSibling) lede.parentNode.insertBefore(figure, lede.nextSibling);
    else host.appendChild(figure);

    const disclaimer = document.createElement('p');
    disclaimer.className = 'it-visual-disclaimer';
    disclaimer.textContent = 'Bu görsel, yazının konusunu atmosfer ve bağlamla desteklemek için üretilmiştir. Metindeki iddiaların kanıtı olarak kullanılmaz.';
    figure.insertAdjacentElement('afterend', disclaimer);
  }

  function addSectionVisuals(slug) {
    const sections = [...document.querySelectorAll('main section, body > section')]
      .filter(section => !section.closest('header') && !section.closest('.it-story-visual'));
    if (sections.length < 3) return;
    const meta = metaFor(slug);
    const targets = sections.length > 7 ? [2, Math.floor(sections.length * .68)] : [2];
    const labels = ['Bağlamı görünür kıl', 'Kanıt zincirine yeniden dön'];
    targets.forEach((index, order) => {
      const target = sections[Math.min(index, sections.length - 1)];
      if (!target || target.previousElementSibling?.classList.contains('it-section-visual')) return;
      const visual = document.createElement('figure');
      visual.className = `it-section-visual it-section-visual--${order + 1}`;
      visual.setAttribute('aria-label', `${meta.alt}; temsili editoryal görsel`);
      visual.style.setProperty('--it-crop-scale', order ? '1.12' : '1.04');
      visual.innerHTML = `<div class="it-section-visual__frame">${editorialImage(slug,`divider-${order}`,true)}</div>
        <figcaption class="it-section-visual__label"><b>Kanıt Atlası</b><span>${labels[order] || labels[0]}</span></figcaption>`;
      target.parentNode.insertBefore(visual, target);
    });
  }

  function addImageLoadState() {
    document.addEventListener('error', event => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || !image.classList.contains('it-editorial-image')) return;
      const frame = image.closest('.it-story-visual__frame, .it-section-visual__frame');
      const fallback = window.ITVisuals?.render?.(getSlug(), { decorative: true, instance: 'fallback-' + Math.random().toString(36).slice(2) });
      if (fallback) image.outerHTML = fallback;
      else frame?.classList.add('is-image-missing');
    }, true);
  }

  function init() {
    const slug = getSlug();
    document.documentElement.dataset.articleSlug = slug;
    if (!document.title.includes('Kanıt Atlası')) document.title = `${document.title} — Kanıt Atlası`;
    addImageLoadState();
    addBackLink();
    addHeroVisual(slug);
    addSectionVisuals(slug);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
