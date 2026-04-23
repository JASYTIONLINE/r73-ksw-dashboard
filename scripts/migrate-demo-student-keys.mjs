/**
 * Replaces legacy demo student keys (a-*, j-*) with triple roster keys:
 *   8un-{slug}, 912-{slug}, 13U-{slug}
 * Preserves rankId per belt slot; sets ages 7 / 10 / 16 and sortable firstName prefixes.
 *
 * Run from repo root: node scripts/migrate-demo-student-keys.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dbPath = path.join(root, 'assets', 'data', 'json', 'app-syllabus.db.json');

/** Display suffix for firstName (same order as current a-* roster walk). */
const RANK_LABELS = [
  'White Belt',
  'Yellow Stripe',
  'Yellow Belt',
  'Blue Stripe',
  'Blue Belt',
  'Red Stripe',
  'Red Belt',
  'Brown Stripe',
  'Brown Belt',
  'One Blk Stripe',
  'Two Blk Stripes',
  'Three Blk Stripes',
  'Four Blk Stripes',
  'Five Blk Stripes',
  'Six Black Stripes',
  'Svn Blk Stripes',
  'Eight Blk Stripes',
  '1st Dan',
  '2nd Dan',
  '3rd Dan'
];

function rbOrder(rankId) {
  const m = String(rankId || '').match(/rb0*(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
}

function main() {
  const raw = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(raw);
  const st = data.student;
  if (!st || typeof st !== 'object') throw new Error('Missing student');

  const groups = new Map();
  for (const key of Object.keys(st)) {
    const m = key.match(/^([aj])-(.+)$/i);
    if (!m) continue;
    const prefix = m[1].toLowerCase();
    const slugNorm = m[2].toLowerCase();
    if (!groups.has(slugNorm)) groups.set(slugNorm, { a: null, j: null, slugNorm });
    const g = groups.get(slugNorm);
    g[prefix] = { key, row: st[key] };
  }

  const slugList = [];
  for (const [slugNorm, g] of groups) {
    const rowA = g.a && g.a.row;
    const rowJ = g.j && g.j.row;
    if (!rowA && !rowJ) continue;
    if (!rowA || !rowJ) {
      console.warn('Single-band legacy row for slug', slugNorm, '- using one row only');
    }
    const rankId = (rowA && rowA.rankId) || (rowJ && rowJ.rankId);
    slugList.push({ slugNorm, rankId, rowA, rowJ });
  }

  slugList.sort(function (x, y) {
    const d = rbOrder(x.rankId) - rbOrder(y.rankId);
    if (d !== 0) return d;
    return x.slugNorm.localeCompare(y.slugNorm);
  });

  if (slugList.length !== RANK_LABELS.length) {
    console.warn('Expected', RANK_LABELS.length, 'rank slots, got', slugList.length);
  }

  const template = slugList[0].rowA || slugList[0].rowJ;
  const baseFields = {
    testEligible: template.testEligible,
    testDate: template.testDate,
    phone: template.phone,
    address: template.address,
    membershipId: template.membershipId,
    memberSince: template.memberSince,
    renewalDate: template.renewalDate,
    schoolId: template.schoolId
  };

  const newStudent = {};
  for (const k of Object.keys(st)) {
    if (!/^[aj]-/i.test(k)) newStudent[k] = st[k];
  }

  slugList.forEach(function (slot, idx) {
    const label = RANK_LABELS[idx] || slot.slugNorm;
    const pad = String(idx + 1).padStart(3, '0');
    const slug = slot.slugNorm;
    const rankId = slot.rankId;

    /** Same convention as normalize-demo-student-names.mjs: LastName = {pad}{a|b|c}, firstName = {tag} {label}. */
    const mk = function (bandKey, age, bandLetter, firstTag) {
      const id = bandKey + '-' + slug;
      newStudent[id] = Object.assign({}, baseFields, {
        LastName: pad + bandLetter,
        firstName: firstTag + ' ' + label,
        age: String(age),
        rankId: rankId,
        email: id + '@example.invalid'
      });
    };

    mk('8un', 7, 'a', '8under');
    mk('912', 10, 'b', '9to12');
    mk('13U', 16, 'c', '13up');
  });

  data.student = newStudent;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Wrote', Object.keys(newStudent).length, 'student roster entries.');
}

main();
