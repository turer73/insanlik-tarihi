#!/usr/bin/env node
// Tek seferlik zenginleştirme: şemanın ilk sürümünde yazılmış kayıtlara
// subject / period / languages / disciplines / people / divergence_type ekler.
// Var olan alanları EZMEZ - yalnızca eksikleri doldurur.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const C = {
  kumran: { site: "Kumran mağaraları", region: "Yehuda Çölü, Ölü Deniz kuzeybatı kıyısı", modern_country: "Batı Şeria (fiilî İsrail idaresi)", coordinates: { lat: 31.7414, lon: 35.4594 } },
  babil: { site: "Babil", site_native: "Bāb-ilim", region: "Mezopotamya, Fırat kıyısı", modern_country: "Irak", coordinates: { lat: 32.5422, lon: 44.4211 } },
  ur: { site: "Ur", region: "Güney Mezopotamya", modern_country: "Irak", coordinates: { lat: 30.9626, lon: 46.1031 } },
  toba: { site: "Toba Kalderası", region: "Kuzey Sumatra", modern_country: "Endonezya", coordinates: { lat: 2.6845, lon: 98.8756 } },
  vinland: { site: "L'Anse aux Meadows", region: "Newfoundland", modern_country: "Kanada", coordinates: { lat: 51.9639, lon: -55.5322 } },
  scablands: { site: "Channeled Scablands", region: "Doğu Washington", modern_country: "ABD", coordinates: { lat: 47.1, lon: -118.5 } },
};

const E = {
  // ---------------- Ölü Deniz ----------------
  "dss-ester-haric-tum-kitaplar": {
    subject: C.kumran,
    period: { earliest: -250, latest: 68, era_label: "Helenistik - Erken Roma", precision: "range", dating_method: ["radiocarbon", "paleography"] },
    languages: ["İbranice", "Aramice", "Grekçe"], disciplines: ["arkeoloji", "filoloji", "metin-elestirisi"],
  },
  "dss-isaiah-53-11-isik-varyanti": {
    subject: C.kumran,
    period: { earliest: -125, latest: -100, era_label: "Geç Helenistik", precision: "approximate", dating_method: ["paleography", "radiocarbon"] },
    languages: ["İbranice", "Grekçe"], disciplines: ["metin-elestirisi", "filoloji"],
    people: [{ name: "Tov, Emanuel", role: "editor", affiliation: "Kudüs İbrani Üniversitesi", year: 1990 }],
    divergence_type: ["kategori-hatasi"],
  },
  "dss-essene-kimligi": {
    subject: C.kumran,
    period: { earliest: -150, latest: 68, era_label: "Hasmoni - Erken Roma", precision: "range", dating_method: ["radiocarbon", "stratigraphy", "paleography"] },
    languages: ["İbranice", "Aramice"], disciplines: ["arkeoloji", "filoloji", "tarih"],
    people: [
      { name: "de Vaux, Roland", role: "excavator", affiliation: "École Biblique, Kudüs", year: 1951, lifespan: "1903-1971" },
      { name: "Schiffman, Lawrence", role: "proposer", affiliation: "New York University", year: 1994 },
      { name: "Golb, Norman", role: "proposer", affiliation: "University of Chicago", year: 1995, lifespan: "1928-2020" },
      { name: "Magness, Jodi", role: "analyst", affiliation: "University of North Carolina", year: 2002 },
    ],
    divergence_type: ["guncellenmemis"],
  },
  "dss-bakir-parsomen-hazine-bulunamadi": {
    subject: C.kumran,
    period: { earliest: 1, latest: 100, era_label: "Erken Roma", precision: "century", dating_method: ["paleography"] },
    languages: ["İbranice"], disciplines: ["filoloji", "arkeoloji"],
    people: [{ name: "Baker, H. Wright", role: "analyst", affiliation: "Manchester College of Technology", year: 1955, note: undefined }],
  },
  "dss-museum-of-the-bible-sahte": {
    subject: { site: "Museum of the Bible koleksiyonu", region: "Washington DC", modern_country: "ABD" },
    period: { earliest: 2002, latest: 2020, era_label: "Modern antika piyasası", precision: "range", dating_method: ["isotopic", "radiocarbon"] },
    languages: ["İbranice"], disciplines: ["arkeoloji", "filoloji"],
    people: [
      { name: "Loll, Colette", role: "analyst", affiliation: "Art Fraud Insights", year: 2020 },
      { name: "Justnes, Årstein", role: "critic", affiliation: "University of Agder", year: 2016 },
    ],
    divergence_type: ["provenans-yoklugu"],
  },
  "dss-7q5-markos-iddiasi": {
    subject: C.kumran,
    period: { earliest: -50, latest: 68, era_label: "Erken Roma", precision: "approximate", dating_method: ["paleography"] },
    languages: ["Grekçe"], disciplines: ["filoloji", "metin-elestirisi"],
    people: [
      { name: "O'Callaghan, José", role: "proposer", affiliation: "Pontificio Istituto Biblico", year: 1972, lifespan: "1922-2001" },
      { name: "Thiede, Carsten Peter", role: "proposer", affiliation: "-", year: 1992, lifespan: "1952-2004" },
    ],
    divergence_type: ["ideolojik-secim"],
  },
  "dss-mulkiyet-ihtilafi": {
    subject: C.kumran,
    period: { earliest: 1947, latest: 2026, era_label: "Modern", precision: "range", dating_method: ["historical-record"] },
    disciplines: ["hukuk", "tarih"],
  },
  "dss-yayin-tikanmasi": {
    subject: C.kumran,
    period: { earliest: 1953, latest: 2011, era_label: "Modern yayın tarihi", precision: "range", dating_method: ["historical-record"] },
    disciplines: ["bilim-tarihi", "filoloji"],
    people: [
      { name: "Tov, Emanuel", role: "editor", affiliation: "DJD baş editörlüğü", year: 1990 },
      { name: "Wacholder, Ben-Zion", role: "analyst", affiliation: "Hebrew Union College", year: 1991, lifespan: "1924-2011" },
      { name: "Abegg, Martin", role: "analyst", affiliation: "Hebrew Union College", year: 1991 },
      { name: "Shanks, Hershel", role: "critic", affiliation: "Biblical Archaeology Society", year: 1991, lifespan: "1930-2021" },
    ],
    divergence_type: ["medya-abartisi"],
  },

  // ---------------- Tufan ----------------
  "tufan-evrensel-degil": {
    period: { earliest: -1700, latest: 1918, era_label: "Metin geleneği ve modern derleme", precision: "range", dating_method: ["textual", "historical-record"] },
    languages: ["Akadca", "Sümerce", "İbranice"], disciplines: ["filoloji", "antropoloji", "metin-elestirisi"],
    people: [{ name: "Frazer, James George", role: "proposer", affiliation: "University of Cambridge", year: 1918, lifespan: "1854-1941" }],
    divergence_type: ["ideolojik-secim", "kategori-hatasi"],
  },
  "tufan-misirda-yok": {
    subject: { site: "Mısır külliyatı", region: "Nil Vadisi", modern_country: "Mısır" },
    period: { earliest: -2600, latest: -1100, era_label: "Eski - Yeni Krallık", precision: "range", dating_method: ["textual", "epigraphic"] },
    languages: ["Mısırca"], disciplines: ["filoloji", "tarih"],
    people: [{ name: "Hornung, Erik", role: "editor", affiliation: "Universität Basel", year: 1982, lifespan: "1933-2022" }],
  },
  "tufan-cin-yapisi-ters": {
    subject: { site: "Sarı Irmak havzası", region: "Kuzey Çin Ovası", modern_country: "Çin" },
    period: { earliest: -2000, latest: -300, era_label: "Efsanevi Xia - Savaşan Devletler (metin)", precision: "range", dating_method: ["textual"] },
    languages: ["Klasik Çince"], disciplines: ["filoloji", "antropoloji"],
    people: [{ name: "Lewis, Mark Edward", role: "analyst", affiliation: "Stanford University", year: 2006 }],
    divergence_type: ["kategori-hatasi"],
  },
  "tufan-kus-testi-bagimlilik-kaniti": {
    subject: { region: "Mezopotamya - Levant", modern_country: "Irak / İsrail-Filistin" },
    period: { earliest: -1200, latest: -500, era_label: "Orta Assur - Sürgün sonrası", precision: "range", dating_method: ["textual", "paleography"] },
    languages: ["Akadca", "İbranice"], disciplines: ["filoloji", "metin-elestirisi"],
    people: [{ name: "George, Andrew R.", role: "editor", affiliation: "SOAS, University of London", year: 2003 }],
  },
  "tufan-atrahasis-sebep-gurultu": {
    subject: { region: "Mezopotamya", modern_country: "Irak" },
    period: { earliest: -1700, latest: -1600, era_label: "Eski Babil", precision: "approximate", dating_method: ["paleography", "textual"] },
    languages: ["Akadca"], disciplines: ["filoloji"],
    people: [
      { name: "Lambert, Wilfred G.", role: "editor", affiliation: "University of Birmingham", year: 1969, lifespan: "1926-2011" },
      { name: "Millard, Alan R.", role: "editor", affiliation: "University of Liverpool", year: 1969 },
    ],
  },
  "tufan-popol-vuh-fetih-sonrasi": {
    subject: { site: "Popol Vuh elyazması", region: "K'iche' bölgesi, Yukarı Guatemala", modern_country: "Guatemala" },
    period: { earliest: 1555, latest: 1701, era_label: "Sömürge dönemi", precision: "approximate", dating_method: ["historical-record", "textual"] },
    languages: ["K'iche' Mayacası", "İspanyolca"], disciplines: ["filoloji", "antropoloji", "tarih"],
    people: [{ name: "Ximénez, Francisco", role: "translator", affiliation: "Dominiken misyonu", year: 1701, lifespan: "1666-1729" }],
    divergence_type: ["provenans-yoklugu", "somurge-anlatisi"],
  },
  "tufan-ur-katmani-tek-olay-degil": {
    subject: C.ur,
    period: { earliest: -3500, latest: -2500, era_label: "Ubeyd - Erken Hanedanlar", precision: "range", dating_method: ["stratigraphy", "radiocarbon"] },
    disciplines: ["arkeoloji", "jeoarkeoloji"],
    people: [{ name: "Woolley, Leonard", role: "excavator", affiliation: "British Museum / Penn Museum", year: 1929, lifespan: "1880-1960" }],
    divergence_type: ["guncellenmemis", "medya-abartisi"],
  },
  "tufan-karadeniz-felaket-hipotezi": {
    subject: { site: "Karadeniz havzası", region: "Karadeniz - Boğazlar", modern_country: "Türkiye ve çevresi", coordinates: { lat: 43.4, lon: 34.3 } },
    period: { earliest: -5600, latest: -5500, era_label: "Erken Holosen", precision: "approximate", dating_method: ["radiocarbon", "stratigraphy"] },
    disciplines: ["jeoloji", "jeoarkeoloji"],
    people: [
      { name: "Ryan, William B. F.", role: "proposer", affiliation: "Columbia University, Lamont-Doherty", year: 1997 },
      { name: "Pitman, Walter C.", role: "proposer", affiliation: "Columbia University, Lamont-Doherty", year: 1997, lifespan: "1931-2019" },
    ],
  },
  "tufan-manu-bagimsizligi": {
    subject: { region: "Kuzey Hindistan, Ganj havzası", modern_country: "Hindistan" },
    period: { earliest: -700, latest: 500, era_label: "Geç Vedik - Purana dönemi", precision: "range", dating_method: ["textual"] },
    languages: ["Sanskritçe"], disciplines: ["filoloji", "antropoloji"],
  },
  "tufan-avustralya-deniz-seviyesi-hafizasi": {
    subject: { region: "Avustralya kıyıları", modern_country: "Avustralya" },
    period: { earliest: -7000, latest: 2016, era_label: "Holosen deniz yükselmesi - modern derleme", precision: "range", dating_method: ["radiocarbon", "historical-record"] },
    languages: ["Aborjin dilleri"], disciplines: ["antropoloji", "jeoloji"],
    people: [
      { name: "Nunn, Patrick D.", role: "proposer", affiliation: "University of the Sunshine Coast", year: 2016 },
      { name: "Reid, Nicholas", role: "proposer", affiliation: "University of New England", year: 2016 },
    ],
  },

  // ---------------- Felaketler ----------------
  "felaket-milankovic-donguleri": {
    period: { earliest: -2600000, latest: 2026, era_label: "Kuvaterner", precision: "range", dating_method: ["isotopic", "astronomical", "radiocarbon"] },
    disciplines: ["iklim-bilimi", "astronomi", "jeoloji"],
    people: [
      { name: "Milanković, Milutin", role: "proposer", affiliation: "Belgrad Üniversitesi", year: 1920, lifespan: "1879-1958" },
      { name: "Hays, James D.", role: "analyst", affiliation: "Lamont-Doherty", year: 1976 },
      { name: "Shackleton, Nicholas", role: "analyst", affiliation: "University of Cambridge", year: 1976, lifespan: "1937-2006" },
    ],
  },
  "felaket-orta-pleyistosen-gecisi": {
    period: { earliest: -1200000, latest: -800000, era_label: "Orta Pleyistosen Geçişi", precision: "range", dating_method: ["isotopic", "stratigraphy"] },
    disciplines: ["iklim-bilimi", "jeoloji"],
  },
  "felaket-yok-olus-volkanizma": {
    period: { earliest: -444000000, latest: -66000000, era_label: "Paleozoik - Mezozoik sonu", precision: "range", dating_method: ["isotopic", "stratigraphy"] },
    disciplines: ["paleontoloji", "jeoloji"],
    divergence_type: ["medya-abartisi"],
  },
  "felaket-chicxulub-dekkan-paylari": {
    subject: { site: "Chicxulub krateri", region: "Yucatán", modern_country: "Meksika", coordinates: { lat: 21.4, lon: -89.516 } },
    period: { earliest: -66043000, latest: -66000000, era_label: "Kretase-Paleojen sınırı", precision: "approximate", dating_method: ["isotopic", "stratigraphy"] },
    disciplines: ["paleontoloji", "jeoloji"],
    people: [{ name: "Alvarez, Luis W.", role: "proposer", affiliation: "UC Berkeley", year: 1980, lifespan: "1911-1988" }],
  },
  "felaket-genc-dryas-carpma-hipotezi": {
    period: { earliest: -12900, latest: -11700, era_label: "Genç Dryas", precision: "approximate", dating_method: ["radiocarbon", "isotopic"] },
    disciplines: ["jeoloji", "iklim-bilimi"],
    people: [{ name: "Firestone, Richard B.", role: "proposer", affiliation: "Lawrence Berkeley National Laboratory", year: 2007 }],
    divergence_type: ["medya-abartisi"],
  },
  "felaket-toba-darbogazi": {
    subject: C.toba,
    period: { earliest: -74000, latest: -73000, era_label: "Geç Pleyistosen", precision: "approximate", dating_method: ["isotopic", "radiocarbon", "stratigraphy"] },
    disciplines: ["genetik", "arkeoloji", "jeoloji"],
    people: [{ name: "Ambrose, Stanley H.", role: "proposer", affiliation: "University of Illinois", year: 1998 }],
    divergence_type: ["guncellenmemis", "medya-abartisi"],
  },
  "felaket-miyake-993-tarihleme": {
    subject: C.vinland,
    period: { earliest: 993, latest: 1021, era_label: "Viking Kuzey Atlantik", precision: "exact", dating_method: ["dendrochronology", "radiocarbon"] },
    disciplines: ["astronomi", "arkeoloji"],
    people: [
      { name: "Miyake, Fusa", role: "discoverer", affiliation: "Nagoya University", year: 2012 },
      { name: "Kuitems, Margot", role: "analyst", affiliation: "Rijksuniversiteit Groningen", year: 2021 },
    ],
  },
  "felaket-wegener-mekanizma-dersi": {
    period: { earliest: 1596, latest: 1963, era_label: "Gözlemden kanıta", precision: "range", dating_method: ["historical-record"] },
    disciplines: ["jeoloji", "bilim-tarihi"],
    people: [
      { name: "Ortelius, Abraham", role: "proposer", affiliation: "-", year: 1596, lifespan: "1527-1598" },
      { name: "Wegener, Alfred", role: "proposer", affiliation: "Universität Graz", year: 1912, lifespan: "1880-1930" },
      { name: "Jeffreys, Harold", role: "critic", affiliation: "University of Cambridge", year: 1924, lifespan: "1891-1989" },
      { name: "Tharp, Marie", role: "surveyor", affiliation: "Lamont Geological Observatory", year: 1952, lifespan: "1920-2006" },
      { name: "Hess, Harry", role: "proposer", affiliation: "Princeton University", year: 1962, lifespan: "1906-1969" },
      { name: "Vine, Frederick", role: "analyst", affiliation: "University of Cambridge", year: 1963, lifespan: "1939-2024" },
      { name: "Matthews, Drummond", role: "analyst", affiliation: "University of Cambridge", year: 1963, lifespan: "1931-1997" },
    ],
    divergence_type: ["medya-abartisi"],
  },
  "felaket-bretz-missoula": {
    subject: C.scablands,
    period: { earliest: -15000, latest: -13000, era_label: "Geç Pleyistosen buzul selleri", precision: "range", dating_method: ["radiocarbon", "stratigraphy"] },
    disciplines: ["jeoloji", "bilim-tarihi"],
    people: [{ name: "Bretz, J Harlen", role: "proposer", affiliation: "University of Chicago", year: 1923, lifespan: "1882-1981" }],
  },
  "felaket-insan-arsivi-5200-yil": {
    period: { earliest: -3200, latest: 2026, era_label: "Yazının icadından bugüne", precision: "range", dating_method: ["historical-record", "radiocarbon"] },
    languages: ["Sümerce"], disciplines: ["tarih", "arkeoloji"],
  },

  // ---------------- Babil ----------------
  "babil-ad-etimolojisi": {
    subject: C.babil,
    period: { earliest: -1800, latest: -500, era_label: "Eski Babil - Sürgün dönemi", precision: "range", dating_method: ["textual", "epigraphic"] },
    languages: ["Akadca", "İbranice"], disciplines: ["dilbilim", "filoloji"],
    divergence_type: ["ideolojik-secim"],
  },
  "babil-etemenanki-yuksekligi": {
    subject: { ...C.babil, site: "Etemenanki zigguratı", site_native: "É-temen-an-ki" },
    period: { earliest: -604, latest: -323, era_label: "Yeni Babil - Helenistik", precision: "disputed", dating_method: ["none", "textual"] },
    languages: ["Akadca", "Sümerce"], disciplines: ["arkeoloji", "mimarlik"],
    people: [{ name: "Koldewey, Robert", role: "excavator", affiliation: "Deutsche Orient-Gesellschaft", year: 1899, lifespan: "1855-1925" }],
    divergence_type: ["guncellenmemis", "medya-abartisi"],
  },
  "babil-kuleyi-iskender-sokturdu": {
    subject: { ...C.babil, site: "Etemenanki zigguratı", site_native: "É-temen-an-ki" },
    period: { earliest: -331, latest: -323, era_label: "Helenistik geçiş", precision: "approximate", dating_method: ["historical-record"] },
    languages: ["Grekçe"], disciplines: ["tarih", "arkeoloji"],
    people: [{ name: "Büyük İskender", role: "excavator", affiliation: "Makedonya Krallığı", year: -331, lifespan: "MÖ 356-323" }],
  },
  "babil-nudimmud-paraleli": {
    subject: { site: "Enmerkar ve Aratta Beyi", region: "Sümer", modern_country: "Irak" },
    period: { earliest: -2100, latest: -1700, era_label: "Ur III - Eski Babil (nüsha)", precision: "approximate", dating_method: ["paleography", "textual"] },
    languages: ["Sümerce", "İbranice"], disciplines: ["filoloji", "dilbilim"],
    people: [{ name: "Kramer, Samuel Noah", role: "proposer", affiliation: "University of Pennsylvania", year: 1968, lifespan: "1897-1990" }],
    divergence_type: ["eski-ceviri"],
  },
  "babil-asma-bahceler-ninova": {
    subject: { site: "Ninova (önerilen yer)", region: "Yukarı Mezopotamya, Dicle kıyısı", modern_country: "Irak", coordinates: { lat: 36.3599, lon: 43.1526 } },
    period: { earliest: -704, latest: -681, era_label: "Yeni Asur, Sennacherib dönemi", precision: "range", dating_method: ["textual", "epigraphic", "stratigraphy"] },
    languages: ["Akadca", "Grekçe"], disciplines: ["arkeoloji", "filoloji", "tarih"],
    people: [
      { name: "Dalley, Stephanie", role: "proposer", affiliation: "University of Oxford", year: 2013 },
      { name: "Koldewey, Robert", role: "excavator", affiliation: "Deutsche Orient-Gesellschaft", year: 1899, lifespan: "1855-1925" },
    ],
    divergence_type: ["guncellenmemis"],
  },
  "babil-60lik-sistem-bugun": {
    subject: { region: "Mezopotamya", modern_country: "Irak" },
    period: { earliest: -3000, latest: 2026, era_label: "Sümer'den bugüne", precision: "range", dating_method: ["textual"] },
    languages: ["Sümerce", "Akadca"], disciplines: ["matematik", "bilim-tarihi"],
  },
  "babil-yamuk-yontemi": {
    subject: C.babil,
    period: { earliest: -350, latest: -50, era_label: "Geç Babil astronomisi", precision: "range", dating_method: ["textual", "astronomical"] },
    languages: ["Akadca"], disciplines: ["astronomi", "matematik", "bilim-tarihi"],
    people: [{ name: "Ossendrijver, Mathieu", role: "analyst", affiliation: "Humboldt-Universität zu Berlin", year: 2016 }],
    divergence_type: ["guncellenmemis"],
  },
  "babil-herodot-gitti-mi": {
    subject: C.babil,
    period: { earliest: -450, latest: -425, era_label: "Klasik Yunan", precision: "approximate", dating_method: ["historical-record"] },
    languages: ["Grekçe"], disciplines: ["tarih", "filoloji"],
    people: [{ name: "Herodotos", role: "proposer", affiliation: "-", year: -440, lifespan: "MÖ ~484-425" }],
    divergence_type: ["medya-abartisi"],
  },
  "babil-istar-kapisi-berlin": {
    subject: { ...C.babil, site: "İştar Kapısı" },
    period: { earliest: 1899, latest: 2026, era_label: "Modern kazı ve mülkiyet", precision: "range", dating_method: ["historical-record"] },
    disciplines: ["hukuk", "sanat-tarihi", "arkeoloji"],
    people: [{ name: "Koldewey, Robert", role: "excavator", affiliation: "Deutsche Orient-Gesellschaft", year: 1899, lifespan: "1855-1925" }],
  },
  "babil-modern-tahribat": {
    subject: C.babil,
    period: { earliest: 1980, latest: 2019, era_label: "Modern tahribat ve koruma", precision: "range", dating_method: ["historical-record"] },
    disciplines: ["arkeoloji", "hukuk"],
    divergence_type: ["ideolojik-secim"],
  },
};

let touched = 0;
const missing = new Set(Object.keys(E));
const DATA = "data/findings";

for (const f of readdirSync(DATA).filter((x) => x.endsWith(".json"))) {
  const p = join(DATA, f);
  const recs = JSON.parse(readFileSync(p, "utf8"));
  let n = 0;
  for (const r of recs) {
    const add = E[r.id];
    if (!add) continue;
    missing.delete(r.id);
    for (const [k, v] of Object.entries(add)) {
      if (r[k] === undefined || (Array.isArray(r[k]) && r[k].length === 0)) { r[k] = v; n++; }
    }
  }
  if (n) { writeFileSync(p, JSON.stringify(recs, null, 2) + "\n"); console.log(`${f}: ${n} alan dolduruldu`); touched += n; }
}

if (missing.size) console.log(`\nUYARI - eşleşmeyen id: ${[...missing].join(", ")}`);
console.log(`\nToplam ${touched} alan dolduruldu.`);
