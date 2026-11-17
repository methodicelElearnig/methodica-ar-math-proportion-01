# methodica-math-proportion-01 — פרופורציה, יעד 2.1

The unit in the client's component folder structure, with **xAPI reporting,
issue reporting and resume** (2026-10-05 — see `docs-and-tools/REPORTING-RESUME.md`).
This repo is the place to edit; run the `_test/` suites after any change.

## Where the split comes from

Every slide in the approved deck carries an off-canvas item-code box
(`מספר פריט`). Those codes, plus the רכיב separator slides, define the
components (re-split 30.09.26 to the corrected deck — six components):

| component | screens | title (metadata) |
|---|---|---|
| `methodica-math-proportion-01-01` | 0–18  | בואו נלמד משהו חדש |
| `methodica-math-proportion-01-02` | 19–27 | זמן תרגול |
| `methodica-math-proportion-01-03` | 28–40 | זמן תרגול 2 |
| `methodica-math-proportion-01-04` | 41–42 | משימה בכיתה |
| `methodica-math-proportion-01-05` | 44–51 | בואו נאתגר את עצמנו |
| `methodica-math-proportion-01-06` | 52–60 | שאלת שיא |

Screens keep the unit's **global** numbering across all six components; 43 is
retired (deck slides 52 and 53 became one class-task screen).

**The platform owns routing.** Kata launches each component on its own link
and decides what comes next from our `completed` statements and the catalogue
(`recommendedAfterFail`, `isRequired`, order). A component's last click reports
and stops; it never navigates. The old in-unit routing (02 by score: ≥ 4 of 6 →
04, otherwise → 03) survives only for local walkthroughs with `?dev=1`.

## Layout

```
index.html          local-browsing launcher → component 01 (NEVER deployed)
README.md           this file
metadata/           one *_unit.json + six per-component JSONs (the catalogue)
unit-js/            ONE copy of all code, referenced as ../unit-js/ by every component
  10-identity 20-xapi 40-resume 50-loader   the platform layer (definition-only)
  motion quiz-engine questions unit engine  the 720-core engine + this unit's screens
  report-modal                              the "מצאתם בעיה?" form
  70-platform                               the glue: maps, painters, gates
  90-boot                                   the only file with top-level side effects — last
unit-css/styles.css one stylesheet for the unit
unit-assets/        every font, image, video and applet (one copy each)
methodica-math-proportion-01-NN/
  index.html        this component's static screens + the shared chrome
  index_dev.html    the DEV harness (identical in all six; never deployed)
  script.js         CONFIGURATION ONLY — PART_CONFIG + the xAPI maps and gate
_test/              headless harness + the local stand-in for the CDN library — NEVER deployed
docs-and-tools/     the unit record, packaging and Kata catalogue tooling — NEVER deployed
.qa/ spec/ tools/ translations/   source material and QA artefacts — never deployed
```

Script order in every component (one `?v=`):
`10-identity, 20-xapi, 40-resume, 50-loader, script.js, motion, quiz-engine,
questions, unit, report-modal, engine, 70-platform, 90-boot`.

## How a component knows what it owns

`window.PART_CONFIG = { start, end, next, prev }` (02 adds `routeByScore` +
`nextPass` / `nextFail`), set in the component's `script.js`:

- `engine.js` opens on `PART_CONFIG.start`; walking off either end goes to
  `partExit()` (70-platform.js), which reports the component and stops;
- `quiz-engine.js` and `unit.js` build only the screens inside the range.

## Testing and packaging

```bash
node _test/verify-assets.js
NODE_PATH=C:/lomda-test/node_modules node _test/verify-report.js
NODE_PATH=C:/lomda-test/node_modules node _test/statement-flow.js
pwsh -File docs-and-tools/build-package.ps1 -DryRun
```

jsdom lives outside the OneDrive tree. Packages are built from the allowlist
(`docs-and-tools/package-allowlist.ps1`) only. In a browser, serve the folder
above the repo and open a component with `?xapiLib=../_test/xapi-720-k.js`
(localhost only) to walk it against the stub library — see `_test/README.md`.

## Open — needs the owner

See `docs-and-tools/REPORTING-RESUME.md` §7: the `recommendedAfterFail` link
(03 → 02 in metadata vs the lesson's design, fail 02 → 03), the metadata
push, the live Kata run.
