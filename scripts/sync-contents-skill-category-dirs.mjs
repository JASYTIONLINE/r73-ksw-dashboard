/**
 * Sync contents/{skillCatagoryKey}-{slug}/ folders from app-syllabus.db.json skillCatagory table.
 *
 * Slug rules (current category names are Latin ASCII; if names gain Korean/unicode later,
 * extend slugify to NFKD + strip diacritics, or use explicit slug field in JSON):
 * - Lowercase, trim
 * - Non [a-z0-9] runs become single '-'
 * - Collapse duplicate '-', trim leading/trailing '-'
 *
 * Run from repo root: node scripts/sync-contents-skill-category-dirs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dbPath = path.join(root, 'assets', 'data', 'json', 'app-syllabus.db.json');

function slugify(name) {
  return (
    String(name || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .replace(/-+/g, '-') || 'category'
  );
}

function dirContents(dir) {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const cats = db.skillCatagory || {};
const keys = Object.keys(cats).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }));

for (const key of keys) {
  const row = cats[key];
  const name = String(row.name || key).trim();
  const relDir = path.join('contents', `${key}-${slugify(name)}`);
  const absDir = path.join(root, relDir);
  fs.mkdirSync(absDir, { recursive: true });
  const entries = dirContents(absDir).filter((e) => e !== '.gitkeep');
  if (entries.length === 0) {
    const gitkeep = path.join(absDir, '.gitkeep');
    if (!fs.existsSync(gitkeep)) {
      fs.writeFileSync(gitkeep, '', 'utf8');
      console.log('added', path.join(relDir, '.gitkeep'));
    }
  } else {
    console.log('skip .gitkeep (has files):', relDir);
  }
}

console.log('sync-contents-skill-category-dirs: done');
