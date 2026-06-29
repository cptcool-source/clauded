/* ==========================================================================
   chuck design — main.js
   Nav · Mobile drawer · Scroll reveals · Process animation · Form · Cursor · Parallax
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

  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

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
    if (procFill) procFill.style.width = '100%';
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

  function validateField(field) {
    var group  = field.closest('.form-group');
    var errEl  = group ? group.querySelector('.field-error') : null;
    var msg    = '';
    if (field.required && !field.value.trim()) {
      msg = 'This field is required.';
    } else if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      msg = 'Enter a valid email address.';
    }
    if (group) group.classList.toggle('has-error', !!msg);
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  if (form) {
    form.querySelectorAll('[required], [type="email"]').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.closest('.form-group').classList.contains('has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required], [type="email"]').forEach(function (field) {
        if (!validateField(field)) valid = false;
      });
      if (!valid) { statusEl.textContent = ''; statusEl.className = 'form-status'; return; }

      var action = form.getAttribute('action');
      if (action.indexOf('REPLACE_WITH_YOUR_FORM_ID') !== -1) {
        statusEl.textContent = 'Form not yet configured — contact charles@chuckdesign.com directly.';
        statusEl.className = 'form-status error';
        return;
      }
      var btnLabel = submitBtn.querySelector('.btn-label');
      if (btnLabel) btnLabel.textContent = 'Sending…';
      submitBtn.disabled = true;
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            statusEl.textContent = 'Message sent — Charles will be in touch within 24 hours.';
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
          statusEl.textContent = err.message || 'Something went wrong. Email directly: charles@chuckdesign.com';
          statusEl.className = 'form-status error';
          if (btnLabel) btnLabel.textContent = 'Send message';
          submitBtn.disabled = false;
        });
    });
  }

  /* ── Theme: URL param override for client demos (?theme=b or ?theme=c) ───── */
  var urlTheme = new URLSearchParams(window.location.search).get('theme');
  if (urlTheme && ['a', 'b', 'c'].indexOf(urlTheme) !== -1) {
    document.documentElement.setAttribute('data-theme', urlTheme);
  }

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

  /* ── Lightbox ───────────────────────────────────────────────────────────── */
  var lightbox         = document.getElementById('lightbox');
  var lightboxImg      = document.getElementById('lightbox-img');
  var lightboxClose    = document.getElementById('lightbox-close');
  var lightboxBackdrop = document.getElementById('lightbox-backdrop');
  var lbScale = 1;
  var lbMin   = 1;
  var lbMax   = 4;

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lbScale = 1;
    lightboxImg.style.transform = 'scale(1)';
    lightboxImg.style.cursor = 'zoom-in';
    lightbox.removeAttribute('inert');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('inert', '');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lightbox-src]').forEach(function (card) {
    card.addEventListener('click', function () {
      openLightbox(card.dataset.lightboxSrc, card.dataset.lightboxAlt || '');
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card.dataset.lightboxSrc, card.dataset.lightboxAlt || '');
      }
    });
  });

  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxClose.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  lightbox.addEventListener('wheel', function (e) {
    if (!lightbox.classList.contains('open')) return;
    e.preventDefault();
    lbScale = Math.min(lbMax, Math.max(lbMin, lbScale + (e.deltaY < 0 ? 0.2 : -0.2)));
    lightboxImg.style.transform = 'scale(' + lbScale + ')';
    lightboxImg.style.cursor = lbScale > 1 ? 'zoom-out' : 'zoom-in';
  }, { passive: false });

  lightboxImg.addEventListener('click', function (e) {
    e.stopPropagation();
    lbScale = lbScale > 1 ? 1 : 2.5;
    lightboxImg.style.transform = 'scale(' + lbScale + ')';
    lightboxImg.style.cursor = lbScale > 1 ? 'zoom-out' : 'zoom-in';
  });

  /* ── Hero parallax ───────────────────────────────────────────────────────── */
  var heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    function handleParallax() {
      var scrollY = window.scrollY;
      if (scrollY > window.innerHeight) return;
      heroPhoto.style.transform = 'translateY(' + (scrollY * 0.28) + 'px)';
    }
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  /* ── Portfolio rail: drag to scroll ─────────────────────────────────────── */
  var rail = document.getElementById('portfolio-rail');
  if (rail) {
    var isDown   = false;
    var startX   = 0;
    var scrollLeft = 0;

    rail.addEventListener('mousedown', function (e) {
      isDown = true;
      rail.classList.add('dragging');
      startX     = e.pageX - rail.offsetLeft;
      scrollLeft = rail.scrollLeft;
    });
    rail.addEventListener('mouseleave', function () {
      isDown = false;
      rail.classList.remove('dragging');
    });
    rail.addEventListener('mouseup', function () {
      isDown = false;
      rail.classList.remove('dragging');
    });
    rail.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x    = e.pageX - rail.offsetLeft;
      var walk = (x - startX) * 1.5;
      rail.scrollLeft = scrollLeft - walk;
    });
  }

  /* ── Service card: 3D mouse-tilt micro-interaction ──────────────────────── */
  var tiltCards = document.querySelectorAll('.svc-card');
  if (tiltCards.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tiltCards.forEach(function (card) {
      card.style.willChange = 'transform';
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width - 0.5) * 8;
        var y = ((e.clientY - r.top) / r.height - 0.5) * 8;
        card.style.transform = 'perspective(900px) translateY(-4px) rotateX(' + (-y) + 'deg) rotateY(' + x + 'deg)';
        card.style.transition = 'transform 0.06s ease-out, box-shadow 0.3s, border-color 0.28s';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = '';
      });
    });
  }

})();
