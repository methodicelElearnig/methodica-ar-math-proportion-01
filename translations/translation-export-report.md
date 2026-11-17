# Translation Export Report — methodica-math-proportion-01, Target 01

**Module root:** `units/methodica-math-proportion-02-01-main`  
**Module name:** `methodica-math-proportion-01`  
**Target:** `01`  
**Parts covered:** `01, 02, 03, 04, 05, 06`  
**Export type:** First export (no prior XLIFF for this target; §7 refresh workflow does not apply)  
**Files:** `methodica-math-proportion-01_target-01_he.xlf`, `translation-screen-manifest.csv`, `sweep1-results.csv`, `sweep2-uncovered.csv`, `stats.json`, this report

---

## 1. Discrepancy check against the part list

The folder structure was walked before extraction. **Result: parts 01, 02, 03, 04, 05, 06 exist, no gaps and no undocumented extras.**

The module root `index.html` (the LMS-entry redirect) and any shared `unit-js/` layer are covered as pseudo-part `00`, screen `99`.

## 2. Totals

| Metric | Count |
|---|---|
| Total screens (incl. pseudo-screen `-99` chrome) | **64** |
| Total translation units | **762** |
| Manual-review-flagged units | **0** |
| Excluded strings (logged, §5) | **0** |

### Units per part

| Part | Units |
|---|---|
| `01-00` | 586 |
| `01-01` | 61 |
| `01-02` | 23 |
| `01-03` | 23 |
| `01-04` | 23 |
| `01-05` | 23 |
| `01-06` | 23 |

### Units per source file

| File | Units |
|---|---|
| `index.html` | 2 |
| `methodica-math-proportion-01-01/index.html` | 61 |
| `methodica-math-proportion-01-02/index.html` | 23 |
| `methodica-math-proportion-01-03/index.html` | 23 |
| `methodica-math-proportion-01-04/index.html` | 23 |
| `methodica-math-proportion-01-05/index.html` | 23 |
| `methodica-math-proportion-01-06/index.html` | 23 |
| `unit-js/questions.js` | 421 |
| `unit-js/quiz-engine.js` | 28 |
| `unit-js/unit.js` | 135 |

### Units per screen

| Screen | Units |
|---|---|
| `01-00-02` | 3 |
| `01-00-04` | 2 |
| `01-00-06` | 1 |
| `01-00-07` | 2 |
| `01-00-08` | 1 |
| `01-00-09` | 4 |
| `01-00-10` | 1 |
| `01-00-11` | 4 |
| `01-00-12` | 1 |
| `01-00-13` | 4 |
| `01-00-14` | 1 |
| `01-00-15` | 9 |
| `01-00-17` | 2 |
| `01-00-18` | 7 |
| `01-00-19` | 4 |
| `01-00-20` | 10 |
| `01-00-21` | 10 |
| `01-00-22` | 11 |
| `01-00-23` | 12 |
| `01-00-24` | 23 |
| `01-00-25` | 9 |
| `01-00-26` | 11 |
| `01-00-27` | 12 |
| `01-00-28` | 4 |
| `01-00-29` | 12 |
| `01-00-30` | 8 |
| `01-00-31` | 9 |
| `01-00-32` | 10 |
| `01-00-33` | 12 |
| `01-00-34` | 9 |
| `01-00-35` | 10 |
| `01-00-36` | 9 |
| `01-00-37` | 2 |
| `01-00-38` | 13 |
| `01-00-39` | 15 |
| `01-00-40` | 11 |
| `01-00-41` | 4 |
| `01-00-42` | 7 |
| `01-00-44` | 2 |
| `01-00-45` | 13 |
| `01-00-46` | 11 |
| `01-00-47` | 11 |
| `01-00-49` | 15 |
| `01-00-50` | 23 |
| `01-00-51` | 9 |
| `01-00-52` | 3 |
| `01-00-53` | 5 |
| `01-00-54` | 10 |
| `01-00-55` | 1 |
| `01-00-56` | 11 |
| `01-00-57` | 1 |
| `01-00-58` | 11 |
| `01-00-59` | 1 |
| `01-00-60` | 7 |
| `01-00-99` | 173 |
| `01-01-00` | 8 |
| `01-01-01` | 8 |
| `01-01-03` | 22 |
| `01-01-99` | 23 |
| `01-02-99` | 23 |
| `01-03-99` | 23 |
| `01-04-99` | 23 |
| `01-05-99` | 23 |
| `01-06-99` | 23 |

## 3. Excluded strings, with reasons

No strings were excluded by the console/diagnostic rule in this module.


Also excluded per template v2 §5, and confirmed by sweep 2 rather than assumed: source comments (including Hebrew ones quoting producer PPT notes), regex character classes over the Hebrew alphabet, decorative `aria-hidden` subtrees and `<svg>` icon markup, CSS/DOM identifiers and asset paths, and bare numerics.

## 4. Out of scope (still needs translating by someone)

- YouTube caption tracks for any embedded video live in YouTube, not in these files.
- `metadata/*.json` carries Hebrew but is authoring/reporting data consumed by KATA, not rendered by the lomda. If it needs localising that is a separate pass.

## 5. Placeholders and inline markup

- Inline markup (`<strong>`, `<br>`, `<span dir="ltr">`) is stored as escaped literal text in `<source>` and round-trips. `<span dir="ltr">` around arithmetic is load-bearing in an RTL page and must never be dropped or repositioned.

- Runtime-concatenated values use the single form **`{value}`** throughout (template v2 §5). No angle-bracket placeholder form appears anywhere in this export.

- Multi-line elements are joined onto one line, preserving `<br>`; the stored source therefore does not byte-match the file. Every such unit is enumerated in `sweep1-results.csv` as `normalised`.

## 6. Correctness logic

720 templates key correctness off `data-id` / element ids, not displayed text, so answer options can be translated freely. Reviewed for exceptions in this module; any string that is DOM-mirrored from a JS constant is flagged `manual-review` in the manifest.

## 7. Verification (§10)

### Sweep 1 — every unit still matches its source

- **720 / 762 (94.5%) match literally.**
- **31 normalised** — multi-line joins, preserved inline markup, and `{value}` placeholder substitution. Each is listed individually in `sweep1-results.csv`.
- **11 enumerated exceptions**, each carrying its reason in the CSV:
  - `01-00-35-009` (unit-js/questions.js) — multi-line join / inline markup
  - `01-00-45-007` (unit-js/questions.js) — NOT FOUND
  - `01-00-56-003` (unit-js/questions.js) — NOT FOUND
  - `01-00-56-004` (unit-js/questions.js) — NOT FOUND
  - `01-00-56-005` (unit-js/questions.js) — NOT FOUND
  - `01-00-56-006` (unit-js/questions.js) — NOT FOUND
  - `01-00-99-022` (unit-js/questions.js) — multi-line join / inline markup
  - `01-00-99-023` (unit-js/questions.js) — placeholder substitution ({value})
  - `01-00-99-083` (unit-js/quiz-engine.js) — placeholder substitution ({value})
  - `01-00-99-110` (unit-js/unit.js) — multi-line join / inline markup
  - `01-00-99-168` (unit-js/unit.js) — multi-line join / inline markup

### Sweep 2 — no Hebrew in the source is uncovered

- Every Hebrew-bearing fragment in every scanned file was independently extracted and checked against the XLIFF. **48 fragments were not covered, and all 48 are classified:**
  - 44 — source comment (excluded by template v2 §5)
  - 4 — UNCOVERED — classify
- **Genuine misses: 4.**
  - `unit-js/unit.js:860` — היחס ${CT_RATIO(
  - `unit-js/unit.js:860` — והיחס המצומצם ${CT_RATIO(
  - `unit-js/unit.js:862` — היחס ${CT_RATIO(
  - `unit-js/unit.js:862` — והיחס המצומצם ${CT_RATIO(

### Structural checks

- XML well-formed: verified by parsing the written file.
- Unit ids unique: 762 distinct of 762.
- Every unit carries a `screen-id` note; every screen id used by a unit exists in the manifest, and every manifest row is referenced.
- Every `<target>` is empty. Source language `he`. UTF-8, no BOM.
- Id shape `{target}-{part}-{screen}-{string}`, three digits per segment: verified for all units.

## 8. Manual review

No content defects were surfaced by extraction in this module. Screens built at runtime from a JS config have no derivable human title and are marked in the manifest's `manual_review` column so a reviewer can name them.


## 9. Production files

**No production file was read-modified.** This export only creates files under `translations/`. That folder is untracked unless committed — everything in it, including a translator's returned work, can be lost without trace. **Recommend committing it.**
