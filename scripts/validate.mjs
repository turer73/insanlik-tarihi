#!/usr/bin/env node
// Bulgu veri tabanı doğrulayıcı. Bağımlılık yok: node scripts/validate.mjs
// 1) Şema uyumu  2) Kimlik çakışması  3) Bütünlük raporu  4) Bayatlık uyarısı

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data", "findings");
const schema = JSON.parse(readFileSync(join(ROOT, "schema", "finding.schema.json"), "utf8"));

const errors = [];
const warnings = [];
const all = [];

// --- minimal şema doğrulama (draft 2020-12'nin kullandığımız alt kümesi) ---
function validate(obj, sch, path, req = true) {
  if (obj === undefined) {
    if (req) errors.push(`${path}: zorunlu alan eksik`);
    return;
  }
  if (sch.enum && !sch.enum.includes(obj)) {
    errors.push(`${path}: '${obj}' geçersiz. İzinli: ${sch.enum.join(", ")}`);
    return;
  }
  const t = sch.type;
  if (t === "object") {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj))
      return errors.push(`${path}: nesne bekleniyordu`);
    for (const k of sch.required ?? [])
      if (!(k in obj)) errors.push(`${path}.${k}: zorunlu alan eksik`);
    if (sch.additionalProperties === false)
      for (const k of Object.keys(obj))
        if (!(sch.properties ?? {})[k]) errors.push(`${path}.${k}: şemada tanımsız alan`);
    for (const [k, v] of Object.entries(obj))
      if ((sch.properties ?? {})[k]) validate(v, sch.properties[k], `${path}.${k}`, false);
  } else if (t === "array") {
    if (!Array.isArray(obj)) return errors.push(`${path}: dizi bekleniyordu`);
    if (sch.minItems && obj.length < sch.minItems)
      errors.push(`${path}: en az ${sch.minItems} öğe gerekli`);
    obj.forEach((it, i) => sch.items && validate(it, sch.items, `${path}[${i}]`, false));
  } else if (t === "string") {
    if (typeof obj !== "string") return errors.push(`${path}: metin bekleniyordu`);
    if (sch.pattern && !new RegExp(sch.pattern).test(obj))
      errors.push(`${path}: '${obj}' biçime uymuyor (${sch.pattern})`);
    if (sch.minLength && obj.length < sch.minLength)
      errors.push(`${path}: en az ${sch.minLength} karakter olmalı`);
  } else if (t === "integer") {
    if (!Number.isInteger(obj)) errors.push(`${path}: tam sayı bekleniyordu`);
    if (obj === 0) errors.push(`${path}: sıfır yılı yoktur (MÖ 1 = -1, MS 1 = 1)`);
  } else if (t === "number") {
    if (typeof obj !== "number") return errors.push(`${path}: sayı bekleniyordu`);
    if (sch.minimum !== undefined && obj < sch.minimum) errors.push(`${path}: ${sch.minimum} altında`);
    if (sch.maximum !== undefined && obj > sch.maximum) errors.push(`${path}: ${sch.maximum} üstünde`);
  } else if (t === "boolean") {
    if (typeof obj !== "boolean") errors.push(`${path}: boolean bekleniyordu`);
  }
}

// --- yükle ---
for (const f of readdirSync(DATA).filter((f) => f.endsWith(".json"))) {
  let recs;
  try {
    recs = JSON.parse(readFileSync(join(DATA, f), "utf8"));
  } catch (e) {
    errors.push(`${f}: JSON okunamadı - ${e.message}`);
    continue;
  }
  if (!Array.isArray(recs)) {
    errors.push(`${f}: dosya bir dizi olmalı`);
    continue;
  }
  recs.forEach((r, i) => {
    validate(r, schema, `${f}[${i}]${r.id ? " " + r.id : ""}`);
    all.push({ ...r, __file: f });
  });
}

// --- kimlik çakışması ---
const seen = new Map();
for (const r of all) {
  if (!r.id) continue;
  if (seen.has(r.id)) errors.push(`Çakışan id '${r.id}': ${seen.get(r.id)} ve ${r.__file}`);
  else seen.set(r.id, r.__file);
}

// --- referans bütünlüğü ---
for (const r of all) {
  for (const s of r.supersedes ?? [])
    if (!seen.has(s)) warnings.push(`${r.id}: supersedes '${s}' bulunamadı`);
  if (r.superseded_by && !seen.has(r.superseded_by))
    warnings.push(`${r.id}: superseded_by '${r.superseded_by}' bulunamadı`);
}

// --- içerik kuralları ---
const today = new Date().toISOString().slice(0, 10);
for (const r of all) {
  if (["contested", "minority"].includes(r.status) && !(r.counter_evidence?.length))
    warnings.push(`${r.id}: '${r.status}' ama counter_evidence boş - tek taraflı kayıt`);
  if (r.popular_claim && !r.divergence)
    warnings.push(`${r.id}: popular_claim var ama divergence yok - sapmanın mekanizması yazılmamış`);
  const onlyWeak = (r.sources ?? []).every((s) => ["popular", "unreliable"].includes(s.tier));
  if (onlyWeak) errors.push(`${r.id}: yalnızca popular/unreliable kaynak - iddia desteklenmiyor`);
  if (r.volatile && r.checked) {
    const days = (Date.parse(today) - Date.parse(r.checked)) / 86400000;
    if (days > 180) warnings.push(`${r.id}: volatile ve ${Math.round(days)} gündür kontrol edilmemiş`);
  }
}

// --- rapor ---
const by = (fn) => all.reduce((a, r) => ((a[fn(r)] = (a[fn(r)] ?? 0) + 1), a), {});
const pct = (n) => `${Math.round((n / all.length) * 100)}%`;
const has = (f) => all.filter((r) => r[f] !== undefined && (!Array.isArray(r[f]) || r[f].length)).length;

console.log(`\n=== BULGU VERİ TABANI ===`);
console.log(`Kayıt: ${all.length}   Dosya: ${new Set(all.map((r) => r.__file)).size}\n`);
console.log(`Durum dağılımı:`);
for (const [k, v] of Object.entries(by((r) => r.status)).sort((a, b) => b[1] - a[1]))
  console.log(`  ${k.padEnd(14)} ${String(v).padStart(3)}  ${pct(v)}`);

console.log(`\nAlan doldurma oranı (yapılandırılmış alanlar):`);
for (const f of ["subject", "period", "languages", "disciplines", "people", "popular_claim", "divergence_type", "counter_evidence", "open_questions"])
  console.log(`  ${f.padEnd(18)} ${String(has(f)).padStart(3)}/${all.length}  ${pct(has(f))}`);

const tiers = all.flatMap((r) => (r.sources ?? []).map((s) => s.tier));
console.log(`\nKaynak katmanları (${tiers.length} kaynak):`);
for (const [k, v] of Object.entries(tiers.reduce((a, t) => ((a[t] = (a[t] ?? 0) + 1), a), {})).sort((a, b) => b[1] - a[1]))
  console.log(`  ${k.padEnd(14)} ${String(v).padStart(3)}`);

if (warnings.length) {
  console.log(`\n--- UYARI (${warnings.length}) ---`);
  warnings.forEach((w) => console.log(`  ! ${w}`));
}
if (errors.length) {
  console.log(`\n--- HATA (${errors.length}) ---`);
  errors.forEach((e) => console.log(`  x ${e}`));
  console.log("");
  process.exit(1);
}
console.log(`\nGecerli. Hata yok.\n`);
