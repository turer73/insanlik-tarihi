#!/usr/bin/env node
// Felaketler dosyası: 10 kaydın tamamı v2'ye.
//
// BU DOSYADA DURUM FARKLIYDI: kaynaklar yer tutucu değildi, DOĞRU ESERLERİ
// ADIYLA ANIYORDU - ama künye alanları boştu. "Hays, Imbrie & Shackleton,
// Science (1976)" bir başlık dizesinin içinde duruyordu; authors, year, doi
// alanları yoktu. Yani kaynak biliniyordu, MAKİNEYE GÖSTERİLMİYORDU.
// DeepSeek turu tam da bunu kapattı: DOI'ler geldi, crossref'te doğrulandı.
//
// İLGİ DENETİMİNDE ÇIKAN UYUMSUZLUK - önemli:
// Miyake vd. 2012 (Nature) makalesi 774-775 olayını anlatır, bu kaydın
// konusu olan 993 olayını DEĞİL. Aday "993 kaydı" için önerilmişti ve
// künyesi doğruydu, ama iddianın kendisini taşımıyor. Kaynak ALINDI ama
// YERİ DEĞİŞTİRİLDİ: olgunun keşfi (kozmik ışın kaynaklı ağaç halkası
// imzası) olarak bağlandı, 993 tarihlemesinin dayanağı olarak değil. Bu
// ayrım counter_evidence'a da yazıldı.
//
// TIER DÜZELTMESİ: Allen, Burns & Sargent, "Cataclysms on the Columbia"
// (Timber Press 1986) doğrulandı ama TİCARİ BİR POPÜLER BİLİM KİTABIDIR,
// hakemli literatür değil. tier "popular" yapıldı ve yalnızca bağlam
// olarak kullanıldı; kaydın dayanağı Bretz'in kendi 1923 yayınıdır.
//
// ALTI KAYITTA popular_claim VE divergence BOŞTU: milankovic-donguleri,
// orta-pleyistosen-gecisi, chicxulub-dekkan-paylari, miyake-993-tarihleme,
// bretz-missoula, insan-arsivi-5200-yil. Altısı da yazıldı.
//
// SINIR: hiçbir makalenin tam metni okunmadı; DOI'ler ve künyeler
// doğrulandı, locator'lar bölüm düzeyinde. Bretz 1923'ün cilt ve sayfa
// bilgisi bu turda doğrulanmadı.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/felaketler.json";
const CHECKED = "2026-09-09";

/* --- kaynaklar ----------------------------------------------------- */

const mak = (id, o) => source(id, { language: "en", accessed: CHECKED, ...o });

const hays = mak("hays-imbrie-shackleton-1976-pacemaker", {
  tier: "peer-reviewed", type: "article",
  authors: ["Hays, James D.", "Imbrie, John", "Shackleton, Nicholas J."], year: 1976,
  title: "Variations in the Earth's Orbit: Pacemaker of the Ice Ages",
  container: "Science", volume: "194(4270)", pages: "1121-1132",
  doi: "10.1126/science.194.4270.1121",
  note: "Milanković periyotlarını derin deniz karotlarında doğrudan gösteren çalışma. Önceki sürümde künye bir başlık dizesinin içindeydi; DOI yoktu.",
});

const berger = mak("berger-1988-milankovitch-theory", {
  tier: "peer-reviewed", type: "article",
  authors: ["Berger, André"], year: 1988,
  title: "Milankovitch Theory and Climate",
  container: "Reviews of Geophysics", volume: "26(4)", pages: "624-657",
  doi: "10.1029/RG026i004p00624",
  note: "Kuramın kapsamlı değerlendirmesi; periyot değerleri için dayanak.",
});

const huybers = mak("huybers-2007-glacial-variability", {
  tier: "peer-reviewed", type: "article",
  authors: ["Huybers, Peter"], year: 2007,
  title: "Glacial variability over the last two million years: an extended depth-derived agemodel, continuous obliquity pacing, and the Pleistocene progression",
  container: "Quaternary Science Reviews",
  doi: "10.1016/j.quascirev.2006.07.013",
  note: "Orta Pleyistosen Geçişi'ni iki milyon yıllık kayıt içinde ele alır.",
});

const bondGrasby = mak("bond-grasby-2017-mass-extinctions", {
  tier: "peer-reviewed", type: "article",
  authors: ["Bond, David P. G.", "Grasby, Stephen E."], year: 2017,
  title: "On the causes of mass extinctions",
  container: "Palaeogeography, Palaeoclimatology, Palaeoecology",
  doi: "10.1016/j.palaeo.2016.11.005",
  note: "Yok oluş nedenlerinin derli toplu değerlendirmesi; LIP-yok oluş örtüşmesinin ana dayanağı.",
});

const rampino = mak("rampino-stothers-1988-flood-basalt", {
  tier: "peer-reviewed", type: "article",
  authors: ["Rampino, Michael R.", "Stothers, Richard B."], year: 1988,
  title: "Flood basalt volcanism during the past 250 million years",
  container: "Science", volume: "241(4866)", pages: "663-668",
  doi: "10.1126/science.241.4866.663",
  note: "Sel bazaltı volkanizması ile yok oluşlar arasındaki zamansal örtüşmeyi kuran erken çalışma.",
});

const alvarez = mak("alvarez-1980-extraterrestrial-cause", {
  tier: "peer-reviewed", type: "article",
  authors: ["Alvarez, Luis W.", "Alvarez, Walter", "Asaro, Frank", "Michel, Helen V."], year: 1980,
  title: "Extraterrestrial cause for the Cretaceous-Tertiary extinction",
  container: "Science", volume: "208(4448)", pages: "1095-1108",
  doi: "10.1126/science.208.4448.1095",
  note: "İridyum katmanı bulgusu ve çarpma hipotezinin kaynağı. Bu kayıtta ÇARPMA TARAFININ dayanağı olarak kullanılıyor.",
});

const renne = mak("renne-2013-kpg-time-scales", {
  tier: "peer-reviewed", type: "article",
  authors: ["Renne, Paul R.", "Deino, Alan L.", "Hilgen, Frederik J."], year: 2013,
  title: "Time scales of critical events around the Cretaceous-Paleogene boundary",
  container: "Science", doi: "10.1126/science.1230492",
  note: "K-Pg sınırındaki olayların yüksek çözünürlüklü tarihlemesi; payların ayrıştırılabilirliği sorusu için dayanak.",
});

const firestone = mak("firestone-2007-younger-dryas-impact", {
  tier: "peer-reviewed", type: "article",
  authors: ["Firestone, Richard B.", "West, Allen", "Kennett, James P."], year: 2007,
  title: "Evidence for an extraterrestrial impact 12,900 years ago that contributed to the megafaunal extinctions and the Younger Dryas cooling",
  container: "Proceedings of the National Academy of Sciences",
  doi: "10.1073/pnas.0706977104",
  note: "Hipotezin KAYNAĞI. Bu kayıtta doğrulayıcı değil, iddianın çıkış noktası olarak kullanılıyor.",
});

const surovell = mak("surovell-2009-younger-dryas-degerlendirme", {
  tier: "peer-reviewed", type: "article",
  authors: ["Surovell, Todd A.", "Holliday, Vance T."], year: 2009,
  title: "An independent evaluation of the Younger Dryas extraterrestrial impact hypothesis",
  container: "Proceedings of the National Academy of Sciences",
  doi: "10.1073/pnas.0907857106",
  note: "Bağımsız tekrarlama denemesi. Kaydın 'tekrarlanamadı' ifadesinin dayanağı budur.",
});

const ambrose = mak("ambrose-1998-toba-bottleneck", {
  tier: "peer-reviewed", type: "article",
  authors: ["Ambrose, Stanley H."], year: 1998,
  title: "Late Pleistocene human population bottlenecks, volcanic winter, and differentiation of modern humans",
  container: "Journal of Human Evolution",
  doi: "10.1006/jhev.1998.0219",
  note: "Toba darboğazı hipotezinin KAYNAĞI.",
});

const lane = mak("lane-2013-toba-malawi", {
  tier: "peer-reviewed", type: "article",
  authors: ["Lane, Christine S.", "Chorn, Ben T.", "Johnson, Thomas C."], year: 2013,
  title: "Ash from the Toba supereruption in Lake Malawi shows no volcanic winter in East Africa at 75 ka",
  container: "Proceedings of the National Academy of Sciences",
  doi: "10.1073/pnas.1301474110",
  note: "Malavi Gölü karotu: külün üstünde ve altında volkanik kış izi yok. Hipotezi en doğrudan zayıflatan bulgu.",
});

const marean = mak("marean-2010-pinnacle-point", {
  tier: "peer-reviewed", type: "article",
  authors: ["Marean, Curtis W."], year: 2010,
  title: "Pinnacle Point Cave 13B (Western Cape Province, South Africa) in context",
  container: "Journal of Human Evolution",
  doi: "10.1016/j.jhevol.2010.07.011",
  note: "Güney Afrika'da patlama dönemi boyunca süren yerleşim.",
});

const kuitems = mak("kuitems-2022-viking-1021", {
  tier: "peer-reviewed", type: "article",
  authors: ["Kuitems, Margot", "Wallace, Birgitta L."], year: 2022,
  title: "Evidence for European presence in the Americas in AD 1021",
  container: "Nature", doi: "10.1038/s41586-021-03972-8",
  note: "L'Anse aux Meadows keresteğinde 993 imzası bulunup halkaların sayıldığı çalışma; 1021 yılını veren kaynak budur.",
});

const miyake = mak("miyake-2012-cosmic-ray-774", {
  tier: "peer-reviewed", type: "article",
  authors: ["Miyake, Fusa", "Nagaya, Kentaro", "Masuda, Kimiaki", "Nakamura, Toshio"], year: 2012,
  title: "A signature of cosmic-ray increase in AD 774-775 from tree rings in Japan",
  container: "Nature", doi: "10.1038/nature11123",
  note:
    "DİKKAT - BU MAKALE 774-775 OLAYINI ANLATIR, 993 OLAYINI DEĞİL. Bu kayıtta olgunun KEŞFİ olarak kullanılıyor: " +
    "kozmik ışın artışının ağaç halkalarında eşzamanlı bir imza bıraktığı buradan bilinir. 993 olayının tarihlemesi Kuitems 2022'ye dayanır.",
});

const wegener = mak("wegener-1915-entstehung", {
  tier: "primary", type: "book",
  authors: ["Wegener, Alfred"], year: 1915,
  title: "Die Entstehung der Kontinente und Ozeane", language: "de",
  note: "Kıta sürüklenmesi kuramının kendi metni. KÜNYE SINIRI: ilk baskı 1915 alındı; kitabın dört farklı baskısı var ve hangi baskının esas olduğu bu turda doğrulanmadı.",
});

const vineMatthews = mak("vine-matthews-1963-magnetic-anomalies", {
  tier: "peer-reviewed", type: "article",
  authors: ["Vine, Frederick J.", "Matthews, Drummond H."], year: 1963,
  title: "Magnetic Anomalies over Oceanic Ridges",
  container: "Nature", doi: "10.1038/199947a0",
  note: "Mekanizmayı veren çalışma; tartışmayı kapatan kanıt budur.",
});

const bretz = mak("bretz-1923-channeled-scabland", {
  tier: "primary", type: "article",
  authors: ["Bretz, J Harlen"], year: 1923,
  title: "The Channeled Scabland of the Columbia Plateau",
  container: "The Journal of Geology",
  note: "Özgün öneri. CİLT VE SAYFA BİLGİSİ BU TURDA DOĞRULANMADI, uydurulmadı.",
});

const allenColumbia = mak("allen-burns-sargent-1986-cataclysms", {
  tier: "popular", type: "book",
  authors: ["Allen, John E.", "Burns, Marjorie", "Sargent, Sam C."], year: 1986,
  title: "Cataclysms on the Columbia: The Great Missoula Floods",
  publisher: "Timber Press", isbn: "9780881920673",
  note:
    "TİCARİ POPÜLER BİLİM KİTABI - hakemli literatür değil. DeepSeek turunda tier 'peer-reviewed' önerilmişti, düzeltildi. " +
    "Yalnızca anlatı bağlamı için kullanılıyor; kaydın dayanağı Bretz'in kendi yayınıdır.",
});

const woods = mak("woods-2010-visible-language", {
  tier: "institutional", type: "book",
  authors: ["Woods, Christopher"], year: 2010,
  title: "Visible Language: Inventions of Writing in the Ancient Middle East and Beyond",
  institution: "Oriental Institute of the University of Chicago",
  publisher: "Oriental Institute", isbn: "9781885923769",
  note: "Yazının icadına dair sergi ve inceleme kitabı; ~MÖ 3200 tarihinin dayanağı.",
});

const alley = mak("alley-2005-8k-event", {
  tier: "peer-reviewed", type: "article",
  authors: ["Alley, Richard B.", "Ágústsdóttir, Anna Maria"], year: 2005,
  title: "The 8k event: cause and consequences of a major Holocene abrupt climate change",
  container: "Quaternary Science Reviews",
  doi: "10.1016/j.quascirev.2004.12.004",
  note: "8,2 bin yıl olayının standart değerlendirmesi.",
});

/* --- kayıtlar ------------------------------------------------------- */

const milankovic = finding({
  id: "felaket-milankovic-donguleri",
  claim: "Buzul çağlarının ritmini Dünya'nın yörünge ve eksen salınımları (Milanković döngüleri) sürüyor.",
  status: "established", confidence: "high",
  topic: ["iklim", "buzul-caglari", "astronomi"],
  subject: { region: "küresel", modern_country: "çok uluslu" },
  period: { earliest: -2600000, latest: 2026, era_label: "Kuvaterner", precision: "range", dating_method: ["isotopic", "astronomical", "radiocarbon"] },
  disciplines: ["iklim-bilimi", "astronomi", "jeoloji"],
  people: [
    { name: "Milanković, Milutin", role: "proposer", affiliation: "Belgrad Üniversitesi", year: 1920, lifespan: "1879-1958" },
    { name: "Hays, James D.", role: "analyst", affiliation: "Lamont-Doherty", year: 1976 },
    { name: "Shackleton, Nicholas", role: "analyst", affiliation: "University of Cambridge", year: 1976, lifespan: "1937-2006" },
  ],
  popular_claim: "Buzul çağları Güneş'in etkinliğindeki değişimlerden kaynaklanır.",
  divergence:
    "Değişen şey Güneş'in ÜRETTİĞİ enerji değil, o enerjinin Dünya'ya DAĞILIMI: yörüngenin basıklığı, eksenin eğikliği ve presesyon. Ama kuram kapalı değil - kayıtta en güçlü görünen ~100 bin yıllık sinyal, fiziksel olarak en ZAYIF zorlamaya karşılık geliyor. Alanın kendi adı var buna: '100 bin yıl problemi'.",
  divergence_type: ["kategori-hatasi"],
  sources: [hays, berger],
  evidence: [
    ev("Basıklık ~100 bin ve ~413 bin yıl, eğiklik ~41 bin yıl, presesyon ~19-23 bin yıl.",
      cite("berger-1988-milankovitch-theory", "Yörünge parametreleri", "direct"), { id: "periyot-degerleri" }),
    ev("1976'da derin deniz çökel karotlarındaki izotop kayıtları bu periyotları doğrudan gösterdi.",
      cite("hays-imbrie-shackleton-1976-pacemaker", "Spektral çözümleme sonuçları", "direct"), { id: "1976-karot-kaniti" }),
  ],
  counter_evidence: [
    ev("100 bin yıllık sinyal fiziksel olarak en zayıf zorlama olmasına rağmen kaydı yönetiyor; kuramın bu kısmı açıklanmış değil.",
      cite("berger-1988-milankovitch-theory", "100 bin yıl problemi", "counter"), { id: "100-bin-yil-problemi" }),
    ev("Kayıttaki 'sürüyor' fiili ZAMANLAMA için geçerlidir, genliğin tamamı için değil: yörünge zorlaması buzul hacmindeki değişimin büyüklüğünü tek başına açıklamaz.",
      cite("hays-imbrie-shackleton-1976-pacemaker", "Pacemaker nitelemesi", "context"), { id: "zamanlama-genlik-ayrimi" }),
  ],
  open_questions: ["100 bin yıllık sinyal fiziksel olarak en zayıf zorlama olmasına rağmen kaydı yönetiyor - '100 bin yıl problemi' açık."],
  checked: CHECKED, used_in: ["hatirlamadigimiz-felaketler", "milankovic"],
  review: { status: "draft", notes: "Künyeler DOI ile tamamlandı. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu. 'Pacemaker' nitelemesinin zamanlama-genlik ayrımı eklendi." },
});

const mpt = finding({
  id: "felaket-orta-pleyistosen-gecisi",
  claim: "Buzul çağı döngüleri ~1,2-0,8 milyon yıl önce 41 bin yıldan 100 bin yıla geçti; nedeni bilinmiyor.",
  status: "unknown", confidence: "high",
  topic: ["iklim", "buzul-caglari"],
  subject: { region: "küresel", modern_country: "çok uluslu" },
  period: { earliest: -1200000, latest: -800000, era_label: "Orta Pleyistosen Geçişi", precision: "range", dating_method: ["isotopic", "stratigraphy"] },
  disciplines: ["iklim-bilimi", "jeoloji"],
  popular_claim: "Milanković döngüleri buzul çağlarını açıklıyor; konu kapandı.",
  divergence:
    "Kapanmadı. Yaklaşık 1,2-0,8 milyon yıl önce döngünün RİTMİ değişti - 41 bin yıldan 100 bin yıla. Ama yörünge zorlaması o sırada değişmedi. Yani değişen şey girdi değil, İKLİMİN VERDİĞİ YANIT. Bir açıklamanın kendi içinden açıklanamayan bir kırılma çıkması, kuramın çürüdüğü anlamına gelmez; sınırının nerede olduğunu gösterir.",
  divergence_type: ["kategori-hatasi"],
  sources: [huybers, berger],
  evidence: [
    ev("Geçiş çökel kayıtlarında net biçimde görülüyor.",
      cite("huybers-2007-glacial-variability", "İki milyon yıllık yaş modeli", "direct"), { id: "gecis-kayitlarda-net" }),
    ev("Yörünge zorlaması değişmedi; değişen şey iklimin verdiği yanıt.",
      cite("huybers-2007-glacial-variability", "Eğiklik zorlaması çözümlemesi", "direct"), { id: "zorlama-degismedi" }),
  ],
  counter_evidence: [
    ev("'Nedeni bilinmiyor' ifadesi aday yokluğu değil, uzlaşı yokluğu demek: buz tabakası altındaki regolitin sıyrılması, CO2 düşüşü ve iç iklim eşikleri önerilmiş adaylardır.",
      cite("huybers-2007-glacial-variability", "Pleistosen ilerlemesi tartışması", "counter"), { id: "aday-var-uzlasi-yok" }),
    ev("Geçişin keskin bir olay mı yoksa uzun bir kayma mı olduğu da tartışmalıdır; '1,2-0,8 milyon yıl' aralığı bu belirsizliği taşıyor.",
      cite("huybers-2007-glacial-variability", "Geçişin süresi", "context"), { id: "keskin-mi-kayma-mi" }),
  ],
  open_questions: ["Geçişin nedeni için önerilen adaylar arasında ayrım yapacak bir ölçüt var mı?"],
  checked: CHECKED, used_in: ["hatirlamadigimiz-felaketler", "milankovic"],
  review: { status: "draft", notes: "Yer tutucu ('Orta Pleyistosen Geçişi literatürü') Huybers 2007 ile değiştirildi. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu." },
});

const lip = finding({
  id: "felaket-yok-olus-volkanizma",
  claim: "Beş büyük kitlesel yok oluşun en az üçü, muhtemelen dördü büyük magmatik bölgelerle (LIP) örtüşür; göktaşı çarpması yalnız birinde belirleyicidir.",
  status: "established", confidence: "high",
  topic: ["yok-olus", "volkanizma", "jeoloji"],
  subject: { region: "küresel", modern_country: "çok uluslu" },
  period: { earliest: -444000000, latest: -66000000, era_label: "Paleozoik - Mezozoik sonu", precision: "range", dating_method: ["isotopic", "stratigraphy"] },
  disciplines: ["paleontoloji", "jeoloji"],
  popular_claim: "Kitlesel yok oluşları göktaşları yaptı.",
  divergence: "Chicxulub sinematik olduğu için popüler kültürde yok oluşun prototipi oldu; volkanizma-karbon döngüsü mekanizması görünmez kaldı.",
  divergence_type: ["medya-abartisi"],
  sources: [bondGrasby, rampino],
  evidence: [
    ev("Permiyen-Triyas (~252 My): Sibirya Trapları, kömür ve evaporit yataklarına sokularak CO2, kükürt ve halokarbon saldı; deniz türlerinin ~%81'i.",
      cite("bond-grasby-2017-mass-extinctions", "Permiyen-Triyas bölümü", "direct"), { id: "permiyen-triyas-sibirya" }),
    ev("Triyas-Jura (~201 My): CAMP volkanizması.",
      cite("bond-grasby-2017-mass-extinctions", "Triyas-Jura bölümü", "direct"), { id: "triyas-jura-camp" }),
    ev("K-Pg (~66 My): Chicxulub ile birlikte Dekkan Trapları.",
      cite("bond-grasby-2017-mass-extinctions", "K-Pg bölümü", "direct"), { id: "kpg-chicxulub-dekkan" }),
    ev("Sel bazaltı volkanizması ile yok oluşlar arasındaki zamansal örtüşme 250 milyon yıllık kayıt için gösterildi.",
      cite("rampino-stothers-1988-flood-basalt", "Zamansal örtüşme çözümlemesi", "direct"), { id: "250my-ortusme" }),
  ],
  counter_evidence: [
    ev("ÖRTÜŞME NEDENSELLİK DEĞİLDİR. LIP'lerin yok oluşlarla aynı zaman aralığına düşmesi mekanizmayı kendiliğinden kanıtlamaz; mekanizma karbon döngüsü üzerinden ayrıca kurulur.",
      cite("bond-grasby-2017-mass-extinctions", "Nedensellik tartışması", "counter"), { id: "ortusme-nedensellik-degil" }),
    ev("Bütün büyük LIP'ler yok oluşla sonuçlanmadı; eşleşme tek yönlü değil ve bu, mekanizmanın koşullara bağlı olduğunu gösteriyor.",
      cite("rampino-stothers-1988-flood-basalt", "Eşleşmeyen olaylar", "counter"), { id: "her-lip-yok-olus-degil" }),
  ],
  open_questions: ["LIP'i öldürücü yapan koşullar neler - hangi kayaca soktuğu mu, hızı mı, süresi mi?"],
  checked: CHECKED, used_in: ["hatirlamadigimiz-felaketler"],
  review: { status: "draft", notes: "Yer tutucu iki gerçek künyeyle değiştirildi. Boş olan counter_evidence dolduruldu: örtüşme-nedensellik ayrımı eklendi." },
});

const kpg = finding({
  id: "felaket-chicxulub-dekkan-paylari",
  claim: "K-Pg yok oluşunda Chicxulub çarpması ile Dekkan volkanizmasının katkı payları belirlenmiştir.",
  status: "contested", confidence: "high",
  topic: ["yok-olus", "k-pg"],
  subject: { site: "Chicxulub krateri", region: "Yucatán", modern_country: "Meksika", coordinates: { lat: 21.4, lon: -89.516 } },
  period: { earliest: -66043000, latest: -66000000, era_label: "Kretase-Paleojen sınırı", precision: "approximate", dating_method: ["isotopic", "stratigraphy"] },
  disciplines: ["paleontoloji", "jeoloji"],
  people: [{ name: "Alvarez, Luis W.", role: "proposer", affiliation: "UC Berkeley", year: 1980, lifespan: "1911-1988" }],
  popular_claim: "Dinozorları göktaşı öldürdü; mesele çözüldü.",
  divergence:
    "Çarpmanın gerçekliği tartışmalı değil - iridyum katmanı ve krater yerinde duruyor. Tartışmalı olan PAY: Dekkan volkanizması ekosistemi çarpmadan önce ne kadar zayıflatmıştı? İki olay birbirine o kadar yakın ki tarihleme hassasiyeti ikisini ayırmaya yetmiyor. Yani soru 'hangisi' değil, 'ne kadarı' - ve bu sorunun cevabı yok.",
  divergence_type: ["medya-abartisi"],
  sources: [alvarez, renne, bondGrasby],
  evidence: [
    ev("Çarpmanın kesin etkisi iridyum katmanı ve krater ile sabit.",
      cite("alvarez-1980-extraterrestrial-cause", "İridyum anomalisi bulgusu", "direct"), { id: "iridyum-ve-krater" }),
    ev("Dekkan volkanizması ekosistemi önceden zayıflatmış olabilir.",
      cite("bond-grasby-2017-mass-extinctions", "Dekkan katkısı tartışması", "inference"), { id: "dekkan-onceden-zayiflatti" }),
  ],
  counter_evidence: [
    ev("İki olayın tarihlendirme hassasiyeti sınırda; hangisinin ne kadar katkı yaptığı ayrıştırılamıyor.",
      cite("renne-2013-kpg-time-scales", "Yüksek çözünürlüklü tarihleme sonuçları", "counter"), { id: "tarihleme-ayristiramiyor" }),
    ev("Bu kayıtta Dekkan tarafının kendi kronoloji literatürü TARANMADI; pay tartışmasının volkanizma kanadı tek bir derleme makale üzerinden temsil ediliyor.",
      cite("bond-grasby-2017-mass-extinctions", "Kayıt düzeyi sınırı", "context"), { id: "dekkan-literaturu-taranmadi" }),
  ],
  open_questions: [
    "Dekkan püskürmelerinin sınıra göre zamanlaması hangi çözünürlükte biliniyor?",
    "Payların ayrıştırılması ilkesel olarak mümkün mü, yoksa kalıcı bir sınır mı?",
  ],
  checked: CHECKED, used_in: ["hatirlamadigimiz-felaketler"],
  review: { status: "draft", notes: "Alvarez ve Renne künyeleri DOI ile bağlandı. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu. Dekkan literatürünün taranmadığı işaretlendi." },
});

const gencDryas = finding({
  id: "felaket-genc-dryas-carpma-hipotezi",
  claim: "Genç Dryas soğuması bir kuyruklu yıldız hava patlamasıyla başladı.",
  status: "minority", confidence: "high",
  topic: ["iklim", "genc-dryas", "tartismali-hipotez"],
  subject: { region: "Kuzey Amerika ve kuzey yarımküre", modern_country: "çok uluslu" },
  period: { earliest: -12900, latest: -11700, era_label: "Genç Dryas", precision: "approximate", dating_method: ["radiocarbon", "isotopic"] },
  disciplines: ["jeoloji", "iklim-bilimi"],
  people: [{ name: "Firestone, Richard B.", role: "proposer", affiliation: "Lawrence Berkeley National Laboratory", year: 2007 }],
  popular_claim: "Bilim bunu reddediyor çünkü yeni fikirleri hep reddeder.",
  divergence:
    "Popüler yapımlar bu hipotezi Wegener ve Bretz vakalarının yanına aynı kesinlikte koyuyor. Fark şu: o ikisi mekanizma bulununca kazandı; bu hipotezin bulguları bağımsız laboratuvarlarda tekrarlanamadı.",
  divergence_type: ["medya-abartisi"],
  sources: [firestone, surovell],
  evidence: [
    ev("Firestone vd. (2007) nanoelmas, platin ve 'siyah örtü' kanıtı sundu.",
      cite("firestone-2007-younger-dryas-impact", "Bulgular bölümü", "claim-origin"), { id: "firestone-kanitlari" }),
    ev("Platin anomalisi gerçek ve ilginç.",
      cite("firestone-2007-younger-dryas-impact", "Platin ölçümleri", "direct"), { id: "platin-anomalisi-gercek" }),
  ],
  counter_evidence: [
    ev("Bağımsız bir değerlendirme, bildirilen imzaların yeniden üretilemediğini gösterdi.",
      cite("surovell-2009-younger-dryas-degerlendirme", "Tekrarlama sonuçları", "counter"), { id: "bagimsiz-tekrarlanamadi" }),
    ev("Nanoelmas tespitleri bağımsız laboratuvarlarda tutarlı sonuç vermedi.",
      cite("surovell-2009-younger-dryas-degerlendirme", "Nanoelmas ölçümleri", "counter"), { id: "nanoelmas-tutarsiz" }),
    ev("Ana akım açıklama hâlâ erime suyunun Atlantik dolaşımını bozması.",
      cite("surovell-2009-younger-dryas-degerlendirme", "Alternatif açıklama", "context"), { id: "ana-akim-erime-suyu" }),
    ev("'Minority' damgası hipotezin YANLIŞ olduğunu söylemez; tekrarlanamadığını söyler. İkisi aynı şey değildir ve bu kayıt birinciyi iddia etmiyor.",
      cite("surovell-2009-younger-dryas-degerlendirme", "Kayıt düzeyi ayrımı", "context"), { id: "minority-yanlis-demek-degil" }),
  ],
  open_questions: ["Platin anomalisinin kaynağı çarpma değilse nedir?"],
  checked: CHECKED, used_in: ["hatirlamadigimiz-felaketler"],
  review: { status: "draft", notes: "İki yer tutucu, hipotezin kaynağı ve onu sınayan bağımsız değerlendirmeyle değiştirildi - claim-origin/counter ayrımı artık künyeli." },
});

const toba = finding({
  id: "felaket-toba-darbogazi",
  claim: "Toba süpervolkanı (~74.000 yıl önce) insan nüfusunda ciddi bir darboğaz yarattı.",
  status: "refuted", confidence: "medium",
  topic: ["yok-olus", "insan-evrimi", "volkanizma"],
  subject: { site: "Toba Kalderası", region: "Kuzey Sumatra", modern_country: "Endonezya", coordinates: { lat: 2.6845, lon: 98.8756 } },
  period: { earliest: -74000, latest: -73000, era_label: "Geç Pleyistosen", precision: "approximate", dating_method: ["isotopic", "radiocarbon", "stratigraphy"] },
  disciplines: ["genetik", "arkeoloji", "jeoloji"],
  people: [
    { name: "Ambrose, Stanley H.", role: "proposer", affiliation: "University of Illinois", year: 1998 },
    { name: "Lane, Christine S.", role: "critic", year: 2013 },
  ],
  popular_claim: "Toba insanlığı birkaç bin kişiye düşürdü.",
  divergence: "1998'de öne sürülen hipotez popüler bilim yayınlarında yerleşti; zayıflatan arkeolojik kanıtlar aynı yaygınlıkta aktarılmadı.",
  divergence_type: ["guncellenmemis", "medya-abartisi"],
  sources: [ambrose, lane, marean],
  evidence: [
    ev("Ambrose (1998) genetik darboğaz verileriyle ilişkilendirdi.",
      cite("ambrose-1998-toba-bottleneck", "Hipotezin sunumu", "claim-origin"), { id: "ambrose-hipotezi" }),
  ],
  counter_evidence: [
    ev("Malavi Gölü karotunda Toba külü bulundu ama külün üstünde ve altında volkanik kış izi YOK - yani beklenen iklim çöküşü Doğu Afrika'da görülmüyor.",
      cite("lane-2013-toba-malawi", "Kül katmanı ve iklim göstergeleri", "counter"), { id: "malawi-volkanik-kis-yok" }),
    ev("Güney Afrika'da patlama dönemi boyunca süren yerleşim izleri bulundu.",
      cite("marean-2010-pinnacle-point", "Yerleşim sürekliliği", "counter"), { id: "pinnacle-point-sureklilik" }),
    ev("Genetik darboğazın VARLIĞI ayrı bir sorudur; çürütülen şey darboğazın TOBA'YA bağlanmasıdır. Kayıt birincisini reddetmiyor.",
      cite("ambrose-1998-toba-bottleneck", "Kayıt düzeyi ayrımı", "context"), { id: "darbogaz-mi-toba-mi" }),
  ],
  open_questions: ["Genetik darboğaz gerçekse nedeni ne?"],
  checked: CHECKED, used_in: ["hatirlamadigimiz-felaketler"],
  review: { status: "draft", notes: "İki yer tutucu üç gerçek künyeyle değiştirildi. 'Çürütülen şey darboğazın varlığı değil, Toba'ya bağlanması' ayrımı eklendi - kayıt bunu göstermiyordu." },
});

const miyakeKayit = finding({
  id: "felaket-miyake-993-tarihleme",
  claim: "993 CE Miyake olayının ağaç halkalarındaki imzası, Kanada'daki Viking yerleşimini tam olarak 1021 yılına tarihlemeyi sağladı.",
  status: "established", confidence: "high",
  topic: ["gunes", "tarihleme-yontemi", "vikingler"],
  subject: { site: "L'Anse aux Meadows", region: "Newfoundland", modern_country: "Kanada", coordinates: { lat: 51.9639, lon: -55.5322 } },
  period: { earliest: 993, latest: 1021, era_label: "Viking Kuzey Atlantik", precision: "exact", dating_method: ["dendrochronology", "radiocarbon"] },
  disciplines: ["astronomi", "arkeoloji"],
  people: [
    { name: "Miyake, Fusa", role: "discoverer", affiliation: "Nagoya University", year: 2012 },
    { name: "Kuitems, Margot", role: "analyst", affiliation: "Rijksuniversiteit Groningen", year: 2021 },
  ],
  popular_claim: "Vikinglerin Amerika'ya ne zaman vardığı ancak yaklaşık olarak bilinebilir.",
  divergence:
    "TEK BİR YIL verilebiliyor: 1021. Bunu sağlayan şey arkeoloji değil, GÜNEŞ: 993-994'te olan bir aşırı parçacık olayı dünyanın her yerindeki ağaç halkalarında aynı anda bir karbon-14 imzası bıraktı. O imza bir takvim çivisi gibi çalışıyor - keresteye rastlanan imzadan sonraki halkaları saymak yetiyor. Yani uzayda olan bir olay, bir kıtaya varışın yılını veriyor.",
  divergence_type: ["guncellenmemis"],
  sources: [kuitems, miyake],
  evidence: [
    ev("993-994 aşırı güneş parçacık olayı dünya çapında ağaç halkalarında eşzamanlı karbon-14 imzası bıraktı.",
      cite("kuitems-2022-viking-1021", "993 imzasının kullanımı", "direct"), { id: "993-imzasi" }),
    ev("L'Anse aux Meadows keresteğinde imza bulunup halkalar sayıldı; sonuç 1021.",
      cite("kuitems-2022-viking-1021", "Sonuçlar", "direct"), { id: "1021-sonucu" }),
    ev("Bu tür olayların ağaç halkalarında iz bıraktığı ilk kez 774-775 olayı üzerinden gösterildi; yöntemin dayandığı olgu budur.",
      cite("miyake-2012-cosmic-ray-774", "774-775 imzasının bulunuşu", "context"), { id: "olgunun-kesfi-774" }),
  ],
  counter_evidence: [
    ev("KÜNYE UYARISI: Miyake vd. 2012 makalesi 774-775 olayını anlatır, 993 olayını DEĞİL. Bu kayıtta olgunun keşfi olarak kullanılıyor; 993 tarihlemesinin dayanağı Kuitems 2022'dir. 993 olayını tanımlayan çalışma bu kayıtta ayrıca künyelenmedi.",
      cite("miyake-2012-cosmic-ray-774", "Kayıt düzeyi ayrımı", "context"), { id: "miyake-2012-farkli-olay" }),
    ev("Tarih, kesilen ağacın kesim yılını verir; yerleşimin ne kadar sürdüğünü ya da ilk varışın bu yıl olduğunu göstermez.",
      cite("kuitems-2022-viking-1021", "Sonuçların yorumu", "counter"), { id: "kesim-yili-varis-yili-degil" }),
  ],
  open_questions: ["993 olayını tanımlayan özgün yayın hangisi? Bu kayıtta künyelenmeli."],
  checked: CHECKED, used_in: ["hatirlamadigimiz-felaketler"],
  review: {
    status: "draft",
    notes:
      "DeepSeek turu Miyake 2012'yi bu kayda önerdi ve künyesi doğruydu - ama makale 774-775 olayını anlatıyor, 993'ü değil. Kaynak alındı ama YERİ DEĞİŞTİRİLDİ: olgunun keşfi olarak bağlandı, 993 tarihlemesinin dayanağı olarak değil. 993'ün özgün yayını açık soru olarak bırakıldı.",
  },
});

const wegenerKayit = finding({
  id: "felaket-wegener-mekanizma-dersi",
  claim: "Wegener'in kıta sürüklenmesi kuramı ~50 yıl reddedildi çünkü kanıtı iyi ama mekanizması yanlıştı.",
  status: "established", confidence: "high",
  topic: ["bilim-sosyolojisi", "levha-tektonigi"],
  subject: { region: "küresel", modern_country: "çok uluslu" },
  period: { earliest: 1596, latest: 1963, era_label: "Gözlemden kanıta", precision: "range", dating_method: ["historical-record"] },
  disciplines: ["jeoloji", "bilim-tarihi"],
  people: [
    { name: "Ortelius, Abraham", role: "proposer", year: 1596, lifespan: "1527-1598" },
    { name: "Wegener, Alfred", role: "proposer", affiliation: "Universität Graz", year: 1912, lifespan: "1880-1930" },
    { name: "Jeffreys, Harold", role: "critic", affiliation: "University of Cambridge", year: 1924, lifespan: "1891-1989" },
    { name: "Tharp, Marie", role: "surveyor", affiliation: "Lamont Geological Observatory", year: 1952, lifespan: "1920-2006" },
    { name: "Hess, Harry", role: "proposer", affiliation: "Princeton University", year: 1962, lifespan: "1906-1969" },
    { name: "Vine, Frederick", role: "analyst", affiliation: "University of Cambridge", year: 1963, lifespan: "1939-2024" },
    { name: "Matthews, Drummond", role: "analyst", affiliation: "University of Cambridge", year: 1963, lifespan: "1931-1997" },
  ],
  popular_claim: "Bilim çevresi Wegener'i sırf aykırı olduğu için susturdu.",
  divergence: "Reddedenler haksız değildi: Wegener kıtaların okyanus kabuğunu yararak ilerlediğini savunuyordu ve fizikçiler bunun imkânsız olduğunu gösterdi. Wegener eksiği kendisi de biliyordu.",
  divergence_type: ["medya-abartisi"],
  sources: [wegener, vineMatthews],
  evidence: [
    ev("Kanıtları sağlamdı: fosil dağılımı, dağ kuşakları, tropik bölgelerde buzul çökelleri, Antarktika'da kömür.",
      cite("wegener-1915-entstehung", "Kanıt bölümleri", "direct"), { id: "wegener-kanitlari" }),
    ev("1963'te manyetik şeritler mekanizmayı verince tartışma 33 yılda kapandı.",
      cite("vine-matthews-1963-magnetic-anomalies", "Manyetik anomali yorumu", "direct"), { id: "manyetik-seritler-mekanizma" }),
    ev("Ortelius 1596'da, Bacon 1620'de kıyı uyumuna dikkat çekmişti - gözlem 400 yıl eskiydi.",
      cite("wegener-1915-entstehung", "Öncüller bölümü", "context"), { id: "gozlem-400-yil-eski" }),
  ],
  counter_evidence: [
    ev("'Kanıtı iyi ama mekanizması yanlış' özeti, dönemin itirazlarını tek bir gerekçeye indirger; kıta sürüklenmesine kurumsal ve coğrafi direncin de payı olduğu bilim tarihinde tartışılır.",
      cite("vine-matthews-1963-magnetic-anomalies", "Kayıt düzeyi sınırı", "context"), { id: "tek-gerekceye-indirgeme" }),
    ev("Hess'in 1962 tarihli deniz tabanı yayılması çalışması bu kayıtta künyelenmedi; mekanizma zincirinin bir halkası eksik.",
      cite("vine-matthews-1963-magnetic-anomalies", "Öncül çalışma", "context"), { id: "hess-1962-kunyelenmedi" }),
  ],
  open_questions: ["Hess 1962 künyelenmeli; ayrıca dönemin itirazlarının bilim-tarihi literatürü taranmadı."],
  checked: CHECKED, used_in: ["hatirlamadigimiz-felaketler"],
  review: { status: "draft", notes: "Vine & Matthews DOI ile bağlandı. Hess 1962'nin eksik kaldığı açıkça işaretlendi - önceki sürümde künyesiz bir yer tutucu olarak duruyordu." },
});

const bretzKayit = finding({
  id: "felaket-bretz-missoula",
  claim: "Washington eyaletindeki Channeled Scablands'i tekrarlanan buzul gölü taşkınları oydu; Bretz ~40 yıl reddedildi.",
  status: "established", confidence: "high",
  topic: ["bilim-sosyolojisi", "jeoloji", "buzul-selleri"],
  subject: { site: "Channeled Scablands", region: "Doğu Washington", modern_country: "ABD", coordinates: { lat: 47.1, lon: -118.5 } },
  period: { earliest: -15000, latest: -13000, era_label: "Geç Pleyistosen buzul selleri", precision: "range", dating_method: ["radiocarbon", "stratigraphy"] },
  disciplines: ["jeoloji", "bilim-tarihi"],
  people: [{ name: "Bretz, J Harlen", role: "proposer", affiliation: "University of Chicago", year: 1923, lifespan: "1882-1981" }],
  popular_claim: "Bretz reddedildi çünkü bilim aykırı fikirleri sevmez.",
  divergence:
    "Reddin somut bir gerekçesi vardı ve Bretz onu kapatamıyordu: SUYUN KAYNAĞINI gösteremiyordu. Böylesine bir sel için gereken hacim ortada yoktu, o da nereden geldiğini söyleyemiyordu. Montana'daki buz barajlı dev buzul gölü bulununca eksik halka tamamlandı ve alan kabul etti. Yani hikâye 'inatçı bilim' değil, 'eksik mekanizma' hikâyesi - Wegener vakasıyla aynı kalıp.",
  divergence_type: ["medya-abartisi"],
  sources: [bretz, allenColumbia],
  evidence: [
    ev("Bretz 1923'te önerdi; jeolojinin 'yavaş ve kademeli' doktrini felaket açıklamalarını dışlıyordu.",
      cite("bretz-1923-channeled-scabland", "Öneri ve dönemin doktrini", "claim-origin"), { id: "bretz-1923-onerisi" }),
    ev("Suyun kaynağı sonradan bulundu: Montana'da buz barajı arkasındaki dev buzul gölü, defalarca patlamış.",
      cite("allen-burns-sargent-1986-cataclysms", "Missoula Gölü bölümü", "context"), { id: "missoula-golu-bulundu" }),
    ev("Her taşkında ~2.500 km3'e varan su.",
      cite("allen-burns-sargent-1986-cataclysms", "Taşkın hacimleri", "context"), { id: "2500-km3" }),
    ev("Bretz 1979'da 96 yaşında mesleğin en büyük madalyasını aldı.",
      cite("allen-burns-sargent-1986-cataclysms", "Sonuç bölümü", "context"), { id: "penrose-madalyasi" }),
  ],
  counter_evidence: [
    ev("Hacim ve taşkın sayısı rakamları bu kayıtta POPÜLER BİR KİTAPTAN alınmıştır; hakemli kaynağa bağlanmadı. Rakamlar alanda tartışmalıdır ve tahmine göre değişir.",
      cite("allen-burns-sargent-1986-cataclysms", "Kaynak düzeyi sınırı", "counter"), { id: "rakamlar-populer-kaynaktan" }),
    ev("Bretz'in 1923 yayınının cilt ve sayfa bilgisi bu turda doğrulanmadı.",
      cite("bretz-1923-channeled-scabland", "Künye düzeyi", "context"), { id: "bretz-kunye-eksik" }),
  ],
  open_questions: [
    "Taşkın sayısı ve hacimleri için hakemli bir kaynak bulunup rakamlar oradan bağlanmalı.",
  ],
  checked: CHECKED, used_in: ["hatirlamadigimiz-felaketler"],
  review: {
    status: "draft",
    notes:
      "DeepSeek turu Allen vd. 1986'yı 'peer-reviewed' olarak önermişti; TİCARİ POPÜLER BİLİM KİTABI olduğu için tier 'popular' yapıldı ve rakamların hakemli kaynağa bağlanmadığı counter_evidence'a yazıldı. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu.",
  },
});

const arsiv = finding({
  id: "felaket-insan-arsivi-5200-yil",
  claim: "İnsanlığın yazılı tanıklık arşivi ~5.200 yıldır ve bu yazıda ele alınan hiçbir jeolojik felakete yetişmez.",
  status: "established", confidence: "high",
  topic: ["yontem", "derin-zaman"],
  subject: { region: "küresel", modern_country: "çok uluslu" },
  period: { earliest: -3200, latest: 2026, era_label: "Yazının icadından bugüne", precision: "range", dating_method: ["historical-record", "radiocarbon"] },
  disciplines: ["tarih", "arkeoloji"],
  popular_claim: "Bu felaketlerin izi mitlerde ve eski anlatılarda kalmıştır.",
  divergence:
    "Aritmetik buna izin vermiyor. Yazılı tanıklık ~MÖ 3200'de başlıyor; bu yazıdaki en YAKIN olay olan 8,2 bin yıl olayı bile yazıdan yaklaşık 3.000 yıl öncesine düşüyor. Göbekli Tepe'nin inşası bile Genç Dryas bittikten ~200 yıl SONRA. Yani bu olaylar için elimizdeki tanık insan değil, buz karotları ve çökeller.",
  divergence_type: ["kategori-hatasi"],
  sources: [woods, alley],
  evidence: [
    ev("Yazı Uruk'ta ~MÖ 3200'de başlıyor.",
      cite("woods-2010-visible-language", "Mezopotamya'da yazının başlangıcı", "direct"), { id: "yazi-3200" }),
    ev("En yakın olay 8,2 bin yıl olayı - yazıdan ~3.000 yıl önce.",
      cite("alley-2005-8k-event", "Olayın tarihlenmesi", "direct"), { id: "8k-olayi-tarihi" }),
    ev("Göbekli Tepe (~MÖ 9500) Genç Dryas bittikten ~200 yıl SONRA inşa edildi.",
      cite("alley-2005-8k-event", "Holosen kronolojisi", "context"), { id: "gobekli-tepe-genc-dryas-sonrasi" }),
  ],
  counter_evidence: [
    ev("Bu kayıt sözlü aktarımın hiçbir şey taşımadığını söylemez; söylediği şey YAZILI TANIKLIĞIN yetişmediğidir. Sözlü belleğin sınırları ayrı bir tartışmadır ve burada karara bağlanmıyor.",
      cite("woods-2010-visible-language", "Kayıt düzeyi ayrımı", "context"), { id: "sozlu-aktarim-ayri-mesele" }),
    ev("'~5.200 yıl' rakamı yazının Mezopotamya'daki başlangıcına dayanır; başka yazı sistemlerinin bağımsız başlangıçları bu sayıyı değiştirmez ama tek bir kökene bağlı olmadığını hatırlatır.",
      cite("woods-2010-visible-language", "Bağımsız icatlar bölümü", "context"), { id: "tek-koken-degil" }),
  ],
  open_questions: ["Sözlü aktarımın ölçülebilir üst sınırı var mı?"],
  checked: CHECKED, used_in: ["hatirlamadigimiz-felaketler", "ayni-cumlede"],
  review: { status: "draft", notes: "Yer tutucu ('Yazının kökeni ve buz karotu kaynakları') iki gerçek künyeyle değiştirildi. Sözlü aktarım ayrımı counter_evidence'a eklendi - kayıt bunu iddia ediyormuş gibi okunabiliyordu." },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
const yeni = [milankovic, mpt, lip, kpg, gencDryas, toba, miyakeKayit, wegenerKayit, bretzKayit, arsiv];
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
