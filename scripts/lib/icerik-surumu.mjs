// lastmod'u DOSYA DOKUNUŞUNDAN değil İÇERİK DEĞİŞİMİNDEN üretir.
//
// SORUN — ölçüldü, varsayılmadı. 2026-09-12'de bütün yazı dosyalarındaki
// `<style>` bloğunda satır yüksekliği düzeltildi. Tek bir cümle değişmedi.
// Ama lastmod git geçmişinden okunduğu için sitemap 42 kaydın 39'u için
// "bugün değişti" demeye başladı; önceki gün beş ayrı tarihe yayılmıştı
// (27/44/9/19/3). Google lastmod'u güvenilmez bulursa alanı dikkate almayı
// bırakır - yani alan, doğru kullanılmadığında sinyal vermek yerine sinyali
// yok eder.
//
// İKİNCİ YÜKSELTİCİ: yazı tarihi `enYeni` ile data/reading-pilot.json ve
// data/arama-sorulari.json gibi ORTAK dosyalara bağlıydı. Tek bir yazı
// eklemek o dosyalara bir anahtar ekliyor ve OTUZ yazının tarihini birden
// oynatıyordu. Bu modül her yazıyı yalnız KENDİ girdisine bağlar.
//
// YÖNTEM: her sayfa için "anlamlı metin" çıkarılır (style, script ve
// etiketler atılır), özeti alınır ve data/icerik-surumu.json'da saklanır.
// Özet aynıysa tarih KORUNUR; değiştiyse yenilenir.
//
// ORTAM BAĞIMSIZ: git geçmişine ihtiyaç duymaz. Kaynak dosyalar Vercel'de de
// GitHub Actions'ta da mevcut olduğu için özet her yerde aynı hesaplanır.
// Git tarihleri yalnız TOHUMLAMA için kullanılır - anlık görüntüde karşılığı
// olmayan bir anahtarın ilk tarihini vermek için.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const GUNLUK = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Bir HTML parçasından anlamlı metni çıkarır.
 *
 * `<style>` ve `<script>` blokları ATILIR - tasarım ve davranış değişikliği
 * içerik değişikliği değildir. Bu modülün varlık sebebi tam olarak budur.
 */
export function metinOzu(html) {
  return String(html ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Kısa, kararlı özet. Uzunluk 16 hex: çakışma olasılığı bu ölçekte yok sayılır. */
export function hashla(metin) {
  return createHash("sha256").update(String(metin ?? ""), "utf8").digest("hex").slice(0, 16);
}

function anlikOku(root) {
  try {
    const ham = JSON.parse(readFileSync(join(root, "data", "icerik-surumu.json"), "utf8"));
    return ham.kayitlar ?? {};
  } catch {
    return {};
  }
}

/**
 * İçerik özetine dayalı tarih haritası.
 *
 * @param root     depo kökü
 * @param bugun    YYYY-MM-DD
 * @param girdiler { anahtar: metin } - anahtar, lastmod'da kullanılan yol
 * @param tohum    { lastmod, published } - git'ten gelen, yalnız yeni anahtarlar için
 * @returns { lastmod, published, degisen, kaynak }
 */
export function icerikTarihleri(root, bugun, girdiler, tohum = { lastmod: {}, published: {} }) {
  if (!GUNLUK.test(bugun)) throw new Error(`icerikTarihleri: geçersiz gün '${bugun}'`);
  const anlik = anlikOku(root);
  const yeni = {};
  const lastmod = {};
  const published = {};
  const degisen = [];

  for (const [anahtar, metin] of Object.entries(girdiler)) {
    const ozet = hashla(metinOzu(metin));
    const kayit = anlik[anahtar];

    if (kayit && kayit.ozet === ozet && GUNLUK.test(kayit.lastmod ?? "")) {
      // İçerik aynı: tarih KORUNUR. Dosyaya dokunulmuş olması önemsiz.
      lastmod[anahtar] = kayit.lastmod;
      published[anahtar] = kayit.published ?? kayit.lastmod;
    } else {
      // İçerik değişti (ya da ilk kez görülüyor).
      const gitTarih = tohum.lastmod?.[anahtar];
      lastmod[anahtar] = kayit ? bugun : (GUNLUK.test(gitTarih ?? "") ? gitTarih : bugun);
      published[anahtar] = kayit?.published
        ?? (GUNLUK.test(tohum.published?.[anahtar] ?? "") ? tohum.published[anahtar] : lastmod[anahtar]);
      if (kayit) degisen.push(anahtar);
    }
    yeni[anahtar] = { ozet, lastmod: lastmod[anahtar], published: published[anahtar] };
  }

  // Anlık görüntü yalnız içeriği değiştiğinde yazılır; aksi halde her derleme
  // dosyanın zaman damgasını oynatır ve gereksiz fark üretir.
  const sirali = Object.fromEntries(Object.keys(yeni).sort().map((k) => [k, yeni[k]]));
  const govde = `${JSON.stringify({
    not: "İçerik özetine dayalı tarih kaydı. Özet aynıysa tarih korunur; " +
         "yalnız METİN değiştiğinde yenilenir. style/script blokları özete girmez.",
    kayitlar: sirali,
  }, null, 2)}\n`;
  const yol = join(root, "data", "icerik-surumu.json");
  let eski = null;
  try { eski = readFileSync(yol, "utf8"); } catch { /* ilk üretim */ }
  if (eski !== govde) writeFileSync(yol, govde, "utf8");

  return { lastmod, published, degisen, bugun, kaynak: "icerik-ozeti" };
}

/**
 * Anlık görüntüyü olduğu gibi okur - yeniden hesaplamadan.
 *
 * build-site tarihleri üretir ve anlık görüntüyü tazeler; audit-urls gibi
 * TÜKETİCİLER aynı kaynağı okumalı. Aksi halde denetim tablosu sitemap ile
 * çelişir - nitekim çelişiyordu: sitemap içerik tarihlerini, denetim tablosu
 * git tarihlerini yazıyordu.
 */
export function anlikTarihler(root, bugun) {
  let kayitlar = {};
  try {
    kayitlar = JSON.parse(readFileSync(join(root, "data", "icerik-surumu.json"), "utf8")).kayitlar ?? {};
  } catch { /* henüz kurulmadı */ }
  const lastmod = {};
  const published = {};
  for (const [k, v] of Object.entries(kayitlar)) {
    if (GUNLUK.test(v?.lastmod ?? "")) lastmod[k] = v.lastmod;
    if (GUNLUK.test(v?.published ?? "")) published[k] = v.published;
  }
  return { lastmod, published, bugun, kaynak: "anlik-goruntu" };
}

/** Bir anahtarın son değişiklik tarihi; bilinmiyorsa bugün. */
export function sonDegisiklik(t, anahtar) {
  return t.lastmod[anahtar] ?? t.bugun;
}

/** Bir anahtarın ilk yayın tarihi; bilinmiyorsa son değişiklik. */
export function ilkYayin(t, anahtar) {
  return t.published[anahtar] ?? sonDegisiklik(t, anahtar);
}

/** Verilen anahtarların en yenisi. */
export function enYeni(t, anahtarlar) {
  let en = null;
  for (const a of anahtarlar) {
    const d = t.lastmod[a];
    if (d && (!en || d > en)) en = d;
  }
  return en ?? t.bugun;
}
