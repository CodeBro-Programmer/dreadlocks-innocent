/**
 * booking.js
 * Validates and "submits" the appointment booking form.
 *
 * No backend is wired up for this build, so submission runs in demo mode:
 * the form is validated exactly as it would be in production, then a
 * success panel is shown with the details the visitor entered. Swap
 * `submitBookingDemo` for a real fetch() call to a booking API when one
 * is available.
 */

import { qs, qsa, formatFriendlyDate, formatFriendlyTime } from './utils.js';

const validators = {
  fullName: (value) => value.trim().length >= 2 || 'Enter your full name.',
  phone: (value) => /^[0-9+()\s-]{7,20}$/.test(value.trim()) || 'Enter a valid phone number.',
  email: (value) =>
    value.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Enter a valid email address.',
  service: (value) => value !== '' || 'Choose a service.',
  date: (value) => value !== '' || 'Choose a preferred date.',
  time: (value) => value !== '' || 'Choose a preferred time.',
};

function setMinBookingDate(form) {
  const dateInput = qs('input[name="date"]', form);
  if (!dateInput) return;
  const today = new Date();
  dateInput.min = today.toISOString().split('T')[0];
}

function prefillServiceFromQuery(form) {
  const serviceSelect = qs('select[name="service"]', form);
  if (!serviceSelect) return;
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('service');
  if (requested && qs(`option[value="${requested}"]`, serviceSelect)) {
    serviceSelect.value = requested;
  }
}

function showFieldError(field, message) {
  const wrapper = field.closest('.form-field');
  const errorEl = qs('.field-error', wrapper);
  wrapper.classList.toggle('has-error', Boolean(message));
  if (errorEl) errorEl.textContent = message === true ? '' : message || '';
}

function validateForm(form) {
  let isValid = true;
  Object.entries(validators).forEach(([name, validate]) => {
    const field = qs(`[name="${name}"]`, form);
    if (!field) return;
    const result = validate(field.value);
    showFieldError(field, result === true ? '' : result);
    if (result !== true) isValid = false;
  });
  return isValid;
}

function attachLiveValidation(form) {
  Object.keys(validators).forEach((name) => {
    const field = qs(`[name="${name}"]`, form);
    if (!field) return;
    field.addEventListener('blur', () => {
      const result = validators[name](field.value);
      showFieldError(field, result === true ? '' : result);
    });
  });
}

function submitBookingDemo(formData) {
  // Simulated network latency so the UI's loading state feels real.
  return new Promise((resolve) => setTimeout(() => resolve(formData), 900));
}

function renderSummary(form, data) {
  const summary = qs('[data-booking-summary]', form);
  if (!summary) return;

  const serviceLabel =
    qs(`select[name="service"] option[value="${data.service}"]`, form)?.textContent.trim() || data.service;

  summary.innerHTML = `
    <dt>Service</dt><dd>${serviceLabel}</dd>
    <dt>Preferred date</dt><dd>${formatFriendlyDate(data.date)}</dd>
    <dt>Preferred time</dt><dd>${formatFriendlyTime(data.time)}</dd>
    <dt>Contact</dt><dd>${data.phone}</dd>
  `;
}

function initBookingForm() {
  const form = qs('.booking-form');
  if (!form) return;

  setMinBookingDate(form);
  prefillServiceFromQuery(form);
  attachLiveValidation(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm(form)) {
      const firstError = qs('.has-error input, .has-error select, .has-error textarea', form);
      firstError?.focus();
      return;
    }

    const submitBtn = qs('[type="submit"]', form);
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending request…';
    submitBtn.disabled = true;

    const formData = Object.fromEntries(new FormData(form).entries());

    try {
      await submitBookingDemo(formData);
      renderSummary(form, formData);
      form.classList.add('is-submitted');
      qs('.form-success', form)?.classList.add('is-visible');
      qs('.form-success', form)?.setAttribute('tabindex', '-1');
      qs('.form-success', form)?.focus();
    } finally {
      submitBtn.textContent = originalLabel;
      submitBtn.disabled = false;
    }
  });

  qs('[data-booking-reset]')?.addEventListener('click', () => {
    form.reset();
    form.classList.remove('is-submitted');
    qs('.form-success', form)?.classList.remove('is-visible');
    qsa('.form-field', form).forEach((field) => field.classList.remove('has-error'));
    setMinBookingDate(form);
  });
}

export function initBooking() {
  initBookingForm();
}
