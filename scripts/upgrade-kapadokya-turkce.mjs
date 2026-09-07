#!/usr/bin/env node
// Türkçe kaynak borcunun üçüncü taksiti: Kapadokya kayıtları.
//
// Bulunan Türkçe kaynaklar:
//   1) Ersun, D. (2021). "Matiate (Midyat) Yeraltı Şehri A-1 ve A-4
//      Mekanlarının İşlevine Yönelik Bir Değerlendirme."
//      Sinop Üniversitesi Sosyal Bilimler Dergisi 5(2), 191-220.
//      DOI 10.30561/sinopusd.1007461   [HAKEMLİ]
//   2) T.C. Kültür ve Turizm Bakanlığı, Kültür Portalı - Derinkuyu
//      Yeraltı Şehri sayfası.  [RESMÎ KURUMSAL]
//
// BUNLAR DÖRT KAYDIN DÖRDÜNÜ DE ETKİLİYOR - biri kaydın esasını değiştiriyor:
// hem Derinkuyu'da (resmî sayfa) hem Matiate'de (Ersun) mekanlar ÜRETİM ve
// DEPOLAMA işlevi taşıyor. "Sığınak" çerçevesi tek başına yetmiyor.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/antik-siteler.json";
const CHECKED = "2026-09-07";

/* --- kaynaklar ----------------------------------------------------- */

const ersun = source("ersun-2021-matiate", {
  tier: "peer-reviewed",
  type: "article",
  authors: ["Ersun, Durmuş"],
  year: 2021,
  title: "Matiate (Midyat) Yeraltı Şehri A-1 ve A-4 Mekanlarının İşlevine Yönelik Bir Değerlendirme",
  container: "Sinop Üniversitesi Sosyal Bilimler Dergisi",
  volume: "5(2)",
  pages: "191-220",
  doi: "10.30561/sinopusd.1007461",
  url: "https://dergipark.org.tr/tr/pub/sinopusd/article/1007461",
  language: "tr",
  accessed: CHECKED,
  note: "Türkçe hakemli. Bu kayıtlarda makalenin ÖZETİ okunmuştur, tam metni değil; locator'lar özet düzeyindedir.",
});

const kulturPortali = source("kultur-portali-derinkuyu", {
  tier: "institutional",
  type: "webpage",
  title: "Derinkuyu Yeraltı Şehri",
  institution: "T.C. Kültür ve Turizm Bakanlığı - Kültür Portalı",
  url: "https://www.kulturportali.gov.tr/turkiye/nevsehir/gezilecekyer/derinkuyu-yeralti-sehri",
  language: "tr",
  accessed: CHECKED,
  note: "Resmî kurumsal kaynak. Kapasite rakamı ve havalandırma bacası sayısı VERMEZ - bu yokluk kayıtlarda kanıt olarak kullanılmıştır.",
});

const enWikiDerinkuyu = source("derinkuyu-wikipedia-en", {
  tier: "institutional",
  type: "webpage",
  title: "Derinkuyu underground city",
  institution: "Wikipedia",
  url: "https://en.wikipedia.org/wiki/Derinkuyu_underground_city",
  language: "en",
  accessed: CHECKED,
  note: "Ara kaynak; önceki sürümden korundu.",
});

const ksenophon = source("ksenophon-anabasis-iv", {
  tier: "primary",
  type: "book",
  authors: ["Ksenophon"],
  title: "Anabasis IV",
  publisher: "—",
  language: "grc",
  note: "Yer altı evlerini tarif eder ama konum Ermenistan'dır, Kapadokya değil.",
});

/* --- 1) TARİHLENEMEZ ------------------------------------------------ */

const tarihlenemez = finding({
  id: "kapadokya-tarihlenemez",
  claim: "Kapadokya yer altı şehirlerinin oyulma tarihi belirlenebilir.",
  status: "unmeasurable",
  confidence: "high",
  topic: ["kapadokya", "derinkuyu", "tarihleme-sorunu"],
  subject: {
    site: "Derinkuyu ve Kapadokya yer altı yerleşimleri",
    region: "Kapadokya",
    modern_country: "Türkiye",
    coordinates: { lat: 38.3735, lon: 34.7345 },
  },
  period: {
    earliest: -800,
    latest: 1000,
    era_label: "Önerilen aralıkların tamamı",
    precision: "disputed",
    dating_method: ["none", "typology", "historical-record"],
  },
  languages: ["Türkçe", "Grekçe"],
  disciplines: ["arkeoloji", "mimarlik", "jeoloji"],
  popular_claim:
    "Yer altı şehirleri Hititler döneminde, yaklaşık MÖ 2000'de kazılmaya başlandı.",
  divergence:
    "Kayaya oyulmuş mimaride stratigrafi yoktur - malzeme biriktirilmez, ÇIKARILIR. Boşluğun kendisini tarihleyecek bir şey yoktur; içeride bulunan eşya, o boşluğun ne zaman oyulduğunu söylemez. Bunun sonucu, kaynaklarda BİRBİRİYLE BAĞDAŞMAYAN tarihlerin yan yana dolaşmasıdır - ve bu yalnızca popüler kaynaklarda değil, resmî kaynakta da böyledir.",
  divergence_type: ["kategori-hatasi", "turizm-kopyalamasi"],
  sources: [kulturPortali, enWikiDerinkuyu, ksenophon],
  evidence: [
    ev(
      "T.C. Kültür ve Turizm Bakanlığı'nın resmî sayfası kökeni Asur kolonilerine bağlar ve 2. yüzyılda Roma zulmünden kaçan ilk Hristiyanların buraya yerleştiğini belirtir.",
      cite("kultur-portali-derinkuyu", "Sayfa gövdesi, tarihçe bölümü", "direct"),
      { id: "resmi-tarihleme" },
    ),
    ev(
      "Belgelenebilen kullanım Bizans dönemine aittir: kiliseler, haçlar, mimari formlar.",
      cite("derinkuyu-wikipedia-en", "Tarihçe bölümü", "direct"),
      { id: "bizans-kullanimi" },
    ),
    ev(
      "Aynı site için dolaşan tarihlemeler bağdaşmaz: Asur kolonileri, Hitit, 2. yüzyıl Hristiyanları ve 8.-12. yüzyıl önerileri aynı anda doğru olamaz.",
      cite("kultur-portali-derinkuyu", "Sayfa gövdesi, tarihçe bölümü", "inference"),
      { id: "bagdasmaz-tarihler" },
    ),
  ],
  counter_evidence: [
    ev(
      "Hitit iddiası yalnızca içeride bulunan eserlere dayanır; kayaya oyma mimaride bu, boşluğun tarihini vermez.",
      cite("derinkuyu-wikipedia-en", "Tarihçe bölümü", "counter"),
      { id: "hitit-iddiasi-zayif" },
    ),
    ev(
      "Sık alıntılanan Ksenophon tanıklığı Ermenistan'ı tarif eder, Kapadokya'yı değil.",
      cite("ksenophon-anabasis-iv", "IV. kitap, yer altı evleri bölümü", "counter"),
      { id: "ksenophon-yanlis-yer" },
    ),
    ev(
      "Resmî kaynak da kesin bir kuruluş tarihi vermez; verdiği çerçeve dönem aralığıdır, tarihleme değil.",
      cite("kultur-portali-derinkuyu", "Sayfa gövdesi", "context"),
      { id: "resmi-kaynak-da-vermiyor" },
    ),
  ],
  open_questions: [
    "Bizans öncesi bir çekirdek var mı? Yöntem bu soruya yapısal olarak cevap veremiyor.",
  ],
  checked: CHECKED,
  used_in: ["kapadokya"],
  review: { status: "draft", notes: "Türkçe resmî kaynak eklendi; hakemli Türkçe jeoarkeoloji literatürü hâlâ taranmadı." },
});

/* --- 2) MARDİN BAĞLANTISI ------------------------------------------ */

const mardin = finding({
  id: "kapadokya-mardin-baglantisi",
  claim: "Kapadokya yer altı şehirleri tünellerle Mardin'e kadar uzanır.",
  status: "refuted",
  confidence: "high",
  topic: ["kapadokya", "mardin", "matiate", "sehir-efsanesi"],
  subject: {
    site: "Kapadokya - Midyat (Matiate) hattı",
    region: "Orta Anadolu - Yukarı Mezopotamya",
    modern_country: "Türkiye",
    coordinates: { lat: 37.4189, lon: 41.3697 },
  },
  period: {
    earliest: 100,
    latest: 2022,
    era_label: "Matiate'nin kullanımından keşfine",
    precision: "range",
    dating_method: ["historical-record", "typology"],
  },
  languages: ["Türkçe"],
  disciplines: ["arkeoloji", "jeoloji"],
  popular_claim:
    "Yer altı şehirleri Kayseri ve Mardin'e kadar birbirine bağlıdır.",
  divergence:
    "Jeolojik olarak imkânsız ve arkeolojik olarak da desteklenmiyor. Kapadokya kazısını mümkün kılan volkanik tüf Mardin'e uzanmaz; Matiate KİREÇTAŞINA oyulmuştur. Dahası Matiate 2020'de restorasyon sırasında TESADÜFEN bulundu - Kapadokya'dan uzanan bilinen bir hattın ucu olarak değil. İşlev profili de farklıdır: hakemli çalışma A-1 ve A-4 mekanlarını üzüm işliği, silo ve şırahane olarak tanımlar. İki gelenek YAKINSAMADIR, bağlantı değil.",
  divergence_type: ["kategori-hatasi", "medya-abartisi"],
  sources: [ersun, enWikiDerinkuyu],
  evidence: [
    ev(
      "Matiate (Midyat) kireçtaşına oyulmuştur; Kapadokya'nın volkanik tüfünden farklı bir kayaçtır.",
      cite("ersun-2021-matiate", "Özet ve mekân tanımları", "direct"),
      { id: "kirectasi-farki" },
    ),
    ev(
      "Matiate'nin A-1 mekânında üzüm işliği düzeneği ve depolama siloları, A-4 mekânında depolama amaçlı yedi mimari öğe bulunur; her iki mekân şırahane olarak değerlendirilmiştir.",
      cite("ersun-2021-matiate", "Özet", "direct"),
      { id: "matiate-sirahane" },
    ),
    ev(
      "Derinkuyu-Kaymaklı arasındaki 9 km tünel iddiasında bile yalnızca kısa bölümler kazılmıştır; uçtan uca doğrulanmış bir geçit yoktur.",
      cite("derinkuyu-wikipedia-en", "Tüneller bölümü", "counter"),
      { id: "tunel-dogrulanmadi" },
    ),
  ],
  counter_evidence: [
    ev(
      "Bu kayıt Matiate'nin önemsiz olduğunu söylemez - tersine, bağımsız ve kendi başına önemli bir yerleşimdir; iddia edilen şey Kapadokya'ya BAĞLI olmadığıdır.",
      cite("ersun-2021-matiate", "Özet", "context"),
      { id: "matiate-onemli" },
    ),
    ev(
      "Matiate kazısı sürüyor; alanın tam yayılımı ve komşu yapılarla ilişkisi henüz kapanmamıştır.",
      cite("ersun-2021-matiate", "Giriş ve kapsam", "context"),
      { id: "kazi-suruyor" },
    ),
  ],
  open_questions: [
    "Matiate'nin tam yayılımı nedir? Kazı sürüyor.",
  ],
  checked: CHECKED,
  used_in: ["kapadokya"],
  review: { status: "draft", notes: "Hakemli Türkçe kaynak eklendi; makalenin özeti okundu, tam metni değil." },
});

/* --- 3) KAPASİTE RAKAMI -------------------------------------------- */

const kapasite = finding({
  id: "kapadokya-kapasite-rakami",
  claim: "Derinkuyu 20.000 kişi barındırabiliyordu.",
  status: "unknown",
  confidence: "medium",
  topic: ["kapadokya", "derinkuyu", "nufus-tahmini", "matiate"],
  subject: {
    site: "Derinkuyu yer altı şehri",
    region: "Kapadokya",
    modern_country: "Türkiye",
    coordinates: { lat: 38.3735, lon: 34.7345 },
  },
  period: {
    earliest: 300,
    latest: 1000,
    era_label: "Yoğun kullanım dönemi (tahmini)",
    precision: "approximate",
    dating_method: ["none", "historical-record"],
  },
  languages: ["Türkçe"],
  disciplines: ["arkeoloji", "muhendislik"],
  popular_claim:
    "Derinkuyu 20.000 kişi barındırabiliyordu.",
  divergence:
    "Rakamın hesap zinciri yok. Ve asıl gösterge şu: T.C. Kültür ve Turizm Bakanlığı'nın RESMÎ SAYFASI kapasite rakamı VERMEZ - ne 20.000 ne başka bir sayı. Rakam turizm ve içerik sitelerinde birbirinden kopyalanarak dolaşıyor. Aynı kalıp bölgede tekrar ediyor: Matiate için basında 70.000 rakamı dolaşıyor ve onun da bir hesap zinciri gösterilmiyor. Kapasite abartması tekil bir hata değil, BÖLGESEL BİR ANLATIM ALIŞKANLIĞI.",
  divergence_type: ["medya-abartisi", "turizm-kopyalamasi"],
  sources: [kulturPortali, enWikiDerinkuyu, ersun],
  evidence: [
    ev(
      "Bakanlığın resmî Derinkuyu sayfası kapasite rakamı vermez; verdiği bilgiler kat sayısı, mekân türleri ve ziyarete açık oranıdır.",
      cite("kultur-portali-derinkuyu", "Sayfa gövdesi", "direct"),
      { id: "resmi-rakam-yok" },
    ),
    ev(
      "Resmî sayfa Derinkuyu'nun bugün ancak yüzde onunun gezilebildiğini belirtir; yani kapasite tahmini yapılacak alanın büyük bölümü erişilebilir değildir.",
      cite("kultur-portali-derinkuyu", "Sayfa gövdesi, ziyaret bilgisi", "direct"),
      { id: "yuzde-on-gezilebilir" },
    ),
  ],
  counter_evidence: [
    ev(
      "Kapasite tahmini için gereken veriler yoktur: havalandırma debisi, su kaynağı verimi, depolama hacmi ve kullanım süresi. Hiçbiri ölçülmüş değildir.",
      cite("derinkuyu-wikipedia-en", "Site parametreleri", "counter"),
      { id: "hesap-verisi-yok" },
    ),
    ev(
      "Aynı abartma kalıbı bölgede tekrar ediyor: Matiate için basında 70.000 kişilik kapasite dolaşıyor; hakemli çalışma böyle bir rakam vermez, mekân işlevlerini inceler.",
      cite("ersun-2021-matiate", "Özet", "counter"),
      { id: "matiate-70bin-kalibi" },
    ),
    ev(
      "Bu kayıt 'kapasite düşüktü' demez; 'kapasite BİLİNMİYOR' der. Rakamın yanlış olduğu değil, dayanaksız olduğu iddia edilmektedir.",
      cite("kultur-portali-derinkuyu", "Sayfa gövdesi", "context"),
      { id: "kapsam-siniri" },
    ),
  ],
  open_questions: [
    "Havalandırma ve su kapasitesi ölçülürse üst sınır hesaplanabilir mi? Böyle bir çalışma bulunamadı.",
  ],
  checked: CHECKED,
  used_in: ["kapadokya"],
  review: { status: "draft", notes: "Resmî kaynağın SESSİZLİĞİ kanıt olarak kullanıldı; bu, güçlü ama dolaylı bir argümandır." },
});

/* --- 4) SIĞINAK — bu kaydın ESASI DEĞİŞİYOR ------------------------ */

const siginak = finding({
  id: "kapadokya-sigina-insandan",
  claim:
    "Kapadokya yer altı şehirleri yalnızca insan saldırılarından korunmak için yapılmış sığınaklardır.",
  status: "contested",
  confidence: "medium",
  topic: ["kapadokya", "derinkuyu", "matiate", "islev"],
  subject: {
    site: "Kapadokya yer altı yerleşimleri ve Matiate",
    region: "Kapadokya ve Yukarı Mezopotamya",
    modern_country: "Türkiye",
    coordinates: { lat: 38.3735, lon: 34.7345 },
  },
  period: {
    earliest: 100,
    latest: 1000,
    era_label: "Belgelenebilir kullanım dönemi",
    precision: "range",
    dating_method: ["typology", "historical-record"],
  },
  languages: ["Türkçe"],
  disciplines: ["arkeoloji", "mimarlik"],
  popular_claim:
    "Yer altı şehirleri saldırı anında sığınmak için kazılmış gizli sığınaklardır.",
  divergence:
    "Savunma özellikleri gerçektir - tek kişilik dar geçitler, içeriden kapatılan taş kapılar. AMA 'yalnızca sığınak' çerçevesi eksik: hem Derinkuyu'da hem Matiate'de mekanlar ÜRETİM VE DEPOLAMA işlevi taşıyor. Bakanlığın resmî sayfası Derinkuyu'da şarap üretim tesisleri, erzak depoları, kiliseler ve manastırlar sayar. Matiate'de hakemli çalışma A-1 ve A-4 mekanlarını üzüm işliği, silo ve şırahane olarak değerlendirir. Bunlar kısa süreli sığınmanın değil, SÜREGİDEN EKONOMİK KULLANIMIN işaretleridir. Doğru soru 'sığınak mı' değil, 'sığınma İLE üretim aynı mekânda nasıl birleşiyor'.",
  divergence_type: ["kategori-hatasi", "turizm-kopyalamasi"],
  sources: [kulturPortali, ersun, enWikiDerinkuyu],
  evidence: [
    ev(
      "Savunma özellikleri belgelidir: yalnızca tek kişinin geçebildiği dar tüneller ve giriş-çıkışlarda içeriden kapatılan büyük taş silindirler.",
      cite("kultur-portali-derinkuyu", "Sayfa gövdesi, mimari özellikler", "direct"),
      { id: "savunma-ozellikleri" },
    ),
    ev(
      "Resmî sayfa Derinkuyu'da erzak depoları, havalandırma bacaları, şarap üretim tesisleri, kiliseler, manastırlar, su kuyuları ve toplantı odaları sayar.",
      cite("kultur-portali-derinkuyu", "Sayfa gövdesi, mekân listesi", "direct"),
      { id: "derinkuyu-uretim-mekanlari" },
    ),
    ev(
      "Matiate'de A-1 mekânında üzüm işliği ve depolama siloları, A-4 mekânında depolama amaçlı yedi mimari öğe bulunur; her iki mekân üretime dayalı işlev ve şırahane kullanımı bakımından değerlendirilmiştir.",
      cite("ersun-2021-matiate", "Özet", "direct"),
      { id: "matiate-uretim-mekanlari" },
    ),
  ],
  counter_evidence: [
    ev(
      "Üretim mekânlarının varlığı savunma işlevini çürütmez; iki işlev aynı yerleşimde birlikte bulunabilir ve muhtemelen bulunmuştur.",
      cite("kultur-portali-derinkuyu", "Sayfa gövdesi", "context"),
      { id: "iki-islev-birlikte" },
    ),
    ev(
      "Matiate Kapadokya değildir; oradaki işlev profili Kapadokya için doğrudan kanıt sayılamaz, yalnızca karşılaştırma sağlar.",
      cite("ersun-2021-matiate", "Kapsam", "context"),
      { id: "matiate-kapadokya-degil" },
    ),
    ev(
      "Hangi mekânın hangi dönemde hangi işlevle kullanıldığı tarihlenemediği için (bkz. kapadokya-tarihlenemez), işlev tartışması da kesin sonuca bağlanamaz.",
      cite("derinkuyu-wikipedia-en", "Tarihçe bölümü", "counter"),
      { id: "tarihleme-islev-baglantisi" },
    ),
  ],
  open_questions: [
    "Sığınma ile üretim aynı mekânda nasıl birleşiyordu - mevsimlik mi, sürekli mi, dönemsel mi?",
    "Üretim mekânları savunma mekânlarıyla aynı evreye mi ait? Tarihleme yapılamadığı için açık.",
  ],
  checked: CHECKED,
  used_in: ["kapadokya"],
  supersedes: [],
  review: {
    status: "draft",
    notes:
      "BU KAYDIN ESASI DEĞİŞTİ. Önceki sürüm 'insan saldırılarından korunmak için yapılmış sığınaklardır' iddiasını established sayıyordu. Türkçe kaynaklar (Bakanlık resmî sayfası + Ersun 2021) her iki bölgede de üretim/depolama işlevi gösterdiği için iddia 'yalnızca sığınak' biçiminde daraltıldı ve contested'a çekildi.",
  },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
const yeni = [tarihlenemez, mardin, kapasite, siginak];

for (const r of yeni) {
  const i = list.findIndex((x) => x.id === r.id);
  if (i === -1) { console.error("bulunamadı:", r.id); process.exit(1); }
  const onceki = list[i].schema_version ?? 1;
  const oncekiStatus = list[i].status;
  list[i] = r;
  const durumNotu = oncekiStatus !== r.status ? `  [DURUM: ${oncekiStatus} -> ${r.status}]` : "";
  console.log(`  v${onceki} -> v2  ${r.id}${durumNotu}`);
}

writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${list.filter((r) => r.schema_version === 2).length}`);
