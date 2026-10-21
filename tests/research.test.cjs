const { test } = require('node:test');
const assert = require('node:assert/strict');
const R = require('../assets/research.js');
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} ≠ ${b}`);
const inputs = {
  inputTokens: 2000,
  outputTokens: 800,
  inputRate: 3,
  outputRate: 15,
  steps: 6,
  retryPct: 20,
  successPct: 80,
  toolCost: 0.01,
  reviewMinutes: 2,
  hourlyRate: 30,
};
test('all research records resolve to dated/reviewed primary sources or an explicitly labeled survey', () => {
  assert.equal(R.reviewed, '2026-10-21');
  assert.equal(R.sources.length, 46);
  assert.equal(new Set(R.sources.map((s) => s.id)).size, 46);
  for (const s of R.sources) {
    assert.match(s.url, /^https:\/\//);
    assert.equal(s.reviewed, R.reviewed);
    if (s.date) assert.ok(s.date <= R.reviewed);
  }
  const exists = (id) =>
    assert.ok(
      R.sources.some((s) => s.id === id),
      'Missing source ' + id
    );
  for (const p of R.products) {
    exists(p.source);
    (p.extraSources || []).forEach(exists);
  }
  R.metrics.forEach((m) => {
    exists(m.source);
    assert.ok(m.unit && m.date && m.caveat && m.kind);
  });
  R.people.forEach((p) => exists(p.source));
  Object.values(R.series).forEach((s) =>
    s.points.forEach((p) => {
      exists(p.source);
      assert.ok(p.date <= R.reviewed);
      assert.ok(Number.isFinite(p.value));
    })
  );
});
test('directory search is case-insensitive, category-bound and has an empty state', () => {
  assert.equal(R.filterProducts('all', '').length, 18);
  assert.equal(R.filterProducts('personal', '').length, 5);
  assert.equal(R.filterProducts('all', '  GEMINI  ')[0].id, 'gemini');
  assert.ok(R.filterProducts('builders', 'durable').some((p) => p.id === 'langgraph'));
  assert.equal(R.filterProducts('enterprise', 'Gemini').length, 0);
  assert.equal(R.filterProducts('all', 'unfindable-tool-xyz').length, 0);
});
test('atlas extras stay sourced: product lore, builder notes and scenario imagery', () => {
  for (const p of R.products) {
    assert.ok(p.surprise && p.surprise.length > 60, p.id + ': lesser-known note');
    assert.doesNotMatch(p.surprise, /^https?:/, p.id + ': link belongs in sources');
  }
  const builders = R.people.filter((p) => p.surprise);
  assert.ok(builders.length >= R.people.length, 'Every listed builder has a lesser-known note');
  for (const p of R.people) assert.ok(p.surprise && p.surprise.length > 40, p.name);
  const visual = R.people.filter((p) => p.image);
  assert.equal(visual.length, 6);
  for (const p of visual) {
    assert.match(p.image, /^assets\/[a-z-]+\.jpg$/);
    assert.match(p.alt, /AI-generated photorealistic/i);
  }
  for (const f of R.futures) {
    assert.match(f.image, /^assets\/[a-z-]+\.jpg$/);
    assert.match(f.alt, /AI-generated photorealistic/i);
  }
});
test('reported milestones and imaginative scenarios have distinct evidence labels', () => {
  assert.equal(R.timeline.filter((t) => t.type === 'reported').length, 4);
  for (const t of R.timeline.filter((t) => t.type !== 'reported')) {
    assert.equal(t.sources.length, 0);
    assert.match(t.label, /not a forecast/);
  }
  assert.equal(R.futures.length, 3);
  assert.ok(R.futures.every((f) => f.possibility && f.friction));
});
test('adoption percentages are independent survey responses, not shares totaling 100%', () => {
  assert.ok(R.adoption.reduce((sum, item) => sum + item.percent, 0) > 100);
  assert.equal(R.sources.find((s) => s.id === 5).type, 'Survey');
  assert.match(R.sources.find((s) => s.id === 5).note, /15,000/);
  for (const m of R.metrics.filter((m) => /Standalone/.test(m.metric))) {
    assert.equal(m.value, 'Not disclosed');
    assert.equal(m.kind, 'Evidence gap');
  }
});
test('constant-growth scenario is the stated formula, starts at the baseline, and does not mutate research', () => {
  const before = JSON.stringify(R.series);
  const points = R.scenarioPoints(5e6, 0.05, 24, 'compound', 100e6);
  assert.equal(points.length, 25);
  assert.equal(points[0].value, 5e6);
  near(points[24].value, 5e6 * 1.05 ** 24);
  assert.equal(JSON.stringify(R.series), before);
  assert.equal(R.scenarioPoints(100, 0, 6, 'compound')[6].value, 100);
});
test('saturating model respects its hypothetical ceiling and validates bounds', () => {
  const points = R.scenarioPoints(50, 0.1, 24, 'saturating', 100);
  assert.equal(points[0].value, 50);
  assert.ok(points[24].value < 100 && points[24].value > 50);
  assert.equal(R.scenarioPoints(100, 0.1, 24, 'saturating', 100)[24].value, 100);
  for (const args of [
    [0, 0.1, 24, 'compound'],
    [100, -0.1, 24, 'compound'],
    [100, 0.1, 121, 'compound'],
    [100, 0.1, 24, 'saturating', 99],
    [Infinity, 0.1, 24, 'compound'],
    [100, NaN, 24, 'compound'],
    [100, 0.1, 24, 'unknown'],
  ])
    assert.deepEqual(R.scenarioPoints(...args), []);
});
test('cost per accepted outcome includes step retries, tool fees, review and acceptance', () => {
  const c = R.outcomeCost(inputs);
  near(c.modelStep, 0.018);
  near(c.attempts, 7.2);
  near(c.machineAttempt, 0.2016);
  near(c.review, 1);
  near(c.perAccepted, 1.502);
  near(R.outcomeCost({ ...inputs, successPct: 100 }).perAccepted, 1.2016);
  near(R.outcomeCost({ ...inputs, successPct: 50 }).perAccepted, 2.4032);
});
test('cost simulator rejects blanks, negative/nonfinite inputs and impossible acceptance rates', () => {
  assert.equal(R.outcomeCost(null), null);
  assert.equal(R.outcomeCost({}), null);
  for (const changes of [
    { inputTokens: '' },
    { reviewMinutes: null },
    { inputRate: -1 },
    { outputTokens: Infinity },
    { successPct: 0 },
    { successPct: 101 },
    { steps: 1.5 },
    { steps: 1001 },
    { retryPct: 1001 },
  ])
    assert.equal(R.outcomeCost({ ...inputs, ...changes }), null);
  assert.equal(
    R.outcomeCost({ ...inputs, inputRate: 0, outputRate: 0, toolCost: 0, reviewMinutes: 0 })
      .perAccepted,
    0
  );
});
test('number formatting preserves magnitude and handles invalid values', () => {
  assert.equal(R.shortNumber(1.2e9), '1.2B');
  assert.equal(R.shortNumber(16.126e6), '16.13M');
  assert.equal(R.shortNumber(1500), '1.5K');
  assert.equal(R.shortNumber(NaN), '—');
});
