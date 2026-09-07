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

// Araçlar, geçiş sürecinde v1 düz metin ve v2 kaynak bağlantılı kanıtları birlikte okuyabilir.
const toolBundleJson = JSON.stringify(bundle.map(normalizeFindingForTools));

// JSON, script etiketi içinde güvenli tutulur.
const data = toolBundleJson.replace(/<\//g, "<\\/");
const articles = readFileSync(join(ROOT, "data", "articles.json"), "utf8").replace(/<\//g, "<\\/");

const jobs = [
  ["tools/timeline.template.html", "zaman-cizelgesi.html"],
  ["tools/browser.template.html", "bulgu-veri-tabani.html"],
];

for (const [sourcePath, outputName] of jobs) {
  const absoluteSource = join(ROOT, sourcePath);
  let template = readFileSync(absoluteSource, "utf8");

  // Eski şablondaki tekil CSS yazım hatasına karşı geriye dönük güvenlik ağı.
  // Şablon düzeltildikten sonra bu satır kaldırılabilir.
  template = template.replace(
    "--accent-ink:#1E3purple; --accent-ink:#1E344A;",
    "--accent-ink:#1E344A;",
  );

  if (!template.includes("__DATA__")) {
    console.error(`${sourcePath}: __DATA__ yer tutucusu yok`);
    process.exit(1);
  }
  template = template.replace("__DATA__", data);

  if (template.includes("__ARTICLES__")) {
    template = template.replace("__ARTICLES__", articles);
  }

  if (template.includes("__DATA__") || template.includes("__ARTICLES__")) {
    console.error(`${sourcePath}: çözülememiş yer tutucu kaldı`);
    process.exit(1);
  }

  const outputPath = join(out, outputName);
  writeFileSync(outputPath, template);
  console.log(`${outputName}  ${(Buffer.byteLength(template) / 1024).toFixed(1)} KB`);
}
