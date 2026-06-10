/**
 * Portfolio — scroll progress, smooth navigation, contact form feedback
 */

const progressBar = document.getElementById('pb');
const sendButton = document.querySelector('.send-btn');

/** Update the top progress bar based on scroll position */
function updateScrollProgress() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;
  progressBar.style.width = `${percent}%`;
}

/** Smooth-scroll to a section by id */
function goTo(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
}

/** Show temporary success state on the contact form button */
function sendMsg() {
  sendButton.textContent = 'Message Sent ✓';
  sendButton.classList.add('is-sent');

  setTimeout(() => {
    sendButton.textContent = 'Send Message ✦';
    sendButton.classList.remove('is-sent');
  }, 3000);
}

window.addEventListener('scroll', updateScrollProgress);

/** Wire up smooth-scroll buttons (data-scroll="sectionId") */
document.querySelectorAll('[data-scroll]').forEach((el) => {
  el.addEventListener('click', () => goTo(el.dataset.scroll));
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
