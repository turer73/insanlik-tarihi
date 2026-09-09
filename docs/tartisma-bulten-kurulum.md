# Tartışma Pilotu ve Bülten Kurulumu

Kod hazır; bu iki özelliği canlıya almak için aşağıdaki yayıncı (insan)
adımları gerekir. Adımlar tamamlanana kadar formlar güvenli biçimde yedek
davranış gösterir (katkı formu hata mesajı, bülten RSS çağrısı).

## 1. Tartışma pilotu (Vercel Function → GitHub Issues)

Katkı formu, 8 pilot yazıda görünür (`data/tartisma-pilotu.json`). Gönderim
`api/katki.mjs` sunucusuz fonksiyonuna gider; fonksiyon herkese açık bir
GitHub issue'su açar. E-posta toplanmaz.

1. **GitHub erişim belirteci oluştur:**
   - https://github.com/settings/tokens → *Generate new token (classic)*
   - Kapsam: yalnızca **`public_repo`** (başka hiçbir kapsam gerekmez)
   - Süre: öneri 90 gün; süresi dolunca yenilenir.

2. **Vercel ortam değişkeni:**
   - Vercel → kanitatlasi projesi → Settings → Environment Variables
   - `GITHUB_TOKEN` = belirteç (Production + Preview)
   - İsteğe bağlı `KATKI_REPO` = varsayılan `turer73/insanlik-tarihi`

3. **Etiket:** Repoda `okur-katkisi` etiketi oluştur
   (https://github.com/turer73/insanlik-tarihi/labels). Fonksiyon bu etiketi
   ekler; yoksa issue etiketsiz açılır (hata sayılmaz).

4. **Deneme:** Deploy sonrası bir pilot yazıda formu gönderin. Issue
   `[Okur katkısı] …` başlığıyla açılmalı.

5. **Moderasyon:** Issue'lar herkese açık kayıttır. Editör yanıtı aynı issue'da
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

- `GITHUB_TOKEN` yok: form sunucuda `503` döner, kullanıcıya
  "Form arka ucu henüz yapılandırılmadı" iletisi gösterilir.
- `username` boş: bülten bloğu RSS çağrısıyla görünür.
- Bu durumlar testlerle güvence altındadır; site diğer özellikleriyle çalışır.
