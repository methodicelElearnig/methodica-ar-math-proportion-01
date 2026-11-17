/* MOE monday items of 06.10 + the KNOWN-ISSUES §1 canvas fix — real Chrome (puppeteer-core).
 *
 *   1. 06, peak question: no section shows "done" before it is answered (section ג was green from the
 *      start: its screen had no `step`, and an empty station counted as done); every section, ג
 *      included, carries the סעיף א׳–ד׳ stepper with itself current; answering ג paints its dot.
 *   2. 02-001 "הסימון עלה על התשובה": the year/answer dropdowns are drawn by us (appearance:none), so
 *      the ✓/✗ badge's padding holds in every browser (Safari ignored it on a native <select>).
 *   3. The canvas stays inside the window at eight window sizes (stage grid tracks).
 *
 *   NODE_PATH=/tmp/lomda-test/node_modules node _test/monday-2026-10-07.js [baseUrl]
 */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const puppeteer = require('puppeteer-core');
const ROOT = path.resolve(__dirname, '..');
const BASE_ARG = process.argv[2];
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const P = 'methodica-math-proportion-01-';
let pass = 0; const failures = [];
const ok = (scope, name, cond, detail) => { if (cond) pass++; else failures.push('  [' + scope + '] ' + name + (detail ? '\n      -> ' + detail : '')); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.webp': 'image/webp', '.gif': 'image/gif' };
const server = BASE_ARG ? null : http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });

const STEPPER = () => {
  const bar = document.querySelector('.screen.active .qstepper');
  if (!bar) return null;
  return [...bar.querySelectorAll('.qprog-station')].map((s) => ({
    label: s.querySelector('.qprog-label').textContent.trim(),
    current: s.classList.contains('is-current'),
    done: s.classList.contains('is-correct') || s.classList.contains('is-wrong'),
  }));
};

(async () => {
  let base = BASE_ARG;
  if (!base) { await new Promise((r) => server.listen(0, '127.0.0.1', r)); base = 'http://127.0.0.1:' + server.address().port + '/'; }
  if (!base.endsWith('/')) base += '/';
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  try {
    /* ── 1. the peak stepper ── */
    {
      const ctx = await browser.createBrowserContext(); const page = await ctx.newPage();
      await page.setViewport({ width: 1280, height: 720 });
      const errs = []; page.on('pageerror', (e) => errs.push(e.message));
      await page.goto(base + P + '06/index.html', { waitUntil: 'networkidle0' });
      const labels = ['البند أ', 'البند ب', 'البند ت', 'البند ث'];
      for (const [n, idx] of [[54, 0], [56, 1], [58, 2], [60, 3]]) {
        await page.evaluate((n) => goTo(n), n); await sleep(300);
        const st = await page.evaluate(STEPPER);
        ok('06 s' + n, 'has the four-section stepper', st && st.length === 4 && st.every((s, i) => s.label === labels[i]), JSON.stringify(st));
        ok('06 s' + n, labels[idx] + ' is current', st && st[idx].current && st.filter((s) => s.current).length === 1, JSON.stringify(st));
        ok('06 s' + n, 'nothing shows done before it is answered', st && st.every((s) => !s.done), JSON.stringify(st));
      }
      // answer ג (s58) through its own option and check button, then look from ד
      await page.evaluate(async () => {
        goTo(58); await new Promise((r) => setTimeout(r, 300));
        const opt = document.querySelector('#q58 .scq-opt[data-id="c"]'); opt.click();
        await new Promise((r) => setTimeout(r, 100));
        const chk = [...document.querySelectorAll('#q58 button')].find((b) => /إجابتي صحيحة/.test(b.innerText)); chk.click();
        await new Promise((r) => setTimeout(r, 300));
        goTo(60); await new Promise((r) => setTimeout(r, 300));
      });
      const st = await page.evaluate(STEPPER);
      ok('06 after ג', 'ג shows done, the others not', st && st[2].done && !st[0].done && !st[1].done && !st[3].done, JSON.stringify(st));
      ok('06', 'no page errors', errs.length === 0, errs.join(' | '));
      await ctx.close();
    }

    /* ── 2. dropdowns ── */
    {
      const ctx = await browser.createBrowserContext(); const page = await ctx.newPage();
      await page.setViewport({ width: 1280, height: 720 });
      await page.goto(base + P + '02/index.html', { waitUntil: 'networkidle0' });
      await page.evaluate(() => goTo(21)); await sleep(300);
      const r = await page.evaluate(async () => {
        const sels = [...document.querySelectorAll('#q21 .year-select')];
        sels[0].value = '2017'; sels[1].value = '2022'; sels.forEach((s) => s.dispatchEvent(new Event('change', { bubbles: true })));
        await new Promise((r) => setTimeout(r, 100));
        [...document.querySelectorAll('#q21 button')].find((b) => /إجابتي صحيحة/.test(b.innerText)).click();
        await new Promise((r) => setTimeout(r, 300));
        return sels.map((s) => { const cs = getComputedStyle(s); return { cls: s.className, app: cs.appearance, pr: parseFloat(cs.paddingRight), pl: parseFloat(cs.paddingLeft), img: cs.backgroundImage.split('url(').length - 1 }; });
      });
      r.forEach((s, i) => {
        ok('02 s21 select ' + i, 'marked correct', /correct/.test(s.cls), s.cls);
        ok('02 s21 select ' + i, 'drawn by us (appearance:none) — padding holds in Safari too', s.app === 'none', s.app);
        ok('02 s21 select ' + i, 'badge room on the right (>= 36px) and the arrow on the left', s.pr >= 36 && s.pl >= 30 && s.img === 2, JSON.stringify(s));
      });
      const dd = await page.evaluate(() => [...document.querySelectorAll('.dd-select')].map((s) => getComputedStyle(s).appearance));
      ok('02 .dd-select', 'every answer dropdown drawn by us', dd.length === 0 || dd.every((a) => a === 'none'), JSON.stringify(dd));
      await ctx.close();
    }

    /* ── 3. the canvas inside the window ── */
    for (const [w, h] of [[1920, 1080], [1366, 640], [1280, 720], [1024, 640], [800, 600], [768, 1024], [375, 812], [1600, 500]]) {
      for (const c of ['01', '06']) {
        const page = await browser.newPage(); await page.setViewport({ width: w, height: h });
        await page.goto(base + P + c + '/index.html', { waitUntil: 'networkidle0' }); await sleep(200);
        const a = await page.evaluate(() => { const r = document.getElementById('app').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round); });
        ok(c + ' ' + w + 'x' + h, 'canvas inside the window', a[0] >= -1 && a[1] >= -1 && a[2] <= w + 1 && a[3] <= h + 1, JSON.stringify(a));
        await page.close();
      }
    }
  } finally {
    await browser.close();
    if (server) server.close();
  }
  console.log(failures.length ? failures.join('\n') + '\n' : '');
  console.log(failures.length ? `=== monday 07.10: ${pass} passed, ${failures.length} failed ===` : `All ${pass} monday-2026-10-07 checks passed.`);
  process.exit(failures.length ? 1 : 0);
})().catch((e) => { console.error(e); if (server) server.close(); process.exit(2); });
