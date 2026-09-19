// İçerik özeti çıkarılacak girdileri toplar.
//
// TEK KAYNAK OLMASI ŞART: hem tohumlama betiği hem build-site aynı listeyi
// kullanmalı. İkisi ayrışırsa tohum bir anahtar kümesi, üretim başka bir
// küme özetler ve tarihler sessizce sıfırlanır.
//
// ANAHTAR = lastmod'da kullanılan yol. İçerik ise o URL'nin metnini
// BELİRLEYEN şeylerin birleşimidir - dosyanın kendisi değil.
//
// YAZILAR NEDEN KENDİ GİRDİLERİNİ ALIYOR: eskiden yazı tarihi `enYeni` ile
// data/reading-pilot.json ve data/arama-sorulari.json dosyalarının TAMAMINA
// bağlıydı. Tek bir yazı eklemek o dosyalara bir anahtar ekliyor ve OTUZ
// yazının tarihini birden oynatıyordu. Burada her yazı yalnız KENDİ
// girdilerine bağlanıyor.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { kaynaklariTopla } from "./kaynakca.mjs";

const oku = async (p) => {
  try { return await readFile(p, "utf8"); } catch { return ""; }
};
const okuJson = async (p) => {
  try { return JSON.parse(await readFile(p, "utf8")); } catch { return {}; }
};

/**
 * @param root    depo kökü
 * @param ctx     { articles, hubs }  — statik sayfalar pages/ dizininden okunur
 * @returns { anahtar: metin }
 */
export async function icerikGirdileri(root, { articles, hubs }) {
  const girdiler = {};
  const pilot = await okuJson(path.join(root, "data", "reading-pilot.json"));
  const sorular = await okuJson(path.join(root, "data", "arama-sorulari.json"));
  const tartisma = await okuJson(path.join(root, "data", "tartisma-pilotu.json"));
  const bulten = await okuJson(path.join(root, "data", "bulten.json"));
  const merkezler = await okuJson(path.join(root, "data", "konu-merkezleri.json"));
  const bulgular = await okuJson(path.join(root, "data", "findings.bundle.json"));

  // --- yazılar: parça metni + YALNIZ kendi yardımcı girdileri
  //
  // BULGULAR DA BURADA OLMAK ZORUNDA: kanıt dosyası yazı sayfasına bu
  // kayıtlardan üretiliyor - iddia, kanıt, karşı kanıt ve kaynak notları
  // okurun gördüğü metnin parçası. İlk sürümde atlanmıştı ve sonuç SESSİZ
  // bir hataydı: bir kaynağın notu düzeltilince sayfa değişiyor ama lastmod
  // eski tarihte kalıyordu. Bu, düzeltilen hatanın TERSİ - o, tarihleri
  // yersiz oynatıyordu; bu, hiç oynatmıyor. İkisi de sinyali bozar.
  //
  // Yalıtım korunuyor: her yazı YALNIZ kendi used_in kayıtlarına bağlı.
  const bulguKumesi = new Map();
  for (const kayit of Array.isArray(bulgular) ? bulgular : []) {
    for (const slug of kayit.used_in ?? []) {
      if (!bulguKumesi.has(slug)) bulguKumesi.set(slug, []);
      bulguKumesi.get(slug).push(kayit);
    }
  }

  for (const a of articles) {
    const anahtar = `articles/${a.slug}.html`;
    const parca = await oku(path.join(root, "articles", `${a.slug}.html`));
    girdiler[anahtar] = [
      parca,
      a.title, a.summary, a.category, (a.tags || []).join(","),
      JSON.stringify(pilot[a.slug] ?? null),
      JSON.stringify(sorular[a.slug] ?? null),
      JSON.stringify(tartisma[a.slug] ?? null),
      JSON.stringify(bulguKumesi.get(a.slug) ?? null),
    ].join("\n");
  }

  // --- statik sayfalar: dizinin kendisi tek kaynak, liste elle tutulmaz
  let sayfaDosyalari = [];
  try { sayfaDosyalari = (await readdir(path.join(root, "pages"))).filter((f) => f.endsWith(".html")).sort(); } catch { /* yok */ }
  for (const f of sayfaDosyalari) {
    girdiler[`pages/${f}`] = await oku(path.join(root, "pages", f));
  }

  // --- ana sayfa: kendi metni + bülten yapılandırması
  girdiler["index.html"] = [
    await oku(path.join(root, "index.html")),
    JSON.stringify(bulten ?? null),
  ].join("\n");

  // --- konu merkezleri: her merkez KENDİ girdisine bağlı
  girdiler["data/konu-merkezleri.json"] = JSON.stringify(merkezler);
  for (const h of hubs) {
    girdiler[`konular/${h.slug}.html`] = JSON.stringify(merkezler[h.slug] ?? null);
  }

  // --- kaynakça: sayfanın metnini künyeler, notlar ve yazı bağları belirler.
  // Sayfa üretilmeden ÖNCE hesaplanabilsin diye doğrudan kayıtlardan çıkarılıyor;
  // bir kaynağın katmanı, başlığı, notu ya da geçtiği yazı değişmedikçe tarih oynamaz.
  girdiler["kaynakca.html"] = JSON.stringify(
    kaynaklariTopla(Array.isArray(bulgular) ? bulgular : [], articles)
      // TANIMLAYICI DA ANAHTARDA: sayfanın her girdisinde DOI/ISBN/URL görünüyor.
      // İlk sürümde yoktu ve bir DOI düzeltmesi sayfayı değiştirdiği hâlde
      // tarihi oynatmadı - bugün yazı anahtarında düzeltilen kusurun aynısı.
      .map((k) => [k.id, k.katman, k.kunye.title ?? "", k.kunye.year ?? "",
        k.kunye.doi ?? "", k.kunye.isbn ?? "", k.kunye.url ?? "",
        (k.kunye.authors ?? []).join(","), k.notlar.join(" | "),
        k.yazilar.map((y) => y.slug).join(",")])
      .sort((a, b) => a[0].localeCompare(b[0])),
  );

  // --- üretilen araç sayfaları: sunucudaki metin + GÖSTERDİKLERİ VERİ
  //
  // Yalnız HTML metni yetmez. Bu üç sayfanın asıl içeriği <script> bloğundaki
  // veri yükü ve metinOzu script bloklarını bilerek atıyor - tasarım değişimi
  // içerik değişimi sayılmasın diye konmuş, doğru bir kural. Ama burada veri
  // script'in İÇİNDE; kural olduğu gibi uygulanırsa bulgu kayıtları değişse
  // bile bu sayfaların tarihi hiç oynamaz.
  //
  // Bu yüzden anahtar iki parçadan kuruluyor: sunucuda görünen metin ve
  // sayfanın gösterdiği kayıtların kendisi.
  const araçVerisi = JSON.stringify(bulgular ?? null);
  for (const d of ["zaman-cizelgesi", "bulgu-veri-tabani", "kanit-denetimi"]) {
    girdiler[`dist/${d}.html`] = [
      await oku(path.join(root, "dist", `${d}.html`)),
      araçVerisi,
    ].join("\n");
  }

  return girdiler;
}
