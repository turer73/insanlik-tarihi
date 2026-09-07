# İnsanlık Tarihi — Bulgu Veri Tabanı

Tarih, bilim, sanat ve teknoloji konularındaki Türkçe derin incelemeler için
kurulan araştırma ve yayın altyapısıdır. Depo iki katmanı birlikte tutar:

- `articles/`: yayımlanan anlatılar,
- `data/findings/`: anlatıların dayandığı yapılandırılmış bulgular.

İki katman `used_in` ve `data/articles.json` üzerinden birbirine bağlanır.
Kanonik kaynak Git deposudur; üretilen bundle ve HTML araçları çıktıdır.

## Temel ilke: kayıt bir gerçek değil, değerlendirilmiş bir iddiadır

Her kayıt tek ve test edilebilir bir iddiayı, o iddianın kanıt karşısındaki
durumunu ve sınırlılıklarını taşır.

| `status` | Anlamı |
|---|---|
| `established` | Geniş uzlaşı ve yeterli kanıt |
| `contested` | Uzmanlar arasında gerçek ve önemli görüş ayrılığı |
| `minority` | Literatürde yaşayan fakat ana akım olmayan hipotez |
| `refuted` | İleri sürülmüş ve kanıtla yanlışlanmış iddia |
| `unknown` | Soru açık; güçlü bir sonuç yok |
| `unmeasurable` | Mevcut yöntem soruyu yapısal olarak cevaplayamıyor |

`confidence`, iddianın olasılığı değil **sınıflandırma güvenidir**. Örneğin
`status: unknown` ve `confidence: high`, “bu sorunun bugün cevaplanamadığına
yüksek güven var” demektir.

## Popüler anlatı ile bilimsel durumun ayrılması

Bir kayıt gerekliyse şu iki alanı birlikte taşır:

- `popular_claim`: dolaşımdaki yaygın anlatı,
- `divergence`: bu anlatının bilimsel durumdan neden ayrıştığı.

`divergence_type`, sapma mekanizmasını sınıflar: eski çeviri, güncellenmemiş
bilgi, turizm kopyalaması, ideolojik seçim, medya abartısı, sömürge anlatısı,
kategori hatası, hayatta kalma yanlılığı ve provenans yokluğu.

## Kaynak katmanları

| `tier` | Kullanım |
|---|---|
| `primary` | Antik metin, yazıt, elyazması, kazı raporu, veri seti |
| `peer-reviewed` | Hakemli makale, kitap veya bölüm |
| `institutional` | Müze, üniversite, UNESCO ve benzeri kurum kaynağı |
| `popular` | Genel okur yayını; bilimsel iddianın tek dayanağı olamaz |
| `unreliable` | Turizm/içerik sitesi; yalnızca popüler iddianın dolaşımını belgeleyebilir |

Doğrulayıcı, yalnızca `popular` veya `unreliable` kaynaklara dayanan kaydı hata
sayar.

## Şema v2: kanıtı kaynağın belirli yerine bağlamak

Yeni ve göç edilmiş kayıtlar `schema_version: 2` kullanır. Her kaynak kalıcı bir
kimlik, her kanıt da bir veya daha fazla konumlu atıf taşır:

```json
{
  "schema_version": 2,
  "id": "ornek-bulgu",
  "claim": "Tek cümlelik test edilebilir iddia.",
  "status": "contested",
  "confidence": "medium",
  "topic": ["ornek"],
  "evidence": [
    {
      "id": "birinci-kanit",
      "text": "Kaynakta ölçülen veya bildirilen sonuç.",
      "citations": [
        {
          "source_ref": "yazar-2026-makale",
          "locator": "s. 12-14, Şekil 3",
          "support_type": "direct"
        }
      ]
    }
  ],
  "sources": [
    {
      "id": "yazar-2026-makale",
      "tier": "peer-reviewed",
      "type": "article",
      "authors": ["Yazar, Ad"],
      "year": 2026,
      "title": "Makale başlığı",
      "container": "Dergi",
      "doi": "10.xxxx/xxxxx"
    }
  ],
  "checked": "2026-09-07",
  "review": {
    "status": "draft"
  }
}
```

`support_type` değerleri:

| Değer | Anlamı |
|---|---|
| `direct` | Kaynak sonucu doğrudan ölçer veya açıkça bildirir |
| `inference` | Projenin kaynak verisinden yaptığı işaretlenmiş çıkarım |
| `context` | Arka plan sağlar; iddiayı tek başına kanıtlamaz |
| `claim-origin` | Popüler veya eski iddianın kökenini belgeler |
| `counter` | İddiaya karşı kanıt veya yayımlanmış itiraz |

Mevcut v1 kayıtlar çalışmaya devam eder. Göç, kaynak konumları gerçekten
doğrulanarak kayıt kayıt yapılır; düz metni otomatik olarak “atıflı” göstermeye
çalışan toplu bir dönüşüm kullanılmaz.

## İnceleme durumu

V2 kayıtları editoryal durum taşıyabilir:

- `draft`: kaynak zinciri kuruluyor veya uzman incelemesi bekleniyor,
- `editor-reviewed`: yapı, künye ve çıkarım zinciri kontrol edildi,
- `expert-reviewed`: konu uzmanı içerik incelemesi yaptı.

Bu alan, `status` ve `confidence` değerlerinden ayrıdır.

## Kurulum ve kalite kapısı

Node.js 18 veya üzeri yeterlidir; harici paket bağımlılığı yoktur.

```bash
npm run validate          # mevcut veri tabanı ve bütünlük kuralları
npm run validate:strict   # verilen bütün kayıtların v2 olmasını ister
npm run validate:example  # gerçek kaynaklı v2 örneği
npm test                  # araç uyumluluğu ve denetim şablonu testleri
npm run build             # bundle ve dist/ araçlarını üretir
npm run check             # CI ile aynı tam kalite kapısı
```

Doğrulayıcı şunları denetler:

- JSON şeması, kimlik biçimleri ve tekrarlar,
- kanıt → kaynak → konum referans bütünlüğü,
- DOI, URL ve gerçek takvim tarihi biçimleri,
- ters tarih aralıkları,
- `used_in` ve sürümleme bağlantıları,
- tartışmalı kayıtların karşı kanıtı,
- bibliyografik asgari alanlar,
- değişken kayıtların bayatlık süresi,
- v1’den v2’ye kalan göç borcu.

Her pull request’te GitHub Actions `npm run check` çalıştırır.

## Yayın araçları

`npm run build`, `tools/*.template.html` şablonlarından tek dosyalık HTML
çıktıları üretir:

- `dist/zaman-cizelgesi.html`: ölçekli kronoloji, yoğunluk ve eşzamanlılık görünümü,
- `dist/bulgu-veri-tabani.html`: arama ve çok boyutlu filtreleme,
- `dist/kanit-denetimi.html`: yalnızca v2 kayıtlarında kanıt, kaynak, konum ve
  inceleme zincirini gösteren editoryal denetim ekranı.

İlk iki araç geçiş sürecinde v1 ve v2 kayıtları birlikte gösterebilmek için
yayın kopyasında kanıtları okunabilir düz metne dönüştürür. Kanonik JSON
değişmez. `kanit-denetimi.html` ise doğrudan yapılandırılmış v2 verisini okur.

## Yıl gösterimi

Tarihsel yıllar işaretli tam sayıdır:

- negatif: MÖ,
- pozitif: MS,
- `0`: geçersizdir; tarihsel takvimde sıfır yılı kullanılmaz.

Örnek: MÖ 9500 → `-9500`.

## Dizin yapısı

| Yol | İçerik |
|---|---|
| `articles/` | Yazıların bağımsız HTML kaynakları |
| `data/findings/` | Konu bazlı kanonik bulgu dizileri |
| `data/articles.json` | Yazı slug, başlık, sıra ve URL kaydı |
| `schema/` | JSON Schema 2020-12 sözleşmesi |
| `scripts/` | Doğrulama, test, göç ve derleme araçları |
| `tools/` | Yayın aracı şablonları |
| `dist/` | Verisi gömülmüş yayımlanabilir HTML çıktıları |
| `examples/` | Gerçek kaynaklı şema v2 örnekleri |

Katkı ve editoryal kurallar için [`CONTRIBUTING.md`](CONTRIBUTING.md) dosyasına
bakın.
