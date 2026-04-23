/**
 * Assigns WKSA three-band rank ids (8under / 9to12 / 13up) on each SKILL row
 * from junior (12d) and adult testing charts. Run from repo root:
 *   node scripts/assign-three-band-ranks.mjs
 *
 * Belt ids rb002.. match Rank.serialNumber (promotion / testing ladder).
 * Skills not explicitly listed keep 13up from prior 13up; 8under/9to12 default
 * from former 12under where no chart split applies.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dbPath = path.join(root, 'assets', 'data', 'json', 'app-syllabus.db.json');

const rb = (n) => 'rb' + String(n).padStart(3, '0');

/** @returns {{ u8?: string, j912?: string, p13?: string }} */
function bandsForSkill(nameRaw, serialNumber, prev12, prev13) {
  const name = String(nameRaw || '').trim();
  const sn = parseInt(String(serialNumber || '').trim(), 10) || 0;
  const d12 = prev12 || rb(1);
  const d13 = prev13 || rb(1);

  const out = { u8: d12, j912: d12, p13: d13 };

  // --- Sonnh / Sohn Ppae Ki (5) — all charts: first at yellow stripe test
  if (name === 'Sohnh Ppae Ki' && sn >= 1 && sn <= 5) {
    return { u8: rb(2), j912: rb(2), p13: rb(2) };
  }

  // --- Ki Bohn Soo (15)
  if (name === 'Ki Bohn Soo') {
    const p13 = sn <= 5 ? rb(2) : rb(3);
    const j912 = sn <= 5 ? rb(2) : sn <= 10 ? rb(4) : rb(5);
    if (sn <= 5) return { u8: rb(4), j912, p13 };
    return { u8: null, j912, p13 };
  }

  // --- Ki Cho Hyung (6)
  if (name === 'Ki Cho Hyung') {
    const p13 = sn <= 3 ? rb(2) : rb(3);
    const j912 = sn <= 3 ? rb(2) : sn <= 6 ? rb(4) : rb(5);
    if (sn <= 2) return { u8: rb(2), j912, p13 };
    if (sn <= 4) return { u8: rb(4), j912, p13 };
    return { u8: null, j912, p13 };
  }

  // --- Sohn Mohk Soo (6) — junior: 9-12 r005/r006 1-11 vs 8&under 1-5; adult differs
  if (name === 'Sohn Mohk Soo') {
    const p13 = sn <= 5 ? rb(4) : rb(5);
    const j912 = sn <= 5 ? rb(6) : rb(7);
    if (sn <= 5) return { u8: rb(6), j912, p13 };
    return { u8: null, j912, p13 };
  }

  // --- Cho Geup Hyung (2)
  if (name === 'Cho Geup Hyung') {
    const p13 = sn === 1 ? rb(4) : rb(5);
    const j912 = sn === 1 ? rb(6) : rb(7);
    const u8 = sn === 1 ? rb(6) : rb(7);
    return { u8, j912, p13 };
  }

  // --- Joong Geup Hyung (2)
  if (name === 'Joong Geup Hyung') {
    const p13 = sn === 1 ? rb(6) : rb(7);
    const j912 = sn === 1 ? rb(8) : rb(9);
    const u8 = sn === 1 ? rb(8) : rb(8);
    return { u8, j912, p13 };
  }

  // --- Eue Bohk Soo (13)
  if (name === 'Eue Bohk Soo') {
    const p13 = sn <= 6 ? rb(6) : rb(7);
    const j912 = sn <= 11 ? rb(8) : rb(9);
    const u8 = sn <= 6 ? rb(8) : rb(9);
    return { u8, j912, p13 };
  }

  // --- An Sohn Mok Soo (6) — adult chart r007 brown stripe (not on junior chart)
  if (name === 'An Sohn Mok Soo') {
    return { u8: null, j912: d12, p13: rb(8) };
  }

  // --- Maek Chi Ki (15) — adult r008 brown belt; junior r009 black stripe / dahn bo row
  if (name === 'Maek Chi Ki') {
    return {
      u8: sn <= 7 ? rb(10) : rb(11),
      j912: rb(10),
      p13: rb(9)
    };
  }

  // --- Maek Cha Ki (15) — adult r009 black stripe
  if (name === 'Maek Cha Ki') {
    return { u8: rb(10), j912: rb(11), p13: rb(10) };
  }

  // --- Goh Geup Hyung (2)
  if (name === 'Goh Geup Hyung') {
    const p13 = sn === 1 ? rb(8) : rb(9);
    const j912 = sn === 1 ? rb(8) : rb(9);
    const u8 = sn === 1 ? rb(9) : rb(9);
    return { u8, j912, p13 };
  }

  // --- Dae Geup Hyung (2)
  if (name === 'Dae Geup Hyung') {
    const p13 = sn === 1 ? rb(10) : rb(11);
    const j912 = sn === 1 ? rb(10) : rb(11);
    const u8 = sn === 1 ? rb(10) : rb(10);
    return { u8, j912, p13 };
  }

  // --- Joo Muhk Maga Ki Bon Soo (15)
  if (name === 'Joo Muhk Maga Ki Bon Soo') {
    return { u8: rb(16), j912: rb(11), p13: rb(11) };
  }

  // --- Joong Geup Sohn Mok Soo (15) — black-belt promotion material
  if (name === 'Joong Geup Sohn Mok Soo') {
    return { u8: null, j912: rb(16), p13: rb(16) };
  }

  // --- Ap Eue Bohk Soo (20)
  if (name === 'Ap Eue Bohk Soo') {
    return { u8: null, j912: rb(16), p13: rb(16) };
  }

  // --- Dae Eue Bok Soo (23)
  if (name === 'Dae Eue Bok Soo') {
    return { u8: null, j912: rb(16), p13: rb(16) };
  }

  // --- Kwahn Juhl Ki, Too Ki (black belt common adult chart)
  if (name === 'Kwahn Juhl Ki' || name === 'Too Ki') {
    return { u8: null, j912: rb(16), p13: rb(16) };
  }

  // --- Mohk Joh Leu Ki, Bahng Too Ki (adult 18+ on chart — use rb016)
  if (name === 'Mohk Joh Leu Ki' || name === 'Bahng Too Ki') {
    return { u8: null, j912: null, p13: rb(16) };
  }

  // --- Yahng Sahn Mok Soo, Ssahng Soo, Dahn Do Mahk Ki (optional / time permitting)
  if (name === 'Yahng Sahn Mok Soo' || name === 'Ssahng Soo' || name === 'Dahn Do Mahk Ki') {
    return { u8: null, j912: rb(16), p13: rb(16) };
  }

  // --- Guhm Moo Hyung (2)
  if (name === 'Guhm Moo Hyung') {
    return { u8: rb(16), j912: rb(16), p13: rb(16) };
  }

  // --- Sword Cutting Technique (6) — “Sword Techs” on charts
  if (name === 'Sword Cutting Technique') {
    return { u8: rb(16), j912: rb(16), p13: rb(16) };
  }

  // --- Bong Do Liki (14) — bohng dol-iki on charts
  if (name === 'Bong Do Liki') {
    return { u8: rb(16), j912: rb(16), p13: rb(16) };
  }

  // Default: no chart split — mirror legacy two-band columns
  return { u8: d12, j912: d12, p13: d13 };
}

function main() {
  const raw = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(raw);
  const sk = data.SKILL;
  if (!sk || typeof sk !== 'object') {
    console.error('No SKILL table');
    process.exit(1);
  }

  let n = 0;
  for (const key of Object.keys(sk)) {
    const row = sk[key];
    if (!row || typeof row !== 'object') continue;
    const prev12 = row['12under'] ?? row['9to12'] ?? row.twelveDown ?? rb(1);
    const prev13 = row['13up'] ?? row.thirteenPlus ?? rb(1);
    const b = bandsForSkill(row.name, row.serialNumber, prev12, prev13);

    const next = { ...row };
    delete next['12under'];
    delete next.twelveDown;
    delete next['13up'];
    delete next.thirteenPlus;

    if (b.u8 != null) next['8under'] = b.u8;
    else delete next['8under'];

    next['9to12'] = b.j912 != null ? b.j912 : prev12;
    next['13up'] = b.p13 != null ? b.p13 : prev13;

    sk[key] = next;
    n++;
  }

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Updated', n, 'SKILL rows with 8under / 9to12 / 13up');
}

main();
