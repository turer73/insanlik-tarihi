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
assert.equal(articles.length,27);
assert.equal(new Set(articles.map(a=>a.cover)).size,27);
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
}
assert.equal((await readdir(path.join(root,'site/assets/editorial-covers'))).length,27);
let versionedAssets = 0;
for (const page of ['index.html', ...articles.map(a=>`articles/${a.slug}.html`), 'dist/zaman-cizelgesi.html', 'dist/bulgu-veri-tabani.html', 'dist/kanit-denetimi.html']) {
 const html=await read(`site/${page}`);
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
assert.ok((await read('site/_headers')).includes('max-age=0, must-revalidate'));
assert.ok((await read('vercel.json')).includes('max-age=0, must-revalidate'));
console.log(`Önbellek: ${versionedAssets} yerel varlık başvurusu içerik hash'iyle doğrulandı.`);
console.log('Üretim çıktısı: 27/27 gerçek WebP, dosya bütünlüğü, logo, favicon ve makaleye özel OG/Twitter/Schema.org doğrulandı.');
