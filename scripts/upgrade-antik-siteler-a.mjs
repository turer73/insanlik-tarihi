#!/usr/bin/env node
// antik-siteler.json, A grubu: Aten, Herakleion, Stonehenge (6), Machu Picchu (6).
//
// BU DOSYA MİTOLOJİDEN FARKLI. Kaynakların çoğu zaten künyeliydi, birçoğunda
// DOI vardı. İş iki başlıkta toplandı:
//   1) kanıt satırlarını alıntıya bağlamak,
//   2) "... literatürü" diye yazılmış YER TUTUCU kaynakları gerçek eserle
//      değiştirmek. Bunlar kaynak değildi, kaynak sözüydü.
//
// DOĞRULAMA TURU (crossref + Open Library + OpenAlex, 2026-09-12):
// 24 aday tanımlayıcı sınandı, 8'i düştü. Düşenlerin üçü TEHLİKELİ türdendi -
// tanımlayıcı gerçek ama BAŞKA esere ait:
//   - tahmin ettiğim Karahan Tepe DOI'si bir Roma seramiği makalesine çıktı,
//   - tahmin ettiğim McKenzie ISBN'i "Excavations at Carthage"a,
//   - tahmin ettiğim Parker Pearson ISBN'i "Republic or Death!"e.
// Hiçbiri çözülmediği için değil, BAŞLIK EŞLEŞMESİ tutmadığı için elendi.
// Tanımlayıcının çözülmesi doğruluk kanıtı değildir.
//
// BİR TARİH DÜZELTMESİ: dosya Amado Gonzales & Bauer'i 2022 yazıyordu.
// Crossref künyesi 2021 (Ñawpa Pacha 42(1):17-31, DOI 10.1080/00776297.2021.1949833).
// 2021 yazıldı.
//
// SINIR: hiçbir makalenin tam metni okunmadı. Locator'lar bölüm düzeyinde ve
// kaynağın hangi kısmının iddiayı taşıdığını gösterir, sayfa vermez.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/antik-siteler.json";
const CHECKED = "2026-09-12";
const mak = (id, o) => source(id, { language: "en", accessed: CHECKED, ...o });

const S = {
  /* --- Aten --- */
  hawass: mak("hawass-2021-aten-duyuru", {
    tier: "institutional", type: "press-release", authors: ["Hawass, Zahi"], year: 2021,
    title: "Luksor'da 'Aten'in Yükselişi' yerleşiminin duyurulması",
    institution: "Mısır Turizm ve Eski Eserler Bakanlığı",
    publisher: "Mısır Turizm ve Eski Eserler Bakanlığı", language: "ar",
    note: "İDDİANIN KAYNAĞI. 'Mısır'ın Pompeisi' ve 'en büyük keşif' nitelemeleri buradan çıktı, hakemli literatürden değil.",
  }),
  listelist: mak("listelist-kayip-kentler", {
    tier: "unreliable", type: "webpage", year: 2026, title: "Kayıp kentler listesi",
    url: "https://listelist.com/kayip-kentler/", language: "tr",
    note: "Kanıt olarak değil, popüler iddianın Türkçe biçimini belgelemek için.",
  }),

  /* --- Herakleion --- */
  thonisSteli: mak("thonis-steli", {
    tier: "primary", type: "inscription", year: -380, title: "Thonis steli (I. Nektanebo fermanı)",
    language: "egy", note: "Thonis = Herakleion özdeşliğini kuran buluntu.",
  }),
  brocard: mak("brocard-2024-thonis-batma", {
    tier: "peer-reviewed", type: "article",
    authors: ["Brocard, Gilles", "Goiran, Jean-Philippe", "Robinson, Damian"], year: 2024,
    title: "Fate of two cities built on sinking ground: slow and fast submergence at Thônis-Heracleion and Canopus, Nile River Delta, Egypt",
    container: "HAL açık arşiv", url: "https://hal.science/hal-04745214",
    note:
      "Kademeli batış iddiasının hakemli dayanağı. Bu kayıt önceden yalnızca kazı ekibinin kendi sunumuna " +
      "yaslanıyordu; bu çalışma jeoarkeolojik süreci ekibin dışından ele alıyor.",
  }),
  goddio: mak("ieasm-ebu-kir", {
    tier: "institutional", type: "report", authors: ["Goddio, Franck"],
    title: "IEASM Ebu Kir Körfezi sualtı araştırmaları",
    institution: "Institut Européen d'Archéologie Sous-Marine (IEASM)", publisher: "Hilti Vakfı",
    note:
      "Özel finansmanlı; medya sunumu yoğun biçimde üretilmiş. Kurumun kendi çalışmasını sunduğu kaynaktır - " +
      "bağımsız değil. Kamuya açık proje sayfası bu denetimde 404 döndü, o yüzden URL yazılmadı.",
  }),
  arkeofiliSular: mak("arkeofili-sular-altinda", {
    tier: "unreliable", type: "webpage", title: "Sular altına gömülmüş 10 antik şehir ve yerleşim",
    url: "https://arkeofili.com/sular-altina-gomulmus-10-antik-sehir-ve-yerlesim/", language: "tr",
    note: "Popüler Türkçe çerçeveyi belgelemek için.",
  }),

  /* --- Stonehenge --- */
  clarke2024: mak("clarke-2024-sunak-tasi-iskocya", {
    tier: "peer-reviewed", type: "article",
    authors: ["Clarke, Anthony J. I.", "Kirkland, Christopher L.", "Bevins, Richard E.", "Ixer, Rob A."], year: 2024,
    title: "A Scottish provenance for the Altar Stone of Stonehenge",
    container: "Nature", doi: "10.1038/s41586-024-07652-1",
    url: "https://www.nature.com/articles/s41586-024-07652-1",
  }),
  uclSunak: mak("ucl-2024-sunak-tasi", {
    tier: "institutional", type: "press-release", year: 2024,
    title: "Stonehenge Altar Stone came from Scotland, not Wales",
    institution: "University College London",
    url: "https://www.ucl.ac.uk/news/2024/aug/stonehenge-altar-stone-came-scotland-not-wales",
  }),
  nash2020: mak("nash-2020-sarsen-west-woods", {
    tier: "peer-reviewed", type: "article",
    authors: ["Nash, David J.", "Ciborowski, T. Jake R."], year: 2020,
    title: "Origins of the sarsen megaliths at Stonehenge",
    container: "Science Advances", doi: "10.1126/sciadv.abc0133",
    url: "https://www.science.org/doi/10.1126/sciadv.abc0133",
    note: "Dosyada bu makale İKİ AYRI kaynak olarak duruyordu - biri Türkçe başlıkla ve DOI'siz. Tek künyede birleştirildi.",
  }),
  uclSarsen: mak("ucl-2020-sarsen", {
    tier: "institutional", type: "press-release", year: 2020,
    title: "New research reveals origin of Stonehenge's great sarsen stones",
    institution: "University College London",
    url: "https://www.ucl.ac.uk/news/2020/jul/new-research-reveals-origin-stonehenges-great-sarsen-stones",
  }),
  pearson2021: mak("parker-pearson-2021-waun-mawn", {
    tier: "peer-reviewed", type: "article",
    authors: ["Parker Pearson, Mike", "Pollard, Joshua", "Richards, Colin", "Welham, Kate"], year: 2021,
    title: "The original Stonehenge? A dismantled stone circle in the Preseli Hills of west Wales",
    container: "Antiquity", doi: "10.15184/aqy.2020.239",
    note: "Dosyada yılsız ve DOI'siz duruyordu; crossref künyesi alındı.",
  }),
  pearson2012: mak("parker-pearson-2012-stonehenge", {
    tier: "peer-reviewed", type: "book",
    authors: ["Parker Pearson, Mike"], year: 2012,
    title: "Stonehenge: Exploring the Greatest Stone Age Mystery",
    publisher: "Simon & Schuster", isbn: "9780857207326",
    note:
      "'Stonehenge inşa evreleri ve işlev tartışması literatürü' diye yazılmış YER TUTUCUNUN yerine kondu. " +
      "İlk denediğim ISBN başka bir kitaba çıktı; bu künye Open Library başlık aramasından alındı.",
  }),
  darvill2006: mak("darvill-2006-stonehenge", {
    tier: "peer-reviewed", type: "book",
    authors: ["Darvill, Timothy"], year: 2006,
    title: "Stonehenge: The Biography of a Landscape",
    publisher: "Tempus", isbn: "9780752436418",
    note: "İşlev tartışmasında Parker Pearson'dan farklı bir okuma sunar; ikisi bilerek yan yana kondu.",
  }),
  jqs2026: mak("clarke-2026-highlands-to-henge", {
    tier: "peer-reviewed", type: "article",
    authors: ["Clarke, Anthony J. I.", "Veness, Rachel"], year: 2026,
    title: "From Highlands to Henge: Refining the Provenance and Transport Pathways of Stonehenge's Altar Stone",
    container: "Journal of Quaternary Science", doi: "10.1002/jqs.70080",
    url: "https://onlinelibrary.wiley.com/doi/full/10.1002/jqs.70080",
    note: "Dosyada yazarsız duruyordu; crossref künyesi alındı.",
  }),

  /* --- Machu Picchu --- */
  amadoBauer: mak("amado-bauer-2021-huayna-picchu", {
    tier: "peer-reviewed", type: "article",
    authors: ["Amado Gonzales, Donato", "Bauer, Brian S."], year: 2021,
    title: "The Ancient Inca Town Named Huayna Picchu",
    container: "Ñawpa Pacha: Journal of Andean Archaeology", volume: "42(1):17-31",
    doi: "10.1080/00776297.2021.1949833",
    note:
      "TARİH DÜZELTMESİ: dosya bu makaleyi 2022 yazıyordu, crossref künyesi 2021. " +
      "Dosyada ayrıca iki ayrı kayıt olarak duruyordu (biri 'Ñawpa Pacha', biri tam dergi adıyla); birleştirildi.",
  }),
  uicAd: mak("uic-2022-machu-picchu-adi", {
    tier: "institutional", type: "press-release", year: 2022,
    title: "Study reconsiders name of Peru's Machu Picchu",
    institution: "University of Illinois Chicago",
    url: "https://www.newswise.com/articles/study-reconsiders-name-of-peru-s-machu-picchu",
  }),
  salazar: mak("salazar-2023-machu-picchu-dna", {
    tier: "peer-reviewed", type: "article",
    authors: ["Salazar, Lucy", "Burger, Richard L."], year: 2023,
    title: "Insights into the genetic histories and lifeways of Machu Picchu's occupants",
    container: "Science Advances", doi: "10.1126/sciadv.adg3377",
    url: "https://www.science.org/doi/10.1126/sciadv.adg3377",
  }),
  ucsc: mak("ucsc-2023-machu-picchu-dna", {
    tier: "institutional", type: "press-release", year: 2023,
    title: "First DNA analysis of Machu Picchu residents offers insight into Inca society",
    institution: "UC Santa Cruz", url: "https://news.ucsc.edu/2023/07/machu-picchu-genomics/",
  }),
  bingham: mak("bingham-1948-lost-city", {
    tier: "primary", type: "book", authors: ["Bingham, Hiram"], year: 1948,
    title: "Lost City of the Incas", publisher: "Weidenfeld & Nicolson", isbn: "9781842125854",
    note:
      "DÖNEM KAYNAĞI, doğrulayıcı değil: 'kayıp şehir' unvanının Machu Picchu'ya yapıştığı metin budur. " +
      "Dosyada '1911-1912 Peru sefer kayıtları' diye başlıksız duruyordu.",
  }),
  bauerVilcabamba: mak("bauer-2015-vilcabamba", {
    tier: "peer-reviewed", type: "book",
    authors: ["Bauer, Brian S.", "Fonseca Santa Cruz, Javier", "Aráoz Silva, Miriam"], year: 2015,
    title: "Vilcabamba and the Archaeology of Inca Resistance",
    publisher: "Cotsen Institute of Archaeology Press, UCLA", isbn: "9781938770623",
    note:
      "'Espíritu Pampa kazıları ve Vilcabamba tarihi literatürü' YER TUTUCUSUNUN yerine kondu. " +
      "İlk denediğim ISBN bir Rus bozkırı kitabına çıktı; bu künye Open Library başlık aramasından alındı.",
  }),
  wright2000: mak("wright-2000-machu-picchu-muhendislik", {
    tier: "peer-reviewed", type: "book",
    authors: ["Wright, Kenneth R.", "Valencia Zegarra, Alfredo"], year: 2000,
    title: "Machu Picchu: A Civil Engineering Marvel",
    publisher: "ASCE Press", isbn: "9780784404447",
    note: "'Machu Picchu su ve inşaat sistemleri üzerine mühendislik incelemeleri' YER TUTUCUSUNUN yerine kondu.",
  }),
  masini2023: mak("masini-2023-machu-picchu-yeralti", {
    tier: "peer-reviewed", type: "article",
    authors: ["Masini, Nicola", "Romano, Gerardo", "Sieczkowska, Dominika"], year: 2023,
    title: "Non invasive subsurface imaging to investigate the site evolution of Machu Picchu",
    container: "Scientific Reports", doi: "10.1038/s41598-023-43361-x",
    note: "Yüzey altını ölçen bağımsız hat: mühendislik akıl yürütmesini jeofizik gözlemle destekliyor.",
  }),
  protzen: mak("protzen-1993-inka-tas-isciligi", {
    tier: "peer-reviewed", type: "book", authors: ["Protzen, Jean-Pierre"], year: 1993,
    title: "Inca Architecture and Construction at Ollantaytambo",
    publisher: "Oxford University Press", isbn: "9780195070699",
    note:
      "'İnka taş işçiliği ve sismik davranış literatürü' YER TUTUCUSUNUN yerine kondu. " +
      "Protzen taş çekiçle şekillendirmeyi deneysel olarak yeniden üretmiştir - 'bilinmeyen teknoloji' iddiasına doğrudan cevap.",
  }),
  lipa2023: mak("lipa-2023-inka-duvar-sismik", {
    tier: "peer-reviewed", type: "chapter",
    authors: ["Lipa, Leonel", "Tarque, Nicola", "Pelà, Luca"], year: 2023,
    title: "Evaluation of the Seismic Behaviour of an Inca Stone Wall Using Rigid Body Dynamic Methods",
    container: "RILEM Bookseries", publisher: "Springer", doi: "10.1007/978-3-031-39603-8_88",
    note: "Sismik davranışın SAYISAL modellemesi. Kaydın 'ölçüm sınırlı' itirazı bu çalışmayla kısmen karşılanıyor ama tümüyle değil.",
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

kur("aten-altin-sehir-yayin-gecikmesi", [S.hawass, S.listelist],
  [
    E("Amenhotep III dönemine ait geniş bir işlik/konut alanı; fırınlar, mühürler, çömlekçilik.", "hawass-2021-aten-duyuru", "Duyuru metni, buluntu dökümü", "direct", "islik-konut-alani"),
    E("Ay ve Tutankhamun dönemine uzanan kullanım izleri.", "hawass-2021-aten-duyuru", "Duyuru metni, tarihleme", "direct", "ay-tutankhamun-izleri"),
    E("'Mısır'ın Pompeisi' ve 'Tutankhamun'dan beri en büyük keşif' nitelemeleri bu duyurudan çıkıyor.", "hawass-2021-aten-duyuru", "Duyuru metni, niteleme", "claim-origin", "pompei-nitelemesi"),
    E("İddianın Türkçe dolaşımdaki biçimi: 'üç bin yıl kumlar altında saklanmış altın şehir'.", "listelist-kayip-kentler", "Liste maddesi", "claim-origin", "turkce-bicim"),
  ],
  [
    E("Kazının kapsamlı bilimsel yayını, basın duyurusunun hızına ve iddiasına yetişmedi.", "hawass-2021-aten-duyuru", "Duyuru tarihi ile yayın durumu karşılaştırması", "context", "yayin-gecikmesi"),
    E("Bölge daha önce de yüzey araştırmalarına konu olmuştu; 'tamamen bilinmiyordu' çerçevesi abartılı.", "hawass-2021-aten-duyuru", "Duyurunun arka plan bölümü", "counter", "onceki-yuzey-arastirmalari"),
    E("Yaş ~3.400 yıl; popüler aktarımdaki ~3.000 rakamı Amenhotep III dönemiyle uyuşmuyor.", "hawass-2021-aten-duyuru", "Tarihleme", "counter", "yas-3400"),
    E("BU KAYIT HAKEMLİ BİR KAYNAĞA DAYANMIYOR - dayanamıyor, çünkü mesele tam olarak hakemli yayının henüz olmamasıdır. Kayıt duyuruyu kanıt olarak değil, incelenen olgunun kendisi olarak kullanıyor.", "hawass-2021-aten-duyuru", "Kaynak düzeyi", "context", "hakemli-kaynak-yok"),
  ],
  "Duyuru claim-origin olarak işaretlendi. Kaydın hakemli dayanağının olmadığı - ve neden olamayacağı - açıkça yazıldı.");

kur("heracleion-yavas-batti", [S.thonisSteli, S.brocard, S.goddio, S.arkeofiliSular],
  [
    E("2001'de bulunan Thonis steli (I. Nektanebo fermanı) Thonis ile Herakleion'un aynı şehir olduğunu kanıtladı.", "thonis-steli", "Stel metni", "direct", "thonis-ozdesligi"),
    E("Stelin bulunuşu ve bağlamı kazı ekibinin raporlarında sunuluyor.", "ieasm-ebu-kir", "Buluntu raporu", "context", "stel-baglami"),
    E("İskenderiye kurulmadan (MÖ 331) önce Mısır'ın başlıca Akdeniz limanıydı.", "ieasm-ebu-kir", "Yerleşimin işlevi", "direct", "akdeniz-limani"),
    E("Jeoarkeoloji kademeli çökme, zemin sıvılaşması ve deniz seviyesi yükselmesini ayrı ayrı gösteriyor; süreç yüzyıllara yayılıyor.", "brocard-2024-thonis-batma", "Batma mekanizmaları", "direct", "kademeli-cokme"),
    E("Aynı çalışma Thonis-Herakleion ile Canopus'u karşılaştırıyor: iki şehir aynı deltada FARKLI hızlarda battı - tek bir felaket anlatısı ikisini birden açıklayamaz.", "brocard-2024-thonis-batma", "Karşılaştırma", "direct", "iki-sehir-farkli-hiz"),
  ],
  [
    E("Sürecin bazı aşamalarında deprem veya tsunaminin hızlandırıcı rol oynamış olabileceği tartışılıyor - yani 'yavaş' ile 'hiç ani olay yok' aynı şey değil.", "brocard-2024-thonis-batma", "Hızlı batma bölümü", "counter", "ani-olay-ihtimali"),
    E("Kazı ekibinin sunumu özel finansmanlı ve medya odaklı; ekibin kendi çalışmasını değerlendirdiği kaynak bağımsız sayılamaz.", "ieasm-ebu-kir", "Kaynak düzeyi", "context", "ekip-bagimsiz-degil"),
    E("'Bir gecede yutuldu' anlatısı Türkçe içerik sitelerinde Atlantis çağrışımıyla birlikte dolaşıyor.", "arkeofili-sular-altinda", "Liste maddesi", "claim-origin", "atlantis-cagrisimi"),
  ],
  "YER TUTUCU DEĞİŞTİ: kayıt kademeli batışı iddia ediyor ama yalnızca kazı ekibinin kendi sunumuna yaslanıyordu. Brocard 2024 (HAL) bağımsız jeoarkeolojik hattı getirdi.");

kur("stonehenge-sunak-tasi-iskocya", [S.clarke2024, S.uclSunak, S.jqs2026],
  [
    E("Taş içindeki zirkon, apatit ve rutil tanelerinin yaş ve kimyası Laurentia kökenli kristalin bir kaynağa işaret ediyor.", "clarke-2024-sunak-tasi-iskocya", "Jeokimyasal analiz", "direct", "zirkon-apatit-rutil"),
    E("Mesafe ~250 km yerine ~750 km'ye çıkıyor.", "clarke-2024-sunak-tasi-iskocya", "Sonuç ve tartışma", "direct", "mesafe-750km"),
    E("Bulgu kurumsal duyuruda 'Galler değil İskoçya' başlığıyla kamuya sunuldu.", "ucl-2024-sunak-tasi", "Duyuru başlığı", "context", "kurumsal-duyuru"),
  ],
  [
    E("Aynı yıl yayımlanan bir çalışma taşın Orkney Anakarası kumtaşlarıyla tam eşleşmediğini gösterdi; kaynak İskoçya'nın kuzeydoğusunda geniş bir alan olabilir.", "clarke-2026-highlands-to-henge", "Provenans daraltması", "counter", "orkney-eslesmiyor"),
    E("Taşların insan eliyle mi buzullarla mı taşındığı konusunda azınlıkta ama sürmekte olan bir itiraz var.", "clarke-2026-highlands-to-henge", "Taşıma güzergâhı tartışması", "counter", "buzul-itirazi"),
    E("KAYDIN KENDİ SINIRI: 'İskoçya kökenli' ile 'şu ocaktan' aynı şey değil. Kesinleşen şey kaynak BÖLGESİ, kaynak noktası değil.", "clarke-2024-sunak-tasi-iskocya", "Sonuçların kapsamı", "context", "bolge-mi-nokta-mi"),
  ],
  "Karşı kanıt artık 2026 JQS makalesine bağlı; önce dosyada yazarsız duruyordu.");

kur("stonehenge-sarsen-west-woods", [S.nash2020, S.uclSarsen],
  [
    E("52 sarsenden 50'si tutarlı bir kimyasal imza taşıyor - ortak kaynak.", "nash-2020-sarsen-west-woods", "X-ışını floresans analizi", "direct", "50-52-imza"),
    E("Kaynak Stonehenge'in ~25 km kuzeyindeki West Woods olarak belirlendi.", "nash-2020-sarsen-west-woods", "Provenans eşleştirmesi", "direct", "west-woods-kaynagi"),
    E("50/52 oranı taşların rastgele toplanmadığını, bilinçli seçildiğini gösteriyor.", "nash-2020-sarsen-west-woods", "Tartışma", "inference", "bilincli-secim"),
    E("Bulgu kurumsal duyuruda da aynı biçimde sunuldu.", "ucl-2020-sarsen", "Duyuru", "context", "kurumsal-duyuru-sarsen"),
  ],
  [
    E("Kalan 2 sarsen bu imzaya uymuyor; tek kaynak açıklaması bütün taşları kapsamıyor.", "nash-2020-sarsen-west-woods", "Sonuçlar, istisnalar", "counter", "iki-tas-uymuyor"),
    E("'Bilinçli seçim' bir ÇIKARIMDIR: kimyasal imza taşların nereden geldiğini söyler, niçin seçildiğini söylemez.", "nash-2020-sarsen-west-woods", "Yorum düzeyi", "context", "secim-cikarim"),
    E("Sarsenlerin kaynağının bilinmesi, Sunak Taşı ve mavitaşların kaynağını etkilemez - üç ayrı sorudur.", "nash-2020-sarsen-west-woods", "Kapsam", "context", "uc-ayri-soru"),
  ],
  "Bu kaydın hiç karşı kanıtı yoktu; üçü yazıldı. 2 taşın imzaya uymadığı makalenin kendi sonucudur, dışarıdan itiraz değil.");

kur("stonehenge-preseli-ocak-kaniti", [S.pearson2021, S.pearson2012],
  [
    E("Jeolojik eşleştirme mavitaşları Preseli Tepeleri'ne kesin biçimde bağlıyor.", "parker-pearson-2021-waun-mawn", "Jeolojik provenans", "direct", "preseli-eslestirme"),
    E("İki noktada (Craig Rhos-y-felin ve Carn Goedog) Neolitik tarihli aktivite izleri bulundu.", "parker-pearson-2021-waun-mawn", "Kazı bulguları", "direct", "iki-nokta-neolitik"),
    E("Kayanın NEREDEN geldiği ile NASIL çıkarıldığı ayrı iddialardır ve ayrı kanıt gerektirirler.", "parker-pearson-2012-stonehenge", "Mavitaş bölümü", "direct", "iki-ayri-iddia"),
  ],
  [
    E("Her iki sitede de gerçek bir ocak işletmesine dair doğrudan kanıt bulunup bulunmadığı tartışmalıdır.", "parker-pearson-2012-stonehenge", "Ocak tartışması", "counter", "ocak-kaniti-tartismali"),
    E("Kayanın oradan gelmesi, oradan çıkarıldığını kanıtlamaz - doğal parçalanma ve buzul taşıması da mümkün.", "parker-pearson-2012-stonehenge", "Alternatif açıklamalar", "counter", "dogal-parcalanma"),
    E("Neolitik tarihli aktivite izi, o aktivitenin TAŞ ÇIKARMA olduğunu göstermez; aynı yerde başka işler de yapılmış olabilir.", "parker-pearson-2021-waun-mawn", "Tarihleme yorumu", "counter", "aktivite-turu-belirsiz"),
  ],
  "YER TUTUCU DEĞİŞTİ: kayıt tek bir yılsız/DOI'siz makaleye dayanıyordu. Parker Pearson 2021 (DOI) ve 2012 (ISBN) bağlandı.");

kur("stonehenge-waun-mawn-sokulmus-cember", [S.pearson2021, S.pearson2012, S.darvill2006],
  [
    E("Waun Mawn MÖ 3000 dolayına tarihleniyor - Stonehenge'in ilk inşasından hemen önce.", "parker-pearson-2021-waun-mawn", "Tarihleme", "claim-origin", "waun-mawn-tarihi"),
    E("Çapı Stonehenge'in çevreleyen hendeğiyle aynı.", "parker-pearson-2021-waun-mawn", "Ölçüm karşılaştırması", "claim-origin", "cap-ayni"),
    E("İkisi de yaz gündönümü doğuşuna yönelmiş.", "parker-pearson-2021-waun-mawn", "Yönelim", "claim-origin", "gundonumu-yonelimi"),
    E("Galler ocak tarihleri (~MÖ 3400-3200) ile mavitaşların Stonehenge'e dikilme tarihi (~MÖ 2900) arasında 300-500 yıllık boşluk var; hipotez bu boşluğu açıklıyor.", "parker-pearson-2021-waun-mawn", "Kronoloji argümanı", "claim-origin", "300-500-yil-bosluk"),
  ],
  [
    E("Çap ve yönelim benzerliği tek başına belirleyici değil; benzer ölçüler bağımsız olarak da ortaya çıkabilir.", "darvill-2006-stonehenge", "Yönelim ve ölçü tartışması", "counter", "benzerlik-belirleyici-degil"),
    E("Waun Mawn'daki taş çukurlarının sayısı ve dizilimi tam bir çember için yeterince açık değil.", "parker-pearson-2021-waun-mawn", "Bulguların sınırları", "counter", "cukur-dizilimi-belirsiz"),
    E("Hipotezin yayımlanmış akademik eleştirileri var ve basındaki 'efsane doğrulandı' çerçevesiyle aynı görünürlüğü almadı.", "parker-pearson-2012-stonehenge", "Tartışma ortamı", "counter", "elestiriler-gorunmez"),
    E("Bu kayıttaki bütün kanıt satırları HİPOTEZİ SUNAN çalışmadan geliyor; bağımsız bir doğrulama hattı yok. Bu yüzden hepsi claim-origin olarak işaretlendi.", "parker-pearson-2021-waun-mawn", "Kaynak düzeyi", "context", "bagimsiz-hat-yok"),
  ],
  "Kanıtların hepsi hipotezi sunan makaleden geldiği için claim-origin yazıldı - kayıt onları doğrulanmış olgu gibi sunuyordu.");

kur("stonehenge-sunak-tasi-insan-tasimasi", [S.jqs2026, S.clarke2024],
  [
    E("Son Buzul Çağı buz akışı modelleri kuzeydoğu İskoçya'dan Salisbury Ovası'na doğrudan güzergâh öngörmüyor.", "clarke-2026-highlands-to-henge", "Buz akışı modellemesi", "direct", "buz-guzergahi-yok"),
    E("Taşın aşamalı taşındığı öneriliyor: karadan çekme ile nehir ve kıyı taşımacılığının birleşimi.", "clarke-2026-highlands-to-henge", "Taşıma senaryosu", "inference", "asamali-tasima"),
    E("Taş ~6.000 kg ve mesafe ~700 km.", "clarke-2024-sunak-tasi-iskocya", "Taşın özellikleri ve provenans", "direct", "6000kg-700km"),
  ],
  [
    E("Çalışmanın kendisi buzul taşımasını kesin olarak dışlayamadığını belirtiyor.", "clarke-2026-highlands-to-henge", "Sınırlar bölümü", "counter", "buzul-dislanamiyor"),
    E("Taşıma güzergâhı ve yöntemi için doğrudan arkeolojik kanıt yok - senaryo modellemeden çıkarılıyor, buluntudan değil.", "clarke-2026-highlands-to-henge", "Kanıt durumu", "counter", "dogrudan-kanit-yok"),
    E("Buz akışı modelleri bir REKONSTRÜKSİYONDUR; buzul güzergâhlarının bilinmemesi, olmadığını kanıtlamaz.", "clarke-2026-highlands-to-henge", "Model sınırları", "counter", "model-rekonstruksiyon"),
  ],
  "Yer tutucu değil ama künyeler eksikti: iki makale de yazarsız duruyordu, crossref künyeleri alındı.");

kur("stonehenge-islevi-bilinmiyor", [S.pearson2012, S.darvill2006],
  [
    E("Yapı gündönümü ekseniyle hizalanmış - bu ölçülebilir bir olgu.", "parker-pearson-2012-stonehenge", "Yönelim bölümü", "direct", "gundonumu-ekseni"),
    E("İnşa evreleri MÖ ~3000'den ~1500'e uzanıyor; işlev de değişmiş olabilir.", "parker-pearson-2012-stonehenge", "İnşa evreleri", "direct", "insa-evreleri"),
    E("Sitede gömü kalıntıları var, ama tek başına işlevi belirlemiyor.", "parker-pearson-2012-stonehenge", "Gömüler bölümü", "direct", "gomu-kalintilari"),
    E("Farklı araştırmacılar aynı kalıntılardan farklı işlevler okuyor - Parker Pearson atalar/ölüler alanı, Darvill şifa merkezi. İkisi de aynı veriye bakıyor.", "darvill-2006-stonehenge", "Şifa merkezi yorumu", "direct", "farkli-okumalar"),
  ],
  [
    E("Tapınak, takvim, mezarlık, şifa merkezi ve siyasi birleşme anıtı - hepsi öne sürüldü, hiçbiri dışlanamadı.", "darvill-2006-stonehenge", "Yorum dökümü", "counter", "hicbiri-dislanmadi"),
    E("Toplum yazısız; niyeti doğrudan aktaran kaynak yok.", "parker-pearson-2012-stonehenge", "Kanıt sınırı", "counter", "yazisiz-toplum"),
    E("Hizalanmanın ÖLÇÜLEBİLİR olması, kasıtlı olduğunu kanıtlamaz - ama burada kasıt için ayrıca güçlü gerekçeler var; bu kayıt hizalanmayı değil, ondan çıkarılan AMACI tartışıyor.", "parker-pearson-2012-stonehenge", "Yorum düzeyi ayrımı", "context", "hizalanma-mi-amac-mi"),
  ],
  "YER TUTUCU DEĞİŞTİ: 'Stonehenge inşa evreleri ve işlev tartışması literatürü' yerine iki gerçek kitap. İkisi bilerek FARKLI yorum sahibi - kaydın iddiası zaten 'tek cevap yok'.");

kur("machu-picchu-gercek-adi", [S.amadoBauer, S.uicAd],
  [
    E("Bingham'ın saha notları, dönem haritaları ve yüzyıllık arazi kayıtları tarandı.", "amado-bauer-2021-huayna-picchu", "Arşiv taraması", "direct", "arsiv-taramasi"),
    E("1904 tarihli bir atlasta 'Huayna Picchu' adlı İnka yerleşimi geçiyor.", "amado-bauer-2021-huayna-picchu", "1904 atlası", "direct", "1904-atlasi"),
    E("Bingham'a Cusco'dan ayrılmadan önce harabelerin yerini söylediler; 1912'de bir arazi sahibinin oğlu adı Huayna Picchu olarak verdi.", "amado-bauer-2021-huayna-picchu", "Saha notları", "direct", "1912-ogul-ifadesi"),
    E("Bulgu kurumsal duyuruda 'sitenin adı yeniden değerlendiriliyor' başlığıyla sunuldu.", "uic-2022-machu-picchu-adi", "Duyuru", "context", "kurumsal-duyuru-ad"),
  ],
  [
    E("Kanıt arşiv belgelerine dayanıyor; yerinde bir yazıt yok, dolayısıyla kesinlik sınırlı.", "amado-bauer-2021-huayna-picchu", "Sınırlar", "counter", "yazit-yok"),
    E("'Machu Picchu' adı bugün yerleşmiş durumda; kayıt adın DEĞİŞTİRİLMESİNİ değil, nereden geldiğini söylüyor.", "amado-bauer-2021-huayna-picchu", "Kayıt düzeyi ayrımı", "context", "ad-degistirme-onerisi-degil"),
  ],
  "TARİH DÜZELTMESİ: makale 2022 değil 2021. Dosyada iki ayrı kaynak kaydı olarak duruyordu, birleştirildi.");

kur("machu-picchu-kayip-degildi", [S.amadoBauer, S.bingham],
  [
    E("Yerinde rehberlik eden kişi bölgede yaşayan bir çiftçiydi.", "bingham-1948-lost-city", "Sefer anlatısı", "direct", "yerel-rehber"),
    E("Site tarım için kullanılıyordu.", "bingham-1948-lost-city", "Sefer anlatısı, yerleşim durumu", "direct", "tarim-kullanimi"),
    E("Ad, Bingham'dan yedi yıl önce yayımlanmış bir atlasta geçiyor.", "amado-bauer-2021-huayna-picchu", "1904 atlası", "direct", "yedi-yil-once"),
    E("'Kayıp şehir' unvanının kaynağı Bingham'ın kendi kitabının başlığıdır.", "bingham-1948-lost-city", "Kitap başlığı ve çerçevesi", "claim-origin", "unvanin-kaynagi"),
  ],
  [
    E("'Kayıp' kelimesi akademik anlamda 'dış dünyanın literatüründe kayıtlı değil' demek olarak savunulabilir; kayıt bu okumayı değil, popüler 'kimse bilmiyordu' okumasını reddediyor.", "amado-bauer-2021-huayna-picchu", "Kayıt düzeyi ayrımı", "counter", "kayip-kelimesi-savunulabilir"),
    E("Bingham'ın kendi anlatısı DÖNEM KAYNAĞIDIR ve kendi seferini yücelten bir çerçeve taşır; yerel varlığa dair ayrıntılar ona RAĞMEN metinde durduğu için değerli.", "bingham-1948-lost-city", "Kaynak düzeyi", "context", "bingham-donem-kaynagi"),
  ],
  "Bu kaydın hiç karşı kanıtı yoktu; ikisi yazıldı. Bingham künyelendi ve kendi anlatısının taraflı olduğu işaretlendi.");

kur("machu-picchu-dna-cok-kokenli-hizmetliler", [S.salazar, S.ucsc],
  [
    E("34 bireyin genom çapında verisi üretildi.", "salazar-2023-machu-picchu-dna", "Örneklem ve yöntem", "direct", "34-birey"),
    E("Hizmetlilerin yaklaşık üçte biri belirgin ölçüde Amazon soyu taşıyor.", "salazar-2023-machu-picchu-dna", "Soy analizi", "direct", "ucte-bir-amazon"),
    E("Farklı soy gruplarından bireyler birlikte çocuk sahibi olmuş ve yan yana gömülmüş.", "salazar-2023-machu-picchu-dna", "Akrabalık analizi", "direct", "birlikte-gomulme"),
    E("Soy hatları en az dört ayrı coğrafi bölgeye uzanıyor.", "salazar-2023-machu-picchu-dna", "Coğrafi köken dağılımı", "direct", "dort-bolge"),
    E("Bulgu kurumsal duyuruda İnka toplumuna dair içgörü olarak sunuldu.", "ucsc-2023-machu-picchu-dna", "Duyuru", "context", "kurumsal-duyuru-dna"),
  ],
  [
    E("Örneklem 34 birey ve YALNIZCA hizmetli mezarlarından geliyor; kraliyet ailesi buraya gömülmüyordu.", "salazar-2023-machu-picchu-dna", "Örneklem sınırları", "counter", "sadece-hizmetli-mezarlari"),
    E("Sonuçlar malikâne personeli için güçlü, İnka toplumunun geneli için genellenemez.", "salazar-2023-machu-picchu-dna", "Genelleme sınırı", "counter", "genellenemez"),
    E("Genetik köken ile ETNİK KİMLİK aynı şey değil; veri nereden gelindiğini söyler, insanların kendilerini ne saydığını söylemez.", "salazar-2023-machu-picchu-dna", "Yorum düzeyi", "context", "koken-kimlik-ayrimi"),
  ],
  "Künye zaten sağlamdı; kanıt-alıntı bağı kuruldu ve köken/kimlik ayrımı eklendi.");

kur("machu-picchu-kayip-sehir-unvani-yanlis", [S.bauerVilcabamba, S.bingham],
  [
    E("Bingham'ın aradığı yer Vilcabamba'ydı - İnkaların İspanyollara karşı son direniş merkezi.", "bingham-1948-lost-city", "Seferin amacı", "direct", "aradigi-vilcabamba"),
    E("Bingham gerçek Vilcabamba'yı (Espíritu Pampa) gördü ama önemsiz bularak geçti.", "bauer-2015-vilcabamba", "Araştırma tarihçesi", "direct", "espiritu-pampa-gecti"),
    E("Espíritu Pampa'daki kazılar sitenin İnka direniş merkezi olduğunu doğruladı.", "bauer-2015-vilcabamba", "Kazı sonuçları", "direct", "kazilar-dogruladi"),
    E("Unvan yanlış siteye verildi ve yapıştı: kitabın başlığı 'Lost City of the Incas' Machu Picchu'yu anlatıyor.", "bingham-1948-lost-city", "Kitap başlığı", "claim-origin", "unvan-yapisti"),
  ],
  [
    E("Vilcabamba İspanyol kayıtlarında belgelidir ve Espíritu Pampa'daki sonraki kazılar onu doğruladı.", "bauer-2015-vilcabamba", "Tarihsel kayıtlar", "counter", "ispanyol-kayitlari"),
    E("Machu Picchu İspanyol istilası sırasında zaten terk edilmişti; direniş merkezi değildi.", "bauer-2015-vilcabamba", "Kronoloji", "counter", "zaten-terk-edilmisti"),
    E("Machu Picchu bir şehir değil, Pachacuti için yapılmış kraliyet malikânesiydi.", "bauer-2015-vilcabamba", "Site tipolojisi", "counter", "kraliyet-malikanesi"),
  ],
  "YER TUTUCU DEĞİŞTİ: iki kaynak da başlıksız/künyesizdi. Kaydın hiç kanıtı yoktu - yalnız karşı kanıt vardı; dördü yazıldı.");

kur("machu-picchu-gorunmeyen-insaat", [S.wright2000, S.masini2023],
  [
    E("Sitede yüzlerce drenaj kanalı ve yüzey suyu tahliye noktası bulunuyor.", "wright-2000-machu-picchu-muhendislik", "Drenaj sistemi bölümü", "direct", "drenaj-kanallari"),
    E("Terasların altında kaba taş, çakıl ve kum katmanlarından oluşan drenaj yatakları var.", "wright-2000-machu-picchu-muhendislik", "Teras kesitleri", "direct", "teras-yataklari"),
    E("Yüzey altı görüntüleme, sitenin yapım evrelerini ve zemin hazırlığını yüzeye dokunmadan gösteriyor.", "masini-2023-machu-picchu-yeralti", "Jeofizik görüntüleme sonuçları", "direct", "yuzey-alti-goruntuleme"),
    E("Yapı beş yüz yıldır dik ve yağışlı bir yamaçta ayakta.", "wright-2000-machu-picchu-muhendislik", "Değerlendirme", "inference", "bes-yuz-yil-ayakta"),
  ],
  [
    E("Yer altı emeğinin oranı için verilen ~%60 değeri bir mühendislik TAHMİNİDİR, sayım değil.", "wright-2000-machu-picchu-muhendislik", "Tahmin yöntemi", "counter", "yuzde-60-tahmin"),
    E("Oranın kesinliği tartışmalı; yönü (görünmeyenin görünenden büyük olduğu) daha sağlam.", "wright-2000-machu-picchu-muhendislik", "Sonuçların güvenilirliği", "counter", "oran-mi-yon-mu"),
    E("'Ayakta kalması iyi mühendisliği kanıtlar' HAYATTA KALMA YANLILIĞIDIR: yıkılan İnka yapıları ziyaret edilmiyor. Bu kayıt sağlamlık iddiasını drenaj kanıtına dayandırıyor, ayakta kalmaya değil.", "masini-2023-machu-picchu-yeralti", "Yöntem düzeyi ayrımı", "context", "hayatta-kalma-yanliligi"),
  ],
  "YER TUTUCU DEĞİŞTİ. Masini 2023 eklendi: kayıt tek bir mühendislik incelemesine dayanıyordu, şimdi jeofizik ölçüm hattı da var.");

kur("machu-picchu-harcsiz-duvar-sismik", [S.protzen, S.lipa2023],
  [
    E("Taşlar demir aletlerle değil, daha sert taş çekiçlerle ve aşındırmayla şekillendirildi; yöntem deneysel olarak yeniden üretildi.", "protzen-1993-inka-tas-isciligi", "Deneysel arkeoloji bölümü", "direct", "tas-cekic-deneyi"),
    E("Duvarlar hafifçe içe eğimli; kapı ve pencereler yamuk - ikisi de yatay sarsıntıda devrilme eğilimini azaltır.", "protzen-1993-inka-tas-isciligi", "Duvar geometrisi", "direct", "ice-egimli-yamuk"),
    E("Harçsız örgüde kırılma yerine yer değiştirme oluyor; bloklar birbirine göre hareket edip enerjiyi sürtünmeyle harcıyor.", "lipa-2023-inka-duvar-sismik", "Rijit cisim dinamiği modellemesi", "direct", "yer-degistirme"),
    E("Deprem kuşağında yüzyıllarca inşa eden bir toplum, ayakta kalan çözümleri tutup yıkılanları bırakıyor - yineleyerek optimuma yaklaşma.", "protzen-1993-inka-tas-isciligi", "Değerlendirme", "inference", "yineleyerek-optimum"),
  ],
  [
    E("Sismik davranışın niceliksel ölçümü sınırlı; modelleme gerçek bir deprem kaydı değil, rijit cisim varsayımına dayanan bir simülasyondur.", "lipa-2023-inka-duvar-sismik", "Model varsayımları", "counter", "model-varsayimi"),
    E("'Yineleyerek optimuma yaklaşma' bir ÇIKARIMDIR; İnka inşaatçılarının bu süreci böyle yürüttüğüne dair doğrudan kayıt yok.", "protzen-1993-inka-tas-isciligi", "Yorum düzeyi", "context", "optimum-cikarim"),
    E("Ollantaytambo'da ölçülen taş işçiliği Machu Picchu'ya doğrudan aktarılamaz; iki sitede işçilik kalitesi ve taş türü farklı.", "protzen-1993-inka-tas-isciligi", "Kapsam", "counter", "site-farki"),
  ],
  "YER TUTUCU DEĞİŞTİ. Protzen'in deneysel yeniden üretimi 'bilinmeyen teknoloji' iddiasına doğrudan cevap; Lipa 2023 sismik modellemeyi getiriyor.");

/* --- uygula -------------------------------------------------------- */

for (const r of yeni) {
  const i = list.findIndex((x) => x.id === r.id);
  const onceki = list[i].schema_version ?? 1;
  list[i] = r;
  console.log(`  v${onceki} -> v2  ${r.id}`);
}
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
const v2 = list.filter((r) => r.schema_version === 2).length;
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${v2}, kalan v1: ${list.length - v2}`);
