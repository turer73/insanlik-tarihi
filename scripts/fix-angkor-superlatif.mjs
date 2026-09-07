#!/usr/bin/env node
// Taş Tepeler denetiminin devamı: "en büyük" iddialarında karşı tarafın
// da ölçülüp ölçülmediğini sorgulayan tarama, angkor-lidar-nufus kaydında
// aynı şekli buldu.
//
// Sorun: "sanayi öncesi dünyanın bilinen en büyük yerleşim kompleksi"
// iddiası, Angkor için TARANAN PEYZAJI (3.000 km²+) ölçüyor. Karşılaştırıldığı
// yerleşimler için hangi alanın ölçüldüğü kayıtta belirtilmemiş ve
// counter_evidence hiç yok. Bu, gobekli-karahan-alan-karsilastirmasi'ndaki
// hatanın aynı şekli.
//
// Kaydı silmiyoruz - iddia hakemli kaynaklı ve muhtemelen doğru.
// Eksik olan, karşılaştırmanın NEYİ ölçtüğünün kayda geçmemiş olması.

import { readFileSync, writeFileSync } from "node:fs";

const PATH = "data/findings/antik-siteler.json";
const list = JSON.parse(readFileSync(PATH, "utf8"));
const i = list.findIndex((r) => r.id === "angkor-lidar-nufus");
if (i === -1) { console.error("angkor-lidar-nufus bulunamadı"); process.exit(1); }

const r = list[i];

r.counter_evidence = [
  ...(r.counter_evidence ?? []),
  "ÖLÇÜM KATEGORİSİ UYARISI: 'en büyük yerleşim kompleksi' iddiasında Angkor için ölçülen şey, LiDAR ile TARANAN PEYZAJDIR (3.000 km²'yi aşan alan) - kompakt bir kent çekirdeği değil. Karşılaştırıldığı yerleşimler için hangi alanın ölçüldüğü (kent çekirdeği mi, tarımsal hinterland dahil mi) kaynaklarda tutarlı biçimde belirtilmez. İki tarafın aynı şeyi ölçtüğü doğrulanmadan superlatif kesin sayılmamalıdır.",
  "Yayılmış, düşük yoğunluklu bir kentleşme ile yoğun bir kent çekirdeğini alan üzerinden karşılaştırmak kategori hatasına açıktır; nüfus yoğunluğu ve yapı yoğunluğu ayrı ölçütlerdir.",
];

r.open_questions = [
  ...(r.open_questions ?? []),
  "Superlatif karşılaştırmada öteki yerleşimler için hangi alan ölçülüyor? İki taraf aynı ölçütle karşılaştırılmadan 'en büyük' iddiası kapanmaz.",
];

r.divergence = (r.divergence ?? "") +
  " AYRICA (2026-09-07 denetimi): 'en büyük' superlatifi, Angkor için taranan peyzajı ölçer; karşılaştırıldığı yerleşimler için aynı ölçütün kullanıldığı doğrulanmamıştır.";

r.checked = "2026-09-07";
r.volatile = true;

writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
console.log("angkor-lidar-nufus güncellendi:");
console.log(`  counter_evidence: ${r.counter_evidence.length} kalem`);
console.log(`  open_questions:   ${r.open_questions.length} kalem`);
console.log(`  volatile:         ${r.volatile}`);
