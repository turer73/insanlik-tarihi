#!/usr/bin/env node
// Sümer dosyası, birinci geçiş: 12 kaydın 7'si v2'ye.
//
// BU DOSYADAKİ ASIL SORUN ŞEMA SÜRÜMÜ DEĞİLDİ. Kaynakların çoğu künye
// değil, LİTERATÜRE İŞARET EDEN YER TUTUCU CÜMLELERDİ:
//   "Proto-çivi yazısı ve erken Mezopotamya idaresi literatürü"
//   "Çivi yazısının çözülmesi ve Asirbilim tarihi literatürü"
//   "Enheduanna atfı üzerine Asirbilim tartışması"
//   "Sümer sorunu üzerine dilbilim ve arkeoloji literatürü"
// Bunlar kaynak değil, kaynak olması gereken yere konmuş etiketlerdir.
// Böyle bir "kaynağı" v2'ye çevirmek - locator ve support_type ekleyerek -
// doğrulanmamış olanı doğrulanmış gibi göstermek olurdu. v1'de bir yer
// tutucu görünür kalır; v2'de künyeli bir atıf gibi durur. Bu yüzden önce
// GERÇEK KÜNYELER bulundu, sonra geçiş yapıldı.
//
// BU GEÇİŞTE OLMAYAN 5 KAYIT ve nedeni: sumer-akadca-uzerinden-cozuldu,
// sumer-anunnaki-nibiru, sumer-birdenbire-ortaya-cikmadi,
// sumer-koken-sorunu, sumer-ur-sancagi-islevi. Hepsinin kaynağı hâlâ yer
// tutucu ve bu turda doğrulanmış künye bulunamadı. v1 olarak BIRAKILDILAR -
// uydurma künyeyle v2'ye taşınmadılar. Dosya karma kalıyor; bunu bilerek
// kabul ediyorum, çünkü alternatifi sahte kaynağı doğrulanmış göstermek.
//
// TÜRKÇE KAYNAK - BURADA ZORLAMA DEĞİL, KONUNUN KENDİSİ:
// Ur-Nammu Yasaları'nın bilinen ilk nüshası (Ni 3191) İSTANBUL ARKEOLOJİ
// MÜZELERİ'nin Nippur koleksiyonundadır. Tableti orada kurator olan
// F. R. Kraus iki parçayı birleştirerek tanımlamış, Kramer da bunu
// Kraus'un mektubuyla öğrenip yayımlamıştır. Yani buradaki Türkçe kurum
// kaynağı, hedefe göre seçilmiş bir ek değil; nesnenin bulunduğu yer.
// Persepolis ve Şuşter'de Türkçe kaynak UYGULANMAMIŞTI çünkü orada konu
// bunu gerektirmiyordu. Ölçüt aynı ölçüt: kaynağı konu belirler.
//
// DOĞRULANAN KÜNYELER (2026-09-09, hepsi arama ile teyit edildi):
//   Nissen, H. J.; Damerow, P.; Englund, R. K. Archaic Bookkeeping: Early
//   Writing and Techniques of Economic Administration in the Ancient Near
//   East. Çev. Paul Larsen. University of Chicago Press, 1993.
//   ISBN 9780226586595, xi+169 s.
//
//   Baadsgaard, A.; Monge, J.; Cox, S.; Zettler, R. L. "Human sacrifice and
//   intentional corpse preservation in the Royal Cemetery of Ur."
//   Antiquity 85(327), 2011, s. 27-42. DOI 10.1017/S0003598X00067417
//   (adres canlı kontrol edildi, 200 dönüyor).
//
//   George, A. R. The Babylonian Gilgamesh Epic: Introduction, Critical
//   Edition and Cuneiform Texts. 2 cilt. Oxford University Press, 2003.
//   ISBN 9780198149224.
//
//   Jacobsen, Thorkild. The Sumerian King List. Oriental Institute,
//   University of Chicago, 1939. Editio princeps.
//
//   Helle, Sophus. Enheduana: The Complete Poems of the World's First
//   Author. Yale University Press, 2023.
//
// TIER MANTIĞI - rolüne göre, türüne göre değil:
// Bir edisyon "metin ne diyor" için kullanılıyorsa primary, yazarın
// çözümlemesi için kullanılıyorsa peer-reviewed sayıldı. Bu yüzden Jacobsen
// ve Kramer primary (metnin kendisine erişim yolu), George peer-reviewed
// (Sümerce şiirlerin ayrı olduğu ve tufanın Akadca gelenekten geldiği
// George'un çözümlemesidir, metnin kendisi değil).
//
// SINIRLAR:
// - Hiçbir kaynağın TAM METNİ OKUNMADI. Locator'lar bölüm/madde düzeyinde.
// - Helle 2023'ün ISBN'i doğrulanamadı; künye iki bağımsız aramayla teyit
//   edildi ama URL olarak yazarın kendi sayfası kullanıldı - yayıncı kaydı
//   kadar güçlü bir çıpa değil, kaynak notunda yazılı.
// - Jacobsen'in "Assyriological Studies 11" seri numarası aramada teyit
//   EDİLMEDİ; yazılmadı.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/sumer.json";
const CHECKED = "2026-09-09";

/* --- kaynaklar ----------------------------------------------------- */

const nissen = source("nissen-damerow-englund-1993-archaic-bookkeeping", {
  tier: "peer-reviewed",
  type: "book",
  authors: ["Nissen, Hans J.", "Damerow, Peter", "Englund, Robert K."],
  year: 1993,
  title: "Archaic Bookkeeping: Early Writing and Techniques of Economic Administration in the Ancient Near East",
  publisher: "University of Chicago Press",
  isbn: "9780226586595",
  pages: "xi+169",
  language: "en",
  note:
    "Proto-çivi yazısı külliyatının standart çözümlemesi. Ana tezi doğrudan bu kaydın konusu: en erken tabletlerin amacı DİLİ kaydetmek değil, " +
    "sayısal bir sistemle yerel ekonominin yönetimini izlemekti. Paul Larsen çevirisi. Önceki sürümde bu kaynağın yerinde " +
    "'Proto-çivi yazısı ve erken Mezopotamya idaresi literatürü' yazan bir YER TUTUCU vardı.",
});

const helle = source("helle-2023-enheduana", {
  tier: "peer-reviewed",
  type: "book",
  authors: ["Helle, Sophus"],
  year: 2023,
  title: "Enheduana: The Complete Poems of the World's First Author",
  publisher: "Yale University Press",
  url: "https://sophushelle.com/category/enheduana/",
  language: "en",
  accessed: CHECKED,
  note:
    "Şiirlerin tam çevirisi ve yazarlık tartışmasının güncel değerlendirmesi. Helle atıf tartışmasını hem dikkat dağıtıcı hem çağdışı bulur. " +
    "ISBN DOĞRULANAMADI; künye iki bağımsız aramayla teyit edildi ama URL olarak yazarın kendi sayfası kullanıldı - yayıncı kaydı kadar güçlü bir çıpa değil.",
});

const enheduannaDiski = source("enheduanna-diski", {
  tier: "primary",
  type: "inscription",
  title: "Enheduanna Diski (kalker adak diski, Ur)",
  language: "akk",
  note: "Çağdaş buluntu. Enheduanna'yı adıyla, 'Nanna'nın en-rahibesi' unvanıyla ve Sargon'un kızı olarak tanımlar. Varlığın kanıtı budur - yazarlığın değil.",
});

const kramer = source("kramer-1952-ur-nammu-yasalari", {
  tier: "primary",
  type: "edition",
  authors: ["Kramer, Samuel Noah"],
  year: 1952,
  title: "Ur-Nammu Yasaları: Nippur tableti (Ni 3191) ilk yayını",
  language: "en",
  note:
    "Bilinen ilk nüshanın yayını. Tableti, İstanbul Arkeoloji Müzeleri'nde kurator olan F. R. Kraus iki parçayı birleştirerek tanımlamış ve " +
    "Nippur koleksiyonunda 3191 numarayla kaydetmiştir; Kramer bunu Kraus'un mektubuyla öğrenip incelemiştir. " +
    "Korunma durumu kötü olduğu için yalnızca uzun önsöz ve BEŞ madde okunabilmiştir.",
});

const istanbulMuze = source("istanbul-arkeoloji-nippur-ni3191", {
  tier: "institutional",
  type: "database",
  title: "Nippur koleksiyonu, Ni 3191 - Ur-Nammu Yasaları tableti",
  institution: "İstanbul Arkeoloji Müzeleri, Çivi Yazılı Belgeler Arşivi",
  publisher: "İstanbul Arkeoloji Müzeleri",
  language: "tr",
  note:
    "Nesnenin bulunduğu kurum. Tablet açık kahverengi, yaklaşık 20x10 cm. " +
    "BU KAYITTAKİ TÜRKÇE KURUM KAYNAĞI ZORLAMA DEĞİL: metnin bilinen ilk nüshası fiilen İstanbul'dadır ve " +
    "tanımlanması da orada yapılmıştır. Kurumun çevrimiçi nesne kaydı bu turda DOĞRULANMADI; künye ikincil aktarımlara dayanıyor.",
});

const jacobsen = source("jacobsen-1939-sumerian-king-list", {
  tier: "primary",
  type: "edition",
  authors: ["Jacobsen, Thorkild"],
  year: 1939,
  title: "The Sumerian King List",
  publisher: "Oriental Institute, University of Chicago",
  language: "en",
  note:
    "Listenin editio princeps'i; hâlâ standart edisyon. Seri numarası (Assyriological Studies 11 olarak anılır) bu turda TEYİT EDİLMEDİ, bu yüzden yazılmadı.",
});

const weldBlundell = source("weld-blundell-prizmasi-wb444", {
  tier: "primary",
  type: "inscription",
  title: "Weld-Blundell Prizması (WB 444)",
  institution: "Ashmolean Museum, Oxford",
  language: "sux",
  note:
    "Kral Listesi'nin en tam nüshası: dört yüzlü, yaklaşık 20x9 cm, her yüzde iki sütun. " +
    "Tufan öncesi hükümdarlarla başlar, İsin hanedanından Suen-magir ile biter. Yaklaşık 25 kadar başka nüsha/parça daha bilinir.",
});

const baadsgaard = source("baadsgaard-2011-ur-insan-kurbani", {
  tier: "peer-reviewed",
  type: "article",
  authors: ["Baadsgaard, Aubrey", "Monge, Janet", "Cox, Samantha", "Zettler, Richard L."],
  year: 2011,
  title: "Human sacrifice and intentional corpse preservation in the Royal Cemetery of Ur",
  container: "Antiquity",
  volume: "85(327)",
  pages: "27-42",
  doi: "10.1017/S0003598X00067417",
  language: "en",
  accessed: CHECKED,
  note:
    "Ur Kral Mezarlığı'ndan İKİ kafatasının tomografi incelemesi. Kurbanların keskin bir aletle indirildiğini, sonra ısıtılıp cıvayla " +
    "muhafaza edildiğini, giydirilip sıralar hâlinde yatırıldığını öne sürer - yani 'zehir içip sakin biçimde öldüler' varsayımını sarsar. " +
    "DOI adresi canlı kontrol edildi.",
});

const woolley = source("woolley-1934-ur-kral-mezarligi", {
  tier: "primary",
  type: "report",
  authors: ["Woolley, Leonard"],
  year: 1934,
  title: "Ur Excavations II: The Royal Cemetery",
  publisher: "British Museum - University Museum, Philadelphia",
  language: "en",
  note: "Kazı raporu. Hizmetli gömülerinin sayısı ve düzeni buradan bilinir; ölüm biçimi yorumu ise 1920'lerin imkânlarına dayanır - iskeletleri açmadan içeriden görüntüleme yoktu.",
});

const george = source("george-2003-babylonian-gilgamesh", {
  tier: "peer-reviewed",
  type: "book",
  authors: ["George, Andrew R."],
  year: 2003,
  title: "The Babylonian Gilgamesh Epic: Introduction, Critical Edition and Cuneiform Texts",
  publisher: "Oxford University Press",
  isbn: "9780198149224",
  volume: "2 cilt",
  language: "en",
  note:
    "Bilinen bütün çivi yazılı kaynakları bir araya getiren eleştirel edisyon; xxxiv+977 sayfa ve 147 levha. " +
    "Bu kayıtta EDİSYON OLARAK DEĞİL, ÇÖZÜMLEME OLARAK kullanılıyor: Sümerce şiirlerin ayrı ayrı korunduğu ve " +
    "tufan bölümünün Akadca gelenekten geldiği George'un tespitidir, metnin kendisi değil. Tier ayrımı bu yüzden peer-reviewed.",
});

/* --- 1) Yazı muhasebe için ------------------------------------------ */

const yaziMuhasebe = finding({
  id: "sumer-yazi-muhasebe-icin",
  claim:
    "Yazı muhasebe için icat edildi; bilinen en eski tabletlerin ezici çoğunluğu idari kayıttır ve ilk edebî metinler yaklaşık 700 yıl sonra görülür.",
  status: "established",
  confidence: "high",
  topic: ["sumer", "yazinin-icadi", "mezopotamya"],
  subject: {
    site: "Uruk, Eanna alanı",
    site_native: "Unug",
    region: "Güney Mezopotamya",
    modern_country: "Irak",
    coordinates: { lat: 31.3225, lon: 45.6361 },
  },
  period: {
    earliest: -3300,
    latest: -2600,
    era_label: "Uruk IV - Erken Hanedanlar",
    precision: "range",
    dating_method: ["stratigraphy", "paleography", "radiocarbon"],
  },
  languages: ["Sümerce"],
  disciplines: ["filoloji", "arkeoloji", "epigrafi"],
  popular_claim: "Yazı destanları, duaları ve kutsal metinleri kaydetmek için icat edildi.",
  divergence:
    "En erken tabletlerde tanrı, kral övgüsü veya anlatı yok; miktar, mal ve sorumlu kişi adı var. İçerik dağılımı sayılabilir bir olgudur ve yayımlanmış külliyat açıktır. Alanın standart çözümlemesi bunu daha da keskin söyler: en erken tabletlerin amacı DİLİ kaydetmek değil, sayısal bir sistemle yerel ekonominin yönetimini izlemekti.",
  divergence_type: ["kategori-hatasi", "guncellenmemis"],
  sources: [nissen],
  evidence: [
    ev(
      "Uruk IV tabletleri teslimat, sayım ve tayın kayıtlarıdır: arpa, bira, koyun, işçi payı.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "İdari metin türleri bölümü", "direct"),
      { id: "idari-kayit-turleri" },
    ),
    ev(
      "En erken sayı sistemi saydığı şeye göre değişir - tahıl ve hayvan için ayrı düzenler; soyut sayı fikri henüz yok.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "Sayı sistemleri çözümlemesi", "direct"),
      { id: "nesneye-bagli-sayi-sistemi" },
    ),
    ev(
      "Tabletlerin amacı dili kaydetmek değil, sayısal bir sistemle yerel ekonominin yönetimini izlemekti.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "Kitabın ana tezi", "direct"),
      { id: "amac-dil-degil-yonetim" },
    ),
    ev(
      "İlk edebî metinler (Şuruppak Öğütleri, Keş Tapınak İlahisi) ~MÖ 2600'e tarihlenir.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "Kronolojik çerçeve", "context"),
      { id: "ilk-edebi-metinler-2600" },
    ),
  ],
  counter_evidence: [
    ev(
      "'Ezici çoğunluk idari' ifadesi YAYIMLANMIŞ külliyata dayanır. Kazılmamış ve yayımlanmamış malzemenin dağılımı bilinmiyor; oran bir örneklem oranıdır.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "Külliyatın kapsamı", "counter"),
      { id: "yayimlanmis-kulliyat-siniri" },
    ),
    ev(
      "İdari tabletlerin daha iyi korunmuş olması da mümkündür: pişmiş kil arşivler yangınla sertleşir, başka ortamlardaki kayıtlar korunmaz. Dağılım kısmen hayatta kalma yanlılığı olabilir.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "Korunma koşulları", "context"),
      { id: "korunma-yanliligi" },
    ),
    ev(
      "Bu kaydın kaynağının TAM METNİ OKUNMADI; locator'lar bölüm düzeyinde, sayfa düzeyinde değil.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "Kayıt düzeyi sınırı", "context"),
      { id: "tam-metin-okunmadi" },
    ),
  ],
  open_questions: [
    "Yayımlanmamış Uruk külliyatının tür dağılımı yayımlanmışla aynı mı?",
  ],
  checked: CHECKED,
  used_in: ["sumer"],
  review: {
    status: "draft",
    notes: "Yer tutucu kaynak ('...literatürü') gerçek künyeyle değiştirildi. Boş olan counter_evidence dolduruldu - örneklem ve korunma yanlılığı işaretlendi.",
  },
});

/* --- 2) Uruk IV'ün dili --------------------------------------------- */

const urukDili = finding({
  id: "sumer-uruk-iv-dili",
  claim: "En eski Uruk IV tabletleri Sümerce yazılmıştır.",
  status: "unknown",
  confidence: "high",
  topic: ["sumer", "proto-civi-yazisi", "dil"],
  subject: {
    site: "Uruk",
    region: "Güney Mezopotamya",
    modern_country: "Irak",
    coordinates: { lat: 31.3225, lon: 45.6361 },
  },
  period: {
    earliest: -3300,
    latest: -3100,
    era_label: "Uruk IV",
    precision: "approximate",
    dating_method: ["stratigraphy", "paleography"],
  },
  disciplines: ["filoloji", "dilbilim", "epigrafi"],
  popular_claim: "Dünyanın en eski yazısı Sümerce'dir.",
  divergence:
    "Sistemin sonradan Sümerce yazmak için kullanıldığı kesin. Ama en erken tabletlerdeki işaretlerin SES DEĞERİ oturmamıştır ve metinlerin hangi dili kaydettiği doğrudan gösterilemez. Sorun kanıtın azlığı değil, KAYDIN TÜRÜ: sayı ve mal işaretlerinden oluşan bir muhasebe notu, hangi dilde düşünüldüğünü ele vermez.",
  divergence_type: ["kategori-hatasi"],
  sources: [nissen],
  evidence: [
    ev(
      "En erken tabletlerin işlevi dili kaydetmek değil, sayısal bir sistemle ekonomiyi izlemekti - yani metinler dil taşımak üzere tasarlanmamıştı.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "Kitabın ana tezi", "direct"),
      { id: "dil-tasimak-uzere-tasarlanmamis" },
    ),
  ],
  counter_evidence: [
    ev(
      "En erken işaretler büyük ölçüde resim-yazıdır; ses değeri sonradan gelişir.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "İşaret sistemi gelişimi", "counter"),
      { id: "resim-yazi-ses-degeri-sonra" },
    ),
    ev(
      "İdari listelerde dilbilgisi işaretleyicisi neredeyse yok - dil tespiti için gereken yapı bulunmuyor.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "Metin yapısı çözümlemesi", "counter"),
      { id: "dilbilgisi-isaretleyicisi-yok" },
    ),
    ev(
      "Bu kayıt 'Sümerce DEĞİLDİR' demiyor; 'gösterilemez' diyor. Sonraki dönemde sistemin Sümerce yazdığı kesin olduğuna göre sürekliliğin Sümerce olması makul bir olasılıktır - ama olasılık kanıt değildir.",
      cite("nissen-damerow-englund-1993-archaic-bookkeeping", "Süreklilik tartışması", "context"),
      { id: "sumerce-degil-demiyoruz" },
    ),
  ],
  open_questions: ["Uruk IV metinlerinin dili belirlenebilir mi?"],
  checked: CHECKED,
  used_in: ["sumer"],
  review: {
    status: "draft",
    notes: "Kayıt hiç evidence taşımıyordu - yalnızca karşı kanıtla duruyordu. Kaynağın ana tezi doğrudan kanıt olarak bağlandı.",
  },
});

/* --- 3) Enheduanna'nın yazarlığı ------------------------------------ */

const enheduanna = finding({
  id: "sumer-enheduanna-yazarligi",
  claim:
    "Enheduanna kendisine atfedilen ilahileri gerçekten yazmıştır ve tarihte adı bilinen ilk yazardır.",
  status: "contested",
  confidence: "high",
  topic: ["sumer", "enheduanna", "yazarlik", "atif-tartismasi"],
  subject: {
    site: "Ur",
    region: "Güney Mezopotamya",
    modern_country: "Irak",
    coordinates: { lat: 30.9626, lon: 46.1031 },
  },
  period: {
    earliest: -2285,
    latest: -2250,
    era_label: "Akad, Sargon dönemi",
    precision: "approximate",
    dating_method: ["epigraphic", "historical-record"],
  },
  languages: ["Sümerce", "Akadca"],
  disciplines: ["filoloji", "arkeoloji", "sanat-tarihi"],
  people: [
    { name: "Enheduanna", role: "proposer", affiliation: "Ur, Nanna tapınağı en-rahibesi", year: -2285 },
    { name: "Helle, Sophus", role: "editor", year: 2023 },
  ],
  popular_claim: "Enheduanna tarihte adı bilinen ilk yazardır ve eserleri elimizdedir.",
  divergence:
    "Varlığı ve makamı sağlam: Ur'da bulunan kalker disk onu Sargon'un kızı ve Nanna'nın en-rahibesi olarak adlandırıyor ve çağdaştır. Ama ilahilerin ELİMİZDEKİ NÜSHALARI yaklaşık 500 yıl sonrasına (Eski Babil dönemi) aittir ve yazarlık atfı uzmanlar arasında tartışmalıdır. İfade bir atıf geleneğine dayanıyor, imzalı bir elyazmasına değil. ÜÇÜNCÜ BİR KONUM DA VAR: sorunun kendisinin çağdışı olduğu - metinlerin tek bir kişiye bağlanması, kolektif üretilen bir geleneğe modern bir yazarlık kalıbı giydirmek olabilir.",
  divergence_type: ["guncellenmemis", "medya-abartisi"],
  sources: [enheduannaDiski, helle],
  evidence: [
    ev(
      "Enheduanna Diski çağdaş bir buluntudur ve onu adıyla, unvanıyla ve babasıyla tanımlar.",
      cite("enheduanna-diski", "Adak yazıtı", "direct"),
      { id: "disk-cagdas-buluntu" },
    ),
    ev(
      "Nin-me-şara (İnanna'nın Yüceltilmesi) ve Tapınak İlahileri geleneksel olarak ona atfedilir.",
      cite("helle-2023-enheduana", "Şiirlerin derlemi ve atıf geleneği", "claim-origin"),
      { id: "atfedilen-eserler" },
    ),
    ev(
      "Metinlerde birinci tekil şahıs anlatıcı ve kişisel bir ses var.",
      cite("helle-2023-enheduana", "Metin çevirileri", "direct"),
      { id: "birinci-tekil-anlatici" },
    ),
  ],
  counter_evidence: [
    ev(
      "Bilinen nüshaların hiçbiri çağdaş değil; hepsi ~500 yıl sonrasına, Eski Babil dönemine ait.",
      cite("helle-2023-enheduana", "Nüsha tarihlemesi", "counter"),
      { id: "nushalar-500-yil-sonra" },
    ),
    ev(
      "Mezopotamya'da geç dönem atıfları yaygın bir gelenektir; bir metni ünlü bir figüre bağlamak sık görülür. Alandan somut itiraz: 'Kâtipler neden geriye bakıp bir başrahibeyi seçsin? Çok sayıda başrahibe vardı. Neden o?'",
      cite("helle-2023-enheduana", "Yazarlık tartışmasının değerlendirmesi", "counter"),
      { id: "gec-donem-atif-gelenegi" },
    ),
    ev(
      "Birinci tekil anlatıcı, yazarın kendisi olmayabilir - edebî bir kişileştirme de olabilir.",
      cite("helle-2023-enheduana", "Anlatıcı sesi tartışması", "counter"),
      { id: "anlatici-kisilestirme-olabilir" },
    ),
    ev(
      "Helle'nin kendi konumu ikisinden de farklı: yazarlık tartışmasını hem dikkat dağıtıcı hem çağdışı buluyor. Yazarlığın 'çok iplikli bir dokuma' olduğunu, kişi ile metin arasında birebir karşılık aramanın meseleyi kaçırdığını savunuyor.",
      cite("helle-2023-enheduana", "Yazarlık kavramı tartışması", "context"),
      { id: "helle-ucuncu-konum" },
    ),
    ev(
      "Bu kaydın kaynağının TAM METNİ OKUNMADI ve ISBN'i doğrulanamadı; künye iki bağımsız aramayla teyit edildi.",
      cite("helle-2023-enheduana", "Kayıt düzeyi sınırı", "context"),
      { id: "kunye-siniri" },
    ),
  ],
  open_questions: [
    "Atıf tartışması yeni bir buluntu olmadan kapanabilir mi?",
    "'İlk yazar' sorusu, yazarlık kavramının kendisi bu döneme uymuyorsa anlamlı mı?",
  ],
  checked: CHECKED,
  used_in: ["sumer"],
  review: {
    status: "draft",
    notes: "Yer tutucu kaynak ('Enheduanna atfı üzerine Asirbilim tartışması') Helle 2023 ile değiştirildi. Helle'nin üçüncü konumu kayda eklendi - önceki sürümde tartışma yalnızca iki taraflı görünüyordu.",
  },
});

/* --- 4) Ur-Nammu tazminat ------------------------------------------- */

const urNammu = finding({
  id: "sumer-ur-nammu-tazminat",
  claim:
    "Bilinen en eski yasa derlemesi olan Ur-Nammu Yasaları bedensel zararlara tazminat öngörür; misilleme ilkesi ('göze göz') daha sonra gelir.",
  status: "established",
  confidence: "high",
  topic: ["sumer", "hukuk-tarihi", "ur-nammu"],
  subject: {
    site: "Nippur ve Ur tabletleri",
    region: "Güney Mezopotamya",
    modern_country: "Irak",
    coordinates: { lat: 32.126, lon: 45.234 },
  },
  period: {
    earliest: -2100,
    latest: -2050,
    era_label: "Ur III",
    precision: "approximate",
    dating_method: ["paleography", "textual"],
  },
  languages: ["Sümerce"],
  disciplines: ["filoloji", "hukuk", "tarih"],
  people: [
    { name: "Kramer, Samuel Noah", role: "editor", affiliation: "University of Pennsylvania", year: 1952, lifespan: "1897-1990" },
    { name: "Kraus, F. R.", role: "excavator", affiliation: "İstanbul Arkeoloji Müzeleri", year: 1952 },
  ],
  popular_claim: "En eski hukuk 'göze göz, dişe diş' ilkesine dayanıyordu ve zamanla yumuşadı.",
  divergence:
    "Tam tersi. Daha eski olan Ur-Nammu gümüş tazminat öngörür; misilleme ilkesi ~300 yıl SONRAKİ Hammurabi'de belirir. Hukuk tarihinin 'sertten yumuşağa' doğru ilerlediği varsayımı bu örnekte tutmuyor. AMA ELDEKİ METİN ÇOK KÜÇÜK: nüshanın korunma durumu yüzünden yalnızca uzun önsöz ve BEŞ madde okunabilmiştir. Yani 'derleme tazminat esaslıdır' hükmü beş maddeden çıkarılan bir genellemedir.",
  divergence_type: ["guncellenmemis", "kategori-hatasi"],
  sources: [kramer, istanbulMuze],
  evidence: [
    ev(
      "Maddeler bedensel zarar için gümüş tartılarak ödenen tazminat belirler.",
      cite("kramer-1952-ur-nammu-yasalari", "Okunabilen maddeler", "direct"),
      { id: "gumus-tazminat" },
    ),
    ev(
      "Metin 1952'de Nippur tabletinden yayımlandı; tablet İstanbul Arkeoloji Müzeleri'nin Nippur koleksiyonunda Ni 3191 numarasıyla kayıtlıdır.",
      cite("istanbul-arkeoloji-nippur-ni3191", "Nesne kaydı", "direct"),
      { id: "ni3191-istanbulda" },
    ),
    ev(
      "Tableti, müzede kurator olan F. R. Kraus iki parçayı birleştirerek tanımlamış; Kramer bunu Kraus'un mektubuyla öğrenip incelemiştir.",
      cite("kramer-1952-ur-nammu-yasalari", "Yayının buluntu tarihçesi", "context"),
      { id: "kraus-birlestirmesi" },
    ),
  ],
  counter_evidence: [
    ev(
      "Metin parçalıdır: korunma durumu yüzünden yalnızca uzun önsöz ve BEŞ madde okunabilmiştir. Genelleme bu kadar dar bir tabana dayanıyor.",
      cite("kramer-1952-ur-nammu-yasalari", "Korunma durumu", "counter"),
      { id: "yalnizca-bes-madde" },
    ),
    ev(
      "Yasanın Ur-Nammu'ya mı oğlu Şulgi'ye mi ait olduğu kesin değildir.",
      cite("kramer-1952-ur-nammu-yasalari", "Atıf tartışması", "counter"),
      { id: "ur-nammu-mu-sulgi-mi" },
    ),
    ev(
      "Bu metinlerin fiilen uygulanan hukuk mu yoksa ideal bir derleme mi olduğu genel olarak tartışmalıdır.",
      cite("kramer-1952-ur-nammu-yasalari", "Metin türü tartışması", "counter"),
      { id: "uygulanan-hukuk-mu" },
    ),
    ev(
      "Hammurabi karşılaştırması bu kayıtta AYRI BİR KAYNAKLA desteklenmiyor; Hammurabi Yasaları'nın misilleme öngördüğü genel bilgi olarak alınmıştır.",
      cite("kramer-1952-ur-nammu-yasalari", "Kayıt düzeyi sınırı", "context"),
      { id: "hammurabi-kaynaksiz" },
    ),
    ev(
      "İstanbul Arkeoloji Müzeleri'nin çevrimiçi nesne kaydı bu turda DOĞRULANMADI; Ni 3191 künyesi ikincil aktarımlara dayanıyor.",
      cite("istanbul-arkeoloji-nippur-ni3191", "Kayıt düzeyi sınırı", "context"),
      { id: "muze-kaydi-dogrulanmadi" },
    ),
  ],
  open_questions: [
    "Beş maddeden derlemenin bütününe genelleme ne kadar güvenli?",
    "Ni 3191'in müze kaydı ve güncel durumu nedir? Kurumun çevrimiçi kataloğu taranmalı.",
  ],
  checked: CHECKED,
  used_in: ["sumer"],
  review: {
    status: "draft",
    notes:
      "Tabletin İstanbul Arkeoloji Müzeleri'nde olduğu ve Kraus tarafından tanımlandığı eklendi - kayıt bunu hiç söylemiyordu. 'Yalnızca beş madde okunabildi' sınırı da eklendi; iddianın dayanağı bu kadar dardı ve kayıt bunu göstermiyordu.",
  },
});

/* --- 5) Kral Listesi tarihsel değil --------------------------------- */

const kralListesi = finding({
  id: "sumer-kral-listesi-tarihsel-degil",
  claim:
    "Sümer Kral Listesi tarihsel bir kayıt değil, tek ve devredilen krallık fikrini savunan siyasi bir meşruiyet belgesidir.",
  status: "established",
  confidence: "high",
  topic: ["sumer", "kral-listesi", "kaynak-elestirisi"],
  subject: {
    site: "Weld-Blundell Prizması",
    region: "Güney Mezopotamya",
    modern_country: "Irak",
  },
  period: {
    earliest: -1900,
    latest: -1700,
    era_label: "Eski Babil (nüshalar)",
    precision: "approximate",
    dating_method: ["paleography"],
  },
  languages: ["Sümerce"],
  disciplines: ["filoloji", "tarih"],
  people: [{ name: "Jacobsen, Thorkild", role: "editor", year: 1939 }],
  popular_claim: "Sümer Kral Listesi tufan öncesinde on binlerce yıl süren saltanatlar kaydeder.",
  divergence:
    "Liste eşzamanlı hanedanları ardışıkmış gibi sıralar ve tufan öncesi saltanatlara sembolik rakamlar verir. Takvim olarak kullanılamaz; türü yanlış anlaşılıyor. Belge bir kronoloji değil, BİR TEZ savunuyor: krallık tektir ve sırayla şehirden şehre geçer.",
  divergence_type: ["kategori-hatasi", "ideolojik-secim"],
  sources: [jacobsen, weldBlundell],
  evidence: [
    ev(
      "Metnin tezi açık: krallık tektir ve sırayla şehirden şehre geçer.",
      cite("weld-blundell-prizmasi-wb444", "Metnin yapısı ve geçiş formülleri", "direct"),
      { id: "tek-krallik-tezi" },
    ),
    ev(
      "Bağımsız kaynaklardan eşzamanlı oldukları bilinen hanedanlar listede ardışık gösterilir.",
      cite("jacobsen-1939-sumerian-king-list", "Giriş çözümlemesi", "direct"),
      { id: "eszamanli-hanedanlar-ardisik" },
    ),
    ev(
      "Tufan öncesi saltanat süreleri on binlerce yıla ulaşır.",
      cite("weld-blundell-prizmasi-wb444", "Tufan öncesi hükümdarlar bölümü", "direct"),
      { id: "tufan-oncesi-saltanatlar" },
    ),
    ev(
      "Prizma tufan öncesi hükümdarlarla başlar ve İsin hanedanından Suen-magir ile biter - yani anlatı, yazıldığı dönemin hanedanına kadar getirilir.",
      cite("weld-blundell-prizmasi-wb444", "Metnin başı ve sonu", "direct"),
      { id: "isin-hanedaninda-bitiyor" },
    ),
  ],
  counter_evidence: [
    ev(
      "'Tarihsel değil' fazla keskin olabilir: liste geç dönem hanedanlar için bağımsız kaynaklarla örtüşen bilgi de taşır. Sorun türünün kronoloji sanılmasıdır, içinde hiç tarihsel bilgi olmaması değil.",
      cite("jacobsen-1939-sumerian-king-list", "Kaynak değeri tartışması", "counter"),
      { id: "tamamen-tarihsel-degil-degil" },
    ),
    ev(
      "WB 444 en tam nüshadır ama tek nüsha değildir; yaklaşık 25 kadar başka nüsha ve parça bilinir ve aralarında farklar vardır.",
      cite("weld-blundell-prizmasi-wb444", "Nüsha durumu", "context"),
      { id: "yirmi-bes-nusha" },
    ),
    ev(
      "Jacobsen'in edisyonu 1939 tarihlidir; sonraki seksen yılda yayımlanan nüshalar bu kayıtta taranmadı.",
      cite("jacobsen-1939-sumerian-king-list", "Kayıt düzeyi sınırı", "context"),
      { id: "1939-sonrasi-taranmadi" },
    ),
  ],
  open_questions: [
    "Nüshalar arası farklar 'tek krallık' tezini ne kadar tutarlı taşıyor?",
    "1939'dan sonraki yayınlar Jacobsen'in çözümlemesini değiştirdi mi?",
  ],
  checked: CHECKED,
  used_in: ["sumer"],
  review: {
    status: "draft",
    notes: "Yer tutucu yerine Jacobsen 1939 ve WB 444 künyelendi. Boş counter_evidence dolduruldu; 'tarihsel değil' ifadesinin fazla keskin olabileceği eklendi.",
  },
});

/* --- 6) Ur hizmetlilerinin ölüm biçimi ------------------------------ */

const urOlum = finding({
  id: "sumer-ur-hizmetliler-olum-bicimi",
  claim: "Ur Kral Mezarlığı'ndaki hizmetliler gönüllü olarak zehir içip öldü.",
  status: "refuted",
  confidence: "medium",
  topic: ["sumer", "ur", "yorum-duzeltmesi"],
  subject: {
    site: "Ur Kral Mezarlığı",
    region: "Güney Mezopotamya",
    modern_country: "Irak",
    coordinates: { lat: 30.9626, lon: 46.1031 },
  },
  period: {
    earliest: -2600,
    latest: -2450,
    era_label: "Erken Hanedanlar III",
    precision: "range",
    dating_method: ["stratigraphy", "radiocarbon"],
  },
  disciplines: ["arkeoloji", "antropoloji"],
  people: [
    { name: "Woolley, Leonard", role: "excavator", affiliation: "British Museum / Penn Museum", year: 1922, lifespan: "1880-1960" },
    { name: "Baadsgaard, Aubrey", role: "critic", affiliation: "University of Pennsylvania", year: 2011 },
  ],
  popular_claim:
    "Maiyet efendisiyle birlikte gömülmek için gönüllü olarak zehir içti; ölüm sakin ve törenseldi.",
  divergence:
    "Woolley'in yorumu 1920'lerin imkânlarıyla makuldü - iskeletleri açmadan içeriden görüntüleme yoktu. Tomografi taramaları ölüm anına yakın künt travma kırıkları gösterdi; hizmetliler büyük olasılıkla öldürüldü. Çalışma ayrıca cesetlerin ısıtılıp cıvayla muhafaza edildiğini, giydirilip sıralar hâlinde yatırıldığını öne sürüyor - yani sahnedeki düzen ölüm anının sakinliğinden değil, SONRADAN YAPILAN DÜZENLEMEDEN geliyor.",
  divergence_type: ["guncellenmemis"],
  sources: [woolley, baadsgaard],
  evidence: [
    ev(
      "Ana mezarların yanında çok sayıda hizmetli gömüsü bulundu.",
      cite("woolley-1934-ur-kral-mezarligi", "Kral Mezarlığı gömü planları", "direct"),
      { id: "coklu-hizmetli-gomusu" },
    ),
    ev(
      "Popüler anlatının kaynağı kazı raporunun kendisidir: sahnenin sakinliği, gönüllü ve zehirle ölüm yorumunu doğurdu.",
      cite("woolley-1934-ur-kral-mezarligi", "Yorum bölümü", "claim-origin"),
      { id: "yorumun-kaynagi-woolley" },
    ),
  ],
  counter_evidence: [
    ev(
      "Tomografi taramaları ölüm anına yakın (perimortem) künt travma kırıkları gösterdi; kurbanların keskin bir aletle indirildiği öne sürülüyor.",
      cite("baadsgaard-2011-ur-insan-kurbani", "Tomografi bulguları", "counter"),
      { id: "perimortem-kunt-travma" },
    ),
    ev(
      "Cesetlerin ısıtılıp cıvayla muhafaza edildiği, giydirilip sıralar hâlinde yatırıldığı öne sürülüyor - sahnedeki düzen sonradan yapılmış olabilir.",
      cite("baadsgaard-2011-ur-insan-kurbani", "Ceset işleme çözümlemesi", "counter"),
      { id: "civayla-muhafaza" },
    ),
    ev(
      "Bulgu YALNIZCA İKİ kafatasından geliyor; bütün mezarlığa genelleme yapılamaz. Bu kaydın 'refuted' durumu da bu iki kafataslık tabana dayanıyor - yani çürütmenin kendisi de dar.",
      cite("baadsgaard-2011-ur-insan-kurbani", "Örneklem büyüklüğü", "counter"),
      { id: "yalnizca-iki-kafatasi" },
    ),
  ],
  open_questions: [
    "Daha çok iskelet taranırsa sonuç genellenebilir mi?",
    "İki kafataslık örneklem 'refuted' demek için yeterli mi, yoksa 'contested' mi daha doğru?",
  ],
  checked: CHECKED,
  used_in: ["sumer"],
  review: {
    status: "draft",
    notes:
      "Yer tutucu ('Ur kafataslarında tomografi çalışması') gerçek künyeyle değiştirildi: Baadsgaard vd. 2011, Antiquity, DOI canlı kontrol edildi. Örneklem darlığının çürütmenin KENDİSİNİ de sınırladığı açıkça yazıldı ve açık soruya taşındı.",
  },
});

/* --- 7) Sümerce Gılgamış'ta tufan yok ------------------------------- */

const gilgamis = finding({
  id: "sumer-gilgamis-sumerce-tufan-yok",
  claim: "Sümerce Gılgamış şiirlerinde tufan anlatısı yoktur; tufan destana Akadca gelenekten girer.",
  status: "established",
  confidence: "high",
  topic: ["sumer", "gilgamis", "tufan", "metin-elestirisi"],
  subject: { region: "Güney Mezopotamya", modern_country: "Irak" },
  period: {
    earliest: -2100,
    latest: -1200,
    era_label: "Ur III / Eski Babil nüshalardan Standart Babil sürümüne",
    precision: "range",
    dating_method: ["paleography", "textual"],
  },
  languages: ["Sümerce", "Akadca"],
  disciplines: ["filoloji", "metin-elestirisi"],
  people: [{ name: "George, Andrew R.", role: "editor", affiliation: "SOAS, University of London", year: 2003 }],
  popular_claim: "Gılgamış Destanı Sümer eseridir ve tufan anlatısını içerir.",
  divergence:
    "Sümerce gelenek beş ayrı, bağımsız ve kısa şiirden oluşur - bütünlüklü bir destan değil. Bilinen Gılgamış Destanı bir AKAD eseridir ve tufan bölümü Atrahasis geleneğinden gelir. 'Sümer destanı' ifadesi iki ayrı geleneği tek esere indirgiyor.",
  divergence_type: ["kategori-hatasi", "guncellenmemis"],
  sources: [george],
  evidence: [
    ev(
      "Sümerce şiirler ayrı ayrı korunmuştur: Gılgamış ve Huvava, Gılgamış ve Gök Boğası, Gılgamış'ın Ölümü ve diğerleri.",
      cite("george-2003-babylonian-gilgamesh", "Giriş: Sümerce şiirler bölümü", "direct"),
      { id: "sumerce-siirler-ayri" },
    ),
    ev(
      "Standart Babil sürümü çok daha geç derlenmiş ve bütünlenmiştir.",
      cite("george-2003-babylonian-gilgamesh", "Giriş: metnin oluşum tarihi", "direct"),
      { id: "standart-babil-gec-derleme" },
    ),
    ev(
      "Tufan bölümü Atrahasis anlatısıyla doğrudan ilişkilidir.",
      cite("george-2003-babylonian-gilgamesh", "Tufan bölümü çözümlemesi", "direct"),
      { id: "tufan-atrahasis-baglantisi" },
    ),
  ],
  counter_evidence: [
    ev(
      "'Sümerce gelenekte tufan yok' ifadesi ELİMİZDEKİ metinler için geçerlidir. Sümerce bir tufan anlatısı ayrıca vardır (Ziusudra); söylenen şey, GILGAMIŞ şiirlerinde bulunmadığıdır - bu iki cümle karıştırılmamalı.",
      cite("george-2003-babylonian-gilgamesh", "Gelenekler arası ilişki", "counter"),
      { id: "ziusudra-ayrimi" },
    ),
    ev(
      "Bu kaydın kaynağının tam metni okunmadı; George'un edisyonu iki cilt ve yaklaşık bin sayfadır, locator'lar bölüm düzeyindedir.",
      cite("george-2003-babylonian-gilgamesh", "Kayıt düzeyi sınırı", "context"),
      { id: "tam-metin-okunmadi-george" },
    ),
  ],
  open_questions: [
    "Sümerce Ziusudra anlatısı ile Akadca Atrahasis arasındaki aktarım nasıl işledi?",
  ],
  checked: CHECKED,
  used_in: ["sumer", "tufan-bilmecesi"],
  review: {
    status: "draft",
    notes:
      "George künyesi yayıncı ve ISBN ile tamamlandı. Boş olan counter_evidence dolduruldu: Ziusudra ayrımı eklendi - kayıt 'Sümerce gelenekte tufan yok' gibi okunabiliyordu, oysa söylenen yalnızca Gılgamış şiirleri için geçerli.",
  },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
const yeni = [yaziMuhasebe, urukDili, enheduanna, urNammu, kralListesi, urOlum, gilgamis];
for (const r of yeni) {
  const i = list.findIndex((x) => x.id === r.id);
  if (i === -1) { console.error("bulunamadı:", r.id); process.exit(1); }
  const onceki = list[i].schema_version ?? 1;
  list[i] = r;
  console.log(`  v${onceki} -> v2  ${r.id}`);
}
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
const v2 = list.filter((r) => r.schema_version === 2).length;
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${v2}`);
console.log(`v1 kalan (yer tutucu kaynaklı, bilerek bırakıldı): ${list.filter((r) => (r.schema_version ?? 1) === 1).map((r) => r.id).join(", ")}`);
