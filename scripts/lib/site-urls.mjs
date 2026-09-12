// Sitedeki bütün yayımlanmış URL'lerin tek kaynağı.
//
// NEDEN AYRI DOSYA: bu liste iki yerde gerekiyor - denetim tablosunu üreten
// audit-urls.mjs ve Search Console kapsama durumunu çeken fetch-gsc.mjs.
// İki kopya tutmak, birinin ötekinden sessizce ayrılması demekti: yeni bir
// sayfa eklenir, tabloya girer ama indeks denetimine girmez. Liste burada
// tek yerde durur.
//
// Her satırda `kaynak` alanı vardır: URL'nin tarihini hangi dosyadan aldığı.
// Tarih hesabı çağıranın işidir (scripts/lib/lastmod.mjs).

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

export const ORIGIN = 'https://kanitatlasi.com';

export async function siteRows(ROOT) {
  const context = { window: {} };
  vm.runInNewContext(
    await readFile(path.join(ROOT, 'assets', 'articles-data.js'), 'utf8'),
    context,
    { filename: 'assets/articles-data.js' },
  );
  const articles = context.window.ITArticles;
  const hubs = Object.values(
    JSON.parse(await readFile(path.join(ROOT, 'data', 'konu-merkezleri.json'), 'utf8')),
  ).sort((a, b) => a.sira - b.sira);

  return [
    {
      no: '—',
      baslik: 'Ana sayfa (arşiv)',
      url: `${ORIGIN}/`,
      meta: 'Kanıt Atlası — İnsanlık Tarihi Araştırma Arşivi',
      aciklama: 'Geçmişi değil, kanıtı izleyin. Arkeoloji, tarih, bilim ve inanç üzerine kaynak odaklı araştırma dosyaları.',
      kategori: '—',
      kaynak: 'index.html',
    },
    ...[...articles].sort((a, b) => a.no - b.no).map(article => ({
      no: String(article.no).padStart(2, '0'),
      baslik: article.cardTitle ?? article.title,
      url: `${ORIGIN}/articles/${article.slug}.html`,
      meta: `${article.title} — Kanıt Atlası`,
      aciklama: article.summary,
      kategori: article.category,
      kaynak: `articles/${article.slug}.html`,
    })),
    { no: 'A1', baslik: 'Ölçekli Zaman Çizelgesi', url: `${ORIGIN}/dist/zaman-cizelgesi.html`, meta: 'Zaman Çizelgesi — Kanıt Atlası', aciklama: 'Bulguları tarih ekseninde gösteren araç.', kategori: 'Araç', kaynak: 'dist/zaman-cizelgesi.html' },
    { no: 'A2', baslik: 'Bulgu Veri Tabanı', url: `${ORIGIN}/dist/bulgu-veri-tabani.html`, meta: 'Bulgu Veri Tabanı — Kanıt Atlası', aciklama: 'İddia, kanıt, karşı kanıt ve kaynak kayıtlarının aranabilir tablosu.', kategori: 'Araç', kaynak: 'dist/bulgu-veri-tabani.html' },
    { no: 'A3', baslik: 'Kanıt Denetimi', url: `${ORIGIN}/dist/kanit-denetimi.html`, meta: 'Kanıt Denetimi — Kanıt Atlası', aciklama: 'Bulguların statü ve inceleme durumunun denetim görünümü.', kategori: 'Araç', kaynak: 'dist/kanit-denetimi.html' },
    { no: 'K0', baslik: 'Konu Merkezleri', url: `${ORIGIN}/konular.html`, meta: 'Konu Merkezleri — Kanıt Atlası', aciklama: 'Kayıp şehirler, mitler, dinler tarihi ve iklim-uygarlık dosya kümeleri.', kategori: 'Merkez', kaynak: 'data/konu-merkezleri.json' },
    ...hubs.map(hub => ({ no: `K${hub.sira}`, baslik: hub.baslik, url: `${ORIGIN}/konular/${hub.slug}.html`, meta: `${hub.baslik} — Konu Merkezi — Kanıt Atlası`, aciklama: hub.kisa, kategori: 'Merkez', kaynak: 'data/konu-merkezleri.json' })),
    { no: 'S0', baslik: 'Kaynakça', url: `${ORIGIN}/kaynakca.html`, meta: 'Kaynakça — Kanıt Atlası', aciklama: 'Bulgu kayıtlarının arkasındaki bütün kaynak künyeleri; her biri Türkçe kullanım notu ve erişim bağlantısıyla.', kategori: 'Sayfa', kaynak: 'kaynakca.html' },
    { no: 'S1', baslik: 'Hakkında ve Yöntem', url: `${ORIGIN}/hakkinda.html`, meta: 'Hakkında ve Yöntem — Kanıt Atlası', aciklama: 'Kanıt Atlası yayın kimliği, araştırma yöntemi, inceleme durumu, düzeltme süreci ve lisans bilgisi.', kategori: 'Sayfa', kaynak: 'pages/hakkinda.html' },
    { no: 'S2', baslik: 'Düzeltme Günlüğü', url: `${ORIGIN}/duzeltmeler.html`, meta: 'Düzeltme Günlüğü — Kanıt Atlası', aciklama: 'Kanıt Atlası içerik düzeltmelerinin açık günlüğü.', kategori: 'Sayfa', kaynak: 'pages/duzeltmeler.html' },
    { no: 'S3', baslik: 'Yeniden Yayımlama Kiti', url: `${ORIGIN}/yeniden-yayin.html`, meta: 'Yeniden Yayımlama Kiti — Kanıt Atlası', aciklama: 'CC BY 4.0 lisansı altında içeriğin yeniden yayımlanma koşulları ve atıf biçimi.', kategori: 'Sayfa', kaynak: 'pages/yeniden-yayin.html' },
  ];
}
