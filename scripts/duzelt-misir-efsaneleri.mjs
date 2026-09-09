#!/usr/bin/env node
// Mısır efsaneleri kayıtlarında beş düzeltme.
//
// Bu dosya paralel bir oturumda üretildi, ben denetledim ve beş kusur
// buldum. İkisi olgusal, üçü atıf hatası. Kayıtlar zaten v2; bu yüzden
// yeniden kurmak yerine CERRAHİ yama yapılıyor - düzeltmenin neyi
// değiştirdiği git farkında okunabilir kalsın diye.
//
// 1) İSİM YANLIŞ. "Sâimüddîn" -> "Sâim ed-Dehr". el-Makrîzî'nin aktardığı
//    kişi Muhammed Sâim ed-Dehr'dir (صائم الدهر, "sürekli oruç tutan").
//    "Sâimüddîn" başka bir addır ve bu kişiye ait değildir.
//
// 2) 1378 ATFI FAZLA KESİN SUNULMUŞ - ve yazının KENDİ KAYNAĞIYLA çelişiyor.
//    Kayıt Napoleon'u çürütüp yerine 1378'i koyuyordu. Ama Lehner'in Sfenks
//    incelemesi burun bölgesine çubuk/keski çakılıp kaldıraçla koparıldığını
//    ve hasarın MS 3.-10. yüzyıllara ait olduğunu söylüyor - yani 1378'den
//    yüzyıllarca önce. Lehner zaten bu dosyanın kaynağı (lehner1997, üç
//    kayıtta kullanılıyor). Napoleon'un çürütülmesi DOĞRU kalıyor (Norden
//    çizimleri bunu kesin halleder); değişen şey, boşluğa ikinci bir
//    anlatının aynı kesinlikle yerleştirilmemesi.
//    SINIR: Lehner'in tarihlemesi ikincil aktarımlardan doğrulandı, kendi
//    metninden değil. Bu, eklenen satırda yazılı.
//
// 3) ZAMAN TUTARSIZ ATIF. "1990'larda sismik ölçümlerde anomaliler
//    bildirildi" satırı west1979'a bağlanmıştı. 1979 tarihli bir kitap
//    1990'lardaki ölçümleri bildiremez. Gerçek kaynak künyelendi:
//    Dobecki & Schoch 1992, Geoarchaeology, DOI 10.1002/gea.3340070603.
//
// 4) KARŞI KANIT, İDDİANIN KENDİ KAYNAĞINA BAĞLANMIŞ. "Kireçtaşı
//    yalıtkandır" satırı dunn1998'e counter olarak bağlanmıştı; Dunn'ın
//    kitabı santral tezini SAVUNUR, kendi çürütmesini içermez. Satır,
//    kaydın kendi fiziksel çıkarımı olarak işaretlendi ve buna ayrı bir
//    kaynak bulunamadığı açıkça yazıldı.
//
// 5) KÜLLİYAT ÇAPINDA OLUMSUZ İDDİA, TEK TAPINAK EDİSYONUNA DAYANDIRILMIŞ.
//    "Mısır metin külliyatında elektrik/ampul/kablo karşılığı sözcük yok"
//    satırı cauville2020'ye bağlanmıştı - o eser Dendera'nın Hathor ve İsis
//    ilahilerinin edisyonudur ve tüm Mısır söz varlığı hakkında bir olumsuz
//    iddiayı taşıyamaz. Sözlük ve külliyat kaynakları eklendi: Faulkner 1962
//    ve Thesaurus Linguae Aegyptiae.

import { readFileSync, writeFileSync } from "node:fs";

const PATH = "data/findings/misir-efsaneleri.json";
const CHECKED = "2026-09-09";

const list = JSON.parse(readFileSync(PATH, "utf8"));
const bul = (id) => {
  const r = list.find((x) => x.id === id);
  if (!r) { console.error("kayıt yok:", id); process.exit(1); }
  return r;
};
const degis = [];

/* --- yeni kaynaklar ------------------------------------------------- */

const dobecki = {
  id: "dobecki-schoch-1992-sismik",
  tier: "peer-reviewed", type: "article",
  authors: ["Dobecki, Thomas L.", "Schoch, Robert M."], year: 1992,
  title: "Seismic investigations in the vicinity of the Great Sphinx of Giza, Egypt",
  container: "Geoarchaeology", volume: "7(6)",
  doi: "10.1002/gea.3340070603",
  language: "en", accessed: CHECKED,
  note:
    "1990'lardaki sismik ölçümlerin ASIL kaynağı. Önceki sürümde bu satır West 1979'a bağlanmıştı - " +
    "1979 tarihli bir kitap 1990'ların ölçümlerini bildiremez. Çalışma anomalileri raporlar; " +
    "onları 'oda' saymaz - o atlama popüler yorumda yapılır.",
};

const faulkner = {
  id: "faulkner-1962-middle-egyptian",
  tier: "peer-reviewed", type: "book",
  authors: ["Faulkner, Raymond O."], year: 1962,
  title: "A Concise Dictionary of Middle Egyptian",
  publisher: "Griffith Institute, Ashmolean Museum", isbn: "9780900416323",
  language: "en", accessed: CHECKED,
  note: "Standart Orta Mısırca sözlük. Söz varlığına dair olumsuz iddianın dayanması gereken kaynak türü budur - tek bir tapınak edisyonu değil.",
};

const tla = {
  id: "thesaurus-linguae-aegyptiae",
  tier: "institutional", type: "database",
  title: "Thesaurus Linguae Aegyptiae",
  institution: "Berlin-Brandenburgische Akademie der Wissenschaften",
  url: "https://thesaurus-linguae-aegyptiae.de/",
  language: "de", accessed: CHECKED,
  note: "Yayımlanmış Mısırca metin külliyatının aranabilir veri tabanı. 'Külliyatta böyle bir sözcük yok' iddiası ancak böyle bir araçla denetlenebilir.",
};

/* --- 1 + 2) Sfenks'in burnu ----------------------------------------- */

const burun = bul("sfenks-napolyon-burnu");

// Lehner bu kaydın kaynak listesinde YOKTU - oysa dosyanın başka
// kayıtlarında kullanılıyor. Tarihleme çelişkisi tam da bu yüzden
// görülmemiş olabilir: kaynak dosyada vardı ama bu kayda bağlanmamıştı.
const lehnerKaynak = list.flatMap((r) => r.sources ?? []).find((s) => s.id === "lehner1997");
if (lehnerKaynak && !burun.sources.some((s) => s.id === "lehner1997")) burun.sources.push(lehnerKaynak);

// Kaynak notunda da yanlis isim vardi - kaydin govdesini duzeltip
// kaynagin notunu birakmak, hatanin yarisini birakmak olurdu.
for (const src of burun.sources) {
  if (src.note) src.note = src.note.replace(/Sâimüddîn/g, "Muhammed Sâim ed-Dehr");
}

burun.divergence =
  "Anlatı iki ayrı tarihi (1378 kaydı, 1798 seferi) tek sahnede birleştirir ve burnun çok daha önce eksik olduğu çizim kaydıyla yanlışlanır. " +
  "AMA NAPOLEON'U ÇÜRÜTMEK, YERİNE BAŞKA BİR FAİL KOYMAK DEMEK DEĞİL: el-Makrîzî'nin 1378 kaydı burnun kırılışına dair en bilinen anlatıdır, " +
  "kanıtlanmış faili değil. Lehner'in Sfenks incelemesi, burun bölgesine çubuk/keski çakılıp kaldıraçla koparıldığını ve hasarın " +
  "MS 3.-10. yüzyıllara ait olduğunu söyler - yani 1378'den YÜZYILLARCA ÖNCE. Kesin olan tek şey, burnun 1798'den çok önce gitmiş olduğudur.";

burun.evidence = [
  {
    id: "makrizi-kaydi",
    text: "el-Makrîzî'nin 15. yüzyıl vakayinamesi, 1378'de Muhammed Sâim ed-Dehr adlı kişinin Sfenks'in burnunu kırdığını aktarır.",
    citations: [{ source_ref: "makrizi", locator: "el-Hıtat, Sfenks bahsi", support_type: "claim-origin" }],
  },
];

burun.counter_evidence = [
  {
    id: "norden-cizimleri",
    text: "Norden'in 1737-38 çizimlerinde burun zaten yoktur; Napoleon seferi 1798'dedir. Napoleon anlatısını kesin olarak yanlışlayan kanıt budur.",
    citations: [{ source_ref: "norden1757", locator: "Giza levhaları", support_type: "counter" }],
  },
  {
    id: "lehner-tarihleme-celiskisi",
    text:
      "Lehner'in incelemesine göre burun bölgesine çubuk/keski çakılıp kaldıraçla koparılmıştır ve hasar MS 3.-10. yüzyıllara tarihlenir - " +
      "yani 1378 kaydından yüzyıllarca önce. Bu doğruysa el-Makrîzî'nin anlattığı olay, zaten eksik olan bir burna sonradan bağlanmış bir anlatı olabilir.",
    citations: [{ source_ref: "lehner1997", locator: "Sfenks bölümü, hasar incelemesi", support_type: "counter" }],
  },
  {
    id: "lehner-ikincil-aktarim",
    text:
      "KAYIT DÜZEYİ SINIRI: Lehner'in tarihlemesi bu kayıtta İKİNCİL AKTARIMLARDAN doğrulandı, kendi metninden değil. " +
      "Sayfa düzeyinde locator yok; 'MS 3.-10. yüzyıl' aralığının Lehner'in kendi ifadesi mi yoksa aktaranların özeti mi olduğu denetlenmedi.",
    citations: [{ source_ref: "lehner1997", locator: "Künye ve locator düzeyi", support_type: "context" }],
  },
];

burun.open_questions = [
  "Burun hasarının kesin tarihi bilinmiyor: el-Makrîzî 1378 der, Lehner'in inceleme tarihlemesi çok daha eskiye işaret eder. İkisi uzlaştırılmadı.",
  "Lehner'in tarihlemesi kendi metninden, sayfa düzeyinde künyelenmeli.",
];

burun.review = {
  status: "draft",
  notes:
    "DENETİM DÜZELTMESİ (2026-09-09): (a) isim yanlıştı - 'Sâimüddîn' değil Muhammed Sâim ed-Dehr; " +
    "(b) 1378 atfı fazla kesin sunuluyordu ve dosyanın KENDİ kaynağıyla (Lehner) çelişiyordu. " +
    "Napoleon'un çürütülmesi doğru kalıyor; değişen şey, boşluğa ikinci bir anlatının aynı kesinlikle konmaması.",
};
degis.push("sfenks-napolyon-burnu: isim düzeltildi + Lehner tarihlemesi karşı kanıt olarak eklendi");

/* --- 3) Kayıt Salonu: zaman tutarsız atıf --------------------------- */

const salon = bul("sfenks-kayit-salonu");
if (!salon.sources.some((s) => s.id === dobecki.id)) salon.sources.push(dobecki);

for (const e of salon.evidence ?? []) {
  if (!/sismik/i.test(e.text)) continue;
  e.text =
    "1990'larda Sfenks çevresinde yapılan sismik ölçümler, kayada anomaliler raporladı; iddia bu raporu 'oda' okumasına bağlar.";
  e.citations = [{ source_ref: dobecki.id, locator: "Ölçüm sonuçları", support_type: "claim-origin" }];
}
(salon.counter_evidence ??= []).push({
  id: "anomali-oda-degil",
  text:
    "Sismik çalışmanın kendisi anomalileri RAPORLAR, onları 'oda' saymaz. 'Anomali -> salon' atlaması ölçümde değil, popüler yorumda yapılır.",
  citations: [{ source_ref: dobecki.id, locator: "Sonuçların yorumu", support_type: "counter" }],
});
salon.review = {
  status: "draft",
  notes:
    "DENETİM DÜZELTMESİ (2026-09-09): '1990'larda sismik ölçümler' satırı West 1979'a bağlanmıştı - 1979 tarihli bir kitap 1990'ların ölçümlerini bildiremez. " +
    "Gerçek kaynak künyelendi (Dobecki & Schoch 1992, Geoarchaeology, DOI crossref'te doğrulandı).",
};
degis.push("sfenks-kayit-salonu: zaman tutarsız atıf düzeltildi (west1979 -> Dobecki & Schoch 1992)");

/* --- 4) Santral: karşı kanıt iddianın kendi kaynağına bağlıydı ------ */

const santral = bul("piramit-enerji-santrali");
for (const c of santral.counter_evidence ?? []) {
  if (!/yalıtkan/i.test(c.text)) continue;
  c.text =
    "Kireçtaşı yalıtkandır; 'iletim hattı' okuması yapı malzemesinin elektriksel davranışıyla bağdaşmaz. " +
    "BU SATIR KAYDIN KENDİ FİZİKSEL ÇIKARIMIDIR: malzemenin yalıtkanlığı bilinen bir olgudur ama bu çıkarımı " +
    "Giza bağlamında yapan ayrı bir kaynak bu turda BULUNAMADI ve satır, iddianın kendi kaynağına dayandırılamaz.";
  c.citations = [{ source_ref: "lehner1997", locator: "Yapı malzemeleri - bağlam", support_type: "context" }];
}
santral.review = {
  status: "draft",
  notes:
    "DENETİM DÜZELTMESİ (2026-09-09): 'kireçtaşı yalıtkandır' karşı kanıtı dunn1998'e counter olarak bağlanmıştı - " +
    "Dunn'ın kitabı santral tezini SAVUNUR, kendi çürütmesini içermez. Satır kaydın kendi çıkarımı olarak işaretlendi ve " +
    "ayrı kaynak bulunamadığı açıkça yazıldı.",
};
degis.push("piramit-enerji-santrali: karşı kanıt iddianın kendi kaynağından ayrıldı");

/* --- 5) Dendera: külliyat çapında olumsuz iddia --------------------- */

const dendera = bul("dendera-isigi");
for (const s of [faulkner, tla]) if (!dendera.sources.some((x) => x.id === s.id)) dendera.sources.push(s);

for (const c of dendera.counter_evidence ?? []) {
  if (!/külliyat|sözcük/i.test(c.text)) continue;
  c.text =
    "Mısır metin külliyatında elektrik, ampul, aydınlatma cihazı veya kabloya karşılık gelen bir sözcük kayıtlı değildir. " +
    "Bu, sözlük ve aranabilir külliyat düzeyinde denetlenebilir bir ifadedir - tek bir tapınak edisyonunun taşıyabileceği bir iddia değil.";
  c.citations = [
    { source_ref: faulkner.id, locator: "Sözlük geneli", support_type: "counter" },
    { source_ref: tla.id, locator: "Külliyat araması", support_type: "counter" },
  ];
}
(dendera.counter_evidence ??= []).push({
  id: "olumsuz-iddia-siniri",
  text:
    "OLUMSUZ İDDİA SINIRI: 'kayıtlı değildir' ifadesi, YAYIMLANMIŞ ve dizinlenmiş külliyat için geçerlidir. " +
    "Ayrıca bu kayıtta külliyat araması fiilen ÇALIŞTIRILMADI; kaynak, iddianın denetlenebileceği yeri gösteriyor, denetlendiğini değil.",
  citations: [{ source_ref: tla.id, locator: "Kayıt düzeyi sınırı", support_type: "context" }],
});
dendera.review = {
  status: "draft",
  notes:
    "DENETİM DÜZELTMESİ (2026-09-09): külliyat çapındaki olumsuz iddia cauville2020'ye (Dendera ilahileri edisyonu) bağlanmıştı. " +
    "Faulkner 1962 ve Thesaurus Linguae Aegyptiae eklendi; ayrıca aramanın fiilen yapılmadığı açıkça yazıldı.",
};
degis.push("dendera-isigi: külliyat iddiası sözlük ve TLA'ya bağlandı, arama yapılmadığı işaretlendi");

/* --- uygula -------------------------------------------------------- */

for (const r of [burun, salon, santral, dendera]) r.checked = CHECKED;
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
for (const d of degis) console.log("  " + d);
console.log(`\n${PATH}: ${list.length} kayıt, ${degis.length} kayıt düzeltildi`);
