// Constants
const UI_ELEMENTS = {
  hamburger: '.hamburger',
  navMenu: 'nav ul',
  moreInfoBtns: '.btn-info',
  authToggle: '#auth-toggle',
  authForm: '#auth-form',
  authFormContent: '#auth-form-content',
  openCartBtn: '#open-cart-btn',
  backToTop: '#backToTop',
  header: 'header',
  newsletterForm: '.newsletter-form',
  retreatForm: '#retreat-form',
};

// Utility Functions
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\d{10}$/.test(phone);

const toggleMoreInfo = (button) => {
  const flavorSection = button.nextElementSibling;
  const isShown = flavorSection.classList.contains('active');
  flavorSection.classList.toggle('active');
  button.textContent = isShown ? 'More Info' : 'Show Less';
};

// Event Handlers
const handleAuth = async (e) => {
  e.preventDefault();
  const isLogin = e.submitter.id === 'login-btn';
  const formData = new FormData(e.target);

  try {
    const response = await fetch(isLogin ? '/login' : '/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      alert('Unexpected response from the server.');
      return;
    }

    if (response.ok) {
      window.location.href = '/';
    } else {
      alert(data.error || 'Authentication failed');
    }
  } catch (err) {
    console.error('Auth error:', err);
    alert('Network error. Please try again.');
  }
};

const initializeNavigation = () => {
  const hamburger = document.querySelector(UI_ELEMENTS.hamburger);
  const navMenu = document.querySelector(UI_ELEMENTS.navMenu);

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active', isActive);
    hamburger.setAttribute('aria-expanded', isActive);
  });

  document.querySelectorAll('nav a').forEach((link) =>
    link.addEventListener('click', closeMenu)
  );

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });
};

const initializeSnipcart = () => {
  const cartButton = document.createElement('button');
  cartButton.classList.add('snipcart-checkout');
  cartButton.textContent = 'Cart';
  document.querySelector('header').appendChild(cartButton);

  ['item.adding', 'item.added', 'cart.ready'].forEach((event) => {
    Snipcart.events.on(event, (data) => console.log(event, data));
  });
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  
  const backToTop = document.querySelector(UI_ELEMENTS.backToTop);
  const header = document.querySelector(UI_ELEMENTS.header);
  let lastScrollTop = 0;

  // More Info buttons
  document.querySelectorAll(UI_ELEMENTS.moreInfoBtns).forEach((btn) =>
    btn.addEventListener('click', () => toggleMoreInfo(btn))
  );

  // Auth functionality
  const authToggle = document.querySelector(UI_ELEMENTS.authToggle);
  const authForm = document.querySelector(UI_ELEMENTS.authForm);
  const authFormContent = document.querySelector(UI_ELEMENTS.authFormContent);

  authToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    authForm?.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.auth-container')) {
      authForm?.classList.remove('active');
    }
  });

  authFormContent?.addEventListener('submit', handleAuth);

  // Debounced scroll event
  window.addEventListener(
    'scroll',
    debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Back to top visibility
      backToTop.style.display = scrollTop > 300 ? 'block' : 'none';

      // Header hide/show
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }

      lastScrollTop = scrollTop;
    }, 100)
  );

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Newsletter form
  const newsletterForm = document.querySelector(UI_ELEMENTS.newsletterForm);
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = e.target.querySelector('#email');
      const phone = e.target.querySelector('#phone');

      if (!validateEmail(email.value)) {
        alert('Please enter a valid email address.');
        return;
      }

      if (phone && !validatePhone(phone.value)) {
        alert('Please enter a valid phone number.');
        return;
      }

      alert('Thank you for subscribing!');
    });
  }

  // Retreat form
  const retreatForm = document.querySelector(UI_ELEMENTS.retreatForm);
  if (retreatForm) {
    retreatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const emailBody = `Start Date: ${formData.get('startDate')}\nEnd Date: ${formData.get(
        'endDate'
      )}\nGuests: ${formData.get('guests')}\nRooms: ${formData.get(
        'rooms'
      )}\nCatering Required: ${formData.get('catering')}`;

      window.location.href = `mailto:admin@usviretreats.com?subject=Retreat Inquiry&body=${encodeURIComponent(
        emailBody
      )}`;
    });
  }
});

//Service Buttons
document.addEventListener('DOMContentLoaded', () => {
  const serviceButtons = document.querySelectorAll('.service-btn');
  
  serviceButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          e.preventDefault();
          const service = button.dataset.service;
          const packagesSection = document.querySelector('#packages');
          
          // Smooth scroll to packages
          packagesSection.scrollIntoView({ behavior: 'smooth' });
          
          // Highlight relevant package
          const targetPackage = document.querySelector(`[data-package-type="${service}"]`);
          if (targetPackage) {
              targetPackage.classList.add('highlighted');
              setTimeout(() => {
                  targetPackage.classList.remove('highlighted');
              }, 2000);
          }
      });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Initialize service buttons
  document.querySelectorAll('.btn-service').forEach(button => {
      button.addEventListener('click', () => {
          button.classList.toggle('selected');
          updateCartButton(button.closest('.flavor-content'));
      });
  });
  
  function updateCartButton(flavorContent) {
      const cartButton = flavorContent.querySelector('.snipcart-add-item');
      const services = flavorContent.querySelectorAll('.btn-service.selected');
      const servicesSelected = [...services].map(btn => btn.dataset.service);
      
      let option = 'None';
      if (servicesSelected.includes('catering') && servicesSelected.includes('transport')) {
          option = 'Both';
      } else if (servicesSelected.includes('catering')) {
          option = 'Catering';
      } else if (servicesSelected.includes('transport')) {
          option = 'Transport';
      }
      
      cartButton.dataset.itemCustom3Value = option;
  }

  // Your existing code for More Info toggles, back to top button, etc.
});



// Firebase
//import { initializeApp } from 'firebase/app';
//import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
};

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// logEvent(analytics, 'page_view');
