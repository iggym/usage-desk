const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const zlib = require('node:zlib');
const { execFileSync } = require('node:child_process');
const { chromium } = require('@playwright/test');
const root = path.resolve(__dirname, '../..');
async function startBrowser() {
  if (process.env.CHROMIUM_PATH)
    return chromium.launch({
      executablePath: process.env.CHROMIUM_PATH,
      headless: true,
      args: ['--no-sandbox'],
    });
  const bundled = require('@sparticuz/chromium').default;
  const env = { ...process.env };
  if (process.platform === 'linux') {
    // The Lambda Chromium bundle ships its Linux libraries. Extract them locally;
    // no apt, sudo, extra downloads or platform-specific absolute paths are needed.
    const dir = path.join(root, 'test-results/chromium-libs');
    const lib = path.join(dir, 'lib');
    if (!fs.existsSync(path.join(lib, 'libnspr4.so'))) {
      fs.mkdirSync(dir, { recursive: true });
      const archive = path.join(dir, 'al2023.tar');
      const packed = path.join(root, 'node_modules/@sparticuz/chromium/bin/al2023.tar.br');
      fs.writeFileSync(archive, zlib.brotliDecompressSync(fs.readFileSync(packed)));
      execFileSync('tar', ['-xf', archive, '-C', dir]);
      fs.unlinkSync(archive);
    }
    env.LD_LIBRARY_PATH = [lib, env.LD_LIBRARY_PATH].filter(Boolean).join(':');
  }
  return chromium.launch({
    executablePath: await bundled.executablePath(),
    headless: true,
    args: bundled.args.filter((arg) => arg !== '--single-process'),
    env,
  });
}
async function startSite() {
  const mime = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.md': 'text/plain',
  };
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://desk.test').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(file, (error, data) => {
      res.writeHead(error ? 404 : 200, {
        'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      });
      res.end(error ? 'Not found' : data);
    });
  });
  await new Promise((resolve) => server.listen(0, '0.0.0.0', resolve));
  return {
    url: 'http://127.0.0.1:' + server.address().port,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
module.exports = { root, startBrowser, startSite };
