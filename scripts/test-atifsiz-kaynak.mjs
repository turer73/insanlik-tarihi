#!/usr/bin/env node
// Doğrulayıcı TERS YÖNÜ yakalıyor mu?
//
// Doğrulayıcı uzun süre yalnız tek yönü denetledi: bir atıf var olmayan
// kaynağa işaret ediyor mu. Ters yön - kayda eklenmiş ama hiçbir kanıt
// maddesinin göstermediği kaynak - denetlenmiyordu ve ölçüldüğünde 539
// bağlantının 54'ü öyleydi. Bu dosya o denetimin düşmesini engeller.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let sayac = 0;
const t = (ad, fn) => { fn(); sayac += 1; };

const kaynak = (id) => ({
  id, tier: "peer-reviewed", type: "article", title: `${id} başlığı`,
  authors: ["Yazar, Bir"], year: 2020, doi: "10.1000/" + id,
  container: "Bir Dergi", language: "tr",
});

function kayitDosyasi(kaynaklar, atifYapilan) {
  const dizin = mkdtempSync(join(tmpdir(), "atifsiz-"));
  const yol = join(dizin, "kayit.json");
  writeFileSync(yol, JSON.stringify([{
    schema_version: 2,
    id: "deneme-kaydi",
    claim: "Bir iddia.",
    status: "established",
    topic: ["deneme"],
    disciplines: ["arkeoloji"],
    checked: "2026-09-19",
    sources: kaynaklar.map(kaynak),
    evidence: [{
      id: "kanit-bir",
      text: "Bir kanıt maddesi.",
      citations: atifYapilan.map((ref) => ({ source_ref: ref, locator: "s. 1", support_type: "direct" })),
    }],
    counter_evidence: [],
    review: { status: "draft" },
  }], null, 2), "utf8");
  return yol;
}

function calistir(yol) {
  try {
    return execFileSync("node", [join(ROOT, "scripts", "validate.mjs"), yol],
      { encoding: "utf8", cwd: ROOT });
  } catch (hata) {
    // Doğrulayıcı hata bulursa çıkış kodu sıfır değil; çıktısı yine lazım.
    return `${hata.stdout ?? ""}${hata.stderr ?? ""}`;
  }
}

t("atıf almayan kaynak uyarı üretir", () => {
  const cikti = calistir(kayitDosyasi(["a", "b"], ["a"]));
  assert.match(cikti, /'b': kayda eklenmiş ama hiçbir kanıt maddesi göstermiyor/,
    "atıfsız kaynak uyarılmalı");
  assert.ok(!/'a': kayda eklenmiş ama/.test(cikti), "atıf alan kaynak uyarılmamalı");
});

t("her kaynak atıf alıyorsa uyarı çıkmaz", () => {
  const cikti = calistir(kayitDosyasi(["a", "b"], ["a", "b"]));
  assert.ok(!/kayda eklenmiş ama hiçbir kanıt maddesi göstermiyor/.test(cikti),
    "hepsi atıflıyken uyarı olmamalı");
  assert.match(cikti, /Atıfsız kaynak bağlantısı: 0/);
});

t("özet satırı sayıyı bildirir", () => {
  const cikti = calistir(kayitDosyasi(["a", "b", "c"], ["a"]));
  assert.match(cikti, /Atıfsız kaynak bağlantısı: 2/);
});

t("atıfsız kaynak HATA değil uyarıdır - derleme durmaz", () => {
  const cikti = calistir(kayitDosyasi(["a", "b"], ["a"]));
  assert.match(cikti, /Geçerli\. Hata yok\./,
    "uyarı, kaydı geçersiz kılmamalı");
});

console.log(`atıfsız kaynak testi: tamam (${sayac} test)`);
