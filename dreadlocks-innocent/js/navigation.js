/**
 * navigation.js
 * Handles the sticky header state, the mobile navigation drawer,
 * and marking the current page's nav link as active.
 */

import { qs, qsa, debounce, trapFocus } from './utils.js';

const SCROLL_THRESHOLD = 24;

function initStickyHeader() {
  const header = qs('.site-header');
  if (!header) return;

  const updateHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  updateHeaderState();
  window.addEventListener('scroll', debounce(updateHeaderState, 10));
}

function initMobileDrawer() {
  const toggle = qs('.nav-toggle');
  const drawer = qs('.nav-drawer');
  if (!toggle || !drawer) return;

  let releaseFocusTrap = () => {};

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    releaseFocusTrap();
  };

  const openDrawer = () => {
    drawer.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    releaseFocusTrap = trapFocus(drawer);
    const firstLink = qs('a', drawer);
    if (firstLink) firstLink.focus();
  };

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    isOpen ? closeDrawer() : openDrawer();
  });

  qsa('a', drawer).forEach((link) => link.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
      toggle.focus();
    }
  });
}

function markActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.nav-links a, .nav-drawer a').forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

export function initNavigation() {
  initStickyHeader();
  initMobileDrawer();
  markActiveLink();
}
