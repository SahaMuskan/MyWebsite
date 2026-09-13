/* Muskan Saha — interactions: theme, nav, scroll-spy, header, contact form */
(function () {
  'use strict';
  var de = document.documentElement;
  requestAnimationFrame(function () { requestAnimationFrame(function () { de.removeAttribute('data-preload'); }); });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var setLabel = function () { toggle.setAttribute('aria-label', de.classList.contains('dark') ? 'Switch to light theme' : 'Switch to dark theme'); };
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
    var close = function () { menu.classList.remove('open'); menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); };
    var open = function () { menu.hidden = false; menu.classList.add('open'); burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu'); };
    burger.addEventListener('click', function () { menu.classList.contains('open') ? close() : open(); });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { close(); burger.focus(); } });
  }

  // Header border on scroll
  var hdr = document.getElementById('hdr');
  var onScroll = function () { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Scroll-spy
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.getAttribute('id');
          links.forEach(function (a) {
            var on = a.getAttribute('href') === '#' + id;
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // "Enquire about this tool" buttons preselect the matching reason
  var reason = document.getElementById('cf-reason');
  Array.prototype.forEach.call(document.querySelectorAll('[data-tool]'), function (btn) {
    btn.addEventListener('click', function () {
      if (!reason) return;
      var want = btn.getAttribute('data-tool');
      Array.prototype.forEach.call(reason.options, function (o) {
        if (o.text.trim() === want.trim()) { reason.value = o.value || o.text; o.selected = true; }
      });
      // let the anchor scroll first, then put the cursor in the message box
      setTimeout(function () {
        var msg = document.getElementById('cf-msg');
        if (msg) msg.focus({ preventScroll: true });
      }, 700);
    });
  });

  // Contact form (Web3Forms) — needs a real access_key; see README
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = form.querySelector('[name="access_key"]');
      if (!key || key.value === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        status.className = 'fstatus err';
        status.textContent = 'The form isn’t connected yet — please reach out via LinkedIn for now.';
        status.focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';
      status.className = 'fstatus'; status.textContent = '';
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) { status.className = 'fstatus ok'; status.textContent = 'Thank you — your message is on its way. I’ll be in touch.'; form.reset(); }
          else { throw new Error(d.message || 'Failed'); }
        })
        .catch(function () { status.className = 'fstatus err'; status.textContent = 'Something went wrong — please try again, or reach me on LinkedIn.'; })
        .finally(function () { btn.disabled = false; btn.textContent = label; status.focus(); });
    });
  }
})();
