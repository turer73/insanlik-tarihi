import { readFileSync, writeFileSync } from "node:fs";

const path = "data/findings/mitoloji.json";
const list = JSON.parse(readFileSync(path, "utf8"));
const CHECKED = "2026-09-07";

const yeni = [
  {
    id: "yanlis-teslim-olum-motifi",
    claim:
      "Sahra altı Afrika'nın geniş bir bölümünde ölümün kökeni bir ceza değil, yanlış teslim edilmiş bir mesajla açıklanır.",
    status: "established",
    confidence: "high",
    topic: ["mitoloji", "olum-kokeni", "afrika", "motif-dagilimi"],
    subject: {
      site: "Sahra altı Afrika",
      region: "Afrika",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 1850,
      latest: 1960,
      era_label: "Etnografik derleme dönemi",
      precision: "range",
      dating_method: ["historical-record"],
    },
    languages: ["Bantu dilleri", "Khoisan dilleri"],
    disciplines: ["antropoloji", "dilbilim"],
    people: [
      { name: "Abrahamsson, Hans", role: "analyst", year: 1951 },
    ],
    popular_claim:
      "Ölümün bir yasağın çiğnenmesinin cezası olduğu fikri evrenseldir.",
    divergence:
      "Değil. Bu anlatı tipinde ölüm AHLAKİ BİR SONUÇ DEĞİL, İDARİ BİR KAZADIR: kimse yasak meyve yemez, kimse tanrıları kızdırmaz. Tanrı ölümsüzlük veya yeniden doğuş haberini gönderir; ikinci bir haberci - ya da kulak misafiri olan biri - tersini taşır. Yavaş olan gecikir, hızlı olan önce varır ve ilk duyulan mesaj bağlayıcı olur. 'Ölüm cezadır' kalıbının evrensel sanılması, tanıdık olanı evrensel sanmanın örneğidir.",
    divergence_type: ["kategori-hatasi", "ideolojik-secim"],
    evidence: [
      "En yaygın haberci çifti bukalemun (yavaş, iyi haber) ve kertenkeledir (hızlı, kötü haber).",
      "Malavi'deki Tumbuka anlatımında haberi gönderen Chiuta'dır; bukalemun yeniden doğuş, kertenkele kalıcı ölüm haberiyle yola çıkar ve kertenkele önce varır.",
      "Bazı anlatımlarda iki ayrı haberci, bazılarında tek haberci vardır ve mesaj yolda bozulur ya da çalınıp çarpıtılır.",
      "Değişmeyen çekirdek: ölüm bir ceza değil, bir iletişim kazasıdır ve geri alınamaz.",
    ],
    counter_evidence: [
      "Afrika derlemelerinin büyük bölümü misyonerler aracılığıyla yapıldı; 'ölüm bir ceza' kalıbının yerel anlatılara sızma ihtimali her vakada ayrıca elenmeli - çoğu çalışmada bu yapılmıyor.",
      "'Sahra altı Afrika' tek bir gelenek değildir; bu genelleme kaba bir taramadır.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Abrahamsson, Hans"],
        year: 1951,
        title: "The Origin of Death: Studies in African Mythology",
        language: "en",
        note: "Motifin Afrika içi dağılımı üzerine temel çalışma.",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Origin of death",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Origin_of_death",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["gec-kalan-haberci"],
  },

  {
    id: "olum-kokeni-tip-dagilimi",
    claim:
      "Ölümün kökeni sorusu evrenseldir ama cevabın TİPİ bölgesel olarak kümelenir.",
    status: "established",
    confidence: "medium",
    topic: ["mitoloji", "olum-kokeni", "motif-dagilimi", "yontem"],
    subject: {
      site: "Afrika, Mezopotamya, Yakın Doğu, Japonya, Hindistan",
      region: "Afrika ve Avrasya",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: -2100,
      latest: 800,
      era_label: "Gılgamış'tan Kojiki'ye",
      precision: "range",
      dating_method: ["textual"],
    },
    languages: ["Akadca", "İbranice", "Japonca", "Sanskritçe"],
    disciplines: ["antropoloji", "filoloji", "tarih"],
    popular_claim:
      "Bütün kültürlerde ölümün kökeni aynı şekilde anlatılır.",
    divergence:
      "Soru evrensel, cevabın tipi değil - ve tipler coğrafi olarak kümeleniyor. En az dört ayrı tip var: (1) yanlış teslim edilen haber, Sahra altı Afrika'da yoğun; (2) elde edilip kaybedilen nesne, Mezopotamya - Gılgamış gençlik otunu çıkarır, bir yılan çalar; (3) ihlal ve ceza, Yakın Doğu tek tanrılı gelenekler; (4) sayısal pazarlık, Japonya - İzanami her gün bin can alacağına yemin eder, İzanagi bin beş yüz doğum sözü verir. Hint geleneğinin ana damarı ise soruyu hiç sormaz: ölüm bir başlangıç değil, döngünün bir aşamasıdır.",
    divergence_type: ["kategori-hatasi", "medya-abartisi"],
    evidence: [
      "Dört tip birbirinden yapısal olarak farklıdır: kaza, kayıp, ceza ve pazarlık.",
      "Hint geleneğinde soru 'ölüm neden var' değil 'döngüden nasıl çıkılır' hâline gelir - eksik bir cevap değil, farklı bir soru.",
      "Bu dağılım 'hepsinde aynı hikâye var' iddiasını doğrudan yanlışlıyor.",
    ],
    counter_evidence: [
      "Tipler saf değildir; aynı bölgede birden fazla tip bulunabilir ve karma anlatımlar vardır.",
      "Tip sınıflandırmasının kendisi analistin kurduğu bir birimdir; doğal bir kategori değil.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        title: "Gılgamış Destanı, XI. tablet (gençlik otu ve yılan)",
        language: "akk",
      },
      {
        tier: "primary",
        type: "edition",
        title: "Kojiki (İzanagi - İzanami, günlük ölüm ve doğum sayısı)",
        year: 712,
        language: "ja",
      },
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Abrahamsson, Hans"],
        year: 1951,
        title: "The Origin of Death: Studies in African Mythology",
        language: "en",
      },
    ],
    checked: CHECKED,
    used_in: ["gec-kalan-haberci"],
  },

  {
    id: "khoisan-arkaik-varyant",
    claim:
      "Yanlış-teslim motifinin en arkaik varyantı Khoisan bölgesinde köklenir ve bu, mit ağacı ile nüfus ağacının aynı noktayı gösterdiği bir vakadır.",
    status: "contested",
    confidence: "low",
    topic: ["mitoloji", "olum-kokeni", "afrika", "yontem"],
    subject: {
      site: "Khoisan bölgesi",
      region: "Güney Afrika",
      modern_country: "çok uluslu",
      coordinates: { lat: -24.0, lon: 21.0 },
    },
    period: {
      earliest: -50000,
      latest: 1960,
      era_label: "İddia edilen köken derinliğinden derleme dönemine",
      precision: "disputed",
      dating_method: ["none"],
    },
    languages: ["Khoisan dilleri"],
    disciplines: ["antropoloji", "genetik", "dilbilim"],
    popular_claim:
      "Bilim, insanlığın en eski mitinin izini sürdü.",
    divergence:
      "Bulgu ilgi çekici: bölgesel analiz ve filogenetik araçlarla yapılan çalışma, motifin tek habercili en arkaik varyantının Khoisan bölgesinde köklendiğini gösteriyor - ve Khoisan halkları insan genetik çeşitliliğinin bilinen en derin dalını temsil eder. İki bağımsız disiplin aynı noktayı işaret ediyor. AMA tam da bu yüzden dikkatli olmak gerekiyor: araştırmacı BEKLENEN CEVABI ÖNCEDEN BİLİYOR. Khoisan'ın en derin dal olduğu genetikte yerleşik bilgi. Biyolojide filogenetik yöntemler tam bu yüzden cevabı bilinmeyen vakalarda sınanır. Sonucun aranan sonuçla örtüşmesi, doğrulama yanlılığının en klasik zeminidir.",
    divergence_type: ["medya-abartisi", "provenans-yoklugu"],
    evidence: [
      "Motifin Afrika içi dağılımı bölgesel analiz ve filogenetik araçlarla incelendi.",
      "En arkaik varyant - mesajın tek haberciyle taşınıp yolda bozulduğu biçim - Khoisan bölgesinde köklenmiş görünüyor.",
      "Khoisan halkları insan genetik çeşitliliğinin bilinen en derin dalını temsil eder.",
    ],
    counter_evidence: [
      "Araştırmacı beklenen cevabı önceden biliyordu - doğrulama yanlılığı riski yüksek.",
      "Yöntem hâlâ kalibre edilmedi: mit filogenetiği cevabı bağımsız olarak bilinen vakalarda sınanmadı (bkz. mit-filogenetigi-kalibre-degil).",
      "Misyoner aracılı derleme sorunu bu motif için özellikle ağır.",
    ],
    open_questions: [
      "Sonuç, araştırmacının beklentisinden bağımsız olarak üretilebilir mi? Kör bir yeniden analiz gerekiyor.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "article",
        title: "En Afrique, pourquoi meurt-on ? Essai sur l'histoire d'un mythe africain",
        url: "https://ouci.dntb.gov.ua/en/works/4rJO6MX4/",
        language: "fr",
        accessed: "2026-09-07",
        note: "Motifin bölgesel analizi ve filogenetik yeniden kurulumu.",
      },
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Abrahamsson, Hans"],
        year: 1951,
        title: "The Origin of Death: Studies in African Mythology",
        language: "en",
      },
    ],
    checked: CHECKED,
    volatile: true,
    supersedes: [],
    used_in: ["gec-kalan-haberci"],
  },

  {
    id: "everywhen-dogrusal-olmayan-zaman",
    claim:
      "Avustralya yerli geleneklerindeki 'Rüya', geçmişte kalmış bir yaratılış dönemi değil, geçmiş-şimdi-geleceğin aynı anda mevcut olduğu bir gerçekliktir.",
    status: "established",
    confidence: "high",
    topic: ["mitoloji", "avustralya", "zaman-kavrami", "yontem"],
    subject: {
      site: "Avustralya yerli gelenekleri",
      region: "Avustralya",
      modern_country: "Avustralya",
      coordinates: { lat: -25.0, lon: 133.0 },
    },
    period: {
      earliest: 1930,
      latest: 2026,
      era_label: "Antropolojik kavramsallaştırma dönemi",
      precision: "range",
      dating_method: ["historical-record"],
    },
    languages: ["Avustralya yerli dilleri", "İngilizce"],
    disciplines: ["antropoloji", "dilbilim", "felsefe"],
    people: [
      { name: "Stanner, W. E. H.", role: "analyst", affiliation: "Australian National University", year: 1953, lifespan: "1905-1981" },
    ],
    popular_claim:
      "Aborjinlerin 'Rüya Zamanı' bir yaratılış efsanesidir - uzak geçmişte dünyanın yaratıldığı dönem.",
    divergence:
      "'Rüya Zamanı' çevirisi yanıltıcıdır çünkü geçmiş-şimdi-geleceği ayıran DÜZ BİR ZAMAN ÇİZGİSİ ima eder. Stanner bunu tarif etmek için ayrı bir sözcük türetmek zorunda kaldı: 'everywhen' - her-zaman. Atasal varlıklar geçmişte yaşamış figürler değil, HÂLÂ MEVCUT varlıklardır. Törende geçmiş şimdiye dönüşür; anlatı hatırlanmaz, yeniden yaşanır. Bazı çevirmenler anlamın 'ezelî, yaratılmamış'a daha yakın olduğunu belirtir.",
    divergence_type: ["eski-ceviri", "kategori-hatasi", "somurge-anlatisi"],
    evidence: [
      "Stanner kavramı 'everywhen' (her-zaman) terimiyle karşıladı: geçmiş, şimdi ve gelecek aynı anda mevcut.",
      "Yaratılış Rüya ile bitmedi; atasal varlıklar ve çocuk-ruhlar ezelîdir.",
      "Törensel bağlamda geçmiş şimdiye dönüşür.",
    ],
    counter_evidence: [
      "'Avustralya yerli gelenekleri' tek bir şey değildir; yüzlerce ayrı dil ve gelenek vardır ve bu genelleme kaba bir taramadır.",
      "Kavram tek bir sözcükle çevrilemiyor; bu kayıt kavramı dışarıdan tarif eder, içeriden bir aktarım iddiası taşımaz.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "article",
        authors: ["Stanner, W. E. H."],
        year: 1953,
        title: "The Dreaming",
        language: "en",
        note: "'Everywhen' teriminin kaynağı.",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "The Dreaming",
        container: "Encyclopaedia Britannica",
        url: "https://www.britannica.com/topic/the-Dreaming-Australian-Aboriginal-mythology",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["gec-kalan-haberci"],
  },

  {
    id: "yaratilis-sorusu-alet-yanliligi",
    claim:
      "'Bu gelenekte yaratılıştan yıkıma uzanan bir hikâye var mı' sorusu tarafsız bir ölçüttür.",
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
    popular_claim:
      "Bazı geleneklerde tutarlı bir yaratılış anlatısı yoktur; bu, o geleneklerin daha basit olduğunu gösterir.",
    divergence:
      "Soru tarafsız değildir: içinde zamanın BAŞLANGICI VE SONU OLAN BİR ÇİZGİ olduğu varsayımı gizlidir. Zamanı böyle örgütlemeyen bir gelenek bu testten HER ZAMAN sıfır alır - hikâyesi olmadığı için değil, sorunun ona uymadığı için. Tanıdık biçimi şudur: yıl saymayan bir geleneğe 'bu olay hangi yılda oldu' diye sorup 'tarih bilgisi yok' sonucuna varmak. Herkes ikincisinin hatalı olduğunu görür; birincisi aynı hatadır ama daha az görünürdür, çünkü 'yaratılış hikâyesi' kategorisi doğal geliyor. Doğal değil - bizim zaman anlayışımızın kalıbı.",
    divergence_type: ["kategori-hatasi", "somurge-anlatisi"],
    evidence: [
      "Avustralya gelenekleri düz bir zaman çizgisi kullanmaz (bkz. everywhen-dogrusal-olmayan-zaman); bu testten otomatik olarak sıfır alırlar.",
      "Hint geleneğinin ana damarında ölümün ve dünyanın bir 'kökeni' yoktur çünkü zaman döngüseldir - aynı yapısal sorun.",
      "Karşı kanıt: testin 'eksik' saydığı Afrika bölgesi, elimizdeki en izlenebilir mitolojik tarihlerden birini taşıyor (bkz. yanlis-teslim-olum-motifi).",
    ],
    counter_evidence: [
      "Bu kayıt 'iki aile' ayrımının tamamen yanlış olduğunu söylemez; ayrım gerçek bir yapısal farkı da yakalıyor olabilir. Söylenen şu: farkın ne kadarının nesnede, ne kadarının soruda olduğu ayrılmadı.",
    ],
    open_questions: [
      "Zaman anlayışından bağımsız bir 'anlatı derinliği' ölçütü kurulabilir mi?",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "article",
        authors: ["Stanner, W. E. H."],
        year: 1953,
        title: "The Dreaming",
        language: "en",
      },
      {
        tier: "peer-reviewed",
        type: "article",
        title: "JFR Review: The Origins of the World's Mythologies",
        container: "Journal of Folklore Research",
        url: "http://www.jfr.indiana.edu/review.php?id=1613",
        language: "en",
        accessed: "2026-09-07",
        note: "Hiyerarşi ve ölçüt tutarlılığı itirazları.",
      },
    ],
    checked: CHECKED,
    used_in: ["gec-kalan-haberci"],
  },

  {
    id: "monomit-evrensel-degil",
    claim:
      "Kahramanın Yolculuğu (monomit) dünyanın bütün mitlerinde bulunan evrensel bir yapıdır.",
    status: "refuted",
    confidence: "high",
    topic: ["mitoloji", "monomit", "yontem", "karsilastirmali-mitoloji"],
    subject: {
      site: "Karşılaştırmalı mitoloji ve popüler anlatı kuramı",
      region: "kuramsal",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 1909,
      latest: 2026,
      era_label: "Rank'tan bugüne",
      precision: "range",
      dating_method: ["historical-record", "textual"],
    },
    languages: ["Almanca", "İngilizce"],
    disciplines: ["antropoloji", "filoloji", "felsefe"],
    people: [
      { name: "Rank, Otto", role: "proposer", year: 1909, lifespan: "1884-1939" },
      { name: "Raglan, Lord (FitzRoy Somerset)", role: "proposer", year: 1936, lifespan: "1885-1964" },
      { name: "Campbell, Joseph", role: "proposer", year: 1949, lifespan: "1904-1987" },
    ],
    popular_claim:
      "Bilim, dünyanın bütün mitlerinde bulunan ortak kahraman iskeletini keşfetti.",
    divergence:
      "Akademik folklorcular ve antikçağ edebiyatı uzmanları teoriyi neredeyse oybirliğiyle reddediyor. Başlıca gerekçe KAYNAK SEÇME YANLILIĞI: kalıp yalnızca kalıba uyan anlatılar seçilerek kuruldu, uymayan ve en az onlar kadar geçerli anlatılar dışarıda bırakıldı. İkinci gerekçe YANLIŞLANAMAZLIK: aşamalar o kadar soyut ki mecazi okumaya izin verildiğinde neredeyse her anlatı uyuyor - markete ekmek almaya gitmek dahil. Bir çerçeve her şeyi açıklıyorsa hiçbir şeyi ayırt etmiyor demektir.",
    divergence_type: ["medya-abartisi", "ideolojik-secim"],
    evidence: [
      "Aynı malzemeye bakan üç analist üç FARKLI liste çıkardı: Rank doğum anlatılarına, Raglan 22 maddeye, Campbell 17 aşamaya. Kalıp veride olsaydı yakınsama beklenirdi; yakınsamadılar.",
      "Kalıba uymayan merkezî metinler var: Gılgamış gençlik otunu elde eder ama yılana kaptırır - 'iksirle dönüş' aşaması yoktur.",
      "Düzenbaz anlatıları (Çakal, Anansi) bölüm bölümdür, bir yay çizmez; kahraman dönüşmez ve çoğu zaman kaybeder.",
      "Kalıp DÜZ BİR ZAMAN ÇİZGİSİ varsayar; zamanı böyle örgütlemeyen gelenekler testten otomatik sıfır alır (bkz. yaratilis-sorusu-alet-yanliligi).",
    ],
    counter_evidence: [
      "Anlatılarda gerçek düzenlilikler vardır; bu kayıt onların varlığını değil, monomitin evrensellik iddiasını reddeder.",
      "'Neredeyse oybirliği' bir sayım değil, alan içi değerlendirmelere dayanan nitel bir ifadedir.",
      "Kalıp bir SENARYO ARACI olarak fiilen çalışır; itiraz araca değil, aracın keşif diye sunulmasınadır.",
    ],
    open_questions: [
      "Kültürler arası gerçek anlatı düzenliliklerinin ölçeği nedir? Monomit bu soruyu cevaplamıyor, atlıyor.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Campbell, Joseph"],
        year: 1949,
        title: "The Hero with a Thousand Faces",
        language: "en",
        note: "İncelenen tezin kendisi; kanıt olarak değil.",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Why Folklorists Hate Joseph Campbell's Work",
        authors: ["Jorgensen, Jeana"],
        url: "https://www.patheos.com/blogs/foxyfolklorist/why-folklorists-hate-joseph-campbells-work/",
        language: "en",
        accessed: "2026-09-07",
        note: "Folklorcu perspektifinden itirazların özeti.",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "The \"hero's journey\" isn't as universal as you think",
        url: "https://bigthink.com/high-culture/monomyth-heros-journey-campbell/",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["kendi-kaniti"],
  },

  {
    id: "monomit-geri-besleme-dongusu",
    claim:
      "Monomitin bugün 'her hikâyede' bulunmasının sebebi evrensellik değil, kalıbın senaryo şablonuna çevrilmiş olmasıdır; çıktı girdinin kanıtı sayılmaktadır.",
    status: "established",
    confidence: "medium",
    topic: ["mitoloji", "monomit", "yontem", "kanit-uretimi"],
    subject: {
      site: "Hollywood senaryo pratiği",
      region: "ABD ve küresel sinema",
      modern_country: "ABD",
    },
    period: {
      earliest: 1949,
      latest: 2026,
      era_label: "Teoriden şablona, şablondan kanıta",
      precision: "range",
      dating_method: ["historical-record"],
    },
    languages: ["İngilizce"],
    disciplines: ["antropoloji", "sanat-tarihi", "sosyoloji"],
    people: [
      { name: "Campbell, Joseph", role: "proposer", year: 1949 },
      { name: "Vogler, Christopher", role: "editor", affiliation: "Walt Disney Studios", year: 1985 },
    ],
    popular_claim:
      "Bakın, bütün filmlerde ve hikâyelerde aynı kalıp var - demek ki kalıp evrensel.",
    divergence:
      "Döngü dört adımlı ve kapalı: (1) 1949'da seçilmiş mitlerden bir kalıp çıkarılır; (2) 1980'lerde kalıp senaryo yazımı için bir reçeteye çevrilir; (3) filmler bu şablona göre yazılır ve kalıba tam uyar; (4) bu filmler gösterilip 'her hikâyede var' denerek teoriye kanıt sayılır. Kritik adım dördüncüsüdür: filmlerin kalıba uymasının sebebi kalıbın evrensel olması DEĞİL, filmlerin kalıba göre yazılmış olmasıdır. Çıktıyı girdinin kanıtı saymak döngüyü kapatıyor.",
    divergence_type: ["medya-abartisi", "hayatta-kalma-yanliligi"],
    evidence: [
      "Kalıp 1980'lerde bir stüdyo içi not aracılığıyla senaryo yazımı reçetesine çevrildi ve sonra kitaplaştırıldı.",
      "Şablon senaryo eğitiminde ve yazarlık kılavuzlarında standart hâle geldi.",
      "Aynı mekanizma serinin başka yerlerinde de görüldü: turizm anlatısının kendi kanıtını üretmesi, popüler kaynakların birbirini kopyalayarak 'çok kaynak' görünümü yaratması.",
    ],
    counter_evidence: [
      "Şablonun sinema anlatısına yayılma oranı bu kayıtta niceliksel olarak ölçülmedi; mekanizma tarif edildi, büyüklüğü verilmedi.",
      "Kalıp bir anlatı aracı olarak gerçekten çalışır ve iyi yapılandırılmış hikâyeler üretir; bu kayıt aracı değil, 'keşfedilmiş evrensel yapı' iddiasını hedef alır.",
    ],
    open_questions: [
      "Şablonun yaygınlığı niceliksel olarak ölçülebilir mi? Ölçülmedi.",
    ],
    sources: [
      {
        tier: "institutional",
        type: "webpage",
        title: "The \"hero's journey\" isn't as universal as you think",
        url: "https://bigthink.com/high-culture/monomyth-heros-journey-campbell/",
        language: "en",
        accessed: "2026-09-07",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Why Folklorists Hate Joseph Campbell's Work",
        authors: ["Jorgensen, Jeana"],
        url: "https://www.patheos.com/blogs/foxyfolklorist/why-folklorists-hate-joseph-campbells-work/",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["kendi-kaniti"],
  },

  {
    id: "kapsam-disiplini-ilkesi",
    claim:
      "Tanımlı bir külliyat üzerine kurulmuş anlatı iddiaları sınanabilir; 'tüm insanlık' üzerine kurulanlar sınanamaz.",
    status: "established",
    confidence: "high",
    topic: ["mitoloji", "yontem", "bilim-felsefesi"],
    subject: {
      site: "Anlatı çözümlemesi yöntemi",
      region: "kuramsal",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 1928,
      latest: 1949,
      era_label: "Propp'tan Campbell'a",
      precision: "range",
      dating_method: ["historical-record"],
    },
    languages: ["Rusça", "İngilizce"],
    disciplines: ["filoloji", "antropoloji", "felsefe"],
    people: [
      { name: "Propp, Vladimir", role: "proposer", year: 1928, lifespan: "1895-1970" },
      { name: "Campbell, Joseph", role: "critic", year: 1949 },
    ],
    popular_claim:
      "Daha geniş kapsamlı bir kuram daha güçlü bir kuramdır.",
    divergence:
      "Tersi. 1928'de Rus halk masalları üzerine yapılan çözümleme, anlatıları işlevlere ayırdı ve iddiasını BELİRLİ BİR DERLEMEDEKİ BELİRLİ BİR MASAL TÜRÜ ile sınırladı. Külliyat açıkça tanımlı olduğu için iddia test edilebilir: o derlemeye bakıp uymayan masal aranabilir. Monomit ise dünyanın bütün mitolojisi hakkında konuşur; külliyat tanımlı değildir, dolayısıyla uymayan bir anlatı bulunduğunda teori düşmez - o anlatı ya kapsam dışı sayılır ya da mecazi okumayla uydurulur. YANLIŞLAYACAK BİR GÖZLEM TANIMLANAMIYOR. 'Tüm insanlıkta ortak' iddiası kulağa daha büyük gelir ama bilgi değeri daha düşüktür.",
    divergence_type: ["kategori-hatasi"],
    evidence: [
      "Propp'un iddiası tanımlı bir derlemedeki sihirli masallarla sınırlıydı ve bu yüzden sınanabilir.",
      "Monomitin külliyatı tanımlı değildir; hangi anlatıların dahil olduğu baştan belirlenmemiştir.",
      "Bir iddianın değeri neyi DIŞARIDA BIRAKTIĞIYLA ölçülür.",
    ],
    counter_evidence: [
      "Propp'un çözümlemesi de eleştirildi: işlev birimlerinin esnekliği ve külliyat seçimi tartışıldı. Buradaki üstünlük sonuçta değil, yöntemde - iddia sınanabilir biçimde kurulmuştu.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Propp, Vladimir"],
        year: 1928,
        title: "Morphology of the Folktale",
        language: "ru",
        note: "Tanımlı külliyat üzerine kurulmuş sınanabilir iddianın örneği.",
      },
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Campbell, Joseph"],
        year: 1949,
        title: "The Hero with a Thousand Faces",
        language: "en",
        note: "İncelenen tezin kendisi; kanıt olarak değil.",
      },
    ],
    checked: CHECKED,
    used_in: ["kendi-kaniti"],
  },
];

const mevcut = new Set(list.map((r) => r.id));
const eklenen = [];
for (const r of yeni) {
  if (mevcut.has(r.id)) { console.log("ATLANDI:", r.id); continue; }
  list.push(r);
  eklenen.push(r.id);
}
writeFileSync(path, JSON.stringify(list, null, 2) + "\n", "utf8");
console.log(`${eklenen.length} kayıt eklendi`);
eklenen.forEach((id) => console.log("  +", id));
console.log("mitoloji.json toplam:", list.length);
