/* =====================================================================
   Unit logic — methodica-math-proportion-2-1
   Screen map per the approved script (140726, 78 slides → 62 screens).
   Shared engine: js/engine.js + js/quiz-engine.js (vendored from
   shared/720-core — improve upstream, then re-sync via tools/sync-core.sh).

   Component boundaries — the source of truth is each component's PART_CONFIG
   (methodica-math-proportion-01-0N/script.js), re-cut 30.09 into six:
     01: 0-18 · 02: 19-27 · 03: 28-40 · 04: 41-42 · 05: 44-51 · 06: 52-60
   The hand-built answer screens below (0, 3, the guided steps, 42) call the
   platform seams onCustomPick / onCustomAnswered (unit-js/70-platform.js),
   each typeof-guarded so this file still runs without the layer.
   ===================================================================== */

'use strict';

const TOTAL_SCREENS = 61;   /* 61 removed 16.09 — screen 60 is the last */

/* ---------- Global state ---------- */
window.lomdaState = {
  /* Fixed companion per the approved script (slide 4 notes:
     "לאורך היחידה דמות מלווה – כתומה") — no selection screen. */
  selectedCharacter: 'orange',
  hookAnswer: null,
};

const characterAssets = {
  orange: {
    standing: '../unit-assets/img/character-orange.png',
    transition: '../unit-assets/img/character-orange.png',   // TODO: jump GIF (bank has MP4 only)
    training: '../unit-assets/img/character-orange-training.png',
    book: '../unit-assets/img/character-orange-book.png',
    notebook: '../unit-assets/img/character-orange-notebook.png',
    workout: '../unit-assets/img/character-orange-workout.png',
    peak: '../unit-assets/img/character-orange-peak.png',
    success: '../unit-assets/img/character-orange.png',      // TODO: no orange success asset in the bank
    failure: '../unit-assets/img/character-orange-failure.png',
  },
};

/* ---------- Part routing (5-component architecture, approved-units pattern) ----------
   Part 01 ends after standard practice: score >= 4 of 6 skips the remediation
   part (basic practice) straight to part 03 — same rule as the approved units. */
function standardPracticeScore() {
  const byIndex = {};
  QUESTIONS.forEach(q => {
    if (q.step && q.step.group === 'standard') (byIndex[q.step.index] = byIndex[q.step.index] || []).push(q.screen);
  });
  return Object.values(byIndex)
    .filter(screens => screens.every(sc => quizState[sc] && quizState[sc].wasCorrect)).length;
}

function goToNextPart() {
  const cfg = window.PART_CONFIG;
  if (!cfg) return;
  let url = cfg.next;
  if (cfg.routeByScore) url = standardPracticeScore() >= 4 ? cfg.nextPass : cfg.nextFail;
  if (!url) return; // last part — nowhere to go
  /* index.html explicitly: the MOE CDN serves a folder URL as 200 with 0 bytes (guide §5.2).
     With the platform layer this runs only under DEV_NAV (partExit, 70-platform.js). */
  window.location.href = url + 'index.html' + window.location.search;
}

/* ---------- Per-screen restore hooks (called by engine goTo) ---------- */
function resetScreenState(n) {
  if (n === 48) gymStepperInit();
  /* the scroll hint is measured on ENTRY: a hidden screen reports 0x0, so a
     hint attached at build time would land on a screen with nothing to scroll */
  if (typeof attachScrollHints === 'function') setTimeout(attachScrollHints, 0);
  switch (n) {
    case 0: hookRestore(); break;
    case 1: s1Widget(); break;
    case 2: case 4: case 19: case 28: case 37: case 52: { // transition videos replay on entry (play once, stop)
      const v = document.querySelector(`#x${n} .hero-video, #x${n} .transition-video`);
      if (v) { v.currentTime = 0; v.play().catch(() => {}); }
      break;
    }
    default:
      if (typeof quizState !== 'undefined' && quizState[n]) quizResetScreenState(n);
  }
}

/* ---------- Screen 0 — hook: city density question (slide 3) ----------
   Per notes: "אין משוב טקסטואלי, רק חיווי ללומד מהי התשובה הנכונה – בירוק".
   One answer, correct card marked green, continue unlocks. */
let hookDone = false;

function hookAnswer(cardEl) {
  if (hookDone) return;
  hookDone = true;
  const correctId = 'cannot-know';
  // Figma answer-state template: chosen wrong card = red, correct card = green
  // outline only (client design QA 20/07)
  document.querySelectorAll('#s0 .city-card').forEach(c => {
    c.classList.add('locked');
    if (c.dataset.value === correctId) c.classList.add('correct');
    else if (c === cardEl) c.classList.add('wrong');
  });
  // Figma TwoOptionSelection: the chosen option grows (state 02)
  cardEl.classList.add('picked');
  document.getElementById('s0-continue').disabled = false;
  window.lomdaState.hookAnswer = cardEl.dataset.value;
  /* platform layer (70-platform.js): a committed answer — remembered, reported, flushed */
  if (typeof onCustomAnswered === 'function') {
    try { onCustomAnswered(0, { pick: cardEl.dataset.value }); } catch (e) { console.error('[xAPI] onCustomAnswered', e); }
  }
}

function hookRestore() {
  document.getElementById('s0-continue').disabled = !hookDone;
}

/* ---------- Screen 3 — הקנייה scroll: shade question with צדקת popup ---------- */
let teachDone = false;

let teachSelected = null;
function teachAnswer(el) {
  if (teachDone) return;
  teachSelected = el.dataset.id;
  document.querySelectorAll('#s3 .scq-opt').forEach(o => {
    o.classList.toggle('selected', o === el);
    o.setAttribute('aria-checked', o === el ? 'true' : 'false');
  });
  document.getElementById('s3-continue').disabled = false;
  /* platform layer: a pending pick — remembered and saved, never reported */
  if (typeof onCustomPick === 'function') {
    try { onCustomPick(3, { pick: teachSelected }); } catch (e) { console.error('[resume] onCustomPick', e); }
  }
}

function teachCheck() {
  if (teachDone || !teachSelected) return;
  teachDone = true;
  const correctId = 'same';
  const wasCorrect = teachSelected === correctId;
  document.querySelectorAll('#s3 .scq-opt').forEach(o => {
    o.classList.add('locked');
    o.classList.remove('selected');
    if (o.dataset.id === correctId) o.classList.add('correct');
    else if (o.dataset.id === teachSelected) o.classList.add('wrong');
  });
  // approved-lomda pattern: the button swaps and the feedback appears inline —
  // no screen-darkening popup
  const fb = document.getElementById('teach-feedback');
  fb.className = 'teach-feedback ' + (wasCorrect ? 'is-correct' : 'is-wrong');
  fb.innerHTML = `<strong>${wasCorrect ? 'إجابتك صحيحة!' : 'تقريبًا...'}</strong> سيعطي نفس درجة اللون في الخليطين‎.`;
  /* QA 29/07 note 4: small scroll nudge so the feedback lands in view (no full jump) */
  requestAnimationFrame(() => fb.scrollIntoView({ behavior: 'smooth', block: 'end' }));
  document.querySelectorAll('#s3 .teach-gated').forEach(el => el.classList.remove('teach-gated'));
  const btn = document.getElementById('s3-continue');
  btn.disabled = false;
  btn.textContent = 'هل نتابع؟';
  btn.onclick = () => goTo(4);
  /* platform layer (70-platform.js): a committed answer — remembered, reported, flushed */
  if (typeof onCustomAnswered === 'function') {
    try { onCustomAnswered(3, { pick: teachSelected }); } catch (e) { console.error('[xAPI] onCustomAnswered', e); }
  }
}

/* =====================================================================
   Guided exercise (slides 11-21) — recipe table fills in step by step.
   Design reference per notes: methodica-math-scale-01 guided practice,
   continue button (not a carousel).
   ===================================================================== */

const G_ROWS = [
  { key: 'menu',   label: '🍽️ عدد الوجبات',   c4: '4‏‎ ‎وجبات', c12: '12‏‎ ‎وجبة', ratio: '4 : 12', reduced: '1 : 3', prop: '' },
  { key: 'straw',  label: '🍓 فراولة مجمّدة', c4: 'كوبان', c12: '6‏‎ ‎أكواب', ratio: '2 : 6',  reduced: '1 : 3', prop: '✓' },
  { key: 'yogurt', label: '🥛 يوغورت',       c4: 'كوب واحد',  c12: '3‏‎ ‎أكواب', ratio: '1 : 3',  reduced: '1 : 3', prop: '✓' },
  { key: 'maple',  label: '🍁 شراب الميبل',  c4: '3‏‎ ‎ملاعق كبيرة', c12: '12‏‎ ‎ملعقة كبيرة', ratio: '3 : 12', reduced: '1 : 4', prop: '✗' },
];

/* The "هل يوجد تناسب؟" column exists only on the answer slides — every
   question slide shows the table without it, and so does the first answer
   slide — the menu row has no ✓/✗ to record. Present from A2 on
   (approved script: absent pp.12,13,14,16,18,20 / present pp.15,17,19). */
function guidedTable(revealed, withProp, newRow) {
  const cell = (row, field) => revealed.includes(row.key) ? row[field] : '';
  const propCell = (row) => {
    if (!withProp) return '';
    const v = revealed.includes(row.key + '-prop') ? row.prop : '';
    const cls = v === '✓' ? 'g-yes' : v === '✗' ? 'g-no' : '';
    return `<td class="${cls}">${v}</td>`;
  };
  return `<table class="data-table g-table">
    <thead><tr><th class="g-empty"></th><th class="g-empty"></th><th class="g-empty"></th><th>النسبة</th><th>النسبة المختزلة</th>${withProp ? '<th>هل يوجد تناسب؟</th>' : ''}</tr></thead>
    <tbody>${G_ROWS.map(r => `<tr class="${r.key === 'menu' ? 'g-menu-row' : ''}${r.key === newRow ? ' g-new' : ''}">
      <td class="g-label">${r.label}</td><td>${r.c4}</td><td>${r.c12}</td>
      <td><span class="ratio">${cell(r, 'ratio')}</span></td>
      <td><span class="ratio">${cell(r, 'reduced')}</span></td>
      ${propCell(r)}</tr>`).join('')}</tbody>
  </table>`;
}

const RECIPE_BOX = `
<p class="recipe-lead">قبل أن نبدأ بالحساب، نتعرف على الوصفة‎:</p>
<div class="recipe-box">
  <img class="recipe-img" src="../unit-assets/img/strawberry-shake.png" alt="مثلجات الفراولة واليوغورت">
  <div>
    <div class="recipe-title">وصفة لمثلجات الفراولة واليوغورت (Frozen Yogurt) – 4 وجبات</div>
    <ul><li>كوبان من الفراولة المجمّدة</li><li>كوب واحد من اليوغورت</li><li>3‏‎ ‎ملاعق كبيرة من شراب الميبل</li></ul>
  </div>
</div>`;

const FULL_REVEAL = ['menu', 'straw', 'straw-prop', 'yogurt', 'yogurt-prop', 'maple', 'maple-prop'];

/* The story block is constant on the right column (per the client's guided-practice
   Figma, file qLkMM66DSE4xpV5ap3jYLd): past context dims, the current step's text is
   emphasized, and the instruction + interaction live in the purple callout card. */
const G_STORY = `تريد رنين تحضير مثلجات الفراولة واليوغورت للقاء مع صديقاتها.<br> تكفي الوصفة الأصلية لـ 4 وجبات، لكنها تحتاج إلى تحضير 12 وجبة مع الحفاظ على نفس الطعم والقوام.<br> لكي تقوم بذلك، يجب أن تحافظ على التناسب - أي على نسبة متساوية بين عدد الوجبات وكمية كل مكوّن‎.`;

const G_QLINE = 'هل يوجد تناسب بين عدد الوجبات وكمية كل مكوّن؟';

const GUIDED = [
  {
    /* slide 11 — the recipe, presentation only */
    screen: 5, reveal: null, story: true, dimStory: false, noStep: true,
    media: RECIPE_BOX,
    q: null,
  },
  {
    /* slide 12 — the quantities table, presentation only */
    screen: 6, reveal: [], dimStory: true, noStep: true,
    stepText: `أمامكم جدول الكميات الذي أعدّته رنين لزيادة عدد الوجبات:`,
    q: null,
  },
  {
    screen: 7, reveal: [], dimStory: true,
    stepText: `<strong>لكي نفهم ما إذا كان هناك تناسب، نفحص أولًا النسبة بين عدد الوجبات الأصلي وعدد الوجبات بعد الزيادة‎:</strong>`,
    calloutQ: `ما هي النسبة بين عدد الوجبات في الوصفة الأصلية وعدد الوجبات التي تريد رنين تحضيرها؟`,
    q: { opts: ['<span class="ratio">3 : 12</span>', '<span class="ratio">4 : 12</span>', '<span class="ratio">4 : 16</span>'], correct: 1 },
  },
  {
    /* answer slide — the explanation sits in the callout card, table row filled */
    screen: 8, newRow: 'menu', reveal: ['menu'], dimStory: true, qline: G_QLINE, answer: true,
    callout: `وجدنا أن النسبة بين عدد الوجبات هي <span class="ratio">4 : 12</span>. إذا اختزلنا بـ 4، سنحصل على النسبة المختزلة <span class="ratio">1 : 3</span>.<br><br> <strong>لكي نحافظ على التناسب، يجب أن تكون النسبة بين كمية كل مكوّن في الوصفة الأصلية وكميته في الوصفة المكبّرة مساوية لنسبة الوجبات - <span class="ratio">1 : 3</span>.</strong>`,
  },
  {
    screen: 9, reveal: ['menu'], dimStory: true, qline: G_QLINE,
    callout: `<strong>نبدأ بالفراولة –</strong> النسبة بين كمية الفراولة في الوصفة الأصلية وكمية الفراولة في وصفة رنين هي <span class="ratio">2 : 6</span>. إذا اختزلناها بـ 2، سنحصل على النسبة المختزلة <span class="ratio">1 : 3‏‎</span>.`,
    calloutQ: `هل يوجد تناسب بين عدد الوجبات وكمية الفراولة في الوصفتين؟`,
    q: { opts: ['لا', 'نعم'], correct: 1 },
  },
  {
    /* answer slide — the explanation sits in the callout card, table row filled */
    screen: 10, withProp: true, newRow: 'straw', reveal: ['menu', 'straw', 'straw-prop'], dimStory: true, qline: G_QLINE, answer: true,
    /* 07.09 — the deck shows 2/6 = 1/3 here, not 4/12 = 2/6: the strawberry
       ratio beside its reduced form. Visual order is left-to-right inside
       the .fracpair LTR isolate, so 2/6 is written first. */
    callout: `النسبة بين عدد الوجبات = النسبة بين كميات الفراولة<br>لذلك يوجد تناسب: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">6</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">3</span></span></span>.`,
  },
  {
    screen: 11, reveal: ['menu', 'straw', 'straw-prop'], dimStory: true, qline: G_QLINE,
    callout: `<strong>ننتقل إلى اليوغورت</strong> - نسبة كوب واحد في الوصفة الأصلية إلى 3 أكواب في وصفة رنين - <span class="ratio">1 : 3</span>.`,
    calloutQ: `هل يوجد تناسب بين عدد الوجبات وكمية اليوغورت في الوصفتين؟`,
    q: { opts: ['لا', 'نعم'], correct: 1 },
  },
  {
    /* answer slide — the explanation sits in the callout card, table row filled */
    screen: 12, withProp: true, newRow: 'yogurt', reveal: ['menu', 'straw', 'straw-prop', 'yogurt', 'yogurt-prop'], dimStory: true, qline: G_QLINE, answer: true,
    callout: `النسبة بين عدد الوجبات = النسبة بين كميات اليوغورت<br>ولذلك يوجد تناسب‎.`,
  },
  {
    screen: 13, reveal: ['menu', 'straw', 'straw-prop', 'yogurt', 'yogurt-prop'], dimStory: true, qline: G_QLINE,
    /* 07.09 — deck slide 19 sets TWO bold runs: the lead AND the sentence
       through 3:12. The rest of the line is regular. */
    callout: `<strong>شراب الميبل: النسبة بين الوصفتين هي <span class="ratio">3 : 12</span></strong>.<br>إذا اختزلناها سنحصل على النسبة المختزلة <span class="ratio">1 : 4‏‎</span>.`,
    calloutQ: `هل يوجد تناسب بين عدد الوجبات وكمية شراب الميبل في الوصفتين؟`,
    q: { opts: ['لا', 'نعم'], correct: 0 },
  },
  {
    /* answer slide — the explanation sits in the callout card, table row filled */
    screen: 14, withProp: true, newRow: 'maple', reveal: FULL_REVEAL, dimStory: true, qline: G_QLINE, answer: true,
    callout: `النسبة بين عدد الوجبات ≠ النسبة بين كميات شراب الميبل، <br>ولذلك <strong>لا</strong> يوجد تناسُب<br><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">4</span></span> <span class="fr-eq">≠</span> <span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">3</span></span></span>`,
  },
  {
    /* 07.09 — no table on this step (producer), and the answer pills sit in
       the RIGHT column rather than inside the callout card. reveal:null is
       what suppresses the table; optsRight moves the pills. */
    screen: 15, reveal: null, optsRight: true, dimStory: true,
    stepText: `رأينا أنه لا يوجد تناسب بين نسبة عدد الوجبات (<span class="ratio">1 : 3</span>) ونسبة كميات شراب الميبل (<span class="ratio">1 : 4</span>).<br>في الوصفة الأصلية، يجب إضافة 3 ملاعق كبيرة من شراب الميبل‎.`,
    /* the "מצאנו שצריך לשמור" line belongs in the callout beside the equation (deck p.20) */
    callout: `وجدنا أنه يجب الحفاظ على نسبة <span class="ratio">1 : 3</span> بين الكميات في الوصفة الأصلية والكميات في وصفة رنين. لكي نفحص ذلك، نريد معرفة أي عدد يحقق المساواة:`,
    /* 07.09, producer: this question sits ABOVE the answer pills in the right
       column, not in the callout card. qline puts it there — the pills follow
       it because optsRight renders them in the same column. */
    qline: `كم ملعقة كبيرة من شراب الميبل يجب أن تضيف رنين إلى الوصفة المكبّرة لكي يكون هناك تناسُب؟`,
    calloutEq: `<div class="vi-equation gc-eq" dir="ltr">
        <span class="fraction"><span class="frac-top">1</span><span class="frac-bottom">3</span></span>
        <span class="vi-eq">=</span>
        <span class="fraction"><span class="frac-top">3</span><span class="frac-bottom">?</span></span>
      </div>`,
    q: { opts: ['3‏‎ ‎ملاعق كبيرة', '6‏‎ ‎ملاعق كبيرة', '9‏‎ ‎ملاعق كبيرة', '15‏‎ ‎ملعقة كبيرة'], correct: 2 },
    /* producer 15.09.26: this step reads as a question, so answering shows the
       UNIT'S usual red/green feedback box — not the purple inline panel the
       other guided steps use. */
    normalFeedback: {
      correct: { title: 'إجابتك صحيحة!', body: `<span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">3</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">9</span></span></span>` },
      wrong:   { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: `<span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">3</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">9</span></span></span>` },
    },
  },
];

const guidedState = {};

const GC_BULB = `<svg class="gc-bulb" viewBox="0 0 20.997 27.9988" fill="none" aria-hidden="true">
  <path d="M17.4818 2.65764C15.2512 0.668476 12.2563 -0.275357 9.25683 0.0699765C4.59833 0.60431 0.748334 4.35748 0.103168 8.99148C-0.387999 12.5078 0.894168 16.0031 3.532 18.34C4.99267 19.6338 5.83033 21.5191 5.83033 23.5095V23.9155C5.83033 26.1671 7.662 27.9988 9.91367 27.9988H11.0803C13.332 27.9988 15.1637 26.1671 15.1637 23.9155V23.5095C15.1637 21.5308 16.0072 19.6321 17.4877 18.3143C19.6108 16.4243 20.9968 13.6885 20.9968 10.6666C20.9968 7.51914 19.6435 4.58398 17.4818 2.65764ZM13.9968 23.9155C13.9968 25.5236 12.6885 26.8319 11.0803 26.8319H9.91367C8.3055 26.8319 6.99717 25.5236 6.99717 23.9155V23.6666H13.9968V23.9155ZM16.7117 17.4441C15.1252 18.8546 14.1655 20.7801 13.9968 22.4996H12.2503V15.4996C12.2503 15.1776 11.9888 14.9161 11.6668 14.9161C11.3448 14.9161 11.0833 15.1776 11.0833 15.4996V22.4996H9.91367V15.4996C9.91367 15.1776 9.65217 14.9161 9.33017 14.9161C9.00817 14.9161 8.74667 15.1776 8.74667 15.4996V22.4996H6.99717C6.83433 20.7906 5.87233 18.8686 4.30667 17.4791C1.97967 15.4166 0.850168 12.3373 1.28217 9.15181C1.85183 4.95064 5.32617 1.68881 9.34733 1.23231C11.9958 0.928476 14.6432 1.76381 16.6118 3.51864C18.5233 5.22314 19.8298 7.81948 19.8298 10.6666C19.8298 13.3348 18.5967 15.7626 16.7117 17.4441Z" fill="currentColor"/>
</svg>`;

function buildGuidedScreens() {
  const app = document.getElementById('app');
  const backRef = document.getElementById('quiz-hint-overlay');
  /* the step counter counts questions only — answer slides are not steps */
  const steps = GUIDED.filter(c => !c.noStep && !c.answer);
  const total = steps.length;
  /* The answer pills. One builder, because a step may render them inside the
     callout card (the default) or out in the right-hand column (optsRight),
     and two copies of this markup would drift. */
  const optsHTML = (cfg) => `<div class="gc-opts${cfg.optsRight ? ' gc-opts--right' : ''}" role="radiogroup" aria-label="إمكانيّات الإجابة">
    ${cfg.q.opts.map((o, i) => `
      <div class="gc-opt" role="radio" aria-checked="false" tabindex="0" data-idx="${i}"
           onclick="guidedAnswer(${cfg.screen}, this)"
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();guidedAnswer(${cfg.screen}, this);}">${o}</div>`).join('')}
  </div>`;

  GUIDED.forEach((cfg) => {
    if (!inPart(cfg.screen)) return;
    const stepIdx = steps.indexOf(cfg);
    guidedState[cfg.screen] = { done: false };
    const sec = document.createElement('section');
    sec.className = 'screen g-screen';
    sec.dataset.screen = cfg.screen;
    sec.id = `g${cfg.screen}`;
    /* a real proportion table, as opposed to the recipe card (screen 5) or
       nothing at all (screen 15) — only that gets the deck's border. */
    const hasTable = cfg.media == null && cfg.reveal !== null;
    const media = cfg.media != null
      ? `<div class="g-media" data-reveal="3">${cfg.media}</div>`
      : (cfg.reveal !== null ? `<div class="g-media" data-reveal="3"><div id="g${cfg.screen}-table">${guidedTable(cfg.reveal, !!cfg.withProp, cfg.newRow)}</div></div>` : '');
    sec.innerHTML = `
      <h1 class="g-title" data-reveal="1">التناسب – تعالوا نحل التمرين الأول معًا</h1>
      <div class="g-layout">
        <div class="g-right" data-reveal="2">
          <div class="g-instruction">
            ${/* 07.09, producer: the story paragraph is removed from slide 6
                  onward — it is not on those deck slides. Screen 5 KEEPS it:
                  that screen was signed off as it was. Opt-in per screen. */''}
            ${cfg.story ? `<div class="g-story">${G_STORY}</div>` : ''}
            ${/* 07.09, producer: the step's title sits INSIDE the bordered box
                  with the table — the deck draws one rectangle around both.
                  A screen with no table has no frame, so its title stands on
                  its own exactly as before. */''}
            ${hasTable ? `<div class="g-frame">
              ${cfg.qline ? `<div class="g-qline">${cfg.qline}</div>` : ''}
              ${cfg.stepText ? `<div class="g-step-line">${cfg.stepText}</div>` : ''}
              ${media}
            </div>` : `
              ${cfg.qline ? `<div class="g-qline">${cfg.qline}</div>` : ''}
              ${cfg.stepText ? `<div class="g-step-line">${cfg.stepText}</div>` : ''}
              ${media}`}
            ${cfg.q && cfg.optsRight ? optsHTML(cfg) : ''}
            ${cfg.normalFeedback ? '' : `<div class="g-after" id="g${cfg.screen}-after"></div>`}
            ${cfg.normalFeedback ? `<div class="quiz-feedbox" id="g${cfg.screen}-feedbox"></div>` : ''}
          </div>
        </div>
        ${cfg.noStep ? '' : `<aside class="g-callout" data-reveal="4" aria-label="تعليمات المرحلة">
          ${GC_BULB}
          ${cfg.callout ? `<div class="gc-text">${cfg.callout}</div>` : ''}
          ${cfg.calloutQ ? `<div class="gc-q">${cfg.calloutQ}</div>` : ''}
          ${cfg.calloutEq || ''}
          ${cfg.q && !cfg.optsRight ? optsHTML(cfg) : ''}
        </aside>`}
      </div>
      ${cfg.noStep
        ? charWidget('سنشرح الحلّ بعد قليل،<br>خطوة بعد خطوة', '../unit-assets/img/character-orange-shake.png').replace('class="character-widget ', 'data-reveal="1" data-reveal-fade class="character-widget ')
        : ''}
      ${cfg.q
        ? `<button class="btn-continue" id="g${cfg.screen}-check" disabled>هل نتابع؟</button>`
        : `<button class="btn-continue" id="g${cfg.screen}-continue" onclick="goTo(${cfg.screen + 1})">متابعة</button>`}
      <button class="btn-back" onclick="goTo(${cfg.screen - 1})">عودة</button>`;
    app.insertBefore(sec, backRef);
  });
}
document.addEventListener('DOMContentLoaded', buildGuidedScreens);

/* THE APPROVED CALLOUT (GuidedInstructionFlow-RevealCallout, client-approved
   10.09.26 — producer 15.09.26: "should show V only on the right answer and on
   the right side"):
     · the answer reveals on the CLICK itself — there is no צדקתי step
     · only the CORRECT option is marked, with a ✓ on its RIGHT side
     · a wrong pick gets NO ✗ — it keeps the lavender .chosen wash so the
       learner can still see what they answered
     · the bar button then unlocks as שנמשיך?                                */
function guidedAnswer(screen, el) {
  const st = guidedState[screen];
  if (st.done) return;
  st.done = true;
  st.selected = Number(el.dataset.idx);
  const cfg = GUIDED.find(g => g.screen === screen);
  document.querySelectorAll(`#g${screen} .gc-opt`).forEach(o => {
    const idx = Number(o.dataset.idx);
    o.classList.add('locked');
    o.classList.remove('selected');
    o.setAttribute('aria-checked', o === el ? 'true' : 'false');
    if (idx === cfg.q.correct) o.classList.add('correct');
    else if (idx === st.selected) o.classList.add('chosen');
  });
  /* the table row a step reveals still fills in here */
  const tableEl = document.getElementById(`g${screen}-table`);
  if (tableEl && cfg.revealAfter) tableEl.innerHTML = guidedTable(cfg.revealAfter, !!cfg.withProp, cfg.newRow);
  /* and the step's follow-up explanation, which may differ after a wrong pick */
  const wasCorrect = st.selected === cfg.q.correct;
  if (cfg.normalFeedback) {
    const fb = wasCorrect ? cfg.normalFeedback.correct : cfg.normalFeedback.wrong;
    const box = document.getElementById(`g${screen}-feedbox`);
    box.className = `quiz-feedbox ${wasCorrect ? 'is-correct' : 'is-wrong'}`;
    box.innerHTML = `<div class="scq-fb-title">${fb.title}</div>` +
                    (fb.body ? `<div class="fb-body">${fb.body}</div>` : '');
    if (typeof quizFeedboxDrag === 'function') quizFeedboxDrag(box);
  } else {
    const after = (!wasCorrect && cfg.afterWrong) ? cfg.afterWrong : cfg.after;
    if (after) document.getElementById(`g${screen}-after`).innerHTML = after;
  }
  const btn = document.getElementById(`g${screen}-check`);
  btn.disabled = false;
  btn.textContent = 'هل نتابع؟';
  btn.setAttribute('onclick', `goTo(${screen + 1})`);
  /* platform layer (70-platform.js): a committed answer — remembered, reported, flushed */
  if (typeof onCustomAnswered === 'function') {
    try { onCustomAnswered(screen, { pick: st.selected }); } catch (e) { console.error('[xAPI] onCustomAnswered', e); }
  }
}

/* =====================================================================
   Transition / story / class-task / end screens — generated from config.
   ===================================================================== */

const RONI_HTML = `
<div class="explain-content" data-reveal="1">
  <h1 class="explain-title">رنين مستعدة للقاء الصديقات‎!</h1>
  <p class="explain-body">
    نجحت رنين في ملاءمة الوصفة لـ 12 وجبة دون التأثير على الطعم أو القوام.<br>
    <!-- 07.09 — deck slide 22 bolds exactly two runs: the single word
         "פרופורציה." at the end of this line, and the whole "כלומר…"
         sentence. Nothing else in the body is bold. -->
    كيف؟ ببساطة حافظت على <strong>التناسب.</strong><br>
    <strong>أي إنه إذا ازداد عدد الوجبات، فيجب أن تزداد كمية كل واحد من المكونات بنفس النسبة أيضًا.</strong><br>
    ولذلك يتحقق:
  </p>
  <!-- 07.09, producer: the pair of sentences that stood here
       ("פרופורציה מוגדרת כשוויון…" / "ראינו שכדי להגדיל…") is removed. They are
       not on deck slide 22 — its equation is a cropped picture and those lines
       live in the half the crop takes out. -->
  <div class="vi-equation roni-eq" dir="rtl">
    <span class="fraction"><span class="frac-top">كمية المكوّن في الوصفة الأصلية</span><span class="frac-bottom">كمية المكوّن في الوصفة المكبّرة</span></span> <span class="vi-eq">=</span> <span class="fraction"><span class="frac-top">عدد الوجبات في الوصفة الأصلية</span><span class="frac-bottom">عدد الوجبات في الوصفة المكبّرة</span></span>
  </div>
  <div class="vi-equation" dir="ltr">
    <span class="fraction"><span class="frac-top">4</span><span class="frac-bottom">12</span></span>
    <span class="vi-eq">=</span>
    <span class="fraction"><span class="frac-top">2</span><span class="frac-bottom">6</span></span>
    <span class="vi-eq">=</span>
    <span class="fraction"><span class="frac-top">1</span><span class="frac-bottom">3</span></span>
  </div>
</div>`;

/* 07.09, producer: screen 48 carries the copy, the small ratio table, the photo
   from the next slide and the companion with its bubble. Deck slide 60 renders
   `בטבלה נתונים...` REGULAR (no b="1") and puts the companion bottom-left with
   the callout beside it — the bubble IS the applet trigger, same contract as
   screen 39. */
/* 07.09, producer + deck slide 59: text and the ratio table on the right, the
   gym photo on the LEFT. No companion on this screen — the companion, the
   applet note and the applet trigger all belong to the NEXT slide (60 /
   screen 49). */
const GYM_INTRO_HTML = `
<div class="qprog qstepper" data-group="advanced" data-current="3" aria-hidden="true" id="x48-stepper"></div>
<div class="explain-content" data-reveal="1">
  <div class="gym-row">
    <div class="gym-main">
      <p class="explain-body">
        في تدريبات اللياقة المختلفة، من المتّبع العمل بحسب مجموعات،<br> بحيث تتكون كل مجموعة من زمن عمل (نشاط) وزمن راحة.<br> النسبة بين زمن العمل في المجموعة وزمن الراحة تتعلّق بنوع وهدف التدريب.<br> <strong>أمامكم جدول يوضح النسبة بحسب نوع التدريب‎.</strong>
      </p>
      <table class="data-table gym-table">
        <thead><tr><th>نوع التدريب</th><th>النسبة بين زمن العمل وزمن الراحة</th></tr></thead>
        <tbody>
          <tr><td>بناء الكتلة العضلية (تضخيم العضلات)</td><td><span class="ratio">1 : 3</span></td></tr>
          <tr><td>تدريب فتري معتدل (إنترفال)</td><td><span class="ratio">1 : 2</span></td></tr>
          <tr><td>تدريب فتري عالي الشدة (HIIT)</td><td><span class="ratio">2 : 1</span></td></tr>
        </tbody>
      </table>
    </div>
    <img class="content-img gym-photo" data-no-zoom src="../unit-assets/img/gym-training.jpeg" alt="متدربون في صالة لياقة">
  </div>
</div>`;

/* ── TransitionStory (deck slides 67 / 70 / 72 / 74) ─────────────────────
   Full-bleed photo behind everything (0,0 -> 1280x638 — the deck's srcRect is a
   symmetric vertical crop, i.e. object-fit: cover), and the copy on an OPAQUE
   white rounded card floating low on the right: 927px wide, right edge 36px in,
   bottom edge ~545px. No border, no shadow, no translucency — checked against
   the slide XML (`ln noFill`, no `effectLst`, no `alpha`).
   The deck also carries a lead line `עליכם לעזור לצוות בשטח…` inside the card
   shape itself, but its colour resolves to `lt1` — WHITE ON WHITE. It renders
   on none of the four pages, so it is leftover template text and is not built.
   FLAG-PRODUCER if it was meant to be visible. */
const storyScreen = (lines, img, extra = '') => `
<div class="story-stage" data-reveal="1">
  <img class="story-bg" src="${img}" alt="" aria-hidden="true">
  <div class="story-card">${extra}${lines}</div>
</div>`;

/* deck slide 53 table. `a:tblPr rtl="1"`, so BOTH the cell order and the
   gridCol order run RIGHT→LEFT: the rightmost column is the fold label and the
   widest (2573110 EMU) is the leftmost — the "היחס המצומצם" heading, which is
   the long one. The build had the widest column on the label side, which is
   why that heading wrapped to four lines.
   The three right-hand headings are rowSpan=2 in the deck (vMerge in row 2),
   and the reduced ratio reads VALUE first: the A4 row is `1.41 : 1`, so the
   learner's box goes LEFT of the `: 1`, not right of a leading `1 :`. */
/* 17.09, producer: the A4 example cell reads 41.1 : 1 — the deck's own cell
   stores the logical string "1 : 41.1 ", which the rtl="1" table renders that
   way. FLAGGED: 29.7 / 21 = 1.41, so the deck's figure is arithmetically wrong,
   and the two קיפול rows are still validated against 1.41 (CT_RED) with the
   feedback quoting 1.41 : 1. Producer's call — not corrected on our own. */
const CLASS_TASK_TABLE = `
<table class="data-table ct-table">
  <colgroup>
    <col class="ct-col-label"><col class="ct-col-side"><col class="ct-col-side">
    <col class="ct-col-ratio"><col class="ct-col-reduced">
  </colgroup>
  <thead>
    <tr>
      <th rowspan="2"></th>
      <th rowspan="2">طول الضلع الطويل للورقة</th>
      <th rowspan="2">طول الضلع القصير للورقة</th>
      <th colspan="2">النسبة بين طول الضلع الطويل للورقة وطول الضلع القصير للورقة</th>
    </tr>
    <tr>
      <th>النسبة</th>
      <th>النسبة المختزلة (مقربة إلى منزلتين بعد الفاصلة العشرية)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="num">ورقة A4</td>
      <td class="num">29.7‏‎ ‎سم</td>
      <td class="num">21‏‎ ‎سم</td>
      <td class="num"><span class="ratio">29.7 : 21</span></td>
      <td class="num"><span class="ratio">41.1 : 1</span></td>
    </tr>
    <tr>
      <td class="num">الطية أ</td>
      <td class="num"><input class="ct-input"></td>
      <td class="num"><input class="ct-input"></td>
      <td class="num"><input class="ct-input"></td>
      <td class="num ct-reduced" dir="ltr"><input class="ct-input ct-input--narrow"> : 1</td>
    </tr>
    <tr>
      <td class="num">الطية ب</td>
      <td class="num"><input class="ct-input"></td>
      <td class="num"><input class="ct-input"></td>
      <td class="num"><input class="ct-input"></td>
      <td class="num ct-reduced" dir="ltr"><input class="ct-input ct-input--narrow"> : 1</td>
    </tr>
  </tbody>
</table>`;

/* 07.09 — the paper-folding artwork from deck slide 52, drawn to the slide's own
   geometry (group boxes resolved, shifted to a 274x402 viewBox). Rectangles are
   white with a 2px black stroke; the fold creases are `sysDash` (6px dash / 2px
   gap at w=19050); the two red arrows are the deck's own Office stock icon
   (`Icons_LineCurveClockwise`, image86.svg, fill #EE0000) placed by the exact
   affine transform each `p:pic` resolves to. Panel א' has no captions in the
   deck — only panel ב' does. Original page LEFT, folded page RIGHT in both. */
const FOLD_ARROW = 'M31.4 18.2 L22 27.3 C20.8 28.5 18.9 28.4 17.8 27.3 C16.6 26.1 16.7 24.2 17.8 23.1 L32.1 9.1 C32.6 8.6 33.2 8.3 33.9 8.3 C34 8.3 34.1 8.3 34.2 8.3 C34.3 8.3 34.4 8.3 34.6 8.3 L34.8 8.3 L35 8.3 C35.5 8.4 36 8.7 36.3 9.1 L50.3 23.4 C51.5 24.6 51.4 26.5 50.3 27.6 C49.1 28.8 47.2 28.7 46.1 27.6 L37.5 18.8 C33.8 37.6 39 53.8 53.1 66.9 C60.1 73.3 68.2 78.4 77.1 81.9 C78.7 82.5 79.5 84.2 78.9 85.7 C78.3 87.3 76.6 88.1 75.1 87.5 C65.5 83.8 56.7 78.3 49.1 71.3 C38.2 61.3 26.5 44 31.4 18.2Z';

const FOLD_FIGURE = `
<svg class="fold-figure" viewBox="0 0 274 402" role="img"
     aria-label="الطية أ: ورقة A4 بالعرض تُطوى إلى نصفين بالطول فتصبح ورقة بالارتفاع. الطية ب: الورقة بالارتفاع تُطوى إلى نصفين بالعرض فتصبح ورقة بالعرض.">
  <g fill="#fff" stroke="#000" stroke-width="2">
    <rect x="10.6" y="65.2" width="135.7" height="92.5"/>
    <rect x="185.5" y="65.2" width="67.2" height="92.5"/>
    <rect x="18.0" y="243.8" width="87.9" height="113.6"/>
    <rect x="168.1" y="242.9" width="87.9" height="56.8"/>
  </g>
  <g stroke="#000" stroke-width="2" stroke-dasharray="6 2">
    <line x1="77.0" y1="64.6" x2="77.0" y2="158.5"/>
    <line x1="18.0" y1="300.6" x2="105.9" y2="300.6"/>
  </g>
  <g fill="#EE0000">
    <path d="${FOLD_ARROW}" transform="matrix(-0.37538 0.51257 -0.48807 -0.35743 121.135 80.673)"/>
    <path d="${FOLD_ARROW}" transform="matrix(-0.79412 -0.18906 0.18086 -0.75967 92.715 345.193)"/>
  </g>
  <g font-family="Calibri, Carlito, Assistant, sans-serif" fill="#000" text-anchor="middle" direction="rtl">
    <text x="149.7" y="30" font-size="27" font-weight="700">الطية أ</text>
    <text x="130.6" y="224.3" font-size="27" font-weight="700">الطية ب</text>
    <text x="62.0" y="388.8" font-size="21">الورقة الأصلية</text>
    <text x="212.2" y="330.1" font-size="21">الورقة المطوية</text>
  </g>
</svg>`;

const EXTRA_SCREENS = [
  { screen: 2, kind: 'transition', character: 'transition', video: '../unit-assets/video/character-orange-jump.mp4', lines: [
    '<strong>هيّا نتعلّم عن التناسُب</strong>',
  ], bubble: 'هيّا نبدأ‎!', cta: 'متابعة', hero: true },
  { screen: 4, kind: 'transition', character: 'notebook', video: '../unit-assets/video/character-orange-notebook.mp4', lines: [
    '<strong>سنبدأ بالتمرين بعد قليل،</strong>',
    'لكن قبل ذلك، تعالوا نحلّ تمرينًا واحدًا معًا',
  ] },
  { screen: 16, kind: 'custom-html', html: RONI_HTML },
  /* 07.09 — the producer's own clip. It was one of only two transitions
     still standing on a static pose; `character` stays as the fallback if
     the video ever fails to load. */
  { screen: 17, kind: 'transition', character: 'workout',
    video: '../unit-assets/video/character-orange-dumbbells.mp4', lines: [
    '<strong>ماذا بقيَ عالقًا في عقولنا؟</strong>',
    'سؤال بسيط للإحماء قبل أن نتقدم',
  ] },
  { screen: 19, kind: 'transition', character: 'training', video: '../unit-assets/video/character-orange-target.mp4', lines: [
    '<strong>أنهينا مرحلة التعلّم، وسننتقل إلى التمارين.</strong>',
    'ستظهر بعد قليل 6 تمارين‎.',
    'يجب الإجابة بشكل صحيح عن 4 تمارين على الأقل.',
    'هل هناك أمور ما زالت غير واضحة؟ يمكن التوجه إلى الدردشة أو المعلم للتوضيح!',
  ] },
  /* 07.09, producer: "this is way too big, make it like the template."
     Deck slide 35 is named TransitionScreen in Figma and ratio-01-01 S20 is
     the client-approved build of this exact copy — it splits the four lines
     lead(24/400) / title(40/700) / tail(24/400) / bubble, where our hero
     branch had all three body lines inside one 48px <h1> and the deck's
     TITLE line sitting in the bubble. Roles below follow the approved build. */
  { screen: 28, kind: 'transition', character: 'training', video: '../unit-assets/video/character-orange-arrows.mp4',
    lead: 'أحسنتم على الجهد! ولتعزيز الفهم، سنواصل التمرين قليلًا‎.',
    title: 'ستظهر بعد قليل 4 تمارين‎ أسهل قليلًا.',
    tail: 'أجيبوا بشكل صحيح عن 3 تمارين فما فوق لتتمكّنوا من التقدّم.',
    /* deck slide 35: the callout sits at x=217, the character picture at x=509 —
       the bubble is to the character's LEFT, tail pointing right. */
    bubble: 'لا تنسوا – يمكن دائمًا التوجه إلى الدردشة أو المعلم للتوضيح',
    bubbleSide: 'left' },
  { screen: 37, kind: 'transition', character: 'standing', video: '../unit-assets/video/character-orange-happy.mp4', lines: [
    '<strong>عمل رائع!</strong>',
    'سنعود إلى تمرينين بمستوى صعوبة أعلى. سهل عليكم‎!',
  ] },
  /* 07.09 — producer clip. `character` stays as the fallback pose.
     Deck slide 51 is a TransitionScreen: the first line is REGULAR, the bold
     run is `هذا وقت مناسب للتعلم بطريقة مختلفة أيضًا، ` (the title), the rest of that
     sentence is regular again, and the last line is a wedgeRectCallout —
     a speech bubble sitting to the LEFT of the character picture. */
  { screen: 41, kind: 'transition', character: 'standing',
    video: '../unit-assets/video/character-orange-stretching.mp4',
    lead: 'أنهيت التمرين بنجاح - كل الاحترام!',
    title: 'هذا وقت مناسب للتعلم بطريقة مختلفة أيضًا،',
    tail: 'لأن التعلم يتم بعدّة طرق.',
    bubble: 'سنُنفّذ المهمّة التالية بدون حاسوب، في الصف أو المدرسة!',
    bubbleSide: 'left' },
  /* 07.09 — bold runs read off deck slide 52: the opening instruction is bold
     in full, and the two fold references `(קיפול א')` / `(קיפול ב')` are bold
     inside otherwise regular sentences. */
  { screen: 42, kind: 'class-task', title: 'مهمّة صفيّة', body: `
    <p><strong>جدوا زميلًا أو زميلةً في نفس المرحلة من التعلم. إذا لم تجدوا، يمكنكم تنفيذ المهمة بمفردكم.</strong></p>
    <p><strong>ما هي الأدوات المطلوبة؟</strong> ورقة بحجم A4، مسطرة.</p>
    <p>قيسوا طول وعرض ورقة A4 بواسطة مسطرة، واحسبوا النسبة بين طول الورقة وعرضها‎.</p>
    <p>اطووا <strong>(الطية أ)</strong> الورقة إلى النصف وقيسوا الطول والعرض مجددًا، واحسبوا النسبة الجديدة‎.</p>
    <p>اطووا <strong>(الطية ب)</strong> الورقة إلى النصف مجددًا، وكرروا القياس والحساب‎.</p>
    `, figure: FOLD_FIGURE, table: `<p class="ct-table-lead">أكملوا الجدول: هل يوجد تناسب بين طول الضلع الطويل للورقة وطول الضلع القصير للورقة في الطيتين؟</p>` + CLASS_TASK_TABLE,
    /* 07.09, producer: "dev 43 isn't needed, the bottom half of 42 IS 43" — the
       two class-task slides are one screen now. 43 is gone, so 42 hands over
       to 44 directly (screen numbers are NOT renumbered: `data-screen` is the
       address for goTo(), the CSS hooks and the DEV bar). */
    /* 16.09, producer: the bar button is צדקתי? and the screen answers back.
       The deck's own slide 53 button is a picture reading המשך and the deck
       carries NO feedback copy for this task — the wording below is derived
       from the table's own arithmetic and the slide's lead sentence, and is
       FLAGGED for the client. The A4 sheet is 29.7 x 21, so each fold halves
       the long side: 21 x 14.85, then 14.85 x 10.5 — the ratio holds at
       1.41 : 1 throughout, which is the point of the task. Lengths are
       measured with a real ruler, so they are graded with a 0.25 cm
       tolerance rather than exact-match. */
    answerKey: [
      { len: 21,    short: 14.85 },
      { len: 14.85, short: 10.5  },
    ],
    next: 44 },
  /* deck slide 55: one bold title, and `هذا يعني أننا تقدمنا في المستوى!` is a
     wedgeRectCallout at x=130 — a speech bubble on the character's left. */
  { screen: 44, kind: 'transition', character: 'standing', prev: 42,
    video: '../unit-assets/video/character-orange-thinking.mp4',
    title: 'وصلنا إلى 5 أسئلة من التمرين المتقدم!',
    bubble: 'هذا يعني أننا تقدمنا في المستوى!',
    bubbleSide: 'left' },
  { screen: 48, kind: 'custom-html', html: GYM_INTRO_HTML },
  /* 30.09, producer: this screen carries three lines only — the two about
     finishing the practice stage and going to the chat are out. */
  { screen: 52, kind: 'transition', character: 'peak', video: '../unit-assets/video/character-orange-weights.mp4', lines: [
    '<strong>كل الاحترام!</strong>',
    '<span class="tl-b">والآن يأتي السؤال الأكبر</span>',
    'السؤال مكون من 4 بنود. عليكم الإجابة بشكل صحيح عن 3 منها على الأقل.',
  ] },
  /* deck slide 67: same card, taller because it holds more copy, plus a blue
     #019DE5 chip holding the density formula floated left INSIDE the card.
     Bold is the two words `צפיפות אוכלוסייה ` only — not the whole sentence. */
  { screen: 53, kind: 'custom-html', html: storyScreen(
    `المكان المزدحم هو مكان يتواجد فيه عدد كبير من الأشخاص على مساحة صغيرة‎.<br><br>` +
    `<div class="story-formula"><span class="fraction"><span class="frac-top">عدد السكان</span><span class="frac-bottom">مساحة السكن</span></span> = الكثافة السكانية</div>` +
    `لفحص الكثافة في مكان معين، نفحص عدد الأشخاص المتواجدين فيه ومساحة المنطقة التي يتواجدون فيها‎.<br><br>` +
    `<strong>الكثافة السكانية </strong>هي النسبة بين عدد السكان ومساحة سكنهم‎.<br>` +
    `عادةً تُقاس وحدة المساحة بالكيلومتر المربع.`,
    '../unit-assets/img/city-crowd.jpeg') },
  { screen: 55, kind: 'custom-html', html: storyScreen(
    `في مدينتين مختلفتين، الكثافة السكانية متساوية.<br>مساحة المدينة أ هي 50 كم مربع، ومساحة المدينة ب هي 125 كم مربع.`, '../unit-assets/img/story-cities.jpeg') },
  { screen: 57, kind: 'custom-html', html: storyScreen(
    `استعدادًا لمهرجان الصيف القطري، حصلت أربع سلطات محلية على ميزانية لإقامة مجمعات نشاط للشبيبة.<br>ادّعى منظّمو المهرجان <strong>أن الميزانية وُزعت بالتناسب مع عدد السكان في السلطة المحلية</strong>.<br>سنفحص إن كان الأمر كذلك‎...`, '../unit-assets/img/story-festival.jpeg') },
  { screen: 59, kind: 'custom-html', html: storyScreen(
    `توجهت المسؤولة عن قسم الفعاليات في بلدية شاكيد إلى منظّمي المهرجان، لكي يتم تعديل المبلغ المخصص للسلطة المحلية‎.`, '../unit-assets/img/story-shaked.jpeg') },
];

/* Same range rule as quizBuildScreens(): one shared unit.js, each component
   builds only its own screens. */
function inPart(n) {
  const c = window.PART_CONFIG;
  return !c || (n >= c.start && n <= c.end);
}

function buildExtraScreens() {
  const app = document.getElementById('app');
  const backRef = document.getElementById('quiz-hint-overlay');
  EXTRA_SCREENS.forEach(cfg => {
    if (!inPart(cfg.screen)) return;
    const sec = document.createElement('section');
    sec.className = 'screen';
    sec.dataset.screen = cfg.screen;
    sec.id = `x${cfg.screen}`;
    /* cfg.next / cfg.prev override the default n±1 — needed wherever a screen
       number has been retired (43) so navigation does not land on a dead id. */
    const nav = `
      <button class="btn-continue" onclick="goTo(${cfg.next != null ? cfg.next : cfg.screen + 1})">${cfg.cta || 'متابعة'}</button>
      <button class="btn-back" onclick="goTo(${cfg.prev != null ? cfg.prev : cfg.screen - 1})">عودة</button>`;
    if (cfg.kind === 'transition' && cfg.hero) {
      /* hero transition (slide 5 layout): big title on top, large centered
         character with the speech bubble at its head */
      const heroMedia = cfg.video
        ? `<video class="hero-video" src="${cfg.video}" autoplay muted playsinline></video>`
        : `<img src="${characterAssets.orange[cfg.character || 'standing']}" alt="الشخصية المرافقة">`;
      sec.innerHTML = `
        <div class="transition-content transition-hero">
          <h1 class="transition-title" data-reveal="1">${cfg.lines.join('<br>')}</h1>
          <!-- animation-system video-zone rule: character+bubble fade as ONE group with group 1 -->
          <div class="transition-character hero-char${cfg.bounce && !cfg.video ? ' char-bounce' : ''}" data-reveal="1" data-reveal-fade>
            ${heroMedia}
            <div class="speech-bubble side-bubble">${cfg.bubble}</div>
          </div>
        </div>${nav}`;
    } else if (cfg.kind === 'transition' && cfg.title) {
      /* TransitionScreen, the approved shape (ratio-01-01 S20 / 720 template
         196:3276): lead 24/400, title 40/700, tail 24/400, then the character
         with its bubble. The column centres itself in the 636px content box,
         and the media is a fixed box with object-fit:contain inside it, so a
         1280x720 clip cannot push the copy off the stage. */
      const tsMedia = cfg.video
        ? `<video class="transition-video" src="${cfg.video}" autoplay muted playsinline></video>`
        : `<img src="${characterAssets.orange[cfg.character || 'standing']}" alt="الشخصية المرافقة">`;
      sec.innerHTML = `
        <div class="transition-content ts-content">
          ${cfg.lead ? `<p class="ts-lead" data-reveal="1">${cfg.lead}</p>` : ''}
          <h1 class="ts-title" data-reveal="1">${cfg.title}</h1>
          ${cfg.tail ? `<p class="ts-tail" data-reveal="1">${cfg.tail}</p>` : ''}
          <div class="transition-character ts-character" data-reveal="1" data-reveal-fade>
            ${tsMedia}${cfg.bubble ? `<div class="speech-bubble side-bubble ts-bubble${cfg.bubbleSide === 'left' ? ' ts-bubble--left' : ''}">${cfg.bubble}</div>` : ''}
          </div>
        </div>${nav}`;
    } else if (cfg.kind === 'transition') {
      /* cfg.video: Google Flow MP4 (≤6s, white bg) — plays once and stops
         (client rule: every transition screen is animated). Static pose is the
         fallback until the client delivers the videos. */
      const media = cfg.video
        ? `<video class="transition-video" src="${cfg.video}" autoplay muted playsinline></video>`
        : `<img src="${characterAssets.orange[cfg.character || 'standing']}" alt="الشخصية المرافقة">`;
      sec.innerHTML = `
        <div class="transition-content">
          <div class="practice-intro-lines" data-reveal="1">${cfg.lines.join('<br>')}</div>
          <div class="transition-character${cfg.bounce ? ' char-bounce' : ''}" data-reveal="1" data-reveal-fade>${media}${cfg.bubble ? `<div class="speech-bubble side-bubble">${cfg.bubble}</div>` : ''}</div>
        </div>${nav}`;
    } else if (cfg.kind === 'custom-html') {
      sec.innerHTML = cfg.html + nav;
    } else if (cfg.kind === 'class-task') {
      /* 07.09, producer: when the screen carries a figure it goes to the LEFT of
         the copy (RTL row, so the text column is the first child), and the table
         drops underneath the pair at 80% width. `.ct-content` already scrolls —
         these are the two class-task screens, the one place the producer accepts
         a scroll. */
      const ctBody = cfg.figure
        ? `<div class="ct-row"><div class="ct-text">${cfg.body}</div><div class="ct-figure">${cfg.figure}</div></div>${cfg.table || ''}`
        : `${cfg.body}${cfg.table || ''}`;
      sec.innerHTML = `
        <div class="ct-content" data-reveal="1" data-reveal-fade>
          <h2 class="ct-title">${cfg.title}</h2>
          <div class="ct-body">${ctBody}</div>
        </div>
        <div class="quiz-feedbox" id="q${cfg.screen}-feedbox"></div>
        <button class="btn-continue" id="x${cfg.screen}-continue" disabled
          onclick="${cfg.answerKey ? `classTaskCheck(${cfg.screen}, ${cfg.next != null ? cfg.next : cfg.screen + 1})` : `goTo(${cfg.next != null ? cfg.next : cfg.screen + 1})`}">${cfg.answerKey ? 'هل إجابتي صحيحة؟' : 'متابعة'}</button>
        <button class="btn-back" onclick="goTo(${cfg.prev != null ? cfg.prev : cfg.screen - 1})">عودة</button>`;
    } else if (cfg.kind === 'end') {
      sec.innerHTML = `
        <div class="transition-content">
          <h1 class="transition-title" id="end-title" data-reveal="1"></h1>
          <p class="practice-intro-lines" id="end-line"></p>
          <div class="transition-character" data-reveal="1" data-reveal-fade><img id="end-character" src="../unit-assets/img/character-orange.png" alt="الشخصية المرافقة"></div>
        </div>
        <button class="btn-continue" onclick="void 0">انتهيت</button>
        <button class="btn-back" onclick="goTo(60)">عودة</button>`;
    }
    app.insertBefore(sec, backRef);
  });

  document.querySelectorAll('.ct-table').forEach(table => {
    const sec = table.closest('.screen');
    const btn = sec.querySelector('.btn-continue');
    table.addEventListener('input', () => {
      if (btn.dataset.checked) return;          // already answered — button is המשך now
      btn.disabled = [...sec.querySelectorAll('.ct-input')].some(i => !i.value.trim());
    });
  });
}

/* ── class-task check (screen 42). The learner measures a real sheet, so the
   two length columns accept anything within 0.25 cm; the ratio column accepts
   either `a : b` or `a:b`; the reduced column accepts 1.41 give or take 0.02.
   Marks ride the same `.vi-slot` corner badge the value-input screens use. ── */
const CT_TOL = 0.25, CT_RED = 1.41, CT_RED_TOL = 0.02;
const ctNum = (v) => parseFloat(String(v).replace(/[^\d.]/g, ''));
const ctNear = (v, want, tol) => Number.isFinite(ctNum(v)) && Math.abs(ctNum(v) - want) <= tol;
function ctRatioOk(v, a, b) {
  const parts = String(v).split(':').map(x => parseFloat(x.replace(/[^\d.]/g, '')));
  return parts.length === 2 && parts.every(Number.isFinite) &&
    Math.abs(parts[0] - a) <= CT_TOL && Math.abs(parts[1] - b) <= CT_TOL;
}
function ctMark(input, ok) {
  input.classList.remove('mark-ok', 'mark-bad');
  input.classList.add(ok ? 'mark-ok' : 'mark-bad');
  let slot = input.parentNode;
  if (!slot || !slot.classList.contains('vi-slot')) {
    slot = document.createElement('span');
    slot.className = 'vi-slot';
    input.parentNode.insertBefore(slot, input);
    slot.appendChild(input);
  }
  slot.dataset.mark = ok ? 'ok' : 'bad';
}
const CT_RATIO = (a, b) => `<span class="ratio">${a} : ${b}</span>`;
function classTaskCheck(screen, next) {
  const sec = document.querySelector(`.screen[data-screen="${screen}"]`);
  const cfg = EXTRA_SCREENS.find(c => c.screen === screen);
  const rows = [...sec.querySelectorAll('.ct-table tbody tr')].slice(1);   // row 0 is the given A4 row
  let allOk = true;
  rows.forEach((tr, i) => {
    const key = cfg.answerKey[i];
    const ins = [...tr.querySelectorAll('.ct-input')];
    const verdicts = [
      ctNear(ins[0].value, key.len, CT_TOL),
      ctNear(ins[1].value, key.short, CT_TOL),
      ctRatioOk(ins[2].value, key.len, key.short),
      ctNear(ins[3].value, CT_RED, CT_RED_TOL),
    ];
    verdicts.forEach((ok, k) => { ctMark(ins[k], ok); if (!ok) allOk = false; });
    ins.forEach(i2 => { i2.disabled = true; });
  });
  const body =
    `<span class="fb-p">الطية أ: طول الضلع الطويل 21 سم، طول الضلع القصير 14.85 سم.` +
    `<br>النسبة ${CT_RATIO('21', '14.85')}، والنسبة المختزلة ${CT_RATIO('1.41', '1')}.</span>` +
    `<span class="fb-p">الطية ب: طول الضلع الطويل 14.85 سم، طول الضلع القصير 10.5 سم.` +
    `<br>النسبة ${CT_RATIO('14.85', '10.5')}، والنسبة المختزلة ${CT_RATIO('1.41', '1')}.</span>` +
    `<span class="fb-p">يوجد تناسب بين طول الضلع الطويل للورقة وطول الضلع القصير للورقة في الطيتين.</span>`;
  quizShowFeedback(screen, allOk ? 'correct' : 'wrong', {
    title: allOk ? 'صحيح‎!' : 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:',
    body,
  });
  const btn = document.getElementById(`x${screen}-continue`);
  btn.dataset.checked = '1';
  btn.textContent = 'متابعة';
  btn.onclick = () => goTo(next);
  /* platform layer: the table is the committed answer. Its item declares no catalogue question,
     so nothing is reported — the seam records the verdict and flushes the typed values. */
  if (typeof onCustomAnswered === 'function') {
    try { onCustomAnswered(screen, { ok: allOk }); } catch (e) { console.error('[xAPI] onCustomAnswered', e); }
  }
}
document.addEventListener('DOMContentLoaded', buildExtraScreens);

/* 16.09, producer: "in 48 the stepper disappears". Screen 48 introduces
   question 3 but is not itself a question, so it had no strip at all. It now
   renders the advanced group's strip with station 3 current, and repaints on
   every entry so answers given earlier still show. */
function gymStepperInit() {
  const bar = document.getElementById('x48-stepper');
  if (!bar || typeof quizStepperHTML !== 'function') return;
  if (!bar.children.length) bar.innerHTML = quizStepperHTML({ step: { group: 'advanced', index: 3, total: 5 } })
    .replace(/^<div[^>]*>/, '').replace(/<\/div>$/, '');
  quizStepperPaint(bar, 'advanced', 3);
}
document.addEventListener('DOMContentLoaded', () => setTimeout(gymStepperInit, 0));



/* Screen 1 (TextWithCallout) — callout carries the punchline */
let s1WidgetDone = false;
function s1Widget() {
  if (s1WidgetDone) return;
  s1WidgetDone = true;
  document.getElementById('s1-widget').innerHTML =
    charWidget('هيّا نتعلّم عن التناسُب!');
}

/* The problem-report modal moved to unit-js/report-modal.js (identity from window.METADATA and
   SCREEN_TO_SUBCONTENT, delegated flag binding) — see that file. */

/* ═══ Scroll hint — the approved click-gesture hint from ratio-01-01 ═══════
   The cursor + ripples + sparks are the Figma "Desktop Click Hint"
   (2852:21114); the drift down the bar is Cursor Drag (2904:27290). It is
   appended to the SCREEN, never inside the scroller — a child at a negative
   offset inside the scrolling box creates a horizontal scrollbar — and it is
   dismissed on the learner's first real scroll.
   Producer 15.09.26: same scroll and hint as ratio-01-01 screen 1.        */
const SPARK_DIRS = [
  [0, -80], [56.57, -56.57], [80, 0], [56.57, 56.57],
  [0, 80], [-56.57, 56.57], [-80, 0], [-56.57, -56.57],
];

function makeClickHint(id) {
  const el = document.createElement('div');
  el.className = 'click-hint';
  el.id = id;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<div class="click-hint__ripple1"><img src="../unit-assets/img/hint/ripple-ring-1.svg" alt=""></div>' +
    '<div class="click-hint__ripple2"><img src="../unit-assets/img/hint/ripple-ring-2.svg" alt=""></div>' +
    SPARK_DIRS.map(([dx, dy], i) =>
      `<div class="click-hint__spark" style="--dx:${dx}px; --dy:${dy}px; --d:${i * 3}ms"><img src="../unit-assets/img/hint/spark.svg" alt=""></div>`
    ).join('') +
    '<div class="click-hint__cursor"><img src="../unit-assets/img/hint/cursor.svg" alt=""></div>';
  return el;
}

/* Every scroller in the unit gets one: s3's .teach-scroll and s42's
   .ct-content. Measured on screen ENTRY — a hidden screen reports 0x0, so a
   hint added at build time would appear on a screen with nothing to scroll. */
function attachScrollHints() {
  document.querySelectorAll('.screen').forEach(screen => {
    const scroller = screen.querySelector('.teach-scroll, .ct-content, .quiz-main--scroll');
    if (!scroller || screen.querySelector('.click-hint[id$="-hint-scroll"]')) return;
    if (scroller.scrollHeight <= scroller.clientHeight + 8) return;   // nothing to scroll
    const hint = makeClickHint((screen.id || 's') + '-hint-scroll');
    screen.appendChild(hint);
    scroller.addEventListener('scroll', () => hint.classList.add('hidden'), { once: true });
  });
}
document.addEventListener('DOMContentLoaded', () => setTimeout(attachScrollHints, 200));
