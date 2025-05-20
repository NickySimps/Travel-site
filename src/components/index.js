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
  
  // Initialize Firebase auth - IMPROVED
try {
  const attemptAuthInit = () => {
      // Check if firebase is globally available and the app is initialized
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
          console.log('Firebase is available, initializing auth');
          initializeAuth(); // No need to pass the initialized state, initializeAuth handles it
          console.log('Authentication initialized');
      } else {
          console.warn('Firebase scripts not loaded yet, retrying...');
          // Retry after a short delay if Firebase isn't ready
          setTimeout(attemptAuthInit, 500);
      }
  };
  // Start the first attempt
  attemptAuthInit();

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