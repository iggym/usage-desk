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

## Privacy

No backend, no analytics, no trackers, **no network calls at all** — the single HTML file loads nothing external. All data lives in the browser's `localStorage` as one versioned JSON document (`{version, providers[], logs[], bots[], prompts[]}`). Usage is entered by hand because none of the services offers a usage API this app can read. JSON export/import with schema validation is built in (Data & reminders section).

## Run it

Open `index.html` directly in a browser (`file://` works — the script is an inline ES module with no imports), or serve the folder statically.

## Deploy (Cloudflare Pages)

Static, no build step: deploy the folder (or just the file) as-is — framework preset "None", no build command, output = the folder containing `index.html`. Per the spec, the cloudflare-tools bot sets up the project; no GitHub Actions.

## Tests

The forecast math, schedule parser, schema validation, escaping, token estimate, linter and export→import round trip are pure functions in a marked block inside `index.html` and were unit-tested in Node against the app's own code (17 test groups), plus a jsdom DOM smoke test (render, quick-set, +1, prompt fill+copy, pause-plan persistence). A real bug found by the smoke test — stale-object mutation after state re-normalization — was fixed and re-verified.
