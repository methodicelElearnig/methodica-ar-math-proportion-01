'use strict';
/* ═══════════════════════════════════════════════════════════════════
   methodica-math-proportion-01-01 — component 01 of 6 · deck slides 3-24
   הוק, הקנייה, הוראה מונחית ושאלה לחימום

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
  start: 0, end: 18,
  next: "../methodica-math-proportion-01-02/",
  prev: null,
};

/* ═══════════════════ xAPI (720) — this component's configuration ═══════════════════
   Data only; the shared layer in ../unit-js/ reads it at CALL time. Ids must match
   ../metadata/methodica-math-proportion-01-01.json byte-for-byte (the loader shouts on a mismatch). Keys are the
   unit's GLOBAL screen numbers — exactly this component's own screens (guide §6.2). */
var XAPI_COMP_SLUG     = 'methodica-math-proportion-01-01';
var XAPI_COMP_ID       = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-proportion-01-01.json';

/* Screen -> [item, page in item]. 2, 4 and 17 are transitions: no item.
   001 the density hook (s0 question, s1 reveal) · 002 the colour-mixing teaching question (s3)
   · 003 the guided strawberry-yogurt recipe (5-16: twelve screens, five questions) · 004 the
   warm-up question (18). */
var SCREEN_TO_SUBCONTENT = {
  0: ['001', 1],
  1: ['001', 2],
  2: null,
  3: ['002', 1],
  4: null,
  5: ['003', 1],
  6: ['003', 2],
  7: ['003', 3],
  8: ['003', 4],
  9: ['003', 5],
  10: ['003', 6],
  11: ['003', 7],
  12: ['003', 8],
  13: ['003', 9],
  14: ['003', 10],
  15: ['003', 11],
  16: ['003', 12],
  17: null,
  18: ['004', 1]
};

/* Screen -> the catalogue questions it answers (metadata questions[].questionId, last segment).
   Item 003 "נפתור יחד" (s5-s16), the guided walk-through, reports nothing since 2026-11-14: unit
   owner's rule of 10.11 (QA/2026-11-10-guided-items/GUIDED-ITEMS-REPORT.md, group A; as ratio-05
   a572ab3 and ratio-04 f46ec27). Kata declares no question on 01-003, so s7, s9, s11, s13 and s15
   (were q1-q5) leave this map: their picks are still kept and saved for resume, nothing is sent. */
var XAPI_SCREEN_QUESTIONS = {
  0: ['q1'],
  3: ['q1'],
  18: ['q1']
};

/* Items carrying a code-graded question (used as a set). 003, the guided walk-through, is out since
   2026-11-14 (see above): its 'completed' carries no result, and part 01 scores on the three catalogue
   questions (001 q1, 002 q1, 004 q1) instead of eight. */
var XAPI_EVAL_ITEMS = { '001': 1, '002': 1, '004': 1 };

/* No pass gate on screen — partResult() scores correct ÷ declared, success always. */
var XAPI_GATE = null;
