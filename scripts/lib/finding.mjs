// Sürüm 2 bulgu kaydı kurucuları.
//
// Neden var: her yazıda add-*.mjs betiğini sıfırdan yazıyorduk ve kayıtlar
// sürüm 1 düz metin kanıtla çıkıyordu. Sonuç, her yazıda büyüyen bir göç
// borcu. Bu modül v2'yi VARSAYILAN hâle getirir ve kaynağı olmayan kanıt
// yazmayı imkânsızlaştırır: cite() bir kaynak kimliği ister, finding() o
// kimliğin gerçekten var olduğunu doğrular ve yoksa hata fırlatır.
//
// Tasarım kararı: doğrulayıcı zaten aynı kuralları uyguluyor. Burada
// tekrar edilmelerinin sebebi hatayı VERİ YAZILIRKEN, yani bağlamın hâlâ
// elinizde olduğu anda yakalamak - dosya yazıldıktan sonra değil.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const TR_MAP = { ı: "i", İ: "i", ğ: "g", Ğ: "g", ü: "u", Ü: "u",
                 ş: "s", Ş: "s", ö: "o", Ö: "o", ç: "c", Ç: "c" };

/** Türkçe harfleri koruyarak kararlı bir kebab-case kimlik üretir. */
export function slug(text) {
  return String(text)
    .replace(/[ıİğĞüÜşŞöÖçÇ]/g, (ch) => TR_MAP[ch])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Kaynak kaydı. Kimlik zorunludur - v2'nin bütün kanıt bağlantısı buna dayanır.
 * Kimliği elle vermek kasıtlıdır: kaynak kimliği kayıtlar arasında sabit
 * kalmalı ki bir kaynak düzeltildiğinde nereye dokunacağımızı bilelim.
 */
export function source(id, fields) {
  if (!id || typeof id !== "string") throw new Error("source(): kimlik zorunlu");
  const f = fields ?? {};
  const fail = (msg) => { throw new Error(`source('${id}'): ${msg}`); };

  if (!f.tier) fail("tier zorunlu");
  if (!f.title) fail("title zorunlu");
  if (!f.type) fail("type zorunlu (v2)");

  // Katman başına künye kuralları. Doğrulayıcı bunları --strict'te uygular;
  // burada tekrar edilmelerinin sebebi hatayı kaynağı YAZARKEN yakalamak,
  // yani künyeyi hâlâ elinizdeyken - dosya işlendikten gün sonra değil.
  if (f.tier === "peer-reviewed") {
    if (!f.authors?.length) fail("hakemli kaynakta authors zorunlu");
    if (!f.year) fail("hakemli kaynakta year zorunlu");
    if (!f.container && !f.publisher) fail("hakemli kaynakta container veya publisher gerekli");
    if (!f.doi && !f.url && !f.isbn) {
      fail("hakemli kaynakta DOI, URL veya ISBN gerekli - künyeyi doğrulayın, uydurmayın");
    }
  }
  if (f.tier === "institutional") {
    if (!f.institution) fail("kurumsal kaynakta institution zorunlu");
    if (!f.url && !f.publisher) fail("kurumsal kaynakta URL veya publisher gerekli");
  }
  if (f.doi && !/^10\.\d{4,9}\/\S+$/i.test(f.doi)) fail(`DOI biçimi geçersiz: '${f.doi}'`);
  if (f.url && !/^https?:\/\//i.test(f.url)) fail("url http(s) ile başlamalı");
  if (f.url && /^http:\/\//i.test(f.url)) {
    console.warn(`  uyarı  source('${id}'): HTTPS yerine HTTP kullanılıyor`);
  }

  return { id, ...f };
}

/**
 * Kanıt-kaynak bağlantısı.
 * locator: kaynağın NERESİ - "Özet, madde 2", "s. 114", "XI. tablet".
 * Belirsiz bir locator ("kitabın geneli") yazmak yerine kaydı kurmayın;
 * kaynağın neresini okuduğunuzu söyleyemiyorsanız o kanıt henüz hazır değil.
 */
export function cite(sourceRef, locator, supportType = "direct", note) {
  if (!sourceRef) throw new Error("cite(): source_ref zorunlu");
  if (!locator) throw new Error(`cite('${sourceRef}'): locator zorunlu - kaynağın neresi?`);
  const c = { source_ref: sourceRef, locator, support_type: supportType };
  if (note) c.note = note;
  return c;
}

/** Kanıt kalemi. id verilmezse metinden türetilir. */
export function ev(text, cites, opts = {}) {
  if (!text) throw new Error("ev(): text zorunlu");
  const list = Array.isArray(cites) ? cites : [cites];
  if (!list.length) throw new Error(`ev('${text.slice(0, 40)}...'): en az bir cite() gerekli`);
  const item = { id: opts.id ?? slug(text), text, citations: list };
  if (opts.note) item.note = opts.note;
  return item;
}

const COUNTER_TYPES = new Set(["counter", "context", "claim-origin"]);

/**
 * Sürüm 2 kaydı kurar ve tutarlılığını yerinde doğrular.
 * Doğrulayıcının bulacağı hataları, veriyi yazan kişi hâlâ bağlamı
 * hatırlarken yüzüne söyler.
 */
export function finding(record) {
  const id = record.id ?? "(kimliksiz)";
  const fail = (msg) => { throw new Error(`finding('${id}'): ${msg}`); };

  if (!record.id) fail("id zorunlu");
  if (!record.claim) fail("claim zorunlu");
  if (!record.status) fail("status zorunlu");
  if (!record.sources?.length) fail("en az bir kaynak zorunlu");
  if (!record.checked) fail("checked zorunlu");

  const ids = new Set();
  for (const s of record.sources) {
    if (!s.id) fail(`kaynak '${s.title ?? "?"}' kimliksiz - source() ile kurun`);
    if (ids.has(s.id)) fail(`yinelenen kaynak kimliği '${s.id}'`);
    ids.add(s.id);
  }

  const evIds = new Set();
  for (const field of ["evidence", "counter_evidence"]) {
    (record[field] ?? []).forEach((item, i) => {
      if (typeof item === "string") {
        fail(`${field}[${i}] düz metin - v2'de ev() ile kurulmalı: "${item.slice(0, 50)}..."`);
      }
      if (evIds.has(item.id)) fail(`yinelenen kanıt kimliği '${item.id}'`);
      evIds.add(item.id);
      for (const c of item.citations ?? []) {
        if (!ids.has(c.source_ref)) {
          fail(`${field}[${i}] '${c.source_ref}' kaynağına atıf yapıyor ama böyle bir kaynak yok. Var olanlar: ${[...ids].join(", ")}`);
        }
        if (field === "counter_evidence" && !COUNTER_TYPES.has(c.support_type)) {
          fail(`counter_evidence[${i}] support_type '${c.support_type}' - ${[...COUNTER_TYPES].join("|")} bekleniyor`);
        }
      }
    });
  }

  // Proje kuralı: iddianın bir çıpası olmalı.
  const zayif = record.sources.every((s) => ["popular", "unreliable"].includes(s.tier));
  if (zayif) fail("yalnızca popular/unreliable kaynak - iddia desteklenmiyor");

  // review verilmemişse dürüst varsayılan: taslak.
  return { schema_version: 2, ...record, review: record.review ?? { status: "draft" } };
}

/**
 * Kayıtları dosyaya ekler. Var olan kimlikleri atlar, dosyayı yeniden yazar.
 * Her add-*.mjs betiğinin sonunda tekrarladığımız kalıbın tek kopyası.
 */
export function commit(path, records) {
  const list = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : [];
  const mevcut = new Set(list.map((r) => r.id));
  const eklenen = [];
  for (const r of records) {
    if (mevcut.has(r.id)) { console.log("ATLANDI (zaten var):", r.id); continue; }
    list.push(r);
    mevcut.add(r.id);
    eklenen.push(r.id);
  }
  writeFileSync(path, `${JSON.stringify(list, null, 2)}\n`, "utf8");
  console.log(`${eklenen.length} kayıt eklendi -> ${path}`);
  eklenen.forEach((id) => console.log("  +", id));
  console.log(`${path} toplam: ${list.length}`);
  return eklenen;
}
