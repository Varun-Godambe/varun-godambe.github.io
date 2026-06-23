/* ============================================================
   Varun Godambe — Project detail pages
   Theme · scroll reveal · screenshot lightbox
   ============================================================ */
(function () {
  'use strict';
  var THEME_KEY = 'vg-theme';

  function applyTheme(t) { document.documentElement.dataset.theme = t; }
  try {
    applyTheme(localStorage.getItem(THEME_KEY) ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  } catch (e) { applyTheme('dark'); }

  function boot() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var tt = document.getElementById('theme-toggle');
    if (tt) tt.addEventListener('click', function () {
      var next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });

    // Scroll reveal
    var els = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (e) { e.classList.add('is-visible'); });
    } else {
      var obs = new IntersectionObserver(function (entries, o) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); o.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      Array.prototype.forEach.call(els, function (e) { obs.observe(e); });
    }

    // Lightbox
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lb-img');
    Array.prototype.forEach.call(document.querySelectorAll('.shot, .shot-lg'), function (s) {
      s.addEventListener('click', function () {
        var img = s.querySelector('img');
        if (img && lb && lbImg) { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('open'); }
      });
    });
    if (lb) lb.addEventListener('click', function () { lb.classList.remove('open'); lbImg.src = ''; });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb) { lb.classList.remove('open'); lbImg.src = ''; }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
