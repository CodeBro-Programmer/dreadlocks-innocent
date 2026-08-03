/**
 * main.js
 * Entry point loaded as a module on every page. Wires up the shared
 * chrome (theme toggle, back-to-top, footer year) and hands off to the
 * feature-specific modules, each of which no-ops safely if its markup
 * isn't present on the current page.
 */

import { qs, debounce } from './utils.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initGallery } from './gallery.js';
import { initBooking } from './booking.js';

const THEME_STORAGE_KEY = 'dreadlocks-innocent-theme';

function initThemeToggle() {
  const toggle = qs('.theme-toggle');
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.classList.toggle('theme-light', theme === 'light');
  };

  const stored = safeGetStoredTheme();
  if (stored) applyTheme(stored);

  toggle?.addEventListener('click', () => {
    const nextTheme = root.classList.contains('theme-light') ? 'dark' : 'light';
    applyTheme(nextTheme);
    safeSetStoredTheme(nextTheme);
  });
}

// In-memory fallback for browsers/contexts where storage access throws
// (privacy modes, sandboxed previews) so the toggle still works per-visit.
let inMemoryTheme = null;

function safeGetStoredTheme() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) || inMemoryTheme;
  } catch (error) {
    return inMemoryTheme;
  }
}

function safeSetStoredTheme(theme) {
  inMemoryTheme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Storage unavailable — the in-memory fallback still covers this visit.
  }
}

function initBackToTop() {
  const backToTop = qs('.fab-top');
  if (!backToTop) return;

  const updateVisibility = () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 640);
  };

  updateVisibility();
  window.addEventListener('scroll', debounce(updateVisibility, 10));
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initFooterYear() {
  const yearEl = qs('[data-current-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function init() {
  document.body.classList.remove('no-js');
  initNavigation();
  initThemeToggle();
  initBackToTop();
  initFooterYear();
  initAnimations();
  initGallery();
  initBooking();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
