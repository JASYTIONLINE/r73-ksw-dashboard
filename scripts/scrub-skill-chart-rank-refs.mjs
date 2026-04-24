/**
 * Rewrites SKILL 8under / 9to12 / 13up from legacy Rank ids (rb002 = Yellow Stripe …)
 * to WKSA chart row ids (rb001 = first "Testing for" row on paper, rb000 = white-only).
 * Sets extras.skillAgeRankIdsAreChartRows so dashboard.html decodes them.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'assets', 'data', 'json', 'app-syllabus.db.json');

const j = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const R = j.Rank && typeof j.Rank === 'object' ? j.Rank : {};

function serialFromRankId(rbId) {
  const row = R[rbId];
  if (!row || typeof row !== 'object') return NaN;
  return parseInt(String(row.serialNumber || '').trim(), 10);
}

/** Legacy Rank key → chart row ref on testing chart (r001… ≈ rb001…). */
function legacyRankIdToChartRankId(oldRb) {
  if (typeof oldRb !== 'string' || !/^rb\d+$/i.test(oldRb.trim())) return oldRb;
  const s = serialFromRankId(oldRb);
  if (Number.isNaN(s) || s < 1) return oldRb;
  if (s === 1) return 'rb000';
  return 'rb' + String(s - 1).padStart(3, '0');
}

const cols = ['8under', '9to12', '13up'];
let touched = 0;
for (const key of Object.keys(j.SKILL || {})) {
  const row = j.SKILL[key];
  if (!row || typeof row !== 'object') continue;
  for (const c of cols) {
    if (typeof row[c] !== 'string') continue;
    const v = row[c].trim();
    if (!/^rb\d+$/i.test(v)) continue;
    const next = legacyRankIdToChartRankId(v);
    if (next !== v) touched++;
    row[c] = next;
  }
}

j.extras = j.extras && typeof j.extras === 'object' ? j.extras : {};
j.extras.skillAgeRankIdsAreChartRows = true;

fs.writeFileSync(dbPath, JSON.stringify(j, null, 2) + '\n', 'utf8');
console.log('Updated', dbPath);
console.log('Fields changed (value differed):', touched);
console.log('extras.skillAgeRankIdsAreChartRows = true');
