/* Irish Guru — main.js */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     THEME
  ───────────────────────────────────────────────────────────── */
  function initTheme() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('irishguru-theme', theme);
      toggle.setAttribute('aria-label', theme === 'dark'
        ? 'Switch to light mode'
        : 'Switch to dark mode');
    }

    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ─────────────────────────────────────────────────────────────
     HEADER SCROLL EFFECTS
  ───────────────────────────────────────────────────────────── */
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────────────────────────
     MOBILE NAV
  ───────────────────────────────────────────────────────────── */
  function initMobileNav() {
    const toggle = document.querySelector('.menu-toggle');
    const nav    = document.querySelector('.mobile-nav');
    if (!toggle || !nav) return;

    function open() {
      nav.classList.add('is-open');
      nav.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      nav.classList.remove('is-open');
      nav.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      nav.classList.contains('is-open') ? close() : open();
    });

    nav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
      link.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ─────────────────────────────────────────────────────────────
     ACTIVE NAV
  ───────────────────────────────────────────────────────────── */
  function initActiveNav() {
    var path = window.location.pathname;
    var map = {
      home:         ['/', '/index.html'],
      about:        ['/about/', '/about/index.html'],
      services:     ['/services/', '/services/index.html'],
      industries:   ['/industries/', '/industries/index.html'],
      'case-studies':['/case-studies/', '/case-studies/index.html'],
      contact:      ['/contact/', '/contact/index.html'],
    };
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      var key = el.getAttribute('data-nav');
      if (map[key] && map[key].some(function (p) { return path === p || path.endsWith(p); })) {
        el.classList.add('is-active');
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────────────────────────── */
  function initReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { obs.observe(el); });
  }

  /* ─────────────────────────────────────────────────────────────
     ANIMATED COUNTERS
  ───────────────────────────────────────────────────────────── */
  function initCounters() {
    var els = document.querySelectorAll('[data-counter]');
    if (!els.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);

        var target   = parseFloat(el.getAttribute('data-counter') || 0);
        var suffix   = el.getAttribute('data-counter-suffix') || '';
        var decimals = el.hasAttribute('data-counter-decimals')
          ? parseInt(el.getAttribute('data-counter-decimals'), 10)
          : 0;
        var duration = 1200;
        var start    = null;

        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased    = 1 - Math.pow(1 - progress, 3);
          var current  = target * eased;
          el.textContent = current.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target.toFixed(decimals) + suffix;
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });

    els.forEach(function (el) { obs.observe(el); });
  }

  /* ─────────────────────────────────────────────────────────────
     FAQ ACCORDION
  ───────────────────────────────────────────────────────────── */
  function initFAQ() {
    document.querySelectorAll('.faq-item__trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item     = trigger.closest('.faq-item');
        var isOpen   = item.classList.contains('is-open');
        var allItems = document.querySelectorAll('.faq-item');

        allItems.forEach(function (i) {
          i.classList.remove('is-open');
          i.querySelector('.faq-item__trigger').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     CONTACT FORM VALIDATION
  ───────────────────────────────────────────────────────────── */
  function initForm() {
    var form    = document.querySelector('.contact-form');
    var success = document.querySelector('.form__success');
    if (!form) return;

    function validate(input) {
      var group = input.closest('.form__group');
      if (!group) return true;
      var required = input.hasAttribute('required');
      var type     = input.getAttribute('type');
      var val      = input.value.trim();
      var valid    = true;

      if (required && !val) valid = false;
      else if (type === 'email' && val && !/\S+@\S+\.\S+/.test(val)) valid = false;

      group.classList.toggle('has-error', !valid);
      return valid;
    }

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('blur', function () { validate(el); });
      el.addEventListener('input', function () {
        var group = el.closest('.form__group');
        if (group && group.classList.contains('has-error')) validate(el);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      form.querySelectorAll('[required]').forEach(function (el) {
        if (!validate(el)) allValid = false;
      });
      if (!allValid) return;
      form.classList.add('is-submitted');
      if (success) {
        success.classList.add('is-visible');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────────── */
  function init() {
    initTheme();
    initHeader();
    initMobileNav();
    initActiveNav();
    initReveal();
    initCounters();
    initFAQ();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
