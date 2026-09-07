import { access, cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'site');
const ORIGIN = 'https://kanitatlasi.com';
const TODAY = new Date().toISOString().slice(0, 10);

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
  <meta property="og:image:width" content="480">
  <meta property="og:image:height" content="270">
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
    image: `${ORIGIN}/assets/og-image.webp`,
    articleSection: article.category,
    keywords: article.tags.join(', ')
  }).replaceAll('<', '\\u003c');
}

function wrapArticle(source, article) {
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
    .replace(/<\/?body[^>]*>/gi, '')
    .replace(/<\/html>\s*$/i, '')
    .trim();

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
  <meta property="og:image" content="${ORIGIN}/assets/og-image.webp">
  <meta property="og:image:width" content="480">
  <meta property="og:image:height" content="270">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(article.title)} — Kanıt Atlası">
  <meta name="twitter:description" content="${escapeHtml(article.summary)}">
  <meta name="twitter:image" content="${ORIGIN}/assets/og-image.webp">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="../site.webmanifest">
${headFragment}
  <link rel="stylesheet" href="../assets/article-visuals.css">
  <script type="application/ld+json">${articleJsonLd(article)}</script>
</head>
<body>
${bodyFragment}
  <script src="../assets/visuals-scenes-1.js"></script>
  <script src="../assets/visuals-scenes-2.js"></script>
  <script src="../assets/visuals-scenes-3.js"></script>
  <script src="../assets/visuals-scenes-4.js"></script>
  <script src="../assets/visuals.js"></script>
  <script src="../assets/article-visuals.js"></script>
</body>
</html>\n`;
}

async function extractCoverAssets() {
  const sourceDirectory = path.join(ROOT, 'assets', 'covers-data');
  const destinationDirectory = path.join(OUT, 'assets', 'covers');
  await mkdir(destinationDirectory, { recursive: true });
  let socialCover = null;

  for (const entry of await readdir(sourceDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
    const source = await readFile(path.join(sourceDirectory, entry.name), 'utf8');
    const match = source.match(/ITCoverData\['([^']+)'\]='data:image\/([^;]+);base64,([^']+)'/);
    if (!match) throw new Error(`Kapak verisi çözülemedi: ${entry.name}`);
    const [, slug, rawExtension, encoded] = match;
    const extension = rawExtension === 'jpeg' ? 'jpg' : rawExtension;
    const bytes = Buffer.from(encoded, 'base64');
    await writeFile(path.join(destinationDirectory, `${slug}.${extension}`), bytes);
    if (slug === 'iskenderiye') socialCover = bytes;
  }

  if (!socialCover) throw new Error('Sosyal paylaşım görseli için İskenderiye kapağı bulunamadı.');
  await writeFile(path.join(OUT, 'assets', 'og-image.webp'), socialCover);
  await rm(path.join(OUT, 'assets', 'covers-data'), { recursive: true, force: true });
}

function favicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#165f50"/><circle cx="32" cy="32" r="22" fill="none" stroke="#f6f3eb" stroke-width="2"/><circle cx="32" cy="32" r="13" fill="none" stroke="#f6f3eb" stroke-width="1.5"/><text x="32" y="37" text-anchor="middle" font-family="Georgia,serif" font-size="15" font-weight="700" fill="#f6f3eb">KA</text></svg>`;
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

function sitemap(articles) {
  const urls = [
    { loc: `${ORIGIN}/`, priority: '1.0', changefreq: 'weekly' },
    ...articles.map(article => ({ loc: `${ORIGIN}/articles/${article.slug}.html`, priority: article.featured ? '0.9' : '0.7', changefreq: 'monthly' })),
    { loc: `${ORIGIN}/dist/zaman-cizelgesi.html`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${ORIGIN}/dist/bulgu-veri-tabani.html`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${ORIGIN}/dist/kanit-denetimi.html`, priority: '0.7', changefreq: 'weekly' }
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(item => `  <url><loc>${item.loc}</loc><lastmod>${TODAY}</lastmod><changefreq>${item.changefreq}</changefreq><priority>${item.priority}</priority></url>`).join('\n')}\n</urlset>\n`;
}

function rss(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Kanıt Atlası</title><link>${ORIGIN}/</link><description>İnsanlık tarihi, arkeoloji, bilim ve inanç üzerine kanıt odaklı Türkçe araştırma dosyaları.</description><language>tr-TR</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate><atom:link href="${ORIGIN}/feed.xml" rel="self" type="application/rss+xml"/>${[...articles].sort((a,b)=>b.no-a.no).map(article => `<item><title>${escapeHtml(article.title)}</title><link>${ORIGIN}/articles/${article.slug}.html</link><guid isPermaLink="true">${ORIGIN}/articles/${article.slug}.html</guid><category>${escapeHtml(article.category)}</category><description>${escapeHtml(article.summary)}</description></item>`).join('')}</channel></rss>\n`;
}

async function brandToolPages() {
  const directory = path.join(OUT, 'dist');
  if (!(await exists(directory))) return;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const file = path.join(directory, entry.name);
    let content = await readFile(file, 'utf8');
    content = content
      .replaceAll('İnsanlık Tarihi bulgularını', 'Kanıt Atlası bulgularını')
      .replaceAll('İnsanlık Tarihi bulgularında', 'Kanıt Atlası bulgularında')
      .replaceAll('· İnsanlık Tarihi', '· Kanıt Atlası')
      .replaceAll('<title>İnsanlık Tarihi</title>', '<title>Kanıt Atlası</title>');
    await writeFile(file, content);
  }
}

async function main() {
  const articles = await loadArticles();
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
    await writeFile(path.join(articleDirectory, `${article.slug}.html`), wrapArticle(source, article));
  }

  await brandToolPages();
  await writeFile(path.join(OUT, 'favicon.svg'), favicon());
  await writeFile(path.join(OUT, 'site.webmanifest'), manifest());
  await writeFile(path.join(OUT, 'reader.html'), legacyReader());
  await writeFile(path.join(OUT, '404.html'), notFoundPage());
  await writeFile(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
  await writeFile(path.join(OUT, 'sitemap.xml'), sitemap(articles));
  await writeFile(path.join(OUT, 'feed.xml'), rss(articles));
  await writeFile(path.join(OUT, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n  Cross-Origin-Opener-Policy: same-origin\n\n/assets/*\n  Cache-Control: public, max-age=604800, stale-while-revalidate=86400\n`);
  await writeFile(path.join(OUT, '_redirects'), '/index.html  /  301\n');

  const built = (await readdir(articleDirectory)).filter(name => name.endsWith('.html')).length;
  if (built !== articles.length) throw new Error(`Yazı çıktısı eksik: ${built}/${articles.length}`);
  console.log(`Kanıt Atlası yayını hazır: ${built} yazı → site/`);
}

main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
