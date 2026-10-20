/*
 * Claude usage snapshot — for Usage Desk.
 *
 * Run this on claude.ai while logged in (drag it to your bookmarks bar
 * from Usage Desk, or paste it into the DevTools console on a claude.ai
 * tab). It reads Claude's own internal usage endpoint with your existing
 * browser session and downloads ONE JSON file — a Usage Desk
 * "usage snapshot" — to your machine.
 *
 * It sends nothing anywhere: the only requests are same-origin GETs to
 * claude.ai itself, and the only output is the downloaded file.
 *
 * The endpoint is unofficial. If Anthropic changes it, this stops with
 * an alert showing what came back instead of downloading anything.
 */
(() => {
  'use strict';

  /* ---- pure transform: claude.ai usage payload -> Usage Desk snapshot.
          Side-effect free so it can be unit-tested in Node. ---- */
  function snapshotWindow(win) {
    if (!win || typeof win !== 'object') return null;
    const u = Number(win.utilization);
    if (!Number.isFinite(u)) return null;
    const pct = u <= 1.5 ? u * 100 : u;
    const resetRaw = win.reset_at || win.resets_at || null;
    const resetMs = resetRaw ? Date.parse(resetRaw) : NaN;
    return {
      used_percent: Math.round(Math.min(100, Math.max(0, pct)) * 10) / 10,
      resets_at: Number.isFinite(resetMs) ? new Date(resetMs).toISOString() : null
    };
  }

  function usageToSnapshot(usage, capturedAtIso) {
    if (!usage || typeof usage !== 'object') return null;
    const weekly = snapshotWindow(usage.seven_day);
    if (!weekly) return null;
    return {
      kind: 'usage-snapshot',
      version: 1,
      source: 'claude-bookmarklet',
      provider_hint: 'claude',
      captured_at: capturedAtIso,
      weekly: weekly,
      session: snapshotWindow(usage.five_hour),
      raw: usage
    };
  }

  function orgIdFromOrgs(orgs) {
    if (!Array.isArray(orgs) || !orgs.length) return null;
    const first = orgs[0];
    if (!first || typeof first !== 'object') return null;
    return first.uuid || first.id || null;
  }

  /* Under Node (unit tests) export the pure pieces and do not run. */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { usageToSnapshot: usageToSnapshot, orgIdFromOrgs: orgIdFromOrgs, snapshotWindow: snapshotWindow };
    return;
  }

  /* ---- browser flow ---- */
  (async () => {
    try {
      if (!location.hostname.endsWith('claude.ai')) {
        alert('Open claude.ai first, log in, then run this again on that tab. Nothing was downloaded.');
        return;
      }
      const orgRes = await fetch('/api/organizations', { credentials: 'include' });
      if (!orgRes.ok) {
        alert('Claude did not answer the organizations lookup (HTTP ' + orgRes.status + '). Are you logged in on this tab? Nothing was downloaded.');
        return;
      }
      const orgs = await orgRes.json();
      const orgId = orgIdFromOrgs(orgs);
      if (!orgId) {
        alert('Could not find an organization id in what Claude returned: ' + JSON.stringify(orgs).slice(0, 200) + '\nNothing was downloaded.');
        return;
      }
      const usageRes = await fetch('/api/organizations/' + encodeURIComponent(orgId) + '/usage', { credentials: 'include' });
      if (!usageRes.ok) {
        alert('Claude did not answer the usage lookup (HTTP ' + usageRes.status + '). Nothing was downloaded.');
        return;
      }
      const usage = await usageRes.json();
      if (!usage || typeof usage !== 'object' || (!usage.five_hour && !usage.seven_day)) {
        alert('The usage endpoint answered, but not with the expected five_hour / seven_day data: ' + JSON.stringify(usage).slice(0, 200) + '\nNothing was downloaded.');
        return;
      }
      const now = new Date();
      const snapshot = usageToSnapshot(usage, now.toISOString());
      if (!snapshot) {
        alert('The usage data had no readable weekly (seven_day) number in it: ' + JSON.stringify(usage).slice(0, 200) + '\nNothing was downloaded.');
        return;
      }
      const pad = (n) => String(n).padStart(2, '0');
      const stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' + pad(now.getHours()) + pad(now.getMinutes());
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'claude-usage-snapshot-' + stamp + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      alert('Snapshot downloaded: weekly usage at ' + snapshot.weekly.used_percent + '%. Import it in Usage Desk under Data & reminders, Usage snapshots.');
    } catch (err) {
      alert('Snapshot failed: ' + (err && err.message ? err.message : String(err)) + '\nNothing was sent anywhere. If Claude changed its internal endpoint, this bookmarklet needs an update.');
    }
  })();
})();
