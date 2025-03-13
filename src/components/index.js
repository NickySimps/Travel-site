import { CONFIG } from './config.js';
import { initializeUI } from './main.js';
import { initializeAuth } from './auth.js';
import { initializeServices } from './services.js';
import { initializeBooking } from './booking.js';
import { initializeForms } from './forms.js';
import { initializeServiceBooking } from './service-booking.js';
import { initializeNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing components...');
  
  // Initialize UI components first (base functionality)
  initializeUI();
  
  // Initialize navigation features
  initializeNavigation();
  
  // Initialize auth after UI is ready
  try {
    initializeAuth();
  } catch (error) {
    console.error('Error initializing authentication:', error);
  }
  
  // Initialize the rest of the components with error handling
  try {
    initializeServices();
  } catch (error) {
    console.error('Error initializing services:', error);
  }
  
  try {
    initializeBooking();
  } catch (error) {
    console.error('Error initializing booking:', error);
  }
  
  try {
    initializeForms();
  } catch (error) {
    console.error('Error initializing forms:', error);
  }
  
  try {
    initializeServiceBooking();
  } catch (error) {
    console.error('Error initializing service booking:', error);
  }
  
  console.log('All components initialized');
});