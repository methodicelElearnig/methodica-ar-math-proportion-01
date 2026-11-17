#!/usr/bin/env node
/* ═══════════════════ statement-flow.js — methodica-math-proportion-01 behaviour ═══════════════════
   NOT DEPLOYED. What each component actually sends, walked through the REAL handlers in jsdom
   over the stub library (ADDING-REPORTING-AND-RESUME.md §6.8, §8, §10.2). Adapted from
   methodica-math-ratio-04 _test/statement-flow.js.

     regression  no ?slxapi → no library, scoring still works (XAPI_Q_RESULTS)
     walk        every component, all answers right: one answered.last per declared question,
                 each item initialized → completed once, one component completed last, success,
                 the last button disabled, nothing navigates, no console error
     gate        02 "4 of 6" and 06 "3 of 4" on both sides of the bar; 03 "3 of 4" ENDS the
                 component on screen 36 below it (and lets the learner through at it)
     single-q    screen 51 reports ONE answer for all its blanks; screen 50's three rows are three
                 true-false questions (10.11.26): one answered each, 'true' / 'false', own verdict,
                 and item 004 still scores as ONE question (XAPI_COUNT_ONCE)
     retry       for every question type: the rejected answer cannot be resubmitted, a changed
                 one can; the second attempt is answered.last; D-15 after leave/return
     hints       requested.1 once per question, across re-opens and a reload (D-7)
     resume      quiz (dual-select / dropdown / value-input toggle) mid-component; the hand-built
                 screens of 01; the class task of 04; after the end (D-8); after the 03 gate end
     b1/b2/back  B-1 seed; Back onto a no-item screen closes nothing (B-2); Back closes nothing (O-1)
     keyboard    ArrowLeft gated like the screen's own button; free under DEV_NAV
     devnav      ?dev=1: 02 routes by score (pass → 04, fail → 03), as unit.js always did
     text        answer text: stacked fractions read a/b, <br> keeps the words apart

     NODE_PATH=C:/lomda-test/node_modules node _test/statement-flow.js
   ═══════════════════════════════════════════════════════════════════════════════════════ */
'use strict';
const H = require('./harness');
const { PARTS, readMeta, PART_DIR } = H;
const R = H.makeReporter('statement-flow');
const { ok, eq } = R;

const short = s => String((s.opts && (s.opts.questionId || s.opts.objectId)) || s.objectType).replace(/\/+$/, '').split('/').pop();
const declaredCount = c => readMeta(c).subContent.reduce((a, sc) => a + (sc.questions || []).length, 0);
const comps = b => b.stmts().filter(s => s.verb === 'completed' && s.objectType === 'onlinelesson');
const qOf = (b, n) => JSON.parse(b.val('JSON.stringify(QUESTIONS.find(function(q){return q.screen===' + n + ';}) || null)'));

/* The hand-built screens, answered right (component 01) and the class task (04). */
const CUSTOM_RIGHT = {
  0: 'hookAnswer(document.querySelector(\'#s0 .city-card[data-value="cannot-know"]\'))',
  3: 'teachAnswer(document.querySelector(\'#s3 .scq-opt[data-id="same"]\')); teachCheck()',
  7: 'guidedAnswer(7, document.querySelector(\'#g7 .gc-opt[data-idx="1"]\'))',
  9: 'guidedAnswer(9, document.querySelector(\'#g9 .gc-opt[data-idx="1"]\'))',
  11: 'guidedAnswer(11, document.querySelector(\'#g11 .gc-opt[data-idx="1"]\'))',
  13: 'guidedAnswer(13, document.querySelector(\'#g13 .gc-opt[data-idx="0"]\'))',
  15: 'guidedAnswer(15, document.querySelector(\'#g15 .gc-opt[data-idx="2"]\'))',
  42: 'var __v = ["21","14.85","21 : 14.85","1.41","14.85","10.5","14.85 : 10.5","1.41"];' +
      'document.querySelectorAll("#x42 .ct-input").forEach(function(i,k){ i.value = __v[k]; i.dispatchEvent(new Event("input", { bubbles: true })); });' +
      'document.getElementById("x42-continue").click()'
};

/* Answer every question of the component in screen order, through the real handlers. Stops where
   navigation stops (a gate that ended the component). plan(n, q) → 'right' | 'wrong'. */
function walk(b, plan) {
  const P = JSON.parse(b.val('JSON.stringify(window.PART_CONFIG)'));
  for (let n = P.start; n <= P.end; n++) {
    if (n === 43) continue;
    b.exec('goTo(' + n + ')');
    if (b.val('currentScreen') !== n) break;
    const q = qOf(b, n);
    if (q) {
      const kind = plan ? plan(n, q) : 'right';
      if (kind === 'right') b.exec(H.enterJs(n, H.answerFor(q, 'right')) + H.clickCheck(n));
      else for (let k = 0; k < q.maxAttempts; k++) b.exec(H.enterJs(n, H.answerFor(q, 'wrong', k)) + H.clickCheck(n));
      continue;
    }
    if (CUSTOM_RIGHT[n]) b.exec(CUSTOM_RIGHT[n]);
  }
}
function endClick(b) {
  b.exec('(function(){ var n = PART_LAST; var q = QUESTIONS.find(function(x){return x.screen===n;});' +
    ' if (q) document.getElementById("q" + n + "-check").click(); else lastScreenButton().click(); })()');
}

(async function main() {
  /* ── regression: no launch parameters ── */
  {
    const b = await H.boot('02', { lib: false, search: '' });
    ok('regression', 'no ?slxapi: no library sender exists, so nothing can be sent', b.val('typeof window.sendStatement720 !== "function"'));
    b.exec('goTo(22);' + H.enterJs(22, { single: b.val('QUESTIONS.find(function(q){return q.screen===22;}).correct') }) + H.clickCheck(22));
    eq('regression', 'scoring still records the answer', b.val('XAPI_Q_RESULTS["002/q1"]'), true);
    eq('regression', 'xapiOnScreen is a silent no-op', b.val('(function(){ xapiOnScreen(19); xapiOnScreen(20); return "no-throw"; })()'), 'no-throw');
    ok('regression', 'nothing was fetched', !b.w.__fetches.length);
    ok('regression', 'no console errors', !b.errors.length, b.errors.slice(0, 3).join(' | '));
  }

  /* ── walk: every component, all right ── */
  for (const c of PARTS) {
    const b = await H.boot(c, { lib: true });
    b.finishBoot();
    b.exec('window.__hops = 0; goToNextPart = function () { window.__hops++; }; goToPrevPart = function () { window.__hops++; };');
    walk(b);
    endClick(b);
    endClick(b);   // a second click is silent
    b.exec('goTo(PART_FIRST - 1)');   // Back off the first screen
    const st = b.stmts();
    const answeredLast = st.filter(s => s.verb === 'answered.last');
    eq('walk', c + ' one answered.last per declared question', answeredLast.length, declaredCount(c));
    ok('walk', c + ' no plain answered when everything is right first time', !st.some(s => s.verb === 'answered'));
    ok('walk', c + ' every answer is correct', answeredLast.every(s => s.result && s.result.success === true),
      answeredLast.filter(s => !s.result.success).map(short).join(','));
    ok('walk', c + ' every answer carries a non-empty student_answer', answeredLast.every(s => s.result.extensions.student_answer[0].length > 0));
    readMeta(c).subContent.forEach(sc => {
      const id = sc.id, tag = c + ' item ' + short({ opts: { objectId: id } });
      eq('walk', tag + ' completed exactly once', st.filter(s => s.verb === 'completed' && s.opts && s.opts.objectId === id).length, 1);
      const ic = st.find(s => s.verb === 'completed' && s.opts && s.opts.objectId === id);
      if ((sc.questions || []).length) {
        ok('walk', tag + ' completed carries an explicit result (success + scaled 1)',
          ic && ic.result && ic.result.success === true && ic.result.score && ic.result.score.scaled === 1, JSON.stringify(ic && ic.result));
      }
      ok('walk', tag + ' initialized before completed',
        st.findIndex(s => s.verb === 'initialized' && s.opts && s.opts.objectId === id) <
        st.findIndex(s => s.verb === 'completed' && s.opts && s.opts.objectId === id));
    });
    const comp = comps(b);
    eq('walk', c + ' one component completed', comp.length, 1);
    ok('walk', c + ' component completed is the last statement', st[st.length - 1] && st[st.length - 1].objectType === 'onlinelesson' && st[st.length - 1].verb === 'completed');
    ok('walk', c + ' component success', comp[0] && comp[0].result && comp[0].result.success === true);
    if (declaredCount(c)) eq('walk', c + ' component scaled = 1', comp[0] && comp[0].result.score.scaled, 1);
    else ok('walk', c + ' no questions → success with no score', comp[0] && comp[0].result && !comp[0].result.score);
    ok('walk', c + ' no statement ever names the unit', !st.some(s => s.opts && s.opts.objectId === 'methodica-math-proportion-01'));
    ok('walk', c + ' the last button is disabled', b.val('lastScreenButton().disabled'));
    eq('walk', c + ' nothing navigated (no hop to a neighbour without DEV_NAV)', b.val('window.__hops'), 0);
    eq('walk', c + ' verdict recorded', b.val('getUnitResult(partResultKey())'), 'pass');
    ok('walk', c + ' no console errors', !b.errors.length, b.errors.slice(0, 3).join(' | '));
  }

  /* ── gate: 02 (items) and 06 (screens), both sides of the bar ── */
  const GATES = { '02': { total: 6, need: 4 }, '06': { total: 4, need: 3 } };
  for (const c of Object.keys(GATES)) {
    const G = GATES[c];
    for (const wrongCount of [G.total - G.need, G.total - G.need + 1]) {
      const b = await H.boot(c, { lib: true });
      b.finishBoot();
      const qmap = JSON.parse(b.val('JSON.stringify(XAPI_SCREEN_QUESTIONS)'));
      const map = JSON.parse(b.val('JSON.stringify(SCREEN_TO_SUBCONTENT)'));
      let members = Object.keys(qmap).map(Number);
      if (c === '02') { const seen = {}; members = members.filter(n => !seen[map[n][0]] && (seen[map[n][0]] = true)); }
      const wrong = new Set(members.slice(0, wrongCount));
      walk(b, n => wrong.has(n) ? 'wrong' : 'right');
      endClick(b);
      const comp = comps(b)[0];
      const pass = G.total - wrongCount >= G.need;
      eq('gate', c + ' ' + (G.total - wrongCount) + '/' + G.total + ' → success ' + pass, comp && comp.result.success, pass);
      eq('gate', c + ' scaled is counted on the promised set', comp && comp.result.score.scaled, (G.total - wrongCount) / G.total);
      eq('gate', c + ' verdict recorded', b.val('getUnitResult(partResultKey())'), pass ? 'pass' : 'fail');
      ok('gate', c + ' the component still ends below the gate', b.val('lastScreenButton().disabled'));
      if (c === '02') eq('gate', '02 the verdict agrees with unit.js standardPracticeScore()', b.val('standardPracticeScore() >= 4'), pass);
    }
  }

  /* ── gate: 03 ends ON screen 36 below "3 of 4", continues at it ── */
  {
    const basicFirst = { '001': 29, '002': 31, '003': 33, '004': 34 };
    for (const wrongItems of [['002'], ['002', '004']]) {
      const b = await H.boot('03', { lib: true });
      b.finishBoot();
      const wrong = new Set(wrongItems.map(i => basicFirst[i]));
      walk(b, n => wrong.has(n) ? 'wrong' : 'right');
      const pass = wrongItems.length <= 1;
      if (pass) {
        eq('gate03', '3/4 → the walk reaches the last screen', b.val('currentScreen'), 40);
        endClick(b);
        const comp = comps(b);
        eq('gate03', '3/4 → one component completed, at the end', comp.length, 1);
        ok('gate03', '3/4 → success, scaled 3/4', comp[0] && comp[0].result.success === true && comp[0].result.score.scaled === 0.75, JSON.stringify(comp[0] && comp[0].result));
        b.exec('goTo(36)');
        eq('gate03', '3/4 → screen 36 keeps a live button (only the real end is disabled)', b.val('document.getElementById("q36-check").disabled'), false);
      } else {
        eq('gate03', '2/4 → the learner never leaves screen 36', b.val('currentScreen'), 36);
        const comp = comps(b);
        eq('gate03', '2/4 → one component completed, from screen 36', comp.length, 1);
        ok('gate03', '2/4 → success:false, scaled 2/4', comp[0] && comp[0].result.success === false && comp[0].result.score.scaled === 0.5, JSON.stringify(comp[0] && comp[0].result));
        ok('gate03', '2/4 → item 004 closed before the component', b.stmts().some(s => s.verb === 'completed' && short(s) === 'methodica-math-proportion-01-03-004'));
        ok('gate03', '2/4 → no statement about items 005 / 006', !b.stmts().some(s => /-03-00[56]$/.test(short(s))));
        ok('gate03', '2/4 → the gate button is disabled', b.val('document.getElementById("q36-check").disabled'));
        eq('gate03', '2/4 → verdict fail', b.val('getUnitResult(partResultKey())'), 'fail');
        const n0 = b.stmts().length;
        b.exec('document.getElementById("q36-check").click(); document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" })); goTo(37)');
        eq('gate03', '2/4 → second click / ArrowLeft / goTo(37): nowhere, nothing sent', [b.val('currentScreen'), b.stmts().length - n0], [36, 0]);
        const r = await b.reload();
        r.finishBoot();
        eq('gate03', '2/4 → after a reload: lands on 36', r.val('currentScreen'), 36);
        ok('gate03', '2/4 → after a reload: the gate button stays disabled (D-8)', r.val('document.getElementById("q36-check").disabled'));
        r.exec('goTo(37)');
        eq('gate03', '2/4 → after a reload: still blocked', r.val('currentScreen'), 36);
        ok('gate03', '2/4 → after a reload: no second completed', !r.stmts().slice(n0).some(s => s.verb === 'completed'));
      }
      ok('gate03', 'no console errors', !b.errors.length, b.errors.slice(0, 3).join(' | '));
    }
  }

  /* ── single-q: 51 is ONE catalogue question; 50 is three true-false questions (10.11.26) ── */
  {
    const b = await H.boot('05', { lib: true });
    b.finishBoot();
    const q51 = qOf(b, 51);
    let n0 = b.stmts().length;
    b.exec('goTo(51);' + H.enterJs(51, H.answerFor(q51, 'right')) + H.clickCheck(51));
    let a = b.stmts().slice(n0).filter(s => /^answered/.test(s.verb));
    eq('single-q', '51 (' + q51.type + ', ' + q51.blanks.length + ' parts) → exactly one answered', a.length, 1);
    ok('single-q', '51 its answer text carries every part', a[0] && a[0].result.extensions.student_answer[0].split(' | ').length === q51.blanks.length);
    const q50 = qOf(b, 50);
    const key = q50.statements.map(s => String(s.correct));
    n0 = b.stmts().length;
    b.exec('goTo(50);' + H.enterJs(50, { rows: key }) + H.clickCheck(50));
    a = b.stmts().slice(n0).filter(s => /^answered/.test(s.verb));
    eq('single-q', '50 (3 true-false rows) → one answered per row, q1-q3', a.map(s => s.opts.questionId.split('/').pop()), ['q1', 'q2', 'q3']);
    eq('single-q', "50 each reports the row's pick 'true' / 'false', not the label", a.map(s => s.result.extensions.student_answer[0]), key);
    const b2 = await H.boot('05', { lib: true });
    b2.finishBoot();
    /* every row right but the LAST: each row its own verdict; item 004 (one question in the score) wrong */
    const lastRow = q50.statements.length - 1;
    const vals = key.map((v, i) => (i === lastRow ? (v === 'true' ? 'false' : 'true') : v));
    b2.exec('goTo(50);' + H.enterJs(50, { rows: vals }) + H.clickCheck(50));
    const a2 = b2.stmts().filter(s => /^answered/.test(s.verb));
    eq('single-q', '50 the last row wrong → rows right, right, wrong', a2.map(s => s.result.success), [true, true, false]);
    eq('single-q', '50 the last row wrong → the picks as sent', a2.map(s => s.result.extensions.student_answer[0]), vals);
    eq('single-q', '50 the last row wrong → item 004 scores as one wrong question', b2.val('JSON.stringify(XAPI_ITEM_RESULT["004"]())'), JSON.stringify({ success: false, score: { scaled: 0 } }));
    ok('single-q', '50 all rows right → item 004 scores 1', b.val('XAPI_ITEM_RESULT["004"]().score.scaled') === 1);
  }

  /* ── retry + D-15, every question type ── */
  {
    const CASES = [['02', 22], ['02', 24], ['02', 21], ['02', 25], ['05', 49], ['05', 50]];
    for (const [c, n] of CASES) {
      const b = await H.boot(c, { lib: true });
      b.finishBoot();
      const q = qOf(b, n);
      const t = n + ' (' + q.type + ')';
      b.exec('goTo(' + n + ');' + H.enterJs(n, H.answerFor(q, 'wrong', 0)) + H.clickCheck(n));
      b.exec(H.enterJs(n, H.answerFor(q, 'wrong', 0)));
      ok('retry', t + ' the same wrong answer cannot be submitted twice', b.val('document.getElementById("q' + n + '-check").disabled'));
      if (q.type === 'dual-select') {
        const w = H.answerFor(q, 'wrong', 0);
        b.exec(H.enterJs(n, Object.assign({}, w, { vals: w.vals.slice().reverse() })));
        ok('retry', t + ' the same pair in the other order is the same answer (graded unordered)', b.val('document.getElementById("q' + n + '-check").disabled'));
      }
      b.exec(H.enterJs(n, H.answerFor(q, 'wrong', 1)));
      ok('retry', t + ' a different answer can be submitted', !b.val('document.getElementById("q' + n + '-check").disabled'));
      /* D-15: leave with the changed answer pending, come back — no wrong-attempt look on it */
      b.exec('goTo(' + (n - 1) + '); goTo(' + n + ');');
      ok('retry', t + ' D-15: a changed, unsubmitted answer shows no wrong-attempt feedback',
        !b.val('document.getElementById("q' + n + '-feedbox").classList.contains("is-wrong")'));
      ok('retry', t + ' D-15: and its button is live', !b.val('document.getElementById("q' + n + '-check").disabled'));
      b.exec(H.clickCheck(n));
      const per = (q.type === 'statement' ? q.statements.length : 1);   /* 50: one statement per row */
      eq('retry', t + ' first wrong = answered, second = answered.last', b.stmts().filter(s => /^answered/.test(s.verb)).map(s => s.verb),
        Array(per).fill('answered').concat(Array(per).fill('answered.last')));
      ok('retry', t + ' no console errors', !b.errors.length, b.errors.slice(0, 3).join(' | '));
    }
  }

  /* ── hints + resume mid-component (02: dual-select 21, value-input 25) ── */
  {
    const b = await H.boot('02', { lib: true });
    b.finishBoot();
    const q20 = qOf(b, 20), q21 = qOf(b, 21), q25 = qOf(b, 25);
    b.exec('goTo(20);' + H.enterJs(20, H.answerFor(q20, 'right')) + H.clickCheck(20));
    b.exec('goTo(21); quizOpenHint(21); quizCloseHint(); quizOpenHint(21); quizCloseHint();');
    b.exec(H.enterJs(21, H.answerFor(q21, 'wrong', 0)) + H.clickCheck(21));
    eq('hints', 'two opens → one requested.1', b.stmts().filter(s => s.verb === 'requested.1').length, 1);
    /* no flush and no wait: only the synchronous flush after the commitment can have saved it */
    const before = b.stmts().length;
    const r = await b.reload();
    r.finishBoot();
    eq('resume', '02 reload lands on the saved screen', r.val('currentScreen'), 21);
    eq('resume', '02 dual-select: the rejected pair is painted and still blocked', r.val('!!quizState[21].lw && document.getElementById("q21-check").disabled'), true);
    ok('resume', '02 dual-select: the retry look is re-drawn', r.val('document.getElementById("q21-feedbox").classList.contains("is-wrong") && !!document.querySelector("#q21 .year-select.wrong")'));
    r.exec('goTo(20)');
    ok('resume', '02 the answered screen is painted finished', r.val('document.getElementById("q20-feedbox").classList.contains("is-correct")'));
    r.exec('goTo(21); quizOpenHint(21); quizCloseHint();');
    ok('hints', 'the hint on 21 is not re-reported after the reload', !r.stmts().slice(before).some(s => s.verb === 'requested.1'));
    r.exec('goTo(20); quizOpenHint(20); quizCloseHint();');
    ok('hints', 'an answered question\'s hint neither opens nor reports', !r.stmts().slice(before).some(s => s.verb === 'requested.1') &&
      r.val('document.getElementById("quiz-hint-overlay").classList.contains("hidden")'));
    ok('resume', '02 nothing re-reported by the restore', !r.stmts().slice(before).some(s => /^answered|^completed/.test(s.verb)));
    ok('b1', 'B-1 seed: the library knows item 001 was answered', r.val('!!window.xapiItemAnswered[xapiItemId("001")]'));
    /* value input, final wrong, "my answer" toggle shown → reload keeps the toggle mode (§8.10) */
    r.exec(H.enterJs(21, H.answerFor(q21, 'right')) + H.clickCheck(21));
    for (const n of [22, 23, 24]) { const q = qOf(r, n); r.exec('goTo(' + n + ');' + H.enterJs(n, H.answerFor(q, 'right')) + H.clickCheck(n)); }
    r.exec('goTo(25);');
    for (let k = 0; k < q25.maxAttempts; k++) r.exec(H.enterJs(25, H.answerFor(q25, 'wrong', k)) + H.clickCheck(25));
    r.exec('document.querySelector("#q25-feedbox .fb-answer-toggle").click(); flushResumeSave();');
    const mine = r.val('[...document.querySelectorAll("#q25 .vi-input")].map(function(i){return i.value;}).join("|")');
    const r2 = await r.reload();
    r2.finishBoot();
    eq('resume', '02 value input: lands on 25', r2.val('currentScreen'), 25);
    eq('resume', '02 value input: the "my answer" view is restored, not the solution', r2.val('[...document.querySelectorAll("#q25 .vi-input")].map(function(i){return i.value;}).join("|")'), mine);
    eq('resume', '02 value input: the toggle offers the correct answer again', r2.val('document.querySelector("#q25-feedbox .fb-answer-toggle").textContent'), 'الإجابة الصحيحة');
    ok('resume', 'no console errors', !r2.errors.length, r2.errors.slice(0, 3).join(' | '));
  }

  /* ── resume of the dropdown (05: 49 pending after a rejected attempt, 51 final wrong) ── */
  {
    const b = await H.boot('05', { lib: true });
    b.finishBoot();
    const q49 = qOf(b, 49), q51 = qOf(b, 51);
    b.exec('goTo(49);' + H.enterJs(49, H.answerFor(q49, 'wrong', 0)) + H.clickCheck(49));
    b.exec(H.enterJs(49, H.answerFor(q49, 'wrong', 1)));
    b.exec('goTo(51);' + H.enterJs(51, H.answerFor(q51, 'wrong', 0)) + H.clickCheck(51));
    const live51 = b.val('[...document.querySelectorAll("#q51 .dd-select")].map(function(s){return s.value + s.className;}).join("|")');
    b.exec('flushResumeSave()');
    const r = await b.reload();
    r.finishBoot();
    eq('resume', '05 dropdown final wrong: painted exactly as live (revealed values + marks)', r.val('[...document.querySelectorAll("#q51 .dd-select")].map(function(s){return s.value + s.className;}).join("|")'), live51);
    ok('resume', '05 dropdown final wrong: locked, feedback wrong', r.val('[...document.querySelectorAll("#q51 .dd-select")].every(function(s){return s.disabled;}) && document.getElementById("q51-feedbox").classList.contains("is-wrong")'));
    r.exec('goTo(49)');
    eq('resume', '05 dropdown pending: the changed answer is back', r.val('JSON.stringify([...document.querySelectorAll("#q49 .dd-select")].map(function(s){return s.value;}))'), JSON.stringify(H.answerFor(q49, 'wrong', 1).vals));
    ok('resume', '05 dropdown pending: no marks, live button (D-15)', r.val('!document.querySelector("#q49 .dd-select.wrong") && !document.getElementById("q49-check").disabled'));
  }

  /* ── resume of the hand-built screens (component 01) ── */
  {
    const b = await H.boot('01', { lib: true });
    b.finishBoot();
    b.exec(CUSTOM_RIGHT[0] + '; goTo(3); teachAnswer(document.querySelector(\'#s3 .scq-opt[data-id="darker"]\'));' +
      'goTo(7); ' + CUSTOM_RIGHT[7] + '; goTo(9); guidedAnswer(9, document.querySelector(\'#g9 .gc-opt[data-idx="0"]\')); goTo(10); flushResumeSave();');
    const n0 = b.stmts().length;
    const r = await b.reload();
    r.finishBoot();
    eq('resume', '01: lands on s10', r.val('currentScreen'), 10);
    r.exec('goTo(9)');
    ok('resume', '01: guided 9 painted with the saved (wrong) pick and a live continue', r.val('guidedState[9].done && !!document.querySelector("#g9 .gc-opt.chosen[data-idx=\'0\']") && !document.getElementById("g9-check").disabled'));
    r.exec('goTo(7)');
    ok('resume', '01: guided 7 painted answered', r.val('guidedState[7].done && !!document.querySelector("#g7 .gc-opt.correct")'));
    r.exec('goTo(3)');
    ok('resume', '01: s3 pending pick restored, not checked, no feedback', r.val('teachSelected === "darker" && !teachDone && !!document.querySelector("#s3 .scq-opt.selected[data-id=\'darker\']") && !document.getElementById("teach-feedback").className.includes("is-")'));
    r.exec('goTo(0)');
    ok('resume', '01: s0 painted answered, continue live', r.val('hookDone && !!document.querySelector("#s0 .city-card.correct") && !document.getElementById("s0-continue").disabled'));
    ok('resume', '01: nothing re-reported', !r.stmts().slice(n0).some(s => /^answered|^completed/.test(s.verb)));
    r.exec('goTo(3); teachCheck();');
    eq('resume', '01: the restored pending pick is reported once, when checked', r.stmts().slice(n0).filter(s => /^answered/.test(s.verb)).map(s => s.result.success), [false]);
    ok('resume', 'no console errors', !r.errors.length, r.errors.slice(0, 3).join(' | '));
  }

  /* ── resume of the class task (component 04): typed only, then checked ── */
  {
    const b = await H.boot('04', { lib: true });
    b.finishBoot();
    b.exec('goTo(42); var __i = document.querySelectorAll("#x42 .ct-input"); __i[0].value = "21"; __i[1].value = "14.85";' +
      '__i[0].dispatchEvent(new Event("input", { bubbles: true })); goTo(41);');   // leave: the screen-change save carries it
    b.exec('flushResumeSave()');
    const r0 = await b.reload();
    r0.finishBoot();
    /* §8.9: the boxes live only in the DOM. A save taken on 41 after the reload — BEFORE 42 is
       ever painted — must still carry them, so they have to be back in the DOM by then. */
    eq('resume', '04: lands on 41 (the screen left)', r0.val('currentScreen'), 41);
    r0.exec('flushResumeSave()');
    const r = await r0.reload();
    r.finishBoot();
    r.exec('goTo(42)');
    eq('resume', '04: typed boxes survive a save taken before 42 is painted', r.val('[...document.querySelectorAll("#x42 .ct-input")].slice(0,2).map(function(i){return i.value;}).join("|")'), '21|14.85');
    ok('resume', '04: still unchecked, button gated on the empty boxes', r.val('!document.getElementById("x42-continue").dataset.checked && document.getElementById("x42-continue").disabled'));
    r.exec('document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }))');
    eq('keyboard', '04: ArrowLeft does not skip the unchecked table', r.val('currentScreen'), 42);
    r.exec(CUSTOM_RIGHT[42]);
    r.exec('flushResumeSave()');
    const r2 = await r.reload();
    r2.finishBoot();
    r2.exec('goTo(42)');
    ok('resume', '04: checked table repainted (marks, locked, feedback, متابعة)', r2.val('document.getElementById("x42-continue").dataset.checked === "1" && [...document.querySelectorAll("#x42 .ct-input")].every(function(i){return i.disabled;}) && document.querySelectorAll("#x42 .vi-slot[data-mark=ok]").length === 8 && document.getElementById("q42-feedbox").classList.contains("is-correct")'));
    ok('resume', 'no console errors', !r2.errors.length, r2.errors.slice(0, 3).join(' | '));
  }

  /* ── resume after the end (component 06) ── */
  {
    const b = await H.boot('06', { lib: true });
    b.finishBoot();
    walk(b); endClick(b);
    const n0 = b.stmts().length;
    const r = await b.reload();
    r.finishBoot();
    ok('resume', '06 after the end: the last button stays disabled (D-8)', r.val('lastScreenButton().disabled'));
    endClick(r);
    ok('resume', '06 after the end: no second completed', !r.stmts().slice(n0).some(s => s.verb === 'completed'));
    /* the control: answered but never clicked keeps a live button */
    const c = await H.boot('06', { lib: true });
    c.finishBoot();
    walk(c);
    c.exec('flushResumeSave()');
    const rc = await c.reload();
    rc.finishBoot();
    ok('resume', '06 answered, not clicked: the button is live after a reload', !rc.val('lastScreenButton().disabled'));
  }

  /* ── B-2: Back onto a screen with NO item closes nothing (01: 18 → 17) ── */
  {
    const b = await H.boot('01', { lib: true });
    b.finishBoot();
    const q18 = qOf(b, 18);
    b.exec('goTo(17); goTo(18);' + H.enterJs(18, H.answerFor(q18, 'wrong', 0)) + H.clickCheck(18));
    const mark = b.stmts().length;
    b.exec('goTo(17)');
    ok('b2', 'Back s18 → s17 (no item) sends no completed', !b.stmts().slice(mark).some(s => s.verb === 'completed'));
    eq('b2', 'and leaves item 004 out of the ledger', b.val('alreadySent("doneItems", itemLedgerKey("004"))'), false);
    b.exec('goTo(18);' + H.enterJs(18, H.answerFor(q18, 'right')) + H.clickCheck(18));
    endClick(b);
    const c004 = b.stmts().filter(s => s.verb === 'completed' && short(s) === 'methodica-math-proportion-01-01-004');
    eq('b2', 'item 004 completed exactly once', c004.length, 1);
    ok('b2', 'with the final result (success, scaled 1)', c004[0] && c004[0].result && c004[0].result.success === true && c004[0].result.score.scaled === 1);
  }

  /* ── O-1: Back into an earlier item re-opens it and closes nothing (03: 31 → 30) ── */
  {
    const b = await H.boot('03', { lib: true });
    b.finishBoot();
    walk(b, n => 'right');   // to the end — then step back through two items
    const mark = b.stmts().length;
    b.exec('goTo(31); goTo(30);');
    const back = b.stmts().slice(mark);
    ok('back', 'Back into an earlier item closes nothing', !back.some(s => s.verb === 'completed'));
    ok('back', 'Back re-opens the earlier item', back.some(s => s.verb === 'initialized' && short(s) === 'methodica-math-proportion-01-03-001'));
  }

  /* ── keyboard ── */
  {
    const b = await H.boot('01', { lib: true });
    b.finishBoot();
    const key = k => b.exec('document.dispatchEvent(new KeyboardEvent("keydown", { key: "' + k + '" }))');
    key('ArrowLeft');
    eq('keyboard', 's0 unanswered → ArrowLeft stays', b.val('currentScreen'), 0);
    b.exec(CUSTOM_RIGHT[0]); key('ArrowLeft');
    eq('keyboard', 's0 answered → ArrowLeft moves', b.val('currentScreen'), 1);
    b.exec('goTo(3); teachAnswer(document.querySelector(\'#s3 .scq-opt[data-id="same"]\'));'); key('ArrowLeft');
    eq('keyboard', 's3 picked but not checked → stays (its button reads هل إجابتي صحيحة؟)', b.val('currentScreen'), 3);
    b.exec('teachCheck()'); key('ArrowLeft');
    eq('keyboard', 's3 checked → moves', b.val('currentScreen'), 4);
    b.exec('goTo(7)'); key('ArrowLeft');
    eq('keyboard', 'guided question unanswered → stays', b.val('currentScreen'), 7);
    b.exec('goTo(18)'); key('ArrowLeft');
    eq('keyboard', 'quiz screen unanswered → stays', b.val('currentScreen'), 18);
    const d = await H.boot('01', { lib: true, search: '?dev=1' });
    d.finishBoot();
    d.exec('document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }))');
    eq('keyboard', 'DEV_NAV: free navigation', d.val('currentScreen'), 1);
  }

  /* ── devnav: the walkthrough still routes 02 by its score, the platform does in production ── */
  for (const [label, wrongItems, dest] of [['pass', [], 'methodica-math-proportion-01-04'], ['fail', ['001', '002', '003'], 'methodica-math-proportion-01-03']]) {
    const b = await H.boot('02', { lib: true, search: '?dev=1&slxapi=1' });
    b.finishBoot();
    b.exec('window.__to = null; window.location.__href = null; goToNextPart = (function(orig){ return function(){ var P = window.PART_CONFIG; window.__to = P.routeByScore ? (standardPracticeScore() >= 4 ? P.nextPass : P.nextFail) : P.next; }; })(goToNextPart);');
    const firstOf = { '001': 20, '002': 22, '003': 23 };
    const wrong = new Set(wrongItems.map(i => firstOf[i]));
    walk(b, n => wrong.has(n) ? 'wrong' : 'right');
    endClick(b);
    ok('devnav', '02 ' + label + ': DEV_NAV is on (?dev=1, no registration)', b.val('DEV_NAV'));
    eq('devnav', '02 ' + label + ' → ' + dest.slice(-2), b.val('window.__to'), '../' + dest + '/');
    eq('devnav', '02 ' + label + ': the back edge is recorded for ' + dest.slice(-2), b.val('JSON.parse(sessionStorage.getItem(NAV_EDGE_KEY))["' + dest + '"].from'), PART_DIR('02'));
    eq('devnav', '02 ' + label + ': the component was still reported first', comps(b).length, 1);
  }
  {
    const b = await H.boot('03', { lib: true, search: '?dev=1&registration=r9' });
    b.finishBoot();
    eq('devnav', 'a platform launch with &dev=1 appended stays production (registration present)', b.val('DEV_NAV'), false);
    ok('devnav', 'production hides the first screen\'s cross-part back', b.val('getComputedStyle(document.querySelector("#x28 .btn-back")).display === "none"'));
  }

  /* ── answer text ── */
  {
    const b = await H.boot('01', { lib: true });
    b.finishBoot();
    b.exec(CUSTOM_RIGHT[0]);
    const a0 = b.stmts().find(s => /^answered/.test(s.verb));
    ok('text', '<br> keeps the two lines apart (s0 card)', a0 && !/نسمةمعطيات/.test(a0.result.extensions.student_answer[0]));
    eq('text', 'stacked fraction reads a/b', b.val('xapiAnswerText((function(){ var d = document.createElement("div"); d.innerHTML = \'<span class="fraction"><span class="frac-top">2</span><span class="frac-bottom">6</span></span>\'; return d; })())'), '2/6');
  }

  R.done();
})().catch(e => { console.error(e); process.exitCode = 1; });
