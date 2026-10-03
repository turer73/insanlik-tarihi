import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { readSnapshot, mergeSnapshot } from './lib/gsc-snapshot.mjs';

const root = await mkdtemp(path.join(tmpdir(), 'gsc-snapshot-'));
const file = path.join(root, 'snapshot.json');
assert.equal(await readSnapshot(file), null);
await writeFile(file, '{broken');
await assert.rejects(readSnapshot(file), SyntaxError);
await writeFile(file, '{"urls":[]}');
await assert.rejects(readSnapshot(file), /urls/);
const previous = { urls: {
  a: { karar: 'PASS', durum: 'Dizinde', olculdu: 'old-a' },
  b: { karar: 'NEUTRAL', durum: 'Keşfedildi', olculdu: 'old-b' },
  c: { karar: 'PASS', durum: 'Dizinde', olculdu: 'old-c' },
} };
await writeFile(file, JSON.stringify(previous));
const loaded = await readSnapshot(file);
const opts = { property: 'sc-domain:example.com', measuredAt: 'now', errors: { c: 'timeout' } };
const result = mergeSnapshot(loaded, { a: { hata: 'quota' }, b: { karar: 'PASS', durum: 'Dizinde' } }, opts);
assert.deepEqual(result.urls.a, previous.urls.a);
assert.deepEqual(result.urls.c, previous.urls.c);
assert.equal(result.urls.b.olculdu, 'now');
assert.equal(result.urls.b.karar, 'PASS');
assert.deepEqual(result.sonDeneme.hatalar, { c: 'timeout', a: 'quota' });
assert.deepEqual(loaded, previous, 'Eski ölçüm yerinde değiştirilmemeli');
assert.equal(mergeSnapshot(previous, { a: { hata: 'quota' }, b: {} }, opts), null);
assert.equal(mergeSnapshot(previous, {}, opts), null);
assert.equal(mergeSnapshot(null, { a: { karar: 'PASS', durum: 'Dizinde' } }, opts).urls.a.olculdu, 'now');
assert.deepEqual(await readSnapshot(file), previous, 'Başarısız deneme disk ölçümünü korumalı');
console.log('GSC snapshot: önceki ölçüm, kısmi hata, tümü hata ve bozuk dosya regresyonları geçti.');
