# AMOC dosyası — masa başı kapanış denetimi

Tarih: 4 Ekim 2026. Kapsam: `articles/amoc.html` ve `data/findings/amoc.json` içindeki on bulgunun seçilmiş kaynak pasajları, yayın metni ve türetilmiş araç çıktıları. Bu, bütün literatürün veya ham verilerin yeniden üretimi değildir. On kayıt da `review.status=draft`; bağımsız uzman incelemesi yapılmadı.

## Son kaynak düzeltmeleri

- [Carlson ve arkadaşları 2007](https://pubmed.ncbi.nlm.nih.gov/17420461/) Şekil 3'te Genç Dryas öncesi akışı modelde 0,07 Sv ile başlatır. İlk +0,06 ± 0,02 Sv artış üç jeokimyasal tahminin ortalamasıdır; [PMC'de dizinlenen Discussion pasajı](https://pmc.ncbi.nlm.nih.gov/articles/PMC1871824/) bunun 2σ belirsizliği olduğunu belirtir. Makale, bulgu kanıtı ve okuma özeti bu ayrıntıyla eşlendi. Sonraki +0,06 ± 0,01 Sv ile toplam +0,12 ± 0,02 Sv artış, mutlak nehir debisinin doğrudan ölçümü diye sunulmadı. Erişim ve nedensellik sınırı [Carlson denetiminde](amoc-carlson-debi-artisi.md) kayıtlıdır.
- [Hays, Imbrie ve Shackleton 1976 özeti](https://pubmed.ncbi.nlm.nih.gov/17790893/) yaklaşık 100 bin yıllık bileşeni açıklamak için doğrusal olmayan yanıtın **gerekebileceğini** söyler. Yazıdaki güncel bilimsel uzlaşı yokluğu hükmü bu tarihli özetten çıkarılamayacağı için kaynakla sınırlı ifadeye çevrildi; aynı yerdeki dilbilgisi hatası düzeltildi.

## Kapanış kapsamı

- Gulf Stream ile AMOC'un ayrımı, RAPID gözlem süresi ve sürümleri, T26 ile tam kesit eğilimi, IPCC AR6'nın farklı güven ifadeleri, Baker modelindeki çöküş tanımları, erken uyarı tartışması, Heinrich Stadial 1 vekilleri, buzul döngüsü ölçeği, Genç Dryas güzergâhı ve Lee 2024'ün dönemsel eğilimi seçilmiş birincil kaynak pasajlarıyla karşılaştırıldı. Yayınlanmış ayrıntılı notlar: [Chen–Tung](amoc-chen-tung-yayimlanmis-metin.md), [Boers yanıtı](amoc-boers-yanit-karsilastirmasi.md), [Ben-Yami](amoc-ben-yami-belirsizlik.md), [Bradtmiller](amoc-bradtmiller-tam-metin.md) ve [Norris](amoc-norris-tam-metin.md). Diğer çalışma notlarının bir kısmı yerel denetim klasöründe tutulur; bu yayın commit'ine eklenmedi.
- RAPID v2022.1 ve v2024.1a'nın aynı 730 yarım günlük 2021 örneği karşılaştırıldı; 0,601742 Sv sürüm farkı doğrulandı. Bu farkın işlem nedeni, uzun dönemli eğilim, anlamlılık veya insan etkisi hesaplanmadı.
- Temiz aday kopyasında `npm run validate:strict`, `npm run build`, `npm run build:site`, `npm test`, `npm run test:editorial`, `npm run test:seo` ve `node scripts/audit-urls.mjs` geçti. Veri tabanında 208 kayıt, 1004 kanıt ve 1117 atıf var; AMOC'un 99 atfından 23'ü zayıf konumlu. Sıfır konumsuz atıf ve sıfır atıfsız kaynak var. SEO testi 43 kanonik sayfayı doğruladı.

## Açık doğrulama sınırı

Carlson 2007 ve Boers 2024'ün tam metinleri doğrudan okunamadı; Baehr özgün çalışmaları, Gulf Stream duyurusunun bağlı özgün makalesi, bütün ekler, ham karot/yaş modelleri ve tarafların kodları bütünüyle incelenmedi. Belirli medya haberlerinin aktarım zinciri ile güncel insan etkisi ve Avrupa için senaryoya bağlı soğuma miktarı hesaplanmadı. Bu sınırlar, metindeki dar kaynak karşılaştırmasını geçersiz kılmaz; fakat AMOC'un gelecekteki çöküş zamanı veya Genç Dryas'ın tek nedeni hakkında nihai hükme izin vermez. Uzman incelemesi gelmeden kayıtlar `reviewed` olarak işaretlenmemelidir.
