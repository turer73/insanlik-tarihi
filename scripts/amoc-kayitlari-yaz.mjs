#!/usr/bin/env node
// data/findings/amoc.json — Atlantik devrilme sirkulasyonu.
//
// UC MAKALENIN TAM METNI OKUNDU (ozet degil):
//   Xing ve ark. 2026, Science Advances 12(15)   — PMC13060603
//   Worthington ve ark. 2021, Ocean Science 17   — acik erisim tam metin
//   Baker ve ark. 2025, Nature 638 + duzeltmesi  — PMC11864975 / PMC12058520
//
// TAM METIN, BASIN OZETINI IKI YERDE CURUTTU:
//
// 1) Basinda dolasan "on yilda 2,6 Sv" ve "20 Sv'den 15 Sv'ye" rakamlari
//    TAM AMOC'a ait degil. Xing ve ark. 26,5°N'de tam AMOC icin
//    0,09 ± 0,08 Sv/yil veriyor; bati sinirinin kendi katkisi icin
//    0,21 ± 0,08. Dogu siniri TERS yonde gucleniyor (-0,16 ± 0,06) ve
//    farki kapatiyor. Makale bunu kendi cumlesiyle soyluyor: bati sinir
//    olcusu "AMOC egiliminin isaretini yakaliyor ama buyuklugunu ASIYOR".
//    Yani manset, makalenin kendi uyarisini atlamis.
//
// 2) Baker ve ark. "cokmez" diyor ama AYNI modellerde AMOC %20-81
//    (ortalama %54) zayifliyor. "Cokus" tanimi 6 Sv altina inmek.
//    Bu tanim ilk basimda metinde YOKTU; Mayis 2025 yazar duzeltmesiyle
//    parantez icinde eklendi. Yani sonucun dayandigi esik sonradan
//    acikca yazilmis.
//
// PALEO TARAFI: olay gecmiste oldu ama "durma" degil "zayiflama" olarak.
// Bradtmiller ve ark. 2014 (231Pa/230Th) Heinrich Stadial 1 icin
// "zayiflamis ama SUREN" bir sirkulasyon buluyor.
//
// BUZUL CAGI BAGLANTISI: buzul caglarinin ritmini yorunge zorlamasi
// suruyor (dosyada zaten uc Milankovic kaydi var). AMOC olaylari buzul
// DURUMUNUN ICINDE, on yillar-yuzyillar olceginde yasaniyor. "AMOC
// cokerse buzul cagi gelir" cumlesi iki ayri zaman olcegini ve iki ayri
// mekanizmayi birbirine karistiriyor.
//
// KUNYE DOGRULAMASI: 15 tanimlayici crossref ile sinandi. Bu turda
// YAYIN TURU de kontrol edildi - onceki turda iki kayit %100 baslik
// eslesmesiyle gecmisti ama biri ONBASKI, digeri makale hakkindaki bir
// DEGERLENDIRME idi.
//
// SINIR: paleo makalelerinin tam metni OKUNMADI, ozet duzeyinde kaldi.
// Locator'lar buna gore yazildi.

import { writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/amoc.json";
const CHECKED = "2026-09-12";
const mak = (id, o) => source(id, { language: "en", accessed: CHECKED, ...o });

const S = {
  ipcc: mak("ipcc-ar6-wg1-bolum9", {
    tier: "institutional", type: "report", year: 2021,
    title: "Climate Change 2021: The Physical Science Basis — Bölüm 9: Ocean, Cryosphere and Sea Level Change",
    institution: "IPCC (Hükümetlerarası İklim Değişikliği Paneli)",
    publisher: "Cambridge University Press",
    url: "https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-9/",
    note: "Değerlendirilmiş uzlaşı konumu. Alıntılar bölüm metninden alındı, basın özetinden değil.",
  }),
  xing: mak("xing-2026-bati-siniri-dususu", {
    tier: "peer-reviewed", type: "article",
    authors: ["Xing, Qianjiang", "Elipot, Shane", "Johns, William E.", "Smeed, David A.", "Moat, Ben I.", "Loder, John W."],
    year: 2026,
    title: "Meridionally consistent decline in the observed western boundary contribution to the Atlantic Meridional Overturning Circulation",
    container: "Science Advances", volume: "12(15)", doi: "10.1126/sciadv.adz7738",
    note:
      "Dört demirli dizi, 16,5°N-42,5°N. TAM METİN OKUNDU. Makale, bu ölçünün AMOC eğilimini " +
      "ABARTTIĞINI kendisi söylüyor ve insan kaynaklı zorlamaya atıf yapmaktan açıkça kaçınıyor.",
  }),
  worthington: mak("worthington-2021-dusus-yok", {
    tier: "peer-reviewed", type: "article",
    authors: ["Worthington, Emma L.", "Moat, Ben I.", "Smeed, David A.", "Mecking, Jennifer V.", "Marsh, Robert", "McCarthy, Gerard D."],
    year: 2021,
    title: "A 30-year reconstruction of the Atlantic meridional overturning circulation shows no decline",
    container: "Ocean Science", volume: "17(1):285-299", doi: "10.5194/os-17-285-2021",
    url: "https://os.copernicus.org/articles/17/285/2021/",
    note: "TAM METİN OKUNDU. 1981-2016 rekonstrüksiyonu. Başlığı doğrudan 'düşüş göstermiyor' diyor.",
  }),
  baker: mak("baker-2025-cokmez", {
    tier: "peer-reviewed", type: "article",
    authors: ["Baker, Jonathan A.", "Bell, Michael J.", "Jackson, Laura C.", "Vallis, Geoffrey K.", "Watson, Andrew J.", "Wood, Richard A."],
    year: 2025,
    title: "Continued Atlantic overturning circulation even under climate extremes",
    container: "Nature", volume: "638(8052):987-994", doi: "10.1038/s41586-024-08544-0",
    note: "TAM METİN OKUNDU. 34 model. 'Çökmez' sonucu, çöküşün 6 Sv altı olarak tanımlanmasına dayanıyor.",
  }),
  bakerDuzeltme: mak("baker-2025-yazar-duzeltmesi", {
    tier: "peer-reviewed", type: "article",
    authors: ["Baker, Jonathan A.", "Bell, Michael J.", "Jackson, Laura C.", "Vallis, Geoffrey K.", "Watson, Andrew J.", "Wood, Richard A."],
    year: 2025,
    title: "Author Correction: Continued Atlantic overturning circulation even under climate extremes",
    container: "Nature", volume: "641(8062):E2", doi: "10.1038/s41586-025-08977-1",
    note:
      "Mayıs 2025. '6 Sv altı' çöküş tanımını metne EKLEYEN düzeltme; ayrıca 'PMOC oluşmuyor' ifadesi " +
      "'oluşmuyor ya da genel olarak zayıf kalıyor' olarak yumuşatıldı.",
  }),
  ditlevsen: mak("ditlevsen-2023-erken-uyari", {
    tier: "peer-reviewed", type: "article",
    authors: ["Ditlevsen, Peter", "Ditlevsen, Susanne"], year: 2023,
    title: "Warning of a forthcoming collapse of the Atlantic meridional overturning circulation",
    container: "Nature Communications", volume: "14(1)", doi: "10.1038/s41467-023-39810-w",
    note:
      "2025-2095 aralığının kaynağı. KÜNYE UYARISI: crossref başlık araması bu makalenin " +
      "Research Square ÖNBASKISINI döndürüyor (10.21203/rs.3.rs-2034845/v1, 2022); yayımlanmış sürüm budur.",
  }),
  vanWesten: mak("vanwesten-2024-devrilme-yolunda", {
    tier: "peer-reviewed", type: "article",
    authors: ["van Westen, René M.", "Kliphuis, Michael", "Dijkstra, Henk A."], year: 2024,
    title: "Physics-based early warning signal shows that AMOC is on tipping course",
    container: "Science Advances", volume: "10(6)", doi: "10.1126/sciadv.adk1189",
  }),
  caesar2018: mak("caesar-2018-parmak-izi", {
    tier: "peer-reviewed", type: "article",
    authors: ["Caesar, Levke", "Rahmstorf, Stefan", "Robinson, Alexander", "Feulner, Georg"], year: 2018,
    title: "Observed fingerprint of a weakening Atlantic Ocean overturning circulation",
    container: "Nature", volume: "556(7700):191-196", doi: "10.1038/s41586-018-0006-5",
    note:
      "Deniz yüzeyi sıcaklığı parmak izi yöntemi. KÜNYE UYARISI: crossref başlık araması makalenin " +
      "kendisini değil hakkındaki bir değerlendirmeyi döndürüyor; doğru kayıt budur.",
  }),
  rahmstorf2026: mak("rahmstorf-caesar-2026-gorus", {
    tier: "peer-reviewed", type: "article",
    authors: ["Rahmstorf, Stefan", "Caesar, Levke"], year: 2026,
    title: "Opinion: The AMOC is weakening — time to take the evidence seriously",
    container: "EGUsphere (önbaskı)", doi: "10.5194/egusphere-2026-2110",
    note:
      "ÖNBASKI, hakem süreci tamamlanmadı. Açık hakem değerlendirmesinde seçici literatür kullanımı ve " +
      "kanıt hatlarının bağımsızlığı eleştirildi. Kayıtta iddianın kökeni olarak kullanılıyor.",
  }),
  ucl: mak("ucl-2024-gulf-stream-ruzgar", {
    tier: "institutional", type: "press-release", year: 2024,
    title: "The Gulf Stream is wind-powered and could weaken from climate change",
    institution: "University College London",
    url: "https://www.ucl.ac.uk/news/2024/jul/gulf-stream-wind-powered-and-could-weaken-climate-change",
  }),
  bradtmiller: mak("bradtmiller-2014-path-heinrich", {
    tier: "peer-reviewed", type: "article",
    authors: ["Bradtmiller, Louisa I.", "McManus, Jerry F.", "Robinson, Laura F."], year: 2014,
    title: "231Pa/230Th evidence for a weakened but persistent Atlantic meridional overturning circulation during Heinrich Stadial 1",
    container: "Nature Communications", volume: "5(1)", doi: "10.1038/ncomms6817",
    note: "Başlığın kendisi kaydın sonucudur: zayıflamış AMA SÜREN. Tam metin okunmadı, özet düzeyinde.",
  }),
  condron: mak("condron-winsor-2012-eriyik-su-yolu", {
    tier: "peer-reviewed", type: "article",
    authors: ["Condron, Alan", "Winsor, Peter"], year: 2012,
    title: "Meltwater routing and the Younger Dryas",
    container: "Proceedings of the National Academy of Sciences", volume: "109(49):19928-19933",
    doi: "10.1073/pnas.1207381109",
    note: "Klasik St. Lawrence güzergâhının AMOC'u %15'ten az zayıflattığını, Mackenzie güzergâhının %30'dan fazla zayıflattığını gösteriyor. Tam metin okunmadı.",
  }),
  you2026: mak("you-2026-genc-dryas-tatlanma", {
    tier: "peer-reviewed", type: "article",
    authors: ["You, Di", "Stein, Ruediger", "Lohmann, Gerrit", "Masoum, Ahmadreza"], year: 2026,
    title: "Surface freshening in the subpolar North Atlantic sustaining the weakened AMOC during the late Younger Dryas",
    container: "Science Advances", volume: "12(1)", doi: "10.1126/sciadv.adv6220",
    note: "Başlıkta yine 'zayıflamış' var, 'durmuş' değil. Tam metin okunmadı.",
  }),
  fohlmeister: mak("fohlmeister-2023-do-donguleri", {
    tier: "peer-reviewed", type: "article",
    authors: ["Fohlmeister, Jens", "Sekhon, Natasha", "Columbu, Andrea", "Vettoretti, Guido"], year: 2023,
    title: "Global reorganization of atmospheric circulation during Dansgaard-Oeschger cycles",
    container: "Proceedings of the National Academy of Sciences", volume: "120(36)",
    doi: "10.1073/pnas.2302283120",
    note: "D-O döngülerinin küresel ayak izi. Tam metin okunmadı.",
  }),
  he2021: mak("he-2021-heinrich-gronland", {
    tier: "peer-reviewed", type: "article",
    authors: ["He, Chengfei", "Liu, Zhengyu", "Otto-Bliesner, Bette L.", "Brady, Esther C."], year: 2021,
    title: "Abrupt Heinrich Stadial 1 cooling missing in Greenland oxygen isotopes",
    container: "Science Advances", volume: "7(25)", doi: "10.1126/sciadv.abh1007",
    note: "Buz çekirdeği vekil göstergesinin olayın kendisini değil, olayın Grönland'daki izini ölçtüğünü gösteriyor.",
  }),
};

const E = (t, ref, loc, st = "direct", id) => ev(t, cite(ref, loc, st), id ? { id } : undefined);
const kayitlar = [];
const kur = (o) => kayitlar.push(finding({ ...o, checked: CHECKED }));

/* ------------------------------------------------------------------ */

kur({
  id: "amoc-gulf-stream-kategori-hatasi",
  claim: "Gulf Stream ile AMOC aynı şey değildir; rüzgârla sürülen Gulf Stream durmaz, tartışılan AMOC'un yoğunlukla sürülen devrilme bileşenidir.",
  status: "refuted", confidence: "high",
  topic: ["amoc", "okyanus-sirkulasyonu", "kategori-ayrimi"],
  disciplines: ["iklim-bilimi"],
  popular_claim: "Gulf Stream duruyor; Avrupa'yı ısıtan akıntı kesiliyor.",
  divergence:
    "İki ayrı olgu tek adla anılıyor. Gulf Stream RÜZGÂRLA sürülür ve rüzgâr estiği sürece durmaz. " +
    "AMOC ise sıcaklık ve tuzluluk farkının sürüklediği DEVRİLME bileşenidir; zayıflayabilen ve tartışılan budur. " +
    "İkisi Kuzey Amerika kıyısında yan yana aktığı için karışıyor. 'Gulf Stream duruyor' cümlesi fiziksel olarak yanlış.",
  divergence_type: ["kategori-hatasi", "medya-abartisi"],
  sources: [S.ucl, S.ipcc],
  evidence: [
    E("Gulf Stream rüzgârla sürülür; rüzgâr sistemi yerinde durdukça akıntı durmaz.", "ucl-2024-gulf-stream-ruzgar", "Duyuru metni", "direct", "ruzgarla-surulur"),
    E("IPCC değerlendirmesi AMOC'u ayrı bir sistem olarak ele alır ve zayıflama öngörüsünü ona bağlar, Gulf Stream'e değil.", "ipcc-ar6-wg1-bolum9", "9. bölüm, AMOC değerlendirmesi", "direct", "ipcc-amoc-ayri"),
  ],
  counter_evidence: [
    E("Gulf Stream AMOC sisteminin bir parçasıdır; tümüyle bağımsız değillerdir. Bu kayıt ikisinin ilişkisiz olduğunu değil, AYNI ŞEY OLMADIĞINI söylüyor.", "ucl-2024-gulf-stream-ruzgar", "Kayıt düzeyi ayrımı", "context", "tumuyle-bagimsiz-degil"),
    E("Gulf Stream'in kendisi de iklim değişikliğiyle zayıflayabilir; durmaması zayıflamayacağı anlamına gelmiyor.", "ucl-2024-gulf-stream-ruzgar", "Duyuru metni", "counter", "zayiflayabilir"),
  ],
  open_questions: ["Rüzgârla sürülen ve yoğunlukla sürülen bileşenlerin gözlemde ayrıştırılması ne kadar güvenilir?"],
  review: { status: "draft", notes: "Kurumsal duyuru ve IPCC bölümüne dayanıyor; özgün hakemli makale bağlanmadı." },
});

kur({
  id: "amoc-olcum-suresi-iddiadan-kisa",
  claim: "Kesintisiz AMOC ölçümü 2004'te başladı; insan kaynaklı eğilimi doğal salınımdan ayırmak için gereken süreye henüz ulaşılmadı.",
  status: "unmeasurable", confidence: "high",
  topic: ["amoc", "olcum-suresi", "yontem"],
  disciplines: ["iklim-bilimi"],
  popular_claim: "AMOC'un zayıfladığı ölçüldü.",
  divergence:
    "Ölçüldüğü doğru; ne kadarının insan kaynaklı olduğu ölçülmedi. Kesintisiz doğrudan ölçüm 22 yıllık. " +
    "Ayırt edilmesi gereken Atlantik çok on yıllık salınımı ise ~70 yıllık. Worthington ve arkadaşları " +
    "gereken seri uzunluğunu AÇIKÇA veriyor: en az 60 yıl. Bu kayıt, dosyanın omurgasıdır - hem 'çöküyor' " +
    "hem 'bir şey yok' diyenler aynı kısa seriye bakıyor.",
  divergence_type: ["kategori-hatasi", "medya-abartisi"],
  sources: [S.worthington, S.xing, S.ipcc],
  evidence: [
    E("Antropojenik AMOC değişimini saptamak için en az 60 yıllık bir seri gerekir.", "worthington-2021-dusus-yok", "Tartışma, saptanabilirlik", "direct", "60-yil-gerekli"),
    E("Gözlem serileri, simülasyon ve rekonstrüksiyonlara kıyasla kısadır; on yıllık salınım ile iklim değişikliği kaynaklı düşüşü ayırt etmeyi zorlaştırır.", "xing-2026-bati-siniri-dususu", "Giriş ve tartışma", "direct", "seriler-kisa"),
    E("IPCC 20. yüzyıl için güveni DÜŞÜK buluyor, çünkü rekonstrüksiyonlar ve modeller sayısal eğilimde birbirini tutmuyor.", "ipcc-ar6-wg1-bolum9", "9. bölüm, 20. yüzyıl değerlendirmesi", "direct", "ipcc-dusuk-guven"),
  ],
  counter_evidence: [
    E("Kısa seri, 'hiçbir şey bilinmiyor' demek değildir: 2000'lerden bu yana dört enlemde tutarlı bir düşüş ölçülmüştür. Kayıt ölçümü değil, ATIF iddiasını sınırlıyor.", "xing-2026-bati-siniri-dususu", "Sonuçlar", "counter", "olcum-var-atif-yok"),
    E("Vekil göstergeler doğrudan ölçümden geriye uzanır; bu kayıt onları yok saymaz, aralarındaki uyuşmazlığı gösterir.", "worthington-2021-dusus-yok", "Vekil karşılaştırması", "context", "vekiller-var"),
  ],
  open_questions: ["Doğu ve batı sınırlarındaki ters yönlü eğilimler tüm Kuzey Atlantik boyunca tutarlı mı?"],
  volatile: true,
  review: { status: "draft", notes: "Worthington ve Xing tam metinden okundu; IPCC bölüm metninden alıntılandı." },
});

kur({
  id: "amoc-basindaki-rakam-tam-amoc-degil",
  claim: "Basında dolaşan 'on yılda 2,6 Sv' düşüşü tam AMOC'a değil, onun batı sınırı bileşenine aittir; makale bu ölçünün eğilimi abarttığını kendisi söyler.",
  status: "established", confidence: "high",
  topic: ["amoc", "olcum", "medya-aktarimi"],
  disciplines: ["iklim-bilimi"],
  popular_claim: "AMOC 2004'ten beri 20 Sv'den 15 Sv'ye düştü; on yılda 2,6 Sv kaybediyor.",
  divergence:
    "Rakam yanlış değil, YANLIŞ ŞEYE ait. Xing ve arkadaşları 26,5°N'de TAM AMOC için 0,09 ± 0,08 Sv/yıl " +
    "veriyor - yani on yılda ~0,9 Sv ve belirsizlik neredeyse eğilim kadar. Batı sınırının kendi katkısı " +
    "0,21 ± 0,08 Sv/yıl. Aradaki farkı doğu sınırı kapatıyor: orası TERS yönde gücleniyor (-0,16 ± 0,06). " +
    "Makale bunu açıkça yazıyor: batı sınırı ölçüsü AMOC eğiliminin işaretini yakalar ama büyüklüğünü AŞAR. " +
    "Manşet, makalenin kendi uyarısını atlamış.",
  divergence_type: ["medya-abartisi", "kategori-hatasi"],
  sources: [S.xing],
  evidence: [
    E("26,5°N'de tam AMOC eğilimi 0,09 ± 0,08 Sv/yıl (2004-2023).", "xing-2026-bati-siniri-dususu", "Sonuçlar, RAPID karşılaştırması", "direct", "tam-amoc-009"),
    E("Aynı enlemde batı sınırı katkısı 0,21 ± 0,08 Sv/yıl ile daha hızlı düşüyor.", "xing-2026-bati-siniri-dususu", "Sonuçlar, batı sınırı", "direct", "bati-021"),
    E("Doğu sınırı katkısı TERS yönde, -0,16 ± 0,06 Sv/yıl ile gücleniyor ve farkı kapatıyor.", "xing-2026-bati-siniri-dususu", "Sonuçlar, doğu sınırı", "direct", "dogu-gucleniyor"),
    E("Makale, batı sınırı ölçüsünün eğilimin işaretini yakaladığını ama büyüklüğünü aştığını kendi ifadesiyle belirtiyor.", "xing-2026-bati-siniri-dususu", "Tartışma, sınırlar", "direct", "makale-abartiyor-diyor"),
    E("Referans derinliğin sabit 1000 m alınması da eğilimi etkiliyor; düzeltilince 26,5°N değeri 0,22 ± 0,07'ye iniyor.", "xing-2026-bati-siniri-dususu", "Yöntem, derinlik referansı", "context", "derinlik-referansi"),
  ],
  counter_evidence: [
    E("Düşüşün KENDİSİ dört enlemde tutarlı ve anlamlı; bu kayıt düşüşü değil, aktarılan BÜYÜKLÜĞÜ düzeltiyor.", "xing-2026-bati-siniri-dususu", "Sonuçlar", "counter", "dusus-gercek"),
    E("Makale insan kaynaklı zorlamaya atıf yapmıyor; ne bu kaydın ne de basının 'iklim değişikliği yüzünden' demeye dayanağı var.", "xing-2026-bati-siniri-dususu", "Atıf bölümü yokluğu", "context", "atif-yok"),
    E("Doğu sınırındaki ters eğilimin bütün Kuzey Atlantik'te tutarlı olup olmadığı ve mekanizması bilinmiyor.", "xing-2026-bati-siniri-dususu", "Tartışma, açık sorular", "counter", "dogu-mekanizma-bilinmiyor"),
  ],
  open_questions: ["20 Sv → 15 Sv aktarımı hangi metinden çıktı? Makalede bu ikili bulunamadı."],
  volatile: true,
  review: { status: "draft", notes: "Xing ve ark. 2026 tam metni (PMC13060603) okundu; rakamlar oradan alındı." },
});

kur({
  id: "amoc-ipcc-cumlesinin-iki-yarisi",
  claim: "IPCC aynı değerlendirmede hem zayıflamanın çok olası olduğunu hem de 2100'den önce ani çöküş olmayacağına orta güven duyulduğunu söyler.",
  status: "established", confidence: "high",
  topic: ["amoc", "ipcc", "uzlasi"],
  disciplines: ["iklim-bilimi"],
  popular_claim: "Bilim insanları AMOC'un çökeceği konusunda uyarıyor.",
  divergence:
    "Değerlendirilmiş uzlaşı iki cümleden oluşuyor ve popüler aktarım ilkini alıp ikincisini düşürüyor: " +
    "zayıflama 'çok olası', ani çöküş ise 'olmayacağına ORTA GÜVEN' var. Üçüncü bir cümle daha var ve " +
    "hiç geçmiyor: 20. yüzyıl için güven DÜŞÜK, çünkü rekonstrüksiyonlar ve modeller birbirini tutmuyor. " +
    "'Orta güven' bir teminat değil, bir belirsizlik ifadesidir - ama 'çöküyor' da değildir.",
  divergence_type: ["medya-abartisi", "ideolojik-secim"],
  sources: [S.ipcc, S.ditlevsen, S.rahmstorf2026],
  evidence: [
    E("AMOC'un 21. yüzyıl boyunca bütün senaryolarda zayıflaması ÇOK OLASI.", "ipcc-ar6-wg1-bolum9", "9. bölüm, gelecek projeksiyonları", "direct", "cok-olasi-zayiflama"),
    E("Bu düşüşün 2100'den önce ani bir çöküş içermeyeceğine ORTA GÜVEN duyuluyor.", "ipcc-ar6-wg1-bolum9", "9. bölüm, ani değişim", "direct", "orta-guven-cokus-yok"),
    E("20. yüzyıl için rekonstrüksiyon ve model değişimlerine DÜŞÜK GÜVEN var; sayısal eğilimlerde uyuşma az.", "ipcc-ar6-wg1-bolum9", "9. bölüm, geçmiş değişimler", "direct", "dusuk-guven-20yy"),
  ],
  counter_evidence: [
    E("IPCC AR6 2021 tarihli; sonrasında hem çöküşü öngören hem de dışlayan hakemli çalışmalar yayımlandı. Değerlendirme güncel literatürün tamamını kapsamıyor.", "ditlevsen-2023-erken-uyari", "Yayın tarihi", "counter", "ar6-2021-tarihli"),
    E("Alanın bir bölümü değerlendirmenin fazla ihtiyatlı olduğunu savunuyor ve birden çok bağımsız hattın zayıflamaya işaret ettiğini öne sürüyor.", "rahmstorf-caesar-2026-gorus", "Ana argüman", "claim-origin", "fazla-ihtiyatli-elestirisi"),
    E("'Orta güven' ifadesi, çöküşün OLMAYACAĞININ kanıtlandığı anlamına gelmez; belirsizliğin adıdır.", "ipcc-ar6-wg1-bolum9", "Güven dili tanımı", "context", "orta-guven-teminat-degil"),
  ],
  volatile: true,
  review: { status: "draft", notes: "Alıntılar bölüm metninden alındı, basın özetinden değil." },
});

kur({
  id: "amoc-cokmez-sonucu-tanima-bagli",
  claim: "Baker ve arkadaşlarının 'çöküş olası değil' sonucu, çöküşün 6 Sv altına inmek olarak tanımlanmasına dayanır; aynı modellerde AMOC ortalama %54 zayıflar.",
  status: "established", confidence: "high",
  topic: ["amoc", "iklim-modeli", "tanim"],
  disciplines: ["iklim-bilimi"],
  popular_claim: "Yeni araştırma AMOC'un çökmeyeceğini gösterdi; endişeye gerek yok.",
  divergence:
    "Sonuç doğru aktarılıyor ama tanımı düşüyor. Baker ve arkadaşları çöküşü '6 Sv altına inmek' diye " +
    "tanımlıyor. AYNI modellerde AMOC %20-81 arasında (ortalama %54) zayıflıyor. ~17 Sv'lik bir AMOC'un " +
    "yarıya inmesi bu tanıma göre 'çöküş değil' - ama küçük bir olay da değil. " +
    "Dahası bu tanım ilk basımda metinde YOKTU; Mayıs 2025 yazar düzeltmesiyle parantez içinde eklendi.",
  divergence_type: ["medya-abartisi", "kategori-hatasi"],
  sources: [S.baker, S.bakerDuzeltme, S.ipcc],
  evidence: [
    E("Çöküş, açıkça '6 Sv altına zayıflamak' olarak tanımlanıyor.", "baker-2025-cokmez", "Future fate of the AMOC bölümü", "direct", "6sv-tanimi"),
    E("Aynı modellerde AMOC 4xCO2 altında %20-81 (ortalama %54) zayıflıyor.", "baker-2025-cokmez", "Sonuçlar, zayıflama aralığı", "direct", "yuzde-54-zayiflama"),
    E("Tatlı su zorlaması altında zayıflama %50-80 (ortalama %61) aralığında.", "baker-2025-cokmez", "Sonuçlar, tatlı su deneyi", "direct", "tatlisu-yuzde-61"),
    E("6 Sv tanımı metne ilk basımda değil, Mayıs 2025 yazar düzeltmesiyle eklendi.", "baker-2025-yazar-duzeltmesi", "Düzeltme metni", "direct", "tanim-sonradan-eklendi"),
    E("Aynı düzeltme 'PMOC oluşmuyor' ifadesini 'oluşmuyor ya da genel olarak zayıf kalıyor' olarak yumuşattı.", "baker-2025-yazar-duzeltmesi", "Düzeltme metni", "direct", "pmoc-ifadesi-yumusatildi"),
  ],
  counter_evidence: [
    E("Mekanizma gerçek ve savunulabilir: Güney Okyanusu yükselimini dengeleyecek kadar güçlü bir Pasifik devrilmesi modellerde oluşmuyor. Bu kayıt sonucu değil, aktarımını düzeltiyor.", "baker-2025-cokmez", "Mekanizma bölümü", "counter", "mekanizma-gercek"),
    E("Yazarlar kendi sınırlarını yazıyor: modeller güçlü bir Pasifik devrilmesi olasılığını hafife alıyorsa, çöküş riskini de hafife alıyor olabilirler.", "baker-2025-cokmez", "Sınırlar bölümü", "counter", "model-yanliligi-riski"),
    E("Denenen zorlamalar aşırı senaryolardır (CO2'nin ani dörde katlanması); yazarlar daha büyük zorlamaların AMOC'u daha da zayıflatabileceğini belirtiyor.", "baker-2025-cokmez", "Sınırlar bölümü", "counter", "asiri-senaryo"),
    E("Sonuç yalnızca 21. yüzyıl içindir; 2100 sonrası için analiz yapılmamıştır.", "baker-2025-cokmez", "Kapsam", "context", "2100-sonrasi-yok"),
  ],
  volatile: true,
  review: { status: "draft", notes: "Baker 2025 tam metni (PMC11864975) ve yazar düzeltmesi (PMC12058520) okundu." },
});

kur({
  id: "amoc-alan-ici-celiski",
  claim: "AMOC'un şu anda zayıflayıp zayıflamadığı konusunda hakemli literatür kendi içinde çelişir; 'düşüş yok' sonucu veren çalışmalar popüler aktarımda görünmez.",
  status: "contested", confidence: "high",
  topic: ["amoc", "literatur", "yayin-yanliligi"],
  disciplines: ["iklim-bilimi"],
  popular_claim: "Bilim insanları AMOC'un zayıfladığı konusunda hemfikir.",
  divergence:
    "Hemfikir değiller. Worthington ve arkadaşlarının 30 yıllık rekonstrüksiyonunun BAŞLIĞI doğrudan " +
    "'düşüş göstermiyor' diyor ve çöküş anlatısını aktaran popüler içerikte neredeyse hiç geçmiyor. " +
    "Anlatıya uymayan hakemli sonucun görünmez kalması, seçici aktarımın tanımıdır.",
  divergence_type: ["ideolojik-secim", "medya-abartisi"],
  sources: [S.worthington, S.caesar2018, S.ditlevsen, S.vanWesten, S.baker, S.rahmstorf2026],
  evidence: [
    E("1981-2016 rekonstrüksiyonu genel bir AMOC düşüşü göstermiyor; 2008-2012 zayıflaması 1980'lerin ortasından beri en düşük değer ama eğilim değil.", "worthington-2021-dusus-yok", "Sonuçlar", "direct", "genel-dusus-yok"),
    E("Aynı çalışma, 2008-2012 düşüşünün antropojenik bir eğilimden çok iç değişkenlik olmasının daha olası olduğunu söylüyor.", "worthington-2021-dusus-yok", "Tartışma", "direct", "ic-degiskenlik"),
    E("Deniz yüzeyi sıcaklığı parmak izi yöntemi ise 20. yüzyıl boyunca zayıflama buluyor.", "caesar-2018-parmak-izi", "Sonuçlar", "direct", "sst-parmak-izi"),
    E("Erken uyarı sinyali yöntemleri devrilme yolunda olunduğunu öne sürüyor.", "ditlevsen-2023-erken-uyari", "Ana argüman", "claim-origin", "erken-uyari-iddiasi"),
    E("Fizik temelli bir erken uyarı sinyali de aynı yönde sonuç veriyor.", "vanwesten-2024-devrilme-yolunda", "Ana argüman", "claim-origin", "fizik-temelli-uyari"),
    E("34 modelli çalışma ise bu yüzyıl içinde çöküşü olası bulmuyor.", "baker-2025-cokmez", "Sonuç", "counter", "34-model-cokmez"),
  ],
  counter_evidence: [
    E("Çelişki yöntem farkından doğuyor: doğrudan mooring ölçümü, vekil rekonstrüksiyon ve model simülasyonu aynı büyüklüğü ölçmüyor. 'Uyuşmuyorlar' ile 'biri yanlış' aynı şey değil.", "worthington-2021-dusus-yok", "Yöntem karşılaştırması", "context", "yontem-farki"),
    E("Worthington ve arkadaşları da kendi sonuçlarının antropojenik değişimin YOKLUĞUNU kanıtlamadığını söylüyor; seri bunun için çok kısa.", "worthington-2021-dusus-yok", "Tartışma, sınırlar", "counter", "yokluk-kaniti-degil"),
    E("Zayıflamayı savunan taraf da birden çok bağımsız hattın birlikte değerlendirilmesi gerektiğini öne sürüyor; bu görüş yazısı açık hakem sürecinde seçici literatür kullanımı nedeniyle eleştirildi.", "rahmstorf-caesar-2026-gorus", "Açık hakem değerlendirmesi", "counter", "gorus-yazisi-elestirildi"),
  ],
  volatile: true,
  review: { status: "draft", notes: "Worthington ve Baker tam metinden; diğerleri künye ve özet düzeyinde." },
});

kur({
  id: "amoc-gecmiste-zayifladi-durmadi",
  claim: "AMOC geçmişte defalarca ve hızla zayıfladı; en güçlü olaylarda bile tümüyle durduğuna dair vekil gösterge kanıtı yoktur.",
  status: "established", confidence: "medium",
  topic: ["amoc", "paleoiklim", "heinrich", "dansgaard-oeschger"],
  disciplines: ["iklim-bilimi", "jeoloji"],
  period: { earliest: -70000, latest: -11700, era_label: "Son buzul dönemi", precision: "approximate", dating_method: ["radiocarbon", "isotopic", "stratigraphy"] },
  popular_claim: "AMOC geçmişte durdu ve dünyayı buzul çağına soktu.",
  divergence:
    "Zayıflama gerçek ve tekrarlı; DURMA kanıtlanmış değil. Protaktinyum-toryum oranları Heinrich " +
    "Stadial 1 için 'zayıflamış AMA SÜREN' bir sirkülasyon gösteriyor - makalenin başlığı bunu " +
    "birebir söylüyor. Genç Dryas için de aynı: 'zayıflamış AMOC'un sürdürülmesi'. " +
    "'Durdu' cümlesi vekil göstergelerin verdiğinden fazlasını iddia ediyor.",
  divergence_type: ["medya-abartisi", "kategori-hatasi"],
  sources: [S.bradtmiller, S.you2026, S.fohlmeister, S.he2021],
  evidence: [
    E("Heinrich Stadial 1 için 231Pa/230Th oranları belirgin bir azalma gösteriyor ama duruş göstermiyor.", "bradtmiller-2014-path-heinrich", "Başlık ve sonuçlar", "direct", "path-zayif-ama-suren"),
    E("Geç Genç Dryas için de zayıflamış ama süren bir AMOC bulunuyor.", "you-2026-genc-dryas-tatlanma", "Başlık ve sonuçlar", "direct", "genc-dryas-suren"),
    E("Dansgaard-Oeschger döngüleri atmosfer dolaşımının küresel ölçekte yeniden düzenlendiğini gösteriyor; olaylar on yıllar içinde gerçekleşiyor.", "fohlmeister-2023-do-donguleri", "Sonuçlar", "direct", "do-kuresel"),
  ],
  counter_evidence: [
    E("Vekil göstergeler sirkülasyonu doğrudan ölçmez; 231Pa/230Th parçacık süpürülmesinden de etkilenir ve yorum bu varsayıma bağlıdır.", "bradtmiller-2014-path-heinrich", "Yöntem varsayımları", "counter", "vekil-dolayli"),
    E("Grönland buz çekirdeği izotopları Heinrich Stadial 1 soğumasını olduğu gibi göstermiyor; buz çekirdeği olayın kendisini değil, olayın Grönland'daki izini ölçüyor.", "he-2021-heinrich-gronland", "Ana argüman", "counter", "gronland-izi"),
    E("'Durmadı' ile 'durmaz' aynı şey değil: geçmiş olaylar buzul dünyasında, bugünkünden farklı sınır koşullarında yaşandı.", "bradtmiller-2014-path-heinrich", "Kayıt düzeyi ayrımı", "context", "gecmis-bugun-farki"),
    E("Bu kayıttaki paleo makalelerinin TAM METNİ okunmadı; locator'lar başlık ve özet düzeyindedir.", "you-2026-genc-dryas-tatlanma", "Kaynak düzeyi", "context", "tam-metin-okunmadi"),
  ],
  open_questions: ["Heinrich olaylarında AMOC ne kadar zayıfladı? Vekil göstergeler nicel bir değer vermiyor."],
  review: { status: "draft", notes: "Paleo kaynakları özet düzeyinde okundu; kayıt bu sınırı açıkça taşıyor." },
});

kur({
  id: "amoc-buzul-cagini-baslatmaz",
  claim: "Buzul çağlarının ritmini yörünge zorlaması sürer; AMOC olayları buzul durumunun İÇİNDE yaşanan yüzyıl ölçekli salınımlardır.",
  status: "established", confidence: "high",
  topic: ["amoc", "buzul-cagi", "milankovic", "zaman-olcegi"],
  disciplines: ["iklim-bilimi", "astronomi", "jeoloji"],
  popular_claim: "AMOC çökerse yeni bir buzul çağı başlar.",
  divergence:
    "İki ayrı zaman ölçeği ve iki ayrı mekanizma birbirine karışıyor. Buzul çağları on binlerce yıllık " +
    "yörünge döngüleriyle geliyor (bkz. [[felaket-milankovic-donguleri]]). AMOC olayları ise on yıllar " +
    "ile yüzyıllar arasında, ZATEN var olan bir iklim durumunun içinde yaşanıyor - Dansgaard-Oeschger ve " +
    "Heinrich olaylarının hepsi son buzul döneminin İÇİNDE. AMOC bir yükseltici ve yeniden dağıtıcıdır, " +
    "buzullaşmanın tetikleyicisi değil.",
  divergence_type: ["kategori-hatasi", "medya-abartisi"],
  sources: [S.fohlmeister, S.bradtmiller, S.ipcc],
  evidence: [
    E("Dansgaard-Oeschger olayları son buzul döneminin içinde, on yıllar ölçeğinde yaşanan geçişlerdir.", "fohlmeister-2023-do-donguleri", "Giriş ve tanım", "direct", "do-buzul-icinde"),
    E("Heinrich olayları da buzul dönemine ait; buzul tabakasının kendisi buz dağı boşaltımının ön koşuludur.", "bradtmiller-2014-path-heinrich", "Bağlam", "direct", "heinrich-buzul-icinde"),
    E("AMOC ısıyı yeniden dağıtır; IPCC değerlendirmesi de onu küresel ortalama sıcaklığın sürücüsü değil, bölgesel iklim üzerinde etkili bir sistem olarak ele alır.", "ipcc-ar6-wg1-bolum9", "9. bölüm, AMOC etkileri", "direct", "isi-yeniden-dagitir"),
  ],
  counter_evidence: [
    E("AMOC zayıflamasının bölgesel etkileri ciddi olabilir; bu kayıt etkiyi küçümsemiyor, 'buzul çağı' adlandırmasını reddediyor.", "ipcc-ar6-wg1-bolum9", "Kayıt düzeyi ayrımı", "context", "etki-kucumsenmiyor"),
    E("Yörünge zorlaması ile buzul döngüleri arasındaki bağın kendisi de tam çözülmüş değil; 100 bin yıllık ritmin fiziksel açıklaması üzerinde uzlaşı yok. Bkz. [[milankovic-100bin-yil-problemi]]", "ipcc-ar6-wg1-bolum9", "Kayıt düzeyi sınırı", "counter", "yorunge-bagi-da-acik"),
    E("Buzullaşmayı tetiklemese de AMOC geri beslemelerle buzul döngülerine katkıda bulunuyor olabilir; 'tetikleyici değil' ile 'ilgisiz' aynı şey değil.", "bradtmiller-2014-path-heinrich", "Kayıt düzeyi ayrımı", "context", "geri-besleme-olabilir"),
  ],
  open_questions: ["AMOC geri beslemeleri buzul döngülerinin genliğine ne kadar katkı yapıyor?"],
  review: { status: "draft", notes: "Dosyadaki Milanković kayıtlarıyla bağ kuruldu; o kayıtlar bu iddiayı zaten taşıyor." },
});

kur({
  id: "genc-dryas-eriyik-su-guzergahi-tartismali",
  claim: "Genç Dryas'ı tetikleyen eriyik su boşalmasının hangi güzergâhtan aktığı ve tek başına yeterli olup olmadığı tartışmalıdır.",
  status: "contested", confidence: "medium",
  topic: ["genc-dryas", "amoc", "eriyik-su", "paleoiklim"],
  disciplines: ["iklim-bilimi", "jeoloji"],
  period: { earliest: -12900, latest: -11700, era_label: "Genç Dryas", precision: "approximate", dating_method: ["radiocarbon", "isotopic"] },
  popular_claim: "Agassiz Gölü'nün St. Lawrence'tan boşalması AMOC'u durdurdu ve Genç Dryas'ı başlattı.",
  divergence:
    "Klasik anlatı modellemede tutmuyor. Yüksek çözünürlüklü modelde St. Lawrence'tan boşalan tatlı su " +
    "derin su oluşum bölgelerinin ~3.000 km güneyine gidiyor ve AMOC'u %15'ten AZ zayıflatıyor. " +
    "Mackenzie Vadisi güzergâhı ise kıyı akıntılarıyla doğrudan oluşum bölgesine ulaşıp %30'dan FAZLA " +
    "zayıflatıyor. Yani yaygın anlatının güzergâhı, iddia ettiği etkiyi üretmiyor.",
  divergence_type: ["guncellenmemis", "medya-abartisi"],
  sources: [S.condron, S.you2026, S.bradtmiller],
  evidence: [
    E("St. Lawrence güzergâhından boşalan tatlı su derin su oluşum bölgelerinin çok güneyine taşınıyor ve AMOC'u %15'ten az zayıflatıyor.", "condron-winsor-2012-eriyik-su-yolu", "Sonuçlar", "direct", "st-lawrence-yetersiz"),
    E("Mackenzie Vadisi güzergâhı dar kıyı akıntılarıyla oluşum bölgesine ulaşıyor ve AMOC'u %30'dan fazla zayıflatıyor.", "condron-winsor-2012-eriyik-su-yolu", "Sonuçlar", "direct", "mackenzie-etkili"),
    E("Genç Dryas boyunca kuzey Atlantik'te yüzey tatlanması ve zayıflamış bir AMOC saptanıyor.", "you-2026-genc-dryas-tatlanma", "Sonuçlar", "direct", "yuzey-tatlanmasi"),
  ],
  counter_evidence: [
    E("Tek bir tatlı su olayının bin yıllık bir soğuk dönemi tek başına açıklayıp açıklayamayacağı tartışmalı.", "condron-winsor-2012-eriyik-su-yolu", "Tartışma", "counter", "tek-basina-yeterli-mi"),
    E("Boşalmanın süresi bile çözülmüş değil; aylardan yüzyıla uzanan tahminler dolaşıyor.", "condron-winsor-2012-eriyik-su-yolu", "Tartışma", "counter", "sure-belirsiz"),
    E("Bu kayıt model sonucuna dayanıyor; modelin çözünürlüğü ve tatlı su zorlamasının büyüklüğü varsayımdır.", "condron-winsor-2012-eriyik-su-yolu", "Yöntem sınırı", "context", "model-varsayimi"),
    E("Bu kayıt Genç Dryas Çarpma Hipotezi ile İLGİLİ DEĞİLDİR; o ayrı bir iddiadır ve burada ele alınmamıştır.", "bradtmiller-2014-path-heinrich", "Kapsam dışı", "context", "carpma-hipotezi-disinda"),
  ],
  open_questions: ["Eriyik suyun Mackenzie güzergâhından aktığına dair saha kanıtı ne kadar güçlü?"],
  review: { status: "draft", notes: "Condron & Winsor özet düzeyinde okundu; tam metin okunmadı." },
});

/* --- yaz ------------------------------------------------------------ */

writeFileSync(PATH, `${JSON.stringify(kayitlar, null, 2)}\n`, "utf8");
console.log(`${PATH}: ${kayitlar.length} kayıt yazıldı.`);
for (const r of kayitlar) console.log(`  ${r.status.padEnd(13)} ${r.id}`);
