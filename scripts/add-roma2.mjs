import { readFileSync, writeFileSync } from "node:fs";

const path = "data/findings/roma.json";
const list = JSON.parse(readFileSync(path, "utf8"));

const CHECKED = "2026-09-07";

const yeni = [
  {
    id: "hristiyanlik-313-380-ayrimi",
    claim:
      "313 Milano fermanı Hristiyanlığı serbest bıraktı; devlet dini yapan 380 Selanik fermanıdır. Arada 67 yıl vardır.",
    status: "established",
    confidence: "high",
    topic: ["roma", "hristiyanlik", "hukuk", "kronoloji"],
    subject: {
      site: "Roma İmparatorluğu",
      region: "Akdeniz havzası",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 313,
      latest: 392,
      era_label: "Geç Roma İmparatorluğu",
      precision: "exact",
      dating_method: ["textual", "historical-record"],
    },
    languages: ["Latince"],
    disciplines: ["tarih", "hukuk"],
    people: [
      { name: "Constantinus I", role: "proposer", year: 313, lifespan: "y. 272-337" },
      { name: "Licinius", role: "proposer", year: 313 },
      { name: "Theodosius I", role: "proposer", year: 380, lifespan: "347-395" },
    ],
    popular_claim:
      "Constantinus 313'te Hristiyanlığı Roma'nın devlet dini yaptı.",
    divergence:
      "313 tüm dinlere serbestlik tanıyan bir HOŞGÖRÜ metnidir; Hristiyanlığa ayrıcalık değil, yasağın kaldırılmasıdır. Devlet dini ilanı 380'de I. Theodosius döneminde gelir - 67 yıl sonra ve farklı bir imparatorla. Pagan kurbanının yasaklanması 391-392'yi bulur. Popüler anlatı üç ayrı olayı tek bir karara indirger.",
    divergence_type: ["guncellenmemis", "kategori-hatasi"],
    evidence: [
      "313 metninin içeriği Lactantius'un De mortibus persecutorum 48. bölümünde aktarılır ve 'Hristiyanlara ve herkese' dinini seçme serbestliği tanır.",
      "Codex Theodosianus XVI.1.2 (Cunctos populos, 380) İznik inancını imparatorluğun resmî dini ilan eder.",
      "391-392 tarihli yasalar pagan kurbanını ve tapınak ziyaretini yasaklar - hoşgürüden zorunluluğa geçişin son adımı.",
      "Constantinus 337'de, saltanatının sonunda ölüm döşeğinde vaftiz edildi; vaftizi yapan Nikomedialı Eusebios, İznik'te mahkûm edilen Arius'un görüşüne yakın bir piskopostu.",
    ],
    counter_evidence: [
      "313'ten sonra kiliseye tanınan vergi muafiyetleri ve bağışlar hukuken 'devlet dini' olmasa da fiilî bir imtiyaz yaratmıştır; ayrımın keskinliği idari uygulamada bulanıklaşır.",
      "'Milano fermanı' adlandırması tartışmalıdır: metin bir edictum değil, valilere gönderilen bir talimat mektubudur ve Galerius'un 311 hoşgörü fermanının devamı sayılabilir.",
    ],
    open_questions: [
      "Constantinus'un kişisel inancı samimi bir dönüşüm müydü, siyasi bir hesap mıydı? Niyet sorusu ölçülemez.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        authors: ["Lactantius"],
        title: "De mortibus persecutorum, 48",
        language: "la",
        note: "313 metninin içeriğini aktaran çağdaş kaynak.",
      },
      {
        tier: "primary",
        type: "edition",
        title: "Codex Theodosianus XVI.1.2 (Cunctos populos)",
        year: 380,
        language: "la",
        note: "Devlet dini ilanının hukuk metni.",
      },
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Jones, A. H. M."],
        year: 1964,
        title: "The Later Roman Empire 284-602: A Social, Economic and Administrative Survey",
        publisher: "Basil Blackwell",
        language: "en",
        note: "Dönemin idari ve hukuki çerçevesi için standart başvuru eseri.",
      },
    ],
    checked: CHECKED,
    used_in: ["roma-hristiyanlik"],
  },

  {
    id: "iznik-kanonu-belirlemedi",
    claim:
      "325 İznik Konsili'nde Kutsal Kitap kanonunun tartışıldığına dair hiçbir kayıt yoktur.",
    status: "established",
    confidence: "high",
    topic: ["hristiyanlik", "kanon", "konsil", "yontem"],
    subject: {
      site: "İznik (Nicaea)",
      site_native: "Νίκαια",
      region: "Bitinya",
      modern_country: "Türkiye",
      coordinates: { lat: 40.4297, lon: 29.7208 },
    },
    period: {
      earliest: 325,
      latest: 325,
      era_label: "Geç Roma İmparatorluğu",
      precision: "exact",
      dating_method: ["textual", "historical-record"],
    },
    languages: ["Yunanca", "Latince"],
    disciplines: ["tarih", "metin-elestirisi"],
    people: [
      { name: "Eusebios (Kaisareia)", role: "editor", year: 325, lifespan: "y. 260-339" },
      { name: "Athanasios (İskenderiye)", role: "editor", year: 367, lifespan: "y. 296-373" },
      { name: "Metzger, Bruce M.", role: "analyst", year: 1987, lifespan: "1914-2007" },
    ],
    popular_claim:
      "İznik Konsili'nde hangi İncillerin kutsal kitaba gireceği oylandı, dışarıda kalanlar yakıldı.",
    divergence:
      "Konsilin belgelenmiş gündemi: Arius tartışması, İznik inanç bildirgesi, Paskalya'nın tarihi ve yaklaşık yirmi idari kanon. Kanon - yani hangi kitapların Kutsal Kitap'a gireceği - bu gündemde yoktur. Konsile katılan ve ayrıntılı yazan görgü tanıkları (Eusebios, Athanasios) böyle bir karardan hiç söz etmez.",
    divergence_type: ["medya-abartisi", "kategori-hatasi"],
    evidence: [
      "Konsilden çıkan yirmi kanon metni elimizdedir ve tamamı kilise yönetimine ilişkindir - kutsal metin listesi içermez.",
      "Konsilde bulunan Eusebios, İznik'i ayrıntılı anlatır ve kanon kararından bahsetmez.",
      "Tartışmanın konusu İsa'nın ilahiliği DEĞİL, ilahiliğinin Baba ile ilişkisiydi: taraflardan hiçbiri İsa'nın ilahi olmadığını savunmuyordu.",
      "Konsilden 42 yıl SONRA yazan Athanasios'un 367 tarihli mektubu, elimizdeki ilk 27 kitaplık listedir - İznik'te bir liste kabul edilmiş olsaydı bu gereksiz olurdu.",
    ],
    counter_evidence: [
      "Sessizlikten çıkarım genelde zayıf bir kanıt biçimidir; burada gücü, sessiz kalan kişilerin tam da o toplantıda bulunup ayrıntılı yazmış olmasından gelir.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Metzger, Bruce M."],
        year: 1987,
        title: "The Canon of the New Testament: Its Origin, Development, and Significance",
        publisher: "Oxford University Press",
        language: "en",
        note: "Kanon oluşumunun standart başvuru eseri; İznik'in kanonla ilgisi olmadığını açıkça belirtir.",
      },
      {
        tier: "primary",
        type: "edition",
        title: "İznik Konsili kanonları (325)",
        year: 325,
        language: "grc",
        note: "Yirmi kanonun tamamı idari; kutsal metin listesi yoktur.",
      },
    ],
    checked: CHECKED,
    used_in: ["roma-hristiyanlik"],
  },

  {
    id: "kanon-367-athanasios-listesi",
    claim:
      "Bugünkü 27 kitaplık Yeni Ahit listesinin bilinen ilk tam hâli, Athanasios'un 367 tarihli Paskalya mektubudur.",
    status: "established",
    confidence: "high",
    topic: ["hristiyanlik", "kanon", "metin-tarihi"],
    subject: {
      site: "İskenderiye",
      region: "Mısır",
      modern_country: "Mısır",
      coordinates: { lat: 31.2001, lon: 29.9187 },
    },
    period: {
      earliest: 367,
      latest: 397,
      era_label: "Geç Roma İmparatorluğu",
      precision: "exact",
      dating_method: ["textual", "paleography"],
    },
    languages: ["Yunanca", "Latince"],
    disciplines: ["metin-elestirisi", "tarih", "filoloji"],
    people: [
      { name: "Athanasios (İskenderiye)", role: "editor", year: 367, lifespan: "y. 296-373" },
      { name: "Metzger, Bruce M.", role: "analyst", year: 1987 },
    ],
    popular_claim:
      "Kanon bir konsilde tepeden ilan edildi; dışarıda kalan metinler imha edildi.",
    divergence:
      "Kanon bir kararla kurulmadı, kullanımla oluştu: hangi metinlerin okunmaya, kopyalanmaya ve öğretilmeye devam ettiğiyle. Athanasios'un kendisi yeni bir kanon KURDUĞUNU düşünmüyordu - zaten geniş kabul gören kitapları onaylıyordu. Sonraki bölgesel konsiller bu listeyi teyit etti. Sıra: kullanım -> uzlaşı -> onay. Dışarıda kalanlar yakılarak değil, ÇOĞALTILMAYARAK kayboldu - İskenderiye Kütüphanesi'ndeki mekanizmanın aynısı.",
    divergence_type: ["medya-abartisi", "hayatta-kalma-yanliligi"],
    evidence: [
      "367 tarihli 39. Paskalya mektubu, bugünkü 27 kitabı tam olarak listeleyen bilinen ilk belgedir.",
      "Mektubun dili onaylayıcıdır, kurucu değil: geniş kabul gören kitapları teyit eder.",
      "4. yüzyıl sonundaki Kuzey Afrika bölgesel konsilleri aynı listeyi teyit etti - yani liste konsilden önce vardı.",
      "Kanon dışı metinlerin bir kısmı elimizdedir (Nag Hammadi buluntuları, 1945); sistematik bir imha kampanyasının arkeolojik veya metinsel kanıtı yoktur.",
    ],
    counter_evidence: [
      "Bazı kitapların (İbraniler, Vahiy, Yakup) kabulü bölgeden bölgeye uzun süre farklılık gösterdi; 367 tarihi bir 'kapanış' değil, bir uzlaşının ilk yazılı kaydıdır.",
      "Süryani ve Etiyopya kiliseleri farklı kanonlar kullanmaya devam etti; tek bir evrensel liste hiçbir zaman olmadı.",
    ],
    open_questions: [
      "Kanon dışında kalan metinlerin ne kadarı kayıp? Kopyalanma oranına dayalı tahminler var ama ölçülemiyor.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        authors: ["Athanasios"],
        year: 367,
        title: "39. Paskalya Mektubu (Festal Letter 39)",
        language: "grc",
        note: "27 kitaplık listenin bilinen ilk tam hâli.",
      },
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Metzger, Bruce M."],
        year: 1987,
        title: "The Canon of the New Testament: Its Origin, Development, and Significance",
        publisher: "Oxford University Press",
        language: "en",
      },
    ],
    checked: CHECKED,
    used_in: ["roma-hristiyanlik"],
  },

  {
    id: "hristiyan-buyume-orani-modeli",
    claim:
      "Hristiyanlığın 300'e kadarki yayılışı, on yılda %40'lık sıradan bir büyüme oranıyla açıklanabilir - olağandışı bir varsayım gerekmez.",
    status: "contested",
    confidence: "medium",
    topic: ["hristiyanlik", "demografi", "yontem"],
    subject: {
      site: "Roma İmparatorluğu",
      region: "Akdeniz havzası",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 40,
      latest: 350,
      era_label: "Erken Roma İmparatorluğu'ndan geç antikçağa",
      precision: "range",
      dating_method: ["historical-record"],
    },
    disciplines: ["sosyoloji", "demografi", "tarih"],
    people: [
      { name: "Stark, Rodney", role: "proposer", affiliation: "University of Washington", year: 1996, lifespan: "1934-2022" },
    ],
    popular_claim:
      "Hristiyanlık Constantinus sayesinde yayıldı; imparator olmasaydı marjinal bir mezhep kalırdı.",
    divergence:
      "Model, MS 40'ta ~1.000 kişiden başlayıp on yılda %40 büyümeyle 300 yılında ~6 milyona ulaşıldığını gösterir - modern dinî hareketlerde gözlenen, olağanüstü olmayan bir hız. Sonuç şu: Constantinus sahneye çıktığında Hristiyanlık zaten imparatorluk nüfusunun kayda değer bir bölümüydü. İmparator bir azınlığı çoğunluk yapmadı; büyümekte olan bir kitleyle ittifak kurdu. Nedensellik oku popüler anlatının gösterdiği yönde değil.",
    divergence_type: ["guncellenmemis"],
    evidence: [
      "Bileşik büyüme aritmetiği: %40/on yıl, 260 yılda 1.000'i yaklaşık 6 milyona çıkarır.",
      "Kullanılan oran, modern dinî hareketlerde belgelenmiş büyüme hızlarıyla aynı mertebededir - uydurulmuş bir sayı değildir.",
      "Salgın dönemlerinde Hristiyan cemaatlerinin şehirde kalıp hastalara bakması, temel bakım yoluyla hayatta kalma oranını yükseltmiş olabilir.",
      "Cemaatlerde kadın oranının yüksekliği, pagan erkeklerle evlilikler yoluyla yeni hanelere giriş ve daha yüksek doğurganlık üretmiş olabilir.",
    ],
    counter_evidence: [
      "Bu bir İMKÂN KANITIDIR, ölçüm değil: başlangıç sayısı, büyüme oranı ve 300 yılındaki toplam - üçü de tahmindir. Model 'böyle oldu' demez, 'olağandışı bir şey varsaymadan da bu sayıya ulaşılır' der.",
      "Sabit oran varsayımı gerçekçi değildir; büyüme bölgeden bölgeye ve dönemden döneme değişmiş olmalıdır.",
      "Salgın bakımı ve kadın demografisi açıklamaları aritmetikten çok daha zayıf desteklidir ve kaynakların önemli kısmı Hristiyan yazarların kendi anlatılarından gelir - taraf olan kaynak.",
      "Tarihçiler arasında 300 yılı için verilen toplam nüfus tahminleri geniş bir aralıkta değişir; 6 milyon üst uçlardan biridir.",
    ],
    open_questions: [
      "Salgın döneminde bakımın hayatta kalma oranına etkisi niceliksel olarak ölçülebilir mi? Şu an ölçülemiyor.",
      "Cemaatlerdeki kadın oranı ne kadar yüksekti? Sayısal veri yok, çıkarım metinsel.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Stark, Rodney"],
        year: 1996,
        title: "The Rise of Christianity: A Sociologist Reconsiders History",
        publisher: "Princeton University Press",
        language: "en",
        note: "Akademik yayınevi monografisi. Modelin kendisi tartışmalıdır; tarihçilerden sabit oran varsayımına ve nüfus tahminlerine yönelik eleştiriler almıştır.",
      },
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Jones, A. H. M."],
        year: 1964,
        title: "The Later Roman Empire 284-602",
        publisher: "Basil Blackwell",
        language: "en",
        note: "Geç Roma nüfus tahminleri için karşılaştırma çerçevesi.",
      },
    ],
    checked: CHECKED,
    volatile: false,
    used_in: ["roma-hristiyanlik"],
  },

  {
    id: "hristiyan-zulmu-olcegi",
    claim:
      "Hristiyanlara yönelik zulüm gerçekti ama üç yüz yıl boyunca kesintisiz ve imparatorluk çapında değildi; dönemsel, bölgesel ve çoğunlukla kısa süreliydi.",
    status: "contested",
    confidence: "medium",
    topic: ["hristiyanlik", "roma", "yontem"],
    subject: {
      site: "Roma İmparatorluğu",
      region: "Akdeniz havzası",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 64,
      latest: 313,
      era_label: "Roma İmparatorluğu",
      precision: "range",
      dating_method: ["textual", "historical-record"],
    },
    languages: ["Latince", "Yunanca"],
    disciplines: ["tarih", "metin-elestirisi"],
    people: [
      { name: "de Ste. Croix, G. E. M.", role: "analyst", affiliation: "University of Oxford", year: 1963, lifespan: "1910-2000" },
      { name: "Moss, Candida", role: "critic", affiliation: "University of Birmingham", year: 2013 },
    ],
    popular_claim:
      "Hristiyanlar üç yüz yıl boyunca aralıksız kitlesel katliama uğradı; sayısız şehit verildi.",
    divergence:
      "Sistematik ve imparatorluk çapında zulüm, 3. yüzyıl ortası ve başındaki iki büyük dalgada yoğunlaşır. Geri kalan zaman büyük ölçüde yerel yargıçların takdirine bağlı, düzensiz uygulamalardan oluşur. Bu bir küçümseme değil, ÖLÇEK DÜZELTMESİDİR - ve şu açıdan önemlidir: Roma Hristiyanlığı bir yönetim aracı olarak kendisi uydurmuş olsaydı, kendi uydurduğu inancın mensuplarını dönem dönem idam etmesi açıklanması güç bir davranış olurdu.",
    divergence_type: ["medya-abartisi", "ideolojik-secim"],
    evidence: [
      "Kesintisiz zulüm varsayımıyla çelişen kanıt: 3. yüzyılda birçok şehirde açıkça bilinen kilise binaları ve mülkleri vardı; 313'te bunların İADESİ emredilmesi, önceden var olduklarını gösterir.",
      "Zulüm yasalarının uygulaması eyaletten eyalete büyük farklılık gösterir; merkezî emir olmadan yerel yargıç takdiri belirleyicidir.",
      "Şehitlik anlatılarının önemli bir kısmı olaylardan çok sonra yazılmış edebî derlemelerdir ve tarihsel değerleri tartışmalıdır.",
    ],
    counter_evidence: [
      "Ölçek düzeltmesi, zulmün gerçekliğini veya şiddetini ortadan kaldırmaz; belgelenmiş idamlar ve mülk müsaderesi vardır.",
      "'Şehitlik anlatıları abartılıdır' tezi alanda TARTIŞMALIDIR; bazı tarihçiler erken şehitlik metinlerinin çekirdek tarihselliğini savunur.",
      "Kaynak sorunu iki yönlüdür: hem şehitlik anlatıları hem de onları eleştiren yeniden değerlendirmeler ideolojik okumaya açıktır.",
    ],
    open_questions: [
      "Zulmün toplam ölçeği - kaç kişi, hangi dönemde - sayısal olarak bilinmiyor ve muhtemelen bilinemez.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "article",
        authors: ["de Ste. Croix, G. E. M."],
        year: 1963,
        title: "Why Were the Early Christians Persecuted?",
        container: "Past & Present",
        volume: "26",
        language: "en",
        note: "Zulmün hukuki mekanizması ve düzensizliği üzerine alanın temel makalesi.",
      },
      {
        tier: "popular",
        type: "book",
        authors: ["Moss, Candida"],
        year: 2013,
        title: "The Myth of Persecution",
        publisher: "HarperOne",
        language: "en",
        note: "Akademisyen yazarın genel okur için kitabı; tezi alanda TARTIŞMALIDIR ve burada tek dayanak olarak kullanılmamıştır.",
      },
    ],
    checked: CHECKED,
    used_in: ["roma-hristiyanlik"],
  },

  {
    id: "kilise-roma-idari-mirasi",
    claim:
      "Kilise, Roma'nın idari biçimini devraldı: piskoposluk bölgeleri imparatorluk idari birimlerinden, kilise binası mahkeme salonundan, kilise dili ve hukuk mantığı imparatorluktan geldi.",
    status: "established",
    confidence: "high",
    topic: ["roma", "hristiyanlik", "kurumsal-sureklilik", "mimarlik"],
    subject: {
      site: "Roma İmparatorluğu / Batı kilisesi",
      region: "Akdeniz havzası ve Batı Avrupa",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 300,
      latest: 800,
      era_label: "Geç antikçağdan erken Ortaçağ'a",
      precision: "range",
      dating_method: ["textual", "typology", "historical-record"],
    },
    languages: ["Latince", "Yunanca"],
    disciplines: ["tarih", "mimarlik", "hukuk", "sanat-tarihi"],
    people: [
      { name: "Jones, A. H. M.", role: "analyst", affiliation: "University of Cambridge", year: 1964, lifespan: "1904-1970" },
      { name: "Krautheimer, Richard", role: "analyst", year: 1965, lifespan: "1897-1994" },
    ],
    popular_claim:
      "Hristiyanlık Roma İmparatorluğu'nu ele geçirdi ve dönüştürdü.",
    divergence:
      "Uzun vadede daha belirleyici olan akış ters yöndedir: Roma, Hristiyanlığa kendi biçimini verdi. Kilise imparatorluğu ele geçirmedi - imparatorluğun BİÇİMİNİ GİYDİ. Batı'da devlet çözülürken ayakta kalan kurumun kilise olmasının sebebi de budur: Roma'nın idari iskeletini içinde taşıyordu.",
    divergence_type: ["guncellenmemis", "kategori-hatasi"],
    evidence: [
      "Piskoposluk bölgeleri (diocesis) imparatorluğun idari bölünmesini hem adıyla hem sınırlarıyla devraldı; bugünkü kilise haritası bir imparatorluk idare haritasının izini taşır.",
      "Kiliseler pagan TAPINAK planında değil, Roma BAZİLİKASI - yani mahkeme ve ticaret için kullanılan kamu binası - planında yapıldı; sebep, cemaatin içeride toplanması gereğidir. Pagan tapınağında ayin dışarıda yapılırdı.",
      "Batı kilisesi imparatorluğun idari dili Latince'yi benimsedi ve bin yıldan uzun süre korudu; Latince imparatorluk çöktükten sonra kilise sayesinde yaşadı.",
      "Kilise uyuşmazlıkları Roma hukuk mantığıyla çözmeye başladı: yazılı kural, içtihat, yetki hiyerarşisi. Sonraki kanon hukuku bu kalıptan doğdu.",
      "Roma'nın pagan başrahip unvanı pontifex maximus, imparatorlar tarafından taşındıktan sonra zamanla papalık unvanları arasına geçti.",
    ],
    counter_evidence: [
      "Etkileşim çift yönlüdür: kilise Roma biçimlerini alırken içeriklerini de değiştirdi; bazilika planı ayin ihtiyacına göre dönüştürüldü (apsis, transept).",
      "Piskoposluk sınırlarının idari sınırlarla örtüşmesi her yerde tam değildir; özellikle Doğu'da ve sınır bölgelerinde sapmalar vardır.",
    ],
    sources: [
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Jones, A. H. M."],
        year: 1964,
        title: "The Later Roman Empire 284-602: A Social, Economic and Administrative Survey",
        publisher: "Basil Blackwell",
        language: "en",
        note: "İdari birimlerin kilise örgütlenmesine geçişi için standart eser.",
      },
      {
        tier: "peer-reviewed",
        type: "book",
        authors: ["Krautheimer, Richard"],
        year: 1965,
        title: "Early Christian and Byzantine Architecture",
        publisher: "Penguin Books (Pelican History of Art)",
        language: "en",
        note: "Bazilika planının kilise mimarisine geçişi için temel eser.",
      },
    ],
    checked: CHECKED,
    used_in: ["roma-hristiyanlik"],
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
