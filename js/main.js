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
    const segment = parts.length ? parts[parts.length - 1] : 'index.html';
    const pageMap = {
      'index.html': 'home',
      'about.html': 'about',
      'services.html': 'services',
      'industries.html': 'industries',
      'case-studies.html': 'case-studies',
      'contact.html': 'contact'
    };
    const currentPage = pageMap[segment] || 'home';

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = document.querySelectorAll('.reveal');
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

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initMobileNav();
    initActiveNav();
    initFAQ();
    initForm();
    initReveal();
  });
})();
