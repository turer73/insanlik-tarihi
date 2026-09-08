// Konu merkezleri: veri odaklÄ± statik sayfa Ã¼retici.
//
// data/konu-merkezleri.json dosyasÄ±ndaki her merkez iÃ§in /konular/<slug>.html,
// merkezlerin listesi iÃ§in /konular.html Ã¼retir. Ä°Ã§erik veriden gelir; bu modÃ¼l
// yalnÄ±z HTML kurar. Kartlar ve kanÄ±t ÅŸeridi, ana sayfadaki gÃ¶rÃ¼nÃ¼mle aynÄ±dÄ±r.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ORIGIN = 'https://kanitatlasi.com';

const EV_ORDER = ['established', 'contested', 'minority', 'refuted', 'unknown', 'unmeasurable'];
const EV_TR = { established: 'yerleÅŸik', contested: 'tartÄ±ÅŸmalÄ±', minority: 'azÄ±nlÄ±k', refuted: 'Ã§Ã¼rÃ¼tÃ¼lmÃ¼ÅŸ', unknown: 'bilinmiyor', unmeasurable: 'Ã¶lÃ§Ã¼lemez' };

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function loadHubs() {
  const raw = JSON.parse(await readFile(path.join(ROOT, 'data', 'konu-merkezleri.json'), 'utf8'));
  const hubs = Object.values(raw).sort((a, b) => a.sira - b.sira);
  return hubs;
}

export async function loadEvidence() {
  const source = await readFile(path.join(ROOT, 'assets', 'evidence-data.js'), 'utf8');
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: 'assets/evidence-data.js' });
  return context.window.ITEvidence || {};
}

/** Bir yazÄ±nÄ±n ilk (birincil) merkezi; yoksa null. */
export function primaryHub(hubs, slug) {
  return hubs.find(hub => hub.dosyalar.includes(slug)) ?? null;
}

export function validateHubs(hubs, articles) {
  const slugs = new Set(articles.map(article => article.slug));
  for (const hub of hubs) {
    if (!hub.slug || !hub.baslik || !hub.kisa) throw new Error(`Merkez tanÄ±mÄ± eksik: ${hub.slug ?? 'isimsiz'}`);
    for (const dosya of hub.dosyalar) {
      if (!slugs.has(dosya)) throw new Error(`${hub.slug}.dosyalar: tanÄ±nmayan yazÄ± '${dosya}'`);
    }
    for (const tas of hub.kilometre_taslari ?? hub['kilometre-taslari']) {
      if (!slugs.has(tas.dosya)) throw new Error(`${hub.slug}.kilometre-taslari: tanÄ±nmayan yazÄ± '${tas.dosya}'`);
    }
    if (new Set(hub.dosyalar).size !== hub.dosyalar.length) throw new Error(`${hub.slug}.dosyalar: yinelenen yazÄ±`);
  }
}

function evidenceStrip(evidence, slug) {
  const e = evidence[slug];
  if (!e || !e.n) return '';
  const parts = EV_ORDER.filter(s => e.st[s]);
  const segments = parts.map(s => `<i class="ev-seg ev-${s}" style="flex:${e.st[s]}"></i>`).join('');
  const label = parts.map(s => `${e.st[s]} ${EV_TR[s]}`).join(' Â· ');
  return `<div class="evidence-strip" role="img" aria-label="DayandÄ±ÄŸÄ± ${e.n} bulgu: ${escapeHTML(label)}">
    <span class="ev-bar">${segments}</span>
    <span class="ev-count"><strong>${e.n}</strong> bulgu</span>
  </div>`;
}

function articleCard(article, evidence) {
  return `<a class="article-card has-ai-cover" href="../articles/${encodeURIComponent(article.slug)}.html" aria-label="${escapeHTML(article.title)} yazÄ±sÄ±nÄ± oku">
    <div class="article-cover">
      <img src="../${escapeHTML(article.cover)}" alt="" width="1200" height="675" decoding="async" loading="lazy">
      <span class="cover-tagline">${escapeHTML(article.tagline)}</span>
      <span class="category-chip">${escapeHTML(article.category)}</span>
    </div>
    <div class="article-body">
      <span class="dossier-number">Dosya ${String(article.no).padStart(2, '0')}</span>
      <h2 class="article-title">${escapeHTML(article.cardTitle)}</h2>
      <p class="article-summary">${escapeHTML(article.summary)}</p>
      ${evidenceStrip(evidence, article.slug)}
      <div class="article-footer">
        <span class="evidence-badge" data-tone="${escapeHTML(article.tone)}"><span>${escapeHTML(article.evidenceLabel)}</span></span>
        <span class="read-button">YazÄ±yÄ± Oku <span aria-hidden="true">â†’</span></span>
      </div>
    </div>
  </a>`;
}

function hubJsonLd(hub, articles) {
  const items = hub.dosyalar.map(slug => {
    const article = articles.find(a => a.slug === slug);
    return { '@type': 'ListItem', position: hub.dosyalar.indexOf(slug) + 1, url: `${ORIGIN}/articles/${slug}.html`, name: article?.title ?? slug };
  });
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Konu Merkezi: ${hub.baslik}`,
    url: `${ORIGIN}/konular/${hub.slug}.html`,
    inLanguage: 'tr-TR',
    description: hub.kisa,
    isPartOf: { '@type': 'WebSite', name: 'KanÄ±t AtlasÄ±', url: `${ORIGIN}/` },
    mainEntity: { '@type': 'ItemList', itemListElement: items }
  }, null, 2).replaceAll('<', '\\u003c');
}

export function renderHubPage(hub, articles, evidence) {
  const taslar = hub['kilometre-taslari'] ?? [];
  const nav = `<a href="../index.html">YazÄ±lar</a><a class="is-active" href="../konular.html" aria-current="page">Konular</a><a href="../hakkinda.html">HakkÄ±nda</a><a href="../duzeltmeler.html">DÃ¼zeltmeler</a>`;
  const head = `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#f3efe7">
  <meta name="color-scheme" content="light dark">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="description" content="${escapeHTML(hub.kisa)}">
  <link rel="canonical" href="${ORIGIN}/konular/${hub.slug}.html">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="KanÄ±t AtlasÄ±">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHTML(hub.baslik)} â€” Konu Merkezi â€” KanÄ±t AtlasÄ±">
  <meta property="og:description" content="${escapeHTML(hub.kisa)}">
  <meta property="og:url" content="${ORIGIN}/konular/${hub.slug}.html">
  <meta property="og:image" content="${ORIGIN}/assets/og-image.webp">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="675">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHTML(hub.baslik)} â€” KanÄ±t AtlasÄ±">
  <meta name="twitter:description" content="${escapeHTML(hub.kisa)}">
  <meta name="twitter:image" content="${ORIGIN}/assets/og-image.webp">
  <title>${escapeHTML(hub.baslik)} â€” Konu Merkezi â€” KanÄ±t AtlasÄ±</title>
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..800,0..100,0..1&family=Karla:wght@400..800&family=JetBrains+Mono:wght@500;600;700&display=swap">
  <link rel="stylesheet" href="../assets/styles-core.css">
  <link rel="stylesheet" href="../assets/styles-components.css">
  <link rel="stylesheet" href="../assets/hubs.css">
  <script type="application/ld+json">${hubJsonLd(hub, articles)}</script>
</head>
<body>
  <a class="skip-link" href="#main">Ä°Ã§eriÄŸe geÃ§</a>
  <header class="site-header" id="top">
    <div class="site-header__inner">
      <a class="brand" href="../index.html" aria-label="KanÄ±t AtlasÄ± ana sayfasÄ±">
        <span class="brand__mark" aria-hidden="true"><img src="../assets/logo-mark.svg" alt=""></span>
        <span class="brand__copy"><strong>KanÄ±t AtlasÄ±</strong><small>Tarihin PusulasÄ±</small></span>
      </a>
      <nav class="main-nav" aria-label="Ana menÃ¼">
        ${nav}
      </nav>
    </div>
  </header>`;
  const cards = hub.dosyalar.map(slug => {
    const article = articles.find(a => a.slug === slug);
    return article ? articleCard(article, evidence) : '';
  }).join('');
  const timeline = taslar.map(tas => {
    const article = articles.find(a => a.slug === tas.dosya);
    return `<div class="hub-milestone"><span class="hub-milestone__date">${escapeHTML(tas.tarih)}</span><div><p class="hub-milestone__event">${escapeHTML(tas.olay)}</p>${article ? `<a class="hub-milestone__file" href="../articles/${escapeHTML(article.slug)}.html">${escapeHTML(article.cardTitle)} â†’</a>` : ''}</div></div>`;
  }).join('');
  const kavramlar = (hub.kavramlar ?? []).map(k => `<div><b>${escapeHTML(k.terim)}</b><span>${escapeHTML(k.anlam)}</span></div>`).join('');
  const acik = (hub['acik-sorular'] ?? []).map(s => `<li>${escapeHTML(s)}</li>`).join('');
  const diger = [];
  return `${head}
  <main id="main" class="hub-page">
    <div class="hub-head">
      <p class="eyebrow">Konu merkezi ${String(hub.sira).padStart(2, '0')}</p>
      <h1>${escapeHTML(hub.baslik)}</h1>
      ${hub.giris.map(p => `<p>${escapeHTML(p)}</p>`).join('')}
      <nav class="hub-nav" aria-label="Merkez iÃ§i gezinme">
        <a href="#dosyalar">Dosyalar</a><a href="#kilometre">Zaman Ã§izgisi</a><a href="#kavramlar">Kavramlar</a><a href="#acik">AÃ§Ä±k sorular</a><a href="../konular.html">TÃ¼m merkezler</a>
      </nav>
    </div>
    <section id="dosyalar" class="hub-section" aria-labelledby="dosyalar-baslik">
      <h2 id="dosyalar-baslik">Bu merkezdeki dosyalar</h2>
      <div class="articles-grid hub-grid">${cards}</div>
    </section>
    <section id="kilometre" class="hub-section" aria-labelledby="kilometre-baslik">
      <h2 id="kilometre-baslik">Zaman Ã§izgisi</h2>
      <div class="hub-timeline">${timeline}</div>
    </section>
    <section id="kavramlar" class="hub-section" aria-labelledby="kavramlar-baslik">
      <h2 id="kavramlar-baslik">Temel kavramlar</h2>
      <div class="hub-glossary">${kavramlar}</div>
    </section>
    <section id="acik" class="hub-section" aria-labelledby="acik-baslik">
      <h2 id="acik-baslik">AÃ§Ä±k sorular</h2>
      <ul class="hub-questions">${acik}</ul>
    </section>
  </main>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div><strong>KanÄ±t AtlasÄ±</strong><p>Ä°nsanlÄ±k tarihine kanÄ±t, karÅŸÄ± kanÄ±t ve kaynak izlenebilirliÄŸi Ã¼zerinden bakan TÃ¼rkÃ§e araÅŸtÄ±rma arÅŸivi.</p></div>
      <p><a href="../konular.html">Konular</a> Â· <a href="../hakkinda.html">HakkÄ±nda</a> Â· <a href="../duzeltmeler.html">DÃ¼zeltmeler</a> Â· <a href="../feed.xml">RSS</a></p>
      <p>YazÄ±lar <a href="https://creativecommons.org/licenses/by/4.0/deed.tr" rel="license noopener" target="_blank">CC BY 4.0</a>, kod <a href="https://github.com/turer73/insanlik-tarihi/blob/main/LICENSE" rel="noopener" target="_blank">MIT</a>.</p>
      <span>Â© <span class="hub-year"></span> KanÄ±t AtlasÄ±</span>
    </div>
  </footer>
  <script>document.querySelectorAll('.hub-year').forEach(el => { el.textContent = new Date().getFullYear(); });</script>
</body>
</html>
`;
}

export function renderHubIndex(hubs, articles) {
  const cards = hubs.map(hub => `<a class="hub-index-card" href="konular/${escapeHTML(hub.slug)}.html">
    <span class="hub-index-card__no">Merkez ${String(hub.sira).padStart(2, '0')}</span>
    <h2>${escapeHTML(hub.baslik)}</h2>
    <p>${escapeHTML(hub.kisa)}</p>
    <span class="hub-index-card__count">${hub.dosyalar.length} dosya</span>
  </a>`).join('');
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Konu Merkezleri â€” KanÄ±t AtlasÄ±',
    url: `${ORIGIN}/konular.html`,
    inLanguage: 'tr-TR',
    description: 'KanÄ±t AtlasÄ± konu merkezleri: kayÄ±p ÅŸehirler, mitler, dinler tarihi ve iklim-uygarlÄ±k dosya kÃ¼meleri.',
    isPartOf: { '@type': 'WebSite', name: 'KanÄ±t AtlasÄ±', url: `${ORIGIN}/` }
  }, null, 2).replaceAll('<', '\\u003c');
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#f3efe7">
  <meta name="color-scheme" content="light dark">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="description" content="KanÄ±t AtlasÄ± konu merkezleri: kayÄ±p ÅŸehirler, mitler ve ortak anlatÄ±lar, dinler tarihi ve iklim-uygarlÄ±k dosya kÃ¼meleri.">
  <link rel="canonical" href="${ORIGIN}/konular.html">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="KanÄ±t AtlasÄ±">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Konu Merkezleri â€” KanÄ±t AtlasÄ±">
  <meta property="og:description" content="DÃ¶rt konu merkezi: kayÄ±p ÅŸehirler, mitler, dinler tarihi ve iklim-uygarlÄ±k.">
  <meta property="og:url" content="${ORIGIN}/konular.html">
  <meta property="og:image" content="${ORIGIN}/assets/og-image.webp">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="675">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Konu Merkezleri â€” KanÄ±t AtlasÄ±">
  <meta name="twitter:description" content="DÃ¶rt konu merkezi: kayÄ±p ÅŸehirler, mitler, dinler tarihi ve iklim-uygarlÄ±k.">
  <meta name="twitter:image" content="${ORIGIN}/assets/og-image.webp">
  <title>Konu Merkezleri â€” KanÄ±t AtlasÄ±</title>
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..800,0..100,0..1&family=Karla:wght@400..800&family=JetBrains+Mono:wght@500;600;700&display=swap">
  <link rel="stylesheet" href="assets/styles-core.css">
  <link rel="stylesheet" href="assets/styles-components.css">
  <link rel="stylesheet" href="assets/hubs.css">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <a class="skip-link" href="#main">Ä°Ã§eriÄŸe geÃ§</a>
  <header class="site-header" id="top">
    <div class="site-header__inner">
      <a class="brand" href="index.html" aria-label="KanÄ±t AtlasÄ± ana sayfasÄ±">
        <span class="brand__mark" aria-hidden="true"><img src="assets/logo-mark.svg" alt=""></span>
        <span class="brand__copy"><strong>KanÄ±t AtlasÄ±</strong><small>Tarihin PusulasÄ±</small></span>
      </a>
      <nav class="main-nav" aria-label="Ana menÃ¼">
        <a href="index.html">YazÄ±lar</a><a class="is-active" href="konular.html" aria-current="page">Konular</a><a href="hakkinda.html">HakkÄ±nda</a><a href="duzeltmeler.html">DÃ¼zeltmeler</a>
      </nav>
    </div>
  </header>
  <main id="main" class="hub-index">
    <div class="hub-index__head">
      <p class="eyebrow">Yol haritasÄ±</p>
      <h1>Konu merkezleri</h1>
      <p>Tek tek dosyalar bir konunun cÃ¼mleleri; merkezler ise o konunun bÃ¼tÃ¼nÃ¼. Her merkez giriÅŸ yazÄ±sÄ±nÄ±, zaman Ã§izgisini, temel kavramlarÄ±, ilgili dosyalarÄ± ve aÃ§Ä±k sorularÄ± bir arada sunar.</p>
    </div>
    <div class="hub-index__grid">${cards}</div>
  </main>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div><strong>KanÄ±t AtlasÄ±</strong><p>Ä°nsanlÄ±k tarihine kanÄ±t, karÅŸÄ± kanÄ±t ve kaynak izlenebilirliÄŸi Ã¼zerinden bakan TÃ¼rkÃ§e araÅŸtÄ±rma arÅŸivi.</p></div>
      <p><a href="hakkinda.html">HakkÄ±nda</a> Â· <a href="duzeltmeler.html">DÃ¼zeltmeler</a> Â· <a href="feed.xml">RSS</a></p>
      <p>YazÄ±lar <a href="https://creativecommons.org/licenses/by/4.0/deed.tr" rel="license noopener" target="_blank">CC BY 4.0</a>, kod <a href="https://github.com/turer73/insanlik-tarihi/blob/main/LICENSE" rel="noopener" target="_blank">MIT</a>.</p>
      <span>Â© <span class="hub-year"></span> KanÄ±t AtlasÄ±</span>
    </div>
  </footer>
  <script>document.querySelectorAll('.hub-year').forEach(el => { el.textContent = new Date().getFullYear(); });</script>
</body>
</html>
`;
}
