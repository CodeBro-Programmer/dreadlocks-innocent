/**
 * gallery.js
 * Category filtering for the masonry gallery, plus a lightweight,
 * dependency-free lightbox with keyboard and click navigation.
 */

import { qs, qsa, trapFocus } from './utils.js';

function initGalleryFilters() {
  const chips = qsa('.filter-chip');
  const items = qsa('.masonry-item');
  if (chips.length === 0 || items.length === 0) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');

      const category = chip.dataset.filter;

      items.forEach((item) => {
        const matches = category === 'all' || item.dataset.category === category;
        if (typeof gsap !== 'undefined') {
          gsap.to(item, {
            opacity: matches ? 1 : 0,
            scale: matches ? 1 : 0.9,
            duration: 0.35,
            ease: 'power2.out',
            onStart: () => {
              if (matches) item.style.display = '';
            },
            onComplete: () => {
              if (!matches) item.style.display = 'none';
            },
          });
        } else {
          item.style.display = matches ? '' : 'none';
        }
      });
    });
  });
}

function initLightbox() {
  const lightbox = qs('.lightbox');
  const items = qsa('.masonry-item');
  if (!lightbox || items.length === 0) return;

  const stage = qs('.lightbox-stage', lightbox);
  const caption = qs('.lightbox-caption', lightbox);
  const closeBtn = qs('.lightbox-close', lightbox);
  const prevBtn = qs('.lightbox-prev', lightbox);
  const nextBtn = qs('.lightbox-next', lightbox);

  let currentIndex = 0;
  let releaseFocusTrap = () => {};
  let lastFocused = null;

  function renderSlide(index) {
    currentIndex = (index + items.length) % items.length;
    const source = items[currentIndex];
    const media = qs('.placeholder-art', source);
    caption.textContent = source.dataset.caption || '';
    stage.innerHTML = '';
    if (media) {
      stage.appendChild(media.cloneNode(true));
    }
  }

  function open(index) {
    lastFocused = document.activeElement;
    renderSlide(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    releaseFocusTrap = trapFocus(lightbox);
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    releaseFocusTrap();
    lastFocused?.focus();
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => open(index));
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(index);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => renderSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => renderSlide(currentIndex + 1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') renderSlide(currentIndex - 1);
    if (event.key === 'ArrowRight') renderSlide(currentIndex + 1);
  });
}

export function initGallery() {
  initGalleryFilters();
  initLightbox();
}
