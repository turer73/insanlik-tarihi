#!/usr/bin/env node
// Sablonlara bundle verisini gomup yayina hazir HTML uretir.
// Kullanim: node scripts/build-tools.mjs [cikti-dizini]
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2] || "dist";
mkdirSync(out, { recursive: true });

// Bundle'i HER SEFERINDE data/findings/*.json'dan yeniden uret.
// Elle guncellenen bir ara dosya sessizce bayatliyordu: 2026-09-07'de
// arac 106 kayitla yayimlandi, veri tabaninda 112 vardi. Tek kaynak
// kaynak dosyalardir; bundle bir cikti, bir girdi degil.
const srcDir = "data/findings";
const files = readdirSync(srcDir).filter((f) => f.endsWith(".json")).sort();
const bundle = [];
const seen = new Map();
for (const f of files) {
  const recs = JSON.parse(readFileSync(join(srcDir, f), "utf8"));
  for (const r of recs) {
    if (seen.has(r.id)) {
      console.error(`id cakismasi: ${r.id} — ${seen.get(r.id)} ve ${f}`);
      process.exit(1);
    }
    seen.set(r.id, f);
    bundle.push(r);
  }
}
const bundleJson = JSON.stringify(bundle);
writeFileSync("data/findings.bundle.json", bundleJson + "\n");
console.log(`bundle  ${bundle.length} kayit / ${files.length} dosya`);

const data = bundleJson.replace(/<\//g, "<\/");
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
