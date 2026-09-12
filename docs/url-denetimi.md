# URL Denetim Tablosu

Bu tablo sitemap'teki bütün URL'leri tek tek izler. **Betik tarafından üretilir** (`node scripts/audit-urls.mjs`).

- **İlk yayın / Son değişiklik:** git geçmişinden üretilir; derleme günü değil, gerçek içerik tarihidir.
- **Açıklama:** makalenin `<meta name="description">` içeriği.
- **İndeks:** Google Search Console **URL Inspection** cevabından gelir — tahmin değil, ölçüm. Anlık görüntü `data/gsc-index.json`; tazelemek için `node scripts/fetch-gsc.mjs`. Anlık görüntü yoksa sütun boş kalır.
- **Not:** elle doldurulur ve yeniden üretimde URL eşleşmesiyle **korunur**.

| No | Yazı | URL | Meta başlık | Açıklama | Kategori | İlk yayın | Son değişiklik | İndeks | Not |
|---|---|---|---|---|---|---|---|---|---|
| — | [Ana sayfa (arşiv)](https://kanitatlasi.com/) | Kanıt Atlası — İnsanlık Tarihi Araştırma Arşivi | Geçmişi değil, kanıtı izleyin. Arkeoloji, tarih, bilim ve inanç üzerine kaynak odaklı araştırma dosyaları. | — | 2026-09-07 | 2026-09-12 | evet · 2026-09-07 |  |
| 01 | [Ölü Deniz Parşömenleri](https://kanitatlasi.com/articles/olu-deniz-parsomenleri.html) | Ölü Deniz Parşömenleri — Kanıt Atlası | Metinlerin keşfi, tarihlendirilmesi ve tarihsel bağlamına dair kanıt odaklı inceleme. | Metin & İnanç | 2026-09-07 | 2026-09-12 | bilinmiyor |  |
| 02 | [Tufan Bilmecesi](https://kanitatlasi.com/articles/tufan-bilmecesi.html) | Tufan Bilmecesi — Kanıt Atlası | Tufan anlatılarını jeoloji, arkeoloji ve metin tarihiyle sınayan karşılaştırmalı dosya. | İklim & Felaket | 2026-09-07 | 2026-09-12 | bilinmiyor |  |
| 03 | [Hatırlamadığımız Felaketler](https://kanitatlasi.com/articles/hatirlamadigimiz-felaketler.html) | Hatırlamadığımız Felaketler — Kanıt Atlası | Toplumsal hafızanın büyük afetleri nasıl seçip unuttuğunu araştıran dosya. | İklim & Felaket | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 04 | [Babil](https://kanitatlasi.com/articles/babil.html) | Babil: Şehir ve Sembol — Kanıt Atlası | Kentin arkeolojik gerçekliği ile yüzyıllar içinde büyüyen sembolik Babil anlatısını ayırır. | Arkeoloji & Kentler | 2026-09-07 | 2026-09-12 | evet · 2026-09-07 |  |
| 05 | [Aynı Cümlede Anılanlar](https://kanitatlasi.com/articles/ayni-cumlede.html) | Aynı Cümlede Anılanlar — Kanıt Atlası | Farklı dönem ve coğrafyaları tek cümlede buluşturan benzerlik iddialarını test eder. | Yöntem & Tarihyazımı | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 06 | [Petra](https://kanitatlasi.com/articles/petra.html) | Petra: Görünmeyen Şehir — Kanıt Atlası | Petra'nın görünen anıtlarının ötesindeki su, ticaret ve kent altyapısını inceler. | Arkeoloji & Kentler | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 07 | [Şuşter](https://kanitatlasi.com/articles/shushtar.html) | Şuşter: Aktarımın Kanıtı — Kanıt Atlası | Antik hidrolik sistemlerde bilgi ve teknoloji aktarımının izini sürer. | Bilim & Teknoloji | 2026-09-07 | 2026-09-12 | tarandı, eklenmedi |  |
| 08 | [Stonehenge](https://kanitatlasi.com/articles/stonehenge.html) | Stonehenge: Taşın Yolu — Kanıt Atlası | Taşların kökeni, taşınması ve yapının işlevi üzerine güncel kanıtları karşılaştırır. | Arkeoloji & Kentler | 2026-09-07 | 2026-09-12 | bilinmiyor |  |
| 09 | [Sümer](https://kanitatlasi.com/articles/sumer.html) | Sümer: Kilden Çıkan Arşiv — Kanıt Atlası | Kil tablet arşivlerinin kurumları, ekonomiyi ve gündelik hayatı nasıl görünür kıldığını anlatır. | Metin & İnanç | 2026-09-07 | 2026-09-12 | tarandı, eklenmedi |  |
| 10 | [Angkor](https://kanitatlasi.com/articles/angkor.html) | Angkor: Çöküş Anlatısının Çöküşü — Kanıt Atlası | Çöküş efsanesini LiDAR, su yönetimi ve uzun süreli dönüşüm verileriyle yeniden değerlendirir. | Arkeoloji & Kentler | 2026-09-07 | 2026-09-12 | evet · 2026-09-08 |  |
| 11 | [Taş Tepeler](https://kanitatlasi.com/articles/tas-tepeler.html) | Taş Tepeler: Yüzde Beş — Kanıt Atlası | Kazılmış küçük bölümden bütün bir kültürel manzara hakkında ne söylenebileceğini sorgular. | Arkeoloji & Kentler | 2026-09-07 | 2026-09-12 | bilinmiyor |  |
| 12 | [Machu Picchu](https://kanitatlasi.com/articles/machu-picchu.html) | Machu Picchu: Dört Yanlış — Kanıt Atlası | Ad, keşif, işlev ve terk edilme hakkındaki yaygın dört anlatıyı kanıtla karşılaştırır. | Arkeoloji & Kentler | 2026-09-07 | 2026-09-12 | bilinmiyor |  |
| 13 | [Chichén Itzá](https://kanitatlasi.com/articles/chichen-itza.html) | Chichén Itzá: Test Edilebilen ve Edilemeyen — Kanıt Atlası | Akustik, astronomi ve ritüel iddialarını test edilebilirlik sınırında inceler. | Arkeoloji & Kentler | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 14 | [Kapadokya](https://kanitatlasi.com/articles/kapadokya.html) | Kapadokya: Ölçülmemiş Harika — Kanıt Atlası | Yeraltı kentleri ve ölçek iddialarında ölçülmüş olanla varsayılanı ayırır. | Arkeoloji & Kentler | 2026-09-07 | 2026-09-12 | evet · 2026-09-08 |  |
| 15 | [Persepolis](https://kanitatlasi.com/articles/persepolis.html) | Persepolis: Arşiv Konuşunca — Kanıt Atlası | İmparatorluk merkezini saray kabartmalarından çok idari arşivler üzerinden okur. | Metin & İnanç | 2026-09-07 | 2026-09-12 | evet · 2026-09-08 |  |
| 16 | [İskenderiye](https://kanitatlasi.com/articles/iskenderiye.html) | İskenderiye: Yanmadı, Kopyalanmadı — Kanıt Atlası | Kütüphanenin tek bir yangınla yok olduğu anlatısını kaynak zinciri üzerinden sorgular. | Metin & İnanç | 2026-09-07 | 2026-09-12 | evet · 2026-09-08 |  |
| 17 | [Milanković Döngüleri](https://kanitatlasi.com/articles/milankovic.html) | Milanković Döngüleri — Kanıt Atlası | Yörüngesel döngüler ile buzul çağları arasındaki ilişkinin gücünü ve açık problemlerini inceler. | Bilim & Teknoloji | 2026-09-07 | 2026-09-12 | evet · 2026-09-08 |  |
| 18 | [Roma](https://kanitatlasi.com/articles/roma-etki.html) | Roma: Bakılan Miras — Kanıt Atlası | Roma'nın etkisini yalnız aktardıklarıyla değil, modern seçme ve bakma biçimleriyle tartışır. | Yöntem & Tarihyazımı | 2026-09-07 | 2026-09-12 | bilinmiyor |  |
| 19 | [Hristiyanlık ve Roma](https://kanitatlasi.com/articles/roma-hristiyanlik.html) | Hristiyanlık ve Roma: Kim Kimi Dönüştürdü — Kanıt Atlası | İki yönlü dönüşümün kurumlar, ritüeller ve siyasi düzen üzerindeki izlerini değerlendirir. | Metin & İnanç | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 20 | [Kanıt Ne Kadar Uzakta](https://kanitatlasi.com/articles/isa-tarihsellik.html) | Kanıt Ne Kadar Uzakta — Kanıt Atlası | Tarihsel İsa tartışmasında olay, metin ve kopyalar arasındaki zaman mesafesini ölçer. | Metin & İnanç | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 21 | [Mit ve Sicil](https://kanitatlasi.com/articles/mit-ve-sicil.html) | Mit ve Sicil — Kanıt Atlası | Mitolojik anlatı ile tarihsel kaydın nerede ayrılıp nerede kesiştiğini yöntemsel olarak inceler. | Yöntem & Tarihyazımı | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 22 | [Gökteki Ayı](https://kanitatlasi.com/articles/gokteki-ayi.html) | Gökteki Ayı — Kanıt Atlası | Gökyüzü anlatılarının kültürler arasında ortak köken mi bağımsız benzerlik mi olduğunu sorgular. | Metin & İnanç | 2026-09-07 | 2026-09-12 | bilinmiyor |  |
| 23 | [Geç Kalan Haberci](https://kanitatlasi.com/articles/gec-kalan-haberci.html) | Geç Kalan Haberci — Kanıt Atlası | Bir olaydan yıllar sonra yazılan kaynakların neyi kanıtlayıp neyi kanıtlayamayacağını inceler. | Yöntem & Tarihyazımı | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 24 | [Kendi Kanıtı](https://kanitatlasi.com/articles/kendi-kaniti.html) | Kendi Kanıtı — Kanıt Atlası | Bir iddianın kendi anlatısını kanıt olarak kullanmasının yarattığı döngüsel akıl yürütmeyi çözümler. | Yöntem & Tarihyazımı | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 25 | [Çalınan Ateş](https://kanitatlasi.com/articles/calinan-ates.html) | Çalınan Ateş — Kanıt Atlası | Prometheus, Māui ve Kuzgun anlatılarındaki ateş hırsızlığı motifini ortak köken ile zorunlu benzerlik arasında sınar. | Metin & İnanç | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 26 | [Herkesin Saati](https://kanitatlasi.com/articles/herkesin-saati.html) | Herkesin Saati — Kanıt Atlası | Ülker'in tarım takvimindeki rolünü Hesiodos'tan And Dağları'na, modern uydu verileriyle birlikte inceler. | Bilim & Teknoloji | 2026-09-07 | 2026-09-12 | bilinmiyor |  |
| 27 | [Yılın İki Kapısı](https://kanitatlasi.com/articles/yilin-iki-kapisi.html) | Yılın İki Kapısı — Kanıt Atlası | Anadolu halk takvimindeki 6 Mayıs ve 8 Kasım eşiklerini gökyüzü, mevsim ve yerel gelenek katmanlarıyla çözümler. | Bilim & Teknoloji | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| 28 | [Piramit Santrali](https://kanitatlasi.com/articles/piramit-santrali.html) | Piramit Santrali: Ampul, Pil ve Sfenks Efsaneleri — Kanıt Atlası | Dendera ampulü, Bağdat pili ve piramit santrali iddialarını Sfenks efsaneleriyle birlikte kaynak zinciri üzerinden denetler. | Yöntem & Tarihyazımı | 2026-09-09 | 2026-09-12 |  |  |
| 29 | [Uruk](https://kanitatlasi.com/articles/uruk.html) | Uruk: İlk Şehir mi, İlk Efsane mi? — Kanıt Atlası | Uruk'un kentleşme, yazı, ekonomi ve uzak ağlardaki rolünü; Gilgameş, Enmerkar, Erech ve modern sahte tarih iddialarından ayıran kanıt odaklı | Arkeoloji & Kentler | 2026-09-10 | 2026-09-12 |  |  |
| A1 | [Ölçekli Zaman Çizelgesi](https://kanitatlasi.com/dist/zaman-cizelgesi.html) | Zaman Çizelgesi — Kanıt Atlası | Bulguları tarih ekseninde gösteren araç. | Araç | 2026-09-07 | 2026-09-12 | bilinmiyor |  |
| A2 | [Bulgu Veri Tabanı](https://kanitatlasi.com/dist/bulgu-veri-tabani.html) | Bulgu Veri Tabanı — Kanıt Atlası | İddia, kanıt, karşı kanıt ve kaynak kayıtlarının aranabilir tablosu. | Araç | 2026-09-07 | 2026-09-12 | keşfedildi, taranmadı |  |
| A3 | [Kanıt Denetimi](https://kanitatlasi.com/dist/kanit-denetimi.html) | Kanıt Denetimi — Kanıt Atlası | Bulguların statü ve inceleme durumunun denetim görünümü. | Araç | 2026-09-07 | 2026-09-12 | bilinmiyor |  |
| K0 | [Konu Merkezleri](https://kanitatlasi.com/konular.html) | Konu Merkezleri — Kanıt Atlası | Kayıp şehirler, mitler, dinler tarihi ve iklim-uygarlık dosya kümeleri. | Merkez | 2026-09-09 | 2026-09-10 | bilinmiyor |  |
| K1 | [Kentler, Yapılar ve Uygarlıklar](https://kanitatlasi.com/konular/kayip-sehirler.html) | Kentler, Yapılar ve Uygarlıklar — Konu Merkezi — Kanıt Atlası | Petra'dan Angkor'a, tarihsel yerleşimlerin, yapıların ve onları çevreleyen anlatıların kanıt izi. | Merkez | 2026-09-09 | 2026-09-10 | bilinmiyor |  |
| K2 | [Mitler ve Ortak Anlatılar](https://kanitatlasi.com/konular/mitler-anlatilar.html) | Mitler ve Ortak Anlatılar — Konu Merkezi — Kanıt Atlası | Tufandan ateşin çalınmasına: aynı anlatıların farklı kültürlerde belirmesinin kanıtı ve sınırı. | Merkez | 2026-09-09 | 2026-09-10 | bilinmiyor |  |
| K3 | [Dinler Tarihinin Kanıtları](https://kanitatlasi.com/konular/dinler-tarihi.html) | Dinler Tarihinin Kanıtları — Konu Merkezi — Kanıt Atlası | Kutsal metinler, kopyalar ve kayıtlar: inanç iddialarını tarihsel kanıtla ayıran dosyalar. | Merkez | 2026-09-09 | 2026-09-10 | bilinmiyor |  |
| K4 | [İklim ve Uygarlık](https://kanitatlasi.com/konular/iklim-uygarlik.html) | İklim ve Uygarlık — Konu Merkezi — Kanıt Atlası | Buzul çağlarından tarım takvimlerine: iklimin uygarlıkları nasıl şekillendirdiği ve nasıl şekillendirmediği. | Merkez | 2026-09-09 | 2026-09-10 | bilinmiyor |  |
| S1 | [Hakkında ve Yöntem](https://kanitatlasi.com/hakkinda.html) | Hakkında ve Yöntem — Kanıt Atlası | Kanıt Atlası yayın kimliği, araştırma yöntemi, inceleme durumu, düzeltme süreci ve lisans bilgisi. | Sayfa | 2026-09-08 | 2026-09-09 | bilinmiyor |  |
| S2 | [Düzeltme Günlüğü](https://kanitatlasi.com/duzeltmeler.html) | Düzeltme Günlüğü — Kanıt Atlası | Kanıt Atlası içerik düzeltmelerinin açık günlüğü. | Sayfa | 2026-09-08 | 2026-09-09 | bilinmiyor |  |
| S3 | [Yeniden Yayımlama Kiti](https://kanitatlasi.com/yeniden-yayin.html) | Yeniden Yayımlama Kiti — Kanıt Atlası | CC BY 4.0 lisansı altında içeriğin yeniden yayımlanma koşulları ve atıf biçimi. | Sayfa | 2026-09-09 | 2026-09-09 | bilinmiyor |  |

## İndeks sütunu nasıl tazelenir?

```
node scripts/fetch-gsc.mjs     # Search Console'a sorar, data/gsc-index.json yazar
node scripts/audit-urls.mjs    # tabloyu yeniden üretir
```

Sorgu `sc-domain:kanitatlasi.com` mülkü üzerinden, **salt okunur** yetkiyle yapılır.
Değerlerin anlamı:

| Değer | Ne demek |
|---|---|
| `evet · TARİH` | Dizine eklendi; tarih son tarama günü |
| `keşfedildi, taranmadı` | Google URL'yi biliyor ama henüz taramadı — **bekleme, sorun değil** |
| `tarandı, eklenmedi` | Tarandı ama dizine alınmadı — sebebi `Not` sütununa yazılmalı |
| `bilinmiyor` | Google'ın haberi yok; sitemap henüz yeniden okunmamış olabilir |
| (boş) | Anlık görüntü yok ya da bu URL ölçülmedi |

`Not` sütunu elle yazılır ve yeniden üretimde kaybolmaz.
