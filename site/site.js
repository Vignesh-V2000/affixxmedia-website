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

const quotes = Array.from(document.querySelectorAll('.quote-list .quote'));
const quoteControls = document.querySelector('.quote-controls');

if (quoteControls && quotes.length > 1) {
  let activeQuote = 0;

  const showQuote = () => {
    quotes.forEach((quote, index) => {
      quote.hidden = index !== activeQuote;
    });
  };

  showQuote();
  quoteControls.hidden = false;
  quoteControls.addEventListener('click', (event) => {
    const control = event.target.closest('[data-quote-step]');
    if (!control) return;
    activeQuote = (activeQuote + Number(control.dataset.quoteStep) + quotes.length) % quotes.length;
    showQuote();
  });
}

function openLinkedService() {
  const section = document.getElementById(location.hash.slice(1));
  if (section?.matches('.service-detail')) section.open = true;
}

openLinkedService();
window.addEventListener('hashchange', openLinkedService);

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
