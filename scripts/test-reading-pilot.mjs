import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const pilots = JSON.parse(read('data/reading-pilot.json'));
const findings = JSON.parse(read('data/findings.bundle.json'));
const articles = JSON.parse(read('data/articles.json'));
const articleSlugs = Object.keys(articles);
const linkedFindings = findings.filter(finding => finding.used_in?.some(slug => articleSlugs.includes(slug)));
const expectedRelationships = findings.reduce(
  (total, finding) => total + (finding.used_in ?? []).filter(slug => articleSlugs.includes(slug)).length,
  0,
);
assert.deepEqual(new Set(Object.keys(pilots)), new Set(articleSlugs), 'reading-pilot tüm 27 yazı için özet içermeli');
let count = 0;
for (const file of readdirSync(new URL('../site/articles/', import.meta.url))) {
  if (!file.endsWith('.html')) continue;
  const slug = file.slice(0, -5), html = read('site/articles/' + file);
  assert.ok(Object.hasOwn(pilots, slug), `${slug}: okuma özeti eksik`);
  assert.equal(typeof pilots[slug].summary, 'string', `${slug}: kısa yanıt metin olmalı`);
  assert.ok(pilots[slug].summary.trim(), `${slug}: kısa yanıt eksik`);
  assert.equal(typeof pilots[slug].limit, 'string', `${slug}: sınır metin olmalı`);
  assert.ok(pilots[slug].limit.trim(), `${slug}: sınır metni eksik`);
  assert.ok(html.includes('class="ka-evidence-intro"'), slug);
  assert.ok(html.includes('assets/evidence-dossier.css'), slug);
  assert.ok(html.includes('id="kanit-dosyasi"'), slug);
  const expected = findings.filter(f => f.used_in?.includes(slug)).length;
  assert.equal((html.match(/<details class="ka-finding"/g) || []).length, expected, slug);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${slug}: duplicate IDs`);
  for (const [, id] of html.matchAll(/href="#((?:bulgu-|kaynak-|kanit-|ka-)[^"]*)"/g)) {
    assert.ok(ids.includes(id), `${slug}: missing ${id}`);
  }
  count += expected;
}
assert.equal(count, expectedRelationships, 'her bulgu-yazı ilişkisi ilgili dosyada render edilmeli');
const alexandria = read('site/articles/iskenderiye.html');
assert.ok(alexandria.includes('id="duzeltme-strabon"'));
assert.ok(alexandria.includes('https://www.alexandrianlibrary.org/?page_id=252'));
console.log(`Reading dossier: ${articleSlugs.length} pages, ${new Set(linkedFindings.map(f => f.id)).size} linked findings, ${count} relationships, unique IDs and resolved links.`);
