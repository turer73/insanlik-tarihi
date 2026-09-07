#!/usr/bin/env node
// "Mit ve Sicil" kümesi: 8 kayıt v1 -> v2, bilim tarihi literatürüyle.
//
// NEDEN TÜRKÇE DEĞİL: bu kümenin konusu Avrupa bilim tarihi yazımı.
// Doğal kaynak dili İngilizce. Kapadokya'da işleyen hamle burada değil,
// KONUYA GÖRE kaynak seçmek geçerli.
//
// Küme, veri tabanının kaynak kalitesi açısından en zayıf yeriydi:
// 8 kaydın HİÇBİRİNDE hakemli kaynak yoktu.
//
// Doğrulanan iki çıpa:
//   Numbers, R. L. (ed.) (2009). Galileo Goes to Jail and Other Myths
//     about Science and Religion. Harvard University Press.
//     ISBN 9780674033276. 25 tarihçi denemesi. Mit 3 = Ortaçağ düz dünya.
//   Finocchiaro, M. A. (ed./çev.) (1989). The Galileo Affair: A
//     Documentary History. University of California Press.
//     ISBN 9780520066625. Yargılama belgelerinin standart edisyonu.
//
// SINIR: iki kitabın da künyesi doğrulandı, TAM METİNLERİ OKUNMADI.
// Locator'lar bölüm/kapsam düzeyindedir. Index, Justinianus, sansür
// maliyeti ve cadı avı kayıtları için yeni çıpa BULUNAMADI; bu kayıtlar
// v2'ye taşındı ama kaynak zayıflıkları açıkça işaretlendi.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/roma.json";
const CHECKED = "2026-09-07";

/* --- kaynaklar ----------------------------------------------------- */

const numbers = source("numbers-2009-galileo-goes-to-jail", {
  tier: "peer-reviewed",
  type: "book",
  authors: ["Numbers, Ronald L. (ed.)"],
  year: 2009,
  title: "Galileo Goes to Jail and Other Myths about Science and Religion",
  publisher: "Harvard University Press",
  isbn: "9780674033276",
  pages: "xiii+302",
  language: "en",
  accessed: CHECKED,
  note: "Bilim tarihçilerinin yazdığı 25 denemelik derleme; her mite yaklaşık dokuz sayfa. Isis ve Journal of Ecclesiastical History'de değerlendirildi. Künye doğrulandı, TAM METİN OKUNMADI.",
});

const finocchiaro = source("finocchiaro-1989-galileo-affair", {
  tier: "peer-reviewed",
  type: "edition",
  authors: ["Finocchiaro, Maurice A. (ed. ve çev.)"],
  year: 1989,
  title: "The Galileo Affair: A Documentary History",
  container: "California Studies in the History of Science 5",
  publisher: "University of California Press",
  isbn: "9780520066625",
  pages: "xvi+382",
  language: "en",
  accessed: CHECKED,
  note: "Galileo yargılama belgelerinin standart İngilizce edisyonu. Künye doğrulandı, tam metin okunmadı.",
});

const draper = source("draper-1874-conflict", {
  tier: "popular", type: "book", authors: ["Draper, John William"], year: 1874,
  title: "History of the Conflict between Religion and Science",
  publisher: "D. Appleton", url: "https://archive.org/details/historyofconflic00drap", language: "en",
  note: "KANIT DEĞİL - incelenen olgunun kendisi. Çatışma tezinin kurucu metinlerinden.",
});

const white = source("white-1896-warfare", {
  tier: "popular", type: "book", authors: ["White, Andrew Dickson"], year: 1896,
  title: "A History of the Warfare of Science with Theology in Christendom",
  publisher: "D. Appleton", url: "https://archive.org/details/historyofwarfare01whit", language: "en",
  note: "KANIT DEĞİL - incelenen olgunun kendisi.",
});

const wikiConflict = source("conflict-thesis-wikipedia", {
  tier: "institutional", type: "webpage", title: "Conflict thesis",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/Conflict_thesis",
  language: "en", accessed: CHECKED, note: "Ara kaynak; alanın uzlaşı durumunun özeti.",
});

const wikiIndex = source("index-librorum-wikipedia", {
  tier: "institutional", type: "webpage", title: "Index Librorum Prohibitorum",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/Index_Librorum_Prohibitorum",
  language: "en", accessed: CHECKED, note: "Ara kaynak. Bu kayıt için hakemli çıpa BULUNAMADI.",
});

const indexPrimary = source("index-1559-edition", {
  tier: "primary", type: "edition", year: 1559, title: "Index Librorum Prohibitorum",
  publisher: "Sacra Congregatio Indicis", language: "la",
  note: "Listenin kendisi. 1559'da kuruldu, 1966'da kaldırıldı.",
});

const codexJust = source("codex-justinianus-1-11-10", {
  tier: "primary", type: "edition", year: 529, title: "Codex Justinianus 1.11.10 (pagan öğretim yasağı)",
  publisher: "—", language: "la", note: "Düzenlemenin hukuk metni.",
});

const wikiAcademy = source("platonic-academy-wikipedia", {
  tier: "institutional", type: "webpage", title: "Platonic Academy",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/Platonic_Academy",
  language: "en", accessed: CHECKED, note: "Ara kaynak. Hakemli geç antikçağ çıpası BULUNAMADI.",
});

const descartes = source("descartes-mersenne-1633", {
  tier: "primary", type: "manuscript", authors: ["Descartes, René"], year: 1633,
  title: "Mersenne'e mektuplar — Le Monde'un yayımdan çekilmesi",
  publisher: "—", language: "fr",
  note: "Öz-sansürün belgeli tek birinci sınıf vakası.",
});

const wikiWorld = source("descartes-le-monde-wikipedia", {
  tier: "institutional", type: "webpage", title: "The World (Descartes)",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/The_World_(Descartes)",
  language: "en", accessed: CHECKED, note: "Ara kaynak.",
});

const wikiWitch = source("witch-trials-wikipedia", {
  tier: "institutional", type: "webpage", title: "Witch trials in the early modern period",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/Witch_trials_in_the_early_modern_period",
  language: "en", accessed: CHECKED,
  note: "Ara kaynak. Hakemli çıpa (ör. Levack) BULUNAMADI/eklenmedi; kaydın başlıca zayıflığı.",
});

const wikiFlat = source("flat-earth-myth-wikipedia", {
  tier: "institutional", type: "webpage", title: "Myth of the flat Earth",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/Myth_of_the_flat_Earth",
  language: "en", accessed: CHECKED, note: "Ara kaynak.",
});

const wikiGalileo = source("galileo-affair-wikipedia", {
  tier: "institutional", type: "webpage", title: "Galileo affair",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/Galileo_affair",
  language: "en", accessed: CHECKED, note: "Ara kaynak.",
});

const wikiBruno = source("giordano-bruno-wikipedia", {
  tier: "institutional", type: "webpage", title: "Giordano Bruno",
  institution: "Wikipedia", url: "https://en.wikipedia.org/wiki/Giordano_Bruno",
  language: "en", accessed: CHECKED, note: "Ara kaynak.",
});

const famousTrials = source("famous-trials-bruno", {
  tier: "institutional", type: "webpage", title: "The Trials of Giordano Bruno (1592-1600)",
  institution: "Famous Trials (University of Missouri-Kansas City)",
  url: "https://www.famous-trials.com/bruno/261-home", language: "en", accessed: CHECKED,
  note: "Yargılama belgelerinin derlemesi.",
});

/* --- kayıtlar ------------------------------------------------------- */

const kayitlar = [
  finding({
    id: "catisma-tezi-terk-edildi",
    claim: "Bilim ile dinin doğaları gereği ve sürekli çatıştığı tezi (Draper-White çatışma tezi) bilim tarihi alanında terk edilmiştir.",
    status: "established", confidence: "high",
    topic: ["tarih-yazimi", "bilim-tarihi", "kilise", "yontem"],
    subject: { site: "Bilim tarihi yazımı", region: "Avrupa ve Kuzey Amerika akademisi", modern_country: "çok uluslu" },
    period: { earliest: 1874, latest: 2026, era_label: "Tezin üretiminden reddine", precision: "range", dating_method: ["historical-record", "textual"] },
    languages: ["İngilizce"], disciplines: ["bilim-tarihi", "tarih"],
    people: [
      { name: "Draper, John William", role: "proposer", year: 1874, lifespan: "1811-1882" },
      { name: "White, Andrew Dickson", role: "proposer", affiliation: "Cornell University", year: 1896, lifespan: "1832-1918" },
      { name: "Numbers, Ronald L.", role: "refuter", affiliation: "University of Wisconsin-Madison", year: 2009 },
    ],
    popular_claim: "Kilise bilimi bastırdı ve bin yıllık bir Karanlık Çağ yarattı; bilim ile din tarih boyunca savaş hâlindeydi.",
    divergence: "Anlatının belirli yazarları ve tarihleri var: Draper (1874) ve White (1896). 20. yüzyıl bilim tarihçileri kanıtları denetledi ve önemli bölümünün yanlış yorumlandığını ya da uydurulduğunu gösterdi. 2009'da Harvard University Press, alanın önde gelen tarihçilerinin yazdığı 25 denemelik bir derlemeyle mitleri tek tek ele aldı - bu, reddin kurumsallaştığının göstergesidir. DİKKAT: tezin çökmesi somut olayların olmadığı anlamına GELMEZ; çöken kısım çatışmanın yapısal, sürekli ve kaçınılmaz olduğu iddiasıdır.",
    divergence_type: ["ideolojik-secim", "guncellenmemis"],
    sources: [numbers, draper, white, wikiConflict],
    evidence: [
      ev("Bilim tarihçilerinin yazdığı 25 denemelik bir Harvard University Press derlemesi, bilim-din çatışması mitlerini tek tek ele alır ve her birine yaklaşık dokuz sayfa ayırır.",
        cite("numbers-2009-galileo-goes-to-jail", "Derlemenin kapsamı ve yapısı", "direct"), { id: "harvard-derlemesi" }),
      ev("Anlatının kurucu metinleri belirlidir: Draper 1874 ve White 1896.",
        cite("draper-1874-conflict", "Eserin kendisi", "claim-origin"), { id: "kurucu-metinler" }),
      ev("Çatışma tezi bugün bilim tarihi alanında terk edilmiş bir tezdir; ders kitaplarında ve internette ise hâlâ yaşamaktadır.",
        cite("conflict-thesis-wikipedia", "Alanın konumu bölümü", "direct"), { id: "alan-konumu" }),
    ],
    counter_evidence: [
      ev("Tezin reddi, belirli tarihlerde belirli kurumlarca yapılan sansür ve yargılamaları ortadan kaldırmaz - Index, Galileo ve Bruno ayrı kayıtlarda tutulmaktadır.",
        cite("numbers-2009-galileo-goes-to-jail", "Derlemenin çerçevesi", "context"), { id: "sicil-ayri" }),
      ev("Savunmacı literatürde ters yönde bir eğilim var: 'mit çürütüldü' diyerek belgelenmiş sicili de aynı torbaya atmak.",
        cite("conflict-thesis-wikipedia", "Eleştiriler bölümü", "context"), { id: "ters-egilim" }),
      ev("Bu kayıtta derlemenin tam metni okunmamıştır; künye ve kapsam doğrulanmış, tekil deneme argümanları incelenmemiştir.",
        cite("numbers-2009-galileo-goes-to-jail", "Kaynak erişim düzeyi", "context"), { id: "tam-metin-okunmadi" }),
    ],
    open_questions: ["Popüler anlatı neden akademik reddiyeye rağmen bu kadar dayanıklı?"],
    checked: CHECKED, used_in: ["mit-ve-sicil"],
    review: { status: "draft", notes: "Hakemli çıpa eklendi (Numbers 2009); tam metin okunmadı." },
  }),

  finding({
    id: "duz-dunya-ortacag-miti",
    claim: "Ortaçağ Avrupası'nda eğitimli çevreler dünyanın düz olduğuna inanıyordu.",
    status: "refuted", confidence: "high",
    topic: ["tarih-yazimi", "bilim-tarihi", "kilise"],
    subject: { site: "Ortaçağ Avrupası", region: "Batı Avrupa", modern_country: "çok uluslu" },
    period: { earliest: 500, latest: 1828, era_label: "Ortaçağ'dan mitin üretildiği tarihe", precision: "range", dating_method: ["textual", "historical-record"] },
    languages: ["Latince", "İngilizce"], disciplines: ["bilim-tarihi", "tarih", "filoloji"],
    people: [{ name: "Irving, Washington", role: "proposer", year: 1828, lifespan: "1783-1859" }],
    popular_claim: "Kolomb, dünyanın yuvarlak olduğunu düz olduğuna inanan din adamlarına karşı savundu.",
    divergence: "Dünyanın küre olduğu Ortaçağ'da eğitimli çevrelerde STANDART BİLGİYDİ. Kolomb ile uzmanlar arasındaki gerçek tartışma dünyanın ŞEKLİ değil ÇEVRESİNİN UZUNLUĞUydu - ve o tartışmada haklı olan Kolomb değil uzmanlardı. Bu mit, Harvard University Press derlemesinde AYRI BİR BÖLÜM olarak ele alınacak kadar yerleşiktir: derlemenin üçüncü miti, Ortaçağ Hristiyanlarının dünyanın düz olduğunu öğrettiği iddiasıdır.",
    divergence_type: ["medya-abartisi", "ideolojik-secim"],
    sources: [numbers, wikiFlat],
    evidence: [
      ev("Harvard University Press derlemesinin üçüncü miti, Ortaçağ Hristiyanlarının dünyanın düz olduğunu öğrettiği iddiasını ele alır ve çürütür.",
        cite("numbers-2009-galileo-goes-to-jail", "Mit 3", "direct"), { id: "mit-3" }),
      ev("Ortaçağ ders metinlerinde küre biçimi standart olarak yer alır; Kolomb'un hesabı Dünya'nın çevresini olduğundan çok küçük gösteriyordu.",
        cite("flat-earth-myth-wikipedia", "Ortaçağ bilgisi bölümü", "direct"), { id: "kure-standart" }),
      ev("Düz dünya sahnesinin bilinen popüler kaynağı 1828 tarihli edebî bir Kolomb biyografisidir.",
        cite("flat-earth-myth-wikipedia", "Mitin kökeni bölümü", "direct"), { id: "1828-biyografi" }),
    ],
    counter_evidence: [
      ev("Bazı geç antik yazarlarda düz dünya görüşü savunulmuştur; ancak azınlıkta kalmış ve Ortaçağ eğitim geleneğine hâkim olmamıştır.",
        cite("flat-earth-myth-wikipedia", "İstisnalar bölümü", "counter"), { id: "gec-antik-istisnalar" }),
      ev("Derlemenin ilgili bölümü bu kayıtta okunmamıştır; mit numarası ve konusu doğrulanmış, argüman ayrıntısı incelenmemiştir.",
        cite("numbers-2009-galileo-goes-to-jail", "Kaynak erişim düzeyi", "context"), { id: "bolum-okunmadi" }),
    ],
    checked: CHECKED, used_in: ["mit-ve-sicil"],
    review: { status: "draft", notes: "Hakemli çıpa eklendi; ilgili bölüm okunmadı." },
  }),

  finding({
    id: "galileo-1633-mahkumiyeti",
    claim: "Galileo 1633'te 'ağır sapkınlık şüphesi' ile mahkûm edildi ve ölümüne kadar ev hapsinde tutuldu; kurumsal düzeltme 1992'yi buldu.",
    status: "established", confidence: "high",
    topic: ["kilise", "sansur", "bilim-tarihi", "astronomi"],
    subject: { site: "Roma", region: "Papalık Devleti", modern_country: "İtalya", coordinates: { lat: 41.9028, lon: 12.4964 } },
    period: { earliest: 1616, latest: 1992, era_label: "İlk uyarıdan resmî kabule", precision: "exact", dating_method: ["historical-record", "textual"] },
    languages: ["İtalyanca", "Latince"], disciplines: ["bilim-tarihi", "tarih", "astronomi", "hukuk"],
    people: [
      { name: "Galilei, Galileo", role: "proposer", year: 1633, lifespan: "1564-1642" },
      { name: "Finocchiaro, Maurice A.", role: "editor", year: 1989 },
    ],
    popular_claim: "Galileo bilimsel gerçeği söylediği için işkence gördü ve zindana atıldı.",
    divergence: "Olay gerçek ama ayrıntılar sık yanlış aktarılır: işkence UYGULANMADI, işkence tehdidi usul gereği okundu; zindan değil EV HAPSİ verildi. Bunlar hafifletici değil DÜZELTİCİ ayrıntılardır - sicilin ağırlığı zaten belgelerin kendisindedir ve o belgeler standart bir edisyonda toplu hâlde yayımlanmıştır. Bu, kaydın en az tartışmalı kalemi olmasının sebebidir: iddia yorum değil, belge.",
    divergence_type: ["medya-abartisi"],
    sources: [finocchiaro, numbers, wikiGalileo],
    evidence: [
      ev("Yargılamanın belgeleri, California Studies in the History of Science dizisinde standart bir edisyon olarak derlenip çevrilmiştir.",
        cite("finocchiaro-1989-galileo-affair", "Edisyonun kapsamı", "direct"), { id: "belge-edisyonu" }),
      ev("1633 kararı 'ağır sapkınlık şüphesi' hükmünü içerir; Galileo görüşünü yeminle reddetmeye zorlandı ve 1642'deki ölümüne kadar ev hapsinde kaldı.",
        cite("galileo-affair-wikipedia", "Yargılama ve karar bölümü", "direct"), { id: "karar-ve-ev-hapsi" }),
      ev("Diyalog Index'e alındı ve 1835'e kadar listede kaldı; kurumun yargılamadaki hatayı resmen kabulü 1992'dir.",
        cite("galileo-affair-wikipedia", "Sonrası bölümü", "direct"), { id: "index-ve-1992" }),
      ev("Galileo miti, bilim tarihçilerinin mit derlemesinde başlık düzeyinde ele alınacak kadar yerleşiktir.",
        cite("numbers-2009-galileo-goes-to-jail", "Derlemenin başlığı ve kapsamı", "context"), { id: "mit-derlemesinde" }),
    ],
    counter_evidence: [
      ev("Yargılamanın arka planında kişisel ve siyasi etkenler de vardı; salt 'bilim karşıtlığı' okuması olayı basitleştirir.",
        cite("galileo-affair-wikipedia", "Bağlam bölümü", "counter"), { id: "siyasi-etkenler" }),
      ev("1616'daki ilk uyarının içeriği ve Galileo'nun onu ihlal edip etmediği tarihçiler arasında tartışılmıştır.",
        cite("finocchiaro-1989-galileo-affair", "1616 belgeleri", "counter"), { id: "1616-tartismasi" }),
      ev("Bu kayıtta belge edisyonunun tam metni okunmamıştır; künye ve kapsam doğrulanmıştır.",
        cite("finocchiaro-1989-galileo-affair", "Kaynak erişim düzeyi", "context"), { id: "edisyon-okunmadi" }),
    ],
    checked: CHECKED, used_in: ["mit-ve-sicil"],
    review: { status: "draft", notes: "Belge edisyonu çıpa olarak bağlandı; tam metin okunmadı." },
  }),

  finding({
    id: "bruno-1600-gerekce",
    claim: "Giordano Bruno 1600'de kozmolojik görüşleri yüzünden yakıldı.",
    status: "contested", confidence: "medium",
    topic: ["kilise", "sansur", "bilim-tarihi", "felsefe"],
    subject: { site: "Campo de' Fiori, Roma", region: "Papalık Devleti", modern_country: "İtalya", coordinates: { lat: 41.8955, lon: 12.4723 } },
    period: { earliest: 1592, latest: 1600, era_label: "Tutuklanmadan infaza", precision: "exact", dating_method: ["historical-record", "textual"] },
    languages: ["İtalyanca", "Latince"], disciplines: ["bilim-tarihi", "tarih", "felsefe"],
    people: [{ name: "Bruno, Giordano", role: "proposer", year: 1600, lifespan: "1548-1600" }],
    popular_claim: "Bruno, sonsuz evren ve çok sayıda dünya fikri yüzünden yakılan ilk bilim şehididir.",
    divergence: "İki uç da kaynakların ötesine geçiyor. 'Bilim için yakıldı' doğru değil: suçlamaların ağırlığı teolojikti - Üçleme, İsa'nın tanrılığı, ekmek-şarap öğretisi, büyü. Ama 'kozmolojinin hiç ilgisi yoktu' da doğru değil: çokluk-dünyalar görüşü suçlama listesinde yer alıyor. Bruno bir bilim insanı değil, Yeni-Platoncu bir filozoftu. Kesin olan tek şey: bir insan düşünceleri yüzünden sekiz yıl hapsedilip diri diri yakıldı.",
    divergence_type: ["medya-abartisi", "ideolojik-secim"],
    sources: [famousTrials, wikiBruno, numbers],
    evidence: [
      ev("1592'de tutuklandı, sekiz yıl hapiste tutuldu, 1600'de Campo de' Fiori'de diri diri yakıldı.",
        cite("giordano-bruno-wikipedia", "Yargılama ve infaz bölümü", "direct"), { id: "tutuklama-infaz" }),
      ev("Suçlamalar arasında sonsuz evren ve çok sayıda dünya görüşü yer alır; ağırlık ise teolojiktir - Üçleme, İsa'nın tanrılığı, ekmek-şarap öğretisi, büyü.",
        cite("famous-trials-bruno", "Suçlama listesi", "direct"), { id: "suclama-listesi" }),
      ev("Bilim-din mitleri literatüründe Bruno vakası, 'bilim şehidi' çerçevesinin sınandığı örneklerden biridir.",
        cite("numbers-2009-galileo-goes-to-jail", "Derlemenin kapsamı", "context"), { id: "mit-literaturunde" }),
    ],
    counter_evidence: [
      ev("Yargılamanın TAM TUTANAKLARI KAYIP; elimizde özet ve dolaylı kayıtlar var. Gerekçe tartışmasının çözülememesinin asıl sebebi budur.",
        cite("famous-trials-bruno", "Belge durumu", "counter"), { id: "tutanaklar-kayip" }),
      ev("Tarihçiler kozmolojinin karardaki ağırlığı konusunda anlaşamıyor; alanda süren bir tartışmadır.",
        cite("giordano-bruno-wikipedia", "Tarihyazımı bölümü", "counter"), { id: "alan-anlasamiyor" }),
      ev("Bu kayıtta derlemede Bruno'ya ayrılmış bir bölüm olup olmadığı DOĞRULANMADI; kaynak yalnızca genel kapsam için kullanıldı.",
        cite("numbers-2009-galileo-goes-to-jail", "Kaynak erişim düzeyi", "context"), { id: "bruno-bolumu-dogrulanmadi" }),
    ],
    open_questions: ["Kozmolojik suçlamaların karardaki ağırlığı neydi? Tam tutanaklar olmadan çözülemiyor."],
    checked: CHECKED, used_in: ["mit-ve-sicil"],
    review: { status: "draft", notes: "Numbers derlemesinde Bruno bölümü doğrulanmadı; genel kapsam atfı olarak kullanıldı." },
  }),

  finding({
    id: "index-librorum-407-yil",
    claim: "Katolik Kilisesi'nin resmî yasaklı kitaplar listesi Index Librorum Prohibitorum 1559'dan 1966'ya, yani 407 yıl yürürlükte kaldı.",
    status: "established", confidence: "high",
    topic: ["kilise", "sansur", "bilim-tarihi", "kitap-tarihi"],
    subject: { site: "Roma / Katolik Kilisesi", region: "Katolik dünyası", modern_country: "çok uluslu" },
    period: { earliest: 1559, latest: 1966, era_label: "Karşı Reform'dan II. Vatikan sonrasına", precision: "exact", dating_method: ["historical-record", "textual"] },
    languages: ["Latince", "İtalyanca"], disciplines: ["tarih", "bilim-tarihi", "hukuk"],
    popular_claim: "Kilise sansürü Ortaçağ'a ait, uzak ve kapanmış bir konudur.",
    divergence: "Index bir Ortaçağ kurumu DEĞİLDİR: 1559'da, matbaanın yaygınlaşmasından sonra, Karşı Reform bağlamında kuruldu ve 1966'da kaldırıldı - yaşayan insanların hafızasında bitti. Sansürün asıl kurumsal biçimi Ortaçağ'da değil ERKEN MODERN dönemdedir. 'Ortaçağ karanlığı' çerçevesi burada da yanlış dönemi gösteriyor.",
    divergence_type: ["guncellenmemis", "kategori-hatasi"],
    sources: [indexPrimary, wikiIndex],
    evidence: [
      ev("Index 1559'da kuruldu ve 1966'da kaldırıldı: 407 yıl.",
        cite("index-1559-edition", "Listenin kuruluşu ve kaldırılışı", "direct"), { id: "407-yil" }),
      ev("Kopernik'in De revolutionibus'u 1616'da 'düzeltilene kadar' askıya alındı; Galileo'nun Diyalog'u 1633'te listeye girdi; ikisi de 1835'te çıktı.",
        cite("index-librorum-wikipedia", "Kayda değer yasaklar bölümü", "direct"), { id: "kopernik-galileo" }),
    ],
    counter_evidence: [
      ev("Index'in fiilî uygulanabilirliği bölgeden bölgeye ve dönemden döneme büyük farklılık gösterdi; her yerde eşit işleyen bir yasak değildi.",
        cite("index-librorum-wikipedia", "Uygulama bölümü", "counter"), { id: "uygulama-degisken" }),
      ev("Yasaklı listede olmak eserin okunmadığı anlamına gelmez; yasaklı kitapların dolaşımı belgelidir.",
        cite("index-librorum-wikipedia", "Etki bölümü", "counter"), { id: "dolasim-devam" }),
      ev("BU KAYIT İÇİN HAKEMLİ ÇIPA BULUNAMADI. Tarihler ara kaynaktan doğrulanmıştır; sansür tarihi literatürüyle desteklenmelidir.",
        cite("index-librorum-wikipedia", "Kaynak düzeyi", "context"), { id: "hakemli-cipa-yok" }),
    ],
    open_questions: ["Index'in fiilî etkisini ölçen hakemli çalışma var mı? Bu kayıtta bulunamadı."],
    checked: CHECKED, used_in: ["mit-ve-sicil"],
    review: { status: "draft", notes: "Hakemli çıpa YOK; ara kaynak düzeyinde kalmaya devam ediyor." },
  }),

  finding({
    id: "justinianus-529-atina-okulu",
    claim: "529'da Atina'daki Yeni-Platoncu felsefe okulunun kapatılması antik düşüncenin sonunu getirdi.",
    status: "contested", confidence: "medium",
    topic: ["kilise", "roma", "felsefe", "sansur"],
    subject: { site: "Atina - Yeni-Platoncu okul", region: "Yunanistan, Doğu Roma", modern_country: "Yunanistan", coordinates: { lat: 37.9838, lon: 23.7275 } },
    period: { earliest: 529, latest: 535, era_label: "I. Justinianus dönemi", precision: "exact", dating_method: ["historical-record", "textual"] },
    languages: ["Grekçe", "Latince"], disciplines: ["tarih", "filoloji", "felsefe"],
    people: [
      { name: "Justinianus I", role: "proposer", year: 529, lifespan: "482-565" },
      { name: "Damaskios", role: "critic", year: 529, lifespan: "y. 458-538" },
    ],
    popular_claim: "Justinianus 529'da Atina Akademisi'ni kapattı ve bin yıllık antik felsefe geleneği o gün sona erdi.",
    divergence: "Bir kesinti oldu ama 'antik düşüncenin sonu' çerçevesi abartılı. Düzenleme paganların ders vermesini yasakladı ve okul kapandı; hocaları Pers sarayına gitti. Ancak bir kısmı birkaç yıl sonra, bir antlaşma maddesiyle korunarak geri döndü. Ayrıca kapatılan kurum Platon'un Akademisi'nin kesintisiz devamı DEĞİLDİR; özdeşlik popüler anlatının kurduğu bir bağdır.",
    divergence_type: ["medya-abartisi", "guncellenmemis"],
    sources: [codexJust, wikiAcademy],
    evidence: [
      ev("529'da çıkarılan düzenleme paganların ders vermesini yasakladı.",
        cite("codex-justinianus-1-11-10", "Düzenleme metni", "direct"), { id: "yasak-metni" }),
      ev("Atina'daki okul kapandı; Damaskios ve çevresi Pers sarayına gitti.",
        cite("platonic-academy-wikipedia", "529 ve sonrası bölümü", "direct"), { id: "okul-kapandi" }),
    ],
    counter_evidence: [
      ev("Filozofların bir kısmı birkaç yıl sonra, bir antlaşma maddesiyle korunarak geri döndü.",
        cite("platonic-academy-wikipedia", "529 ve sonrası bölümü", "counter"), { id: "geri-donus" }),
      ev("Kapatılan kurumun Platon'un Akademisi ile kurumsal sürekliliği yoktur; okulun o tarihte zaten zayıfladığı da savunulur.",
        cite("platonic-academy-wikipedia", "Süreklilik tartışması", "counter"), { id: "sureklilik-yok" }),
      ev("BU KAYIT İÇİN HAKEMLİ GEÇ ANTİKÇAĞ ÇIPASI BULUNAMADI; ara kaynak düzeyinde kalmaktadır.",
        cite("platonic-academy-wikipedia", "Kaynak düzeyi", "context"), { id: "hakemli-cipa-yok" }),
    ],
    open_questions: ["Kapanma ne kadar tam ve ne kadar kalıcıydı? Kaynaklar yeterli değil."],
    checked: CHECKED, used_in: ["mit-ve-sicil"],
    review: { status: "draft", notes: "Hakemli çıpa YOK." },
  }),

  finding({
    id: "sansurun-toplam-maliyeti",
    claim: "Kurumsal sansürün bilim ve düşünce üzerindeki toplam maliyeti hesaplanabilir.",
    status: "unmeasurable", confidence: "high",
    topic: ["kilise", "sansur", "yontem", "bilim-tarihi"],
    subject: { site: "Avrupa", region: "Katolik ve Protestan Avrupa", modern_country: "çok uluslu" },
    period: { earliest: 1559, latest: 1966, era_label: "Index dönemi", precision: "range", dating_method: ["none", "historical-record"] },
    languages: ["Latince", "Fransızca"], disciplines: ["bilim-tarihi", "tarih"],
    people: [{ name: "Descartes, René", role: "analyst", year: 1633, lifespan: "1596-1650" }],
    popular_claim: "Kilise sansürü bilimi X yıl geriletti / hiç geriletmedi.",
    divergence: "İki iddia da ölçülemez bir şey hakkında sayı veriyor. Yasaklanan kitapları ve yargılamaları SAYABİLİRİZ. Sayamadığımız şey, yasaklanacağı bilindiği için HİÇ YAZILMAYANLAR - tanımı gereği kayıt bırakmayan bir kayıp. Bu, 'bilinmiyor' değil 'ölçülemez' kategorisidir; yöntem yapısal olarak cevap veremez.",
    divergence_type: ["kategori-hatasi"],
    sources: [descartes, wikiWorld],
    evidence: [
      ev("Descartes, Galileo'nun 1633 mahkûmiyetini duyduğunda tamamlamak üzere olduğu evren kitabını yayımlamaktan vazgeçti ve bunu mektuplarında açıkça yazdı; eser sağlığında yayımlanmadı.",
        cite("descartes-mersenne-1633", "Mersenne'e mektuplar, 1633", "direct"), { id: "descartes-cekilmesi" }),
      ev("Bu tek vaka, korkunun birinci sınıf bir düşünürü susturabildiğini kanıtlar - ama kaç kez olduğunu vermez.",
        cite("descartes-le-monde-wikipedia", "Yayım tarihçesi", "inference"), { id: "mekanizma-kanitli" }),
    ],
    counter_evidence: [
      ev("Tek vakadan genelleme yapılamaz; Descartes'ın kararında başka etkenler de olmuş olabilir.",
        cite("descartes-le-monde-wikipedia", "Bağlam", "counter"), { id: "tek-vaka" }),
      ev("Yasaklı kitapların yine de dolaştığı ve okunduğu belgelidir; sansürün etkinliği her yerde aynı değildi.",
        cite("descartes-le-monde-wikipedia", "Dönem bağlamı", "counter"), { id: "sansur-etkinligi" }),
    ],
    open_questions: ["Kaç eser hiç yazılmadı? Yapısal olarak cevaplanamaz - kayıt bırakmayan bir kayıp."],
    checked: CHECKED, used_in: ["mit-ve-sicil"],
    review: { status: "draft", notes: "Birincil vaka güçlü; genel iddia yapısal olarak ölçülemez." },
  }),

  finding({
    id: "cadi-avi-donemi",
    claim: "Avrupa'daki büyük cadı avı dalgası Ortaçağ'a değil, erken modern döneme (yaklaşık 1560-1630) aittir.",
    status: "established", confidence: "medium",
    topic: ["kilise", "erken-modern", "tarih-yazimi"],
    subject: { site: "Avrupa", region: "Orta ve Batı Avrupa", modern_country: "çok uluslu" },
    period: { earliest: 1450, latest: 1750, era_label: "Erken modern dönem", precision: "range", dating_method: ["historical-record"] },
    languages: ["Latince", "Almanca"], disciplines: ["tarih", "antropoloji"],
    popular_claim: "Cadı yakma Ortaçağ karanlığının simgesidir ve milyonlarca kadın yakılmıştır.",
    divergence: "İki hata birden: DÖNEM ve SAYI. Yoğunlaşma 16. yüzyıl ortası ile 17. yüzyıl başıdır - yani Rönesans ve Reform SONRASI, hem Katolik hem Protestan bölgelerde. Daha erken dönemde kilise hukuku gece uçuşu gibi inançları hurafe sayan bir metni esas alıyordu; sertleşme sonradan geldi. Modern tahminler on binler mertebesindedir; 'milyonlar' rakamı 19.-20. yüzyıl polemiğinin ürünüdür.",
    divergence_type: ["medya-abartisi", "kategori-hatasi"],
    sources: [wikiWitch],
    evidence: [
      ev("Yargılamaların yoğunlaştığı dönem yaklaşık 1560-1630'dur; hem Katolik hem Protestan bölgelerde yaşandı.",
        cite("witch-trials-wikipedia", "Kronoloji bölümü", "direct"), { id: "1560-1630" }),
      ev("Erken Ortaçağ kilise hukukunda gece uçuşu inancı yanılsama sayılıyordu; sertleşme sonradan geldi.",
        cite("witch-trials-wikipedia", "Erken dönem bölümü", "direct"), { id: "canon-episcopi" }),
    ],
    counter_evidence: [
      ev("Toplam idam sayısı için verilen aralıklar tartışmalıdır; bu kayıt kesin rakam değil mertebe verir.",
        cite("witch-trials-wikipedia", "Sayı tahminleri bölümü", "counter"), { id: "sayilar-tartismali" }),
      ev("Bölgesel farklar çok büyüktür; bazı bölgelerde yargılama neredeyse yokken bazılarında yoğundur.",
        cite("witch-trials-wikipedia", "Coğrafi dağılım", "counter"), { id: "bolgesel-fark" }),
      ev("BU KAYIT TEK ARA KAYNAĞA DAYANIYOR. Alanın standart hakemli monografileri (ör. Levack) taranmadı; kümenin en zayıf kaydıdır.",
        cite("witch-trials-wikipedia", "Kaynak düzeyi", "context"), { id: "en-zayif-kayit" }),
    ],
    open_questions: ["Toplam idam sayısı nedir? Aralıklar tartışmalı.", "Hakemli monografi taraması yapılmalı."],
    checked: CHECKED, volatile: true, used_in: ["mit-ve-sicil"],
    review: { status: "draft", notes: "KÜMENİN EN ZAYIF KAYDI: tek ara kaynak, hakemli çıpa yok." },
  }),
];

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
for (const r of kayitlar) {
  const i = list.findIndex((x) => x.id === r.id);
  if (i === -1) { console.error("bulunamadı:", r.id); process.exit(1); }
  const onceki = list[i].schema_version ?? 1;
  const hakemli = r.sources.some((s) => s.tier === "peer-reviewed");
  list[i] = r;
  console.log(`  v${onceki} -> v2  ${r.id.padEnd(34)} ${hakemli ? "hakemli ÇIPA VAR" : "hakemli çıpa yok"}`);
}
writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
console.log(`\n${PATH}: ${list.length} kayıt, v2: ${list.filter((r) => r.schema_version === 2).length}`);
