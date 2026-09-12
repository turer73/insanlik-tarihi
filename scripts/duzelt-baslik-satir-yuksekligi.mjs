#!/usr/bin/env node
// Yazi basliklarindaki satir yuksekligini Turkce diakritikleri kaldiracak
// tabana cikarir.
//
// SORUN OLCULDU, TAHMIN EDILMEDI. 375px genislikte, yayimlanan sayfalarda,
// h1'in gercek satir kirilimlari cikarilip her satir ciftinin ust satir
// inisi ile alt satir cikisi canvas TextMetrics ile olculdu:
//
//   Fraunces'ta buyuk harf cikisi   ~0.746em
//   Ş / ğ / ç / y inisi             ~0.219em
//   toplam gereken                  ~0.965em
//
// 29 yazinin 10'unda satirlar FIILEN ust uste biniyordu, 4'u de 2px'in
// altinda paylasiyordu. En kotusu kapadokya: -6.8px ("Kapadokya:" /
// "Ölçülmemiş"). Uruk'ta "Şehir mi, İlk" satirinin Ş sedilasi alttaki
// "Efsane mi?" satirinin E'sine giriyordu.
//
// Bu Turkce'ye ozgu bir kirilma: 0.94-0.99 arasi siki bir display leading
// Ingilizce'de calisir, Ş/ğ/ç/İ ile calismaz.
//
// TABAN 1.15 SECILDI. Once 1.05 denendi ve 10 cakismanin 9'unu cozdu ama
// kapadokya'da -4px kaldi: "Kapadokya:" satirinin y/p inisi (0.25em) ile
// altindaki "Ölçülmemiş" satirinin Ö umlautu (0.90em) ust uste biniyordu.
// Turkce'de en kotu cift budur - inen sedilla/kuyruk ustte, umlautlu buyuk
// harf altta - ve 1.15em ister. 1.05 'cogunlukla yeter' degeriydi; bizi bu
// hataya goturen de tam olarak o yaklasimdi. Olculen gereksinim neyse o
// yazildi. Gorsel bedel: 40px'lik uc satirlik bir baslikta toplam ~8px.
//
// Not: bu yalniz h1 kurallarina dokunur. h2 ve h3 olculdu, 1.02 ve 1.67
// ile esigin uzerindeler.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIZIN = "articles";
const TABAN = 1.15;

const dosyalar = readdirSync(DIZIN).filter((f) => f.endsWith(".html")).sort();
let degisen = 0, dokunulmayan = 0;
const rapor = [];

for (const dosya of dosyalar) {
  const yol = join(DIZIN, dosya);
  const metin = readFileSync(yol, "utf8");
  let yeni = metin;
  const bulunan = [];

  // h1 ile baslayan kural govdelerini tara; icindeki line-height'i esige cek.
  yeni = yeni.replace(/(^|[\s,{}])((?:[a-zA-Z0-9_.#>\-\s]*\b)?h1)(\s*\{)([^}]*)(\})/g,
    (tam, on, secici, ac, govde, kapa) => {
      const m = govde.match(/line-height\s*:\s*([0-9]*\.?[0-9]+)\s*(?=[;}]|$)/);
      if (!m) return tam;
      const deger = parseFloat(m[1]);
      if (!(deger < TABAN)) return tam;
      bulunan.push({ secici: secici.trim(), eski: m[1], yeni: String(TABAN) });
      const yeniGovde = govde.replace(m[0], `line-height:${TABAN}`);
      return `${on}${secici}${ac}${yeniGovde}${kapa}`;
    });

  if (bulunan.length) {
    writeFileSync(yol, yeni, "utf8");
    degisen += 1;
    rapor.push({ dosya, bulunan });
  } else {
    dokunulmayan += 1;
  }
}

for (const r of rapor) {
  console.log(`  ${r.dosya}`);
  for (const b of r.bulunan) console.log(`      ${b.secici}  line-height ${b.eski} -> ${b.yeni}`);
}
console.log(`\n${degisen} dosya guncellendi, ${dokunulmayan} dosyaya dokunulmadi (taban ${TABAN}).`);
