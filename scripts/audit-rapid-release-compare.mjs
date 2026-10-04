// Compare the same 2021 RAPID samples across the archived v2022.1 and v2024.1a ASCII releases.
// v2022.1: https://www.bodc.ac.uk/data/published_data_library/catalogue/10.5285/04c79ece-3186-349a-e063-6c86abc0158c/
// v2024.1a: https://rapid.ac.uk/node/10
// Both release guides define column 14 as moc_mar_hc10 and a 12-hour, 10-day low-pass series.
// Usage: node scripts/audit-rapid-release-compare.mjs old.ascii current.ascii
import fs from 'node:fs';
import crypto from 'node:crypto';

const releases = [
  { label: 'v2022.1', path: process.argv[2], sha256: '619313d25295d4f1f492cd163904fa1a9fb6627c37b561978ec0638b807cc41b' },
  { label: 'v2024.1a', path: process.argv[3], sha256: '847c169cba6b2461a2ca33870b7c06d6c9073ac389b333006abc6709437b08ac' },
];

if (releases.some(release => !release.path)) {
  throw new Error('Usage: node scripts/audit-rapid-release-compare.mjs old.ascii current.ascii');
}

const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
for (const release of releases) {
  const raw = fs.readFileSync(release.path);
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  if (hash !== release.sha256) throw new Error(`${release.label}: unexpected SHA-256 ${hash}`);

  release.samples = new Map();
  release.publishedYears = new Map([[2005, []], [2009, []], [2018, []]]);
  for (const line of raw.toString('ascii').trim().split(/\r?\n/)) {
    const fields = line.trim().split(/\s+/).map(Number);
    if (fields.length !== 14 || fields.some(value => !Number.isFinite(value))) {
      throw new Error(`${release.label}: unexpected ASCII row`);
    }
    const year = fields[1];
    const moc = fields[13];
    if (moc === -99999) continue;
    if (release.publishedYears.has(year)) release.publishedYears.get(year).push(moc);
    if (year !== 2021) continue;
    const timestamp = fields.slice(1, 5).join('-');
    if (release.samples.has(timestamp)) throw new Error(`${release.label}: repeated ${timestamp}`);
    release.samples.set(timestamp, moc);
  }
  if (release.samples.size !== 730) throw new Error(`${release.label}: expected 730 2021 samples`);
  console.log(`${release.label} 2021: ${mean([...release.samples.values()]).toFixed(6)} Sv (${release.samples.size} samples)`);
}

const [old, current] = releases;
if ([...old.samples.keys()].some(timestamp => !current.samples.has(timestamp))) {
  throw new Error('2021 timestamps do not match between releases');
}
const differences = [...old.samples].map(([timestamp, value]) => current.samples.get(timestamp) - value);
console.log(`Same-timestamp delta: ${mean(differences).toFixed(6)} Sv; changed samples: ${differences.filter(value => value !== 0).length}`);
for (const year of [2005, 2009, 2018]) {
  const values = old.publishedYears.get(year);
  if (values.length !== 730) throw new Error(`v2022.1: expected 730 ${year} samples`);
  console.log(`v2022.1 ${year}: ${mean(values).toFixed(6)} Sv (${values.length} samples)`);
}
console.log('Simple calendar-year means only; no trend, significance, or cause of data revision computed.');
