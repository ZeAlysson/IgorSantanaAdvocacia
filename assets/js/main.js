// main.js — handles AOS, EmailJS form, posts loading and UI interactions
document.addEventListener('DOMContentLoaded', function () {
  // init AOS
  if (window.AOS) AOS.init({ duration: 700, once: true });

  // Elements
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const headerInner = document.getElementById('header-inner');
  const siteHeader = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // WhatsApp links - replace PHONE with your number in international format (no +)
  // WhatsApp/contact number for Igor Santana (provided)
  // Format: country code + DDD + number, no + or spaces
  const phone = '554185122438'; // +55 41 8512-2438
  const message = encodeURIComponent('Olá, quero agendar uma consulta.');
  const waHref = `https://wa.me/${phone}?text=${message}`;
  const waLinks = [document.getElementById('whatsapp-link'), document.getElementById('whatsapp-float')];
  waLinks.forEach(el => { if (el) el.href = waHref; });

  // EmailJS initialization will be done below when the form is available.
  // We intentionally delay init so we can read data attributes from the form
  // (data-emailjs-user etc.) — this avoids hardcoding secrets in the JS file.

  // Mobile menu toggle
  mobileBtn && mobileBtn.addEventListener('click', () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    const overlay = document.getElementById('mobile-menu-overlay');
    if (overlay) { overlay.classList.remove('opacity-0','pointer-events-none'); overlay.classList.add('opacity-100'); }
    document.body.classList.add('overflow-hidden');
  });

  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.classList.remove('translate-x-0');
    if (mobileOverlay) { mobileOverlay.classList.add('opacity-0','pointer-events-none'); mobileOverlay.classList.remove('opacity-100'); }
    document.body.classList.remove('overflow-hidden');
  }
  mobileMenuClose && mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileOverlay && mobileOverlay.addEventListener('click', closeMobileMenu);

  // Mobile CTA opens contact section
  const mobileCta = document.getElementById('mobile-cta');
  mobileCta && mobileCta.addEventListener('click', () => { document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); });

  // Back-to-top visibility on scroll
  window.addEventListener('scroll', () => {
    if (backToTop) {
      if (window.scrollY > 400) backToTop.classList.remove('hidden');
      else backToTop.classList.add('hidden');
    }
  }, { passive: true });

  // Smooth scroll for internal links
  document.body.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile menu if open (use closeMobileMenu helper)
      try { closeMobileMenu(); } catch (err) { /* ignore if not available */ }
    }
  });

  // Back to top
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Testimonials slider (simple, robust)
  (function initTestimonials() {
    const wrapper = document.querySelector('#testimonials-slider');
    if (!wrapper) return;
    const container = wrapper.querySelector('.test-slides');
    if (!container) return;
    const slides = Array.from(container.children);
    const slideCount = slides.length;
    if (slideCount === 0) return;
    let idx = 0;

    // ensure layout: each slide takes full wrapper width
    container.style.display = 'flex';
    container.style.transition = 'transform 0.5s ease';
    slides.forEach(s => { s.style.flex = '0 0 100%'; s.style.boxSizing = 'border-box'; });

    function go(i) {
      idx = ((i % slideCount) + slideCount) % slideCount;
      container.style.transform = `translateX(-${idx * 100}%)`;
    }

    // auto play
    let timer = setInterval(() => go(idx + 1), 5000);

    // prev/next buttons
    const prev = document.getElementById('test-prev');
    const next = document.getElementById('test-next');
    prev && prev.addEventListener('click', () => { go(idx - 1); clearInterval(timer); timer = setInterval(() => go(idx + 1), 5000); });
    next && next.addEventListener('click', () => { go(idx + 1); clearInterval(timer); timer = setInterval(() => go(idx + 1), 5000); });

    // expose for debugging if needed
    wrapper.goTo = go;
  })();

  // Contact form handling with validation and loading
  const form = document.getElementById('contact-form');
  const sendBtn = document.getElementById('send-btn');
  const sendLabel = document.getElementById('send-label');
  const sendSpinner = document.getElementById('send-spinner');
  const statusEl = document.getElementById('form-status');

  // EmailJS: read IDs from data attributes on the form (safer than editing JS)
  // Add the following attributes to the <form> tag in index.html:
  // data-emailjs-user, data-emailjs-service, data-emailjs-template
  const emailjsUser = form?.dataset?.emailjsUser;
  const emailjsService = form?.dataset?.emailjsService;
  const emailjsTemplate = form?.dataset?.emailjsTemplate;
  if (window.emailjs && emailjsUser) {
    try { emailjs.init(emailjsUser); } catch (err) { console.warn('EmailJS init failed', err); }
  }

  function setLoading(on) {
    if (on) {
      sendSpinner.classList.remove('hidden');
      sendBtn.setAttribute('disabled', '');
      sendLabel.textContent = 'Enviando...';
    } else {
      sendSpinner.classList.add('hidden');
      sendBtn.removeAttribute('disabled');
      sendLabel.textContent = 'Enviar';
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      statusEl.textContent = '';

      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const messageEl = form.querySelector('#message');
      if (!name.value.trim() || !email.value.trim() || !messageEl.value.trim()) {
        statusEl.textContent = 'Por favor preencha os campos obrigatórios.';
        return;
      }

      setLoading(true);

      // Try EmailJS if available
      if (window.emailjs) {
        const serviceID = emailjsService || 'YOUR_SERVICE_ID';
        const templateID = emailjsTemplate || 'YOUR_TEMPLATE_ID';
        // If the developer forgot to set real IDs, we still call sendForm which
        // will likely fail - the fallback below will handle that case.
        emailjs.sendForm(serviceID, templateID, form)
          .then(() => {
            setLoading(false);
            statusEl.textContent = 'Mensagem enviada. Obrigado!';
            form.reset();
          }).catch(err => {
            console.error('EmailJS error', err);
            setLoading(false);
            statusEl.textContent = 'Erro ao enviar via EmailJS. Verifique suas configurações.';
          });
      } else {
        // Fallback: simulate send (since no server)
        setTimeout(() => {
          setLoading(false);
          statusEl.textContent = 'Mensagem simulada como enviada (EmailJS não configurado).';
          form.reset();
        }, 1200);
      }
    });
  }

  // Load posts from posts/posts.json (unchanged)
  const postsContainer = document.getElementById('posts-container');
  if (postsContainer) {
    fetch('./posts/posts.json')
      .then(r => r.json())
      .then(posts => {
        if (!Array.isArray(posts)) return;
        posts.forEach(p => {
          const card = document.createElement('article');
          card.className = 'p-6 border rounded bg-white shadow-sm';
          card.innerHTML = `
            <h3 class="font-semibold text-brand">${escapeHtml(p.title)}</h3>
            <p class="mt-2 text-gray-600">${escapeHtml(p.excerpt)}</p>
            <div class="mt-3 flex gap-2 items-center">
              <button data-body='${escapeAttr(p.body)}' class="read-more bg-brand text-white px-3 py-1 rounded text-sm">Ler mais</button>
              <span class="text-sm text-gray-500">${p.date || ''}</span>
            </div>
          `;
          postsContainer.appendChild(card);
        });

        // read more modal
        document.body.addEventListener('click', (e) => {
          if (e.target.matches('.read-more')) {
            const body = e.target.getAttribute('data-body') || '';
            showModal('Publicação', body);
          }
        });
      })
      .catch(err => console.error('Erro ao carregar posts', err));
  }

  // Simple modal utility
  function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
      <div class="bg-white rounded max-w-2xl w-full p-4">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-lg">${escapeHtml(title)}</h3>
          <button id="modal-close" aria-label="Fechar">✕</button>
        </div>
        <div class="mt-3 text-gray-700">${content}</div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (ev) => { if (ev.target === modal) modal.remove(); });
  }

  // Small helpers to avoid injection
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function escapeAttr(str) { return escapeHtml(str).replace(/\n/g, '&#10;'); }

});
