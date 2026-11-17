#!/usr/bin/env node
/* ═══════════════════ mutations.js — prove the suites can fail (guide §10.4) ═══════════════════
   NOT DEPLOYED. Each mutation breaks ONE thing the integration depends on, at an anchor that must
   occur exactly once; the runner checks the break landed, runs the suites named for it, expects
   at least one to FAIL, and restores the file byte for byte (and checks that too).

     NODE_PATH=C:/lomda-test/node_modules node _test/mutations.js          # all
     NODE_PATH=C:/lomda-test/node_modules node _test/mutations.js 3 7      # by number

   A mutation that leaves every suite green is a test that tests nothing — the runner exits 1.
   ═══════════════════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const P = 'methodica-math-proportion-01';
const A = 'verify-assets.js', V = 'verify-report.js', S = 'statement-flow.js';

const MUTATIONS = [
  ['03 gate threshold 3 → 2', `${P}-03/script.js`, 'need: 3, at: 36', 'need: 2, at: 36', [V, S]],
  ['a missing map key (02 screen 23)', `${P}-02/script.js`, "  23: ['003', 1],\n", '', [V, S]],
  ['the 02 gate drops to 3 of 6', `${P}-02/script.js`, "{ of: 'items', need: 4 }", "{ of: 'items', need: 3 }", [V, S]],
  /* 10.11.26: s50's rows are three true-false questions (05-004 q1-q3) — the old "one-key screen
     reported per row" mutation has no target any more; these two guard the new behaviour */
  ['a true-false row reports the label again', 'unit-js/70-platform.js',
    "isLast, v == null ? '' : String(v));", "isLast, v === 'true' ? 'נכון' : 'לא נכון');", [S]],
  ['004 counted per row (XAPI_COUNT_ONCE ignored)', 'unit-js/70-platform.js',
    '    if (_countOnce(it)) { total++; if (_itemAllOk(it)) ok++; return; }\n', '', [V]],
  ['no flush after the answer commitment', 'unit-js/70-platform.js', 'function onQuizCommitted(screen) { flushResumeSave(); }', 'function onQuizCommitted(screen) { }', [S]],
  ['no Retry signature on a rejected attempt', 'unit-js/quiz-engine.js', '    st.lw = quizSig(q, st);', '    st.lw = null;', [S]],
  ['the dual-select pair signed in order', 'unit-js/quiz-engine.js',
    "if (q.type === 'dual-select') return JSON.stringify([...(st.selectedSet || [])].sort());", "if (q.type === 'dual-select') return JSON.stringify(st.selectedSet || []);", [S]],
  ['no repaint on goTo', 'unit-js/engine.js', "if (typeof repaintScreen === 'function') { try { repaintScreen(n); }", "if (false) { try { repaintScreen(n); }", [V, S]],
  ['no ended-button restore (D-8)', 'unit-js/20-xapi.js', "  if (ends.indexOf(currentScreen) === -1) return;\n", '  return;\n', [S]],
  ['a hop without DEV_NAV', 'unit-js/70-platform.js', '  if (DEV_NAV && P) {', '  if (P) {', [S]],
  ['an ungated keyboard', 'unit-js/70-platform.js', 'function keyboardForwardAllowed() {\n  if (DEV_NAV) return true;', 'function keyboardForwardAllowed() {\n  return true;', [S]],
  ['the hint reported before its done-guard', 'unit-js/quiz-engine.js',
    "  if (st.done) return;\n  /* Platform layer: requested.1", "  /* Platform layer: requested.1", [V, S]],
  ['the hook answer never reaches the seam', 'unit-js/unit.js', '    try { onCustomAnswered(0, { pick: cardEl.dataset.value }); }', '    try { }', [V, S]],
  ['a wrong id prefix', 'unit-js/10-identity.js', "math/proportion/01/';", "math/proportion/1/';", [V]],
  ['the class-task boxes not restored to the DOM', 'unit-js/70-platform.js', '    if (!inp.value && typeof s.vals[i] === \'string\') inp.value = s.vals[i];', '    void 0;', [S]],
  ['the in-component gate never ends anything', 'unit-js/70-platform.js', '  if (!_gateEnds()) return false;\n  _endComponent', '  return false;\n  _endComponent', [S]],
  ['item results left to the library', 'unit-js/20-xapi.js', '  return f ? f() : null;', '  return null;', [S]],
  ['an unpainted dropdown', 'unit-js/70-platform.js', "    else if (q.type === 'dropdown') paintSelects(n, q, st, '.dd-select');\n", '', [V, S]],
  ['the cross-part back left visible', 'unit-js/90-boot.js', '  try { hideCrossPartBack(); }', '  try { }', [V, S]],
  ['the report form posts an empty item', 'unit-js/report-modal.js', "  body.append('entry.1555704258', where.item);", "  body.append('entry.1555704258', '');", [V]],
  ['a styles.css copy grows back in a component', null, null, null, [A]],
];

const only = process.argv.slice(2).map(Number).filter(Boolean);
const run = f => spawnSync(process.execPath, [path.join(__dirname, f)], { cwd: ROOT, env: process.env, encoding: 'utf8' });
let bad = 0;
MUTATIONS.forEach(([name, file, find, repl, suites], i) => {
  const no = i + 1;
  if (only.length && !only.includes(no)) return;
  let restore;
  if (file === null) {                      // a file-level mutation: an extra copy appears
    const p = path.join(ROOT, `${P}-02/styles.css`);
    fs.copyFileSync(path.join(ROOT, 'unit-css/styles.css'), p);
    restore = () => fs.unlinkSync(p);
  } else {
    const p = path.join(ROOT, file);
    const orig = fs.readFileSync(p);
    const src = orig.toString('utf8');
    const count = src.split(find).length - 1;
    if (count !== 1) { console.log(`#${no} ${name}: ANCHOR FOUND ${count}× — mutation not applied`); bad++; return; }
    fs.writeFileSync(p, src.replace(find, repl));
    if (fs.readFileSync(p).equals(orig)) { console.log(`#${no} ${name}: mutation did not land`); bad++; return; }
    restore = () => { fs.writeFileSync(p, orig); if (!fs.readFileSync(p).equals(orig)) { console.log(`#${no} RESTORE FAILED for ${file}`); process.exit(2); } };
  }
  try {
    const red = suites.filter(f => run(f).status !== 0);
    if (red.length) console.log(`#${no} ${name}: caught by ${red.join(', ')}`);
    else { console.log(`#${no} ${name}: NOT CAUGHT — every suite stayed green`); bad++; }
  } finally { restore(); }
});
console.log(bad ? `\n${bad} mutation(s) not caught` : '\nevery mutation caught; every file restored byte for byte');
process.exitCode = bad ? 1 : 0;
