const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const root = path.resolve(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const pure = html.split('/*PURE-START*/')[1].split('/*PURE-END*/')[0];
const names = [...pure.matchAll(/function\s+(\w+)\s*\(/g)].map((match) => match[1]);
const api = new Function(
  pure + '\nreturn {' + [...new Set(names), 'DATA_VERSION', 'DAY_MS', 'HOUR_MS'].join(',') + '};'
)();
const NOW = Date.parse('2026-10-21T12:00:00Z');
function blank(version = 2) {
  return { version, providers: [], logs: [], bots: [], prompts: [] };
}
function legacy() {
  const data = api.makeSampleData(NOW);
  data.version = 1;
  data.providers = data.providers.slice(0, 3);
  data.logs = data.logs.filter((log) => data.providers.some((p) => p.id === log.providerId));
  data.providers.forEach((p) => {
    delete p.monthlyCost;
    delete p.costPerUnit;
    delete p.needsSetup;
  });
  delete data.finance;
  delete data.expenses;
  return data;
}
function openDesk({ stored, settings, confirm = true, storageBlocked = false, now = NOW } = {}) {
  const errors = [],
    copied = [],
    blobs = [],
    downloads = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (error) => errors.push(error.message));
  const dom = new JSDOM(html, {
    url: 'https://desk.test/index.html',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole,
  });
  const w = dom.window;
  const RealDate = w.Date;
  w.Date = class extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : [now]));
    }
    static now() {
      return now;
    }
  };
  w.matchMedia = () => ({ matches: true, addEventListener() {} });
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.confirm = () => confirm;
  w.document.execCommand = () => true;
  Object.defineProperty(w.navigator, 'clipboard', {
    value: { writeText: async (value) => copied.push(value) },
  });
  w.URL.createObjectURL = (blob) => {
    blobs.push(blob);
    return 'blob:desk-' + blobs.length;
  };
  w.URL.revokeObjectURL = () => {};
  w.HTMLAnchorElement.prototype.click = function () {
    downloads.push({ name: this.download, url: this.href });
  };
  if (stored !== undefined)
    w.localStorage.setItem(
      'usagedesk:data:v1',
      typeof stored === 'string' ? stored : JSON.stringify(stored)
    );
  if (settings) w.localStorage.setItem('usagedesk:settings:v1', JSON.stringify(settings));
  if (storageBlocked)
    w.Storage.prototype.setItem = () => {
      throw new Error('Storage blocked');
    };
  w.eval(fs.readFileSync(path.join(root, 'assets/shared.js'), 'utf8'));
  const doc = w.document;
  const module = [...doc.scripts].find((script) => script.type === 'module');
  w.eval(module.textContent);
  return {
    dom,
    w,
    doc,
    errors,
    copied,
    blobs,
    downloads,
    $: (id) => doc.getElementById(id),
    read: () => JSON.parse(w.localStorage.getItem('usagedesk:data:v1')),
    close: () => w.close(),
  };
}
function submit(desk, id) {
  desk.$(id).dispatchEvent(new desk.w.Event('submit', { bubbles: true, cancelable: true }));
}
function change(desk, id, value, type = 'input') {
  desk.$(id).value = value;
  desk.$(id).dispatchEvent(new desk.w.Event(type, { bubbles: true }));
}
async function upload(desk, id, text) {
  Object.defineProperty(desk.$(id), 'files', {
    configurable: true,
    value: [{ text: async () => text }],
  });
  desk.$(id).dispatchEvent(new desk.w.Event('change', { bubbles: true }));
  await new Promise((resolve) => setImmediate(resolve));
}
module.exports = { api, html, root, NOW, blank, legacy, openDesk, submit, change, upload };
