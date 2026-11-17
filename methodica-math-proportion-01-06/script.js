'use strict';
/* ═══════════════════════════════════════════════════════════════════
   methodica-math-proportion-01-06 — component 06 of 6 · deck slides 67-78
   שאלת שיא

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
  start: 52, end: 60,
  next: null,
  prev: "../methodica-math-proportion-01-05/",
};

/* ═══════════════════ xAPI (720) — this component's configuration ═══════════════════
   Data only; the shared layer in ../unit-js/ reads it at CALL time. Ids must match
   ../metadata/methodica-math-proportion-01-06.json byte-for-byte (the loader shouts on a mismatch). Keys are the
   unit's GLOBAL screen numbers — exactly this component's own screens (guide §6.2). */
var XAPI_COMP_SLUG     = 'methodica-math-proportion-01-06';
var XAPI_COMP_ID       = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-proportion-01-06.json';

/* Screen -> [item, page in item]. 52 is the transition: no item. The peak question is one
   catalogue item, 001, over eight screens: four story screens (53, 55, 57, 59) each followed by
   its section א-ד (54, 56, 58, 60). */
var SCREEN_TO_SUBCONTENT = {
  52: null,
  53: ['001', 1],
  54: ['001', 2],
  55: ['001', 3],
  56: ['001', 4],
  57: ['001', 5],
  58: ['001', 6],
  59: ['001', 7],
  60: ['001', 8]
};

/* Screen -> the catalogue questions it answers (metadata questions[].questionId, last segment). */
var XAPI_SCREEN_QUESTIONS = {
  54: ['q1'],
  56: ['q2'],
  58: ['q3'],
  60: ['q4']
};

/* Items carrying a code-graded question (used as a set). */
var XAPI_EVAL_ITEMS = { '001': 1 };

/* x52 promises "יש בה 4 סעיפים, עליכם לענות נכון על 3 לפחות": the 4 question screens. The
   last of them ends the component anyway, so the gate only decides success (and item 001's). */
var XAPI_GATE = { of: 'screens', need: 3 };
