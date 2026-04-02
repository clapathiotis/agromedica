document.addEventListener('DOMContentLoaded', function() {

  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-reveal-ready');
  }

  // ── HAMBURGER
  // The intermittent failure in DevTools mobile emulation was caused by
  // Chrome firing both a touchstart AND a synthetic click on one tap.
  // The document click handler was closing the menu immediately after
  // the hamburger opened it — on the same event. Fixed with a 60ms guard.
  var hamburger    = document.querySelector('.hamburger');
  var navLinks     = document.querySelector('.nav-links');
  var lastToggleAt = 0;

  function closeMenu() {
    if (!navLinks || !navLinks.classList.contains('open')) return;
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    var spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('active');
    var spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      lastToggleAt = Date.now();
      navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.addEventListener('click', function(e) {
      if (Date.now() - lastToggleAt < 60) return;
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
    });

    document.addEventListener('touchstart', function(e) {
      if (Date.now() - lastToggleAt < 60) return;
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) closeMenu();
    }, { passive: true });

    navLinks.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() { closeMenu(); });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ── Active nav link
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  // ── Scroll Reveal
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0 });
    revealEls.forEach(function(el) { io.observe(el); });
    setTimeout(function() {
      revealEls.forEach(function(el) {
        if (!el.classList.contains('visible')) el.classList.add('visible');
      });
    }, 600);
  }

  // // ── Counters
  // var counters = document.querySelectorAll('.counter');
  // if (counters.length && 'IntersectionObserver' in window) {
  //   var cio = new IntersectionObserver(function(entries) {
  //     if (!entries[0].isIntersecting) return;
  //     counters.forEach(function(el) {
  //       var target = parseInt(el.dataset.target, 10);
  //       var suffix = el.dataset.suffix || '';
  //       var current = 0;
  //       var step = Math.max(1, Math.ceil(target / 60));
  //       var timer = setInterval(function() {
  //         current = Math.min(current + step, target);
  //         el.textContent = current + suffix;
  //         if (current >= target) clearInterval(timer);
  //       }, 150);
  //     });
  //     cio.disconnect();
  //   }, { threshold: 0 });
  //   cio.observe(counters[0]);
  // }

  // ── Counters (ease-out animation)
// ── Counters (ease-out animation)
var counters = document.querySelectorAll('.counter');

if (counters.length && 'IntersectionObserver' in window) {
  var cio = new IntersectionObserver(function(entries) {
    if (!entries[0].isIntersecting) return;

    counters.forEach(function(el) {
      var target = parseInt(el.dataset.target, 10);
      var suffix = el.dataset.suffix || '';
      var duration = 4000; // total animation time (ms)
      var startTime = null;

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 1.5);
      }

      function animateCounter(timestamp) {
        if (!startTime) startTime = timestamp;

        var progress = Math.min((timestamp - startTime) / duration, 1);
        var easedProgress = easeOutCubic(progress);

        // Use Math.round for smoother increments
        var value = Math.round(easedProgress * target);
        el.textContent = value.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(animateCounter);
        } else {
          el.textContent = target.toLocaleString() + suffix; // ensure exact final value
        }
      }

      requestAnimationFrame(animateCounter);
    });

    cio.disconnect();
  }, { threshold: 0.2 });

  cio.observe(counters[0]);
}

  // ── Events tabs
  document.querySelectorAll('.events-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.events-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var filter = tab.dataset.tab;
      document.querySelectorAll('.event-card[data-status]').forEach(function(card) {
        card.style.display = (filter === 'all' || card.dataset.status === filter) ? '' : 'none';
      });
    });
  });

  // ── Product filter
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.dataset.cat;
      document.querySelectorAll('.product-card[data-cat]').forEach(function(card) {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  // ── Navbar shrink on scroll
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.style.height    = window.scrollY > 50 ? '64px' : '';
      nav.style.boxShadow = window.scrollY > 50 ? '0 4px 32px rgba(0,0,0,0.35)' : '';
    }, { passive: true });
  }

});
