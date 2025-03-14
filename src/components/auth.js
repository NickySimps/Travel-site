// Enhanced auth.js with better auth state management and logout

import { CONFIG } from './config.js';

// Global firebase app reference
let firebaseApp;
let firebaseAuth;

// Action code settings for email link sign-in
const actionCodeSettings = {
  url: window.location.origin + '/Travel-site/login-complete.html',
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
  
  const authStatusElement = document.getElementById('auth-status');

  // Only proceed if the necessary elements are found in the DOM
  if (!authStatusElement) {
    console.log('Auth UI elements not found in this page');
    return;
  }

  // Set up auth state listener
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User is logged in:', user.email);
      // User is logged in, show user info and logout button
      authStatusElement.innerHTML = `
        <span class="user-email">${user.email}</span>
        <button id="logout-btn" class="auth-toggle">Logout</button>
      `;
      
      // Add event listener to logout button
      document.getElementById('logout-btn').addEventListener('click', () => {
        signOut().then(() => {
          console.log('User signed out');
        }).catch((error) => {
          console.error('Error signing out:', error);
        });
      });
    } else {
      console.log('No user is logged in');
      // User is not logged in, show login button
      authStatusElement.innerHTML = `
        <button id="auth-toggle" class="auth-toggle">Login</button>
        <div id="auth-form" class="auth-form">
          <form id="auth-form-content">
            <input type="email" name="email" placeholder="Email" required>
            <div class="auth-buttons">
              <button type="submit" id="login-btn">Login with Email</button>
            </div>
          </form>
        </div>
      `;
      
      // Set up the login form toggle
      const authToggle = document.getElementById('auth-toggle');
      const authForm = document.getElementById('auth-form');
      const authFormContent = document.getElementById('auth-form-content');
      
      // Toggle auth form
      authToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        authForm.classList.toggle('active');
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
    }
  });

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
          window.location.href = '/Travel-site/'; // Redirect to home page
        })
        .catch((error) => {
          console.error('Error signing in with email link:', error);
          alert('Error signing in: ' + error.message);
        });
    }
  }
};

export const signOut = () => {
  if (!firebaseAuth) {
    console.error('Firebase Auth not initialized');
    return Promise.reject(new Error('Firebase Auth not initialized'));
  }
  return firebaseAuth.signOut();
};