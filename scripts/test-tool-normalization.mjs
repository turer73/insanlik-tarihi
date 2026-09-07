#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeFindingForTools } from "./lib/normalize-for-tools.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const example = JSON.parse(readFileSync(join(ROOT, "examples", "finding.v2.json"), "utf8"));
const normalized = normalizeFindingForTools(example);

assert.equal(typeof normalized.evidence[1], "string");
assert.match(normalized.evidence[1], /23 bin, 42 bin/);
assert.match(normalized.evidence[1], /Hays, James D\. \(1976\)/);
assert.match(normalized.evidence[1], /Özet, madde 2/);
assert.match(normalized.evidence[1], /doğrudan/);
assert.deepEqual(normalized.sources, example.sources, "kaynak künyeleri değiştirilmemeli");

const legacy = normalizeFindingForTools({ evidence: ["Düz metin kanıt"] });
assert.equal(legacy.evidence[0], "Düz metin kanıt");

console.log("Araç veri normalizasyonu geçerli.");
