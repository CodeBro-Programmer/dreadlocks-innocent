/**
 * animations.js
 * All GSAP-powered motion for the site: the page-load sequence, scroll
 * reveals, the signature rope-twist divider draw, animated counters,
 * the testimonial slider, and the FAQ accordion.
 *
 * Every timeline is guarded by prefersReducedMotion() so people who ask
 * their OS for less motion get a static, fully legible page instead.
 */

import { qs, qsa, animateCounter, prefersReducedMotion } from './utils.js';

const reduceMotion = prefersReducedMotion();

/* -------------------------------------------------------------------- */
/* Preloader + hero entrance                                            */
/* -------------------------------------------------------------------- */

function runPreloader() {
  const preloader = qs('.preloader');
  if (!preloader) {
    playHeroTimeline();
    return;
  }

  preloader.classList.add('is-loading');

  const finish = () => {
    if (reduceMotion || typeof gsap === 'undefined') {
      preloader.style.display = 'none';
      playHeroTimeline();
      return;
    }
    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
      },
    });
    playHeroTimeline();
  };

  // Wait for the fill animation to visually complete, capped so slow
  // connections never trap the visitor behind the loader.
  setTimeout(finish, 1100);
}

function playHeroTimeline() {
  const hero = qs('[data-hero]');
  if (!hero || typeof gsap === 'undefined' || reduceMotion) {
    qsa('.reveal-up, .reveal-fade, .reveal-text > *', hero || document).forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(qsa('.hero-eyebrow', hero), { opacity: 1, y: 0, duration: 0.6 })
    .to(
      qsa('.hero-title .line', hero),
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
      '-=0.3'
    )
    .to(qsa('.hero-lead', hero), { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to(qsa('.hero-actions', hero), { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to(qsa('.hero-stats', hero), { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to(qsa('.hero-scroll-cue', hero), { opacity: 1, duration: 0.6 }, '-=0.4');
}

/* -------------------------------------------------------------------- */
/* Scroll reveals                                                        */
/* -------------------------------------------------------------------- */

function initScrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  if (reduceMotion) {
    qsa('.reveal-up, .reveal-fade, .reveal-scale').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  qsa('.reveal-up').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  

  qsa('.reveal-fade').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  qsa('.reveal-scale').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  // Staggered card grids
  qsa('[data-stagger]').forEach((group) => {
    const items = qsa(':scope > *', group);
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: group, start: 'top 85%' },
    });
  });

  // Image reveal: a clipped scale-down as the section enters view
  qsa('.reveal-image').forEach((el) => {
    const media = qs('img, .placeholder-art', el);
    gsap.to(el, { opacity: 1, duration: 0.01, scrollTrigger: { trigger: el, start: 'top 90%' } });
    if (media) {
      gsap.to(media, {
        scale: 1,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    }
  });

  // Rope-twist dividers draw once as they enter the viewport
  qsa('.rope-divider').forEach((rope) => {
    ScrollTrigger.create({
      trigger: rope,
      start: 'top 92%',
      once: true,
      onEnter: () => rope.classList.add('is-drawn'),
    });
  });
}

/* -------------------------------------------------------------------- */
/* Animated counters ("Why choose us" / about stats)                    */
/* -------------------------------------------------------------------- */

function initCounters() {
  const counters = qsa('[data-counter]');
  if (counters.length === 0) return;

  if (typeof ScrollTrigger === 'undefined') {
    counters.forEach((el) => animateCounter(el, { to: Number(el.dataset.counter), suffix: el.dataset.suffix || '' }));
    return;
  }

  counters.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        animateCounter(el, {
          to: Number(el.dataset.counter),
          suffix: el.dataset.suffix || '',
          duration: reduceMotion ? 1 : 1800,
        }),
    });
  });
}

/* -------------------------------------------------------------------- */
/* Testimonial slider                                                    */
/* -------------------------------------------------------------------- */

function initTestimonialSlider() {
  const track = qs('[data-testimonial-track]');
  if (!track) return;

  const slides = qsa('.testimonial-slide', track);
  const dotsWrap = qs('[data-testimonial-nav]');
  let activeIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
  if (activeIndex === -1) activeIndex = 0;
  let timerId;

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'testimonial-dot';
    dot.setAttribute('aria-label', `Show testimonial ${index + 1}`);
    dot.addEventListener('click', () => goTo(index, true));
    dotsWrap?.appendChild(dot);
    return dot;
  });

  function render() {
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === activeIndex));
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === activeIndex));
  }

  function goTo(index, userInitiated = false) {
    activeIndex = (index + slides.length) % slides.length;
    render();
    if (userInitiated) restartAutoplay();
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function restartAutoplay() {
    clearInterval(timerId);
    timerId = setInterval(next, 6000);
  }

  render();
  restartAutoplay();
}

/* -------------------------------------------------------------------- */
/* FAQ accordion                                                         */
/* -------------------------------------------------------------------- */

function initAccordion() {
  const items = qsa('.accordion-item');
  if (items.length === 0) return;

  items.forEach((item) => {
    const trigger = qs('.accordion-trigger', item);
    const panel = qs('.accordion-panel', item);
    const inner = qs('.accordion-panel-inner', panel);

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close any other open item for a clean single-open accordion
      items.forEach((other) => {
        if (other === item) return;
        const otherTrigger = qs('.accordion-trigger', other);
        const otherPanel = qs('.accordion-panel', other);
        otherTrigger.setAttribute('aria-expanded', 'false');
        if (typeof gsap !== 'undefined' && !reduceMotion) {
          gsap.to(otherPanel, { height: 0, duration: 0.4, ease: 'power2.inOut' });
        } else {
          otherPanel.style.height = '0px';
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));

      if (typeof gsap !== 'undefined' && !reduceMotion) {
        gsap.to(panel, {
          height: isOpen ? 0 : inner.offsetHeight,
          duration: 0.45,
          ease: 'power2.inOut',
        });
      } else {
        panel.style.height = isOpen ? '0px' : `${inner.offsetHeight}px`;
      }
    });
  });
}

/* -------------------------------------------------------------------- */
/* Public init                                                           */
/* -------------------------------------------------------------------- */

export function initAnimations() {
  runPreloader();
  initScrollReveals();
  initCounters();
  initTestimonialSlider();
  initAccordion();
}
