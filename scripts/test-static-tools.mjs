#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const browser = readFileSync(join(ROOT, "tools", "browser.template.html"), "utf8");
const timeline = readFileSync(join(ROOT, "tools", "timeline.template.html"), "utf8");

for (const [name, source] of [["tarayıcı", browser], ["zaman çizelgesi", timeline]]) {
  assert.match(source, /^<!doctype html>/i, `${name}: doctype eksik`);
  assert.match(source, /<html lang="tr">/i, `${name}: Türkçe belge dili eksik`);
  assert.match(source, /<meta charset="utf-8">/i, `${name}: charset eksik`);
  assert.match(source, /name="viewport"/i, `${name}: viewport eksik`);
  assert.match(source, /<body>/i, `${name}: body eksik`);
  assert.match(source, /<\/html>\s*$/i, `${name}: html kapanışı eksik`);
}

assert.ok(!browser.includes("1E3purple"), "tarayıcı: geçersiz CSS rengi kaldı");
assert.match(timeline, /var NOW = new Date\(\)\.getFullYear\(\);/);
assert.ok(!timeline.includes("Math.abs(s.max - s.min) * 0.005"));
assert.match(timeline, /6 \/ trackWidth/);
assert.match(timeline, /<button type="button" class="row__lbl"/);
assert.match(timeline, /data-bar="1" aria-pressed=/);
assert.match(timeline, /aria-label="'\+ariaLabel\+'"/);

console.log("statik araç testi: tamam");
