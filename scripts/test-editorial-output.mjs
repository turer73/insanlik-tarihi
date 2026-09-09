import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFile(path.join(root,p),'utf8');
const context={window:{}};
vm.runInNewContext(await read('assets/articles-data.js'),context);
const articles=context.window.ITArticles;
assert.equal(articles.length,28);
assert.equal(new Set(articles.map(a=>a.cover)).size,28);
const manifest=JSON.parse(await read('assets/editorial-manifest.json'));
const index=await read('site/index.html');
assert.ok(index.includes('assets/logo-mark.svg'));
assert.ok(!index.includes('covers-data/'));
assert.equal(await read('site/favicon.svg'),await read('assets/logo-mark.svg'));
for(const article of articles) {
 const entry=manifest[article.slug];
 assert.equal(article.cover,entry.file);
 const bytes=await readFile(path.join(root,'site',article.cover));
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.equal(bytes.length,entry.bytes);
 assert.ok(bytes.equals(await readFile(path.join(root,article.cover))));
  const html=await read(`site/articles/${article.slug}.html`);
  const url=`https://kanitatlasi.com/${article.cover}`;
  assert.ok(html.includes(`property="og:image" content="${url}"`),article.slug);
  assert.ok(html.includes(`name="twitter:image" content="${url}"`),article.slug);
  assert.ok(html.includes('property="og:image:width" content="1200"'));
  assert.ok(html.includes('property="og:image:height" content="675"'));
  const ld=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(ld.image,url);
  assert.ok(html.includes('../assets/editorial-meta.js'));
  assert.ok(html.includes('../assets/article-visuals.js'));
  assert.ok(html.includes('../assets/tracking.js'),article.slug);
  assert.ok(html.includes('class="ka-share"'),article.slug);
  assert.ok(html.includes('href="../hakkinda.html"') && html.includes('href="../duzeltmeler.html"'),article.slug);
  assert.ok(html.includes('class="ka-search-question"'),`${article.slug}: arama sorusu`);
  assert.ok(html.includes('class="ka-related"'),`${article.slug}: ilgili dosyalar`);
  assert.ok(html.includes('class="ka-attribution"'),`${article.slug}: atıf bloğu`);
  assert.ok(html.includes('href="../konular/'),`${article.slug}: konu merkezi bağlantısı`);
  for (const [, slug] of html.matchAll(/class="ka-related"[\s\S]*?href="([a-z0-9-]+)\.html"/g)) {
    assert.ok(articles.some(a=>a.slug===slug),`${article.slug}: bilinmeyen ilgili dosya ${slug}`);
  }
}
assert.equal((await readdir(path.join(root,'site/assets/editorial-covers'))).length,28);
const tartismaPilotu = JSON.parse(await read('data/tartisma-pilotu.json'));
const pilotSet = new Set(tartismaPilotu.yazilar);
const contributionEnabled = tartismaPilotu.aktif === true;
for (const article of articles) {
  const html = await read(`site/articles/${article.slug}.html`);
  assert.equal(html.includes('data-contribution-form'), contributionEnabled && pilotSet.has(article.slug), `${article.slug}: katkı formu yalnızca etkin pilot yazılarda`);
  if (!contributionEnabled && pilotSet.has(article.slug)) {
    assert.ok(html.includes('moderasyon ve kötüye kullanım koruması tamamlanana kadar kapalıdır'), `${article.slug}: kapalı pilot açıklaması`);
  }
  assert.ok(html.includes('class="ka-newsletter"'), `${article.slug}: bülten bloğu`);
  assert.ok(html.includes('../assets/cta-blocks.css'), `${article.slug}: cta css`);
  assert.ok(html.includes('../assets/contribution.js'), `${article.slug}: contribution js`);
}
const pilotDosya = await read('site/articles/tufan-bilmecesi.html');
if (contributionEnabled) {
  assert.ok(pilotDosya.includes('<select name="iddia">'), 'pilot formda bulgu seçimi');
  assert.ok(pilotDosya.includes('value="Soru sor"') && pilotDosya.includes('value="Düzeltme öner"'), 'pilot formda katkı türleri');
  assert.ok(pilotDosya.includes('name="website"'), 'pilot formda honeypot alanı');
}
const anaSayfa = await read('site/index.html');
assert.ok(anaSayfa.includes('class="ka-newsletter"'), 'ana sayfada bülten bloğu');
assert.ok(anaSayfa.includes('assets/cta-blocks.css') && anaSayfa.includes('assets/contribution.js'), 'ana sayfada cta varlıkları');
let versionedAssets = 0;
const hubs = Object.values(JSON.parse(await read('data/konu-merkezleri.json')));
const allPages = ['index.html', ...articles.map(a=>`articles/${a.slug}.html`), 'dist/zaman-cizelgesi.html', 'dist/bulgu-veri-tabani.html', 'dist/kanit-denetimi.html', 'hakkinda.html', 'duzeltmeler.html', 'yeniden-yayin.html', 'konular.html', ...hubs.map(h=>`konular/${h.slug}.html`)];
for (const page of allPages) {
 const html=await read(`site/${page}`);
 assert.equal((html.match(/data-domain="kanitatlasi\.com"/g)||[]).length,1,`${page}: one Plausible loader`);
 assert.ok(html.includes('<script defer data-domain="kanitatlasi.com" src="https://analytics.3d-labx.com/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"></script>'));
 assert.ok(html.includes('window.plausible.q = window.plausible.q || []'));
 for (const [,url] of html.matchAll(/\b(?:src|href)="([^\"]+\.(?:js|css|svg)(?:\?[^\"]*)?)"/g)) {
  if (/^(?:[a-z]+:|\/\/)/i.test(url)) continue;
  const [asset,query]=url.split('?');
  const file=asset.startsWith('/') ? path.join(root,'site',asset) : path.resolve(root,'site',path.dirname(page),asset);
  const hash=createHash('sha256').update(await readFile(file)).digest('hex').slice(0,16);
  assert.equal(query,`v=${hash}`,`${page}: ${url} must reference current asset bytes`);
  versionedAssets++;
 }
}
assert.ok(versionedAssets > 200);
assert.ok(!(await read('site/reader.html')).includes('data-domain="kanitatlasi.com"'), 'redirect must not double-count pageviews');
assert.ok((await read('site/_headers')).includes('max-age=0, must-revalidate'));
assert.ok((await read('vercel.json')).includes('max-age=0, must-revalidate'));
for (const page of ['hakkinda.html','duzeltmeler.html','yeniden-yayin.html']) {
  const html = await read(`site/${page}`);
  assert.ok(html.includes(`<link rel="canonical" href="https://kanitatlasi.com/${page}">`), page);
  assert.ok(html.includes('<script type="application/ld+json">'), page);
  assert.ok(!html.includes('<!-- KA-META -->'), page);
}
for (const page of ['hakkinda.html','duzeltmeler.html']) {
  const html = await read(`site/${page}`);
  assert.ok(html.includes('class="static-shell"'), `${page}: ana site yerleşimi`);
  assert.ok(html.includes('id="mainNav"') && html.includes('class="header-actions"'), `${page}: ortak gezinme`);
  assert.ok(html.includes('assets/static-pages.css') && html.includes('assets/site-shell.js'), `${page}: ortak sayfa varlıkları`);
  assert.ok(html.includes('aria-label="Menüyü aç"') && html.includes('aria-label="Yazılarda ara"'), `${page}: erişilebilir kontroller`);
}
for (const hub of hubs) {
  const html = await read(`site/konular/${hub.slug}.html`);
  assert.ok(!/[ÃÄÅ]|â(?:€|†)/u.test(html), `${hub.slug}: bozuk UTF-8 dizisi olmamalı`);
  assert.ok(html.includes(`<link rel="canonical" href="https://kanitatlasi.com/konular/${hub.slug}.html">`), hub.slug);
  assert.ok(html.includes('<script type="application/ld+json">'), hub.slug);
  for (const dosya of hub.dosyalar) {
    assert.ok(html.includes(`href="../articles/${dosya}.html"`), `${hub.slug}: ${dosya} kartı`);
  }
  for (const tas of hub['kilometre-taslari']) {
    assert.ok(html.includes(`href="../articles/${tas.dosya}.html"`), `${hub.slug}: kilometre taşı ${tas.dosya}`);
  }
}
const hubIndex = await read('site/konular.html');
assert.ok(!/[ÃÄÅ]|â(?:€|†)/u.test(hubIndex), 'konu merkezi dizininde bozuk UTF-8 dizisi olmamalı');
assert.ok(hubIndex.includes('class="topics-shell"'), 'konu dizini ana site yerleşimini kullanmalı');
assert.equal((hubIndex.match(/class="hub-index-card"/g) ?? []).length, hubs.length, 'her merkez görselli kartla sunulmalı');
assert.ok(hubIndex.includes('hub-index-card__visual') && hubIndex.includes('açık soru</span>'), 'merkez kartı görsel ve içerik göstergeleri');
assert.ok(hubIndex.includes('class="header-actions"') && hubIndex.includes('assets/site-shell.js'), 'konu dizininde ortak gezinme');

const hubDosyalar = new Set(hubs.flatMap(hub => hub.dosyalar));
for (const article of articles) {
  assert.ok(hubDosyalar.has(article.slug), `${article.slug} en az bir merkezde olmalı`);
}
assert.equal((await read('site/sitemap.xml')).match(/<loc>/g).length, 1 + articles.length + 3 + 1 + hubs.length + 3);
assert.ok((await read('site/index.html')).includes('href="konular.html"'), 'ana sayfada konular bağlantısı');
assert.ok((await read('site/index.html')).includes('href="yeniden-yayin.html"'), 'ana sayfada yeniden yayın bağlantısı');
assert.ok((await read('site/index.html')).includes('href="hakkinda.html"'), 'ana sayfada güven sayfası bağlantısı');
assert.ok((await read('site/index.html')).includes('href="duzeltmeler.html"'), 'ana sayfada düzeltme sayfası bağlantısı');
assert.ok(!(await read('site/index.html')).includes('href="#hakkinda"'), 'eski çapa bağlantısı kalmamalı');
console.log(`Önbellek: ${versionedAssets} yerel varlık başvurusu içerik hash'iyle doğrulandı.`);
console.log('Üretim çıktısı: 28/28 gerçek WebP, dosya bütünlüğü, logo, favicon ve makaleye özel OG/Twitter/Schema.org doğrulandı.');
