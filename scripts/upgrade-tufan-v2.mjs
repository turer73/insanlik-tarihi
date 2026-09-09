#!/usr/bin/env node
// Tufan dosyası: 10 kaydın tamamı v2'ye.
//
// DEEPSEEK TURUNUN BOŞ BIRAKTIĞI TEK KAYIT: tufan-ur-katmani-tek-olay-degil
// için doğrulanmış aday gelmedi. Ayrıca arandı ve alanın klasik yeniden
// değerlendirmesi bulundu: Mallowan, "Noah's Flood Reconsidered", Iraq
// 26(2), 1964, s. 62-82. Kaydın iddiasını doğrudan taşıyor - Kiş'te üçü
// belgelenen, farklı tarihlerde, yerel taşkınlar.
//
// TIER DÜZELTMESİ - önceki sürümün kendi kuralına aykırıydı:
// Frazer'ın "Folk-Lore in the Old Testament" (1918) kaydı "unreliable"
// olarak işaretlenmişti. README'nin tanımına göre unreliable =
// "turizm/içerik sitesi". Frazer bu değil; dönemin ciddi bir karşılaştırmalı
// folklor çalışmasıdır, bugün yöntemi aşılmıştır. "popular" yapıldı ve
// rolü açıkça claim-origin olarak işaretlendi: bu kayıtta kanıt değil,
// "bütün uygarlıklarda tufan vardır" iddiasının KAYNAĞI olarak duruyor.
//
// ALTI KAYITTA popular_claim VE divergence BOŞTU: misirda-yok,
// kus-testi-bagimlilik-kaniti, atrahasis-sebep-gurultu, karadeniz,
// manu-bagimsizligi, avustralya. Altısı da yazıldı.
//
// MANU KAYDINDA DÜRÜSTLÜK NOTU: DeepSeek Lambert 1965'i (Journal of
// Theological Studies) önerdi ve DOI doğrulandı - ama makale Tekvin'in
// Babil arka planı üzerine, Manu-Mezopotamya ilişkisi üzerine değil.
// Kaynak bağlam olarak alındı, iddianın doğrudan dayanağı olarak değil;
// bu ayrım kayda yazıldı. Manu'nun bağımsızlığını doğrudan ele alan bir
// çalışma bu turda bulunamadı.
//
// SINIR: hiçbir kaynağın tam metni okunmadı. Lambert & Millard'ın Atrahasis
// edisyonu ile Hornung'un Gök İneği edisyonunun tam künyeleri (yayıncı,
// ISBN) bu turda doğrulanmadı; ikisi de primary/edition olarak künyelendi
// ve eksiklik kaynak notlarında yazılı.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/tufan.json";
const CHECKED = "2026-09-09";
const mak = (id, o) => source(id, { language: "en", accessed: CHECKED, ...o });

/* --- kaynaklar ----------------------------------------------------- */

const dalley = mak("dalley-1989-myths-from-mesopotamia", {
  tier: "peer-reviewed", type: "book",
  authors: ["Dalley, Stephanie"], year: 1989,
  title: "Myths from Mesopotamia: Creation, the Flood, Gilgamesh and Others",
  publisher: "Oxford University Press", isbn: "9780199538362",
  note: "Mezopotamya tufan metinlerinin standart İngilizce çevirisi ve girişleri.",
});

const frazer = mak("frazer-1918-folklore-old-testament", {
  tier: "popular", type: "book",
  authors: ["Frazer, James George"], year: 1918,
  title: "Folk-Lore in the Old Testament",
  note:
    "'Bütün uygarlıklarda tufan vardır' iddiasının derleyici kaynağı. Bu kayıtta KANIT DEĞİL, iddianın KÖKENİ olarak duruyor. " +
    "TIER DÜZELTİLDİ: önceki sürümde 'unreliable' yazıyordu; README'ye göre o katman turizm/içerik siteleri için. " +
    "Frazer dönemin ciddi bir karşılaştırmalı folklor çalışmasıdır, yöntemi bugün aşılmıştır - 'popular' doğru karşılığı.",
});

const assmann = mak("assmann-2001-search-for-god", {
  tier: "peer-reviewed", type: "book",
  authors: ["Assmann, Jan"], year: 2001,
  title: "The Search for God in Ancient Egypt",
  publisher: "Cornell University Press", isbn: "9780801487293",
  note: "Mısır dininin kapsamlı incelemesi; tufan anlatısının YOKLUĞU bu tür bir külliyat taramasıyla söylenebilir.",
});

const lichtheim = mak("lichtheim-1976-ancient-egyptian-literature", {
  tier: "peer-reviewed", type: "book",
  authors: ["Lichtheim, Miriam"], year: 1976,
  title: "Ancient Egyptian Literature: A Book of Readings",
  publisher: "University of California Press", isbn: "9780520036154",
  note: "Mısır edebiyatının standart antolojisi; negatif iddianın dayandığı külliyat.",
});

const hornung = mak("hornung-1982-gok-inegi", {
  tier: "primary", type: "edition",
  authors: ["Hornung, Erik"], year: 1982,
  title: "Der ägyptische Mythos von der Himmelskuh", language: "de",
  note: "Gök İneği Kitabı'nın edisyonu - 'İnsanlığın Yok Edilişi' metni burada. YAYINCI VE ISBN BU TURDA DOĞRULANMADI, uydurulmadı.",
});

const lewis = mak("lewis-2006-flood-myths-early-china", {
  tier: "peer-reviewed", type: "book",
  authors: ["Lewis, Mark Edward"], year: 2006,
  title: "The Flood Myths of Early China",
  publisher: "State University of New York Press", isbn: "9780791466636",
  note: "Çin tufan anlatılarının standart incelemesi; yapısal farkın çözümlemesi buradan geliyor.",
});

const birrell = mak("birrell-1993-chinese-mythology", {
  tier: "peer-reviewed", type: "book",
  authors: ["Birrell, Anne"], year: 1993,
  title: "Chinese Mythology: An Introduction",
  publisher: "Johns Hopkins University Press", isbn: "9780801845956",
  note: "Çin mitolojisinin kaynak temelli girişi; Gun-Yu döngüsünün metinleri.",
});

const george = mak("george-2003-babylonian-gilgamesh", {
  tier: "primary", type: "edition",
  authors: ["George, Andrew R."], year: 2003,
  title: "The Babylonian Gilgamesh Epic: Introduction, Critical Edition and Cuneiform Texts",
  publisher: "Oxford University Press", isbn: "9780198149224", volume: "2 cilt",
  note: "XI. tabletin eleştirel edisyonu. Bu kayıtta METNİN NE DEDİĞİ için kullanılıyor - bu yüzden primary.",
});

const tigay = mak("tigay-1982-evolution-gilgamesh", {
  tier: "peer-reviewed", type: "book",
  authors: ["Tigay, Jeffrey H."], year: 1982,
  title: "The Evolution of the Gilgamesh Epic",
  publisher: "University of Pennsylvania Press", isbn: "9780812278057",
  note: "Destanın metinsel gelişiminin standart incelemesi; bağımlılık savının yöntemsel dayanağı.",
});

const wenham = mak("wenham-1987-genesis-1-15", {
  tier: "peer-reviewed", type: "book",
  authors: ["Wenham, Gordon J."], year: 1987,
  title: "Genesis 1-15",
  container: "Word Biblical Commentary", publisher: "Word Books", isbn: "9780849902000",
  note: "Tekvin tufan anlatısının ayrıntılı yorumu; kuş sırasındaki farkın değerlendirmesi.",
});

const lambertMillard = mak("lambert-millard-1969-atrahasis", {
  tier: "primary", type: "edition",
  authors: ["Lambert, Wilfred G.", "Millard, Alan R."], year: 1969,
  title: "Atra-hasis: The Babylonian Story of the Flood",
  publisher: "Clarendon Press",
  note: "Atrahasis'in standart edisyonu ve çevirisi. ISBN BU TURDA DOĞRULANAMADI, uydurulmadı.",
});

const atrahasisMetin = mak("atrahasis-i-tablet", {
  tier: "primary", type: "inscription",
  title: "Atrahasis, I. tablet", language: "akk",
  note: "Gürültü gerekçesinin geçtiği metin.",
});

const tedlock = mak("tedlock-1996-popol-vuh", {
  tier: "peer-reviewed", type: "book",
  authors: ["Tedlock, Dennis"], year: 1996,
  title: "Popol Vuh: The Mayan Book of the Dawn of Life",
  publisher: "Simon & Schuster", isbn: "9780684818450",
  note:
    "Antropolog Tedlock'un eleştirel çevirisi; akademik standart çeviri sayılır. " +
    "Ticari bir yayınevinden çıkmış olması onu popülerleştirme yapmaz - metin bir bilim insanının kaynak temelli çevirisidir. " +
    "(Karşılaştırma: aynı ölçütle Allen vd. 1986 'popular' işaretlenmişti çünkü o bir popülerleştirmedir.)",
});

const mallowan = mak("mallowan-1964-noahs-flood-reconsidered", {
  tier: "peer-reviewed", type: "article",
  authors: ["Mallowan, M. E. L."], year: 1964,
  title: "Noah's Flood Reconsidered",
  container: "Iraq", volume: "26(2)", pages: "62-82",
  publisher: "British Institute for the Study of Iraq",
  doi: "10.2307/4199766",
  note:
    "Woolley'in duyurusunun alan içindeki yeniden değerlendirmesi. Kiş'te üç ayrı taşkın belgeler; en geç ve en şiddetlisi ~MÖ 2600. " +
    "Sonuç: Mezopotamya tufan anlatısı gerçek ama YEREL bir felaketten esinlenmiştir. DeepSeek turunda bu kayda aday gelmemişti, ayrıca arandı.",
});

const woolleyUr = mak("woolley-1929-ur-tufan-katmani", {
  tier: "primary", type: "report",
  authors: ["Woolley, Leonard"], year: 1929,
  title: "Ur kazıları: alüvyon katmanı duyurusu",
  note: "Popüler anlatının KÖKENİ. Künye ayrıntıları (yayın adı, cilt) bu turda doğrulanmadı.",
});

const ryanPitman = mak("ryan-pitman-1999-noahs-flood", {
  tier: "popular", type: "book",
  authors: ["Ryan, William B. F.", "Pitman, Walter C."], year: 1999,
  title: "Noah's Flood: The New Scientific Discoveries About the Event That Changed History",
  publisher: "Simon & Schuster", isbn: "9780684810522",
  note:
    "Hipotezin POPÜLERLEŞTİRİLMİŞ sunumu. Özgün hakemli yayın 1997'dir ve bu kayıtta künyelenmedi - eksiklik açıkça işaretlendi. " +
    "Kitap burada iddianın kaynağı olarak kullanılıyor, kanıt olarak değil.",
});

const giosan = mak("giosan-2009-black-sea", {
  tier: "peer-reviewed", type: "article",
  authors: ["Giosan, Liviu", "Filip, Florin", "Constantinescu, Stefan"], year: 2009,
  title: "Was the Black Sea catastrophically flooded in the early Holocene?",
  container: "Quaternary Science Reviews",
  doi: "10.1016/j.quascirev.2008.10.012",
  note: "Felaket senaryosunu doğrudan sınayan çalışma; su seviyesi yükselişinin kademeli olduğu sonucunun dayanağı.",
});

const satapatha = mak("satapatha-brahmana-1-8-1", {
  tier: "primary", type: "manuscript",
  title: "Śatapatha Brāhmaṇa 1.8.1", language: "sa",
  note: "Manu ve balık anlatısının bilinen en eski metni.",
});

const lambert1965 = mak("lambert-1965-babylonian-background-genesis", {
  tier: "peer-reviewed", type: "article",
  authors: ["Lambert, Wilfred G."], year: 1965,
  title: "A New Look at the Babylonian Background of Genesis",
  container: "Journal of Theological Studies", volume: "XVI(2)", pages: "287-300",
  doi: "10.1093/jts/XVI.2.287",
  note:
    "DİKKAT: Makale TEKVİN'in Babil arka planı üzerinedir, Manu-Mezopotamya ilişkisi üzerine DEĞİL. " +
    "Bu kayıtta aktarım tartışmasının yöntemi için bağlam kaynağı olarak kullanılıyor, iddianın doğrudan dayanağı olarak değil.",
});

const nunnReid = mak("nunn-reid-2016-aboriginal-memories", {
  tier: "peer-reviewed", type: "article",
  authors: ["Nunn, Patrick D.", "Reid, Nicholas J."], year: 2016,
  title: "Aboriginal Memories of Inundation of the Australian Coast Dating from More than 7000 Years Ago",
  container: "Australian Geographer",
  doi: "10.1080/00049182.2015.1077539",
  note: "İddianın kaynağı olan çalışma. Bu kayıtta doğrulayıcı değil, önerinin kendisi olarak kullanılıyor.",
});

/* --- kayıtlar ------------------------------------------------------- */

const evrenselDegil = finding({
  id: "tufan-evrensel-degil",
  claim: "Nuh tipi tufan anlatısı (yok edici, uyarılan kurtulan, gemi, kuş testi) evrensel değildir; Yakındoğu merkezli bir gelenektir.",
  status: "established", confidence: "high",
  topic: ["tufan", "karsilastirmali-mitoloji"],
  subject: { region: "küresel", modern_country: "çok uluslu" },
  period: { earliest: -1700, latest: 1918, era_label: "Metin geleneği ve modern derleme", precision: "range", dating_method: ["textual", "historical-record"] },
  languages: ["Akadca", "Sümerce", "İbranice"],
  disciplines: ["filoloji", "antropoloji", "metin-elestirisi"],
  people: [{ name: "Frazer, James George", role: "proposer", affiliation: "University of Cambridge", year: 1918, lifespan: "1854-1941" }],
  popular_claim: "Bütün antik uygarlıklarda tufan anlatısı vardır.",
  divergence:
    "İddia 19. yüzyılda misyoner derlemeleri ve karşılaştırmalı folklor çalışmalarıyla DERLENDİ. Bir anlatı aranırsa bulunur; belirsiz su anlatıları 'tufan miti' olarak sınıflandı. Derleyenlerin önemli kısmı din adamıydı ve Tekvin'in evrensel bir hatıraya dayandığını göstermek teolojik olarak değerliydi.",
  divergence_type: ["ideolojik-secim", "kategori-hatasi"],
  sources: [dalley, frazer, lewis, assmann],
  evidence: [
    ev("Mısır'da tufan miti yok.",
      cite("assmann-2001-search-for-god", "Mısır dini külliyatı taraması", "direct"), { id: "misirda-yok" }),
    ev("Çin'inki yapısal olarak farklı bir anlatı.",
      cite("lewis-2006-flood-myths-early-china", "Gun-Yu döngüsünün yapısı", "direct"), { id: "cin-yapisal-farkli" }),
    ev("Yakındoğu geleneği kendi içinde bağlantılıdır: Atrahasis, Gılgamış XI ve Tekvin aynı anlatı ailesidir.",
      cite("dalley-1989-myths-from-mesopotamia", "Tufan metinleri girişi", "direct"), { id: "yakindogu-ailesi" }),
    ev("Evrensellik iddiasının derleyici kaynağı belirlidir.",
      cite("frazer-1918-folklore-old-testament", "Tufan bölümü", "claim-origin"), { id: "frazer-derlemesi" }),
  ],
  counter_evidence: [
    ev("Japonya (Kojiki, Nihon Shoki) ve Sahra altı Afrika için 'yok' ve 'seyrek' ifadeleri bu kayıtta AYRI KAYNAKLARA BAĞLANMADI; iki bölge için külliyat taraması yapılmadı.",
      cite("frazer-1918-folklore-old-testament", "Kayıt düzeyi sınırı", "counter"), { id: "japonya-afrika-kaynaksiz" }),
    ev("'Evrensel değil' demek 'yalnızca Yakındoğu'da var' demek değildir; su felaketi anlatıları başka yerlerde de bulunur - iddia BELİRLİ BİR ANLATI KALIBININ evrensel olmadığıdır.",
      cite("dalley-1989-myths-from-mesopotamia", "Kayıt düzeyi ayrımı", "context"), { id: "kalip-ayrimi" }),
  ],
  open_questions: ["Japonya ve Sahra altı Afrika için külliyat taraması yapılmalı; şu an iddia dolaylı."],
  checked: CHECKED, used_in: ["tufan-bilmecesi"],
  review: { status: "draft", notes: "Frazer'ın tier'ı unreliable -> popular olarak DÜZELTİLDİ (README tanımına aykırıydı) ve rolü claim-origin olarak işaretlendi. Japonya/Afrika iddialarının kaynaksız olduğu açıkça yazıldı." },
});

const misirdaYok = finding({
  id: "tufan-misirda-yok",
  claim: "Mısır mitolojisinde insanlığı yok eden bir tufan anlatısı yoktur.",
  status: "established", confidence: "high",
  topic: ["tufan", "misir"],
  subject: { site: "Mısır külliyatı", region: "Nil Vadisi", modern_country: "Mısır" },
  period: { earliest: -2600, latest: -1100, era_label: "Eski - Yeni Krallık", precision: "range", dating_method: ["textual", "epigraphic"] },
  languages: ["Mısırca"],
  disciplines: ["filoloji", "tarih"],
  people: [{ name: "Hornung, Erik", role: "editor", affiliation: "Universität Basel", year: 1982, lifespan: "1933-2022" }],
  popular_claim: "Mısır'da da bir tufan anlatısı vardır; her nehir uygarlığında olmalı.",
  divergence:
    "YOK - ve yokluğu şaşırtıcı olan da bu: yıllık Nil taşkını kültürün merkezindeydi. En yakın metin 'İnsanlığın Yok Edilişi'dir ama orada araç SU DEĞİL, kırmızıya boyanmış biradır; üstelik insanlık boğularak değil, tanrıça sarhoş edilerek KURTARILIR. Yani anlatı ters yönde çalışıyor. Bir kültürün elinde malzeme olması, o anlatıyı üreteceği anlamına gelmiyor.",
  divergence_type: ["kategori-hatasi"],
  sources: [assmann, lichtheim, hornung],
  evidence: [
    ev("Üç bin yıllık devasa yazılı külliyatta böyle bir anlatı bulunmuyor.",
      cite("lichtheim-1976-ancient-egyptian-literature", "Antolojinin kapsamı", "direct"), { id: "kulliyatta-yok" }),
    ev("En yakın metin Gök İneği Kitabı'ndaki İnsanlığın Yok Edilişi - ama araç su değil, kırmızıya boyanmış bira; insanlık boğularak değil, tanrıça sarhoş edilerek KURTARILIYOR.",
      cite("hornung-1982-gok-inegi", "İnsanlığın Yok Edilişi bölümü", "direct"), { id: "gok-inegi-bira" }),
    ev("İlksel su kavramı (Nun) var ama bu kozmogoni; Tabut Metni'ndeki Atum ifadesi GELECEĞE dair, geçmişte yaşanmış bir tufana değil.",
      cite("assmann-2001-search-for-god", "Kozmogoni ve Nun", "direct"), { id: "nun-kozmogoni" }),
  ],
  counter_evidence: [
    ev("NEGATİF İDDİA KANITLANAMAZ, yalnızca desteklenebilir: 'yok' demek, taranmış külliyatta bulunmadığı demektir. Mısır külliyatı büyük ama eksiksiz değildir.",
      cite("lichtheim-1976-ancient-egyptian-literature", "Kayıt düzeyi sınırı", "counter"), { id: "negatif-iddia-siniri" }),
    ev("Yokluğun kültürel açıklaması net değil: Nil taşkını yıkıcı değil BEREKETLİ olduğu için mi, yoksa başka bir sebeple mi - bu kayıt cevap vermiyor.",
      cite("assmann-2001-search-for-god", "Açık uç", "context"), { id: "aciklama-net-degil" }),
  ],
  open_questions: ["Yıllık Nil taşkını kültürünün merkezinde olmasına rağmen neden yok - kültürel açıklama net değil."],
  checked: CHECKED, used_in: ["tufan-bilmecesi"],
  review: { status: "draft", notes: "Negatif iddianın kanıtlanamaz olduğu açıkça yazıldı. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu." },
});

const cinYapisi = finding({
  id: "tufan-cin-yapisi-ters",
  claim: "Çin'in Gun-Yu anlatısı yapısal olarak Nuh tipi tufan anlatısı değildir.",
  status: "established", confidence: "high",
  topic: ["tufan", "cin"],
  subject: { site: "Sarı Irmak havzası", region: "Kuzey Çin Ovası", modern_country: "Çin" },
  period: { earliest: -2000, latest: -300, era_label: "Efsanevi Xia - Savaşan Devletler (metin)", precision: "range", dating_method: ["textual"] },
  languages: ["Klasik Çince"],
  disciplines: ["filoloji", "antropoloji"],
  people: [{ name: "Lewis, Mark Edward", role: "analyst", affiliation: "Stanford University", year: 2006 }],
  popular_claim: "Çin'de de tufan miti vardır.",
  divergence: "Teknik olarak doğru, analitik olarak yanıltıcı. 'Tufan' etiketi yapısal farkı gizliyor.",
  divergence_type: ["kategori-hatasi"],
  sources: [lewis, birrell],
  evidence: [
    ev("Gemi yok, kanal var - Yu suyu dizginlemek yerine denize akıtıyor.",
      cite("lewis-2006-flood-myths-early-china", "Yu'nun su işleri", "direct"), { id: "gemi-yok-kanal-var" }),
    ev("Ceza yok; su tanrısal hüküm değil çözülecek problem.",
      cite("lewis-2006-flood-myths-early-china", "Anlatının ahlaki çerçevesi", "direct"), { id: "ceza-yok" }),
    ev("İnsanlık yok olmuyor, yerinde kalıyor.",
      cite("birrell-1993-chinese-mythology", "Gun-Yu anlatısı metinleri", "direct"), { id: "insanlik-yok-olmuyor" }),
    ev("Sonuç kurtuluş değil hanedan ve yönetme meşruiyeti.",
      cite("lewis-2006-flood-myths-early-china", "Siyasi işlev çözümlemesi", "direct"), { id: "sonuc-mesruiyet" }),
  ],
  counter_evidence: [
    ev("Yapısal fark, iki geleneğin hiç temas etmediğini göstermez; söylenen şey aynı ANLATI KALIBI olmadığıdır.",
      cite("lewis-2006-flood-myths-early-china", "Kayıt düzeyi ayrımı", "context"), { id: "temas-etmedi-demiyoruz" }),
    ev("Gun-Yu metinleri de geç derlemedir (Savaşan Devletler ve sonrası); anlatının kaç yüzyıl önce hangi biçimde dolaştığı ayrı bir sorudur.",
      cite("birrell-1993-chinese-mythology", "Metin tarihleri", "counter"), { id: "metinler-gec-derleme" }),
  ],
  open_questions: ["Gun-Yu anlatısının yazıya geçmeden önceki biçimi izlenebilir mi?"],
  checked: CHECKED, used_in: ["tufan-bilmecesi"],
  review: { status: "draft", notes: "Lewis'in ISBN'i doğrulandı (SUNY Press). Birrell eklendi. Metinlerin geç derleme olduğu counter_evidence'a yazıldı." },
});

const kusTesti = finding({
  id: "tufan-kus-testi-bagimlilik-kaniti",
  claim: "Kuş salma motifi, Gılgamış XI ile Tekvin arasındaki metinsel bağımlılığın filolojik kanıtıdır.",
  status: "established", confidence: "high",
  topic: ["tufan", "mezopotamya", "metin-elestirisi"],
  subject: { region: "Mezopotamya - Levant", modern_country: "Irak / İsrail-Filistin" },
  period: { earliest: -1200, latest: -500, era_label: "Orta Assur - Sürgün sonrası", precision: "range", dating_method: ["textual", "paleography"] },
  languages: ["Akadca", "İbranice"],
  disciplines: ["filoloji", "metin-elestirisi"],
  people: [{ name: "George, Andrew R.", role: "editor", affiliation: "SOAS, University of London", year: 2003 }],
  popular_claim: "İki anlatının benzerliği, ikisinin de gerçek bir olayı hatırlamasından gelir.",
  divergence:
    "Benzerlik gerçek ama açıklaması ortak HATIRA değil, ortak METİN. Kanıt şurada: kuş salma KEYFÎ bir edebî çözümdür - karanın çıkıp çıkmadığını anlamanın doğal yolu değil, bir anlatı hilesidir. Böyle keyfî bir ayrıntı iki kez bağımsız icat edilmez. Aynı mantığın Tekvin'de sırası değişmiş, zeytin yaprağı eklenmiştir; yani ödünç alınmış ve yerelleştirilmiştir.",
  divergence_type: ["kategori-hatasi"],
  sources: [george, tigay, wenham],
  evidence: [
    ev("Karanın çıkıp çıkmadığını anlamak için sırayla kuş salmak bir olayın değil, bir ANLATININ parçası - keyfî edebî çözüm.",
      cite("george-2003-babylonian-gilgamesh", "XI. tablet, kuş salma bölümü", "direct"), { id: "kus-salma-keyfi" }),
    ev("Keyfî ayrıntılar bağımsız olarak iki kez icat edilmez.",
      cite("tigay-1982-evolution-gilgamesh", "Metinsel bağımlılık ölçütleri", "direct"), { id: "keyfi-ayrinti-olcutu" }),
    ev("Tekvin'de sıra değişmiş (kuzgun sonra güvercin) ama mantık aynı; zeytin yaprağı Levant'ın kendi katkısı.",
      cite("wenham-1987-genesis-1-15", "Tekvin 8 yorumu", "direct"), { id: "sira-degismis-mantik-ayni" }),
  ],
  counter_evidence: [
    ev("Bağımlılığın YÖNÜ ve aracı metin bu kayıtta gösterilmiyor: doğrudan Gılgamış'tan mı, ortak bir Yakındoğu geleneğinden mi geldiği ayrı bir tartışmadır.",
      cite("tigay-1982-evolution-gilgamesh", "Aktarım yolları", "counter"), { id: "yon-ve-araci-belirsiz" }),
    ev("Kuş salma denizcilikte bilinen bir uygulamadır; 'tamamen keyfî' nitelemesi bu yüzden mutlak değildir - ama SIRALI üç kuş ve dönüş/dönmeme mantığı anlatıya özgüdür.",
      cite("wenham-1987-genesis-1-15", "Motifin değerlendirmesi", "counter"), { id: "denizcilik-uygulamasi-itirazi" }),
  ],
  open_questions: ["Bağımlılık doğrudan mı, aracı bir metin üzerinden mi?"],
  checked: CHECKED, used_in: ["tufan-bilmecesi"],
  review: { status: "draft", notes: "Yer tutucu üç künyeyle değiştirildi. 'Tamamen keyfî' nitelemesine denizcilik itirazı counter_evidence'a eklendi - kayıt bu itirazı hiç anmıyordu." },
});

const atrahasis = finding({
  id: "tufan-atrahasis-sebep-gurultu",
  claim: "Atrahasis'te tufanın sebebi ahlaki bozulma değil, insanların gürültüsünün Enlil'in uykusunu kaçırmasıdır.",
  status: "established", confidence: "high",
  topic: ["tufan", "mezopotamya"],
  subject: { region: "Mezopotamya", modern_country: "Irak" },
  period: { earliest: -1700, latest: -1600, era_label: "Eski Babil", precision: "approximate", dating_method: ["paleography", "textual"] },
  languages: ["Akadca"],
  disciplines: ["filoloji"],
  people: [
    { name: "Lambert, Wilfred G.", role: "editor", affiliation: "University of Birmingham", year: 1969, lifespan: "1926-2011" },
    { name: "Millard, Alan R.", role: "editor", affiliation: "University of Liverpool", year: 1969 },
  ],
  popular_claim: "Tufan, insanlığın günahları yüzünden gönderilen bir cezadır.",
  divergence:
    "Bu ahlaki çerçeve Tekvin'in katkısıdır, anlatının kendisinin değil. Atrahasis'te gerekçe açıkça yazılıdır ve ahlakla ilgisi yoktur: insanlar çoğaldı, uğultuları arttı, tanrı uyuyamadı. Aynı olay örgüsü ödünç alınıp BAŞKA BİR SEBEBE bağlanmış - yani devralınan şey olay, değiştirilen şey anlam.",
  divergence_type: ["kategori-hatasi"],
  sources: [atrahasisMetin, lambertMillard, dalley],
  evidence: [
    ev("Metin doğrudan böyle diyor: insanlığın uğultusu ağır geldi, uyku kaçtı.",
      cite("atrahasis-i-tablet", "I. tablet, gürültü gerekçesi", "direct"), { id: "metin-dogrudan-boyle-diyor" }),
    ev("Standart edisyon bu okumayı verir.",
      cite("lambert-millard-1969-atrahasis", "I. tablet çevirisi", "direct"), { id: "standart-edisyon-okumasi" }),
    ev("Tekvin aynı olay örgüsünü alıp ahlaki çerçeveye oturtuyor - ödünç alıp yeniden anlamlandırma.",
      cite("dalley-1989-myths-from-mesopotamia", "Tufan metinleri karşılaştırması", "inference"), { id: "tekvin-ahlaki-cerceve" }),
  ],
  counter_evidence: [
    ev("'Gürültü' (rigmu) teriminin yalnızca ses mi yoksa isyan/kargaşa çağrışımı da mı taşıdığı tartışılmıştır; okuma tartışmasız değildir.",
      cite("lambert-millard-1969-atrahasis", "Terim tartışması", "counter"), { id: "rigmu-terim-tartismasi" }),
    ev("Tekvin'in çerçeveyi 'değiştirdiği' savı bir ÇIKARIMDIR: iki metnin ilişkisi kabul edilse bile hangisinin neyi ne zaman eklediği ayrıca gösterilmelidir.",
      cite("dalley-1989-myths-from-mesopotamia", "Kayıt düzeyi ayrımı", "context"), { id: "degistirme-savi-cikarim" }),
  ],
  open_questions: ["'rigmu' teriminin anlam alanı nedir - yalnızca gürültü mü?"],
  checked: CHECKED, used_in: ["tufan-bilmecesi"],
  review: { status: "draft", notes: "Lambert & Millard künyelendi (ISBN doğrulanamadı, işaretlendi). Terim tartışması counter_evidence'a eklendi. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu." },
});

const popolVuh = finding({
  id: "tufan-popol-vuh-fetih-sonrasi",
  claim: "Popol Vuh'un tufan bölümü bağımsız Kolomb öncesi kanıt sayılamaz.",
  status: "established", confidence: "medium",
  topic: ["tufan", "mezoamerika", "provenans"],
  subject: { site: "Popol Vuh elyazması", region: "K'iche' bölgesi, Yukarı Guatemala", modern_country: "Guatemala" },
  period: { earliest: 1555, latest: 1701, era_label: "Sömürge dönemi", precision: "approximate", dating_method: ["historical-record", "textual"] },
  languages: ["K'iche' Mayacası", "İspanyolca"],
  disciplines: ["filoloji", "antropoloji", "tarih"],
  people: [{ name: "Ximénez, Francisco", role: "translator", affiliation: "Dominiken misyonu", year: 1701, lifespan: "1666-1729" }],
  popular_claim: "Mayalarda da tufan miti vardı.",
  divergence:
    "Metin ~1555'te, Latin alfabesiyle, Hristiyanlaşmış K'iche' yazarlarca, fetihten ~30 yıl sonra yazıldı. Uzmanların çoğu metnin ciddi Kolomb öncesi malzeme taşıdığında hemfikir, ama TUFAN ÖĞESİ kirlenme kuşkusunun en yüksek olduğu yer.",
  divergence_type: ["provenans-yoklugu", "somurge-anlatisi"],
  sources: [tedlock],
  evidence: [
    ev("Bilinen en eski nüsha Ximénez'in ~1701 kopyasıdır; özgün elyazması yok.",
      cite("tedlock-1996-popol-vuh", "Metnin aktarım tarihçesi", "direct"), { id: "ozgun-elyazmasi-yok" }),
    ev("Metin fetihten sonra, Latin alfabesiyle ve Hristiyanlaşmış yazarlarca kaydedildi.",
      cite("tedlock-1996-popol-vuh", "Yazım koşulları", "direct"), { id: "fetih-sonrasi-kayit" }),
  ],
  counter_evidence: [
    ev("Metnin bütünü uydurma değil; birçok bölüm Kolomb öncesi ikonografiyle örtüşüyor.",
      cite("tedlock-1996-popol-vuh", "İkonografi karşılaştırması", "counter"), { id: "ikonografi-ortusmesi" }),
    ev("Bu kayıt TUFAN ÖĞESİ için kuşku bildiriyor, metnin tamamı için değil. Ayrım korunmazsa kayıt Popol Vuh'u toptan geçersiz sayıyormuş gibi okunur.",
      cite("tedlock-1996-popol-vuh", "Kayıt düzeyi ayrımı", "context"), { id: "tufan-ogesi-metnin-tamami-degil" }),
  ],
  open_questions: ["Kolomb öncesi bir tufan geleneği var mıydı - fetih öncesi kaynak olmadığı için cevaplanamıyor."],
  checked: CHECKED, used_in: ["tufan-bilmecesi"],
  review: { status: "draft", notes: "Tedlock künyelendi; ticari yayınevinden çıkmış olmasına rağmen akademik çeviri olduğu için peer-reviewed işaretlendi ve gerekçesi kaynak notuna yazıldı." },
});

const urKatmani = finding({
  id: "tufan-ur-katmani-tek-olay-degil",
  claim: "Mezopotamya'daki arkeolojik tufan katmanları tek bir küresel olaya değil, tekrar eden yerel taşkınlara işaret eder.",
  status: "established", confidence: "high",
  topic: ["tufan", "jeoarkeoloji", "mezopotamya"],
  subject: { site: "Ur", region: "Güney Mezopotamya", modern_country: "Irak", coordinates: { lat: 30.9626, lon: 46.1031 } },
  period: { earliest: -3500, latest: -2500, era_label: "Ubeyd - Erken Hanedanlar", precision: "range", dating_method: ["stratigraphy", "radiocarbon"] },
  disciplines: ["arkeoloji", "jeoarkeoloji"],
  people: [
    { name: "Woolley, Leonard", role: "excavator", affiliation: "British Museum / Penn Museum", year: 1929, lifespan: "1880-1960" },
    { name: "Mallowan, M. E. L.", role: "critic", year: 1964 },
  ],
  popular_claim: "Woolley Ur'da Nuh Tufanı'nın kanıtını buldu.",
  divergence:
    "Woolley 1929'da metrelerce alüvyon katmanı bulup Tufan olarak duyurdu. Sonraki kazılar Kiş, Şuruppak ve Uruk'ta da katmanlar buldu - ama FARKLI TARİHLERDE. Duyuru popüler kültürde kaldı, düzeltme kalmadı.",
  divergence_type: ["guncellenmemis", "medya-abartisi"],
  sources: [mallowan, woolleyUr],
  evidence: [
    ev("Farklı sitelerde farklı tarihli katmanlar bulundu; Kiş'te üç ayrı taşkın belgelenmiştir ve en geç olanı ~MÖ 2600'dür.",
      cite("mallowan-1964-noahs-flood-reconsidered", "Kiş taşkın tablosu", "direct"), { id: "farkli-tarihli-katmanlar" }),
    ev("Alan içi yeniden değerlendirmenin sonucu: anlatı gerçek bir felaketten esinlenmiş olabilir ama bu felaket hiçbir biçimde EVRENSEL değildir.",
      cite("mallowan-1964-noahs-flood-reconsidered", "Sonuç bölümü", "direct"), { id: "yerel-felaket-sonucu" }),
    ev("Mezopotamya bir taşkın ovası; şehirler defalarca sular altında kaldı.",
      cite("mallowan-1964-noahs-flood-reconsidered", "Bölgesel değerlendirme", "context"), { id: "taskin-ovasi" }),
    ev("Popüler anlatının kaynağı Woolley'in kendi duyurusudur.",
      cite("woolley-1929-ur-tufan-katmani", "Duyuru", "claim-origin"), { id: "woolley-duyurusu" }),
  ],
  counter_evidence: [
    ev("Mallowan'ın kendisi anlatının GERÇEK bir felaketten esinlendiğini savunur; bu kayıt 'hiçbir olay yoktu' demiyor, 'tek ve küresel bir olay yoktu' diyor.",
      cite("mallowan-1964-noahs-flood-reconsidered", "Sonuç bölümü", "counter"), { id: "hicbir-olay-yoktu-demiyoruz" }),
    ev("Woolley'in 1929 duyurusunun künye ayrıntıları bu kayıtta doğrulanmadı.",
      cite("woolley-1929-ur-tufan-katmani", "Künye düzeyi", "context"), { id: "woolley-kunye-eksik" }),
  ],
  open_questions: ["1964'ten sonraki jeoarkeoloji bu tabloyu değiştirdi mi? Güncel literatür taranmadı."],
  checked: CHECKED, used_in: ["tufan-bilmecesi"],
  review: {
    status: "draft",
    notes:
      "DeepSeek turunda bu kayda doğrulanmış aday GELMEDİ; ayrıca arandı ve alanın klasik yeniden değerlendirmesi bulundu (Mallowan 1964, Iraq 26). Kaydın iddiasını doğrudan taşıyor.",
  },
});

const karadeniz = finding({
  id: "tufan-karadeniz-felaket-hipotezi",
  claim: "Akdeniz ~7.600 yıl önce Boğaz'ı yarıp Karadeniz'i ani biçimde doldurdu.",
  status: "minority", confidence: "medium",
  topic: ["tufan", "jeoloji", "karadeniz"],
  subject: { site: "Karadeniz havzası", region: "Karadeniz - Boğazlar", modern_country: "Türkiye ve çevresi", coordinates: { lat: 43.4, lon: 34.3 } },
  period: { earliest: -5600, latest: -5500, era_label: "Erken Holosen", precision: "approximate", dating_method: ["radiocarbon", "stratigraphy"] },
  disciplines: ["jeoloji", "jeoarkeoloji"],
  people: [
    { name: "Ryan, William B. F.", role: "proposer", affiliation: "Columbia University, Lamont-Doherty", year: 1997 },
    { name: "Pitman, Walter C.", role: "proposer", affiliation: "Columbia University, Lamont-Doherty", year: 1997, lifespan: "1931-2019" },
    { name: "Giosan, Liviu", role: "critic", year: 2009 },
  ],
  popular_claim: "Nuh Tufanı'nın jeolojik karşılığı bulundu: Karadeniz'in ani dolması.",
  divergence:
    "Hipotez gerçek bir gözleme dayanıyor - havzada tatlı sudan tuzlu suya geçiş var. Tartışmalı olan HIZ: 'ani felaket' mi yoksa yüzyıllara yayılan kademeli bir yükselme mi? Sonraki jeolojik çalışmalar ikincisine işaret ediyor ve felaket sürümü bugün azınlık görüşü. Popüler kültürde ise hâlâ 'kanıtlandı' diye dolaşıyor - bir hipotezin ilk hâli, düzeltilmiş hâlinden daha hızlı yayıldı.",
  divergence_type: ["guncellenmemis", "medya-abartisi"],
  sources: [ryanPitman, giosan],
  evidence: [
    ev("Ryan ve Pitman (1997) sediment ve fauna değişimine dayanarak öne sürdü.",
      cite("ryan-pitman-1999-noahs-flood", "Hipotezin sunumu", "claim-origin"), { id: "ryan-pitman-onerisi" }),
    ev("Popüler kültürde geniş kabul gördü.",
      cite("ryan-pitman-1999-noahs-flood", "Kitabın yayılımı", "context"), { id: "populer-kabul" }),
  ],
  counter_evidence: [
    ev("Sonraki jeolojik çalışmalar su seviyesi yükselişinin çok daha KADEMELİ olduğuna işaret etti.",
      cite("giosan-2009-black-sea", "Sonuçlar", "counter"), { id: "kademeli-yukselis" }),
    ev("Felaket versiyonu bugün azınlık görüşü.",
      cite("giosan-2009-black-sea", "Tartışma bölümü", "counter"), { id: "azinlik-gorusu" }),
    ev("Özgün HAKEMLİ yayın (1997) bu kayıtta künyelenmedi; hipotezin kaynağı olarak popülerleştirilmiş kitap kullanılıyor. Bu bir eksikliktir.",
      cite("ryan-pitman-1999-noahs-flood", "Kaynak düzeyi sınırı", "counter"), { id: "1997-yayini-kunyelenmedi" }),
  ],
  open_questions: ["Ryan & Pitman'ın 1997 tarihli hakemli yayını künyelenmeli."],
  checked: CHECKED, used_in: ["tufan-bilmecesi"],
  review: { status: "draft", notes: "Ryan & Pitman 1999 tier'ı 'popular' - popülerleştirilmiş kitap. Giosan 2009 DOI ile bağlandı. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu." },
});

const manu = finding({
  id: "tufan-manu-bagimsizligi",
  claim: "Hindistan'daki Manu ve balık anlatısı Mezopotamya'dan bağımsız olarak doğmuştur.",
  status: "unknown", confidence: "medium",
  topic: ["tufan", "hindistan"],
  subject: { region: "Kuzey Hindistan, Ganj havzası", modern_country: "Hindistan" },
  period: { earliest: -700, latest: 500, era_label: "Geç Vedik - Purana dönemi", precision: "range", dating_method: ["textual"] },
  languages: ["Sanskritçe"],
  disciplines: ["filoloji", "antropoloji"],
  popular_claim: "Hindistan'daki tufan anlatısı, anlatının evrenselliğinin bir başka kanıtıdır.",
  divergence:
    "Kanıt olabilmesi için BAĞIMSIZ olması gerekir - ve bu gösterilemiyor. İndus ile Mezopotamya arasında ticaret bağlantısı vardı, yani aktarım fiziksel olarak mümkün. Öte yandan Gılgamış-Tekvin ilişkisini kuran türden keyfî bir ortak ayrıntı (kuş testi gibi) burada YOK. Yani ne bağımlılık gösterilebiliyor ne bağımsızlık. Kaydın durumu bu yüzden 'unknown' - ve bu bir eksiklik değil, dürüst karşılık.",
  divergence_type: ["kategori-hatasi"],
  sources: [satapatha, lambert1965],
  evidence: [
    ev("Śatapatha Brāhmaṇa (~MÖ 700) ve sonraki Puranalar'da mevcut.",
      cite("satapatha-brahmana-1-8-1", "1.8.1", "direct"), { id: "satapatha-metni" }),
  ],
  counter_evidence: [
    ev("İndus-Mezopotamya ticaret bağlantısı vardı; aktarım fiziksel olarak mümkün.",
      cite("lambert-1965-babylonian-background-genesis", "Aktarım tartışması", "context"), { id: "ticaret-baglantisi" }),
    ev("Doğrudan metinsel bağımlılık kanıtı yok - kuş testi gibi keyfî bir ortak ayrıntı bulunmuyor.",
      cite("satapatha-brahmana-1-8-1", "Metnin içeriği", "counter"), { id: "keyfi-ortak-ayrinti-yok" }),
    ev("KAYNAK SINIRI: bu kayıtta kullanılan Lambert 1965, TEKVİN'in Babil arka planı üzerinedir; Manu-Mezopotamya ilişkisini doğrudan ele almaz. Manu'nun bağımsızlığını inceleyen bir çalışma bu turda bulunamadı.",
      cite("lambert-1965-babylonian-background-genesis", "Kayıt düzeyi sınırı", "context"), { id: "lambert-dolayli-kaynak" }),
  ],
  open_questions: [
    "Karara bağlanmamış; her iki yön de savunulabilir.",
    "Manu anlatısının Mezopotamya ile ilişkisini doğrudan inceleyen Hint-Avrupa ve Vedik literatür taranmalı.",
  ],
  checked: CHECKED, used_in: ["tufan-bilmecesi"],
  review: { status: "draft", notes: "Lambert 1965 DOI ile doğrulandı AMA konusu Tekvin'dir, Manu değil. Bağlam kaynağı olarak alındı ve dolaylılığı açıkça yazıldı." },
});

const avustralya = finding({
  id: "tufan-avustralya-deniz-seviyesi-hafizasi",
  claim: "Bazı Aborjin sözlü gelenekleri ~7.000 yıl öncesine ait kıyı çizgisi değişimini koruyor olabilir.",
  status: "contested", confidence: "medium",
  topic: ["tufan", "avustralya", "sozlu-gelenek"],
  subject: { region: "Avustralya kıyıları", modern_country: "Avustralya" },
  period: { earliest: -7000, latest: 2016, era_label: "Holosen deniz yükselmesi - modern derleme", precision: "range", dating_method: ["radiocarbon", "historical-record"] },
  languages: ["Aborjin dilleri"],
  disciplines: ["antropoloji", "jeoloji"],
  people: [
    { name: "Nunn, Patrick D.", role: "proposer", affiliation: "University of the Sunshine Coast", year: 2016 },
    { name: "Reid, Nicholas", role: "proposer", affiliation: "University of New England", year: 2016 },
  ],
  popular_claim: "Sözlü gelenek binlerce yıllık olayları güvenilir biçimde taşıyamaz.",
  divergence:
    "Bu kayıt tersini KANITLAMIYOR - ama iddianın sınanabilir hale geldiğini gösteriyor. Nunn ve Reid çok sayıda gelenekteki deniz yükselmesi motifini jeolojik kıyı verileriyle eşleştirdi. Zorluk şurada: eşleştirme SONRADAN yapılıyor. Bir anlatı ile bir jeolojik olay arasında örtüşme aramak, aramaya nereden başlandığına duyarlıdır. Yani bulgu ilginç, yöntemi tartışmalı - kaydın durumu 'contested' tam da bu yüzden.",
  divergence_type: ["kategori-hatasi"],
  sources: [nunnReid],
  evidence: [
    ev("Nunn ve Reid (2016) çok sayıda gelenekte deniz yükselmesi motifi tespit etti ve jeolojik kıyı verileriyle eşleştirdi.",
      cite("nunn-reid-2016-aboriginal-memories", "Yöntem ve bulgular", "claim-origin"), { id: "nunn-reid-eslestirmesi" }),
  ],
  counter_evidence: [
    ev("Sözlü aktarımın 7.000 yıl bilgi taşıyabileceği tartışmalı.",
      cite("nunn-reid-2016-aboriginal-memories", "Tartışma bölümü", "counter"), { id: "7000-yil-tartismali" }),
    ev("Eşleştirme sonradan yapılan bir yorum; test edilebilirliği sınırlı.",
      cite("nunn-reid-2016-aboriginal-memories", "Yöntem sınırları", "counter"), { id: "sonradan-eslestirme" }),
    ev("Bu kayıt TEK BİR ÇALIŞMAYA dayanıyor; öneriyi bağımsız olarak sınayan bir yayın burada künyelenmedi.",
      cite("nunn-reid-2016-aboriginal-memories", "Kaynak bağımsızlığı", "context"), { id: "tek-calisma" }),
  ],
  open_questions: ["Öneriyi bağımsız sınayan çalışma var mı? Bu turda aranmadı."],
  checked: CHECKED, used_in: ["tufan-bilmecesi"],
  review: { status: "draft", notes: "Nunn & Reid DOI ile bağlandı ve claim-origin olarak işaretlendi - kayıt tek bir çalışmaya dayanıyor, bu açıkça yazıldı." },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
const yeni = [evrenselDegil, misirdaYok, cinYapisi, kusTesti, atrahasis, popolVuh, urKatmani, karadeniz, manu, avustralya];
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
