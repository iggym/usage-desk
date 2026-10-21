# Budgeting and optimization methods

Usage Desk is a local planning notebook, not an invoicing integration or a provider-side spending lock. All amounts are **USD**. Quota readings and cash costs are separate dimensions.

## Cash ledger and month boundaries

For the current **UTC calendar month**, using today's UTC date:

- **Fixed** = sum of configured monthly invoice equivalents. Unknown fees are omitted and counted as unknown; an explicit zero is a known zero. A bundle should be counted once.
- **Metered** = logged incremental charges with a charge date in the current UTC month, no later than today. Imported historical/future entries remain in the JSON backup; they are not counted in the current-month summary or CSV until applicable.
- **Committed** = fixed + metered.
- **Projected month-end** = fixed + (metered ÷ elapsed UTC calendar dates × dates in month).
- **Remaining budget** = budget − committed. This may be negative; negative is not hidden.
- **Reserve** = budget × reserve percentage.
- **Daily allowance** = max(0, budget − reserve − committed) ÷ remaining UTC dates **including today**.

A blank budget leaves remaining/daily allowance unset. A zero budget allows no new spend. The reserve is bounded from 0–90%. Money must be finite, nonnegative and no greater than $1 trillion per field/charge; the ledger UI records positive charges rounded to cents. This is approximate floating-point planning, not accounting software.

The projection assumes the logged metered daily pace continues and the configured monthly fees remain constant. It does not estimate missing charges, prorations, tax, foreign exchange, annual renewals, price changes or refunds. Negative/refund entries are not supported; correct/remove a mistaken charge instead. Logging a subscription invoice again as a metered charge double-counts it. A provider's quota percentage is **never** converted into dollars.

Unknown fees and an incomplete ledger understate spend. Updating a manual usage reading does not automatically charge anything. Deleting a provider removes its quota readings but **keeps charge records and the saved provider name**; past spend must not disappear merely because a tracker was removed. Configure discontinued subscription fees appropriately before deleting a provider, and retain backups for historical fixed-fee records: the monthly summary uses the **current** provider configuration, not a historical invoice database.

## Quotas and time

Use the actual units and reset rules displayed by your account. Weekly and monthly boundaries use the provider's IANA timezone, including DST; monthly reset days clamp to the final valid day. The default timezone is `America/Chicago`.

The historical schema's `rolling` mode actually uses **epoch-aligned fixed N-hour buckets**. The UI now labels that approximation explicitly. It does not reproduce sliding-window, token-bucket, account-anchored refill or multiple simultaneous quota algorithms. Use a known weekly/monthly reset when available. A snapshot's reset timestamp is displayed for review; importing it does not silently change your reset configuration.

Current usage takes the last set/increment reading within the configured window, excluding future timestamps. Forecasts fit a least-squares straight line through at least two current-window readings. Flat or declining fitted usage has no projected limit-hit time. A forecast is a pacing heuristic, not an API promise. Account readings can change nonlinearly and manual entries can be stale.

## Slower polling scenario

Let `W` be the known runs/week for active bots **not marked as paused in the local checklist**; `f` the hypothetical interval multiplier (1–6); and `c` your estimated incremental cost/run:

```text
new weekly runs = W / f
saved weekly runs = W − W / f
monthly savings = saved weekly runs × 52 / 12 × c
```

Unknown schedules are flagged; their unknown portion is excluded, while any known routines on the same bot remain counted. Paused/deleted/reported-paused bots are excluded. Manual nonnegative runs/week overrides take precedence over parsed schedules. The scenario assumes every included routine scales equally, ignores coordination/freshness effects and does not reduce fixed subscription fees. No actual agent settings are changed. Prefer event triggers, caching and batching where appropriate; preserve time-sensitive checks.

The pause plan is only a checklist. **Pause in the real agent product first.**

## Headroom check

Candidates must be configured (not a new migration template) and match the chosen measure. Custom-unit labels match case-insensitively. Available headroom = max(0, configured limit × (1 − reserve percentage) − current reading). Matching candidates that fit the requested amount are shown by lowest percentage already used.

A percentage point of two different products is **not an interchangeable unit of work**. This is a numerical fit check, not a claim about quality, task suitability, model capability, guaranteed capacity or a cheapest-provider ranking. No cross-provider routing is performed. Optional cost/unit estimates are user-entered and are shown only for non-percent measures.

## Cost per accepted outcome on The real numbers

The separate research calculator uses editable **hypothetical**, non-provider-specific inputs:

```text
model cost/step = (input tokens × input $/million + output tokens × output $/million) / 1,000,000
expected steps = base steps × (1 + extra-step retry rate)
machine/tool cost = (model cost/step + tool cost/step) × expected steps
review cost = review minutes/attempt ÷ 60 × hourly rate
cost/accepted outcome = (machine/tool cost + review cost) ÷ acceptance fraction
```

Acceptance is the share of full workflow attempts accepted after review, not per-token accuracy. Retry rate is **extra steps**, not a recursive probability distribution. Every workflow attempt incurs review cost. Attempts are assumed equally priced and independently accepted. Fixed subscription/hosting costs, correlated failures, review retries and downstream failure costs are excluded. Default rates are examples, not model quotes.
