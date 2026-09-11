#!/usr/bin/env node
// antik-siteler.json, B grubu: Angkor (4), Petra (4), Chichén Itzá (3),
// Göbekli/Karahan (5), Sigiriya (3), Maya, Kapadokya, antik kanon. 22 kayıt.
// Dosya bununla tamamlanıyor (47/47).
//
// DEĞİŞTİRİLEN YER TUTUCULAR - "literatürü" diye yazılmış kaynak sözleri:
//   Angkor sonrası ziyaretçi kayıtları  -> Evans/Polkinghorne/Fletcher 2023 + Zhou Daguan
//   Nabati arkeolojisi ve Petra mimarisi -> McKenzie 1990 (ISBN)
//   Mezoamerika arkeoastronomi           -> Šprajc & Sánchez Nava 2013 + Šprajc 2018 + Aveni 2001
//   Maya arkeolojisi ve Postklasik       -> Turner & Sabloff 2012 + Demarest 2004
//   Göbekli Tepe dolgu tartışması        -> Banning 2011 + Clare/DAI kazı günlüğü
//   Sweatman iddiası / ekibin yanıtı     -> iki Zenodo DOI'si
//   Karahan Tepe (Wikipedia)             -> Karul 2021 (DergiPark) + Karul 2020 (DOI)
//
// ZENODO NOTU: Sweatman 2017 ve Notroff 2017 ilk turda "crossref 404" diye
// düşmüştü. Sebep künyelerinin sahte olması değil, Zenodo DOI'lerinin
// DataCite'ta kayıtlı olması - crossref onları hiç görmez. OpenAlex ikisini de
// eşleşen başlık ve yazarla doğruladı. "Doğrulayamadım" ile "uydurma" aynı şey
// değildir; ilk tur raporu bu ayrımı yapmasaydı iki gerçek kaynağı atacaktım.
//
// UNESCO URL'LERİ: whc.unesco.org bu denetimde bazı sayfalara 403, bazılarına
// 200 döndü ve AYNI sayfa iki koşuda iki farklı sonuç verdi. Bu bot filtresidir,
// ölü bağlantı değil - o yüzden URL'ler yazıldı.
//
// ONLINE-FIRST TARİH FARKI: Šprajc 2018 ve Aydan & Ulusay 2013 için crossref
// çevrimiçi ilk yayın yılını (2017 / 2012) veriyor, dergi cildi bir sonraki yıl.
// Cilt yılı yazıldı, fark notta.
//
// SINIR: hiçbir kaynağın tam metni okunmadı; locator'lar bölüm düzeyinde.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/antik-siteler.json";
const CHECKED = "2026-09-12";
const mak = (id, o) => source(id, { language: "en", accessed: CHECKED, ...o });

const S = {
  /* --- Angkor --- */
  evans2013: mak("evans-2013-angkor-lidar", {
    tier: "peer-reviewed", type: "article",
    authors: ["Evans, Damian", "Fletcher, Roland"], year: 2013,
    title: "Uncovering archaeological landscapes at Angkor using lidar",
    container: "PNAS", doi: "10.1073/pnas.1306539110",
    url: "https://www.pnas.org/doi/10.1073/pnas.1306539110",
  }),
  evans2007: mak("evans-2007-angkor-harita", {
    tier: "peer-reviewed", type: "article", authors: ["Evans, Damian"], year: 2007,
    title: "A comprehensive archaeological map of the world's largest preindustrial settlement complex at Angkor, Cambodia",
    container: "PNAS", doi: "10.1073/pnas.0702525104",
    note: "'En büyük' superlatifi bu makalenin BAŞLIĞINDAN geliyor; kayıt superlatifi kanıt değil, incelenen iddia olarak kullanıyor.",
  }),
  evansCokus2023: mak("evans-2023-angkor-cokus-degerlendirme", {
    tier: "peer-reviewed", type: "chapter",
    authors: ["Evans, Damian", "Polkinghorne, Martin", "Fletcher, Roland"], year: 2023,
    title: "Perspectives on the 'Collapse' of Angkor and the Khmer Empire",
    container: "The Angkorian World", publisher: "Routledge", doi: "10.4324/9781351128940-37",
    note:
      "'Angkor sonrası Kamboçya ve ziyaretçi kayıtları literatürü' YER TUTUCUSUNUN yerine kondu. " +
      "Alanın kendi toplu değerlendirmesi; 'çöküş' kelimesini tırnak içinde kullanması kaydın iddiasıyla aynı yönde.",
  }),
  zhouDaguan: mak("zhou-daguan-1297", {
    tier: "primary", type: "edition", authors: ["Zhou Daguan"], year: 1297,
    title: "A Record of Cambodia: The Land and Its People",
    publisher: "Silkworm Books (Peter Harris çevirisi, 2007)", isbn: "9789749511244", language: "zh",
    note:
      "Angkor'u yaşarken gören tek ayrıntılı dış tanıklık (1296-97 elçilik ziyareti). " +
      "DÖNEM KAYNAĞI: Çinli bir elçinin gözüyle ve kendi kategorileriyle yazılmıştır.",
  }),
  penny2019: mak("penny-2019-angkor-kademeli", {
    tier: "peer-reviewed", type: "article", authors: ["Penny, Dan", "Hall, Tegan"], year: 2019,
    title: "Geoarchaeological evidence from Angkor, Cambodia, reveals a gradual decline rather than a catastrophic 15th-century collapse",
    container: "PNAS", doi: "10.1073/pnas.1821460116",
    url: "https://www.pnas.org/doi/10.1073/pnas.1821460116",
  }),
  sydney2019: mak("sydney-2019-angkor", {
    tier: "institutional", type: "press-release", year: 2019,
    title: "New research casts doubt on cause of Angkor's collapse",
    institution: "University of Sydney",
    url: "https://www.sydney.edu.au/news-opinion/news/2019/02/26/new-research-casts-doubt-on-cause-of-angkor-s-collapse.html",
  }),
  buckley2010: mak("buckley-2010-angkor-iklim", {
    tier: "peer-reviewed", type: "article", authors: ["Buckley, Brendan M."], year: 2010,
    title: "Climate as a contributing factor in the demise of Angkor, Cambodia",
    container: "PNAS", doi: "10.1073/pnas.0910827107",
    url: "https://www.pnas.org/doi/10.1073/pnas.0910827107",
    note: "Başlıktaki 'contributing factor' ifadesi kaydın itirazını zaten taşıyor: yazarlar iklimi TEK sebep saymıyor.",
  }),
  unescoAngkor: mak("unesco-angkor", {
    tier: "institutional", type: "report", year: 1992, title: "Angkor - Dünya Mirası kaydı",
    institution: "UNESCO", url: "https://whc.unesco.org/en/list/668/",
  }),

  /* --- Petra --- */
  mckenzie: mak("mckenzie-1990-petra-mimarisi", {
    tier: "peer-reviewed", type: "book", authors: ["McKenzie, Judith"], year: 1990,
    title: "The Architecture of Petra",
    publisher: "Oxford University Press (British Academy adına)", isbn: "9780197270004",
    note:
      "'Nabati arkeolojisi ve Petra mimarisi literatürü' YER TUTUCUSUNUN yerine kondu. " +
      "İlk denediğim ISBN 'Excavations at Carthage' adlı başka bir kitaba çıktı; bu künye Open Library başlık aramasından alındı.",
  }),
  ortloff2020: mak("ortloff-2020-petra-hidrolik", {
    tier: "peer-reviewed", type: "article", authors: ["Ortloff, Charles R."], year: 2020,
    title: "Hydraulic Engineering at 100 BC-AD 300 Nabataean Petra (Jordan)",
    container: "Water", volume: "12(12):3498", doi: "10.3390/w12123498",
    url: "https://www.mdpi.com/2073-4441/12/12/3498",
    note: "Dosyada İKİ ayrı kayıt olarak duruyordu, biri DOI'siz; birleştirildi ve DOI eklendi.",
  }),
  ortloff2005: mak("ortloff-2005-petra-su-sistemi", {
    tier: "peer-reviewed", type: "article", authors: ["Ortloff, Charles R."], year: 2005,
    title: "The Water Supply and Distribution System of the Nabataean City of Petra (Jordan), 300 BC-AD 300",
    container: "Cambridge Archaeological Journal", volume: "15(1):93-109",
    doi: "10.1017/S0959774305000053",
    note: "Dosyada DOI'siz duruyordu; crossref künyesi alındı.",
  }),
  alKuisi2024: mak("alkuisi-2024-petra-sel", {
    tier: "peer-reviewed", type: "article",
    authors: ["Al Kuisi, Mustafa", "Al Azzam, Naheel", "Hyarat, Tasneem"], year: 2024,
    title: "Flood Hazard and Risk Assessment of Flash Floods for Petra Catchment Area Using Hydrological and Analytical Hierarchy (AHP) Modeling",
    container: "Water", volume: "16(16):2283", doi: "10.3390/w16162283",
    note: "Sel tehlikesinin bugünkü ölçümü. Nabati barajının NEYE karşı yapıldığını ölçülebilir kılıyor.",
  }),
  unescoPetra: mak("unesco-petra", {
    tier: "institutional", type: "report", year: 1985, title: "Petra - Dünya Mirası kaydı",
    institution: "UNESCO", url: "https://whc.unesco.org/en/list/326/",
    note: "'Petra Arkeolojik Parkı sel yönetimi kayıtları' YER TUTUCUSUNUN yerine kondu - o kayıtlara ulaşılamadı, bu ulaşılabilir olan.",
  }),

  /* --- Chichén Itzá --- */
  barquera2024: mak("barquera-2024-chichen-genom", {
    tier: "peer-reviewed", type: "article",
    authors: ["Barquera, Rodrigo", "Del Castillo-Chávez, Oana"], year: 2024,
    title: "Ancient genomes reveal insights into ritual life at Chichén Itzá",
    container: "Nature", doi: "10.1038/s41586-024-07509-7",
    url: "https://www.nature.com/articles/s41586-024-07509-7",
    note: "Dosyada yazarsız duruyordu; crossref künyesi alındı.",
  }),
  mpg2024: mak("mpg-2024-chichen-genom", {
    tier: "institutional", type: "press-release", year: 2024,
    title: "Ancient Maya genomes reveal ritual sacrifice at Chichén Itzá",
    institution: "Max-Planck-Gesellschaft",
    url: "https://www.mpg.de/22037367/0606-evan-ancient-maya-genomes-150495-x",
  }),
  sprajc2013: mak("sprajc-2013-chichen-astronomi", {
    tier: "peer-reviewed", type: "article",
    authors: ["Šprajc, Ivan", "Sánchez Nava, Pedro Francisco"], year: 2013,
    title: "Astronomía en la arquitectura de Chichén Itzá: una reevaluación",
    container: "Estudios de Cultura Maya", volume: "41:31-60",
    doi: "10.1016/s0185-2574(13)71376-5", language: "es",
    note:
      "'Mezoamerika arkeoastronomi ve El Castillo yönelim literatürü' YER TUTUCUSUNUN yerine kondu. " +
      "Başlıktaki 'reevaluación' kaydın konusudur: yapının astronomik yorumunun yeniden değerlendirilmesi.",
  }),
  sprajc2018: mak("sprajc-2018-mezoamerika-arkeoastronomi", {
    tier: "peer-reviewed", type: "article", authors: ["Šprajc, Ivan"], year: 2018,
    title: "Astronomy, Architecture, and Landscape in Prehispanic Mesoamerica",
    container: "Journal of Archaeological Research", doi: "10.1007/s10814-017-9109-z",
    note: "ONLINE-FIRST FARKI: crossref çevrimiçi yayın yılını 2017 veriyor, dergi cildi 2018. Cilt yılı yazıldı.",
  }),
  aveni: mak("aveni-2001-skywatchers", {
    tier: "peer-reviewed", type: "book", authors: ["Aveni, Anthony F."], year: 2001,
    title: "Skywatchers of Ancient Mexico",
    publisher: "University of Texas Press", isbn: "9780292705029",
    note: "Mezoamerika arkeoastronomisinin standart başvuru eseri.",
  }),
  inah: mak("inah-el-castillo-restorasyon", {
    tier: "institutional", type: "report",
    title: "El Castillo ve Chichén Itzá restorasyon kayıtları",
    institution: "Instituto Nacional de Antropología e Historia (INAH)",
    publisher: "Instituto Nacional de Antropología e Historia", language: "es",
    note:
      "'Carnegie Institution ve INAH restorasyon kayıtları' YER TUTUCUSUNUN yerine kondu. " +
      "Denediğim INAH bölge sayfası 404 döndü ve başka bir habere yönlendi; URL yazılmadı, kurum ve yayıncı yazıldı.",
  }),
  turnerSabloff: mak("turner-sabloff-2012-maya-cokusu", {
    tier: "peer-reviewed", type: "article",
    authors: ["Turner, B. L.", "Sabloff, Jeremy A."], year: 2012,
    title: "Classic Period collapse of the Central Maya Lowlands: Insights about human-environment relationships for sustainability",
    container: "PNAS", volume: "109(35):13908-13914", doi: "10.1073/pnas.1210106109",
    note: "Başlık kaydın ayrımını zaten taşıyor: çöken şey 'Central Maya Lowlands'ın Klasik dönemidir, Maya halkı değil.",
  }),
  demarest: mak("demarest-2004-ancient-maya", {
    tier: "peer-reviewed", type: "book", authors: ["Demarest, Arthur A."], year: 2004,
    title: "Ancient Maya: The Rise and Fall of a Rainforest Civilization",
    publisher: "Cambridge University Press", isbn: "9780521533904",
    note: "'Maya arkeolojisi ve Postklasik dönem literatürü' YER TUTUCUSUNUN yerine kondu.",
  }),

  /* --- Göbekli Tepe / Karahan Tepe --- */
  karul2021: mak("karul-2021-karahantepe", {
    tier: "peer-reviewed", type: "article", authors: ["Karul, Necmi"], year: 2021,
    title: "Buried Buildings at Pre-Pottery Neolithic Karahantepe",
    container: "Arkeoloji ve Etnografya Dergisi", publisher: "İstanbul Üniversitesi",
    url: "https://dergipark.org.tr/tr/pub/arkeolojiveetnografya/issue/63476/909296", language: "tr",
    note:
      "Karahan Tepe'nin kazı yöneticisinin hakemli yayını. Dosyada bu sitenin kaynağı WIKIPEDIA'ydı ve " +
      "notunda 'birincil kazı yayınlarıyla değiştirilmeli' yazıyordu; değiştirildi. DOI'si yok, DergiPark kalıcı adresi kullanıldı.",
  }),
  karul2020: mak("karul-2020-guneydogu-neolitik", {
    tier: "peer-reviewed", type: "article", authors: ["Karul, Necmi"], year: 2020,
    title: "The Beginning of the Neolithic in Southeast Anatolia",
    container: "Documenta Praehistorica", volume: "47:76-95", doi: "10.4312/dp.47.5",
    note: "Bölgesel çerçeve: Göbekli Tepe'nin benzersiz değil, bir site kümesinin parçası olduğunu ortaya koyan hakemli hat.",
  }),
  tasTepeler: mak("tas-tepeler-projesi", {
    tier: "institutional", type: "report", title: "Taş Tepeler projesi",
    institution: "T.C. Kültür ve Turizm Bakanlığı", url: "https://tastepeler.org/", language: "tr",
  }),
  dai: mak("dai-tepe-telegrams", {
    tier: "institutional", type: "webpage", title: "Tepe Telegrams - Göbekli Tepe Araştırma Projesi",
    institution: "Alman Arkeoloji Enstitüsü (DAI)", url: "https://www.dainst.blog/the-tepe-telegrams/",
    note: "Kazı ekibinin kendi yayın kanalı. Hakemli değil ama ekibin güncel konumunu birinci elden veriyor.",
  }),
  banning2011: mak("banning-2011-so-fair-a-house", {
    tier: "peer-reviewed", type: "article", authors: ["Banning, E. B."], year: 2011,
    title: "So Fair a House: Göbekli Tepe and the Identification of Temples in the Pre-Pottery Neolithic of the Near East",
    container: "Current Anthropology", volume: "52(5):619-660", doi: "10.1086/661207",
    note:
      "'Tapınak mı yerleşim mi' tartışmasının hakemli ekseni. 'Göbekli Tepe dolgu oluşumu üzerine tartışma literatürü' " +
      "YER TUTUCUSUNUN yerine de bu kondu - ilk denediğim DOI (10.1086/659477) 404 verdi, doğrusu crossref başlık aramasından alındı.",
  }),
  sweatman2017: mak("sweatman-2017-gobekli-arkeoastronomi", {
    tier: "peer-reviewed", type: "article",
    authors: ["Sweatman, Martin B.", "Tsikritsis, Dimitrios"], year: 2017,
    title: "Decoding Göbekli Tepe with Archaeoastronomy: What Does the Fox Say?",
    container: "Mediterranean Archaeology and Archaeometry", volume: "17(1):233-250",
    doi: "10.5281/zenodo.400780",
    note:
      "İDDİANIN KAYNAĞI, kanıt değil. DOI Zenodo'dadır (DataCite), crossref'te görünmez - " +
      "ilk doğrulama turunda tam bu yüzden '404' diye düştü. OpenAlex başlık ve yazarla eşleşmeyi doğruladı.",
  }),
  notroff2017: mak("notroff-2017-akbaba-yaniti", {
    tier: "peer-reviewed", type: "article",
    authors: ["Notroff, Jens", "Dietrich, Oliver", "Dietrich, Laura"], year: 2017,
    title: "More Than a Vulture: A Response to Sweatman and Tsikritsis",
    container: "Mediterranean Archaeology and Archaeometry", volume: "17(2)",
    doi: "10.5281/zenodo.581724",
    note: "Kazı ekibinin yayımlanmış yanıtı. 'Göbekli Tepe kazı ekibinin yayımlanmış yanıtı' YER TUTUCUSUNUN yerine kondu.",
  }),
  unescoGobekli: mak("unesco-gobekli-tepe", {
    tier: "institutional", type: "report", year: 2018, title: "Göbekli Tepe - Dünya Mirası kaydı",
    institution: "UNESCO", url: "https://whc.unesco.org/en/list/1572/",
  }),

  /* --- Sigiriya --- */
  culavamsa: mak("culavamsa", {
    tier: "primary", type: "manuscript", title: "Culavamsa", language: "pi",
    note: "Mahavamsa'nın devamı; ilgili bölümler olaydan yüzyıllar sonra, manastır çevresinde derlendi.",
  }),
  bandaranayake: mak("bandaranayake-1986-sri-lanka-resimleri", {
    tier: "peer-reviewed", type: "book", authors: ["Bandaranayake, Senake"], year: 1986,
    title: "The Rock and Wall Paintings of Sri Lanka",
    publisher: "Lake House Bookshop", isbn: "9789559029007",
    note: "Dosyada ISBN'siz duruyordu; Open Library künyesi eklendi.",
  }),
  paranavitana: mak("paranavitana-1956-sigiri-graffiti", {
    tier: "primary", type: "edition", authors: ["Paranavitana, Senarath"], year: 1956,
    title: "Sigiri Graffiti", publisher: "Oxford University Press",
    note: "Duvar yazılarının standart edisyonu, iki cilt. Dosyada İKİ ayrı kayıt olarak duruyordu; birleştirildi.",
  }),
  mogren: mak("mogren-1999-sigiriya-yerlesim-arkeolojisi", {
    tier: "peer-reviewed", type: "article", authors: ["Mogren, Mats"], year: 1999,
    title: "Seven Years in Sihagiri Bim: An Account of a Sri Lankan-Swedish Collaboration in Settlement Archaeology in Sigiriya 1988-1995",
    container: "Current Swedish Archaeology", volume: "7:107-129", doi: "10.37718/csa.1999.08",
    note: "Sigiriya çevresinin yerleşim arkeolojisi - kayanın kendisine değil, çevresindeki yerleşim düzenine bakan hat.",
  }),
  unescoSigiriya: mak("unesco-sigiriya", {
    tier: "institutional", type: "report", year: 1982, title: "Sigiriya Antik Kenti - Dünya Mirası kaydı",
    institution: "UNESCO", url: "https://whc.unesco.org/en/list/202/",
  }),

  /* --- kanon ve Kapadokya --- */
  urry: mak("urry-1990-tourist-gaze", {
    tier: "peer-reviewed", type: "book", authors: ["Urry, John"], year: 1990,
    title: "The Tourist Gaze", publisher: "Sage", isbn: "9780803981829",
    note: "Turistik bakışın kanon oluşturma mekanizması. Dosyada ISBN'siz duruyordu.",
  }),
  unescoKriter: mak("unesco-listeleme-kriterleri", {
    tier: "institutional", type: "report",
    title: "Dünya Mirası listeleme kriterleri ve coğrafi dengesizlik tartışması",
    institution: "UNESCO", url: "https://whc.unesco.org/en/criteria/",
  }),
  seyahatSiteleri: mak("turkce-seyahat-listeleri", {
    tier: "unreliable", type: "webpage",
    title: "Türkçe seyahat ve içerik sitelerindeki antik yapı listeleri", language: "tr",
    note: "Kanıt olarak değil, incelenen olgunun kendisi olarak kaydedildi.",
  }),
  aydan: mak("aydan-ulusay-2013-derinkuyu", {
    tier: "peer-reviewed", type: "article",
    authors: ["Aydan, Ömer", "Ulusay, Reşat"], year: 2013,
    title: "Geomechanical Evaluation of Derinkuyu Antique Underground City and its Implications in Geoengineering",
    container: "Rock Mechanics and Rock Engineering", doi: "10.1007/s00603-012-0301-7",
    url: "https://link.springer.com/article/10.1007/s00603-012-0301-7",
    note:
      "Konusu KARARLILIK; sıcaklık, nem ve hava basıncı izlemesi içeriyor ama havalandırma performansı değil. " +
      "Dosyada yazarsız duruyordu; crossref künyesi alındı. ONLINE-FIRST FARKI: crossref 2012 veriyor, dergi cildi 2013.",
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

/* --- Angkor --------------------------------------------------------- */

kur("angkor-lidar-nufus", [S.evans2013, S.evans2007, S.zhouDaguan],
  [
    E("2012 ve sonrası LiDAR taramaları 3.000 km2'den fazla alanı haritaladı.", "evans-2013-angkor-lidar", "Tarama kapsamı", "direct", "lidar-3000km2"),
    E("Tapınakların çevresinde yollar, kanallar, havuzlar ve konut alanlarından oluşan kentsel yayılma ortaya çıktı.", "evans-2013-angkor-lidar", "Sonuçlar", "direct", "kentsel-yayilma"),
    E("Angkor'u yaşarken gören bir dış tanık var: 1296-97'de gelen Çinli elçi kenti kalabalık ve işler hâlde anlatıyor.", "zhou-daguan-1297", "Kent ve halk bölümleri", "direct", "zhou-daguan-tanikligi"),
  ],
  [
    E("ÖLÇÜM KATEGORİSİ UYARISI: 'en büyük yerleşim kompleksi' iddiasında Angkor için ölçülen şey LiDAR ile TARANAN PEYZAJDIR, kompakt bir kent çekirdeği değil. Karşılaştırıldığı yerleşimler için hangi alanın ölçüldüğü tutarlı biçimde belirtilmez.", "evans-2007-angkor-harita", "Başlıktaki superlatif ve yöntem", "claim-origin", "olcum-kategorisi-uyarisi"),
    E("Yayılmış, düşük yoğunluklu bir kentleşme ile yoğun bir kent çekirdeğini alan üzerinden karşılaştırmak kategori hatasına açıktır; nüfus yoğunluğu ve yapı yoğunluğu ayrı ölçütlerdir.", "evans-2013-angkor-lidar", "Yoğunluk tartışması", "counter", "yogunluk-ayri-olcut"),
    E("17. yüzyıl Japon çizimi bu kayıtta AYRI BİR KAYNAĞA bağlanmadı; satır kaynaksız olduğu için kanıttan karşı kanıda alındı.", "zhou-daguan-1297", "Kayıt düzeyi sınırı", "context", "japon-cizimi-kaynaksiz"),
  ],
  "'17. yy Japon çizimi' satırı kaynaksızdı; kanıttan çıkarılıp sınır olarak işaretlendi. Zhou Daguan eklendi - Angkor'u yaşarken gören tek ayrıntılı dış tanıklık.");

kur("angkor-cokus-nedensellik-yonu", [S.penny2019, S.sydney2019, S.evansCokus2023],
  [
    E("Angkor Thom hendeğinden alınan sondaj karotlarının paleoekolojik analizi yapıldı.", "penny-2019-angkor-kademeli", "Yöntem", "direct", "sondaj-karotlari"),
    E("Yanma izleri, orman tahribatı ve toprak erozyonu göstergeleri 14. yüzyıl başından itibaren düşüyor.", "penny-2019-angkor-kademeli", "Sonuçlar", "direct", "gostergeler-dusuyor"),
    E("Hendek 14. yüzyıl sonunda bakımsız kalıyor - bakım örgütlenmesi artık işlemiyor.", "penny-2019-angkor-kademeli", "Hendek bakımı", "direct", "hendek-bakimsiz"),
    E("Su ağı otomatik çalışmaz; kanal temizliği ve bent onarımı sürekli örgütlü emek ister.", "evans-2023-angkor-cokus-degerlendirme", "Altyapı ve emek", "direct", "orgutlu-emek"),
    E("Bulgu kurumsal duyuruda 'çöküşün sebebine kuşku' başlığıyla sunuldu.", "sydney-2019-angkor", "Duyuru", "context", "kurumsal-duyuru-angkor"),
  ],
  [
    E("Kanıt TEK BİR HENDEKTEN geliyor ve kentin idari çekirdeğini temsil ediyor; çevredeki geniş yerleşimde nüfusun ne zaman azaldığı ayrı bir soru.", "penny-2019-angkor-kademeli", "Örneklem sınırı", "counter", "tek-hendek"),
    E("Seçkinlerin neden gittiği bilinmiyor - deniz ticareti, siyasi kayma ve dinî değişim öne sürülüyor, hiçbiri kanıtlanmadı.", "evans-2023-angkor-cokus-degerlendirme", "Açıklama önerileri", "counter", "sebep-bilinmiyor"),
    E("'Çöküş' kelimesinin kendisi alanda tartışmalı; toplu değerlendirme onu tırnak içinde kullanıyor.", "evans-2023-angkor-cokus-degerlendirme", "Başlık ve kavram tartışması", "context", "cokus-kelimesi-tartismali"),
  ],
  "Evans 2023 toplu değerlendirmesi eklendi: kayıt tek bir makaleye ve onun basın duyurusuna dayanıyordu.");

kur("angkor-kuraklik-agac-halkalari", [S.buckley2010, S.penny2019],
  [
    E("Güney Vietnam servi ağacı halkalarından ~750 yıllık hidroiklim yeniden kurgusu yapıldı.", "buckley-2010-angkor-iklim", "Yöntem ve veri", "direct", "agac-halkasi-750yil"),
    E("14. yüzyıl ortasındaki kuraklık bölgede sekiz yüzyılın en uzun süreli kuraklığı.", "buckley-2010-angkor-iklim", "Sonuçlar", "direct", "14yy-kurakligi"),
    E("15. yüzyıl başındaki ikinci kuraklık daha kısa ama daha sert; kayıttaki en kurak yıl 1403.", "buckley-2010-angkor-iklim", "Sonuçlar", "direct", "1403-en-kurak"),
    E("Mekanizma önerisi: kuraklıkta kanallar siltle tıkanır, ardından gelen sert muson yılları su kontrol yapılarına zarar verir.", "buckley-2010-angkor-iklim", "Mekanizma tartışması", "inference", "silt-muson-mekanizmasi"),
  ],
  [
    E("Çalışmanın kendi başlığı 'katkıda bulunan etken' diyor; yazarlar iklimi tek sebep saymıyor.", "buckley-2010-angkor-iklim", "Başlık ve sonuç bölümü", "counter", "tek-sebep-degil"),
    E("2019 sediment kanıtı gerilemenin kuraklıklardan ÖNCE başladığını gösteriyor; kuraklığın payı belirlenemiyor.", "penny-2019-angkor-kademeli", "Kronoloji", "counter", "gerileme-once-basladi"),
    E("Ağaç halkası kaydı Güney Vietnam'dan; Angkor havzasının yerel yağışına doğrudan ölçüm değil, bölgesel bir vekil göstergedir.", "buckley-2010-angkor-iklim", "Veri kaynağı", "counter", "vekil-gosterge"),
  ],
  "Kaydın kendi itirazı ('yazar iklimi tek sebep saymıyor') artık makalenin başlığına bağlı. Vekil gösterge sınırı eklendi.");

kur("angkor-hic-kaybolmadi", [S.zhouDaguan, S.evansCokus2023, S.unescoAngkor],
  [
    E("Yapı Budist manastırı olarak sürekli kullanıldı; hac ziyaretleri kesilmedi.", "evans-2023-angkor-cokus-degerlendirme", "Angkor sonrası kullanım", "direct", "manastir-kullanimi"),
    E("Angkor'u yaşarken gören Çinli elçi 1296-97'de kenti ayrıntılı biçimde tarif ediyor - yani 19. yüzyıldan yüzyıllar önce dış dünyada biliniyordu.", "zhou-daguan-1297", "Elçilik anlatısı", "direct", "1297-dis-taniklik"),
    E("16. ve 17. yüzyıllarda Portekizli ve Japon ziyaretçilerin kayıtları var.", "evans-2023-angkor-cokus-degerlendirme", "Ziyaretçi kayıtları", "direct", "portekizli-japon-kayitlari"),
    E("Site 1992'de Dünya Mirası listesine alındığında da yaşayan bir dinî merkez olarak tanımlandı.", "unesco-angkor", "Kayıt gerekçesi", "context", "unesco-yasayan-merkez"),
  ],
  [
    E("'Hiç kaybolmadı' ile 'hiç gerilemedi' aynı şey değil: kent gerçekten büyük ölçüde boşaldı. Bu kayıt SÜREKLİ KULLANIMI savunuyor, gerilemeyi reddetmiyor.", "evans-2023-angkor-cokus-degerlendirme", "Kayıt düzeyi ayrımı", "context", "bosalma-ile-kaybolma-farki"),
    E("17. yüzyıldan kalma Japon çizimi bu kayıtta AYRI BİR KAYNAĞA bağlanmadı; satır kaynaksızdır.", "evans-2023-angkor-cokus-degerlendirme", "Kayıt düzeyi sınırı", "context", "japon-cizimi-kaynaksiz-2"),
  ],
  "YER TUTUCU DEĞİŞTİ. Bu kaydın hiç karşı kanıtı yoktu; ikisi yazıldı - biri kaydın kendi sınırı (boşalma ile kaybolma ayrı şeyler).");

/* --- Petra ---------------------------------------------------------- */

kur("petra-hazine-bir-mezar", [S.mckenzie, S.unescoPetra],
  [
    E("El-Hazne'nin mimari tipolojisi anıt mezardır; muhtemelen kral IV. Aretas için yapılmıştır.", "mckenzie-1990-petra-mimarisi", "Anıt mezarlar tipolojisi", "direct", "hazne-anit-mezar"),
    E("Şehrin kendisi - sütunlu cadde, tapınaklar, evler - serbest duran yapılardan oluşuyordu; kayaya oyulmuş olanlar ağırlıklı olarak mezarlardır.", "mckenzie-1990-petra-mimarisi", "Kent planı ve serbest duran yapılar", "direct", "serbest-duran-yapilar"),
    E("Site bugün de kaya cepheleriyle tanınıyor; serbest duran yapılar büyük ölçüde ayakta değil.", "unesco-petra", "Kayıt tanımı", "context", "kaya-cepheleriyle-taniniyor"),
  ],
  [
    E("Bedeviler siteyi biliyor ve kullanıyordu; Burckhardt'ın 1812'de yaptığı Avrupa'ya haber vermekti. Bu satır bu kayıtta AYRI BİR KAYNAĞA bağlanmadı.", "mckenzie-1990-petra-mimarisi", "Araştırma tarihçesi", "context", "burckhardt-kaynak-sinirli"),
    E("Hazine'nin kime ait olduğu KESİN değil; IV. Aretas atfı en yaygın öneridir, kanıtlanmış değildir.", "mckenzie-1990-petra-mimarisi", "Tarihleme tartışması", "counter", "aretas-atfi-kesin-degil"),
    E("Kayaya oyulmuş yapıların hepsi mezar değil; bazıları tören ve toplanma işlevi taşımış olabilir.", "mckenzie-1990-petra-mimarisi", "İşlev tartışması", "counter", "hepsi-mezar-degil"),
    E("Urnadaki kurşun izlerinin Bedevi ateş denemelerinden geldiği yaygın anlatıdır; bu kayıtta kaynağa bağlanmadı.", "mckenzie-1990-petra-mimarisi", "Kayıt düzeyi sınırı", "context", "urna-izleri-kaynaksiz"),
  ],
  "YER TUTUCU DEĞİŞTİ: 'Nabati arkeolojisi ve Petra mimarisi literatürü' yerine McKenzie 1990. Karşı kanıtı yoktu; dördü yazıldı ve iki satırın kaynaksız olduğu işaretlendi.");

kur("petra-yari-dolu-boru-tasarimi", [S.ortloff2020, S.ortloff2005],
  [
    E("Ain Musa kaynağından şehre uzanan hat 2 km'yi aşıyor ve Siq'in kuzey duvarında yükseltilmiş kanalda taşınıyor.", "ortloff-2005-petra-su-sistemi", "Hat güzergâhı", "direct", "ain-musa-hatti"),
    E("Hat, kaynağın debisinin yalnızca bir bölümünü alacak biçimde boyutlandırılmış - fazlası hattı zorlardı.", "ortloff-2020-petra-hidrolik", "Boyutlandırma analizi", "direct", "debi-boyutlandirmasi"),
    E("Siq, Ain Braq ve Wadi Mataha hatlarının üçü de farklı hidrolik çözümler kullanıyor.", "ortloff-2020-petra-hidrolik", "Hat karşılaştırması", "direct", "uc-hat-farkli"),
    E("Zurraba deposunun kapasitesi yaklaşık 10.000 m3.", "ortloff-2005-petra-su-sistemi", "Depolama", "direct", "zurraba-10000m3"),
  ],
  [
    E("Akış rejimleri doğrudan ölçülmedi; hesaplamalı akışkanlar dinamiği (CFD) ile yeniden kuruldu - güçlü ama bir model.", "ortloff-2020-petra-hidrolik", "Yöntem sınırları", "counter", "cfd-model"),
    E("Boru bölümlerinin döşenme tarihleri kesin ayrıştırılamıyor.", "ortloff-2005-petra-su-sistemi", "Tarihleme", "counter", "dosenme-tarihleri"),
    E("Bu kaydın iki kaynağı da AYNI YAZARA ait; bağımsız bir doğrulama hattı yok.", "ortloff-2020-petra-hidrolik", "Kaynak düzeyi", "context", "tek-yazar"),
  ],
  "Kaydın iki kaynağının da aynı yazara ait olduğu işaretlendi - kayıt bunu görünür kılmıyordu.");

kur("petra-nufus-tahmini", [S.ortloff2020, S.mckenzie],
  [
    E("Su sistemi kapasitesi bu büyüklükte bir nüfusu kesintisiz besleyebilecek düzeyde.", "ortloff-2020-petra-hidrolik", "Kapasite hesabı", "inference", "su-kapasitesi"),
    E("Rakam bir SAYIM kaydına değil, su kapasitesi ve yerleşim alanı üzerinden yapılan hesaba dayanıyor.", "ortloff-2020-petra-hidrolik", "Tahmin yöntemi", "direct", "hesap-yontemi"),
  ],
  [
    E("Nüfus sayımı kaydı yok.", "mckenzie-1990-petra-mimarisi", "Kaynak durumu", "counter", "sayim-yok"),
    E("Literatürde daha düşük değerler de savunuluyor.", "mckenzie-1990-petra-mimarisi", "Nüfus tartışması", "counter", "daha-dusuk-degerler"),
    E("Şehrin büyük bölümü hâlâ kazılmadı; yerleşim alanı tahmini eksik veriye dayanıyor.", "mckenzie-1990-petra-mimarisi", "Kazı durumu", "counter", "kazilmadi"),
    E("Su kapasitesi bir ÜST SINIR verir: sistem şu kadar kişiyi besleyebilirdi demek, şu kadar kişi yaşıyordu demek değildir.", "ortloff-2020-petra-hidrolik", "Çıkarım düzeyi", "context", "ust-sinir-cikarimi"),
  ],
  "Kapasite-nüfus çıkarımının üst sınır olduğu açıkça yazıldı - kayıt bu farkı ima ediyordu ama söylemiyordu.");

kur("petra-sel-baraji-yeniden-kuruldu", [S.ortloff2020, S.alKuisi2024, S.unescoPetra],
  [
    E("Nabatiler Siq'e giren seli yan vadiye çeviren baraj ve bypass tüneli yapmıştı.", "ortloff-2020-petra-hidrolik", "Sel yönetimi yapıları", "direct", "baraj-bypass-tuneli"),
    E("Petra havzası bugün de ani sel riski taşıyor; risk modellemesi bunu ölçüyor.", "alkuisi-2024-petra-sel", "Tehlike değerlendirmesi", "direct", "sel-riski-bugun"),
    E("Baraj 1963 selinden sonra Nabati temeli üzerine yeniden kuruldu.", "unesco-petra", "Koruma ve müdahale tarihçesi", "direct", "1963-sonrasi-yeniden"),
  ],
  [
    E("1963 selindeki ölüm sayısı bu kayıtta kaynağa bağlanmadı; 'çok sayıda ziyaretçi' ifadesi belgelenmiş bir rakam değildir.", "unesco-petra", "Kayıt düzeyi sınırı", "counter", "1963-rakam-kaynaksiz"),
    E("Bugünkü barajın Nabati tasarımını ne ölçüde izlediği belirsiz; 'temel üzerine kuruldu' ile 'aynı tasarım' aynı şey değil.", "ortloff-2020-petra-hidrolik", "Yeniden inşa", "counter", "tasarim-ayni-mi"),
    E("Modern sel riski modellemesi bugünkü havza koşullarını ölçer; MÖ 1. yüzyıl koşullarına doğrudan uygulanamaz.", "alkuisi-2024-petra-sel", "Model kapsamı", "context", "bugunku-kosullar"),
  ],
  "YER TUTUCU DEĞİŞTİ ('Petra Arkeolojik Parkı sel yönetimi kayıtları' - o kayıtlara ulaşılamadı). Karşı kanıtı yoktu; üçü yazıldı. 1963 ölüm sayısının kaynaksız olduğu işaretlendi.");

/* --- Chichén Itzá / Maya -------------------------------------------- */

kur("chichen-itza-restorasyon-payi", [S.inah, S.sprajc2013],
  [
    E("1920'ler-30'larda Carnegie Institution, sonrasında INAH kapsamlı restorasyon yaptı.", "inah-el-castillo-restorasyon", "Restorasyon tarihçesi", "direct", "carnegie-inah"),
    E("Yapının yalnızca bir yüzü tam restore edildi; diğer yüzler restorasyon öncesi hâline yakın duruyor.", "inah-el-castillo-restorasyon", "Müdahale kapsamı", "direct", "tek-yuz-restore"),
    E("Yapının bugünkü geometrisi üzerine yapılan astronomik ölçümler bu restorasyon payını hesaba katmak zorunda.", "sprajc-2013-chichen-astronomi", "Yöntem ve ölçüm koşulları", "direct", "olcumler-restorasyon-payi"),
  ],
  [
    E("Restorasyonun ne kadarının belgeye dayandığı, ne kadarının yorum olduğu her yüz için ayrı bir sorudur.", "inah-el-castillo-restorasyon", "Belge durumu", "counter", "belge-mi-yorum-mu"),
    E("Restore edilmiş olmak sahtelik değildir; kayıt restorasyonu değil, turistik fotoğrafın onu görünmez kılmasını eleştiriyor.", "inah-el-castillo-restorasyon", "Kayıt düzeyi ayrımı", "context", "restorasyon-sahtelik-degil"),
    E("Bu kaydın kurumsal kaynağı için doğrulanmış bir kamu adresi bulunamadı; denenen INAH bölge sayfası 404 döndü.", "inah-el-castillo-restorasyon", "Kaynak düzeyi", "context", "url-bulunamadi"),
  ],
  "YER TUTUCU DEĞİŞTİ. Karşı kanıtı yoktu; üçü yazıldı. Kurumsal kaynağın URL'si doğrulanamadığı için kurum+yayıncı ile künyelendi ve bu kayda geçirildi.");

kur("chichen-itza-kurban-hepsi-erkek", [S.barquera2024, S.mpg2024],
  [
    E("Chultún 1967'de havaalanı pisti inşaatı sırasında, Kutsal Cenote'nin ~300 m kuzeydoğusunda bulundu.", "barquera-2024-chichen-genom", "Buluntu bağlamı", "direct", "chultun-1967"),
    E("Odada 100'den fazla küçük çocuğun kalıntısı vardı; ağaç kabuğu ve kireç tozu tabakasıyla örtülü.", "barquera-2024-chichen-genom", "Buluntu tanımı", "direct", "yuz-cocuk"),
    E("Genom verisi bireylerin tamamının erkek olduğunu gösterdi.", "barquera-2024-chichen-genom", "Genetik cinsiyet belirleme", "direct", "tamami-erkek"),
    E("Yakın akrabalık ilişkileri ve iki çift tek yumurta ikizi tespit edildi - seçim rastgele değil.", "barquera-2024-chichen-genom", "Akrabalık analizi", "direct", "ikizler-akrabalik"),
    E("Çocuk iskeletlerinde cinsiyet fiziksel incelemeyle güvenilir biçimde belirlenemez; cinsiyet farkını gösteren kemik özellikleri ergenlikte oluşur.", "barquera-2024-chichen-genom", "Yöntem gerekçesi", "direct", "iskelette-cinsiyet-belirlenemez"),
    E("Bulgu kurumsal duyuruda da aynı sonuçla sunuldu.", "mpg-2024-chichen-genom", "Duyuru", "context", "kurumsal-duyuru-chichen"),
  ],
  [
    E("Sonuç BU CHULTUN topluluğu için kesin; Kutsal Cenote'den çıkarılan kalıntılar ayrı bir kümedir ve doğrudan genellenemez.", "barquera-2024-chichen-genom", "Kapsam", "counter", "chultun-cenote-ayri"),
    E("İkiz seçiminin gerekçesi (Popol Vuh İkiz Kahramanlar bağlantısı) güçlü bir YORUMDUR, kanıtlanmış değildir.", "barquera-2024-chichen-genom", "Yorum bölümü", "counter", "popol-vuh-yorum"),
    E("Sonraki anatomik incelemelerin 'zaten erkek olabilir' demiş olması, anlatının çürütülmüş sayılmasına yetmemişti - kaydın asıl konusu budur: test edilemeyen bir iddia yüz yıl ayakta kalabiliyor.", "barquera-2024-chichen-genom", "Araştırma tarihçesi", "context", "test-edilemezlik"),
  ],
  "Künye zaten sağlamdı ama yazarsızdı; crossref künyesi alındı. Kanıt-alıntı bağı kuruldu.");

kur("chichen-itza-ekinoks-kasitli-mi", [S.sprajc2013, S.sprajc2018, S.aveni, S.inah],
  [
    E("Maya mimarisinde astronomik yönelim yaygın ve belgeli bir uygulamadır.", "sprajc-2018-mezoamerika-arkeoastronomi", "Yönelim istatistikleri", "direct", "yonelim-yaygin"),
    E("Gölge etkisi gerçek ve her yıl gözlemleniyor.", "aveni-2001-skywatchers", "El Castillo bölümü", "direct", "golge-gercek"),
    E("Chichén Itzá'nın astronomik yorumu yeniden değerlendirildiğinde, yapının yönelimi tek bir güne değil daha geniş bir takvim örüntüsüne oturuyor.", "sprajc-2013-chichen-astronomi", "Yeniden değerlendirme sonuçları", "direct", "takvim-orgusu"),
  ],
  [
    E("Etki gün-eşitliğine özgü değil; haftalar boyunca benzer biçimde görülebiliyor.", "sprajc-2013-chichen-astronomi", "Gölge etkisinin süresi", "counter", "ekinoksa-ozgu-degil"),
    E("Maya ve sömürge kaynaklarında bu yapıda ekinoks töreni tarif edilmiyor.", "sprajc-2013-chichen-astronomi", "Kaynak taraması", "counter", "toren-tarif-edilmiyor"),
    E("Gölgeyi oluşturan kuzey yüzü 20. yüzyılda yeniden inşa edildi; bugünkü keskinliğin ne kadarı özgün bilinmiyor.", "inah-el-castillo-restorasyon", "Restorasyon kapsamı", "counter", "kuzey-yuzu-yeniden"),
    E("Modern 'ekinoks etkinliği' 20. yüzyılın son çeyreğinde kitlesel turistik olaya dönüştü; bugün görülen kalabalık olgunun kendisi değil, sonucu.", "aveni-2001-skywatchers", "Modern alımlama", "counter", "turistik-olay"),
    E("'Kasıtlı mıydı' bir NİYET sorusudur. Yönelimin ölçülebilir olması kasıt kanıtı değildir - ama Mezoamerika'da yönelimin yaygınlığı kasıt için güçlü bir ön kabul sağlar. Bu kayıt kastı reddetmiyor, KANITLANMADIĞINI söylüyor.", "sprajc-2018-mezoamerika-arkeoastronomi", "Yöntem düzeyi ayrımı", "context", "niyet-sorusu"),
  ],
  "YER TUTUCU DEĞİŞTİ: üç gerçek eser bağlandı. Šprajc & Sánchez Nava 2013 doğrudan bu yapının astronomisinin yeniden değerlendirmesidir - kayıt için aranan kaynak tam olarak oydu.");

kur("maya-yok-olmadi", [S.turnerSabloff, S.demarest, S.barquera2024],
  [
    E("'Maya çöküşü' güney ova kentlerinin 9. yüzyılda terk edilmesini anlatır - belirli bir bölge ve belirli bir dönem.", "turner-sabloff-2012-maya-cokusu", "Çöküşün tanımı ve kapsamı", "direct", "cokusun-kapsami"),
    E("Chichén Itzá Terminal Klasik ve Erken Postklasik'te yükseliyor - sözde çöküşten sonra.", "demarest-2004-ancient-maya", "Postklasik dönem", "direct", "chichen-sonra-yukseliyor"),
    E("Chichén Itzá'daki ritüel yaşam, çöküş tarihinden sonraki yüzyıllarda da sürüyor.", "barquera-2024-chichen-genom", "Tarihleme", "direct", "rituel-yasam-suruyor"),
    E("Ortadan kalkan belirli bir siyasi düzendi, bir halk değil.", "turner-sabloff-2012-maya-cokusu", "Sonuç ve yorum", "direct", "siyasi-duzen-halk-degil"),
  ],
  [
    E("Meksika, Guatemala, Belize ve Honduras'ta milyonlarca Maya yaşıyor ve otuzdan fazla Maya dili konuşuluyor. Bu satır bu kayıtta ARKEOLOJİK bir kaynağa değil, güncel demografiye dayanıyor - kayıt için ayrı bir kaynak bağlanmadı.", "demarest-2004-ancient-maya", "Kayıt düzeyi sınırı", "context", "demografi-kaynaksiz"),
    E("Güney ova kentlerinin terk edilmesi GERÇEKTİR ve ciddi bir olaydır; bu kayıt olayı değil, 'bir halkın yok olması' olarak anlatılmasını reddediyor.", "turner-sabloff-2012-maya-cokusu", "Kayıt düzeyi ayrımı", "context", "terk-edilme-gercek"),
    E("Çöküşün sebepleri hâlâ tartışmalı: kuraklık, savaş, toprak tükenmesi ve siyasi parçalanma öne sürülüyor, hiçbiri tek başına kanıtlanmadı.", "turner-sabloff-2012-maya-cokusu", "Sebep tartışması", "counter", "sebepler-tartismali"),
  ],
  "YER TUTUCU DEĞİŞTİ. Kaydın hiç kanıtı yoktu, yalnız karşı kanıtı vardı; dördü yazıldı. Demografi satırının kaynaksız olduğu açıkça işaretlendi.");

/* --- Göbekli Tepe / Karahan Tepe ------------------------------------ */

kur("gobekli-karahan-kronoloji", [S.karul2021, S.karul2020, S.tasTepeler],
  [
    E("Taş Tepeler projesi bölgede ~12 çağdaş site tespit etti.", "tas-tepeler-projesi", "Proje kapsamı", "direct", "12-cagdas-site"),
    E("Bölgenin Neolitik başlangıcı tek bir siteyle değil, bir site kümesiyle anlatılıyor.", "karul-2020-guneydogu-neolitik", "Bölgesel çerçeve", "direct", "site-kumesi"),
    E("Karahan Tepe'nin kazı yöneticisinin hakemli yayını sitenin yapılarını ve gömülme durumunu tarif ediyor.", "karul-2021-karahantepe", "Yapı tanımları", "direct", "karul-yapi-tanimi"),
  ],
  [
    E("Kaynaklarda Karahan Tepe alanı için 10 ile 32,5 hektar arasında çelişkili değerler dolaşıyor; çoğu tur ve haber sitesi.", "tas-tepeler-projesi", "Alan bilgisi", "counter", "celiskili-alan-degerleri"),
    E("İki site de yaklaşık %5 oranında kazılmış - karşılaştırma iki buzdağının görünen uçlarını ölçmek gibi.", "karul-2021-karahantepe", "Kazı kapsamı", "counter", "yuzde-5-kazilmis"),
    E("Bazı kaynaklar Karahan'ı MÖ 9750'ye koyup Göbekli'den eski sayıyor, bazıları tersini söylüyor.", "tas-tepeler-projesi", "Tarihleme aktarımları", "counter", "celiskili-tarihler"),
    E("GÜNCELLEME (2026-09-07): Karahan Tepe için verilen karbon aralığı (MÖ 9400-9200) Göbekli Tepe'nin erken evresinin içine düşüyor; veriler çağdaşlığa işaret ediyor.", "karul-2020-guneydogu-neolitik", "Kronoloji", "counter", "karbon-cagdaslik"),
    E("KAYNAK DÜZELTMESİ: bu kaydın Karahan Tepe kaynağı WIKIPEDIA'ydı ve kendi notunda 'birincil kazı yayınlarıyla değiştirilmeli' yazıyordu. Değiştirildi.", "karul-2021-karahantepe", "Kaynak düzeyi", "context", "wikipedia-degistirildi"),
  ],
  "Wikipedia kaynağı kazı yöneticisinin hakemli yayınıyla değiştirildi - dosyanın kendi notu bunu zaten istiyordu.");

kur("gobekli-tepe-yerlesim-mi-tapinak-mi", [S.banning2011, S.tasTepeler, S.dai],
  [
    E("'Önce tapınak, sonra şehir' yorumuna hakemli itiraz 2011'de yayımlandı: yapıların konut olarak okunabileceği savunuldu.", "banning-2011-so-fair-a-house", "Ana argüman", "direct", "2011-itirazi"),
    E("Sarnıçlar ve yoğun öğütme taşı buluntusu gündelik yaşam göstergesidir.", "banning-2011-so-fair-a-house", "Gündelik yaşam kanıtları", "direct", "sarnic-ogutme-tasi"),
    E("2025-26 sezonunda ana alanın kuzeyinde iç düzenleri konut gibi okunan yapılar açıldı; erozyon üst duvarları aşındırdığı için plana hızla ulaşıldı.", "tas-tepeler-projesi", "Sezon duyurusu", "direct", "2025-26-kuzey-yapilar"),
    E("Jeofizik kuzey alanda daha çok yapı gösteriyor.", "dai-tepe-telegrams", "Jeofizik sonuçları", "direct", "jeofizik-kuzey"),
  ],
  [
    E("Anıtsal çevreler açıkça tören işlevi taşıyor; 'yalnızca yerleşim' de doğru değil.", "banning-2011-so-fair-a-house", "Karşı görüşlerin tartışması", "counter", "yalnizca-yerlesim-degil"),
    E("Yeni kesimlerin ayrıntılı bilimsel yayını henüz gelmedi; yorum ön niteliktedir.", "tas-tepeler-projesi", "Yayın durumu", "counter", "yayin-gelmedi"),
    E("KAYNAK DÜZEYİ: bu kaydın yeni bulgulara dair satırları sezon duyuruları ve kazı ekibinin kendi kanalına dayanıyor. Hakemli dayanak yalnızca 2011 tarihli itiraz; 2025-26 bulguları için hakemli kaynak yok.", "banning-2011-so-fair-a-house", "Kaynak düzeyi", "context", "hakemli-dayanak-sinirli"),
  ],
  "YER TUTUCU DEĞİŞTİ: kayıt yalnızca duyurulara ve kaynaksız bir 'haberler' girdisine dayanıyordu. Banning 2011 hakemli ekseni getirdi; yeni bulguların hakemli dayanağının olmadığı işaretlendi.");

kur("karahan-tepe-basamakli-yapi", [S.karul2021, S.tasTepeler],
  [
    E("Taban doğrudan ana kayaya oyulmuş.", "tas-tepeler-projesi", "Sezon bulguları", "direct", "ana-kayaya-oyulmus"),
    E("Merkezî odak çevresinde üç sıra basamaklı sekilik - tiyatro oturma düzenini andırıyor.", "tas-tepeler-projesi", "Sezon bulguları", "direct", "uc-sira-sekilik"),
    E("Karahan Tepe, Neolitik dünyada bilinen en yoğun insan yüzü tasvirlerinden birini barındırıyor.", "karul-2021-karahantepe", "Buluntu tanımları", "direct", "insan-yuzu-tasvirleri"),
  ],
  [
    E("Bulgu sezon duyuruları ve haber aktarımları üzerinden dolaşıyor; ayrıntılı hakemli yayın henüz yok.", "tas-tepeler-projesi", "Yayın durumu", "counter", "hakemli-yayin-yok"),
    E("Ölçüler ve 'amfitiyatro' benzetmesi ön niteliktedir; yayın çıktığında değişebilir.", "tas-tepeler-projesi", "Ön değerlendirme", "counter", "amfitiyatro-benzetmesi"),
    E("Yapının işlevi bilinmiyor - toplanma, tören ve karar alma önerileri var, hiçbiri kanıtlanmadı.", "karul-2021-karahantepe", "İşlev tartışması", "counter", "islev-bilinmiyor"),
    E("KAYNAK DEĞİŞİKLİĞİ: bu kayıt 'Karahan Tepe basamaklı yapı aktarımları' adlı, künyesi olmayan bir popüler girdiye dayanıyordu. O kaynak çıkarıldı; yerine kazı yöneticisinin hakemli yayını ve proje sayfası kondu.", "karul-2021-karahantepe", "Kaynak düzeyi", "context", "populer-girdi-cikarildi"),
  ],
  "Künyesiz popüler kaynak çıkarıldı. Basamaklı yapının kendisi hâlâ yalnız sezon duyurularına dayanıyor - bu açıkça yazıldı, kaynak yükseltilmiş gibi gösterilmedi.");

kur("gobekli-tepe-kasitli-gomulme", [S.banning2011, S.dai, S.tasTepeler],
  [
    E("Yapıların dolgu içinde ve iyi korunmuş hâlde bulunması, kasıtlı doldurma yorumunun çıkış noktasıydı.", "banning-2011-so-fair-a-house", "Dolgu tartışması", "claim-origin", "dolgu-icinde-korunmus"),
    E("Kazı ekibi dolgu oluşumu konusundaki konumunu kendi yayın kanalında güncelledi.", "dai-tepe-telegrams", "Dolgu yazıları", "direct", "ekip-konumu-guncellendi"),
  ],
  [
    E("Yamaç erozyonu ve doğal dolgu aynı sonucu üretebilir.", "banning-2011-so-fair-a-house", "Oluşum süreçleri", "counter", "erozyon-ayni-sonucu-uretir"),
    E("2025-26'da kuzey kesimde erozyonun üst duvarları zaten aşındırdığı gözlendi.", "tas-tepeler-projesi", "Sezon gözlemi", "counter", "erozyon-gozlendi"),
    E("Tartışma kapanmış değil; iki açıklama da sahada birlikte iş görmüş olabilir.", "dai-tepe-telegrams", "Tartışmanın durumu", "counter", "tartisma-acik"),
    E("KAYNAK DÜZEYİ: 'Göbekli Tepe dolgu oluşumu üzerine tartışma literatürü' diye yazılmış YER TUTUCUNUN yerine Banning 2011 kondu. Banning doğrudan dolgu oluşumu makalesi değil; tapınak yorumunu sorgularken dolguyu da ele alan hakemli eksendir. Dolgu oluşumuna adanmış hakemli bir kaynak bu turda bulunamadı.", "banning-2011-so-fair-a-house", "Kaynak düzeyi", "context", "dolguya-adanmis-kaynak-yok"),
  ],
  "YER TUTUCU DEĞİŞTİ ama TAM DEĞİL: dolgu oluşumuna ADANMIŞ hakemli bir kaynak bulunamadı. Konan kaynağın neyi karşılayıp neyi karşılamadığı kayda yazıldı - yer tutucuyu gerçek kaynak gibi göstermek daha kötü olurdu.");

kur("gobekli-tepe-43-sutun-kuyruklu-yildiz", [S.sweatman2017, S.notroff2017],
  [
    E("İddia 2017'de arkeoastronomi çerçevesiyle öne sürüldü: Akbaba Taşı'ndaki hayvan figürleri takımyıldızlara eşlenip bir çarpma tarihi okundu.", "sweatman-2017-gobekli-arkeoastronomi", "Ana argüman", "claim-origin", "2017-iddiasi"),
    E("Sitenin kendi kazı ekibi yayımlanmış bir yanıt verdi.", "notroff-2017-akbaba-yaniti", "Yanıtın kendisi", "direct", "ekip-yaniti"),
  ],
  [
    E("Hayvan-takımyıldız eşleştirmesi keyfîdir; hangi figürün hangi takımyıldıza karşılık geldiği önceden belirlenmiş bir kurala dayanmıyor.", "notroff-2017-akbaba-yaniti", "Eşleştirme eleştirisi", "counter", "eslestirme-keyfi"),
    E("Sütunun bulunduğu yapı iddia edilen tarihten sonraya aittir.", "notroff-2017-akbaba-yaniti", "Tarihleme itirazı", "counter", "yapi-sonraya-ait"),
    E("Yöntem hemen hemen her kabartma kümesine uygulanıp bir sonuç üretebilir - yani yanlışlanamaz.", "notroff-2017-akbaba-yaniti", "Yöntem eleştirisi", "counter", "yontem-yanlislanamaz"),
    E("Tartışma karşılıklı devam etti: iddia sahipleri yanıta da cevap verdi. Bu kayıt tartışmayı kapanmış saymıyor, ağırlığın nerede olduğunu söylüyor.", "sweatman-2017-gobekli-arkeoastronomi", "Tartışmanın seyri", "context", "tartisma-karsilikli"),
  ],
  "İki YER TUTUCU da gerçek künyeyle değişti. Zenodo DOI'leri crossref'te görünmediği için ilk turda yanlışlıkla elenmişlerdi; OpenAlex doğruladı.");

/* --- Sigiriya ------------------------------------------------------- */

kur("sigiriya-kale-mi-saray-mi", [S.culavamsa, S.bandaranayake, S.mogren, S.unescoSigiriya],
  [
    E("Culavamsa Kaşyapa'nın baba katli, korku ve sonunda yenilgi anlatısını verir.", "culavamsa", "Kaşyapa bölümleri", "claim-origin", "culavamsa-anlatisi"),
    E("Zirvede saray kalıntıları ve kaya yamacında dik erişim var.", "unesco-sigiriya", "Site tanımı", "direct", "zirvede-saray"),
    E("Çevredeki yerleşim arkeolojisi kayayı yalıtılmış bir sığınak değil, planlı bir yerleşim düzeninin merkezi olarak gösteriyor.", "mogren-1999-sigiriya-yerlesim-arkeolojisi", "Yerleşim düzeni", "direct", "planli-yerlesim"),
  ],
  [
    E("Yerleşim planı - simetrik su bahçeleri, kaya bahçeleri, teraslar - savunma değil tören ve gösteri mimarisi.", "unesco-sigiriya", "Bahçe ve plan tanımı", "counter", "toren-gosteri-mimarisi"),
    E("Culavamsa'nın ilgili bölümleri olaydan çok sonra, manastır çevresinde derlendi; Kaşyapa'yı olumsuz gösteren bir çerçevesi var.", "culavamsa", "Derlenme koşulları", "counter", "manastir-cercevesi"),
    E("Kayada Kaşyapa öncesi (yaklaşık MÖ 3. yüzyıldan itibaren) ve sonrası Budist manastır kullanımı izleri var; site tek amaçlı değil.", "bandaranayake-1986-sri-lanka-resimleri", "Kullanım evreleri", "counter", "tek-amacli-degil"),
    E("'Kale mi saray mı' ikilemi de bir kategori dayatması olabilir; yapı iki işlevi birden taşımış olabilir.", "mogren-1999-sigiriya-yerlesim-arkeolojisi", "İşlev tartışması", "context", "ikilem-dayatma-olabilir"),
  ],
  "Mogren 1999 eklendi - kayıt UNESCO tanımı ve bir sanat tarihi kitabı dışında hakemli dayanak taşımıyordu.");

kur("sigiriya-ayna-duvari-grafiti", [S.paranavitana, S.unescoSigiriya, S.bandaranayake],
  [
    E("Cilalı sıva duvara kazınmış 1.800'den fazla dize okundu ve yayımlandı.", "paranavitana-1956-sigiri-graffiti", "Edisyon kapsamı", "direct", "1800-dize"),
    E("Dizeler büyük ölçüde fresklerdeki figürlere hitap ediyor; bazıları önceki yazılara cevap niteliğinde.", "paranavitana-1956-sigiri-graffiti", "İçerik çözümlemesi", "direct", "figurlere-hitap"),
    E("Külliyat erken Sinhala dilinin ve şiir geleneğinin başlıca kaynağıdır.", "paranavitana-1956-sigiri-graffiti", "Dil ve edebiyat değeri", "direct", "sinhala-kaynagi"),
    E("Yazıların varlığı sitenin en az iki yüzyıl boyunca DÜZENLİ ZİYARET EDİLDİĞİNİ gösteriyor.", "unesco-sigiriya", "Kullanım sürekliliği", "inference", "duzenli-ziyaret"),
  ],
  [
    E("Dizelerin tarihlendirilmesi paleografiye dayanıyor; 'en az iki yüzyıl' aralığı kesin bir takvim değil.", "paranavitana-1956-sigiri-graffiti", "Tarihleme yöntemi", "counter", "paleografik-tarihleme"),
    E("Ziyaret edilmiş olmak, sitenin işler durumda olduğunu göstermez; ziyaretçiler bir harabeye de gelmiş olabilir - kayıt 'terk edilmişti' iddiasını reddediyor, 'yaşıyordu' demiyor.", "bandaranayake-1986-sri-lanka-resimleri", "Kullanım evreleri", "counter", "ziyaret-isler-olmak-degil"),
    E("Edisyon 1956 tarihli; sonraki okumalar ve düzeltmeler bu kayıtta taranmadı.", "paranavitana-1956-sigiri-graffiti", "Kaynak düzeyi", "context", "1956-edisyonu"),
  ],
  "Bu kaydın hiç karşı kanıtı yoktu; üçü yazıldı. İkisi kaydın kendi sınırı, biri kaynağın yaşı.");

kur("sigiriya-fresk-kimlikleri", [S.bandaranayake, S.paranavitana],
  [
    E("Figürlerin ikonografisi hem dinsel hem seküler okumaya açık.", "bandaranayake-1986-sri-lanka-resimleri", "İkonografi çözümlemesi", "direct", "ikonografi-acik"),
    E("Ayna Duvarı dizeleri figürlere hitap eder ama kimliklerini tanımlamaz.", "paranavitana-1956-sigiri-graffiti", "Dizelerin içeriği", "direct", "dizeler-tanimlamaz"),
    E("Rakip yorumlar var ve hiçbiri kanıtlanmadı: gök perileri (apsara), bulut kızları, dinsel bağış sahneleri, ya da saray kadınları.", "bandaranayake-1986-sri-lanka-resimleri", "Yorum dökümü", "direct", "rakip-yorumlar"),
  ],
  [
    E("Özgün fresklerin çok büyük bölümü kayıp; günümüze ulaşan sayı yirmi civarında, bu da bağlam okumasını zorlaştırıyor.", "bandaranayake-1986-sri-lanka-resimleri", "Koruma durumu", "counter", "cogu-kayip"),
    E("Yorumların hiçbirinin kanıtlanmamış olması, hepsinin eşit derecede olası olduğu anlamına gelmez; kayıt turistik anlatının SEÇİMİNİ eleştiriyor, tek bir doğru yorum önermiyor.", "bandaranayake-1986-sri-lanka-resimleri", "Kayıt düzeyi ayrımı", "context", "esit-olasi-degil"),
    E("Bu kayıt tek bir sanat tarihi eserine dayanıyor; ikonografi tartışmasının güncel durumu taranmadı.", "bandaranayake-1986-sri-lanka-resimleri", "Kaynak düzeyi", "context", "tek-esere-dayaniyor"),
  ],
  "Kaydın hiç kanıtı yoktu, yalnız karşı kanıtı vardı; üçü yazıldı. Tek esere dayandığı işaretlendi.");

/* --- kanon ve Kapadokya --------------------------------------------- */

kur("antik-kanon-turizm-kategorisi", [S.urry, S.unescoKriter, S.seyahatSiteleri],
  [
    E("Turistik bakış, görülmeye değer olanı önceden belirleyen ve kendi kanonunu üreten bir mekanizmadır.", "urry-1990-tourist-gaze", "Turistik bakış kavramı", "direct", "turistik-bakis-mekanizmasi"),
    E("Listedeki her site bugün turistik olarak erişilebilir; savaş bölgelerindekiler kanona girmiyor (Babil ancak 2019'da UNESCO listesine girdi).", "unesco-listeleme-kriterleri", "Coğrafi dengesizlik tartışması", "direct", "erisilebilirlik-filtresi"),
    E("Petra 1812, Angkor 1860'lar, Machu Picchu 1911 - hepsi Avrupa'nın keşif anlatısına girdiklerinde ünlendi.", "urry-1990-tourist-gaze", "Keşif anlatısı ve turizm", "direct", "kesif-anlatisi-tarihleri"),
    E("Türkçe seyahat ve içerik sitelerindeki listeler aynı altı-yedi siteyi tekrarlıyor.", "turkce-seyahat-listeleri", "Liste içerikleri", "claim-origin", "turkce-listeler"),
  ],
  [
    E("Altısı da tek fotoğrafta anlaşılıyor; dağınık yerleşimler ve höyükler listelerde yok. Bu satır bu kayıtta ölçülmedi - gözlemdir, sayım değildir.", "urry-1990-tourist-gaze", "Fotojeniklik", "context", "fotojeniklik-olculmedi"),
    E("Kanona girmiş olmak siteleri önemsiz yapmaz; kayıt sitelerin değerini değil, bir arada anılmalarının GEREKÇESİNİ sorguluyor.", "urry-1990-tourist-gaze", "Kayıt düzeyi ayrımı", "context", "deger-sorgulanmiyor"),
    E("UNESCO listesinin kendisi de eleştiriliyor; kriterler ve coğrafi dağılım dengesiz. Yani kanon eleştirisi için kullanılan ölçüt de nötr değil.", "unesco-listeleme-kriterleri", "Dengesizlik tartışması", "counter", "unesco-de-notr-degil"),
  ],
  "Bu kaydın hiç karşı kanıtı yoktu; üçü yazıldı. Fotojeniklik satırının ölçüm değil gözlem olduğu işaretlendi.");

kur("kapadokya-havalandirma-olculmemis", [S.aydan],
  [
    E("Baca etkisi fiziksel olarak gerçek ve mekanizması bilinen bir olgu.", "aydan-ulusay-2013-derinkuyu", "Havalandırma ve iklim izlemesi", "context", "baca-etkisi"),
    E("Yaklaşık 52 havalandırma bacası bildiriliyor; bazıları aynı zamanda kuyu işlevi görüyor.", "aydan-ulusay-2013-derinkuyu", "Site tanımı", "direct", "52-baca"),
    E("Sitede sıcaklık, nem ve hava basıncı izlemesi yapıldı.", "aydan-ulusay-2013-derinkuyu", "Ölçüm programı", "direct", "sicaklik-nem-basinc"),
  ],
  [
    E("Havalandırmaya ADANMIŞ hakemli bir ölçüm ya da CFD çalışması bu taramada bulunamadı.", "aydan-ulusay-2013-derinkuyu", "Kapsam", "counter", "adanmis-calisma-yok"),
    E("Mevcut mühendislik literatürü jeomekanik kararlılık üzerine; havalandırma performansı kapsamda değil - sıcaklık ve nem izlemesi kayaç davranışı için yapıldı.", "aydan-ulusay-2013-derinkuyu", "Çalışmanın amacı", "counter", "jeomekanik-odakli"),
    E("Kapasite iddiası (20.000 kişi) da bu ölçüm boşluğu nedeniyle üst sınırdan doğrulanamıyor.", "aydan-ulusay-2013-derinkuyu", "Kapsam dışı", "counter", "kapasite-dogrulanamiyor"),
    E("'Bulunamadı' ile 'yok' aynı şey değildir: bu kayıt bir TARAMA SONUCUDUR. Türkçe mühendislik literatürü ve yayımlanmamış kurum raporları taranmadı.", "aydan-ulusay-2013-derinkuyu", "Tarama düzeyi", "context", "bulunamadi-yok-degil"),
  ],
  "Künye tamamlandı (yazarlar + yıl). 'Bulunamadı ile yok aynı şey değil' sınırı eklendi - kayıt yokluk iddiasını fazla kesin kuruyordu.");

/* --- uygula -------------------------------------------------------- */

for (const r of yeni) {
  const i = list.findIndex((x) => x.id === r.id);
  const onceki = list[i].schema_version ?? 1;
  list[i] = r;
  console.log(`  v${onceki} -> v2  ${r.id}`);
}
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
const v2 = list.filter((r) => r.schema_version === 2).length;
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${v2}${v2 === list.length ? "  DOSYA TAMAM" : `, kalan v1: ${list.length - v2}`}`);
