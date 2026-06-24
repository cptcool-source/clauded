/* ==========================================================================
   fixedIT Tech — main.js
   Nav scroll state · Mobile drawer · Scroll reveals · Process animation · Form
   ========================================================================== */

(function () {
  'use strict';

  /* ── Nav: solidify on scroll ─────────────────────────────────────────────── */
  var nav = document.getElementById('site-nav');
  function handleNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ── Mobile drawer ───────────────────────────────────────────────────────── */
  var toggle = document.getElementById('nav-toggle');
  var drawer = document.getElementById('nav-drawer');

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  /* Close drawer when any drawer link is clicked */
  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  /* Close drawer on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });

  /* ── Smooth scroll for anchor links ─────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navH = nav ? nav.offsetHeight : 64;
      var top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── Scroll reveals (IntersectionObserver) ───────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    /* Fallback: just show everything */
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── Process: charging line + step activation ────────────────────────────── */
  var procSection = document.getElementById('process-wrap');
  var procFill    = document.getElementById('process-fill');
  var procSteps   = document.querySelectorAll('.process__step');
  var procFired   = false;

  function activateProcess() {
    if (procFired) return;
    procFired = true;

    /* Draw the line */
    if (procFill) procFill.style.width = '100%';

    /* Stagger-activate each step */
    procSteps.forEach(function (step, i) {
      setTimeout(function () {
        step.classList.add('proc-active');
      }, 280 + i * 260);
    });
  }

  if (procSection && 'IntersectionObserver' in window) {
    var procObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        activateProcess();
        procObs.disconnect();
      }
    }, { threshold: 0.35 });
    procObs.observe(procSection);
  } else if (procSection) {
    activateProcess();
  }

  /* ── Contact form — Formspree + custom UX ────────────────────────────────── */
  var form       = document.getElementById('contact-form');
  var submitBtn  = document.getElementById('submit-btn');
  var statusEl   = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Check if Formspree ID has been replaced */
      var action = form.getAttribute('action');
      if (action.indexOf('REPLACE_WITH_YOUR_FORM_ID') !== -1) {
        statusEl.textContent = 'Form not yet configured — contact temptestbspivey@gmail.com directly.';
        statusEl.className = 'form-status error';
        return;
      }

      var btnLabel = submitBtn.querySelector('.btn-label');
      if (btnLabel) btnLabel.textContent = 'Sending…';
      submitBtn.disabled = true;
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      var data = new FormData(form);

      fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            statusEl.textContent = "Message sent — Charles will be in touch within 24 hours.";
            statusEl.className = 'form-status success';
            form.reset();
            if (btnLabel) btnLabel.textContent = 'Send message';
            submitBtn.disabled = false;
          } else {
            return res.json().then(function (json) {
              throw new Error(json.errors ? json.errors.map(function (e) { return e.message; }).join(', ') : 'Submission failed.');
            });
          }
        })
        .catch(function (err) {
          statusEl.textContent = err.message || 'Something went wrong. Email directly: temptestbspivey@gmail.com';
          statusEl.className = 'form-status error';
          if (btnLabel) btnLabel.textContent = 'Send message';
          submitBtn.disabled = false;
        });
    });
  }

  /* ── Theme switcher ─────────────────────────────────────────────────────── */
  var themeButtons = document.querySelectorAll('[data-theme-btn]');
  themeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var theme = btn.getAttribute('data-theme-btn');
      document.documentElement.setAttribute('data-theme', theme);
      themeButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      /* Re-trigger hero animations on switch */
      var title = document.querySelector('.hero-title');
      var rule  = document.querySelector('.hero-rule');
      [title, rule].forEach(function (el) {
        if (!el) return;
        el.style.animation = 'none';
        el.offsetHeight; /* force reflow */
        el.style.animation = '';
      });
    });
  });

  /* ── Active nav link on scroll ───────────────────────────────────────────── */
  var sections  = document.querySelectorAll('main section[id]');
  var navLinks  = document.querySelectorAll('.nav-link');
  var navH      = nav ? nav.offsetHeight : 64;

  function updateActiveLink() {
    var scrollPos = window.scrollY + navH + 80;
    var current   = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

})();
