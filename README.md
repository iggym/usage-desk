# Usage Desk

A private, browser-only workspace for **Grok Bot, Muse, Claude Pro, Gemini Pro and Dot**. Track account readings, plan AI spending, keep recurring work bounded, and understand the agent ecosystem without confusing a headline with a denominator.

**v3 · research reviewed October 21, 2026 · static deployment, no backend or build step.**

## Three connected workspaces

- **[My desk](index.html)** — five agent presets and custom providers; quota rings, quick logging, reset countdowns, burn-rate forecasts, routines, pause checklist, prompt library, weekly review, optional tab-open reminders and JSON backups.
- **[Agent atlas](agents.html)** — 18 products across personal agents, coding, research, workflows, enterprise and builder tools. Search/filter the directory, open sourced field notes, and flip any product card to read a sourced, **lesser-known** detail on its back. Scrub the historical/speculative timeline, run a permission-gated delegation simulation, explore five perspective shifts, and turn three wild thought experiments into photorealistic scenes with an interactive plausibility slider. The builder section adds six less-obvious figures with their own flip-side notes and AI-generated concept art. Local brand marks only.
- **[The real numbers](numbers.html)** — dated audience/growth observations, developer-survey adoption, list-price context, an inspectable source notebook and research CSV. Interactive historical charts keep populations separate; editable compound/logistic scenarios and a cost-per-accepted-outcome simulator are explicitly hypothetical.

Every page has a **light/dark toggle** in the top bar. The choice is stored at `usagedesk:theme`; with no stored choice the site follows the operating system's `prefers-color-scheme`, and the theme is applied before first paint so there is no flash. Motion keeps its separate toggle.

All charts, filters, calculations, simulations and exports run locally. There are no model API calls, connected accounts, tracking pixels or live market feeds. Source links open external sites **only when followed**.

## Budget and optimize

1. Clear the visibly labeled sample desk when ready. Every sample allowance, reset, price, charge, routine and prompt is illustrative.
2. In **Providers**, enter the account's actual allowance/reset and the monthly equivalent of the invoice. A blank fee means **unknown**, not free. Use `$0` for an explicitly free service or a bundle already counted elsewhere—do not count the same invoice twice.
3. Set a **USD calendar-month budget** and reserve. Log only incremental API, credit and tool charges in the metered ledger, not the value of included subscription usage.
4. Inspect monthly commitments, projected month-end spend and the daily allowance after reserve. Unknown fees and an incomplete ledger make these totals incomplete. They are planning aids, **not provider-enforced caps**.
5. Try a slower polling interval and your own incremental cost/run. The savings model changes no actual schedules. Copy its bounded optimization prompt for review, and use the unit-matched headroom check before delegating a batch.

[Budget formulas, assumptions and limitations →](docs/budgeting.md)

### Which Gemini? Which Dot?

“Gemini Pro” is the personal label for the Gemini app / Google AI Pro allowance, **not a promise of a particular model or fixed message quota**. “Dot” means **OpenAI Dots**, not New Computer's older, unrelated Dot companion. Conversations, deeper work and delegated Codex/ChatGPT Work jobs have different usage treatment. Configure what your own account actually displays. New Computer's companion sunset in October 2025; it is not presented as a current product.

## Run and deploy

For a consistent browser-storage origin, serve the repository:

```sh
npm run dev
# http://localhost:3000
# Equivalent: python3 -m http.server 3000 --bind 0.0.0.0
```

Or open `index.html` directly with the `assets/` folder beside it. Local-file storage behavior varies by browser; use a static server for reliable persistence. Once the **whole folder has been downloaded**, it needs no internet connection to operate. There is no service worker caching the hosted site for offline reloads.

Deploy the repository as static files (for example, Cloudflare Pages: framework **None**, no build command, output **.**). Keep `index.html`, `agents.html`, `numbers.html`, `assets/` and `docs/` together. No npm packages are needed at runtime. This change does not provision or alter a hosting project.

## Data safety and migration

- Personal state stays in this browser's `localStorage`, at the existing `usagedesk:data:v1` key. The JSON document's **schema version is now 2**; the key deliberately stays the same. Settings remain at `usagedesk:settings:v1`; the motion preference is separate.
- A nonempty schema-v1 desk upgrades in place, preserving providers, readings, routines and prompts while adding any missing Gemini/Dot tracker templates **once**. Their new fees are unknown, and the templates need account setup. Intentionally empty desks stay empty; deleting a v2 tracker does not resurrect it.
- JSON export/import includes `finance` and `expenses`. Import validates before asking to replace the desk. Invalid arrays, duplicate IDs, invalid charge dates and invalid financial values are rejected rather than silently dropping the ledger. Schema-v1 backups remain supported; older v1 clients cannot read new v2 exports.
- Unreadable or unsupported saved data is **not overwritten with samples**. A persistent recovery warning offers the original raw data as a download; the temporary desk does not persist changes until you explicitly import a valid backup or clear the desk.
- Full or blocked storage shows a persistent backup warning. Export before closing. Deleted-provider charges retain their saved provider names. CSV export neutralizes spreadsheet-formula prefixes in user-entered fields.
- Local storage is **not encrypted**, synchronized or a substitute for backups. Browsers can clear it, and private windows may discard it. Changing host, protocol or port creates a different storage origin. No cross-tab merge is provided: avoid editing the same desk simultaneously in multiple tabs.

## Usage snapshots and the Claude bookmarklet

A snapshot is previewed first; confirmation writes **one** quick-set reading at capture time. A unique, percent-measured provider is required. Supported hints: `claude`, `grok`, `muse`, `gemini`, `dot` (`dots` is accepted as an alias). Ambiguous/unknown hints never fall back to another provider.

```json
{
  "kind": "usage-snapshot",
  "version": 1,
  "source": "screenshot-extraction",
  "provider_hint": "gemini",
  "captured_at": "2026-10-21T12:00:00Z",
  "weekly": { "used_percent": 42, "resets_at": null },
  "session": null
}
```

`source` can also be `claude-bookmarklet`. The snapshot envelope retains the historical `weekly` field name; it does not reconfigure a provider's reset rule. Optional session data goes in the reading's note, not a second charge or log. Missing capture time uses import time. Readings dated in the future are not included in current usage.

`claude-snapshot.js` is the readable bookmarklet, also embedded in the desk. Drag its link to bookmarks, open an authenticated **claude.ai** tab, and run it there. It reads Claude's **unofficial, same-origin** organizations/usage endpoints with the existing browser session and downloads a local file; it does not send credentials or readings to Usage Desk. These endpoints may change. Raw `five_hour` / `seven_day` payloads are also accepted, with utilization fractions or percentages and either reset timestamp spelling. For other providers, enter readings manually or import a reviewed screenshot-extraction snapshot; this app does not claim an official usage API integration.

After editing the readable bookmarklet, run `npm run sync:bookmarklet` to update both embedded copies. `npm run check` detects drift.

## Research, access and motion

The source of truth is [`assets/research.js`](assets/research.js): **40 attributed sources**, reviewed dates, product notes, historical observations and defined metrics. The pages distinguish reported milestones, company statements, survey results, prices, evidence gaps, editorial inference and speculative scenarios. They do **not** infer a total global agent population, treat weekly/monthly audiences as comparable, invent standalone Muse/Dots adoption or present a scenario as a forecast.

[Research methods and complete source ledger →](docs/research.md)

Responsive from 320px; semantic landmarks and labeled controls; keyboard-inspectable chart points and data tables; native modal field notes with focus wrapping/Escape; visible focus and skip links. `prefers-reduced-motion` and a persistent **Motion** toggle disable decorative motion without hiding content. The delegation lab always waits for explicit approval before a simulated consequential action. It never accesses an app or acts in the real world.

## Develop and test

Node 22+ and Python 3 for the convenience server:

```sh
npm ci
npm run check          # links/assets/anchors, JS/CSS parsing, bookmarklet parity
npm test               # pure math/schema/migration/snapshot tests + jsdom workflows
npm run test:browser   # real Chromium flows + axe accessibility + responsive smoke
npm run format:check
```

The browser suite starts and closes its own ephemeral static server. On Linux it uses the bundled `@sparticuz/chromium` executable/libraries—no system browser or separate browser download is needed. On macOS/Windows, or to use an installed browser, set `CHROMIUM_PATH` to your Chrome/Chromium executable. Test artifacts are ignored in `test-results/`.

Coverage includes money/UTC boundaries, DST resets, unknown and zero costs, reserve/headroom calculations, both growth formulas, retries/review/acceptance costs, v1 migration/idempotence, empty/deleted desks, malformed-storage recovery, full import/export, formula-safe CSV, CRUD, prompt filling/copying, pause-plan persistence and legacy snapshots. Real-browser checks cover all pages at 320/390/768/1024/1440px, local-only runtime requests, image loading, expanded-form desktop/mobile axe scans, dialog/keyboard behavior, simulated approval gates, motion persistence, and downloaded file contents.

## Files and credits

- `index.html` — personal desk; its marked pure-function block is exercised directly by tests.
- `agents.html`, `numbers.html` — deployable research pages; no generated build artifact is needed.
- `assets/desk.css`, `shared.js`, `research.js`, `insights.js` — shared styles, UI primitives, curated evidence and interactions.
- `assets/*.webp`, `assets/logos/` — local optimized images and brand marks.
- `scripts/`, `tests/`, `docs/` — integrity/maintenance tools, regression tests and methods.

Software: [MIT](LICENSE). Brand marks: Simple Icons under [CC0](assets/logos/LICENSE.md); trademark rights remain with their owners. Dot's orb is an illustrative local motif, not an official wordmark. Research hero images are AI-generated concepts, **not documentary photographs or measured infrastructure**. The original desk/focus imagery is retained from the existing repository. [Asset provenance →](docs/assets.md)
