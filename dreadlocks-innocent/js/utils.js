/**
 * utils.js
 * Small, dependency-free helper functions shared across the site.
 */

/** Shorthand for a single querySelector, scoped optionally to a root node. */
export const qs = (selector, root = document) => root.querySelector(selector);

/** Shorthand for querySelectorAll that returns a real array. */
export const qsa = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

/**
 * Delays invoking a function until after `wait` ms have elapsed since the
 * last time it was invoked. Used to keep scroll/resize handlers cheap.
 */
export function debounce(fn, wait = 150) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

/** Clamps a number between a minimum and maximum value. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Returns true when the viewport matches a "reduced motion" preference. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Formats a Date as "Mon, 12 Aug 2026" for booking confirmations. */
export function formatFriendlyDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Formats a 24h time string ("14:30") as "2:30 PM". */
export function formatFriendlyTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':').map(Number);
  if (Number.isNaN(hours)) return timeString;
  const period = hours >= 12 ? 'PM' : 'AM';
  const friendlyHour = ((hours + 11) % 12) + 1;
  return `${friendlyHour}:${String(minutes).padStart(2, '0')} ${period}`;
}

/** Simple animated count-up used for the stats/counter sections. */
export function animateCounter(el, { from = 0, to, duration = 1600, suffix = '' } = {}) {
  const start = performance.now();
  const target = Number(to);

  function tick(now) {
    const elapsed = now - start;
    const progress = clamp(elapsed / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const value = Math.round(from + (target - from) * eased);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = `${target}${suffix}`;
    }
  }

  requestAnimationFrame(tick);
}

/** Traps focus within a container while it is open (for the mobile drawer / lightbox). */
export function trapFocus(container) {
  const focusable = qsa(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    container
  );
  if (focusable.length === 0) return () => {};

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handleKeydown(event) {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  container.addEventListener('keydown', handleKeydown);
  return () => container.removeEventListener('keydown', handleKeydown);
}
