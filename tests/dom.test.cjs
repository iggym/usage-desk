const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  api: D,
  NOW,
  blank,
  legacy,
  openDesk,
  submit,
  change,
  upload,
} = require('./helpers/desk.cjs');
const withDesk = async (options, run) => {
  const d = openDesk(options);
  try {
    await run(d);
    assert.deepEqual(d.errors, []);
  } finally {
    d.close();
  }
};
test('fresh browser renders five agents, budget, indicators, local images, and links to both research pages', () =>
  withDesk({}, (d) => {
    assert.equal(d.doc.querySelectorAll('.pcard').length, 5);
    assert.equal(d.doc.querySelectorAll('.chip').length, 5);
    assert.equal(d.doc.querySelectorAll('.ring-num').length, 5);
    assert.match(d.$('budgetMetrics').textContent, /69.64/);
    assert.match(d.$('sampleBanner').textContent, /prices, charges/);
    assert.ok(d.doc.querySelector('a[href="agents.html"]'));
    assert.ok(d.doc.querySelector('a[href="numbers.html"]'));
    assert.equal(d.doc.querySelector('img[src^="data:"]'), null);
    assert.equal(d.read().version, 2);
  }));
test('v1 startup migrates once, preserves logs/settings and does not reseed', () =>
  withDesk({ stored: legacy(), settings: { sample: false, lintThreshold: 777 } }, (d) => {
    const data = d.read();
    assert.equal(data.providers.length, 5);
    assert.deepEqual(data.logs, legacy().logs);
    assert.equal(d.$('lintThreshold').value, '777');
    assert.equal(d.$('sampleBanner').classList.contains('show'), false);
    const second = openDesk({ stored: data });
    try {
      assert.equal(second.read().providers.length, 5);
    } finally {
      second.close();
    }
  }));
test('a deliberately empty stored desk stays empty with an unset budget', () =>
  withDesk({ stored: blank() }, (d) => {
    assert.equal(d.doc.querySelectorAll('.pcard').length, 0);
    assert.equal(d.read().finance.monthlyBudget, null);
    assert.ok(d.$('expenseProvider').disabled);
  }));
test('quick set and +1 record exactly one entry, persist after normalization, and update visual/status values', () =>
  withDesk({}, (d) => {
    const start = d.read().logs.length;
    const card = d.$('card-p-gemini');
    card.querySelector('input').value = '62';
    card.querySelector('.quickrow .primary').click();
    assert.equal(d.read().logs.length, start + 1);
    assert.equal(d.$('card-p-gemini').querySelector('.ring-num').textContent, '62%');
    const before = D.currentUsage(d.read().providers[1], d.read().logs, NOW).value;
    d.$('card-p-muse').querySelector('.quickrow button:last-child').click();
    assert.equal(d.read().logs.length, start + 2);
    assert.equal(d.read().logs.at(-1).value, before + 1);
  }));
test('budget/charge entry persists actual dollars without changing quota readings; delete and CSV work', () =>
  withDesk({}, (d) => {
    change(d, 'monthlyBudget', '100');
    change(d, 'reservePct', '20');
    submit(d, 'budgetForm');
    assert.equal(d.read().finance.monthlyBudget, 100);
    assert.equal(d.read().finance.reservePct, 20);
    const logs = d.read().logs.length;
    change(d, 'expenseAmount', '12.34');
    change(d, 'expenseNote', '=malicious note');
    submit(d, 'expenseForm');
    assert.equal(d.read().expenses.length, 3);
    assert.equal(d.read().expenses.at(-1).amount, 12.34);
    assert.equal(d.read().logs.length, logs);
    d.$('exportExpensesBtn').click();
    assert.match(d.downloads.at(-1).name, /expenses-2026-10\.csv/);
    [...d.$('expenseList').querySelectorAll('button')].at(-1).click();
    assert.equal(d.read().expenses.length, 2);
  }));
test('future charges and invalid monetary inputs do not write', () =>
  withDesk({}, (d) => {
    const before = JSON.stringify(d.read());
    change(d, 'expenseAmount', '10');
    change(d, 'expenseDate', '2026-10-22');
    submit(d, 'expenseForm');
    assert.equal(JSON.stringify(d.read()), before);
    change(d, 'expenseDate', '2026-10-21');
    change(d, 'expenseAmount', '-1');
    submit(d, 'expenseForm');
    assert.equal(JSON.stringify(d.read()), before);
  }));
test('provider presets remain unsaved templates and CRUD persists fees and deletes only matching logs', () =>
  withDesk({ stored: blank() }, (d) => {
    d.$('pf-preset-gemini').click();
    assert.equal(d.$('pf-name').value, 'Gemini Pro');
    assert.equal(d.$('pf-limit').value, '');
    assert.equal(d.read().providers.length, 0);
    change(d, 'pf-limit', '100');
    change(d, 'pf-monthly-cost', '19.99');
    submit(d, 'providerForm');
    assert.equal(d.read().providers.length, 1);
    assert.equal(d.read().providers[0].needsSetup, false);
    assert.equal(d.read().providers[0].monthlyCost, 19.99);
    d.$('providerList').querySelector('button').click();
    change(d, 'pf-name', 'My Gemini');
    change(d, 'pf-monthly-cost', '0');
    submit(d, 'providerForm');
    assert.equal(d.read().providers[0].name, 'My Gemini');
    assert.equal(d.read().providers[0].monthlyCost, 0);
    d.$('providerList').querySelector('button.danger').click();
    assert.equal(d.read().providers.length, 0);
  }));
test('poll-frequency scenario persists but never edits real schedules; pause plan uses current objects', () =>
  withDesk({}, (d) => {
    const original = JSON.stringify(d.read().bots.map((b) => b.routines));
    change(d, 'pollFactor', '3');
    change(d, 'pollFactor', '3', 'change');
    change(d, 'costPerRun', '.1', 'change');
    assert.equal(d.read().finance.pollFactor, 3);
    assert.equal(d.read().finance.costPerRun, 0.1);
    assert.equal(JSON.stringify(d.read().bots.map((b) => b.routines)), original);
    const box = d.$('pausePlan').querySelector('input');
    box.checked = true;
    box.dispatchEvent(new d.w.Event('change'));
    assert.equal(d.read().bots.filter((b) => b.pauseChecked).length, 1);
    const current = d.$('pausePlan').querySelector('input');
    current.checked = false;
    current.dispatchEvent(new d.w.Event('change'));
    assert.equal(d.read().bots.filter((b) => b.pauseChecked).length, 0);
  }));
test('bot/routine and prompt CRUD, variable fill-ins, copy count and linter keep working', () =>
  withDesk({ stored: blank() }, async (d) => {
    change(d, 'bf-name', 'Daily helper');
    const row = d.$('bf-routines').querySelector('.routine-row');
    row.querySelector('[data-f=name]').value = 'Check';
    row.querySelector('[data-f=schedule]').value = 'daily';
    submit(d, 'botForm');
    assert.equal(d.read().bots[0].routines[0].schedule, 'daily');
    d.$('botList').querySelector('button').click();
    change(d, 'bf-name', 'Updated helper');
    submit(d, 'botForm');
    assert.equal(d.read().bots[0].name, 'Updated helper');
    change(d, 'prf-title', 'Bounded prompt');
    change(d, 'prf-body', 'Summarize {{topic}} in at most 30 words, then stop.');
    submit(d, 'promptForm');
    const input = d.$('promptList').querySelector('.vars input');
    input.value = 'agents';
    input.dispatchEvent(new d.w.Event('input'));
    [...d.$('promptList').querySelectorAll('button')]
      .find((b) => /copy/i.test(b.textContent))
      .click();
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(d.copied.at(-1), 'Summarize agents in at most 30 words, then stop.');
    assert.equal(d.read().prompts[0].usedCount, 1);
    d.$('promptList').querySelector('button.danger').click();
    d.$('botList').querySelector('button.danger').click();
    assert.equal(d.read().prompts.length, 0);
    assert.equal(d.read().bots.length, 0);
  }));
test('full JSON export/import round trip includes the finance workspace and invalid imports leave state unchanged', () =>
  withDesk({}, async (d) => {
    const backup = JSON.stringify(d.read());
    d.$('exportBtn').click();
    assert.equal(d.downloads.at(-1).name, 'usage-desk-export.json');
    await upload(d, 'importFile', '{bad');
    assert.match(d.$('importMsg').textContent, /failed/);
    assert.equal(JSON.stringify(d.read()), backup);
    await upload(d, 'importFile', JSON.stringify({ ...d.read(), expenses: {} }));
    assert.match(d.$('importMsg').textContent, /failed/);
    assert.equal(JSON.stringify(d.read()), backup);
    await upload(d, 'importFile', JSON.stringify(blank()));
    assert.equal(d.read().providers.length, 0);
    await upload(d, 'importFile', backup);
    assert.equal(JSON.stringify(d.read()), backup);
    assert.equal(d.$('monthlyBudget').value, '150');
    assert.equal(d.$('importMsg').textContent, 'Import complete — data replaced from file.');
  }));
test('cancelling replacement import or clear does not change data', () =>
  withDesk({ confirm: false }, async (d) => {
    const before = JSON.stringify(d.read());
    await upload(d, 'importFile', JSON.stringify(blank()));
    d.$('clearAllBtn').click();
    assert.equal(JSON.stringify(d.read()), before);
    assert.equal(d.$('importMsg').textContent, 'Import cancelled.');
  }));
test('Gemini snapshot panel previews then confirms one new reading and clears the pending state', () =>
  withDesk({}, async (d) => {
    const count = d.read().logs.length;
    await upload(
      d,
      'snapshotFile',
      JSON.stringify({
        kind: 'usage-snapshot',
        version: 1,
        provider_hint: 'gemini',
        source: 'screenshot-extraction',
        captured_at: new Date(NOW).toISOString(),
        weekly: { used_percent: 77 },
      })
    );
    assert.match(d.$('snapshotPreview').textContent, /Gemini Pro/);
    assert.equal(d.$('snapshotConfirmBtn').disabled, false);
    assert.equal(d.read().logs.length, count);
    d.$('snapshotConfirmBtn').click();
    assert.equal(d.read().logs.length, count + 1);
    assert.equal(d.read().logs.at(-1).providerId, 'p-gemini');
    assert.equal(d.$('snapshotConfirmBtn').disabled, true);
  }));
test('corrupt saved data is never overwritten, even by edits; raw recovery export and explicit replacement work', () =>
  withDesk({ stored: '{broken original' }, async (d) => {
    await new Promise((resolve) => setTimeout(resolve, 5));
    assert.equal(d.w.localStorage.getItem('usagedesk:data:v1'), '{broken original');
    assert.equal(d.$('storageWarning').hidden, false);
    assert.match(d.$('storageWarning').textContent, /NOT been overwritten/);
    change(d, 'monthlyBudget', '777');
    submit(d, 'budgetForm');
    assert.equal(d.w.localStorage.getItem('usagedesk:data:v1'), '{broken original');
    d.$('exportUnreadableBtn').click();
    assert.equal(d.downloads.at(-1).name, 'usage-desk-original-saved-data.txt');
    await upload(d, 'importFile', JSON.stringify(blank()));
    assert.equal(d.read().providers.length, 0);
    assert.equal(d.$('storageWarning').hidden, true);
  }));
test('storage write failure leaves the app usable and a persistent backup warning visible', () =>
  withDesk({ storageBlocked: true }, (d) => {
    assert.equal(d.doc.querySelectorAll('.pcard').length, 5);
    assert.equal(d.$('storageWarning').hidden, false);
    assert.match(d.$('storageWarning').textContent, /Export a JSON backup/);
    assert.equal(d.w.localStorage.getItem('usagedesk:data:v1'), null);
  }));
test('clear sample explicitly creates a blank v2 desk and never reseeds on reload', () =>
  withDesk({}, (d) => {
    d.$('clearSampleBtn').click();
    const cleared = d.read();
    assert.equal(cleared.providers.length, 0);
    assert.equal(cleared.expenses.length, 0);
    assert.equal(cleared.finance.monthlyBudget, null);
    const next = openDesk({ stored: cleared });
    try {
      assert.equal(next.read().providers.length, 0);
    } finally {
      next.close();
    }
  }));
