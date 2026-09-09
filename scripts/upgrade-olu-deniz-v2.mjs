#!/usr/bin/env node
// Ölü Deniz Parşömenleri dosyası: 8 kaydın tamamı v2'ye.
//
// DEEPSEEK TURUNUN BOŞ BIRAKTIĞI İKİ KAYIT ayrıca arandı ve ikisi de
// künyelendi:
//   7Q5 -> Fee 1973 (JBL, DOI 10.2307/3262758) ve Gundry 1999 (JBL,
//   DOI 10.2307/3268112, "A Final Disidentification"). İkisi de crossref'te
//   yazarıyla doğrulandı. İddianın kökeni için Fitzmyer'ın O'Callaghan
//   cildini değerlendirdiği JBL 1976 yazısı (10.2307/3265277).
//   Bakır Parşömen -> Puech 2015, "Text, Translation and Commentary",
//   The Copper Scroll Revisited (Brill), DOI 10.1163/9789047424314_003.
//
// BİR ADAY İLGİ GEREKÇESİYLE ELENDİ:
// Katz 2005, "Jordanian Jerusalem" (Jerusalem Quarterly) mülkiyet kaydına
// önerilmişti ve URL doğrulaması geçti - ama URL derginin ANA SAYFASIYDI
// (palestine-studies.org/jq), makalenin kendisi değil. Rollinger vakasında
// (Babil dosyası) aynı gerekçeyle elenmişti; ölçüt aynı kalmalı. Sonuç:
// mülkiyet kaydı hâlâ tek kurumsal kaynağa dayanıyor ve bu, kayıtta açık
// soru olarak yazıldı.
//
// BEŞ KAYITTA popular_claim VE divergence BOŞTU: ester-haric, bakir-parsomen,
// museum-of-the-bible, mulkiyet-ihtilafi ve kısmen 7q5. Hepsi yazıldı.
//
// TIER GEREKÇESİ: VanderKam & Flint 2002 ticari bir yayınevinden çıktı
// (HarperSanFrancisco) ama alanın iki önde gelen uzmanının kaynak temelli
// sentezidir - Tedlock'la aynı ölçüt, Allen vd. ile karşıt. Yayınevi değil
// metnin türü belirliyor.
//
// SINIR: hiçbir kaynağın tam metni okunmadı. DJD serisinin cilt/sayfa
// künyeleri kayıt düzeyinde verilmedi; seri olarak künyelendi.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/olu-deniz.json";
const CHECKED = "2026-09-09";
const mak = (id, o) => source(id, { language: "en", accessed: CHECKED, ...o });

const kumran = {
  site: "Kumran mağaraları",
  region: "Yehuda Çölü, Ölü Deniz kuzeybatı kıyısı",
  modern_country: "Batı Şeria (fiilî İsrail idaresi)",
  coordinates: { lat: 31.7414, lon: 35.4594 },
};

/* --- kaynaklar ----------------------------------------------------- */

const djd = mak("djd-serisi", {
  tier: "primary", type: "edition",
  title: "Discoveries in the Judaean Desert (DJD)",
  publisher: "Clarendon Press, Oxford",
  note: "Parşömenlerin resmî edisyon serisi; 40 ciltle 2009'da esasen tamamlandı. Cilt ve sayfa künyeleri bu kayıtlarda verilmedi - seri düzeyinde atıf yapılıyor.",
});

const tovScribal = mak("tov-2004-scribal-practices", {
  tier: "peer-reviewed", type: "book",
  authors: ["Tov, Emanuel"], year: 2004,
  title: "Scribal Practices and Approaches Reflected in the Texts Found in the Judean Desert",
  publisher: "Brill", isbn: "9789004140011",
  note: "Kumran külliyatının kâtip pratikleri üzerinden envanteri ve çözümlemesi.",
});

const ulrich = mak("ulrich-2010-biblical-qumran-scrolls", {
  tier: "peer-reviewed", type: "book",
  authors: ["Ulrich, Eugene"], year: 2010,
  title: "The Biblical Qumran Scrolls: Transcriptions and Textual Variants",
  publisher: "Brill", isbn: "9789004180383",
  note: "Kutsal Kitap parşömenlerinin transkripsiyonları ve varyant listesi; kitap bazında envanterin ve Yeşaya varyantının dayanağı.",
});

const tovTextual = mak("tov-2012-textual-criticism", {
  tier: "peer-reviewed", type: "book",
  authors: ["Tov, Emanuel"], year: 2012,
  title: "Textual Criticism of the Hebrew Bible",
  publisher: "Fortress Press", isbn: "9780800696641",
  note: "Alanın standart el kitabı; varyantın yönü (düşme mi ekleme mi) tartışmasının yöntemsel dayanağı.",
});

const isaiahA = mak("1qisaa-buyuk-yesaya", {
  tier: "primary", type: "manuscript",
  title: "1QIsaa - Büyük Yeşaya Parşömeni", language: "he",
  note: "Kumran'ın en iyi korunmuş kutsal kitap elyazması.",
});

const vanderkamFlint = mak("vanderkam-flint-2002-meaning-dss", {
  tier: "peer-reviewed", type: "book",
  authors: ["VanderKam, James C.", "Flint, Peter W."], year: 2002,
  title: "The Meaning of the Dead Sea Scrolls: Their Significance for Understanding the Bible, Judaism, Jesus, and Christianity",
  publisher: "HarperSanFrancisco", isbn: "9780060684655",
  note:
    "Alanın iki önde gelen uzmanının kaynak temelli sentezi. TİCARİ YAYINEVİNDEN çıkmış olması onu popülerleştirme yapmaz - " +
    "ölçüt yayınevi değil metnin türü (aynı ölçütle Tedlock 'peer-reviewed', Allen vd. 1986 'popular' işaretlenmişti).",
});

const magness = mak("magness-2002-archaeology-qumran", {
  tier: "peer-reviewed", type: "book",
  authors: ["Magness, Jodi"], year: 2002,
  title: "The Archaeology of Qumran and the Dead Sea Scrolls",
  publisher: "Eerdmans", isbn: "9780802826879",
  note: "Yerleşimin arkeolojik değerlendirmesi; miqveh sayısı ve mekân yorumunun dayanağı.",
});

const bakirParsomen = mak("3q15-bakir-parsomen", {
  tier: "primary", type: "inscription",
  title: "3Q15 - Bakır Parşömen", language: "he",
  institution: "Ürdün Arkeoloji Müzesi, Amman",
  note: "64 gömü yeri tarif eden bakır levha. 1955'te Manchester'da H. Wright Baker tarafından kesilerek açıldı.",
});

const puech = mak("puech-2015-copper-scroll-text", {
  tier: "peer-reviewed", type: "chapter",
  authors: ["Puech, Émile"], year: 2015,
  title: "Text, Translation and Commentary",
  container: "The Copper Scroll Revisited", publisher: "Brill",
  pages: "25-113", doi: "10.1163/9789047424314_003",
  note: "Bakır Parşömen'in güncel metin ve yorumu. DeepSeek turunda bu kayda aday gelmemişti; ayrıca arandı ve crossref'te doğrulandı.",
});

const loll = mak("loll-2020-mothb-raporu", {
  tier: "institutional", type: "report",
  authors: ["Loll, Colette"], year: 2020,
  title: "Museum of the Bible Dead Sea Scroll Collection: Scientific Research and Analysis",
  institution: "Art Fraud Insights", publisher: "Art Fraud Insights, Washington DC",
  note: "Bağımsız inceleme; 16 parçanın tamamını modern sahtecilik ilan eden rapor. Künye ayrıntıları (yayın biçimi, sayfa) doğrulanmadı.",
});

const bam = mak("bam-2018-inceleme", {
  tier: "institutional", type: "report",
  authors: ["Bundesanstalt für Materialforschung und -prüfung"], year: 2018,
  title: "Museum of the Bible parçaları üzerine malzeme incelemesi",
  institution: "Bundesanstalt für Materialforschung und -prüfung (BAM)",
  publisher: "Bundesanstalt für Materialforschung und -prüfung, Berlin", language: "de",
  note: "Beş parçayı sahte bulan ilk kurumsal inceleme. Künye ayrıntıları doğrulanmadı.",
});

const justnes = mak("justnes-lying-pen", {
  tier: "institutional", type: "database",
  authors: ["Justnes, Årstein"], year: 2018,
  title: "The Lying Pen of the Scribes: Manuscript Forgeries and Counterfeiting Scripture",
  institution: "University of Agder", url: "https://lyingpen.com/",
  note:
    "2002 sonrası piyasaya çıkan 'yeni' parçaları tek tek izleyen araştırma projesi. " +
    "YIL PROJENİN başlangıç dönemine aittir, tek bir yayının tarihi değildir.",
});

const fitzmyer = mak("fitzmyer-1976-ocallaghan-degerlendirmesi", {
  tier: "peer-reviewed", type: "article",
  authors: ["Fitzmyer, Joseph A.", "O'Callaghan, José"], year: 1976,
  title: "Los papiros griegos de la cueva 7 de Qumran",
  container: "Journal of Biblical Literature", volume: "95", pages: "459",
  doi: "10.2307/3265277",
  note: "O'Callaghan'ın cildinin JBL'deki değerlendirmesi. Bu kayıtta iddianın KÖKENİNE erişim yolu olarak kullanılıyor; özgün 1972 Biblica yazısı ayrıca künyelenmedi.",
});

const fee = mak("fee-1973-dissenting-notes-7q5", {
  tier: "peer-reviewed", type: "article",
  authors: ["Fee, Gordon D."], year: 1973,
  title: "Some Dissenting Notes on 7Q5 = Mark 6:52-53",
  container: "Journal of Biblical Literature", volume: "92", pages: "109",
  doi: "10.2307/3262758",
  note: "İddiaya alan içinden gelen ilk ayrıntılı itiraz.",
});

const gundry = mak("gundry-1999-no-nu-7q5", {
  tier: "peer-reviewed", type: "article",
  authors: ["Gundry, Robert H."], year: 1999,
  title: "No NU in Line 2 of 7Q5: A Final Disidentification of 7Q5 with Mark 6:52-53",
  container: "Journal of Biblical Literature", volume: "118", pages: "698",
  doi: "10.2307/3268112",
  note: "Eşleştirmenin dayandığı harf okumasını (2. satırdaki nu) doğrudan reddeden çalışma. Başlığındaki 'final' nitelemesi yazarın kendi değerlendirmesidir.",
});

const iaa = mak("iaa-parsomen-koleksiyonu", {
  tier: "institutional", type: "webpage",
  title: "Ölü Deniz Parşömenleri koleksiyonu",
  institution: "İsrail Eski Eserler Kurumu (IAA)", url: "https://www.deadseascrolls.org.il/",
  note: "Koleksiyonu elinde tutan kurum - mülkiyet tartışmasında TARAF kaynak.",
});

const leonLevy = mak("leon-levy-dijital-kutuphane", {
  tier: "institutional", type: "database",
  title: "Leon Levy Dead Sea Scrolls Digital Library",
  institution: "İsrail Eski Eserler Kurumu (IAA) - Google",
  url: "https://www.deadseascrolls.org.il/",
  note: "Yüksek çözünürlüklü görüntülerin açık erişimli arşivi; yayın tıkanmasının çözülmüş olduğunun kurumsal göstergesi.",
});

/* --- kayıtlar ------------------------------------------------------- */

const esterHaric = finding({
  id: "dss-ester-haric-tum-kitaplar",
  claim: "Kumran'da İbranice Kutsal Kitap'ın Ester dışında her kitabından en az bir elyazması parçası bulundu.",
  status: "established", confidence: "high",
  topic: ["olu-deniz-parsomenleri", "kumran", "metin-elestirisi"],
  subject: kumran,
  period: { earliest: -250, latest: 68, era_label: "Helenistik - Erken Roma", precision: "range", dating_method: ["radiocarbon", "paleography"] },
  languages: ["İbranice", "Aramice", "Grekçe"],
  disciplines: ["arkeoloji", "filoloji", "metin-elestirisi"],
  popular_claim: "Kumran'da Kutsal Kitap'ın tamamı bulundu.",
  divergence:
    "Bulunan şey kitapların TAMAMI değil, her kitaptan en az bir PARÇA - ve bir kitap hiç yok: Ester. Üstelik dağılım da eşit değil; Mezmurlar ~36 nüshayla temsil edilirken bazı kitaplar tek parçayla temsil ediliyor. Yani külliyat bir 'Kutsal Kitap kopyası' değil, hangi metnin ne kadar kopyalandığını gösteren bir KULLANIM haritası.",
  divergence_type: ["kategori-hatasi"],
  sources: [djd, ulrich, tovScribal],
  evidence: [
    ev("Yayımlanmış DJD ciltlerinde kitap bazında envanter mevcut.",
      cite("djd-serisi", "Cilt bazında envanter", "direct"), { id: "djd-envanteri" }),
    ev("Kutsal kitap parşömenlerinin transkripsiyon ve varyant dökümü kitap bazında yayımlanmıştır.",
      cite("ulrich-2010-biblical-qumran-scrolls", "Kitap bazında düzenleme", "direct"), { id: "ulrich-kitap-bazinda" }),
    ev("Mezmurlar ~36, Tesniye ~30, Yeşaya ~21 nüsha ile en çok kopyalananlar.",
      cite("tov-2004-scribal-practices", "Nüsha sayıları", "direct"), { id: "nusha-sayilari" }),
  ],
  counter_evidence: [
    ev("'Her kitaptan en az bir parça' ifadesi PARÇA büyüklüğünü gizler: bazı kitaplar birkaç harflik bir parçayla temsil edilir ve böyle bir parçanın hangi kitaba ait olduğu her zaman kesin değildir.",
      cite("tov-2004-scribal-practices", "Parça tanımlama sorunları", "counter"), { id: "parca-buyuklugu-sorunu" }),
    ev("Ester'in yokluğu bir SESSİZLİK KANITIDIR; kazı örneklemi, korunma koşulları ve kitabın statüsü ayrı ayrı açıklama adaylarıdır ve ayrıştırılmamıştır.",
      cite("ulrich-2010-biblical-qumran-scrolls", "Ester'in yokluğu", "counter"), { id: "ester-sessizlik-kaniti" }),
  ],
  open_questions: ["Ester'in yokluğu tesadüf mü, kasıtlı mı, yoksa kazı örneklemi mi - karara bağlanmadı."],
  checked: CHECKED, used_in: ["olu-deniz-parsomenleri"],
  review: { status: "draft", notes: "Yer tutucu iki gerçek künyeyle desteklendi. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu. 'Parça' ile 'kitap' ayrımı counter_evidence'a eklendi." },
});

const isaiahVaryant = finding({
  id: "dss-isaiah-53-11-isik-varyanti",
  claim: "Yeşaya 53:11'de Masoretik metinde bulunmayan 'ışık' kelimesi, Kumran'daki üç ayrı Yeşaya nüshasında bulunur.",
  status: "established", confidence: "high",
  topic: ["olu-deniz-parsomenleri", "metin-elestirisi", "varyant"],
  subject: kumran,
  period: { earliest: -125, latest: -100, era_label: "Geç Helenistik", precision: "approximate", dating_method: ["paleography", "radiocarbon"] },
  languages: ["İbranice", "Grekçe"],
  disciplines: ["metin-elestirisi", "filoloji"],
  people: [{ name: "Tov, Emanuel", role: "editor", affiliation: "Kudüs İbrani Üniversitesi", year: 1990 }],
  popular_claim: "Parşömenler Kutsal Kitap'ın değiştirildiğini kanıtladı.",
  divergence:
    "Varyant gerçek ama sonucu tersine işaret ediyor: Masoretik gelenekte bir kelime DÜŞMÜŞ, sonradan eklenmemiş. Aktarımın genel sadakati bu bulguyla zedelenmiyor.",
  divergence_type: ["kategori-hatasi"],
  sources: [isaiahA, ulrich, tovTextual],
  evidence: [
    ev("1QIsaa, 1QIsab ve 4QIsad üç bağımsız tanık.",
      cite("ulrich-2010-biblical-qumran-scrolls", "Yeşaya 53 varyant listesi", "direct"), { id: "uc-bagimsiz-tanik" }),
    ev("Grekçe çeviri de aynı fazlalığı taşıyor - bağımsız dördüncü tanık.",
      cite("tov-2012-textual-criticism", "Septuaginta ile karşılaştırma", "direct"), { id: "grekce-dorduncu-tanik" }),
    ev("Metnin kendisi bu okumayı veriyor.",
      cite("1qisaa-buyuk-yesaya", "Yeşaya 53:11", "direct"), { id: "1qisaa-okumasi" }),
    ev("Bugün ciddi eleştirel çevirilerin çoğu bu ayette Kumran'ı izliyor.",
      cite("tov-2012-textual-criticism", "Modern çevirilerin tercihi", "context"), { id: "ceviriler-kumrani-izliyor" }),
  ],
  counter_evidence: [
    ev("'Düşmüş' yönü bir ÇIKARIMDIR: dört tanığın uyuşması bir okumayı daha eski yapar ama Masoretik geleneğin o kelimeyi kaybettiğini doğrudan göstermez; ters yönde bir gelişme de kurgulanabilir.",
      cite("tov-2012-textual-criticism", "Varyant yönü tartışması", "counter"), { id: "yon-cikarim" }),
    ev("Bu kayıt TEK BİR AYETİ konu alıyor; ondan 'aktarım genel olarak sadıktır' sonucunu çıkarmak ayrı ve daha geniş bir iddiadır.",
      cite("ulrich-2010-biblical-qumran-scrolls", "Kayıt düzeyi ayrımı", "context"), { id: "tek-ayetten-genelleme" }),
  ],
  open_questions: ["Kumran ile Masoretik gelenek arasındaki varyant yoğunluğu kitap bazında nasıl dağılıyor?"],
  checked: CHECKED, used_in: ["olu-deniz-parsomenleri"],
  review: { status: "draft", notes: "Yer tutucu ('Tov, metin eleştirisi') iki künyeyle değiştirildi. Varyant yönünün çıkarım olduğu ve tek ayetten genelleme sınırı eklendi." },
});

const essene = finding({
  id: "dss-essene-kimligi",
  claim: "Kumran topluluğu Essene tipi bir mezhepti.",
  status: "contested", confidence: "high",
  topic: ["olu-deniz-parsomenleri", "kumran", "kimlik"],
  subject: kumran,
  period: { earliest: -150, latest: 68, era_label: "Hasmoni - Erken Roma", precision: "range", dating_method: ["radiocarbon", "stratigraphy", "paleography"] },
  languages: ["İbranice", "Aramice"],
  disciplines: ["arkeoloji", "filoloji", "tarih"],
  people: [
    { name: "de Vaux, Roland", role: "excavator", affiliation: "École Biblique, Kudüs", year: 1951, lifespan: "1903-1971" },
    { name: "Schiffman, Lawrence", role: "proposer", affiliation: "New York University", year: 1994 },
    { name: "Golb, Norman", role: "proposer", affiliation: "University of Chicago", year: 1995, lifespan: "1928-2020" },
    { name: "Magness, Jodi", role: "analyst", affiliation: "University of North Carolina", year: 2002 },
  ],
  popular_claim: "Parşömenleri Esseniler yazdı.",
  divergence: "Çoğunluk görüşü bu yönde ama 'kesin' değil; popüler kaynaklar tartışmayı hiç aktarmıyor.",
  divergence_type: ["guncellenmemis"],
  sources: [vanderkamFlint, magness, djd],
  evidence: [
    ev("Yaşlı Plinius'un tarif ettiği Essene yerleşiminin coğrafyası birebir tutuyor.",
      cite("vanderkam-flint-2002-meaning-dss", "Klasik kaynaklar bölümü", "direct"), { id: "plinius-cografyasi" }),
    ev("Josephus ve Philon'un anlattığı âdetler 1QS kurallarıyla örtüşüyor.",
      cite("vanderkam-flint-2002-meaning-dss", "1QS ve klasik tanıklıklar", "direct"), { id: "josephus-philon-1qs" }),
    ev("Yerleşimde olağandışı sayıda miqveh ve mürekkep hokkalı oda.",
      cite("magness-2002-archaeology-qumran", "Yerleşim mekânları", "direct"), { id: "miqveh-ve-murekkep" }),
  ],
  counter_evidence: [
    ev("Parşömenlerin hiçbirinde 'Essene' kelimesi geçmiyor; topluluk kendine Yahad diyor.",
      cite("vanderkam-flint-2002-meaning-dss", "Adlandırma sorunu", "counter"), { id: "essene-kelimesi-yok" }),
    ev("4. mağara içeriği tek bir mezhep kütüphanesi için fazla çeşitli, çelişkili halakhik pozisyonlar bir arada.",
      cite("vanderkam-flint-2002-meaning-dss", "Kütüphanenin bileşimi", "counter"), { id: "kutuphane-cok-cesitli" }),
    ev("Paleografi birçok elyazmasının başka yerde yazıldığını gösteriyor.",
      cite("djd-serisi", "Paleografik değerlendirmeler", "counter"), { id: "baska-yerde-yazilmis" }),
    ev("De Vaux'nun kazı raporu bütünüyle yayımlanmadı - yorumun dayandığı verinin bir kısmı denetlenemiyor.",
      cite("magness-2002-archaeology-qumran", "Kazı verisinin durumu", "counter"), { id: "de-vaux-raporu-eksik" }),
    ev("Miqveh yorumu da tartışmaya açıktır: havuzların hepsinin ritüel banyo olduğu kesin değildir, bir kısmı su depolama olabilir.",
      cite("magness-2002-archaeology-qumran", "Su tesisleri tartışması", "counter"), { id: "miqveh-yorumu-tartismali" }),
  ],
  open_questions: ["Kütüphanenin ne kadarı yerinde üretildi, ne kadarı dışarıdan geldi?"],
  checked: CHECKED, used_in: ["olu-deniz-parsomenleri"],
  review: { status: "draft", notes: "Üç yer tutucu iki gerçek künyeyle karşılandı. Miqveh yorumunun kendisinin de tartışmalı olduğu eklendi - kayıt onu doğrudan kanıt gibi sunuyordu." },
});

const bakir = finding({
  id: "dss-bakir-parsomen-hazine-bulunamadi",
  claim: "Bakır Parşömen'de (3Q15) tarif edilen 64 hazine yerinin hiçbiri bulunamadı.",
  status: "established", confidence: "high",
  topic: ["olu-deniz-parsomenleri", "bakir-parsomen"],
  subject: kumran,
  period: { earliest: 1, latest: 100, era_label: "Erken Roma", precision: "century", dating_method: ["paleography"] },
  languages: ["İbranice"],
  disciplines: ["filoloji", "arkeoloji"],
  people: [{ name: "Baker, H. Wright", role: "analyst", affiliation: "Manchester College of Technology", year: 1955 }],
  popular_claim: "Bakır Parşömen bir hazine haritasıdır; yerler kazılırsa hazine bulunur.",
  divergence:
    "Harita gibi okunamıyor çünkü tarifler BUGÜN VAR OLMAYAN yerel işaretlere dayanıyor - 'şu merdivenin altında', 'şu mezarın yanında'. Bunlar iki bin yıl önceki bir okur için yeterliydi, bugünkü için değil. Ve metnin kendi içinde bir kapanış var: son kayıt, belgenin bir KOPYASININ gömüldüğü yeri tarif ediyor. O da bulunamadı.",
  divergence_type: ["kategori-hatasi"],
  sources: [bakirParsomen, puech],
  evidence: [
    ev("Tarifler bugün var olmayan yerel işaretlere dayanıyor.",
      cite("puech-2015-copper-scroll-text", "Metin ve yorum", "direct"), { id: "yerel-isaretler" }),
    ev("Son kayıt, belgenin bir kopyasının gömüldüğü yeri tarif ediyor; o da bulunamadı.",
      cite("3q15-bakir-parsomen", "Son kayıt", "direct"), { id: "son-kayit-kopya" }),
  ],
  counter_evidence: [
    ev("'Hiçbiri bulunamadı' ifadesi ARAMA yapıldığını varsayar; kaç yerin sistematik olarak arandığı bu kayıtta gösterilmiyor. Bulunamama, aranmamış olmakla da açıklanabilir.",
      cite("puech-2015-copper-scroll-text", "Kayıt düzeyi sınırı", "counter"), { id: "arama-yapildi-mi" }),
    ev("Metnin türü tartışmalıdır ve bu, 'bulunamadı'nın anlamını değiştirir: gerçek bir envanterse bulunamama bir başarısızlıktır, folklorik ya da ideal bir liste ise bulunacak bir şey zaten yoktur.",
      cite("puech-2015-copper-scroll-text", "Metnin türü tartışması", "context"), { id: "metnin-turu-anlami-degistirir" }),
  ],
  open_questions: ["Metin gerçek bir envanter mi, savaş dönemi kayıt mı, yoksa folklorik mi - toplam miktar antik dünya ölçeğinde inanılmayacak kadar büyük."],
  checked: CHECKED, used_in: ["olu-deniz-parsomenleri"],
  review: { status: "draft", notes: "DeepSeek turunda aday gelmemişti; Puech 2015 ayrıca arandı ve crossref'te doğrulandı. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu." },
});

const sahtecilik = finding({
  id: "dss-museum-of-the-bible-sahte",
  claim: "Museum of the Bible'ın satın aldığı 16 Ölü Deniz parçasının tamamı modern sahteciliktir.",
  status: "established", confidence: "high",
  topic: ["olu-deniz-parsomenleri", "sahtecilik", "provenans"],
  subject: { site: "Museum of the Bible koleksiyonu", region: "Washington DC", modern_country: "ABD" },
  period: { earliest: 2002, latest: 2020, era_label: "Modern antika piyasası", precision: "range", dating_method: ["isotopic", "radiocarbon"] },
  languages: ["İbranice"],
  disciplines: ["arkeoloji", "filoloji"],
  people: [
    { name: "Loll, Colette", role: "analyst", affiliation: "Art Fraud Insights", year: 2020 },
    { name: "Justnes, Årstein", role: "critic", affiliation: "University of Agder", year: 2016 },
  ],
  popular_claim: "Yeni Ölü Deniz parçaları ortaya çıkmaya devam ediyor.",
  divergence:
    "2002'den sonra piyasaya çıkan parçaların TAMAMINA yakını sahte çıktı. Ve sahteciliğin nasıl yakalandığı, kaydın asıl dersi: mürekkep yüzeydeki ÇATLAKLARA AKMIŞ - yani yazı, deri yıprandıktan SONRA yazılmış. Antik bir metin böyle davranmaz. Malzeme de parşömen değil, muhtemelen Roma dönemi YAZISIZ deri; yani sahteci gerçek antik malzeme bulup üstüne yazmış.",
  divergence_type: ["provenans-yoklugu"],
  sources: [loll, bam, justnes],
  evidence: [
    ev("Mürekkep yüzeydeki çatlaklara akmış - yani yazı, deri yıprandıktan SONRA yazılmış.",
      cite("loll-2020-mothb-raporu", "Mürekkep ve yüzey incelemesi", "direct"), { id: "murekkep-catlaklara-akmis" }),
    ev("Malzeme antik parşömen değil, muhtemelen Roma dönemi yazısız deri.",
      cite("loll-2020-mothb-raporu", "Malzeme incelemesi", "direct"), { id: "yazisiz-deri" }),
    ev("Bazı parçalarda modern hayvansal tutkal ve amber kalıntısı.",
      cite("loll-2020-mothb-raporu", "Katkı maddeleri", "direct"), { id: "modern-tutkal-amber" }),
    ev("2018'de Almanya'daki BAM beş parçayı sahte ilan etti; 2020'de bağımsız inceleme 16'sının tamamını.",
      cite("bam-2018-inceleme", "İnceleme sonucu", "direct"), { id: "bam-2018-bes-parca" }),
    ev("2002 sonrası piyasaya çıkan parçalar bir araştırma projesi tarafından tek tek izleniyor.",
      cite("justnes-lying-pen", "Proje kapsamı", "context"), { id: "lying-pen-projesi" }),
  ],
  counter_evidence: [
    ev("Bu kayıt MUSEUM OF THE BIBLE koleksiyonu içindir; Kumran'dan kazıyla çıkmış parşömenlerin sahihliğine dair hiçbir şey söylemez. İki cümle karıştırılırsa kayıt asıl külliyatı da şüpheye sokuyormuş gibi okunur.",
      cite("justnes-lying-pen", "Kayıt düzeyi ayrımı", "context"), { id: "kazi-parcalarini-kapsamiyor" }),
    ev("Loll ve BAM raporlarının künye ayrıntıları (yayın biçimi, sayfa) bu turda doğrulanmadı.",
      cite("loll-2020-mothb-raporu", "Künye düzeyi", "context"), { id: "rapor-kunyeleri-eksik" }),
  ],
  open_questions: ["2002 sonrası piyasaya çıkan parçaların kaçı incelendi, kaçı hâlâ denetlenmedi?"],
  checked: CHECKED, used_in: ["olu-deniz-parsomenleri"],
  review: { status: "draft", notes: "Kayıt popular_claim/divergence olmadan duruyordu; kuruldu. En önemli ekleme: bu kaydın KAZI parçalarını kapsamadığı ayrımı - okuma hatasına çok açıktı." },
});

const yediQBes = finding({
  id: "dss-7q5-markos-iddiasi",
  claim: "7Q5 parçası Markos İncili'nden bir bölümdür.",
  status: "refuted", confidence: "high",
  topic: ["olu-deniz-parsomenleri", "yeni-ahit"],
  subject: kumran,
  period: { earliest: -50, latest: 68, era_label: "Erken Roma", precision: "approximate", dating_method: ["paleography"] },
  languages: ["Grekçe"],
  disciplines: ["filoloji", "metin-elestirisi"],
  people: [
    { name: "O'Callaghan, José", role: "proposer", affiliation: "Pontificio Istituto Biblico", year: 1972, lifespan: "1922-2001" },
    { name: "Thiede, Carsten Peter", role: "proposer", year: 1992, lifespan: "1952-2004" },
    { name: "Fee, Gordon D.", role: "critic", year: 1973 },
    { name: "Gundry, Robert H.", role: "critic", year: 1999 },
  ],
  popular_claim: "Kumran'da Yeni Ahit parçası bulundu.",
  divergence:
    "1972'de öne sürülen bir iddia popüler apolojetik literatürde kanıtlanmış gibi dolaşıyor. Oysa eşleştirmenin dayandığı harf okuması alan içinde ayrıntılı biçimde reddedildi - 1973'te ve kesin biçimde 1999'da. Parçada yirmiden az harf var ve okunabilir tek TAM kelime yok; böyle bir parçadan çıkarılan her eşleştirme, aranan metne göre değişir.",
  divergence_type: ["ideolojik-secim"],
  sources: [fitzmyer, fee, gundry],
  evidence: [
    ev("İddianın kaynağı belirlidir ve alan içinde değerlendirilmiştir.",
      cite("fitzmyer-1976-ocallaghan-degerlendirmesi", "O'Callaghan cildinin değerlendirmesi", "claim-origin"), { id: "iddianin-kaynagi" }),
  ],
  counter_evidence: [
    ev("Parçada yirmiden az harf var; okunabilir tek tam kelime yok.",
      cite("fee-1973-dissenting-notes-7q5", "Parçanın durumu", "counter"), { id: "yirmiden-az-harf" }),
    ev("Eşleştirme bir harf düzeltmesine dayanıyor - 2. satırdaki nu okuması reddedildi.",
      cite("gundry-1999-no-nu-7q5", "Nu okumasının reddi", "counter"), { id: "nu-okumasi-reddedildi" }),
    ev("Markos'a uyması için metinden bir ifadenin düşmüş sayılması gerekiyor; bu düşme Markos'un hiçbir elyazmasında yok.",
      cite("fee-1973-dissenting-notes-7q5", "Metin karşılaştırması", "counter"), { id: "elyazmalarinda-yok" }),
    ev("Gundry'nin başlığındaki 'final' nitelemesi YAZARIN kendi değerlendirmesidir; bir tartışmanın kapandığını başlığı ilan etmez.",
      cite("gundry-1999-no-nu-7q5", "Kayıt düzeyi ayrımı", "context"), { id: "final-yazarin-nitelemesi" }),
    ev("O'Callaghan'ın özgün 1972 Biblica yazısı bu kayıtta künyelenmedi; iddiaya erişim JBL'deki değerlendirme üzerinden.",
      cite("fitzmyer-1976-ocallaghan-degerlendirmesi", "Künye düzeyi sınırı", "context"), { id: "1972-yazisi-kunyelenmedi" }),
  ],
  open_questions: ["O'Callaghan'ın 1972 tarihli Biblica yazısı künyelenmeli."],
  checked: CHECKED, used_in: ["olu-deniz-parsomenleri"],
  review: { status: "draft", notes: "DeepSeek turunda aday gelmemişti; Fee 1973 ve Gundry 1999 ayrıca arandı ve crossref'te yazarlarıyla doğrulandı. 'Uzmanların ezici çoğunluğu reddediyor' ifadesi artık iki künyeli çalışmaya bağlı." },
});

const mulkiyet = finding({
  id: "dss-mulkiyet-ihtilafi",
  claim: "Ölü Deniz Parşömenleri'nin mülkiyeti hukuken çözülmemiştir.",
  status: "unknown", confidence: "high",
  topic: ["olu-deniz-parsomenleri", "mulkiyet", "miras-hukuku"],
  subject: kumran,
  period: { earliest: 1947, latest: 2026, era_label: "Modern", precision: "range", dating_method: ["historical-record"] },
  disciplines: ["hukuk", "tarih"],
  popular_claim: "Parşömenler İsrail'in malıdır; bulundukları yer bunu belirler.",
  divergence:
    "Bulundukları yer o tarihte İSRAİL DEĞİLDİ. 1947-56 arasında parşömenler Ürdün yönetimindeki Batı Şeria ve Doğu Kudüs'te bulundu; koleksiyon 1967'de İsrail Rockefeller Müzesi'ni ele geçirince el değiştirdi. Ürdün ve Filistin Yönetimi iade talep ediyor. Yani 'kimin' sorusunun cevabı, hangi tarihteki hangi egemenliğin esas alındığına bağlı - ve bu hukuken kapanmış değil.",
  divergence_type: ["provenans-yoklugu"],
  sources: [iaa],
  evidence: [
    ev("Parşömenler 1947-56'da Ürdün yönetimindeki Batı Şeria ve Doğu Kudüs'te bulundu.",
      cite("iaa-parsomen-koleksiyonu", "Koleksiyonun tarihçesi", "direct"), { id: "urdun-yonetiminde-bulundu" }),
    ev("İsrail 1967'de Rockefeller Müzesi'ni ele geçirdiğinde koleksiyonu devraldı.",
      cite("iaa-parsomen-koleksiyonu", "Koleksiyonun tarihçesi", "direct"), { id: "1967-devralma" }),
  ],
  counter_evidence: [
    ev("BU KAYIT TEK BİR KURUMSAL KAYNAĞA DAYANIYOR ve o kurum tartışmanın TARAFIDIR. Ürdün ve Filistin tarafının konumu burada temsil edilmiyor.",
      cite("iaa-parsomen-koleksiyonu", "Kaynak konumu", "counter"), { id: "tek-taraf-kaynak" }),
    ev("İade taleplerinin ve sergi itirazlarının belgeleri bu kayıtta gösterilmiyor; ifadeler genel aktarımlara dayanıyor.",
      cite("iaa-parsomen-koleksiyonu", "Kayıt düzeyi sınırı", "counter"), { id: "iade-belgeleri-yok" }),
  ],
  open_questions: [
    "Ürdün ve Filistin Yönetimi'nin resmî iade talepleri belgeli mi? Hangi tarihte, hangi kanaldan?",
    "Hukuk literatüründe bu ihtilafı inceleyen bir çalışma künyelenmeli - bu turda bulunamadı.",
  ],
  checked: CHECKED, used_in: ["olu-deniz-parsomenleri"],
  review: {
    status: "draft",
    notes:
      "DeepSeek Katz 2005'i önerdi ve URL doğrulaması geçti - ama URL derginin ANA SAYFASIYDI, makalenin kendisi değil. Rollinger vakasıyla aynı gerekçeyle ELENDİ. Kayıt hâlâ tek ve taraf bir kaynağa dayanıyor; bu açıkça yazıldı ve açık soruya taşındı.",
  },
});

const yayinTikanmasi = finding({
  id: "dss-yayin-tikanmasi",
  claim: "4. mağara materyalinin büyük kısmı keşiften kırk yıl sonra hâlâ yayımlanmamıştı; tıkanma 1991'de kırıldı.",
  status: "established", confidence: "high",
  topic: ["olu-deniz-parsomenleri", "bilim-sosyolojisi"],
  subject: kumran,
  period: { earliest: 1953, latest: 2011, era_label: "Modern yayın tarihi", precision: "range", dating_method: ["historical-record"] },
  disciplines: ["bilim-tarihi", "filoloji"],
  people: [
    { name: "Tov, Emanuel", role: "editor", affiliation: "DJD baş editörlüğü", year: 1990 },
    { name: "Wacholder, Ben-Zion", role: "analyst", affiliation: "Hebrew Union College", year: 1991, lifespan: "1924-2011" },
    { name: "Abegg, Martin", role: "analyst", affiliation: "Hebrew Union College", year: 1991 },
    { name: "Shanks, Hershel", role: "critic", affiliation: "Biblical Archaeology Society", year: 1991, lifespan: "1930-2021" },
  ],
  popular_claim: "Vatikan ya da kilise parşömenleri sakladı.",
  divergence: "Gecikme gerçekti ama sebebi örtbas değil, akademik tekel ve kurumsal hantallıktı. Yayımlanan metinlerde Hristiyanlığı sarsan bir şey çıkmadı.",
  divergence_type: ["medya-abartisi"],
  sources: [vanderkamFlint, djd, leonLevy],
  evidence: [
    ev("1953'te sekiz kişilik kapalı bir ekibe verildi; yayın hakkı öğrencilere miras kalıyordu.",
      cite("vanderkam-flint-2002-meaning-dss", "Yayın tarihçesi", "direct"), { id: "kapali-ekip-1953" }),
    ev("1990'da Emanuel Tov baş editör oldu ve ekibi genişletti.",
      cite("vanderkam-flint-2002-meaning-dss", "Yayın tarihçesi", "direct"), { id: "tov-1990" }),
    ev("1991'de üç kırılma: Wacholder-Abegg konkordanstan rekonstrüksiyon, Huntington Kütüphanesi mikrofilmleri açtı, Biblical Archaeology Society fotoğraf baskısı yayımladı.",
      cite("vanderkam-flint-2002-meaning-dss", "1991 olayları", "direct"), { id: "1991-uc-kirilma" }),
    ev("DJD serisi 40 ciltle 2009'da esasen tamamlandı; görüntüler bugün açık erişimli.",
      cite("djd-serisi", "Serinin tamamlanması", "direct"), { id: "djd-tamamlandi" }),
    ev("Yüksek çözünürlüklü görüntüler kurumsal dijital kütüphanede herkese açık.",
      cite("leon-levy-dijital-kutuphane", "Arşivin kapsamı", "direct"), { id: "dijital-kutuphane-acik" }),
  ],
  counter_evidence: [
    ev("'Hristiyanlığı sarsan bir şey çıkmadı' ifadesi bir DEĞERLENDİRMEDİR, ölçüm değil; neyin 'sarsıcı' sayılacağı okuyucunun beklentisine bağlıdır.",
      cite("vanderkam-flint-2002-meaning-dss", "Kayıt düzeyi ayrımı", "context"), { id: "sarsici-degerlendirme" }),
    ev("Tıkanmanın 1991'de 'kırılması' yayın işinin bittiği anlamına gelmez; DJD serisinin tamamlanması 2009'u buldu.",
      cite("djd-serisi", "Yayın takvimi", "counter"), { id: "1991-bitis-degil" }),
  ],
  open_questions: ["Kapalı ekip dönemi hangi kararlarla sürdürüldü - kurumsal yazışmalar incelendi mi?"],
  checked: CHECKED, used_in: ["olu-deniz-parsomenleri"],
  review: { status: "draft", notes: "Yer tutucular VanderKam & Flint ve dijital kütüphane künyeleriyle karşılandı. 'Sarsıcı bir şey çıkmadı' ifadesinin bir değerlendirme olduğu işaretlendi." },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
const yeni = [esterHaric, isaiahVaryant, essene, bakir, sahtecilik, yediQBes, mulkiyet, yayinTikanmasi];
for (const r of yeni) {
  const i = list.findIndex((x) => x.id === r.id);
  if (i === -1) { console.error("bulunamadı:", r.id); process.exit(1); }
  const onceki = list[i].schema_version ?? 1;
  list[i] = r;
  console.log(`  v${onceki} -> v2  ${r.id}`);
}
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
const v2 = list.filter((r) => r.schema_version === 2).length;
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${v2}${v2 === list.length ? "  DOSYA TAMAM" : ""}`);
