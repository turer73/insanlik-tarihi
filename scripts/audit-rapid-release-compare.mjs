// Compare the same 2021 RAPID samples across archived and current ASCII releases.
// v2022.1: https://www.bodc.ac.uk/data/published_data_library/catalogue/10.5285/04c79ece-3186-349a-e063-6c86abc0158c/
// v2023.1: https://www.bodc.ac.uk/data/published_data_library/catalogue/10.5285/223b34a3-2dc5-c945-e063-7086abc0f274/
// v2024.1a: https://rapid.ac.uk/node/10
// Their release guides define columns 11-14 as Florida, Ekman, upper mid-ocean,
// and MOC transport in a 12-hour, 10-day low-pass series.
// Usage: node scripts/audit-rapid-release-compare.mjs old.ascii intermediate.ascii current.ascii
import fs from 'node:fs';
import crypto from 'node:crypto';

const releases = [
  { label: 'v2022.1', path: process.argv[2], sha256: '619313d25295d4f1f492cd163904fa1a9fb6627c37b561978ec0638b807cc41b' },
  { label: 'v2023.1', path: process.argv[3], sha256: 'fff4022d10b0239b482a99fd7b46bdb3db1d57b3e1d0b73a4456dea1184dd8a0' },
  { label: 'v2024.1a', path: process.argv[4], sha256: '847c169cba6b2461a2ca33870b7c06d6c9073ac389b333006abc6709437b08ac' },
];

if (releases.some(release => !release.path)) {
  throw new Error('Usage: node scripts/audit-rapid-release-compare.mjs old.ascii intermediate.ascii current.ascii');
}

const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;
const columns = [
  { name: 't_gs10', index: 10 },
  { name: 't_ek10', index: 11 },
  { name: 't_umo10', index: 12 },
  { name: 'moc_mar_hc10', index: 13 },
];
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
    if (columns.some(({ index }) => fields[index] === -99999)) {
      throw new Error(`${release.label}: missing 2021 component in a valid MOC row`);
    }
    const timestamp = fields.slice(1, 5).join('-');
    if (release.samples.has(timestamp)) throw new Error(`${release.label}: repeated ${timestamp}`);
    release.samples.set(timestamp, fields);
  }
  if (release.samples.size !== 730) throw new Error(`${release.label}: expected 730 2021 samples`);
  console.log(`${release.label} 2021 MOC: ${mean([...release.samples.values()].map(row => row[13])).toFixed(6)} Sv (${release.samples.size} samples)`);
}

function compare(old, current) {
  if (old.samples.size !== current.samples.size || [...old.samples.keys()].some(timestamp => !current.samples.has(timestamp))) {
    throw new Error(`${old.label} -> ${current.label}: 2021 timestamps do not match`);
  }
  console.log(`${old.label} -> ${current.label}`);
  const componentDeltas = [];
  let mocDelta;
  for (const { name, index } of columns) {
    const oldValues = [...old.samples.values()].map(row => row[index]);
    const currentValues = [...old.samples.keys()].map(timestamp => current.samples.get(timestamp)[index]);
    const differences = currentValues.map((value, i) => value - oldValues[i]);
    const delta = mean(differences);
    if (name === 'moc_mar_hc10') mocDelta = delta;
    else componentDeltas.push(delta);
    console.log(`${name}: ${mean(oldValues).toFixed(6)} -> ${mean(currentValues).toFixed(6)} Sv; same-timestamp delta: ${delta.toFixed(6)} Sv; changed samples: ${differences.filter(value => value !== 0).length}`);
  }
  const residual = mocDelta - componentDeltas.reduce((sum, value) => sum + value, 0);
  console.log(`MOC delta minus sum of component deltas: ${residual.toFixed(6)} Sv (MOC is a maximum-overturning measure; these are not an exact additive attribution)`);
}
compare(releases[0], releases[1]);
compare(releases[1], releases[2]);
compare(releases[0], releases[2]);
const [old] = releases;
for (const year of [2005, 2009, 2018]) {
  const values = old.publishedYears.get(year);
  if (values.length !== 730) throw new Error(`v2022.1: expected 730 ${year} samples`);
  console.log(`v2022.1 ${year}: ${mean(values).toFixed(6)} Sv (${values.length} samples)`);
}
console.log('Simple calendar-year means only; no trend, significance, or processing-step attribution computed.');
