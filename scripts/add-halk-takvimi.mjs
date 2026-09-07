#!/usr/bin/env node
// Mitoloji VI — Anadolu halk takvimi.
// İlk kez kayıtlar doğrudan v2 kurucusuyla yazılıyor (bkz. lib/finding.mjs).

import { source, cite, ev, finding, commit } from "./lib/finding.mjs";

const CHECKED = "2026-09-07";

/* --- kaynaklar ------------------------------------------------------ */

const halkbilimi = source("halk-takvimi-halkbilimi-derleme", {
  tier: "institutional",
  type: "webpage",
  title: "Halk Takvimi ve Meteorolojisi",
  institution: "Doğu Karadeniz Kültür Envanteri Projesi",
  url: "https://karadeniz.gov.tr/halk-takvimi-ve-meteorolojisi-7/",
  language: "tr",
  accessed: CHECKED,
  note: "Kurumsal kültür envanteri derlemesi. Derleme düzeyindedir; hakemli halkbilimi literatürü taranmamıştır.",
});

const gzt = source("gzt-halk-takvimi-2024", {
  tier: "popular",
  type: "webpage",
  title: "Halk takviminde kasım, zemheri, hamsin ve oğlak kışı",
  institution: "GZT",
  url: "https://www.gzt.com/kultur/halk-takviminde-kasim-zemheri-hamsin-ve-oglak-kisi-koylunun-zamani-okuma-bicimi-3547377",
  language: "tr",
  accessed: CHECKED,
  note: "Popüler kültür yazısı. Dilim adları ve gün sayıları için kullanıldı; tek dayanak değildir.",
});

const ulkerTr = source("ulker-vikipedi-tr", {
  tier: "institutional",
  type: "webpage",
  title: "Ülker (yıldız kümesi)",
  institution: "Vikipedi",
  url: "https://tr.wikipedia.org/wiki/%C3%9Clker_(y%C4%B1ld%C4%B1z_k%C3%BCmesi)",
  language: "tr",
  accessed: CHECKED,
  note: "Ara kaynak; görünürlük eşiği tarihleri için kullanıldı. Astronomik hesapla bağımsız doğrulama yapılmamıştır.",
});

const kasgarli = source("divanu-lugatit-turk", {
  tier: "primary",
  type: "manuscript",
  authors: ["Kâşgarlı Mahmud"],
  year: 1074,
  title: "Dîvânu Lugâti't-Türk",
  language: "tr",
  note: "11. yüzyıl sözlüğü; on iki hayvanlı yıl döngüsünün erken kaydı. Besim Atalay çevirisi üzerinden bilinir; bu kayıtta metin doğrudan görülmemiştir.",
});

/* --- bulgular ------------------------------------------------------- */

const yapiKaydi = finding({
  id: "halk-takvimi-iki-yarim-yapisi",
  claim:
    "Anadolu halk takvimi yılı dört mevsime değil, 8 Kasım ve 6 Mayıs'ta menteşelenen iki yarıma böler ve kış yarısını sayılı dilimlere ayırır.",
  status: "established",
  confidence: "medium",
  topic: ["halk-takvimi", "anadolu", "takvim", "ulker"],
  subject: {
    site: "Anadolu halk takvimi",
    region: "Anadolu",
    modern_country: "Türkiye",
    coordinates: { lat: 39.0, lon: 35.0 },
  },
  period: {
    earliest: 1000,
    latest: 2026,
    era_label: "Belgelenebilir kullanımdan bugüne",
    precision: "approximate",
    dating_method: ["historical-record", "textual"],
  },
  languages: ["Türkçe", "Arapça", "Farsça"],
  disciplines: ["antropoloji", "astronomi", "tarih"],
  popular_claim:
    "Halk takvimi dört mevsime dayanır ve yıl gündönümlerinde döner.",
  divergence:
    "Halk takvimi dört mevsim kullanmaz, İKİ YARIM kullanır: Kasım (kış, 8 Kasım'dan itibaren 179 gün) ve Hızır (yaz, 6 Mayıs'tan itibaren 186 gün). Menteşeler gündönümü ya da ekinoks DEĞİLDİR; ekinokslardan yaklaşık kırk beş gün sonra, yani ekinoksla gündönümünün ortasına düşer. Sebep ölçülebilir: ılıman kuşakta toprak güneşten yaklaşık altı hafta geriden ısınır ve soğur. Takvim güneşi değil toprağı izliyor. Ayrıca dilimlerin adları mevsim değil SAYI belirtir - kırk, elli.",
  divergence_type: ["kategori-hatasi", "guncellenmemis"],
  sources: [halkbilimi, gzt],
  evidence: [
    ev(
      "Yıl iki yarıma bölünür: Kasım (kış) 8 Kasım'da, Hızır (yaz) 6 Mayıs'ta başlar; kış yarısı 179 gündür.",
      cite("halk-takvimi-halkbilimi-derleme", "Halk takvimi bölümü", "direct"),
      { id: "iki-yarim" },
    ),
    ev(
      "Kış yarısı sayılı dilimlere ayrılır: kasım 45 gün, erbain (zemheri, kara kış) 40 gün, hamsin 50 gün.",
      cite("gzt-halk-takvimi-2024", "Yazı gövdesi, dilim tanımları", "direct"),
      { id: "kis-dilimleri" },
    ),
    ev(
      "Halk ölçüsü dilimleri karşılaştırır: 'Hamsin, zemheriden kemsin' - elli gün kırk günden hafiftir.",
      cite("gzt-halk-takvimi-2024", "Yazı gövdesi, deyiş", "direct"),
      { id: "hamsin-zemheri-deyisi" },
    ),
  ],
  counter_evidence: [
    ev(
      "'Anadolu halk takvimi' tekil bir şey değildir; bölgeden bölgeye dilim adları, tarihler ve uygulamalar değişir. Buradaki anlatım kaba bir taramadır.",
      cite("halk-takvimi-halkbilimi-derleme", "Bölgesel derleme kapsamı", "context"),
      { id: "bolgesel-degisim" },
    ),
    ev(
      "Gün sayıları toplamı (45+40+50) 135 eder ve kış yarısının 179 gününü doldurmaz; kalan yaklaşık 44 günlük dilimin adlandırması kaynaklarda tutarlı değildir.",
      cite("gzt-halk-takvimi-2024", "Yazı gövdesi, gün sayıları", "counter"),
      { id: "aritmetik-acik" },
    ),
  ],
  open_questions: [
    "Bölgesel varyasyonların haritası çıkarılmadı.",
    "Kalan ~44 günlük dilim kaynaklarda nasıl adlandırılıyor?",
  ],
  checked: CHECKED,
  used_in: ["yilin-iki-kapisi"],
  review: {
    status: "draft",
    notes: "Derleme ve popüler düzey kaynaklara dayanıyor; hakemli Türkçe halkbilimi literatürü taranmadı.",
  },
});

const menteseKaydi = finding({
  id: "halk-takvimi-ulker-mentesesi",
  claim:
    "Halk takviminin iki menteşe tarihi, Ülker'in akşam göğündeki görünürlük eşiklerine denk gelir.",
  status: "contested",
  confidence: "medium",
  topic: ["halk-takvimi", "ulker", "arkeoastronomi", "anadolu"],
  subject: {
    site: "Anadolu halk takvimi",
    region: "Anadolu",
    modern_country: "Türkiye",
    coordinates: { lat: 39.0, lon: 35.0 },
  },
  period: {
    earliest: 1000,
    latest: 2026,
    era_label: "Belgelenebilir kullanımdan bugüne",
    precision: "disputed",
    dating_method: ["astronomical", "historical-record"],
  },
  languages: ["Türkçe"],
  disciplines: ["astronomi", "antropoloji"],
  popular_claim:
    "Halk takviminin tarihleri binlerce yıllık kadim gök bilgisine dayanır.",
  divergence:
    "Eşleşme bugün gerçekten temiz: Ülker 5 Mayıs'ı 6 Mayıs'a bağlayan akşamdan itibaren görünmez oluyor ve 6 Kasım akşamı geri dönüyor; takvimin kapıları 6 Mayıs ve 8 Kasım. AMA 'binlerce yıllık' iddiası ölçülebilir bir engelle karşılaşıyor: DEVİNİM (presesyon) bir yıldızın yılın hangi gününde göründüğünü yaklaşık her 72 yılda bir gün kaydırır - bin yılda on dört gün. Bugün 6 Kasım'a denk gelen olay bin yıl önce ekim sonundaydı. Üstelik Türkiye 1926'da Rumî'den Miladî takvime geçti ve tarihler yeniden yazıldı. Eşleşmenin ne zaman kurulduğu ÇÖZÜLMEMİŞTİR.",
  divergence_type: ["medya-abartisi", "guncellenmemis"],
  sources: [ulkerTr, halkbilimi],
  evidence: [
    ev(
      "Ülker, 5 Mayıs'ı 6 Mayıs'a bağlayan akşamdan itibaren görünmez oluyor; 6 Kasım akşamı gün batımından sonra yeniden ortaya çıkıyor.",
      cite("ulker-vikipedi-tr", "Görünürlük ve halk takvimi bölümü", "direct"),
      { id: "gorunurluk-esikleri" },
    ),
    ev(
      "Türkçe halkbilimi derlemeleri Kasım dönemini Ülker ile işaretlenmiş olarak tarif eder.",
      cite("halk-takvimi-halkbilimi-derleme", "Halk takvimi ve yıldızlar bölümü", "direct"),
      { id: "kasim-ulker-baglantisi" },
    ),
  ],
  counter_evidence: [
    ev(
      "Devinim, yıldız görünürlük tarihlerini yaklaşık 72 yılda bir gün kaydırır; bugünkü eşleşme geçmişe uzatılamaz.",
      cite("ulker-vikipedi-tr", "Küme konumu ve gözlem bilgileri", "counter"),
      { id: "devinim-itirazi" },
    ),
    ev(
      "Gök olayı 6 Kasım, takvim tarihi 8 Kasım; iki günlük fark açıklanmamıştır.",
      cite("halk-takvimi-halkbilimi-derleme", "Kasım tarihinin verilişi", "counter"),
      { id: "iki-gun-farki" },
    ),
    ev(
      "Görünürlük eşiği tarihleri ara kaynaktan alınmıştır; bağımsız astronomik hesapla doğrulanmamıştır.",
      cite("ulker-vikipedi-tr", "Kaynak düzeyi", "context"),
      { id: "hesap-dogrulanmadi" },
    ),
  ],
  open_questions: [
    "Eşleşme ne zaman kuruldu? Takvim gökyüzüne göre yeniden ayarlandı mı, yoksa eşleşme kısmen tesadüf mü?",
    "6 Kasım ile 8 Kasım arasındaki iki günlük fark neden var?",
  ],
  checked: CHECKED,
  volatile: true,
  used_in: ["yilin-iki-kapisi"],
  review: {
    status: "draft",
    notes: "Astronomik eşleşme bağımsız hesapla doğrulanmadı; devinim itirazı çözülmedi. Bu kayıt bir soru işaretiyle birlikte tutulmaktadır.",
  },
});

const katmanKaydi = finding({
  id: "halk-takvimi-uc-katman",
  claim:
    "Anadolu halk takvimi tek bir kökenden gelmez: yapısı bağımsız icat, dilim adları temas, on iki hayvanlı döngüsü miras kaynaklıdır.",
  status: "established",
  confidence: "medium",
  topic: ["halk-takvimi", "anadolu", "yontem", "karsilastirmali-mitoloji"],
  subject: {
    site: "Anadolu halk takvimi",
    region: "Anadolu ve İç Asya",
    modern_country: "Türkiye",
  },
  period: {
    earliest: 1000,
    latest: 2026,
    era_label: "Kâşgarlı'dan bugüne",
    precision: "range",
    dating_method: ["textual", "historical-record"],
  },
  languages: ["Türkçe", "Arapça", "Farsça"],
  disciplines: ["dilbilim", "antropoloji", "tarih"],
  popular_claim:
    "Halk takvimi kadim Türk gök bilgisinin devamıdır. (Karşı popüler iddia: tamamen Arap-Fars takviminden alınmadır.)",
  divergence:
    "İki popüler iddia da tek bir köken arıyor ve ikisi de eksik. Takvim ÜÇ KATMANLIDIR ve her katmanın cevabı farklıdır. (1) YAPI - yılı ekinoks-gündönümü ortalarında ikiye bölmek ve menteşeyi Ülker'e bağlamak Anadolu'ya özgü değildir; Hesiodos'ta da vardır. Aynı enlem, aynı gökyüzü, aynı ihtiyaç: bağımsız icat. (2) SÖZCÜKLER - erbain (kırk), hamsin (elli), zemherir (şiddetli soğuk) Arapça; 'Ruz-ı Kasım'daki ruz Farsça; Hıdırellez, Hızır ile İlyas'ın birleşmesi. İskeleti adlandıran katman baştan sona alınmış: temas. (3) SAYIM - on iki hayvanlı yıl döngüsü Kâşgarlı Mahmud'un 11. yüzyıl sözlüğünde kayıtlı, yani Anadolu'dan önce var: miras. Sonuç: bir kültürel öğeyi tek kutuya koyan her analiz yanılır.",
  divergence_type: ["kategori-hatasi", "ideolojik-secim"],
  sources: [kasgarli, halkbilimi, gzt],
  evidence: [
    ev(
      "On iki hayvanlı yıl döngüsü 11. yüzyılda Kâşgarlı Mahmud'un sözlüğünde kayıtlıdır; Anadolu'ya gelmeden önce vardı.",
      cite("divanu-lugatit-turk", "On iki hayvanlı yıl döngüsü maddesi", "direct"),
      { id: "hayvan-dongusu-miras" },
    ),
    ev(
      "Kış dilimlerinin adları Arapça sayılardır: erbain kırk, hamsin elli; zemheri şiddetli soğuk anlamındadır.",
      cite("gzt-halk-takvimi-2024", "Dilim adlarının açıklaması", "direct"),
      { id: "arapca-sozcukler" },
    ),
    ev(
      "Yılın iki yarıma bölünmesi ve gök menteşesi ılıman kuşağın tarım toplumlarında yaygındır; aynı çözüm Hesiodos'ta da görülür.",
      cite("halk-takvimi-halkbilimi-derleme", "Halk takvimi ve gök cisimleri bölümü", "inference"),
      { id: "yapi-bagimsiz-icat" },
    ),
  ],
  counter_evidence: [
    ev(
      "Katman ayrımı analitiktir; pratikte katmanlar iç içedir ve bir öğenin hangi katmana ait olduğu her zaman net değildir.",
      cite("halk-takvimi-halkbilimi-derleme", "Derleme kapsamı", "context"),
      { id: "katmanlar-ic-ice" },
    ),
    ev(
      "On iki hayvanlı döngünün Çin takvim geleneğiyle ilişkisi ayrıca tartışmalıdır ve bu kayıtta ele alınmamıştır.",
      cite("divanu-lugatit-turk", "On iki hayvanlı yıl döngüsü maddesi", "context"),
      { id: "cin-baglantisi-acik" },
    ),
    ev(
      "Kâşgarlı'nın metni bu kayıtta doğrudan görülmemiş, ikincil aktarım üzerinden kullanılmıştır.",
      cite("divanu-lugatit-turk", "Kaynak erişim düzeyi", "context"),
      { id: "metin-dogrudan-gorulmedi" },
    ),
  ],
  open_questions: [
    "On iki hayvanlı döngünün Çin takvimiyle ilişkisi nedir? Ayrı bir inceleme konusu.",
    "Katmanlar arasında geçiş noktaları ne zaman oldu?",
  ],
  checked: CHECKED,
  used_in: ["yilin-iki-kapisi"],
  review: {
    status: "draft",
    notes: "Kâşgarlı metni doğrudan görülmedi; birincil edisyonla değiştirilmelidir.",
  },
});

commit("data/findings/mitoloji.json", [yapiKaydi, menteseKaydi, katmanKaydi]);
