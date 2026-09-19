# Kaynak bağlantı denetimi

Son deneme: **2026-09-19** · 280 bağlantı · 345 künye

Bu tablo **betik tarafından üretilir** (`npm run denetle:baglantilar`).
Derlemenin parçası DEĞİLDİR: 280 dış adrese her derlemede istek atmak
hız sınırına takılır ve derlemeyi ağ dalgalanmasına bağımlı kılardı. Elle, aralıklı
çalıştırılır.

DOI ve ISBN adreslerinde yönlendirme **izlenmez**: sorulan soru "tanımlayıcı kayıtlı mı"
olduğu için doi.org'dan gelen 30x zaten cevaptır. Düz URL'lerde yönlendirme izlenir.

Bu tablonun göremediği şey: **yumuşak 404** (silinmiş sayfaya 200 ile "bulunamadı" metni
döndürmek) ve **çözülen yanlış tanımlayıcı** (yanlış yazılmış bir DOI gerçek olabilir ve
başka bir çalışmaya gider). İkisi de insan denetimi ister; "sağlam" burada yalnız
"sunucu cevap verdi" demektir.

| Durum | Sayı | Ne demek |
|---|---:|---|
| Sağlam | 244 | Yanıt verdi: düz adreste 2xx, tanımlayıcıda 2xx ya da 30x |
| Yönlendi | 0 | 2xx döndü ama adres değişti; künyedeki adres eskimiş olabilir |
| Engelli | 34 | 401/403/405/406/429/451 — yayıncı betik isteklerini kapatıyor. **Ölü değil**, tarayıcıda açılır |
| Ölü | 0 | 4xx/5xx — gerçekten kırık, düzeltilmeli |
| Ulaşılamadı | 2 | Bağlantı kurulamadı ya da zaman aşımı |

## Ölü bağlantı yok


## Ulaşılamayanlar (2)

Ağ hatası ya da zaman aşımı; tekrar denemeye değer.

| Kaynak | Katman | Adres | Hata |
|---|---|---|---|
| CDLI — Sumerian King List | primary | [bağlantı](https://cdli.earth/artifacts/112355) | zaman aşımı |
| CDLI — Uruk IV Administrative Tablet P002976 | primary | [bağlantı](https://cdli.earth/P002976) | zaman aşımı |


## Betiğe kapalı olanlar (34)

Bunlar hata değil. Yayıncı otomatik isteği reddediyor; adres tarayıcıda çalışır.

| Kaynak | Katman | Adres | Kod |
|---|---|---|---:|
| Band-e Kaisar ve Sasani dönemi köprü-bent mühendisliği üzerine değerlendirme | peer-reviewed | [bağlantı](https://whc.unesco.org/en/list/1315/) | 403 |
| Climate as a contributing factor in the demise of Angkor, Cambodia | peer-reviewed | [bağlantı](https://www.pnas.org/doi/10.1073/pnas.0910827107) | 403 |
| From Highlands to Henge: Refining the Provenance and Transport Pathways of Stone | peer-reviewed | [bağlantı](https://onlinelibrary.wiley.com/doi/full/10.1002/jqs.70080) | 403 |
| Uncovering archaeological landscapes at Angkor using lidar | peer-reviewed | [bağlantı](https://www.pnas.org/doi/10.1073/pnas.1306539110) | 403 |
| The Trials of Giordano Bruno (1592-1600) | institutional | [bağlantı](https://www.famous-trials.com/bruno/261-home) | 403 |
| PERSEPOLIS ADMINISTRATIVE ARCHIVES | peer-reviewed | [bağlantı](https://www.iranicaonline.org/articles/persepolis-admin-archive/) | 403 |
| Why Folklorists Hate Joseph Campbell's Work | institutional | [bağlantı](https://www.patheos.com/blogs/foxyfolklorist/why-folklorists-hate-joseph-campbells-work/) | 403 |
| UNESCO — The Ahwar of Southern Iraq | institutional | [bağlantı](https://whc.unesco.org/en/list/1481/) | 403 |
| British Museum — How to write cuneiform | institutional | [bağlantı](https://www.britishmuseum.org/blog/how-write-cuneiform) | 403 |
| British Museum — Bevelled rim bowl | institutional | [bağlantı](https://www.britishmuseum.org/collection/object/W_1932-1212-1279) | 403 |
| British Museum — Late Uruk cylinder seal 116722 | primary | [bağlantı](https://www.britishmuseum.org/collection/object/W_1925-0110-20) | 403 |
| Smarthistory — Warka Vase | institutional | [bağlantı](https://smarthistory.org/warka-vase/) | 403 |
| Uruk: First City of the Ancient World | institutional | [bağlantı](https://mitpressbookstore.mit.edu/book/9781606064443) | 403 |
| Oxford Classical Dictionary — Gilgamesh/Gilgamesh Epic | peer-reviewed | [bağlantı](https://doi.org/10.1093/acrefore/9780199381135.013.9025) | 403 |
| Metropolitan Museum of Art — Gilgamesh | institutional | [bağlantı](https://www.metmuseum.org/essays/gilgamesh) | 429 |
| Kramer & Jacobsen — Gilgamesh and Agga | peer-reviewed | [bağlantı](https://www.journals.uchicago.edu/doi/10.2307/501208) | 403 |
| Jacobsen — Primitive Democracy in Ancient Mesopotamia | peer-reviewed | [bağlantı](https://www.journals.uchicago.edu/doi/10.2307/542482) | 403 |
| Magnetometry at Uruk: The city of King Gilgamesh | institutional | [bağlantı](https://ui.adsabs.harvard.edu/abs/2003EAEJA.....9152F/abstract) | 405 |
| Gebhard J. Selz — The Uruk Phenomenon | peer-reviewed | [bağlantı](https://doi.org/10.1093/oso/9780190687854.003.0004) | 403 |
| Ur, Karsgaard & Oates — Tell Brak Suburban Survey | institutional | [bağlantı](https://jasonur.scholars.harvard.edu/publications/spatial-dimensions-early-mesopotamian-urbanism-tell-brak-suburban-survey-2003-2) | 403 |
| Jotheri et al. — Holocene fluvial and anthropogenic processes around Uruk | institutional | [bağlantı](https://discovery.ucl.ac.uk/id/eprint/10039203/) | 403 |
| Smarthistory — White Temple and ziggurat, Uruk | institutional | [bağlantı](https://smarthistory.org/white-temple-and-ziggurat-uruk/) | 403 |
| Origins of the sarsen megaliths at Stonehenge | peer-reviewed | [bağlantı](https://www.science.org/doi/10.1126/sciadv.abc0133) | 403 |
| Hydraulic Engineering at 100 BC-AD 300 Nabataean Petra (Jordan) | peer-reviewed | [bağlantı](https://www.mdpi.com/2073-4441/12/12/3498) | 403 |
| Geoarchaeological evidence from Angkor, Cambodia, reveals a gradual decline rath | peer-reviewed | [bağlantı](https://www.pnas.org/doi/10.1073/pnas.1821460116) | 403 |
| Insights into the genetic histories and lifeways of Machu Picchu's occupants | peer-reviewed | [bağlantı](https://www.science.org/doi/10.1126/sciadv.adg3377) | 403 |
| New research reveals origin of Stonehenge's great sarsen stones | institutional | [bağlantı](https://www.ucl.ac.uk/news/2020/jul/new-research-reveals-origin-stonehenges-great-sarsen-stones) | 403 |
| Stonehenge Altar Stone came from Scotland, not Wales | institutional | [bağlantı](https://www.ucl.ac.uk/news/2024/aug/stonehenge-altar-stone-came-scotland-not-wales) | 403 |
| First DNA analysis of Machu Picchu residents offers insight into Inca society | institutional | [bağlantı](https://news.ucsc.edu/2023/07/machu-picchu-genomics/) | 403 |
| Shushtar Historical Hydraulic System | institutional | [bağlantı](https://whc.unesco.org/en/list/1315/) | 403 |
| Angkor - Dünya Mirası kaydı | institutional | [bağlantı](https://whc.unesco.org/en/list/668/) | 403 |
| Petra - Dünya Mirası kaydı | institutional | [bağlantı](https://whc.unesco.org/en/list/326/) | 403 |
| Sigiriya Antik Kenti - Dünya Mirası kaydı | institutional | [bağlantı](https://whc.unesco.org/en/list/202/) | 403 |
| Göbekli Tepe ile Karahan Tepe'nin Jeomorfolojisi ve Doğal Ortam Koşullarının Erk | peer-reviewed | [bağlantı](https://www.researchgate.net/publication/357329428) | 403 |


