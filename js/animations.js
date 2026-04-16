/* ============================================================
   Jaydee Media Kit — GSAP Premium Animations
   Requires: GSAP 3 + ScrollTrigger (loaded via CDN)
   ============================================================ */
(function () {
  'use strict';
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ─── WORD SPLIT UTILITY ───────────────────────────────────
     Wraps each word in overflow:hidden + inner span so we can
     do a clip-from-bottom reveal without a paid SplitText lib.
     Preserves <br> tags and whitespace.
  ─────────────────────────────────────────────────────────── */
  function wrapWords(el) {
    var html = el.innerHTML;
    var parts = html.split(/(<br\s*\/?>|\s+)/gi);
    el.innerHTML = parts
      .map(function (p) {
        if (!p || /^(<br\s*\/?>|\s+)$/i.test(p)) return p || '';
        return (
          '<span class="jd-sw" style="display:inline-block;overflow:hidden;'
          + 'vertical-align:bottom;line-height:inherit">'
          + '<span class="jd-swi" style="display:inline-block">' + p + '</span></span>'
        );
      })
      .join('');
    return el.querySelectorAll('.jd-swi');
  }

  /* ─── SAFETY TIMER ─────────────────────────────────────────
     Restores scroll if anything throws before onComplete fires.
  ─────────────────────────────────────────────────────────── */
  var safetyTimer = setTimeout(function () {
    document.body.style.overflow = '';
  }, 4000);

  /* ─── PRELOADER: lock scroll & set initial states ──────── */
  document.body.style.overflow = 'hidden';

  gsap.set('nav', { yPercent: -100 });
  gsap.set(['.hero-tag', '.hero-name', '.hero-tagline', '.hero-badges', '.hero-cta'], {
    opacity: 0,
    y: 26
  });
  gsap.set('.hero-gym-card', { opacity: 0, y: -14 });
  gsap.set('.hero-float',    { opacity: 0, y: 12  });
  gsap.set('.hero-right',    { opacity: 0          });

  /* ─── INTRO TIMELINE ───────────────────────────────────── */
  var introTl = gsap.timeline({
    delay: 0.1,
    onComplete: function () {
      clearTimeout(safetyTimer);
      document.body.style.overflow = '';
      ScrollTrigger.refresh();
    }
  });

  introTl
    /* logo fades + lifts in */
    .to('#intro-logo', { duration: 0.5, opacity: 1, y: 0, ease: 'power3.out' })
    /* accent line scales in from left */
    .to('#intro-line', { duration: 0.65, scaleX: 1, ease: 'expo.inOut' }, '-=0.2')
    /* overlay slides up off-screen */
    .to('#intro-overlay', {
      duration: 0.85,
      yPercent: -100,
      ease: 'power4.inOut',
      delay: 0.5
    })
    /* nav drops in */
    .to('nav', { duration: 0.6, yPercent: 0, ease: 'power3.out' }, '-=0.2')
    /* hero content cascades in */
    .to('.hero-tag',     { duration: 0.48, opacity: 1, y: 0, ease: 'power3.out' }, '-=0.45')
    .to('.hero-name',    { duration: 0.65, opacity: 1, y: 0, ease: 'power3.out' }, '-=0.36')
    .to('.hero-tagline', { duration: 0.55, opacity: 1, y: 0, ease: 'power3.out' }, '-=0.46')
    .to('.hero-badges',  { duration: 0.48, opacity: 1, y: 0, ease: 'power3.out' }, '-=0.38')
    .to('.hero-cta',     { duration: 0.46, opacity: 1, y: 0, ease: 'power3.out' }, '-=0.34')
    /* photo panel fades in */
    .to('.hero-right',   { duration: 0.9,  opacity: 1,        ease: 'power2.out' }, '-=0.55')
    /* floating elements appear last */
    .to('.hero-gym-card',{ duration: 0.45, opacity: 1, y: 0, ease: 'power3.out' }, '-=0.38')
    .to('.hero-float',   { duration: 0.4,  opacity: 1, y: 0, ease: 'power3.out' }, '-=0.3' );

  /* ─── SCROLL PROGRESS BAR ──────────────────────────────── */
  var progressBar = document.createElement('div');
  progressBar.style.cssText =
    'position:fixed;top:0;left:0;height:2px;width:0;'
    + 'background:var(--accent);z-index:99999;pointer-events:none;'
    + 'transform-origin:left center;';
  document.body.appendChild(progressBar);

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: function (self) {
      gsap.set(progressBar, { width: (self.progress * 100) + '%' });
    }
  });

  /* ─── NAV: hide on scroll-down, reveal on scroll-up ────── */
  var navHidden = false;
  ScrollTrigger.create({
    start: 220,
    onUpdate: function (self) {
      if (self.direction === 1 && !navHidden) {
        gsap.to('nav', { yPercent: -100, duration: 0.28, ease: 'power3.in',  overwrite: 'auto' });
        navHidden = true;
      } else if (self.direction === -1 && navHidden) {
        gsap.to('nav', { yPercent: 0,    duration: 0.42, ease: 'power3.out', overwrite: 'auto' });
        navHidden = false;
      }
    }
  });

  /* ─── SECTION LABELS ───────────────────────────────────── */
  gsap.utils.toArray('.section-label').forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      opacity: 0, x: -16, duration: 0.6, ease: 'power3.out'
    });
  });

  /* ─── SECTION TITLES — word-by-word clip reveal ─────────── */
  gsap.utils.toArray('.section-title').forEach(function (el) {
    var words = wrapWords(el);
    gsap.from(words, {
      scrollTrigger: { trigger: el, start: 'top 87%', once: true },
      y: '105%', opacity: 0, duration: 0.62, stagger: 0.07, ease: 'power4.out'
    });
  });

  /* ─── ABOUT ─────────────────────────────────────────────── */
  gsap.from('.about-text p', {
    scrollTrigger: { trigger: '.about-text', start: 'top 84%', once: true },
    opacity: 0, y: 20, duration: 0.7, stagger: 0.13, ease: 'power3.out'
  });

  gsap.from('.pill', {
    scrollTrigger: { trigger: '.about-pills', start: 'top 90%', once: true },
    opacity: 0, y: 12, scale: 0.87, duration: 0.42, stagger: 0.05, ease: 'back.out(1.5)'
  });

  gsap.from('.aside-card', {
    scrollTrigger: { trigger: '.aside-card', start: 'top 84%', once: true },
    opacity: 0, y: 22, duration: 0.65, ease: 'power3.out'
  });

  gsap.from('.aside-row', {
    scrollTrigger: { trigger: '.aside-card', start: 'top 82%', once: true },
    opacity: 0, x: 18, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.2
  });

  /* ─── STATS ─────────────────────────────────────────────── */
  gsap.from('.stat-box', {
    scrollTrigger: { trigger: '.stats-grid', start: 'top 82%', once: true },
    opacity: 0, y: 34, duration: 0.65, stagger: 0.1, ease: 'power3.out'
  });

  /* Animated number counters */
  gsap.utils.toArray('.stat-num').forEach(function (el) {
    var spanEl  = el.querySelector('span');
    var suffix  = spanEl ? spanEl.textContent : '';
    var raw     = el.textContent.replace(suffix, '').trim();
    var target  = parseFloat(raw);
    if (isNaN(target)) return;
    var isFloat = raw.indexOf('.') !== -1;
    var proxy   = { n: 0 };
    gsap.to(proxy, {
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      n: target, duration: 1.6, ease: 'power2.out',
      onUpdate: function () {
        var v = isFloat ? proxy.n.toFixed(1) : Math.round(proxy.n);
        el.innerHTML = v + (suffix ? '<span>' + suffix + '</span>' : '');
      }
    });
  });

  /* ─── VIRAL VIDEOS ──────────────────────────────────────── */
  gsap.from('.video-card', {
    scrollTrigger: { trigger: '.videos-grid', start: 'top 82%', once: true },
    opacity: 0, y: 44, scale: 0.93, duration: 0.72, stagger: 0.12, ease: 'power3.out'
  });

  /* ─── AUDIENCE GEO BARS ─────────────────────────────────── */
  gsap.utils.toArray('.geo-bar').forEach(function (bar) {
    var w = bar.style.width;
    gsap.fromTo(bar, { width: '0%' }, {
      scrollTrigger: { trigger: bar, start: 'top 90%', once: true },
      width: w, duration: 1.1, ease: 'power3.out'
    });
  });

  /* ─── AUDIENCE AGE BARS ─────────────────────────────────── */
  gsap.utils.toArray('.age-bar').forEach(function (bar) {
    var w = bar.style.width;
    gsap.fromTo(bar, { width: '0%' }, {
      scrollTrigger: { trigger: bar, start: 'top 92%', once: true },
      width: w, duration: 0.9, ease: 'power3.out'
    });
  });

  /* ─── GENDER CIRCLES ────────────────────────────────────── */
  gsap.from('.gender-circle', {
    scrollTrigger: { trigger: '.gender-row', start: 'top 88%', once: true },
    scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(2)'
  });

  /* ─── INTEREST TAGS ─────────────────────────────────────── */
  gsap.from('.i-tag', {
    scrollTrigger: { trigger: '.interests-tags', start: 'top 90%', once: true },
    opacity: 0, scale: 0.82, y: 8, duration: 0.36, stagger: 0.04, ease: 'back.out(1.8)'
  });

  /* ─── COLLAB CARDS ──────────────────────────────────────── */
  gsap.from('.collab-card', {
    scrollTrigger: { trigger: '.collab-grid', start: 'top 82%', once: true },
    opacity: 0, y: 32, duration: 0.62, stagger: 0.1, ease: 'power3.out'
  });

  gsap.from('.collab-note', {
    scrollTrigger: { trigger: '.collab-note', start: 'top 90%', once: true },
    opacity: 0, x: -22, duration: 0.62, ease: 'power3.out'
  });

  /* ─── CONTACT ───────────────────────────────────────────── */
  gsap.from('.contact-sub', {
    scrollTrigger: { trigger: '.contact-sub', start: 'top 90%', once: true },
    opacity: 0, y: 16, duration: 0.55, ease: 'power3.out'
  });

  gsap.from('.contact-btn', {
    scrollTrigger: { trigger: '.contact-buttons', start: 'top 90%', once: true },
    opacity: 0, y: 20, duration: 0.52, stagger: 0.09, ease: 'power3.out'
  });

  /* ─── PARALLAX: hero left content drifts slower on scroll ─ */
  gsap.to('.hero-left', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2
    },
    y: -32,
    ease: 'none'
  });

  /* ─── HOVER: magnetic effect on CTA buttons ─────────────── */
  function addMagnetic(selector, strength) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width  / 2) * strength;
        var y = (e.clientY - r.top  - r.height / 2) * strength;
        gsap.to(el, { x: x, y: y, duration: 0.32, ease: 'power2.out', overwrite: 'auto' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
      });
    });
  }

  addMagnetic('.nav-cta',    0.28);
  addMagnetic('.hero-cta',   0.26);
  addMagnetic('.contact-btn', 0.18);

})();
