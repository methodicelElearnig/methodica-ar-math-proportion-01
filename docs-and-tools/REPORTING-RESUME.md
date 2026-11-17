# methodica-math-proportion-01 — xAPI reporting, issue reporting, resume

Unit record. The family guide is
`2026/Documentation/reporting-and-resume/ADDING-REPORTING-AND-RESUME.md`; this file records only
what is specific to this unit and why. Added 2026-10-05, branch `vadimr/feat/reporting-resume`.
Reference unit: **methodica-math-ratio-04** (`e7a9531`, same 720-core engine).

## 0. Optimization first (guide §15)

Done before the layer, one class of file per commit, nothing re-encoded:

| What | Commit |
|---|---|
| `.gitattributes` (`* text=auto eol=lf`, binaries declared), `.gitignore`; `.DS_Store` out of the index. The index was already LF — nothing renormalised | `4c6e1f9` |
| `fonts.css` + 2 Assistant variable woff2, byte-identical ×6 → `unit-assets/fonts/` | `f374176` |
| `styles.css`, byte-identical ×6 (README: "no sync tool") → `unit-css/styles.css` | `6adc187` |
| **Every** image, video and applet → `unit-assets/{img,img/hint,video,applets}` — 117 files, 70 of them byte-identical copies, no path holding two different blobs; `racing-stage-${n}` moved as its family; `athletics-runners.jpeg` and `character-orange-like.mp4` (referenced by nothing) dropped | `3517531` |
| root launcher names `…-01/index.html` (the CDN serves a folder as 0 bytes), marked repo-only | `b3bb21d` |
| `index_dev.html` ×6 byte-identical; **the dev bar had been dead**: `const UNIT_ID` declared in two `<script>` blocks of one page → SyntaxError on the second | `37d9be7` |

Assets ~20 MB → 9.9 MB. Package (dry run): **77 files, 10.85 MB**. Guard: `_test/verify-assets.js`.

Known and unchanged: `characterAssets` (unit.js) names six `character-orange-*.png` stills that
never existed in any component. Each is only the `<img>` fallback of a transition that always has a
video, so none is ever requested; `verify-assets.js` allows exactly these six and asserts that
every transition still carries its video.

## 1. Shape of the integration

The unit runs on the vendored **720-core** (`engine.js`, `quiz-engine.js`, `questions.js`,
`unit.js`, `motion.js`) — the same engine as ratio-04, whose integration is the template:

- Platform files from ratio-04: `10-identity.js`, `20-xapi.js`, `40-resume.js`, `50-loader.js`,
  `90-boot.js`, `report-modal.js`, `_test/xapi-720-k.js`. This unit's own lines in them:
  `xapiAnswerText` (selector list; stacked fractions `.frac-top/.frac-bottom` read `a/b` — QA F-2,
  ported from ratio-05 `d0e99be`; `<br>` no longer glues two lines into one word),
  `restoreEndedButton` (also knows the 03 gate screen), `hideCrossPartBack` (selector for this
  unit's screens; **called** from `90-boot.js` — ratio-04 defined it and never called it).
- **`unit-js/70-platform.js`** — written for this unit from ratio-04's glue: painters for every
  question type including **dropdown** and **dual-select** (no sibling had either), one
  all-or-nothing answer for screens the catalogue declares as one question, the hand-built screens
  of 01 and the class task of 04, the three gates, and the **in-component gate** of 03.
- The 720-core received **guarded hook calls only** (`typeof … === 'function'`), so it still runs
  without the layer. `unit.js` reports its hand-built screens through `onCustomAnswered`
  (committed) and `onCustomPick` (pending), each as the handler's last act; the painters restore
  them by replaying unit.js's own handler with the saved choice.
- `inPart(n)` is unit.js's own — 70-platform.js does **not** redeclare it (§3.3: a `function`
  declared again in a later file silently wins).
- The inline issue-report code at the bottom of `unit.js` moved to `report-modal.js`.

Script order in all six `index.html` (one `?v=`, currently `20261005a`):
`10-identity, 20-xapi, 40-resume, 50-loader, script.js, motion, quiz-engine, questions, unit,
report-modal, engine, 70-platform, 90-boot`.

The engine's `DEV_SCREEN` / `DEV_READY` `postMessage` to the parent frame is **not** gated on
`DEV_NAV`: the dev page frames `index.html` without `?dev=1`, so gating would kill the dev bar; the
message carries a screen number only.

## 2. Identity and maps

| | |
|---|---|
| `XAPI_ID_PREFIX` | `https://lomdot.education.gov.il/metodica/720active/math/proportion/01/` |
| `XAPI_UNIT_ID` | `methodica-math-proportion-01` — bare slug, = `metadata/methodica-math-proportion-01_unit.json` `id` |
| component ids | `<prefix><slug>/`, = `METADATA.id` (checked on every load) |
| library | `xapi-720-k.js` (`RESUME_ENABLED = true`) |

Screens are numbered **globally** (0–60, 43 retired). Each `script.js` maps exactly its own screens:

| Comp | Screens | Items → screens | Questions |
|---|---|---|---|
| 01 | 0–18 | 001 → 0–1 · 002 → 3 · 003 → 5–16 · 004 → 18 (2, 4, 17 null) | s0 q1 · s3 q1 · guided 7/9/11/13/15 q1–q5 · q18 q1 |
| 02 | 19–27 | 001 → 20–21 · 002 → 22 · 003 → 23 · 004 → 24 · 005 → 25 · 006 → 26–27 (19 null) | one per screen |
| 03 | 28–40 | 001 → 29–30 · 002 → 31–32 · 003 → 33 · 004 → 34–36 · 005 → 38 · 006 → 39–40 (28, 37 null) | one per screen |
| 04 | 41–42 | 001 → 42 (41 null) | none — the class task |
| 05 | 44–51 | 001 → 45 · 002 → 46–47 · 003 → 48–49 · 004 → 50 · 005 → 51 (44 null) | one per question screen |
| 06 | 52–60 | 001 → 53–60 (52 null) | 54 q1 · 56 q2 · 58 q3 · 60 q4 |

Every declared question is asked exactly once (asserted both ways). Screens **50** (three
נכון/לא נכון rows) and **51** (four blanks), and **49** (five blanks), are each ONE catalogue
`matching` question: one `answered` with the screen's all-or-nothing verdict and every row/blank in
the response text (guide §6.3, QA D-9 — never split finer than the catalogue).

## 3. Decisions (2026-10-05)

| Decision | Where |
|---|---|
| Metadata = the repo's `metadata/*.json` as updated by the owner (committed first on the branch) | `095a6b3` |
| **02** scores and passes on the promise of screen 19: "מיד יוצגו 6 תרגילים. צריך לענות נכון על 4 תרגילים לפחות" = the 6 stations (items 001–006), a station correct only when all its questions are — the same rule as `unit.js standardPracticeScore()`; `scaled` = stations / 6 | `XAPI_GATE {of:'items', need:4}` |
| **03** — owner's decision: the promise of screen 28 ("4 תרגילים … ענו נכון על 3 תרגילים ומעלה כדי להתקדם") is **enforced**. Below 3 of the 4 basic items, moving on from screen 36 ends the component there: `completed` `success:false`, the button disabled, screens 37–40 never reached. At or above it the learner continues to standard practice B and ends on 40. `scaled` = basic items / 4 on both paths. The gate fails open while a gated item has no recorded answer | `XAPI_GATE {of:'items', items:[001-004], need:3, at:36}`, `partGateBlocks()` |
| **06** (assessment): "יש בה 4 סעיפים, עליכם לענות נכון על 3 לפחות" = the 4 question screens; `scaled` = sections / 4; item 001's `success` = the gate | `XAPI_GATE {of:'screens', need:3}` |
| **01 / 05** show no threshold: `scaled` = correct ÷ the questions the metadata declares, `success: true` | `partResult()` |
| **05** (challenge, "בואו נאתגר את עצמנו") — **changed 2026-10-08 (MOE, with Maya):** reports its real score, `success` only at ≥60%: `scaled` = correct ÷ 6 declared questions (001, 002 q1+q2, 003, 004, 005; unanswered = wrong), `success = scaled >= 0.6` (4 of 6). Still no gate on screen — every learner continues, nothing is shown | `XAPI_PASS_SCALED = 0.6` (05 `script.js`), `partResult()` |
| **04** (class task, no catalogue question): `{ success: true }` with no score (§6.4); item 001 reports initialized/completed only. The table is still checked on screen and its values and verdict are resumed | `XAPI_EVAL_ITEMS = {}` |
| Every hand-built question in 01 has one attempt, so it reports `answered.last` | `onCustomAnswered()` |
| Keyboard forward gated like each screen's own button: quiz answered; s0 answered; **s3 and x42 once checked** (their button is live before that, as צדקתי?); otherwise the continue button enabled. Arrows inside a field never navigate; free under `DEV_NAV` | `keyboardForwardAllowed()` |
| Retry gate (`st.lw`, D-14) on every question type; the dual-select pair is signed **unordered**, as it is graded | `quiz-engine.js` |
| The companion character is fixed (orange — no selection screen); the key is namespaced anyway (`methodica_math_proportion_01_selectedCharacter`, D-6) because `adoptUnitCharacter` reads it on every boot | `40-resume.js` |
| Video: every `<video>` here is a decorative character clip — none opts into reporting (`data-xapi-report`). No YouTube, so no D-1 exposure | `20-xapi.js` |
| Applets (iframes) keep their state across navigation as before — ratio-04's engine blanks every iframe `src` on `goTo` (for YouTube); that was **not** ported, it would reset the applets. Applet-internal state is not resumed (the applets expose none) | `engine.js` |

## 4. The component end

The last click of every component goes through `goTo(PART_LAST + 1)` → `partExit(+1)`:
01 q18 שנמשיך? · 02 q27 · 03 q40 (or **q36 below the gate**) · 04 x42 המשך (once the table is
checked) · 05 q51 · 06 q60 סיימתי.
`partExit` = `xapiEndComponent(partResult(), lastScreenButton())` → `setUnitResult('proportion01_c0N_result')`
→ `flushResumeSave()` → navigate **nowhere** (only `DEV_NAV` hops on — 02 by its score, as unit.js
always routed). `restoreEndedButton()` keeps a finished component's button disabled after every
repaint and reload (D-8); the first screen's cross-component "חזרה" is hidden in production.

## 5. Resume payload (v6 document, one per component)

```
payload = { currentScreen, qResults,
            q: { <screen>: { attempts, done, wasCorrect, hintUsed, selected, selectedSet, lw, tgl } },
            c: { 0|3: {pick, done}, 7|9|11|13|15: {pick, done}, 42: {vals[8], ok, done} } }
```

`q` = the quiz engine's questions of this component (pending picks, typed values and select
values included, saved on every pick/keystroke/change, debounced); `c` = the hand-built screens
(`CUSTOM_STATE`) and the class-task boxes, which live only in the DOM and are written back in
`applyResumeDom` before any save. `userInputs` / `answerKey` / `slotOk` are re-derived by
`quizMarkOutcome` from `selectedSet`; the value-input "my answer / correct answer" toggle is
resumed through `tgl` (§8.10).

## 6. Tools

- `_test/` — see `_test/README.md`: **360 + 798 + 288 = 1446 checks**, 21/21 mutations caught.
- `docs-and-tools/package-allowlist.ps1`, `build-package.ps1`, `verify-package.ps1` — from
  ratio-04; the allowlist ships `metadata/*.json`, `unit-js/*.js`, `unit-css/*.css`,
  `unit-assets/**` and each component's `index.html` + `script.js` — 77 files. Nothing at the root;
  `_test/`, `docs-and-tools/`, `.qa/`, `spec/`, `tools/`, `translations/`, `index_dev.html`, `*.md`
  never ship.
- `send-metadata.ps1` / `retrieve-metadata.ps1` / `SEND-METADATA.md` — from ratio-04, constants
  retargeted. Run 2026-10-05 (§7.3). Needs `docs-and-tools/kata-api-key.txt` (git-ignored).
- `reset-state.html` — QA: inspect / delete one registration's state document.

## 7. Open before release

1. **`recommendedAfterFail` (owner).** The metadata puts the link on **03 → 02**; the code sends a
   learner who fails **02** (below 4/6) to 03 and lets a passer skip 03. Under platform routing
   Kata reads the field of the component that was failed, so as it stands a learner who fails 02
   is routed by nothing and a learner who fails 03 is sent back to 02. Sent to Kata **as is** by
   the owner's decision (2026-10-05); the team fixes it in the Kata UI. Also: 03 is
   `isRequired: true`, which may make Kata send passers of 02 into 03 anyway (guide §13: how Kata
   routes is still open).
2. ~~`$ContentBaseUrl`~~ — `…/metodica/720/math/proportion/01` **confirmed with the owner
   2026-10-05**. It becomes every `hostedContentRef`; the package must be uploaded exactly there.
3. ~~Push the metadata to Kata~~ — **done 2026-10-05** with `send-metadata.ps1`, as is:
   preflight `absent=7 exists=0`; dry run `created=30 updated=1 failed=0`; live `created=30
   updated=1 failed=0` (all 201; the update is the 03 → 02 `recommendedAfterFail` link, 200).
   Verified by read-back, not by the 2xx: `retrieve-metadata.ps1 -FailOnDrift` → unit 1,
   components 6, items 23, warnings 0, no drift against `metadata/`. `-Status` → **6/6 draft**.
   `hostedContentRef` = `…/metodica/720/math/proportion/01/<component>/index.html`. Logs
   (git-ignored): `docs-and-tools/send-metadata.2026-10-05-{dryrun,live}.log`,
   `preflight-metadata.log`, `retrieve-metadata.log`; the read-back is in `metadata-from/`.
   **Publishing** — done by the owner; `-Status` on 2026-10-06 → **6/6 published**.
4. ~~Live Kata run~~ — **done 2026-10-06, see §8**: every component walked to its end, the gates on
   both sides, all PASS, no defect. Still open: one QA-marked issue report in the shared sheet
   (needs the owner's OK — it posts to the shared 720 form); R7/R8/R9 and the leave-page save
   (unverified in every unit).
5. ~~Deploy~~ — **uploaded by the owner; verified 2026-10-06**: all 77 files on
   `…/metodica/720/math/proportion/01/` byte-identical to `deployments/2026-10-05` (size **and**
   SHA-256, not status); nothing extra present (no root `index.html`, dev page, stub, old
   `styles.css`, key).
6. Inherited from ratio-04, unchanged: on a **resumed** load the landing item's `initialized` goes
   out before the component's (`applyExecutionState` runs before the loader's component
   `initialized`); `xapiWireVideos` still carries the `pausedOnce` latch (dormant — nothing opts in).
7. The applet in 01-s3 loads Google Fonts from `fonts.googleapis.com` (the applet's own markup,
   untouched here).

## 8. Live Kata run — 2026-10-06

Live CDN + live Kata, browser-driven, every component walked to its end, on the same plan as
ratio-03's round (`QA/2026-10-04/REPORT.md`). Two test learners, so every path has its own clean
registration (no mid-round `resetState`): learner **A** `VADIM-1234` for the pass paths —
`2026/Tools/full-kata-link/kata-links-methodica-math-proportion-01-20261006-081005.csv` — and
learner **B** `VADIM-1234-B` for the fail paths — `…/kata-links-methodica-math-proportion-01-learnerB-20261006.csv`
(both `New-KataLaunchLinks.ps1 -UnitKey`, `https://no-platform.com`, no reset). Links validated without printing them: path `…/720/math/proportion/01/<component>/index.html`,
`component` = slug, `registration` = `registrationId`, `slxapi` = Bearer + Kata's xAPI endpoint +
the test learner; the page served = the package's `index.html` byte for byte.

**Method.** The pane cannot click into a cross-origin iframe, so the links were opened top-level
through a localhost 302 (no tool call carries the URL); the browser tool shows `slxapi=REDACTED`, so
**no token entered the transcript**. Observation: a counting pass-through on `sendStatement720`
(observe, never replace), `stateLastResult720()`, and a server-side read of the state document with
the link's own token (summary only). The reporting token cannot read statements back (guide §12.1):
verdicts cover what was sent, the HTTP status Kata returned, and what the document holds.

**Component 01 (registration `d047aadc`) — every §12 probe:**

| Probe | Result |
|---|---|
| 1 Preflight | `XAPI_DISABLED` false, `XAPI_USING_G` true, `xapi-720-k.js`, registration present, `DEV_NAV` false, state path `/api/v1/xapi/activities/state`, `METADATA.id === XAPI_COMP_ID` |
| 2 First read | `404 → absent, ok` |
| 3 Write / read back | save `204 ok`; read `200`, v6, keys `component done doneItems hints payload picks results ui v` (no `part/prev/parts`) |
| flow | hook → `answered.last` → `completed 001` → `initialized 002`; s3 wrong → `answered.last false` → `completed 002`; guided q1–q5 → `completed 003`; s18: hint opened twice → **one** `requested.1`; wrong → `answered` (not `.last`); the same wrong answer re-picked → check **disabled** (Retry gate) |
| 4 Reload | `load 200 ok`, `XAPI_DISABLED` false (from Kata, not the fallback); landed on 18, 8 verdicts, `lw` kept, button blocked, the pending pick painted as live |
| 5 Ledger | Back to 0 and forward to 18 across items 001–004: **0 `completed`**, `initialized` on every re-entry (003, 002, 001, 002, 003, 004), 0 `answered`, the hint **not** re-sent after the reload; s0, s3, guided 15 repainted |
| 6 End | right on attempt 2 → `answered.last` → `completed 004` → component `completed` (success); button disabled; `location.pathname` unchanged; a forced second click sent 0. Document: `done` = 01, `doneItems` = 001–004, `hints` = 004/q1, `results` = pass |
| D-8 | reload after the end: lands on 18, button disabled; Back/forward: still disabled; forced click: 0 `completed` |

**Components 02–06 — every component walked to its end:**

| Comp. | Path (registration) | Component `completed` | Also verified live |
|---|---|---|---|
| 02 | A pass 5/6 (`488f33e0`) | `true / 0.833` | **B-2**: wrong on s20, Back to s19 (no item) → 0 `completed`, `doneItems` empty in Kata; dual-select s21 resumed after a reload (values, ✗ marks, retry feedback, `lw`, check blocked); hint on s22 opened twice → one `requested.1`; item 004 failed on attempt 2 → `completed 004 false/0` |
| 02 | B fail 3/6 (`dee9c38b`) | `false / 0.500` | agrees with unit.js `standardPracticeScore()` (the old router: fail → 03) |
| 03 | A pass at 3/4 (`1aff2b85`) | `true / 0.750` | the gate lets the learner through to 37 and the component ends on 40; value-input s31 final wrong + "my answer" view → after a reload the learner's own values, locked, toggle offering "התשובה הנכונה"; q36's button stays live after a pass (only the real end locks) |
| 03 | B fail 2/4 (`d627e7bb`) | `false / 0.500` **on screen 36** | **B-1**: reload onto the unanswered item 003, Back → 0 `completed`, 003 not in the ledger; answered later → `completed 003` exactly once. **O-1**: Back into item 001 → `initialized 001`, 0 `completed`. The gate: q36's click → `completed 004` then the component; screen stays 36, button locked; ArrowLeft / `goTo(37)` → nowhere, 0 sent; after a reload still 36, locked, 0 sent |
| 04 | A (`c9df39a3`) | `true`, no score | **O-2**: six boxes typed, reload with no screen change → all six back, still unchecked, button gated, ArrowLeft stays; completed and checked → 8/8 ✓ → `completed 001` (no result), then the component |
| 05 | A (`cec0ed19`) | `true / 1.000` | dropdown s49: hint, wrong attempt, reload → values back, 5 ✗, retry feedback, check blocked, hint button visible; the hint re-opened → **0** `requested` (D-7 across a reload); s50 (statement) and s51 (dropdown) → one `answered` each |
| 06 | A pass 3/4 (`e674d06b`) | `true / 0.750` | the last button reads "סיימתי"; item 001 `true/0.750` (the gate's success) |
| 06 | B fail 2/4 (`b0150ff2`) | `false / 0.500` | item 001 `false/0.500` |

**Everywhere:** exactly one component `completed` per registration, equal to its pass rule on
every pass and fail path; the button disabled, `location.pathname` unchanged (the platform
routes); reporting on, `-k`, `DEV_NAV` false, ids matching the catalogue, first read `404 absent`,
landing on `PART_FIRST` with the cross-component "חזרה" hidden. Kata's documents at the end
(server-side read): A 01–06 `done`, verdict pass; B 02 / 03 / 06 `done`, verdict fail, 03 on
screen 36. Canaries: the applet iframes of 02, 03, 05 carry no `slxapi` / registration / Bearer /
`forigin`. Console: no JS error; the only `404` lines are the expected `absent` first reads of new
registrations (a fresh reload showed all 28 resources 2xx).

**Not covered live:** the QA-marked issue report into the shared sheet (owner's OK pending; the
form payload is covered by `_test/` and a stubbed browser check); R7/R8/R9 and the leave-page save
(unverified in every unit); Kata's routing between components; the LRS side (the reporting token
cannot read statements).

**Data left in Kata:** learner A — all six registrations finished (pass); learner B — 02, 03, 06
finished (fail), 01/04/05 never opened. Reset with `resetState: true` (launcher) before reusing
the links. The QA console helper was stored in the test browser's `localStorage` for the walks and
removed at the end.
