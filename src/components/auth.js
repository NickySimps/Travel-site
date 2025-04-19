// src/components/auth.js - Fixed version
import { CONFIG } from './config.js';

// Global firebase app reference
let firebaseApp;
let firebaseAuth;

// Action code settings for email link sign-in - fixed URL to be more robust
const actionCodeSettings = {
  // Use window.location.origin for more robust URL handling
  url: window.location.origin + '/login-complete.html',
  handleCodeInApp: true
};

export const initializeAuth = (firebaseAlreadyInitialized = false) => {
  console.log('Starting authentication initialization...');
  
  // Check if Firebase is already initialized
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Make sure Firebase scripts are included in your HTML.');
    return;
  }

  try {
    // Use existing Firebase app or initialize a new one
    if (!firebase.apps.length) {
      console.log('Initializing new Firebase app');
      // Make sure we have the complete config
      const completeConfig = {
        apiKey: CONFIG.FIREBASE.apiKey,
        authDomain: "travel-site-c65a7.firebaseapp.com", // Make sure this is correct
        projectId: "travel-site-c65a7",
        storageBucket: "travel-site-c65a7.appspot.com",
        messagingSenderId: CONFIG.FIREBASE.messagingSenderId,
        appId: CONFIG.FIREBASE.appId
      };
      
      firebaseApp = firebase.initializeApp(completeConfig);
    } else {
      console.log('Using existing Firebase app');
      firebaseApp = firebase.app();
    }
    
    // Initialize auth
    firebaseAuth = firebase.auth();
    console.log('Firebase Auth initialized successfully');
    
    // Set up the authentication UI and state listener
    setupAuthUI();
    
    // Log auth state for debugging
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User is signed in:', user.email);
      } else {
        console.log('No user is signed in');
      }
    });
    
    // Handle email link sign-in if we're on the login-complete page
    if (window.location.pathname.includes('login-complete.html')) {
      handleEmailSignIn();
    }
    
  } catch (error) {
    console.error('Error during auth initialization:', error);
  }
};

function setupAuthUI() {
  // Find all auth elements in the page
  const authStatusElement = document.getElementById('auth-status');
  const authToggle = document.getElementById('auth-toggle');
  const authForm = document.getElementById('auth-form');
  
  // Only proceed if the necessary elements are found
  if (!authStatusElement) {
    console.log('Auth status element not found in this page');
    return;
  }
  
  // Set up auth state listener
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
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
      
      // Re-capture the elements after they've been added to the DOM
      const newAuthToggle = document.getElementById('auth-toggle');
      const newAuthForm = document.getElementById('auth-form');
      const newAuthFormContent = document.getElementById('auth-form-content');
      
      if (newAuthToggle && newAuthForm) {
        // Toggle auth form visibility
        newAuthToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          newAuthForm.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
          if (newAuthForm && newAuthForm.classList.contains('active') && 
              !e.target.closest('.auth-container')) {
            newAuthForm.classList.remove('active');
          }
        });
      }
      
      // Handle form submission for email link login
      if (newAuthFormContent) {
        newAuthFormContent.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = e.target.email.value;

          try {
            console.log(`Sending sign-in link to: ${email}`);
            console.log('Action code settings:', actionCodeSettings);
            
            await firebaseAuth.sendSignInLinkToEmail(email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            alert('Check your email for the login link! (Check spam folder too)');
            
            if (newAuthForm) {
              newAuthForm.classList.remove('active');
            }
          } catch (error) {
            console.error('Error sending login link:', error);
            alert(`Error sending login link: ${error.message}`);
          }
        });
      }
    }
  });
}

function handleEmailSignIn() {
  console.log('Detected login-complete page, handling email sign-in');
  
  if (firebaseAuth.isSignInWithEmailLink(window.location.href)) {
    console.log('Valid sign-in link detected');
    
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
          
          // Redirect to home page after successful login
          window.location.href = window.location.origin + '/index.html';
        })
        .catch((error) => {
          console.error('Error signing in with email link:', error);
          document.getElementById('status-message').textContent = 
            `Error signing in: ${error.message}`;
        });
    } else {
      console.warn('No email provided, cannot complete sign-in');
    }
  } else {
    console.warn('Not a valid sign-in link:', window.location.href);
  }
}

export const signOut = () => {
  if (!firebaseAuth) {
    console.error('Firebase Auth not initialized');
    return Promise.reject(new Error('Firebase Auth not initialized'));
  }
  return firebaseAuth.signOut();
};