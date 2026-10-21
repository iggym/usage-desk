const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { expect } = require('@playwright/test');
const { root, startBrowser, startSite } = require('../helpers/browser.cjs');
const { legacy, blank } = require('../helpers/desk.cjs');
let browser, site;
before(async () => {
  site = await startSite();
  browser = await startBrowser();
});
after(async () => {
  if (browser) await browser.close();
  if (site) await site.close();
});
async function pageFor(run, options = {}) {
  const context = await browser.newContext({
    viewport: options.viewport || { width: 1440, height: 1000 },
    reducedMotion: options.motion || 'reduce',
  });
  const page = await context.newPage(),
    errors = [],
    external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('request', (request) => {
    if (/^https?:/.test(request.url()) && !request.url().startsWith(site.url + '/'))
      external.push(request.url());
  });
  if (options.stored !== undefined)
    await page.addInitScript(
      (value) => {
        if (localStorage.getItem('usagedesk:data:v1') === null)
          localStorage.setItem('usagedesk:data:v1', value);
      },
      typeof options.stored === 'string' ? options.stored : JSON.stringify(options.stored)
    );
  try {
    await run(page, context);
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
  } finally {
    await context.close();
  }
}
const state = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('usagedesk:data:v1')));
const go = (page, name) => page.goto(site.url + '/' + name + '.html');
async function audit(page) {
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () =>
    (await axe.run()).violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    }))
  );
  assert.deepEqual(violations, []);
}
for (const width of [320, 390, 768, 1024, 1440]) {
  test(
    `all pages: ${width}px layout, images, local-only requests and runtime smoke`,
    { timeout: 60000 },
    () =>
      pageFor(
        async (page) => {
          for (const name of ['index', 'agents', 'numbers']) {
            await go(page, name);
            await page.locator('main').waitFor();
            const images = await page.evaluate(async () => {
              const imgs = [...document.images];
              imgs.forEach((i) => (i.loading = 'eager'));
              await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
              return imgs.filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src);
            });
            assert.deepEqual(images, []);
            assert.equal(
              await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
              true,
              `${name} overflows at ${width}px`
            );
            assert.equal(await page.locator('h1').count(), 1);
            if (width === 390 || width === 1440) {
              await page
                .locator('details')
                .evaluateAll((nodes) => nodes.forEach((n) => (n.open = true)));
              await audit(page);
            }
          }
        },
        { viewport: { width, height: width > 1000 ? 1000 : 844 } }
      )
  );
}
test('provider ring and quick-log geometry, amber status, keyboard chips, +1, and reload persistence', () =>
  pageFor(async (page) => {
    await go(page, 'index');
    const card = page.locator('#card-p-gemini');
    await card.scrollIntoViewIfNeeded();
    assert.equal(
      await card.locator('.card-main').evaluate((el) => getComputedStyle(el).display),
      'flex'
    );
    assert.equal(
      await card.locator('.ring-num').evaluate((el) => getComputedStyle(el).position),
      'absolute'
    );
    const field = card.locator('input');
    await field.fill('67');
    await card.getByRole('button', { name: 'Set', exact: true }).click();
    await expect(page.locator('#card-p-gemini .ring-num')).toHaveText('67%');
    const ring = page.locator('#card-p-gemini .ring-prog');
    assert.ok((await ring.getAttribute('class')).includes('amber'));
    await page
      .getByRole('button', { name: 'Gemini Pro (sample) 67% — jump to provider card', exact: true })
      .focus();
    await page.keyboard.press('Enter');
    await expect(card).toBeFocused();
    const before = (await state(page)).logs.length;
    await page
      .locator('#card-p-muse')
      .getByRole('button', { name: '+1 message', exact: true })
      .click();
    assert.equal((await state(page)).logs.length, before + 1);
    await page.reload();
    await expect(page.locator('#card-p-gemini .ring-num')).toHaveText('67%');
  }));
test('home budget, metered ledger, CSV download and full backup/clear/restore work in a real browser', () =>
  pageFor(async (page) => {
    await go(page, 'index');
    await page.locator('#monthlyBudget').fill('100');
    await page.locator('#reservePct').fill('20');
    await page.getByRole('button', { name: 'Save budget', exact: true }).click();
    const count = (await state(page)).logs.length;
    await page.locator('#expenseAmount').fill('12.34');
    await page.locator('#expenseNote').fill('=formula\nnot-executed');
    await page.getByRole('button', { name: 'Log spend', exact: true }).click();
    assert.equal((await state(page)).expenses.length, 3);
    assert.equal((await state(page)).logs.length, count);
    const csvPromise = page.waitForEvent('download');
    await page.locator('#exportExpensesBtn').click();
    const csvDownload = await csvPromise;
    const csv = await fs.readFile(await csvDownload.path(), 'utf8');
    assert.match(csv, /12\.34/);
    assert.match(csv, /'=formula/);
    const exportPromise = page.waitForEvent('download');
    await page.locator('#exportBtn').click();
    const backupDownload = await exportPromise;
    const backup = await fs.readFile(await backupDownload.path(), 'utf8');
    assert.equal(JSON.parse(backup).finance.monthlyBudget, 100);
    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#clearAllBtn').click();
    await expect(page.locator('#providerCards .pcard')).toHaveCount(0);
    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#importFile').setInputFiles({
      name: 'backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(backup),
    });
    await expect(page.locator('#providerCards .pcard')).toHaveCount(5);
    assert.equal((await state(page)).expenses.length, 3);
    await expect(page.locator('#monthlyBudget')).toHaveValue('100');
  }));
test('v1 data migrates without data loss and intentionally empty v2 stays empty', () =>
  pageFor(
    async (page) => {
      const old = legacy();
      await go(page, 'index');
      const migrated = await state(page);
      assert.equal(migrated.version, 2);
      assert.equal(migrated.providers.length, 5);
      assert.deepEqual(migrated.logs, old.logs);
      await page.reload();
      assert.equal((await state(page)).providers.length, 5);
      page.once('dialog', (dialog) => dialog.accept());
      await page.locator('#importFile').setInputFiles({
        name: 'blank.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(blank())),
      });
      await expect(page.locator('#providerCards .pcard')).toHaveCount(0);
      await page.reload();
      await expect(page.locator('#providerCards .pcard')).toHaveCount(0);
    },
    { stored: legacy() }
  ));
test('unreadable storage is preserved and recoverable through a real download', () =>
  pageFor(
    async (page) => {
      await go(page, 'index');
      await expect(page.locator('#storageWarning')).toBeVisible();
      await page.locator('#monthlyBudget').fill('999');
      await page.getByRole('button', { name: 'Save budget', exact: true }).click();
      assert.equal(
        await page.evaluate(() => localStorage.getItem('usagedesk:data:v1')),
        '{unreadable original'
      );
      const promise = page.waitForEvent('download');
      await page.locator('#exportUnreadableBtn').click();
      const download = await promise;
      assert.equal(await fs.readFile(await download.path(), 'utf8'), '{unreadable original');
    },
    { stored: '{unreadable original' }
  ));
test('Atlas filters, empty state, dialog focus trap/Escape, and Gemini configuration handoff', () =>
  pageFor(async (page) => {
    await go(page, 'agents');
    await expect(page.locator('.product-card')).toHaveCount(18);
    await page.getByRole('button', { name: 'Personal', exact: true }).click();
    await expect(page.locator('.product-card')).toHaveCount(5);
    await page.locator('#productSearch').fill('gEmInI');
    await expect(page.locator('.product-card')).toHaveCount(1);
    const trigger = page.getByRole('button', {
      name: 'Read the field note for Gemini Pro',
      exact: true,
    });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#productDialog')).toBeVisible();
    await audit(page);
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      assert.equal(
        await page.evaluate(() =>
          document.getElementById('productDialog').contains(document.activeElement)
        ),
        true
      );
    }
    await page.keyboard.press('Escape');
    await expect(page.locator('#productDialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await page.locator('#productSearch').fill('missing-xyz');
    await expect(page.locator('#productGrid')).toContainText('No agents match');
    await page.locator('#productSearch').fill('gemini');
    await trigger.click();
    await page.getByRole('link', { name: 'Configure this agent on your desk' }).click();
    await expect(page.locator('#pf-name')).toHaveValue('Gemini Pro');
    await expect(page.locator('#pf-limit')).toHaveValue('');
    await expect(page.locator('#providerFormDrawer')).toHaveAttribute('open', '');
  }));
test('Atlas timeline, perspective lenses and wild ideas respond to keyboard/input', () =>
  pageFor(async (page) => {
    await go(page, 'agents');
    await page.locator('#timelineRange').focus();
    await page.keyboard.press('End');
    await expect(page.locator('#timelinePanel')).toContainText('Wild thought experiment');
    await expect(page.locator('#timelinePanel')).toHaveAttribute('data-type', 'wild');
    await page.getByRole('button', { name: 'The economics', exact: true }).click();
    await expect(page.locator('#lensPanel')).toContainText('Cheaper tokens');
    const flip = page.locator('[data-future="0"]');
    await flip.focus();
    await page.keyboard.press('Enter');
    await expect(flip).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#future-text-0')).toContainText('A simulation cannot know');
    await flip.click();
    await expect(flip).toHaveAttribute('aria-pressed', 'false');
  }));
test('delegation lab never performs a sensitive action automatically, at any autonomy level', () =>
  pageFor(async (page) => {
    await go(page, 'agents');
    for (const job of ['research', 'code', 'bill'])
      for (const mode of [0, 1, 2]) {
        await page.locator('#labTask').selectOption(job);
        await page.locator('#autonomyRange').fill(String(mode));
        await page.locator('#runLabBtn').click();
        if (mode === 0) {
          await expect(page.locator('#labStatus')).toContainText('No execution authorized');
          await expect(page.locator('#approveLabBtn')).toBeHidden();
        } else {
          await expect(page.locator('#labStatus')).toContainText('Human approval required');
          await expect(page.locator('#approveLabBtn')).toBeVisible();
          await page.locator('#approveLabBtn').click();
          await expect(page.locator('#labStatus')).toContainText('No apps were accessed');
        }
      }
  }));
test('delegation reset cancels in-flight timers rather than replaying an old job', () =>
  pageFor(
    async (page) => {
      await go(page, 'agents');
      await page.locator('#runLabBtn').click();
      await page.locator('#resetLabBtn').click();
      await page.waitForTimeout(2900);
      await expect(page.locator('#labStatus')).toContainText('Boundary:');
      await expect(page.locator('#approveLabBtn')).toBeHidden();
    },
    { motion: 'no-preference' }
  ));
test('Numbers history points have keyboard inspection, source links and a readable data table', () =>
  pageFor(async (page) => {
    await go(page, 'numbers');
    await page.locator('#historySeries').selectOption('codex');
    await expect(page.locator('#historyChart .chart-point')).toHaveCount(3);
    await page.locator('#historyChart .chart-point').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#historyInfo')).toContainText('1.6M');
    await expect(page.locator('#historyInfo a')).toHaveAttribute(
      'href',
      'https://openai.com/index/scaling-ai-for-everyone/'
    );
    await page.getByText('Read the accessible data table', { exact: true }).click();
    await expect(page.locator('#historyTable tbody tr')).toHaveCount(3);
    await page.locator('#historySeries').selectOption('gemini');
    await expect(page.locator('#historyInfo')).toContainText('>1B');
    await expect(page.locator('#historyTable tbody tr')).toHaveCount(4);
  }));
test('Numbers growth/cost scenarios validate assumptions; evidence filter and sourced CSV export work', () =>
  pageFor(async (page) => {
    await go(page, 'numbers');
    await expect(page.locator('#scenarioResult')).toContainText('16.13M');
    await expect(page.locator('#scenarioCaveat')).toContainText('not filled in as fact');
    await page.locator('#growthRate').fill('0');
    await expect(page.locator('#scenarioResult')).toContainText('5M');
    await page.locator('#growthMode').selectOption('saturating');
    await page.locator('#scenarioCapacity').fill('1');
    await expect(page.locator('#scenarioResult')).toContainText('Use a finite ceiling');
    await page.locator('#scenarioCapacity').fill('100');
    await page.locator('#growthRate').fill('5');
    await expect(page.locator('#scenarioFormula')).toContainText('not constant monthly growth');
    await expect(page.locator('#outcomeResult')).toContainText('$1.502');
    await page.locator('#simSuccessPct').fill('0');
    await expect(page.locator('#outcomeResult')).toContainText('Check your inputs');
    await page.locator('#simSuccessPct').fill('100');
    await expect(page.locator('#outcomeResult')).toContainText('$1.202');
    await page.locator('#metricFilter').selectOption('Evidence gap');
    await expect(page.locator('#metricsTable tbody tr')).toHaveCount(2);
    await expect(page.locator('#metricsTable')).toContainText('Not disclosed');
    const promise = page.waitForEvent('download');
    await page.locator('#exportResearchBtn').click();
    const download = await promise;
    const csv = await fs.readFile(await download.path(), 'utf8');
    assert.equal(csv.split('\r\n').length, 16);
    assert.match(csv, /Source URL/);
    assert.match(csv, /2026-10-21/);
    assert.match(csv, /https:\/\/openai.com/);
  }));
test('motion preference persists across all pages, never hides content, and settles quick-log numbers immediately', () =>
  pageFor(
    async (page) => {
      await go(page, 'index');
      await expect(page.locator('#motionToggle')).toHaveText('Motion: on');
      await page.locator('#motionToggle').click();
      await page.locator('#card-p-gemini input').fill('94');
      await page.locator('#card-p-gemini .primary').click();
      await expect(page.locator('#card-p-gemini .ring-num')).toHaveText('94%');
      await go(page, 'agents');
      await expect(page.locator('#motionToggle')).toHaveText('Motion: off');
      assert.equal(
        await page
          .locator('.editorial-section')
          .last()
          .evaluate((el) => getComputedStyle(el).opacity),
        '1'
      );
      await go(page, 'numbers');
      await expect(page.locator('#motionToggle')).toHaveText('Motion: off');
      await page.locator('#motionToggle').click();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(page.locator('#motionToggle')).toHaveText('Motion: reduced');
    },
    { motion: 'no-preference' }
  ));
test('primary navigation is keyboard reachable with a working skip link', () =>
  pageFor(async (page) => {
    await go(page, 'numbers');
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  }));
test('theme toggle switches every page, persists the choice and follows the system by default', () =>
  pageFor(async (page) => {
    await go(page, 'agents');
    const initial = await page.evaluate(() => document.documentElement.dataset.theme);
    const toggled = initial === 'dark' ? 'light' : 'dark';
    await page.locator('#themeToggle').click();
    assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), toggled);
    assert.equal(await page.evaluate(() => localStorage.getItem('usagedesk:theme')), toggled);
    await expect(page.locator('#themeToggle')).toHaveAttribute(
      'aria-label',
      toggled === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
    );
    for (const name of ['numbers', 'index', 'agents']) {
      await go(page, name);
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), toggled);
    }
    const surface = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    assert.notEqual(surface, 'rgba(0, 0, 0, 0)');
  }));
test('product and builder cards flip to a sourced lesser-known note with keyboard support', () =>
  pageFor(async (page) => {
    await go(page, 'agents');
    const card = page.locator('.product-card').first();
    const flip = card.locator('.flip-front [data-flip]');
    await flip.focus();
    await page.keyboard.press('Enter');
    await expect(card).toHaveClass(/is-flipped/);
    await expect(card.locator('.flip-back')).not.toHaveAttribute('aria-hidden', 'true');
    assert.equal(
      await card.locator('.flip-back').evaluate((el) => el.contains(document.activeElement)),
      true
    );
    await expect(card.locator('.flip-back .lore')).not.toBeEmpty();
    await card.locator('.flip-back [data-flip]').click();
    await expect(card).not.toHaveClass(/is-flipped/);
    await expect(card.locator('.flip-back')).toHaveAttribute('aria-hidden', 'true');
    const builder = page.locator('.person-card').last();
    await expect(builder.locator('.person-photo img')).toHaveCount(1);
    await builder.locator('.flip-front [data-flip]').click();
    await expect(builder).toHaveClass(/is-flipped/);
    await expect(builder.locator('.flip-back .lore')).toContainText('PyTorch');
    await page.locator('#futureGrid [data-future="0"]').click();
    await expect(page.locator('#future-text-0')).toContainText('cannot know');
    await page.locator('#stance-0').fill('2');
    await expect(page.locator('#stance-out-0')).toHaveText('Closer than it sounds');
  }));
