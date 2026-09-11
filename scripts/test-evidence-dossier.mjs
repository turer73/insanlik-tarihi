#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { renderEvidenceIntro, renderEvidenceDossier } from "./lib/evidence-dossier.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundle = JSON.parse(await readFile(path.join(root, "data/findings.bundle.json"), "utf8"));
const articles = JSON.parse(await readFile(path.join(root, "data/articles.json"), "utf8"));
const allSlugs = Object.keys(articles);
const pilotSlugs = ["iskenderiye", "kapadokya", "babil"];
const pilot = bundle.filter((finding) => finding.used_in?.some((slug) => pilotSlugs.includes(slug)));

assert.ok(pilot.length > 0, "pilot gerçek bulgu içermeli");
assert.equal(new Set(pilot.map((finding) => finding.id)).size, pilot.length, "pilot bulgu kimlikleri benzersiz olmalı");
function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function assertV2References(findings, html, label) {
  for (const finding of findings.filter((item) => item.schema_version === 2)) {
  const sources = new Set((finding.sources ?? []).map((source) => source.id));
    assert.ok(!sources.has(undefined), `${label}/${finding.id}: v2 kaynağının kimliği olmalı`);
    const sourceById = new Map((finding.sources ?? []).map((source) => [source.id, source]));
  for (const item of [...(finding.evidence ?? []), ...(finding.counter_evidence ?? [])]) {
      assert.notEqual(typeof item, "string", `${label}/${finding.id}: v2 kanıtı kaynak eşlemesi taşımalı`);
    for (const citation of item.citations ?? []) {
        assert.ok(sources.has(citation.source_ref), `${label}/${finding.id}: ${citation.source_ref} kaynak eşlemesi bulunmalı`);
        assert.ok(citation.locator?.trim(), `${label}/${finding.id}: atıf sayfa/pasaj konumu içermeli`);
        const source = sourceById.get(citation.source_ref);
        assert.ok(html.includes(escapeHTML(source.title)), `${label}/${finding.id}: kaynak başlığı render kaybı olmadan görünmeli`);
        assert.ok(html.includes(escapeHTML(citation.locator)), `${label}/${finding.id}: sayfa/pasaj metni render kaybı olmadan görünmeli`);
      }
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
assert.doesNotMatch(intro, /Tümü yüksek güven/);

// "Kaydı belirtilmemiş" sayacı CANLI VERİYE bağlanmıştı ve v2 geçişi bitince
// düştü: artık her bulguda review alanı var, dolayısıyla pilot kümede
// kaydedilmemiş bulgu kalmadı. Test doğru şeyi sınıyordu ama yanlış yerden -
// sayacın çalışıp çalışmadığı, veri kümesinin o an eksik bulgu içermesine
// bağlı olmamalı. Kurgulanmış girdiyle sınanıyor.
const introKayitsiz = renderEvidenceIntro({ title: "Kayıtsız" }, [
  { id: "a", review: { status: "draft" } },
  { id: "b", review: { status: "editor-reviewed" } },
  { id: "c" },
]);
assert.match(introKayitsiz, /1 taslak/);
assert.match(introKayitsiz, /1 incelenmiş/);
assert.match(introKayitsiz, /1 inceleme kaydı belirtilmemiş/);
// Ve tersi: hiç eksik yoksa o cümle parçası HİÇ görünmemeli.
assert.doesNotMatch(
  renderEvidenceIntro({ title: "Tam" }, [{ id: "a", review: { status: "draft" } }]),
  /inceleme kaydı belirtilmemiş/,
);

const dossier = renderEvidenceDossier({ title: "Pilot" }, pilot);
assertV2References(pilot, dossier, "pilot");
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
assert.match(dossier, /class="ka-review-note"/);
assert.match(dossier, /hakemli Türkçe jeoarkeoloji literatürü hâlâ taranmadı/);

// "Kaynağa eşleştirilmemiş" uyarısı da CANLI VERİYE bağlanmıştı: v1 kanıtı
// düz bir dizgidir ve bu uyarıyı tetikler. v2 geçişi bitince pilot kümede
// dizgi kanıt kalmadı, iddia düştü. Uyarı hâlâ gerekli - eski kayıtlar geri
// gelebilir, üretici de citations'ı boş bir v2 kanıtı için aynı uyarıyı
// veriyor - o yüzden iki yolu da kurgulanmış girdiyle sınıyoruz.
const eslesmemis = renderEvidenceDossier({ title: "Eşleşmemiş" }, [{
  id: "dizgi-kanit", claim: "Eski biçim", status: "contested", confidence: "low",
  evidence: ["kaynağa bağlanmamış düz metin"], counter_evidence: [],
  sources: [], review: { status: "draft" },
}, {
  id: "bos-atif", claim: "Yeni biçim ama atıfsız", status: "contested", confidence: "low",
  evidence: [{ text: "atıf listesi boş", citations: [] }], counter_evidence: [],
  sources: [], review: { status: "draft" },
}]);
assert.equal(
  [...eslesmemis.matchAll(/belirli bir kaynak ve sayfa\/pasajla eşleştirilmemiş/g)].length, 2,
  "hem dizgi kanıt hem atıfsız v2 kanıdı eşleşmemiş olarak işaretlenmeli",
);

const ids = [...dossier.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "üretici tüm HTML kimliklerini benzersiz tutmalı");

const allDossier = renderEvidenceDossier({ title: "Tüm bulgular" }, bundle);
const allIds = [...allDossier.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(allIds.length, new Set(allIds).size, "tüm veri kümesinde renderer yinelenen kimlik üretmemeli");
for (const [, target] of allDossier.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(allIds.includes(target), `tüm veri kümesinde iç bağlantı hedefi olmalı: ${target}`);
}
for (const finding of bundle) {
  assert.ok(allDossier.includes(`id="bulgu-${finding.id}"`), `${finding.id}: tam renderda bulgu kimliği kaybolmamalı`);
}
assertV2References(bundle, allDossier, "tüm-bulgular");

const renderedFindingIds = new Set();
for (const slug of allSlugs) {
  const findings = bundle.filter((finding) => finding.used_in?.includes(slug));
  assert.ok(findings.length, `${slug}: yazının en az bir bulgu kaydı olmalı`);
  const rendered = renderEvidenceDossier({ title: articles[slug].title }, findings);
  const localIds = [...rendered.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(localIds.length, new Set(localIds).size, `${slug}: renderer yinelenen kimlik üretmemeli`);
  for (const [, target] of rendered.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(localIds.includes(target), `${slug}: render edilen iç bağlantı hedefi olmalı: ${target}`);
  }
  for (const finding of findings) {
    assert.ok(rendered.includes(`id="bulgu-${finding.id}"`), `${slug}/${finding.id}: bulgu kimliği kaybolmamalı`);
    renderedFindingIds.add(finding.id);
  }
  assertV2References(findings, rendered, slug);
}
const articleFindings = bundle.filter((finding) => finding.used_in?.some((slug) => allSlugs.includes(slug)));
assert.equal(renderedFindingIds.size, new Set(articleFindings.map((finding) => finding.id)).size, "makaleye bağlı her bulgu 27 yazı kapsamına girmeli");

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

console.log(`Kanıt dosyası testi: ${allSlugs.length} yazıdaki ${renderedFindingIds.size} bağlı bulgu ve bundle'daki ${bundle.length} kayıt; v1/v2, kaynak çapaları ve XSS/URL koruması doğrulandı.`);
