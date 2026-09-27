// Bir atıfın locator'ı kaynağın NERESİNİ söylüyor mu?
//
// Doğrulayıcı uzun süre yalnız tek bir yer tutucu kalıbını arıyordu
// ("paket notundan türetildi"). O kalıp sıfıra indiğinde site genelinde
// 1256 atıfın 1099'u hâlâ ne sayfa, ne alıntı, ne de katalog kimliği
// taşıyordu; 146'sı kaynakta bir yer bile değildi ("Kayıt düzeyi ayrımı").
// Bu modül iki ayrı soruyu ayırır:
//
//   yerTutucuMu  - locator kaynakta bir yer DEĞİL (etiket, meta not).
//   gucluMu      - locator kaynağın neresi olduğunu denetlenebilir biçimde
//                  söylüyor: sayfa/satır, alıntı ya da katalog kimliği.
//
// "Güçlü değil" ile "yer tutucu" aynı şey değildir: "Sonuçlar" ya da
// "Susanoo bölümü" gerçek bir bölümü gösterebilir ama nerede olduğunu
// kesinleştirmez. Yer tutucu ise hiçbir yeri göstermez.

// Üretim betiklerinin bıraktığı eski kalıp.
const ESKI_YER_TUTUCU = /paket notundan türetildi|^ilgili bölüm$/i;

// "X düzeyi" etiketleri ve birkaç kesin meta ifade. Bir "düzey" bir
// kaynağın içinde bir yer olamaz; bu etiketler sitenin kendi akıl yürütmesini
// adlandırır.
// Tekil "düzeyi" ya da yalın "düzey": "Karşılaştırmalı düzeyler" gibi çoğul biçim
// gerçek bir konuyu (ör. kurşun düzeyleri) gösterebildiği için dışarıda. "Kayıt
// tanımı" ve "Kayıt gerekçesi" de UNESCO sayfalarındaki gerçek bölümleri
// (Description, Justification for Inscription) karşılayabildiği için dışarıda.
const META_ETIKET = /düzey(i|leri)?(\s|$)|^kaynak konumu$|^kayıt yokluğu değerlendirmesi$/i;

const SAYFA = /(^|[\s(—–,;])(s|pp?|sf|col)\.?\s*\d|sayfa\s*\d/i;
const SATIR = /satır\s*\d|\blines?\s*\d/i;
const ALINTI = /["“”«»„][^"“”«»„]{12,}["“”«»„]/;
const KIMLIK = new RegExp([
  "\\b(Q\\d{6}|P\\d{6})\\b",            // CDLI bileşik metin / nesne
  "\\bW\\s?\\d{4,}",                      // Uruk kazı numarası
  "\\b(IM|BM|VA)\\s?\\d{3,}",             // müze envanteri
  "Taf\\.|Tafel|Levha|\\bPl\\.|Plate",     // levha
  "§\\s*\\d", "\\bNr\\.\\s*\\d", "\\bNo\\.\\s*\\d",
  "\\bfig\\.\\s*\\d", "\\bAbb\\.\\s*\\d",
  "\\b\\d+:\\d+",                          // bölüm:ayet
  "\\bt\\.\\d", "\\bc\\.\\d\\.\\d",          // ETCSL metin numarası
  "tablet\\s*[IVX]+\\b", "\\b[IVX]+\\.\\s*tablet", "ayet\\s*\\d",
].join("|"), "i");

export function gucluMu(locator) {
  const l = String(locator ?? "");
  return SAYFA.test(l) || SATIR.test(l) || ALINTI.test(l) || KIMLIK.test(l);
}

export function yerTutucuMu(locator) {
  const l = String(locator ?? "").trim();
  if (!l) return true;
  if (ESKI_YER_TUTUCU.test(l)) return true;
  return META_ETIKET.test(l) && !gucluMu(l);
}
