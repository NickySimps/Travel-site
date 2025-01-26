import { CONFIG } from './config.js';
import { initializeUI } from './main.js';
import { initializeAuth } from './auth.js';
import { initializeServices } from './services.js';
import { initializeForms } from './forms.js';
import { initializeSnipcart } from './ShoppingCart.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
  initializeAuth();
  initializeServices();
  initializeForms();
  initializeSnipcart
});