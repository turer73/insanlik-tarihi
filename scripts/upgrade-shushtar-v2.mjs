#!/usr/bin/env node
// Şuşter kayıtları: v1 -> v2 göçü ve zayıf kaydın güçlendirilmesi.
//
// NEDEN "TÜRKÇE KAYNAK" DEĞİL: Kapadokya ve Taş Tepeler'de uygulanan
// yöntem burada geçerli değil. Şuşter İran'dadır; konunun doğal kaynak
// dilleri Farsça ve İngilizcedir. Türkçe arama yalnızca turizm içeriği
// döndürdü. Yöntemi zorlamak, tam da bu projenin eleştirdiği şey olurdu:
// kaynağı konuya değil, kendi hedefine göre seçmek.
//
// Bunun yerine yapılan: iki kaydı da v2'ye taşımak ve tek kaynaklı olan
// zayıf kaydı (darius-kokeni) ikinci bir dayanakla güçlendirmek.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/antik-siteler.json";
const CHECKED = "2026-09-07";

/* --- kaynaklar ----------------------------------------------------- */

const unesco = source("unesco-1315-shushtar", {
  tier: "institutional",
  type: "webpage",
  title: "Shushtar Historical Hydraulic System",
  institution: "UNESCO World Heritage Centre",
  url: "https://whc.unesco.org/en/list/1315/",
  language: "en",
  accessed: CHECKED,
  note: "2009'da Dünya Mirası listesine alındı (İran'ın 10. alanı). Resmî tescil metni.",
});

const bandeKaisar = source("band-e-kaisar-koprubent-muhendisligi", {
  tier: "peer-reviewed",
  type: "article",
  authors: ["Hodge, A. Trevor"],
  title: "Band-e Kaisar ve Sasani dönemi köprü-bent mühendisliği üzerine değerlendirme",
  container: "Roma hidrolik mühendisliği literatürü",
  year: 1992,
  url: "https://whc.unesco.org/en/list/1315/",
  language: "en",
  note: "Önceki sürümden korunan kaynak. KÜNYE EKSİK: yazar ve yıl doğrulanmadı, kapsayıcı dergi adı belirsiz. Birincil künye ile değiştirilmelidir.",
});

/* --- 1) Teknoloji transferi ---------------------------------------- */

const transfer = finding({
  id: "shushtar-band-e-kaisar-teknoloji-transferi",
  claim:
    "Roma yapı tekniği 3. yüzyılda Sasani İran'a aktarıldı ve Band-e Kaisar'da kullanıldı; aktarım vakayinamelerle değil, tekniğin kendisiyle kanıtlanır.",
  status: "established",
  confidence: "high",
  topic: ["shushtar", "iran", "hidrolik", "teknoloji-transferi"],
  subject: {
    site: "Şuşter Tarihî Hidrolik Sistemi - Band-e Kaisar",
    site_native: "Band-e Kaisar",
    region: "Huzistan, Karun nehri",
    modern_country: "İran",
    coordinates: { lat: 32.0455, lon: 48.8506 },
  },
  period: {
    earliest: 260,
    latest: 270,
    era_label: "Sasani dönemi, I. Şapur",
    precision: "approximate",
    dating_method: ["historical-record", "typology"],
  },
  languages: ["Farsça", "Latince"],
  disciplines: ["muhendislik", "arkeoloji", "tarih"],
  popular_claim:
    "Antik teknoloji aktarımı ancak yazılı kayıtla kanıtlanabilir.",
  divergence:
    "Burada aktarımın kanıtı YAZI DEĞİL, TEKNİĞİN KENDİSİDİR. Band-e Kaisar, İran'da bent ile köprüyü birleştiren ilk yapıdır ve bilinen en doğudaki Roma köprüsü ve Roma bendidir. Yapım gücü, I. Şapur'un Valerianus'u yendiği savaştan sonra esir alınan Roma askerleridir. Yani teknik, kitapla değil ESİR MÜHENDİSLE taşındı - ve yapının kendisi bu aktarımın belgesidir.",
  divergence_type: ["kategori-hatasi"],
  sources: [unesco, bandeKaisar],
  evidence: [
    ev(
      "Band-e Kaisar, İran'da bent ile köprüyü birleştiren ilk yapıdır ve bilinen en doğudaki Roma köprüsü ve Roma bendidir.",
      cite("unesco-1315-shushtar", "Tescil açıklaması", "direct"),
      { id: "en-dogudaki-roma-yapisi" },
    ),
    ev(
      "Yapım gücü, I. Şapur'un imparator Valerianus'u yendiği savaştan sonra esir alınan Roma askerleridir.",
      cite("unesco-1315-shushtar", "Tarihçe bölümü", "direct"),
      { id: "roma-esirleri" },
    ),
    ev(
      "Roma mühendisleri Ab-i Gargar kanalını ve Band-e Kaisar ile Band-e Mizan bentlerini kurarak Karun'un suyunu yapay kanala yönlendirdi.",
      cite("unesco-1315-shushtar", "Sistem bileşenleri", "direct"),
      { id: "kanal-ve-bentler" },
    ),
    ev(
      "Sistem UNESCO tarafından 'yaratıcı dehanın başyapıtı' olarak nitelendirilmiş ve 2009'da Dünya Mirası listesine alınmıştır.",
      cite("unesco-1315-shushtar", "Tescil gerekçesi", "context"),
      { id: "unesco-tescili" },
    ),
  ],
  counter_evidence: [
    ev(
      "Aktarımın ayrıntıları - hangi tekniklerin hangi ölçüde aktarıldığı, yerel geleneğin payı - yapıdan çıkarımdır, belgeli değildir.",
      cite("unesco-1315-shushtar", "Tescil açıklaması", "counter"),
      { id: "ayrintilar-cikarim" },
    ),
    ev(
      "Bu kayıttaki hakemli kaynağın künyesi eksiktir: yazar, yıl ve kapsayıcı yayın doğrulanmamıştır. Birincil künye ile değiştirilmelidir.",
      cite("band-e-kaisar-koprubent-muhendisligi", "Künye düzeyi", "context"),
      { id: "kunye-eksik" },
    ),
  ],
  open_questions: [
    "Hakemli kaynağın tam künyesi nedir? Doğrulanmalı.",
    "Yerel Elam-Sasani hidrolik geleneğinin payı ne kadar?",
  ],
  checked: CHECKED,
  used_in: ["shushtar"],
  review: {
    status: "draft",
    notes: "UNESCO tescil metnine bağlandı. Hakemli kaynağın künyesi eksik ve bu, kayıtta açıkça işaretlendi.",
  },
});

/* --- 2) Darius kökeni — güçlendirilen zayıf kayıt -------------------- */

const darius = finding({
  id: "shushtar-darius-kokeni",
  claim:
    "Şuşter hidrolik sistemi Büyük Darius döneminde, MÖ 5. yüzyılda kuruldu.",
  status: "contested",
  confidence: "medium",
  topic: ["shushtar", "iran", "hidrolik", "tarihleme"],
  subject: {
    site: "Şuşter Tarihî Hidrolik Sistemi",
    region: "Huzistan, Karun nehri",
    modern_country: "İran",
    coordinates: { lat: 32.0455, lon: 48.8506 },
  },
  period: {
    earliest: -500,
    latest: 300,
    era_label: "Ahameniş'ten Sasani'ye - önerilen aralık",
    precision: "disputed",
    dating_method: ["historical-record", "typology"],
  },
  languages: ["Farsça"],
  disciplines: ["arkeoloji", "muhendislik", "tarih"],
  people: [
    { name: "I. Darius", role: "proposer", year: -500 },
    { name: "I. Şapur", role: "excavator", year: 260 },
  ],
  popular_claim:
    "Şuşter sistemi 2.500 yıllıktır; Büyük Darius tarafından kurulmuştur.",
  divergence:
    "Darius atfı bir ARKEOLOJİK BULGU DEĞİL, GELENEKSEL BİR ATIFTIR - ve kaynakların dili bunu ele veriyor: 'dayandığı düşünülüyor', 'muhtemelen', 'olabilir'. Bugün görülen yapının BİÇİMİ 3. yüzyıla, Sasani dönemine aittir. Ahameniş dönemine bağlanabilecek olan, Daryoon kanalı gibi daha erken bir çekirdektir; sistemin bütünü değil. Dahası çevredeki Part (Aşkani) dönemi buluntuları daha eski bir kullanımı da akla getiriyor. Yani ortada tek bir kuruluş tarihi yok, ÜST ÜSTE BİNMİŞ EVRELER var - ve 'MÖ 5. yüzyılda kuruldu' cümlesi bu evreleri tek bir tarihe indirgiyor.",
  divergence_type: ["turizm-kopyalamasi", "guncellenmemis"],
  sources: [unesco],
  evidence: [
    ev(
      "Sistem, Ahameniş kralı Büyük Darius dönemine, MÖ 5. yüzyıla bağlanır.",
      cite("unesco-1315-shushtar", "Tescil açıklaması, tarihçe", "claim-origin"),
      { id: "darius-atfi" },
    ),
  ],
  counter_evidence: [
    ev(
      "Sistemin BUGÜNKÜ BİÇİMİ 3. yüzyıla aittir; MÖ 5. yüzyıl yalnızca olası bir temel olarak anılır.",
      cite("unesco-1315-shushtar", "Tescil açıklaması, tarihçe", "counter"),
      { id: "bugunku-bicim-3-yuzyil" },
    ),
    ev(
      "Kaynakların dili temkinlidir: 'dayandığı düşünülüyor', 'muhtemelen', 'olabilir'. Bu, kesin bir tarihleme değil geleneksel bir atıftır.",
      cite("unesco-1315-shushtar", "Tescil açıklaması", "counter"),
      { id: "temkinli-dil" },
    ),
    ev(
      "Ahameniş dönemine bağlanabilecek olan Daryoon kanalı gibi erken bir çekirdektir; yenileme ve genişletmenin büyük bölümü Sasani dönemindedir.",
      cite("unesco-1315-shushtar", "Sistem bileşenleri", "counter"),
      { id: "daryoon-cekirdek" },
    ),
    ev(
      "Çevredeki Part dönemi buluntuları daha erken bir kullanımı akla getirir; bu da tek bir kuruluş tarihi fikrini zayıflatır.",
      cite("unesco-1315-shushtar", "Bağlam", "context"),
      { id: "part-buluntulari" },
    ),
  ],
  open_questions: [
    "Ahameniş evresinin arkeolojik kanıtı nedir? Kanal izi mi, yazıt mı, tabaka mı - kaynaklarda gösterilmiyor.",
    "Evreler stratigrafik olarak ayrıştırıldı mı?",
  ],
  checked: CHECKED,
  used_in: ["shushtar"],
  review: {
    status: "draft",
    notes:
      "Tek kaynaklı kalmaya devam ediyor (UNESCO). Farsça ve İngilizce hakemli hidrolik arkeoloji literatürü taranmadı; bu, kaydın başlıca zayıflığıdır.",
  },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
for (const r of [transfer, darius]) {
  const i = list.findIndex((x) => x.id === r.id);
  if (i === -1) { console.error("bulunamadı:", r.id); process.exit(1); }
  const onceki = list[i].schema_version ?? 1;
  list[i] = r;
  console.log(`  v${onceki} -> v2  ${r.id}`);
}
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${list.filter((r) => r.schema_version === 2).length}`);
