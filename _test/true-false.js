/* ═══════════════════ true/false responses — methodica-math-proportion-01 ═══════════════════
   NOT DEPLOYED. Dev tooling only.

   Guide Documentation/reporting-and-resume/ADDING-REPORTING-AND-RESUME.md §6.3b (2026-11-04): a
   true-false question reports result.response 'true' / 'false', never the label on the button.
   05 s50's three statement rows are three true-false questions in Kata (05-004 q1-q3, pattern
   ["true"] / ["false"] / ["false"]); until 10.11.26 the screen sent ONE combined answer under q1
   ("נכון — … | לא נכון — …") and q2 / q3 never left. The live library uses student_answer as
   result.response when no response is given, so student_answer is what is checked here.

   For s50 answered all right, wrong twice (the second attempt differs — the Retry gate — and is
   .last) and mixed: one answered per row (q1-q3) per attempt, each 'true' / 'false', the pick, and
   equal to the metadata's correct answer exactly when success; item 004 still scores as ONE
   question (XAPI_COUNT_ONCE). Every answer through the real handlers (H.enterJs / H.clickCheck).

   Run:  NODE_PATH=C:/lomda-test/node_modules node _test/true-false.js
*/
'use strict';

const H = require('./harness');
const R = H.makeReporter('true-false');
const { ok, eq } = R;

/* the metadata's true/false questions on 05, keyed qKey, correct answer as 'true' / 'false' */
const TRUE_WORDS = ['true', 'נכון', 'כן', 'صحيح', 'نعم'];
const TF = {};
for (const it of H.readMeta('05').subContent) for (const q of it.questions || []) {
  if (q.questionType !== 'true-false') continue;
  const parts = q.questionId.replace(/\/+$/, '').split('/');
  TF[parts[parts.length - 2].slice(-3) + '/' + parts[parts.length - 1]] = TRUE_WORDS.indexOf(String(q.correctAnswers[0]).trim()) !== -1 ? 'true' : 'false';
}
const flip = v => (v === 'true' ? 'false' : 'true');

async function walk(tag, attempts) {
  const b = await H.boot('05', { lib: true });
  b.finishBoot();
  const n0 = b.stmts().length;
  b.exec('goTo(50);');
  attempts.forEach(vals => b.exec(H.enterJs(50, { rows: vals }) + H.clickCheck(50)));
  const a = b.stmts().slice(n0).filter(s => /^answered/.test(s.verb));
  eq(tag, 'one answered per row per attempt', a.length, 3 * attempts.length);
  a.forEach((s, j) => {
    const k = s.opts.questionId.replace(/\/+$/, '').split('/').slice(-2).map((x, i) => (i ? x : x.slice(-3))).join('/');
    const want = attempts[Math.floor(j / 3)][j % 3];
    const r = s.result.response != null ? String(s.result.response) : ((s.result.extensions || {}).student_answer || []).join(' | ');
    ok(tag, k + ' (' + s.verb + '): reports "true" / "false"', r === 'true' || r === 'false', JSON.stringify(r));
    ok(tag, k + ': reports the pick', r === want, 'sent ' + r + ', picked ' + want);
    ok(tag, k + ': the value matches the correct answer exactly when success', (r === TF[k]) === (s.result.success === true),
       'sent ' + r + ', correct ' + TF[k] + ', success ' + s.result.success);
  });
  const last = attempts[attempts.length - 1];
  const allRight = last.every((v, i) => v === TF['004/q' + (i + 1)]);
  eq(tag, 'item 004 scores as one question', b.val('XAPI_ITEM_RESULT["004"]().score.scaled'), allRight ? 1 : 0);
  ok(tag, 'no console.error', b.errors.length === 0, b.errors.join(' | '));
}

(async () => {
  eq('meta', 'the metadata declares 05-004 q1-q3 as true-false', Object.keys(TF), ['004/q1', '004/q2', '004/q3']);
  const KEY = ['004/q1', '004/q2', '004/q3'].map(k => TF[k]);
  await walk('right', [KEY]);
  await walk('wrong', [KEY.map(flip), KEY.map((v, i) => (i < 2 ? flip(v) : v))]);   /* the Retry gate refuses the same answer twice */
  await walk('mixed', [KEY.map((v, i) => (i === 1 ? flip(v) : v))]);
  R.done();
})().catch(e => { console.error(e); process.exitCode = 2; });
