# İçerik lisansı — CC BY-SA 4.0

Bu depodaki **içerik**, yani yazılar, bulgu kayıtları ve bunların Türkçe
metinleri, **Creative Commons Atıf-AynıLisanslaPaylaş 4.0 Uluslararası (CC BY-SA 4.0)** lisansıyla
sunulur.

> Telif hakkı sahibi: turer73 — <https://github.com/turer73/insanlik-tarihi>
>
> Bu içerik CC BY-SA 4.0 ile lisanslanmıştır.
> Lisansın tam metni: <https://creativecommons.org/licenses/by-sa/4.0/legalcode.tr>
> Özet: <https://creativecommons.org/licenses/by-sa/4.0/deed.tr>

## Neyi kapsar

| Yol | Kapsam |
|---|---|
| `articles/` | Yazıların metni, başlıkları, kutuları, açıklamaları |
| `data/findings/` | Bulgu kayıtları: `claim`, `divergence`, `evidence[].text`, `counter_evidence`, `open_questions` |
| `data/findings.bundle.json` | Yukarıdakilerin derlenmiş hâli |
| `data/articles.json` | Yazı kayıtları |
| `README.md`, `CONTRIBUTING.md`, `DEPLOYMENT.md` | Proje belgeleri |

Depodaki **kod** — `scripts/`, `tools/`, `schema/`, `assets/` altındaki
JavaScript ve CSS, kök dizindeki HTML iskeletleri ve derleme yapılandırması —
CC BY-SA değil, [AGPL-3.0 lisansı](LICENSE) altındadır. İki lisansın ortak
mantığı aynıdır: alan kişi, aldığını ve değiştirdiğini aynı koşullarla açar.

## Atıf nasıl verilir

Yeterli bir atıf şunları içerir: eserin adı, telif sahibi, lisans adı ve
lisansa bağlantı. Örnek:

> Kaynak: "Mit ve Sicil", Kanıt Atlası (turer73), CC BY-SA 4.0 —
> https://kanitatlasi.com/articles/mit-ve-sicil.html

Değişiklik yaptıysanız bunu belirtin ve türev eseri aynı lisansla paylaşın.
CC BY-SA 4.0 ikisini de şart koşar; ayrıca bu
projenin bütün mesajı zaten budur — bir iddianın nereden geldiği ve yolda ne
olduğu, iddianın kendisi kadar önemlidir.

## Neden CC BY-SA, CC BY veya CC BY-NC değil

İçerik 2026-10-04'e kadar **CC BY 4.0** ile yayımlandı; o tarihe kadar alınan
kopyalar o lisansla kullanılmaya devam eder. O tarihte **CC BY-SA 4.0**'a
geçildi; gerekçe, atfın yanına "aynı lisansla paylaş" şartını eklemektir:

- **BY-SA**, buradaki bir kaydı alıp genişleten kişinin kendi katkısını da aynı
  açıklıkla sunmasını ister. Kaynak zinciri yalnız geriye değil ileriye doğru da
  açık kalır; depodaki kodun AGPL-3.0 ile korunmasıyla aynı mantıktır.
- **Yalnız BY** bu şartı taşımıyordu; kaynaklı malzeme kapalı bir derlemeye
  alınıp orada durabiliyordu.
- **BY-NC olsaydı** lisans "açık" olmaktan çıkardı: ticari olmayan tanımı
  belirsizdir ve Vikipedi gibi yeniden kullanım alanlarını kapatır. CC BY-SA
  içerik Vikipedi'ye aktarılabilir; CC BY-NC aktarılamaz.

## Lisansın kapsamadığı şeyler

- **Alıntılanan kaynakların kendisi.** Kayıtlardaki künyeler, DOI'ler, sayfa
  numaraları ve yayın adları olgudur, telif konusu değildir; ama alıntılanan
  eserlerin kendi metinleri kendi telif sahiplerine aittir. Bu depo onları
  yeniden yayımlamaz.
- **Antik metinlerden yapılan kısa aktarımlar** özgün dillerden çalışma
  çevirisidir; yayımlanmış telifli çeviriler kullanılmamıştır.
- **Yazı tipleri.** Fraunces, Karla ve JetBrains Mono bu depoda dağıtılmaz,
  çalışma anında Google Fonts üzerinden yüklenir; kendi lisansları geçerlidir.

## Değiştirmek isterseniz

Lisans kararı geri alınabilir değildir: bugüne kadar yayımlanan sürümler,
alındıkları andaki lisansla kullanılmaya devam edebilir. İleriye dönük olarak
değiştirmek isterseniz bu dosyayı ve [`README.md`](README.md) içindeki lisans
bölümünü güncellemek yeterlidir.

Telif sahibi adını yasal adınızla değiştirmek isterseniz `turer73` yazan üç
yeri güncelleyin: [`LICENSE`](LICENSE), bu dosya ve `README.md`.
