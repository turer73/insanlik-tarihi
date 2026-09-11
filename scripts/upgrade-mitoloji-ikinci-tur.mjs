#!/usr/bin/env node
// Mitoloji dosyası, ikinci geçiş: kalan 18 kayıt. Dosya tamamlanıyor (25/25).
//
// BU DOSYANIN İÇERİĞİ ZATEN GÜÇLÜ. popular_claim, divergence, evidence ve
// counter_evidence satırları yerli yerinde ve çoğu kayıt kendi sınırını da
// yazmış. Eksik olan tek şey kaynakların KÜNYESİYDİ: dosyanın omurgasını
// taşıyan beş eser başlık dizesi olarak duruyordu, yazarsız ve yılsız.
//
// DOĞRULANAN OMURGA (hepsi crossref/HAL ile teyit edildi):
//   Tehrani & d'Huy 2016, "Phylogenetics Meets Folklore"
//     -> DOI 10.1007/978-3-319-39445-9_6   (dosyada 4 kayıtta kullanılıyor)
//   Tehrani 2023, "The Cultural Transmission and Evolution of Folk
//     Narratives", Oxford Handbook of Cultural Evolution
//     -> DOI 10.1093/oxfordhb/9780198869252.013.39   (5 kayıtta)
//   d'Huy 2013, "A Cosmic Hunt in the Berber sky"
//     -> HAL halshs-00932197 (Les Cahiers de l'AARS crossref'te yok)
//   Norris & Norris 2021, "Why Are There Seven Sisters?"
//     -> DOI 10.1007/978-3-030-64606-6_11
//   Le Quellec 2021, "En Afrique, pourquoi meurt-on ?"
//     -> DOI 10.4000/afriques.1717
//
// DENETİMDE ÇIKAN BİR YAZAR HATASI: "En Afrique, pourquoi meurt-on ?"
// kaydı d'Huy'ye yakın duruyordu (khoisan kaydının yazar alanı ve komşu
// künyeler öyle okutuyordu). Crossref'e göre yazar JEAN-LOÏC LE QUELLEC.
// Künye ona göre yazıldı.
//
// TIER GEREKÇESİ - Abrahamsson 1951: ISBN öncesi bir monografi (Studia
// Ethnographica Upsaliensia). peer-reviewed katmanı v2'de tanımlayıcı
// istiyor ve 1951 için böyle bir tanımlayıcı yok. Kurum serisi künyesiyle
// institutional yapıldı; akademik bir monografi olduğu notta yazılı.
// Aynı sorun Stanner 1953 "The Dreaming" denemesinde de vardı: künyelenebilir
// çıpa olarak 1979 ANU derlemesi kullanıldı (tufan dosyasındaki çözümün
// aynısı).
//
// SINIR: hiçbir kaynağın tam metni okunmadı; locator'lar bölüm düzeyinde.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/mitoloji.json";
const CHECKED = "2026-09-12";
const mak = (id, o) => source(id, { language: "en", accessed: CHECKED, ...o });

/* --- kaynaklar ----------------------------------------------------- */

const S = {
  tehraniDhuy: mak("tehrani-dhuy-2016-phylogenetics-folklore", {
    tier: "peer-reviewed", type: "chapter",
    authors: ["Tehrani, Jamshid J.", "d'Huy, Julien"], year: 2016,
    title: "Phylogenetics Meets Folklore: Bioinformatics Approaches to the Study of International Folktales",
    container: "Understanding Complex Systems", publisher: "Springer",
    doi: "10.1007/978-3-319-39445-9_6",
    note: "Yöntemin kendi sunumu. Bu dosyada hem yöntemin tarifi hem de sınırlarının kaynağı olarak kullanılıyor.",
  }),
  tehrani2023: mak("tehrani-2023-cultural-transmission-folk-narratives", {
    tier: "peer-reviewed", type: "chapter",
    authors: ["Tehrani, Jamshid J."], year: 2023,
    title: "The Cultural Transmission and Evolution of Folk Narratives",
    container: "The Oxford Handbook of Cultural Evolution", publisher: "Oxford University Press",
    doi: "10.1093/oxfordhb/9780198869252.013.39",
    note: "Alanın güncel değerlendirmesi; aktarım, örneklem ve kategori sorunları için dayanak.",
  }),
  dhuy: mak("dhuy-2013-cosmic-hunt-berber", {
    tier: "peer-reviewed", type: "article",
    authors: ["d'Huy, Julien"], year: 2013,
    title: "A Cosmic Hunt in the Berber sky: a phylogenetic reconstruction of Palaeolithic mythology",
    container: "Les Cahiers de l'AARS", volume: "15", pages: "93-106",
    url: "https://shs.hal.science/halshs-00932197v1",
    note: "Gökteki Av filogenetiğinin özgün sunumu. Dergi crossref'te yok; kalıcı çıpa olarak HAL kaydı kullanıldı.",
  }),
  norris: mak("norris-2021-seven-sisters", {
    tier: "peer-reviewed", type: "chapter",
    authors: ["Norris, Ray P.", "Norris, Barnaby R. M."], year: 2021,
    title: "Why Are There Seven Sisters?",
    container: "Historical & Cultural Astronomy", publisher: "Springer",
    doi: "10.1007/978-3-030-64606-6_11",
    note: "Önerinin kendisi. Bu kayıtta doğrulayıcı değil, iddianın kaynağı olarak kullanılıyor.",
  }),
  lequellec: mak("lequellec-2021-afrique-pourquoi-meurt-on", {
    tier: "peer-reviewed", type: "article",
    authors: ["Le Quellec, Jean-Loïc"], year: 2021,
    title: "En Afrique, pourquoi meurt-on ? Essai sur l'histoire d'un mythe africain",
    container: "Afriques", doi: "10.4000/afriques.1717", language: "fr",
    note:
      "Ölüm kökeni motifinin Afrika içi dağılımının incelenmesi. " +
      "YAZAR DÜZELTMESİ: önceki sürümde bu eser d'Huy'ye yakın duruyordu; crossref'e göre yazar Jean-Loïc Le Quellec'tir.",
  }),
  west: mak("west-2007-indo-european-poetry-myth", {
    tier: "peer-reviewed", type: "book",
    authors: ["West, Martin Litchfield"], year: 2007,
    title: "Indo-European Poetry and Myth",
    publisher: "Oxford University Press", isbn: "9780199280759",
    note: "Hint-Avrupa şiir ve mit rekonstrüksiyonunun standart eseri; fırtına-yılan motifinin karşılaştırmalı temeli.",
  }),
  dundes2005: mak("dundes-2005-folkloristics-21st-century", {
    tier: "peer-reviewed", type: "article",
    authors: ["Dundes, Alan"], year: 2005,
    title: "Folkloristics in the Twenty-First Century",
    container: "Journal of American Folklore", doi: "10.1353/jaf.2005.0044",
    note: "Alanın kendi yöntem eleştirisi; monomit ve arketip yaklaşımlarına folklor disiplininden bakış.",
  }),
  segal: mak("segal-1990-in-quest-of-the-hero", {
    tier: "peer-reviewed", type: "book",
    authors: ["Segal, Robert A."], year: 1990,
    title: "In Quest of the Hero",
    publisher: "Princeton University Press", isbn: "9780691020624",
    note: "Rank, Raglan ve Campbell kalıplarını yan yana koyan derleme; üç listenin farklılığı buradan izlenebilir.",
  }),
  dundes1984: mak("dundes-1984-sacred-narrative", {
    tier: "peer-reviewed", type: "book",
    authors: ["Dundes, Alan"], year: 1984,
    title: "Sacred Narrative: Readings in the Theory of Myth",
    publisher: "University of California Press", isbn: "9780520051928",
    note: "Mit kuramının klasik derlemesi.",
  }),
  campbell: mak("campbell-1949-hero-thousand-faces", {
    tier: "popular", type: "book",
    authors: ["Campbell, Joseph"], year: 1949,
    title: "The Hero with a Thousand Faces",
    publisher: "Pantheon Books", isbn: "9781577315933",
    note:
      "Monomitin KAYNAĞI. Bu dosyada doğrulayıcı değil, çürütülen iddianın çıkış noktası olarak duruyor. " +
      "Tier 'popular': akademik folklor disiplininde hakemli bir çalışma olarak değil, kuramsal bir deneme olarak ele alınır.",
  }),
  vogler: mak("vogler-2007-writers-journey", {
    tier: "popular", type: "book",
    authors: ["Vogler, Christopher"], year: 2007,
    title: "The Writer's Journey: Mythic Structure for Writers",
    publisher: "Michael Wiese Productions", isbn: "9781932907360",
    note: "Kalıbın senaryo şablonuna çevrildiği kitap. Geri besleme döngüsünün somut halkası budur.",
  }),
  propp: mak("propp-1968-morphology-folktale", {
    tier: "peer-reviewed", type: "book",
    authors: ["Propp, Vladimir"], year: 1968,
    title: "Morphology of the Folktale",
    publisher: "University of Texas Press", isbn: "9780292783768",
    note: "Tanımlı bir külliyat üzerine kurulmuş, bu yüzden sınanabilir anlatı çözümlemesi. Rusça özgün basım 1928.",
  }),
  popper: mak("popper-1959-logic-scientific-discovery", {
    tier: "peer-reviewed", type: "book",
    authors: ["Popper, Karl"], year: 1959,
    title: "The Logic of Scientific Discovery",
    publisher: "Routledge", isbn: "9780415278447",
    note: "Yanlışlanabilirlik ölçütünün klasik ifadesi; 'kapsam disiplini' kaydının yöntemsel dayanağı.",
  }),
  radin: mak("radin-1956-trickster", {
    tier: "peer-reviewed", type: "book",
    authors: ["Radin, Paul"], year: 1956,
    title: "The Trickster: A Study in American Indian Mythology",
    publisher: "Schocken Books", isbn: "9780805203516",
    note: "Hilebaz kategorisinin kurucu incelemesi; kategorinin nasıl tanımlandığını gösteren kaynak.",
  }),
  ruggles: mak("ruggles-2005-ancient-astronomy", {
    tier: "peer-reviewed", type: "book",
    authors: ["Ruggles, Clive"], year: 2005,
    title: "Ancient Astronomy: An Encyclopedia of Cosmologies and Myth",
    publisher: "ABC-CLIO", isbn: "9781851094776",
    note: "Arkeoastronomi başvuru eseri; Ülker'in takvim kullanımlarının karşılaştırmalı dökümü.",
  }),
  morphy: mak("morphy-1998-aboriginal-art", {
    tier: "peer-reviewed", type: "book",
    authors: ["Morphy, Howard"], year: 1998,
    title: "Aboriginal Art",
    publisher: "Phaidon", isbn: "9780714837529",
    note: "Avustralya yerli sanatı ve Rüya kavramının antropolojik değerlendirmesi.",
  }),
  stanner: mak("stanner-1979-white-man-got-no-dreaming", {
    tier: "peer-reviewed", type: "book",
    authors: ["Stanner, W. E. H."], year: 1979,
    title: "White Man Got No Dreaming: Essays 1938-1973",
    publisher: "Australian National University Press", isbn: "9780708118023",
    note:
      "'The Dreaming' denemesi (1953) bu akademik derlemede yeniden basılmıştır. " +
      "Denemenin kendisi ISBN öncesidir; künyelenebilir çıpa olarak derleme kullanıldı - tufan dosyasındaki çözümün aynısı. " +
      "TARİH ÇELİŞKİSİ: deneme yaygın olarak 1953 anılır, ilk basımı 1956 antolojisidir (Australian Signpost).",
  }),
  abrahamsson: mak("abrahamsson-1951-origin-of-death", {
    tier: "institutional", type: "book",
    authors: ["Abrahamsson, Hans"], year: 1951,
    title: "The Origin of Death: Studies in African Mythology",
    container: "Studia Ethnographica Upsaliensia 3",
    institution: "Uppsala Universitet", publisher: "Studia Ethnographica Upsaliensia, Uppsala",
    note:
      "Afrika ölüm kökeni motiflerinin klasik envanteri ve hâlâ standart derlemesi. " +
      "TIER GEREKÇESİ: akademik bir monografidir ama 1951 tarihli olduğu için ISBN'i yoktur ve v2'nin peer-reviewed katmanı tanımlayıcı ister; " +
      "kurum serisi künyesiyle institutional yazıldı. Katman, eserin niteliğini değil künyelenebilirliğini yansıtıyor.",
  }),
  boas: mak("boas-1888-central-eskimo", {
    tier: "primary", type: "report",
    authors: ["Boas, Franz"], year: 1888,
    title: "The Central Eskimo",
    container: "Sixth Annual Report of the Bureau of Ethnology",
    url: "https://www.gutenberg.org/ebooks/42084",
    note: "Dönemin etnografik derlemesi. BİRİNCİL DEĞİL, DÖNEM KAYNAĞIDIR: 19. yüzyıl derleme koşulları ve derleyicinin çerçevesi kayda dahildir.",
  }),
  george: mak("george-2003-babylonian-gilgamesh", {
    tier: "primary", type: "edition",
    authors: ["George, Andrew R."], year: 2003,
    title: "The Babylonian Gilgamesh Epic: Introduction, Critical Edition and Cuneiform Texts",
    publisher: "Oxford University Press", isbn: "9780198149224", volume: "2 cilt",
    note: "XI. tabletin eleştirel edisyonu; gençlik otu ve yılan sahnesinin metni.",
  }),
  rigveda: mak("rigveda-1-32", {
    tier: "primary", type: "edition", title: "Rigveda I.32 (Indra-Vritra)", language: "sa",
  }),
  kojikiSusanoo: mak("kojiki-susanoo", {
    tier: "primary", type: "edition", year: 712, title: "Kojiki (Susanoo - Yamata no Oroçi)", language: "ja",
  }),
  kojikiIzanagi: mak("kojiki-izanagi", {
    tier: "primary", type: "edition", year: 712, title: "Kojiki (İzanagi - İzanami)", language: "ja",
  }),
  hesiodosProm: mak("hesiodos-prometheus", {
    tier: "primary", type: "edition", authors: ["Hesiodos"],
    title: "Theogonia ve İşler ve Günler (Prometheus anlatısı)", language: "grc",
  }),
  hesiodosUlker: mak("hesiodos-isler-ve-gunler-ulker", {
    tier: "primary", type: "edition", authors: ["Hesiodos"],
    title: "İşler ve Günler (Ülker'in doğuşu ve batışına göre tarım takvimi)", language: "grc",
  }),
  halkTakvimi: mak("karadeniz-halk-takvimi", {
    tier: "institutional", type: "webpage",
    title: "Halk Takvimi ve Meteorolojisi",
    institution: "T.C. Karadeniz Bölgesi kültür yayını",
    url: "https://karadeniz.gov.tr/halk-takvimi-ve-meteorolojisi-7/", language: "tr",
    note: "Anadolu halk takviminde Ülker'in yeri. Bu dosyadaki Türkçe kaynak, konunun kendisinden geliyor - Anadolu takvim geleneği.",
  }),
  jorgensen: mak("jorgensen-folklorists-campbell", {
    tier: "institutional", type: "webpage",
    authors: ["Jorgensen, Jeana"], title: "Why Folklorists Hate Joseph Campbell's Work",
    institution: "Foxy Folklorist", publisher: "Patheos",
    url: "https://www.patheos.com/blogs/foxyfolklorist/why-folklorists-hate-joseph-campbells-work/",
    note: "Folklor disiplininden gelen eleştirinin erişilebilir özeti. Akademik yayın değil; hakemli dayanak Dundes ve Segal'dır.",
  }),
};

/* --- yardımcı ------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
const govde = (id) => {
  const o = list.find((x) => x.id === id);
  if (!o) { console.error("kayıt yok:", id); process.exit(1); }
  const { evidence, counter_evidence, sources, schema_version, review, ...kalan } = o;
  return kalan;
};
const yeni = [];
const kur = (id, sources, evidence, counter_evidence, notes) =>
  yeni.push(finding({ ...govde(id), sources, evidence, counter_evidence, checked: CHECKED, review: { status: "draft", notes } }));

const E = (t, ref, loc, st = "direct", id) => ev(t, cite(ref, loc, st), id ? { id } : undefined);

/* --- kayıtlar ------------------------------------------------------- */

kur("benzerlik-uc-aciklama", [S.tehraniDhuy, S.tehrani2023],
  [
    E("Bağımsız icat öngörüsü: benzerlik sığ olur (aynı tema, farklı ayrıntı) ve dağılım çevreyle ilişkilidir.", "tehrani-dhuy-2016-phylogenetics-folklore", "Açıklama modelleri", "direct", "bagimsiz-icat-ongorusu"),
    E("Temas öngörüsü: benzerlik derin olur (aynı tuhaf ayrıntı) ve dağılım ticaret yolları ile komşuluk hatlarını izler.", "tehrani-dhuy-2016-phylogenetics-folklore", "Yayılma modelleri", "direct", "temas-ongorusu"),
    E("Ortak köken öngörüsü: benzerlik derin olur ve dağılım nüfus tarihini izler - sonradan temas etmemiş halklarda bile.", "tehrani-2023-cultural-transmission-folk-narratives", "Soyağacı modelleri", "direct", "ortak-koken-ongorusu"),
    E("Ayırt edici test: iki halk ayrıldıktan sonra hiç temas etmediyse ve ikisinde de aynı KEYFÎ ayrıntı varsa, temas açıklaması düşer.", "tehrani-dhuy-2016-phylogenetics-folklore", "Ayırt edici ölçüt", "direct", "ayirt-edici-test"),
  ],
  [
    E("Üç açıklama pratikte iç içe geçer; bir motifin bir bölgede ortak kökenden, başka bir bölgede temastan gelmesi mümkündür.", "tehrani-2023-cultural-transmission-folk-narratives", "Model sınırları", "counter", "ic-ice-gecme"),
    E("'Keyfî ayrıntı' ölçütü niceliksel değildir; neyin keyfî sayılacağı yorumcuya bağlıdır.", "tehrani-dhuy-2016-phylogenetics-folklore", "Ölçüt tartışması", "counter", "keyfi-olcut-nicel-degil"),
  ],
  "Yer tutucu iki gerçek künyeyle değiştirildi (Tehrani & d'Huy 2016, Tehrani 2023 - ikisi de DOI ile doğrulandı).");

kur("firtina-yilan-motifi-kalibrasyon", [S.rigveda, S.kojikiSusanoo, S.west],
  [
    E("Indra-Vritra, Zeus-Typhon ve Thor-Jörmungandr aynı dil ailesinden üç gelenekte yer alır.", "west-2007-indo-european-poetry-myth", "Fırtına tanrısı ve yılan bölümü", "direct", "uc-gelenek"),
    E("Metnin kendisi: Indra, Vritra'yı öldürür.", "rigveda-1-32", "I.32", "direct", "rigveda-metni"),
    E("Bu üç dilin akrabalığı karşılaştırmalı dilbilimin en sağlam sonuçlarından biridir - mitolojiden bağımsız bir doğrulama hattı.", "west-2007-indo-european-poetry-myth", "Yöntem girişi", "direct", "dilbilim-bagimsiz-hat"),
    E("Aynı motif Hint-Avrupa dışı bir gelenekte de var: Susanoo, sekiz başlı yılan Yamata no Oroçi'yi öldürür.", "kojiki-susanoo", "Susanoo bölümü", "counter", "japon-ornegi"),
  ],
  [
    E("Japon örneğinin kıta Asya'sı üzerinden temasla gelmiş olma ihtimali elenmiş değildir.", "west-2007-indo-european-poetry-myth", "Yayılma tartışması", "counter", "temas-elenmedi"),
    E("Hint-Avrupa 'fırtına tanrısı yılanı öldürür' rekonstrüksiyonunun ayrıntıları da alanda tartışılır.", "west-2007-indo-european-poetry-myth", "Rekonstrüksiyon tartışması", "counter", "rekonstruksiyon-tartismali"),
    E("Çin ejderhasının TERS değeri (yağmur getiren, iyicil figür) bu kayıtta ayrı bir kaynağa bağlanmadı; karşı örnek genel bilgi olarak alınmıştır.", "west-2007-indo-european-poetry-myth", "Kayıt düzeyi sınırı", "context", "cin-ornegi-kaynaksiz"),
  ],
  "West 2007 eklendi - motifin Hint-Avrupa rekonstrüksiyonunun standart dayanağı. Çin karşı örneğinin kaynaksız olduğu işaretlendi.");

kur("mit-filogenetigi-kalibre-degil", [S.dhuy, S.tehraniDhuy, S.tehrani2023],
  [
    E("Gökteki Av için 47 versiyon ve 93 özellik; Polyphemus anlatısı (ATU 1137) için 44 versiyon ve 98 özellik kodlandı.", "dhuy-2013-cosmic-hunt-berber", "Veri ve kodlama", "direct", "versiyon-sayilari"),
    E("Standart folklor motif indeksleri ve uluslararası masal tipi katalogları bu kodlamanın altyapısını sağlıyor.", "tehrani-dhuy-2016-phylogenetics-folklore", "Kodlama altyapısı", "direct", "motif-indeksleri"),
  ],
  [
    E("Örneklem küçük ve coğrafi olarak dağınık; ağaçları bilinen göç yollarıyla güvenilir biçimde eşleştirmek mümkün değil.", "tehrani-2023-cultural-transmission-folk-narratives", "Örneklem sorunları", "counter", "orneklem-kucuk"),
    E("Alternatif açıklamalar dışlanmıyor: bağımsız gelişim, sömürgecilik, misyoner faaliyeti ve komşular arası yayılma aynı deseni üretebilir.", "tehrani-2023-cultural-transmission-folk-narratives", "Alternatif açıklamalar", "counter", "alternatifler-dislanmiyor"),
    E("Anlatı gelenekleri akışkandır; 'uluslararası masal tipi' denen birimin kendisi modern bir kurgudur, doğal bir birim değil.", "tehrani-2023-cultural-transmission-folk-narratives", "Birim sorunu", "counter", "masal-tipi-kurgu"),
    E("Sonuçların karşılaştırılabileceği bağımsız olarak bilinen bir cevap yok - yöntem sınanamıyor.", "tehrani-dhuy-2016-phylogenetics-folklore", "Kalibrasyon sorunu", "counter", "kalibrasyon-yok"),
  ],
  "d'Huy 2013 HAL çıpasıyla, Tehrani künyeleri DOI ile bağlandı. Kalibrasyon itirazı yöntemin kendi sunumuna bağlandı - itiraz dışarıdan değil, içeriden.");

kur("gokteki-av-bering-oncesi", [S.dhuy, S.tehrani2023],
  [
    E("Ayrıntı KEYFÎ: o yedi yıldız bir ayıya benzemez; kepçeye, arabaya, pulluğa benzer ve başka gelenekler tam bunları görmüştür. Keyfî bir seçimin bağımsız olarak tekrar etmesi az beklenir.", "dhuy-2013-cosmic-hunt-berber", "Motifin tanımı", "direct", "ayrinti-keyfi"),
    E("Bazı Kuzey Amerika anlatılarında ayı sonbaharda yaralanır ve kanı yaprakları kızartır - mevsimle bağlı, ayrıntılı bir versiyon.", "dhuy-2013-cosmic-hunt-berber", "Versiyon dökümü", "direct", "sonbahar-yapraklari"),
    E("Yunan geleneğinde de takımyıldız bir ayıdır ve Yunan anlatısı bunu açıklamakta zorlanır: dönüşüm hikâyesi, zaten var olan bir ada sonradan getirilmiş bir gerekçe gibi durur.", "dhuy-2013-cosmic-hunt-berber", "Yunan versiyonu", "inference", "yunan-gerekce"),
    E("Kuzey Avrasya ve Kuzey Amerika halkları en az 15.000 yıl önce ayrıldı; kara köprüsü sular altında, sonraki temas seçeneği fiilen kapalı.", "dhuy-2013-cosmic-hunt-berber", "Ayrılma argümanı", "claim-origin", "bering-ayrilmasi"),
  ],
  [
    E("Dağılım sürekli değil: Çin, Hindistan ve İskandinavya'da ayı okuması yok. Ortak kökense bu geleneklerin hepsinde KAYBOLMUŞ olması gerekir - mümkün ama test edilemez.", "tehrani-2023-cultural-transmission-folk-narratives", "Dağılım sorunu", "counter", "dagilim-surekli-degil"),
    E("16.-19. yüzyıl teması hafife alınıyor: derlemelerin çoğu misyoner ve etnograflar aracılığıyla yapıldı; Avrupa anlatılarının sızma ihtimali her vakada ayrıca elenmeli.", "tehrani-2023-cultural-transmission-folk-narratives", "Derleme koşulları", "counter", "somurge-donemi-temasi"),
    E("Örneklem küçük; 47 versiyon iki kıtaya yayılmış yüzlerce geleneği temsil etmiyor.", "dhuy-2013-cosmic-hunt-berber", "Örneklem", "counter", "47-versiyon-yetersiz"),
  ],
  "d'Huy 2013 künyelendi ve Bering argümanının ona ait olduğu claim-origin ile işaretlendi.");

kur("motif-yoklugu-cevre", [S.boas, S.tehrani2023],
  [
    E("Dünya ağacı motifi Hint, Çin, İskandinav ve Sibirya geleneklerinde merkezî yer tutar.", "tehrani-2023-cultural-transmission-folk-narratives", "Motif dağılımı", "direct", "dunya-agaci-dagilimi"),
    E("İnuit yerleşim bölgesinin büyük bölümü ağaç sınırının kuzeyindedir; ağaç yerel çevrede bulunmaz.", "boas-1888-central-eskimo", "Çevre ve yerleşim tarifi", "direct", "agac-siniri"),
  ],
  [
    E("Çevresel açıklama her yokluk için geçerli değildir; bazı yokluklar gerçekten kültürel ayrışmayı gösterir. Bu kayıt 'her zaman kültürel mesafe' iddiasını çürütür, çevrenin her zaman belirleyici olduğunu savunmaz.", "tehrani-2023-cultural-transmission-folk-narratives", "Kayıt düzeyi ayrımı", "context", "cevre-her-zaman-degil"),
    E("Sürüklenmiş odun (driftwood) İnuit maddi kültüründe kullanılıyordu; ağacın tamamen bilinmediği söylenemez.", "boas-1888-central-eskimo", "Maddi kültür", "counter", "suruklenmis-odun"),
    E("Boas 1888 bir DÖNEM KAYNAĞIDIR: 19. yüzyıl derleme koşulları ve derleyicinin kendi çerçevesi kayda dahildir; yokluk gözlemi de bu süzgeçten geçmiştir.", "boas-1888-central-eskimo", "Kaynak konumu", "context", "boas-donem-kaynagi"),
  ],
  "Boas 1888 künyelendi ve DÖNEM KAYNAĞI olduğu açıkça işaretlendi - kayıt onu doğrudan gözlem gibi kullanıyordu.");

kur("gelenek-tek-kutu-hatasi", [S.tehrani2023],
  [
    E("Amerika kıtalarında birbirinden dil ailesi düzeyinde ayrı yüzlerce yerli gelenek vardır.", "tehrani-2023-cultural-transmission-folk-narratives", "Örneklem birimi sorunu", "direct", "yuzlerce-gelenek"),
    E("İnuit ve Yupik gelenekleri ayrıdır; kendi içlerinde de bölgesel farklar taşır.", "tehrani-2023-cultural-transmission-folk-narratives", "Gruplama sorunu", "direct", "inuit-yupik-ayri"),
    E("Sütunlar tek tek geleneklere bölündüğünde karşılaştırma kutularının çoğu boş ya da 'veri yetersiz' çıkar.", "tehrani-2023-cultural-transmission-folk-narratives", "Veri seyrekliği", "direct", "kutular-bos-cikar"),
  ],
  [
    E("Bölgesel gruplamalar (örneğin Kuzeydoğu Ormanları, Kutup bölgesi) yöntemsel olarak savunulabilir; itiraz bu tür dikkatli gruplamalara değil, kıta ölçeğinde tek kutuya karşıdır.", "tehrani-2023-cultural-transmission-folk-narratives", "Kayıt düzeyi ayrımı", "context", "bolgesel-gruplama-mesru"),
  ],
  "Yer tutucu Tehrani 2023 ile değiştirildi.");

kur("yanlis-teslim-olum-motifi", [S.abrahamsson, S.lequellec],
  [
    E("En yaygın haberci çifti bukalemun (yavaş, iyi haber) ve kertenkeledir (hızlı, kötü haber).", "abrahamsson-1951-origin-of-death", "Motif envanteri", "direct", "bukalemun-kertenkele"),
    E("Malavi'deki Tumbuka anlatımında haberi gönderen Chiuta'dır; bukalemun yeniden doğuş, kertenkele kalıcı ölüm haberiyle yola çıkar ve kertenkele önce varır.", "abrahamsson-1951-origin-of-death", "Tumbuka anlatımı", "direct", "tumbuka-anlatimi"),
    E("Bazı anlatımlarda iki ayrı haberci, bazılarında tek haberci vardır ve mesaj yolda bozulur ya da çalınıp çarpıtılır.", "lequellec-2021-afrique-pourquoi-meurt-on", "Varyant tipolojisi", "direct", "varyant-tipleri"),
    E("Değişmeyen çekirdek: ölüm bir ceza değil, bir iletişim kazasıdır ve geri alınamaz.", "abrahamsson-1951-origin-of-death", "Motifin yapısı", "direct", "iletisim-kazasi"),
  ],
  [
    E("Afrika derlemelerinin büyük bölümü misyonerler aracılığıyla yapıldı; 'ölüm bir ceza' kalıbının yerel anlatılara sızma ihtimali her vakada ayrıca elenmeli - çoğu çalışmada bu yapılmıyor.", "lequellec-2021-afrique-pourquoi-meurt-on", "Derleme eleştirisi", "counter", "misyoner-derlemesi"),
    E("'Sahra altı Afrika' tek bir gelenek değildir; bu genelleme kaba bir taramadır.", "lequellec-2021-afrique-pourquoi-meurt-on", "Bölgesel çeşitlilik", "counter", "sahra-alti-tek-degil"),
    E("Abrahamsson 1951 hâlâ standart envanterdir ama YETMİŞ YILLIKTIR; sonraki derlemeler ve yeniden değerlendirmeler bu kayıtta taranmadı.", "abrahamsson-1951-origin-of-death", "Kayıt düzeyi sınırı", "context", "1951-eski"),
  ],
  "Abrahamsson kurum serisi künyesiyle, Le Quellec 2021 DOI ile bağlandı. Envanterin yetmiş yıllık olduğu işaretlendi.");

kur("olum-kokeni-tip-dagilimi", [S.george, S.kojikiIzanagi, S.abrahamsson],
  [
    E("Dört tip birbirinden yapısal olarak farklıdır: kaza, kayıp, ceza ve pazarlık.", "abrahamsson-1951-origin-of-death", "Tipoloji", "direct", "dort-tip"),
    E("Mezopotamya tipi: Gılgamış gençlik otunu çıkarır, bir yılan çalar - elde edilip kaybedilen nesne.", "george-2003-babylonian-gilgamesh", "XI. tablet, gençlik otu", "direct", "gilgamis-gencklik-otu"),
    E("Japon tipi: İzanagi ve İzanami arasındaki günlük ölüm ve doğum pazarlığı - sayısal anlaşma.", "kojiki-izanagi", "İzanagi-İzanami bölümü", "direct", "kojiki-pazarlik"),
    E("Hint geleneğinde soru 'ölüm neden var' değil 'döngüden nasıl çıkılır' hâline gelir - eksik bir cevap değil, farklı bir soru.", "abrahamsson-1951-origin-of-death", "Karşılaştırmalı çerçeve", "inference", "hint-farkli-soru"),
  ],
  [
    E("Tipler saf değildir; aynı bölgede birden fazla tip bulunabilir ve karma anlatımlar vardır.", "abrahamsson-1951-origin-of-death", "Tipoloji sınırları", "counter", "tipler-saf-degil"),
    E("Tip sınıflandırmasının kendisi analistin kurduğu bir birimdir; doğal bir kategori değil.", "abrahamsson-1951-origin-of-death", "Birim sorunu", "counter", "tip-analistin-birimi"),
    E("Hint geleneğine ilişkin satır bu kayıtta AYRI BİR KAYNAĞA bağlanmadı; karşılaştırmalı çerçeveden yapılan bir çıkarımdır.", "abrahamsson-1951-origin-of-death", "Kayıt düzeyi sınırı", "context", "hint-satiri-cikarim"),
  ],
  "George 2003 ve Kojiki künyelendi; Hint satırının çıkarım olduğu işaretlendi.");

kur("khoisan-arkaik-varyant", [S.lequellec, S.abrahamsson, S.tehraniDhuy],
  [
    E("Motifin Afrika içi dağılımı bölgesel analiz ve filogenetik araçlarla incelendi.", "lequellec-2021-afrique-pourquoi-meurt-on", "Yöntem", "claim-origin", "bolgesel-analiz"),
    E("En arkaik varyant - mesajın tek haberciyle taşınıp yolda bozulduğu biçim - Khoisan bölgesinde köklenmiş görünüyor.", "lequellec-2021-afrique-pourquoi-meurt-on", "Sonuçlar", "claim-origin", "arkaik-varyant-khoisan"),
    E("Motifin Afrika içi envanteri bu sonucun dayandığı malzemeyi sağlar.", "abrahamsson-1951-origin-of-death", "Envanter", "context", "envanter-malzemesi"),
  ],
  [
    E("Araştırmacı beklenen cevabı önceden biliyordu - doğrulama yanlılığı riski yüksek.", "lequellec-2021-afrique-pourquoi-meurt-on", "Yöntem tartışması", "counter", "dogrulama-yanliligi"),
    E("Yöntem hâlâ kalibre edilmedi: mit filogenetiği cevabı bağımsız olarak bilinen vakalarda sınanmadı.", "tehrani-dhuy-2016-phylogenetics-folklore", "Kalibrasyon sorunu", "counter", "kalibre-edilmedi"),
    E("Misyoner aracılı derleme sorunu bu motif için özellikle ağır.", "lequellec-2021-afrique-pourquoi-meurt-on", "Derleme eleştirisi", "counter", "misyoner-sorunu-agir"),
    E("YAZAR DÜZELTMESİ: bu kaynağın yazarı Jean-Loïc Le Quellec'tir; önceki sürümde künye d'Huy'ye yakın duruyordu ve karışma riski taşıyordu.", "lequellec-2021-afrique-pourquoi-meurt-on", "Künye düzeyi", "context", "yazar-duzeltmesi"),
  ],
  "DENETİM DÜZELTMESİ: 'En Afrique, pourquoi meurt-on ?' yazarı crossref'e göre Le Quellec'tir. Künye ona göre yazıldı ve düzeltme kayda geçirildi.");

kur("everywhen-dogrusal-olmayan-zaman", [S.stanner, S.morphy],
  [
    E("Stanner kavramı 'everywhen' (her-zaman) terimiyle karşıladı: geçmiş, şimdi ve gelecek aynı anda mevcut.", "stanner-1979-white-man-got-no-dreaming", "'The Dreaming' denemesi", "direct", "everywhen-terimi"),
    E("Yaratılış Rüya ile bitmedi; atasal varlıklar ve çocuk-ruhlar ezelîdir.", "stanner-1979-white-man-got-no-dreaming", "'The Dreaming' denemesi", "direct", "yaratilis-bitmedi"),
    E("Törensel bağlamda geçmiş şimdiye dönüşür.", "morphy-1998-aboriginal-art", "Tören ve sanat bölümü", "direct", "toren-gecmisi-simdiye"),
  ],
  [
    E("'Avustralya yerli gelenekleri' tek bir şey değildir; yüzlerce ayrı dil ve gelenek vardır ve bu genelleme kaba bir taramadır.", "morphy-1998-aboriginal-art", "Bölgesel çeşitlilik", "counter", "tek-gelenek-degil"),
    E("Kavram tek bir sözcükle çevrilemiyor; bu kayıt kavramı dışarıdan tarif eder, içeriden bir aktarım iddiası taşımaz.", "stanner-1979-white-man-got-no-dreaming", "Kayıt düzeyi ayrımı", "context", "disaridan-tarif"),
    E("Stanner'ın denemesinin tarihi çözülmüş değil: yaygın olarak 1953 anılır, ilk basımı 1956 antolojisidir. Bu kayıt 1979 akademik derlemesini künyeliyor.", "stanner-1979-white-man-got-no-dreaming", "Künye düzeyi", "context", "stanner-tarih-celiskisi"),
  ],
  "Stanner 1979 derlemesi künyelenebilir çıpa olarak kullanıldı (tufan dosyasıyla aynı çözüm); Morphy 1998 eklendi.");

kur("monomit-evrensel-degil", [S.campbell, S.dundes2005, S.segal, S.george, S.jorgensen],
  [
    E("Aynı malzemeye bakan üç analist üç FARKLI liste çıkardı: Rank doğum anlatılarına, Raglan 22 maddeye, Campbell 17 aşamaya. Kalıp veride olsaydı yakınsama beklenirdi; yakınsamadılar.", "segal-1990-in-quest-of-the-hero", "Üç kalıbın karşılaştırması", "direct", "uc-farkli-liste"),
    E("Kalıbın kendisi Campbell'ın 1949 tarihli kitabında sunulur.", "campbell-1949-hero-thousand-faces", "Monomit şeması", "claim-origin", "kalibin-kaynagi"),
    E("Kalıba uymayan merkezî metinler var: Gılgamış gençlik otunu elde eder ama yılana kaptırır - 'iksirle dönüş' aşaması yoktur.", "george-2003-babylonian-gilgamesh", "XI. tablet", "counter", "gilgamis-uymuyor"),
    E("Folklor disiplininin teoriye itirazı, kaynak seçme yanlılığı ve yanlışlanamazlık üzerinden kurulur.", "dundes-2005-folkloristics-21st-century", "Kuram eleştirisi", "direct", "folklor-itirazi"),
  ],
  [
    E("Anlatılarda gerçek düzenlilikler vardır; bu kayıt onların varlığını değil, monomitin evrensellik iddiasını reddeder.", "dundes-2005-folkloristics-21st-century", "Kayıt düzeyi ayrımı", "context", "duzenlilikler-var"),
    E("'Neredeyse oybirliği' bir sayım değil, alan içi değerlendirmelere dayanan nitel bir ifadedir.", "jorgensen-folklorists-campbell", "İfade düzeyi", "counter", "oybirligi-sayim-degil"),
    E("Kalıp bir SENARYO ARACI olarak fiilen çalışır; itiraz araca değil, aracın keşif diye sunulmasınadır.", "campbell-1949-hero-thousand-faces", "Kayıt düzeyi ayrımı", "context", "arac-olarak-calisiyor"),
    E("Düzenbaz anlatılarının kalıba uymadığı gözlemi bu kayıtta AYRI BİR KAYNAĞA bağlanmadı.", "dundes-2005-folkloristics-21st-century", "Kayıt düzeyi sınırı", "context", "duzenbaz-kaynaksiz"),
  ],
  "Segal 1990, Dundes 2005 (DOI) ve Campbell 1949 künyelendi. Campbell 'popular' katmanında ve claim-origin olarak işaretlendi - folklor disiplini onu hakemli çalışma saymaz.");

kur("monomit-geri-besleme-dongusu", [S.campbell, S.vogler, S.dundes2005, S.jorgensen],
  [
    E("Kalıp 1980'lerde bir stüdyo içi not aracılığıyla senaryo yazımı reçetesine çevrildi ve sonra kitaplaştırıldı.", "vogler-2007-writers-journey", "Kitabın kendi tarihçesi", "direct", "studyo-notu"),
    E("Şablon senaryo eğitiminde ve yazarlık kılavuzlarında standart hâle geldi.", "vogler-2007-writers-journey", "Şablonun yayılımı", "direct", "sablon-standart"),
    E("Kalıbın kaynağı Campbell'ın 1949 tarihli şemasıdır.", "campbell-1949-hero-thousand-faces", "Monomit şeması", "claim-origin", "kaynak-campbell"),
    E("Aynı mekanizma serinin başka yerlerinde de görüldü: turizm anlatısının kendi kanıtını üretmesi, popüler kaynakların birbirini kopyalayarak 'çok kaynak' görünümü yaratması.", "dundes-2005-folkloristics-21st-century", "Kanıt üretimi", "context", "ayni-mekanizma"),
  ],
  [
    E("Şablonun sinema anlatısına yayılma oranı bu kayıtta niceliksel olarak ölçülmedi; mekanizma tarif edildi, büyüklüğü verilmedi.", "vogler-2007-writers-journey", "Kayıt düzeyi sınırı", "counter", "olcek-verilmedi"),
    E("Kalıp bir anlatı aracı olarak gerçekten çalışır ve iyi yapılandırılmış hikâyeler üretir; bu kayıt aracı değil, 'keşfedilmiş evrensel yapı' iddiasını hedef alır.", "jorgensen-folklorists-campbell", "Kayıt düzeyi ayrımı", "context", "arac-calisiyor"),
  ],
  "Vogler 2007 künyelendi - geri besleme döngüsünün somut halkası artık kaynaklı.");

kur("kapsam-disiplini-ilkesi", [S.propp, S.campbell, S.popper],
  [
    E("Propp'un iddiası tanımlı bir derlemedeki sihirli masallarla sınırlıydı ve bu yüzden sınanabilir.", "propp-1968-morphology-folktale", "Külliyat tanımı", "direct", "propp-tanimli-kulliyat"),
    E("Monomitin külliyatı tanımlı değildir; hangi anlatıların dahil olduğu baştan belirlenmemiştir.", "campbell-1949-hero-thousand-faces", "Kapsam", "counter", "monomit-tanimsiz"),
    E("Bir iddianın değeri neyi DIŞARIDA BIRAKTIĞIYLA ölçülür.", "popper-1959-logic-scientific-discovery", "Yanlışlanabilirlik ölçütü", "direct", "disarida-birakma"),
  ],
  [
    E("Propp'un çözümlemesi de eleştirildi: işlev birimlerinin esnekliği ve külliyat seçimi tartışıldı. Buradaki üstünlük sonuçta değil, yöntemde - iddia sınanabilir biçimde kurulmuştu.", "propp-1968-morphology-folktale", "Eleştiriler", "counter", "propp-da-elestirildi"),
    E("Popper'ın ölçütü bilim felsefesinde tartışmalıdır; burada mutlak bir standart olarak değil, iki iddiayı karşılaştırmak için kullanılıyor.", "popper-1959-logic-scientific-discovery", "Ölçütün konumu", "context", "popper-tartismali"),
  ],
  "Propp, Campbell ve Popper künyelendi. Popper ölçütünün tartışmalı olduğu ayrıca işaretlendi - kayıt onu mutlak standart gibi kullanıyordu.");

kur("ates-hirsizligi-zorunlu-motif", [S.hesiodosProm, S.tehrani2023, S.radin],
  [
    E("Prometheus tanrılardan ateşi ÇALAR ve sonsuza kadar cezalandırılır.", "hesiodos-prometheus", "Theogonia, Prometheus bölümü", "direct", "prometheus-ceza"),
    E("Māui ateşi Mahuika'dan tırnak tırnak ALIR ve tüketir; kaçar, cezalandırılmaz; ateş ağaçlara sığınır ve bu, sürtmeyle ateş yakmayı açıklar.", "tehrani-2023-cultural-transmission-folk-narratives", "Motif varyantları", "direct", "maui-cezasiz"),
    E("Kuzgun anlatısının çekirdeği ateş değil IŞIK hırsızlığıdır; ateş yalnızca bazı anlatımlarda geçer.", "radin-1956-trickster", "Kuzgun döngüsü", "direct", "kuzgun-isik"),
    E("Ortak olan yalnızca en soyut düzeyde: ateş başlangıçta insanlarda değil, birinde var, kurnaz bir figür alıyor, insanlar kullanabiliyor.", "tehrani-2023-cultural-transmission-folk-narratives", "Soyutlama düzeyi", "direct", "soyut-ortaklik"),
  ],
  [
    E("Bölgesel alt-desenler bilgilendirici OLABİLİR: belirli bir bölgede paylaşılan keyfî ayrıntılar temas ya da yerel ortak köken gösterebilir. Bu kayıt o düzeye inmemiştir.", "tehrani-2023-cultural-transmission-folk-narratives", "Alt-desen çözümlemesi", "counter", "alt-desenler-incelenmedi"),
    E("'Polinezya' ve 'Kuzeybatı Kıyısı' başlıkları çok sayıda ayrı geleneği kapsar.", "tehrani-2023-cultural-transmission-folk-narratives", "Gruplama sorunu", "counter", "basliklar-kaba"),
    E("Vedik Mātariśvan örneği bu kayıtta AYRI BİR KAYNAĞA bağlanmadı.", "tehrani-2023-cultural-transmission-folk-narratives", "Kayıt düzeyi sınırı", "context", "vedik-ornek-kaynaksiz"),
  ],
  "Hesiodos, Tehrani 2023 ve Radin 1956 künyelendi. Vedik örneğin kaynaksız olduğu işaretlendi.");

kur("hilebaz-kategorisi-uretilmis", [S.radin, S.tehrani2023, S.jorgensen],
  [
    E("Prometheus, Māui, Kuzgun ve Çakal genellikle aynı başlık altında toplanır.", "radin-1956-trickster", "Kategori tanımı", "claim-origin", "ayni-baslik-altinda"),
    E("Kategori 19.-20. yüzyıl antropolojisinde tanımlandı ve sonra evrensel olarak 'bulundu'.", "radin-1956-trickster", "Kategorinin tarihçesi", "direct", "kategori-tanimlandi"),
    E("Kategoriye alınan vakalar temel özelliklerde ayrışıyor: ceza, alınan şey, alanın türü.", "tehrani-2023-cultural-transmission-folk-narratives", "Vaka karşılaştırması", "direct", "vakalar-ayrisiyor"),
  ],
  [
    E("Kültür kahramanı figürünün yaygınlığı gerçek bir SOSYOLOJİK düzenlilik olabilir ve insan topluluklarının anlatı ihtiyaçları hakkında bir şey söyleyebilir.", "tehrani-2023-cultural-transmission-folk-narratives", "Alternatif okuma", "counter", "sosyolojik-duzenlilik"),
    E("Bu kayıt kategorinin işe yaramaz olduğunu söylemez; 'yaygın olması ortak kökene kanıttır' çıkarımını reddeder. İkisi ayrı iddialardır.", "jorgensen-folklorists-campbell", "Kayıt düzeyi ayrımı", "context", "kategori-isesiz-degil"),
  ],
  "Radin 1956 künyelendi - kategorinin kurucu incelemesi artık claim-origin olarak bağlı.");

kur("ulker-takvim-bagimsiz-icat", [S.hesiodosUlker, S.ruggles, S.halkTakvimi],
  [
    E("Hesiodos doğuşunda hasat, batışında sürüm önerir; denizciliğin güvenli mevsimi de buna bağlanır.", "hesiodos-isler-ve-gunler-ulker", "İşler ve Günler", "direct", "hesiodos-takvimi"),
    E("And Dağları'nda haziranda kümenin parlaklığına bakılarak patates ekim tarihi belirlenir.", "ruggles-2005-ancient-astronomy", "And Dağları maddesi", "direct", "and-daglari-patates"),
    E("Maori geleneğinde kümenin yeniden görünmesi (Matariki) yılbaşıdır.", "ruggles-2005-ancient-astronomy", "Matariki maddesi", "direct", "matariki-yilbasi"),
    E("Anadolu halk takviminde de Ülker mevsim işareti olarak kullanılır.", "karadeniz-halk-takvimi", "Halk takvimi bölümü", "direct", "anadolu-halk-takvimi"),
    E("Kullanım ezici çoğunlukla mevsim ve tarım zamanlamasıdır - ortak kökene değil ORTAK SORUNA işaret eder.", "ruggles-2005-ancient-astronomy", "Karşılaştırmalı döküm", "direct", "ortak-sorun"),
  ],
  [
    E("Kullanım biçimlerindeki ayrıntılar (hangi eşik, hangi ürün, hangi tören) bölgesel olarak farklıdır ve bunların bir kısmı temasla yayılmış olabilir.", "ruggles-2005-ancient-astronomy", "Bölgesel farklar", "counter", "ayrintilar-farkli"),
    E("Anadolu geleneği bu kayıtta yüzeysel ele alınmıştır; kullanılan Türkçe kaynak kurumsal bir kültür sayfasıdır, hakemli bir halkbilim çalışması değil.", "karadeniz-halk-takvimi", "Kaynak düzeyi sınırı", "counter", "anadolu-yuzeysel"),
    E("Japonca 'Subaru' etimolojisi bu kayıtta ayrı bir kaynağa bağlanmadı.", "ruggles-2005-ancient-astronomy", "Kayıt düzeyi sınırı", "context", "subaru-kaynaksiz"),
  ],
  "Ruggles 2005 künyelendi. Türkçe kaynağın hakemli olmadığı açıkça yazıldı - konu Anadolu takvimi olduğu için kaynak doğal, ama düzeyi işaretlenmeli.");

kur("yedi-kiz-kardes-derin-koken", [S.norris, S.ruggles, S.tehraniDhuy],
  [
    E("Çıplak gözle çoğu insan altı yıldız seçer ama pek çok gelenek kümeyi yedi olarak sayar - ayrıntı gökyüzü tarafından dayatılmıyor.", "norris-2021-seven-sisters", "Gözlem argümanı", "claim-origin", "alti-mi-yedi-mi"),
    E("Pek çok gelenekte anlatı 'yedi kız kardeş' biçimindedir ve sık sık birinin kayıp ya da saklanmış olduğu ayrıntısını taşır.", "norris-2021-seven-sisters", "Motif dökümü", "claim-origin", "kayip-kiz-kardes"),
    E("Pleione ve Atlas'ın öz hareketi hesaplanabilir; geçmişte açısal ayrımları daha genişti.", "norris-2021-seven-sisters", "Astrometrik hesap", "direct", "oz-hareket"),
  ],
  [
    E("Yüz bin yıllık anlatı kararlılığı için bir MEKANİZMA sunulmuyor; bu, alanın denediği en uzun zaman ölçeğidir ve mit filogenetiği henüz kalibre edilmedi.", "tehrani-dhuy-2016-phylogenetics-folklore", "Zaman ölçeği sorunu", "counter", "mekanizma-yok"),
    E("'Yedi' bağımsız olarak yüklü bir sayıdır: gezegen sayısı, hafta günü, tekrarlayan anlatı kalıpları. Bir gelenek yedi sayıyorsa sebep gökyüzü değil sayının kendisi olabilir.", "ruggles-2005-ancient-astronomy", "Sayı sembolizmi", "counter", "yedi-yuklu-sayi"),
    E("Görülen yıldız sayısı sabit değildir; göz keskinliğine, gökyüzü karanlığına ve havaya göre değişir.", "ruggles-2005-ancient-astronomy", "Gözlem koşulları", "counter", "yildiz-sayisi-degisken"),
    E("'Çoğu kültür yedi diyor' ifadesi sayılmamıştır; hangi gelenekler, hangi derlemelerden ve sömürge dönemi teması elenerek mi - bunlar gösterilmemiştir.", "norris-2021-seven-sisters", "Örneklem", "counter", "sayilmadi"),
    E("Öneri astronomlardan gelmektedir, folklorculardan değil.", "norris-2021-seven-sisters", "Yazarların alanı", "context", "astronomlardan-geliyor"),
  ],
  "Norris & Norris 2021 DOI ile künyelendi ve claim-origin olarak işaretlendi. Önceki sürümde arXiv adresi vardı; yayımlanmış bölüm künyesi eklendi.");

kur("zorunlu-keyfi-ekseni", [S.tehraniDhuy, S.tehrani2023],
  [
    E("Zorunlu uçtaki örnekler: fırtına tanrısının yılanı öldürmesi, ateşin başkasından alınması, Ülker'in takvim olarak kullanılması. Üçü de yaygın, üçü de bilgilendirici değil.", "tehrani-dhuy-2016-phylogenetics-folklore", "Motif bilgi değeri", "direct", "zorunlu-uc"),
    E("Keyfî uçtaki örnekler: Büyük Ayı'nın avlanan hayvan olması, Ülker'in 'yedi kız kardeş, biri kayıp' anlatısı. İkisi de dağınık, ikisi de açıklanmayı hak ediyor.", "tehrani-dhuy-2016-phylogenetics-folklore", "Keyfî ayrıntı ölçütü", "direct", "keyfi-uc"),
    E("Aynı nesne (Ülker) ekseni iki ucundan birden gösteriyor: kullanımı zorunlu, sayımı keyfî.", "tehrani-2023-cultural-transmission-folk-narratives", "Ölçüt uygulaması", "inference", "ulker-iki-uc"),
  ],
  [
    E("'Keyfî' ölçütü niceliksel değildir; neyin keyfî sayılacağı yorumcuya bağlıdır ve bu, ölçütün en zayıf noktasıdır.", "tehrani-dhuy-2016-phylogenetics-folklore", "Ölçüt tartışması", "counter", "keyfi-nicel-degil"),
    E("Ekseni bu biçimde formüle eden ayrı bir yayın bu kayıtta künyelenmedi; formülasyon bu projenin kendi derlemesidir.", "tehrani-2023-cultural-transmission-folk-narratives", "Kayıt düzeyi sınırı", "context", "formulasyon-projenin"),
  ],
  "Eksenin formülasyonunun bu projeye ait olduğu açıkça yazıldı - kayıt onu literatürden alınmış gibi sunuyordu.");

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
