/**
 * Applies demo naming convention (match 8un-wht-blt):
 *   LastName = "{rankIndex}{a|b|c}"  e.g. 001a, 001b, 001c
 *   firstName = "{8under|9to12|13up} {RankLabel}"
 *
 * Run: node scripts/normalize-demo-student-names.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'assets', 'data', 'json', 'app-syllabus.db.json');

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

const SLUGS = [
  'wht-blt',
  'yel-str',
  'yel-blt',
  'blu-str',
  'blu-blt',
  'red-str',
  'red-blt',
  'brn-str',
  'brn-blt',
  '1bl-str',
  '2bl-str',
  '3bl-str',
  '4bl-str',
  '5bl-str',
  '6bl-str',
  '7bl-str',
  '8bl-str',
  '1st-dan',
  '2nd-dan',
  '3rd-dan'
];

const BANDS = [
  { prefix: '8un', letter: 'a', firstTag: '8under' },
  { prefix: '912', letter: 'b', firstTag: '9to12' },
  { prefix: '13U', letter: 'c', firstTag: '13up' }
];

function main() {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const st = data.student;
  let n = 0;
  for (let i = 0; i < SLUGS.length; i++) {
    const pad = String(i + 1).padStart(3, '0');
    const label = RANK_LABELS[i];
    for (const b of BANDS) {
      const id = b.prefix + '-' + SLUGS[i];
      if (!st[id]) {
        console.warn('Missing student', id);
        continue;
      }
      st[id].LastName = pad + b.letter;
      st[id].firstName = b.firstTag + ' ' + label;
      n++;
    }
  }
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Updated', n, 'demo student name fields.');
}

main();
