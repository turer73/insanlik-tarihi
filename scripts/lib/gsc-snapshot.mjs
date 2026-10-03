import { readFile } from 'node:fs/promises';

export async function readSnapshot(file) {
  try {
    const snapshot = JSON.parse(await readFile(file, 'utf8'));
    if (!snapshot.urls || typeof snapshot.urls !== 'object' || Array.isArray(snapshot.urls)) {
      throw new Error('Search Console anlık görüntüsünde geçerli urls nesnesi yok.');
    }
    return snapshot;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error; // Bozuk/eski dosyayı ilk üretim sayıp silme.
  }
}

/** Başarısız istekler ölçüm değildir; önceki sonucu ve tarihini korur. */
export function mergeSnapshot(previous, results, { property, measuredAt, errors = {} }) {
  const urls = { ...(previous?.urls ?? {}) };
  const failures = { ...errors };
  let measured = 0;
  for (const [url, result] of Object.entries(results)) {
    if (result?.hata || !result?.karar || !result?.durum) {
      failures[url] = result?.hata ?? 'Geçerli denetim cevabı alınamadı';
      continue;
    }
    urls[url] = { ...result, olculdu: measuredAt };
    measured++;
  }
  if (!measured) return null;
  return {
    property,
    olculdu: measuredAt,
    not: 'URL Inspection cevabı. Salt okunur sorgu; anlık görüntüdür, canlı veri değil. ' +
      'Ölçülemeyen URL önceki sonucunu ve ölçüm tarihini korur; hatalar sonDeneme alanındadır.',
    sonDeneme: { olculdu: measuredAt, hatalar: failures },
    urls: Object.fromEntries(Object.keys(urls).sort().map(url => [url, urls[url]])),
  };
}
