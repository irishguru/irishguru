/**
 * Irish Guru — Main JavaScript (Refined)
 */

(function () {
  'use strict';

  const THEME_KEY = 'irishguru-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateThemeToggleLabel(theme) {
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeToggleLabel(theme);
  }

  function initTheme() {
    setTheme(getPreferredTheme());

    document.querySelectorAll('.theme-toggle').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          header.classList.toggle('is-scrolled', window.scrollY > 4);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileNav() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.mobile-nav');
    if (!toggle || !nav) return;

    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      nav.classList.remove('is-open');
      nav.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
    };

    const open = () => {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      nav.classList.add('is-open');
      nav.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });

    nav.querySelectorAll('.mobile-nav__link, .mobile-nav__cta a').forEach((link) => {
      link.addEventListener('click', close);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });

    window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
      if (e.matches) close();
    });

    close();
  }

  function initActiveNav() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const last = parts.length ? parts[parts.length - 1] : '';
    const pageMap = {
      'about': 'about',
      'services': 'services',
      'industries': 'industries',
      'case-studies': 'case-studies',
      'contact': 'contact',
      'index.html': 'home'
    };

    let currentPage = 'home';
    if (last && pageMap[last]) {
      currentPage = pageMap[last];
    } else if (last === 'irishguru' || last === '') {
      currentPage = 'home';
    } else if (parts.length >= 2) {
      const segment = parts[parts.length - 1];
      if (pageMap[segment]) currentPage = pageMap[segment];
    }

    document.querySelectorAll('[data-nav]').forEach((link) => {
      if (link.getAttribute('data-nav') === currentPage) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const trigger = item.querySelector('.faq-item__trigger');
      if (!trigger) return;

      const toggle = () => {
        const isOpen = item.classList.contains('is-open');

        item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      };

      trigger.addEventListener('click', toggle);

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  function initForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const success = form.querySelector('.form__success');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      let firstInvalid = null;

      form.querySelectorAll('[required]').forEach((field) => {
        const group = field.closest('.form__group');
        let isValid = field.value.trim().length > 0;

        if (field.type === 'email') {
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }

        if (!isValid) {
          valid = false;
          group?.classList.add('has-error');
          field.classList.add('is-error');
          field.setAttribute('aria-invalid', 'true');
          if (!firstInvalid) firstInvalid = field;
        } else {
          group?.classList.remove('has-error');
          field.classList.remove('is-error');
          field.removeAttribute('aria-invalid');
        }
      });

      if (valid) {
        form.classList.add('is-submitted');
        success?.classList.add('is-visible');
        success?.setAttribute('tabindex', '-1');
        success?.focus();
      } else {
        firstInvalid?.focus();
      }
    });

    form.querySelectorAll('.form__input, .form__select, .form__textarea').forEach((field) => {
      field.addEventListener('input', () => {
        const group = field.closest('.form__group');
        group?.classList.remove('has-error');
        field.classList.remove('is-error');
        field.removeAttribute('aria-invalid');
      });
    });
  }

  function initReveal() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('.reveal');

    if (reducedMotion) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function animateCounter(el, target, suffix, decimals, duration) {
    const start = performance.now();
    const from = 0;

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = from + (target - from) * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  function initCounters() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.dataset.counted) return;
          el.dataset.counted = 'true';

          const target = parseFloat(el.getAttribute('data-counter'));
          const suffix = el.getAttribute('data-counter-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
          animateCounter(el, target, suffix, decimals, 1400);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function initHeroStage() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scene = document.getElementById('hero-scene');
    if (!scene) return;

    const core = scene.querySelector('.visual-theater__core, .platform-scene__core');
    const chips = scene.querySelectorAll('.platform-chip');
    const glow = scene.querySelector('.visual-theater__glow');
    let raf = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e) => {
      const rect = scene.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      if (!raf) raf = requestAnimationFrame(update);
    };

    const update = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      raf = null;

      const shiftX = currentX * 6;
      const shiftY = currentY * 4;

      if (core) {
        if (Math.abs(shiftX) < 0.5 && Math.abs(shiftY) < 0.5) {
          core.style.transform = '';
        } else {
          core.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
        }
      }

      if (glow) {
        if (Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
          glow.style.transform = '';
        } else {
          glow.style.transform = `translate(${currentX * 10}px, ${currentY * 8}px)`;
        }
      }

      chips.forEach((chip, i) => {
        const depth = (i + 1) * 3;
        const px = currentX * depth;
        const py = currentY * depth;
        if (Math.abs(px) < 0.5 && Math.abs(py) < 0.5) {
          chip.style.transform = '';
          return;
        }
        const base = chip.classList.contains('platform-chip--3') ? 'translateX(-50%) ' : '';
        chip.style.transform = `${base}translate(${px}px, ${py}px)`;
      });

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        raf = requestAnimationFrame(update);
      }
    };

    scene.addEventListener('mousemove', onMove);
    scene.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      raf = null;
      if (core) core.style.transform = '';
      chips.forEach((chip) => { chip.style.transform = ''; });
      if (glow) glow.style.transform = '';
    });
  }

  function initStoryCompose() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const compose = document.querySelector('.story-compose');
    if (!compose) return;

    const layers = compose.querySelectorAll('.story-compose__layer');
    let raf = null;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e) => {
      const rect = compose.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
      if (!raf) raf = requestAnimationFrame(update);
    };

    const update = () => {
      raf = null;
      layers.forEach((layer, i) => {
        const depth = (i + 1) * 6;
        layer.style.transform =
          `translate3d(${targetX * depth}px, ${targetY * depth}px, 0)`;
      });
    };

    compose.addEventListener('mousemove', onMove);
    compose.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      layers.forEach((layer) => { layer.style.transform = ''; });
    });
  }

  function initImpactCharts() {
    const rows = document.querySelectorAll('.impact-chart__row');
    if (!rows.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    rows.forEach((row) => observer.observe(row));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initMobileNav();
    initActiveNav();
    initFAQ();
    initForm();
    initReveal();
    initCounters();
    initImpactCharts();
    initHeroStage();
    initStoryCompose();
  });
})();
