#!/usr/bin/env node
/* ═══════════════════ verify-report.js — methodica-math-proportion-01 contracts ═══════════════════
   NOT DEPLOYED. The static and DOM-level contracts of the reporting / issue-report / resume
   layer, for all six components (ADDING-REPORTING-AND-RESUME.md §6.2, §6.7, §8, §10.2).
   Adapted from methodica-math-ratio-04 _test/verify-report.js.

     layer    script order, one ?v= everywhere, 90-boot last, the library-letter gate, no
              top-level name in two files, script.js is data only, the character key namespaced
     ids      component / unit / item / question ids byte-for-byte against metadata/
     map      SCREEN_TO_SUBCONTENT = exactly the component's screens = the catalogue items
     qmap     XAPI_SCREEN_QUESTIONS covers every declared question exactly once, on a screen
              that asks one; XAPI_EVAL_ITEMS = the items that have questions
     gate     XAPI_GATE agrees with the numbers printed on the component's gate screen
     threshold  05 (the challenge) succeeds only at >= 60% with the real score (MOE 2026-10-08)
     order    goTo(): gate check first, repaint -> item scope -> save after the paint;
              quizCheck(): report before marking, flush last; onCustomAnswered flushes after
              reporting; every hand-built answer reaches the seam AFTER its DOM writes
     painter  every screen repaints without throwing, clean and answered, idempotently, and an
              answered quiz screen shows its finished look
     report   the issue form carries unit / component / item / page on every screen
     markup   boot cover in every index.html, before #stage

     NODE_PATH=C:/lomda-test/node_modules node _test/verify-report.js
   ═══════════════════════════════════════════════════════════════════════════════════════ */
'use strict';
const H = require('./harness');
const { fs, path, BASE, UNIT, PARTS, PART_DIR, readMeta } = H;
const R = H.makeReporter('verify-report');
const { ok, eq } = R;

const read = p => fs.readFileSync(path.join(BASE, p), 'utf8');
const html = c => read(PART_DIR(c) + '/index.html');
const scriptsOf = c => [...html(c).matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const trimId = u => String(u || '').replace(/\/+$/, '');
const last = u => trimId(u).split('/').pop();
const fnBody = (src, name) => {   // brace-matched body of `function name(`
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return '';
  let d = 0, j = src.indexOf('{', i);
  for (let k = j; k < src.length; k++) { if (src[k] === '{') d++; else if (src[k] === '}' && --d === 0) return src.slice(i, k + 1); }
  return '';
};

/* component 01's hand-built question screens (unit.js), and component 04's class task */
const CUSTOM_Q = [0, 3, 7, 9, 11, 13, 15];

(async function main() {
  /* ── layer ── */
  const ORDER = ['../unit-js/10-identity.js', '../unit-js/20-xapi.js', '../unit-js/40-resume.js', '../unit-js/50-loader.js',
    'script.js', '../unit-js/motion.js', '../unit-js/quiz-engine.js', '../unit-js/questions.js', '../unit-js/unit.js',
    '../unit-js/report-modal.js', '../unit-js/engine.js', '../unit-js/70-platform.js', '../unit-js/90-boot.js'];
  const versions = new Set();
  for (const c of PARTS) {
    const s = scriptsOf(c);
    eq('layer', c + ' script order', s.map(x => x.split('?')[0]), ORDER);
    s.forEach(x => versions.add((x.match(/[?&]v=([^&]+)/) || [])[1]));
    ok('markup', c + ' has the boot cover and its inline safety net',
      /<div id="boot-cover"/.test(html(c)) && /__resumeInFlight/.test(html(c)));
    ok('markup', c + ' boot cover sits before #stage', html(c).indexOf('id="boot-cover"') < html(c).indexOf('id="stage"'));
    ok('markup', c + ' one .flag-btn outside every screen', (html(c).match(/class="flag-btn"/g) || []).length === 1);
  }
  ok('layer', 'one ?v= on every script in every component', versions.size === 1 && !versions.has(undefined), [...versions].join(', '));

  const loader = read('unit-js/50-loader.js');
  ok('layer', "-l is the resume library (the leave save, 2026-11-10) and the XAPI_USING_G regex knows it",
    /RESUME_ENABLED \? 'xapi-720-l\.js'/.test(loader) && /xapi-720-\[[a-z]*l[a-z]*\]\\\.js/.test(loader));
  ok('layer', 'the stub libraries carry letters the gate regex accepts',
    fs.existsSync(path.join(__dirname, 'xapi-720-l.js')) && fs.existsSync(path.join(__dirname, 'xapi-720-k.js')));

  const shared = fs.readdirSync(path.join(BASE, 'unit-js')).filter(f => f.endsWith('.js')).map(f => 'unit-js/' + f);
  for (const c of PARTS) {
    const decl = {};
    for (const f of shared.concat(PART_DIR(c) + '/script.js')) {
      for (const m of read(f).matchAll(/^(?:var|let|const|function)\s+([A-Za-z_$][\w$]*)/gm)) (decl[m[1]] = decl[m[1]] || []).push(f);
    }
    const dup = Object.keys(decl).filter(k => decl[k].length > 1);
    ok('layer', c + ' no top-level name declared in two files', !dup.length, dup.map(k => k + ' in ' + decl[k].join(' + ')).join('; '));
    const src = read(PART_DIR(c) + '/script.js').replace(/\/\*[\s\S]*?\*\//g, '');
    ok('layer', c + ' script.js is configuration only (no function, no const)', !/\bfunction\b|^\s*const\s/m.test(src));
  }
  const ui = read('unit-js/40-resume.js').match(/var UI_CHARACTER_KEY = '([^']+)'/)[1];
  eq('layer', 'the character key is namespaced to this unit (D-6)', ui, UNIT.replace(/-/g, '_') + '_selectedCharacter');
  ok('layer', 'no origin-wide character key anywhere', !shared.some(f => /'lomda_selectedCharacter'/.test(read(f))));
  /* provenance comments name the donor on purpose; CODE must not (keys, slugs, paths) */
  const codeOnly = f => read(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const donorHits = shared.concat(['_test/xapi-720-k.js']).filter(f => /ratio-0\d|ratio_0\d|ratio0\d/.test(codeOnly(f)));
  ok('layer', 'no donor slug left in the code of the shared layer or the stub', !donorHits.length, donorHits.join(','));

  /* ── order (source-level) ── */
  const eng = read('unit-js/engine.js');
  const goToSrc = fnBody(eng, 'goTo');
  const iG = goToSrc.indexOf('partGateBlocks'), iR = goToSrc.indexOf('repaintScreen(n)'), iX = goToSrc.indexOf('xapiOnScreen(n)'), iS = goToSrc.indexOf('scheduleResumeSave()');
  ok('order', 'goTo(): the gate check runs before anything moves', iG > 0 && iG < goToSrc.indexOf('PART_CONFIG'));
  ok('order', 'goTo(): repaintScreen → xapiOnScreen → scheduleResumeSave, after resetScreenState',
    goToSrc.indexOf('resetScreenState(n);') < iR && iR < iX && iX < iS);
  ok('order', 'goTo(): resetScreenState still runs after the .active swap (avatar rule)',
    goToSrc.indexOf("target.classList.add('active')") < goToSrc.indexOf('resetScreenState(n);'));
  ok('order', 'goTo(): leaving the component goes through partExit', /partExit\(\+1\)/.test(goToSrc) && /partExit\(-1\)/.test(goToSrc));
  const qe = read('unit-js/quiz-engine.js');
  const qc = fnBody(qe, 'quizCheck');
  ok('order', 'quizCheck(): onQuizAnswered before any marking', qc.indexOf('onQuizAnswered') < qc.indexOf('quizMarkOutcome') && qc.indexOf('onQuizAnswered') < qc.indexOf('quizMarkRetry'));
  ok('order', 'quizCheck(): lw is recorded before quizMarkRetry clears the pick', qc.indexOf('st.lw = quizSig') < qc.indexOf('quizMarkRetry'));
  ok('order', 'quizCheck(): onQuizCommitted is the last thing it does (after every commitment)',
    qc.lastIndexOf('onQuizCommitted') > Math.max(qc.lastIndexOf('st.lw'), qc.lastIndexOf('quizFinish('), qc.lastIndexOf('st.wasCorrect')) &&
    /onQuizCommitted\(screen\)[^]*?\n  }\n}\s*$/.test(qc));
  const qh = fnBody(qe, 'quizOpenHint');
  ok('order', 'quizOpenHint(): the hint is reported after the done-guard',
    qh.indexOf('if (st.done) return;') >= 0 && qh.indexOf('if (st.done) return;') < qh.indexOf('onQuizHint'));
  ['quizSelect', 'quizDualChange', 'quizInputChange', 'quizDropdownChange', 'quizStatementPick'].forEach(fn => {
    const b = fnBody(qe, fn);
    ok('order', fn + '(): the check button is set through quizCheckBlocked (Retry gate)', /\.disabled = quizCheckBlocked\(/.test(b) && !/\.disabled = (?!quizCheckBlocked)/.test(b));
  });
  const plat = read('unit-js/70-platform.js');
  const oca = fnBody(plat, 'onCustomAnswered');
  ok('order', 'onCustomAnswered(): flushes after reporting', oca.lastIndexOf('flushResumeSave()') > oca.indexOf('xapiAnswered('));
  ok('order', 'the verdict is recorded only through setUnitResult', !/localStorage\.setItem\([^)]*_result/.test(plat));
  const unit = read('unit-js/unit.js');
  [['hookAnswer', 'onCustomAnswered(0'], ['teachCheck', 'onCustomAnswered(3'], ['guidedAnswer', 'onCustomAnswered(screen'],
   ['classTaskCheck', 'onCustomAnswered(screen'], ['teachAnswer', 'onCustomPick(3']].forEach(([fn, seam]) => {
    const b = fnBody(unit, fn);
    const iSeam = b.indexOf(seam);
    ok('order', fn + '(): calls ' + seam.replace(/\(.*/, '') + ' as its last act (after every DOM write)',
      iSeam > 0 && !/\n  [a-z][^\n]*;\n/i.test(b.slice(b.indexOf('\n  }\n', iSeam) + 1).replace(/\n}\s*$/, '')));
  });
  ok('order', 'goToNextPart names index.html', /url \+ 'index\.html' \+ window\.location\.search/.test(fnBody(unit, 'goToNextPart')));
  ok('order', '90-boot.js hides the cross-part back after partBoot, before bootXAPI', (function () {
    const b = read('unit-js/90-boot.js'); const p = b.indexOf('partBoot();'), h = b.indexOf('hideCrossPartBack();'), x = b.lastIndexOf('bootXAPI();');
    return p > 0 && p < h && h < x;
  })());

  /* ── per component: ids, map, qmap, gate, painters, issue form ── */
  const unitMeta = JSON.parse(read('metadata/' + UNIT + '_unit.json').replace(/^\uFEFF/, ''));
  for (const c of PARTS) {
    const meta = readMeta(c);
    const b = await H.boot(c, { lib: true });
    b.finishBoot();
    const v = b.val;

    /* ids */
    eq('ids', c + ' XAPI_COMP_ID = metadata id', v('XAPI_COMP_ID'), meta.id);
    eq('ids', c + ' XAPI_UNIT_ID = the unit record id', v('window.XAPI_UNIT_ID'), unitMeta.id);
    eq('ids', c + ' learningUnitId names the unit (slug)', last(meta.learningUnitId), unitMeta.id);
    eq('ids', c + ' XAPI_METADATA_FILE names this component', v('XAPI_METADATA_FILE'), '../metadata/' + PART_DIR(c) + '.json');
    ok('ids', c + ' component id is XAPI_ID_PREFIX + slug + /', meta.id === v('XAPI_ID_PREFIX') + PART_DIR(c) + '/');
    eq('ids', c + ' currentPartSlug() = the folder, lowercase', v('currentPartSlug()'), PART_DIR(c));
    meta.subContent.forEach(sc => {
      const suf = last(sc.id).slice(-3);
      eq('ids', c + ' item ' + suf + ' id = xapiItemId()', v('xapiItemId(' + JSON.stringify(suf) + ')'), sc.id);
      (sc.questions || []).forEach(q => {
        const qk = last(q.questionId);
        ok('ids', c + ' ' + suf + '/' + qk + ' question id is absolute and under its item', /^https?:\/\//.test(q.questionId) && q.questionId.startsWith(sc.id));
        eq('ids', c + ' ' + suf + '/' + qk + ' question id = xapiQ()', v('xapiQ(' + JSON.stringify(suf) + ',' + JSON.stringify(qk) + ').questionId'), q.questionId);
      });
    });

    /* map */
    const P = JSON.parse(v('JSON.stringify(window.PART_CONFIG)'));
    const map = JSON.parse(v('JSON.stringify(SCREEN_TO_SUBCONTENT)'));
    const domScreens = JSON.parse(v('JSON.stringify([...document.querySelectorAll(".screen[data-screen]")].map(function(s){return +s.dataset.screen;}).sort(function(a,b){return a-b;}))'));
    const range = []; for (let n = P.start; n <= P.end; n++) if (n !== 43) range.push(n);
    eq('map', c + ' the component builds exactly its screen range', domScreens, range);
    eq('map', c + ' SCREEN_TO_SUBCONTENT keys = the component screens', Object.keys(map).map(Number).sort((a, b) => a - b), range);
    const mapped = [...new Set(Object.values(map).filter(Boolean).map(x => x[0]))].sort();
    const catalog = meta.subContent.map(sc => last(sc.id).slice(-3)).sort();
    eq('map', c + ' mapped items = catalogue items (both directions)', mapped, catalog);
    ok('map', c + ' every value is null or [3-digit string, page]', Object.values(map).every(x => x === null ||
      (Array.isArray(x) && /^\d{3}$/.test(x[0]) && typeof x[1] === 'number')));
    ok('map', c + ' the source block is a literal object the harness can read (ends "\\n};")',
      /var SCREEN_TO_SUBCONTENT = \{\n[\s\S]*?\n\};/.test(read(PART_DIR(c) + '/script.js')));

    /* qmap */
    const qmap = JSON.parse(v('JSON.stringify(XAPI_SCREEN_QUESTIONS)'));
    const declared = [], asked = [];
    meta.subContent.forEach(sc => (sc.questions || []).forEach(q => declared.push(last(sc.id).slice(-3) + '/' + last(q.questionId))));
    Object.keys(qmap).forEach(n => {
      const it = map[n] && map[n][0];
      ok('qmap', c + ' screen ' + n + ' answers questions of a mapped item', !!it);
      qmap[n].forEach(k => asked.push(it + '/' + k));
      const isQuiz = v('!!QUESTIONS.find(function(q){return q.screen===' + n + ';})');
      ok('qmap', c + ' screen ' + n + ' actually asks a question (quiz engine or hand-built)', isQuiz || CUSTOM_Q.includes(+n));
      if (isQuiz && v('QUESTIONS.find(function(q){return q.screen===' + n + ';}).type') === 'statement') {
        const rows = v('QUESTIONS.find(function(q){return q.screen===' + n + ';}).statements.length');
        ok('qmap', c + ' statement screen ' + n + ' maps one key per row, or ONE key for the whole screen',
          qmap[n].length === rows || qmap[n].length === 1, qmap[n].length + ' keys / ' + rows + ' rows');
      }
    });
    eq('qmap', c + ' every declared question is asked exactly once', asked.slice().sort(), declared.slice().sort());
    const quizInPart = JSON.parse(v('JSON.stringify(QUESTIONS.filter(function(q){return inPart(q.screen);}).map(function(q){return q.screen;}))'));
    ok('qmap', c + ' every quiz screen of the component reports', quizInPart.every(n => qmap[n]), quizInPart.filter(n => !qmap[n]).join(','));
    const withQs = meta.subContent.filter(sc => (sc.questions || []).length).map(sc => last(sc.id).slice(-3)).sort();
    eq('qmap', c + ' XAPI_EVAL_ITEMS = the items that have questions', Object.keys(JSON.parse(v('JSON.stringify(XAPI_EVAL_ITEMS)'))).sort(), withQs);

    /* gate: the numbers on the component's opening (gate) screen are the numbers in code */
    const gate = JSON.parse(v('JSON.stringify(XAPI_GATE)'));
    const gateScreenText = v('(document.querySelector(\'.screen[data-screen="\' + PART_FIRST + \'"]\') || {}).textContent || ""');
    const need = (gateScreenText.match(/بشكل صحيح عن (\d+)/) || [])[1];
    const total = (gateScreenText.match(/(\d+) (?:تمارين|بنود|أسئلة)/) || [])[1];
    if (gate) {
      ok('gate', c + ' the gate screen states a threshold', !!need, gateScreenText.replace(/\s+/g, ' ').slice(0, 120));
      eq('gate', c + ' XAPI_GATE.need = the number on screen', gate.need, +need);
      const t = JSON.parse(v('JSON.stringify(_gateTally())'));
      eq('gate', c + ' the gated set has as many members as the screen promises', t.total, +total);
      if (gate.at != null) {
        ok('gate', c + ' an in-component gate sits on a question screen of the component', v('inPart(' + gate.at + ') && !!QUESTIONS.find(function(q){return q.screen===' + gate.at + ';})'));
        ok('gate', c + ' it is the last screen of the gated items', JSON.stringify(Object.keys(map).map(Number).filter(n => map[n] && gate.items.includes(map[n][0])).pop()) === String(gate.at));
      }
    } else {
      ok('gate', c + ' no threshold on screen, none in code', !need);
    }

    /* threshold: MOE 2026-10-08 — only 05 (the challenge) passes at >= 60% of its declared
       questions, with the real score; every other ungated component still always succeeds. */
    /* a scoring unit = one declared question, or a whole XAPI_COUNT_ONCE item (05's 004: three
       true-false rows, counted once since 10.11.26) */
    const thr = JSON.parse(v('(function(){ var keep = JSON.stringify(XAPI_Q_RESULTS), keys = [], out = [];' +
      ' _evalItems().forEach(function (it) { var qs = _declaredQs(it).map(function (k) { return it + "/" + k; });' +
      '   if (_countOnce(it)) keys.push(qs); else qs.forEach(function (k) { keys.push([k]); }); });' +
      ' var set = function (n) { Object.keys(XAPI_Q_RESULTS).forEach(function (k) { delete XAPI_Q_RESULTS[k]; });' +
      '   keys.forEach(function (u, i) { if (i < n) u.forEach(function (k) { XAPI_Q_RESULTS[k] = true; }); }); };' +
      ' [0, 3, 4, keys.length].forEach(function (n) { set(n); out.push(partResult()); });' +
      ' Object.keys(XAPI_Q_RESULTS).forEach(function (k) { delete XAPI_Q_RESULTS[k]; }); Object.assign(XAPI_Q_RESULTS, JSON.parse(keep));' +
      ' return JSON.stringify({ n: keys.length, bar: typeof XAPI_PASS_SCALED === "number" ? XAPI_PASS_SCALED : null, out: out }); })()'));
    if (c === '05') {
      eq('threshold', '05 challenge: XAPI_PASS_SCALED = 0.6 over 6 declared questions', [thr.bar, thr.n], [0.6, 6]);
      eq('threshold', '05 challenge: success only at >= 60%, real score (0/6, 3/6 fail; 4/6, 6/6 pass)',
        thr.out.map(r => r.success + ':' + Math.round(r.score.scaled * 1000) / 1000).join(','), 'false:0,false:0.5,true:0.667,true:1');
    } else {
      ok('threshold', c + ' no XAPI_PASS_SCALED outside the challenge', thr.bar === null);
      if (!gate && thr.n) ok('threshold', c + ' ungated: success at any score (0 correct still succeeds)', thr.out[0].success === true, JSON.stringify(thr.out[0]));
    }

    /* painter sweep — clean */
    for (const n of range) {
      const r = v('(function(){ goTo(' + n + '); restoreScreenUI(' + n + '); restoreScreenUI(' + n + '); return "ok"; })()');
      ok('painter', c + ' screen ' + n + ' repaints clean without throwing', r === 'ok', r);
    }
    /* painter sweep — answered (quiz screens of every type) */
    for (const n of quizInPart) {
      const q = JSON.parse(v('JSON.stringify(QUESTIONS.find(function(q){return q.screen===' + n + ';}))'));
      b.exec('goTo(' + n + ');' + H.enterJs(n, H.answerFor(q, 'right')) + H.clickCheck(n));
      const once = v('(function(){ repaintScreen(' + n + '); return document.getElementById("q' + n + '").innerHTML; })()');
      const twice = v('(function(){ repaintScreen(' + n + '); return document.getElementById("q' + n + '").innerHTML; })()');
      ok('painter', c + ' screen ' + n + ' (' + q.type + ') answered: repaint is idempotent', once === twice);
      ok('painter', c + ' screen ' + n + ' (' + q.type + ') answered: the finished look is painted', v('document.getElementById("q' + n + '-feedbox").classList.contains("is-correct")'));
    }
    /* painter dispatch: every question type and every hand-built screen of the part has a branch */
    const types = JSON.parse(v('JSON.stringify(QUESTIONS.filter(function(q){return inPart(q.screen);}).map(function(q){return q.type;}))'));
    types.forEach(t => ok('painter', c + ' restoreScreenUI dispatches type ' + t, new RegExp("q\\.type === '" + t + "'").test(fnBody(plat, 'restoreScreenUI'))));
    CUSTOM_Q.concat([42]).filter(n => range.includes(n)).forEach(n => {
      const pc = fnBody(plat, 'paintCustom');
      ok('painter', c + ' paintCustom has a branch for hand-built screen ' + n,
        new RegExp('n === ' + n + '\\b').test(pc) || (/_guidedCfg\(n\)/.test(pc) && v('!!_guidedCfg(' + n + ')')));
    });

    /* issue form on every screen */
    for (const n of range) {
      b.exec('window.__fetches = []; goTo(' + n + '); document.querySelector(".flag-btn .flag-btn-label").click();');
      ok('report', c + ' screen ' + n + ' the flag opens the form (delegated, inner label)', v('!document.getElementById("report-modal").hasAttribute("hidden")'));
      b.exec('document.getElementById("report-type").selectedIndex = 1;' +
        'document.getElementById("report-text").value = "x"; submitReport(); forceCloseReportModal();');
      const f = b.w.__fetches[0];
      const body = f && f.init.body ? Object.fromEntries(f.init.body.entries()) : {};
      const m = map[n];
      ok('report', c + ' screen ' + n + ' posts unit / component', body['entry.1933069481'] === UNIT && body['entry.2070680092'] === PART_DIR(c), JSON.stringify(body));
      eq('report', c + ' screen ' + n + ' item', body['entry.1555704258'], m ? PART_DIR(c) + '-' + m[0] : '');
      eq('report', c + ' screen ' + n + ' page', body['entry.1671046914'], m ? String(m[1]) : String(n));
      ok('report', c + ' screen ' + n + ' no-cors POST to the shared form', f && f.init.mode === 'no-cors' && /^https:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]+\/formResponse$/.test(f.url));
    }
    ok('boot', c + ' no console errors while booting and sweeping', !b.errors.length, b.errors.slice(0, 3).join(' | '));
  }

  R.done();
})().catch(e => { console.error(e); process.exitCode = 1; });
