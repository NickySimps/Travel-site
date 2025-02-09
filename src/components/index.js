import { CONFIG } from './config.js';
import { initializeUI } from './main.js';
import { initializeAuth } from './auth.js';
import { initializeServices } from './services.js';
import { initializeBooking } from './booking.js';
import { initializeForms } from './forms.js';
import { initializeServiceBooking } from './service-booking.js';
import { initializeNavigation } from './navigation.js';
import { initializeCart } from './ShoppingCart.js';


document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
  initializeAuth();
  initializeServices();
  initializeBooking();
  initializeForms();
  initializeNavigation();
  initializeServiceBooking();
  initializeCart();
});