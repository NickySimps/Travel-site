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

// Add this to your p:\RenderCube\Documents\School\WebDev\Travel-site\src\components\index.js
// or a relevant UI script module that is imported.

document.addEventListener('DOMContentLoaded', () => {
    // --- Main "More Info" Button Logic (for .flavor-content) ---
    const moreInfoButtons = document.querySelectorAll('.btn-info[data-toggle="collapse"]');
    moreInfoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            if (!targetId) return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement || !targetElement.classList.contains('flavor-content')) return;

            const isActive = targetElement.classList.toggle('active');

            if (isActive) {
                // If becoming active, initialize inner collapsibles if not already
                if (!targetElement.dataset.collapsiblesInitialized) {
                    setupInnerCollapsibles(targetElement);
                }
                // Calculate and set max-height for the .flavor-content
                updateFlavorContentMaxHeight(targetElement);
            } else {
                targetElement.style.maxHeight = '0px';
                // When collapsing the main container, also collapse all inner sections
                const innerHeadings = targetElement.querySelectorAll('.collapsible-heading.active');
                innerHeadings.forEach(heading => {
                    heading.classList.remove('active');
                    const content = heading.nextElementSibling;
                    if (content && content.classList.contains('collapsible-content')) {
                        content.style.maxHeight = '0px';
                        content.style.paddingTop = '0px';
                        content.style.paddingBottom = '0px';
                        content.classList.remove('active');
                    }
                });
            }
            // Update button text
            this.textContent = isActive ? 'Less Info' : 'More Info';
        });
    });

    // --- Logic for Inner Collapsible Sections ---
    function setupInnerCollapsibles(flavorContentElement) {
        const headings = flavorContentElement.querySelectorAll('.collapsible-heading');
        headings.forEach(heading => {
            const content = heading.nextElementSibling;
            if (content && content.classList.contains('collapsible-content')) {
                // Initial state: collapsed
                content.style.maxHeight = '0px';
                content.style.paddingTop = '0px';
                content.style.paddingBottom = '0px';
                content.classList.remove('active'); // Visual state class
                heading.classList.remove('active'); // Visual state class for heading indicator

                heading.addEventListener('click', function() {
                    this.classList.toggle('active'); // Toggle heading's own active state
                    const currentContent = this.nextElementSibling;

                    if (currentContent.style.maxHeight && currentContent.style.maxHeight !== '0px') {
                        // Collapse
                        currentContent.style.maxHeight = '0px';
                        currentContent.style.paddingTop = '0px';
                        currentContent.style.paddingBottom = '0px';
                        currentContent.classList.remove('active');
                    } else {
                        // Expand inner content
                        // Set padding first, then measure scrollHeight
                        // Use CSS variables for padding if defined, otherwise fallback
                        const spaceSm = getComputedStyle(document.documentElement).getPropertyValue('--space-sm').trim() || '16px';
                        currentContent.style.paddingTop = spaceSm;
                        currentContent.style.paddingBottom = spaceSm;
                                                
                        // Force reflow to get correct scrollHeight after padding change
                        // Reading offsetHeight can trigger reflow.
                        // eslint-disable-next-line no-unused-expressions
                        currentContent.offsetHeight; 

                        currentContent.style.maxHeight = currentContent.scrollHeight + 'px';
                        currentContent.classList.add('active');
                    }
                    // After an inner collapsible changes, update the parent .flavor-content's max-height
                    updateFlavorContentMaxHeight(flavorContentElement);
                });
            }
        });
        flavorContentElement.dataset.collapsiblesInitialized = 'true';
    }

    function updateFlavorContentMaxHeight(flavorContentElement) {
        if (flavorContentElement.classList.contains('active')) {
            // To get the true scrollHeight, temporarily remove max-height constraint
            const originalMaxHeight = flavorContentElement.style.maxHeight;
            flavorContentElement.style.maxHeight = 'none'; // Allow it to expand to full content

            // Force browser to recalculate layout before reading scrollHeight
            // Reading offsetHeight is a common way to trigger this.
            // eslint-disable-next-line no-unused-expressions
            flavorContentElement.offsetHeight;

            // The scrollHeight will now reflect the actual height needed for its content,
            // including any expanded inner collapsibles.
            let calculatedHeight = flavorContentElement.scrollHeight;

            // Restore original max-height briefly or set to 0 if it was collapsed,
            // to ensure the CSS transition starts from the correct state.
            if (originalMaxHeight === '0px' || !originalMaxHeight) {
                flavorContentElement.style.maxHeight = '0px';
                // Force a reflow so the transition starts from 0
                // eslint-disable-next-line no-unused-expressions
                flavorContentElement.offsetHeight;
            }
            // No 'else' needed here; if it was already expanded, 
            // the transition will occur from its current visual height.
            
            flavorContentElement.style.maxHeight = calculatedHeight + 'px';
        } else {
             flavorContentElement.style.maxHeight = '0px';
    }
    }

    // Initialize for any .flavor-content that might be active on page load (e.g., in footer)
    // This is less common for the main package ones but good for robustness.
    document.querySelectorAll('.flavor-content.active').forEach(activeFlavorContent => {
        if (!activeFlavorContent.dataset.collapsiblesInitialized) {
            setupInnerCollapsibles(activeFlavorContent);
        }
        updateFlavorContentMaxHeight(activeFlavorContent);
    });

});

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