// src/components/index.js - Fixed version
import { CONFIG } from './config.js';
import { initializeUI } from './main.js';
import { initializeAuth } from './auth.js';
import { initializeServices } from './services.js';
import { initializeBooking } from './booking.js';
import { initializeForms } from './forms.js';
import { initializeNavigation } from './navigation.js';
import { ShoppingCart } from './ShoppingCart.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing components...');
  
  // Initialize UI components first (base functionality)
  try {
    initializeUI();
    console.log('UI components initialized');
  } catch (error) {
    console.error('Error initializing UI components:', error);
  }
  
  // Initialize cart system
  try {
    window.usviCart = new ShoppingCart().initialize();
    console.log('Shopping cart initialized');
  } catch (error) {
    console.error('Error initializing shopping cart:', error);
  }
  
  // Initialize navigation features
  try {
    initializeNavigation();
    console.log('Navigation initialized');
  } catch (error) {
    console.error('Error initializing navigation:', error);
  }
  
  // Initialize Firebase auth - FIXED
  try {
    // Wait 500ms to ensure Firebase scripts have loaded
    setTimeout(() => {
      if (typeof firebase !== 'undefined') {
        // Check if Firebase is already initialized
        console.log('Firebase is available, initializing auth');
        initializeAuth(firebase.apps.length > 0);
        console.log('Authentication initialized');
      } else {
        console.warn('Firebase scripts not loaded, auth will not function!');
        // Try to add Firebase scripts dynamically as fallback
        addFirebaseScripts();
      }
    }, 500);
  } catch (error) {
    console.error('Error initializing authentication:', error);
  }
  
  // Initialize other components
  try {
    if (typeof initializeServices === 'function') {
      initializeServices();
      console.log('Services initialized');
    }
  } catch (error) {
    console.error('Error initializing services:', error);
  }
  
  try {
    if (typeof initializeBooking === 'function') {
      initializeBooking();
      console.log('Booking system initialized');
    }
  } catch (error) {
    console.error('Error initializing booking:', error);
  }
  
  try {
    if (typeof initializeForms === 'function') {
      initializeForms();
      console.log('Forms initialized');
    }
  } catch (error) {
    console.error('Error initializing forms:', error);
  }
  
  console.log('All components initialized');
});

// Function to dynamically add Firebase scripts if they're missing
function addFirebaseScripts() {
  const scripts = [
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics-compat.js'
  ];
  
  let scriptsLoaded = 0;
  
  scripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    script.onload = () => {
      scriptsLoaded++;
      console.log(`Firebase script loaded: ${src}`);
      
      // Once all scripts are loaded, try initializing auth again
      if (scriptsLoaded === scripts.length) {
        console.log('All Firebase scripts loaded, initializing auth');
        setTimeout(() => {
          initializeAuth(false);
        }, 500);
      }
    };
    
    script.onerror = () => {
      console.error(`Failed to load Firebase script: ${src}`);
    };
    
    document.head.appendChild(script);
  });
}