// src/components/main.js
import { CONFIG } from './config.js';
import { debounce } from './utils.js';

let lastScrollTop = 0;

const initializeUI = () => {
  const header = document.querySelector(CONFIG.UI.header);
  const backToTop = document.querySelector(CONFIG.UI.backToTop);

  window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.pageYOffset;
    if (backToTop) {
      backToTop.style.display = scrollTop > 300 ? 'block' : 'none';
    }
    if (header) {
      header.style.transform = scrollTop > lastScrollTop && scrollTop > 200 ?
        'translateY(-100%)' : 'translateY(0)';
    }
    lastScrollTop = scrollTop;
  }, 100));

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Single implementation for all "More Info" buttons
  document.querySelectorAll('.btn-info').forEach(btn => {
    btn.addEventListener('click', () => {
      // Find the target element
      const targetId = btn.getAttribute('data-target');
      let content;
      
      if (targetId) {
        // If the button has a data-target attribute, use it to find the content
        content = document.querySelector(targetId);
      } else {
        // Otherwise, look for the next sibling with flavor-content class
        content = btn.nextElementSibling;
        while (content && !content.classList.contains('flavor-content')) {
          content = content.nextElementSibling;
        }
      }

      if (content) {
        // Toggle the active class
        content.classList.toggle('active');
        
        // Update button text based on state
        btn.textContent = content.classList.contains('active') ? 'Less Info' : 'More Info';
      }
    });
  });
};

export { initializeUI };