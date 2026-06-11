/**
 * Portfolio — scroll progress, smooth navigation, Web3Forms contact
 */

const progressBar = document.getElementById('pb');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const sendButton = document.querySelector('.send-btn');
const sendBtnText = document.querySelector('.send-btn-text');
const sendBtnIcon = document.querySelector('.send-btn-icon');

/** Update the top progress bar based on scroll position */
function updateScrollProgress() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;

  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }
}

/** Smooth-scroll to a section by id */
function goTo(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth'
  });
}

/** Submit contact form via Web3Forms */
async function sendMsg(e) {
  e.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const formData = new FormData(contactForm);

  const subject = formData.get('subject');
  if (subject) {
    formData.set('subject', `Portfolio Contact: ${subject}`);
  }

  sendButton.disabled = true;
  sendButton.classList.add('is-loading');

  formStatus.textContent = '';
  formStatus.className = 'form-status';

  if (sendBtnText) {
    sendBtnText.textContent = 'Sending...';
  }

  if (sendBtnIcon) {
    sendBtnIcon.className = 'bi bi-arrow-repeat send-btn-icon';
  }

  try {
    const response = await fetch(
      'https://api.web3forms.com/submit',
      {
        method: 'POST',
        body: formData
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message || 'Failed to send message.'
      );
    }

    contactForm.reset();

    formStatus.textContent =
      'Thank you! Your message has been sent successfully.';
    formStatus.classList.add('is-success');

    sendButton.classList.add('is-sent');

    if (sendBtnText) {
      sendBtnText.textContent = 'Message Sent';
    }

    if (sendBtnIcon) {
      sendBtnIcon.className =
        'bi bi-check-circle-fill send-btn-icon';
    }

    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      sendButton.classList.remove('is-sent');

      if (sendBtnText) {
        sendBtnText.textContent = 'Send Message';
      }

      if (sendBtnIcon) {
        sendBtnIcon.className =
          'bi bi-send-fill send-btn-icon';
      }
    }, 4000);

  } catch (error) {
    console.error(error);

    formStatus.textContent =
      error.message ||
      'Failed to send. Please try again later.';
    formStatus.classList.add('is-error');

    if (sendBtnText) {
      sendBtnText.textContent = 'Send Message';
    }

    if (sendBtnIcon) {
      sendBtnIcon.className =
        'bi bi-send-fill send-btn-icon';
    }
  } finally {
    sendButton.disabled = false;
    sendButton.classList.remove('is-loading');
  }
}

window.addEventListener('scroll', updateScrollProgress);

if (contactForm) {
  contactForm.addEventListener('submit', sendMsg);
}

/** Wire up smooth-scroll buttons (data-scroll="sectionId") */
document.querySelectorAll('[data-scroll]').forEach((el) => {
  el.addEventListener('click', () => {
    goTo(el.dataset.scroll);
  });
});

/** Smooth-scroll for in-page anchor links */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);

    if (!id) return;

    e.preventDefault();
    goTo(id);
  });
});

/** Fade-in certificate cards when they enter the viewport */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  }
);

document
  .querySelectorAll('.reveal')
  .forEach((el) => revealObserver.observe(el));