#!/usr/bin/env node
// Search Console kapsama durumunu çeker → data/gsc-index.json
//
// NEDEN DOLAYLI YOL: Search Console kimlik bilgileri bu depoda değil, klipper
// sunucusunda duruyor (/opt/linux-ai-server/data/gsc-oauth-*.json). Bu doğru
// yer: public bir depoya OAuth belirteci koyulmaz. Bu betik klipper'ın
// shell/exec ucuna bir Python parçası gönderir, orada URL Inspection
// çalıştırır ve YALNIZCA sonucu geri alır. Anahtar bu makineden geçmez;
// depoya hiç girmez.
//
// SALT OKUNUR: yalnız sorgu yapar. Sitemap göndermez, dizine ekleme talep
// etmez, hiçbir şeyi değiştirmez.
//
// ÇIKTI bir ANLIK GÖRÜNTÜDÜR, canlı veri değil. audit-urls.mjs onu okur;
// klipper erişilemezse tablo eski değerlerle üretilir, uydurma değer
// yazılmaz. Her kaydın `olculdu` alanı ölçümün ne zaman yapıldığını söyler -
// tazeliği okuyan karar verir.
//
// Kullanım:  node scripts/fetch-gsc.mjs
// Gerekli:   KLIPPER_MEMORY_KEY ortam değişkeni

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteRows } from './lib/site-urls.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KLIPPER = process.env.KLIPPER_API ?? 'http://100.84.251.49:8420';
const ANAHTAR = process.env.KLIPPER_MEMORY_KEY;
const PROPERTY = 'sc-domain:kanitatlasi.com';
// Yığın boyutunu belirleyen şey GSC kotası değil, klipper'ın shell/exec
// ucundaki 30 saniyelik sunucu tarafı zaman aşımı. Her çağrı önce belirteç
// alıyor (~1 sn), sonra URL başına ~3 sn harcıyor; 8'li yığın 30 sn'yi aştı
// ve 500 döndü. 3 güvenli sınır.
const YIGIN = Number(process.env.GSC_YIGIN ?? 3);

if (!ANAHTAR) {
  console.error('KLIPPER_MEMORY_KEY tanımlı değil - Search Console sorgusu yapılamaz.');
  console.error('Anlık görüntü DEĞİŞTİRİLMEDİ; mevcut data/gsc-index.json korunuyor.');
  process.exit(1);
}

// Klipper'da çalışacak Python. Belirteci orada okur, sorguyu orada yapar.
function pythonParcasi(urls) {
  return `
import importlib.util, json, urllib.request, urllib.error
spec = importlib.util.spec_from_file_location("seogsc", "/opt/linux-ai-server/scripts/seo-gsc.py")
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
tok, _ = m._acquire_token()
out = {}
for u in ${JSON.stringify(urls)}:
    body = json.dumps({"inspectionUrl": u, "siteUrl": ${JSON.stringify(PROPERTY)}, "languageCode": "tr-TR"}).encode()
    req = urllib.request.Request("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        data=body, headers={"Authorization": "Bearer " + tok, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            d = json.loads(r.read())["inspectionResult"]["indexStatusResult"]
        out[u] = {"karar": d.get("verdict"), "durum": d.get("coverageState"),
                  "robots": d.get("robotsTxtState"), "sonTarama": d.get("lastCrawlTime"),
                  "sitemap": bool(d.get("sitemap"))}
    except Exception as e:
        out[u] = {"hata": str(e)}
print("<<<JSON>>>" + json.dumps(out, ensure_ascii=False))
`.trim();
}

async function klipperCalistir(kod) {
  // Kod base64 ile taşınır. Doğrudan `python3 -c "..."` denendi ve kayboldu:
  // kabuk çift tırnak içindeki \n'i satır sonu saymaz, Python tek satırlık
  // bozuk bir kaynak görür. Base64 saf ASCII'dir, hiçbir kabuk onu bozmaz.
  const b64 = Buffer.from(kod, 'utf8').toString('base64');
  const komut = `python3 -c "import base64;exec(base64.b64decode('${b64}').decode('utf-8'))"`;
  const y = await fetch(`${KLIPPER}/api/v1/shell/exec`, {
    method: 'POST',
    headers: { 'X-Memory-Key': ANAHTAR, 'Content-Type': 'application/json' },
    body: JSON.stringify({ command: komut }),
    signal: AbortSignal.timeout(300000),
  });
  if (!y.ok) throw new Error(`klipper ${y.status}: ${(await y.text()).slice(0, 200)}`);
  const c = await y.json();
  const im = String(c.stdout ?? '').indexOf('<<<JSON>>>');
  if (im === -1) throw new Error(`beklenen JSON yok. stderr: ${String(c.stderr ?? '').slice(0, 300)}`);
  return JSON.parse(c.stdout.slice(im + 10));
}

const rows = await siteRows(ROOT);
const urls = rows.map(r => r.url);
console.log(`${urls.length} URL, ${PROPERTY} mülkünde sorgulanıyor...`);

const olculdu = new Date().toISOString();
const sonuc = {};
const basarisiz = [];
for (let i = 0; i < urls.length; i += YIGIN) {
  const dilim = urls.slice(i, i + YIGIN);
  try {
    Object.assign(sonuc, await klipperCalistir(pythonParcasi(dilim)));
  } catch (hata) {
    // Bir yığının düşmesi bütün çalışmayı düşürmemeli; ölçülemeyen URL
    // ölçülmemiş olarak kalır, uydurulmaz.
    basarisiz.push({ urls: dilim, sebep: hata.message });
  }
  process.stdout.write(`  ${Math.min(i + YIGIN, urls.length)}/${urls.length}\r`);
}
process.stdout.write('\n');
if (basarisiz.length) {
  console.warn(`UYARI: ${basarisiz.length} yığın alınamadı, o URL'ler ölçülmedi:`);
  for (const b of basarisiz) console.warn(`  ${b.sebep}\n    ${b.urls.join('\n    ')}`);
}

for (const k of Object.values(sonuc)) k.olculdu = olculdu;

const govde = {
  property: PROPERTY,
  olculdu,
  not: 'URL Inspection cevabı. Salt okunur sorgu; anlık görüntüdür, canlı veri değil.',
  urls: Object.fromEntries(Object.keys(sonuc).sort().map(k => [k, sonuc[k]])),
};
await writeFile(path.join(ROOT, 'data', 'gsc-index.json'), `${JSON.stringify(govde, null, 2)}\n`, 'utf8');

const say = {};
for (const v of Object.values(sonuc)) {
  const a = v.hata ? 'HATA' : v.karar === 'PASS' ? 'dizinde' : (v.durum ?? '?');
  say[a] = (say[a] ?? 0) + 1;
}
console.log('data/gsc-index.json yazıldı.');
for (const [k, v] of Object.entries(say).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
