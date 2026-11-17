/* Dev-only console helper (never deployed — _test/ is outside the package allowlist).
   __answer(n, ok) answers quiz screen n through the engine's own handlers: ok=true submits the
   correct answer; ok=false submits wrong answers until the question is spent — a different wrong
   answer each time, because the Retry gate (quiz-engine.js) refuses the same one twice.
   __fmt(stmt) is a one-line statement summary for the stub's __stmts(). */
(function () {
  'use strict';
  function wrongVariant(q, k) {
    if (q.type === 'single') {
      var w = q.options.filter(function (o) { return o.id !== q.correct; });
      return w[k % w.length].id;
    }
    if (q.type === 'multi') {
      var ids = q.options.map(function (o) { return o.id; });
      var bad = ids.filter(function (id) { return q.correctSet.indexOf(id) === -1; });
      return k === 0 ? [bad[0] || ids[0]] : (bad.length > 1 ? [bad[0], bad[1]] : q.correctSet.slice(0, 1).concat(bad));
    }
    if (q.type === 'value-input') return q.correctInputs.map(function () { return String(900 + k); });
    if (q.type === 'dropdown') return q.blanks.map(function (b) { var w = b.pool.filter(function (v) { return v !== b.correct; }); return w[k % w.length]; });
    if (q.type === 'dual-select') { var p = q.pool.filter(function (y) { return q.correctPair.indexOf(y) === -1; }); return [p[k % p.length], q.correctPair[0]]; }
    if (q.type === 'statement') return q.statements.map(function (s, i) { return i === 0 ? String(!s.correct) : (k ? String(!s.correct) : String(s.correct)); });
  }
  function correctOf(q) {
    if (q.type === 'single') return q.correct;
    if (q.type === 'multi') return q.correctSet.slice();
    if (q.type === 'value-input') return q.correctInputs.slice();
    if (q.type === 'dropdown') return q.blanks.map(function (b) { return b.correct; });
    if (q.type === 'dual-select') return q.correctPair.slice();
    if (q.type === 'statement') return q.statements.map(function (s) { return String(s.correct); });
  }
  function put(n, q, v) {
    var root = '#q' + n;
    if (q.type === 'single') { quizSelect(n, document.querySelector(root + ' .scq-opt[data-id="' + v + '"]')); return; }
    if (q.type === 'multi') {
      document.querySelectorAll(root + ' .scq-opt.selected').forEach(function (o) { quizSelect(n, o); });
      v.forEach(function (id) { quizSelect(n, document.querySelector(root + ' .scq-opt[data-id="' + id + '"]')); });
      return;
    }
    if (q.type === 'value-input') { document.querySelectorAll(root + ' .vi-input').forEach(function (i, k) { i.value = v[k]; }); quizInputChange(n); return; }
    if (q.type === 'dropdown') { document.querySelectorAll(root + ' .dd-select').forEach(function (s, k) { s.value = v[k]; }); quizDropdownChange(n); return; }
    if (q.type === 'dual-select') { document.querySelectorAll(root + ' .year-select').forEach(function (s, k) { s.value = v[k]; }); quizDualChange(n); return; }
    if (q.type === 'statement') {
      document.querySelectorAll(root + ' .stmt-row').forEach(function (r, k) {
        quizStatementPick(n, k, r.querySelector('.stmt-pill[data-val="' + v[k] + '"]'));
      });
    }
  }
  window.__answer = function (n, ok) {
    var q = QUESTIONS.find(function (x) { return x.screen === n; });
    if (currentScreen !== n) goTo(n);
    var st = quizState[n];
    for (var k = 0; !st.done && k < 5; k++) {
      put(n, q, ok ? correctOf(q) : wrongVariant(q, k));
      if (document.getElementById('q' + n + '-check').disabled) return 'blocked at attempt ' + (k + 1);
      quizCheck(n);
    }
    return st.done ? (st.wasCorrect ? 'correct' : 'wrong') : 'not done';
  };
  window.__fmt = function (s) {
    var id = ((s.opts && (s.opts.objectId || s.opts.questionId)) || '').split('/').filter(Boolean).pop() || 'COMPONENT';
    var r = s.result ? ' ' + JSON.stringify({ ok: s.result.success, sc: s.result.score && s.result.score.scaled }) : '';
    return s.verb + ' ' + id + r;
  };
})();
