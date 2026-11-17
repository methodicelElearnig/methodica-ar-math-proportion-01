'use strict';
/* ═══════════════════════════════════════════════════════════════════
   methodica-math-proportion-01-04 — component 04 of 6 · deck slides 52-54
   משימת כיתה

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
  start: 41, end: 42,
  next: "../methodica-math-proportion-01-05/",
  prev: "../methodica-math-proportion-01-03/",
};

/* ═══════════════════ xAPI (720) — this component's configuration ═══════════════════
   Data only; the shared layer in ../unit-js/ reads it at CALL time. Ids must match
   ../metadata/methodica-math-proportion-01-04.json byte-for-byte (the loader shouts on a mismatch). Keys are the
   unit's GLOBAL screen numbers — exactly this component's own screens (guide §6.2). */
var XAPI_COMP_SLUG     = 'methodica-math-proportion-01-04';
var XAPI_COMP_ID       = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-proportion-01-04.json';

/* Screen -> [item, page in item]. 41 is the transition: no item. 001 is the class task (42) —
   off the computer, graded on screen but with no catalogue question, so it reports
   initialized/completed only and the component sends success with no score (§6.4). */
var SCREEN_TO_SUBCONTENT = {
  41: null,
  42: ['001', 1]
};

/* Screen -> the catalogue questions it answers (metadata questions[].questionId, last segment). */
var XAPI_SCREEN_QUESTIONS = {};

/* Items carrying a code-graded question (used as a set). */
var XAPI_EVAL_ITEMS = {};

/* No catalogue question — success:true, no score. */
var XAPI_GATE = null;
