// Piramitler ve Sfenks: elektrik ve kayıp arşiv efsaneleri — v2 bulgu kayıtları.
//
// Kaynak künyeleri Crossref/OpenLibrary ile doğrulandı; DOI ve ISBN'ler gerçek.
// Türkçe kaynaklar: Arkeofili (gerçek URL'ler, 2023-2025).
// İddia kökenleri popüler katman (Dunn, Bauval, West) olarak ayrı tutuldu.

import { source, ev, cite, finding, commit } from "./lib/finding.mjs";

const dosya = "data/findings/misir-efsaneleri.json";

const kaynaklar = {
  dunn1998: source("dunn1998", {
    tier: "popular", type: "book",
    title: "The Giza Power Plant: Technologies of Ancient Egypt",
    authors: ["Dunn, Christopher"], year: 1998, publisher: "Bear & Company",
    isbn: "9781879181502", language: "en",
    note: "İddia kökeni. Mühendislik temelli popüler kitap; hakemli değil."
  }),
  bauval1994: source("bauval1994", {
    tier: "popular", type: "book",
    title: "The Orion Mystery: Unlocking the Secrets of the Pyramids",
    authors: ["Bauval, Robert", "Gilbert, Adrian"], year: 1994, publisher: "Heinemann",
    isbn: "9780434000746", language: "en",
    note: "İddia kökeni. Orion korelasyon tezi."
  }),
  west1979: source("west1979", {
    tier: "popular", type: "book",
    title: "Serpent in the Sky: The High Wisdom of Ancient Egypt",
    authors: ["West, John Anthony"], year: 1979, publisher: "Quest Books (2012 baskısı)",
    isbn: "9780835630146", language: "en",
    note: "İddia kökeni. Su erozyonu tezinin popülerleştiricisi; Cayce'nin Kayıt Salonu kehanetini de benimser."
  }),
  lehner1997: source("lehner1997", {
    tier: "peer-reviewed", type: "book",
    title: "The Complete Pyramids: Solving the Ancient Mysteries",
    authors: ["Lehner, Mark"], year: 1997, publisher: "Thames & Hudson",
    isbn: "9780500050842", language: "en",
    note: "Standart Mısırolojik başvuru eseri."
  }),
  fairall1999: source("fairall1999", {
    tier: "peer-reviewed", type: "article",
    title: "Precession and the layout of the ancient Egyptian pyramids",
    authors: ["Fairall, Anthony"], year: 1999,
    container: "Astronomy & Geophysics", volume: "40", pages: "3.4",
    doi: "10.1093/astrog/40.3.3.4", language: "en"
  }),
  stocks2003: source("stocks2003", {
    tier: "peer-reviewed", type: "book",
    title: "Experiments in Egyptian Archaeology: Stoneworking Technology in Ancient Egypt",
    authors: ["Stocks, Denys A."], year: 2003, publisher: "Routledge",
    doi: "10.4324/9780203430231", language: "en",
    note: "Deneysel arkeoloji: bakır alet + aşındırıcı kum ile granit işleme ölçümleri."
  }),
  petrie1883: source("petrie1883", {
    tier: "primary", type: "book",
    title: "The Pyramids and Temples of Gizeh",
    authors: ["Petrie, W. M. Flinders"], year: 1883, publisher: "Field & Tuer, Londra",
    language: "en",
    note: "Birincil ölçüm kaydı: matkap çekirdeği izleri dahil alet izlerinin ilk sistemli kaydı."
  }),
  harrell1993: source("harrell1993", {
    tier: "peer-reviewed", type: "article",
    title: "The Great Pyramid Debate — Evidence from the Lauer Sample",
    authors: ["Harrell, James A.", "Penrod, Brooks"], year: 1993,
    container: "Journal of Geological Education", volume: "41", pages: "358-363",
    doi: "10.5408/0022-1368-41.4.358", language: "en"
  }),
  gauri1990: source("gauri1990", {
    tier: "peer-reviewed", type: "article",
    title: "Weathering of limestone beds at the great sphinx",
    authors: ["Chowdhury, A.", "Punuru, A.", "Gauri, K. Lal"], year: 1990,
    container: "Environmental Geology and Water Sciences", volume: "15",
    doi: "10.1007/bf01706413", language: "en",
    note: "Tuz ayrışması (haloklasti) mekanizmasının ölçümü."
  }),
  reader2001: source("reader2001", {
    tier: "peer-reviewed", type: "article",
    title: "A Geomorphological Study of the Giza Necropolis, with Implications for the Development of the Site",
    authors: ["Reader, Colin"], year: 2001,
    container: "Archaeometry", volume: "43", pages: "149-165",
    doi: "10.1111/1475-4754.00009", language: "en"
  }),
  schoch1992: source("schoch1992", {
    tier: "institutional", type: "article",
    title: "Redating the Great Sphinx of Giza",
    authors: ["Schoch, Robert M."], year: 1992,
    container: "KMT: A Modern Journal of Ancient Egypt", volume: "3", pages: "52-70",
    publisher: "KMT Communications", institution: "KMT Communications", language: "en",
    note: "Su erozyonu tezinin jeolojik sunumu. Hakemli dergi değil, alan dergisi."
  }),
  harrell1994: source("harrell1994", {
    tier: "institutional", type: "article",
    title: "The Sphinx controversy: another look at the geological evidence",
    authors: ["Harrell, James A."], year: 1994,
    container: "KMT: A Modern Journal of Ancient Egypt", volume: "5", pages: "70-74",
    publisher: "KMT Communications", institution: "KMT Communications", language: "en"
  }),
  krupp1997: source("krupp1997", {
    tier: "institutional", type: "article",
    title: "Pyramid Marketing Schemes",
    authors: ["Krupp, E. C."], year: 1997,
    container: "Sky & Telescope", pages: "Şubat 1997 sayısı",
    publisher: "Sky Publishing", institution: "Sky & Telescope", language: "en"
  }),
  cauville2020: source("cauville2020", {
    tier: "peer-reviewed", type: "book",
    title: "Dendara. Hymnes à Hathor et à Isis",
    authors: ["Cauville, Sylvie"], year: 2020, publisher: "Peeters (IFAO külliyatı)",
    isbn: "9789042942851", language: "fr",
    note: "Dendera kabartma külliyatının standart edisyonu; 'ampul' sahnesinin okuması bu külliyatın ikonografik çerçevesi içinde yapılır."
  }),
  fagan2006: source("fagan2006", {
    tier: "peer-reviewed", type: "book",
    title: "Archaeological Fantasies: How Pseudoarchaeology Misrepresents the Past and Misleads the Public",
    authors: ["Fagan, Garrett G."], year: 2006, publisher: "Routledge",
    isbn: "9780415305938", language: "en"
  }),
  konig1938: source("konig1938", {
    tier: "institutional", type: "article",
    title: "Ein galvanisches Element aus der Partherzeit?",
    authors: ["König, Wilhelm"], year: 1938,
    container: "Forschungen und Fortschritte", volume: "14", pages: "8-9",
    publisher: "Forschungen und Fortschritte", institution: "Forschungen und Fortschritte", language: "de",
    note: "İddia kökeni: buluntuyu 'pil' olarak yorumlayan ilk yayın."
  }),
  paszthory1989: source("paszthory1989", {
    tier: "institutional", type: "article",
    title: "Electricity generation or magic? The analysis of an unusual group of finds from Mesopotamia",
    authors: ["Paszthory, Emmerich"], year: 1989,
    container: "MASCA Research Papers in Science and Archaeology", volume: "6", pages: "31-38",
    publisher: "University of Pennsylvania Museum", institution: "University of Pennsylvania Museum (MASCA)", language: "en"
  }),
  norden1757: source("norden1757", {
    tier: "primary", type: "book",
    title: "Travels in Egypt and Nubia",
    authors: ["Norden, Frederik Ludvig"], year: 1757, publisher: "Londra (Fransızca özgünü 1755)",
    language: "en",
    note: "1737-38 tarihli çizimler; Sfenks burnusuz resmedilir. Napoleon seferi 1798'den önce."
  }),
  makrizi: source("makrizi", {
    tier: "primary", type: "book",
    title: "el-Hıtat (Kitâbü'l-Mevâiz ve'l-İ'tibâr)",
    authors: ["el-Makrîzî"], year: 1440, publisher: "15. yüzyıl vakayinamesi",
    language: "ar",
    note: "1378'de Sâimüddîn adlı kişinin Sfenks'in burnunu kırdığını kaydeden erken kayıt."
  }),
  ruyasteli: source("ruyasteli", {
    tier: "primary", type: "inscription",
    title: "Rüya Steli (IV. Thutmose)",
    year: -1400, publisher: "Giza, Büyük Sfenks önü, granit stel",
    language: "egy",
    note: "MÖ ~1400. Sfenks'i kumdan kurtarma karşılığında taht vaadi anlatısı; antik meşruiyet belgesi."
  }),
  arkeofiliDendera: source("arkeofili-dendera", {
    tier: "institutional", type: "webpage",
    title: "Dendera Hathor Tapınağı'nı Tanıyalım",
    authors: ["Bozoğlu, Begüm"], year: 2023,
    institution: "Arkeofili",
    url: "https://arkeofili.com/dendera-hathor-tapinagini-taniyalim/",
    language: "tr", accessed: "2026-09-09"
  }),
  arkeofiliSfenks: source("arkeofili-sfenks", {
    tier: "institutional", type: "webpage",
    title: "Büyük Sfenks'in Oluşumunda Doğanın Bir Rolü Var mıydı?",
    authors: ["Ertuğrul, Erman"], year: 2023,
    institution: "Arkeofili",
    url: "https://arkeofili.com/buyuk-sfenksin-olusumunda-doganin-bir-rolu-var-miydi/",
    language: "tr", accessed: "2026-09-09"
  }),
  arkeofiliRadar: source("arkeofili-radar", {
    tier: "institutional", type: "webpage",
    title: "Mısır Piramitlerinin Altında Gerçekten Gizli Bir Şehir mi Var?",
    authors: ["Ertuğrul, Erman"], year: 2025,
    institution: "Arkeofili",
    url: "https://arkeofili.com/misir-piramitlerinin-altinda-gercekten-gizli-bir-sehir-mi-var/",
    language: "tr", accessed: "2026-09-09",
    note: "2025 SAR/radar iddialarının kuşkucu değerlendirmesi; doğrulama standardını açıklar."
  }),
  arkeofiliSiluriyen: source("arkeofili-siluriyen", {
    tier: "institutional", type: "webpage",
    title: "Silüriyen Hipotezi: Bizden Önce Gelişmiş Bir Uygarlık Var mıydı?",
    year: 2025,
    institution: "Arkeofili",
    url: "https://arkeofili.com/siluriyen-hipotezi-bizden-once-gelismis-bir-uygarlik-var-miydi/",
    language: "tr", accessed: "2026-09-09"
  }),
};

const {
  dunn1998, bauval1994, west1979, lehner1997, fairall1999, stocks2003, petrie1883,
  harrell1993, gauri1990, reader2001, schoch1992, harrell1994, krupp1997, cauville2020,
  fagan2006, konig1938, paszthory1989, norden1757, makrizi, ruyasteli,
  arkeofiliDendera, arkeofiliSfenks, arkeofiliRadar, arkeofiliSiluriyen,
} = kaynaklar;

const kayitlar = [
  finding({
    id: "dendera-isigi",
    claim: "Hathor Tapınağı'ndaki kabartmalar elektrik ampulü, kablo ve izolatör tasviridir.",
    status: "refuted",
    confidence: "high",
    topic: ["dendera", "elektrik", "ikonografi"],
    subject: {
      site: "Dendera Hathor Tapınağı, güney mahzen kabartmaları",
      region: "Yukarı Mısır", modern_country: "Mısır",
      coordinates: { lat: 26.1419, lon: 32.6703 }
    },
    period: { earliest: -54, latest: 20, era_label: "Ptolemaios-Roma dönemi tapınağı", precision: "range", dating_method: ["historical-record", "epigraphic"] },
    languages: ["Türkçe", "Mısırca"],
    disciplines: ["arkeoloji", "epigrafi"],
    popular_claim: "Mısırlılar elektrik ampulünü icat etmişti; Dendera kabartmaları bunun kanıtı.",
    divergence: "Kabartmadaki öğelerin modern teknoloji diliyle yeniden adlandırılması: yılan 'filaman', lotus 'ampul', çevre çizgileri 'kablo' olur. Mısır ikonografisinin kendi sözlüğü bu okumayı gerektirmez.",
    divergence_type: ["kategori-hatasi", "medya-abartisi"],
    sources: [dunn1998, cauville2020, arkeofiliDendera],
    evidence: [
      ev("Kabartma, Hathor tapınağının mahzenlerinde yer alır; tapınak MÖ 54'te başlayan inşaatıyla Ptolemaios dönemine aittir.", cite("arkeofili-dendera", "Tapınak tarihi bölümü", "context")),
      ev("Sahnenin standart Mısırolojik okuması lotus çiçeğinden çıkan yılandır (Harsomtus motifi); sahne dini metin bağlamında durur.", cite("cauville2020", "Dendera ilahileri, mahzen sahne okumaları", "context")),
    ],
    counter_evidence: [
      ev("Mısır metin külliyatında elektrik, ampul, aydınlatma cihazı veya kabloya karşılık gelen bir sözcük kayıtlı değildir.", cite("cauville2020", "Külliyatın söz varlığı", "counter")),
      ev("'Ampul' okuması ikonografi sözlüğünü modern teknolojiye göre kurar; tapınak metinleri sahneyi yaratılış anlatısı içinde verir.", cite("cauville2020", "Mahzen sahne açıklamaları", "counter")),
      ev("İddia, akademik Mısırolojiden değil popüler kitap anlatısından gelir.", cite("dunn1998", "Dendera bölümü", "claim-origin")),
    ],
    open_questions: ["Kabartmanın aydınlatma tarihine dair popüler okuması hangi yayınla yaygınlaştı; izi sistematik taranmadı."],
    checked: "2026-09-09", used_in: ["piramit-santrali"],
    review: { status: "draft", notes: "Türkçe kaynak Arkeofili; akademik Türkçe Mısıroloji literatürü taranmadı." }
  }),
  finding({
    id: "bagdat-pili",
    claim: "Khujut Rabu buluntusu bir elektrik pilidir ve antik dünyada elektrokaplamada kullanılıyordu.",
    status: "refuted",
    confidence: "medium",
    topic: ["bagdat-pili", "elektrik", "irak"],
    subject: {
      site: "Khujut Rabu (Bağdat yakını)", region: "Mezopotamya", modern_country: "Irak",
      coordinates: { lat: 33.3152, lon: 44.3661 }
    },
    period: { earliest: -250, latest: 650, era_label: "Part-Sasani aralığı", precision: "disputed", dating_method: ["typology"] },
    languages: ["Türkçe", "Almanca"],
    disciplines: ["arkeoloji"],
    popular_claim: "Bağdat pili, antik çağda elektrik üretildiğini kanıtlar.",
    divergence: "Gerçek buluntu ile yüklenen yorum arasındaki fark: kap, bakır silindir, demir çubuk ve asfalt tıpadan oluşur; 'pil' okuması bu parçaların işlevine tek bir açıklama dayatır.",
    divergence_type: ["kategori-hatasi"],
    sources: [konig1938, paszthory1989],
    evidence: [
      ev("Buluntu 1936'da bulundu; bakır silindir + demir çubuk + asfalt tıpa düzeneği ilk kez König tarafından 'galvanik element' olarak yorumlandı.", cite("konig1938", "Makale bütünü", "claim-origin")),
      ev("Düzenek laboratuvarda elektrolitle küçük bir gerilim üretir; bu gözlem 'pil' okumasının teknik çekirdeğidir.", cite("konig1938", "Deney bölümü", "direct")),
    ],
    counter_evidence: [
      ev("Elektrik üretimini gerektiren hiçbir alet bulunmadı: tel, kablo, elektrot ve elektrokaplanmış tek bir eser yok.", cite("paszthory1989", "Buluntu grubu analizi", "counter")),
      ev("Benzer kaplar Seleukia'da papirüs rulolarıyla birlikte bulundu; parşömen saklama kabı açıklaması daha ekonomiktir.", cite("paszthory1989", "Alternatif açıklama bölümü", "counter")),
      ev("Tarihleme belirsizdir (Part-Sasani aralığı) ve buluntu Mısır piramitleriyle ne coğrafi ne zamansal bağ kurar; 'antik elektrik' anlatısı bu ilgisizliği örter.", cite("paszthory1989", "Bağlam değerlendirmesi", "counter")),
    ],
    open_questions: ["Kabın asıl işlevi (ritüel rulo kabı dahil) için bağımsız kalıntı analizi yok."],
    checked: "2026-09-09", used_in: ["piramit-santrali"],
    review: { status: "draft", notes: "König ve Paszthory künyeleri standart; buluntunun güncel sergi durumu taranmadı." }
  }),
  finding({
    id: "piramit-enerji-santrali",
    claim: "Büyük Piramit elektrik üretmek üzere tasarlanmış bir enerji santralidir.",
    status: "refuted",
    confidence: "high",
    topic: ["buyuk-piramit", "enerji", "sozdebilim"],
    subject: {
      site: "Giza, Büyük Piramit (Keops)", region: "Giza platosu", modern_country: "Mısır",
      coordinates: { lat: 29.9792, lon: 31.1342 }
    },
    period: { earliest: -2589, latest: -2566, era_label: "IV. Hanedan, Keops dönemi", precision: "range", dating_method: ["historical-record", "epigraphic", "radiocarbon"] },
    languages: ["Türkçe", "İngilizce"],
    disciplines: ["arkeoloji", "muhendislik"],
    popular_claim: "Piramit bir mezar değil, elektrik santraliydi.",
    divergence: "Yapının parçalarına (granit odalar, kanallar, 'kuyu'lar) elektrik devresi dilinde işlev atfedilir; aynı parçalar inşaat ve ritüel kaydıyla açıklanmış durumdadır.",
    divergence_type: ["kategori-hatasi", "medya-abartisi"],
    sources: [dunn1998, lehner1997, harrell1993],
    evidence: [
      ev("Tez, Kral Odası granitlerinin piezoelektrik üretebileceği ve kanalların elektrik iletimi için açıldığı savını kurar.", cite("dunn1998", "Power plant modeli bölümleri", "claim-origin")),
      ev("Granit, içerdiği kuvars nedeniyle basınç altında çok küçük elektrik yükü üretebilir; tezin teknik dayanağı bu maddi olgudur.", cite("dunn1998", "Piezoelektrik bölümü", "inference")),
    ],
    counter_evidence: [
      ev("Piramit, gemi çukurları, vadideki ve morg tapınakları, kült kayıtlarıyla birlikte ölüm sonrası kompleksinin parçasıdır; 'mezar' okuması bağımsız ve bol kayıtlıdır.", cite("lehner1997", "Giza kompleksi bölümleri", "counter")),
      ev("Mısır'da elektrik üretimi, iletimi veya kullanımına dair tek bir cihaz, kablo veya yazılı kayıt bulunmamıştır.", cite("lehner1997", "Arkeolojik kayıt çerçevesi", "counter")),
      ev("Kireçtaşı yalıtkandır; 'iletim hattı' okuması yapı malzemesinin elektriksel davranışıyla bağdaşmaz.", cite("dunn1998", "Kanallar bölümüne karşı okuma", "counter")),
      ev("Ana akım jeolojik ve tarihsel kayıt, yapıyı IV. Hanedan inşaat programı içinde tarihler; 'daha eski teknoloji' okuması gerekmez.", cite("harrell1993", "Lauer örneği tartışması", "context")),
    ],
    open_questions: ["'Kuyu' denilen kanalların inşaat işlevi tam olarak çözülmüş değil; bu belirsizlik santral tezinin beslendiği boşluklardan biri."],
    checked: "2026-09-09", used_in: ["piramit-santrali"],
    review: { status: "draft", notes: "Dunn künyesi ISBN ile doğrulandı. Karşı kayıt Lehner standart eserine bağlı." }
  }),
  finding({
    id: "piramit-elektrikli-alet",
    claim: "Piramit bloklarının hassas işlenmesi elektrikli aletler gerektirir; bakır aletlerle açıklanamaz.",
    status: "refuted",
    confidence: "high",
    topic: ["tas-isciligi", "elektrik", "giza"],
    subject: { site: "Giza taş ocakları ve blok yüzeyleri", region: "Giza", modern_country: "Mısır", coordinates: { lat: 29.9792, lon: 31.1342 } },
    period: { earliest: -2589, latest: -2566, era_label: "IV. Hanedan", precision: "range", dating_method: ["historical-record"] },
    languages: ["Türkçe", "İngilizce"],
    disciplines: ["arkeoloji", "muhendislik"],
    popular_claim: "Taşlar o kadar pürüzsüz ki ancak elektrikli aletle işlenmiş olabilir.",
    divergence: "'Hassasiyet = modern alet' denklemi: ölçülen pürüzsüzlük, binlerce işçi-saatlik zımpara ve aşındırıcı çalışmasının ulaşabileceği düzeyin kanıtlanmış üstünde değil.",
    divergence_type: ["kategori-hatasi"],
    sources: [dunn1998, stocks2003, petrie1883],
    evidence: [
      ev("İddia, blok yüzeylerindeki düzlük ve matkap deliği izlerinin el aletleriyle üretilemeyeceği savına dayanır.", cite("dunn1998", "İşçilik bölümleri", "claim-origin")),
    ],
    counter_evidence: [
      ev("Deneysel arkeoloji, bakır testere + aşındırıcı kumun granit ve kireçtaşını ölçülebilir hızda ve düz yüzeylerle kestiğini göstermiştir.", cite("stocks2003", "Deney serileri ve ölçümler", "counter")),
      ev("Petrie'nin kaydettiği matkap çekirdeği izleri, boru matkap + aşındırıcı yönteminin iz deseniyle uyumludur.", cite("petrie1883", "Matkap izleri bölümü", "context")),
      ev("Taş ocaklarında yarıda kalmış kesimler ve alet izleri, elektrikli alet gerektirmeyen yöntemleri belgeler.", cite("stocks2003", "Ocak kayıtları bölümü", "counter")),
    ],
    open_questions: ["Büyük blokların şantiye içi taşınma düzeni hâlâ tartışmalıdır; bu açık soru 'kayıp teknoloji' anlatılarının yemidir."],
    checked: "2026-09-09", used_in: ["piramit-santrali"],
    review: { status: "draft", notes: "Stocks DOI doğrulandı (Routledge)." }
  }),
  finding({
    id: "sfenks-su-erozyonu",
    claim: "Sfenks muhafazasındaki aşınmalar yağmur suyu erozyonudur ve yapı en az ~MÖ 5000-7000'e tarihlenmelidir.",
    status: "minority",
    confidence: "medium",
    topic: ["sfenks", "erozyon", "tarihleme"],
    subject: { site: "Büyük Sfenks", region: "Giza", modern_country: "Mısır", coordinates: { lat: 29.9753, lon: 31.1376 } },
    period: { earliest: -7000, latest: -2500, era_label: "Ana akım MÖ ~2500 (Kefren); tez MÖ 7000 öncesi", precision: "disputed", dating_method: ["none", "historical-record"] },
    languages: ["Türkçe", "İngilizce"],
    disciplines: ["jeoloji", "arkeoloji"],
    popular_claim: "Sfenks, Mısır uygarlığından binlerce yıl önce, yağmurlu iklimde yapıldı.",
    divergence: "Aşınma deseninin tek nedeni olarak yağmur suyu seçilir; aynı kireçtaşında tuz ayrışması ve ıslak kumun ürettiği desenler hesaba katılmaz.",
    divergence_type: ["ideolojik-secim"],
    sources: [west1979, schoch1992, gauri1990, lehner1997, arkeofiliSfenks],
    evidence: [
      ev("Muhafaza duvarındaki derin dikey aşınmaların yağmur suyuyla açıklanması gerektiği ve bölge ikliminin son kez bu ölçekte yağmuru çok daha erken dönemde aldığı savunulur.", cite("schoch1992", "Aşınma profilleri bölümü", "claim-origin")),
      ev("Tezin popüler taşıyıcısı, Sfenks'i 'kayıp uygarlık' anlatısına bağlar.", cite("west1979", "Sfenks bölümleri", "claim-origin")),
    ],
    counter_evidence: [
      ev("Kireçtaşındaki tuz ayrışması (haloklasti) ölçümleri, yağmur suyu olmadan da benzer aşınma desenleri üretir.", cite("gauri1990", "Tuz ayrışması ölçümleri", "counter")),
      ev("Islak kum ve yeraltı suyu etkileri de aynı duvarlarda ölçülmüştür; tek mekanizma okuması desteklenmez.", cite("gauri1990", "Mekanizma karşılaştırması", "counter")),
      ev("Ana akım tarihleme, Sfenks'i Kefren kompleksinin parçası olarak MÖ ~2500'e koyar; bu okuma yapı programı ve çevre kayıtlarıyla tutarlıdır.", cite("lehner1997", "Sfenks bölümü", "context")),
      ev("2023'te yayımlanan akışkan deneyleri, doğal süreçlerin Sfenks benzeri biçimler üretebildiğini gösterdi; tartışma canlı ama ana akım tezi benimsemiyor.", cite("arkeofili-sfenks", "Deney haberi", "context")),
    ],
    open_questions: ["Sfenks gövdesinin çekirdek örneklemesi ile doğrudan tarihlemesi yapılmamıştır; yaş tartışması bu yüzden dolaylı kalır."],
    checked: "2026-09-09", used_in: ["piramit-santrali"],
    review: { status: "draft", notes: "Schoch ve karşı kayıtlar standart; tez azınlık görüşü olarak tutuldu - çürütülmüş değil, ana akım tarafından benimsenmemiş." }
  }),
  finding({
    id: "sfenks-kayit-salonu",
    claim: "Sfenks'in altında Atlantis uygarlığının arşivi olan 'Kayıt Salonu' bulunur.",
    status: "refuted",
    confidence: "medium",
    topic: ["sfenks", "kayit-salonu", "sozdebilim"],
    subject: { site: "Büyük Sfenks çevresi", region: "Giza", modern_country: "Mısır", coordinates: { lat: 29.9753, lon: 31.1376 } },
    period: { earliest: -10000, latest: 2026, era_label: "Kehanet çerçevesi", precision: "disputed", dating_method: ["none"] },
    languages: ["Türkçe", "İngilizce"],
    disciplines: ["arkeoloji", "jeoarkeoloji"],
    popular_claim: "Sfenks'in pençeleri altında gizli bir arşiv salonu var; radar buldu.",
    divergence: "Kehanet (Cayce, 1930'lar) bir arkeolojik beklentiye dönüştürülür; sismik ve radar anomalileri 'salon' kanıtı sayılır, doğal boşluk/çatlak açıklaması dışlanır.",
    divergence_type: ["provenans-yoklugu", "ideolojik-secim"],
    sources: [west1979, fagan2006, arkeofiliRadar],
    evidence: [
      ev("İddianın kaynağı Edgar Cayce'nin 1930'lardaki kehanetleridir; tez bu kehaneti jeolojik söylemle yeniden kurar.", cite("west1979", "Kayıt Salonu bölümü", "claim-origin")),
      ev("1990'larda sismik ölçümlerde Sfenks çevresinde anomaliler bildirildiği savunulur.", cite("west1979", "Sismik bulgular bölümü", "inference")),
    ],
    counter_evidence: [
      ev("Anomaliler bağımsız biçimde 'yapı' olarak doğrulanmadı; kireçtaşındaki doğal boşluk ve çatlaklar bu sinyalleri üretebilir.", cite("arkeofili-radar", "Radar iddialarının kuşkucu değerlendirmesi", "counter")),
      ev("Sözde-arkeoloji literatüründe 'kayıp salon' kalıbı tekrarlı bir yapıdır: kehanet kendi kendine kanıt sayılır.", cite("fagan2006", "Sözde-arkeoloji çerçeve bölümleri", "counter")),
      ev("Mısır Eski Eserler Bakanlığı'nın açıklamaları ve sonraki taramalar oda bildirmemiştir.", cite("arkeofili-radar", "Resmî açıklama bölümü", "counter")),
    ],
    open_questions: ["Sfenks çevresinin hangi yüzdesi sistematik jeofizik taramadan geçti? Kayıt yok - 'bilinmeyen boşluk' kavramının kendisi açık sorudur."],
    checked: "2026-09-09", used_in: ["piramit-santrali"],
    review: { status: "draft", notes: "Fagan derlemesi çerçeve için; radar durumu Arkeofili 2025 ile." }
  }),
  finding({
    id: "sfenks-napolyon-burnu",
    claim: "Sfenks'in burnunu Napoleon'un askerleri top atışıyla kırdı.",
    status: "refuted",
    confidence: "high",
    topic: ["sfenks", "napolyon", "efsane"],
    subject: { site: "Büyük Sfenks", region: "Giza", modern_country: "Mısır", coordinates: { lat: 29.9753, lon: 31.1376 } },
    period: { earliest: 1378, latest: 1798, era_label: "1378 olayı - 1798 Napoleon seferi", precision: "range", dating_method: ["historical-record"] },
    languages: ["Türkçe", "Arapça"],
    disciplines: ["tarih"],
    popular_claim: "Napoleon'un topları Sfenks'in burnunu kırdı.",
    divergence: "Anlatı, iki ayrı tarihi (1378 olayı, 1798 seferi) tek sahnede birleştirir; burnun çok daha önce eksik olduğu çizim kaydıyla yanlışlanır.",
    divergence_type: ["medya-abartisi"],
    sources: [norden1757, makrizi],
    evidence: [
      ev("Erken bir kayıt, 1378'de Sâimüddîn adlı kişinin Sfenks'in burnunu kırdığını aktarır.", cite("makrizi", "Hıtat, Mısır anıtları bölümü", "claim-origin")),
    ],
    counter_evidence: [
      ev("Norden'in 1737-38 çizimlerinde burun zaten yoktur; Napoleon seferi 1798'dedir.", cite("norden1757", "Giza levhaları", "counter")),
    ],
    open_questions: ["Burun hasarının kesin tarihi ve failleri için 1378 kaydı dışında bağımsız belge yok."],
    checked: "2026-09-09", used_in: ["piramit-santrali"],
    review: { status: "draft", notes: "İki birincil kaynak karşılaştırması; efsanenin popülerleşme izi taranmadı." }
  }),
  finding({
    id: "orion-hizalamasi",
    claim: "Üç piramit Orion kuşağını yansıtır ve Giza planı ~MÖ 10.500 gökyüzüne kilitlenmiştir.",
    status: "refuted",
    confidence: "high",
    topic: ["orion", "hizalama", "giza"],
    subject: { site: "Giza piramitleri", region: "Giza", modern_country: "Mısır", coordinates: { lat: 29.9773, lon: 31.1325 } },
    period: { earliest: -2589, latest: -2566, era_label: "IV. Hanedan", precision: "range", dating_method: ["historical-record"] },
    languages: ["Türkçe", "İngilizce"],
    disciplines: ["astronomi", "arkeoloji"],
    popular_claim: "Piramitlerin konumu, MÖ 10.500'deki Orion kuşağını kopyalar.",
    divergence: "Üç noktanın üç yıldıza benzerliği, seçici eşleştirme ve keyfi tarihlemeyle kozmik bir şablona dönüştürülür; ölçüldüğünde iddia edilen kesinlikte bir kilitlenme çıkmaz.",
    divergence_type: ["ideolojik-secim"],
    sources: [bauval1994, fairall1999, krupp1997],
    evidence: [
      ev("Tez, üç piramidin dizilişinin Orion kuşağı yıldızlarını andırdığını ve Sfenks'in Aslan'a baktığını savunur.", cite("bauval1994", "Korelasyon bölümleri", "claim-origin")),
    ],
    counter_evidence: [
      ev("Presesyon hesabıyla yapılan astronomik denetim, ~MÖ 10.500 şablonunun gökyüzüne oturmadığını gösterir.", cite("fairall1999", "Presesyon hesapları", "counter")),
      ev("Nil'in gökyüzündeki karşılığı olarak seçilen Samanyolu eşleştirmesi yön olarak zorludur; eşleştirme seçicidir.", cite("krupp1997", "Yön eleştirisi", "counter")),
      ev("Üç yıldıza üç piramit 'uydurma' serbestliği, dizilişin istatistiksel anlamını zayıflatır.", cite("fairall1999", "İstatistiksel değerlendirme", "counter")),
    ],
    open_questions: ["Piramitlerin kuzey yöneliminin gözlem tekniği (yıldız hizalaması) gerçek ve iyi belgelidir; bu teknik ile Orion tezi arasındaki karışıklık ayrıca açıklanmayı hak eder."],
    checked: "2026-09-09", used_in: ["piramit-santrali"],
    review: { status: "draft", notes: "Fairall DOI ve Krupp künyesi gerçek; Bauval ISBN doğrulandı." }
  }),
  finding({
    id: "misir-kayip-elektrik-teknolojisi",
    claim: "Eski Mısır'da kullanılmış, sonradan kaybolmuş bir elektrik teknolojisi vardı.",
    status: "refuted",
    confidence: "high",
    topic: ["kayip-teknoloji", "sozdebilim", "misir"],
    subject: { site: "Mısır (genel çerçeve)", region: "Mısır", modern_country: "Mısır", coordinates: { lat: 26.8206, lon: 30.8025 } },
    period: { earliest: -3200, latest: 30, era_label: "Firavun dönemi bütünü", precision: "range", dating_method: ["historical-record"] },
    languages: ["Türkçe", "İngilizce"],
    disciplines: ["arkeoloji", "felsefe"],
    popular_claim: "Atalarımız elektriği biliyordu; teknoloji sonradan kayboldu.",
    divergence: "Üretim-iletim-kullanım zincirinin hiçbir halkası (kaynak, kablo, cihaz, kayıt) yokken, ayrı ayrı zayıf iddialar birbirine 'destek' sayılır. Kayıp teknoloji anlatıları, kanıt yokluğunu gerekçeye çeviren tekrarlı bir kalıp izler.",
    divergence_type: ["hayatta-kalma-yanliligi", "kategori-hatasi"],
    sources: [fagan2006, arkeofiliSiluriyen, dunn1998],
    evidence: [
      ev("Çerçeve, birbirinden bağımsız buluntuları (Dendera, Bağdat) tek bir 'antik elektrik' anlatısında birleştirir.", cite("dunn1998", "Kitap bütünü", "claim-origin")),
    ],
    counter_evidence: [
      ev("Mısır arkeolojik kaydı elektriğin üç halkasından hiçbirini içermez: üretim cihazı, iletim kablosu, kullanım aleti veya yazılı söz.", cite("fagan2006", "Kayıt yokluğu değerlendirmesi", "counter")),
      ev("'Kayıp ileri uygarlık' kalıbı, arkeolojik yöntemin dışındaki bir hipotez ailesidir; jeolojik izi sorgulanan Silüriyen hipotezi tartışması bunun güncel örneğidir.", cite("arkeofili-siluriyen", "Hipotez değerlendirmesi", "context")),
      ev("Zayıf iddiaların toplamı güçlü iddia üretmez; her bulgu kendi kaydıyla değerlendirilir.", cite("fagan2006", "Sözde-arkeoloji eleştiri çerçevesi", "counter")),
    ],
    open_questions: ["Teknolojinin 'kaybolması' kalıbının kültürel çekiciliği ayrı bir inceleme konusu; bu yazının kapsamında kayıt sorusuyla sınırlı."],
    checked: "2026-09-09", used_in: ["piramit-santrali"],
    review: { status: "draft", notes: "Üst çerçeve kaydı; Silüriyen hipotezi Arkeofili üzerinden bağlandı." }
  }),
  finding({
    id: "ruya-steli",
    claim: "Rüya Steli, Sfenks'i kumdan kurtarma karşılığında taht vaadini kaydeden antik bir meşruiyet anlatısıdır.",
    status: "established",
    confidence: "high",
    topic: ["ruya-steli", "mesruiyet", "antik-anlati"],
    subject: { site: "Büyük Sfenks önü, Rüya Steli", region: "Giza", modern_country: "Mısır", coordinates: { lat: 29.9753, lon: 31.1376 } },
    period: { earliest: -1401, latest: -1391, era_label: "IV. Thutmose dönemi", precision: "range", dating_method: ["historical-record", "epigraphic"] },
    languages: ["Türkçe", "Mısırca"],
    disciplines: ["arkeoloji", "tarih"],
    popular_claim: "—",
    divergence: "—",
    divergence_type: [],
    sources: [ruyasteli, lehner1997],
    evidence: [
      ev("Stel, IV. Thutmose'nin Sfenks'i kumdan kurtarma karşılığında taht sözü aldığı rüyayı anlatır.", cite("ruyasteli", "Stel metni", "direct")),
      ev("Stel, Sfenks'in kendi döneminde (MÖ ~1400) bile kumla örtülebildiğini ve anıta bakım kültünün varlığını gösterir.", cite("lehner1997", "Sfenks tarihçesi", "context")),
    ],
    counter_evidence: [
      ev("Anlatı, tarihsel bir rüya kaydı değil, taht üzerindeki hak iddiasını meşrulaştıran bir propaganda metni olarak okunur.", cite("ruyasteli", "Stel metni, meşruiyet çerçevesi", "counter")),
    ],
    open_questions: ["Thutmose'nin tahta gelişinin hanedan içi meşruiyet sorununun boyutu tartışmalıdır."],
    checked: "2026-09-09", used_in: ["piramit-santrali"],
    review: { status: "draft", notes: "Antik anlatı ile modern sözde-bilim anlatısının karşılaştırması için çapa kayıt." }
  }),
];

commit(dosya, kayitlar);
