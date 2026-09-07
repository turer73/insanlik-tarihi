// Dosya başına gerçek değişiklik tarihi — git geçmişinden.
//
// SORUN: sitemap.xml'in lastmod alanı DERLEME GÜNÜNÜ yazıyordu. Yani 31
// URL'nin hepsi "bugün güncellendi" diyordu; oysa çoğu aylardır değişmemişti.
// Arama motorlarına yanlış bilgi vermek bir yana, lastmod'un sinyal değerini
// tamamen sıfırlıyordu: her şey her gün değişiyorsa hiçbir şey değişmiyor
// demektir.
//
// ÇÖZÜM: tarih git geçmişinden okunur — bir dosyaya dokunan son commit'in
// tarihi. Çalışma ağacında değişmiş (veya hiç işlenmemiş) dosyalar için bugün
// kullanılır; çünkü dosya gerçekten bugün değişti, sadece henüz commit
// edilmedi.
//
// ÜÇ ORTAM, ÜÇ DURUM — bu yüzden anlık görüntü dosyası var:
//   1. Yerel makine: tam geçmiş var, tarihler hesaplanır ve data/lastmod.json
//      YENİDEN YAZILIR. Elle çalıştırılacak bir adım yok, unutulamaz.
//   2. GitHub Actions: actions/checkout varsayılan olarak SIĞ klonlar
//      (depth 1). git var ama geçmiş yok - hesaplasak her dosyaya HEAD
//      commit'inin tarihini verirdi. Bu yüzden hesaplamaz, anlık görüntüyü
//      okur.
//   3. Vercel derlemesi: .git hiç yok (CLI dosyaları yükler, klonlamaz).
//      Anlık görüntüyü okur.
//
// Anlık görüntüde karşılığı olmayan bir yol için bugüne düşülür - yanlış ama
// güvenli taraf: yeni dosya gerçekten yeni olduğu için.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Tarihi izlenen yollar. Yazılar ve araçlar sitemap'e, yayın tarihi RSS'e gider.
const IZLENEN = ["articles", "dist", "index.html", "assets", "data/articles.json"];

const GUNLUK = /^\d{4}-\d{2}-\d{2}$/;

function git(root, args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    maxBuffer: 32 * 1024 * 1024,
  });
}

// Tam geçmişe sahip bir depo mu? Sığ klonda hesaplama YANLIŞ sonuç verir,
// bu yüzden ayrıca kontrol ediliyor - git'in varlığı yetmiyor.
function tamGecmis(root) {
  try {
    git(root, ["rev-parse", "--git-dir"]);
    return git(root, ["rev-parse", "--is-shallow-repository"]).trim() === "false";
  } catch {
    return false;
  }
}

/**
 * `git log --format=%cs --name-only` çıktısını ayrıştırır.
 *
 * git log yeniden eskiye sıralıdır; bir yolun İLK görülüşü SON değişiklik,
 * SON görülüşü İLK yayındır. Saf işlev - test edilebilsin diye dışa açık.
 */
export function ayristir(cikti) {
  const lastmod = {};
  const published = {};
  let tarih = null;

  for (const satir of cikti.split("\n")) {
    const yol = satir.trim();
    if (!yol) continue;
    if (GUNLUK.test(yol)) { tarih = yol; continue; }
    if (!tarih) continue; // tarih görülmeden gelen satır: yok say
    if (!lastmod[yol]) lastmod[yol] = tarih;
    published[yol] = tarih;
  }

  return { lastmod, published };
}

/**
 * `git status --porcelain` çıktısındaki yolları bugüne çeker: çalışma
 * ağacında değişmiş veya hiç işlenmemiş dosya bugün değişmiştir.
 * Saf işlev - verilen nesneleri yerinde günceller ve geri döndürür.
 */
export function calismaAgaciniUygula(harita, durumCiktisi, bugun) {
  for (const satir of durumCiktisi.split("\n")) {
    if (!satir.trim()) continue;
    const ham = satir.slice(3).trim();
    const yol = ham.includes(" -> ") ? ham.split(" -> ")[1] : ham;
    const temiz = yol.replace(/^"|"$/g, "");
    harita.lastmod[temiz] = bugun;
    if (!harita.published[temiz]) harita.published[temiz] = bugun;
  }
  return harita;
}

function gecmistenHesapla(root, bugun) {
  const harita = ayristir(git(root, [
    "log", "--format=%cs", "--name-only", "--no-renames", "--", ...IZLENEN,
  ]));
  return calismaAgaciniUygula(
    harita,
    git(root, ["status", "--porcelain", "--", ...IZLENEN]),
    bugun,
  );
}

function anlikGoruntuOku(root) {
  try {
    const ham = JSON.parse(readFileSync(join(root, "data", "lastmod.json"), "utf8"));
    return { lastmod: ham.lastmod ?? {}, published: ham.published ?? {} };
  } catch {
    return { lastmod: {}, published: {} };
  }
}

/**
 * Yol -> tarih eşlemesi döndürür ve tam geçmiş varsa anlık görüntüyü tazeler.
 * `kaynak` alanı hangi yoldan gelindiğini söyler; derleme çıktısında yazdırılır
 * ki sessizce yanlış ortamda çalışmak fark edilsin.
 */
export function tarihler(root, bugun) {
  if (!tamGecmis(root)) {
    return { ...anlikGoruntuOku(root), bugun, kaynak: "anlik-goruntu" };
  }

  const hesap = gecmistenHesapla(root, bugun);
  const siralı = (nesne) =>
    Object.fromEntries(Object.keys(nesne).sort().map((k) => [k, nesne[k]]));
  const govde = { lastmod: siralı(hesap.lastmod), published: siralı(hesap.published) };

  // Anlık görüntü yalnızca içeriği değiştiğinde yazılır; aksi halde her
  // derleme dosyanın zaman damgasını oynatır ve gereksiz fark üretir.
  const yol = join(root, "data", "lastmod.json");
  const yeni = `${JSON.stringify(govde, null, 2)}\n`;
  let eski = null;
  try { eski = readFileSync(yol, "utf8"); } catch { /* ilk üretim */ }
  if (eski !== yeni) writeFileSync(yol, yeni, "utf8");

  return { ...govde, bugun, kaynak: "git" };
}

/** Bir yolun son değişiklik tarihi; bilinmiyorsa bugün. */
export function sonDegisiklik(t, yol) {
  return t.lastmod[yol] ?? t.bugun;
}

/** Bir yolun ilk yayın tarihi; bilinmiyorsa son değişiklik. */
export function ilkYayin(t, yol) {
  return t.published[yol] ?? sonDegisiklik(t, yol);
}

/** Verilen yolların en yenisi. Ana sayfa için: içeriğinden biri değiştiyse o da değişti. */
export function enYeni(t, yollar) {
  let en = null;
  for (const yol of yollar) {
    const d = t.lastmod[yol];
    if (d && (!en || d > en)) en = d;
  }
  return en ?? t.bugun;
}
