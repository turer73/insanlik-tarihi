#!/usr/bin/env node
// Laurasia kümesi: ölü kaynağı düzelt, künyeleri tamamla, v2'ye taşı.
//
// NEDEN: 2026-09-09 bağlantı denetiminde bu kümedeki kaynaklardan biri ÖLÜ
// çıktı - http://www.jfr.indiana.edu/review.php?id=1613 alan adı DNS'te yok
// (www ve apex, ikisi de NXDOMAIN; indiana.edu çalışıyor). Kayıt iki yerde
// kullanılıyordu ve her ikisinde de eleştirinin TEK dayanağıydı.
//
// Ölü bağlantı en küçük sorundu. Aynı kaynakta:
//   - tier "peer-reviewed" yazıyordu ama YAZAR ve YIL alanları boştu,
//   - accessed "2026-09-07" yazıyordu, yani erişilmiş gibi kayıtlıydı -
//     oysa alan adı çözülmüyor. O tarih doğrulanmadan yazılmış.
// İki kayıt da v1 olduğu için doğrulayıcı peer-reviewed künye kuralını
// uygulamıyordu. v2'ye taşımak, bu boşluğu kalıcı olarak kapatıyor.
//
// DOĞRULANAN KÜNYELER (2026-09-09, hepsi canlı kontrol edildi):
//   Thompson, Tok (University of Southern California). "Review of E. J.
//   Michael Witzel, The Origins of the World's Mythologies." Journal of
//   Folklore Research Reviews, 5 Aralık 2013. Indiana University /
//   IUScholarWorks Journals. 1535 kelime.
//   -> scholarworks.iu.edu/journals/index.php/jfrr/article/view/38998 (200)
//
//   Witzel, E. J. Michael. The Origins of the World's Mythologies. Oxford
//   University Press, 2012. xx + 665 s. ISBN 9780199812851.
//
//   Stanner, W. E. H. White Man Got No Dreaming: Essays 1938-1973.
//   Australian National University Press, 1979. 389 s. ISBN 9780708118023.
//   "The Dreaming" denemesi bu derlemede yeniden basılmıştır.
//
// TIER DÜŞÜRÜLDÜ - sessiz değil, gerekçeli: Thompson'ın metni bir KİTAP
// DEĞERLENDİRMESİDİR. README'nin kendi tanımına göre peer-reviewed
// "hakemli makale, kitap veya bölüm" demektir; değerlendirme yazıları
// hakem sürecinden geçmez, editör ısmarlar. institutional tanımı ise
// "üniversite ... kaynağı" - Indiana University'nin yayın kolu tam olarak
// budur. Yani düşürme, kaynağı zayıflatmak için değil, olduğu şey olarak
// işaretlemek için.
//
// SINIR: üç künye de doğrulandı, TAM METİNLER OKUNMADI. Thompson'ın
// değerlendirmesinden bilinen şey künye ve tezin yönü; itirazların
// ayrıntısı kaydın önceki sürümünden devralındı ve doğrulanmadı.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/mitoloji.json";
const CHECKED = "2026-09-09";

/* --- kaynaklar ----------------------------------------------------- */

const witzel = source("witzel-2012-origins-mythologies", {
  tier: "peer-reviewed",
  type: "book",
  authors: ["Witzel, E. J. Michael"],
  year: 2012,
  title: "The Origins of the World's Mythologies",
  publisher: "Oxford University Press",
  isbn: "9780199812851",
  pages: "xx+665",
  language: "en",
  note: "Tezin kendisi. Bu kayıtta iddianın KAYNAĞI olarak kullanılır, doğrulayıcısı olarak değil.",
});

const thompson = source("thompson-2013-witzel-degerlendirmesi", {
  tier: "institutional",
  type: "article",
  authors: ["Thompson, Tok"],
  year: 2013,
  title: "Review of E. J. Michael Witzel, The Origins of the World's Mythologies",
  container: "Journal of Folklore Research Reviews",
  institution: "Indiana University - IUScholarWorks Journals",
  url: "https://scholarworks.iu.edu/journals/index.php/jfrr/article/view/38998",
  language: "en",
  accessed: CHECKED,
  note:
    "Alan içi eleştirel değerlendirme; yazar University of Southern California'da folklorcu. 5 Aralık 2013, 1535 kelime. " +
    "ÖNCEKİ SÜRÜMÜN HATASI: bu kaynak yazarsız ve yılsız biçimde, ölü bir adresle (jfr.indiana.edu - DNS'te yok) " +
    "ve 'peer-reviewed' etiketiyle duruyordu; accessed alanı da erişilmemiş bir adres için doldurulmuştu. " +
    "Künye tamamlandı, adres yaşayan sürümle değiştirildi, tier kitap değerlendirmesi olduğu için institutional yapıldı.",
});

const stanner = source("stanner-1979-white-man-got-no-dreaming", {
  tier: "peer-reviewed",
  type: "book",
  authors: ["Stanner, W. E. H."],
  year: 1979,
  title: "White Man Got No Dreaming: Essays 1938-1973",
  publisher: "Australian National University Press",
  isbn: "9780708118023",
  pages: "389",
  language: "en",
  note:
    "'The Dreaming' denemesi bu akademik derlemede yeniden basılmıştır. TARİH ÇELİŞKİSİ KAYDA GEÇİRİLİYOR: " +
    "deneme yaygın olarak 1953 tarihiyle anılır ama ilk basımı T. A. G. Hungerford'un derlediği Australian Signpost " +
    "antolojisidir (1956). Önceki sürüm kaynağı 'Stanner 1953, article' diye gösteriyordu - ne kapsayıcı ne yayıncı " +
    "vardı. Burada üniversite yayınevinden çıkan derleme künyelendi; 1953/1956 farkı çözülmüş değil.",
});

/* --- 1) Laurasia hipotezi ------------------------------------------- */

const laurasia = finding({
  id: "laurasia-hipotezi",
  claim:
    "Dünya mitolojileri, biri yaratılıştan yıkıma uzanan tutarlı bir hikâye çizgisi taşıyan iki büyük aileye ayrılır ve birincisinin kökeni yaklaşık 40.000 yıl öncesine dayanır.",
  status: "minority",
  confidence: "medium",
  topic: ["mitoloji", "karsilastirmali-mitoloji", "yontem"],
  subject: {
    site: "Dünya mitolojileri",
    region: "küresel",
    modern_country: "çok uluslu",
  },
  period: {
    earliest: -40000,
    latest: 2012,
    era_label: "İddia edilen köken tarihinden tezin yayımına",
    precision: "disputed",
    dating_method: ["none"],
  },
  disciplines: ["antropoloji", "dilbilim", "filoloji"],
  people: [
    { name: "Witzel, E. J. Michael", role: "proposer", affiliation: "Harvard University", year: 2012 },
    { name: "Thompson, Tok", role: "critic", affiliation: "University of Southern California", year: 2013 },
  ],
  popular_claim:
    "Bütün mitolojilerin tek bir soyağacı çıkarıldı ve kökeni 40.000 yıl öncesine dayanıyor.",
  divergence:
    "Tez ciddiye alınmayı hak ediyor ama uzlaşı DEĞİL, azınlık görüşü. Dört ana itiraz var ve dördüncüsü alanın en hassas noktasına dokunuyor: ayrım, birinci grubu 'yüksek kültür' ikinciyi 'düşük kültür' konumuna yerleştiren bir hiyerarşi kuruyor - karşılaştırmalı mitolojinin 19. yüzyıldan miras aldığı bir sorun. Ayrıca şu ayrım korunmalı: TEK TEK MOTİFLERİN derin ortak kökeni test edilebilir bir hipotezdir; BÜTÜN MİTOLOJİLERİN tek soyağacına oturtulması şimdilik bir çerçeve önerisidir.",
  divergence_type: ["medya-abartisi", "ideolojik-secim"],
  sources: [witzel, thompson],
  evidence: [
    ev(
      "Tez, Avrasya ve Amerika mitolojilerinin yaratılıştan yıkıma uzanan tutarlı bir hikâye çizgisi paylaştığını, Sahra altı Afrika, Avustralya ve Yeni Gine geleneklerinin ise böyle bir çizgi taşımadığını savunur.",
      cite("witzel-2012-origins-mythologies", "Tezin ana savı", "claim-origin"),
      { id: "iki-aile-savi" },
    ),
  ],
  counter_evidence: [
    ev(
      "Sınıflandırma ölçütü tutarsız uygulanıyor: bir gelenek yazarın öyle demesiyle birinci gruba konuyor, aynı boşluklar öteki grupta farklı yorumlanıyor.",
      cite("thompson-2013-witzel-degerlendirmesi", "Ölçüt tutarlılığı itirazı", "counter"),
      { id: "olcut-tutarsiz" },
    ),
    ev(
      "İstisna sayısı şemayı zayıflatacak kadar çok: 'şu grupta bulunmaz' denen motifler öteki grupta bulunabiliyor.",
      cite("thompson-2013-witzel-degerlendirmesi", "İstisnalar", "counter"),
      { id: "istisna-fazlaligi" },
    ),
    ev(
      "Kullanılan derlemelerin önemli bölümü güncelliğini yitirmiş kaynaklardır.",
      cite("thompson-2013-witzel-degerlendirmesi", "Kaynak tabanı eleştirisi", "counter"),
      { id: "eskimis-derlemeler" },
    ),
    ev(
      "Ayrım, gruplar arasında bir kültürel hiyerarşi kuruyor ve bu, ırksal önyargı kaygısı doğuruyor.",
      cite("thompson-2013-witzel-degerlendirmesi", "Hiyerarşi itirazı", "counter"),
      { id: "hiyerarsi-kaygisi" },
    ),
    ev(
      "Destekleyici olarak sunulan diğer alanlardan gelen kanıtların önemli bölümü tartışmalı veya belirsiz; teze ters düşen yorumlar da mevcut - doğrulama yanlılığı işareti.",
      cite("thompson-2013-witzel-degerlendirmesi", "Yan alan kanıtlarının değerlendirmesi", "counter"),
      { id: "dogrulama-yanliligi" },
    ),
    ev(
      "Bu kayıttaki itirazların ayrıntısı değerlendirmenin TAM METNİNDEN değil, kaydın önceki sürümünden devralınmıştır. Künye ve yazar doğrulandı; itirazların metindeki tam ifadesi doğrulanmadı.",
      cite("thompson-2013-witzel-degerlendirmesi", "Kayıt düzeyi sınırı", "context"),
      { id: "tam-metin-okunmadi" },
    ),
  ],
  open_questions: [
    "İki aile ayrımı, ölçütler tutarlı uygulandığında ayakta kalır mı?",
    "Thompson'ın değerlendirmesinin tam metni okunduğunda itirazlar burada yazıldığı gibi mi duruyor?",
  ],
  checked: CHECKED,
  used_in: ["gokteki-ayi"],
  review: {
    status: "draft",
    notes:
      "Ölü kaynak canlı sürümüyle değiştirildi, yazar ve yıl eklendi, tier kitap değerlendirmesi olduğu için institutional'a düşürüldü. Tam metinler okunmadı.",
  },
});

/* --- 2) Yaratılış sorusu: alet yanlılığı ---------------------------- */

const alet = finding({
  id: "yaratilis-sorusu-alet-yanliligi",
  claim: "'Bu gelenekte yaratılıştan yıkıma uzanan bir hikâye var mı' sorusu tarafsız bir ölçüttür.",
  status: "refuted",
  confidence: "high",
  topic: ["mitoloji", "yontem", "karsilastirmali-mitoloji"],
  subject: {
    site: "Karşılaştırmalı mitoloji yöntemi",
    region: "kuramsal",
    modern_country: "çok uluslu",
  },
  period: {
    earliest: 1850,
    latest: 2026,
    era_label: "Karşılaştırmalı mitolojinin kuruluşundan bugüne",
    precision: "range",
    dating_method: ["historical-record"],
  },
  disciplines: ["antropoloji", "felsefe", "dilbilim"],
  people: [
    { name: "Stanner, W. E. H.", role: "proposer", affiliation: "Australian National University", year: 1953 },
  ],
  popular_claim:
    "Bazı geleneklerde tutarlı bir yaratılış anlatısı yoktur; bu, o geleneklerin daha basit olduğunu gösterir.",
  divergence:
    "Soru tarafsız değildir: içinde zamanın BAŞLANGICI VE SONU OLAN BİR ÇİZGİ olduğu varsayımı gizlidir. Zamanı böyle örgütlemeyen bir gelenek bu testten HER ZAMAN sıfır alır - hikâyesi olmadığı için değil, sorunun ona uymadığı için. Tanıdık biçimi şudur: yıl saymayan bir geleneğe 'bu olay hangi yılda oldu' diye sorup 'tarih bilgisi yok' sonucuna varmak. Herkes ikincisinin hatalı olduğunu görür; birincisi aynı hatadır ama daha az görünürdür, çünkü 'yaratılış hikâyesi' kategorisi doğal geliyor. Doğal değil - bizim zaman anlayışımızın kalıbı.",
  divergence_type: ["kategori-hatasi", "somurge-anlatisi"],
  sources: [stanner, thompson],
  evidence: [
    ev(
      "Avustralya gelenekleri düz bir zaman çizgisi kullanmaz (bkz. everywhen-dogrusal-olmayan-zaman); bu testten otomatik olarak sıfır alırlar.",
      cite("stanner-1979-white-man-got-no-dreaming", "'The Dreaming' denemesi", "direct"),
      { id: "avustralya-zaman-cizgisi-yok" },
    ),
    ev(
      "Hint geleneğinin ana damarında ölümün ve dünyanın bir 'kökeni' yoktur çünkü zaman döngüseldir - aynı yapısal sorun.",
      cite("stanner-1979-white-man-got-no-dreaming", "Zaman kavrayışı tartışması - benzeşim", "inference"),
      { id: "hint-dongusel-zaman" },
    ),
    ev(
      "Testin 'eksik' saydığı Afrika bölgesi, elimizdeki en izlenebilir mitolojik tarihlerden birini taşıyor (bkz. yanlis-teslim-olum-motifi).",
      cite("thompson-2013-witzel-degerlendirmesi", "Sınıflandırmanın Afrika'yı konumlandırması", "counter"),
      { id: "afrika-karsi-ornek" },
    ),
  ],
  counter_evidence: [
    ev(
      "Bu kayıt 'iki aile' ayrımının tamamen yanlış olduğunu söylemez; ayrım gerçek bir yapısal farkı da yakalıyor olabilir. Söylenen şu: farkın ne kadarının nesnede, ne kadarının soruda olduğu ayrılmadı.",
      cite("thompson-2013-witzel-degerlendirmesi", "Ayrımın kısmi geçerliliği", "context"),
      { id: "ayrim-tamamen-yanlis-degil" },
    ),
    ev(
      "Hint geleneğine ilişkin satır Stanner'dan DOĞRUDAN gelmez; Avustralya için kurduğu zaman argümanının başka bir geleneğe uzatılmasıdır. Uzatma bu kayıtta yapılmıştır, kaynakta değil.",
      cite("stanner-1979-white-man-got-no-dreaming", "Kayıt düzeyi sınırı", "context"),
      { id: "hint-cikarim-uzatmasi" },
    ),
    ev(
      "Stanner'ın denemesinin tarihi çözülmüş değil: yaygın olarak 1953 anılır, ilk basımı 1956 antolojisidir. Bu kayıt 1979 akademik derlemesini künyeliyor.",
      cite("stanner-1979-white-man-got-no-dreaming", "Künye düzeyi", "context"),
      { id: "stanner-tarih-celiskisi" },
    ),
  ],
  open_questions: [
    "Zaman anlayışından bağımsız bir 'anlatı derinliği' ölçütü kurulabilir mi?",
    "'The Dreaming' 1953 mü 1956 mı? Birincil basım görülmeli.",
  ],
  checked: CHECKED,
  used_in: ["gec-kalan-haberci"],
  review: {
    status: "draft",
    notes:
      "Stanner künyesi kapsayıcı ve ISBN ile tamamlandı, 1953/1956 çelişkisi kayda geçirildi. Hint geleneğine ilişkin satırın çıkarım olduğu açıkça işaretlendi. Tam metinler okunmadı.",
  },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
for (const r of [laurasia, alet]) {
  const i = list.findIndex((x) => x.id === r.id);
  if (i === -1) { console.error("bulunamadı:", r.id); process.exit(1); }
  const onceki = list[i].schema_version ?? 1;
  list[i] = r;
  console.log(`  v${onceki} -> v2  ${r.id}`);
}
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${list.filter((r) => r.schema_version === 2).length}`);
