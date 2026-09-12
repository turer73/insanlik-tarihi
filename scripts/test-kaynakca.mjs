#!/usr/bin/env node
// Her test tek bir soru soruyor: bu modül YAKALIYOR mu?
//
// İki katman sınanıyor: kaynakları tekilleştiren saf modül (kaynakca.mjs) ve
// tarayıcıda koşan süzgeç (assets/kaynakca.js). İkincisi sahte bir DOM üstünde
// gerçek dosyayla çalıştırılıyor - app.js testindeki yöntemin aynısı.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { kaynaklariTopla, renderKaynakca } from "./lib/kaynakca.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let sayac = 0;
const t = (ad, fn) => { fn(); sayac += 1; };

const YAZILAR = [
  { slug: "uruk", no: 1, title: "Uruk: Dünyanın İlk Şehri mi?", cardTitle: "Uruk" },
  { slug: "tufan", no: 2, title: "Tufan Anlatıları", cardTitle: "Tufan" },
];

const kayit = (id, kaynaklar, yazilar) => ({ id, used_in: yazilar, sources: kaynaklar });

/* --- tekilleştirme --- */

t("aynı kaynak iki kayıtta tek girdi olur", () => {
  const k = kaynaklariTopla([
    kayit("b1", [{ id: "x", tier: "primary", title: "X" }], ["uruk"]),
    kayit("b2", [{ id: "x", tier: "primary", title: "X" }], ["tufan"]),
  ], YAZILAR);
  assert.equal(k.length, 1);
  assert.equal(k[0].kullanim, 2);
  assert.deepEqual(k[0].yazilar.map((y) => y.slug), ["uruk", "tufan"]);
});

t("eksik künye alanı öteki varyanttan tamamlanır", () => {
  const k = kaynaklariTopla([
    kayit("b1", [{ id: "x", tier: "primary", title: "X" }], ["uruk"]),
    kayit("b2", [{ id: "x", tier: "primary", title: "X", year: 1999, isbn: "9780198149224", publisher: "OUP" }], ["tufan"]),
  ], YAZILAR);
  assert.equal(k[0].kunye.year, 1999);
  assert.equal(k[0].kunye.publisher, "OUP");
});

t("farklı notlar korunur, aynı not tekrarlanmaz", () => {
  const k = kaynaklariTopla([
    kayit("b1", [{ id: "x", tier: "primary", title: "X", note: "birinci rol" }], ["uruk"]),
    kayit("b2", [{ id: "x", tier: "primary", title: "X", note: "ikinci rol" }], ["tufan"]),
    kayit("b3", [{ id: "x", tier: "primary", title: "X", note: "birinci rol" }], ["tufan"]),
  ], YAZILAR);
  assert.deepEqual(k[0].notlar, ["birinci rol", "ikinci rol"]);
});

t("katman çoğunluğa göre seçilir, ikinci rol kaybolmaz", () => {
  const k = kaynaklariTopla([
    kayit("b1", [{ id: "x", tier: "primary", title: "X" }], ["uruk"]),
    kayit("b2", [{ id: "x", tier: "primary", title: "X" }], ["uruk"]),
    kayit("b3", [{ id: "x", tier: "peer-reviewed", title: "X" }], ["tufan"]),
  ], YAZILAR);
  assert.equal(k[0].katman, "primary");
  assert.deepEqual(k[0].ikinciKatmanlar, ["peer-reviewed"]);
});

t("geri bağlantı yazıdaki İLK bulguya iner", () => {
  const k = kaynaklariTopla([
    kayit("ilk-bulgu", [{ id: "x", tier: "primary", title: "X" }], ["uruk"]),
    kayit("ikinci-bulgu", [{ id: "x", tier: "primary", title: "X" }], ["uruk"]),
  ], YAZILAR);
  assert.equal(k[0].yazilar.length, 1);
  assert.equal(k[0].yazilar[0].bulguId, "ilk-bulgu");
});

t("envanterde olmayan yazı slug'ı bağlantı üretmez", () => {
  const k = kaynaklariTopla([kayit("b1", [{ id: "x", tier: "primary", title: "X" }], ["olmayan-yazi"])], YAZILAR);
  assert.deepEqual(k[0].yazilar, []);
});

t("yazıya bağlı olmayan kayıt kaynağı yine de listelenir", () => {
  const k = kaynaklariTopla([kayit("b1", [{ id: "x", tier: "primary", title: "X" }], [])], YAZILAR);
  assert.equal(k.length, 1);
  assert.deepEqual(k[0].yazilar, []);
});

t("id'siz kaynak başlığıyla tekilleşir, id'siz ve başlıksız atlanır", () => {
  const k = kaynaklariTopla([
    kayit("b1", [{ tier: "primary", title: "Başlıkla" }, { tier: "primary" }], ["uruk"]),
  ], YAZILAR);
  assert.equal(k.length, 1);
  assert.equal(k[0].id, "Başlıkla");
});

/* --- bağlantı seçimi --- */

const bag = (kaynak) => {
  const html = renderKaynakca([kayit("b1", [kaynak], ["uruk"])], YAZILAR, "https://ornek.test");
  return [...html.matchAll(/<a class="kk-tanim" href="([^"]+)"/g)].map((m) => m[1]);
};

t("url varsa DOI ve ISBN'in önüne geçer", () => {
  assert.deepEqual(
    bag({ id: "x", tier: "primary", title: "X", url: "https://a.test/b", doi: "10.1000/abc", isbn: "9780198149224" }),
    ["https://a.test/b"],
  );
});

t("url yoksa DOI kullanılır", () => {
  assert.deepEqual(bag({ id: "x", tier: "primary", title: "X", doi: "10.1000/abc" }), ["https://doi.org/10.1000/abc"]);
});

t("url ve DOI yoksa ISBN kataloğa bağlanır", () => {
  assert.deepEqual(bag({ id: "x", tier: "primary", title: "X", isbn: "978-0-19-814922-4" }),
    ["https://openlibrary.org/isbn/9780198149224"]);
});

t("bozuk DOI bağlantı üretmez", () => {
  assert.deepEqual(bag({ id: "x", tier: "primary", title: "X", doi: "sadece-metin" }), []);
});

t("bozuk uzunlukta ISBN bağlantı üretmez", () => {
  assert.deepEqual(bag({ id: "x", tier: "primary", title: "X", isbn: "12345" }), []);
});

t("javascript: adresi bağlantıya dönüşmez", () => {
  const html = renderKaynakca([kayit("b1", [{ id: "x", tier: "primary", title: "X", url: "javascript:alert(1)" }], ["uruk"])],
    YAZILAR, "https://ornek.test");
  assert.ok(!html.includes("javascript:"), "şema süzgeci javascript: adresini geçirmemeli");
  assert.ok(html.includes("kk-tanim-yok"), "bağlantısız künye işaretlenmeli");
});

/* --- HTML üretimi --- */

t("başlıktaki HTML kaçırılır", () => {
  const html = renderKaynakca(
    [kayit("b1", [{ id: "x", tier: "primary", title: "<script>alert(1)</script>", note: "a & b" }], ["uruk"])],
    YAZILAR, "https://ornek.test");
  assert.ok(!html.includes("<script>alert(1)</script>"), "başlık ham HTML olarak basılmamalı");
  assert.ok(html.includes("&lt;script&gt;"), "kaçırılmış hâli görünmeli");
  assert.ok(html.includes("a &amp; b"));
});

t("yıl azalan sıralanır, yılsız künye sona düşer", () => {
  const html = renderKaynakca([
    kayit("b1", [{ id: "a", tier: "primary", title: "Eski", year: 1950 }], ["uruk"]),
    kayit("b2", [{ id: "b", tier: "primary", title: "Yeni", year: 2024 }], ["uruk"]),
    kayit("b3", [{ id: "c", tier: "primary", title: "Yılsız" }], ["uruk"]),
  ], YAZILAR, "https://ornek.test");
  const sira = [...html.matchAll(/<p class="kk-baslik">(?:<a[^>]*>)?([^<]+)/g)].map((m) => m[1]);
  assert.deepEqual(sira, ["Yeni", "Eski", "Yılsız"]);
});

t("boş katman bölümü hiç üretilmez", () => {
  const html = renderKaynakca([kayit("b1", [{ id: "x", tier: "primary", title: "X" }], ["uruk"])],
    YAZILAR, "https://ornek.test");
  assert.ok(html.includes('id="primary"'));
  assert.ok(!html.includes('id="unreliable"'), "kaydı olmayan katman başlığı basılmamalı");
});

t("güvenilmez katmanı çerçevesiyle birlikte yazılır", () => {
  const html = renderKaynakca([kayit("b1", [{ id: "x", tier: "unreliable", title: "X" }], ["uruk"])],
    YAZILAR, "https://ornek.test");
  assert.ok(html.includes("önerilmiyor"), "güvenilmez katmanı önerilmediğini açıkça söylemeli");
});

t("notsuz kaynak sessizce geçilmez, eksik olarak işaretlenir", () => {
  const html = renderKaynakca([kayit("b1", [{ id: "x", tier: "primary", title: "X" }], ["uruk"])],
    YAZILAR, "https://ornek.test");
  assert.ok(html.includes("kk-not-yok"));
});

t("sayfa iskeleti tam belge, tekil JSON-LD ve canonical taşır", () => {
  const html = renderKaynakca([kayit("b1", [{ id: "x", tier: "primary", title: "X" }], ["uruk"])],
    YAZILAR, "https://ornek.test");
  assert.ok(html.startsWith("<!doctype html>"));
  assert.equal((html.match(/application\/ld\+json/g) || []).length, 1);
  assert.ok(html.includes('<link rel="canonical" href="https://ornek.test/kaynakca.html">'));
  assert.ok(html.includes('class="skip-link"'));
});

/* --- tarayıcı süzgeci: gerçek dosya, sahte DOM --- */

function kurDom(kayitlar) {
  const girdiler = kayitlar.map((k) => ({
    hidden: false,
    dataset: {},
    _ara: k.ara,
    _bolum: k.bolum,
    getAttribute(ad) { return ad === "data-ara" ? this._ara : null; },
  }));
  const bolumAdlari = [...new Set(kayitlar.map((k) => k.bolum))];
  const bolumler = bolumAdlari.map((ad) => {
    const rozet = { textContent: String(girdiler.filter((g) => g._bolum === ad).length) };
    return {
      id: ad,
      hidden: false,
      dataset: {},
      rozet,
      querySelector: (secici) => (secici === ".kk-sayi" ? rozet : null),
      querySelectorAll: () => girdiler.filter((g) => g._bolum === ad && !g.hidden),
    };
  });
  const dinleyiciler = new Map();
  const alan = {
    value: "",
    addEventListener(tur, fn) { dinleyiciler.set(tur, [...(dinleyiciler.get(tur) ?? []), fn]); },
  };
  const cikti = { textContent: "" };
  const sinifiar = new Set();
  const document = {
    body: { classList: { add: (x) => sinifiar.add(x) } },
    getElementById: (id) => (id === "kkArama" ? alan : id === "kkSonuc" ? cikti : null),
    querySelectorAll: (secici) => (secici === ".kk-girdi" ? girdiler : secici === ".kk-bolum[id]" ? bolumler : []),
  };
  // Bekletmeyi anında koştur: test zamanlayıcı beklemesin.
  const window = { setTimeout: (fn) => { fn(); return 1; }, clearTimeout: () => {} };
  const kaynak = readFileSync(join(ROOT, "assets", "kaynakca.js"), "utf8");
  vm.runInNewContext(kaynak, { document, window, Event: class {} }, { filename: "assets/kaynakca.js" });

  const yaz = (deger) => {
    alan.value = deger;
    for (const fn of dinleyiciler.get("input") ?? []) fn();
  };
  const esc = () => { for (const fn of dinleyiciler.get("keydown") ?? []) fn({ key: "Escape" }); };
  return { girdiler, bolumler, alan, cikti, yaz, esc, sinifiar };
}

const ORNEK = [
  { ara: "göbekli tepe kazı raporu", bolum: "primary" },
  { ara: "şanlıurfa müzesi kataloğu", bolum: "primary" },
  { ara: "İPCC altıncı değerlendirme raporu", bolum: "institutional" },
  { ara: "climate change 2021", bolum: "institutional" },
];

t("JavaScript çalışınca arama kutusu açılır", () => {
  const d = kurDom(ORNEK);
  assert.ok(d.sinifiar.has("kk-arama-acik"), "kutu yalnız JS varken görünmeli");
});

t("Türkçe katlama: 'gobekli' → 'Göbekli'", () => {
  const d = kurDom(ORNEK);
  d.yaz("gobekli");
  assert.equal(d.girdiler.filter((g) => !g.hidden).length, 1);
  assert.equal(d.cikti.textContent, "1 / 4 künye");
});

t("Türkçe katlama: 'sanliurfa' → 'Şanlıurfa'", () => {
  const d = kurDom(ORNEK);
  d.yaz("sanliurfa");
  assert.equal(d.girdiler.filter((g) => !g.hidden).length, 1);
});

t("REGRESYON: 'ipcc' araması 'İPCC' künyesini bulmalı", () => {
  // "İ".toLowerCase() JavaScript'te "i" + birleşen nokta üretir. Katlama
  // küçültmeden SONRA yapılırsa bu arama sessizce sıfır sonuç döner.
  const d = kurDom(ORNEK);
  d.yaz("ipcc");
  assert.equal(d.girdiler.filter((g) => !g.hidden).length, 1, "noktalı büyük İ küçültmeyi bozmamalı");
  d.yaz("İPCC");
  assert.equal(d.girdiler.filter((g) => !g.hidden).length, 1, "diakritikli yazım da bulmalı");
});

t("eşleşme yoksa açıkça söylenir ve bölümler gizlenir", () => {
  const d = kurDom(ORNEK);
  d.yaz("zzzzzz");
  assert.equal(d.cikti.textContent, "eşleşme yok");
  assert.ok(d.bolumler.every((b) => b.hidden));
});

t("bölüm rozeti süzülünce daralır, temizlenince geri döner", () => {
  const d = kurDom(ORNEK);
  const kurumsal = d.bolumler.find((b) => b.id === "institutional");
  assert.equal(kurumsal.rozet.textContent, "2");
  d.yaz("ipcc");
  assert.equal(kurumsal.rozet.textContent, "1");
  d.yaz("");
  assert.equal(kurumsal.rozet.textContent, "2", "sorgu silinince ilk sayı geri gelmeli");
  assert.equal(d.cikti.textContent, "");
  assert.ok(d.girdiler.every((g) => !g.hidden));
});

t("Escape aramayı temizler", () => {
  const d = kurDom(ORNEK);
  d.yaz("ipcc");
  d.esc();
  assert.equal(d.alan.value, "");
  assert.ok(d.girdiler.every((g) => !g.hidden));
});

console.log(`kaynakça testi: tamam (${sayac} test)`);
