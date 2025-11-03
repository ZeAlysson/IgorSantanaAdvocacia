// includes.js — simple client-side partials loader
// Usage: add <div data-include="partials/header.html"></div> and this script will fetch and inject the markup.

document.addEventListener('DOMContentLoaded', async () => {
  const includes = Array.from(document.querySelectorAll('[data-include]'));
  for (const el of includes) {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        console.error('include fetch failed:', url, res.status);
        continue;
      }
      const text = await res.text();
      el.innerHTML = text;
    } catch (err) {
      console.error('Error loading include', url, err);
    }
  }

  // Signal that includes are loaded so other scripts can safely initialize
  window.__includesLoaded = true;
  document.dispatchEvent(new Event('includes:loaded'));
});
