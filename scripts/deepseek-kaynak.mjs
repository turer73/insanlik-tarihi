#!/usr/bin/env node
// Kaynak önerisi üretici + DOĞRULAYICI.
//
// NE İŞE YARAR: v1 kayıtlarının çoğunda kaynak yerine yer tutucu cümleler
// var ("Proto-çivi yazısı ve erken Mezopotamya idaresi literatürü" gibi).
// Bu betik her kayıt için bir dil modeline (DeepSeek) aday künyeler
// sordurur, sonra o adayları MAKİNEYLE doğrular.
//
// NEDEN DOĞRULAMA ZORUNLU - bu betiğin bütün varlık sebebi:
// Dil modelinden künye istemenin en olası hatası, var olmayan ama makul
// görünen yazar/yıl/ISBN/DOI üretmesidir. Bu, yer tutucudan DAHA KÖTÜDÜR:
// "…literatürü" yazan bir alan yer tutucu olduğunu belli eder, uydurulmuş
// bir DOI doğrulanmış gibi durur. Bu yüzden modelin çıktısı ÖNERİ'dir,
// kayıt değil. Hiçbir aday, künyesi bağımsız bir kayıttan teyit edilmeden
// "doğrulandı" damgası almaz.
//
// DOĞRULAMA ZİNCİRİ (hepsi bağımsız, model dışı):
//   DOI  -> api.crossref.org/works/<doi>   : var mı + başlık/yazar/yıl eşleşiyor mu
//   ISBN -> openlibrary.org/api/books      : var mı + başlık/yazar eşleşiyor mu
//   URL  -> HTTP durum kodu                : açılıyor mu
// Başlık eşleşmesi kelime örtüşmesiyle ölçülür; eşik altındaysa aday
// REDDEDİLİR - "DOI var ama başka bir makaleye ait" durumu tam da
// yakalanmak istenen şey.
//
// BU BETİK KAYIT YAZMAZ. Çıktısı bir rapordur; kayda geçirme kararı ve
// upgrade betiğini yazmak insana (veya bir sonraki adıma) kalır. Otomatik
// yazma bilerek yapılmadı: doğrulama künyenin VAR olduğunu gösterir,
// kaynağın o iddiayı DESTEKLEDİĞİNİ göstermez. İkincisi okumakla anlaşılır.
//
// GİZLİLİK: DEEPSEEK_API_KEY yalnızca ortam değişkeninden okunur, hiçbir
// yere yazılmaz, hiçbir çıktıda görünmez. Rapor dosyasına da girmez.
//
// Kullanım:
//   node scripts/deepseek-kaynak.mjs --v1 --limit 5
//   node scripts/deepseek-kaynak.mjs sumer-koken-sorunu babil-asma-bahceler
//
// Çıktı: data/kaynak-onerileri.json  (birikimli; her çalıştırmada güncellenir)

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const FINDINGS = join(ROOT, "data", "findings");
const RAPOR = join(ROOT, "data", "kaynak-onerileri.json");

const ANAHTAR = process.env.DEEPSEEK_API_KEY;
const MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";
const ESIK = 0.55; // başlık örtüşme eşiği

if (!ANAHTAR) {
  console.error("DEEPSEEK_API_KEY tanımlı değil. Öneri üretilemez.");
  process.exit(1);
}

/* --- kayıtları oku -------------------------------------------------- */

function tumKayitlar() {
  const hepsi = [];
  for (const dosya of readdirSync(FINDINGS).filter((f) => f.endsWith(".json"))) {
    for (const r of JSON.parse(readFileSync(join(FINDINGS, dosya), "utf8"))) {
      hepsi.push({ dosya, kayit: r });
    }
  }
  return hepsi;
}

// Yer tutucu kaynak: künye alanları yok, başlık "literatür/tartışma/külliyat"
// gibi bir alan tarifi. Kesin bir test değil, işaret.
function yerTutucuMu(s) {
  const kunyesiz = !s.authors?.length && !s.year && !s.doi && !s.isbn;
  const tarifGibi = /literatür|tartışma|külliyat|çalışmaları|yayınları|kaynakları/i.test(s.title ?? "");
  return kunyesiz && tarifGibi;
}

/* --- DeepSeek ------------------------------------------------------- */

const ISTEM = `Sen bir referans kütüphanecisisin. Sana bir tarih/arkeoloji bulgu kaydı veriliyor.
Görevin: bu kaydın iddiasını destekleyecek veya çürütecek, GERÇEKTEN YAYIMLANMIŞ akademik kaynaklar önermek.

KURALLAR:
1. Yalnızca var olduğundan EMİN olduğun eserleri öner. Emin değilsen o alanı boş bırak.
2. ASLA uydurma DOI, ISBN veya URL yazma. Bilmiyorsan null yaz. Uydurulmuş bir tanımlayıcı,
   hiç tanımlayıcı olmamasından çok daha zararlıdır - önerin doğrulamada elenir ve emek boşa gider.
3. Alanın standart, sık atıf alan eserlerini tercih et; belirsiz veya niş olanları değil.
4. Her kaynak için o kaynağın kayıttaki HANGİ satırı desteklediğini/çürüttüğünü yaz.
5. En fazla 3 kaynak öner.

Yanıtı YALNIZCA şu JSON şemasıyla ver, başka hiçbir metin ekleme:
{"kaynaklar":[{"authors":["Soyad, Ad"],"year":2003,"title":"...","container":"dergi veya seri adı ya da null",
"publisher":"yayıncı ya da null","doi":"10.xxxx/yyy ya da null","isbn":"13 haneli ya da null",
"url":"https://... ya da null","tier":"primary|peer-reviewed|institutional","dil":"en|tr|de|fr",
"neden":"kaydın hangi satırını destekliyor/çürütüyor","emin_misin":"yuksek|orta|dusuk"}]}`;

async function deepseekSor(kayit) {
  const ozet = {
    iddia: kayit.claim,
    durum: kayit.status,
    populer_iddia: kayit.popular_claim,
    ayrisma: kayit.divergence,
    kanit: (kayit.evidence ?? []).map((e) => (typeof e === "string" ? e : e.text)),
    karsi_kanit: (kayit.counter_evidence ?? []).map((e) => (typeof e === "string" ? e : e.text)),
    konu: kayit.topic,
    yer: kayit.subject,
    donem: kayit.period,
    mevcut_kaynaklar: (kayit.sources ?? []).map((s) => s.title),
  };

  const y = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${ANAHTAR}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: ISTEM },
        { role: "user", content: JSON.stringify(ozet, null, 1) },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(180000),
  });
  if (!y.ok) throw new Error(`deepseek ${y.status}: ${(await y.text()).slice(0, 160)}`);
  const c = await y.json();
  const metin = c.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(metin).kaynaklar ?? [];
}

/* --- doğrulama ------------------------------------------------------ */

const sadelestir = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

// Önerilen başlık ile kayıttan dönen başlık ne kadar örtüşüyor?
function ortusme(a, b) {
  const A = new Set(sadelestir(a));
  const B = new Set(sadelestir(b));
  if (!A.size || !B.size) return 0;
  let ortak = 0;
  for (const w of A) if (B.has(w)) ortak += 1;
  return ortak / Math.min(A.size, B.size);
}

async function doiDogrula(doi, baslik) {
  try {
    const y = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      headers: { "user-agent": "KanitAtlasi/1.0 (kaynak dogrulama)" },
      signal: AbortSignal.timeout(30000),
    });
    if (!y.ok) return { ok: false, sebep: `crossref ${y.status}` };
    const m = (await y.json()).message;
    const bulunan = Array.isArray(m.title) ? m.title[0] : m.title;
    const skor = ortusme(baslik, bulunan);
    return {
      ok: skor >= ESIK,
      skor: Number(skor.toFixed(2)),
      bulunan_baslik: bulunan,
      bulunan_yil: m.issued?.["date-parts"]?.[0]?.[0],
      bulunan_kapsayici: Array.isArray(m["container-title"]) ? m["container-title"][0] : undefined,
      sebep: skor >= ESIK ? "crossref künyesi eşleşti" : `DOI VAR AMA BAŞKA ESERE AİT (örtüşme ${skor.toFixed(2)})`,
    };
  } catch (h) {
    return { ok: false, sebep: `crossref erişilemedi: ${String(h.message).slice(0, 60)}` };
  }
}

const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

// Ağ hatası ile "kayıt yok" AYRI ŞEYLERDİR. İlk sürümde ikisi de
// REDDEDİLDİ'ye düşüyordu ve rapor "model uydurdu" diyordu - oysa gerçekte
// benim isteğim düşmüştü. Bu ayrım yapılmazsa doğrulayıcı, kendi
// arızasını modelin hatası gibi gösterir.
// Katalog servisleri hızlı ardışık isteklerde 429 veriyor (özellikle Google
// Books). Tek bir küresel sıra tutmak, paralellikten daha önemli: burada
// hız değil, doğrulanabilirlik aranıyor.
let sonIstek = 0;
const KATALOG_ARALIK = Number(process.env.KATALOG_ARALIK ?? 2500);
async function sirala(minAralik = KATALOG_ARALIK) {
  const gecen = Date.now() - sonIstek;
  if (gecen < minAralik) await bekle(minAralik - gecen);
  sonIstek = Date.now();
}

async function jsonAl(url, deneme = 3) {
  let sonHata;
  for (let i = 0; i < deneme; i += 1) {
    await sirala();
    try {
      const y = await fetch(url, {
        headers: { "user-agent": "KanitAtlasi/1.0 (kaynak dogrulama)", accept: "application/json" },
        signal: AbortSignal.timeout(30000),
      });
      // 429'da agresif geri çekil - servis bizi zaten yavaşlatmak istiyor.
      if (y.status === 429) { sonHata = "HTTP 429"; await bekle(5000 * (i + 1)); continue; }
      if (y.status >= 500) { sonHata = `HTTP ${y.status}`; await bekle(2000 * (i + 1)); continue; }
      if (y.status === 404) return { yok: true };
      if (!y.ok) return { hata: `HTTP ${y.status}` };
      return { veri: await y.json() };
    } catch (h) {
      sonHata = String(h.message).slice(0, 60);
      await bekle(1500 * (i + 1));
    }
  }
  return { erisilemedi: sonHata };
}

async function isbnDogrula(isbn, baslik) {
  const temiz = String(isbn).replace(/[^0-9Xx]/g, "");

  // 1) Open Library
  const ol = await jsonAl(`https://openlibrary.org/api/books?bibkeys=ISBN:${temiz}&format=json&jscmd=data`);
  if (ol.veri) {
    const k = ol.veri[`ISBN:${temiz}`];
    if (k) {
      const skor = ortusme(baslik, k.title);
      return {
        ok: skor >= ESIK,
        skor: Number(skor.toFixed(2)),
        kaynak: "openlibrary",
        bulunan_baslik: k.title,
        bulunan_yazar: (k.authors ?? []).map((a) => a.name).join(", "),
        bulunan_yayinci: (k.publishers ?? []).map((p) => p.name).join(", "),
        sebep: skor >= ESIK ? "openlibrary künyesi eşleşti" : `ISBN VAR AMA BAŞKA KİTABA AİT (örtüşme ${skor.toFixed(2)})`,
      };
    }
  }

  // 1b) Open Library'nin ikinci yolu. /api/books kapsam boşluğu olan bir
  // görünüm; /isbn/<isbn>.json ham kayda bakar ve sık sık onu buluyor.
  const ol2 = await jsonAl(`https://openlibrary.org/isbn/${temiz}.json`);
  if (ol2.veri?.title) {
    const skor = ortusme(baslik, ol2.veri.title);
    return {
      ok: skor >= ESIK,
      skor: Number(skor.toFixed(2)),
      kaynak: "openlibrary/isbn",
      bulunan_baslik: ol2.veri.title,
      bulunan_yayinci: (ol2.veri.publishers ?? []).join(", "),
      sebep: skor >= ESIK ? "openlibrary kaydı eşleşti" : `ISBN VAR AMA BAŞKA KİTABA AİT (örtüşme ${skor.toFixed(2)})`,
    };
  }

  // 2) İki Open Library yolu da vermedi - Google Books'a sor.
  // Tek servise bağlı kalmak, o servisin kapsam boşluğunu "kitap yok"
  // sanmak demekti; iki bağımsız katalog bunu ayırıyor.
  const gb = await jsonAl(`https://www.googleapis.com/books/v1/volumes?q=isbn:${temiz}`);
  if (gb.veri) {
    const it = gb.veri.items?.[0]?.volumeInfo;
    if (it) {
      const skor = ortusme(baslik, it.title);
      return {
        ok: skor >= ESIK,
        skor: Number(skor.toFixed(2)),
        kaynak: "googlebooks",
        bulunan_baslik: it.title,
        bulunan_yazar: (it.authors ?? []).join(", "),
        bulunan_yayinci: it.publisher,
        sebep: skor >= ESIK ? "googlebooks künyesi eşleşti" : `ISBN VAR AMA BAŞKA KİTABA AİT (örtüşme ${skor.toFixed(2)})`,
      };
    }
    // Üç yol da tanımıyor: burası gerçek bir ret.
    if (ol.veri || ol2.yok) return { ok: false, kesin: true, sebep: "ISBN üç katalog yolunda da YOK (Open Library x2 + Google Books)" };
  }

  const nerede = ol.erisilemedi ? `openlibrary: ${ol.erisilemedi}` : ol.hata ? `openlibrary: ${ol.hata}` : "";
  const nerede2 = gb.erisilemedi ? `googlebooks: ${gb.erisilemedi}` : gb.hata ? `googlebooks: ${gb.hata}` : "";
  return { ok: false, erisilemedi: true, sebep: `DOĞRULANAMADI - katalog erişilemedi (${[nerede, nerede2].filter(Boolean).join("; ")})` };
}

async function urlDogrula(url) {
  try {
    const y = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(25000) });
    // 403 = bot engeli; adres var demektir, "ölü" değil.
    return { ok: y.status < 400 || y.status === 403, kod: y.status, sebep: y.status === 403 ? "bot engeli (adres var)" : `HTTP ${y.status}` };
  } catch (h) {
    return { ok: false, sebep: `açılmadı: ${String(h.message).slice(0, 60)}` };
  }
}

async function adayiDogrula(a) {
  const kontroller = {};
  if (a.doi) kontroller.doi = await doiDogrula(a.doi, a.title);
  if (a.isbn) kontroller.isbn = await isbnDogrula(a.isbn, a.title);
  if (a.url) kontroller.url = await urlDogrula(a.url);

  const tanimlayici = Boolean(a.doi || a.isbn || a.url);
  const gecti = Object.values(kontroller).some((k) => k.ok);
  const dusen = Object.values(kontroller).filter((k) => !k.ok);
  // "Kataloğa ulaşamadım" ile "katalog tanımıyor" ayrı sonuçlar.
  const kesinRet = dusen.some((k) => k.kesin || /BAŞKA (ESERE|KİTABA) AİT/.test(k.sebep ?? ""));
  const erisimSorunu = dusen.some((k) => k.erisilemedi);

  let karar;
  if (!tanimlayici) karar = "TANIMLAYICI YOK - elle aranmalı";
  else if (gecti && dusen.length === 0) karar = "DOĞRULANDI";
  else if (gecti) karar = "KISMEN - bir tanımlayıcı doğrulandı, biri düştü";
  else if (kesinRet) karar = "REDDEDİLDİ - tanımlayıcı yok ya da başka esere ait";
  else if (erisimSorunu) karar = "DOĞRULANAMADI - katalog erişilemedi, MODELİN HATASI DEĞİL";
  else karar = "REDDEDİLDİ - tanımlayıcı yok ya da başka esere ait";

  return { ...a, kontroller, karar };
}

/* --- akış ----------------------------------------------------------- */

const argv = process.argv.slice(2);
const limitIx = argv.indexOf("--limit");
const LIMIT = limitIx === -1 ? Infinity : Number(argv[limitIx + 1]);
const idler = argv.filter((a) => !a.startsWith("--") && a !== String(LIMIT));

const hepsi = tumKayitlar();
let hedefler;
if (argv.includes("--v1")) {
  hedefler = hepsi.filter(({ kayit }) => (kayit.schema_version ?? 1) === 1);
} else if (idler.length) {
  hedefler = hepsi.filter(({ kayit }) => idler.includes(kayit.id));
} else {
  console.error("Kullanım: --v1 [--limit N]  ya da  <kayit-id> [<kayit-id>...]");
  process.exit(1);
}

// Yer tutucu kaynaklı olanlar önce - en çok kazandıran onlar.
hedefler.sort((a, b) => {
  const ya = (a.kayit.sources ?? []).filter(yerTutucuMu).length;
  const yb = (b.kayit.sources ?? []).filter(yerTutucuMu).length;
  return yb - ya;
});
hedefler = hedefler.slice(0, LIMIT);

let birikim = {};
try { birikim = JSON.parse(readFileSync(RAPOR, "utf8")); } catch { /* ilk çalıştırma */ }

console.log(`${hedefler.length} kayıt için öneri istenecek (model: ${MODEL})\n`);

const sayac = { dogrulandi: 0, kismen: 0, reddedildi: 0, dogrulanamadi: 0, tanimlayicisiz: 0, hata: 0 };

for (const [i, { dosya, kayit }] of hedefler.entries()) {
  const yt = (kayit.sources ?? []).filter(yerTutucuMu).length;
  process.stdout.write(`[${i + 1}/${hedefler.length}] ${kayit.id}${yt ? ` (${yt} yer tutucu)` : ""} ... `);
  try {
    const adaylar = await deepseekSor(kayit);
    const dogrulanmis = [];
    for (const a of adaylar) dogrulanmis.push(await adayiDogrula(a));

    birikim[kayit.id] = {
      dosya,
      iddia: kayit.claim,
      yer_tutucu_kaynak: yt,
      sorgulandi: new Date().toISOString(),
      model: MODEL,
      adaylar: dogrulanmis,
    };

    for (const d of dogrulanmis) {
      if (d.karar === "DOĞRULANDI") sayac.dogrulandi += 1;
      else if (d.karar.startsWith("KISMEN")) sayac.kismen += 1;
      else if (d.karar.startsWith("REDDEDİLDİ")) sayac.reddedildi += 1;
      else if (d.karar.startsWith("DOĞRULANAMADI")) sayac.dogrulanamadi += 1;
      else sayac.tanimlayicisiz += 1;
    }
    const ozet = dogrulanmis.map((d) => d.karar.split(" ")[0]).join(",") || "öneri yok";
    console.log(ozet);
  } catch (hata) {
    sayac.hata += 1;
    birikim[kayit.id] = { dosya, hata: String(hata.message).slice(0, 200), sorgulandi: new Date().toISOString() };
    console.log(`HATA: ${String(hata.message).slice(0, 80)}`);
  }
  writeFileSync(RAPOR, `${JSON.stringify(birikim, null, 2)}\n`, "utf8");
}

console.log(`\n--- aday künye sonuçları ---`);
console.log(`  DOĞRULANDI     ${sayac.dogrulandi}`);
console.log(`  kısmen         ${sayac.kismen}`);
console.log(`  REDDEDİLDİ     ${sayac.reddedildi}   <- tanımlayıcı yok ya da başka esere ait: MODELİN hatası`);
console.log(`  doğrulanamadı  ${sayac.dogrulanamadi}   <- katalog erişilemedi: BENİM tarafın sorunu, model suçlu değil`);
console.log(`  tanımlayıcısız ${sayac.tanimlayicisiz}`);
console.log(`  istek hatası   ${sayac.hata}`);
console.log(`\n${RAPOR} güncellendi. HİÇBİR KAYIT DEĞİŞTİRİLMEDİ - bu bir öneri raporudur.`);
