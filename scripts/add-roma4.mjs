import { readFileSync, writeFileSync } from "node:fs";

const path = "data/findings/roma.json";
const list = JSON.parse(readFileSync(path, "utf8"));
const CHECKED = "2026-09-07";

const yeni = [
  {
    id: "catisma-tezi-terk-edildi",
    claim:
      "Bilim ile dinin doğaları gereği ve sürekli çatıştığı tezi (Draper-White çatışma tezi) bilim tarihi alanında terk edilmiştir.",
    status: "established",
    confidence: "high",
    topic: ["tarih-yazimi", "bilim-tarihi", "kilise", "yontem"],
    subject: {
      site: "Bilim tarihi yazımı",
      region: "Avrupa ve Kuzey Amerika akademisi",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 1874,
      latest: 2026,
      era_label: "Tezin üretiminden reddine",
      precision: "range",
      dating_method: ["historical-record", "textual"],
    },
    languages: ["İngilizce"],
    disciplines: ["bilim-tarihi", "tarih"],
    people: [
      { name: "Draper, John William", role: "proposer", year: 1874, lifespan: "1811-1882" },
      { name: "White, Andrew Dickson", role: "proposer", affiliation: "Cornell University", year: 1896, lifespan: "1832-1918" },
    ],
    popular_claim:
      "Kilise bilimi bastırdı ve bin yıllık bir Karanlık Çağ yarattı; bilim ile din tarih boyunca savaş hâlindeydi.",
    divergence:
      "Anlatının belirli yazarları ve tarihleri var: Draper (1874) ve White (1896). 20. yüzyıl bilim tarihçileri bu eserlerin kanıtlarını denetledi ve önemli bölümünün yanlış yorumlandığını ya da doğrudan uydurulduğunu gösterdi. 'Karanlık Çağ' terimi de tarihçilerce terk edilmiştir; dönem 'Ortaçağ' olarak adlandırılır ve entelektüel üretimin sürdüğü bir dönem olarak incelenir. DİKKAT: tezin çökmesi somut olayların olmadığı anlamına GELMEZ - çöken kısım çatışmanın yapısal, sürekli ve kaçınılmaz olduğu iddiasıdır.",
    divergence_type: ["ideolojik-secim", "guncellenmemis"],
    evidence: [
      "'Karanlık Çağ' nitelemesinin kökeni 14. yüzyılda Petrarca'dır ve BİLİM değil, Latin edebiyatının gerileyişi hakkındadır - bir edebiyat zevki yargısı.",
      "Draper 1874 ve White 1896 tarihli eserler bugünkü popüler anlatının kaynağıdır.",
      "Bilim tarihçilerinin denetimi, kanıtların önemli bölümünün yanlış okunmuş veya uydurulmuş olduğunu gösterdi.",
      "Üniversite kurumunun kendisi bir Ortaçağ kilise kurumudur: Bologna 1088, Paris ve Oxford 12. yüzyıl.",
    ],
    counter_evidence: [
      "Çatışma tezinin reddi, belirli tarihlerde belirli kurumlarca yapılan sansür ve yargılamaları ortadan kaldırmaz - Index, Galileo ve Bruno ayrı kayıtlarda tutulmaktadır.",
      "Savunmacı literatürde ters yönde bir eğilim var: 'mit çürütüldü' diyerek belgelenmiş sicili de aynı torbaya atmak.",
    ],
    open_questions: [
      "Popüler anlatı neden akademik reddiyeye rağmen bu kadar dayanıklı?",
    ],
    sources: [
      {
        tier: "institutional",
        type: "webpage",
        title: "Conflict thesis",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Conflict_thesis",
        language: "en",
        accessed: "2026-09-07",
        note: "Ara kaynak; alanın uzlaşı durumunun özeti için.",
      },
      {
        tier: "popular",
        type: "book",
        authors: ["Draper, John William"],
        year: 1874,
        title: "History of the Conflict between Religion and Science",
        language: "en",
        note: "Kanıt olarak DEĞİL, incelenen olgunun kendisi olarak kaydedildi.",
      },
      {
        tier: "popular",
        type: "book",
        authors: ["White, Andrew Dickson"],
        year: 1896,
        title: "A History of the Warfare of Science with Theology in Christendom",
        language: "en",
        note: "Kanıt olarak DEĞİL, incelenen olgunun kendisi olarak kaydedildi.",
      },
    ],
    checked: CHECKED,
    used_in: ["mit-ve-sicil"],
  },

  {
    id: "duz-dunya-ortacag-miti",
    claim:
      "Ortaçağ Avrupası'nda eğitimli çevreler dünyanın düz olduğuna inanıyordu.",
    status: "refuted",
    confidence: "high",
    topic: ["tarih-yazimi", "bilim-tarihi", "kilise"],
    subject: {
      site: "Ortaçağ Avrupası",
      region: "Batı Avrupa",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 500,
      latest: 1828,
      era_label: "Ortaçağ'dan mitin üretildiği tarihe",
      precision: "range",
      dating_method: ["textual", "historical-record"],
    },
    languages: ["Latince", "İngilizce"],
    disciplines: ["bilim-tarihi", "tarih", "filoloji"],
    people: [
      { name: "Irving, Washington", role: "proposer", year: 1828, lifespan: "1783-1859" },
    ],
    popular_claim:
      "Kolomb, dünyanın yuvarlak olduğunu düz olduğuna inanan din adamlarına karşı savundu.",
    divergence:
      "Dünyanın küre olduğu Ortaçağ'da eğitimli çevrelerde STANDART BİLGİYDİ; antikçağdan devralınmış ve dönemin ders metinlerinde yer alıyordu. Kolomb ile uzmanlar arasındaki gerçek tartışma dünyanın ŞEKLİ değil ÇEVRESİNİN UZUNLUĞUydu - ve o tartışmada haklı olan taraf Kolomb değil, uzmanlardı: Kolomb mesafeyi ciddi biçimde küçümsüyordu. Düz dünya sahnesi 1828'de yayımlanan bir Kolomb biyografisindeki kurgusal bir sahneden gelir ve sonradan çatışma tezi tarafından yaygınlaştırılmıştır.",
    divergence_type: ["medya-abartisi", "ideolojik-secim"],
    evidence: [
      "Ortaçağ ders metinlerinde küre biçimi standart olarak yer alır.",
      "Kolomb'un hesabı Dünya'nın çevresini olduğundan çok küçük gösteriyordu; itiraz eden uzmanlar bu noktada haklıydı.",
      "Düz dünya anlatısının bilinen popüler kaynağı 1828 tarihli edebî bir biyografidir.",
    ],
    counter_evidence: [
      "Bazı geç antik yazarlarda düz dünya görüşü savunulmuştur; ancak bunlar azınlıkta kalmış ve Ortaçağ eğitim geleneğine hâkim olmamıştır.",
    ],
    sources: [
      {
        tier: "institutional",
        type: "webpage",
        title: "Myth of the flat Earth",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Myth_of_the_flat_Earth",
        language: "en",
        accessed: "2026-09-07",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "\"The Dark Ages\" - Popery, Periodisation and Pejoratives",
        url: "https://historyforatheists.com/2016/11/the-dark-ages-popery-periodisation-and-pejoratives/",
        language: "en",
        accessed: "2026-09-07",
        note: "Ara kaynak; dönemlendirme tartışmasının özeti.",
      },
    ],
    checked: CHECKED,
    used_in: ["mit-ve-sicil"],
  },

  {
    id: "index-librorum-407-yil",
    claim:
      "Katolik Kilisesi'nin resmî yasaklı kitaplar listesi Index Librorum Prohibitorum 1559'dan 1966'ya, yani 407 yıl yürürlükte kaldı.",
    status: "established",
    confidence: "high",
    topic: ["kilise", "sansur", "bilim-tarihi", "kitap-tarihi"],
    subject: {
      site: "Roma / Katolik Kilisesi",
      region: "Katolik dünyası",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 1559,
      latest: 1966,
      era_label: "Karşı Reform'dan II. Vatikan sonrasına",
      precision: "exact",
      dating_method: ["historical-record", "textual"],
    },
    languages: ["Latince", "İtalyanca"],
    disciplines: ["tarih", "bilim-tarihi", "hukuk"],
    popular_claim:
      "Kilise sansürü Ortaçağ'a ait, uzak ve kapanmış bir konudur.",
    divergence:
      "Index bir Ortaçağ kurumu DEĞİLDİR: 1559'da, yani matbaanın yaygınlaşmasından sonra, Karşı Reform bağlamında kuruldu ve 1966'da kaldırıldı - yani yaşayan insanların hafızasında bitti. Sansürün asıl kurumsal biçimi Ortaçağ'da değil, ERKEN MODERN dönemdedir. 'Ortaçağ karanlığı' çerçevesi burada da yanlış dönemi gösteriyor.",
    divergence_type: ["guncellenmemis", "kategori-hatasi"],
    evidence: [
      "Index 1559'da kuruldu, 1966'da kaldırıldı: 407 yıl.",
      "Kopernik'in De revolutionibus'u 1616'da 'düzeltilene kadar' askıya alındı.",
      "Galileo'nun Diyalog'u 1633'te listeye girdi.",
      "İkisi de listeden 1835'te çıktı: Kopernik için 219, Galileo için 202 yıl sonra.",
    ],
    counter_evidence: [
      "Index'in fiilî uygulanabilirliği bölgeden bölgeye ve dönemden döneme büyük farklılık gösterdi; her yerde eşit ölçüde işleyen bir yasak değildi.",
      "Yasaklı listede olmak eserin okunmadığı anlamına gelmez; yasaklı kitapların dolaşımı belgelidir.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        year: 1559,
        title: "Index Librorum Prohibitorum",
        language: "la",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Index Librorum Prohibitorum",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Index_Librorum_Prohibitorum",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["mit-ve-sicil"],
  },

  {
    id: "galileo-1633-mahkumiyeti",
    claim:
      "Galileo 1633'te 'ağır sapkınlık şüphesi' ile mahkûm edildi ve ölümüne kadar ev hapsinde tutuldu; kurumsal düzeltme 1992'yi buldu.",
    status: "established",
    confidence: "high",
    topic: ["kilise", "sansur", "bilim-tarihi", "astronomi"],
    subject: {
      site: "Roma",
      region: "Papalık Devleti",
      modern_country: "İtalya",
      coordinates: { lat: 41.9028, lon: 12.4964 },
    },
    period: {
      earliest: 1616,
      latest: 1992,
      era_label: "İlk uyarıdan resmî kabule",
      precision: "exact",
      dating_method: ["historical-record", "textual"],
    },
    languages: ["İtalyanca", "Latince"],
    disciplines: ["bilim-tarihi", "tarih", "astronomi", "hukuk"],
    people: [
      { name: "Galilei, Galileo", role: "proposer", year: 1633, lifespan: "1564-1642" },
    ],
    popular_claim:
      "Galileo bilimsel gerçeği söylediği için işkence gördü ve hapse atıldı.",
    divergence:
      "Olay gerçek ama ayrıntılar sık yanlış aktarılır: işkence UYGULANMADI, işkence tehdidi usul gereği okundu. Hapis değil EV HAPSİ verildi. Bunlar hafifletici değil düzeltici ayrıntılardır; sicilin ağırlığı zaten belgelerin kendisindedir. Bu kayıt sicilin en az tartışmalı kalemidir: yargılama tutanakları elimizdedir.",
    divergence_type: ["medya-abartisi"],
    evidence: [
      "1633 kararı 'ağır sapkınlık şüphesi' (vehementer suspectus de haeresi) hükmünü içerir.",
      "Galileo görüşünü yeminle reddetmeye zorlandı.",
      "1642'deki ölümüne kadar ev hapsinde kaldı.",
      "Diyalog Index'e alındı ve 1835'e kadar listede kaldı - 202 yıl.",
      "Kurumun yargılamadaki hatayı resmen kabulü 1992'dir: karardan 359 yıl sonra.",
    ],
    counter_evidence: [
      "Yargılamanın arka planında kişisel ve siyasi etkenler de vardı; salt 'bilim karşıtlığı' okuması olayı basitleştirir.",
      "1616'daki ilk uyarının içeriği ve Galileo'nun onu ihlal edip etmediği tarihçiler arasında tartışılmıştır.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        year: 1633,
        title: "Galileo yargılaması tutanakları ve mahkûmiyet kararı",
        language: "la",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Galileo affair",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Galileo_affair",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["mit-ve-sicil"],
  },

  {
    id: "bruno-1600-gerekce",
    claim:
      "Giordano Bruno 1600'de kozmolojik görüşleri yüzünden yakıldı.",
    status: "contested",
    confidence: "medium",
    topic: ["kilise", "sansur", "bilim-tarihi", "felsefe"],
    subject: {
      site: "Campo de' Fiori, Roma",
      region: "Papalık Devleti",
      modern_country: "İtalya",
      coordinates: { lat: 41.8955, lon: 12.4723 },
    },
    period: {
      earliest: 1592,
      latest: 1600,
      era_label: "Tutuklanmadan infaza",
      precision: "exact",
      dating_method: ["historical-record", "textual"],
    },
    languages: ["İtalyanca", "Latince"],
    disciplines: ["bilim-tarihi", "tarih", "felsefe"],
    people: [
      { name: "Bruno, Giordano", role: "proposer", year: 1600, lifespan: "1548-1600" },
    ],
    popular_claim:
      "Bruno, sonsuz evren ve çok sayıda dünya fikri yüzünden yakılan ilk bilim şehididir.",
    divergence:
      "İki uç da kaynakların ötesine geçiyor. 'Bilim için yakıldı' doğru değil: suçlamaların ağırlığı teolojikti - Üçleme, İsa'nın tanrılığı, ekmek-şarap öğretisi, büyü. Ama 'kozmolojinin hiç ilgisi yoktu' da doğru değil: çokluk-dünyalar görüşü suçlama listesinde yer alıyor. Bruno bir bilim insanı değil, Yeni-Platoncu bir filozoftu. Kesin olan tek şey: bir insan düşünceleri yüzünden sekiz yıl hapsedilip diri diri yakıldı.",
    divergence_type: ["medya-abartisi", "ideolojik-secim"],
    evidence: [
      "1592'de tutuklandı, sekiz yıl hapiste tutuldu, 1600'de Campo de' Fiori'de diri diri yakıldı.",
      "Suçlamalar arasında sonsuz evren ve çok sayıda dünya görüşü yer alıyor.",
      "Suçlamaların ağırlığı teolojiktir: Üçleme, İsa'nın tanrılığı, ekmek-şarap öğretisi, büyü uygulaması.",
      "Bruno yargılama sürecinde görüşlerini geri almayı reddetti ve mahkemenin yetkisini tanımadığını söyledi.",
    ],
    counter_evidence: [
      "Yargılamanın tam tutanakları KAYIP; elimizde özet ve dolaylı kayıtlar var. Bu, gerekçe tartışmasının neden çözülemediğinin asıl sebebi.",
      "Tarihçiler kozmolojinin ağırlığı konusunda anlaşamıyor; alanda süren bir tartışmadır.",
    ],
    open_questions: [
      "Kozmolojik suçlamaların karardaki ağırlığı neydi? Tam tutanaklar olmadan çözülemiyor.",
    ],
    sources: [
      {
        tier: "institutional",
        type: "webpage",
        title: "Giordano Bruno",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Giordano_Bruno",
        language: "en",
        accessed: "2026-09-07",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "The Trials of Giordano Bruno (1592-1600)",
        url: "https://www.famous-trials.com/bruno/261-home",
        language: "en",
        accessed: "2026-09-07",
        note: "Yargılama belgelerinin derlemesi.",
      },
    ],
    checked: CHECKED,
    used_in: ["mit-ve-sicil"],
  },

  {
    id: "justinianus-529-atina-okulu",
    claim:
      "529'da Atina'daki Yeni-Platoncu felsefe okulunun kapatılması antik düşüncenin sonunu getirdi.",
    status: "contested",
    confidence: "medium",
    topic: ["kilise", "roma", "felsefe", "sansur"],
    subject: {
      site: "Atina - Yeni-Platoncu okul",
      region: "Yunanistan, Doğu Roma",
      modern_country: "Yunanistan",
      coordinates: { lat: 37.9838, lon: 23.7275 },
    },
    period: {
      earliest: 529,
      latest: 535,
      era_label: "I. Justinianus dönemi",
      precision: "exact",
      dating_method: ["historical-record", "textual"],
    },
    languages: ["Grekçe", "Latince"],
    disciplines: ["tarih", "filoloji", "felsefe"],
    people: [
      { name: "Justinianus I", role: "proposer", year: 529, lifespan: "482-565" },
      { name: "Damaskios", role: "critic", year: 529, lifespan: "y. 458-538" },
    ],
    popular_claim:
      "Justinianus 529'da Atina Akademisi'ni kapattı ve bin yıllık antik felsefe geleneği o gün sona erdi.",
    divergence:
      "Bir kesinti oldu ama 'antik düşüncenin sonu' çerçevesi abartılı. Düzenleme paganların ders vermesini yasakladı ve okul kapandı; hocaları Pers sarayına gitti. Ancak bir kısmı birkaç yıl sonra, bir antlaşma maddesiyle korunarak geri döndü. Ayrıca kapatılan kurum Platon'un Akademisi'nin kesintisiz devamı DEĞİLDİR; özdeşlik popüler anlatının kurduğu bir bağdır.",
    divergence_type: ["medya-abartisi", "guncellenmemis"],
    evidence: [
      "529'da çıkarılan düzenleme paganların ders vermesini yasakladı.",
      "Atina'daki okul kapandı; Damaskios ve çevresi Pers sarayına gitti.",
    ],
    counter_evidence: [
      "Filozofların bir kısmı birkaç yıl sonra, bir antlaşma maddesiyle korunarak geri döndü.",
      "Okulun o tarihte zaten zayıfladığını savunan görüşler var.",
      "Kapatılan kurumun Platon'un Akademisi ile kurumsal sürekliliği yoktur.",
      "Doğu Roma'da felsefe eğitimi başka merkezlerde sürdü.",
    ],
    open_questions: [
      "Kapanma ne kadar tam ve ne kadar kalıcıydı? Kaynaklar yeterli değil.",
    ],
    sources: [
      {
        tier: "primary",
        type: "edition",
        year: 529,
        title: "Codex Justinianus 1.11.10 (pagan öğretim yasağı)",
        language: "la",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "Platonic Academy",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Platonic_Academy",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["mit-ve-sicil"],
  },

  {
    id: "sansurun-toplam-maliyeti",
    claim:
      "Kurumsal sansürün bilim ve düşünce üzerindeki toplam maliyeti hesaplanabilir.",
    status: "unmeasurable",
    confidence: "high",
    topic: ["kilise", "sansur", "yontem", "bilim-tarihi"],
    subject: {
      site: "Avrupa",
      region: "Katolik ve Protestan Avrupa",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 1559,
      latest: 1966,
      era_label: "Index dönemi",
      precision: "range",
      dating_method: ["none", "historical-record"],
    },
    languages: ["Latince", "Fransızca"],
    disciplines: ["bilim-tarihi", "tarih"],
    people: [
      { name: "Descartes, René", role: "analyst", year: 1633, lifespan: "1596-1650" },
    ],
    popular_claim:
      "Kilise sansürü bilimi X yıl geriletti / hiç geriletmedi.",
    divergence:
      "İki iddia da ölçülemez bir şey hakkında sayı veriyor. Yasaklanan kitapları ve yargılamaları SAYABİLİRİZ. Sayamadığımız şey, yasaklanacağı bilindiği için HİÇ YAZILMAYANLAR - tanımı gereği kayıt bırakmayan bir kayıp. Bu, 'bilinmiyor' değil 'ölçülemez' kategorisidir; yöntem yapısal olarak cevap veremez.",
    divergence_type: ["kategori-hatasi"],
    evidence: [
      "Mekanizmanın gerçek olduğunu gösteren belgeli bir vaka var: Descartes, Galileo'nun 1633 mahkûmiyetini duyduğunda tamamlamak üzere olduğu evren kitabını yayımlamaktan vazgeçti ve bunu mektuplarında açıkça yazdı. Eser sağlığında yayımlanmadı.",
      "Bu tek vaka korkunun birinci sınıf bir düşünürü susturabildiğini kanıtlar - ama kaç kez olduğunu vermez.",
    ],
    counter_evidence: [
      "Tek vakadan genelleme yapılamaz; Descartes'ın kararında başka etkenler de olmuş olabilir.",
      "Yasaklı kitapların yine de dolaştığı ve okunduğu belgelidir; sansürün etkinliği her yerde aynı değildi.",
    ],
    open_questions: [
      "Kaç eser hiç yazılmadı? Yapısal olarak cevaplanamaz - kayıt bırakmayan bir kayıp.",
    ],
    sources: [
      {
        tier: "primary",
        type: "manuscript",
        authors: ["Descartes, René"],
        year: 1633,
        title: "Mersenne'e mektuplar - Le Monde'un yayımdan çekilmesi",
        language: "fr",
      },
      {
        tier: "institutional",
        type: "webpage",
        title: "The World (Descartes)",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/The_World_(Descartes)",
        language: "en",
        accessed: "2026-09-07",
      },
    ],
    checked: CHECKED,
    used_in: ["mit-ve-sicil"],
  },

  {
    id: "cadi-avi-donemi",
    claim:
      "Avrupa'daki büyük cadı avı dalgası Ortaçağ'a değil, erken modern döneme (yaklaşık 1560-1630) aittir.",
    status: "established",
    confidence: "medium",
    topic: ["kilise", "erken-modern", "tarih-yazimi"],
    subject: {
      site: "Avrupa",
      region: "Orta ve Batı Avrupa",
      modern_country: "çok uluslu",
    },
    period: {
      earliest: 1450,
      latest: 1750,
      era_label: "Erken modern dönem",
      precision: "range",
      dating_method: ["historical-record"],
    },
    languages: ["Latince", "Almanca"],
    disciplines: ["tarih", "antropoloji"],
    popular_claim:
      "Cadı yakma Ortaçağ karanlığının simgesidir ve milyonlarca kadın yakılmıştır.",
    divergence:
      "İki hata birden: DÖNEM ve SAYI. Yoğunlaşma 16. yüzyıl ortası ile 17. yüzyıl başıdır - yani Rönesans ve Reform SONRASI, hem Katolik hem Protestan bölgelerde. Daha erken dönemde kilise hukuku, gece uçuşu gibi inançları hurafe ve yanılsama sayan bir metni esas alıyordu; sertleşme sonradan geldi. Modern tahminler on binler mertebesindedir; 'milyonlar' rakamı 19.-20. yüzyıl polemiğinin ürünüdür.",
    divergence_type: ["medya-abartisi", "kategori-hatasi"],
    evidence: [
      "Yargılamaların yoğunlaştığı dönem yaklaşık 1560-1630'dur.",
      "Hem Katolik hem Protestan bölgelerde yaşandı; mezhep ayrımı belirleyici değildi.",
      "Erken Ortaçağ kilise hukukunda gece uçuşu inancı yanılsama sayılıyordu.",
    ],
    counter_evidence: [
      "Toplam idam sayısı için verilen aralıklar tartışmalıdır; bu kayıt kesin rakam değil mertebe verir.",
      "Bölgesel farklar çok büyüktür; bazı bölgelerde yargılama neredeyse yokken bazılarında yoğundur.",
    ],
    open_questions: [
      "Toplam idam sayısı nedir? Aralıklar tartışmalı.",
    ],
    sources: [
      {
        tier: "institutional",
        type: "webpage",
        title: "Witch trials in the early modern period",
        container: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Witch_trials_in_the_early_modern_period",
        language: "en",
        accessed: "2026-09-07",
        note: "Ara kaynak; hakemli monografilerle değiştirilmeli.",
      },
    ],
    checked: CHECKED,
    volatile: true,
    used_in: ["mit-ve-sicil"],
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
console.log(`${eklenen.length} kayıt eklendi:`);
eklenen.forEach((id) => console.log("  +", id));
console.log("roma.json toplam:", list.length);
