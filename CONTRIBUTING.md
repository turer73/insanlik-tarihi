# Katkı ve editoryal çalışma düzeni

Bu depo bir “bilgi listesi” değil, **iddiaların kanıt karşısındaki durumunu** tutar. Yeni kayıt eklerken amaç güçlü bir cümle kurmak değil; başka bir kişinin aynı kaynakları açıp değerlendirmeyi yeniden denetleyebilmesini sağlamaktır.

## Değişiklikten önce

1. Kayıt kimliğini kalıcı kabul edin. Var olan `id` yanlışsa değiştirmeyin; yeni kayıt açıp `supersedes` / `superseded_by` ile bağlayın.
2. İddiayı tek cümlede ve test edilebilir biçimde yazın.
3. `established`, `contested`, `minority`, `refuted`, `unknown` ve `unmeasurable` durumlarını birbirinin yerine kullanmayın.
4. Popüler iddiayı yalnızca eleştirmekle kalmayın; sapmanın mekanizmasını `divergence` ve `divergence_type` ile açıklayın.

## Şema sürümü 2

Yeni kayıtlar `schema_version: 2` kullanmalıdır. Eski kayıtlar geçiş tamamlanana kadar sürüm 1 biçiminde okunmaya devam eder.

Sürüm 2 üç zorunluluk getirir:

- Her kaynak bulgu içinde benzersiz bir `sources[].id` taşır.
- `evidence` ve `counter_evidence` düz metin değil, kimlikli nesnelerdir.
- Her kanıt kalemi en az bir kaynağa ve o kaynak içindeki kesin konuma bağlanır.

Tam örnek: [`examples/finding.v2.json`](examples/finding.v2.json)

### Kaynak kimliği

Kaynak kimliği kısa, kalıcı ve bulgu içinde benzersiz olmalıdır:

```json
{
  "id": "clarke-2024-altar-stone",
  "tier": "peer-reviewed",
  "type": "article",
  "authors": ["Clarke, Anthony J. I."],
  "year": 2024,
  "title": "A Scottish provenance for the Altar Stone of Stonehenge",
  "container": "Nature",
  "doi": "10.1038/s41586-024-07652-1"
}
```

### Kanıt–kaynak bağlantısı

```json
{
  "id": "jeokimyasal-koken",
  "text": "Mineral tanelerinin yaş ve kimyası kuzeydoğu İskoçya kökenine işaret eder.",
  "citations": [
    {
      "source_ref": "clarke-2024-altar-stone",
      "locator": "Results; Fig. 3",
      "support_type": "direct"
    }
  ]
}
```

`locator` genel bir “makale” bağlantısı değil, denetlenebilir bir konum olmalıdır: sayfa, bölüm, satır, şekil, tablo, yazıt veya katalog numarası.

### Destek türleri

| Değer | Anlamı |
|---|---|
| `direct` | Kaynak iddiayı doğrudan ölçer veya açıkça bildirir. |
| `inference` | Proje, kaynak verilerinden açıkça işaretlenmiş bir çıkarım yapar. |
| `context` | Kaynak arka plan veya kronoloji sağlar; iddiayı tek başına kanıtlamaz. |
| `claim-origin` | Kaynak, popüler veya eski iddianın nereden çıktığını belgeler. |
| `counter` | Kaynak iddiaya karşı kanıt veya yayımlanmış itiraz sağlar. |

## Kaynak kalitesi

`peer-reviewed` etiketi tek başına yeterli değildir. Sürüm 2 doğrulayıcısı en az şu künyeleri ister:

- Hakemli makale: yazar, yıl, başlık, dergi ve DOI/URL.
- Kitap: yazar, yıl, başlık, yayınevi ve ISBN/URL.
- Kurumsal kaynak: kurum, tür ve yeniden bulunabilir URL veya yayınevi.
- Birincil metin: kullanılan edisyon ile bölüm/satır/katalog konumu.

Wikipedia, kurumsal kaynak değildir. Araştırmaya giriş veya terim bulma aracı olabilir; nihai dayanak olarak özgün yayına geçilmelidir.

## İnceleme durumu

Yeni kayıtlar mümkünse `review` alanı taşımalıdır:

```json
{
  "review": {
    "status": "editor-reviewed",
    "reviewed_by": ["editor-kimligi"],
    "reviewed_at": "2026-09-07",
    "notes": "Kaynak künyeleri ve kanıt bağlantıları kontrol edildi."
  }
}
```

- `draft`: araştırma sürüyor.
- `editor-reviewed`: yapı, kaynak künyesi ve çıkarım zinciri kontrol edildi.
- `expert-reviewed`: konu uzmanı içerik değerlendirmesi yaptı.

## Yeni kayıt yazmak

Yeni bulgular `scripts/lib/finding.mjs` kurucularıyla yazılır. Elle nesne
yazmayın: kurucu, doğrulayıcının bulacağı hataları veri **yazılırken** söyler —
bağlam hâlâ elinizdeyken, dosya işlendikten gün sonra değil.

```js
import { source, cite, ev, finding, commit } from "./lib/finding.mjs";

const kaynak = source("yazar-2020", {
  tier: "peer-reviewed", type: "article",
  authors: ["Yazar, Bir"], year: 2020,
  title: "Makale başlığı", container: "Dergi",
  doi: "10.1000/ornek",            // hakemli kaynakta DOI/URL/ISBN zorunlu
});

const kayit = finding({
  id: "bulgu-kimligi",
  claim: "Tek cümlelik iddia.",
  status: "contested",
  topic: ["konu"],
  checked: "2026-09-07",
  sources: [kaynak],
  evidence: [
    ev("Kanıt cümlesi.", cite("yazar-2020", "Özet, madde 2")),
  ],
  counter_evidence: [
    ev("Zayıflatan kanıt.", cite("yazar-2020", "s. 114", "counter")),
  ],
});

commit("data/findings/konu.json", [kayit]);
```

Kurucunun reddettiği şeyler:

| durum | sebep |
|---|---|
| `cite()` locator'sız | kaynağın neresini okuduğunuzu söyleyemiyorsanız o kanıt hazır değil |
| var olmayan kaynağa atıf | `source_ref`, kayıttaki bir `sources[].id` ile eşleşmeli |
| düz metin kanıt | sürüm 2'de kanıt `ev()` ile kurulur |
| hakemli kaynakta DOI/URL/ISBN yok | künyeyi doğrulayın, uydurmayın |
| kurumsal kaynakta `institution` yok | kurumu adlandırın |
| yalnızca `popular` / `unreliable` kaynak | iddianın bir çıpası olmalı |
| yinelenen kaynak veya kanıt kimliği | kimlikler kayıt içinde tekildir |

`review` verilmezse varsayılan `draft` olur — bu kasıtlıdır. Bir kaydın
incelendiğini söylemek ayrı bir iştir ve kendiliğinden olmaz.

### Göç hakkında

Sürüm 1 kayıtları toplu olarak çevrilmez. Sürüm 2 her kanıt için bir
**locator** ister; bütün kayıtlara locator uydurmak bu projenin varlık sebebine
aykırı olurdu. Göç kayıt kayıt, kaynağın gerçekten hangi kısmını okuduğumuzu
söyleyebildiğimiz yerde yapılır. Örnek: `scripts/migrate-mitoloji-v2.mjs`.

Locator özet düzeyindeyse (tam metin sayfası doğrulanmadıysa) bunu kaynağın
`note` alanına ve `review.notes` içine yazın. Belirsiz bir locator yazmak,
locator yazmamaktan kötüdür.

## Yerel kontrol

Node.js 18 veya üzeri yeterlidir; bağımlılık kurulumu gerekmez.

```bash
npm run validate          # mevcut veri tabanı
npm run validate:example  # şema v2 örneği, katı mod
npm run build             # doğrula ve dist/ üret
npm run check             # CI ile aynı tam kalite kapısı
```

`npm run check`, üretilen bundle ve `dist/` dosyalarının kaynak veriden yeniden üretilebildiğini de doğrular. Komut sonunda Git farkı kalıyorsa üretilmiş dosyalar bayattır; değişiklikle birlikte commit edilmelidir.

## Pull request kontrol listesi

- [ ] `npm run check` başarıyla tamamlandı.
- [ ] Yeni iddia tek cümle ve test edilebilir.
- [ ] Tartışmalı/azınlık görüşünde gerçek karşı kanıt var.
- [ ] Her sürüm 2 kanıtının kaynak ve konum bağlantısı var.
- [ ] Kaynak künyeleri yeniden bulunabilir.
- [ ] Popüler kaynaklar bilimsel iddianın tek dayanağı değil.
- [ ] `used_in` değerleri `data/articles.json` içinde mevcut.
- [ ] Değişken kayıtların `checked` tarihi güncel.
