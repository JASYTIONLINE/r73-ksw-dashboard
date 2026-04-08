/**
 * Reads private/ksw-roadmap-db.csv and writes assets/data/ksw-syllabus.json
 * Run from repo root: node scripts/csv-to-syllabus-json.mjs
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
const items = [];

for (const cells of rows) {
  const object = String(cells[0] || '').trim();
  if (!object) continue;

  if (object === 'Syllibus') {
    const count = parseInt(String(cells[1] || '').trim(), 10);
    const key = String(cells[2] || '').trim();
    const rank = parseInt(String(cells[3] || '').trim(), 10);
    if (Number.isNaN(rank) || rank < 1 || !key) continue;

    items.push({
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

const payload = {
  version: 1,
  source: 'private/ksw-roadmap-db.csv',
  beltStepLabels,
  items
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 0), 'utf8');
console.log('Wrote', items.length, 'syllabus items to', path.relative(root, outPath));
