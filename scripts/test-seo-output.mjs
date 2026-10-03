import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteRows, ORIGIN } from './lib/site-urls.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFile(path.join(root, file), 'utf8');
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
const rows = await siteRows(root);
const dates = JSON.parse(await read('data/icerik-surumu.json')).kayitlar;
const titles = new Set();
const sitemap = await read('site/sitemap.xml');
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => ({
  url: entry.match(/<loc>(.*?)<\/loc>/)[1], date: entry.match(/<lastmod>(.*?)<\/lastmod>/)[1],
}));
assert.equal(entries.length, rows.length, 'Sitemap aynı URL’yi iki kez içermemeli');
assert.deepEqual(new Set(entries.map(entry => entry.url)), new Set(rows.map(row => row.url)));
for (const row of rows) {
  const pathname = new URL(row.url).pathname;
  const html = await read(`site/${pathname === '/' ? 'index.html' : pathname.slice(1)}`);
  const titleTags = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
  assert.equal(titleTags.length, 1, `${row.url}: tek title`);
  const title = decode(titleTags[0][1]);
  assert.equal(title, row.meta, `${row.url}: envanterle aynı arama başlığı`);
  assert.ok(!titles.has(title), `${row.url}: benzersiz başlık`);
  titles.add(title);
  const meta = (key, attr = 'name') => [...html.matchAll(/<meta\b[^>]*>/gi)]
    .filter(([tag]) => tag.includes(`${attr}="${key}"`))
    .map(([tag]) => tag.match(/content="([^"]*)"/)[1]);
  assert.equal(meta('description').length, 1, `${row.url}: tek açıklama`);
  assert.ok(meta('description')[0].trim(), `${row.url}: boş açıklama`);
  assert.equal(meta('robots').length, 1, `${row.url}: tek robots`);
  assert.match(meta('robots')[0], /\bindex,follow\b/);
  assert.doesNotMatch(meta('robots')[0], /noindex|nofollow/);
  assert.deepEqual([...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(([, value]) => value), [row.url]);
  assert.deepEqual(meta('og:url', 'property'), [row.url]);
  assert.equal([...html.matchAll(/<h1\b[^>]*>/gi)].length, 1, `${row.url}: tek ana başlık`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(json));
  assert.ok(schemas.length, `${row.url}: geçerli JSON-LD`);
  for (const src of meta('og:image', 'property')) {
    assert.equal(new URL(src).origin, ORIGIN);
    await access(path.join(root, 'site', new URL(src).pathname));
  }
  if (pathname.startsWith('/articles/')) {
    const article = schemas.find(schema => schema['@type'] === 'Article');
    assert.ok(article, `${row.url}: Article şeması`);
    const contentDates = dates[pathname.slice(1)];
    assert.equal(article.datePublished, contentDates.published);
    assert.equal(article.dateModified, contentDates.lastmod);
    assert.equal(article.mainEntityOfPage, row.url);
    assert.equal(article.publisher.name, 'Kanıt Atlası');
    assert.ok(article.datePublished <= article.dateModified, `${row.url}: tarih sırası`);
    assert.equal(entries.find(entry => entry.url === row.url).date, article.dateModified);
    assert.deepEqual(meta('article:published_time', 'property'), [article.datePublished]);
    assert.deepEqual(meta('article:modified_time', 'property'), [article.dateModified]);
    for (const date of [article.datePublished, article.dateModified]) {
      assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(html.includes(`<time datetime="${date}">${date.split('-').reverse().join('.')}</time>`), `${row.url}: görünür tarih`);
    }
    assert.deepEqual(meta('og:title', 'property').map(decode), [title]);
    assert.deepEqual(meta('twitter:title').map(decode), [title]);
  }
}
const robots = await read('site/robots.txt');
assert.match(robots, /Allow: \/\s/);
assert.ok(robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`));
for (const file of ['reader.html', '404.html']) {
  assert.match(await read(`site/${file}`), /name="robots" content="noindex/);
  assert.ok(!entries.some(entry => entry.url === `${ORIGIN}/${file}`));
}
console.log(`SEO output: ${rows.length} canonical sayfa, sitemap, indexlenebilirlik, başlıklar ve gerçek yayın tarihleri doğrulandı.`);
