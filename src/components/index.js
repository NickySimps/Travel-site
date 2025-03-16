// src/components/index.js
import { CONFIG } from './config.js';
import { initializeUI } from './main.js';
import { initializeAuth } from './auth.js';
import { initializeServices } from './services.js';
import { initializeBooking } from './booking.js';
import { initializeForms } from './forms.js';
import { initializeNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing components...');
  
  // Wrap all initialization in a try/catch for better error handling
  try {
    // Initialize UI components first (base functionality)
    initializeUI();
    
    // Initialize navigation features
    try {
      initializeNavigation();
      console.log('Navigation initialized');
    } catch (error) {
      console.error('Error initializing navigation:', error);
    }
    
    // Initialize Firebase auth with safety checks
    try {
      if (typeof firebase !== 'undefined') {
        // Check if Firebase is already initialized
        if (!firebase.apps.length) {
          console.log('Initializing Firebase for the first time');
          initializeAuth(false);
        } else {
          console.log('Firebase already initialized, using existing instance');
          initializeAuth(true);
        }
      } else {
        console.warn('Firebase not available, skipping auth initialization');
      }
    } catch (error) {
      console.error('Error initializing authentication:', error);
    }
    
    // Initialize other components with error handling
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
    
    // Snipcart initialization if needed
    try {
      if (document.querySelector('.snipcart-checkout') && window.SnipcartSettings === undefined) {
        console.log('Initializing Snipcart');
        window.SnipcartSettings = {
          publicApiKey: 'ZjFmOWZjNDUtM2VmMC00ZmExLTkzMTctMjExM2UzZDcwZjI3NjM4Njg4Nzc3OTMyNzM5MTQ3',
          loadStrategy: 'on-user-interaction',
          modalStyle: "side"
        };
        
        // Dynamically load Snipcart script
        const script = document.createElement('script');
        script.src = 'https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.js';
        document.body.appendChild(script);
      }
    } catch (error) {
      console.error('Error initializing cart:', error);
    }
    
    console.log('All components initialized');
  } catch (mainError) {
    console.error('Fatal error during initialization:', mainError);
  }
  
  // Add a global error handler for unhandled errors
  window.addEventListener('error', function(event) {
    console.error('Unhandled error:', event.error);
    // Optionally report to analytics
    return false;
  });
});