// src/components/index.js - Fixed version
import { CONFIG } from './config.js';
import { initializeUI } from './main.js';
import { initializeAuth } from './auth.js';
import { initializeServices } from './services.js';
import { initializeBooking } from './booking.js';
import { initializeForms } from './forms.js';
import { initializeNavigation } from './navigation.js';
import { ShoppingCart } from './ShoppingCart.js';

/**
 * Updates the Creative Retreat Application form's date field
 * based on relevant items found in the shopping cart.
 * @param {ShoppingCart} cartInstance - The initialized shopping cart instance.
 */
function updateCreativeRetreatFormDates(cartInstance) {
    const selectElement = document.getElementById('crRetreatDates');
    const displayElement = document.getElementById('crSelectedDatesFromCart');
    const hiddenInputElement = document.getElementById('crHiddenRetreatDates');

    if (!selectElement || !displayElement || !hiddenInputElement) {
        // console.warn('Creative retreat form date elements not found.');
        return;
    }

    let bookedRetreatDateValue = null;
    let bookedRetreatDateText = '';
    let retreatItemFound = false;
    const relevantPackageNames = ["artist-retreat", "external-host-retreat"];

    for (const item of cartInstance.items) {
        if (item.id && typeof item.id === 'string' && item.id.startsWith('booking_') &&
            item.name && relevantPackageNames.includes(item.name.toLowerCase())) {
            
            const parts = item.id.split('_'); 
            if (parts.length >= 4) { 
                const startDateStr = parts[parts.length - 2]; 
                const endDateStr = parts[parts.length - 1];   

                try {
                    const startDate = new Date(startDateStr.replace(/-/g, '/') + ' 00:00:00');
                    const endDate = new Date(endDateStr.replace(/-/g, '/') + ' 00:00:00');

                    if (!isNaN(startDate.valueOf()) && !isNaN(endDate.valueOf())) {
                        const year = startDate.getFullYear();
                        const monthAbbrev = startDate.toLocaleString('en-US', { month: 'short' }).toLowerCase();
                        const startDay = ('0' + startDate.getDate()).slice(-2);
                        const endDayOfMonth = ('0' + endDate.getDate()).slice(-2);
                        
                        const cartDateValue = `${year}-${monthAbbrev}-${startDay}-${endDayOfMonth}`;

                        for (const option of selectElement.options) {
                            if (option.value === cartDateValue) {
                                bookedRetreatDateValue = option.value;
                                bookedRetreatDateText = option.text; 
                                retreatItemFound = true;
                                break; 
                            }
                        }
                        if (retreatItemFound) break; 
                    }
                } catch (e) {
                    console.warn('Error parsing date from cart item ID:', item.id, e);
                }
            }
        }
    }

    if (retreatItemFound && bookedRetreatDateValue) {
        selectElement.style.display = 'none'; 
        selectElement.removeAttribute('name'); 
        selectElement.removeAttribute('required'); 
        hiddenInputElement.setAttribute('name', 'retreatDates'); 
        hiddenInputElement.value = bookedRetreatDateValue;
        displayElement.textContent = `Retreat Dates (selected with booking): ${bookedRetreatDateText}`;
        displayElement.style.display = 'block'; 
    } else {
        selectElement.style.display = 'block';
        selectElement.setAttribute('name', 'retreatDates');
        if (!selectElement.hasAttribute('required')) {
             selectElement.setAttribute('required', 'required');
        }
        selectElement.disabled = false; 
        displayElement.style.display = 'none';
        hiddenInputElement.removeAttribute('name'); 
        hiddenInputElement.value = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing components...');
  
  // Initialize UI components first (base functionality)
  try {
    initializeUI();
    console.log('UI components initialized');
  } catch (error) {
    console.error('Error initializing UI components:', error);
  }
  
  let cartInstanceForFormUpdate; // To pass to the form update function
  // Initialize cart system
  try {
    // Ensure ShoppingCart class is correctly imported and instantiated.
    // The .initialize() method should return the instance if it's part of a fluent interface,
    // or just be called on the instance.
    const cartInstance = new ShoppingCart();
    window.shoppingCart = cartInstance.initialize(); 
    cartInstanceForFormUpdate = window.shoppingCart; // Store for use after forms are initialized
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

      // Update creative retreat form dates after forms and cart are initialized
      if (document.getElementById('creativeRetreatForm') && cartInstanceForFormUpdate) {
        updateCreativeRetreatFormDates(cartInstanceForFormUpdate);
        console.log('Creative retreat form dates updated based on cart.');
      }
    }
  } catch (error) {
    console.error('Error initializing forms:', error);
  }
  
  console.log('All components initialized');
});