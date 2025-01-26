import { CONFIG } from './config.js';

export const initializeNavigation = () => {
  const hamburger = document.querySelector(CONFIG.UI.hamburger);
  const navMenu = document.querySelector(CONFIG.UI.navMenu);

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu?.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
      hamburger?.classList.remove('active');
      navMenu?.classList.remove('active');
    }
  });
};