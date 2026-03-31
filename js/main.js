document.addEventListener('DOMContentLoaded', function() {

  // ── Add js-reveal-ready to body ONLY after we confirm IntersectionObserver works
  // This means elements are always visible if JS fails or observer doesn't fire
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-reveal-ready');
  }

  // ── Mobile nav toggle
  var hamburger = document.querySelector('.hamburger');
  var navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = navLinks.classList.contains('open');
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      var spans = hamburger.querySelectorAll('span');
      if (!isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    document.addEventListener('click', function(e) {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        var spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  // ── Mark active nav link
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ── Scroll Reveal — only runs if body has js-reveal-ready
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' }); // threshold 0 = fires as soon as 1px visible
    revealEls.forEach(function(el) { io.observe(el); });

    // Safety net: after 1.5s, force-show anything still hidden (e.g. already in viewport on load)
    setTimeout(function() {
      revealEls.forEach(function(el) {
        if (!el.classList.contains('visible')) {
          el.classList.add('visible');
        }
      });
    }, 500);
  }

  // ── Counter animation
  var counters = document.querySelectorAll('.counter');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function(entries) {
      if (!entries[0].isIntersecting) return;
      counters.forEach(function(el) {
        var target = parseInt(el.dataset.target, 10);
        var suffix = el.dataset.suffix || '';
        var current = 0;
        var step = Math.max(1, Math.ceil(target / 60));
        var timer = setInterval(function() {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 25);
      });
      cio.disconnect();
    }, { threshold: 0 });
    cio.observe(counters[0]);
  }

  // ── Events tab switching
  var tabs = document.querySelectorAll('.events-tab');
  var eventCards = document.querySelectorAll('.event-card[data-status]');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var filter = tab.dataset.tab;
      eventCards.forEach(function(card) {
        card.style.display = (filter === 'all' || card.dataset.status === filter) ? '' : 'none';
      });
    });
  });

  // ── Product filter
  var filterBtns   = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('.product-card[data-cat]');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.dataset.cat;
      productCards.forEach(function(card) {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  // ── Contact form
  var form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var orig = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#2970b8';
      btn.style.color = '#fff';
      setTimeout(function() {
        btn.textContent = orig;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 3000);
    });
  }

  // ── Navbar shrink on scroll
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.style.height = '64px';
        nav.style.boxShadow = '0 4px 32px rgba(0,0,0,0.35)';
      } else {
        nav.style.height = '';
        nav.style.boxShadow = '';
      }
    }, { passive: true });
  }

});
