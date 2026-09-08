#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(path.join(root, 'tools/timeline.template.html'), 'utf8');
const match = source.match(/function selectAxisLabelIndexes\(items\)\s*\{[\s\S]*?function applyAxisLabelDensity/);
assert.ok(match, 'etiket yoğunluğu yardımcı fonksiyonu bulunamadı');
const functionSource = match[0].slice(0, match[0].lastIndexOf('function applyAxisLabelDensity')).trim();
const selectAxisLabelIndexes = new Function(`${functionSource}; return selectAxisLabelIndexes;`)();

const ticks = (positions, major = []) => positions.map((left, index) => ({
  index, left, right: left + 42, major: major.includes(index),
}));

const dense = selectAxisLabelIndexes(ticks([0, 45, 90, 135, 180, 225, 270]));
assert.deepEqual(dense.sort((a, b) => a - b), [0, 2, 4, 6], 'çakışan etiketler seyreltilmeli');

const withMajor = selectAxisLabelIndexes(ticks([0, 45, 90, 135, 180, 225, 270], [3]));
assert.ok(withMajor.includes(3), 'önemli tick etiketi korunmalı');
assert.ok(withMajor.includes(0) && withMajor.includes(6), 'uç etiketler korunmalı');

const narrow = selectAxisLabelIndexes(ticks([0, 20, 40]));
assert.deepEqual(narrow.sort((a, b) => a - b), [0], 'çok dar eksende çakışan uç etiketi gizlenmeli');

const measuredDeepTime = [
  [0, 62.4], [40.1, 102.5], [101.2, 157.4], [162.3, 212.2],
  [223.4, 279.5], [284, 346.4], [340.7, 396.9], [377.3, 421],
  [386.7, 424.2], [536.3, 580],
].map(([left, right], index) => ({index, left, right, major:index === 0 || index === 9}));
for (const fixture of [ticks([0, 20, 40]), ticks([0, 45, 90, 135, 180]), measuredDeepTime]) {
  const visible = selectAxisLabelIndexes(fixture);
  assert.ok(visible.length > 0);
  for (let i = 0; i < visible.length; i += 1) {
    for (let j = i + 1; j < visible.length; j += 1) {
      const a = fixture[visible[i]];
      const b = fixture[visible[j]];
      assert.ok(a.right + 10 <= b.left || b.right + 10 <= a.left, 'görünen etiketler çakışmamalı');
    }
  }
}

assert.match(source, /window\.addEventListener\('resize'/, 'resize sonrası eksen yeniden ölçülmeli');
assert.match(source, /aria-label=.*esc\(label\)/, 'tick erişilebilir açıklaması korunmalı');
console.log('Timeline etiket testi: tamam (yoğunluk, major tick, uçlar, resize ve erişilebilir açıklama)');
