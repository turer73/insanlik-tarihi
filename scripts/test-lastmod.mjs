#!/usr/bin/env node
// lastmod ayrıştırıcısının testleri.
//
// Hepsi "yanlış tarihi YAKALIYOR mu" sorusunu sorar, "çalışıyor mu" değil.
// Buradaki asıl risk sessiz yanlışlık: sitemap yine üretilir, XML yine
// geçerlidir, sadece tarihler yalan söyler. Onu ancak test yakalar.

import assert from "node:assert/strict";
import {
  ayristir,
  calismaAgaciniUygula,
  gercekDegisiklikDurumu,
  sonDegisiklik,
  ilkYayin,
  enYeni,
} from "./lib/lastmod.mjs";

let sayac = 0;
function test(ad, fn) {
  sayac += 1;
  try {
    fn();
  } catch (hata) {
    console.error(`  x ${ad}\n    ${hata.message}`);
    process.exitCode = 1;
  }
}

/* --- ayristir: git log yeniden eskiye sıralıdır ---------------------- */

// git log --format=%cs --name-only çıktısının gerçek biçimi: tarih satırı,
// boş satır, dosya adları, boş satır, sonraki commit.
const LOG = [
  "2026-09-07",
  "",
  "articles/mit-ve-sicil.html",
  "data/articles.json",
  "",
  "2026-09-06",
  "",
  "articles/mit-ve-sicil.html",
  "articles/babil.html",
  "",
  "2026-08-30",
  "",
  "articles/babil.html",
  "",
].join("\n");

test("son değişiklik EN YENİ commit'ten gelir", () => {
  const { lastmod } = ayristir(LOG);
  assert.equal(lastmod["articles/mit-ve-sicil.html"], "2026-09-07");
  assert.equal(lastmod["articles/babil.html"], "2026-09-06");
});

test("ilk yayın EN ESKİ commit'ten gelir - lastmod ile karışmaz", () => {
  const { published } = ayristir(LOG);
  assert.equal(published["articles/mit-ve-sicil.html"], "2026-09-06");
  assert.equal(published["articles/babil.html"], "2026-08-30");
});

test("tek commit'te ikisi de aynıdır", () => {
  const { lastmod, published } = ayristir(LOG);
  assert.equal(lastmod["data/articles.json"], "2026-09-07");
  assert.equal(published["data/articles.json"], "2026-09-07");
});

test("tarih satırı görülmeden gelen dosya adı yok sayılır", () => {
  const { lastmod } = ayristir("articles/oksuz.html\n2026-09-07\n\narticles/x.html\n");
  assert.equal(lastmod["articles/oksuz.html"], undefined, "tarihsiz satır kayda geçmemeli");
  assert.equal(lastmod["articles/x.html"], "2026-09-07");
});

test("boş çıktı boş harita verir - çökmez", () => {
  const { lastmod, published } = ayristir("");
  assert.deepEqual(lastmod, {});
  assert.deepEqual(published, {});
});

/* --- çalışma ağacı: işlenmemiş değişiklik bugündür ------------------- */

test("değişmiş dosya bugüne çekilir", () => {
  const h = calismaAgaciniUygula(ayristir(LOG), " M articles/babil.html\n", "2026-09-08");
  assert.equal(h.lastmod["articles/babil.html"], "2026-09-08", "commit tarihi ezilmeliydi");
  assert.equal(h.published["articles/babil.html"], "2026-08-30", "ilk yayın DEĞİŞMEMELİ");
});

test("yeni (izlenmeyen) dosya hem lastmod hem published alır", () => {
  const h = calismaAgaciniUygula(ayristir(LOG), "?? articles/yeni.html\n", "2026-09-08");
  assert.equal(h.lastmod["articles/yeni.html"], "2026-09-08");
  assert.equal(h.published["articles/yeni.html"], "2026-09-08");
});

test("yeniden adlandırmada HEDEF yol alınır", () => {
  const h = calismaAgaciniUygula(ayristir(LOG), "R  articles/eski.html -> articles/yeni-ad.html\n", "2026-09-08");
  assert.equal(h.lastmod["articles/yeni-ad.html"], "2026-09-08");
  assert.equal(h.lastmod["articles/eski.html"], undefined);
});

test("tırnaklı yol (Türkçe karakter) tırnaksız kaydedilir", () => {
  const h = calismaAgaciniUygula(ayristir(""), '?? "articles/kapadokya.html"\n', "2026-09-08");
  assert.equal(h.lastmod["articles/kapadokya.html"], "2026-09-08");
});

test("temiz ağaç hiçbir tarihi değiştirmez", () => {
  const h = calismaAgaciniUygula(ayristir(LOG), "", "2026-09-08");
  assert.equal(h.lastmod["articles/babil.html"], "2026-09-06");
});

test("gerçek diff ve izlenmeyen yollar birleştirilir; status gürültüsü taşınmaz", () => {
  const durum = gercekDegisiklikDurumu(
    "data/konu-merkezleri.json\n",
    "articles/yeni.html\ndata/konu-merkezleri.json\n",
  );
  const h = calismaAgaciniUygula(ayristir(LOG), durum, "2026-09-08");
  assert.equal(h.lastmod["data/konu-merkezleri.json"], "2026-09-08");
  assert.equal(h.lastmod["articles/yeni.html"], "2026-09-08");
  assert.equal(h.lastmod["dist/zaman-cizelgesi.html"], undefined);
});

/* --- arama yardımcıları: bilinmeyen yol sessizce yanlış olmasın ------ */

const T = { ...ayristir(LOG), bugun: "2026-09-08" };

test("bilinen yol anlık görüntüden okunur, bugüne düşmez", () => {
  assert.equal(sonDegisiklik(T, "articles/babil.html"), "2026-09-06");
});

test("bilinmeyen yol bugüne düşer", () => {
  assert.equal(sonDegisiklik(T, "articles/hic-yok.html"), "2026-09-08");
});

test("published yoksa lastmod'a düşülür, bugüne değil", () => {
  const kismi = { lastmod: { "a.html": "2026-01-01" }, published: {}, bugun: "2026-09-08" };
  assert.equal(ilkYayin(kismi, "a.html"), "2026-01-01");
});

test("enYeni en büyük tarihi seçer", () => {
  assert.equal(
    enYeni(T, ["articles/babil.html", "articles/mit-ve-sicil.html", "yok.html"]),
    "2026-09-07",
  );
});

test("enYeni hiçbiri bilinmiyorsa bugüne düşer", () => {
  assert.equal(enYeni(T, ["yok-1.html", "yok-2.html"]), "2026-09-08");
});

/* --- gerileme koruması: eski hata geri gelmesin ---------------------- */

test("REGRESYON: tarihler derleme gününe eşitlenmemeli", () => {
  const h = ayristir(LOG);
  const hepsi = new Set(Object.values(h.lastmod));
  assert.ok(
    hepsi.size > 1,
    "bütün yollar aynı tarihi aldı - lastmod yine sabit değere bağlanmış olabilir",
  );
});

if (!process.exitCode) console.log(`lastmod testi: tamam (${sayac} test)`);
