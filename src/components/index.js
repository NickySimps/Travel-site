// Constants
const UI_ELEMENTS = {
  hamburger: '.hamburger',
  navMenu: 'nav ul',
  moreInfoBtns: '.btn-info',
  authToggle: '#auth-toggle',
  authForm: '#auth-form',
  authFormContent: '#auth-form-content',
  openCartBtn: '#open-cart-btn'
};

// Event Handlers
const toggleMoreInfo = (button) => {
  const flavorSection = button.nextElementSibling;
  const isCollapsed = flavorSection.classList.contains('collapse');
  
  flavorSection.classList.toggle('collapse', !isCollapsed);
  flavorSection.classList.toggle('show', isCollapsed);
  button.textContent = isCollapsed ? 'Show Less' : 'More Info';
};

const handleAuth = async (e) => {
  e.preventDefault();
  const isLogin = e.submitter.id === 'login-btn';
  const formData = new FormData(e.target);
  
  try {
    const response = await fetch(isLogin ? '/login' : '/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    
    const data = await response.json();
    if (response.ok) window.location.href = '/';
    else alert(data.error);
  } catch (err) {
    console.error('Auth error:', err);
    alert('Authentication failed');
  }
};

const initializeNavigation = () => {
  const hamburger = document.querySelector(UI_ELEMENTS.hamburger);
  const navMenu = document.querySelector(UI_ELEMENTS.navMenu);
  
  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('nav a').forEach(link => 
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
  const openCartButton = document.querySelector(UI_ELEMENTS.openCartBtn);
  
  cartButton.classList.add('snipcart-checkout');
  cartButton.textContent = 'Cart';
  document.querySelector('header').appendChild(cartButton);
  
  ['item.adding', 'item.added', 'cart.ready'].forEach(event => {
    Snipcart.events.on(event, (data) => console.log(event, data));
  });

  openCartButton.style.display = cartButton.hasChildNodes() ? 'block' : 'none';
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  initializeNavigation();
  
  // More Info buttons
  document.querySelectorAll(UI_ELEMENTS.moreInfoBtns)
    .forEach(btn => btn.addEventListener('click', () => toggleMoreInfo(btn)));
  
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
});

// Form Validation
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email');
    const phone = document.getElementById('phone');

    if (!validateEmail(email.value)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!validatePhone(phone.value)) {
        alert('Please enter a valid phone number.');
        return;
    }

    alert('Thank you for subscribing!');
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\d{10}$/.test(phone); // Example: 1234567890
}

// Initialize Snipcart
window.addEventListener('snipcart.ready', initializeSnipcart);

//Styling
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
    });
});


const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 200) {
    header.style.transform = 'translateY(-100%)';
    header.style.transition = 'transform 0.3s ease-in-out';
  } else {
    header.style.transform = 'translateY(0)';
  }
  
  lastScrollTop = scrollTop;
});

//Firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvKfaFzdlTzodxD2jQSLExl2haQSxvkiw",
  authDomain: "travel-site-c65a7.firebaseapp.com",
  projectId: "travel-site-c65a7",
  storageBucket: "travel-site-c65a7.firebasestorage.app",
  messagingSenderId: "515419394066",
  appId: "1:515419394066:web:26dfc4f17f41bf205e08cb",
  measurementId: "G-5DDFZ0MXTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);