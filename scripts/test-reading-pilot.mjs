import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const pilots = JSON.parse(read('data/reading-pilot.json'));
const findings = JSON.parse(read('data/findings.bundle.json'));
let count = 0;
for (const file of readdirSync(new URL('../site/articles/', import.meta.url))) {
  if (!file.endsWith('.html')) continue;
  const slug = file.slice(0, -5), html = read('site/articles/' + file);
  const enabled = Object.hasOwn(pilots, slug);
  assert.equal(html.includes('class="ka-evidence-intro"'), enabled, slug);
  assert.equal(html.includes('assets/evidence-dossier.css'), enabled, slug);
  assert.equal(html.includes('id="kanit-dosyasi"'), enabled, slug);
  if (!enabled) continue;
  const expected = findings.filter(f => f.used_in?.includes(slug)).length;
  assert.equal((html.match(/<details class="ka-finding"/g) || []).length, expected, slug);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${slug}: duplicate IDs`);
  for (const [, id] of html.matchAll(/href="#((?:bulgu-|kaynak-|kanit-|ka-)[^"]*)"/g)) {
    assert.ok(ids.includes(id), `${slug}: missing ${id}`);
  }
  count += expected;
}
assert.equal(count, 18);
const alexandria = read('site/articles/iskenderiye.html');
assert.ok(alexandria.includes('id="duzeltme-strabon"'));
assert.ok(alexandria.includes('https://www.alexandrianlibrary.org/?page_id=252'));
console.log('Reading pilot: 3 pages, 18 findings, unique IDs and resolved links; other 24 pages excluded.');
