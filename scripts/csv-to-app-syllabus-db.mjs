/**
 * Reads assets/data/csv/ksw-syllabus.csv (sectioned rows: first column = table name)
 * and writes assets/data/json/app-syllabus.db.json — canonical DB payload for the app.
 *
 * Run from repo root: node scripts/csv-to-app-syllabus-db.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const csvPath = path.join(root, 'assets', 'data', 'csv', 'ksw-syllabus.csv');
const outPath = path.join(root, 'assets', 'data', 'json', 'app-syllabus.db.json');

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

function normalizeHeaderCell(h, idx) {
  const s = String(h || '').trim();
  return s || 'col' + idx;
}

function rowToRecord(header, cells) {
  const rec = {};
  const w = Math.max(header.length, cells.length);
  for (let i = 0; i < w; i++) {
    const key = normalizeHeaderCell(header[i], i);
    rec[key] = cells[i] != null ? String(cells[i]).trim() : '';
  }
  return rec;
}

function parseSections(rows) {
  /** @type {Record<string, Array<Record<string, string>>>} */
  const tables = {};
  let header = null;

  for (const cells of rows) {
    if (!cells.length || !cells.some((c) => String(c).trim() !== '')) continue;

    const c0 = String(cells[0] || '').trim();
    const c0lower = c0.toLowerCase();

    if (c0lower === 'object') {
      header = cells.map((h, i) => normalizeHeaderCell(h, i));
      continue;
    }

    if (!header || !header.length) continue;

    if (c0lower === 'meta' || c0lower === 'rowkind' || c0lower === '_note') continue;
    if (c0lower.startsWith('note')) continue;
    if (!c0) continue;

    const rec = rowToRecord(header, cells);
    const tableName = String(rec.object || rec.Object || c0).trim();
    if (!tableName || tableName.toLowerCase() === 'object') continue;

    if (!tables[tableName]) tables[tableName] = [];
    tables[tableName].push(rec);
  }

  return tables;
}

/** Remove padding keys (`col5`, `col12`, …) created when CSV headers have trailing empty columns. */
function stripPlaceholderColumnsFromTables(tables) {
  if (!tables || typeof tables !== 'object') return;
  const re = /^col\d+$/i;
  Object.keys(tables).forEach((name) => {
    const arr = tables[name];
    if (!Array.isArray(arr)) return;
    arr.forEach((rec) => {
      if (!rec || typeof rec !== 'object') return;
      Object.keys(rec).forEach((k) => {
        if (re.test(k)) delete rec[k];
      });
    });
  });
}

function toInt(v, def) {
  const n = parseInt(String(v || '').trim(), 10);
  return Number.isNaN(n) ? def : n;
}

/** Map legacy SKILL row rank columns onto `overTwelve` / `underThirteen` (older CSV headers still used on disk). */
function normalizeSkillTableAgeColumns(tables) {
  const skillRows = tables.SKILL || tables.Skill;
  if (!Array.isArray(skillRows)) return;
  for (const row of skillRows) {
    if (!row || typeof row !== 'object') continue;
    const oNew = row.overTwelve != null && String(row.overTwelve).trim() !== '';
    if (!oNew) {
      if (row.overEighteen != null && String(row.overEighteen).trim() !== '') {
        row.overTwelve = row.overEighteen;
      } else if (row.OverEighteen != null && String(row.OverEighteen).trim() !== '') {
        row.overTwelve = row.OverEighteen;
      }
    }
    delete row.overEighteen;
    delete row.OverEighteen;
    const uNew = row.underThirteen != null && String(row.underThirteen).trim() !== '';
    if (!uNew) {
      if (row.underEighteen != null && String(row.underEighteen).trim() !== '') {
        row.underThirteen = row.underEighteen;
      } else if (row.UnderEighteen != null && String(row.UnderEighteen).trim() !== '') {
        row.underThirteen = row.UnderEighteen;
      }
    }
    delete row.underEighteen;
    delete row.UnderEighteen;
  }
}

function buildLegacyPayload(tables) {
  const beltStepLabels = {};
  const rankRows = tables.Rank || tables.rank || [];
  for (const r of rankRows) {
    const step = String(r.serialNumber || r.SerialNumber || '').trim();
    const label = (r.description || r.Description || r.name || r.Name || '').trim();
    if (step && label) beltStepLabels[step] = label;
  }

  const skillRows = tables.SKILL || tables.Skill || [];
  const items = [];
  const seenKeys = new Set();

  /** WKSA charts: Junior = age 12 & under; Adult & Youth = age 13+. CSV columns: overTwelve / underThirteen (belt-step rank 1–16 per track). */
  const requirementsByAgeBand = { 'adult-youth': {}, junior: {} };
  for (let rank = 1; rank <= 16; rank++) {
    const rs = String(rank);
    requirementsByAgeBand['adult-youth'][rs] = [];
    requirementsByAgeBand['junior'][rs] = [];
  }

  function addKeyToBandRank(band, rankNum, key) {
    if (!key || rankNum == null || rankNum < 1 || rankNum > 16) return;
    const rs = String(rankNum);
    const arr = requirementsByAgeBand[band][rs];
    if (arr.indexOf(key) === -1) arr.push(key);
  }

  for (const s of skillRows) {
    const key = String(s.keyId || s.keyID || '').trim();
    if (!key) continue;
    if (seenKeys.has(key)) {
      console.error('Duplicate primary key (keyId), skipping row:', key);
      continue;
    }
    seenKeys.add(key);

    const oR = toInt(s.overTwelve ?? s.OverTwelve, null);
    const uR = toInt(s.underThirteen ?? s.UnderThirteen, null);
    if (oR != null) addKeyToBandRank('adult-youth', oR, key);
    if (uR != null) addKeyToBandRank('junior', uR, key);

    const statusRaw = String(s.status || s.Status || 'Untrained').trim();
    const status = statusRaw || 'Untrained';
    const fallbackRank = (oR != null ? oR : uR != null ? uR : 1) || 1;
    items.push({
      count: toInt(s.serialNumber, items.length + 1),
      key,
      keyId: key,
      rank: fallbackRank,
      overTwelve: oR,
      underThirteen: uR,
      learningObjective: String(s.skillCatagoryId || s.skillCatagoryID || '').trim(),
      name: String(s.name || s.Name || '').trim(),
      type: 'SKILL',
      status,
      description: String(s.description || s.Description || '').trim()
    });
  }

  return {
    beltStepLabels,
    items,
    requirementsByAgeBand
  };
}

const raw = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
const rows = parseCsv(raw);
const tables = parseSections(rows);
stripPlaceholderColumnsFromTables(tables);
normalizeSkillTableAgeColumns(tables);
const legacy = buildLegacyPayload(tables);

const payload = {
  version: 2,
  source: 'assets/data/json/app-syllabus.db.json',
  generatedFromCsv: 'assets/data/csv/ksw-syllabus.csv',
  tables,
  beltStepLabels: legacy.beltStepLabels,
  items: legacy.items,
  requirementsByAgeBand: legacy.requirementsByAgeBand,
  syllabusByAgeGroup: {
    junior: { source: 'assets/data/csv/ksw-syllabus.csv' },
    'adult-youth': { source: 'assets/data/csv/ksw-syllabus.csv' }
  },
  categoryDisplayNames: {},
  learningObjectiveDisplayNames: {},
  categoryPriority: {},
  objects: {}
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');

const nSkills = (tables.SKILL || []).length;
const nRanks = (tables.Rank || []).length;
console.log(
  'Wrote',
  outPath,
  '| tables:',
  Object.keys(tables).join(', '),
  '| items:',
  legacy.items.length,
  'skills,',
  nRanks,
  'ranks'
);
