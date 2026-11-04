/* ─── Mobile menu ────────────────────────────────────────────── */

const menu = document.querySelector('.mobile-menu');

if (menu) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('pointerdown', (e) => {
    if (menu.open && !menu.contains(e.target)) menu.open = false;
  });
}

/* ─── Testimonial carousel ───────────────────────────────────── */

const quoteList    = document.querySelector('.quote-list');
const quotes       = quoteList?.querySelectorAll('.quote');
const quoteControls = document.querySelector('.quote-controls');

if (quoteControls && quotes?.length > 1) {
  let activeQuote = 0;
  let autoTimer;

  const showQuote = (step) => {
    if (step !== undefined) {
      quoteList.style.setProperty('--quote-direction', step);
      quoteList.classList.remove('quote-changed');
      // Force reflow so removing and re-adding the class retriggers the animation
      void quoteList.offsetWidth;
      quoteList.classList.add('quote-changed');
      activeQuote = (activeQuote + step + quotes.length) % quotes.length;
    }
    quotes.forEach((q, i) => { q.hidden = i !== activeQuote; });
  };

  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => showQuote(1), 6000);
  };

  showQuote();
  quoteControls.hidden = false;
  startAuto();

  quoteControls.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-quote-step]');
    if (!btn) return;
    showQuote(Number(btn.dataset.quoteStep));
    startAuto();
  });
}

/* ─── Service accordion deep-link ───────────────────────────── */

function openLinkedService() {
  const id = location.hash.slice(1);
  const el = id ? document.getElementById(id) : null;
  if (el?.matches('.service-detail')) el.open = true;
}
openLinkedService();
window.addEventListener('hashchange', openLinkedService);

/* ─── Scroll-reveal (flicker-free) ──────────────────────────── */
/*
 * Strategy:
 *  1. Mark below-fold targets with data-anim="wait" so CSS hides them.
 *  2. IntersectionObserver swaps to data-anim="play", triggering the
 *     @keyframes fade-up with animation-fill-mode:both.
 *  3. We NEVER remove the attribute — `both` locks the final visible
 *     state, so there is no teardown flash.
 *  4. Stagger is applied via inline animation-delay BEFORE switching
 *     the attribute, so the element is hidden during the delay (not
 *     briefly visible at opacity 0 then hidden again).
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reducedMotion.matches && 'IntersectionObserver' in window) {

  const SELECTOR =
    '.client-logos li, .section-intro, .service-index li, .service-detail,' +
    '.proof-intro, .quote-list, .section-heading, .article, .contact-band-inner,' +
    '.mission-grid > *, .values-list > div, .contact-panel, .contact-intro,' +
    '.footer-main > *, .footer-base';

  const targets = Array.from(document.querySelectorAll(SELECTOR));
  const viewH   = window.innerHeight;

  // Only hide elements that are genuinely below the fold
  const belowFold = targets.filter(
    (el) => el.getBoundingClientRect().top > viewH * 0.9
  );
  belowFold.forEach((el) => el.setAttribute('data-anim', 'wait'));

  let batchT = 0;
  let idx    = 0;

  const observer = new IntersectionObserver((entries) => {
    const now = performance.now();
    if (now - batchT > 150) { idx = 0; batchT = now; }

    entries
      .filter((e) => e.isIntersecting && e.target.getAttribute('data-anim') === 'wait')
      .forEach((e) => {
        const el    = e.target;
        const delay = idx * 70;
        idx++;

        // Set delay while element is still hidden, then reveal
        el.style.animationDelay = delay + 'ms';
        el.setAttribute('data-anim', 'play');
        observer.unobserve(el);
      });
  }, { rootMargin: '0px 0px -48px 0px', threshold: 0.04 });

  belowFold.forEach((el) => observer.observe(el));
}

/* ─── Sticky header shrink ───────────────────────────────────── */

const header = document.querySelector('.site-header');
if (header) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('header-scrolled', window.scrollY > 72);
      ticking = false;
    });
  }, { passive: true });
}

/* ─── Parallax hero (compositor-safe) ───────────────────────── */
/*
 * We animate a CSS custom property on the hero wrapper rather than
 * directly setting `transform` on the img (which would conflict with
 * the settle-art @keyframes). The browser composites only the wrapper.
 */

if (!reducedMotion.matches) {
  const heroWrapper = document.querySelector('.home-hero');

  if (heroWrapper) {
    const heroArt = heroWrapper.querySelector('.hero-art');
    let pticking = false;

    // Only run while the hero is visible
    const heroObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', onScroll);
        if (heroArt) heroArt.style.transform = '';
      }
    }, { threshold: 0 });

    heroObserver.observe(heroWrapper);

    function onScroll() {
      if (pticking) return;
      pticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (heroArt) {
          // translateZ(0) keeps it on the GPU layer
          heroArt.style.transform = `translateY(${y * 0.12}px) translateZ(0)`;
        }
        pticking = false;
      });
    }
  }
}

/* ─── Service number count-up ────────────────────────────────── */

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const nums = document.querySelectorAll('.service-number');

  if (nums.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        const end = parseInt(target.textContent, 10);
        if (isNaN(end)) { countObserver.unobserve(target); return; }

        // Smooth eased counter using requestAnimationFrame
        const duration = 500;
        const startT   = performance.now();

        const tick = (now) => {
          const pct = Math.min((now - startT) / duration, 1);
          // Ease-out cubic
          const ease = 1 - Math.pow(1 - pct, 3);
          target.textContent = String(Math.round(ease * end)).padStart(2, '0');
          if (pct < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObserver.unobserve(target);
      });
    }, { threshold: 0.6 });

    nums.forEach((n) => countObserver.observe(n));
  }
}

/* ─── Enquiry form ───────────────────────────────────────────── */

const enquiryForm = document.querySelector('.enquiry-form');

if (enquiryForm) {
  const serviceField       = enquiryForm.elements.namedItem('service');
  const requiredTextFields = [
    enquiryForm.elements.namedItem('name'),
    enquiryForm.elements.namedItem('message'),
  ];
  const service = new URLSearchParams(location.search).get('service');

  if (service && Array.from(serviceField.options).some((o) => o.value === service)) {
    serviceField.value = service;
  }

  requiredTextFields.forEach((f) => {
    f.addEventListener('input', () => f.setCustomValidity(''));
  });

  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const blank = requiredTextFields.find((f) => !f.value.trim());
    if (blank) {
      blank.setCustomValidity('Please enter text in this field.');
      blank.reportValidity();
      return;
    }
    const fields  = new FormData(enquiryForm);
    const subject = encodeURIComponent('AffixxMedia project enquiry');
    const body    = encodeURIComponent([
      'Name: '               + fields.get('name').trim(),
      'Email: '              + fields.get('email').trim(),
      'Company or website: ' + fields.get('company').trim(),
      'Service: '            + serviceField.selectedOptions[0].textContent,
      '',
      fields.get('message').trim(),
    ].join('\r\n'));

    enquiryForm.querySelector('.draft-note').textContent =
      'Send the draft from your email app. You can also use the email or WhatsApp link on this page.';
    location.href = 'mailto:growth@affixxmedia.com?subject=' + subject + '&body=' + body;
  });
}
