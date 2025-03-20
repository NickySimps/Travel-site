// src/components/index.js
import { CONFIG } from './config.js';
import { initializeUI } from './main.js';
import { initializeAuth } from './auth.js';
import { initializeServices } from './services.js';
import { initializeBooking } from './booking.js';
import { initializeForms } from './forms.js';
import { initializeNavigation } from './navigation.js';
import { ShoppingCart } from './ShoppingCart.js';  // Import the ShoppingCart class instead

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing components...');
  
  // Wrap all initialization in a try/catch for better error handling
  try {
    // Initialize UI components first (base functionality)
    initializeUI();
    console.log('UI components initialized');
    
    // Initialize cart system before anything that depends on it
    try {
      window.usviCart = new ShoppingCart().initialize();  // Create and initialize cart instance
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
        console.log('Authentication initialized');
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
    
    // Initialize booking system (depends on cart)
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
    
    // Fix any remaining page refresh issues
    try {
      // Prevent all forms from submitting and refreshing the page
      document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => {
          console.log('Preventing form submission for:', form);
          e.preventDefault();
        });
      });
      
      // Fix any cart buttons that might cause page refreshes
      document.querySelectorAll('.cart-add-item, .btn-AddToCart, .cart-checkout, .cart-float').forEach(button => {
        button.addEventListener('click', e => {
          console.log('Preventing default action for cart button:', button);
          e.preventDefault();
          e.stopPropagation();
        });
      });
      
      console.log('Page refresh prevention applied');
    } catch (refreshError) {
      console.error('Error applying refresh prevention:', refreshError);
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