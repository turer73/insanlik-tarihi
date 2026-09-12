// Kaynakça sayfası: bulgu kayıtlarının arkasındaki bütün kaynak künyeleri.
//
// NEDEN ÜRETİLİYOR, ELLE TUTULMUYOR: 345 künye 207 kayda dağılmış durumda ve
// her yeni yazı bu sayıyı değiştiriyor. Elle tutulan bir liste haftalar içinde
// bayatlar; bayat bir kaynakça, kaynakça olmamasından daha kötüdür çünkü
// güven verirken yanlış bilgi taşır.
//
// NE DEĞİL: okuma tavsiyesi listesi değil. Özellikle "güvenilmez" katmanı,
// popüler bir iddianın KÖKENİ olduğu için buradadır - önerildiği için değil.
// Bu ayrım sayfada açıkça yazılı olmak zorunda.
//
// AYNI KÜNYE BİRDEN FAZLA KAYITTA: not alanı kayda özeldir ("bu kayıtta şunun
// için kullanıldı"). Bu yüzden notlar teke indirgenmiyor, hepsi gösteriliyor.
// Künye alanları ise en dolu varyanttan birleştiriliyor.
//
// TEK KAYNAK İKİ KATMANDA: George 2003 bir kayıtta metin edisyonu (primary),
// başka bir kayıtta yazarın çözümlemesi (peer-reviewed) olarak kullanılıyor.
// Bu kasıtlı; kaynak bir kez listelenip ikinci rolü not olarak yazılıyor.

const DOI = /^10\.\d{4,9}\/\S+$/i;

const KATMAN_SIRA = ["primary", "peer-reviewed", "institutional", "popular", "unreliable"];

const KATMAN = {
  primary: {
    ad: "Birincil kaynak",
    aciklama:
      "Olayın ya da metnin kendisi: kil tablet, yazıt, kazı raporu, eleştirel metin edisyonu, ham veri dizisi. " +
      "Bir iddia buraya kadar izlenebiliyorsa aradaki bütün yorum katmanları atlanmış demektir.",
  },
  "peer-reviewed": {
    ad: "Hakemli yayın",
    aciklama:
      "Hakem denetiminden geçmiş makale, kitap ve kitap bölümleri. Bu katmanda yazar, yıl ve bir tanımlayıcı " +
      "(DOI, ISBN ya da kalıcı bağlantı) zorunludur; eksikse kayıt derlemede reddedilir.",
  },
  institutional: {
    ad: "Kurumsal kaynak",
    aciklama:
      "Üniversite, müze, kazı heyeti, devlet kurumu ya da uluslararası kuruluş yayınları: kazı duyuruları, " +
      "IPCC bölümleri, müze katalog kayıtları, veri portalları. Kurumun adı ve erişilebilir bir bağlantı zorunludur.",
  },
  popular: {
    ad: "Popüler yayın",
    aciklama:
      "Genel okura yazılmış kitap ve haber metinleri. Burada bir kaynağın bulunması onun yanlış olduğu anlamına " +
      "gelmez; kanıt zincirinin son halkası olamayacağı anlamına gelir. Çoğu, popüler anlatının nereden yayıldığını " +
      "göstermek için kayıtlıdır.",
  },
  unreliable: {
    ad: "Güvenilmez kaynak",
    aciklama:
      "Bu başlık altındakiler önerilmiyor. Kayıtta yer almalarının tek sebebi, incelenen popüler iddianın " +
      "kökeninin tam olarak burası olması. Bir iddianın nereden çıktığını göstermeden çürütmek mümkün değil.",
  },
};

const TUR = {
  "press-release": "basın duyurusu",
  report: "rapor",
  article: "makale",
  webpage: "web sayfası",
  inscription: "yazıt",
  book: "kitap",
  edition: "metin edisyonu",
  manuscript: "elyazması",
  chapter: "kitap bölümü",
  database: "veri tabanı",
  dataset: "veri dizisi",
};

const DIL = {
  en: "İngilizce", tr: "Türkçe", de: "Almanca", fr: "Fransızca", es: "İspanyolca",
  la: "Latince", grc: "Antik Yunanca", he: "İbranice", ar: "Arapça", akk: "Akadca",
  sux: "Sümerce", egy: "Eski Mısırca", peo: "Eski Farsça", sa: "Sanskritçe",
  pi: "Pali", ja: "Japonca", zh: "Çince",
};

function kacar(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function guvenliURL(v) {
  if (typeof v !== "string" || !v.trim()) return null;
  try {
    const u = new URL(v);
    return ["http:", "https:"].includes(u.protocol) ? u.href : null;
  } catch { return null; }
}

function capa(v, yedek) {
  const t = String(v ?? "").trim().replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return t || yedek;
}

/** Aynı id'nin farklı kayıtlardaki varyantlarını tek künyede birleştirir. */
function kunyeBirlestir(varyantlar) {
  const alanlar = ["title", "authors", "year", "container", "publisher", "institution",
    "volume", "pages", "doi", "isbn", "url", "type", "language", "accessed"];
  // En dolu varyant esas alınır; eksik alanlar ötekilerden tamamlanır.
  const sirali = [...varyantlar].sort((a, b) =>
    Object.values(b).filter(Boolean).length - Object.values(a).filter(Boolean).length);
  const k = {};
  for (const alan of alanlar) {
    for (const v of sirali) {
      const deger = v[alan];
      if (Array.isArray(deger) ? deger.length : String(deger ?? "").trim()) { k[alan] = deger; break; }
    }
  }
  return k;
}

/**
 * Bulgu kayıtlarındaki kaynakları tekilleştirir.
 *
 * @param bundle   findings.bundle.json içeriği
 * @param articles yazı envanteri (dizi)
 * @returns tekil kaynak kayıtları
 */
export function kaynaklariTopla(bundle, articles) {
  const yaziAdi = new Map((articles ?? []).map((a) => [a.slug, a]));
  const havuz = new Map();

  for (const kayit of Array.isArray(bundle) ? bundle : []) {
    for (const kaynak of kayit.sources ?? []) {
      const id = String(kaynak.id ?? kaynak.title ?? "").trim();
      if (!id) continue;
      if (!havuz.has(id)) {
        havuz.set(id, { id, varyantlar: [], katmanSayim: new Map(), notlar: [], kullanim: 0, yazilar: new Map() });
      }
      const e = havuz.get(id);
      e.varyantlar.push(kaynak);
      e.kullanim += 1;
      if (kaynak.tier) e.katmanSayim.set(kaynak.tier, (e.katmanSayim.get(kaynak.tier) ?? 0) + 1);
      const not = String(kaynak.note ?? "").trim();
      if (not && !e.notlar.includes(not)) e.notlar.push(not);
      for (const slug of kayit.used_in ?? []) {
        // Aynı yazıdaki ilk bulgu, geri bağlantının ineceği yerdir.
        if (!e.yazilar.has(slug)) e.yazilar.set(slug, kayit.id);
      }
    }
  }

  return [...havuz.values()].map((e) => {
    const katmanlar = [...e.katmanSayim.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
    return {
      id: e.id,
      kunye: kunyeBirlestir(e.varyantlar),
      katman: katmanlar[0] ?? "popular",
      ikinciKatmanlar: katmanlar.slice(1),
      notlar: e.notlar,
      kullanim: e.kullanim,
      yazilar: [...e.yazilar.entries()]
        .map(([slug, bulguId]) => ({ slug, bulguId, yazi: yaziAdi.get(slug) }))
        .filter((y) => y.yazi)
        .sort((a, b) => (a.yazi.no ?? 0) - (b.yazi.no ?? 0)),
    };
  });
}

function bagAdresi(kunye) {
  const url = guvenliURL(kunye.url);
  if (url) return { href: url, etiket: "Kaynağa git", tur: "url" };
  if (typeof kunye.doi === "string" && DOI.test(kunye.doi)) {
    return { href: `https://doi.org/${kunye.doi}`, etiket: `DOI: ${kunye.doi}`, tur: "doi" };
  }
  const isbn = String(kunye.isbn ?? "").replace(/[^0-9Xx]/g, "");
  if (isbn.length === 10 || isbn.length === 13) {
    return { href: `https://openlibrary.org/isbn/${isbn}`, etiket: `ISBN: ${kunye.isbn}`, tur: "isbn" };
  }
  return null;
}

function kunyeSatiri(kunye) {
  const parcalar = [];
  if (Array.isArray(kunye.authors) && kunye.authors.length) parcalar.push(kunye.authors.join(", "));
  if (kunye.institution) parcalar.push(kunye.institution);
  if (kunye.year) parcalar.push(String(kunye.year));
  if (kunye.container) parcalar.push(kunye.container);
  if (kunye.publisher && kunye.publisher !== kunye.container) parcalar.push(kunye.publisher);
  if (kunye.volume) parcalar.push(kunye.volume);
  if (kunye.pages) parcalar.push(kunye.pages);
  return parcalar.map(kacar).join(" · ");
}

function rozetler(kaynak) {
  const { kunye } = kaynak;
  const r = [];
  if (kunye.type && TUR[kunye.type]) r.push(TUR[kunye.type]);
  if (kunye.language && kunye.language !== "tr" && DIL[kunye.language]) r.push(DIL[kunye.language]);
  if (kaynak.kullanim > 1) r.push(`${kaynak.kullanim} kayıtta`);
  return r.map((x) => `<span class="kk-rozet">${kacar(x)}</span>`).join("");
}

function girdi(kaynak) {
  const { kunye } = kaynak;
  const baslik = kacar(kunye.title || kaynak.id);
  const bag = bagAdresi(kunye);
  const basligiBagla = bag
    ? `<a href="${kacar(bag.href)}" rel="noopener noreferrer">${baslik}</a>`
    : baslik;

  const satir = kunyeSatiri(kunye);
  let tanimlayici;
  if (!bag) {
    tanimlayici = `<span class="kk-tanim kk-tanim-yok">Çevrimiçi tanımlayıcı yok</span>`;
  } else if (bag.tur === "url") {
    tanimlayici = `<a class="kk-tanim" href="${kacar(bag.href)}" rel="noopener noreferrer">${kacar(new URL(bag.href).hostname.replace(/^www\./, ""))}</a>`;
  } else {
    tanimlayici = `<a class="kk-tanim" href="${kacar(bag.href)}" rel="noopener noreferrer">${kacar(bag.etiket)}</a>`;
  }

  const notlar = kaynak.notlar.length
    ? kaynak.notlar.map((n) => `<p class="kk-not">${kacar(n)}</p>`).join("")
    : `<p class="kk-not kk-not-yok">Bu kaynak için Türkçe kullanım notu henüz yazılmadı.</p>`;

  const ikinci = kaynak.ikinciKatmanlar.length
    ? `<p class="kk-not kk-not-ikili">Aynı eser başka bir kayıtta ${kaynak.ikinciKatmanlar
        .map((k) => (KATMAN[k]?.ad ?? k).toLocaleLowerCase("tr-TR")).join(" ve ")} rolünde kullanılıyor.</p>`
    : "";

  const yazilar = kaynak.yazilar.length
    ? `<p class="kk-yazilar"><span>Kullanıldığı dosyalar:</span> ${kaynak.yazilar
        .map((y) => `<a href="articles/${kacar(y.slug)}.html#bulgu-${kacar(capa(y.bulguId, "kayit"))}">${kacar(y.yazi.cardTitle || y.yazi.title)}</a>`)
        .join("")}</p>`
    : `<p class="kk-yazilar kk-yazilar-yok"><span>Kullanıldığı dosyalar:</span> henüz yayımlanmış bir yazıya bağlı değil.</p>`;

  const ara = [kunye.title, (kunye.authors || []).join(" "), kunye.year, kunye.publisher,
    kunye.container, kunye.institution, kaynak.notlar.join(" "),
    kaynak.yazilar.map((y) => y.yazi.cardTitle || y.yazi.title).join(" ")]
    .filter(Boolean).join(" ").toLocaleLowerCase("tr-TR");

  return `<li class="kk-girdi" id="kaynak-${kacar(capa(kaynak.id, "k"))}" data-ara="${kacar(ara)}">`
    + `<p class="kk-baslik">${basligiBagla}</p>`
    + (satir ? `<p class="kk-kunye">${satir}</p>` : "")
    + `<p class="kk-etiketler">${tanimlayici}${rozetler(kaynak)}</p>`
    + `${notlar}${ikinci}${yazilar}</li>`;
}

/**
 * Kaynakça sayfasının tam belgesi.
 *
 * @param bundle   findings.bundle.json içeriği
 * @param articles yazı envanteri
 * @param origin   mutlak adresler için köken
 */
export function renderKaynakca(bundle, articles, origin) {
  const kaynaklar = kaynaklariTopla(bundle, articles);
  const kayitSayisi = (Array.isArray(bundle) ? bundle : []).length;
  const yaziSayisi = (articles ?? []).length;
  const bagliSayisi = kaynaklar.filter((k) => bagAdresi(k.kunye)).length;
  const notluSayisi = kaynaklar.filter((k) => k.notlar.length).length;

  const gruplar = KATMAN_SIRA.map((katman) => ({
    katman,
    ...KATMAN[katman],
    girdiler: kaynaklar
      .filter((k) => k.katman === katman)
      // Yıl azalan: en yeni iş başı çeker. Yılsız birincil metinler (Kojiki,
      // Rigveda gibi) en sona, kendi aralarında alfabetik.
      .sort((a, b) => (b.kunye.year ?? -Infinity) - (a.kunye.year ?? -Infinity)
        || String(a.kunye.title ?? "").localeCompare(String(b.kunye.title ?? ""), "tr")),
  })).filter((g) => g.girdiler.length);

  const gezinti = gruplar
    .map((g) => `<a href="#${g.katman}"><b>${kacar(g.ad)}</b><small>${g.girdiler.length}</small></a>`)
    .join("");

  const bolumler = gruplar.map((g) => `<section class="kk-bolum" id="${g.katman}" aria-labelledby="${g.katman}-baslik">
    <h2 id="${g.katman}-baslik">${kacar(g.ad)} <span class="kk-sayi">${g.girdiler.length}</span></h2>
    <p class="kk-bolum-aciklama">${kacar(g.aciklama)}</p>
    <ol class="kk-liste">${g.girdiler.map(girdi).join("")}</ol>
  </section>`).join("");

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kaynakça — Kanıt Atlası",
    url: `${origin}/kaynakca.html`,
    inLanguage: "tr-TR",
    description: `Kanıt Atlası bulgu kayıtlarının arkasındaki ${kaynaklar.length} kaynak künyesi; her biri Türkçe kullanım notu ve erişim bağlantısıyla.`,
    isPartOf: { "@type": "WebSite", name: "Kanıt Atlası", url: `${origin}/` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: kaynaklar.length,
      itemListOrder: "https://schema.org/ItemListUnordered",
    },
  }, null, 2).replaceAll("<", "\\u003c");

  const aciklama = `Kanıt Atlası'ndaki ${kayitSayisi} bulgu kaydının arkasındaki ${kaynaklar.length} kaynak: yazar, yıl, tanımlayıcı, Türkçe kullanım notu ve hangi dosyada geçtiği.`;

  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#f3efe7">
  <meta name="color-scheme" content="light dark">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="description" content="${kacar(aciklama)}">
  <link rel="canonical" href="${origin}/kaynakca.html">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Kanıt Atlası">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Kaynakça — Kanıt Atlası">
  <meta property="og:description" content="${kacar(aciklama)}">
  <meta property="og:url" content="${origin}/kaynakca.html">
  <meta property="og:image" content="${origin}/assets/og-image.webp">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="675">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Kaynakça — Kanıt Atlası">
  <meta name="twitter:description" content="${kacar(aciklama)}">
  <meta name="twitter:image" content="${origin}/assets/og-image.webp">
  <title>Kaynakça — Kanıt Atlası</title>
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..800,0..100,0..1&family=Karla:wght@400..800&family=JetBrains+Mono:wght@500;600;700&display=swap">
  <link rel="stylesheet" href="assets/styles-core.css">
  <link rel="stylesheet" href="assets/styles-components.css">
  <link rel="stylesheet" href="assets/kaynakca.css">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <a class="skip-link" href="#main">İçeriğe geç</a>
  <header class="site-header" id="top">
    <div class="site-header__inner">
      <a class="brand" href="index.html" aria-label="Kanıt Atlası ana sayfası">
        <span class="brand__mark" aria-hidden="true"><img src="assets/logo-mark.svg" alt=""></span>
        <span class="brand__copy"><strong>Kanıt Atlası</strong><small>Tarihin Pusulası</small></span>
      </a>
      <nav class="main-nav" id="mainNav" aria-label="Ana menü">
        <a href="index.html#yazilar">Yazılar</a><a href="konular.html">Konular</a><a href="dist/zaman-cizelgesi.html">Zaman Çizelgesi</a><a href="dist/bulgu-veri-tabani.html">Veri Tabanı</a><a href="dist/kanit-denetimi.html">Kanıt Denetimi</a><a href="hakkinda.html">Hakkında</a><a href="duzeltmeler.html">Düzeltmeler</a>
      </nav>
      <div class="header-actions"><a class="search-trigger" href="index.html?q=" aria-label="Yazılarda ara"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg><span>Ara…</span><kbd>Ctrl + K</kbd></a><button class="theme-switch" id="themeToggle" type="button" aria-label="Koyu temaya geç" aria-pressed="false"><svg class="theme-switch__sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/></svg><span class="theme-switch__track"><span></span></span></button><button class="menu-toggle" id="menuToggle" type="button" aria-label="Menüyü aç" aria-controls="mainNav" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div>
    </div>
  </header>
  <main id="main" class="kk-sayfa">
    <header class="kk-head">
      <p class="eyebrow">${kaynaklar.length} künye · ${kayitSayisi} bulgu kaydı · ${yaziSayisi} araştırma dosyası</p>
      <h1>Kaynakça</h1>
      <p>Bu sayfa bir okuma tavsiyesi listesi değil. Sitedeki her bulgu kaydının dayandığı kaynakların
      tamamını, kullanıldıkları rolle birlikte tek yerde toplar. Her künyenin altındaki Türkçe not,
      o kaynağın <strong>hangi iddia için ve nasıl</strong> kullanıldığını söyler; kitabın özeti ya da
      değerlendirmesi değildir.</p>
      <p>Kaynaklar beş katmanda gruplanmıştır. Katman, kaynağın kalitesini değil <strong>kanıta olan
      uzaklığını</strong> ölçer: bir kazı raporu ile aynı kazıyı anlatan gazete haberi aynı şeyi
      söyleyebilir, ama ikisi zincirin farklı halkalarıdır. Her katmanın içinde en yeni iş başta durur.</p>
      <dl class="kk-olcum">
        <div><dt>Künye</dt><dd>${kaynaklar.length}</dd></div>
        <div><dt>Bağlantılı</dt><dd>${bagliSayisi}</dd></div>
        <div><dt>Türkçe notlu</dt><dd>${notluSayisi}</dd></div>
        <div><dt>Katman</dt><dd>${gruplar.length}</dd></div>
      </dl>
      <nav class="kk-gezinti" aria-label="Katmanlara git">${gezinti}</nav>
      <form class="kk-arama" role="search" onsubmit="return false"><label for="kkArama">Kaynaklarda ara</label><input id="kkArama" type="search" autocomplete="off" placeholder="yazar, başlık, konu…" enterkeyhint="search"><output class="kk-arama-sonuc" id="kkSonuc" for="kkArama"></output></form>
    </header>
    ${bolumler}
    <section class="kk-bolum kk-kapanis">
      <h2>Bir hata gördüyseniz</h2>
      <p>Yanlış künye, ölü bağlantı ya da yanlış katmanlanmış bir kaynak fark ederseniz bildirin;
      düzeltmeler <a href="duzeltmeler.html">açık günlüğe</a> yazılır. Bağlantı denetimi her derlemede
      otomatik koşuyor, ama katman kararı insan kararıdır ve yanılabilir.</p>
    </section>
  </main>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div><strong>Kanıt Atlası</strong><p>İnsanlık tarihine kanıt, karşı kanıt ve kaynak izlenebilirliği üzerinden bakan Türkçe araştırma arşivi.</p></div>
      <p><a href="konular.html">Konular</a> · <a href="kaynakca.html">Kaynakça</a> · <a href="hakkinda.html">Hakkında</a> · <a href="duzeltmeler.html">Düzeltmeler</a> · <a href="feed.xml">RSS</a></p>
      <p>Yazılar <a href="https://creativecommons.org/licenses/by/4.0/deed.tr" rel="license noopener" target="_blank">CC BY 4.0</a>, kod <a href="https://github.com/turer73/insanlik-tarihi/blob/main/LICENSE" rel="noopener" target="_blank">MIT</a>.</p>
      <span>© <span class="hub-year"></span> Kanıt Atlası</span>
    </div>
  </footer>
  <script src="assets/site-shell.js"></script>
  <script src="assets/kaynakca.js"></script>
</body>
</html>
`;
}
