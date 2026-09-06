# İnsanlık Tarihi — Bulgu Veri Tabanı

Tarih, bilim, sanat ve teknoloji konularında özgün Türkçe derin incelemeler için kurulan
araştırma altyapısı. Bu depo **yazıları değil, yazıların dayandığı bulguları** tutar.

## Neden veri tabanı

Yazılar bulgulara `id` ile atıf yapar. Bir bulgunun durumu değiştiğinde
(`status` güncellenir, yeni kaynak çıkar, iddia çürütülür) `used_in` alanı
**hangi yazıların güncellenmesi gerektiğini** söyler. Bu olmadan büyüyen bir
içerik sitesi sessizce çürür — 2024'te değişen bir bulgu 2022'de yazılmış
yazıda yanlış hâliyle kalır.

## Birim: iddia, gerçek değil

Bu veri tabanının kaydı bir "gerçek" değil, **bir iddianın kanıt karşısındaki
durumu**dur. Bu yüzden `status` alanı doğru/yanlış ikilisi değil:

| status | anlamı |
|---|---|
| `established` | Geniş uzlaşı, birden çok bağımsız kanıt hattı |
| `contested` | Ciddi uzmanlar anlaşamıyor, kanıt gerçekten bölüyor |
| `minority` | Gerçek bir hipotez ama ana akım değil |
| `refuted` | İddia edildi, yanlışlandı |
| `unknown` | Soru açık, güçlü bir konum yok |
| `unmeasurable` | **Yöntem yapısal olarak cevap veremiyor** |

`unmeasurable` bu projeye özgüdür ve "nasıl biliyoruz" omurgasını şemaya gömer.
Örnekler: Kapadokya yer altı şehirleri (kayaya oymada stratigrafi yoktur),
Etemenanki'nin yüksekliği (yapı yok edildi, yeni ölçüm imkânsız).

## Ayırt edici alan: `popular_claim` + `divergence`

Her kayıt, varsa popüler kaynaklardaki hâlini ve **neden saptığını** taşır.
`divergence_type` sapmanın mekanizmasını sınıflar: `eski-ceviri`,
`guncellenmemis`, `turizm-kopyalamasi`, `ideolojik-secim`, `medya-abartisi`,
`somurge-anlatisi`, `kategori-hatasi`, `hayatta-kalma-yanliligi`,
`provenans-yoklugu`.

Zamanla bu alan kendi başına bir bulgu üretir: Türkçe popüler tarih içeriğinde
en sık hangi mekanizmayla sapılıyor.

## Kaynak katmanları

| tier | ne | kural |
|---|---|---|
| `primary` | Antik metin, kazı raporu, edisyon, veri seti | — |
| `peer-reviewed` | Hakemli yayın | — |
| `institutional` | UNESCO, müze, üniversite duyurusu | — |
| `popular` | Medya | **Tek dayanak olamaz** |
| `unreliable` | Turizm / içerik sitesi | **İddianın kanıtı sayılmaz** |

`unreliable` kaydediliyor çünkü `popular_claim`'in *kendisinin* kanıtı o.
Turizm sitesi "Babil Kulesi 91 metreydi" diyorsa, bu iddianın doğruluğunun
değil, **popüler hâlin ne olduğunun** belgesidir.

Doğrulayıcı, yalnızca `popular`/`unreliable` kaynağa dayanan kaydı **hata**
sayar.

## Yapı

```
schema/finding.schema.json   Şema (JSON Schema 2020-12)
data/findings/*.json         Bulgular, konuya göre gruplanmış diziler
scripts/validate.mjs         Doğrulama + bütünlük raporu (bağımlılık yok)
```

Kaynak doğrusu **git'tir**, veri tabanı değil. Sebebi: bir bulgunun durumu
değiştiğinde git geçmişi *ne zaman ve neden* değiştiğini saklar. SQL'de
`UPDATE` bunu siler. İleride site araması için D1'e senkronlanabilir, ama
kanonik kaynak burası kalır.

## Kullanım

```bash
node scripts/validate.mjs
```

Şema uyumu, kimlik çakışması, referans bütünlüğü ve içerik kurallarını denetler;
ayrıca alan doldurma oranı raporu verir.

**İçerik kuralları (uyarı üretir):**
- `contested` / `minority` ise `counter_evidence` zorunlu — tek taraflı kayıt işe yaramaz
- `popular_claim` varsa `divergence` zorunlu — "yanlış" demek yetmez, mekanizma gerekir
- `volatile` kayıt 180 günden eskiyse yeniden kontrol uyarısı

## Yıl gösterimi

İşaretli tam sayı: negatif = MÖ, pozitif = MS. **Sıfır yılı yoktur** —
doğrulayıcı `0` girilirse hata verir. MÖ 9500 → `-9500`.

## Bilinen eksik

`olu-deniz`, `tufan`, `felaketler` ve `babil` dosyaları şemanın ilk sürümünde
yazıldı; `subject`, `period`, `people`, `languages`, `coordinates` alanları
henüz doldurulmadı. Doğrulayıcının "alan doldurma oranı" raporu bu borcu
gösterir. Kayıtlar geçerli ama **zengin değil**.
