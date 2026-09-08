#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { renderEvidenceIntro, renderEvidenceDossier } from "./lib/evidence-dossier.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundle = JSON.parse(await readFile(path.join(root, "data/findings.bundle.json"), "utf8"));
const pilotSlugs = ["iskenderiye", "kapadokya", "babil"];
const pilot = bundle.filter((finding) => finding.used_in?.some((slug) => pilotSlugs.includes(slug)));

assert.ok(pilot.length > 0, "pilot gerçek bulgu içermeli");
assert.equal(pilot.length, 18, "pilot üç yazı için beklenen 18 gerçek bulguyu içermeli");
assert.equal(new Set(pilot.map((finding) => finding.id)).size, pilot.length, "pilot bulgu kimlikleri benzersiz olmalı");
for (const finding of pilot.filter((item) => item.schema_version === 2)) {
  const sources = new Set((finding.sources ?? []).map((source) => source.id));
  assert.ok(!sources.has(undefined), `${finding.id}: v2 kaynağının kimliği olmalı`);
  for (const item of [...(finding.evidence ?? []), ...(finding.counter_evidence ?? [])]) {
    assert.notEqual(typeof item, "string", `${finding.id}: v2 kanıtı kaynak eşlemesi taşımalı`);
    for (const citation of item.citations ?? []) {
      assert.ok(sources.has(citation.source_ref), `${finding.id}: ${citation.source_ref} kaynak eşlemesi bulunmalı`);
      assert.ok(citation.locator?.trim(), `${finding.id}: atıf sayfa/pasaj konumu içermeli`);
    }
  }
}
const intro = renderEvidenceIntro(
  { title: "Pilot" },
  pilot,
  { summary: "Kısa <yanıt>", limit: "Kapsam & sınır" },
);
assert.match(intro, /class="ka-evidence-intro"/);
assert.match(intro, /class="ka-reading-nav"/);
assert.match(intro, /href="#kanit-dosyasi"/);
assert.match(intro, /href="#ka-anlati"/);
assert.match(intro, /Kısa &lt;yanıt&gt;/);
assert.match(intro, /taslak/);
assert.match(intro, /inceleme kaydı belirtilmemiş/);
assert.doesNotMatch(intro, /Tümü yüksek güven/);

const dossier = renderEvidenceDossier({ title: "Pilot" }, pilot);
assert.match(dossier, /<section class="ka-evidence-dossier" id="kanit-dosyasi"/);
assert.match(dossier, /class="ka-section-heading"/);
assert.match(dossier, /<details class="ka-finding" id="bulgu-iskenderiye-tek-yangin-yok"/);
assert.match(dossier, /Kanıt/);
assert.match(dossier, /Karşı kanıt/);
assert.match(dossier, /class="ka-sources"/);
assert.match(dossier, /class="ka-citation" href="#kaynak-/);
assert.match(dossier, /Alexandria: Library of Dreams,/, "atıf teknik kimlik yerine okunabilir kaynak başlığını göstermeli");
assert.doesNotMatch(dossier, />bagnall-2002-library-dreams,/, "çözülen kaynak kimliği kullanıcıya gösterilmemeli");
assert.match(dossier, /class="ka-source-backlink" href="#bulgu-iskenderiye-tek-yangin-yok-kanit-/);
assert.match(dossier, /belirli bir kaynak ve sayfa\/pasajla eşleştirilmemiş/);
assert.match(dossier, /class="ka-review-note"/);
assert.match(dossier, /hakemli Türkçe jeoarkeoloji literatürü hâlâ taranmadı/);

const ids = [...dossier.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "üretici tüm HTML kimliklerini benzersiz tutmalı");

const unsafe = renderEvidenceDossier({ title: "<img>" }, [{
  id: "kotu\"><img src=x onerror=1>",
  claim: "<script>alert(1)</script>",
  status: "established",
  confidence: "high",
  evidence: [{ text: "<b>metin</b>", citations: [
    { source_ref: "olmayan", locator: "<bölüm>", support_type: "direct" },
  ] }],
  counter_evidence: [],
  open_questions: ["<soru>"],
  sources: [{
    id: "kotu",
    title: "<kaynak>",
    institution: "<kurum>",
    url: "javascript:alert(1)",
    doi: "not-a-doi",
    note: "<not>",
  }],
  review: { status: "draft" },
}]);
assert.doesNotMatch(unsafe, /<script>|<img src=x|javascript:/i, "metin ve URL'ler HTML/URL enjeksiyonuna kapalı olmalı");
assert.match(unsafe, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
assert.match(unsafe, /Kaynak eşlemesi eksik: olmayan, &lt;bölüm&gt; \(doğrudan\)/);
assert.match(unsafe, /&lt;kurum&gt;/, "kurumsal kaynak üstverisi görünür olmalı");
assert.match(unsafe, /id="bulgu-kotu-img-src-x-onerror-1"/);

console.log(`Kanıt dosyası testi: ${pilot.length} gerçek pilot bulgusu, v1/v2, kaynak çapaları ve XSS/URL koruması doğrulandı.`);
