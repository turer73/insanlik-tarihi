#!/usr/bin/env node
// Kaynakçadaki dış bağlantıları tek tek dener ve docs/kaynak-baglantilari.md yazar.
//
// NEDEN DERLEMEDE DEĞİL: 276 dış adrese her derlemede istek atmak yanlış olurdu.
// Hız sınırına takılır, ağ dalgalanması yüzünden derlemeyi rastgele düşürür ve
// karşı tarafa gereksiz yük bindirir. Bu yüzden ELDE çalıştırılan ayrı bir betik.
//
// DÜRÜSTLÜK NOTU: bu betik yazılmadan önce kaynakça sayfasında "bağlantı denetimi
// her derlemede otomatik koşuyor" yazıyordu. Doğru değildi - audit-urls yalnız
// sitenin KENDİ 43 adresini tablolar ve onları bile getirmez, Search Console
// anlık görüntüsünden okur. Cümle düzeltildi, denetim ise gerçekten yazıldı.
//
// 403 ÖLÜ DEĞİLDİR: bazı yayıncılar (UNESCO, WorldCat, birkaç dergi) betik
// isteklerini kapatıyor. Bu, adresin çürüdüğü anlamına gelmez. Rapor kodu
// olduğu gibi yazar ve 403/405'i ayrı bir kovada tutar; "ölü" demez.
//
// BU BETİĞİN GÖREMEDİĞİ ŞEY — YUMUŞAK 404. Bazı siteler silinmiş sayfaya
// "bulunamadı" metni gösterip yine de 200 döndürüyor. Canlı örnek: Museum of
// the Bible'ın bir duyuru adresi 200 verdi, sayfanın kendisi "Page Not Found"
// sayfasıydı. Yanıt kodu bunu ayırt edemez. Yani bu rapor "sağlam" dediğinde
// söylediği şey "sunucu 2xx döndü"dür, "sayfa hâlâ o içeriği taşıyor" değil.
// İçerik denetimi insan işidir ve bu betiğin yerine geçmez.
//
// Kullanım:
//   node scripts/denetle-kaynak-baglantilari.mjs
//   node scripts/denetle-kaynak-baglantilari.mjs --strict   # 404 varsa çıkış 1

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { kaynaklariTopla } from "./lib/kaynakca.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KATI = process.argv.includes("--strict");
const ES_ZAMANLI = 12;
const HOST_SINIRI = 3;    // ayni sunucuya en fazla bu kadar es zamanli istek
const ZAMAN_ASIMI = 12000;
const AJAN = "Mozilla/5.0 (compatible; KanitAtlasiLinkCheck/1.0; +https://kanitatlasi.com/)";

const DOI = /^10\.\d{4,9}\/\S+$/i;

// NE ÖLÇÜLÜYOR: bir DOI için sorulacak soru "kayıtlı mı"dır, "yayıncının açılış
// sayfası şu an ayakta mı" değil. doi.org zaten 30x ile yayıncıya yönlendirir;
// o yönlendirmeyi KOVALAMAK denetimi yayıncının yavaşlığına ve paywall'ına
// bağlar. İlk sürüm kovalıyordu ve 280 bağlantı yirmi dakikayı geçti.
//
// Bu yüzden tanımlayıcılarda yönlendirme TAKİP EDİLMEZ: doi.org'dan 30x gelmesi
// "DOI çözülüyor" demektir ve ölçmek istediğimiz tam olarak budur. Aynısı
// Open Library ISBN adresleri için geçerli. Düz URL'lerde yönlendirme
// izlenir - orada sayfanın taşınıp taşınmadığını bilmek işe yarar.
function hedef(kunye) {
  if (typeof kunye.url === "string" && /^https?:\/\//i.test(kunye.url)) {
    return { url: kunye.url, izle: true };
  }
  if (typeof kunye.doi === "string" && DOI.test(kunye.doi)) {
    return { url: `https://doi.org/${kunye.doi}`, izle: false };
  }
  const isbn = String(kunye.isbn ?? "").replace(/[^0-9Xx]/g, "");
  if (isbn.length === 10 || isbn.length === 13) {
    return { url: `https://openlibrary.org/isbn/${isbn}`, izle: false };
  }
  return null;
}

// Aynı sunucuya aynı anda ONLARCA istek atmak "ölü bağlantı" üretir: ilk denemede
// 88 ISBN'in tamamı Open Library'den ulaşılamadı çıktı. Sorun adreslerde değil,
// bizim hızımızdaydı.
//
// İlk çözüm host başına TEK sıraydı ve fazla ağırdı: 93 DOI ardışık dizilince,
// üstelik yavaş yayıncı yönlendirmeleriyle, koşu yarım saati aştı ve bitmedi.
// Doğru ayar arada: host başına birkaç eş zamanlı istek.
const hostSayaci = new Map();
const hostBekleyen = new Map();

function hostAl(host) {
  const acik = hostSayaci.get(host) ?? 0;
  if (acik < HOST_SINIRI) { hostSayaci.set(host, acik + 1); return Promise.resolve(); }
  return new Promise((coz) => {
    const kuyruk = hostBekleyen.get(host) ?? [];
    kuyruk.push(coz);
    hostBekleyen.set(host, kuyruk);
  });
}

function hostBirak(host) {
  const kuyruk = hostBekleyen.get(host) ?? [];
  const siradaki = kuyruk.shift();
  if (siradaki) { siradaki(); return; }
  hostSayaci.set(host, Math.max(0, (hostSayaci.get(host) ?? 1) - 1));
}

async function hostta(url, is) {
  let host;
  try { host = new URL(url).host; } catch { host = "?"; }
  await hostAl(host);
  try { return await is(); } finally { hostBirak(host); }
}

async function dene(url, izle) {
  const iste = async (method) => {
    const iptal = new AbortController();
    const saat = setTimeout(() => iptal.abort(), ZAMAN_ASIMI);
    try {
      const y = await fetch(url, {
        method,
        redirect: izle ? "follow" : "manual",
        signal: iptal.signal,
        headers: { "User-Agent": AJAN, Accept: "*/*" },
      });
      // Yönlendirme izlenmiyorsa varılan adres Location başlığındadır.
      const son = izle ? y.url : (y.headers.get("location") ?? y.url);
      return { kod: y.status, son };
    } finally {
      clearTimeout(saat);
    }
  };
  try {
    // Önce HEAD: gövdeyi indirmeden yanıt kodu yeter.
    const h = await iste("HEAD");
    // Bazı sunucular HEAD'i desteklemez; 405/501'de GET'e düş.
    if (h.kod === 405 || h.kod === 501) return await iste("GET");
    return h;
  } catch (hata) {
    // ZAMAN AŞIMINDAN SONRA GET DENEME. Sunucu zaten yanıt vermedi; ikinci
    // istek yalnız süreyi ikiye katlar. GET'e yalnız HEAD protokol düzeyinde
    // reddedildiğinde (ağ hatası) düşülür.
    if (hata?.name === "AbortError") return { kod: 0, hata: "zaman aşımı" };
    try {
      return await iste("GET");
    } catch (ikinci) {
      return { kod: 0, hata: String(ikinci?.name === "AbortError" ? "zaman aşımı" : ikinci?.message ?? ikinci) };
    }
  }
}

async function havuzda(isler, sinir) {
  const sonuc = new Array(isler.length);
  let sira = 0;
  const isci = async () => {
    while (sira < isler.length) {
      const i = sira++;
      sonuc[i] = await isler[i]();
    }
  };
  await Promise.all(Array.from({ length: Math.min(sinir, isler.length) }, isci));
  return sonuc;
}

const bugun = ((d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`)(new Date());

const bundle = JSON.parse(await readFile(path.join(ROOT, "data", "findings.bundle.json"), "utf8"));
const ctx = { window: {} };
vm.runInNewContext(await readFile(path.join(ROOT, "assets", "articles-data.js"), "utf8"), ctx);
const kaynaklar = kaynaklariTopla(bundle, ctx.window.ITArticles);

const denenecek = kaynaklar
  .map((k) => ({ k, h: hedef(k.kunye) }))
  .filter((x) => x.h)
  .map((x) => ({ k: x.k, url: x.h.url, izle: x.h.izle }))
  .sort((a, b) => a.k.id.localeCompare(b.k.id));

console.log(`${kaynaklar.length} künye · ${denenecek.length} bağlantı deneniyor (${ES_ZAMANLI} eş zamanlı)…`);

let bitti = 0;
const ilerle = () => {
  bitti += 1;
  // Uzun koşuda ilerleme gorunmezse takilmayla yavasligi ayirt edilemiyor.
  if (bitti % 20 === 0 || bitti === denenecek.length) {
    process.stdout.write(`  ${bitti}/${denenecek.length}
`);
  }
};

let sonuclar = await havuzda(
  denenecek.map(({ k, url, izle }) => async () => {
    const y = await hostta(url, () => dene(url, izle));
    ilerle();
    return { k, url, ...y };
  }),
  ES_ZAMANLI,
);

// İKİNCİ TUR: bağlantı kurulamayanlar tek tek, yavaş yeniden denenir. İlk turdaki
// "ulaşılamadı" çoğunlukla karşı tarafın hız sınırıdır, adresin çürümesi değil.
const tekrar = sonuclar.filter((s) => !s.kod);
if (tekrar.length) {
  console.log(`ikinci tur: ${tekrar.length} bağlantı tek tek yeniden deneniyor…`);
  for (const s of tekrar) {
    await new Promise((r) => setTimeout(r, 400));
    const y = await dene(s.url, s.izle);
    s.kod = y.kod; s.son = y.son; s.hata = y.hata;
  }
}

const kova = { saglam: [], yonlendi: [], engelli: [], olu: [], ulasilamadi: [] };
for (const s of sonuclar) {
  // Tanımlayıcılarda 30x BAŞARIDIR: doi.org yayıncıya yönlendiriyorsa DOI kayıtlı,
  // Open Library /isbn/ yönlendiriyorsa ISBN katalogda var demektir.
  if (!s.izle && s.kod >= 300 && s.kod < 400) kova.saglam.push(s);
  else if (s.kod >= 200 && s.kod < 300) (s.izle && s.son && s.son !== s.url ? kova.yonlendi : kova.saglam).push(s);
  // 405/406 da botu reddetmektir, ölü sayfa değil: HEAD reddedilince GET'e
  // düşülüyor ve o da reddediliyorsa sunucu bizi istemiyor demektir. Canlı
  // örnek: NASA ADS özet sayfası tarayıcı başlığıyla bile 405 veriyor ama
  // sayfa gerçekte duruyor.
  else if ([401, 403, 405, 406, 429, 451].includes(s.kod)) kova.engelli.push(s);
  else if (s.kod >= 300 && s.kod < 600) kova.olu.push(s);
  else kova.ulasilamadi.push(s);
}

const kacar = (v) => String(v ?? "").replaceAll("|", "\\|");
const satir = (s) => `| ${kacar((s.k.kunye.title || s.k.id).slice(0, 80))} | ${s.k.katman} | [bağlantı](${s.url}) | ${s.kod || s.hata || "?"} |`;

const rapor = `# Kaynak bağlantı denetimi

Son deneme: **${bugun}** · ${denenecek.length} bağlantı · ${kaynaklar.length} künye

Bu tablo **betik tarafından üretilir** (\`node scripts/denetle-kaynak-baglantilari.mjs\`).
Derlemenin parçası DEĞİLDİR: 276 dış adrese her derlemede istek atmak hız sınırına
takılır ve derlemeyi ağ dalgalanmasına bağımlı kılardı. Elle, aralıklı çalıştırılır.

| Durum | Sayı | Ne demek |
|---|---:|---|
| Sağlam | ${kova.saglam.length} | 2xx döndü |
| Yönlendi | ${kova.yonlendi.length} | 2xx döndü ama adres değişti; künyedeki adres eskimiş olabilir |
| Engelli | ${kova.engelli.length} | 401/403/429 — yayıncı betik isteklerini kapatıyor. **Ölü değil**, tarayıcıda açılır |
| Ölü | ${kova.olu.length} | 4xx/5xx — gerçekten kırık, düzeltilmeli |
| Ulaşılamadı | ${kova.ulasilamadi.length} | Bağlantı kurulamadı ya da zaman aşımı |

${kova.olu.length ? `## Ölü bağlantılar (${kova.olu.length})\n\nBunlar düzeltilmeli.\n\n| Kaynak | Katman | Adres | Kod |\n|---|---|---|---:|\n${kova.olu.map(satir).join("\n")}\n` : "## Ölü bağlantı yok\n"}
${kova.ulasilamadi.length ? `\n## Ulaşılamayanlar (${kova.ulasilamadi.length})\n\nAğ hatası ya da zaman aşımı; tekrar denemeye değer.\n\n| Kaynak | Katman | Adres | Hata |\n|---|---|---|---|\n${kova.ulasilamadi.map(satir).join("\n")}\n` : ""}
${kova.engelli.length ? `\n## Betiğe kapalı olanlar (${kova.engelli.length})\n\nBunlar hata değil. Yayıncı otomatik isteği reddediyor; adres tarayıcıda çalışır.\n\n| Kaynak | Katman | Adres | Kod |\n|---|---|---|---:|\n${kova.engelli.map(satir).join("\n")}\n` : ""}
${kova.yonlendi.length ? `\n## Yönlenenler (${kova.yonlendi.length})\n\nSayfa açılıyor ama adres değişmiş. Çoğu zararsız (http→https, dil eki); künyedeki adresi güncellemeye değer olanlar buradan seçilir.\n\n| Kaynak | Katman | Künyedeki adres | Varılan |\n|---|---|---|---|\n${kova.yonlendi.map((s) => `| ${kacar((s.k.kunye.title || s.k.id).slice(0, 60))} | ${s.k.katman} | [adres](${s.url}) | ${kacar(s.son)} |`).join("\n")}\n` : ""}
`;

await writeFile(path.join(ROOT, "docs", "kaynak-baglantilari.md"), rapor, "utf8");

console.log(`sağlam ${kova.saglam.length} · yönlendi ${kova.yonlendi.length} · engelli ${kova.engelli.length} · ölü ${kova.olu.length} · ulaşılamadı ${kova.ulasilamadi.length}`);
console.log("docs/kaynak-baglantilari.md yazıldı");
for (const s of kova.olu) console.log(`  ÖLÜ ${s.kod}  ${s.url}  (${s.k.id})`);

if (KATI && kova.olu.length) process.exit(1);
