#!/usr/bin/env node
// Her test tek bir soru soruyor: bu modül YAKALIYOR mu?
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { metinOzu, hashla, icerikTarihleri, sonDegisiklik, ilkYayin, enYeni } from "./lib/icerik-surumu.mjs";

let sayac = 0;
const t = (ad, fn) => { fn(); sayac += 1; };

function gecici() {
  const d = mkdtempSync(join(tmpdir(), "icerik-"));
  mkdirSync(join(d, "data"), { recursive: true });
  return d;
}

/* --- metinOzu: tasarım değişikliği içerik değişikliği değildir --- */

t("style bloğu özete girmez", () => {
  const a = '<style>h1{line-height:.94}</style><h1>Başlık</h1><p>Metin</p>';
  const b = '<style>h1{line-height:1.15}</style><h1>Başlık</h1><p>Metin</p>';
  assert.equal(metinOzu(a), metinOzu(b), "satır yüksekliği değişimi metni değiştirmemeli");
  assert.equal(hashla(metinOzu(a)), hashla(metinOzu(b)));
});

t("script bloğu özete girmez", () => {
  const a = '<p>Metin</p><script>console.log(1)</script>';
  const b = '<p>Metin</p><script>console.log(2)</script>';
  assert.equal(hashla(metinOzu(a)), hashla(metinOzu(b)));
});

t("gerçek metin değişimi özeti DEĞİŞTİRİR", () => {
  const a = '<style>x{}</style><p>On dört</p>';
  const b = '<style>x{}</style><p>On beş</p>';
  assert.notEqual(hashla(metinOzu(a)), hashla(metinOzu(b)), "metin değiştiyse özet de değişmeli");
});

t("etiket değişimi tek başına özeti değiştirmez", () => {
  assert.equal(metinOzu("<h3>Kanıt</h3>"), metinOzu("<h4>Kanıt</h4>"));
});

t("boşluk normalize edilir", () => {
  assert.equal(metinOzu("<p>a\n\n   b</p>"), "a b");
});

/* --- tarih koruma --- */

t("içerik aynıysa tarih KORUNUR, dosyaya dokunulsa bile", () => {
  const d = gecici();
  const bir = icerikTarihleri(d, "2026-09-08", { "articles/x.html": "<p>Metin</p>" });
  assert.equal(bir.lastmod["articles/x.html"], "2026-09-08");
  // aynı metin, farklı gün, üstelik style eklenmiş
  const iki = icerikTarihleri(d, "2026-09-12", { "articles/x.html": "<style>p{color:red}</style><p>Metin</p>" });
  assert.equal(iki.lastmod["articles/x.html"], "2026-09-08", "içerik değişmediyse tarih oynamamalı");
  assert.deepEqual(iki.degisen, []);
});

t("içerik değiştiyse tarih YENİLENİR", () => {
  const d = gecici();
  icerikTarihleri(d, "2026-09-08", { "articles/x.html": "<p>Eski</p>" });
  const iki = icerikTarihleri(d, "2026-09-12", { "articles/x.html": "<p>Yeni</p>" });
  assert.equal(iki.lastmod["articles/x.html"], "2026-09-12");
  assert.deepEqual(iki.degisen, ["articles/x.html"]);
});

t("ilk yayın tarihi içerik değişince KORUNUR", () => {
  const d = gecici();
  icerikTarihleri(d, "2026-09-07", { "a.html": "<p>ilk</p>" });
  const iki = icerikTarihleri(d, "2026-09-12", { "a.html": "<p>güncellendi</p>" });
  assert.equal(iki.published["a.html"], "2026-09-07", "yayın tarihi güncellemeyle değişmemeli");
  assert.equal(iki.lastmod["a.html"], "2026-09-12");
});

t("yeni anahtar tohumdan tarih alır", () => {
  const d = gecici();
  const r = icerikTarihleri(d, "2026-09-12", { "a.html": "<p>x</p>" },
    { lastmod: { "a.html": "2026-09-08" }, published: { "a.html": "2026-09-07" } });
  assert.equal(r.lastmod["a.html"], "2026-09-08", "tohum varsa bugün yazılmamalı");
  assert.equal(r.published["a.html"], "2026-09-07");
});

t("tohum yoksa ve kayıt yoksa bugün kullanılır", () => {
  const d = gecici();
  const r = icerikTarihleri(d, "2026-09-12", { "a.html": "<p>x</p>" });
  assert.equal(r.lastmod["a.html"], "2026-09-12");
});

/* --- yalıtım: bir sayfanın değişmesi diğerini etkilememeli --- */

t("bir sayfanın değişmesi ÖTEKİNİN tarihini oynatmaz", () => {
  const d = gecici();
  icerikTarihleri(d, "2026-09-08", { "a.html": "<p>A</p>", "b.html": "<p>B</p>" });
  const iki = icerikTarihleri(d, "2026-09-12", { "a.html": "<p>A DEĞİŞTİ</p>", "b.html": "<p>B</p>" });
  assert.equal(iki.lastmod["a.html"], "2026-09-12");
  assert.equal(iki.lastmod["b.html"], "2026-09-08", "dokunulmayan sayfa etkilenmemeli");
});

/* --- anlık görüntü dosyası --- */

t("anlık görüntü değişmediyse DOSYAYA YAZILMAZ", () => {
  const d = gecici();
  icerikTarihleri(d, "2026-09-08", { "a.html": "<p>A</p>" });
  const yol = join(d, "data", "icerik-surumu.json");
  const once = readFileSync(yol, "utf8");
  icerikTarihleri(d, "2026-09-12", { "a.html": "<style>p{}</style><p>A</p>" });
  assert.equal(readFileSync(yol, "utf8"), once, "içerik aynıysa anlık görüntü de değişmemeli");
});

t("anlık görüntü bozuksa çökmez, sıfırdan kurar", () => {
  const d = gecici();
  writeFileSync(join(d, "data", "icerik-surumu.json"), "{bozuk", "utf8");
  const r = icerikTarihleri(d, "2026-09-12", { "a.html": "<p>A</p>" });
  assert.equal(r.lastmod["a.html"], "2026-09-12");
});

t("geçersiz gün reddedilir", () => {
  const d = gecici();
  assert.throws(() => icerikTarihleri(d, "12-09-2026", { "a.html": "x" }), /geçersiz gün/);
});

/* --- yardımcılar --- */

t("sonDegisiklik / ilkYayin / enYeni", () => {
  const t0 = { lastmod: { a: "2026-09-08", b: "2026-09-10" }, published: { a: "2026-09-01" }, bugun: "2026-09-12" };
  assert.equal(sonDegisiklik(t0, "a"), "2026-09-08");
  assert.equal(sonDegisiklik(t0, "yok"), "2026-09-12");
  assert.equal(ilkYayin(t0, "a"), "2026-09-01");
  assert.equal(ilkYayin(t0, "b"), "2026-09-10", "yayın yoksa son değişikliğe düşmeli");
  assert.equal(enYeni(t0, ["a", "b"]), "2026-09-10");
  assert.equal(enYeni(t0, ["yok"]), "2026-09-12");
});

/* --- asıl olayın regresyonu --- */

t("REGRESYON: 29 dosyada style değişimi hiçbir tarihi oynatmamalı", () => {
  const d = gecici();
  const ilk = {};
  for (let i = 0; i < 29; i += 1) ilk[`articles/y${i}.html`] = `<style>h1{line-height:.97}</style><h1>Yazı ${i}</h1>`;
  icerikTarihleri(d, "2026-09-08", ilk);
  const sonra = {};
  for (let i = 0; i < 29; i += 1) sonra[`articles/y${i}.html`] = `<style>h1{line-height:1.15}</style><h1>Yazı ${i}</h1>`;
  const r = icerikTarihleri(d, "2026-09-12", sonra);
  const bugune_kayan = Object.values(r.lastmod).filter((x) => x === "2026-09-12").length;
  assert.equal(bugune_kayan, 0, "satır yüksekliği düzeltmesi hiçbir tarihi bugüne çekmemeli");
  assert.deepEqual(r.degisen, []);
});

console.log(`içerik sürümü testi: tamam (${sayac} test)`);
