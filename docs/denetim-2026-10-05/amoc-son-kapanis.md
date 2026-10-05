# AMOC dosyası — kaynak ve hesap denetiminin kapanışı

Tarih: 5 Ekim 2026. Kapsam: AMOC yazısı, ona bağlı on bulgu, okuma özeti ve türetilmiş site çıktıları. Önceki kapanıştan sonra tamamlanan tam metin okumaları ve RAPID hesapları burada birleştirilir. Bu kayıt bütün iklim araştırmasını veya literatürü tamamladığımız anlamına gelmez. On bulgu da `review.status=draft`; bağımsız uzman incelemesi yapılmadı.

## Kapatılan site düzeltmeleri

- Gulf Stream, derin batı devrilme ölçüsü ve tam RAPID AMOC ayrıldı. Farklı dönemler ve eğilim işaretleri tek ölçüm gibi karşılaştırılmıyor.
- Baehr saptama sürelerinin model, gözlem hatası ve derinlik koşulları; IPCC güven ifadeleri; Baker'ın deney ve çöküş tanımları; erken uyarı tartışmasındaki kaynak sınırları gösterildi.
- Geçmiş taşınım vekili, model taşkını ve saha kaynaklı debi artışı birbirinin doğrudan ölçümü sayılmıyor. “Yeni buzul çağı”, tek güzergâh ve tek neden sonuçlarına gidilmiyor.
- Beş RAPID sürümünde aynı 2021 örnekleri karşılaştırıldı; eski ve güncel sürümün yıllık eğilimleri ayrıca hesaplandı. Lee 2024'ün eski eğilimleri bir ondalıkta yeniden üretildi.
- Girişteki 301 kelimelik kısa yanıt ve 419 kelimelik sınır metni kısaltıldı. Ayrıntılı okuma geçmişi bağlı kaynak notlarında korunuyor. Avrupa soğumasına ilişkin denetlenmemiş medya genellemesi kaldırıldı.

## Yıllık eğilim hesabı

Birincil veri: [BODC RAPID v2022.1](https://www.bodc.ac.uk/data/published_data_library/catalogue/10.5285/04c79ece-3186-349a-e063-6c86abc0158c/) ve [resmî RAPID v2024.1a](https://rapid.ac.uk/node/10). Sütun tanımı [RAPID README, s. 5–6](https://rapid.ac.uk/sites/default/files/rapid_data/README.pdf). Okunan dosya özetleri:

| Dosya | SHA-256 |
| --- | --- |
| v2022.1 `moc_transports_200404_2022215.ascii` | `619313d25295d4f1f492cd163904fa1a9fb6627c37b561978ec0638b807cc41b` |
| v2024.1a `moc_transports.ascii` | `847c169cba6b2461a2ca33870b7c06d6c9073ac389b333006abc6709437b08ac` |

Sütun 14 `moc_mar_hc10`, 12 saatlik ve 10 günlük alçak geçiren filtreli seridir. Her satırın sayısal biçimi, seri zamanının takvim zamanıyla eşleşmesi, yarım günlük artış, tam yıllardaki eksik/tekrarlı örnekler ve her yılın 730/732 örneği kontrol edilir. Eski ve güncel sürüm 2005–2021 için aynı **12.418 zaman damgasını** içerir. 2004 ve 2024 kısmi yılları kullanılmaz. Yıllık aritmetik ortalamalara, her yıla eşit ağırlıklı sabit terim ve yıl içeren OLS uygulanır. Yarım günlük örneklerin sayısı regresyonda bağımsız gözlem sayısı değildir.

| Takvim penceresi | Yıllık gözlem sayısı | v2022.1, Sv/on yıl | v2024.1a, Sv/on yıl |
| --- | ---: | ---: | ---: |
| 2005–2021 | 17 | −1,147715 | −0,640782 |
| 2007–2021 | 15 | −0,211840 | +0,218071 |
| 2011–2021 | 11 | −0,082712 | +0,000610 |
| 2011–2023 | 13 | — | −0,794514 |

v2022.1 sonuçları [Lee ve arkadaşları 2024, Introduction s. 2](https://repository.library.noaa.gov/view/noaa/66707/noaa_66707_DS1.pdf#page=2) içindeki −1,1/−0,2/−0,1 değerlerini bir ondalıkta yeniden üretir. Aynı giriş, güncellenmiş Florida kablo kaydıyla 2005–2021 yıllık eğiliminin yaklaşık %40 azalıp −0,6 Sv/on yıla indiğini bildirir. Güncel sürümün buradaki −0,640782 sonucu buna bir ondalıkta eşleşir; veri işleme adımlarının ayrı nedensel payı hesaplanmış değildir. Volkov 2024'ün Nisan 2004–Şubat 2022 mevsimselliği çıkarılmış ve iki yıllık filtrelenmiş hesabı farklı yöntem ve penceredir.

## Otokorelasyon duyarlılığı

Yıllık OLS artıklarına Bartlett HAC uygulanır. Bir ve iki yıllık gecikme önceden seçilen iki duyarlılık ayarıdır; sonuç en uygun görünen ayara göre seçilmez. `use_correction=True` ile n/(n−2) düzeltmesi, `use_t=True` ile n−2 serbestlik dereceli Student t kullanılır. Seçenekler [statsmodels'in resmî HAC belgesinde](https://www.statsmodels.org/stable/generated/statsmodels.regression.linear_model.RegressionResults.get_robustcov_results.html) açıklanır. Yazılım sürümleri: Python 3.12, numpy 2.5.3, scipy 1.16.3, statsmodels 0.14.5. Canlı belge 0.15.0 başlığını taşır; hesap bu sürümle yapıldı iddiasında bulunulmuyor.

Güncel v2024.1a, 2011–2023 için:

| HAC yıllık gecikmesi | Standart hata, Sv/on yıl | Yaklaşık %95 aralık, Sv/on yıl | İki yönlü p |
| --- | ---: | --- | ---: |
| 1 | 0,649043 | [−2,223049; +0,634021] | 0,246475 |
| 2 | 0,652043 | [−2,229650; +0,640623] | 0,248523 |

İki ayarda da sıfırdan farklı eğilim saptanmaz. **Bu, değişim olmadığını kanıtlamaz.** On üç yıllık örneklem için HAC aralıkları küçük örneklemli, yaklaşık duyarlılık hesaplarıdır. Doğrusal eğilim modeli, gecikme seçimi ve t yaklaşımı kendi yöntem seçimlerimizdir; bütün olası bağımlılık yapıları test edilmedi. Aralıklar sensör değişimi, ikame, boşluk doldurma ve veri sürümü belirsizliklerinin tamamını içermez; antropojenik/natürel bileşenleri veya çöküş tarihini hesaplamaz. Lee'nin model analizi yeniden üretilmiş değildir.

Hesap betiği: [audit-rapid-annual-trends.py](../../scripts/audit-rapid-annual-trends.py). OLS eğimi merkezlenmiş toplam formülüyle; HAC standart hatası elle hesaplanan Bartlett kovaryansı ile; güven aralığı ayrıca scipy t niceliğiyle statsmodels sonucuna karşı kontrol edilir. Hash, takvim, eksik örnek ve yayımlanmış yuvarlama eşleşmeleri başarısız olursa betik durur.

```powershell
$env:PYTHONPATH = (Resolve-Path '.vercel/amoc-trend-libs').Path
python scripts/audit-rapid-annual-trends.py .vercel/rapid-v2022.1-moc_transports.ascii .vercel/amoc-v2024.1a-moc_transports.ascii
```

Betik JSON içinde her tam yılın ortalamasını, örnek sayısını, eski/yeni pencerelerin OLS ve iki HAC sonuçlarını verir. Paketler geçici proje dizinine kuruldu; site derlemesinin bağımlılığı değiller. Tam hesap çıktısı yerelde `.vercel/amoc-final-20261005/annual-trends.json` içinde saklanır; buradaki tablo ve betik kamusal kayıttır. Önceki beş sürüm karşılaştırmasının hash ve CRC sınırları [RAPID bileşen denetiminde](amoc-rapid-bilesen-farki.md) bulunur.

## Özgün kod ve okuma sınırı

[Lee 2024, s. 11 Code availability](https://repository.library.noaa.gov/view/noaa/66707/noaa_66707_DS1.pdf#page=11), [NCL yazılımının genel indirme sayfasına](https://www.ncl.ucar.edu/Download) bağlantı verir. Bu bölümde çalışmaya özgü analiz betiği bağlantısı yoktur. Bu tespit başka bir yerde betik bulunmadığının kanıtı değildir. Yazarların özgün analiz kodu ve iklim modeli toplulukları çalıştırılmadı; dar yıllık eğilim yeniden hesabı bundan ayrı tutulur.

| On bağlı kaydın konusu | Kontrol edilen kapsam ve başlıca sınır |
| --- | --- |
| Gulf Stream ve AMOC | IPCC, Wharton 2024 ve Asbjørnsen–Årthun 2023 seçilmiş pasajları; bütün senaryo/bölgeler değil |
| Ölçüm ve saptama süresi | RAPID kılavuzu; Baehr 2008 PDF; Baehr 2007 yayımlı PDF, Tablo 1 ve §5–6; model yeniden koşulmadı |
| T26 ile tam kesit | Xing 2026 ilgili yöntem/sonuçlar; medya aktarım zinciri incelenmedi |
| IPCC ve çöküş tarihi | AR6 ve Ditlevsen yazar düzeltmesi; sonraki ön baskı statüsü açık; tarih modelleri yeniden çalıştırılmadı |
| Baker'ın çöküş tanımı | Baker 2025 düzeltmesi ve Sun–Thompson 2026 seçilmiş yayımlı pasajları; tam model yeniden üretimi yok |
| Alan içi tartışma | Worthington, Caesar, Chen–Tung, Boers ve Ben-Yami seçilmiş pasajları; Boers yanıtı yayıncı önizlemesiyle sınırlı |
| Geçmiş zayıflama | Bradtmiller, Ng, You ve He seçilmiş pasajları; ham karot/yaş modeli yeniden hesaplanmadı |
| Buzul döngüsü ölçeği | Hays 1976 özetinin tarihli kapsamı; buzul ritmi güncel uzlaşıya genişletilmedi |
| Genç Dryas güzergâhı | Carlson yazarca yüklenen yayımlı tam metin; Süfke, Condron–Winsor ve Norris seçilmiş metinleri; ham saha/kod yeniden üretimi yok |
| 2010 sonrası eğilim | Lee giriş/yöntem/kod erişimi; beş sürüm 2021 karşılaştırması; iki sürüm yıllık OLS/HAC hesabı; toplam hata ve insan etkisi ayrımı yok |

Tamamlanan okumaların ayrıntıları: [özgün Baehr/Gulf Stream](../denetim-2026-10-04/amoc-baehr-ve-gulf-ozgun-kaynak.md), [Baehr 2007 tam metin](amoc-baehr-tam-metin.md), [Caesar bağlantısı](amoc-caesar-baglanti.md), [Chen–Tung](../denetim-2026-10-04/amoc-chen-tung-yayimlanmis-metin.md), [Boers yanıtı](../denetim-2026-10-04/amoc-boers-yanit-karsilastirmasi.md), [Ben-Yami](../denetim-2026-10-04/amoc-ben-yami-belirsizlik.md), [Bradtmiller](../denetim-2026-10-04/amoc-bradtmiller-tam-metin.md), [Norris](../denetim-2026-10-04/amoc-norris-tam-metin.md), [Carlson yazar metni](amoc-carlson-yazar-metin.md), [kaynak konumları ve mekanizma](amoc-konum-ve-mekanizma.md).

Bu sınırlar bekleyen site hatası veya yapılmış uzman incelemesi değildir. Bilimsel açık sorular kayıtlarda kalır; eksik bir kaynak okunmuş, model koşulmuş veya uzman onayı alınmış gibi işaretlenmez.

## Yayın kabulü

Kaynak/veri doğrulaması, türetilmiş araçların yeniden üretimi, editoryal ve SEO testleri ayrı kontrol edilir: `npm run check`, `npm run build:site`, `npm run test:editorial`, `npm run test:seo`, `git diff --exit-code -- data/lastmod.json`. Yayınlanan commit için CI ve Vercel durumu, ardından 43 kanonik sayfa ile sitemap/robots/feed/veri dosyalarının yerel üretimle normalleştirilmiş tam gövde eşleşmesi kontrol edilir. Yerel geçiş, canlı yayın doğrulaması veya uzman incelemesi yerine geçmez.
