# Kanıt Atlası — yayınlama

Üretim sitesi tek komutla hazırlanır:

```bash
npm run build:site
```

Komut `site/` klasörünü üretir. Çıktıda şunlar bulunur:

- Kanıt Atlası markalı ana sayfa,
- 27 bağımsız ve indekslenebilir araştırma yazısı,
- zaman çizelgesi, bulgu veri tabanı ve kanıt denetimi,
- DALL·E tabanlı WebP kapak dosyaları,
- `sitemap.xml`, `feed.xml`, `robots.txt`, web manifesti ve 404 sayfası,
- Cloudflare Pages için `_headers` ve `_redirects` dosyaları.

## Cloudflare Pages

1. **Workers & Pages → Create → Pages → Connect to Git** yolunu açın.
2. `turer73/insanlik-tarihi` deposunu ve `main` dalını seçin.
3. Framework preset: `None`
4. Build command: `npm run build:site`
5. Build output directory: `site`
6. İlk `pages.dev` yayını tamamlanınca **Custom domains** bölümünden `kanitatlasi.com` alan adını ekleyin.

Alan adı aynı Cloudflare hesabında yönetiliyorsa gerekli DNS kaydı Pages tarafından oluşturulur. Önceden tahmini bir A veya CNAME kaydı eklemeyin; Cloudflare Pages'in oluşturduğu hedefi kullanın.

## Vercel

Depo Vercel'e bağlandığında `vercel.json`, derleme komutunu, çıktı klasörünü, güvenlik başlıklarını ve `www` → kök alan adı yönlendirmesini otomatik uygular.

## Kalıcı adresler

- Ana adres: `https://kanitatlasi.com`
- Yazılar: `/articles/<slug>.html`
- Site haritası: `/sitemap.xml`
- RSS: `/feed.xml`
