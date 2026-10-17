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

// --- PWA: service worker registration -------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
  });
}

// --- PWA: install prompt banner -------------------------------------------
(() => {
  const STORAGE_KEY = 'qii-install-dismissed';
  const standaloneQuery = '(display-mode: standalone), (display-mode: window-controls-overlay)';

  // Already running as an installed app: nothing to prompt.
  if (window.matchMedia(standaloneQuery).matches || navigator.standalone) return;

  let deferredPrompt = null;
  const banner = document.createElement('div');
  banner.className = 'install-banner';
  banner.hidden = true;
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Install QII One app');
  banner.innerHTML = '<img src="icon-192.png" alt="" aria-hidden="true">' +
    '<p><strong>Install QII One</strong>Add the app to your home screen for faster access and offline reading.</p>' +
    '<button type="button" class="btn btn-accent" data-install>Install</button>' +
    '<button type="button" class="btn install-dismiss" data-install-dismiss aria-label="Dismiss install prompt">Not now</button>';
  document.body.appendChild(banner);

  const dismiss = (persist) => {
    banner.hidden = true;
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (error) { /* storage unavailable */ }
    }
  };

  const alreadyDismissed = () => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (error) { return false; }
  };

  banner.querySelector('[data-install]').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch (error) { /* no-op */ }
    deferredPrompt = null;
    dismiss(false);
  });

  banner.querySelector('[data-install-dismiss]').addEventListener('click', () => dismiss(true));

  window.addEventListener('beforeinstallprompt', (event) => {
    // Chrome/Android and desktop Chromium.
    event.preventDefault();
    deferredPrompt = event;
    if (!alreadyDismissed()) banner.hidden = false;
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    dismiss(false);
  });
})();
