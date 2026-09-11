#!/usr/bin/env node
// antik-siteler.json: divergence alanı olmayan üç kayda popular_claim ve
// divergence yazar. Uruk dosyasında yapılanın aynısı.
//
// NEDEN BU ÜÇÜ: dosyadaki 47 kaydın 44'ünde popüler iddia ile kanıtın nerede
// ayrıldığı yazılıydı; bu üçünde yoktu. Alan boş olduğu için değil, üçünün de
// GERÇEK bir popüler karşılığı olduğu için yazıldı:
//   - sarsenler: "nereden geldiği bilinmiyor" yaygın bir inanç, 2020'de çözüldü
//   - Karahan sekiliği: "amfitiyatro" benzetmesi haberlerde tanımlama gibi dolaşıyor
//   - Petra barajı: ziyaretçiye gösterilen baraj Nabati sanılıyor, 1963 sonrası yapı
//
// YAZILMAYAN: iskenderiye-metin-elestirisi-dogdu da divergence taşımıyor ama
// o başka bir dosyada ve bu turun kapsamı dışında - dokunulmadı.
//
// divergence_type değerleri şemadaki enum'dan seçildi; yeni değer üretilmedi.

import { readFileSync, writeFileSync } from "node:fs";

const PATH = "data/findings/antik-siteler.json";
const list = JSON.parse(readFileSync(PATH, "utf8"));

const YAZ = {
  "stonehenge-sarsen-west-woods": {
    popular_claim:
      "Stonehenge'in dev taşlarının nereden geldiği hâlâ bilinmiyor; bu anıtın çözülmemiş gizemlerinden biri.",
    divergence:
      "Büyük sarsenler için bu soru 2020'de kapandı: 52 taşın 50'si aynı jeokimyasal imzayı taşıyor ve " +
      "kaynak, anıtın yalnızca ~25 km kuzeyindeki West Woods. Gizem anlatısı üç ayrı soruyu (sarsenler, " +
      "mavitaşlar, Sunak Taşı) tek bir soruya indirip hepsini açık gösteriyor - oysa üçünün cevabı da farklı " +
      "ve biri artık verilmiş durumda.",
    divergence_type: ["guncellenmemis", "kategori-hatasi"],
  },
  "karahan-tepe-basamakli-yapi": {
    popular_claim:
      "Karahan Tepe'de 11.000 yıllık bir amfitiyatro bulundu.",
    divergence:
      "Yapı gerçek ve basamaklı düzeni belgeli. 'Amfitiyatro' ise bir BENZETMEDİR, tanımlama değil: " +
      "terim Roma dünyasının gösteri mimarisine ait bir kategoriyi Neolitik bir yapıya taşıyor ve " +
      "işlevi baştan varsaymış oluyor. Kazı henüz ayrıntılı yayın vermedi; yapının ne için kullanıldığı " +
      "bilinmiyor.",
    divergence_type: ["kategori-hatasi", "medya-abartisi"],
  },
  "petra-sel-baraji-yeniden-kuruldu": {
    popular_claim:
      "Siq girişindeki baraj, Nabatilerin iki bin yıl önce yaptığı ve hâlâ çalışan sel kontrol yapısıdır.",
    divergence:
      "Nabati barajı gerçekten vardı ve temeli hâlâ yerinde. Ama ziyaretçinin gördüğü yapı 1963'teki " +
      "ölümcül selden SONRA o temel üzerine yeniden inşa edildi. 'Hâlâ çalışıyor' ifadesi iki bin yıllık " +
      "kesintisiz işleyiş çağrıştırıyor; gerçekte sistem bir noktada devre dışı kalmış, felaket yaşanmış ve " +
      "modern mühendislikle yeniden kurulmuştur.",
    divergence_type: ["turizm-kopyalamasi", "hayatta-kalma-yanliligi"],
  },
};

let n = 0;
for (const r of list) {
  const y = YAZ[r.id];
  if (!y) continue;
  if (r.divergence) { console.error(`${r.id}: zaten divergence var, dokunulmadı`); continue; }
  // Alan sırası şemadaki sırayı izlesin diye kaydı yeniden kuruyoruz.
  const { open_questions, checked, volatile, used_in, sources, evidence, counter_evidence, review, ...bas } = r;
  const yeni = {
    ...bas, ...y,
    ...(open_questions ? { open_questions } : {}),
    ...(checked ? { checked } : {}), ...(volatile !== undefined ? { volatile } : {}),
    ...(used_in ? { used_in } : {}),
    sources, evidence, counter_evidence, review,
  };
  list[list.indexOf(r)] = yeni;
  n += 1;
  console.log(`  divergence yazıldı  ${r.id}  [${y.divergence_type.join(", ")}]`);
}

writeFileSync(PATH, `${JSON.stringify(list, null, 2)}\n`, "utf8");
const kalan = list.filter((r) => !r.divergence).length;
console.log(`\n${n} kayıt güncellendi. ${PATH}: divergence'sız kalan ${kalan}.`);
