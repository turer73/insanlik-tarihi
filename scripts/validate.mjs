#!/usr/bin/env node
// Bulgu veri tabanı doğrulayıcı. Bağımlılık yok.
//
// Kullanım:
//   node scripts/validate.mjs
//   node scripts/validate.mjs examples/finding.v2.json
//   node scripts/validate.mjs --strict
//
// Denetimler:
// 1) JSON Schema 2020-12'nin projede kullanılan alt kümesi
// 2) Kimlik ve kayıtlar arası referans bütünlüğü
// 3) Şema v2 kanıt -> kaynak -> konum zinciri
// 4) Bibliyografik ve editoryal içerik kuralları
// 5) Bayatlık ve doldurma raporu

import {
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { extname, join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_DATA = join(ROOT, "data", "findings");
const SCHEMA_PATH = join(ROOT, "schema", "finding.schema.json");
const ARTICLES_PATH = join(ROOT, "data", "articles.json");

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const inputArgs = args.filter((arg) => !arg.startsWith("--"));
const schema = JSON.parse(readFileSync(SCHEMA_PATH, "utf8"));

const errors = [];
const warnings = [];
const all = [];

function jsonPointerGet(root, ref) {
  if (!ref.startsWith("#/")) {
    throw new Error(`yalnızca yerel JSON Pointer destekleniyor: ${ref}`);
  }
  return ref
    .slice(2)
    .split("/")
    .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"))
    .reduce((value, part) => value?.[part], root);
}

function schemaErrors(value, sch, path) {
  const out = [];

  if (sch.$ref) {
    const target = jsonPointerGet(schema, sch.$ref);
    if (!target) return [`${path}: çözülemeyen şema başvurusu ${sch.$ref}`];
    return schemaErrors(value, target, path);
  }

  if (sch.oneOf) {
    const attempts = sch.oneOf.map((candidate) => schemaErrors(value, candidate, path));
    const matches = attempts.filter((candidateErrors) => candidateErrors.length === 0);
    if (matches.length !== 1) {
      out.push(`${path}: oneOf seçeneklerinden tam olarak biriyle eşleşmeli`);
      if (matches.length === 0) {
        const detail = attempts
          .map((candidateErrors) => candidateErrors[0])
          .filter(Boolean)
          .slice(0, 2)
          .join(" | ");
        if (detail) out.push(`${path}: ${detail}`);
      }
    }
    return out;
  }

  if (sch.enum && !sch.enum.includes(value)) {
    out.push(`${path}: '${value}' geçersiz. İzinli: ${sch.enum.join(", ")}`);
    return out;
  }

  const type = sch.type;
  if (type === "object") {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return [`${path}: nesne bekleniyordu`];
    }

    for (const key of sch.required ?? []) {
      if (!(key in value)) out.push(`${path}.${key}: zorunlu alan eksik`);
    }

    if (sch.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(sch.properties ?? {})[key]) out.push(`${path}.${key}: şemada tanımsız alan`);
      }
    }

    for (const [key, child] of Object.entries(value)) {
      const childSchema = (sch.properties ?? {})[key];
      if (childSchema) out.push(...schemaErrors(child, childSchema, `${path}.${key}`));
    }
  } else if (type === "array") {
    if (!Array.isArray(value)) return [`${path}: dizi bekleniyordu`];

    if (sch.minItems !== undefined && value.length < sch.minItems) {
      out.push(`${path}: en az ${sch.minItems} öğe gerekli`);
    }
    if (sch.maxItems !== undefined && value.length > sch.maxItems) {
      out.push(`${path}: en fazla ${sch.maxItems} öğe olabilir`);
    }
    if (sch.uniqueItems) {
      const seen = new Set();
      value.forEach((item, index) => {
        const key = JSON.stringify(item);
        if (seen.has(key)) out.push(`${path}[${index}]: yinelenen öğe`);
        seen.add(key);
      });
    }
    value.forEach((item, index) => {
      if (sch.items) out.push(...schemaErrors(item, sch.items, `${path}[${index}]`));
    });
  } else if (type === "string") {
    if (typeof value !== "string") return [`${path}: metin bekleniyordu`];
    if (sch.pattern && !new RegExp(sch.pattern).test(value)) {
      out.push(`${path}: '${value}' biçime uymuyor (${sch.pattern})`);
    }
    if (sch.minLength !== undefined && value.length < sch.minLength) {
      out.push(`${path}: en az ${sch.minLength} karakter olmalı`);
    }
    if (sch.maxLength !== undefined && value.length > sch.maxLength) {
      out.push(`${path}: en fazla ${sch.maxLength} karakter olabilir`);
    }
  } else if (type === "integer") {
    if (!Number.isInteger(value)) return [`${path}: tam sayı bekleniyordu`];
    if (value === 0) out.push(`${path}: sıfır yılı yoktur (MÖ 1 = -1, MS 1 = 1)`);
    if (sch.minimum !== undefined && value < sch.minimum) out.push(`${path}: ${sch.minimum} altında`);
    if (sch.maximum !== undefined && value > sch.maximum) out.push(`${path}: ${sch.maximum} üstünde`);
  } else if (type === "number") {
    if (typeof value !== "number" || Number.isNaN(value)) return [`${path}: sayı bekleniyordu`];
    if (sch.minimum !== undefined && value < sch.minimum) out.push(`${path}: ${sch.minimum} altında`);
    if (sch.maximum !== undefined && value > sch.maximum) out.push(`${path}: ${sch.maximum} üstünde`);
  } else if (type === "boolean") {
    if (typeof value !== "boolean") out.push(`${path}: boolean bekleniyordu`);
  }

  return out;
}

function collectJsonFiles(inputPath) {
  const absolute = resolve(inputPath);
  const stat = statSync(absolute);
  if (stat.isDirectory()) {
    return readdirSync(absolute)
      .filter((name) => extname(name) === ".json")
      .sort((a, b) => a.localeCompare(b, "tr"))
      .map((name) => join(absolute, name));
  }
  return [absolute];
}

const inputs = inputArgs.length ? inputArgs : [DEFAULT_DATA];
let files = [];
for (const input of inputs) {
  try {
    files.push(...collectJsonFiles(input));
  } catch (error) {
    errors.push(`${input}: giriş okunamadı - ${error.message}`);
  }
}
files = [...new Set(files)];

for (const file of files) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${file}: JSON okunamadı - ${error.message}`);
    continue;
  }

  const records = Array.isArray(parsed) ? parsed : [parsed];
  records.forEach((record, index) => {
    const label = `${file}[${index}]${record?.id ? ` ${record.id}` : ""}`;
    errors.push(...schemaErrors(record, schema, label));
    if (record && typeof record === "object" && !Array.isArray(record)) {
      all.push({ ...record, __file: file, __index: index });
    }
  });
}

let articles = {};
try {
  articles = JSON.parse(readFileSync(ARTICLES_PATH, "utf8"));
} catch (error) {
  warnings.push(`data/articles.json okunamadı - used_in denetimi atlandı: ${error.message}`);
}
const articleSlugs = new Set(Object.keys(articles));

function isValidDateString(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function validateDate(value, path) {
  if (value !== undefined && !isValidDateString(value)) errors.push(`${path}: geçerli bir YYYY-AA-GG tarihi değil`);
}

function isEvidenceObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sourceQualityRules(record, source, sourcePath, version) {
  if (source.doi && !/^10\.\d{4,9}\/\S+$/i.test(source.doi)) {
    errors.push(`${sourcePath}.doi: DOI biçimi geçersiz`);
  }

  if (source.url) {
    if (!/^https?:\/\//i.test(source.url)) errors.push(`${sourcePath}.url: http(s) URL bekleniyordu`);
    else if (/^http:\/\//i.test(source.url)) warnings.push(`${sourcePath}.url: HTTPS yerine HTTP kullanılıyor`);
  }
  validateDate(source.accessed, `${sourcePath}.accessed`);

  if (version !== 2) return;

  if (!source.id) errors.push(`${sourcePath}.id: şema sürümü 2 için zorunlu`);
  if (!source.type) errors.push(`${sourcePath}.type: şema sürümü 2 için zorunlu`);

  if (source.tier === "peer-reviewed") {
    if (!(source.authors?.length)) errors.push(`${sourcePath}.authors: hakemli kaynakta zorunlu`);
    if (!source.year) errors.push(`${sourcePath}.year: hakemli kaynakta zorunlu`);
    if (!source.container && !source.publisher) {
      errors.push(`${sourcePath}: hakemli kaynakta container veya publisher gerekli`);
    }
    if (!source.doi && !source.url && !source.isbn) {
      errors.push(`${sourcePath}: hakemli kaynakta DOI, URL veya ISBN gerekli`);
    }
  }

  if (source.tier === "institutional") {
    if (!source.institution) errors.push(`${sourcePath}.institution: kurumsal kaynakta zorunlu`);
    if (!source.url && !source.publisher) {
      errors.push(`${sourcePath}: kurumsal kaynakta URL veya publisher gerekli`);
    }
  }

  if (["popular", "unreliable"].includes(source.tier) && !source.url) {
    warnings.push(`${sourcePath}.url: popüler iddianın kökenini yeniden bulabilmek için URL önerilir`);
  }
}

const seenRecords = new Map();
for (const record of all) {
  if (!record.id) continue;
  const location = `${record.__file}[${record.__index}]`;
  if (seenRecords.has(record.id)) {
    errors.push(`Çakışan id '${record.id}': ${seenRecords.get(record.id)} ve ${location}`);
  } else {
    seenRecords.set(record.id, location);
  }
}

let v2Records = 0;
let legacyEvidenceItems = 0;
let linkedEvidenceItems = 0;
let citations = 0;
let sourcesWithoutId = 0;

for (const record of all) {
  const version = record.schema_version ?? 1;
  const base = `${record.__file}[${record.__index}]${record.id ? ` ${record.id}` : ""}`;
  if (version === 2) v2Records += 1;
  if (strict && version !== 2) errors.push(`${base}.schema_version: --strict modunda sürüm 2 zorunlu`);

  validateDate(record.checked, `${base}.checked`);
  validateDate(record.review?.reviewed_at, `${base}.review.reviewed_at`);
  validateDate(record.review?.next_review_at, `${base}.review.next_review_at`);

  const period = record.period ?? {};
  if (Number.isInteger(period.earliest)
      && Number.isInteger(period.latest)
      && period.earliest > period.latest) {
    errors.push(`${base}.period: earliest (${period.earliest}) latest (${period.latest}) değerinden büyük`);
  }

  if (["contested", "minority"].includes(record.status) && !(record.counter_evidence?.length)) {
    warnings.push(`${record.id}: '${record.status}' ama counter_evidence boş - tek taraflı kayıt`);
  }
  if (record.popular_claim && !record.divergence) {
    warnings.push(`${record.id}: popular_claim var ama divergence yok - sapmanın mekanizması yazılmamış`);
  }
  if (record.status === "unmeasurable" && !(record.counter_evidence?.length || record.open_questions?.length)) {
    warnings.push(`${record.id}: unmeasurable ama yöntemin sınırı counter_evidence/open_questions içinde açıklanmamış`);
  }

  const sourceIds = new Map();
  (record.sources ?? []).forEach((source, index) => {
    const sourcePath = `${base}.sources[${index}]`;
    sourceQualityRules(record, source, sourcePath, version);
    if (!source.id) {
      sourcesWithoutId += 1;
      return;
    }
    if (sourceIds.has(source.id)) {
      errors.push(`${sourcePath}.id: yinelenen kaynak kimliği '${source.id}'`);
    } else {
      sourceIds.set(source.id, index);
    }
  });

  const evidenceIds = new Set();
  for (const field of ["evidence", "counter_evidence"]) {
    (record[field] ?? []).forEach((item, index) => {
      const itemPath = `${base}.${field}[${index}]`;
      if (!isEvidenceObject(item)) {
        legacyEvidenceItems += 1;
        if (version === 2) errors.push(`${itemPath}: şema sürümü 2 için kaynak bağlantılı nesne olmalı`);
        return;
      }

      linkedEvidenceItems += 1;
      if (evidenceIds.has(item.id)) errors.push(`${itemPath}.id: bulgu içinde yinelenen kanıt kimliği '${item.id}'`);
      evidenceIds.add(item.id);

      (item.citations ?? []).forEach((citation, citationIndex) => {
        citations += 1;
        const citationPath = `${itemPath}.citations[${citationIndex}]`;
        if (!sourceIds.has(citation.source_ref)) {
          errors.push(`${citationPath}.source_ref: '${citation.source_ref}' sources içinde bulunamadı`);
        }
        if (field === "counter_evidence"
            && !["counter", "context", "claim-origin"].includes(citation.support_type)) {
          warnings.push(`${citationPath}.support_type: karşı kanıt için '${citation.support_type}' beklenmedik`);
        }
      });
    });
  }

  if (version === 2) {
    if (!record.review) warnings.push(`${record.id}: şema sürümü 2 ama review kaydı yok`);
    if (!(record.evidence?.length || record.counter_evidence?.length)) {
      errors.push(`${record.id}: şema sürümü 2 kaydında en az bir kanıt veya karşı kanıt gerekli`);
    }
  }

  const onlyWeak = (record.sources ?? []).every((source) => ["popular", "unreliable"].includes(source.tier));
  if (onlyWeak) errors.push(`${record.id}: yalnızca popular/unreliable kaynak - iddia desteklenmiyor`);

  for (const slug of record.used_in ?? []) {
    if (articleSlugs.size && !articleSlugs.has(slug)) {
      errors.push(`${record.id}.used_in: '${slug}' data/articles.json içinde bulunamadı`);
    }
  }

  for (const supersededId of record.supersedes ?? []) {
    if (!seenRecords.has(supersededId)) warnings.push(`${record.id}: supersedes '${supersededId}' bulunamadı`);
  }
  if (record.superseded_by && !seenRecords.has(record.superseded_by)) {
    warnings.push(`${record.id}: superseded_by '${record.superseded_by}' bulunamadı`);
  }

  if (record.volatile && isValidDateString(record.checked)) {
    const today = new Date();
    const checkedAt = new Date(`${record.checked}T00:00:00Z`);
    const days = (today - checkedAt) / 86_400_000;
    if (days > 180) warnings.push(`${record.id}: volatile ve ${Math.round(days)} gündür kontrol edilmemiş`);
  }
}

for (const record of all) {
  if (record.superseded_by) {
    const replacement = all.find((candidate) => candidate.id === record.superseded_by);
    if (replacement && !(replacement.supersedes ?? []).includes(record.id)) {
      warnings.push(`${record.id}: superseded_by '${record.superseded_by}' karşı kayıtta supersedes olarak yer almıyor`);
    }
  }
}

const by = (selector) => all.reduce((counts, record) => {
  const key = selector(record);
  counts[key] = (counts[key] ?? 0) + 1;
  return counts;
}, {});
const pct = (count) => all.length ? `${Math.round((count / all.length) * 100)}%` : "0%";
const has = (field) => all.filter((record) => {
  const value = record[field];
  return value !== undefined && (!Array.isArray(value) || value.length > 0);
}).length;

console.log("\n=== BULGU VERİ TABANI ===");
console.log(`Kayıt: ${all.length}   Dosya: ${new Set(all.map((record) => record.__file)).size}`);
console.log(`Şema v2: ${v2Records}/${all.length}   Bağlı kanıt: ${linkedEvidenceItems}   Atıf: ${citations}`);
console.log(`Geçiş borcu: ${legacyEvidenceItems} eski kanıt satırı · ${sourcesWithoutId} kimliksiz kaynak\n`);

if (all.length) {
  console.log("Durum dağılımı:");
  for (const [key, value] of Object.entries(by((record) => record.status)).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(key).padEnd(14)} ${String(value).padStart(3)}  ${pct(value)}`);
  }

  console.log("\nAlan doldurma oranı (yapılandırılmış alanlar):");
  for (const field of [
    "subject",
    "period",
    "languages",
    "disciplines",
    "people",
    "popular_claim",
    "divergence_type",
    "counter_evidence",
    "open_questions",
    "review",
  ]) {
    console.log(`  ${field.padEnd(18)} ${String(has(field)).padStart(3)}/${all.length}  ${pct(has(field))}`);
  }

  const tiers = all.flatMap((record) => (record.sources ?? []).map((source) => source.tier));
  console.log(`\nKaynak katmanları (${tiers.length} kaynak):`);
  const tierCounts = tiers.reduce((counts, tier) => {
    counts[tier] = (counts[tier] ?? 0) + 1;
    return counts;
  }, {});
  for (const [key, value] of Object.entries(tierCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${key.padEnd(14)} ${String(value).padStart(3)}`);
  }
}

if (warnings.length) {
  console.log(`\n--- UYARI (${warnings.length}) ---`);
  warnings.forEach((warning) => console.log(`  ! ${warning}`));
}

if (errors.length) {
  console.log(`\n--- HATA (${errors.length}) ---`);
  errors.forEach((error) => console.log(`  x ${error}`));
  console.log("");
  process.exit(1);
}

console.log("\nGeçerli. Hata yok.\n");
