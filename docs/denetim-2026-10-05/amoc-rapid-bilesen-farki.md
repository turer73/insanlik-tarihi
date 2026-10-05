# RAPID 2021 sürüm farkı: bileşen denetimi

**Tarih:** 5 Ekim 2026. Karşılaştırma yalnız 2021'in aynı 730 yarım günlük zaman damgası içindir; yeni bir eğilim veya atıf analizi değildir.

## Girdi ve yeniden üretim

- [BODC v2022.1 arşivi](https://www.bodc.ac.uk/data/published_data_library/catalogue/10.5285/04c79ece-3186-349a-e063-6c86abc0158c/): `moc_transports_200404_2022215.ascii`, SHA-256 `619313d25295d4f1f492cd163904fa1a9fb6627c37b561978ec0638b807cc41b`.
- [BODC v2023.1 arşivi](https://www.bodc.ac.uk/data/published_data_library/catalogue/10.5285/223b34a3-2dc5-c945-e063-7086abc0f274/): ZIP SHA-256 `8f0559efe535444b50322a4bdc8e550330bb39a63d87f1e95096e8b062f64c5e`; `moc_transports_200404_2023211.ascii` SHA-256 `fff4022d10b0239b482a99fd7b46bdb3db1d57b3e1d0b73a4456dea1184dd8a0`. Birlikte verilen 18 Eylül 2024 tarihli `moc_transports_supporting_information.pdf` SHA-256 `c68c7cf8ec6c78d2de549123cd9f1271a5d603cc2e912c98eba081b0f6abad91`.
- [RAPID v2024.1a](https://rapid.ac.uk/node/10): `moc_transports.ascii`, SHA-256 `847c169cba6b2461a2ca33870b7c06d6c9073ac389b333006abc6709437b08ac`.
- Üç sürümün kılavuzunda sütun 11 `t_gs10` (Florida Boğazı), 12 `t_ek10` (Ekman), 13 `t_umo10` (üst okyanus), 14 `moc_mar_hc10` (AMOC); değerler 10 günlük alçak geçiren filtreli, 12 saat aralıklıdır. Yeni [RAPID README](https://rapid.ac.uk/sites/default/files/rapid_data/README.pdf) s. 5–6, v2023.1 arşiv PDF'si s. 4–5, eski arşivin `moc_transports_supporting_information_2022.pdf` dosyası s. 4 sütun sırasını doğrular.
- Tekrarlanabilir komut: `node scripts/audit-rapid-release-compare.mjs OLD.ascii INTERMEDIATE.ascii CURRENT.ascii`. Betik üç SHA-256 değerini ve 2021 zaman damgalarının bire bir eşleşmesini kontrol eder. Bağımsız Python hesabı da aynı ortalamaları verdi.

| Sütun | v2022.1 ortalama (Sv) | v2024.1a ortalama (Sv) | Yeni − eski (Sv) |
| --- | ---: | ---: | ---: |
| `t_gs10` | 31,088903 | 32,066634 | +0,977731 |
| `t_ek10` | 3,135740 | 3,135738 | −0,000002 |
| `t_umo10` | −18,885143 | −19,257323 | −0,372181 |
| `moc_mar_hc10` | 15,320753 | 15,922495 | +0,601742 |

Bu, farkın Florida ve üst okyanus sütunlarında görüldüğünü belirler. Üç bileşenin ortalama farkları toplamı +0,605547 Sv; MOC farkından +0,003806 Sv fazladır. Kılavuz MOC'yi maksimum devrilme olarak tanımlar; sütun farklarını tam eşit veya nedensel katkı yüzdeleri olarak sunmak doğru olmaz.

## Ara sürümdeki 2021 ortalaması

| Sürüm | Aynı 730 örnekte MOC ortalaması (Sv) | Önceki sürüme göre fark (Sv) | Florida farkı (Sv) | Üst okyanus farkı (Sv) |
| --- | ---: | ---: | ---: | ---: |
| v2022.1 | 15,320753 | — | — | — |
| v2023.1 (18 Eylül 2024) | 15,934909 | +0,614156 | +0,994169 | −0,376035 |
| v2024.1a | 15,922495 | −0,012414 | −0,016438 | +0,003855 |

Dolayısıyla v2022.1 ile v2024.1a arasındaki net +0,601742 Sv farkın ana sıçraması v2022.1→v2023.1 geçişindedir; sonraki birleşik geçiş ortalamayı 0,012414 Sv aşağı çekmiştir. Bu ikinci satır, v2023.1a ve v2024.1 ara sürümleri ayrı ayrı indirilip karşılaştırılmadığı için onların tekil değişimlerini göstermez. Her sürüm geçişinde aynı zaman damgaları kullanıldı. v2023.1 [resmî açıklama PDF'si](https://www.bodc.ac.uk/data/published_data_library/catalogue/10.5285/223b34a3-2dc5-c945-e063-7086abc0f274/) s. 2, Eylül 2024 sürümünde jeomanyetik düzeltilmiş Florida serisiyle beraber yüzey ekstrapolasyon katsayıları, doğu sınırındaki yinelenen sensör ve kalite kontrol istatistiklerinin de değiştiğini bildirir. Bu karşılaştırma sürüm geçişini tarihler; işlemlere ayrı sayısal pay atamaz.

## İşlem açıklamasının sınırı

[RAPID README](https://rapid.ac.uk/sites/default/files/rapid_data/README.pdf) s. 2–3, Eylül 2024 sürümünde jeomanyetik alanın uzun dönemli değişimi için düzeltilmiş Florida serisinin kullanıldığını söyler. Aynı sürümde yüzeye yakın ekstrapolasyon katsayıları güncellenmiş, yinelenen bir doğu sınırı sensörü çıkarılmış, yeniden hesaplanan ortalama ve standart sapmalar kalite kontrolünü etkilemiştir. Eylül 2025 güncellemesi de seriyi uzatır ve yeniden işleme etkileri taşır. Şubat 2022 sonrası derin doğu sınırı alet ikamesi ve 2023 sonundaki Florida kablo boşluğu doğrudan 2021 farkını açıklamaz.

[Volkov ve arkadaşları 2024](https://www.nature.com/articles/s41467-024-51879-5), 2000–2023 Florida kablo gerilimini jeomanyetik değişime göre düzeltip gemi kesitleriyle yeniden kalibre eder. Results/Corrected estimates ve Fig. 6–7, düzeltmenin Florida ve 2004–2022 RAPID AMOC hesabını etkilediğini gösterir. Makalenin 2025 [yazar düzeltmesi](https://www.nature.com/articles/s41467-025-58976-z) bilimsel sonuç değil, telif ve lisans düzeltmesidir.

Makalenin Results/Implications bölümünde Nisan 2004–Şubat 2022 AMOC eğilimi, eski Florida taşınımıyla −1,3 ± 0,7; düzeltilmiş taşınımla −0,8 ± 0,7 Sv/on yıl olarak verilir. Şekil 7 açıklamasına göre mevsim döngüsü çıkarılıp iki yıllık alçak geçiren filtre kullanılmıştır. Bu yayımlanmış iki eğilim, yukarıdaki 2021 takvim ortalaması farkından hesaplanmış değildir ve Lee 2024'ün 2011–2021 aralığıyla karıştırılmamalıdır.

Bu kaynaklar Florida bileşenindeki fark için belirli bir işlem yolunu gösterir; fakat üç sürümün karşılaştırılması jeomanyetik düzeltmenin, yeniden kalibrasyonun ve diğer RAPID işlem değişikliklerinin 2021'deki sayısal payını tek tek ayırmaz. İşlem kodları ile v2023.1a ve v2024.1 ara sürümleri çalıştırılmadı. Lee 2024'ün özgün hesap kodu, yeni sürümle eğilim anlamlılığı ve bağımsız uzman incelemesi de açık kalır.
