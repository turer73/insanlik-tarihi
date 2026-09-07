import { readFileSync, writeFileSync } from "node:fs";

const path = "data/findings/mitoloji.json";
const list = JSON.parse(readFileSync(path, "utf8"));
const CHECKED = "2026-09-07";

const yeni = [
  {
    id: "ates-hirsizligi-zorunlu-motif",
    claim:
      "Ateşin insanlara başka birinden geçmesi motifinin yaygınlığı, ortak köken kanıtı değildir.",
    status: "established",
    confidence: "high",
    topic: ["mitoloji", "ates-hirsizligi", "motif-dagilimi", "yontem"],
    subject: {
      site: "Yunan, Polinezya, Kuzeybatı Kıyısı, Vedik gelenekler",
      region: "küresel",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: -700,
      latest: 1900,
      era_label: "Hesiodos'tan etnografik derlemelere",
      precision: "range",
      dating_method: ["textual", "historical-record"],
    },
    languages: ["Grekçe", "Maori", "Tlingit", "Sanskritçe"],
    disciplines: ["antropoloji", "filoloji", "dilbilim"],
    popular_claim:
      "Ateş hırsızlığı anlatısı dünyanın her yerinde var; bu, hepsinin ortak bir kökenden geldiğini gösterir.",
    divergence:
      "Motif gerçekten yaygın ama BİLGİLENDİRİCİ DEĞİL, çünkü zorunlu uçta duruyor. Ateşin gündelik gerçeği şudur: ateş yoktan yaratılmaz, ELDE EDİLİR - yıldırımdan alınır, başka kamptan getirilir, sürtmeyle çıkarılır. Dolayısıyla 'ateş başlangıçta bizde değildi, birinden alındı' anlatısı ateşle yaşayan her toplulukta kendiliğinden makuldür. Ortak ata gerekmiyor, ateşin fiziği yetiyor. Üç anlatının paylaştığı şey bir hikâye değil, bir CÜMLE ŞABLONUDUR.",
    divergence_type: ["kategori-hatasi", "medya-abartisi"],
    evidence: [
      "Prometheus tanrılardan ateşi ÇALAR ve sonsuza kadar cezalandırılır.",
      "Māui ateşi Mahuika'dan tırnak tırnak ALIR ve tüketir; kaçar, cezalandırılmaz; ateş ağaçlara sığınır ve bu, sürtmeyle ateş yakmayı açıklar.",
      "Kuzgun anlatısının çekirdeği ateş değil IŞIK hırsızlığıdır; ateş yalnızca bazı anlatımlarda geçer.",
      "Vedik gelenekte Mātariśvan ateşi gökten getirir ama hilebaz değildir.",
      "Ortak olan yalnızca en soyut düzeyde: ateş başlangıçta insanlarda değil, birinde var, kurnaz bir figür alıyor, insanlar kullanabiliyor.",
    ],
    counter_evidence: [
      "Bölgesel alt-desenler bilgilendirici OLABİLİR: belirli bir bölgede paylaşılan keyfî ayrıntılar (örneğin ateşi hayvanlar arasında bayrak yarışıyla taşımak) temas ya da yerel ortak köken gösterebilir. Bu kayıt o düzeye inmemiştir.",
      "'Polinezya' ve 'Kuzeybatı Kıyısı' başlıkları çok sayıda ayrı geleneği kapsar.",
    ],
    open_questions: [
      "Motifin bölgesel alt-desenleri nelerdir? Asıl iş orada, bu kayıt genel motif düzeyinde kaldı.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        authors: ["Hesiodos"],
        title: "Theogonia ve İşler ve Günler (Prometheus anlatısı)",
        language: "grc",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Theft of fire",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Theft_of_fire",
        language: "en",
        accessed: "2026-09-07",
        note: "Ara kaynak; motif dağılımının genel görünümü için.",
      },
    ],
    checked: CHECKED,
    used_in: ["calinan-ates"],
  },

  {
    id: "prometheus-pramantha-etimolojisi",
    claim:
      "Prometheus adı Sanskritçe pramantha (ateş burgusu) sözcüğünden gelir ve bu, Hint-Avrupa ortak kökeninin kanıtıdır.",
    status: "refuted",
    confidence: "medium",
    topic: ["mitoloji", "ates-hirsizligi", "dilbilim", "yontem"],
    subject: {
      site: "Yunan ve Vedik gelenekler",
      region: "Hint-Avrupa dil alanı",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: -700,
      latest: 2026,
      era_label: "Anlatının yazımından etimoloji tartışmasına",
      precision: "range",
      dating_method: ["textual"],
    },
    languages: ["Grekçe", "Sanskritçe"],
    disciplines: ["dilbilim", "filoloji", "antropoloji"],
    people: [
      { name: "Müller, Max", role: "proposer", year: 1870, lifespan: "1823-1900" },
      { name: "Watkins, Calvert", role: "critic", affiliation: "Harvard University", year: 2000, lifespan: "1933-2013" },
    ],
    popular_claim:
      "Prometheus adının Sanskritçe ateş burgusu pramantha ile aynı kökten geldiği kanıtlanmıştır.",
    divergence:
      "İddia 19. yüzyılda önerildi ve o günden beri 'kesin kanıt' olarak dolaşıyor. Çekici çünkü hem ses hem anlam uyuyor GİBİ: ateş getiren figürün adı, ateş yakan aletin adı. Ama BİÇİMSEL OLARAK OTURMUYOR - Sanskritçe pramantha gerçekten 'ateş burgusu' demektir ve 'şiddetle karıştırmak' anlamındaki bir kökten gelir, ancak Yunanca Promētheus ile düzenli ses karşılıkları kurulamıyor. Yunanca içi türetme ise sorunsuz çalışıyor: pro- (önce) + *mēthos (düşünmek/öğrenmek) = 'önceden düşünen'. Kardeşinin adının Epimetheus ('sonradan düşünen') olması bu okumayı destekliyor - ikisi bir çift oluşturuyor.",
    divergence_type: ["eski-ceviri", "guncellenmemis", "medya-abartisi"],
    evidence: [
      "Antik dönemden beri ad 'önceden düşünen' olarak yorumlanır: pro- + mathein/mēthos.",
      "Epimetheus ('sonradan düşünen') ile oluşturduğu çift, Yunanca içi türetmeyi destekler.",
      "Sanskritçe türetme 19. yüzyıl karşılaştırmalı mitoloji geleneğinden gelir ve biçimsel karşılık sorunludur.",
    ],
    counter_evidence: [
      "Alternatif bir öneri, ikinci öğenin 'çalmak' anlamındaki bir kökten gelebileceğini savunur - bu da tartışmalıdır.",
      "Etimoloji tartışması kapanmış değildir; Yunanca içi türetme baskın görüştür ama ikinci öğe için öneriler sürüyor.",
      "Bu kayıt Sanskritçe bağlantısının YERLEŞİK OLMADIĞINI söyler; kesin olarak imkânsız olduğunu değil.",
    ],
    open_questions: [
      "İkinci öğenin kökeni kesin olarak belirlendi mi? Hayır.",
    ],
    sources: [
      {
        tier: "institutional",
        type: "webpage",
        title: "Prometheus - Etymology, Origin & Meaning",
        container: "Online Etymology Dictionary",
        url: "https://www.etymonline.com/word/prometheus",
        language: "en",
        accessed: "2026-09-07",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Pramantha/Prometheus: a false etymology?",
        url: "https://wrdingham.co.uk/cybalist/msg/169/75.html",
        language: "en",
        accessed: "2026-09-07",
        note: "Biçimsel uyuşmazlık tartışması.",
      },
    ],
    checked: CHECKED,
    used_in: ["calinan-ates"],
  },

  {
    id: "hilebaz-kategorisi-uretilmis",
    claim:
      "'Hilebaz' / 'kültür kahramanı' kategorisi doğal bir mitolojik türdür.",
    status: "contested",
    confidence: "medium",
    topic: ["mitoloji", "yontem", "karsilastirmali-mitoloji"],
    subject: {
      site: "Karşılaştırmalı mitoloji kategorileri",
      region: "kuramsal",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 1880,
      latest: 2026,
      era_label: "Kategorinin tanımlanmasından bugüne",
      precision: "range",
      dating_method: ["historical-record"],
    },
    disciplines: ["antropoloji", "filoloji"],
    popular_claim:
      "Hilebaz figürü tüm dünya mitolojilerinde bulunan evrensel bir arketiptir.",
    divergence:
      "Kategori gerçek bir düzenliliği yakalıyor OLABİLİR - sınırları çiğneyen, kurnazlıkla iş gören, insanlığa bir şey kazandıran figür. Ama uyarı gerekiyor: 'hilebaz' kategorisi 19.-20. yüzyıl antropolojisinin ürünüdür ve TANIMLANDIKTAN SONRA her yerde bulunmuştur - monomit vakasındaki mekanizmanın aynısı. Kategoriye koymak bir bulgu değil, bir İŞLEMDİR. Bulgu olması için kategorinin dışında kalan vakaların da gösterilmesi gerekir; gösterildiğinde kategori daralır: Māui cezalandırılmaz, Kuzgun ateş değil ışık getirir, Mātariśvan hilebaz değildir.",
    divergence_type: ["kategori-hatasi", "somurge-anlatisi"],
    evidence: [
      "Prometheus, Māui, Kuzgun ve Çakal genellikle aynı başlık altında toplanır.",
      "Kategori 19.-20. yüzyıl antropolojisinde tanımlandı ve sonra evrensel olarak 'bulundu'.",
      "Kategoriye alınan vakalar temel özelliklerde ayrışıyor: ceza, alınan şey, alanın türü.",
    ],
    counter_evidence: [
      "Kültür kahramanı figürünün yaygınlığı gerçek bir SOSYOLOJİK düzenlilik olabilir ve insan topluluklarının anlatı ihtiyaçları hakkında bir şey söyleyebilir.",
      "Bu kayıt kategorinin işe yaramaz olduğunu söylemez; 'yaygın olması ortak kökene kanıttır' çıkarımını reddeder. İkisi ayrı iddialardır.",
    ],
    open_questions: [
      "Kategorinin dışında kalan vakalar sistematik olarak sayıldı mı? Bu yapılmadan yaygınlık iddiası sınanamaz.",
    ],
    sources: [
      {
        tier: "institutional",
        type: "webpage",
        title: "Why Folklorists Hate Joseph Campbell's Work",
        authors: ["Jorgensen, Jeana"],
        url: "https://www.patheos.com/blogs/foxyfolklorist/why-folklorists-hate-joseph-campbells-work/",
        language: "en",
        accessed: "2026-09-07",
        note: "Kategori üretme mekanizması üzerine folklorcu eleştirisi.",
      },
      {
        tier: "peer-reviewed",
        type: "article",
        title: "The Cultural Transmission and Evolution of Folk Narratives",
        url: "https://durham-repository.worktribe.com/OutputFile/1642267",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["calinan-ates"],
  },

  {
    id: "ulker-takvim-bagimsiz-icat",
    claim:
      "Ülker'in mevsim takvimi olarak dünyanın dört bir yanında kullanılması, bağımsız icadın en güçlü vakalarından biridir.",
    status: "established",
    confidence: "high",
    topic: ["mitoloji", "ulker", "arkeoastronomi", "takvim", "yontem"],
    subject: {
      site: "Ülker (Pleiades) yıldız kümesi",
      region: "küresel",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: -700,
      latest: 2026,
      era_label: "Hesiodos'tan günümüz tarımına",
      precision: "range",
      dating_method: ["astronomical", "textual", "historical-record"],
    },
    languages: ["Grekçe", "Maori", "Japonca", "Türkçe", "Keçuvaca"],
    disciplines: ["astronomi", "antropoloji", "tarih"],
    people: [
      { name: "Hesiodos", role: "editor", year: -700 },
    ],
    popular_claim:
      "Ülker'in tüm kültürlerde önemli olması, ortak bir kadim bilginin kanıtıdır.",
    divergence:
      "Sebep mitolojik değil, GÖK MEKANİĞİ. Ülker gökyüzündeki en dikkat çekici sıkışık yıldız kümesidir; tek yıldızlardan farklı olarak leke gibi görünür ve bir kez tanındıktan sonra kaçırılması zordur. Güneşten hemen önce doğuşu ve batışı HER YIL AYNI MEVSİME denk gelir. Küme ekvatora yakın olduğu için yerleşilebilir dünyanın neredeyse tamamından görülür. Yani ortada herkesin gördüğü, herkes için aynı anda çalışan ücretsiz bir mevsim saati var. Tarım yapan bir topluluğun bunu fark etmemesi, fark etmesinden daha şaşırtıcı olurdu. Aynı problem, aynı çözüm, aynı gökyüzü.",
    divergence_type: ["kategori-hatasi"],
    evidence: [
      "Hesiodos doğuşunda hasat, batışında sürüm önerir; denizciliğin güvenli mevsimi de buna bağlanır.",
      "And Dağları'nda haziranda kümenin parlaklığına bakılarak patates ekim tarihi belirlenir.",
      "Maori geleneğinde kümenin yeniden görünmesi (Matariki) yılbaşıdır.",
      "Japonca adı Subaru 'bir araya gelmek'ten gelir ve kümenin görünüşünü tarif eder.",
      "Kullanım ezici çoğunlukla mevsim ve tarım zamanlamasıdır - ortak kökene değil ORTAK SORUNA işaret eder.",
    ],
    counter_evidence: [
      "Kullanım biçimlerindeki ayrıntılar (hangi eşik, hangi ürün, hangi tören) bölgesel olarak farklıdır ve bunların bir kısmı temasla yayılmış olabilir.",
      "Anadolu geleneği bu kayıtta yüzeysel ele alınmıştır.",
    ],
    open_questions: [
      "Ülker'in Türk halk takvimindeki yeri ayrıntılı incelenmedi; yerel kaynak erişimi kolay olduğu için ayrı bir çalışmayı hak ediyor.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        authors: ["Hesiodos"],
        title: "İşler ve Günler (Ülker'in doğuşu ve batışına göre tarım takvimi)",
        language: "grc",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Pleiades",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Pleiades",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["herkesin-saati"],
  },

  {
    id: "and-ulker-elnino-tahmini",
    claim:
      "And çiftçilerinin Ülker'in parlaklığına bakarak yaptığı ekim tahmini, uydu verileriyle doğrulanmış işleyen bir iklim tahminidir.",
    status: "established",
    confidence: "high",
    topic: ["ulker", "arkeoastronomi", "iklim", "geleneksel-bilgi"],
    subject: {
      site: "And Dağları yüksek yaylaları",
      region: "Peru ve Bolivya",
      modern_country: "Peru / Bolivya",
      coordinates: { lat: -15.5, lon: -70.0 },
    },
    period: {
      earliest: 1500,
      latest: 2026,
      era_label: "Geleneksel uygulamadan modern doğrulamaya",
      precision: "range",
      dating_method: ["astronomical", "historical-record"],
    },
    languages: ["Keçuvaca", "Aymarca", "İspanyolca"],
    disciplines: ["astronomi", "iklim-bilimi", "antropoloji"],
    people: [
      { name: "Orlove, Benjamin S.", role: "analyst", affiliation: "University of California, Davis", year: 2000 },
    ],
    popular_claim:
      "Gökyüzüne bakarak tarım takvimi kurmak bilim öncesi bir inanç pratiğidir.",
    divergence:
      "Bu vakada değil: uygulama GERÇEKTEN BİLGİ TAŞIYAN bir sinyalin okunmasıdır ve modern aletle sınanıp doğrulanmıştır. Zincir şudur: haziranda Ülker soluk görünüyorsa, yüksek irtifada ince bulut ve su buharı artmış demektir; bu El Niño yılının erken işaretidir; El Niño ekim mevsiminde daha az yağış ve düşük hasat getirir. Çiftçiler çıplak gözle, AYLAR ÖNCESİNDEN, işleyen bir tahmin yapıyorlar - meteorolojinin ancak sonradan adlandırdığı bir iklim olayını okuyarak.",
    divergence_type: ["somurge-anlatisi", "guncellenmemis"],
    evidence: [
      "Çiftçiler haziranda kümenin görünürlüğüne bakarak patates ekimini erteleyip ertelemeyeceklerine karar veriyor.",
      "Uydu verileri (bulut miktarı ve su buharı ölçümleri) görünürlükteki azalma ile El Niño arasındaki bağı doğruladı.",
      "Bulgu Nature'a gönderilen bir mektupta yayımlandı.",
    ],
    counter_evidence: [
      "Bu kayıt mekanizmayı doğrular; geleneksel yöntemin İSABET ORANINI vermez. Modern tahminle karşılaştırmalı başarım ayrı bir sorudur.",
    ],
    open_questions: [
      "Geleneksel yöntemin isabet oranı modern tahminle karşılaştırıldığında nedir?",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "article",
        authors: ["Orlove, Benjamin S.", "Chiang, John C. H.", "Cane, Mark A."],
        year: 2000,
        title: "Forecasting Andean rainfall and crop yield from the influence of El Niño on Pleiades visibility",
        container: "Nature",
        language: "en",
      },
      {
        tier: "institutional",
        type: "press-release",
        title: "Andean Farmers Accurately Time Rains, Planting, By The Stars",
        institution: "UC Davis",
        url: "https://www.ucdavis.edu/news/andean-farmers-accurately-time-rains-planting-stars",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["herkesin-saati"],
  },

  {
    id: "yedi-kiz-kardes-derin-koken",
    claim:
      "Ülker'in 'yedi kız kardeş, biri kayıp' anlatısı, insanların Afrika'dan yayılmasından önceye, yaklaşık yüz bin yıl öncesine dayanır.",
    status: "minority",
    confidence: "low",
    topic: ["mitoloji", "ulker", "arkeoastronomi", "yontem"],
    subject: {
      site: "Ülker (Pleiades) yıldız kümesi",
      region: "küresel",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: -100000,
      latest: 2021,
      era_label: "İddia edilen köken derinliğinden önerinin yayımına",
      precision: "disputed",
      dating_method: ["astronomical", "none"],
    },
    disciplines: ["astronomi", "antropoloji", "dilbilim"],
    people: [
      { name: "Norris, Ray P.", role: "proposer", affiliation: "Western Sydney University / CSIRO", year: 2021 },
      { name: "Norris, Barnaby R. M.", role: "proposer", affiliation: "University of Sydney", year: 2021 },
    ],
    popular_claim:
      "Bilim, insanlığın en eski hikâyesinin yüz bin yıllık olduğunu gösterdi.",
    divergence:
      "Öneri serinin ölçütünü iyi karşılıyor: ayrıntı KEYFÎ (çıplak gözle çoğu insan altı yıldız seçer ama anlatı yedi der), dağılım geniş, ve açıklama fiziksel olarak sınanabilir bir şeye dayanıyor - Pleione ve Atlas zaman içinde birbirine yaklaştı, çok uzun zaman önce ayrı ayrı seçilebiliyor olmalıydı. AMA desteklenmiş değil. NOT: bu öneriye yöneltilmiş yayımlanmış reddiyelere araştırmamızda RASTLANMADI; bu, önerinin kabul gördüğü anlamına gelmez, yalnızca bakabildiğimiz yerde tartışmanın izine rastlamadığımız anlamına gelir ve bir sınırlılık olarak kaydedilir.",
    divergence_type: ["medya-abartisi", "provenans-yoklugu"],
    evidence: [
      "Çıplak gözle çoğu insan altı yıldız seçer ama pek çok gelenek kümeyi yedi olarak sayar - ayrıntı gökyüzü tarafından dayatılmıyor.",
      "Pek çok gelenekte anlatı 'yedi kız kardeş' biçimindedir ve sık sık birinin kayıp ya da saklanmış olduğu ayrıntısını taşır.",
      "Pleione ve Atlas'ın öz hareketi hesaplanabilir; geçmişte açısal ayrımları daha genişti.",
    ],
    counter_evidence: [
      "Yüz bin yıllık anlatı kararlılığı için bir MEKANİZMA sunulmuyor; bu, alanın denediği en uzun zaman ölçeğidir ve mit filogenetiği henüz kalibre edilmedi (bkz. mit-filogenetigi-kalibre-degil).",
      "'Yedi' bağımsız olarak yüklü bir sayıdır: gezegen sayısı, hafta günü, tekrarlayan anlatı kalıpları. Bir gelenek yedi sayıyorsa sebep gökyüzü değil sayının kendisi olabilir.",
      "Görülen yıldız sayısı sabit değildir; göz keskinliğine, gökyüzü karanlığına ve havaya göre değişir - bazı insanlar gerçekten yedi ve daha fazlasını seçer.",
      "'Çoğu kültür yedi diyor' ifadesi sayılmamıştır; hangi gelenekler, hangi derlemelerden ve sömürge dönemi teması elenerek mi - bunlar gösterilmemiştir.",
      "Öneri astronomlardan gelmektedir, folklorculardan değil.",
    ],
    open_questions: [
      "Kaç gelenek gerçekten 'yedi' diyor? Sayılmadı.",
      "Yayımlanmış reddiye var mı? Aramamızda bulunamadı - bu bir onay değildir.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "article",
        authors: ["Norris, Ray P.", "Norris, Barnaby R. M."],
        year: 2021,
        title: "Why are there Seven Sisters?",
        url: "https://arxiv.org/abs/2101.09170",
        language: "en",
        accessed: "2026-09-07",
        note: "İncelenen öneri; kanıt olarak değil, değerlendirilen tez olarak kaydedildi.",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Pleiades",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Pleiades",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    volatile: true,
    used_in: ["herkesin-saati"],
  },

  {
    id: "zorunlu-keyfi-ekseni",
    claim:
      "Bir mitolojik benzerliğin bilgi değeri, yaygınlığıyla değil, ayrıntının ne kadar keyfî olduğuyla belirlenir.",
    status: "established",
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
    disciplines: ["antropoloji", "felsefe", "astronomi"],
    popular_claim:
      "Bir motif ne kadar çok kültürde varsa, ortak köken kanıtı o kadar güçlüdür.",
    divergence:
      "Sezgi ters çalışıyor. Doğanın dayattığı benzerlikler YAYGIN oldukları için etkileyici görünür ama hiçbir şey söylemez: fırtına ve yılan her yerde vardır, ateş her yerde alınarak elde edilir, Ülker her yerde aynı mevsimde doğar. Seçilmiş ayrıntılardaki benzerlikler ise NADİR ve DAĞINIK oldukları için zayıf görünür ama tek bilgi taşıyan onlardır: yedi yıldıza ayı demek, altı görünen kümeye yedi demek. Ölçüt şudur: DOĞA NEYİ DAYATIYOR, NE SEÇİLMİŞ.",
    divergence_type: ["kategori-hatasi", "medya-abartisi"],
    evidence: [
      "Zorunlu uçtaki örnekler: fırtına tanrısının yılanı öldürmesi, ateşin başkasından alınması, Ülker'in takvim olarak kullanılması. Üçü de yaygın, üçü de bilgilendirici değil.",
      "Keyfî uçtaki örnekler: Büyük Ayı'nın avlanan hayvan olması, Ülker'in 'yedi kız kardeş, biri kayıp' anlatısı. İkisi de dağınık, ikisi de açıklanmayı hak ediyor.",
      "Ve ikisi de HENÜZ ÇÖZÜLMEDİ - çünkü zor taraf orası.",
      "Aynı nesne (Ülker) ekseni iki ucundan birden gösteriyor: kullanımı zorunlu, sayımı keyfî.",
    ],
    counter_evidence: [
      "'Keyfî' ölçütü niceliksel değildir; neyin keyfî sayılacağı yorumcuya bağlıdır ve bu, ölçütün en zayıf noktasıdır.",
      "Zorunlu-keyfî ayrımı süreklidir, ikili değildir; pek çok motif arada kalır.",
    ],
    open_questions: [
      "'Keyfîlik' niceliksel olarak tanımlanabilir mi? Tanımlanabilirse yöntem ciddi biçimde güçlenir.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "chapter",
        title: "Phylogenetics Meets Folklore: Bioinformatics Approaches to the Study of International Folktales",
        url: "https://link.springer.com/content/pdf/10.1007/978-3-319-39445-9_6.pdf",
        language: "en",
        accessed: "2026-09-07",
      },
      {
        tier: "peer-reviewed",
        type: "article",
        title: "The Cultural Transmission and Evolution of Folk Narratives",
        url: "https://durham-repository.worktribe.com/OutputFile/1642267",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["calinan-ates", "herkesin-saati"],
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
