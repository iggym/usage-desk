/* Curated research snapshot. No runtime fetches. Dates and definitions travel with every metric.
   Reviewed 2026-10-21. Manufacturer claims are not independent verification. */
(function (root) {
  'use strict';
  const reviewed = '2026-10-21';
  const sources = [
    [
      1,
      'OpenAI',
      'Introducing dots',
      '2026-09-29',
      'https://openai.com/index/introducing-dots/',
      'Product announcement; phased access, permissions and separate usage buckets.',
    ],
    [
      2,
      'Meta',
      'Introducing Muse',
      '2026-09-08',
      'https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/',
      'Manufacturer description of personal-agent capabilities and safeguards; not an adoption count.',
    ],
    [
      3,
      'Google',
      'The next evolution of the Gemini app',
      '2026-05-19',
      'https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/',
      'Gemini app reach and proactive features; describes 400M users at I/O 2025 and 900M in May 2026.',
    ],
    [
      4,
      'Anthropic',
      'Series G announcement',
      '2026-02-12',
      'https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation',
      'Claude Code >$2.5B annualized run-rate; weekly users doubled and business subscriptions quadrupled since Jan 1. Run-rate is not realized annual revenue.',
    ],
    [
      5,
      'JetBrains Research',
      'AI Coding Agents: Adoption Trends',
      '2026-08-18',
      'https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/',
      'Developer Ecosystem Survey, May–July 2026; >15,000 professional developers, regionally quota-sampled and statistically reweighted. Self-reported, multi-select tool usage; not the general population. Publisher also sells developer tools.',
    ],
    [
      6,
      'OpenAI',
      'Building advertising for the way people use AI',
      '2026-10-05',
      'https://openai.com/index/new-chatgpt-ads-format-and-measurement/',
      'Company says ChatGPT reaches 1.2B people each week. Product reach, not a count of autonomous-agent users.',
    ],
    [
      7,
      'Google',
      'One billion monthly Gemini app users',
      '2026-08-11',
      'https://blog.google/innovation-and-ai/products/gemini-app/one-billion-monthly-users/',
      'More than 1B monthly app users; 63% use voice and 40+ supported apps for actions. Not Google AI Pro paid seats.',
    ],
    [
      8,
      'Google / Alphabet',
      'Q2 2026 CEO earnings remarks',
      '2026-07-22',
      'https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q2-2026/',
      '950M Gemini app MAU; >2.4M Antigravity WAU; ~22B model API tokens/minute across developer and enterprise customers.',
    ],
    [
      9,
      'Anthropic',
      'Claude plans & pricing',
      null,
      'https://claude.com/pricing',
      'Living pricing page, reviewed Oct 21, 2026: Pro $20 USD monthly; annual option differs. Taxes, API and extra usage excluded.',
    ],
    [
      10,
      'Google One',
      'Google AI plans',
      null,
      'https://one.google.com/intl/en/about/google-ai-plans/',
      'Living US pricing page, reviewed Oct 21, 2026: Google AI Pro $19.99 USD monthly. Bundles, promotions and country pricing vary.',
    ],
    [
      11,
      'GitHub',
      'Copilot app generally available',
      '2026-06-17',
      'https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/',
      'Agent-native desktop workflow, cloud automations, model choice and MCP. Platform access depends on account/plan.',
    ],
    [
      12,
      'Cursor',
      'Build software with AI agents',
      null,
      'https://cursor.com/product',
      'Living product description: local and cloud software agents. No independent outcome guarantee implied.',
    ],
    [
      13,
      'OpenAI',
      'Codex is becoming a productivity tool for everyone',
      '2026-06-02',
      'https://openai.com/index/codex-for-knowledge-work/',
      '>5M weekly Codex users; >6× since the February desktop-app launch; approximately 20% knowledge workers.',
    ],
    [
      14,
      'Perplexity',
      'Comet Assistant puts you in control',
      '2025-11-14',
      'https://www.perplexity.ai/hub/blog/comet-assistant-puts-you-in-control',
      'Browser actions, visible execution, task-level permissions and high-stakes approvals.',
    ],
    [
      15,
      'Salesforce',
      'Agentforce platform',
      null,
      'https://www.salesforce.com/agentforce/',
      'Manufacturer description of CRM-connected autonomous employee and customer agents.',
    ],
    [
      16,
      'Microsoft',
      'Copilot Studio overview',
      null,
      'https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio',
      'Low-code authoring, knowledge, tools and multichannel deployment. Usage-based billing and licensing vary.',
    ],
    [
      17,
      'n8n',
      'Build custom AI agents',
      null,
      'https://n8n.io/ai-agents/',
      'Workflow orchestration with triggers, tools and agent steps. Source-available licensing is not the same as permissive open source.',
    ],
    [
      18,
      'LangChain',
      'LangGraph overview',
      null,
      'https://docs.langchain.com/oss/python/langgraph/overview',
      'Low-level stateful-agent orchestration, durable execution and human-in-the-loop controls. A framework, not a consumer assistant.',
    ],
    [
      19,
      'CrewAI',
      'CrewAI introduction',
      null,
      'https://docs.crewai.com/en/introduction',
      'Crews coordinate role-based agents; Flows supply state and deterministic orchestration. A developer framework.',
    ],
    [
      20,
      'Replit',
      'Replit Agent',
      null,
      'https://docs.replit.com/replitai/agent',
      'Prompt-to-app development, plan mode, infrastructure and testing. Production review still belongs to the user.',
    ],
    [
      21,
      'OpenAI',
      'ChatGPT for your most ambitious work',
      '2026-07-09',
      'https://openai.com/index/chatgpt-for-your-most-ambitious-work/',
      'ChatGPT Work connects apps/files, creates artifacts and supports scheduled work. Codex-style usage structure.',
    ],
    [
      22,
      'Anthropic',
      'Building effective agents',
      '2024-12-19',
      'https://www.anthropic.com/research/building-effective-agents',
      'Erik Schluntz and Barry Zhang distinguish predetermined workflows from agents that direct their own tool use. Historical design guidance, not a current tooling catalog.',
    ],
    [
      23,
      'Anthropic',
      'Introducing the Model Context Protocol',
      '2024-11-25',
      'https://www.anthropic.com/news/model-context-protocol',
      'MCP origin, purpose and creators David Soria Parra and Justin Spahr-Summers.',
    ],
    [
      24,
      'OpenAI',
      'Introducing ChatGPT',
      '2022-11-30',
      'https://openai.com/index/chatgpt/',
      'Historical launch of a conversational research preview. Not a description of current ChatGPT capabilities.',
    ],
    [
      25,
      'OpenAI',
      'New funding to scale the benefits of AI',
      '2024-10-02',
      'https://openai.com/index/scale-the-benefits-of-ai/',
      '>250M weekly ChatGPT users. Historical company-reported figure.',
    ],
    [
      26,
      'OpenAI',
      'New funding to build towards AGI',
      '2025-03-31',
      'https://openai.com/index/march-funding-updates/',
      '500M people using ChatGPT every week. Historical company-reported figure.',
    ],
    [
      27,
      'OpenAI',
      'Seizing the AI opportunity',
      '2025-10-27',
      'https://openai.com/global-affairs/seizing-the-ai-opportunity/',
      '>800M weekly users. Historical company-reported figure.',
    ],
    [
      28,
      'OpenAI',
      'Scaling AI for everyone',
      '2026-02-27',
      'https://openai.com/index/scaling-ai-for-everyone/',
      '>900M ChatGPT WAU; >50M consumer subscribers; 1.6M weekly Codex users. Different populations; do not add them.',
    ],
    [
      29,
      'OpenAI',
      'Accelerating the next phase of AI',
      '2026-03-31',
      'https://openai.com/index/accelerating-the-next-phase-ai/',
      '>2M weekly Codex users. Historical company claim, not paid seats.',
    ],
    [
      30,
      'Anthropic',
      'Leadership at Anthropic',
      null,
      'https://www.anthropic.com/company/leadership',
      'Dario Amodei, co-founder/CEO; Daniela Amodei, co-founder/president. Roles reviewed Oct 21, 2026.',
    ],
    [
      31,
      'Google DeepMind',
      'About Google DeepMind',
      null,
      'https://deepmind.google/about/',
      'Demis Hassabis, co-founder and CEO. Role reviewed Oct 21, 2026.',
    ],
    [
      32,
      'LangChain',
      'Interrupt 2026 speaker lineup',
      null,
      'https://interrupt.langchain.com/london',
      'Harrison Chase, co-founder and CEO of LangChain.',
    ],
    [
      33,
      'Anthropic',
      'The future of AI at work: introducing Cowork',
      '2026-01-30',
      'https://www.anthropic.com/webinars/future-of-ai-at-work-introducing-cowork',
      'Cowork workflows and Boris Cherny, Head of Claude Code.',
    ],
    [
      34,
      'Meta',
      'The biggest news from Connect 2026',
      '2026-09-24',
      'https://about.fb.com/news/2026/09/the-biggest-news-from-connect-2026/',
      'Muse on AI glasses is announced as coming in the following months—not treated here as universally shipped.',
    ],
    [
      35,
      'MCP project',
      'Model Context Protocol specification',
      '2026-07-28',
      'https://modelcontextprotocol.io/specification/2026-07-28',
      'An open protocol for LLM applications to connect to data and tools. A standard is not a security guarantee.',
    ],
    [
      36,
      'New Computer',
      'An update on New Computer and Dot',
      '2025-09-05',
      'https://new.computer/',
      'The older Dot companion shut down in October 2025. Distinct from OpenAI Dots. No user-count comparison is made.',
    ],
    [
      37,
      'OpenAI',
      'Introducing ChatGPT agent',
      '2025-07-17',
      'https://openai.com/index/introducing-chatgpt-agent/',
      'Historical 2025 browser/computer agent milestone. The launch page now directs readers to newer work products.',
    ],
    [
      38,
      'Cursor',
      'Grok Bot overview',
      null,
      'https://cursor.com/docs/grok-bot',
      'Persistent cloud work, connected tools, bot coordination and approvals. Bots on an account share a computer; separate Bots are not security boundaries.',
    ],
    [
      39,
      'Cursor',
      'Grok Bot plans and billing',
      null,
      'https://cursor.com/help/grok-bot/plans',
      'Account-specific metering. The X Subscription uses a shared weekly pool across Grok Bot, Cursor and Grok apps; legacy grants and delegated work have different treatment. Check the actual plan and extra-usage controls.',
    ],
    [
      40,
      'Google',
      'I/O 2025: From research to reality',
      '2025-05-20',
      'https://blog.google/technology/ai/io-2025-keynote/',
      'Historical disclosure: Gemini app >400M monthly active users. Not paid Pro seats.',
    ],
    [
      41,
      'Anthropic',
      'Company and leadership',
      null,
      'https://www.anthropic.com/company',
      'Co-founder and Chief Science Officer roles. Living page; titles change. Professional history is drawn from public interviews and papers, not an audited résumé.',
      'Living documentation',
    ],
    [
      42,
      'Chris Olah',
      'Research notes and Distill',
      null,
      'https://colah.github.io/',
      'Personal interpretability writing and the Distill journal archive. A public notebook, not a peer-reviewed record of every contribution.',
      'Personal research writing',
    ],
    [
      43,
      'Noam Brown',
      'Research overview',
      null,
      'https://noambrown.github.io/',
      'Poker-AI research (Libratus, Pluribus) and later work on inference-time search for language models. Author’s own summary.',
      'Personal research writing',
    ],
    [
      44,
      'Lil’Log',
      'LLM Powered Autonomous Agents',
      '2023-06-23',
      'https://lilianweng.github.io/posts/2023-06-23-agent/',
      'A widely cited practitioner survey of agent architecture. An explanatory blog post, not a product benchmark.',
      'Technical essay',
    ],
    [
      45,
      'Simon Willison',
      'Prompt injection and the LLM CLI',
      null,
      'https://simonwillison.net/',
      'Independent practitioner archive: the 2022 “prompt injection” write-up, Datasette, and continuous model notes. Opinionated, dated and inspectable.',
      'Personal research writing',
    ],
    [
      46,
      'Soumith Chintala',
      'About and PyTorch origins',
      null,
      'https://soumith.ch/',
      'Personal site plus the PyTorch history thread. PyTorch groundwork began in 2016 among Torch7 contributors; the project is a collaboration, not one person’s codebase.',
      'Personal research writing',
    ],
  ].map(([id, publisher, title, date, url, note, type]) => ({
    id,
    publisher,
    title,
    date,
    url,
    note,
    reviewed,
    type: type || (id === 5 ? 'Survey' : 'Primary source'),
  }));

  const products = [
    {
      id: 'dot',
      name: 'Dot',
      org: 'OpenAI',
      category: 'personal',
      source: 1,
      signal: 'Early rollout',
      summary:
        'A persistent teammate with its own cloud computer, connected apps and ongoing responsibilities.',
      tags: ['Persistent context', 'Browser + tools', 'Approvals'],
      capabilities: [
        'Works across connected applications and projects, including background read-only research.',
        'Custom Rules let users allow, require approval for, or block actions.',
        'Conversations, deeper work and delegated Codex / Work jobs have different usage treatment.',
      ],
      caution:
        'Access is phased by plan and market. Do not interpret ChatGPT’s reach as Dots adoption; no separate user count is disclosed in this source.',
      next: 'More specialist organizational dots are a vendor-stated direction, not a universal release promise.',
      preset: 'dot',
    },
    {
      id: 'muse',
      name: 'Muse',
      org: 'Meta',
      category: 'personal',
      source: 2,
      signal: 'Early rollout',
      summary:
        'A goal-oriented personal agent that keeps work moving in a dedicated cloud environment.',
      tags: ['Goals → plans', 'Connected apps', 'Permission gates'],
      capabilities: [
        'Turns goals into plans and can carry out multi-step browser work.',
        'Runs in a dedicated Secure VM, with a separate Sentinel layer reviewing outbound activity.',
        'Asks for approval for sensitive actions; users choose connected apps and permissions.',
      ],
      caution:
        'These are Meta’s product and security claims, not independent validation. Availability and subscription capacity vary.',
      next: 'AI-glasses integration was announced at Connect; don’t confuse an announcement with general availability.',
      preset: 'muse',
    },
    {
      id: 'gemini',
      name: 'Gemini Pro',
      org: 'Google',
      category: 'personal',
      source: 3,
      signal: 'Broad platform reach',
      summary:
        'Multimodal assistance, research and connected-app actions, with Google AI Pro as a paid bundle.',
      tags: ['Multimodal', 'Research', 'Google ecosystem'],
      capabilities: [
        'Combines conversation, multimodal input and connected-app workflows.',
        'The Gemini app is moving toward proactive, ongoing assistance.',
        'Google AI Pro is a subscription bundle, not the name of a fixed message quota.',
      ],
      caution:
        'One billion monthly app users includes free users; it is not a count of Pro subscribers or autonomous-agent users.',
      next: 'Deeper context across apps could make the assistant more useful—and make permission design more consequential.',
      preset: 'gemini',
    },
    {
      id: 'grok',
      name: 'Grok Bot',
      org: 'Cursor / Grok ecosystem',
      category: 'personal',
      source: 38,
      signal: 'On your desk',
      summary: 'An AI teammate that can use connected tools and bring back completed work.',
      tags: ['Tool use', 'Delegation', 'Ongoing work'],
      capabilities: [
        'Uses connected tools to carry out work instead of only suggesting steps.',
        'Can hand off coding work to Cursor agents.',
        'Metering depends on the plan: The X Subscription shares a weekly pool across Grok Bot, Cursor and Grok apps; legacy grants differ.',
      ],
      caution:
        'Use the actual allowance displayed by your account. Do not treat a bot’s conversation limit as an all-inclusive downstream budget.',
      next: 'The important interface may be the handoff between a general teammate and specialized workers.',
      preset: 'grok',
      extraSources: [39],
    },
    {
      id: 'cowork',
      name: 'Claude / Cowork',
      org: 'Anthropic',
      category: 'personal',
      source: 33,
      signal: 'Knowledge work',
      summary:
        'Claude’s agentic execution extends beyond code into research, documents and structured work.',
      tags: ['Files + artifacts', 'Research', 'Multi-step work'],
      capabilities: [
        'Cowork brings agentic execution to knowledge-work workflows.',
        'Demonstrated use cases include research synthesis, document creation and data extraction.',
        'The product remains distinct from API billing and the Claude Code interface.',
      ],
      caution:
        'Review consequential edits and generated artifacts. A Pro subscription is not unlimited API access.',
      next: 'Reusable skills and connectors could make narrow, repeatable workflows more valuable than a single universal assistant.',
      preset: 'claude',
    },
    {
      id: 'work',
      name: 'ChatGPT Work',
      org: 'OpenAI',
      category: 'research',
      source: 21,
      signal: 'Connected work',
      summary:
        'An agentic workspace for research, files, artifacts and recurring projects across connected apps.',
      tags: ['Research → artifacts', 'Schedules', 'App context'],
      capabilities: [
        'Creates sheets, slides, documents and web artifacts from connected materials.',
        'Can keep working on complex projects and scheduled tasks.',
        'Uses a Codex-style usage structure; task complexity influences usage.',
      ],
      caution:
        'This is distinct from a short chat. Confirm spend controls and access settings before giving it a long-running workflow.',
      next: 'The workspace itself could become the artifact: a living project that stays updated instead of a one-time report.',
    },
    {
      id: 'claude-code',
      name: 'Claude Code',
      org: 'Anthropic',
      category: 'code',
      source: 4,
      signal: '39% survey usage',
      summary:
        'Agentic software work, backed by a company-reported multibillion-dollar revenue run-rate.',
      tags: ['Code + tests', 'Terminal', 'Repository context'],
      capabilities: [
        'An agentic coding product, generally available since May 2025.',
        'Anthropic reported >$2.5B annualized run-rate in February 2026.',
        'JetBrains found 39% workplace usage in its May–July 2026 professional-developer survey.',
      ],
      caution:
        'The run-rate is not audited annual revenue. Survey usage is not exclusive market share, and code still needs review.',
      next: 'The engineering bottleneck may move from generating code to specifying, testing and safely integrating changes.',
      extraSources: [5],
    },
    {
      id: 'copilot',
      name: 'GitHub Copilot',
      org: 'GitHub / Microsoft',
      category: 'code',
      source: 11,
      signal: '21% survey usage',
      summary:
        'A development control center spanning agents, repositories, reviews and cloud automations.',
      tags: ['Repo workflows', 'Cloud agents', 'MCP'],
      capabilities: [
        'The Copilot desktop app centralizes agent-driven software development.',
        'Cloud automations support recurring work.',
        'Model selection and MCP connect agents to tools and context.',
      ],
      caution:
        'Account plans, policy controls and metered usage affect availability and cost. Review changes before merging.',
      next: 'The repository can become the control plane for a team of specialized software agents.',
      extraSources: [5],
    },
    {
      id: 'cursor',
      name: 'Cursor',
      org: 'Cursor',
      category: 'code',
      source: 12,
      signal: '12% survey usage',
      summary:
        'A software-building environment for directing local and cloud agents against real projects.',
      tags: ['Local + cloud', 'Codebase context', 'Visual direction'],
      capabilities: [
        'Coordinates agents to build and modify software.',
        'Offers local and cloud agent surfaces.',
        'Visual direction helps connect intended interfaces to code changes.',
      ],
      caution:
        'Don’t equate autonomous runtime with tested correctness. Models, plan allowances and delegated work can change costs.',
      next: 'A development environment may become a dispatch surface for agents, with people reviewing intent and outcomes.',
      extraSources: [5],
    },
    {
      id: 'codex',
      name: 'Codex',
      org: 'OpenAI',
      category: 'code',
      source: 13,
      signal: '>5M weekly users',
      summary:
        'A coding agent expanding into analysis, research and the production of knowledge-work artifacts.',
      tags: ['Code + execution', 'Parallel tasks', 'Analysis'],
      capabilities: [
        'OpenAI reported >5M weekly users on June 2, 2026.',
        'The company says knowledge workers were approximately 20% of users.',
        'Supports research, data analysis, workflow automation and artifact creation alongside software tasks.',
      ],
      caution:
        'Those usage figures are dated company claims. Human review and account-specific usage controls still matter.',
      next: 'Coding is a general-purpose tool: non-developers can gain leverage by delegating executable workflows.',
    },
    {
      id: 'antigravity',
      name: 'Google Antigravity',
      org: 'Google',
      category: 'code',
      source: 8,
      signal: '>2.4M weekly users',
      summary:
        'An agent-first development platform at the intersection of models, software and orchestration.',
      tags: ['Software agents', 'Agent-first IDE', 'Developer tools'],
      capabilities: [
        'Alphabet reported >2.4M weekly active users in July 2026.',
        'The company describes it as an agentic development platform.',
        'It is one of the tools covered in the JetBrains professional-developer survey.',
      ],
      caution:
        'Weekly users and survey percentages answer different questions. Neither proves faster delivery for your own codebase.',
      next: 'Agent-first tooling could shift software work toward coordinating experiments and reviewing tested outcomes.',
      extraSources: [5],
    },
    {
      id: 'comet',
      name: 'Perplexity Comet',
      org: 'Perplexity',
      category: 'research',
      source: 14,
      signal: 'Browser-native',
      summary:
        'Research and action meet in the browser, with visible execution and permission-aware controls.',
      tags: ['Web research', 'Browser actions', 'Visible progress'],
      capabilities: [
        'The assistant can navigate and interact with web pages.',
        'Users can watch actions and steer the workflow.',
        'High-stakes actions can pause for user permission.',
      ],
      caution:
        'Web content can contain hostile instructions. Browser access and logged-in accounts expand an agent’s possible blast radius.',
      next: 'Browsers may become delegated execution environments, not just windows into pages.',
    },
    {
      id: 'replit',
      name: 'Replit Agent',
      org: 'Replit',
      category: 'code',
      source: 20,
      signal: 'Prompt → app',
      summary:
        'Turns an app idea into a plan, code, infrastructure and a testable running project.',
      tags: ['App building', 'Plan mode', 'Testing'],
      capabilities: [
        'Builds from natural-language descriptions.',
        'Sets up infrastructure, writes code and tests the result.',
        'Plan mode gives the user a checkpoint before implementation.',
      ],
      caution:
        'A running preview is not a security audit or a production-readiness guarantee. Monitor effort-based spend.',
      next: 'The next wave of builders may specify problems and inspect behavior rather than author every implementation detail.',
    },
    {
      id: 'agentforce',
      name: 'Agentforce',
      org: 'Salesforce',
      category: 'enterprise',
      source: 15,
      signal: 'Business processes',
      summary: 'CRM-connected agents for customer service, sales and employee workflows.',
      tags: ['Enterprise data', 'Customer service', 'Guardrails'],
      capabilities: [
        'Supports specialized employee and customer-facing agents.',
        'Connects to Salesforce data and workflows.',
        'Custom actions and guardrails bound what an agent may do.',
      ],
      caution:
        'Business permissions, data quality and escalation design matter as much as model capability. Vendor deployment is not a universal ROI guarantee.',
      next: 'Business software could be purchased around verified outcomes rather than just seats and interfaces.',
    },
    {
      id: 'copilot-studio',
      name: 'Copilot Studio',
      org: 'Microsoft',
      category: 'enterprise',
      source: 16,
      signal: 'Low-code platform',
      summary:
        'Build and govern agents with knowledge, tools and deployment into existing business channels.',
      tags: ['Low-code', 'Tools + knowledge', 'Governance'],
      capabilities: [
        'Authors agents and workflows using a low-code environment.',
        'Connects knowledge sources and action tools.',
        'Publishes into channels such as Microsoft Copilot, Teams, websites and apps.',
      ],
      caution:
        'Licensing, consumption meters and tenant policies vary. Design deterministic steps and approvals around sensitive actions.',
      next: 'Governance may become the scarce infrastructure: who authorized an action, under which policy, at what cost?',
    },
    {
      id: 'n8n',
      name: 'n8n',
      org: 'n8n',
      category: 'workflows',
      source: 17,
      signal: 'Workflow builder',
      summary: 'Mix reliable triggers and deterministic steps with flexible agentic decisions.',
      tags: ['Visual workflows', 'Self-hosting', 'Tool orchestration'],
      capabilities: [
        'Uses triggers, tools and agent steps in connected workflows.',
        'Deterministic branches can avoid model calls altogether.',
        'Can separate credentials and actions from the reasoning step.',
      ],
      caution:
        'n8n is source-available, not a permissively licensed open-source consumer assistant. Self-hosting still has infrastructure and maintenance costs.',
      next: 'The most economical agent may be mostly ordinary software, with intelligence only where judgment is necessary.',
    },
    {
      id: 'langgraph',
      name: 'LangGraph',
      org: 'LangChain',
      category: 'builders',
      source: 18,
      signal: 'Developer runtime',
      summary:
        'Stateful orchestration for agents that need durable execution, control and human checkpoints.',
      tags: ['Durable state', 'Human-in-loop', 'Custom orchestration'],
      capabilities: [
        'Combines deterministic and model-driven steps in a graph.',
        'Supports long-running, stateful execution.',
        'Provides human-in-the-loop and persistence primitives.',
      ],
      caution:
        'A framework is not a finished personal agent. You own application security, hosting, model spend and evaluation.',
      next: 'Durability and replay may be as important to agent infrastructure as raw inference speed.',
    },
    {
      id: 'crewai',
      name: 'CrewAI',
      org: 'CrewAI',
      category: 'builders',
      source: 19,
      signal: 'Multi-agent framework',
      summary: 'Role-based teams of agents inside structured, stateful workflows.',
      tags: ['Crews + Flows', 'Role-based agents', 'Orchestration'],
      capabilities: [
        'Crews coordinate agents around explicit roles and tasks.',
        'Flows manage state and execution across steps.',
        'Combines agent collaboration with deterministic control.',
      ],
      caution:
        'More agents can multiply tokens, coordination overhead and failure modes. Start with a single measured workflow.',
      next: 'A small specialist team may outperform a general agent—but only if coordination costs stay below the value created.',
    },
  ];

  const timeline = [
    {
      year: '2022',
      label: 'Reported milestone',
      title: 'The interface becomes a conversation.',
      body: 'ChatGPT launches as a conversational research preview. The important shift is accessibility: people can describe what they want in ordinary language. A fluent answer, however, is not yet delegated execution.',
      sources: [24],
      type: 'reported',
    },
    {
      year: '2024',
      label: 'Reported milestone',
      title: 'Models get a common tool socket.',
      body: 'Anthropic introduces MCP, an open standard for connecting assistants to data and tools. The product question changes from “What can it say?” to “What can it safely reach?”',
      sources: [23],
      type: 'reported',
    },
    {
      year: '2025',
      label: 'Reported milestone',
      title: 'The agent gets its own computer.',
      body: 'ChatGPT agent combines research, browser interaction and execution in a virtual computer. Claude Code becomes generally available. These are historical milestones, not descriptions of today’s exact plans or quotas.',
      sources: [37, 4],
      type: 'reported',
    },
    {
      year: '2026',
      label: 'Reported launches · editorial framing',
      title: 'From a chat session to an ongoing responsibility.',
      body: 'Muse and Dots bring persistent goals, connected apps and background work into personal-agent products. The shift is not “smarter chat.” It is delegating a bounded responsibility—and accounting for everything it triggers.',
      sources: [2, 1],
      type: 'reported',
    },
    {
      year: '2028',
      label: 'Speculative scenario · not a forecast',
      title: 'The most valuable feature might be “prove it.”',
      body: 'Imagine an agent with a signed action receipt: the evidence it used, the permission it received, the dollars it spent and the outcome it verified. Trust becomes a product surface, not a promise in a launch video.',
      sources: [],
      type: 'speculative',
    },
    {
      year: '2035',
      label: 'Wild thought experiment · not a forecast',
      title: 'What if software only exists while you need it?',
      body: 'An agent assembles a tiny application, recruits specialist agents, completes one job, archives an auditable result and dissolves the entire stack. The enduring asset is your intent—not the app. Liability, identity and shared infrastructure would need radical redesign.',
      sources: [],
      type: 'wild',
    },
  ];

  const lenses = [
    {
      id: 'product',
      label: 'The product',
      emoji: '🧩',
      title: 'A model is not an agent. An agent is not a product.',
      text: 'Think in layers: model → tools → memory → execution → permissions → evaluation. A benchmark measures only part of that stack. The most useful product might use a less capable model inside a much better workflow. Ask what the whole system can reliably finish, not which model tops a leaderboard.',
      sources: [22, 18],
    },
    {
      id: 'economics',
      label: 'The economics',
      emoji: '↗',
      title: 'Cheaper tokens can still mean a larger bill.',
      text: 'Lower unit costs can make longer runs, more parallel workers and more frequent checks feel affordable. Total spend is unit cost × volume × retries—not a price per token in isolation. This is a possible rebound effect, not an inevitability. Measure cost per accepted outcome and stop work that no longer earns its keep.',
      sources: [],
    },
    {
      id: 'attention',
      label: 'The bottleneck',
      emoji: '🧠',
      title: 'Your attention is the next rate limit.',
      text: 'If producing work becomes cheap, deciding which work deserves to exist becomes precious. Ten agents that ask for twenty approvals each do not create an autonomous organization; they create an inbox. Budget review capacity alongside dollars. Batch low-risk decisions. Keep consequential ones unmistakably human.',
      sources: [],
    },
    {
      id: 'memory',
      label: 'The moat',
      emoji: '🗝️',
      title: 'The real switching cost may be your context.',
      text: 'An assistant that remembers your goals can become more useful—and harder to leave. A portable, user-owned memory layer could change who captures that value. Ask whether you can inspect, correct, export and delete what an agent knows. An assistant should accumulate understanding, not ownership of your life.',
      sources: [1, 2],
    },
    {
      id: 'trust',
      label: 'The control plane',
      emoji: '🛡️',
      title: 'Autonomy is a permission budget.',
      text: 'Don’t ask “How autonomous is it?” Ask “Autonomous over what, for how long, with whose credentials, with which spending limit, and how do I stop it?” A narrow, reversible permission can be more useful than broad access. Protocol compatibility helps tools connect; it does not make every connection safe.',
      sources: [1, 35],
    },
  ];
  const futures = [
    {
      emoji: '🪞',
      title: 'Your future selves hire you.',
      possibility:
        'A swarm simulates thousands of possible lives, then offers your present self small, reversible experiments to discover which future you actually want. Personal planning becomes a conversation between counterfactual versions of you.',
      friction:
        'A simulation cannot know what you will value. If it optimizes a guessed preference, it may quietly narrow your life. Who gets to set the objective—and can you surprise it?',
      tag: 'Identity × simulation',
    },
    {
      emoji: '🌐',
      title: 'A neighborhood has a nervous system.',
      possibility:
        'Residents’ agents coordinate shared batteries, borrow tools, match childcare needs and buy transit capacity together. A neighborhood negotiates like an organization, without everyone attending another meeting.',
      friction:
        'Collective intelligence can become collective surveillance. Consent, minority interests, local governance and the right to opt out are harder than the scheduling algorithm.',
      tag: 'Collective agency',
    },
    {
      emoji: '🫧',
      title: 'An eleven-minute company.',
      possibility:
        'An agent assembles an ephemeral team to solve one problem, contracts for specialist work, produces a verified result and dissolves. The company exists for eleven minutes. Its commitments and audit trail last much longer.',
      friction:
        'Legal identity, liability, labor rights and dispute resolution do not disappear with the process. A disposable organization must not become disposable accountability.',
      tag: 'Ephemeral institutions',
    },
  ];
  const people = [
    {
      name: 'Sam Altman',
      initials: 'SA',
      role: 'Co-founder & CEO · OpenAI',
      lens: 'Product distribution and the scale of general-purpose assistants.',
      source: 28,
    },
    {
      name: 'Dario Amodei',
      initials: 'DA',
      role: 'Co-founder & CEO · Anthropic',
      lens: 'Frontier capability, reliability and steerable systems.',
      source: 30,
    },
    {
      name: 'Daniela Amodei',
      initials: 'DA',
      role: 'Co-founder & President · Anthropic',
      lens: 'The organization and governance behind deployable products.',
      source: 30,
    },
    {
      name: 'Demis Hassabis',
      initials: 'DH',
      role: 'Co-founder & CEO · Google DeepMind',
      lens: 'General intelligence, multimodality and scientific discovery.',
      source: 31,
    },
    {
      name: 'Sundar Pichai',
      initials: 'SP',
      role: 'CEO · Google & Alphabet',
      lens: 'Turning model capability into everyday product reach.',
      source: 8,
    },
    {
      name: 'Mark Zuckerberg',
      initials: 'MZ',
      role: 'Founder & CEO · Meta',
      lens: 'Personal agents across communication and wearable surfaces.',
      source: 34,
    },
    {
      name: 'Boris Cherny',
      initials: 'BC',
      role: 'Head of Claude Code · Anthropic',
      lens: 'The path from coding agents to broader knowledge work.',
      source: 33,
    },
    {
      name: 'Harrison Chase',
      initials: 'HC',
      role: 'Co-founder & CEO · LangChain',
      lens: 'The runtime, state and evaluation infrastructure beneath agents.',
      source: 32,
    },
    {
      name: 'David Soria Parra & Justin Spahr-Summers',
      initials: 'MCP',
      role: 'Creators · Model Context Protocol',
      lens: 'Open interfaces between models, tools and context.',
      source: 23,
    },
    {
      name: 'Jared Kaplan',
      initials: 'JK',
      role: 'Co-founder & Chief Science Officer · Anthropic',
      lens: 'Scaling laws — and the argument that capability arrives on predictable curves.',
      source: 41,
      image: 'assets/builder-scaling.jpg',
      alt: 'AI-generated photorealistic brass balance scale weighing graphite blocks against a glowing cube',
      surprise:
        'A theoretical physicist by training, not a computer scientist. He co-authored the scaled-up scaling-laws work at OpenAI before co-founding Anthropic — which means his bet is less “smarter models” than “capability improves on measurable curves you can plan around.”',
    },
    {
      name: 'Chris Olah',
      initials: 'CO',
      role: 'Co-founder · Anthropic',
      lens: 'Interpretability: reading a network instead of only testing its outputs.',
      source: 42,
      image: 'assets/builder-circuits.jpg',
      alt: 'AI-generated photorealistic glass and copper circuit sculpture with light tracing its pathways',
      surprise:
        'No PhD. He published neural-network interpretability work on his own blog, helped start the Distill journal, and made “circuits” a research programme — a self-taught route into a frontier lab at a time when almost every route ran through a doctorate.',
    },
    {
      name: 'Noam Brown',
      initials: 'NB',
      role: 'Research · OpenAI',
      lens: 'Search, game theory and letting a model think longer instead of growing bigger.',
      source: 43,
      image: 'assets/builder-strategy.jpg',
      alt: 'AI-generated photorealistic poker table with clay chips and a floating lattice of probability lines',
      surprise:
        'His poker bots Libratus and Pluribus beat elite humans, Pluribus in six-player no-limit — a format where bluffing and hidden information defeat pure calculation. The lesson he carried into language models: extra thinking time at inference can buy more than a larger network.',
    },
    {
      name: 'Lilian Weng',
      initials: 'LW',
      role: 'Research · OpenAI',
      lens: 'Agent architecture, written down in public.',
      source: 44,
      image: 'assets/builder-agents.jpg',
      alt: 'AI-generated photorealistic notebook of hand-drawn agent diagrams beside a glowing holographic flowchart',
      surprise:
        'A Lil’Log post, “LLM Powered Autonomous Agents”, became an unofficial syllabus for agent builders — planning, memory and tool use mapped before most vendors had a product. She later co-founded Thinking Machines Lab, then returned to OpenAI in 2026 to lead a research team.',
    },
    {
      name: 'Simon Willison',
      initials: 'SW',
      role: 'Co-creator of Django · independent',
      lens: 'The sceptical practitioner: tools, evaluations and injection.',
      source: 45,
      image: 'assets/builder-tooling.jpg',
      alt: 'AI-generated photorealistic night desk with a monitor’s cyan glow, notebook and hand-built device',
      surprise:
        'He coined the term “prompt injection” in 2022 — years before most agent products shipped — and keeps publishing dated, runnable notes on every new model. Django, Datasette and the LLM CLI all come from the same habit: build the small tool, then write down what broke.',
    },
    {
      name: 'Soumith Chintala',
      initials: 'SC',
      role: 'CTO · Thinking Machines Lab',
      lens: 'The substrate: the framework most of this industry still trains and serves on.',
      source: 46,
      image: 'assets/builder-tensors.jpg',
      alt: 'AI-generated photorealistic hands shaping a glowing translucent tensor lattice above a metal workbench',
      surprise:
        'PyTorch did not start inside a lab. Its groundwork began in 2016 among a band of Torch7 maintainers working online, and it nearly died from internal resistance. He left Meta and the project in November 2025 after eleven years — while PyTorch was already running most AI research.',
    },
  ];

  /* Editorial additions kept beside the ledger so records stay auditable:
     these are dated, hedged field notes — not benchmarks or predictions. */
  const productLore = {
    dot: 'The name is a rerun. New Computer’s earlier companion was also called Dot and shut down in October 2025. OpenAI Dots is a different product, and it meters conversations, deeper work and delegated Codex jobs on separate buckets — so one limit rarely describes the others.',
    muse: 'Muse does not run in your browser tab. Meta places it in a dedicated Secure VM with a separate Sentinel layer reviewing outbound activity. The AI-glasses integration shown at Connect 2026 was announced as coming in following months — an announcement, not general availability.',
    gemini:
      'The Gemini app’s audience roughly doubled twice in sixteen months: 400M monthly users at I/O 2025, 900M in May 2026, then 1B in August 2026. None of those numbers is a Google AI Pro subscriber count, and the free tier is inside all of them.',
    grok: 'Bots on one account share a computer, and Cursor’s own documentation says separate Bots are not security boundaries. The X Subscription also meters Grok Bot, Cursor and the Grok apps from a single shared weekly pool — the limit is not per product.',
    cowork:
      'Cowork is not Claude Code with a new name. Anthropic keeps the product subscription, API billing and the Claude Code interface as separate surfaces with separate limits, so “I have Pro” never means “I have unlimited agent time.”',
    work: 'ChatGPT Work inherits a Codex-style usage structure rather than a chat-style one. The expensive unit is often the long-running project, not the message — and an artifact can keep updating after you close the tab.',
    'claude-code':
      'Generally available in May 2025; by February 2026 Anthropic reported a >$2.5B annualized run-rate for it. That is a run-rate, not audited annual revenue — and JetBrains’ 39% is workplace usage among surveyed professional developers, not market share.',
    copilot:
      'The interesting artifact is not autocomplete. The Copilot desktop app pulls agents, repository workflows, reviews and cloud automations into one control surface — and MCP is what lets those agents reach tools beyond the repository.',
    cursor:
      'Cursor runs agents both locally and in the cloud, which means two different blast radii for the same prompt. Its 12% is a multi-select survey response from professional developers — not 12% of all programmers, and not a productivity measurement.',
    codex:
      'In June 2026 OpenAI said knowledge workers were roughly 20% of Codex users: most usage still looked like software work even as the product moved into research and artifacts. It reported >5M weekly users at that point.',
    antigravity:
      'Alphabet’s >2.4M weekly-active figure came from an earnings update, not a launch event. It counts weekly users of an agent-first IDE — a different question from the survey percentages printed beside it.',
    comet:
      'A browser agent inherits every logged-in session in that browser. Comet can show its actions and pause for permission, but web pages can carry instructions too — which is why prompt injection, not model quality, is the security story here.',
    replit:
      'Replit Agent provisions infrastructure as well as code, so “it runs” can hide cost, secrets and permissions. Plan mode exists because rejecting a plan is far cheaper than rejecting a build.',
    agentforce:
      'Agentforce’s real boundary is the CRM’s permission model, not the model card. Guardrails and custom actions decide what an agent may touch; a vendor deployment story is not an ROI guarantee for your organisation.',
    'copilot-studio':
      'Copilot Studio publishes agents into Teams, sites and apps — and the consumption meter follows them there. Deterministic steps and approvals are a licensing decision as much as a safety one.',
    n8n: 'n8n is source-available, not permissively licensed open source. Its most economical trick is unglamorous: deterministic branches that skip the model call entirely, so intelligence is spent only where judgment is needed.',
    langgraph:
      'Durable execution and replay may matter more than model choice. LangGraph is a runtime you host, so you also inherit application security, model spend and evaluation.',
    crewai:
      'Crews are roles; Flows are state. The documented failure mode is arithmetic — every extra agent multiplies tokens, coordination overhead and the number of ways the run can fail.',
  };
  products.forEach((p) => {
    if (productLore[p.id]) p.surprise = productLore[p.id];
  });

  const personLore = {
    'Sam Altman':
      'Dropped out of Stanford at 19 to build Loopt, a location-sharing app, and ran Y Combinator before OpenAI. The distribution instincts came from consumer software, not research.',
    'Dario Amodei':
      'His PhD is in biophysics, and he co-authored “Concrete Problems in AI Safety” in 2016 — a paper about mundane accidents, not runaway intelligence. Baidu and Google Brain came before OpenAI.',
    'Daniela Amodei':
      'Studied English literature, then ran people operations at Stripe. Anthropic’s unusual structure — a public benefit corporation underneath a long-term benefit trust — owes as much to that operations background as to research.',
    'Demis Hassabis':
      'A child chess prodigy who, as a teenager, designed levels for Bullfrog’s Theme Park. He later took a PhD in cognitive neuroscience and shared the 2024 Nobel Prize in Chemistry for AlphaFold.',
    'Sundar Pichai':
      'Joined Google in 2004 and is usually remembered for Chrome and the toolbar; he studied metallurgical engineering at IIT Kharagpur before an MBA at Wharton.',
    'Mark Zuckerberg':
      'Built a music player and Facemash before Facebook, studied psychology alongside computer science, and later learned Mandarin well enough to take questions in it.',
    'Boris Cherny':
      'Wrote “Programming TypeScript” before building Claude Code. The interface he ended up betting on was the terminal — the least fashionable surface available at the time.',
    'Harrison Chase':
      'LangChain began as a side project while he was an engineer at an ML startup. The framework was public for months before there was a company behind it.',
    'David Soria Parra & Justin Spahr-Summers':
      'Justin Spahr-Summers created ReactiveCocoa before MCP; David Soria Parra is a longtime PHP contributor. The protocol’s authors came from client apps and language tooling, not from a model lab’s API team.',
  };
  people.forEach((p) => {
    if (personLore[p.name]) p.surprise = personLore[p.name];
  });

  /* Symbolic still-life scenes stand in for faces: no likeness is invented. */
  const personVisuals = {
    'Sam Altman': [
      'assets/builder-startup.jpg',
      'AI-generated photorealistic loft desk with an early laptop, whiteboard charts and cables',
    ],
    'Dario Amodei': [
      'assets/builder-biophysics.jpg',
      'AI-generated photorealistic biophysics bench with pipettes, vials and protein sketches',
    ],
    'Daniela Amodei': [
      'assets/builder-operations.jpg',
      'AI-generated photorealistic operations desk with index cards, a pen and a book of essays',
    ],
    'Demis Hassabis': [
      'assets/builder-chess.jpg',
      'AI-generated photorealistic chessboard beside a sketch of a theme-park ride',
    ],
    'Sundar Pichai': [
      'assets/builder-browser.jpg',
      'AI-generated photorealistic materials bench with an alloy sample beside an abstract browser',
    ],
    'Mark Zuckerberg': [
      'assets/builder-dorm.jpg',
      'AI-generated photorealistic dorm desk with a psychology textbook and language flashcards',
    ],
    'Boris Cherny': [
      'assets/builder-terminal.jpg',
      'AI-generated photorealistic macro of a terminal window glowing on a dark desk',
    ],
    'Harrison Chase': [
      'assets/builder-sideproject.jpg',
      'AI-generated photorealistic kitchen counter at night turned into a side-project workstation',
    ],
    'David Soria Parra & Justin Spahr-Summers': [
      'assets/builder-protocol.jpg',
      'AI-generated photorealistic machined hub with different cables curving toward nodes of light',
    ],
  };
  people.forEach((p) => {
    const visual = personVisuals[p.name];
    if (visual && !p.image) {
      p.image = visual[0];
      p.alt = visual[1];
    }
  });

  const futureVisuals = [
    {
      image: 'assets/future-selves.jpg',
      alt: 'AI-generated photorealistic kitchen table where a person faces four translucent alternate versions of themselves',
    },
    {
      image: 'assets/future-neighborhood.jpg',
      alt: 'AI-generated photorealistic aerial view of homes and batteries linked by threads of amber light',
    },
    {
      image: 'assets/future-company.jpg',
      alt: 'AI-generated photorealistic small office dissolving into luminous dust at golden hour',
    },
  ];
  futures.forEach((future, index) => {
    const visual = futureVisuals[index];
    if (visual) {
      future.image = visual.image;
      future.alt = visual.alt;
    }
  });

  const series = {
    chatgpt: {
      name: 'ChatGPT',
      unit: 'weekly users / people reached',
      audience: 'General assistant product reach, not agent-only usage',
      points: [
        { date: '2024-10-02', value: 250e6, label: '>250M', source: 25 },
        { date: '2025-03-31', value: 500e6, label: '500M', source: 26 },
        { date: '2025-10-27', value: 800e6, label: '>800M', source: 27 },
        { date: '2026-02-27', value: 900e6, label: '>900M', source: 28 },
        { date: '2026-10-05', value: 1.2e9, label: '1.2B', source: 6 },
      ],
    },
    gemini: {
      name: 'Gemini app',
      unit: 'monthly active users',
      audience: 'Free and paid app audience, not Pro seats or agent-only users',
      points: [
        {
          date: '2025-05-20',
          value: 400e6,
          label: '>400M',
          source: 40,
          dateLabel: 'May 2025 (I/O)',
        },
        { date: '2026-05-19', value: 900e6, label: '>900M', source: 3 },
        { date: '2026-07-22', value: 950e6, label: '950M', source: 8 },
        { date: '2026-08-11', value: 1e9, label: '>1B', source: 7 },
      ],
    },
    codex: {
      name: 'Codex',
      unit: 'weekly active users',
      audience: 'Agent-product users; not paid subscribers',
      points: [
        { date: '2026-02-27', value: 1.6e6, label: '1.6M', source: 28 },
        { date: '2026-03-31', value: 2e6, label: '>2M', source: 29 },
        { date: '2026-06-02', value: 5e6, label: '>5M', source: 13 },
      ],
    },
  };
  const adoption = [
    { name: 'Claude Code', percent: 39 },
    { name: 'GitHub Copilot', percent: 21 },
    { name: 'Codex', percent: 16 },
    { name: 'Cursor', percent: 12 },
    { name: 'JetBrains AI', percent: 9 },
    { name: 'OpenCode', percent: 7 },
    { name: 'Google Antigravity', percent: 6 },
  ];
  const metrics = [
    {
      metric: 'Weekly ChatGPT reach',
      value: '1.2B',
      date: '2026-10-05',
      unit: 'people per week',
      kind: 'Company report',
      source: 6,
      caveat: 'Not agent-only users; overlaps with other platforms.',
    },
    {
      metric: 'Gemini app audience',
      value: '>1B',
      date: '2026-08-11',
      unit: 'monthly active users',
      kind: 'Company report',
      source: 7,
      caveat: 'Not paid Google AI Pro seats or uniquely identified people across products.',
    },
    {
      metric: 'Codex audience',
      value: '>5M',
      date: '2026-06-02',
      unit: 'weekly active users',
      kind: 'Company report',
      source: 13,
      caveat: 'A dated agent-specific figure; not a live estimate.',
    },
    {
      metric: 'Antigravity audience',
      value: '>2.4M',
      date: '2026-07-22',
      unit: 'weekly active users',
      kind: 'Company report',
      source: 8,
      caveat: 'Different observation date from Codex. No league-table inference.',
    },
    {
      metric: 'Weekly coding-agent use',
      value: '90%',
      date: 'May–July 2026',
      unit: 'professional developers surveyed',
      kind: 'Survey',
      source: 5,
      caveat: 'Survey population, not all workers or all people.',
    },
    {
      metric: 'Daily coding-agent use',
      value: '68%',
      date: 'May–July 2026',
      unit: 'professional developers surveyed',
      kind: 'Survey',
      source: 5,
      caveat: 'Self-reported frequency, not independently measured work output.',
    },
    {
      metric: 'Claude Code run-rate',
      value: '>$2.5B',
      date: '2026-02-12',
      unit: 'USD annualized revenue run-rate',
      kind: 'Company report',
      source: 4,
      caveat: 'Not realized annual revenue, profit, valuation or the total agent market.',
    },
    {
      metric: 'Claude Code business subscriptions',
      value: '4×',
      date: 'Jan 1–Feb 12, 2026',
      unit: 'growth multiple',
      kind: 'Company report',
      source: 4,
      caveat: 'Absolute subscription base not disclosed here; not extrapolated automatically.',
    },
    {
      metric: 'Google model API throughput',
      value: '~22B',
      date: '2026-07-22',
      unit: 'tokens per minute',
      kind: 'Company report',
      source: 8,
      caveat: 'Across Google model API customers; not Gemini app messages or agent-only work.',
    },
    {
      metric: 'Dots connected-app ecosystem',
      value: '>4,000',
      date: '2026-09-29',
      unit: 'apps reachable through plugins',
      kind: 'Company report',
      source: 1,
      caveat: 'Integrations are not users, installed plugins or tested successful actions.',
    },
    {
      metric: 'Gemini users using voice',
      value: '63%',
      date: '2026-08-11',
      unit: 'Gemini users, per Google',
      kind: 'Company report',
      source: 7,
      caveat: 'A modality share, not a measure of task success or autonomy.',
    },
    {
      metric: 'Google AI Pro monthly list price',
      value: '$19.99',
      date: reviewed,
      unit: 'USD / month, US monthly plan',
      kind: 'List price',
      source: 10,
      caveat: 'Not a fixed usage allowance. Promotions, tax, extras and annual billing excluded.',
    },
    {
      metric: 'Claude Pro monthly list price',
      value: '$20',
      date: reviewed,
      unit: 'USD / month, US monthly plan',
      kind: 'List price',
      source: 9,
      caveat: 'API and extra usage separate. Annual option differs.',
    },
    {
      metric: 'Standalone Muse active users',
      value: 'Not disclosed',
      date: reviewed,
      unit: 'not available in reviewed sources',
      kind: 'Evidence gap',
      source: 2,
      caveat: 'Meta-wide reach is not substituted for Muse-specific adoption.',
    },
    {
      metric: 'Standalone Dots active users',
      value: 'Not disclosed',
      date: reviewed,
      unit: 'not available in reviewed sources',
      kind: 'Evidence gap',
      source: 1,
      caveat: 'ChatGPT reach is not substituted for Dots-specific adoption.',
    },
  ];
  function filterProducts(category, query) {
    const q = String(query || '')
      .trim()
      .toLowerCase();
    return products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (!q || [p.name, p.org, p.summary, ...p.tags].join(' ').toLowerCase().includes(q))
    );
  }
  function scenarioPoints(baseline, monthlyGrowth, months, mode, capacity) {
    const b = Number(baseline),
      g = Number(monthlyGrowth),
      n = Math.floor(Number(months)),
      cap = Number(capacity);
    if (
      !['compound', 'saturating'].includes(mode) ||
      !(b > 0) ||
      !Number.isFinite(b) ||
      !Number.isFinite(g) ||
      g < 0 ||
      g > 1 ||
      !Number.isFinite(n) ||
      n < 0 ||
      n > 120
    )
      return [];
    if (mode === 'saturating' && (!(cap >= b) || !Number.isFinite(cap))) return [];
    return Array.from({ length: n + 1 }, (_, month) => ({
      month,
      value:
        mode === 'saturating'
          ? cap / (1 + (cap / b - 1) * Math.exp(-g * month))
          : b * Math.pow(1 + g, month),
    }));
  }
  function outcomeCost(input) {
    if (!input || typeof input !== 'object') return null;
    const keys = [
      'inputTokens',
      'outputTokens',
      'inputRate',
      'outputRate',
      'steps',
      'retryPct',
      'successPct',
      'toolCost',
      'reviewMinutes',
      'hourlyRate',
    ];
    const v = {};
    for (const key of keys) {
      if (
        input[key] === '' ||
        input[key] === null ||
        !['number', 'string'].includes(typeof input[key])
      )
        return null;
      v[key] = Number(input[key]);
      if (!Number.isFinite(v[key]) || v[key] < 0) return null;
    }
    if (
      v.successPct <= 0 ||
      v.successPct > 100 ||
      v.steps < 1 ||
      v.steps > 1000 ||
      !Number.isInteger(v.steps) ||
      v.retryPct > 1000
    )
      return null;
    const modelStep = (v.inputTokens * v.inputRate + v.outputTokens * v.outputRate) / 1e6;
    const attempts = v.steps * (1 + v.retryPct / 100);
    const machineAttempt = (modelStep + v.toolCost) * attempts;
    const review = (v.reviewMinutes / 60) * v.hourlyRate;
    const perAccepted = (machineAttempt + review) / (v.successPct / 100);
    return Number.isFinite(perAccepted)
      ? { modelStep, attempts, machineAttempt, review, perAccepted }
      : null;
  }
  function shortNumber(value) {
    if (!Number.isFinite(value)) return '—';
    const abs = Math.abs(value);
    const pair =
      abs >= 1e12
        ? [1e12, 'T']
        : abs >= 1e9
          ? [1e9, 'B']
          : abs >= 1e6
            ? [1e6, 'M']
            : abs >= 1e3
              ? [1e3, 'K']
              : [1, ''];
    return (
      new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value / pair[0]) + pair[1]
    );
  }
  const data = {
    reviewed,
    sources,
    products,
    timeline,
    lenses,
    futures,
    people,
    series,
    adoption,
    metrics,
    filterProducts,
    scenarioPoints,
    outcomeCost,
    shortNumber,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  else root.AgentResearch = data;
})(typeof window !== 'undefined' ? window : globalThis);
