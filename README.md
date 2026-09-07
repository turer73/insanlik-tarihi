# İnsanlık Tarihi — Bulgu Veri Tabanı

Tarih, bilim, sanat ve teknoloji konularında özgün Türkçe derin incelemeler için kurulan
araştırma altyapısı. Depo iki şeyi birlikte tutar: **yayımlanan yazılar** (`articles/`)
ve **yazıların dayandığı bulgular** (`data/findings/`). İkisi `used_in` / `articles.json`
üzerinden birbirine bağlıdır.

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

## Doldurma durumu

`scripts/enrich-2026-09.mjs` ile ilk sürümde yazılmış 38 kayda 179 alan eklendi.
Güncel doldurma oranı (doğrulayıcı raporundan):

| alan | oran |
|---|---|
| `period` | %100 |
| `disciplines` | %100 |
| `subject` | %85 |
| `people` | %74 |
| `divergence_type` | %66 |
| `languages` | %64 |

Boş kalanlar çoğunlukla yer/dil bağı olmayan yöntem ve bilim-sosyolojisi
kayıtları; oraya zorla veri koymak yanlış olur.

`counter_evidence` %42'de — doğrulayıcı bunu yalnızca `contested` ve `minority`
kayıtlar için zorunlu tutuyor, `established` kayıtlarda boş olması normaldir.

## Araçlar

```bash
node scripts/build-tools.mjs [cikti-dizini]
```

`tools/*.template.html` şablonlarına `data/findings.bundle.json` verisini gömüp
yayına hazır tek dosyalık HTML üretir. Şablonlarda `__DATA__` yer tutucusu bulunur.

- **zaman-cizelgesi.html** — her bulgu, `period.earliest`–`period.latest` aralığı
  boyunca ölçekli bir çubuk. Üç ölçek (Uygarlıklar / İnsan / Derin zaman),
  kronolojik-bölge-durum sıralaması, yoğunluk histogramı. Log ölçek seçildiğinde
  yakın geçmişi şişirdiği uyarısı gösterilir.
  - **Çubuğa tıkla** → bulgu ayrıntısı + `used_in` üzerinden yazı bağlantıları.
  - **Çubuk dışına tıkla** → dikey kılavuz kilitlenir, o tarihte aktif olmayan
    satırlar soluklaşır ve çakışan bulgular listelenir. `Esc` kaldırır.
  - Yazı bağlantıları `data/articles.json` dosyasından gelir; şablona
    `__ARTICLES__` yer tutucusuyla gömülür. Yeni yazı yayımlandığında bu dosyaya
    slug + URL eklenmelidir, yoksa bulgu "henüz bir yazıda kullanılmadı" görünür.
- **bulgu-veri-tabani.html** — kayıt tarayıcı; durum, disiplin, bölge, sapma türü
  ve kaynak katmanına göre filtreleme.

İkisi de veri tabanından üretilir; yeni bulgu eklendiğinde yeniden çalıştırmak yeter.

## Dizin yapısı

| yol | içerik |
|---|---|
| `articles/` | Yayımlanan yazıların HTML kaynağı (tek dosya, bağımsız çalışır) |
| `data/findings/` | Konu bazlı bulgu dosyaları — veri tabanının kendisi |
| `data/articles.json` | slug → başlık/URL/sıra kaydı |
| `schema/` | `finding.schema.json` — kaydın sözleşmesi (JSON Schema 2020-12) |
| `scripts/` | `validate.mjs` (bağımlılıksız doğrulayıcı), `build-tools.mjs`, tek seferlik göç betikleri |
| `tools/` | Zaman çizelgesi ve bulgu tarayıcısının şablonları (`__DATA__` yer tutuculu) |
| `dist/` | Şablonlara veri enjekte edilmiş, yayımlanabilir hâl |

## Çalıştırma

Bağımlılık yok, kurulum yok. Node 18+ yeterli.

```bash
node scripts/validate.mjs      # şema + gönderme bütünlüğü + içerik kuralları
node scripts/build-tools.mjs   # dist/ altına iki aracı üretir
```

Doğrulayıcı yalnızca şemaya bakmaz; **içerik kurallarını** da uygular:
`contested`/`minority` bir kaydın `counter_evidence` alanı boşsa uyarır,
`popular_claim` varsa `divergence` ister ve yalnızca `popular`/`unreliable`
kaynağa dayanan bir kaydı **hata** sayar — iddianın bir çıpası olmalıdır.

## Neden git, neden SQL değil

Bir bulgunun `status` alanı değiştiğinde önemli olan yeni değer değil,
**değişmiş olması**. `UPDATE` bu tarihi siler; commit tutar. Kayıt sayısı
SQL gerektirecek mertebede değil ve muhtemelen hiç olmayacak.
