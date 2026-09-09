#!/usr/bin/env node
// Roma dosyası, ikinci geçiş: kalan 16 kayıt. Dosya tamamlanıyor (27/27).
//
// BU DOSYADA DURUM FELAKETLER'E BENZİYOR: kaynakların çoğu doğru eserleri
// adıyla anıyordu (Stark, Metzger, Moss, de Ste. Croix, Ward-Perkins,
// Dalgaard) ama künye alanları boştu ya da başlık dizesinin içindeydi.
// DeepSeek turu 15 kayıt için künye getirdi; 16'ncısı (Hierocles) zaten iki
// birincil kaynağa dayanıyor ve o hâliyle doğru.
//
// DENETİMDE ÇIKAN İKİ ŞEY - sadece künye takmadım:
//
// 1) WICKHAM, WARD-PERKINS'İN KARŞITIDIR. Maddi gerileme kaydına üç aday
//    geldi: Ward-Perkins 2005 (çöküş tezi), McCormick 2001 (ticaret),
//    Wickham 2005 (dönüşüm ve bölgesel çeşitlilik). Üçünü de "kanıt"
//    kutusuna koymak yanlış olurdu: Wickham tam da kaydın counter_evidence
//    satırının ("düşüş her yerde aynı değil") kaynağıdır. Tartışmanın iki
//    tarafı ayrı ayrı bağlandı.
//
// 2) HOPKINS, STARK'IN ARİTMETİĞİNE CEVAPTIR. Büyüme oranı kaydında Stark
//    1996 iddianın kaynağı; Hopkins 1998 (Journal of Early Christian
//    Studies, DOI doğrulandı) o aritmetiği tartışan çalışmadır. Kayıt
//    "tarihçiler arasında tahminler geniş aralıkta değişir" diyordu ama
//    hiçbir tahmini künyelemiyordu - artık Hopkins'e bağlı.
//
// SINIR: hiçbir kaynağın tam metni okunmadı; locator'lar bölüm düzeyinde.
// Krautheimer'ın künyesi 4. baskıya (1986) göre verildi; kayıttaki people
// alanı 1965 diyor - baskı farkı, kaynak notunda yazılı.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/roma.json";
const CHECKED = "2026-09-09";
const mak = (id, o) => source(id, { language: "en", accessed: CHECKED, ...o });

/* --- kaynaklar ----------------------------------------------------- */

const S = {
  mcconnell: mak("mcconnell-2018-lead-greenland", {
    tier: "peer-reviewed", type: "article",
    authors: ["McConnell, Joseph R.", "Wilson, Andrew I."], year: 2018,
    title: "Lead pollution recorded in Greenland ice indicates European emissions tracked plagues, wars, and imperial expansion during antiquity",
    container: "Proceedings of the National Academy of Sciences",
    doi: "10.1073/pnas.1721818115",
    note: "Buz karotu kurşun kaydının Roma ekonomisiyle örtüşmesini kuran çalışma.",
  }),
  hong: mak("hong-1994-greenland-lead", {
    tier: "peer-reviewed", type: "article",
    authors: ["Hong, Sungmin", "Candelone, Jean-Pierre"], year: 1994,
    title: "Greenland ice evidence of hemispheric lead pollution two millennia ago by Greek and Roman civilizations",
    container: "Science", doi: "10.1126/science.265.5180.1841",
    note: "Yarımküre ölçeğinde kirliliği ilk gösteren çalışma; kıta ölçeği iddiasının temeli.",
  }),
  delile: mak("delile-2014-rome-city-waters", {
    tier: "peer-reviewed", type: "article",
    authors: ["Delile, Hugo", "Blichert-Toft, Janne"], year: 2014,
    title: "Lead in ancient Rome's city waters",
    container: "Proceedings of the National Academy of Sciences",
    doi: "10.1073/pnas.1400097111",
    note: "Roma'nın şebeke suyundaki kurşunun ölçümü. Sonucu ölçek düzeltir: musluk suyu doğal suya göre yüksek ama akut zehirlenme eşiğinin çok altında.",
  }),
  dalgaard: mak("dalgaard-2022-roman-roads", {
    tier: "peer-reviewed", type: "article",
    authors: ["Dalgaard, Carl-Johan", "Kaarsen, Nicolai", "Olsson, Ola", "Selaya, Pablo"], year: 2022,
    title: "Roman roads to prosperity: Persistence and non-persistence of public infrastructure",
    container: "Journal of Comparative Economics",
    doi: "10.1016/j.jce.2022.05.003",
    note: "Yol yoğunluğu ile modern ekonomik etkinlik arasındaki örtüşme ve tekerleğin bırakıldığı bölgelerdeki doğal deney.",
  }),
  stein: mak("stein-1999-roman-law-european-history", {
    tier: "peer-reviewed", type: "book",
    authors: ["Stein, Peter"], year: 1999,
    title: "Roman Law in European History",
    publisher: "Cambridge University Press", isbn: "9780521643726",
    note: "Roma hukukunun kesintili aktarımının standart özeti.",
  }),
  wardPerkins: mak("ward-perkins-2005-fall-of-rome", {
    tier: "peer-reviewed", type: "book",
    authors: ["Ward-Perkins, Bryan"], year: 2005,
    title: "The Fall of Rome and the End of Civilization",
    publisher: "Oxford University Press", isbn: "9780192807281",
    note: "Maddi göstergelerle ÇÖKÜŞ tezinin savunusu. Bu kayıtta tartışmanın bir tarafıdır, hakemi değil.",
  }),
  wickham: mak("wickham-2005-framing-early-middle-ages", {
    tier: "peer-reviewed", type: "book",
    authors: ["Wickham, Chris"], year: 2005,
    title: "Framing the Early Middle Ages: Europe and the Mediterranean 400-800",
    publisher: "Oxford University Press", isbn: "9780199264490",
    note:
      "Tartışmanın ÖTEKİ tarafı: bölgesel çeşitliliği ve dönüşümü vurgular. DeepSeek turu bunu Ward-Perkins'le birlikte 'kanıt' " +
      "olarak önermişti; ikisini aynı kutuya koymak tartışmayı gizlerdi. Burada karşı kanıt tarafına bağlandı.",
  }),
  mccormick: mak("mccormick-2001-origins-european-economy", {
    tier: "peer-reviewed", type: "book",
    authors: ["McCormick, Michael"], year: 2001,
    title: "Origins of the European Economy: Communications and Commerce, AD 300-900",
    publisher: "Cambridge University Press", isbn: "9780521661027",
    note: "Ticaret ve iletişim ağlarının niceliksel incelemesi; batık ve dolaşım verilerinin dayanağı.",
  }),
  ostrogorsky: mak("ostrogorsky-1969-byzantine-state", {
    tier: "peer-reviewed", type: "book",
    authors: ["Ostrogorsky, George"], year: 1969,
    title: "History of the Byzantine State",
    publisher: "Rutgers University Press", isbn: "9780813511986",
    note: "Doğu Roma'nın 1453'e kadar süren varlığının standart anlatımı.",
  }),
  pharr: mak("pharr-1952-theodosian-code", {
    tier: "primary", type: "edition",
    authors: ["Pharr, Clyde"], year: 1952,
    title: "The Theodosian Code and Novels and the Sirmondian Constitutions",
    publisher: "Princeton University Press", isbn: "9781584771463",
    note: "Codex Theodosianus'un standart İngilizce çevirisi; 380 tarihli Cunctos populos metnine erişim yolu.",
  }),
  jones: mak("jones-1964-later-roman-empire", {
    tier: "peer-reviewed", type: "book",
    authors: ["Jones, A. H. M."], year: 1964,
    title: "The Later Roman Empire 284-602: A Social, Economic and Administrative Survey",
    publisher: "Johns Hopkins University Press", isbn: "9780801833540",
    note: "Geç Roma idaresinin standart başvuru eseri.",
  }),
  metzger: mak("metzger-1987-canon-new-testament", {
    tier: "peer-reviewed", type: "book",
    authors: ["Metzger, Bruce M."], year: 1987,
    title: "The Canon of the New Testament: Its Origin, Development, and Significance",
    publisher: "Oxford University Press", isbn: "9780198269540",
    note: "Kanon tarihinin standart eseri.",
  }),
  ehrmanLost: mak("ehrman-2003-lost-christianities", {
    tier: "peer-reviewed", type: "book",
    authors: ["Ehrman, Bart D."], year: 2003,
    title: "Lost Christianities: The Battles for Scripture and the Faiths We Never Knew",
    publisher: "Oxford University Press", isbn: "9780195141832",
    note: "Kanon dışı metinlerin akıbeti ve 'imha' anlatısının değerlendirmesi.",
  }),
  kelly: mak("kelly-1972-early-christian-creeds", {
    tier: "peer-reviewed", type: "book",
    authors: ["Kelly, J. N. D."], year: 1972,
    title: "Early Christian Creeds",
    publisher: "Longman", isbn: "9780582492196",
    note: "İznik bildirgesinin ve konsil gündeminin standart incelemesi.",
  }),
  stark: mak("stark-1996-rise-of-christianity", {
    tier: "peer-reviewed", type: "book",
    authors: ["Stark, Rodney"], year: 1996,
    title: "The Rise of Christianity: A Sociologist Reconsiders History",
    publisher: "Princeton University Press", isbn: "9780691027494",
    note: "Büyüme oranı modelinin KAYNAĞI. Bu kayıtta doğrulayıcı değil, iddianın çıkış noktası.",
  }),
  hopkins: mak("hopkins-1998-christian-number", {
    tier: "peer-reviewed", type: "article",
    authors: ["Hopkins, Keith"], year: 1998,
    title: "Christian Number and Its Implications",
    container: "Journal of Early Christian Studies",
    doi: "10.1353/earl.1998.0035",
    note: "Sayı tahminlerinin ve büyüme aritmetiğinin eleştirel değerlendirmesi. Kaydın 'tahminler geniş aralıkta' ifadesinin dayanağı.",
  }),
  macmullen: mak("macmullen-1984-christianizing", {
    tier: "peer-reviewed", type: "book",
    authors: ["MacMullen, Ramsay"], year: 1984,
    title: "Christianizing the Roman Empire (A.D. 100-400)",
    publisher: "Yale University Press", isbn: "9780300036428",
    note: "Yayılmanın toplumsal mekanizmalarının incelemesi.",
  }),
  steCroix: mak("ste-croix-1963-why-persecuted", {
    tier: "peer-reviewed", type: "article",
    authors: ["de Ste. Croix, G. E. M."], year: 1963,
    title: "Why Were the Early Christians Persecuted?",
    container: "Past & Present", volume: "26",
    doi: "10.1093/past/26.1.6",
    note: "Zulmün hukuki ve idari mantığının klasik incelemesi.",
  }),
  moss: mak("moss-2013-myth-of-persecution", {
    tier: "peer-reviewed", type: "book",
    authors: ["Moss, Candida R."], year: 2013,
    title: "The Myth of Persecution: How Early Christians Invented a Story of Martyrdom",
    publisher: "HarperOne", isbn: "9780062104526",
    note: "Şehitlik anlatılarının edebî oluşumunu inceleyen çalışma. Alanda TARTIŞMALIDIR; kayıt bunu ayrıca işaretliyor.",
  }),
  krautheimer: mak("krautheimer-1986-early-christian-architecture", {
    tier: "peer-reviewed", type: "book",
    authors: ["Krautheimer, Richard"], year: 1986,
    title: "Early Christian and Byzantine Architecture",
    publisher: "Yale University Press", isbn: "9780300052947",
    note: "Bazilika planının kilise mimarisine geçişinin standart incelemesi. KÜNYE 4. BASKIYA GÖRE (1986); kayıttaki people alanı ilk baskıyı (1965) anıyor.",
  }),
  brown: mak("brown-2012-eye-of-a-needle", {
    tier: "peer-reviewed", type: "book",
    authors: ["Brown, Peter"], year: 2012,
    title: "Through the Eye of a Needle: Wealth, the Fall of Rome, and the Making of Christianity in the West",
    publisher: "Princeton University Press", isbn: "9780691152905",
    note: "Kilisenin Batı'da kurumsallaşması ve servetle ilişkisi.",
  }),
  meier: mak("meier-1991-marginal-jew-1", {
    tier: "peer-reviewed", type: "book",
    authors: ["Meier, John P."], year: 1991,
    title: "A Marginal Jew: Rethinking the Historical Jesus, Volume 1",
    publisher: "Doubleday", isbn: "9780385264259",
    note: "Testimonium'un 'özgün çekirdek + müdahale' okumasının standart savunusu.",
  }),
  whealey: mak("whealey-2003-josephus-on-jesus", {
    tier: "peer-reviewed", type: "book",
    authors: ["Whealey, Alice"], year: 2003,
    title: "Josephus on Jesus: The Testimonium Flavianum Controversy from Late Antiquity to Modern Times",
    publisher: "Peter Lang", isbn: "9780820452418",
    note: "Tartışmanın tarihçesi ve Arapça/Süryanice aktarımların değerlendirmesi.",
  }),
  ehrmanDid: mak("ehrman-2012-did-jesus-exist", {
    tier: "peer-reviewed", type: "book",
    authors: ["Ehrman, Bart D."], year: 2012,
    title: "Did Jesus Exist? The Historical Argument for Jesus of Nazareth",
    publisher: "HarperOne", isbn: "9780062204608",
    note: "Varlığı reddeden konuma doğrudan cevap; 'Roma uydurdu' tezinin de değerlendirmesi.",
  }),
  philostratos: mak("philostratus-2005-life-of-apollonius", {
    tier: "primary", type: "edition",
    authors: ["Philostratus"], year: 2005,
    title: "The Life of Apollonius of Tyana",
    container: "Loeb Classical Library", publisher: "Harvard University Press",
    isbn: "9780674996137", language: "grc",
    note: "Apollonius hakkındaki tek kapsamlı kaynağın eleştirel edisyonu ve çevirisi.",
  }),
  dzielska: mak("dzielska-1986-apollonius", {
    tier: "peer-reviewed", type: "book",
    authors: ["Dzielska, Maria"], year: 1986,
    title: "Apollonius of Tyana in Legend and History",
    publisher: "L'Erma di Bretschneider", isbn: "9788870625998",
    note: "Apollonius efsanesinin oluşumu ve Hierocles polemiğinin tarihsel incelemesi.",
  }),
  eusebiosContra: mak("eusebios-contra-hieroclem", {
    tier: "primary", type: "book",
    authors: ["Eusebios (Kaisareia)"], title: "Contra Hieroclem (Hierocles'e Karşı)", language: "grc",
    note: "Hierocles'in metnine erişimin TEK yolu. Taraf bir aktarıcıdır ve bunu kontrol edecek bağımsız metin yok.",
  }),
  lactantius: mak("lactantius-de-mortibus", {
    tier: "primary", type: "book",
    authors: ["Lactantius"], title: "De mortibus persecutorum", language: "la",
    note: "313 metninin içeriğini aktaran kaynak; ayrıca Hierocles'in zulümdeki rolüne değinir.",
  }),
  josephus: mak("josephus-antiquitates-18-63", {
    tier: "primary", type: "manuscript",
    authors: ["Flavius Josephus"], title: "Antiquitates Judaicae 18.63 (Testimonium Flavianum)", language: "grc",
    note: "Tartışmanın konusu olan pasaj. Elimizdeki bütün Grekçe elyazmaları Hristiyan kopyalama geleneğinden gelir.",
  }),
  athanasios: mak("athanasios-39-paskalya-mektubu", {
    tier: "primary", type: "manuscript",
    authors: ["Athanasios (İskenderiye)"], year: 367,
    title: "39. Paskalya Mektubu (Festal Letter)", language: "grc",
    note: "Bugünkü 27 kitabı tam listeleyen bilinen ilk belge.",
  }),
  iznikKanonlari: mak("iznik-konsili-kanonlari", {
    tier: "primary", type: "manuscript",
    year: 325, title: "İznik Konsili kanonları (20 kanon)", language: "grc",
    note: "Konsilden çıkan metinlerin tamamı; hiçbiri kutsal metin listesi içermez.",
  }),
  codexTheo: mak("codex-theodosianus-16-1-2", {
    tier: "primary", type: "manuscript",
    year: 380, title: "Codex Theodosianus XVI.1.2 (Cunctos populos)", language: "la",
    note: "İznik inancını imparatorluğun resmî dini ilan eden 380 tarihli yasa.",
  }),
  buzKarotu: mak("gronland-buz-karotu", {
    tier: "primary", type: "dataset",
    title: "Kuzey Grönland buz karotu (423 m)",
    institution: "Desert Research Institute",
    note: "Yıllık katman sayımıyla tarihlenmiş fiziksel kayıt.",
  }),
};

/* --- yardımcı ------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
const eski = (id) => {
  const r = list.find((x) => x.id === id);
  if (!r) { console.error("kayıt yok:", id); process.exit(1); }
  return r;
};
// v1 kaydın gövdesini alıp v2 iskeletine taşır; kanıt satırları çağıranca bağlanır.
const govde = (id) => {
  const o = eski(id);
  const { evidence, counter_evidence, sources, schema_version, review, ...kalan } = o;
  return kalan;
};

const yeni = [];
const kur = (id, sources, evidence, counter_evidence, notes, ek = {}) =>
  yeni.push(finding({
    ...govde(id), ...ek, sources, evidence, counter_evidence,
    checked: CHECKED, review: { status: "draft", notes },
  }));

/* --- kayıtlar ------------------------------------------------------- */

kur("roma-buz-karotu-ekonomi", [S.buzKarotu, S.mcconnell, S.hong],
  [
    ev("423 metrelik buz karotu yıllık katman sayımıyla tarihlendi; kayıt MÖ 1100'den MS 800'e uzanıyor.",
      cite("gronland-buz-karotu", "Karot tanımı", "direct"), { id: "karot-tarihlemesi" }),
    ev("Kurşun, gümüş üretimi için yapılan kurşun cevheri izabesinden atmosfere salınıyor.",
      cite("mcconnell-2018-lead-greenland", "Kaynak mekanizması", "direct"), { id: "izabe-mekanizmasi" }),
    ev("Kirlilik refah dönemlerinde yükseliyor - Fenike yayılması, sonra Roma; zirve imparatorluk döneminde.",
      cite("mcconnell-2018-lead-greenland", "Kronoloji ve zirve", "direct"), { id: "refahla-yukselis" }),
    ev("Savaşlar ve büyük salgınlar eğride düşüş olarak görünüyor.",
      cite("mcconnell-2018-lead-greenland", "Savaş ve salgın dönemleri", "direct"), { id: "savas-salgin-dususu" }),
  ],
  [
    ev("Gösterge kısmidir: gümüş üretimiyle ilişkisi güçlü ama tarım, tekstil ve hizmetler bu kayıtta görünmez.",
      cite("mcconnell-2018-lead-greenland", "Göstergenin kapsamı", "counter"), { id: "gosterge-kismi" }),
    ev("Kurşun taşınımı atmosferik koşullara bağlıdır; kaynak bölge ayrıştırması dolaylıdır.",
      cite("hong-1994-greenland-lead", "Taşınım ve kaynak atfı", "counter"), { id: "kaynak-atfi-dolayli" }),
    ev("Karot KUZEY YARIMKÜRE sinyalidir; Roma'ya atıf izotop ve kronoloji üzerinden yapılan bir ÇIKARIMDIR, doğrudan ölçüm değil.",
      cite("hong-1994-greenland-lead", "Yarımküre ölçeği", "context"), { id: "yarimkure-sinyali" }),
  ],
  "Yer tutucu künyeler DOI'lerle tamamlandı. Karotun yarımküre sinyali olduğu ve Roma atfının çıkarım olduğu eklendi.");

kur("roma-kursun-kita-olcegi-zehirlenme", [S.hong, S.delile, S.mcconnell],
  [
    ev("Buz karotu ölçümleri Roma döneminde Avrupa çapında yükselmiş atmosferik kurşun gösteriyor.",
      cite("hong-1994-greenland-lead", "Ölçüm sonuçları", "direct"), { id: "avrupa-capinda-kursun" }),
    ev("Roma'nın şebeke suyunda kurşun ölçülmüştür; musluk suyu doğal kaynak suyuna göre belirgin biçimde yüksektir.",
      cite("delile-2014-rome-city-waters", "Ölçüm sonuçları", "direct"), { id: "sebeke-suyu-kursun" }),
    ev("Kurşun bir nörotoksindir; yeterli düzeyde özellikle çocuklarda bilişsel etkiye yol açar.",
      cite("delile-2014-rome-city-waters", "Sağlık bağlamı", "context"), { id: "norotoksin" }),
  ],
  [
    ev("Bilişsel etkinin büyüklüğü MODELLENMİŞ bir tahmindir, doğrudan ölçüm değil - ve tartışmalıdır.",
      cite("delile-2014-rome-city-waters", "Sonuçların yorumu", "counter"), { id: "bilissel-etki-model" }),
    ev("Ölçüm sonucu ölçeği DÜZELTİR: Roma musluk suyundaki kurşun doğal suya göre yüksekti ama akut zehirlenme eşiğinin çok altındaydı.",
      cite("delile-2014-rome-city-waters", "Sonuçların yorumu", "counter"), { id: "akut-esigin-altinda" }),
    ev("Roma dönemi kurşun düzeyleri modern sanayi çağının çok altındadır; bulgunun anlamı 'antik dünya bugünden kirliydi' değil.",
      cite("hong-1994-greenland-lead", "Karşılaştırmalı düzeyler", "counter"), { id: "modern-sanayiden-dusuk" }),
    ev("Kan kurşun düzeyi tahminleri atmosferik veriden türetilir; iskelet ölçümleriyle bölgesel doğrulama sınırlıdır.",
      cite("mcconnell-2018-lead-greenland", "Yöntem sınırı", "counter"), { id: "iskelet-dogrulamasi-sinirli" }),
  ],
  "Yer tutucu ('Pan-European atmospheric lead') üç künyeyle değiştirildi. Delile 2014 eklendi ve sonucun ölçeği DÜZELTTİĞİ yazıldı - kayıt yalnızca 'yükselmiş kurşun' diyordu.");

kur("roma-yollari-modern-refah", [S.dalgaard],
  [
    ev("Yüksek Roma yol yoğunluğu, yüksek modern yol yoğunluğu ve 2010-2020'de daha fazla ekonomik etkinlikle örtüşüyor.",
      cite("dalgaard-2022-roman-roads", "Ana sonuçlar", "direct"), { id: "yol-refah-ortusmesi" }),
    ev("500 CE'de daha fazla yerleşim oluşumu ile de örtüşüyor.",
      cite("dalgaard-2022-roman-roads", "Yerleşim verileri", "direct"), { id: "500ce-yerlesim" }),
    ev("Erken ortaçağ ve modern dönemde pazar kasabalarının ortaya çıkışı, etkiyi sürdüren mekanizma olarak belirlendi.",
      cite("dalgaard-2022-roman-roads", "Mekanizma çözümlemesi", "direct"), { id: "pazar-kasabalari" }),
    ev("KONTROL GRUBU: tekerleğin bırakıldığı bölgelerde kalıcılık kayboluyor - etkiyi taşıyan şey Romalıların yer seçimi değil, sonraki kuşakların bakımı.",
      cite("dalgaard-2022-roman-roads", "Doğal deney", "direct"), { id: "tekerlek-dogal-deneyi" }),
  ],
  [
    ev("Tekerleğin bırakılması rastgele bir olay değil; o bölgelerin başka farkları da olabilir.",
      cite("dalgaard-2022-roman-roads", "Tanımlama stratejisi sınırı", "counter"), { id: "tekerlek-rastgele-degil" }),
    ev("Kayıt TEK BİR ÇALIŞMAYA dayanıyor; bulguyu bağımsız olarak yeniden üreten bir yayın burada künyelenmedi.",
      cite("dalgaard-2022-roman-roads", "Kaynak bağımsızlığı", "context"), { id: "tek-calisma" }),
  ],
  "Künye DOI ile tamamlandı. Kaydın tek çalışmaya dayandığı işaretlendi.");

kur("roma-hukuk-kesintili-zincir", [S.stein],
  [
    ev("Corpus Juris Civilis 529-534'te Justinianus döneminde derlendi.",
      cite("stein-1999-roman-law-european-history", "Justinianus derlemesi", "direct"), { id: "corpus-juris-529" }),
    ev("6.-11. yüzyıllarda Batı'da büyük ölçüde kullanım dışı kaldı.",
      cite("stein-1999-roman-law-european-history", "Karanlık dönem", "direct"), { id: "bes-yuzyil-bosluk" }),
    ev("~1070'lerde İtalya'da Digesta nüshası yeniden bulundu ve incelenmeye başlandı; 1088'de Bologna'da hukuk öğretimi kurumsallaştı.",
      cite("stein-1999-roman-law-european-history", "Bologna ve yeniden keşif", "direct"), { id: "bologna-1088" }),
    ev("Fransız (1804) ve Alman (1900) medeni kanunları bu gelenekten kodlandı; Türk Medeni Kanunu (1926) İsviçre Medeni Kanunu esas alınarak kabul edildi.",
      cite("stein-1999-roman-law-european-history", "Modern kodlamalar", "direct"), { id: "modern-kodlamalar" }),
  ],
  [
    ev("Bologna sonrası yüzyıllar metni yalnızca aktarmadı, yeniden yorumladı; bugünkü medeni hukuk Roma hukuku değil, ondan TÜRETİLMİŞ bir yapıdır.",
      cite("stein-1999-roman-law-european-history", "Yorum geleneği", "counter"), { id: "turetilmis-yapi" }),
    ev("Türk Medeni Kanunu'na uzanan halka bu kayıtta AYRI BİR KAYNAKLA desteklenmiyor; İsviçre üzerinden aktarım genel bilgi olarak alınmıştır.",
      cite("stein-1999-roman-law-european-history", "Kayıt düzeyi sınırı", "context"), { id: "turkiye-halkasi-kaynaksiz" }),
  ],
  "Yer tutucu Stein 1999 ile değiştirildi. Türkiye halkasının ayrı kaynağı olmadığı işaretlendi.");

kur("roma-bati-maddi-gerileme", [S.wardPerkins, S.mccormick, S.wickham, S.mcconnell],
  [
    ev("Akdeniz batık gemi sayısı MÖ 1. - MS 1. yüzyıl zirvesinden sonra belirgin düşüyor - ticaret hacminin daralması.",
      cite("mccormick-2001-origins-european-economy", "Deniz ticareti verileri", "direct"), { id: "batik-sayisi-dususu" }),
    ev("Standart çarkta üretilmiş kaliteli sofra çömleği ortadan kalkıyor; yer yer çarksız el yapımına dönülüyor.",
      cite("ward-perkins-2005-fall-of-rome", "Çömlekçilik göstergeleri", "direct"), { id: "comlekcilik-gerilemesi" }),
    ev("Çatı kiremidi bazı bölgelerde tamamen kayboluyor; sığır kemiklerinde boyut küçülmesi görülüyor.",
      cite("ward-perkins-2005-fall-of-rome", "Maddi kültür göstergeleri", "direct"), { id: "kiremit-ve-kemik" }),
    ev("Kurşun kirliliğinin Roma düzeyine dönüşü yüzyıllar sürüyor.",
      cite("mcconnell-2018-lead-greenland", "Toparlanma süresi", "direct"), { id: "kursun-toparlanmasi" }),
  ],
  [
    ev("Düşüş her yerde aynı değil - Britanya'da sert, İtalya ve Akdeniz'de daha ılımlı. Tek bir 'Batı' eğrisi yanıltıcı olur.",
      cite("wickham-2005-framing-early-middle-ages", "Bölgesel çeşitlilik çözümlemesi", "counter"), { id: "bolgesel-farklar" }),
    ev("TARTIŞMANIN İKİ TARAFI VAR ve bu kayıt ikisini de taşıyor: Ward-Perkins maddi göstergelerle çöküşü savunur, Wickham dönüşümü ve bölgesel çeşitliliği vurgular. Kayıt birinciyi 'kanıt', ikinciyi 'karşı kanıt' olarak ayırıyor.",
      cite("wickham-2005-framing-early-middle-ages", "Tartışmanın konumu", "context"), { id: "iki-taraf" }),
    ev("Bu bulgu, sonraki bin yılın 'karanlık' sayılıp sayılamayacağı sorusundan AYRI bir sorudur; ikisi karıştırılmamalıdır.",
      cite("ward-perkins-2005-fall-of-rome", "Kayıt düzeyi ayrımı", "context"), { id: "karanlik-cag-ayri-soru" }),
  ],
  "DENETİM NOTU: DeepSeek turu Ward-Perkins, McCormick ve Wickham'ı birlikte 'kanıt' olarak önerdi. Wickham tam da kaydın karşı kanıt satırının kaynağıdır; ikisini aynı kutuya koymak tartışmayı gizlerdi. Taraflar ayrıldı.");

kur("roma-476-uzlasimdir", [S.ostrogorsky, S.jones],
  [
    ev("476'da Batı'daki son imparator tahttan indirildi; bu gerçek bir olaydır.",
      cite("jones-1964-later-roman-empire", "476 olayı", "direct"), { id: "476-olayi" }),
  ],
  [
    ev("Doğu Roma bin yıl daha sürdü; kendilerine Romalı diyorlardı ve hukukları Roma hukukuydu.",
      cite("ostrogorsky-1969-byzantine-state", "İmparatorluğun sürekliliği", "counter"), { id: "dogu-roma-1453" }),
    ev("Batı'da imparatorluk zaten uzun süredir parçalanıyordu; 476 tek bir kırılma noktası değil.",
      cite("jones-1964-later-roman-empire", "Batı'nın çözülmesi", "counter"), { id: "476-tek-kirilma-degil" }),
    ev("Hangi bölgeyi merkeze aldığınıza göre 'son' başka bir tarihe düşer.",
      cite("ostrogorsky-1969-byzantine-state", "Dönemlendirme sorunu", "counter"), { id: "merkeze-gore-degisir" }),
  ],
  "Yer tutucu Ostrogorsky ve Jones ile değiştirildi. Kayıtta hiç evidence yoktu - 476 olayının kendisi doğrudan kanıt olarak bağlandı.");

kur("hristiyanlik-313-380-ayrimi", [S.lactantius, S.codexTheo, S.pharr, S.jones],
  [
    ev("313 metninin içeriği Lactantius'un De mortibus persecutorum 48. bölümünde aktarılır ve 'Hristiyanlara ve herkese' dinini seçme serbestliği tanır.",
      cite("lactantius-de-mortibus", "48. bölüm", "direct"), { id: "313-metni-lactantius" }),
    ev("Codex Theodosianus XVI.1.2 (Cunctos populos, 380) İznik inancını imparatorluğun resmî dini ilan eder.",
      cite("codex-theodosianus-16-1-2", "XVI.1.2", "direct"), { id: "380-cunctos-populos" }),
    ev("Metnin standart çevirisi bu okumayı verir.",
      cite("pharr-1952-theodosian-code", "XVI.1.2 çevirisi", "direct"), { id: "pharr-cevirisi" }),
    ev("391-392 tarihli yasalar pagan kurbanını ve tapınak ziyaretini yasaklar - hoşgörüden zorunluluğa geçişin son adımı.",
      cite("jones-1964-later-roman-empire", "391-392 yasaları", "direct"), { id: "391-392-yasaklar" }),
    ev("Constantinus 337'de ölüm döşeğinde vaftiz edildi; vaftizi yapan Nikomedialı Eusebios, İznik'te mahkûm edilen Arius'un görüşüne yakın bir piskopostu.",
      cite("jones-1964-later-roman-empire", "Constantinus'un son yılları", "direct"), { id: "olum-dosegi-vaftizi" }),
  ],
  [
    ev("313'ten sonra kiliseye tanınan vergi muafiyetleri ve bağışlar hukuken 'devlet dini' olmasa da fiilî bir imtiyaz yaratmıştır; ayrımın keskinliği idari uygulamada bulanıklaşır.",
      cite("jones-1964-later-roman-empire", "Kilise imtiyazları", "counter"), { id: "fiili-imtiyaz" }),
    ev("'Milano fermanı' adlandırması tartışmalıdır: metin bir edictum değil, valilere gönderilen bir talimat mektubudur ve Galerius'un 311 hoşgörü fermanının devamı sayılabilir.",
      cite("lactantius-de-mortibus", "Metnin biçimi", "counter"), { id: "milano-fermani-adlandirmasi" }),
  ],
  "Yer tutucular Pharr 1952 ve Jones 1964 ile karşılandı; birincil metinler ayrı künyelendi.");

kur("iznik-kanonu-belirlemedi", [S.iznikKanonlari, S.metzger, S.kelly, S.ehrmanLost],
  [
    ev("Konsilden çıkan yirmi kanon metni elimizdedir ve tamamı kilise yönetimine ilişkindir - kutsal metin listesi içermez.",
      cite("iznik-konsili-kanonlari", "Yirmi kanon", "direct"), { id: "yirmi-kanon-idari" }),
    ev("Konsilde bulunan Eusebios, İznik'i ayrıntılı anlatır ve kanon kararından bahsetmez.",
      cite("kelly-1972-early-christian-creeds", "Konsil kaynakları", "direct"), { id: "eusebios-bahsetmiyor" }),
    ev("Tartışmanın konusu İsa'nın ilahiliği DEĞİL, ilahiliğinin Baba ile ilişkisiydi: taraflardan hiçbiri İsa'nın ilahi olmadığını savunmuyordu.",
      cite("kelly-1972-early-christian-creeds", "Arius tartışması", "direct"), { id: "tartisma-konusu" }),
    ev("Konsilden 42 yıl SONRA yazan Athanasios'un 367 tarihli mektubu, elimizdeki ilk 27 kitaplık listedir - İznik'te bir liste kabul edilmiş olsaydı bu gereksiz olurdu.",
      cite("metzger-1987-canon-new-testament", "Athanasios'un mektubu", "direct"), { id: "367-sonra-gelmesi" }),
  ],
  [
    ev("Sessizlikten çıkarım genelde zayıf bir kanıt biçimidir; burada gücü, sessiz kalan kişilerin tam da o toplantıda bulunup ayrıntılı yazmış olmasından gelir.",
      cite("metzger-1987-canon-new-testament", "Yöntem notu", "context"), { id: "sessizlikten-cikarim" }),
    ev("'Dışarıda kalanlar yakıldı' anlatısının arkeolojik ya da metinsel kanıtı yoktur; kanon dışı metinlerin bir kısmı elimizdedir.",
      cite("ehrman-2003-lost-christianities", "Kayıp metinlerin akıbeti", "counter"), { id: "yakma-kaniti-yok" }),
  ],
  "Yer tutucu Metzger, Kelly ve Ehrman ile karşılandı. 'Yakıldı' anlatısının çürütülmesi ayrı bir kaynağa bağlandı.");

kur("kanon-367-athanasios-listesi", [S.athanasios, S.metzger, S.ehrmanLost],
  [
    ev("367 tarihli 39. Paskalya mektubu, bugünkü 27 kitabı tam olarak listeleyen bilinen ilk belgedir.",
      cite("athanasios-39-paskalya-mektubu", "Kitap listesi", "direct"), { id: "367-ilk-tam-liste" }),
    ev("Mektubun dili onaylayıcıdır, kurucu değil: geniş kabul gören kitapları teyit eder.",
      cite("metzger-1987-canon-new-testament", "Mektubun değerlendirmesi", "direct"), { id: "onaylayici-dil" }),
    ev("4. yüzyıl sonundaki Kuzey Afrika bölgesel konsilleri aynı listeyi teyit etti - yani liste konsilden önce vardı.",
      cite("metzger-1987-canon-new-testament", "Bölgesel konsiller", "direct"), { id: "konsiller-teyit-etti" }),
    ev("Kanon dışı metinlerin bir kısmı elimizdedir (Nag Hammadi buluntuları, 1945); sistematik bir imha kampanyasının kanıtı yoktur.",
      cite("ehrman-2003-lost-christianities", "Nag Hammadi ve kayıp metinler", "direct"), { id: "nag-hammadi" }),
  ],
  [
    ev("Bazı kitapların (İbraniler, Vahiy, Yakup) kabulü bölgeden bölgeye uzun süre farklılık gösterdi; 367 bir 'kapanış' değil, bir uzlaşının ilk yazılı kaydıdır.",
      cite("metzger-1987-canon-new-testament", "Tartışmalı kitaplar", "counter"), { id: "tartismali-kitaplar" }),
    ev("Süryani ve Etiyopya kiliseleri farklı kanonlar kullanmaya devam etti; tek bir evrensel liste hiçbir zaman olmadı.",
      cite("metzger-1987-canon-new-testament", "Doğu kanonları", "counter"), { id: "evrensel-liste-yok" }),
  ],
  "Metzger ve Ehrman künyeleri bağlandı; 'çoğaltılmayarak kayboldu' savı Nag Hammadi kanıtına dayandırıldı.");

kur("hristiyan-buyume-orani-modeli", [S.stark, S.hopkins, S.macmullen],
  [
    ev("Bileşik büyüme aritmetiği: %40/on yıl, 260 yılda 1.000'i yaklaşık 6 milyona çıkarır.",
      cite("stark-1996-rise-of-christianity", "Büyüme modeli", "claim-origin"), { id: "buyume-aritmetigi" }),
    ev("Kullanılan oran, modern dinî hareketlerde belgelenmiş büyüme hızlarıyla aynı mertebededir - uydurulmuş bir sayı değildir.",
      cite("stark-1996-rise-of-christianity", "Karşılaştırmalı oranlar", "direct"), { id: "oran-olagandisi-degil" }),
    ev("Salgın dönemlerinde Hristiyan cemaatlerinin şehirde kalıp hastalara bakması, temel bakım yoluyla hayatta kalma oranını yükseltmiş olabilir.",
      cite("stark-1996-rise-of-christianity", "Salgın bölümü", "inference"), { id: "salgin-bakimi" }),
    ev("Yayılmanın toplumsal mekanizmaları ayrıca incelenmiştir.",
      cite("macmullen-1984-christianizing", "Dönüşüm mekanizmaları", "context"), { id: "toplumsal-mekanizmalar" }),
  ],
  [
    ev("Bu bir İMKÂN KANITIDIR, ölçüm değil: başlangıç sayısı, büyüme oranı ve 300 yılındaki toplam - üçü de tahmindir.",
      cite("hopkins-1998-christian-number", "Sayı tahminlerinin değerlendirmesi", "counter"), { id: "imkan-kaniti" }),
    ev("Tarihçiler arasında 300 yılı için verilen toplam nüfus tahminleri geniş bir aralıkta değişir; 6 milyon üst uçlardan biridir.",
      cite("hopkins-1998-christian-number", "Tahmin aralığı", "counter"), { id: "tahmin-araligi" }),
    ev("Sabit oran varsayımı gerçekçi değildir; büyüme bölgeden bölgeye ve dönemden döneme değişmiş olmalıdır.",
      cite("hopkins-1998-christian-number", "Model varsayımları", "counter"), { id: "sabit-oran-varsayimi" }),
    ev("Salgın bakımı ve kadın demografisi açıklamaları aritmetikten çok daha zayıf desteklidir ve kaynakların önemli kısmı Hristiyan yazarların kendi anlatılarından gelir - taraf olan kaynak.",
      cite("macmullen-1984-christianizing", "Kaynak eleştirisi", "counter"), { id: "taraf-kaynaklar" }),
  ],
  "DENETİM NOTU: kayıt 'tahminler geniş aralıkta değişir' diyordu ama hiçbir tahmini künyelemiyordu. Hopkins 1998 (DOI doğrulandı) Stark'ın aritmetiğine cevap veren çalışmadır; karşı kanıt tarafına bağlandı.");

kur("hristiyan-zulmu-olcegi", [S.steCroix, S.moss, S.jones],
  [
    ev("3. yüzyılda birçok şehirde açıkça bilinen kilise binaları ve mülkleri vardı; 313'te bunların İADESİ emredilmesi, önceden var olduklarını gösterir.",
      cite("ste-croix-1963-why-persecuted", "Zulüm dönemlerinin yapısı", "direct"), { id: "kilise-mulkleri-vardi" }),
    ev("Zulüm yasalarının uygulaması eyaletten eyalete büyük farklılık gösterir; merkezî emir olmadan yerel yargıç takdiri belirleyicidir.",
      cite("ste-croix-1963-why-persecuted", "Hukuki uygulama", "direct"), { id: "yerel-yargic-takdiri" }),
    ev("Şehitlik anlatılarının önemli bir kısmı olaylardan çok sonra yazılmış edebî derlemelerdir ve tarihsel değerleri tartışmalıdır.",
      cite("moss-2013-myth-of-persecution", "Şehitlik metinlerinin oluşumu", "direct"), { id: "sehitlik-anlatilari-gec" }),
  ],
  [
    ev("Ölçek düzeltmesi, zulmün gerçekliğini veya şiddetini ortadan kaldırmaz; belgelenmiş idamlar ve mülk müsaderesi vardır.",
      cite("ste-croix-1963-why-persecuted", "Belgelenmiş vakalar", "counter"), { id: "zulum-gercekti" }),
    ev("'Şehitlik anlatıları abartılıdır' tezi alanda TARTIŞMALIDIR; bazı tarihçiler erken şehitlik metinlerinin çekirdek tarihselliğini savunur.",
      cite("moss-2013-myth-of-persecution", "Tezin konumu", "counter"), { id: "moss-tezi-tartismali" }),
    ev("Kaynak sorunu iki yönlüdür: hem şehitlik anlatıları hem de onları eleştiren yeniden değerlendirmeler ideolojik okumaya açıktır.",
      cite("moss-2013-myth-of-persecution", "Yöntem notu", "context"), { id: "iki-yonlu-kaynak-sorunu" }),
  ],
  "de Ste. Croix DOI ile, Moss ISBN ile bağlandı. Moss tezinin alanda tartışmalı olduğu ayrıca işaretlendi.");

kur("kilise-roma-idari-mirasi", [S.jones, S.krautheimer, S.brown],
  [
    ev("Piskoposluk bölgeleri (diocesis) imparatorluğun idari bölünmesini hem adıyla hem sınırlarıyla devraldı.",
      cite("jones-1964-later-roman-empire", "İdari yapı ve kilise", "direct"), { id: "diocesis-devralindi" }),
    ev("Kiliseler pagan TAPINAK planında değil, Roma BAZİLİKASI planında yapıldı; sebep, cemaatin içeride toplanması gereğidir. Pagan tapınağında ayin dışarıda yapılırdı.",
      cite("krautheimer-1986-early-christian-architecture", "Bazilika planının benimsenmesi", "direct"), { id: "bazilika-plani" }),
    ev("Batı kilisesi imparatorluğun idari dili Latince'yi benimsedi ve bin yıldan uzun süre korudu.",
      cite("jones-1964-later-roman-empire", "İdari dil", "direct"), { id: "latince-korundu" }),
    ev("Kilise uyuşmazlıkları Roma hukuk mantığıyla çözmeye başladı: yazılı kural, içtihat, yetki hiyerarşisi.",
      cite("jones-1964-later-roman-empire", "Kilise idaresi", "direct"), { id: "hukuk-mantigi" }),
    ev("Kilisenin Batı'da kurumsallaşması ve servetle ilişkisi ayrıca incelenmiştir.",
      cite("brown-2012-eye-of-a-needle", "Kurumsallaşma", "context"), { id: "kurumsallasma" }),
  ],
  [
    ev("Etkileşim çift yönlüdür: kilise Roma biçimlerini alırken içeriklerini de değiştirdi; bazilika planı ayin ihtiyacına göre dönüştürüldü (apsis, transept).",
      cite("krautheimer-1986-early-christian-architecture", "Planın dönüşümü", "counter"), { id: "cift-yonlu-etkilesim" }),
    ev("Piskoposluk sınırlarının idari sınırlarla örtüşmesi her yerde tam değildir; özellikle Doğu'da ve sınır bölgelerinde sapmalar vardır.",
      cite("jones-1964-later-roman-empire", "Sınır sapmaları", "counter"), { id: "sinir-sapmalari" }),
    ev("'Pontifex maximus unvanının papalığa geçişi' satırı bu kayıtta AYRI BİR KAYNAKLA desteklenmiyor; unvanın tarihçesi tartışmalıdır.",
      cite("jones-1964-later-roman-empire", "Kayıt düzeyi sınırı", "context"), { id: "pontifex-kaynaksiz" }),
  ],
  "Jones, Krautheimer ve Brown künyelendi. Pontifex maximus satırının kaynaksız olduğu işaretlendi - kayıt onu doğrudan kanıt gibi sunuyordu.");

kur("testimonium-flavianum-mudahale", [S.josephus, S.meier, S.whealey],
  [
    ev("Bir Yahudi tarihçinin kaleminden 'O, Mesih'ti' cümlesi çıkmaz; bu ifadenin eklendiği neredeyse evrensel kabul görür.",
      cite("meier-1991-marginal-jew-1", "Testimonium çözümlemesi", "direct"), { id: "mesih-cumlesi-eklendi" }),
    ev("Pasajın kendisi Antiquitates 18.63'tedir.",
      cite("josephus-antiquitates-18-63", "18.63", "claim-origin"), { id: "pasaj-metni" }),
    ev("9.-10. yüzyıla ait Arapça ve Süryanice aktarımlar pasajı büyük ölçüde aynı biçimde veriyor AMA en şüpheli iki ifadeyi içermiyor. Müdahale öncesi hâle dair bağımsız bir iz.",
      cite("whealey-2003-josephus-on-jesus", "Arapça ve Süryanice aktarımlar", "direct"), { id: "arapca-suryanice-aktarim" }),
    ev("Aynı eserin 20.200'ündeki Yakup pasajı kısa ve övgüsüz; bir Hristiyan kopyacının orada da müdahale etmiş olması beklenirdi, etmemiş.",
      cite("meier-1991-marginal-jew-1", "Yakup pasajı karşılaştırması", "direct"), { id: "yakup-pasaji-karsilastirmasi" }),
  ],
  [
    ev("%25'lik azınlık (13/52) pasajın TAMAMININ eklendiğini savunuyor ve bu görüş yaşayan bir görüştür - küçümsenerek geçilemez.",
      cite("whealey-2003-josephus-on-jesus", "Görüş dağılımı", "counter"), { id: "azinlik-gorusu-yasiyor" }),
    ev("Elimizdeki tüm Grekçe elyazmaları Hristiyan kopyalama geleneğinden gelir; müdahale öncesi bir Grekçe tanık yoktur.",
      cite("josephus-antiquitates-18-63", "Elyazması geleneği", "counter"), { id: "grekce-tanik-yok" }),
    ev("Arapça/Süryanice aktarımların bağımsızlığı da tartışmalıdır; ortak bir ara kaynaktan gelmiş olabilirler.",
      cite("whealey-2003-josephus-on-jesus", "Aktarım bağımsızlığı", "counter"), { id: "aktarim-bagimsizligi" }),
    ev("Sayısal dağılım bir ANKET değil, yayımlanmış görüşlerin derlemesidir; alanın tamamının sayımı sayılamaz. Derlemenin kendisi bu kayıtta ayrıca künyelenmedi.",
      cite("whealey-2003-josephus-on-jesus", "Kayıt düzeyi sınırı", "context"), { id: "dagilim-anket-degil" }),
  ],
  "Yer tutucu Meier ve Whealey ile değiştirildi. 52 akademisyenlik dağılımın kaynağının künyelenmediği açıkça işaretlendi.");

kur("roma-hristiyanligi-uydurdu-tezi", [S.codexTheo, S.steCroix, S.jones, S.ehrmanDid],
  [
    ev("Roma'nın dini siyaseten kullandığı doğrudur; tezin çıkış noktası bu bakımdan boş değildir.",
      cite("jones-1964-later-roman-empire", "Din ve devlet", "context"), { id: "cikis-noktasi-bos-degil" }),
    ev("Devlet dini ilanı 380'dedir; hareket o tarihte zaten ~300 yıllıktır.",
      cite("codex-theodosianus-16-1-2", "XVI.1.2", "direct"), { id: "kronoloji-380" }),
    ev("Roma bu dönemde Hristiyanlara dönem dönem zulmetti; bir devletin kendi imal ettiği inancın mensuplarını yüzyıllarca kovuşturması açıklanamaz.",
      cite("ste-croix-1963-why-persecuted", "Zulüm dönemleri", "direct"), { id: "zulum-celiskisi" }),
    ev("Merkezdeki figür bir Roma valisince çarmıha gerilmiş bir taşralıdır; çarmıh asilere ve kölelere ayrılmış, kasıtlı olarak aşağılayıcı bir infaz biçimiydi.",
      cite("ehrman-2012-did-jesus-exist", "Çarmıh ve utanç ölçütü", "direct"), { id: "carmih-utanc" }),
  ],
  [
    ev("En erken metinler iktidar dışı bir çevreden gelir; saray hamiliği kaydı yoktur. Karşılaştırma: Philostratos'un Apollonius'u doğrudan imparatoriçe Julia Domna'nın isteğiyle yazılmıştır.",
      cite("ehrman-2012-did-jesus-exist", "Erken metinlerin çevresi", "counter"), { id: "saray-hamiligi-yok" }),
    ev("Roma'nın Hristiyanlığı SONRADAN biçimlendirdiği doğrudur (piskoposluk bölgeleri, bazilika planı, Latince, hukuk mantığı) - ama sonradan biçimlendirmek ile baştan icat etmek aynı şey değildir. Tez tam bu ikisini karıştırıyor.",
      cite("jones-1964-later-roman-empire", "Kayıt düzeyi ayrımı", "context"), { id: "bicimlendirmek-icat-etmek-degil" }),
  ],
  "Yer tutucu Ehrman 2012 ile karşılandı; 'tez akademik literatürde kabul görmüyor' ifadesi künyeli kaynağa bağlandı.");

kur("apollonius-kaynak-durumu", [S.philostratos, S.dzielska],
  [
    ev("Ana kaynak Philostratos'un sekiz kitaplık Apollonius'un Yaşamı; y. 220'lerde, imparatoriçe Julia Domna'nın isteğiyle yazıldı.",
      cite("philostratus-2005-life-of-apollonius", "Giriş ve eserin bağlamı", "direct"), { id: "ana-kaynak-philostratos" }),
    ev("Philostratos kaynağı olarak Ninovalı Damis'in anılarını gösteriyor; 'bulunmuş elyazması' antik bir anlatı hilesidir ve Damis çoğunluk görüşünde kurgu sayılır.",
      cite("dzielska-1986-apollonius", "Damis sorunu", "direct"), { id: "damis-kurgu" }),
    ev("Bağımsız izler zayıf ve dolaylı: Cassius Dio'da kısa bir anma, Tyana'da sikke ve tapınak izleri.",
      cite("dzielska-1986-apollonius", "Bağımsız tanıklar", "direct"), { id: "bagimsiz-izler-zayif" }),
  ],
  [
    ev("Apollonius'un yaşamış olması muhtemeldir; kaynak sorunu varlığını değil, AYRINTILARI ulaşılamaz kılıyor.",
      cite("dzielska-1986-apollonius", "Tarihsel çekirdek", "counter"), { id: "varligi-degil-ayrintilar" }),
    ev("Geleneksel yaşam tarihleri (y. MÖ 3 - y. MS 97) güvenilir değildir.",
      cite("dzielska-1986-apollonius", "Kronoloji sorunu", "counter"), { id: "yasam-tarihleri-guvenilmez" }),
    ev("Philostratos'un kasıtlı olarak Hristiyanlığa rakip bir figür kurguladığı tezi alanda azınlıkta kalır; anti-Hristiyan kullanım sonradan gelmiştir.",
      cite("dzielska-1986-apollonius", "Rakip figür tezi", "counter"), { id: "rakip-figur-tezi-azinlik" }),
  ],
  "Yer tutucu Loeb edisyonu ve Dzielska 1986 ile değiştirildi.");

kur("hierocles-apollonius-polemigi", [S.eusebiosContra, S.lactantius, S.dzielska],
  [
    ev("Hierocles, Philalethes (Hakikat Dostu) adlı metinde Apollonius'un da benzer şeyler yaptığını, paganların onu tanrılaştırmadığını savundu.",
      cite("eusebios-contra-hieroclem", "Aktarılan argüman", "claim-origin"), { id: "hierocles-argumani" }),
    ev("Eusebios, Hierocles'e Karşı adlı bir reddiye yazdı ve bu reddiye korundu.",
      cite("eusebios-contra-hieroclem", "Metnin kendisi", "direct"), { id: "eusebios-reddiyesi" }),
    ev("Hierocles zulmün yöneticilerinden biriydi; argüman doğduğu anda siyasi bir araçtı.",
      cite("lactantius-de-mortibus", "16. bölüm", "direct"), { id: "hierocles-zulum-yoneticisi" }),
    ev("Polemiğin tarihsel bağlamı ayrıca incelenmiştir.",
      cite("dzielska-1986-apollonius", "Hierocles bölümü", "context"), { id: "polemik-baglami" }),
  ],
  [
    ev("Eusebios taraf bir aktarıcıdır; Hierocles'in argümanını eksik veya çarpıtarak vermiş olabilir - ve bunu kontrol edecek bağımsız bir metin yok.",
      cite("eusebios-contra-hieroclem", "Aktarımın tek yönlülüğü", "counter"), { id: "eusebios-taraf-aktarici" }),
    ev("Lactantius da taraf bir kaynaktır; Hierocles'i zulmün mimarlarından biri olarak sunması onun kendi polemik çerçevesi içindedir.",
      cite("lactantius-de-mortibus", "Kaynak konumu", "context"), { id: "lactantius-da-taraf" }),
  ],
  "DeepSeek turunda aday gelmemişti; kayıt zaten iki birincil kaynağa dayanıyordu. Dzielska 1986 bağlam olarak eklendi ve Lactantius'un da taraf olduğu işaretlendi.");

/* --- uygula -------------------------------------------------------- */

for (const r of yeni) {
  const i = list.findIndex((x) => x.id === r.id);
  const onceki = list[i].schema_version ?? 1;
  list[i] = r;
  console.log(`  v${onceki} -> v2  ${r.id}`);
}
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
const v2 = list.filter((r) => r.schema_version === 2).length;
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${v2}${v2 === list.length ? "  DOSYA TAMAM" : ""}`);
