/* Gold Star Pediatrics — script.js */

// ─── Nav scroll shadow
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });
}

// ─── Mobile menu
const toggle     = document.getElementById('nav-toggle');
const closeBtn   = document.getElementById('mobile-close');
const mobileMenu = document.getElementById('mobile-menu');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  toggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

toggle?.addEventListener('click', openMenu);
closeBtn?.addEventListener('click', closeMenu);

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) closeMenu();
});

// ─── Scroll reveal with stagger
const revealEls = document.querySelectorAll('[data-reveal]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const parent   = entry.target.parentElement;
    const siblings = [...parent.querySelectorAll('[data-reveal]')];
    const idx      = siblings.indexOf(entry.target);

    entry.target.style.transitionDelay = `${idx * 90}ms`;
    entry.target.classList.add('revealed');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

revealEls.forEach(el => observer.observe(el));
