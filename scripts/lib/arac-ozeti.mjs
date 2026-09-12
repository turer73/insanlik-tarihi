// Araç sayfaları için SUNUCUDA üretilen özet.
//
// ÖLÇÜLEN SORUN: üç araç sayfası 800 KB civarı JavaScript taşıyıp sunucuda
// yalnızca 51-128 kelime üretiyordu. Karşılaştırma: bir yazı 3.094 kelime.
// Search Console anlık görüntüsü bununla tutarlı - üçü de dizinde değil,
// biri "keşfedildi ama eklenmedi", ikisini Google hiç bilmiyor.
//
// Google JavaScript'i işleyebilir ama bunu ertelenmiş ve pahalı bir ikinci
// turda yapar. Altı günlük, tarama bütçesi küçük bir sitede 800 KB'lık
// salt-JS bir sayfa, indekslenme sırasının en sonundadır.
//
// NEDEN KOPYA DEĞİL: özet, yazı sayfalarındaki kanıt dosyasını TEKRARLAMAZ.
// Orada her bulgu kendi yazısının bağlamında, kanıt ve karşı kanıtıyla
// duruyor. Burada üretilen şey KESİTSEL bir görünüm: durum dağılımı, sapma
// türü dağılımı, kaynak katmanları, inceleme durumu. Bunlar hiçbir yazıda
// yok çünkü tek bir yazıya ait değiller.
//
// Erişilebilirlik tarafı da var: JavaScript çalışmadığında ya da ekran
// okuyucuyla gezildiğinde sayfa artık boş değil.

import { kaynaklariTopla } from "./kaynakca.mjs";

const ETIKET_DURUM = {
  established: "Yerleşik görüş",
  contested: "Tartışmalı",
  minority: "Azınlık görüşü",
  refuted: "Çürütülmüş",
  unknown: "Bilinmiyor",
  unmeasurable: "Ölçülemez",
};

const ETIKET_KATMAN = {
  primary: "Birincil kaynak",
  "peer-reviewed": "Hakemli",
  institutional: "Kurumsal",
  popular: "Popüler",
  unreliable: "Güvenilmez",
};

const ETIKET_SAPMA = {
  "eski-ceviri": "Eski çeviri",
  guncellenmemis: "Güncellenmemiş",
  "turizm-kopyalamasi": "Turizm kopyalaması",
  "ideolojik-secim": "İdeolojik seçim",
  "medya-abartisi": "Medya abartısı",
  "somurge-anlatisi": "Sömürge anlatısı",
  "kategori-hatasi": "Kategori hatası",
  "hayatta-kalma-yanliligi": "Hayatta kalma yanlılığı",
  "provenans-yoklugu": "Provenans yokluğu",
};

const ETIKET_INCELEME = {
  draft: "Taslak",
  "editor-reviewed": "Editoryal inceleme",
  "expert-reviewed": "Uzman incelemesi",
};

function kacar(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function say(kayitlar, cikar) {
  const m = new Map();
  for (const r of kayitlar) {
    for (const d of [].concat(cikar(r) ?? [])) {
      if (d === undefined || d === null || d === "") continue;
      m.set(d, (m.get(d) ?? 0) + 1);
    }
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function tablo(baslik, satirlar, etiketler) {
  if (!satirlar.length) return "";
  const govde = satirlar
    .map(([k, n]) => `<tr><th scope="row">${kacar(etiketler?.[k] ?? k)}</th><td>${n}</td></tr>`)
    .join("");
  return `<table class="ka-ozet-tablo"><caption>${kacar(baslik)}</caption><tbody>${govde}</tbody></table>`;
}

/**
 * Araç sayfasına gömülecek özet bölümü.
 *
 * @param tur      "veri-tabani" | "denetim" | "cizelge"
 * @param bundle   bulgu kayıtları
 * @param articles data/articles.json içeriği
 */
export function aracOzeti(tur, bundle, articles) {
  const kayitlar = Array.isArray(bundle) ? bundle : [];
  const yaziSayisi = Object.keys(articles ?? {}).length;

  const kaynaklar = [];
  for (const r of kayitlar) for (const s of r.sources ?? []) kaynaklar.push(s);
  const benzersizKaynak = new Set(kaynaklar.map((s) => s.id ?? s.title)).size;

  // Konu başına kayıt ve yazı bağlantısı — hiçbir yazıda olmayan kesitsel görünüm
  const konular = new Map();
  for (const r of kayitlar) {
    for (const slug of r.used_in ?? []) {
      if (!konular.has(slug)) konular.set(slug, 0);
      konular.set(slug, konular.get(slug) + 1);
    }
  }
  const konuListesi = [...konular.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug, n]) => {
      const ad = articles?.[slug]?.title ?? slug;
      return `<li><a href="../articles/${kacar(slug)}.html">${kacar(ad)}</a> <span class="ka-ozet-sayi">${n} kayıt</span></li>`;
    }).join("");

  // Katman tablosu BENZERSİZ künyeyi sayar, kayıttaki geçiş sayısını değil.
  // Eskiden geçiş sayıyordu: aynı sayfanın girişinde "345 benzersiz kaynak",
  // hemen altındaki tabloda toplam 539 yazıyordu. İki sayı da doğruydu ama
  // aynı ada sahipti. Tekilleştirme kaynakça sayfasıyla AYNI işlevden geliyor;
  // böylece iki sayfa yapısal olarak çelişemez.
  const tekilKaynaklar = kaynaklariTopla(kayitlar,
    Object.entries(articles ?? {}).map(([slug, a]) => ({ slug, ...a })));
  const durum = say(kayitlar, (r) => r.status);
  const sapma = say(kayitlar, (r) => r.divergence_type);
  const katman = say(tekilKaynaklar, (k) => k.katman);
  const inceleme = say(kayitlar, (r) => r.review?.status ?? "kayıtsız");

  const bagsiz = kayitlar.filter((r) => !(r.used_in ?? []).length).length;
  const populerIddia = kayitlar.filter((r) => r.popular_claim).length;

  const girisler = {
    "veri-tabani": `Bu veri tabanı ${kayitlar.length} bulgu kaydı tutuyor ve bunların ${kayitlar.length - bagsiz} tanesi ${yaziSayisi} araştırma yazısına bağlı. Her kayıt bir olguyu değil, bir <strong>iddianın kanıt karşısındaki durumunu</strong> tutar: iddia, kanıt, karşı kanıt, kaynak künyesi ve açık sorular. ${populerIddia} kayıt ayrıca popüler hâlini ve o hâlin kanıttan nerede saptığını da taşıyor.`,
    denetim: `Bu denetim görünümü ${kayitlar.length} kaydın <strong>kaynak zincirini</strong> gösterir: her kanıt maddesinin hangi kaynağa, o kaynağın neresine ve hangi atıf türüyle bağlandığı. Kayıtların arkasında <a href="../kaynakca.html">${benzersizKaynak} benzersiz kaynak künyesi</a> var. Amaç, bir iddianın doğru görünmesi değil, <strong>izlenebilir</strong> olmasıdır.`,
    cizelge: `Bu çizelge ${kayitlar.length} bulguyu, ilgili oldukları tarihsel aralık boyunca uzanan çubuklar hâlinde yerleştirir. Renk, iddianın kanıt karşısındaki durumunu gösterir. Ölçek doğrusal değildir; aksi hâlde son beş bin yıl, önceki iki milyon yılın yanında görünmez olurdu.`,
  };

  const tablolar = [
    tablo("Kayıtların kanıt karşısındaki durumu", durum, ETIKET_DURUM),
    tur === "denetim" ? tablo("Benzersiz kaynak künyeleri, katmana göre", katman, ETIKET_KATMAN) : "",
    tur === "denetim" ? tablo("İnceleme durumu", inceleme, ETIKET_INCELEME) : "",
    tur !== "denetim" ? tablo("Popüler iddianın kanıttan sapma türü", sapma, ETIKET_SAPMA) : "",
  ].filter(Boolean).join("");

  return `<section class="ka-ozet" aria-labelledby="ka-ozet-baslik">
  <h2 id="ka-ozet-baslik">Bu sayfada ne var?</h2>
  <p>${girisler[tur] ?? girisler["veri-tabani"]}</p>
  <div class="ka-ozet-tablolar">${tablolar}</div>
  <h3>Kayıtların dağıldığı araştırma dosyaları</h3>
  <p>Her kayıt, ait olduğu yazıda kanıt ve karşı kanıtıyla birlikte okunabilir. Bütün kaynak künyeleri, kullanım notlarıyla birlikte <a href="../kaynakca.html">kaynakçada</a> listelidir.</p>
  <ul class="ka-ozet-konular">${konuListesi}</ul>
  <p class="ka-ozet-not">Tablolar ve liste sunucuda üretilir; aşağıdaki etkileşimli araç JavaScript ile çalışır. JavaScript kapalıysa bu özet sayfanın tamamıdır.</p>
</section>`;
}

/** Özet bölümünün stili. Araç şablonlarının kendi değişkenlerini kullanır. */
export const ARAC_OZETI_CSS = `
.ka-ozet{max-width:var(--wrap,1180px);margin:0 auto;padding:1.6rem 1.1rem 0}
.ka-ozet h2{margin:0 0 .5rem;font-size:1.35rem}
.ka-ozet h3{margin:1.6rem 0 .35rem;font-size:1.05rem}
.ka-ozet p{margin:0 0 .7rem;max-width:70ch;color:var(--muted,#565d62);line-height:1.6}
.ka-ozet-tablolar{display:flex;flex-wrap:wrap;gap:1rem;margin:1rem 0 .4rem}
.ka-ozet-tablo{border-collapse:collapse;min-width:min(100%,230px);font-size:.9rem}
.ka-ozet-tablo caption{text-align:left;padding-bottom:.35rem;font-weight:700;color:var(--ink,#171a1c)}
.ka-ozet-tablo th,.ka-ozet-tablo td{border:1px solid var(--rule,#cbc7bd);padding:.3rem .55rem;text-align:left;font-weight:400}
.ka-ozet-tablo th{color:var(--muted,#565d62)}
.ka-ozet-tablo td{text-align:right;font-variant-numeric:tabular-nums}
.ka-ozet-konular{display:flex;flex-wrap:wrap;gap:.4rem .9rem;margin:.3rem 0 .8rem;padding:0;list-style:none;font-size:.92rem}
.ka-ozet-konular li{white-space:nowrap}
.ka-ozet-sayi{color:var(--quiet,#7a8186);font-size:.85em}
.ka-ozet-not{font-size:.85rem;color:var(--quiet,#7a8186)}
@media (max-width:640px){.ka-ozet-konular li{white-space:normal}}
`;
