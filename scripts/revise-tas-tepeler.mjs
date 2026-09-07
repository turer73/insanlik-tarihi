#!/usr/bin/env node
// Taş Tepeler revizyonu — Türkçe kaynaklarla.
//
// İKİ İŞ YAPAR:
// 1) Yeni v2 kayıtları ekler (kurumsal çerçeve, alan karşılaştırması, C14, Havuzlu Yapı)
// 2) gobekli-karahan-kronoloji kaydını YERİNDE GÜNCELLER - eski hâli
//    "öncelik belirlenmedi" diyordu; karbon aralıkları bunu daraltıyor.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding, commit } from "./lib/finding.mjs";

const PATH = "data/findings/antik-siteler.json";
const CHECKED = "2026-09-07";

/* --- Türkçe kaynaklar ------------------------------------------------ */

const yetmenAtes = source("yetmen-ates-2021", {
  tier: "peer-reviewed",
  type: "article",
  authors: ["Yetmen, H.", "Ateş, D."],
  year: 2021,
  title:
    "Göbekli Tepe ile Karahan Tepe'nin Jeomorfolojisi ve Doğal Ortam Koşullarının Erken Neolitik Dönem Yaşamı Üzerindeki Etkileri",
  container: "Akademik Sosyal Araştırmalar Dergisi",
  volume: "9(123)",
  pages: "121-141",
  url: "https://www.researchgate.net/publication/357329428",
  language: "tr",
  accessed: CHECKED,
  note: "Türkçe hakemli çalışma. Locator'lar başlık ve konu kapsamı düzeyindedir; tam metin sayfa doğrulaması yapılmamıştır.",
});

const tastepeler = source("tas-tepeler-projesi", {
  tier: "institutional",
  type: "report",
  title: "Taş Tepeler — Şanlıurfa Neolitik Çağ Araştırma Projesi",
  institution: "T.C. Kültür ve Turizm Bakanlığı",
  publisher: "T.C. Kültür ve Turizm Bakanlığı",
  language: "tr",
  note: "Proje çatısı ve yürütücü bilgisi için. Kazı raporu değildir.",
});

const turkAnsiklopedi = source("turkiye-turizm-ansiklopedisi-karahantepe", {
  tier: "institutional",
  type: "webpage",
  title: "Karahantepe",
  institution: "Türkiye Turizm Ansiklopedisi",
  url: "https://turkiyeturizmansiklopedisi.com/karahantepe",
  language: "tr",
  accessed: CHECKED,
  note: "Türkçe ansiklopedik ara kaynak. Karbon tarihleri ve Havuzlu Yapı betimlemesi buradan alındı; birincil kazı yayınıyla değiştirilmelidir.",
});

const enWiki = source("karahan-tepe-wikipedia-en", {
  tier: "institutional",
  type: "webpage",
  title: "Karahan Tepe",
  institution: "Wikipedia",
  url: "https://en.wikipedia.org/wiki/Karahan_Tepe",
  language: "en",
  accessed: CHECKED,
  note: "Ara kaynak; alan ve kazılan oran rakamları için.",
});

const gobekliWiki = source("gobekli-tepe-wikipedia-en", {
  tier: "institutional",
  type: "webpage",
  title: "Göbekli Tepe",
  institution: "Wikipedia",
  url: "https://en.wikipedia.org/wiki/G%C3%B6bekli_Tepe",
  language: "en",
  accessed: CHECKED,
  note: "Ara kaynak; höyük ve site alanı rakamları için.",
});

/* --- 1) DÜZELTME KAYDI: alan karşılaştırması ------------------------- */

const alanKaydi = finding({
  id: "gobekli-karahan-alan-karsilastirmasi",
  claim:
    "Karahan Tepe yüzey alanı olarak Göbekli Tepe'den büyüktür.",
  status: "refuted",
  confidence: "medium",
  topic: ["gobekli-tepe", "karahan-tepe", "tas-tepeler", "yontem"],
  subject: {
    site: "Göbekli Tepe ve Karahan Tepe",
    region: "Şanlıurfa, Yukarı Mezopotamya",
    modern_country: "Türkiye",
    coordinates: { lat: 37.2233, lon: 38.9224 },
  },
  period: {
    earliest: -9600,
    latest: -8000,
    era_label: "Çanak Çömleksiz Neolitik A-B",
    precision: "range",
    dating_method: ["radiocarbon", "stratigraphy"],
  },
  languages: ["Türkçe", "İngilizce"],
  disciplines: ["arkeoloji", "jeoloji"],
  popular_claim:
    "Karahan Tepe Göbekli Tepe'den daha büyüktür.",
  divergence:
    "Bu proje de aynı hatayı yaptı ve kaydı düzeltiyor. Karahan Tepe için dolaşan dört farklı rakam (10 / 13-14 / 15 / 32,5 ha) tabloya konup 'hangisi neyi sayıyor' diye soruldu - doğru bir uyarı. Ama AYNI SORU GÖBEKLİ TEPE İÇİN SORULMADI: Karahan'ın değişken aralığı, Göbekli'nin tek ve denetlenmemiş bir rakamıyla karşılaştırıldı. Göbekli Tepe'nin rakamları da oynuyor: höyük ~9 ha, geniş site ~12 ha, koruma alanı çok daha büyük. Karahan Tepe yerleşimi ~10 ha, taş ocaklarıyla ~15 ha. İKİSİ AYNI MERTEBEDE. Bir karşılaştırmada şüpheyi tek tarafa uygulamak, hiç uygulamamaktan daha tehlikelidir: titiz görünür ve yanlıştır.",
  divergence_type: ["kategori-hatasi", "turizm-kopyalamasi"],
  sources: [enWiki, gobekliWiki, yetmenAtes],
  evidence: [
    ev(
      "Göbekli Tepe höyüğü yaklaşık 9 hektar, ~300 m çapında ve ~15 m yüksekliğinde; geniş site tahmini bazı kaynaklarda ~12 hektar.",
      cite("gobekli-tepe-wikipedia-en", "Site ve boyut bölümü", "direct"),
      { id: "gobekli-alan" },
    ),
    ev(
      "Karahan Tepe yaklaşık 10 hektarlık bir alan kaplıyor; buna ~5 hektarlık taş ocağı bölgeleri ekleniyor.",
      cite("karahan-tepe-wikipedia-en", "Site tanımı bölümü", "direct"),
      { id: "karahan-alan" },
    ),
    ev(
      "2023 itibarıyla Karahan Tepe'nin yüzey alanının yaklaşık %5'i kazılmıştır.",
      cite("karahan-tepe-wikipedia-en", "Kazı durumu bölümü", "direct"),
      { id: "kazilan-oran" },
    ),
    ev(
      "İki sitenin jeomorfolojisi ve doğal ortam koşulları Türkçe hakemli literatürde karşılaştırmalı olarak ele alınmıştır.",
      cite("yetmen-ates-2021", "Başlık ve çalışma kapsamı", "context"),
      { id: "turkce-karsilastirma" },
    ),
  ],
  counter_evidence: [
    ev(
      "Bu kayıt 'Göbekli daha büyük' demiyor: iki sitenin aynı mertebede olduğunu ve mevcut veriyle temiz bir sıralama yapılamayacağını söylüyor.",
      cite("karahan-tepe-wikipedia-en", "Site tanımı bölümü", "context"),
      { id: "kapsam-siniri" },
    ),
    ev(
      "Alan rakamları ara kaynaklardan gelmektedir; kazı ekibinin ölçüm yayınıyla doğrulanmamıştır.",
      cite("gobekli-tepe-wikipedia-en", "Kaynak düzeyi", "context"),
      { id: "olcum-dogrulanmadi" },
    ),
    ev(
      "'Daha büyük yerleşim' demek için alan yetmez; nüfus, çağdaş kullanım ve yapı yoğunluğu gerekir ve hiçbiri elde yoktur.",
      cite("yetmen-ates-2021", "Doğal ortam koşulları ve yerleşim bölümü", "context"),
      { id: "alan-yeterli-degil" },
    ),
  ],
  open_questions: [
    "Kazı ekibinin yayımladığı resmî alan ölçümleri nedir? Ara kaynaklarla değiştirilmelidir.",
  ],
  checked: CHECKED,
  volatile: true,
  used_in: ["tas-tepeler"],
  review: {
    status: "draft",
    notes:
      "Bu kayıt projenin kendi hatasını düzeltmek için açıldı. Alan rakamları ara kaynaklıdır; birincil kazı yayınıyla doğrulanmalıdır.",
  },
});

/* --- 2) Kurumsal çerçeve --------------------------------------------- */

const kurumKaydi = finding({
  id: "tas-tepeler-kurumsal-cerceve",
  claim:
    "Taş Tepeler, Kültür ve Turizm Bakanlığı'nın Şanlıurfa Neolitik Çağ Araştırma Projesi'nin kısa adıdır ve kazıları Necmi Karul koordine eder.",
  status: "established",
  confidence: "high",
  topic: ["tas-tepeler", "gobekli-tepe", "karahan-tepe", "kazi-tarihi"],
  subject: {
    site: "Taş Tepeler projesi",
    region: "Şanlıurfa",
    modern_country: "Türkiye",
    coordinates: { lat: 37.2233, lon: 38.9224 },
  },
  period: {
    earliest: 2016,
    latest: 2026,
    era_label: "Projenin kurumsallaşma dönemi",
    precision: "exact",
    dating_method: ["historical-record"],
  },
  languages: ["Türkçe"],
  disciplines: ["arkeoloji", "tarih"],
  people: [
    { name: "Karul, Necmi", role: "excavator", affiliation: "İstanbul Üniversitesi", year: 2021 },
  ],
  popular_claim:
    "Göbekli Tepe ve Karahan Tepe ayrı ayrı kazılan, birbirinden bağımsız sitelerdir.",
  divergence:
    "İkisi de aynı araştırma çatısı altındadır. Taş Tepeler, Kültür ve Turizm Bakanlığı'nın başlattığı Şanlıurfa Neolitik Çağ Araştırma Projesi'nin kısa adıdır. Bu, bulguların nasıl okunacağını belirler: elimizdeki verinin büyük bölümü SON BEŞ-ALTI YILIN ürünüdür ve hâlâ akmaktadır. Beş yıllık bir kazıdan otuz yıllık kesinlikte cümle çıkmaz.",
  divergence_type: ["guncellenmemis"],
  sources: [tastepeler, turkAnsiklopedi],
  evidence: [
    ev(
      "Taş Tepeler, Kültür ve Turizm Bakanlığı'nca başlatılan Şanlıurfa Neolitik Çağ Araştırma Projesi'nin kısa adıdır.",
      cite("tas-tepeler-projesi", "Proje tanımı", "direct"),
      { id: "proje-adi" },
    ),
    ev(
      "Necmi Karul 2016'da Göbekli Tepe, 2021'de Karahan Tepe kazı başkanlığına getirildi ve proje koordinatörlüğünü yürütüyor.",
      cite("turkiye-turizm-ansiklopedisi-karahantepe", "Kazı tarihçesi bölümü", "direct"),
      { id: "karul-gorevleri" },
    ),
    ev(
      "Karahan Tepe'de 2017'de iki yıllık yüzey araştırması başladı; sistemli kazı 2019'da açıldı.",
      cite("turkiye-turizm-ansiklopedisi-karahantepe", "Kazı tarihçesi bölümü", "direct"),
      { id: "kazi-takvimi" },
    ),
  ],
  counter_evidence: [
    ev(
      "Kurumsal bilgi ara kaynaklardan derlenmiştir; Bakanlık ve kazı ekibinin resmî yayınlarıyla doğrulanmalıdır.",
      cite("tas-tepeler-projesi", "Kaynak düzeyi", "context"),
      { id: "kurumsal-dogrulama" },
    ),
  ],
  checked: CHECKED,
  used_in: ["tas-tepeler"],
  review: { status: "draft", notes: "Ara kaynak düzeyinde; resmî proje yayınlarıyla doğrulanmalı." },
});

/* --- 3) Karbon tarihleri --------------------------------------------- */

const c14Kaydi = finding({
  id: "karahan-tepe-karbon-tarihleri",
  claim:
    "Karahan Tepe için verilen karbon tarihleri (MÖ 9400-9200) Göbekli Tepe'nin erken evresinin içine düşer; iki site çağdaştır.",
  status: "contested",
  confidence: "low",
  topic: ["karahan-tepe", "gobekli-tepe", "tarihleme", "tas-tepeler"],
  subject: {
    site: "Karahan Tepe",
    region: "Şanlıurfa, Yukarı Mezopotamya",
    modern_country: "Türkiye",
    coordinates: { lat: 37.1, lon: 39.3 },
  },
  period: {
    earliest: -9400,
    latest: -9200,
    era_label: "Çanak Çömleksiz Neolitik A",
    precision: "range",
    dating_method: ["radiocarbon"],
  },
  languages: ["Türkçe"],
  disciplines: ["arkeoloji"],
  popular_claim:
    "Karahan Tepe Göbekli Tepe'den daha eskidir.",
  divergence:
    "Türkçe popüler içerikte 'Karahan Tepe daha eski' cümlesi yaygın. Verilen karbon aralığı (MÖ 9400-9200) Göbekli Tepe'nin erken evresinin (yaklaşık MÖ 9500-8000) İÇİNE düşüyor - yani veriler ÇAĞDAŞ olduklarına işaret ediyor, biri ötekinden belirgin biçimde eski değil. Ancak bu rakam ikincil Türkçe kaynaktan alınmıştır ve birincil tarihleme yayınıyla doğrulanmamıştır; bu yüzden kayıt tartışmalı ve düşük güvenle tutulmaktadır.",
  divergence_type: ["medya-abartisi", "guncellenmemis"],
  sources: [turkAnsiklopedi, enWiki],
  evidence: [
    ev(
      "Karahan Tepe için verilen karbon tarihleri MÖ 9400-9200 aralığındadır ve site Göbekli Tepe ile çağdaş kabul edilir.",
      cite("turkiye-turizm-ansiklopedisi-karahantepe", "Tarihleme bölümü", "direct"),
      { id: "c14-araligi" },
    ),
    ev(
      "Karahan Tepe'nin, Göbekli Tepe'nin terk edildiği dönemde kullanımda kalmış olabileceği ileri sürülmektedir.",
      cite("turkiye-turizm-ansiklopedisi-karahantepe", "Tarihleme bölümü", "inference"),
      { id: "terk-donemi-kullanim" },
    ),
  ],
  counter_evidence: [
    ev(
      "Rakam ikincil Türkçe kaynaktan alınmıştır; kazı ekibinin birincil tarihleme yayınıyla doğrulanmamıştır.",
      cite("turkiye-turizm-ansiklopedisi-karahantepe", "Kaynak düzeyi", "counter"),
      { id: "birincil-yayin-yok" },
    ),
    ev(
      "Her iki sitede de kazılan kesim küçüktür (~%5); 'en eski' iddiası hangi kesimin kazıldığına bağlı kalmaktadır.",
      cite("karahan-tepe-wikipedia-en", "Kazı durumu bölümü", "counter"),
      { id: "orneklem-sorunu" },
    ),
  ],
  open_questions: [
    "Kazı ekibinin birincil karbon tarihleme yayını nedir ve verilen aralık nedir?",
  ],
  checked: CHECKED,
  volatile: true,
  used_in: ["tas-tepeler"],
  review: {
    status: "draft",
    notes: "İkincil kaynaklı karbon aralığı. Birincil yayınla doğrulanana kadar düşük güvenle tutulmalı.",
  },
});

/* --- 4) Havuzlu Yapı -------------------------------------------------- */

const havuzKaydi = finding({
  id: "karahan-tepe-havuzlu-yapi",
  claim:
    "Karahan Tepe'nin Havuzlu Yapısı ana kayaya oyulmuştur; sütunları getirilip dikilmemiş, kayanın içinden çıkarılmıştır.",
  status: "established",
  confidence: "medium",
  topic: ["karahan-tepe", "tas-tepeler", "mimarlik"],
  subject: {
    site: "Karahan Tepe - Havuzlu Yapı",
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
  popular_claim:
    "Karahan Tepe 'ikinci Göbekli Tepe'dir.",
  divergence:
    "Yapım mantığı FARKLIDIR ve bu, 'ikinci Göbekli Tepe' nitelemesini yanıltıcı kılar. Göbekli Tepe'nin T biçimli dikilitaşları serbest durur - getirilip dikilmiştir. Karahan Tepe'nin Havuzlu Yapısı ise ana kayaya oyulmuştur: oval planlı, iç yüzeyinde fallik biçimli kabartma sütunlar ve üst kenarda mekâna bakan bir insan başı/büst heykeli. Sütunlar kayanın içinden çıkarılmıştır. Yapı inşa edilmemiş, OYULMUŞTUR. İki site aynı geleneğin parçası olabilir ama biri ötekinin kopyası değildir.",
  divergence_type: ["medya-abartisi", "turizm-kopyalamasi"],
  sources: [turkAnsiklopedi, enWiki],
  evidence: [
    ev(
      "Havuzlu Yapı ana kayaya oyulmuş, oval planlıdır; iç yüzeyi fallik biçimli sütunlarla bezeli ve üst kenarında bir baş/büst heykeli bulunur.",
      cite("turkiye-turizm-ansiklopedisi-karahantepe", "Havuzlu Yapı bölümü", "direct"),
      { id: "havuzlu-yapi-tanimi" },
    ),
    ev(
      "Karahan Tepe kayaya oyulmuş mimari öğeleri yerinde korunmuş bir Çanak Çömleksiz Neolitik yerleşimidir.",
      cite("karahan-tepe-wikipedia-en", "Mimari bölümü", "direct"),
      { id: "kayaya-oyma-mimari" },
    ),
  ],
  counter_evidence: [
    ev(
      "'Fallik' bir biçim betimlemesidir, işlev yorumu değildir; sütunların ne anlattığı bilinmemektedir.",
      cite("turkiye-turizm-ansiklopedisi-karahantepe", "Havuzlu Yapı bölümü", "context"),
      { id: "yorum-siniri" },
    ),
    ev(
      "Karahan Tepe'de T biçimli dikilitaşlar da bulunmaktadır; yapım mantığı farkı mutlak bir ayrım değildir.",
      cite("karahan-tepe-wikipedia-en", "Mimari bölümü", "counter"),
      { id: "t-sutunlar-da-var" },
    ),
  ],
  checked: CHECKED,
  used_in: ["tas-tepeler"],
  review: { status: "draft", notes: "Ara kaynak düzeyinde; kazı yayınıyla doğrulanmalı." },
});

/* --- ekle --------------------------------------------------------- */

const eklenen = commit(PATH, [alanKaydi, kurumKaydi, c14Kaydi, havuzKaydi]);

/* --- eski kronoloji kaydını güncelle -------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
const i = list.findIndex((r) => r.id === "gobekli-karahan-kronoloji");
if (i === -1) {
  console.error("gobekli-karahan-kronoloji bulunamadı");
  process.exit(1);
}
const eski = list[i];
eski.counter_evidence = [
  ...(eski.counter_evidence ?? []),
  "GÜNCELLEME (2026-09-07): Karahan Tepe için verilen karbon aralığı (MÖ 9400-9200) Göbekli Tepe'nin erken evresinin içine düşüyor; veriler çağdaşlığa işaret ediyor. Bkz. karahan-tepe-karbon-tarihleri.",
];
eski.open_questions = [
  ...(eski.open_questions ?? []).filter((q) => !/daha büyük|gerçek çağdaş yerleşim alanı/i.test(q)),
  "Kesin öncelik birincil tarihleme yayınıyla belirlenmelidir.",
];
eski.checked = CHECKED;
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
console.log(`\ngobekli-karahan-kronoloji güncellendi (karbon notu + açık soru düzeltmesi)`);
console.log(`${PATH}: ${list.length} kayıt, v2: ${list.filter((r) => r.schema_version === 2).length}`);
