#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const template = readFileSync(join(ROOT, "tools", "audit.template.html"), "utf8");
const example = JSON.parse(readFileSync(join(ROOT, "examples", "finding.v2.json"), "utf8"));

assert.match(template, /<!doctype html>/i);
assert.match(template, /<html lang="tr">/i);
assert.equal((template.match(/__CANONICAL_DATA__/g) ?? []).length, 1);
assert.ok(!template.includes("__DATA__"), "Denetim aracı normalize edilmiş eski araç verisini kullanmamalı.");

const rendered = template.replace(
  "__CANONICAL_DATA__",
  JSON.stringify([example]).replace(/<\//g, "<\\/"),
);
assert.ok(!rendered.includes("__CANONICAL_DATA__"));

const match = rendered.match(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match, "Gömülü kanonik veri script etiketi bulunamadı.");
const parsed = JSON.parse(match[1]);
assert.equal(parsed[0].schema_version, 2);
assert.equal(typeof parsed[0].evidence[0], "object");
assert.equal(parsed[0].evidence[0].citations[0].source_ref, parsed[0].sources[0].id);

console.log("audit template testi: tamam");
