#!/usr/bin/env node
// Makale bağlantılarını üretim sitesine yönlendir.
//
// SORUN: data/articles.json'daki 27 URL claude.ai artifact adreslerine
// bakıyordu. Araçlar (özellikle zaman çizelgesi) bu adresleri gömüyor ve
// kanitatlasi.com üzerinde açılan çizelgeden bir yazıya tıklayan ziyaretçi
// siteden çıkıp claude.ai'ye gidiyordu. Üstelik o artifact'lar PRIVATE -
// yani bağlantılar sahibi dışında herkes için kırıktı.
//
// ÇÖZÜM: url alanı artık üretim sitesini gösterir. Artifact adresleri
// tamamen kaldırıldı - private oldukları için public bir depoda ölü
// bağlantı olarak durmalarının değeri yok.

import { readFileSync, writeFileSync } from "node:fs";

const ORIGIN = "https://kanitatlasi.com";
const P = "data/articles.json";

const a = JSON.parse(readFileSync(P, "utf8"));
let degisen = 0;

for (const [slug, rec] of Object.entries(a)) {
  const uretim = `${ORIGIN}/articles/${slug}.html`;
  if (rec.url === uretim) continue;
  rec.url = uretim;
  degisen += 1;
}

writeFileSync(P, `${JSON.stringify(a, null, 2)}\n`, "utf8");
console.log(`${P}: ${degisen}/${Object.keys(a).length} URL üretim sitesine çevrildi`);

// assets/articles-data.js — site bu alanı gezinme için KULLANMIYOR
// (kartlar reader.html?slug= kullanıyor) ama yanlış URL bırakmak sonradan
// tuzak olur; o da düzeltilir.
const AP = "assets/articles-data.js";
let src = readFileSync(AP, "utf8");
const once = (src.match(/https:\/\/claude\.ai\/code\/artifact\/[0-9a-f-]+/g) ?? []).length;
src = src.replace(
  /"slug":"([a-z0-9-]+)"([^}]*?)"url":"https:\/\/claude\.ai\/code\/artifact\/[0-9a-f-]+"/g,
  (_m, slug, ara) => `"slug":"${slug}"${ara}"url":"${ORIGIN}/articles/${slug}.html"`,
);
const sonra = (src.match(/https:\/\/claude\.ai\/code\/artifact\/[0-9a-f-]+/g) ?? []).length;
writeFileSync(AP, src, "utf8");
console.log(`${AP}: ${once} claude.ai URL vardı, ${sonra} kaldı`);
if (sonra) console.warn("  UYARI: bazıları desen dışında kaldı, elle bakılmalı");
