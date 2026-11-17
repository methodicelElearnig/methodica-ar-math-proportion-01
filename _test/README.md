# `_test/` — headless harness (never deployed)

Adapted from `methodica-math-ratio-04/_test/` (2026-10-04). Nothing here ships: the stub
library shares its basename with the real CDN build **by design**, so the whole folder stays out
of every package (guide §11.1, §11.3).

| File | What it asserts |
|---|---|
| `verify-assets.js` | The hoisted layout (guide §15): every `src`/`href` resolves **case-exact**; CSS `url()` from the stylesheet's own folder; every asset path in `unit-js/` resolves from **every** component (this unit keeps no per-component `assets/`), with `racing-stage-${n}` expanded and the six never-existing `character-orange-*.png` fallback stills allowed only while every transition carries a video; one `?v=` on every code reference; the shared `<head>` and `index.html` tail identical in all six; nothing hoisted grown back; the repo-only root launcher names `index.html`. No dependencies. |
| `harness.js` | Shared jsdom boot: loads a component's **real** `index.html` and runs every local `<script src>` in document order from disk; optional stub library + `finishBoot()` replay of the loader's post-metadata sequence; `reload()` over the same storage. `answerFor(q, 'right' \| 'wrong', k)` builds answers for all six question types from the page's own `QUESTIONS`. |
| `verify-report.js` | Contracts, all six components: script order and `?v=`, `-k` inside the `XAPI_USING_G` gate, no top-level name in two files, `script.js` data only, the namespaced character key, no donor slug in code; ids byte-for-byte against `metadata/` (component, unit, every item and question id); `SCREEN_TO_SUBCONTENT` = the component's screens = the catalogue items; `XAPI_SCREEN_QUESTIONS` asks every declared question exactly once; `XAPI_EVAL_ITEMS`; `XAPI_GATE` = the numbers printed on the gate screen; `goTo` / `quizCheck` / `quizOpenHint` / every Retry-gated handler / every hand-built handler's seam ordering; painter sweep (every screen, clean and answered, idempotent) and painter dispatch (every type, every hand-built screen); the flag opens the form and the issue report carries unit / component / item / page on **every** screen; the boot cover. |
| `statement-flow.js` | Behaviour: no `?slxapi` → nothing sent, scoring still works; a full right-answer walk of every component; the 02 / 06 gates on both sides; **03's gate ending the component on screen 36** (and letting 3/4 through); screens 50/51 reporting one answer; the Retry gate and D-15 for every question type (the dual-select pair unordered); hint dedupe across re-opens, a reload and a finished question; resume of dual-select, value input (the answer toggle), dropdown, the hand-built screens of 01, the class task of 04 (including a save taken before 42 is painted), after the end (D-8, with the "answered, not clicked" control); B-1 seed; B-2; O-1; the keyboard gate; `DEV_NAV` routing 02 by score; answer text. |
| `true-false.js` | Guide §6.3b (10.11.26): 05 s50's three rows are 05-004 q1-q3, true-false in Kata — one `answered` per row, `true` / `false` (never `נכון` / `לא נכון`), equal to the correct answer exactly when `success`; item 004 still scores as ONE question (`XAPI_COUNT_ONCE`). Right, wrong twice, mixed. 13 of its checks fail on the code before. |
| `write-guard.js` | No write before the restore + the leave save (BOOT-AND-RESUME-HARDENING-2026-11-03.md §2.6, §2.10; 10.11.26): the drain writes the document as read, `markSent` before stage B marks in memory only, a failed read (not a 404) closes every write; the source shape of `40-resume.js` / `50-loader.js`; every part's inline `__resumeInFlight`, preloads (letter = the loader's), preconnect, lazy images; `flushResumeSaveOnLeave` through `saveState720OnLeave` on `-l`, through `saveState720` on `-k`. 45 of its 75 checks fail on the code before. |
| `xapi-720-l.js` | The `-k` stub plus `saveState720OnLeave` (`__leaveWrites()`); `harness.js` loads it with `opts.libFile`. `xapi-720-k.js` stays, for the `-k` rollback check. |
| `mutations.js` | 21 deliberate breaks (guide §10.4); each must turn at least one suite red, and each file is restored and byte-compared. |
| `xapi-720-k.js` | Local stand-in for the CDN library over `sessionStorage` (from ratio-04, slug and key lists retargeted). Loaded in a browser only via `?xapiLib=../_test/xapi-720-k.js` on `localhost`. Console helpers: `__stmts() __state() __dupes() __reset() __failWrites(bool\|status) __setState(doc)`. |
| `answer-helper.js` | Browser console helper for local walks: `__answer(n, ok)` answers quiz screen `n` through the real handlers; `__fmt(stmt)` summarises a statement. Load it from the console. |

## Running

jsdom must live **outside** the OneDrive tree (ADDING-REPORTING-AND-RESUME.md §10.1). One
`npm install jsdom` into any folder outside OneDrive (this machine: `C:/lomda-test`), then from
the repo root:

```bash
node _test/verify-assets.js
NODE_PATH=C:/lomda-test/node_modules node _test/verify-report.js
NODE_PATH=C:/lomda-test/node_modules node _test/statement-flow.js
NODE_PATH=C:/lomda-test/node_modules node _test/mutations.js
```

State on 2026-10-05: **360 + 798 + 288 = 1446 checks, all green; 21 / 21 mutations caught.**

## In a browser

```
http://localhost:<port>/methodica-math-proportion-01/methodica-math-proportion-01-01/index.html?xapiLib=../_test/xapi-720-k.js
```

Add `&resetState` for a clean document, `&dev=1` for free navigation and the hops between
components. Serve from a **subpath** (the folder above the repo), so a wrong `../` depth fails
locally as it would in production. Stub `fetch` before trying the issue form — the endpoint is
the real, shared 720 Google Form.

## Not covered here

A real Kata run (ADDING-REPORTING-AND-RESUME.md §12): stubs prove payload **shape**, not
**arrival**; the real Google Form row in the shared sheet; pixel-level checks.

## `monday-2026-10-07.js` — MOE monday 06.10 + the canvas fix (real Chrome)

06's peak stepper (no section "done" before it is answered; ג has its stepper), 02's dropdowns drawn
with appearance:none (the ✓/✗ padding holds in Safari), and the canvas inside the window at eight
window sizes. 22 of its 37 checks fail on the code before the fix. Optional base URL for a live run.

```bash
NODE_PATH=/tmp/lomda-test/node_modules node _test/monday-2026-10-07.js
```
