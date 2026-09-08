import { access, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { tarihler, sonDegisiklik, ilkYayin, enYeni } from './lib/lastmod.mjs';
import { renderEvidenceIntro, renderEvidenceDossier } from './lib/evidence-dossier.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'site');
const ORIGIN = 'https://kanitatlasi.com';
// YEREL tarih, UTC değil: git'in %cs biçimi commit'i yapanın saat dilimindeki
// günü verir. UTC kullanmak, gün dönümüne yakın saatlerde yerel derleme ile
// CI'nin bir gün kaymasına yol açardı.
const TODAY = ((d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)(new Date());

// Dosya başına gerçek tarihler. Ayrıntı ve neden için scripts/lib/lastmod.mjs.
const TARIH = tarihler(ROOT, TODAY);

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

async function exists(target) {
  try { await access(target); return true; } catch { return false; }
}

async function copyRequired(relative) {
  const source = path.join(ROOT, relative);
  if (!(await exists(source))) throw new Error(`Gerekli yayın girdisi bulunamadı: ${relative}`);
  const destination = path.join(OUT, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
}

async function loadArticles() {
  const source = await readFile(path.join(ROOT, 'assets', 'articles-data.js'), 'utf8');
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: 'assets/articles-data.js' });
  const articles = context.window.ITArticles;
  if (!Array.isArray(articles) || articles.length === 0) {
    throw new Error('assets/articles-data.js içinde yazı envanteri bulunamadı.');
  }
  return articles;
}

function addOrReplace(source, pattern, replacement, label) {
  if (!pattern.test(source)) throw new Error(`Dönüşüm hedefi bulunamadı: ${label}`);
  return source.replace(pattern, replacement);
}

function brandIndex(source, articles) {
  let html = source;
  const meta = `  <meta name="theme-color" content="#f3efe7">
  <meta name="color-scheme" content="light dark">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="author" content="Kanıt Atlası">
  <meta name="description" content="Kanıt Atlası; insanlık tarihini arkeoloji, metin, bilim ve karşı kanıt üzerinden inceleyen Türkçe araştırma arşividir.">
  <link rel="canonical" href="${ORIGIN}/">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Kanıt Atlası">
  <meta property="og:title" content="Kanıt Atlası — İnsanlık Tarihi Araştırma Arşivi">
  <meta property="og:description" content="Geçmişi değil, kanıtı izleyin. Arkeoloji, tarih, bilim ve inanç üzerine kaynak odaklı araştırma dosyaları.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${ORIGIN}/">
  <meta property="og:image" content="${ORIGIN}/assets/og-image.webp">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="675">
  <meta property="og:image:alt" content="Kanıt Atlası — İnsanlık Tarihi Araştırma Arşivi">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Kanıt Atlası — İnsanlık Tarihi Araştırma Arşivi">
  <meta name="twitter:description" content="Geçmişi değil, kanıtı izleyin.">
  <meta name="twitter:image" content="${ORIGIN}/assets/og-image.webp">
  <title>Kanıt Atlası — İnsanlık Tarihi Araştırma Arşivi</title>
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Kanıt Atlası yazıları" href="feed.xml">`;

  html = addOrReplace(
    html,
    /  <meta name="theme-color"[\s\S]*?  <link rel="icon"[^\n]*>/,
    meta,
    'ana sayfa meta bloğu'
  );
  html = html
    .replaceAll('aria-label="İnsanlık Tarihi ana sayfası"', 'aria-label="Kanıt Atlası ana sayfası"')
    .replace('<span>İT</span>', '<span>KA</span>')
    .replace('<strong>İnsanlık Tarihi</strong>\n          <small>Kanıt odaklı araştırma arşivi</small>', '<strong>Kanıt Atlası</strong>\n          <small>İnsanlık tarihi araştırma arşivi</small>')
    .replace('<a href="index.html">Ana Sayfa</a>\n        <a class="is-active" href="#main" aria-current="page">Yazılar</a>', '<a href="#top">Ana Sayfa</a>\n        <a class="is-active" href="#yazilar" aria-current="page">Yazılar</a>')
    .replace('<section class="archive-content" aria-labelledby="archiveTitle">', '<section class="archive-content" id="yazilar" aria-labelledby="archiveTitle">')
    .replace('<div><strong>İnsanlık Tarihi</strong><p>Kanıt odaklı, kaynak izlenebilirliği yüksek Türkçe araştırma arşivi.</p></div>', '<div><strong>Kanıt Atlası</strong><p>İnsanlık tarihine kanıt, karşı kanıt ve kaynak izlenebilirliği üzerinden bakan Türkçe araştırma arşivi. <a href="feed.xml">RSS</a></p></div>');

  const noscript = `<noscript>
          <section class="noscript-archive" aria-labelledby="noscriptTitle">
            <h2 id="noscriptTitle">Kanıt Atlası yazıları</h2>
            <p>Filtreleme ve görsel kartlar için JavaScript gerekir. Bütün araştırma dosyalarına aşağıdaki bağlantılardan ulaşabilirsiniz.</p>
            <ul>
${[...articles].sort((a, b) => a.no - b.no).map(article => `              <li><a href="articles/${encodeURIComponent(article.slug)}.html">${String(article.no).padStart(2, '0')} · ${escapeHtml(article.cardTitle)}</a></li>`).join('\n')}
            </ul>
          </section>
        </noscript>`;
  html = html.replace('<div class="articles-grid" id="articlesGrid" data-view="grid"></div>', '<div class="articles-grid" id="articlesGrid" data-view="grid"></div>\n\n        ' + noscript);

  const jsonLd = `  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kanıt Atlası',
    alternateName: 'İnsanlık Tarihi Araştırma Arşivi',
    url: `${ORIGIN}/`,
    description: 'Arkeoloji, tarih, bilim ve inanç üzerine kanıt, karşı kanıt ve kaynak izlenebilirliği odaklı Türkçe araştırma arşivi.',
    inLanguage: 'tr-TR',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Kanıt Atlası',
      url: `${ORIGIN}/`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${ORIGIN}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  }, null, 2).replaceAll('<', '\\u003c')}
  </script>\n`;
  html = html.replace('</head>', `${jsonLd}</head>`);

  // Üretimde kart görselleri gerçek WebP dosyalarından gelir; base64 veri betikleri yüklenmez.
  html = html.replace(/\n  <script src="assets\/covers-data\/[^"]+\.js"><\/script>/g, '');
  return html;
}

function brandApp(source) {
  return source
    .replace("const source = window.ITCoverData?.[article.slug] || article.cover;", "const source = article.cover;")
    .replaceAll('href="reader.html?slug=${encodeURIComponent(article.slug)}"', 'href="articles/${encodeURIComponent(article.slug)}.html"')
    .replaceAll("localStorage.setItem('it-view'", "localStorage.setItem('ka-view'")
    .replaceAll("localStorage.getItem('it-view')", "localStorage.getItem('ka-view')")
    .replaceAll("localStorage.setItem('it-theme'", "localStorage.setItem('ka-theme'")
    .replaceAll("localStorage.getItem('it-theme')", "localStorage.getItem('ka-theme')")
    .replace(
      "$('#themeToggle').setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');",
      "$('#themeToggle').setAttribute('aria-label', dark ? 'Açık temaya geç' : 'Koyu temaya geç');\n    const themeMeta = document.querySelector('meta[name=\\\"theme-color\\\"]');\n    if (themeMeta) themeMeta.content = dark ? '#111713' : '#f3efe7';"
    )
    .replace(
      "    renderArticles();\n    $('#year').textContent = new Date().getFullYear();",
      "    renderArticles();\n    const initialQuery = new URLSearchParams(location.search).get('q');\n    if (initialQuery) {\n      openSearch();\n      $('#siteSearch').value = initialQuery;\n      renderSearchResults(initialQuery);\n    }\n    $('#year').textContent = new Date().getFullYear();"
    );
}

function articleJsonLd(article) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    inLanguage: 'tr-TR',
    mainEntityOfPage: `${ORIGIN}/articles/${article.slug}.html`,
    isPartOf: { '@type': 'WebSite', name: 'Kanıt Atlası', url: `${ORIGIN}/` },
    publisher: {
      '@type': 'Organization',
      name: 'Kanıt Atlası',
      url: `${ORIGIN}/`,
      logo: { '@type': 'ImageObject', url: `${ORIGIN}/favicon.svg` }
    },
    image: `${ORIGIN}/${article.cover}`,
    articleSection: article.category,
    keywords: article.tags.join(', ')
  }).replaceAll('<', '\\u003c');
}

function wrapArticle(source, article, pilot = null) {
  const bodyMatch = source.match(/<(?:header|main|body)\b/i);
  if (!bodyMatch || bodyMatch.index == null) throw new Error(`Yazı gövdesi ayırt edilemedi: ${article.slug}`);

  let headFragment = source.slice(0, bodyMatch.index).trim();
  let bodyFragment = source.slice(bodyMatch.index).trim();
  headFragment = headFragment
    .replace(/<!doctype[^>]*>/gi, '')
    .replace(/<\/?(?:html|head)[^>]*>/gi, '')
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(article.title)} — Kanıt Atlası</title>`)
    .trim();
  bodyFragment = bodyFragment
    // Fragment IDs may start with a digit (for example #476); they are not CSS selectors.
    .replaceAll("document.querySelector(a.getAttribute('href'))", "document.getElementById(a.getAttribute('href').slice(1))")
    .replace(/<\/?body[^>]*>/gi, '')
    .replace(/<\/html>\s*$/i, '')
    .trim();

  if (pilot) {
    if (!bodyFragment.includes('</header>') || !bodyFragment.includes('<main>') || !bodyFragment.includes('</main>')) {
      throw new Error(`Pilot yazı yapısı beklenen biçimde değil: ${article.slug}`);
    }
    bodyFragment = bodyFragment
      .replace('</header>', `</header>\n${renderEvidenceIntro(article, pilot.findings, pilot.summary)}`)
      .replace('<main>', '<main id="ka-anlati">')
      .replace('</main>', `${renderEvidenceDossier(article, pilot.findings)}\n</main>`);
  }

  const canonical = `${ORIGIN}/articles/${article.slug}.html`;
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#f3efe7">
  <meta name="color-scheme" content="light dark">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="description" content="${escapeHtml(article.summary)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Kanıt Atlası">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(article.title)} — Kanıt Atlası">
  <meta property="og:description" content="${escapeHtml(article.summary)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ORIGIN}/${article.cover}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="675">
  <meta property="og:image:alt" content="${escapeHtml(article.title)} — temsili editoryal illüstrasyon">
  <meta name="twitter:image:alt" content="${escapeHtml(article.title)} — temsili editoryal illüstrasyon">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(article.title)} — Kanıt Atlası">
  <meta name="twitter:description" content="${escapeHtml(article.summary)}">
  <meta name="twitter:image" content="${ORIGIN}/${article.cover}">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="../site.webmanifest">
${headFragment}
  <link rel="stylesheet" href="../assets/article-visuals.css">
${pilot ? '  <link rel="stylesheet" href="../assets/evidence-dossier.css">' : ''}
  <script type="application/ld+json">${articleJsonLd(article)}</script>
</head>
<body>
${bodyFragment}
  <script src="../assets/visuals-scenes-1.js"></script>
  <script src="../assets/visuals-scenes-2.js"></script>
  <script src="../assets/visuals-scenes-3.js"></script>
  <script src="../assets/visuals-scenes-4.js"></script>
  <script src="../assets/visuals.js"></script>
  <script src="../assets/editorial-meta.js"></script>
  <script src="../assets/article-visuals.js"></script>
</body>
</html>\n`;
}

async function extractCoverAssets() {
  const articles = await loadArticles();
  for (const article of articles) {
    if (!(await exists(path.join(OUT, article.cover)))) throw new Error('Editoryal kapak eksik: ' + article.slug);
  }
  await rm(path.join(OUT, 'assets', 'covers-data'), { recursive: true, force: true });
}

function manifest() {
  return JSON.stringify({
    name: 'Kanıt Atlası — İnsanlık Tarihi Araştırma Arşivi',
    short_name: 'Kanıt Atlası',
    description: 'Arkeoloji, tarih, bilim ve inanç üzerine kanıt odaklı Türkçe araştırma arşivi.',
    lang: 'tr-TR', start_url: '/', scope: '/', display: 'standalone',
    background_color: '#f3efe7', theme_color: '#165f50',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
  }, null, 2) + '\n';
}

function legacyReader() {
  const slugs = [];
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta name="theme-color" content="#f3efe7"><title>Yazıya yönlendiriliyor — Kanıt Atlası</title><style>:root{font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:light dark}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f2efe7;color:#171a18}.loader{width:min(520px,calc(100% - 2rem));padding:2rem;border:1px solid #d8d4ca;border-radius:20px;background:#fbf9f3}.loader b{display:block;font:600 2rem Georgia,serif;margin-bottom:.6rem}.loader p{margin:0;color:#59605d}.error a{color:#0d5c4f;font-weight:700}@media(prefers-color-scheme:dark){body{background:#111713;color:#eff3ee}.loader{background:#18201c;border-color:#334039}.loader p{color:#abb5af}}</style></head><body><main class="loader" id="loader" aria-live="polite"><b>Yazıya yönlendiriliyor…</b><p>Kanıt Atlası araştırma dosyası açılıyor.</p></main><script>(()=>{const slug=new URLSearchParams(location.search).get('slug')||'';if(/^[a-z0-9-]+$/.test(slug)){location.replace('articles/'+encodeURIComponent(slug)+'.html');return}document.getElementById('loader').innerHTML='<b>Yazı bulunamadı.</b><p>Bağlantı eksik veya geçersiz. <a href="index.html">Kanıt Atlası arşivine dönün</a>.</p>';document.getElementById('loader').classList.add('error')})();</script></body></html>`;
}

function notFoundPage() {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><meta name="theme-color" content="#f3efe7"><title>Sayfa bulunamadı — Kanıt Atlası</title><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>:root{--bg:#f3efe7;--surface:#fbf9f3;--ink:#171a18;--muted:#606762;--green:#165f50;--line:#d8d3c8;color-scheme:light dark}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:1.2rem;background:radial-gradient(circle at 80% 10%,#e3ece7 0,transparent 35%),var(--bg);color:var(--ink);font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}main{width:min(760px,100%);padding:clamp(2rem,7vw,5rem);border:1px solid var(--line);border-radius:24px;background:var(--surface);box-shadow:0 24px 80px rgba(25,33,30,.1)}.mark{width:72px;height:72px;border:2px solid var(--green);border-radius:50%;display:grid;place-items:center;color:var(--green);font:700 1.25rem Georgia,serif;box-shadow:inset 0 0 0 9px var(--surface),inset 0 0 0 11px var(--green)}.code{margin:2.2rem 0 .2rem;color:var(--green);font:700 .78rem ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.14em;text-transform:uppercase}h1{margin:0;font:650 clamp(2.3rem,7vw,4.7rem)/.98 Georgia,serif;letter-spacing:-.04em}p{max-width:55ch;color:var(--muted);font-size:1.08rem;line-height:1.65}nav{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1.7rem}a{padding:.75rem 1rem;border:1px solid var(--line);border-radius:999px;color:var(--ink);font-weight:700;text-decoration:none}a:first-child{background:var(--green);border-color:var(--green);color:white}@media(prefers-color-scheme:dark){:root{--bg:#111713;--surface:#18201c;--ink:#eef3ef;--muted:#aeb9b3;--line:#334039;--green:#76b7a5}}</style></head><body><main><div class="mark" aria-hidden="true">KA</div><p class="code">404 · Kayıt bulunamadı</p><h1>Bu iz, arşivde yok.</h1><p>Bağlantı değişmiş, yazı taşınmış veya adres yanlış yazılmış olabilir. Araştırma arşivine dönerek kanıt zincirini yeniden izleyebilirsiniz.</p><nav aria-label="Yönlendirme"><a href="/">Ana sayfaya dön</a><a href="/dist/zaman-cizelgesi.html">Zaman çizelgesi</a><a href="/dist/bulgu-veri-tabani.html">Veri tabanı</a></nav></main></body></html>`;
}

function sitemap(articles, pilotSummaries) {
  // Ana sayfa listeyi gösterir: yazılardan biri veya sayfanın kendisi
  // değiştiyse ana sayfa da değişmiştir.
  const anaSayfa = enYeni(TARIH, [
    'index.html',
    'data/articles.json',
    'assets/app.js',
    'assets/styles-core.css',
    'assets/styles-components.css',
    ...articles.map(article => `articles/${article.slug}.html`)
  ]);

  const urls = [
    { loc: `${ORIGIN}/`, priority: '1.0', changefreq: 'weekly', lastmod: anaSayfa },
    ...articles.map(article => ({
      loc: `${ORIGIN}/articles/${article.slug}.html`,
      priority: article.featured ? '0.9' : '0.7',
      changefreq: 'monthly',
      lastmod: pilotSummaries[article.slug] ? enYeni(TARIH, [`articles/${article.slug}.html`, 'data/reading-pilot.json']) : sonDegisiklik(TARIH, `articles/${article.slug}.html`)
    })),
    { loc: `${ORIGIN}/dist/zaman-cizelgesi.html`, priority: '0.8', changefreq: 'monthly', lastmod: sonDegisiklik(TARIH, 'dist/zaman-cizelgesi.html') },
    { loc: `${ORIGIN}/dist/bulgu-veri-tabani.html`, priority: '0.8', changefreq: 'weekly', lastmod: sonDegisiklik(TARIH, 'dist/bulgu-veri-tabani.html') },
    { loc: `${ORIGIN}/dist/kanit-denetimi.html`, priority: '0.7', changefreq: 'weekly', lastmod: sonDegisiklik(TARIH, 'dist/kanit-denetimi.html') }
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(item => `  <url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod><changefreq>${item.changefreq}</changefreq><priority>${item.priority}</priority></url>`).join('\n')}\n</urlset>\n`;
}

// RSS tarihleri RFC-822 ister; elimizdeki YYYY-MM-DD gün hassasiyetinde.
const rfc822 = gun => new Date(`${gun}T00:00:00Z`).toUTCString();

function rss(articles) {
  // lastBuildDate "kanalın içeriği en son ne zaman değişti" demektir, "bu
  // dosya ne zaman üretildi" değil. Derleme saatini yazmak, sitemap'teki
  // lastmod hatasının aynısıydı: her derlemede yeni bir tarih, hiçbir sinyal.
  const enSonDegisiklik = enYeni(TARIH, articles.map(article => `articles/${article.slug}.html`));

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Kanıt Atlası</title><link>${ORIGIN}/</link><description>İnsanlık tarihi, arkeoloji, bilim ve inanç üzerine kanıt odaklı Türkçe araştırma dosyaları.</description><language>tr-TR</language><lastBuildDate>${rfc822(enSonDegisiklik)}</lastBuildDate><atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml"/>${[...articles].sort((a,b)=>b.no-a.no).map(article => `<item><title>${escapeHtml(article.title)}</title><link>${ORIGIN}/articles/${article.slug}.html</link><guid isPermaLink="true">${ORIGIN}/articles/${article.slug}.html</guid><pubDate>${rfc822(ilkYayin(TARIH, `articles/${article.slug}.html`))}</pubDate><category>${escapeHtml(article.category)}</category><description>${escapeHtml(article.summary)}</description></item>`).join('')}</channel></rss>\n`;
}

async function brandToolPages() {
  const directory = path.join(OUT, 'dist');
  if (!(await exists(directory))) return;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const file = path.join(directory, entry.name);
    let content = await readFile(file, 'utf8');
    content = content
      .replace('</head>', '<link rel="icon" href="../favicon.svg" type="image/svg+xml"></head>')
      .replaceAll('İnsanlık Tarihi bulgularını', 'Kanıt Atlası bulgularını')
      .replaceAll('İnsanlık Tarihi bulgularında', 'Kanıt Atlası bulgularında')
      .replaceAll('· İnsanlık Tarihi', '· Kanıt Atlası')
      .replaceAll('<title>İnsanlık Tarihi</title>', '<title>Kanıt Atlası</title>');
    await writeFile(file, content);
  }
}

// A new HTML response must not reuse JS/CSS from an older deployment in a
// returning visitor's cache. Hash the final output, including build transforms.
async function versionPageAssets(directory = OUT) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'assets') await versionPageAssets(file);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    let html = await readFile(file, 'utf8');
    const references = [...html.matchAll(/\b(?:src|href)="([^"?#]+\.(?:js|css|svg))"/g)];
    for (const [, url] of references) {
      if (/^(?:[a-z]+:|\/\/)/i.test(url)) continue;
      const asset = url.startsWith('/') ? path.resolve(OUT, '.' + url) : path.resolve(path.dirname(file), url);
      if (!asset.startsWith(OUT + path.sep)) throw new Error(`Yayın dışı varlık: ${url}`);
      const version = createHash('sha256').update(await readFile(asset)).digest('hex').slice(0, 16);
      html = html.replaceAll(`"${url}"`, `"${url}?v=${version}"`);
    }
    await writeFile(file, html);
  }
}

async function main() {
  const articles = await loadArticles();
  const pilotSummaries = JSON.parse(await readFile(path.join(ROOT, 'data', 'reading-pilot.json'), 'utf8'));
  const findings = JSON.parse(await readFile(path.join(ROOT, 'data', 'findings.bundle.json'), 'utf8'));
  const articleNames = new Set((await readdir(path.join(ROOT, 'articles'))).filter(name => name.endsWith('.html')).map(name => name.slice(0, -5)));
  const missing = articles.filter(article => !articleNames.has(article.slug));
  if (missing.length) throw new Error(`Kaynak HTML dosyası eksik: ${missing.map(item => item.slug).join(', ')}`);

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  await copyRequired('assets');
  await copyRequired('dist');
  await extractCoverAssets();

  const index = brandIndex(await readFile(path.join(ROOT, 'index.html'), 'utf8'), articles);
  await writeFile(path.join(OUT, 'index.html'), index);
  await writeFile(path.join(OUT, 'assets', 'app.js'), brandApp(await readFile(path.join(ROOT, 'assets', 'app.js'), 'utf8')));

  let visualCss = await readFile(path.join(ROOT, 'assets', 'article-visuals.css'), 'utf8');
  visualCss = visualCss.replace('/* İnsanlık Tarihi — ortak makale görsel katmanı */', '/* Kanıt Atlası — ortak makale görsel katmanı */\nhtml,body{margin:0}');
  await writeFile(path.join(OUT, 'assets', 'article-visuals.css'), visualCss);

  let visualJs = await readFile(path.join(ROOT, 'assets', 'article-visuals.js'), 'utf8');
  visualJs = visualJs
    .replace("link.innerHTML = '<span aria-hidden=\"true\">←</span> Araştırma arşivi';", "link.setAttribute('aria-label', 'Kanıt Atlası araştırma arşivine dön');\n    link.innerHTML = '<span aria-hidden=\"true\">←</span> Kanıt Atlası';")
    .replace('    document.documentElement.dataset.articleSlug = slug;\n    addBackLink();', "    document.documentElement.dataset.articleSlug = slug;\n    if (!document.title.includes('Kanıt Atlası')) document.title = `${document.title} — Kanıt Atlası`;\n    addBackLink();");
  await writeFile(path.join(OUT, 'assets', 'article-visuals.js'), visualJs);

  let components = await readFile(path.join(ROOT, 'assets', 'styles-components.css'), 'utf8');
  components += '\n.noscript-archive{margin:1.25rem 0 2rem;padding:1.3rem 1.4rem;border:1px solid var(--line);border-radius:var(--radius);background:var(--surface)}.noscript-archive h2{margin:0 0 .45rem;font:650 1.35rem var(--serif)}.noscript-archive p{margin:0 0 1rem;color:var(--ink-2)}.noscript-archive ul{columns:2;gap:2rem;margin:0;padding-left:1.15rem}.noscript-archive li{break-inside:avoid;margin:.35rem 0}.noscript-archive a,.site-footer a{color:var(--green);font-weight:700;text-underline-offset:3px}@media(max-width:640px){.noscript-archive ul{columns:1}}\n';
  await writeFile(path.join(OUT, 'assets', 'styles-components.css'), components);

  const articleDirectory = path.join(OUT, 'articles');
  await mkdir(articleDirectory, { recursive: true });
  for (const article of articles) {
    const source = await readFile(path.join(ROOT, 'articles', `${article.slug}.html`), 'utf8');
    const summary = pilotSummaries[article.slug];
    const pilot = summary ? { summary, findings: findings.filter(finding => finding.used_in?.includes(article.slug)) } : null;
    if (pilot && !pilot.findings.length) throw new Error(`Pilot yazının bulgu kaydı yok: ${article.slug}`);
    await writeFile(path.join(articleDirectory, `${article.slug}.html`), wrapArticle(source, article, pilot));
  }

  await brandToolPages();
  await writeFile(path.join(OUT, 'favicon.svg'), await readFile(path.join(ROOT, 'assets', 'logo-mark.svg'), 'utf8'));
  await writeFile(path.join(OUT, 'site.webmanifest'), manifest());
  await writeFile(path.join(OUT, 'reader.html'), legacyReader());
  await writeFile(path.join(OUT, '404.html'), notFoundPage());
  await writeFile(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
  await writeFile(path.join(OUT, 'sitemap.xml'), sitemap(articles, pilotSummaries));
  await writeFile(path.join(OUT, 'feed.xml'), rss(articles));
  await writeFile(path.join(OUT, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n  Cross-Origin-Opener-Policy: same-origin\n\n/assets/*\n  Cache-Control: public, max-age=0, must-revalidate\n`);
  await writeFile(path.join(OUT, '_redirects'), '/index.html  /  301\n');

  await versionPageAssets();
  const built = (await readdir(articleDirectory)).filter(name => name.endsWith('.html')).length;
  if (built !== articles.length) throw new Error(`Yazı çıktısı eksik: ${built}/${articles.length}`);
  console.log(`Kanıt Atlası yayını hazır: ${built} yazı → site/`);
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
