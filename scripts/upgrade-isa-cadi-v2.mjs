#!/usr/bin/env node
// Kalan iki zayıf nokta: cadı avı kaydı ve İsa'nın tarihselliği kümesi.
//
// Doğrulanan çıpalar:
//   Levack, B. P. (2016). The Witch-Hunt in Early Modern Europe, 4. baskı.
//     Routledge. ISBN 9781138808102. ~45.000 idam tahmini; 1450-1750.
//   Ehrman, B. D. (2012). Did Jesus Exist? HarperOne. ISBN 9780062204608.
//   Meier, J. P. (1991). A Marginal Jew, Cilt 1. Doubleday.
//     ISBN 9780385264259.
//
// EŞLEŞMENİN DEĞERİ: Meier Katolik rahip, Ehrman agnostik. İkisi de
// varlık konusunda hemfikir. Bu, kayıttaki "kurumsal yanlılık bu maddeyi
// tek başına düşürmez" cümlesinin somut dayanağıdır - iddia edilen değil,
// gösterilen bir şey hâline gelir.
//
// SINIR: üç kitabın da künyesi doğrulandı, TAM METİNLERİ OKUNMADI.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const CHECKED = "2026-09-07";

/* --- kaynaklar ----------------------------------------------------- */

const levack = source("levack-2016-witch-hunt", {
  tier: "peer-reviewed", type: "book", authors: ["Levack, Brian P."], year: 2016,
  title: "The Witch-Hunt in Early Modern Europe", publisher: "Routledge",
  isbn: "9781138808102", volume: "4. baskı", language: "en", accessed: CHECKED,
  note: "Alanın standart monografisi. Avrupa geneli için ~45.000 idam tahmini verir; kapsam 1450-1750. Künye doğrulandı, tam metin okunmadı.",
});

const ehrman = source("ehrman-2012-did-jesus-exist", {
  tier: "peer-reviewed", type: "book", authors: ["Ehrman, Bart D."], year: 2012,
  title: "Did Jesus Exist? The Historical Argument for Jesus of Nazareth",
  publisher: "HarperOne", isbn: "9780062204608", language: "en", accessed: CHECKED,
  note: "Yazar agnostiktir ve mitçi konumu doğrudan ele alır. Künye doğrulandı, tam metin okunmadı.",
});

const meier = source("meier-1991-marginal-jew-1", {
  tier: "peer-reviewed", type: "book", authors: ["Meier, John P."], year: 1991,
  title: "A Marginal Jew: Rethinking the Historical Jesus, Volume 1: The Roots of the Problem and the Person",
  publisher: "Doubleday", container: "Anchor Bible Reference Library",
  isbn: "9780385264259", pages: "x+484", language: "en", accessed: CHECKED,
  note: "Tarihsel İsa yöntembiliminin standart başvuru eseri. Yazar Katolik rahiptir. Künye doğrulandı, tam metin okunmadı.",
});

const pavlus = source("pavlus-galatyalilar-1-19", {
  tier: "primary", type: "edition", authors: ["Pavlus"], year: 55,
  title: "Galatyalılara Mektup 1:18-19", publisher: "—", language: "grc",
  note: "Birinci ağızdan tanışma beyanı; en erken kayıt.",
});

const josephus20 = source("josephus-ant-20-200", {
  tier: "primary", type: "edition", authors: ["Flavius Josephus"], year: 93,
  title: "Antiquitates Judaicae 20.200", publisher: "—", language: "grc",
  note: "Yakup pasajı; Testimonium'un aksine geniş kabul görür.",
});

const tacitus = source("tacitus-annales-15-44", {
  tier: "primary", type: "edition", authors: ["Tacitus, Publius Cornelius"], year: 116,
  title: "Annales 15.44", publisher: "—", language: "la",
  note: "Bağımsız Roma kaydı.",
});

const pilatusYazit = source("pilatus-yaziti-caesarea", {
  tier: "primary", type: "inscription", year: 30,
  title: "Pilatus yazıtı (Caesarea Maritima)", publisher: "—", language: "la",
  note: "1961'de Antonio Frova başkanlığındaki İtalyan heyetince bulundu; İsrail Müzesi.",
});

const wikiTacitus = source("tacitus-on-jesus-wikipedia", {
  tier: "institutional", type: "webpage", title: "Tacitus on Jesus",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/Tacitus_on_Jesus",
  language: "en", accessed: CHECKED, note: "Ara kaynak; alanın uzlaşı durumunun özeti.",
});

const wikiPilate = source("pilate-stone-wikipedia", {
  tier: "institutional", type: "webpage", title: "Pilate stone",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/Pilate_stone",
  language: "en", accessed: CHECKED, note: "Ara kaynak; birincil epigrafik yayınla değiştirilmeli.",
});

const wikiWitch = source("witch-trials-wikipedia", {
  tier: "institutional", type: "webpage", title: "Witch trials in the early modern period",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/Witch_trials_in_the_early_modern_period",
  language: "en", accessed: CHECKED, note: "Ara kaynak.",
});

/* --- kayıtlar ------------------------------------------------------- */

const cadi = finding({
  id: "cadi-avi-donemi",
  claim: "Avrupa'daki büyük cadı avı dalgası Ortaçağ'a değil, erken modern döneme aittir.",
  status: "established", confidence: "high",
  topic: ["kilise", "erken-modern", "tarih-yazimi"],
  subject: { site: "Avrupa", region: "Orta ve Batı Avrupa", modern_country: "çok uluslu" },
  period: { earliest: 1450, latest: 1750, era_label: "Erken modern dönem", precision: "range", dating_method: ["historical-record"] },
  languages: ["Latince", "Almanca"], disciplines: ["tarih", "antropoloji"],
  people: [{ name: "Levack, Brian P.", role: "analyst", affiliation: "University of Texas at Austin", year: 2016 }],
  popular_claim: "Cadı yakma Ortaçağ karanlığının simgesidir ve milyonlarca kadın yakılmıştır.",
  divergence:
    "İki hata birden: DÖNEM ve SAYI. Alanın standart monografisi cadı avının büyük çağını 1450-1750 aralığına yerleştirir - yani Rönesans ve Reform SONRASI, hem Katolik hem Protestan bölgelerde. Sayı için verdiği tahmin, Avrupa geneli ve yaklaşık iki yüz yıl için YAKLAŞIK 45.000 İDAMDIR. 'Milyonlar' rakamı 19.-20. yüzyıl polemiğinin ürünüdür ve gerçek tahminin iki mertebe üstündedir.",
  divergence_type: ["medya-abartisi", "kategori-hatasi"],
  sources: [levack, wikiWitch],
  evidence: [
    ev("Alanın standart monografisi cadı avının büyük çağını 1450-1750 aralığında ele alır; kitapta kronoloji ve coğrafya için ayrı bir bölüm vardır.",
      cite("levack-2016-witch-hunt", "Kapsam ve 'The chronology and geography of witch-hunting' bölümü", "direct"), { id: "1450-1750-kapsam" }),
    ev("Avrupa geneli için yaklaşık iki yüz yıllık dönemde tahmin edilen idam sayısı yaklaşık 45.000'dir (asılarak ya da yakılarak).",
      cite("levack-2016-witch-hunt", "İdam sayısı tahmini", "direct"), { id: "45-bin-tahmini" }),
    ev("Yargılamaların yoğunlaştığı dönem yaklaşık 1560-1630'dur; hem Katolik hem Protestan bölgelerde yaşandı.",
      cite("witch-trials-wikipedia", "Kronoloji bölümü", "direct"), { id: "1560-1630-zirve" }),
    ev("Erken Ortaçağ kilise hukukunda gece uçuşu inancı yanılsama sayılıyordu; sertleşme sonradan geldi.",
      cite("witch-trials-wikipedia", "Erken dönem bölümü", "direct"), { id: "canon-episcopi" }),
  ],
  counter_evidence: [
    ev("45.000 bir TAHMİNDİR, sayım değil; kayıt eksikliği ve bölgesel farklar nedeniyle aralık verilir.",
      cite("levack-2016-witch-hunt", "İdam sayısı tahmini", "counter"), { id: "tahmin-sayim-degil" }),
    ev("Bölgesel farklar çok büyüktür; bazı bölgelerde yargılama neredeyse yokken bazılarında yoğundur.",
      cite("witch-trials-wikipedia", "Coğrafi dağılım", "counter"), { id: "bolgesel-fark" }),
    ev("Bu kayıtta monografinin tam metni okunmamıştır; künye, kapsam ve tahmin rakamı doğrulanmıştır.",
      cite("levack-2016-witch-hunt", "Kaynak erişim düzeyi", "context"), { id: "tam-metin-okunmadi" }),
  ],
  open_questions: ["Bölgesel dağılımın ayrıntılı haritası bu kayıtta çıkarılmadı."],
  checked: CHECKED, used_in: ["mit-ve-sicil"],
  review: { status: "draft", notes: "Hakemli çıpa eklendi (Levack 2016) ve rakam belirsizlikten çıktı: 'on binler' -> ~45.000." },
});

const isaEsik = finding({
  id: "isa-tarihsellik-esigi",
  claim: "1. yüzyılda Yahudiye'de yaşamış ve Pilatus döneminde idam edilmiş bir İsa'nın varlığı, sıradan tarihsel eşikte karşılanmıştır.",
  status: "established", confidence: "high",
  topic: ["isa", "hristiyanlik", "kaynak-elestirisi", "yontem"],
  subject: { site: "Yahudiye eyaleti", region: "Roma Doğu eyaletleri", modern_country: "İsrail / Filistin", coordinates: { lat: 31.78, lon: 35.22 } },
  period: { earliest: 30, latest: 121, era_label: "Olaydan kaynakların yazımına", precision: "range", dating_method: ["textual", "historical-record", "paleography"] },
  languages: ["Grekçe", "Latince", "Aramice"], disciplines: ["tarih", "metin-elestirisi", "filoloji"],
  people: [
    { name: "Meier, John P.", role: "analyst", affiliation: "University of Notre Dame", year: 1991 },
    { name: "Ehrman, Bart D.", role: "analyst", affiliation: "University of North Carolina at Chapel Hill", year: 2012 },
  ],
  popular_claim: "İsa hakkında çağdaş hiçbir kayıt yoktur; dolayısıyla var olduğu söylenemez.",
  divergence:
    "İtiraz yanlış EŞİĞİ kullanıyor: 1. yüzyılda seçkin olmayan bir taşra figürü için normal olan, HİÇ kayıt olmamasıdır. Doğru soru 'çağdaş kayıt var mı' değil, 'benzer figürlerle karşılaştırıldığında bu kayıtlar nerede duruyor'. VE KURUMSAL YANLILIK İTİRAZI BURADA SOMUT OLARAK KARŞILANIR: varlık maddesinde hemfikir olan iki standart eserden birinin yazarı KATOLİK RAHİP, ötekininki AGNOSTİKTİR. İkincisi kitabını doğrudan varlığı reddeden konuma cevap olarak yazmıştır. Yani uzlaşı tek bir inanç çevresinin ürünü değildir.",
  divergence_type: ["kategori-hatasi"],
  sources: [meier, ehrman, pavlus, josephus20, tacitus, wikiTacitus],
  evidence: [
    ev("Tarihsel İsa yöntembiliminin standart başvuru eseri, sağlam tarihsel bilginin sınırlı olduğunu kabul ederek farklı inançlardan insanların temel tarihsel olgularda uzlaşabileceğini savunur.",
      cite("meier-1991-marginal-jew-1", "Cilt 1, yöntem bölümü", "direct"), { id: "meier-yontem" }),
    ev("Agnostik bir metin eleştirmeni, varlığı reddeden konuma doğrudan cevap veren bir kitap yazmış ve tarihsel İsa'yı savunmuştur.",
      cite("ehrman-2012-did-jesus-exist", "Kitabın tezi", "direct"), { id: "ehrman-cevap" }),
    ev("En yakın kayıt Pavlus'un mektuplarıdır (y. 50'ler, ~23 yıl sonra) ve BİRİNCİ AĞIZDANDIR: 'Rab'bin kardeşi Yakup' ile görüştüğünü yazar - mucize değil, sıradan biyografik ayrıntı.",
      cite("pavlus-galatyalilar-1-19", "Galatyalılar 1:18-19", "direct"), { id: "pavlus-tanisma" }),
    ev("Josephus, 93-94'te Yakup'u 'Mesih denilen İsa'nın kardeşi' diye tanımlar; kısa, geçerken söylenmiş, övgüsüz.",
      cite("josephus-ant-20-200", "Kitap 20, 200. paragraf", "direct"), { id: "josephus-yakup" }),
    ev("Tacitus, y. 116'da Tiberius döneminde vali Pontius Pilatus tarafından idam edildiğini yazar; bağımsız ve açıkça küçümseyici bir Roma kaydıdır.",
      cite("tacitus-annales-15-44", "15. kitap, 44. bölüm", "direct"), { id: "tacitus-kaydi" }),
  ],
  counter_evidence: [
    ev("Anlatılar tam bağımsız değildir: Matta ve Luka Markos'u kaynak alır. 'Dört bağımsız tanık' ifadesi YANLIŞTIR.",
      cite("ehrman-2012-did-jesus-exist", "Kaynak bağımlılığı tartışması", "counter"), { id: "dort-tanik-yanlis" }),
    ev("Bütün erken kaynaklar taraf olan kaynaklardır; taraf olmayan iki kayıt olaydan 60-90 yıl sonradır.",
      cite("tacitus-on-jesus-wikipedia", "Tarihlendirme bölümü", "counter"), { id: "taraf-kaynaklar" }),
    ev("Yeni Ahit çalışmaları alanında kurumsal yanlılık riski gerçektir; bu kayıt onu Katolik/agnostik eşleşmesiyle karşılar ama tamamen ortadan kaldırmaz.",
      cite("meier-1991-marginal-jew-1", "Yöntem ve sınırlar", "context"), { id: "yanlilik-riski" }),
    ev("İdam yılı 30 mu 33 mü kesinleşmemiştir.",
      cite("tacitus-on-jesus-wikipedia", "Kronoloji", "counter"), { id: "yil-belirsiz" }),
    ev("Bu kayıtta iki standart eserin de tam metni okunmamıştır; künyeler ve tezler doğrulanmıştır.",
      cite("ehrman-2012-did-jesus-exist", "Kaynak erişim düzeyi", "context"), { id: "tam-metin-okunmadi" }),
  ],
  open_questions: [
    "Anlatılarda kaç ayrı bağımsız geleneğin izi sürülebilir? Alanda tartışmalı.",
    "İdam yılı 30 mu 33 mü?",
  ],
  checked: CHECKED, used_in: ["isa-tarihsellik"],
  review: { status: "draft", notes: "İki hakemli çıpa eklendi; Katolik/agnostik eşleşmesi yanlılık itirazına somut cevap. Tam metinler okunmadı." },
});

const tacitusK = finding({
  id: "tacitus-procurator-anakronizmi",
  claim: "Tacitus'un Pilatus'a yanlış unvan (procurator) vermesi, pasajın sonradan eklenmediğini gösteren bir kanıttır.",
  status: "established", confidence: "medium",
  topic: ["isa", "tacitus", "metin-elestirisi", "yontem"],
  subject: { site: "Annales elyazması geleneği", region: "Roma İmparatorluğu", modern_country: "çok uluslu" },
  period: { earliest: 116, latest: 1100, era_label: "Yazımdan Codex Mediceus'a", precision: "range", dating_method: ["paleography", "epigraphic", "textual"] },
  languages: ["Latince"], disciplines: ["metin-elestirisi", "filoloji", "epigrafi", "tarih"],
  people: [{ name: "Tacitus, Publius Cornelius", role: "editor", year: 116, lifespan: "y. 56-120" }],
  popular_claim: "Tacitus'un pasajı sonradan Hristiyanlarca eklenmiştir.",
  divergence:
    "Pasajın içindeki HATA, ekleme tezinin aleyhine çalışıyor. Tacitus Pilatus'u 'procurator' diye anıyor; Kayseriye yazıtı unvanın 'praefectus' olduğunu gösteriyor. Bir Roma arşiv kaydından kopyalansaydı doğru unvan yazılırdı. Yanlış unvan, yazarın kendi döneminin dilini kullandığını gösteriyor. İkinci iz: en eski elyazmasında sözcük 'chrestianos' yazılmış, sonradan düzeltilmiş - adı tam bilmeyen birinin yazımı.",
  divergence_type: ["kategori-hatasi"],
  sources: [tacitus, pilatusYazit, ehrman, wikiTacitus],
  evidence: [
    ev("Tacitus, Annales 15.44'te Pilatus'un unvanını 'procurator' olarak verir.",
      cite("tacitus-annales-15-44", "15. kitap, 44. bölüm", "direct"), { id: "procurator-unvani" }),
    ev("Kayseriye yazıtı Pilatus'un unvanının 'praefectus' olduğunu gösterir - farklı bir idari sınıf.",
      cite("pilatus-yaziti-caesarea", "Yazıt metni", "direct"), { id: "praefectus-yaziti" }),
    ev("Pasajın üslubu Hristiyanlara açıkça düşmancadır; bir Hristiyan eklemesinden beklenmez.",
      cite("tacitus-on-jesus-wikipedia", "Üslup ve sahihlik bölümü", "direct"), { id: "dusmanca-uslup" }),
    ev("Pasajın sahihliği ve bağımsız bir Roma kaydı olarak değeri alanda geniş kabul görür.",
      cite("ehrman-2012-did-jesus-exist", "Hristiyan olmayan kaynaklar bölümü", "direct"), { id: "sahihlik-kabulu" }),
  ],
  counter_evidence: [
    ev("Tacitus'un anakronizmi kasıtsız bir kolaylık da olabilir; Romalı yazarlar geçmiş dönem unvanlarını kendi dönemlerinin terimleriyle vermeye eğilimliydi.",
      cite("tacitus-on-jesus-wikipedia", "Anakronizm tartışması", "counter"), { id: "kolaylik-ihtimali" }),
    ev("Tacitus'un bilgisinin kaynağı belirsizdir: Roma arşivi mi, kendi döneminde bilinenler mi? Büyük olasılıkla ikincisi - bu durumda pasaj bağımsız kanıt değil, 2. yüzyıl başında bilinenin kaydıdır.",
      cite("ehrman-2012-did-jesus-exist", "Tacitus değerlendirmesi", "counter"), { id: "kaynak-belirsiz" }),
    ev("Elimizdeki metin tek bir elyazması koluna dayanır.",
      cite("tacitus-on-jesus-wikipedia", "Elyazması geleneği", "counter"), { id: "tek-elyazmasi" }),
  ],
  open_questions: ["Tacitus bilgiyi nereden aldı? Roma arşivi olduğuna dair kanıt yok."],
  checked: CHECKED, used_in: ["isa-tarihsellik"],
  review: { status: "draft", notes: "Hakemli çıpa eklendi; tam metin okunmadı." },
});

const pilatusK = finding({
  id: "pilatus-yaziti-kayseriye",
  claim: "Pontius Pilatus'un varlığını ve unvanını doğrudan belgeleyen tek çağdaş fiziksel kanıt, 1961'de Kayseriye'de bulunan taş yazıttır.",
  status: "established", confidence: "high",
  topic: ["isa", "roma", "epigrafi", "yahudiye"],
  subject: { site: "Caesarea Maritima (Kayseriye)", site_native: "Καισάρεια", region: "Yahudiye eyaleti, Akdeniz kıyısı", modern_country: "İsrail", coordinates: { lat: 32.5, lon: 34.8917 } },
  period: { earliest: 26, latest: 36, era_label: "Pilatus'un valiliği, Tiberius dönemi", precision: "range", dating_method: ["epigraphic", "stratigraphy", "historical-record"] },
  languages: ["Latince"], disciplines: ["epigrafi", "arkeoloji", "tarih"],
  people: [{ name: "Frova, Antonio", role: "discoverer", affiliation: "Milano Üniversitesi İtalyan heyeti", year: 1961 }],
  popular_claim: "Pontius Pilatus yalnızca İncillerden bilinen, tarihsel varlığı belirsiz bir figürdür.",
  divergence:
    "Yazıt, İncil metinlerinden TAMAMEN BAĞIMSIZ bir fiziksel kanıttır ve Pilatus'un hem varlığını hem unvanını doğrudan belgeler. Ayrıca metinlerin verdiği 'procurator' unvanının yanlış, doğrusunun 'praefectus' olduğunu göstererek kaynak eleştirisinde ikinci bir iş yapar.",
  divergence_type: ["guncellenmemis"],
  sources: [pilatusYazit, ehrman, wikiPilate],
  evidence: [
    ev("Yazıt, Kayseriye tiyatrosunda ikincil kullanımda bir basamak taşı olarak bulundu - özgün bağlamından çıkarılıp sonradan yeniden kullanılmış.",
      cite("pilate-stone-wikipedia", "Buluntu bağlamı", "direct"), { id: "ikincil-kullanim" }),
    ev("Korunan metin Tiberius'a adanmış bir yapıyı ve Pilatus'un adını ve unvanını içerir; unvan 'praefectus' okunur.",
      cite("pilatus-yaziti-caesarea", "Yazıt metni", "direct"), { id: "yazit-metni" }),
    ev("Pilatus'un tarihselliği, tarihsel İsa literatüründe tartışma konusu değildir.",
      cite("ehrman-2012-did-jesus-exist", "Arka plan bölümü", "context"), { id: "tartisma-disi" }),
  ],
  counter_evidence: [
    ev("Yazıt kırık ve eksiktir; okumanın bazı bölümleri tamamlamaya dayanır.",
      cite("pilate-stone-wikipedia", "Okuma ve tamamlama", "counter"), { id: "kirik-yazit" }),
    ev("İkincil kullanımda bulunduğu için özgün konumu ve tam tarihi kesin değildir.",
      cite("pilate-stone-wikipedia", "Buluntu bağlamı", "counter"), { id: "ozgun-konum-belirsiz" }),
    ev("Yazıtın epigrafik yayını bu kayıtta doğrudan görülmemiştir; ara kaynak üzerinden kullanılmıştır.",
      cite("pilate-stone-wikipedia", "Kaynak düzeyi", "context"), { id: "epigrafik-yayin-gorulmedi" }),
  ],
  checked: CHECKED, used_in: ["isa-tarihsellik"],
  review: { status: "draft", notes: "Birincil epigrafik yayın hâlâ görülmedi; ara kaynak düzeyinde." },
});

/* --- uygula -------------------------------------------------------- */

const hedef = {
  "data/findings/roma.json": [cadi, isaEsik, tacitusK, pilatusK],
};

for (const [PATH, kayitlar] of Object.entries(hedef)) {
  const list = JSON.parse(readFileSync(PATH, "utf8"));
  for (const r of kayitlar) {
    const i = list.findIndex((x) => x.id === r.id);
    if (i === -1) { console.error("bulunamadı:", r.id); process.exit(1); }
    const onceki = list[i].schema_version ?? 1;
    list[i] = r;
    console.log(`  v${onceki} -> v2  ${r.id}`);
  }
  writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
  console.log(`\n${PATH}: ${list.length} kayıt, v2: ${list.filter((r) => r.schema_version === 2).length}`);
}
