#!/usr/bin/env node
// TEK SEFERLİK: data/icerik-surumu.json'u DOĞRU tarihlerle kurar.
//
// NEDEN GEREKLİ: içerik özeti mantığı bugün devreye giriyor ama bugünkü git
// geçmişi artık yanlış. 2026-09-12'de satır yüksekliği düzeltmesi 29 yazı
// dosyasına dokundu ve git tabanlı lastmod hepsini bugüne çekti. Anlık
// görüntüyü bugünün git'inden kurarsak o yanlışı kalıcılaştırırız.
//
// Bu yüzden tohum, DÜZELTMEDEN ÖNCEKİ commit'ten okunuyor: 94154c5~1.
// O noktada tarihler beş güne yayılmıştı (27/44/9/19/3) ve doğruydu.
//
// Çalıştırdıktan sonra bir daha gerekmez: build-site her derlemede özeti
// karşılaştırıp anlık görüntüyü kendisi sürdürür.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { icerikGirdileri } from "./lib/icerik-girdileri.mjs";
import { icerikTarihleri } from "./lib/icerik-surumu.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ONCEKI = process.env.TOHUM_COMMIT ?? "94154c5~1";

const bugun = ((d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`)(new Date());

function gitDosya(ref, yol) {
  try {
    return execFileSync("git", ["show", `${ref}:${yol}`], { cwd: ROOT, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  } catch {
    return null;
  }
}

const ham = gitDosya(ONCEKI, "data/lastmod.json");
if (!ham) {
  console.error(`Tohum okunamadı: ${ONCEKI}:data/lastmod.json`);
  console.error("TOHUM_COMMIT ile başka bir commit verebilirsiniz.");
  process.exit(1);
}
const tohum = JSON.parse(ham);
console.log(`Tohum: ${ONCEKI} · lastmod ${Object.keys(tohum.lastmod ?? {}).length} kayıt`);
{
  const say = {};
  for (const v of Object.values(tohum.lastmod ?? {})) say[v] = (say[v] ?? 0) + 1;
  console.log("  tohumdaki tarih dağılımı:", JSON.stringify(say));
}

// build-site ile AYNI envanteri kullan
const kaynak = readFileSync(path.join(ROOT, "assets", "articles-data.js"), "utf8");
const ctx = { window: {} };
vm.runInNewContext(kaynak, ctx, { filename: "assets/articles-data.js" });
const articles = ctx.window.ITArticles;
const merkezler = JSON.parse(readFileSync(path.join(ROOT, "data", "konu-merkezleri.json"), "utf8"));
const hubs = Object.values(merkezler).sort((a, b) => a.sira - b.sira);

const girdiler = await icerikGirdileri(ROOT, { articles, hubs });
const sonuc = icerikTarihleri(ROOT, bugun, girdiler, tohum);

const say = {};
for (const v of Object.values(sonuc.lastmod)) say[v] = (say[v] ?? 0) + 1;
console.log(`\ndata/icerik-surumu.json yazıldı · ${Object.keys(girdiler).length} anahtar`);
console.log("  yeni tarih dağılımı:", JSON.stringify(Object.fromEntries(Object.entries(say).sort())));
const bugunku = Object.entries(sonuc.lastmod).filter(([, v]) => v === bugun).map(([k]) => k);
console.log(`  bugüne düşen (${bugunku.length}):`, bugunku.slice(0, 8).join(", ") + (bugunku.length > 8 ? ` +${bugunku.length - 8}` : ""));
