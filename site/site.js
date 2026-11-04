/* ─── Mobile menu ────────────────────────────────────────────── */

const menu = document.querySelector('.mobile-menu');

if (menu) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
}

/* ─── Testimonial carousel ───────────────────────────────────── */

const quoteList = document.querySelector('.quote-list');
const quotes = quoteList?.querySelectorAll('.quote');
const quoteControls = document.querySelector('.quote-controls');

if (quoteControls && quotes?.length > 1) {
  let activeQuote = 0;
  let autoTimer;

  const showQuote = () => {
    quotes.forEach((quote, index) => {
      quote.hidden = index !== activeQuote;
    });
  };

  const advanceQuote = (step) => {
    quoteList.style.setProperty('--quote-direction', step);
    quoteList.classList.add('quote-changed');
    activeQuote = (activeQuote + step + quotes.length) % quotes.length;
    showQuote();
  };

  // Auto-rotate testimonials every 6 seconds
  const startAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => advanceQuote(1), 6000);
  };

  showQuote();
  quoteControls.hidden = false;
  startAuto();

  quoteControls.addEventListener('click', (event) => {
    const control = event.target.closest('[data-quote-step]');
    if (!control) return;
    advanceQuote(Number(control.dataset.quoteStep));
    startAuto(); // restart timer after manual nav
  });
}

/* ─── Service accordion (deep link) ──────────────────────────── */

function openLinkedService() {
  const section = document.getElementById(location.hash.slice(1));
  if (section?.matches('.service-detail')) section.open = true;
}

openLinkedService();
window.addEventListener('hashchange', openLinkedService);

/* ─── Scroll-reveal animations ───────────────────────────────── */

if ('IntersectionObserver' in window && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {

  // All elements we want to animate on scroll
  const revealTargets = document.querySelectorAll(
    '.client-logos li, .section-intro, .service-index li, .service-detail, ' +
    '.proof-intro, .quote-list, .section-heading, .article, .contact-band-inner, ' +
    '.mission-grid > *, .values-list > div, .contact-panel, .contact-intro, ' +
    '.footer-main > *, .footer-base'
  );

  // Add the .reveal class to targets that are below the fold
  for (const target of revealTargets) {
    if (target.getBoundingClientRect().top >= window.innerHeight * 0.85) {
      target.classList.add('reveal');
    }
  }

  // Stagger delay counter per batch
  let lastBatchTime = 0;
  let staggerIndex = 0;

  const revealOnScroll = new IntersectionObserver((entries) => {
    const now = performance.now();

    // Reset stagger when a new batch of entries comes in
    if (now - lastBatchTime > 100) {
      staggerIndex = 0;
      lastBatchTime = now;
    }

    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const el = entry.target;

      // Stagger: add incremental delay for elements revealed together
      const delay = staggerIndex * 80;
      el.style.animationDelay = delay + 'ms';
      staggerIndex++;

      el.classList.remove('reveal');
      el.classList.add('revealed');

      revealOnScroll.unobserve(el);

      // Clean up animation styles after animation completes
      el.addEventListener('animationend', () => {
        el.style.animationDelay = '';
        el.classList.remove('revealed');
        // element stays visible because .reveal was removed
      }, { once: true });
    }
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.05
  });

  for (const target of revealTargets) {
    if (target.classList.contains('reveal')) {
      revealOnScroll.observe(target);
    }
  }
}

/* ─── Parallax-lite for hero image ───────────────────────────── */

if (window.matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover)').matches) {
  const heroArt = document.querySelector('.hero-art img');

  if (heroArt) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroBottom = heroArt.closest('.home-hero')?.offsetHeight || 700;

          if (scrollY < heroBottom) {
            const parallax = scrollY * 0.15;
            heroArt.style.transform = `translateY(${parallax}px) scale(1.02)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

/* ─── Navbar shrink on scroll ────────────────────────────────── */

const header = document.querySelector('.site-header');

if (header) {
  let lastScrollY = 0;
  let headerTicking = false;

  window.addEventListener('scroll', () => {
    if (!headerTicking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
        lastScrollY = window.scrollY;
        headerTicking = false;
      });
      headerTicking = true;
    }
  }, { passive: true });
}

/* ─── Counter animation for service numbers ──────────────────── */

if ('IntersectionObserver' in window && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const serviceNumbers = document.querySelectorAll('.service-number');

  if (serviceNumbers.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        const target = parseInt(el.textContent, 10);

        if (isNaN(target)) { counterObserver.unobserve(el); continue; }

        let current = 0;
        const step = () => {
          current++;
          el.textContent = String(current).padStart(2, '0');
          if (current < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    }, { threshold: 0.5 });

    for (const num of serviceNumbers) {
      counterObserver.observe(num);
    }
  }
}

/* ─── Form enquiry ───────────────────────────────────────────── */

const enquiryForm = document.querySelector('.enquiry-form');

if (enquiryForm) {
  const serviceField = enquiryForm.elements.namedItem('service');
  const requiredTextFields = [
    enquiryForm.elements.namedItem('name'),
    enquiryForm.elements.namedItem('message')
  ];
  const service = new URLSearchParams(location.search).get('service');

  if (service && Array.from(serviceField.options).some((option) => option.value === service)) {
    serviceField.value = service;
  }

  requiredTextFields.forEach((field) => {
    field.addEventListener('input', () => field.setCustomValidity(''));
  });

  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const blankField = requiredTextFields.find((field) => !field.value.trim());
    if (blankField) {
      blankField.setCustomValidity('Please enter text in this field.');
      blankField.reportValidity();
      return;
    }

    const fields = new FormData(enquiryForm);
    const subject = encodeURIComponent('AffixxMedia project enquiry');
    const body = encodeURIComponent([
      'Name: ' + fields.get('name').trim(),
      'Email: ' + fields.get('email').trim(),
      'Company or website: ' + fields.get('company').trim(),
      'Service: ' + serviceField.selectedOptions[0].textContent,
      '',
      fields.get('message').trim()
    ].join('\r\n'));

    enquiryForm.querySelector('.draft-note').textContent =
      'Send the draft from your email app. You can also use the email or WhatsApp link on this page.';
    location.href = 'mailto:growth@affixxmedia.com?subject=' + subject + '&body=' + body;
  });
}
