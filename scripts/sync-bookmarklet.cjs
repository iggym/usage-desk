// Keep the readable console script and the draggable bookmarklet in sync.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'claude-snapshot.js'), 'utf8').trim();
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const embedded = /(<script\b(?=[^>]*\bid="claudeSnapshotSrc")[^>]*>)[\s\S]*?(<\/script>)/;
const bookmark = /(<a\b(?=[^>]*\bid="bookmarkletLink")[^>]*\bhref=")[^"]*(")/;
if (!embedded.test(html) || !bookmark.test(html)) throw new Error('Bookmarklet slots not found');
html = html.replace(embedded, (_, start, end) => start + '\n' + src + '\n' + end);
html = html.replace(
  bookmark,
  (_, start, end) => start + 'javascript:' + encodeURIComponent(src) + end
);
fs.writeFileSync(file, html);
console.log('Updated both embedded bookmarklet copies.');
