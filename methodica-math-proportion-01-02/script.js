'use strict';
/* ═══════════════════════════════════════════════════════════════════
   methodica-math-proportion-01-02 — component 02 of 6 · deck slides 26-34
   תרגול סטנדרטי

   CONFIGURATION ONLY. Every behaviour is shared in ../unit-js/ — screens
   keep the unit's global numbering (0-61, 43 retired) across all six
   components, and this part's range is what bounds navigation and screen
   building.

   30.09.26 — re-split to the corrected deck, which declares the components
   on its own marker slides (deck 2 / 25 / 35 / 51 / 55 / 66). Standard
   practice became a component of its own, so every part after it moved up
   one number and the score routing now happens at the end of 01-02.

   PART_CONFIG next/prev are folder paths; the engine appends index.html (the CDN
   serves a folder URL as 0 bytes). Used only by DEV_NAV walkthroughs (?dev=1) —
   in production the platform routes (guide §8.12).
   ═══════════════════════════════════════════════════════════════════ */
window.PART_CONFIG = {
  start: 19, end: 27,
  routeByScore: true,
  nextPass: "../methodica-math-proportion-01-04/",
  nextFail: "../methodica-math-proportion-01-03/",
  prev: "../methodica-math-proportion-01-01/",
};

/* ═══════════════════ xAPI (720) — this component's configuration ═══════════════════
   Data only; the shared layer in ../unit-js/ reads it at CALL time. Ids must match
   ../metadata/methodica-math-proportion-01-02.json byte-for-byte (the loader shouts on a mismatch). Keys are the
   unit's GLOBAL screen numbers — exactly this component's own screens (guide §6.2). */
var XAPI_COMP_SLUG     = 'methodica-math-proportion-01-02';
var XAPI_COMP_ID       = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-proportion-01-02.json';

/* Screen -> [item, page in item]. 19 is the transition: no item. One item per stepper station
   of the standard practice: 001 Messi (20 table question, 21 the two years) · 002 Avdija (22) ·
   003 the tests (23) · 004 the bracelets (24) · 005 the pizza (25) · 006 the photo (26, 27). */
var SCREEN_TO_SUBCONTENT = {
  19: null,
  20: ['001', 1],
  21: ['001', 2],
  22: ['002', 1],
  23: ['003', 1],
  24: ['004', 1],
  25: ['005', 1],
  26: ['006', 1],
  27: ['006', 2]
};

/* Screen -> the catalogue questions it answers (metadata questions[].questionId, last segment). */
var XAPI_SCREEN_QUESTIONS = {
  20: ['q1'],
  21: ['q2'],
  22: ['q1'],
  23: ['q1'],
  24: ['q1'],
  25: ['q1'],
  26: ['q1'],
  27: ['q2']
};

/* Items carrying a code-graded question (used as a set). */
var XAPI_EVAL_ITEMS = { '001': 1, '002': 1, '003': 1, '004': 1, '005': 1, '006': 1 };

/* x19 promises "מיד יוצגו 6 תרגילים. צריך לענות נכון על 4 תרגילים לפחות": the 6 items, an item
   correct when all its questions are (the rule of unit.js standardPracticeScore()). The gate is
   checked at the component's end; below it the component reports success:false and the platform
   routes on recommendedAfterFail (see docs-and-tools/REPORTING-RESUME.md — open item). */
var XAPI_GATE = { of: 'items', need: 4 };
