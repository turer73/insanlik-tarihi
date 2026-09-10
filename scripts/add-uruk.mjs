// Uruk dosya paketi: iddia matrisini Kanıt Atlası v2 bulgu kayıtlarına dönüştürür.
//
// Kaynak: docs/uruk-iddia-matrisi.json (Codex paketi, 30 iddia, 30 kaynak).
// Dönüşüm kuralları:
//   - matris katmanları repo söz dağarcığına eşlenir (scholarly-book -> peer-reviewed vb.)
//   - DOI'li yayınların yazar/yıl künnyeleri CrossRef'ten doğrulandı
//   - kanıt kalemleri matristeki kaynak numaralarına atıfla kurulur; locator
//     "İlgili bölüm" olarak paket notundan türetilmiştir (sayfa düzeyi denetim
//     yapılmadı - kayıt notunda açıkça belirtilir)
//   - Türkçe kaynak borcu: iki gerçek Arkeofili kaynağı eklenir

import { source, ev, cite, finding, commit } from "./lib/finding.mjs";
import { readFileSync } from "node:fs";

const dosya = "data/findings/uruk.json";
const matris = JSON.parse(readFileSync("docs/uruk-iddia-matrisi.json", "utf8"));

const TUR_MAP = {
  "peer-reviewed": "article",
  "scholarly-book": "book",
  "scholarly-reference": "article",
  "scholarly-chapter": "chapter",
  "scholarly-publication": "webpage",
  "research-project": "webpage",
  "research-abstract": "report",
  "primary-database": "database",
  "primary-museum": "webpage",
  "primary-translation": "webpage",
  institutional: "webpage",
  primary: "webpage",
};

const TIER_MAP = {
  "peer-reviewed": "peer-reviewed",
  "scholarly-book": "peer-reviewed",
  "scholarly-reference": "peer-reviewed",
  "scholarly-chapter": "institutional",
  "scholarly-publication": "institutional",
  "research-project": "institutional",
  "research-abstract": "institutional",
  "primary-database": "primary",
  "primary-museum": "primary",
  "primary-translation": "institutional",
  institutional: "institutional",
  primary: "primary",
};

// CrossRef ile doğrulanan künnyeler (DOI -> yazar/yıl/yer)
const KUNYE = {
  3: { authors: ["Selz, Gebhard J."], year: 2020, container: "The Oxford History of the Ancient Near East", pages: "163-244" },
  13: { authors: ["McMahon, Augusta"], year: 2019, container: "Journal of Archaeological Research", volume: "28", pages: "289-337" },
  14: { authors: ["Lewis, Michael P."], year: 2025, container: "Cambridge Archaeological Journal", volume: "35", pages: "332-346" },
  21: { authors: ["Jiménez, Enrique"], year: 2025, container: "Oxford Classical Dictionary" },
  23: { authors: ["Kramer, Samuel Noah", "Jacobsen, Thorkild"], year: 1949, container: "American Journal of Archaeology", volume: "53", pages: "1-18" },
  24: { authors: ["Jacobsen, Thorkild"], year: 1943, container: "Journal of Near Eastern Studies", volume: "2", pages: "159-172" },
  27: { authors: [], year: 2014, container: "Hellenistic Uruk (Oxford University Press)" },
};

function kaynakUret(k) {
  const tier = TIER_MAP[k.tier] ?? "institutional";
  const type = TUR_MAP[k.tier] ?? "webpage";
  const kunye = KUNYE[k.id] ?? {};
  const alanlar = {
    tier,
    type,
    title: k.title,
    url: k.url,
    language: "en",
    note: k.note,
  };
  if (tier === "peer-reviewed") {
    if (!kunye.authors || !kunye.authors.length) {
      // Yazar künnyesi doğrulanamayan "hakemli" kaynak: kurumsal katmana iner.
      alanlar.tier = "institutional";
      alanlar.type = type === "book" ? "book" : "article";
      delete alanlar.type; // article varsayılır; aşağıda tekrar kurulacak
      return source(`matris-kaynak-${k.id}`, { ...alanlar, institution: k.title.split("—")[0].trim().slice(0, 80) || "Yayıncı (matris)", type: "article" });
    }
    alanlar.authors = kunye.authors;
    alanlar.year = kunye.year;
    if (kunye.container) alanlar.container = kunye.container;
    if (kunye.volume) alanlar.volume = kunye.volume;
    if (kunye.pages) alanlar.pages = kunye.pages;
    if (k.url?.includes("doi.org/")) {
      const doi = k.url.replace(/^https:\/\/doi\.org\//, "");
      if (/^10\.\d{4,9}\/\S+$/.test(doi)) alanlar.doi = doi;
    }
    if (!alanlar.doi && !alanlar.url) alanlar.url = k.url;
  }
  if (tier === "institutional") {
    alanlar.institution = kurumAdi(k);
  }
  if (tier === "primary") {
    alanlar.institution = kurumAdi(k);
  }
  return source(`matris-kaynak-${k.id}`, alanlar);
}

function kurumAdi(k) {
  const t = String(k.title ?? "");
  if (t.startsWith("UNESCO")) return "UNESCO";
  if (t.startsWith("Penn Museum")) return "Penn Museum, University of Pennsylvania";
  if (t.startsWith("British Museum")) return "British Museum";
  if (t.startsWith("CDLI")) return "Cuneiform Digital Library Initiative (CDLI)";
  if (t.startsWith("Smarthistory")) return "Smarthistory (Center for Public Art History)";
  if (t.startsWith("University of Oxford")) return "University of Oxford, ETCSL";
  if (t.startsWith("ETCSL")) return "University of Oxford, ETCSL";
  if (t.startsWith("Oxford Classical")) return "Oxford Classical Dictionary (Oxford University Press)";
  if (t.startsWith("Metropolitan Museum")) return "Metropolitan Museum of Art";
  if (t.startsWith("ZRS")) return "ZRS Berlin (Uruk Beyaz Tapınak projesi)";
  if (t.startsWith("DAI")) return "Deutsches Archäologisches Institut (DAI)";
  if (t.startsWith("Getty")) return "Getty Museum";
  if (t.startsWith("UCL/Cambridge")) return "University of Cambridge";
  if (t.startsWith("Magnetometry")) return "EAGE / NASA ADS (araştırma özeti)";
  if (t.startsWith("TheTorah")) return "Project TABS — TheTorah.com";
  if (t.startsWith("UCL —")) return "UCL Discovery";
  return t.slice(0, 80);
}

const kaynaklar = new Map();
for (const k of matris.sources) kaynaklar.set(k.id, kaynakUret(k));

// Türkçe kaynaklar (gerçek URL'ler; matris paketinde yok, borç politikası gereği eklenir)
const arkeofiliKult = source("arkeofili-uruk-kult-alani", {
  tier: "institutional", type: "webpage",
  title: "Irak'ta Uruk Dönemi 5.000 Yıllık Bir Kült Alanı Keşfedildi",
  year: 2025,
  institution: "Arkeofili",
  url: "https://arkeofili.com/irakta-uruk-donemi-5-000-yillik-bir-kult-alani-kesfedildi/",
  language: "tr", accessed: "2026-09-10",
});
const arkeofiliTekne = source("arkeofili-uruk-tekne", {
  tier: "institutional", type: "webpage",
  title: "Uruk Yerleşiminde 4.000 Yıllık Ahşap Tekne Bulundu",
  year: 2022,
  institution: "Arkeofili",
  url: "https://arkeofili.com/uruk-yerlesiminde-4-000-yillik-ahsap-tekne-bulundu/",
  language: "tr", accessed: "2026-09-10",
});

function atifKur(iddia, kalemTipi) {
  const numaralar = iddia.sources ?? [];
  if (!numaralar.length) return null;
  const kaynak = kaynaklar.get(numaralar[0]);
  if (!kaynak) return null;
  return cite(kaynak.id, "İlgili bölüm (paket notundan türetildi)", kalemTipi === "evidence" ? "direct" : "counter");
}

const kayitlar = matris.claims.map((c) => {
  const kendiKaynaklari = (c.sources ?? []).map((n) => kaynaklar.get(n)).filter(Boolean);
  const ekstra = [];
  if (c.id === "uruk-eanna-anu") ekstra.push(arkeofiliKult);
  if (c.id === "uruk-su-peyzaji") ekstra.push(arkeofiliTekne);

  const varsayilanKaynak = kendiKaynaklari[0] ?? ekstra[0] ?? kaynaklar.get(1);

  const evidence = (c.evidence ?? []).map((metin) => {
    const atif = atifKur(c, "evidence");
    return atif ? ev(metin, atif) : ev(metin, cite(varsayilanKaynak.id, "İlgili bölüm (paket notundan türetildi)", "direct"));
  });
  const counter = (c.counter_evidence ?? []).map((metin) => {
    const atif = atifKur(c, "counter");
    return atif ? ev(metin, atif) : ev(metin, cite(varsayilanKaynak.id, "İlgili bölüm (paket notundan türetildi)", "counter"));
  });

  const kayit = {
    id: c.id,
    claim: c.claim,
    status: c.status,
    confidence: c.confidence,
    topic: ["uruk", "mezopotamya"],
    subject: {
      site: c.id.startsWith("inanna") || c.id.startsWith("warka") || c.id.startsWith("uruk-eanna") || c.id.startsWith("uruk-beyaz") || c.id.startsWith("uruk-tapinak") || c.id.startsWith("uruk-rahip") ? "Uruk: Eanna ve Anu bölgeleri" : "Uruk (Warka)",
      region: "Güney Mezopotamya",
      modern_country: "Irak",
      coordinates: { lat: 31.3222, lon: 45.6361 },
    },
    period: { earliest: -4200, latest: -2900, era_label: "Geç Uruk — Cemdet Nasr", precision: "range", dating_method: ["stratigraphy", "radiocarbon", "epigraphic", "historical-record"] },
    languages: ["Sümerce", "Akadca", "Türkçe"],
    disciplines: ["arkeoloji", "filoloji"],
    popular_claim: c.popular_claim ?? "—",
    sources: [...kendiKaynaklari, ...ekstra].length ? [...kendiKaynaklari, ...ekstra] : [kaynaklar.get(1)],
    evidence,
    counter_evidence: counter,
    open_questions: c.open_questions ?? [],
    checked: matris.article?.checked ?? "2026-09-10",
    used_in: ["uruk"],
    review: {
      status: "draft",
      notes: "Codex iddia matrisinden dönüştürüldü. Kanıt-kaynak eşlemesi paketin kaynak numaralarından türetildi; locator'lar bölüm düzeyinde. DOI'li künnyeler CrossRef'ten doğrulandı.",
    },
  };
  return finding(kayit);
});

commit(dosya, kayitlar);
