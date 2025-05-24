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
    // Ensure ShoppingCart class is correctly imported and instantiated.
    // The .initialize() method should return the instance if it's part of a fluent interface,
    // or just be called on the instance.
    const cartInstance = new ShoppingCart();
    window.shoppingCart = cartInstance.initialize(); // Assign the initialized cart to window
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
  
  // Initialize Firebase auth
  try {
    // initializeAuth (from auth.js) will handle Firebase SDK and app initialization checks internally.
    // With 'defer' on Firebase SDKs in HTML and this script running on DOMContentLoaded,
    // Firebase should be available.
    initializeAuth();
    // The console logs within initializeAuth will indicate the progress and success.
    console.log('Authentication initialization process started from index.js');
  } catch (error) {
    console.error('Error calling initializeAuth from index.js:', error);
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