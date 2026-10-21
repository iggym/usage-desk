// Static integrity checks for the deployable files; no network or build required.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const pages = ['index.html', 'agents.html', 'numbers.html'];
const documents = new Map();
let references = 0;
for (const name of pages) {
  const html = fs.readFileSync(path.join(root, name), 'utf8');
  const doc = new JSDOM(html).window.document;
  documents.set(name, doc);
  assert.equal(doc.documentElement.lang, 'en', name + ': language');
  assert.equal(doc.querySelectorAll('h1').length, 1, name + ': one page heading');
  assert.equal(doc.querySelectorAll('main').length, 1, name + ': one main landmark');
  const ids = [...doc.querySelectorAll('[id]')].map((el) => el.id);
  assert.equal(new Set(ids).size, ids.length, name + ': duplicate IDs');
  for (const script of doc.scripts) {
    if (!script.src && script.type !== 'text/plain') new Function(script.textContent);
  }
  for (const a of doc.querySelectorAll('a[target="_blank"]'))
    assert.ok(a.relList.contains('noopener'), name + ': unsafe new tab');
  for (const el of doc.querySelectorAll('[src]'))
    assert.ok(!/^https?:\/\//.test(el.getAttribute('src')), name + ': remote runtime asset');
}
for (const [name, doc] of documents) {
  for (const el of doc.querySelectorAll('[href], [src]')) {
    const ref = el.getAttribute('href') || el.getAttribute('src');
    if (!ref || /^(https?:|mailto:|javascript:|data:)/i.test(ref)) continue;
    const url = new URL(ref, 'https://desk.test/' + name);
    const file = path.join(root, decodeURIComponent(url.pathname));
    assert.ok(fs.existsSync(file), `${name}: missing local file ${ref}`);
    references++;
    if (url.hash && url.pathname.endsWith('.html')) {
      const targetDoc = documents.get(url.pathname.slice(1));
      assert.ok(
        targetDoc && targetDoc.getElementById(url.hash.slice(1)),
        `${name}: missing anchor ${ref}`
      );
    }
  }
}
for (const file of [
  'assets/shared.js',
  'assets/research.js',
  'assets/insights.js',
  'claude-snapshot.js',
])
  new Function(fs.readFileSync(path.join(root, file), 'utf8'));
const home = documents.get('index.html');
const readable = fs.readFileSync(path.join(root, 'claude-snapshot.js'), 'utf8').trim();
assert.equal(
  home.getElementById('claudeSnapshotSrc').textContent.trim(),
  readable,
  'Readable bookmarklet drift; run npm run sync:bookmarklet'
);
const decoded = decodeURIComponent(
  home.getElementById('bookmarkletLink').getAttribute('href').slice('javascript:'.length)
);
assert.equal(decoded, readable, 'Draggable bookmarklet drift; run npm run sync:bookmarklet');
new Function(decoded);
const css = fs.readFileSync(path.join(root, 'assets/desk.css'), 'utf8');
assert.ok(!/https?:\/\//.test(css), 'Remote CSS asset');
const styleDoc = new JSDOM('<style>' + css + '</style>').window.document;
assert.ok(styleDoc.styleSheets[0].cssRules.length > 100, 'Stylesheet failed to parse');
assert.ok(
  home.querySelector('a[href="agents.html"]') && home.querySelector('a[href="numbers.html"]'),
  'Both research pages must be linked from home'
);
console.log(
  `Static integrity passed: 3 pages, ${references} local references, JS/CSS syntax and both bookmarklet copies.`
);
