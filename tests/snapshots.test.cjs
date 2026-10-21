const { test } = require('node:test');
const assert = require('node:assert/strict');
const { api: D, NOW, legacy } = require('./helpers/desk.cjs');
const bookmarklet = require('../claude-snapshot.js');
const snapshot = (hint = 'gemini') => ({
  kind: 'usage-snapshot',
  version: 1,
  source: 'screenshot-extraction',
  provider_hint: hint,
  captured_at: new Date(NOW).toISOString(),
  weekly: { used_percent: 42, resets_at: null },
  session: null,
});
test('snapshot JSON accepts Gemini/Dot hints and canonicalizes dots, without a fallback to Claude', () => {
  for (const hint of ['claude', 'grok', 'muse', 'gemini', 'dot', 'dots']) {
    const parsed = D.parseSnapshot(JSON.stringify(snapshot(hint)));
    assert.equal(parsed.ok, true);
    assert.equal(parsed.snapshot.provider_hint, hint === 'dots' ? 'dot' : hint);
  }
  assert.equal(D.parseSnapshot(snapshot('unknown')).ok, false);
  assert.equal(D.matchSnapshotProvider(snapshot('unknown'), D.makeSampleData(NOW).providers), null);
  assert.equal(
    D.matchSnapshotProvider({ source: 'screenshot-extraction' }, D.makeSampleData(NOW).providers),
    null
  );
});
test('one snapshot writes exactly one reading at capture time, preserves original data and optional session note', () => {
  const data = D.makeSampleData(NOW),
    before = JSON.stringify(data);
  const snap = D.parseSnapshot({
    ...snapshot('dot'),
    session: { used_percent: 5, resets_at: null },
  }).snapshot;
  const applied = D.applySnapshot(data, snap, 'snapshot-test', NOW);
  assert.equal(JSON.stringify(data), before);
  assert.equal(applied.data.logs.length, data.logs.length + 1);
  assert.equal(applied.entry.providerId, 'p-dot');
  assert.equal(applied.entry.ts, NOW);
  assert.equal(applied.entry.value, 42);
  assert.equal(applied.entry.kind, 'set');
  assert.match(applied.entry.note, /Session at 5%/);
});
test('ambiguous names, no matching provider and non-percent providers are rejected', () => {
  const data = D.makeSampleData(NOW);
  assert.throws(() => D.applySnapshot(data, snapshot('muse'), 'test', NOW), /measured in/);
  data.providers.push({ ...data.providers[3], id: 'other' });
  assert.equal(D.matchSnapshotProvider(snapshot(), data.providers), null);
  assert.throws(() => D.applySnapshot(data, snapshot(), 'test', NOW), /No provider matches/);
});
test('raw Claude endpoint payloads support fractions, percentages, reset_at and resets_at', () => {
  const reset = '2026-10-26T00:00:00Z';
  for (const [value, expected] of [
    [0.42, 42],
    [42, 42],
    [-1, 0],
    [120, 100],
  ]) {
    const parsed = D.parseSnapshot({
      seven_day: { utilization: value, reset_at: reset },
      five_hour: { utilization: 0.1, resets_at: reset },
    });
    assert.equal(parsed.ok, true);
    assert.equal(parsed.snapshot.weekly.used_percent, expected);
    assert.equal(parsed.snapshot.weekly.resets_at, new Date(reset).toISOString());
    assert.equal(parsed.snapshot.session.used_percent, 10);
  }
});
test('bad JSON, missing weekly data, unknown version and invalid percentages do not import', () => {
  for (const raw of [
    '{bad',
    {},
    [],
    { five_hour: { utilization: 0.2 } },
    { ...snapshot(), version: 99 },
    { ...snapshot(), weekly: {} },
    { ...snapshot(), weekly: { used_percent: 'bad' } },
  ])
    assert.equal(D.parseSnapshot(raw).ok, false);
});
test('legacy exports keep working and old logs do not gain invented notes', () => {
  const data = D.normalizeData(legacy());
  assert.equal(
    data.logs.some((log) => Object.hasOwn(log, 'note')),
    false
  );
  const applied = D.applySnapshot(
    data,
    D.parseSnapshot(snapshot('claude')).snapshot,
    'new-snap',
    NOW
  );
  assert.equal(applied.provider.name, 'Claude Pro (sample)');
});
test('readable bookmarklet helpers and imported raw endpoint use the same normalization', () => {
  const payload = {
    seven_day: { utilization: 0.37, reset_at: '2026-10-26T00:00:00Z' },
    five_hour: { utilization: 20 },
  };
  const converted = bookmarklet.usageToSnapshot(payload, new Date(NOW).toISOString());
  assert.equal(
    converted.weekly.used_percent,
    D.parseSnapshot(payload).snapshot.weekly.used_percent
  );
  assert.equal(converted.session.used_percent, 20);
  assert.equal(bookmarklet.orgIdFromOrgs([{ uuid: 'org' }]), 'org');
  assert.equal(bookmarklet.orgIdFromOrgs([{ id: 'old-org' }]), 'old-org');
  assert.equal(bookmarklet.orgIdFromOrgs([]), null);
});
test('bookmarklet refuses lookalike domains before reading any endpoint', () => {
  const vm = require('node:vm'),
    fs = require('node:fs');
  const src = fs.readFileSync(require.resolve('../claude-snapshot.js'), 'utf8');
  for (const hostname of ['evilclaude.ai', 'claude.ai.evil.test', 'desk.test']) {
    let requests = 0;
    const alerts = [];
    vm.runInNewContext(src, {
      location: { hostname },
      alert: (value) => alerts.push(value),
      fetch: async () => {
        requests++;
      },
    });
    assert.equal(requests, 0);
    assert.match(alerts[0], /Open claude.ai first/);
  }
});
