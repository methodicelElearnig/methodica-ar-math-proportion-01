'use strict';
/* ═══════════════════════════════════════════════════════════════════
   methodica-math-proportion-01-05 — component 05 of 6 · deck slides 56-65
   תרגול מתקדם

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
  start: 44, end: 51,
  next: "../methodica-math-proportion-01-06/",
  prev: "../methodica-math-proportion-01-04/",
};

/* ═══════════════════ xAPI (720) — this component's configuration ═══════════════════
   Data only; the shared layer in ../unit-js/ reads it at CALL time. Ids must match
   ../metadata/methodica-math-proportion-01-05.json byte-for-byte (the loader shouts on a mismatch). Keys are the
   unit's GLOBAL screen numbers — exactly this component's own screens (guide §6.2). */
var XAPI_COMP_SLUG     = 'methodica-math-proportion-01-05';
var XAPI_COMP_ID       = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-proportion-01-05.json';

/* Screen -> [item, page in item]. 44 is the transition: no item (43 is retired). 001 the dogs
   (45) · 002 the athletes (46, 47) · 003 the workouts (48 the table, 49 the dropdowns) · 004 the
   triangles (50) · 005 the ratio table (51). 51's blanks are ONE catalogue question, reported once,
   all or nothing; 50's three rows are three true-false questions q1-q3 in the catalogue (Kata,
   04.11.26; metadata/ item 004 copied from Kata 10.11.26), each reported with its own verdict and
   'true' / 'false' (guide §6.3b) — but scored as ONE question, see XAPI_COUNT_ONCE. */
var SCREEN_TO_SUBCONTENT = {
  44: null,
  45: ['001', 1],
  46: ['002', 1],
  47: ['002', 2],
  48: ['003', 1],
  49: ['003', 2],
  50: ['004', 1],
  51: ['005', 1]
};

/* Screen -> the catalogue questions it answers (metadata questions[].questionId, last segment). */
var XAPI_SCREEN_QUESTIONS = {
  45: ['q1'],
  46: ['q1'],
  47: ['q2'],
  49: ['q1'],
  50: ['q1', 'q2', 'q3'],
  51: ['q1']
};

/* Items whose questions count as ONE question in the component and item scores, correct only when
   all of them are (10.11.26, the 08.11 sheet rule "a question with sub-questions counts once"):
   splitting 004 into its three catalogue questions changes the reporting, not the score — still
   correct ÷ 6 here (70-platform.js partResult / XAPI_ITEM_RESULT). */
var XAPI_COUNT_ONCE = { '004': 1 };

/* Items carrying a code-graded question (used as a set). */
var XAPI_EVAL_ITEMS = { '001': 1, '002': 1, '003': 1, '004': 1, '005': 1 };

/* No pass gate on screen (x44 promises none) — correct ÷ declared. */
var XAPI_GATE = null;

/* MOE 2026-10-08: real score, success only ≥60%, no gate, nothing shown.
   success = correct ÷ 6 declared questions >= 0.6 (70-platform.js partResult). */
var XAPI_PASS_SCALED = 0.6;
