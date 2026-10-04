# RAPID 2021 sürüm farkı: bileşen denetimi

**Tarih:** 5 Ekim 2026. Karşılaştırma yalnız 2021'in aynı 730 yarım günlük zaman damgası içindir; yeni bir eğilim veya atıf analizi değildir.

## Girdi ve yeniden üretim

- [BODC v2022.1 arşivi](https://www.bodc.ac.uk/data/published_data_library/catalogue/10.5285/04c79ece-3186-349a-e063-6c86abc0158c/): `moc_transports_200404_2022215.ascii`, SHA-256 `619313d25295d4f1f492cd163904fa1a9fb6627c37b561978ec0638b807cc41b`.
- [RAPID v2024.1a](https://rapid.ac.uk/node/10): `moc_transports.ascii`, SHA-256 `847c169cba6b2461a2ca33870b7c06d6c9073ac389b333006abc6709437b08ac`.
- Her iki sürümün kılavuzunda sütun 11 `t_gs10` (Florida Boğazı), 12 `t_ek10` (Ekman), 13 `t_umo10` (üst okyanus), 14 `moc_mar_hc10` (AMOC); değerler 10 günlük alçak geçiren filtreli, 12 saat aralıklıdır. Yeni [RAPID README](https://rapid.ac.uk/sites/default/files/rapid_data/README.pdf) s. 5–6 sütunları ve yöntemi açıklar. Eski arşivin `moc_transports_supporting_information_2022.pdf` dosyası s. 4 sütun sırasını doğrular.
- Tekrarlanabilir komut: `node scripts/audit-rapid-release-compare.mjs OLD.ascii CURRENT.ascii`. Betik iki SHA-256 değerini ve zaman damgalarının bire bir eşleşmesini kontrol eder. Bağımsız Python hesabı da aynı ortalamaları verdi.

| Sütun | v2022.1 ortalama (Sv) | v2024.1a ortalama (Sv) | Yeni − eski (Sv) |
| --- | ---: | ---: | ---: |
| `t_gs10` | 31,088903 | 32,066634 | +0,977731 |
| `t_ek10` | 3,135740 | 3,135738 | −0,000002 |
| `t_umo10` | −18,885143 | −19,257323 | −0,372181 |
| `moc_mar_hc10` | 15,320753 | 15,922495 | +0,601742 |

Bu, farkın Florida ve üst okyanus sütunlarında görüldüğünü belirler. Üç bileşenin ortalama farkları toplamı +0,605547 Sv; MOC farkından +0,003806 Sv fazladır. Kılavuz MOC'yi maksimum devrilme olarak tanımlar; sütun farklarını tam eşit veya nedensel katkı yüzdeleri olarak sunmak doğru olmaz.

## İşlem açıklamasının sınırı

[RAPID README](https://rapid.ac.uk/sites/default/files/rapid_data/README.pdf) s. 2–3, Eylül 2024 sürümünde jeomanyetik alanın uzun dönemli değişimi için düzeltilmiş Florida serisinin kullanıldığını söyler. Aynı sürümde yüzeye yakın ekstrapolasyon katsayıları güncellenmiş, yinelenen bir doğu sınırı sensörü çıkarılmış, yeniden hesaplanan ortalama ve standart sapmalar kalite kontrolünü etkilemiştir. Eylül 2025 güncellemesi de seriyi uzatır ve yeniden işleme etkileri taşır. Şubat 2022 sonrası derin doğu sınırı alet ikamesi ve 2023 sonundaki Florida kablo boşluğu doğrudan 2021 farkını açıklamaz.

[Volkov ve arkadaşları 2024](https://www.nature.com/articles/s41467-024-51879-5), 2000–2023 Florida kablo gerilimini jeomanyetik değişime göre düzeltip gemi kesitleriyle yeniden kalibre eder. Results/Corrected estimates ve Fig. 6–7, düzeltmenin Florida ve 2004–2022 RAPID AMOC hesabını etkilediğini gösterir. Makalenin 2025 [yazar düzeltmesi](https://www.nature.com/articles/s41467-025-58976-z) bilimsel sonuç değil, telif ve lisans düzeltmesidir.

Bu kaynaklar Florida bileşenindeki fark için belirli bir işlem yolunu gösterir; fakat yayımlanan iki nihai sürümün karşılaştırılması jeomanyetik düzeltmenin, yeniden kalibrasyonun ve diğer RAPID işlem değişikliklerinin 2021'deki sayısal payını tek tek ayırmaz. İşlem kodları ve ara sürümler çalıştırılmadı. Lee 2024'ün özgün hesap kodu, yeni sürümle eğilim anlamlılığı ve bağımsız uzman incelemesi de açık kalır.
