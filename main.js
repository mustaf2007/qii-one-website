const menuToggle = document.querySelector('[data-menu-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('[data-logo]').forEach((img) => {
  const showFallback = () => {
    img.hidden = true;
    const fallback = img.parentElement?.querySelector('.brand-fallback');
    if (fallback) fallback.hidden = false;
  };
  img.addEventListener('error', showFallback);
  if (img.complete && img.naturalWidth === 0) showFallback();
});

const languageSelect = document.querySelector('[data-language]');
if (languageSelect) {
  languageSelect.addEventListener('change', (event) => {
    const value = event.target.value;
    document.documentElement.lang = value;
    document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
  });
}

document.querySelectorAll('[data-static-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('[data-form-status]');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (status) {
      status.hidden = false;
      status.className = 'notice success';
      status.textContent = 'Thank you. This static website validated your form, but backend submission is not configured yet. Please replace this placeholder with a secure form/API before launch.';
    }
  });
});
