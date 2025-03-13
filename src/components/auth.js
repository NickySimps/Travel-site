// auth.js
import { CONFIG } from './config.js';

// Global firebase app reference
let firebaseApp;
let firebaseAuth;

// Action code settings for email link sign-in
const actionCodeSettings = {
  url: window.location.origin + '/login-complete.html',
  handleCodeInApp: true
};

export const initializeAuth = () => {
  // Check if Firebase is already initialized to avoid double initialization
  if (!firebase.apps.length) {
    firebaseApp = firebase.initializeApp(CONFIG.FIREBASE);
  } else {
    firebaseApp = firebase.app(); // Use the existing app if it was already initialized
  }

  firebaseAuth = firebase.auth();
  
  const authToggle = document.querySelector(CONFIG.UI.authToggle);
  const authForm = document.querySelector(CONFIG.UI.authForm);
  const authFormContent = document.querySelector(CONFIG.UI.authFormContent);

  // Only proceed if the necessary elements are found in the DOM
  if (!authToggle || !authForm || !authFormContent) {
    console.log('Auth UI elements not found in this page');
    return;
  }

  // Set up auth state listener
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User is logged in:', user.email);
    } else {
      console.log('No user is logged in');
    }
    
    updateAuthUI(user);
  });

  const updateAuthUI = (user) => {
    if (user) {
      authToggle.innerHTML = `
        <span class="user-email">${user.email}</span>
        <div class="user-dropdown">
          <button id="logout-btn">Logout</button>
        </div>
      `;
      authForm.classList.remove('active');
    } else {
      authToggle.textContent = 'Login';
      authFormContent.innerHTML = `
        <input type="email" name="email" placeholder="Email" required>
        <div class="auth-buttons">
          <button type="submit" id="login-btn">Login with Email</button>
        </div>
      `;
    }
  };

  // Handle email link sign-in if we're on the login-complete page
  if (window.location.pathname.includes('login-complete.html')) {
    if (firebaseAuth.isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      firebaseAuth.signInWithEmailLink(email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          window.location.href = '/'; // Redirect to home page
        })
        .catch((error) => {
          console.error('Error signing in with email link:', error);
          alert('Error signing in: ' + error.message);
        });
    }
  }

  // Toggle auth form
  authToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!firebaseAuth.currentUser) {
      authForm.classList.toggle('active');
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.auth-container')) {
      authForm.classList.remove('active');
    }
  });

  // Handle form submission for email link login
  authFormContent.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    try {
      await firebaseAuth.sendSignInLinkToEmail(email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      alert('Check your email for the login link!');
      authForm.classList.remove('active');
    } catch (error) {
      console.error('Error sending login link:', error);
      alert('Error sending login link: ' + error.message);
    }
  });

  // Handle logout button clicks
  document.addEventListener('click', (e) => {
    if (e.target.id === 'logout-btn') {
      firebaseAuth.signOut()
        .then(() => {
          console.log('User signed out');
        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    }
  });
};