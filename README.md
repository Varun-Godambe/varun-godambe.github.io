# varun-godambe.github.io

Personal portfolio of **Varun Godambe** — Network & Information Security · Cloud · DevSecOps.

🔗 **Live:** [varun-godambe.github.io](https://varun-godambe.github.io)

A dark-first, "ops-terminal" portfolio: the landing page is an interactive terminal
gate — type a command (or tap a chip) to explore, then boot into the full site.
Built with plain HTML, CSS and JavaScript — no framework, no build step.

---

## 👤 About

MSc in Network and Information Security (Kingston University London), with a foundation
in cybersecurity, secure infrastructure and risk assessment. Currently building:

- **Argos** — an AI privacy & data-loss-prevention platform (flagship, launching soon)
- **Meridian** — a 266-name global multi-factor equity-research dashboard
- **Vulnerability Triage System** — a self-hosted CVE triage + threat-intelligence platform

Plus a short research manuscript on **financial-crime (FinCrime) investigations** and a
published paper (Springer LNNS). Each project has its own case-study page.

---

## ✨ Site features

- **Interactive terminal splash** — command history, Tab-completion, clickable commands,
  "did you mean…" suggestions, and a boot/loading transition into the portfolio.
- **Dark / warm-paper light theme** — a single warm accent across both modes; persisted
  to `localStorage`.
- **Fully responsive** — identity-first splash, hamburger drawer nav, and tuned typography
  on mobile; behaves like a web app (theme-color, add-to-home-screen metas).
- **Project case studies** — dedicated pages with screenshot lightboxes.
- **Accessible & fast** — keyboard focus states, `prefers-reduced-motion` support,
  social-share metadata, and a themed 404.

---

## 🗂️ Structure

```
index.html                 # portfolio + terminal splash
argos.html                 # case study — Argos
meridian.html              # case study — Meridian
vulnerability-triage.html  # case study — Vulnerability Triage System
404.html                   # themed not-found page
style.css                  # the ops-terminal design system
script.js                  # splash gate, terminal, nav, reveals
project.js                  # case-study pages (theme, reveal, lightbox)
assets/                    # favicon, photo, résumé, manuscript, screenshots
```

---

## ⚙️ Tech

- Vanilla **HTML · CSS · JavaScript** (no framework, no build step)
- Type: **JetBrains Mono** + **Fraunces** (Google Fonts), icons via Font Awesome
- Hosted on **GitHub Pages**

### Run locally

No tooling required — just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

---

## 📫 Contact

- [LinkedIn](https://www.linkedin.com/in/varun-godambe-85781b1a0/)
- [GitHub](https://github.com/varun-godambe)
- godambevarun@gmail.com · Surbiton, London, UK

---

© 2026 Varun Godambe
