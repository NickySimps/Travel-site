import { CONFIG } from './config.js';
import { debounce } from './utils.js';
import { initializeCart } from './ShoppingCart.js';

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

  initializeCart();

  document.querySelectorAll(CONFIG.UI.moreInfoBtns).forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      content.classList.toggle('active');
      btn.textContent = content.classList.contains('active') ? 'Show Less' : 'More Info';
    });
  });
  document.querySelectorAll('.btn-info').forEach(btn => {
    btn.addEventListener('click', () => {
      // Find the next sibling that contains the content
      const content = btn.nextElementSibling;

      // Toggle active class
      if (content && content.classList.contains('flavor-content')) {
        content.classList.toggle('active');

        // Update button text based on state
        btn.textContent = content.classList.contains('active') ? 'Less Info' : 'More Info';

        // Optional: Close other open sections
        const siblings = btn.closest('.package-box')
          .querySelectorAll('.flavor-content.active');

        siblings.forEach(sibling => {
          if (sibling !== content) {
            sibling.classList.remove('active');
            sibling.previousElementSibling.textContent = 'More Info';
          }
        });
      }
    });
  });
};



export { initializeUI };
