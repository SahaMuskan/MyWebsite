/* Muskan Saha — site interactions: theme, nav, scroll-spy, reveal, counters, form */
(function () {
  'use strict';
  var de = document.documentElement;

  // Enable transitions after first paint (data-preload suppressed them)
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { de.removeAttribute('data-preload'); });
  });

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var setLabel = function () {
      var dark = de.classList.contains('dark');
      toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    };
    setLabel();
    toggle.addEventListener('click', function () {
      var dark = de.classList.toggle('dark');
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
      setLabel();
    });
  }

  // Mobile nav
  var burger = document.getElementById('nav-toggle');
  var menu = document.getElementById('mobile-menu');
  if (burger && menu) {
    var closeMenu = function () {
      menu.classList.remove('open');
      menu.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
    };
    var openMenu = function () {
      menu.hidden = false;
      menu.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
    };
    burger.addEventListener('click', function () {
      if (menu.classList.contains('open')) closeMenu(); else openMenu();
    });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); burger.focus(); } });
  }

  // Header shadow/border on scroll
  var header = document.getElementById('site-header');
  var onScroll = function () { if (header) header.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll (+ guaranteed fallback so content never stays hidden)
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var showAll = function () { reveals.forEach(function (el) { el.classList.add('in'); }); };
  if (reduced || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
    window.addEventListener('load', function () { setTimeout(showAll, 1400); });
  }

  // Timeline draw-in
  var timeline = document.querySelector('.timeline');
  if (timeline) {
    if (reduced || !('IntersectionObserver' in window)) {
      timeline.classList.add('drawn');
    } else {
      var to = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) { if (en.isIntersecting) { timeline.classList.add('drawn'); obs.disconnect(); } });
      }, { threshold: 0.2 });
      to.observe(timeline);
    }
  }

  // Count-up for stats with data-count
  var counters = document.querySelectorAll('.stat-num[data-count]');
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduced) { el.textContent = target + suffix; return; }
    var start = null, dur = 600;
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * p) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var co = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); obs.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  // Scroll-spy: mark active nav link
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-desktop a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.getAttribute('id');
          navLinks.forEach(function (a) {
            var on = a.getAttribute('href') === '#' + id;
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Contact form (Web3Forms AJAX). Requires a real access_key — see README.
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = form.querySelector('[name="access_key"]');
      if (!key || key.value === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        status.className = 'form-status err';
        status.textContent = 'The contact form is not configured yet. Please reach out via LinkedIn in the meantime.';
        status.focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';
      status.className = 'form-status'; status.textContent = '';
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.success) {
            status.className = 'form-status ok';
            status.textContent = 'Thank you — your message has been sent. I’ll get back to you.';
            form.reset();
          } else { throw new Error(data.message || 'Failed'); }
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Something went wrong. Please try again, or reach out via LinkedIn.';
        })
        .finally(function () { btn.disabled = false; btn.textContent = label; status.focus(); });
    });
  }
})();
