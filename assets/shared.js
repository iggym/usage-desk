/* Browser-only UI primitives. Deliberately no imports or network requests. */
(function () {
  'use strict';
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    orbit:
      '<ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-35 12 12)"/><circle cx="12" cy="12" r="4"/><circle cx="20" cy="6" r="1.5" fill="currentColor" stroke="none"/>',
    chart: '<path d="M3 3v18h18M7 15l4-5 4 3 6-8"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    upRight: '<path d="M7 17 17 7M7 7h10v10"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    wallet:
      '<path d="M20 8V5H5a3 3 0 0 0 0 6h16v8H5a3 3 0 0 1-3-3V8m19 3h-5v4h5"/><path d="M17 13h.01"/>',
    bot: '<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M1 12v4m22-4v4M8 12h.01M16 12h.01M9 16h6"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-8l1-8Z"/>',
    prompt: '<path d="m4 6 6 6-6 6m9 0h7"/>',
    settings:
      '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--bg)"/><circle cx="15" cy="17" r="3" fill="var(--bg)"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    code: '<path d="m8 5-6 7 6 7m8-14 6 7-6 7m-3-16-2 18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    play: '<path d="m8 4 12 8-12 8V4Z"/>',
    book: '<path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Zm0 0v15"/>',
    sparkle:
      '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-2v4m-2-2h4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
    layers: '<path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5"/>',
  };
  const escape = (s) =>
    String(s == null ? '' : s).replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
    );
  const icon = (name) =>
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    (paths[name] || paths.sparkle) +
    '</svg>';
  const logos = {
    gemini: 'googlegemini',
    claude: 'claude',
    muse: 'meta',
    grok: 'x',
    openai: 'openai',
    copilot: 'githubcopilot',
    cursor: 'cursor',
    perplexity: 'perplexity',
    n8n: 'n8n',
    langchain: 'langchain',
    huggingface: 'huggingface',
    salesforce: 'salesforce',
    replit: 'replit',
    crewai: 'crewai',
    zapier: 'zapier',
    google: 'google',
  };
  function brandKey(name) {
    const s = String(name || '').toLowerCase();
    if (s.includes('dot')) return 'dot';
    if (s.includes('gemini') || s.includes('antigravity')) return 'gemini';
    if (s.includes('claude') || s.includes('cowork') || s.includes('anthropic')) return 'claude';
    if (s.includes('muse') || s.includes('meta')) return 'muse';
    if (s.includes('grok')) return 'grok';
    if (s.includes('github') || s === 'copilot') return 'copilot';
    if (s.includes('chatgpt') || s.includes('codex') || s.includes('openai')) return 'openai';
    if (s.includes('comet') || s.includes('perplexity')) return 'perplexity';
    if (s.includes('agentforce')) return 'salesforce';
    if (s.includes('langgraph')) return 'langchain';
    return Object.keys(logos).find((key) => s.includes(key)) || '';
  }
  function logo(name) {
    const key = brandKey(name);
    return (
      '<span class="brand-logo ' +
      escape(key) +
      '" aria-hidden="true">' +
      (key === 'dot'
        ? ''
        : logos[key]
          ? '<img src="assets/logos/' + logos[key] + '.svg" width="19" height="19" alt="">'
          : escape(String(name || '?').slice(0, 1))) +
      '</span>'
    );
  }
  let paused = false;
  try {
    paused = localStorage.getItem('usagedesk:motion') === 'paused';
  } catch (_) {
    /* storage may be disabled */
  }
  const motionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = !!(motionQuery && motionQuery.matches);
  document.documentElement.classList.toggle('motion-paused', paused);
  const button = document.getElementById('motionToggle');
  function syncMotion() {
    if (!button) return;
    button.textContent = paused ? 'Motion: off' : reduced ? 'Motion: reduced' : 'Motion: on';
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute(
      'aria-label',
      button.textContent + (paused ? '. Enable decorative motion' : '. Pause decorative motion')
    );
  }
  if (button)
    button.addEventListener('click', () => {
      paused = !paused;
      document.documentElement.classList.toggle('motion-paused', paused);
      try {
        localStorage.setItem('usagedesk:motion', paused ? 'paused' : 'on');
      } catch (_) {
        /* optional preference */
      }
      syncMotion();
    });
  if (motionQuery && motionQuery.addEventListener)
    motionQuery.addEventListener('change', (event) => {
      reduced = event.matches;
      syncMotion();
    });
  syncMotion();
  const motionOff = () => reduced || paused;
  let observer;
  if (!motionOff() && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04 }
    );
  }
  function reveal() {
    document.querySelectorAll('.reveal:not(.revealed)').forEach((el, i) => {
      el.style.setProperty('--rd', Math.min(i, 4) * 45 + 'ms');
      if (observer) observer.observe(el);
      else el.classList.add('revealed');
    });
  }
  document.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });
  reveal();
  window.DeskUI = { icon, logo, escape, motionOff, reveal };
})();
