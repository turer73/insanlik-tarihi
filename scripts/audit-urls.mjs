// Arama motoru denetim tablosu üretici.
//
// docs/url-denetimi.md içine, sitemap'teki bütün URL'lerin başlık, meta
// açıklama, kategori ve git geçmişinden üretilmiş tarih bilgilerini yazar.
//
// "İndeks" sütunu artık ELLE DEĞİL, Search Console'un URL Inspection
// cevabından gelir (data/gsc-index.json anlık görüntüsü; tazeleme
// scripts/fetch-gsc.mjs). Anlık görüntü yoksa sütun boş kalır - betik hâlâ
// tahmin üretmez, yalnızca ölçülmüş değeri yazar. "Not" sütunu elle
// doldurulmaya devam eder ve yeniden üretimde KORUNUR.
//
// Taze tutma: npm check zincirine bağlıdır. Makale verisi değişirse bu dosya
// da değişmelidir; git diff yakalar.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { anlikTarihler, sonDegisiklik, ilkYayin } from './lib/icerik-surumu.mjs';
import { siteRows } from './lib/site-urls.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://kanitatlasi.com';

const TODAY = ((d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)(new Date());
// Tarihler build-site'in ürettiği içerik anlık görüntüsünden okunur;
// yeniden hesaplanmaz ki denetim tablosu sitemap ile çelişmesin.
const TARIH = anlikTarihler(ROOT, TODAY);

const rows = (await siteRows(ROOT)).map(row => ({
  ...row,
  ilk: ilkYayin(TARIH, row.kaynak),
  son: sonDegisiklik(TARIH, row.kaynak),
}));

// Search Console kapsama anlık görüntüsü. Yoksa sütun boş kalır - betik
// tahmin üretmez. Tazeleme: node scripts/fetch-gsc.mjs (klipper üzerinden).
const gsc = JSON.parse(await readFile(path.join(ROOT, 'data', 'gsc-index.json'), 'utf8').catch(() => '{}'));

// Önceki tablodaki elle doldurulmuş İndeks/Not sütunlarını URL eşleşmesiyle koru.
function oncekiElNotlari(markdown) {
  const kayitlar = new Map();
  for (const row of rows) {
    const escapedUrl = row.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const eslesme = markdown.match(new RegExp(`\\| \\[[^\\]]*\\]\\(${escapedUrl}\\) [^\\n]*\\| ([^|]*) \\| ([^|]*)\\|$`, 'm'));
    if (eslesme) kayitlar.set(row.url, { indeks: eslesme[1].trim(), not: eslesme[2].trim() });
  }
  return kayitlar;
}

const onceki = await readFile(path.join(ROOT, 'docs', 'url-denetimi.md'), 'utf8').catch(() => '');
const elle = oncekiElNotlari(onceki);

// Search Console'un coverageState metnini tek kelimeye indirger. Ayrım
// önemli: "taranmadı" ile "reddedildi" aynı şey değildir - biri bekleme,
// öteki sorundur.
function indeksOzeti(kayit) {
  if (!kayit) return '';
  const durum = kayit.durum ?? '';
  if (kayit.karar === 'PASS') return `evet · ${kayit.sonTarama?.slice(0, 10) ?? ''}`.trim();
  if (/bilinmiyor/i.test(durum)) return 'bilinmiyor';
  if (/keşfedildi|kesfedildi/i.test(durum)) return 'keşfedildi, taranmadı';
  if (/tarandı|tarandi/i.test(durum)) return 'tarandı, eklenmedi';
  return durum || 'hayır';
}

const satirlar = rows.map(row => {
  const korunan = elle.get(row.url) ?? {};
  const aciklama = String(row.aciklama).replaceAll('|', '\\|').slice(0, 140);
  const indeks = indeksOzeti(gsc.urls?.[row.url]);
  return `| ${row.no} | [${row.baslik}](${row.url}) | ${row.meta} | ${aciklama} | ${row.kategori} | ${row.ilk} | ${row.son} | ${indeks} | ${korunan.not ?? ''} |`;
}).join('\n');

const md = `# URL Denetim Tablosu

Bu tablo sitemap'teki bütün URL'leri tek tek izler. **Betik tarafından üretilir** (\`node scripts/audit-urls.mjs\`).

- **İlk yayın / Son değişiklik:** git geçmişinden üretilir; derleme günü değil, gerçek içerik tarihidir.
- **Açıklama:** makalenin \`<meta name="description">\` içeriği.
- **İndeks:** Google Search Console **URL Inspection** cevabından gelir — tahmin değil, ölçüm. Anlık görüntü \`data/gsc-index.json\`; tazelemek için \`node scripts/fetch-gsc.mjs\`. Anlık görüntü yoksa sütun boş kalır.
- **Not:** elle doldurulur ve yeniden üretimde URL eşleşmesiyle **korunur**.

| No | Yazı | URL | Meta başlık | Açıklama | Kategori | İlk yayın | Son değişiklik | İndeks | Not |
|---|---|---|---|---|---|---|---|---|---|
${satirlar}

## İndeks sütunu nasıl tazelenir?

\`\`\`
node scripts/fetch-gsc.mjs     # Search Console'a sorar, data/gsc-index.json yazar
node scripts/audit-urls.mjs    # tabloyu yeniden üretir
\`\`\`

Sorgu \`sc-domain:kanitatlasi.com\` mülkü üzerinden, **salt okunur** yetkiyle yapılır.
Değerlerin anlamı:

| Değer | Ne demek |
|---|---|
| \`evet · TARİH\` | Dizine eklendi; tarih son tarama günü |
| \`keşfedildi, taranmadı\` | Google URL'yi biliyor ama henüz taramadı — **bekleme, sorun değil** |
| \`tarandı, eklenmedi\` | Tarandı ama dizine alınmadı — sebebi \`Not\` sütununa yazılmalı |
| \`bilinmiyor\` | Google'ın haberi yok; sitemap henüz yeniden okunmamış olabilir |
| (boş) | Anlık görüntü yok ya da bu URL ölçülmedi |

\`Not\` sütunu elle yazılır ve yeniden üretimde kaybolmaz.
`;

await writeFile(path.join(ROOT, 'docs', 'url-denetimi.md'), md, 'utf8');
console.log(`URL denetim tablosu: ${rows.length} satır → docs/url-denetimi.md`);
