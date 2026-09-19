#!/usr/bin/env node
// Her test tek bir soru soruyor: bu modül YAKALIYOR mu?
//
// icerikTarihleri'nin testi ayrı dosyada (test-icerik-surumu.mjs) ve orada
// tarih koruma mantığı sınanıyor. Burada sınanan şey ONDAN ÖNCEKİ adım:
// bir sayfanın "içeriği" diye NEYİ ölçtüğümüz. İki yönlü hata mümkün ve
// ikisi de sinyali bozar:
//   - fazla ölçmek: tasarım değişimi tarihleri oynatır (satır yüksekliği olayı)
//   - eksik ölçmek: gerçek metin değişir, tarih yerinde kalır (bulgu notları)
// Bu dosya ikincisinin regresyonunu tutuyor.

import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { icerikGirdileri } from "./lib/icerik-girdileri.mjs";
import { hashla, metinOzu } from "./lib/icerik-surumu.mjs";

let sayac = 0;
const t = async (ad, fn) => { await fn(); sayac += 1; };

const YAZILAR = [
  { slug: "alfa", no: 1, title: "Alfa", summary: "Alfa özeti", category: "Tarih", tags: ["a"] },
  { slug: "beta", no: 2, title: "Beta", summary: "Beta özeti", category: "Tarih", tags: ["b"] },
];
const MERKEZLER = { kayip: { slug: "kayip", sira: 1, baslik: "Kayıp", dosyalar: ["alfa", "beta"] } };

function bulgu(id, yazilar, not, doi) {
  const kaynak = { id: `${id}-kaynak`, tier: "primary", type: "book", title: `${id} kaynağı`, note: not };
  if (doi) kaynak.doi = doi;
  return { id, claim: `${id} iddiası`, used_in: yazilar, sources: [kaynak] };
}

/** Küçük ama gerçek bir depo ağacı kurar. */
function depo(bulgular) {
  const kok = mkdtempSync(join(tmpdir(), "girdi-"));
  for (const d of ["articles", "pages", "data", "dist"]) mkdirSync(join(kok, d), { recursive: true });
  writeFileSync(join(kok, "index.html"), "<h1>Ana sayfa</h1>", "utf8");
  for (const a of YAZILAR) {
    writeFileSync(join(kok, "articles", `${a.slug}.html`), `<style>h1{line-height:1}</style><h1>${a.title}</h1><p>${a.slug} gövdesi</p>`, "utf8");
  }
  writeFileSync(join(kok, "pages", "hakkinda.html"), "<h1>Hakkında</h1>", "utf8");
  for (const d of ["zaman-cizelgesi", "bulgu-veri-tabani", "kanit-denetimi"]) {
    // Gerçek araç sayfasının şekli: görünen metin az, veri script bloğunda.
    writeFileSync(join(kok, "dist", `${d}.html`), `<h1>${d}</h1><script>window.VERI=[]</script>`, "utf8");
  }
  const yaz = (ad, veri) => writeFileSync(join(kok, "data", ad), JSON.stringify(veri), "utf8");
  yaz("reading-pilot.json", { alfa: { summary: "alfa kısa", limit: "alfa sınır" }, beta: { summary: "beta kısa", limit: "beta sınır" } });
  yaz("arama-sorulari.json", { alfa: "alfa sorusu", beta: "beta sorusu" });
  yaz("tartisma-pilotu.json", { yazilar: [] });
  yaz("bulten.json", { baslik: "bülten" });
  yaz("konu-merkezleri.json", MERKEZLER);
  yaz("findings.bundle.json", bulgular);
  return kok;
}

const ozetler = async (kok) => {
  const g = await icerikGirdileri(kok, { articles: YAZILAR, hubs: Object.values(MERKEZLER) });
  return Object.fromEntries(Object.entries(g).map(([k, v]) => [k, hashla(metinOzu(v))]));
};

const farklar = (a, b) => Object.keys(a).filter((k) => a[k] !== b[k]).sort();

/* --- yalıtım --- */

await t("yazı anahtarı KENDİ bulgusunu içerir, ötekininkini içermez", async () => {
  const kok = depo([bulgu("alfa-bir", ["alfa"], "alfa notu"), bulgu("beta-bir", ["beta"], "beta notu")]);
  const g = await icerikGirdileri(kok, { articles: YAZILAR, hubs: Object.values(MERKEZLER) });
  assert.ok(g["articles/alfa.html"].includes("alfa-bir"), "yazı kendi bulgusunu taşımalı");
  assert.ok(!g["articles/alfa.html"].includes("beta-bir"), "öteki yazının bulgusu sızmamalı");
  assert.ok(g["articles/beta.html"].includes("beta-bir"));
});

/* --- eksik ölçme regresyonu --- */

await t("REGRESYON: kaynak notu değişince o yazının özeti DEĞİŞİR", async () => {
  // İlk sürümde bulgular yazı anahtarına hiç girmiyordu: kanıt dosyasındaki
  // not düzeltilince sayfa değişiyor, lastmod eski tarihte kalıyordu.
  const once = await ozetler(depo([bulgu("alfa-bir", ["alfa"], "eski not")]));
  const sonra = await ozetler(depo([bulgu("alfa-bir", ["alfa"], "düzeltilmiş not")]));
  assert.ok(farklar(once, sonra).includes("articles/alfa.html"),
    "kanıt dosyasındaki not değişimi yazı özetine yansımalı");
});

await t("kaynak notu değişince YALNIZ ilgili yazılar etkilenir", async () => {
  const once = await ozetler(depo([bulgu("alfa-bir", ["alfa"], "eski"), bulgu("beta-bir", ["beta"], "sabit")]));
  const sonra = await ozetler(depo([bulgu("alfa-bir", ["alfa"], "yeni"), bulgu("beta-bir", ["beta"], "sabit")]));
  const d = farklar(once, sonra);
  assert.ok(d.includes("articles/alfa.html"));
  assert.ok(!d.includes("articles/beta.html"), "dokunulmayan yazı etkilenmemeli");
});

await t("iki yazıya bağlı bulgu ikisini birden etkiler", async () => {
  const once = await ozetler(depo([bulgu("ortak", ["alfa", "beta"], "eski")]));
  const sonra = await ozetler(depo([bulgu("ortak", ["alfa", "beta"], "yeni")]));
  const d = farklar(once, sonra);
  assert.ok(d.includes("articles/alfa.html") && d.includes("articles/beta.html"));
});

await t("REGRESYON: araç sayfası anahtarı bulgu verisini içerir", async () => {
  // Araç sayfalarının içeriği <script> bloğundaki veridir; metinOzu script
  // bloklarını bilerek atar. HTML tek başına anahtar olursa bulgular değişse
  // bile bu üç sayfanın tarihi hiç oynamaz.
  const once = await ozetler(depo([bulgu("alfa-bir", ["alfa"], "eski")]));
  const sonra = await ozetler(depo([bulgu("alfa-bir", ["alfa"], "yeni")]));
  for (const d of ["zaman-cizelgesi", "bulgu-veri-tabani", "kanit-denetimi"]) {
    assert.ok(farklar(once, sonra).includes(`dist/${d}.html`), `dist/${d}.html veri değişimini görmeli`);
  }
});

await t("REGRESYON: kaynakça anahtarı TANIMLAYICI değişimini yakalar", async () => {
  // Sayfanın her girdisinde DOI/ISBN/URL görünüyor. İlk sürümde anahtar yalnız
  // id/katman/başlık/yıl/not/yazı taşıyordu; yanlış yazılmış bir DOI düzeltilince
  // sayfa değişti ama tarihi hiç oynamadı. Bu, aynı gün yazı anahtarında
  // düzeltilen kusurun kaynakça sayfasındaki kopyasıydı.
  const once = await ozetler(depo([bulgu("alfa-bir", ["alfa"], "sabit", "10.1000/eski")]));
  const sonra = await ozetler(depo([bulgu("alfa-bir", ["alfa"], "sabit", "10.1000/yeni")]));
  assert.ok(farklar(once, sonra).includes("kaynakca.html"),
    "tanımlayıcı düzeltmesi kaynakça özetine yansımalı");
});

await t("kaynakça anahtarı künye değişimini yakalar", async () => {
  const once = await ozetler(depo([bulgu("alfa-bir", ["alfa"], "eski")]));
  const sonra = await ozetler(depo([bulgu("alfa-bir", ["alfa"], "yeni")]));
  assert.ok(farklar(once, sonra).includes("kaynakca.html"));
});

/* --- fazla ölçme regresyonu (öteki yön) --- */

await t("REGRESYON: yalnız style değişimi hiçbir özeti değiştirmez", async () => {
  const bulgular = [bulgu("alfa-bir", ["alfa"], "sabit not")];
  const a = depo(bulgular);
  const once = await ozetler(a);
  for (const y of YAZILAR) {
    writeFileSync(join(a, "articles", `${y.slug}.html`),
      `<style>h1{line-height:1.15}</style><h1>${y.title}</h1><p>${y.slug} gövdesi</p>`, "utf8");
  }
  const sonra = await ozetler(a);
  assert.deepEqual(farklar(once, sonra), [], "satır yüksekliği değişimi hiçbir tarihi oynatmamalı");
});

/* --- yardımcı girdiler --- */

await t("bir yazının kısa yanıtı değişince YALNIZ o yazı etkilenir", async () => {
  const bulgular = [bulgu("alfa-bir", ["alfa"], "sabit")];
  const a = depo(bulgular);
  const once = await ozetler(a);
  writeFileSync(join(a, "data", "reading-pilot.json"),
    JSON.stringify({ alfa: { summary: "DEĞİŞTİ", limit: "alfa sınır" }, beta: { summary: "beta kısa", limit: "beta sınır" } }), "utf8");
  const sonra = await ozetler(a);
  assert.deepEqual(farklar(once, sonra), ["articles/alfa.html"]);
});

await t("statik sayfalar pages/ dizininden gelir, elle liste yok", async () => {
  const a = depo([bulgu("alfa-bir", ["alfa"], "sabit")]);
  writeFileSync(join(a, "pages", "yeni-sayfa.html"), "<h1>Yeni</h1>", "utf8");
  const g = await icerikGirdileri(a, { articles: YAZILAR, hubs: Object.values(MERKEZLER) });
  assert.ok("pages/yeni-sayfa.html" in g, "dizine düşen sayfa kendiliğinden anahtar olmalı");
});

await t("konu merkezi kendi girdisine bağlı", async () => {
  const a = depo([bulgu("alfa-bir", ["alfa"], "sabit")]);
  const g = await icerikGirdileri(a, { articles: YAZILAR, hubs: Object.values(MERKEZLER) });
  assert.ok("konular/kayip.html" in g);
  assert.ok("data/konu-merkezleri.json" in g);
});

await t("bulgu dosyası okunamazsa çökmez", async () => {
  const a = depo([bulgu("alfa-bir", ["alfa"], "sabit")]);
  writeFileSync(join(a, "data", "findings.bundle.json"), "{bozuk", "utf8");
  const g = await icerikGirdileri(a, { articles: YAZILAR, hubs: Object.values(MERKEZLER) });
  assert.ok(g["articles/alfa.html"].length > 0, "bozuk veri derlemeyi düşürmemeli");
});

console.log(`içerik girdileri testi: tamam (${sayac} test)`);
