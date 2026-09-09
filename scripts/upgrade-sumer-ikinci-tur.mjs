#!/usr/bin/env node
// Sümer dosyası, ikinci geçiş: kalan 5 kayıt. Dosya böylece tamamlanıyor.
//
// Birinci turda (upgrade-sumer-v2.mjs) bu beş kayıt BİLEREK v1 bırakılmıştı:
// kaynakları yer tutucuydu ("Sümer sorunu üzerine dilbilim ve arkeoloji
// literatürü" gibi) ve o turda doğrulanmış künye bulunamamıştı. DeepSeek
// turu dördü için künye getirdi; beşincisi için ayrıca arandı.
//
// ANUNNAKİ-NİBİRU KAYDINDA DİKKATLİ DAVRANILDI:
// Kayıt 'refuted' ve iki somut dilbilimsel iddia taşıyor - Anunna(ki)'nin
// ne demek olduğu ve nibiru'nun Babil astronomi metinlerindeki yeri.
// Birincisi için Akadca standart sözlük (CDA) ve ePSD künyelendi.
// İkincisi için MUL.APIN edisyonu künyelendi AMA:
//   MUL.APIN'in nibiru hakkında tam olarak ne dediği BU TURDA
//   DOĞRULANMADI. Aramada eserin künyesi teyit edildi, ilgili pasajı değil.
// Bu yüzden nibiru satırı "corpus düzeyinde" bir atıfla bağlandı ve
// locator'ın pasaj düzeyinde olmadığı counter_evidence'a yazıldı. Bir
// kaydın 'refuted' olması, çürütmenin dayanağını gevşek bırakmak için
// gerekçe değil - tam tersine.
//
// ÜÇ KAYITTA popular_claim VE divergence BOŞTU: akadca-uzerinden-cozuldu,
// koken-sorunu ve kısmen digerleri. Yazıldı.
//
// SINIR: hiçbir kaynağın tam metni okunmadı; locator'lar bölüm düzeyinde.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/sumer.json";
const CHECKED = "2026-09-09";
const mak = (id, o) => source(id, { language: "en", accessed: CHECKED, ...o });

/* --- kaynaklar ----------------------------------------------------- */

const behistun = mak("behistun-yaziti", {
  tier: "primary", type: "inscription",
  title: "Behistun Yazıtı", language: "peo",
  note: "y. MÖ 520. Aynı metni Eski Farsça, Elamca ve Akadca veren üç dilli kaya yazıtı - çivi yazısının çözülmesinin anahtarı.",
});

const daniels = mak("daniels-bright-1996-worlds-writing-systems", {
  tier: "peer-reviewed", type: "book",
  authors: ["Daniels, Peter T.", "Bright, William"], year: 1996,
  title: "The World's Writing Systems",
  publisher: "Oxford University Press", isbn: "9780195079937",
  note: "Yazı sistemlerinin standart başvuru eseri; çivi yazısının çözülme tarihçesi ve Sümerce'nin adlandırılması için dayanak.",
});

const kramerSumerians = mak("kramer-1963-the-sumerians", {
  tier: "peer-reviewed", type: "book",
  authors: ["Kramer, Samuel Noah"], year: 1963,
  title: "The Sumerians: Their History, Culture, and Character",
  publisher: "University of Chicago Press", isbn: "9780226452388",
  note: "Alanın klasik genel eseri. 1963 tarihlidir; köken tartışmasının sonraki altmış yılını kapsamaz - bu, kullanıldığı yerlerde işaretlendi.",
});

const cda = mak("black-george-postgate-2000-cda", {
  tier: "peer-reviewed", type: "book",
  authors: ["Black, Jeremy", "George, Andrew", "Postgate, Nicholas"], year: 2000,
  title: "A Concise Dictionary of Akkadian",
  publisher: "Harrassowitz Verlag", isbn: "9783447042642",
  note: "Akadca standart sözlük. Bu dosyada 'anunna(ki)' ve 'nibiru' kelimelerinin sözlük anlamı için dayanak.",
});

const epsd = mak("epsd-sumer-sozlugu", {
  tier: "institutional", type: "database",
  title: "The Pennsylvania Sumerian Dictionary (ePSD)",
  institution: "University of Pennsylvania Museum",
  url: "https://psd.museum.upenn.edu/",
  note: "Sümerce sözlük projesi; kelime anlamlarının açık erişimli kontrol yolu.",
});

const mulApin = mak("hunger-pingree-1989-mul-apin", {
  tier: "primary", type: "edition",
  authors: ["Hunger, Hermann", "Pingree, David"], year: 1989,
  title: "MUL.APIN: An Astronomical Compendium in Cuneiform",
  container: "Archiv für Orientforschung, Beiheft 24",
  publisher: "F. Berger, Horn",
  note:
    "Babil astronomi derlemesinin standart edisyonu. KÜNYE DOĞRULANDI AMA İLGİLİ PASAJ DOĞRULANMADI: " +
    "bu eserin 'nibiru' hakkında tam olarak ne dediği bu turda kontrol edilmedi. Atıf corpus düzeyindedir, pasaj düzeyinde değil.",
});

const sitchin = mak("sitchin-1976-12th-planet", {
  tier: "unreliable", type: "book",
  authors: ["Sitchin, Zecharia"], year: 1976,
  title: "The 12th Planet",
  publisher: "Stein and Day", language: "en",
  note: "İddianın KAYNAĞI. Bu kayıtta kanıt olarak değil, çürütülen iddianın çıkış noktası olarak duruyor.",
});

const adams = mak("adams-1981-heartland-of-cities", {
  tier: "peer-reviewed", type: "book",
  authors: ["Adams, Robert McC."], year: 1981,
  title: "Heartland of Cities: Surveys of Ancient Settlement and Land Use on the Central Floodplain of the Euphrates",
  publisher: "University of Chicago Press", isbn: "9780226005447",
  note: "Güney Mezopotamya yerleşim örüntüsünün yüzey araştırmasına dayanan klasik çalışması; süreklilik savının ana dayanağı.",
});

const pollock = mak("pollock-1999-ancient-mesopotamia", {
  tier: "peer-reviewed", type: "book",
  authors: ["Pollock, Susan"], year: 1999,
  title: "Ancient Mesopotamia: The Eden that Never Was",
  publisher: "Cambridge University Press", isbn: "9780521575683",
  note: "Ubeyd-Uruk geçişinin toplumsal arkeoloji açısından değerlendirmesi.",
});

const matthews = mak("matthews-2003-archaeology-mesopotamia", {
  tier: "peer-reviewed", type: "book",
  authors: ["Matthews, Roger"], year: 2003,
  title: "The Archaeology of Mesopotamia: Theories and Approaches",
  publisher: "Routledge", isbn: "9780415253178",
  note: "Alanın kuram ve yöntem tartışması; 'Sümer sorunu'nun nasıl kurulduğuna dair güncel değerlendirme.",
});

const bottero = mak("bottero-1992-mesopotamia", {
  tier: "peer-reviewed", type: "book",
  authors: ["Bottéro, Jean"], year: 1992,
  title: "Mesopotamia: Writing, Reasoning, and the Gods",
  publisher: "University of Chicago Press", isbn: "9780226067278",
  note: "Mezopotamya kültürünün genel değerlendirmesi.",
});

const zettlerHorne = mak("zettler-horne-1998-treasures-ur", {
  tier: "institutional", type: "book",
  authors: ["Zettler, Richard L.", "Horne, Lee"], year: 1998,
  title: "Treasures from the Royal Tombs of Ur",
  institution: "University of Pennsylvania Museum of Archaeology and Anthropology",
  publisher: "University of Pennsylvania Museum", isbn: "9780924171550",
  note: "Nesneyi elinde tutan müzenin sergi ve katalog kitabı; Ur Sancağı'nın tanımı ve malzeme dökümü için dayanak.",
});

const collon = mak("collon-1995-ancient-near-eastern-art", {
  tier: "peer-reviewed", type: "book",
  authors: ["Collon, Dominique"], year: 1995,
  title: "Ancient Near Eastern Art",
  publisher: "University of California Press", isbn: "9780520203075",
  note: "Yakındoğu sanatının standart girişi; nesnenin ikonografik değerlendirmesi.",
});

const woolleyUr = mak("woolley-1934-ur-kral-mezarligi", {
  tier: "primary", type: "report",
  authors: ["Woolley, Leonard"], year: 1934,
  title: "Ur Excavations II: The Royal Cemetery",
  publisher: "British Museum - University Museum, Philadelphia",
  note: "Kazı raporu. 'Sancak' adlandırması buradan gelir - kazıcının tahmini, kaydın konusu olan ad.",
});

/* --- kayıtlar ------------------------------------------------------- */

const cozulme = finding({
  id: "sumer-akadca-uzerinden-cozuldu",
  claim: "Sümerce doğrudan değil, Akadca üzerinden ve Babilli kâtiplerin hazırladığı iki dilli sözlük listeleri sayesinde okunabildi.",
  status: "established", confidence: "high",
  topic: ["sumer", "cozulme", "yontem", "bilim-tarihi"],
  subject: { site: "Behistun Yazıtı", region: "Kermanşah, Zagros", modern_country: "İran", coordinates: { lat: 34.3881, lon: 47.4361 } },
  period: { earliest: -520, latest: 1869, era_label: "Behistun'dan Sümerce'nin adlandırılmasına", precision: "range", dating_method: ["historical-record", "epigraphic"] },
  languages: ["Sümerce", "Akadca", "Eski Farsça", "Elamca"],
  disciplines: ["filoloji", "dilbilim", "bilim-tarihi"],
  people: [
    { name: "Rawlinson, Henry", role: "translator", year: 1847, lifespan: "1810-1895" },
    { name: "Oppert, Jules", role: "proposer", year: 1869, lifespan: "1825-1905" },
  ],
  popular_claim: "Sümerce, tabletler bulununca okundu.",
  divergence:
    "Sümerce'yi okumamızı sağlayan şey Sümerlerin kendisi değil, ONLARDAN SONRA GELENLERİN ÖDEVLERİ oldu. Babilli kâtipler Sümerce'yi ölü bir okul dili olarak öğrenirken kendileri için iki dilli sözlük listeleri hazırladılar; anahtar bu listelerde. Zincir üç adımlı: Behistun'un üç dilliliği Eski Farsça'yı verdi, o Akadca'yı açtı, Akadca da Sümerce'yi. Dilin adı bile bize ait - 'Sümerce' 1869'da kondu; Sümerler kendi adlarını bize bırakmadı.",
  divergence_type: ["kategori-hatasi"],
  sources: [behistun, daniels, kramerSumerians],
  evidence: [
    ev("Behistun Yazıtı (~MÖ 520) aynı metni Eski Farsça, Elamca ve Akadca verir; Eski Farsça çözülünce Akadca da çözüldü.",
      cite("behistun-yaziti", "Üç dilli metin", "direct"), { id: "behistun-uc-dilli" }),
    ev("1850'lerde Akadca metinler arasında aynı yazıyla yazılmış farklı bir dil fark edildi.",
      cite("daniels-bright-1996-worlds-writing-systems", "Çivi yazısının çözülmesi bölümü", "direct"), { id: "farkli-dil-fark-edildi" }),
    ev("Babilli kâtiplerin kendi eğitimleri için hazırladığı Sümerce-Akadca sözlük listeleri anahtarı verdi.",
      cite("kramer-1963-the-sumerians", "Kâtip eğitimi ve sözlük listeleri", "direct"), { id: "iki-dilli-listeler" }),
    ev("Dile 'Sümerce' adı 1869'da kondu - Sümerler kendi adlarını bize bırakmadı.",
      cite("daniels-bright-1996-worlds-writing-systems", "Adlandırma tarihçesi", "direct"), { id: "1869-adlandirma" }),
  ],
  counter_evidence: [
    ev("İki dilli listeler BABİLLİLERİN Sümerce anlayışını taşır; onlar için de Sümerce ölü bir dildi. Yani anahtar, dilin son konuşurlarından değil sonraki öğrencilerinden geliyor ve bu, aktarımda kayıp ihtimalini açık bırakıyor.",
      cite("kramer-1963-the-sumerians", "Sözlük listelerinin niteliği", "counter"), { id: "babilli-anlayisi-tasiyor" }),
    ev("Kramer 1963 tarihlidir; çözülme tarihçesinin sonraki altmış yıldaki değerlendirmesi bu kayıtta taranmadı.",
      cite("kramer-1963-the-sumerians", "Kayıt düzeyi sınırı", "context"), { id: "kramer-1963-eski" }),
  ],
  open_questions: ["İki dilli listelerin Sümerce anlayışı ne kadar güvenilir - Babilli kâtiplerin hataları izlenebiliyor mu?"],
  checked: CHECKED, used_in: ["sumer"],
  review: { status: "draft", notes: "Yer tutucu ('Çivi yazısının çözülmesi ve Asirbilim tarihi literatürü') iki gerçek künyeyle değiştirildi. Kayıt popular_claim/divergence olmadan duruyordu; kuruldu." },
});

const anunnaki = finding({
  id: "sumer-anunnaki-nibiru",
  claim: "Anunnaki, Nibiru adlı bir gezegenden gelen dünya dışı bir ırktır.",
  status: "refuted", confidence: "high",
  topic: ["sumer", "sozde-arkeoloji", "curutme"],
  subject: { region: "Mezopotamya", modern_country: "Irak" },
  period: { earliest: -2500, latest: 1976, era_label: "Metin geleneği ve modern iddia", precision: "range", dating_method: ["textual", "historical-record"] },
  languages: ["Sümerce", "Akadca"],
  disciplines: ["filoloji", "astronomi", "dilbilim"],
  people: [{ name: "Sitchin, Zecharia", role: "proposer", year: 1976, lifespan: "1920-2010" }],
  popular_claim: "Sümer tabletleri Nibiru'dan gelen Anunnaki adlı uzaylı bir ırkı anlatır.",
  divergence:
    "İddia 1976 tarihli popüler bir kitaptan gelir, çivi yazısından değil. İki kelime de gerçek ama anlamları başka: Anunna(ki) 'An'ın soyu' demektir ve Sümer panteonunun genelini karşılar - yani tanrılar, ziyaretçiler değil. Nibiru ise Babil astronomi metinlerinde bir GÖK KONUMU / geçiş noktasıdır. Gerçek kelimeleri alıp anlamlarını değiştirmek, uydurmaktan daha ikna edici görünür; iddianın gücü de buradan geliyor.",
  divergence_type: ["medya-abartisi", "ideolojik-secim"],
  sources: [sitchin, cda, epsd, mulApin],
  evidence: [
    ev("İddianın kaynağı 1976 tarihli popüler bir kitaptır, herhangi bir çivi yazılı metin değil.",
      cite("sitchin-1976-12th-planet", "Kitabın tezi", "claim-origin"), { id: "iddianin-kaynagi-1976" }),
  ],
  counter_evidence: [
    ev("Anunna(ki) 'An'ın soyu' demektir ve tanrılar topluluğunu, yani Sümer panteonunun genelini karşılar.",
      cite("epsd-sumer-sozlugu", "anunna maddesi", "counter"), { id: "anunna-anlami" }),
    ev("Kelimenin Akadca sözlükteki karşılığı da aynı yöndedir; 'uzaylı ırk' okuması sözlük düzeyinde karşılıksızdır.",
      cite("black-george-postgate-2000-cda", "anunnakū maddesi", "counter"), { id: "cda-anunnaku" }),
    ev("Nibiru, Babil astronomi metinlerinde bir gök konumu / geçiş noktasıdır ve farklı metinlerde farklı gök cisimleriyle ilişkilendirilir.",
      cite("hunger-pingree-1989-mul-apin", "Babil astronomi derlemesi - corpus düzeyi", "counter"), { id: "nibiru-gok-konumu" }),
    ev("3.600 yıllık yörüngeli bir gezegen fikrinin çivi yazılı hiçbir dayanağı yok.",
      cite("hunger-pingree-1989-mul-apin", "Derlemenin içeriği - corpus düzeyi", "counter"), { id: "3600-yillik-yorunge-yok" }),
    ev("KAYIT DÜZEYİ SINIRI: MUL.APIN'in nibiru hakkında tam olarak ne dediği bu turda DOĞRULANMADI. Künye teyit edildi, ilgili pasaj değil. Bir kaydın 'refuted' olması, çürütmenin dayanağını gevşek bırakmak için gerekçe değildir - pasaj düzeyinde locator bulunmalı.",
      cite("hunger-pingree-1989-mul-apin", "Künye ve locator düzeyi", "context"), { id: "pasaj-dogrulanmadi" }),
    ev("İddia sahibinin çevirileri çivi yazılı metinlerle örtüşmüyor; ama bu kayıtta çevirilerin TEK TEK karşılaştırması yapılmadı - ifade alan genelinin değerlendirmesine dayanıyor.",
      cite("sitchin-1976-12th-planet", "Çeviri iddiaları", "counter"), { id: "ceviriler-tek-tek-karsilastirilmadi" }),
  ],
  open_questions: [
    "MUL.APIN'de nibiru'nun geçtiği satırlar künyelenmeli - şu an atıf corpus düzeyinde.",
  ],
  checked: CHECKED, used_in: ["sumer"],
  review: {
    status: "draft",
    notes:
      "Yer tutucu ('Akadca ve Sümerce sözlük külliyatı') CDA, ePSD ve MUL.APIN künyeleriyle değiştirildi. MUL.APIN'in ilgili pasajının doğrulanmadığı açıkça yazıldı ve açık soruya taşındı - 'refuted' bir kayıtta dayanağı gevşek bırakmak özellikle sakıncalı.",
  },
});

const birdenbire = finding({
  id: "sumer-birdenbire-ortaya-cikmadi",
  claim: "Sümer uygarlığı öncesiz biçimde, birdenbire ortaya çıktı.",
  status: "refuted", confidence: "high",
  topic: ["sumer", "ubeyd", "curutme"],
  subject: { region: "Güney Mezopotamya", modern_country: "Irak" },
  period: { earliest: -6500, latest: -3100, era_label: "Ubeyd - Uruk", precision: "range", dating_method: ["stratigraphy", "radiocarbon", "typology"] },
  disciplines: ["arkeoloji"],
  popular_claim: "Sümerler hiçbir öncülü olmadan, gelişmiş bir uygarlık olarak birdenbire belirdi.",
  divergence:
    "Uruk döneminden önce bölgede Ubeyd dönemi yerleşimleri var ve arkeolojik olarak SÜREKLİLİK gösteriyorlar. Ani kopuş yok, kademeli ölçek artışı var.",
  divergence_type: ["medya-abartisi"],
  sources: [adams, pollock],
  evidence: [
    ev("Aynı bölgelerde giderek büyüyen yerleşimler; yüzey araştırmaları bunu örüntü düzeyinde gösteriyor.",
      cite("adams-1981-heartland-of-cities", "Yerleşim örüntüsü çözümlemesi", "direct"), { id: "buyuyen-yerlesimler" }),
    ev("Çömlekçilikte kesintisiz tipolojik gelişim.",
      cite("pollock-1999-ancient-mesopotamia", "Ubeyd-Uruk maddi kültürü", "direct"), { id: "comlekcilik-surekliligi" }),
    ev("Tapınak yapılarında kademeli büyüme - küçük odadan anıtsal yapıya.",
      cite("pollock-1999-ancient-mesopotamia", "Anıtsal mimarinin gelişimi", "direct"), { id: "tapinak-kademeli-buyume" }),
  ],
  counter_evidence: [
    ev("Süreklilik MADDİ KÜLTÜRDE gösteriliyor; bu, Ubeyd nüfusuyla Uruk nüfusunun aynı olduğunu kanıtlamaz. Çömlek geleneği devam ederken nüfus değişebilir.",
      cite("pollock-1999-ancient-mesopotamia", "Süreklilik yorumu", "counter"), { id: "maddi-kultur-nufus-degil" }),
    ev("Uruk döneminde ölçek artışının HIZI ayrı bir tartışma konusudur; 'kademeli' nitelemesi bu hızı hafifletiyor olabilir.",
      cite("adams-1981-heartland-of-cities", "Kentleşme hızı", "context"), { id: "olcek-artisinin-hizi" }),
  ],
  open_questions: ["Uruk kentleşmesinin hızı hangi çözünürlükte ölçülebiliyor?"],
  checked: CHECKED, used_in: ["sumer"],
  review: { status: "draft", notes: "Yer tutucu iki gerçek künyeyle değiştirildi. Maddi kültür sürekliliğinin nüfus sürekliliği demek olmadığı eklendi - kayıt bu ikisini ayırmıyordu." },
});

const kokenSorunu = finding({
  id: "sumer-koken-sorunu",
  claim: "Sümerlerin kökeni belirlenmiştir.",
  status: "unknown", confidence: "high",
  topic: ["sumer", "koken-sorunu", "dilbilim"],
  subject: { region: "Güney Mezopotamya", modern_country: "Irak" },
  period: { earliest: -6500, latest: -3000, era_label: "Ubeyd - Erken Uruk", precision: "range", dating_method: ["stratigraphy", "typology"] },
  languages: ["Sümerce"],
  disciplines: ["dilbilim", "arkeoloji", "genetik"],
  popular_claim: "Sümerler Orta Asya'dan (ya da başka bir yerden) gelmiş bir halktır.",
  divergence:
    "İki kanıt türü FARKLI YÖNLERE işaret ediyor ve bu, henüz uzlaştırılmadı. Arkeoloji Ubeyd'den Uruk'a yerel süreklilik gösteriyor - dışarıdan ani bir geliş izi yok. Dilbilim ise Sümerce'yi bilinen hiçbir dile bağlayamıyor; bir dil izolatı. 'Köken belirlendi' diyen her cevap, bu iki kanıttan birini seçip ötekini görmezden geliyor. Kaydın durumu bu yüzden 'unknown' - eksiklik değil, iki kanıt türünün henüz birleştirilememesi.",
  divergence_type: ["kategori-hatasi"],
  sources: [matthews, adams, bottero],
  evidence: [
    ev("Arkeoloji Ubeyd'den Uruk'a yerel süreklilik gösteriyor - dışarıdan ani bir gelişe işaret yok.",
      cite("adams-1981-heartland-of-cities", "Yerleşim sürekliliği", "direct"), { id: "arkeolojik-sureklilik" }),
    ev("Sümerce bilinen hiçbir dille akraba değildir; bir dil izolatıdır.",
      cite("bottero-1992-mesopotamia", "Dil ve yazı bölümü", "direct"), { id: "dil-izolati" }),
    ev("'Sümer sorunu'nun kendisi bir araştırma tarihi konusudur: sorunun nasıl kurulduğu, verilen cevapları biçimlendiriyor.",
      cite("matthews-2003-archaeology-mesopotamia", "Kuram ve yaklaşımlar", "context"), { id: "sorunun-kurulusu" }),
  ],
  counter_evidence: [
    ev("Dil izolatı olması, dilin bölgeye dışarıdan gelmiş olabileceği ihtimalini açık bırakıyor.",
      cite("bottero-1992-mesopotamia", "Dilin konumu", "counter"), { id: "izolat-disaridan-gelme" }),
    ev("Arkeolojik süreklilik ile dilbilimsel yalıtılmışlık tam olarak uzlaştırılamadı.",
      cite("matthews-2003-archaeology-mesopotamia", "Köken tartışması", "counter"), { id: "uzlastirilamadi" }),
    ev("Kayıt 'genetik' disiplinini sayıyor ama bu turda hiçbir arkeogenetik çalışma künyelenmedi; o kanıt türü burada TEMSİL EDİLMİYOR.",
      cite("matthews-2003-archaeology-mesopotamia", "Kayıt düzeyi sınırı", "context"), { id: "arkeogenetik-yok" }),
  ],
  open_questions: [
    "Dil ve maddi kültür farklı yönlere işaret ederken köken nasıl belirlenir?",
    "Güney Mezopotamya için arkeogenetik veri var mı? Bu kayıtta taranmadı.",
  ],
  checked: CHECKED, used_in: ["sumer"],
  review: { status: "draft", notes: "Yer tutucu üç künyeyle değiştirildi. Kayıt 'genetik' disiplinini sayarken hiç genetik kaynak taşımıyordu; bu boşluk açıkça yazıldı." },
});

const urSancagi = finding({
  id: "sumer-ur-sancagi-islevi",
  claim: "Ur Sancağı'nın işlevi belirlenmiştir.",
  status: "unknown", confidence: "high",
  topic: ["sumer", "ur", "adlandirma"],
  subject: { site: "Ur Sancağı", region: "Güney Mezopotamya", modern_country: "Irak", coordinates: { lat: 30.9626, lon: 46.1031 } },
  period: { earliest: -2600, latest: -2500, era_label: "Erken Hanedanlar III", precision: "approximate", dating_method: ["stratigraphy", "typology"] },
  disciplines: ["arkeoloji", "sanat-tarihi"],
  people: [{ name: "Woolley, Leonard", role: "excavator", affiliation: "British Museum / Penn Museum", year: 1934, lifespan: "1880-1960" }],
  popular_claim: "Ur Sancağı bir savaş sancağıdır.",
  divergence: "'Sancak' adı kazıcının tahminidir; nesnenin işlevi bilinmiyor. Ad, tahminin zamanla gerçeğe dönüşmesinin tipik örneği.",
  divergence_type: ["turizm-kopyalamasi", "guncellenmemis"],
  sources: [woolleyUr, zettlerHorne, collon],
  evidence: [
    ev("'Sancak' adlandırması kazı raporundan gelir; nesnenin bir direğe takıldığına dair bir bulgu değil, kazıcının yorumudur.",
      cite("woolley-1934-ur-kral-mezarligi", "Nesnenin tanımı", "claim-origin"), { id: "adlandirma-kazicidan" }),
    ev("İki panelde savaş ve barış sahneleri var: arabalar, esirler, ziyafet, mal getiren insanlar.",
      cite("zettler-horne-1998-treasures-ur", "Nesne tanımı", "direct"), { id: "iki-panel-sahneler" }),
    ev("Lapis lazuli, kırmızı kireçtaşı ve deniz kabuğuyla kakma; lapis Afganistan'dan geliyor - uzun mesafeli ticaretin kanıtı.",
      cite("zettler-horne-1998-treasures-ur", "Malzeme dökümü", "direct"), { id: "lapis-afganistan" }),
    ev("Nesne, Yakındoğu sanatının standart başvuru eserlerinde işlevi belirsiz bir yapıt olarak ele alınır.",
      cite("collon-1995-ancient-near-eastern-art", "Erken Hanedanlar dönemi yapıtları", "direct"), { id: "islevi-belirsiz-yapit" }),
  ],
  counter_evidence: [
    ev("Kutu, çalgı gövdesi ve mobilya parçası dahil rakip yorumlar var; hiçbiri kanıtlanmadı.",
      cite("collon-1995-ancient-near-eastern-art", "Yorum tartışması", "counter"), { id: "rakip-yorumlar" }),
    ev("Nesne mezardan PARÇALANMIŞ olarak çıktı ve bugünkü biçimi bir yeniden kurgudur; yani 'işlev' tartışması, kurgunun kendisi tartışmalıyken yürüyor.",
      cite("woolley-1934-ur-kral-mezarligi", "Buluntu durumu", "counter"), { id: "yeniden-kurgu" }),
    ev("Zettler & Horne müzenin kendi yayınıdır; nesneyi elinde tutan kurumun tanımı bu tartışmada nötr değildir.",
      cite("zettler-horne-1998-treasures-ur", "Kaynak konumu", "context"), { id: "muze-yayini" }),
  ],
  open_questions: ["Yeniden kurgunun kendisi ne kadar güvenilir - parçaların özgün dizilimi belgeli mi?"],
  checked: CHECKED, used_in: ["sumer"],
  review: { status: "draft", notes: "Yer tutucu ('Ur Sancağı kayıt bilgisi') iki künyeyle değiştirildi. Nesnenin parçalanmış çıkıp yeniden kurgulandığı eklendi - kayıt bunu hiç anmıyordu ve işlev tartışmasının zeminini değiştiriyor." },
});

/* --- uygula -------------------------------------------------------- */

const list = JSON.parse(readFileSync(PATH, "utf8"));
const yeni = [cozulme, anunnaki, birdenbire, kokenSorunu, urSancagi];
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
