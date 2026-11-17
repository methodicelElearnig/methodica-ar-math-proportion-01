#!/usr/bin/env node
/* =====================================================================
   methodica-math-proportion-01 — asset contract (guide §15.2 / §15.4 step 6)
   Adapted from methodica-math-ratio-04 _test/verify-assets.js.

   Static, no dependencies:   node _test/verify-assets.js
   Exit code 1 on any failure.

   1. every src/href in every component's index.html resolves, CASE-EXACT
      (fs.existsSync is case-insensitive on Windows; the CDN is not)
   2. every CSS url() resolves from the STYLESHEET's own folder
   3. every asset path written in unit-js resolves from every component
      (this unit hoisted EVERY asset to unit-assets/ — no component keeps
      a local assets/ folder), runtime-built families expanded
   4. ?v= on every code reference, one value across all components
   5. nothing hoisted grew back inside a component
   6. the shared tail of index.html (hint overlay, report dialogs, script
      tags) and the <head> are byte-identical across components
   ===================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const UNIT = 'methodica-math-proportion-01';
const PARTS = [1, 2, 3, 4, 5, 6].map(n => `${UNIT}-0${n}`);

/* The six character stills named in unit.js characterAssets that never existed in any component
   (the unit shipped them as TODO poses). Each is only the <img> fallback of a transition
   that always carries a video, so none is ever requested — asserted below, so this list cannot
   hide a real miss. */
const KNOWN_FALLBACK_ONLY = ['training', 'book', 'notebook', 'workout', 'peak', 'failure']
  .map(k => `../unit-assets/img/character-orange-${k}.png`);
/* Runtime-built names: unit.js writes `racing-stage-${n}.jpeg` for n = 1, 2. */
const FAMILIES = { '../unit-assets/img/racing-stage-${n}.jpeg': [1, 2] };

let fails = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { fails++; console.log('  FAIL ' + msg); } }
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = p => fs.existsSync(path.join(ROOT, p));

/* case-exact: every segment must appear verbatim in its parent's listing */
function resolveExact(rel) {
  const segs = path.normalize(rel).split(path.sep).filter(Boolean);
  if (segs[0] === '..') return false;             // escaped the unit root
  let dir = ROOT;
  for (const s of segs) {
    let names;
    try { names = fs.readdirSync(dir); } catch (e) { return false; }
    if (!names.includes(s)) return false;
    dir = path.join(dir, s);
  }
  return true;
}
const local = u => !/^(https?:|data:|#|mailto:|javascript:|about:)/.test(u) && u.trim() !== '';
const strip = u => u.split('#')[0].split('?')[0];
const fromPart = (part, u) => path.posix.normalize(`${part}/${strip(u)}`);

/* 1 + 4 + 6 — index.html references */
console.log('index.html references');
const versions = new Set();
const tails = [], heads = [];
for (const part of PARTS) {
  const html = read(`${part}/index.html`);
  for (const m of html.matchAll(/\b(?:src|href|poster)\s*=\s*"([^"]+)"/g)) {
    const u = m[1];
    if (!local(u) || u.includes('${')) continue;
    ok(resolveExact(fromPart(part, u)), `${part}/index.html → ${u}`);
    if (/\.(js|css)(\?|$)/.test(u)) {
      const v = (u.match(/[?&]v=([^&#]+)/) || [])[1];
      ok(!!v, `${part}/index.html: no ?v= on ${u}`);
      if (v) versions.add(v);
    }
  }
  const at = html.indexOf('<!-- Quiz hint overlay');
  ok(at >= 0, `${part}/index.html has the shared hint overlay`);
  tails.push(html.slice(at));
  heads.push((html.match(/<head>[\s\S]*<\/head>/) || [''])[0].replace(/<title>[^<]*<\/title>/, ''));
}
ok(versions.size === 1, `one ?v= across all components (found: ${[...versions].join(', ')})`);
ok(tails.every(t => t === tails[0]), 'shared index.html tail is identical in all components');
ok(heads.every(h => h === heads[0]), '<head> (title aside) is identical in all components');

/* 2 — CSS url() from the stylesheet's own folder */
console.log('CSS url()');
const cssFiles = [];
(function walk(d) {
  for (const n of fs.readdirSync(path.join(ROOT, d))) {
    if (n === '.git' || n === 'node_modules' || n === '_test' || n === '.qa') continue;
    const p = d ? `${d}/${n}` : n;
    if (fs.statSync(path.join(ROOT, p)).isDirectory()) walk(p);
    else if (n.endsWith('.css')) cssFiles.push(p);
  }
})('');
ok(cssFiles.includes('unit-css/styles.css') && cssFiles.includes('unit-assets/fonts/fonts.css'), 'the two shared stylesheets exist');
for (const css of cssFiles) {
  const src = read(css);
  for (const m of src.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
    if (!local(m[2])) continue;
    ok(resolveExact(path.posix.normalize(`${path.posix.dirname(css)}/${strip(m[2])}`)), `${css} → ${m[2]}`);
  }
}

/* 3 — asset paths written in JS: every one must resolve from EVERY component */
console.log('unit-js asset paths');
const ASSET_RE = /(?:\.\.\/)?(?:unit-assets|assets)\/[A-Za-z0-9_./${}-]+\.(?:png|jpe?g|gif|svg|mp4|webm|woff2?|css|html)/g;
let refCount = 0;
for (const f of fs.readdirSync(path.join(ROOT, 'unit-js')).filter(n => n.endsWith('.js'))) {
  const src = read(`unit-js/${f}`).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  for (const u of src.match(ASSET_RE) || []) {
    refCount++;
    ok(u.startsWith('../unit-assets/'), `unit-js/${f} → ${u} is a hoisted path`);
    if (KNOWN_FALLBACK_ONLY.includes(u)) continue;
    const list = FAMILIES[u] ? FAMILIES[u].map(n => u.replace('${n}', n)) : [u];
    ok(!u.includes('${') || !!FAMILIES[u], `unit-js/${f} → ${u}: an unknown runtime-built name`);
    for (const one of list) {
      ok(PARTS.every(p => resolveExact(fromPart(p, one))), `unit-js/${f} → ${one} (from every component)`);
    }
  }
}
ok(refCount >= 48, `reference floor: ${refCount} asset paths found in unit-js (expected ≥ 48)`);

/* the fallback-only names really are fallback-only: every transition that names one has a video */
{
  const unit = read('unit-js/unit.js');
  const trans = [...unit.matchAll(/\{ screen: (\d+), kind: 'transition'([\s\S]*?)\]?\s*\},?\n/g)];
  ok(trans.length >= 9, `found the transition configs (${trans.length})`);
  for (const t of trans) ok(/video:\s*'\.\.\/unit-assets\/video\//.test(t[2]), `transition screen ${t[1]} carries a video (its still is only a fallback)`);
  for (const u of KNOWN_FALLBACK_ONLY) ok(!resolveExact(fromPart(PARTS[0], u)), `${u} is still absent — drop it from KNOWN_FALLBACK_ONLY if it was added`);
}

/* 5 — nothing hoisted grew back */
console.log('no stale copies');
for (const part of PARTS) {
  ok(!exists(`${part}/styles.css`), `${part}/styles.css must not exist (shared: unit-css/styles.css)`);
  ok(!exists(`${part}/assets`), `${part}/assets must not exist (every asset lives in unit-assets/)`);
}
ok(!exists('index.html') || /index\.html' \+ window\.location\.search/.test(read('index.html')),
  'the repo-only root launcher names index.html and keeps the query string');

console.log(`\n${checks - fails}/${checks} checks passed` + (fails ? ` — ${fails} FAILED` : ''));
process.exit(fails ? 1 : 0);
