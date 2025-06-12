// src/components/main.js
import { CONFIG } from './config.js';
import { debounce } from './utils.js';

let lastScrollTop = 0;

const initializeUI = () => {
  const header = document.querySelector(CONFIG.UI.header);
  const backToTopButton = document.getElementById('backToTop');

  window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.pageYOffset;
    // Header hide/show logic
    if (header) {
      header.style.transform = scrollTop > lastScrollTop && scrollTop > 200 ?
        'translateY(-100%)' : 'translateY(0)';
    }

    // Back to Top button visibility
    if (backToTopButton) {
      if (scrollTop > 300) {
        backToTopButton.classList.add('active');
      } else {
        backToTopButton.classList.remove('active');
      }
    }

    lastScrollTop = scrollTop;
  }, 100));

};

export { initializeUI };