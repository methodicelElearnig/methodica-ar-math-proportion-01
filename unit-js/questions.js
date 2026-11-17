/* =====================================================================
   Unit content — question configs consumed by 720-core/quiz-engine.js.
   Source: מתמטיקה_פרופורציה_יעד 2.1_140726_לאחר תיקוני לקוח רז (78 slides,
   extracted to spec-140726/). Learner-facing text verbatim from the
   approved script; formula values from the embedded formula objects.
   ===================================================================== */

'use strict';

/* Figma bubble shapes (551:12741 / 551:12742) — exact geometry (r, stroke,
   tail dimensions) generated at each bubble's real size so text can flow. */
function bubblePathBottom(w, h) {
  const r = 10, i = 1, cx = w / 2, td = 15.3, tw = 17;
  return `M ${i + r} ${i} H ${w - i - r} A ${r} ${r} 0 0 1 ${w - i} ${i + r}` +
    ` V ${h - i - r} A ${r} ${r} 0 0 1 ${w - i - r} ${h - i}` +
    ` H ${cx + tw} L ${cx} ${h - i + td} L ${cx - tw} ${h - i}` +
    ` H ${i + r} A ${r} ${r} 0 0 1 ${i} ${h - i - r}` +
    ` V ${i + r} A ${r} ${r} 0 0 1 ${i + r} ${i} Z`;
}
function bubblePathSideLeft(w, h) {
  const r = 8.5, i = 1, cy = h / 2, td = 17.6, th = 11.3;
  return `M ${i + r} ${i} H ${w - i - r} A ${r} ${r} 0 0 1 ${w - i} ${i + r}` +
    ` V ${h - i - r} A ${r} ${r} 0 0 1 ${w - i - r} ${h - i}` +
    ` H ${i + r} A ${r} ${r} 0 0 1 ${i} ${h - i - r}` +
    ` V ${cy + th} L ${i - td} ${cy} L ${i} ${cy - th}` +
    ` V ${i + r} A ${r} ${r} 0 0 1 ${i + r} ${i} Z`;
}
/* 16.09 — the outline is an SVG sized to the bubble AT DRAW TIME, and the draw
   used to happen once: `if (.bubble-shape) return`. On screen 41 the copy
   reflowed from two lines to three after the web font swapped in, so the box
   grew to 102px while its outline stayed at the 90px it was drawn at and the
   last line sat outside the frame. The shape now records the size it was drawn
   for and is re-cut whenever the bubble is a different size. */
function decorateBubbles(scope) {
  (scope || document).querySelectorAll('.speech-bubble').forEach(b => {
    const w = b.offsetWidth, h = b.offsetHeight;
    if (!w || !h) return;
    const existing = b.querySelector('.bubble-shape');
    if (existing) {
      if (existing.dataset.w === String(w) && existing.dataset.h === String(h)) return;
      existing.remove();
    }
    let svg;
    if (b.classList.contains('side-bubble')) {
      const td = 18;
      svg = `<svg class="bubble-shape" style="left:${-td}px;top:0;width:${w + td}px;height:${h}px" ` +
        `viewBox="${-td} 0 ${w + td} ${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<path d="${bubblePathSideLeft(w, h)}" fill="white" stroke-width="2" stroke-linejoin="round"/></svg>`;
    } else {
      const td = 17;
      svg = `<svg class="bubble-shape" style="left:0;top:0;width:${w}px;height:${h + td}px" ` +
        `viewBox="0 0 ${w} ${h + td}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<path d="${bubblePathBottom(w, h)}" fill="white" stroke-width="2" stroke-linejoin="round"/></svg>`;
    }
    b.insertAdjacentHTML('afterbegin', svg);
    const shape = b.querySelector('.bubble-shape');
    shape.dataset.w = w; shape.dataset.h = h;
  });
}

/* fonts change the metrics, so re-cut every bubble once they are in, and again
   whenever one actually changes size (long copy, zoom, a late image). */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => decorateBubbles());
}
if (typeof ResizeObserver === 'function') {
  const bubbleRO = new ResizeObserver(entries => {
    entries.forEach(e => decorateBubbles(e.target.parentNode || document));
  });
  document.addEventListener('DOMContentLoaded', () => setTimeout(() => {
    document.querySelectorAll('.speech-bubble').forEach(b => bubbleRO.observe(b));
  }, 0));
}

const charWidget = (text, pose = '../unit-assets/img/character-orange.png', extra = '') => `
  <div class="character-widget ${extra}">
    <div class="speech-bubble">${text}</div>
    <img src="${pose}" alt="شخصية مرافقة">
  </div>`;

/* 07.09, producer: on screen 39 the note-popup's own trigger pill becomes the
   companion's speech bubble ("اضغطوا عليّ لتذكيركم بتحويل وحدات القياس"). The bubble
   IS the button, so it keeps the popup's keyboard and pointer affordances
   instead of just looking clickable. */
const POPUP_BUBBLE = (screen, text, extra = '') => charWidget(
  `<button type="button" class="bubble-trigger" onclick="document.getElementById('q${screen}-note-popup').classList.remove('hidden')">${text}</button>`,
  '../unit-assets/img/character-orange.png', extra);



const ORANGE_BUBBLE = (text) => charWidget(text);

const MESSI_TABLE = `
<table class="data-table">
  <thead><tr><th>السنة</th><th>عدد المباريات</th><th>عدد الأهداف</th><th>نسبة المباريات إلى الأهداف</th></tr></thead>
  <tbody>
    <tr><td>2017</td><td>5</td><td>4</td><td><span class="ratio">5 : 4</span></td></tr>
    <tr><td>2018</td><td>4</td><td>1</td><td><span class="ratio">4 : 1</span></td></tr>
    <tr><td>2021</td><td>16</td><td>9</td><td><span class="ratio">16 : 9</span></td></tr>
    <tr><td>2022</td><td>10</td><td>8</td><td><span class="ratio">10 : 8</span></td></tr>
    <tr><td>2024</td><td>9</td><td>4</td><td><span class="ratio">9 : 4</span></td></tr>
    <tr><td>2025</td><td>3</td><td>2</td><td><span class="ratio">3 : 2</span></td></tr>
  </tbody>
</table>`;

const EXAMS_TABLE = `
<table class="data-table">
  <thead><tr><th></th><th>عدد الأسئلة في الامتحان</th><th>وزن العلامة في الفصل</th></tr></thead>
  <tbody>
    <tr><td>الامتحان 1</td><td>3</td><td>25%</td></tr>
    <tr><td>الامتحان 2</td><td>4</td><td>30%</td></tr>
    <tr><td>الامتحان 3</td><td>6</td><td>45%</td></tr>
  </tbody>
</table>`;

const EXAMS_FB_TABLE = `
<table class="data-table">
  <thead><tr><th></th><th>النسبة</th><th>النسبة المختزلة</th></tr></thead>
  <tbody>
    <tr><td>الامتحان 1</td><td><span class="ratio">25 : 3</span></td><td><span class="ratio">25 : 3</span></td></tr>
    <tr><td>الامتحان 2</td><td><span class="ratio">30 : 4</span></td><td><span class="ratio">15 : 2</span></td></tr>
    <tr><td>الامتحان 3</td><td><span class="ratio">45 : 6</span></td><td><span class="ratio">15 : 2</span></td></tr>
  </tbody>
</table>`;

const PIZZA_TABLE = `
<table class="data-table">
  <thead><tr><th>إمكانية الدفع</th><th>المبلغ الذي سيدفعه أديب</th><th>المبلغ الذي سيدفعه أشرف</th></tr></thead>
  <tbody>
    <tr><td>أ</td><td><span dir="ltr"><span class="money" dir="rtl">₪22</span></span></td><td><span dir="ltr"><span class="money" dir="rtl">₪50</span></span></td></tr>
    <tr><td>ب</td><td><span dir="ltr"><span class="money" dir="rtl">₪30</span></span></td><td><span dir="ltr"><span class="money" dir="rtl">₪42</span></span></td></tr>
    <tr><td>ت</td><td><span dir="ltr"><span class="money" dir="rtl">₪36</span></span></td><td><span dir="ltr"><span class="money" dir="rtl">₪36</span></span></td></tr>
    <tr><td>ث</td><td><span dir="ltr"><span class="money" dir="rtl">₪27</span></span></td><td><span dir="ltr"><span class="money" dir="rtl">₪45</span></span></td></tr>
  </tbody>
</table>`;

/* 07.09 — deck slides 41/42/43 carry the SAME image group: two captioned
   cards stacked in a COLUMN down the left third, each a rounded #019DE5 frame
   with the stage name above the picture, and each picture cropped (srcRect)
   to the inner count panel so the artwork's own baked-in title banner is gone
   — the caption replaces it. The build had them side by side, uncropped and
   unframed. The JPEGs are now cropped to the deck's srcRect; the uncropped
   exports are in assets/img/_source-originals/. */
const RACING_CARD = (n, name, counts) => `<div class="racing-card">
  <div class="racing-cap"><strong>المرحلة ${n} – ${name}، </strong>جُمِعت:</div>
  <img class="content-img" src="../unit-assets/img/racing-stage-${n}.jpeg" alt="المرحلة ${n} – ${name}: ${counts}">
</div>`;

const RACING_IMG = `<div class="racing-imgs">
  ${RACING_CARD(1, 'مسار قوس القزح', '12 حبة فطر توربو و16 قشرة موز')}
  ${RACING_CARD(2, 'القلعة الغامضة', '15 حبة فطر توربو و20 قشرة موز')}
</div>`;
const SYRUP_IMG = `<img class="content-img" src="../unit-assets/img/girl-mixing-syrup.jpeg" alt="لينا تقف في المطبخ وتحضّر مشروبًا من الشراب المركّز. الفتاة تسكب الشراب المركّز في وعاء قياس كبير عليه ملصق \"كوبان من الشراب المركّز\". وإلى جانب الوعاء 12 كوبًا شفافًا من الماء‎.">`;

const ATHLETICS_TABLE = `
<table class="data-table">
  <thead><tr><th>المجموعة</th><th>عداؤون لمسافات قصيرة</th><th>عداؤون لمسافات طويلة</th></tr></thead>
  <tbody>
    <tr><td>المجموعة 1</td><td>12</td><td>18</td></tr>
    <tr><td>المجموعة 2</td><td>16</td><td>16</td></tr>
    <tr><td>المجموعة 3</td><td>18</td><td>12</td></tr>
  </tbody>
</table>`;

/* producer 16.09: screen 54's table is magnifiable (`data-zoom`). */
const CITIES_TABLE = `
<table class="data-table" data-zoom>
  <thead><tr><th>المدينة</th><th>عدد السكان في المدينة</th><th>مساحة المدينة بالكيلومتر المربع</th></tr></thead>
  <tbody>
    <tr><td>القدس</td><td>1,060,000</td><td>126</td></tr>
    <tr><td>حيفا</td><td>285,000</td><td>67</td></tr>
  </tbody>
</table>`;

const BUDGET_TABLE = (shaked) => `
<table class="data-table">
  <thead><tr><th>السلطة المحلية</th><th>عدد السكان في المدينة</th><th>ميزانية المهرجان</th></tr></thead>
  <tbody>
    <tr><td>غفعوت</td><td>120,000</td><td><span dir="ltr"><span class="money" dir="rtl">₪600,000</span></span></td></tr>
    <tr><td>نئوت</td><td>180,000</td><td><span dir="ltr"><span class="money" dir="rtl">₪900,000</span></span></td></tr>
    <tr><td>شاكيد</td><td>150,000</td><td>${shaked}</td></tr>
    <tr><td>بركات</td><td>240,000</td><td><span dir="ltr"><span class="money" dir="rtl">₪1,200,000</span></span></td></tr>
  </tbody>
</table>`;

const GYM_TYPES_TABLE = `
<table class="data-table">
  <thead><tr><th>نوع التدريب</th><th>النسبة بين زمن العمل وزمن الراحة</th></tr></thead>
  <tbody>
    <tr><td>بناء الكتلة العضلية (تضخيم العضلات)</td><td><span class="ratio">1 : 3</span></td></tr>
    <tr><td>تدريب فتري معتدل (إنترفال)</td><td><span class="ratio">1 : 2</span></td></tr>
    <tr><td>تدريب فتري عالي الشدة (HIIT)</td><td><span class="ratio">2 : 1</span></td></tr>
  </tbody>
</table>`;

const TRAINING_POOL = ['تدريب فتري عالي الشدة', 'تدريب فتري معتدل', 'بناء الكتلة العضلية'];
const PEAK_STEP_LABELS = ['البند أ', 'البند ب', 'البند ت', 'البند ث'];

const EX_TABLE_PARTS = [
  `<table class="data-table dd-table"><thead><tr><th>نوع التمرين</th><th>زمن العمل</th><th>زمن الراحة</th><th>نوع التدريب</th></tr></thead><tbody>
   <tr><td>تمارين الضغط</td><td>40‏‎ ‎ثانية</td><td>20‏‎ ‎ثانية</td><td>`,
  `</td></tr><tr><td>ضغط الكتف</td><td>45‏‎ ‎ثانية</td><td>دقيقة ونصف</td><td>`,
  `</td></tr><tr><td>ضغط الصدر</td><td>40‏‎ ‎ثانية</td><td>دقيقتان</td><td>`,
  `</td></tr><tr><td>ضغط الأرجل على الجهاز</td><td>50‏‎ ‎ثانية</td><td>دقيقتان ونصف</td><td>`,
  `</td></tr><tr><td>القفز بالحبل</td><td>50‏‎ ‎ثانية</td><td>25‏‎ ‎ثانية</td><td>`,
  `</td></tr></tbody></table>`,
];

/* 16.09, producer: screen 50 shows screen 49's table again, this time FILLED
   with the correct training type, under the statements and magnifiable. Rows
   and answers are the same data EX_TABLE_PARTS and the s49 key are built from;
   the deck carries it as its own slide 61. */
const TRAINING_ANSWERS = [
  'تدريب فتري عالي الشدة',
  'تدريب فتري معتدل',
  'بناء الكتلة العضلية',
  'بناء الكتلة العضلية',
  'تدريب فتري عالي الشدة',
];
const EX_TABLE_ANSWERED = EX_TABLE_PARTS.reduce(
  (html, part, i) => html + part + (TRAINING_ANSWERS[i] || ''), '')
  .replace('class="data-table dd-table"', 'class="data-table dd-table ex-table-answered" data-zoom');

/* 17.09, producer: deck slide 59's reference table is repeated on screen 49, in
   the left column, as the key the learner matches against. Deck cells store
   `3 : 1` / `2 : 1` / `1 : 2`, and the a:tblPr rtl="1" table renders those as
   1 : 3 / 1 : 2 / 2 : 1 — which is what the producer's own screenshot shows and
   what screen 49's answer key needs (40:20 = 2 : 1 → HIIT). `.ratio` is an LTR
   isolate, so the visual form is written here literally. Rebuilt as a real
   .data-table rather than dropped in as the PNG: same look, live type at the
   18px floor, and no PNG to re-export when the copy changes. */
const GYM_RATIO_TABLE = `
<table class="data-table gym-ratio-table">
  <thead><tr><th>نوع التدريب</th><th>النسبة بين زمن العمل وزمن الراحة</th></tr></thead>
  <tbody>
    <tr><td>بناء الكتلة العضلية (تضخيم العضلات)</td><td class="num"><span class="ratio">1 : 3</span></td></tr>
    <tr><td>تدريب فتري معتدل (إنترفال)</td><td class="num"><span class="ratio">1 : 2</span></td></tr>
    <tr><td>تدريب فتري عالي الشدة (HIIT)</td><td class="num"><span class="ratio">2 : 1</span></td></tr>
  </tbody>
</table>`;

const RATIO_PAIRS_PARTS = [
  `<table class="data-table dd-table"><thead><tr><th>النسبة A</th><th>النسبة B</th><th>هل يوجد تناسب؟</th></tr></thead><tbody>
   <tr><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">8</span><span class="frac-bottom">9</span></span></span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">4</span><span class="frac-bottom">4.5</span></span></span></td><td>`,
  `</td></tr><tr><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">8</span></span></span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">21</span><span class="frac-bottom">36</span></span></span></td><td>`,
  `</td></tr><tr><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">9</span><span class="frac-bottom">15</span></span></span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">20</span></span></span></td><td>`,
  `</td></tr><tr><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">7</span><span class="frac-bottom">10</span></span></span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">17.5</span><span class="frac-bottom">25</span></span></span></td><td>`,
  `</td></tr></tbody></table>`,
];

/* 07.09 — deck slide 63's artwork, rebuilt to the slide's own geometry rather
   than sketched. What the deck actually has, and the build did not:
     - both triangles are right-LEANING scalene (prstGeom triangle, adj 86629 =
       apex at 86.6% of the base), not the near-isoceles pair we drew;
     - triangle ב' is only 1.711x triangle א' linearly — the drawing is
       deliberately NOT to scale with the 12 -> 36 labels;
     - the height is a SOLID teal #156082 line (no prstDash anywhere), with a
       white right-angle square at its foot, on the line's LEFT;
     - each base carries a downward curly brace and the length sits under it;
     - the labels are bare numerals: no `צלע`, no em-dash. `ס"מ` is in the stem.
   Drawn 1 user unit = 1 rendered px (deck px x 1.26) so the 11pt numerals land
   at 18.5px and clear the type floor. */
const TRIANGLES_SVG = `
<svg viewBox="0 0 305 526" class="triangles-svg" role="img" aria-label="مثلثان: في المثلث أ طول الضلع 12 والارتفاع 5، وفي المثلث ب طول الضلع 36 والارتفاع 15.">
  <g fill="none" stroke="#000" stroke-width="2.5">
    <polygon points="112.4,161.1 277.9,161.1 255.9,62.2"/>
    <polygon points="3.0,468.9 286.2,468.9 248.3,310.9"/>
  </g>
  <g fill="none" stroke="#156082" stroke-width="2.5">
    <line x1="256.0" y1="62.3" x2="256.0" y2="161.1"/>
    <line x1="248.6" y1="310.9" x2="248.6" y2="468.9"/>
  </g>
  <g fill="#fff" stroke="#000" stroke-width="2.5">
    <rect x="242.5" y="147.0" width="13.2" height="13.7"/>
    <rect x="230.2" y="451.9" width="17.8" height="16.6"/>
  </g>
  <g fill="none" stroke="#000" stroke-width="1.7">
    <path d="M112.5 168.4 Q112.5 176.6 120.5 176.6 L187.3 176.6 Q195.3 176.6 195.3 184.7 Q195.3 176.6 203.3 176.6 L270.1 176.6 Q278.1 176.6 278.1 168.4"/>
    <path d="M3.0 476.5 Q3.0 485.3 11.0 485.3 L136.6 485.3 Q144.6 485.3 144.6 494.0 Q144.6 485.3 152.6 485.3 L278.2 485.3 Q286.2 485.3 286.2 476.5"/>
  </g>
  <g font-family="Calibri, Carlito, Assistant, sans-serif" fill="#000" text-anchor="middle" direction="rtl">
    <text x="240.7" y="42.2" font-size="26.8">المثلث أ</text>
    <text x="242.5" y="295.3" font-size="26.8">المثلث ب</text>
  </g>
  <g font-family="Calibri, Carlito, Assistant, sans-serif" fill="#000" text-anchor="middle">
    <text x="195.8" y="210.3" font-size="18.5">12</text>
    <text x="245.2" y="129.1" font-size="18.5">5</text>
    <text x="144.9" y="518.8" font-size="18.5">36</text>
    <text x="230.8" y="413.1" font-size="18.5">15</text>
  </g>
</svg>`;

const QUESTIONS = [

  /* ---------- warmup (slide 24) ---------- */
  {
    /* 07.09, producer: no title on this screen. Deck slide 24 has no such
       line either — its content is the question, four options, hint and the
       two feedbacks, nothing else. */
    screen: 18, type: 'single', maxAttempts: 2, hintPolicy: 'always',
    stem: `<strong>اختاروا النسبة التي تتناسب مع <span class="ratio">3 : 7</span></strong>`,
    /* 07.09, producer: the companion stands bottom-left with this line. */
    content: ORANGE_BUBBLE('هل تتذكرون كيف تحسبون؟'),
    options: [
      { id: 'a', html: '<span class="ratio">6 : 10</span>' },
      { id: 'b', html: '<span class="ratio">6 : 14</span>' },
      { id: 'c', html: '<span class="ratio">10 : 14</span>' },
      { id: 'd', html: '<span class="ratio">1 : 4</span>' },
    ],
    correct: 'b',
    hint: { body: 'حاولوا اختزال النسب (إذا أمكن) وافحصوا – هل نحصل على نسب متساوية؟' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'إذا اختزلنا النسبة <span class="ratio">6 : 14</span> بواسطة القسمة على 2، سنحصل على <span class="ratio">3 : 7</span>:<br><span class="eq-ltr" dir="ltr"><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">14</span></span></span> = <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">7</span></span></span></span><br>ولذلك يوجد تناسُب بين النسبة <span class="ratio">3 : 7</span> والنسبة <span class="ratio">6 : 14‏‎</span>.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'إذا اختزلنا النسبة <span class="ratio">6 : 14</span> بواسطة القسمة على 2، سنحصل على <span class="ratio">3 : 7</span>:<br><span class="eq-ltr" dir="ltr"><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">14</span></span></span> = <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">7</span></span></span></span><br>ولذلك يوجد تناسُب بين النسبة <span class="ratio">3 : 7</span> والنسبة <span class="ratio">6 : 14‏‎</span>.' },
    },
  },

  /* ---------- standard practice (slides 26-33) ---------- */
  {
    /* producer 15.09.26: this hint waits for a first attempt. This unit's
       engine shows the hint by default, so the opt-out is explicit. */
    screen: 20, label: 'سؤال 1 من 6', type: 'single', maxAttempts: 2, hintPolicy: 'after-wrong',
    step: { group: 'standard', index: 1, total: 6 },
    stem: `ليو ميسي هو لاعب كرة قدم أرجنتيني يُعدّ من أعظم لاعبي كرة القدم في التاريخ. أمامكم جدول معطيات المباريات التي شارك فيها ميسي مع المنتخب وعدد الأهداف التي سجلها، بحسب السنوات.<br><br><strong>أ. هل يوجد تناسب بين عدد المباريات التي شارك فيها ميسي وعدد الأهداف التي سجلها في العامين 2024 وَ 2025؟</strong>`,
    content: MESSI_TABLE,
    options: [
      { id: 'a', html: 'نعم' },
      { id: 'b', html: 'لا' },
      { id: 'c', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'b',
    hint: { body: 'احسبوا النسب بين عدد المباريات التي شارك فيها ميسي وعدد الأهداف التي سجلها في هذين العامين، وافحصوا هل نحصل على نسب متساوية‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'في عام 2024، النسبة بين عدد المباريات وعدد الأهداف هي <span class="ratio">4 : 9</span>،<br><br>وفي عام 2025 النسبة بين عدد المباريات وعدد الأهداف هي <span class="ratio">2 : 3</span>.<br><br>هاتان النسبتان غير متساويتين، ولذلك لا يوجد تناسب &nbsp;<span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">4</span><span class="frac-bottom">9</span></span> <span class="fr-eq">≠</span> <span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">3</span></span></span>' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'في عام 2024، النسبة بين عدد المباريات وعدد الأهداف هي <span class="ratio">4 : 9</span>،<br><br>وفي عام 2025 النسبة بين عدد المباريات وعدد الأهداف هي <span class="ratio">2 : 3</span>.<br><br>هاتان النسبتان غير متساويتين، ولذلك لا يوجد تناسب &nbsp;<span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">4</span><span class="frac-bottom">9</span></span> <span class="fr-eq">≠</span> <span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">3</span></span></span>' },
    },
  },
  {
    screen: 21, label: 'سؤال 1 من 6', type: 'dual-select', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'standard', index: 1, total: 6 },
    stem: `ليو ميسي لاعب كرة قدم أرجنتيني يُعدّ من أعظم لاعبي كرة القدم في التاريخ. أمامكم جدول معطيات عدد المباريات التي شارك فيها ميسي مع المنتخب وعدد الأهداف التي سجلها، بحسب السنوات.<br><br><strong>ب. أكمِلوا‎:</strong>`,
    content: MESSI_TABLE,
    sentence: {
      before: 'في العامين',
      middle: 'وَ ',
      after: 'كان هناك تناسب بين عدد المباريات التي شارك فيها ميسي وعدد الأهداف التي سجلها‎.',
    },
    pool: ['2017', '2018', '2021', '2022', '2024', '2025'],
    correctPair: ['2017', '2022'],
    hint: { body: 'احسبوا النسب المختزلة بين عدد المباريات التي شارك فيها ميسي وعدد الأهداف التي سجلها، وافحصوا في أي سنوات نحصل على نسب متساوية‎.' },
    /* NOTE: the approved script (slide 27) still carries the 2024/10:8 content
       bug (notes say correct = 2017+2022; filled answers say 2017+2024, but
       10:8 is 2022's data). Implemented mathematically-correct feedback —
       flagged again to רז, see TODO.md. */
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'في عام 2017 النسبة هي <span class="ratio">5 : 4</span>، وفي عام 2022 النسبة هي <span class="ratio">10 : 8</span>.<br>بعد اختزال النسبة <span class="ratio">10 : 8</span> بـ 2، نحصل على <span class="ratio">5 : 4</span>. ومن هنا فإن النسبتين متساويتان، ولذلك يوجد بينهما تناسب‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'في عام 2017 النسبة هي <span class="ratio">5 : 4</span>، وفي عام 2022 النسبة هي <span class="ratio">10 : 8</span>.<br>بعد اختزال النسبة <span class="ratio">10 : 8</span> بـ 2، نحصل على <span class="ratio">5 : 4</span>. ومن هنا فإن النسبتين متساويتان، ولذلك يوجد بينهما تناسب‎.' },
    },
  },
  {
    screen: 22, label: 'سؤال 2 من 6', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'standard', index: 2, total: 6 },
    stem: `ديني أفديا هو لاعب إسرائيلي يلعب في دوري الـ NBA.<br>في مباراة أمام سان أنطونيو سبيرز، لعب ديني 40 دقيقة وسجل 30 نقطة.<br>وفي مباراة أمام أورلاندو ماجيك، لعب ديني 36 دقيقة وسجل 27 نقطة.<br><br><strong>هل يوجد تناسب (تَساوٍ بين نسبتين) بين عدد النقاط التي سجلها ديني وعدد الدقائق التي لعبها في المباراتين؟</strong>`,
    content: `<img class="content-img avdija-img" src="../unit-assets/img/avdija-allstar.jpeg" alt="ديني أفديا لاعب كرة سلة بزيّ مباراة كل النجوم، يراوغ بالكرة في الملعب">`,
    options: [
      { id: 'a', html: 'نعم' },
      { id: 'b', html: 'لا' },
      { id: 'c', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'a',
    hint: { body: 'حاولوا اختزال النسبة بين عدد النقاط وبين عدد الدقائق في كل مباراة، وافحصوا – هل نحصل على نسب متساوية؟' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'النسبة في المباراة أمام سان أنطونيو سبيرز تختزَل إلى <span class="ratio">4 : 3</span>، وكذلك النسبة في المباراة أمام أورلاندو ماجيك تختزَل إلى <span class="ratio">4 : 3</span>. لذلك النسبتان متساويتان، ويوجد بينهما تناسب‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'النسبة في المباراة أمام سان أنطونيو سبيرز تختزَل إلى <span class="ratio">4 : 3</span>، وكذلك النسبة في المباراة أمام أورلاندو ماجيك تختزَل إلى <span class="ratio">4 : 3</span>. لذلك النسبتان متساويتان، ويوجد بينهما تناسب‎.' },
    },
  },
  {
    screen: 23, label: 'سؤال 3 من 6', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'standard', index: 3, total: 6 },
    stem: `في مدرسة "أجيال" كانت في الفصل الأول ثلاثة امتحانات في الرياضيات.<br>معطيات كل امتحان تظهر في الجدول.<br><br><strong>في أي زوج من الامتحانات يوجد تناسب (تَساوٍ بين نسبتين)<br>بين عدد الأسئلة في الامتحان ووزنه من علامة الفصل؟</strong>`,
    content: EXAMS_TABLE,
    options: [
      { id: 'a', html: 'امتحان 1 وامتحان 2' },
      { id: 'b', html: 'امتحان 1 وامتحان 3' },
      { id: 'c', html: 'امتحان 2 وامتحان 3' },
      { id: 'd', html: 'لا يوجد تناسب بين أي زوج من الامتحانات' },
    ],
    correct: 'c',
    hint: { body: 'لكل امتحان، احسبوا النسبة المختزلة بين عدد الأسئلة ووزن الامتحان من علامة الفصل، وافحصوا – هل نحصل على نسب متساوية‎؟' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'نحسب لكل امتحان النسبة بين عدد الأسئلة ووزن الامتحان من علامة الفصل:' + EXAMS_FB_TABLE + 'وجدنا أن النسب في الامتحان 2 والامتحان 3 متساوية، ولذلك يوجد بينهما تناسب‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'نحسب لكل امتحان النسبة بين عدد الأسئلة ووزن الامتحان من علامة الفصل:' + EXAMS_FB_TABLE + 'وجدنا أن النسب في الامتحان 2 والامتحان 3 متساوية، ولذلك يوجد بينهما تناسب‎.' },
    },
  },
  {
    screen: 24, label: 'سؤال 4 من 6', type: 'multi', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'standard', index: 4, total: 6 },
    stem: `استعدادًا لعرض موسيقي كبير، قررت أربع صديقات صنع "أساور صداقة" خاصة بألوان العرض: البنفسجي والرمادي.<br>حدّدت الصديقات مسبقًا نسبة ثابتة بين عدد الخرزات البنفسجية وعدد الخرزات الرمادية في كل سوار.<br>أمامكم نماذج لأربعة أساور صنعتها الصديقات.<br><br><strong>اختاروا جميع الأساور التي يوجد بينها تناسب بين عدد الخرزات البنفسجية وعدد الخرزات الرمادية.</strong>`,
    content: `
      <div class="bracelets">
        <div class="bracelet-row"><span>نسرين‎:</span><img src="../unit-assets/img/bracelet-shani.png" alt="سوار نسرين: 8 خرزات بنفسجية و-16 خرزة رمادية"></div>
        <div class="bracelet-row"><span>سمر:</span><img src="../unit-assets/img/bracelet-keren.png" alt="سوار سمر: 12 خرزة بنفسجية و-24 خرزة رمادية"></div>
        <div class="bracelet-row"><span>عبير:</span><img src="../unit-assets/img/bracelet-dafna.png" alt="سوار عبير: 10 خرزات بنفسجية و-10 خرزات رمادية"></div>
        <div class="bracelet-row"><span>منال:</span><img src="../unit-assets/img/bracelet-carmel.png" alt="سوار منال: 10 خرزات بنفسجية و-20 خرزة رمادية"></div>
      </div>`,
    options: [
      { id: 'a', html: 'نسرين' },
      { id: 'b', html: 'سمر' },
      { id: 'c', html: 'عبير' },
      { id: 'd', html: 'منال' },
    ],
    correctSet: ['a', 'b', 'd'],
    hint: { body: 'احسبوا النسب المختزلة بين عدد الخرزات البنفسجية وعدد الخرزات الرمادية في كل سوار، وافحصوا – هل نحصل على نسب متساوية‎؟' },
    /* NOTE: the approved script's alt-text bead counts (8:16, 12:24, 10:10,
       10:20 → reduced 1:2 / 1:1) do not match its own feedback ratios
       (2:3 / 3:2). Feedback kept verbatim; flagged to רז (TODO.md). */
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'في أساور نسرين، سمر ومنال نحصل بعد الاختزال على نفس النسبة، <strong><span class="ratio">2 : 3</span></strong>. لذلك <strong>النسب متساوية ويوجد بينها تناسب</strong>.<br>في سوار عبير النسبة هي <strong><span class="ratio">3 : 2</span></strong>، ولذلك فهي مختلفة <strong>ولا تتناسب</strong> مع باقي الأساور‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'في أساور نسرين، سمر ومنال نحصل بعد الاختزال على نفس النسبة، <strong><span class="ratio">2 : 3</span></strong>. لذلك <strong>النسب متساوية ويوجد بينها تناسب</strong>.<br>في سوار عبير النسبة هي <strong><span class="ratio">3 : 2</span></strong>، ولذلك فهي مختلفة <strong>ولا تتناسب</strong> مع باقي الأساور‎.' },
    },
  },
  {
    screen: 25, label: 'سؤال 5 من 6', type: 'value-input', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'standard', index: 5, total: 6 },
    stem: `طلب أديب وأشرف معًا طبق بيتزا كبيرًا مقسمًا إلى 8 قطع متساوية الحجم.<br>سعر طبق البيتزا هو <span class="money" dir="rtl">72 شيكل</span>.<br>أكل أديب 3 قطع بيتزا وأكل أشرف 5 قطع بيتزا.<br>أرادا تقسيم المبلغ بحيث يكون هناك تناسب بين عدد قطع البيتزا التي أكلها كل واحد منهما والمبلغ الذي سيدفعه.<br><br><strong>تظهر في الجدول 4 إمكانيات لتقسيم المبلغ بين أديب وأشرف.</strong><br><strong>حدّدوا إمكانية الدفع التي تحقق تناسبًا مع عدد قطع البيتزا، وأكملوا‎:</strong>`,
    content: PIZZA_TABLE,
    equation: {
      left: { top: '3', bottom: '5' },
      right: { top: { input: true, label: 'المبلغ الذي سيدفعه أديب' }, bottom: { input: true, label: 'المبلغ الذي سيدفعه أشرف' } },
    },
    correctInputs: ['27', '45'],
    hint: { body: 'احسبوا النسب المختزلة بين المبالغ، وحدّدوا الإمكانية التي نحصل فيها على نسبة مختزَلة متساوية‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'النسبة بين عدد قطع البيتزا التي أكلها أديب وعدد القطع التي أكلها أشرف هي <br><span class="ratio">5 : 3</span>، ولذلك يجب أن تُقسّم المبالغ التي سيدفعانها بحسب هذه النسبة‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'النسبة بين عدد قطع البيتزا التي أكلها أديب وعدد القطع التي أكلها أشرف هي <br><span class="ratio">5 : 3</span>، ولذلك يجب أن تُقسّم المبالغ التي سيدفعانها بحسب هذه النسبة‎.' },
    },
  },
  {
    screen: 26, label: 'سؤال 6 من 6', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'standard', index: 6, total: 6 },
    stem: `أ. تريد يارا رفع صورة إلى شبكة التواصل الاجتماعي.<br>النسبة المثالية للصورة هي 9 وحدات لعرض الصورة إلى 16 وحدة لارتفاع<br>الصورة - أي نسبة <span class="ratio">9 : 16</span>.<br>أبعاد صورة يارا الأصلية هي: العرض 36 سم والارتفاع 90 سم.<br><br><strong>اضغطوا على العدسة المكبرة، وكبّروا الصورة في التطبيق<br>إلى أبعاد صورة يارا، وحدّدوا – هل صورتها ملائمة للرفع؟</strong>`,
    content: appletEmbed('../unit-assets/applets/image-ratio-standard.html', 'تطبيق نسبة الصورة على الشاشة'),
    options: [
      { id: 'a', html: 'نعم' },
      { id: 'b', html: 'لا' },
      { id: 'c', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'b',
    hint: { body: 'افحصوا ما إذا كانت الصورة الناتجة مشوّهة أم أنها بتناسب صحيح‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'لكي تكون الصورة ملائمة، يجب أن تكون النسبة بين أبعاد الصورة <strong><span class="ratio">9 : 16</span></strong>.<br>النسبة بين أبعاد صورة يارا هي <strong><span class="ratio">36 : 90</span></strong>، وبعد الاختزال <strong><span class="ratio">2 : 5</span></strong>.<br>النسبتان غير متساويتين، ولذلك فالصورة غير ملائمة للرفع‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'لكي تكون الصورة ملائمة، يجب أن تكون النسبة بين أبعاد الصورة <strong><span class="ratio">9 : 16</span></strong>.<br>النسبة بين أبعاد صورة يارا هي <strong><span class="ratio">36 : 90</span></strong>، وبعد الاختزال <strong><span class="ratio">2 : 5</span></strong>.<br>النسبتان غير متساويتين، ولذلك فالصورة غير ملائمة للرفع‎.' },
    },
  },
  {
    screen: 27, label: 'سؤال 6 من 6', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'standard', index: 6, total: 6 },
    stem: `ب. تريد يارا قصّ الصورة بحيث تتلاءم أبعادها مع النسبة المثالية <span class="ratio">9 : 16</span>.<br>عرض صورة يارا هو 36 سم وارتفاعها هو 90 سم.<br><br><strong>استعينوا بالأداة على اليسار وحدّدوا –<br>كيف يجب أن تقص الصورة لتتلاءم مع النسبة المثالية؟</strong>`,
    content: appletEmbed('../unit-assets/applets/image-ratio-standard.html', 'تطبيق نسبة الصورة على الشاشة'),
    options: [
      { id: 'a', html: 'العرض 27 سم، الارتفاع 81 سم' },
      { id: 'b', html: 'العرض 36 سم، الارتفاع 64 سم' },
      { id: 'c', html: 'العرض 27 سم، الارتفاع 64 سم' },
      { id: 'd', html: 'العرض 36 سم، الارتفاع 81 سم' },
    ],
    correct: 'b',
    hint: { body: 'افحصوا الإمكانيات المختلفة لعرض وارتفاع الصورة، وتأكدوا أن الصورة الناتجة غير مشوّهة‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'لكي تكون الصورة ملائمة للستوري، يجب أن تكون متناسبة مع النسبة <span class="ratio">9 : 16</span>.<br>الأبعاد 36 سم × 64 سم فقط تعطي النسبة <span class="ratio">36 : 64</span>، التي تختزَل إلى <span class="ratio">9 : 16‏‎</span>.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'لكي تكون الصورة ملائمة للستوري، يجب أن تكون متناسبة مع النسبة <span class="ratio">9 : 16</span>.<br>الأبعاد 36 سم × 64 سم فقط تعطي النسبة <span class="ratio">36 : 64</span>، التي تختزَل إلى <span class="ratio">9 : 16‏‎</span>.' },
    },
  },

  /* ---------- basic practice (slides 36-43) ---------- */
  {
    screen: 29, label: 'سؤال 1 من 4', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'basic', index: 1, total: 4 },
    stem: `<strong>أ. ما هو التناسب؟</strong>`,
    content: ORANGE_BUBBLE('الأهم ألّا نخرج عن التناسب‎!'),
    options: [
      { id: 'a', html: 'نسبة مختزلة بين كميتين' },
      { id: 'b', html: 'مساواة بين نسبتين' },
      { id: 'c', html: 'فرق بين نسبتين' },
      { id: 'd', html: 'حاصل ضرب نسبتين' },
    ],
    correct: 'b',
    hint: { body: 'فيما يلي مثال على علاقة بين نسبتين تصف تناسبًا: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">4</span><span class="frac-bottom">6</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">3</span></span></span>' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'التناسب هو مساواة بين نسبتين.<br>مثلًا: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">9</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">3</span></span></span>.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'التناسب هو مساواة بين نسبتين.<br>مثلًا: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">9</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">3</span></span></span>.' },
    },
  },
  {
    screen: 30, label: 'سؤال 1 من 4', type: 'multi', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'basic', index: 1, total: 4 },
    stem: `<strong>ب. أي من المعادلات التالية تصف تناسبًا؟ اختاروا جميع الإجابات الصحيحة.</strong>`,
    content: ORANGE_BUBBLE('خسارة أنه ليس لدي إبهامان، وإلا لكنت أعطيتكم إعجابًا‎!'),
    options: [
      { id: 'a', html: '<span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">6</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">9</span></span></span>' },
      /* 07.09 — operators are spaced: 3 + 4 = 2 + 5, not 3+4 = 2+5. Safe to
         space these because they are EQUATIONS inside an LTR isolate; a
         ratio's colon must stay unspaced or bidi reverses it on screen. */
      { id: 'b', html: '<span class="ratio">3 + 4 = 2 + 5</span>' },
      { id: 'c', html: '<span class="ratio">7 − 3 = 6 − 2</span>' },
      { id: 'd', html: '<span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">24</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">8</span></span></span>' },
    ],
    correctSet: ['a', 'd'],
    hint: { body: 'التناسب هو مساواة بين نسبتين‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'التناسب هو مساواة بين نسبتين.<br><strong>في البند أ</strong> تظهر مساواة كهذه: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">6</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">9</span></span></span> — إذا اختزلنا النسبتين نحصل على أن كلتيهما تساويان النسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">3</span></span></span>.<br><strong>في البند ث</strong> تظهر مساواة بين النسبتين: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">24</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">8</span></span></span>.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'التناسب هو مساواة بين نسبتين.<br><strong>في البند أ</strong> تظهر مساواة كهذه: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">6</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">9</span></span></span> — إذا اختزلنا النسبتين نحصل على أن كلتيهما تساويان النسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">3</span></span></span>.<br><strong>في البند ث</strong> تظهر مساواة بين النسبتين: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">24</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">8</span></span></span>.' },
    },
  },
  {
    screen: 31, label: 'سؤال 2 من 4', type: 'value-input', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'basic', index: 2, total: 4 },
    stem: `على قنينة شراب مركّز بنكهة التوت، تظهر طريقة التحضير الموصى بها:<br>يجب خلط 1 لتر من الشراب المركّز مع 6 لترات من الماء.<br>أرادت لينا تحضير كمية أصغر من العصير، فخلطت كوبين من الشراب المركّز مع 12 كوبًا من الماء.<br><br><strong>أ. اكتبوا الإجابة الصحيحة:</strong><br>بحسب تعليمات التحضير الظاهرة على القنينة‎:`,
    content: SYRUP_IMG,
    ratioRows: [
      { label: 'النسبة الموصى بها بين كمية شراب التوت المركّز وكمية الماء باللترات هي', parts: 2 },
      { label: 'النسبة بين عدد أكواب شراب التوت المركّز وعدد أكواب الماء التي خلطتها لينا هي', parts: 2 },
    ],
    correctInputs: ['1', '6', '2', '12'],
    altInputs: [['1', '6', '1', '6']],
    hint: { body: 'النسبة بين كمية شراب التوت المركّز وكمية الماء تُكتَب على النحو التالي:<br>(كمية الماء) : (كمية شراب التوت المركّز)' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'انتبهوا إلى أن التمثيل بالكلمات يُقرأ من اليمين إلى اليسار، بينما التمثيل الرياضي يُقرأ من اليسار إلى اليمين. مثلًا: النسبة بين 2 وَ 7 تُكتب <span class="ratio">2 : 7</span>.<br>النسبة بين 1 لتر من الشراب المركّز وَ 6 لترات من الماء هي <span class="ratio">1 : 6</span>.<br>النسبة بين كوبين من الشراب المركّز وَ 12 كوبًا من الماء هي <span class="ratio">2 : 12</span>، أو <span class="ratio">1 : 6</span> إذا اختزلنا بـ 2‏‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'انتبهوا إلى أن التمثيل بالكلمات يُقرأ من اليمين إلى اليسار، بينما التمثيل الرياضي يُقرأ من اليسار إلى اليمين. مثلًا: النسبة بين 2 وَ 7 تُكتب <span class="ratio">2 : 7</span>.<br>النسبة بين 1 لتر من الشراب المركّز وَ 6 لترات من الماء هي <span class="ratio">1 : 6</span>.<br>النسبة بين كوبين من الشراب المركّز وَ 12 كوبًا من الماء هي <span class="ratio">2 : 12</span>، أو <span class="ratio">1 : 6</span> إذا اختزلنا بـ 2‏‎.' },
    },
  },
  {
    screen: 32, label: 'سؤال 2 من 4', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'basic', index: 2, total: 4 },
    stem: `على قنينة شراب مركّز بنكهة التوت، تظهر طريقة التحضير الموصى بها:<br>يجب خلط 1 لتر من الشراب المركّز مع 6 لترات من الماء.<br>أرادت لينا تحضير كمية أصغر من العصير، فخلطت كوبين من الشراب المركّز مع 12 كوبًا من الماء.<br><br><strong>ب. هل كان العصير الذي حضّرته لينا بنفس الطعم؟</strong><br>(أي، هل يوجد تناسب بين النسب؟)`,
    content: SYRUP_IMG,
    options: [
      { id: 'a', html: 'نعم' },
      { id: 'b', html: 'لا' },
      { id: 'c', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'a',
    hint: { body: 'لكي تحصل لينا على نفس طعم العصير بالضبط، يجب أن تكون النسبة بين كمية الشراب المركّز وكمية الماء في عصير لينا مساوية للنسبة بينهما كما تظهر على القنينة.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'النسبة بين كمية شراب التوت المركّز وكمية الماء التي خلطتها لينا هي <span class="ratio">2 : 12</span>. إذا اختزلنا بـ 2، سنحصل على نسبة <span class="ratio">1 : 6</span>.<br>حصلنا على مساواة بين نسبتين: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">6</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">12</span></span></span><br>وبما أن النسبتين متساويتان – فإن طعم عصير التوت الذي حضرته لينا مطابق للطعم الذي سنحصل عليه بحسب الوصفة الموصى بها على القنينة.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'النسبة بين كمية شراب التوت المركّز وكمية الماء التي خلطتها لينا هي <span class="ratio">2 : 12</span>. إذا اختزلنا بـ 2، سنحصل على نسبة <span class="ratio">1 : 6</span>.<br>حصلنا على مساواة بين نسبتين: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">6</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">2</span><span class="frac-bottom">12</span></span></span><br>وبما أن النسبتين متساويتان – فإن طعم عصير التوت الذي حضرته لينا مطابق للطعم الذي سنحصل عليه بحسب الوصفة الموصى بها على القنينة.' },
    },
  },
  {
    screen: 33, label: 'سؤال 3 من 4', type: 'multi', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'basic', index: 3, total: 4 },
    stem: `في تخصص الفنون، جرّب الطلاب خلط ألوان أكريليك وإنشاء درجات مختلفة من اللونين الأساسيين – الأحمر والأبيض.<br>خلط تامر <strong>3 ملاعق من اللون الأحمر </strong>مع <strong>4 ملاعق من اللون الأبيض</strong>.<br><br><strong>أ. أيٌّ من الطلاب خلطَ الألوان بنفس التناسُب الذي استخدمه تامر؟</strong><br><strong>استعينوا بالتطبيق لفحص أيّ كميات تعطي نفس اللون الذي حصل عليه تامر، واختاروا جميع الإجابات الصحيحة.</strong>`,
    content: appletEmbed('../unit-assets/applets/color-mixing-basic.html', 'تطبيق خلط الألوان'),
    options: [
      { id: 'a', html: 'خلطت حنان 4 ملاعق من اللون الأحمر مع 3 ملاعق من اللون الأبيض' },
      { id: 'b', html: 'خلطت أمل 6 ملاعق من اللون الأحمر مع 8 ملاعق من اللون الأبيض' },
      { id: 'c', html: 'خلط ساهر 9 ملاعق من اللون الأحمر مع 16 ملعقة من اللون الأبيض' },
      { id: 'd', html: 'خلط أمجد 12 ملعقة من اللون الأحمر مع 16 ملعقة من اللون الأبيض' },
    ],
    correctSet: ['b', 'd'],
    hint: { body: 'حاولوا تغيير عدد الملاعق في وعاء الطالب/ة الآخر/الأخرى وافحصوا – هل نحصل على نسب متساوية؟' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'النسبة بين كمية اللون الأحمر وكمية اللون الأبيض التي خلطها تامر هي <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span>.<br>للحفاظ على هذا التناسُب، فإنّ النسبة <strong>المختزلة</strong> بين كمية اللون الأحمر وكمية اللون الأبيض يجب أن تكون مساوية لـ <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span>.<br>خلطت أمل بنسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">8</span></span></span>. إذا اختزلنا بـ 2 سنحصل على النسبة المختزلة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span> ولذلك يتحقّق التناسُب: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">8</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span>.<br>خلط أمجد بنسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">16</span></span></span>. إذا اختزلنا بـ 4 سنحصل على النسبة المختزلة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span> ولذلك يتحقّق التناسُب: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">16</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span>.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'النسبة بين كمية اللون الأحمر وكمية اللون الأبيض التي خلطها تامر هي <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span>.<br>للحفاظ على هذا التناسُب، فإنّ النسبة <strong>المختزلة</strong> بين كمية اللون الأحمر وكمية اللون الأبيض يجب أن تكون مساوية لـ <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span>.<br>خلطت أمل بنسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">8</span></span></span>. إذا اختزلنا بـ 2 سنحصل على النسبة المختزلة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span> ولذلك يتحقّق التناسُب: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">8</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span>.<br>خلط أمجد بنسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">16</span></span></span>. إذا اختزلنا بـ 4 سنحصل على النسبة المختزلة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span> ولذلك يتحقّق التناسُب: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">16</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span>.' },
    },
  },
  {
    screen: 34, label: 'سؤال 4 من 4', type: 'value-input', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'basic', index: 4, total: 4 },
    stem: `في لعبة سباق سيارات، يجمع اللاعبون خلال السباق نوعين من عناصر التقوية: فطر التوربو وقشور الموز.<br><br><strong>أ. اكتبوا النسبة المختزلة بين عدد حبات فطر التوربو وعدد قشور الموز في كل مرحلة‎:</strong>`,
    content: RACING_IMG,
    /* deck slide 41 draws each answer as a fraction — a numerator box above a
       bar above a denominator box — not as `[input] : [input]`. Slot order is
       still numerator-then-denominator per row, so correctInputs is unchanged. */
    ratioRows: [
      { label: 'المرحلة 1 – مسار قوس القزح', frac: true },
      { label: 'المرحلة 2 – القلعة الغامضة', frac: true },
    ],
    correctInputs: ['3', '4', '3', '4'],
    hint: { body: 'نكتب النسبة بحسب ترتيب ظهور الكلمات في السؤال: فطر التوربو في البسط، وقشور الموز في المقام.<br>للوصول إلى النسبة المختزلة، ابحثوا عن عدد يقسم كمية الفطر وكمية قشور الموز بدون باقٍ (عامل الاختزال).' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: '<span class="fb-p">في المرحلة 1 - النسبة بين عدد حبات فطر التوربو وعدد قشور الموز التي جُمعت هي <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">16</span></span></span></span><span class="fb-p">إذا اختزلنا البسط والمقام بـ 4<br>سنحصل على النسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span></span><span class="fb-p">في المرحلة 2 - النسبة بين عدد حبات فطر التوربو وعدد قشور الموز التي جُمعت هي <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">15</span><span class="frac-bottom">20</span></span></span></span><span class="fb-p">إذا اختزلنا البسط والمقام بـ 5 سنحصل على النسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span></span>' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: '<span class="fb-p">في المرحلة 1 - النسبة بين عدد حبات فطر التوربو وعدد قشور الموز التي جُمعت هي <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">16</span></span></span></span><span class="fb-p">إذا اختزلنا البسط والمقام بـ 4<br>سنحصل على النسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span></span><span class="fb-p">في المرحلة 2 - النسبة بين عدد حبات فطر التوربو وعدد قشور الموز التي جُمعت هي <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">15</span><span class="frac-bottom">20</span></span></span></span><span class="fb-p">إذا اختزلنا البسط والمقام بـ 5 سنحصل على النسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span></span>' },
    },
  },
  {
    screen: 35, label: 'سؤال 4 من 4', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'basic', index: 4, total: 4 },
    stem: `في لعبة سباق سيارات، يجمع اللاعبون خلال السباق نوعين من عناصر التقوية: فطر التوربو وقشور الموز.<br><br><strong>ب. هل يوجد تناسب بين عدد حبات فطر التوربو وعدد قشور الموز التي جُمعت في كل واحدة من المراحل؟</strong>`,
    content: RACING_IMG,
    options: [
      { id: 'a', html: 'نعم' },
      { id: 'b', html: 'لا' },
      { id: 'c', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'a',
    hint: { body: 'التناسب هو مساواة بين نسبتين. هل حصلنا على مساواة كهذه؟' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'في البند أ وجدنا أن النسبة المختزلة بين عدد حبات فطر التوربو وعدد قشور الموز التي جُمعت في كل مرحلة هي <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span>.<br>وبما أن النسبتين متساويتان — يوجد تناسب‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'في البند أ وجدنا أن النسبة المختزلة بين عدد حبات فطر التوربو وعدد قشور الموز التي جُمعت في كل مرحلة هي <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">3</span><span class="frac-bottom">4</span></span></span>.<br>وبما أن النسبتين متساويتان — يوجد تناسب‎.' },
    },
  },
  {
    screen: 36, label: 'سؤال 4 من 4', type: 'value-input', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'basic', index: 4, total: 4 },
    stem: `في لعبة سباق سيارات، يجمع اللاعبون خلال السباق نوعين من عناصر التقوية: فطر التوربو وقشور الموز.<br><br><strong>ت. رأينا أن هناك تناسبًا بين عدد حبات فطر التوربو وعدد قشور الموز التي جُمعت في كل مرحلة.<br>أكملوا التناسب‎:</strong>`,
    content: RACING_IMG,
    equation: {
      left: { top: '12', bottom: { input: true, label: 'قشور الموز في المرحلة 1' } },
      right: { top: '15', bottom: { input: true, label: 'قشور الموز في المرحلة 2' } },
    },
    correctInputs: ['16', '20'],
    hint: { body: 'عودوا إلى شاشة اللعبة وافحصوا: أيّ عنصر (فطر / موز) يمثل العدد 12 في المرحلة 1، وأي عنصر يمثل العدد 15 في المرحلة 2؟<br>جدوا الكمية الملائمة للعنصر الثاني في كل مرحلة، وأكملوا النسب‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: '<span class="fb-p">لننظر إلى الأعداد المعطاة لنا في بسطَي الكسرين: العدد 12 يمثل كمية حبات فطر التوربو في المرحلة 1، والعدد 15 يمثل كمية حبات فطر التوربو في المرحلة 2.</span><span class="fb-p">من هنا نستنتج أن الكسر يمثل النسبة: <span class="fraction fr-words"><span class="frac-top">عدد حبات فطر التوربو</span><span class="frac-bottom">عدد قشور الموز</span></span></span><span class="fb-p">نلائِم لكل مرحلة كمية قشور الموز التي جُمعت فيها ونكتبها في المقام: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">16</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">15</span><span class="frac-bottom">20</span></span></span>.</span>' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: '<span class="fb-p">لننظر إلى الأعداد المعطاة لنا في بسطَي الكسرين: العدد 12 يمثل كمية حبات فطر التوربو في المرحلة 1، والعدد 15 يمثل كمية حبات فطر التوربو في المرحلة 2.</span><span class="fb-p">من هنا نستنتج أن الكسر يمثل النسبة: <span class="fraction fr-words"><span class="frac-top">عدد حبات فطر التوربو</span><span class="frac-bottom">عدد قشور الموز</span></span></span><span class="fb-p">نلائِم لكل مرحلة كمية قشور الموز التي جُمعت فيها ونكتبها في المقام: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">16</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">15</span><span class="frac-bottom">20</span></span></span>.</span>' },
    },
  },

  /* ---------- standard practice B (slides 45-49) ---------- */
  {
    screen: 38, label: 'تمرين قياسي ب – سؤال 1 من 2', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'standard-b', index: 1, total: 2 },
    stem: `راديو 106FM هو راديو تعليمي يديره طلاب تخصص الإعلام.<br>في قائمة تشغيل الراديو (بلاي ليست)، يحرصون على أن تكون النسبة بين عدد الأغاني العبرية وعدد الأغاني الأجنبية <span class="ratio">3 : 1</span>.<br><br><strong>في أيٍّ من قوائم التشغيل التالية يوجد تناسُب مع هذه النسبة؟</strong>`,
    content: `<img class="content-img" src="../unit-assets/img/radio-hosts.jpeg" alt="مذيعان شباب في ستوديو إذاعي">`,
    options: [
      { id: 'a', html: '10‏‎ ‎أغانٍ بالعبرية، 6 أغانٍ أجنبية' },
      { id: 'b', html: '12‏‎ ‎أغنية بالعبرية، 8 أغانٍ أجنبية' },
      { id: 'c', html: '15‏‎ ‎أغنية بالعبرية، 5 أغانٍ أجنبية' },
      { id: 'd', html: '18‏‎ ‎أغنية بالعبرية، 9 أغانٍ أجنبية' },
    ],
    correct: 'c',
    hint: { body: 'احسبوا النسبة المختزلة بين عدد الأغاني بالعبرية وعدد الأغاني الأجنبية، وافحصوا في أي قائمة نحصل على نسبة مساوية لـ <span class="ratio">3 : 1</span>.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'في القائمة التي تحتوي على 15 أغنية بالعبرية وَ 5 أغانٍ أجنبية – النسبة هي <strong><span class="ratio">15 : 5</span>، </strong>وبعد الاختزال بـ 5 نحصل على النسبة <strong><span class="ratio">3 : 1</span></strong>.<br>النسبتان متساويتان، ولذلك يوجد تناسب‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'في القائمة التي تحتوي على 15 أغنية بالعبرية وَ 5 أغانٍ أجنبية – النسبة هي <strong><span class="ratio">15 : 5</span>، </strong>وبعد الاختزال بـ 5 نحصل على النسبة <strong><span class="ratio">3 : 1</span></strong>.<br>النسبتان متساويتان، ولذلك يوجد تناسب‎.' },
    },
  },
  {
    screen: 39, label: 'تمرين قياسي ب – سؤال 2 بند أ من 2', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'standard-b', index: 2, total: 2 },
    stem: `<span class="fb-p">حصل أعضاء حركة الشبيبة على مكنسة كهربائية كهدية من الطلاب خريجي الصف الثاني عشر،<br>لكي تساعدهم على تنظيف الفرع في نهاية كل فعالية.</span><span class="fb-p">في تعليمات الشركة المصنّعة مكتوب:<br>مقابل كل 4 لترات من الماء، يجب إضافة 20 مليلترًا (ملل) من سائل التنظيف.<br>ما هي النسبة بين كمية سائل التنظيف وكمية الماء؟</span><span class="fb-p">ادّعى شادي أن النسبة بين كمية سائل التنظيف وكمية الماء هي <span class="ratio">20 : 4</span>، وإذا اختزلنا النسبة بـ 4 سنحصل على النسبة <span class="ratio">5 : 1</span>.<br>ادّعت عبير أن النسبة بين كمية سائل التنظيف وكمية الماء هي <span class="ratio">20 : 4,000</span>، وإذا اختزلنا بـ 20 سنحصل على النسبة <span class="ratio">1 : 200</span></span><span class="fb-p"><strong>أ. مَن مِنهما على صواب؟</strong></span>`,
    content: `<img class="content-img s39-photo" src="../unit-assets/img/teens-cleaning.jpeg" alt="أعضاء حركة الشبيبة ينظفون الفرع بواسطة مكنسة كهربائية">`
      + POPUP_BUBBLE(39, 'اضغطوا عليّ لتذكيركم بتحويل وحدات القياس'),
    popup: {
      inBubble: true,
      trigger: 'اضغطوا عليّ لتذكيركم بتحويل وحدات القياس',
      title: 'انتبهوا',
      body: 'في حسابات النسبة والتناسب بين الكميات، يجب قياس الكميات بنفس وحدات القياس.<br>اللتر والمليلتر هما وحدتا حجم.<br><strong>1,000 مليلتر = 1 لتر</strong><br>مثلًا - كوب قياس عادي في إسرائيل يحتوي على 250 ملل، ولذلك من المتّبع القول في إسرائيل إن اللتر الواحد يساوي 4 أكواب. (في الولايات المتحدة يحتوي الكوب العادي على كمية مختلفة من المليلترات).<img class="popup-character" src="../unit-assets/img/character-orange-heart.png" alt="الشخصية تمسك قلبًا">',
    },
    options: [
      { id: 'a', html: 'شادي' },
      { id: 'b', html: 'عبير' },
    ],
    correct: 'b',
    hint: { body: 'فكروا: مَن مِنهما قاس النسبة بنفس وحدات القياس؟' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: '<span class="fb-p">قبل حساب النسبة بين الكميات، من المهم التأكد من أننا نقيسها بنفس وحدات القياس.</span><span class="fb-p">قارن شادي بين 20 ملل وَ 4 لترات،<br>ولذلك لا يمكن اختزال النسبة بالطريقة التي استخدمها.</span><span class="fb-p">أما عبير فحوّلت أولًا 4 لترات إلى 4,000 ملل، ولذلك حصلت على النسبة <span class="ratio">20 : 4,000</span></span><span class="fb-p">وبعد الاختزال بـ 20 حصلت على النسبة <span class="ratio">1 : 200</span></span><span class="fb-p">أي، مقابل كل 1 ملل من سائل التنظيف<br>يوجد 200 ملل من الماء‎.</span>' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: '<span class="fb-p">قبل حساب النسبة بين الكميات، من المهم التأكد من أننا نقيسها بنفس وحدات القياس.</span><span class="fb-p">قارن شادي بين 20 ملل وَ 4 لترات،<br>ولذلك لا يمكن اختزال النسبة بالطريقة التي استخدمها.</span><span class="fb-p">أما عبير فحوّلت أولًا 4 لترات إلى 4,000 ملل، ولذلك حصلت على النسبة <span class="ratio">20 : 4,000</span></span><span class="fb-p">وبعد الاختزال بـ 20 حصلت على النسبة <span class="ratio">1 : 200</span></span><span class="fb-p">أي، مقابل كل 1 ملل من سائل التنظيف<br>يوجد 200 ملل من الماء‎.</span>' },
    },
  },
  {
    screen: 40, label: 'تمرين قياسي ب – سؤال 2 بند ب من 2', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'standard-b', index: 2, total: 2 },
    stem: `<span class="fb-p">حصل أعضاء حركة الشبيبة على مكنسة كهربائية كهدية من الطلاب خريجي الصف الثاني عشر،<br>لكي تساعدهم على تنظيف الفرع في نهاية كل فعالية.</span><span class="fb-p">في تعليمات الشركة المصنّعة مكتوب:<br>مقابل كل 4 لترات من الماء، يجب إضافة 20 مليلترًا (ملل) من سائل التنظيف.<br>ما هي النسبة بين كمية سائل التنظيف وكمية الماء؟</span><span class="fb-p">وجدنا أن النسبة المختزلة بين كمية الماء وكمية سائل التنظيف<br>يجب أن تكون <span class="ratio">1 : 200</span>.<br>ملأ وائل، مرشد المجموعة، خزان المكنسة بـ 5 لترات من الماء وأضاف 25 ملل من سائل التنظيف.</span><span class="fb-p"><strong>ب. هل حافظ وائل على التناسب بين كمية الماء وكمية سائل التنظيف كما حددت الشركة المصنّعة؟</strong></span>`,
    content: `<img class="content-img" src="../unit-assets/img/filling-vacuum.jpeg" alt="وائل يملأ خزان المكنسة الكهربائية">`,
    options: [
      { id: 'a', html: 'نعم' },
      { id: 'b', html: 'لا' },
      { id: 'c', html: 'لا يمكن معرفة ذلك' },
    ],
    correct: 'a',
    hint: { body: 'احسبوا النسبة المختزلة بين كمية الماء وكمية السائل التي وضعها وائل في خزان المكنسة، وافحصوا هل هي مساوية للنسبة التي حددتها الشركة المصنّعة. تذكروا، عند حساب التناسب بين الكميات، أنه يجب قياس الكميات بنفس وحدات القياس.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: '<span class="fb-p">1‏‎ ‎لتر يساوي 1,000 ملل، ولذلك 5 لترات تساوي 5,000 ملل</span><span class="fb-p">النسبة بين كمية الماء وكمية سائل التنظيف التي وضعها وائل في خزان المكنسة هي <span class="ratio">5,000 : 25</span><br>وبعد الاختزال بـ 25 نحصل على النسبة المختزلة <span class="ratio">200 : 1</span></span><span class="fb-p">حصلنا على مساواة بين النسبتين، ولذلك يوجد تناسب‎.</span>' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: '<span class="fb-p">1‏‎ ‎لتر يساوي 1,000 ملل، ولذلك 5 لترات تساوي 5,000 ملل</span><span class="fb-p">النسبة بين كمية الماء وكمية سائل التنظيف التي وضعها وائل في خزان المكنسة هي <span class="ratio">5,000 : 25</span><br>وبعد الاختزال بـ 25 نحصل على النسبة المختزلة <span class="ratio">200 : 1</span></span><span class="fb-p">حصلنا على مساواة بين النسبتين، ولذلك يوجد تناسب‎.</span>' },
    },
  },

  /* ---------- advanced practice (slides 56-64) ---------- */
  {
    screen: 45, label: 'تمرين متقدّم - سؤال 1 من 5', type: 'multi', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'advanced', index: 1, total: 5 },
    stem: `في درس تخصص الطب البيطري، تعلّم الطلاب عن وتيرة نمو الكلاب.<br>أمامكم تطبيق يحتوي على معطيات معدل وزن جراء الكلاب والكلاب البالغة، لسلالات مختلفة.<br><strong>املؤوا النسب بين الأوزان، وحدّدوا جميع السلالات التي يوجد فيها تناسب بين وزن الجرو ووزن الكلب البالغ‎.</strong>`,
    content: appletEmbed('../unit-assets/applets/dogs-ratios.html', 'تطبيق وتيرة نمو الكلاب'),
    options: [
      { id: 'a', html: 'داكسهند' },
      { id: 'b', html: 'لابرادور' },
      { id: 'c', html: 'الراعي البلجيكي' },
      { id: 'd', html: 'بينشر' },
      { id: 'e', html: 'بوردر كولي' },
    ],
    correctSet: ['a', 'b', 'c', 'e'],
    hint: { body: 'استعينوا بالجدول لحساب النسبة بين وزن الجرو ووزن الكلب البالغ‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'بعد اختزال النسب نحصل على نسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">3</span></span></span> بين الأوزان في جميع السلالات <strong>ما عدا البينشر‎.</strong>' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'بعد اختزال النسب نحصل على نسبة <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">3</span></span></span> بين الأوزان في جميع السلالات <strong>ما عدا البينشر‎.</strong>' },
    },
  },
  {
    screen: 46, label: 'تمرين متقدّم - سؤال 2 بند أ من 5', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'advanced', index: 2, total: 5 },
    stem: `استعدادًا لمسابقة إقليمية للشبيبة في ألعاب القوى، يفحص المدرب معطيات رياضيين أتوا من ثلاث مجموعات تدريب في المدينة.<br>ينقسم الرياضيون إلى نوعين: <br>عداؤون لمسافات قصيرة (سبرينترز) وعداؤون لمسافات طويلة.<br><br><strong>أ. بين أي مجموعات يوجد تناسب بين عدد العدائين لمسافات قصيرة وعدد العدائين لمسافات طويلة؟</strong>`,
    content: `__ATH__`,
    options: [
      { id: 'a', html: 'المجموعة 1 والمجموعة 2' },
      { id: 'b', html: 'المجموعة 1 والمجموعة 3' },
      { id: 'c', html: 'المجموعة 2 والمجموعة 3' },
      { id: 'd', html: 'لا يوجد تناسب بين المجموعات' },
    ],
    correct: 'd',
    hint: { body: 'لكل مجموعة - احسبوا النسبة بين عدد العدائين لمسافات قصيرة وعدد العدائين لمسافات طويلة، وافحصوا – هل توجد مساواة بين النسب‎؟' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'في المجموعة 1 – النسبة هي <span class="ratio">12 : 18</span> وبعد الاختزال <span class="ratio">2 : 3</span>.<br>في المجموعة 2 – النسبة هي <span class="ratio">16 : 16</span> وبعد الاختزال <span class="ratio">1 : 1</span>.<br>في المجموعة 3 – النسبة هي <span class="ratio">18 : 12</span> وبعد الاختزال <span class="ratio">3 : 2</span>.<br>لا توجد مساواة بين أيٍّ من النسب، ولذلك لا يوجد تناسب بين المجموعات‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'في المجموعة 1 – النسبة هي <span class="ratio">12 : 18</span> وبعد الاختزال <span class="ratio">2 : 3</span>.<br>في المجموعة 2 – النسبة هي <span class="ratio">16 : 16</span> وبعد الاختزال <span class="ratio">1 : 1</span>.<br>في المجموعة 3 – النسبة هي <span class="ratio">18 : 12</span> وبعد الاختزال <span class="ratio">3 : 2</span>.<br>لا توجد مساواة بين أيٍّ من النسب، ولذلك لا يوجد تناسب بين المجموعات‎.' },
    },
  },
  {
    screen: 47, label: 'تمرين متقدّم - سؤال 2 بند ب من 5', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'advanced', index: 2, total: 5 },
    stem: `استعدادًا لمسابقة إقليمية للشبيبة في ألعاب القوى، يفحص المدرب معطيات رياضيين أتوا من ثلاث مجموعات تدريب في المدينة.<br>ينقسم الرياضيون إلى نوعين: <br>عداؤون لمسافات قصيرة (سبرينترز) وعداؤون لمسافات طويلة.<br><strong>ب. قرر المدرب الرئيسي دمج جميع الرياضيين في منتخب ألعاب القوى البلدي.</strong><br><strong>في أي مجموعة تساوي النسبة بين عدد العدائين لمسافات قصيرة وعدد العدائين لمسافات طويلة نسبتهم في المنتخب البلدي؟</strong>`,
    content: `__ATH__`,
    options: [
      { id: 'a', html: 'المجموعة 1' },
      { id: 'b', html: 'المجموعة 2' },
      { id: 'c', html: 'المجموعة 3' },
      { id: 'd', html: 'ولا أيّ مجموعة' },
    ],
    correct: 'b',
    hint: { body: 'احسبوا أولًا عدد جميع العدائين لمسافات قصيرة وعدد جميع العدائين لمسافات طويلة في المنتخب البلدي‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: '<span class="fb-p">في المنتخب البلدي يوجد<br> 46 عداءً لمسافات قصيرة<br>وَ 46 عداءً لمسافات طويلة.</span><span class="fb-p">النسبة هي <strong><span class="ratio">46:46</span></strong>، وبعد الاختزال <strong><span class="ratio">1 : 1</span></strong>، مثل النسبة الموجودة في المجموعة 2‏‎.</span>' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: '<span class="fb-p">في المنتخب البلدي يوجد<br> 46 عداءً لمسافات قصيرة<br>وَ 46 عداءً لمسافات طويلة.</span><span class="fb-p">النسبة هي <strong><span class="ratio">46:46</span></strong>، وبعد الاختزال <strong><span class="ratio">1 : 1</span></strong>، مثل النسبة الموجودة في المجموعة 2‏‎.</span>' },
    },
  },
  {
    screen: 49, label: 'تمرين متقدّم - سؤال 3 من 5', type: 'dropdown', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'advanced', index: 3, total: 5 },
    /* deck slide 60: the instruction is REGULAR (no b="1"); the applet note and
       the companion live in the left column, and the callout beside the
       companion IS the applet trigger. The ratio table and the gym photo belong
       to the previous slide (59 / screen 48), not here. */
    stem: `في الجدول معطاة عدة تمارين، وأزمنة العمل والراحة لكل واحد منها. اختاروا لكل تمرين نوع التدريب بحسب التناسب الملائم بين زمن العمل وزمن الراحة‎.`,
    content: `<p class="gym-applet-note">لديكم تطبيق يمكنكم فيه تحويل الدقائق إلى ثوانٍ – لكي يصبح الحساب أسهل‎.</p>`
      + GYM_RATIO_TABLE
      + POPUP_BUBBLE(49, 'اضغطوا عليّ لفتح التطبيق'),
    sentence: EX_TABLE_PARTS,
    blanks: [
      { pool: TRAINING_POOL, correct: 'تدريب فتري عالي الشدة' },
      { pool: TRAINING_POOL, correct: 'تدريب فتري معتدل' },
      { pool: TRAINING_POOL, correct: 'بناء الكتلة العضلية' },
      { pool: TRAINING_POOL, correct: 'بناء الكتلة العضلية' },
      { pool: TRAINING_POOL, correct: 'تدريب فتري عالي الشدة' },
    ],
    popup: {
      inBubble: true,
      trigger: 'اضغطوا عليّ لفتح التطبيق',
      title: 'تطبيق لتحويل الدقائق إلى ثوانٍ',
      body: appletEmbed('../unit-assets/applets/minutes-to-seconds.html', 'تطبيق تحويل الدقائق إلى ثوانٍ'),
    },
    hint: { body: 'احسبوا النسبة بين زمن العمل وزمن الراحة لكل تمرين لياقة في الجدول، وطابقوا كل تمرين مع نوع التدريب الذي فيه تناسُب ملائم‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: '<span class="fb-p">نجحتم في تحديد جميع أنواع التدريبات بشكل صحيح.</span><span class="fb-p">مرفق في الجدول النسب بين زمن العمل وزمن الراحة في كل تمرين ونوع التدريب الملائم لهذه النسبة‎.</span>' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'مرفق في الجدول النسب بين زمن العمل وزمن الراحة في كل تمرين ونوع التدريب الملائم لهذه النسبة‎.' },
    },
  },
  {
    screen: 50, label: 'تمرين متقدّم - سؤال 4 من 5', type: 'statement', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'advanced', index: 4, total: 5 },
    stem: `<strong>معطى المثلثان التاليان (الأطوال بالسنتيمترات).</strong><br>اختاروا صحيح / غير صحيح‎ في كل عبارة:`,
    /* 17.09, producer: the thumbnail of screen 49's answered table is removed —
       the two triangles are the whole of this screen's artwork now. */
    content: `<div class="tri-row">${TRIANGLES_SVG}</div>`,
    statements: [
      { text: 'يوجد تناسب بين طول الارتفاع وطول الضلع الملائم له في كل واحد من المثلثين', correct: true },
      { text: 'يوجد تناسب بين مساحة المثلث وطول الضلع المعطى في كل واحد من المثلثين', correct: false },
      { text: 'يوجد تناسب بين مساحة المثلث وطول الارتفاع المعطى في كل واحد من المثلثين', correct: false },
    ],
    hint: { body: 'مساحة المثلث = (طول الضلع × الارتفاع) ÷ 2.<br>احسبوا النسبة بين طول الارتفاع وطول الضلع الملائم في المثلث أ وأيضًا في المثلث ب، وافحصوا ما إذا كانت هناك مساواة بين النسب في المثلثين‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'نستخدم الجدول لترتيب المعطيات وفحص صحة العبارات:<br>نحسب مساحتَي المثلثين:<br>مساحة المثلث أ: <span class="fracpair">(12 × 5) ÷ 2 = <span class="eq-unit" dir="rtl">30 سم مربع</span></span><br>مساحة المثلث ب: <span class="fracpair">(36 × 15) ÷ 2 = <span class="eq-unit" dir="rtl">270 سم مربع</span></span><br><table class="data-table"><thead><tr><th>النسبة</th><th>المثلث أ</th><th>المثلث ب</th><th>هل يوجد تناسب؟</th></tr></thead><tbody><tr><td><span class="ratio-label">ارتفاع : ضلع</span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">5</span><span class="frac-bottom">12</span></span></span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">15</span><span class="frac-bottom">36</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">5</span><span class="frac-bottom">12</span></span></span></td><td>نعم</td></tr><tr><td><span class="ratio-label">مساحة : ضلع</span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">30</span><span class="frac-bottom">12</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">5</span><span class="frac-bottom">2</span></span></span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">270</span><span class="frac-bottom">36</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">15</span><span class="frac-bottom">2</span></span></span></td><td>لا</td></tr><tr><td><span class="ratio-label">مساحة : ارتفاع</span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">30</span><span class="frac-bottom">5</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">1</span></span></span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">270</span><span class="frac-bottom">15</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">18</span><span class="frac-bottom">1</span></span></span></td><td>لا</td></tr></tbody></table>' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'نستخدم الجدول لترتيب المعطيات وفحص صحة العبارات:<br>نحسب مساحتَي المثلثين:<br>مساحة المثلث أ: <span class="fracpair">(12 × 5) ÷ 2 = <span class="eq-unit" dir="rtl">30 سم مربع</span></span><br>مساحة المثلث ب: <span class="fracpair">(36 × 15) ÷ 2 = <span class="eq-unit" dir="rtl">270 سم مربع</span></span><br><table class="data-table"><thead><tr><th>النسبة</th><th>المثلث أ</th><th>المثلث ب</th><th>هل يوجد تناسب؟</th></tr></thead><tbody><tr><td><span class="ratio-label">ارتفاع : ضلع</span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">5</span><span class="frac-bottom">12</span></span></span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">15</span><span class="frac-bottom">36</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">5</span><span class="frac-bottom">12</span></span></span></td><td>نعم</td></tr><tr><td><span class="ratio-label">مساحة : ضلع</span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">30</span><span class="frac-bottom">12</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">5</span><span class="frac-bottom">2</span></span></span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">270</span><span class="frac-bottom">36</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">15</span><span class="frac-bottom">2</span></span></span></td><td>لا</td></tr><tr><td><span class="ratio-label">مساحة : ارتفاع</span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">30</span><span class="frac-bottom">5</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">1</span></span></span></td><td><span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">270</span><span class="frac-bottom">15</span></span> <span class="fr-eq">=</span> <span class="fraction fr-inline"><span class="frac-top">18</span><span class="frac-bottom">1</span></span></span></td><td>لا</td></tr></tbody></table>' },
    },
  },
  {
    screen: 51, label: 'تمرين متقدّم - سؤال 5 من 5', type: 'dropdown', maxAttempts: 1, hintPolicy: 'always',
    step: { group: 'advanced', index: 5, total: 5 },
    stem: `<strong>حدّدوا ما إذا كان هناك تناسب بين النسبة‎ A ‎والنسبة B:</strong>`,
    content: null,
    sentence: RATIO_PAIRS_PARTS,
    blanks: [
      { pool: ['نعم', 'لا'], correct: 'نعم' },
      { pool: ['نعم', 'لا'], correct: 'لا' },
      { pool: ['نعم', 'لا'], correct: 'نعم' },
      { pool: ['نعم', 'لا'], correct: 'نعم' },
    ],
    hint: { body: 'حاولوا ضرب إحدى النسب في كسر، مثلًا في <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1</span><span class="frac-bottom">2</span></span></span>.<br>وإذا لم يكن ذلك ممكنًا، اختزلوا الكسور أولًا‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: '<span class="fb-eqgrid"><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">4</span><span class="frac-bottom">4.5</span></span></span><span class="fb-eqop">=</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">8</span><span class="frac-bottom">9</span></span></span><span class="fb-eqnote">— يوجد تناسب.</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">21</span><span class="frac-bottom">36</span></span></span><span class="fb-eqop">≠</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">8</span></span></span><span class="fb-eqnote">— لا يوجد تناسب.</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">20</span></span></span><span class="fb-eqop">=</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">9</span><span class="frac-bottom">15</span></span></span><span class="fb-eqnote">— يوجد تناسب.</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">17.5</span><span class="frac-bottom">25</span></span></span><span class="fb-eqop">=</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">7</span><span class="frac-bottom">10</span></span></span><span class="fb-eqnote">— يوجد تناسب.</span></span>' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: '<span class="fb-eqgrid"><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">4</span><span class="frac-bottom">4.5</span></span></span><span class="fb-eqop">=</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">8</span><span class="frac-bottom">9</span></span></span><span class="fb-eqnote">— يوجد تناسب.</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">21</span><span class="frac-bottom">36</span></span></span><span class="fb-eqop">≠</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">6</span><span class="frac-bottom">8</span></span></span><span class="fb-eqnote">— لا يوجد تناسب.</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">12</span><span class="frac-bottom">20</span></span></span><span class="fb-eqop">=</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">9</span><span class="frac-bottom">15</span></span></span><span class="fb-eqnote">— يوجد تناسب.</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">17.5</span><span class="frac-bottom">25</span></span></span><span class="fb-eqop">=</span><span class="fb-eqcell"><span class="fraction fr-inline"><span class="frac-top">7</span><span class="frac-bottom">10</span></span></span><span class="fb-eqnote">— يوجد تناسب.</span></span>' },
    },
  },

  /* ---------- peak question (slides 68-76) — PENDING FINAL APPROVAL
       (slide 67: "אפשר להפיק עד לכאן – שאלת שיא אעדכן במייל") ---------- */
  {
    screen: 54, label: 'السؤال الأكبر – بند أ', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'peak', index: 1, total: 4, labels: PEAK_STEP_LABELS },
    stem: `في عام 2025 نُشرت المعطيات التالية:<br>خلال الدرس طُرح السؤال التالي: هل يوجد تناسب بين عدد السكان والمساحة في هاتين المدينتين؟<br><br><strong>ادّعت أمل:</strong> "إذا كان عدد السكان في القدس أكبر بـ 8 أضعاف تقريبًا من عدد السكان في حيفا، ومساحة المدينة أكبر بـ 4 أضعاف فقط تقريبًا، فإن الكثافة السكانية في القدس هي ضعفا الكثافة في حيفا تقريبًا. ومن هنا لا يوجد تناسب بين النسب".<br><br><strong>ادّعى عماد:</strong> "لا يوجد تناسب بين النسب. الكثافة السكانية في القدس هي ضعفا الكثافة السكانية في حيفا تقريبًا. يمكن رؤية ذلك من خلال الحساب: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1,060,000</span><span class="frac-bottom">126</span></span> <span class="fr-eq">≠</span> <span class="fraction fr-inline"><span class="frac-top">285,000</span><span class="frac-bottom">67</span></span></span> وبعد الاختزال: <span class="ratio">8,413 ≠ 4,254</span>."<br><br><strong>مَن مِنهما على صواب؟</strong>`,
    content: CITIES_TABLE,
    options: [
      { id: 'a', html: 'أمل' },
      { id: 'b', html: 'عماد' },
      { id: 'c', html: 'كِلاهما على صواب' },
    ],
    correct: 'c',
    hint: { body: 'افحصوا المعطيات بطريقتين: قارنوا النسبة بين عدد السكان ومساحة المدينة، وافحصوا أيضًا ما إذا تم الحفاظ على النسب بين أعداد السكان وبين مساحات المدينتين‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'أمل وعماد كلاهما على صواب.<br>أمل على صواب لأن النسب بين أعداد السكان وبين مساحات المدينتين غير محفوظة، ولذلك لا يوجد تناسب.<br>وعماد على صواب لأن حساب الكثافة السكانية يعطي قيمًا مختلفة: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1,060,000</span><span class="frac-bottom">126</span></span> <span class="fr-eq">≠</span> <span class="fraction fr-inline"><span class="frac-top">285,000</span><span class="frac-bottom">67</span></span></span>، ولذلك فإن الكثافة السكانية في القدس ليست ضعف الكثافة في حيفا‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'أمل وعماد كلاهما على صواب.<br>أمل على صواب لأن النسب بين أعداد السكان وبين مساحات المدينتين غير محفوظة، ولذلك لا يوجد تناسب.<br>وعماد على صواب لأن حساب الكثافة السكانية يعطي قيمًا مختلفة: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1,060,000</span><span class="frac-bottom">126</span></span> <span class="fr-eq">≠</span> <span class="fraction fr-inline"><span class="frac-top">285,000</span><span class="frac-bottom">67</span></span></span>، ولذلك فإن الكثافة السكانية في القدس ليست ضعف الكثافة في حيفا‎.' },
    },
  },
  {
    screen: 56, label: 'السؤال الأكبر – بند ب', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'peak', index: 2, total: 4, labels: PEAK_STEP_LABELS },
    stem: `تذكير: المدينة أ 50 كم مربع، المدينة ب 125 كم مربع.<br><br><strong>أي من الإمكانيات التالية يمكن أن تلائم عدد السكان في كل مدينة؟</strong>`,
    content: null,
    options: [
      { id: 'a', html: 'المدينة أ: 3,500 | المدينة ب: 7,000' },
      { id: 'b', html: 'المدينة أ: 2,000 | المدينة ب: 5,000' },
      { id: 'c', html: 'المدينة أ: 1,000 | المدينة ب: 3,000' },
      { id: 'd', html: 'المدينة أ: 4,000 | المدينة ب: 6,500' },
    ],
    correct: 'b',
    hint: { body: 'إذا كانت الكثافة متساوية، فإن عدد السكان يكبر أو يصغر بنفس مُعامل المساحة‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'كبُرَت المساحة بـ 2.5 مرة، ولذلك يجب أن يكبر عدد السكان أيضًا بـ 2.5 مرة.<br>الإمكانية الوحيدة التي تحقق زيادة بـ 2.5 مرة في عدد السكان هي الإمكانية ب‎.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'كبُرَت المساحة بـ 2.5 مرة، ولذلك يجب أن يكبر عدد السكان أيضًا بـ 2.5 مرة.<br>الإمكانية الوحيدة التي تحقق زيادة بـ 2.5 مرة في عدد السكان هي الإمكانية ب‎.' },
    },
  },
  {
    screen: 58, label: 'السؤال الأكبر – بند ت', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    /* 07.10: the stepper is back (MOE 06.10: "בסעיף ג אין את המספור של השאלות למעלה"; Vadim: the line
       has 4 sections, no reason to hide it). Its absence also left station 3 with no question, which
       painted ג as done from the start. */
    step: { group: 'peak', index: 3, total: 4, labels: PEAK_STEP_LABELS },
    stem: `<strong>أي مدينة لا تتوافق مع تناسب توزيع الميزانية؟</strong>`,
    content: BUDGET_TABLE('<span dir="ltr"><span class="money" dir="rtl">₪700,000</span></span>'),
    options: [
      { id: 'a', html: 'غفعوت' },
      { id: 'b', html: 'نئوت' },
      { id: 'c', html: 'شاكيد' },
      { id: 'd', html: 'بركات' },
    ],
    correct: 'c',
    hint: { body: 'احسبوا النسبة بين الميزانية بالشواقل وعدد السكان في كل مدينة‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'علينا حساب النسبة بين الميزانية وعدد السكان (الميزانية للفرد الواحد) في كل مدينة.<br>في المدن غفعوت ونئوت وبركات نجد أن الميزانية هي 5 شواقل للفرد:<br>غفعوت: <span class="money" dir="rtl">5 شواقل</span> للفرد = <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">600,000</span><span class="frac-bottom">120,000</span></span></span>، نئوت: <span class="money" dir="rtl">5 شواقل</span> للفرد = <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">900,000</span><span class="frac-bottom">180,000</span></span></span>،<br>بركات: <span class="money" dir="rtl">5 شواقل</span> للفرد = <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1,200,000</span><span class="frac-bottom">240,000</span></span></span>.<br>في شاكيد نحصل على <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">700,000</span><span class="frac-bottom">150,000</span></span></span> — ميزانية تقارب 4.66 شيكل للفرد، لذلك لا يتحقق فيها تناسب.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'علينا حساب النسبة بين الميزانية وعدد السكان (الميزانية للفرد الواحد) في كل مدينة.<br>في المدن غفعوت ونئوت وبركات نجد أن الميزانية هي 5 شواقل للفرد:<br>غفعوت: <span class="money" dir="rtl">5 شواقل</span> للفرد = <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">600,000</span><span class="frac-bottom">120,000</span></span></span>، نئوت: <span class="money" dir="rtl">5 شواقل</span> للفرد = <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">900,000</span><span class="frac-bottom">180,000</span></span></span>،<br>بركات: <span class="money" dir="rtl">5 شواقل</span> للفرد = <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">1,200,000</span><span class="frac-bottom">240,000</span></span></span>.<br>في شاكيد نحصل على <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">700,000</span><span class="frac-bottom">150,000</span></span></span> — ميزانية تقارب 4.66 شيكل للفرد، لذلك لا يتحقق فيها تناسب.' },
    },
  },
  {
    screen: 60, lastInUnit: true, label: 'السؤال الأكبر – بند ث', type: 'single', maxAttempts: 2, hintPolicy: 'always',
    step: { group: 'peak', index: 4, total: 4, labels: PEAK_STEP_LABELS },
    stem: `<strong>ما هو مبلغ الميزانية الذي يجب على منظّمي المهرجان تخصيصه لمدينة شاكيد، بحيث يتحقق التناسب بين مبلغ الميزانية وعدد السكان في جميع السلطات المحلية؟</strong>`,
    content: BUDGET_TABLE('?'),
    options: [
      { id: 'a', html: '<span dir="ltr"><span class="money" dir="rtl">₪650,000</span></span>' },
      { id: 'b', html: '<span dir="ltr"><span class="money" dir="rtl">₪750,000</span></span>' },
      { id: 'c', html: '<span dir="ltr"><span class="money" dir="rtl">₪800,000</span></span>' },
      { id: 'd', html: '<span dir="ltr"><span class="money" dir="rtl">₪850,000</span></span>' },
    ],
    correct: 'b',
    hint: { body: 'لكي يتحقق تناسب ثابت بين الميزانية وعدد السكان في جميع المدن، يجب أن تكون النسبة (الميزانية لكل فرد) في مدينة شاكيد مساوية للنسبة الموجودة في باقي المدن‎.' },
    fb: {
      retry: 'الإجابة غير دقيقة، هل نحاول مرة أخرى؟',
      correct: { title: 'صحيح‎!', body: 'حسبنا للمدن غفعوت ونئوت وبركات أن الميزانية هي <span class="money" dir="rtl">5 شواقل</span> للفرد.<br>إذا فحصنا إمكانيات الميزانية المعطاة، نجد أن ميزانية بمبلغ <span class="money" dir="rtl">750,000 شيكل</span> تحقق التناسب: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">750,000</span><span class="frac-bottom">150,000</span></span></span> = <span class="money" dir="rtl">5 شواقل</span> للفرد.' },
      wrong: { title: 'هذا خطأ. الإجابة الصحيحة تظهر الآن.<br>هيّا نفهم السبب:', body: 'حسبنا للمدن غفعوت ونئوت وبركات أن الميزانية هي <span class="money" dir="rtl">5 شواقل</span> للفرد.<br>إذا فحصنا إمكانيات الميزانية المعطاة، نجد أن ميزانية بمبلغ <span class="money" dir="rtl">750,000 شيكل</span> تحقق التناسب: <span class="fracpair"><span class="fraction fr-inline"><span class="frac-top">750,000</span><span class="frac-bottom">150,000</span></span></span> = <span class="money" dir="rtl">5 شواقل</span> للفرد.' },
    },
  },
];

/* athletics content shared by screens 45-46 */
QUESTIONS.forEach(q => { if (q.content === '__ATH__') q.content = ATHLETICS_TABLE; });
