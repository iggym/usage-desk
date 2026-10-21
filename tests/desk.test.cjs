const { test } = require('node:test');
const assert = require('node:assert/strict');
const { api: D, NOW, blank, legacy } = require('./helpers/desk.cjs');
const near = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} ≠ ${expected}`);

test('escaping and template fill-ins are text-safe, distinct and preserve missing values', () => {
  assert.equal(D.escapeHtml(`<img x="'">&`), '&lt;img x=&quot;&#39;&quot;&gt;&amp;');
  assert.deepEqual(D.extractVars('{{ task }} / {{task}} / {{who}}'), ['task', 'who']);
  assert.equal(
    D.fillTemplate('{{ task }} {{ count }} {{missing}}', { task: '<x>', count: 0 }),
    '<x> 0 {{missing}}'
  );
  assert.equal(D.approxTokens('12345'), 2);
});
test('schedule parsing, manual overrides and unknown schedules retain original behavior', () => {
  for (const [text, expected] of [
    ['daily', 7],
    ['weekdays', 5],
    ['weekly', 1],
    ['3x/day', 21],
    ['every 6h', 28],
    ['every 30 min', 336],
    ['twice a week', 2],
    ['every 2 days', 3.5],
    ['every 2 weeks', 0.5],
    ['every 0h', null],
    ['sometimes', null],
  ])
    assert.equal(D.parseSchedule(text), expected, text);
  assert.equal(D.routineRunsPerWeek({ schedule: 'daily', runsPerWeekOverride: 2 }), 2);
  assert.equal(D.routineRunsPerWeek({ schedule: 'daily', runsPerWeekOverride: -3 }), 7);
});
test('least-squares forecast: rise, flat, decline, missing and coincident readings', () => {
  assert.equal(
    D.linearForecast(
      [
        { t: NOW, v: 20 },
        { t: NOW + 1000, v: 30 },
      ],
      100
    ),
    NOW + 8000
  );
  for (const points of [
    [],
    [{ t: 0, v: 1 }],
    [
      { t: 0, v: 1 },
      { t: 1, v: 1 },
    ],
    [
      { t: 0, v: 2 },
      { t: 1, v: 1 },
    ],
    [
      { t: 0, v: 1 },
      { t: 0, v: 2 },
    ],
  ])
    assert.equal(D.linearForecast(points, 100), null);
});
test('five sample agents are illustrative and financial state is reproducible', () => {
  const sample = D.makeSampleData(NOW);
  assert.deepEqual(
    sample.providers.map((p) => p.name.replace(' (sample)', '')),
    ['Grok Bot', 'Muse', 'Claude Pro', 'Gemini Pro', 'Dot']
  );
  assert.equal(sample.version, 2);
  assert.equal(sample.expenses.length, 2);
  near(D.monthlyBudgetSummary(sample, NOW).committed, 69.64);
});
test('v1 migration preserves original records and adds Gemini and Dot once', () => {
  const old = legacy(),
    before = JSON.stringify(old),
    migrated = D.normalizeData(old);
  assert.equal(JSON.stringify(old), before);
  assert.equal(migrated.version, 2);
  assert.equal(migrated.providers.length, 5);
  assert.deepEqual(migrated.logs, old.logs);
  for (const name of ['Gemini Pro', 'Dot']) {
    const p = migrated.providers.find((p) => p.name === name);
    assert.ok(p.needsSetup);
    assert.equal(p.monthlyCost, null);
  }
  assert.deepEqual(D.parseImport(D.serializeData(migrated)), migrated);
});
test('v1 migration detects existing agent names and avoids ID collisions', () => {
  const old = legacy();
  old.providers[0].name = 'My Gemini Pro';
  old.providers[1].id = 'p-dot';
  const result = D.normalizeData(old);
  assert.equal(result.providers.filter((p) => /gemini/i.test(p.name)).length, 1);
  assert.equal(result.providers.find((p) => p.name === 'Dot').id, 'p-dot-new');
});
test('intentionally blank desks and deleted v2 trackers are never repopulated', () => {
  assert.equal(D.normalizeData(blank(1)).providers.length, 0);
  const sample = D.makeSampleData(NOW);
  sample.providers = sample.providers.slice(0, 3);
  assert.equal(D.parseImport(D.serializeData(sample)).providers.length, 3);
});
test('schema rejects wrong shape/version, malformed finance/expenses, duplicate IDs', () => {
  for (const raw of [
    null,
    [],
    { ...blank(), version: 99 },
    { ...blank(), logs: {} },
    { ...blank(), finance: [] },
    { ...blank(), expenses: {} },
    { ...blank(), expenses: [null] },
    { ...blank(), logs: [{ id: 'same' }, { id: 'same' }] },
    { ...blank(), logs: [{ ts: 1e20 }] },
  ])
    assert.equal(D.validateData(raw).ok, false, JSON.stringify(raw));
  assert.throws(() => D.parseImport('{bad'), /valid JSON/);
});
test('money distinguishes explicit zero from unknown and rejects non-finite or excessive input', () => {
  assert.equal(D.optionalMoney(0), 0);
  assert.equal(D.optionalMoney('19.99'), 19.99);
  for (const v of [null, undefined, '', false, {}, -1, Infinity, NaN, 1e13])
    assert.equal(D.optionalMoney(v), null);
  for (const value of [-1, 'oops', false, 1e13])
    assert.throws(
      () => D.normalizeData({ ...blank(), finance: { monthlyBudget: value } }),
      /finite USD/
    );
  assert.equal(D.normalizeFinance({ reservePct: 200 }).reservePct, 90);
  assert.equal(D.normalizeProvider({ usageUrl: 'javascript:alert(1)' }, 0).usageUrl, '');
});
test('invalid calendar dates and amounts are rejected without dropping the expense ledger', () => {
  for (const date of ['2026-02-30', '2026-13-01', '10/21/2026', '2026-1-01'])
    assert.equal(D.validDateOnly(date), false);
  assert.equal(D.validDateOnly('2024-02-29'), true);
  for (const expense of [
    { date: '2026-10-21', amount: -1 },
    { date: '2026-02-30', amount: 1 },
  ])
    assert.throws(() => D.normalizeData({ ...blank(), expenses: [expense] }));
});
test('USD calendar-month summary includes known fees and only charges through today in UTC', () => {
  const data = D.makeSampleData(NOW);
  data.expenses.push(
    ...[
      { id: 'future', date: '2026-10-22', amount: 999 },
      { id: 'old', date: '2026-09-30', amount: 999 },
    ].map((e) => ({ ...e, providerId: 'p-dot', providerName: 'Dot', note: '' }))
  );
  const m = D.monthlyBudgetSummary(data, NOW);
  near(m.fixed, 59.99);
  near(m.variable, 9.65);
  near(m.projected, 59.99 + (9.65 / 21) * 31);
  assert.equal(m.daysLeft, 11);
  near(m.remaining, 80.36);
  near(m.reserve, 15);
  near(m.dailyAllowance, (135 - 69.64) / 11);
  assert.equal(m.expenses.length, 2);
});
test('zero/unset/overspent budgets, unknown fees and leap-year boundaries are finite', () => {
  const data = D.makeSampleData(NOW);
  data.finance.monthlyBudget = 0;
  let m = D.monthlyBudgetSummary(data, NOW);
  assert.equal(m.dailyAllowance, 0);
  assert.equal(m.pct, 100);
  assert.ok(m.remaining < 0);
  data.finance.monthlyBudget = null;
  data.providers[0].monthlyCost = null;
  m = D.monthlyBudgetSummary(data, Date.parse('2024-02-29T23:59:59Z'));
  assert.equal(m.dailyAllowance, null);
  assert.equal(m.daysInMonth, 29);
  assert.equal(m.daysLeft, 1);
  assert.equal(m.unknownFees, 1);
  assert.equal(D.monthlyBudgetSummary(data, Date.parse('2026-01-01T00:00:00Z')).daysLeft, 31);
});
test('quota percentages do not become dollars and removed-provider charges survive backups', () => {
  const data = D.makeSampleData(NOW),
    cost = D.monthlyBudgetSummary(data, NOW).committed;
  data.logs.push({ id: 'cost-test', providerId: 'p-claude', ts: NOW, value: 100 });
  assert.equal(D.monthlyBudgetSummary(data, NOW).committed, cost);
  data.providers = data.providers.filter((p) => p.id !== 'p-claude');
  const restored = D.parseImport(D.serializeData(data));
  assert.equal(restored.expenses[0].providerName, 'Claude Pro (sample)');
});
test('routine savings exclude paused, deleted and reported-paused routines; retain unknown flag', () => {
  const bot = {
    id: 'a',
    status: 'active',
    routines: [{ schedule: 'every 6h' }, { schedule: 'unknown' }],
  };
  const input = [
      bot,
      { ...bot, status: 'paused' },
      { ...bot, status: 'deleted' },
      { ...bot, pauseChecked: true },
    ],
    before = JSON.stringify(input);
  const s = D.routineSavings(input, 2, 0.02);
  assert.equal(s.weekly, 28);
  assert.equal(s.afterWeekly, 14);
  assert.equal(s.unknown, 1);
  near(s.monthlySavings, ((14 * 52) / 12) * 0.02);
  assert.equal(JSON.stringify(input), before);
  assert.equal(D.routineSavings(input, 1, 0).monthlySavings, 0);
});
test('headroom suggestions match units, respect reserve, and exclude unconfigured templates', () => {
  const data = D.makeSampleData(NOW);
  let candidates = D.quotaCandidates(data.providers, data.logs, NOW, 'percent', '', 55, 10);
  assert.equal(candidates[0].provider.id, 'p-dot');
  assert.equal(candidates[0].fits, true);
  assert.ok(!candidates.some((c) => c.provider.id === 'p-muse'));
  data.providers.find((p) => p.id === 'p-dot').needsSetup = true;
  assert.ok(
    !D.quotaCandidates(data.providers, data.logs, NOW, 'percent', '', 1, 10).some(
      (c) => c.provider.id === 'p-dot'
    )
  );
  const custom = D.normalizeProvider(
    { id: 'c', measure: 'custom', unitLabel: 'Credits', limit: 100 },
    0
  );
  assert.equal(D.quotaCandidates([custom], [], NOW, 'custom', 'credits', 90, 10)[0].fits, true);
  assert.equal(D.quotaCandidates([custom], [], NOW, 'custom', 'tokens', 1, 10).length, 0);
});
test('expense CSV escapes quotes, multiline notes and spreadsheet formulas', () => {
  const csv = D.expenseCsv([
    {
      date: '2026-10-21',
      providerName: '=HYPERLINK("bad")',
      amount: 2.5,
      note: '@SUM(1)\nsecond line',
    },
  ]);
  assert.ok(csv.includes(`"'=HYPERLINK(""bad"")"`));
  assert.ok(csv.includes(`"'@SUM(1)\nsecond line"`));
  assert.ok(csv.includes('"2.50"'));
});
test('weekly timezone boundaries span DST changes and monthly days clamp safely', () => {
  const p = D.normalizeProvider(
    { reset: { type: 'weekly', weekday: 1, time: '09:00' }, tz: 'America/Chicago' },
    0
  );
  const fall = D.windowBounds(p, Date.parse('2026-10-28T12:00:00Z'));
  assert.equal(fall.start, Date.parse('2026-10-26T14:00:00Z'));
  assert.equal(fall.end - fall.start, 169 * D.HOUR_MS);
  const spring = D.windowBounds(p, Date.parse('2026-03-06T12:00:00Z'));
  assert.equal(spring.end - spring.start, 167 * D.HOUR_MS);
  p.reset = { type: 'monthly', day: 31, time: '00:00' };
  p.tz = 'UTC';
  const feb = D.windowBounds(p, Date.parse('2026-02-28T12:00:00Z'));
  assert.equal(feb.start, Date.parse('2026-02-28T00:00:00Z'));
  assert.equal(feb.end, Date.parse('2026-03-31T00:00:00Z'));
});
test('latest reading is bounded by reset and ignores future logs; review excludes future readings', () => {
  const data = D.makeSampleData(NOW),
    p = data.providers[0],
    before = D.currentUsage(p, data.logs, NOW).value;
  data.logs.push({ id: 'future', providerId: p.id, ts: NOW + 1000, value: 999 });
  assert.equal(D.currentUsage(p, data.logs, NOW).value, before);
  assert.ok(!D.reviewMarkdown(data, NOW).includes('999'));
});
test('prompt linter and review Markdown keep useful limits and original history', () => {
  assert.ok(D.lintPrompt('Keep an eye on this and produce a detailed report', 250).length >= 3);
  assert.equal(D.lintPrompt('List at most 3 useful items, then stop.', 250).length, 0);
  assert.match(D.reviewMarkdown(D.makeSampleData(NOW), NOW), /# Usage Desk.*weekly review/);
});
