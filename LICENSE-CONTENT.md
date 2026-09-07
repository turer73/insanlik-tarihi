# İçerik lisansı — CC BY 4.0

Bu depodaki **içerik**, yani yazılar, bulgu kayıtları ve bunların Türkçe
metinleri, **Creative Commons Atıf 4.0 Uluslararası (CC BY 4.0)** lisansıyla
sunulur.

> Telif hakkı sahibi: turer73 — <https://github.com/turer73/insanlik-tarihi>
>
> Bu içerik CC BY 4.0 ile lisanslanmıştır.
> Lisansın tam metni: <https://creativecommons.org/licenses/by/4.0/legalcode.tr>
> Özet: <https://creativecommons.org/licenses/by/4.0/deed.tr>

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
CC BY değil, [MIT lisansı](LICENSE) altındadır. Ayrım şuradan çıkıyor: bir
derleme betiğini kullanmak için kimsenin bana atıf vermesi gerekmiyor, ama bir
iddiayı ve onun kaynak zincirini alıp başka yere taşıyan birinin nereden
aldığını söylemesi gerekiyor.

## Atıf nasıl verilir

Yeterli bir atıf şunları içerir: eserin adı, telif sahibi, lisans adı ve
lisansa bağlantı. Örnek:

> Kaynak: "Mit ve Sicil", Kanıt Atlası (turer73), CC BY 4.0 —
> https://kanitatlasi.com/articles/mit-ve-sicil.html

Değişiklik yaptıysanız bunu belirtin. CC BY 4.0 bunu şart koşar; ayrıca bu
projenin bütün mesajı zaten budur — bir iddianın nereden geldiği ve yolda ne
olduğu, iddianın kendisi kadar önemlidir.

## Neden CC BY, CC BY-SA veya CC BY-NC değil

CC BY seçildi çünkü **atıf, bu projenin savunduğu şeyin ta kendisidir** — ve
tek şart olarak yeterlidir.

- **BY-SA olsaydı** buradaki bir kaydı farklı lisanslı bir kitaba, makaleye
  veya derse alan kişi bunu yapamazdı. Kaynaklı malzemenin dolaşıma girmesini
  zorlaştırmak, projenin amacına ters düşer.
- **BY-NC olsaydı** lisans "açık" olmaktan çıkardı: ticari olmayan tanımı
  belirsizdir ve Vikipedi gibi yeniden kullanım alanlarını kapatır. CC BY
  içerik, CC BY-SA eserlere (Vikipedi dahil) aktarılabilir; CC BY-NC
  aktarılamaz.

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
