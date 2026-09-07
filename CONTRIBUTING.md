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
