/* Interactive research pages. Every simulation runs locally; nothing is sent to a model. */
(function () {
  'use strict';
  const R = window.AgentResearch,
    UI = window.DeskUI;
  const $ = (id) => document.getElementById(id),
    E = UI.escape;
  const source = (id) => R.sources.find((item) => item.id === id);
  function citation(id) {
    const s = source(id);
    return s
      ? '<a class="source-link" href="' +
          E(s.url) +
          '" target="_blank" rel="noopener" title="' +
          E(s.publisher + ' · ' + (s.date || 'living documentation')) +
          '">[' +
          s.id +
          ']</a>'
      : '';
  }
  const citations = (ids) => (ids || []).map(citation).join(' ');
  const money = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 3,
    }).format(value);
  const formatDate = (value) =>
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value + 'T00:00:00Z'));
  const monthDate = (value) =>
    new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', year: '2-digit' }).format(
      new Date(value + 'T00:00:00Z')
    );
  function renderSources() {
    if (!$('sourceList')) return;
    $('sourceList').innerHTML = R.sources
      .map(
        (s) =>
          '<li id="source-' +
          s.id +
          '"><a href="' +
          E(s.url) +
          '" target="_blank" rel="noopener">[' +
          s.id +
          '] ' +
          E(s.publisher) +
          ' · ' +
          E(s.title) +
          ' ↗</a><p>' +
          E(s.note) +
          '</p><span class="source-meta">' +
          E(s.type.toUpperCase()) +
          ' · ' +
          E(s.date || 'LIVING DOCUMENTATION') +
          ' · REVIEWED ' +
          R.reviewed +
          '</span></li>'
      )
      .join('');
  }

  /* ---------------- Agent Atlas ---------------- */
  if ($('productGrid')) {
    let category = 'all';
    const labels = {
      personal: 'Personal',
      code: 'Code',
      research: 'Research',
      workflows: 'Workflows',
      enterprise: 'Enterprise',
      builders: 'Builder tools',
    };
    const marks = {
      personal: '🫧',
      code: '⌘',
      research: '🔭',
      workflows: '⚙️',
      enterprise: '🏛️',
      builders: '🧱',
    };
    /* Faces swap in place; the hidden one leaves the tab order and the a11y tree. */
    function syncFaces(card) {
      const flipped = card.classList.contains('is-flipped');
      [
        [card.querySelector('.flip-front'), !flipped],
        [card.querySelector('.flip-back'), flipped],
      ].forEach(([face, visible]) => {
        if (!face) return;
        face.toggleAttribute('inert', !visible);
        face.setAttribute('aria-hidden', String(!visible));
      });
    }
    function wireFlips(grid) {
      grid.addEventListener('click', (event) => {
        const trigger = event.target.closest('[data-flip]');
        if (!trigger || !grid.contains(trigger)) return;
        const card = trigger.closest('.product-card, .person-card');
        if (!card) return;
        const face = trigger.closest('.flip-face');
        card.classList.toggle('is-flipped');
        syncFaces(card);
        const next = card.querySelector(
          card.classList.contains('is-flipped') ? '.flip-back' : '.flip-front'
        );
        const target = next && next.querySelector('button, a[href]');
        if (target && face && !face.contains(target)) target.focus();
      });
    }
    wireFlips($('productGrid'));
    function renderProducts() {
      const products = R.filterProducts(category, $('productSearch').value);
      $('productCount').textContent =
        products.length +
        ' of ' +
        R.products.length +
        ' products · capabilities are vendor-described · select a field note to inspect limits';
      $('productGrid').innerHTML = products.length
        ? products
            .map(
              (p) =>
                '<article class="product-card reveal"><div class="flip-inner">' +
                '<div class="flip-face flip-front">' +
                '<div class="product-top">' +
                UI.logo(p.name) +
                '<div><h3>' +
                E(p.name) +
                '</h3><small>' +
                E(p.org) +
                '</small></div></div><p class="product-summary">' +
                E(p.summary) +
                citation(p.source) +
                '</p><div class="product-tags">' +
                p.tags.map((tag) => '<span class="tag">' + E(tag) + '</span>').join('') +
                '</div><div class="product-bottom"><span>' +
                E(labels[p.category]) +
                '</span><span class="product-actions">' +
                '<button type="button" class="flip-btn" data-flip aria-label="The odd detail: lesser-known note for ' +
                E(p.name) +
                '">' +
                UI.icon('sparkle') +
                'The odd detail</button><button type="button" data-product="' +
                p.id +
                '" aria-label="Read the field note for ' +
                E(p.name) +
                '">Field note ' +
                UI.icon('upRight') +
                '</button></span></div></div>' +
                '<div class="flip-face flip-back" aria-hidden="true" inert><span class="back-watermark" aria-hidden="true">' +
                UI.logo(p.name) +
                '</span><h4>' +
                UI.icon('sparkle') +
                'Less well known</h4><p class="lore">' +
                E(
                  p.surprise ||
                    p.caution ||
                    'The useful detail is in the primary source, not the launch post.'
                ) +
                '</p><p class="lore-source">Sourced field note · <a href="' +
                E(source(p.source).url) +
                '" target="_blank" rel="noopener">' +
                E(source(p.source).publisher) +
                ' ↗</a></p><button type="button" class="flip-btn" data-flip aria-label="Return to the ' +
                E(p.name) +
                ' summary">Back to the brief ↺</button></div></div></article>'
            )
            .join('')
        : '<p class="empty" style="grid-column:1/-1">No agents match those filters. Try another category or a broader search.</p>';
      UI.reveal();
    }
    $('productFilters').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-category]');
      if (!button) return;
      category = button.dataset.category;
      $('productFilters')
        .querySelectorAll('button')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      renderProducts();
    });
    $('productSearch').addEventListener('input', renderProducts);
    $('productGrid').addEventListener('click', (event) => {
      const button = event.target.closest('button[data-product]');
      if (!button) return;
      const p = R.products.find((item) => item.id === button.dataset.product);
      if (!p) return;
      $('dialogProductHeading').innerHTML =
        '<div class="product-top">' +
        UI.logo(p.name) +
        '<div><h3 id="dialogProductName">' +
        E(p.name) +
        '</h3><small>' +
        E(p.org + ' · ' + labels[p.category]) +
        '</small></div></div>';
      $('dialogProductBody').innerHTML =
        '<span class="badge violet">' +
        E(p.signal) +
        '</span><p style="margin-top:14px">' +
        E(p.summary) +
        citations([p.source, ...(p.extraSources || [])]) +
        '</p><h4>What it can do · vendor-described</h4><ul>' +
        p.capabilities.map((text) => '<li>' + E(text) + '</li>').join('') +
        '</ul><h4>The fine print</h4><p>' +
        E(p.caution) +
        '</p><h4>Direction to watch · editorial inference</h4><p>' +
        E(p.next) +
        '</p><p class="tiny muted">Research snapshot reviewed ' +
        R.reviewed +
        '. Survey usage signals, where shown, refer to May–July 2026 professional developers, not all users.</p>' +
        (p.preset
          ? '<a class="btn primary" href="index.html?preset=' +
            p.preset +
            '#providers">Configure this agent on your desk ' +
            UI.icon('arrow') +
            '</a>'
          : '') +
        '<a class="btn" style="margin-left:8px" href="' +
        E(source(p.source).url) +
        '" target="_blank" rel="noopener">Read the primary source ' +
        UI.icon('upRight') +
        '</a>';
      $('productDialog').showModal();
    });
    $('closeProductDialog').addEventListener('click', () => $('productDialog').close());
    // Keep keyboard traversal inside the field note, including browsers that
    // otherwise route Tab from the final link into browser chrome.
    $('productDialog').addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const controls = [
        ...$('productDialog').querySelectorAll(
          'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
        ),
      ].filter((el) => el.getClientRects().length);
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    function renderTimeline() {
      const item = R.timeline[Number($('timelineRange').value)];
      $('timelineRange').setAttribute(
        'aria-valuetext',
        item.year + ': ' + item.label + '. ' + item.title
      );
      $('timelinePanel').innerHTML =
        '<div class="timeline-year">' +
        item.year +
        '</div><div class="timeline-content"><span class="badge ' +
        (item.type === 'reported' ? '' : 'violet') +
        '">' +
        E(item.label) +
        '</span><h3 style="margin-top:12px">' +
        E(item.title) +
        '</h3><p>' +
        E(item.body) +
        citations(item.sources) +
        '</p></div>';
      $('timelinePanel').dataset.type = item.type;
    }
    $('timelineRange').addEventListener('input', renderTimeline);
    function selectLens(id) {
      const lens = R.lenses.find((item) => item.id === id);
      $('lensControls')
        .querySelectorAll('button')
        .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lens === id)));
      $('lensPanel').innerHTML =
        '<span class="lens-emoji" aria-hidden="true">' +
        lens.emoji +
        '</span><div><h3>' +
        E(lens.title) +
        '</h3><p>' +
        E(lens.text) +
        citations(lens.sources) +
        '</p></div>';
    }
    $('lensControls').innerHTML = R.lenses
      .map(
        (lens, i) =>
          '<button type="button" data-lens="' +
          lens.id +
          '" aria-pressed="' +
          (i === 0) +
          '">' +
          E(lens.label) +
          '</button>'
      )
      .join('');
    $('lensControls').addEventListener('click', (event) => {
      const button = event.target.closest('[data-lens]');
      if (button) selectLens(button.dataset.lens);
    });
    const stanceWords = ['Not in my lifetime', 'Plausible, with limits', 'Closer than it sounds'];
    const stanceReplies = [
      'Fair. The hard part was never the demo; it was consent, reversibility and who can switch it off.',
      'A workable stance: plausible, but only if permissions and exit routes are designed before the feature.',
      'Then the question to keep asking is not “can it?” but “who owns the objective, and what does an error cost?”',
    ];
    $('futureGrid').innerHTML = R.futures
      .map(
        (future, i) =>
          '<article class="future-card"><div class="future-scene"><img src="' +
          E(future.image || 'assets/agent-world.webp') +
          '" width="1536" height="1024" loading="lazy" alt="' +
          E(future.alt || 'AI-generated concept image') +
          '"><span class="badge violet">Thought experiment</span><span class="future-icon" aria-hidden="true">' +
          future.emoji +
          '</span></div><div class="future-body"><p class="eyebrow">' +
          E(future.tag) +
          '</p><h3>' +
          E(future.title) +
          '</h3><p class="future-text" id="future-text-' +
          i +
          '">' +
          E(future.possibility) +
          '</p><div class="stance"><div class="stance-head"><label for="stance-' +
          i +
          '">How plausible does this feel?</label><output id="stance-out-' +
          i +
          '" for="stance-' +
          i +
          '">' +
          stanceWords[1] +
          '</output></div><input id="stance-' +
          i +
          '" type="range" min="0" max="2" step="1" value="1" data-stance="' +
          i +
          '" aria-describedby="stance-reply-' +
          i +
          '"><p class="stance-reaction" id="stance-reply-' +
          i +
          '" role="status">' +
          stanceReplies[1] +
          '</p></div><button type="button" data-future="' +
          i +
          '" aria-pressed="false" aria-controls="future-text-' +
          i +
          '">Flip the perspective ↻</button></div></article>'
      )
      .join('');
    $('futureGrid').addEventListener('click', (event) => {
      const button = event.target.closest('[data-future]');
      if (!button) return;
      const flipped = button.getAttribute('aria-pressed') !== 'true',
        i = Number(button.dataset.future);
      button.setAttribute('aria-pressed', String(flipped));
      button.closest('article').classList.toggle('is-flipped', flipped);
      $('future-text-' + i).textContent = flipped
        ? R.futures[i].friction
        : R.futures[i].possibility;
      button.textContent = flipped ? 'Return to the possibility ↻' : 'Flip the perspective ↻';
    });
    $('futureGrid').addEventListener('input', (event) => {
      const slider = event.target.closest('[data-stance]');
      if (!slider) return;
      const i = Number(slider.dataset.stance),
        value = Math.min(2, Math.max(0, Number(slider.value)));
      $('stance-out-' + i).textContent = stanceWords[value];
      $('stance-reply-' + i).textContent = stanceReplies[value];
      const card = slider.closest('.future-card');
      card.classList.remove('reaction-pop');
      // Reflow restarts the one-shot animation without a timer.
      void card.offsetWidth;
      card.classList.add('reaction-pop');
    });
    /* A small constellation of the brands and ideas being speculated about. */
    if ($('futureOrbits')) {
      const orbitBrands = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Cursor', 'n8n'];
      const orbitEmoji = ['🪞', '🌐', '🫧', '✳️', '🧠', '🛰️'];
      $('futureOrbits').innerHTML =
        '<span class="orbit-note">Speculation is not a roadmap</span><span class="orbit-line"></span>' +
        orbitBrands
          .map(
            (name, i) =>
              '<span class="orbit-logo" style="animation-delay:' +
              i * 0.4 +
              's">' +
              UI.logo(name) +
              '</span><span class="orbit-emoji" style="animation-delay:' +
              (i * 0.5 + 0.2) +
              's" aria-hidden="true">' +
              orbitEmoji[i] +
              '</span>'
          )
          .join('');
    }
    const orgs = [
      ['OpenAI', 'Models + personal agents'],
      ['Anthropic', 'Models + knowledge work'],
      ['Google', 'Models + everyday surfaces'],
      ['Meta', 'Social + personal agents'],
      ['GitHub', 'Repository + agent workflows'],
      ['Cursor', 'Agentic software tools'],
      ['Microsoft', 'Enterprise + governance'],
      ['Salesforce', 'CRM + business agents'],
      ['Replit', 'Prompt-to-app tooling'],
      ['n8n', 'Workflow orchestration'],
      ['LangChain', 'Stateful agent runtimes'],
      ['CrewAI', 'Multi-agent coordination'],
    ];
    $('organizationList').innerHTML = orgs
      .map(
        ([name, role]) =>
          '<span class="organization-item">' +
          UI.logo(name) +
          '<span><strong>' +
          E(name) +
          '</strong><small>' +
          E(role) +
          '</small></span></span>'
      )
      .join('');
    $('peopleGrid').innerHTML = R.people
      .map((person) => {
        const art = person.image
          ? '<img src="' +
            E(person.image) +
            '" width="1536" height="1024" loading="lazy" alt="' +
            E(person.alt || 'AI-generated concept image') +
            '">'
          : '';
        return (
          '<article class="person-card reveal"><div class="flip-inner">' +
          '<div class="flip-face flip-front"><div class="person-photo' +
          (person.image ? '' : ' abstract') +
          '">' +
          art +
          (person.image
            ? '<span class="visual-caption">AI concept · not a portrait</span>'
            : '<span class="person-avatar" aria-hidden="true">' + E(person.initials) + '</span>') +
          '</div><div class="person-meta"><h3>' +
          E(person.name) +
          '</h3><p class="person-role">' +
          E(person.role) +
          citation(person.source) +
          '</p><p class="person-lens">' +
          E(person.lens) +
          '</p><div class="flip-actions"><button type="button" class="flip-btn" data-flip aria-label="Less known: lesser-known note about ' +
          E(person.name) +
          '">' +
          UI.icon('sparkle') +
          'Less known</button></div></div></div>' +
          '<div class="flip-face flip-back" aria-hidden="true" inert data-mark="' +
          E(person.initials) +
          '"><span class="badge violet">Lesser-known detail</span><p class="lore">' +
          E(
            person.surprise ||
              person.lens + ' Listed here as a reading pointer, not an endorsement.'
          ) +
          '</p><p class="lore-source">Source · <a href="' +
          E(source(person.source).url) +
          '" target="_blank" rel="noopener">' +
          E(source(person.source).publisher) +
          ' ↗</a></p><button type="button" class="flip-btn" data-flip aria-label="Back: close the note about ' +
          E(person.name) +
          '">Back ↺</button></div></div></article>'
        );
      })
      .join('');
    wireFlips($('peopleGrid'));
    /* A finite state simulation. Approval is always explicit, never timer-driven. */
    const autonomyNames = ['Draft only', 'Assist + ask', 'Delegate bounded work'];
    const jobs = {
      research: {
        intent: 'Prepare a sourced weekly brief.',
        plan: 'Scope three topics, gather dated sources, and cap the brief at 250 words.',
        tools: 'Read allowed sources and prepare a draft with evidence links.',
        check: 'The brief is ready. Sharing it with the team is a consequential action.',
        action: 'share the brief',
        result:
          'A reviewed brief, ready for the team. The simulated send is recorded in the action log.',
      },
      code: {
        intent: 'Fix a small software regression.',
        plan: 'Reproduce the failure, make the smallest fix, and add a regression test.',
        tools: 'Edit in a sandbox, run the tests, and prepare a small pull request.',
        check:
          'The tests pass in this illustration. Merging a PR still changes a real shared system.',
        action: 'merge the pull request',
        result:
          'A tested, reviewed change. The simulated merge is recorded; production effects still require monitoring.',
      },
      bill: {
        intent: 'Renegotiate a recurring bill.',
        plan: 'Read the current terms, compare alternatives, and propose one bounded offer.',
        tools: 'Inspect read-only account information and draft a negotiation message.',
        check: 'A new offer is ready. Accepting it creates a financial commitment.',
        action: 'accept the new terms',
        result:
          'A reviewed proposal with a simulated acceptance. Real contract decisions require checking the full terms.',
      },
    };
    let labTimer = null,
      waiting = false,
      running = false;
    const nodes = () => [...$('labVisual').querySelectorAll('.flow-node')];
    function resetLab() {
      clearTimeout(labTimer);
      labTimer = null;
      waiting = false;
      running = false;
      $('labVisual').classList.remove('running');
      nodes().forEach((node) => node.classList.remove('active', 'done', 'approval'));
      $('approveLabBtn').hidden = true;
      $('runLabBtn').disabled = false;
      $('autonomyValue').value = autonomyNames[Number($('autonomyRange').value)];
      $('labStatus').innerHTML =
        'Boundary: <strong>' +
        autonomyNames[Number($('autonomyRange').value)] +
        '</strong>. Run this local illustration to see where the agent works—and where you decide.';
    }
    function finishLab() {
      clearTimeout(labTimer);
      waiting = false;
      running = false;
      nodes().forEach((node) => {
        node.classList.remove('active', 'approval');
        node.classList.add('done');
      });
      $('labVisual').classList.remove('running');
      $('approveLabBtn').hidden = true;
      $('runLabBtn').disabled = false;
      $('labStatus').innerHTML =
        '<strong>Simulation complete.</strong> ' +
        E(jobs[$('labTask').value].result) +
        '<br><small>No apps were accessed and no real-world action occurred.</small>';
    }
    function labStep(step) {
      if (!running) return;
      const job = jobs[$('labTask').value],
        autonomy = Number($('autonomyRange').value);
      nodes().forEach((node, index) => {
        node.classList.toggle('done', index < step);
        node.classList.toggle('active', index === step);
        node.classList.remove('approval');
      });
      if (step < 3) {
        const text = [
          job.intent,
          job.plan,
          autonomy === 0
            ? 'Draft a proposed tool plan. Draft-only mode does not execute tools.'
            : job.tools,
        ][step];
        $('labStatus').innerHTML =
          '<strong>' +
          ['Intent', 'Plan', autonomy === 0 ? 'Propose only' : 'Bounded tools'][step] +
          '.</strong> ' +
          E(text);
        labTimer = setTimeout(() => labStep(step + 1), UI.motionOff() ? 0 : 850);
      } else if (autonomy === 0) {
        running = false;
        $('labVisual').classList.remove('running');
        $('runLabBtn').disabled = false;
        nodes().forEach((node) => {
          node.classList.remove('active');
          node.classList.add('done');
        });
        $('labStatus').innerHTML =
          '<strong>Draft complete. No execution authorized.</strong> You have a bounded proposal, not a performed task. The agent stops here.';
      } else {
        waiting = true;
        running = false;
        $('labVisual').classList.remove('running');
        nodes()[3].classList.add('approval');
        $('labStatus').innerHTML =
          '<strong>Human approval required.</strong> ' +
          E(job.check) +
          ' The agent cannot ' +
          E(job.action) +
          ' until you explicitly approve.';
        $('approveLabBtn').hidden = false;
        $('approveLabBtn').textContent = 'Approve simulated action';
      }
    }
    $('labForm').addEventListener('submit', (event) => {
      event.preventDefault();
      resetLab();
      running = true;
      $('runLabBtn').disabled = true;
      $('labVisual').classList.add('running');
      labStep(0);
    });
    $('approveLabBtn').addEventListener('click', () => {
      if (waiting) finishLab();
    });
    $('resetLabBtn').addEventListener('click', resetLab);
    $('autonomyRange').addEventListener('input', resetLab);
    $('labTask').addEventListener('change', resetLab);
    renderProducts();
    renderTimeline();
    selectLens(R.lenses[0].id);
    resetLab();
  }

  /* ---------------- The real numbers ---------------- */
  if ($('numberKpis')) {
    const kpis = [
      {
        name: 'ChatGPT',
        value: 1.2,
        text: '1.2B',
        suffix: 'B',
        desc: 'Weekly people reached',
        date: 'OCT 5, 2026 · COMPANY REPORT',
        source: 6,
      },
      {
        name: 'Gemini',
        value: 1,
        text: '>1B',
        prefix: '>',
        suffix: 'B',
        desc: 'Monthly active app users',
        date: 'AUG 11, 2026 · COMPANY REPORT',
        source: 7,
      },
      {
        name: 'Coding-agent use',
        value: 90,
        text: '90%',
        suffix: '%',
        desc: 'Surveyed developers · weekly',
        date: 'MAY–JUL 2026 · SURVEY',
        source: 5,
      },
      {
        name: 'Claude Code',
        value: 2.5,
        text: '>$2.5B',
        prefix: '>$',
        suffix: 'B',
        desc: 'Annualized revenue run-rate',
        date: 'FEB 12, 2026 · COMPANY REPORT',
        source: 4,
      },
    ];
    $('numberKpis').innerHTML = kpis
      .map(
        (k, i) =>
          '<div class="number-kpi"><div class="kpi-top"><span>' +
          E(k.name) +
          '</span>' +
          (i === 2 ? UI.icon('code') : UI.logo(k.name)) +
          '</div><div class="kpi-value" data-kpi="' +
          i +
          '">' +
          k.text +
          '</div><p class="kpi-desc">' +
          E(k.desc) +
          citation(k.source) +
          '</p><p class="kpi-date">' +
          E(k.date) +
          '</p></div>'
      )
      .join('');
    // Counters are decorative; accessible labels expose the final, qualified values.
    kpis.forEach((k, i) => {
      const el = $('numberKpis').querySelector('[data-kpi="' + i + '"]');
      el.setAttribute('aria-label', k.text + ' ' + k.desc);
      if (UI.motionOff()) return;
      const started = performance.now();
      function frame(now) {
        if (UI.motionOff()) {
          el.textContent = k.text;
          return;
        }
        const t = Math.min(1, (now - started) / 950),
          n = k.value * (1 - Math.pow(1 - t, 3));
        el.textContent =
          (k.prefix || '') +
          new Intl.NumberFormat('en-US', { maximumFractionDigits: i === 2 ? 0 : 1 }).format(n) +
          k.suffix;
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = k.text;
      }
      requestAnimationFrame(frame);
    });

    function chartFrame(points, options) {
      const width = 660,
        height = 255,
        left = 57,
        right = 24,
        top = 18,
        bottom = 38;
      const values = points.map((p) => p.value),
        maxValue = Math.max(...values) * 1.06;
      const order = Math.pow(10, Math.floor(Math.log10(maxValue || 1)));
      const ceiling = (Math.ceil((maxValue / order) * 2) / 2) * order;
      const minX = points[0].x,
        maxX = points[points.length - 1].x;
      const X = (x) => left + ((x - minX) / Math.max(1, maxX - minX)) * (width - left - right);
      const Y = (value) => height - bottom - (value / ceiling) * (height - top - bottom);
      let grid = '';
      for (let i = 0; i <= 4; i++) {
        const value = (ceiling / 4) * i,
          y = Y(value);
        grid +=
          '<line class="chart-grid" x1="' +
          left +
          '" y1="' +
          y +
          '" x2="' +
          (width - right) +
          '" y2="' +
          y +
          '"/><text class="chart-label" x="' +
          (left - 10) +
          '" y="' +
          (y + 4) +
          '" text-anchor="end">' +
          R.shortNumber(value) +
          '</text>';
      }
      const line = points.map((p) => X(p.x).toFixed(2) + ',' + Y(p.value).toFixed(2)).join(' ');
      const d = 'M' + points.map((p) => X(p.x).toFixed(2) + ' ' + Y(p.value).toFixed(2)).join(' L');
      const area =
        d +
        ' L' +
        X(points[points.length - 1].x).toFixed(2) +
        ' ' +
        Y(0).toFixed(2) +
        ' L' +
        X(points[0].x).toFixed(2) +
        ' ' +
        Y(0).toFixed(2) +
        ' Z';
      const gradientId = options.id + 'Gradient';
      const contents =
        '<defs><linearGradient id="' +
        gradientId +
        '" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' +
        options.color +
        '" stop-opacity=".2"/><stop offset="100%" stop-color="' +
        options.color +
        '" stop-opacity="0"/></linearGradient></defs>' +
        grid +
        '<path d="' +
        area +
        '" fill="url(#' +
        gradientId +
        ')"/><polyline points="' +
        line +
        '" class="chart-path ' +
        (options.dashed ? 'projection-line' : 'draw-line') +
        '" style="stroke:' +
        options.color +
        (options.dashed ? ';stroke-dasharray:5 6' : '') +
        '"/>';
      return { X, Y, width, height, contents };
    }
    function renderHistory() {
      const s = R.series[$('historySeries').value];
      const points = s.points.map((p) => ({ ...p, x: Date.parse(p.date + 'T00:00:00Z') }));
      const chart = chartFrame(points, { id: 'history', color: '#ffac83', dashed: false });
      const { X, Y } = chart;
      const dots = points
        .map(
          (p, i) =>
            '<g class="chart-point" tabindex="0" role="button" data-point="' +
            i +
            '" aria-label="Inspect ' +
            E((p.dateLabel || formatDate(p.date)) + ': ' + p.label + ' ' + s.unit) +
            '"><circle class="chart-dot" cx="' +
            X(p.x) +
            '" cy="' +
            Y(p.value) +
            '" r="5"/><circle class="chart-dot-hit" cx="' +
            X(p.x) +
            '" cy="' +
            Y(p.value) +
            '" r="17"/></g>'
        )
        .join('');
      const labels = points
        .map(
          (p, i) =>
            '<text class="chart-label" x="' +
            X(p.x) +
            '" y="244" text-anchor="' +
            (i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle') +
            '">' +
            E(monthDate(p.date)) +
            '</text>'
        )
        .join('');
      $('historyChart').innerHTML =
        '<svg class="chart-svg" viewBox="0 0 660 255" role="group" aria-label="Reported ' +
        E(s.name + ' ' + s.unit) +
        '"><title>' +
        E(s.name + ' reported historical audience; select a point for its date and source') +
        '</title>' +
        chart.contents +
        dots +
        labels +
        '</svg>';
      $('historyTitle').textContent = s.name + ' · ' + s.unit;
      $('historyCaption').textContent =
        s.audience +
        '. Lines guide the eye between reported snapshots, not continuous observations. “>” figures are plotted at the reported floor. Reporting definitions may evolve; no missing-month counts are manufactured.';
      function inspect(index) {
        const p = points[index];
        $('historyInfo').innerHTML =
          E(p.dateLabel || formatDate(p.date)) +
          ' · <strong>' +
          E(p.label) +
          '</strong> ' +
          E(s.unit) +
          ' ' +
          citation(p.source);
      }
      $('historyChart')
        .querySelectorAll('[data-point]')
        .forEach((point) => {
          const inspectPoint = () => inspect(Number(point.dataset.point));
          point.addEventListener('mouseenter', inspectPoint);
          point.addEventListener('focus', inspectPoint);
          point.addEventListener('click', inspectPoint);
          point.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              inspectPoint();
            }
          });
        });
      $('historyTable').innerHTML =
        '<table><caption class="sr-only">' +
        E(s.name + ' historical ' + s.unit) +
        '</caption><thead><tr><th scope="col">Reported date</th><th scope="col">Audience</th><th scope="col">Unit</th><th scope="col">Source</th></tr></thead><tbody>' +
        points
          .map(
            (p) =>
              '<tr><td>' +
              E(p.dateLabel || formatDate(p.date)) +
              '</td><td>' +
              E(p.label) +
              '</td><td>' +
              E(s.unit) +
              '</td><td>' +
              citation(p.source) +
              '</td></tr>'
          )
          .join('') +
        '</tbody></table>';
      inspect(points.length - 1);
    }
    $('historySeries').addEventListener('change', renderHistory);
    $('adoptionBars').innerHTML = R.adoption
      .map(
        (row) =>
          '<div class="adoption-row" role="img" aria-label="' +
          E(row.name) +
          ': ' +
          row.percent +
          '% of surveyed professional developers used at work"><span>' +
          UI.logo(row.name) +
          E(row.name) +
          '</span><span class="adoption-track" aria-hidden="true"><span class="adoption-fill" style="--bar:' +
          row.percent +
          '%"></span></span><strong aria-hidden="true">' +
          row.percent +
          '%</strong></div>'
      )
      .join('');
    function renderScenario() {
      const s = R.series[$('scenarioSeries').value],
        baseline = s.points[s.points.length - 1];
      const growthPct = Number($('growthRate').value),
        months = Number($('growthMonths').value),
        mode = $('growthMode').value;
      const capacity = Number($('scenarioCapacity').value) * 1e6;
      $('growthRateValue').value = growthPct + '%' + (mode === 'saturating' ? ' (r)' : '');
      $('growthMonthsValue').value = months + ' months';
      $('capacityWrap').hidden = mode !== 'saturating';
      $('scenarioCapacity').min = Math.ceil(baseline.value / 1e6);
      const points = R.scenarioPoints(baseline.value, growthPct / 100, months, mode, capacity).map(
        (p) => ({ ...p, x: p.month })
      );
      if (!points.length) {
        $('scenarioResult').textContent = 'Use a finite ceiling at least as large as the baseline.';
        $('scenarioChart').textContent = '';
        $('scenarioCaveat').textContent = 'No valid scenario is plotted.';
        return;
      }
      const last = points[points.length - 1],
        multiple = last.value / baseline.value;
      $('scenarioResult').innerHTML =
        '<strong>' +
        R.shortNumber(last.value) +
        '</strong><span>' +
        E(s.unit) +
        '<br>after ' +
        months +
        ' hypothetical months · ' +
        multiple.toFixed(2) +
        '× the assumed baseline</span>';
      const chart = chartFrame(points, { id: 'scenario', color: '#b9ed8a', dashed: true });
      let labels = '';
      for (let month = 0; month <= months; month += months / 4)
        labels +=
          '<text class="chart-label" x="' +
          chart.X(month) +
          '" y="244" text-anchor="' +
          (month === 0 ? 'start' : month === months ? 'end' : 'middle') +
          '">' +
          (month === 0 ? 'Baseline' : '+' + month + ' mo') +
          '</text>';
      $('scenarioChart').innerHTML =
        '<svg class="chart-svg" viewBox="0 0 660 255" role="img" aria-label="Hypothetical ' +
        E(s.name) +
        ' scenario from ' +
        R.shortNumber(baseline.value) +
        ' to ' +
        R.shortNumber(last.value) +
        ' in ' +
        months +
        ' months; not a forecast"><title>Hypothetical scenario, not a forecast</title>' +
        chart.contents +
        '<circle class="chart-dot" style="fill:var(--accent)" cx="' +
        chart.X(0) +
        '" cy="' +
        chart.Y(baseline.value) +
        '" r="5"/>' +
        labels +
        '</svg>';
      $('scenarioFormula').textContent =
        mode === 'compound'
          ? 'N(t) = N₀ × (1 + g)^t · g is assumed constant monthly growth.'
          : 'N(t) = K / [1 + (K/N₀ − 1)e^(−rt)] · r is a logistic rate parameter, not constant monthly growth.';
      $('scenarioCaveat').innerHTML =
        'Starts at the reported floor of ' +
        E(baseline.label + ' ' + s.unit + ' on ' + formatDate(baseline.date)) +
        citation(baseline.source) +
        '. The unobserved months after that disclosure are not filled in as fact. Every green point is a mathematical what-if. ' +
        (mode === 'compound'
          ? 'This model has no saturation ceiling; long-run results can become implausible.'
          : 'The ceiling K is your assumption, not a demographic forecast.') +
        ' No probability or confidence interval is implied.';
    }
    $('scenarioSeries').addEventListener('change', () => {
      $('scenarioCapacity').value = $('scenarioSeries').value === 'codex' ? '100' : '5000';
      renderScenario();
    });
    ['growthRate', 'growthMonths', 'growthMode', 'scenarioCapacity'].forEach((id) =>
      $(id).addEventListener('input', renderScenario)
    );
    $('scenarioForm').addEventListener('submit', (event) => event.preventDefault());
    function renderOutcome() {
      const input = {};
      const map = {
        inputTokens: 'simInputTokens',
        outputTokens: 'simOutputTokens',
        inputRate: 'simInputRate',
        outputRate: 'simOutputRate',
        steps: 'simSteps',
        retryPct: 'simRetryPct',
        successPct: 'simSuccessPct',
        toolCost: 'simToolCost',
        reviewMinutes: 'simReviewMinutes',
        hourlyRate: 'simHourlyRate',
      };
      let valid = true;
      Object.entries(map).forEach(([key, id]) => {
        input[key] = $(id).value;
        if (!$(id).validity.valid || $(id).value === '') valid = false;
      });
      const result = valid ? R.outcomeCost(input) : null;
      if (!result) {
        $('outcomeResult').textContent = 'Check your inputs';
        $('outcomeBreakdown').textContent =
          'Use nonnegative, finite costs and an acceptance rate above 0% and no higher than 100%.';
        return;
      }
      $('outcomeResult').innerHTML =
        money(result.perAccepted) + '<small>estimated total cost per accepted outcome</small>';
      $('outcomeBreakdown').textContent =
        money(result.modelStep) +
        ' model cost/step · ' +
        result.attempts.toFixed(1) +
        ' expected steps with retries · ' +
        money(result.machineAttempt) +
        ' machine/tool cost + ' +
        money(result.review) +
        ' review per workflow attempt.';
    }
    $('outcomeForm').addEventListener('input', renderOutcome);
    $('outcomeForm').addEventListener('submit', (event) => event.preventDefault());
    function renderMetrics() {
      const kind = $('metricFilter').value,
        rows = R.metrics.filter((row) => kind === 'all' || row.kind === kind);
      $('metricsTable').innerHTML =
        '<table><caption class="sr-only">Curated AI agent and assistant metrics with sources, dates and limitations</caption><thead><tr><th scope="col">Metric / unit</th><th scope="col">Reported value</th><th scope="col">Date / period</th><th scope="col">Evidence / limitation</th></tr></thead><tbody>' +
        rows
          .map(
            (row) =>
              '<tr><td><strong>' +
              E(row.metric) +
              '</strong><br><span class="muted tiny">' +
              E(row.unit) +
              '</span></td><td style="white-space:nowrap;font-family:var(--mono)">' +
              E(row.value) +
              citation(row.source) +
              '</td><td>' +
              E(row.date) +
              '</td><td><span class="badge">' +
              E(row.kind) +
              '</span><p class="tiny muted" style="margin:6px 0 0">' +
              E(row.caveat) +
              '</p></td></tr>'
          )
          .join('') +
        '</tbody></table>';
    }
    $('metricFilter').addEventListener('change', renderMetrics);
    $('exportResearchBtn').addEventListener('click', () => {
      const cell = (value) => '"' + String(value).replace(/"/g, '""') + '"';
      const rows = [
        [
          'Metric',
          'Reported value',
          'Unit',
          'Date or period',
          'Evidence type',
          'Caveat',
          'Source URL',
          'Reviewed',
        ],
        ...R.metrics.map((row) => [
          row.metric,
          row.value,
          row.unit,
          row.date,
          row.kind,
          row.caveat,
          source(row.source).url,
          R.reviewed,
        ]),
      ];
      const csv = rows.map((row) => row.map(cell).join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usage-desk-agent-research-' + R.reviewed + '.csv';
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    });
    renderHistory();
    renderScenario();
    renderOutcome();
    renderMetrics();
  }
  renderSources();
  UI.reveal();
})();
