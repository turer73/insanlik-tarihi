# Tartışma Pilotu ve Bülten Kurulumu

Kodun yayın katmanı hazırdır; bu iki özelliği canlıya almak için aşağıdaki
yayıncı (insan) adımları gerekir. Adımlar tamamlanana kadar katkı formu gizlenir
ve GitHub Issues bağlantısı gösterilir; bülten RSS çağrısına düşer.

## 1. Tartışma pilotu (Vercel Function → GitHub Issues)

Katkı çağrısı 8 pilot yazıda görünür (`data/tartisma-pilotu.json`). Form ancak
aynı dosyada `aktif` değeri `true` yapıldığında açılır. Gönderim
`api/katki.mjs` sunucusuz fonksiyonuna gider; fonksiyon herkese açık bir
GitHub issue'su açar. E-posta toplanmaz.

1. **GitHub erişim belirteci oluştur:**
   - İnce ayarlı (fine-grained) belirteç kullanın ve yalnız
     `turer73/insanlik-tarihi` deposunu seçin.
   - Depo izni: yalnızca **Issues: Read and write**.
   - Süre: öneri 90 gün; süresi dolunca yenilenir.

2. **Vercel ortam değişkeni:**
   - Vercel → kanitatlasi projesi → Settings → Environment Variables
   - `GITHUB_TOKEN` = belirteç (Production + Preview)
   - İsteğe bağlı `KATKI_REPO` = varsayılan `turer73/insanlik-tarihi`

3. **Kötüye kullanım koruması:** `/api/katki` için bot doğrulaması ve istek
   sınırı eklenmeden `aktif` değerini açmayın. Honeypot tek başına yeterli
   koruma değildir.

4. **Etiket:** Repoda `okur-katkisi` etiketi oluştur
   (https://github.com/turer73/insanlik-tarihi/labels). Fonksiyon bu etiketi
   ekler; yoksa issue etiketsiz açılır (hata sayılmaz).

5. **Etkinleştirme ve deneme:** Ortam değişkenleri ile kötüye kullanım koruması
   doğrulandıktan sonra `data/tartisma-pilotu.json` içindeki `aktif` değerini
   `true` yapın ve deploy edin. Ardından bir pilot yazıda formu gönderin. Issue
   `[Okur katkısı] …` başlığıyla açılmalı.

6. **Moderasyon:** Issue'lar herkese açık kayıttır. Editör yanıtı aynı issue'da
   verilir; kabul edilen düzeltme yazıya işlenince `duzeltmeler.html` güncellenir
   ve issue kapatılır.

## 2. Bülten (Buttondown)

1. https://buttondown.com adresinde hesap açın, bülteni oluşturun
   (ücretsiz kademe yeterlidir).
2. Bültenin kullanıcı adını (`https://buttondown.com/...` adresindeki ad)
   `data/bulten.json` içindeki `username` alanına yazın:
   ```json
   { "provider": "buttondown", "username": "kanit-atlasi", ... }
   ```
3. `npm run build:site` — yazı sonlarındaki ve ana sayfadaki bloklar otomatik
   olarak kayıt formuna dönüşür (açılışta RSS çağrısı görünür).
4. İlk sayı hazır olana dek form yayında kalabilir; ilk sayıdan sonra bülten
   ritmi (Cuma: "Bir iddia · iki kanıt · bir açık soru") Buttondown üzerinden
   yönetilir.

## 3. Ölçüm

- Plausible goals kayıtlıdır: `Katkı Gönderimi` ve `Bülten Kaydı`.
- `Bülten Kaydı` olayı form gönderim denemesinde ateşlenir; abonelik tamamlama
  Buttondown panelinde doğrulanır (olay adı: abonelik dönüşümü değil, denemedir).
- Katkı hunisi: `Katkı Gönderimi` sayısı + GitHub'da `okur-katkisi` etiketli
  issue sayısı aynı grafiği tamamlar.

## 4. Yapılandırma yoksa ne olur?

- Pilot etkin değil: form gösterilmez; okur GitHub Issues bağlantısına yönelir.
- Pilot yanlışlıkla etkinleştirilir ama `GITHUB_TOKEN` yoksa sunucu `503` döner.
- `username` boş: bülten bloğu RSS çağrısıyla görünür.
- Bu durumlar testlerle güvence altındadır; site diğer özellikleriyle çalışır.
