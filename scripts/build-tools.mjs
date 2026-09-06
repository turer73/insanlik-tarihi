#!/usr/bin/env node
// Sablonlara bundle verisini gomup yayina hazir HTML uretir.
// Kullanim: node scripts/build-tools.mjs [cikti-dizini]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2] || "dist";
mkdirSync(out, { recursive: true });
const data = readFileSync("data/findings.bundle.json", "utf8").replace(/<\//g, "<\/");
const arts = readFileSync("data/articles.json", "utf8").replace(/<\//g, "<\/");

const jobs = [
  ["tools/timeline.template.html", "zaman-cizelgesi.html"],
  ["tools/browser.template.html", "bulgu-veri-tabani.html"],
];

for (const [src, dst] of jobs) {
  let t = readFileSync(src, "utf8");
  t = t.replace("--accent-ink:#1E3purple; --accent-ink:#1E344A;", "--accent-ink:#1E344A;");
  if (!t.includes("__DATA__")) { console.error(`${src}: __DATA__ yer tutucusu yok`); process.exit(1); }
  t = t.replace("__DATA__", data);
  if (t.includes("__ARTICLES__")) t = t.replace("__ARTICLES__", arts);
  const p = join(out, dst);
  writeFileSync(p, t);
  console.log(`${dst}  ${(Buffer.byteLength(t) / 1024).toFixed(1)} KB`);
}
