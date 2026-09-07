#!/usr/bin/env node
// Sürüm 2 göçü - pilot: mitoloji.json'dan iki kayıt.
//
// NEDEN SADECE İKİ KAYIT: v2 her kanıt için bir LOCATOR ister - kaynağın
// neresi. Toplu göç, 149 kaydın hepsine locator uydurmak demek olurdu ve bu,
// projenin varlık sebebine aykırıdır. Göç kayıt kayıt, kaynağın gerçekten
// hangi kısmını okuduğumuzu söyleyebildiğimiz yerde yapılır.
//
// Bu iki kayıt seçildi çünkü kaynaklarının hangi bölümünü okuduğumuz
// belgelenebilir. Locator'lar özet/gövde düzeyindedir, sayfa düzeyinde
// değildir; bu, her kaynağın note alanında ve review.notes'ta yazılıdır.

import { readFileSync, writeFileSync } from "node:fs";
import { source, cite, ev, finding } from "./lib/finding.mjs";

const PATH = "data/findings/mitoloji.json";
const CHECKED = "2026-09-07";

/* ---------------------------------------------------------------- */

const orlove = source("orlove-chiang-cane-2000", {
  tier: "peer-reviewed",
  type: "article",
  authors: ["Orlove, Benjamin S.", "Chiang, John C. H.", "Cane, Mark A."],
  year: 2000,
  title: "Forecasting Andean rainfall and crop yield from the influence of El Niño on Pleiades visibility",
  container: "Nature",
  volume: "403",
  pages: "68-71",
  doi: "10.1038/47456",
  url: "https://www.nature.com/articles/47456",
  language: "en",
  note: "Künye (DOI, cilt, sayfa) doğrulandı. Locator'lar özet düzeyindedir; tam metin sayfa doğrulaması yapılmamıştır.",
});

const ucdavis = source("ucdavis-2000-basin", {
  tier: "institutional",
  type: "press-release",
  title: "Andean Farmers Accurately Time Rains, Planting, By The Stars",
  institution: "University of California, Davis",
  url: "https://www.ucdavis.edu/news/andean-farmers-accurately-time-rains-planting-stars",
  language: "en",
  accessed: CHECKED,
  note: "Kurumsal özet; mekanizma zincirinin okunabilir aktarımı için kullanıldı.",
});

const andKaydi = finding({
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
    "Bu vakada değil: uygulama gerçekten bilgi taşıyan bir sinyalin okunmasıdır ve modern aletle sınanıp doğrulanmıştır. Zincir şudur: haziranda Ülker soluk görünüyorsa yüksek irtifada ince bulut ve su buharı artmış demektir; bu El Niño yılının erken işaretidir; El Niño ekim mevsiminde daha az yağış ve düşük hasat getirir. Çiftçiler çıplak gözle, aylar öncesinden, işleyen bir tahmin yapıyorlar.",
  divergence_type: ["somurge-anlatisi", "guncellenmemis"],
  sources: [orlove, ucdavis],
  evidence: [
    ev(
      "Çiftçiler haziranda Ülker'in görünürlüğüne bakarak patates ekimini erteleyip ertelemeyeceklerine karar veriyor.",
      cite("ucdavis-2000-basin", "Basın bülteni gövdesi", "direct"),
      { id: "ekim-karari" },
    ),
    ev(
      "Kümenin sönük görünmesi, yüksek irtifadaki bulut miktarı ve su buharı artışıyla açıklanıyor.",
      cite("ucdavis-2000-basin", "Basın bülteni gövdesi, mekanizma bölümü", "direct"),
      { id: "bulut-su-buhari" },
    ),
    ev(
      "Sönük görünürlük, azalan yağış ve düşük hasat El Niño ile ilişkilendirildi; bağlantı uydu verileriyle denetlendi.",
      cite("orlove-chiang-cane-2000", "Başlık ve özet", "direct"),
      { id: "elnino-baglantisi" },
    ),
  ],
  counter_evidence: [
    ev(
      "Bu kayıt mekanizmayı doğrular; geleneksel yöntemin isabet oranını vermez. Modern tahminle karşılaştırmalı başarım ayrı bir sorudur.",
      cite("orlove-chiang-cane-2000", "Başlık ve özet", "context"),
      { id: "isabet-orani-yok" },
    ),
  ],
  open_questions: [
    "Geleneksel yöntemin isabet oranı modern tahminle karşılaştırıldığında nedir?",
  ],
  checked: CHECKED,
  used_in: ["herkesin-saati"],
  review: {
    status: "draft",
    notes: "Locator'lar özet ve basın bülteni gövdesi düzeyindedir; tam metin sayfa doğrulaması yapılmamıştır.",
  },
});

/* ---------------------------------------------------------------- */

const etymonline = source("etymonline-prometheus", {
  tier: "institutional",
  type: "webpage",
  title: "Prometheus - Etymology, Origin & Meaning",
  container: "Online Etymology Dictionary",
  institution: "Online Etymology Dictionary",
  url: "https://www.etymonline.com/word/prometheus",
  language: "en",
  accessed: CHECKED,
  note: "Sözlük maddesi; Yunanca içi türetme ve alternatif öneri için kullanıldı.",
});

const cybalist = source("cybalist-pramantha", {
  tier: "institutional",
  type: "webpage",
  title: "Pramantha/Prometheus: a false etymology?",
  institution: "Cybalist dilbilim listesi arşivi",
  url: "https://wrdingham.co.uk/cybalist/msg/169/75.html",
  language: "en",
  accessed: CHECKED,
  note: "Dilbilim tartışma arşivi; biçimsel uyuşmazlık gerekçesi için kullanıldı. Hakemli değil - bu yüzden yalnız dayanak değil.",
});

const prometheusKaydi = finding({
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
  ],
  popular_claim:
    "Prometheus adının Sanskritçe ateş burgusu pramantha ile aynı kökten geldiği kanıtlanmıştır.",
  divergence:
    "İddia 19. yüzyılda önerildi ve o günden beri 'kesin kanıt' olarak dolaşıyor. Çekici çünkü hem ses hem anlam uyuyor gibi. Ama biçimsel olarak oturmuyor; Yunanca içi türetme ise sorunsuz çalışıyor ve kardeş adı Epimetheus ile bir çift oluşturuyor.",
  divergence_type: ["eski-ceviri", "guncellenmemis", "medya-abartisi"],
  sources: [etymonline, cybalist],
  evidence: [
    ev(
      "Ad antik dönemden beri 'önceden düşünen' olarak yorumlanır: pro- (önce) + mathein/mēthos (öğrenmek, düşünmek).",
      cite("etymonline-prometheus", "Madde gövdesi", "direct"),
      { id: "yunanca-turetme" },
    ),
    ev(
      "Sanskritçe pramantha 'ateş burgusu' demektir ve 'şiddetle karıştırmak' anlamındaki bir kökten gelir, ancak Yunanca Promētheus ile biçimsel olarak tam örtüşmez.",
      cite("cybalist-pramantha", "Tartışma iletisi gövdesi", "counter"),
      { id: "bicimsel-uyusmazlik" },
    ),
  ],
  counter_evidence: [
    ev(
      "Alternatif bir öneri ikinci öğenin 'çalmak' anlamındaki bir kökten gelebileceğini savunur; bu da tartışmalıdır.",
      cite("etymonline-prometheus", "Madde gövdesi, alternatif öneri", "context"),
      { id: "calmak-onerisi" },
    ),
    ev(
      "Bu kayıt Sanskritçe bağlantısının yerleşik olmadığını söyler; kesin olarak imkânsız olduğunu değil.",
      cite("cybalist-pramantha", "Tartışma iletisi gövdesi", "context"),
      { id: "kapsam-siniri" },
    ),
  ],
  open_questions: [
    "İkinci öğenin kökeni kesin olarak belirlendi mi? Hayır.",
  ],
  checked: CHECKED,
  used_in: ["calinan-ates"],
  review: {
    status: "draft",
    notes: "Locator'lar sayfa gövdesi düzeyindedir. Hakemli dilbilim kaynağıyla değiştirilmeli; cybalist arşivi hakemli değildir ve tek dayanak olarak kullanılmamıştır.",
  },
});

/* ---------------------------------------------------------------- */

const yeni = [andKaydi, prometheusKaydi];
const list = JSON.parse(readFileSync(PATH, "utf8"));

let degisen = 0;
for (const r of yeni) {
  const i = list.findIndex((x) => x.id === r.id);
  if (i === -1) {
    console.error(`bulunamadı: ${r.id} - göç hedefi mevcut olmalı`);
    process.exit(1);
  }
  const onceki = list[i].schema_version ?? 1;
  list[i] = r;
  degisen += 1;
  console.log(`  v${onceki} -> v2  ${r.id}`);
}

writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
const v2 = list.filter((r) => r.schema_version === 2).length;
console.log(`\n${degisen} kayıt göç etti. ${PATH}: ${v2}/${list.length} v2`);
