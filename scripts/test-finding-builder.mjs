#!/usr/bin/env node
// Kurucunun HATA YAKALADIĞINI sınar - çalıştığını değil.
// Geçen bir kurucu değersizdir; bozuk veriyi reddeden bir kurucu değerlidir.

import { slug, source, cite, ev, finding } from "./lib/finding.mjs";

let fail = 0;
const ok = (ad) => console.log(`  ok  ${ad}`);
const bad = (ad, detay) => { console.error(`  HATA  ${ad}${detay ? ` - ${detay}` : ""}`); fail += 1; };

/** fn() bir hata fırlatmalı ve mesajı parca içermeli. */
function reddetmeli(ad, parca, fn) {
  try {
    fn();
    bad(ad, "hata fırlatmadı");
  } catch (e) {
    if (parca && !e.message.includes(parca)) bad(ad, `mesaj '${parca}' içermiyor: ${e.message}`);
    else ok(ad);
  }
}

function kabulEtmeli(ad, fn) {
  try { fn(); ok(ad); } catch (e) { bad(ad, e.message); }
}

// --- slug ---
if (slug("Gökteki Ayı ve Şuşter") === "gokteki-ayi-ve-suster") ok("slug: Türkçe harfler");
else bad("slug: Türkçe harfler", slug("Gökteki Ayı ve Şuşter"));

if (slug("  Çift   boşluk!  ") === "cift-boskluk" || slug("  Çift   boşluk!  ") === "cift-bosluk") ok("slug: boşluk ve noktalama");
else bad("slug: boşluk ve noktalama", slug("  Çift   boşluk!  "));

if (slug("Düzenek laboratuvarda elektrolitle küçük bir gerilim üretir; bu gözlem") === "duzenek-laboratuvarda-elektrolitle-kucuk-bir-gerilim-uretir") ok("slug: 60 karakter sınırında sondaki tire düşer");
else bad("slug: 60 karakter sınırı", slug("Düzenek laboratuvarda elektrolitle küçük bir gerilim üretir; bu gözlem"));

// --- kurucu parçaları ---
reddetmeli("source: kimliksiz reddedilir", "kimlik zorunlu", () => source("", { tier: "primary", type: "edition", title: "X" }));
reddetmeli("source: tier'sız reddedilir", "tier zorunlu", () => source("a", { type: "article", title: "X" }));
reddetmeli("cite: locator'sız reddedilir", "locator zorunlu", () => cite("a", ""));
reddetmeli("ev: atıfsız reddedilir", "en az bir cite", () => ev("Bir iddia.", []));

const s1 = source("kaynak-bir", {
  tier: "peer-reviewed", type: "article", title: "Bir makale", year: 2020, language: "en",
  authors: ["Yazar, Bir"], container: "Bir Dergi", doi: "10.1000/ornek.1",
});


// --- kunye kurallari (v2) ---
reddetmeli("source: hakemli kaynakta DOI/URL/ISBN yoksa reddedilir", "DOI, URL veya ISBN",
  () => source("h1", { tier: "peer-reviewed", type: "article", title: "T", year: 2000, authors: ["A"], container: "C" }));
reddetmeli("source: hakemli kaynakta authors yoksa reddedilir", "authors zorunlu",
  () => source("h2", { tier: "peer-reviewed", type: "article", title: "T", year: 2000, container: "C", doi: "10.1000/x" }));
reddetmeli("source: kurumsal kaynakta institution yoksa reddedilir", "institution zorunlu",
  () => source("k1", { tier: "institutional", type: "webpage", title: "T", url: "https://x.example" }));
reddetmeli("source: gecersiz DOI reddedilir", "DOI biçimi geçersiz",
  () => source("d1", { tier: "primary", type: "edition", title: "T", doi: "bu-doi-degil" }));
reddetmeli("source: type yoksa reddedilir", "type zorunlu",
  () => source("t1", { tier: "primary", title: "T" }));

// --- finding: bağlantı bütünlüğü ---
reddetmeli(
  "finding: var olmayan kaynağa atıf yakalanır",
  "böyle bir kaynak yok",
  () => finding({
    id: "t1", claim: "Bir iddia.", status: "established", topic: ["t"], checked: "2026-09-07",
    sources: [s1],
    evidence: [ev("Kanıt.", cite("olmayan-kaynak", "s. 1"))],
  }),
);

reddetmeli(
  "finding: düz metin kanıt yakalanır",
  "düz metin",
  () => finding({
    id: "t2", claim: "Bir iddia.", status: "established", topic: ["t"], checked: "2026-09-07",
    sources: [s1],
    evidence: ["Sürüm 1 tarzı düz metin kanıt."],
  }),
);

reddetmeli(
  "finding: yinelenen kanıt kimliği yakalanır",
  "yinelenen kanıt kimliği",
  () => finding({
    id: "t3", claim: "Bir iddia.", status: "established", topic: ["t"], checked: "2026-09-07",
    sources: [s1],
    evidence: [
      ev("Aynı metin.", cite("kaynak-bir", "s. 1")),
      ev("Aynı metin.", cite("kaynak-bir", "s. 2")),
    ],
  }),
);

reddetmeli(
  "finding: yinelenen kaynak kimliği yakalanır",
  "yinelenen kaynak kimliği",
  () => finding({
    id: "t4", claim: "Bir iddia.", status: "established", topic: ["t"], checked: "2026-09-07",
    sources: [s1, source("kaynak-bir", { tier: "primary", type: "edition", title: "Başka" })],
  }),
);

reddetmeli(
  "finding: counter_evidence'ta yanlış support_type yakalanır",
  "support_type",
  () => finding({
    id: "t5", claim: "Bir iddia.", status: "contested", topic: ["t"], checked: "2026-09-07",
    sources: [s1],
    counter_evidence: [ev("Karşı kanıt.", cite("kaynak-bir", "s. 3", "direct"))],
  }),
);

reddetmeli(
  "finding: yalnızca zayıf kaynak yakalanır",
  "iddia desteklenmiyor",
  () => finding({
    id: "t6", claim: "Bir iddia.", status: "established", topic: ["t"], checked: "2026-09-07",
    sources: [source("blog", { tier: "popular", type: "webpage", title: "Bir blog", url: "https://x.example/y" })],
  }),
);

// --- finding: geçerli kayıt ---
let saglam;
kabulEtmeli("finding: geçerli kayıt kabul edilir", () => {
  saglam = finding({
    id: "t-saglam", claim: "Geçerli bir iddia.", status: "contested", topic: ["t"],
    checked: "2026-09-07",
    sources: [s1, source("kaynak-iki", { tier: "primary", type: "edition", title: "Bir metin" })],
    evidence: [ev("Destekleyen kanıt.", cite("kaynak-bir", "Özet, madde 2"))],
    counter_evidence: [ev("Zayıflatan kanıt.", cite("kaynak-iki", "XI. tablet", "counter"))],
  });
});

if (saglam?.schema_version === 2) ok("finding: schema_version 2 varsayılan");
else bad("finding: schema_version 2 varsayılan", String(saglam?.schema_version));

if (saglam?.review?.status === "draft") ok("finding: review varsayılanı draft");
else bad("finding: review varsayılanı draft", JSON.stringify(saglam?.review));

if (saglam?.evidence?.[0]?.id === "destekleyen-kanit") ok("finding: kanıt kimliği metinden türetilir");
else bad("finding: kanıt kimliği metinden türetilir", saglam?.evidence?.[0]?.id);

if (fail) {
  console.error(`\nkurucu testi: ${fail} başarısız`);
  process.exit(1);
}
console.log("kurucu testi: tamam");
