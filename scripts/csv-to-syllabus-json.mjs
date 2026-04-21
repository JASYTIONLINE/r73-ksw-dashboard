/**
 * Reads private/ksw-roadmap-db.csv and writes assets/data/ksw-syllabus.json
 * Run from repo root: node scripts/csv-to-syllabus-json.mjs
 *
 * Emits a master skill list (`items`) and `requirementsByAgeBand` mapping
 * (age band + belt rank → ordered skill keys). Under-18 and over-18 start
 * identical until separate CSV sources feed different mappings.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const csvPath = path.join(root, 'private', 'ksw-roadmap-db.csv');
const outPath = path.join(root, 'assets', 'data', 'ksw-syllabus.json');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
          continue;
        }
        inQuotes = false;
        continue;
      }
      field += c;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      continue;
    }
    if (c === ',') {
      row.push(field);
      field = '';
      continue;
    }
    if (c === '\r') continue;
    if (c === '\n') {
      row.push(field);
      if (row.some((cell) => String(cell).trim() !== '')) rows.push(row);
      row = [];
      field = '';
      continue;
    }
    field += c;
  }
  row.push(field);
  if (row.some((cell) => String(cell).trim() !== '')) rows.push(row);
  return rows;
}

const text = fs.readFileSync(csvPath, 'utf8');
const rows = parseCsv(text);
if (rows.length < 2) throw new Error('CSV empty or invalid');

const beltStepLabels = {};
const rawSyllabusRows = [];
const objects = {};
let currentHeader = null;

function normalizeHeaderName(name, idx) {
  const base = String(name || '').trim();
  return base || 'col' + (idx + 1);
}

function mapRowByHeader(header, cells) {
  const out = {};
  const width = Math.max(header ? header.length : 0, cells.length);
  for (let i = 0; i < width; i++) {
    const key = normalizeHeaderName(header && header[i], i);
    out[key] = String(cells[i] || '').trim();
  }
  return out;
}

function toInt(value) {
  const n = parseInt(String(value || '').trim(), 10);
  return Number.isNaN(n) ? null : n;
}

for (const cells of rows) {
  const object = String(cells[0] || '').trim();
  if (!object) continue;

  if (object.toLowerCase() === 'object') {
    currentHeader = cells.map(function (cell, idx) {
      return normalizeHeaderName(cell, idx);
    });
    continue;
  }

  const mapped = mapRowByHeader(currentHeader, cells);
  if (!objects[object]) objects[object] = [];
  objects[object].push(mapped);

  if (object === 'Syllibus') {
    const count = parseInt(String(cells[1] || '').trim(), 10);
    const key = String(cells[2] || '').trim();
    const rank = parseInt(String(cells[3] || '').trim(), 10);
    if (Number.isNaN(rank) || rank < 1 || !key) continue;

    rawSyllabusRows.push({
      count: Number.isNaN(count) ? null : count,
      key,
      rank,
      learningObjective: String(cells[4] || '').trim(),
      name: String(cells[5] || '').trim(),
      type: String(cells[6] || '').trim(),
      status: String(cells[7] || '').trim(),
      description: String(cells[8] || '').trim()
    });
    continue;
  }

  if (object === 'Glossary') {
    const rank = parseInt(String(cells[3] || '').trim(), 10);
    const beltName = String(cells[5] || '').trim();
    if (!Number.isNaN(rank) && rank >= 1 && rank <= 16 && beltName) {
      beltStepLabels[String(rank)] = beltName;
    }
    continue;
  }
}

if (!beltStepLabels['16']) beltStepLabels['16'] = 'Jyo Kyo Nim';

const categoryPriority = {};
const priorityRows = objects.Priority || [];
priorityRows.forEach(function (row) {
  const typeName = String((row && row.Type) || '').trim();
  const priority = toInt(row && row.Rank);
  if (!typeName || priority == null) return;
  categoryPriority[typeName] = priority;
});

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

/** One row per unique skill key (first CSV occurrence wins). */
const seenKeys = new Set();
const items = [];
for (const it of rawSyllabusRows) {
  if (!it.key) continue;
  if (seenKeys.has(it.key)) {
    console.warn('Duplicate syllabus key skipped:', it.key);
    continue;
  }
  seenKeys.add(it.key);
  items.push(it);
}

/** Rank → ordered keys for requirement sets (belt step). */
const rankToKeys = {};
for (let r = 1; r <= 16; r++) rankToKeys[String(r)] = [];
items.forEach(function (it) {
  const rank = it.rank;
  if (rank == null || rank < 1) return;
  const rk = String(rank);
  if (!rankToKeys[rk]) rankToKeys[rk] = [];
  rankToKeys[rk].push(it.key);
});

const keySet = new Set(items.map((it) => it.key));
Object.keys(rankToKeys).forEach(function (rk) {
  rankToKeys[rk].forEach(function (k) {
    if (!keySet.has(k)) throw new Error('Referential integrity: missing key ' + k);
  });
});

/** Over-18: canonical belt rank → keys. Under-18 at rank R uses the same key list as over-18 at rank R−1 (rank 1 matches rank 1). */
const requirementsByAgeBand = {
  'over-18': deepClone(rankToKeys),
  'under-18': {}
};
for (let r = 1; r <= 16; r++) {
  const rs = String(r);
  if (r === 1) {
    requirementsByAgeBand['under-18'][rs] = deepClone(rankToKeys['1'] || []);
  } else {
    requirementsByAgeBand['under-18'][rs] = deepClone(rankToKeys[String(r - 1)] || []);
  }
}

const categoryDisplayNames = {};
const learningObjectiveDisplayNames = {};

const payload = {
  version: 4,
  source: 'private/ksw-roadmap-db.csv',
  beltStepLabels,
  items,
  requirementsByAgeBand,
  syllabusByAgeGroup: {
    'under-18': { source: 'private/ksw-roadmap-under18.csv' },
    'over-18': { source: 'private/ksw-roadmap-over18.csv' }
  },
  categoryDisplayNames,
  learningObjectiveDisplayNames,
  categoryPriority,
  objects
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 0), 'utf8');
console.log('Wrote', items.length, 'unique syllabus items; requirement ranks 1–16 to', path.relative(root, outPath));
