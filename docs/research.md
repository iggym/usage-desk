# Research notebook

**Reviewed: 2026-10-21 UTC.** This is a curated, static snapshot—not a live market dashboard or an exhaustive product ranking. The complete machine-readable ledger is [assets/research.js](../assets/research.js). Both research pages render that same source list.

## Evidence rules

- Product capabilities and security features are **vendor-described**, not independently tested by Usage Desk. Availability, eligibility, permissions and metering vary. Dated launch pages describe that time; living documentation is labeled as such.
- Audience values are dated **company reports**. Weekly reach, monthly active users, paid seats, revenue run-rate, infrastructure throughput and integrations are different measures. They are not added, normalized into market share or relabeled as autonomous-agent users. General-assistant audiences overlap.
- JetBrains' May–July 2026 Developer Ecosystem Survey covers **more than 15,000 professional developers**. The fetched article is dated August 18, 2026 (some search metadata says August 19). The survey uses regional quotas and statistical reweighting; around 90% of respondents are in developer/programmer/software-engineer roles. It is self-reported and published by a developer-tool vendor. Tool-use responses are multi-select, not exclusive market shares or productivity measurements.
- A missing standalone Muse/Dots count is an **evidence gap**, not zero. No parent-platform audience is substituted. No universal agent-market size or independently deduplicated global population is asserted.
- Price cards are reviewed **US monthly list-price snapshots**, not offers or live quotes. Tax, regional variation, promotions, annual billing, API use, extra usage and delegated products can change the bill. The personal desk's sample fees are deliberately illustrative, not an automatically updated pricing database.
- Timeline milestones are sourced separately from near-future scenarios and wild thought experiments. Organizational/people lists are non-exhaustive editorial selections, not endorsements. The perspective lenses are analysis, not empirical forecasts.

## Historical charts

Each plotted point retains its date, population, source and original qualification. “More than” observations are plotted at the reported **floor**, with the greater-than sign retained in labels, keyboard inspection and tables. Lines guide the eye between observations; they are not continuous measurements or estimates for missing months. Different series are deliberately viewed one at a time.

- **ChatGPT:** weekly users/reach, October 2024 → October 2026. Reporting language evolves; the October 2026 figure is people reached weekly, not a separate agent count.
- **Gemini app:** monthly app audience, May 2025 → August 2026; includes free and paid users, not Google AI Pro subscriber counts.
- **Codex:** dated weekly-user disclosures, February → June 2026. These are historical observations, not an estimate of today's population.

## Editable growth laboratory

The last reported floor is the **assumed baseline**, not an estimate of users on the review date. The laboratory does not invent observations for the unreported months after that disclosure. The horizontal axis is hypothetical months from that baseline; no calendar-date forecast is implied.

```text
Compound: N(t) = N₀ × (1 + g)^t
Saturating: N(t) = K / [1 + (K/N₀ − 1) × exp(−r × t)]
```

Growth, horizon and ceiling are user assumptions. The logistic rate parameter r is **not** a constant monthly percentage increase. K must be at least the baseline. Compound growth has no saturation bound and can become implausible. No confidence interval, probability or predictive calibration is provided; these are scenarios, not forecasts. Scenarios are excluded from the reported-metrics CSV.

[Cash-budget, polling and cost-per-accepted-outcome formulas →](budgeting.md)

## Important distinctions

- **Dot = OpenAI Dots**, launched September 2026; New Computer's older Dot companion sunset in October 2025.
- **Gemini Pro** is the personal desk's label for Gemini / Google AI Pro, not a fixed model name or message quota.
- **ChatGPT Work** is the current 2026 connected-work surface in this research. The 2025 ChatGPT agent announcement remains a historical milestone, not the current product description.
- **Grok Bot** capabilities are supported by its dedicated Cursor documentation. The billing source distinguishes the new shared weekly pool on The X Subscription from legacy grants; do not count a shared pool independently in each product.
- **n8n** is source-available, not described as permissively licensed open source. **LangGraph/CrewAI** are developer frameworks, not finished consumer assistants.
- Claude Code's **annualized run-rate** is not realized annual revenue, profit, valuation or the size of the entire agent market.
- The delegation lab is a **local illustration**, not an agent evaluation or integration. It never sends, purchases, merges, changes accounts or accesses tools. Even its most delegated mode requires explicit approval before a simulated sensitive action.
- Photorealistic hero images are **AI-generated concepts**, not documentary evidence. Brand identifiers are local, editorial and non-endorsing.
- **Flip-side field notes.** Each product card hides a short, sourced "lesser-known" note on its back; `research.js` stores them as `productLore` and merges them onto the product record at load. Each builder card carries a `surprise` note (`personLore`) plus, for six entries, an AI-generated concept still life. These are hedged editorial readings of the cited sources (for example, Cursor's shared X Subscription pool, or PyTorch's Torch7 lineage), not new measurements. Professional-history details are drawn from public interviews, papers and project archives; titles are living claims and can change after the review date.
- **Stance sliders** in the futures section record only the reader's own reaction in the page session. Nothing is stored, transmitted or scored, and the replies are editorial prompts rather than probabilities.

## Maintaining the notebook

Edit the ledger, metrics and series in `assets/research.js`; edit editorial markup in `agents.html` / `numbers.html`. Preserve source IDs, dated observations, units, greater-than qualifiers and limitations. Check the primary page before adding/changing any claim. Do not silently replace a historical point with a new count from another population. If a claim cannot be supported, remove or narrow it rather than inventing precision. Update review dates and static page copy together, run the test/integrity suites, and review mobile/keyboard presentation. Tests validate references and math; they do **not** independently verify external claims or guarantee future source availability.

## Complete source ledger

### [1] OpenAI — Introducing dots

- **URL:** [1](https://openai.com/index/introducing-dots/)
- **Published:** 2026-09-29 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Product announcement; phased access, permissions and separate usage buckets.

### [2] Meta — Introducing Muse

- **URL:** [2](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)
- **Published:** 2026-09-08 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Manufacturer description of personal-agent capabilities and safeguards; not an adoption count.

### [3] Google — The next evolution of the Gemini app

- **URL:** [3](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/)
- **Published:** 2026-05-19 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Gemini app reach and proactive features; describes 400M users at I/O 2025 and 900M in May 2026.

### [4] Anthropic — Series G announcement

- **URL:** [4](https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation)
- **Published:** 2026-02-12 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Claude Code >$2.5B annualized run-rate; weekly users doubled and business subscriptions quadrupled since Jan 1. Run-rate is not realized annual revenue.

### [5] JetBrains Research — AI Coding Agents: Adoption Trends

- **URL:** [5](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)
- **Published:** 2026-08-18 · **Reviewed:** 2026-10-21
- **Type:** Survey
- **Use / limitation:** Developer Ecosystem Survey, May–July 2026; >15,000 professional developers, regionally quota-sampled and statistically reweighted. Self-reported, multi-select tool usage; not the general population. Publisher also sells developer tools.

### [6] OpenAI — Building advertising for the way people use AI

- **URL:** [6](https://openai.com/index/new-chatgpt-ads-format-and-measurement/)
- **Published:** 2026-10-05 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Company says ChatGPT reaches 1.2B people each week. Product reach, not a count of autonomous-agent users.

### [7] Google — One billion monthly Gemini app users

- **URL:** [7](https://blog.google/innovation-and-ai/products/gemini-app/one-billion-monthly-users/)
- **Published:** 2026-08-11 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** More than 1B monthly app users; 63% use voice and 40+ supported apps for actions. Not Google AI Pro paid seats.

### [8] Google / Alphabet — Q2 2026 CEO earnings remarks

- **URL:** [8](https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q2-2026/)
- **Published:** 2026-07-22 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** 950M Gemini app MAU; >2.4M Antigravity WAU; ~22B model API tokens/minute across developer and enterprise customers.

### [9] Anthropic — Claude plans & pricing

- **URL:** [9](https://claude.com/pricing)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Living pricing page, reviewed Oct 21, 2026: Pro $20 USD monthly; annual option differs. Taxes, API and extra usage excluded.

### [10] Google One — Google AI plans

- **URL:** [10](https://one.google.com/intl/en/about/google-ai-plans/)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Living US pricing page, reviewed Oct 21, 2026: Google AI Pro $19.99 USD monthly. Bundles, promotions and country pricing vary.

### [11] GitHub — Copilot app generally available

- **URL:** [11](https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/)
- **Published:** 2026-06-17 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Agent-native desktop workflow, cloud automations, model choice and MCP. Platform access depends on account/plan.

### [12] Cursor — Build software with AI agents

- **URL:** [12](https://cursor.com/product)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Living product description: local and cloud software agents. No independent outcome guarantee implied.

### [13] OpenAI — Codex is becoming a productivity tool for everyone

- **URL:** [13](https://openai.com/index/codex-for-knowledge-work/)
- **Published:** 2026-06-02 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** >5M weekly Codex users; >6× since the February desktop-app launch; approximately 20% knowledge workers.

### [14] Perplexity — Comet Assistant puts you in control

- **URL:** [14](https://www.perplexity.ai/hub/blog/comet-assistant-puts-you-in-control)
- **Published:** 2025-11-14 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Browser actions, visible execution, task-level permissions and high-stakes approvals.

### [15] Salesforce — Agentforce platform

- **URL:** [15](https://www.salesforce.com/agentforce/)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Manufacturer description of CRM-connected autonomous employee and customer agents.

### [16] Microsoft — Copilot Studio overview

- **URL:** [16](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Low-code authoring, knowledge, tools and multichannel deployment. Usage-based billing and licensing vary.

### [17] n8n — Build custom AI agents

- **URL:** [17](https://n8n.io/ai-agents/)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Workflow orchestration with triggers, tools and agent steps. Source-available licensing is not the same as permissive open source.

### [18] LangChain — LangGraph overview

- **URL:** [18](https://docs.langchain.com/oss/python/langgraph/overview)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Low-level stateful-agent orchestration, durable execution and human-in-the-loop controls. A framework, not a consumer assistant.

### [19] CrewAI — CrewAI introduction

- **URL:** [19](https://docs.crewai.com/en/introduction)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Crews coordinate role-based agents; Flows supply state and deterministic orchestration. A developer framework.

### [20] Replit — Replit Agent

- **URL:** [20](https://docs.replit.com/replitai/agent)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Prompt-to-app development, plan mode, infrastructure and testing. Production review still belongs to the user.

### [21] OpenAI — ChatGPT for your most ambitious work

- **URL:** [21](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)
- **Published:** 2026-07-09 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** ChatGPT Work connects apps/files, creates artifacts and supports scheduled work. Codex-style usage structure.

### [22] Anthropic — Building effective agents

- **URL:** [22](https://www.anthropic.com/research/building-effective-agents)
- **Published:** 2024-12-19 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Erik Schluntz and Barry Zhang distinguish predetermined workflows from agents that direct their own tool use. Historical design guidance, not a current tooling catalog.

### [23] Anthropic — Introducing the Model Context Protocol

- **URL:** [23](https://www.anthropic.com/news/model-context-protocol)
- **Published:** 2024-11-25 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** MCP origin, purpose and creators David Soria Parra and Justin Spahr-Summers.

### [24] OpenAI — Introducing ChatGPT

- **URL:** [24](https://openai.com/index/chatgpt/)
- **Published:** 2022-11-30 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Historical launch of a conversational research preview. Not a description of current ChatGPT capabilities.

### [25] OpenAI — New funding to scale the benefits of AI

- **URL:** [25](https://openai.com/index/scale-the-benefits-of-ai/)
- **Published:** 2024-10-02 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** >250M weekly ChatGPT users. Historical company-reported figure.

### [26] OpenAI — New funding to build towards AGI

- **URL:** [26](https://openai.com/index/march-funding-updates/)
- **Published:** 2025-03-31 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** 500M people using ChatGPT every week. Historical company-reported figure.

### [27] OpenAI — Seizing the AI opportunity

- **URL:** [27](https://openai.com/global-affairs/seizing-the-ai-opportunity/)
- **Published:** 2025-10-27 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** >800M weekly users. Historical company-reported figure.

### [28] OpenAI — Scaling AI for everyone

- **URL:** [28](https://openai.com/index/scaling-ai-for-everyone/)
- **Published:** 2026-02-27 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** >900M ChatGPT WAU; >50M consumer subscribers; 1.6M weekly Codex users. Different populations; do not add them.

### [29] OpenAI — Accelerating the next phase of AI

- **URL:** [29](https://openai.com/index/accelerating-the-next-phase-ai/)
- **Published:** 2026-03-31 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** >2M weekly Codex users. Historical company claim, not paid seats.

### [30] Anthropic — Leadership at Anthropic

- **URL:** [30](https://www.anthropic.com/company/leadership)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Dario Amodei, co-founder/CEO; Daniela Amodei, co-founder/president. Roles reviewed Oct 21, 2026.

### [31] Google DeepMind — About Google DeepMind

- **URL:** [31](https://deepmind.google/about/)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Demis Hassabis, co-founder and CEO. Role reviewed Oct 21, 2026.

### [32] LangChain — Interrupt 2026 speaker lineup

- **URL:** [32](https://interrupt.langchain.com/london)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Harrison Chase, co-founder and CEO of LangChain.

### [33] Anthropic — The future of AI at work: introducing Cowork

- **URL:** [33](https://www.anthropic.com/webinars/future-of-ai-at-work-introducing-cowork)
- **Published:** 2026-01-30 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Cowork workflows and Boris Cherny, Head of Claude Code.

### [34] Meta — The biggest news from Connect 2026

- **URL:** [34](https://about.fb.com/news/2026/09/the-biggest-news-from-connect-2026/)
- **Published:** 2026-09-24 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Muse on AI glasses is announced as coming in the following months—not treated here as universally shipped.

### [35] MCP project — Model Context Protocol specification

- **URL:** [35](https://modelcontextprotocol.io/specification/2026-07-28)
- **Published:** 2026-07-28 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** An open protocol for LLM applications to connect to data and tools. A standard is not a security guarantee.

### [36] New Computer — An update on New Computer and Dot

- **URL:** [36](https://new.computer/)
- **Published:** 2025-09-05 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** The older Dot companion shut down in October 2025. Distinct from OpenAI Dots. No user-count comparison is made.

### [37] OpenAI — Introducing ChatGPT agent

- **URL:** [37](https://openai.com/index/introducing-chatgpt-agent/)
- **Published:** 2025-07-17 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Historical 2025 browser/computer agent milestone. The launch page now directs readers to newer work products.

### [38] Cursor — Grok Bot overview

- **URL:** [38](https://cursor.com/docs/grok-bot)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Persistent cloud work, connected tools, bot coordination and approvals. Bots on an account share a computer; separate Bots are not security boundaries.

### [39] Cursor — Grok Bot plans and billing

- **URL:** [39](https://cursor.com/help/grok-bot/plans)
- **Published:** Living page / publication date not asserted · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Account-specific metering. The X Subscription uses a shared weekly pool across Grok Bot, Cursor and Grok apps; legacy grants and delegated work have different treatment. Check the actual plan and extra-usage controls.

### [40] Google — I/O 2025: From research to reality

- **URL:** [40](https://blog.google/technology/ai/io-2025-keynote/)
- **Published:** 2025-05-20 · **Reviewed:** 2026-10-21
- **Type:** Primary source
- **Use / limitation:** Historical disclosure: Gemini app >400M monthly active users. Not paid Pro seats.
