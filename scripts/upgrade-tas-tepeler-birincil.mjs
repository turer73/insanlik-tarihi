#!/usr/bin/env node
// Türkçe kaynak borcunun ikinci taksiti: Taş Tepeler kayıtlarına
// KAZI BAŞKANININ KENDİ HAKEMLİ YAYINI eklenir.
//
// Bulunan birincil kaynak:
//   Karul, N. (2021). "Buried Buildings at Pre-Pottery Neolithic Karahantepe."
//   Türk Arkeoloji ve Etnografya Dergisi 82, 21-31. ISSN 1302-9231.
//
// NEDEN SADECE BU: aramada bulunan ikinci Karul yayını (Documenta
// Praehistorica 47:76-95, 2020) "Upper Tigris Basin" başlıklıdır ve
// Şanlıurfa'yı değil YUKARI DİCLE havzasını konu edinir. Karahantepe
// kaynağı olarak kullanmak yanlış olurdu; kullanılmadı.
//
// SINIR: makalenin ÖZETİ okundu, tam metni değil. Locator'lar bu yüzden
// özet düzeyindedir ve kayıtlar taslak kalmaya devam eder.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/antik-siteler.json";
const CHECKED = "2026-09-07";

const karul2021 = source("karul-2021-buried-buildings", {
  tier: "peer-reviewed",
  type: "article",
  authors: ["Karul, Necmi"],
  year: 2021,
  title: "Buried Buildings at Pre-Pottery Neolithic Karahantepe",
  container: "Türk Arkeoloji ve Etnografya Dergisi",
  volume: "82",
  pages: "21-31",
  publisher: "T.C. Kültür ve Turizm Bakanlığı",
  url: "https://dergipark.org.tr/en/pub/arkeolojiveetnografya/issue/63476/909296",
  language: "tr",
  accessed: CHECKED,
  note: "Kazı başkanının kendi hakemli yayını. ISSN 1302-9231. Bu kayıtta makalenin ÖZETİ okunmuştur, tam metni değil; locator'lar özet düzeyindedir.",
});

const turkAns = source("turkiye-turizm-ansiklopedisi-karahantepe", {
  tier: "institutional",
  type: "webpage",
  title: "Karahantepe",
  institution: "Türkiye Turizm Ansiklopedisi",
  url: "https://turkiyeturizmansiklopedisi.com/karahantepe",
  language: "tr",
  accessed: CHECKED,
  note: "Türkçe ansiklopedik ara kaynak.",
});

/* --- YENİ: kasıtlı doldurma, birincil yayından --------------------- */

const doldurmaKaydi = finding({
  id: "karahantepe-kasitli-doldurma",
  claim:
    "Karahantepe'de açığa çıkarılan yapılar kasten doldurulmuştur; kazı başkanı bunları 'özel yapı' olarak tanımlar.",
  status: "established",
  confidence: "medium",
  topic: ["karahan-tepe", "tas-tepeler", "arkeoloji", "gomulme"],
  subject: {
    site: "Karahantepe",
    region: "Şanlıurfa, Yukarı Mezopotamya",
    modern_country: "Türkiye",
    coordinates: { lat: 37.1, lon: 39.3 },
  },
  period: {
    earliest: -9400,
    latest: -8000,
    era_label: "Çanak Çömleksiz Neolitik",
    precision: "range",
    dating_method: ["radiocarbon", "stratigraphy"],
  },
  languages: ["Türkçe"],
  disciplines: ["arkeoloji"],
  people: [
    { name: "Karul, Necmi", role: "excavator", affiliation: "İstanbul Üniversitesi", year: 2021 },
  ],
  popular_claim:
    "Neolitik yapılar zamanla toprak altında kalmıştır.",
  divergence:
    "Karahantepe'de doldurma DOĞAL BİRİKİM DEĞİL, kasıtlı bir uygulamadır. Kazı başkanının hakemli yayınında yerleşimdeki açığa çıkarılmış yapıların tamamı, KASTEN DOLDURULMUŞ olmaları bakımından 'özel yapı' olarak tanımlanır. Makale AB yapısına odaklanır ve bulguları, Yakın Doğu ve Anadolu'da erken Neolitik'ten geç Neolitik'e uzanan 'yapı gömme' tartışmasına bağlar.",
  divergence_type: ["guncellenmemis"],
  sources: [karul2021],
  evidence: [
    ev(
      "Kazı başkanının yayınında, yerleşimde açığa çıkarılan yapıların tamamı kasten doldurulmuş olmaları bakımından 'özel yapı' olarak tanımlanır.",
      cite("karul-2021-buried-buildings", "Özet", "direct"),
      { id: "kasitli-doldurma-tanimi" },
    ),
    ev(
      "Makale, yeni açığa çıkarılan gömülü yapıları sunar ve özellikle AB yapısına odaklanır.",
      cite("karul-2021-buried-buildings", "Özet", "direct"),
      { id: "ab-yapisi-odak" },
    ),
    ev(
      "Bulgular, Yakın Doğu ve Anadolu'da erken Neolitik'ten geç Neolitik'e uzanan yapı gömme tartışmasına bağlanır.",
      cite("karul-2021-buried-buildings", "Özet", "context"),
      { id: "bolgesel-tartisma" },
    ),
  ],
  counter_evidence: [
    ev(
      "Bu kayıt KARAHANTEPE hakkındadır. Göbekli Tepe'de kasıtlı gömme hâlâ tartışmalıdır (bkz. gobekli-tepe-kasitli-gomulme); bir sitedeki uygulama ötekini kanıtlamaz.",
      cite("karul-2021-buried-buildings", "Özet, karşılaştırmalı bölüm", "context"),
      { id: "gobekli-icin-gecerli-degil" },
    ),
    ev(
      "Bu kayıtta makalenin yalnızca özeti okunmuştur; tam metindeki gerekçelendirme ve stratigrafik kanıt incelenmemiştir.",
      cite("karul-2021-buried-buildings", "Kaynak erişim düzeyi", "context"),
      { id: "tam-metin-okunmadi" },
    ),
  ],
  open_questions: [
    "Doldurmanın gerekçesi nedir - tören, kapatma, yeniden inşa hazırlığı? Tam metin incelenmeli.",
    "Göbekli Tepe'deki durum Karahantepe'dekiyle aynı mı? Ayrı soru, ayrı kanıt gerekir.",
  ],
  checked: CHECKED,
  used_in: ["tas-tepeler"],
  review: {
    status: "draft",
    notes: "Birincil hakemli kaynağa dayanıyor ama yalnızca özet okundu; tam metin incelemesi bekliyor.",
  },
});

/* --- GÜNCELLEME: Havuzlu Yapı kaydına birincil kaynak eklenir ------ */

const havuzGuncel = finding({
  id: "karahan-tepe-havuzlu-yapi",
  claim:
    "Karahan Tepe'nin Havuzlu Yapısı ana kayaya oyulmuştur; sütunları getirilip dikilmemiş, kayanın içinden çıkarılmıştır.",
  status: "established",
  confidence: "medium",
  topic: ["karahan-tepe", "tas-tepeler", "mimarlik"],
  subject: {
    site: "Karahan Tepe - Havuzlu Yapı (AB yapısı)",
    region: "Şanlıurfa, Yukarı Mezopotamya",
    modern_country: "Türkiye",
    coordinates: { lat: 37.1, lon: 39.3 },
  },
  period: {
    earliest: -9400,
    latest: -9200,
    era_label: "Çanak Çömleksiz Neolitik A",
    precision: "approximate",
    dating_method: ["radiocarbon", "stratigraphy"],
  },
  languages: ["Türkçe"],
  disciplines: ["arkeoloji", "mimarlik"],
  people: [
    { name: "Karul, Necmi", role: "excavator", affiliation: "İstanbul Üniversitesi", year: 2021 },
  ],
  popular_claim:
    "Karahan Tepe 'ikinci Göbekli Tepe'dir.",
  divergence:
    "Yapım mantığı FARKLIDIR ve bu, 'ikinci Göbekli Tepe' nitelemesini yanıltıcı kılar. Göbekli Tepe'nin T biçimli dikilitaşları serbest durur - getirilip dikilmiştir. Karahan Tepe'nin Havuzlu Yapısı ise ana kayaya oyulmuştur: oval planlı, iç yüzeyinde fallik biçimli kabartma sütunlar ve üst kenarda mekâna bakan bir insan başı/büst heykeli. Sütunlar kayanın içinden çıkarılmıştır. Yapı inşa edilmemiş, OYULMUŞTUR. ADLANDIRMA NOTU: popüler kaynaklarda 'Havuzlu Yapı' denen mekân, kazı başkanının yayınında 'AB yapısı' olarak geçer; iki ad aynı yapıyı işaret eder.",
  divergence_type: ["medya-abartisi", "turizm-kopyalamasi"],
  sources: [karul2021, turkAns],
  evidence: [
    ev(
      "Kazı başkanının yayını, yerleşimdeki gömülü yapıları sunarken özellikle AB yapısına odaklanır.",
      cite("karul-2021-buried-buildings", "Özet", "direct"),
      { id: "ab-yapisi-yayinda" },
    ),
    ev(
      "Havuzlu Yapı ana kayaya oyulmuş, oval planlıdır; iç yüzeyi fallik biçimli sütunlarla bezeli ve üst kenarında bir baş/büst heykeli bulunur.",
      cite("turkiye-turizm-ansiklopedisi-karahantepe", "Havuzlu Yapı bölümü", "direct"),
      { id: "havuzlu-yapi-tanimi" },
    ),
  ],
  counter_evidence: [
    ev(
      "'Fallik' bir biçim betimlemesidir, işlev yorumu değildir; sütunların ne anlattığı bilinmemektedir.",
      cite("turkiye-turizm-ansiklopedisi-karahantepe", "Havuzlu Yapı bölümü", "context"),
      { id: "yorum-siniri" },
    ),
    ev(
      "Yapının ayrıntılı betimlemesi hâlâ ara kaynaklıdır; birincil yayının yalnızca özeti okunmuştur.",
      cite("karul-2021-buried-buildings", "Kaynak erişim düzeyi", "context"),
      { id: "betimleme-ara-kaynak" },
    ),
  ],
  open_questions: [
    "'Havuzlu Yapı' ile 'AB yapısı' adlandırmaları literatürde nasıl ayrışıyor?",
  ],
  checked: CHECKED,
  used_in: ["tas-tepeler"],
  review: {
    status: "draft",
    notes: "Birincil yayın eklendi ama yalnızca özet okundu; ayrıntılı betimleme hâlâ ara kaynaklı.",
  },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));

// yeni kayıt
if (list.some((r) => r.id === doldurmaKaydi.id)) {
  console.log("ATLANDI (zaten var):", doldurmaKaydi.id);
} else {
  list.push(doldurmaKaydi);
  console.log("+ eklendi:", doldurmaKaydi.id);
}

// güncelleme
const i = list.findIndex((r) => r.id === havuzGuncel.id);
if (i === -1) { console.error("bulunamadı:", havuzGuncel.id); process.exit(1); }
list[i] = havuzGuncel;
console.log("~ güncellendi:", havuzGuncel.id, "(birincil kaynak eklendi)");

// kurumsal çerçeve: tarih çelişkisini kaydet
const k = list.findIndex((r) => r.id === "tas-tepeler-kurumsal-cerceve");
if (k !== -1) {
  const r = list[k];
  const not =
    "TARİH ÇELİŞKİSİ (2026-09-07): Karul'un kazı başkanlığına ne zaman geldiği kaynaklarda tutarsız - bir kaynak Göbekli Tepe 2016 / Karahan Tepe 2021 derken, başka bir kaynak ikisi için de 2020 verir. Bu kayıt çelişkiyi gizlemiyor; resmî atama belgesiyle çözülmelidir.";
  if (!(r.counter_evidence ?? []).some((e) => (typeof e === "string" ? e : e.text).includes("TARİH ÇELİŞKİSİ"))) {
    r.counter_evidence = [
      ...(r.counter_evidence ?? []),
      {
        id: "atama-tarihi-celiskisi",
        text: not,
        citations: [
          {
            source_ref: "turkiye-turizm-ansiklopedisi-karahantepe",
            locator: "Kazı tarihçesi bölümü",
            support_type: "counter",
            note: "Bu kaynak 2016/2021 verir; başka bir Türkçe haber kaynağı ikisi için de 2020 der.",
          },
        ],
      },
    ];
    r.open_questions = [...(r.open_questions ?? []), "Karul'un atama tarihleri nedir? Kaynaklar çelişiyor."];
    r.checked = CHECKED;
    console.log("~ güncellendi: tas-tepeler-kurumsal-cerceve (atama tarihi çelişkisi kaydedildi)");
  }
}

writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${list.filter((r) => r.schema_version === 2).length}`);
