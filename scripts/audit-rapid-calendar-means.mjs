// RAPID v2024.1a: https://rapid.ac.uk/sites/default/files/rapid_data/moc_transports.ascii
// Column order: https://rapid.ac.uk/sites/default/files/rapid_data/README.pdf (pp. 5–6)
// Usage: node scripts/audit-rapid-calendar-means.mjs path/to/moc_transports.ascii
import fs from 'node:fs';
import crypto from 'node:crypto';

const path = process.argv[2];
if (!path) throw new Error('RAPID ASCII dosya yolu gerekli');
const contents = fs.readFileSync(path);
const sha256 = crypto.createHash('sha256').update(contents).digest('hex');
const expected = '847c169cba6b2461a2ca33870b7c06d6c9073ac389b333006abc6709437b08ac';
if (sha256 !== expected) throw new Error(`Beklenmeyen RAPID sürümü: ${sha256}`);

const years = new Map([[2021, []], [2022, []], [2023, []]]);
for (const line of contents.toString('ascii').trim().split(/\r?\n/)) {
  const values = line.trim().split(/\s+/).map(Number);
  if (values.length !== 14 || values.some(value => !Number.isFinite(value))) {
    throw new Error('RAPID ASCII satır biçimi beklenmedik');
  }
  const year = values[1];
  const moc = values[13];
  if (years.has(year) && moc !== -99999) years.get(year).push(moc);
}

for (const [year, values] of years) {
  if (values.length !== 730) throw new Error(`${year}: beklenen 730 yerine ${values.length} örnek`);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  console.log(`${year}: ${mean.toFixed(3)} Sv (${values.length} yarım günlük örnek)`);
}
console.log(`RAPID v2024.1a SHA-256: ${sha256}`);
console.log('Basit tam takvim yılı ortalaması; eğilim ve anlamlılık testi değildir.');
