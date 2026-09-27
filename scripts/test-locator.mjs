#!/usr/bin/env node
// Locator ölçümü doğru sınıflıyor mu?
//
// Doğrulayıcı uzun süre yalnız "paket notundan türetildi" kalıbını arıyordu.
// O kalıp sıfıra indiğinde "yer tutucu 0" diye raporlandı; oysa site genelinde
// 146 atıfın locator'ı kaynakta bir yer bile değildi ("Kayıt düzeyi ayrımı")
// ve 1256 atıfın ~1100'ü sayfa, alıntı ya da katalog kimliği taşımıyordu.
// Bu dosya iki ölçümün de gerilememesini sağlar.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gucluMu, yerTutucuMu } from "./lib/locator.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let sayac = 0;
const t = (ad, fn) => {
  try { fn(); sayac += 1; } catch (hata) { console.error(`BAŞARISIZ: ${ad}`); throw hata; }
};

// --- yer tutucu: kaynakta bir yer değil
t("eski kalıp yer tutucu", () => assert.ok(yerTutucuMu("İlgili bölüm (paket notundan türetildi)")));
t("'Kayıt düzeyi ayrımı' yer tutucu", () => assert.ok(yerTutucuMu("Kayıt düzeyi ayrımı")));
t("'Kaynak erişim düzeyi' yer tutucu", () => assert.ok(yerTutucuMu("Kaynak erişim düzeyi")));
t("'Soyutlama düzeyi' yer tutucu", () => assert.ok(yerTutucuMu("Soyutlama düzeyi")));
// çoğul "düzeyler" gerçek bir konu olabilir (Hong 1994: kurşun düzeyleri)
t("'Karşılaştırmalı düzeyler' yer tutucu değil", () => assert.ok(!yerTutucuMu("Karşılaştırmalı düzeyler")));
// UNESCO sayfalarındaki gerçek bölümler
t("'Kayıt gerekçesi' yer tutucu değil", () => assert.ok(!yerTutucuMu("Kayıt gerekçesi")));
t("'Kayıt tanımı' yer tutucu değil", () => assert.ok(!yerTutucuMu("Kayıt tanımı")));
t("'Kayıt yokluğu değerlendirmesi' yer tutucu", () => assert.ok(yerTutucuMu("Kayıt yokluğu değerlendirmesi")));
t("'corpus düzeyi' yer tutucu", () => assert.ok(yerTutucuMu("Derlemenin içeriği - corpus düzeyi")));
t("'Kaynak konumu' yer tutucu", () => assert.ok(yerTutucuMu("Kaynak konumu")));
t("boş locator yer tutucu", () => assert.ok(yerTutucuMu("")));

// --- sayfa numarası varsa "düzey" sözcüğü yer tutucu yapmaz
t("sayfalı 'düzeyinde' yer tutucu değil", () =>
  assert.ok(!yerTutucuMu("s. 13-14 — İnanna bağı yapı düzeyinde değil, bölge düzeyinde kurulabilir")));
// --- bölüm adı zayıftır ama yer tutucu değildir
t("'Sonuçlar' yer tutucu değil", () => assert.ok(!yerTutucuMu("Sonuçlar")));
t("'Susanoo bölümü' yer tutucu değil", () => assert.ok(!yerTutucuMu("Susanoo bölümü")));
t("CDLI künye alanı yer tutucu değil", () =>
  assert.ok(!yerTutucuMu("Künye — Nippur'da kazılmış edebî tablet (Penn Museum N 3236)")));

// --- güçlü: denetlenebilir yer
t("sayfa numarası güçlü", () => assert.ok(gucluMu("s. 210 — the face of a composite image")));
t("sayfa aralığı güçlü", () => assert.ok(gucluMu("s. 194-195")));
t("satır güçlü", () => assert.ok(gucluMu("satır 1-39 — kentten kente hanedan sıralaması")));
t("alıntı güçlü", () => assert.ok(gucluMu('Özet — "Our analytical results challenge traditional interpretations"')));
t("CDLI bileşik metin güçlü", () => assert.ok(gucluMu("Q000371 satır 106-115")));
t("kazı numarası güçlü", () => assert.ok(gucluMu("Marmorkopf W 17878")));
t("levha güçlü", () => assert.ok(gucluMu("Tafel 32 a, b")));
t("§ güçlü", () => assert.ok(gucluMu("§ 3.4.1 Precursors to writing")));
t("bölüm:ayet güçlü", () => assert.ok(gucluMu("Tekvin 10:10")));

// --- zayıf: yer gösteriyor olabilir ama kesinleştirmiyor
t("'Sonuçlar' zayıf", () => assert.ok(!gucluMu("Sonuçlar")));
t("'Özet' zayıf", () => assert.ok(!gucluMu("Özet")));
t("konu etiketi zayıf", () => assert.ok(!gucluMu("Hendek bakımı")));
t("kısa tırnak alıntı sayılmaz", () => assert.ok(!gucluMu('Giriş — "kral"')));
t("'Sahnenin' içindeki s alıntı sayılmaz", () => assert.ok(!gucluMu("Sahnenin genel okuması")));

// --- doğrulayıcı entegrasyonu
function kayitDosyasi(locator) {
  const dizin = mkdtempSync(join(tmpdir(), "locator-"));
  const yol = join(dizin, "kayit.json");
  writeFileSync(yol, JSON.stringify([{
    schema_version: 2, id: "deneme-kaydi", claim: "Bir iddia.", status: "established",
    topic: ["deneme"], disciplines: ["arkeoloji"], checked: "2026-09-26",
    sources: [{ id: "a", tier: "peer-reviewed", type: "article", title: "a başlığı",
                authors: ["Yazar, Bir"], year: 2020, doi: "10.1000/a", container: "Bir Dergi", language: "tr" }],
    evidence: [{ id: "kanit-bir", text: "Bir kanıt maddesi.",
                 citations: [{ source_ref: "a", locator, support_type: "direct" }] }],
    counter_evidence: [], review: { status: "draft" },
  }], null, 2), "utf8");
  return yol;
}
function calistir(yol) {
  try {
    return execFileSync("node", [join(ROOT, "scripts", "validate.mjs"), yol], { encoding: "utf8", cwd: ROOT });
  } catch (hata) { return `${hata.stdout ?? ""}${hata.stderr ?? ""}`; }
}

t("doğrulayıcı meta etiketi yer tutucu sayar", () => {
  const cikti = calistir(kayitDosyasi("Kayıt düzeyi ayrımı"));
  assert.match(cikti, /Türetilmiş locator: 1\b/);
  assert.match(cikti, /yer tutucu \('Kayıt düzeyi ayrımı'\)/);
});
t("doğrulayıcı zayıf locator'ı sayar", () => {
  const cikti = calistir(kayitDosyasi("Sonuçlar"));
  assert.match(cikti, /Türetilmiş locator: 0\b/);
  assert.match(cikti, /Zayıf locator: 1 \/ 1\b/);
});
t("doğrulayıcı sayfalı locator'ı güçlü sayar", () => {
  const cikti = calistir(kayitDosyasi("s. 12 — bir cümle"));
  assert.match(cikti, /Zayıf locator: 0 \/ 1\b/);
});

console.log(`locator testi: tamam (${sayac} test)`);
