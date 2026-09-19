#!/usr/bin/env node
// TEK SEFERLİK: özetleri yeni girdilerle yeniden hesaplar, TARİHLERE DOKUNMAZ.
//
// NEDEN GEREKLİ: icerik-girdileri.mjs'e yazının kendi bulgu kayıtları eklendi.
// Bu, doğru bir düzeltme - kanıt dosyası yazı sayfasının parçası ve metin
// oradan geliyor. Ama girdi değişince özet de değişir ve normal derleme bunu
// "içerik değişti" sayıp OTUZ yazıyı birden bugüne çeker.
//
// Bu yanlış olurdu: bugün değişen şey yazıların metni değil, bizim neyi
// ölçtüğümüz. Düzeltmenin kendisi bir yayın olayı değildir.
//
// Betik anlık görüntüdeki lastmod/published değerlerini AYNEN bırakır ve
// yalnız `ozet` alanını yeniler. Bundan sonraki gerçek içerik değişiklikleri
// doğru biçimde tarih oynatır - çünkü baz artık doğru girdiyle kurulmuştur.
//
// Anlık görüntüde karşılığı olmayan yeni anahtarlar bu betikte oluşturulmaz;
// onları build-site normal yoluyla ekler.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { icerikGirdileri } from "./lib/icerik-girdileri.mjs";
import { hashla, metinOzu } from "./lib/icerik-surumu.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const YOL = path.join(ROOT, "data", "icerik-surumu.json");

const anlik = JSON.parse(readFileSync(YOL, "utf8"));
const kayitlar = anlik.kayitlar ?? {};

const kaynak = readFileSync(path.join(ROOT, "assets", "articles-data.js"), "utf8");
const ctx = { window: {} };
vm.runInNewContext(kaynak, ctx, { filename: "assets/articles-data.js" });
const merkezler = JSON.parse(readFileSync(path.join(ROOT, "data", "konu-merkezleri.json"), "utf8"));
const hubs = Object.values(merkezler).sort((a, b) => a.sira - b.sira);

const girdiler = await icerikGirdileri(ROOT, { articles: ctx.window.ITArticles, hubs });

let yenilenen = 0;
const eksik = [];
for (const [anahtar, metin] of Object.entries(girdiler)) {
  const kayit = kayitlar[anahtar];
  if (!kayit) { eksik.push(anahtar); continue; }
  const ozet = hashla(metinOzu(metin));
  if (kayit.ozet !== ozet) { kayit.ozet = ozet; yenilenen += 1; }
}

const sirali = Object.fromEntries(Object.keys(kayitlar).sort().map((k) => [k, kayitlar[k]]));
writeFileSync(YOL, `${JSON.stringify({ ...anlik, kayitlar: sirali }, null, 2)}\n`, "utf8");

const dagilim = {};
for (const v of Object.values(sirali)) dagilim[v.lastmod] = (dagilim[v.lastmod] ?? 0) + 1;

console.log(`özet yenilenen anahtar : ${yenilenen} / ${Object.keys(girdiler).length}`);
console.log(`anlık görüntüde olmayan: ${eksik.length}${eksik.length ? ` (${eksik.join(", ")})` : ""}`);
console.log("tarih dağılımı (DEĞİŞMEMELİ):", JSON.stringify(Object.fromEntries(Object.entries(dagilim).sort())));
