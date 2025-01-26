import { CONFIG } from './config.js';
import { debounce } from './utils.js';

let lastScrollTop = 0;

const initializeUI = () => {
  const header = document.querySelector(CONFIG.UI.header);
  const backToTop = document.querySelector(CONFIG.UI.backToTop);

  window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.pageYOffset;
    backToTop.style.display = scrollTop > 300 ? 'block' : 'none';
    header.style.transform = scrollTop > lastScrollTop && scrollTop > 200 ? 
      'translateY(-100%)' : 'translateY(0)';
    lastScrollTop = scrollTop;
  }, 100));

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.querySelectorAll(CONFIG.UI.moreInfoBtns).forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      content.classList.toggle('active');
      btn.textContent = content.classList.contains('active') ? 'Show Less' : 'More Info';
    });
  });
};

export { initializeUI };
