import { readFileSync, writeFileSync } from "node:fs";

const path = "data/findings/roma.json";
const list = JSON.parse(readFileSync(path, "utf8"));
const CHECKED = "2026-09-07";

const yeni = [
  {
    id: "isa-tarihsellik-esigi",
    claim:
      "1. yüzyılda Yahudiye'de yaşamış ve Pilatus döneminde idam edilmiş bir İsa'nın varlığı, sıradan tarihsel eşikte karşılanmıştır.",
    status: "established",
    confidence: "high",
    topic: ["isa", "hristiyanlik", "kaynak-elestirisi", "yontem"],
    subject: {
      site: "Yahudiye eyaleti",
      region: "Roma Doğu eyaletleri",
      modern_country: "İsrail / Filistin",
      coordinates: { lat: 31.78, lon: 35.22 },
    },
    period: {
      earliest: 30,
      latest: 121,
      era_label: "Olaydan kaynakların yazımına",
      precision: "range",
      dating_method: ["textual", "historical-record", "paleography"],
    },
    languages: ["Grekçe", "Latince", "Aramice"],
    disciplines: ["tarih", "metin-elestirisi", "filoloji"],
    people: [
      { name: "Pavlus (Tarsuslu)", role: "editor", year: 55 },
      { name: "Flavius Josephus", role: "analyst", year: 93, lifespan: "y. 37-100" },
      { name: "Publius Cornelius Tacitus", role: "analyst", year: 116, lifespan: "y. 56-120" },
    ],
    popular_claim:
      "İsa hakkında çağdaş hiçbir kayıt yoktur; dolayısıyla var olduğu söylenemez.",
    divergence:
      "İtiraz yanlış EŞİĞİ kullanıyor. 1. yüzyılda seçkin olmayan bir taşra figürü için normal olan, HİÇ kayıt olmamasıdır - imparatorluk nüfusunun binde birinden azının adı bilinir. Aynı ölçüt Hillel'e, Vaftizci Yahya'ya ve dönemin diğer figürlerine uygulandığında onları da yok saymak gerekir. Doğru soru 'çağdaş kayıt var mı' değil, 'benzer figürlerle karşılaştırıldığında bu kayıtlar nerede duruyor'.",
    divergence_type: ["kategori-hatasi"],
    evidence: [
      "En yakın kayıt Pavlus'un mektupları (y. 50'ler, olaydan ~23 yıl sonra) ve BİRİNCİ AĞIZDAN: Galatyalılar 1:19'da 'Rab'bin kardeşi Yakup' ile görüştüğünü yazıyor - mucize değil, sıradan biyografik ayrıntı.",
      "Josephus, Eskiçağ Tarihi 20.200'de (93-94) Yakup'u 'Mesih denilen İsa'nın kardeşi' diye tanımlıyor; kısa, geçerken söylenmiş, övgüsüz - bu yüzden müdahale şüphesi düşük.",
      "Tacitus, Annales 15.44 (y. 116) Tiberius döneminde vali Pontius Pilatus tarafından idam edildiğini yazıyor; bağımsız ve açıkça küçümseyici bir Roma kaydı.",
      "Pilatus döneminde çarmıha gerilme maddesi, dinî bağlantısı olmayan, Yahudi ve ateist tarihçilerce de kabul edilir - kurumsal yanlılık argümanı bu maddeyi tek başına düşürmüyor.",
    ],
    counter_evidence: [
      "Anlatılar tam bağımsız değil: Matta ve Luka Markos'u kaynak alıyor. 'Dört bağımsız tanık' ifadesi yanlıştır.",
      "Bütün erken kaynaklar taraf olan kaynaklardır; taraf olmayan iki kayıt (Josephus, Tacitus) olaydan 60-90 yıl sonradır.",
      "Yeni Ahit çalışmaları alanında kurumsal yanlılık riski gerçektir; akademisyenlerin önemli bölümü dinî kurumlarda çalışır.",
      "İdam yılı 30 mu 33 mü kesinleşmemiştir.",
    ],
    open_questions: [
      "Anlatılarda kaç ayrı bağımsız geleneğin izi sürülebilir? Alanda tartışmalı.",
      "İdam yılı 30 mu 33 mü?",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        authors: ["Pavlus"],
        year: 55,
        title: "Galatyalılara Mektup 1:18-19",
        language: "grc",
        note: "Birinci ağızdan tanışma beyanı; en erken kayıt.",
      },
      {
        tier: "primary",
        type: "edition",
        authors: ["Flavius Josephus"],
        year: 93,
        title: "Antiquitates Judaicae 20.200",
        language: "grc",
        note: "Yakup pasajı; Testimonium'un aksine geniş kabul görür.",
      },
      {
        tier: "primary",
        type: "edition",
        authors: ["Tacitus, Publius Cornelius"],
        year: 116,
        title: "Annales 15.44",
        language: "la",
        note: "Bağımsız Roma kaydı; sahihliği alanda geniş kabul görür.",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Tacitus on Jesus",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Tacitus_on_Jesus",
        language: "en",
        accessed: "2026-09-07",
        note: "Ara kaynak; alanın uzlaşı durumunun özeti için.",
      },
    ],
    checked: CHECKED,
    used_in: ["isa-tarihsellik"],
  },

  {
    id: "testimonium-flavianum-mudahale",
    claim:
      "Josephus'un Eskiçağ Tarihi 18.63'teki pasajı Hristiyan müdahalesi görmüştür; özgün bir çekirdeğin var olup olmadığı tartışmalıdır.",
    status: "contested",
    confidence: "high",
    topic: ["isa", "josephus", "metin-elestirisi", "yontem"],
    subject: {
      site: "Antiquitates Judaicae elyazması geleneği",
      region: "Roma İmparatorluğu / Bizans kopyalama geleneği",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 93,
      latest: 1000,
      era_label: "Yazımdan Arapça/Süryanice aktarımlara",
      precision: "range",
      dating_method: ["paleography", "textual"],
    },
    languages: ["Grekçe", "Arapça", "Süryanice"],
    disciplines: ["metin-elestirisi", "filoloji", "tarih"],
    people: [
      { name: "Flavius Josephus", role: "editor", year: 93, lifespan: "y. 37-100" },
    ],
    popular_claim:
      "Josephus İsa hakkında yazmıştır ve bu, tarihselliğin tartışmasız kanıtıdır. (Karşı popüler iddia: pasajın tamamı sahtedir, dolayısıyla Josephus hiçbir şey söylememiştir.)",
    divergence:
      "İki popüler iddia da alanın gerçek durumunu yanlış aktarıyor. 'O, Mesih'ti' cümlesinin sonradan eklendiği neredeyse evrensel kabul görür - yani pasaj olduğu gibi kullanılamaz. Ama tamamının sahte olduğu da uzlaşı değil, güçlü bir azınlık görüşüdür. Bir literatür taramasında değerlendirilen 52 akademisyenin dağılımı: 4 tamamen özgün, 6 büyük ölçüde özgün, 20 bazı eklemelerle özgün, 9 birçok eklemeyle özgün, 13 tamamı sonradan eklenmiş. Yani %56'lık orta grup 'özgün çekirdek + müdahale' modelinde birleşiyor, %25'lik azınlık tamamen reddediyor.",
    divergence_type: ["ideolojik-secim", "medya-abartisi"],
    evidence: [
      "Bir Yahudi tarihçinin kaleminden 'O, Mesih'ti' cümlesi çıkmaz; bu ifadenin eklendiği neredeyse evrensel kabul görür.",
      "9.-10. yüzyıla ait Arapça ve Süryanice aktarımlar pasajı büyük ölçüde aynı biçimde veriyor AMA en şüpheli iki ifadeyi - 'O, Mesih'ti' ve 'eğer ona insan denebilirse' - içermiyor. Müdahale öncesi hâle dair bağımsız bir iz.",
      "Aynı eserin 20.200'ündeki Yakup pasajı kısa ve övgüsüz; bir Hristiyan kopyacının orada da müdahale etmiş olması beklenirdi, etmemiş.",
    ],
    counter_evidence: [
      "%25'lik azınlık (13/52) pasajın TAMAMININ eklendiğini savunuyor ve bu görüş yaşayan bir görüştür - küçümsenerek geçilemez.",
      "Elimizdeki tüm Grekçe elyazmaları Hristiyan kopyalama geleneğinden gelir; müdahale öncesi bir Grekçe tanık yoktur.",
      "Arapça/Süryanice aktarımların bağımsızlığı da tartışmalıdır; ortak bir ara kaynaktan gelmiş olabilirler.",
      "Sayısal dağılım bir ANKET değil, yayımlanmış görüşlerin derlemesidir; alanın tamamının sayımı sayılamaz.",
    ],
    open_questions: [
      "Pasajın özgün hâli neydi? Kesin metin elde yok.",
      "Arapça ve Süryanice aktarımlar gerçekten bağımsız mı?",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        authors: ["Flavius Josephus"],
        year: 93,
        title: "Antiquitates Judaicae 18.63-64 (Testimonium Flavianum)",
        language: "grc",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Josephus and Jesus: The Testimonium Flavianum Question",
        url: "http://www.earlychristianwritings.com/testimonium.html",
        language: "en",
        accessed: "2026-09-07",
        note: "52 akademisyenlik pozisyon derlemesinin kaynağı; anket değil, literatür taraması.",
      },
    ],
    checked: CHECKED,
    volatile: true,
    used_in: ["isa-tarihsellik"],
  },

  {
    id: "tacitus-procurator-anakronizmi",
    claim:
      "Tacitus'un Pilatus'a yanlış unvan (procurator) vermesi, pasajın sonradan eklenmediğini gösteren bir kanıttır.",
    status: "established",
    confidence: "medium",
    topic: ["isa", "tacitus", "metin-elestirisi", "yontem"],
    subject: {
      site: "Annales elyazması geleneği",
      region: "Roma İmparatorluğu",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 116,
      latest: 1100,
      era_label: "Yazımdan Codex Mediceus'a",
      precision: "range",
      dating_method: ["paleography", "epigraphic", "textual"],
    },
    languages: ["Latince"],
    disciplines: ["metin-elestirisi", "filoloji", "epigrafi", "tarih"],
    people: [
      { name: "Publius Cornelius Tacitus", role: "editor", year: 116, lifespan: "y. 56-120" },
    ],
    popular_claim:
      "Tacitus'un pasajı sonradan Hristiyanlarca eklenmiştir.",
    divergence:
      "Pasajın içindeki HATA, ekleme tezinin aleyhine çalışıyor. Tacitus Pilatus'u 'procurator' diye anıyor; oysa Kayseriye yazıtı unvanın 'praefectus' olduğunu gösteriyor - procurator sonraki bir dönemin kullanımıdır. Tacitus bir Roma arşiv kaydından kopyalasaydı doğru unvanı yazardı. Yanlış unvan, kendi döneminin dilini kullandığını, yani pasajı KENDİSİNİN kaleme aldığını gösteriyor. Sonradan araya sokulmuş bir Hristiyan eklemesinin hem küçümseyici üslup tutturup hem bu tür bir idari anakronizm yapması beklenmez.",
    divergence_type: ["kategori-hatasi"],
    evidence: [
      "Tacitus, Annales 15.44'te Pilatus'un unvanını 'procurator' olarak veriyor.",
      "1961'de Kayseriye'de bulunan yazıt Pilatus'un unvanının 'praefectus' olduğunu gösteriyor - farklı bir idari sınıf.",
      "Pasajı taşıyan en eski elyazmasında sözcük 'chrestianos' biçiminde yazılmış, sonradan 'christianos' olarak düzeltilmiş. Chrestus yaygın bir köle adıydı; bu, adı tam bilmeyen dışarıdan birinin yazımıdır. Bir Hristiyan kopyacı kendi dininin adını yanlış yazmaz.",
      "Pasajın üslubu Hristiyanlara açıkça düşmanca - bir Hristiyan eklemesinden beklenmez.",
    ],
    counter_evidence: [
      "Tacitus'un anakronizmi kasıtsız bir kolaylık da olabilir; Romalı yazarlar geçmiş dönem unvanlarını kendi dönemlerinin terimleriyle vermeye eğilimliydi. Bu, argümanı zayıflatmaz ama tek başına belirleyici de kılmaz.",
      "Tacitus'un bilgisinin kaynağı belirsiz: Roma arşivi mi, kendi döneminde Hristiyanlar hakkında bilinenler mi? Büyük olasılıkla ikincisi - bu durumda pasaj bağımsız bir kanıt değil, 2. yüzyıl başında bilinenin kaydıdır.",
      "Elimizdeki metin tek bir elyazması koluna dayanıyor.",
    ],
    open_questions: [
      "Tacitus bilgiyi nereden aldı? Roma arşivi olduğuna dair kanıt yok.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        authors: ["Tacitus, Publius Cornelius"],
        year: 116,
        title: "Annales 15.44",
        language: "la",
      },
      {
        tier: "primary",
        type: "inscription",
        year: 30,
        title: "Pilatus yazıtı (Kayseriye)",
        language: "la",
        note: "Pilatus'un unvanını 'praefectus' olarak veren tek çağdaş fiziksel kanıt.",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Tacitus on Jesus",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Tacitus_on_Jesus",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["isa-tarihsellik"],
  },

  {
    id: "pilatus-yaziti-kayseriye",
    claim:
      "Pontius Pilatus'un varlığını ve unvanını doğrudan belgeleyen tek çağdaş fiziksel kanıt, 1961'de Kayseriye'de bulunan taş yazıttır.",
    status: "established",
    confidence: "high",
    topic: ["isa", "roma", "epigrafi", "yahudiye"],
    subject: {
      site: "Caesarea Maritima (Kayseriye)",
      site_native: "Καισάρεια",
      region: "Yahudiye eyaleti, Akdeniz kıyısı",
      modern_country: "İsrail",
      coordinates: { lat: 32.5, lon: 34.8917 },
    },
    period: {
      earliest: 26,
      latest: 36,
      era_label: "Pilatus'un valiliği, Tiberius dönemi",
      precision: "range",
      dating_method: ["epigraphic", "stratigraphy", "historical-record"],
    },
    languages: ["Latince"],
    disciplines: ["epigrafi", "arkeoloji", "tarih"],
    people: [
      { name: "Frova, Antonio", role: "discoverer", affiliation: "Milano Üniversitesi İtalyan heyeti", year: 1961 },
    ],
    popular_claim:
      "Pontius Pilatus yalnızca İncillerden bilinen, tarihsel varlığı belirsiz bir figürdür.",
    divergence:
      "Yazıt, İncil metinlerinden tamamen bağımsız bir fiziksel kanıttır ve Pilatus'un hem varlığını hem unvanını doğrudan belgeler. Ayrıca metinlerin verdiği 'procurator' unvanının yanlış, doğrusunun 'praefectus' olduğunu göstererek kaynak eleştirisinde ikinci bir iş yapar.",
    divergence_type: ["guncellenmemis"],
    evidence: [
      "Kayseriye tiyatrosunda, ikincil kullanımda bir basamak taşı olarak bulundu - yani özgün bağlamından çıkarılmış, sonradan yeniden kullanılmış.",
      "Korunan metin Tiberius'a adanmış bir yapıyı ve Pilatus'un adını ve unvanını içeriyor.",
      "Unvan 'praefectus' okunuyor; bu, Yahudiye'nin Pilatus dönemindeki idari statüsüyle uyumlu.",
    ],
    counter_evidence: [
      "Yazıt kırık ve eksiktir; okumanın bazı bölümleri tamamlamaya dayanır.",
      "İkincil kullanımda bulunduğu için özgün konumu ve tam tarihi kesin değildir.",
    ],
    sources: [
      {
        tier: "primary",
        type: "inscription",
        year: 30,
        title: "Pilatus yazıtı (Caesarea Maritima)",
        language: "la",
        note: "1961'de Antonio Frova başkanlığındaki İtalyan heyetince bulundu; İsrail Müzesi.",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Pilate stone",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Pilate_stone",
        language: "en",
        accessed: "2026-09-07",
        note: "Ara kaynak; birincil epigrafik yayınla değiştirilmeli.",
      },
    ],
    checked: CHECKED,
    used_in: ["isa-tarihsellik"],
  },

  {
    id: "roma-hristiyanligi-uydurdu-tezi",
    claim:
      "Hristiyanlık, Roma tarafından bir yönetim aracı olarak icat edilmiştir.",
    status: "refuted",
    confidence: "high",
    topic: ["isa", "roma", "hristiyanlik", "komplo-tezi"],
    subject: {
      site: "Roma İmparatorluğu",
      region: "Akdeniz havzası",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 30,
      latest: 380,
      era_label: "Hareketin doğuşundan devlet dini ilanına",
      precision: "range",
      dating_method: ["historical-record", "textual"],
    },
    languages: ["Latince", "Grekçe"],
    disciplines: ["tarih", "metin-elestirisi"],
    popular_claim:
      "İsa ve Hristiyanlık, Roma'nın itaat üretmek için tasarladığı bir kurgudur.",
    divergence:
      "Tez üç ayrı yerden kırılıyor ve üçü de test edilebilir. (1) KRONOLOJİ: Roma'nın ittifakı 313, devlet dini ilanı 380 - hareket o tarihte zaten ~300 yıllık. Uyduran taraf onu üç yüz yıl kullanmamış olamaz. (2) ZULÜM: Roma bu dönemde Hristiyanlara dönem dönem zulmetti; bir devletin kendi imal ettiği inancın mensuplarını yüzyıllarca kovuşturması açıklanamaz. (3) ÇARMIH: merkezdeki figür bir Roma valisince çarmıha gerilmiş bir taşralıdır; çarmıh asilere ve kölelere ayrılmış, kasıtlı olarak aşağılayıcı bir infaz biçimiydi. İtaat üretmek için tasarlanan bir anlatının merkezine devletin kendi idam ettiği bir mahkûm konmaz - bu ayrıntı uyduran taraf için utanç vericidir.",
    divergence_type: ["medya-abartisi", "ideolojik-secim"],
    counter_evidence: [
      "En erken metinler iktidar dışı bir çevreden gelir; saray hamiliği kaydı yoktur. Karşılaştırma: Philostratos'un Apollonius'u doğrudan imparatoriçe Julia Domna'nın isteğiyle yazılmıştır.",
      "Tez akademik literatürde kabul görmüyor.",
      "Roma'nın Hristiyanlığı SONRADAN biçimlendirdiği doğrudur (piskoposluk bölgeleri, bazilika planı, Latince, hukuk mantığı) - ama sonradan biçimlendirmek ile baştan icat etmek aynı şey değildir. Tez tam bu ikisini karıştırıyor.",
    ],
    evidence: [
      "Roma'nın dini siyaseten kullandığı doğrudur; tezin çıkış noktası bu bakımdan boş değildir.",
    ],
    open_questions: [
      "313 sonrası imparatorluk müdahalesinin doktrini ne ölçüde şekillendirdiği ayrı ve meşru bir sorudur - bu kayıt onu değil, 'baştan icat' tezini reddediyor.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        title: "Codex Theodosianus XVI.1.2 (Cunctos populos)",
        year: 380,
        language: "la",
        note: "Devlet dini ilanının tarihi - kronoloji argümanının çıpası.",
      },
      {
        tier: "peer-reviewed",
        type: "article",
        authors: ["de Ste. Croix, G. E. M."],
        year: 1963,
        title: "Why Were the Early Christians Persecuted?",
        container: "Past & Present",
        volume: "26",
        language: "en",
        note: "Zulmün gerçekliği ve hukuki mekanizması - ikinci argümanın çıpası.",
      },
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Jones, A. H. M."],
        year: 1964,
        title: "The Later Roman Empire 284-602",
        publisher: "Basil Blackwell",
        language: "en",
      },
    ],
    checked: CHECKED,
    used_in: ["isa-tarihsellik"],
  },

  {
    id: "apollonius-kaynak-durumu",
    claim:
      "Tyanalı Apollonius hakkında bilinenlerin tamamı, ölümünden ~125 yıl sonra saray hamiliğinde yazılmış tek bir esere dayanır.",
    status: "established",
    confidence: "high",
    topic: ["apollonius", "isa", "kaynak-elestirisi", "yontem"],
    subject: {
      site: "Tyana",
      site_native: "Τύανα",
      region: "Kapadokya",
      modern_country: "Türkiye",
      coordinates: { lat: 37.8236, lon: 34.6108 },
    },
    period: {
      earliest: 40,
      latest: 230,
      era_label: "Apollonius'un yaşamından Philostratos'un yazımına",
      precision: "approximate",
      dating_method: ["textual", "historical-record"],
    },
    languages: ["Grekçe"],
    disciplines: ["filoloji", "metin-elestirisi", "tarih"],
    people: [
      { name: "Philostratos (Atinalı)", role: "editor", year: 220, lifespan: "y. 170-250" },
      { name: "Julia Domna", role: "editor", year: 217, lifespan: "y. 160-217" },
    ],
    popular_claim:
      "Tyanalı Apollonius, İsa ile birebir aynı mucizeleri gerçekleştirmiş bir çağdaşıdır; anlatılar birbirinin kopyasıdır.",
    divergence:
      "Karşılaştırma meşru bir yöntem sorusu doğuruyor ama popüler biçimi iki yönden de hatalı. (a) 'Birebir kopya' listeleri abartılı: Philostratos'un diriltme sahnesinde yazarın kendisi çekince koyar, kızda bir yaşam kıvılcımı kalmış olabileceğini söyler. (b) Kanıt durumu aynı değil: Apollonius için elimizdeki tek kaynak ~125 yıl sonra ve İMPARATORİÇE ISMARLAMASIYLA yazılmış; iddia edilen birinci el kaynağı (Ninovalı Damis'in anıları) çoğunluk görüşüne göre edebî kurgudur. Fark VARLIK sorusundadır; mucize iddiaları ikisi için de aynı derecede tarih yönteminin dışındadır.",
    divergence_type: ["medya-abartisi", "provenans-yoklugu"],
    evidence: [
      "Ana kaynak Philostratos'un sekiz kitaplık Apollonius'un Yaşamı; y. 220'lerde, imparatoriçe Julia Domna'nın isteğiyle yazıldı.",
      "Philostratos kaynağı olarak Ninovalı Damis'in anılarını gösteriyor; 'bulunmuş elyazması' antik bir anlatı hilesidir ve Damis çoğunluk görüşünde kurgu sayılır.",
      "Bağımsız izler zayıf ve dolaylı: Cassius Dio'da kısa bir anma, Tyana'da sikke ve tapınak izleri.",
      "Doğum yeri Tyana - bugünkü Kemerhisar, Bor, Niğde.",
    ],
    counter_evidence: [
      "Apollonius'un yaşamış olması muhtemeldir; kaynak sorunu varlığını değil, AYRINTILARI ulaşılamaz kılıyor.",
      "Geleneksel yaşam tarihleri (y. MÖ 3 - y. MS 97) güvenilir değildir.",
      "Philostratos'un kasıtlı olarak Hristiyanlığa rakip bir figür kurguladığı tezi alanda azınlıkta kalır; anti-Hristiyan kullanım sonradan gelmiştir.",
    ],
    open_questions: [
      "Damis gerçekten var mıydı? Çoğunluk hayır diyor ama kesin değil.",
      "Philostratos'un elinde daha erken bir kaynak var mıydı?",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        authors: ["Philostratos"],
        year: 220,
        title: "Ta es ton Tyanea Apollonion (Tyanalı Apollonius'un Yaşamı), 8 kitap",
        language: "grc",
        note: "Apollonius hakkındaki neredeyse tüm bilginin tek kaynağı.",
      },
      {
        tier: "primary",
        type: "edition",
        authors: ["Cassius Dio"],
        title: "Historia Romana - Apollonius'a değinen bölüm",
        language: "grc",
        note: "Kısa ve dolaylı; bağımsız iz olarak zayıf.",
      },
    ],
    checked: CHECKED,
    used_in: ["isa-tarihsellik"],
  },

  {
    id: "hierocles-apollonius-polemigi",
    claim:
      "Apollonius-İsa karşılaştırması modern değildir: ~303'te bir Roma valisi tarafından zulüm sırasında polemik silahı olarak kuruldu ve bize yalnızca karşı tarafın alıntıları üzerinden ulaştı.",
    status: "established",
    confidence: "high",
    topic: ["apollonius", "isa", "hristiyanlik", "hayatta-kalma"],
    subject: {
      site: "Bitinya / Roma Doğu eyaletleri",
      region: "Anadolu",
      modern_country: "Türkiye",
    },
    period: {
      earliest: 303,
      latest: 340,
      era_label: "Diocletianus zulmü ve Eusebios'un reddiyesi",
      precision: "approximate",
      dating_method: ["textual", "historical-record"],
    },
    languages: ["Grekçe"],
    disciplines: ["tarih", "metin-elestirisi", "filoloji"],
    people: [
      { name: "Sossianus Hierocles", role: "proposer", affiliation: "Roma eyalet valisi", year: 303 },
      { name: "Eusebios (Kaisareia)", role: "refuter", year: 310, lifespan: "y. 260-339" },
    ],
    popular_claim:
      "Apollonius-İsa paraleli modern bir şüphecilik bulgusudur.",
    divergence:
      "Paralel 4. yüzyıl başında, Diocletianus zulmünün yöneticilerinden biri tarafından, zulmü meşrulaştırmak için kuruldu. Yani argüman doğduğu anda siyasi bir araçtı. Ve bugün onu yalnızca EUSEBIOS'UN AKTARDIĞI KADARIYLA okuyabiliyoruz - Hierocles'in metni bağımsız olarak korunmadı. Bir polemiği sadece karşı tarafın alıntıları üzerinden okumak, bu serinin hayatta kalma yanlılığı omurgasının ders kitabı örneğidir.",
    divergence_type: ["hayatta-kalma-yanliligi", "ideolojik-secim"],
    evidence: [
      "Hierocles, Philalethes (Hakikat Dostu) adlı metinde Apollonius'un da benzer şeyler yaptığını, paganların onu tanrılaştırmadığını savundu.",
      "Eusebios, Hierocles'e Karşı adlı bir reddiye yazdı ve bu reddiye korundu.",
      "Hierocles'in özgün metni bağımsız olarak elimizde değil; içeriğini yalnızca Eusebios'un alıntılarından biliyoruz.",
    ],
    counter_evidence: [
      "Eusebios taraf bir aktarıcıdır; Hierocles'in argümanını eksik veya çarpıtarak vermiş olabilir - ve bunu kontrol edecek bağımsız bir metin yok.",
    ],
    open_questions: [
      "Hierocles'in özgün argümanı Eusebios'un aktardığından ne kadar farklıydı? Ölçülemez.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        authors: ["Eusebios (Kaisareia)"],
        year: 310,
        title: "Contra Hieroclem (Hierocles'e Karşı)",
        language: "grc",
        note: "Hierocles'in metnine dair tek tanık; taraf aktarıcı.",
      },
      {
        tier: "primary",
        type: "edition",
        authors: ["Lactantius"],
        title: "De mortibus persecutorum 16",
        language: "la",
        note: "Hierocles'in zulümdeki rolüne değinen çağdaş kaynak.",
      },
    ],
    checked: CHECKED,
    used_in: ["isa-tarihsellik"],
  },
];

const mevcut = new Set(list.map((r) => r.id));
const eklenen = [];
for (const r of yeni) {
  if (mevcut.has(r.id)) {
    console.log("ATLANDI (zaten var):", r.id);
    continue;
  }
  list.push(r);
  eklenen.push(r.id);
}

writeFileSync(path, JSON.stringify(list, null, 2) + "\n", "utf8");
console.log(`${eklenen.length} kayıt eklendi:`);
eklenen.forEach((id) => console.log("  +", id));
console.log("roma.json toplam:", list.length);
