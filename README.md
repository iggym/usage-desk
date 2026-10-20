# Usage Desk

A small, private web app that helps Iggy stay under his weekly AI usage limits on **Grok Bot, Muse and Claude Pro**, track which bots/routines burn the usage, and keep a library of short, efficient prompts.

Built to `SPEC-usage.md` (Oct 20, 2026).

## What it does

- **Quick log** — one card per provider: used / left, a live "resets in Xd Xh" countdown, green/amber/red status (<50% / 50–89% / ≥90%), one-tap set or "+1 message" logging, a least-squares burn-rate forecast ("at this pace you hit 100% Thu 3 PM CDT", "not enough data" under 2 entries), and a daily budget for the rest of the window.
- **Providers** — presets for Grok Bot, Muse and Claude Pro plus custom providers. Name, usage-page link (you paste it), measure type (percent / messages / custom unit), reset rule (weekly on a weekday+time / rolling N hours / monthly on a day, timezone-aware, default America/Chicago), **your own limit** (nothing is hard-coded), warning thresholds (default 50/75/90%).
- **Bots & routines** — bot CRUD with routines whose schedules ("every 6h", "3x/day", "daily", "weekdays", "weekly", or a manual runs/week override) roll up into an estimated runs/week, busiest first, plus a persisted "pause plan" checklist for active bots.
- **Prompt library** — prompt CRUD with `{{var}}` fill-in forms, char count + approx tokens (chars ÷ 4), one-click copy (increments a used count), the 5 seeded example prompts, and a local efficiency linter (token limit, open-ended phrases, long-report asks, missing stop condition).
- **Weekly review** — peak usage per provider per week, the day each limit was hit, top prompts; copyable as Markdown.
- **Reminders** — optional browser notifications on threshold crossings / reset within 1 hour. They only fire while the tab is open; the UI says so.
- **Usage snapshots** — import a small JSON "snapshot" instead of typing a number. Confirming one writes exactly one log entry (quick-set semantics: the provider set to the snapshot's weekly %, timestamped at capture time, with the 5-hour session % kept in the entry's note). The matched provider must be percent-measured.

## Usage snapshots & the Claude bookmarklet

Snapshot shape (version 1):

```json
{ "kind": "usage-snapshot", "version": 1,
  "source": "claude-bookmarklet" | "screenshot-extraction",
  "provider_hint": "claude" | "grok" | "muse",
  "captured_at": "ISO timestamp",
  "weekly":  { "used_percent": 0..100, "resets_at": "ISO | null" },
  "session": { "used_percent": 0..100, "resets_at": "ISO | null" } | null,
  "raw": null }
```

- **Claude** — `claude-snapshot.js` (readable source, also embedded in the page) is a bookmarklet: drag it from the Usage snapshots panel to your bookmarks bar, open claude.ai logged in, click it. It reads claude.ai's own internal usage endpoint (`/api/organizations` → `/api/organizations/{id}/usage`, same data the site itself shows) using your existing session and downloads `claude-usage-snapshot-<date>-<time>.json`. Same-origin GETs only; nothing is sent anywhere. The endpoint is **unofficial** and may break if Anthropic changes it. The importer also accepts the raw endpoint payload directly (`five_hour`/`seven_day` with `utilization` as a fraction or a percent, `reset_at` or `resets_at`).
- **Grok Bot and Muse** have no usage endpoint. Screenshot the usage page, send it to fantasias in chat, and import the snapshot file you get back (source `screenshot-extraction`).

## Privacy

No backend, no analytics, no trackers, **no network calls at all** — the single HTML file loads nothing external (the bookmarklet runs on claude.ai, not in this app, and only downloads a file). All data lives in the browser's `localStorage` as one versioned JSON document (`{version, providers[], logs[], bots[], prompts[]}`). Usage is entered by hand or by snapshot import, because none of the services offers an official usage API this app can read. JSON export/import with schema validation is built in (Data & reminders section).

## Files

- `index.html` — the entire app.
- `claude-snapshot.js` — the readable bookmarklet source (the in-page bookmarklet link is generated from this file, and its text is embedded in the page for the copy-for-console button).
- `README.md` — this file.

## Run it

Open `index.html` directly in a browser (`file://` works — the script is an inline ES module with no imports), or serve the folder statically.

## Deploy (Cloudflare Pages)

Static, no build step: deploy the folder (or just the file) as-is — framework preset "None", no build command, output = the folder containing `index.html`. Per the spec, the cloudflare-tools bot sets up the project; no GitHub Actions.

## Tests

The forecast math, schedule parser, schema validation, escaping, token estimate, linter and export→import round trip are pure functions in a marked block inside `index.html` and were unit-tested in Node against the app's own code (17 test groups), plus a jsdom DOM smoke test (render, quick-set, +1, prompt fill+copy, pause-plan persistence). A real bug found by the smoke test — stale-object mutation after state re-normalization — was fixed and re-verified.

Snapshot support added later the same day: `parseSnapshot` / `matchSnapshotProvider` / `applySnapshot` live in the same pure block (16 more Node test groups: canonical + raw-endpoint payloads, `reset_at`/`resets_at` and fraction/percent tolerance, error cases, org-id variants, one-entry apply with correct provider/value/timestamp/note, percent gate, old-data backward compatibility), the bookmarklet href in the page was generated from `claude-snapshot.js` by script and verified to decode to parseable code, and a second jsdom smoke drives the panel end to end (stubbed file input → preview → confirm → exactly one log entry in localStorage).
