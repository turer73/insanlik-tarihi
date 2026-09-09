#!/usr/bin/env node
// Babil dosyası: 10 kaydın tamamı v2'ye.
//
// KAYNAKLARIN GELDİĞİ YER: bu dosyadaki künyelerin çoğu DeepSeek öneri
// turundan geldi (data/kaynak-onerileri.json) ve hepsi makineyle
// doğrulandı - DOI crossref'te, ISBN Open Library/Google Books'ta, başlık
// örtüşmesi ölçülerek. Ama DOĞRULANMIŞ OLMAK, KAYDIN O SATIRINI TAŞIDIĞI
// ANLAMINA GELMİYOR. İlgi denetimi ayrı yapıldı ve iki aday ELENDİ:
//
//   1. Rollinger, "Herodotus: An Ancient Historian or a Traveler?" -
//      yalnızca alan adı düzeyinde bir URL vardı (histos.org), makalenin
//      kendisine değil. Başlık da doğrulanamadı. Alınmadı.
//   2. George 1992, Babylonian Topographical Texts - modern tahribat
//      kaydına önerilmişti. Kitap gerçek ve bu dosyada üç kayıtta
//      KULLANILIYOR, ama antik topografya metinleri 1980'lerin yeniden
//      inşası ve 2003 askerî üssü hakkında hiçbir şey söylemez. Doğrulanmış
//      ama İLGİSİZ. Yerine UNESCO 2009 hasar raporunun künyesi ayrıca
//      arandı ve doğrulandı.
//
// Bu iki eleme, doğrulama katmanının neden yeterli olmadığını gösteriyor:
// makine künyenin VAR olduğunu söyler, iddiayı taşıyıp taşımadığını değil.
//
// DÖRT KAYITTA popular_claim VE divergence BOŞTU - yani bu projenin temel
// ayrımı o kayıtlarda hiç kurulmamıştı: kuleyi-iskender, 60lik-sistem,
// istar-kapisi, modern-tahribat. Dördü de yazıldı.
//
// SINIR: hiçbir kaynağın tam metni okunmadı; locator'lar bölüm düzeyinde.
// Koldewey'in yayın künyesi (Das wieder erstehende Babylon, 1913) bu turda
// bağımsız olarak doğrulanmadı, kaynak notunda yazılı.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/babil.json";
const CHECKED = "2026-09-09";

/* --- kaynaklar ----------------------------------------------------- */

const cda = source("black-george-postgate-2000-cda", {
  tier: "peer-reviewed", type: "book",
  authors: ["Black, Jeremy", "George, Andrew", "Postgate, Nicholas"],
  year: 2000, title: "A Concise Dictionary of Akkadian",
  publisher: "Harrassowitz Verlag", isbn: "9783447042642", language: "en",
  note: "Akadca standart sözlük. 'Bāb-ilim' okumasının dayanağı burasıdır; önceki sürümde bu kaynağın yerinde yazarsız bir 'Akadca sözlük ve Asurbilim literatürü' yer tutucusu vardı.",
});

const sarna = source("sarna-1966-understanding-genesis", {
  tier: "peer-reviewed", type: "book",
  authors: ["Sarna, Nahum M."], year: 1966, title: "Understanding Genesis",
  publisher: "Jewish Theological Seminary of America", isbn: "9780805202533", language: "en",
  note: "Tekvin 11:9'daki kelime oyununun ve adın polemik kullanımının çözümlemesi.",
});

const bottero = source("bottero-1992-mesopotamia", {
  tier: "peer-reviewed", type: "book",
  authors: ["Bottéro, Jean"], year: 1992,
  title: "Mesopotamia: Writing, Reasoning, and the Gods",
  publisher: "University of Chicago Press", isbn: "9780226067278", language: "en",
  note: "Adın Mezopotamya kültüründeki yeri için bağlam kaynağı.",
});

const tekvin = source("tekvin-11-1-9", {
  tier: "primary", type: "manuscript", title: "Tekvin 11:1-9", language: "he",
  note: "İddianın kaynağı olan metin. Bu kayıtta doğrulayıcı değil, KÖKEN olarak kullanılıyor.",
});

const georgeBTT = source("george-1992-babylonian-topographical-texts", {
  tier: "peer-reviewed", type: "book",
  authors: ["George, Andrew R."], year: 1992,
  title: "Babylonian Topographical Texts",
  container: "Orientalia Lovaniensia Analecta", publisher: "Peeters",
  isbn: "9789068314106", language: "en",
  note: "Esagila Tableti dahil Babil topografya metinlerinin standart edisyonu ve çözümlemesi.",
});

const esagila = source("esagila-tableti", {
  tier: "primary", type: "inscription", title: "Esagila Tableti", language: "akk",
  note: "Etemenanki'nin ölçülerini veren metin. Helenistik dönem kopyası; yapı zaten harabeyken yazılmış.",
});

const koldewey = source("koldewey-1913-babil", {
  tier: "primary", type: "report",
  authors: ["Koldewey, Robert"], year: 1913,
  title: "Das wieder erstehende Babylon", language: "de",
  note: "Kazı yayını; 1913 arazi ölçümünün kaynağı. KÜNYE BU TURDA BAĞIMSIZ DOĞRULANMADI - yayıncı ve baskı bilgisi eksik bırakıldı, uydurulmadı.",
});

const vanstiphout = source("vanstiphout-2003-epics-sumerian-kings", {
  tier: "peer-reviewed", type: "book",
  authors: ["Vanstiphout, Herman L. J."], year: 2003,
  title: "Epics of Sumerian Kings: The Matter of Aratta",
  publisher: "Society of Biblical Literature", isbn: "9781589830837", language: "en",
  note: "Enmerkar döngüsünün edisyonu ve çevirisi; Nudimmud pasajının bağlamı ve kipi için ana dayanak.",
});

const blackSumer = source("black-2004-literature-ancient-sumer", {
  tier: "peer-reviewed", type: "book",
  authors: ["Black, Jeremy", "Cunningham, Graham", "Robson, Eleanor", "Zólyomi, Gábor"],
  year: 2004, title: "The Literature of Ancient Sumer",
  publisher: "Oxford University Press", isbn: "9780199263110", language: "en",
  note: "ETCSL çevirilerinin basılı karşılığı; pasajın standart okumasını verir.",
});

const kramerSumerians = source("kramer-1963-the-sumerians", {
  tier: "peer-reviewed", type: "book",
  authors: ["Kramer, Samuel Noah"], year: 1963,
  title: "The Sumerians: Their History, Culture, and Character",
  publisher: "University of Chicago Press", isbn: "9780226452388", language: "en",
  note: "Popüler anlatının KÖKENİ. Kramer'in pasajı bir 'bozma' eylemi olarak okuması buradan yayıldı; bu kayıtta doğrulayıcı değil, iddianın kaynağı olarak kullanılıyor.",
});

const etcsl = source("etcsl-1-8-2-3-enmerkar", {
  tier: "primary", type: "database",
  title: "ETCSL 1.8.2.3, Enmerkar and the Lord of Aratta",
  institution: "Electronic Text Corpus of Sumerian Literature, University of Oxford",
  url: "https://etcsl.orinst.ox.ac.uk/cgi-bin/etcsl.cgi?text=c.1.8.2.3",
  language: "sux", accessed: CHECKED,
});

const dalley2013 = source("dalley-2013-hanging-garden", {
  tier: "peer-reviewed", type: "book",
  authors: ["Dalley, Stephanie"], year: 2013,
  title: "The Mystery of the Hanging Garden of Babylon: An Elusive World Wonder Traced",
  publisher: "Oxford University Press", isbn: "9780199662265", language: "en",
  note: "Ninova tezinin kitap boyu savunusu. Bu kayıtta TEZİN KAYNAĞI olarak kullanılıyor - tarafsız bir hakem değil, taraflardan biri.",
});

const dalley1994 = source("dalley-1994-nineveh-babylon-iraq", {
  tier: "peer-reviewed", type: "article",
  authors: ["Dalley, Stephanie"], year: 1994,
  title: "Nineveh, Babylon and the Hanging Gardens: Cuneiform and Classical Sources Reconciled",
  container: "Iraq", volume: "56",
  publisher: "British Institute for the Study of Iraq",
  doi: "10.2307/4200384", language: "en", accessed: CHECKED,
  note: "Tezin makale biçimindeki ilk sunumu; Herodot'un ölçülerinin abartılı olduğu değerlendirmesini de içerir.",
});

const finkelSeymour = source("finkel-seymour-2008-babylon", {
  tier: "institutional", type: "book",
  authors: ["Finkel, Irving L.", "Seymour, Michael J."], year: 2008,
  title: "Babylon: City of Wonders",
  publisher: "British Museum Press", institution: "British Museum",
  isbn: "9780714111711", language: "en",
  note: "Sergi kitabı; Babil arkeolojisinin kurumsal özeti. Dalley tezine mesafeli duran tarafı temsil ediyor.",
});

const robson = source("robson-2008-mathematics-ancient-iraq", {
  tier: "peer-reviewed", type: "book",
  authors: ["Robson, Eleanor"], year: 2008,
  title: "Mathematics in Ancient Iraq: A Social History",
  publisher: "Princeton University Press", isbn: "9780691091822", language: "en",
  note: "Mezopotamya matematiğinin toplumsal tarihi; altmışlık sistemin kökeni ve kullanımı.",
});

const neugebauer = source("neugebauer-1969-exact-sciences", {
  tier: "peer-reviewed", type: "book",
  authors: ["Neugebauer, Otto"], year: 1969,
  title: "The Exact Sciences in Antiquity",
  publisher: "Dover Publications", isbn: "9780486223322", language: "en",
  note: "Altmışlık sistemin Yunan astronomisi üzerinden aktarımının klasik anlatımı.",
});

const ossendrijver = source("ossendrijver-2016-jupiter-yamuk", {
  tier: "peer-reviewed", type: "article",
  authors: ["Ossendrijver, Mathieu"], year: 2016,
  title: "Ancient Babylonian astronomers calculated Jupiter's position from the area under a time-velocity graph",
  container: "Science", volume: "351(6272)", pages: "482-484",
  doi: "10.1126/science.aad8085", language: "en", accessed: CHECKED,
  note: "Yamuk yönteminin çivi yazılı tabletlerde gösterildiği makale. DOI crossref'te doğrulandı.",
});

const herodot = source("herodotos-tarihler-1", {
  tier: "primary", type: "book",
  authors: ["Herodotos"], title: "Tarihler, I. kitap", language: "grc",
  note: "y. MÖ 440. Bu kayıtta iddianın kaynağı; güvenilirliği kaydın konusu.",
});

const unescoBabil = source("unesco-2019-babil-dunya-mirasi", {
  tier: "institutional", type: "webpage",
  authors: ["UNESCO World Heritage Centre"], year: 2019,
  title: "Babylon", institution: "UNESCO World Heritage Centre",
  url: "https://whc.unesco.org/en/list/1541/", language: "en", accessed: CHECKED,
  note: "Resmî tescil kaydı; Babil'in listeye 2019'da girdiğini doğrular.",
});

const unescoHasar = source("van-ess-curtis-2009-babil-hasar-raporu", {
  tier: "institutional", type: "report",
  authors: ["van Ess, Margareta", "Curtis, John"], year: 2009,
  title: "Final Report on Damage Assessment in Babylon",
  container: "International Coordination Committee for the Safeguarding of the Cultural Heritage of Iraq",
  institution: "UNESCO", publisher: "UNESCO, Paris", language: "en",
  note:
    "Askerî üssün yol açtığı hasarın kurumsal değerlendirmesi. Katkıda bulunanlar arasında Irak SBAH, John Curtis (British Museum), " +
    "Elizabeth Stone'un uydu görüntüsü çözümlemesi ve Roberto Parapetti'nin raporu var - yani tek elden çıkmış bir belge değil.",
});

const pergamon = source("pergamon-muzesi-istar-kapisi", {
  tier: "institutional", type: "webpage",
  title: "İştar Kapısı, Vorderasiatisches Museum",
  institution: "Pergamonmuseum, Staatliche Museen zu Berlin",
  publisher: "Staatliche Museen zu Berlin", language: "de",
  note: "Nesneyi elinde tutan kurum - mülkiyet tartışmasında TARAF kaynak.",
});

/* --- kayıtlar ------------------------------------------------------- */

const konum = {
  site: "Babil", site_native: "Bāb-ilim", region: "Mezopotamya, Fırat kıyısı",
  modern_country: "Irak", coordinates: { lat: 32.5422, lon: 44.4211 },
};

const etimoloji = finding({
  id: "babil-ad-etimolojisi",
  claim: "Akadca Bab-ilim 'Tanrı'nın Kapısı' demektir; Tekvin'in bunu İbranice balal ('karıştırmak') fiiline bağlaması dilbilimsel değil, polemik bir kelime oyunudur.",
  status: "established", confidence: "high",
  topic: ["babil", "dilbilim", "polemik"],
  subject: konum,
  period: { earliest: -1800, latest: -500, era_label: "Eski Babil - Sürgün dönemi", precision: "range", dating_method: ["textual", "epigraphic"] },
  languages: ["Akadca", "İbranice"],
  disciplines: ["dilbilim", "filoloji"],
  popular_claim: "Babil, 'karışıklık' anlamına gelir.",
  divergence: "Düşman bir metnin kasıtlı kelime oyunu, üç bin yıl sonra şehrin dünya çapında bilinen anlamı oldu. Etimoloji yanlış ama yanlışlığı kaza değil.",
  divergence_type: ["ideolojik-secim"],
  sources: [cda, sarna, tekvin, bottero],
  evidence: [
    ev("Akadca Bāb-ilim 'tanrının kapısı' okumasıyla sözlükte yer alır.",
      cite("black-george-postgate-2000-cda", "bābu ve ilu maddeleri", "direct"), { id: "bab-ilim-sozluk" }),
    ev("Akadca Bab-ilim ile İbranice balal arasında dilbilimsel akrabalık yok; yalnızca sesçe benziyorlar.",
      cite("sarna-1966-understanding-genesis", "Babil Kulesi bölümü", "direct"), { id: "akrabalik-yok" }),
    ev("Tekvin 11:9 bağlantıyı açıkça kuruyor.",
      cite("tekvin-11-1-9", "11:9", "claim-origin"), { id: "tekvin-baglantiyi-kuruyor" }),
    ev("Kelime oyunu bir hata değil, düşman bir şehre yönelik bilinçli bir polemik aracıdır.",
      cite("sarna-1966-understanding-genesis", "Kelime oyunu çözümlemesi", "direct"), { id: "polemik-arac" }),
  ],
  counter_evidence: [
    ev("Adın kendi kökeni de tartışmasız değil: Bāb-ilim okuması, adın daha eski ve Sami dili dışı bir biçimin sonradan yorumlanması olabileceği görüşünü tümüyle dışlamaz.",
      cite("bottero-1992-mesopotamia", "Ad ve kültür bölümü", "context"), { id: "adin-kendi-kokeni" }),
    ev("Bu kayıttaki kaynakların tam metinleri okunmadı; locator'lar bölüm düzeyinde.",
      cite("black-george-postgate-2000-cda", "Kayıt düzeyi sınırı", "context"), { id: "tam-metin-okunmadi" }),
  ],
  open_questions: ["Bāb-ilim okuması, adın Sami dili öncesi bir biçime dayanma ihtimalini ne kadar kapatıyor?"],
  checked: CHECKED, used_in: ["babil", "ayni-cumlede"],
  review: { status: "draft", notes: "Yer tutucu ('Akadca sözlük ve Asurbilim literatürü') üç gerçek künyeyle değiştirildi. Adın kökenine dair açık uç counter_evidence'a eklendi." },
});

const etemenanki = finding({
  id: "babil-etemenanki-yuksekligi",
  claim: "Etemenanki zigguratının yüksekliği belirlenebilir.",
  status: "unmeasurable", confidence: "high",
  topic: ["babil", "etemenanki", "olcum"],
  subject: { ...konum, site: "Etemenanki zigguratı", site_native: "É-temen-an-ki" },
  period: { earliest: -604, latest: -323, era_label: "Yeni Babil - Helenistik", precision: "disputed", dating_method: ["none", "textual"] },
  languages: ["Akadca", "Sümerce"],
  disciplines: ["arkeoloji", "mimarlik"],
  people: [{ name: "Koldewey, Robert", role: "excavator", affiliation: "Deutsche Orient-Gesellschaft", year: 1899, lifespan: "1855-1925" }],
  popular_claim: "Babil Kulesi 91 metre yüksekliğindeydi.",
  divergence: "İki kaynak %50 farkla çelişiyor ve yapı bugün yok olduğu için yeni ölçüm mümkün değil. Popüler kaynaklar hangisi etkileyiciyse onu yazıyor.",
  divergence_type: ["guncellenmemis", "medya-abartisi"],
  sources: [koldewey, esagila, georgeBTT],
  evidence: [
    ev("1913 arazi ölçümü ve temel izlerinden ~61 m tahmini.",
      cite("koldewey-1913-babil", "Etemenanki ölçümleri", "direct"), { id: "koldewey-61m" }),
    ev("Esagila Tableti ~91 m ve yedi kat veriyor.",
      cite("esagila-tableti", "Ölçü satırları", "direct"), { id: "esagila-91m" }),
  ],
  counter_evidence: [
    ev("Esagila Tableti Helenistik dönemden kalma bir kopya; yapı zaten harabeyken yazılmış ve ideal ölçüler vermiş olabilir.",
      cite("george-1992-babylonian-topographical-texts", "Esagila Tableti değerlendirmesi", "counter"), { id: "esagila-ideal-olcu" }),
    ev("Yapı tuğlaları yüzyıllar boyunca sökülüp götürüldü; yerinde suyla dolmuş bir çukur var.",
      cite("koldewey-1913-babil", "Alanın durumu", "counter"), { id: "tuglalar-sokuldu" }),
    ev("Koldewey'in yayın künyesi bu turda bağımsız doğrulanmadı; yayıncı ve baskı bilgisi eksik.",
      cite("koldewey-1913-babil", "Künye düzeyi", "context"), { id: "koldewey-kunye-eksik" }),
  ],
  open_questions: ["İki rakam arasındaki fark, ölçüm hatası mı yoksa iki farklı yapı evresi mi?"],
  checked: CHECKED, used_in: ["babil"],
  review: { status: "draft", notes: "George 1992 eklendi - Esagila Tableti'nin Helenistik kopya olduğu değerlendirmesi artık künyeli bir kaynağa bağlı." },
});

const iskender = finding({
  id: "babil-kuleyi-iskender-sokturdu",
  claim: "Etemenanki'nin kalıntısı, onu yeniden inşa etmek isteyen Büyük İskender tarafından söktürüldü.",
  status: "established", confidence: "medium",
  topic: ["babil", "etemenanki", "iskender"],
  subject: { ...konum, site: "Etemenanki zigguratı", site_native: "É-temen-an-ki" },
  period: { earliest: -331, latest: -323, era_label: "Helenistik geçiş", precision: "approximate", dating_method: ["historical-record"] },
  languages: ["Grekçe"],
  disciplines: ["tarih", "arkeoloji"],
  people: [{ name: "Büyük İskender", role: "excavator", affiliation: "Makedonya Krallığı", year: -331, lifespan: "MÖ 356-323" }],
  popular_claim: "Babil Kulesi tanrısal bir cezayla ya da bir felaketle yıkıldı.",
  divergence: "Yapıyı ortadan kaldıran şey ceza değil, YENİDEN İNŞA NİYETİ oldu: İskender zemini yeni yapı için temizletti, sonra MÖ 323'te Babil'de öldü ve inşaat hiç başlamadı. Yani kule 'yıkılmadı', SÖKÜLÜP ORTADA BIRAKILDI - anlatının en bilinen sonu, gerçekte bir inşaat kazasıdır.",
  divergence_type: ["guncellenmemis"],
  sources: [georgeBTT],
  evidence: [
    ev("İskender zemini yeni yapı için temizletti.",
      cite("george-1992-babylonian-topographical-texts", "Etemenanki'nin geç tarihçesi", "direct"), { id: "zemin-temizlendi" }),
    ev("MÖ 323'te Babil'de öldü; yeniden inşa hiç başlamadı.",
      cite("george-1992-babylonian-topographical-texts", "Etemenanki'nin geç tarihçesi", "direct"), { id: "insaat-baslamadi" }),
  ],
  counter_evidence: [
    ev("Sökümün ölçeği ve ne kadarının İskender döneminde yapıldığı klasik kaynaklara dayanır; arkeolojik olarak evrelere ayrılmış değildir.",
      cite("george-1992-babylonian-topographical-texts", "Kaynak değerlendirmesi", "counter"), { id: "sokum-olcegi-belirsiz" }),
    ev("Yapının tuğlaları yüzyıllar boyunca da sökülmüştü; İskender tek etken değil.",
      cite("george-1992-babylonian-topographical-texts", "Alanın uzun tarihçesi", "counter"), { id: "tek-etken-degil" }),
  ],
  open_questions: ["Söküm evreleri arkeolojik olarak ayrıştırılabilir mi?"],
  checked: CHECKED, used_in: ["babil"],
  review: { status: "draft", notes: "Kayıt popular_claim ve divergence olmadan duruyordu - projenin temel ayrımı kurulmamıştı. Kuruldu ve kaynağa bağlandı." },
});

const nudimmud = finding({
  id: "babil-nudimmud-paraleli",
  claim: "Sümerce 'Enmerkar ve Aratta Beyi' metnindeki Nudimmud pasajı Babil Kulesi'ndeki dil karışması motifinin öncülüdür.",
  status: "refuted", confidence: "medium",
  topic: ["babil", "sumer", "karsilastirmali-mitoloji", "ceviri-tartismasi"],
  subject: { site: "Enmerkar ve Aratta Beyi", region: "Sümer", modern_country: "Irak" },
  period: { earliest: -2100, latest: -1700, era_label: "Ur III - Eski Babil (nüsha)", precision: "approximate", dating_method: ["paleography", "textual"] },
  languages: ["Sümerce", "İbranice"],
  disciplines: ["filoloji", "dilbilim"],
  people: [{ name: "Kramer, Samuel Noah", role: "proposer", affiliation: "University of Pennsylvania", year: 1968, lifespan: "1897-1990" }],
  popular_claim: "Babil Kulesi hikâyesinin çok daha eski bir Sümer versiyonu vardır.",
  divergence: "Kramer'in 20. yüzyıl ortası okuması pasajı bir BOZMA eylemi sayıp Tekvin ile eşleştirdi ve popüler kaynaklara yerleşti. Oxford ETCSL'deki standart çeviride pasaj dillerin BİRLEŞMESİNİ diliyor - anlam ters yönde.",
  divergence_type: ["eski-ceviri"],
  sources: [etcsl, vanstiphout, blackSumer, kramerSumerians],
  evidence: [
    ev("ETCSL çevirisi: bütün halklar Enlil'e tek bir dille seslensin; Enki konuşmayı değiştirsin ve insanlığın konuşması gerçekten tek olsun.",
      cite("etcsl-1-8-2-3-enmerkar", "Nudimmud pasajı", "direct"), { id: "etcsl-cevirisi" }),
    ev("Pasaj dilek kipinde ve altın çağ betimlemesi içinde geçiyor.",
      cite("vanstiphout-2003-epics-sumerian-kings", "Enmerkar ve Aratta Beyi, pasaj notları", "direct"), { id: "dilek-kipi-altin-cag" }),
    ev("Basılı standart çeviri de aynı okumayı veriyor - yani okuma tek bir çevrimiçi kaynağa bağlı değil.",
      cite("black-2004-literature-ancient-sumer", "Enmerkar ve Aratta Beyi çevirisi", "direct"), { id: "basili-ceviri-ayni" }),
    ev("Karşıt okumanın kaynağı belirli: Kramer pasajı bir bozma eylemi olarak sunmuş ve popüler literatür bunu devralmıştır.",
      cite("kramer-1963-the-sumerians", "Enmerkar bölümü", "claim-origin"), { id: "kramer-okumasi-koken" }),
  ],
  counter_evidence: [
    ev("Sümerce fiilin kipi ve zamanı üzerinde uzmanlar arasında görüş farkı sürüyor; tartışma tamamen kapanmış değil.",
      cite("vanstiphout-2003-epics-sumerian-kings", "Fiil kipi tartışması", "counter"), { id: "fiil-kipi-tartismasi" }),
    ev("'Refuted' damgası KRAMER'İN OKUMASINA değil, 'Babil Kulesi'nin Sümer versiyonu' eşleştirmesine aittir. Kramer'in metni yanlış çevirdiği değil, farklı yorumladığı söyleniyor.",
      cite("kramer-1963-the-sumerians", "Kayıt düzeyi ayrımı", "context"), { id: "refuted-neye-ait" }),
  ],
  open_questions: ["Fiil kipi tartışması nasıl çözülecek - yeni tablet parçası gerekebilir."],
  checked: CHECKED, used_in: ["babil"],
  review: { status: "draft", notes: "Yer tutucu ('Kramer - eski okuma') gerçek künyeyle değiştirildi ve claim-origin olarak işaretlendi. 'Refuted'ın neyi çürüttüğü açıklığa kavuşturuldu." },
});

const asmaBahceler = finding({
  id: "babil-asma-bahceler-ninova",
  claim: "Asma Bahçeler Babil'de değil Ninova'daydı ve Sennacherib tarafından yaptırıldı.",
  status: "contested", confidence: "high",
  topic: ["babil", "ninova", "asma-bahceler"],
  subject: { site: "Ninova (önerilen yer)", region: "Yukarı Mezopotamya, Dicle kıyısı", modern_country: "Irak", coordinates: { lat: 36.3599, lon: 43.1526 } },
  period: { earliest: -704, latest: -681, era_label: "Yeni Asur, Sennacherib dönemi", precision: "range", dating_method: ["textual", "epigraphic", "stratigraphy"] },
  languages: ["Akadca", "Grekçe"],
  disciplines: ["arkeoloji", "filoloji", "tarih"],
  people: [
    { name: "Dalley, Stephanie", role: "proposer", affiliation: "University of Oxford", year: 2013 },
    { name: "Koldewey, Robert", role: "excavator", affiliation: "Deutsche Orient-Gesellschaft", year: 1899, lifespan: "1855-1925" },
  ],
  popular_claim: "Asma Bahçeler Nebukadnezar tarafından Babil'de yaptırıldı.",
  divergence: "Dünyanın yedi harikasından yeri en şüpheli olanı; popüler anlatı hiç sorgulanmadan tekrarlanıyor. Ama bu kaydın durumu 'çürütüldü' değil TARTIŞMALI: Ninova tezi güçlü bir öneri, kabul edilmiş bir sonuç değil.",
  divergence_type: ["guncellenmemis"],
  sources: [dalley2013, dalley1994, finkelSeymour, koldewey],
  evidence: [
    ev("Hiçbir Babil metni bahçelerden söz etmiyor - Nebukadnezar'ın uzun inşaat yazıtları dahil.",
      cite("dalley-2013-hanging-garden", "Babil kaynaklarının sessizliği", "direct"), { id: "babil-metinleri-sessiz" }),
    ev("Sennacherib Ninova'daki bahçesini ve ~50 km uzaktan su getiren sistemi kendi kaydetti.",
      cite("dalley-1994-nineveh-babylon-iraq", "Sennacherib yazıtları çözümlemesi", "direct"), { id: "sennacherib-kendi-kaydi" }),
    ev("Koldewey Babil'i 18 yıl kazdı ve ikna edici bir kalıntı bulamadı.",
      cite("koldewey-1913-babil", "Kazı sonuçları", "direct"), { id: "koldewey-bulamadi" }),
    ev("Ninova'da su kemeri kalıntıları ve su yükseltme düzeneğine dair betimlemeler var.",
      cite("dalley-2013-hanging-garden", "Su sistemi bölümü", "direct"), { id: "ninova-su-sistemi" }),
  ],
  counter_evidence: [
    ev("İki şehirde de bahçenin arkeolojik kanıtı yok - tez sorunu çözmüyor, yer değiştiriyor.",
      cite("finkel-seymour-2008-babylon", "Bahçeler bölümü", "counter"), { id: "kanit-iki-yerde-de-yok" }),
    ev("Eleştirmenler Dalley'in Klasik kaynakları seçici okuduğunu söylüyor.",
      cite("finkel-seymour-2008-babylon", "Tezin değerlendirmesi", "counter"), { id: "secici-okuma-elestirisi" }),
    ev("Antik yazarların 'Babil' demesi tümüyle yok sayılamaz; ad bölgeyi geniş anlamda karşılıyor olabilir.",
      cite("finkel-seymour-2008-babylon", "Adlandırma tartışması", "counter"), { id: "babil-adi-genis-anlam" }),
    ev("Bu kaydın iki ana kaynağı da AYNI YAZARDAN (Dalley 1994 ve 2013); tez lehindeki kanıt tek bir araştırmacının okumasına dayanıyor.",
      cite("dalley-2013-hanging-garden", "Kaynak bağımsızlığı", "context"), { id: "tek-arastirmaci" }),
  ],
  open_questions: [
    "Bahçelerin tümüyle edebi bir abartı olma ihtimali masadan kalkmadı.",
    "Dalley dışında tezi bağımsız olarak sınayan bir çalışma var mı?",
  ],
  checked: CHECKED, used_in: ["babil", "ayni-cumlede"],
  review: { status: "draft", notes: "Yer tutucu ('Dalley'e yöneltilen metodolojik eleştiriler') Finkel & Seymour 2008 ile karşılandı. Tez lehindeki kanıtın tek yazara dayandığı açıkça işaretlendi." },
});

const altmislik = finding({
  id: "babil-60lik-sistem-bugun",
  claim: "Bugün kullandığımız 60 dakikalık saat ve 360 derecelik çember Mezopotamya'nın altmışlık taban sisteminden gelir.",
  status: "established", confidence: "high",
  topic: ["babil", "matematik", "sureklilik"],
  subject: { region: "Mezopotamya", modern_country: "Irak" },
  period: { earliest: -3000, latest: 2026, era_label: "Sümer'den bugüne", precision: "range", dating_method: ["textual"] },
  languages: ["Sümerce", "Akadca"],
  disciplines: ["matematik", "bilim-tarihi"],
  popular_claim: "Altmışlık sistemi Babilliler icat etti.",
  divergence: "Zincir tek adımlı değil: taban SÜMER kökenlidir, BABİL matematiğinde sistemleşmiştir ve bugüne YUNAN ASTRONOMİSİ üzerinden geçmiştir. 'Babil icat etti' cümlesi üç ayrı aşamayı tek isme sıkıştırıyor - ve aktarımı sağlayan halkayı, yani astronomiyi, görünmez kılıyor.",
  divergence_type: ["kategori-hatasi"],
  sources: [robson, neugebauer],
  evidence: [
    ev("Altmışlık taban Sümer kökenlidir ve Babil matematiğinde sistemleşmiştir.",
      cite("robson-2008-mathematics-ancient-iraq", "Sayı sistemleri bölümü", "direct"), { id: "sumer-kokeni-babil-sistemlesme" }),
    ev("Sistem bugüne Yunan astronomisi üzerinden aktarılmıştır.",
      cite("neugebauer-1969-exact-sciences", "Babil astronomisinin aktarımı", "direct"), { id: "yunan-astronomisi-aktarimi" }),
  ],
  counter_evidence: [
    ev("Altmışlık tabanın NEDEN seçildiği çözülmüş değil; bölenlerinin çokluğu sık öne sürülür ama bu sonradan yapılmış bir gerekçelendirmedir, belgeli bir sebep değil.",
      cite("robson-2008-mathematics-ancient-iraq", "Kökene dair tartışma", "counter"), { id: "neden-60-bilinmiyor" }),
    ev("Bugünkü saat ve derece bölümlemesinin kesintisiz bir aktarım mı yoksa sonradan yeniden benimseme mi olduğu, aradaki dönemler için ayrıntılı olarak izlenmedi.",
      cite("neugebauer-1969-exact-sciences", "Aktarım zinciri", "context"), { id: "kesintisiz-mi" }),
  ],
  open_questions: ["Altmışlık tabanın seçilme sebebi belgelenebilir mi, yoksa kalıcı olarak açık bir soru mu?"],
  checked: CHECKED, used_in: ["babil"],
  review: { status: "draft", notes: "Yer tutucu ('Mezopotamya matematiği literatürü') Robson ve Neugebauer ile değiştirildi. Kayıt popular_claim ve divergence olmadan duruyordu; kuruldu." },
});

const yamuk = finding({
  id: "babil-yamuk-yontemi",
  claim: "Babilli gökbilimciler Jüpiter'in konumunu hız-zaman grafiğinin altındaki alanı yamuk olarak hesaplayarak buluyordu.",
  status: "established", confidence: "high",
  topic: ["babil", "astronomi", "matematik"],
  subject: konum,
  period: { earliest: -350, latest: -50, era_label: "Geç Babil astronomisi", precision: "range", dating_method: ["textual", "astronomical"] },
  languages: ["Akadca"],
  disciplines: ["astronomi", "matematik", "bilim-tarihi"],
  people: [{ name: "Ossendrijver, Mathieu", role: "analyst", affiliation: "Humboldt-Universität zu Berlin", year: 2016 }],
  popular_claim: "Bu geometrik yöntem 14. yüzyıl Oxford'unda doğdu.",
  divergence: "2016'da çivi yazılı tabletlerde gösterildi; yöntem yaklaşık 1.400 yıl daha eski çıktı.",
  divergence_type: ["guncellenmemis"],
  sources: [ossendrijver, neugebauer],
  evidence: [
    ev("Çivi yazılı tabletlerde hesap adımları izlenebiliyor.",
      cite("ossendrijver-2016-jupiter-yamuk", "Tablet çözümlemesi", "direct"), { id: "hesap-adimlari-izlenebiliyor" }),
    ev("Astronomi Günlükleri ~MÖ 7. yy'dan MÖ 1. yy'a, yaklaşık 700 yıl kesintisiz gözlem kaydı içeriyor.",
      cite("neugebauer-1969-exact-sciences", "Astronomi Günlükleri", "context"), { id: "700-yil-gozlem" }),
  ],
  counter_evidence: [
    ev("Bulgu DÖRT tablet üzerine kuruludur; yöntemin Babil astronomisinde ne kadar yaygın olduğu bundan çıkarılamaz.",
      cite("ossendrijver-2016-jupiter-yamuk", "Malzeme ve yöntem", "counter"), { id: "dort-tablet" }),
    ev("'Oxford'da doğdu' anlatısının çürütülmesi, iki geleneğin BAĞLANTILI olduğunu göstermez; bağımsız gelişme de mümkündür.",
      cite("ossendrijver-2016-jupiter-yamuk", "Tartışma bölümü", "context"), { id: "baglanti-gosterilmedi" }),
  ],
  open_questions: ["Yöntem Babil astronomisinde yaygın mıydı, yoksa birkaç kâtibe mi özgüydü?"],
  checked: CHECKED, used_in: ["babil"],
  review: { status: "draft", notes: "Ossendrijver künyesi DOI ile tamamlandı (crossref doğruladı). Örneklem darlığı counter_evidence'a eklendi." },
});

const herodotKaydi = finding({
  id: "babil-herodot-gitti-mi",
  claim: "Herodot Babil'i kendi gözleriyle gördü.",
  status: "unknown", confidence: "medium",
  topic: ["babil", "kaynak-elestirisi", "herodot"],
  subject: konum,
  period: { earliest: -450, latest: -425, era_label: "Klasik Yunan", precision: "approximate", dating_method: ["historical-record"] },
  languages: ["Grekçe"],
  disciplines: ["tarih", "filoloji"],
  people: [{ name: "Herodotos", role: "proposer", year: -440, lifespan: "MÖ ~484-425" }],
  popular_claim: "Herodot'un Babil betimlemesi görgü tanıklığıdır.",
  divergence: "Verdiği sur ölçüleri fiziksel olarak mümkün değil ve arkeolojik kalıntılarla uyuşmuyor; betimlemelerinde şehri görmüş birinden beklenmeyecek hatalar var.",
  divergence_type: ["medya-abartisi"],
  sources: [herodot, dalley1994, koldewey],
  evidence: [
    ev("Anlatının kaynağı Tarihler'in birinci kitabıdır; Herodot şehri ayrıntılı biçimde betimler.",
      cite("herodotos-tarihler-1", "Babil betimlemesi", "claim-origin"), { id: "tarihler-birinci-kitap" }),
  ],
  counter_evidence: [
    ev("Verdiği sur ölçüleri abartılıdır ve dönemin yapı tekniğiyle uyuşmaz.",
      cite("dalley-1994-nineveh-babylon-iraq", "Klasik kaynakların ölçüleri", "counter"), { id: "olculer-abartili" }),
    ev("Kazıdan çıkan sur kalıntıları anlatılan ölçeği desteklemiyor.",
      cite("koldewey-1913-babil", "Sur kazıları", "counter"), { id: "kazi-olcegi-desteklemiyor" }),
    ev("Muhtemelen ikinci elden, zaten büyütülmüş anlatılara dayandı.",
      cite("dalley-1994-nineveh-babylon-iraq", "Kaynak değerlendirmesi", "counter"), { id: "ikinci-el-anlatilar" }),
    ev("Kaydın durumu 'unknown' - yani 'gitmedi' denmiyor. Abartılı ölçüler gitmemiş olmayı DÜŞÜNDÜRÜR ama kanıtlamaz; bir gezginin gördüğünü de abartması mümkündür.",
      cite("dalley-1994-nineveh-babylon-iraq", "Kayıt düzeyi ayrımı", "context"), { id: "gitmedi-denmiyor" }),
  ],
  open_questions: [
    "Herodot'un Babil bölümü üzerine yapılmış özel çalışmalar bu kayıtta taranmadı; Almanca literatür özellikle eksik.",
  ],
  checked: CHECKED, used_in: ["babil", "ayni-cumlede"],
  review: {
    status: "draft",
    notes:
      "DeepSeek turunda önerilen Rollinger künyesi ALINMADI: yalnızca alan adı düzeyinde bir URL vardı (histos.org), makalenin kendisine değil; başlık da doğrulanamadı. Kaydın Herodot'a özel literatür eksiği açık soru olarak bırakıldı.",
  },
});

const istarKapisi = finding({
  id: "babil-istar-kapisi-berlin",
  claim: "İştar Kapısı Berlin'deki Pergamon Müzesi'ndedir ve Irak iadesini talep etmektedir.",
  status: "established", confidence: "high",
  topic: ["babil", "mulkiyet", "miras-hukuku"],
  subject: { ...konum, site: "İştar Kapısı" },
  period: { earliest: 1899, latest: 2026, era_label: "Modern kazı ve mülkiyet", precision: "range", dating_method: ["historical-record"] },
  disciplines: ["hukuk", "sanat-tarihi", "arkeoloji"],
  people: [{ name: "Koldewey, Robert", role: "excavator", affiliation: "Deutsche Orient-Gesellschaft", year: 1899, lifespan: "1855-1925" }],
  popular_claim: "Berlin'de görülen İştar Kapısı, Babil'deki kapının kendisidir.",
  divergence: "Berlin'de duran şey taşınmış bir yapı değil, sırlı tuğlalardan 1930'larda KURULMUŞ bir yeniden inşadır. Dahası sergilenen, kapının küçük ön bölümüdür; büyük olan depodadır. Yani ziyaretçi 'Babil'in kapısını' değil, onun bir bölümünün müzede kurulmuş hâlini görüyor.",
  divergence_type: ["kategori-hatasi"],
  sources: [pergamon, unescoBabil, koldewey],
  evidence: [
    ev("Koldewey kazısından çıkan sırlı tuğlalar Almanya'ya götürüldü, 1930'larda yeniden kuruldu.",
      cite("koldewey-1913-babil", "Kazı ve buluntuların taşınması", "direct"), { id: "tuglalar-tasindi" }),
    ev("Müzede sergilenen yalnızca küçük ön kapı; büyük olan depoda.",
      cite("pergamon-muzesi-istar-kapisi", "Sergileme bilgisi", "direct"), { id: "kucuk-on-kapi" }),
    ev("Babil UNESCO Dünya Mirası listesine ancak 2019'da girdi.",
      cite("unesco-2019-babil-dunya-mirasi", "Tescil tarihi", "direct"), { id: "unesco-2019-tescil" }),
  ],
  counter_evidence: [
    ev("İade talebinin hukuki durumu ve resmî yazışmaları bu kayıtta DOĞRULANMADI; ifade genel aktarımlara dayanıyor.",
      cite("pergamon-muzesi-istar-kapisi", "Kayıt düzeyi sınırı", "counter"), { id: "iade-talebi-dogrulanmadi" }),
    ev("Nesneyi elinde tutan kurumun kendi sayfası bu tartışmada TARAF kaynaktır; Irak tarafının konumu burada temsil edilmiyor.",
      cite("pergamon-muzesi-istar-kapisi", "Kaynak konumu", "context"), { id: "taraf-kaynak" }),
  ],
  open_questions: [
    "Irak'ın resmî iade talebi belgeli mi? Hangi tarihte, hangi kanaldan?",
  ],
  checked: CHECKED, used_in: ["babil", "ayni-cumlede"],
  review: { status: "draft", notes: "Kayıt popular_claim ve divergence olmadan duruyordu. Kuruldu: sergilenenin yeniden inşa olduğu ayrımı eklendi. İade talebinin doğrulanmadığı açıkça işaretlendi." },
});

const tahribat = finding({
  id: "babil-modern-tahribat",
  claim: "Babil sahası 1980'lerdeki yeniden inşa ve 2003 sonrası askerî üs nedeniyle geri dönülmez hasar gördü.",
  status: "established", confidence: "high",
  topic: ["babil", "miras-tahribati"],
  subject: konum,
  period: { earliest: 1980, latest: 2019, era_label: "Modern tahribat ve koruma", precision: "range", dating_method: ["historical-record"] },
  disciplines: ["arkeoloji", "hukuk"],
  popular_claim: "Babil'in tahribatı 2003 işgaliyle başladı.",
  divergence: "Hasar iki ayrı kaynaktan ve iki farklı türde geldi. 1980'lerde Saddam Hüseyin özgün kalıntıların ÜZERİNE, kendi adı damgalı tuğlalarla inşa ettirdi - yani tahribat bir siyasi program olarak yapıldı. 2003-2004'te ise alanın üzerine askerî üs kuruldu ve yaklaşık 300.000 m² çakılla kaplandı. İkincisi daha çok konuşuluyor ama birincisi geri dönülmezliği bakımından ondan hafif değil.",
  divergence_type: ["ideolojik-secim", "guncellenmemis"],
  sources: [unescoHasar, unescoBabil],
  evidence: [
    ev("Saddam Hüseyin Nebukadnezar'ın sarayının kalıntıları üzerine, kendi adı damgalı tuğlalarla inşa ettirdi.",
      cite("van-ess-curtis-2009-babil-hasar-raporu", "Yeniden inşa dönemi değerlendirmesi", "direct"), { id: "saddam-yeniden-insa" }),
    ev("2003-2004'te koalisyon güçleri doğrudan alanın üzerine üs kurdu; kamp Nisan 2003 ile Aralık 2004 arasında kaldı.",
      cite("van-ess-curtis-2009-babil-hasar-raporu", "Askerî kamp dönemi", "direct"), { id: "askeri-us-2003-2004" }),
    ev("Yaklaşık 300.000 m² çakılla kaplandı; bu, bozulmamış arkeolojik dolguyu tehlikeye attı.",
      cite("van-ess-curtis-2009-babil-hasar-raporu", "Hasar dökümü", "direct"), { id: "300000-m2-cakil" }),
    ev("Kazı, kesme, sıyırma ve tesviye işlemleri kente ciddi zarar verdi; İştar Kapısı ve Tören Yolu da hasar gördü.",
      cite("van-ess-curtis-2009-babil-hasar-raporu", "Hasar dökümü", "direct"), { id: "istar-kapisi-toren-yolu-hasar" }),
  ],
  counter_evidence: [
    ev("Rapor tek elden çıkmadı ama TARAFLARDAN BİRİNİN katkısını da içeriyor: değerlendirmelere ABD Dışişleri Bakanlığı için hazırlanan bir rapor da girdi. Bu, raporu geçersiz kılmaz, okunurken bilinmesi gerekir.",
      cite("van-ess-curtis-2009-babil-hasar-raporu", "Katkıda bulunanlar", "context"), { id: "raporun-katkicilari" }),
    ev("'Geri dönülmez' nitelemesi hasarın türüne göre değişir; çakıl örtüsünün kaldırılabilirliği ile tabakayı kesen hendekler aynı şey değildir.",
      cite("van-ess-curtis-2009-babil-hasar-raporu", "Öneriler bölümü", "context"), { id: "geri-donulmezlik-dereceli" }),
  ],
  open_questions: [
    "1980'ler ve 2003 hasarının göreli ağırlığı ölçülebilir mi?",
    "2009 raporundan bu yana durum nasıl değişti? Güncel değerlendirme taranmadı.",
  ],
  checked: CHECKED, used_in: ["babil"],
  review: {
    status: "draft",
    notes:
      "DeepSeek turunda bu kayda George 1992 önerilmişti - kitap gerçek ama antik topografya metinleri modern tahribat hakkında hiçbir şey söylemez. DOĞRULANMIŞ AMA İLGİSİZ olduğu için alınmadı; yerine UNESCO 2009 hasar raporunun künyesi ayrıca arandı ve doğrulandı. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu.",
  },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
const yeni = [etimoloji, etemenanki, iskender, nudimmud, asmaBahceler, altmislik, yamuk, herodotKaydi, istarKapisi, tahribat];
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
