// Arama motoru denetim tablosu üretici.
//
// docs/url-denetimi.md içine, sitemap'teki bütün URL'lerin başlık, meta
// açıklama, kategori ve git geçmişinden üretilmiş tarih bilgilerini yazar.
// "İndeks" sütunu boş üretilir; elle doldurulan değerler sonraki üretimlerde
// URL eşleşmesiyle KORUNUR. Değer yalnız Google Search Console'dan
// doğrulanabilir; bu betik tahmin üretmez.
//
// Taze tutma: npm check zincirine bağlıdır. Makale verisi değişirse bu dosya
// da değişmelidir; git diff yakalar.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { tarihler, sonDegisiklik, ilkYayin } from './lib/lastmod.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://kanitatlasi.com';

const TODAY = ((d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)(new Date());
const TARIH = tarihler(ROOT, TODAY);

const context = { window: {} };
vm.runInNewContext(await readFile(path.join(ROOT, 'assets', 'articles-data.js'), 'utf8'), context, { filename: 'assets/articles-data.js' });
const articles = context.window.ITArticles;

const rows = [
  {
    no: '—',
    baslik: 'Ana sayfa (arşiv)',
    url: `${ORIGIN}/`,
    meta: 'Kanıt Atlası — İnsanlık Tarihi Araştırma Arşivi',
    aciklama: 'Geçmişi değil, kanıtı izleyin. Arkeoloji, tarih, bilim ve inanç üzerine kaynak odaklı araştırma dosyaları.',
    kategori: '—',
    ilk: ilkYayin(TARIH, 'index.html'),
    son: sonDegisiklik(TARIH, 'index.html'),
  },
  ...[...articles].sort((a, b) => a.no - b.no).map(article => ({
    no: String(article.no).padStart(2, '0'),
    baslik: article.cardTitle ?? article.title,
    url: `${ORIGIN}/articles/${article.slug}.html`,
    meta: `${article.title} — Kanıt Atlası`,
    aciklama: article.summary,
    kategori: article.category,
    ilk: ilkYayin(TARIH, `articles/${article.slug}.html`),
    son: sonDegisiklik(TARIH, `articles/${article.slug}.html`),
  })),
  { no: 'A1', baslik: 'Ölçekli Zaman Çizelgesi', url: `${ORIGIN}/dist/zaman-cizelgesi.html`, meta: 'Zaman Çizelgesi — Kanıt Atlası', aciklama: 'Bulguları tarih ekseninde gösteren araç.', kategori: 'Araç', ilk: ilkYayin(TARIH, 'dist/zaman-cizelgesi.html'), son: sonDegisiklik(TARIH, 'dist/zaman-cizelgesi.html') },
  { no: 'A2', baslik: 'Bulgu Veri Tabanı', url: `${ORIGIN}/dist/bulgu-veri-tabani.html`, meta: 'Bulgu Veri Tabanı — Kanıt Atlası', aciklama: 'İddia, kanıt, karşı kanıt ve kaynak kayıtlarının aranabilir tablosu.', kategori: 'Araç', ilk: ilkYayin(TARIH, 'dist/bulgu-veri-tabani.html'), son: sonDegisiklik(TARIH, 'dist/bulgu-veri-tabani.html') },
  { no: 'A3', baslik: 'Kanıt Denetimi', url: `${ORIGIN}/dist/kanit-denetimi.html`, meta: 'Kanıt Denetimi — Kanıt Atlası', aciklama: 'Bulguların statü ve inceleme durumunun denetim görünümü.', kategori: 'Araç', ilk: ilkYayin(TARIH, 'dist/kanit-denetimi.html'), son: sonDegisiklik(TARIH, 'dist/kanit-denetimi.html') },
  { no: 'S1', baslik: 'Hakkında ve Yöntem', url: `${ORIGIN}/hakkinda.html`, meta: 'Hakkında ve Yöntem — Kanıt Atlası', aciklama: 'Kanıt Atlası yayın kimliği, araştırma yöntemi, inceleme durumu, düzeltme süreci ve lisans bilgisi.', kategori: 'Sayfa', ilk: ilkYayin(TARIH, 'pages/hakkinda.html'), son: sonDegisiklik(TARIH, 'pages/hakkinda.html') },
  { no: 'S2', baslik: 'Düzeltme Günlüğü', url: `${ORIGIN}/duzeltmeler.html`, meta: 'Düzeltme Günlüğü — Kanıt Atlası', aciklama: 'Kanıt Atlası içerik düzeltmelerinin açık günlüğü.', kategori: 'Sayfa', ilk: ilkYayin(TARIH, 'pages/duzeltmeler.html'), son: sonDegisiklik(TARIH, 'pages/duzeltmeler.html') },
];

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

const satirlar = rows.map(row => {
  const korunan = elle.get(row.url) ?? {};
  const aciklama = String(row.aciklama).replaceAll('|', '\\|').slice(0, 140);
  return `| ${row.no} | [${row.baslik}](${row.url}) | ${row.meta} | ${aciklama} | ${row.kategori} | ${row.ilk} | ${row.son} | ${korunan.indeks ?? ''} | ${korunan.not ?? ''} |`;
}).join('\n');

const md = `# URL Denetim Tablosu

Bu tablo sitemap'teki bütün URL'leri tek tek izler. **Betik tarafından üretilir** (\`node scripts/audit-urls.mjs\`).

- **İlk yayın / Son değişiklik:** git geçmişinden üretilir; derleme günü değil, gerçek içerik tarihidir.
- **Açıklama:** makalenin \`<meta name="description">\` içeriği.
- **İndeks ve Not:** elle doldurulur; değer yalnız Google Search Console'dan doğrulanır. Betik yeniden çalıştığında bu iki sütun URL eşleşmesiyle **korunur** — kayıt güvenlidir.

| No | Yazı | URL | Meta başlık | Açıklama | Kategori | İlk yayın | Son değişiklik | İndeks | Not |
|---|---|---|---|---|---|---|---|---|---|
${satirlar}

## Nasıl doldurulur?

1. Search Console'da "Sayfalar" raporunda indekslenmiş/taranmış URL'leri dışa aktarın.
2. URL'e göre eşleştirip \`İndeks\` sütununa \`evet\` / \`hayır\` / hata kodu yazın.
3. İndekslenmeyen satır için \`Not\` sütununa sebebi (noindex, 404, yönlendirme, düşük kalite vb.) ekleyin.
4. Tabloyu commit edin; sürüm geçmişi indekslemenin günlüğü olur. Elle yazılan sütunlar yeniden üretimde kaybolmaz.
`;

await writeFile(path.join(ROOT, 'docs', 'url-denetimi.md'), md, 'utf8');
console.log(`URL denetim tablosu: ${rows.length} satır → docs/url-denetimi.md`);
