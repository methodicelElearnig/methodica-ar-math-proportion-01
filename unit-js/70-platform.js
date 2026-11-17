'use strict';
/* ═══════════════════════════════════════════════════════════════════
   methodica-math-proportion-01 — platform glue: xAPI reporting + resume on the 720-core engine.

   The platform files (10-identity / 20-xapi / 40-resume / 50-loader / 90-boot) come from
   methodica-math-ratio-04 (e7a9531), which runs on the same 720-core (engine.js /
   quiz-engine.js). This file is that unit's 70-platform.js, rewritten for what this unit has:
     - two question types no sibling paints: `dropdown` (screens 49, 51) and `dual-select`
       (screen 21) — paintDropdown / paintDual below
     - screens whose several rows or blanks the catalogue declares as ONE question (50, 51):
       reported once, all or nothing (§6.3 / QA D-9 — never split finer than the catalogue)
     - hand-built answer screens outside the quiz engine (component 01: the hook s0, the s3
       teaching question, the guided steps 7/9/11/13/15) and the class-task table (04: x42)
     - the pass gates the screens promise: 02 "4 of 6", 06 "3 of 4", and 03 "3 of 4" — the one
       gate that ENDS a component early (screen 36, decided 2026-10-05; partGateBlocks)
   quizState / QUESTIONS / TOTAL_SCREENS / GUIDED / guidedState / hookDone / teachDone /
   teachSelected / EXTRA_SCREENS are top-level in the shared global lexical scope, so this
   shared file reaches them directly. inPart(n) is unit.js's own (declaring it again here would
   be a silent last-wins overwrite — §3.3).

   Definition-only, like the rest of unit-js/ except 90-boot.js.

   Seams it provides:
     PART_FIRST / PART_LAST / PART_PREV  this component's range and its predecessor (PART_CONFIG)
     partEndScreens() / lastScreenButton()   where this component can end, and its button (D-8)
     partExit(dir)              engine.js goTo() walking off either end of the component
     partGateBlocks(from, to)   engine.js goTo() — a pass gate that ends the component (03)
     partResult()               the component result sent with 'completed'
     keyboardForwardAllowed()   engine.js ArrowLeft gate
     capturePartPayload / applyResumeVars / applyResumeDom / restoreScreenUI   the resume hooks
     applyExecutionState(st, n) the restore replay (50-loader.js phase B)
     repaintScreen(n)           engine.js goTo(), after resetScreenState — every navigation (§8.4a)
     onQuizAnswered / onQuizCommitted / onQuizHint   quiz-engine.js call sites
     onCustomAnswered / onCustomPick                 unit.js call sites (hand-built screens)
     partBoot()                 90-boot.js — builds the question screens and lands the part
   Design record: docs-and-tools/REPORTING-RESUME.md.
   ═══════════════════════════════════════════════════════════════════ */

var PART_FIRST = (window.PART_CONFIG && typeof window.PART_CONFIG.start === 'number') ? window.PART_CONFIG.start : 0;
var PART_LAST  = (window.PART_CONFIG && typeof window.PART_CONFIG.end === 'number') ? window.PART_CONFIG.end : TOTAL_SCREENS - 1;
/* Read by hideCrossPartBack (40-resume.js): a component with a predecessor hides its first
   screen's "عودة" in production. */
var PART_PREV  = (window.PART_CONFIG && window.PART_CONFIG.prev) || null;

/* The class-task boxes (x42) carry no ids, so the O-2 id list stays empty; initQuizFieldSaves
   below arms the debounced save for them by class instead. */
var RESUME_INPUT_IDS = [];
var RESUME_TEXT_IDS  = [];

function _pq(n) { return QUESTIONS.find(function (x) { return x.screen === n; }) || null; }
function _partQuestions() { return QUESTIONS.filter(function (q) { return inPart(q.screen); }); }
function _itemFor(n) {
  var m = (typeof SCREEN_TO_SUBCONTENT !== 'undefined') ? SCREEN_TO_SUBCONTENT[n] : null;
  return m ? m[0] : null;
}
/* The catalogue questions a screen answers, e.g. ['q1'] or, on screen 21, ['q2']. */
function _qKeysFor(n) {
  var m = (typeof XAPI_SCREEN_QUESTIONS !== 'undefined') ? XAPI_SCREEN_QUESTIONS[n] : null;
  return m || [];
}
function _htmlNode(html) { var d = document.createElement('div'); d.innerHTML = html || ''; return d; }
function _txt(html) { return xapiAnswerText(_htmlNode(html)); }

/* ═══════════════════ Reporting call sites (quiz-engine.js) ═══════════════════ */

/* What the learner answered, as they see it. Choice: the option's own text (zoom chips and the
   radio glyph stripped, stacked fractions written a/b — xapiAnswerText), else an image's alt, else
   the option id. Value input: the boxes in data-slot order — a ratio row reads "3:2", anything else
   "a | b". Dropdown / dual-select: the picked values in sentence order. Statement: each row's
   נכון / לא נכון with its text. */
function quizAnswerText(screen, q, st) {
  try {
    if (q.type === 'single' || q.type === 'multi') {
      var ids = q.type === 'multi' ? (st.selectedSet || []) : [st.selected];
      return ids.map(function (id) {
        var o = document.querySelector('#q' + screen + ' .scq-opt[data-id="' + id + '"]');
        if (!o) return String(id);
        var t = xapiAnswerText(o.querySelector('.scq-opt-text') || o);
        var img = t ? null : o.querySelector('img');
        return t || (img && img.getAttribute('alt')) || String(id);
      }).join(', ');
    }
    if (q.type === 'value-input') {
      return (st.selectedSet || []).join(q.ratioRows ? ':' : ' | ');
    }
    if (q.type === 'dropdown' || q.type === 'dual-select') {
      return (st.selectedSet || []).map(function (v) { return v || '—'; }).join(' | ');
    }
    if (q.type === 'statement') {
      return (q.statements || []).map(function (s, i) {
        var v = (st.selectedSet || [])[i];
        return (v === 'true' ? 'صحيح' : v === 'false' ? 'غير صحيح' : '—') + ' — ' + _txt(s.text);
      }).join(' | ');
    }
    return JSON.stringify(st.selectedSet || st.selected || '');
  } catch (e) { return ''; }
}

/* Called from quizCheck() after the verdict is known and BEFORE any marking — every submit, all
   three branches. The isLast idiom is the family's: correct || attempts exhausted; the Retry gate
   (quiz-engine.js) makes the second attempt a real one, so answered.last counts are honest.
   A statement screen whose rows the catalogue declares as separate questions reports one per row,
   each with its own verdict and the row's pick 'true' / 'false' — Kata's correctXapiResponsesPattern
   for a true-false question is the boolean, never the label (guide §6.3b; 05 s50 since 10.11.26). */
function onQuizAnswered(screen, q, st, correct) {
  var item = _itemFor(screen);
  var keys = _qKeysFor(screen);
  if (!item || !keys.length) return;
  var isLast = correct || st.attempts >= q.maxAttempts;
  if (q.type === 'statement' && keys.length > 1 && keys.length === (q.statements || []).length) {
    keys.forEach(function (k, i) {
      var v = (st.selectedSet || [])[i];
      var s = q.statements[i];
      xapiAnswered(item, k, v === String(s.correct), isLast, v == null ? '' : String(v));
    });
    return;
  }
  xapiAnswered(item, keys[0], correct, isLast, quizAnswerText(screen, q, st));
}

/* Called at the very tail of quizCheck(), after the last commitment (done / lw / verdict) on every
   path — the flush-after-last-commitment contract (§8.3, D-13). */
function onQuizCommitted(screen) { flushResumeSave(); }

/* Called from quizOpenHint() after its done-guard, immediately before the overlay opens. The hints
   ledger (xapiRequestedHint → sendStatementOnce) reports each question's hint once per attempt,
   across re-opens and reloads (D-7). */
function onQuizHint(screen) {
  var item = _itemFor(screen);
  var keys = _qKeysFor(screen);
  if (item && keys.length) xapiRequestedHint(item, keys[0]);
}

/* ═══════════════════ The hand-built screens (unit.js) ═══════════════════
   Component 01 asks seven catalogue questions outside the quiz engine, and component 04's class
   task is a graded table with no catalogue question. unit.js keeps its own DOM logic and calls:
     onCustomPick(screen, patch)      a pending choice (s3's option before צדקתי?):
                                      remembered and saved, never reported
     onCustomAnswered(screen, patch)  a committed answer (s0, s3's צדקתי?, a guided pick, x42's
                                      צדקתי?): remembered, reported when the screen maps to a
                                      catalogue question, flushed
   Both ignore calls made while a painter replays a handler (resumeIsPainting) — the painters
   below restore these screens by calling unit.js's own handlers with the saved choice. */
var CUSTOM_STATE = {};

/* Every one of these has ONE attempt in live play, so every answer is the last. */
var CUSTOM_KEYS = {
  0: { correct: function (s) { return s.pick === 'cannot-know'; },
       text: function (s) {
         var c = document.querySelector('#s0 .city-card[data-value="' + s.pick + '"] .city-card-label');
         return c ? xapiAnswerText(c) : String(s.pick || '');
       } },
  3: { correct: function (s) { return s.pick === 'same'; },
       text: function (s) {
         var o = document.querySelector('#s3 .scq-opt[data-id="' + s.pick + '"] .scq-opt-text');
         return o ? xapiAnswerText(o) : String(s.pick || '');
       } }
};
function _guidedCfg(n) { return (typeof GUIDED !== 'undefined') ? GUIDED.find(function (g) { return g.screen === n; }) : null; }

function onCustomPick(screen, patch) {
  if (resumeIsPainting()) return;
  CUSTOM_STATE[screen] = Object.assign(CUSTOM_STATE[screen] || {}, patch);
  scheduleResumeSave();
}

function onCustomAnswered(screen, patch) {
  if (resumeIsPainting()) return;
  var s = CUSTOM_STATE[screen] = Object.assign(CUSTOM_STATE[screen] || {}, patch, { done: true });
  if (screen === 42) s.vals = _ctValues();
  var item = _itemFor(screen);
  var keys = _qKeysFor(screen);
  if (item && keys.length) {
    var correct = false, text = '';
    var g = _guidedCfg(screen);
    if (CUSTOM_KEYS[screen]) { correct = CUSTOM_KEYS[screen].correct(s); text = CUSTOM_KEYS[screen].text(s); }
    else if (g && g.q) { correct = s.pick === g.q.correct; text = _txt(g.q.opts[s.pick]); }
    xapiAnswered(item, keys[0], correct, true, text);
  }
  flushResumeSave();
}

/* The class-task boxes, in document order (row by row, four per row). */
function _ctInputs() { return Array.prototype.slice.call(document.querySelectorAll('#x42 .ct-input')); }
function _ctValues() { return _ctInputs().map(function (i) { return i.value; }); }

/* ═══════════════════ Scores, gates and results ═══════════════════
   One rule for every component, from XAPI_Q_RESULTS — the same truth the 'answered' statements
   carried, so a result cannot disagree with them. Unanswered questions count as not correct.

   Components WITH a promise on screen (XAPI_GATE in script.js) score on exactly the set the
   learner was told about, and pass on the promised number (§6.4):
     02  x19 "מיד יוצגו 6 תרגילים. צריך לענות נכון על 4 תרגילים לפחות" → items 001-006; an item
         (a stepper station, possibly two screens א/ב) is correct when all its questions are —
         the same rule as unit.js standardPracticeScore()
     03  x28 "מיד יוצגו 4 תרגילים … ענו נכון על 3 תרגילים ומעלה כדי להתקדם" → items 001-004;
         below 3 the component ENDS on screen 36 (partGateBlocks), success:false
     06  x52 "יש בה 4 סעיפים, עליכם לענות נכון על 3 לפחות" → the 4 question screens
   Components WITHOUT one (01 teaching, 05 practice) score correct ÷ the questions the metadata
   declares, and always succeed: nothing on screen sets a bar, and inventing one would route
   learners on a number nobody was shown — except where a component's script.js sets
   XAPI_PASS_SCALED: then success = scaled >= it, still with no gate and nothing shown
   (05, the challenge: MOE 2026-10-08, 0.6).
   Component 04 (the class task) has no catalogue question: success with no score (§6.4). */

function _declaredQs(item) {
  try {
    var sc = (window.METADATA && window.METADATA.subContent) || [];
    for (var i = 0; i < sc.length; i++) {
      if (String(sc[i].id).replace(/\/+$/, '').slice(-(item.length + 1)) === '-' + item) {
        return (sc[i].questions || []).map(function (q) { return shortId(q.questionId); });
      }
    }
  } catch (e) {}
  /* no metadata (reporting off): the questions the screens of this item answer */
  var keys = [];
  var map = (typeof XAPI_SCREEN_QUESTIONS !== 'undefined') ? XAPI_SCREEN_QUESTIONS : {};
  Object.keys(map).forEach(function (n) {
    if (_itemFor(Number(n)) === item) keys = keys.concat(map[n]);
  });
  return keys;
}
function _evalItems() { return Object.keys((typeof XAPI_EVAL_ITEMS !== 'undefined') ? XAPI_EVAL_ITEMS : {}); }
function _qOk(item, k) { return XAPI_Q_RESULTS[item + '/' + k] === true; }
function _qSeen(item, k) { return Object.prototype.hasOwnProperty.call(XAPI_Q_RESULTS, item + '/' + k); }
function _itemAllOk(item) { var qs = _declaredQs(item); return qs.length > 0 && qs.every(function (k) { return _qOk(item, k); }); }
/* An item in XAPI_COUNT_ONCE (script.js) is one question in the scores: right only when all its
   questions are (the 08.11 sheet rule — a question with sub-questions counts once). */
function _countOnce(item) { return typeof XAPI_COUNT_ONCE !== 'undefined' && !!XAPI_COUNT_ONCE[item]; }
function _screenAllOk(n) { var it = _itemFor(n), ks = _qKeysFor(n); return !!it && ks.length > 0 && ks.every(function (k) { return _qOk(it, k); }); }

function _gate() { return (typeof XAPI_GATE !== 'undefined') ? XAPI_GATE : null; }
/* The gated set: its members (items, or question screens), how many are correct, and whether
   every member has been answered at all (the gate fails OPEN on incomplete evidence, §6.4). */
function _gateTally() {
  var g = _gate();
  if (!g) return null;
  var members = g.of === 'items'
    ? (g.items || _evalItems())
    : Object.keys((typeof XAPI_SCREEN_QUESTIONS !== 'undefined') ? XAPI_SCREEN_QUESTIONS : {}).map(Number).filter(inPart);
  var ok = members.filter(function (m) { return g.of === 'items' ? _itemAllOk(m) : _screenAllOk(m); }).length;
  var complete = members.every(function (m) {
    if (g.of === 'items') return _declaredQs(m).every(function (k) { return _qSeen(m, k); });
    return !!(quizState[m] && quizState[m].done);
  });
  return { need: g.need, total: members.length, ok: ok, complete: complete };
}

function partResult() {
  var items = _evalItems();
  if (!items.length) return { success: true };
  var t = _gateTally();
  if (t) return { success: t.ok >= t.need, score: { scaled: t.total ? t.ok / t.total : 0 } };
  var total = 0, ok = 0;
  items.forEach(function (it) {
    if (_countOnce(it)) { total++; if (_itemAllOk(it)) ok++; return; }
    _declaredQs(it).forEach(function (k) { total++; if (_qOk(it, k)) ok++; });
  });
  var scaled = total ? ok / total : 0;
  var bar = (typeof XAPI_PASS_SCALED === 'number') ? XAPI_PASS_SCALED : null;
  return { success: bar === null || scaled >= bar, score: { scaled: scaled } };
}

/* An explicit result for every graded item's 'completed' (read by xapiItemResult, 20-xapi.js).
   Without it the item result would be the library's own per-page-load aggregate, which knows
   nothing about answers restored by a resume. scaled = correct ÷ declared; success = all correct,
   except an item that IS a gated component's whole promised set (06's item 001), whose success is
   the gate's. Built as a getter map so it follows XAPI_EVAL_ITEMS (script.js, loaded before this). */
var XAPI_ITEM_RESULT = {};
_evalItems().forEach(function (item) {
  XAPI_ITEM_RESULT[item] = function () {
    var qs = _declaredQs(item);
    var ok = qs.filter(function (k) { return _qOk(item, k); }).length;
    var scaled = qs.length ? ok / qs.length : 0;
    if (_countOnce(item)) scaled = _itemAllOk(item) ? 1 : 0;
    var g = _gate();
    var success = (g && g.of === 'screens') ? (function () { var t = _gateTally(); return t.ok >= t.need; })()
                                            : (qs.length > 0 && ok === qs.length);
    return { success: success, score: { scaled: scaled } };
  };
});

function partResultKey() { return 'proportion01_c' + currentPartSlug().slice(-2) + '_result'; }

/* ═══════════════════ The end of the component ═══════════════════ */

/* The gate screen ends the component only while the gate blocks; a learner who passed it ends on
   PART_LAST like everyone else, and stepping back onto the gate screen must not disable it. */
function _gateEnds() {
  var g = _gate();
  if (!g || g.at == null || !inPart(g.at)) return false;
  var t = _gateTally();
  return !!(t && t.complete && t.ok < t.need);
}
function partEndScreens() {
  var g = _gate();
  return _gateEnds() ? [PART_LAST, g.at] : [PART_LAST];
}
function _endButtonFor(n) {
  if (_pq(n)) return document.getElementById('q' + n + '-check');
  return document.querySelector('.screen[data-screen="' + n + '"] .btn-continue');
}
/* The button whose click ends this component: the last question's "هل نتابع؟" / "انتهيت"
   (01, 02, 03, 05, 06), else the static last screen's continue button (04's x42) — or, on
   component 03 below its gate, screen 36's. */
function lastScreenButton() {
  var ends = partEndScreens();
  return _endButtonFor(ends.indexOf(currentScreen) !== -1 ? currentScreen : PART_LAST);
}

/* Report the component, disable the button, record the verdict, flush — and navigate NOWHERE
   (the platform owns routing, §8.12). */
function _endComponent(btn) {
  var res = partResult();
  try { xapiEndComponent(res, btn); } catch (e) { console.error('[xAPI] end component', e); }
  try { setUnitResult(partResultKey(), res.success ? 'pass' : 'fail'); } catch (e) { console.error('[resume] result', e); }
  flushResumeSave();
  return res;
}

/* engine.js goTo() calls this instead of hopping when n leaves [PART_FIRST, PART_LAST].
   Forward off the last screen = the learner's last click. Only a DEV_NAV walkthrough (?dev=1
   without ?registration) goes on to the next component — 02 by its score, as unit.js routes.
   Backward off the first screen only exists under DEV_NAV too. */
function partExit(dir) {
  if (_restoring) return;
  if (dir < 0) {
    if (DEV_NAV) goToPrevPart();
    return;
  }
  if (currentScreen !== PART_LAST) return;
  /* The last question must be answered before its button ends anything, and a gated static last
     screen (x42 until checked) must be open — ArrowLeft reaches this path too. */
  var lq = _pq(PART_LAST);
  if (lq && !(quizState[PART_LAST] && quizState[PART_LAST].done)) return;
  var btn = lastScreenButton();
  if (!lq && btn && btn.disabled && !alreadySent('done', currentPartSlug())) return;
  _endComponent(btn);
  var P = window.PART_CONFIG;
  if (DEV_NAV && P) {
    var to = P.routeByScore ? (standardPracticeScore() >= 4 ? P.nextPass : P.nextFail) : P.next;
    if (to) {
      var dest = String(to).replace(/\/index\.html$/, '').replace(/\/+$/, '').split('/').pop();
      writeForwardState(dest, '#screen=' + PART_LAST);
      goToNextPart();
    }
  }
}

/* engine.js goTo() asks this before every move. A gate placed INSIDE a component (03: XAPI_GATE.at
   = 36, the last of the four promised exercises) ends the component there when the learner moves
   forward below the promised number — the screen text says the bar is what lets them continue
   (§6.4, decision 2026-10-05). Checked last, after the question's own "answered" guard (the
   button only moves on once quizCheck has marked it done; ArrowLeft is held by
   keyboardForwardAllowed until then), and it fails OPEN when a gated item has no recorded answer.
   Below the gate it blocks every forward move, the second click included; the ledger keeps the
   'completed' to one. */
function partGateBlocks(from, to) {
  if (_restoring || typeof to !== 'number' || to <= from) return false;
  var g = _gate();
  if (!g || g.at == null || from !== g.at) return false;
  if (!_gateEnds()) return false;
  _endComponent(_endButtonFor(g.at));
  return true;
}

/* ArrowLeft goes forward only where the screen's own forward button would (engine.js): a quiz
   screen once answered; s0 once the hook is answered; s3 and x42 once CHECKED (their button is
   live before that, but as צדקתי?, not as a way forward); any other screen while its continue
   button is enabled (the guided questions). A local walkthrough keeps free navigation. */
function keyboardForwardAllowed() {
  if (DEV_NAV) return true;
  var n = currentScreen;
  if (quizState[n]) return !!quizState[n].done;
  if (n === 3 && inPart(3)) return !!teachDone;
  if (n === 42 && inPart(42)) {
    var b42 = document.getElementById('x42-continue');
    return !!(b42 && b42.dataset.checked);
  }
  var btn = document.querySelector('.screen[data-screen="' + n + '"] .btn-continue');
  return !(btn && btn.disabled);
}

/* ═══════════════════ Resume hooks ═══════════════════ */

var RESUME_Q_FIELDS = ['attempts', 'done', 'wasCorrect', 'hintUsed', 'selected', 'selectedSet', 'lw', 'tgl'];

/* This component's payload: where the learner is, the per-question verdicts, every quiz
   question's state — submitted AND pending (§8.8 rule 4) — and the hand-built screens'. */
function capturePartPayload() {
  var qs = {};
  _partQuestions().forEach(function (q) {
    var st = quizState[q.screen];
    if (!st) return;
    var o = {};
    RESUME_Q_FIELDS.forEach(function (k) {
      if (st[k] === undefined) return;
      o[k] = Array.isArray(st[k]) ? st[k].slice() : st[k];
    });
    qs[q.screen] = o;
  });
  /* the class-task boxes live only in the DOM; applyResumeDom writes them back before any save */
  if (inPart(42) && _ctInputs().length) {
    CUSTOM_STATE[42] = Object.assign(CUSTOM_STATE[42] || {}, { vals: _ctValues() });
  }
  return {
    currentScreen: currentScreen,
    qResults: JSON.parse(JSON.stringify(XAPI_Q_RESULTS)),
    q: qs,
    c: JSON.parse(JSON.stringify(CUSTOM_STATE))
  };
}

/* Restores the variables. Idempotent — applyExecutionState runs it twice. XAPI_Q_RESULTS and
   CUSTOM_STATE are refilled in place (shared vars other code holds). Only this part's screens.
   unit.js's own flags for the hand-built screens (hookDone, teachDone, guidedState) are NOT set
   here: the painters set them by replaying unit.js's own handlers, so the flag and the screen
   that shows it can never disagree (§8.7 — no answer variable without its painter). */
function applyResumeVars(st) {
  if (!st) return;
  if (st.qResults && typeof st.qResults === 'object') {
    Object.keys(XAPI_Q_RESULTS).forEach(function (k) { delete XAPI_Q_RESULTS[k]; });
    Object.keys(st.qResults).forEach(function (k) { XAPI_Q_RESULTS[k] = !!st.qResults[k]; });
  }
  var qs = st.q || {};
  Object.keys(qs).forEach(function (key) {
    var n = Number(key);
    if (!inPart(n) || !quizState[n]) return;
    var src = qs[key] || {};
    RESUME_Q_FIELDS.forEach(function (k) {
      if (src[k] === undefined) return;
      quizState[n][k] = Array.isArray(src[k]) ? src[k].slice() : src[k];
    });
  });
  var cs = st.c || {};
  Object.keys(CUSTOM_STATE).forEach(function (k) { delete CUSTOM_STATE[k]; });
  Object.keys(cs).forEach(function (key) {
    if (inPart(Number(key))) CUSTOM_STATE[key] = JSON.parse(JSON.stringify(cs[key]));
  });
}

/* The one value that lives only in the DOM: the class-task boxes (§8.9). Written back here — not
   only by the painter — because capture reads them off the DOM, and the first save after a resume
   that lands anywhere but x42 would otherwise persist eight empty boxes. */
function applyResumeDom(st) {
  var s = CUSTOM_STATE[42];
  if (!s || !s.vals || !inPart(42)) return;
  _ctInputs().forEach(function (inp, i) {
    if (!inp.value && typeof s.vals[i] === 'string') inp.value = s.vals[i];
  });
}

/* One painter per interaction type, config-driven (§8.8). Every painter:
   - repaints from state, never resets it; never reports; mutates no score state
   - is idempotent and safe on a clean screen ("clean" = nothing picked or typed, never attempts===0)
   - re-derives the check button through the live predicate (quizCheckBlocked — the Retry gate)
   - draws the wrong-attempt look only while the answer is still the submitted one (D-15)
   Static screens have no painter. */
function restoreScreenUI(n) {
  if (!inPart(n)) return;
  var q = _pq(n);
  if (q) {
    var st = quizState[n];
    if (!st || !document.getElementById('q' + n)) return;
    if (q.type === 'single' || q.type === 'multi') paintChoice(n, q, st);
    else if (q.type === 'value-input') paintValue(n, q, st);
    else if (q.type === 'statement') paintStatement(n, q, st);
    else if (q.type === 'dropdown') paintSelects(n, q, st, '.dd-select');
    else if (q.type === 'dual-select') paintSelects(n, q, st, '.year-select');
    return;
  }
  paintCustom(n);
}

function _hintBtn(n) { return document.getElementById('q' + n + '-hint'); }

/* The finished look: exactly what live play leaves (quizCheck's correct / final-wrong branches). */
function _paintDone(n, q, st) {
  var hb = _hintBtn(n);
  if (hb) hb.style.display = 'none';
  if (st.wasCorrect) {
    quizShowFeedback(n, 'correct', q.fb.correct);
  } else {
    var fb = Object.assign({}, q.fb.wrong);
    if (q.type === 'value-input' && st.slotOk && st.slotOk.some(Boolean)) fb.title = 'تقريبًا! بعض الإجابات صحيحة';
    quizShowFeedback(n, 'wrong', fb);
    if (q.type === 'value-input') {
      var mode = st.tgl;
      quizAnswerToggleAdd(n, q);
      var tb = document.querySelector('#q' + n + '-feedbox .fb-answer-toggle');
      if (mode === 'mine' && tb) tb.click();
    }
  }
  quizFinish(n);   // DOM: stepper, locked options, "هل نتابع؟" / "انتهيت"; st.done is already true
}

/* The rejected attempt, re-shown only while the answer on screen is still the one submitted. */
function _paintRetry(n, q, st, stillSubmitted) {
  var hb = _hintBtn(n);
  if (hb) hb.style.visibility = 'visible';
  if (st.lw && stillSubmitted) {
    quizMarkRetry(n, q);
    quizShowFeedback(n, 'wrong', { title: q.fb.retry, body: '' });
  } else {
    quizHideFeedback(n);
  }
}

function paintChoice(n, q, st) {
  var opts = document.querySelectorAll('#q' + n + ' .scq-opt');
  var picked = q.type === 'multi' ? (st.selectedSet || []) : (st.selected ? [st.selected] : []);
  var hasPick = picked.length > 0;
  if (!st.done && !st.attempts && !hasPick) return;              // clean screen — leave untouched
  opts.forEach(function (o) {
    o.classList.remove('selected', 'correct', 'wrong', 'locked');
    var on = picked.indexOf(o.dataset.id) !== -1;
    if (on) o.classList.add('selected');
    o.setAttribute('aria-checked', on ? 'true' : 'false');
  });
  var check = document.getElementById('q' + n + '-check');
  if (st.done) {
    quizMarkOutcome(n, q, !!st.wasCorrect);
    _paintDone(n, q, st);
    return;
  }
  check.textContent = 'هل إجابتي صحيحة؟';
  if (st.attempts > 0) {
    var hb = _hintBtn(n);
    if (hb) hb.style.visibility = 'visible';
    /* Nothing new picked since the rejected attempt: show what the learner saw when they left —
       the rejected pick(s) marked wrong and the retry prompt (quizMarkRetry cleared the pick in
       live play). A new pick clears both, as live. */
    if (!hasPick && st.lw) {
      (q.type === 'multi' ? String(st.lw).split('|') : [st.lw]).forEach(function (id) {
        var w = document.querySelector('#q' + n + ' .scq-opt[data-id="' + id + '"]');
        if (w) w.classList.add('wrong');
      });
      quizShowFeedback(n, 'wrong', { title: q.fb.retry, body: '' });
    } else {
      quizHideFeedback(n);
    }
  }
  check.disabled = quizCheckBlocked(q, st, hasPick);
}

function paintValue(n, q, st) {
  var slots = Array.prototype.slice.call(document.querySelectorAll('#q' + n + ' .vi-input'));
  var vals = st.selectedSet || [];
  var typed = vals.some(function (v) { return v !== '' && v != null; });
  if (!st.done && !st.attempts && !typed) return;                 // clean screen — leave untouched
  slots.forEach(function (inp, i) {
    inp.value = vals[i] == null ? '' : vals[i];
    inp.classList.remove('wrong', 'correct', 'mark-ok', 'mark-bad');
    inp.disabled = false;
  });
  var check = document.getElementById('q' + n + '-check');
  if (st.done) {
    quizMarkOutcome(n, q, !!st.wasCorrect);   // recomputes the same slotOk/answerKey from the same selectedSet
    _paintDone(n, q, st);
    return;
  }
  check.textContent = 'هل إجابتي صحيحة؟';
  var ready = slots.length > 0 && vals.length === slots.length && !vals.some(function (v) { return !v; });
  if (st.attempts > 0) _paintRetry(n, q, st, quizSig(q, st) === st.lw);
  check.disabled = quizCheckBlocked(q, st, ready);
}

/* The נכון / לא נכון rows (screen 50). Same contract as the two above. */
function paintStatement(n, q, st) {
  var rows = Array.prototype.slice.call(document.querySelectorAll('#q' + n + ' .stmt-row'));
  var vals = st.selectedSet || [];
  var picked = vals.some(function (v) { return !!v; });
  if (!st.done && !st.attempts && !picked) return;                // clean screen — leave untouched
  rows.forEach(function (r, i) {
    r.classList.remove('wrong');
    r.querySelectorAll('.stmt-pill').forEach(function (p) {
      p.classList.remove('selected', 'correct', 'wrong');
      p.disabled = false;
      if (vals[i] && p.dataset.val === vals[i]) p.classList.add('selected');
    });
  });
  var check = document.getElementById('q' + n + '-check');
  if (st.done) {
    quizMarkOutcome(n, q, !!st.wasCorrect);
    _paintDone(n, q, st);
    return;
  }
  check.textContent = 'هل إجابتي صحيحة؟';
  var ready = rows.length > 0 && vals.length === rows.length && !vals.some(function (v) { return !v; });
  if (st.attempts > 0) _paintRetry(n, q, st, quizSig(q, st) === st.lw);
  check.disabled = quizCheckBlocked(q, st, ready);
}

/* The native <select> screens — dropdown blanks (49, 51) and the two-year pick (21). No sibling
   unit had a painter for either. The learner's values are written back FIRST: in live play a
   final wrong answer is marked against the learner's own values by quizMarkOutcome, which then
   overwrites each wrong select with the correct value (and, for the year pair, sets the pair) —
   so the painter must hand quizMarkOutcome the same starting DOM, never the revealed one. A
   rejected attempt keeps the learner's values in live play (only the marks change), and its
   look is re-drawn by quizMarkRetry while the values are still the submitted ones (D-15). */
function paintSelects(n, q, st, sel) {
  var sels = Array.prototype.slice.call(document.querySelectorAll('#q' + n + ' ' + sel));
  var vals = st.selectedSet || [];
  var picked = vals.some(function (v) { return !!v; });
  if (!st.done && !st.attempts && !picked) return;                // clean screen — leave untouched
  sels.forEach(function (s, i) {
    s.value = vals[i] == null ? '' : vals[i];
    s.classList.remove('wrong', 'correct');
    s.disabled = false;
  });
  var check = document.getElementById('q' + n + '-check');
  if (st.done) {
    quizMarkOutcome(n, q, !!st.wasCorrect);
    _paintDone(n, q, st);
    return;
  }
  check.textContent = 'هل إجابتي صحيحة؟';
  var ready = sels.length > 0 && vals.length === sels.length && !vals.some(function (v) { return !v; });
  if (st.attempts > 0) _paintRetry(n, q, st, quizSig(q, st) === st.lw);
  check.disabled = quizCheckBlocked(q, st, ready);
}

/* The hand-built screens: replay unit.js's own handler with the saved choice, so the painted
   screen is exactly what the live click produced. Each replay is guarded on unit.js's own flag
   so a screen already showing its answer is left alone, and onCustom* ignore the replay
   (resumeIsPainting). */
function paintCustom(n) {
  var s = CUSTOM_STATE[n];
  if (!s) return;
  if (n === 0) {
    if (!s.done || hookDone) return;
    var card = document.querySelector('#s0 .city-card[data-value="' + s.pick + '"]');
    if (card) hookAnswer(card);
    return;
  }
  if (n === 3) {
    if (teachDone || !s.pick) return;
    var opt = document.querySelector('#s3 .scq-opt[data-id="' + s.pick + '"]');
    if (!opt) return;
    if (teachSelected !== s.pick) teachAnswer(opt);
    if (s.done) teachCheck();
    return;
  }
  if (n === 42) {
    var btn = document.getElementById('x42-continue');
    if (!btn || btn.dataset.checked) return;                      // already checked on screen
    var ins = _ctInputs();
    (s.vals || []).forEach(function (v, i) { if (ins[i] && !ins[i].value && typeof v === 'string') ins[i].value = v; });
    if (s.done) {
      var cfg = (typeof EXTRA_SCREENS !== 'undefined') ? EXTRA_SCREENS.find(function (c) { return c.screen === 42; }) : null;
      classTaskCheck(42, cfg && cfg.next != null ? cfg.next : 43);
    } else {
      /* the live rule of the table's own input listener (unit.js buildExtraScreens) */
      btn.disabled = ins.some(function (i) { return !i.value.trim(); });
    }
    return;
  }
  var g = _guidedCfg(n);
  if (g && g.q && s.done && guidedState[n] && !guidedState[n].done) {
    var el = document.querySelector('#g' + n + ' .gc-opt[data-idx="' + s.pick + '"]');
    if (el) guidedAnswer(n, el);
  }
}

/* Every navigation repaints the target screen from state (engine.js goTo, after resetScreenState):
   the §8.4a hard-lock is "variables say answered, DOM says blank". Skipped while restoring —
   applyExecutionState paints explicitly after its second applyResumeVars. Never an empty catch. */
function repaintScreen(n) {
  if (_restoring) return;
  beginRepaint();
  try {
    restoreScreenUI(n);
    restoreEndedButton();   // D-8: the painter just re-enabled a finished component's button
  } catch (e) { console.error('[resume] repaintScreen', e); }
  finally { endRepaint(); }
}

/* Replay a saved payload onto this component (ratio-04 70-platform.js). Two passes of
   applyResumeVars around goTo(); the sender is stubbed across the whole replay so nothing is
   re-reported; then the library is told about the restored answers (B-1 / seed) and the landing
   screen's item is opened exactly once.
   screenOverride (#screen=N) chooses the SCREEN only, never skips the restore (§8.4b). Both it and
   the saved screen are range-checked against THIS component: engine.js goTo() treats a screen
   outside [PART_FIRST, PART_LAST] as a request to leave the component. */
function applyExecutionState(st, screenOverride) {
  if (!st) return;
  _restoring = true;
  var _origSend = window.sendStatement720;
  window.sendStatement720 = function () {};
  var _inRange = function (v) { return typeof v === 'number' && v >= PART_FIRST && v <= PART_LAST; };
  try {
    applyResumeVars(st);
    var _n = _inRange(screenOverride) ? screenOverride
           : (_inRange(st.currentScreen) ? st.currentScreen : PART_FIRST);
    goTo(_n);
    applyResumeVars(st);
    applyResumeDom(st);
    restoreScreenUI(currentScreen);
    restoreEndedButton();
    /* The progress strip of the landing screen reads quizState, restored above */
    try { quizStepperUpdate(currentScreen); } catch (e) {}
    if (currentScreen === 48) { try { gymStepperInit(); } catch (e) {} }
  } catch (e) {
    console.error('[resume] apply', e);
  } finally {
    window.sendStatement720 = _origSend;
    _restoring = false;
  }
  try { xapiSeedAnsweredFromResume(); } catch (e) {}
  xapiCurrentItem = null;
  try { xapiOnScreen(currentScreen); } catch (e) {}
}

/* Pending answers are saved as they are made, not only on the next screen change (O-2 for this
   engine): a pick, a keystroke or a select change arms the debounced save. Bubble phase on
   document, so the element's own inline handler has already updated quizState. The class-task
   boxes are covered here too (they carry no ids for the O-2 id list). */
function initQuizFieldSaves() {
  var arm = function (e) {
    var t = e && e.target;
    if (t && t.closest && (t.closest('.quiz-screen') || t.closest('#x42'))) scheduleResumeSave();
  };
  document.addEventListener('input', arm);
  document.addEventListener('change', arm);
  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('.quiz-screen .scq-opt, .quiz-screen .stmt-pill')) scheduleResumeSave();
  });
}

/* The part's own boot, called once from 90-boot.js (was engine.js's DOMContentLoaded block):
   build the question screens, scale, land. The guided and extra screens are built by unit.js's
   own DOMContentLoaded listeners, which run before this one (90-boot.js registers last). */
function partBoot() {
  if (typeof quizBuildScreens === 'function') quizBuildScreens();
  scaleApp();
  /* NOT a hard goTo(0): goTo() treats n < PART_FIRST as leaving the component. */
  goTo(firstScreen());
  if (window.Motion) Motion.reveal(document.querySelector('.screen.active'));
}
