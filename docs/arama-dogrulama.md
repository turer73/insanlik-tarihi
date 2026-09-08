# Arama Motoru Doğrulaması (Search Console + Bing)

Bu adımlar yayıncı (insan) işlemi gerektirir; betikler yapamaz. Tamamlandığında
site trafiği ve indeks durumu ilk kez ölçülebilir hale gelir.

## 1. Google Search Console

1. https://search.google.com/search-console adresine gidin, **"URL öneki"**
   yöntemiyle `https://kanitatlasi.com` mülkünü ekleyin.
2. Doğrulama yöntemi olarak **"HTML dosyası"** seçin. Google size
   `google1234abcd.html` biçiminde bir dosya adı verir.
3. O adı taşıyan **boş** bir dosyayı `verification/` dizinine koyun:
   ```
   verification/google1234abcd.html
   ```
   `npm run build:site` bu dizindeki bütün dosyaları yayın köküne kopyalar.
   (Boş dosya yeterlidir; içeriği önemli değildir.)
4. Deploy sonrası Search Console'da **Doğrula** düğmesine basın.

## 2. Bing Webmaster Tools

1. https://www.bing.com/webmasters adresine gidin, **"Site ekle"** ile
   `https://kanitatlasi.com` adresini girin. Google hesabıyla oturum açıp
   Search Console'dan içe aktarabilirsiniz (ayrı doğrulama dosyası gerekmez).
2. İçe aktarmıyorsanız Bing'in istediği `BingSiteAuth.xml` dosyasını
   `verification/` dizinine koyun ve aynı şekilde yayına alın.

## 3. Doğrulama sonrası

1. `docs/url-denetimi.md` tablosundaki **İndeks** sütununu Search Console'un
   "Sayfalar" raporuyla doldurun. Elle yazılan sütunlar
   `node scripts/audit-urls.mjs` yeniden çalıştığında URL eşleşmesiyle korunur.
2. Sitemap'i iki konsola da bildirin:
   - Search Console → Dizin → Site haritaları → `https://kanitatlasi.com/sitemap.xml`
   - Bing → Site haritaları → aynı URL
3. İlk 14 gün boyunca gösterim/tıklama verisi toplanır; büyüme stratejisindeki
   başlangıç çizgisi bu veriden kurulur.

## Notlar

- `verification/` dizini şu anda boş olabilir; build bunu sessizce atlar.
  Dosya ekleyince `npm run check` zinciri etkilenmez (dizin izlenen yol değildir).
- Doğrulama dosyaları Vercel yayınında kök dizine düşer; URL değişmez.
