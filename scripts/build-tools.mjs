#!/usr/bin/env node
// Şablonlara kaynak veriyi gömüp yayına hazır tek dosyalık HTML üretir.
//
// Kullanım:
//   node scripts/build-tools.mjs
//   node scripts/build-tools.mjs public
//   node scripts/build-tools.mjs --skip-validate

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeFindingForTools } from "./lib/normalize-for-tools.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const skipValidate = args.includes("--skip-validate");
const outArg = args.find((arg) => !arg.startsWith("--")) ?? "dist";
const out = resolve(ROOT, outArg);

if (!skipValidate) {
  const result = spawnSync(process.execPath, [join(ROOT, "scripts", "validate.mjs")], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (result.error) {
    console.error(`doğrulayıcı başlatılamadı: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

mkdirSync(out, { recursive: true });

// Bundle her derlemede kanonik kaynak olan data/findings/*.json dosyalarından
// yeniden üretilir. data/findings.bundle.json bir çıktı, girdi değildir.
const srcDir = join(ROOT, "data", "findings");
const files = readdirSync(srcDir)
  .filter((file) => file.endsWith(".json"))
  .sort((a, b) => a.localeCompare(b, "tr"));

const bundle = [];
const seen = new Map();
for (const file of files) {
  const records = JSON.parse(readFileSync(join(srcDir, file), "utf8"));
  if (!Array.isArray(records)) {
    console.error(`${file}: bulgu dosyası bir dizi olmalı`);
    process.exit(1);
  }

  for (const record of records) {
    if (seen.has(record.id)) {
      console.error(`id çakışması: ${record.id} — ${seen.get(record.id)} ve ${file}`);
      process.exit(1);
    }
    seen.set(record.id, file);
    bundle.push(record);
  }
}

const bundleJson = JSON.stringify(bundle);
writeFileSync(join(ROOT, "data", "findings.bundle.json"), `${bundleJson}\n`);
console.log(`bundle  ${bundle.length} kayıt / ${files.length} dosya`);

// Mevcut zaman çizelgesi ve tarayıcı v1'de düz metin kanıt bekler.
// Kanonik v2 yapısı yalnızca bu iki eski araç için yayın kopyasında düzleştirilir.
const toolBundleJson = JSON.stringify(bundle.map(normalizeFindingForTools));

// JSON, script etiketi içinde güvenli tutulur.
const canonicalData = bundleJson.replace(/<\//g, "<\\/");
const legacyToolData = toolBundleJson.replace(/<\//g, "<\\/");
const articles = readFileSync(join(ROOT, "data", "articles.json"), "utf8").replace(/<\//g, "<\\/");

const jobs = [
  {
    sourcePath: "tools/timeline.template.html",
    outputName: "zaman-cizelgesi.html",
    placeholder: "__DATA__",
    payload: legacyToolData,
  },
  {
    sourcePath: "tools/browser.template.html",
    outputName: "bulgu-veri-tabani.html",
    placeholder: "__DATA__",
    payload: legacyToolData,
  },
  {
    sourcePath: "tools/audit.template.html",
    outputName: "kanit-denetimi.html",
    placeholder: "__CANONICAL_DATA__",
    payload: canonicalData,
  },
];

for (const job of jobs) {
  const absoluteSource = join(ROOT, job.sourcePath);
  let template = readFileSync(absoluteSource, "utf8");

  if (!template.includes(job.placeholder)) {
    console.error(`${job.sourcePath}: ${job.placeholder} yer tutucusu yok`);
    process.exit(1);
  }
  template = template.replace(job.placeholder, job.payload);

  if (template.includes("__DATA__") || template.includes("__CANONICAL_DATA__")) {
    console.error(`${job.sourcePath}: çözülememiş veri yer tutucusu kaldı`);
    process.exit(1);
  }

  if (template.includes("__ARTICLES__")) {
    template = template.replace("__ARTICLES__", articles);
  }
  if (template.includes("__ARTICLES__")) {
    console.error(`${job.sourcePath}: çözülememiş __ARTICLES__ yer tutucusu kaldı`);
    process.exit(1);
  }

  const outputPath = join(out, job.outputName);
  writeFileSync(outputPath, template);
  console.log(`${job.outputName}  ${(Buffer.byteLength(template) / 1024).toFixed(1)} KB`);
}
