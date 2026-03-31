// ── Mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── Mark active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) a.classList.add('active');
});

// ── Scroll Reveal (IntersectionObserver)
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

// ── Counter animation
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    counters.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
    });
    io.disconnect();
  }, { threshold: 0.5 });
  io.observe(counters[0]);
}

// ── Events tab switching
function initEventTabs() {
  const tabs = document.querySelectorAll('.events-tab');
  const cards = document.querySelectorAll('.event-card[data-status]');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.tab;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.status === filter;
        card.style.display = show ? '' : 'none';
        if (show) { card.style.animation = 'fadeUp .4s ease both'; }
      });
    });
  });
}

// ── Product filter
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-cat]');
  if (!filterBtns.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      productCards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        if (show) card.style.animation = 'fadeUp .35s ease both';
      });
    });
  });
}

// ── Contact form
function initForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const orig = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = '#4a8c5c';
    btn.style.color = '#fff';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; form.reset(); }, 3000);
  });
}

// ── Navbar shrink on scroll
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.height = '64px';
      nav.style.boxShadow = '0 4px 32px rgba(0,0,0,0.3)';
    } else {
      nav.style.height = '';
      nav.style.boxShadow = '';
    }
  }, { passive: true });
}

// ── Run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initEventTabs();
  initProductFilter();
  initForm();
  initNavScroll();

  // activate hero grid
  const grid = document.querySelector('.hero-grid');
  if (grid) setTimeout(() => grid.classList.add('visible'), 800);
});
