/* ═══════════════════════════════════════════════
   app.js — Portfolio Logic
   Author: Njomuweh Milton Amadou
═══════════════════════════════════════════════ */

/* ─── THEME TOGGLE ─────────────────────────── */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// Load saved preference (default: dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});


/* ─── MOBILE HAMBURGER ─────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('is-open');
  const isOpen = mobileMenu.classList.contains('is-open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
});


/* ─── NAV SCROLL SHADOW ────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 10
    ? '0 2px 24px rgba(0,0,0,0.3)'
    : 'none';
}, { passive: true });


/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ──────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});


/* ─── INTERSECTION OBSERVER (reveal on scroll) */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within the same parent
      entry.target.style.transitionDelay = `${i * 0.05}s`;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─── PROJECT FILTER ───────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      const matches = filter === 'all' || category === filter;

      if (matches) {
        card.classList.remove('project-card--hidden');
        // Reset animation
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.classList.add('project-card--hidden');
      }
    });
  });
});


/* ─── VIDEO MODAL ──────────────────────────── */

/**
 * Map of project IDs to their demo video sources.
 * Drop your .mp4 files into an "assets/" folder and update the paths below.
 */
const videoSources = {
    'my-universal': 'assets/my-universal.mp4',
    'instagram-clone': 'assets/instagram-clone.mp4',
    'movie-app': 'assets/movie-app.mp4',
    'currency-converter': 'assets/currency-converter-demo.mp4'
};

const videoTitles = {
  'my-universal':       'My Universal — Demo',
  'instagram-clone':    'Instagram Clone — Demo',
  'movie-app':          'Movie Application — Demo',
  'currency-converter': 'Currency Converter — Demo',
};

const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');

window.openVideoModal = function (projectId) {
  const src = videoSources[projectId] || '';
  const title = videoTitles[projectId] || 'Project Demo';

  modalTitle.textContent = title;

  // Update video source
  const source = modalVideo.querySelector('source');
  if (source) source.setAttribute('src', src);
  modalVideo.load();

  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

window.closeVideoModal = function () {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  modalVideo.pause();
};

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeVideoModal();
});


/* ─── STAGGER REVEAL GROUPS ────────────────── */
// Apply incremental delay to sibling .reveal elements inside grids
document.querySelectorAll('.stack__grid, .vision__grid, .projects__grid, .about__stats').forEach(parent => {
  parent.querySelectorAll('.reveal').forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.08}s`;
  });
});


/* ─── ACTIVE NAV LINK ON SCROLL ────────────── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav__links .nav__link:not(.nav__link--cta)');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--accent-teal)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeSectionObserver.observe(s));


/* ─── PHONE MOCKUP PARALLAX ────────────────── */
const phoneMockup = document.querySelector('.hero__phone-mockup');
if (phoneMockup && window.innerWidth > 768) {
  window.addEventListener('mousemove', e => {
    const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
    const phone = phoneMockup.querySelector('.phone');
    if (phone) {
      phone.style.transform = `perspective(800px) rotateY(${-6 + xRatio * 4}deg) rotateX(${yRatio * -2}deg)`;
    }
  }, { passive: true });
}
