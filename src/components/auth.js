// src/components/auth.js
import { CONFIG } from './config.js';

// Global firebase app reference
let firebaseApp;
let firebaseAuth;

// Action code settings for email link sign-in
const actionCodeSettings = {
  url: window.location.origin + '/Travel-site/login-complete.html',
  handleCodeInApp: true
};

export const initializeAuth = (firebaseAlreadyInitialized = false) => {
  // Check if Firebase is already initialized
  if (!firebaseAlreadyInitialized && typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      console.log('Initializing Firebase app');
      try {
        firebaseApp = firebase.initializeApp(CONFIG.FIREBASE);
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        // If error says already initialized, use existing app
        if (error.code === 'app/duplicate-app') {
          firebaseApp = firebase.app();
        } else {
          throw error; // Re-throw if it's a different error
        }
      }
    } else {
      console.log('Firebase already initialized, using existing app');
      firebaseApp = firebase.app(); // Use the existing app
    }
  } else if (typeof firebase !== 'undefined') {
    console.log('Using existing Firebase instance');
    firebaseApp = firebase.app(); // Use existing app
  } else {
    console.warn('Firebase not available, authentication features will not work');
    return;
  }

  // Initialize auth
  try {
    firebaseAuth = firebase.auth();
    console.log('Firebase Auth initialized');
  } catch (error) {
    console.error('Error initializing Firebase Auth:', error);
    return;
  }
  
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
      
      if (authToggle && authForm) {
        // Toggle auth form
        authToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          authForm.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (authForm && !e.target.closest('.auth-container')) {
            authForm.classList.remove('active');
          }
        });
      }
      
      // Handle form submission for email link login
      if (authFormContent) {
        authFormContent.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = e.target.email.value;

          try {
            await firebaseAuth.sendSignInLinkToEmail(email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            alert('Check your email for the login link!');
            if (authForm) {
              authForm.classList.remove('active');
            }
          } catch (error) {
            console.error('Error sending login link:', error);
            alert('Error sending login link: ' + error.message);
          }
        });
      }
    }
  });

  // Handle email link sign-in if we're on the login-complete page
  if (window.location.pathname.includes('login-complete.html')) {
    console.log('Detected login-complete page, handling email sign-in');
    if (firebaseAuth.isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      if (email) {
        console.log('Attempting to sign in with email link');
        firebaseAuth.signInWithEmailLink(email, window.location.href)
          .then(() => {
            console.log('Sign-in successful');
            window.localStorage.removeItem('emailForSignIn');
            window.location.href = window.location.origin + '/Travel-site/'; // Redirect to home page
          })
          .catch((error) => {
            console.error('Error signing in with email link:', error);
            alert('Error signing in: ' + error.message);
          });
      }
    } else {
      console.warn('Not a valid sign-in link');
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