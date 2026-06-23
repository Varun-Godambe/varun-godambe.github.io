/* ============================================================
   Varun Godambe — Portfolio
   Theme · nav · reveal · ticker · rotor · counters · expand · terminal
   ============================================================ */
(function () {
  'use strict';

  var THEME_KEY = 'vg-theme';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Theme ---------------------------------------------- */
  function applyTheme(t) { document.documentElement.dataset.theme = t; }

  function initTheme() {
    var t = 'dark';
    try {
      t = localStorage.getItem(THEME_KEY) ||
          (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    } catch (e) {}
    applyTheme(t);
  }

  function toggleTheme() {
    var next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    applyTheme(next);
  }

  /* ---- Nav: click-to-scroll + scroll-spy + mobile drawer -- */
  function initNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var topnav = document.getElementById('topnav');
    var toggle = document.getElementById('nav-toggle');

    function setMenu(open) {
      if (!topnav) return;
      topnav.classList.toggle('nav-open', open);
      if (toggle) {
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        var ic = toggle.querySelector('i');
        if (ic) ic.className = open ? 'fas fa-xmark' : 'fas fa-bars';
      }
    }

    if (toggle) toggle.addEventListener('click', function () {
      setMenu(!topnav.classList.contains('nav-open'));
    });
    // tap outside the open drawer closes it
    document.addEventListener('click', function (e) {
      if (topnav && topnav.classList.contains('nav-open') && !e.target.closest('.topnav')) setMenu(false);
    });
    // returning to desktop width resets the drawer
    window.addEventListener('resize', function () {
      if (window.innerWidth > 680) setMenu(false);
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () {
        var el = document.getElementById(link.dataset.target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMenu(false);   // collapse the drawer after choosing
      });
    });

    function setActive(id) {
      links.forEach(function (l) { l.classList.toggle('active', l.dataset.target === id); });
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(function (s) {
      if (s.id !== 'hero') observer.observe(s);
    });
  }

  /* ---- Scroll progress ------------------------------------ */
  function initProgress() {
    var bar = document.getElementById('progress');
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---- Scroll reveal -------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (e) { observer.observe(e); });
  }

  /* ---- Ticker --------------------------------------------- */
  function initTicker() {
    var track = document.getElementById('ticker-track');
    if (track) track.innerHTML += track.innerHTML;
  }

  /* ---- Hero rotor (typewriter) ---------------------------- */
  function initRotor() {
    var el = document.getElementById('rotor');
    if (!el) return;
    var words = ['security', 'cloud security', 'VPN networks', 'DevSecOps', 'automation'];
    if (reduceMotion) { el.textContent = words[0]; return; }
    var w = 0, c = 0, deleting = false;
    function tick() {
      var word = words[w];
      el.textContent = word.slice(0, c);
      if (!deleting && c < word.length) { c++; setTimeout(tick, 95); }
      else if (!deleting) { deleting = true; setTimeout(tick, 1600); }
      else if (c > 0) { c--; setTimeout(tick, 45); }
      else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 350); }
    }
    tick();
  }

  /* ---- Counters ------------------------------------------- */
  function initCounters() {
    var row = document.getElementById('stat-row');
    if (!row) return;
    var nums = Array.prototype.slice.call(row.querySelectorAll('[data-count]'));
    function run() {
      nums.forEach(function (n) {
        var target = parseInt(n.dataset.count, 10) || 0;
        if (reduceMotion) { n.textContent = target; return; }
        var start = performance.now(), dur = 1100;
        function step(now) {
          var p = Math.min((now - start) / dur, 1);
          n.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
    if (!('IntersectionObserver' in window)) { run(); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(); obs.disconnect(); } });
    }, { threshold: 0.5 });
    obs.observe(row);
  }

  /* ---- Terminal ------------------------------------------- */
  function initTerminal() {
    var body = document.getElementById('term-body');
    var form = document.getElementById('term-form');
    var input = document.getElementById('term-in');
    var chips = document.getElementById('term-chips');
    if (!body || !form || !input) return;

    var history = [], hIdx = -1;

    function print(html, cls) {
      var line = document.createElement('div');
      line.className = 'term-line ' + (cls || 'term-out');
      line.innerHTML = html;
      body.appendChild(line);
      body.scrollTop = body.scrollHeight;
    }
    function echo(cmd) {
      print('<span class="pmt">visitor@varun:~$</span> ' + esc(cmd), 'term-cmd');
    }
    function esc(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function row(k, v) { return '<span class="k">' + k + '</span>' + v; }
    function clk(cmd, label) { return '<span class="cmd" data-run="' + cmd + '">' + (label || cmd) + '</span>'; }
    function lev(a, b) {
      var m = a.length, n = b.length, d = [], i, j;
      for (i = 0; i <= m; i++) d[i] = [i];
      for (j = 0; j <= n; j++) d[0][j] = j;
      for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      return d[m][n];
    }
    function suggest(cmd) {
      var best = null, bd = 99;
      Object.keys(commands).forEach(function (k) { var x = lev(cmd, k); if (x < bd) { bd = x; best = k; } });
      return bd <= 2 ? best : null;
    }

    // Typewriter: queue responses and reveal them char-by-char (tags emitted whole).
    var typing = false, tq = [];
    function enqueue(html, cls) { tq.push([html, cls || 'term-out']); if (!typing) drain(); }
    function drain() {
      if (!tq.length) { typing = false; return; }
      typing = true;
      var job = tq.shift();
      typeInto(job[0], job[1], drain);
    }
    function typeInto(html, cls, done) {
      var line = document.createElement('div');
      line.className = 'term-line ' + cls;
      body.appendChild(line);
      if (reduceMotion) {
        line.innerHTML = html; body.scrollTop = body.scrollHeight; if (done) done(); return;
      }
      var i = 0, out = '', len = html.length;
      var speed = Math.max(2, Math.min(11, Math.round(640 / Math.max(len, 1))));
      (function tick() {
        if (i >= len) { line.innerHTML = html; body.scrollTop = body.scrollHeight; if (done) done(); return; }
        var ch = html.charAt(i);
        if (ch === '<') {                       // emit whole tag instantly
          var e = html.indexOf('>', i); if (e < 0) e = i;
          out += html.slice(i, e + 1); i = e + 1; line.innerHTML = out; tick(); return;
        }
        if (ch === '&') {                       // emit whole HTML entity as one char
          var s = html.indexOf(';', i);
          if (s > i && s - i <= 8) {
            out += html.slice(i, s + 1); i = s + 1; line.innerHTML = out;
            body.scrollTop = body.scrollHeight; setTimeout(tick, speed); return;
          }
        }
        out += ch; i++; line.innerHTML = out;
        body.scrollTop = body.scrollHeight; setTimeout(tick, speed);
      })();
    }

    var commands = {
      help: function () {
        return '<span class="muted">click a command or type it —</span>\n' +
          row(clk('whoami'), 'one-line intro') + '\n' +
          row(clk('about'), 'full background') + '\n' +
          row(clk('skills'), 'tools &amp; tech, by domain') + '\n' +
          row(clk('projects'), 'key projects &amp; research') + '\n' +
          row(clk('experience'), 'roles &amp; internships') + '\n' +
          row(clk('education'), 'degrees') + '\n' +
          row(clk('research'), 'papers &amp; manuscript') + '\n' +
          row(clk('certs'), 'certifications') + '\n' +
          row(clk('contact'), 'how to reach me') + '\n' +
          row(clk('resume'), 'download my résumé (PDF)') + '\n' +
          row(clk('open argos', 'argos') + ' / ' + clk('open meridian', 'meridian') + ' / ' + clk('open nvd', 'nvd'), 'open a case study') + '\n' +
          row(clk('theme'), 'switch light / dark') + '\n' +
          row(clk('enter portfolio', 'enter'), 'descend into the full portfolio ↓') + '\n' +
          row(clk('clear'), 'wipe the screen') + '\n' +
          '<span class="acc">tip:</span> ↑/↓ history · Tab autocomplete';
      },
      whoami: function () {
        return '<span class="hl">Varun Godambe</span> — Network &amp; Information Security graduate based in ' +
          'Surbiton, London. I build defensible, well-monitored systems across security, cloud and DevSecOps.';
      },
      about: function () {
        return 'MSc in Network and Information Security (Kingston University London), with a foundation in ' +
          'cybersecurity, secure infrastructure and risk assessment. My dissertation analysed how OpenVPN, ' +
          'IPSec and WireGuard trade off performance vs. security, leading to the design of an ' +
          '<span class="hl">Adaptive Protocol Selector System (APSS)</span> that picks the optimal VPN ' +
          'protocol from real-time network conditions. I\'m strong at turning technical findings into ' +
          'clear, actionable risk for the people who own it. I\'ve also written a short research ' +
          'manuscript on <span class="hl">FinCrime investigations</span> — type <span class="acc">research</span>.';
      },
      skills: function () {
        return row('cloud', 'AWS (EC2, IAM, S3), GCP') + '\n' +
          row('tooling', 'Kali, Nessus, Metasploit, Burp, Wireshark, MobSF, Nmap') + '\n' +
          row('network/vpn', 'WireGuard, OpenVPN, IPSec, IDS/IPS, firewalls') + '\n' +
          row('devsecops', 'Python, Bash, Ansible, infra hardening') + '\n' +
          row('compliance', 'ISO 27001, CVSS, vulnerability mgmt') + '\n' +
          row('languages', 'Python, Bash, Java, C, JavaScript');
      },
      projects: function () {
        return '<span class="acc">ongoing →</span> two live builds with full case-study pages:\n' +
          '<span class="acc">•</span> <span class="hl">Vulnerability Triage System</span> — NVD/KEV/EPSS/GHSA triage + threat intel + poller. ' +
          '<a href="vulnerability-triage.html">open case study</a>\n' +
          '<span class="acc">•</span> <span class="hl">Meridian</span> — 266-name global multi-factor equity screener + math-backed recommender. ' +
          '<a href="meridian.html">open case study</a>\n' +
          '\n<span class="acc">earlier →</span>\n' +
          '<span class="acc">•</span> <span class="hl">Adaptive Protocol Selector System (APSS)</span> — MSc dissertation; dynamic VPN selection across WireGuard/OpenVPN/IPSec.\n' +
          '<span class="acc">•</span> <span class="hl">Adaptive E-Learning Framework</span> — spaced-repetition system, published in Springer LNNS.';
      },
      experience: function () {
        return row('2023–2024', 'Teaching Volunteer · Kingston University') + '\n' +
          row('2021', 'Cybersecurity Intern · Cisco Networking Academy') + '\n' +
          row('2021', 'AI/ML Virtual Intern · AICTE &amp; AWS') + '\n' +
          row('2021', 'Software Intern (API) · APSIT Skills &amp; Postman');
      },
      education: function () {
        return row('2023–2024', 'MSc, Network &amp; Information Security · Kingston University, London') + '\n' +
          row('2017–2022', 'BE, Information Technology · University of Mumbai');
      },
      research: function () {
        return '<span class="acc">•</span> <span class="hl">APSS</span> — MSc dissertation: real-time VPN protocol selection (WireGuard/OpenVPN/IPSec), 20+ papers analysed.\n' +
          '<span class="acc">•</span> <span class="hl">FinCrime Investigations</span> — short research manuscript on financial-crime detection &amp; investigation. <a href="assets/FinCrime-Investigations.pdf" target="_blank" rel="noopener noreferrer">read</a>\n' +
          '<span class="acc">•</span> <span class="hl">Adaptive E-Learning Framework</span> — published in Springer LNNS.';
      },
      certs: function () {
        return 'HCIA Security · CCNA · AWS Cloud Foundations · AWS Machine Learning Foundations · ' +
          'Microsoft Security Essentials · ISO 27001 Annex A Controls · Docker Essentials';
      },
      contact: function () {
        return row('email', '<a href="mailto:godambevarun@gmail.com">godambevarun@gmail.com</a>') + '\n' +
          row('phone', '+44 07341 705968') + '\n' +
          row('location', 'Surbiton, KT6 7RQ, London, UK') + '\n' +
          row('linkedin', '<a href="https://www.linkedin.com/in/varun-godambe-85781b1a0/" target="_blank" rel="noopener noreferrer">varun-godambe</a>');
      },
      social: function () {
        return row('linkedin', '<a href="https://www.linkedin.com/in/varun-godambe-85781b1a0/" target="_blank" rel="noopener noreferrer">linkedin.com/in/varun-godambe</a>') + '\n' +
          row('site', '<a href="https://varun-godambe.github.io" target="_blank" rel="noopener noreferrer">varun-godambe.github.io</a>');
      },
      resume: function () {
        return row('résumé', '<a href="assets/Varun-Godambe-Resume.pdf" download="Varun-Godambe-Resume.pdf">download PDF ↓</a>') + '\n' +
          '<span class="muted">network &amp; information security · cloud · DevSecOps — Surbiton, London</span>';
      },
      ls: function () {
        return 'profile  skills  projects  experience  education  certs  contact';
      },
      pwd: function () { return '/home/varun/portfolio'; },
      date: function () { return new Date().toString(); },
      sudo: function () { return '<span class="err">Permission denied:</span> nice try 🙂 — but you already have all the access you need.'; },
      hello: function () { return 'Hi there! 👋 Type <span class="acc">help</span> to see what I can tell you.'; },
      enter: function () { enterPortfolio(); return null; },
      open: function (args) {
        var map = { argos: 'argos.html', meridian: 'meridian.html', stock: 'meridian.html',
          nvd: 'vulnerability-triage.html', vuln: 'vulnerability-triage.html', triage: 'vulnerability-triage.html' };
        var t = (args && args[0]) || '';
        if (map[t]) { window.location.href = map[t]; return '<span class="ok">→</span> opening ' + esc(t) + '…'; }
        return '<span class="err">usage:</span> open ' + clk('open argos', 'argos') + ' | ' +
          clk('open meridian', 'meridian') + ' | ' + clk('open nvd', 'nvd');
      },
      theme: function () { toggleTheme(); return '<span class="ok">✓</span> theme switched.'; },
      goto: function (args) {
        var map = { about: 'profile', profile: 'profile', skills: 'skills', projects: 'projects',
          experience: 'experience', education: 'education', research: 'research', contact: 'contact' };
        var id = map[(args && args[0]) || 'profile'] || 'profile';
        enterPortfolio();
        window.setTimeout(function () {
          var el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1750);
        return null;
      },
      clear: function () { tq.length = 0; typing = false; body.innerHTML = ''; return null; }
    };
    commands.hi = commands.hello;
    commands.links = commands.social;
    commands.cv = commands.resume;
    commands.start = commands.explore = commands.portfolio = commands.enter;
    commands.dark = commands.light = commands.theme;

    function run(raw) {
      var trimmed = raw.trim();
      if (!trimmed) return;
      echo(trimmed);
      history.push(trimmed); hIdx = history.length;
      var parts = trimmed.toLowerCase().split(/\s+/);
      var cmd = parts[0], args = parts.slice(1);
      if (commands[cmd]) {
        var out = commands[cmd](args);
        if (out !== null) enqueue(out);
      } else {
        var s = suggest(cmd);
        enqueue('<span class="err">command not found:</span> ' + esc(cmd) +
          (s ? ' — did you mean ' + clk(s) + '?' : ' — type ' + clk('help') + '.'));
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      run(input.value);
      input.value = '';
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (hIdx > 0) { hIdx--; input.value = history[hIdx]; }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx]; }
        else { hIdx = history.length; input.value = ''; }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        var part = input.value.trim().toLowerCase();
        if (part) {
          var match = Object.keys(commands).filter(function (k) { return k.indexOf(part) === 0; });
          if (match.length === 1) input.value = match[0];
          else if (match.length > 1) enqueue('<span class="muted">' + match.join('&nbsp;&nbsp;') + '</span>');
        }
      }
    });

    function refocus() { try { input.focus({ preventScroll: true }); } catch (err) { input.focus(); } }

    if (chips) {
      chips.addEventListener('click', function (e) {
        var btn = e.target.closest('.chip');
        if (!btn) return;
        run(btn.dataset.cmd); refocus();
      });
    }

    // Clickable commands inside terminal output.
    body.addEventListener('click', function (e) {
      var c = e.target.closest('.cmd');
      if (!c) return;
      run(c.dataset.run); refocus();
    });

    // Rotating ghost placeholder — nudges visitors that the prompt is live.
    if (!reduceMotion) {
      var hints = ['try: projects', 'try: about', 'try: research', 'try: open argos',
        'try: resume', 'try: enter portfolio'];
      var hi = 0;
      window.setInterval(function () {
        if (document.activeElement !== input && !input.value) {
          input.placeholder = hints[hi % hints.length]; hi++;
        }
      }, 2800);
    }

    // Identity banner (no greeting) types in like a terminal response.
    enqueue('<div class="term-banner"><div class="bn-name">VARUN GODAMBE</div>' +
      '<div class="bn-sub">Network &amp; Information Security · Cloud Security · DevSecOps</div>' +
      '<div class="bn-rule"></div></div>');
    enqueue('<span class="muted">type <span class="acc">help</span> for commands · ' +
      '<span class="acc">enter portfolio</span> to continue</span>');
  }

  /* ---- Splash gate ---------------------------------------- */
  function enterPortfolio() {
    var splash = document.getElementById('splash');
    if (!splash || splash.classList.contains('is-hidden')) return;
    var veil = document.getElementById('enter-veil');
    var log = document.getElementById('load-log');
    var fill = document.getElementById('load-fill');
    var pct = document.getElementById('load-pct');

    // raise the boot veil
    if (veil) veil.classList.add('show');
    if (log) log.innerHTML = '';
    if (fill) fill.style.width = '0';
    if (pct) pct.textContent = '0%';

    // swap the splash out behind the veil + unlock scroll
    window.setTimeout(function () {
      splash.classList.add('is-hidden');
      document.body.classList.remove('gated');
      window.scrollTo(0, 0);
      window.setTimeout(function () { splash.style.display = 'none'; }, 560);
    }, 460);

    // run a short boot sequence, then fade into the portfolio
    var steps = [
      ['mounting profile', 22],
      ['loading projects', 52],
      ['indexing research', 80],
      ['ready', 100]
    ];
    var i = 0, gap = reduceMotion ? 90 : 300;
    (function step() {
      if (i >= steps.length) {
        window.setTimeout(function () { if (veil) veil.classList.remove('show'); }, 360);
        return;
      }
      var s = steps[i++];
      var done = s[1] === 100;
      if (log) {
        var line = document.createElement('div');
        line.innerHTML = '<span class="ok">›</span> ' + s[0] + (done ? ' <span class="ok">✓</span>' : '…');
        log.appendChild(line);
      }
      if (fill) fill.style.width = s[1] + '%';
      if (pct) pct.textContent = s[1] + '%';
      window.setTimeout(step, gap);
    })();
  }

  function showSplash() {
    var splash = document.getElementById('splash');
    if (!splash) return;
    splash.style.display = '';
    document.body.classList.add('gated');
    window.scrollTo(0, 0);
    requestAnimationFrame(function () { splash.classList.remove('is-hidden'); });
  }

  function initSplash() {
    document.body.classList.add('gated');
    var btn = document.getElementById('enter-btn');
    if (btn) btn.addEventListener('click', enterPortfolio);

    // Brand returns you to the splash gate.
    var brand = document.querySelector('.nav-brand');
    if (brand) brand.addEventListener('click', function (e) { e.preventDefault(); showSplash(); });

    // Caret ready on desktop without yanking mobile keyboards open.
    if (window.matchMedia('(min-width: 768px)').matches) {
      var input = document.getElementById('term-in');
      if (input) { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }
    }
  }

  /* ---- Boot ----------------------------------------------- */
  function boot() {
    initTheme();
    initSplash();
    initNav();
    initProgress();
    initReveal();
    initTicker();
    initRotor();
    initCounters();
    initTerminal();

    var tt = document.getElementById('theme-toggle');
    if (tt) tt.addEventListener('click', toggleTheme);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
