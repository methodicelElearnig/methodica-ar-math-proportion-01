'use strict';
/* ═══════════════════════════════════════════════════════════════════
   methodica-math-proportion-01-03 — component 03 of 6 · deck slides 36-50
   תרגול בסיסי ותרגול סטנדרטי מועד ב׳

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
  start: 28, end: 40,
  next: "../methodica-math-proportion-01-04/",
  prev: "../methodica-math-proportion-01-02/",
};

/* ═══════════════════ xAPI (720) — this component's configuration ═══════════════════
   Data only; the shared layer in ../unit-js/ reads it at CALL time. Ids must match
   ../metadata/methodica-math-proportion-01-03.json byte-for-byte (the loader shouts on a mismatch). Keys are the
   unit's GLOBAL screen numbers — exactly this component's own screens (guide §6.2). */
var XAPI_COMP_SLUG     = 'methodica-math-proportion-01-03';
var XAPI_COMP_ID       = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-proportion-01-03.json';

/* Screen -> [item, page in item]. 28 and 37 are transitions: no item. Basic practice: 001 what
   is a proportion (29, 30) · 002 the syrup (31, 32) · 003 the acrylic colours (33) · 004 the
   racing game (34, 35, 36). Standard practice B: 005 the radio playlist (38) · 006 the
   vacuum-mop (39, 40). */
var SCREEN_TO_SUBCONTENT = {
  28: null,
  29: ['001', 1],
  30: ['001', 2],
  31: ['002', 1],
  32: ['002', 2],
  33: ['003', 1],
  34: ['004', 1],
  35: ['004', 2],
  36: ['004', 3],
  37: null,
  38: ['005', 1],
  39: ['006', 1],
  40: ['006', 2]
};

/* Screen -> the catalogue questions it answers (metadata questions[].questionId, last segment). */
var XAPI_SCREEN_QUESTIONS = {
  29: ['q1'],
  30: ['q2'],
  31: ['q1'],
  32: ['q2'],
  33: ['q1'],
  34: ['q1'],
  35: ['q2'],
  36: ['q3'],
  38: ['q1'],
  39: ['q1'],
  40: ['q2']
};

/* Items carrying a code-graded question (used as a set). */
var XAPI_EVAL_ITEMS = { '001': 1, '002': 1, '003': 1, '004': 1, '005': 1, '006': 1 };

/* x28 promises "מיד יוצגו 4 תרגילים … ענו נכון על 3 תרגילים ומעלה כדי להתקדם": the 4 basic
   items. `at: 36` — the gate ENDS the component on screen 36 (the last basic exercise) when the
   learner moves on below 3 of 4: success:false, and screens 37-40 are never reached (decision
   2026-10-05, guide §6.4). A learner at or above it continues to standard practice B and ends on
   40. The score is the gate's (correct ÷ 4) on both paths. */
var XAPI_GATE = { of: 'items', items: ['001', '002', '003', '004'], need: 3, at: 36 };
