#!/usr/bin/env node
// Persepolis dosyası: dört kaydın tamamı v2'ye.
//
// NEDEN BU DOSYA ÖNCE: en küçüğü (4 kayıt) ve tamamı bitirilebilir. Yarım
// bırakılan bir geçiş, geçmemiş olmaktan kötüdür - dosya hem eski hem yeni
// kurala göre okunmak zorunda kalır.
//
// ÖNCEKİ DURUMDA NE VARDI: dört kaydın bütün kaynaklarında YAZAR ve YIL
// alanları boştu. Iranica maddeleri "PERSEPOLIS ADMINISTRATIVE ARCHIVES"
// diye, yazarsız duruyordu; oysa maddenin altı imzalı yazarı var. Klasik
// kaynaklar (Arrianos, Diodoros, Plutarkhos) kitap-bölüm numarası olmadan
// duruyordu - yani "bu kaynak böyle diyor" denip nerede dediği
// gösterilmiyordu. v2'nin locator zorunluluğu tam olarak bunu kapatıyor.
//
// TÜRKÇE KAYNAK UYGULANMADI, gerekçesi: Persepolis İran'dadır; konunun
// doğal kaynak dilleri Farsça, İngilizce ve Elamcadır. Tabletlerin
// yayımlandığı yer Chicago, maddelerin yazıldığı yer Iranica. Türkçe
// literatür aramak burada konuya değil hedefe göre kaynak seçmek olurdu -
// Şuşter'de de aynı gerekçeyle uygulanmamıştı.
//
// DOĞRULANAN KÜNYELER (2026-09-09):
//   Hallock, Richard T. Persepolis Fortification Tablets. Oriental Institute
//   Publications 92. University of Chicago Press, 1969. ISBN 9780226621951.
//   2.087 Elamca metnin çeviri ve transliterasyonu. Tam metin ISAC ve
//   archive.org üzerinden açık erişim.
//
//   Azzoni, A.; Dusinberre, E. R. M.; Garrison, M. B.; Henkelman, W. F. M.;
//   Jones, C. E.; Stolper, M. W. "PERSEPOLIS ADMINISTRATIVE ARCHIVES."
//   Encyclopaedia Iranica, çevrimiçi basım, 2017.
//
//   Dandamayev, Muhammad A. "PERSEPOLIS ELAMITE TABLETS." Encyclopaedia
//   Iranica.
//
//   Rubin v. Islamic Republic of Iran, No. 16-534, ABD Yüksek Mahkemesi,
//   2018. Tabletlerin 1937'den beri ödünç statüsünde olduğu ve 71 milyon
//   dolarlık bir tazminat kararı için haczedilemeyeceği hükmü.
//
// TIER NOTU: Iranica maddeleri peer-reviewed olarak işaretlendi ama
// kaynak notunda BAŞVURU ESERİ MADDESİ oldukları yazıldı - özgün araştırma
// makalesi değiller. Okur ağırlığı kendi tartsın.
//
// SINIR: Iranica maddelerinin ve Hallock'un TAM METİNLERİ OKUNMADI.
// Künyeler, yazarlar ve maddelerin konusu doğrulandı; locator'lar madde
// veya kitap düzeyinde verildi, sayfa düzeyinde değil.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/persepolis.json";
const CHECKED = "2026-09-09";

/* --- kaynaklar ----------------------------------------------------- */

const hallock = source("hallock-1969-oip92-fortification-tablets", {
  tier: "primary",
  type: "edition",
  authors: ["Hallock, Richard T."],
  year: 1969,
  title: "Persepolis Fortification Tablets",
  container: "Oriental Institute Publications 92",
  publisher: "University of Chicago Press",
  isbn: "9780226621951",
  url: "https://isac.uchicago.edu/research/publications/oip/persepolis-fortification-tablets",
  language: "en",
  accessed: CHECKED,
  note:
    "2.087 Elamca Kale Tableti metninin transliterasyon ve çevirisi; Ahameniş Elamcası sözlüğü ve mühür kullanım anahtarı da içerir. " +
    "Tabletlerin kendisi birincil kaynaktır, bu yayın onlara erişim yoludur. Tam metin ISAC ve archive.org/details/oip92 üzerinden açık.",
});

const iranicaArsiv = source("iranica-2017-persepolis-admin-archives", {
  tier: "peer-reviewed",
  type: "article",
  authors: [
    "Azzoni, Annalisa",
    "Dusinberre, Elspeth R. M.",
    "Garrison, Mark B.",
    "Henkelman, Wouter F. M.",
    "Jones, Charles E.",
    "Stolper, Matthew W.",
  ],
  year: 2017,
  title: "PERSEPOLIS ADMINISTRATIVE ARCHIVES",
  container: "Encyclopaedia Iranica",
  url: "https://www.iranicaonline.org/articles/persepolis-admin-archive/",
  language: "en",
  accessed: CHECKED,
  note:
    "BAŞVURU ESERİ MADDESİ - özgün araştırma makalesi değil, alanın uzmanlarınca yazılmış ansiklopedi maddesi. " +
    "Kale Arşivi ve Hazine Arşivi'ni birlikte ele alır. Önceki sürümde bu kaynak YAZARSIZ ve YILSIZ duruyordu; altı yazarın adı burada eklendi.",
});

// KALDIRILAN KAYNAK - Dandamayev, "PERSEPOLIS ELAMITE TABLETS", Encyclopaedia
// Iranica. Kurucu haklı olarak reddetti: hakemli kaynakta yıl zorunlu ve bu
// maddenin yayın yılı doğrulanamadı (Iranica'nın basılı fasikül tarihi ile
// çevrimiçi güncelleme tarihi ayrışabiliyor). Yılı uydurmak yerine kaynak
// çıkarıldı - zaten hiçbir atıf ona bağlanmıyordu, yani kayıtta süs olarak
// duruyordu. Aynı konuyu 2017 tarihli, altı yazarlı arşiv maddesi karşılıyor.

const arrianos = source("arrianos-anabasis", {
  tier: "primary",
  type: "book",
  authors: ["Arrianos"],
  title: "Anabasis Alexandri",
  language: "grc",
  note: "MS 2. yüzyıl. Olaydan yaklaşık dört yüz yıl sonra, ama Ptolemaios ve Aristoboulos gibi çağdaş kaynaklara dayandığını söyler.",
});

const diodoros = source("diodoros-bibliotheca-17", {
  tier: "primary",
  type: "book",
  authors: ["Diodoros Sikelos"],
  title: "Bibliotheca Historica, XVII. kitap",
  language: "grc",
  note: "MÖ 1. yüzyıl. Thaïs anlatısının ana kaynaklarından.",
});

const plutarkhos = source("plutarkhos-iskender", {
  tier: "primary",
  type: "book",
  authors: ["Plutarkhos"],
  title: "Paralel Yaşamlar - İskender",
  language: "grc",
  note: "MS 1.-2. yüzyıl. Thaïs anlatısını verir.",
});

const rubin = source("rubin-v-iran-2018", {
  tier: "primary",
  type: "report",
  authors: ["Amerika Birleşik Devletleri Yüksek Mahkemesi"],
  year: 2018,
  title: "Rubin v. Islamic Republic of Iran, No. 16-534",
  publisher: "Supreme Court of the United States",
  language: "en",
  note:
    "Mahkeme kararı; hukuki birincil belge. Tabletlerin 1937'den beri ÖDÜNÇ statüsünde olduğunu ve " +
    "1997 saldırısı davacılarının 71 milyon dolarlık kararı için haczedilemeyeceğini hükmetti.",
});

const isacKoleksiyon = source("isac-persepolis-fortification-archive", {
  tier: "institutional",
  type: "webpage",
  title: "Persepolis Fortification Archive",
  institution: "Institute for the Study of Ancient Cultures, University of Chicago",
  url: "https://isac.uchicago.edu/research/publications/oip/persepolis-fortification-tablets",
  language: "en",
  accessed: CHECKED,
  note: "Koleksiyonu elinde tutan kurumun kendi sayfası - taraf kaynak olarak okunmalı.",
});

/* --- 1) Köle emeği değil -------------------------------------------- */

const koleEmegi = finding({
  id: "persepolis-kole-emegi-degil",
  claim:
    "Persepolis'i köleler inşa etmedi; Kale Tabletleri ücretli, tayınla ödenen ve kadınları da içeren örgütlü bir işgücü belgeliyor.",
  status: "established",
  confidence: "high",
  topic: ["persepolis", "iran", "ahamenis", "emek-tarihi"],
  subject: {
    site: "Persepolis",
    site_native: "Parsa",
    region: "Fars, Marvdaşt ovası",
    modern_country: "İran",
    coordinates: { lat: 29.9354, lon: 52.8916 },
  },
  period: {
    earliest: -509,
    latest: -457,
    era_label: "Kale Tabletleri arşivinin kapsadığı yıllar",
    precision: "approximate",
    dating_method: ["textual"],
  },
  languages: ["Elamca", "Aramice"],
  disciplines: ["arkeoloji", "tarih", "filoloji"],
  popular_claim: "Persepolis ve benzeri Pers anıtları köle emeğiyle inşa edildi.",
  divergence:
    "Köle imgesi büyük ölçüde Yunan kaynaklarının Pers tasvirinden ve modern popüler kültürden geliyor. 1933-38'de bulunan Kale ve Hazine tabletleri ise devlet ekonomisinde herkesin sabit bir tayın ölçeğinde olduğunu gösteriyor - bir kısmı tek kişinin tüketemeyeceği miktarda, yani fiilen mal cinsinden maaş.",
  divergence_type: ["somurge-anlatisi", "medya-abartisi"],
  sources: [hallock, iranicaArsiv],
  evidence: [
    ev(
      "Tabletler erkek ve kadın işçilere yapılan tayın ve ücret ödemelerini tek tek kaydediyor.",
      cite("hallock-1969-oip92-fortification-tablets", "Tayın metinleri, kategori tasnifi", "direct"),
      { id: "tayin-kayitlari" },
    ),
    ev(
      "Ödemeler gümüş ve gıda tayını olarak yapılıyor; ölçek beceriye göre değişiyor.",
      cite("hallock-1969-oip92-fortification-tablets", "İdari sistem çözümlemesi", "direct"),
      { id: "gumus-ve-tayin" },
    ),
    ev(
      "Bazı kadın işçiler, benzer konumdaki erkeklerden daha yüksek tayın alıyor.",
      cite("hallock-1969-oip92-fortification-tablets", "İşçi grupları tayın cetvelleri", "direct"),
      { id: "kadin-isciler-yuksek-tayin" },
    ),
    ev(
      "Arşiv, Pers yönetimi üzerine elimizdeki en büyük tutarlı belge kümesi.",
      cite("iranica-2017-persepolis-admin-archives", "Arşivin kapsamı", "context"),
      { id: "en-buyuk-belge-kumesi" },
    ),
  ],
  counter_evidence: [
    ev(
      "Ücretli olmak modern anlamda özgür emek demek değil; işgücünün bir bölümü zorunlu hizmet veya bağımlı statüde olabilir.",
      cite("iranica-2017-persepolis-admin-archives", "İşgücü statüsü tartışması", "counter"),
      { id: "ucretli-ozgur-degil" },
    ),
    ev(
      "Tabletler yalnızca devlet sektörünü kaydediyor; kayıt dışı emek görünmüyor.",
      cite("hallock-1969-oip92-fortification-tablets", "Arşivin kapsam sınırı", "counter"),
      { id: "kayit-disi-emek-gorunmez" },
    ),
    ev(
      "Bu kayıttaki locator'lar madde ve kitap düzeyindedir, sayfa düzeyinde değil: kaynakların tam metinleri okunmadı.",
      cite("hallock-1969-oip92-fortification-tablets", "Kayıt düzeyi sınırı", "context"),
      { id: "locator-sayfa-duzeyinde-degil" },
    ),
  ],
  open_questions: [
    "İşgücünün ne kadarı gönüllü, ne kadarı zorunlu hizmetti - tayın kaydı bu ayrımı vermiyor.",
  ],
  checked: CHECKED,
  used_in: ["persepolis"],
  review: {
    status: "draft",
    notes: "Kaynakların yazarları ve künyeleri tamamlandı. Yılı doğrulanamayan bir Iranica maddesi (Dandamayev) kayıttan ÇIKARILDI - hiçbir atıf ona bağlanmıyordu. Tam metinler okunmadı; locator'lar madde/kitap düzeyinde.",
  },
});

/* --- 2) Yangın kasıtlı mıydı ---------------------------------------- */

const yangin = finding({
  id: "persepolis-yangin-kasitli-miydi",
  claim: "Persepolis MÖ 330'da İskender tarafından bilinçli bir siyasi karar sonucu yakıldı.",
  status: "contested",
  confidence: "high",
  topic: ["persepolis", "iran", "iskender", "kaynak-elestirisi"],
  subject: {
    site: "Persepolis",
    site_native: "Parsa",
    region: "Fars, Marvdaşt ovası",
    modern_country: "İran",
    coordinates: { lat: 29.9354, lon: 52.8916 },
  },
  period: {
    earliest: -330,
    latest: -330,
    era_label: "İskender'in Persepolis'i alışı",
    precision: "exact",
    dating_method: ["historical-record", "stratigraphy"],
  },
  languages: ["Yunanca"],
  disciplines: ["tarih", "arkeoloji"],
  people: [{ name: "İskender (III. Aleksandros)", role: "excavator", year: -330 }],
  popular_claim:
    "İskender, sarhoş bir şölende Thaïs adlı kadının kışkırtmasıyla sarayı ateşe verdi.",
  divergence:
    "Antik kaynaklar ikiye ayrılıyor ve ikisi de aynı anda doğru olamaz. Popüler anlatı hep dramatik olanı seçiyor; oysa bu, kaynakların hangisine güveneceğimize dair çözülmemiş bir sorun. ARKEOLOJİ YANGINI DOĞRULUYOR AMA NİYETİ OKUYAMIYOR - yanık tabaka 'neden' sorusuna cevap vermez.",
  divergence_type: ["hayatta-kalma-yanliligi", "medya-abartisi"],
  sources: [arrianos, diodoros, plutarkhos, iranicaArsiv],
  evidence: [
    ev(
      "Arkeoloji büyük bir yangını kesin biçimde doğruluyor - yanık tabaka ve ısı hasarı belirgin.",
      cite("iranica-2017-persepolis-admin-archives", "Arşivin yanmış tabakada bulunması", "direct"),
      { id: "yanik-tabaka" },
    ),
    ev(
      "Arrianos yakmayı, Parmenion'un itirazına karşı alınmış, Yunanistan'ın intikamı gerekçeli BİLİNÇLİ BİR SİYASİ KARAR olarak anlatır.",
      cite("arrianos-anabasis", "Anabasis 3.18", "claim-origin"),
      { id: "arrianos-siyasi-karar" },
    ),
  ],
  counter_evidence: [
    ev(
      "Diodoros olayı şölen sırasında, Thaïs'in kışkırtmasıyla alınmış ani ve sarhoş bir karar olarak anlatır - Arrianos'unkiyle bağdaşmayan bir anlatı.",
      cite("diodoros-bibliotheca-17", "Bibliotheca Historica 17.72", "counter"),
      { id: "diodoros-solen-anlatisi" },
    ),
    ev(
      "Plutarkhos da Thaïs anlatısını verir; yani 'sarhoş şölen' sürümü tek kaynağa dayanmıyor.",
      cite("plutarkhos-iskender", "İskender 38", "counter"),
      { id: "plutarkhos-thais" },
    ),
    ev(
      "Antik yazarların hiçbiri olaya tanık değildi; anlatılar yüzyıllar sonra derlendi. Diodoros olaydan ~270, Plutarkhos ~400, Arrianos ~450 yıl sonra yazdı.",
      cite("arrianos-anabasis", "Yazarın kendi kaynak beyanı", "context"),
      { id: "hicbiri-tanik-degil" },
    ),
    ev(
      "İki anlatı da İskender'in imajını farklı yönde biçimlendirme amacı taşıyabilir: biri hesaplı devlet adamı, öteki denetimsiz fatih.",
      cite("plutarkhos-iskender", "Biyografik amaç", "context"),
      { id: "imaj-bicimlendirme" },
    ),
  ],
  open_questions: [
    "Yangın kasıtlı mı, kazara mı - arkeoloji yangını doğruluyor ama niyeti okuyamıyor.",
    "Arrianos'un dayandığını söylediği çağdaş kaynaklar bu noktada ne diyordu? Metinler kayıp.",
  ],
  checked: CHECKED,
  used_in: ["persepolis"],
  review: {
    status: "draft",
    notes:
      "Klasik kaynaklara kitap-bölüm locator'ları eklendi; önceki sürümde kaynaklar 'böyle diyor' denip nerede dediği gösterilmiyordu. Metinler basılı edisyonlardan doğrulanmadı.",
  },
});

/* --- 3) Tabletlerin mülkiyeti --------------------------------------- */

const mulkiyet = finding({
  id: "persepolis-tabletlerin-mulkiyeti",
  claim:
    "1933-38'de bulunan Persepolis tabletlerinin büyük bölümü hâlâ İran dışında ve mülkiyet süreci kapanmadı.",
  status: "unknown",
  confidence: "medium",
  topic: ["persepolis", "iran", "mulkiyet", "arsiv"],
  subject: {
    site: "Persepolis Kale Arşivi",
    region: "Fars - Chicago",
    modern_country: "İran",
    coordinates: { lat: 29.9354, lon: 52.8916 },
  },
  period: {
    earliest: 1933,
    latest: 2026,
    era_label: "Kazıdan bugüne",
    precision: "range",
    dating_method: ["historical-record"],
  },
  disciplines: ["arkeoloji", "tarih", "hukuk"],
  popular_claim:
    "Tabletler Batılı bir müze tarafından alınıp götürüldü; yani bir yağma vakasıdır.",
  divergence:
    "Hukuki statü 'yağma' değil ÖDÜNÇTÜR: koleksiyon 1937'den beri incelenmek üzere ödünç verilmiş sayılıyor ve iadeler partiler hâlinde sürüyor. Ama bu, süreci masum yapmıyor - doksan yıl sürmüş bir 'inceleme ödüncü'nün kendisi sorulacak bir şey. Üstelik tabletler İran'la ilgisiz bir davada HACİZ HEDEFİ oldu: 1997 saldırısı mağdurları 71 milyon dolarlık tazminat kararlarını tahsil için koleksiyona el koymak istedi. ABD Yüksek Mahkemesi 2018'de bunu reddetti. Yani tabletlerin bugün Chicago'da olmasının sebebi tek başına arkeoloji değil, aynı zamanda hukuk.",
  divergence_type: ["kategori-hatasi", "guncellenmemis"],
  sources: [isacKoleksiyon, rubin, iranicaArsiv, hallock],
  evidence: [
    ev(
      "Tabletler 1933-34 ve 1936-38 kazılarında bulundu ve incelenmek üzere Chicago'ya götürüldü.",
      cite("iranica-2017-persepolis-admin-archives", "Arşivin bulunuş ve taşınma tarihçesi", "direct"),
      { id: "kazi-ve-tasinma" },
    ),
    ev(
      "Koleksiyonun büyük bölümü hâlâ Chicago'da; 2100'den fazla metin orada yayımlandı.",
      cite("hallock-1969-oip92-fortification-tablets", "Yayımlanan metin sayısı", "direct"),
      { id: "chicago-da-kalan" },
    ),
    ev(
      "Bir kısmı partiler hâlinde İran'a iade edildi.",
      cite("isac-persepolis-fortification-archive", "Kurumun iade beyanı", "direct"),
      { id: "kismi-iadeler" },
    ),
    ev(
      "ABD Yüksek Mahkemesi 2018'de, tabletlerin 1937'den beri ödünç statüsünde olduğunu ve bir tazminat kararı için haczedilemeyeceğini hükmetti.",
      cite("rubin-v-iran-2018", "Rubin v. Islamic Republic of Iran, No. 16-534", "direct"),
      { id: "yuksek-mahkeme-2018" },
    ),
  ],
  counter_evidence: [
    ev(
      "İade edilen partilerin tarihleri ve sayıları bu kayıtta DOĞRULANMADI; 'partiler hâlinde' ifadesi kurumun beyanına dayanıyor, bağımsız bir döküme değil.",
      cite("isac-persepolis-fortification-archive", "Kayıt düzeyi sınırı", "counter"),
      { id: "iade-dokumu-dogrulanmadi" },
    ),
    ev(
      "Koleksiyonu elinde tutan kurumun kendi sayfası bu konuda TARAF KAYNAKTIR; İran tarafının resmî konumu bu kayıtta temsil edilmiyor.",
      cite("isac-persepolis-fortification-archive", "Kaynak konumu", "counter"),
      { id: "taraf-kaynak" },
    ),
  ],
  open_questions: [
    "Kalan tabletlerin iadesi ve yayın hakları nasıl çözülecek?",
    "İade edilen partilerin tarihleri ve sayıları nedir? Bağımsız bir döküm bulunamadı.",
    "İran tarafının resmî konumu ne? Farsça kaynak taranmadı.",
  ],
  checked: CHECKED,
  used_in: ["persepolis"],
  review: {
    status: "draft",
    notes:
      "Kayıt boş popular_claim ve divergence ile duruyordu - yani bu projenin temel ayrımı orada hiç kurulmamıştı. Yüksek Mahkeme kararı eklenerek kuruldu.",
  },
});

/* --- 4) Tören başkenti ---------------------------------------------- */

const torenBaskenti = finding({
  id: "persepolis-toren-baskenti",
  claim: "Persepolis imparatorluğun idari başkenti değil, tören başkentiydi.",
  status: "established",
  confidence: "medium",
  topic: ["persepolis", "iran", "ahamenis", "yonetim"],
  subject: {
    site: "Persepolis",
    site_native: "Parsa",
    region: "Fars, Marvdaşt ovası",
    modern_country: "İran",
    coordinates: { lat: 29.9354, lon: 52.8916 },
  },
  period: {
    earliest: -518,
    latest: -330,
    era_label: "I. Darius'tan yıkılışa",
    precision: "approximate",
    dating_method: ["textual", "stratigraphy"],
  },
  languages: ["Elamca", "Eski Farsça"],
  disciplines: ["arkeoloji", "tarih"],
  popular_claim: "Persepolis Pers İmparatorluğu'nun başkentiydi.",
  divergence:
    "İmparatorluğun gündelik yönetimi Susa, Babil ve Ekbatana üzerinden yürüyordu. Persepolis törensel ve simgesel bir merkezdi; yapı programı da bunu gösteriyor. AMA ayrımı fazla keskinleştirmemek gerekiyor: Kale Tabletleri sitede ciddi bir idari faaliyetin de yürüdüğünü belgeliyor. 'Yalnızca tören' demek, elimizdeki en büyük idari arşivin nereden çıktığını açıklamakta zorlanır.",
  divergence_type: ["guncellenmemis"],
  sources: [iranicaArsiv, hallock],
  evidence: [
    ev(
      "İdari yazışma ve yönetim kayıtları büyük ölçüde diğer merkezlerde yoğunlaşıyor.",
      cite("iranica-2017-persepolis-admin-archives", "Arşivin idari coğrafyası", "direct"),
      { id: "yonetim-diger-merkezlerde" },
    ),
    ev(
      "Apadana kabartmaları imparatorluğun halklarını armağan sunarken gösteriyor - idari değil törensel bir sahne.",
      cite("iranica-2017-persepolis-admin-archives", "Yapı programı ve ikonografi", "inference"),
      { id: "apadana-toren-sahnesi" },
    ),
    ev(
      "Yapı programı temsil ve tören ölçeğinde kurulmuş.",
      cite("iranica-2017-persepolis-admin-archives", "Yapı programı", "inference"),
      { id: "yapi-programi-toren" },
    ),
  ],
  counter_evidence: [
    ev(
      "Kale Tabletleri sitede ciddi bir idari faaliyet de olduğunu gösteriyor; 'yalnızca tören' ayrımı fazla keskin olabilir.",
      cite("hallock-1969-oip92-fortification-tablets", "Arşivin sitede üretilmiş olması", "counter"),
      { id: "sitede-idari-faaliyet" },
    ),
    ev(
      "Apadana kabartmalarının 'törensel' okuması bir ÇIKARIMDIR: kabartma sahnesinin gerçek bir töreni mi yoksa ideal bir düzeni mi gösterdiği ayrı bir tartışmadır.",
      cite("iranica-2017-persepolis-admin-archives", "İkonografi yorumu", "context"),
      { id: "kabartma-yorumu-cikarim" },
    ),
  ],
  open_questions: [
    "Törensel işlevin takvimdeki yeri - Nevruz bağlantısı sık öne sürülür ama doğrudan kanıtı tartışmalıdır.",
    "'Tören başkenti' ile 'idari merkez' ayrımı, arşivin varlığı karşısında nasıl korunuyor?",
  ],
  checked: CHECKED,
  used_in: ["persepolis"],
  review: {
    status: "draft",
    notes: "Kabartma yorumunun çıkarım olduğu açıkça işaretlendi; önceki sürümde doğrudan kanıt gibi duruyordu.",
  },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
for (const r of [koleEmegi, yangin, mulkiyet, torenBaskenti]) {
  const i = list.findIndex((x) => x.id === r.id);
  if (i === -1) { console.error("bulunamadı:", r.id); process.exit(1); }
  const onceki = list[i].schema_version ?? 1;
  list[i] = r;
  console.log(`  v${onceki} -> v2  ${r.id}`);
}
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
const v2 = list.filter((r) => r.schema_version === 2).length;
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${v2}${v2 === list.length ? "  DOSYA TAMAM" : ""}`);
