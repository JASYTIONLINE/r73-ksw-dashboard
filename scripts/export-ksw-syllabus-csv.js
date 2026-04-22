/**
 * Writes assets/data/csv/ksw-syllabus.csv from assets/data/json/app-syllabus.db.json (rowKind export).
 * for editing in Excel. Run: node scripts/export-ksw-syllabus-csv.js
 */
/* eslint-disable no-console */
var fs = require('fs');
var path = require('path');

var jsonPath = path.join(__dirname, '..', 'assets', 'data', 'json', 'app-syllabus.db.json');
var outPath = path.join(__dirname, '..', 'assets', 'data', 'csv', 'ksw-syllabus.csv');

function esc(v) {
  if (v === null || v === undefined) return '';
  var s = String(v);
  if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function row(cells) {
  return cells.map(esc).join(',');
}

var j = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

if (
  !Array.isArray(j.items) &&
  j.SKILL &&
  typeof j.SKILL === 'object' &&
  !Array.isArray(j.SKILL) &&
  !j.tables
) {
  console.error(
    'This JSON is the top-level map shape (Rank, SKILL, skillStatus, …). export-ksw-syllabus-csv.js only supports the envelope with items[]. Edit ksw-syllabus.csv and run node scripts/csv-to-app-syllabus-db.mjs for that pipeline.'
  );
  process.exit(1);
}

var lines = [];

lines.push(
  row([
    'rowKind',
    'c1',
    'c2',
    'c3',
    'c4',
    'c5',
    'c6',
    'c7',
    'c8',
    'c9',
    'c10',
    'c11',
    'c12'
  ])
);
lines.push(
  row([
    '_NOTE',
    'Edit rows by rowKind. ITEM = JSON items[] (canonical). REQ = requirementsByAgeBand (comma-separated S keys). Re-run this script after JSON changes to refresh CSV.',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ])
);

lines.push(row(['META', 'version', String(j.version), '', '', '', '', '', '', '', '', '', '']));
lines.push(row(['META', 'source', j.source || '', '', '', '', '', '', '', '', '', '', '']));
Object.keys(j.syllabusByAgeGroup || {}).forEach(function (bandKey) {
  var src =
    j.syllabusByAgeGroup[bandKey] && j.syllabusByAgeGroup[bandKey].source
      ? j.syllabusByAgeGroup[bandKey].source
      : '';
  lines.push(
    row([
      'META',
      'syllabusByAgeGroup.' + bandKey + '.source',
      src,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ])
  );
});

Object.keys(j.beltStepLabels || {})
  .sort(function (a, b) {
    return Number(a) - Number(b);
  })
  .forEach(function (rank) {
    lines.push(row(['BELT', rank, j.beltStepLabels[rank], '', '', '', '', '', '', '', '', '', '']));
  });

Object.keys(j.categoryDisplayNames || {}).forEach(function (k) {
  lines.push(row(['CATDISP', k, j.categoryDisplayNames[k], '', '', '', '', '', '', '', '', '', '']));
});

Object.keys(j.learningObjectiveDisplayNames || {}).forEach(function (k) {
  lines.push(row(['LOADISP', k, j.learningObjectiveDisplayNames[k], '', '', '', '', '', '', '', '', '', '']));
});

Object.keys(j.categoryPriority || {}).forEach(function (k) {
  lines.push(row(['CATPRI', k, String(j.categoryPriority[k]), '', '', '', '', '', '', '', '', '', '']));
});

(j.items || []).forEach(function (it) {
  lines.push(
    row([
      'ITEM',
      it.count,
      it.key,
      it.rank,
      it.learningObjective,
      it.name,
      it.type,
      it.status,
      it.description,
      '',
      '',
      '',
      ''
    ])
  );
});

Object.keys(j.requirementsByAgeBand || {}).forEach(function (ageBand) {
  var byRank = j.requirementsByAgeBand[ageBand];
  Object.keys(byRank || {})
    .sort(function (a, b) {
      return Number(a) - Number(b);
    })
    .forEach(function (rank) {
      var keys = byRank[rank];
      var joined = Array.isArray(keys) ? keys.join(',') : '';
      lines.push(row(['REQ', ageBand, rank, joined, '', '', '', '', '', '', '', '', '']));
    });
});

(j.objects && j.objects.Glossary ? j.objects.Glossary : []).forEach(function (g) {
  lines.push(
    row([
      'GLOSSARY',
      g.Count,
      g.Key,
      g.Rank,
      g.Word,
      g.Translation,
      g.Type,
      g.Definition,
      g.col9 || '',
      '',
      '',
      '',
      ''
    ])
  );
});

(j.objects && j.objects.Priority ? j.objects.Priority : []).forEach(function (p) {
  lines.push(
    row([
      'PRIORITY',
      p.Object || 'Priority',
      p.Count,
      p.Key,
      p.Rank,
      p.Type,
      p.col6 || '',
      p.col7 || '',
      p.col8 || '',
      p.col9 || '',
      '',
      ''
    ])
  );
});

var body = lines.join('\r\n');
fs.writeFileSync(outPath, '\ufeff' + body, 'utf8');
console.log('Wrote', outPath, '(' + lines.length + ' lines)');
